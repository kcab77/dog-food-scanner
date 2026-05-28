import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auditIngredientList } from "../lib/ingredientDatabase";
import { analyzeIngredients } from "../lib/ingredientLookup";
import {
    analyzeIngredientsBatch,
    askNutritionCoach,
    lookupIngredientDetail,
    lookupIngredientsWithClaude,
    lookupProduct,
    lookupProductByName,
    lookupWithGoUPC,
    saveProduct,
    saveProductGA,
    saveToGoogleSheet,
    smartScanWithClaude,
} from "../lib/productLookup";
import {
    CustomIngredient,
    loadCustomIngredients,
} from "../storage/ingredients";
const DISCLAIMER = `This app is for informational and educational purposes only. Scores and ingredient assessments reflect general pet nutrition research and are not veterinary advice. We are not affiliated with any pet food brand. Ingredient concerns cited in this app are based on published research from organizations including the ASPCA, WHO, NIH, FDA, and peer-reviewed veterinary nutrition literature. All opinions are clearly labeled as assessments. Consult your veterinarian before changing your pet's diet.`;

const SHEET_ID = "1rllpgcetN7MeeOizW91f1VyvJYDLH4IlHmfPI27yRKY";

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
    severity: "severe",
    reason:
      "Some animal studies have associated TBHQ with immune system concerns and tumor development at high doses. It is banned in several countries for use in food",
  },
  {
    term: "sodium nitrite",
    severity: "severe",
    reason:
      "Research suggests sodium nitrite can form nitrosamines during digestion, some of which have been associated with cancer risk in animal studies",
  },
  {
    term: "sodium metabisulfite",
    severity: "moderate",
    reason:
      "This sulfite preservative has been associated with the destruction of thiamine (vitamin B1) in pet food and may trigger sensitivity reactions in some animals",
  },
  {
    term: "potassium sorbate",
    severity: "moderate",
    reason:
      "Some in vitro studies have suggested potential DNA-damaging effects. While generally regarded as safe at low levels, some pet nutrition researchers consider it unnecessary in pet food",
  },
  {
    term: "calcium propionate",
    severity: "mild",
    reason:
      "Some animal behavior researchers have explored possible links between propionate exposure and behavioral changes. It is considered a lower-concern preservative but unnecessary in quality pet food",
  },
  {
    term: "menadione",
    severity: "toxic",
    reason:
      "Menadione (synthetic vitamin K3) generates reactive oxygen species during metabolism, depleting cellular glutathione — the body's primary antioxidant defense. Studies in the Journal of Nutrition found menadione causes oxidative damage to red blood cells (Heinz body hemolytic anemia) and liver cell membranes. The National Animal Supplement Council formally recommends against menadione in animal products because of this documented toxicity mechanism. Natural K1 from plants and K2 from animal sources are safe alternatives.",
  },
  {
    term: "copper sulfate",
    severity: "severe",
    reason:
      "Inorganic copper sulfate bypasses normal liver regulation and accumulates in liver tissue over years of daily feeding. A 2015 Veterinary Pathology study found commercial pet foods with elevated inorganic copper were directly associated with progressive chronic hepatitis in Labrador Retrievers. Unlike organic copper proteinate, the body cannot efficiently regulate inorganic copper absorption, allowing it to build up silently until liver damage is already advanced. Bedlington Terriers, Dobermans, and Labs are especially susceptible.",
  },
  {
    term: "sodium selenite",
    severity: "severe",
    reason:
      "Sodium selenite is an inorganic selenium compound with one of the narrowest safe dose ranges in pet nutrition — the gap between adequate and toxic is extremely small. Unlike organic selenomethionine (which is self-regulated through body proteins), inorganic selenite generates free radicals during metabolism, causing oxidative stress to liver and kidney cells. Research in Biological Trace Element Research shows long-term inorganic selenium accumulation causes progressive kidney tubule damage before obvious clinical symptoms appear. Selenomethionine from yeast is the safer, better-regulated alternative.",
  },
  {
    term: "zinc oxide",
    severity: "moderate",
    reason:
      "Zinc oxide is considered poorly bioavailable compared to organic zinc sources. Some research suggests inorganic zinc may accumulate over time. Zinc proteinate and other organic forms are generally preferred in quality pet nutrition",
  },
  {
    term: "dl-methionine",
    severity: "moderate",
    reason:
      "The presence of synthetic dl-methionine is often considered an indicator of low biological value protein sources in the formula, as high quality whole meat proteins typically provide adequate methionine naturally",
  },
  {
    term: "corn syrup",
    severity: "severe",
    reason:
      "Added sugars like corn syrup have been associated with blood sugar dysregulation, obesity, and dental disease in companion animals. Dogs and cats have limited ability to process high sugar loads",
  },
  {
    term: "corn gluten meal",
    severity: "mild",
    reason:
      "Corn gluten meal is a plant-based protein concentrate with lower biological value for carnivores compared to animal-based proteins. Pet nutrition researchers note it is sometimes used to artificially inflate crude protein percentages on labels",
  },
  {
    term: "wheat gluten",
    severity: "moderate",
    reason:
      "Wheat gluten is a common allergen in dogs. It was prominently associated with the 2007 pet food recall after contaminated wheat gluten from overseas caused widespread illness and deaths in pets",
  },
  {
    term: "soy protein isolate",
    severity: "moderate",
    reason:
      "Soy protein isolate is a heavily processed ingredient that some veterinary nutritionists have associated with digestive issues and possible endocrine disruption in sensitive animals",
  },
  {
    term: "cellulose",
    severity: "mild",
    reason:
      "Cellulose used in pet food is often derived from wood pulp or plant stalks. While technically a fiber source, it provides minimal nutritional value compared to whole food fiber sources like pumpkin or chicory root",
  },
  {
    term: "peanut hulls",
    severity: "mild",
    reason:
      "Peanut hulls are an agricultural waste byproduct with negligible nutritional value. Pet nutrition researchers consider their inclusion an indicator of low quality formulation focused on reducing cost rather than nutrition",
  },
  {
    term: "beet pulp",
    severity: "mild",
    reason:
      "Beet pulp is a controversial ingredient. While some consider it a fiber source, critics note it is often sourced from sugar beets and may contain residual sugars. Many premium brands have moved away from it",
  },
  {
    term: "brewer rice",
    severity: "mild",
    reason:
      "Brewer rice consists of small broken rice fragments left over from the beer brewing process. Pet nutrition researchers consider it a low quality carbohydrate filler with minimal nutritional benefit compared to whole grains",
  },
  {
    term: "ground corn",
    severity: "mild",
    reason:
      "Ground corn is a high glycemic carbohydrate with relatively low digestibility for dogs and cats. Pet nutrition researchers note it is primarily used as an inexpensive calorie source rather than for nutritional benefit",
  },
  {
    term: "ground wheat",
    severity: "mild",
    reason:
      "Ground wheat is a common allergen in companion animals and provides limited nutritional value for carnivores. It is primarily used as an inexpensive filler and binder in dry pet food formulas",
  },
  {
    term: "grain fragments",
    severity: "mild",
    reason:
      "Grain fragments are the leftover pieces from grain milling after the more nutritious portions have been removed for human food. Pet nutrition researchers consider them low quality filler ingredients",
  },
  {
    term: "artificial color",
    severity: "moderate",
    reason:
      "Artificial colors serve no nutritional purpose in pet food as dogs and cats do not select food based on color. Some synthetic dyes have been associated with hypersensitivity reactions in animal research",
  },
  {
    term: "artificial colour",
    severity: "moderate",
    reason:
      "Artificial colours serve no nutritional purpose in pet food. Some synthetic dyes have been associated with hypersensitivity reactions in animal research",
  },
  {
    term: "artificial flavor",
    severity: "moderate",
    reason:
      "Artificial flavors are often used to make lower quality ingredients more palatable to pets. Their presence may indicate the base ingredients lack sufficient natural palatability",
  },
  {
    term: "artificial flavour",
    severity: "moderate",
    reason:
      "Artificial flavours are often used to mask the taste of lower quality ingredients. Their presence may indicate the base ingredients lack sufficient natural palatability",
  },
  {
    term: "red 40",
    severity: "moderate",
    reason:
      "Red 40 is a synthetic petroleum-derived dye with no nutritional value in pet food. Some research has associated certain synthetic dyes with hypersensitivity and behavioral changes in sensitive animals",
  },
  {
    term: "yellow 5",
    severity: "moderate",
    reason:
      "Yellow 5 (tartrazine) is a synthetic dye that has been associated with hypersensitivity reactions in some animal research. It provides no nutritional benefit and is considered unnecessary in pet food by most veterinary nutritionists",
  },
  {
    term: "yellow 6",
    severity: "moderate",
    reason:
      "Yellow 6 is a synthetic dye that some animal studies have associated with adrenal and kidney changes at high doses. It is considered unnecessary in pet food by most veterinary nutritionists",
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
    term: "meat by-product",
    severity: "moderate",
    reason:
      "AAFCO defines meat by-products as non-rendered parts other than meat, which may include lungs, spleen, kidneys, brain, and other organs. The lack of species identification makes quality and sourcing difficult to verify",
  },
  {
    term: "meat by-products",
    severity: "moderate",
    reason:
      "AAFCO defines meat by-products as non-rendered parts other than meat, which may include lungs, spleen, kidneys, brain, and other organs. The lack of species identification makes quality and sourcing difficult to verify",
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
      "Generic animal fat without species identification may be sourced from a variety of animals including restaurant grease or rendering facilities. The lack of source transparency makes quality assessment difficult",
  },
  {
    term: "hydrolyzed protein",
    severity: "moderate",
    reason:
      "Hydrolyzed proteins are produced through chemical or enzymatic breakdown of animal or plant tissue. While sometimes used therapeutically, in standard pet food they may indicate lower quality protein sources and have been associated with sensitivity reactions in some animals",
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
      "Rendered bone meal has variable digestibility and may contribute to phosphorus imbalances when used as a primary calcium source. Whole ground bone from identified species is generally preferred by veterinary nutritionists",
  },
  {
    term: "feather meal",
    severity: "moderate",
    reason:
      "Feather meal is produced by processing poultry feathers under high heat and pressure. Research suggests its digestibility is considerably lower than whole meat proteins, and it is sometimes used to artificially inflate crude protein percentages",
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
      "Added sugars in pet food have been associated with obesity, dental disease, and blood sugar dysregulation in companion animals. Dogs and cats have no nutritional requirement for added sugars",
  },
  {
    term: "sucrose",
    severity: "moderate",
    reason:
      "Sucrose (table sugar) provides empty calories with no nutritional benefit for pets. Its inclusion has been associated with obesity and dental disease in companion animals",
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
      "Added glucose provides empty calories and has been associated with blood sugar spikes in companion animals. Dogs and cats have no nutritional requirement for added simple sugars",
  },
  {
    term: "molasses",
    severity: "mild",
    reason:
      "Molasses is a sugar byproduct used to improve palatability in pet food. While it contains some minerals, its high sugar content is considered unnecessary and potentially problematic for blood sugar management in companion animals",
  },
  {
    term: "sorbitol",
    severity: "mild",
    reason:
      "Sorbitol is a sugar alcohol that can cause osmotic digestive upset and diarrhea in some animals, particularly at higher intake levels. It is considered unnecessary in quality pet food formulations",
  },
  {
    term: "melamine",
    severity: "toxic",
    reason:
      "Melamine is an industrial chemical not approved for use in pet food. It was linked to the 2007 pet food contamination crisis that resulted in thousands of pet deaths and is now tested for specifically in pet food safety screenings",
  },
  {
    term: "rendered fat",
    severity: "severe",
    reason:
      "Generic rendered fat without source identification may come from a variety of animals processed at rendering facilities. The lack of transparency makes quality, freshness, and sourcing impossible to verify independently",
  },
  {
    term: "vegetable oil",
    severity: "mild",
    reason:
      "Unspecified vegetable oils are typically high in omega-6 fatty acids. Without a named source, quality and origin cannot be verified, and an imbalanced omega-6 to omega-3 ratio has been associated with increased inflammation in companion animals",
  },
  {
    term: "garlic",
    severity: "toxic",
    reason:
      "The ASPCA and veterinary toxicologists classify garlic as toxic to dogs and cats. It contains thiosulfates that can damage red blood cells and cause hemolytic anemia, even in relatively small amounts",
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
    severity: "toxic",
    reason:
      "Garlic powder is considered more concentrated than fresh garlic and has been associated with toxicity in dogs and cats at lower doses. The ASPCA classifies all garlic-derived ingredients as toxic to companion animals",
  },
  // Vitamins & Minerals — tiered by severity per research
  {
    term: "cholecalciferol",
    severity: "severe",
    reason:
      "Cholecalciferol (synthetic Vitamin D3) has an extremely narrow margin between beneficial and toxic doses in dogs. Multiple pet food recalls have involved Vitamin D3 overdose causing hypercalcemia, kidney failure, and death. Dogs cannot tolerate excess Vitamin D the way humans can.",
  },
  {
    term: "vitamin d3 supplement",
    severity: "severe",
    reason:
      "Synthetic Vitamin D3 supplementation has one of the narrowest safe ranges of any nutrient in dogs. Several major pet food recalls involved Vitamin D3 toxicity causing hypercalcemia, kidney failure, and death. One of the most dangerous vitamins for dogs in excess.",
  },
  {
    term: "ferric oxide",
    severity: "moderate",
    reason:
      "Ferric oxide is used as a cosmetic colorant in pet food and provides no nutritional value. It is essentially unabsorbable and classified by veterinary nutritionists as a filler ingredient used for appearance rather than nutrition.",
  },
  {
    term: "retinyl palmitate",
    severity: "mild",
    reason:
      "Retinyl palmitate is a synthetic fat-soluble Vitamin A that accumulates in body fat and liver tissue. While necessary in balance, chronic excess from supplementation can contribute to hypervitaminosis A over time, causing bone pain, calcification of soft tissues, and liver stress.",
  },
  {
    term: "retinyl acetate",
    severity: "mild",
    reason:
      "Retinyl acetate is a synthetic fat-soluble Vitamin A that accumulates in body fat and liver tissue. While necessary in balance, chronic excess from supplementation can contribute to hypervitaminosis A over time, causing bone pain, calcification of soft tissues, and liver stress.",
  },
  {
    term: "pyridoxine hydrochloride",
    severity: "mild",
    reason:
      "Pyridoxine hydrochloride (synthetic Vitamin B6) is safe at normal dietary levels but chronic excess has been associated with peripheral neuropathy in dogs — nerve damage in the limbs causing loss of coordination and sensory dysfunction.",
  },
  {
    term: "dl-alpha tocopherol",
    severity: "mild",
    reason:
      "dl-Alpha tocopherol is the synthetic form of Vitamin E with significantly lower bioavailability than natural d-alpha tocopherol. Very high doses may interfere with Vitamin K absorption. The synthetic dl form (note the 'l') is considered a lower quality ingredient compared to the natural d form.",
  },
  {
    term: "cyanocobalamin",
    severity: "mild",
    reason:
      "Cyanocobalamin is an inferior synthetic form of Vitamin B12 with lower bioavailability than methylcobalamin, the preferred form. It contains trace cyanide compounds (negligible in context) and is generally considered a lower quality formulation signal by veterinary nutritionists.",
  },
  {
    term: "zinc oxide",
    severity: "moderate",
    reason:
      "Zinc oxide has very poor bioavailability compared to organic zinc forms like zinc proteinate. It can cause zinc toxicity — including hemolytic anemia, liver and kidney damage — and some breeds like Huskies and Malamutes have specific zinc malabsorption issues. Zinc proteinate is the preferred supplemental form.",
  },
];

const SEVERITY_PENALTIES: Record<string, number> = {
  mild: 2,
  moderate: 10,
  severe: 18,
  toxic: 28,
};

const SEVERITY_COLORS: Record<string, string> = {
  mild: "#f39c12",
  moderate: "#e67e22",
  severe: "#c0392b",
  toxic: "#7b241c",
};

const TOXIC_ADDITIVES = [
  "menadione",
  "copper sulfate",
  "sodium selenite",
  "zinc oxide",
  "dl-methionine",
];
// Named meals: species identified — acceptable concentrated protein, no penalty
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
// Generic meals: no species ID — sourcing unknown, penalized
const GENERIC_MEALS = [
  "meat meal",
  "poultry meal",
  "fish meal",
  "animal meal",
];
// Combined for display/tag purposes
const MEAT_MEALS = [...NAMED_MEALS, ...GENERIC_MEALS];
// All synthetic vitamins/minerals — used for count-based load penalty and "no synthetic vitamins" bonus
// Safe forms (B1, B2, B3, B5, B9, B7, choline, taurine, potassium chloride, ferrous sulfate, manganese) excluded
const ADDED_VITAMINS = [
  "vitamin a supplement", "retinyl palmitate", "retinyl acetate",
  "vitamin d supplement", "vitamin d3 supplement", "cholecalciferol",
  "dl-alpha tocopherol", "pyridoxine hydrochloride", "cyanocobalamin",
  "zinc sulfate", "zinc oxide", "copper sulfate", "sodium selenite", "sodium selenate",
  "ferric oxide", "magnesium oxide", "menadione", "dl-methionine",
];

// Per-ingredient penalties for poor-form vitamins/minerals NOT already in HARMFUL_INGREDIENTS
// Items already caught by HARMFUL_INGREDIENTS (menadione, cholecalciferol, sodium selenite,
// copper sulfate, zinc oxide, ferric oxide, retinyl forms, pyridoxine HCl, etc.) are excluded
// to avoid double-counting
const VITAMIN_MINERAL_PENALTIES: { term: string; penalty: number; label: string }[] = [
  // Not in HARMFUL_INGREDIENTS — inorganic selenium poor form
  { term: "sodium selenate", penalty: 7, label: "Sodium selenate — inorganic selenium, oxidative kidney damage" },
  // Not in HARMFUL_INGREDIENTS — poor mineral forms
  { term: "zinc sulfate", penalty: 3, label: "Zinc sulfate — poor bioavailability vs proteinate forms" },
  { term: "magnesium oxide", penalty: 3, label: "Magnesium oxide — poorly absorbed, causes GI upset" },
  // Generic vitamin d supplement (not the specific cholecalciferol already caught above)
  { term: "vitamin d supplement", penalty: 4, label: "Synthetic Vitamin D — narrow safe range" },
];
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

// Whole food fruits & vegetables — +2 each, cap +10
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

// Anti-inflammatory & functional whole foods — +3 each, cap +12
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
const ORGAN_COVERAGE = [
  {
    organ: "liver",
    benefits: "Vitamin A, B12, folate, iron, copper — nature's multivitamin",
  },
  { organ: "kidney", benefits: "B12, selenium, iron, zinc, riboflavin" },
  {
    organ: "heart",
    benefits: "Taurine, CoQ10, B vitamins — critical for heart health",
  },
  { organ: "spleen", benefits: "Iron, zinc, vitamin C, immune support" },
  { organ: "lung", benefits: "Lightweight protein, iron" },
  {
    organ: "tripe",
    benefits: "Probiotics, digestive enzymes, balanced omega ratio",
  },
];
const OMEGA3_SOURCES = [
  "salmon",
  "sardine",
  "herring",
  "anchovy",
  "mackerel",
  "trout",
  "fish oil",
  "salmon oil",
  "flaxseed",
  "flax seed",
  "chia seed",
  "krill",
  "krill oil",
  "algae",
  "algal oil",
];
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

const INGREDIENT_NUTRIENTS: { terms: string[]; nutrients: string }[] = [
  {
    terms: [
      "chicken liver",
      "beef liver",
      "pork liver",
      "lamb liver",
      "duck liver",
      "liver",
    ],
    nutrients:
      "Vitamin A, B12, folate, iron, copper, zinc — nature's multivitamin",
  },
  {
    terms: ["chicken heart", "beef heart", "pork heart", "duck heart", "heart"],
    nutrients: "Taurine, CoQ10, B12, iron, zinc, selenium",
  },
  {
    terms: ["chicken kidney", "beef kidney", "pork kidney", "kidney"],
    nutrients: "B12, selenium, iron, zinc, riboflavin",
  },
  {
    terms: ["chicken", "turkey"],
    nutrients: "Protein, B3 (niacin), B6, selenium, phosphorus",
  },
  {
    terms: ["beef", "bison"],
    nutrients: "Protein, B12, zinc, iron, selenium, creatine",
  },
  {
    terms: ["salmon", "herring", "sardine", "anchovy", "mackerel", "trout"],
    nutrients: "Omega-3 (EPA/DHA), B12, Vitamin D, selenium, iodine",
  },
  {
    terms: ["duck"],
    nutrients: "Protein, iron, B12, zinc, selenium — cooling protein (TCVM)",
  },
  { terms: ["lamb"], nutrients: "Protein, B12, zinc, iron, selenium" },
  {
    terms: ["venison"],
    nutrients: "Lean protein, B12, zinc, iron — low allergen",
  },
  {
    terms: ["rabbit"],
    nutrients: "Lean protein, B12, phosphorus — lowest allergen protein",
  },
  {
    terms: ["egg", "whole egg", "dried egg"],
    nutrients:
      "Complete protein (100% bioavailability), biotin, choline, Vitamin D, B12, selenium, lutein",
  },
  {
    terms: ["sweet potato"],
    nutrients:
      "Beta carotene (Vitamin A), Vitamin C, B6, potassium, manganese, fiber",
  },
  {
    terms: ["pumpkin", "pumpkin seed"],
    nutrients:
      "Fiber, beta carotene, Vitamin C, zinc, magnesium — great for digestion",
  },
  {
    terms: ["blueberr"],
    nutrients: "Antioxidants, Vitamin C, Vitamin K, manganese, fiber",
  },
  {
    terms: ["spinach"],
    nutrients: "Iron, Vitamin K, Vitamin A, folate, magnesium",
  },
  {
    terms: ["krill", "krill oil"],
    nutrients:
      "Omega-3 (EPA/DHA), astaxanthin (powerful antioxidant), phospholipids, choline",
  },
  {
    terms: ["flaxseed", "flax seed"],
    nutrients: "Omega-3 (ALA), fiber, lignans, magnesium",
  },
  {
    terms: ["chia seed", "chia"],
    nutrients: "Omega-3 (ALA), fiber, calcium, phosphorus, magnesium",
  },
  {
    terms: ["kelp", "dried kelp"],
    nutrients: "Iodine, iron, magnesium, calcium, Vitamin K — supports thyroid",
  },
  {
    terms: ["turmeric"],
    nutrients: "Curcumin — anti-inflammatory, antioxidant, joint support",
  },
  {
    terms: ["coconut oil"],
    nutrients:
      "MCTs (medium chain triglycerides), lauric acid — antimicrobial, brain fuel",
  },
  {
    terms: ["tripe", "green tripe"],
    nutrients:
      "Natural probiotics, digestive enzymes, balanced omega ratio, B12",
  },
  {
    terms: ["bone broth"],
    nutrients:
      "Collagen, glycine, glucosamine, chondroitin — joint and gut health",
  },
  {
    terms: ["gizzard", "chicken gizzard"],
    nutrients: "Protein, zinc, iron, B12, Vitamin C",
  },
  {
    terms: ["fish oil", "salmon oil"],
    nutrients:
      "Omega-3 (EPA/DHA) — anti-inflammatory, skin, coat, brain, joint health",
  },
  {
    terms: ["dandelion"],
    nutrients: "Vitamin A, C, K, iron, calcium, potassium — liver support",
  },
  {
    terms: ["parsley"],
    nutrients:
      "Vitamin C, K, folate, antioxidants — fresh breath, kidney support",
  },
  {
    terms: ["broccoli"],
    nutrients: "Vitamin C, K, fiber, sulforaphane — cancer-protective compound",
  },
  {
    terms: ["carrot"],
    nutrients: "Beta carotene, Vitamin K, potassium, fiber",
  },
  { terms: ["apple"], nutrients: "Fiber, Vitamin C, quercetin — antioxidant" },
  {
    terms: ["cranberr"],
    nutrients:
      "Vitamin C, antioxidants, proanthocyanidins — urinary tract health",
  },
];

