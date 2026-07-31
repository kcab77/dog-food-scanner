/**
 * Expert Knowledge Platform — Step 2: ingestion CLI
 * ---------------------------------------------------------------------------
 * Chunk (~500 tokens, 50 overlap) -> embed (Voyage voyage-3) -> upsert into
 * Supabase (sources + chunks). Idempotent per (expert, url).
 *
 * Usage:
 *   tsx scripts/ingest.ts --expert <slug> --folder ./docs        (.txt .md .html .pdf)
 *   tsx scripts/ingest.ts --expert <slug> --sitemap https://site.com/sitemap.xml
 *   tsx scripts/ingest.ts --expert <slug> --youtube <channelId|@handle>
 *   tsx scripts/ingest.ts --expert <slug> --urls ./pages.txt   (one URL per line)
 *
 * Flags:
 *   --type <book|video|post>   default source type for folder/sitemap (default: post)
 *   --reingest                 re-process even if the url was ingested before
 *   --limit <n>                cap number of documents (useful for a test run)
 *   --dry                      chunk + count only; no embedding, no DB writes
 *
 * Env (see .env.example):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (service role: server-side only)
 *   VOYAGE_API_KEY
 *   YOUTUBE_API_KEY                           (only for --youtube)
 * ---------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ---- config -----------------------------------------------------------------
const EMBED_MODEL = 'voyage-3'
const EMBED_DIM = 1024
const TARGET_TOKENS = 500
const OVERLAP_TOKENS = 50
const EMBED_BATCH = 96 // Voyage per-request cap is generous; stay well under
const CHARS_PER_TOKEN = 4 // heuristic; swap for a real tokenizer if needed
const YT_LANG = process.env.YT_LANG ?? 'en' // caption track language; see loadYouTube

// ---- tiny arg parser --------------------------------------------------------
type Args = Record<string, string | boolean>
function parseArgs(argv: string[]): Args {
  const out: Args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next && !next.startsWith('--')) {
      out[key] = next
      i++
    } else {
      out[key] = true
    }
  }
  return out
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    console.error(`Missing required env var: ${name}`)
    process.exit(1)
  }
  return v
}

// ---- token estimate + chunking ---------------------------------------------
const estimateTokens = (text: string) => Math.ceil(text.length / CHARS_PER_TOKEN)

/**
 * Split into ~TARGET_TOKENS windows with ~OVERLAP_TOKENS overlap, preferring
 * paragraph then sentence boundaries so chunks don't cut mid-thought.
 */
function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  if (!clean) return []

  // Break into atomic units (paragraphs, then over-long paragraphs into sentences).
  const units: string[] = []
  for (const para of clean.split(/\n\n+/)) {
    if (estimateTokens(para) <= TARGET_TOKENS) {
      units.push(para.trim())
    } else {
      let buf = ''
      for (const sent of para.split(/(?<=[.!?])\s+/)) {
        if (estimateTokens(buf + ' ' + sent) > TARGET_TOKENS && buf) {
          units.push(buf.trim())
          buf = sent
        } else {
          buf = buf ? `${buf} ${sent}` : sent
        }
      }
      if (buf.trim()) units.push(buf.trim())
    }
  }

  // Greedily pack units into chunks, then carry an overlap tail into the next.
  const chunks: string[] = []
  let cur: string[] = []
  let curTokens = 0
  const flush = () => {
    if (!cur.length) return
    const joined = cur.join('\n\n').trim()
    if (joined) chunks.push(joined)
  }
  for (const u of units) {
    const t = estimateTokens(u)
    if (curTokens + t > TARGET_TOKENS && cur.length) {
      flush()
      // build overlap tail from the end of the current chunk
      const tail: string[] = []
      let tailTokens = 0
      for (let i = cur.length - 1; i >= 0; i--) {
        const tt = estimateTokens(cur[i])
        if (tailTokens + tt > OVERLAP_TOKENS) break
        tail.unshift(cur[i])
        tailTokens += tt
      }
      cur = [...tail, u]
      curTokens = tailTokens + t
    } else {
      cur.push(u)
      curTokens += t
    }
  }
  flush()
  return chunks
}

