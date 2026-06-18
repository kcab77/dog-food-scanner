// seed-opff.mjs — Bulk seed Supabase from Open Pet Food Facts
// Supports both CSV (.csv) and JSONL (.jsonl or .jsonl.gz)
// Usage:
//   node seed-opff.mjs /path/to/en.openpetfoodfacts.org.products.csv
//   node seed-opff.mjs /path/to/openpetfoodfacts-products.jsonl.gz

import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import { createGunzip } from 'zlib'
import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs'

const SUPABASE_URL = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'
const BATCH_SIZE = 200

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node seed-opff.mjs /path/to/file.csv  OR  /path/to/file.jsonl.gz')
  process.exit(1)
}

const isGzip = filePath.endsWith('.gz')
const isJsonl = filePath.includes('.jsonl')

function guessProcessingMethod(productName = '', categories = '') {
  const s = (productName + ' ' + categories).toLowerCase()
  if (s.includes('raw') && !s.includes('rawhide') && !s.includes('raw hide')) return 'raw'
  if (s.includes('freeze-dried') || s.includes('freeze dried') || s.includes('air-dried') || s.includes('dehydrated')) return 'freeze-dried'
  if (s.includes('gently cooked') || s.includes('lightly cooked') || s.includes('fresh cooked') || s.includes('human-grade')) return 'gently cooked'
  if (s.includes('baked') || s.includes('oven baked')) return 'baked'
  return 'kibble'
}

function isDogFood(categories = '', productName = '') {
  const s = (categories + ' ' + productName).toLowerCase()
  return s.includes('dog') || s.includes('canine') || s.includes('puppy') || s.includes('chien')
}

const FRENCH_WORDS = ['farine', 'poulet', 'boeuf', 'canard', 'agneau', 'protéines', 'légumes', 'graisses', 'minéraux', 'vitamines', 'foie de', 'levure de', 'saumon deshydrate', 'huile de']
function isFrench(ingredients = '') {
  const lower = ingredients.toLowerCase()
  return FRENCH_WORDS.filter(w => lower.includes(w)).length >= 2
}

async function upsertBatch(batch) {
  const { error } = await supabase
    .from('products')
    .upsert(batch, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) console.error('  Upsert error:', error.message)
  return !error
}

function buildProduct(barcode, productName, brand, ingredients, categories) {
  return {
    barcode,
    product_name: (productName || '').trim().slice(0, 500),
    brand: (brand || '').split(',')[0].trim().slice(0, 200),
    ingredients: (ingredients || '').trim().slice(0, 5000),
    processing_method: guessProcessingMethod(productName, categories),
  }
}

async function run() {
  console.log(`Reading: ${filePath}`)
  console.log(`Format: ${isJsonl ? 'JSONL' : 'CSV'}${isGzip ? ' (gzipped)' : ''}`)
  console.log('Filtering for English dog food products with ingredients...\n')

  let fileStream = createReadStream(filePath)
  if (isGzip) fileStream = fileStream.pipe(createGunzip())

  const rl = createInterface({ input: fileStream, crlfDelay: Infinity })

  let headers = null
  let batch = []
  let totalInserted = 0
  let totalSkipped = 0
  let lineCount = 0

  for await (const line of rl) {
    if (!line.trim()) continue
    lineCount++

    let barcode, productName, brand, ingredients, categories

    if (isJsonl) {
      // JSONL format — each line is a JSON object
      let p
      try { p = JSON.parse(line) } catch { totalSkipped++; continue }

      barcode = (p.code || p._id || '').toString().trim()
      productName = p.product_name || p.product_name_en || ''
      brand = p.brands || ''
      ingredients = p.ingredients_text_en || p.ingredients_text || ''
      categories = p.categories || p.categories_tags?.join(',') || ''
    } else {
      // CSV / TSV format
      const cols = line.split('\t')

      if (lineCount === 1) {
        headers = cols.map(h => h.trim())
        console.log(`Found ${headers.length} columns. Processing rows...\n`)
        continue
      }

      const row = {}
      for (let i = 0; i < headers.length; i++) row[headers[i]] = (cols[i] || '').trim()

      barcode = row['code'] || ''
      productName = row['product_name'] || ''
      brand = row['brands'] || ''
      ingredients = row['ingredients_text'] || ''
      categories = row['categories'] || ''
    }

    // Filters
    if (!barcode || barcode.length < 8) { totalSkipped++; continue }
    if (!ingredients || ingredients.length < 15) { totalSkipped++; continue }
    if (!isDogFood(categories, productName)) { totalSkipped++; continue }
    if (isFrench(ingredients)) { totalSkipped++; continue }

    batch.push(buildProduct(barcode, productName, brand, ingredients, categories))

    if (batch.length >= BATCH_SIZE) {
      process.stdout.write(`Inserting batch... `)
      const ok = await upsertBatch(batch)
      totalInserted += batch.length
      console.log(`${ok ? '✓' : '✗'} ${totalInserted.toLocaleString()} products inserted so far`)
      batch = []
    }

    if (lineCount % 50000 === 0) {
      console.log(`  (scanned ${lineCount.toLocaleString()} lines)`)
    }
  }

  // Final batch
  if (batch.length > 0) {
    await upsertBatch(batch)
    totalInserted += batch.length
  }

  console.log(`\n✅ Done!`)
  console.log(`   Lines read:        ${lineCount.toLocaleString()}`)
  console.log(`   Products inserted: ${totalInserted.toLocaleString()}`)
  console.log(`   Skipped:           ${totalSkipped.toLocaleString()}`)
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
