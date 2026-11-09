/**
 * Notebooks — the NotebookLM pattern, over our own corpus.
 *
 * One assistant searching all 999 pairs has a precision problem: ask about
 * joints and a lymphoma chunk can still score above threshold, because
 * embeddings measure similarity, not relevance. Scoping the search to the tags
 * that belong to a subject fixes that — the same reason NotebookLM answers
 * better than a general chatbot. It is a metadata filter, not a new system.
 *
 * Each notebook is a named set of `topic` tags already present on the vectors.
 * Tags not listed anywhere are still reachable: a question that matches no
 * notebook falls through to an unfiltered search, which is the correct default.
 * Never silently answer from a narrower corpus than the question deserves.
 */

export type Notebook = {
  id: string
  title: string
  blurb: string
  emoji: string
  /** Pinecone `topic` values this notebook searches. */
  topics: string[]
  /** Words that route a question here when the user hasn't picked a notebook. */
  routes: string[]
}

export const NOTEBOOKS: Notebook[] = [
  {
    id: 'gut',
    title: 'Gut & Digestion',
    blurb: 'Probiotics, leaky gut, yeast, loose stool and the order to fix them in.',
    emoji: '🦠',
    topics: ['gut-probiotics', 'probiotics', 'probiotics-gut-health', 'leaky-gut', 'yeast',
      'yeast-ears', 'post-antibiotic-yeast', 'fmt-gi-health', 'sensitive-stomach-gi',
      'bovine-colostrum-immune-gut', 'fasting-bone-broth'],
    routes: ['gut', 'probiotic', 'leaky', 'yeast', 'diarrhea', 'diarrhoea', 'stool', 'poop',
      'bloating', 'gas', 'digest', 'stomach', 'colitis', 'ibd', 'constipat'],
  },
  {
    id: 'joints',
    title: 'Joints & Mobility',
    blurb: 'Arthritis, green-lipped mussel, turmeric and what the trials actually showed.',
    emoji: '🦴',
    topics: ['joints-arthritis', 'joints-research', 'green-lipped-mussel-joints',
      'curcumin-turmeric-inflammation', 'omegas', 'omega-sources'],
    routes: ['joint', 'arthrit', 'hip', 'limp', 'stiff', 'mobility', 'glucosamine',
      'mussel', 'turmeric', 'curcumin', 'cartilage', 'dysplasia'],
  },
  {
    id: 'lumps',
    title: 'Lumps & Cancer',
    blurb: 'Lipomas, lymphoma, cancer support and the organ-feeding diet.',
    emoji: '🔬',
    topics: ['lipomas', 'lymphoma', 'cancer-support', 'organs-tcvm-lipoma', 'mushrooms'],
    routes: ['lipoma', 'lump', 'bump', 'tumor', 'tumour', 'cancer', 'lymphoma', 'mass',
      'mushroom', 'turkey tail', 'swollen'],
  },
  {
    id: 'skin',
    title: 'Skin, Coat & Allergies',
    blurb: 'Itching, hot spots, ear infections and the food connection.',
    emoji: '🐾',
    topics: ['itchy-skin-allergies', 'yeast', 'yeast-ears', 'omegas', 'omega-sources',
      'household-chemicals', 'fragrance-avoidance'],
    routes: ['itch', 'scratch', 'skin', 'coat', 'allerg', 'hot spot', 'paw', 'ear infection',
      'shedding', 'hives', 'rash', 'dandruff'],
  },
  {
    id: 'food',
    title: 'Food & Labels',
    blurb: 'Reading an ingredient list, processing methods, AAFCO and mineral forms.',
    emoji: '🥣',
    topics: ['reading-labels', 'processing-methods', 'aafco-nutrient-profiles',
      'vitamins-minerals-forms', 'carbohydrates', 'salt-divider-rule', 'nutrition-philosophy',
      'myth-busters', 'life-stages', 'toxic-and-safe-foods'],
    routes: ['ingredient', 'label', 'kibble', 'raw', 'freeze', 'aafco', 'brand', 'food',
      'protein', 'grain', 'carb', 'filler', 'preservative', 'by-product', 'toxic', 'safe to eat'],
  },
  {
    id: 'organs',
    title: 'Organs & Chronic Conditions',
    blurb: 'Heart, kidney, liver, thyroid, diabetes and pancreatitis.',
    emoji: '🫀',
    topics: ['heart', 'heart-holistic', 'kidney-liver', 'thyroid', 'diabetes', 'pancreatitis',
      'urinary-health', 'golpp'],
    routes: ['heart', 'kidney', 'liver', 'thyroid', 'diabet', 'pancreat', 'urinary', 'uti',
      'bladder', 'golpp', 'laryngeal', 'dcm', 'taurine'],
  },
  {
    id: 'parasites',
    title: 'Fleas, Ticks & Worms',
    blurb: 'Isoxazolines, natural prevention, heartworm and what crosses to humans.',
    emoji: '🪳',
    topics: ['holistic-parasites', 'parasite-safety-dosing', 'zoonotic-parasites'],
    routes: ['flea', 'tick', 'worm', 'heartworm', 'parasite', 'simparica', 'nexgard',
      'bravecto', 'isoxazoline', 'giardia', 'mange', 'dewormer'],
  },
  {
    id: 'behaviour',
    title: 'Anxiety & Everyday Safety',
    blurb: 'Calming support, bloat risk, heat, dental care and vaccines.',
    emoji: '🧠',
    topics: ['anxiety-calming', 'l-theanine-anxiety', 'bloat-gdv', 'heat-exercise-safety',
      'dental-health', 'tooth-enamel-remineralization', 'vaccines-titers'],
    routes: ['anxiety', 'anxious', 'stress', 'fear', 'noise', 'thunder', 'firework', 'calm',
      'bloat', 'gdv', 'heat', 'teeth', 'tooth', 'dental', 'breath', 'vaccin', 'titer'],
  },
]

export const getNotebook = (id?: string | null) =>
  NOTEBOOKS.find((n) => n.id === id) ?? null

/**
 * Pick a notebook from the question itself, for the case where the user just
 * started typing instead of choosing one. Scores by how many of a notebook's
 * route words appear; ties and misses return null so the search stays global.
 *
 * Deliberately conservative: a wrong notebook is worse than no notebook,
 * because it hides the right answer instead of merely failing to narrow.
 */
export function routeToNotebook(question: string): Notebook | null {
  const q = (question || '').toLowerCase()
  if (q.length < 8) return null
  let best: Notebook | null = null
  let bestScore = 0
  let tied = false
  for (const nb of NOTEBOOKS) {
    const score = nb.routes.reduce((n, w) => (q.includes(w) ? n + 1 : n), 0)
    if (score > bestScore) { best = nb; bestScore = score; tied = false }
    else if (score === bestScore && score > 0) tied = true
  }
  return bestScore > 0 && !tied ? best : null
}
