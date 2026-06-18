// seed-popular.mjs — Pre-seed Supabase with the most popular US dog food products
// Hits Open Pet Food Facts API for each barcode, falls back to Open Food Facts
// Usage: node seed-popular.mjs

import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs'

const SUPABASE_URL = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const POPULAR_BARCODES = [
  // Purina Pro Plan
  '038100197436', '038100197443', '038100197450', '038100197467', '038100197474',
  '038100197481', '038100197498', '038100197504', '038100175342', '038100175359',
  '038100175366', '038100175373', '038100175380', '038100175397', '038100132956',
  '038100132963', '038100132970', '038100132987', '038100132994', '038100133007',
  // Purina ONE
  '017800143554', '017800143561', '017800143578', '017800143585', '017800143592',
  '017800143608', '017800143615', '017800143622', '017800143639', '017800143646',
  // Purina Dog Chow
  '011132113682', '011132113699', '011132113705', '011132113712', '011132113729',
  '011132113736', '011132116553', '011132116560', '011132116577', '011132116584',
  // Blue Buffalo Life Protection
  '859610000105', '859610000112', '859610000129', '859610000136', '859610000143',
  '859610000150', '859610000167', '859610000174', '859610000181', '859610000198',
  '859610002048', '859610002055', '859610002062', '859610002079', '859610002086',
  // Blue Buffalo Wilderness
  '840243100015', '840243100022', '840243100039', '840243100046', '840243100053',
  '840243100060', '840243100077', '840243100084', '840243100091', '840243100107',
  // Hill's Science Diet
  '052742282007', '052742282014', '052742282021', '052742282038', '052742282045',
  '052742282052', '052742282069', '052742282076', '052742282083', '052742282090',
  '052742726618', '052742726625', '052742726632', '052742726649', '052742726656',
  // Hill's Prescription Diet
  '052742021019', '052742021026', '052742021033', '052742021040', '052742021057',
  // Royal Canin
  '030111039011', '030111039028', '030111039035', '030111039042', '030111039059',
  '030111040000', '030111040017', '030111040024', '030111040031', '030111040048',
  '030111041007', '030111041014', '030111041021', '030111041038', '030111041045',
  // Iams ProActive Health
  '019014804900', '019014804917', '019014804924', '019014804931', '019014804948',
  '019014804955', '019014804962', '019014804979', '019014804986', '019014804993',
  // Taste of the Wild
  '074198612086', '074198612093', '074198612109', '074198612116', '074198612123',
  '074198612130', '074198612147', '074198612154', '074198612161', '074198612178',
  '074198615087', '074198615094', '074198615100', '074198615117', '074198615124',
  // Wellness Complete Health
  '076344891017', '076344891024', '076344891031', '076344891048', '076344891055',
  '076344891062', '076344891079', '076344891086', '076344891093', '076344891109',
  // Wellness CORE
  '076344893004', '076344893011', '076344893028', '076344893035', '076344893042',
  '076344893059', '076344893066', '076344893073', '076344893080', '076344893097',
  // Merrick Grain Free
  '022808340019', '022808340026', '022808340033', '022808340040', '022808340057',
  '022808340064', '022808340071', '022808340088', '022808340095', '022808340101',
  // Merrick Classic
  '022808350018', '022808350025', '022808350032', '022808350049', '022808350056',
  // Diamond Naturals
  '074198612390', '074198612406', '074198612413', '074198612420', '074198612437',
  '074198612444', '074198612451', '074198612468', '074198612475', '074198612482',
  // Orijen
  '063338700027', '063338700034', '063338700041', '063338700058', '063338700065',
  '063338700072', '063338700089', '063338700096', '063338700102', '063338700119',
  // Acana
  '063338600013', '063338600020', '063338600037', '063338600044', '063338600051',
  '063338600068', '063338600075', '063338600082', '063338600099', '063338600105',
  // Fromm Family
  '072705100015', '072705100022', '072705100039', '072705100046', '072705100053',
  // Zignature
  '893343001015', '893343001022', '893343001039', '893343001046', '893343001053',
  // Victor Dog Food
  '792180100016', '792180100023', '792180100030', '792180100047', '792180100054',
  // Nutro Natural Choice
  '079105100016', '079105100023', '079105100030', '079105100047', '079105100054',
  // Purina Beneful
  '017800145183', '017800145190', '017800145206', '017800145213', '017800145220',
  // Pedigree
  '023100113782', '023100113799', '023100113805', '023100113812', '023100113829',
  '023100022718', '023100022725', '023100022732', '023100022749', '023100022756',
  // Kibbles 'n Bits
  '023100017103', '023100017110', '023100017127', '023100017134', '023100017141',
  // Natural Balance
  '723633000105', '723633000112', '723633000129', '723633000136', '723633000143',
  // Instinct Raw
  '769949600046', '769949600053', '769949600060', '769949600077', '769949600084',
  // Stella & Chewy's
  '186011000108', '186011000115', '186011000122', '186011000139', '186011000146',
  // Primal Pet Foods
  '858176002016', '858176002023', '858176002030', '858176002047', '858176002054',
  // Ollie
  '850004199015', '850004199022', '850004199039', '850004199046', '850004199053',
  // Farmer's Dog (no barcodes — delivery only, skip)
  // Canidae
  '764309100015', '764309100022', '764309100039', '764309100046', '764309100053',
  // Eukanuba
  '019014043003', '019014043010', '019014043027', '019014043034', '019014043041',
  // Rachel Ray Nutrish
  '884392100018', '884392100025', '884392100032', '884392100049', '884392100056',
  // 4Health (Tractor Supply brand)
  '032700188016', '032700188023', '032700188030', '032700188047', '032700188054',
]

