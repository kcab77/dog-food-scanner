// ─────────────────────────────────────────────────────────────────────────────
// Pet Food Ingredient Database
// Source: Internal holistic pet nutrition research database
// Based on holistic veterinary nutrition principles (Dr. Judy Morgan, Dr. Karen
// Becker, NRC guidelines, and peer-reviewed veterinary literature)
// ─────────────────────────────────────────────────────────────────────────────

export type SafetyRating = 'safe' | 'caution' | 'danger' | 'avoid'
export type FormQuality = 'best' | 'acceptable' | 'poor' | 'avoid'

export interface VitaminEntry {
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

export interface MineralEntry {
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

export interface ProteinEntry {
  name: string
  type: string
  safetyRating: SafetyRating
  commonAllergen: boolean
  allergenRisk: 'high' | 'medium-high' | 'medium' | 'medium-low' | 'low'
  digestibility: string
  qualityNote: string
  longTermConcern: string
  appFlag: string
}

// ─── VITAMINS ────────────────────────────────────────────────────────────────

export const VITAMIN_DATABASE: VitaminEntry[] = [
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

// ─── MINERALS ────────────────────────────────────────────────────────────────

export const MINERAL_DATABASE: MineralEntry[] = [
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

// ─── PROTEINS ────────────────────────────────────────────────────────────────

export const PROTEIN_DATABASE: ProteinEntry[] = [
  {
    name: 'Chicken',
    type: 'Poultry',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'high',
    digestibility: 'High (90%+)',
    qualityNote: 'Named whole chicken = good. Generic "poultry" = lower quality.',
    longTermConcern: 'Most common dog food allergen. Chronic exposure increases sensitization risk.',
    appFlag: '🔴 Most common allergen. Suspect chicken first if dog shows itching, ear infections, GI issues.',
  },
  {
    name: 'Chicken Meal',
    type: 'Poultry (rendered)',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'high',
    digestibility: 'High (concentrated)',
    qualityNote: 'Higher protein density than whole chicken. Named meal is acceptable.',
    longTermConcern: 'Same allergen risk as whole chicken. Rendering can degrade some nutrients.',
    appFlag: '🔴 Chicken meal is not inferior — it\'s concentrated. Still flag as high allergen risk.',
  },
  {
    name: 'Beef',
    type: 'Red Meat',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium-high',
    digestibility: 'High',
    qualityNote: 'Named beef = good quality signal.',
    longTermConcern: 'Second most common allergen. High fat — monitor pancreatitis-prone dogs.',
    appFlag: '🟠 Common allergen. Flag for dogs with skin issues or GI sensitivity.',
  },
  {
    name: 'Salmon',
    type: 'Fish',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'Very High (95%+)',
    qualityNote: 'Wild-caught preferred over farmed. Rich in Omega-3.',
    longTermConcern: 'Farmed salmon may contain higher PCBs/dioxins. Flag farmed vs wild when listed.',
    appFlag: '✅ Excellent protein. Flag farmed vs wild if specified.',
  },
  {
    name: 'Turkey',
    type: 'Poultry',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'High',
    qualityNote: 'Good novel protein for chicken-allergic dogs.',
    longTermConcern: 'Less allergenic than chicken but cross-reactivity possible in highly sensitized dogs.',
    appFlag: '✅ Good chicken alternative. Still flag as poultry allergen.',
  },
  {
    name: 'Lamb',
    type: 'Red Meat',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'High',
    qualityNote: 'Good novel protein. Often used in limited-ingredient diets.',
    longTermConcern: 'Higher fat than chicken. Weight gain risk in less active dogs.',
    appFlag: '✅ Good for food-sensitive dogs. Flag fat content for overweight dogs.',
  },
  {
    name: 'Duck',
    type: 'Poultry',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium-low',
    digestibility: 'High',
    qualityNote: 'Good novel protein with lower sensitization than chicken.',
    longTermConcern: 'High fat content — weight management concern.',
    appFlag: '✅ Novel protein — good for elimination diets. Flag high fat content.',
  },
  {
    name: 'Venison',
    type: 'Game Meat',
    safetyRating: 'safe',
    commonAllergen: false,
    allergenRisk: 'low',
    digestibility: 'High',
    qualityNote: 'Excellent novel protein. Rarely causes allergies. Lean.',
    longTermConcern: 'Very low allergen risk.',
    appFlag: '✅ Great for elimination diets. Rarely allergenic. Premium quality signal.',
  },
  {
    name: 'Rabbit',
    type: 'Game Meat',
    safetyRating: 'safe',
    commonAllergen: false,
    allergenRisk: 'low',
    digestibility: 'High',
    qualityNote: 'Excellent novel protein. Almost never an allergen. Very lean.',
    longTermConcern: 'Best novel protein for severely allergic dogs.',
    appFlag: '✅ Best novel protein for severely allergic dogs. Lean and highly digestible.',
  },
  {
    name: 'Herring',
    type: 'Fish (Oily)',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'Very High',
    qualityNote: 'Rich in Omega-3 EPA/DHA. Small fish = lower mercury risk.',
    longTermConcern: 'Heavy metal accumulation possible long-term with high-fish diets — lower risk than large fish.',
    appFlag: '✅ Excellent Omega-3 source. Lower mercury than large fish. Flag positively.',
  },
  {
    name: 'Tuna',
    type: 'Fish (Large)',
    safetyRating: 'caution',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'Very High',
    qualityNote: 'High mercury content is the primary concern.',
    longTermConcern: 'Mercury bioaccumulates. Not ideal as primary daily-fed protein — especially for small dogs.',
    appFlag: '⚠️ Flag tuna as primary protein. Occasional is fine — daily feeding = mercury concern.',
  },
  {
    name: 'Egg',
    type: 'Poultry Product',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'Highest (100% biological value)',
    qualityNote: 'Whole dried egg = gold standard protein source.',
    longTermConcern: 'Some dogs sensitive to egg whites specifically.',
    appFlag: '✅ Highest biological value protein available.',
  },
  {
    name: 'Bison',
    type: 'Game/Red Meat',
    safetyRating: 'safe',
    commonAllergen: false,
    allergenRisk: 'low',
    digestibility: 'High',
    qualityNote: 'Novel protein. Typically grass-fed. Lean.',
    longTermConcern: 'Very rarely allergenic.',
    appFlag: '✅ Premium novel protein. Good for allergic dogs.',
  },
  {
    name: 'Pork',
    type: 'Red Meat',
    safetyRating: 'safe',
    commonAllergen: true,
    allergenRisk: 'medium',
    digestibility: 'High',
    qualityNote: 'Good novel protein. Less common in mainstream food.',
    longTermConcern: 'Higher fat — pancreatitis risk in prone dogs.',
    appFlag: '✅ Novel protein for some dogs. Flag fat content for pancreatitis-prone dogs.',
  },
]

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

/**
 * Look up vitamin info by the synthetic form name as it appears on a pet food label.
 */
export function lookupVitaminBySyntheticForm(term: string): VitaminEntry | null {
  const t = term.toLowerCase().trim()
  return VITAMIN_DATABASE.find(v =>
    v.syntheticForms.some(f => t.includes(f) || f.includes(t))
  ) ?? null
}

/**
 * Look up mineral info by the synthetic form name as it appears on a pet food label.
 */
export function lookupMineralBySyntheticForm(term: string): MineralEntry | null {
  const t = term.toLowerCase().trim()
  return MINERAL_DATABASE.find(m =>
    m.syntheticForms.some(f => t.includes(f) || f.includes(t))
  ) ?? null
}

/**
 * Look up protein source info by name.
 */
export function lookupProtein(term: string): ProteinEntry | null {
  const t = term.toLowerCase().trim()
  return PROTEIN_DATABASE.find(p =>
    t.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(t)
  ) ?? null
}

/**
 * Check if an ingredient is a known poor/avoid form of a mineral or vitamin.
 * Returns a warning string or null.
 */
export function checkSyntheticFormQuality(term: string): {
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

/**
 * Check combination risks — e.g. Vitamin D3 + fish meal, kelp + potassium iodide.
 * Pass the full ingredient list; returns any triggered combination warnings.
 */
export function checkCombinationFlags(ingredientList: string[]): {
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

/**
 * Get all AVOID/DANGER flags for a full ingredient list.
 * Returns structured warnings for display.
 */
export function auditIngredientList(ingredientList: string[]): {
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
