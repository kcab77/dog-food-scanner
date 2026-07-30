/**
 * compile-wiki.ts — the LLM Wiki layer for an expert's knowledge base.
 *
 * WHY THIS EXISTS
 * Plain RAG retrieves FRAGMENTS. A 40-minute YouTube transcript becomes ~20 chunks
 * of conversational rambling; a question spanning 30 videos has to get lucky and
 * find the right scattered pieces. This script compiles the expert's whole corpus
 * into dense, deduplicated TOPIC PAGES — one page per subject, synthesized from
 * every source that touches it — so a single retrieval gets the whole picture.
 *
 * HYBRID BY DESIGN (important):
 * Compiled pages are the LLM's paraphrase, so they are NOT a replacement for the
 * raw material. Raw chunks stay in the index as ground truth; compiled pages add
 * retrieval breadth; and every compiled page records `metadata.derived_from` so
 * citations always resolve back to the expert's real video/article.
 *
 * Usage:
 *   tsx scripts/compile-wiki.ts --expert dr-judy-morgan [--dry] [--topics 12]
 *
 * Idempotent: deletes the expert's previous compiled pages first, so a recompile
 * is clean and compiled pages can never feed back into their own compilation.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { embed } from '../lib/embed'

const MODEL = 'claude-sonnet-5'
const TARGET_TOKENS = 500
const CHARS_PER_TOKEN = 4
const CHUNKS_PER_TOPIC = 24 // raw chunks fed to the LLM when writing one page
const VOYAGE_INTERVAL = Number(process.env.VOYAGE_MIN_INTERVAL_MS ?? '21000')

const estimateTokens = (t: string) => Math.ceil(t.length / CHARS_PER_TOKEN)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) out[key] = true
    else { out[key] = next; i++ }
  }
  return out
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

// Same paragraph-then-sentence chunking as ingest.ts, kept simple.
function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  if (!clean) return []
  const units: string[] = []
  for (const para of clean.split(/\n\n+/)) {
    if (estimateTokens(para) <= TARGET_TOKENS) units.push(para.trim())
    else {
      let buf = ''
      for (const sent of para.split(/(?<=[.!?])\s+/)) {
        if (estimateTokens(`${buf} ${sent}`) > TARGET_TOKENS && buf) { units.push(buf.trim()); buf = sent }
        else buf = buf ? `${buf} ${sent}` : sent
      }
      if (buf.trim()) units.push(buf.trim())
    }
  }
  const chunks: string[] = []
  let buf = ''
  for (const u of units) {
    if (estimateTokens(`${buf}\n\n${u}`) > TARGET_TOKENS && buf) { chunks.push(buf.trim()); buf = u }
    else buf = buf ? `${buf}\n\n${u}` : u
  }
  if (buf.trim()) chunks.push(buf.trim())
  return chunks
}

type RawChunk = { id: string; source_id: string; content: string; title: string; url: string | null; type: string }

/** Pass 1 — derive the topic list from what the corpus actually contains. */
async function deriveTopics(
  anthropic: Anthropic,
  expertName: string,
  sources: { title: string; type: string }[],
  maxTopics: number,
): Promise<string[]> {
  const list = sources.map((s) => `- [${s.type}] ${s.title}`).join('\n')
  const res = await anthropic.messages.create({
    model: MODEL,
    // NOTE: extended-thinking tokens count against max_tokens. Budget generously or
    // the model can spend the whole allowance thinking and return an EMPTY text block.
    max_tokens: 4000,
    system:
      `You are organizing ${expertName}'s published work into a knowledge wiki. Given their source titles, ` +
      `identify the distinct SUBSTANTIVE topics their audience would ask about. Rules: ` +
      `merge near-duplicates into one topic; skip non-topical items (announcements, news, personal updates); ` +
      `prefer the phrasing an owner would actually use. Output ONLY a plain list, one topic per line, no numbering, no commentary.`,
    messages: [{ role: 'user', content: `Sources:\n${list}\n\nGive at most ${maxTopics} topics, one per line:` }],
  })
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('')
    .split('\n')
    .map((l) => l.replace(/^[-*\d.\s]+/, '').trim())
    .filter((l) => l.length > 2)
    .slice(0, maxTopics)
}

