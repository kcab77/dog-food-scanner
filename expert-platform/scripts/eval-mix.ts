/**
 * eval-mix.ts — what actually reaches the model?
 *
 * Retrieval is hybrid (compiled pages + original articles in one index) and picks
 * by similarity. But only MATCH_COUNT chunks are passed to the model, so one type
 * can crowd out the other. This prints the composition of the retrieved set so we
 * can see whether the model is getting BOTH the synthesized overview and the
 * specific source detail — or only one.
 *
 * Usage: tsx scripts/eval-mix.ts --expert dr-judy-morgan
 */
import { createClient } from '@supabase/supabase-js'
import { embed } from '../lib/embed'

const MATCH_COUNT = Number(process.env.MATCH_COUNT ?? '8')
const FLOOR = Number(process.env.RELEVANCE_FLOOR ?? '0.40')

const QUESTIONS = [
  'What is your overall philosophy on keeping pets healthy?', // broad -> compiled should help
  'How should I prevent fleas and ticks naturally?',          // narrow -> original article is better
  'Should I feed raw or kibble?',                             // middle
]

async function main() {
  const i = process.argv.indexOf('--expert')
  const slug = i > -1 ? process.argv[i + 1] : 'dr-judy-morgan'
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { data: expert } = await sb.from('experts').select('id, name').eq('slug', slug).single()
  const { data: srcs } = await sb.from('sources').select('id, type, title').eq('expert_id', expert!.id)
  const typeOf = new Map((srcs ?? []).map((s) => [s.id, s.type]))
  const titleOf = new Map((srcs ?? []).map((s) => [s.id, s.title]))

  console.log(`\nWhat reaches the model — ${expert!.name} (top ${MATCH_COUNT}, floor ${FLOOR})\n`)

  for (const q of QUESTIONS) {
    const [vec] = await embed([q], 'query')
    const { data } = await sb.rpc('match_chunks', {
      p_expert: expert!.id,
      query_embedding: vec,
      match_count: MATCH_COUNT,
      similarity_threshold: FLOOR,
    })
    const rows = (data ?? []) as { source_id: string; similarity: number }[]
    const compiled = rows.filter((r) => typeOf.get(r.source_id) === 'wiki').length
    const original = rows.length - compiled
    console.log(`Q: ${q}`)
    console.log(`   retrieved ${rows.length}: ${compiled} compiled · ${original} original`)
    rows.forEach((r, n) => {
      const tag = typeOf.get(r.source_id) === 'wiki' ? 'COMPILED' : 'original'
      console.log(`     ${n + 1}. [${tag}] ${r.similarity.toFixed(3)}  ${(titleOf.get(r.source_id) ?? '').slice(0, 46)}`)
    })
    if (compiled === 0) console.log('   ⚠️  no compiled page reached the model')
    if (original === 0) console.log('   ⚠️  no ORIGINAL article reached the model — losing verbatim detail')
    console.log('')
    await new Promise((r) => setTimeout(r, 21000)) // Voyage free-tier pacing
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
