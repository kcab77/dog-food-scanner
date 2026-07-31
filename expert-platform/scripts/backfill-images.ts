/**
 * backfill-images.ts — pull each source's preview image so citations can show a
 * thumbnail instead of a bare link.
 *
 * Reality check: this only works where the site exposes og:image in server-rendered
 * HTML. Verified — veterinarysecrets.com does; drjudymorgan.com is a JS-rendered
 * Shopify blog with no image in the raw HTML at all. So the UI must treat images as
 * a PROGRESSIVE ENHANCEMENT and look right without them, or Dr. Judy's demo (the
 * one that matters most) would render as a wall of broken cards.
 *
 * Usage: tsx scripts/backfill-images.ts --expert dr-andrew-jones [--limit N]
 */
import { createClient } from '@supabase/supabase-js'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Browsers block http:// images on an https:// page (mixed content), so an
// http URL means the thumbnail silently never renders. Always store https.
const forceHttps = (u: string) => u.replace(/^http:\/\//i, 'https://')

function pickImage(html: string, pageUrl: string): string | null {
  const metas = [
    /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
  ]
  for (const re of metas) {
    const m = html.match(re)
    if (m?.[1]) return forceHttps(new URL(m[1], pageUrl).href)
  }
  // Fall back to the first content image that isn't obvious site furniture.
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const src = m[1]
    if (/logo|icon|sprite|avatar|badge|payment|placeholder|pixel|1x1/i.test(src)) continue
    try { return forceHttps(new URL(src, pageUrl).href) } catch { /* skip malformed */ }
  }
  return null
}

async function main() {
  const i = process.argv.indexOf('--expert')
  const slug = i > -1 ? process.argv[i + 1] : ''
  const li = process.argv.indexOf('--limit')
  const limit = li > -1 ? Number(process.argv[li + 1]) : undefined
  if (!slug) { console.error('Usage: tsx scripts/backfill-images.ts --expert <slug> [--limit N]'); process.exit(1) }

  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { data: expert } = await sb.from('experts').select('id, name').eq('slug', slug).single()
  if (!expert) throw new Error(`no expert "${slug}"`)

  let q = sb.from('sources').select('id, title, url, metadata')
    .eq('expert_id', expert.id).not('url', 'is', null)
  if (limit) q = q.limit(limit)
  const { data: sources } = await q
  if (!sources?.length) { console.log('no sources with URLs'); return }

  console.log(`\n${expert.name} — checking ${sources.length} source(s) for preview images\n`)
  let found = 0, missing = 0

  for (const s of sources) {
    const meta = (s.metadata ?? {}) as Record<string, unknown>
    if (meta.image) { found++; continue } // already have one
    try {
      const res = await fetch(s.url!, { headers: { 'User-Agent': 'Mozilla/5.0 ExpertPlatformBot/0.1' } })
      if (!res.ok) { console.warn(`  · HTTP ${res.status}: ${s.title.slice(0, 45)}`); missing++; continue }
      const img = pickImage(await res.text(), s.url!)
      if (img) {
        await sb.from('sources').update({ metadata: { ...meta, image: img } }).eq('id', s.id)
        console.log(`  ✓ ${s.title.slice(0, 48)}`)
        found++
      } else {
        console.log(`  – no image: ${s.title.slice(0, 45)}`)
        missing++
      }
    } catch (e) {
      console.warn(`  · failed: ${s.title.slice(0, 40)} — ${(e as Error).message.slice(0, 50)}`)
      missing++
    }
    await sleep(700) // be polite to their server
  }
  console.log(`\nDone. ${found} with images, ${missing} without.`)
  if (missing > found) {
    console.log('Most sources have no image — the UI must look right without them.')
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
