#!/usr/bin/env node
/**
 * Scoring regression check — run this after ANY change to scoring.
 *
 *   node scripts/score-check.mjs
 *
 * WHY THIS EXISTS
 * ---------------
 * Every scoring bug found in this app was invisible to `npx tsc --noEmit` and
 * obvious within ten seconds of actually executing the code:
 *
 *   - a bag of kibble scored as a RAW diet (+25) because the format detector
 *     read the ingredient list, so "Freeze Dried Turkey" as an INGREDIENT made
 *     the whole product freeze-dried
 *   - a treat containing XYLITOL scored 90/100, because the toxic penalty was
 *     capped at 10 while a "simple ingredients" bonus paid +15
 *   - severe and toxic both collapsed to 10, making the entire evidence-tier
 *     system a no-op
 *   - one ingredient charged three times across three overlapping lists
 *
 * Type-checking cannot catch a wrong number. Only running it can.
 *
 * HOW IT WORKS
 * ------------
 * It re-extracts the pure functions and their constants from app/index.tsx on
 * every run, so it can never drift from the real code the way a copy would.
 * Only the pure, testable parts are covered — the main food scorer is inline
 * in the React component and can't be reached from here. That's a known gap,
 * not an oversight: if the food scorer is ever lifted into a pure function,
 * add it below.
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'fs'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'

// Both files, because the score bands live in lib/theme.ts while everything
// else lives in the app. Extracting from only one is how the two drifted apart
// in the first place.
const SRC = readFileSync('app/index.tsx', 'utf8') + '\n' + readFileSync('lib/theme.ts', 'utf8')

/**
 * Grab a top-level `const NAME = ...` or `function NAME(...)` declaration.
 *
 * Brace-matching from the declaration is unreliable here because the type
 * annotations contain braces of their own (`const X: { a: string }[] = [`).
 * These are all TOP-LEVEL declarations in a prettier-formatted file, so the
 * closing token always sits at column 0 — scan for that instead.
 */
function extract(name) {
  const lines = SRC.split('\n')
  const re = new RegExp(`^(export )?(const|function) ${name}\\b`)
  const start = lines.findIndex((l) => re.test(l))
  if (start === -1) throw new Error(`could not find ${name} in app/index.tsx`)
  // Single-line declaration (`const TOXIC_SCORE_CEILING = 15;`) has no closing
  // line of its own. Without this it scans on and swallows the next few
  // declarations whole.
  const first = lines[start]
  const balanced = (str) => {
    let n = 0
    for (const c of str) { if ('{[('.includes(c)) n++; else if ('}])'.includes(c)) n-- }
    return n === 0
  }
  if (first.trimEnd().endsWith(';') && balanced(first)) return first.replace(/^export /, '')
  for (let i = start + 1; i < lines.length; i++) {
    // The closer must be ALONE on the line. A type annotation's `}[] = [`
    // also starts with `}`, and matching that truncates the declaration.
    if (/^(\};?|\];?|\);?)\s*$/.test(lines[i])) {
      return lines.slice(start, i + 1).join('\n').replace(/^export /, '')
    }
  }
  throw new Error(`could not find the end of ${name}`)
}

const NEEDED = [
  'SEVERITY_PENALTIES', 'TREAT_HARMFUL', 'TREAT_OK_INGREDIENTS', 'DENTAL_INGREDIENTS',
  'ADDED_VITAMINS', 'PROBIOTIC_SOURCES', 'SUPERFOODS', 'WHOLE_FOOD_PRODUCE',
  'ANTI_INFLAMMATORY_FOODS', 'SPECIFIC_PROTEIN_TERMS', 'GENERIC_PROTEIN_TERMS',
  'ORGAN_MEATS', 'HIGH_CARB_INGREDIENTS', 'LENTIL_LEGUME',
  'VITAMIN_CONCERN_HIGH', 'VITAMIN_CONCERN_LOW',
  'PROCESSING_METHODS', 'RAW_COATED_KIBBLE', 'RAW_INCLUSION_HINTS', 'TOXIC_SCORE_CEILING',
  'harmfulPenalty', 'mentionsTerm', 'detectProcessingMethod', 'analyseMineralForms',
  'vitaminLoadPenalty', 'analyseSaltDivider', 'bonusEligible', 'saltLinePenalty',
  'scoreTreats', 'scoreLabel', 'scoreLabelEmoji', 'getScoreLabel',
]

// `t` is the theme object; SEVERITY_COLORS and friends touch it. Stub it deeply.
const STUB = `const _d=()=>new Proxy(function(){},{get:(o,k)=>k==="toString"||k==="valueOf"||k===Symbol.toPrimitive?()=>"#000":_d(),apply:()=>_d()});const t=_d();\n`
const seen = new Set()
const blocks = NEEDED.map(extract).filter((b) => {
  const key = b.split('\n')[0]
  if (seen.has(key)) return false
  seen.add(key)
  return true
})
const bundle = STUB + blocks.join('\n\n') +
  `\nexport {${NEEDED.filter(n => /^[a-z]/.test(n)).join(',')}};\n`

const dir = mkdtempSync(join(tmpdir(), 'scorecheck-'))
writeFileSync(join(dir, 'x.ts'), bundle)
execFileSync('npx', ['--yes', 'esbuild', join(dir, 'x.ts'), '--bundle', '--format=esm',
  `--outfile=${join(dir, 'x.mjs')}`, '--log-level=error'], { stdio: 'inherit' })