function getNutrientInfo(ingredient: string): string | null {
  const lower = ingredient.toLowerCase();
  for (const entry of INGREDIENT_NUTRIENTS) {
    if (entry.terms.some((t) => lower.includes(t))) return entry.nutrients;
  }
  return null;
}

// Treat-specific harmful ingredients — different from food rules
const TREAT_HARMFUL: {
  term: string;
  reason: string;
  severity: string;
  positionCheck?: boolean;
}[] = [
  {
    term: "xylitol",
    severity: "toxic",
    reason:
      "Xylitol is extremely toxic to dogs — causes severe hypoglycemia and liver failure even in tiny amounts. Never acceptable in any dog product.",
  },
  {
    term: "propylene glycol",
    severity: "toxic",
    reason:
      "Banned in cat food by the FDA. Linked to Heinz body anemia. Often used to keep soft treats moist — unnecessary and risky.",
  },
  {
    term: "menadione",
    severity: "toxic",
    reason:
      "Synthetic vitamin K3 that depletes glutathione, damaging red blood cells and liver cells. Unnecessary in treats.",
  },
  {
    term: "garlic",
    severity: "toxic",
    reason:
      "Toxic to dogs — damages red blood cells and causes hemolytic anemia even in small amounts.",
  },
  {
    term: "onion",
    severity: "toxic",
    reason:
      "Toxic to dogs — contains N-propyl disulfide which destroys red blood cells.",
  },
  {
    term: "bha",
    severity: "severe",
    reason:
      "Synthetic preservative classified as a possible carcinogen by the IARC. No reason to have this in a treat when natural alternatives exist.",
  },
  {
    term: "bht",
    severity: "severe",
    reason:
      "Synthetic preservative linked to liver hypertrophy and thyroid disruption in animal studies.",
  },
  {
    term: "ethoxyquin",
    severity: "severe",
    reason:
      "Originally a pesticide. Associated with liver enzyme elevation and kidney lesions in dogs. Banned in human food in many countries.",
  },
  {
    term: "corn syrup",
    severity: "severe",
    reason:
      'Corn syrup is pure sugar — used to make treats more addictive. Promotes obesity, blood sugar spikes, and dental disease. A red flag in any "healthy" treat.',
  },
  {
    term: "sugar",
    severity: "severe",
    reason:
      "Sugar is listed in the top ingredients by weight. This treat is more candy than food — promotes obesity and dental disease.",
    positionCheck: true,
  },
  {
    term: "sucrose",
    severity: "severe",
    reason:
      "Sucrose (table sugar) near the top of the ingredient list means it's a primary ingredient by weight. Not appropriate for a dog treat.",
    positionCheck: true,
  },
  {
    term: "molasses",
    severity: "moderate",
    reason:
      "Molasses high in the ingredient list means significant sugar content. Fine as a trace flavoring at the bottom of the list, but concerning as a primary ingredient.",
    positionCheck: true,
  },
  {
    term: "artificial color",
    severity: "moderate",
    reason:
      "Artificial dyes serve zero purpose in dog treats — dogs don't care about color. Their presence indicates a treat made for humans to buy, not dogs to eat.",
  },
  {
    term: "artificial colour",
    severity: "moderate",
    reason: "Artificial dyes serve zero purpose in dog treats.",
  },
  {
    term: "red 40",
    severity: "moderate",
    reason:
      "Synthetic petroleum-derived dye with no nutritional value. Completely unnecessary in dog treats.",
  },
  {
    term: "yellow 5",
    severity: "moderate",
    reason:
      "Synthetic dye associated with hypersensitivity reactions. No reason to be in a dog treat.",
  },
  {
    term: "yellow 6",
    severity: "moderate",
    reason: "Synthetic dye. No nutritional benefit, unnecessary in dog treats.",
  },
  {
    term: "sodium nitrite",
    severity: "moderate",
    reason:
      "Forms nitrosamines during digestion, associated with cancer risk in animal studies.",
  },
  {
    term: "wheat gluten",
    severity: "moderate",
    reason:
      "Common allergen in dogs. Used as a cheap protein filler — lower quality than whole meat.",
  },
  {
    term: "soy protein isolate",
    severity: "moderate",
    reason:
      "Heavily processed plant protein — associated with digestive issues in sensitive dogs.",
  },
  {
    term: "pea protein",
    severity: "mild",
    reason:
      "Often used to artificially inflate the protein percentage. Whole meat is a better protein source for dogs.",
  },
  {
    term: "meat by-product",
    severity: "moderate",
    reason:
      "Unidentified animal parts — quality and sourcing cannot be verified.",
  },
  {
    term: "animal digest",
    severity: "moderate",
    reason:
      "Chemically or enzymatically hydrolyzed animal tissue of unknown origin — used as a flavor enhancer.",
  },
  {
    term: "caramel color",
    severity: "mild",
    reason:
      "May contain 4-methylimidazole (4-MEI) from ammonia processing — associated with potential carcinogenic activity in some research.",
  },
  {
    term: "sodium metabisulfite",
    severity: "mild",
    reason:
      "Sulfite preservative that destroys thiamine (Vitamin B1) in pet food.",
  },
];

// Ingredients that are OK in treats but would flag in food
const TREAT_OK_INGREDIENTS = [
  "salt",
  "glycerin",
  "vegetable glycerin",
  "lecithin",
  "soy lecithin",
  "sunflower lecithin",
  "natural flavor",
  "natural flavors",
  "mixed tocopherols",
];

const DENTAL_INGREDIENTS = [
  { term: 'parsley', benefit: 'Natural breath freshener' },
  { term: 'peppermint', benefit: 'Antibacterial + fresh breath' },
  { term: 'spearmint', benefit: 'Fresh breath' },
  { term: 'dill', benefit: 'Natural breath freshener' },
  { term: 'fennel', benefit: 'Digestive + fresh breath' },
  { term: 'coconut oil', benefit: 'Antimicrobial — fights plaque bacteria' },
  { term: 'neem', benefit: 'Natural antibacterial for gums' },
  { term: 'kelp', benefit: 'Shown to reduce tartar buildup' },
  { term: 'cinnamon', benefit: 'Antimicrobial properties' },
];

function scoreTreats(ingredientList: string[], processingMethod?: string, productName?: string): {
  score: number;
  flags: { name: string; reason: string; severity: string }[];
  breakdown: { label: string; value: number }[];
  ingredientCount: number;
  vitaminFlags: string[];
  dentalIngredients: { ingredient: string; benefit: string }[];
  treatProcessingMethod: string;
} {
  const lower = ingredientList.map((i) => i.toLowerCase());
  const top3 = lower.slice(0, 3);
  const flags: { name: string; reason: string; severity: string }[] = [];
  const breakdown: { label: string; value: number }[] = [];
  let total = 70;
  breakdown.push({ label: "Base score", value: 70 });

  // Processing method scoring
  const method = (processingMethod || 'unknown').toLowerCase();
  let treatProcessingMethod = 'Unknown';
  if (method.includes('freeze') || method.includes('raw')) {
    treatProcessingMethod = method.includes('freeze') ? 'Freeze-Dried' : 'Raw';
    total += 10;
    breakdown.push({ label: `${treatProcessingMethod} — nutrients fully intact`, value: 10 });
  } else if (method.includes('baked')) {
    treatProcessingMethod = 'Baked';
    total += 5;
    breakdown.push({ label: 'Baked — minimally processed', value: 5 });
  } else if (method.includes('gently cooked') || method.includes('cooked')) {
    treatProcessingMethod = 'Gently Cooked';
    total += 3;
    breakdown.push({ label: 'Gently cooked — acceptable processing', value: 3 });
  } else if (method.includes('kibble') || method.includes('extruded')) {
    treatProcessingMethod = 'Extruded/Kibble';
    total -= 8;
    breakdown.push({ label: 'Extruded/kibble-style — high heat destroys nutrients', value: -8 });
  } else if (method.includes('semi') || method.includes('soft')) {
    treatProcessingMethod = 'Soft/Semi-Moist';
    total -= 5;
    breakdown.push({ label: 'Soft/semi-moist — preservatives required to stay shelf-stable', value: -5 });
  }

  // Check harmful treat ingredients
  for (let i = 0; i < ingredientList.length; i++) {
    const ing = ingredientList[i];
    const ingLower = ing.toLowerCase();
    for (const h of TREAT_HARMFUL) {
      if (!ingLower.includes(h.term)) continue;
      // Position-sensitive ingredients only flag in top 5
      if (h.positionCheck && i >= 5) continue;
      flags.push({ name: ing, reason: h.reason, severity: h.severity });
      break;
    }
  }

  // Score the flags
  for (const f of flags) {
    const p = SEVERITY_PENALTIES[f.severity] || 8;
    total -= p;
    breakdown.push({ label: `${f.name} (${f.severity})`, value: -p });
  }

  // Ingredient count — 10+ ingredients is bad for treats
  const count = ingredientList.length;
  if (count === 1) {
    total += 25;
    breakdown.push({ label: "Single ingredient treat — best possible", value: 25 });
  } else if (count <= 3) {
    total += 15;
    breakdown.push({ label: "2-3 ingredients — excellent simplicity", value: 15 });
  } else if (count <= 5) {
    total += 8;
    breakdown.push({ label: "4-5 ingredients — good simplicity", value: 8 });
  } else if (count <= 8) {
    breakdown.push({ label: "6-8 ingredients — acceptable", value: 0 });
  } else if (count <= 10) {
    total -= 10;
    breakdown.push({ label: `${count} ingredients — too many for a treat`, value: -10 });
  } else {
    total -= 20;
    breakdown.push({ label: `${count} ingredients — overly processed for a treat`, value: -20 });
  }

  // Synthetic vitamins in treats = over-supplementation risk
  const vitaminFlags = ingredientList.filter((ing) =>
    ADDED_VITAMINS.some((v) => ing.toLowerCase().includes(v)),
  );
  if (vitaminFlags.length > 0) {
    const p = vitaminFlags.length * 5;
    total -= p;
    breakdown.push({
      label: `${vitaminFlags.length} added synthetic vitamin(s) — over-supplementation risk`,
      value: -p,
    });
  } else {
    total += 10;
    breakdown.push({ label: "No synthetic vitamins — no over-supplementation risk", value: 10 });
  }

  // First ingredient is a whole meat/animal protein = bonus
  const firstIng = lower[0] || "";
  const isWholeMeatFirst =
    SPECIFIC_PROTEIN_TERMS.some((p) => firstIng.includes(p)) &&
    !firstIng.includes("meal") &&
    !firstIng.includes("by-product");
  if (isWholeMeatFirst) {
    total += 10;
    breakdown.push({ label: `Whole ${ingredientList[0]} as #1 ingredient`, value: 10 });
  }

  // Sugar / sweetener in top 3 = major red flag
  const sweetenerTerms = ["sugar", "corn syrup", "cane sugar", "honey", "molasses", "fructose", "sucrose", "dextrose"];
  const sweetenerInTop3 = top3.some((i) => sweetenerTerms.some((s) => i.includes(s)));
  if (sweetenerInTop3 && !flags.some((f) => sweetenerTerms.some((s) => f.name.toLowerCase().includes(s)))) {
    total -= 15;
    breakdown.push({ label: "Sweetener in top 3 ingredients — primarily sugar by weight", value: -15 });
  }

  // Dental ingredient detection
  const dentalIngredients: { ingredient: string; benefit: string }[] = [];
  for (const ing of ingredientList) {
    const match = DENTAL_INGREDIENTS.find(d => ing.toLowerCase().includes(d.term));
    if (match) dentalIngredients.push({ ingredient: ing, benefit: match.benefit });
  }
  // Also check product name for dental treat keywords
  const isDentalTreat = productName && /dental|teeth|breath|tartar|plaque/i.test(productName);
  if (dentalIngredients.length > 0) {
    total += Math.min(dentalIngredients.length * 3, 9);
    breakdown.push({ label: `${dentalIngredients.length} dental-benefit ingredient(s)`, value: Math.min(dentalIngredients.length * 3, 9) });
  }

  total = Math.max(10, Math.min(100, Math.round(total)));
  return {
    score: total,
    flags,
    breakdown,
    ingredientCount: count,
    vitaminFlags,
    dentalIngredients,
    treatProcessingMethod,
  };
}

function getTreatIngredientInfo(
  ing: string,
  position: number,
): { bg: string; textColor: string; tag: string } {
  const lower = ing.toLowerCase();
  // Check treat-specific harmful list first
  const harmful = TREAT_HARMFUL.find(
    (h) => lower.includes(h.term) && (!h.positionCheck || position < 5),
  );
  if (harmful) {
    if (harmful.severity === "toxic")
      return { bg: "#3d0a0a", textColor: "#ff6b6b", tag: "avoid" };
    if (harmful.severity === "severe")
      return { bg: "#3d1010", textColor: "#fc8181", tag: "severe" };
    if (harmful.severity === "moderate")
      return { bg: "#3d2010", textColor: "#f6a35a", tag: "concern" };
    return { bg: "#3d2e10", textColor: "#f6c35a", tag: "mild" };
  }
  if (ADDED_VITAMINS.some((v) => lower.includes(v)))
    return { bg: "#2d2a10", textColor: "#e6c840", tag: "supplement" };
  if (TREAT_OK_INGREDIENTS.some((t) => lower === t || lower.includes(t)))
    return { bg: "#1a2332", textColor: "#6B9EAF", tag: "ok in treats" };
  // Single/whole ingredients
  if (
    SPECIFIC_PROTEIN_TERMS.some((p) => lower.includes(p)) &&
    !lower.includes("meal") &&
    !lower.includes("by-product")
  ) {
    return { bg: "#0d2d1a", textColor: "#2ecc71", tag: "whole food" };
  }
  if (ORGAN_MEATS.some((o) => lower.includes(o) && !lower.includes("meal")))
    return { bg: "#0d2d1a", textColor: "#52be80", tag: "organ" };
  return { bg: "#1a2332", textColor: "#9CA3AF", tag: "" };
}

const GROCERY_FINDS: {
  category: string;
  emoji: string;
  item: string;
  benefit: string;
  where: string;
}[] = [
  {
    category: "Dental",
    emoji: "🥥",
    item: "Coconut Oil",
    benefit:
      "Antimicrobial — rub on teeth/gums, kills bacteria that cause plaque",
    where: "Any grocery store · health food aisle",
  },
  {
    category: "Dental",
    emoji: "🌿",
    item: "Fresh Parsley",
    benefit: "Natural breath freshener — chop a small amount into food",
    where: "Any grocery store · produce",
  },
  {
    category: "Gut Health",
    emoji: "🎃",
    item: "Canned Pumpkin (plain)",
    benefit:
      "Soluble fiber — regulates both diarrhea and constipation, 1-4 tbsp/day",
    where: "Any grocery store · canned goods (NOT pie filling)",
  },
  {
    category: "Gut Health",
    emoji: "🥚",
    item: "Raw Egg",
    benefit:
      "Complete protein, biotin, B12, selenium — crack one over food daily",
    where: "Any grocery store · eggs",
  },
  {
    category: "Joints & Inflammation",
    emoji: "🐟",
    item: "Canned Sardines (in water)",
    benefit:
      "Wild-caught omega-3s — better bioavailability than fish oil capsules, 1-2 sardines/day",
    where: "Any grocery store · canned fish (no salt added if possible)",
  },
  {
    category: "Joints & Inflammation",
    emoji: "🫚",
    item: "Bone Broth (low sodium)",
    benefit:
      "Collagen, glucosamine — supports joints, gut lining, picky eaters",
    where: "Any grocery store · soups/broths (check: no onion, no garlic)",
  },
  {
    category: "Skin & Coat",
    emoji: "🐟",
    item: "Wild Salmon (cooked)",
    benefit:
      "Best natural omega-3 source — feed 1-2x/week for coat and inflammation",
    where: "Grocery store · seafood or frozen",
  },
  {
    category: "Immune & Antioxidants",
    emoji: "🫐",
    item: "Blueberries (fresh or frozen)",
    benefit: "Antioxidants, vitamin C — great low-calorie treat, 5-10/day",
    where: "Any grocery store · produce or frozen",
  },
  {
    category: "Immune & Antioxidants",
    emoji: "🥬",
    item: "Spinach (cooked)",
    benefit:
      "Iron, vitamins K, A, C — lightly steam, no seasoning, small amounts",
    where: "Any grocery store · produce",
  },
  {
    category: "Energy & Carbs",
    emoji: "🍠",
    item: "Sweet Potato (cooked)",
    benefit:
      "Low glycemic carb, beta-carotene, fiber — good for active dogs or kibble-free diets",
    where: "Any grocery store · produce",
  },
  {
    category: "Energy & Carbs",
    emoji: "🍚",
    item: "White Rice (cooked)",
    benefit:
      "Easy to digest carb — great for upset stomachs or transitioning diets",
    where: "Any grocery store · grains",
  },
  {
    category: "Protein Boost",
    emoji: "🐄",
    item: "Beef Heart (raw or cooked)",
    benefit:
      "Muscle meat — highest natural taurine source, CoQ10, B12, iron. Not a true organ, no 10% cap",
    where: "Butcher shop, ethnic grocery stores, some Walmart/Kroger",
  },
  {
    category: "Protein Boost",
    emoji: "🫀",
    item: "Chicken Liver (raw or cooked)",
    benefit:
      "Nature's multivitamin — Vitamin A, B12, folate, iron, copper, zinc. Cap at 10% of diet",
    where: "Any grocery store · meat section or frozen",
  },
  {
    category: "Detox & Liver Support",
    emoji: "🌱",
    item: "Milk Thistle",
    benefit:
      "Silymarin supports liver detox — especially useful after Heartgard, flea/tick meds",
    where: "Health food store, Whole Foods, Amazon",
  },
  {
    category: "Detox & Liver Support",
    emoji: "🥕",
    item: "Carrots (raw)",
    benefit:
      "Fiber, beta-carotene, teeth scraping — good frozen as a chew treat",
    where: "Any grocery store · produce",
  },
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

function detectProcessingMethod(
  name: string,
  ingredients: string[],
  sheetMethod?: string,
) {
  const combined = (
    (sheetMethod || "") +
    " " +
    name +
    " " +
    ingredients.join(" ")
  ).toLowerCase();
  for (const k of PROCESSING_METHODS.raw)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Raw",
        scoreCap: 100,
        penalty: 0,
        emoji: "🌟",
      };
  for (const k of PROCESSING_METHODS.great)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Freeze-Dried",
        scoreCap: 100,
        penalty: 0,
        emoji: "❄️",
      };
  for (const k of PROCESSING_METHODS.gently)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Gently Cooked",
        scoreCap: 88,
        penalty: 0,
        emoji: "🍳",
      };
  for (const k of PROCESSING_METHODS.airDried)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Air-Dried",
        scoreCap: 82,
        penalty: 0,
        emoji: "🌬️",
      };
  for (const k of PROCESSING_METHODS.ok)
    if (combined.includes(k))
      return {
        method: k,
        rating: "OK – Baked",
        scoreCap: 55,
        penalty: 20,
        emoji: "🟡",
      };
  for (const k of PROCESSING_METHODS.bad)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Poor – High Heat Kibble",
        scoreCap: 35,
        penalty: 40,
        emoji: "🔴",
      };
  return {
    method: "Unknown",
    rating: "Unknown – set manually below",
    scoreCap: 75,
    penalty: 5,
    emoji: "❓",
  };
}

