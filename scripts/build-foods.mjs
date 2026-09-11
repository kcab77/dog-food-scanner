#!/usr/bin/env node
/**
 * Build the food database for commonsensedog.com.
 *
 *   node scripts/build-scoring.mjs && node scripts/build-foods.mjs
 *   → common-sense-dog-ai/lib/foods-data.ts
 *
 * Pulls every product from Supabase, filters to the ones that are genuinely
 * usable, scores each with the REAL app scorer (lib/scoring.generated.ts), and
 * writes a static data file the site renders from.
 *
 * ⚠️ THE FILTER IS THE IMPORTANT PART. The raw table is 595 rows and only ~122
 * are publishable. The rest are cat food, French and Italian labels, marketing
 * copy where the ingredients should be, and scraper artifacts (one product is
 * literally named "Caricamento in corso…" — Italian for "Loading"). Publishing
 * unfiltered would put garbage on 400 public pages.
 */
import { readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'

// Reads a COMMITTED export rather than hitting Supabase at build time.
//
// Two reasons. First, Vercel builds shouldn't need database credentials — a
// static data file is simpler and can't fail mid-deploy. Second, the website's
// .env.local points at a Supabase project that no longer resolves
// (hqpkcsplkyeduhhhdeyq); the app's real project is dyzupdctgejwyuocqbtw. Until
// that's reconciled, a build that queried live would break.
//
// 🔄 TO REFRESH: re-run the products query against the app's Supabase project
// and overwrite scripts/products-export.json, then run this script.

// Compile the generated scorer so this script can use it.
execFileSync('npx', ['--yes', 'esbuild', 'common-sense-dog-ai/lib/scoring.generated.ts',
  '--bundle', '--format=esm', '--outfile=/tmp/_foods_scoring.mjs', '--log-level=error'], { stdio: 'inherit' })
const { scoreFood } = await import('/tmp/_foods_scoring.mjs')

const raw = JSON.parse(readFileSync('scripts/products-export.json', 'utf8'))
if (!Array.isArray(raw)) throw new Error('Supabase did not return rows: ' + JSON.stringify(raw).slice(0, 200))

const CAT = /(cat|kitten|whiskas|felix|sheba|friskies|meow)/i
const FOREIGN = /(viandes|composition|proteine|disidratate|entières|crues|granturco|céréales|sous-produits)/i
const MARKETING = /(we meticulously|helps support|our suppl|guaranteed analysis|feeding guide)/i
const ARTIFACT = /(caricamento|loading|undefined|^null$)/i
const STARTS_LIKE_FOOD = /^\s*(deboned |fresh |whole |chicken|beef|turkey|lamb|salmon|duck|pork|venison|bison|buffalo|fish|rabbit|water|brown rice|oatmeal|barley|sweet potato)/i

// ⚠️ US MARKET ONLY, for now (Kyle, 2026-09-11) — and the reason is stronger
// than nationality. The scorer matches ENGLISH ingredient terms. A French label
// saying "oxyde de zinc" and "sélénite de sodium" matches nothing, so the
// identical food scores 53 in French and 23 in English: it catches ZERO flagged
// ingredients. A foreign label doesn't score differently, it scores FALSELY
// HIGH, which is the dangerous direction. Exclude until the term lists are
// translated.
const NON_US_BRANDS = [
  'bozita', 'carnilove', 'dagsmark', 'leader price', 'smølke', 'smolke', 'yarrah',
  'wolf of wilderness', 'fish4dogs', 'trovet', 'vitapet', 'applaws', 'vitakraft',
  'lakes ice cream',
]

// Cat food and non-food that the name-based filter misses because the word
// "cat" never appears. 9Lives and Temptations are both cat brands.
const NOT_DOG_FOOD = [
  '9lives', 'temptations', 'unidentifiable', 'nutrients', 'petcare', 'blink',
  'jack', 'ahealth shreds', 'lakes ice cream',
]

// The same brand arrives spelled several ways — "Blue", "Blue Buffalo",
// "blue wilderness" — which splits one brand across four directory entries and
// breaks the "more from this brand" section. Longest match wins.
const BRAND_ALIASES = [
  [/^blue( buffalo| wilderness)?$/i, 'Blue Buffalo'],
  [/^hill'?s( pet nutrition| science diet)?$/i, "Hill's"],
  [/^(purina|nestlé|nestle|one)$/i, 'Purina'],
  [/^wellness( core| natural pet food)?$/i, 'Wellness'],
  [/^fromm family( pet food)?$/i, 'Fromm Family'],
  [/^instinct( the raw brand)?$/i, 'Instinct'],
  [/^pure balance( small breed)?$/i, 'Pure Balance'],
]
const normaliseBrand = (b) => {
  for (const [re, name] of BRAND_ALIASES) if (re.test(b.trim())) return name
  return b
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
const titled = (s) => s.replace(/\s+/g, ' ').trim()

const seen = new Set()
const foods = []
for (const p of raw) {
  const ing = p.ingredients || ''
  if (ing.length < 60) continue
  if (!p.brand || !p.brand.trim()) continue
  if (!STARTS_LIKE_FOOD.test(ing)) continue
  const hay = `${p.product_name} ${p.brand}`
  if (CAT.test(hay) || ARTIFACT.test(p.product_name || '')) continue
  const blow = p.brand.toLowerCase().trim()
  if (NON_US_BRANDS.some((n) => blow.includes(n))) continue
  if (NOT_DOG_FOOD.some((n) => blow === n || blow.includes(n))) continue
  if (FOREIGN.test(ing) || MARKETING.test(ing)) continue

  // A product name that already repeats the brand reads badly as a headline.
  let name = titled(p.product_name || '')
  const brand = normaliseBrand(titled(p.brand))
  if (name.toLowerCase().startsWith(brand.toLowerCase())) name = name.slice(brand.length).trim()
  if (!name) name = p.product_name
  const s = slug(`${brand}-${name}`)
  if (seen.has(s)) continue
  seen.add(s)

  const list = ing.split(/,(?![^()]*\))/).map((x) => x.trim()).filter(Boolean).slice(0, 60)
  let r
  try { r = scoreFood(p.product_name, ing, list, p.processing_method || 'unknown') } catch { continue }

  foods.push({
    slug: s, brand, name, score: r.total,
    format: r.analysis.processingResult?.rating || p.processing_method || 'Unknown',
    ingredients: list,
    breakdown: r.breakdown.filter((b) => b.value !== 0),
    flagged: (r.analysis.foundHarmful || []).map((h) => ({ name: h.name, severity: h.severity, reason: h.reason })),
    organs: r.analysis.foundOrgans || [],
    produce: r.analysis.foundProduce || [],
  })
}

foods.sort((a, b) => b.score - a.score || a.brand.localeCompare(b.brand))

const out = `/**
 * ⚠️ GENERATED — DO NOT EDIT.
 *   node scripts/build-scoring.mjs && node scripts/build-foods.mjs
 *
 * Every food scored by PawGrade's real scorer, not a second implementation.
 * ${foods.length} publishable products of ${raw.length} rows in Supabase — the rest are cat
 * food, non-English labels, marketing copy, or scraper artifacts.
 *
 * Generated ${new Date().toISOString().slice(0, 10)}.
 */
export type Food = {
  slug: string; brand: string; name: string; score: number; format: string
  ingredients: string[]
  breakdown: { label: string; value: number; severity?: string }[]
  flagged: { name: string; severity: string; reason: string }[]
  organs: string[]; produce: string[]
}

export const foods: Food[] = ${JSON.stringify(foods, null, 1)}

export const getFood = (slug: string) => foods.find((f) => f.slug === slug)
`
writeFileSync('common-sense-dog-ai/lib/foods-data.ts', out)

const band = (s) => (s >= 85 ? 'Excellent' : s >= 70 ? 'Good' : s >= 50 ? 'Fair' : s >= 30 ? 'Below Average' : 'Low Quality')
const counts = {}
foods.forEach((f) => { counts[band(f.score)] = (counts[band(f.score)] || 0) + 1 })
console.log(`✅ common-sense-dog-ai/lib/foods-data.ts`)
console.log(`   ${foods.length} publishable of ${raw.length} rows · ${new Set(foods.map((f) => f.brand)).size} brands`)
Object.entries(counts).forEach(([b, c]) => console.log(`   ${b.padEnd(14)} ${c}`))