// ---- HTML -> text (lightweight; swap for Readability for higher quality) ----
function htmlToText(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = (titleMatch?.[1] || h1Match?.[1] || '').replace(/<[^>]+>/g, '').trim()
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
  return { title, text }
}

// ---- document loaders -------------------------------------------------------
type Doc = { type: 'book' | 'video' | 'post'; title: string; url: string | null; text: string }

/**
 * Extract text from a PDF. Books/PDFs are the highest-signal source an expert has
 * (edited and authoritative), so this matters more than volume from other sources.
 *
 * Returns null for scanned PDFs: those are page images with no text layer, and
 * silently ingesting a handful of garbage characters from a 300-page book would
 * quietly poison the knowledge base. Better to skip loudly and tell the user OCR
 * is needed.
 */
async function pdfToText(path: string): Promise<{ title: string; text: string } | null> {
  // pdf.js (inside unpdf) calls Math.sumPrecise, a newer JS proposal missing on
  // current Node. Without this it logs a warning per page and falls back to less
  // accurate layout math. Plain summation is fine for text extraction.
  const M = Math as unknown as { sumPrecise?: (nums: Iterable<number>) => number }
  if (typeof M.sumPrecise !== 'function') {
    M.sumPrecise = (nums) => { let s = 0; for (const n of nums) s += n; return s }
  }

  const { getDocumentProxy, extractText } = await import('unpdf').catch(() => {
    throw new Error('PDF ingest needs the `unpdf` package: npm i unpdf')
  })
  const buf = new Uint8Array(readFileSync(path))
  const pdf = await getDocumentProxy(buf)
  const { text, totalPages } = await extractText(pdf, { mergePages: true })
  const clean = String(text)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    // Rejoin words split across line breaks by PDF layout ("nutri-\ntion").
    .replace(/(\w)-\n(\w)/g, '$1$2')
    .trim()

  const perPage = clean.length / Math.max(totalPages, 1)
  if (perPage < 120) {
    console.warn(
      `  · SKIPPED (looks scanned): ${basename(path)} — ${totalPages} pages but only ` +
      `${clean.length} chars of text. Needs OCR before it can be ingested.`,
    )
    return null
  }

  // Prefer the PDF's own metadata title; fall back to the filename.
  let title = ''
  try {
    const meta = await pdf.getMetadata()
    title = String((meta?.info as { Title?: string })?.Title ?? '').trim()
  } catch { /* metadata is optional */ }

  console.log(`  · ${basename(path)} — ${totalPages} pages, ~${estimateTokens(clean).toLocaleString()} tokens`)
  return { title: title || basename(path, '.pdf'), text: clean }
}

async function loadFolder(dir: string, defaultType: Doc['type']): Promise<Doc[]> {
  const docs: Doc[] = []
  const files: string[] = []
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const p = join(d, entry)
      if (statSync(p).isDirectory()) walk(p)
      else files.push(p)
    }
  }
  walk(dir)

  for (const p of files) {
    const ext = extname(p).toLowerCase()
    if (!['.txt', '.md', '.markdown', '.html', '.htm', '.pdf'].includes(ext)) continue

    if (ext === '.pdf') {
      try {
        const res = await pdfToText(p)
        if (res) docs.push({ type: defaultType, title: res.title, url: null, text: res.text })
      } catch (e) {
        console.warn(`  · failed to read ${basename(p)}: ${(e as Error).message}`)
      }
      continue
    }

    const raw = readFileSync(p, 'utf-8')
    if (ext === '.html' || ext === '.htm') {
      const { title, text } = htmlToText(raw)
      docs.push({ type: defaultType, title: title || basename(p), url: null, text })
    } else {
      const firstHeading = raw.match(/^#\s+(.+)$/m)?.[1]?.trim()
      docs.push({ type: defaultType, title: firstHeading || basename(p), url: null, text: raw })
    }
  }
  return docs
}

