/**
 * HERSHEY NOTES — the first thing on a topic page.
 *
 * Kyle's rule: every relevant topic page opens with what he actually did with
 * his own dog, before any general advice. The reason it works is that it is the
 * one thing on the page nobody else can write. A reader can get "coconut oil is
 * popular for dog teeth" anywhere; "I rub it on gauze every other day and he is
 * eight with no tartar" is the site.
 *
 * ── THE ONE RULE FOR EDITING THIS FILE ──────────────────────────────────────
 * Every sentence here must be something Kyle actually said or did. Not what is
 * probably true of a Labrador, not a reasonable inference, not a tidied-up
 * version. If there is no real story for a topic, THE TOPIC GETS NO NOTE and
 * the component renders nothing. An invented anecdote about a real dog is worse
 * than a blank space, because the whole value of this block is that it is true.
 *
 * `npm run hershey:gaps` lists which topics are still missing one.
 *
 * Shape follows Kyle's own teeth example: a `routine` (the boring thing he does
 * all the time) and, where there is one, a `worseCase` (what he reached for
 * when it got bad). That pairing is what makes it useful rather than a quote.
 */

export type HersheyNote = {
  id: string
  /** Short label for the card — what this note is about. */
  heading: string
  /** The everyday thing. First person, Kyle's voice. */
  routine: string
  /** What he did when it got bad. Optional — plenty of topics never escalated. */
  worseCase?: string
  /** What happened. Optional, and only where something actually happened. */
  outcome?: string
  /** Route keys: `library:<slug>`, `answer:<slug>`, `concern:<id>`, `base:<id>`. */
  appliesTo: string[]
}

