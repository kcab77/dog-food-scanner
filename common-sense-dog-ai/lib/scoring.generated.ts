/**
 * ⚠️ GENERATED FILE — DO NOT EDIT.
 *
 *   Regenerate: node scripts/build-scoring.mjs
 *   Source:     app/index.tsx  (the single source of truth for scoring)
 *
 * This is PawGrade's real food scorer, lifted verbatim out of the React
 * component so the website and scripts can use it. Editing this file instead of
 * app/index.tsx creates exactly the second source of truth this exists to
 * avoid — the app would keep scoring one way while the site scored another.
 *
 * Generated 2026-09-11 from 55 declarations.
 */

// The theme object is only used for colour on flag objects. Stubbed — nothing
// in the scoring math reads it.
const _stub: any = new Proxy(function () {} as any, {
  get: (_o, k) => (k === 'toString' || k === Symbol.toPrimitive ? () => '#000000' : _stub),
  apply: () => _stub,
})
const t: any = _stub

type Severity = 'mild' | 'moderate' | 'severe' | 'toxic';

type Category = 'preservative' | 'filler' | 'synthetic' | 'toxin' | 'additive' | 'sweetener' | 'other';

interface CustomIngredient {
  id: string;
  term: string;
  reason: string;
  severity: Severity;
  category: Category;
  sources: string;
}

type SafetyRating = 'safe' | 'caution' | 'danger' | 'avoid'

type FormQuality = 'best' | 'acceptable' | 'poor' | 'avoid'

interface VitaminEntry {
  name: string
  category: 'fat-soluble' | 'water-soluble'
  safetyRating: SafetyRating
  syntheticForms: string[]        // forms added to pet food
  syntheticFormQuality: FormQuality
  preferredNaturalSources: string
  longTermRisk: string
  organsAffected: string
  safeDailyRange: string
  appFlag: string                 // what to show in app
  combinationFlags?: string[]     // other ingredients that compound the risk
}

interface MineralEntry {
  name: string
  category: 'macro' | 'trace' | 'electrolyte'
  safetyRating: SafetyRating
  syntheticForms: string[]
  preferredForms: string[]        // better bioavailable forms
  poorForms: string[]             // cheap/poor quality forms
  syntheticFormQuality: FormQuality
  longTermRisk: string
  organsAffected: string
  safeDailyRange: string
  appFlag: string
  breedWarnings?: string[]        // specific breeds at elevated risk
  combinationFlags?: string[]
}

