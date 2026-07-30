// seed-all.mjs — Pull every available dog food from OPFF + OFF and push to Supabase
// Usage: node seed-all.mjs
// Safe to re-run — upsert with ignoreDuplicates skips anything already in the DB

import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { Readable } from 'stream'
import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs'

const SUPABASE_URL = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BATCH_SIZE = 200   // records per Supabase upsert
const PAGE_SIZE  = 200   // records per API page
const DELAY_MS   = 800   // between API pages (be polite)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function guessProcessingMethod(name = '', categories = '') {
  const s = (name + ' ' + categories).toLowerCase()
  if (s.includes('raw') && !s.includes('rawhide')) return 'raw'
  if (s.includes('freeze-dried') || s.includes('freeze dried') || s.includes('air-dried') || s.includes('dehydrated')) return 'freeze-dried'
  if (s.includes('gently cooked') || s.includes('lightly cooked') || s.includes('human-grade')) return 'gently cooked'
  if (s.includes('baked') || s.includes('oven baked')) return 'baked'
  return 'kibble'
}

function isDogFood(categories = '', name = '') {
  const s = (categories + ' ' + name).toLowerCase()
  return s.includes('dog') || s.includes('canine') || s.includes('puppy') || s.includes('chien')
}

const FRENCH_MARKERS = ['farine', 'poulet', 'boeuf', 'canard', 'agneau', 'protéines', 'légumes', 'graisses', 'minéraux', 'foie de', 'levure de']
function isFrench(ingredients = '') {
  const lower = ingredients.toLowerCase()
  return FRENCH_MARKERS.filter(w => lower.includes(w)).length >= 2
}

function normalize(raw) {
  const barcode = (raw.code || '').toString().trim().replace(/\D/g, '')
  const ingredients = (raw.ingredients_text_en || raw.ingredients_text || '').trim()
  const product_name = (raw.product_name_en || raw.product_name || '').trim().slice(0, 500)
  const brand = ((raw.brands || '').split(',')[0]).trim().slice(0, 200)
  const categories = (raw.categories_tags?.join(' ') || raw.categories || '')

  if (barcode.length < 8)      return null
  if (ingredients.length < 15) return null
  if (!product_name)           return null
  if (!isDogFood(categories, product_name)) return null
  if (isFrench(ingredients))   return null

  return {
    barcode,
    product_name,
    brand,
    ingredients,
    processing_method: guessProcessingMethod(product_name, categories),
  }
}

async function upsertBatch(batch) {
  const { error } = await supabase
    .from('products')
    .upsert(batch, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) process.stdout.write(` [DB err: ${error.message}]`)
}

const delay = ms => new Promise(r => setTimeout(r, ms))

// ─── Source 1: OPFF full dump (streamed, no file saved to disk) ───────────────

async function seedFromDump(label, url) {
  console.log(`\n[${label}] Streaming dump from ${url}`)
  let inserted = 0, skipped = 0, batch = []

  const resp = await fetch(url)
  if (!resp.ok) { console.log(`  ✗ HTTP ${resp.status} — skipping`); return }

  const gunzip = createGunzip()
  // Node 18+ fetch returns a web ReadableStream — convert to Node stream before piping
  const nodeStream = Readable.fromWeb(resp.body).pipe(gunzip)
  const rl = createInterface({ input: nodeStream, crlfDelay: Infinity })

  for await (const line of rl) {
    if (!line.trim()) continue
    let raw
    try { raw = JSON.parse(line) } catch { skipped++; continue }

    const product = normalize(raw)
    if (!product) { skipped++; continue }

    batch.push(product)
    if (batch.length >= BATCH_SIZE) {
      await upsertBatch(batch)
      inserted += batch.length
      process.stdout.write(`\r  Inserted: ${inserted.toLocaleString()}  Skipped: ${skipped.toLocaleString()}`)
      batch = []
    }
  }

  if (batch.length) { await upsertBatch(batch); inserted += batch.length }
  console.log(`\n  ✓ Done — ${inserted.toLocaleString()} inserted, ${skipped.toLocaleString()} skipped`)
}

// ─── Source 2: OPFF / OFF paginated API ──────────────────────────────────────

async function seedFromAPI(label, buildUrl) {
  console.log(`\n[${label}] Paginating API...`)
  let page = 1, inserted = 0, skipped = 0, consecutiveEmpty = 0

  while (true) {
    const url = buildUrl(page, PAGE_SIZE)
    let data

    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'PawGrade-Seed/1.0 (kylecab96@gmail.com)' },
      })
      if (!resp.ok) { console.log(`\n  HTTP ${resp.status} on page ${page} — stopping`); break }
      const text = await resp.text()
      if (!text.trim()) { console.log(`\n  Empty response on page ${page} — stopping`); break }
      data = JSON.parse(text)
    } catch (err) {
      console.log(`\n  Fetch/parse error on page ${page}: ${err.message} — stopping`)
      break
    }

    const products = data.products || data.hits || []
    if (products.length === 0) {
      consecutiveEmpty++
      if (consecutiveEmpty >= 2) break
      page++
      await delay(DELAY_MS)
      continue
    }
    consecutiveEmpty = 0

    const batch = products.map(normalize).filter(Boolean)
    if (batch.length) {
      await upsertBatch(batch)
      inserted += batch.length
    }
    skipped += products.length - batch.length

    process.stdout.write(`\r  Page ${page} — inserted: ${inserted.toLocaleString()}  skipped: ${skipped.toLocaleString()}  `)

    if (products.length < PAGE_SIZE) break  // last page
    page++
    await delay(DELAY_MS)
  }

  console.log(`\n  ✓ Done — ${inserted.toLocaleString()} inserted, ${skipped.toLocaleString()} skipped`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const start = Date.now()
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  PawGrade bulk seed — OPFF + OFF → Supabase')
  console.log('  Safe to Ctrl+C and re-run (duplicates are skipped)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 1. Full OPFF dump — every pet food product ever submitted (~17MB gzip)
  await seedFromDump(
    'OPFF dump',
    'https://static.openpetfoodfacts.org/data/openpetfoodfacts-products.jsonl.gz'
  )

  // 2. OPFF API — paginate all dog-food products (catches any not in dump)
  await seedFromAPI(
    'OPFF API',
    (page, size) =>
      `https://world.openpetfoodfacts.org/api/v2/search?categories_tags_en=dog-food&fields=code,product_name,brands,ingredients_text,categories_tags&page_size=${size}&page=${page}`
  )

  // 3. OFF API — Open Food Facts also has dog food entries missed by OPFF
  await seedFromAPI(
    'OFF API (Open Food Facts)',
    (page, size) =>
      `https://world.openfoodfacts.org/api/v2/search?categories_tags_en=dog-food&fields=code,product_name,brands,ingredients_text_en,ingredients_text,categories_tags&page_size=${size}&page=${page}`
  )

  const mins = ((Date.now() - start) / 60000).toFixed(1)
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅  All done in ${mins} minutes`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

run().catch(err => {
  console.error('\nFatal:', err.message)
  process.exit(1)
})
