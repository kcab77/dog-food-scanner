#!/usr/bin/env node
/**
 * Which topic pages still have no Hershey note.
 *
 * The rule in lib/hershey.ts is that a note must be something Kyle actually did
 * — so the gaps can't be filled by writing harder, only by him telling me what
 * he does. This prints the list so that's a short conversation instead of a
 * hunt through 46 pages.
 *
 *   node scripts/hershey-gaps.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

/** Pull `appliesTo` keys out of lib/hershey.ts without needing a TS loader. */
const hersheySrc = read('lib/hershey.ts')
const covered = new Set(
  [...hersheySrc.matchAll(/'(library|answer|concern|base):([a-z0-9-]+)'/g)].map((m) => `${m[1]}:${m[2]}`),
)
const noteCount = (hersheySrc.match(/^\s{4}id: '/gm) || []).length

/** Every page that could carry one. */
const libSlugs = [...read('lib/library-data.ts').matchAll(/"slug": "([^"]+)"/g)].map((m) => m[1])
const concernIds = [...read('lib/concerns.ts').matchAll(/id: '([^']+)'/g)].map((m) => m[1])
const answerSlugs = [...read('lib/answers-data.ts').matchAll(/^    slug: '([^']+)'/gm)].map((m) => m[1])
const baseSrc = read('lib/base-data.ts')
const MARK = 'export const BASE_SECTIONS: BaseSection[] = '
const baseSections = JSON.parse(
  baseSrc.slice(baseSrc.indexOf(MARK) + MARK.length, baseSrc.indexOf('\n\nexport const BASE_TOTAL_PAIRS')),
)

const groups = [
  ['library', libSlugs, 'Health A–Z'],
  ['answer', answerSlugs, 'Answer pages (SEO entry points)'],
  ['concern', concernIds, 'Remedies'],
  ['base', baseSections.map((s) => s.id), 'The Base'],
]

let totalPages = 0
let totalCovered = 0

for (const [kind, ids, label] of groups) {
  const has = ids.filter((id) => covered.has(`${kind}:${id}`))
  const missing = ids.filter((id) => !covered.has(`${kind}:${id}`))
  totalPages += ids.length
  totalCovered += has.length
  console.log(`\n${label} — ${has.length}/${ids.length} have a Hershey note`)
  if (has.length) console.log(`  ✓ ${has.join(', ')}`)
  if (missing.length) console.log(`  — ${missing.join(', ')}`)
}

console.log(
  `\n${noteCount} notes covering ${totalCovered} of ${totalPages} pages.` +
    `\nA gap is filled by Kyle saying what he did, not by writing something plausible.\n`,
)
