// sync-library.mjs — pulls curated Obsidian notes into the website as the
// "Dog Health A-Z" content. Converts each note's markdown -> HTML at build time
// and writes lib/library-data.ts (no runtime markdown dependency).
//
// Re-run whenever you update the notes in Obsidian:
//   node scripts/sync-library.mjs
//
// To add a topic: drop a note in the vault and add an entry to TOPICS below.
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { marked } from 'marked'

const VAULT = process.env.OBSIDIAN_BRAIN_VAULT || join(homedir(), 'Documents', 'Obsidian Vault')

// Curated A-Z topics sourced from the vault. summary = plain-language one-liner
// shown on the index card. letter controls the A-Z bucket.
const TOPICS = [
  {
    slug: 'lymphoma-and-lymph-nodes', title: 'Lymphoma & Swollen Lymph Nodes', letter: 'L',
    emoji: '🎗️', tag: 'Conditions',
    summary: 'One swollen node beside a hot spot is usually that node doing its job. How to tell a reactive node from lymphoma, the five pairs to check, and the dogs who beat the odds.',
    file: 'commonsensedog knowledge/Lymphoma and Swollen Lymph Nodes in Dogs.md',
  },

  {
    slug: 'leaky-gut-rebuild', title: 'Leaky Gut (and how to rebuild the barrier)', letter: 'L',
    emoji: '🧱', tag: 'Conditions',
    summary: 'The gut lining is one cell thick. What breaks the seal, why the symptoms show up as skin and joints and mood instead, and the repair order that actually works.',
    file: 'commonsensedog knowledge/Leaky Gut — The Barrier and How to Rebuild It.md',
  },

  {
    slug: 'yeast-in-dogs', title: 'Yeast in Dogs (the "Frito" problem)', letter: 'Y',
    emoji: '🍄‍🟫', tag: 'Conditions',
    summary: 'Corn-chip smell, orange paw staining, and the 3-8 week at-home detox: what to cut, what to feed, and why it keeps coming back.',
    file: 'commonsensedog knowledge/Yeast in Dogs — The Frito Problem.md',
  },
  {
    slug: 'medicinal-mushrooms', title: 'Medicinal Mushrooms', letter: 'M',
    emoji: '🍄', tag: 'Supplements',
    summary: 'Ten species and what each one actually does — turkey tail for cancer, reishi for allergies, lion\'s mane for the ageing brain.',
    file: 'commonsensedog knowledge/Medicinal Mushrooms for Dogs.md',
  },
  {
    slug: 'mineral-forms', title: 'Mineral Forms (chelate vs sulfate vs oxide)', letter: 'M',
    emoji: '🔬', tag: 'Nutrition',
    summary: 'The part of the label almost nobody can read, and where cheap foods and good ones actually separate. Plus why copper runs backwards.',
    file: 'commonsensedog knowledge/Mineral Forms — Chelate vs Sulfate vs Oxide.md',
  },
  {
    slug: 'omega-3-for-dogs', title: 'Omega-3 (ratios, sources, dosing)', letter: 'O',
    emoji: '🐟', tag: 'Nutrition',
    summary: 'Why the ratio on the bag is usually flattered by flaxseed, what EPA and DHA actually do, and how much your dog needs by weight.',
    file: 'commonsensedog knowledge/Omega-3 for Dogs — Ratios, Sources and Dosing.md',
  },
  {
    slug: 'gut-health', title: 'Gut Health & Leaky Gut', letter: 'G',
    emoji: '🌱', tag: 'Conditions',
    summary: 'The gut-skin and gut-brain axes, how leaky gut actually works, and the probiotic activation step almost everyone skips.',
    file: 'commonsensedog knowledge/Gut Health — The Garden Within.md',
  },
  {
    slug: 'tcvm-food-therapy', title: 'TCVM Food Therapy', letter: 'T',
    emoji: '☯️', tag: 'Nutrition',
    summary: 'Hot dogs and cold dogs, cooling and warming proteins, and how preparation changes a food\'s energy — plus where it disagrees with the numbers.',
    file: 'commonsensedog knowledge/TCVM Food Therapy — The Energetic Bowl.md',
  },

  {
    slug: 'flea-tick-and-isoxazolines', title: 'Fleas, Ticks & Isoxazolines', letter: 'F',
    emoji: '🚩', tag: 'Parasite Prevention',
    summary: 'How Bravecto/NexGard/Simparica actually work, their risks, and natural flea & tick prevention that repels before the bite.',
    file: 'commonsensedog knowledge/Flea Tick and Isoxazoline Safety.md',
  },
  {
    slug: 'supplements-by-benefit', title: 'Supplements (by what they help)', letter: 'S',
    emoji: '💊', tag: 'Supplements',
    summary: 'Joint, anti-inflammatory, gut, immune & calming supplements — what the canine evidence actually shows for each.',
    file: 'commonsensedog knowledge/Supplement Evidence by Benefit.md',
  },
  {
    slug: 'processing-methods', title: 'Food Processing Methods', letter: 'P',
    emoji: '🔥', tag: 'Nutrition',
    summary: 'Raw, freeze-dried, gently cooked, kibble — how each is made and what processing does to the nutrients.',
    file: 'Brain/Nutrition/Processing Methods.md',
  },
  {
    slug: 'vitamins-and-minerals', title: 'Vitamins & Minerals', letter: 'V',
    emoji: '🧪', tag: 'Nutrition',
    summary: 'Good vs bad forms — why chelated minerals beat oxides/sulfates, and which synthetic vitamins to avoid.',
    file: 'Brain/Nutrition/Vitamins and Minerals.md',
  },
  {
    slug: 'lipomas-and-organ-diet', title: 'Lipomas & Organ-Support Diet', letter: 'L',
    emoji: '🧬', tag: 'Nutrition',
    summary: 'The diet levers that slow fatty-tumor growth — low carb, a 5:1 omega ratio, and "like feeds like" organ support.',
    file: 'Brain/Nutrition/Organs and Lipoma Diet.md',
  },
  {
    slug: 'nutrition-philosophy', title: 'Nutrition Philosophy', letter: 'N',
    emoji: '🥩', tag: 'Nutrition',
    summary: 'The whole-food-first, inflammation-is-the-root approach behind every recommendation on this site.',
    file: 'Brain/Nutrition/Nutrition Philosophy.md',
  },
  {
    slug: 'hersheys-health-protocol', title: "Hershey's Health Protocol", letter: 'H',
    emoji: '🐾', tag: 'Real Routines',
    summary: "Exactly what Kyle does for his own 75lb Lab — diet, supplements, dental, and the natural flea/tick stack.",
    file: 'Brain/People/Hershey Health Protocol.md',
  },
  {
    slug: 'aafco-nutrient-profiles', title: 'AAFCO Nutrient Profiles — Minimums, Maximums & Therapeutic Doses', letter: 'A',
    emoji: '📊', tag: 'Reference',
    summary: 'Official AAFCO minimums/maximums for protein, fat, vitamins & minerals, plus how therapeutic supplement doses compare to the bare minimum.',
    file: 'commonsensedog knowledge/AAFCO Dog Food Nutrient Profiles — Minimums, Maximums & Therapeutic Doses.md',
  },
  {
    slug: 'anxiety-calming-and-bloat-gdv', title: 'Anxiety/Calming & Bloat/GDV', letter: 'A',
    emoji: '😰', tag: 'Conditions',
    summary: 'Evidence-graded calming protocols (L-theanine, DAP, probiotics) plus bloat/GDV emergency signs and myth-busting on raised bowls.',
    file: 'commonsensedog knowledge/Anxiety-Calming and Bloat-GDV (protocol packs).md',
  },
  {
    slug: 'breed-aware-health-and-diet-flags', title: 'Breed-Aware Health & Diet Flags', letter: 'B',
    emoji: '🐕', tag: 'Conditions',
    summary: 'Which health risks and diet adjustments matter most for specific breeds — from MDR1 sensitivity to breed-linked disease predispositions.',
    file: 'commonsensedog knowledge/Breed-Aware Health and Diet Flags.md',
  },
  {
    slug: 'cancer-support-and-urinary-health', title: 'Cancer Support & Urinary Health', letter: 'C',
    emoji: '🎗️', tag: 'Conditions',
    summary: 'Evidence-graded cancer prevention/support (obesity, omega-3, turkey-tail) and urinary health (struvite vs oxalate, hydration, cranberry caution).',
    file: 'commonsensedog knowledge/Cancer Support and Urinary Health (protocol packs).md',
  },
  {
    slug: 'cognitive-dysfunction-ccds-disha', title: 'Cognitive Dysfunction (CCDS/DISHA)', letter: 'C',
    emoji: '🧠', tag: 'Conditions',
    summary: 'DISHA symptom framing for canine cognitive decline, mimics to rule out first, and diet/enrichment support.',
    file: 'commonsensedog knowledge/Cognitive Dysfunction - CCDS DISHA (2026-07-12).md',
  },
  {
    slug: 'gi-and-yeast-conditions', title: 'Sensitive Stomach, GI Issues & Yeast/Ear Infections', letter: 'S',
    emoji: '🤢', tag: 'Conditions',
    summary: 'Evidence-graded approaches to chronic diarrhea/IBD and yeast/ear infections — including an honest look at the sugar-feeds-yeast myth.',
    file: 'commonsensedog knowledge/Condition Packs - GI and Yeast (evidence-graded).md',
  },
  {
    slug: 'joints-and-pancreatitis', title: 'Joints/Arthritis & Pancreatitis', letter: 'J',
    emoji: '🦴', tag: 'Conditions',
    summary: 'Evidence-graded joint/arthritis support (omega-3 strong, glucosamine mixed) and low-fat pancreatitis management.',
    file: 'commonsensedog knowledge/Condition Packs - Joints and Pancreatitis (evidence-graded).md',
  },
  {
    slug: 'kidney-liver-and-diabetes', title: 'Kidney, Liver & Diabetes Support', letter: 'K',
    emoji: '🫘', tag: 'Conditions',
    summary: 'Evidence-graded kidney (phosphorus control) and liver support (copper-storage hepatitis), plus honest diabetes management — no "natural cure" myths.',
    file: 'commonsensedog knowledge/Condition Packs - Kidney Liver and Diabetes (evidence-graded).md',
  },
  {
    slug: 'dental-health-and-vaccines-titers', title: 'Dental Health & Vaccines/Titers', letter: 'D',
    emoji: '🦷', tag: 'Conditions',
    summary: 'Brushing as gold-standard dental care (with anesthesia-free and raw-bone myths addressed), plus vaccine core-schedule and titer-testing guidance.',
    file: 'commonsensedog knowledge/Dental Health and Vaccines-Titers (protocol packs).md',
  },
  {
    slug: 'evidence-based-holistic-topics', title: 'Evidence-Based Holistic Topics — Overview', letter: 'E',
    emoji: '🔬', tag: 'Supplements',
    summary: 'A research roundup covering omega-3 for arthritis, probiotics, curcumin, CBD, MCT for cognitive decline, green-lipped mussel, and more — each graded by evidence strength.',
    file: 'commonsensedog knowledge/Evidence-Based Holistic Topics (2026-07-12).md',
  },
  {
    slug: 'evidence-based-holistic-topics-batch-2', title: 'Evidence-Based Holistic Topics — Batch 2', letter: 'E',
    emoji: '🔬', tag: 'Supplements',
    summary: "More evidence-graded supplements — SAMe, glucosamine/chondroitin, boswellia, melatonin, cranberry (myth-corrected), quercetin, yucca, and Lion's Mane.",
    file: 'commonsensedog knowledge/Evidence-Based Holistic Topics Batch 2 (2026-07-12).md',
  },
  {
    slug: 'fasting-and-bone-broth', title: 'Fasting & Bone Broth for Dogs', letter: 'F',
    emoji: '🍲', tag: 'Nutrition',
    summary: 'When intermittent fasting makes sense for dogs, and how a frozen bone-broth ball helps restless fasting days.',
    file: 'commonsensedog knowledge/Fasting and Bone Broth for Dogs.md',
  },
  {
    slug: 'fragrance-avoidance', title: 'Fragrance Avoidance — Toys, Shampoo & Pet Products', letter: 'F',
    emoji: '🌸', tag: 'Safety',
    summary: 'Why fragrance-free beats "unscented," the ingredient-list trick for spotting hidden fragrance, and where it matters most.',
    file: 'commonsensedog knowledge/Fragrance Avoidance - Toys, Shampoo, Products (2026-07-14).md',
  },
  {
    slug: 'gi-motility-recovery-and-colon-support', title: 'GI Motility, Recovery & Colon Support', letter: 'G',
    emoji: '🌀', tag: 'Conditions',
    summary: 'How gut motility recovers after illness or antibiotics, red-flag stool signs, and colon-support strategies.',
    file: 'commonsensedog knowledge/GI Motility Recovery and Colon Support.md',
  },
  {
    slug: 'heat-and-exercise-safety', title: 'Heat & Exercise Safety for Dogs', letter: 'H',
    emoji: '☀️', tag: 'Safety',
    summary: 'Heatstroke risk factors, humidity vs temperature, and safe exercise guidelines for hot weather.',
    file: 'commonsensedog knowledge/Heat and Exercise Safety for Dogs.md',
  },
  {
    slug: 'post-antibiotic-yeast-overgrowth', title: 'Post-Antibiotic Yeast Overgrowth (Case Study)', letter: 'P',
    emoji: '🧫', tag: 'Real Routines',
    summary: "A real recovery protocol after antibiotics disrupted gut flora and triggered yeast overgrowth — confidence-tagged, from Kyle's own dog.",
    file: 'commonsensedog knowledge/Hershey Case - Post-Antibiotic Yeast Overgrowth.md',
  },
  {
    slug: 'holistic-parasite-prevention', title: 'Holistic Parasite Prevention & Natural Deworming', letter: 'H',
    emoji: '🪱', tag: 'Parasite Prevention',
    summary: 'Natural deworming options and prevention strategies, with honest notes on where they fall short of pharmaceutical dewormers.',
    file: 'commonsensedog knowledge/Holistic Parasite Prevention and Natural Deworming.md',
  },
  {
    slug: 'holistic-thyroid-support', title: 'Thyroid Support for Dogs', letter: 'T',
    emoji: '🦋', tag: 'Conditions',
    summary: 'Diet and herbal support for hypothyroidism — honest on "no natural cure, levothyroxine is standard" plus iodine-excess and glandular-safety warnings.',
    file: 'commonsensedog knowledge/Holistic Thyroid Support (organ series 1).md',
  },
  {
    slug: 'holistic-topics-expansion', title: 'Holistic Topics Expansion', letter: 'H',
    emoji: '🌿', tag: 'Supplements',
    summary: 'Seventeen topics from colostrum and L-theanine to bone broth, ACV, and TCVM energetics — each graded by evidence.',
    file: 'commonsensedog knowledge/Holistic Topics Expansion (2026-07-17).md',
  },
  {
    slug: 'holistic-topics-expansion-batch-2', title: 'Holistic Topics Expansion — Batch 2', letter: 'H',
    emoji: '🌿', tag: 'Supplements',
    summary: 'More topics — raw goat milk/kefir, green tripe, PEA, eggshell membrane, spirulina, and a hard-flagged warning on garlic for fleas.',
    file: 'commonsensedog knowledge/Holistic Topics Expansion Batch 2 (2026-07-21).md',
  },
  {
    slug: 'joint-health-research', title: 'Joint Health Research (Citation-Backed)', letter: 'J',
    emoji: '🦴', tag: 'Supplements',
    summary: 'Named-study evidence for joint supplements, sourced directly from researchers like Marshall, Roush, Stabile, and Kampa.',
    file: 'commonsensedog knowledge/Joint Health Research (citation-backed pack).md',
  },
  {
    slug: 'leaky-gut-chronic-vs-temporary', title: 'Leaky Gut — Chronic vs Temporary', letter: 'L',
    emoji: '🩹', tag: 'Conditions',
    summary: "How to tell a temporary gut disruption from true chronic leaky gut, with a real-world ruling from Hershey's case.",
    file: 'commonsensedog knowledge/Leaky Gut - Chronic vs Temporary (Hershey ruling).md',
  },
  {
    slug: 'manuka-honey-and-anthocyanins-cancer', title: 'Manuka Honey (Gums) & Anthocyanins for Cancer', letter: 'M',
    emoji: '🍯', tag: 'Supplements',
    summary: 'Topical manuka honey for gum health plus anthocyanin/purple-produce research on cancer — with an honest "in vitro isn\'t a cure" caveat.',
    file: 'commonsensedog knowledge/Manuka Honey Gums + Anthocyanins-Cancer (2026-07-14).md',
  },
  {
    slug: 'myth-busters-and-life-stages', title: 'Myth-Busters & Life Stages', letter: 'M',
    emoji: '💥', tag: 'Nutrition',
    summary: 'Grain-free/DCM nuance, by-products, AAFCO, and raw myths — plus puppy/senior life-stage nutrition facts.',
    file: 'commonsensedog knowledge/Myth-Busters and Life Stages (evidence-graded).md',
  },
  {
    slug: 'salt-divider-rule', title: 'The Salt Divider Rule', letter: 'S',
    emoji: '🧂', tag: 'Nutrition',
    summary: 'A label-reading heuristic — everything listed after salt on an ingredient panel is trace-level, and how the ingredient-splitting trick hides it.',
    file: 'commonsensedog knowledge/Salt Divider Rule (2026-07-19).md',
  },
  {
    slug: 'toxic-and-safe-foods', title: 'Toxic & Safe Foods for Dogs', letter: 'T',
    emoji: '⚠️', tag: 'Safety',
    summary: 'Real toxicology data on human foods that are dangerous (or fine) for dogs — chocolate, grapes, xylitol, onions, and more.',
    file: 'commonsensedog knowledge/Toxic and Safe Foods for Dogs.md',
  },
  {
    slug: 'zoonotic-parasites', title: 'Zoonotic Parasites (Dog to Human)', letter: 'Z',
    emoji: '🔬', tag: 'Parasite Prevention',
    summary: 'Which dog parasites can spread to people, real transmission risk, and anti-alarmist prevention guidance.',
    file: 'commonsensedog knowledge/Zoonotic Parasites (dog to human).md',
  },
]

