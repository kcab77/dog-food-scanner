#!/usr/bin/env node
/**
 * THE BASE — generated from the Q&A packs, not hand-written.
 *
 * The problem, in Kyle's words: "I'm not reading the books because they're not
 * organised into sections per problem." Same is true of his own corpus — 73
 * packs accumulated topic by topic over a year, with no shape above the pack.
 *
 * This builds that shape. Every number here is counted from the packs, so it
 * cannot drift: add a pack, re-run, the Base updates. Nothing is asserted that
 * the files don't contain.
 *
 *   node scripts/build-base.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SCRIPTS = here
const OUT = join(here, '..', 'lib', 'base-data.ts')

/** pack file stem -> section. Anything unmapped lands in "Unsorted" and shows up. */
const MAP = {
  gut: ['gut-probiotics','probiotics-protocol','probiotics-gut-health','leaky-gut','leaky-gut-distinction',
        'gi-motility-recovery','sensitive-stomach-gi','post-antibiotic-yeast','fasting-bone-broth'],
  liver: ['kidney-liver','liver-kidney-detox','diabetes','urinary-health'],
  heart: ['heart-holistic-tcvm','heart-holistic'],
  thyroid: ['thyroid-holistic','thyroid-diet-context','thyroid-herbs'],
  joints: ['joints-arthritis','joints-research','pancreatitis'],
  skin: ['yeast','yeast-ears','itchy-skin-allergies'],
  brain: ['cognitive-dysfunction-dogs','anxiety-calming'],
  teeth: ['dental-health','tooth-enamel-remineralization','gums-honey-purple-veg'],
  immune: ['lymphoma','cancer-support','mushrooms','lipomas-holistic','lipomas-evidence','organs-tcvm-lipoma','organ-treat-cheatsheet'],
  airway: ['golpp'],
  omegas: ['omegas','omega-sources'],
  supplements: ['supplements-pack','holistic-expansion','holistic-expansion-batch2','evidence-topics','evidence-topics-batch2','evidence-topics-2026-07-12-batch2'],
  minerals: ['vitamin-mineral-reference','vitamins-minerals-forms'],
  parasites: ['holistic-parasites','flea-tick-isoxazolines','parasite-safety-dosing','zoonotic-parasites'],
  chemicals: ['household-chemicals','fragrance-avoidance','thickeners-aflatoxin'],
  labels: ['reading-labels','processing-methods','aafco-nutrient-profiles','toxic-and-safe-foods',
           'carbs-dogs-requirement','salt-divider-rule','nutrition-philosophy','myth-busters','knowledge-pack'],
  lifestage: ['life-stages','life-stages-senior-protein','breed-predispositions'],
  safety: ['bloat-gdv','heat-exercise-safety','vaccines-titers','vax-spacing-broth-fast','enrichment-toys','lab-exercise-toys'],
  hershey: ['hershey-caselog'],
}

const META = {
  gut:        { label: 'Gut & Digestion', emoji: '🦠', group: 'Organ',    ask: 'Loose stool, gas, food that stopped agreeing with him.' },
  liver:      { label: 'Liver, Kidney & Metabolic', emoji: '💧', group: 'Organ', ask: 'Bad bloodwork, drinking more, a diagnosis.' },
  heart:      { label: 'Heart', emoji: '🫀', group: 'Organ',              ask: 'A murmur, DCM worry, or a grain-free bag.' },
  thyroid:    { label: 'Thyroid', emoji: '🦋', group: 'Organ',            ask: 'Weight gain, thinning coat, low energy.' },
  joints:     { label: 'Joints & Mobility', emoji: '🦴', group: 'Organ',  ask: 'Stiff mornings, slow to stand, stairs.' },
  skin:       { label: 'Skin, Coat & Yeast', emoji: '🐾', group: 'Organ', ask: 'Itching, hot spots, smelly paws and ears.' },
  brain:      { label: 'Brain, Ageing & Anxiety', emoji: '🧠', group: 'Organ', ask: 'Pacing at night, confusion, storms and fireworks.' },
  teeth:      { label: 'Teeth & Gums', emoji: '🦷', group: 'Organ',       ask: 'Bad breath, red gums, visible tartar.' },
  immune:     { label: 'Immune, Lumps & Cancer', emoji: '🛡️', group: 'Organ', ask: 'A lump, a diagnosis, or holding an older dog steady.' },
  airway:     { label: 'Airway & GOLPP', emoji: '🫁', group: 'Organ',     ask: 'A raspy bark, hard breathing, heat intolerance.' },
  omegas:     { label: 'Omega-3 & Fish Oil', emoji: '🐟', group: 'Input', ask: 'Which one, how much, and does the bottle number mean anything.' },
  supplements:{ label: 'Supplements', emoji: '💊', group: 'Input',        ask: 'What is worth buying and what is marketing.' },
  minerals:   { label: 'Vitamins & Minerals', emoji: '⚗️', group: 'Input',ask: 'Chelate vs sulfate vs oxide, and what the label hides.' },
  parasites:  { label: 'Fleas, Ticks & Worms', emoji: '🪳', group: 'Exposure', ask: 'What is actually necessary and what is optional.' },
  chemicals:  { label: 'Chemicals & Household', emoji: '☣️', group: 'Exposure', ask: 'Cleaners, fragrance, thickeners, aflatoxin.' },
  labels:     { label: 'Food & Labels', emoji: '🥣', group: 'Exposure',   ask: 'Reading a bag, processing, AAFCO, toxic foods.' },
  lifestage:  { label: 'Life Stage & Breed', emoji: '📅', group: 'Exposure', ask: 'Puppy, senior, and what your breed is prone to.' },
  safety:     { label: 'Everyday Safety', emoji: '⚠️', group: 'Exposure', ask: 'Bloat, heat, vaccines, toys.' },
  hershey:    { label: "Hershey's Case Log", emoji: '🐕', group: 'Real',  ask: 'One real dog, tracked over time.' },
}