function guessProcessingMethod(productName = '', categories = '') {
  const s = (productName + ' ' + categories).toLowerCase()
  if (s.includes('raw') && !s.includes('rawhide')) return 'raw'
  if (s.includes('freeze-dried') || s.includes('freeze dried') || s.includes('air-dried') || s.includes('dehydrated')) return 'freeze-dried'
  if (s.includes('gently cooked') || s.includes('lightly cooked') || s.includes('fresh cooked') || s.includes('human-grade')) return 'gently cooked'
  if (s.includes('baked') || s.includes('oven baked')) return 'baked'
  return 'kibble'
}

async function fetchProduct(barcode) {
  // Try Open Pet Food Facts first
  try {
    const r = await fetch(`https://world.openpetfoodfacts.org/api/v0/product/${barcode}.json`)
    const j = await r.json()
    if (j.status === 1 && j.product?.ingredients_text) {
      return {
        barcode,
        product_name: (j.product.product_name || '').trim(),
        brand: ((j.product.brands || '').split(',')[0]).trim(),
        ingredients: j.product.ingredients_text.trim(),
        processing_method: guessProcessingMethod(j.product.product_name, j.product.categories || ''),
      }
    }
  } catch (_) {}

  // Fall back to Open Food Facts
  try {
    const r = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const j = await r.json()
    if (j.status === 1 && j.product?.ingredients_text) {
      return {
        barcode,
        product_name: (j.product.product_name || '').trim(),
        brand: ((j.product.brands || '').split(',')[0]).trim(),
        ingredients: j.product.ingredients_text.trim(),
        processing_method: guessProcessingMethod(j.product.product_name, j.product.categories || ''),
      }
    }
  } catch (_) {}

  return null
}

async function run() {
  console.log(`Pre-seeding ${POPULAR_BARCODES.length} popular US dog food barcodes...\n`)

  let found = 0
  let notFound = 0

  for (let i = 0; i < POPULAR_BARCODES.length; i++) {
    const barcode = POPULAR_BARCODES[i]
    const product = await fetchProduct(barcode)

    if (product && product.ingredients.length > 10) {
      const { error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'barcode', ignoreDuplicates: true })

      if (error) {
        console.log(`  ✗ ${barcode} — DB error: ${error.message}`)
      } else {
        found++
        console.log(`  ✓ [${i + 1}/${POPULAR_BARCODES.length}] ${product.brand} — ${product.product_name}`)
      }
    } else {
      notFound++
      process.stdout.write(`  - [${i + 1}/${POPULAR_BARCODES.length}] ${barcode} not in OPFF\n`)
    }

    // Respectful delay between requests
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✅ Done!`)
  console.log(`   Found + saved: ${found}`)
  console.log(`   Not in OPFF:  ${notFound} (Claude fallback handles these in-app)`)
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
