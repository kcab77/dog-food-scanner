import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    LayoutAnimation,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { auditIngredientList } from "../lib/ingredientDatabase";
import { analyzeIngredients } from "../lib/ingredientLookup";
import { getDogProfile, getSession, logScan, submitFeedback } from "../lib/supabase";
import { t } from "../lib/theme";
import {
    askNutritionCoach,
    lookupIngredientDetail,
    lookupProduct,
    lookupProductByName,
    lookupWithGoUPC,
    saveProduct,
    saveProductGA,
    saveToGoogleSheet,
    smartScanWithClaude,
    getBarcodeQuota,
    incrementBarcodeQuota,
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
    severity: "severe",
    reason:
      "This one is more serious than its 'moderate' tier suggests. Sulfite preservatives destroy thiamine (vitamin B1), and thiamine deficiency in dogs is a documented, sometimes fatal outcome — published cases describe dogs developing deficiency specifically from eating sulphite-preserved meat. The signs are neurological: head tilt, disorientation, wobbliness, progressing to seizures and paralysis. The FDA's position is that sulfite preservatives should not be added to foods, and specifically not to pet foods marketed as complete and balanced or listing thiamine as an ingredient — because the preservative destroys the very nutrient the label claims to provide. Most often found in fresh meat rolls, minces and bully sticks, where it is used to control colour and odour.",
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
    severity: "severe",
    reason:
      "Menadione is synthetic vitamin K3. The mechanism of concern is well established: it generates reactive oxygen species and depletes glutathione, causing oxidative stress that can damage red blood cells and liver cells — the route to hemolytic anemia. The FDA has banned it from over-the-counter human supplements, and doses as low as 10 mg have been linked to hemolytic anemia in susceptible people. ⚖️ In fairness: the FDA does permit it in animal feed, and over 50+ years of use there are no published reports of nutritional toxicity in dogs at pet-food inclusion levels — the studies showing harm used doses orders of magnitude higher, often injected or force-fed. Worth knowing too that neither K1 nor K2 is approved for pet food, so a manufacturer wanting to supplement vitamin K has no alternative. Our position: the mechanism and the human ban justify preferring foods without it, especially since dogs on a whole-food diet get K1 from plants and K2 from animal sources. We don't claim it has been shown to harm dogs at label doses, because it hasn't.",
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
      "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient — the gap between adequate and toxic is small enough that form matters. Unlike organic selenomethionine, which the body incorporates into proteins and regulates, inorganic selenite generates free radicals during metabolism, causing oxidative stress in liver and kidney tissue. Research published in Biological Trace Element Research links long-term inorganic selenium accumulation to progressive kidney tubule damage that develops before any obvious clinical signs. Kyle's own formulation rule applies here: prefer selenium yeast (selenomethionine) over sodium selenite.",
  },
  {
    term: "zinc oxide",
    severity: "moderate",
    reason:
      "Zinc oxide is a poorly absorbed inorganic zinc source. Comparative bioavailability work in dogs (Journal of Nutrition) found plasma zinc significantly higher across a full six-hour period after zinc propionate than after zinc oxide. In-vitro comparison of sources put zinc proteinate highest at about 42% bioaccessibility, against roughly 24% for inorganic zinc sulphate — and the chelated forms were far more resistant to phytic acid, the compound in grains and legumes that binds zinc and blocks absorption. That matters because plant-heavy foods are exactly where zinc is hardest to absorb. Zinc deficiency shows up as crusted, scaling skin around the muzzle, eyes and paw pads. Huskies and Malamutes have a genetic absorption defect that makes the form especially important. Zinc proteinate or amino-acid chelate is the preferable form.",
  },
  {
    term: "dl-methionine",
    severity: "moderate",
    reason:
      "⚪ Synthetic form, generally safe: DL-methionine is a synthetic amino acid added to meet methionine requirements and, in some foods, to acidify urine. It's a legitimate and widely used feed additive with no evidence of harm at label levels. The 'DL-' indicates a racemic mixture — dogs use the L-form directly and convert the D-form, which they do adequately. Flagged as a formulation signal rather than a hazard: its presence usually indicates plant-heavy protein that needed topping up, since meat-based diets generally supply enough methionine on their own.",
  },
  {
    term: "corn syrup",
    severity: "severe",
    reason:
      "⚪ Mechanistic, not trial-based: corn syrup is refined sugar added for palatability. Dogs have no dietary requirement for sugar, and adding it to a food serves the manufacturer (dogs eat more of it) rather than the dog. The concerns follow from what sugar does generally — spikes in blood glucose, a contribution to obesity and dental disease, and feeding of oral and gut yeast — rather than from controlled canine trials on corn syrup specifically. Its presence is also a signal: a food good enough to eat on its own merits doesn't need sweetening.",
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
      "⚪ Mechanistic / formulation signal: wheat gluten is concentrated plant protein used to raise the crude protein figure on the guaranteed analysis without meat. That matters because the protein percentage on a label doesn't distinguish sources, so a food can advertise strong protein while much of it is plant-derived and lower in the amino acids dogs need most. Also a wheat allergen source. Historical note: wheat gluten was the vehicle for melamine contamination in the 2007 recalls, though the melamine was the adulterant, not the gluten.",
  },
  {
    term: "soy protein isolate",
    severity: "moderate",
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
      "Peanut hulls are an agricultural waste byproduct with negligible nutritional value. Pet nutrition researchers consider their inclusion an indicator of low quality formulation focused on reducing cost rather than nutrition",
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
      "⚪ Mechanistic / formulation signal: ground wheat is an inexpensive carbohydrate that supplies bulk calories and helps kibble hold together during extrusion. Dogs have no carbohydrate requirement (see the carbohydrate section), and wheat is among the more common grain allergens, though far less common than chicken or beef. It isn't harmful to most dogs — it's a cost and filler question, and a reason to check where the protein is actually coming from.",
  },
  {
    term: "grain fragments",
    severity: "mild",
    reason:
      "Grain fragments are the leftover pieces from grain milling after the more nutritious portions have been removed for human food. Pet nutrition researchers consider them low quality filler ingredients",
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
      "Retinyl acetate is synthetic preformed vitamin A, the same category as retinyl palmitate. Excess preformed vitamin A accumulates in the liver and can cause hypervitaminosis A — GI upset first, then lethargy and weakness, and bone changes with chronic overdose. In fairness to the evidence, dogs tolerate vitamin A far better than most species: a 44-week safety evaluation in growing dogs at 100,000 IU per 1,000 kcal found no adverse effects. Treat this as a preference for whole-food vitamin A (liver, egg yolk, fish) rather than as a red flag, with genuine caution reserved for foods stacking liver AND synthetic vitamin A together.",
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

const SEVERITY_COLORS: Record<string, string> = {
  mild: t.high,
  moderate: t.high,
  severe: t.criticalDeep,
  toxic: t.criticalDeep,
};

const SUPPLEMENT_RECS = [
  {
    emoji: "🦠", name: "Probiotics", color: t.accents.probiotic.fg, borderColor: t.accents.probiotic.fg, bg: t.accents.probiotic.bg,
    body: "Multi-strain probiotics support gut microbiome diversity, immune function, and stool quality. Look for at least 1 billion CFU with Lactobacillus and Bifidobacterium strains. Most beneficial for dogs on kibble, after antibiotics, or with chronic digestive issues.",
    note: "Pair with fish oil for a synergistic gut + inflammation benefit",
    link: "https://amzn.to/4dPRAWP", linkText: "🛒 Shop Probiotics →",
  },
  {
    emoji: "🐟", name: "Fish Oil (Omega-3)", color: t.good, borderColor: t.good, bg: t.goodTint,
    body: "Wild-caught sardine or anchovy oil reduces inflammation and supports coat, joints, and brain function. Look for triglyceride form — not ethyl ester — and store in fridge after opening to prevent rancidity.",
    note: "Target: ~20mg EPA+DHA per pound of body weight daily",
    link: "https://amzn.to/4efzKxO", linkText: "🛒 Shop Fish Oil →",
  },
  {
    emoji: "🌊", name: "Green Lipped Mussel", color: t.accents.mussel.fg, borderColor: t.accents.mussel.fg, bg: t.accents.mussel.bg,
    body: "New Zealand green lipped mussel contains unique omega-3s (ETA) not found in fish oil, plus natural glucosamine and chondroitin. One of the most potent natural anti-inflammatories for joints — ideal for active, senior, or large-breed dogs.",
    note: "Works synergistically with fish oil for broader omega-3 coverage",
    link: "https://amzn.to/4vpJKdX", linkText: "🛒 Shop Green Lipped Mussel →",
  },
  {
    emoji: "❤️", name: "Heart Treats", color: t.accents.heart.fg, borderColor: t.accents.heart.fg, bg: t.accents.heart.bg,
    body: "Beef or chicken heart is the #1 dietary source of CoQ10 and naturally rich in taurine — critical for cardiac function. Unlike liver, heart is a muscle meat so the organ cap is less strict, but keep all treats under 10% of total diet.",
    note: "Especially important for breeds with known taurine deficiency concerns",
    link: "https://amzn.to/4vkvZgs", linkText: "🛒 Shop Heart Treats →",
  },
  {
    emoji: "🫀", name: "Liver Treats", color: t.accents.liver.fg, borderColor: t.accents.liver.fg, bg: t.accents.liver.bg,
    body: "Beef or chicken liver is packed with Vitamin A, B12, iron, and CoQ10 — one of the most nutrient-dense treats you can give. However, excess Vitamin A causes toxicity. Keep liver treats to no more than 5% of total daily diet (treats included).",
    note: "5% rule: a 50lb dog eating 2 cups/day → max 1–2 small liver treats",
    link: "https://amzn.to/4wWcj44", linkText: "🛒 Shop Liver Treats →",
  },
  {
    emoji: "🌿", name: "Detox & Liver Support", color: t.accents.detox.fg, borderColor: t.accents.detox.fg, bg: t.accents.detox.bg,
    body: "Dogs are exposed to pesticides, lawn chemicals, and environmental toxins year-round — especially in summer. The liver has to filter all of it. Milk thistle (silymarin) is one of the most well-studied natural liver protectants in dogs, helping the liver detox and regenerate. Pair with turkey tail mushroom for added immune support.",
    note: "Especially valuable after flea treatments, vaccines, or heavy outdoor exposure",
    link: "https://amzn.to/4dZ2ZDT", linkText: "🛒 Shop Detox Support →",
  },
  {
    emoji: "🍃", name: "Four Leaf Rover", color: t.accents.rover.fg, borderColor: t.accents.rover.fg, bg: t.accents.rover.bg,
    body: "Four Leaf Rover makes research-backed supplements formulated specifically for dogs — including liver support, toxin binders, probiotics, and more. One of the most trusted brands in holistic dog health.",
    note: "Browse their full line — each product targets a specific need",
    link: "https://amzn.to/43FJ5sK", linkText: "🛒 Shop Four Leaf Rover →",
  },
];

const TOXIC_ADDITIVES = [
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
/**
 * How much of each nutrient survives heat.
 *
 * This is the "why" behind the processing-method score, stated in numbers instead
 * of adjectives. "Kibble degrades nutrients" is a claim an owner has to take on
 * faith; "thiamine retention drops from about 90% to as low as 30%" is something
 * they can weigh for themselves — and it explains why heat-processed food needs a
 * vitamin premix while raw and freeze-dried generally don't.
 *
 * Ranges are wide on purpose. Actual retention depends on temperature, duration,
 * moisture, pH and light, so a single number would be false precision. Sources:
 * food-science retention literature (Lešková et al., heat-treatment retention
 * models) and AAFCO/pet-food formulation practice.
 */
const NUTRIENT_HEAT_LOSS: {
  nutrient: string;
  retention: string;
  note: string;
  fragile: boolean;
}[] = [
  { nutrient: "Thiamine (B1)", retention: "20–80% survives", fragile: true,
    note: "The most heat-fragile nutrient in the bowl, and the reason cooked foods add thiamine mononitrate — the heat-stable synthetic form. Deficiency causes neurological damage, so this one genuinely has to be replaced." },
  { nutrient: "Folate (B9)", retention: "~40% survives", fragile: true,
    note: "Leaches into cooking water as well as degrading, so wet cooking methods lose the most." },
  { nutrient: "Vitamin C", retention: "Heavily degraded", fragile: true,
    note: "Rarely matters for dogs — unlike humans, healthy dogs synthesise their own vitamin C." },
  { nutrient: "Vitamin A (retinol)", retention: "~33% in boiled veg", fragile: true,
    note: "More stable in fat and in organ meat than in vegetables. Liver is dense enough that losses still leave plenty." },
  { nutrient: "Riboflavin (B2)", retention: "Mostly survives heat", fragile: false,
    note: "Heat-stable but degrades fast in light — a packaging problem more than a cooking one." },
  { nutrient: "Niacin (B3)", retention: "Largely intact", fragile: false,
    note: "One of the most durable vitamins across every cooking method." },
  { nutrient: "Vitamin D", retention: "Largely survives cooking", fragile: false,
    note: "Fat-soluble and heat-stable, so gentle cooking costs little. Storage matters more: D3 fell 59–62% over six months at room temperature. Dogs cannot make vitamin D from sunlight, so diet is the only source." },
  { nutrient: "Vitamin E", retention: "Mostly survives", fragile: false,
    note: "Stable to heat but lost to oxidation over time — which is why fats need a preservative, natural (mixed tocopherols) or otherwise." },
  { nutrient: "Minerals", retention: "Not destroyed by heat", fragile: false,
    note: "Calcium, zinc, selenium and the rest survive cooking intact. What changes is the FORM used to add them back — chelates and proteinates absorb better than sulfates and oxides." },
  { nutrient: "Enzymes", retention: "Denatured by heat", fragile: true,
    note: "Fully destroyed by cooking. Their importance in dog diets is debated — dogs make their own digestive enzymes — so treat this as a reason to favour raw, not proof that cooked food is deficient." },
];

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
/**
 * Omega-3 is not one thing, and treating it as one thing flatters plant-heavy foods.
 *
 * MARINE sources supply EPA and DHA directly — the forms a dog's body actually uses.
 * PLANT sources supply ALA, which a dog must convert to EPA/DHA, and dogs convert it
 * poorly (commonly cited at well under 10%, with conversion to DHA lower still).
 *
 * The practical consequence: a food can advertise an excellent omega-6:3 ratio built
 * almost entirely on flaxseed and deliver very little usable omega-3. The ratio is
 * true and the benefit is overstated. Splitting these lets the app say where the
 * omega-3 actually comes from instead of crediting the number alone.
 */
/**
 * Breeds with a genetic predisposition to copper accumulation.
 *
 * Kyle's own spreadsheet rule ("Labrador, Bedlington Terrier, Dalmatian — flag high
 * copper content for these breeds") existed as written guidance for two years while
 * the app knew the dog's breed and never used it.
 *
 * These breeds can't regulate copper excretion normally, so inorganic copper sulfate
 * accumulates in liver tissue and causes chronic hepatitis — silently, until the
 * damage is advanced. Copper proteinate is the safer form for any dog and especially
 * these.
 *
 * This changes the WARNING, never the score. A food isn't objectively worse because
 * of who's eating it, and letting a profile move the number would make two dogs'
 * scores for the same bag incomparable. The risk is personal; the score stays shared.
 */
/**
 * Prebiotic fibre — the half of gut health the app was missing.
 *
 * PROBIOTIC_SOURCES recognises bacteria going in. Nothing recognised the fermentable
 * fibre that feeds the bacteria already there. That's a real gap: probiotics without
 * prebiotic fibre are far less useful, and prebiotics alone still help, because they
 * feed an existing population rather than trying to establish a new one.
 *
 * It also fits the whole-food-first philosophy exactly — nearly every entry here is
 * a vegetable, root or fruit rather than an isolated supplement.
 */
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

const COPPER_SENSITIVE_BREEDS = [
  "labrador",
  "lab ",
  "bedlington",
  "dalmatian",
  "doberman",
  "west highland",
  "westie",
  "skye terrier",
];

/**
 * Where omega-6 actually comes from — for explanation, NOT for scoring.
 *
 * Deliberately separate from OMEGA6_SOURCES, which feeds computeOmegaRating. Adding
 * "chicken" to the scoring list would penalise every poultry food, which is wrong:
 * linoleic acid is an ESSENTIAL nutrient that dogs cannot make, with an AAFCO minimum
 * of 1.1% DM for adult maintenance.
 *
 * The honest framing owners rarely hear: omega-6 deficiency is close to unheard of on
 * any meat-based diet. It's in every animal fat. The ratio matters because omega-6 is
 * abundant and omega-3 is scarce — not because omega-6 is bad.
 */
/**
 * Organ profiles — what each one actually delivers.
 *
 * "Organ meat is good for dogs" is true but useless: it doesn't tell an owner why
 * heart and liver aren't interchangeable, or why liver has a ceiling when heart
 * doesn't. Naming what each organ carries makes the raw-feeding ratios make sense
 * instead of being rules to memorise.
 *
 * Note on omega-6: organs are LEAN, so they're not a meaningful fat source either
 * way. Omega-6 comes from adipose fat and skin, not offal. Brain is the exception,
 * and it's mostly DHA rather than omega-6.
 */
const ORGAN_PROFILES: {
  term: string;
  label: string;
  headline: string;
  carries: string;
  note: string;
  limit?: string;
}[] = [
  { term: "liver", label: "Liver", headline: "Nature's multivitamin",
    carries: "Vitamin A (by far the richest source), B12, folate, riboflavin, copper, iron, zinc, CoQ10",
    note: "The most nutrient-dense food available to a dog. One of the few single ingredients that meaningfully moves several requirements at once — which is exactly why it has a ceiling.",
    limit: "Cap at about 5% of the diet. Vitamin A and copper are both fat-soluble or accumulative, and liver is dense enough in each that more is not better." },
  { term: "heart", label: "Heart", headline: "The taurine and CoQ10 organ",
    carries: "Taurine, CoQ10, B12, riboflavin, iron, phosphorus",
    note: "Technically a muscle, not an organ — which is why it can be fed far more freely than liver. The best natural taurine source there is, which matters for heart health and is directly relevant to the DCM conversation around legume-heavy diets." },
  { term: "kidney", label: "Kidney", headline: "B12 and selenium",
    carries: "B12, riboflavin, iron, selenium, complete amino acid profile",
    note: "Selenium here comes as selenomethionine — the organic, self-regulating form, rather than the sodium selenite added to kibble. 'Like feeds like' in TCVM puts kidney with kidney support.",
    limit: "Counts toward the ~10% organ allowance alongside liver." },
  { term: "spleen", label: "Spleen", headline: "The iron organ",
    carries: "Iron (the highest of any organ), B12, vitamin C",
    note: "Unusually rich in vitamin C for an animal tissue. The organ to reach for with anaemia or low iron, and often overlooked in favour of liver." },
  { term: "pancreas", label: "Pancreas", headline: "Digestive enzymes",
    carries: "Lipase, protease, amylase — the enzymes themselves",
    note: "Fed as a natural enzyme source, and the traditional whole-food approach for dogs with exocrine pancreatic insufficiency (EPI). Genuinely functional rather than just nutritious." },
  { term: "tripe", label: "Green tripe", headline: "Gut support",
    carries: "Probiotics, digestive enzymes, a naturally near-ideal calcium:phosphorus ratio",
    note: "Stomach lining of a ruminant, unbleached. The smell is the point — bleached white tripe from a supermarket has had the useful part processed out of it." },
  { term: "brain", label: "Brain", headline: "DHA",
    carries: "DHA, phosphatidylserine, cholesterol",
    note: "The fattiest organ and the only one that's a real omega-3 source. Traditionally fed for cognitive support in seniors." },
  { term: "lung", label: "Lung", headline: "Lean protein",
    carries: "Protein, modest B vitamins",
    note: "Low in fat and lower in nutrient density than other organs. Common as a light training treat rather than a nutritional centrepiece." },
  { term: "gizzard", label: "Gizzard", headline: "Muscle, not organ",
    carries: "Protein, iron, B12, zinc",
    note: "Like heart, this is muscle rather than secreting organ, so it doesn't count toward the 10% organ allowance." },
];

const OMEGA6_FOOD_SOURCES: { source: string; level: "very high" | "high" | "moderate"; note: string }[] = [
  { source: "Sunflower, safflower, corn, soybean, grapeseed oil", level: "very high",
    note: "The cheap oils used to hit a fat target. Almost pure omega-6 — these are what push a food's ratio to 20:1 or worse." },
  { source: "Chicken fat, chicken, duck, turkey", level: "high",
    note: "Poultry is the richest omega-6 source among common meats. A chicken-based food will never be short of it." },
  { source: "Pork and pork fat", level: "high",
    note: "Comparable to poultry, and a common fat source in kibble." },
  { source: "Egg yolk", level: "high",
    note: "Also carries fat-soluble vitamins and choline — omega-6 arriving with company rather than alone." },
  { source: "Nuts and seeds", level: "high",
    note: "Sunflower and sesame especially. Rare in dog food except as oil." },
  { source: "Organ meats — liver, heart, kidney", level: "moderate",
    note: "Present alongside a dense supply of vitamins, minerals and taurine." },
  { source: "Beef, lamb, venison", level: "moderate",
    note: "Ruminant fats sit meaningfully lower in omega-6 than poultry — one reason a beef formula often shows a better ratio than a chicken one." },
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
// Union kept under the original name so existing pill-colouring and detection
// behave exactly as before — this change adds a distinction, it doesn't remove one.
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
    severity: "severe",
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
    severity: "severe",
    reason:
      "Petroleum-derived synthetic dye linked to tumor promotion and hypersensitivity in animal studies. Banned or restricted in several countries. Zero nutritional value — exists only to make treats look appealing to humans.",
  },
  {
    term: "yellow 5",
    severity: "severe",
    reason:
      "Synthetic azo dye linked to hypersensitivity and potential carcinogenic activity in animal research. No nutritional purpose in a dog treat.",
  },
  {
    term: "yellow 6",
    severity: "severe",
    reason:
      "Synthetic dye linked to adrenal and kidney tumors in animal studies. Dogs are colorblind to red/orange — this dye exists purely to appeal to humans buying the treat.",
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
  breakdown: { label: string; value: number; severity?: string }[];
  ingredientCount: number;
  vitaminFlags: string[];
  dentalIngredients: { ingredient: string; benefit: string }[];
  treatProcessingMethod: string;
} {
  const lower = ingredientList.map((i) => i.toLowerCase());
  const top3 = lower.slice(0, 3);
  const flags: { name: string; reason: string; severity: string }[] = [];
  const breakdown: { label: string; value: number; severity?: string }[] = [];
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
    const p = Math.min(10, SEVERITY_PENALTIES[f.severity] || 8);
    total -= p;
    breakdown.push({ label: `${f.name} (${f.severity})`, value: -p, severity: f.severity });
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
      return { bg: t.criticalTint, textColor: t.critical, tag: "avoid" };
    if (harmful.severity === "severe")
      return { bg: t.criticalTint, textColor: t.critical, tag: "severe" };
    if (harmful.severity === "moderate")
      return { bg: t.highTint, textColor: t.high, tag: "concern" };
    return { bg: t.moderateTint, textColor: t.moderate, tag: "mild" };
  }
  if (ADDED_VITAMINS.some((v) => lower.includes(v)))
    return { bg: t.moderateTint, textColor: t.moderate, tag: "supplement" };
  if (TREAT_OK_INGREDIENTS.some((t) => lower === t || lower.includes(t)))
    return { bg: t.surface, textColor: t.textMuted, tag: "ok in treats" };
  // Single/whole ingredients
  if (
    SPECIFIC_PROTEIN_TERMS.some((p) => lower.includes(p)) &&
    !lower.includes("meal") &&
    !lower.includes("by-product")
  ) {
    return { bg: t.goodTint, textColor: t.good, tag: "whole food" };
  }
  if (ORGAN_MEATS.some((o) => lower.includes(o) && !lower.includes("meal")))
    return { bg: t.goodTint, textColor: t.good, tag: "organ" };
  return { bg: t.surface, textColor: t.textMuted, tag: "" };
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

// Kibble is the neutral baseline (no penalty, no cap) — most owners already
// know kibble isn't the top format, so the score shouldn't editorialize by
// punishing the format itself. Gentler processing methods earn a bonus on
// top instead. Ingredient-level flags (menadione, fillers, etc.) still apply
// normally on top of this — a genuinely bad kibble can still score low, just
// not because it's kibble. scoreCap is now a uniform 100 everywhere (the
// general ceiling), not a format-specific cap.
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
        bonus: 25,
        emoji: "🌟",
      };
  for (const k of PROCESSING_METHODS.great)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Freeze-Dried",
        scoreCap: 100,
        penalty: 0,
        bonus: 25,
        emoji: "❄️",
      };
  for (const k of PROCESSING_METHODS.gently)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Gently Cooked",
        scoreCap: 100,
        penalty: 0,
        bonus: 22,
        emoji: "🍳",
      };
  for (const k of PROCESSING_METHODS.airDried)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Air-Dried",
        scoreCap: 100,
        penalty: 0,
        bonus: 18,
        emoji: "🌬️",
      };
  for (const k of PROCESSING_METHODS.ok)
    if (combined.includes(k))
      return {
        method: k,
        rating: "Baked",
        scoreCap: 100,
        penalty: 0,
        bonus: 8,
        emoji: "🟡",
      };
  for (const k of PROCESSING_METHODS.bad)
    if (combined.includes(k))
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

