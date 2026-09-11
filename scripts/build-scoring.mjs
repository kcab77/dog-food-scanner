#!/usr/bin/env node
/**
 * Generate a runnable copy of PawGrade's food scorer from app/index.tsx.
 *
 *   node scripts/build-scoring.mjs
 *   → common-sense-dog-ai/lib/scoring.generated.ts
 *
 * WHY GENERATE RATHER THAN REFACTOR
 * ---------------------------------
 * The scorer is ~290 lines of genuinely pure logic that happens to live inside
 * a React component. The website needs it (to score the product database) and
 * so does the test harness, but cutting it out by hand means editing the one
 * file CLAUDE.md guards hardest — the file a past refactor silently gutted.
 *
 * Generating sidesteps that entirely. app/index.tsx stays the single source of
 * truth and is never touched; this script lifts the same source TEXT out and
 * wraps it in a function. The copy cannot drift, because it is regenerated
 * rather than maintained.
 *
 * THE SEAM (verified 2026-09-11)
 * ------------------------------
 * Inside processIngredients() the structure is, in order:
 *
 *   setup    pure: the found* arrays, omega rating, aafco, tapf, format, audit
 *   setX     25 contiguous lines of React state — the ONLY impure block
 *   scoring  pure: `let total = 60` through the final clamp
 *
 * Because the impure block is contiguous and sits exactly between the two pure
 * halves, both halves lift cleanly. The markers below are matched on content,
 * not line numbers, so ordinary edits to app/index.tsx don't break this.
 */
import { readFileSync, writeFileSync } from 'fs'

// auditIngredientList lives in lib/ingredientDatabase.ts, not the app file.
// Concatenating means the same lift() finds it without special-casing.
const SRC = [
  'storage/ingredients.ts',      // CustomIngredient
  'lib/ingredientDatabase.ts',   // the mineral/vitamin database + its types
  'app/index.tsx',               // the scorer itself — single source of truth
].map((f) => readFileSync(f, 'utf8')).join('\n')
const L = SRC.split('\n')

const findLine = (re, what) => {
  const i = L.findIndex((l) => re.test(l))
  if (i === -1) throw new Error(`build-scoring: could not find ${what}. app/index.tsx has changed shape — re-check the seam before trusting this output.`)
  return i
}

// The three boundaries, found by content.
const setupStart = findLine(/^\s*const customIngredients = await loadCustomIngredients\(\);/, 'the start of setup')
const setxStart   = findLine(/^\s*setDbAvoidFlags\(dbAudit\.avoidFlags\);/, 'the start of the setX block')
const scoreStart  = findLine(/^\s*let total = 60;/, 'the start of scoring')
const scoreEnd    = findLine(/^\s*total = Math\.max\(5, Math\.round\(total\)\);/, 'the final clamp')

if (!(setupStart < setxStart && setxStart < scoreStart && scoreStart < scoreEnd)) {
  throw new Error('build-scoring: the seam is out of order. Do not trust the output.')
}

// Anything between the setX block and `let total` that ISN'T a setter would be
// silently dropped. Refuse rather than lose a line.
const between = L.slice(setxStart, scoreStart)
const stray = between.filter((l) => l.trim() && !/^\s*(set[A-Z]|\)|\}|\/\/|ingredientList|PREBIOTIC_SOURCES)/.test(l))
if (stray.length) {
  throw new Error(`build-scoring: ${stray.length} non-setter line(s) sit inside the setX block and would be dropped:\n  ${stray.join('\n  ')}`)
}

const setup = L.slice(setupStart + 1, setxStart).join('\n')
  // React state in the app; a parameter here. Same value, no hidden dependency.
  .replace(/nutritionalProfile\?\.omega_ratio/g, 'labelOmegaRatio')
const scoring = L.slice(scoreStart, scoreEnd + 1).join('\n')

// Everything the two halves reference, lifted whole.
const NEEDED = [
  'HARMFUL_INGREDIENTS','SEVERITY_PENALTIES','TOXIC_ADDITIVES','NAMED_MEALS','GENERIC_MEALS',
  'MEAT_MEALS','ADDED_VITAMINS','VITAMIN_MINERAL_PENALTIES','LENTIL_LEGUME','HIGH_CARB_INGREDIENTS',
  'ORGAN_MEATS','SUPERFOODS','WHOLE_FOOD_PRODUCE','ANTI_INFLAMMATORY_FOODS','HIGH_FIBER',
  'PROBIOTIC_SOURCES','PREBIOTIC_SOURCES','AAFCO_TRIAL_KEYWORDS','GENERIC_PROTEIN_TERMS',
  'SPECIFIC_PROTEIN_TERMS','PROCESSING_METHODS','TAPF_APPROVED_BRANDS','OMEGA3_SOURCES',
  'OMEGA6_SOURCES','VITAMIN_CONCERN_HIGH','VITAMIN_CONCERN_LOW','RAW_COATED_KIBBLE',
  'RAW_INCLUSION_HINTS','TOXIC_SCORE_CEILING',
  'harmfulPenalty','mentionsTerm','detectProcessingMethod','vitaminLoadPenalty','analyseSaltDivider',
  'bonusEligible','saltLinePenalty','carbPenaltyFor','computeOmegaRating','checkTAPFBrand',
  'auditIngredientList','analyseMineralForms',
  'OMEGA3_MARINE','OMEGA3_PLANT','OMEGA3_OILS','MineralEntry','VitaminEntry','FormQuality',
  'SafetyRating','CustomIngredient','Severity','Category',
  'CustomIngredient','FormQuality','MineralEntry','VitaminEntry',
  'CustomIngredient','FormQuality','MineralEntry','VitaminEntry',
  'CustomIngredient','FormQuality','MineralEntry','VitaminEntry',
  'CustomIngredient','FormQuality','MINERAL_DATABASE','VITAMIN_DATABASE',
  'CustomIngredient','checkCombinationFlags','checkSyntheticFormQuality',
]

