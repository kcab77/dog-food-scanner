// Suggested opening questions shown on an expert's empty chat screen. Optional
// per expert — pulled from topics CONFIRMED to be in their ingested content, so
// a first-time visitor's first click never hits the refusal path. If an expert
// has none configured here, the UI simply skips the suggestion buttons (still a
// perfectly fine "ask me anything" experience) — no code changes are required
// to onboard a new expert, this is purely an optional polish.
export const STARTERS: Record<string, string[]> = {
  'dr-judy-morgan': [
    'What are the benefits of elk velvet antler for dogs?',
    'Why should I care about glyphosate in pet food?',
    'What do teeth and kidneys have in common?',
  ],
  'dr-andrew-jones': [
    'What helps with fireworks anxiety in dogs?',
    'What are safe natural anti-inflammatories for pain relief?',
    'How do I safely remove a tick from my dog?',
  ],
}

export const getStarters = (slug: string): string[] => STARTERS[slug] ?? []