export const HERSHEY_NOTES: HersheyNote[] = [
  {
    id: 'teeth',
    heading: 'His teeth',
    routine:
      "Coconut oil on a piece of gauze wrapped round my finger, along the gum line, daily or every other day. That's the whole routine. He's eight and there's no tartar on him at all — most dogs have calculus by three.",
    worseCase:
      "When the plaque did build up, I gave him a Himalayan yak chew. It scraped off an unbelievable amount — more than anything else I'd tried.",
    appliesTo: ['library:dental-health-and-vaccines-titers', 'concern:teeth', 'base:teeth',
      'answer:homemade-dog-toothpaste', 'answer:how-to-prevent-dental-disease-in-dogs'],
  },
  {
    id: 'ticks',
    heading: 'Why I came off the chewable',
    routine:
      "He's on The Resistance now — a teaspoon a day in food, and it takes four to six weeks to build up, so you can't start it the week you need it. Rose geranium oil behind each shoulder blade before we go out, and a metal flea comb after. He's black, so I'm never going to see a tick on him; I have to feel it.",
    worseCase:
      "What made me switch was finding a paralysed tick on my bed that had already bitten him, while he was on Simparica. If it does that to a tick's nervous system, I didn't want to know what seven years of it was doing to his liver. I'm in Massachusetts, so stopping was genuinely frightening.",
    outcome:
      "He ran through tall grass for hours on a hike. Five hours later I found two ticks on my bed, two different species. Neither was swollen. Neither had bitten him.",
    appliesTo: [
      'library:flea-tick-and-isoxazolines',
      'library:holistic-parasite-prevention',
      'library:tick-borne-disease-and-collars',
      'base:parasites',
      'answer:natural-flea-and-tick-prevention-for-dogs',
      'answer:are-flea-and-tick-medications-safe-for-dogs',
    ],
  },
  {
    id: 'heartworm',
    heading: 'What I did keep him on',
    routine:
      "Heartgard Plus, monthly, for seven years, and he tolerates it perfectly. I stay on Plus rather than plain Heartgard on purpose — he's on softball fields, beaches and trails, and he swims, so hookworm off wet ground is the real exposure for him. Going holistic on fleas and ticks didn't mean going holistic on everything.",
    appliesTo: ['library:zoonotic-parasites', 'answer:natural-dewormer-for-dogs'],
  },
  {
    id: 'lipomas',
    heading: 'His lumps',
    routine:
      "He has lipomas and I've never had one cut out. Simple Food Project freeze-dried is in his bowl every single day because it's what anchors his omega ratio, and Four Leaf Rover Liver & Kidney Clean does triple duty — the lumps, his liver after the monthly Heartgard, and his kidneys, because he swims constantly.",
    outcome:
      "At eight he carries a lighter lipoma load than most Labs I meet.",
    appliesTo: [
      'library:lipomas-and-organ-diet',
      'answer:how-to-shrink-a-dogs-lipoma',
      'answer:natural-remedies-for-dog-lipomas',
      'answer:is-my-dogs-lump-a-lipoma',
    ],
  },
  {
    id: 'kibble',
    heading: 'Getting him off kibble',
    routine:
      "I didn't do it in one go. He was 50/50 kibble and gently cooked, then 70% cooked / 15% freeze-dried / 15% kibble, then no kibble. AllProvide when it's in stock, Simple Food Project every day, Primal when AllProvide sells out — which it does, often.",
    outcome:
      "The first thing I noticed wasn't his coat. It was that he had more energy than he'd had in years.",
    appliesTo: ['library:processing-methods', 'library:nutrition-philosophy'],
  },
  {
    id: 'omegas',
    heading: 'How he actually gets his omegas',
    routine:
      "Half a can of sardines, and a whole raw egg in the morning. The Simple Food Project does the heavy lifting on the ratio.",
    worseCase:
      "When I moved his AllProvide from chicken to beef, the EPA and DHA dropped from 790mg to 452. The beef is better on almost everything else — the ratio went from 4.8:1 to 1.12:1 — but that one number is exactly why the sardines aren't optional.",
    appliesTo: ['library:omega-3-for-dogs', 'base:omegas', 'answer:can-dogs-eat-eggs'],
  },
  {
    id: 'tcvm',
    heading: 'He runs hot',
    routine:
      "Hershey pants easily and goes looking for cold tile, so I rotate him toward duck and fish, which are the cooling proteins. Chicken is the one I use least as a staple — even though it's what he was on for months.",
    worseCase:
      "I don't get strict about it meal by meal. The goal is that the whole week leans cooling, not that every bowl does.",
    appliesTo: ['library:tcvm-food-therapy'],
  },
  {
    id: 'yeast',
    heading: 'His yeast flare',
    routine:
      "It came after a month off probiotics. That's the thing I'd tell anyone — for him the gap was the cause, not whatever he ate.",
    worseCase:
      "Now I never stack them. The Resistance and Yeast Guard go in one meal, the probiotic goes in the other on its own. The Resistance has neem in it, and neem doesn't know the difference between the yeast you're trying to clear and the bacteria you're trying to keep.",
    appliesTo: [
      'library:yeast-in-dogs',
      'library:post-antibiotic-yeast-overgrowth',
      'library:gi-and-yeast-conditions',
      'concern:skin',
      'base:skin',
      'answer:why-does-my-dog-keep-getting-ear-and-yeast-infections',
      'answer:how-to-help-a-dogs-itchy-skin-naturally',
    ],
  },
  {
    id: 'probiotics',
    heading: 'How I give his probiotic',
    routine:
      "I warm his food to body temperature and add the probiotic after, never before. Live cultures die around 115–120°F; body temperature is where they normally live, so warm food is a non-issue as long as you do it in that order.",
    worseCase:
      "It goes in its own meal, away from The Resistance and Yeast Guard — broad-spectrum herbal antimicrobials will kill a probiotic given alongside them.",
    appliesTo: [
      'library:probiotics-for-dogs',
      'library:gut-health',
      'library:leaky-gut-rebuild',
      'concern:tummy',
      'base:gut',
      'answer:do-probiotics-help-dogs',
      'answer:dog-sensitive-stomach-and-chronic-diarrhea',
    ],
  },
  {
    id: 'joints',
    heading: 'The stiffness I watch for',
    routine:
      "Post-play stiffness is the live symptom with him, not limping. Green lipped mussel went in first, before the fish oil, because it works in about two weeks where fish oil takes six to eight — and I wanted to know quickly whether it was doing anything.",
    appliesTo: [
      'library:joints-and-pancreatitis',
      'library:joint-health-research',
      'concern:joints',
      'base:joints',
      'answer:green-lipped-mussel-for-dogs',
      'answer:how-to-help-dog-arthritis-naturally',
    ],
  },
]

/** All route keys that currently have a note — used by the gap report. */
export const HERSHEY_KEYS = new Set(HERSHEY_NOTES.flatMap((n) => n.appliesTo))

/**
 * The note for a page, or null. Null is the normal case and renders nothing —
 * see the rule at the top of this file.
 */
export function hersheyNoteFor(kind: 'library' | 'concern' | 'base' | 'answer', id: string): HersheyNote | null {
  const key = `${kind}:${id}`
  return HERSHEY_NOTES.find((n) => n.appliesTo.includes(key)) ?? null
}
