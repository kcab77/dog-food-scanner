/**
 * eval-wiki.ts — does the compiled-wiki layer actually improve retrieval?
 *
 * For each test question, compares the best cosine similarity achieved by
 * RAW chunks vs. COMPILED (type='wiki') chunks. If compiled pages don't score
 * meaningfully higher, the layer isn't earning its complexity and should be dropped.
 *
 * Usage: tsx scripts/eval-wiki.ts --expert dr-judy-morgan
 */
import { createClient } from '@supabase/supabase-js'
import { embed } from '../lib/embed'

const QUESTIONS = [
  'What is your overall philosophy on keeping pets healthy?',
  'Should I feed raw or kibble?',
  'What ingredients should I avoid in pet food?',
  'Are essential oils safe around my dog?',
  'How should I prevent fleas and ticks naturally?',
  'Should I spay or neuter my dog?',
]

async function main() {
  const slugArg = process.argv.indexOf('--expert')
  const slug = slugArg > -1 ? process.argv[slugArg + 1] : 'dr-judy-morgan'
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { data: expert } = await sb.from('experts').select('id, name').eq('slug', slug).single()
  if (!expert) throw new Error(`no expert ${slug}`)

  // Map every source id -> type so matched chunks can be bucketed raw vs compiled.
  const { data: srcs } = await sb.from('sources').select('id, type, title').eq('expert_id', expert.id)
  const typeOf = new Map((srcs ?? []).map((s) => [s.id, s.type]))
  const titleOf = new Map((srcs ?? []).map((s) => [s.id, s.title]))

  console.log(`\nRetrieval eval — ${expert.name}`)
  console.log(`corpus: ${(srcs ?? []).filter(s => s.type !== 'wiki').length} raw sources, ` +
              `${(srcs ?? []).filter(s => s.type === 'wiki').length} compiled pages\n`)
  console.log('question'.padEnd(52), 'RAW  COMPILED   winner')
  console.log('-'.repeat(90))

  let wikiWins = 0, rawWins = 0
  const deltas: number[] = []

  for (const q of QUESTIONS) {
    const [vec] = await embed([q], 'query')
    const { data: hits } = await sb.rpc('match_chunks', {
      p_expert: expert.id,
      query_embedding: vec,
      match_count: 40,
      similarity_threshold: 0,
    })
    const rows = (hits ?? []) as { source_id: string; similarity: number }[]
    const raw = rows.filter((r) => typeOf.get(r.source_id) !== 'wiki')
    const wiki = rows.filter((r) => typeOf.get(r.source_id) === 'wiki')
    const bestRaw = raw[0]?.similarity ?? 0
    const bestWiki = wiki[0]?.similarity ?? 0
    const delta = bestWiki - bestRaw
    deltas.push(delta)
    const winner = delta > 0.02 ? `COMPILED (+${delta.toFixed(3)})` : delta < -0.02 ? `raw (${delta.toFixed(3)})` : 'tie'
    if (delta > 0.02) wikiWins++; else if (delta < -0.02) rawWins++
    console.log(
      q.slice(0, 50).padEnd(52),
      bestRaw.toFixed(3), '  ', bestWiki.toFixed(3), '  ', winner,
    )
    if (bestWiki > bestRaw) {
      console.log(`      └─ top compiled page: "${titleOf.get(wiki[0].source_id)}"`)
    }
    await new Promise((r) => setTimeout(r, 21000)) // Voyage free-tier pacing
  }

  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length
  console.log('-'.repeat(90))
  console.log(`compiled wins: ${wikiWins}/${QUESTIONS.length} · raw wins: ${rawWins} · avg similarity delta: ${avg >= 0 ? '+' : ''}${avg.toFixed(3)}`)
  console.log(
    avg > 0.03
      ? '\nVERDICT: compiled layer measurably improves retrieval. Keep it.\n'
      : '\nVERDICT: no meaningful gain — the layer is not earning its complexity. Consider dropping.\n',
  )
}
main().catch((e) => { console.error(e); process.exit(1) })