const files = readdirSync(SCRIPTS).filter((f) => f.startsWith('qa-') && f.endsWith('.json'))
const stem = (f) => f.replace(/^qa-/, '').replace(/\.json$/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '').replace(/-\d{4}$/, '')

const sections = {}
let unsorted = []
let totalPairs = 0

for (const f of files) {
  let pairs
  try { pairs = JSON.parse(readFileSync(join(SCRIPTS, f), 'utf8')) } catch { continue }
  if (!Array.isArray(pairs)) continue
  const s = stem(f)
  const key = Object.keys(MAP).find((k) => MAP[k].includes(s))
  if (!key) { unsorted.push(s); continue }
  totalPairs += pairs.length

  // Tier markers the pairs already carry — the honest weight of a section.
  const tiers = { '🟢': 0, '🟡': 0, '🟠': 0, '⚪': 0 }
  const topics = {}
  for (const p of pairs) {
    const a = String(p.answer ?? '')
    for (const e of Object.keys(tiers)) if (a.includes(e)) tiers[e]++
    if (p.topic) topics[p.topic] = (topics[p.topic] ?? 0) + 1
  }
  sections[key] ??= { packs: [], pairs: 0, tiers: { '🟢': 0, '🟡': 0, '🟠': 0, '⚪': 0 }, topics: {}, qa: [] }
  sections[key].packs.push({ file: f, pairs: pairs.length })
  sections[key].pairs += pairs.length
  for (const e of Object.keys(tiers)) sections[key].tiers[e] += tiers[e]
  for (const [t, n] of Object.entries(topics)) sections[key].topics[t] = (sections[key].topics[t] ?? 0) + n
  for (const p of pairs) {
    const a = String(p.answer ?? '').trim()
    const tier = ['🟢', '🟡', '🟠', '⚪'].find((e) => a.includes(e)) ?? ''
    sections[key].qa.push({
      q: String(p.question ?? '').trim(),
      a,
      tier,
      topic: p.topic ?? '',
      source: p.source ?? '',
    })
  }
}

const out = Object.entries(sections)
  .map(([id, v]) => ({
    id, ...META[id],
    pairs: v.pairs,
    packs: v.packs.sort((a, b) => b.pairs - a.pairs),
    tiers: v.tiers,
    topics: Object.entries(v.topics).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t, n]) => ({ t, n })),
    // The pairs themselves, so a section page shows the actual knowledge rather
    // than a count of it. Tier is read off the answer's own marker.
    qa: v.qa
      .sort((a, b) => (a.tier === '' ? 1 : 0) - (b.tier === '' ? 1 : 0))
      .slice(0, 60),
  }))
  .sort((a, b) => b.pairs - a.pairs)

const banner = `/**
 * ⚠️ GENERATED — DO NOT EDIT.  node scripts/build-base.mjs
 *
 * THE BASE: every Q&A pack, grouped into the section an owner would actually
 * arrive at. Counts are read from the files, so they cannot drift.
 *
 * Generated ${new Date().toISOString().slice(0, 10)} — ${out.length} sections, ${totalPairs} pairs.
 */
`
writeFileSync(OUT, banner + `
export type BaseSection = {
  id: string; label: string; emoji: string; group: string; ask: string
  pairs: number
  packs: { file: string; pairs: number }[]
  tiers: Record<string, number>
  topics: { t: string; n: number }[]
  qa: { q: string; a: string; tier: string; topic: string; source: string }[]
}

export const BASE_SECTIONS: BaseSection[] = ${JSON.stringify(out, null, 2)}

export const BASE_TOTAL_PAIRS = ${totalPairs}
`)
console.log(`  ${out.length} sections · ${totalPairs} pairs mapped`)
if (unsorted.length) console.log(`  ⚠️  unmapped packs (${unsorted.length}): ${unsorted.join(', ')}`)