const S = await import(join(dir, 'x.mjs'))

/* ── assertions ─────────────────────────────────────────────────────────── */
let pass = 0, fail = 0
const check = (label, actual, ok, expected) => {
  const good = ok(actual)
  if (good) pass++; else fail++
  console.log(`  ${good ? '✅' : '❌'} ${label.padEnd(46)} ${String(actual).padEnd(26)}${good ? '' : `want ${expected}`}`)
}
const eq = v => a => a === v
const between = (lo, hi) => a => a >= lo && a <= hi

console.log('\nFORMAT DETECTION  — a bag of kibble must never score as a raw diet')
const fmt = (n, i, m) => S.detectProcessingMethod(n, i, m ?? '')
check('Wellness CORE RawRev + freeze dried topper',
  fmt('Wellness CORE RawRev Puppy', ['Deboned Chicken', 'Freeze Dried Turkey']).bonus, eq(5), 5)
check('Instinct Raw Boost (bare "raw" in name)',
  fmt('Instinct Raw Boost', ['Chicken']).bonus, eq(5), 5)
check('kibble w/ freeze-dried INGREDIENT only',
  fmt('Generic Puppy Food', ['Chicken', 'Freeze Dried Turkey']).bonus, eq(5), 5)
check('Primal Freeze-Dried Nuggets (genuinely FD)',
  fmt('Primal Freeze-Dried Nuggets', ['Chicken']).bonus, eq(25), 25)
check('Stella & Chewys Raw Frozen (genuinely raw)',
  fmt('Stella & Chewys Raw Frozen Patties', ['Beef']).bonus, eq(25), 25)
check('"Rawhide chew" must NOT read as raw',
  fmt('Beef Rawhide Chew', ['Beef Hide']).bonus, eq(0), 0)

console.log('\nSEVERITY  — a bonus must never outvote a poison')
check('toxic is never position-scaled', S.harmfulPenalty('toxic', 25), eq(28), 28)
check('toxic full weight at position 0', S.harmfulPenalty('toxic', 0), eq(28), 28)
check('severe outranks moderate (was both 10)', S.harmfulPenalty('severe', 0), eq(18), 18)
check('moderate', S.harmfulPenalty('moderate', 0), eq(10), 10)
check('mild', S.harmfulPenalty('mild', 0), eq(2), 2)
check('non-toxic still position-scales down', S.harmfulPenalty('severe', 25) < 18, eq(true), 'true')

console.log('\nTREATS  — xylitol scored 90/100 before this was fixed')
const tr = (i, m) => S.scoreTreats(i, m, 'test')
check('peanut butter + XYLITOL', tr(['Peanut Butter', 'Xylitol'], 'baked').score, between(1, 15), '<=15')
check('XYLITOL buried at #12',
  tr(['Beef','Sweet Potato','Oat','Egg','Flax','Kale','Parsley','Mint','Carrot','Apple','Salt','Xylitol'], 'freeze dried').score,
  between(1, 15), '<=15')
check('sugar + propylene glycol (2 ingredients)', tr(['Sugar', 'Propylene Glycol'], 'soft').score, between(1, 20), '<=20')
check('single-ingredient freeze-dried liver', tr(['Beef Liver'], 'freeze dried').score, between(90, 100), '90-100')
check('clean 3-ingredient biscuit', tr(['Sweet Potato','Peanut Butter','Oat Flour'], 'baked').score, between(80, 100), '80-100')

console.log('\nSALT LINE  — sprinkles below it must not earn points')
const NB = ['Chicken','Chicken Meal','Brown Rice','Salt','Blueberries','Kale','Zinc Oxide']
check('salt found at index 3', S.analyseSaltDivider(NB)?.saltIndex, eq(3), 3)
check('blueberries/kale flagged as marketing', S.analyseSaltDivider(NB)?.marketing.length, between(1, 9), '>=1')
check('zinc oxide NOT flagged as marketing', S.analyseSaltDivider(NB)?.marketing.includes('Zinc Oxide'), eq(false), false)
check('bonusEligible strips the sprinkles', S.bonusEligible(NB).length < NB.length, eq(true), 'true')
check('salt at #4 penalised', S.saltLinePenalty(NB).penalty, eq(8), 8)
check('salt at #11 not penalised',
  S.saltLinePenalty(['a','b','c','d','e','f','g','h','i','j','Salt','x']).penalty, eq(0), 0)

console.log('\nMINERAL FORMS  — chelate > sulfate > oxide')
const MF = S.analyseMineralForms(['Zinc Proteinate','Zinc Sulfate','Copper Oxide','Iron Oxide'])
check('oxides detected', MF.oxides.length, eq(2), 2)
check('sulfates detected', MF.sulfates.length, eq(1), 1)
check('chelates detected', MF.chelates.length, eq(1), 1)
check('oxides weigh more than sulfates',
  S.vitaminLoadPenalty(['Copper Oxide']).penalty > S.vitaminLoadPenalty(['Copper Sulfate']).penalty, eq(true), 'true')

console.log('\nLABELS  — band boundaries')
for (const [s, want] of [[95,'Excellent'],[85,'Excellent'],[84,'Good'],[70,'Good'],[69,'Fair'],[50,'Fair'],[35,'Below'],[10,'Low']])
  check(`score ${s}`, S.getScoreLabel(s), a => a.includes(want), want)

console.log(`\n${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