function lift(name) {
  const rx = new RegExp(`^(export )?(const|function|type|interface|let) ${name}\\b`)
  const start = L.findIndex((l) => rx.test(l))
  if (start === -1) return null            // optional — not everything exists
  const at = start
  const first = L[start]
  const balanced = (s) => { let n = 0; for (const c of s) { if ('{[('.includes(c)) n++; else if ('}])'.includes(c)) n-- } return n === 0 }
  if (/^(export )?(type|let) /.test(first) && balanced(first) && !first.trimEnd().endsWith('{'))
    return { text: first.replace(/^export /, ''), line: at }
  if (first.trimEnd().endsWith(';') && balanced(first)) return { text: first.replace(/^export /, ''), line: at }
  for (let i = start + 1; i < L.length; i++) {
    if (/^(\};?|\];?|\);?)\s*$/.test(L[i])) return { text: L.slice(start, i + 1).join('\n').replace(/^export /, ''), line: at }
  }
  return null
}

const seen = new Set()
const found = []
const missing = []
for (const n of NEEDED) {
  const r = lift(n)
  if (!r) { missing.push(n); continue }
  if (seen.has(r.text.split('\n')[0])) continue
  seen.add(r.text.split('\n')[0])
  found.push(r)
}
// ⚠️ Source order, not NEEDED order. A declaration that references another has
// to come after it, and the order they appear in the real files is by
// definition an order that already compiles. Sorting by NEEDED order produced
// "used before its declaration" errors.
found.sort((a, b) => a.line - b.line)
const blocks = found.map((r) => r.text)

const out = `/**
 * ⚠️ GENERATED FILE — DO NOT EDIT.
 *
 *   Regenerate: node scripts/build-scoring.mjs
 *   Source:     app/index.tsx  (the single source of truth for scoring)
 *
 * This is PawGrade's real food scorer, lifted verbatim out of the React
 * component so the website and scripts can use it. Editing this file instead of
 * app/index.tsx creates exactly the second source of truth this exists to
 * avoid — the app would keep scoring one way while the site scored another.
 *
 * Generated ${new Date().toISOString().slice(0, 10)} from ${blocks.length} declarations.
 */

// The theme object is only used for colour on flag objects. Stubbed — nothing
// in the scoring math reads it.
const _stub: any = new Proxy(function () {} as any, {
  get: (_o, k) => (k === 'toString' || k === Symbol.toPrimitive ? () => '#000000' : _stub),
  apply: () => _stub,
})
const t: any = _stub

${blocks.join('\n\n')}

export type FoodScore = {
  total: number
  breakdown: { label: string; value: number; severity?: string }[]
  analysis: Record<string, any>
}

/**
 * Score a dog food exactly as the app does.
 *
 * The body below is the same source text as processIngredients() in
 * app/index.tsx, minus the React state setters — which is why it can't drift.
 */
export function scoreFood(
  name: string,
  rawIngredients: string,
  ingredientList: string[],
  sheetProcessingMethod: string,
  knownOmegaRatio?: string | null,
  /** From the Guaranteed Analysis when a label was scanned. In the app this
   *  arrived via React state (nutritionalProfile); here it's explicit. */
  labelOmegaRatio?: string | null,
): FoodScore {
  const customIngredients: any[] = []
${setup}

${scoring}

  return {
    total,
    breakdown,
    analysis: {
      foundHarmful, foundToxicAdditives, foundMeals, foundVitamins, foundLegumes,
      foundCarbs, foundOmega3, foundOmega6, foundFiber, foundProbiotics,
      foundOrgans, foundProduce, foundAntiInflammatory, genericInTop5,
      omegaRatingResult, aafco, tapf, processingResult, dbAudit,
      vitCount, vitPenalty, vitLevel,
    },
  }
}
`

const dest = 'common-sense-dog-ai/lib/scoring.generated.ts'
writeFileSync(dest, out)
console.log(`✅ ${dest}`)
console.log(`   ${blocks.length} declarations lifted · setup ${setxStart - setupStart - 1} lines · scoring ${scoreEnd - scoreStart + 1} lines`)
if (missing.length) console.log(`   ⓘ not found (may not exist): ${missing.join(', ')}`)
