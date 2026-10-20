/**
 * Partner products, and which topics they legitimately belong on.
 *
 * These are Kyle's real Amazon affiliate links — the same seven that the iOS
 * app's SUPPLEMENT_RECS uses, so a reader gets the same recommendation on the
 * web as in the app. Keep them in sync; a link that works in one place and
 * 404s in the other is worse than no link.
 *
 * ⚠️ The mapping is deliberately narrow. The temptation with affiliate
 * content is to put every product on every page, which is how health sites
 * end up recommending joint supplements on a dental article. A product
 * appears on a topic only where the topic's own content argues for it — and
 * `avoidOn` exists because two of Kyle's own rules disagree in one place:
 * green-lipped mussel is in the heart/joint protocol but is avoided for dogs
 * with lipomas, so it must never surface on the lipoma page.
 */

export type Partner = {
  id: string
  name: string
  /** What it's for, in one line. No superlatives, no "miracle". */
  blurb: string
  /** The concrete instruction that makes the recommendation useful. */
  howToUse?: string
  url: string
  emoji: string
  /** Topic slugs where this product is genuinely indicated. */
  topics: string[]
  /** Topic slugs where it must NOT appear even if a tag would match. */
  avoidOn?: string[]
  /** Tags it may fall back to when no topic matches exactly. */
  tags?: string[]
}

export const partners: Partner[] = [
  {
    id: 'probiotics',
    name: 'Probiotics',
    emoji: '🦠',
    blurb:
      'Canine trials show reduced gut and gum inflammation. Most worth it on dry food, or after a course of antibiotics.',
    howToUse: 'Give away from the hot part of a meal — heat kills the live cultures.',
    url: 'https://amzn.to/4dPRAWP',
    topics: [
      'probiotics-for-dogs', 'gut-health', 'leaky-gut-rebuild',
      'post-antibiotic-yeast-overgrowth', 'gi-and-yeast-conditions',
      'leaky-gut-chronic-vs-temporary', 'gi-motility-recovery-and-colon-support',
      'yeast-in-dogs',
    ],
    tags: ['Nutrition'],
  },
  {
    id: 'fish-oil',
    name: 'Fish Oil (Omega-3)',
    emoji: '🐟',
    blurb:
      'The single highest-leverage addition to a kibble bowl — most dry food runs 12:1 to 30:1 omega-6:3 against a 5:1 target.',
    howToUse:
      'Read the EPA and DHA lines and add them, not the headline mg. ~20mg EPA+DHA per lb for wellness; 30–45mg per lb in the arthritis trials.',
    url: 'https://amzn.to/4efzKxO',
    topics: [
      'omega-3-for-dogs', 'joints-and-pancreatitis', 'joint-health-research',
      'lipomas-and-organ-diet', 'cognitive-dysfunction-ccds-disha',
      'processing-methods', 'nutrition-philosophy',
    ],
    tags: ['Nutrition', 'Supplements'],
  },
  {
    id: 'green-lipped-mussel',
    name: 'Green Lipped Mussel',
    emoji: '🫧',
    blurb:
      'Whole-food joint support — omega-3s, glycosaminoglycans and ETA in one ingredient rather than three isolated powders.',
    howToUse: 'Freeze-dried whole mussel, not an extract, if you can get it.',
    url: 'https://amzn.to/4vpJKdX',
    topics: ['joints-and-pancreatitis', 'joint-health-research'],
    // Kyle's own lipoma guidance avoids GLM. Two rules disagree; the dog wins.
    avoidOn: ['lipomas-and-organ-diet'],
  },
  {
    id: 'liver-treats',
    name: 'Liver Treats',
    emoji: '🫀',
    blurb:
      "Freeze-dried liver — vitamin A, B12, folate, iron and copper from food rather than a synthetic premix.",
    howToUse: 'The 10% rule applies to LIVER specifically, not organs in general.',
    url: 'https://amzn.to/4wWcj44',
    topics: ['lipomas-and-organ-diet', 'kidney-liver-and-diabetes', 'tcvm-food-therapy', 'vitamins-and-minerals'],
  },
  {
    id: 'heart-treats',
    name: 'Heart Treats',
    emoji: '💗',
    blurb: 'Taurine and CoQ10 from the organ itself — the TCVM "like feeds like" principle, applied.',
    howToUse: 'Heart is muscle meat, not organ, so it is not capped by the 10% liver rule.',
    url: 'https://amzn.to/4vkvZgs',
    topics: ['tcvm-food-therapy', 'vitamins-and-minerals'],
  },
  {
    id: 'detox-liver',
    name: 'Detox & Liver Support',
    emoji: '🌿',
    blurb: 'Milk thistle and binders, for after a drug course or a known exposure — not as a daily default.',
    howToUse: 'Targeted and time-limited. A healthy liver on a clean diet does not need a daily detox.',
    url: 'https://amzn.to/4dZ2ZDT',
    topics: ['kidney-liver-and-diabetes', 'flea-tick-and-isoxazolines', 'post-antibiotic-yeast-overgrowth'],
  },
  {
    id: 'four-leaf-rover',
    name: 'Four Leaf Rover',
    emoji: '🍄',
    blurb: 'Organic mushroom and herbal blends — the range Kyle reaches for when a protocol calls for a formulated blend.',
    url: 'https://amzn.to/43FJ5sK',
    topics: [
      'medicinal-mushrooms', 'cancer-support-and-urinary-health',
      'supplements-by-benefit', 'holistic-thyroid-support',
      'manuka-honey-and-anthocyanins-cancer',
    ],
    tags: ['Supplements'],
  },
]

/**
 * The products that belong on one topic, best match first.
 * Exact topic matches win; a tag match only fills in, and never more than
 * `limit` so the article doesn't turn into a storefront.
 */
export function partnersForTopic(slug: string, tag?: string, limit = 2): Partner[] {
  const exact = partners.filter((p) => p.topics.includes(slug) && !p.avoidOn?.includes(slug))
  if (exact.length >= limit) return exact.slice(0, limit)
  const byTag = tag
    ? partners.filter(
        (p) =>
          !exact.includes(p) &&
          p.tags?.includes(tag) &&
          !p.avoidOn?.includes(slug),
      )
    : []
  return [...exact, ...byTag].slice(0, limit)
}

export const AFFILIATE_DISCLOSURE =
  'These are affiliate links — if you buy through one, Common Sense Dog earns a small commission at no extra cost to you. They are the products Kyle feeds Hershey; the recommendation is not for sale.'
