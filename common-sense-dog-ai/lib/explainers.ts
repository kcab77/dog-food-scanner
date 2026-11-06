/**
 * Maps a scoring-breakdown line to the library topic that explains it.
 *
 * The food pages and the Health A–Z were two disconnected halves of the same
 * site: a food page would say "Poor omega ratio (est. ~12:1)" and there was
 * nowhere to click, while the omega-3 topic that explains exactly that number
 * sat two directories away with nothing linking to it. 38% of food pages had
 * no outbound link at all (single-product brands render no "More from brand"
 * block), which on the pages search traffic actually lands on is a dead end.
 *
 * Order matters — the first pattern that matches a breakdown label wins, so
 * put the specific ones above the general ones.
 */
export type Explainer = { slug: string; label: string }

const RULES: { test: RegExp; slug: string; label: string }[] = [
  { test: /omega/i,                      slug: 'omega-3-for-dogs',        label: 'Why the omega ratio matters more than the dose' },
  { test: /legume|DCM/i,                 slug: 'myth-busters-and-life-stages', label: 'Grain-free, legumes and the DCM question' },
  { test: /sulfate|oxide|chelat|mineral/i, slug: 'mineral-forms',         label: 'Mineral forms: chelate beats sulfate beats oxide' },
  { test: /synthetic vitamin|fortif|vitamin/i, slug: 'vitamins-and-minerals', label: 'Synthetic vitamins vs whole-food nutrients' },
  { test: /salt is ingredient/i,         slug: 'salt-divider-rule',       label: 'The salt divider — reading what sits below it' },
  { test: /processing|format bonus/i,    slug: 'processing-methods',      label: 'How processing changes what survives in the bowl' },
  { test: /organ meat/i,                 slug: 'lipomas-and-organ-diet',  label: 'Organ meats and the 10% liver rule' },
  { test: /AAFCO|feeding trial/i,        slug: 'aafco-nutrient-profiles', label: 'What an AAFCO statement does and does not prove' },
  { test: /carbohydrate|carb source/i,   slug: 'nutrition-philosophy',    label: 'Carbohydrate load, and what it displaces' },
  { test: /generic meal|vague protein/i, slug: 'nutrition-philosophy',    label: 'Named meat vs "meat meal" — why sourcing matters' },
  { test: /toxic additive|preserv/i,     slug: 'toxic-and-safe-foods',    label: 'The additives worth avoiding, and the ones overstated' },
  { test: /probiotic|fermentation/i,     slug: 'probiotics-for-dogs',     label: 'Probiotics — which one, and when' },
]

/** Topics that explain this food's own breakdown, de-duplicated, best first. */
export function explainersFor(breakdown: { label: string }[]): Explainer[] {
  const seen = new Set<string>()
  const out: Explainer[] = []
  for (const line of breakdown) {
    for (const r of RULES) {
      if (seen.has(r.slug)) continue
      if (r.test.test(line.label)) {
        seen.add(r.slug)
        out.push({ slug: r.slug, label: r.label })
        break
      }
    }
  }
  return out.slice(0, 5)
}

/** The topic that explains one flagged ingredient, if we have one. */
export function explainerForFlag(name: string): Explainer | null {
  for (const r of RULES) if (r.test.test(name)) return { slug: r.slug, label: r.label }
  return null
}
