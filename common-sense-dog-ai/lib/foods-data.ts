/**
 * ⚠️ GENERATED — DO NOT EDIT.
 *   node scripts/build-scoring.mjs && node scripts/build-foods.mjs
 *
 * Every food scored by PawGrade's real scorer, not a second implementation.
 * 122 publishable products of 122 rows in Supabase — the rest are cat
 * food, non-English labels, marketing copy, or scraper artifacts.
 *
 * Generated 2026-09-11.
 */
export type Food = {
  slug: string; brand: string; name: string; score: number; format: string
  ingredients: string[]
  breakdown: { label: string; value: number; severity?: string }[]
  flagged: { name: string; severity: string; reason: string }[]
  organs: string[]; produce: string[]
}

export const foods: Food[] = [
 {
  "slug": "bixbi-rawbble-freeze-dried-salmon-chicken-recipe-dog-food",
  "brand": "Bixbi",
  "name": "Rawbble Freeze-Dried Salmon & Chicken Recipe Dog Food",
  "score": 100,
  "format": "Freeze-Dried",
  "ingredients": [
   "Salmon",
   "Whitefish",
   "Chicken With Ground Bone",
   "Pumpkin",
   "Coconut Flour",
   "Coconut Oil",
   "Salmon Oil",
   "Selenium Yeast",
   "Vitamin E Supplement",
   "Manganese Proteinate",
   "Riboflavin Supplement",
   "Calcium Iodate",
   "D-calcium Pantothenate",
   "Mixed Tocopherols (A Preservative)",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Freeze-Dried)",
    "value": 25
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Pumpkin"
  ]
 },
 {
  "slug": "dr-marty-nature-s-blend-essential-wellness-freeze-dried-raw-dog-food",
  "brand": "Dr. Marty",
  "name": "Nature’s Blend Essential Wellness Freeze Dried Raw Dog Food",
  "score": 100,
  "format": "Raw",
  "ingredients": [
   "Turkey",
   "Beef",
   "Salmon",
   "Duck",
   "Beef Liver",
   "Turkey Liver",
   "Turkey Heart",
   "Flaxseed",
   "Sweet Potato",
   "Egg",
   "Pea Protein",
   "Apple",
   "Blueberry",
   "Carrot",
   "Cranberry",
   "Pumpkin Seed",
   "Spinach",
   "Dried Kelp",
   "Ginger",
   "Salt",
   "Sunflower Seed",
   "Broccoli",
   "Kale",
   "Mixed Tocopherols (Natural Preservative)."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Raw)",
    "value": 25
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   },
   {
    "label": "Whole food fruits & vegetables (7)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (3) — turmeric, fish oil, kelp, etc.",
    "value": 9
   }
  ],
  "flagged": [],
  "organs": [
   "Beef Liver",
   "Turkey Liver",
   "Turkey Heart"
  ],
  "produce": [
   "Sweet Potato",
   "Apple",
   "Blueberry",
   "Carrot",
   "Cranberry",
   "Pumpkin Seed",
   "Spinach"
  ]
 },
 {
  "slug": "instinct-frozen-raw-bites-grain-free-cage-free-chicken-recipe-dog-food",
  "brand": "Instinct",
  "name": "Frozen Raw Bites Grain Free Cage Free Chicken Recipe Dog Food, 3 lbs.",
  "score": 100,
  "format": "Raw",
  "ingredients": [
   "Chicken",
   "Chicken Meal",
   "Chicken Broth",
   "Chicken Liver",
   "Chicken Heart",
   "Chicken Kidney",
   "Ground Flaxseed",
   "Chicken Gizzard",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Sodium Selenite",
   "Potassium Iodide",
   "Vitamin E Supplement",
   "Vitamin A Supplement",
   "Vitamin B12 Supplement",
   "Riboflavin Supplement",
   "Vitamin D3 Supplement",
   "Ascorbic Acid",
   "Biotin",
   "Pantothenic Acid",
   "Pyridoxine Hydrochloride",
   "Folic Acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Raw)",
    "value": 25
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — raw with omega-3 sources)",
    "value": 5
   },
   {
    "label": "Organ meats (4) — nutrient-dense whole food proteins",
    "value": 20
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "Chicken Liver",
   "Chicken Heart",
   "Chicken Kidney",
   "Chicken Gizzard"
  ],
  "produce": []
 },
 {
  "slug": "instinct-the-raw-brand-raw-meals-puppy",
  "brand": "Instinct the raw brand",
  "name": "raw meals:puppy",
  "score": 100,
  "format": "Raw",
  "ingredients": [
   "chicken(including ground chicken bone)",
   "beef liver",
   "beef spleen",
   "Beef kidney",
   "cod",
   "pumpkin seeds",
   "carrots",
   "apples",
   "sweet potato",
   "butternut squash",
   "montmorillonite clay",
   "ground miscanthus grass",
   "ground flaxseed",
   "salmon oil",
   "chicory root",
   "tricalcium phosphate",
   "salt",
   "vitamin E supplement",
   "thiamine mononitrate",
   "vitamin D supplement",
   "potassium chloride zinc proteinate",
   "copper proteinate",
   "manganese proteinate",
   "calcium iodate",
   "mixed tocopherals",
   "blueberries",
   "spinach",
   "rosemary extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Raw)",
    "value": 25
   },
   {
    "label": "🐟 Excellent omega ratio (est. ≤5:1 — raw/freeze-dried with fish oil) — anti-inflammatory",
    "value": 10
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   },
   {
    "label": "Whole food fruits & vegetables (5)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [],
  "organs": [
   "beef liver",
   "beef spleen",
   "Beef kidney"
  ],
  "produce": [
   "pumpkin seeds",
   "carrots",
   "apples",
   "sweet potato",
   "butternut squash"
  ]
 },
 {
  "slug": "nulo-lamb-raspberries-freeze-dried-raw-dog-food-8-oz",
  "brand": "Nulo",
  "name": "Lamb & Raspberries Freeze-Dried Raw Dog Food, 8 oz.",
  "score": 100,
  "format": "Raw",
  "ingredients": [
   "Lamb",
   "Lamb Liver",
   "Lamb Kidney",
   "Lamb Tripe",
   "Raspberries",
   "Blueberries",
   "Spinach",
   "Broccoli",
   "Kale",
   "Chard",
   "Carrots",
   "Apples",
   "Celery",
   "Parsnips",
   "Green Beans"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Raw)",
    "value": 25
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   },
   {
    "label": "Whole food fruits & vegetables (7)",
    "value": 10
   }
  ],
  "flagged": [],
  "organs": [
   "Lamb Liver",
   "Lamb Kidney",
   "Lamb Tripe"
  ],
  "produce": [
   "Blueberries",
   "Spinach",
   "Broccoli",
   "Kale",
   "Carrots",
   "Apples",
   "Celery"
  ]
 },
 {
  "slug": "instinct-freshraw-meals-cage-free-chicken-recipe-dog-food-8-oz",
  "brand": "Instinct",
  "name": "FreshRaw Meals Cage-Free Chicken Recipe Dog Food, 8 oz.",
  "score": 90,
  "format": "Raw",
  "ingredients": [
   "Chicken",
   "Chicken Liver",
   "Chicken Heart",
   "Chicken Kidney",
   "Potato Starch",
   "Guar Gum",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Sodium Selenite",
   "Vitamin E Supplement",
   "Calcium Iodide",
   "Vitamin B12 Supplement",
   "Vitamin A Supplement",
   "Vitamin D3 Supplement"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Raw)",
    "value": 25
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Salt is ingredient #8 — little real food below it",
    "value": -4
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   }
  ],
  "flagged": [
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver",
   "Chicken Heart",
   "Chicken Kidney"
  ],
  "produce": []
 },
 {
  "slug": "nutrients-infusion-adult-weight-control-freeze-dried",
  "brand": "Nutrients",
  "name": "Infusion Adult Weight Control Freeze Dried",
  "score": 89,
  "format": "Freeze-Dried",
  "ingredients": [
   "Deboned chicken",
   "chicken meal",
   "red lentils",
   "pearled barley",
   "steel cut oats",
   "green peas",
   "chicken fat (preserved with mixed tocopherols)",
   "sun-cured alfalfa meal",
   "natural chicken flavour",
   "freeze-dried chicken liver",
   "salmon oil",
   "coconut oil",
   "pumpkin",
   "butternut squash",
   "carrots",
   "broccoli",
   "spinach",
   "pomegranate",
   "apples",
   "cranberries",
   "blueberries",
   "juniper berry extract",
   "ginger",
   "fennel",
   "chamomile",
   "peppermint leaf",
   "licorice root",
   "turmeric",
   "vitamins (vitamin E supplement, vitamin A supplement, niacin, calcium pantothenate, riboflavin, pyridoxine hydrochloride, thiamine mononitrate, biotin, vitamin B12 supplement, vitamin D3 supplement, folic acid)",
   "minerals (zinc sulfate, zinc proteinate, iron proteinate, ferrous sulfate, copper proteinate, copper sulfate, manganese proteinate, manganous oxide, calcium iodate, sodium selenite)",
   "lecithin",
   "salt",
   "choline chloride",
   "potassium chloride",
   "chicory root extract",
   "yeast extract",
   "calcium carbonate",
   "DL-methionine",
   "L-lysine",
   "taurine",
   "glucosamine hydrochloride",
   "chondroitin sulfate",
   "rosemary extract",
   "L-carnitine",
   "dried Lactobacillus acidophilus fermentation product",
   "dried Lactobacillus casei fermentation product",
   "dried Bifidobacterium bifidum fermentation product",
   "dried Enterococcus faecium fermentation product."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Freeze-Dried)",
    "value": 25
   },
   {
    "label": "vitamins (vitamin E supplement, vitamin A supplement, niacin, calcium pantothenate, riboflavin, pyridoxine hydrochloride, thiamine mononitrate, biotin, vitamin B12 supplement, vitamin D3 supplement, folic acid) (mild) — ingredient #29 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Excellent omega ratio (est. ≤5:1 — raw/freeze-dried with fish oil) — anti-inflammatory",
    "value": 10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (8)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (4) — turmeric, fish oil, kelp, etc.",
    "value": 12
   }
  ],
  "flagged": [
   {
    "name": "vitamins (vitamin E supplement, vitamin A supplement, niacin, calcium pantothenate, riboflavin, pyridoxine hydrochloride, thiamine mononitrate, biotin, vitamin B12 supplement, vitamin D3 supplement, folic acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "minerals (zinc sulfate, zinc proteinate, iron proteinate, ferrous sulfate, copper proteinate, copper sulfate, manganese proteinate, manganous oxide, calcium iodate, sodium selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "DL-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [
   "freeze-dried chicken liver"
  ],
  "produce": [
   "pumpkin",
   "butternut squash",
   "carrots",
   "broccoli",
   "spinach",
   "apples",
   "cranberries",
   "blueberries"
  ]
 },
 {
  "slug": "acana-wholesome-grains-small-breed-recipe-dry-dog-food",
  "brand": "Acana",
  "name": "Wholesome Grains Small Breed Recipe Dry Dog Food",
  "score": 87,
  "format": "Kibble with raw pieces",
  "ingredients": [
   "Deboned Chicken",
   "Chicken Meal",
   "Oat Groats",
   "Whole Sorghum",
   "Whole Millet",
   "Eggs",
   "Catfish Meal",
   "Chicken Fat",
   "Whole Oats",
   "Deboned Turkey",
   "Chicken Liver",
   "Fish Oil",
   "Ground Miscanthus Grass",
   "Natural Chicken Flavor",
   "Chicken Cartilage",
   "Turkey Giblets (Liver, Heart, Gizzard)",
   "Chicken Heart",
   "Whole Butternut Squash",
   "Whole Pumpkin",
   "Salt",
   "Potassium Chloride",
   "Choline Chloride",
   "Taurine",
   "Dried Kelp",
   "Vitamin E Supplement",
   "Mixed Tocopherols (Preservative)",
   "Zinc Proteinate",
   "Vitamin D3 Supplement",
   "Vitamin A Acetate",
   "Freeze-dried Chicken Liver",
   "Freeze-dried Turkey Liver",
   "Copper Proteinate",
   "Niacin",
   "Thiamine Mononitrate",
   "Riboflavin",
   "Calcium Pantothenate",
   "Pyridoxine Hydrochloride",
   "Folic Acid",
   "Vitamin B12 Supplement",
   "Chicory Root",
   "Turmeric",
   "Sarsaparilla",
   "Althea Root",
   "Rosehips",
   "Juniper Berries",
   "Citric Acid (Preservative)",
   "Rosemary Extract",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Bifidobacterium Animalis Fermentation Product",
   "Dried Lactobacillus Casei Fermentation Product."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Kibble with raw pieces)",
    "value": 5
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #37 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Organ meats (5) — nutrient-dense whole food proteins",
    "value": 25
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "Chicken Liver",
   "Turkey Giblets (Liver, Heart, Gizzard)",
   "Chicken Heart",
   "Freeze-dried Chicken Liver",
   "Freeze-dried Turkey Liver"
  ],
  "produce": [
   "Whole Butternut Squash",
   "Whole Pumpkin"
  ]
 },
 {
  "slug": "open-farm-prairie-grain-free-rawmix-dry-dog-food",
  "brand": "Open Farm",
  "name": "Prairie Grain-Free RawMix - Dry Dog Food",
  "score": 85,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Turkey",
   "Potatoes",
   "Menhaden Fish. Meal",
   "Herring Meal",
   "Sweet Potatoes",
   "Tapioca",
   "Coconut Oil",
   "Sunflower Oil (Preserved With Mixed Tocopherols)",
   "Pumpkin",
   "Natural Flavor",
   "Carrots",
   "Apples",
   "Cranberries",
   "Salt",
   "Chicken Liver",
   "Chicken Neck",
   "Potassium Chloride",
   "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
   "Dried Chicory Root",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Selenium Yeast, Calcium Iodate)",
   "Organic Butternut Squash",
   "Dried Kelp",
   "Taurine",
   "Organic Blueberries",
   "Turkey Gizzard",
   "Montmorillonite Clay",
   "Miscanthus Grass",
   "Choline Chloride",
   "Chicken Bone Broth",
   "Flaxseed",
   "Cinnamon",
   "Turmeric",
   "Organic Spinach",
   "Dandelion Greens",
   "Organic Kale",
   "Organic Apple Cider Vinegar",
   "Organic Pumpkin Seeds",
   "Organic Sunflower Seeds",
   "Rosemary Extract. Caloric Content Me 3",
   "810 Kcal/kg",
   "405 Kcal/cup"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid) (mild) — ingredient #19 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (5)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver",
   "Turkey Gizzard"
  ],
  "produce": [
   "Sweet Potatoes",
   "Pumpkin",
   "Carrots",
   "Apples",
   "Cranberries"
  ]
 },
 {
  "slug": "open-farm-front-range-grain-free-rawmix-dry-dog-food",
  "brand": "Open Farm",
  "name": "Front Range Grain-Free RawMix - Dry Dog Food",
  "score": 81,
  "format": "Kibble",
  "ingredients": [
   "Beef",
   "Menhaden Fish Meal",
   "Sweet Potatoes",
   "Pork",
   "Potatoes",
   "Herring Meal",
   "Tapioca",
   "Pumpkin",
   "Lamb",
   "Coconut Oil",
   "Natural Flavor",
   "Carrots",
   "Apples",
   "Sunflower Oil (Preserved With Mixed Tocopherols)",
   "Cranberries",
   "Salt",
   "Pork Liver",
   "Potassium Chloride",
   "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
   "Dried Chicory Root",
   "Salmon Oil (Preserved With Mixed Tocopherols)",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Selenium Yeast, Calcium Iodate)",
   "Organic Butternut Squash",
   "Dried Kelp",
   "Organic Blueberries",
   "Beef Kidney",
   "Montmorillonite Clay",
   "Miscanthus Grass",
   "Choline Chloride",
   "Beef Bone Broth",
   "Flaxseed",
   "Taurine",
   "Cinnamon",
   "Turmeric",
   "Organic Spinach",
   "Dandelion Greens",
   "Organic Kale",
   "Organic Apple Cider Vinegar",
   "Organic Pumpkin Seeds",
   "Organic Sunflower Seeds",
   "Rosemary Extract. Caloric Content Me 3",
   "545 Kcal/kg",
   "405 Kcal/cup"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid) (mild) — ingredient #19 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (5)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Vitamin D3 Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Pork Liver",
   "Beef Kidney"
  ],
  "produce": [
   "Sweet Potatoes",
   "Pumpkin",
   "Carrots",
   "Apples",
   "Cranberries"
  ]
 },
 {
  "slug": "freshpet-homestyle-creations-chicken-and-turkey-flavor-recipe-wet-dog-",
  "brand": "Freshpet",
  "name": "Homestyle Creations Chicken and Turkey Flavor Recipe Wet Dog Food - 2lbs: Shredded, All Breed Sizes, Adult, Sensitive Stomach",
  "score": 80,
  "format": "Gently Cooked",
  "ingredients": [
   "Chicken",
   "Turkey",
   "Sweet Potatoes",
   "Carrots",
   "Green Beans",
   "Apples",
   "Chicken Liver",
   "Chicken Broth",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Thiamine Mononitrate",
   "Vitamin E Supplement",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Sodium Selenite",
   "Cobalt Carbonate",
   "Vitamin A Supplement",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Gently Cooked)",
    "value": 22
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #22 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (3)",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Sweet Potatoes",
   "Carrots",
   "Apples"
  ]
 },
 {
  "slug": "orijen-six-fish-dry-dog-food",
  "brand": "Orijen",
  "name": "Six Fish Dry Dog Food",
  "score": 80,
  "format": "Kibble",
  "ingredients": [
   "Whole Mackerel",
   "Whole Herring",
   "Monkfish",
   "Acadian Redfish",
   "Flounder",
   "Whole Hake",
   "Mackerel Meal",
   "Herring Meal",
   "Blue Whiting Meal",
   "Pollock Meal",
   "Whole Red Lentils",
   "Whole Pinto Beans",
   "Safflower Oil",
   "Whole Peas",
   "Whole Green Lentils",
   "Whole Navy Beans",
   "Sunflower Oil",
   "Lentil Fiber",
   "Natural Fish Flavor",
   "Whole Chickpeas",
   "Pea Starch",
   "Herring Oil",
   "Vitamin E Supplement",
   "Mixed Tocopherols (Preservative)",
   "Whole Pumpkin",
   "Whole Butternut Squash",
   "Collard Greens",
   "Whole Apples",
   "Whole Pears",
   "Dried Kelp",
   "Zinc Proteinate",
   "Calcium Pantothenate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Dried Chicory Root",
   "Turmeric",
   "Sarsaparilla Root",
   "Althea Root",
   "Rosehips",
   "Juniper Berries",
   "Citric Acid (Preservative)",
   "Rosemary Extract",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Bifidobacterium Animalis Fermentation Product",
   "Dried Lactobacillus Casei Fermentation Product."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (3)",
    "value": 6
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Whole Pumpkin",
   "Whole Butternut Squash",
   "Whole Apples"
  ]
 },
 {
  "slug": "wellness-core-rawrev-wholesome-grains-small-breed-original-recipe",
  "brand": "Wellness",
  "name": "CORE RawRev Wholesome Grains Small Breed Original Recipe",
  "score": 76,
  "format": "Kibble with raw pieces",
  "ingredients": [
   "Deboned Turkey",
   "Turkey Meal (Source Of Glucosamine)",
   "Chicken Meal (Source Of Chondroitin Sulfate)",
   "Barley",
   "Oatmeal",
   "Turkey Liver",
   "Ground Flaxseed",
   "Quinoa",
   "Tomato Pomace",
   "Chicken Fat",
   "Natural Turkey Flavor",
   "Salmon Oil",
   "Chicory Root Extract",
   "Potassium Chloride",
   "Choline Chloride",
   "Vitamin E Supplement",
   "Taurine",
   "Spinach",
   "Broccoli",
   "Carrots",
   "Parsley",
   "Apples",
   "Blueberries",
   "Kale",
   "Mixed Tocopherols Added To Preserve Freshness",
   "Zinc Proteinate",
   "Zinc Sulfate",
   "Calcium Carbonate",
   "Niacin",
   "Iron Proteinate",
   "Ferrous Sulfate",
   "Yucca Schidigera Extract",
   "Vitamin A Supplement",
   "Copper Sulfate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Manganese Sulfate",
   "D-calcium Pantothenate",
   "Sodium Selenite",
   "Pyridoxine Hydrochloride",
   "Riboflavin",
   "Biotin",
   "Vitamin D3 Supplement",
   "Calcium Iodate",
   "Vitamin B12 Supplement",
   "Folic Acid",
   "Ascorbic Acid (Vitamin C)",
   "Dried Lactobacillus Plantarum Fermentation Product",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Lactobacillus Casei Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Rosemary Extract",
   "Green Tea Extract",
   "Spearmint Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Kibble with raw pieces)",
    "value": 5
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #41 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #44 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (7)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Turkey Liver"
  ],
  "produce": [
   "Spinach",
   "Broccoli",
   "Carrots",
   "Parsley",
   "Apples",
   "Blueberries",
   "Kale"
  ]
 },
 {
  "slug": "instinct-raw-boost-beef-3-5lb",
  "brand": "Instinct",
  "name": "Raw Boost Beef, 3.5LB",
  "score": 74,
  "format": "Kibble with raw pieces",
  "ingredients": [
   "Beef",
   "Chicken Meal",
   "Barley",
   "Oatmeal",
   "Brown Rice",
   "Chicken Fat (Preserved With Mixed Tocopherols)",
   "Turkey Meal",
   "Ground Flaxseed",
   "Sorghum",
   "Freeze-dried Beef",
   "Natural Flavor",
   "Fish Meal",
   "Freeze-dried Beef Spleen",
   "Freeze-dried Beef Liver",
   "Carrots",
   "Pumpkin Seeds",
   "Freeze-dried Beef Kidney",
   "Salt",
   "Apples",
   "Blueberries",
   "Cranberries",
   "Potassium Chloride",
   "Dried Yeast",
   "Montmorillonite Clay",
   "Miscanthus Grass",
   "Vitamins (Vitamin E Supplement, Niacin Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement, Biotin)",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Sodium Selenite, Ethylenediamine Dihydriodide)",
   "Choline Chloride",
   "Freeze-dried Pollock",
   "Yeast Culture",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Aspergillus Oryzae Fermentation Extract",
   "Dried Trichoderma Longibrachiatum Fermentation Extract",
   "Dried Bacillus Subtilis Fermentation Extract",
   "Salmon Oil",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Kibble with raw pieces)",
    "value": 5
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Niacin Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement, Biotin) (mild) — ingredient #26 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Yeast Culture (mild) — ingredient #30 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Niacin Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement, Biotin)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Sodium Selenite, Ethylenediamine Dihydriodide)",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Yeast Culture",
    "severity": "mild",
    "reason": "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten."
   }
  ],
  "organs": [
   "Freeze-dried Beef Spleen",
   "Freeze-dried Beef Liver",
   "Freeze-dried Beef Kidney"
  ],
  "produce": [
   "Carrots",
   "Pumpkin Seeds"
  ]
 },
 {
  "slug": "open-farm-salmon-oatmeal-skin-coat-health-kibble-dog-food",
  "brand": "Open Farm",
  "name": "Salmon & Oatmeal Skin & Coat Health Kibble Dog Food",
  "score": 74,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Menhaden Fish Meal",
   "Milo",
   "Barley",
   "Herring Meal",
   "Oatmeal",
   "Coconut Oil",
   "Salmon Oil",
   "Sunflower Oil (Preserved With Mixed Tocopherols)",
   "Natural Flavor",
   "Flaxseed",
   "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
   "Biotin",
   "Apples",
   "Carrots",
   "Cranberries",
   "Taurine",
   "Salt",
   "Calcium Carbonate",
   "Minerals (Zinc Proteinate, Iron Proteinate, Potassium Chloride, Selenium Yeast, Copper Proteinate, Manganese Proteinate, Calcium Iodate)",
   "Potassium Chloride",
   "Mixed Tocopherols (A Preservative)",
   "Choline Chloride",
   "Rosemary Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid) (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (3)",
    "value": 6
   },
   {
    "label": "Anti-inflammatory ingredients (3) — turmeric, fish oil, kelp, etc.",
    "value": 9
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, Pantothenic Acid, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Apples",
   "Carrots",
   "Cranberries"
  ]
 },
 {
  "slug": "ziwi-peak-zealand-chicken-recipe-canned-dog-food",
  "brand": "Ziwi Peak",
  "name": "Zealand Chicken Recipe Canned Dog Food",
  "score": 73,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken",
   "Water Sufficient For Processing",
   "Chicken Liver",
   "Chicken Heart",
   "Chickpeas",
   "New Zealand Green Mussel",
   "Chicken Bone",
   "Minerals (Dipotassium Phosphate, Magnesium Sulfate, Zinc Amino Acid Complex, Copper Amino Acid Complex, Selenium Yeast, Manganese Amino Acid Complex)",
   "Dried Kelp",
   "Salt",
   "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Vitamin B5 Supplement, Vitamin D3 Supplement, Folic Acid). Caloric Content 517 Kcal Me/13.75 Oz Can"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Vitamin B5 Supplement, Vitamin D3 Supplement, Folic Acid). Caloric Content 517 Kcal Me/13.75 Oz Can (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (1 added) — over-fortified formula",
    "value": -2
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Vitamin B5 Supplement, Vitamin D3 Supplement, Folic Acid). Caloric Content 517 Kcal Me/13.75 Oz Can",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver",
   "Chicken Heart"
  ],
  "produce": []
 },
 {
  "slug": "wellness-natural-pet-food-wellness-core-rawrev-grain-free-natural-pupp",
  "brand": "Wellness Natural Pet Food",
  "name": "Wellness CORE RawRev Grain Free Natural Puppy Dry Dog Food Puppy Recipe with Freeze Dried Turkey 4lb Bag",
  "score": 72,
  "format": "Kibble with raw pieces",
  "ingredients": [
   "Turkey",
   "Chicken Meal",
   "Turkey Meal",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Potatoes",
   "Peas",
   "Freeze Dried Turkey",
   "Chicken Broth",
   "Flaxseed",
   "Salmon Oil",
   "Chicken Cartilage",
   "Tomato Pomace",
   "Spinach",
   "Broccoli",
   "Kale",
   "Parsley",
   "Blueberries",
   "Broccoli Extract",
   "Turmeric Extract",
   "Rosemary Extract",
   "Dried Kelp",
   "Probiotics (Enterococcus faecium, Lactobacillus casei, Lactobacillus acidophilus)",
   "Taurine",
   "Choline Chloride",
   "Zinc Amino Acid Chelate",
   "Iron Amino Acid Chelate",
   "Thiamine Mononitrate",
   "Vitamin E Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Cobalt Amino Acid Chelate",
   "Selenium Yeast",
   "Cobalt Glucoheptonate",
   "Vitamin A Supplement",
   "Riboflavin Supplement",
   "Biotin",
   "Vitamin B12 Supplement",
   "Pantothenic Acid",
   "Manganese Proteinate",
   "Calcium Pantothenate",
   "Pyridoxine Hydrochloride",
   "Vitamin D3 Supplement",
   "Folic Acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Kibble with raw pieces)",
    "value": 5
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #41 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #42 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (6)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (4) — turmeric, fish oil, kelp, etc.",
    "value": 12
   }
  ],
  "flagged": [
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": [
   "Spinach",
   "Broccoli",
   "Kale",
   "Parsley",
   "Blueberries",
   "Broccoli Extract"
  ]
 },
 {
  "slug": "stella-chewy-s-meal-mixers-dandy-lamb",
  "brand": "Stella & Chewy's",
  "name": "Meal Mixers Dandy Lamb",
  "score": 71,
  "format": "Kibble",
  "ingredients": [
   "Lamb",
   "lamb liver",
   "lamb spleen",
   "lamb heart",
   "lamb kidney",
   "lamb bone",
   "pumpkin seed",
   "organic cranberries",
   "organic spinach",
   "organic broccoli",
   "organic beets",
   "organic carrots",
   "organic squash",
   "organic blueberries",
   "fenugreek seed",
   "potassium chloride",
   "dried kelp",
   "sodium phosphate",
   "tocopherols (preservative)",
   "choline chloride",
   "dried Pediococcus acidilactici fermentation product",
   "dried Lactobacillus acidophilus fermentation product",
   "dried Bifidobacterium longum fermentation product",
   "dried Bacillus coagulans fermentation product",
   "zinc proteinate",
   "iron proteinate",
   "taurine",
   "calcium carbonate",
   "vitamin E supplement",
   "thiamine mononitrate",
   "copper proteinate",
   "manganese proteinate",
   "sodium selenite",
   "niacin supplement",
   "d-calcium pantothenate",
   "riboflavin supplement",
   "vitamin A supplement",
   "vitamin D3 supplement",
   "vitamin B12 supplement",
   "pyridoxine hydrochloride",
   "folic acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #38 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (mild) — ingredient #40 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Organ meats (4) — nutrient-dense whole food proteins",
    "value": 20
   },
   {
    "label": "Whole food fruits & vegetables (8)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "pyridoxine hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "lamb liver",
   "lamb spleen",
   "lamb heart",
   "lamb kidney"
  ],
  "produce": [
   "pumpkin seed",
   "organic cranberries",
   "organic spinach",
   "organic broccoli",
   "organic beets",
   "organic carrots",
   "organic squash",
   "organic blueberries"
  ]
 },
 {
  "slug": "health-extension-grain-free-buffalo-whitefish-recipe-dry-dog-food",
  "brand": "Health Extension",
  "name": "Grain Free Buffalo & Whitefish Recipe Dry Dog Food",
  "score": 69,
  "format": "Kibble",
  "ingredients": [
   "Buffalo",
   "Deboned Whitefish",
   "Whitefish Meal (Source Of Omega 3 Fatty Acids)",
   "Whole Sweet Potatoes",
   "Pork Meal",
   "Peas",
   "Chickpeas",
   "Lentils",
   "Salmon Oil (Preserved With Mixed Tocopherols)",
   "Dried Beet Pulp",
   "Coconut Oil",
   "Organic Apple Cider Vinegar",
   "Organic Turmeric",
   "Organic Black Pepper",
   "Organic Ginger",
   "Bovine Colostrum",
   "Organic Blueberries",
   "Cranberries",
   "Organic Goji Berries",
   "Organic Tart Cherries",
   "Organic Pomegranate",
   "Organic Pineapple",
   "Organic Papaya",
   "Organic Apple",
   "Dried Kelp",
   "Dried Seaweed Meal",
   "New Zealand Green Mussel",
   "Organic Carrots",
   "Organic Pumpkin",
   "Green Tea Extract",
   "Sage Extract",
   "Organic Parsley",
   "Organic Spinach",
   "Organic Kale",
   "Sweet Basil",
   "Thyme Extract",
   "Organic Ashwagandha",
   "Organic Chaga",
   "Organic Lion’s Mane",
   "Organic Reishi",
   "Organic Turkey Tail",
   "Organic Shiitake",
   "Organic Maitake",
   "Organic Cordyceps",
   "Vitamin A Acetate",
   "Vitamin E Supplement",
   "Riboflavin Supplement",
   "Vitamin B12 Supplement",
   "Vitamin D3 Supplement",
   "Niacin Supplement",
   "Choline Chloride",
   "Pyridoxine Hydrochloride",
   "Thiamine Mononitrate",
   "Folic Acid",
   "Biotin",
   "Zinc Polysaccharide Complex",
   "Iron Polysaccharide Complex",
   "Manganese Polysaccharide Complex",
   "Copper Polysaccharide Complex",
   "Cobalt Polysaccharide Complex"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #49 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #52 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes further down the label (3) — DCM link",
    "value": -9
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (12)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (5) — turmeric, fish oil, kelp, etc.",
    "value": 12
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Whole Sweet Potatoes",
   "Dried Beet Pulp",
   "Organic Apple Cider Vinegar",
   "Organic Blueberries",
   "Cranberries",
   "Organic Pineapple",
   "Organic Apple",
   "Organic Carrots",
   "Organic Pumpkin",
   "Organic Parsley",
   "Organic Spinach",
   "Organic Kale"
  ]
 },
 {
  "slug": "freshpet-vital-balanced-nutrition-2-lb-chicken-veg-rice",
  "brand": "Freshpet",
  "name": "Vital Balanced Nutrition 2 Lb Chicken, Veg & Rice",
  "score": 68,
  "format": "Gently Cooked",
  "ingredients": [
   "Chicken",
   "Chicken Meal",
   "Wheat Gluten",
   "Corn Meal",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Wheat",
   "Corn",
   "Soy Lecithin",
   "Chicken Broth",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Sodium Selenite",
   "Vitamin A Supplement",
   "Vitamin D3 Supplement",
   "Vitamin E Supplement",
   "Ascorbic Acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Gently Cooked)",
    "value": 22
   },
   {
    "label": "Wheat Gluten (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   }
  ],
  "flagged": [
   {
    "name": "Wheat Gluten",
    "severity": "mild",
    "reason": "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "open-farm-epic-blend-salmon-superfood-dry-dog-food",
  "brand": "Open Farm",
  "name": "Epic Blend Salmon & Superfood Dry Dog Food",
  "score": 67,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Menhaden Fish Meal",
   "Oats",
   "Barley",
   "Whitefish Meal",
   "Milo",
   "Flaxseed",
   "Pollock",
   "Coconut Oil",
   "Sweet Potatoes",
   "Pumpkin",
   "Natural Flavor",
   "Coconut Glycerin",
   "Sunflower Oil (Preserved With Mixed Tocopherols)",
   "Carrots",
   "Blueberries",
   "Cranberries",
   "Dried Chicory Root",
   "Broccoli",
   "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, D-calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
   "Salt",
   "Taurine",
   "Apples",
   "Salmon Oil (Preserved With Mixed Tocopherols)",
   "Kale",
   "Raspberries",
   "Spinach",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Selenium Yeast, Calcium Iodate)",
   "Turmeric",
   "Cinnamon",
   "Fish Bone Broth",
   "Dried Bacillus Coagulans Fermentation Product",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, D-calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid) (mild) — ingredient #20 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (2) — sourcing unknown",
    "value": -14
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (6)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (3) — turmeric, fish oil, kelp, etc.",
    "value": 9
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, D-calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potatoes",
   "Pumpkin",
   "Carrots",
   "Blueberries",
   "Cranberries",
   "Broccoli"
  ]
 },
 {
  "slug": "stella-chewy-s-meal-mixers-duck-duck-goose-recipe",
  "brand": "Stella & Chewy's",
  "name": "Meal Mixers Duck Duck Goose Recipe",
  "score": 66,
  "format": "Kibble",
  "ingredients": [
   "Duck with ground bone",
   "turkey",
   "turkey liver",
   "turkey heart",
   "goose",
   "turkey gizzard",
   "pumpkin seed",
   "organic cranberries",
   "organic spinach",
   "organic broccoli",
   "organic beets",
   "organic carrots",
   "organic squash",
   "organic blueberries",
   "fenugreek seed",
   "potassium chloride",
   "dried kelp",
   "sodium phosphate",
   "tocopherols (preservative)",
   "choline chloride",
   "salt",
   "dried Pediococcus acidilactici fermentation product",
   "dried Lactobacillus acidophilus fermentation product",
   "dried Bifidobacterium longum fermentation product",
   "dried Bacillus coagulans fermentation product",
   "zinc proteinate",
   "iron proteinate",
   "taurine",
   "calcium carbonate",
   "vitamin E supplement",
   "thiamine mononitrate",
   "copper proteinate",
   "manganese proteinate",
   "sodium selenite",
   "niacin supplement",
   "d-calcium pantothenate",
   "riboflavin supplement",
   "vitamin A supplement",
   "vitamin D3 supplement",
   "vitamin B12 supplement",
   "pyridoxine hydrochloride",
   "folic acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #39 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (mild) — ingredient #41 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Organ meats (3) — nutrient-dense whole food proteins",
    "value": 15
   },
   {
    "label": "Whole food fruits & vegetables (8)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "pyridoxine hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "turkey liver",
   "turkey heart",
   "turkey gizzard"
  ],
  "produce": [
   "pumpkin seed",
   "organic cranberries",
   "organic spinach",
   "organic broccoli",
   "organic beets",
   "organic carrots",
   "organic squash",
   "organic blueberries"
  ]
 },
 {
  "slug": "chicken-soup-puppy-turkey-duck-wet-dog-food",
  "brand": "Chicken Soup",
  "name": "Puppy Turkey & Duck Wet Dog Food",
  "score": 65,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken",
   "Chicken Liver",
   "Turkey",
   "Chicken Broth",
   "Turkey Broth",
   "Duck",
   "Salmon",
   "Brown Rice",
   "Oatmeal",
   "Carrots",
   "Ground Barley",
   "Ground Flaxseed",
   "Peas",
   "Potatoes",
   "Dried Egg Product",
   "Dicalcium Phosphate",
   "Potassium Chloride",
   "Salt",
   "Fish Oil (Preserved With Mixed Tocopherols)",
   "Cassia Gum",
   "Xanthan Gum",
   "Apples",
   "Cranberries",
   "Dried Kelp",
   "Inulin",
   "Choline Chloride",
   "Vitamins (Thiamine Mononitrate, Vitamin E Supplement, Niacin Supplement, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Vitamin D3 Supplement, Folic Acid)",
   "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Proteinate, Sodium Selenite, Manganese Sulfate, Potassium Iodide)",
   "Yucca Schidigera Extract",
   "Parsley."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Thiamine Mononitrate, Vitamin E Supplement, Niacin Supplement, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Vitamin D3 Supplement, Folic Acid) (mild) — ingredient #27 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Vitamins (Thiamine Mononitrate, Vitamin E Supplement, Niacin Supplement, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Vitamin D3 Supplement, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Proteinate, Sodium Selenite, Manganese Sulfate, Potassium Iodide)",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Carrots"
  ]
 },
 {
  "slug": "the-honest-kitchen-grain-free-beef-clusters-dry-dog-food",
  "brand": "The Honest Kitchen",
  "name": "Grain Free Beef Clusters Dry Dog Food",
  "score": 65,
  "format": "Kibble",
  "ingredients": [
   "Beef",
   "Potatoes",
   "Peas",
   "Beef Liver",
   "Lentils",
   "Carrots",
   "Ground Flaxseed",
   "Eggs",
   "Broccoli",
   "Pumpkin",
   "Apples",
   "Salmon Oil",
   "Natural Beef Flavor",
   "Coconut Oil",
   "Kale",
   "Chia Seed",
   "Minerals [calcium Carbonate",
   "Tricalcium Phosphate",
   "Sodium Chloride",
   "Iron Amino Acid Chelate",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Zinc Amino Acid Chelate",
   "Sodium Selenite]",
   "Fenugreek Seed",
   "Dried Kelp",
   "Taurine",
   "Vitamins [vitamin A Supplement",
   "Vitamin D3 Supplement",
   "Vitamin E Supplement",
   "Thiamine Mononitrate (Vitamin B1)",
   "Riboflavin (Vitamin B2)",
   "Calcium Pantothenate (Vitamin B5)",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Folic Acid",
   "Vitamin B12 Supplement",
   "Niacin Supplement]",
   "Mixed Tocopherols (A Natural Preservative)",
   "Turmeric",
   "Dried Bacillus Coagulans Fermentation Product",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #29 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #34 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (5)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (4) — turmeric, fish oil, kelp, etc.",
    "value": 12
   }
  ],
  "flagged": [
   {
    "name": "Sodium Selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "Beef Liver"
  ],
  "produce": [
   "Carrots",
   "Broccoli",
   "Pumpkin",
   "Apples",
   "Kale"
  ]
 },
 {
  "slug": "purevita-salmon-kale-dog-food",
  "brand": "PureVita",
  "name": "Salmon & Kale Dog Food",
  "score": 61,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Oatmeal",
   "Barley",
   "Brown Rice",
   "Millet",
   "Sunflower Oil",
   "Flax Seed",
   "Dried Plain Beet Pulp",
   "Kale",
   "Dried Yeast",
   "Natural Flavor",
   "Dehydrated Alfalfa Meal",
   "Dried Tomato Pomace",
   "Dicalcium Phosphate",
   "Potassium Chloride",
   "Calcium Carbonate",
   "Salt",
   "Dried Carrots",
   "Dried Apricots",
   "Dried Cherries",
   "Dl Methionine",
   "Choline Chloride",
   "Threonine",
   "Minerals (Zinc Proteinate, Iron Proteinate, Selenium Yeast, Copper Proteinate, Magnesium Proteinate, Manganese Proteinate, Ethylenediamine Dihydroiodide)",
   "Inulin",
   "Brewers Dried Yeast",
   "Taurine",
   "Turmeric",
   "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement)",
   "Hydrolyzed Yeast",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "Lactic Acid",
   "Tocopherols (A Preservative)",
   "Yucca Schidigera Extract",
   "Yeast Culture",
   "Dried Aspergillus Oryzae Fermentation Extract",
   "Dried Bacillus Subtilis Fermentation Product",
   "Dried Bacillus Licheniformis Fermentation Product",
   "Dried Trichoderma Longibrachiatum Fermentation Extract",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Bacillus Subtilis Fermentation Extract",
   "Citric Acid (A Preservative)",
   "L-carnitine",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #30 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Yeast Culture (mild) — ingredient #36 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Yeast Culture",
    "severity": "mild",
    "reason": "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Plain Beet Pulp",
   "Kale"
  ]
 },
 {
  "slug": "the-farmer-s-dog-pom-go",
  "brand": "The Farmer's Dog",
  "name": "Pom'&go",
  "score": 61,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Chicken Liver",
   "Broccoli",
   "Cauliflower",
   "Brussels Sprouts",
   "Chia Seeds",
   "Tricalcium Phosphate",
   "Salmon Oil",
   "Potassium Chloride",
   "Salt",
   "Choline Bitartrate",
   "Magnesium Amino Acid Chelate",
   "Taurine",
   "Zinc Amino Acid Chelate",
   "Iron Amino Acid Chelate",
   "Vitamin E Supplement",
   "Potassium Iodide",
   "Selenium Yeast",
   "Vitamin B12 Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Riboflavin Supplement (Vitamin B2)",
   "Thiamine Mononitrate (Vitamin B1)",
   "Vitamin D3 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Folic Acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Broccoli"
  ]
 },
 {
  "slug": "bozita-nordic-waters-salmon",
  "brand": "Bozita",
  "name": "Nordic Waters Salmon",
  "score": 58,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Salmon 7.5%",
   "Nuts",
   "Pork",
   "Minerals",
   "Yeast",
   "Natural ingredients"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "carnilove-rich-in-pheasant-enriched-with-raspberry-leaves",
  "brand": "Carnilove",
  "name": "Rich in Pheasant enriched with Raspberry leaves",
  "score": 58,
  "format": "Kibble",
  "ingredients": [
   "Chicken 71%",
   "Pheasant 14%",
   "Broth 12%",
   "Raspberry leaves 1%",
   "Linseed oil 1%",
   "Minerals 0.5%",
   "Vegetable starch 0.5%"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "carnilove-rich-in-turkey-enriched-with-valerian-root",
  "brand": "Carnilove",
  "name": "Rich in Turkey enriched with Valerian root",
  "score": 58,
  "format": "Kibble",
  "ingredients": [
   "Chicken 71%",
   "Turkey 14%",
   "Broth 12%",
   "Valerian root 1%",
   "Linseed oil 1%",
   "Minerals 0.5%",
   "Vegetable starch 0.5%"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "dr-marty-nature-s-blend",
  "brand": "Dr. Marty",
  "name": "Nature's Blend",
  "score": 58,
  "format": "Kibble",
  "ingredients": [
   "Turkey",
   "beef",
   "salmon and duck are the first four ingredients",
   "ZERO artificial preservatives",
   "additives",
   "fillers or synthetic ingredients"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "farmina-n-d-pumpkin-lamb-blueberry-adult-mini-dry-dog-food-2-5-kg",
  "brand": "Farmina",
  "name": "N&D Pumpkin Lamb & Blueberry Adult Mini - Dry Dog Food - 2.5 Kg",
  "score": 58,
  "format": "Kibble",
  "ingredients": [
   "Fresh Grass Fed Lamb (22%)",
   "Dehydrated Lamb Meat (20%)",
   "Pea Starch (20%)",
   "Chicken Fat",
   "Dehydrated Pumpkin (5%)",
   "Dehydrated Whole Eggs",
   "Fresh Herring",
   "Dehydrated Herring",
   "Herring Oil",
   "Fiber Vegetable Of Peas",
   "Dried Carrots",
   "Sun-cured Alfalfa Meal",
   "Inulin",
   "Fructooligosaccharides",
   "Yeast Extract",
   "Dehydrated Blueberry (0.5%)",
   "Dehydrated Apple",
   "Dehydrated Pomegranate",
   "Dehydrated Sweet Orange",
   "Dehydrated Spinach",
   "Psyllium (0.3%)",
   "Salt",
   "Brewer’s Dried Yeast",
   "Turmeric Root (0.2%)",
   "Glucosamine",
   "Chondroitin Sulphate",
   "Vitamin A Supplement",
   "Vitamin D3 Supplement",
   "Vitamin E Supplement",
   "Ascorbic Acid",
   "Niacin",
   "Calcium Pantothenate",
   "Riboflavin",
   "Pyridoxine Hydrochloride",
   "Thiamine Mononitrate",
   "Biotin",
   "Folic Acid",
   "Vitamin B12 Supplement",
   "Choline Chloride",
   "Beta-carotene",
   "Zinc Proteinate",
   "Manganese Proteinate",
   "Iron Proteinate",
   "Copper Proteinate",
   "Selenium Yeast",
   "Dl-methionine",
   "Taurine",
   "L-carnitine",
   "Aloe Vera Gel Concentrate",
   "Green Tea Extract",
   "Rosemary Extract",
   "Tocopherol‐rich Extracts Of Natural Origin."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #34 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -2
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "On TAPF trusted list",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (5)",
    "value": 10
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": [
   "Dehydrated Pumpkin (5%)",
   "Dried Carrots",
   "Dehydrated Blueberry (0.5%)",
   "Dehydrated Apple",
   "Dehydrated Spinach"
  ]
 },
 {
  "slug": "nature-s-logic-canine-beef-meal-feast",
  "brand": "Nature's Logic",
  "name": "Canine Beef Meal Feast",
  "score": 56,
  "format": "Kibble",
  "ingredients": [
   "Beef Meal",
   "Millet",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Yeast Culture",
   "Pumpkin Seed Flour",
   "Spray Dried Pork Liver",
   "Alfalfa Nutrient Concentrate",
   "Montmorillonite Clay",
   "Spray Dried Porcine Plasma",
   "Dried Kelp",
   "Menhaden Fish Meal",
   "Dried Tomato",
   "Almonds",
   "Dried Chicory Root",
   "Dried Apple",
   "Dried Carrot",
   "Dried Pumpkin",
   "Dried Apricot",
   "Dried Blueberry",
   "Dried Spinach",
   "Dried Broccoli",
   "Parsley",
   "Dried Cranberry",
   "Dried Artichoke",
   "Rosemary",
   "Dried Mushroom",
   "Dried Lactobacillus acidophilus Fermentation Product",
   "Dried Lactobacillus casei Fermentation Product",
   "Dried Bifidobacterium bifidum Fermentation Product",
   "Dried Enterococcus faecium Fermentation Product",
   "Dried Bacillus coagulans Fermentation Product",
   "Dried Aspergillus niger Fermentation Extract",
   "Dried Aspergillus oryzae Fermentation Extract",
   "Dried Trichoderma longibrachiatum Fermentation Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Yeast Culture (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (9)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Yeast Culture",
    "severity": "mild",
    "reason": "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten."
   }
  ],
  "organs": [
   "Spray Dried Pork Liver"
  ],
  "produce": [
   "Pumpkin Seed Flour",
   "Dried Apple",
   "Dried Carrot",
   "Dried Pumpkin",
   "Dried Blueberry",
   "Dried Spinach",
   "Dried Broccoli",
   "Parsley",
   "Dried Cranberry"
  ]
 },
 {
  "slug": "rawz-96-salmon-pate-dog-food-can-12-5oz",
  "brand": "Rawz",
  "name": "96% Salmon Pate Dog Food Can 12.5oz",
  "score": 56,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Fish Broth",
   "Fenugreek Seed",
   "Vegetable Broth. Caloric Content Me: 1",
   "133 Kcal/kg Or 400 Kcal/can"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "trisha-yearwood-samon-recipe",
  "brand": "Trisha Yearwood",
  "name": "Samon Recipe",
  "score": 55,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "chicken",
   "fish broth",
   "chicken liver",
   "carrots",
   "pumpkin",
   "natural flavor",
   "cranberries",
   "calcium carbonate",
   "agar agar",
   "tricalcium phosphate",
   "potassium chloride",
   "dicalcium phosphate",
   "dandelion greens",
   "salmon oil (preserved with mixed tocopherols)",
   "choline chloride",
   "vitamins (vitamin A supplement, vitamin D3 supplement, vitamin E supplement, niacin supplement, d-calcium pantothenate, riboflavin supplement, thiamine mononitrate, pyridoxine hydrochloride, vitamin B12 supplement, folic acid, biotin)",
   "magnesium proteinate",
   "taurine",
   "minerals (iron proteinate, zinc proteinate, copper proteinate, manganese proteinate, potassium iodide, sodium selenice)",
   "sale",
   "yucca schidigera extract",
   "kelp."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavor (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamins (vitamin A supplement, vitamin D3 supplement, vitamin E supplement, niacin supplement, d-calcium pantothenate, riboflavin supplement, thiamine mononitrate, pyridoxine hydrochloride, vitamin B12 supplement, folic acid, biotin) (mild) — ingredient #17 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (4)",
    "value": 8
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "vitamins (vitamin A supplement, vitamin D3 supplement, vitamin E supplement, niacin supplement, d-calcium pantothenate, riboflavin supplement, thiamine mononitrate, pyridoxine hydrochloride, vitamin B12 supplement, folic acid, biotin)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "chicken liver"
  ],
  "produce": [
   "carrots",
   "pumpkin",
   "cranberries",
   "dandelion greens"
  ]
 },
 {
  "slug": "pure-balance-beef-bison-recipe",
  "brand": "Pure Balance",
  "name": "Beef & Bison Recipe",
  "score": 54,
  "format": "Kibble",
  "ingredients": [
   "BEEF",
   "BEEF LIVER",
   "BEEF BROTH",
   "TAPIOCA STARCH",
   "BISON",
   "SPINACH",
   "CRANBERRIES",
   "BLUEBERRIES",
   "PEA FLOUR",
   "TRICALCIUM PHOSPHATE",
   "CELERY JUICE POWDER",
   "SALT",
   "FISH OIL",
   "POTASSIUM CHLORIDE",
   "CHOLINE CHLORIDE",
   "CALCIUM CARBONATE",
   "INULIN",
   "ROSEMARY EXTRACT (PRESERVATIVE)",
   "MIXED TOCOPHEROLS (PRESERVATIVE)",
   "POTASSIUM CITRATE",
   "MAGNESIUM PROTEINATE",
   "ZINC AMINO ACID CHELATE",
   "DICALCIUM PHOSPHATE",
   "IRON AMINO ACID CHELATE",
   "MANGANESE AMINO ACID CHELATE",
   "COPPER AMINO ACID CHELATE",
   "SODIUM SELENITE",
   "POTASSIUM IODIDE",
   "TAURINE",
   "VITAMIN E SUPPLEMENT",
   "VITAMIN A SUPPLEMENT",
   "NIACINAMIDE (VITAMIN B3)",
   "PANTOTHENIC ACID",
   "RIBOFLAVIN (VITAMIN B2)",
   "VITAMIN D3 SUPPLEMENT",
   "THIAMINE MONONITRATE (VITAMIN B1)",
   "VITAMIN B12 SUPPLEMENT",
   "PYRIDOXINE HYDROCHLORIDE",
   "FOLIC ACID"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "VITAMIN D3 SUPPLEMENT (mild) — ingredient #35 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "PYRIDOXINE HYDROCHLORIDE (mild) — ingredient #38 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (4)",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "SODIUM SELENITE",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "VITAMIN D3 SUPPLEMENT",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "PYRIDOXINE HYDROCHLORIDE",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "BEEF LIVER"
  ],
  "produce": [
   "SPINACH",
   "CRANBERRIES",
   "BLUEBERRIES",
   "CELERY JUICE POWDER"
  ]
 },
 {
  "slug": "vitapet-pocket-trainers-chicken",
  "brand": "vitapet",
  "name": "Pocket Trainers Chicken",
  "score": 54,
  "format": "Kibble",
  "ingredients": [
   "chicken meat",
   "vegetable glycerine",
   "blueberries",
   "sunflower oil",
   "pea protein",
   "sweet potatoes",
   "spinach",
   "carrots",
   "Natural antioxidants."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (4)",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "blueberries",
   "sweet potatoes",
   "spinach",
   "carrots"
  ]
 },
 {
  "slug": "applaws-chicken-breast-with-cheese",
  "brand": "Applaws",
  "name": "Chicken Breast with Cheese",
  "score": 53,
  "format": "Kibble",
  "ingredients": [
   "Chicken breast 70%",
   "Chicken broth",
   "Cheese 5%",
   "Rice",
   "Natural ingredients"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "applaws-chicken-breast-with-ham-in-broth",
  "brand": "Applaws",
  "name": "Chicken breast with ham in broth",
  "score": 53,
  "format": "Kibble",
  "ingredients": [
   "Chicken breast 70%",
   "Chicken broth",
   "Ham 5%",
   "Rice",
   "Natural ingredients"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "blink-chicken-fillets-in-jelly",
  "brand": "Blink",
  "name": "Chicken Fillets in Jelly",
  "score": 53,
  "format": "Kibble",
  "ingredients": [
   "Chicken fillets (65%)",
   "Chicken broth (34%)",
   "vitamins & minerals (1%)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "nutrisource-grain-free-seafood-select-wet-dog-food",
  "brand": "NutriSource",
  "name": "Grain Free Seafood Select Wet Dog Food",
  "score": 53,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Fish Broth",
   "Redfish",
   "Turkey",
   "Turkey Liver",
   "Vegetable Broth",
   "Chickpea Flour",
   "Tuna",
   "Sunflower Oil",
   "Liquid Lactobacillus Acidophilus Fermentation Product",
   "Coconut Glycerin",
   "Ground Flaxseed",
   "Natural Flavor",
   "Agar-agar",
   "Potassium Chloride",
   "Choline Chloride",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Selenium Yeast, Manganese Proteinate, Ethylenediamine Dihydroiodide)",
   "Taurine",
   "Hydrolyzed Yeast",
   "Vitamins (Vitamin E Supplement, Niacin, Thiamine Mononitrate, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Menadione Sodium Bisulfite Complex, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Biotin, Folic Acid)",
   "Dried Kelp",
   "Yucca Schidigera Extract",
   "Brewers Dried Yeast."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (1 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Niacin, Thiamine Mononitrate, D-calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Menadione Sodium Bisulfite Complex, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Biotin, Folic Acid)",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   }
  ],
  "organs": [
   "Turkey Liver"
  ],
  "produce": []
 },
 {
  "slug": "reveal-chicken-breast-in-broth",
  "brand": "Reveal",
  "name": "Chicken Breast in Broth",
  "score": 53,
  "format": "Kibble",
  "ingredients": [
   "Chicken Breast",
   "Chicken Broth. Crude Protein (min) 14%",
   "Crude Fat (min) 0.1%",
   "Crude Fiber (max) 2%",
   "Moisture (max) 91%."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "vitakraft-pure-chicken-bones",
  "brand": "Vitakraft",
  "name": "Pure Chicken Bones",
  "score": 53,
  "format": "Kibble",
  "ingredients": [
   "Chicken meat 65%",
   "Beef skin 30%",
   "Vegetable by-products",
   "Vegetable protein extracts",
   "Minerals"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "blue-buffalo-family-favorites-adult-wet-dog-food-sunday-chicken-dinner",
  "brand": "Blue",
  "name": "Buffalo Family Favorites Adult Wet Dog Food Sunday Chicken Dinner",
  "score": 52,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken",
   "Chicken Broth",
   "Water",
   "Chicken Liver",
   "Dried Egg",
   "Carrots",
   "Potatoes",
   "Green Beans",
   "Potato Starch",
   "Guar Gum",
   "Sodium Phosphate",
   "Salt",
   "Potassium Chloride",
   "Calcium Carbonate",
   "Natural Flavor",
   "Caramel Color",
   "Zinc Amino Acid Chelate",
   "Iron Amino Acid Chelate",
   "Choline Chloride",
   "Vitamin E Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Sodium Selenite",
   "Thiamine Mononitrate (Vitamin B1)",
   "Cobalt Amino Acid Chelate",
   "Niacin Supplement (Vitamin B3)",
   "Calcium Pantothenate (Vitamin B5)",
   "Vitamin A Supplement",
   "Riboflavin Supplement (Vitamin B2)",
   "Biotin (Vitamin B7)",
   "Vitamin B12 Supplement",
   "Potassium Lodide",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Vitamin D3 Supplement",
   "Folic Acid (Vitamin B9)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #15 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Caramel Color (moderate) — ingredient #16 (trace amount)",
    "value": -4,
    "severity": "moderate"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #33 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #34 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Caramel Color",
    "severity": "moderate",
    "reason": "Certain types of caramel color produced using ammonia processes may contain 4-methylimidazole (4-MEI), a compound that some research has associated with potential carcinogenic activity"
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Carrots"
  ]
 },
 {
  "slug": "dogsters-ice-cream-style-treats-for-dogs",
  "brand": "Dogsters",
  "name": "ice cream style treats for dogs",
  "score": 52,
  "format": "Kibble",
  "ingredients": [
   "Water",
   "cheese",
   "maltodextrin",
   "sweet whey power",
   "whey protein concentrate",
   "guar gum",
   "locust bean gum",
   "soy legithin",
   "dextrose",
   "calcium sulfate",
   "natural flavor"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "hill-s-science-diet-adult-perfect-digestion-salmon-dry-dog-food",
  "brand": "Hill's Science Diet",
  "name": "Adult Perfect Digestion Salmon Dry Dog Food",
  "score": 52,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Cracked Pearled Barley",
   "Whole Grain Oats",
   "Brown Rice",
   "Whole Grain Corn",
   "Corn Gluten Meal",
   "Chicken Meal",
   "Chicken Fat",
   "Chicken Liver Flavour",
   "Pork Liver Flavour",
   "Ground Pecan Shells",
   "Lactic Acid",
   "Potassium Chloride",
   "Flaxseed",
   "Dried Beet Pulp",
   "Dried Citrus Pulp",
   "Soybean Oil",
   "Calcium Carbonate",
   "Choline Chloride",
   "Iodized Salt",
   "Dicalcium Phosphate",
   "Pressed Cranberries",
   "Pumpkin",
   "Vitamins (Vitamin E Supplement",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
   "Taurine",
   "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
   "Mixed Tocopherols For Freshness",
   "Natural Flavours",
   "Beta-carotene."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Corn Gluten Meal (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Soybean Oil (mild) — ingredient #17 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [
   "Chicken Liver Flavour",
   "Pork Liver Flavour"
  ],
  "produce": [
   "Dried Beet Pulp"
  ]
 },
 {
  "slug": "wellness-core-purely-pat-chicken-with-turkey",
  "brand": "Wellness Core",
  "name": "Purely Paté Chicken with Turkey",
  "score": 52,
  "format": "Kibble",
  "ingredients": [
   "Chicken 50%",
   "Chicken Broth",
   "Turkey 4",
   "0%",
   "Minerals",
   "Vegetable Oil",
   "NUTRITIONAL ADDITIVES (per kg): Taurine 2000 mg",
   "Vitamin A 20200 IU",
   "Vitamin D3 596 IU",
   "Zinc (Zinc chelate of amino acids, hydrate) 120 mg",
   "Iron (Ferrous chelate of amino acids, hydrate) 45 mg",
   "Copper (Cupric chelate of amino acids, hydrate) 26 mg",
   "Manganese (Manganese chelate of amino acids, hydrate) 16 mg",
   "lodine (Potassium lodide) 0",
   "2 mg."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vegetable Oil (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Vegetable Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "hill-s-science-diet-perfect-digestion-adult-salmon-dry-dog-food",
  "brand": "Hill's Science Diet",
  "name": "Perfect Digestion Adult, Salmon Dry Dog Food",
  "score": 51,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Cracked Pearled Barley",
   "Whole Grain Oats",
   "Brown Rice",
   "Whole Grain Corn",
   "Corn Gluten Meal",
   "Chicken Meal",
   "Chicken Fat",
   "Chicken Liver Flavor",
   "Pork Liver Flavor",
   "Ground Pecan Shells",
   "Lactic Acid",
   "Potassium Chloride",
   "Flaxseed",
   "Dried Beet Pulp",
   "Dried Citrus Pulp",
   "Soybean Oil",
   "Calcium Carbonate",
   "Choline Chloride",
   "Iodized Salt",
   "Dicalcium Phosphate",
   "Pressed Cranberries",
   "Pumpkin",
   "Vitamins (Vitamin E Supplement",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
   "Taurine",
   "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
   "Mixed Tocopherols For Freshness",
   "Natural Flavors",
   "Beta-carotene."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Corn Gluten Meal (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Soybean Oil (mild) — ingredient #17 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #29 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [
   "Chicken Liver Flavor",
   "Pork Liver Flavor"
  ],
  "produce": [
   "Dried Beet Pulp"
  ]
 },
 {
  "slug": "merrick-backcountry-raw-infused-great-plains-red-recipe-dry-dog-food",
  "brand": "Merrick",
  "name": "Backcountry - Raw Infused - Great Plains Red Recipe - Dry Dog Food",
  "score": 51,
  "format": "Kibble with raw pieces",
  "ingredients": [
   "Deboned Beef",
   "Pork Meal",
   "Salmon Meal",
   "Sweet Potatoes",
   "Potatoes",
   "Peas",
   "Pea Protein",
   "Natural Flavor",
   "Pork Fat",
   "Potato Protein",
   "Lamb",
   "Sunflower Oil",
   "Beef Liver",
   "Flaxseed",
   "Tapioca",
   "Dried Yeast",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Minerals (Zinc Amino Acid Complex, Iron Amino Acid Complex, Sodium Selenite, Manganese Amino Acid Complex, Copper Amino Acid Complex, Calcium Iodate)",
   "Dl-methionine",
   "Taurine",
   "Mixed Tocopherols For Freshness",
   "Vitamins (Vitamin E Supplement, Vitamin B12 Supplement, Vitamin A Supplement, Niacin, Thiamine Mononitrate, Riboflavin Supplement, D-calcium Pantothenate, Folic Acid, Menadione Sodium Bisulfite Complex, Biotin, Pyridoxine Hydrochloride, Vitamin D3 Supplement). 2c37074"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Format bonus (Kibble with raw pieces)",
    "value": 5
   },
   {
    "label": "Natural Flavor (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Legumes further down the label (2) — DCM link",
    "value": -6
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Minerals (Zinc Amino Acid Complex, Iron Amino Acid Complex, Sodium Selenite, Manganese Amino Acid Complex, Copper Amino Acid Complex, Calcium Iodate)",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin B12 Supplement, Vitamin A Supplement, Niacin, Thiamine Mononitrate, Riboflavin Supplement, D-calcium Pantothenate, Folic Acid, Menadione Sodium Bisulfite Complex, Biotin, Pyridoxine Hydrochloride, Vitamin D3 Supplement). 2c37074",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   }
  ],
  "organs": [
   "Beef Liver"
  ],
  "produce": [
   "Sweet Potatoes"
  ]
 },
 {
  "slug": "wellness-core-purely-pat-chicken",
  "brand": "Wellness Core",
  "name": "Purely Paté Chicken",
  "score": 51,
  "format": "Kibble",
  "ingredients": [
   "Chicken 54%",
   "Chicken Broth",
   "Minerals",
   "Vegetable Oil. NUTRITIONAL ADDITIVES (per kg): Taurine 2000 mg",
   "Vitamin A 20200 IU",
   "Vitamin D3 596 IU",
   "Zinc (Zinc chelate of amino acids, hydrate) 120 mg",
   "Iron (Ferrous chelate of amino acids, hydrate) 45 mg",
   "Copper (Cupric chelate of amino acids, hydrate) 26 mg",
   "Manganese (Manganese chelate of amino acids, hydrate) 16 mg",
   "lodine (Potassium Iodide) 0",
   "2 mg."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vegetable Oil. NUTRITIONAL ADDITIVES (per kg): Taurine 2000 mg (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Vegetable Oil. NUTRITIONAL ADDITIVES (per kg): Taurine 2000 mg",
    "severity": "mild",
    "reason": "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "butcher-bar-duck-jerky",
  "brand": "Butcher Bar",
  "name": "Duck Jerky",
  "score": 48,
  "format": "Kibble",
  "ingredients": [
   "Duck",
   "Glycerin",
   "Soybean Meal",
   "Wheat Flour",
   "Sorbitol",
   "Citric Acid (Preservative)",
   "Potassium Sorbate (Preservative)",
   "Sodium Triphosphate",
   "Salt LOT CODE:QTP53198 BEST BY:01/04/2026 IA"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Soybean Meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Sorbitol (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Potassium Sorbate (Preservative) (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Soybean Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Sorbitol",
    "severity": "mild",
    "reason": "⚪ Mechanistic: sorbitol is a sugar alcohol used as a sweetener and humectant. Unlike xylitol — which is genuinely dangerous to dogs — sorbitol is not toxic, and conflating the two is a common error. The practical issue is that sugar alcohols are poorly absorbed and draw water into the gut, so meaningful amounts cause loose stools and gas. Present in small amounts in soft treats, it's a minor concern rather than a hazard."
   },
   {
    "name": "Potassium Sorbate (Preservative)",
    "severity": "mild",
    "reason": "The in vitro evidence is real and specific. Mamur et al. (Toxicology in Vitro, 2010) exposed human lymphocytes to potassium sorbate and found significant chromosomal aberrations at 500-1000 µg/ml, elevated sister-chromatid exchanges from 125 µg/ml, and DNA strand breaks at every concentration tested. ⚖️ But the in vivo picture does not follow it. EFSA's 2015 re-evaluation reviewed exactly these findings, concluded that live-animal studies did NOT confirm genotoxicity at realistic exposure, and maintained an acceptable daily intake of 3 mg/kg body weight. The concentrations used in those cell studies are in the 0.5-2 mM range, which dietary intake doesn't reach — potassium sorbate is metabolised much like a fatty acid. There is one more specific concern worth knowing: potassium sorbate reacting with ASCORBIC ACID in the presence of an IRON salt produces mutagenic decomposition products. Pet foods routinely contain all three. That interaction is a better reason for caution than the raw cell data. Our position: a preference against, not a demonstrated harm — and stronger where vitamin C and an iron source appear on the same label."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "earthborn-holistic-dog-food-unrefined-smoked-salmon",
  "brand": "Earthborn Holistic",
  "name": "Dog Food Unrefined Smoked Salmon",
  "score": 48,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Oats",
   "Salmon Meal",
   "Barley",
   "Pumpkin",
   "Butternut Squash",
   "Sunflower Oil (Preserved With Mixed Tocopherols)",
   "Quinoa",
   "Chia",
   "Dried Egg",
   "Flaxseed",
   "Dried Yeast",
   "Natural Flavors",
   "Apples",
   "Blueberries",
   "Carrots",
   "Cranberries",
   "Spinach",
   "L-threonine",
   "Dicalcium Phosphate",
   "Dried Chicory Root (A Source Of Inulin, A Prebiotic)",
   "Choline (Choline Chloride)",
   "Salt",
   "Potassium Chloride",
   "Taurine",
   "L-carnitine",
   "Vitamins [vitamin E (Α-tocopherol Acetate)",
   "Vitamin C (L-ascorbyl-2-polyphosphate)",
   "Vitamin B3 (Niacin)",
   "Vitamin B5 (Calcium Pantothenate)",
   "Vitamin B1 (Thiamine Mononitrate)",
   "Vitamin B2 (Riboflavin)",
   "Vitamin A (Vitamin A Acetate)",
   "Vitamin B12 Supplement",
   "Vitamin B6 (Pyridoxine Hydrochloride)",
   "Vitamin D3 (Cholecalciferol)",
   "Vitamin B7 (Biotin)",
   "Vitamin B9 (Folic Acid)]",
   "Minerals [zinc Sulfate",
   "Ferrous Sulfate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Zinc Proteinate",
   "Manganese Proteinate",
   "Copper Proteinate",
   "Calcium Iodate",
   "Sodium Selenite]",
   "Yucca Schidigera Extract",
   "Rosemary Extract",
   "Probiotics [dried Enterococcus Faecium Fermentation Product",
   "Dried Lactobacillus Casei Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product]."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavors (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin B6 (Pyridoxine Hydrochloride) (mild) — ingredient #35 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 (Cholecalciferol) (mild) — ingredient #36 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Whole food fruits & vegetables (7)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamin B6 (Pyridoxine Hydrochloride)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 (Cholecalciferol)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals [zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": [
   "Pumpkin",
   "Butternut Squash",
   "Apples",
   "Blueberries",
   "Carrots",
   "Cranberries",
   "Spinach"
  ]
 },
 {
  "slug": "nulo-frontrunner-turkey-whitefish-quinoa-small-breed-dry-dog-food",
  "brand": "Nulo",
  "name": "Frontrunner Turkey, Whitefish & Quinoa Small Breed Dry Dog Food",
  "score": 48,
  "format": "Kibble",
  "ingredients": [
   "Deboned Turkey",
   "Chicken Meal",
   "Oats",
   "Barley",
   "Brown Rice",
   "Turkey Meal",
   "Chicken Fat (Preserved With Mixed Tocopherols & Citric Acid)",
   "Ground Flaxseed",
   "Deboned Whitefish",
   "Quinoa",
   "Natural Flavor",
   "Ground Miscanthus Grass",
   "Brewers Dried Yeast",
   "Salt",
   "Dried Egg Product",
   "Dried Blueberries",
   "Dried Apples",
   "Dried Chicory Root",
   "Dl-methionine",
   "Salmon Oil",
   "Choline Chloride",
   "Potassium Chloride",
   "Taurine",
   "Calcium Carbonate",
   "Zinc Proteinate",
   "Vitamin E Supplement",
   "Zinc Sulfate",
   "Iron Proteinate",
   "Niacin Supplement",
   "Ferrous Sulfate",
   "Copper Proteinate",
   "Copper Sulfate",
   "Vitamin A Supplement",
   "Manganese Proteinate",
   "Thiamine Mononitrate",
   "Calcium Pantothenate",
   "Riboflavin Supplement",
   "Pyridoxine Hydrochloride",
   "Manganous Oxide",
   "Biotin",
   "Dried Bacillus Coagulans Fermentation Product",
   "Vitamin B12 Supplement",
   "Vitamin D3 Supplement",
   "Folic Acid",
   "Sodium Selenite",
   "Calcium Iodate",
   "Rosemary Extract. Crude Protein (Min) 27.00% Crude Fat (Min) 16.00% Crude Fiber (Max) 4.50% Moisture (Max) 10.00% Methionine (Min) 0.35% Docosahexaenoic Acid (Dha) (Min) 0.05% Calcium (Min) 1.20% Phosphorus (Min) 1.00% Potassium (Min) 0.60% Vitamin E (Min) 150 Iu/kg Taurine* (Min) 0.10% Omega-6 Fatty Acids* (Min) 3.10% Omega-3 Fatty Acids* (Min) 1.30% Ascorbic Acid (Vitamin C)* (Min) 65 Mg/kg Bacillus Coagulans* (Min) 80",
   "000",
   "000 Cfu/lb"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #38 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #43 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "diamond-nutragold",
  "brand": "Diamond",
  "name": "Nutragold",
  "score": 47,
  "format": "Kibble",
  "ingredients": [
   "chicken",
   "chicken meal",
   "barley",
   "egg derivatives",
   "ground rice",
   "powdered cellulose",
   "chicken fat (preserved with mixed tocopherols)",
   "salmon",
   "potatoes (2%)",
   "millet",
   "natural chicken flavor",
   "linseed",
   "sodium bisulphate",
   "ocean fish meal",
   "potassium chloride",
   "DL-methionine",
   "choline chloride",
   "dried chicory root",
   "taurine",
   "shell fish flour (a source of glucosamine)",
   "cartilage of poultry (a source of chondroitin sulphate)",
   "kelp",
   "carrots (0.1%)",
   "peas (0.1%)",
   "apples (0.1%)",
   "tomatoes",
   "blueberries",
   "spinach",
   "cranberry powder",
   "rosmary extract",
   "parsley flake",
   "yucca schidigera extract",
   "vitamins and minerals."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "powdered cellulose (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (1 added) — over-fortified formula",
    "value": -2
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (6)",
    "value": 10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "powdered cellulose",
    "severity": "mild",
    "reason": "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better."
   },
   {
    "name": "DL-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": [
   "carrots (0.1%)",
   "apples (0.1%)",
   "blueberries",
   "spinach",
   "cranberry powder",
   "parsley flake"
  ]
 },
 {
  "slug": "spot-tang-unkibble-beef-barley",
  "brand": "Spot & Tang",
  "name": "Unkibble Beef + Barley",
  "score": 47,
  "format": "Kibble",
  "ingredients": [
   "Beef",
   "Barley",
   "Flax",
   "Green Beans",
   "Beets",
   "Carrots",
   "Cranberries",
   "Rosemary",
   "Kelp"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (3)",
    "value": 6
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Beets",
   "Carrots",
   "Cranberries"
  ]
 },
 {
  "slug": "hill-s-science-plan-chicken-perfect-weight",
  "brand": "Hill's",
  "name": "Science Plan Chicken Perfect Weight",
  "score": 46,
  "format": "Kibble",
  "ingredients": [
   "Chicken and turkey meal",
   "brewers' rice",
   "maize gluten meal",
   "cellulose",
   "dried tomato pomace",
   "dried beet pulp",
   "flaxseed",
   "animal fat",
   "digest",
   "coconut oil",
   "minerals",
   "dried carrots."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "cellulose (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "animal fat (severe) — ingredient #8",
    "value": -12,
    "severity": "severe"
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "cellulose",
    "severity": "mild",
    "reason": "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better."
   },
   {
    "name": "animal fat",
    "severity": "severe",
    "reason": "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it."
   }
  ],
  "organs": [],
  "produce": [
   "dried beet pulp",
   "dried carrots."
  ]
 },
 {
  "slug": "nulo-medalseries-grain-free-salmon-sweet-potato-adult-dry-dog-food-4-5",
  "brand": "Nulo",
  "name": "MedalSeries Grain-Free Salmon & Sweet Potato Adult Dry Dog Food, 4.5 lbs.",
  "score": 46,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Sweet Potato",
   "Peas",
   "Tapioca",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Salmon Oil",
   "Flaxseed",
   "Dried Kelp",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Thiamine Mononitrate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Sodium Selenite",
   "Calcium Iodate",
   "Vitamin A Supplement",
   "Vitamin D3 Supplement",
   "Vitamin E Supplement",
   "Biotin"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (3) — turmeric, fish oil, kelp, etc.",
    "value": 9
   }
  ],
  "flagged": [
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potato"
  ]
 },
 {
  "slug": "petcare-mini-bits-with-duck",
  "brand": "Petcare",
  "name": "Mini bits with duck",
  "score": 46,
  "format": "Kibble",
  "ingredients": [
   "Duck breast meat",
   "Vegetable Glycerin",
   "So-bitol",
   "Starch",
   "Soy Protein",
   "Salt",
   "VC",
   "Potassium Sorbate"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Soy Protein (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Potassium Sorbate (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Salt is ingredient #6 — little real food below it",
    "value": -4
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Soy Protein",
    "severity": "mild",
    "reason": "⚪ Formulation signal: isolated plant protein used to inflate the crude protein figure without meat. Lower in the amino acids dogs need most, and a common allergen. Matters most in the top five ingredients."
   },
   {
    "name": "Potassium Sorbate",
    "severity": "mild",
    "reason": "The in vitro evidence is real and specific. Mamur et al. (Toxicology in Vitro, 2010) exposed human lymphocytes to potassium sorbate and found significant chromosomal aberrations at 500-1000 µg/ml, elevated sister-chromatid exchanges from 125 µg/ml, and DNA strand breaks at every concentration tested. ⚖️ But the in vivo picture does not follow it. EFSA's 2015 re-evaluation reviewed exactly these findings, concluded that live-animal studies did NOT confirm genotoxicity at realistic exposure, and maintained an acceptable daily intake of 3 mg/kg body weight. The concentrations used in those cell studies are in the 0.5-2 mM range, which dietary intake doesn't reach — potassium sorbate is metabolised much like a fatty acid. There is one more specific concern worth knowing: potassium sorbate reacting with ASCORBIC ACID in the presence of an IRON salt produces mutagenic decomposition products. Pet foods routinely contain all three. That interaction is a better reason for caution than the raw cell data. Our position: a preference against, not a demonstrated harm — and stronger where vitamin C and an iron source appear on the same label."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "purina-frosty-paws-vanilla",
  "brand": "Purina",
  "name": "Frosty Paws Vanilla",
  "score": 46,
  "format": "Kibble",
  "ingredients": [
   "water",
   "whey",
   "soy flour",
   "coconut oil",
   "maltodextrin",
   "polydextrose",
   "monoglycerides",
   "minerals (dicalcium phosphate, dipotassium phosphate, ferrous fumarate)",
   "guar gum",
   "vitamins (vitamin C (ascorbic acid)",
   "vitamin B6 (pyridoxine hydrochloride)",
   "vitamin B1 (thiamine hydrochloride)",
   "vitamin B12 (riboflavin))",
   "natural flavor"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "vitamin B6 (pyridoxine hydrochloride) (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "natural flavor (mild) — ingredient #14 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "vitamin B6 (pyridoxine hydrochloride)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "applaws-poulet-pour-chat",
  "brand": "Applaws",
  "name": "poulet pour chat",
  "score": 45,
  "format": "Kibble",
  "ingredients": [
   "Chicken 49.5% (Chicken Meal 46%, Freshly Prepared Chicken* 3.5%)",
   "Potato*",
   "Poultry Fat 8%",
   "Beet Pulp*",
   "Dried Brewer’s Yeast*",
   "Vitamins & Minerals",
   "Poultry Gravy 1.5%",
   "Salmon Oil",
   "Egg Powder*",
   "Chicory Extract* 0.2% (a source of prebiotic FOS)",
   "Seaweed*",
   "Yucca Schidigera Extract*",
   "Cranberry Powder. *Natural Ingredients.\r\nVitamins: Vitamin A 29000IU",
   "Vitamin D3 1000IU",
   "Vitamin E 640mg",
   "Taurine 1000mg.\r\n\r\nAmino Acids: DL Methionine 250mg.\r\n\r\nTrace Elements: Iodine (Calcium Iodate, anhydrous) 1mg",
   "Iron (Iron (II) Sulphate Monohydrate) 50mg",
   "Zinc (Zinc Sulphate Monohydrate) 100mg",
   "Manganese (Manganese (II) Oxide) 50mg",
   "Copper (Copper (II) Sulphate Pentahydrate) 5mg.\r\nAntioxidants: Tocopherol Extracts. Anti-Caking Agents: Sepiolite 300mg.\r\n\r\nSensory Additives: Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Beet Pulp*",
   "Cranberry Powder. *Natural Ingredients.\r\nVitamins: Vitamin A 29000IU"
  ]
 },
 {
  "slug": "blue-wilderness-tasty-chicken-flavor",
  "brand": "Blue wilderness",
  "name": "Tasty Chicken Flavor",
  "score": 45,
  "format": "Kibble",
  "ingredients": [
   "Deboned chicken",
   "Chicken meal",
   "Potato starch",
   "peas",
   "brewers dried yeast",
   "chicken fat",
   "Natural flavor",
   "citric acid",
   "potassium chloride",
   "preserved with Mixed tocopherols",
   "Oil of rosemary",
   "crude protein 28%(min.)",
   "Crude fat 12% (min.)",
   "bCrude fiber 4% (max.)",
   "Moisture 10% (max.)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural flavor (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "dagsmark-lappi",
  "brand": "Dagsmark",
  "name": "Lappi",
  "score": 45,
  "format": "Kibble",
  "ingredients": [
   "chicken meal",
   "potato",
   "linseed",
   "beet pulp",
   "potato flake",
   "canola oil",
   "vegetable fiber"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "canola oil (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "canola oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   }
  ],
  "organs": [],
  "produce": [
   "beet pulp"
  ]
 },
 {
  "slug": "blue-buffalo-duck-recipe",
  "brand": "Blue Buffalo",
  "name": "Duck Recipe",
  "score": 44,
  "format": "Kibble",
  "ingredients": [
   "Duck",
   "Chicken",
   "Chicken Liver",
   "Turkey Broth",
   "Potatoes",
   "Flaxseed",
   "Natural Flavor",
   "Guar Gum",
   "S Doline Chloride",
   "Carrageenan",
   "Cassia Gum",
   "Salt",
   "Iron Amino Acid Chelate",
   "Zinc Amino Acid Chelate",
   "Vitamin E Sa Mononitrate (Vitamin B1)",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Sodium Selenite",
   "V Wamin B12 Supplement",
   "Riboflavin Supplement (Vitamin B2)",
   "Pyridoxine Hydrochloride (Vitamin B6",
   "B Wamin D3 Supplement."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Carrageenan (moderate) — ingredient #10",
    "value": -7,
    "severity": "moderate"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6 (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Carrageenan",
    "severity": "moderate",
    "reason": "Some research has associated degraded carrageenan with intestinal inflammation. While food-grade carrageenan is considered different, some veterinary nutritionists recommend avoiding it, particularly for pets with sensitive digestive systems"
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": []
 },
 {
  "slug": "hill-s-science-diet-large-breed-puppy",
  "brand": "Hill's Science Diet",
  "name": "Large breed puppy",
  "score": 44,
  "format": "Kibble",
  "ingredients": [
   "chicken meal",
   "whole grain wheat",
   "whole grain oats",
   "whole grain sorghum",
   "corn gluten meal",
   "chicken fat",
   "whole grain corn",
   "chicken liver flavor",
   "flaxseed",
   "dried beet pulp",
   "pork liver flavor",
   "fish oil",
   "lactic acid",
   "iodized salt",
   "dicalcium phosphate",
   "potassium chloride",
   "vitamins (vitamin e supplement",
   "l-ascorbyl-2-polyphospate (source of vitamin x), niacin supplement, thiamine mononitrate, vitamin a supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin b12 supplement, pyridoxine hydrochloride, folic acid, vitamin d3 supplement)",
   "choline chloride",
   "minerals (ferrous sulfate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, sodium selenite)",
   "taurine",
   "oat fiber",
   "l-carnitine",
   "mixed tocopherols for freshness",
   "natural flavors",
   "beta-carotene",
   "apples",
   "broccoli",
   "carrots",
   "cranberries",
   "green peas"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "corn gluten meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "l-ascorbyl-2-polyphospate (source of vitamin x), niacin supplement, thiamine mononitrate, vitamin a supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin b12 supplement, pyridoxine hydrochloride, folic acid, vitamin d3 supplement) (mild) — ingredient #18 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "natural flavors (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "corn gluten meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "l-ascorbyl-2-polyphospate (source of vitamin x), niacin supplement, thiamine mononitrate, vitamin a supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin b12 supplement, pyridoxine hydrochloride, folic acid, vitamin d3 supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "minerals (ferrous sulfate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, sodium selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "natural flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [
   "chicken liver flavor",
   "pork liver flavor"
  ],
  "produce": [
   "dried beet pulp"
  ]
 },
 {
  "slug": "weruva-dog-bed-and-breakfast-chicken-egg-14oz",
  "brand": "Weruva",
  "name": "Dog Bed And Breakfast Chicken/Egg, 14oz",
  "score": 44,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken (Boneless, Skinless Breast)",
   "Chicken Broth",
   "Egg",
   "Pumpkin",
   "Sweet Potato",
   "Ham",
   "Potato Starch",
   "Sunflower Seed Oil",
   "Xanthan Gum",
   "Tricalcium Phosphate",
   "Choline Chloride",
   "Zinc Sulfate",
   "Vitamin E Supplement",
   "Ferrous Sulfate",
   "Thiamine Mononitrate (Vitamin B1)",
   "Nicotinic Acid (Vitamin B3)",
   "Calcium Pantothenate",
   "Vitamin A Supplement",
   "Potassium Iodide",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Riboflavin Supplement (Vitamin B2)",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Vitamin D3 Supplement",
   "Folic Acid",
   "Vitamin B12 Supplement"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #23 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "🔴 Poor omega ratio (high omega-6, no omega-3)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   }
  ],
  "flagged": [
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": [
   "Pumpkin",
   "Sweet Potato"
  ]
 },
 {
  "slug": "rachael-ray-nutrish-real-salmon-vegetable-and-brown-rice-recipe-dry-do",
  "brand": "Rachael Ray Nutrish",
  "name": "Real Salmon, Vegetable And Brown Rice Recipe Dry Dog Food - 4.5lbs",
  "score": 43,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Chicken Meal",
   "Ground Whole Corn",
   "Dried Peas",
   "Grain Sorghum",
   "Soybean Meal",
   "Corn Protein Meal",
   "Chicken Fat (Preserved With Mixed Tocopherols)",
   "Brown Rice",
   "Dried Plain Beet Pulp",
   "Flaxseed",
   "Whole Millet",
   "Dried Carrots",
   "Dicalcium Phosphate",
   "Natural Flavor",
   "Malted Barley Flour",
   "Salt",
   "Calcium Carbonate",
   "Taurine",
   "Choline Chloride",
   "Vitamins (Vitamin E Supplement",
   "L-ascorby 1-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Biotin, Vitamin D3 Supplement)",
   "Minerals (Ferrous Sulfate, Zinc Sulfate, Copper Sulfate, Sodium Selenite, Manganese Sulfate, Calcium Iodate)",
   "Zinc Sulfate",
   "Citric Acid (Preservative)",
   "Rosemary Extract. Ls001."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Soybean Meal (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #15 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "L-ascorby 1-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Biotin, Vitamin D3 Supplement) (mild) — ingredient #22 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Soybean Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "L-ascorby 1-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Riboflavin Supplement, Pyridoxine Hydrochloride, Vitamin B12 Supplement, Folic Acid, Biotin, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Sulfate, Copper Sulfate, Sodium Selenite, Manganese Sulfate, Calcium Iodate)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Plain Beet Pulp",
   "Dried Carrots"
  ]
 },
 {
  "slug": "blue-buffalo-wilderness-natural-high-protein-dry-food-for-adult-dogs-s",
  "brand": "Blue Buffalo",
  "name": "Wilderness Natural High-Protein Dry Food For Adult Dogs, Salmon Recipe, 4.5-lb Bag",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Deboned Salmon",
   "Salmon Meal (Source Of Omega 3 Fatty Acids)",
   "Chicken Meal (Source Of Glucosamine)",
   "Oatmeal",
   "Barley",
   "Brown Rice",
   "Dried Tomato Pomace",
   "Fish Meal",
   "Chicken Fat (Preserved With Mixed Tocopherols)",
   "Natural Flavor",
   "Dried Yeast",
   "Flaxseed (Source Of Omega 6 Fatty Acids)",
   "Direct Dehydrated Alfalfa Pellets",
   "Calcium Carbonate",
   "Potassium Chloride",
   "Dried Chicory Root",
   "Salt",
   "Alfalfa Nutrient Concentrate",
   "L-threonine",
   "Dl-methionine",
   "Choline Chloride",
   "Vitamin E Supplement",
   "Preserved With Mixed Tocopherols",
   "Dried Sweet Potatoes",
   "Carrots",
   "Zinc Amino Acid Chelate",
   "Zinc Sulfate",
   "Vegetable Juice For Color",
   "Ferrous Sulfate",
   "Iron Amino Acid Chelate",
   "Blueberries",
   "Cranberries",
   "Barley Grass",
   "Parsley",
   "Turmeric",
   "Dried Kelp",
   "Yucca Schidigera Extract",
   "Niacin (Vitamin B3)",
   "Calcium Pantothenate (Vitamin B5)",
   "Copper Sulfate",
   "Biotin (Vitamin B7)",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "L-lysine",
   "L-carnitine",
   "Vitamin A Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Sulfate",
   "Manganese Amino Acid Chelate",
   "Taurine",
   "Thiamine Mononitrate (Vitamin B1)",
   "Riboflavin (Vitamin B2)",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Calcium Iodate",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Aspergillus Niger Fermentation Extract",
   "Dried Trichoderma Longibrachiatum Fermentation Extract",
   "Dried Bacillus Subtilis Fermentation Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #52 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #54 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "fish4dogs-salmon-morsels",
  "brand": "fish4dogs",
  "name": "salmon morsels",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Salmon Meal (32%)",
   "Potato",
   "Sweet Potato",
   "Pea Starch",
   "Salmon Oil (9%)",
   "Salmon (4%)",
   "White Fish",
   "Mackerel",
   "Salmon Digest",
   "Brewers Yeast",
   "Plant Fibre",
   "Glucosamine Sulphate (0.05%)",
   "Chondroitin Sulphate (0.03%)."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Sweet Potato"
  ]
 },
 {
  "slug": "fish4dogs-white-fish-morsels",
  "brand": "fish4dogs",
  "name": "white fish morsels",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Salmon Meal (32%)",
   "Potato",
   "Sweet Potato",
   "Pea Starch",
   "Salmon Oil (9%)",
   "White Fish (4%). Salmon",
   "Mackerel",
   "Salmon Digest",
   "Brewers Yeast",
   "Prebiotic-MOS (0.18%)",
   "Prebiotic-FOS (0.18%)",
   "Shrimp Extract",
   "Fish Cartilage. Analytical Constituents: Crude Protein 30%",
   "Crude Fibre 1.5%",
   "Fat Content 16%",
   "Crude Ash 9.5%",
   "Omega 3 Fats 1.8%. Z Tilleggsfår til bund"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": [
   "Sweet Potato"
  ]
 },
 {
  "slug": "fromm-family-pet-food-adult-gold",
  "brand": "Fromm Family Pet Food",
  "name": "Adult Gold",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Chicken Meal",
   "Chicken Broth",
   "Oat Groats",
   "Pearled Barley",
   "Brown Rice",
   "Chicken Fat (preserved with mixed tocopherols)",
   "Menhaden Fish Meal",
   "Dried Tomato Pomace",
   "Dried Egg Product",
   "Whole Oats",
   "White Rice",
   "Chicken Liver",
   "Whole Barley",
   "Potatoes",
   "Cheese",
   "Flaxseed",
   "Salmon Oil (preserved with mixed tocopherols)",
   "Brewers Dried Yeast",
   "Duck",
   "Lamb",
   "Carrots",
   "Sweet Potatoes",
   "Celery",
   "Alfalfa Meal",
   "Salt",
   "Monocalcium Phosphate",
   "Potassium Chloride",
   "Chicory Root Extract",
   "Vitamins [vitamin A Acetate",
   "Vitamin D3 supplement",
   "Vitamin E supplement",
   "Vitamin B12 Supplement",
   "choline bitartrate",
   "Niacin Supplement",
   "d-Calcium Pantothenate",
   "L-ascorbyl-2-polyphosphate",
   "Riboflavin Supplement",
   "Thiamine Mononitrate",
   "Pyridoxine Hydrochloride",
   "Folic Acid",
   "Biotin]",
   "Minerals [zinc Sulfate",
   "ferrous Sulfate",
   "Manganese Sulfate",
   "magnesium Sulfate",
   "Copper Sulfate",
   "cobalt Carbonate",
   "calcium iodate",
   "iron proteinate",
   "zinc proteinate",
   "Copper proteinate",
   "Manganese proteinate",
   "magnesium proteinate",
   "cobalt proteinate]",
   "Yucca Schidigera Extract",
   "Sorbic Acid (Preservative)",
   "L-Tryptophan",
   "Taurine",
   "DL-Methionine"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 supplement (mild) — ingredient #31 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #40 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -10
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (3)",
    "value": 6
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Minerals [zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Carrots",
   "Sweet Potatoes",
   "Celery"
  ]
 },
 {
  "slug": "hill-s-adult-1-6-small-bites-dog-food",
  "brand": "Hill's",
  "name": "Adult 1-6 Small Bites Dog Food",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Lamb meal",
   "brown rice",
   "brewers rice",
   "whole grain sorghum",
   "whole grain wheat",
   "corn gluten meal",
   "chicken fat",
   "cracked pearl barley",
   "chicken liver flavor",
   "dried beet pulp",
   "soybean oil",
   "flaxseed",
   "lactic acid",
   "potassium chloride",
   "pork liver flavor",
   "ionized salt",
   "L-lysine",
   "choline chloride",
   "vitamins (vitamin E supplement",
   "l-ascorbyl-2-polyphosphate (source of vitamin C), niacin supplement, thiamine mononitrate, vitamin A supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin B12 supplement, pyridoxine hydrochloride, folic acid, vitamin D3 supplement)",
   "calcium carbonate",
   "taurine minerals (ferrous sulphate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, sodium selenite)",
   "mixed tocopherols for freshness",
   "natural flavours",
   "beta-carotene."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "corn gluten meal (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "soybean oil (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "l-ascorbyl-2-polyphosphate (source of vitamin C), niacin supplement, thiamine mononitrate, vitamin A supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin B12 supplement, pyridoxine hydrochloride, folic acid, vitamin D3 supplement) (mild) — ingredient #20 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "corn gluten meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "soybean oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "l-ascorbyl-2-polyphosphate (source of vitamin C), niacin supplement, thiamine mononitrate, vitamin A supplement, calcium pantothenate, riboflavin supplement, biotin, vitamin B12 supplement, pyridoxine hydrochloride, folic acid, vitamin D3 supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "taurine minerals (ferrous sulphate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, sodium selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [
   "chicken liver flavor",
   "pork liver flavor"
  ],
  "produce": [
   "dried beet pulp"
  ]
 },
 {
  "slug": "pure-balance-small-breed-pure-balance",
  "brand": "Pure Balance Small Breed",
  "name": "Pure Balance",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "chicken",
   "chicken meal",
   "dried ground peas",
   "tapioca",
   "whole ground potato",
   "turkey meal",
   "poultry fat (preserved with mixed tocopherols)",
   "flaxseed",
   "pea protein",
   "natural flavor",
   "dried ground carrots",
   "dried egg product",
   "sunflower oil",
   "dicalcium phosphate",
   "salt",
   "menhafen fish oil",
   "zinc proteinate",
   "Choline chloride",
   "taurine"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [],
  "produce": [
   "dried ground carrots"
  ]
 },
 {
  "slug": "trovet-unique-protein-treat-duck",
  "brand": "trovet",
  "name": "unique protein treat (duck)",
  "score": 42,
  "format": "Kibble",
  "ingredients": [
   "Duck",
   "sorbitol",
   "glycerol",
   "rice starch",
   "sodium chloride",
   "potassium sorbate. Contains no artificial flavours",
   "colourants or odourants."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "sorbitol (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "potassium sorbate. Contains no artificial flavours (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Salt is ingredient #5 — little real food below it",
    "value": -8
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "sorbitol",
    "severity": "mild",
    "reason": "⚪ Mechanistic: sorbitol is a sugar alcohol used as a sweetener and humectant. Unlike xylitol — which is genuinely dangerous to dogs — sorbitol is not toxic, and conflating the two is a common error. The practical issue is that sugar alcohols are poorly absorbed and draw water into the gut, so meaningful amounts cause loose stools and gas. Present in small amounts in soft treats, it's a minor concern rather than a hazard."
   },
   {
    "name": "potassium sorbate. Contains no artificial flavours",
    "severity": "mild",
    "reason": "The in vitro evidence is real and specific. Mamur et al. (Toxicology in Vitro, 2010) exposed human lymphocytes to potassium sorbate and found significant chromosomal aberrations at 500-1000 µg/ml, elevated sister-chromatid exchanges from 125 µg/ml, and DNA strand breaks at every concentration tested. ⚖️ But the in vivo picture does not follow it. EFSA's 2015 re-evaluation reviewed exactly these findings, concluded that live-animal studies did NOT confirm genotoxicity at realistic exposure, and maintained an acceptable daily intake of 3 mg/kg body weight. The concentrations used in those cell studies are in the 0.5-2 mM range, which dietary intake doesn't reach — potassium sorbate is metabolised much like a fatty acid. There is one more specific concern worth knowing: potassium sorbate reacting with ASCORBIC ACID in the presence of an IRON salt produces mutagenic decomposition products. Pet foods routinely contain all three. That interaction is a better reason for caution than the raw cell data. Our position: a preference against, not a demonstrated harm — and stronger where vitamin C and an iron source appear on the same label."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "hill-s-science-diet-adult-7-senior-vitality-chicken-rice-recipe-dry-do",
  "brand": "Hill's Science Diet",
  "name": "Adult 7+ Senior Vitality Chicken & Rice Recipe - Dry Dog Food",
  "score": 41,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Brewers Rice",
   "Yellow Peas",
   "Cracked Pearled Barley",
   "Whole Grain Oats",
   "Whole Grain Corn",
   "Egg Product",
   "Chicken Fat",
   "Corn Gluten Meal",
   "Chicken Liver Flavor",
   "Pork Liver Flavor",
   "Soybean Oil",
   "Flaxseed",
   "Lactic Acid",
   "L-lysine",
   "Potassium Chloride",
   "Calcium Carbonate",
   "Dicalcium Phosphate",
   "Carrots",
   "Dried Tomato Pomace",
   "Dried Citrus Pulp",
   "Spinach",
   "Fish Oil",
   "Iodized Salt",
   "Vitamins (Vitamin E Supplement",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
   "Lipoic Acid",
   "Choline Chloride",
   "Taurine",
   "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
   "Natural Flavors",
   "Mixed Tocopherols For Freshness",
   "L-tryptophan",
   "L-carnitine",
   "Beta-carotene."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Corn Gluten Meal (mild) — ingredient #9",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Soybean Oil (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #26 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #31 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "L-ascorbyl-2-polyphosphate (Source Of Vitamin C), Niacin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Calcium Pantothenate, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Oxide, Copper Sulfate, Manganous Oxide, Calcium Iodate, Sodium Selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [
   "Chicken Liver Flavor",
   "Pork Liver Flavor"
  ],
  "produce": [
   "Carrots",
   "Spinach"
  ]
 },
 {
  "slug": "nutrisource-pure-vita-grain-free-salmon-formula-dry-dog-food",
  "brand": "NutriSource",
  "name": "Pure Vita Grain Free Salmon Formula Dry Dog Food",
  "score": 41,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Peas",
   "Sweet Potatoes",
   "Pea Flour",
   "Sunflower Oil",
   "Pea Starch",
   "Dried Plain Beet Pulp",
   "Flax Seed",
   "Dehydrated Alfalfa Meal",
   "Dried Tomato Pomace",
   "Potassium Chloride",
   "Salt",
   "Choline Chloride",
   "Threonine",
   "Dried Cranberries",
   "Minerals (Zinc Proteinate, Iron Proteinate, Selenium Yeast, Copper Proteinate, Magnesium Oxide, Manganese Proteinate, Ethylenediamine Dihydroiodide)",
   "Brewers Dried Yeast",
   "Dl Methionine",
   "Dried Blueberries",
   "Taurine",
   "Calcium Carbonate",
   "Turmeric",
   "Inulin",
   "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement)",
   "Lactic Acid",
   "Preserved With Tocopherols",
   "Garlic Powder",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "Yucca Schidigera Extract",
   "Yeast Culture",
   "Dried Aspergillus Oryzae Fermentation Extract",
   "Dried Bacillus Subtilis Fermentation Product",
   "Dried Bacillus Licheniformis Fermentation Product",
   "Dried Trichoderma Longibrachiatum Fermentation Extract",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Bacillus Subtilis Fermentation Extract",
   "L-carnitine",
   "Preserved With Citric Acid",
   "L-tryptophan",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Garlic Powder (moderate) — ingredient #28 (trace amount)",
    "value": -2,
    "severity": "moderate"
   },
   {
    "label": "Yeast Culture (mild) — ingredient #31 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Minerals (Zinc Proteinate, Iron Proteinate, Selenium Yeast, Copper Proteinate, Magnesium Oxide, Manganese Proteinate, Ethylenediamine Dihydroiodide)",
    "severity": "moderate",
    "reason": "❌ Oxide is the worst grade of mineral form — barely absorbed, cheapest to buy. Look for magnesium proteinate; magnesium sulfate is the acceptable middle."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Niacin Supplement, Vitamin A Supplement, Thiamine Mononitrate, D-calcium Pantothenate, Pyridoxine Hydrochloride, Riboflavin Supplement, Biotin, Vitamin B12 Supplement, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Garlic Powder",
    "severity": "moderate",
    "reason": "Garlic's toxic reputation traces to Lee et al. (2000), which fed dogs 5 g/kg body weight daily for a week — roughly 20 cloves a day for a 20kg dog. That produced Heinz bodies and reduced hematocrit, but no dog developed clinical hemolytic anemia. Typical holistic dosing (about a quarter clove per 10 lb) is roughly 20x lower than that study. A 2025 in-vitro study (Beleć, Barć & Lasek, Animals) found no safe threshold has been established, so caution is still warranted — but garlic is not in the same category as onion, which carries stronger evidence of harm. In commercial food it is usually a trace flavoring listed below salt."
   },
   {
    "name": "Yeast Culture",
    "severity": "mild",
    "reason": "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potatoes",
   "Dried Plain Beet Pulp"
  ]
 },
 {
  "slug": "sm-lke-adult-mini-complete-all-in-one",
  "brand": "SMøLKe",
  "name": "Adult Mini Complete All-in-One",
  "score": 41,
  "format": "Kibble",
  "ingredients": [
   "chicken meal 19%",
   "corn",
   "barley",
   "rice",
   "sorghum",
   "chicken fat",
   "lamb meal 4%",
   "beet pulp",
   "hydrolysed protein",
   "MSC fish meal 2%",
   "blend of vitamins and minerals",
   "yeast",
   "cellulose 1%",
   "MSC fish oil 0.8%",
   "chicory 0.7%",
   "sodium hexametaphosphate 0.1%"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "cellulose 1% (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "cellulose 1%",
    "severity": "mild",
    "reason": "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better."
   }
  ],
  "organs": [],
  "produce": [
   "beet pulp"
  ]
 },
 {
  "slug": "zignature-limited-ingredient-salmon-formula-dry-dog-food",
  "brand": "Zignature",
  "name": "Limited Ingredient Salmon Formula Dry Dog Food",
  "score": 41,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Pea Flour",
   "Chickpeas",
   "Peas",
   "Sunflower Oil (Preserved With Mixed Tocopherols And Citric Acid)",
   "Flaxseed",
   "Natural Flavors",
   "Suncured Alfalfa Meal",
   "Calcium Carbonate",
   "Salt",
   "Choline Chloride",
   "Zinc Proteinate",
   "Iron Proteinate",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Cobalt Proteinate",
   "Potassium Chloride",
   "Taurine",
   "Vitamin A Acetate",
   "Vitamin D3 Supplement",
   "Vitamin E Supplement",
   "Niacin",
   "D-calcium Pantothenate",
   "Thiamine Mononitrate",
   "Pyridoxine Hydrochloride",
   "Riboflavin Supplement",
   "Folic Acid",
   "Biotin",
   "Vitamin B12 Supplement",
   "Lactic Acid",
   "Calcium Iodate",
   "Sodium Selenite"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavors (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #26 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 5 ingredients (2) — DCM link",
    "value": -14
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "blue-buffalo-life-protection-formula-natural-puppy-dry-dog-food-chicke",
  "brand": "Blue Buffalo",
  "name": "Life Protection Formula Natural Puppy Dry Dog Food - Chicken And Brown Rice, 5 Lb",
  "score": 40,
  "format": "Kibble",
  "ingredients": [
   "Deboned Chicken",
   "Chicken Meal",
   "Brown Rice",
   "Oatmeal",
   "Barley",
   "Fish Meal (Source Of Omega 3 Fatty Acids)",
   "Peas",
   "Chicken Fat (Preserved With Mixed Tocopherols)",
   "Natural Flavor",
   "Flaxseed (Source Of Omega 6 Fatty Acids)",
   "Dried Tomato Pomace",
   "Dried Egg Product",
   "Pea Protein",
   "Fish Oil (Source Of Ara-arachidonic Acid And Dha-docosahexaenoic Acid)",
   "Salt",
   "Potassium Chloride",
   "Choline Chloride",
   "Direct Dehydrated Alfalfa Pellets",
   "Dicalcium Phosphate",
   "Dried Chicory Root",
   "Potatoes",
   "Pea Fiber",
   "Alfalfa Nutrient Concentrate",
   "Calcium Carbonate",
   "Dl-methionine",
   "Preserved With Mixed Tocopherols",
   "Vitamin E Supplement",
   "Sweet Potatoes",
   "Carrots",
   "Garlic",
   "Zinc Amino Acid Chelate",
   "Zinc Sulfate",
   "Vegetable Juice For Color",
   "Ferrous Sulfate",
   "Iron Amino Acid Chelate",
   "Blueberries",
   "Cranberries",
   "Barley Grass",
   "Parsley",
   "Turmeric",
   "Dried Kelp",
   "Yucca Schidigera Extract",
   "Niacin (Vitamin B3)",
   "Calcium Pantothenate (Vitamin B5)",
   "L-carnitine",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "L-lysine",
   "Copper Sulfate",
   "Biotin (Vitamin B7)",
   "Vitamin A Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Sulfate",
   "Taurine",
   "Manganese Amino Acid Chelate",
   "Copper Sulfate",
   "Thiamine Mononitrate (Vitamin B1)",
   "Riboflavin (Vitamin B2)",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #9",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Garlic (moderate) — ingredient #30 (trace amount)",
    "value": -2,
    "severity": "moderate"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #58 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #60 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -10
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Garlic",
    "severity": "moderate",
    "reason": "Garlic's toxic reputation traces to Lee et al. (2000), which fed dogs 5 g/kg body weight daily for a week — roughly 20 cloves a day for a 20kg dog. That produced Heinz bodies and reduced hematocrit, but no dog developed clinical hemolytic anemia. Typical holistic dosing (about a quarter clove per 10 lb) is roughly 20x lower than that study. A 2025 in-vitro study (Beleć, Barć & Lasek, Animals) found no safe threshold has been established, so caution is still warranted — but garlic is not in the same category as onion, which carries stronger evidence of harm. In commercial food it is usually a trace flavoring listed below salt."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "koha-dog-kibble",
  "brand": "Koha",
  "name": "Dog Kibble",
  "score": 40,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Brown Rice",
   "Brewers Rice",
   "Dried Yeast",
   "Salmon Meal",
   "Sunflower Oil",
   "Dried Pumpkin",
   "Ground Miscanthus Grass",
   "Dicalcium Phosphate",
   "Natural Flavor",
   "Calcium Carbonate",
   "Salt",
   "Dried Salmon Broth",
   "Potassium Chloride",
   "Choline Chloride",
   "Inulin",
   "Taurine",
   "Marine Microalgae Oil",
   "Zinc Amino Acid Chelate",
   "Iron Amino Acid Chelate",
   "Mixed Tocopherols (Preservative)",
   "Vitamin E Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Amino Acid Chelate",
   "Niacin Supplement",
   "Sodium Selenite",
   "D-calcium Pantothenate",
   "Riboflavin Supplement",
   "Vitamin A Supplement",
   "Thiamine Mononitrate",
   "Vitamin D3 Supplement",
   "Pyridoxine Hydrochloride",
   "Vitamin B12 Supplement",
   "Calcium Iodate",
   "Folic Acid",
   "Dried Bacillus Coagulans Fermentation Product",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #31 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #32 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Pumpkin"
  ]
 },
 {
  "slug": "redbarn-whitefish-sweet-potato-hearty-stew-dog-food",
  "brand": "Redbarn",
  "name": "Whitefish & Sweet Potato Hearty Stew Dog Food",
  "score": 38,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Fish Broth",
   "Whitefish",
   "Chicken",
   "Sweet Potatoes",
   "Dried Egg Product",
   "Tapioca Starch",
   "Pumpkin",
   "Pea Protein",
   "Soybean Oil",
   "Salt",
   "Natural Flavor",
   "Guar Gum",
   "Minerals (Zinc Oxide, Reduced Iron, Manganese Sulfate, Copper Amino Acid Complex, Potassium Iodide)",
   "Tricalcium Phosphate",
   "Vitamins (Vitamin E Supplement",
   "Vitamin A Supplement",
   "Niacin Supplement",
   "Vitamin B5 (D-calcium Pantothenate)",
   "Vitamin B1 (Thiamine Mononitrate)",
   "Beta-carotene",
   "Vitamin B7 (Biotin)",
   "Riboflavin Supplement",
   "Vitamin B12 Supplement",
   "Vitamin B6 (Pyridoxine Hydrochloride)",
   "Vitamin B9 (Folic Acid))",
   "Potassium Chloride",
   "Taurine",
   "Fish Oil",
   "Choline (Choline Chloride)."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Soybean Oil (mild) — ingredient #9",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin B6 (Pyridoxine Hydrochloride) (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   }
  ],
  "flagged": [
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Minerals (Zinc Oxide, Reduced Iron, Manganese Sulfate, Copper Amino Acid Complex, Potassium Iodide)",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin B6 (Pyridoxine Hydrochloride)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potatoes",
   "Pumpkin"
  ]
 },
 {
  "slug": "fromm-family-gold-large-breed-puppy-pet-food",
  "brand": "Fromm Family",
  "name": "Gold Large Breed Puppy Pet Food",
  "score": 36,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "chicken meal",
   "chicken broth",
   "oatmeal",
   "pearled barley",
   "brown rice",
   "potatoes",
   "menhaden fish meal",
   "dried tomato pomace",
   "chicken fat (preserved with mixed tocopherols)",
   "dried egg product",
   "chicken liver",
   "whole oats",
   "dried yeast",
   "flaxseed",
   "whole barley",
   "cheese",
   "salmon oil (preserved with mixed tocopherols)",
   "salt",
   "carrots",
   "duck",
   "lamb",
   "sweet potatoes",
   "celery",
   "dehydrated alfalfa meal",
   "Vitamins [choline chloride",
   "potassium chloride",
   "Vitamin E supplement",
   "ascorbic acid",
   "calcium carbonate",
   "riboflavin supplement",
   "niacin supplement",
   "calcium pantothenate",
   "Vitamin A supplement",
   "Vitamin D3 supplement",
   "pyridoxine hydrochloride",
   "biotin",
   "Vitamin B12 supplement",
   "thiamine mononitrate",
   "folic acid]",
   "monosodium phosphate",
   "DL-methionine",
   "dried chicory root",
   "calcium sulfate",
   "taurine",
   "chicken cartilage",
   "Minerals [zinc sulfate",
   "manganese sulfate",
   "ferrous sulfate",
   "magnesium sulfate",
   "zinc proteinate",
   "iron proteinate",
   "manganese proteinate",
   "copper sulfate",
   "magnesium proteinate",
   "copper proteinate",
   "calcium iodate]",
   "sorbic acid (preservative)",
   "yucca schidigera extract",
   "L-tryptophan"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamin D3 supplement (mild) — ingredient #35 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (mild) — ingredient #36 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -10
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "pyridoxine hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "DL-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Minerals [zinc sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "manganese sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "ferrous sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [
   "chicken liver"
  ],
  "produce": []
 },
 {
  "slug": "taste-of-the-wild-ancient-stream-with-smoked-salmon-dog-food",
  "brand": "Taste of the Wild",
  "name": "Ancient Stream With Smoked Salmon Dog Food",
  "score": 36,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Ocean Fish Meal",
   "Grain Sorghum",
   "Millet",
   "Cracked Pearled Barley",
   "Dried Yeast",
   "Canola Oil (Preserved With Mixed Tocopherols)",
   "Brown Rice",
   "Smoked Salmon",
   "Natural Flavor",
   "Tomato Pomace",
   "Salmon Oil (A Source Of Dha)",
   "Quinoa",
   "Chia Seed",
   "Salt",
   "Potassium Chloride",
   "Dl-methionine",
   "Choline Chloride",
   "Taurine",
   "Dried Chicory Root",
   "Tomatoes",
   "Blueberries",
   "Raspberries",
   "Yucca Schidigera Extract",
   "L-carnitine",
   "Dried Lactobacillus Plantarum Fermentation Product",
   "Dried Bacillus Subtilis Fermentation Product",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Bifidobacterium Animalis Fermentation Product",
   "Vitamin E Supplement",
   "Iron Proteinate",
   "Zinc Proteinate",
   "Copper Proteinate",
   "Ferrous Sulfate",
   "Zinc Sulfate",
   "Copper Sulfate",
   "Potassium Iodide",
   "Thiamine Mononitrate",
   "Manganese Proteinate",
   "Manganous Oxide",
   "Ascorbic Acid",
   "Vitamin A Supplement",
   "Biotin",
   "Niacin",
   "Calcium Pantothenate",
   "Manganese Sulfate",
   "Sodium Selenite",
   "Pyridoxine Hydrochloride",
   "Vitamin B12 Supplement",
   "Riboflavin",
   "Vitamin D3 Supplement",
   "Folic Acid. Contains A Source Of Live (Viable)",
   "Naturally Occurring Microorganisms. Caloric Content 3",
   "640 Kcal/kg",
   "392 Kcal/cup"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Canola Oil (Preserved With Mixed Tocopherols) (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #50 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #53 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Canola Oil (Preserved With Mixed Tocopherols)",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "nutrisource-grain-free-small-bites-seafood-select-dry-dog-food",
  "brand": "NutriSource",
  "name": "Grain Free Small Bites Seafood Select Dry Dog Food",
  "score": 35,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Menhaden Fish Meal",
   "Peas",
   "Pea Flour",
   "Pea Starch",
   "Chicken Fat (Preserved With Mixed Tocopherols And Citric Acid)",
   "Alfalfa Meal",
   "Natural Turkey And Chicken Flavor",
   "Flax Seeds",
   "Dried Tomato Pomace",
   "Sunflower Oil",
   "Dicalcium Phosphate",
   "Dried Brewers Yeast",
   "Potassium Chloride",
   "Calcium Carbonate",
   "Salt",
   "Minerals (Zinc Proteinate, Iron Proteinate, Copper Proteinate, Manganese Proteinate, Cobalt Proteinate, Selenium Yeast)",
   "Choline Chloride",
   "Vitamins (Vitamin A Acetate, Vitamin D3 Supplement, Vitamin E Supplement, Niacin, D-calcium Pantothenate, Thiamine Mononitrate, Pyridoxine Hydrochloride, Riboflavin Supplement, Folic Acid, Biotin, Vitamin B12 Supplement)",
   "Lactic Acid",
   "Glucosamine Hydrochloride",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "Chondroitin Sulfate",
   "Yucca Schidigera Extract",
   "Taurine",
   "Calcium Iodate",
   "Rosemary Extract",
   "Yeast Culture (Saccharomyces Cerevisiae)",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Enterococcus Faecium Fermentation Product",
   "Dried Aspergillus Oryzae Fermentation Extract",
   "Dried Trichoderma Longibrachiatum Fermentation Extract",
   "Dried Bacillus Subtilis Fermentation Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Vitamin A Acetate, Vitamin D3 Supplement, Vitamin E Supplement, Niacin, D-calcium Pantothenate, Thiamine Mononitrate, Pyridoxine Hydrochloride, Riboflavin Supplement, Folic Acid, Biotin, Vitamin B12 Supplement) (mild) — ingredient #19 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Yeast Culture (Saccharomyces Cerevisiae) (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Vitamins (Vitamin A Acetate, Vitamin D3 Supplement, Vitamin E Supplement, Niacin, D-calcium Pantothenate, Thiamine Mononitrate, Pyridoxine Hydrochloride, Riboflavin Supplement, Folic Acid, Biotin, Vitamin B12 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Yeast Culture (Saccharomyces Cerevisiae)",
    "severity": "mild",
    "reason": "⚪ Formulation signal: yeast culture and hydrolysed yeast are used as cheap palatants — the same job as animal digest. Note the distinction: BREWER'S YEAST is a genuine whole-food source of B vitamins and is not flagged here. It is the processed flavouring forms that signal a food needing help to be eaten."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "weruva-love-me-tender-chicken-breast-au-jus-canned-dog-food-10-oz-dogs",
  "brand": "Weruva",
  "name": "Love Me Tender (Chicken Breast Au Jus) Canned Dog Food 10 Oz. - Dogs In The Kitchen",
  "score": 35,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken Broth",
   "Chicken",
   "Sunflower Seed Oil",
   "Locust Bean Gum",
   "Xanthan Gum",
   "Guar Gum",
   "Tricalcium Phosphate",
   "Calcium Lactate",
   "Potassium Chloride",
   "Choline Chloride",
   "Zinc Sulfate",
   "Vitamin E Supplement",
   "Magnesium Sulfate",
   "Ferrous Sulfate",
   "Copper Sulfate",
   "Calcium Pantothenate",
   "Nicotinic Acid (Vitamin B3)",
   "Thiamine Mononitrate (Vitamin B1)",
   "Vitamin A Supplement",
   "Manganese Sulfate",
   "Riboflavin Supplement (Vitamin B2)",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Folic Acid",
   "Vitamin D3 Supplement",
   "Potassium Iodide",
   "Sodium Selenite",
   "Vitamin B12 Supplement"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #22 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "🔴 Poor omega ratio (high omega-6, no omega-3)",
    "value": -10
   }
  ],
  "flagged": [
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "leader-price-terrines",
  "brand": "Leader Price",
  "name": "Terrines",
  "score": 33,
  "format": "Kibble",
  "ingredients": [
   "rabbit - liver and vegetable terrine (meat and animal by-products (of which rabbit 4% and liver 4%)",
   "vegetables (carrot, peas), mineral substances)",
   "salmon and trout terrine (meat and animal by-products",
   "fish and fish by-products (salmon 4%, trout 4%), mineral substances, sugar)",
   "poultry and kidney terrine (meat and animal by-products (of which poultry 4% and kidneys 4%), mineral substances)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "fish and fish by-products (salmon 4%, trout 4%), mineral substances, sugar) (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "fish and fish by-products (salmon 4%, trout 4%), mineral substances, sugar)",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   }
  ],
  "organs": [
   "rabbit - liver and vegetable terrine (meat and animal by-products (of which rabbit 4% and liver 4%)",
   "poultry and kidney terrine (meat and animal by-products (of which poultry 4% and kidneys 4%), mineral substances)"
  ],
  "produce": [
   "vegetables (carrot, peas), mineral substances)"
  ]
 },
 {
  "slug": "canidae-pure-goodness-w-wholesome-grains-dry-puppy-food-salmon-oatmeal",
  "brand": "Canidae",
  "name": "PURE Goodness w/Wholesome Grains Dry Puppy Food Salmon & Oatmeal 4lb",
  "score": 32,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Salmon Meal",
   "Menhaden Fish Meal",
   "Oatmeal",
   "Barley",
   "Canola Oil",
   "Whole Grain Sorghum",
   "Millet",
   "Suncured Alfalfa Meal",
   "Natural Flavor",
   "Salt",
   "Taurine",
   "Threonine",
   "Potassium Chloride",
   "Choline Chloride",
   "Mixed Tocopherols (A Preservative)",
   "Zinc Sulfate",
   "Vitamin E Supplement",
   "Tryptophan",
   "Ferrous Sulfate",
   "Niacin",
   "L-ascorbyl-2-polyphosphate",
   "Calcium Pantothenate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Vitamin A Supplement",
   "Sodium Selenite",
   "Riboflavin Supplement",
   "Thiamine Mononitrate",
   "Biotin",
   "Vitamin B12 Supplement",
   "Zinc Proteinate",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Pyridoxine Hydrochloride (Vitamin B6 Supplement)",
   "Ethylenediamine Dihydroiodide",
   "Vitamin D3 Supplement",
   "Folic Acid",
   "Dried Lactobacillus Casei Fermentation Product",
   "Dried Lactobacillus Plantarum Fermentation Product. Contains A Source Of Live (Viable) Naturally Occurring Microorganisms."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Canola Oil (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6 Supplement) (mild) — ingredient #34 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #36 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   }
  ],
  "flagged": [
   {
    "name": "Canola Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6 Supplement)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "heart-to-tail-salmon-and-sweet-potato-recipe-dog-food",
  "brand": "Heart to Tail",
  "name": "Salmon and Sweet Potato Recipe Dog Food",
  "score": 32,
  "format": "Kibble",
  "ingredients": [
   "deboned salmon",
   "chicken meal",
   "sweet potatoes",
   "whole ground garbanzo beans",
   "peas",
   "chicken fat (preserved with mixed tocopherols)",
   "pea starch",
   "lentils",
   "ground flaxseed",
   "natural salmon flavor",
   "fish oil",
   "dried chicory root",
   "dried cranberries",
   "dried blueberries",
   "dried carrots",
   "potassium chloride",
   "zinc sulfate",
   "copper sulfate",
   "magnesium sulfate",
   "calcium iodate",
   "sodium selenite",
   "choline chloride",
   "vitamin A supplement",
   "vitamin D3 supplement",
   "vitamin E supplement",
   "niacin",
   "D-calcium pantothenate",
   "pyridoxine hydrochloride (source of vitamin B6)",
   "riboflavin supplement",
   "folic acid",
   "biotin",
   "vitamin B12 supplement",
   "dried lactobacillus acidophilus fermentation product",
   "dried lactobacillus plantarum fermentation product",
   "dried lactobacillus reuteri fermentation product",
   "dried bifidobacterium animalis fermentation product",
   "dried enterococcus faecium fermentation product"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #24 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (source of vitamin B6) (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -10
   },
   {
    "label": "Legumes in top 5 ingredients (2) — DCM link",
    "value": -14
   },
   {
    "label": "Legumes further down the label (2) — DCM link",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (4)",
    "value": 8
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "zinc sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "pyridoxine hydrochloride (source of vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "sweet potatoes",
   "dried cranberries",
   "dried blueberries",
   "dried carrots"
  ]
 },
 {
  "slug": "lakes-ice-cream-vanilla-dog-ice-cream",
  "brand": "Lakes Ice Cream",
  "name": "Vanilla Dog Ice Cream",
  "score": 32,
  "format": "Kibble",
  "ingredients": [
   "Water",
   "Sugar",
   "Coconut Oil",
   "Glucose",
   "Dextrose",
   "Inulin",
   "Potato Starch",
   "Mono - And Diglycerides of Fatty Acids",
   "Guar Gum",
   "Tara Gum",
   "Sodium Alginate",
   "Carrageenan",
   "Natural flavour."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Sugar (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "Glucose (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "Carrageenan (moderate) — ingredient #12 (trace amount)",
    "value": -4,
    "severity": "moderate"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Sugar",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   },
   {
    "name": "Glucose",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: added glucose is a simple sugar used for palatability and, in some products, texture. Dogs generate the glucose they need from protein and fat and have no dietary requirement for it. Concerns are the general sugar ones rather than glucose-specific findings in dogs."
   },
   {
    "name": "Carrageenan",
    "severity": "moderate",
    "reason": "Some research has associated degraded carrageenan with intestinal inflammation. While food-grade carrageenan is considered different, some veterinary nutritionists recommend avoiding it, particularly for pets with sensitive digestive systems"
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "one-purina-dog-food-adult-with-real-salmon-tuna-60-8-oz",
  "brand": "ONE",
  "name": "Purina Dog Food, Adult, With Real Salmon & Tuna 60.8 Oz",
  "score": 32,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Chicken Meal",
   "Soy Flour",
   "Whole Grain Wheat",
   "Beef Fat Preserved With Mixed-tocopherols",
   "Whole Grain Corn",
   "Corn Gluten Meal",
   "Soy Flakes",
   "Corn Germ Meal",
   "Rice Flour",
   "Tuna",
   "Oat Meal",
   "Glycerin",
   "Natural Flavor",
   "Calcium Carbonate",
   "Salt",
   "Soybean Oil",
   "Caramel Color",
   "Mono And Dicalcium Phosphate",
   "Fish Oil",
   "Vitamins [vitamin E Supplement",
   "Niacin (Vitamin B-3)",
   "Vitamin A Supplement",
   "Calcium Pantothenate (Vitamin B-5)",
   "Thiamine Mononitrate (Vitamin B-1)",
   "Vitamin B-12 Supplement",
   "Riboflavin Supplement (Vitamin B-2)",
   "Pyridoxine Hydrochloride (Vitamin B-6)",
   "Folic Acid (Vitamin B-9)",
   "Vitamin D-3 Supplement",
   "Menadione Sodium Bisulfite Complex (Vitamin K)",
   "Biotin (Vitamin B-7)]",
   "Potassium Chloride",
   "Minerals [zinc Sulfate",
   "Ferrous Sulfate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Calcium Iodate",
   "Sodium Selenite]",
   "Choline Chloride."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Corn Gluten Meal (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #14 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Soybean Oil (mild) — ingredient #17 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Caramel Color (moderate) — ingredient #18 (trace amount)",
    "value": -4,
    "severity": "moderate"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B-6) (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   }
  ],
  "flagged": [
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Caramel Color",
    "severity": "moderate",
    "reason": "Certain types of caramel color produced using ammonia processes may contain 4-methylimidazole (4-MEI), a compound that some research has associated with potential carcinogenic activity"
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B-6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Menadione Sodium Bisulfite Complex (Vitamin K)",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   },
   {
    "name": "Minerals [zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "top-chews-100-natural-dog-treats-chicken-and-apple-recipe-sausage-bite",
  "brand": "Top Chews 100% natural dog treats",
  "name": "Chicken and Apple Recipe: sausage bites",
  "score": 32,
  "format": "Kibble",
  "ingredients": [
   "chicken",
   "vegetable glycerin",
   "chickpeas",
   "black beans",
   "ground potatoes",
   "dried apples",
   "natural flavors",
   "distilled vinegar",
   "salt",
   "paprika."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavors (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "natural flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   }
  ],
  "organs": [],
  "produce": [
   "dried apples"
  ]
 },
 {
  "slug": "unidentifiable-cage-free-chicken-brown-rice-sweet-potato-recipe",
  "brand": "Unidentifiable",
  "name": "Cage-Free Chicken Brown Rice & Sweet Potato Recipe",
  "score": 31,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Chicken Meal",
   "Brown Rice",
   "Barley",
   "Peas",
   "Ground Sorghum",
   "Chicken Fat (Preserved with Mixed Tocopherols)",
   "Turkey Meal",
   "Flaxseeds",
   "Sweet Potato",
   "Natural Flavor",
   "Dried Plain Beet Pulp",
   "Brewers Dried Yeast",
   "Fish Oil",
   "Monosodium Phosphate",
   "Salt",
   "Potassium Chloride",
   "L-Threonine",
   "Dried Chicory Root",
   "DL-Methionine",
   "Pumpkin",
   "Cranberries",
   "Dried Kelp",
   "Suncured Alfalfa Meal",
   "Ground Miscanthus Grass",
   "Coconut Flour",
   "Chia Seeds",
   "Citric Acid (Preservative)",
   "Mixed Tocopherols (Preservative)",
   "Taurine",
   "Ferrous Sulfate",
   "Zinc Sulfate",
   "Vitamin E Supplement",
   "L-Ascorbyl-2-Polyphosphate (Source of Vitamin C)",
   "Yucca Schidigera Extract",
   "Blueberries",
   "Turmeric",
   "Apple",
   "Copper Sulfate",
   "Dried Bacillus Coagulans Fermentation Product",
   "Sodium Selenite",
   "Manganese Sulfate",
   "Vitamin A Supplement",
   "Niacin Supplement",
   "D-Calcium Pantothenate",
   "Riboflavin Supplement",
   "Spinach",
   "Ginger",
   "Chamomile",
   "Parsley",
   "Dandelion",
   "Dried Spearmint",
   "Cinnamon",
   "Thiamine Mononitrate",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride",
   "Biotin",
   "Calcium Iodate",
   "Folic Acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #55 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #57 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potato",
   "Dried Plain Beet Pulp"
  ]
 },
 {
  "slug": "simply-nourish-lamb-brown-rice-recipe",
  "brand": "Simply Nourish",
  "name": "Lamb & Brown Rice Recipe",
  "score": 30,
  "format": "Kibble",
  "ingredients": [
   "Deboned Lamb",
   "Lamb Meal (Source Of Glucosamine And Chondroitin Sulfate)",
   "Brown Rice",
   "Oatmeal",
   "Barley",
   "Turkey Meal (Source Of Glucosamine And Chondroitin Sulfate)",
   "Vegetable Oil (Preserved With Mixed Tocopherols)",
   "Pea Protein",
   "Natural Flavor",
   "Pea Fiber",
   "Whole Flaxseed",
   "Potassium Chloride",
   "Salt",
   "Dicalcium Phosphate",
   "Dried Chicory Root",
   "Dried Carrots",
   "Dried Kale",
   "Dried Pumpkin",
   "Dried Blueberries",
   "Minerals (Zinc Sulfate, Zinc Proteinate, Iron Proteinate, Ferrous Sulfate, Copper Proteinate, Manganese Sulfate, Sodium Selenite, Manganese Proteinate, Copper Sulfate)",
   "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, d-Calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Calcium Iodate, Folic Acid, Vitamin D3 Supplement)",
   "DL-Methionine",
   "Taurine",
   "Citric Acid (A Preservative)",
   "Mixed Tocopherols (A Preservative)",
   "Rosemary Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vegetable Oil (Preserved With Mixed Tocopherols) (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #9",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, d-Calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Calcium Iodate, Folic Acid, Vitamin D3 Supplement) (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Legumes further down the label (2) — DCM link",
    "value": -6
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Vegetable Oil (Preserved With Mixed Tocopherols)",
    "severity": "mild",
    "reason": "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Minerals (Zinc Sulfate, Zinc Proteinate, Iron Proteinate, Ferrous Sulfate, Copper Proteinate, Manganese Sulfate, Sodium Selenite, Manganese Proteinate, Copper Sulfate)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Vitamin A Supplement, Niacin Supplement, d-Calcium Pantothenate, Riboflavin Supplement, Thiamine Mononitrate, Biotin, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Calcium Iodate, Folic Acid, Vitamin D3 Supplement)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "hill-s-science-diet-hairball-control",
  "brand": "Hill's Science Diet",
  "name": "Hairball Control",
  "score": 29,
  "format": "Kibble",
  "ingredients": [
   "Water",
   "Chicken",
   "Turkey Giblets",
   "Pork By-Products",
   "Pork Liver",
   "Powdered Cellulose",
   "Corn Starch",
   "Corn Gluten Meal",
   "Wheat Flour",
   "Chicken Fat",
   "Soybean Oil",
   "Chicken Liver Flavor",
   "Natural Flavor",
   "Dicalcium Phosphate",
   "Brewers Dried Yeast",
   "Guar Gum",
   "Potassium Chloride",
   "Iodized Salt",
   "Choline Chloride",
   "Locust Bean Gum",
   "Carrageenan",
   "Taurine",
   "vitamins (Vitamin E Supplement",
   "Thiamine Mononitrate",
   "Ascorbic Acid (source of Vitamin C), Niacin Supplement, Pyridoxine Hydrochloride, Calcium Pantothenate, Vitamin B12 Supplement, Riboflavin Supplement, Biotin, Vitamin D3 Supplement, Folic Acid)",
   "Calcium Carbonate",
   "minerals (Zinc Oxide, Ferrous Sulfate, Manganese Sulfate, Copper Sulfate, Calcium Iodate)",
   "Calcium Sulfate",
   "DL-Methionine",
   "Magnesium Oxide",
   "Beta-Carotene"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Powdered Cellulose (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Corn Gluten Meal (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Soybean Oil (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Carrageenan (moderate) — ingredient #21 (trace amount)",
    "value": -2,
    "severity": "moderate"
   },
   {
    "label": "Ascorbic Acid (source of Vitamin C), Niacin Supplement, Pyridoxine Hydrochloride, Calcium Pantothenate, Vitamin B12 Supplement, Riboflavin Supplement, Biotin, Vitamin D3 Supplement, Folic Acid) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   }
  ],
  "flagged": [
   {
    "name": "Powdered Cellulose",
    "severity": "mild",
    "reason": "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better."
   },
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Soybean Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Carrageenan",
    "severity": "moderate",
    "reason": "Some research has associated degraded carrageenan with intestinal inflammation. While food-grade carrageenan is considered different, some veterinary nutritionists recommend avoiding it, particularly for pets with sensitive digestive systems"
   },
   {
    "name": "Ascorbic Acid (source of Vitamin C), Niacin Supplement, Pyridoxine Hydrochloride, Calcium Pantothenate, Vitamin B12 Supplement, Riboflavin Supplement, Biotin, Vitamin D3 Supplement, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "minerals (Zinc Oxide, Ferrous Sulfate, Manganese Sulfate, Copper Sulfate, Calcium Iodate)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Magnesium Oxide",
    "severity": "moderate",
    "reason": "❌ Oxide is the worst grade of mineral form — barely absorbed, cheapest to buy. Look for magnesium proteinate; magnesium sulfate is the acceptable middle."
   }
  ],
  "organs": [
   "Pork Liver",
   "Chicken Liver Flavor"
  ],
  "produce": []
 },
 {
  "slug": "wolf-of-wilderness-wolf-of-wilderness",
  "brand": "Wolf of Wilderness",
  "name": "Wolf of Wilderness",
  "score": 29,
  "format": "Kibble",
  "ingredients": [
   "fresh chicken meat (41%)",
   "pieces of potato (dried)",
   "salmon protein (10%, dried)",
   "poultry protein (10%, partially dried and hydrolysed)",
   "dried beet pulp (desugared)",
   "linseed",
   "poultry fat",
   "brewer's yeast (dried)",
   "monocalcium phosphate",
   "egg (dried)",
   "sodium chloride",
   "lignocellulose",
   "fruits of the forest (0.3%, dried: cranberries, blackcurrants, raspberries, elderberries)",
   "herbs (0.2%, dried: mugwort, St. John’s wort, nettle leaves, camomile, common yarrow, coltsfoot, dandelion root)",
   "yeast extract (dried, = 0.2% beta-glucans and mannan-oligosaccharides)",
   "apple (dried)",
   "chicory inulin (0.1%)",
   "salmon oil",
   "sunflower oil."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "dried beet pulp (desugared) (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "lignocellulose (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "dried beet pulp (desugared)",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   },
   {
    "name": "lignocellulose",
    "severity": "mild",
    "reason": "Powdered cellulose is wood pulp used as a cheap bulking fibre, and the comparative research is unflattering. In Beagle feeding trials (Journal of Animal Science), apparent total tract digestibility was 11% for cellulose against 29% for beet pulp — less than half. Cellulose is insoluble and poorly fermentable, so it passes through largely untouched: it reduces overall dry matter and organic matter digestibility, increases stool volume, and produces lower concentrations of beneficial short-chain fatty acids with a less acidic fecal pH than fermentable fibres. It adds bulk and satiety without feeding the gut. Fermentable fibres — beet pulp, pumpkin, chicory — do the job better."
   }
  ],
  "organs": [],
  "produce": [
   "dried beet pulp (desugared)"
  ]
 },
 {
  "slug": "zignature-salmon-limited-ingredient-formula-canned-wet-dog-food-13oz",
  "brand": "Zignature",
  "name": "Salmon Limited Ingredient Formula Canned Wet Dog Food 13oz",
  "score": 28,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Salmon",
   "Fish Broth",
   "Salmon Meal",
   "Peas",
   "Chickpeas",
   "Agar-agar",
   "Sun-cured Alfalfa Meal",
   "Potassium Chloride",
   "Choline Chloride",
   "Salt",
   "Calcium Carbonate",
   "Minerals (Iron Proteinate, Zinc Proteinate, Manganese Proteinate, Copper Proteinate, Magnesium Proteinate, Sodium Selenite, Calcium Iodate)",
   "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Niacin Supplement, Calcium Pantothenate, Biotin, Vitamin A Supplement, Riboflavin Supplement, Vitamin D3 Supplement, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
   "Taurine",
   "L-carnitine"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Niacin Supplement, Calcium Pantothenate, Biotin, Vitamin A Supplement, Riboflavin Supplement, Vitamin D3 Supplement, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid) (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -5
   },
   {
    "label": "Legumes in top 5 ingredients (2) — DCM link",
    "value": -14
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   }
  ],
  "flagged": [
   {
    "name": "Minerals (Iron Proteinate, Zinc Proteinate, Manganese Proteinate, Copper Proteinate, Magnesium Proteinate, Sodium Selenite, Calcium Iodate)",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Thiamine Mononitrate, Niacin Supplement, Calcium Pantothenate, Biotin, Vitamin A Supplement, Riboflavin Supplement, Vitamin D3 Supplement, Vitamin B12 Supplement, Pyridoxine Hydrochloride, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "grandma-mae-s-country-naturals-dry-dog-food-salmon-whitefish-meal-4l",
  "brand": "Grandma Mae's",
  "name": "Country Naturals Dry Dog Food Salmon & Whitefish Meal 4l",
  "score": 27,
  "format": "Kibble",
  "ingredients": [
   "Salmon Meal",
   "Brown Rice",
   "Whitefish Meal",
   "Oats",
   "Pearled Barley",
   "Millet",
   "Canola Oil (Preserved With Mixed Tocopherols)",
   "Dried Spinach",
   "Dried Carrots",
   "Natural Flavor",
   "Ground Miscanthus Grass",
   "Dicalcium Phosphate",
   "Monosodium Phosphate",
   "Salt",
   "Potassium Chloride",
   "Dl-methionine",
   "Choline Chloride",
   "L-lysine",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Bacillus Subtilis Fermentation Product",
   "Dried Bifidobacterium Longum Fermentation Product",
   "Dried Enterococcus Faecium Fermentation Product",
   "Zinc Proteinate",
   "Vitamin E Supplement",
   "Niacin",
   "Zinc Sulfate",
   "Ferrous Sulfate",
   "Riboflavin",
   "Copper Proteinate",
   "Manganese Proteinate",
   "Vitamin A Supplement",
   "Copper Sulfate",
   "D-calcium Pantothenate",
   "Vitamin B12 Supplement",
   "Manganese Sulfate",
   "Biotin",
   "Vitamin D3 Supplement",
   "Cobalt Proteinate",
   "Thiamine Mononitrate",
   "Folic Acid",
   "Sodium Selenite",
   "Calcium Iodate."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Canola Oil (Preserved With Mixed Tocopherols) (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #37 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   }
  ],
  "flagged": [
   {
    "name": "Canola Oil (Preserved With Mixed Tocopherols)",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Spinach",
   "Dried Carrots"
  ]
 },
 {
  "slug": "heart-to-tail-deboned-chicken-and-brown-rice-recipe-dog-food",
  "brand": "Heart to Tail",
  "name": "Deboned Chicken and Brown Rice Recipe Dog Food",
  "score": 27,
  "format": "Kibble",
  "ingredients": [
   "deboned chicken",
   "chicken meal",
   "ground brown rice",
   "peas",
   "pearled barley",
   "chicken fat (preserved with mixed tocopherols)",
   "rice bran",
   "dried plain beet pulp",
   "fish meal",
   "natural liver flavor",
   "dried egg product",
   "brewers dried yeast",
   "salt",
   "potassium chloride",
   "flaxseed meal",
   "yucca schidigera extract",
   "dried kelp",
   "dried carrots",
   "dried chicory root",
   "dried cranberries",
   "dried blueberries",
   "choline chloride",
   "vitamin E supplement",
   "vitamin A supplement",
   "vitamin D3 supplement",
   "niacin",
   "calcium pantothenate",
   "thiamine mononitrate (source of vitamin B1)",
   "pyridoxine hydrochloride (source of vitamin B6)",
   "riboflavin supplement",
   "folic acid",
   "biotin",
   "vitamin B12 supplement",
   "zinc polysaccharide complex",
   "iron polysaccharide complex",
   "manganese polysaccharide complex",
   "copper polysaccharide complex",
   "copper sulfate",
   "manganese sulfate",
   "calcium iodate",
   "sodium selenite",
   "dried lactobacillus acidophilus fermentation product",
   "dried lactobacillus plantarum fermentation product",
   "dried lactobaccillus reuteri fermentation product",
   "dried bifidobacterium animalis fermentation product",
   "dried enteroccus faecium fermentation product"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (source of vitamin B6) (mild) — ingredient #29 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "pyridoxine hydrochloride (source of vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "manganese sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [
   "natural liver flavor"
  ],
  "produce": [
   "dried plain beet pulp"
  ]
 },
 {
  "slug": "yarrah-vega-dog-food",
  "brand": "Yarrah",
  "name": "Vega dog food",
  "score": 27,
  "format": "Kibble",
  "ingredients": [
   "whole soy beans",
   "whole grain wheat",
   "wheat bran",
   "yellow corn",
   "sunflower seed husks",
   "minerals",
   "coconut oil",
   "brewers yeast",
   "whole white lupine",
   "baobab",
   "dried seaweed"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [],
  "organs": [],
  "produce": []
 },
 {
  "slug": "ahealth-shreds-chicken-rice-formula",
  "brand": "Ahealth Shreds",
  "name": "Chicken & Rice Formula",
  "score": 26,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "chicken meal (source of chondroitin sulfate and glucosamine)",
   "white rice",
   "pearled barley",
   "chicken fat (preserved with mixed tocopherols)",
   "oatmeal",
   "soy flour",
   "dried plain beet pulp",
   "flaxseed",
   "fish meal",
   "natural flavor",
   "vegetable glycerin",
   "salt",
   "potassium chloride",
   "choline chloride",
   "minerals [zinc amino acid complex",
   "zinc sulfate",
   "iron proteinate",
   "ferrous sulfate",
   "copper proteinate",
   "copper sulfate",
   "manganese proteinate",
   "manganese sulfate",
   "calcium iodate",
   "sodium selenite]",
   "vitamins [vitamin E supplement",
   "vitamin B3 (niacin)",
   "vitamin A supplement",
   "vitamin B12 supplement",
   "vitamin B1 (thiamine mononitrate)",
   "vitamin B5 (calcium pantothenate)",
   "vitamin B7 (biotin)",
   "vitamin B6 (pyridoxine hydrochloride)",
   "vitamin B2 (riboflavin)",
   "vitamin D3 supplement",
   "vitamin B9 (folic acid)]",
   "DL-Methionine",
   "inulin",
   "taurine",
   "calcium carbonate",
   "dried cultured whey",
   "dried Bacillus coagulans fermentation product",
   "yucca schidigera extract",
   "citric acid (preservative)",
   "rosemary extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamin B6 (pyridoxine hydrochloride) (mild) — ingredient #33 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #35 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "zinc sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "ferrous sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "manganese sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "sodium selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "vitamin B6 (pyridoxine hydrochloride)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": [
   "dried plain beet pulp"
  ]
 },
 {
  "slug": "pure-balance-chicken-pea-recipe-dog-food",
  "brand": "Pure Balance",
  "name": "Chicken & Pea Recipe Dog Food",
  "score": 26,
  "format": "Kibble",
  "ingredients": [
   "CHICKEN",
   "CHICKEN MEAL",
   "DRIED PEAS",
   "POTATOES",
   "PEA STARCH",
   "POULTRY FAT (PRESERVED WITH MIXED TOCOPHEROLS)",
   "EGG PRODUCT",
   "DRIED YEAST",
   "DRIED BEET PULP",
   "NATURAL FLAVOR",
   "FLAXSEED",
   "SALMON OIL",
   "SALT",
   "POTASSIUM CHLORIDE",
   "DL-METHIONINE",
   "CHOLINE CHLORIDE",
   "TAURINE",
   "VITAMINS (VITAMIN E SUPPLEMENT, ASCORBIC ACID [SOURCE OF VITAMIN C), NIACIN, VITAMIN A SUPPLEMENT, THIAMINE MONONITRATE, D-CALCIUM PANTOTHENATE, RIBOFLAVIN SUPPLEMENT, PYRIDOXINE HYDROCHLORIDE, VITAMIN B12 SUPPLEMENT, FOLIC ACID, BIOTIN, VITAMIN D3 SUPPLEMENT)",
   "MINERALS (FERROUS SULFATE, ZINC SULFATE, COPPER SULFATE, SODIUM SELENITE, MANGANESE SULFATE, CALCIUM IODATE)",
   "LACTIC ACID",
   "MIXED TOCOPHEROLS (USED AS A PRESERVATIVE)",
   "CITRIC ACID (USED AS A PRESERVATIVE)",
   "L-CARNITINE",
   "DRIED BACILLUS COAGULANS FERMENTATION PRODUCT",
   "ROSEMARY EXTRACT"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "NATURAL FLAVOR (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "VITAMINS (VITAMIN E SUPPLEMENT, ASCORBIC ACID [SOURCE OF VITAMIN C), NIACIN, VITAMIN A SUPPLEMENT, THIAMINE MONONITRATE, D-CALCIUM PANTOTHENATE, RIBOFLAVIN SUPPLEMENT, PYRIDOXINE HYDROCHLORIDE, VITAMIN B12 SUPPLEMENT, FOLIC ACID, BIOTIN, VITAMIN D3 SUPPLEMENT) (mild) — ingredient #18 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "NATURAL FLAVOR",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "DL-METHIONINE",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "VITAMINS (VITAMIN E SUPPLEMENT, ASCORBIC ACID [SOURCE OF VITAMIN C), NIACIN, VITAMIN A SUPPLEMENT, THIAMINE MONONITRATE, D-CALCIUM PANTOTHENATE, RIBOFLAVIN SUPPLEMENT, PYRIDOXINE HYDROCHLORIDE, VITAMIN B12 SUPPLEMENT, FOLIC ACID, BIOTIN, VITAMIN D3 SUPPLEMENT)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "MINERALS (FERROUS SULFATE, ZINC SULFATE, COPPER SULFATE, SODIUM SELENITE, MANGANESE SULFATE, CALCIUM IODATE)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [],
  "produce": [
   "DRIED BEET PULP"
  ]
 },
 {
  "slug": "jack-hypoallergen-pat-400g-lamb-with-potato",
  "brand": "Jack",
  "name": "HYPOALLERGEN paté 400g lamb with potato",
  "score": 25,
  "format": "Kibble",
  "ingredients": [
   "Lamb – 73.5%",
   "Berries – 0.5%",
   "Sunflower oil and Mineral Substances.\r\nSugar free\tGrain free\twithout artificial colouring\tartificial flavour free\tGluten free\tSoya free\tPreservative free",
   "Without added sugar"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Sunflower oil and Mineral Substances.\r\nSugar free\tGrain free\twithout artificial colouring\tartificial flavour free\tGluten free\tSoya free\tPreservative free (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Without added sugar (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "Sunflower oil and Mineral Substances.\r\nSugar free\tGrain free\twithout artificial colouring\tartificial flavour free\tGluten free\tSoya free\tPreservative free",
    "severity": "severe",
    "reason": "Artificial colours in pet food are petroleum-derived synthetic dyes with zero nutritional value. Dogs do not select food by colour — these dyes exist purely to appeal to humans. Several have been linked to tumor promotion, hypersensitivity, and carcinogenic activity in animal studies."
   },
   {
    "name": "Without added sugar",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "nutro-chicken-brown-rice-recipe",
  "brand": "Nutro",
  "name": "Chicken & Brown Rice Recipe",
  "score": 25,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Chicken Meal",
   "Whole Grain Barley",
   "Split Peas",
   "Brewers Rice",
   "Whole Grain Brown Rice",
   "Natural Flavors",
   "Rice Bran",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Whole Grain Oatmeal",
   "Dried Plain Beet",
   "Pulp",
   "Fish Oil (preserved with Mixed Tocopherols)",
   "Salt",
   "Choline Chloride",
   "Potassium Chloride",
   "DL-Methionine",
   "Citric Acid (preservative)",
   "Mixed",
   "Tocopherols (preservative)",
   "Whole Chia Seed",
   "Dried Coconut",
   "Dried Tomato",
   "Pomace",
   "Dried Egg Product",
   "Dried Pumpkin",
   "Dried Kale",
   "Dried Spinach",
   "Vitamin E Supplement",
   "L-ascorbyl-2-polyphosphate (source of Vitamin C)",
   "Ferrous Sulfate",
   "Zinc Oxide",
   "Sodium Selenite",
   "D-Calcium Pantothenate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Biotin",
   "Thiamine Mononitrate",
   "(Vitamin B1)",
   "Vitamin B12 Supplement",
   "Vitamin A Supplement",
   "Niacin",
   "Supplement",
   "Riboflavin Supplement (Vitamin B2)",
   "Pyridoxine Hydrochloride",
   "(Vitamin B6)",
   "Vitamin D3 Supplement",
   "Potassium Iodide",
   "Manganous",
   "Oxide",
   "Folic Acid",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavors (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #45 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #47 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Zinc Oxide",
    "severity": "moderate",
    "reason": "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Plain Beet"
  ]
 },
 {
  "slug": "beneful-purina-with-real-chicken-healthy-puppy-dry-dog-food",
  "brand": "Beneful",
  "name": "Purina With Real Chicken Healthy Puppy Dry Dog Food",
  "score": 24,
  "format": "Kibble",
  "ingredients": [
   "Chicken",
   "Chicken By-product Meal",
   "Whole Grain Corn",
   "Soybean Meal",
   "Corn Gluten Meal",
   "Barley",
   "Rice",
   "Whole Grain Wheat",
   "Beef Fat Preserved With Mixed-tocopherols",
   "Egg And Chicken Flavor",
   "Natural Flavor",
   "Oat Meal",
   "Calcium Carbonate",
   "Fish Oil",
   "Mono And Dicalcium Phosphate",
   "Salt",
   "Glycerin",
   "Dried Peas",
   "Dried Carrots",
   "Potassium Chloride",
   "Annatto Color",
   "Vegetable Juice (Color)",
   "Choline Chloride",
   "Vitamins [vitamin E Supplement",
   "Niacin (Vitamin B-3)",
   "Vitamin A Supplement",
   "Calcium Pantothenate (Vitamin B-5)",
   "Pyridoxine Hydrochloride (Vitamin B-6)",
   "Vitamin B-12 Supplement",
   "Thiamine Mononitrate (Vitamin B-1)",
   "Vitamin D-3 Supplement",
   "Riboflavin Supplement (Vitamin B-2)",
   "Menadione Sodium Bisulfite Complex (Vitamin K)",
   "Folic Acid (Vitamin B-9)",
   "Biotin (Vitamin B-7)]",
   "Minerals [zinc Sulfate",
   "Ferrous Sulfate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Calcium Iodate",
   "Sodium Selenite]",
   "Carmine",
   "Dl-methionine",
   "L-lysine Monohydrochloride. N409321."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken By-product Meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Soybean Meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Corn Gluten Meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B-6) (mild) — ingredient #28 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Chicken By-product Meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Soybean Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Corn Gluten Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B-6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Menadione Sodium Bisulfite Complex (Vitamin K)",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   },
   {
    "name": "Minerals [zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "heritage-ranch-by-h-e-b-adult-chicken-brown-rice-recipe",
  "brand": "Heritage Ranch by H-E-B",
  "name": "Adult Chicken & Brown Rice Recipe",
  "score": 24,
  "format": "Kibble",
  "ingredients": [
   "CHICKEN",
   "CHICKEN MEAL",
   "BROWN RICE",
   "BREWERS RICE",
   "RICE BRAN",
   "DRIED PLAIN BEET PULP",
   "PEA PROTEIN",
   "DRIED PEAS",
   "CHICKEN FAT (PRESERVED WITH MIXED TOCOPHEROLS)",
   "NATURAL FLAVOR",
   "DICALCIUM PHOSPHATE",
   "POTASSIUM CHLORIDE",
   "SALT",
   "DRIED EGG PRODUCT",
   "FLAXSEEDS",
   "DRIED CARROTS",
   "FISH OIL",
   "OATMEAL",
   "DRIED SWEET POTATOES",
   "DRIED BLUEBERRIES",
   "CHOLINE CHLORIDE",
   "L-THREONINE",
   "DRIED CRANBERRIES",
   "CITRIC ACID (PRESERVATIVE)",
   "MIXED TOCOPHEROLS (PRESERVATIVE)",
   "IRON AMINO ACID COMPLEX",
   "ZINC AMINO ACID COMPLEX",
   "VITAMIN E SUPPLEMENT",
   "FERROUS SULFATE",
   "L-CARNITINE",
   "ZINC OXIDE",
   "YUCCA SCHIDIGERA EXTRACT",
   "COPPER AMINO ACID COMPLEX",
   "COPPER SULFATE",
   "SODIUM SELENITE",
   "MANGANESE AMINO ACID COMPLEX",
   "VITAMIN A SUPPLEMENT",
   "NIACIN SUPPLEMENT",
   "D-CALCIUM PANTOTHENATE",
   "RIBOFLAVIN SUPPLEMENT",
   "MAN GAN OUS OXIDE",
   "THIAMINE MONONITRATE",
   "VITAMIN D3 SUPPLEMENT",
   "VITAMIN B12 SUPPLEMENT",
   "PYRIDOXINE HYDROCHLORIDE",
   "BIOTIN",
   "CALCIUM IODATE",
   "FOLIC ACID",
   "ROSEMARY EXTRACT"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "NATURAL FLAVOR (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "VITAMIN D3 SUPPLEMENT (mild) — ingredient #43 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "PYRIDOXINE HYDROCHLORIDE (mild) — ingredient #45 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Legumes further down the label (2) — DCM link",
    "value": -6
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "NATURAL FLAVOR",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "FERROUS SULFATE",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "ZINC OXIDE",
    "severity": "moderate",
    "reason": "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading."
   },
   {
    "name": "COPPER SULFATE",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "SODIUM SELENITE",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "VITAMIN D3 SUPPLEMENT",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "PYRIDOXINE HYDROCHLORIDE",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "DRIED PLAIN BEET PULP"
  ]
 },
 {
  "slug": "blue-buffalo-salmon-flavor-dry-dog-food-5lbs",
  "brand": "Blue Buffalo",
  "name": "Salmon Flavor Dry Dog Food - 5lbs",
  "score": 23,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Fish Meal (Source Of Omega 3 Fatty Acids)",
   "Brown Rice",
   "Oatmeal",
   "Barley",
   "Peas",
   "Pea Starch",
   "Canola Oil",
   "Dried Tomato Pomace",
   "Flaxseed (Source Of Omega 6 Fatty Acids)",
   "Natural Flavor",
   "Pea Protein",
   "Dried Egg Product",
   "Dried Yeast",
   "Fish Oil",
   "Calcium Carbonate",
   "Salt",
   "Direct Dehydrated Alfalfa Pellets",
   "Potassium Chloride",
   "Potatoes",
   "Dried Chicory Root",
   "Pea Fiber",
   "Alfalfa Nutrient Concentrate",
   "Choline Chloride",
   "Dicalcium Phosphate",
   "Dl-methionine",
   "Preserved With Mixed Tocopherols",
   "Dried Sweet Potatoes",
   "Carrots",
   "Vitamin E Supplement",
   "Glucosamine Hydrochloride",
   "Zinc Amino Acid Chelate",
   "Zinc Sulfate",
   "Vegetable Juice For Color",
   "Ferrous Sulfate",
   "Iron Amino Acid Chelate",
   "L-threonine",
   "Blueberries",
   "Cranberries",
   "Barley Grass",
   "Parsley",
   "Turmeric",
   "Dried Kelp",
   "Yucca Schidigera Extract",
   "Niacin (Vitamin B3)",
   "Calcium Pantothenate (Vitamin B5)",
   "L-ascorbyl-2-polyphosphate (Vitamin C)",
   "L-lysine",
   "Copper Sulfate",
   "Biotin (Vitamin B7)",
   "Vitamin A Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Sulfate",
   "Taurine",
   "Manganese Amino Acid Chelate",
   "Thiamine Mononitrate (Vitamin B1)",
   "Riboflavin (Vitamin B2)",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Canola Oil (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #58 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #60 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes further down the label (2) — DCM link",
    "value": -6
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Canola Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "blue-buffalo-wilderness-adult-dog-food-salmon-recipe-4-50-lb",
  "brand": "Blue Buffalo",
  "name": "Wilderness Adult Dog Food Salmon Recipe, 4.50 Lb",
  "score": 22,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Deboned Salmon",
   "Chicken Meal",
   "Pea Protein",
   "Peas",
   "Tapioca Starch",
   "Pea Starch",
   "Dried Tomato Pomace",
   "Dried Egg Product",
   "Natural Flavor",
   "Flaxseed (Source Of Omega 6 Fatty Acids)",
   "Chicken Fat (Preserved With Mixed Tocopherols)",
   "Menhaden Fish Meal (Source Of Omega 3 Fatty Acids)",
   "Potatoes",
   "Fish Oil (Source Of Epa-eicosapentaenoic Acid)",
   "Dicalcium Phosphate",
   "Dehydrated Alfalfa Meal",
   "Dl-methionine",
   "Potassium Chloride",
   "Dried Chicory Root",
   "Pea Fiber",
   "Alfalfa Nutrient Concentrate",
   "Calcium Carbonate",
   "Salt",
   "Taurine",
   "Choline Chloride",
   "Preserved With Mixed Tocopherols",
   "Sweet Potatoes",
   "Carrots",
   "Glucosamine Hydrochloride",
   "Vitamin E Supplement",
   "L-carnitine",
   "Zinc Amino Acid Chelate",
   "Zinc Sulfate",
   "Vegetable Juice For Color",
   "Ferrous Sulfate",
   "Iron Amino Acid Chelate",
   "Blueberries",
   "Cranberries",
   "Barley Grass",
   "Parsley",
   "Turmeric",
   "Dried Kelp",
   "Yucca Schidigera Extract",
   "Chondroitin Sulfate",
   "Niacin (Vitamin B3)",
   "Calcium Pantothenate (Vitamin B5)",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "L-lysine",
   "Copper Sulfate",
   "Biotin (Vitamin B7)",
   "Vitamin A Supplement",
   "Copper Amino Acid Chelate",
   "Manganese Sulfate",
   "Manganese Amino Acid Chelate",
   "Thiamine Mononitrate (Vitamin B1)",
   "Riboflavin (Vitamin B2)",
   "Vitamin D3 Supplement",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Calcium Iodate"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #9",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #57 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #59 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🐟 Good omega ratio (est. ~5–8:1 — fish oil, no omega-6 sources)",
    "value": 5
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "natural-balance-pet-foods-l-i-d-adult-dry-dog-food-salmon-sweet-potato",
  "brand": "Natural Balance",
  "name": "Pet Foods L.I.D. Adult Dry Dog Food Salmon & Sweet Potato 12lb",
  "score": 21,
  "format": "Kibble",
  "ingredients": [
   "Sweet Potatoes",
   "Salmon",
   "Salmon Meal",
   "Canola Oil",
   "Potato Fiber",
   "Natural Flavor",
   "Sodium Chloride",
   "Salmon Oil (A Source Of Dha)",
   "Flaxseed",
   "Potassium Chloride",
   "Methionine",
   "Choline Chloride",
   "Natural Mixed Tocopherols",
   "Taurine",
   "Vitamin E Supplement",
   "Iron Proteinate",
   "Zinc Proteinate",
   "Copper Proteinate",
   "Ferrous Sulfate",
   "Zinc Sulfate",
   "Copper Sulfate",
   "Potassium Iodide",
   "Thiamine Mononitrate (Vitamin B-1)",
   "Manganese Proteinate",
   "Manganous Oxide",
   "Ascorbic Acid",
   "Vitamin A Supplement",
   "Biotin",
   "Niacin",
   "Calcium Pantothenate",
   "Manganese Sulfate",
   "Sodium Selenite",
   "Pyridoxine Hydrochloride (Vitamin B-6)",
   "Vitamin B-12 Supplement",
   "Riboflavin (Vitamin B-2)",
   "Vitamin D-3 Supplement",
   "Folic Acid."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Canola Oil (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Natural Flavor (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B-6) (mild) — ingredient #33 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -11
   },
   {
    "label": "Salt is ingredient #7 — little real food below it",
    "value": -4
   },
   {
    "label": "Est. ~48% carbohydrate — a carb is the #1 ingredient",
    "value": -22
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "Canola Oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B-6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": [
   "Sweet Potatoes"
  ]
 },
 {
  "slug": "nestl-pro-plan-sensitive-skin-stomach-adult-dog-food-lamb-oat-meal-for",
  "brand": "Nestlé",
  "name": "Pro Plan Sensitive Skin & Stomach Adult Dog Food Lamb & Oat Meal Formula",
  "score": 21,
  "format": "Kibble",
  "ingredients": [
   "lamb",
   "oat meal",
   "barley",
   "fish meal (source of glucosamine)",
   "canola meal",
   "rice",
   "beef fat preserved with mixed-tocopherols",
   "dried egg product",
   "pea protein",
   "dried yeast",
   "natural flavor",
   "fish oil",
   "sunflowe oil",
   "chicory root inulin",
   "salt",
   "l-lysine monohydrochloride potassium chlorìde",
   "calcium carbonate",
   "vitámins [vitamin e supplement",
   "niacin (vitamin b-3)",
   "vitamin a supplement",
   "calcium pantothenate (vitamin b-5)",
   "supplement",
   "riboflavin supplement (vitamin b-2). pyridoxine hydrochloride (vitamin b-6)",
   "folic acid (vitamin b-9)",
   "sulfate",
   "copper sulfate",
   "calcium iodate",
   "sodium selenite. driine chloride",
   "l-ascorbyl-2-polyphosphate (vitamin c)."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "natural flavor (mild) — ingredient #11 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "riboflavin supplement (vitamin b-2). pyridoxine hydrochloride (vitamin b-6) (mild) — ingredient #23 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "riboflavin supplement (vitamin b-2). pyridoxine hydrochloride (vitamin b-6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "sodium selenite. driine chloride",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "purina-beggin-thick-cut-hickory-smoke-flavor",
  "brand": "Purina",
  "name": "Beggin' Thick Cut Hickory Smoke Flavor",
  "score": 20,
  "format": "Kibble",
  "ingredients": [
   "Pork",
   "barley",
   "rice",
   "ground wheat",
   "oat meal",
   "soybean",
   "meal",
   "glycerin",
   "sugar",
   "corn gluten meal",
   "ground yellow corn",
   "wheat",
   "flour",
   "water",
   "soy flour",
   "bacon",
   "soy protein concentrate",
   "wheat gluten",
   "salt",
   "phosphoric acid",
   "bacon fat (preserved with BHA and citric acid)",
   "natural flavor",
   "sorbic acid (a preservative)",
   "natural hickory smoke",
   "flavor",
   "calcium propionate (a preservative)",
   "added color",
   "malted",
   "barley flour"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "ground wheat (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "soybean (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "sugar (moderate) — ingredient #9",
    "value": -7,
    "severity": "moderate"
   },
   {
    "label": "corn gluten meal (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "soy protein concentrate (mild) — ingredient #17 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "wheat gluten (mild) — ingredient #18 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "bacon fat (preserved with BHA and citric acid) (severe) — ingredient #21 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "natural flavor (mild) — ingredient #22 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "calcium propionate (a preservative) (mild) — ingredient #26 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   }
  ],
  "flagged": [
   {
    "name": "ground wheat",
    "severity": "mild",
    "reason": "⚪ Mechanistic / formulation signal: ground wheat is an inexpensive carbohydrate that supplies bulk calories and helps kibble hold together during extrusion. Dogs have no carbohydrate requirement (see the carbohydrate section), and wheat is among the more common grain allergens, though far less common than chicken or beef. It isn't harmful to most dogs — it's a cost and filler question, and a reason to check where the protein is actually coming from."
   },
   {
    "name": "soybean",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "sugar",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   },
   {
    "name": "corn gluten meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "soy protein concentrate",
    "severity": "mild",
    "reason": "⚪ Formulation signal: isolated plant protein used to inflate the crude protein figure without meat. Lower in the amino acids dogs need most, and a common allergen. Matters most in the top five ingredients."
   },
   {
    "name": "wheat gluten",
    "severity": "mild",
    "reason": "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten."
   },
   {
    "name": "bacon fat (preserved with BHA and citric acid)",
    "severity": "severe",
    "reason": "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term."
   },
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "calcium propionate (a preservative)",
    "severity": "mild",
    "reason": "The behavioural claim traces to two places, and both need their caveats stated. FIRST, MacFabe's rat work: propionic acid produced repetitive behaviour, hyperactivity, impaired social interaction and seizure activity within minutes — but it was delivered by INTRACEREBROVENTRICULAR INJECTION, straight into the fluid around the brain. That is a model of what propionate does to a brain, not evidence about what eating it does. Anyone citing those rats as a reason to avoid a preservative in food has skipped the most important line of the methods. SECOND, Dengate & Ruben (Journal of Paediatrics and Child Health, 2002): 27 children in a double-blind placebo-controlled crossover, fed four slices of bread daily for three days. Fourteen showed worse irritability, restlessness, inattention and sleep disturbance on the preservative. That is a genuine controlled trial — but small, and the children were pre-selected as responders to an elimination diet, so it describes a sensitive subgroup rather than the general population. THIRD, and most relevant here: there is no canine data at all. Our position: a low-concern preservative that a good food doesn't need, flagged for that reason rather than because harm to dogs has been shown. It hasn't been studied."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "blue-wilderness-salmon-with-wholesome-grains-recipe",
  "brand": "blue wilderness",
  "name": "™ Salmon with Wholesome Grains Recipe",
  "score": 18,
  "format": "Kibble",
  "ingredients": [
   "Salmon\nChicken Meal\nDried Chicken\nOatmeal\nBarley\nPea Protein\nPeas\nChicken Fat (preserved with Mixed Tocopherols)\nNatural Flavor\nDried Tomato Pomace\nFlaxseed (source of Omega 3 and 6 Fatty Acids)\nDried Yeast\nPotatoes\nDried Egg Product\nFish Oil (source of ARA-Arachidonic Acid and DHA-Docosahexaenoic Acid)\nBrown Rice\nSalt\nCalcium Carbonate\nDirect Dehydrated Alfalfa Pellets\nDicalcium Phosphate\nDL-Methionine\nL-Threonine\nPotassium Citrate\nDried Chicory Root\nCholine Chloride\nAlfalfa Nutrient Concentrate\nVitamin E Supplement\npreserved with Mixed Tocopherols\nDried Sweet Potatoes\nCarrots\nZinc Amino Acid Chelate\nZinc Sulfate\nVegetable Juice for color\nFerrous Sulfate\nTaurine\nIron Amino Acid Chelate\nBlueberries\nCranberries\nBarley Grass\nParsley\nTurmeric\nDried Kelp\nYucca Schidigera Extract\nCopper Sulfate\nNiacin (Vitamin B3)\nCalcium Pantothenate (Vitamin B5)\nL-Ascorbyl-2-Polyphosphate (Vitamin C)\nL-Lysine\nBiotin (Vitamin B7)\nVitamin A Supplement\nCopper Amino Acid Chelate\nManganese Sulfate\nManganese Amino Acid Chelate\nThiamine Mononitrate (Vitamin B1)\nRiboflavin (Vitamin B2)\nVitamin D3 Supplement\nVitamin B12 Supplement\nPyridoxine Hydrochloride (Vitamin B6)\nCalcium Iodate\nDried Enterococcus faecium fermentation product\nDried Lactobacillus acidophilus fermentation product\nDried Aspergillus niger fermentation extract\nDried Trichoderma longibrachiatum fermentation extract\nDried Bacillus subtilis fermentation extract\nFolic Acid (Vitamin B9)\nSodium Selenite\nOil of Rosemary"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "High synthetic vitamin/mineral load (1 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Est. ~40% carbohydrate — a carb is the #1 ingredient",
    "value": -16
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Salmon\nChicken Meal\nDried Chicken\nOatmeal\nBarley\nPea Protein\nPeas\nChicken Fat (preserved with Mixed Tocopherols)\nNatural Flavor\nDried Tomato Pomace\nFlaxseed (source of Omega 3 and 6 Fatty Acids)\nDried Yeast\nPotatoes\nDried Egg Product\nFish Oil (source of ARA-Arachidonic Acid and DHA-Docosahexaenoic Acid)\nBrown Rice\nSalt\nCalcium Carbonate\nDirect Dehydrated Alfalfa Pellets\nDicalcium Phosphate\nDL-Methionine\nL-Threonine\nPotassium Citrate\nDried Chicory Root\nCholine Chloride\nAlfalfa Nutrient Concentrate\nVitamin E Supplement\npreserved with Mixed Tocopherols\nDried Sweet Potatoes\nCarrots\nZinc Amino Acid Chelate\nZinc Sulfate\nVegetable Juice for color\nFerrous Sulfate\nTaurine\nIron Amino Acid Chelate\nBlueberries\nCranberries\nBarley Grass\nParsley\nTurmeric\nDried Kelp\nYucca Schidigera Extract\nCopper Sulfate\nNiacin (Vitamin B3)\nCalcium Pantothenate (Vitamin B5)\nL-Ascorbyl-2-Polyphosphate (Vitamin C)\nL-Lysine\nBiotin (Vitamin B7)\nVitamin A Supplement\nCopper Amino Acid Chelate\nManganese Sulfate\nManganese Amino Acid Chelate\nThiamine Mononitrate (Vitamin B1)\nRiboflavin (Vitamin B2)\nVitamin D3 Supplement\nVitamin B12 Supplement\nPyridoxine Hydrochloride (Vitamin B6)\nCalcium Iodate\nDried Enterococcus faecium fermentation product\nDried Lactobacillus acidophilus fermentation product\nDried Aspergillus niger fermentation extract\nDried Trichoderma longibrachiatum fermentation extract\nDried Bacillus subtilis fermentation extract\nFolic Acid (Vitamin B9)\nSodium Selenite\nOil of Rosemary",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [],
  "produce": [
   "Salmon\nChicken Meal\nDried Chicken\nOatmeal\nBarley\nPea Protein\nPeas\nChicken Fat (preserved with Mixed Tocopherols)\nNatural Flavor\nDried Tomato Pomace\nFlaxseed (source of Omega 3 and 6 Fatty Acids)\nDried Yeast\nPotatoes\nDried Egg Product\nFish Oil (source of ARA-Arachidonic Acid and DHA-Docosahexaenoic Acid)\nBrown Rice\nSalt\nCalcium Carbonate\nDirect Dehydrated Alfalfa Pellets\nDicalcium Phosphate\nDL-Methionine\nL-Threonine\nPotassium Citrate\nDried Chicory Root\nCholine Chloride\nAlfalfa Nutrient Concentrate\nVitamin E Supplement\npreserved with Mixed Tocopherols\nDried Sweet Potatoes\nCarrots\nZinc Amino Acid Chelate\nZinc Sulfate\nVegetable Juice for color\nFerrous Sulfate\nTaurine\nIron Amino Acid Chelate\nBlueberries\nCranberries\nBarley Grass\nParsley\nTurmeric\nDried Kelp\nYucca Schidigera Extract\nCopper Sulfate\nNiacin (Vitamin B3)\nCalcium Pantothenate (Vitamin B5)\nL-Ascorbyl-2-Polyphosphate (Vitamin C)\nL-Lysine\nBiotin (Vitamin B7)\nVitamin A Supplement\nCopper Amino Acid Chelate\nManganese Sulfate\nManganese Amino Acid Chelate\nThiamine Mononitrate (Vitamin B1)\nRiboflavin (Vitamin B2)\nVitamin D3 Supplement\nVitamin B12 Supplement\nPyridoxine Hydrochloride (Vitamin B6)\nCalcium Iodate\nDried Enterococcus faecium fermentation product\nDried Lactobacillus acidophilus fermentation product\nDried Aspergillus niger fermentation extract\nDried Trichoderma longibrachiatum fermentation extract\nDried Bacillus subtilis fermentation extract\nFolic Acid (Vitamin B9)\nSodium Selenite\nOil of Rosemary"
  ]
 },
 {
  "slug": "purina-pro-plan-adult-sensitive-skin-stomach-salmon-rice-formula-dry-d",
  "brand": "purina",
  "name": "Pro Plan Adult Sensitive Skin & Stomach Salmon & Rice Formula Dry Dog Food, 40-lb bag",
  "score": 16,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "Rice",
   "Barley",
   "Canola Meal",
   "Oat Meal",
   "Fish Meal",
   "Salmon Meal",
   "Beef Fat Preserved With Mixed-Tocopherols",
   "Dried Yeast",
   "Natural Flavor",
   "Sunflower Oil",
   "Fish Oil",
   "Dried Chicory Root",
   "Calcium Carbonate",
   "Salt",
   "Potassium Chloride",
   "L-Lysine Monohydrochloride",
   "VITAMINS [Vitamin E Supplement",
   "Niacin (Vitamin B-3)",
   "Vitamin A Supplement",
   "Calcium Pantothenate (Vitamin B-5)",
   "Thiamine Mononitrate (Vitamin B-1)",
   "Vitamin B-12 Supplement",
   "Riboflavin Supplement (Vitamin B-2)",
   "Pyridoxine Hydrochloride",
   "Folic Acid (Vitamin B-9)",
   "Menadione Sodium Bisulfite Complex (Vitamin K)",
   "Biotin (Vitamin B-7)",
   "Vitamin D-3 Supplement]",
   "Taurine",
   "MINERALS [Zinc Sulfate",
   "Ferrous Sulfate",
   "Manganese Sulfate",
   "Copper Sulfate",
   "Calcium Iodate",
   "Sodium Selenite]",
   "Dl-Methionine",
   "Choline Chloride",
   "L-Ascorbyl-2-Polyphosphate (Vitamin C). M444922"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Natural Flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Natural Flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Pyridoxine Hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Menadione Sodium Bisulfite Complex (Vitamin K)",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   },
   {
    "name": "MINERALS [Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite]",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Dl-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "bil-jac-picky-no-more-medium-large-breed-dog-food",
  "brand": "Bil-Jac",
  "name": "Picky No More Medium & Large Breed Dog Food",
  "score": 13,
  "format": "Unknown – set manually below",
  "ingredients": [
   "Chicken",
   "Chicken By-products (Source Of Leucine And Arginine)",
   "Corn Meal",
   "Chicken By-product Meal (Source Of Glucosamine And Chondroitin Sulfate)",
   "Dried Beet Pulp",
   "Chicken Liver",
   "Oatmeal",
   "Brewers Dried Yeast",
   "Flaxseed",
   "Choline Chloride",
   "Dl-methionine",
   "Sodium Propionate (A Preservative)",
   "L-lysine",
   "Monocalcium Phosphate",
   "Vitamin E Supplement",
   "Calcium Carbonate",
   "L-ascorbyl-2-polyphosphate (Source Of Vitamin C)",
   "Zinc Proteinate",
   "Zinc Oxide",
   "Copper Proteinate",
   "Dried Lactobacillus Acidophilus Fermentation Product",
   "Dried Lactobacillus Casei Fermentation Product",
   "Dried Bifidobacterium Animalis Fermentation Product",
   "Vitamin A Acetate",
   "Copper Sulfate",
   "Inositol",
   "Niacin Supplement",
   "Biotin",
   "Sodium Selenite",
   "D-calcium Pantothenate",
   "Manganese Proteinate",
   "Riboflavin Supplement",
   "Thiamine Mononitrate",
   "Vitamin B12 Supplement",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Manganous Oxide",
   "Cobalt Carbonate",
   "Mixed Tocopherols And Bha (Preservatives)",
   "Vitamin D3 Supplement",
   "Potassium Iodide",
   "Folic Acid",
   "Rosemary Extract",
   "Green Tea Extract",
   "Spearmint Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken By-products (Source Of Leucine And Arginine) (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Chicken By-product Meal (Source Of Glucosamine And Chondroitin Sulfate) (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #35 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Mixed Tocopherols And Bha (Preservatives) (severe) — ingredient #38 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #39 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Est. ~22% carbohydrate — multiple carb sources",
    "value": -2
   },
   {
    "label": "Organ meats (1) — nutrient-dense whole food proteins",
    "value": 5
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Chicken By-products (Source Of Leucine And Arginine)",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Chicken By-product Meal (Source Of Glucosamine And Chondroitin Sulfate)",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Dl-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Oxide",
    "severity": "moderate",
    "reason": "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Sodium Selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Mixed Tocopherols And Bha (Preservatives)",
    "severity": "severe",
    "reason": "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [
   "Chicken Liver"
  ],
  "produce": [
   "Dried Beet Pulp"
  ]
 },
 {
  "slug": "wholesome-beef-meal-rice-recipe",
  "brand": "Wholesome",
  "name": "Beef Meal & Rice Recipe",
  "score": 13,
  "format": "Kibble",
  "ingredients": [
   "Beef Meal",
   "Rice",
   "Peas",
   "Pea Protein",
   "Chicken Fat (Preserved with Mixed Tocopherols)",
   "Pea Starch",
   "Dried Beet Pulp",
   "Flaxseed",
   "Salt",
   "Potassium Chloride",
   "Choline Chloride",
   "DL-Methionine",
   "Dicalcium Phosphate",
   "Vitamins (Vitamin E Supplement, Niacin, Calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Thiamine Mononitrate, Pyridoxine Hydrochloride, Biotin, Vitamin B12 Supplement, Vitamin D3 Supplement, Folic Acid)",
   "Minerals (Zinc Sulfate, Ferrous Sulfate, Copper Sulfate, Manganese Sulfate, Zinc Proteinate, Copper Proteinate, Manganese Proteinate, Sodium Selenite, Calcium Iodate, Cobalt Carbonate)",
   "Rosemary Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Vitamins (Vitamin E Supplement, Niacin, Calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Thiamine Mononitrate, Pyridoxine Hydrochloride, Biotin, Vitamin B12 Supplement, Vitamin D3 Supplement, Folic Acid) (mild) — ingredient #14 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Legumes further down the label (1) — DCM link",
    "value": -3
   },
   {
    "label": "Est. ~30% carbohydrate — a carb is a primary ingredient",
    "value": -8
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Vitamins (Vitamin E Supplement, Niacin, Calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Thiamine Mononitrate, Pyridoxine Hydrochloride, Biotin, Vitamin B12 Supplement, Vitamin D3 Supplement, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Zinc Sulfate, Ferrous Sulfate, Copper Sulfate, Manganese Sulfate, Zinc Proteinate, Copper Proteinate, Manganese Proteinate, Sodium Selenite, Calcium Iodate, Cobalt Carbonate)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Beet Pulp"
  ]
 },
 {
  "slug": "pup-peroni-pup-peroni",
  "brand": "Pup-Peroni",
  "name": "Pup-Peroni",
  "score": 12,
  "format": "Kibble",
  "ingredients": [
   "Beef",
   "Soy Grits",
   "Beef Lung",
   "Sugar",
   "Beef Liver",
   "Salt",
   "Vegetable Glycerin",
   "Natural Flavors",
   "Propylene Glycol",
   "Potassium Sorbate (Used As A Preservative)",
   "Added Color",
   "Citric Acid (Used As A Preservative)",
   "BHA (Used As A Preservative)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Sugar (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Propylene Glycol (toxic) — ingredient #9",
    "value": -28,
    "severity": "toxic"
   },
   {
    "label": "Potassium Sorbate (Used As A Preservative) (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "BHA (Used As A Preservative) (severe) — ingredient #13 (trace amount)",
    "value": -7,
    "severity": "severe"
   },
   {
    "label": "Salt is ingredient #6 — little real food below it",
    "value": -4
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   },
   {
    "label": "Whole food nutrition — no synthetic vitamins",
    "value": 8
   },
   {
    "label": "Organ meats (2) — nutrient-dense whole food proteins",
    "value": 10
   }
  ],
  "flagged": [
   {
    "name": "Sugar",
    "severity": "moderate",
    "reason": "⚪ Mechanistic, not trial-based: dogs have no dietary requirement for added sugar. It's included for palatability, and the concerns are the general ones — calories without nutrition, contribution to obesity and dental disease, and feeding oral and gut yeast populations. There are no controlled canine trials on added sugar in commercial food specifically; this is reasoning from established physiology. The clearer signal is what it says about the formulation: sweetening is how you make a food palatable when the ingredients alone won't do it."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Propylene Glycol",
    "severity": "toxic",
    "reason": "Propylene glycol is banned by the FDA for use in cat food due to its association with Heinz body anemia in cats. While permitted in dog food at low levels, many veterinary nutritionists recommend avoiding it entirely"
   },
   {
    "name": "Potassium Sorbate (Used As A Preservative)",
    "severity": "mild",
    "reason": "The in vitro evidence is real and specific. Mamur et al. (Toxicology in Vitro, 2010) exposed human lymphocytes to potassium sorbate and found significant chromosomal aberrations at 500-1000 µg/ml, elevated sister-chromatid exchanges from 125 µg/ml, and DNA strand breaks at every concentration tested. ⚖️ But the in vivo picture does not follow it. EFSA's 2015 re-evaluation reviewed exactly these findings, concluded that live-animal studies did NOT confirm genotoxicity at realistic exposure, and maintained an acceptable daily intake of 3 mg/kg body weight. The concentrations used in those cell studies are in the 0.5-2 mM range, which dietary intake doesn't reach — potassium sorbate is metabolised much like a fatty acid. There is one more specific concern worth knowing: potassium sorbate reacting with ASCORBIC ACID in the presence of an IRON salt produces mutagenic decomposition products. Pet foods routinely contain all three. That interaction is a better reason for caution than the raw cell data. Our position: a preference against, not a demonstrated harm — and stronger where vitamin C and an iron source appear on the same label."
   },
   {
    "name": "BHA (Used As A Preservative)",
    "severity": "severe",
    "reason": "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term."
   }
  ],
  "organs": [
   "Beef Lung",
   "Beef Liver"
  ],
  "produce": []
 },
 {
  "slug": "iams-minichunks-chicken-whole-grain-recipe",
  "brand": "Iams",
  "name": "Minichunks Chicken & Whole Grain Recipe",
  "score": 11,
  "format": "Kibble",
  "ingredients": [
   "Chicken.",
   "Ground Whole Grain Corn",
   "Ground Whole Grain Sorghum.",
   "Chicken By-Product Meal",
   "Soybean Meal",
   "Dried Plain Beet Pulp",
   "Natural Flavors",
   "Chicken Fat (preserved with Mixed Tocopherols)",
   "Dried Egg Product",
   "Flaxseed",
   "Caramel Color",
   "Carrots",
   "Potassium Chloride",
   "Fructooligosaccharides",
   "Choline Chloride",
   "Vitamins (Vitamin E Supplement",
   "Ascorbic Acid",
   "D-Calcium Pantothenate",
   "Biotin",
   "Thiamine Mononitrate (Vitamin B1)",
   "Vitamin B12 Supplement",
   "Vitamin A Supplement",
   "Niacin",
   "Riboflavin Supplement (Vitamin B2)",
   "Pyridoxine Hydrochloride (Vitamin B6), Vitamin D3 Supplement, Folic Acid)",
   "Minerals (Ferrous Sulfate, Zinc Oxide, Sodium Selenite, Manganese Sulfate, Copper Sulfate, Potassium Iodide, Manganous Oxide)",
   "Citric Acid (preservative)",
   "Mixed Tocopherols (preservative)",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken By-Product Meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Soybean Meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Caramel Color (moderate) — ingredient #11 (trace amount)",
    "value": -4,
    "severity": "moderate"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6), Vitamin D3 Supplement, Folic Acid) (mild) — ingredient #25 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (3 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (2)",
    "value": 4
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Chicken By-Product Meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Soybean Meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Caramel Color",
    "severity": "moderate",
    "reason": "Certain types of caramel color produced using ammonia processes may contain 4-methylimidazole (4-MEI), a compound that some research has associated with potential carcinogenic activity"
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6), Vitamin D3 Supplement, Folic Acid)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "Minerals (Ferrous Sulfate, Zinc Oxide, Sodium Selenite, Manganese Sulfate, Copper Sulfate, Potassium Iodide, Manganous Oxide)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   }
  ],
  "organs": [],
  "produce": [
   "Dried Plain Beet Pulp",
   "Carrots"
  ]
 },
 {
  "slug": "royal-canin-weight-care",
  "brand": "Royal Canin",
  "name": "Weight Care",
  "score": 9,
  "format": "Kibble",
  "ingredients": [
   "Chicken meal",
   "pea fiber",
   "wheat gluten",
   "corn",
   "corn gluten meal",
   "natural flavors",
   "brewers rice flour",
   "wheat",
   "brewers rice",
   "chicken fat",
   "dried plain beet pulp",
   "calcium sulfate",
   "salt",
   "fish oil",
   "potassium chloride",
   "choline chloride",
   "sodium pyrophosphate",
   "powdered psyllium seed husk",
   "vegetable oil",
   "monocalcium phosphate",
   "vitamins [DL-alpha tocopherol acetate (source of vitamin E)",
   "L-ascorbyl-2-polyphosphate (source of vitamin C)",
   "niacin supplement",
   "biotin",
   "riboflavin supplement",
   "D-calcium pantothenate",
   "pyridoxine hydrochloride (vitamin B6)",
   "vitamin A acetate",
   "thiamine mononitrate (vitamin B1)",
   "vitamin B12 supplement",
   "folic acid",
   "vitamin D3 supplement]",
   "taurine",
   "trace minerals [zinc proteinate",
   "zinc oxide",
   "ferrous sulfate",
   "manganese proteinate",
   "manganous oxide",
   "copper sulfate",
   "sodium selenite",
   "calcium iodate",
   "copper proteinate]",
   "L-carnitine",
   "rosemary extract",
   "preserved with mixed tocopherols and citric acid."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "wheat gluten (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "corn gluten meal (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "natural flavors (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vegetable oil (mild) — ingredient #19 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (vitamin B6) (mild) — ingredient #27 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamin D3 supplement] (mild) — ingredient #32 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Legumes in top 3 ingredients (1) — DCM link",
    "value": -15
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   }
  ],
  "flagged": [
   {
    "name": "wheat gluten",
    "severity": "mild",
    "reason": "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten."
   },
   {
    "name": "corn gluten meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "natural flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "vegetable oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting."
   },
   {
    "name": "vitamins [DL-alpha tocopherol acetate (source of vitamin E)",
    "severity": "mild",
    "reason": "The 'dl-' prefix is the tell: this is synthetic vitamin E. Natural vitamin E (d-alpha, or RRR-alpha-tocopherol) is a single stereoisomer that matches the alpha-tocopherol transport protein in the liver. Synthetic dl-alpha-tocopherol is a mixture of eight isomers, only about 12.5% of which is that RRR form. The conversion used in nutrition — 1 mg natural equals roughly 2 mg synthetic — reflects roughly double the bioavailability and tissue retention for the natural form. Not harmful, simply a weaker version of the same nutrient. 'Mixed tocopherols' on a label indicates the better one, and is also a natural preservative."
   },
   {
    "name": "pyridoxine hydrochloride (vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "vitamin D3 supplement]",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "zinc oxide",
    "severity": "moderate",
    "reason": "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading."
   },
   {
    "name": "ferrous sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": [
   "dried plain beet pulp"
  ]
 },
 {
  "slug": "taste-of-the-wild-southwest-canyon-canine-recipe",
  "brand": "Taste of the Wild",
  "name": "Southwest Canyon Canine Recipe",
  "score": 9,
  "format": "Kibble",
  "ingredients": [
   "Beef",
   "peas",
   "garbanzo beans",
   "lamb meal",
   "canola oil",
   "egg product",
   "wild boar",
   "ocean fish meal",
   "pea flour",
   "dried yeast",
   "tomato pomice",
   "flaxseed",
   "natural flavor",
   "salmon oil (a natural source of DHA)",
   "salt",
   "choline chloride",
   "taurine",
   "dried chicory root",
   "tomatoes",
   "blueberries",
   "raspberries",
   "yucca schidigera extract",
   "dried Lactobacillus  plantarum fermentation product",
   "dried Bacillus subtillus fermentation product",
   "dried Lactobacillus acidophilus fermentation product",
   "dried Enterococcus faecium fermentation product",
   "dried Bifidobacterium animalus fermentation product",
   "vitamin E supplement",
   "iron proteinate",
   "zinc proteinate",
   "copper iodide",
   "thiamine mononitrate (vitamin B1)",
   "manganese protienate",
   "manganous oxide",
   "ascorbic acid",
   "vitamin A supplement",
   "biotin",
   "niacin",
   "calcium pantothenate",
   "manganese sulfate",
   "sodium selenite",
   "pyridoxine hydrochloride (vitamin B6)",
   "vitamin B12 supplement",
   "riboflavin (vitamin B2)",
   "vitamin D supplement",
   "folic acid.  Contains a source of live",
   "naturally occurring microorganisms."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "canola oil (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "natural flavor (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (vitamin B6) (mild) — ingredient #42 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (4 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes in top 3 ingredients (2) — DCM link",
    "value": -30
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Anti-inflammatory ingredients (2) — turmeric, fish oil, kelp, etc.",
    "value": 6
   }
  ],
  "flagged": [
   {
    "name": "canola oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "manganese sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "pyridoxine hydrochloride (vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "4health-salmon-potato-formula-food-for-adult-dogs",
  "brand": "4health",
  "name": "Salmon & Potato Formula Food For Adult Dogs",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "Salmon",
   "fish meal",
   "potatoes",
   "peas",
   "cracked pearled barley",
   "pea flour",
   "egg product",
   "canola oil (preserved with mixed tocopherols)",
   "dried tomato pomace",
   "natural flavor",
   "flaxseed",
   "salt",
   "DL-Methionine",
   "choline chloride",
   "taurine",
   "dried chicory root",
   "glucosamine hydrochloride",
   "dried kelp",
   "carrots",
   "apples",
   "tomatoes",
   "blueberries",
   "spinach",
   "cranberries",
   "rosemary extract",
   "parsley flake",
   "yucca schidigera extract",
   "L-Carnitine",
   "chondroitin sulfate",
   "dried Lactobacillus plantarum fermentation product",
   "dried Bacillus subtilis fermentation product",
   "dried Lactobacillus acidophilus fermentation product",
   "dried Enterococcus faecium fermentation product",
   "dried Bifidobacterium animalis fermentation product",
   "vitamin E supplement",
   "iron proteinate",
   "zinc proteinate",
   "copper proteinate",
   "ferrous sulfate",
   "zinc sulfate",
   "manganese sulfate",
   "copper sulfate",
   "potassium iodide",
   "thiamine mononitrate",
   "manganese proteinate",
   "ascorbic acid",
   "vitamin A supplement",
   "biotin",
   "niacin",
   "calcium pantothenate",
   "sodium selenite",
   "pyridoxine hydrochloride",
   "vitamin B12 supplement",
   "riboflavin",
   "vitamin D3 supplement",
   "folic acid"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "canola oil (preserved with mixed tocopherols) (mild) — ingredient #8",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "natural flavor (mild) — ingredient #10",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (mild) — ingredient #52 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamin D3 supplement (mild) — ingredient #55 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Legumes in top 5 ingredients (1) — DCM link",
    "value": -7
   },
   {
    "label": "Est. ~27% carbohydrate — multiple carb sources",
    "value": -6
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "canola oil (preserved with mixed tocopherols)",
    "severity": "mild",
    "reason": "⚪ Formulation signal: canola is a cheap plant oil used to hit the fat percentage. It carries far more omega-6 than omega-3, so it pushes the ratio in the wrong direction in a food that is usually already omega-6 heavy. It is typically solvent-extracted and usually from GMO crops. Not toxic — but it is fat that does nothing useful, where fish oil or named animal fat would."
   },
   {
    "name": "natural flavor",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "ferrous sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "zinc sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "manganese sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   },
   {
    "name": "pyridoxine hydrochloride",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "vitamin D3 supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "9lives-plus-care",
  "brand": "9Lives",
  "name": "Plus Care",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "WHOLE GROUND CORN",
   "CORN GLUTEN MEAL",
   "POULTRY BY-PRODUCT MEAL",
   "WHOLE WHEAT",
   "ANIMAL DIGEST",
   "MEAT AND BONE MEAL",
   "ANIMAL FAT (PRESERVED WITH MIXED TOCOPHEROLS)",
   "PHOSPHORIC ACID",
   "CALCIUM CARBONATE",
   "SALT",
   "POTASSIUM CHLORIDE",
   "CHOLINE CHLORIDE",
   "TITANIUM DIOXIDE",
   "TETRASODIUM PYROPHOSPHATE (SOURCE OF PHOSPHORUS)",
   "TUNA MEAL",
   "VITAMINS (VITAMIN E SUPPLEMENT",
   "NIACIN",
   "VITAMIN A SUPPLEMENT",
   "THIAMINE MONONITRATE RIBOFLAVIN SUPPLEMENT",
   "D-CALCIUM PANTOTHENATE",
   "PYRIDOXINE HYDROCHLORIDE",
   "VITAMIN B12 SUPPLEMENT",
   "MENADIONE SODIUM BISULFITE COMPLEX (SOURCE OF VITAMIN K ACTIVITY), VITAMIN D3 SUPPLEMENT, FOLIC ACID, BIOTIN)",
   "TAURINE",
   "L-LYSINE",
   "MINERALS (FERROUS SULFATE, ZINC OXIDE, MANGANOUS OXIDE, COPPER SULFATE, CALCIUM IODATE, SODIUM SELENITE)",
   "EGG PRODUCT",
   "DL-METHIONINE",
   "YELLOW 5",
   "BHA (USED AS A PRESERVATIVE)",
   "RED 40",
   "YELLOW 6",
   "LACTIC ACID",
   "NATURAL AND ARTIFICIAL FLAVOR (SOURCE OF GRILLED FLAVOR)",
   "BLUE 1",
   "ROSEMARY EXTRACT"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "WHOLE GROUND CORN (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "CORN GLUTEN MEAL (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "POULTRY BY-PRODUCT MEAL (moderate)",
    "value": -10,
    "severity": "moderate"
   },
   {
    "label": "ANIMAL DIGEST (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "MEAT AND BONE MEAL (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "ANIMAL FAT (PRESERVED WITH MIXED TOCOPHEROLS) (severe) — ingredient #7",
    "value": -12,
    "severity": "severe"
   },
   {
    "label": "PYRIDOXINE HYDROCHLORIDE (mild) — ingredient #21 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "YELLOW 5 (severe) — ingredient #29 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "BHA (USED AS A PRESERVATIVE) (severe) — ingredient #30 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "RED 40 (severe) — ingredient #31 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "YELLOW 6 (severe) — ingredient #32 (trace amount)",
    "value": -4,
    "severity": "severe"
   },
   {
    "label": "NATURAL AND ARTIFICIAL FLAVOR (SOURCE OF GRILLED FLAVOR) (moderate) — ingredient #34 (trace amount)",
    "value": -2,
    "severity": "moderate"
   },
   {
    "label": "High synthetic vitamin/mineral load (5 added) — over-fortified formula",
    "value": -13
   },
   {
    "label": "Est. ~48% carbohydrate — a carb is the #1 ingredient",
    "value": -22
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   }
  ],
  "flagged": [
   {
    "name": "WHOLE GROUND CORN",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard: ground corn is an inexpensive source of bulk calories and starch, which extrusion physically requires to form a kibble. We're not going to repeat the common claim that it's poorly digested — cooked, ground corn is actually digested well by dogs, and saying otherwise would be wrong. The honest criticism is what it displaces: every percentage point of corn is a point not coming from meat. Judge it on that, and on where it sits in the ingredient list."
   },
   {
    "name": "CORN GLUTEN MEAL",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "POULTRY BY-PRODUCT MEAL",
    "severity": "moderate",
    "reason": "AAFCO defines poultry by-products as non-rendered clean parts such as heads, feet, and viscera. The absence of a named species and variable content makes quality and sourcing difficult for consumers to assess"
   },
   {
    "name": "ANIMAL DIGEST",
    "severity": "severe",
    "reason": "Animal digest is produced by chemical or enzymatic hydrolysis of animal tissue. AAFCO does not require species identification, making the source and quality of this ingredient impossible for consumers to verify"
   },
   {
    "name": "MEAT AND BONE MEAL",
    "severity": "mild",
    "reason": "⚪ Mechanistic / sourcing signal: bone meal supplies calcium and phosphorus, and in that sense it works. The concerns are about origin: it's rendered from unnamed animal sources, so species and quality are undisclosed, and bone is where heavy metals such as lead concentrate in an animal's body. Raw meaty bone or whole ground bone in a fresh food is preferable and traceable. Not a hazard at label levels — a transparency and quality question."
   },
   {
    "name": "ANIMAL FAT (PRESERVED WITH MIXED TOCOPHEROLS)",
    "severity": "severe",
    "reason": "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it."
   },
   {
    "name": "PYRIDOXINE HYDROCHLORIDE",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "MENADIONE SODIUM BISULFITE COMPLEX (SOURCE OF VITAMIN K ACTIVITY), VITAMIN D3 SUPPLEMENT, FOLIC ACID, BIOTIN)",
    "severity": "moderate",
    "reason": "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. AAFCO does recognise menadione sodium bisulfite complex as a vitamin K source while noting that natural forms are preferred where available — which is roughly where the evidence sits. It's also worth knowing dogs synthesise vitamin K in the gut, so supplementation is rarely necessary in the first place; its presence often says more about the formulation being cheap than about the dog needing K. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't."
   },
   {
    "name": "MINERALS (FERROUS SULFATE, ZINC OXIDE, MANGANOUS OXIDE, COPPER SULFATE, CALCIUM IODATE, SODIUM SELENITE)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "DL-METHIONINE",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "YELLOW 5",
    "severity": "severe",
    "reason": "Yellow 5 (tartrazine) is a synthetic azo dye linked to hypersensitivity reactions, behavioral changes, and potential carcinogenic activity in animal research. The CSPI has flagged it as a dye of concern. It is banned or restricted in several countries and serves no nutritional purpose in pet food whatsoever."
   },
   {
    "name": "BHA (USED AS A PRESERVATIVE)",
    "severity": "severe",
    "reason": "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term."
   },
   {
    "name": "RED 40",
    "severity": "severe",
    "reason": "Red 40 is a petroleum-derived synthetic dye classified as a possible carcinogen. The Center for Science in the Public Interest has petitioned the FDA to ban it. It has been linked to hypersensitivity, behavioral changes, and tumor promotion in animal studies. There is zero nutritional justification for its use in dog food — it exists purely for human visual appeal."
   },
   {
    "name": "YELLOW 6",
    "severity": "severe",
    "reason": "Yellow 6 is a synthetic petroleum-derived dye linked to adrenal gland and kidney tumors in animal studies. The CSPI considers it unsafe. Like all artificial dyes in pet food, it serves zero nutritional purpose — dogs are colorblind to red/orange and cannot distinguish it. Its only function is to make kibble look more appealing to humans."
   },
   {
    "name": "NATURAL AND ARTIFICIAL FLAVOR (SOURCE OF GRILLED FLAVOR)",
    "severity": "moderate",
    "reason": "⚪ By definition undisclosed: 'artificial flavor' is a category, not an ingredient, and manufacturers aren't required to say what's in it. There's no evidence that flavourings at label levels harm dogs, and this is not flagged as toxic. It is flagged because it's unknowable — you cannot assess or avoid what isn't named — and because a food needing engineered flavour is telling you the ingredients alone weren't palatable."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "hill-s-pet-nutrition-hill-s-science-diet-dry-dog-food-adult-sensitive-",
  "brand": "Hill's Pet Nutrition",
  "name": "Hill's Science Diet Dry Dog Food, Adult, Sensitive Stomach & Skin Recipes, 4 LB (B015EE4D0Y)",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "Chicken meal",
   "corn meal",
   "ground whole grain wheat",
   "ground whole grain corn",
   "chicken by-products meal",
   "animal fat preserved with mixed tocopherols",
   "soybean meal",
   "fish meal",
   "potassium chloride",
   "iodized salt",
   "choline chloride",
   "vitamins (vitamin E supplement",
   "L-ascorbyl-2-polyphosphate (source of vitamin C), thiamine mononitrate, vitamin A acetate, d-calcium pantothenate, vitamin B12 supplement, riboflavin supplement, inositol, niacin supplement, pyridoxine hydrochloride, thiamine hydrochloride, folic acid, vitamin D3 supplement, biotin)",
   "minerals (ferrous sulfate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, cobalt carbonate, sodium selenite)",
   "fish oil",
   "BHA (preservative)",
   "rosemary extract (preservative)"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "chicken by-products meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "animal fat preserved with mixed tocopherols (severe) — ingredient #6",
    "value": -12,
    "severity": "severe"
   },
   {
    "label": "soybean meal (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "L-ascorbyl-2-polyphosphate (source of vitamin C), thiamine mononitrate, vitamin A acetate, d-calcium pantothenate, vitamin B12 supplement, riboflavin supplement, inositol, niacin supplement, pyridoxine hydrochloride, thiamine hydrochloride, folic acid, vitamin D3 supplement, biotin) (mild) — ingredient #13 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "BHA (preservative) (severe) — ingredient #16 (trace amount)",
    "value": -7,
    "severity": "severe"
   },
   {
    "label": "High synthetic vitamin/mineral load (2 added) — over-fortified formula",
    "value": -6
   },
   {
    "label": "Unidentified generic meal (1) — sourcing unknown",
    "value": -7
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~10:1 — kibble fats offset fish oil)",
    "value": -10
   }
  ],
  "flagged": [
   {
    "name": "chicken by-products meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "animal fat preserved with mixed tocopherols",
    "severity": "severe",
    "reason": "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it."
   },
   {
    "name": "soybean meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: soybean meal is concentrated plant protein used to raise the crude protein number on the guaranteed analysis without meat. The protein percentage on a label does not distinguish source, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs actually need. Soy is also a common allergen and usually a GMO, glyphosate-treated crop. Matters most in the top five."
   },
   {
    "name": "L-ascorbyl-2-polyphosphate (source of vitamin C), thiamine mononitrate, vitamin A acetate, d-calcium pantothenate, vitamin B12 supplement, riboflavin supplement, inositol, niacin supplement, pyridoxine hydrochloride, thiamine hydrochloride, folic acid, vitamin D3 supplement, biotin)",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "minerals (ferrous sulfate, zinc oxide, copper sulfate, manganous oxide, calcium iodate, cobalt carbonate, sodium selenite)",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "BHA (preservative)",
    "severity": "severe",
    "reason": "The National Toxicology Program conducted long-term feeding studies showing BHA caused squamous cell tumors in rats, mice, and hamsters at doses relevant to daily food consumption. The IARC classifies BHA as a Group 2B possible carcinogen, and California lists it under Prop 65. The concern is cumulative — daily pet food exposure is exactly the type of chronic, low-level intake these studies identified as most problematic long-term."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "royal-canin-dry-kibble-dog-food-for-poodle-puppies",
  "brand": "Royal Canin",
  "name": "Dry Kibble Dog Food for Poodle Puppies",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "Chicken by-product meal",
   "brewers rice",
   "wheat gluten",
   "chicken fat",
   "corn",
   "corn gluten meal",
   "wheat",
   "natural flavours",
   "dried plain beet pulp",
   "fish oil",
   "monocalcium phosphate",
   "vegetable oil",
   "sodium silico aluminate",
   "calcium sulfate",
   "potassium chloride",
   "psyllium seed husk",
   "calcium carbonate",
   "salt",
   "fructooligosaccharides",
   "sodium tripolyphosphate",
   "vitamins [DL-alpha tocopherol acetate (source of vitamin E)",
   "niacin supplement",
   "L-ascorbyl-2-phosphate (source of vitamin C)",
   "D-calcium pantothenate",
   "biotin",
   "pyridoxine hydrochloride (vitamin B6)",
   "riboflavin supplement",
   "thiamine mononitrate (vitamin B1)",
   "vitamin A acetate",
   "folic acid",
   "vitamin B12 supplement",
   "vitamin D3 supplement]",
   "hydrolyzed yeast (source of betaglucans)",
   "DL-methionine",
   "L-lysine",
   "choline chloride",
   "taurine",
   "cystine",
   "trace minerals [zinc proteinate",
   "zinc oxide",
   "manganese proteinate",
   "ferrous sulphate",
   "manganese oxide",
   "copper sulfate",
   "calcium iodate",
   "sodium selenite",
   "copper proteinate]",
   "marigold extract (Targets erect. L.)",
   "Yucca schidigera extract",
   "L-carnitine",
   "carotene",
   "rosemary extract",
   "preserved with mixed tocopherols and citric acid."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken by-product meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "wheat gluten (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "corn gluten meal (mild) — ingredient #6",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vegetable oil (mild) — ingredient #12 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "pyridoxine hydrochloride (vitamin B6) (mild) — ingredient #26 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "vitamin D3 supplement] (mild) — ingredient #32 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (7 added) — over-fortified formula",
    "value": -14
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "🔴 Poor omega ratio (est. ~12:1 — typical for kibble)",
    "value": -10
   },
   {
    "label": "Whole food fruits & vegetables (1)",
    "value": 2
   },
   {
    "label": "Anti-inflammatory ingredients (1) — turmeric, fish oil, kelp, etc.",
    "value": 3
   }
  ],
  "flagged": [
   {
    "name": "Chicken by-product meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "wheat gluten",
    "severity": "mild",
    "reason": "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten."
   },
   {
    "name": "corn gluten meal",
    "severity": "mild",
    "reason": "⚪ Formulation signal: corn gluten meal is a concentrated plant protein. It counts toward the crude protein figure on the guaranteed analysis without contributing meat — and since that figure doesn't distinguish sources, a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs use most. That's a labelling limitation, not a toxicity claim. No canine harm has been shown at label levels."
   },
   {
    "name": "vegetable oil",
    "severity": "mild",
    "reason": "⚪ Formulation signal: an unnamed plant oil. Like 'animal fat', the absence of a source means it can change batch to batch depending on commodity prices, and you cannot know the omega-6 to omega-3 ratio you are feeding. Named oils — salmon, sunflower, coconut — tell you what you are getting."
   },
   {
    "name": "vitamins [DL-alpha tocopherol acetate (source of vitamin E)",
    "severity": "mild",
    "reason": "The 'dl-' prefix is the tell: this is synthetic vitamin E. Natural vitamin E (d-alpha, or RRR-alpha-tocopherol) is a single stereoisomer that matches the alpha-tocopherol transport protein in the liver. Synthetic dl-alpha-tocopherol is a mixture of eight isomers, only about 12.5% of which is that RRR form. The conversion used in nutrition — 1 mg natural equals roughly 2 mg synthetic — reflects roughly double the bioavailability and tissue retention for the natural form. Not harmful, simply a weaker version of the same nutrient. 'Mixed tocopherols' on a label indicates the better one, and is also a natural preservative."
   },
   {
    "name": "pyridoxine hydrochloride (vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "vitamin D3 supplement]",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   },
   {
    "name": "DL-methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "zinc oxide",
    "severity": "moderate",
    "reason": "Oxide is the cheapest and least absorbable grade of mineral there is. The regulator's own position makes the point: AAFCO will not let copper oxide count toward a food's copper minimum AT ALL, citing 'very poor apparent digestibility' — a regulator saying an ingredient cannot count as the nutrient it is named after is as clear as this gets, and the same absorption problem applies across the oxides. Zinc specifically matters because zinc deficiency shows up as exactly the skin and coat problems owners blame on allergies. Look for zinc proteinate or zinc amino acid chelate; zinc sulfate is an acceptable middle. Raised from mild to moderate on 2026-08-23 to match the chelate > sulfate > oxide grading."
   },
   {
    "name": "manganese oxide",
    "severity": "moderate",
    "reason": "Oxide is the cheapest, least absorbable mineral grade. Manganese matters for joint cartilage and bone, so poor availability is not harmless in a large or growing dog. Count the oxides on a label — two or more means the manufacturer bought the cheapest forms available, and that tells you what they did on every line you cannot see."
   },
   {
    "name": "copper sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "sodium selenite",
    "severity": "severe",
    "reason": "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine."
   }
  ],
  "organs": [],
  "produce": [
   "dried plain beet pulp"
  ]
 },
 {
  "slug": "temptations-creamy-dairy-flavor",
  "brand": "Temptations",
  "name": "Creamy dairy flavor",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "Chicken By-Product Meal",
   "Ground Corn",
   "Animal Fat (Preserved With Mixed Tocopherols)",
   "Wheat Flour",
   "Brewers Rice",
   "Dried Meat By-Products",
   "Natural Flavors",
   "Brewers Dried Yeast",
   "Potassium Chloride",
   "Choline Chloride",
   "Salt",
   "Dried Skim Milk",
   "Dl-Methionine",
   "Taurine",
   "Calcium Carbonate",
   "Vitamin E Supplement",
   "Zinc Sulfate",
   "Ferrous Sulfate",
   "Dried Cheese",
   "Mixed Tocopherols (Preservative)",
   "Copper Sulfate",
   "Vitamin A Supplement",
   "Citric Acid (Preservative)",
   "Niacin Supplement",
   "Vitamin B12 Supplement",
   "Riboflavin Supplement",
   "Manganese Sulfate",
   "Thiamine Mononitrate",
   "D-Calcium Pantothenate",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Vitamin D3 Supplement",
   "Biotin",
   "Potassium Iodide",
   "Folic Acid",
   "Rosemary Extract."
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken By-Product Meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Ground Corn (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Animal Fat (Preserved With Mixed Tocopherols) (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Dried Meat By-Products (moderate) — ingredient #6",
    "value": -7,
    "severity": "moderate"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #30 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #31 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   }
  ],
  "flagged": [
   {
    "name": "Chicken By-Product Meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Ground Corn",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard: ground corn is an inexpensive source of bulk calories and starch, which extrusion physically requires to form a kibble. We're not going to repeat the common claim that it's poorly digested — cooked, ground corn is actually digested well by dogs, and saying otherwise would be wrong. The honest criticism is what it displaces: every percentage point of corn is a point not coming from meat. Judge it on that, and on where it sits in the ingredient list."
   },
   {
    "name": "Animal Fat (Preserved With Mixed Tocopherols)",
    "severity": "severe",
    "reason": "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it."
   },
   {
    "name": "Dried Meat By-Products",
    "severity": "moderate",
    "reason": "By-products come from animals that have died — and the source stream includes 4D animals: dead, dying, diseased and disabled. Dr. Andrew Jones, DVM, states this includes roadkill and animals that have been euthanised. The species is never named on the label, so you have no way to know what went into the batch you bought.\n\n⚫ THE EVIDENCE: in February 2018 the FDA and J.M. Smucker recalled over 107 million cans of Gravy Train, Kibbles 'n Bits, Skippy and Ol' Roy after pentobarbital — the drug used to euthanise animals — was found in the food. Smucker confirmed the source was the TALLOW: rendered animal fat. Independent lab testing found 60% of Gravy Train cans sampled came back positive. The FDA states pentobarbital should never be present and any amount makes a product adulterated.\n\nEuthanised animals entered the pet food supply through rendering, a company admitted it, and 107 million cans went out before anyone caught it. AAFCO's written definition says by-products come from SLAUGHTERED animals — 2018 is what that definition is worth in practice.\n\nNote on one point: FDA DNA testing has not found dog or cat material in pet food, so the specific claim that by-products contain euthanised PETS is not something the testing has confirmed."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "Dl-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 },
 {
  "slug": "temptations-tasty-chicken-flavor",
  "brand": "Temptations",
  "name": "Tasty Chicken Flavor",
  "score": 5,
  "format": "Kibble",
  "ingredients": [
   "Chicken By-Product Meal",
   "Ground Corn",
   "Animal Fat (preserved with Mixed Tocopherols)",
   "Wheat Flour",
   "Brewers Rice",
   "Dried Meat By-Products",
   "Natural Flavors",
   "Brewers Dried Yeast",
   "Potassium Chloride",
   "Choline Chloride",
   "Salt",
   "DL-Methionine",
   "Taurine",
   "Calcium Carbonate",
   "Vitamin E Supplement",
   "Zinc Sulfate",
   "Ferrous Sulfate",
   "Dried Cheese",
   "Mixed Tocopherols (preservative)",
   "Copper Sulfate",
   "Vitamin A Supplement",
   "Citric Acid (preservative)",
   "Niacin Supplement",
   "Vitamin B12 Supplement",
   "Riboflavin Supplement",
   "Manganese Sulfate",
   "Thiamine Mononitrate",
   "D-Calcium Pantothenate",
   "Pyridoxine Hydrochloride (Vitamin B6)",
   "Vitamin D3 Supplement",
   "Biotin",
   "Potassium lodide",
   "Folic Acid",
   "Rosemary Extract"
  ],
  "breakdown": [
   {
    "label": "Base score",
    "value": 60
   },
   {
    "label": "Chicken By-Product Meal (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Ground Corn (mild)",
    "value": -2,
    "severity": "mild"
   },
   {
    "label": "Animal Fat (preserved with Mixed Tocopherols) (severe)",
    "value": -18,
    "severity": "severe"
   },
   {
    "label": "Dried Meat By-Products (moderate) — ingredient #6",
    "value": -7,
    "severity": "moderate"
   },
   {
    "label": "Natural Flavors (mild) — ingredient #7",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Pyridoxine Hydrochloride (Vitamin B6) (mild) — ingredient #29 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "Vitamin D3 Supplement (mild) — ingredient #30 (trace amount)",
    "value": -1,
    "severity": "mild"
   },
   {
    "label": "High synthetic vitamin/mineral load (6 added) — over-fortified formula",
    "value": -8
   },
   {
    "label": "Est. ~37% carbohydrate — a carb is a primary ingredient",
    "value": -14
   },
   {
    "label": "Vague protein sourcing in top 5",
    "value": -12
   },
   {
    "label": "🔴 Very poor omega ratio (est. 15:1–30:1 — kibble without omega-3)",
    "value": -15
   }
  ],
  "flagged": [
   {
    "name": "Chicken By-Product Meal",
    "severity": "severe",
    "reason": "AAFCO defines chicken by-products as non-rendered clean parts including necks, feet, undeveloped eggs, and intestines. While not inherently harmful, quality and content can vary significantly between manufacturers"
   },
   {
    "name": "Ground Corn",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard: ground corn is an inexpensive source of bulk calories and starch, which extrusion physically requires to form a kibble. We're not going to repeat the common claim that it's poorly digested — cooked, ground corn is actually digested well by dogs, and saying otherwise would be wrong. The honest criticism is what it displaces: every percentage point of corn is a point not coming from meat. Judge it on that, and on where it sits in the ingredient list."
   },
   {
    "name": "Animal Fat (preserved with Mixed Tocopherols)",
    "severity": "severe",
    "reason": "The problem here is transparency, not toxicity. AAFCO defines 'animal fat' as rendered fat from ANY mammalian species — the source is not named, need not be consistent, and can vary batch to batch. That's the lowest level of ingredient disclosure available on a label. Two practical consequences: a dog with a protein allergy cannot avoid the trigger if the species is unknown, and you have no way to judge quality. Rendering itself is a legitimate process, and named fats (chicken fat, beef fat) are perfectly good ingredients. The concern is specifically the anonymity — a manufacturer confident in the source usually names it."
   },
   {
    "name": "Dried Meat By-Products",
    "severity": "moderate",
    "reason": "By-products come from animals that have died — and the source stream includes 4D animals: dead, dying, diseased and disabled. Dr. Andrew Jones, DVM, states this includes roadkill and animals that have been euthanised. The species is never named on the label, so you have no way to know what went into the batch you bought.\n\n⚫ THE EVIDENCE: in February 2018 the FDA and J.M. Smucker recalled over 107 million cans of Gravy Train, Kibbles 'n Bits, Skippy and Ol' Roy after pentobarbital — the drug used to euthanise animals — was found in the food. Smucker confirmed the source was the TALLOW: rendered animal fat. Independent lab testing found 60% of Gravy Train cans sampled came back positive. The FDA states pentobarbital should never be present and any amount makes a product adulterated.\n\nEuthanised animals entered the pet food supply through rendering, a company admitted it, and 107 million cans went out before anyone caught it. AAFCO's written definition says by-products come from SLAUGHTERED animals — 2018 is what that definition is worth in practice.\n\nNote on one point: FDA DNA testing has not found dog or cat material in pet food, so the specific claim that by-products contain euthanised PETS is not something the testing has confirmed."
   },
   {
    "name": "Natural Flavors",
    "severity": "mild",
    "reason": "⚪ Transparency signal: 'natural flavor' in pet food is most often animal digest — hydrolysed animal tissue sprayed on the outside of the kibble to make it palatable. It is not required to name the species. The concern is not toxicity, it is that a bag can list an unnamed animal product and disclose nothing about what it was."
   },
   {
    "name": "DL-Methionine",
    "severity": "mild",
    "reason": "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own."
   },
   {
    "name": "Zinc Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. The acceptable middle grade — adequately absorbed, behind zinc proteinate or zinc amino acid chelate, well ahead of zinc oxide. Not a reason to reject a food on its own."
   },
   {
    "name": "Ferrous Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal, not a hazard. Sulfate is the adequate middle grade of mineral — better absorbed than oxide, not as well as a chelate, and mildly pro-oxidant. Iron proteinate or iron amino acid chelate is the upgrade. Seeing sulfates rather than oxides means the manufacturer did not buy the cheapest option available, which is worth knowing."
   },
   {
    "name": "Copper Sulfate",
    "severity": "mild",
    "reason": "⚠️ Read this one carefully, because it is flagged for the OPPOSITE reason to every other mineral here. As a form, sulfate is the acceptable middle — chelates absorb best, sulfates adequately, oxides barely at all. Copper sulfate is not a poor form. The concern is TOTAL COPPER LOAD: copper accumulates in the liver, dogs have no good way to dump the excess, and AAFCO deleted the copper maximum in 2007 and still has none. So 'meets AAFCO' tells you nothing about the ceiling. Matters most in copper-predisposed breeds — Bedlington Terrier, West Highland White, Doberman, Labrador, Dalmatian — where the target is under ~1.2mg per 1,000 kcal. Liver enzymes are NOT sensitive early, so normal bloodwork does not rule it out. Demoted from severe to mild on 2026-08-23: the form itself is fine, and scoring it as severe punished a mid-tier food for using an adequate mineral."
   },
   {
    "name": "Manganese Sulfate",
    "severity": "mild",
    "reason": "⚪ Formulation signal. Adequate absorption; manganese proteinate or amino acid chelate is better, manganese oxide is worse. On its own this is unremarkable."
   },
   {
    "name": "Pyridoxine Hydrochloride (Vitamin B6)",
    "severity": "mild",
    "reason": "⚪ Safe synthetic at label levels: pyridoxine HCl is synthetic vitamin B6, and it's the standard, effective form used across pet food. Dogs require B6 for protein metabolism and neurotransmitter production, and deficiency causes anaemia and seizures. The reason for noting it at all is that B6 has an unusually narrow window at the top end for a B vitamin: chronic excess causes peripheral neuropathy — nerve damage in the limbs and loss of coordination. That's a concern for over-supplementation, not for its presence in a balanced food."
   },
   {
    "name": "Vitamin D3 Supplement",
    "severity": "mild",
    "reason": "Cholecalciferol is vitamin D3 — the standard, AAFCO-required form of vitamin D in complete dog food, and its presence on a label is expected rather than alarming. Dogs cannot make meaningful vitamin D in their skin from sunlight the way people do, so it has to come from the diet. Two things are worth knowing. D3 is more potent than D2 (ergocalciferol) and has a narrower safety margin — it is the form used in rodenticides. And the real-world risk is manufacturing error, not the ingredient: FDA recalls in 2018–19 found dog foods containing up to 70x the intended vitamin D, causing hypercalcemia, kidney failure and deaths across brands including Hill's, Nutrisca, Sunshine Mills, Kroger and ELM. An ingredient label cannot tell you the amount, only that it is present — so this is flagged for awareness, not as a mark against the food."
   }
  ],
  "organs": [],
  "produce": []
 }
]

export const getFood = (slug: string) => foods.find((f) => f.slug === slug)