// Fetch a fixed set of page URLs and extract readable text. Shared by --urls
// (an explicit list, one per line) and --sitemap (URLs pulled from a sitemap).
async function loadPageUrls(urls: string[], defaultType: Doc['type']): Promise<Doc[]> {
  const docs: Doc[] = []
  const fetchDelay = Number(process.env.FETCH_DELAY_MS ?? '800') // be polite; avoid site rate-limits
  for (const url of urls) {
    try {
      if (docs.length > 0 || urls.indexOf(url) > 0) await new Promise((r) => setTimeout(r, fetchDelay))
      const res = await fetch(url, { headers: { 'User-Agent': 'ExpertPlatformBot/0.1' } })
      if (!res.ok) {
        console.warn(`  · skipped (HTTP ${res.status}): ${url}`)
        continue
      }
      const html = await res.text()
      const { title, text } = htmlToText(html)
      if (/404|not found|page not found/i.test(title)) {
        console.warn(`  · skipped (looks like a 404 page): ${url}`)
        continue
      }
      if (text.length > 200) docs.push({ type: defaultType, title: title || url, url, text })
      else console.warn(`  · skipped (too little text): ${url}`)
    } catch (e) {
      console.warn(`  · failed to fetch ${url}: ${(e as Error).message}`)
    }
  }
  return docs
}

function loadUrlFile(path: string, defaultType: Doc['type']): Promise<Doc[]> {
  const urls = readFileSync(path, 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  return loadPageUrls(urls, defaultType)
}

async function loadSitemap(sitemapUrl: string, defaultType: Doc['type'], limit?: number): Promise<Doc[]> {
  const xml = await (await fetch(sitemapUrl)).text()
  let urls = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)).map((m) => m[1])
  if (limit) urls = urls.slice(0, limit)
  return loadPageUrls(urls, defaultType)
}

/**
 * YouTube channel -> videos + transcripts.
 * Requires YOUTUBE_API_KEY (Data API v3) to resolve a channel's uploads, and the
 * `youtube-transcript` package for captions (dynamically imported so folder/
 * sitemap runs don't need it installed).
 */
async function loadYouTube(channel: string, apiKey: string, limit?: number): Promise<Doc[]> {
  const api = 'https://www.googleapis.com/youtube/v3'

  // Resolve channel -> uploads playlist id
  let channelId = channel
  if (channel.startsWith('@')) {
    const r = await (await fetch(`${api}/channels?part=contentDetails&forHandle=${encodeURIComponent(channel)}&key=${apiKey}`)).json()
    channelId = r.items?.[0]?.id
  }
  const chRes = await (await fetch(`${api}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`)).json()
  const uploads = chRes.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error(`Could not resolve uploads playlist for channel "${channel}"`)

  // Page through uploads playlist -> video ids + titles
  const videos: { id: string; title: string }[] = []
  let pageToken = ''
  do {
    const url = `${api}/playlistItems?part=snippet&maxResults=50&playlistId=${uploads}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const page = await (await fetch(url)).json()
    for (const it of page.items ?? []) {
      videos.push({ id: it.snippet.resourceId.videoId, title: it.snippet.title })
    }
    pageToken = page.nextPageToken ?? ''
    if (limit && videos.length >= limit) break
  } while (pageToken)

  const capped = limit ? videos.slice(0, limit) : videos

  // Fetch transcripts
  const { YoutubeTranscript } = await import('youtube-transcript').catch(() => {
    throw new Error('YouTube ingest needs the `youtube-transcript` package: npm i youtube-transcript')
  })
  const docs: Doc[] = []
  for (const v of capped) {
    try {
      // Pin the language. Without this YouTube serves whatever track it likes —
      // verified in testing: a request with no lang returned an Arabic
      // translation, which would silently poison an English knowledge base.
      let segments
      try {
        segments = await YoutubeTranscript.fetchTranscript(v.id, { lang: YT_LANG })
      } catch {
        segments = await YoutubeTranscript.fetchTranscript(v.id) // fall back to default track
      }
      const text = cleanTranscript(segments.map((s: { text: string }) => s.text).join(' '))
      if (text.length > 200) {
        docs.push({ type: 'video', title: v.title, url: `https://youtube.com/watch?v=${v.id}`, text })
      } else {
        console.warn(`  · no usable transcript: ${v.title}`)
      }
    } catch {
      console.warn(`  · no captions available: ${v.title}`)
    }
  }
  return docs
}

