// seed-chewy.mjs — Scrape Chewy product pages and seed Supabase
// Usage: node seed-chewy.mjs
//
// Note: uses `ingredients_raw` column. If seed-popular.mjs uses `ingredients`,
// those are separate columns — confirm your schema has `ingredients_raw`.

import puppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs'

puppeteerExtra.use(StealthPlugin())

const SUPABASE_URL = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CHEWY_URLS = [
  // Purina Pro Plan — chicken
  'https://www.chewy.com/purina-pro-plan-adult-large-breed/dp/52395',   // Adult Large Breed Chicken & Rice
  'https://www.chewy.com/purina-pro-plan-high-protein-chicken/dp/52414', // Sport High Protein Chicken & Rice

  // Blue Buffalo — chicken
  'https://www.chewy.com/blue-buffalo-life-protection-formula/dp/32041', // Life Protection Chicken & Brown Rice
  'https://www.chewy.com/blue-buffalo-wilderness-chicken/dp/32052',      // Wilderness Chicken Grain-Free

  // Hill's Science Diet — chicken
  'https://www.chewy.com/hills-science-diet-adult-sensitive/dp/29963',   // Sensitive Stomach & Skin Chicken
  'https://www.chewy.com/hills-science-diet-adult-perfect/dp/102135',    // Perfect Weight Chicken

  // Iams — chicken
  'https://www.chewy.com/iams-proactive-health-adult-healthy/dp/29292',  // ProActive Health Adult Healthy Weight
  'https://www.chewy.com/iams-proactive-health-large-breed/dp/29301',    // ProActive Health Large Breed Adult Chicken

  // Rachael Ray Nutrish — chicken
  'https://www.chewy.com/rachael-ray-nutrish-real-chicken/dp/128017',    // Real Chicken & Veggies
  'https://www.chewy.com/rachael-ray-nutrish-zero-grain/dp/156852',      // Zero Grain Chicken & Sweet Potato

  // Taste of the Wild — NOTE: no chicken-primary formula exists for this brand.
  // These two contain chicken meal but lead with bison/buffalo as primary protein.
  // Swap these out for a different brand if you want strict chicken-first only.
  'https://www.chewy.com/taste-wild-high-prairie-grain-free/dp/30075',   // High Prairie (bison-led, chicken meal present)
  'https://www.chewy.com/taste-wild-ancient-prairie-ancient/dp/217982',  // Ancient Prairie w/ Grains (bison-led, chicken meal present)

  // Merrick — chicken
  'https://www.chewy.com/merrick-real-chicken-sweet-potato/dp/37289',    // Real Chicken + Sweet Potato Grain-Free
  'https://www.chewy.com/merrick-classic-healthy-grains-real/dp/37297',  // Classic Healthy Grains Chicken + Brown Rice

  // Wellness CORE — chicken
  'https://www.chewy.com/wellness-core-digestive-health/dp/291309',      // Digestive Health Chicken & Brown Rice
  'https://www.chewy.com/wellness-core-grain-free-large-breed/dp/54100', // Large Breed Chicken & Turkey

  // ORIJEN — chicken
  'https://www.chewy.com/orijen-wild-reserve-dry-dog-food-free/dp/2246942', // Wild Reserve Free-Run Chicken Grain-Free
  'https://www.chewy.com/orijen-wild-reserve-dry-dog-food-free/dp/2247038', // Wild Reserve Free-Run Chicken & Grains

  // ACANA — chicken
  'https://www.chewy.com/acana-free-run-poultry-recipe/dp/286030',       // Free-Run Poultry Wholesome Grains
  'https://www.chewy.com/acana-chicken-burbank-potato-formula/dp/34851', // Chicken & Burbank Potato
]

const delay = ms => new Promise(r => setTimeout(r, ms))

async function tryClickExpanders(page) {
  const selectors = [
    'button[data-testid="see-more"]',
    'button[aria-label*="See more" i]',
    'button[aria-label*="Show more" i]',
    '.e-1iyoq0w button',
  ]
  for (const sel of selectors) {
    try {
      const btns = await page.$$(sel)
      for (const btn of btns) {
        const visible = await btn.isIntersectingViewport()
        if (visible) await btn.click()
      }
    } catch (_) {}
  }
  await delay(600)
}

