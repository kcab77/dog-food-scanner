/**
 * The body map — an entry point into the library that doesn't require knowing
 * what you're looking for.
 *
 * The A–Z assumes the reader can name the thing. They usually can't: an owner
 * doesn't think "I need the yeast article", they think "his ears smell". So
 * the regions are labelled by SYMPTOM, in the owner's words, and the topic
 * title is the secondary line.
 *
 * Every `slug` here must exist in library-data.ts — a hotspot pointing at a
 * 404 is worse than no hotspot. Checked by scripts/check-anatomy.mjs.
 */

export type Region = {
  id: string
  /** What the owner notices — this is the label they read. */
  symptom: string
  /** Where on the body, for the caption. */
  part: string
  slug: string
  /** Hotspot centre in the 420×280 viewBox. */
  x: number
  y: number
}

export const REGIONS: Region[] = [
  { id: 'brain',  part: 'Head',          symptom: 'Confused, pacing, up at night', slug: 'cognitive-dysfunction-ccds-disha', x: 96,  y: 72 },
  { id: 'ears',   part: 'Ears',          symptom: 'Smelly ears, head shaking',     slug: 'yeast-in-dogs',                    x: 120, y: 92 },
  { id: 'mouth',  part: 'Mouth',         symptom: 'Bad breath, red gums',          slug: 'dental-health-and-vaccines-titers',x: 56,  y: 116 },
  { id: 'throat', part: 'Throat',        symptom: 'Raspy bark, hard breathing',    slug: 'laryngeal-paralysis-golpp',        x: 104, y: 136 },
  { id: 'thyroid',part: 'Thyroid',       symptom: 'Weight gain, thinning coat',    slug: 'holistic-thyroid-support',         x: 132, y: 142 },
  { id: 'nodes',  part: 'Lymph nodes',   symptom: 'Swollen glands under the jaw',  slug: 'lymphoma-and-lymph-nodes',         x: 150, y: 124 },
  { id: 'coat',   part: 'Skin & coat',   symptom: 'Itching, dull coat, dandruff',  slug: 'omega-3-for-dogs',                 x: 196, y: 96  },
  { id: 'lumps',  part: 'Under the skin',symptom: 'Soft lumps you can move',       slug: 'lipomas-and-organ-diet',           x: 232, y: 124 },
  { id: 'gut',    part: 'Stomach',       symptom: 'Loose stool, gas, rumbling',    slug: 'gut-health',                       x: 190, y: 156 },
  { id: 'bloat',  part: 'Belly',         symptom: 'Hard, swollen belly — urgent',  slug: 'anxiety-calming-and-bloat-gdv',    x: 162, y: 168 },
  { id: 'organs', part: 'Kidneys & liver',symptom: 'Drinking more, bad bloodwork', slug: 'kidney-liver-and-diabetes',        x: 252, y: 148 },
  { id: 'colon',  part: 'Rear end',      symptom: 'Scooting, straining',           slug: 'gi-motility-recovery-and-colon-support', x: 296, y: 160 },
  { id: 'hips',   part: 'Hips',          symptom: 'Slow to stand, stiff mornings', slug: 'joints-and-pancreatitis',          x: 290, y: 118 },
  { id: 'knees',  part: 'Back legs',     symptom: 'Limping, trouble on stairs',    slug: 'joint-health-research',            x: 300, y: 206 },
  { id: 'paws',   part: 'Paws',          symptom: 'Licking paws, fleas, ticks',    slug: 'flea-tick-and-isoxazolines',       x: 168, y: 232 },
]

/** The dog itself. A field-guide line drawing — side profile, facing left. */
export const DOG_PATHS = {
  // Body outline: muzzle → skull → neck → back → rump → tail base → belly → chest → throat
  body: 'M40 118 L62 110 Q72 106 78 98 Q86 84 100 80 Q114 76 128 86 Q140 94 152 96 L252 92 Q282 90 300 98 Q314 104 318 118 L320 150 Q318 168 308 178 L300 196 L302 232 L292 238 L288 200 L268 190 L214 192 L196 196 L192 232 L182 238 L178 196 Q160 190 148 176 Q138 164 136 148 L134 132 Q120 128 108 132 Q94 136 80 134 Q62 132 48 126 Z',
  ear:  'M112 84 Q126 80 134 92 Q140 104 134 118 Q126 112 118 100 Q114 92 112 84 Z',
  eye:  'M86 98 a3.2 3.2 0 1 0 0.1 0',
  // leg separation + chest line, drawn as light strokes so it reads as anatomy
  detail: 'M196 196 L192 232 M268 190 L264 226 M152 150 Q168 162 190 166 M300 196 L296 230',
}