/**
 * Captions are not prose. They arrive wrapped mid-sentence, peppered with
 * non-speech annotations ([Music], [Applause], ♪) and doubled spaces. Left raw,
 * that noise gets embedded and competes with real content at retrieval time —
 * which is the main reason video is a lower-quality source than a book.
 */
function cleanTranscript(raw: string): string {
  return raw
    .replace(/\[[^\]]{0,40}\]/g, ' ')      // [Music], [Applause], [Laughter]
    .replace(/\([^)]{0,30}\)/g, ' ')       // (upbeat music)
    .replace(/[♪♫]/g, ' ')
    .replace(/&amp;#39;/g, "'").replace(/&amp;quot;/g, '"').replace(/&amp;amp;/g, '&')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/\s*\n\s*/g, ' ')             // caption line wraps split sentences
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ---- embeddings (Voyage) ----------------------------------------------------
// Proactive throttle + 429 backoff. Voyage's free tier is 3 requests/min; set
// VOYAGE_MIN_INTERVAL_MS lower (e.g. 0) once a payment method unlocks standard limits.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const MIN_INTERVAL = Number(process.env.VOYAGE_MIN_INTERVAL_MS ?? '21000')
let lastEmbedAt = 0

async function embedBatch(texts: string[], apiKey: string, attempt = 0): Promise<number[][]> {
  const since = Date.now() - lastEmbedAt
  if (since < MIN_INTERVAL) await sleep(MIN_INTERVAL - since)
  lastEmbedAt = Date.now()

  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts, input_type: 'document' }),
  })
  if (res.status === 429 && attempt < 6) {
    console.warn(`  · rate limited by Voyage, waiting ${MIN_INTERVAL / 1000}s (retry ${attempt + 1})…`)
    await sleep(MIN_INTERVAL)
    return embedBatch(texts, apiKey, attempt + 1)
  }
  if (!res.ok) throw new Error(`Voyage embed failed (${res.status}): ${await res.text()}`)
  const data = await res.json()
  const out = data.data.map((d: { embedding: number[] }) => d.embedding)
  if (out[0]?.length !== EMBED_DIM) {
    throw new Error(`Embedding dim ${out[0]?.length} != expected ${EMBED_DIM}. Update the schema's vector() size or EMBED_MODEL.`)
  }
  return out
}

// ---- persistence ------------------------------------------------------------
async function getExpertId(sb: SupabaseClient, slug: string): Promise<string> {
  const { data, error } = await sb.from('experts').select('id').eq('slug', slug).single()
  if (error || !data) {
    console.error(`No expert with slug "${slug}". Create the expert row first.`)
    process.exit(1)
  }
  return data.id
}

async function alreadyIngested(sb: SupabaseClient, expertId: string, url: string | null): Promise<boolean> {
  if (!url) return false
  const { data } = await sb.from('sources').select('id').eq('expert_id', expertId).eq('url', url).maybeSingle()
  return !!data
}

