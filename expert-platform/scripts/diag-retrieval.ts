// Diagnostic: shows the TRUE top-similarity scores for a set of query phrasings
// against Dr. Judy's chunks, so we can see exactly why some phrasings refuse.
import { createClient } from '@supabase/supabase-js'
import { embed } from '../lib/embed'

const QUERIES = [
  'a raw diet is good',
  'do you think a raw diet is good',
  'raw diet',
  'is a raw diet good for dogs',
  'Simparica',
]

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { data: expert } = await sb.from('experts').select('id').eq('slug', 'dr-judy-morgan').single()
  for (const q of QUERIES) {
    const [vec] = await embed([q], 'query')
    const { data, error } = await sb.rpc('match_chunks', {
      p_expert: expert!.id,
      query_embedding: vec,
      match_count: 3,
      similarity_threshold: 0, // no floor — see the real top scores
    })
    if (error) {
      console.log(`"${q}" -> ERROR ${error.message}`)
    } else {
      const rows = (data ?? []) as { similarity: number }[]
      console.log(`"${q}" -> top sims: ${rows.map((r) => r.similarity.toFixed(3)).join(', ') || '(none)'}`)
    }
    await new Promise((r) => setTimeout(r, 22000)) // free-tier pacing
  }
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