async function scrapeProduct(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  await delay(3000) // let React render after network idle

  const pageTitle = await page.title()
  console.log(`  page title:  "${pageTitle}"`)

  if (/just a moment|access denied|attention required|are you a human/i.test(pageTitle)) {
    throw new Error(`Bot check triggered — page title: "${pageTitle}"`)
  }

  // Dump first 800 chars of visible text so we can see what actually loaded
  const bodySnippet = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 800))
  console.log(`  page text:   ${bodySnippet}\n`)

  // Scroll through page to trigger lazy-loaded sections
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
  await delay(700)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.8))
  await delay(700)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await delay(500)

  await tryClickExpanders(page)

  return await page.evaluate(() => {
    // --- Product Name ---
    const productName = document.querySelector('h1')?.textContent.trim() ?? ''

    // --- Brand ---
    let brand = ''
    const brandCandidates = [
      document.querySelector('[data-testid="brand"] a'),
      document.querySelector('[data-testid="ProductBrandName"]'),
      document.querySelector('a[href*="/brands/"]'),
      document.querySelector('[class*="brand"] a'),
    ]
    for (const el of brandCandidates) {
      const t = el?.textContent.trim()
      if (t) { brand = t; break }
    }

    // --- Ingredients ---
    let ingredientsRaw = ''

    // Method 1: dt/dd pairs (Chewy's most common pattern)
    const dts = [...document.querySelectorAll('dt')]
    for (const dt of dts) {
      if (/^ingredients?:?\s*$/i.test(dt.textContent.trim())) {
        const dd = dt.nextElementSibling
        if (dd?.textContent.length > 20) { ingredientsRaw = dd.textContent.trim(); break }
      }
    }

    // Method 2: table th/td pairs
    if (!ingredientsRaw) {
      const cells = [...document.querySelectorAll('th, td')]
      for (let i = 0; i < cells.length - 1; i++) {
        if (/^ingredients?:?\s*$/i.test(cells[i].textContent.trim())) {
          const val = cells[i + 1].textContent.trim()
          if (val.length > 20) { ingredientsRaw = val; break }
        }
      }
    }

    // Method 3: heading followed by sibling element
    if (!ingredientsRaw) {
      const nodes = [...document.querySelectorAll('h2,h3,h4,strong,b,p,div,span')]
      for (let i = 0; i < nodes.length - 1; i++) {
        if (/^ingredients?:?\s*$/i.test(nodes[i].textContent.trim())) {
          const next = nodes[i].nextElementSibling ?? nodes[i + 1]
          if (next?.textContent.length > 20) { ingredientsRaw = next.textContent.trim(); break }
        }
      }
    }

    // Method 4: inline "Ingredients:" prefix in body text
    if (!ingredientsRaw) {
      const match = document.body.innerText.match(/Ingredients?:\s*([^\n]{30,})/i)
      if (match) ingredientsRaw = match[1].trim()
    }

    // --- UPC / Barcode ---
    let barcode = ''

    for (const dt of dts) {
      if (/upc/i.test(dt.textContent.trim())) {
        const dd = dt.nextElementSibling
        const digits = dd?.textContent.replace(/\D/g, '') ?? ''
        if (digits.length >= 10) { barcode = digits; break }
      }
    }

    if (!barcode) {
      const cells = [...document.querySelectorAll('th, td')]
      for (let i = 0; i < cells.length - 1; i++) {
        if (/^upc$/i.test(cells[i].textContent.trim())) {
          const digits = cells[i + 1].textContent.replace(/\D/g, '')
          if (digits.length >= 10) { barcode = digits; break }
        }
      }
    }

    if (!barcode) {
      const match = document.body.innerText.match(/UPC[:\s]+(\d{10,13})/i)
      if (match) barcode = match[1]
    }

    return { productName, brand, ingredientsRaw, barcode }
  })
}

async function run() {
  // Use real installed Chrome — Chromium is fingerprinted by bot detection
  const browser = await puppeteerExtra.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  })

  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  )
  await page.setViewport({ width: 1280, height: 900 })

  // Suppress non-critical browser console noise
  page.on('console', () => {})

  let saved = 0
  let failed = 0

  console.log(`\nScraping ${CHEWY_URLS.length} Chewy product pages...\n`)

  for (let i = 0; i < CHEWY_URLS.length; i++) {
    const url = CHEWY_URLS[i]
    const slug = url.split('/').at(-3) ?? url
    console.log(`[${i + 1}/${CHEWY_URLS.length}] ${slug}`)

    try {
      const product = await scrapeProduct(page, url)

      console.log(`  name:        ${product.productName || '(empty)'}`)
      console.log(`  brand:       ${product.brand || '(empty)'}`)
      console.log(`  barcode:     ${product.barcode || '(not found)'}`)
      console.log(`  ingredients: ${product.ingredientsRaw
        ? product.ingredientsRaw.substring(0, 80) + '...'
        : '(not found — selectors may need updating)'}`)

      if (!product.ingredientsRaw) {
        console.log(`  ⚠ Skipping — no ingredients extracted\n`)
        failed++
      } else {
        const barcode = product.barcode || `chewy-manual-${i}-${Date.now()}`

        const { error } = await supabase
          .from('products')
          .upsert({
            barcode,
            product_name: product.productName,
            brand: product.brand,
            ingredients_raw: product.ingredientsRaw,
          }, { onConflict: 'barcode', ignoreDuplicates: true })

        if (error) {
          console.log(`  ✗ DB error: ${error.message}\n`)
          failed++
        } else {
          console.log(`  ✓ Saved to Supabase\n`)
          saved++
        }
      }
    } catch (err) {
      console.log(`  ✗ Scrape error: ${err.message}\n`)
      failed++
    }

    // Random 3–7 second delay to be polite
    const wait = 3000 + Math.floor(Math.random() * 4000)
    process.stdout.write(`  (waiting ${(wait / 1000).toFixed(1)}s...)\n\n`)
    await delay(wait)
  }

  await browser.close()

  console.log('─'.repeat(40))
  console.log(`✅ Done!  Saved: ${saved}  Failed/Skipped: ${failed}`)
}

run().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