async function ingestDoc(sb: SupabaseClient, expertId: string, doc: Doc, voyageKey: string, dry: boolean) {
  const chunks = chunkText(doc.text)
  if (!chunks.length) {
    console.warn(`  · no chunks produced: ${doc.title}`)
    return { chunks: 0, embedTokens: 0 }
  }
  if (dry) {
    const tokens = chunks.reduce((n, c) => n + estimateTokens(c), 0)
    console.log(`  · [dry] ${doc.title} -> ${chunks.length} chunks (~${tokens} tok)`)
    return { chunks: chunks.length, embedTokens: tokens }
  }

  // 1) Embed EVERYTHING first — before writing anything to the DB. If embedding
  // fails (e.g. rate limit), we throw here having created no rows, so the doc is
  // cleanly retryable next run instead of leaving an empty source behind.
  const vectors: number[][] = []
  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH)
    vectors.push(...(await embedBatch(batch, voyageKey)))
  }

  // 2) Only now create the source row (idempotent on expert_id+url).
  const { data: source, error: srcErr } = await sb
    .from('sources')
    .insert({ expert_id: expertId, type: doc.type, title: doc.title, url: doc.url })
    .select('id')
    .single()
  if (srcErr || !source) throw new Error(`source insert failed: ${srcErr?.message}`)

  // 3) Insert all chunks with their embeddings.
  const rows = chunks.map((content, j) => ({
    source_id: source.id,
    expert_id: expertId,
    content,
    embedding: vectors[j],
    token_count: estimateTokens(content),
    chunk_index: j,
  }))
  const { error: chErr } = await sb.from('chunks').insert(rows)
  if (chErr) {
    // Roll back the orphan source so the doc stays retryable.
    await sb.from('sources').delete().eq('id', source.id)
    throw new Error(`chunk insert failed: ${chErr.message}`)
  }
  const embedTokens = rows.reduce((n, r) => n + (r.token_count ?? 0), 0)
  console.log(`  · ${doc.title} -> ${rows.length} chunks`)
  return { chunks: rows.length, embedTokens }
}

// ---- main -------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2))
  const slug = args.expert as string
  if (!slug) {
    console.error('Required: --expert <slug>')
    process.exit(1)
  }
  const dry = !!args.dry
  const defaultType = (args.type as Doc['type']) || 'post'
  const limit = args.limit ? parseInt(args.limit as string, 10) : undefined
  const reingest = !!args.reingest

  const supabaseUrl = requireEnv('SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  const voyageKey = dry ? '' : requireEnv('VOYAGE_API_KEY')
  const sb = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const expertId = await getExpertId(sb, slug)

  // Load documents from whichever source was requested
  let docs: Doc[] = []
  if (args.folder) {
    console.log(`Loading folder: ${args.folder}`)
    docs = await loadFolder(args.folder as string, defaultType)
  } else if (args.urls) {
    console.log(`Loading URL list: ${args.urls}`)
    docs = await loadUrlFile(args.urls as string, defaultType)
  } else if (args.sitemap) {
    console.log(`Loading sitemap: ${args.sitemap}`)
    docs = await loadSitemap(args.sitemap as string, defaultType, limit)
  } else if (args.youtube) {
    console.log(`Loading YouTube channel: ${args.youtube}`)
    docs = await loadYouTube(args.youtube as string, requireEnv('YOUTUBE_API_KEY'), limit)
  } else {
    console.error('Provide one source: --folder <path> | --urls <file> | --sitemap <url> | --youtube <channel>')
    process.exit(1)
  }
  if (limit) docs = docs.slice(0, limit)
  console.log(`Found ${docs.length} document(s) for expert "${slug}"\n`)

  // Ingest
  let totalChunks = 0
  let totalEmbedTokens = 0
  let skipped = 0
  for (const doc of docs) {
    if (!reingest && (await alreadyIngested(sb, expertId, doc.url))) {
      console.log(`  · skip (already ingested): ${doc.title}`)
      skipped++
      continue
    }
    try {
      const r = await ingestDoc(sb, expertId, doc, voyageKey, dry)
      totalChunks += r.chunks
      totalEmbedTokens += r.embedTokens
    } catch (e) {
      console.error(`  ✗ ${doc.title}: ${(e as Error).message}`)
    }
  }

  // Record usage (skip in dry runs)
  if (!dry && totalEmbedTokens > 0) {
    await sb.from('usage_events').insert({ expert_id: expertId, kind: 'embed', embed_tokens: totalEmbedTokens })
  }

  console.log(
    `\nDone. ${totalChunks} chunks from ${docs.length - skipped} doc(s)` +
      (skipped ? `, ${skipped} skipped` : '') +
      `. ~${totalEmbedTokens} embed tokens${dry ? ' (dry run — nothing written)' : ''}.`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
