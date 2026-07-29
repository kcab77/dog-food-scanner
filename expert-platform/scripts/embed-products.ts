/**
 * One-off / re-runnable: embeds any products missing an embedding, so
 * match_products can do real semantic matching instead of keyword substrings.
 * Usage: tsx scripts/embed-products.ts
 */
import { createClient } from '@supabase/supabase-js'
import { embed } from '../lib/embed'

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { data: products, error } = await sb
    .from('products')
    .select('id, name, description')
    .is('embedding', null)
  if (error) throw error
  if (!products?.length) {
    console.log('Nothing to embed.')
    return
  }
  console.log(`Embedding ${products.length} products...`)
  const minInterval = Number(process.env.VOYAGE_MIN_INTERVAL_MS ?? '21000') // free tier: 3 req/min
  for (const p of products) {
    const text = `${p.name} — ${p.description}`
    const [vector] = await embed([text], 'document')
    const { error: updErr } = await sb.from('products').update({ embedding: vector }).eq('id', p.id)
    if (updErr) console.error(`  ✗ ${p.name}: ${updErr.message}`)
    else console.log(`  ✓ ${p.name}`)
    await new Promise((r) => setTimeout(r, minInterval))
  }
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