const VITAMIN_DATABASE: VitaminEntry[] = [
  {
    name: 'Vitamin A',
    category: 'fat-soluble',
    safetyRating: 'caution',
    syntheticForms: ['retinyl palmitate', 'retinyl acetate', 'vitamin a supplement', 'vitamin a acetate'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Liver, fish oil, egg yolk — whole food sources are preferred',
    longTermRisk: 'Accumulates in fat — excess causes bone pain, soft tissue calcification, liver damage (hypervitaminosis A)',
    organsAffected: 'Liver, bones, kidneys, skin',
    safeDailyRange: '50–100 IU/kg body weight/day',
    appFlag: '⚠️ Fat-soluble — accumulates. Double-flag if product contains liver AND synthetic Vitamin A — excess risk.',
    combinationFlags: ['liver', 'chicken liver', 'beef liver'],
  },
  {
    name: 'Vitamin B1 (Thiamine)',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['thiamine mononitrate', 'thiamine hydrochloride', 'thiamine hcl'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Whole grains, meat, organ meats',
    longTermRisk: 'Deficiency more dangerous than excess. Excess excreted in urine.',
    organsAffected: 'Brain, nervous system, heart',
    safeDailyRange: '0.02 mg/kg body weight/day',
    appFlag: 'Safe synthetic form. Deficiency causes neurological issues.',
  },
  {
    name: 'Vitamin B2 (Riboflavin)',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['riboflavin', 'riboflavin supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Organ meats, eggs, whole foods',
    longTermRisk: 'Minimal toxicity. Excess excreted safely.',
    organsAffected: 'Eyes, skin, liver, adrenal glands',
    safeDailyRange: '0.05 mg/kg body weight/day',
    appFlag: 'Safe. Synthetic form nearly identical to natural.',
  },
  {
    name: 'Vitamin B3 (Niacin)',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['niacin', 'niacinamide', 'niacin supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Meat, fish, organ meats',
    longTermRisk: 'High doses: liver damage, GI issues. Deficiency causes black tongue disease in dogs.',
    organsAffected: 'Liver, skin, GI tract',
    safeDailyRange: '0.45 mg/kg body weight/day',
    appFlag: 'Generally safe. Flag absence in budget foods.',
  },
  {
    name: 'Vitamin B6 (Pyridoxine)',
    category: 'water-soluble',
    safetyRating: 'caution',
    syntheticForms: ['pyridoxine hydrochloride', 'pyridoxine hcl', 'vitamin b6 supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Meat, fish, poultry, whole grains',
    longTermRisk: 'Chronic excess causes peripheral neuropathy — nerve damage in limbs, loss of coordination.',
    organsAffected: 'Nervous system, liver, kidneys',
    safeDailyRange: '0.04 mg/kg body weight/day',
    appFlag: '⚠️ Safe at normal levels but toxic in chronic excess. Flag very high B6.',
  },
  {
    name: 'Vitamin B12 (Cobalamin)',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['cyanocobalamin', 'methylcobalamin', 'vitamin b12 supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Organ meats, meat, fish, eggs',
    longTermRisk: 'Very low toxicity. Excess excreted. Cyanocobalamin contains trace cyanide — negligible but inferior.',
    organsAffected: 'Nervous system, bone marrow, liver',
    safeDailyRange: '0.001 mg/kg body weight/day',
    appFlag: '💡 Methylcobalamin is the preferred bioavailable form. Cyanocobalamin is a lower-quality signal.',
  },
  {
    name: 'Vitamin D3',
    category: 'fat-soluble',
    safetyRating: 'danger',
    syntheticForms: ['cholecalciferol', 'vitamin d3 supplement', 'vitamin d supplement'],
    syntheticFormQuality: 'poor',
    preferredNaturalSources: 'Fatty fish, fish oil, egg yolk, liver — whole food sources only',
    longTermRisk: '🚨 TOXICITY RISK: Excess D3 causes hypercalcemia — calcium deposits in kidneys, heart, blood vessels. Kidney failure and death possible. Several pet food recalls involved Vitamin D3 overdose.',
    organsAffected: 'Kidneys, heart, blood vessels, bones',
    safeDailyRange: '3.4 IU/kg body weight/day (STRICT)',
    appFlag: '🚨 HIGH RISK in excess. One of the most dangerous vitamins for dogs when over-supplemented. Double-flag if product also contains fish meal.',
    combinationFlags: ['fish meal', 'salmon meal', 'herring meal', 'fish oil'],
  },
  {
    name: 'Vitamin E',
    category: 'fat-soluble',
    safetyRating: 'caution',
    syntheticForms: ['dl-alpha tocopherol', 'dl-alpha-tocopheryl acetate', 'mixed tocopherols', 'vitamin e supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Sunflower seeds, almonds, fish oil, whole foods',
    longTermRisk: 'Synthetic dl-alpha tocopherol is less bioavailable than natural d-alpha. Very high doses may interfere with Vitamin K absorption.',
    organsAffected: 'Immune system, skin, muscles, reproductive system',
    safeDailyRange: '2 IU/kg body weight/day',
    appFlag: '💡 Natural d-alpha tocopherol (no "l") is superior. Synthetic dl-alpha is acceptable but a lower quality signal. Mixed tocopherols = best form.',
  },
  {
    name: 'Vitamin K3 (Menadione)',
    category: 'fat-soluble',
    safetyRating: 'avoid',
    syntheticForms: ['menadione', 'menadione sodium bisulfite', 'menadione sodium bisulfite complex', 'msbc', 'vitamin k3'],
    syntheticFormQuality: 'avoid',
    preferredNaturalSources: 'Green leafy vegetables, liver, alfalfa — K1 (phylloquinone) is the safe natural form',
    longTermRisk: '🚨 Linked to liver toxicity, hemolytic anemia, and immune system damage. Banned in human supplements in the US. NASC recommends against use in animal supplements.',
    organsAffected: 'Liver, blood, immune system',
    safeDailyRange: 'Not established — AVOID synthetic K3',
    appFlag: '🚨 AVOID MENADIONE (K3). Banned in human supplements. Still used in some pet foods. K1 (phylloquinone) is the safe alternative.',
  },
  {
    name: 'Biotin (B7)',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['d-biotin', 'biotin supplement'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Egg yolks, liver, organ meats',
    longTermRisk: 'No known toxicity. Excess excreted safely. Note: raw egg whites block biotin absorption.',
    organsAffected: 'Skin, coat, liver, nervous system',
    safeDailyRange: '0.02 mg/kg body weight/day',
    appFlag: 'Safe. Note if owner feeds raw eggs — whites block biotin absorption.',
  },
  {
    name: 'Choline',
    category: 'water-soluble',
    safetyRating: 'safe',
    syntheticForms: ['choline chloride', 'choline bitartrate'],
    syntheticFormQuality: 'acceptable',
    preferredNaturalSources: 'Egg yolks, liver, meat, fish',
    longTermRisk: 'Excess: fishy odor, GI issues, low blood pressure at very high doses.',
    organsAffected: 'Liver, brain, kidneys',
    safeDailyRange: '50–100 mg/kg food',
    appFlag: 'Essential nutrient. Standard synthetic form is acceptable.',
  },
]

const MINERAL_DATABASE: MineralEntry[] = [
  {
    name: 'Calcium',
    category: 'macro',
    safetyRating: 'caution',
    syntheticForms: ['calcium carbonate', 'dicalcium phosphate', 'monocalcium phosphate', 'calcium supplement'],
    preferredForms: ['dicalcium phosphate', 'calcium from bone meal'],
    poorForms: ['calcium carbonate'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Excess causes skeletal deformities in large-breed puppies, soft tissue calcification, kidney stones.',
    organsAffected: 'Bones, kidneys, heart, muscles',
    safeDailyRange: '50 mg/kg body weight/day',
    appFlag: '⚠️ Large-breed puppies especially sensitive to excess. Balance with phosphorus (ideal Ca:P ratio 1.2:1).',
  },
  {
    name: 'Phosphorus',
    category: 'macro',
    safetyRating: 'caution',
    syntheticForms: ['dicalcium phosphate', 'monocalcium phosphate', 'phosphoric acid'],
    preferredForms: ['dicalcium phosphate'],
    poorForms: ['phosphoric acid'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Excess phosphorus damages kidneys over time. Critical restriction for dogs with chronic kidney disease (CKD).',
    organsAffected: 'Kidneys, bones, liver',
    safeDailyRange: '40 mg/kg body weight/day',
    appFlag: '🚨 Flag for dogs with kidney disease — high phosphorus accelerates CKD progression.',
  },
  {
    name: 'Magnesium',
    category: 'macro',
    safetyRating: 'safe',
    syntheticForms: ['magnesium oxide', 'magnesium sulfate', 'magnesium proteinate', 'magnesium citrate'],
    preferredForms: ['magnesium citrate', 'magnesium glycinate', 'magnesium proteinate'],
    poorForms: ['magnesium oxide'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Magnesium oxide is poorly absorbed and causes GI upset. Excess from absorbable forms causes diarrhea, low blood pressure.',
    organsAffected: 'Muscles, nerves, kidneys, heart',
    safeDailyRange: '8.8 mg/kg body weight/day',
    appFlag: '💡 Magnesium oxide = cheap and poorly bioavailable. Citrate or glycinate forms are significantly better.',
  },
  {
    name: 'Zinc',
    category: 'trace',
    safetyRating: 'caution',
    syntheticForms: ['zinc sulfate', 'zinc oxide', 'zinc proteinate', 'zinc amino acid chelate'],
    preferredForms: ['zinc proteinate', 'zinc amino acid chelate', 'zinc gluconate'],
    poorForms: ['zinc oxide'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Zinc oxide is poorly bioavailable. Zinc toxicity: hemolytic anemia, liver and kidney damage. Some breeds have zinc malabsorption.',
    organsAffected: 'Liver, kidneys, immune system, skin',
    safeDailyRange: '2 mg/kg body weight/day',
    appFlag: '💡 Zinc proteinate/chelate = best form. Zinc oxide = cheap and poorly absorbed — lower quality signal.',
    breedWarnings: ['Siberian Husky', 'Alaskan Malamute', 'Samoyed'],
  },
  {
    name: 'Iron',
    category: 'trace',
    safetyRating: 'caution',
    syntheticForms: ['ferrous sulfate', 'ferric oxide', 'iron amino acid chelate', 'reduced iron'],
    preferredForms: ['ferrous sulfate', 'iron amino acid chelate'],
    poorForms: ['ferric oxide'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Iron overload damages liver. Ferric oxide is essentially unabsorbable — used as a colorant only.',
    organsAffected: 'Liver, bone marrow, spleen',
    safeDailyRange: '1.32 mg/kg body weight/day',
    appFlag: '🚨 Ferric oxide = cosmetic colorant with zero nutritional value. Flag it. Ferrous sulfate is the acceptable supplemental form.',
  },
  {
    name: 'Copper',
    category: 'trace',
    safetyRating: 'caution',
    syntheticForms: ['copper sulfate', 'copper proteinate', 'copper amino acid chelate'],
    preferredForms: ['copper proteinate', 'copper amino acid chelate'],
    poorForms: ['copper sulfate'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Copper storage disease in predisposed breeds — copper accumulates in liver causing cirrhosis and liver failure.',
    organsAffected: 'Liver (primary), nervous system',
    safeDailyRange: '0.33 mg/kg body weight/day',
    appFlag: '🚨 BREED RISK: Copper toxicosis is serious for predisposed breeds. Copper proteinate is safer than copper sulfate.',
    breedWarnings: ['Bedlington Terrier', 'Labrador Retriever', 'Doberman Pinscher', 'West Highland White Terrier', 'Dalmatian', 'Skye Terrier'],
  },
  {
    name: 'Selenium',
    category: 'trace',
    safetyRating: 'caution',
    syntheticForms: ['sodium selenite', 'sodium selenate', 'selenium yeast', 'selenomethionine'],
    preferredForms: ['selenium yeast', 'selenomethionine'],
    poorForms: ['sodium selenite', 'sodium selenate'],
    syntheticFormQuality: 'acceptable',
    longTermRisk: '⚠️ Very narrow margin between deficiency and toxicity. Excess (selenosis): vomiting, hair loss, neurological damage, death at high doses.',
    organsAffected: 'Thyroid, liver, kidneys, immune system',
    safeDailyRange: '0.11 mg/kg body weight/day (STRICT)',
    appFlag: '🚨 Very narrow safe range. Selenium yeast is safer and more bioavailable than sodium selenite. Flag sodium selenite as lower quality.',
  },
  {
    name: 'Iodine',
    category: 'trace',
    safetyRating: 'caution',
    syntheticForms: ['potassium iodide', 'calcium iodate', 'potassium iodate'],
    preferredForms: ['calcium iodate', 'potassium iodide'],
    poorForms: [],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Excess iodine paradoxically disrupts thyroid — causes hypothyroidism or hyperthyroidism. Kelp/seaweed additives can compound this risk.',
    organsAffected: 'Thyroid gland, metabolism',
    safeDailyRange: '0.22 mg/kg body weight/day',
    appFlag: '⚠️ Flag if product has both potassium iodide AND kelp/seaweed — double iodine source, thyroid disruption risk.',
    combinationFlags: ['kelp', 'seaweed', 'bladderwrack', 'ascophyllum nodosum'],
  },
  {
    name: 'Taurine',
    category: 'trace',
    safetyRating: 'safe',
    syntheticForms: ['taurine'],
    preferredForms: ['taurine'],
    poorForms: [],
    syntheticFormQuality: 'best',
    longTermRisk: 'Taurine DEFICIENCY linked to DCM (dilated cardiomyopathy) — especially in grain-free diets high in legumes.',
    organsAffected: 'Heart, eyes, brain, liver',
    safeDailyRange: 'Not established — endogenous synthesis + dietary',
    appFlag: '🚨 Flag ABSENCE of taurine in grain-free formulas with peas/lentils/chickpeas. FDA investigated DCM link.',
    combinationFlags: ['peas', 'lentils', 'chickpeas', 'pea protein', 'pea starch'],
  },
  {
    name: 'Sodium',
    category: 'electrolyte',
    safetyRating: 'caution',
    syntheticForms: ['sodium chloride', 'salt'],
    preferredForms: ['sodium chloride'],
    poorForms: [],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Excess causes hypertension, kidney strain, worsens heart disease. Many pet foods use excess sodium as a flavor enhancer.',
    organsAffected: 'Kidneys, heart, blood vessels, brain',
    safeDailyRange: '13 mg/kg body weight/day',
    appFlag: '⚠️ Flag high sodium for dogs with heart or kidney disease.',
  },
  {
    name: 'Potassium',
    category: 'electrolyte',
    safetyRating: 'safe',
    syntheticForms: ['potassium chloride'],
    preferredForms: ['potassium chloride'],
    poorForms: [],
    syntheticFormQuality: 'acceptable',
    longTermRisk: 'Excess rare from food. Deficiency causes muscle weakness and heart arrhythmia.',
    organsAffected: 'Heart, kidneys, muscles',
    safeDailyRange: '1.3 mg/kg body weight/day minimum',
    appFlag: 'Safe at normal dietary levels.',
  },
]

function checkSyntheticFormQuality(term: string): {
  nutrientName: string
  flag: string
  quality: FormQuality
} | null {
  const t = term.toLowerCase().trim()

  for (const v of VITAMIN_DATABASE) {
    if (v.syntheticFormQuality === 'avoid' || v.syntheticFormQuality === 'poor') {
      if (v.syntheticForms.some(f => t.includes(f) || f.includes(t))) {
        return { nutrientName: v.name, flag: v.appFlag, quality: v.syntheticFormQuality }
      }
    }
  }

  for (const m of MINERAL_DATABASE) {
    if (m.poorForms.some(f => t.includes(f) || f.includes(t))) {
      return {
        nutrientName: m.name,
        flag: m.appFlag,
        quality: 'poor',
      }
    }
  }

  return null
}

function checkCombinationFlags(ingredientList: string[]): {
  nutrientName: string
  warning: string
}[] {
  const lower = ingredientList.map(i => i.toLowerCase())
  const warnings: { nutrientName: string; warning: string }[] = []

  const allEntries = [...VITAMIN_DATABASE, ...MINERAL_DATABASE]
  for (const entry of allEntries) {
    if (!entry.combinationFlags) continue
    const entryPresent = entry.syntheticForms.some(f =>
      lower.some(i => i.includes(f) || f.includes(i))
    )
    if (!entryPresent) continue
    const combo = entry.combinationFlags.find(cf => lower.some(i => i.includes(cf)))
    if (combo) {
      warnings.push({
        nutrientName: entry.name,
        warning: `⚠️ ${entry.name}: Found alongside "${combo}" — ${entry.appFlag}`,
      })
    }
  }

  return warnings
}

function auditIngredientList(ingredientList: string[]): {
  avoidFlags: { ingredient: string; nutrientName: string; flag: string }[]
  poorFormFlags: { ingredient: string; nutrientName: string; flag: string }[]
  combinationWarnings: { nutrientName: string; warning: string }[]
} {
  const avoidFlags: { ingredient: string; nutrientName: string; flag: string }[] = []
  const poorFormFlags: { ingredient: string; nutrientName: string; flag: string }[] = []

  for (const ing of ingredientList) {
    const result = checkSyntheticFormQuality(ing)
    if (result) {
      if (result.quality === 'avoid') {
        avoidFlags.push({ ingredient: ing, nutrientName: result.nutrientName, flag: result.flag })
      } else {
        poorFormFlags.push({ ingredient: ing, nutrientName: result.nutrientName, flag: result.flag })
      }
    }
  }

  const combinationWarnings = checkCombinationFlags(ingredientList)

  return { avoidFlags, poorFormFlags, combinationWarnings }
}

const TAPF_APPROVED_BRANDS = [
  "allprovide",
  "all provide",
  "darwin's",
  "darwins",
  "raised right",
  "steve's real food",
  "steves real food",
  "answers pet food",
  "answers",
  "small batch",
  "primal",
  "vital essentials",
  "we feed raw",
  "raw paws",
  "bold by nature",
  "nature's logic",
  "natures logic",
  "aunt jeni's",
  "hare today",
  "oma's pride",
  "omas pride",
  "my pet carnivore",
  "raw feeding miami",
  "rebel raw",
  "reel raw",
  "fresh is best",
  "just food for dogs",
  "justfoodfordogs",
  "the honest kitchen",
  "open farm",
  "farmina",
  "ziwi",
  "ziwipeak",
  "ziwi peak",
];

const HARMFUL_INGREDIENTS: {
  term: string;
  reason: string;
  severity: string;
}[] = [
  {
    term: "xylitol",
    severity: "toxic",
    reason:
      "According to the ASPCA and veterinary toxicologists, xylitol has been associated with severe hypoglycemia and liver failure in dogs, even in small amounts",
  },
  {
    term: "ethoxyquin",
    severity: "toxic",
    reason:
      "Originally developed as a pesticide and rubber stabilizer in the 1950s. Long-term feeding studies have associated ethoxyquin with liver enzyme elevation, kidney lesions, and immune dysfunction in dogs. The FDA requested manufacturers voluntarily reduce its use in 1997 after receiving reports of adverse effects. It is banned in human food in many countries. Many manufacturers have reformulated to avoid it entirely.",
  },
  {
    term: "bha",
    severity: "severe",
    reason:
      "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term.",
  },
  {
    term: "bht",
    severity: "severe",
    reason:
      "Long-term animal feeding studies found BHT causes liver cell hypertrophy (abnormal cell enlargement) and disrupts thyroid function by inhibiting thyroid peroxidase — an enzyme essential for hormone production. A study in Food and Chemical Toxicology found BHT acts as a tumor promoter in animals pre-exposed to carcinogens, accelerating cancer development even without initiating it. Daily cumulative intake is the primary concern.",
  },
  {
    term: "tbhq",
    severity: "moderate",
    reason:
      "⚠️ Cited honestly: TBHQ is a synthetic antioxidant preservative. The concerns come from rodent feeding studies at high doses reporting immune effects and, in some work, precursor stomach lesions — and several countries restrict its use in human food. What we have NOT found is canine data at pet-food inclusion levels. So this is rodent evidence plus a regulatory signal, not demonstrated harm to dogs. Our position: prefer foods preserved with mixed tocopherols instead, because a better option exists — not because harm to dogs has been shown.",
  },
  {
    term: "sodium nitrite",
    severity: "moderate",
    reason:
      "⚠️ Mechanism, stated honestly: sodium nitrite can react with amines under stomach conditions to form nitrosamines, several of which are established carcinogens in animal studies. That chemistry is real and well described. What's missing is the dose question — how much actually forms at pet-food inclusion levels, and whether it reaches amounts that matter in a dog. Nobody has measured that in dogs. Also worth knowing vitamin C inhibits nitrosamine formation, which is why cured human foods often include it. Our position: a preservative worth avoiding on mechanism, not a demonstrated canine harm.",
  },
  {
    term: "sodium metabisulfite",
    severity: "severe",
    reason:
      "This one is more serious than its 'moderate' tier suggests. Sulfite preservatives destroy thiamine (vitamin B1), and thiamine deficiency in dogs is a documented, sometimes fatal outcome — published cases describe dogs developing deficiency specifically from eating sulphite-preserved meat. The signs are neurological: head tilt, disorientation, wobbliness, progressing to seizures and paralysis. The FDA's position is that sulfite preservatives should not be added to foods, and specifically not to pet foods marketed as complete and balanced or listing thiamine as an ingredient — because the preservative destroys the very nutrient the label claims to provide. Most often found in fresh meat rolls, minces and bully sticks, where it is used to control colour and odour.",
  },
  {
    term: "potassium sorbate",
    severity: "mild",
    reason:
      "The in vitro evidence is real and specific. Mamur et al. (Toxicology in Vitro, 2010) exposed human lymphocytes to potassium sorbate and found significant chromosomal aberrations at 500-1000 µg/ml, elevated sister-chromatid exchanges from 125 µg/ml, and DNA strand breaks at every concentration tested. ⚖️ But the in vivo picture does not follow it. EFSA's 2015 re-evaluation reviewed exactly these findings, concluded that live-animal studies did NOT confirm genotoxicity at realistic exposure, and maintained an acceptable daily intake of 3 mg/kg body weight. The concentrations used in those cell studies are in the 0.5-2 mM range, which dietary intake doesn't reach — potassium sorbate is metabolised much like a fatty acid. There is one more specific concern worth knowing: potassium sorbate reacting with ASCORBIC ACID in the presence of an IRON salt produces mutagenic decomposition products. Pet foods routinely contain all three. That interaction is a better reason for caution than the raw cell data. Our position: a preference against, not a demonstrated harm — and stronger where vitamin C and an iron source appear on the same label.",
  },
  {
    term: "calcium propionate",
    severity: "mild",
    reason:
      "The behavioural claim traces to two places, and both need their caveats stated. FIRST, MacFabe's rat work: propionic acid produced repetitive behaviour, hyperactivity, impaired social interaction and seizure activity within minutes — but it was delivered by INTRACEREBROVENTRICULAR INJECTION, straight into the fluid around the brain. That is a model of what propionate does to a brain, not evidence about what eating it does. Anyone citing those rats as a reason to avoid a preservative in food has skipped the most important line of the methods. SECOND, Dengate & Ruben (Journal of Paediatrics and Child Health, 2002): 27 children in a double-blind placebo-controlled crossover, fed four slices of bread daily for three days. Fourteen showed worse irritability, restlessness, inattention and sleep disturbance on the preservative. That is a genuine controlled trial — but small, and the children were pre-selected as responders to an elimination diet, so it describes a sensitive subgroup rather than the general population. THIRD, and most relevant here: there is no canine data at all. Our position: a low-concern preservative that a good food doesn't need, flagged for that reason rather than because harm to dogs has been shown. It hasn't been studied.",
  },
  {
    term: "menadione",
    severity: "moderate",
    reason:
      "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't.",
  },
  {
    term: "copper sulfate",
    severity: "mild",
    reason:
      "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral.",
  },
  {
    term: "sodium selenate",
    severity: "severe",
    reason:
      "❌ Inorganic selenium, same grade as sodium selenite. Selenium has the narrowest margin of any nutrient in the AAFCO profile — 0.35 mg/kg minimum against a 2 mg/kg maximum, a ceiling only about 6x the floor. Selenium yeast (selenomethionine) is both better absorbed and better tolerated.",
  },
  {
    term: "magnesium oxide",
    severity: "moderate",
    reason:
      "❌ Oxide is the worst grade of mineral form — barely absorbed, cheapest to buy. Look for magnesium proteinate; magnesium sulfate is the acceptable middle.",
  },
  {
    term: "sodium selenite",
    severity: "severe",
    reason:
      "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine.",
  },
  // ── MINERAL FORMS, completed 2026-08-23 ──────────────────────────────────
  // docs/MINERAL_FORMS_CHEATSHEET.md listed these as scoring gaps and they were
  // never added, so a food using the cheapest forms available scored the same as
  // one using chelates. The grading is chelate > sulfate > oxide:
  //   proteinate / amino acid chelate / methionine / yeast → not flagged at all
  //   sulfate → mild, the acceptable middle
  //   oxide   → moderate, barely absorbed
  {
    term: "ferrous sulfate",
    severity: "mild",
    reason:
      "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing.",
  },
  {
    term: "zinc sulfate",
    severity: "mild",
    reason:
      "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own.",
  },
  {
    term: "manganese sulfate",
    severity: "mild",
    reason:
      "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable.",
  },
  {
    term: "manganese oxide",
    severity: "moderate",
    reason:
      "Oxide is the cheapest, least absorbable mineral grade. Manganese matters for joint cartilage and bone, so poor availability is not harmless in a large or growing dog. Count the oxides on a label — two or more means the manufacturer bought the cheapest forms available, and that tells you what they did on every line you cannot see.",
  },
  {
    term: "iron oxide",
    severity: "moderate",
    reason:
      "Barely absorbed as a nutrient — and worth knowing that iron oxide is also used as a COLOURING agent to make food look meatier. Either way it is not delivering usable iron. Look for iron proteinate or iron amino acid chelate; ferrous sulfate is the acceptable middle.",
  },
  {
    term: "copper oxide",
    severity: "moderate",
    reason:
      "The clearest case in the whole mineral block: AAFCO will not allow copper oxide to count toward a food's copper minimum at all, citing 'very poor apparent digestibility'. A regulator refusing to count an ingredient as the nutrient it is named after settles the argument. If copper oxide is the copper source, the food is effectively not delivering copper.",
  },
  {
    term: "zinc oxide",
    severity: "moderate",
    reason:
      "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading.",
  },
  {
    term: "dl-methionine",
    severity: "mild",
    reason:
      "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own.",
  },
  {
    term: "corn syrup",
    severity: "mild",
    reason:
      "⚪ Mechanistic, not trial-based: corn syrup is refined sugar added for palatability. Dogs have no dietary requirement for sugar, and adding it to a food serves the manufacturer (dogs eat more of it) rather than the dog. The concerns follow from what sugar does generally — spikes in blood glucose, a contribution to obesity and dental disease, and feeding of oral and gut yeast — rather than from controlled canine trials on corn syrup specifically. Its presence is also a signal: a food good enough to eat on its own merits doesn't need sweetening.",
  },
  {
    term: "corn gluten meal",
    severity: "mild",
    reason:
      "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels.",
  },
  {
    term: "wheat gluten",
    severity: "mild",
    reason:
      "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten.",
  },
  {
    term: "soy protein isolate",
    severity: "mild",
    reason:
      "⚪ Mechanistic / formulation signal: soy protein isolate is highly concentrated plant protein used to boost the protein figure cheaply. Two considerations. It contributes to the crude protein number without contributing meat, so the label overstates the quality of the protein. And soy contains phytates, which bind zinc and other minerals and reduce their absorption — relevant because zinc absorption is already the weak point in plant-heavy foods. Soy is also a recognised allergen in dogs, though less common than chicken or beef.",
  },
  {
    term: "cellulose",
    severity: "mild",
    reason:
      "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better.",
  },
  {
    term: "peanut hulls",
    severity: "mild",
    reason:
      "⚪ Formulation signal: peanut hulls are the shells left over from peanut processing, used as cheap insoluble fibre. They add bulk and very little else. Like powdered cellulose, they're poorly fermentable, so they don't feed the gut the way beet pulp, pumpkin or chicory do. Flagged as a cost-driven filler choice rather than a hazard — no canine harm has been demonstrated.",
  },
  {
    term: "brewer rice",
    severity: "mild",
    reason:
      "⚪ Formulation signal: brewers rice is the small broken fragments left after milling — the pieces too small to sell for human food. It's a perfectly digestible starch, so this isn't a safety flag. What it lacks is the bran and germ that make whole grains worth eating, so it delivers calories with little of the fibre or micronutrients. Its presence usually says the recipe was built to a price.",
  },
  {
    term: "ground corn",
    severity: "mild",
    reason:
      "⚪ Formulation signal, not a hazard: ground corn is an inexpensive source of bulk calories and starch, which extrusion physically requires to form a kibble. We're not going to repeat the common claim that it's poorly digested — cooked, ground corn is actually digested well by dogs, and saying otherwise would be wrong. The honest criticism is what it displaces: every percentage point of corn is a point not coming from meat. Judge it on that, and on where it sits in the ingredient list.",
  },
  {
    term: "ground wheat",
    severity: "mild",
    reason:
      "⚪ Mechanistic / formulation signal: ground wheat is an inexpensive carbohydrate that supplies bulk calories and helps kibble hold together during extrusion. Dogs have no carbohydrate requirement (see the carbohydrate section), and wheat is among the more common grain allergens, though far less common than chicken or beef. It isn't harmful to most dogs — it's a cost and filler question, and a reason to check where the protein is actually coming from.",
  },
  {
    term: "grain fragments",
    severity: "mild",
    reason:
      "⚪ Formulation signal: 'grain fragments' is an unnamed collective term for milling leftovers — and the unnamed part is the real problem. It doesn't tell you which grain, which portion, or from what batch, so you can't assess it and it can change between production runs without the label changing. Not a demonstrated hazard; a transparency one. A food confident in its ingredients names them.",
  },
  {
    term: "artificial color",
    severity: "severe",
    reason:
      "Artificial colors in pet food are petroleum-derived synthetic dyes with zero nutritional value. Dogs do not select food by color — these dyes exist purely to appeal to humans. Several have been linked to tumor promotion, hypersensitivity, and carcinogenic activity in animal studies. The CSPI has petitioned to ban multiple common dyes (Red 40, Yellow 5, Yellow 6) from human food — they have no place in dog food.",
  },
  {
    term: "artificial colour",
    severity: "severe",
    reason:
      "Artificial colours in pet food are petroleum-derived synthetic dyes with zero nutritional value. Dogs do not select food by colour — these dyes exist purely to appeal to humans. Several have been linked to tumor promotion, hypersensitivity, and carcinogenic activity in animal studies.",
  },
  {
    term: "artificial flavor",
    severity: "moderate",
    reason:
      "⚪ By definition undisclosed: 'artificial flavor' is a category, not an ingredient, and manufacturers aren't required to say what's in it. There's no evidence that flavourings at label levels harm dogs, and this is not flagged as toxic. It is flagged because it's unknowable — you cannot assess or avoid what isn't named — and because a food needing engineered flavour is telling you the ingredients alone weren't palatable.",
  },
  {
    term: "artificial flavour",
    severity: "moderate",
    reason:
      "⚪ By definition undisclosed: 'artificial flavour' is a category rather than a named ingredient, and its contents need not be disclosed. No evidence of harm at label levels, and it isn't flagged as toxic. It's flagged because it can't be assessed or avoided, and because needing engineered flavour says something about the underlying ingredients.",
  },
  {
    term: "red 40",
    severity: "severe",
    reason:
      "Red 40 is a petroleum-derived synthetic dye classified as a possible carcinogen. The Center for Science in the Public Interest has petitioned the FDA to ban it. It has been linked to hypersensitivity, behavioral changes, and tumor promotion in animal studies. There is zero nutritional justification for its use in dog food — it exists purely for human visual appeal.",
  },
  {
    term: "yellow 5",
    severity: "severe",
    reason:
      "Yellow 5 (tartrazine) is a synthetic azo dye linked to hypersensitivity reactions, behavioral changes, and potential carcinogenic activity in animal research. The CSPI has flagged it as a dye of concern. It is banned or restricted in several countries and serves no nutritional purpose in pet food whatsoever.",
  },
  {
    term: "yellow 6",
    severity: "severe",
    reason:
      "Yellow 6 is a synthetic petroleum-derived dye linked to adrenal gland and kidney tumors in animal studies. The CSPI considers it unsafe. Like all artificial dyes in pet food, it serves zero nutritional purpose — dogs are colorblind to red/orange and cannot distinguish it. Its only function is to make kibble look more appealing to humans.",
  },
  {
    term: "blue 2",
    severity: "severe",
    reason:
      "Some animal studies have explored a possible association between Blue 2 and brain tumor development. It is banned or restricted in several countries and considered unnecessary in pet food",
  },
  {
    term: "caramel color",
    severity: "moderate",
    reason:
      "Certain types of caramel color produced using ammonia processes may contain 4-methylimidazole (4-MEI), a compound that some research has associated with potential carcinogenic activity",
  },
  {
    term: "propylene glycol",
    severity: "toxic",
    reason:
      "Propylene glycol is banned by the FDA for use in cat food due to its association with Heinz body anemia in cats. While permitted in dog food at low levels, many veterinary nutritionists recommend avoiding it entirely",
  },
  {
    term: "carrageenan",
    severity: "moderate",
    reason:
      "Some research has associated degraded carrageenan with intestinal inflammation. While food-grade carrageenan is considered different, some veterinary nutritionists recommend avoiding it, particularly for pets with sensitive digestive systems",
  },
  {
    term: "canola oil",
    severity: "mild",
    reason:
      "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would.",
  },
  {
    term: "vegetable oil",
    severity: "mild",
    reason:
      "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting.",
  },
  {
    term: "soybean",
    severity: "mild",
    reason:
      "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five.",
  },
  {
    term: "soy protein",
    severity: "mild",
    reason:
      "⚪ Formulation signal: isolated plant protein used to inflate the crude protein figure without meat. Lower in the amino acids dogs need most, and a common allergen. Matters most in the top five ingredients.",
  },
  {
    term: "natural flavor",
    severity: "mild",
    reason:
      "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was.",
  },
  {
    term: "yeast culture",
    severity: "mild",
    reason:
      "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten.",
  },
  {
    term: "meat by-product",
    severity: "moderate",
    reason:
      "By-products come from animals that have died — and the source stream includes 4D animals: dead, dying, diseased and disabled. Dr. Andrew Jones, DVM, states this includes roadkill and animals that have been euthanised. The species is never named on the label, so you have no way to know what went into the batch you bought.\n\n⚫ THE EVIDENCE: in February 2018 the FDA and J.M. Smucker recalled over 107 million cans of Gravy Train, Kibbles 'n Bits, Skippy and Ol' Roy after pentobarbital — the drug used to euthanise animals — was found in the food. Smucker confirmed the source was the TALLOW: rendered animal fat. Independent lab testing found 60% of Gravy Train cans sampled came back positive. The FDA states pentobarbital should never be present and any amount makes a product adulterated.\n\nEuthanised animals entered the pet food supply through rendering, a company admitted it, and 107 million cans went out before anyone caught it. AAFCO's written definition says by-products come from SLAUGHTERED animals — 2018 is what that definition is worth in practice.\n\nNote on one point: FDA DNA testing has not found dog or cat material in pet food, so the specific claim that by-products contain euthanised PETS is not something the testing has confirmed.",
  },
  {
    term: "meat by-products",
    severity: "moderate",
    reason:
      "By-products come from animals that have died — and the source stream includes 4D animals: dead, dying, diseased and disabled. Dr. Andrew Jones, DVM, states this includes roadkill and animals that have been euthanised. The species is never named on the label, so you have no way to know what went into the batch you bought.\n\n⚫ THE EVIDENCE: in February 2018 the FDA and J.M. Smucker recalled over 107 million cans of Gravy Train, Kibbles 'n Bits, Skippy and Ol' Roy after pentobarbital — the drug used to euthanise animals — was found in the food. Smucker confirmed the source was the TALLOW: rendered animal fat. Independent lab testing found 60% of Gravy Train cans sampled came back positive. The FDA states pentobarbital should never be present and any amount makes a product adulterated.\n\nEuthanised animals entered the pet food supply through rendering, a company admitted it, and 107 million cans went out before anyone caught it. AAFCO's written definition says by-products come from SLAUGHTERED animals — 2018 is what that definition is worth in practice.\n\nNote on one point: FDA DNA testing has not found dog or cat material in pet food, so the specific claim that by-products contain euthanised PETS is not something the testing has confirmed.",
  },
  {
    term: "poultry by-product",
    severity: "moderate",
    reason:
      "AAFCO defines poultry by-products as non-rendered clean parts such as heads, feet, and viscera. The absence of a named species and variable content makes quality and sourcing difficult for consumers to assess",
  },
  {
    term: "poultry by-products",
    severity: "moderate",
    reason:
      "AAFCO defines poultry by-products as non-rendered clean parts such as heads, feet, and viscera. The absence of a named species and variable content makes quality and sourcing difficult for consumers to assess",
  },
  {
    term: "animal digest",
    severity: "severe",
    reason:
      "Animal digest is produced by chemical or enzymatic hydrolysis of animal tissue. AAFCO does not require species identification, making the source and quality of this ingredient impossible for consumers to verify",
  },
  {
    term: "animal fat",
    severity: "severe",
    reason:
      "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it.",
  },
  {
    term: "hydrolyzed protein",
    severity: "moderate",
    reason:
      "⚪ Context-dependent, and worth reading carefully: hydrolysis breaks protein into fragments too small for the immune system to recognise, which is exactly why prescription hypoallergenic diets use it — for a dog with confirmed food allergy this is a therapeutic ingredient, not a defect. The concern is different: in an ordinary food it's often used as a cheap palatability enhancer (the same role as 'animal digest'), and the source protein is usually unnamed. Judge it by context — a veterinary elimination diet and a supermarket kibble are using it for opposite reasons.",
  },
  {
    term: "blood meal",
    severity: "moderate",
    reason:
      "Blood meal is a rendered slaughterhouse byproduct with variable digestibility. Pet nutrition researchers note that while it contains protein, its biological value and digestibility are considered lower than whole meat sources",
  },
  {
    term: "bone meal",
    severity: "mild",
    reason:
      "⚪ Mechanistic / sourcing signal: bone meal supplies calcium and phosphorus, and in that sense it works. The concerns are about origin: it's rendered from unnamed animal sources, so species and quality are undisclosed, and bone is where heavy metals such as lead concentrate in an animal's body. Raw meaty bone or whole ground bone in a fresh food is preferable and traceable. Not a hazard at label levels — a transparency and quality question.",
  },
  {
    term: "feather meal",
    severity: "moderate",
    reason:
      "⚪ Mechanistic / quality signal: feather meal is hydrolysed poultry feathers, used as a cheap protein source. It's genuinely high in crude protein by analysis, but the protein is largely keratin, which is poorly digestible and unbalanced in the amino acids dogs need — low in lysine and methionine in particular. This is the clearest example of why crude protein on a label can mislead: the number can be high while the usable protein is low. Its presence signals cost-driven formulation.",
  },
  {
    term: "chicken by-product",
    severity: "severe",
    reason:
      "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers",
  },
  {
    term: "sugar",
    severity: "moderate",
    reason:
      "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it.",
  },
  {
    term: "sucrose",
    severity: "moderate",
    reason:
      "⚪ Mechanistic, not trial-based: sucrose is table sugar, added for palatability. Dogs require no dietary sugar. Same reasoning as other added sugars — empty calories, dental and yeast implications, and a signal that palatability is being engineered rather than earned. No canine-specific trials on sucrose in pet food; this is physiology, not evidence of harm at label levels.",
  },
  {
    term: "fructose",
    severity: "moderate",
    reason:
      "Fructose in processed form is metabolized differently than naturally occurring fruit sugars and has been associated with metabolic concerns in animal research at elevated intake levels",
  },
  {
    term: "glucose",
    severity: "moderate",
    reason:
      "⚪ Mechanistic, not trial-based: added glucose is a simple sugar used for palatability and, in some products, texture. Dogs generate the glucose they need from protein and fat and have no dietary requirement for it. Concerns are the general sugar ones rather than glucose-specific findings in dogs.",
  },
  {
    term: "molasses",
    severity: "mild",
    reason:
      "⚪ Mechanistic, with a small caveat in its favour: molasses is added as a sweetener and binder, and it does carry trace minerals (iron, calcium, magnesium) unlike refined sugars. That doesn't make it a nutritional ingredient — the amounts are small and the sugar is not. Treat it as added sugar with a marginal upside, and as a signal that palatability is being engineered.",
  },
  {
    term: "sorbitol",
    severity: "mild",
    reason:
      "⚪ Mechanistic: sorbitol is a sugar alcohol used as a sweetener and humectant. Unlike xylitol — which is genuinely dangerous to dogs — sorbitol is not toxic, and conflating the two is a common error. The practical issue is that sugar alcohols are poorly absorbed and draw water into the gut, so meaningful amounts cause loose stools and gas. Present in small amounts in soft treats, it's a minor concern rather than a hazard.",
  },
  {
    term: "melamine",
    severity: "toxic",
    reason:
      "Melamine is an industrial chemical with no approved use in food of any kind. It was the adulterant behind the 2007 pet food contamination — added to wheat gluten and rice protein concentrate to inflate apparent protein readings, because standard protein tests measure nitrogen and melamine is nitrogen-rich. Combined with cyanuric acid it forms crystals that cause acute kidney failure. Thousands of pets died, the FDA recall was one of the largest in pet food history, and melamine is now specifically screened for in safety testing. Its presence on an ingredient list would indicate adulteration, not formulation.",
  },
  {
    term: "rendered fat",
    severity: "severe",
    reason:
      "Rendering is a normal, legitimate process — it separates fat from tissue using heat, and named rendered fats like chicken fat are good ingredients. The issue with an unnamed 'rendered fat' is disclosure: AAFCO permits mammalian fat from unspecified species, so the origin can change between batches and cannot be avoided by an allergic dog. Note also that so-called 4D material (from animals that were dead, dying, diseased or disabled) is considered adulterated under FDA rules unless processed to eliminate disease-causing organisms — meaning it is regulated rather than freely permitted, but the anonymity of the label makes it impossible for an owner to verify. Prefer a named fat.",
  },
  {
    term: "vegetable oil",
    severity: "mild",
    reason:
      "⚪ Mechanistic / transparency: 'vegetable oil' doesn't say which plant, so you can't know the fatty acid profile — and that's the whole point of the ingredient. The common cheap sources (corn, soybean, sunflower, safflower) are heavily weighted toward omega-6 linoleic acid, which is why unnamed vegetable oil tends to push a food's omega-6:3 ratio in the wrong direction. Named oils are assessable; this isn't.",
  },
  {
    term: "garlic",
    severity: "moderate",
    reason:
      "Garlic's toxic reputation traces to Lee et al. (2000), which fed dogs 5 g/kg body weight daily for a week — roughly 20 cloves a day for a 20kg dog. That produced Heinz bodies and reduced hematocrit, but no dog developed clinical hemolytic anemia. Typical holistic dosing (about a quarter clove per 10 lb) is roughly 20x lower than that study. A 2025 in-vitro study (Beleć, Barć & Lasek, Animals) found no safe threshold has been established, so caution is still warranted — but garlic is not in the same category as onion, which carries stronger evidence of harm. In commercial food it is usually a trace flavoring listed below salt.",
  },
  {
    term: "onion",
    severity: "toxic",
    reason:
      "The ASPCA and veterinary toxicologists classify onions as toxic to dogs and cats. Onions contain N-propyl disulfide which damages red blood cells and can cause hemolytic anemia",
  },
  {
    term: "onion powder",
    severity: "toxic",
    reason:
      "Onion powder is considered more concentrated and potentially more toxic than fresh onion. The ASPCA classifies all onion-derived ingredients as toxic to dogs and cats due to their ability to cause hemolytic anemia",
  },
  {
    term: "garlic powder",
    severity: "moderate",
    reason:
      "The dried, granulated form — and form appears to matter. A 2025 in-vitro study (Beleć, Barć & Lasek, Animals, Univ. of Agriculture Krakow) found granulated garlic produced Heinz bodies in about 15% of canine red blood cells versus about 5% for fresh garlic, suggesting drying increases release of the reactive compounds. The authors concluded no safe intake threshold has been established for dogs. Amount matters as much as form: as a flavoring this is usually present in trace quantities below salt.",
  },
  // Vitamins & Minerals — tiered by severity per research
  {
    term: "cholecalciferol",
    severity: "mild",
    reason:
      "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food.",
  },
  {
    term: "vitamin d3 supplement",
    severity: "mild",
    reason:
      "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food.",
  },
  {
    term: "ferric oxide",
    severity: "moderate",
    reason:
      "Ferric oxide (iron oxide) is a colorant, not a nutrient — and unusually, the evidence agrees with the criticism completely. EFSA's 2016 assessment of iron oxides as feed additives found they are excreted essentially unchanged in the feces, with very low absorption, meaning the iron in them is nutritionally unavailable to the animal. Its only function is to make kibble look like meat or vegetables to the person buying it. The dog cannot see the colour difference in the way a shopper can. An ingredient present purely to influence the purchaser tells you something about the formulation priorities.",
  },
  {
    term: "retinyl palmitate",
    severity: "mild",
    reason:
      "Retinyl palmitate is synthetic preformed vitamin A, and the honest evidence here is more reassuring than its reputation. Excess preformed vitamin A causes hypervitaminosis A — early GI signs, then lethargy and weakness, with bone demineralization in chronic cases — and because it is fat-soluble it accumulates. However, dogs are unusually tolerant compared with other species: canine plasma carries vitamin A largely as retinyl esters at 10-50 times the concentration seen in other animals, and a safety evaluation feeding growing dogs 100,000 IU per 1,000 kcal for 44 weeks found no signs of hypervitaminosis A or adverse effects. So this is flagged as a form preference rather than a hazard: whole-food vitamin A from liver is preferable, and the one situation genuinely worth watching is a food containing BOTH liver and added synthetic vitamin A.",
  },
  {
    term: "retinyl acetate",
    severity: "mild",
    reason:
      "Retinyl acetate is synthetic preformed vitamin A, the same category as retinyl palmitate. Excess preformed vitamin A accumulates in the liver and can cause hypervitaminosis A — GI upset first, then lethargy and weakness, and bone changes with chronic overdose. In fairness to the evidence, dogs tolerate vitamin A far better than most species. In a 44-week safety evaluation, 49 puppies — Labrador Retrievers and Miniature Schnauzers — were fed 5,000, 12,500, 75,000 or 100,000 IU per 1,000 kcal from weaning to one year. Even the highest intake, twenty times the lowest, produced no adverse effects, and the authors proposed 100,000 IU per 1,000 kcal as the safe upper limit for growth diets (Safety evaluation of vitamin A in growing dogs, British Journal of Nutrition, 2012). Treat this as a preference for whole-food vitamin A (liver, egg yolk, fish) rather than as a red flag, with genuine caution reserved for foods stacking liver AND synthetic vitamin A together — and note the same logic applies to fish oil: choose a body oil over a second cod liver oil.",
  },
  {
    term: "pyridoxine hydrochloride",
    severity: "mild",
    reason:
      "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food.",
  },
  {
    term: "dl-alpha tocopherol",
    severity: "mild",
    reason:
      "The 'dl-' prefix is the tell: this is synthetic vitamin E. Natural vitamin E (d-alpha, or RRR-alpha-tocopherol) is a single stereoisomer that matches the alpha-tocopherol transport protein in the liver. Synthetic dl-alpha-tocopherol is a mixture of eight isomers, only about 12.5% of which is that RRR form. The conversion used in nutrition — 1 mg natural equals roughly 2 mg synthetic — reflects roughly double the bioavailability and tissue retention for the natural form. Not harmful, simply a weaker version of the same nutrient. 'Mixed tocopherols' on a label indicates the better one, and is also a natural preservative.",
  },
];

const SEVERITY_PENALTIES: Record<string, number> = {
  mild: 2,
  moderate: 10,
  severe: 18,
  toxic: 28,
};

function harmfulPenalty(severity: string, position: number): number {
  const base = SEVERITY_PENALTIES[severity] ?? 8;
  if (severity === "toxic") return base;
  const mult = position < 5 ? 1.0 : position < 10 ? 0.65 : position < 20 ? 0.4 : 0.2;
  return Math.min(base, Math.max(1, Math.round(base * mult)));
}

const TOXIC_SCORE_CEILING = 15;

const TOXIC_ADDITIVES = [
  "copper sulfate",
  "sodium selenite",
  "zinc oxide",
  "dl-methionine",
];

const NAMED_MEALS = [
  "chicken meal",
  "beef meal",
  "lamb meal",
  "salmon meal",
  "turkey meal",
  "pork meal",
  "duck meal",
  "venison meal",
  "herring meal",
  "anchovy meal",
  "whitefish meal",
  "bison meal",
  "rabbit meal",
];

const GENERIC_MEALS = [
  "meat meal",
  "poultry meal",
  "fish meal",
  "animal meal",
];

const MEAT_MEALS = [...NAMED_MEALS, ...GENERIC_MEALS];

const ADDED_VITAMINS = [
  "vitamin a supplement", "retinyl palmitate", "retinyl acetate",
  "vitamin d supplement", "vitamin d3 supplement", "cholecalciferol",
  "dl-alpha tocopherol", "pyridoxine hydrochloride", "cyanocobalamin",
  "zinc sulfate", "zinc oxide", "copper sulfate", "sodium selenite", "sodium selenate",
  "ferric oxide", "magnesium oxide", "menadione", "dl-methionine",
];

const VITAMIN_MINERAL_PENALTIES: { term: string; penalty: number; label: string }[] = [];

const LENTIL_LEGUME = [
  "lentils",
  "peas",
  "chickpeas",
  "pea protein",
  "pea starch",
  "pea fiber",
  "legumes",
  "beans",
  "fava beans",
];

const HIGH_CARB_INGREDIENTS = [
  "corn",
  "wheat",
  "rice",
  "oats",
  "barley",
  "sorghum",
  "millet",
  "potato",
  "tapioca",
  "cassava",
  "white rice",
  "brown rice",
  "oatmeal",
  "flour",
];

const ORGAN_MEATS = [
  "heart",
  "liver",
  "kidney",
  "gizzard",
  "lung",
  "spleen",
  "tripe",
];

const SUPERFOODS = [
  "blueberr",
  "kelp",
  "krill",
  "pumpkin seed",
  "spinach",
  "turmeric",
  "coconut oil",
  "chia seed",
  "broccoli",
  "dandelion",
  "parsley",
  "sweet potato",
  "pumpkin",
  "carrot",
  "apple",
  "cranberr",
  "zucchini",
  "kale",
  "beet",
  "ginger",
  "bone broth",
];

const WHOLE_FOOD_PRODUCE = [
  "blueberr",
  "sweet potato",
  "pumpkin",
  "carrot",
  "apple",
  "spinach",
  "broccoli",
  "cranberr",
  "parsley",
  "dandelion",
  "zucchini",
  "squash",
  "beet",
  "kale",
  "cucumber",
  "celery",
  "asparagus",
];

const ANTI_INFLAMMATORY_FOODS = [
  "turmeric",
  "fish oil",
  "salmon oil",
  "krill oil",
  "krill",
  "algal oil",
  "algae oil",
  "flaxseed",
  "flax seed",
  "chia seed",
  "chia",
  "coconut oil",
  "kelp",
  "ginger",
  "bone broth",
  "green tripe",
  "astaxanthin",
  "boswellia",
];

const PREBIOTIC_SOURCES = [
  "chicory",
  "chicory root",
  "inulin",
  "dandelion",
  "dandelion greens",
  "dandelion root",
  "jerusalem artichoke",
  "sunchoke",
  "burdock",
  "burdock root",
  "asparagus",
  "pumpkin",
  "sweet potato",
  "green banana",
  "plantain",
  "mushroom",
  "shiitake",
  "reishi",
  "apple pectin",
  "pectin",
  "flaxseed",
  "psyllium",
  "beet pulp", // genuinely prebiotic despite its reputation as cheap filler
  "fructooligosaccharide",
  "fos",
  "mannanoligosaccharide",
  "mos",
  "yeast cell wall",
  "acacia",
];

const OMEGA3_MARINE = [
  "salmon",
  "sardine",
  "herring",
  "anchovy",
  "mackerel",
  "trout",
  "fish oil",
  "salmon oil",
  "cod liver oil",
  "krill",
  "krill oil",
  "green lipped mussel",
  "algae",
  "algal oil", // algae is plant-derived but supplies EPA/DHA directly — no conversion needed
];

const OMEGA3_PLANT = [
  "flaxseed",
  "flax seed",
  "flaxseed oil",
  "linseed",
  "chia seed",
  "chia",
  "canola oil",
  "hemp seed",
  "walnut",
];

const OMEGA3_SOURCES = [...OMEGA3_MARINE, ...OMEGA3_PLANT];

const OMEGA3_OILS = [
  "fish oil",
  "salmon oil",
  "krill oil",
  "algal oil",
  "algae oil",
];

const OMEGA6_SOURCES = [
  "sunflower oil",
  "safflower oil",
  "corn oil",
  "soybean oil",
  "cottonseed oil",
  "canola oil",
  "vegetable oil",
  "sunflower seed",
  "safflower seed",
];

const HIGH_FIBER = [
  "pumpkin",
  "flaxseed",
  "chia",
  "psyllium",
  "inulin",
  "chicory root",
];

const PROBIOTIC_SOURCES = [
  "lactobacillus",
  "bifidobacterium",
  "bacillus",
  "enterococcus",
  "dried fermentation",
  "probiotic",
  "acidophilus",
  "fermentum",
  "reuteri",
  "plantarum",
  "casei",
];

const AAFCO_TRIAL_KEYWORDS = [
  "aafco feeding trials",
  "feeding trials",
  "animal feeding tests",
];

const GENERIC_PROTEIN_TERMS = [
  "meat",
  "poultry",
  "fish",
  "animal",
  "liver",
  "protein",
];

const SPECIFIC_PROTEIN_TERMS = [
  "chicken",
  "beef",
  "lamb",
  "salmon",
  "turkey",
  "duck",
  "venison",
  "bison",
  "rabbit",
  "pork",
  "herring",
  "sardine",
  "anchovy",
  "trout",
];

const PROCESSING_METHODS = {
  bad: ["kibble", "extruded", "dry food", "dry dog food", "dry cat food"],
  ok: ["baked", "oven baked", "oven-baked"],
  airDried: ["air dried", "air-dried", "dehydrated"],
  great: ["freeze dried", "freeze-dried"],
  gently: [
    "gently cooked",
    "lightly cooked",
    "slow cooked",
    "slow-cooked",
    "fresh cooked",
  ],
  raw: ["raw frozen", "raw food", "raw"],
};

const RAW_COATED_KIBBLE = [
  "raw coated",
  "raw-coated",
  "raw boost",
  "raw blend",
  "raw infused",
  "raw pieces",
  "rawrev",
  "raw rev",
];

const RAW_INCLUSION_HINTS = ["freeze dried", "freeze-dried", "raw coated"];

function mentionsTerm(text: string, term: string): boolean {
  const esc = term
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/[-\s]+/g, "[-\\s]+");
  return new RegExp(`\\b${esc}\\b`, "i").test(text);
}

function analyseMineralForms(ingredients: string[]) {
  const low = ingredients.map((i) => i.toLowerCase());
  const pick = (re: RegExp) => ingredients.filter((_, i) => re.test(low[i]));
  return {
    oxides: pick(/\boxide\b/),
    sulfates: pick(/\bsulfate\b/),
    chelates: pick(
      /proteinate|amino acid chelate|amino acid complex|selenium yeast|selenomethionine/,
    ),
    addedCount: pick(
      /vitamin|supplement|oxide|sulfate|proteinate|chelate|selenite|selenate|iodate|niacin|thiamine|riboflavin|biotin|folic|pyridoxine|cobalamin|menadione|choline chloride|tocopherol/,
    ).length,
  };
}

function detectProcessingMethod(
  name: string,
  ingredients: string[],
  sheetMethod?: string,
) {
  // ⚠️ Format describes the PRODUCT, so it is read from the product name and the
  // label's own processing statement — NEVER from the ingredient list.
  //
  // Fixed 2026-08-25. `combined` used to include ingredients.join(" "), so any
  // kibble listing "Freeze Dried Turkey" scored as a freeze-dried diet and took
  // the full +25 format bonus. That single line was most of the "the scanner
  // doesn't separate kibble" problem — and it's why Nulo dropped 41 → 25 when
  // the format was set to kibble by hand. That drop was never the omega rule.
  const productText = ((sheetMethod || "") + " " + name).toLowerCase();
  const ingredientText = ingredients.join(" ").toLowerCase();

  // Most specific first: a name that says "Raw Boost" or "RawRev" is naming the
  // raw-coated-kibble category, not claiming to be a raw diet.
  const coated = RAW_COATED_KIBBLE.find((h) => mentionsTerm(productText, h));
  if (coated)
    return {
      method: coated,
      rating: "Kibble with raw pieces",
      scoreCap: 100,
      penalty: 0,
      bonus: 5,
      emoji: "🔵",
    };

  for (const k of PROCESSING_METHODS.raw)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Raw",
        scoreCap: 100,
        penalty: 0,
        bonus: 25,
        emoji: "🌟",
      };
  for (const k of PROCESSING_METHODS.great)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Freeze-Dried",
        scoreCap: 100,
        penalty: 0,
        bonus: 25,
        emoji: "❄️",
      };
  for (const k of PROCESSING_METHODS.gently)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Gently Cooked",
        scoreCap: 100,
        penalty: 0,
        bonus: 22,
        emoji: "🍳",
      };
  for (const k of PROCESSING_METHODS.airDried)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Air-Dried",
        scoreCap: 100,
        penalty: 0,
        bonus: 18,
        emoji: "🌬️",
      };
  for (const k of PROCESSING_METHODS.ok)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Baked",
        scoreCap: 100,
        penalty: 0,
        bonus: 8,
        emoji: "🟡",
      };

  // Nothing above matched, so the base format is kibble or unknown. Before
  // settling there, check for raw or freeze-dried INCLUSIONS — raw-coated
  // kibble and kibble-with-raw-pieces are a real category (Wellness CORE
  // RawRev, Instinct Raw Boost, Stella & Chewy's raw coated).
  //
  // Kyle's call, 2026-08-25: better than plain kibble, but still kibble. The
  // base is still extruded and the raw portion is a small fraction by weight,
  // so it earns +5 — above Kibble (0), below Baked (8) — not the +25 a real
  // raw or freeze-dried diet gets.
  const inclusion =
    RAW_INCLUSION_HINTS.find((h) => mentionsTerm(ingredientText, h)) ??
    RAW_INCLUSION_HINTS.find((h) => mentionsTerm(productText, h));
  if (inclusion)
    return {
      method: inclusion,
      rating: "Kibble with raw pieces",
      scoreCap: 100,
      penalty: 0,
      bonus: 5,
      emoji: "🔵",
    };

  for (const k of PROCESSING_METHODS.bad)
    if (mentionsTerm(productText, k))
      return {
        method: k,
        rating: "Kibble",
        scoreCap: 100,
        penalty: 0,
        bonus: 0,
        emoji: "🔵",
      };
  return {
    method: "Unknown",
    rating: "Unknown – set manually below",
    scoreCap: 100,
    penalty: 0,
    bonus: 0,
    emoji: "❓",
  };
}

function carbPenaltyFor(estCarbPct: number): number {
  if (estCarbPct <= 20) return 0;
  return Math.min(24, Math.round((estCarbPct - 20) * 0.8));
}

const VITAMIN_CONCERN_HIGH = [
  "menadione",
  "sodium selenite",
  "sodium selenate",
  // Oxides — the worst grade. Barely absorbed, cheapest to buy.
  "zinc oxide",
  "iron oxide",
  "ferric oxide",
  "manganese oxide",
  "copper oxide",
  "magnesium oxide",
  // "One letter, half the vitamin" — dl- is a 50/50 mix and the dog uses half.
  "dl-alpha tocopherol",
];

const VITAMIN_CONCERN_LOW = [
  // Sulfates — inorganic, absorbed adequately, pro-oxidant. The middle grade.
  "zinc sulfate",
  "ferrous sulfate",
  "manganese sulfate",
  "copper sulfate",
  "magnesium sulfate",
  "dl-methionine",
  // Removed 2026-08-25: retinyl palmitate/acetate, pyridoxine hydrochloride,
  // cholecalciferol, and the vitamin A/D supplements. docs/MINERAL_FORMS_CHEATSHEET.md
  // is explicit that these are fine — "Dogs tolerate vitamin A far better than most
  // species", D3 is "the right form", thiamine and B6 forms are "both fine" — and that
  // "the panic about 40 added vitamins is mostly misplaced, and overstating it is how
  // you lose credibility". They were costing points for ordinary fortification.
];

function vitaminLoadPenalty(ingredientList: string[]): { penalty: number; level: string; high: string[] } {
  const low = ingredientList.map((i) => i.toLowerCase());
  const high = ingredientList.filter((_, i) =>
    VITAMIN_CONCERN_HIGH.some((v) => low[i].includes(v)),
  );
  const minor = ingredientList.filter((_, i) =>
    VITAMIN_CONCERN_LOW.some((v) => low[i].includes(v)),
  );
  // Weighted count: a problem form counts as three ordinary ones.
  const weighted = high.length * 3 + minor.length;
  if (weighted === 0) return { penalty: 0, level: "", high: [] };
  const penalty = Math.min(14, Math.round(weighted * 1.6));
  const level =
    high.length > 0 ? "Concerning forms present" : weighted > 6 ? "Heavy synthetic load" : "Some synthetic forms";
  return { penalty, level, high };
}

function analyseSaltDivider(ingredientList: string[]): {
  saltIndex: number;
  marketing: string[];
  legitimate: string[];
} | null {
  const idx = ingredientList.findIndex((ing) => {
    const l = ing.toLowerCase().trim();
    return l === "salt" || l === "sea salt" || l === "sodium chloride" || l.endsWith(" salt");
  });
  // No salt found, or it's so late that nothing meaningful sits below it.
  if (idx === -1 || idx >= ingredientList.length - 1) return null;

  const below = ingredientList.slice(idx + 1);
  const marketing: string[] = [];
  const legitimate: string[] = [];

  for (const ing of below) {
    const l = ing.toLowerCase();
    // Things that BELONG below the line — dosed in fractions of a percent by design.
    const belongsHere =
      ADDED_VITAMINS.some((v) => l.includes(v.toLowerCase())) ||
      PROBIOTIC_SOURCES.some((pb) => l.includes(pb)) ||
      /vitamin|mineral|supplement|tocopherol|preserv|acid|chloride|sulfate|oxide|selenite|proteinate|chelate|biotin|niacin|thiamine|riboflavin|folic|choline|taurine|zinc|iron|copper|manganese|iodine|rosemary|extract|culture|fermentation/i.test(
        l,
      );
    if (belongsHere) legitimate.push(ing);
    // Things sold on the front of the bag that turn out to be a sprinkle.
    else if (
      SUPERFOODS.some((sf) => l.includes(sf)) ||
      WHOLE_FOOD_PRODUCE.some((w) => l.includes(w)) ||
      ANTI_INFLAMMATORY_FOODS.some((a) => l.includes(a))
    )
      marketing.push(ing);
  }
  return { saltIndex: idx, marketing, legitimate };
}

function bonusEligible(ingredientList: string[]): string[] {
  const salt = analyseSaltDivider(ingredientList);
  if (!salt || salt.marketing.length === 0) return ingredientList;
  const dust = new Set(salt.marketing);
  return ingredientList.filter((ing) => !dust.has(ing));
}

function saltLinePenalty(ingredientList: string[]): {
  penalty: number;
  position: number;
} {
  const salt = analyseSaltDivider(ingredientList);
  if (!salt) return { penalty: 0, position: -1 };
  const position = salt.saltIndex + 1; // 1-based, as an owner reads the bag
  if (position <= 5) return { penalty: 8, position };
  if (position <= 8) return { penalty: 4, position };
  return { penalty: 0, position };
}

function computeOmegaRating(
  omega3: string[],
  omega6: string[],
  actualRatio?: string | null,
  processingMethod?: string,
  hasMarine?: boolean,
): { label: string; bonus: number } {
  // Applied to whatever the ratio logic below decides.
  const marineBonus = hasMarine ? 3 : 0;
  const marineNote = hasMarine
    ? " · backed by marine EPA/DHA"
    : omega3.length > 0
      ? " · plant-source omega-3, poorly converted"
      : "";
  // If we have an actual GA ratio, always use it — never fall through to ingredient estimation
  if (actualRatio && actualRatio !== "unknown") {
    const ratio = parseFloat(actualRatio.split(":")[0]);
    if (!isNaN(ratio)) {
      if (ratio <= 5)
        return {
          label: `🐟 Excellent omega ratio (${actualRatio})${marineNote}`,
          bonus: 10 + marineBonus,
        };
      if (ratio <= 8)
        return {
          label: `🐟 Good omega ratio (${actualRatio})${marineNote}`,
          bonus: 5 + marineBonus,
        };
      if (ratio < 15)
        return {
          label: `🔴 Poor omega ratio (${actualRatio})${marineNote}`,
          bonus: -10 + marineBonus,
        };
      return {
        label: `🔴 Very poor omega ratio (${actualRatio})${marineNote}`,
        bonus: -15 + marineBonus,
      };
    }
  }
  // Ingredient-based estimation — factor in processing method for accuracy
  const isKibbleOrBaked =
    processingMethod &&
    (processingMethod.includes("kibble") ||
      processingMethod.includes("baked") ||
      processingMethod.includes("extruded"));
  const isRawOrFreezeDried =
    processingMethod &&
    (processingMethod.includes("raw") ||
      processingMethod.includes("freeze") ||
      processingMethod.includes("freeze-dried"));
  const hasDedicatedOil = omega3.some((o) =>
    OMEGA3_OILS.some((oil) => o.toLowerCase().includes(oil)),
  );
  const hasAnyOmega3 = omega3.length > 0;
  const highOmega6Count = omega6.length;

  // Kibble/baked: rendered fats and grain content push omega-6 high regardless of added fish oil
  if (isKibbleOrBaked) {
    if (hasDedicatedOil && highOmega6Count === 0)
      return {
        label: "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
        bonus: -10,
      };
    if (!hasAnyOmega3)
      return {
        label: "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
        bonus: -15,
      };
    return {
      label: "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
      bonus: -10,
    };
  }

  // Raw/freeze-dried: whole ingredients preserve ratio much better
  if (isRawOrFreezeDried) {
    if (hasDedicatedOil && highOmega6Count === 0)
      return {
        label: "🐟 Excellent omega ratio (est. ≤5:1 — raw/freeze-dried with fish oil) — anti-inflammatory",
        bonus: 10,
      };
    if (hasDedicatedOil && highOmega6Count <= 1)
      return {
        label: "🐟 Good omega ratio (est. ~5–8:1 — raw/freeze-dried)",
        bonus: 5,
      };
    if (hasAnyOmega3 && highOmega6Count === 0)
      return {
        label: "🐟 Good omega ratio (est. ~5–8:1 — raw with omega-3 sources)",
        bonus: 5,
      };
    if (hasAnyOmega3)
      return { label: "⚠️ Moderate omega ratio (estimated)", bonus: 0 };
    return {
      label: "❓ Omega ratio unknown — scan GA panel for exact numbers",
      bonus: 0,
    };
  }

  // Gently cooked / unknown — moderate estimation
  if (hasDedicatedOil && highOmega6Count === 0)
    return {
      label: "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
      bonus: 5,
    };
  if (hasDedicatedOil && highOmega6Count <= 1)
    return { label: "⚠️ Moderate omega ratio (estimated)", bonus: 0 };
  if (hasAnyOmega3 && highOmega6Count === 0)
    return { label: "⚠️ Moderate omega ratio (estimated)", bonus: 0 };
  if (!hasAnyOmega3 && highOmega6Count >= 1)
    return {
      label: "🔴 Poor omega ratio (high omega-6, no omega-3)",
      bonus: -10,
    };
  return {
    label: "❓ Omega ratio unknown — scan GA panel for exact numbers",
    bonus: 0,
  };
}

function checkTAPFBrand(name: string): boolean {
  return TAPF_APPROVED_BRANDS.some((b) => name.toLowerCase().includes(b));
}

export type FoodScore = {
  total: number
  breakdown: { label: string; value: number; severity?: string }[]
  analysis: Record<string, any>
}

/**
 * Score a dog food exactly as the app does.
 *
 * The body below is the same source text as processIngredients() in
 * app/index.tsx, minus the React state setters — which is why it can't drift.
 */
export function scoreFood(
  name: string,
  rawIngredients: string,
  ingredientList: string[],
  sheetProcessingMethod: string,
  knownOmegaRatio?: string | null,
  /** From the Guaranteed Analysis when a label was scanned. In the app this
   *  arrived via React state (nutritionalProfile); here it's explicit. */
  labelOmegaRatio?: string | null,
): FoodScore {
  const customIngredients: any[] = []
    const top5 = ingredientList.slice(0, 5).map((i) => i.toLowerCase());
    const foundHarmful: { name: string; reason: string; severity: string; position: number }[] =
      [];
    for (let _hi = 0; _hi < ingredientList.length; _hi++) {
      const ing = ingredientList[_hi];
      const match = HARMFUL_INGREDIENTS.find((h) =>
        ing.toLowerCase().includes(h.term),
      );
      if (match) {
        foundHarmful.push({
          name: ing,
          reason: match.reason,
          severity: match.severity,
          position: _hi,
        });
        continue;
      }
      const customMatch = customIngredients.find((h: CustomIngredient) =>
        ing.toLowerCase().includes(h.term),
      );
      if (customMatch)
        foundHarmful.push({
          name: ing,
          reason: customMatch.reason,
          severity: customMatch.severity,
          position: _hi,
        });
    }
    const foundToxicAdditives = ingredientList.filter((ing) =>
      TOXIC_ADDITIVES.some((t) => ing.toLowerCase().includes(t)),
    );
    const foundMeals = ingredientList.filter((ing) =>
      GENERIC_MEALS.some((m) => ing.toLowerCase().includes(m)),
    );
    const foundVitamins = ingredientList.filter((ing) =>
      ADDED_VITAMINS.some((v) => ing.toLowerCase().includes(v)),
    );
    const foundLegumes = ingredientList.filter((ing) =>
      LENTIL_LEGUME.some((l) => ing.toLowerCase().includes(l)),
    );
    const foundLegumesTop5 = top5.filter((ing) =>
      LENTIL_LEGUME.some((l) => ing.includes(l)),
    );
    const foundCarbs = ingredientList.filter((ing) =>
      HIGH_CARB_INGREDIENTS.some((c) => ing.toLowerCase().includes(c)),
    );
    const foundOmega3 = ingredientList.filter((ing) =>
      OMEGA3_SOURCES.some((o) => ing.toLowerCase().includes(o)),
    );
    const foundOmega6 = ingredientList.filter((ing) =>
      OMEGA6_SOURCES.some((o) => ing.toLowerCase().includes(o)),
    );
    const foundFiber = ingredientList.filter((ing) =>
      HIGH_FIBER.some((f) => ing.toLowerCase().includes(f)),
    );
    const foundProbiotics = ingredientList.filter((ing) =>
      PROBIOTIC_SOURCES.some((p) => ing.toLowerCase().includes(p)),
    );
    const genericInTop5 = top5.filter(
      (ing) =>
        GENERIC_PROTEIN_TERMS.some(
          (g) => ing === g || ing.startsWith(g + " "),
        ) && !SPECIFIC_PROTEIN_TERMS.some((s) => ing.includes(s)),
    );
    const foundOrgans = bonusEligible(ingredientList).filter((ing) =>
      ORGAN_MEATS.some(
        (o) =>
          ing.toLowerCase().includes(o) && !ing.toLowerCase().includes("meal"),
      ),
    );
    const foundProduce = bonusEligible(ingredientList).filter((ing) =>
      WHOLE_FOOD_PRODUCE.some((p) => ing.toLowerCase().includes(p)),
    );
    const foundAntiInflammatory = bonusEligible(ingredientList).filter((ing) =>
      ANTI_INFLAMMATORY_FOODS.some((a) => ing.toLowerCase().includes(a)),
    );
    const foundLegumesTop3 = ingredientList.slice(0, 3).filter((ing) =>
      LENTIL_LEGUME.some((l) => ing.toLowerCase().includes(l)),
    );
    const omegaRatingResult = computeOmegaRating(
      foundOmega3,
      foundOmega6,
      knownOmegaRatio ?? labelOmegaRatio,
      sheetProcessingMethod,
      ingredientList.some((ing) =>
        OMEGA3_MARINE.some((m) => ing.toLowerCase().includes(m)),
      ),
    );
    const noProbiotics = foundProbiotics.length === 0;
    const vitCount = foundVitamins.length;
    // Weighted by WHICH forms are present, not how many. Safe synthetics
    // (thiamine, riboflavin, niacin, pantothenate, folate, biotin, choline) cost
    // nothing; problem forms are weighted 3x. See vitaminLoadPenalty().
    const vitLoad = vitaminLoadPenalty(ingredientList);
    const vitLoadPenalty = vitLoad.penalty;
    const vitLevel = vitLoad.level;
    const vitPenalty = vitLoadPenalty;
    const fullText = (name + " " + rawIngredients).toLowerCase();
    const hasAAFCOTrial = AAFCO_TRIAL_KEYWORDS.some((k) =>
      fullText.includes(k),
    );
    const hasAAFCOProfile =
      fullText.includes("aafco") && fullText.includes("nutrient profile");
    const aafco = hasAAFCOTrial
      ? "✅ AAFCO Feeding Trials (gold standard)"
      : hasAAFCOProfile
        ? "🟡 AAFCO Nutrient Profile only"
        : "❓ AAFCO status not detected";
    const tapf = checkTAPFBrand(name);
    const processingResult = detectProcessingMethod(
      name,
      ingredientList,
      sheetProcessingMethod,
    );
    // Run holistic ingredient database audit
    const dbAudit = auditIngredientList(ingredientList);

    let total = 60;
    const breakdown: { label: string; value: number; severity?: string }[] = [];
    breakdown.push({ label: "Base score", value: 60 });
    if (processingResult.penalty > 0)
      breakdown.push({
        label: `Processing (${processingResult.rating})`,
        value: -processingResult.penalty,
      });
    if (processingResult.bonus > 0)
      breakdown.push({
        label: `Format bonus (${processingResult.rating})`,
        value: processingResult.bonus,
      });
    // ⚠️ MINERALS ARE CHARGED ONCE, NOT TWICE (changed 2026-09-11, Kyle approved).
    //
    // Every mineral form in a premix appears on BOTH lists: it's an entry in
    // HARMFUL_INGREDIENTS *and* it's counted again by vitaminLoadPenalty. Six
    // ordinary premix terms — zinc sulfate, ferrous sulfate, copper sulfate,
    // manganese sulfate, zinc oxide, sodium selenite — cost 24 points of a
    // 60-point base that way: -10 here, then -14 again below. EVERY kibble has
    // a premix, so every kibble started 24 points down before a single real
    // food ingredient was looked at. That is why Blue Buffalo Life Protection
    // and a corn-and-BHA grocery kibble both scored exactly 5, and why 24% of
    // the whole product database sat pinned at the floor.
    //
    // vitaminLoadPenalty is the right home for it: it already grades
    // chelate > sulfate > oxide and scales with how many concerning forms are
    // present, which is the actual signal. The per-ingredient charge was a
    // blunt duplicate.
    //
    // They are still FLAGGED and still shown with their reason — the user loses
    // no information. They're just not billed twice.
    const mineralTerms = [...VITAMIN_CONCERN_HIGH, ...VITAMIN_CONCERN_LOW].map((m) =>
      m.toLowerCase(),
    );
    for (const h of foundHarmful) {
      const pos = h.position ?? 0;
      const countedInVitaminLoad = mineralTerms.some((m) => h.name.toLowerCase().includes(m));
      const p = countedInVitaminLoad ? 0 : harmfulPenalty(h.severity, pos);
      total -= p;
      const posNote = pos >= 10 ? ` — ingredient #${pos + 1} (trace amount)` : pos >= 5 ? ` — ingredient #${pos + 1}` : "";
      breakdown.push({
        label: countedInVitaminLoad
          ? `${h.name} (${h.severity}) — counted in the vitamin & mineral load below`
          : `${h.name} (${h.severity})${posNote}`,
        value: -p,
        severity: h.severity,
      });
    }
    total -= processingResult.penalty;
    total += processingResult.bonus;
    if (vitLoadPenalty > 0) {
      total -= vitLoadPenalty;
      breakdown.push({
        label: `High synthetic vitamin/mineral load (${vitCount} added) — over-fortified formula`,
        value: -vitLoadPenalty,
      });
    }
    for (const vmp of VITAMIN_MINERAL_PENALTIES) {
      const hit = ingredientList.find((ing) => ing.toLowerCase().includes(vmp.term));
      if (hit) {
        total -= vmp.penalty;
        breakdown.push({ label: vmp.label, value: -vmp.penalty });
      }
    }
    // ⚠️ THE THIRD CHARGE ON THE SAME MINERALS (changed 2026-09-11, Kyle approved).
    //
    // TOXIC_ADDITIVES holds exactly four terms — copper sulfate, sodium
    // selenite, zinc oxide, dl-methionine — and EVERY ONE of them is already
    // counted by vitaminLoadPenalty. At -10 each this was the single largest
    // line on a typical kibble's breakdown: Blue Buffalo Life Protection lost
    // -20 here on top of -13 for the same two ingredients, on a 60-point base.
    //
    // Charging the same zinc oxide three times is how a food with deboned
    // chicken first, no corn, no wheat and blueberries on the label ended up
    // scoring the same as a corn-and-BHA grocery kibble.
    //
    // "Toxic" was also the wrong word. Zinc oxide is a poorly absorbed mineral
    // form, not a poison — and calling it toxic misinformed the user as well as
    // wrecking the score. The list is kept and still FLAGS these ingredients;
    // the charge now lives once, in the mineral system that grades forms
    // properly.
    const toxicNotAlreadyCounted = foundToxicAdditives.filter(
      (a: string) => !mineralTerms.some((m) => a.toLowerCase().includes(m)),
    );
    if (toxicNotAlreadyCounted.length > 0) {
      const p = toxicNotAlreadyCounted.length * 10;
      total -= p;
      breakdown.push({
        label: `Toxic additives (${toxicNotAlreadyCounted.length})`,
        value: -p,
      });
    }
    if (foundMeals.length > 0) {
      const p = foundMeals.length * 7;
      total -= p;
      breakdown.push({ label: `Unidentified generic meal (${foundMeals.length}) — sourcing unknown`, value: -p });
    }
    if (foundLegumesTop3.length > 0) {
      const p = foundLegumesTop3.length * 15;
      total -= p;
      breakdown.push({ label: `Legumes in top 3 ingredients (${foundLegumesTop3.length}) — DCM link`, value: -p });
    }
    const legumesTop5NotTop3 = foundLegumesTop5.length - foundLegumesTop3.length;
    if (legumesTop5NotTop3 > 0) {
      const p = legumesTop5NotTop3 * 7;
      total -= p;
      breakdown.push({ label: `Legumes in top 5 ingredients (${legumesTop5NotTop3}) — DCM link`, value: -p });
    }
    // Positions 6-10. Added 2026-08-23 — the penalty used to STOP at position 5,
    // which is a cliff, not a taper. A kibble with peas at #6 took no legume hit
    // at all and could score 100. That is the most common grain-free pattern on
    // the shelf, and docs/THE_LADDER.md says to count every occurrence rather
    // than stop at an arbitrary line. Small per item, because position further
    // down the label genuinely does mean less.
    const foundLegumes6to10 = ingredientList.slice(5, 10).filter((ing) =>
      LENTIL_LEGUME.some((l) => ing.toLowerCase().includes(l)),
    );
    if (foundLegumes6to10.length > 0) {
      const p6 = foundLegumes6to10.length * 3;
      total -= p6;
      breakdown.push({ label: `Legumes further down the label (${foundLegumes6to10.length}) — DCM link`, value: -p6 });
    }
    // Salt sits at roughly 1% of the formula, so its position bounds how much
    // real food is in the bag. Salt at #4 means almost everything listed is dust.
    const saltLine = saltLinePenalty(ingredientList);
    if (saltLine.penalty > 0) {
      total -= saltLine.penalty;
      breakdown.push({ label: `Salt is ingredient #${saltLine.position} — little real food below it`, value: -saltLine.penalty });
    }
    // Carb scoring: estimate % from ingredient position and count
    // Penalties kick in above ~25% carbs — dogs are carnivores, high carbs are problematic
    if (foundCarbs.length > 0) {
      const carbIsFirst = HIGH_CARB_INGREDIENTS.some((c) =>
        ingredientList[0]?.toLowerCase().includes(c),
      );
      const carbInTop2 = ingredientList
        .slice(0, 2)
        .some((ing) => HIGH_CARB_INGREDIENTS.some((c) => ing.toLowerCase().includes(c)));
      const carbInTop5 = ingredientList
        .slice(0, 5)
        .some((ing) => HIGH_CARB_INGREDIENTS.some((c) => ing.toLowerCase().includes(c)));
      const carbCount = foundCarbs.length;
      // Estimate the carbohydrate share from label position and count, then taper.
      // Same signals as before — this changes how they map to a penalty, not what's read.
      let estCarb = 0;
      if (carbIsFirst && carbCount >= 2) estCarb = 48;
      else if (carbIsFirst) estCarb = 40;
      else if (carbInTop2 && carbCount >= 2) estCarb = 37;
      else if (carbInTop2) estCarb = 30;
      else if (carbCount >= 3) estCarb = 27;
      else if (carbCount >= 2 && carbInTop5) estCarb = 22;
      const carbPenalty = carbPenaltyFor(estCarb);
      const carbLabel = estCarb
        ? `Est. ~${estCarb}% carbohydrate — ${
            carbIsFirst
              ? "a carb is the #1 ingredient"
              : carbInTop2
                ? "a carb is a primary ingredient"
                : "multiple carb sources"
          }`
        : "";
      // Single carb not in top 5: est. <20% — no penalty
      if (carbPenalty > 0) {
        total -= carbPenalty;
        breakdown.push({ label: carbLabel, value: -carbPenalty });
      }
    }
    if (genericInTop5.length > 0) {
      total -= 12;
      breakdown.push({ label: "Vague protein sourcing in top 5", value: -12 });
    }
    if (omegaRatingResult.bonus !== 0) {
      total += omegaRatingResult.bonus;
      breakdown.push({
        label: omegaRatingResult.label,
        value: omegaRatingResult.bonus,
      });
    }
    if (tapf) {
      total += 10;
      breakdown.push({ label: "On TAPF trusted list", value: 10 });
    }
    if (hasAAFCOTrial) {
      total += 5;
      breakdown.push({ label: "AAFCO feeding trial verified", value: 5 });
    }
    if (vitCount === 0) {
      total += 8;
      breakdown.push({
        label: "Whole food nutrition — no synthetic vitamins",
        value: 8,
      });
    }
    if (foundOrgans.length > 0) {
      const organBonus = Math.min(foundOrgans.length * 5, 25);
      total += organBonus;
      breakdown.push({
        label: `Organ meats (${foundOrgans.length}) — nutrient-dense whole food proteins`,
        value: organBonus,
      });
    }
    if (foundProduce.length > 0) {
      const produceBonus = Math.min(foundProduce.length * 2, 10);
      total += produceBonus;
      breakdown.push({
        label: `Whole food fruits & vegetables (${foundProduce.length})`,
        value: produceBonus,
      });
    }
    if (foundAntiInflammatory.length > 0) {
      const antiInflamBonus = Math.min(foundAntiInflammatory.length * 3, 12);
      total += antiInflamBonus;
      breakdown.push({
        label: `Anti-inflammatory ingredients (${foundAntiInflammatory.length}) — turmeric, fish oil, kelp, etc.`,
        value: antiInflamBonus,
      });
    }
    // Database audit — informational display only, not scored (ingredients already penalized above)
    total = Math.min(total, processingResult.scoreCap);
    if (foundHarmful.some((h) => h.severity === "toxic")) total = Math.min(total, TOXIC_SCORE_CEILING);
    total = Math.max(5, Math.round(total));

  return {
    total,
    breakdown,
    analysis: {
      foundHarmful, foundToxicAdditives, foundMeals, foundVitamins, foundLegumes,
      foundCarbs, foundOmega3, foundOmega6, foundFiber, foundProbiotics,
      foundOrgans, foundProduce, foundAntiInflammatory, genericInTop5,
      omegaRatingResult, aafco, tapf, processingResult, dbAudit,
      vitCount, vitPenalty, vitLevel,
    },
  }
}