function computeOmegaRating(
  omega3: string[],
  omega6: string[],
  actualRatio?: string | null,
  processingMethod?: string,
): { label: string; bonus: number } {
  // If we have an actual GA ratio, always use it — never fall through to ingredient estimation
  if (actualRatio && actualRatio !== "unknown") {
    const ratio = parseFloat(actualRatio.split(":")[0]);
    if (!isNaN(ratio)) {
      if (ratio <= 5)
        return {
          label: `🐟 Excellent omega ratio (${actualRatio}) — anti-inflammatory`,
          bonus: 10,
        };
      if (ratio <= 8)
        return {
          label: `🐟 Good omega ratio (${actualRatio})`,
          bonus: 5,
        };
      if (ratio < 15)
        return {
          label: `🔴 Poor omega ratio (${actualRatio}) — pro-inflammatory`,
          bonus: -10,
        };
      return {
        label: `🔴 Very poor omega ratio (${actualRatio}) — highly pro-inflammatory`,
        bonus: -15,
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

function getIngredientInfo(ing: string): {
  bg: string;
  textColor: string;
  tag: string;
} {
  const lower = ing.toLowerCase();
  const harmful = HARMFUL_INGREDIENTS.find((h: any) => lower.includes(h.term));
  if (harmful) {
    if (harmful.severity === "toxic")
      return { bg: "#3d0a0a", textColor: "#ff6b6b", tag: "avoid" };
    if (harmful.severity === "severe")
      return { bg: "#3d1010", textColor: "#fc8181", tag: "severe" };
    if (harmful.severity === "moderate")
      return { bg: "#3d2010", textColor: "#f6a35a", tag: "concern" };
    if (harmful.severity === "mild")
      return { bg: "#3d2e10", textColor: "#f6c35a", tag: "mild" };
  }
  if (TOXIC_ADDITIVES.some((t: string) => lower.includes(t)))
    return { bg: "#3d0a0a", textColor: "#ff6b6b", tag: "avoid" };
  if (ADDED_VITAMINS.some((v: string) => lower.includes(v)))
    return { bg: "#2d2a10", textColor: "#e6c840", tag: "synthetic" };
  if (MEAT_MEALS.some((m: string) => lower.includes(m)))
    return { bg: "#2d2010", textColor: "#d4a050", tag: "meal" };
  if (LENTIL_LEGUME.some((l: string) => lower.includes(l)))
    return { bg: "#2d1e10", textColor: "#e67e22", tag: "legume" };
  if (HIGH_CARB_INGREDIENTS.some((c: string) => lower.includes(c)))
    return { bg: "#2d2a10", textColor: "#c8b840", tag: "carb" };
  if (
    ORGAN_MEATS.some(
      (o: string) => lower.includes(o) && !lower.includes("meal"),
    )
  )
    return { bg: "#0d2d1a", textColor: "#52be80", tag: "organ" };
  if (OMEGA3_SOURCES.some((o: string) => lower.includes(o)))
    return { bg: "#0d1f2d", textColor: "#5dade2", tag: "omega-3" };
  if (SUPERFOODS.some((s: string) => lower.includes(s)))
    return { bg: "#0d2d1a", textColor: "#2ecc71", tag: "superfood" };
  if (
    SPECIFIC_PROTEIN_TERMS.some((s: string) => lower.includes(s)) &&
    !MEAT_MEALS.some((m: string) => lower.includes(m))
  ) {
    return { bg: "#0d2d1a", textColor: "#2ecc71", tag: "protein" };
  }
  return { bg: "#1a2332", textColor: "#9CA3AF", tag: "" };
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#27ae60";
  if (score >= 50) return "#f39c12";
  if (score >= 30) return "#e67e22";
  return "#c0392b";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Good 👍";
  if (score >= 50) return "Fair ⚠️";
  if (score >= 30) return "Poor ❌";
  return "Very Poor 🚫";
}

function getTreatScoreLabel(score: number): string {
  if (score >= 90) return "Single Ingredient ⭐";
  if (score >= 80) return "Excellent 👍";
  if (score >= 65) return "Good Treat ✓";
  if (score >= 50) return "Acceptable ⚠️";
  if (score >= 35) return "Use Sparingly ❌";
  return "Avoid 🚫";
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lastBarcode, setLastBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<
    { name: string; reason: string; severity: string }[]
  >([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [vitamins, setVitamins] = useState<string[]>([]);
  const [toxicAdditives, setToxicAdditives] = useState<string[]>([]);
  const [legumes, setLegumes] = useState<string[]>([]);
  const [highCarbs, setHighCarbs] = useState<string[]>([]);
  const [omega3Found, setOmega3Found] = useState<string[]>([]);
  const [omega6Found, setOmega6Found] = useState<string[]>([]);
  const [omegaRating, setOmegaRating] = useState<{
    label: string;
    bonus: number;
  } | null>(null);
  const [fiberFound, setFiberFound] = useState<string[]>([]);
  const [probioticsFound, setProbioticsFound] = useState<string[]>([]);
  const [sourcingIssues, setSourcingIssues] = useState<string[]>([]);
  const [aafcoStatus, setAafcoStatus] = useState("");
  const [onTAPFList, setOnTAPFList] = useState(false);
  const [processing, setProcessing] = useState<{
    method: string;
    rating: string;
    scoreCap: number;
    penalty: number;
    emoji: string;
  } | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [vitaminScore, setVitaminScore] = useState<{
    count: number;
    penalty: number;
    level: string;
  }>({ count: 0, penalty: 0, level: "" });
  const [dataSource, setDataSource] = useState("");
  const [error, setError] = useState("");
  const [supabaseAnalysis, setSupabaseAnalysis] = useState<any>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const scanningRef = useRef(false);
  const cameraRef = useRef<any>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scanMode, setScanMode] = useState<"smart" | "manual" | "treats">(
    "smart",
  );
  const [manualIngredientText, setManualIngredientText] = useState("");
  const [manualProductName, setManualProductName] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [treatScore, setTreatScore] = useState<number | null>(null);
  const [treatFlags, setTreatFlags] = useState<
    { name: string; reason: string; severity: string }[]
  >([]);
  const [treatVitaminFlags, setTreatVitaminFlags] = useState<string[]>([]);
  const [treatIngredientCount, setTreatIngredientCount] = useState<number>(0);
  const [treatDentalIngredients, setTreatDentalIngredients] = useState<{ ingredient: string; benefit: string }[]>([]);
  const [treatProcessingMethod, setTreatProcessingMethod] = useState<string>('');
  const [isTreatScan, setIsTreatScan] = useState(false);
  const [expandedConcerns, setExpandedConcerns] = useState<Set<number>>(
    new Set(),
  );
  const [smartScanStep, setSmartScanStep] = useState("");
  const [showIngredientScanPrompt, setShowIngredientScanPrompt] =
    useState(false);
  const [recallAlert, setRecallAlert] = useState<{
    found: boolean;
    description: string;
    date: string;
    url: string;
  } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [coachVisible, setCoachVisible] = useState(false);
  const [coachMessages, setCoachMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [ingredientDetailVisible, setIngredientDetailVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredientDetailData, setIngredientDetailData] = useState<any>(null);
  const [ingredientDetailLoading, setIngredientDetailLoading] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<
    { label: string; value: number }[]
  >([]);
  const [manualProcessingMode, setManualProcessingMode] = useState<
    "barcode" | "label"
  >("barcode");
  const [dbAvoidFlags, setDbAvoidFlags] = useState<
    { ingredient: string; nutrientName: string; flag: string }[]
  >([]);
  const [dbPoorFormFlags, setDbPoorFormFlags] = useState<
    { ingredient: string; nutrientName: string; flag: string }[]
  >([]);
  const [dbCombinationWarnings, setDbCombinationWarnings] = useState<
    { nutrientName: string; warning: string }[]
  >([]);
  const [ingredientAnalysis, setIngredientAnalysis] = useState<
    Record<string, any>
  >({});
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [nutritionalProfile, setNutritionalProfile] = useState<{
    protein_pct: number | null;
    fat_pct: number | null;
    fiber_pct: number | null;
    moisture_pct: number | null;
    carb_pct: number | null;
    omega_ratio: string | null;
  } | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          We need camera access to scan barcodes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showDisclaimer) {
    return (
      <View style={styles.disclaimerScreen}>
        <View style={styles.disclaimerIconWrap}>
          <Text style={styles.disclaimerIcon}>🐾</Text>
        </View>
        <Text style={styles.disclaimerAppName}>PawGrade</Text>
        <Text style={styles.disclaimerTagline}>
          AI-Powered Dog Food Analyzer
        </Text>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerCardTitle}>Before you start</Text>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerRowIcon}>ℹ️</Text>
            <Text style={styles.disclaimerRowText}>
              Scores are educational assessments based on published pet
              nutrition research — not veterinary advice.
            </Text>
          </View>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerRowIcon}>🏥</Text>
            <Text style={styles.disclaimerRowText}>
              Always consult your veterinarian before changing your pet's diet.
            </Text>
          </View>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerRowIcon}>🔬</Text>
            <Text style={styles.disclaimerRowText}>
              Ingredient assessments reference research from the ASPCA, WHO,
              NIH, FDA, and peer-reviewed veterinary literature.
            </Text>
          </View>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerRowIcon}>🏷️</Text>
            <Text style={styles.disclaimerRowText}>
              Brand names are used for identification only. This app is not
              affiliated with any pet food manufacturer.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDisclaimer(false)}
        >
          <Text style={styles.buttonText}>I Understand — Let's Scan</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimerFooter}>
          By continuing, you agree this app provides information only and is not
          a substitute for professional veterinary advice.
        </Text>
      </View>
    );
  }

  if (showGuide) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D0D1A" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            paddingTop: 56,
            borderBottomWidth: 1,
            borderBottomColor: "#1a2332",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowGuide(false)}
            style={{ marginRight: 12 }}
          >
            <Text style={{ color: "#2ECC71", fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            📚 Ingredient Guide
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* VITAMINS */}
          <Text
            style={{
              color: "#2ECC71",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 12,
            }}
          >
            Vitamins
          </Text>

          {[
            {
              name: "Vitamin A",
              rating: "⚠️",
              form: "Retinyl Palmitate / Acetate",
              risk: "Fat-soluble — accumulates in liver. Toxic in excess (bone pain, liver damage). Double-flag if food has liver AND synthetic Vitamin A.",
            },
            {
              name: "Vitamin B1 (Thiamine)",
              rating: "✅",
              form: "Thiamine Mononitrate",
              risk: "Safe synthetic. Deficiency causes neurological issues. Excess excreted.",
            },
            {
              name: "Vitamin B2 (Riboflavin)",
              rating: "✅",
              form: "Riboflavin",
              risk: "Very safe. Synthetic identical to natural.",
            },
            {
              name: "Vitamin B3 (Niacin)",
              rating: "✅",
              form: "Niacin / Niacinamide",
              risk: "Safe at normal levels. Deficiency causes black tongue disease in dogs.",
            },
            {
              name: "Vitamin B5 (Pantothenic Acid)",
              rating: "✅",
              form: "Calcium Pantothenate",
              risk: "Very safe. Excess excreted.",
            },
            {
              name: "Vitamin B6 (Pyridoxine)",
              rating: "⚠️",
              form: "Pyridoxine Hydrochloride",
              risk: "Safe at normal levels. Chronic excess causes peripheral neuropathy — nerve damage in limbs.",
            },
            {
              name: "Vitamin B9 (Folic Acid)",
              rating: "✅",
              form: "Folic Acid",
              risk: "Low toxicity. Critical for pregnant dogs.",
            },
            {
              name: "Vitamin B12 (Cobalamin)",
              rating: "⚠️",
              form: "Cyanocobalamin (inferior) / Methylcobalamin (preferred)",
              risk: "Methylcobalamin is the better bioavailable form. Cyanocobalamin is safe but lower quality — signals cheaper formulation.",
            },
            {
              name: "Vitamin C",
              rating: "✅",
              form: "Ascorbic Acid",
              risk: "Dogs make their own Vitamin C. Supplemental excess can cause kidney oxalate stones in prone breeds.",
            },
            {
              name: "Vitamin D3",
              rating: "🚨",
              form: "Cholecalciferol",
              risk: "Most dangerous vitamin for dogs in excess. Multiple FDA recalls from D3 overdose causing kidney failure and death. Extremely narrow safe range — 3.4 IU/kg/day.",
            },
            {
              name: "Vitamin E",
              rating: "⚠️",
              form: "dl-Alpha Tocopherol (synthetic) vs d-Alpha Tocopherol (natural)",
              risk: 'Natural d-alpha (no "l") is more bioavailable. Synthetic dl-alpha is okay but lower quality. Very high doses interfere with Vitamin K.',
            },
            {
              name: "Vitamin K",
              rating: "🚨",
              form: "Menadione (K3 — AVOID) / K1 phylloquinone (safe)",
              risk: "Menadione (synthetic K3) causes liver toxicity, hemolytic anemia, immune damage. Banned in human supplements but still used in pet food. Always flag menadione.",
            },
            {
              name: "Biotin (B7)",
              rating: "✅",
              form: "D-Biotin",
              risk: "Very safe. Note: raw egg whites block biotin absorption.",
            },
            {
              name: "Choline",
              rating: "✅",
              form: "Choline Chloride",
              risk: "Essential nutrient. Generally safe. Very high doses can stress liver.",
            },
          ].map((v, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#1a2332",
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  {v.name}
                </Text>
                <Text style={{ fontSize: 16 }}>{v.rating}</Text>
              </View>
              <Text style={{ color: "#5dade2", fontSize: 11, marginBottom: 4 }}>
                Form: {v.form}
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 17 }}>
                {v.risk}
              </Text>
            </View>
          ))}

          {/* MINERALS */}
          <Text
            style={{
              color: "#2ECC71",
              fontSize: 16,
              fontWeight: "800",
              marginTop: 16,
              marginBottom: 12,
            }}
          >
            Minerals
          </Text>

          {[
            {
              name: "Calcium",
              rating: "⚠️",
              form: "Calcium Carbonate / Dicalcium Phosphate",
              risk: "Excess causes skeletal deformities in large-breed puppies and kidney stones. Balance with phosphorus (ideal ratio 1.2:1 Ca:P).",
            },
            {
              name: "Phosphorus",
              rating: "⚠️",
              form: "Dicalcium Phosphate",
              risk: "Excess damages kidneys over time. Critical concern for dogs with kidney disease — high phosphorus accelerates CKD progression.",
            },
            {
              name: "Magnesium",
              rating: "⚠️",
              form: "Magnesium Oxide (poor) / Magnesium Citrate (better)",
              risk: "Magnesium oxide is cheap and poorly absorbed — causes GI upset. Citrate or glycinate forms are better.",
            },
            {
              name: "Potassium",
              rating: "✅",
              form: "Potassium Chloride",
              risk: "Safe at normal levels. Deficiency causes muscle weakness and heart arrhythmia.",
            },
            {
              name: "Sodium",
              rating: "⚠️",
              form: "Sodium Chloride (salt)",
              risk: "Excess causes hypertension and kidney strain. Flag high sodium for dogs with heart or kidney disease.",
            },
            {
              name: "Zinc",
              rating: "⚠️",
              form: "Zinc Sulfate / Zinc Oxide (poor) / Zinc Proteinate (best)",
              risk: "Zinc proteinate is best. Zinc oxide poorly absorbed. Toxicity causes hemolytic anemia and liver damage. Huskies and Malamutes have zinc malabsorption risk.",
            },
            {
              name: "Iron",
              rating: "⚠️",
              form: "Ferrous Sulfate (ok) / Ferric Oxide (avoid)",
              risk: "Ferric oxide is a cosmetic colorant with zero nutritional value — always flag it. Ferrous sulfate is the acceptable supplemental form.",
            },
            {
              name: "Copper",
              rating: "🚨",
              form: "Copper Sulfate (poor) / Copper Proteinate (safer)",
              risk: "Labs, Bedlington Terriers, and Dalmatians are genetically prone to copper accumulation causing liver cirrhosis and failure. Copper proteinate is safer than copper sulfate.",
            },
            {
              name: "Manganese",
              rating: "✅",
              form: "Manganese Sulfate / Manganese Proteinate",
              risk: "Generally safe. Proteinate form better absorbed than sulfate.",
            },
            {
              name: "Selenium",
              rating: "⚠️",
              form: "Sodium Selenite (poor) / Selenium Yeast (better)",
              risk: "Very narrow safe range — excess causes vomiting, hair loss, neurological damage, death at high doses. Selenium yeast is safer and more bioavailable than sodium selenite.",
            },
            {
              name: "Iodine",
              rating: "⚠️",
              form: "Potassium Iodide / Calcium Iodate",
              risk: "Excess can cause hypothyroidism or hyperthyroidism. Flag products with both added iodine AND kelp/seaweed — double iodine source risks thyroid disruption.",
            },
            {
              name: "Taurine",
              rating: "🚨",
              form: "Taurine (synthetic — safe)",
              risk: "Deficiency linked to DCM (dilated cardiomyopathy) — especially in grain-free diets with legumes. FDA investigated this link. Flag absence in grain-free formulas with peas/lentils.",
            },
          ].map((m, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#1a2332",
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  {m.name}
                </Text>
                <Text style={{ fontSize: 16 }}>{m.rating}</Text>
              </View>
              <Text style={{ color: "#5dade2", fontSize: 11, marginBottom: 4 }}>
                Form: {m.form}
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 17 }}>
                {m.risk}
              </Text>
            </View>
          ))}

          {/* PROTEINS */}
          <Text
            style={{
              color: "#2ECC71",
              fontSize: 16,
              fontWeight: "800",
              marginTop: 16,
              marginBottom: 12,
            }}
          >
            Protein Sources
          </Text>

          {[
            {
              name: "Chicken",
              allergen: "🔴 High allergen",
              digestibility: "90%+",
              note: "Most common dog food allergen. If dog shows itching, ear infections, GI issues — suspect chicken first.",
            },
            {
              name: "Beef",
              allergen: "🟠 Medium-high allergen",
              digestibility: "High",
              note: "Second most common allergen. Rich in fat — monitor for pancreatitis-prone dogs.",
            },
            {
              name: "Salmon",
              allergen: "🟡 Medium",
              digestibility: "95%+",
              note: "Excellent Omega-3 source. Wild-caught preferred over farmed. Farmed may contain higher PCBs long-term.",
            },
            {
              name: "Turkey",
              allergen: "🟠 Medium",
              digestibility: "High",
              note: "Good alternative for chicken-allergic dogs. Cross-reactivity possible in highly sensitized dogs.",
            },
            {
              name: "Duck",
              allergen: "🟡 Medium-low",
              digestibility: "High",
              note: "Good novel protein. Higher fat content — monitor weight in less active dogs.",
            },
            {
              name: "Lamb",
              allergen: "🟡 Medium",
              digestibility: "High",
              note: "Good novel protein for sensitive dogs. Higher fat than chicken.",
            },
            {
              name: "Venison",
              allergen: "🟢 Low",
              digestibility: "High",
              note: "Excellent novel protein. Rarely allergenic. Lean. Great for food-sensitive dogs.",
            },
            {
              name: "Rabbit",
              allergen: "🟢 Low",
              digestibility: "High",
              note: "Best novel protein for severely allergic dogs. Almost never an allergen. Very lean.",
            },
            {
              name: "Herring",
              allergen: "🟡 Medium",
              digestibility: "95%+",
              note: "Excellent Omega-3 source. Lower mercury than large fish like tuna. Great for skin and coat.",
            },
            {
              name: "Tuna",
              allergen: "🟡 Medium",
              digestibility: "95%+",
              note: "⚠️ High mercury content. Fine occasionally but daily feeding causes mercury accumulation — especially concerning for small dogs.",
            },
            {
              name: "Egg",
              allergen: "🟠 Medium",
              digestibility: "100% (highest)",
              note: "Highest biological value protein available. Gold standard. Some dogs sensitive to egg whites specifically.",
            },
            {
              name: "Bison",
              allergen: "🟢 Low",
              digestibility: "High",
              note: "Premium novel protein. Grass-fed typically. Rarely allergenic. Good for sensitive dogs.",
            },
            {
              name: "Pork",
              allergen: "🟡 Medium",
              digestibility: "High",
              note: "Good novel protein. Higher fat — pancreatitis risk in prone dogs.",
            },
          ].map((p, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#1a2332",
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  {p.name}
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 11 }}>
                  {p.allergen}
                </Text>
              </View>
              <Text style={{ color: "#5dade2", fontSize: 11, marginBottom: 4 }}>
                Digestibility: {p.digestibility}
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 17 }}>
                {p.note}
              </Text>
            </View>
          ))}

          {/* PROCESSING METHODS */}
          <Text
            style={{
              color: "#2ECC71",
              fontSize: 16,
              fontWeight: "800",
              marginTop: 16,
              marginBottom: 12,
            }}
          >
            Processing Methods — Best to Worst
          </Text>

          {[
            {
              rank: "1",
              name: "Home Cooked",
              emoji: "🏠",
              color: "#27ae60",
              pros: "Full control over every ingredient. No preservatives, no synthetic additives, human-grade whole foods.",
              cons: "Requires careful formulation to meet AAFCO guidelines — vitamin and mineral balance is critical. Work with a veterinary nutritionist or use a service like BalanceIT or JustFoodForDogs recipes to ensure complete nutrition.",
              warning:
                "⚠️ Home cooked diets that are not properly formulated can cause serious deficiencies over time (zinc, calcium, B vitamins, Vitamin D). Always verify AAFCO compliance before feeding long term.",
            },
            {
              rank: "2",
              name: "Raw (Pathogen-Controlled)",
              emoji: "🌟",
              color: "#27ae60",
              pros: "Highest enzyme retention (~95%). Most bioavailable nutrients. Closest to ancestral diet. Ideal omega ratio when properly formulated.",
              cons: "Pathogen risk (Salmonella, E. coli, Listeria) if not handled carefully. Must be from a reputable source with pathogen testing (HPP-treated preferred). Not recommended for immunocompromised dogs or households.",
              warning:
                "⚠️ Look for HPP (High Pressure Processing) treated raw — kills pathogens without heat. Brands like Primal, Vital Essentials, Small Batch use HPP.",
            },
            {
              rank: "3",
              name: "Freeze-Dried",
              emoji: "❄️",
              color: "#27ae60",
              pros: "Near-raw nutrition — enzymes and nutrients preserved without heat. Lightweight, shelf stable. Convenient alternative to raw.",
              cons: "Expensive per serving. Rehydration required for some products. Quality varies by brand.",
              warning: null,
            },
            {
              rank: "4",
              name: "Gently Cooked",
              emoji: "🍳",
              color: "#2ecc71",
              pros: "Human-grade ingredients. Low heat preserves more nutrients than kibble. Whole food proteins. Much better bioavailability than dry food.",
              cons: "Some enzyme loss from heat above 118°F. Shorter shelf life, requires refrigeration. More expensive than kibble.",
              warning: null,
            },
            {
              rank: "5",
              name: "Dehydrated",
              emoji: "🌿",
              color: "#2ecc71",
              pros: "Low heat (104–118°F) preserves most enzymes and nutrients. Human-grade ingredients (Honest Kitchen). Just add water. Better than canned or kibble.",
              cons: "Higher carb content in some formulas (Honest Kitchen Whole Grain ~40%). Rehydration required.",
              warning: null,
            },
            {
              rank: "6",
              name: "Air-Dried",
              emoji: "🌬️",
              color: "#f39c12",
              pros: "Slow drying at low temperature preserves more nutrients than baking or extrusion. Convenient, shelf stable. Better than kibble.",
              cons: "Not as nutrient-dense as freeze-dried or raw. Some enzyme loss. Expensive.",
              warning: null,
            },
            {
              rank: "7",
              name: "Canned / Wet Food",
              emoji: "🥫",
              color: "#f39c12",
              pros: "High moisture content (good for hydration). Whole food ingredients. No artificial preservatives needed (sealed can). Better than dry food for ingredient quality.",
              cons: "Retort processed at 240–250°F — hotter than kibble in some cases. Destroys most enzymes and heat-sensitive vitamins. Heavy synthetic supplementation added back after processing.",
              warning:
                "⚠️ Despite better ingredients, canned food is heavily heat processed. Better than kibble for hydration and ingredient quality but not as nutritious as raw, freeze-dried, or gently cooked.",
            },
            {
              rank: "8",
              name: "Baked",
              emoji: "🟡",
              color: "#e67e22",
              pros: "Lower heat than extrusion. Slightly better nutrient retention than kibble. Some whole food ingredients.",
              cons: "Still reaches temperatures that destroy most enzymes and degrade heat-sensitive vitamins (B1, B9, C). Requires heavy synthetic supplementation. Limited brands use this method.",
              warning: null,
            },
            {
              rank: "9",
              name: "Dry / Kibble (Extruded)",
              emoji: "🔴",
              color: "#c0392b",
              pros: "Convenient, affordable, shelf stable, widely available.",
              cons: "Extruded at 250–300°F — destroys virtually all enzymes and denatures heat-sensitive nutrients. Synthetic vitamin premix added back post-processing. Lowest bioavailability of any pet food format. Most formulas contain preservatives, fillers, and poor-quality ingredients.",
              warning:
                "🚨 Most kibble runs an omega-6 to omega-3 ratio of 15:1–30:1 (ideal is 5:1). Enzyme supplementation recommended. If feeding kibble long term, choose the cleanest label possible and add whole food toppers.",
            },
            {
              rank: "10",
              name: "Semi-Moist / Pellets",
              emoji: "🚫",
              color: "#7b241c",
              pros: "Palatable, convenient.",
              cons: "Worst category. High in sugar, propylene glycol, artificial colors, and humectants to maintain soft texture. High carb content. Heavily processed. Virtually no nutritional value beyond basic calories.",
              warning:
                "🚨 Avoid. The preservatives and humectants required to keep semi-moist food shelf stable at room temperature make this the least healthy option in any pet food category.",
            },
          ].map((p, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#1a2332",
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: p.color,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: p.color,
                    fontWeight: "800",
                    fontSize: 13,
                    marginRight: 6,
                  }}
                >
                  #{p.rank}
                </Text>
                <Text style={{ fontSize: 16, marginRight: 6 }}>{p.emoji}</Text>
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
                >
                  {p.name}
                </Text>
              </View>
              <Text
                style={{
                  color: "#2ecc71",
                  fontSize: 11,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                ✅ Pros:
              </Text>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 12,
                  lineHeight: 17,
                  marginBottom: 6,
                }}
              >
                {p.pros}
              </Text>
              <Text
                style={{
                  color: "#e67e22",
                  fontSize: 11,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                ⚠️ Cons:
              </Text>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 12,
                  lineHeight: 17,
                  marginBottom: p.warning ? 6 : 0,
                }}
              >
                {p.cons}
              </Text>
              {p.warning && (
                <Text
                  style={{
                    color: "#FC8181",
                    fontSize: 11,
                    lineHeight: 16,
                    marginTop: 4,
                  }}
                >
                  {p.warning}
                </Text>
              )}
            </View>
          ))}

          {/* KEY RULES */}
          <Text
            style={{
              color: "#2ECC71",
              fontSize: 16,
              fontWeight: "800",
              marginTop: 16,
              marginBottom: 12,
            }}
          >
            Key Rules to Know
          </Text>
          {[
            {
              icon: "🚨",
              title: "Vitamin D3 (Cholecalciferol)",
              body: "Most dangerous vitamin for dogs in excess. Multiple FDA recalls. Dogs cannot tolerate excess D3 like humans can.",
            },
            {
              icon: "🚨",
              title: "Menadione (Vitamin K3)",
              body: "Always flag. Causes liver toxicity and hemolytic anemia. Banned in human supplements but still used in pet food.",
            },
            {
              icon: "🚨",
              title: "Ferric Oxide",
              body: "Not a nutrient — it's a colorant. Has zero nutritional value. Used to make food look more appealing.",
            },
            {
              icon: "🚨",
              title: "Copper (Lab, Bedlington, Dalmatian)",
              body: "These breeds are genetically prone to copper accumulation causing liver disease. Always flag high copper content for these breeds.",
            },
            {
              icon: "⚠️",
              title: "Selenium — Very Narrow Safe Range",
              body: "Selenium yeast is safer than sodium selenite. Very small difference between adequate and toxic dose.",
            },
            {
              icon: "⚠️",
              title: "Taurine + Grain-Free",
              body: "If food is grain-free with legumes (peas, lentils, chickpeas) AND has no added taurine — flag DCM risk. FDA investigated this link.",
            },
            {
              icon: "⚠️",
              title: "Iodine + Kelp",
              body: "Products with both added iodine AND kelp/seaweed have a double iodine source. Risk of thyroid disruption.",
            },
          ].map((r, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#1a1a2e",
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: r.icon === "🚨" ? "#c0392b" : "#f39c12",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                {r.icon} {r.title}
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 17 }}>
                {r.body}
              </Text>
            </View>
          ))}

          <Text
            style={{
              color: "#6B7280",
              fontSize: 11,
              textAlign: "center",
              marginTop: 16,
              marginBottom: 32,
            }}
          >
            Sources: ASPCA, NIH, WHO, FDA, NRC Guidelines, peer-reviewed
            veterinary nutrition literature
          </Text>
        </ScrollView>
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.notFoundScreen}>
        <Text style={styles.notFoundEmoji}>📷</Text>
        <Text style={styles.notFoundTitle}>Point at the Ingredient List</Text>
        <Text style={styles.notFoundText}>
          This barcode isn't in our database yet. Flip the bag over and point your camera at the ingredient list for an instant analysis.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setNotFound(false);
            setScanned(false);
            scanningRef.current = false;
            setScanMode("smart");
          }}
        >
          <Text style={styles.buttonText}>📷 Scan Ingredient List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 10, backgroundColor: '#1a2332' }]}
          onPress={() => {
            setNotFound(false);
            setScanned(false);
            scanningRef.current = false;
            setScanMode("manual");
          }}
        >
          <Text style={styles.buttonText}>✏️ Enter Ingredients Manually</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setNotFound(false);
            setScanned(false);
            scanningRef.current = false;
          }}
        >
          <Text style={styles.cancelText}>← Try Another Barcode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const applyGA = (ga: any) => {
    const carbPct =
      ga.protein_pct != null &&
      ga.fat_pct != null &&
      ga.fiber_pct != null &&
      ga.moisture_pct != null
        ? Math.max(
            0,
            Math.round(
              100 -
                ga.protein_pct -
                ga.fat_pct -
                ga.fiber_pct -
                ga.moisture_pct -
                7,
            ),
          )
        : null;
    let omegaRatioStr: string | null = null;
    if (ga.omega6_pct != null && ga.omega3_pct != null && ga.omega3_pct > 0) {
      const ratio = Math.round((ga.omega6_pct / ga.omega3_pct) * 10) / 10;
      omegaRatioStr = `${ratio}:1`;
    }
    setNutritionalProfile({
      protein_pct: ga.protein_pct,
      fat_pct: ga.fat_pct,
      fiber_pct: ga.fiber_pct,
      moisture_pct: ga.moisture_pct,
      carb_pct: carbPct,
      omega_ratio: omegaRatioStr,
    });
    if (lastBarcode) saveProductGA(lastBarcode, ga).catch(() => {});
  };

  const checkFDARecall = async (brand: string) => {
    if (!brand || brand.length < 3) return;
    try {
      const query = encodeURIComponent(brand);
      const url = `https://api.fda.gov/food/enforcement.json?search=recalling_firm:"${query}"+AND+product_description:"dog"&limit=5&sort=recall_initiation_date:desc`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        const recall = json.results[0];
        // Only flag if within last 3 years
        const recallYear = parseInt(
          (recall.recall_initiation_date || "").slice(0, 4),
          10,
        );
        if (recallYear >= new Date().getFullYear() - 3) {
          setRecallAlert({
            found: true,
            description: recall.product_description || "Product recall on file",
            date: recall.recall_initiation_date || "",
            url: `https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts?search=${encodeURIComponent(brand)}`,
          });
        }
      }
    } catch (e) {
      // Recall check is best-effort — never block the main flow
    }
  };


  const handleSmartScan = async () => {
    if (!cameraRef.current || scanningRef.current) return;
    scanningRef.current = true;
    // Capture photo FIRST before any state changes to avoid camera unmounting
    let photo: { base64?: string; uri?: string } | null = null;
    try {
      photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.8,
        imageType: "jpg",
      });
    } catch (e) {
      scanningRef.current = false;
      setError("Could not capture photo. Try again.");
      return;
    }
    if (!photo?.uri) {
      scanningRef.current = false;
      setError("Could not capture photo. Try again.");
      return;
    }
    // Resize to max 1024px wide before sending to Claude — fixes iPad large image issue
    let base64Image = "";
    try {
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );
      base64Image = resized.base64 || "";
    } catch (e) {
      scanningRef.current = false;
      setError("Could not process photo. Try again.");
      return;
    }
    if (!base64Image) {
      scanningRef.current = false;
      setError("Could not process photo. Try again.");
      return;
    }
    setScanned(true);
    setLoading(true);
    setNotFound(false);
    setError("");
    setShowIngredientScanPrompt(false);
    setIsTreatScan(false);
    setIngredients([]);
    setFlagged([]);
    setMeals([]);
    setVitamins([]);
    setToxicAdditives([]);
    setLegumes([]);
    setHighCarbs([]);
    setOmega3Found([]);
    setOmega6Found([]);
    setOmegaRating(null);
    setFiberFound([]);
    setSourcingIssues([]);
    setAafcoStatus("");
    setOnTAPFList(false);
    setProcessing(null);
    setScore(null);
    setProductName("");
    setDbAvoidFlags([]);
    setDbPoorFormFlags([]);
    setDbCombinationWarnings([]);
    setRecallAlert(null);
    setTreatScore(null);
    setTreatFlags([]);
    setTreatVitaminFlags([]);
    setExpandedConcerns(new Set());
    setSmartScanStep("Analyzing image...");
    setDataSource("📷 Smart Scan...");
    try {
      const result = await smartScanWithClaude(base64Image);

      // Treats mode — same Claude vision call but route to treat scorer
      if (scanMode === "treats") {
        if (!result.found || !result.ingredients) {
          setError(
            "Couldn't read the ingredient list — point at the ingredients panel and try again.",
          );
          scanningRef.current = false;
          setLoading(false);
          setSmartScanStep("");
          return;
        }
        setSmartScanStep("");
        await handleTreatScan(
          result.ingredients,
          result.product_name || result.brand || "Scanned Treat",
          result.processing_method,
        );
        scanningRef.current = false;
        return;
      }

      if (!result.found) {
        const detail = result.error ? ` (${result.error})` : "";
        setError(
          `Couldn't read the bag — try better lighting or get closer, then tap capture again.${detail}`,
        );
        scanningRef.current = false;
        setLoading(false);
        setSmartScanStep("");
        return;
      }

      // Apply AAFCO status from scan result if Claude detected the nutritional adequacy statement
      const applyScannedAafco = () => {
        if (result.aafco_status === "feeding_trials")
          setAafcoStatus("✅ AAFCO Feeding Trials (gold standard)");
        else if (result.aafco_status === "nutrient_profile")
          setAafcoStatus("🟡 AAFCO Nutrient Profile only");
      };

      // Safety override: if ingredients present regardless of scan_type, treat as ingredient scan
      const hasIngredients =
        result.ingredients && result.ingredients.length > 10;
      const effectiveScanType = hasIngredients
        ? result.scan_type === "front_of_bag"
          ? "full_label"
          : result.scan_type
        : result.scan_type;

      if (effectiveScanType === "front_of_bag") {
        // Read brand/product name from bag front — look up ingredients
        const identified = [result.brand, result.product_name]
          .filter(Boolean)
          .join(" ");
        setSmartScanStep(
          `Identified: ${identified} — looking up ingredients...`,
        );
        setDataSource("📷 Smart Scan — Front of Bag");
        setProductName(
          result.product_name || result.brand || "Scanned Product",
        );

        // Try Supabase cache by name first
        const cached = await lookupProductByName(
          result.product_name,
          result.brand,
        );
        if (cached && cached.ingredients) {
          const ingredientList: string[] = cached.ingredients
            .split(/,|;/)
            .map((i: string) => i.trim())
            .filter((i: string) => i.length > 0);
          setIngredients(ingredientList);
          if (cached.protein_pct != null || cached.fat_pct != null) {
            applyGA(cached);
          }
          setSmartScanStep("Scoring formula...");
          await processIngredients(
            cached.product_name,
            cached.ingredients,
            ingredientList,
            cached.processing_method || "",
          );
          applyScannedAafco();
        } else {
          // Fall back to Claude ingredient lookup
          setSmartScanStep("Looking up ingredients...");
          const claudeResult = await lookupIngredientsWithClaude(
            result.product_name || result.brand,
            result.brand,
          );
          if (claudeResult.found) {
            const rawIngredients = claudeResult.ingredients;
            const ingredientList: string[] = rawIngredients
              .split(/,|;/)
              .map((i: string) => i.trim())
              .filter((i: string) => i.length > 0);
            setIngredients(ingredientList);
            setSmartScanStep("Scoring formula...");
            await processIngredients(
              claudeResult.product_name || result.product_name || "",
              rawIngredients,
              ingredientList,
              claudeResult.processing_method || "",
            );
            if (claudeResult.aafco_status === "feeding_trials")
              setAafcoStatus("✅ AAFCO Feeding Trials (gold standard)");
            else if (claudeResult.aafco_status === "nutrient_profile")
              setAafcoStatus("🟡 AAFCO Nutrient Profile only");
            else applyScannedAafco();
            if (claudeResult.guaranteed_analysis)
              applyGA(claudeResult.guaranteed_analysis);
            saveProduct(
              "smart-" + Date.now(),
              claudeResult.product_name || result.product_name || "",
              claudeResult.brand || result.brand || "",
              rawIngredients,
              claudeResult.processing_method || "",
            ).catch(() => {});
            saveToGoogleSheet(
              "smart-scan",
              claudeResult.product_name || "",
              claudeResult.brand || "",
              rawIngredients,
              claudeResult.processing_method || "",
              null,
            ).catch(() => {});
          } else {
            setShowIngredientScanPrompt(true);
            setError("");
            scanningRef.current = false;
          }
        }
      } else if (effectiveScanType === "guaranteed_analysis") {
        // GA panel only — patch nutritional profile, no full re-analysis
        setDataSource("📷 Smart Scan — GA Panel");
        if (result.guaranteed_analysis) applyGA(result.guaranteed_analysis);
        if (result.product_name) setProductName(result.product_name);
        setSmartScanStep("");
        if (!ingredients || ingredients.length === 0) {
          setError(
            "Nutritional data captured. Scan the ingredient list or barcode for a full analysis.",
          );
          scanningRef.current = false;
        }
      } else {
        // ingredient_list, ingredient_and_ga, or full_label — full analysis
        setDataSource("📷 Smart Scan — Ingredient Label");
        const rawIngredients = result.ingredients;
        const ingredientList: string[] = rawIngredients
          .split(/,|;/)
          .map((i: string) => i.trim())
          .filter((i: string) => i.length > 0);
        setIngredients(ingredientList);
        setProductName(result.product_name || "Scanned Product");
        if (result.guaranteed_analysis) applyGA(result.guaranteed_analysis);
        setSmartScanStep("Scoring formula...");
        await processIngredients(
          result.product_name || "",
          rawIngredients,
          ingredientList,
          result.processing_method || "",
        );
        applyScannedAafco();
        saveToGoogleSheet(
          "smart-scan",
          result.product_name || "Scanned Product",
          result.brand || "",
          rawIngredients,
          result.processing_method || "",
          null,
        ).catch(() => {});
      }
    } catch (e: any) {
      console.log("Smart scan error:", e);
      setError("Scan failed — check your internet connection and try again.");
    }
    scanningRef.current = false;
    setSmartScanStep("");
    setLoading(false);
  };

  const handleManualAnalyze = async () => {
    const raw = manualIngredientText.trim();
    if (!raw) return;
    const ingredientList = raw
      .split(/,|;|\n/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    if (ingredientList.length === 0) return;

    setScanned(true);
    setLoading(true);
    setNotFound(false);
    setError("");
    setIngredients([]);
    setFlagged([]);
    setMeals([]);
    setVitamins([]);
    setToxicAdditives([]);
    setLegumes([]);
    setHighCarbs([]);
    setOmega3Found([]);
    setOmega6Found([]);
    setOmegaRating(null);
    setFiberFound([]);
    setSourcingIssues([]);
    setAafcoStatus("");
    setOnTAPFList(false);
    setProcessing(null);
    setScore(null);
    setDbAvoidFlags([]);
    setDbPoorFormFlags([]);
    setDbCombinationWarnings([]);
    setRecallAlert(null);
    setTreatScore(null);
    setTreatFlags([]);
    setTreatVitaminFlags([]);
    setExpandedConcerns(new Set());
    setDataSource("✏️ Manual Entry");
    setIsTreatScan(false);

    const name = manualProductName.trim() || "Analyzed Product";
    const barcodeOverride = manualBarcode.trim() || lastBarcode || "";
    setProductName(name);
    setIngredients(ingredientList);

    await processIngredients(name, raw, ingredientList, "");
    const saveResult = await saveProduct(barcodeOverride, name, "", raw, "unknown");
    if (saveResult === true) {
      Alert.alert("✅ Saved", `${name} has been saved to the database.`);
    } else {
      Alert.alert("❌ Save Failed", `Could not save to database: ${saveResult}`);
    }
    setLoading(false);
  };

  const handleTreatScan = async (rawIngredients: string, name: string, processingMethod?: string) => {
    const ingredientList = rawIngredients
      .split(/,|;/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    setIngredients(ingredientList);
    setProductName(name || "Scanned Treat");
    setIsTreatScan(true);
    setScore(null);
    setNutritionalProfile(null);
    setFlagged([]);
    setScoreBreakdown([]);
    const result = scoreTreats(ingredientList, processingMethod, name);
    setTreatScore(result.score);
    setTreatFlags(result.flags);
    setTreatVitaminFlags(result.vitaminFlags);
    setTreatIngredientCount(result.ingredientCount);
    setTreatDentalIngredients(result.dentalIngredients);
    setTreatProcessingMethod(result.treatProcessingMethod);
    setScoreBreakdown(result.breakdown);
    setLoading(false);
    setScanned(true);
    setAnalysisLoading(true);
    analyzeIngredientsBatch(ingredientList)
      .then((analysis: Record<string, any>) => {
        setIngredientAnalysis(analysis);
        setAnalysisLoading(false);
      })
      .catch(() => setAnalysisLoading(false));
  };

  const processIngredients = async (
    name: string,
    rawIngredients: string,
    ingredientList: string[],
    sheetProcessingMethod: string,
    knownOmegaRatio?: string | null,
  ) => {
    const customIngredients = await loadCustomIngredients();
    const top5 = ingredientList.slice(0, 5).map((i) => i.toLowerCase());
    const foundHarmful: { name: string; reason: string; severity: string }[] =
      [];
    for (const ing of ingredientList) {
      const match = HARMFUL_INGREDIENTS.find((h) =>
        ing.toLowerCase().includes(h.term),
      );
      if (match) {
        foundHarmful.push({
          name: ing,
          reason: match.reason,
          severity: match.severity,
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
    const foundOrgans = ingredientList.filter((ing) =>
      ORGAN_MEATS.some(
        (o) =>
          ing.toLowerCase().includes(o) && !ing.toLowerCase().includes("meal"),
      ),
    );
    const foundProduce = ingredientList.filter((ing) =>
      WHOLE_FOOD_PRODUCE.some((p) => ing.toLowerCase().includes(p)),
    );
    const foundAntiInflammatory = ingredientList.filter((ing) =>
      ANTI_INFLAMMATORY_FOODS.some((a) => ing.toLowerCase().includes(a)),
    );
    const foundLegumesTop3 = ingredientList.slice(0, 3).filter((ing) =>
      LENTIL_LEGUME.some((l) => ing.toLowerCase().includes(l)),
    );
    const omegaRatingResult = computeOmegaRating(
      foundOmega3,
      foundOmega6,
      knownOmegaRatio ?? nutritionalProfile?.omega_ratio,
      sheetProcessingMethod,
    );
    const noProbiotics = foundProbiotics.length === 0;
    const vitCount = foundVitamins.length;
    let vitLoadPenalty = 0;
    let vitLevel = "";
    if (vitCount > 15) {
      vitLoadPenalty = 12;
      vitLevel = "Severe";
    } else if (vitCount > 10) {
      vitLoadPenalty = 8;
      vitLevel = "High";
    } else if (vitCount > 7) {
      vitLoadPenalty = 5;
      vitLevel = "Moderate";
    }
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
    setDbAvoidFlags(dbAudit.avoidFlags);
    setDbPoorFormFlags(dbAudit.poorFormFlags);
    setDbCombinationWarnings(dbAudit.combinationWarnings);

    setFlagged(foundHarmful);
    setMeals(foundMeals);
    setVitamins(foundVitamins);
    setToxicAdditives(foundToxicAdditives);
    setLegumes(foundLegumes);
    setHighCarbs(foundCarbs);
    setOmega3Found(foundOmega3);
    setOmega6Found(foundOmega6);
    setOmegaRating(omegaRatingResult);
    setFiberFound(foundFiber);
    setProbioticsFound(foundProbiotics);
    setSourcingIssues(genericInTop5);
    setAafcoStatus(aafco);
    setOnTAPFList(tapf);
    setProcessing(processingResult);
    setVitaminScore({ count: vitCount, penalty: vitPenalty, level: vitLevel });
    let total = 60;
    const breakdown: { label: string; value: number }[] = [];
    breakdown.push({ label: "Base score", value: 60 });
    if (processingResult.penalty > 0)
      breakdown.push({
        label: `Processing (${processingResult.rating})`,
        value: -processingResult.penalty,
      });
    for (const h of foundHarmful) {
      const p = SEVERITY_PENALTIES[h.severity] || 8;
      total -= p;
      breakdown.push({ label: `${h.name} (${h.severity})`, value: -p });
    }
    total -= processingResult.penalty;
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
    if (foundToxicAdditives.length > 0) {
      const p = foundToxicAdditives.length * 10;
      total -= p;
      breakdown.push({
        label: `Toxic additives (${foundToxicAdditives.length})`,
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
      let carbPenalty = 0;
      let carbLabel = "";
      if (carbIsFirst && carbCount >= 2) {
        carbPenalty = 32;
        carbLabel = "Est. ~45%+ carbs — carb is #1 ingredient with multiple carb sources";
      } else if (carbIsFirst) {
        carbPenalty = 25;
        carbLabel = "Est. ~35–45% carbs — carb is the primary ingredient";
      } else if (carbInTop2 && carbCount >= 2) {
        carbPenalty = 22;
        carbLabel = "Est. ~35–40% carbs — multiple carbs in primary ingredients";
      } else if (carbInTop2) {
        carbPenalty = 12;
        carbLabel = "Est. ~25–35% carbs — carb is a primary ingredient";
      } else if (carbCount >= 3) {
        carbPenalty = 10;
        carbLabel = "Est. ~25–30% carbs — multiple carb sources";
      } else if (carbCount >= 2 && carbInTop5) {
        carbPenalty = 5;
        carbLabel = "Est. ~20–25% carbs — approaching threshold";
      }
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
    total = Math.max(15, Math.round(total));
    setScore(total);
    setScoreBreakdown(breakdown);
    // Fire recall check in background — don't await, never blocks results
    const brandWord = name.split(" ")[0];
    if (brandWord && brandWord.length > 2)
      checkFDARecall(brandWord).catch(() => {});
    setAnalysisLoading(true);
    analyzeIngredientsBatch(ingredientList)
      .then((analysis: Record<string, any>) => {
        setIngredientAnalysis(analysis);
        const profile = analysis["__profile__"];
        if (profile) setNutritionalProfile(profile);
        setAnalysisLoading(false);
      })
      .catch(() => setAnalysisLoading(false));
  };

  const openCoach = () => {
    const greeting = `Hi! I've analyzed **${productName}** and it scored **${score}/100**. ${
      flagged.length > 0
        ? `I noticed some concerning ingredients: ${flagged
            .slice(0, 3)
            .map((f) => f.name)
            .join(", ")}. `
        : "No major ingredient concerns were found. "
    }What would you like to know?`;
    setCoachMessages([{ role: "assistant", content: greeting }]);
    setCoachVisible(true);
  };

  const sendCoachMessage = async () => {
    if (!coachInput.trim() || coachLoading) return;
    const userMsg = { role: "user", content: coachInput.trim() };
    const updated = [...coachMessages, userMsg];
    setCoachMessages(updated);
    setCoachInput("");
    setCoachLoading(true);
    const reply = await askNutritionCoach(
      productName,
      ingredients.join(", "),
      score ?? 0,
      flagged.map((f) => f.name),
      updated,
    );
    setCoachMessages([...updated, { role: "assistant", content: reply }]);
    setCoachLoading(false);
  };

  const handleIngredientTap = async (ingredientName: string) => {
    setSelectedIngredient(ingredientName);
    setIngredientDetailData(null);
    setIngredientDetailVisible(true);
    setIngredientDetailLoading(true);
    const detail = await lookupIngredientDetail(ingredientName);
    setIngredientDetailData(detail);
    setIngredientDetailLoading(false);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanned(true);
    setNotFound(false);
    setLoading(true);
    setLastBarcode(data);
    setError("");
    setIngredients([]);
    setFlagged([]);
    setMeals([]);
    setVitamins([]);
    setToxicAdditives([]);
    setLegumes([]);
    setHighCarbs([]);
    setOmega3Found([]);
    setOmega6Found([]);
    setOmegaRating(null);
    setFiberFound([]);
    setSourcingIssues([]);
    setAafcoStatus("");
    setOnTAPFList(false);
    setProcessing(null);
    setScore(null);
    setProductName("");
    setDbAvoidFlags([]);
    setDbPoorFormFlags([]);
    setDbCombinationWarnings([]);
    setRecallAlert(null);
    setExpandedConcerns(new Set());
    setDataSource("");

    try {
      const customIngredients = await loadCustomIngredients();
      let name = "";
      let rawIngredients = "";
      let sheetProcessingMethod = "";

      // Step 1: Google Sheet
      try {
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
        const sheetResponse = await fetch(sheetUrl);
        const sheetText = await sheetResponse.text();
        const sheetJson = JSON.parse(sheetText.substring(47).slice(0, -2));
        const rows = sheetJson.table.rows;
        for (const row of rows) {
          const barcode = row.c[0]?.v?.toString().trim();
          if (barcode === data.trim()) {
            name = row.c[1]?.v || "";
            rawIngredients = row.c[3]?.v || "";
            sheetProcessingMethod = row.c[4]?.v || "";
            setDataSource("📋 Community Database");
            break;
          }
        }
      } catch (e) {
        console.log("Sheet lookup failed");
      }

      // Step 2: Open Pet Food Facts
      if (!name) {
        try {
          const petResponse = await fetch(
            `https://world.openpetfoodfacts.org/api/v0/product/${data}.json`,
          );
          const petJson = await petResponse.json();
          if (petJson.status === 1 && petJson.product) {
            name = petJson.product.product_name || "";
            rawIngredients = petJson.product.ingredients_text || "";
            setDataSource("🐾 Open Pet Food Facts");
          }
        } catch (e) {
          console.log("Pet food API failed");
        }
      }

      // Step 3: Open Food Facts
      if (!name) {
        try {
          const generalResponse = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${data}.json`,
          );
          const generalJson = await generalResponse.json();
          if (generalJson.status === 1 && generalJson.product) {
            name = generalJson.product.product_name || "";
            rawIngredients = generalJson.product.ingredients_text || "";
            setDataSource("🌍 Open Food Facts");
          }
        } catch (e) {
          console.log("General food API failed");
        }
      }

      // Step 4: Try Supabase products table
      const FRENCH_WORDS = ['farine', 'poulet', 'boeuf', 'canard', 'agneau', 'protéines', 'légumes', 'graisses', 'minéraux', 'vitamines', 'foie de', 'levure de'];
      const isFrenchIngredients = (text: string) => {
        const lower = text.toLowerCase();
        return FRENCH_WORDS.filter(w => lower.includes(w)).length >= 2;
      };
      if (!name) {
        const supabaseProduct = await lookupProduct(data);
        if (supabaseProduct && !isFrenchIngredients(supabaseProduct.ingredients || '')) {
          name = supabaseProduct.product_name;
          rawIngredients = supabaseProduct.ingredients;
          sheetProcessingMethod = supabaseProduct.processing_method;
          setDataSource("🗄️ Supabase Database");
          // Load cached Guaranteed Analysis if available
          if (
            supabaseProduct.protein_pct != null ||
            supabaseProduct.fat_pct != null
          ) {
            const carbPct =
              supabaseProduct.protein_pct != null &&
              supabaseProduct.fat_pct != null &&
              supabaseProduct.fiber_pct != null &&
              supabaseProduct.moisture_pct != null
                ? Math.max(
                    0,
                    Math.round(
                      100 -
                        supabaseProduct.protein_pct -
                        supabaseProduct.fat_pct -
                        supabaseProduct.fiber_pct -
                        supabaseProduct.moisture_pct -
                        7,
                    ),
                  )
                : null;
            let omegaRatioStr: string | null = null;
            if (
              supabaseProduct.omega6_pct != null &&
              supabaseProduct.omega3_pct != null &&
              supabaseProduct.omega3_pct > 0
            ) {
              const ratio =
                Math.round(
                  (supabaseProduct.omega6_pct / supabaseProduct.omega3_pct) *
                    10,
                ) / 10;
              omegaRatioStr = `${ratio}:1`;
            }
            setNutritionalProfile({
              protein_pct: supabaseProduct.protein_pct,
              fat_pct: supabaseProduct.fat_pct,
              fiber_pct: supabaseProduct.fiber_pct,
              moisture_pct: supabaseProduct.moisture_pct,
              carb_pct: carbPct,
              omega_ratio: omegaRatioStr,
            });
          }
        }
      }

      // Step 4b: Go-UPC — get ingredients directly if not in Supabase
      if (!rawIngredients) {
        try {
          const goupcResult = await lookupWithGoUPC(data);
          if (goupcResult?.found) {
            if (!name && goupcResult.product_name) name = goupcResult.product_name;
            if (goupcResult.ingredients) {
              rawIngredients = goupcResult.ingredients;
              setDataSource("📦 Product Database");
              await saveProduct(
                data,
                goupcResult.product_name || name,
                goupcResult.brand,
                rawIngredients,
                "unknown",
              );
            }
          }
        } catch (e) {
          console.log("Go-UPC step failed");
        }
      }

      // Step 5: UPC Item DB — always run when ingredients missing to get best name + brand for Claude
      let upcBrand = "";
      if (!rawIngredients) {
        try {
          const upcResponse = await fetch(
            `https://api.upcitemdb.com/prod/trial/lookup?upc=${data}`,
          );
          const upcJson = await upcResponse.json();
          if (upcJson.code === "OK" && upcJson.items?.length > 0) {
            if (!name) name = upcJson.items[0].title || "";
            upcBrand = upcJson.items[0].brand || "";
            // Use the most specific name available — UPC title is often more precise
            const upcTitle = upcJson.items[0].title || "";
            if (upcTitle && upcTitle.length > name.length) name = upcTitle;
          }
        } catch (e) {
          console.log("UPC Item DB lookup failed");
        }
      }

      // Step 6: Claude — get ingredients by product name or barcode as last resort
      if (!rawIngredients) {
        setDataSource("🤖 AI Lookup...");
        const claudeResult = await lookupIngredientsWithClaude(
          name || data,
          upcBrand,
        );
        if (claudeResult.found) {
          rawIngredients = claudeResult.ingredients;
          sheetProcessingMethod = claudeResult.processing_method;
          if (!name) name = claudeResult.product_name || "";
          setDataSource("🤖 AI Powered");
          await saveProduct(
            data,
            name,
            claudeResult.brand || upcBrand,
            rawIngredients,
            sheetProcessingMethod,
          );
          if (claudeResult.aafco_status === "feeding_trials")
            setAafcoStatus("✅ AAFCO Feeding Trials (gold standard)");
          else if (claudeResult.aafco_status === "nutrient_profile")
            setAafcoStatus("🟡 AAFCO Nutrient Profile only");
          if (claudeResult.guaranteed_analysis) {
            applyGA(claudeResult.guaranteed_analysis);
            if (data)
              saveProductGA(data, claudeResult.guaranteed_analysis).catch(
                () => {},
              );
          }
        }
      }

      // Step 7: Not found anywhere — auto-switch to Smart Scan after brief message
      if (!rawIngredients) {
        setLoading(false);
        setNotFound(true);
        scanningRef.current = false;
        setTimeout(() => {
          setNotFound(false);
          setScanned(false);
          setScanMode("smart");
        }, 2500);
        return;
      }

      setProductName(name);

      const ingredientList: string[] = rawIngredients
        .split(/,|;/)
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0);
      setIngredients(ingredientList);

      const top5 = ingredientList.slice(0, 5).map((i) => i.toLowerCase());

      // Harmful — built-in + custom
      const foundHarmful: { name: string; reason: string; severity: string }[] =
        [];
      for (const ing of ingredientList) {
        const match = HARMFUL_INGREDIENTS.find((h) =>
          ing.toLowerCase().includes(h.term),
        );
        if (match) {
          foundHarmful.push({
            name: ing,
            reason: match.reason,
            severity: match.severity,
          });
          continue;
        }
        const customMatch = customIngredients.find((h: CustomIngredient) =>
          ing.toLowerCase().includes(h.term),
        );
        if (customMatch) {
          foundHarmful.push({
            name: ing,
            reason: customMatch.reason,
            severity: customMatch.severity,
          });
        }
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
      const genericInTop5 = top5.filter(
        (ing) =>
          GENERIC_PROTEIN_TERMS.some(
            (g) => ing === g || ing.startsWith(g + " "),
          ) && !SPECIFIC_PROTEIN_TERMS.some((s) => ing.includes(s)),
      );
      const foundOrgans = ingredientList.filter((ing) =>
        ORGAN_MEATS.some(
          (o) =>
            ing.toLowerCase().includes(o) &&
            !ing.toLowerCase().includes("meal"),
        ),
      );
      const foundProduce = ingredientList.filter((ing) =>
        WHOLE_FOOD_PRODUCE.some((p) => ing.toLowerCase().includes(p)),
      );
      const foundAntiInflammatory = ingredientList.filter((ing) =>
        ANTI_INFLAMMATORY_FOODS.some((a) => ing.toLowerCase().includes(a)),
      );
      const foundLegumesTop3 = ingredientList.slice(0, 3).filter((ing) =>
        LENTIL_LEGUME.some((l) => ing.toLowerCase().includes(l)),
      );
      const omegaRatingResult = computeOmegaRating(
        foundOmega3,
        foundOmega6,
        nutritionalProfile?.omega_ratio,
        sheetProcessingMethod,
      );

      const vitCount = foundVitamins.length;
      let vitLoadPenalty = 0;
      let vitLevel = "";
      if (vitCount > 15) {
        vitLoadPenalty = 12;
        vitLevel = "Severe";
      } else if (vitCount > 10) {
        vitLoadPenalty = 8;
        vitLevel = "High";
      } else if (vitCount > 7) {
        vitLoadPenalty = 5;
        vitLevel = "Moderate";
      }
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
          ? "🟡 AAFCO Nutrient Profile only — not feeding trial tested"
          : "❓ AAFCO status not detected";

      const tapf = checkTAPFBrand(name);
      const processingResult = detectProcessingMethod(
        name,
        ingredientList,
        sheetProcessingMethod,
      );

      setFlagged(foundHarmful);
      setMeals(foundMeals);
      setVitamins(foundVitamins);
      setToxicAdditives(foundToxicAdditives);
      setLegumes(foundLegumes);
      setHighCarbs(foundCarbs);
      setOmega3Found(foundOmega3);
      setOmega6Found(foundOmega6);
      setOmegaRating(omegaRatingResult);
      setFiberFound(foundFiber);
      setSourcingIssues(genericInTop5);
      setAafcoStatus(aafco);
      setOnTAPFList(tapf);
      setProcessing(processingResult);
      setVitaminScore({
        count: vitCount,
        penalty: vitPenalty,
        level: vitLevel,
      });

      // Scoring
      let total = 60;
      const breakdown: { label: string; value: number }[] = [];
      breakdown.push({ label: "Base score", value: 60 });
      if (processingResult.penalty > 0)
        breakdown.push({
          label: `Processing (${processingResult.rating})`,
          value: -processingResult.penalty,
        });
      total -= processingResult.penalty;
      for (const h of foundHarmful) {
        const p = SEVERITY_PENALTIES[h.severity] || 8;
        total -= p;
        breakdown.push({ label: `${h.name} (${h.severity})`, value: -p });
      }
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
      if (foundToxicAdditives.length > 0) {
        const p = foundToxicAdditives.length * 10;
        total -= p;
        breakdown.push({
          label: `Toxic additives (${foundToxicAdditives.length})`,
          value: -p,
        });
      }
      if (foundMeals.length > 0) {
        const p = foundMeals.length * 7;
        total -= p;
        breakdown.push({
          label: `Unidentified generic meal (${foundMeals.length}) — sourcing unknown`,
          value: -p,
        });
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
        let carbPenalty = 0;
        let carbLabel = "";
        if (carbIsFirst && carbCount >= 2) {
          carbPenalty = 32;
          carbLabel = "Est. ~45%+ carbs — carb is #1 ingredient with multiple carb sources";
        } else if (carbIsFirst) {
          carbPenalty = 25;
          carbLabel = "Est. ~35–45% carbs — carb is the primary ingredient";
        } else if (carbInTop2 && carbCount >= 2) {
          carbPenalty = 22;
          carbLabel = "Est. ~35–40% carbs — multiple carbs in primary ingredients";
        } else if (carbInTop2) {
          carbPenalty = 12;
          carbLabel = "Est. ~25–35% carbs — carb is a primary ingredient";
        } else if (carbCount >= 3) {
          carbPenalty = 10;
          carbLabel = "Est. ~25–30% carbs — multiple carb sources";
        } else if (carbCount >= 2 && carbInTop5) {
          carbPenalty = 5;
          carbLabel = "Est. ~20–25% carbs — approaching threshold";
        }
        // Single carb not in top 5: est. <20% — no penalty
        if (carbPenalty > 0) {
          total -= carbPenalty;
          breakdown.push({ label: carbLabel, value: -carbPenalty });
        }
      }
      if (genericInTop5.length > 0) {
        total -= 12;
        breakdown.push({
          label: "Vague protein sourcing in top 5",
          value: -12,
        });
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
      total = Math.min(total, processingResult.scoreCap);
      total = Math.max(15, Math.round(total));
      setScore(total);
      setScoreBreakdown(breakdown);
      setAnalysisLoading(true);
      analyzeIngredientsBatch(ingredientList)
        .then((analysis: Record<string, any>) => {
          setIngredientAnalysis(analysis);
          const profile = analysis["__profile__"];
          if (profile) setNutritionalProfile(profile);
          setAnalysisLoading(false);
        })
        .catch(() => setAnalysisLoading(false));

      // Save scan to Google Sheet in background
      saveToGoogleSheet(
        data,
        name,
        upcBrand,
        rawIngredients,
        sheetProcessingMethod,
        total,
      ).catch(() => {});

      // Supabase ingredient analysis
      try {
        setSupabaseLoading(true);
        const supabaseResult = await analyzeIngredients(rawIngredients);
        setSupabaseAnalysis(supabaseResult);
      } catch (e) {
        console.log("Supabase analysis failed:", e);
      } finally {
        setSupabaseLoading(false);
      }
    } catch (e: any) {
      console.log("SCAN ERROR:", e.message, e);
      setError("Something went wrong. Check your internet connection.");
    }
    scanningRef.current = false;
    setLoading(false);
  };

  const resetDemoState = () => {
    setIngredients([]);
    setFlagged([]);
    setMeals([]);
    setVitamins([]);
    setToxicAdditives([]);
    setLegumes([]);
    setHighCarbs([]);
    setOmega3Found([]);
    setOmega6Found([]);
    setOmegaRating(null);
    setFiberFound([]);
    setSourcingIssues([]);
    setAafcoStatus("");
    setOnTAPFList(false);
    setProcessing(null);
    setScore(null);
    setScoreBreakdown([]);
    setDbAvoidFlags([]);
    setDbPoorFormFlags([]);
    setDbCombinationWarnings([]);
    setIngredientAnalysis({});
    setNutritionalProfile(null);
    setRecallAlert(null);
    setError("");
    setNotFound(false);
    setDataSource("📋 Demo Product");
    setScanned(true);
    setLoading(false);
    scanningRef.current = false;
  };

  const loadDemo = async () => {
    const demoName = "Purina Pro Plan Adult Chicken & Rice";
    const demoRaw =
      "Chicken, Rice, Whole Grain Wheat, Corn Gluten Meal, Poultry By-Product Meal, Beef Fat Preserved with Mixed-Tocopherols, Egg Product, Brewers Dried Yeast, Fish Oil, Calcium Carbonate, Potassium Chloride, Salt, Zinc Sulfate, Vitamin E Supplement, Ferrous Sulfate, Niacin, Copper Sulfate, Sodium Selenite, Riboflavin Supplement, Thiamine Mononitrate, Vitamin A Supplement, Pyridoxine Hydrochloride, Manganese Sulfate, Menadione Sodium Bisulfite Complex, Vitamin B-12 Supplement, Vitamin D-3 Supplement";
    const demoList = demoRaw
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    resetDemoState();
    setProductName(demoName);
    setIngredients(demoList);
    // Purina Pro Plan guaranteed analysis (published label values)
    setNutritionalProfile({
      protein_pct: 30,
      fat_pct: 20,
      fiber_pct: 3,
      moisture_pct: 12,
      carb_pct: 28,
      omega_ratio: "14:1",
    });
    await processIngredients(demoName, demoRaw, demoList, "kibble", "14:1");
    setAnalysisLoading(true);
    analyzeIngredientsBatch(demoList)
      .then((analysis: Record<string, any>) => {
        setIngredientAnalysis(analysis);
        setAnalysisLoading(false);
      })
      .catch(() => setAnalysisLoading(false));
  };

  const loadGoodDemo = async () => {
    const demoName = "The Simple Food Project Chicken & Turkey";
    const demoRaw =
      "Chicken, Turkey, Chicken Hearts, Chicken Liver, Flaxseed, Sweet Potato, Whole Ground Krill, Whole Ground Pumpkin Seeds, Organic Spinach, Organic Carrots, Organic Blueberries, Organic Cinnamon, Sea Salt, Dried Kelp, Dried Yeast, Mixed Tocopherols";
    const demoList = demoRaw
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    resetDemoState();
    setProductName(demoName);
    setIngredients(demoList);
    // Simple Food Project guaranteed analysis (published label values)
    setNutritionalProfile({
      protein_pct: 46,
      fat_pct: 22,
      fiber_pct: 2,
      moisture_pct: 9,
      carb_pct: 14,
      omega_ratio: "4:1",
    });
    await processIngredients(
      demoName,
      demoRaw,
      demoList,
      "freeze-dried",
      "4:1",
    );
    setAnalysisLoading(true);
    analyzeIngredientsBatch(demoList)
      .then((analysis: Record<string, any>) => {
        setIngredientAnalysis(analysis);
        setAnalysisLoading(false);
      })
      .catch(() => setAnalysisLoading(false));
  };

  const loadTreatDemo = async () => {
    const demoName = "Milk-Bone Original Dog Biscuits";
    const demoRaw =
      "Wheat Flour, Wheat Bran, Meat And Bone Meal, Milk, Wheat Germ, Beef Fat (preserved with BHA), Salt, Dicalcium Phosphate, Calcium Carbonate, Sodium Metabisulfite, Potassium Sorbate, Zinc Sulfate, Vitamin E Supplement, Ferrous Sulfate, Niacin, Thiamine Mononitrate, Copper Sulfate, Riboflavin Supplement, Vitamin A Supplement, Pyridoxine Hydrochloride, Sodium Selenite, Vitamin D-3 Supplement, Folic Acid";
    const demoList = demoRaw
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    resetDemoState();
    setProductName(demoName);
    setIngredients(demoList);
    await processIngredients(demoName, demoRaw, demoList, "baked");
    setAnalysisLoading(true);
    analyzeIngredientsBatch(demoList)
      .then((analysis: Record<string, any>) => {
        setIngredientAnalysis(analysis);
        setAnalysisLoading(false);
      })
      .catch(() => setAnalysisLoading(false));
  };

  return (
    <View style={styles.container}>
      {!scanned ? (
        <View style={styles.scanScreen}>
          <Text style={styles.title}>🐾 PawGrade</Text>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                scanMode === "smart" && styles.modeBtnActive,
              ]}
              onPress={() => { setScanMode("smart"); setScanned(false); setIsTreatScan(false); setTreatScore(null); setProductName(""); scanningRef.current = false; }}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  scanMode === "smart" && styles.modeBtnTextActive,
                ]}
              >
                Scan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                scanMode === "manual" && styles.modeBtnActive,
              ]}
              onPress={() => { setScanMode("manual"); setScanned(false); setIsTreatScan(false); setTreatScore(null); setProductName(""); scanningRef.current = false; }}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  scanMode === "manual" && styles.modeBtnTextActive,
                ]}
              >
                Type In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                scanMode === "treats" && styles.modeBtnActive,
              ]}
              onPress={() => { setScanMode("treats"); setScanned(false); setProductName(""); setScore(null); setNutritionalProfile(null); setTreatDentalIngredients([]); setTreatProcessingMethod(''); scanningRef.current = false; }}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  scanMode === "treats" && styles.modeBtnTextActive,
                ]}
              >
                🦴 Treats
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {scanMode === "treats"
              ? "Point at the ingredient list on a treat bag"
              : scanMode === "manual"
                ? "Type or paste an ingredient list to analyze"
                : "Point at the barcode to scan — or tap the button to scan an ingredient label"}
          </Text>
          {scanMode === "manual" ? (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 16, paddingTop: 8 }}>
              <TextInput
                style={{
                  backgroundColor: "#1a2332",
                  color: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 13,
                  marginBottom: 10,
                }}
                placeholder="Product name (optional)"
                placeholderTextColor="#4B5563"
                value={manualProductName}
                onChangeText={setManualProductName}
              />
              <TextInput
                style={{
                  backgroundColor: "#1a2332",
                  color: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 13,
                  marginBottom: 10,
                }}
                placeholder="Barcode number (optional — for future scans)"
                placeholderTextColor="#4B5563"
                value={manualBarcode}
                onChangeText={setManualBarcode}
                keyboardType="numeric"
              />
              <TextInput
                style={{
                  backgroundColor: "#1a2332",
                  color: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 13,
                  minHeight: 180,
                  textAlignVertical: "top",
                  marginBottom: 14,
                }}
                placeholder={"Paste ingredient list here...\n\nExample: Chicken, Brown Rice, Chicken Meal, Peas, Chicken Fat, Fish Oil..."}
                placeholderTextColor="#4B5563"
                value={manualIngredientText}
                onChangeText={setManualIngredientText}
                multiline
              />
              <TouchableOpacity
                style={{
                  backgroundColor: manualIngredientText.trim() ? "#2ECC71" : "#1a2332",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
                onPress={handleManualAnalyze}
                disabled={!manualIngredientText.trim()}
              >
                <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
                  Analyze Ingredients
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView
                ref={cameraRef}
                facing="back"
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
                }}
                onBarcodeScanned={scanMode !== "treats" ? handleBarCodeScanned : undefined}
              />
              <View style={styles.scanOverlay}>
                <TouchableOpacity
                  style={styles.captureBtn}
                  onPress={handleSmartScan}
                >
                  <View style={styles.captureBtnInner} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {scanMode !== "manual" && (
            <>
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 12,
                  marginBottom: 6,
                  marginTop: 8,
                }}
              >
                Try a sample scan:
              </Text>
              <View style={styles.demoRow}>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnBad]}
                  onPress={loadDemo}
                >
                  <Text style={[styles.demoBtnText, { color: "#E74C3C" }]}>
                    Purina Pro Plan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnGood]}
                  onPress={loadGoodDemo}
                >
                  <Text style={styles.demoBtnText}>Simple Food Project</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.demoRow, { marginTop: 6 }]}>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnBad, { flex: 1 }]}
                  onPress={loadTreatDemo}
                >
                  <Text style={[styles.demoBtnText, { color: "#E74C3C" }]}>
                    🦴 Milk-Bone Treats
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
              marginTop: 4,
            }}
          >
            <TouchableOpacity
              style={styles.disclaimerLink}
              onPress={() => setShowDisclaimer(true)}
            >
              <Text style={styles.disclaimerLinkText}>View Disclaimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.disclaimerLink}
              onPress={() => setShowGuide(true)}
            >
              <Text style={[styles.disclaimerLinkText, { color: "#2ECC71" }]}>
                📚 Ingredient Guide
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#2ECC71" />
              <Text style={styles.loadingText}>
                {smartScanStep || dataSource || "Checking databases..."}
              </Text>
            </View>
          )}
          {!loading && showIngredientScanPrompt && (
            <View style={{ alignItems: "center", padding: 20 }}>
              <Text style={styles.error}>
                Found <Text style={{ fontWeight: "bold" }}>{productName}</Text>{" "}
                — now scan the ingredient panel for a full analysis.
              </Text>
              <TouchableOpacity
                style={[styles.button, { marginTop: 12 }]}
                onPress={() => {
                  setScanned(false);
                  setShowIngredientScanPrompt(false);
                  scanningRef.current = false;
                }}
              >
                <Text style={styles.buttonText}>📋 Scan Ingredient Panel</Text>
              </TouchableOpacity>
            </View>
          )}
          {!loading && error !== "" && (
            <>
              <Text style={styles.error}>{error}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setScanned(false);
                  setError("");
                  scanningRef.current = false;
                }}
              >
                <Text style={styles.cancelText}>← Try Again</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── TREAT RESULTS ── */}
          {!loading &&
            isTreatScan &&
            productName !== "" &&
            treatScore !== null && (
              <>
                <View
                  style={[
                    styles.scoreBanner,
                    { backgroundColor: getScoreColor(treatScore) },
                  ]}
                >
                  <Text style={styles.scoreBannerNumber}>{treatScore}</Text>
                  <Text style={styles.scoreBannerLabel}>/100</Text>
                  <Text style={styles.scoreBannerRating}>
                    {getTreatScoreLabel(treatScore)}
                  </Text>
                  <Text style={styles.scoreBannerNote}>
                    🦴 Treat Score · Simplicity · Safety
                  </Text>
                </View>
                <Text style={styles.productName}>{productName}</Text>
                <Text style={styles.dataSource}>
                  🦴 Treat Scan — {treatIngredientCount} ingredient
                  {treatIngredientCount !== 1 ? "s" : ""}
                  {treatIngredientCount <= 3
                    ? " ✅"
                    : treatIngredientCount <= 5
                      ? " 👍"
                      : " ⚠️"}
                </Text>

                {scoreBreakdown.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Score Breakdown</Text>
                    {scoreBreakdown.map((item, i) => (
                      <View key={i} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{item.label}</Text>
                        <Text
                          style={[
                            styles.breakdownValue,
                            {
                              color:
                                item.value > 0
                                  ? "#2ECC71"
                                  : item.value < 0
                                    ? "#FC8181"
                                    : "#9CA3AF",
                            },
                          ]}
                        >
                          {item.value > 0 ? `+${item.value}` : item.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {treatFlags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      ⚠️ Ingredient Concerns
                    </Text>
                    {treatFlags.map((f, i) => (
                      <View
                        key={i}
                        style={[
                          styles.flagItem,
                          {
                            borderLeftColor:
                              SEVERITY_COLORS[f.severity] || "#e67e22",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.flagName,
                            { color: SEVERITY_COLORS[f.severity] || "#e67e22" },
                          ]}
                        >
                          {f.name}
                        </Text>
                        <Text style={styles.flagReason}>{f.reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {treatProcessingMethod && treatProcessingMethod !== 'Unknown' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔥 Processing Method</Text>
                    <View style={{ backgroundColor: '#1a2332', borderRadius: 10, padding: 12 }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>{treatProcessingMethod}</Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                        {treatProcessingMethod === 'Freeze-Dried' || treatProcessingMethod === 'Raw'
                          ? 'Nutrients and enzymes are fully intact — the gold standard for treats.'
                          : treatProcessingMethod === 'Baked'
                          ? 'Low heat baking preserves most nutrients. A solid choice.'
                          : treatProcessingMethod === 'Gently Cooked'
                          ? 'Low heat cooking preserves most nutrients. Acceptable.'
                          : treatProcessingMethod === 'Extruded/Kibble'
                          ? 'High heat and pressure destroy enzymes and degrade nutrients. Same process as kibble.'
                          : 'Soft treats require preservatives like glycerin to stay shelf-stable — check ingredient list carefully.'}
                      </Text>
                    </View>
                  </View>
                )}

                {treatDentalIngredients.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🦷 Dental Benefits</Text>
                    <Text style={[styles.sectionNote, { marginBottom: 8 }]}>
                      This treat contains ingredients shown to support dental health.
                    </Text>
                    {treatDentalIngredients.map((d, i) => (
                      <View key={i} style={{ backgroundColor: '#0d2d1a', borderRadius: 8, padding: 10, marginBottom: 6 }}>
                        <Text style={{ color: '#2ecc71', fontWeight: '700', fontSize: 13 }}>{d.ingredient}</Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{d.benefit}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {treatVitaminFlags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      💊 Synthetic Vitamins in Treat
                    </Text>
                    <Text style={[styles.sectionNote, { marginBottom: 8 }]}>
                      These are added on top of whatever vitamins are already in
                      your dog's food — risk of over-supplementation with daily
                      treat feeding.
                    </Text>
                    {treatVitaminFlags.map((v, i) => (
                      <Text key={i} style={styles.ingredient}>
                        • {v}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Ingredients ({treatIngredientCount})
                  </Text>
                  {ingredients.map((ing, i) => {
                    const info = getTreatIngredientInfo(ing, i);
                    const nutrientInfo = getNutrientInfo(ing);
                    const analysis = ingredientAnalysis[ing.toLowerCase()];
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setSelectedIngredient(ing);
                          setIngredientDetailData(null);
                          setIngredientDetailVisible(true);
                          setIngredientDetailLoading(true);
                          lookupIngredientDetail(ing)
                            .then((d) => {
                              setIngredientDetailData(d);
                              setIngredientDetailLoading(false);
                            })
                            .catch(() => setIngredientDetailLoading(false));
                        }}
                      >
                        <View
                          style={[
                            styles.ingredientItem,
                            { backgroundColor: info.bg },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={[
                                styles.ingredientName,
                                { color: info.textColor },
                              ]}
                            >
                              {i === 0 ? "① " : ""}
                              {ing}
                            </Text>
                            {info.tag !== "" && (
                              <Text
                                style={[
                                  styles.ingredientTag,
                                  { color: info.textColor },
                                ]}
                              >
                                {info.tag}
                              </Text>
                            )}
                          </View>
                          {analysis?.provides ? (
                            <Text style={styles.ingredientProvides}>
                              Provides: {analysis.provides}
                            </Text>
                          ) : nutrientInfo ? (
                            <Text style={styles.ingredientProvides}>
                              🌿 {nutrientInfo}
                            </Text>
                          ) : null}
                          {analysisLoading && !analysis && (
                            <Text
                              style={[
                                styles.ingredientProvides,
                                { color: "#555" },
                              ]}
                            >
                              Analyzing...
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setScanned(false);
                    setIsTreatScan(false);
                    setTreatScore(null);
                    scanningRef.current = false;
                  }}
                >
                  <Text style={styles.cancelText}>← Scan Another Treat</Text>
                </TouchableOpacity>
              </>
            )}

          {/* ── FOOD RESULTS ── */}
          {!loading && !isTreatScan && productName !== "" && (
            <>
              {score !== null && (
                <View
                  style={[
                    styles.scoreBanner,
                    { backgroundColor: getScoreColor(score) },
                  ]}
                >
                  <Text style={styles.scoreBannerNumber}>{score}</Text>
                  <Text style={styles.scoreBannerLabel}>/100</Text>
                  <Text style={styles.scoreBannerRating}>
                    {getScoreLabel(score)}
                  </Text>
                  <Text style={styles.scoreBannerNote}>
                    Processing · Ingredients · Nutrition Research
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.backBtnTop}
                onPress={() => {
                  setScanned(false);
                  scanningRef.current = false;
                }}
              >
                <Text style={styles.backBtnTopText}>← Scan Again</Text>
              </TouchableOpacity>
              <Text style={styles.productName}>{productName}</Text>
              {dataSource !== "" && (
                <Text style={styles.dataSource}>{dataSource}</Text>
              )}

              {recallAlert?.found && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#7b0000",
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 8,
                    marginHorizontal: 2,
                  }}
                  onPress={() => Linking.openURL(recallAlert.url)}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}
                  >
                    ⚠️ Possible FDA Recall on File
                  </Text>
                  <Text
                    style={{ color: "#ffaaaa", fontSize: 12, marginTop: 4 }}
                  >
                    {recallAlert.description}
                  </Text>
                  <Text
                    style={{ color: "#ff8080", fontSize: 11, marginTop: 4 }}
                  >
                    Recall date: {recallAlert.date} — Tap to verify on FDA.gov →
                  </Text>
                </TouchableOpacity>
              )}

              {scoreBreakdown.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Score Breakdown</Text>
                  {scoreBreakdown.map((item, i) => (
                    <View key={i} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{item.label}</Text>
                      <Text
                        style={[
                          styles.breakdownValue,
                          {
                            color:
                              item.value > 0
                                ? "#2ECC71"
                                : item.value < 0
                                  ? "#FC8181"
                                  : "#9CA3AF",
                          },
                        ]}
                      >
                        {item.value > 0 ? `+${item.value}` : item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {!nutritionalProfile && scanned && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Guaranteed Analysis</Text>
                  <Text style={styles.omegaNote}>
                    📷 Point your camera at the Guaranteed Analysis panel on the
                    bag to see exact protein, fat, fiber, moisture, and carb
                    percentages. These numbers come directly from the
                    manufacturer and are the most accurate source.
                  </Text>
                </View>
              )}
              {nutritionalProfile && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Guaranteed Analysis</Text>
                  {analysisLoading && !nutritionalProfile ? (
                    <Text style={styles.omegaNote}>
                      Analyzing ingredients...
                    </Text>
                  ) : nutritionalProfile ? (
                    <>
                      {[
                        {
                          label: "Protein",
                          value: nutritionalProfile.protein_pct,
                          good: 25,
                          warn: 18,
                          unit: "%",
                          higherIsBetter: true,
                        },
                        {
                          label: "Fat",
                          value: nutritionalProfile.fat_pct,
                          good: 12,
                          warn: 8,
                          unit: "%",
                          higherIsBetter: true,
                        },
                        {
                          label: "Fiber",
                          value: nutritionalProfile.fiber_pct,
                          good: 4,
                          warn: 2,
                          unit: "%",
                          higherIsBetter: false,
                        },
                        {
                          label: "Moisture",
                          value: nutritionalProfile.moisture_pct,
                          good: 60,
                          warn: 20,
                          unit: "%",
                          higherIsBetter: false,
                        },
                        {
                          label: "Carbohydrates",
                          value: nutritionalProfile.carb_pct,
                          good: 20,
                          warn: 30,
                          unit: "%",
                          higherIsBetter: false,
                        },
                      ].map(
                        ({
                          label,
                          value,
                          good,
                          warn,
                          unit,
                          higherIsBetter,
                        }) => {
                          if (value == null) return null;
                          const pct = Math.min(value, 100);
                          let barColor = "#2ECC71";
                          if (label === "Carbohydrates") {
                            barColor =
                              value > 30
                                ? "#c0392b"
                                : value > 20
                                  ? "#e67e22"
                                  : "#2ECC71";
                          } else if (label === "Moisture") {
                            barColor =
                              value > 50
                                ? "#2ECC71"
                                : value > 20
                                  ? "#e67e22"
                                  : "#c0392b";
                          } else {
                            barColor = higherIsBetter
                              ? value >= good
                                ? "#2ECC71"
                                : value >= warn
                                  ? "#e67e22"
                                  : "#c0392b"
                              : "#9CA3AF";
                          }
                          const flag = label === "Carbohydrates" && value > 20;
                          const flagColor = value > 30 ? "#c0392b" : "#e67e22";
                          return (
                            <View key={label} style={styles.nutrientRow}>
                              <Text style={styles.nutrientLabel}>{label}</Text>
                              <View style={styles.nutrientBarBg}>
                                <View
                                  style={[
                                    styles.nutrientBarFill,
                                    {
                                      width: `${pct}%` as any,
                                      backgroundColor: barColor,
                                    },
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.nutrientValue,
                                  { color: flag ? flagColor : "#D1D5DB" },
                                ]}
                              >
                                {value}
                                {unit}
                                {flag ? " ⚠️" : ""}
                              </Text>
                            </View>
                          );
                        },
                      )}
                      {nutritionalProfile.omega_ratio &&
                        nutritionalProfile.omega_ratio !== "unknown" && (
                          <View style={styles.nutrientRow}>
                            <Text style={styles.nutrientLabel}>
                              Omega 6:3 Ratio
                            </Text>
                            <Text
                              style={[
                                styles.nutrientValue,
                                {
                                  color:
                                    nutritionalProfile.omega_ratio.startsWith(
                                      "1:",
                                    ) ||
                                    nutritionalProfile.omega_ratio.startsWith(
                                      "2:",
                                    ) ||
                                    nutritionalProfile.omega_ratio.startsWith(
                                      "3:",
                                    ) ||
                                    nutritionalProfile.omega_ratio.startsWith(
                                      "4:",
                                    ) ||
                                    nutritionalProfile.omega_ratio.startsWith(
                                      "5:",
                                    )
                                      ? "#2ECC71"
                                      : "#e67e22",
                                },
                              ]}
                            >
                              {nutritionalProfile.omega_ratio}
                              {["1:", "2:", "3:", "4:", "5:"].some((p) =>
                                nutritionalProfile.omega_ratio!.startsWith(p),
                              )
                                ? " ✓"
                                : " ⚠️"}
                            </Text>
                          </View>
                        )}
                      <Text style={styles.omegaNote}>
                        Numbers from the Guaranteed Analysis panel on the bag.
                        Carbs calculated as: 100 − protein − fat − fiber −
                        moisture − ~7% ash. Target for lipoma-prone dogs: carbs
                        &lt;20%, ideally &lt;15%.
                      </Text>
                    </>
                  ) : null}
                </View>
              )}

              {ingredients.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Full Ingredient List</Text>
                  <Text style={styles.fullIngredientList}>
                    {ingredients.join(", ")}
                  </Text>
                </View>
              )}

              {ingredients.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Ingredient Analysis{" "}
                    {analysisLoading ? "(analyzing...)" : ""}
                  </Text>
                  {ingredients.map((ing, i) => {
                    let info = getIngredientInfo(ing);
                    const lower = ing.toLowerCase();
                    // Only flag carbs if in top 3 — lower positions are less impactful
                    if (info.tag === "carb" && i >= 3)
                      info = { bg: "#1a2332", textColor: "#9CA3AF", tag: "" };
                    // Only flag legumes if in top 7
                    if (info.tag === "legume" && i >= 7)
                      info = { bg: "#1a2332", textColor: "#9CA3AF", tag: "" };
                    const analysis = ingredientAnalysis[lower];
                    const nutrientInfo = getNutrientInfo(ing);
                    return (
                      <View
                        key={i}
                        style={[
                          styles.ingredientRow,
                          { borderLeftColor: info.textColor },
                        ]}
                      >
                        <View style={styles.ingredientRowHeader}>
                          <Text
                            style={[
                              styles.ingredientRowName,
                              { color: info.textColor },
                            ]}
                          >
                            {ing}
                          </Text>
                          {info.tag !== "" && (
                            <View
                              style={[
                                styles.ingredientBadge,
                                { backgroundColor: info.bg },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.ingredientBadgeText,
                                  { color: info.textColor },
                                ]}
                              >
                                {info.tag}
                              </Text>
                            </View>
                          )}
                        </View>
                        {analysis ? (
                          <>
                            {analysis.provides ? (
                              <Text style={styles.ingredientProvides}>
                                Provides: {analysis.provides}
                              </Text>
                            ) : null}
                            <Text style={styles.ingredientExplanation}>
                              {analysis.explanation}
                            </Text>
                          </>
                        ) : analysisLoading ? (
                          <>
                            {nutrientInfo && (
                              <Text style={styles.ingredientProvides}>
                                🌿 {nutrientInfo}
                              </Text>
                            )}
                            <Text style={styles.ingredientProvides}>
                              Analyzing...
                            </Text>
                          </>
                        ) : nutrientInfo ? (
                          <Text style={styles.ingredientProvides}>
                            🌿 {nutrientInfo}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}

              {ingredients.length > 0 &&
                (() => {
                  const lowerIngredients = ingredients.map((i) =>
                    i.toLowerCase(),
                  );
                  const missingOrgans = ORGAN_COVERAGE.filter(
                    (o) =>
                      !lowerIngredients.some((ing) => ing.includes(o.organ)),
                  );
                  const presentOrgans = ORGAN_COVERAGE.filter((o) =>
                    lowerIngredients.some((ing) => ing.includes(o.organ)),
                  );
                  return (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        Organ Meat Coverage
                      </Text>
                      {presentOrgans.length > 0 &&
                        presentOrgans.map((o, i) => (
                          <View key={i} style={styles.organRow}>
                            <Text style={styles.organPresent}>
                              ✓{" "}
                              {o.organ.charAt(0).toUpperCase() +
                                o.organ.slice(1)}
                            </Text>
                            <Text style={styles.organBenefit}>
                              {o.benefits}
                            </Text>
                          </View>
                        ))}
                      {missingOrgans.length > 0 && (
                        <>
                          <Text style={styles.organMissingTitle}>
                            Not present in this food (for reference only —
                            AAFCO-compliant foods meet baseline nutritional
                            needs):
                          </Text>
                          {missingOrgans.map((o, i) => (
                            <View key={i} style={styles.organRow}>
                              <Text style={styles.organMissing}>
                                ✗{" "}
                                {o.organ.charAt(0).toUpperCase() +
                                  o.organ.slice(1)}
                              </Text>
                              <Text style={styles.organBenefit}>
                                {o.benefits}
                              </Text>
                            </View>
                          ))}
                        </>
                      )}
                    </View>
                  );
                })()}

              {(omega3Found.length > 0 || omega6Found.length > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Omega Fatty Acids</Text>
                  {omega3Found.length > 0 && (
                    <View style={styles.omegaRow}>
                      <Text style={styles.omega3Label}>Omega-3 Sources:</Text>
                      <Text style={styles.omegaSources}>
                        {omega3Found.join(", ")}
                      </Text>
                      <Text style={styles.omegaNote}>
                        Anti-inflammatory, supports skin, coat, and brain health
                      </Text>
                    </View>
                  )}
                  {omega6Found.length > 0 && (
                    <View style={styles.omegaRow}>
                      <Text style={styles.omega6Label}>
                        Omega-6 Sources (high ratio = inflammation risk):
                      </Text>
                      <Text style={styles.omegaSources}>
                        {omega6Found.join(", ")}
                      </Text>
                    </View>
                  )}
                  {omega3Found.length === 0 && (
                    <Text style={styles.omegaNote}>
                      ⚠️ No omega-3 sources detected — consider supplementing
                      with fish oil
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity style={styles.coachBtn} onPress={openCoach}>
                <Text style={styles.coachBtnIcon}>🐾</Text>
                <View>
                  <Text style={styles.coachBtnTitle}>
                    Ask AI Nutrition Coach
                  </Text>
                  <Text style={styles.coachBtnSub}>
                    Get personalized advice about this product
                  </Text>
                </View>
                <Text style={styles.coachBtnArrow}>›</Text>
              </TouchableOpacity>

              {onTAPFList && (
                <View style={styles.safeBox}>
                  <Text style={styles.safeText}>
                    ⭐ On Truth About Pet Food Trusted List!
                  </Text>
                </View>
              )}

              {processing && (
                <View
                  style={
                    processing.method === "Unknown"
                      ? styles.infoBox
                      : processing.scoreCap <= 35
                        ? styles.warningBox
                        : processing.scoreCap <= 55
                          ? styles.cautionBox
                          : styles.safeBox
                  }
                >
                  <Text
                    style={
                      processing.method === "Unknown"
                        ? styles.infoTitle
                        : processing.scoreCap <= 35
                          ? styles.warningTitle
                          : processing.scoreCap <= 55
                            ? styles.cautionTitle
                            : styles.safeText
                    }
                  >
                    Processing Method {processing.emoji} — {processing.rating}
                  </Text>
                  {/* Enzyme education card — shown for any heat-processed food */}
                  {(processing.scoreCap <= 35 ||
                    processing.scoreCap === 55 ||
                    processing.rating === "Gently Cooked") && (
                    <View style={styles.enzymeCard}>
                      <Text style={styles.enzymeCardTitle}>
                        {processing.scoreCap <= 35
                          ? "🔥 Enzymes Destroyed by High Heat"
                          : processing.scoreCap === 55
                            ? "🔥 Significant Enzyme Loss from Baking"
                            : "🍳 Heat Reduces Digestive Enzymes"}
                      </Text>
                      <Text style={styles.enzymeCardBody}>
                        {processing.scoreCap <= 35
                          ? "The high heat used in kibble extrusion (typically 250–300°F) destroys virtually all naturally occurring digestive enzymes and denatures many heat-sensitive nutrients. Manufacturers add back a synthetic vitamin premix after processing — but these are isolated compounds, not the bioavailable, food-matrix-bound nutrients found in whole raw ingredients. Studies on nutrient digestibility show kibble has significantly lower amino acid and micronutrient bioavailability than minimally processed diets."
                          : processing.scoreCap === 55
                            ? "Baking uses lower heat than extrusion but still reaches temperatures that destroy most naturally occurring digestive enzymes and degrade heat-sensitive vitamins like B1 (thiamine), B9 (folate), and vitamin C. Nutrient bioavailability is better than kibble but still reduced compared to raw or freeze-dried."
                            : "Gently cooked food is far superior to kibble — it retains more vitamins, amino acids, and some enzymes depending on cook time and temperature. However, any heat above ~118°F begins breaking down digestive enzymes, so gently cooked diets still benefit from supplemental enzyme support."}
                      </Text>
                      <Text style={styles.enzymeCardBody}>
                        {
                          "💡 Because raw and freeze-dried foods retain ~95% of their natural enzymes and nutrients, they are more bioavailable — meaning your dog actually absorbs more from each bite. This is why dogs often need 20–25% fewer calories per day on raw or freeze-dried compared to kibble. If switching, reduce portion size accordingly to avoid weight gain."
                        }
                      </Text>
                      <Text style={styles.enzymeCardBody}>
                        {
                          "Adding a broad-spectrum digestive enzyme supplement helps compensate for what heat processing destroys — supporting nutrient absorption and reducing digestive burden on your dog's pancreas."
                        }
                      </Text>
                      <TouchableOpacity
                        style={styles.enzymeBtn}
                        onPress={() =>
                          Linking.openURL(
                            "https://adoredbeast.com/collections/digestive-support",
                          )
                        }
                      >
                        <Text style={styles.enzymeBtnText}>
                          🐾 Shop Adored Beast Digestive Enzymes →
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.enzymeDisclaimer}>
                        Affiliate link — we may earn a small commission at no
                        cost to you
                      </Text>
                    </View>
                  )}
                  {processing.scoreCap <= 35 && (
                    <Text style={styles.warningItem}>
                      High heat extrusion has been associated with the
                      destruction of natural enzymes and heat-sensitive
                      nutrients. Synthetic vitamin supplementation is typically
                      added to compensate.
                    </Text>
                  )}
                  {processing.method === "Unknown" && (
                    <>
                      <Text style={[styles.infoBody, { marginBottom: 10 }]}>
                        Couldn't auto-detect. Set it manually to get an accurate
                        score:
                      </Text>
                      <View style={styles.processingPicker}>
                        {[
                          { label: "🌟 Raw / Gently Cooked", key: "raw" },
                          {
                            label: "✅ Freeze-Dried / Air-Dried",
                            key: "freeze-dried",
                          },
                          { label: "🟡 Baked", key: "baked" },
                          { label: "🔴 Kibble", key: "kibble" },
                        ].map((opt) => (
                          <TouchableOpacity
                            key={opt.key}
                            style={styles.processingOption}
                            onPress={async () => {
                              const newProcessing = detectProcessingMethod(
                                "",
                                ingredients,
                                opt.key,
                              );
                              setProcessing(newProcessing);
                              await processIngredients(
                                productName,
                                ingredients.join(", "),
                                ingredients,
                                opt.key,
                              );
                            }}
                          >
                            <Text style={styles.processingOptionText}>
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Personalized Recommendations */}
              {processing &&
                (() => {
                  const isHeatProcessed = processing.scoreCap <= 88; // gently cooked, baked, or kibble
                  const isKibbleOrBaked = processing.scoreCap <= 55;
                  const poorOmega = omegaRating && omegaRating.bonus <= 0;
                  const noOmega3 = omega3Found.length === 0;
                  const recs: {
                    icon: string;
                    title: string;
                    body: string;
                    btnLabel?: string;
                    btnUrl?: string;
                    footnote?: string;
                  }[] = [];

                  if (noOmega3 || poorOmega) {
                    recs.push({
                      icon: "🐟",
                      title: "Add Fish Oil for Omega-3s",
                      body: "This food has little to no omega-3 sources. Dogs need a healthy omega-6 to omega-3 ratio of ideally 5:1 or lower. Most kibble runs 15:1–30:1. Adding a quality fish oil daily brings the ratio back in balance, reduces inflammation, and supports skin, coat, joint, and brain health.",
                      btnLabel: "Shop Native Pet Omega Fish Oil →",
                      btnUrl: "https://amzn.to/4s8Cy3J",
                      footnote:
                        "Affiliate link — we may earn a small commission at no cost to you",
                    });
                  }

                  const noProbioticsDetected =
                    ingredients.filter((ing) =>
                      PROBIOTIC_SOURCES.some((p) =>
                        ing.toLowerCase().includes(p),
                      ),
                    ).length === 0;
                  if (noProbioticsDetected) {
                    recs.push({
                      icon: "🦠",
                      title: "No Probiotics Detected",
                      body: isHeatProcessed
                        ? "Heat processing destroys beneficial bacteria naturally found in fresh ingredients. This food contains no probiotic strains. Dogs thrive with 1–10 billion CFU of probiotics daily — supporting gut health, immunity, stool quality, and nutrient absorption."
                        : "No probiotic strains were detected in this food's ingredient list. Even high quality raw and freeze-dried foods benefit from added probiotics to maintain a healthy gut microbiome, especially during diet transitions.",
                      btnLabel: "Shop Native Pet Probiotic →",
                      btnUrl: "https://amzn.to/41EEGoV",
                      footnote:
                        "Affiliate link — we may earn a small commission at no cost to you",
                    });
                  }

                  if (isKibbleOrBaked) {
                    recs.push({
                      icon: "🥩",
                      title: "Try a Better Food",
                      body: "This food scores poorly. Freeze-dried raw foods retain 95% of natural enzymes and nutrients. Dogs often need 20-25% less food per day compared to kibble. Consider switching to a cleaner whole food option.",
                      btnLabel: "Shop Simple Food Project (Freeze-Dried) →",
                      btnUrl: "https://amzn.to/4w6OBBK",
                      footnote:
                        "Affiliate link — we may earn a small commission at no cost to you",
                    });
                    recs.push({
                      icon: "🥚",
                      title: "Add a Raw Egg a Few Times a Week",
                      body: "A whole raw egg is one of the most bioavailable sources of protein, healthy fat, lecithin, biotin, and choline for dogs. It also contains natural enzymes. For a medium-to-large dog, 3–5 eggs per week is a simple, inexpensive way to add whole food nutrition to a processed diet.",
                    });
                  }

                  if (
                    flagged.some((f) =>
                      [
                        "bha",
                        "bht",
                        "tbhq",
                        "ethoxyquin",
                        "menadione",
                        "copper sulfate",
                        "sodium selenite",
                      ].some((t) => f.name.toLowerCase().includes(t)),
                    )
                  ) {
                    recs.push({
                      icon: "🌿",
                      title: "Support Liver & Kidney Detox",
                      body: "This food contains ingredients that may stress the liver and kidneys over time. A liver and kidney support supplement can help dogs process and eliminate toxins more efficiently.",
                      btnLabel: "Shop Four Leaf Rover Liver & Kidney Clean →",
                      btnUrl: "https://amzn.to/3QWJGmX",
                      footnote:
                        "Affiliate link — we may earn a small commission at no cost to you",
                    });
                  }

                  if (recs.length === 0) return null;
                  return (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        💡 Personalized Recommendations
                      </Text>
                      <Text style={styles.sectionNote}>
                        Based on what this food is missing:
                      </Text>
                      {recs.map((rec, i) => (
                        <View key={i} style={styles.recCard}>
                          <Text style={styles.recCardTitle}>
                            {rec.icon} {rec.title}
                          </Text>
                          <Text style={styles.recCardBody}>{rec.body}</Text>
                          {rec.btnLabel && rec.btnUrl && (
                            <TouchableOpacity
                              style={styles.recBtn}
                              onPress={() => Linking.openURL(rec.btnUrl!)}
                            >
                              <Text style={styles.recBtnText}>
                                {rec.btnLabel}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {rec.footnote && (
                            <Text style={styles.enzymeDisclaimer}>
                              {rec.footnote}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  );
                })()}

              {/* Lipoma Management Guide */}
              {score !== null && (
                <View style={styles.lipomaGuide}>
                  <Text style={styles.lipomaTitle}>
                    🐾 Lipoma-Friendly Feeding Guide
                  </Text>
                  <Text style={styles.lipomaSubtitle}>
                    Lipomas (fatty tumors) in dogs are strongly influenced by
                    diet. Here's what to look for:
                  </Text>

                  <View style={styles.lipomaRow}>
                    <Text style={styles.lipomaLabel}>Carbohydrates</Text>
                    <Text style={styles.lipomaTarget}>
                      &lt;20% ideal · &lt;15% excellent
                    </Text>
                    <Text style={styles.lipomaBody}>
                      Excess carbs spike insulin and convert to stored fat — the
                      primary driver of lipoma growth. Keep carbs as low as
                      possible. This food:{" "}
                      {nutritionalProfile?.carb_pct != null
                        ? `~${nutritionalProfile.carb_pct}% ${nutritionalProfile.carb_pct <= 15 ? "✅" : nutritionalProfile.carb_pct <= 20 ? "🟡" : "⚠️"}`
                        : "unknown"}
                    </Text>
                  </View>

                  <View style={styles.lipomaRow}>
                    <Text style={styles.lipomaLabel}>Fat</Text>
                    <Text style={styles.lipomaTarget}>
                      High fat is OK when carbs are low
                    </Text>
                    <Text style={styles.lipomaBody}>
                      Dietary fat does not directly cause lipomas. When carbs
                      are low, the body burns fat for fuel instead of storing
                      it. High protein + high fat + low carb is the ideal lipoma
                      management diet.
                    </Text>
                  </View>

                  <View style={styles.lipomaRow}>
                    <Text style={styles.lipomaLabel}>Omega-6:3 Ratio</Text>
                    <Text style={styles.lipomaTarget}>5:1 or lower ideal</Text>
                    <Text style={styles.lipomaBody}>
                      Chronic inflammation accelerates lipoma growth. A balanced
                      omega ratio reduces systemic inflammation. Most kibble
                      runs 15:1–30:1. Raw and freeze-dried foods are typically
                      much closer to the ideal ratio.
                    </Text>
                  </View>

                  <View style={styles.lipomaRow}>
                    <Text style={styles.lipomaLabel}>Processing</Text>
                    <Text style={styles.lipomaTarget}>
                      Raw or freeze-dried best
                    </Text>
                    <Text style={styles.lipomaBody}>
                      High heat processing creates advanced glycation end
                      products (AGEs) that promote inflammation and fat storage.
                      Raw and freeze-dried diets minimize AGE formation and keep
                      enzymes intact.
                    </Text>
                  </View>

                  <View style={styles.lipomaRow}>
                    <Text style={styles.lipomaLabel}>Ingredients to avoid</Text>
                    <Text style={styles.lipomaTarget}>
                      Corn, wheat, rice, soy, sugar, canola oil
                    </Text>
                    <Text style={styles.lipomaBody}>
                      High-glycemic fillers and inflammatory vegetable oils are
                      the worst offenders for lipoma-prone dogs. Look for named
                      whole meat proteins as the first 2–3 ingredients.
                    </Text>
                  </View>

                  <View style={[styles.lipomaRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.lipomaLabel}>This food</Text>
                    <Text
                      style={[
                        styles.lipomaTarget,
                        {
                          color:
                            score >= 70
                              ? "#2ECC71"
                              : score >= 50
                                ? "#e67e22"
                                : "#c0392b",
                        },
                      ]}
                    >
                      {score >= 70
                        ? "✅ Lipoma-friendly"
                        : score >= 50
                          ? "🟡 Moderate concern"
                          : "⚠️ Not recommended for lipoma management"}
                    </Text>
                    <Text style={styles.lipomaBody}>
                      {score >= 70
                        ? "This food has a low-carb, whole food profile suitable for dogs managing lipomas."
                        : score >= 50
                          ? "This food has some concerns for lipoma management. Check the carb % and omega ratio above."
                          : "This food's high carb content, poor omega ratio, or processed ingredients make it a poor choice for dogs prone to lipomas."}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AAFCO Status</Text>
                <Text style={styles.sectionBody}>{aafcoStatus}</Text>
                {aafcoStatus.includes("not detected") && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://www.google.com/search?q=${encodeURIComponent((productName || "") + " AAFCO nutritional adequacy statement")}`,
                      )
                    }
                  >
                    <Text
                      style={{ color: "#5dade2", fontSize: 12, marginTop: 4 }}
                    >
                      🔍 Look up AAFCO status for this brand →
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.sectionNote}>
                  Feeding trials are the gold standard. Nutrient profiles mean
                  the formula meets guidelines on paper but was not tested on
                  live animals.
                </Text>
              </View>

              {dbAvoidFlags.length > 0 && (
                <View
                  style={[styles.warningBox, { backgroundColor: "#1a0a00" }]}
                >
                  <Text style={[styles.warningTitle, { color: "#ff4500" }]}>
                    🚨 AVOID: Dangerous Ingredients ({dbAvoidFlags.length})
                  </Text>
                  {dbAvoidFlags.map((item, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <Text style={[styles.warningItem, { color: "#ff6b35" }]}>
                        • {item.ingredient}
                      </Text>
                      <Text
                        style={[styles.ingredientReason, { color: "#ffaa80" }]}
                      >
                        {item.flag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {dbCombinationWarnings.length > 0 && (
                <View
                  style={[styles.warningBox, { backgroundColor: "#1a0f00" }]}
                >
                  <Text style={[styles.warningTitle, { color: "#ffa500" }]}>
                    ⚠️ Risky Combinations ({dbCombinationWarnings.length})
                  </Text>
                  {dbCombinationWarnings.map((item, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <Text
                        style={[styles.ingredientReason, { color: "#ffd080" }]}
                      >
                        {item.warning}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {dbPoorFormFlags.length > 0 && (
                <View
                  style={[styles.warningBox, { backgroundColor: "#0f1a0a" }]}
                >
                  <Text style={[styles.warningTitle, { color: "#aad45a" }]}>
                    💡 Lower-Quality Synthetic Forms ({dbPoorFormFlags.length})
                  </Text>
                  <Text
                    style={[
                      styles.ingredientReason,
                      { color: "#c8e89a", marginBottom: 6 },
                    ]}
                  >
                    These are technically safe but cheaper, less bioavailable
                    forms. Better natural alternatives exist.
                  </Text>
                  {dbPoorFormFlags.map((item, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <Text style={[styles.warningItem, { color: "#c8e89a" }]}>
                        • {item.ingredient}
                      </Text>
                      <Text
                        style={[styles.ingredientReason, { color: "#a0c870" }]}
                      >
                        {item.flag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {toxicAdditives.length > 0 && (
                <View
                  style={[styles.warningBox, { backgroundColor: "#2c0a0a" }]}
                >
                  <Text style={[styles.warningTitle, { color: "#ff6b6b" }]}>
                    ☠️ Toxic Synthetic Additives ({toxicAdditives.length})
                  </Text>
                  {toxicAdditives.map((item, i) => {
                    const match = HARMFUL_INGREDIENTS.find((h) =>
                      item.toLowerCase().includes(h.term),
                    );
                    return (
                      <View key={i} style={styles.ingredientRow}>
                        <Text
                          style={[styles.warningItem, { color: "#ff6b6b" }]}
                        >
                          • {item}
                        </Text>
                        {match && (
                          <Text
                            style={[
                              styles.ingredientReason,
                              { color: "#ffaaaa" },
                            ]}
                          >
                            {match.reason}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {flagged.length > 0 && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningTitle}>
                    ⚠️ Ingredient Concerns ({flagged.length})
                  </Text>
                  <Text
                    style={{
                      color: "#aaa",
                      fontSize: 11,
                      marginBottom: 8,
                      fontStyle: "italic",
                    }}
                  >
                    Tap any ingredient to see why it's flagged. Ratings assume
                    this is primary diet food.
                  </Text>
                  {flagged.map((item, i) => {
                    const expanded = expandedConcerns.has(i);
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() =>
                          setExpandedConcerns((prev) => {
                            const n = new Set(prev);
                            expanded ? n.delete(i) : n.add(i);
                            return n;
                          })
                        }
                        activeOpacity={0.7}
                      >
                        <View
                          style={[styles.ingredientRow, { marginBottom: 6 }]}
                        >
                          <View style={styles.severityRow}>
                            <Text style={styles.warningItem}>
                              • {item.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <View
                                style={[
                                  styles.severityBadge,
                                  {
                                    backgroundColor:
                                      SEVERITY_COLORS[item.severity] || "#888",
                                  },
                                ]}
                              >
                                <Text style={styles.severityText}>
                                  {item.severity === "toxic"
                                    ? "avoid"
                                    : item.severity}
                                </Text>
                              </View>
                              <Text style={{ color: "#6B7280", fontSize: 12 }}>
                                {expanded ? "▲" : "▼"}
                              </Text>
                            </View>
                          </View>
                          {expanded && (
                            <Text
                              style={[
                                styles.ingredientReason,
                                { marginTop: 6 },
                              ]}
                            >
                              {item.reason}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {vitamins.length > 0 && (
                <View
                  style={
                    vitaminScore.level === "Severe"
                      ? styles.warningBox
                      : vitaminScore.level === "Moderate"
                        ? styles.cautionBox
                        : styles.infoBox
                  }
                >
                  <Text
                    style={
                      vitaminScore.level === "Severe"
                        ? styles.warningTitle
                        : vitaminScore.level === "Moderate"
                          ? styles.cautionTitle
                          : styles.infoTitle
                    }
                  >
                    💊 Synthetic Vitamins & Minerals — {vitaminScore.level} (
                    {vitamins.length})
                  </Text>
                  <Text
                    style={
                      vitaminScore.level === "Severe"
                        ? styles.warningItem
                        : vitaminScore.level === "Moderate"
                          ? styles.cautionItem
                          : styles.infoBody
                    }
                  >
                    {vitamins.length <= 5
                      ? "Some synthetic supplementation present."
                      : vitamins.length <= 10
                        ? "Heavy synthetic supplementation — research suggests this may indicate nutrients were compromised during processing."
                        : "Extremely heavy supplementation — this formula appears to rely significantly on synthetic nutrients rather than whole food sources."}
                  </Text>
                  {vitamins.map((v, i) => (
                    <Text
                      key={i}
                      style={
                        vitaminScore.level === "Severe"
                          ? styles.warningItem
                          : styles.cautionItem
                      }
                    >
                      • {v}
                    </Text>
                  ))}
                </View>
              )}

              {meals.length > 0 && (
                <View style={styles.cautionBox}>
                  <Text style={styles.cautionTitle}>
                    🍖 Meat Meals – Not Whole Meat ({meals.length})
                  </Text>
                  <Text style={styles.cautionNote}>
                    Rendered meals are highly processed. Whole named meats such
                    as chicken or beef are generally preferred by veterinary
                    nutritionists.
                  </Text>
                  {meals.map((item, i) => (
                    <Text key={i} style={styles.cautionItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {legumes.length > 0 && (
                <View style={styles.cautionBox}>
                  <Text style={styles.cautionTitle}>
                    🫘 Legumes/Lentils{" "}
                    {legumes.some((l) =>
                      ingredients
                        .slice(0, 5)
                        .some((i) => i.toLowerCase().includes(l.toLowerCase())),
                    )
                      ? "⚠️ In Top 5 – DCM/TCVM Risk"
                      : "Found"}
                  </Text>
                  <Text style={styles.cautionNote}>
                    The FDA has investigated a possible association between
                    diets high in legumes and Dilated Cardiomyopathy (DCM) in
                    dogs. Research is ongoing.
                  </Text>
                  {legumes.map((item, i) => (
                    <Text key={i} style={styles.cautionItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {highCarbs.length >= 3 && (
                <View style={styles.cautionBox}>
                  <Text style={styles.cautionTitle}>
                    🌾 High Carbohydrate Content ({highCarbs.length} sources)
                  </Text>
                  <Text style={styles.cautionNote}>
                    Dogs and cats evolved as carnivores. Some veterinary
                    nutritionists have associated high carbohydrate diets with
                    obesity, blood sugar dysregulation, and inflammation in
                    companion animals.
                  </Text>
                  {highCarbs.map((item, i) => (
                    <Text key={i} style={styles.cautionItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {sourcingIssues.length > 0 && (
                <View style={styles.cautionBox}>
                  <Text style={styles.cautionTitle}>
                    🌍 Vague Ingredient Sourcing in Top 5
                  </Text>
                  <Text style={styles.cautionNote}>
                    Generic terms such as "meat" or "poultry" do not identify
                    the actual animal species. Quality, origin, and condition of
                    these ingredients cannot be independently verified by
                    consumers.
                  </Text>
                  {sourcingIssues.map((i, idx) => (
                    <Text key={idx} style={styles.cautionItem}>
                      • {i}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Omega Fatty Acid Ratio</Text>
                {omegaRating && (
                  <Text
                    style={[
                      styles.sectionBody,
                      { fontWeight: "700", marginBottom: 8 },
                    ]}
                  >
                    {omegaRating.label}
                  </Text>
                )}
                <Text style={[styles.sectionNote, { marginBottom: 6 }]}>
                  A 5:1 or lower omega-6 to omega-3 ratio is considered ideal
                  for dogs. Most kibble runs 10:1–30:1.
                </Text>
                {processing &&
                  (processing.rating === "Poor – High Heat Kibble" ||
                    processing.rating === "OK – Baked") &&
                  !nutritionalProfile?.omega_ratio && (
                    <Text
                      style={{
                        color: "#F59E0B",
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      {
                        "⚠️ Most kibble brands don't disclose the omega ratio because it's typically 15:1–30:1. Scan the Guaranteed Analysis panel if available for exact numbers."
                      }
                    </Text>
                  )}
                {omega3Found.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 4 }]}>
                      Omega-3 Sources ✅
                    </Text>
                    {omega3Found.map((i, idx) => (
                      <Text key={idx} style={styles.goodItem}>
                        • {i}
                      </Text>
                    ))}
                  </>
                )}
                {omega6Found.length > 0 && (
                  <>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { marginTop: 8, color: "#F59E0B" },
                      ]}
                    >
                      High Omega-6 Oils ⚠️
                    </Text>
                    {omega6Found.map((i, idx) => (
                      <Text
                        key={idx}
                        style={[styles.cautionItem, { marginBottom: 2 }]}
                      >
                        • {i}
                      </Text>
                    ))}
                  </>
                )}
                {omega3Found.length === 0 && (
                  <Text style={styles.sectionBody}>
                    No omega-3 rich ingredients detected.
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Fiber Sources {fiberFound.length > 0 ? "✅" : "⚠️"}
                </Text>
                {fiberFound.length > 0 ? (
                  fiberFound.map((i, idx) => (
                    <Text key={idx} style={styles.goodItem}>
                      • {i}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.sectionBody}>
                    No quality whole food fiber sources detected.
                  </Text>
                )}

                <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
                  Probiotics {probioticsFound.length > 0 ? "✅" : "⚠️"}
                </Text>
                {probioticsFound.length > 0 ? (
                  probioticsFound.map((i, idx) => (
                    <Text key={idx} style={styles.goodItem}>
                      • {i}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.sectionBody}>
                    No probiotic strains detected in this food. Consider adding
                    a daily probiotic supplement.
                  </Text>
                )}
              </View>

              {flagged.length === 0 &&
                meals.length === 0 &&
                legumes.length === 0 &&
                highCarbs.length < 3 &&
                toxicAdditives.length === 0 && (
                  <View style={styles.safeBox}>
                    <Text style={styles.safeText}>
                      ✅ No major ingredient concerns detected based on our
                      assessment criteria!
                    </Text>
                  </View>
                )}
              {supabaseAnalysis && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    🧬 Ingredient Intelligence
                  </Text>
                  <Text style={styles.sectionBody}>
                    Purine Load: {supabaseAnalysis.highPurineCount} high-purine
                    ingredients detected
                  </Text>
                  <Text style={styles.sectionBody}>
                    Synthetic Vitamins/Minerals:{" "}
                    {supabaseAnalysis.syntheticCount}
                  </Text>
                  {supabaseAnalysis.redFlags.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={[styles.sectionTitle, { color: "#c0392b" }]}>
                        🚨 Database Red Flags
                      </Text>
                      {supabaseAnalysis.redFlags.map((ing: any, i: number) => (
                        <View key={i} style={{ marginBottom: 8 }}>
                          <Text style={{ color: "#c0392b", fontWeight: "600" }}>
                            • {ing.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: "#888",
                              fontStyle: "italic",
                              marginLeft: 12,
                            }}
                          >
                            {ing.notes}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredient Pills</Text>
                <Text style={styles.pillHint}>
                  Tap any ingredient to learn more
                </Text>
                <View style={styles.pillContainer}>
                  {ingredients.map((item, i) => {
                    const harm = flagged.find((f) => f.name === item);
                    const isGood =
                      omega3Found.includes(item) || fiberFound.includes(item);
                    const isMeal = meals.includes(item);
                    const isLegume = legumes.includes(item);
                    const bg = harm
                      ? SEVERITY_COLORS[harm.severity]
                      : isGood
                        ? "#1E8449"
                        : isMeal || isLegume
                          ? "#D68910"
                          : "#2A2A3E";
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.pill, { backgroundColor: bg }]}
                        onPress={() => handleIngredientTap(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.pillText}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🛒 Grocery Store Finds for Dogs
                </Text>
                <Text style={[styles.omegaNote, { marginBottom: 12 }]}>
                  Whole foods you can grab at any grocery store — no specialty
                  pet stores needed.
                </Text>
                {(() => {
                  const categories = [
                    ...new Set(GROCERY_FINDS.map((g) => g.category)),
                  ];
                  return categories.map((cat) => (
                    <View key={cat} style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          color: "#9CA3AF",
                          fontSize: 11,
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 6,
                        }}
                      >
                        {cat}
                      </Text>
                      {GROCERY_FINDS.filter((g) => g.category === cat).map(
                        (g, i) => (
                          <View
                            key={i}
                            style={{
                              backgroundColor: "#1a2332",
                              borderRadius: 10,
                              padding: 12,
                              marginBottom: 6,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 4,
                              }}
                            >
                              <Text style={{ fontSize: 18, marginRight: 8 }}>
                                {g.emoji}
                              </Text>
                              <Text
                                style={{
                                  color: "#FFFFFF",
                                  fontWeight: "700",
                                  fontSize: 14,
                                  flex: 1,
                                }}
                              >
                                {g.item}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: "#D1D5DB",
                                fontSize: 12,
                                lineHeight: 17,
                                marginBottom: 4,
                              }}
                            >
                              {g.benefit}
                            </Text>
                            <Text style={{ color: "#6B9EAF", fontSize: 11 }}>
                              📍 {g.where}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  ));
                })()}
              </View>

              <View style={styles.bottomDisclaimer}>
                <Text style={styles.bottomDisclaimerText}>
                  ⚖️ For informational and educational purposes only. This is
                  not veterinary advice. Scores and assessments reflect an
                  independent nutritional methodology based on published
                  research from organizations including the ASPCA, WHO, NIH,
                  FDA, and AAFCO. Brand names are used for identification
                  purposes only. This app is not affiliated with any pet food
                  manufacturer.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://truthaboutpetfood.com")
                  }
                >
                  <Text style={styles.link}>
                    Learn more at TruthAboutPetFood.com →
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setScanned(false);
              setNotFound(false);
              scanningRef.current = false;
            }}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={ingredientDetailVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIngredientDetailVisible(false)}
      >
        <View style={styles.detailModal}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailIngredientName}>
              {selectedIngredient}
            </Text>
            <TouchableOpacity
              onPress={() => setIngredientDetailVisible(false)}
              style={styles.coachClose}
            >
              <Text style={styles.coachCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {(() => {
            const localHarm = HARMFUL_INGREDIENTS.find((h) =>
              selectedIngredient.toLowerCase().includes(h.term),
            );
            const isGood =
              omega3Found.includes(selectedIngredient) ||
              fiberFound.includes(selectedIngredient);
            const impact = localHarm
              ? localHarm.severity
              : isGood
                ? "beneficial"
                : null;
            const impactColor =
              impact === "toxic" || impact === "severe"
                ? "#c0392b"
                : impact === "moderate"
                  ? "#e67e22"
                  : impact === "mild"
                    ? "#f39c12"
                    : impact === "beneficial"
                      ? "#27ae60"
                      : "#6B7280";
            const impactLabel =
              impact === "toxic"
                ? "☠️ Toxic"
                : impact === "severe"
                  ? "🔴 Severe Concern"
                  : impact === "moderate"
                    ? "🟠 Moderate Concern"
                    : impact === "mild"
                      ? "🟡 Mild Concern"
                      : impact === "beneficial"
                        ? "✅ Beneficial"
                        : "⚪ Neutral / Unknown";

            return (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20 }}
              >
                <View
                  style={[
                    styles.detailImpactBadge,
                    {
                      backgroundColor: impactColor + "22",
                      borderColor: impactColor,
                    },
                  ]}
                >
                  <Text
                    style={[styles.detailImpactText, { color: impactColor }]}
                  >
                    {impactLabel}
                  </Text>
                </View>

                {localHarm && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      Why We Flag This
                    </Text>
                    <Text style={styles.detailSectionBody}>
                      {localHarm.reason}
                    </Text>
                  </View>
                )}

                {ingredientDetailLoading && (
                  <View style={styles.detailLoadingRow}>
                    <ActivityIndicator size="small" color="#2ECC71" />
                    <Text style={styles.detailLoadingText}>
                      Looking up ingredient details...
                    </Text>
                  </View>
                )}

                {ingredientDetailData && (
                  <>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>What It Is</Text>
                      <Text style={styles.detailSectionBody}>
                        {ingredientDetailData.what_it_is}
                      </Text>
                    </View>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>
                        Why It's In Pet Food
                      </Text>
                      <Text style={styles.detailSectionBody}>
                        {ingredientDetailData.role_in_food}
                      </Text>
                    </View>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>
                        Health Effects for Dogs
                      </Text>
                      <Text style={styles.detailSectionBody}>
                        {ingredientDetailData.details}
                      </Text>
                    </View>
                    {ingredientDetailData.disease_links && (
                      <View
                        style={[
                          styles.detailSection,
                          { borderLeftWidth: 3, borderLeftColor: "#c0392b" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailSectionTitle,
                            { color: "#FC8181" },
                          ]}
                        >
                          Linked Health Conditions
                        </Text>
                        <Text
                          style={[
                            styles.detailSectionBody,
                            { color: "#FC8181" },
                          ]}
                        >
                          {ingredientDetailData.disease_links}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                <Text style={styles.detailDisclaimer}>
                  This information is for educational purposes only and is not
                  veterinary advice.
                </Text>
              </ScrollView>
            );
          })()}
        </View>
      </Modal>

      <Modal
        visible={coachVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCoachVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.coachModal}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.coachHeader}>
            <View>
              <Text style={styles.coachHeaderTitle}>AI Nutrition Coach</Text>
              <Text style={styles.coachHeaderSub}>{productName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setCoachVisible(false)}
              style={styles.coachClose}
            >
              <Text style={styles.coachCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coachDisclaimer}>
            <Text style={styles.coachDisclaimerText}>
              For informational purposes only. Not veterinary advice.
            </Text>
          </View>
          <ScrollView
            style={styles.coachMessages}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          >
            {coachMessages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.coachBubble,
                  msg.role === "user"
                    ? styles.coachBubbleUser
                    : styles.coachBubbleAssistant,
                ]}
              >
                <Text
                  style={[
                    styles.coachBubbleText,
                    msg.role === "user"
                      ? styles.coachBubbleTextUser
                      : styles.coachBubbleTextAssistant,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            ))}
            {coachLoading && (
              <View style={styles.coachBubbleAssistant}>
                <ActivityIndicator size="small" color="#2ECC71" />
              </View>
            )}
          </ScrollView>
          <View style={styles.coachInputRow}>
            <TextInput
              style={styles.coachInput}
              value={coachInput}
              onChangeText={setCoachInput}
              placeholder="Ask about this food..."
              placeholderTextColor="#6B7280"
              onSubmitEditing={sendCoachMessage}
              returnKeyType="send"
              editable={!coachLoading}
            />
            <TouchableOpacity
              style={[styles.coachSend, coachLoading && { opacity: 0.5 }]}
              onPress={sendCoachMessage}
              disabled={coachLoading}
            >
              <Text style={styles.coachSendText}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D0D1A",
  },

  // Scan screen
  scanScreen: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  cameraWrapper: { width: "100%", flex: 1, position: "relative" },
  camera: { flex: 1 },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: { width: 280, height: 160, position: "relative" },
  scanLine: {
    position: "absolute",
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: "#2ECC71",
    opacity: 0.85,
    borderRadius: 1,
  },
  torchBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  torchIcon: { fontSize: 18 },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  modeBtnActive: { backgroundColor: "#2ECC71" },
  modeBtnText: { color: "#6B7280", fontWeight: "600", fontSize: 14 },
  modeBtnTextActive: { color: "#fff" },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#2ECC71",
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 6,
  },

  // Results
  results: { paddingBottom: 40, backgroundColor: "#0D0D1A" },

  // Score banner — full width hero
  scoreBanner: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: "center",
    marginBottom: 0,
  },
  scoreBannerNumber: {
    fontSize: 80,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 88,
  },
  scoreBannerLabel: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginTop: -8,
  },
  scoreBannerRating: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
  scoreBannerNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 6,
  },

  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 26,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 2,
  },
  dataSource: {
    fontSize: 12,
    color: "#2ECC71",
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // Cards
  section: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionBody: { fontSize: 14, color: "#D1D5DB", lineHeight: 20 },
  sectionNote: { fontSize: 12, color: "#6B7280", marginTop: 6, lineHeight: 18 },

  warningBox: {
    backgroundColor: "#1F0A0A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#E74C3C",
  },
  warningTitle: {
    fontWeight: "700",
    color: "#FC8181",
    marginBottom: 8,
    fontSize: 14,
  },
  warningItem: {
    color: "#FC8181",
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 13,
  },

  cautionBox: {
    backgroundColor: "#1A150A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  cautionTitle: {
    fontWeight: "700",
    color: "#FCD34D",
    marginBottom: 8,
    fontSize: 14,
  },
  cautionItem: { color: "#FCD34D", marginBottom: 4, fontSize: 13 },
  cautionNote: {
    color: "#F59E0B",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },

  infoBox: {
    backgroundColor: "#0A1220",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  infoTitle: {
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 8,
    fontSize: 14,
  },
  infoBody: { color: "#93C5FD", fontSize: 13, lineHeight: 20 },

  safeBox: {
    backgroundColor: "#0A1A0F",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2ECC71",
  },
  safeText: { color: "#6EE7B7", fontWeight: "600", fontSize: 14 },
  goodItem: { color: "#6EE7B7", marginBottom: 4, fontSize: 13 },

  severityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginLeft: 8,
  },
  severityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  ingredient: { fontSize: 13, color: "#D1D5DB", lineHeight: 20 },
  flaggedIngredient: { color: "#FC8181", fontWeight: "600" },
  mealIngredient: { color: "#FCD34D", fontWeight: "600" },
  cautionIngredient: { color: "#F59E0B", fontWeight: "600" },
  goodIngredient: { color: "#6EE7B7", fontWeight: "600" },
  ingredientReason: {
    fontSize: 11,
    color: "#6B7280",
    fontStyle: "italic",
    marginLeft: 14,
    marginTop: 2,
    lineHeight: 16,
  },

  // Ingredient pills
  pillContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  pillHint: {
    fontSize: 11,
    color: "#4B5563",
    marginBottom: 8,
    fontStyle: "italic",
  },

  // Ingredient detail modal
  detailModal: { flex: 1, backgroundColor: "#0D0D1A" },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A2E",
  },
  detailIngredientName: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 20,
    lineHeight: 26,
    marginRight: 12,
    textTransform: "capitalize",
  },
  detailImpactBadge: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  detailImpactText: { fontWeight: "700", fontSize: 14 },
  detailSection: {
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailSectionBody: { fontSize: 14, color: "#D1D5DB", lineHeight: 22 },
  detailLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    marginBottom: 12,
  },
  detailLoadingText: { color: "#6B7280", fontSize: 13 },
  detailDisclaimer: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 17,
  },

  loadingBox: { alignItems: "center", padding: 80, backgroundColor: "#0D0D1A" },
  loadingText: {
    color: "#6B7280",
    marginTop: 14,
    fontSize: 14,
    fontWeight: "500",
  },

  disclaimerScreen: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    padding: 24,
    paddingTop: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0D2818",
    borderWidth: 2,
    borderColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  disclaimerIcon: { fontSize: 32 },
  disclaimerAppName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  disclaimerTagline: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 28,
    marginTop: 4,
  },
  disclaimerCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 24,
  },
  disclaimerCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  disclaimerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  disclaimerRowIcon: { fontSize: 16, marginRight: 12, marginTop: 1 },
  disclaimerRowText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  disclaimerFooter: {
    fontSize: 11,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 17,
  },
  ingredientRow: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  ingredientRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 3,
  },
  ingredientRowName: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    flexShrink: 1,
  },
  ingredientBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ingredientBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  ingredientProvides: { fontSize: 11, color: "#6B9EAF", marginBottom: 2 },
  ingredientExplanation: { fontSize: 12, color: "#9CA3AF", lineHeight: 17 },
  organRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  organPresent: {
    fontSize: 13,
    color: "#2ECC71",
    fontWeight: "600",
    width: 80,
  },
  organMissing: {
    fontSize: 13,
    color: "#FC8181",
    fontWeight: "600",
    width: 80,
  },
  organBenefit: { flex: 1, fontSize: 12, color: "#9CA3AF", lineHeight: 17 },
  organMissingTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 6,
    fontStyle: "italic",
  },
  omegaRow: { marginBottom: 10 },
  omega3Label: {
    fontSize: 13,
    color: "#5dade2",
    fontWeight: "600",
    marginBottom: 2,
  },
  omega6Label: {
    fontSize: 13,
    color: "#e67e22",
    fontWeight: "600",
    marginBottom: 2,
  },
  omegaSources: { fontSize: 12, color: "#D1D5DB", marginBottom: 3 },
  omegaNote: { fontSize: 11, color: "#9CA3AF", fontStyle: "italic" },
  fullIngredientList: { fontSize: 13, color: "#D1D5DB", lineHeight: 20 },
  demoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  demoBtn: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#2ECC71",
  },
  demoBtnGood: { borderColor: "#2ECC71" },
  demoBtnBad: { borderColor: "#E74C3C" },
  demoBtnText: { color: "#2ECC71", fontSize: 13, fontWeight: "600" },
  disclaimerLink: { alignItems: "center", padding: 12 },
  disclaimerLinkText: {
    color: "#6B7280",
    fontSize: 12,
    textDecorationLine: "underline",
  },

  notFoundScreen: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    padding: 24,
    paddingTop: 80,
    alignItems: "center",
  },
  notFoundEmoji: { fontSize: 64, marginBottom: 20 },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  instructionBox: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginTop: 16,
  },
  instructionTitle: {
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    fontSize: 15,
  },
  instructionText: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: { fontWeight: "700", color: "#FFFFFF" },

  bottomDisclaimer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  bottomDisclaimerText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 8,
  },

  backBtnTop: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
  },
  backBtnTopText: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },

  // Treat scan styles
  flagItem: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  flagName: { fontSize: 13, fontWeight: "700", marginBottom: 3 },
  flagReason: { fontSize: 12, color: "#9CA3AF", lineHeight: 17 },
  ingredientItem: { borderRadius: 8, padding: 10, marginBottom: 6 },
  ingredientName: { fontSize: 13, fontWeight: "600", flex: 1 },
  ingredientTag: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.8,
  },

  error: {
    color: "#FC8181",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    padding: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    color: "#9CA3AF",
  },
  link: {
    color: "#2ECC71",
    textDecorationLine: "underline",
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2ECC71",
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: { padding: 14, alignItems: "center", marginTop: 8 },
  cancelText: { color: "#6B7280", fontSize: 15 },
  scoreLabel: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  scoreNumber: { fontSize: 32, fontWeight: "800" },
  scoreRating: { fontSize: 18, fontWeight: "700" },
  scoreNote: { fontSize: 11, lineHeight: 16 },
  scoreCard: { padding: 20, marginBottom: 16 },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scoreOutOf: { fontSize: 12, color: "#6B7280", fontWeight: "600" },

  // Coach button (in results)
  coachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D2818",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2ECC71",
  },
  coachBtnIcon: { fontSize: 28, marginRight: 12 },
  coachBtnTitle: { color: "#2ECC71", fontWeight: "700", fontSize: 15 },
  coachBtnSub: { color: "#4B9960", fontSize: 12, marginTop: 2 },
  coachBtnArrow: { color: "#2ECC71", fontSize: 24, marginLeft: "auto" as any },

  // Coach modal
  coachModal: { flex: 1, backgroundColor: "#0D0D1A" },
  coachHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A2E",
  },
  coachHeaderTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 },
  coachHeaderSub: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  coachClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A2E",
    justifyContent: "center",
    alignItems: "center",
  },
  coachCloseText: { color: "#9CA3AF", fontSize: 14, fontWeight: "700" },
  coachDisclaimer: {
    backgroundColor: "#1A1505",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  coachDisclaimerText: { color: "#92731A", fontSize: 11, textAlign: "center" },
  coachMessages: { flex: 1 },
  coachBubble: {
    maxWidth: "85%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  coachBubbleUser: {
    backgroundColor: "#2ECC71",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  coachBubbleAssistant: {
    backgroundColor: "#1A1A2E",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  coachBubbleText: { fontSize: 14, lineHeight: 20 },
  coachBubbleTextUser: { color: "#fff", fontWeight: "500" },
  coachBubbleTextAssistant: { color: "#D1D5DB" },
  coachInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#1A1A2E",
    gap: 8,
  },
  coachInput: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 15,
  },
  coachSend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
  },
  coachSendText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: -2,
  },
  scoreInfo: { flex: 1 },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#0D0D1A",
  },
  breakdownLabel: { flex: 1, fontSize: 13, color: "#D1D5DB" },
  breakdownValue: { fontSize: 13, fontWeight: "700", marginLeft: 8 },
  lipomaGuide: {
    backgroundColor: "#0a1628",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  lipomaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 4,
  },
  lipomaSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 14,
    lineHeight: 17,
  },
  lipomaRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    paddingBottom: 12,
    marginBottom: 12,
  },
  lipomaLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D1D5DB",
    marginBottom: 2,
  },
  lipomaTarget: {
    fontSize: 12,
    color: "#93C5FD",
    fontWeight: "600",
    marginBottom: 4,
  },
  lipomaBody: { fontSize: 12, color: "#9CA3AF", lineHeight: 17 },
  recCard: {
    backgroundColor: "#0d1a2a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3B82F6",
    marginBottom: 12,
  },
  recCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 8,
  },
  recCardBody: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 19,
    marginBottom: 10,
  },
  recBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  recBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  enzymeCard: {
    marginTop: 12,
    backgroundColor: "#0d1f10",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2ECC71",
  },
  enzymeCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2ECC71",
    marginBottom: 8,
  },
  enzymeCardBody: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 19,
    marginBottom: 8,
  },
  enzymeBtn: {
    backgroundColor: "#2ECC71",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 4,
  },
  enzymeBtnText: { color: "#000", fontSize: 13, fontWeight: "700" },
  enzymeDisclaimer: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
  processingPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  processingOption: {
    backgroundColor: "#1A2A3A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  processingOptionText: { color: "#93C5FD", fontSize: 13, fontWeight: "600" },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  nutrientLabel: { width: 110, fontSize: 12, color: "#9CA3AF" },
  nutrientBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#1F2937",
    borderRadius: 4,
    overflow: "hidden",
  },
  nutrientBarFill: { height: 8, borderRadius: 4 },
  nutrientValue: {
    width: 65,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
});