function cleanMarkdown(md) {
  return md
    .replace(/^---\n[\s\S]*?\n---\n?/, '') // YAML frontmatter
    .replace(/^#\s+.*(\n|$)/, '')          // leading H1 (the page shows the title already)
    .trim()
}

const out = []
for (const t of TOPICS) {
  let md
  try {
    md = readFileSync(join(VAULT, t.file), 'utf-8')
  } catch {
    console.warn(`⚠️  skipping (note not found): ${t.file}`)
    continue
  }
  const html = marked.parse(cleanMarkdown(md))
  out.push({
    slug: t.slug, title: t.title, summary: t.summary, letter: t.letter,
    emoji: t.emoji, tag: t.tag, source: t.file, contentHtml: html,
  })
  console.log(`✓ ${t.title}`)
}

const file = `// AUTO-GENERATED by scripts/sync-library.mjs — do not edit by hand.
// Source: curated Obsidian notes. Re-run \`node scripts/sync-library.mjs\` to update.

export interface LibraryTopic {
  slug: string
  title: string
  summary: string
  letter: string
  emoji: string
  tag: string
  source: string
  contentHtml: string
}

export const libraryTopics: LibraryTopic[] = ${JSON.stringify(out, null, 2)}
`

writeFileSync(join(process.cwd(), 'lib', 'library-data.ts'), file, 'utf-8')
console.log(`\n📚 Wrote lib/library-data.ts — ${out.length} topics.`)