/**
 * `hasMarine` credits the omega-3 that a dog can actually use.
 *
 * The ratio alone can't tell you this. A food built on flaxseed can post an
 * excellent omega-6:3 number while delivering little usable EPA/DHA, because the
 * ratio counts ALA the same as fish oil and the dog's body does not (conversion
 * runs well under 10%).
 *
 * Deliberately implemented as a BONUS for marine sources rather than a penalty for
 * plant ones. Flaxseed is a decent ingredient — fibre, lignans, some ALA — and
 * punishing it would misrepresent that. Rewarding fish, krill and algae instead
 * moves the same distinction into the score without calling a good ingredient bad.
 * Optional param so existing call sites keep working unchanged.
 */
/**
 * The salt divider.
 *
 * AAFCO requires ingredients in descending order by weight, and salt is typically
 * included at around 1%. So everything listed BELOW salt is present at roughly 1% or
 * less — trace amounts.
 *
 * ⚠️ The critical nuance, and the reason this isn't a blanket penalty: plenty of
 * ingredients belong below the line and work perfectly well there. Added vitamins and
 * minerals, probiotics, preservatives and potent extracts are all dosed in fractions
 * of a percent by design. Flagging those would be wrong.
 *
 * What the rule actually catches is MARKETING ingredients — the blueberries and kale
 * on the front of the bag that turn out to be a sprinkle. Naming that plainly does
 * more for an owner than any score change: "the blueberries are listed below salt,
 * so this is a sprinkle, not a serving."
 */
/**
 * Ingredient splitting.
 *
 * A manufacturer can take one ingredient and list it as several — rice, brewers rice
 * and rice flour, or pea protein, pea starch and pea fibre. Because the label is
 * ordered by weight, splitting pushes each fragment further down and keeps the
 * combined weight out of the top few slots. The bag reads as meat-first when, added
 * up, grain or legume is the real bulk.
 *
 * It's the companion to the salt divider: both are ways the ordering rule gets worked
 * around, and neither is visible unless you're looking for it.
 *
 * Deliberately conservative — only bases where splitting is a KNOWN practice, and
 * only reported when two or more fragments actually appear. Naming an ingredient
 * "split" when a food simply contains rice and rice bran for real reasons would be
 * a false accusation.
 */
const SPLIT_BASES: { base: string; label: string; forms: string[] }[] = [
  { base: "rice", label: "Rice", forms: ["rice", "brewers rice", "brewer's rice", "rice flour", "rice bran", "broken rice", "white rice", "brown rice"] },
  { base: "corn", label: "Corn", forms: ["corn", "ground corn", "corn gluten meal", "corn flour", "corn bran", "corn starch", "cornmeal", "corn germ meal"] },
  { base: "pea", label: "Peas", forms: ["peas", "pea protein", "pea starch", "pea fiber", "pea fibre", "pea flour", "green peas", "yellow peas"] },
  { base: "potato", label: "Potato", forms: ["potato", "potato protein", "potato starch", "potato flour", "dried potato"] },
  { base: "wheat", label: "Wheat", forms: ["wheat", "wheat flour", "wheat gluten", "wheat bran", "wheat middlings", "ground wheat"] },
  { base: "soy", label: "Soy", forms: ["soybean meal", "soy protein", "soy flour", "soybean hulls", "soy protein isolate"] },
  { base: "barley", label: "Barley", forms: ["barley", "pearled barley", "barley flour", "ground barley"] },
];

/**
 * Protein profiles — allergen risk, digestibility and what to watch.
 *
 * Straight from Kyle's own March spreadsheet (sheet 3), which graded 15 proteins and
 * then sat unread for five months. Two things worth stating because they run against
 * common assumptions:
 *
 * Allergen risk tracks EXPOSURE, not inherent badness. Chicken is the most common
 * allergen because it's in almost everything, not because there's anything wrong with
 * chicken. Novel proteins (venison, rabbit, bison) are "low risk" precisely because
 * most dogs have never eaten them.
 *
 * And chicken meal is not inferior to chicken — it's concentrated, with the water
 * already removed. That's Kyle's own note, and it contradicts a lot of internet advice.
 */
const PROTEIN_PROFILES: {
  term: string;
  label: string;
  risk: "low" | "medium-low" | "medium" | "medium-high" | "high";
  digestibility: string;
  note: string;
}[] = [
  { term: "chicken meal", label: "Chicken meal", risk: "high", digestibility: "High (concentrated)",
    note: "Not inferior to fresh chicken — it's concentrated, with the water already removed, so more protein per gram. Same allergen risk as chicken though." },
  { term: "chicken", label: "Chicken", risk: "high", digestibility: "High (90%+)",
    note: "The most common allergen in dogs, largely because it's in almost everything. Excellent protein otherwise. If your dog has itching or recurring ear infections, this is the first thing to trial removing." },
  { term: "beef", label: "Beef", risk: "medium-high", digestibility: "High",
    note: "A common allergen and worth watching in dogs with skin or GI sensitivity. Nutritionally strong." },
  { term: "turkey", label: "Turkey", risk: "medium-high", digestibility: "High",
    note: "A good alternative for chicken-allergic dogs, though cross-reactivity between poultry is possible." },
  { term: "egg", label: "Egg", risk: "medium-high", digestibility: "Highest (100% biological value)",
    note: "The highest-quality protein available by biological value. Some dogs react to egg white specifically rather than the whole egg." },
  { term: "salmon", label: "Salmon", risk: "medium", digestibility: "Very high (95%+)",
    note: "Excellent protein and a real source of EPA/DHA. Wild is preferable to farmed where the label says which." },
  { term: "lamb", label: "Lamb", risk: "medium", digestibility: "High",
    note: "Well tolerated by many food-sensitive dogs. Higher in fat — worth noting for overweight dogs." },
  { term: "whitefish", label: "Whitefish", risk: "medium", digestibility: "Very high",
    note: "Good lean protein. Generic 'whitefish' with no species named is a transparency concern rather than a safety one." },
  { term: "pork", label: "Pork", risk: "medium", digestibility: "High",
    note: "A novel protein for many dogs. Watch fat content." },
  { term: "herring", label: "Herring", risk: "medium", digestibility: "Very high",
    note: "Excellent omega-3 source with lower mercury than large predatory fish." },
  { term: "tuna", label: "Tuna", risk: "medium", digestibility: "Very high",
    note: "⚠️ Fine occasionally, but as a primary daily protein the mercury load is a genuine concern — especially in small dogs." },
  { term: "duck", label: "Duck", risk: "medium-low", digestibility: "High",
    note: "A novel protein, useful in elimination diets. Higher in fat. In TCVM it's a cooling protein, suited to dogs who run hot." },
  { term: "venison", label: "Venison", risk: "low", digestibility: "High",
    note: "Rarely allergenic and excellent for elimination diets. Premium novel protein." },
  { term: "rabbit", label: "Rabbit", risk: "low", digestibility: "High",
    note: "The best novel protein for severely allergic dogs — very few have ever been exposed to it." },
  { term: "bison", label: "Bison", risk: "low", digestibility: "High",
    note: "Premium novel protein, good for allergy-prone dogs. A positive signal on a label." },
];

function findProteins(ingredientList: string[]) {
  const seen = new Set<string>();
  const out: (typeof PROTEIN_PROFILES)[number][] = [];
  // Only the first few ingredients — a trace of egg near the end isn't the food's protein.
  for (const ing of ingredientList.slice(0, 8)) {
    const l = ing.toLowerCase();
    for (const p of PROTEIN_PROFILES) {
      if (l.includes(p.term) && !seen.has(p.label)) {
        // "chicken meal" must not also match "chicken" — longest term wins, and
        // PROTEIN_PROFILES is ordered so meal is checked first.
        if (p.term === "chicken" && l.includes("chicken meal")) continue;
        seen.add(p.label);
        out.push(p);
      }
    }
  }
  return out;
}

function findSplitIngredients(
  ingredientList: string[],
): { label: string; forms: string[]; topHalf: boolean }[] {
  const lower = ingredientList.map((i) => i.toLowerCase());
  const out: { label: string; forms: string[]; topHalf: boolean }[] = [];
  for (const { label, forms } of SPLIT_BASES) {
    const hits: string[] = [];
    const positions: number[] = [];
    lower.forEach((ing, idx) => {
      if (forms.some((f) => ing === f || ing.includes(f))) {
        // Don't count the same literal twice.
        if (!hits.includes(ingredientList[idx])) {
          hits.push(ingredientList[idx]);
          positions.push(idx);
        }
      }
    });
    // Two or more distinct forms of the same base is the signal.
    if (hits.length >= 2) {
      out.push({
        label,
        forms: hits,
        // Splitting matters most when the fragments sit high — that's where it's
        // hiding real bulk from the top of the list.
        topHalf: positions.some((pos) => pos < Math.max(6, ingredientList.length / 2)),
      });
    }
  }
  return out;
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

function getIngredientInfo(ing: string): {
  bg: string;
  textColor: string;
  tag: string;
} {
  const lower = ing.toLowerCase();
  const harmful = HARMFUL_INGREDIENTS.find((h: any) => lower.includes(h.term));
  if (harmful) {
    if (harmful.severity === "toxic")
      return { bg: t.criticalTint, textColor: t.critical, tag: "avoid" };
    if (harmful.severity === "severe")
      return { bg: t.criticalTint, textColor: t.critical, tag: "severe" };
    if (harmful.severity === "moderate")
      return { bg: t.highTint, textColor: t.high, tag: "concern" };
    if (harmful.severity === "mild")
      return { bg: t.moderateTint, textColor: t.moderate, tag: "mild" };
  }
  if (TOXIC_ADDITIVES.some((t: string) => lower.includes(t)))
    return { bg: t.criticalTint, textColor: t.critical, tag: "avoid" };
  if (ADDED_VITAMINS.some((v: string) => lower.includes(v)))
    return { bg: t.moderateTint, textColor: t.moderate, tag: "synthetic" };
  if (MEAT_MEALS.some((m: string) => lower.includes(m)))
    return { bg: t.moderateTint, textColor: t.moderateDeep, tag: "meal" };
  if (LENTIL_LEGUME.some((l: string) => lower.includes(l)))
    return { bg: t.highTint, textColor: t.high, tag: "legume" };
  if (HIGH_CARB_INGREDIENTS.some((c: string) => lower.includes(c)))
    return { bg: t.moderateTint, textColor: t.moderate, tag: "carb" };
  if (
    ORGAN_MEATS.some(
      (o: string) => lower.includes(o) && !lower.includes("meal"),
    )
  )
    return { bg: t.goodTint, textColor: t.good, tag: "organ" };
  if (OMEGA3_SOURCES.some((o: string) => lower.includes(o)))
    return { bg: t.dcmTint, textColor: t.infoSoft, tag: "omega-3" };
  if (SUPERFOODS.some((s: string) => lower.includes(s)))
    return { bg: t.goodTint, textColor: t.good, tag: "superfood" };
  if (
    SPECIFIC_PROTEIN_TERMS.some((s: string) => lower.includes(s)) &&
    !MEAT_MEALS.some((m: string) => lower.includes(m))
  ) {
    return { bg: t.goodTint, textColor: t.good, tag: "protein" };
  }
  return { bg: t.surface, textColor: t.textMuted, tag: "" };
}

function getScoreColor(score: number): string {
  if (score >= 70) return t.good;
  if (score >= 50) return t.high;
  if (score >= 30) return t.high;
  return t.criticalDeep;
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Good 👍";
  if (score >= 50) return "Fair ⚠️";
  if (score >= 30) return "Below Average";
  return "Low Quality";
}

function getTreatScoreLabel(score: number): string {
  if (score >= 90) return "Single Ingredient ⭐";
  if (score >= 80) return "Excellent 👍";
  if (score >= 65) return "Good Treat ✓";
  if (score >= 50) return "Acceptable ⚠️";
  if (score >= 35) return "Use Sparingly ❌";
  return "Avoid 🚫";
}

function LipomaSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>🧬 Lipoma Prevention & Management</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        Lipomas (fatty tumors) are common in dogs but diet and inflammation play a major role in how quickly they develop and grow. These are the most evidence-backed dietary levers.
      </Text>

      <View style={{ backgroundColor: t.accents.liver.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.liver.fg }}>
        <Text style={{ color: t.accents.liver.fg, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>🍞 Low Carb Diet — Most Important Factor</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18, marginBottom: 4 }}>High carbohydrates spike insulin and promote fat cell proliferation and inflammation — the #1 dietary driver of lipoma growth.</Text>
        <Text style={{ color: t.moderate, fontSize: 12, fontWeight: "600" }}>Target: carbs below 20% — ideally below 15%</Text>
        <Text style={{ color: t.textDim, fontSize: 11, marginTop: 4 }}>Kibble is typically 35–50% carbs. Raw, gently cooked, and freeze-dried are naturally low carb.</Text>
      </View>

      <View style={{ backgroundColor: t.accents.mussel.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.mussel.fg }}>
        <Text style={{ color: t.accents.mussel.fg, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>🐟 Omega-6:3 Ratio of 5:1 or Less</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18, marginBottom: 4 }}>A high omega-6:omega-3 ratio drives chronic inflammation — the environment where lipomas thrive. Most kibble runs 15:1–30:1. Cooling that ratio is one of the most powerful anti-lipoma moves you can make.</Text>
        <Text style={{ color: t.accents.mussel.fg, fontSize: 12, fontWeight: "600" }}>Target: 5:1 or less omega-6:omega-3</Text>
        <Text style={{ color: t.textDim, fontSize: 11, marginTop: 4 }}>Best sources: sardines, salmon, mackerel. Add fish oil or green lipped mussel to reduce ratio further.</Text>
      </View>

      {[
        { color: t.accents.detox.fg, bg: t.accents.detox.bg, title: "✅ Best Foods for Lipoma-Prone Dogs", body: "Raw, freeze-dried, or gently cooked with no grains, legumes, or inflammatory oils. Look for whole-food omega-3 sources. Rotate cooling proteins: duck, fish, rabbit, salmon." },
        { color: t.critical, bg: t.criticalTint, title: "❌ Avoid", body: "Grains (corn, wheat, soy), legumes (peas, lentils, chickpeas), inflammatory oils (sunflower, safflower, soybean, canola), BHA/BHT, artificial colors, added sugars." },
        { color: t.accents.probiotic.fg, bg: t.accents.probiotic.bg, title: "💊 Supplements That Help", body: "Fish oil (omega-3) · Green lipped mussel (anti-inflammatory, joint support) · Milk thistle (liver support — processes all dietary fat) · Turkey tail mushroom · Turmeric/curcumin" },
      ].map((item, i) => (
        <View key={i} style={{ backgroundColor: item.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: item.color }}>
          <Text style={{ color: item.color, fontWeight: "700", fontSize: 13, marginBottom: 4 }}>{item.title}</Text>
          <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>{item.body}</Text>
        </View>
      ))}

      <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17, marginTop: 4 }}>
        ⚠️ Not veterinary advice. Always consult your vet, especially for lipomas that grow rapidly, feel firm, or are in sensitive locations.
      </Text>
    </View>
  );
}

function HersheyProtocolSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>🐾 Hershey's Protocol</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        My 75lb Lab mix Hershey — here's what I personally use. Do your own research and consult your vet before starting anything new.
      </Text>

      {/* Dental */}
      <Text style={{ color: t.good, fontWeight: "700", fontSize: 13, marginBottom: 8 }}>🦷 Dental Care</Text>
      {[
        { title: "Coconut oil + gauze or rag (or toothbrush)", body: "Wrap gauze around your finger, dip in coconut oil, rub along gum line. Antibacterial, safe if swallowed. This is what I use on Hershey." },
        { title: "Raw carrots", body: "Natural low-calorie dental chew. The firm texture scrubs plaque mechanically — great daily snack." },
        { title: "Raw bones or chicken feet (occasionally)", body: "Excellent mechanical cleaning especially on back molars. Always raw — never cooked bones. Supervise your dog." },
        { title: "Himalayan yak chews", body: "These scraped all the tartar off Hershey's back teeth without a vet visit — it was incredible! Made from hardened yak milk. ⚠️ Try at your own risk — research before use and supervise." },
        { title: "Manuka honey UMF 10+ (for cuts)", body: "Tiny dab on gums for oral health or apply directly to minor surface cuts. ~80% natural sugars — use sparingly, not as a daily supplement." },
      ].map((item, i) => (
        <View key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.good }}>
          <Text style={{ color: t.text, fontWeight: "600", fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{item.body}</Text>
        </View>
      ))}

      {/* Omega & Joints */}
      <Text style={{ color: t.accents.mussel.fg, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🐟 Omega-3 & Joint Support</Text>
      {[
        { title: "Green Lipped Mussel", body: "Very good for joint health, natural anti-inflammatory, supports heart and brain. One of the best whole-food joint supplements available — works synergistically with fish oil." },
        { title: "Fish oil (half dose)", body: "Great for joints, inflammation, heart and brain health. Hershey's food (Simple Food Project) already has an excellent omega ratio, so I use half the recommended dose to avoid oversupplementation." },
      ].map((item, i) => (
        <View key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.accents.mussel.fg }}>
          <Text style={{ color: t.text, fontWeight: "600", fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{item.body}</Text>
        </View>
      ))}

      {/* Gut Health */}
      <Text style={{ color: t.accents.probiotic.fg, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🦠 Gut Health</Text>
      {[
        { title: "Kefir or goat's milk", body: "Excellent natural source of probiotics and prebiotics. Safe to give daily — start with a small amount and work up. Plain, unsweetened only." },
        { title: "Probiotic supplement", body: "Multi-strain formula with Lactobacillus and Bifidobacterium. Look for at least 1 billion CFU. Most beneficial for dogs on kibble or after antibiotics." },
      ].map((item, i) => (
        <View key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.accents.probiotic.fg }}>
          <Text style={{ color: t.text, fontWeight: "600", fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{item.body}</Text>
        </View>
      ))}

      {/* Protein Rotation */}
      <Text style={{ color: t.info, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🌿 Protein Rotation (Hershey runs hot)</Text>
      <View style={{ marginBottom: 6, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.info }}>
        <Text style={{ color: t.infoSoft, fontSize: 12, lineHeight: 18 }}>❄️ <Text style={{ fontWeight: "600" }}>Cooling (best):</Text> Duck, rabbit, white fish, salmon</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>⚖️ <Text style={{ fontWeight: "600" }}>Neutral (fine):</Text> Beef, turkey, eggs</Text>
        <Text style={{ color: t.critical, fontSize: 12, lineHeight: 18 }}>🔥 <Text style={{ fontWeight: "600" }}>Warming (limit as staple):</Text> Chicken, lamb</Text>
        <Text style={{ color: t.textDim, fontSize: 11, marginTop: 4 }}>Goal: cooling proteins 4-5x/week, neutral 2-3x, warming occasionally</Text>
      </View>

      {/* Flea & Tick */}
      <Text style={{ color: t.accents.detox.fg, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🦟 Natural Flea & Tick Stack</Text>
      {[
        { title: "The Resistance (daily in food)", body: "1 tsp daily — alters body scent at cellular level so bugs don't want to land on him. Full effect in 4-6 weeks. Only layer swimming can't wash off." },
        { title: "animalEO EVICT (before every outing)", body: "4-10 drops massaged into coat — legs, neck, shoulders, ankles." },
        { title: "Rose geranium oil", body: "1 drop behind each shoulder blade before outings. Dr. Judy Morgan's #1 tick recommendation — safe undiluted on dogs." },
        { title: "Metal fine-tooth flea comb (after every outing)", body: "Non-negotiable for dark coats. Check ears, neck, armpits, groin, between toes. Run over white paper towel — flea dirt turns red/brown when wet." },
      ].map((item, i) => (
        <View key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.accents.detox.fg }}>
          <Text style={{ color: t.text, fontWeight: "600", fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{item.body}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => Linking.openURL('https://drjudymorgan.com')}>
        <Text style={{ color: t.accents.detox.fg, fontSize: 12, fontWeight: "600", marginTop: 4 }}>🌿 Get The Resistance + EVICT at drjudymorgan.com →</Text>
      </TouchableOpacity>
    </View>
  );
}

// Enable LayoutAnimation on Android (no-op on iOS where it's automatic)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Collapsible results section — collapsed by default, animates open/closed.
/**
 * A small "Ask AI" chip for section headers.
 *
 * The point of this component is *restraint*. Every fact the app could show — the
 * trials, the effect sizes, the citations — makes the screen heavier and the owner
 * less likely to read any of it. Putting that depth one tap away keeps the results
 * screen calm while making the evidence genuinely reachable for the people who
 * want it. Depth on demand, not depth by default.
 */
function AskAIChip({ label = "Ask AI", onPress }: { label?: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      // Generous hitSlop: the chip is deliberately small so it doesn't compete with
      // the section title, which makes an untouchable-feeling target without this.
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: t.aiTint,
        borderWidth: 1,
        borderColor: t.ai,
        marginRight: 8,
      }}
    >
      <Text style={{ fontSize: 11 }}>✨</Text>
      <Text style={{ color: t.ai, fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
  bare = false,
  titleColor,
  onAskAI,
  askLabel,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  bare?: boolean;
  titleColor?: string;
  /** When provided, renders an "Ask AI" chip that opens the coach with a question
   *  already framed for this section — instead of dumping evidence into the UI. */
  onAskAI?: () => void;
  askLabel?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };
  const header = (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.7}
      // hitSlop widens the tap target well past the text without changing layout —
      // these headers are the primary navigation of the results screen.
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...(bare ? { marginHorizontal: 16, marginTop: 4, paddingVertical: 8 } : {}),
      }}
    >
      <Text style={[styles.sectionTitle, { marginBottom: 0, flex: 1 }, titleColor ? { color: titleColor } : null]}>{title}</Text>
      {/* Sits inside the header's TouchableOpacity but handles its own press, so
          asking the AI never toggles the section open or closed underneath you. */}
      {onAskAI && <AskAIChip label={askLabel} onPress={onAskAI} />}
      {/* A chevron in a soft chip reads as an affordance; a bare glyph reads as decoration. */}
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          backgroundColor: t.surface,
          borderWidth: 1,
          borderColor: t.border,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 10,
        }}
      >
        <Text style={{ color: t.textMuted, fontSize: 11, fontWeight: "800" }}>
          {open ? "▾" : "▸"}
        </Text>
      </View>
    </TouchableOpacity>
  );
  // bare = the children bring their own card styling (e.g. LipomaSection); don't double-wrap.
  if (bare) {
    return (
      <View style={{ marginBottom: open ? 0 : 8 }}>
        {header}
        {open && children}
      </View>
    );
  }
  return (
    <View style={styles.section}>
      {header}
      {open && <View style={{ marginTop: 16 }}>{children}</View>}
    </View>
  );
}

// One-line plain-language verdict for the score band (shown above the fold).
function getVerdict(score: number): string {
  if (score >= 90) return "Excellent choice — a top-tier food you can feel great about.";
  if (score >= 75) return "A great food with only minor trade-offs.";
  if (score >= 60) return "A solid food — a few things worth improving.";
  if (score >= 45) return "Just okay — consider upgrading or adding whole-food toppers.";
  if (score >= 30) return "Below average — feed sparingly and look for better options.";
  return "Poor quality — we'd avoid this one.";
}

// Single most actionable next step: upgrade the format if it's heavily processed,
// otherwise recommend the top whole-food topper to add. Returns copy + an affiliate CTA.
function getNextStep(
  score: number,
  processing: { rating?: string } | null,
): { headline: string; detail: string; rec: (typeof SUPPLEMENT_RECS)[number] } {
  const rating = (processing?.rating || "").toLowerCase();
  const poorFormat =
    rating.includes("kibble") ||
    rating.includes("poor") ||
    rating.includes("baked") ||
    rating.includes("extruded");
  const fishOil = SUPPLEMENT_RECS[2]; // Fish Oil (Omega-3) — universal anti-inflammatory topper
  if (poorFormat || score < 45) {
    return {
      headline: "Upgrade the format — or top it off",
      detail:
        "This is a heat-processed food, so enzymes and heat-sensitive nutrients are degraded. The biggest win is swapping part of each meal for gently cooked, freeze-dried, or raw. On a budget, start by adding a whole-food omega-3 topper to every bowl.",
      rec: fishOil,
    };
  }
  return {
    headline: "Add a targeted topper",
    detail:
      "The format here is solid. To push it further, add an anti-inflammatory omega-3 topper — it supports coat, joints, and brain and helps balance the omega-6:3 ratio.",
    rec: fishOil,
  };
}

// DCM heart-risk pattern — PRESENTATION ONLY, reads the same ingredient list the
// scorer already parsed. Does NOT feed into or alter the score (the existing
// legume/DCM penalty in the scoring function is untouched) — this is a
// separate, clearly-labelled informational panel per Kyle's spec: flag
// grain-free + legume/potato-in-top-5 as a distinct evidence-linked category,
// never folded into general ingredient "concerns".
const DCM_GRAIN_TERMS = ["rice", "oat", "oats", "barley", "wheat", "corn", "sorghum", "millet"];
const DCM_EXOTIC_PROTEIN = ["kangaroo", "bison", "venison", "duck", "alligator", "boar", "rabbit", "ostrich", "elk"];

function getDCMPattern(ingredientList: string[]): {
  triggered: boolean;
  tier: "Highest" | "Elevated" | null;
  grainFree: boolean;
  legumeOrPotatoTop5: boolean;
  fractionated: boolean;
  fractionCount: number;
  exotic: boolean;
} {
  const lower = ingredientList.map((i) => i.toLowerCase());
  const top5 = lower.slice(0, 5);
  const top10 = lower.slice(0, 10);
  const isSweetPotato = (s: string) => s.includes("sweet potato");
  const isPotato = (s: string) => !isSweetPotato(s) && s.includes("potato");
  // LENTIL_LEGUME is the existing scoring constant (peas/pea fractions/lentils/
  // chickpeas/beans) — reused read-only, never mutated, never re-scored here.
  const isLegume = (s: string) => LENTIL_LEGUME.some((term) => s.includes(term));

  const grainFree = !top10.some((i) => DCM_GRAIN_TERMS.some((g) => i.includes(g)));
  const legumeOrPotatoTop5 = top5.some((i) => isLegume(i) || isPotato(i));
  const fractionCount = top10.filter((i) => isLegume(i)).length;
  const fractionated = fractionCount >= 3;
  const triggered = grainFree && (legumeOrPotatoTop5 || fractionated);
  const exotic = lower.slice(0, 3).some((i) => DCM_EXOTIC_PROTEIN.some((p) => i.includes(p)));

  return {
    triggered,
    tier: triggered ? (exotic ? "Highest" : "Elevated") : null,
    grainFree,
    legumeOrPotatoTop5,
    fractionated,
    fractionCount,
    exotic,
  };
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
  // Which red-flag chips are expanded to show their one-sentence "why" inline.
  const [expandedRedFlags, setExpandedRedFlags] = useState<Record<string, boolean>>({});
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
  const [prebioticsFound, setPrebioticsFound] = useState<string[]>([]);
  const [sourcingIssues, setSourcingIssues] = useState<string[]>([]);
  const [aafcoStatus, setAafcoStatus] = useState("");
  const [onTAPFList, setOnTAPFList] = useState(false);
  const [processing, setProcessing] = useState<{
    method: string;
    rating: string;
    scoreCap: number;
    penalty: number;
    bonus: number;
    emoji: string;
  } | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [rawIngredientsText, setRawIngredientsText] = useState("");
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
  const [cameraProductName, setCameraProductName] = useState("");
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
  // Quick ingredient lookup — ask about one or a few ingredients without a
  // full scan. Reuses handleIngredientTap + the existing ingredient detail
  // modal below; no new API surface.
  const [showIngredientLookup, setShowIngredientLookup] = useState(false);
  const [ingredientLookupText, setIngredientLookupText] = useState("");
  const [coachVisible, setCoachVisible] = useState(false);
  const [coachMessages, setCoachMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [showCoachPaywall, setShowCoachPaywall] = useState(false);
  // The signed-in owner's dog, used to personalise the coach header and the
  // results-screen prompt. Null when signed out — scanning never requires an account.
  const [dogProfileName, setDogProfileName] = useState<string | null>(null);
  // Breed drives the copper warning below — see COPPER_SENSITIVE_BREEDS.
  const [dogProfileBreed, setDogProfileBreed] = useState<string | null>(null);

  // ── Food comparison ──────────────────────────────────────────────────────
  // A scan wipes the previous result, so the food being compared against is
  // snapshotted here before the next scan starts.
  type SavedFood = {
    name: string; score: number; flagged: string[];
    processing: string; ingredients: string[];
  };
  const [compareFood, setCompareFood] = useState<SavedFood | null>(null);
  const [compareVisible, setCompareVisible] = useState(false);
  const [compareVerdict, setCompareVerdict] = useState<string | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareSavedNotice, setCompareSavedNotice] = useState(false);

  const saveForComparison = () => {
    if (score === null) return;
    setCompareFood({
      name: productName,
      score,
      flagged: flagged.map((f) => f.name),
      processing: processing?.method ?? "Unknown",
      ingredients,
    });
    // Deliberately NOT Alert.alert: it silently does nothing on react-native-web,
    // so the button looked completely dead in the browser preview. In-app state
    // renders everywhere.
    setCompareSavedNotice(true);
    setTimeout(() => setCompareSavedNotice(false), 4000);
  };

  /** Ask the coach which food is better, with the dog's profile in play. */
  const runComparison = async () => {
    if (!compareFood || score === null) return;
    setCompareVerdict(null);
    setCompareLoading(true);
    const question =
      `Compare these two dog foods and tell me which is the better choice, and why.\n\n` +
      `FOOD A — ${compareFood.name}\n` +
      `Score: ${compareFood.score}/100 · Processing: ${compareFood.processing}\n` +
      `Concerning ingredients: ${compareFood.flagged.join(", ") || "none flagged"}\n` +
      `Ingredients: ${compareFood.ingredients.slice(0, 30).join(", ")}\n\n` +
      `FOOD B — ${productName}\n` +
      `Score: ${score}/100 · Processing: ${processing?.method ?? "Unknown"}\n` +
      `Concerning ingredients: ${flagged.map((f) => f.name).join(", ") || "none flagged"}\n` +
      `Ingredients: ${ingredients.slice(0, 30).join(", ")}\n\n` +
      `Say clearly which one you'd pick and the main reasons. If neither is good, say that too. ` +
      `Keep it to 4-6 sentences.`;
    const reply = await askNutritionCoach(
      `${compareFood.name} vs ${productName}`,
      ingredients.join(", "),
      score,
      flagged.map((f) => f.name),
      [{ role: "user", content: question }],
    );
    setCompareVerdict(reply);
    setCompareLoading(false);
  };

  // Refresh whenever the coach opens, so a profile saved mid-session shows up
  // without needing an app restart.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await getSession();
        if (!session) { if (!cancelled) { setDogProfileName(null); setDogProfileBreed(null); } return; }
        const profile = await getDogProfile();
        if (!cancelled) { setDogProfileName(profile?.dog_name ?? null); setDogProfileBreed(profile?.breed ?? null); }
      } catch {
        if (!cancelled) { setDogProfileName(null); setDogProfileBreed(null); }
      }
    })();
    return () => { cancelled = true; };
  }, [coachVisible]);
  const [ingredientDetailVisible, setIngredientDetailVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredientDetailData, setIngredientDetailData] = useState<any>(null);
  const [ingredientDetailLoading, setIngredientDetailLoading] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<
    { label: string; value: number; severity?: string }[]
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!permission) return <View />;

  // [PREVIEW-ONLY, uncommitted] let web fall through so demo buttons are reachable
  if (!permission.granted && Platform.OS !== "web") {
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
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            paddingTop: 56,
            borderBottomWidth: 1,
            borderBottomColor: t.surface,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowGuide(false)}
            style={{ marginRight: 12 }}
          >
            <Text style={{ color: t.good, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ color: t.textStrong, fontSize: 18, fontWeight: "700" }}>
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
              color: t.good,
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
                backgroundColor: t.surface,
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
                  style={{ color: t.textStrong, fontWeight: "700", fontSize: 13 }}
                >
                  {v.name}
                </Text>
                <Text style={{ fontSize: 16 }}>{v.rating}</Text>
              </View>
              <Text style={{ color: t.infoSoft, fontSize: 11, marginBottom: 4 }}>
                Form: {v.form}
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17 }}>
                {v.risk}
              </Text>
            </View>
          ))}

          {/* MINERALS */}
          <Text
            style={{
              color: t.good,
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
                backgroundColor: t.surface,
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
                  style={{ color: t.textStrong, fontWeight: "700", fontSize: 13 }}
                >
                  {m.name}
                </Text>
                <Text style={{ fontSize: 16 }}>{m.rating}</Text>
              </View>
              <Text style={{ color: t.infoSoft, fontSize: 11, marginBottom: 4 }}>
                Form: {m.form}
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17 }}>
                {m.risk}
              </Text>
            </View>
          ))}

          {/* PROTEINS */}
          <Text
            style={{
              color: t.good,
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
                backgroundColor: t.surface,
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
                  style={{ color: t.textStrong, fontWeight: "700", fontSize: 13 }}
                >
                  {p.name}
                </Text>
                <Text style={{ color: t.textMuted, fontSize: 11 }}>
                  {p.allergen}
                </Text>
              </View>
              <Text style={{ color: t.infoSoft, fontSize: 11, marginBottom: 4 }}>
                Digestibility: {p.digestibility}
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17 }}>
                {p.note}
              </Text>
            </View>
          ))}

          {/* PROCESSING METHODS */}
          <Text
            style={{
              color: t.good,
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
              color: t.good,
              pros: "Full control over every ingredient. No preservatives, no synthetic additives, human-grade whole foods.",
              cons: "Requires careful formulation to meet AAFCO guidelines — vitamin and mineral balance is critical. Work with a veterinary nutritionist or use a service like BalanceIT or JustFoodForDogs recipes to ensure complete nutrition.",
              warning:
                "⚠️ Home cooked diets that are not properly formulated can cause serious deficiencies over time (zinc, calcium, B vitamins, Vitamin D). Always verify AAFCO compliance before feeding long term.",
            },
            {
              rank: "2",
              name: "Raw (Pathogen-Controlled)",
              emoji: "🌟",
              color: t.good,
              pros: "Highest enzyme retention (~95%). Most bioavailable nutrients. Closest to ancestral diet. Ideal omega ratio when properly formulated.",
              cons: "Pathogen risk (Salmonella, E. coli, Listeria) if not handled carefully. Must be from a reputable source with pathogen testing (HPP-treated preferred). Not recommended for immunocompromised dogs or households.",
              warning:
                "⚠️ Look for HPP (High Pressure Processing) treated raw — kills pathogens without heat. Brands like Primal, Vital Essentials, Small Batch use HPP.",
            },
            {
              rank: "3",
              name: "Freeze-Dried",
              emoji: "❄️",
              color: t.good,
              pros: "Near-raw nutrition — enzymes and nutrients preserved without heat. Lightweight, shelf stable. Convenient alternative to raw.",
              cons: "Expensive per serving. Rehydration required for some products. Quality varies by brand.",
              warning: null,
            },
            {
              rank: "4",
              name: "Gently Cooked",
              emoji: "🍳",
              color: t.good,
              pros: "Human-grade ingredients. Low heat preserves more nutrients than kibble. Whole food proteins. Much better bioavailability than dry food.",
              cons: "Some enzyme loss from heat above 118°F. Shorter shelf life, requires refrigeration. More expensive than kibble.",
              warning: null,
            },
            {
              rank: "5",
              name: "Dehydrated",
              emoji: "🌿",
              color: t.good,
              pros: "Low heat (104–118°F) preserves most enzymes and nutrients. Human-grade ingredients (Honest Kitchen). Just add water. Better than canned or kibble.",
              cons: "Higher carb content in some formulas (Honest Kitchen Whole Grain ~40%). Rehydration required.",
              warning: null,
            },
            {
              rank: "6",
              name: "Air-Dried",
              emoji: "🌬️",
              color: t.high,
              pros: "Slow drying at low temperature preserves more nutrients than baking or extrusion. Convenient, shelf stable. Better than kibble.",
              cons: "Not as nutrient-dense as freeze-dried or raw. Some enzyme loss. Expensive.",
              warning: null,
            },
            {
              rank: "7",
              name: "Canned / Wet Food",
              emoji: "🥫",
              color: t.high,
              pros: "High moisture content (good for hydration). Whole food ingredients. No artificial preservatives needed (sealed can). Better than dry food for ingredient quality.",
              cons: "Retort processed at 240–250°F — hotter than kibble in some cases. Destroys most enzymes and heat-sensitive vitamins. Heavy synthetic supplementation added back after processing.",
              warning:
                "⚠️ Despite better ingredients, canned food is heavily heat processed. Better than kibble for hydration and ingredient quality but not as nutritious as raw, freeze-dried, or gently cooked.",
            },
            {
              rank: "8",
              name: "Baked",
              emoji: "🟡",
              color: t.high,
              pros: "Lower heat than extrusion. Slightly better nutrient retention than kibble. Some whole food ingredients.",
              cons: "Still reaches temperatures that destroy most enzymes and degrade heat-sensitive vitamins (B1, B9, C). Requires heavy synthetic supplementation. Limited brands use this method.",
              warning: null,
            },
            {
              rank: "9",
              name: "Dry / Kibble (Extruded)",
              emoji: "🔴",
              color: t.criticalDeep,
              pros: "Convenient, affordable, shelf stable, widely available.",
              cons: "Extruded at 250–300°F — destroys virtually all enzymes and denatures heat-sensitive nutrients. Synthetic vitamin premix added back post-processing. Lowest bioavailability of any pet food format. Most formulas contain preservatives, fillers, and poor-quality ingredients.",
              warning:
                "🚨 Most kibble runs an omega-6 to omega-3 ratio of 15:1–30:1 (ideal is 5:1). Enzyme supplementation recommended. If feeding kibble long term, choose the cleanest label possible and add whole food toppers.",
            },
            {
              rank: "10",
              name: "Semi-Moist / Pellets",
              emoji: "🚫",
              color: t.criticalDeep,
              pros: "Palatable, convenient.",
              cons: "Worst category. High in sugar, propylene glycol, artificial colors, and humectants to maintain soft texture. High carb content. Heavily processed. Virtually no nutritional value beyond basic calories.",
              warning:
                "🚨 Avoid. The preservatives and humectants required to keep semi-moist food shelf stable at room temperature make this the least healthy option in any pet food category.",
            },
          ].map((p, i) => (
            <View
              key={i}
              style={{
                backgroundColor: t.surface,
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
                  style={{ color: t.textStrong, fontWeight: "700", fontSize: 14 }}
                >
                  {p.name}
                </Text>
              </View>
              <Text
                style={{
                  color: t.good,
                  fontSize: 11,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                ✅ Pros:
              </Text>
              <Text
                style={{
                  color: t.textMuted,
                  fontSize: 12,
                  lineHeight: 17,
                  marginBottom: 6,
                }}
              >
                {p.pros}
              </Text>
              <Text
                style={{
                  color: t.high,
                  fontSize: 11,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                ⚠️ Cons:
              </Text>
              <Text
                style={{
                  color: t.textMuted,
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
                    color: t.critical,
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
              color: t.good,
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
                backgroundColor: t.surfaceAlt,
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: r.icon === "🚨" ? t.criticalDeep : t.high,
              }}
            >
              <Text
                style={{
                  color: t.textStrong,
                  fontWeight: "700",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                {r.icon} {r.title}
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17 }}>
                {r.body}
              </Text>
            </View>
          ))}

          <Text
            style={{
              color: t.textDim,
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
          style={[styles.button, { marginTop: 10, backgroundColor: t.surface }]}
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
          cameraProductName.trim() || result.product_name || result.brand || "Scanned Treat",
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
          // Product not in cache — prompt user to scan the ingredient list
          setShowIngredientScanPrompt(true);
          setError("");
          scanningRef.current = false;
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
        setRawIngredientsText(rawIngredients);
        const scannedName = cameraProductName.trim() || result.product_name || "Scanned Product";
        setProductName(scannedName);
        if (result.guaranteed_analysis) applyGA(result.guaranteed_analysis);
        setSmartScanStep("Scoring formula...");
        await processIngredients(
          scannedName,
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

    // Guard: people sometimes type the product NAME into the ingredient box
    // (e.g. "Purina puppy food"), which would get scored as a single bogus
    // ingredient. A real ingredient list has multiple comma-separated items.
    const nameNorm = manualProductName.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const rawNorm = raw.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (ingredientList.length < 2 || (nameNorm && rawNorm === nameNorm)) {
      Alert.alert(
        "That looks like a product name",
        'Please paste the actual ingredient list from the label — the comma-separated items, e.g. "Chicken, brown rice, salmon oil, peas, ...". Or use Smart Scan to photograph the label and we\'ll read it for you.',
      );
      return;
    }

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
    setRawIngredientsText(raw);

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
  };

  const processIngredients = async (
    name: string,
    rawIngredients: string,
    ingredientList: string[],
    sheetProcessingMethod: string,
    knownOmegaRatio?: string | null,
    isDemo?: boolean,
  ) => {
    const customIngredients = await loadCustomIngredients();
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
      ingredientList.some((ing) =>
        OMEGA3_MARINE.some((m) => ing.toLowerCase().includes(m)),
      ),
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
    setPrebioticsFound(
      ingredientList.filter((ing) =>
        PREBIOTIC_SOURCES.some((pb) => ing.toLowerCase().includes(pb)),
      ),
    );
    setSourcingIssues(genericInTop5);
    setAafcoStatus(aafco);
    setOnTAPFList(tapf);
    setProcessing(processingResult);
    setVitaminScore({ count: vitCount, penalty: vitPenalty, level: vitLevel });
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
    for (const h of foundHarmful) {
      const base = SEVERITY_PENALTIES[h.severity] || 8;
      const pos = h.position ?? 0;
      const mult = pos < 5 ? 1.0 : pos < 10 ? 0.65 : pos < 20 ? 0.40 : 0.20;
      const p = Math.min(10, Math.max(1, Math.round(base * mult)));
      total -= p;
      const posNote = pos >= 10 ? ` — ingredient #${pos + 1} (trace amount)` : pos >= 5 ? ` — ingredient #${pos + 1}` : "";
      breakdown.push({ label: `${h.name} (${h.severity})${posNote}`, value: -p, severity: h.severity });
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
    total = Math.max(5, Math.round(total));
    setScore(total);
    setScoreBreakdown(breakdown);
    if (!isDemo) logScan({ productName: name, score: total, processingMethod: processingResult.method, ingredientCount: ingredientList.length, scanMethod: scanMode }).catch(() => {});
    // Fire recall check in background — don't await, never blocks results
    const brandWord = name.split(" ")[0];
    if (brandWord && brandWord.length > 2)
      checkFDARecall(brandWord).catch(() => {});
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

  /**
   * Open the coach with a question already asked on the owner's behalf.
   *
   * This is what keeps the evidence out of the results screen. Rather than
   * printing trials and effect sizes under every section — which makes the page
   * heavier and gets read less — each section offers one tap that asks the
   * question a curious owner would have asked anyway, and the depth arrives as a
   * conversation they can keep pulling on.
   *
   * The seeded question is shown as if the owner typed it, because pretending the
   * app asked it for them would make the follow-ups feel disconnected.
   */
  const askAboutSection = async (question: string) => {
    // Same metering as a typed message — a free tap shouldn't be a way around it.
    const countStr = await AsyncStorage.getItem("coach_message_count");
    const count = parseInt(countStr || "0", 10);
    if (count >= 5) {
      setShowCoachPaywall(true);
      setCoachVisible(true);
      return;
    }

    const opener = `Ask me anything about **${productName}** — I'll answer for ${
      dogProfileName ?? "your dog"
    }.`;
    const userMsg = { role: "user", content: question };
    const seeded = [{ role: "assistant", content: opener }, userMsg];
    setCoachMessages(seeded);
    setCoachVisible(true);
    setCoachLoading(true);

    const reply = await askNutritionCoach(
      productName,
      ingredients.join(", "),
      score ?? 0,
      flagged.map((f) => f.name),
      seeded,
    );
    setCoachMessages([...seeded, { role: "assistant", content: reply }]);
    setCoachLoading(false);
    await AsyncStorage.setItem("coach_message_count", String(count + 1));
  };

  const sendCoachMessage = async () => {
    if (!coachInput.trim() || coachLoading) return;

    const countStr = await AsyncStorage.getItem("coach_message_count");
    const count = parseInt(countStr || "0", 10);
    if (count >= 5) {
      setShowCoachPaywall(true);
      return;
    }

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
    await AsyncStorage.setItem("coach_message_count", String(count + 1));
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

      // Step 1: OUR OWN database first (SmartScan-sourced rows only).
      // (Replaces the deprecated unknown-origin Google Sheet.)
      try {
        const owned = await lookupProduct(data); // owned sources only by default
        if (owned) {
          name = owned.product_name || "";
          rawIngredients = owned.ingredients || "";
          sheetProcessingMethod = owned.processing_method || "";
          setDataSource("🗄️ Our database");
        }
      } catch (e) {
        console.log("Own DB lookup failed");
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

      // Step 4b: Go-UPC — DISABLED 2026-07-13, Kyle canceled the paid subscription,
      // so every call would just fail (dead network round-trip) before falling
      // through anyway. Left in place (commented) rather than deleted in case the
      // subscription is ever reactivated — flip GOUPC_ENABLED back to re-enable.
      const GOUPC_ENABLED = false;
      if (GOUPC_ENABLED && !rawIngredients) {
        try {
          const quota = await getBarcodeQuota();
          if (quota.canUse) {
            const goupcResult = await lookupWithGoUPC(data);
            if (goupcResult?.found) {
              await incrementBarcodeQuota(); // count the successful API call
              if (!name && goupcResult.product_name) name = goupcResult.product_name;
              if (goupcResult.ingredients) {
                rawIngredients = goupcResult.ingredients;
                setDataSource("📦 Product lookup");
                // Intentionally NOT saved — Go-UPC data is use-only (licensing).
              }
            }
          } else {
            console.log("Go-UPC monthly quota exhausted — skipping; SmartScan will be offered.");
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


      // Guard: some sources (Open Food Facts is user-contributed, or a bad cached
      // row) return junk in the ingredients field — e.g. the product name itself
      // ("Purina Puppy Food"). A real ingredient list has many comma-separated
      // items and isn't just the product name. If it fails the sanity check, drop
      // it so we fall through to Smart Scan (OCR the actual label) below.
      const looksLikeIngredientList = (text: string, prod: string) => {
        const t = (text || "").trim();
        if (t.length < 15) return false;
        const parts = t.split(/,|;/).map((s) => s.trim()).filter(Boolean);
        if (parts.length < 3) return false; // real lists have many items
        const norm = (s: string) =>
          (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        if (prod && norm(t) === norm(prod)) return false; // it's just the name
        return true;
      };
      if (rawIngredients && !looksLikeIngredientList(rawIngredients, name)) {
        console.log("Discarding non-ingredient text from barcode source:", rawIngredients);
        rawIngredients = "";
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
        if (customMatch) {
          foundHarmful.push({
            name: ing,
            reason: customMatch.reason,
            severity: customMatch.severity,
            position: _hi,
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
        ingredientList.some((ing) =>
          OMEGA3_MARINE.some((mm) => ing.toLowerCase().includes(mm)),
        ),
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
      total -= processingResult.penalty;
      total += processingResult.bonus;
      for (const h of foundHarmful) {
        const base = SEVERITY_PENALTIES[h.severity] || 8;
        const pos = h.position ?? 0;
        const mult = pos < 5 ? 1.0 : pos < 10 ? 0.65 : pos < 20 ? 0.40 : 0.20;
        const p = Math.min(10, Math.max(1, Math.round(base * mult)));
        total -= p;
        const posNote = pos >= 10 ? ` — ingredient #${pos + 1} (trace amount)` : pos >= 5 ? ` — ingredient #${pos + 1}` : "";
        breakdown.push({ label: `${h.name} (${h.severity})${posNote}`, value: -p, severity: h.severity });
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
      total = Math.max(5, Math.round(total));
      setScore(total);
      setScoreBreakdown(breakdown);
      logScan({ productName: name, score: total, processingMethod: processingResult.method, ingredientCount: ingredientList.length, scanMethod: 'name_search' }).catch(() => {});
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
      "Chicken, Rice, Whole Grain Wheat, Poultry By-Product Meal, Whole Grain Corn, Soybean Meal, Beef Fat Preserved With Mixed-Tocopherols, Corn Protein Meal, Dried Egg Product, Natural Flavor, Dried Beet Pulp, Glycerin, Mono And Dicalcium Phosphate, Wheat Bran, Calcium Carbonate, Fish Meal, Salt, Soybean Oil, Potassium Chloride, Zinc Proteinate, Ferrous Sulfate, Manganese Proteinate, Copper Proteinate, Calcium Iodate, Sodium Selenite, Vitamin E Supplement, Niacin, Thiamine Mononitrate, Calcium Pantothenate, Vitamin A Supplement, Riboflavin Supplement, Vitamin B-12 Supplement, Pyridoxine Hydrochloride, Folic Acid, Menadione Sodium Bisulfite Complex, Biotin, Vitamin D-3 Supplement, Choline Chloride, Dried Bacillus Coagulans Fermentation Product, L-Ascorbyl-2-Polyphosphate, L-Lysine Monohydrochloride, Garlic Oil";
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
    await processIngredients(demoName, demoRaw, demoList, "kibble", "14:1", true);
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
      true,
    );
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
    await processIngredients(demoName, demoRaw, demoList, "baked", null, true);
  };

  return (
    <View style={styles.container}>
      {!scanned ? (
        <View style={styles.scanScreen}>
          <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scanEyebrow}>🐾 PawGrade</Text>
                <Text style={[styles.title, { marginBottom: 0 }]}>
                  {scanMode === "manual" ? "Type in ingredients" : "Scan a food"}
                </Text>
              </View>
              {/* Ask AI — the assistant's front door. It only appears once a food has
                  been scored, because a coach with no food to talk about invites the
                  general-chatbot questions this assistant deliberately doesn't answer. */}
              {score !== null && (
                <TouchableOpacity
                  onPress={openCoach}
                  accessibilityRole="button"
                  accessibilityLabel={
                    dogProfileName ? `Ask AI about this food for ${dogProfileName}` : "Ask AI about this food"
                  }
                  style={{
                    height: 34,
                    borderRadius: 17,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    backgroundColor: t.aiTint,
                    borderWidth: 1,
                    borderColor: t.ai,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontSize: 13 }}>✨</Text>
                  <Text style={{ color: t.ai, fontSize: 12, fontWeight: "700" }}>Ask AI</Text>
                </TouchableOpacity>
              )}

              {/* Dog profile / sign-in. Previously the only route to the profile was
                  buried inside the coach modal, so there was no way to reach it from
                  the main screen at all. */}
              <TouchableOpacity
                onPress={async () => {
                  const session = await getSession();
                  router.push((session ? "/dog-profile" : "/login") as Href);
                }}
                accessibilityLabel={dogProfileName ? `Edit ${dogProfileName}'s profile` : "Add your dog's profile"}
                style={{
                  height: 34,
                  borderRadius: 17,
                  paddingHorizontal: 12,
                  marginRight: 8,
                  backgroundColor: dogProfileName ? t.goodTint : t.surface,
                  borderWidth: 1,
                  borderColor: dogProfileName ? t.good : t.border,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Text style={{ fontSize: 14 }}>🐾</Text>
                <Text style={{ color: dogProfileName ? t.good : t.textMuted, fontSize: 12, fontWeight: "700" }}>
                  {dogProfileName ?? "Add dog"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setShowFeedbackModal(true); setFeedbackSubmitted(false); }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: t.surface,
                  borderWidth: 1,
                  borderColor: t.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 15 }}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
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
            {/* Treats mode disabled — tab hidden until the custom treats database is built.
                Treats scoring/results code is left intact but unreachable from the UI. */}
          </View>
          <View style={styles.heroCard}>
            <Text style={styles.heroCardIcon}>
              {scanMode === "manual" ? "⌨️" : scanMode === "treats" ? "🦴" : "📷"}
            </Text>
            <Text style={styles.heroCardText}>
              {scanMode === "treats"
                ? "Point at the ingredient list on a treat bag"
                : scanMode === "manual"
                  ? "Type or paste an ingredient list to analyze"
                  : "Tap the button to scan the ingredient label — barcode recognition also works for previously-scanned products"}
            </Text>
          </View>
          {scanMode === "manual" ? (
            <View style={{ flex: 1, width: "100%", paddingHorizontal: 16, paddingTop: 8 }}>
              <TextInput
                style={{
                  backgroundColor: t.surface,
                  color: t.textStrong,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: t.border,
                  padding: 14,
                  fontSize: 14,
                  marginBottom: 10,
                }}
                placeholder="Product name (optional)"
                placeholderTextColor={t.textFaint}
                value={manualProductName}
                onChangeText={setManualProductName}
              />
              <TextInput
                style={{
                  backgroundColor: t.surface,
                  color: t.textStrong,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: t.border,
                  padding: 14,
                  fontSize: 14,
                  marginBottom: 10,
                }}
                placeholder="Barcode number (optional — for future scans)"
                placeholderTextColor={t.textFaint}
                value={manualBarcode}
                onChangeText={setManualBarcode}
                keyboardType="numeric"
              />
              <TextInput
                style={{
                  backgroundColor: t.surface,
                  color: t.textStrong,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: t.border,
                  padding: 14,
                  fontSize: 14,
                  lineHeight: 20,
                  minHeight: 180,
                  textAlignVertical: "top",
                  marginBottom: 14,
                }}
                placeholder={"Paste ingredient list here...\n\nExample: Chicken, Brown Rice, Chicken Meal, Peas, Chicken Fat, Fish Oil..."}
                placeholderTextColor={t.textFaint}
                value={manualIngredientText}
                onChangeText={setManualIngredientText}
                multiline
              />
              <TouchableOpacity
                style={{
                  backgroundColor: manualIngredientText.trim() ? t.good : t.surface,
                  borderRadius: 999,
                  paddingVertical: 15,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: manualIngredientText.trim() ? t.goodDeep : t.border,
                }}
                onPress={handleManualAnalyze}
                disabled={!manualIngredientText.trim()}
              >
                <Text
                  style={{
                    color: manualIngredientText.trim() ? t.onAccent : t.textFaint,
                    fontWeight: "800",
                    fontSize: 15,
                    letterSpacing: 0.2,
                  }}
                >
                  Analyze Ingredients
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: "100%", flex: 1 }}>
              <TextInput
                style={{
                  backgroundColor: t.surface,
                  color: t.textStrong,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: t.border,
                  padding: 14,
                  fontSize: 14,
                  marginHorizontal: 16,
                  marginBottom: 10,
                }}
                placeholder="Brand / product name (optional)"
                placeholderTextColor={t.textFaint}
                value={cameraProductName}
                onChangeText={setCameraProductName}
              />
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
            </View>
          )}
          {scanMode !== "manual" && (
            <>
              <Text
                style={{
                  color: t.textFaint,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 6,
                  marginTop: 12,
                }}
              >
                Try a sample scan:
              </Text>
              <View style={styles.demoRow}>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnBad]}
                  onPress={loadDemo}
                >
                  <Text style={[styles.demoBtnText, { color: t.critical }]}>
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
                  <Text style={[styles.demoBtnText, { color: t.critical }]}>
                    🦴 Milk-Bone Treats
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Quick ingredient lookup — ask about one or a few ingredients
              without needing a full scan. Tapping a chip reuses the exact
              same handleIngredientTap() + detail modal a scanned ingredient
              pill uses, so this is pure UI, no new lookup logic. */}
          <TouchableOpacity
            onPress={() => setShowIngredientLookup((v) => !v)}
            style={{
              alignSelf: "stretch",
              marginHorizontal: 16,
              marginTop: 4,
              backgroundColor: t.surface,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: t.border,
              paddingVertical: 12,
              paddingHorizontal: 14,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, marginRight: 9 }}>🔍</Text>
            <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "600", flex: 1 }}>
              Ask about an ingredient
            </Text>
            <Text style={{ color: t.textFaint, fontSize: 12 }}>{showIngredientLookup ? "▾" : "▸"}</Text>
          </TouchableOpacity>
          {showIngredientLookup && (
            <View
              style={{
                alignSelf: "stretch",
                marginHorizontal: 16,
                marginTop: 8,
                backgroundColor: t.surfaceSunken,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: t.surface,
                  color: t.textStrong,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: t.border,
                  padding: 11,
                  fontSize: 13,
                }}
                placeholder="Type one or a few — e.g. menadione, BHA, pea protein"
                placeholderTextColor={t.textFaint}
                value={ingredientLookupText}
                onChangeText={setIngredientLookupText}
                returnKeyType="done"
              />
              <Text style={{ color: t.textDim, fontSize: 11, marginTop: 6, marginBottom: 8 }}>
                Separate a few with commas — tap one to see what it means.
              </Text>
              {ingredientLookupText.trim().length > 0 && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
                  {ingredientLookupText
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                    .map((name, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleIngredientTap(name)}
                        style={{
                          backgroundColor: t.infoSoft + "22",
                          borderWidth: 1,
                          borderColor: t.info + "55",
                          borderRadius: 999,
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                        }}
                      >
                        <Text style={{ color: t.info, fontSize: 12.5, fontWeight: "600" }}>{name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
              marginTop: 12,
              marginBottom: 6,
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
              <Text style={[styles.disclaimerLinkText, { color: t.good }]}>
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
              <ActivityIndicator size="large" color={t.good} />
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
                  <AccordionSection
                    title="Why This Score"
                    askLabel="Explain"
                    onAskAI={() =>
                      askAboutSection(
                        `Why did ${productName} score ${score}/100? Walk me through what helped and what hurt, in plain language.`,
                      )
                    }
                  >
                    {scoreBreakdown.map((item, i) => (
                      <View key={i} style={styles.breakdownRow}>
                        <Text style={[styles.breakdownLabel, {
                          color: item.severity === 'toxic' ? t.critical
                            : item.severity === 'severe' ? t.high
                            : item.severity === 'moderate' ? t.moderate
                            : item.severity === 'mild' ? t.moderateDeep
                            : t.text,
                        }]}>{item.label}</Text>
                        <Text
                          style={[
                            styles.breakdownValue,
                            {
                              color:
                                item.value > 0
                                  ? t.good
                                  : item.value < 0
                                    ? t.critical
                                    : t.textMuted,
                            },
                          ]}
                        >
                          {item.value > 0 ? `+${item.value}` : item.value}
                        </Text>
                      </View>
                    ))}
                  </AccordionSection>
                )}

                {scoreBreakdown.length > 0 && (
                  <AccordionSection title="🌿 Protein Energetics (TCVM)">
                    <Text style={[styles.sectionBody, { marginBottom: 10 }]}>
                      Traditional Chinese Veterinary Medicine classifies proteins by their energetic properties. Matching protein to your dog's constitution and season reduces inflammation, hot spots, and digestive upset.
                    </Text>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ color: t.info, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>❄️ Cooling Proteins</Text>
                      <Text style={{ color: t.infoSoft, fontSize: 13, lineHeight: 19 }}>Duck · Rabbit · Cod · Flounder · Whitefish · Turkey · Clams · Pork</Text>
                      <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Best for: hot dogs, skin issues, allergies, hot spots, summer heat, panting</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ color: t.textMuted, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>⚖️ Neutral Proteins</Text>
                      <Text style={{ color: t.text, fontSize: 13, lineHeight: 19 }}>Beef · Salmon · Eggs · Sardines · Herring · Quail · Pork</Text>
                      <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Good for most dogs year-round</Text>
                    </View>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: t.critical, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>🔥 Warming Proteins</Text>
                      <Text style={{ color: t.critical, fontSize: 13, lineHeight: 19 }}>Chicken · Lamb · Venison · Goat · Trout · Shrimp · Pheasant · Anchovies</Text>
                      <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Best for: cold or lethargic dogs, winter months, poor circulation</Text>
                    </View>
                    <View style={{ backgroundColor: t.dcmTint, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.dcmDeep }}>
                      <Text style={{ color: t.info, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>☀️ Summer Recommendation</Text>
                      <Text style={{ color: t.infoSoft, fontSize: 13, lineHeight: 19 }}>Switch to cooling or neutral proteins in warm months — duck, rabbit, or white fish are ideal. Avoid chicken and lamb if your dog pants excessively, has seasonal allergies, or hot spots.</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL('https://drjudymorgan.com')}>
                      <Text style={{ color: t.good, fontSize: 13, fontWeight: '600' }}>🌿 Learn more at Dr. Judy Morgan's site →</Text>
                    </TouchableOpacity>
                  </AccordionSection>
                )}

                {scoreBreakdown.length > 0 && (
                  <AccordionSection
                    title="💊 Recommended Supplements"
                    askLabel="For my dog"
                    onAskAI={() =>
                      askAboutSection(
                        `Out of these supplement options, which would actually be worth it for my dog given this food and his situation — and which would be a waste of money? Say what the evidence supports for each one you recommend.`,
                      )
                    }
                  >
                    {SUPPLEMENT_RECS.map((s, i) => (
                      <View key={i} style={{ marginBottom: 12, backgroundColor: s.bg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: s.borderColor }}>
                        <Text style={{ color: s.color, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>{s.emoji} {s.name}</Text>
                        <Text style={{ color: t.text, fontSize: 13, lineHeight: 19, marginBottom: 6 }}>{s.body}</Text>
                        <Text style={{ color: t.textDim, fontSize: 11, marginBottom: 10 }}>{s.note}</Text>
                        <TouchableOpacity style={{ backgroundColor: s.color, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' }} onPress={() => Linking.openURL(s.link)}>
                          <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 12 }}>{s.linkText}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </AccordionSection>
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
                              SEVERITY_COLORS[f.severity] || t.high,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.flagName,
                            { color: SEVERITY_COLORS[f.severity] || t.high },
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
                    <View style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12 }}>
                      <Text style={{ color: t.textStrong, fontWeight: '700', fontSize: 14 }}>{treatProcessingMethod}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>
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
                      <View key={i} style={{ backgroundColor: t.goodTint, borderRadius: 8, padding: 10, marginBottom: 6 }}>
                        <Text style={{ color: t.good, fontWeight: '700', fontSize: 13 }}>{d.ingredient}</Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 2 }}>{d.benefit}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🦷 Dental Care Tips</Text>
                  {[
                    { emoji: "🥥", title: "Coconut Oil + Gauze or Rag", body: "Wrap a piece of gauze or an old rag around your finger, dip in coconut oil, and rub along the gum line. Lauric acid in coconut oil is naturally antibacterial. A dog toothbrush works too — coconut oil is safe if swallowed." },
                    { emoji: "🥕", title: "Raw Carrots", body: "A firm raw carrot is a natural, low-calorie dental chew. The crunchy texture mechanically scrubs plaque and most dogs love them. Great everyday snack." },
                    { emoji: "🍯", title: "Manuka Honey (UMF 10+) for Cuts", body: "A tiny dab of raw Manuka honey on the gums supports oral microbiome health and can be applied directly to minor surface cuts for its antimicrobial properties. Note: ~80% natural sugars — use sparingly, not as a regular supplement." },
                    { emoji: "🦴", title: "Raw Bones or Chicken Feet (occasionally)", body: "Raw (never cooked) bones and raw chicken feet provide natural mechanical cleaning, especially on back molars where tartar accumulates. Always supervise and research safe sizing for your breed." },
                    { emoji: "🏔️", title: "Himalayan Yak Chews", body: "Made from hardened yak milk — these are one of the most effective natural plaque scrapers available. ⚠️ Try at your own risk — research before use and always supervise your dog." },
                  ].map((tip, i) => (
                    <View key={i} style={{ backgroundColor: t.goodTint, borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: t.goodDeep }}>
                      <Text style={{ color: t.good, fontWeight: '700', fontSize: 13, marginBottom: 3 }}>{tip.emoji} {tip.title}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 18 }}>{tip.body}</Text>
                    </View>
                  ))}
                </View>

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
                                { color: t.textFaint },
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

                <LipomaSection />
                <HersheyProtocolSection />

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
                <View style={styles.scoreHero}>
                  {/* Circular score ring on the dark ground — a measured instrument,
                      not a flat colour slab. The ring colour carries the verdict. */}
                  <View
                    style={[
                      styles.scoreRing,
                      { borderColor: getScoreColor(score) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreRingNumber,
                        { color: getScoreColor(score) },
                      ]}
                    >
                      {score}
                    </Text>
                    <Text style={styles.scoreRingOutOf}>/ 100</Text>
                  </View>
                  <View
                    style={[
                      styles.scoreRatingPill,
                      {
                        backgroundColor: getScoreColor(score) + "22",
                        borderColor: getScoreColor(score) + "55",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreRatingText,
                        { color: getScoreColor(score) },
                      ]}
                    >
                      {getScoreLabel(score)}
                    </Text>
                  </View>
                  <Text style={styles.scoreHeroNote}>
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
              {(!productName || productName === "Scanned Product" || productName === "Analyzed Product") ? (
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: t.textStrong,
                    paddingHorizontal: 16,
                    marginTop: 20,
                    marginBottom: 2,
                    borderBottomWidth: 1,
                    borderBottomColor: t.border,
                  }}
                  placeholder="Add product name..."
                  placeholderTextColor={t.textFaint}
                  value={productName === "Scanned Product" || productName === "Analyzed Product" ? "" : productName}
                  onChangeText={setProductName}
                />
              ) : (
                <Text style={styles.productName}>{productName}</Text>
              )}
              {/* Kibble is the neutral baseline now (no penalty/cap), so its badge
                  is informational, not an alarm colour — that would silently
                  undercut the point of removing the format penalty. Every
                  format that earns a real bonus gets a green badge scaled to
                  how much it earned; kibble/unknown stay neutral. */}
              {processing && !processing.rating.includes("Unknown") && (
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 4, marginBottom: 4 }}>
                  <View style={{
                    backgroundColor: processing.bonus === 0 ? t.surfaceSunken : processing.bonus >= 18 ? t.goodTint : t.moderateTint,
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: processing.bonus === 0 ? t.border : processing.bonus >= 18 ? t.good : t.moderate,
                  }}>
                    <Text style={{ color: processing.bonus === 0 ? t.textMuted : processing.bonus >= 18 ? t.good : t.moderate, fontSize: 12, fontWeight: "700" }}>
                      {processing.emoji} {processing.rating}{processing.bonus > 0 ? ` · +${processing.bonus}` : ""}
                    </Text>
                  </View>
                </View>
              )}
              {(!processing || processing.rating.includes("Unknown")) && rawIngredientsText && !isTreatScan && (
                <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 4 }}>
                  <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 6 }}>What type of food is this?</Text>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    {[
                      { label: "Kibble", value: "kibble" },
                      { label: "Wet", value: "wet food" },
                      { label: "Freeze-Dried", value: "freeze dried" },
                      { label: "Raw", value: "raw" },
                      { label: "Gently Cooked", value: "gently cooked" },
                    ].map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={async () => {
                          const list = rawIngredientsText.split(/,|;/).map((i: string) => i.trim()).filter((i: string) => i.length > 0);
                          await processIngredients(productName, rawIngredientsText, list, opt.value);
                        }}
                        style={{
                          flex: 1,
                          paddingVertical: 7,
                          borderRadius: 8,
                          alignItems: "center",
                          backgroundColor: t.surface,
                          borderWidth: 1,
                          borderColor: t.border,
                        }}
                      >
                        <Text style={{ color: t.textMuted, fontSize: 10, fontWeight: "600" }}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {dataSource !== "" && (
                <Text style={styles.dataSource}>{dataSource}</Text>
              )}

              {recallAlert?.found && (
                <TouchableOpacity
                  style={{
                    backgroundColor: t.toxic,
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 8,
                    marginHorizontal: 2,
                  }}
                  onPress={() => Linking.openURL(recallAlert.url)}
                >
                  <Text
                    style={{ color: t.onAccent, fontWeight: "800", fontSize: 14 }}
                  >
                    ⚠️ Possible FDA Recall on File
                  </Text>
                  <Text
                    style={{ color: t.critical, fontSize: 12, marginTop: 4 }}
                  >
                    {recallAlert.description}
                  </Text>
                  <Text
                    style={{ color: t.critical, fontSize: 11, marginTop: 4 }}
                  >
                    Recall date: {recallAlert.date} — Tap to verify on FDA.gov →
                  </Text>
                </TouchableOpacity>
              )}

              {/* Kyle's note. Set as a pull-quote with a rule down the left, not italics —
                  long italic paragraphs are genuinely hard to read on a phone. */}
              {score !== null && (
                <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 18, padding: 18, marginHorizontal: 16, marginTop: 6, marginBottom: 14, borderWidth: 1, borderColor: t.border, borderLeftWidth: 3, borderLeftColor: t.good }}>
                  <Text style={{ color: t.text, fontSize: 14, lineHeight: 22 }}>
                    💚 I fed my dog kibble for 6 years because I couldn't afford anything better — and he was okay. So please don't feel bad if this is what you can afford right now. They still love you exactly the same.{"\n\n"}The goal isn't perfection, it's just small improvements over time. Even adding a whole food topper, a raw egg, or a little fish a few times a week goes a long way. I'm just trying to help as much as I can. 🐾
                  </Text>
                  <Text style={{ color: t.textDim, fontSize: 12, marginTop: 12, fontWeight: "600" }}>— Kyle, PawGrade founder</Text>
                </View>
              )}

              {score !== null && (
                <View style={{ backgroundColor: t.dcmTint, borderRadius: 18, padding: 18, marginHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: t.dcmDeep }}>
                  <Text style={{ color: t.infoSoft, fontSize: 11, fontWeight: "800", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.1 }}>
                    💡 {getNextStep(score, processing).headline}
                  </Text>
                  <Text style={{ color: t.text, fontSize: 14, lineHeight: 22 }}>
                    {getNextStep(score, processing).detail}
                  </Text>
                </View>
              )}

              {/* Entry point to the AI coach. Placed straight after the score and the
                  "how to improve" card, because that's the moment the owner has a
                  question. Personalised once a dog profile exists. */}
              {score !== null && (
                <TouchableOpacity
                  onPress={openCoach}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 12,
                    backgroundColor: t.goodTint, borderRadius: 18, padding: 16,
                    marginHorizontal: 16, marginBottom: 14,
                    borderWidth: 1, borderColor: t.good,
                  }}
                  accessibilityLabel="Ask the AI nutrition coach about this food"
                >
                  <Text style={{ fontSize: 24 }}>💬</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.textStrong, fontSize: 15, fontWeight: "800" }}>
                      {dogProfileName ? `Ask about this for ${dogProfileName}` : "Ask about this food"}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 2 }}>
                      {dogProfileName
                        ? "Answers account for their diet, supplements and health issues."
                        : "Get holistic answers — add your dog's profile to make them specific."}
                    </Text>
                  </View>
                  <Text style={{ color: t.good, fontSize: 20, fontWeight: "700" }}>›</Text>
                </TouchableOpacity>
              )}

              {/* Compare two foods. Either save this one as the baseline, or — if a
                  baseline is already saved — jump straight to the head-to-head. */}
              {score !== null && (
                <TouchableOpacity
                  onPress={() => {
                    if (compareFood && compareFood.name !== productName) {
                      setCompareVerdict(null);
                      setCompareVisible(true);
                    } else {
                      saveForComparison();
                    }
                  }}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 12,
                    backgroundColor: t.surfaceAlt, borderRadius: 18, padding: 16,
                    marginHorizontal: 16, marginBottom: 14,
                    borderWidth: 1, borderColor: t.border,
                  }}
                  accessibilityLabel="Compare this food with another"
                >
                  <Text style={{ fontSize: 24 }}>⚖️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.textStrong, fontSize: 15, fontWeight: "800" }}>
                      {compareFood && compareFood.name !== productName
                        ? `Compare with ${compareFood.name}`
                        : "Compare with another food"}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 2 }}>
                      {compareSavedNotice
                        ? "✓ Saved — now scan another food to compare it against."
                        : compareFood && compareFood.name !== productName
                          ? "See them side by side and which one wins."
                          : "Save this one, scan another, and see which is better."}
                    </Text>
                  </View>
                  <Text style={{ color: t.textMuted, fontSize: 20, fontWeight: "700" }}>›</Text>
                </TouchableOpacity>
              )}

              {/* Persistent reminder that a food is queued for comparison, so the
                  saved state isn't invisible once the confirmation fades. */}
              {compareFood && compareFood.name === productName && (
                <View style={{
                  marginHorizontal: 16, marginBottom: 14, padding: 12,
                  borderRadius: 12, backgroundColor: t.goodTint,
                  borderWidth: 1, borderColor: t.good,
                }}>
                  <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700" }}>
                    ⚖️ Saved for comparison
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
                    Scan another food and the compare button will show you which one wins.
                  </Text>
                </View>
              )}

              {scoreBreakdown.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Why This Score</Text>
                  {scoreBreakdown.map((item, i) => (
                    <View key={i} style={styles.breakdownRow}>
                      <Text style={[styles.breakdownLabel, {
                        color: item.severity === 'toxic' ? t.critical
                          : item.severity === 'severe' ? t.high
                          : item.severity === 'moderate' ? t.moderate
                          : item.severity === 'mild' ? t.moderateDeep
                          : t.text,
                      }]}>{item.label}</Text>
                      <Text
                        style={[
                          styles.breakdownValue,
                          {
                            color:
                              item.value > 0
                                ? t.good
                                : item.value < 0
                                  ? t.critical
                                  : t.textMuted,
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
                    📷 Point your camera at the Guaranteed Analysis panel on the bag to see exact protein, fat, fiber, moisture, and carb percentages. These numbers come directly from the manufacturer and are the most accurate source.
                  </Text>
                  <View style={{ marginTop: 10, backgroundColor: t.accents.liver.bg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: t.accents.liver.fg }}>
                    <Text style={{ color: t.accents.liver.fg, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>⚠️ High Carbs & Lipomas</Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>High carbohydrate diets spike insulin, promote fat cell proliferation, and drive inflammation — all directly linked to lipoma development and growth. Target carbs below 20%, ideally below 15%. Omega-6:3 ratio of 5:1 or less is strongly anti-inflammatory and helps manage existing lipomas.</Text>
                  </View>
                </View>
              )}
              {nutritionalProfile && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Guaranteed Analysis</Text>
                  {analysisLoading && !nutritionalProfile ? (
                    <Text style={styles.omegaNote}>Analyzing ingredients...</Text>
                  ) : nutritionalProfile ? (
                    <>
                      {[
                        { label: "Protein", value: nutritionalProfile.protein_pct, good: 25, warn: 18, unit: "%" },
                        { label: "Fat", value: nutritionalProfile.fat_pct, good: 15, warn: 8, unit: "%" },
                        { label: "Fiber", value: nutritionalProfile.fiber_pct, good: null, warn: null, unit: "%" },
                        { label: "Moisture", value: nutritionalProfile.moisture_pct, good: null, warn: null, unit: "%" },
                        { label: "Carbs (est.)", value: nutritionalProfile.carb_pct, good: null, warn: 25, unit: "%", invert: true },
                      ].filter(r => r.value != null).map((row, i) => (
                        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: t.bg }}>
                          <Text style={{ color: t.textMuted, fontSize: 13 }}>{row.label}</Text>
                          <Text style={{ color: row.invert ? (row.value! > (row.warn ?? 999) ? t.critical : t.good) : (row.good != null && row.value! >= row.good ? t.good : row.warn != null && row.value! < row.warn ? t.critical : t.moderate), fontWeight: '700', fontSize: 13 }}>{row.value}{row.unit}</Text>
                        </View>
                      ))}
                      {nutritionalProfile.omega_ratio && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                          <Text style={{ color: t.textMuted, fontSize: 13 }}>Omega 6:3 ratio</Text>
                          <Text style={{ color: ["1:", "2:", "3:", "4:", "5:"].some(p => nutritionalProfile.omega_ratio!.startsWith(p)) ? t.good : t.critical, fontWeight: '700', fontSize: 13 }}>{nutritionalProfile.omega_ratio}{["1:", "2:", "3:", "4:", "5:"].some(p => nutritionalProfile.omega_ratio!.startsWith(p)) ? " ✓" : " ⚠️"}</Text>
                        </View>
                      )}
                      <View style={{ marginTop: 10, backgroundColor: t.accents.liver.bg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: t.accents.liver.fg }}>
                        <Text style={{ color: t.accents.liver.fg, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>⚠️ High Carbs & Lipomas</Text>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>High carbohydrate diets spike insulin, promote fat cell proliferation, and drive inflammation — all directly linked to lipoma development and growth. Target carbs below 20%, ideally below 15%. Omega-6:3 ratio of 5:1 or less is strongly anti-inflammatory and helps manage existing lipomas.</Text>
                      </View>
                      <Text style={[styles.omegaNote, { marginTop: 8 }]}>
                        Carbs estimated as: 100 − protein − fat − fiber − moisture − ~7% ash.
                      </Text>
                    </>
                  ) : null}
                </View>
              )}

              {/* The carbohydrate evidence. Shown when a food leans carb-heavy, because
                  that's when an owner is being told "dogs need energy from grains" by
                  someone selling the bag. */}
              {highCarbs.length >= 2 && (
                <AccordionSection
                  title="🌾 Do dogs actually need carbs?"
                  askLabel="Evidence"
                  onAskAI={() =>
                    askAboutSection(
                      `This food contains ${highCarbs.join(", ")}. Do dogs actually need carbohydrates, what does the research say, and does it matter for my dog specifically?`,
                    )
                  }
                >
                  <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginBottom: 6 }}>
                    No — and there is no dietary requirement for them.
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>
                    Neither AAFCO nor the NRC sets a carbohydrate minimum for dogs, because dogs make
                    the glucose they need from protein and fat. This is one of the few places where
                    holistic practice and formal nutrition science agree outright.
                  </Text>

                  <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 7 }}>
                    <Text style={{ color: t.good, fontWeight: "700", fontSize: 12.5 }}>
                      Kronfeld et al., 1977 · Am J Clin Nutr
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      18 racing sled dogs, 28 weeks of training, three diets: zero carbohydrate
                      (39% protein / 61% fat), 23% carb, and 38% carb. The zero-carbohydrate group
                      showed <Text style={{ fontWeight: "700" }}>better endurance and less exertional
                      muscle damage</Text> — not merely equal results.
                    </Text>
                  </View>

                  <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 7 }}>
                    <Text style={{ color: t.good, fontWeight: "700", fontSize: 12.5 }}>
                      Gal et al., 2021 · PLOS ONE
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      22 farm working dogs, randomised. The ultra-low-carbohydrate group showed
                      <Text style={{ fontWeight: "700" }}> significantly higher activity</Text> and
                      better insulin sensitivity — the opposite of what the researchers expected.
                    </Text>
                  </View>

                  <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                    <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                      The honest limits
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      Both studies are small (18 and 22 dogs) and both used working athletes rather
                      than pet dogs. They establish firmly that dogs don&apos;t <Text style={{ fontStyle: "italic" }}>need</Text> carbohydrate
                      and can do well without it. They don&apos;t establish that carbohydrate is harmful,
                      or that every dog should eat none.
                    </Text>
                  </View>

                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 9, lineHeight: 16 }}>
                    Why it&apos;s in the bag anyway: extrusion physically needs starch to form kibble,
                    it&apos;s the cheapest calorie available, and grain raises the protein figure on the
                    label without meat.
                  </Text>
                </AccordionSection>
              )}

              {/* Organ profiles. Only shows the organs actually in this food, so it
                  reads as information about the bag rather than a textbook. */}
              {(() => {
                const low = ingredients.map((i) => i.toLowerCase());
                const found = ORGAN_PROFILES.filter((o) => low.some((ing) => ing.includes(o.term)));
                if (found.length === 0) return null;
                return (
                  <AccordionSection
                    title={`🫀 Organs in this food (${found.length})`}
                    askLabel="Ask AI"
                    onAskAI={() =>
                      askAboutSection(
                        `This food contains ${found.map((o) => o.label).join(", ")}. What is each one giving my dog, is the amount right, and is there an organ he'd benefit from that isn't in here?`,
                      )
                    }
                  >
                    <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                      &quot;Organ meat is good&quot; doesn&apos;t tell you much. Here&apos;s what each
                      one in this food actually carries — and why liver has a ceiling while heart
                      doesn&apos;t.
                    </Text>
                    {found.map((o, i) => (
                      <View
                        key={i}
                        style={{
                          backgroundColor: t.surface,
                          borderRadius: 9,
                          padding: 11,
                          marginBottom: 6,
                          borderLeftWidth: 3,
                          borderLeftColor: o.limit ? t.moderate : t.good,
                        }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700" }}>
                            {o.label}
                          </Text>
                          <Text style={{ color: t.good, fontSize: 11, fontWeight: "700" }}>
                            {o.headline}
                          </Text>
                        </View>
                        <Text style={{ color: t.text, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                          <Text style={{ fontWeight: "700" }}>Carries: </Text>{o.carries}
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                          {o.note}
                        </Text>
                        {o.limit && (
                          <Text style={{ color: t.moderateDeep, fontSize: 11.5, marginTop: 5, lineHeight: 16, fontWeight: "600" }}>
                            ⚠ {o.limit}
                          </Text>
                        )}
                      </View>
                    ))}
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                      The usual raw-feeding target is about 10% organ, with liver no more than half
                      of that. Heart and gizzard are muscle rather than secreting organs, so they
                      don&apos;t count toward it.
                    </Text>
                  </AccordionSection>
                );
              })()}

              {/* Named vs generic meals. The distinction owners are most often given
                  backwards: "meal = bad" is wrong, "unnamed = bad" is right. */}
              {(() => {
                const low = ingredients.map((i) => i.toLowerCase());
                const generic = ingredients.filter((_, i) =>
                  GENERIC_MEALS.some((g) => low[i].includes(g)),
                );
                const named = ingredients.filter((_, i) =>
                  NAMED_MEALS.some((n) => low[i].includes(n)),
                );
                if (generic.length === 0 && named.length === 0) return null;
                return (
                  <AccordionSection
                    title="🏷️ Named vs unnamed meals"
                    defaultOpen={generic.length > 0}
                    askLabel="Ask AI"
                    onAskAI={() =>
                      askAboutSection(
                        `This food contains ${generic.length ? `unnamed meals (${generic.join(", ")})` : ""}${generic.length && named.length ? " and " : ""}${named.length ? `named meals (${named.join(", ")})` : ""}. What does that mean for quality and for my dog if he has any food sensitivities?`,
                      )
                    }
                  >
                    <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                      &quot;Meal&quot; isn&apos;t the problem — <Text style={{ fontWeight: "700" }}>unnamed</Text> is.
                      A meal is rendered protein with the water removed, so it&apos;s concentrated
                      rather than inferior. What matters is whether the label tells you which animal.
                    </Text>

                    {generic.length > 0 && (
                      <View style={{ backgroundColor: t.highTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                        <Text style={{ color: t.highDeep, fontWeight: "700", fontSize: 13 }}>
                          ⚠ Unnamed: {generic.join(", ")}
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                          &quot;Meat meal&quot; or &quot;poultry meal&quot; can be any mammal or any bird,
                          and the species can change between batches depending on what&apos;s cheapest.
                          Two consequences: you can&apos;t judge the quality, and{" "}
                          <Text style={{ fontWeight: "700" }}>a dog with a food allergy cannot avoid
                          the trigger</Text> — you have no way to know whether this batch contains
                          the protein that sets him off.
                        </Text>
                      </View>
                    )}

                    {named.length > 0 && (
                      <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                        <Text style={{ color: t.good, fontWeight: "700", fontSize: 13 }}>
                          ✓ Named: {named.join(", ")}
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                          The species is declared, so you can judge it and avoid it if needed. A named
                          meal like chicken meal is a legitimately good ingredient — roughly 300% the
                          protein density of fresh chicken, because the water is already gone.
                        </Text>
                      </View>
                    )}

                    <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16 }}>
                      Rule of thumb: if a manufacturer is confident in the source, they name it.
                      Anonymity on a label is a choice, not an oversight.
                    </Text>
                  </AccordionSection>
                );
              })()}

              {/* Protein profile — allergen risk tracks exposure, not badness. */}
              {(() => {
                const proteins = findProteins(ingredients);
                if (proteins.length === 0) return null;
                const colourFor = (r: string) =>
                  r === "low" ? t.good : r === "medium-low" ? t.goodDeep : r === "medium" ? t.moderate : r === "medium-high" ? t.high : t.critical;
                return (
                  <AccordionSection
                    title="🥩 Protein profile"
                    askLabel="Ask AI"
                    onAskAI={() =>
                      askAboutSection(
                        `This food's main proteins are ${proteins.map((pr) => pr.label).join(", ")}. Given my dog, is that a good choice — and if he has any itching, ear infections or sensitivity, which of these would you suspect first?`,
                      )
                    }
                  >
                    <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                      Allergen risk reflects how <Text style={{ fontStyle: "italic" }}>common</Text> a
                      protein is, not how good it is. Chicken tops the list because it&apos;s in almost
                      everything — novel proteins rank low precisely because most dogs have never
                      eaten them.
                    </Text>
                    {proteins.map((pr, i) => (
                      <View
                        key={i}
                        style={{
                          backgroundColor: t.surface,
                          borderRadius: 9,
                          padding: 11,
                          marginBottom: 6,
                          borderLeftWidth: 3,
                          borderLeftColor: colourFor(pr.risk),
                        }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", flex: 1 }}>
                            {pr.label}
                          </Text>
                          <Text style={{ color: colourFor(pr.risk), fontSize: 10.5, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 }}>
                            {pr.risk.replace("-", " ")} allergen risk
                          </Text>
                        </View>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 2 }}>
                          Digestibility: {pr.digestibility}
                        </Text>
                        <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                          {pr.note}
                        </Text>
                      </View>
                    ))}
                  </AccordionSection>
                );
              })()}

              {/* Ingredient splitting — the other way the ordering rule gets worked around. */}
              {(() => {
                const splits = findSplitIngredients(ingredients);
                if (splits.length === 0) return null;
                const anyTop = splits.some((sp) => sp.topHalf);
                return (
                  <View
                    style={{
                      backgroundColor: anyTop ? t.highTint : t.surface,
                      borderRadius: 12,
                      padding: 13,
                      marginHorizontal: 16,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: anyTop ? t.high : t.moderate,
                    }}
                  >
                    <Text style={{ color: anyTop ? t.highDeep : t.textStrong, fontWeight: "800", fontSize: 13.5 }}>
                      ✂️ Split ingredients — the same thing, listed several times
                    </Text>
                    {splits.map((sp, i) => (
                      <Text key={i} style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                        <Text style={{ fontWeight: "700" }}>{sp.label}</Text> appears as{" "}
                        {sp.forms.length} separate ingredients: {sp.forms.join(", ")}.
                      </Text>
                    ))}
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                      {anyTop
                        ? "Because labels are ordered by weight, splitting one ingredient into several pushes each fragment lower and keeps the combined weight out of the top slots. Added together, these may outweigh ingredients listed above them — which can make a food look more meat-first than it is."
                        : "Split forms appear here, but low enough on the list that the combined weight is unlikely to change the picture much."}
                    </Text>
                  </View>
                );
              })()}

              {/* Sulfite preservatives. Its own callout because the mechanism is
                  specific and serious: the preservative destroys the very nutrient
                  the label promises. Fires whenever a sulfite is detected. */}
              {(() => {
                const sulfites = ingredients.filter((i) =>
                  /metabisulfite|metabisulphite|sodium sulfite|sulphite|sulfur dioxide/i.test(i),
                );
                if (sulfites.length === 0) return null;
                return (
                  <View
                    style={{
                      backgroundColor: t.criticalTint,
                      borderRadius: 12,
                      padding: 13,
                      marginHorizontal: 16,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: t.critical,
                    }}
                  >
                    <Text style={{ color: t.critical, fontWeight: "800", fontSize: 13.5 }}>
                      ⚠️ Sulfite preservative — destroys vitamin B1
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                      This food contains <Text style={{ fontWeight: "700" }}>{sulfites.join(", ")}</Text>.
                      Sulfite preservatives destroy thiamine (vitamin B1) — and thiamine deficiency
                      in dogs is documented, sometimes fatal, and has been traced specifically to
                      eating sulphite-preserved meat.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                      The signs are neurological: appetite loss and wobbliness first, then head tilt
                      and disorientation, progressing to seizures and paralysis.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                      <Text style={{ fontWeight: "700" }}>The FDA&apos;s position</Text> is that sulfite
                      preservatives should not be added to foods — and specifically not to pet foods
                      marketed as complete and balanced, or listing thiamine as an ingredient,
                      because the preservative destroys the very nutrient the label promises.
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                      Most often found in fresh meat rolls, minces and bully sticks, where it&apos;s
                      used to control colour and odour. Thiamine is already the most heat-fragile
                      nutrient in the bowl — see the heat section — so a food that both cooks it and
                      preserves it with sulfites is losing B1 twice over.
                    </Text>
                  </View>
                );
              })()}

              {/* The salt divider. Only shown when there's something worth saying —
                  a food with nothing marketing-ish below the line gets no panel. */}
              {(() => {
                const salt = analyseSaltDivider(ingredients);
                if (!salt || salt.marketing.length === 0) return null;
                return (
                  <View
                    style={{
                      backgroundColor: t.moderateTint,
                      borderRadius: 12,
                      padding: 13,
                      marginHorizontal: 16,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: t.moderate,
                    }}
                  >
                    <Text style={{ color: t.moderateDeep, fontWeight: "800", fontSize: 13.5 }}>
                      🧂 Below the salt line — a sprinkle, not a serving
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                      Salt is ingredient #{salt.saltIndex + 1} and is usually included at about 1%.
                      Everything after it is present at roughly that much or less. These are listed
                      below it:
                    </Text>
                    <Text style={{ color: t.moderateDeep, fontSize: 13, fontWeight: "700", marginTop: 6, lineHeight: 19 }}>
                      {salt.marketing.join(" · ")}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                      These are the ingredients that sell the bag. At trace amounts they contribute
                      far less than their placement on the front of the packet suggests.
                      {salt.legitimate.length > 0
                        ? " Not everything below salt is a problem, though — the vitamins, minerals and preservatives down there are dosed in fractions of a percent by design, exactly as they should be."
                        : ""}
                    </Text>
                  </View>
                );
              })()}

              {/* Gut health, both halves. The pairing is the point: probiotics add
                  bacteria, prebiotics feed the ones already there, and almost no
                  other scanner makes that distinction. */}
              {(probioticsFound.length > 0 || prebioticsFound.length > 0) && (
                <View
                  style={{
                    backgroundColor: t.surface,
                    borderRadius: 12,
                    padding: 13,
                    marginHorizontal: 16,
                    marginBottom: 12,
                    borderLeftWidth: 4,
                    borderLeftColor:
                      probioticsFound.length > 0 && prebioticsFound.length > 0 ? t.good : t.moderate,
                  }}
                >
                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13.5 }}>
                    🦠 Gut support:{" "}
                    {probioticsFound.length > 0 && prebioticsFound.length > 0
                      ? "both halves present"
                      : probioticsFound.length > 0
                        ? "probiotics, but nothing feeding them"
                        : "prebiotic fibre, no live cultures"}
                  </Text>
                  {probioticsFound.length > 0 && (
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                      <Text style={{ fontWeight: "700", color: t.good }}>Probiotics</Text> — {probioticsFound.join(", ")}. These add
                      bacteria to the gut.
                    </Text>
                  )}
                  {prebioticsFound.length > 0 && (
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                      <Text style={{ fontWeight: "700", color: t.good }}>Prebiotic fibre</Text> — {prebioticsFound.join(", ")}. This feeds
                      the bacteria already living there.
                    </Text>
                  )}
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 6, lineHeight: 16 }}>
                    {probioticsFound.length > 0 && prebioticsFound.length > 0
                      ? "The pairing is what matters — probiotics without fibre to feed them do far less."
                      : probioticsFound.length > 0
                        ? "Probiotics work better with fermentable fibre alongside them. Pumpkin, dandelion greens or chicory root would round this out."
                        : "Prebiotic fibre still helps on its own — it feeds the population already in the gut rather than trying to establish a new one."}
                  </Text>
                </View>
              )}

              {/* Breed-specific copper warning. Only fires when BOTH are true: this dog
                  is a copper-sensitive breed AND the food contains inorganic copper.
                  Shown as a warning, never a score change — see COPPER_SENSITIVE_BREEDS. */}
              {(() => {
                if (!dogProfileBreed) return null;
                const breedLower = dogProfileBreed.toLowerCase();
                const sensitive = COPPER_SENSITIVE_BREEDS.some((b) => breedLower.includes(b.trim()));
                if (!sensitive) return null;
                const copper = ingredients.filter((i) => i.toLowerCase().includes("copper"));
                if (copper.length === 0) return null;
                const inorganic = copper.some((c) => /sulfate|sulphate|oxide|carbonate/i.test(c));
                return (
                  <View
                    style={{
                      backgroundColor: inorganic ? t.criticalTint : t.moderateTint,
                      borderRadius: 12,
                      padding: 13,
                      marginHorizontal: 16,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: inorganic ? t.critical : t.moderate,
                    }}
                  >
                    <Text style={{ color: inorganic ? t.critical : t.moderateDeep, fontWeight: "800", fontSize: 13.5 }}>
                      ⚠️ Copper — specific to {dogProfileName ?? "your dog"}
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                      {dogProfileName ?? "Your dog"} is a {dogProfileBreed}, one of the breeds
                      that can&apos;t clear copper normally. This food contains{" "}
                      <Text style={{ fontWeight: "700" }}>{copper.join(", ")}</Text>.
                      {inorganic
                        ? " That's the inorganic form, which bypasses the liver's regulation and accumulates over years of daily feeding until damage is already advanced. Copper proteinate is the safer form to look for."
                        : " That looks like a chelated form, which the body regulates far better than copper sulfate — the preferable choice for this breed."}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 6, fontStyle: "italic" }}>
                      This warning is personal to {dogProfileName ?? "your dog"} — the food&apos;s
                      score is unchanged, because the risk depends on who&apos;s eating it.
                    </Text>
                  </View>
                );
              })()}

              {/* Where the omega-3 actually comes from. Only shown when there IS
                  omega-3 to talk about — an empty "no omega sources" panel is noise. */}
              {(() => {
                const low = ingredients.map((i) => i.toLowerCase());
                const marine = ingredients.filter((_, idx) =>
                  OMEGA3_MARINE.some((m) => low[idx].includes(m)),
                );
                const plant = ingredients.filter((_, idx) =>
                  OMEGA3_PLANT.some((pl) => low[idx].includes(pl)),
                );
                if (marine.length === 0 && plant.length === 0) return null;
                const plantOnly = marine.length === 0 && plant.length > 0;
                return (
                  <AccordionSection
                    title="🐟 Where the omega-3 comes from"
                    defaultOpen={plantOnly}
                    askLabel="Ask AI"
                    onAskAI={() =>
                      askAboutSection(
                        `This food's omega-3 comes from ${marine.length ? `marine sources (${marine.join(", ")})` : "no marine sources"}${plant.length ? ` and plant sources (${plant.join(", ")})` : ""}. What does that mean for how much usable EPA and DHA my dog actually gets, and should I be adding fish oil or sardines?`,
                      )
                    }
                  >
                    <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                      Omega-3 isn&apos;t one thing. A great-looking ratio built on flaxseed
                      delivers far less usable omega-3 than the number suggests.
                    </Text>

                    {marine.length > 0 && (
                      <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                        <Text style={{ color: t.good, fontWeight: "700", fontSize: 13 }}>
                          ✓ Marine sources — EPA &amp; DHA, ready to use
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                          {marine.join(", ")} — these supply the forms a dog&apos;s body uses
                          directly, with no conversion needed. This is the omega-3 that does
                          the anti-inflammatory work.
                        </Text>
                      </View>
                    )}

                    {plant.length > 0 && (
                      <View style={{ backgroundColor: t.moderateTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                        <Text style={{ color: t.moderateDeep, fontWeight: "700", fontSize: 13 }}>
                          ⚠ Plant sources — ALA, poorly converted
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                          {plant.join(", ")} — these supply ALA, which a dog has to convert
                          into EPA and DHA. Dogs convert it poorly, commonly cited at well
                          under 10%, and conversion to DHA is lower still. It still counts
                          toward the advertised ratio, which is why the ratio alone can
                          flatter a food.
                        </Text>
                      </View>
                    )}

                    {/* The clinical trial behind the ratio target. Owners are told
                        "good omega ratio" constantly; almost nobody is shown the study. */}
                    <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.good, fontWeight: "700", fontSize: 12.5 }}>
                        Roush et al., 2010 · JAVMA 236(1):59–66
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                        A randomised, double-blinded, controlled trial across 18 clinics: 127 dogs
                        with osteoarthritis fed for six months on a food with{" "}
                        <Text style={{ fontWeight: "700" }}>31× more omega-3 and a 34× lower
                        omega-6:3 ratio</Text>. Blood work confirmed it worked — higher serum omega-3
                        and lower arachidonic acid at every timepoint. Owners reported better ability
                        to rise and play by 6 weeks, and better walking by 12 and 24 weeks.
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 5, lineHeight: 16, fontStyle: "italic" }}>
                        Reviews of this literature put the anti-inflammatory range from about 5.5:1
                        down to roughly 1:3.75 — meaning ratios well below the usual 5:1 target, and
                        even inverted ones with more omega-3 than omega-6, still show benefit.
                      </Text>
                    </View>

                    {/* The other side of the ratio. Owners hear "omega-6 bad" constantly
                        and are rarely told it's an essential nutrient they can't skip. */}
                    <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5 }}>
                        And where omega-6 comes from
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                        Omega-6 (linoleic acid) is <Text style={{ fontWeight: "700" }}>essential</Text> —
                        dogs can&apos;t make it, and AAFCO sets a minimum of 1.1% for adult
                        maintenance. Deficiency causes poor coat, skin problems, slow wound healing
                        and weakened immunity. In practice it&apos;s almost never seen, because
                        omega-6 is in every animal fat. The ratio matters because omega-6 is
                        abundant and omega-3 is scarce — not because omega-6 is bad.
                      </Text>
                      {OMEGA6_FOOD_SOURCES.map((o, i) => (
                        <View key={i} style={{ flexDirection: "row", marginTop: 7, gap: 8 }}>
                          <View
                            style={{
                              width: 4,
                              borderRadius: 2,
                              backgroundColor:
                                o.level === "very high" ? t.high : o.level === "high" ? t.moderate : t.good,
                            }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: t.text, fontSize: 12, fontWeight: "700" }}>
                              {o.source}
                            </Text>
                            <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 1, lineHeight: 16 }}>
                              {o.note}
                            </Text>
                          </View>
                        </View>
                      ))}
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 8, lineHeight: 16, fontStyle: "italic" }}>
                        Practical upshot: if your dog eats meat, he has enough omega-6. The lever
                        worth pulling is adding marine omega-3, not cutting omega-6.
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: t.surface,
                        borderRadius: 9,
                        padding: 11,
                        borderLeftWidth: 3,
                        borderLeftColor: plantOnly ? t.high : t.good,
                      }}
                    >
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                        {plantOnly
                          ? "Worth adding a marine source"
                          : plant.length > 0
                            ? "Covered, but the ratio overstates it"
                            : "Well covered"}
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                        {plantOnly
                          ? "Every omega-3 here is the plant form. Sardines or a fish oil would add the EPA and DHA this food is relying on your dog to manufacture."
                          : plant.length > 0
                            ? "There are real marine sources here, so the usable omega-3 is present. Just don't read the headline ratio as all being the good kind — part of it is plant ALA."
                            : "The omega-3 here comes from marine sources, so it's already in the form your dog can use."}
                      </Text>
                    </View>
                  </AccordionSection>
                );
              })()}

              {ingredients.length > 0 && (
                <AccordionSection
                  title="🔥 What heat does to nutrients"
                  askLabel="Ask AI"
                  onAskAI={() =>
                    askAboutSection(
                      `This food is ${processing?.method ?? "processed"}. Which nutrients does that processing actually degrade, how much, and does it matter for my dog in practice?`,
                    )
                  }
                >
                  <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                    Why processing method affects the score. Ranges are wide because
                    retention depends on temperature, time and moisture — a single
                    number would be false precision.
                  </Text>
                  {NUTRIENT_HEAT_LOSS.map((n, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: t.surface,
                        borderRadius: 9,
                        padding: 10,
                        marginBottom: 6,
                        borderLeftWidth: 3,
                        borderLeftColor: n.fragile ? t.high : t.good,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700", flex: 1 }}>
                          {n.nutrient}
                        </Text>
                        <Text style={{ color: n.fragile ? t.high : t.good, fontSize: 11, fontWeight: "700" }}>
                          {n.retention}
                        </Text>
                      </View>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                        {n.note}
                      </Text>
                    </View>
                  ))}
                </AccordionSection>
              )}

              {ingredients.length > 0 && (
                <AccordionSection
                  title="Ingredient Breakdown"
                  defaultOpen
                  askLabel="Ask AI"
                  onAskAI={() =>
                    askAboutSection(
                      `Looking at the full ingredient list for ${productName}, which ingredients matter most for my dog specifically — good or bad — and why? Skip the ones that don't matter much.`,
                    )
                  }
                >
                  {/* The single most useful thing an owner can know about a label, and
                      almost nobody is told it. Everything downstream — the salt divider,
                      ingredient splitting, "it has blueberries!" — depends on it. */}
                  <View
                    style={{
                      backgroundColor: t.surface,
                      borderRadius: 10,
                      padding: 11,
                      marginBottom: 10,
                      borderLeftWidth: 3,
                      borderLeftColor: t.info,
                    }}
                  >
                    <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                      Order matters: heaviest first
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      Pet food labels are required to list ingredients by weight, heaviest
                      to lightest. The first few make up most of the food. Anything near the
                      end is present in a small amount — so a superfood listed last is a
                      sprinkle, not a serving.
                    </Text>
                  </View>
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
                          ? t.goodDeep
                          : isMeal || isLegume
                            ? t.high
                            : t.textMuted; // neutral pill fill — dark enough for onAccent (white) text to read (5.5:1)
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
                </AccordionSection>
              )}

              {flagged.length > 0 && (
                <AccordionSection
                  title={`Biggest Concerns (${flagged.length})`}
                  titleColor={t.critical}
                  askLabel="Evidence"
                  onAskAI={() =>
                    askAboutSection(
                      `For each of these flagged ingredients in ${productName} (${flagged.map((f) => f.name).join(", ")}), tell me how strong the evidence actually is. Name real studies or regulatory findings where they exist, and say plainly when a concern is mechanistic or traditional rather than proven. Don't overstate it.`,
                    )
                  }
                >
                  <Text style={[styles.omegaNote, { marginBottom: 12 }]}>Tap a concern to see why it matters.</Text>
                  {/* Apple grouped-card row: a coloured icon badge carries the
                      severity at a glance (matching the approved prototype),
                      the tag pill on the right names the tier in words too —
                      colour is never the only signal. */}
                  {flagged.map((f, i, arr) => {
                    const open = !!expandedRedFlags[f.name];
                    const sev = SEVERITY_COLORS[f.severity] || t.critical;
                    return (
                      <View key={i}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedRedFlags((prev) => ({ ...prev, [f.name]: !prev[f.name] }));
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 12,
                            borderBottomWidth: i === arr.length - 1 && !open ? 0 : 1,
                            borderBottomColor: t.border,
                          }}
                        >
                          <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: sev, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                            <Text style={{ color: t.onAccent, fontSize: 15, fontWeight: "800" }}>!</Text>
                          </View>
                          <Text style={{ color: t.textStrong, fontSize: 15, fontWeight: "500", flex: 1, letterSpacing: -0.1 }}>{f.name}</Text>
                          <View style={{ backgroundColor: sev + "1F", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, marginRight: 8 }}>
                            <Text style={{ color: sev, fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 }}>
                              {f.severity}
                            </Text>
                          </View>
                          <Text style={{ color: t.textFaint, fontSize: 16, fontWeight: "600" }}>{open ? "⌄" : "›"}</Text>
                        </TouchableOpacity>
                        {open && (
                          <Text
                            style={{
                              color: t.textMuted,
                              fontSize: 13,
                              lineHeight: 20,
                              paddingBottom: 14,
                              paddingLeft: 42,
                              borderBottomWidth: i === arr.length - 1 ? 0 : 1,
                              borderBottomColor: t.border,
                            }}
                          >
                            {f.reason}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </AccordionSection>
              )}

              {/* DCM heart-risk pattern — its own indigo, its own card, never folded
                  into general "concerns". Presentation-only classification (see
                  getDCMPattern above); does not touch the score. */}
              {ingredients.length > 0 && (() => {
                const dcmResult = getDCMPattern(ingredients);
                return (
                  <View
                    style={{
                      backgroundColor: dcmResult.triggered ? t.dcmTint : t.surface,
                      borderRadius: 18,
                      marginHorizontal: 16,
                      marginBottom: 14,
                      padding: 18,
                      borderWidth: 1,
                      borderColor: dcmResult.triggered ? t.dcmDeep + "40" : t.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                      <Text style={{ fontSize: 16, marginRight: 8, color: dcmResult.triggered ? t.dcm : t.good }}>♥</Text>
                      <Text style={{ fontSize: 11, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase", color: dcmResult.triggered ? t.dcm : t.textDim }}>
                        Heart-Health · DCM Pattern
                      </Text>
                    </View>

                    <View
                      style={{
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 13,
                        paddingVertical: 7,
                        borderRadius: 9,
                        marginBottom: 12,
                        backgroundColor: dcmResult.triggered ? t.dcm : t.goodTint,
                      }}
                    >
                      <Text style={{ color: dcmResult.triggered ? t.onAccent : t.good, fontSize: 12, fontWeight: "800" }}>
                        {dcmResult.triggered ? `⬤ Pattern detected · ${dcmResult.tier} tier` : "✓ Pattern not detected"}
                      </Text>
                    </View>

                    {dcmResult.triggered ? (
                      <>
                        <Text style={{ fontSize: 13, lineHeight: 20, color: t.text, marginBottom: 12 }}>
                          This food is <Text style={{ fontWeight: "700" }}>grain-free</Text> and lists{" "}
                          <Text style={{ fontWeight: "700" }}>peas, legumes, or potatoes prominently</Text> — the pattern the
                          FDA has been investigating in relation to canine{" "}
                          <Text style={{ fontWeight: "700" }}>DCM (dilated cardiomyopathy)</Text>, a disease where the heart
                          muscle thins and struggles to pump, in dogs without a genetic predisposition to it.
                        </Text>
                        <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 12, padding: 12, marginBottom: 12, gap: 7 }}>
                          {dcmResult.grainFree && (
                            <Text style={{ fontSize: 12, color: t.textMuted, lineHeight: 17 }}>
                              <Text style={{ color: t.dcm, fontWeight: "800" }}>✓ </Text>No grain anywhere in the top 10 ingredients.
                            </Text>
                          )}
                          {dcmResult.legumeOrPotatoTop5 && (
                            <Text style={{ fontSize: 12, color: t.textMuted, lineHeight: 17 }}>
                              <Text style={{ color: t.dcm, fontWeight: "800" }}>✓ </Text>A legume or potato appears in the top 5 ingredients.
                            </Text>
                          )}
                          {dcmResult.fractionated && (
                            <Text style={{ fontSize: 12, color: t.textMuted, lineHeight: 17 }}>
                              <Text style={{ color: t.dcm, fontWeight: "800" }}>Σ </Text>Legumes split into {dcmResult.fractionCount} separate entries in the top 10 — summed, they behave like one much larger ingredient.
                            </Text>
                          )}
                          {dcmResult.exotic && (
                            <Text style={{ fontSize: 12, color: t.textMuted, lineHeight: 17 }}>
                              <Text style={{ color: t.dcm, fontWeight: "800" }}>! </Text>Built on an exotic protein — matches the FDA's most-investigated profile.
                            </Text>
                          )}
                        </View>
                        <Text style={{ fontSize: 11.5, color: t.textDim, lineHeight: 17, marginBottom: 12 }}>
                          This is a correlational pattern still under investigation — not a confirmed cause. Plenty of dogs eat these foods without ever developing DCM. It's a reason to talk to your vet, not a reason to panic.
                        </Text>
                      </>
                    ) : (
                      <Text style={{ fontSize: 13, lineHeight: 20, color: t.text, marginBottom: 4 }}>
                        {dcmResult.grainFree
                          ? "This food is grain-free, but its top ingredients don't match the legume- or potato-heavy pattern under FDA investigation."
                          : "This food contains grain, so it falls outside the grain-free pattern the FDA has been investigating — even if peas appear further down the list, that isn't the flagged profile."}
                      </Text>
                    )}

                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          "https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy"
                        )
                      }
                    >
                      <Text style={{ color: t.dcm, fontSize: 12, fontWeight: "700", marginTop: dcmResult.triggered ? 0 : 8 }}>
                        Read the FDA investigation →
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })()}

              {score !== null && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Make it better</Text>
                  {/* Icon-row cards, matching the approved prototype — each addition
                      reads as a distinct, doable action rather than a run-on list. */}
                  {[
                    { icon: "🥚", label: "An egg in the morning" },
                    { icon: "🐟", label: "Sardines or fish oil" },
                    { icon: "🥛", label: "Plain yogurt, kefir, or goat's milk for probiotics" },
                  ].map((item, i, arr) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 11,
                        borderBottomWidth: i === arr.length - 1 ? 0 : 1,
                        borderBottomColor: t.border,
                      }}
                    >
                      <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: t.goodTint, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                      </View>
                      <Text style={{ color: t.textStrong, fontSize: 15, fontWeight: "500", flex: 1, letterSpacing: -0.1 }}>{item.label}</Text>
                    </View>
                  ))}
                  <Text style={[styles.sectionNote, { marginTop: 12 }]}>
                    All optional — small upgrades, not corrections.
                  </Text>
                </View>
              )}

              {score !== null && (
                <AccordionSection title="🐾 Hershey's Protocol" bare>
                  <HersheyProtocolSection />
                </AccordionSection>
              )}

              {scoreBreakdown.length > 0 && (
                <AccordionSection
                    title="💊 Recommended Supplements"
                    askLabel="For my dog"
                    onAskAI={() =>
                      askAboutSection(
                        `Out of these supplement options, which would actually be worth it for my dog given this food and his situation — and which would be a waste of money? Say what the evidence supports for each one you recommend.`,
                      )
                    }
                  >
                  {/* Accent moved to a left rule + heading rather than a saturated
                      card fill — seven full-colour tinted cards in a row was visually
                      loud and made the copy harder to read. */}
                  {SUPPLEMENT_RECS.map((s, i) => (
                    <View key={i} style={{ marginBottom: 12, backgroundColor: s.bg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: s.borderColor, borderLeftWidth: 3, borderLeftColor: s.color }}>
                      <Text style={{ color: s.color, fontWeight: '700', fontSize: 15, marginBottom: 6, letterSpacing: -0.2 }}>{s.emoji} {s.name}</Text>
                      <Text style={{ color: t.text, fontSize: 13, lineHeight: 20, marginBottom: 8 }}>{s.body}</Text>
                      <Text style={{ color: t.textDim, fontSize: 12, lineHeight: 17, marginBottom: 12 }}>{s.note}</Text>
                      <TouchableOpacity style={{ backgroundColor: s.color, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start' }} onPress={() => Linking.openURL(s.link)}>
                        <Text style={{ color: t.onAccent, fontWeight: '800', fontSize: 12.5 }}>{s.linkText}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </AccordionSection>
              )}

              {score !== null && (
                <AccordionSection title="🛒 Grocery Store Finds">
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
                            color: t.textMuted,
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
                                backgroundColor: t.surface,
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
                                    color: t.textStrong,
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
                                  color: t.text,
                                  fontSize: 12,
                                  lineHeight: 17,
                                  marginBottom: 4,
                                }}
                              >
                                {g.benefit}
                              </Text>
                              <Text style={{ color: t.textMuted, fontSize: 11 }}>
                                📍 {g.where}
                              </Text>
                            </View>
                          ),
                        )}
                      </View>
                    ));
                  })()}
                </AccordionSection>
              )}

              {score !== null && (
                <AccordionSection title="🧬 Lipoma Prevention" bare>
                  <LipomaSection />
                </AccordionSection>
              )}

              {scoreBreakdown.length > 0 && (
                <AccordionSection title="🌿 Protein Energetics (TCVM)">
                  <Text style={[styles.sectionBody, { marginBottom: 10 }]}>
                    Traditional Chinese Veterinary Medicine classifies proteins by their energetic properties. Matching protein to your dog's constitution and season reduces inflammation, hot spots, and digestive upset.
                  </Text>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: t.info, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>❄️ Cooling Proteins</Text>
                    <Text style={{ color: t.infoSoft, fontSize: 13, lineHeight: 19 }}>Duck · Rabbit · Cod · Flounder · Whitefish · Turkey · Clams · Pork</Text>
                    <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Best for: hot dogs, skin issues, allergies, hot spots, summer heat, panting</Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: t.textMuted, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>⚖️ Neutral Proteins</Text>
                    <Text style={{ color: t.text, fontSize: 13, lineHeight: 19 }}>Beef · Salmon · Eggs · Sardines · Herring · Quail · Pork</Text>
                    <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Good for most dogs year-round</Text>
                  </View>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: t.critical, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>🔥 Warming Proteins</Text>
                    <Text style={{ color: t.critical, fontSize: 13, lineHeight: 19 }}>Chicken · Lamb · Venison · Goat · Trout · Shrimp · Pheasant · Anchovies</Text>
                    <Text style={{ color: t.textDim, fontSize: 11, marginTop: 3 }}>Best for: cold or lethargic dogs, winter months, poor circulation</Text>
                  </View>
                  <View style={{ backgroundColor: t.dcmTint, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.dcmDeep }}>
                    <Text style={{ color: t.info, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>☀️ Summer Recommendation</Text>
                    <Text style={{ color: t.infoSoft, fontSize: 13, lineHeight: 19 }}>Switch to cooling or neutral proteins in warm months — duck, rabbit, or white fish are ideal. Avoid chicken and lamb if your dog pants excessively, has seasonal allergies, or hot spots.</Text>
                  </View>
                  <TouchableOpacity onPress={() => Linking.openURL('https://drjudymorgan.com')}>
                    <Text style={{ color: t.good, fontSize: 13, fontWeight: '600' }}>🌿 Learn more at Dr. Judy Morgan's site →</Text>
                  </TouchableOpacity>
                </AccordionSection>
              )}

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
                ? t.criticalDeep
                : impact === "moderate"
                  ? t.high
                  : impact === "mild"
                    ? t.high
                    : impact === "beneficial"
                      ? t.good
                      : t.textDim;
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
                    <ActivityIndicator size="small" color={t.good} />
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
                          { borderLeftWidth: 3, borderLeftColor: t.criticalDeep },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailSectionTitle,
                            { color: t.critical },
                          ]}
                        >
                          Linked Health Conditions
                        </Text>
                        <Text
                          style={[
                            styles.detailSectionBody,
                            { color: t.critical },
                          ]}
                        >
                          {ingredientDetailData.disease_links}
                        </Text>
                      </View>
                    )}

                    {/* What the claim is actually based on. Shown for every
                        ingredient — including when the honest answer is "no dog
                        trials, this is mechanistic" — so nothing reads as more
                        proven than it is. */}
                    {ingredientDetailData.evidence && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>
                          Evidence{" "}
                          {ingredientDetailData.evidence_strength && (
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "800",
                                color:
                                  ingredientDetailData.evidence_strength === "strong" ? t.good
                                  : ingredientDetailData.evidence_strength === "moderate" ? t.goodDeep
                                  : ingredientDetailData.evidence_strength === "emerging" ? t.high
                                  : t.textMuted,
                              }}
                            >
                              · {String(ingredientDetailData.evidence_strength).toUpperCase()}
                            </Text>
                          )}
                        </Text>
                        <Text style={styles.detailSectionBody}>
                          {ingredientDetailData.evidence}
                        </Text>
                        {ingredientDetailData.from_knowledge_base && (
                          <Text style={{ color: t.textDim, fontSize: 11, marginTop: 6 }}>
                            Sourced from the Common Sense Dog knowledge base
                          </Text>
                        )}
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
        visible={showFeedbackModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { setShowFeedbackModal(false); setFeedbackText(''); setFeedbackSubmitted(false); }}
      >
        <View style={{ flex: 1, backgroundColor: t.bg, padding: 24, paddingTop: 48 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ color: t.textStrong, fontSize: 20, fontWeight: '800' }}>Send Feedback</Text>
            <TouchableOpacity onPress={() => { setShowFeedbackModal(false); setFeedbackText(''); setFeedbackSubmitted(false); }} style={{ padding: 8 }}>
              <Text style={{ color: t.textDim, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
          {feedbackSubmitted ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: t.good, fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Thanks! 🐾</Text>
              <Text style={{ color: t.textMuted, textAlign: 'center', fontSize: 15, lineHeight: 22 }}>
                Your feedback helps make PawGrade better for every dog parent.
              </Text>
            </View>
          ) : (
            <>
              <Text style={{ color: t.textMuted, marginBottom: 16, fontSize: 14, lineHeight: 21 }}>
                What&apos;s not working? What would you like to see? We read every message.
              </Text>
              <TextInput
                style={{ backgroundColor: t.surface, color: t.textStrong, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 150, textAlignVertical: 'top', marginBottom: 16 }}
                placeholder="Type your feedback here..."
                placeholderTextColor={t.textFaint}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                autoFocus
              />
              <TouchableOpacity
                style={{ backgroundColor: feedbackText.trim() ? t.good : t.surface, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                disabled={!feedbackText.trim() || feedbackSubmitting}
                onPress={async () => {
                  setFeedbackSubmitting(true);
                  await submitFeedback(feedbackText.trim());
                  setFeedbackSubmitting(false);
                  setFeedbackSubmitted(true);
                  setFeedbackText('');
                }}
              >
                {feedbackSubmitting
                  ? <ActivityIndicator color={t.onAccent} />
                  : <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 16 }}>Submit</Text>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Head-to-head comparison of the saved food vs the one just scanned. */}
      <Modal
        visible={compareVisible}
        animationType="slide"
        onRequestClose={() => setCompareVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
          <View style={styles.coachHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachHeaderTitle}>Which is better?</Text>
              <Text style={styles.coachHeaderSub}>
                {dogProfileName ? `Judged for ${dogProfileName}` : "Sign in to judge it for your dog"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setCompareVisible(false)}
              accessibilityLabel="Close comparison"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: t.textMuted, fontSize: 22, fontWeight: "700" }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
            {compareFood && score !== null && (
              <>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {[
                    { label: compareFood.name, s: compareFood.score, fl: compareFood.flagged, pr: compareFood.processing },
                    { label: productName, s: score, fl: flagged.map((f) => f.name), pr: processing?.method ?? "Unknown" },
                  ].map((f, i) => {
                    const wins = f.s === Math.max(compareFood.score, score);
                    const tie = compareFood.score === score;
                    return (
                      <View
                        key={i}
                        style={{
                          flex: 1, backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 14,
                          borderWidth: wins && !tie ? 2 : 1,
                          borderColor: wins && !tie ? t.good : t.border,
                        }}
                      >
                        {wins && !tie && (
                          <Text style={{ color: t.good, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 4 }}>
                            HIGHER SCORE
                          </Text>
                        )}
                        <Text numberOfLines={2} style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", minHeight: 36 }}>
                          {f.label}
                        </Text>
                        <Text style={{ color: getScoreColor(f.s), fontSize: 34, fontWeight: "800", marginTop: 6 }}>
                          {f.s}
                        </Text>
                        <Text style={{ color: t.textDim, fontSize: 11 }}>out of 100</Text>
                        <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 8 }}>{f.pr}</Text>
                        <Text style={{ color: f.fl.length ? t.critical : t.good, fontSize: 12, marginTop: 6 }}>
                          {f.fl.length ? `${f.fl.length} flagged` : "No flags"}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {compareVerdict ? (
                  <View style={{ backgroundColor: t.goodTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: t.good }}>
                    <Text style={{ color: t.textStrong, fontSize: 15, lineHeight: 22 }}>{compareVerdict}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={runComparison}
                    disabled={compareLoading}
                    style={{
                      backgroundColor: t.good, borderRadius: 14, paddingVertical: 15,
                      alignItems: "center", opacity: compareLoading ? 0.5 : 1,
                    }}
                  >
                    {compareLoading
                      ? <ActivityIndicator color={t.onAccent} />
                      : (
                        <Text style={{ color: t.onAccent, fontSize: 15, fontWeight: "800" }}>
                          {dogProfileName ? `Which is better for ${dogProfileName}?` : "Which one should I pick?"}
                        </Text>
                      )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => { setCompareFood(null); setCompareVisible(false); setCompareVerdict(null); }}>
                  <Text style={{ color: t.textMuted, fontSize: 13, textAlign: "center", paddingVertical: 10 }}>
                    Clear comparison
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* AI Nutrition Coach — the chat itself. The state, handlers and styles for
          this existed but nothing ever rendered it, so the coach was unreachable. */}
      <Modal
        visible={coachVisible}
        animationType="slide"
        onRequestClose={() => setCoachVisible(false)}
      >
        <SafeAreaView style={styles.coachModal}>
          <View style={styles.coachHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachHeaderTitle}>AI Nutrition Coach</Text>
              <Text style={styles.coachHeaderSub}>
                {dogProfileName
                  ? `Answers tailored to ${dogProfileName}`
                  : "Sign in to get answers tailored to your dog"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setCoachVisible(false)}
              accessibilityLabel="Close coach"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: t.textMuted, fontSize: 22, fontWeight: "700" }}>✕</Text>
            </TouchableOpacity>
          </View>

          {!dogProfileName && (
            <TouchableOpacity
              onPress={() => { setCoachVisible(false); router.push("/login" as Href); }}
              style={{
                margin: 12, padding: 12, borderRadius: 12,
                backgroundColor: t.goodTint, borderWidth: 1, borderColor: t.good,
              }}
            >
              <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 14 }}>
                🐾 Add your dog&apos;s profile
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
                Save their diet, supplements and health issues once — every answer gets
                tailored to them.
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.coachMessages} contentContainerStyle={{ padding: 16, gap: 10 }}>
            {coachMessages.map((m, i) => (
              <View
                key={i}
                style={[styles.coachBubble, m.role === "user" && styles.coachBubbleUser]}
              >
                <Text style={{ color: m.role === "user" ? t.onAccent : t.textStrong, fontSize: 15, lineHeight: 21 }}>
                  {m.content}
                </Text>
              </View>
            ))}
            {coachLoading && (
              <View style={styles.coachBubble}>
                <ActivityIndicator color={t.textMuted} />
              </View>
            )}
          </ScrollView>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.coachInputRow}>
              <TextInput
                style={styles.coachInput}
                value={coachInput}
                onChangeText={setCoachInput}
                placeholder="Ask about this food…"
                placeholderTextColor={t.textDim}
                editable={!coachLoading}
                onSubmitEditing={sendCoachMessage}
                returnKeyType="send"
                multiline
              />
              <TouchableOpacity
                onPress={sendCoachMessage}
                disabled={!coachInput.trim() || coachLoading}
                style={{
                  backgroundColor: t.good, borderRadius: 20, width: 40, height: 40,
                  alignItems: "center", justifyContent: "center",
                  opacity: !coachInput.trim() || coachLoading ? 0.4 : 1,
                }}
                accessibilityLabel="Send message"
              >
                <Text style={{ color: t.onAccent, fontSize: 18, fontWeight: "700" }}>↑</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showCoachPaywall}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCoachPaywall(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <View style={{ backgroundColor: t.bg, borderRadius: 20, padding: 28, alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>🐾</Text>
            <Text style={{ color: t.textStrong, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
              You&apos;ve used your 5 free questions
            </Text>
            <Text style={{ color: t.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
              The AI Nutrition Coach is coming as a premium feature. Stay tuned for updates!
            </Text>
            <TouchableOpacity
              onPress={() => setShowCoachPaywall(false)}
              style={{ backgroundColor: t.good, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 }}
            >
              <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 16 }}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.bg },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: t.bg,
  },

  // Scan screen
  scanScreen: {
    flex: 1,
    backgroundColor: t.bg,
    paddingTop: 60,
    alignItems: "center",
  },
  // Apple large-title nav: a quiet eyebrow, then a big bold headline —
  // matches the "Scan a food" title treatment in the approved prototype.
  scanEyebrow: {
    fontSize: 15,
    color: t.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: t.textStrong,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: t.textMuted,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 32,
    marginBottom: 14,
  },
  // Instructional hero card — the blue accent card from the prototype,
  // adapted to sit above the live camera (this app shows the scanner
  // immediately rather than a separate "open scanner" home state).
  heroCard: {
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: t.info,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  heroCardIcon: { fontSize: 26, marginRight: 12 },
  heroCardText: {
    flex: 1,
    color: t.onAccent,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  cameraWrapper: {
    alignSelf: "stretch",
    flex: 1,
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surfaceSunken,
  },
  camera: { flex: 1 },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 22,
  },
  scanFrame: { width: 280, height: 160, position: "relative" },
  scanLine: {
    position: "absolute",
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: t.good,
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
  // Apple segmented control: a light-grey track with a white active pill —
  // not a colour-filled toggle. Colour lives in the content below, not the
  // navigation chrome, matching the approved prototype's iOS system look.
  modeToggle: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: t.surfaceSunken,
    borderRadius: 11,
    padding: 3,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9,
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: t.surface,
    shadowColor: t.textStrong,
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  modeBtnText: { color: t.textMuted, fontWeight: "600", fontSize: 14 },
  modeBtnTextActive: { color: t.textStrong, fontWeight: "700" },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: t.overlayControl,
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.overlayControl,
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: t.good,
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
  results: { paddingBottom: 48, backgroundColor: t.bg },

  // Score hero — circular ring on the dark ground (food results).
  // Reads as a measured instrument rather than a flat colour block.
  scoreHero: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 24,
  },
  scoreRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 9,
    backgroundColor: t.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingNumber: {
    fontSize: 62,
    fontWeight: "800",
    lineHeight: 66,
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
  },
  scoreRingOutOf: {
    fontSize: 13,
    color: t.textDim,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  scoreRatingPill: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  scoreRatingText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  scoreHeroNote: {
    fontSize: 11,
    color: t.textDim,
    marginTop: 12,
    letterSpacing: 0.3,
  },

  // Score banner — full width hero (still used by the treats results screen).
  // Restraint over shout: the number is the message, so it gets tighter tracking
  // and the supporting copy steps back rather than competing with it.
  scoreBanner: {
    paddingTop: 56,
    paddingBottom: 28,
    alignItems: "center",
    marginBottom: 0,
  },
  scoreBannerNumber: {
    fontSize: 68,
    fontWeight: "800",
    color: t.onAccent,
    lineHeight: 72,
    letterSpacing: -2,
  },
  scoreBannerLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.72)",
    fontWeight: "600",
    marginTop: -2,
  },
  scoreBannerRating: {
    fontSize: 17,
    fontWeight: "700",
    color: t.onAccent,
    marginTop: 12,
    letterSpacing: 0.2,
  },
  scoreBannerNote: {
    fontSize: 11,
    color: "rgba(255,255,255,0.62)",
    marginTop: 6,
    letterSpacing: 0.3,
  },

  productName: {
    fontSize: 21,
    fontWeight: "700",
    color: t.textStrong,
    lineHeight: 27,
    letterSpacing: -0.3,
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 3,
  },
  // Provenance, not a verdict — so it reads as metadata, not as "this is good".
  dataSource: {
    fontSize: 11,
    color: t.textDim,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 18,
    letterSpacing: 0.2,
  },

  // Cards — a hairline border and more air gives each section a real edge,
  // so the screen reads as discrete cards instead of one long wall of text.
  section: {
    backgroundColor: t.surfaceAlt,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: t.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 14,
    color: t.textDim,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: { fontSize: 14, color: t.text, lineHeight: 22 },
  sectionNote: { fontSize: 12, color: t.textDim, marginTop: 8, lineHeight: 19 },

  warningBox: {
    backgroundColor: t.criticalTint,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: t.critical,
  },
  warningTitle: {
    fontWeight: "700",
    color: t.critical,
    marginBottom: 8,
    fontSize: 14,
  },
  warningItem: {
    color: t.critical,
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 13,
  },

  cautionBox: {
    backgroundColor: t.moderateTint,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: t.moderate,
  },
  cautionTitle: {
    fontWeight: "700",
    color: t.moderate,
    marginBottom: 8,
    fontSize: 14,
  },
  cautionItem: { color: t.moderate, marginBottom: 4, fontSize: 13 },
  cautionNote: {
    color: t.moderate,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },

  infoBox: {
    backgroundColor: t.bg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: t.info,
  },
  infoTitle: {
    fontWeight: "700",
    color: t.infoSoft,
    marginBottom: 8,
    fontSize: 14,
  },
  infoBody: { color: t.infoSoft, fontSize: 13, lineHeight: 20 },

  safeBox: {
    backgroundColor: t.goodTint,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: t.good,
  },
  safeText: { color: t.good, fontWeight: "600", fontSize: 14 },
  goodItem: { color: t.good, marginBottom: 4, fontSize: 13 },

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
    color: t.textStrong,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  ingredient: { fontSize: 13, color: t.text, lineHeight: 20 },
  flaggedIngredient: { color: t.critical, fontWeight: "600" },
  mealIngredient: { color: t.moderate, fontWeight: "600" },
  cautionIngredient: { color: t.moderate, fontWeight: "600" },
  goodIngredient: { color: t.good, fontWeight: "600" },
  ingredientReason: {
    fontSize: 11,
    color: t.textDim,
    fontStyle: "italic",
    marginLeft: 14,
    marginTop: 2,
    lineHeight: 16,
  },

  // Ingredient pills
  pillContainer: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  // Bigger tap target and more internal padding — these are the most-touched
  // element on the screen and were previously cramped.
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  pillText: { color: t.onAccent, fontSize: 13, fontWeight: "600", letterSpacing: -0.1 },
  pillHint: {
    fontSize: 12,
    color: t.textDim,
    marginBottom: 12,
    lineHeight: 17,
  },

  // Ingredient detail modal
  detailModal: { flex: 1, backgroundColor: t.bg },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 28,
    borderBottomWidth: 1,
    borderBottomColor: t.surfaceAlt,
  },
  detailIngredientName: {
    flex: 1,
    color: t.textStrong,
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
    backgroundColor: t.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: t.textDim,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailSectionBody: { fontSize: 14, color: t.text, lineHeight: 22 },
  detailLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    marginBottom: 12,
  },
  detailLoadingText: { color: t.textDim, fontSize: 13 },
  detailDisclaimer: {
    fontSize: 11,
    color: t.borderBright,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 17,
  },

  loadingBox: { alignItems: "center", padding: 80, backgroundColor: t.bg },
  loadingText: {
    color: t.textDim,
    marginTop: 14,
    fontSize: 14,
    fontWeight: "500",
  },

  disclaimerScreen: {
    flex: 1,
    backgroundColor: t.bg,
    padding: 24,
    paddingTop: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: t.goodTint,
    borderWidth: 2,
    borderColor: t.good,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  disclaimerIcon: { fontSize: 32 },
  disclaimerAppName: {
    fontSize: 28,
    fontWeight: "900",
    color: t.textStrong,
    letterSpacing: -0.5,
  },
  disclaimerTagline: {
    fontSize: 13,
    color: t.textDim,
    marginBottom: 28,
    marginTop: 4,
  },
  disclaimerCard: {
    backgroundColor: t.surfaceAlt,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 24,
  },
  disclaimerCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: t.textMuted,
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
    color: t.text,
    lineHeight: 20,
  },
  disclaimerFooter: {
    fontSize: 11,
    color: t.textFaint,
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
  ingredientProvides: { fontSize: 11, color: t.textMuted, marginBottom: 2 },
  ingredientExplanation: { fontSize: 12, color: t.textMuted, lineHeight: 17 },
  organRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  organPresent: {
    fontSize: 13,
    color: t.good,
    fontWeight: "600",
    width: 80,
  },
  organMissing: {
    fontSize: 13,
    color: t.critical,
    fontWeight: "600",
    width: 80,
  },
  organBenefit: { flex: 1, fontSize: 12, color: t.textMuted, lineHeight: 17 },
  organMissingTitle: {
    fontSize: 12,
    color: t.textMuted,
    marginTop: 8,
    marginBottom: 6,
    fontStyle: "italic",
  },
  omegaRow: { marginBottom: 10 },
  omega3Label: {
    fontSize: 13,
    color: t.infoSoft,
    fontWeight: "600",
    marginBottom: 2,
  },
  omega6Label: {
    fontSize: 13,
    color: t.high,
    fontWeight: "600",
    marginBottom: 2,
  },
  omegaSources: { fontSize: 12, color: t.text, marginBottom: 3 },
  omegaNote: { fontSize: 12, color: t.textDim, lineHeight: 18 },
  fullIngredientList: { fontSize: 13, color: t.text, lineHeight: 20 },
  demoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  demoBtn: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: t.good,
    backgroundColor: t.surface,
  },
  demoBtnGood: { borderColor: t.goodDeep, backgroundColor: t.goodTint },
  demoBtnBad: { borderColor: t.criticalDeep, backgroundColor: t.criticalTint },
  demoBtnText: { color: t.good, fontSize: 13, fontWeight: "700" },
  disclaimerLink: { alignItems: "center", padding: 12 },
  disclaimerLinkText: {
    color: t.textDim,
    fontSize: 12,
    fontWeight: "600",
  },

  notFoundScreen: {
    flex: 1,
    backgroundColor: t.bg,
    padding: 24,
    paddingTop: 80,
    alignItems: "center",
  },
  notFoundEmoji: { fontSize: 64, marginBottom: 20 },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: t.textStrong,
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 15,
    color: t.textMuted,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  instructionBox: {
    backgroundColor: t.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginTop: 16,
  },
  instructionTitle: {
    fontWeight: "700",
    color: t.textStrong,
    marginBottom: 8,
    fontSize: 15,
  },
  instructionText: {
    color: t.textMuted,
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: { fontWeight: "700", color: t.textStrong },

  bottomDisclaimer: {
    backgroundColor: t.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  bottomDisclaimerText: {
    fontSize: 11,
    color: t.textDim,
    lineHeight: 18,
    marginBottom: 8,
  },

  backBtnTop: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: t.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: t.border,
  },
  backBtnTopText: { color: t.textMuted, fontSize: 13, fontWeight: "600" },

  // Treat scan styles
  flagItem: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  flagName: { fontSize: 13, fontWeight: "700", marginBottom: 3 },
  flagReason: { fontSize: 12, color: t.textMuted, lineHeight: 17 },
  ingredientItem: { borderRadius: 8, padding: 10, marginBottom: 6 },
  ingredientName: { fontSize: 13, fontWeight: "600", flex: 1 },
  ingredientTag: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.8,
  },

  error: {
    color: t.critical,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    padding: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    color: t.textMuted,
  },
  link: {
    color: t.good,
    textDecorationLine: "underline",
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: t.good,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: t.onAccent,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: { padding: 14, alignItems: "center", marginTop: 8 },
  cancelText: { color: t.textDim, fontSize: 15 },
  scoreLabel: { fontSize: 14, color: t.textDim, marginBottom: 4 },
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
  scoreOutOf: { fontSize: 12, color: t.textDim, fontWeight: "600" },

  // Coach button (in results)
  coachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.goodTint,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: t.good,
  },
  coachBtnIcon: { fontSize: 28, marginRight: 12 },
  coachBtnTitle: { color: t.good, fontWeight: "700", fontSize: 15 },
  coachBtnSub: { color: t.goodDeep, fontSize: 12, marginTop: 2 },
  coachBtnArrow: { color: t.good, fontSize: 24, marginLeft: "auto" as any },

  // Coach modal
  coachModal: { flex: 1, backgroundColor: t.bg },
  coachHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: t.surfaceAlt,
  },
  coachHeaderTitle: { color: t.textStrong, fontWeight: "800", fontSize: 18 },
  coachHeaderSub: { color: t.textDim, fontSize: 12, marginTop: 2 },
  coachClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  coachCloseText: { color: t.textMuted, fontSize: 14, fontWeight: "700" },
  coachDisclaimer: {
    backgroundColor: t.moderateTint,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  coachDisclaimerText: { color: t.moderateDeep, fontSize: 11, textAlign: "center" },
  coachMessages: { flex: 1 },
  coachBubble: {
    maxWidth: "85%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  coachBubbleUser: {
    backgroundColor: t.good,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  coachBubbleAssistant: {
    backgroundColor: t.surfaceAlt,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  coachBubbleText: { fontSize: 14, lineHeight: 20 },
  coachBubbleTextUser: { color: t.onAccent, fontWeight: "500" },
  coachBubbleTextAssistant: { color: t.text },
  coachInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: t.surfaceAlt,
    gap: 8,
  },
  coachInput: {
    flex: 1,
    backgroundColor: t.surfaceAlt,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: t.textStrong,
    fontSize: 15,
  },
  coachSend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: t.good,
    justifyContent: "center",
    alignItems: "center",
  },
  coachSendText: {
    color: t.onAccent,
    fontSize: 20,
    fontWeight: "700",
    marginTop: -2,
  },
  scoreInfo: { flex: 1 },
  // "Why This Score" ledger. More row height + a visible hairline makes it
  // scannable line-by-line; the +/- value is right-aligned and tabular so the
  // numbers form a clean column instead of drifting.
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  breakdownLabel: { flex: 1, fontSize: 13, color: t.text, lineHeight: 19, paddingRight: 10 },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
    minWidth: 38,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  lipomaGuide: {
    backgroundColor: t.surfaceSunken,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: t.info,
  },
  lipomaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: t.infoSoft,
    marginBottom: 4,
  },
  lipomaSubtitle: {
    fontSize: 12,
    color: t.textMuted,
    marginBottom: 14,
    lineHeight: 17,
  },
  lipomaRow: {
    borderBottomWidth: 1,
    borderBottomColor: t.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  lipomaLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: t.text,
    marginBottom: 2,
  },
  lipomaTarget: {
    fontSize: 12,
    color: t.infoSoft,
    fontWeight: "600",
    marginBottom: 4,
  },
  lipomaBody: { fontSize: 12, color: t.textMuted, lineHeight: 17 },
  recCard: {
    backgroundColor: t.surfaceSunken,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: t.info,
    marginBottom: 12,
  },
  recCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: t.infoSoft,
    marginBottom: 8,
  },
  recCardBody: {
    fontSize: 13,
    color: t.text,
    lineHeight: 19,
    marginBottom: 10,
  },
  recBtn: {
    backgroundColor: t.info,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  recBtnText: { color: t.onAccent, fontSize: 13, fontWeight: "700" },
  enzymeCard: {
    marginTop: 12,
    backgroundColor: t.goodTint,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: t.good,
  },
  enzymeCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: t.good,
    marginBottom: 8,
  },
  enzymeCardBody: {
    fontSize: 13,
    color: t.text,
    lineHeight: 19,
    marginBottom: 8,
  },
  enzymeBtn: {
    backgroundColor: t.good,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 4,
  },
  enzymeBtnText: { color: t.onAccent, fontSize: 13, fontWeight: "700" },
  enzymeDisclaimer: {
    fontSize: 10,
    color: t.textDim,
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
    backgroundColor: t.surfaceSunken,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: t.info,
  },
  processingOptionText: { color: t.infoSoft, fontSize: 13, fontWeight: "600" },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  nutrientLabel: { width: 110, fontSize: 12, color: t.textMuted },
  nutrientBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: t.border,
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
