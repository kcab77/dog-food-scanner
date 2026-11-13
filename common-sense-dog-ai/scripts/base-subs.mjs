/**
 * SUB-SECTIONS for The Base.
 *
 * A section with 127 answers in one list is a pile, not a chapter. Kyle's note:
 * "the gut stuff I need to compartmentalize a little more, it's too much info to
 * absorb at once." These are the compartments, in the order an owner moves
 * through them: is something wrong → what is it → what do I do → what do I buy
 * → what do I feed.
 *
 * Two different orders live here, and conflating them is what made the first
 * attempt misfile things:
 *   - the ARRAY order is the READING order (what the page shows, top to bottom)
 *   - `pri` is the MATCH order (lowest checked first, specific beats general)
 * "Yeast overgrowth" must match before "Probiotics" or every yeast question with
 * the word probiotic in it lands in the wrong drawer — but it must still be READ
 * after it.
 *
 * `pin` is an exact question substring that overrides every regex. Kept visible
 * rather than buried in a regex, because a handful of questions belong to a
 * compartment their words don't advertise.
 *
 * Whatever no rule catches lands in "Filed here, belongs elsewhere" and is
 * SHOWN — a miss has to be visible or it silently disappears from the book.
 */
export const SUBS = {
  gut: [
    { id: 'signs', pri: 13, emoji: '🔎', label: 'Is something actually wrong?',
      blurb: 'Read the stool, the body language, and the lines that mean vet now — before buying anything.',
      pin: ['How can I check my dog', 'Which blood markers', 'normal morning stretch',
            'eats grass but never', 'mucus in my dog', 'sensitive stomach and chronic loose stools'],
      re: /stool|poop|diarrh|vomit|signs my dog|red flag|emergenc|colon or gi|send me to the vet|stop treating my dog|health journal|bowel movements|right after eating|rest after a rich/i },

    { id: 'leaky', pri: 5, emoji: '🚪', label: 'Leaky gut — and whether he has it',
      blurb: 'What the term means, what a test can and cannot show, and how it differs from a bad week.',
      pin: ['one course of antibiotics and a gap in probiotics'],
      re: /leaky gut|zonulin|gut barrier|breaks the gut|\bADR\b|allergic to everything|gas and loose stool/i },

    { id: 'protocol', pri: 4, emoji: '🪜', label: 'The order to do it in',
      blurb: 'Weed, heal, seed. The sequence matters more than any single product on this page.',
      pin: ['weed, heal and seed', 'In what order', 'heal my dog', 'ideal daily gut routine',
            'When should I NOT use a leaky gut'],
      re: /in what order|what order|protocol/i },

    { id: 'probiotics', pri: 10, emoji: '🧫', label: 'Probiotics — choosing and dosing',
      blurb: 'Strain counts, timing, rotation, and why the one you already tried did nothing.',
      pin: ['Which probiotic is best for a dog with itchy skin'],
      re: /probiotic|boulardii|glycocalyx|\bSIBO\b|\bFMT\b/i },

    { id: 'prebiotics', pri: 8, emoji: '🥬', label: 'Prebiotics & real food sources',
      blurb: 'Feeding the bacteria he already has, and the foods that carry them in.',
      pin: ['whole foods that give both'],
      re: /prebiotic|kefir|goat|fermented|whole.?food|natural sources|foods give/i },

    { id: 'enzymes', pri: 6, emoji: '⚗️', label: 'Enzymes & stomach acid',
      blurb: 'What digestive enzymes actually do, when they are needed, and why acid comes first.',
      re: /enzyme|betaine|bromelain|stomach acid/i },

    { id: 'healing', pri: 7, emoji: '🩹', label: 'Repairing the lining',
      blurb: 'L-glutamine, slippery elm, the herbs — and why most of them are deliberately short-term.',
      pin: ['What supplements help leaky gut'],
      re: /glutamine|slippery elm|soothing herb|which herbs|herbs support|cooling or warming|detox or multi-herb/i },

    { id: 'abx', pri: 3, emoji: '💉', label: 'After antibiotics & meds',
      blurb: 'What a course costs the gut, how long recovery really takes, and protecting the stomach.',
      pin: ['Can antibiotics cause leaky gut', 'Can antibiotics cause a yeast infection'],
      re: /antibiotic|NSAID|anti-inflammatory/i },

    { id: 'yeast', pri: 2, emoji: '🍄', label: 'Yeast overgrowth',
      blurb: 'Telling yeast from allergy, what is actually proven, and what the internet oversells.',
      re: /yeast|antifung|candida|apple cider|colloidal silver|pau d'arco|caprylic|oregano|itchy paws/i },

    { id: 'feeding', pri: 9, emoji: '🥣', label: 'Feeding a sensitive gut',
      blurb: 'Diet first. On the evidence it outperforms every supplement on this page.',
      pin: ['hard bones while they'],
      re: /sensitive stomach|enteropathy|\bIBD\b|best diet|pumpkin|fiber|freeze-dried|soak|hard bone|should i avoid/i },

    { id: 'fasting', pri: 1, emoji: '🍲', label: 'Fasting & bone broth',
      blurb: 'Why you would rest the gut at all, what breaks a fast, and how to make the broth.',
      re: /\bfast|bone broth|broth/i },

    { id: 'damage', pri: 11, emoji: '☣️', label: 'What damages the gut',
      blurb: 'Glyphosate, stress, and the exposures that quietly undo the work.',
      re: /destroys|glyphosate|my stress|does stress/i },

    { id: 'downstream', pri: 12, emoji: '🔗', label: 'Gut → the rest of the dog',
      blurb: 'Skin, ears, immunity, behaviour, joints. Why the gut keeps coming up everywhere else.',
      re: /gut-skin|gut health so important|immune system|behaviour|joint pain or thyroid|itchy skin and ear|overall sensitivity|allergies and itchy/i },
  ],
}

export const UNSORTED_SUB = {
  id: 'elsewhere', emoji: '📦', label: 'Filed here, belongs elsewhere',
  blurb: 'Caught in this section’s packs but not actually about it. Move these when editing.',
}

/** First match wins, by `pri`. Pins beat every regex. */
export function classify(sectionId, question) {
  const rules = SUBS[sectionId]
  if (!rules) return null
  for (const r of rules) if ((r.pin || []).some((s) => question.includes(s))) return r.id
  for (const r of [...rules].sort((a, b) => a.pri - b.pri)) if (r.re.test(question)) return r.id
  return UNSORTED_SUB.id
}