/** Pass 2 — write one dense topic page, grounded ONLY in the supplied raw chunks. */
async function writeTopicPage(
  anthropic: Anthropic,
  expertName: string,
  personaPrompt: string,
  topic: string,
  chunks: RawChunk[],
): Promise<string | null> {
  const context = chunks
    .map((c, i) => `[${i + 1}] from "${c.title}" (${c.type})\n${c.content}`)
    .join('\n\n---\n\n')

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000, // generous: thinking tokens share this budget (see note above)
    system:
      `You are compiling a knowledge-wiki page on "${topic}" from ${expertName}'s own published work.\n\n` +
      `${personaPrompt}\n\n` +
      `ABSOLUTE RULES:\n` +
      `- Use ONLY the numbered excerpts provided. Never add outside knowledge, studies, doses, or product names.\n` +
      `- Synthesize: merge what they said across sources, deduplicate, and organize it. Do not just concatenate.\n` +
      `- Preserve their actual positions, nuances, and caveats. Keep their voice and terminology.\n` +
      `- If sources disagree or a view appears to have evolved, say so explicitly under "## Where sources differ".\n` +
      `- If the excerpts genuinely don't cover this topic in any substance, reply with exactly: SKIP\n` +
      `- Write clean markdown. Start with a one-paragraph summary of their overall position, then organized detail.\n` +
      `- Do NOT invent a conclusion they didn't state. Where their material is thin, say it's thin.`,
    messages: [{ role: 'user', content: `EXCERPTS:\n\n${context}\n\nCompile the page on "${topic}":` }],
  })
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim()
  if (!text || /^SKIP\b/i.test(text)) return null
  return text
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const slug = String(args.expert ?? '')
  const dry = Boolean(args.dry)
  const maxTopics = Number(args.topics ?? 14)
  if (!slug) { console.error('Usage: tsx scripts/compile-wiki.ts --expert <slug> [--dry] [--topics N]'); process.exit(1) }

  const sb: SupabaseClient = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  })
  const anthropic = new Anthropic({ apiKey: requireEnv('ANTHROPIC_KEY') })

  const { data: expert } = await sb
    .from('experts').select('id, name, slug, persona_prompt').eq('slug', slug).single()
  if (!expert) throw new Error(`No expert with slug "${slug}"`)
  console.log(`\nCompiling wiki for ${expert.name}\n`)

  // 1) Clean slate: drop prior compiled pages so they can't feed their own recompile.
  if (!dry) {
    const { data: old } = await sb.from('sources').select('id').eq('expert_id', expert.id).eq('type', 'wiki')
    if (old?.length) {
      await sb.from('sources').delete().eq('expert_id', expert.id).eq('type', 'wiki')
      console.log(`  cleared ${old.length} previously compiled page(s)`)
    }
  }

  // 2) Load the RAW corpus (everything that isn't a compiled page).
  const { data: rawSources } = await sb
    .from('sources').select('id, title, url, type').eq('expert_id', expert.id).neq('type', 'wiki')
  if (!rawSources?.length) throw new Error('No raw sources — ingest content first.')

  const byId = new Map(rawSources.map((s) => [s.id, s]))
  const { data: rawChunks } = await sb
    .from('chunks').select('id, source_id, content').eq('expert_id', expert.id)
  const corpus: RawChunk[] = (rawChunks ?? [])
    .filter((c) => byId.has(c.source_id))
    .map((c) => {
      const s = byId.get(c.source_id)!
      return { id: c.id, source_id: c.source_id, content: c.content, title: s.title, url: s.url, type: s.type }
    })
  console.log(`  corpus: ${rawSources.length} sources, ${corpus.length} chunks`)

  // 3) Derive topics.
  const topics = await deriveTopics(anthropic, expert.name, rawSources, maxTopics)
  console.log(`  topics (${topics.length}):`)
  topics.forEach((t) => console.log(`    · ${t}`))
  if (dry) { console.log('\n[dry] stopping before writing pages.\n'); return }

  // 4) Compile each topic page from its most relevant raw chunks.
  let written = 0, skipped = 0
  for (const topic of topics) {
    // Semantic selection of the raw chunks for this topic.
    const [tvec] = await embed([topic], 'query')
    const { data: hits } = await sb.rpc('match_chunks', {
      p_expert: expert.id,
      query_embedding: tvec,
      match_count: CHUNKS_PER_TOPIC,
      similarity_threshold: 0.30, // wide net; the LLM decides what's actually on-topic
    })
    const ids = new Set(((hits ?? []) as { id: string }[]).map((h) => h.id))
    const selected = corpus.filter((c) => ids.has(c.id))
    if (selected.length < 2) { console.log(`  ⊘ ${topic} — too little material`); skipped++; continue }

    const page = await writeTopicPage(anthropic, expert.name, expert.persona_prompt, topic, selected)
    if (!page) { console.log(`  ⊘ ${topic} — model returned SKIP`); skipped++; continue }

    const derivedFrom = Array.from(new Set(selected.map((c) => c.source_id)))
    const { data: src, error: srcErr } = await sb
      .from('sources')
      .insert({
        expert_id: expert.id,
        type: 'wiki',
        title: topic,
        url: null,
        metadata: { kind: 'topic', topic, derived_from: derivedFrom, compiled_at: new Date().toISOString() },
      })
      .select('id').single()
    if (srcErr || !src) { console.error(`  ✗ ${topic}: ${srcErr?.message}`); continue }

    // Chunk + embed the compiled page so it's retrievable.
    const pieces = chunkText(page)
    const vectors: number[][] = []
    for (const p of pieces) {
      vectors.push((await embed([p], 'document'))[0])
      await sleep(VOYAGE_INTERVAL)
    }
    const { error: chErr } = await sb.from('chunks').insert(
      pieces.map((content, i) => ({
        source_id: src.id, expert_id: expert.id, content,
        embedding: vectors[i], token_count: estimateTokens(content), chunk_index: i,
      })),
    )
    if (chErr) { console.error(`  ✗ ${topic} chunks: ${chErr.message}`); await sb.from('sources').delete().eq('id', src.id); continue }

    console.log(`  ✓ ${topic} — ${pieces.length} chunks from ${derivedFrom.length} sources`)
    written++
  }

  console.log(`\nDone. ${written} page(s) compiled, ${skipped} skipped.\n`)
}

main().catch((e) => { console.error(e); process.exit(1) })
