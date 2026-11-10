/**
 * Browse by concern — the one genuinely better idea in the Lovable mock.
 *
 * The A–Z assumes the reader can name the thing. They can't: nobody thinks
 * "I need the yeast article", they think "his ears smell" or "his stomach is
 * off". Six concerns in the owner's words is a far easier door than 45
 * alphabetised titles, and it's the door that leads to both halves of the site
 * at once — the research AND the thing to actually buy or spoon into the bowl.
 *
 * Every `slug` must exist in library-data.ts and every `product` in
 * partners.ts; scripts/check-concerns.mjs fails the build otherwise.
 */

export type Concern = {
  id: string
  label: string
  emoji: string
  /** What the owner actually says, not the clinical term. */
  blurb: string
  /** Library topics, most relevant first. */
  topics: string[]
  /** Things already in the kitchen — the cheapest first move. */
  pantry: { item: string; why: string }[]
  /** Partner product ids from lib/partners.ts. */
  products: string[]
}

export const CONCERNS: Concern[] = [
  {
    id: 'tummy', label: 'Tummy', emoji: '🥣',
    blurb: 'Loose stool, gas, rumbling, or a dog who just went off their food.',
    topics: ['gut-health', 'probiotics-for-dogs', 'leaky-gut-rebuild',
             'gi-and-yeast-conditions', 'gi-motility-recovery-and-colon-support'],
    pantry: [
      { item: 'Plain pumpkin', why: 'Soluble fibre — firms up loose stool and helps the other direction too.' },
      { item: 'Bone broth', why: 'Easy calories and glycine when they will not eat solid food.' },
      { item: 'Slippery elm', why: 'Coats and calms an irritated gut lining. Give away from other supplements.' },
      { item: 'Kefir or plain yoghurt', why: 'Live cultures from food. Check the label is xylitol-free.' },
    ],
    products: ['probiotics'],
  },
  {
    id: 'skin', label: 'Skin & Coat', emoji: '🐾',
    blurb: 'Itching, hot spots, dull coat, smelly paws or ears.',
    topics: ['yeast-in-dogs', 'omega-3-for-dogs', 'gi-and-yeast-conditions', 'fragrance-avoidance'],
    pantry: [
      { item: 'Sardines in water', why: 'The best value omega-3 there is. Half a tin for a medium dog.' },
      { item: 'Coconut oil', why: 'Topical for dry patches. Antimicrobial, and harmless if licked off.' },
      { item: 'Fragrance-free everything', why: 'Shampoo and laundry soap are a common and invisible trigger.' },
    ],
    products: ['fish-oil'],
  },
  {
    id: 'joints', label: 'Joints', emoji: '🦴',
    blurb: 'Slow to get up, stiff in the mornings, hesitating at stairs.',
    topics: ['joints-and-pancreatitis', 'joint-health-research', 'omega-3-for-dogs'],
    pantry: [
      { item: 'Turmeric with fat and pepper', why: 'Absorption is poor without both — that is what golden paste is for.' },
      { item: 'Sardines', why: 'The arthritis trials used far more omega-3 than a wellness dose. Food counts toward it.' },
    ],
    products: ['fish-oil', 'green-lipped-mussel'],
  },
  {
    id: 'calm', label: 'Calm', emoji: '🌙',
    blurb: 'Storms, fireworks, separation, or a senior who paces at night.',
    topics: ['anxiety-calming-and-bloat-gdv', 'cognitive-dysfunction-ccds-disha', 'gut-health'],
    pantry: [
      { item: 'Chamomile tea, cooled', why: 'Poured over food. Mild, and safe to try before anything stronger.' },
      { item: 'A fed gut', why: 'The vagus nerve runs both ways — chronic gut inflammation shows up as behaviour.' },
    ],
    products: ['probiotics'],
  },
  {
    id: 'teeth', label: 'Teeth', emoji: '🦷',
    blurb: 'Bad breath, red gums, or tartar you can see from across the room.',
    topics: ['dental-health-and-vaccines-titers', 'manuka-honey-and-anthocyanins-cancer'],
    pantry: [
      { item: 'Coconut oil on the gums', why: 'Antimicrobial, and most dogs tolerate a finger rub before a brush.' },
      { item: 'Fresh parsley', why: 'Chopped into food. Breath, not plaque — it treats the symptom.' },
    ],
    products: [],
  },
  {
    id: 'immunity', label: 'Immunity', emoji: '🛡️',
    blurb: 'Recovering from something, or an older dog you want to hold steady.',
    topics: ['medicinal-mushrooms', 'cancer-support-and-urinary-health', 'holistic-thyroid-support', 'lipomas-and-organ-diet'],
    pantry: [
      { item: 'Whole-food organ meat', why: 'Liver is the dense one — and the 10% rule applies to liver specifically.' },
      { item: 'Mushrooms, cooked', why: 'Raw is poorly absorbed. Turkey tail and reishi are the studied ones.' },
    ],
    products: ['four-leaf-rover', 'liver-treats'],
  },
]

export const getConcern = (id?: string | null) =>
  CONCERNS.find((c) => c.id === id) ?? null
