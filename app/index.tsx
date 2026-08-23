import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
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
    severity: "severe",
    reason:
      "Inorganic copper sulfate bypasses normal liver regulation and accumulates in liver tissue over years of daily feeding. A 2015 Veterinary Pathology study found commercial pet foods with elevated inorganic copper were directly associated with progressive chronic hepatitis in Labrador Retrievers. Unlike organic copper proteinate, the body cannot efficiently regulate inorganic copper absorption, allowing it to build up silently until liver damage is already advanced. Bedlington Terriers, Dobermans, and Labs are especially susceptible.",
  },
  {
    term: "sodium selenite",
    severity: "severe",
    reason:
      "Sodium selenite is inorganic selenium, and selenium has one of the narrowest safe ranges of any nutrient. AAFCO sets the adult minimum at 0.35 mg/kg dry matter and the maximum at 2.0 — a window of only about 5.7x. For comparison, most nutrients have margins in the hundreds. That narrowness is precisely why the FORM matters here and matters less elsewhere. Two measured differences separate the forms. ABSORPTION: inorganic selenite is absorbed at roughly 50-60%, against 70-85% for organic selenomethionine and selenium yeast — so more selenite must be added to deliver the same nutrition, eating into an already tight margin. TOXICITY: comparative work found sodium selenite around 2.94x more toxic than selenium yeast, and organic forms test as less toxic than inorganic selenite and selenate generally. Mechanistically, selenomethionine is incorporated into proteins and released under regulation, whereas inorganic selenite generates free radicals during metabolism and causes oxidative stress in liver and kidney tissue; work in Biological Trace Element Research links long-term inorganic accumulation to kidney tubule damage that precedes any visible signs. So the case here is stronger than for most flagged ingredients: worse absorption AND higher toxicity AND the narrowest safety window in the profile. Prefer selenium yeast or selenomethionine.",
  },
  {
    term: "zinc oxide",
    severity: "mild",
    reason:
      "Zinc oxide is a poorly absorbed inorganic zinc source. Comparative bioavailability work in dogs (Journal of Nutrition) found plasma zinc significantly higher across a full six-hour period after zinc propionate than after zinc oxide. In-vitro comparison of sources put zinc proteinate highest at about 42% bioaccessibility, against roughly 24% for inorganic zinc sulphate — and the chelated forms were far more resistant to phytic acid, the compound in grains and legumes that binds zinc and blocks absorption. That matters because plant-heavy foods are exactly where zinc is hardest to absorb. Zinc deficiency shows up as crusted, scaling skin around the muzzle, eyes and paw pads. Huskies and Malamutes have a genetic absorption defect that makes the form especially important. Zinc proteinate or amino-acid chelate is the preferable form.",
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

/**
 * Per-ingredient impact, for DISPLAY only — it does not compute or alter the
 * score. It reads the same inputs the scorer already produced.
 *
 * ⚠️ An honest limitation worth preserving: only HARMFUL ingredients carry a
 * true per-ingredient score. Carb load, vitamin load, legume clustering and
 * vague protein sourcing are computed in aggregate, and format bonus, TAPF and
 * AAFCO status are properties of the FOOD, not of any ingredient.
 *
 * So the negative numbers here are exact — they are the same points the scorer
 * subtracted, using identical position scaling. The positives are deliberately
 * qualitative, because assigning a number to "kale" would be a number I made up,
 * and the column wouldn't add up to the total. Better an honest gap than a
 * fabricated one.
 */
function ingredientImpact(
  item: string,
  index: number,
  flagged: { name: string; severity: string; position?: number }[],
  good: { omega3: string[]; fiber: string[]; probiotic?: string[] },
  meals: string[],
  legumes: string[],
): { points: number | null; tier: "harm" | "good" | "watch" | "neutral"; label: string } {
  const harm = flagged.find((f) => f.name === item);
  if (harm) {
    // Identical to the scorer: base penalty, scaled by position, clamped 1–10.
    const base = SEVERITY_PENALTIES[harm.severity] || 8;
    const pos = harm.position ?? index;
    const mult = pos < 5 ? 1.0 : pos < 10 ? 0.65 : pos < 20 ? 0.4 : 0.2;
    const p = Math.min(10, Math.max(1, Math.round(base * mult)));
    return { points: -p, tier: "harm", label: harm.severity };
  }
  if (good.omega3.includes(item)) return { points: null, tier: "good", label: "omega-3 source" };
  if (good.fiber.includes(item)) return { points: null, tier: "good", label: "fibre source" };
  if (good.probiotic?.includes(item)) return { points: null, tier: "good", label: "probiotic" };
  if (meals.includes(item)) return { points: null, tier: "watch", label: "unnamed meal" };
  if (legumes.includes(item)) return { points: null, tier: "watch", label: "legume" };
  return { points: null, tier: "neutral", label: "" };
}

const SEVERITY_COLORS: Record<string, string> = {
  mild: t.high,
  moderate: t.high,
  severe: t.criticalDeep,
  toxic: t.criticalDeep,
};

const SUPPLEMENT_RECS = [
  {
    emoji: "🦠", name: "Probiotics", color: t.accents.probiotic.fg, borderColor: t.accents.probiotic.fg, bg: t.accents.probiotic.bg,
    body: "Multi-strain probiotics support gut microbiome diversity, immune function, and stool quality. Look for at least 1 billion CFU with Lactobacillus and Bifidobacterium strains — and check whether the CFU count is guaranteed AT EXPIRY or only at manufacture, since live cultures die off in storage. Dog-specific strains are preferable to human formulas. Most beneficial for dogs on kibble, after antibiotics, or with chronic digestive issues.",
    note: "Fine to give alongside fish oil — they do different jobs (gut vs inflammation). Nobody has tested the combination, so we won't claim they multiply each other.",
    link: "https://amzn.to/4dPRAWP", linkText: "🛒 Shop Probiotics →",
  },
  {
    emoji: "🐟", name: "Fish Oil (Omega-3)", color: t.good, borderColor: t.good, bg: t.goodTint,
    body: "Wild-caught sardine or anchovy oil reduces inflammation and supports coat, joints and brain function. Look for triglyceride form — not ethyl ester — and refrigerate after opening to prevent rancidity.\n\nTHE NUMBER ON THE BOTTLE IS NOT THE NUMBER THAT MATTERS. A '1,000mg fish oil' softgel is often only about 300mg of EPA+DHA combined. Read the EPA and DHA lines and add them — that's your actual dose, and mistaking one for the other is how most people under-dose this threefold.\n\nTwo different targets, because they're two different jobs:\n\nGENERAL WELLNESS — roughly 20mg EPA+DHA per pound of body weight daily. Comfortably above the NRC adequate intake, and plenty for coat, skin and everyday support.\n\nJOINTS AND ARTHRITIS — the trials used far more. A randomised, double-blind, multicentre trial dosed 69 mg/kg/day for three months and found significant improvement in pain, lameness and joint disease; a synthesis of 23 randomised trials puts efficacy at 60-100 mg/kg/day. That's roughly 30-45mg per pound — about double the wellness dose. The NRC safe upper limit is 370 mg/kg^0.75, so the therapeutic range sits well inside it.\n\nWorked example: a 75lb (34kg) dog. Wellness ≈ 1,500mg. Joints ≈ 2,040-3,400mg. Safe ceiling ≈ 5,200mg. And whatever the food already provides counts toward it — check the guaranteed analysis before adding.",
    note: "Trial · randomised, in dogs, for osteoarthritis. Wellness ~20mg/lb; joints 60-100 mg/kg.",
    link: "https://amzn.to/4efzKxO", linkText: "🛒 Shop Fish Oil →",
  },
  {
    emoji: "🌊", name: "Green Lipped Mussel", color: t.accents.mussel.fg, borderColor: t.accents.mussel.fg, bg: t.accents.mussel.bg,
    body: "New Zealand green lipped mussel contains unique omega-3s (ETA) not found in fish oil, plus natural glucosamine and chondroitin. A systematic review of the canine trials concluded there is 'a moderate amount of evidence' for real clinical benefit in dogs with osteoarthritis — while noting the underlying studies had methodological weaknesses. That's genuinely good for a supplement, and we'd rather tell you the honest strength than oversell it. Buy the plain freeze-dried powder rather than a chew — chews carry starch and glycerin binders you don't need.",
    note: "Trial · moderate evidence in dogs. Give alongside fish oil if you like — they cover different ground, though no one has tested the pair together.",
    link: "https://amzn.to/4vpJKdX", linkText: "🛒 Shop Green Lipped Mussel →",
  },
  {
    emoji: "❤️", name: "Heart Treats", color: t.accents.heart.fg, borderColor: t.accents.heart.fg, bg: t.accents.heart.bg,
    body: "Beef or chicken heart is among the richest dietary sources of CoQ10 and naturally high in taurine — both directly relevant to cardiac function, and taurine is the nutrient at the centre of the grain-free heart conversation. Unlike liver, heart is a muscle meat, so the organ cap is less strict, but keep all treats under 10% of total diet.\n\nOn 'richest source': heart is genuinely at the top of the list among common foods, but we've stopped claiming it's number one — that's a superlative we can't verify against a full comparison.",
    note: "Whole-food source rather than a trialled intervention — no canine trial has tested heart treats as a treatment.",
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
    body: "Milk thistle (silymarin) has more canine evidence behind it than most supplements — but it's worth knowing exactly what that evidence is. The dramatic results come from Amanita mushroom poisoning, where dogs given INTRAVENOUS silymarin survived while around 30% of untreated controls died. That's a genuine finding, and it's about an IV drug for acute poisoning, not a daily capsule. For oral use, Twedt et al. (2003) showed a silybin-phospholipid complex raised liver glutathione in dogs, and several small studies report lower ALT and ALP — but these are small, mostly without placebo controls, and no large randomised trial in dogs exists.\n\nSo: good safety record, real mechanism, genuine canine data for liver injury. What has NOT been shown is that it does anything useful as routine 'detox' in a healthy dog. Most valuable where there's actual hepatic stress — known toxin exposure, liver enzyme elevation, or chemotherapy.",
    note: "Trial · canine evidence for liver injury, mostly IV or small oral studies. No evidence for routine detox in a healthy dog.",
    link: "https://amzn.to/4dZ2ZDT", linkText: "🛒 Shop Detox Support →",
  },
  {
    emoji: "🍃", name: "Four Leaf Rover", color: t.accents.rover.fg, borderColor: t.accents.rover.fg, bg: t.accents.rover.bg,
    body: "A dog-specific supplement line worth knowing by product rather than by brand, so here are the ones with a clear job and what the evidence behind each actually is.\n\nYEAST GUARD — herbal antifungal blend for dogs with recurring yeast. Traditional herbal use, not trial-backed in dogs. Note it carries a California Prop 65 warning for goldenseal.\n\nPROTECT / SOIL-BASED PROBIOTICS — spore-forming strains that survive stomach acid better than standard Lactobacillus. Mechanism is sound; canine outcome trials are thin.\n\nLIVER / MILK THISTLE PRODUCTS — silymarin has real canine data for liver injury, though the strongest results are intravenous for mushroom poisoning rather than daily oral use. See the Detox card for the honest version.\n\nMUSHROOM BLENDS — check whether it's FRUITING BODY or mycelium grown on grain. Myceliated grain is largely starch, and the beta-glucans you're paying for are mostly in the fruiting body. This is the single most useful thing to check on any mushroom product, from any brand.\n\nWe earn a commission if you buy through this link, and that's exactly why the descriptions above name what each product does and doesn't have behind it.",
    note: "Buy by product and by evidence, not by brand. Affiliate link — disclosed.",
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

// Copper is the ONE nutrient where "AAFCO complete" tells you nothing about the
// top end — because there is no top end. Worth its own block: this is real,
// current, contested in the veterinary literature, and almost nobody knows it.
const COPPER_CEILING_GAP = [
  {
    h: "AAFCO has no maximum for copper. It used to.",
    b: "Until 1997 the ceiling was 71 mg per 1,000 kcal. It was removed after research showed copper OXIDE — the form then in use — is barely absorbed. The industry moved to well-absorbed forms like copper sulfate and copper proteinate, and the upper limit disappeared at the same time. Minimums remain (1.83 mg/1,000 kcal for adults, 3.1 for puppies). There is no maximum at all.\n\nSo a food can carry the complete-and-balanced claim at almost any copper level. For every other nutrient on this app's AAFCO table, that claim bounds both ends. For copper it bounds only the bottom.",
  },
  {
    h: "And the disease tracked the rule change",
    b: "Clinical opinion is that copper-associated hepatopathy in dogs began rising after 1997, coinciding with the switch in premix copper forms. It is contested enough that a 2021 paper in the Journal of the American Veterinary Medical Association is titled 'Is it time to reconsider current guidelines for copper content in commercial dog foods?' — and AAFCO convened an expert panel on it.\n\nBe precise about what that is: an observed trend and a plausible mechanism, not a proven causal chain. Nobody has run the trial. It is enough to justify caution and not enough to call any particular food unsafe.",
  },
  {
    h: "⚠️ Labradors carry the genetic version",
    b: "The ATP7B mutation associated with primary copper-associated hepatopathy is a LABRADOR RETRIEVER mutation. Bedlington Terriers are the classic textbook breed (COMMD1), but Labs, Dobermans, Dalmatians, West Highland Whites and Skye Terriers all carry recognised predisposition.\n\nIf you have one of these breeds, copper is the single nutrient where the usual reassurances don't cover you.",
  },
  {
    h: "The check is free and you may already have it",
    b: "ALT — a liver enzyme — is on every standard blood panel. Copper accumulation raises ALT long before a dog looks unwell, which is how this gets caught.\n\nSo the useful move isn't avoiding liver. It's asking for the ACTUAL NUMBER on your dog's next panel rather than accepting 'everything looked good', and watching whether it drifts upward year over year. A single ALT inside the reference range means little; the same value climbing across three panels means a lot. You can only see that if you have the numbers.",
  },
  {
    h: "What this does and doesn't mean for liver in food",
    b: "Liver is the densest natural source of copper, which is why raw-feeding models cap it at about 5% of the diet. That convention exists for copper and vitamin A specifically.\n\nBut whole-food copper at a controlled inclusion is not the pattern that drove the trend — that was synthetic premix copper becoming highly bioavailable while the ceiling vanished. Liver stays one of the most valuable ingredients in a bowl. Keep it near 5%, prefer foods that publish their analysis, and if your breed is on the list above, watch the ALT.",
  },
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
    note: "Technically a muscle, not an organ — which is why it can be fed far more freely than liver. The best natural taurine source there is, which matters for heart health and is directly relevant to the DCM conversation around legume-heavy diets.\n\nPORTIONING, BECAUSE THE SIZES ARE WILDLY DIFFERENT: one turkey heart is worth roughly five chicken hearts. A chicken heart averages about 6g; a turkey heart runs somewhere around 25–35g, because a turkey is several times the bird. (The chicken figure is measured; the turkey one is derived from body-size scaling rather than weighed, so treat 1:5 as a working rule for portioning, not a precise conversion.) If you switch between them without adjusting, you'll either massively under- or over-shoot.\n\nIF YOUR DOG'S BREED CARRIES HEART RISK — Dobermans, Great Danes, Boxers, Cocker Spaniels, Irish Wolfhounds, Newfoundlands — adding heart is a reasonable, low-risk thing to do, and it's what the author feeds his own Labrador. Be clear on why, though: heart is the densest natural source of taurine and CoQ10, and taurine deficiency is one established route to dilated cardiomyopathy. What has NOT been tested is whether feeding heart prevents DCM in a predisposed dog — no trial has asked that question. So this is mechanism plus practice, not proven prevention. It's cheap, it's food rather than a supplement, and there's no plausible downside; that's the honest case for it, and it's enough." },
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

/**
 * The omega-3 family — because "omega-3" on a label is five different molecules
 * doing different jobs, and the label almost never says which.
 *
 * The two that matter most are EPA and DHA, and they are NOT interchangeable:
 * EPA is the anti-inflammatory one, DHA is the structural one. Which you want more
 * of depends on why you're supplementing — a fact that would let an owner buy far
 * more intelligently and that essentially nothing tells them.
 */
/**
 * Collagen — three types, and one of them works nothing like the others.
 *
 * The distinction that matters and that almost no product page explains: hydrolyzed
 * collagen is a BUILDING BLOCK, dosed in grams. Undenatured type II (UC-II) is an
 * IMMUNE SIGNAL, dosed in milligrams. Effective UC-II doses run 0.01–30 mg/kg/day
 * against 100–500 mg/kg/day for collagen peptides — a hundredfold difference that
 * only makes sense once you know they're doing different things.
 *
 * Buying "collagen" without knowing which you need is how owners end up giving a
 * scoop of skin-and-coat powder for a joint problem.
 */
/**
 * Medicinal mushrooms — graded honestly.
 *
 * This category is drowning in marketing, and the honest position is narrower than
 * the sellers suggest: exactly ONE has a real trial in dogs (turkey tail, and it was
 * a 15-dog pilot). Everything else is human data, in-vitro work, or mechanism, applied
 * to dogs by inference.
 *
 * That doesn't make them worthless — beta-glucan immune modulation is well established
 * across species. It means the confidence tier has to be stated, per PINECONE_PROTOCOL:
 * never round up.
 *
 * The buying guidance at the end matters as much as the species: most supplements on
 * the shelf are mycelium grown on grain, which is largely starch.
 */
/**
 * Deficiency signs an owner could actually notice.
 *
 * Deliberately not all 26 nutrients — only the ones with a visible, recognisable
 * presentation. A list of vague symptoms ("lethargy, poor coat") helps nobody; a
 * list of specific patterns ("crusted skin around the muzzle and paw pads, in a
 * Husky") turns an owner into a useful observer.
 *
 * ⚠️ Framing matters: on a complete-and-balanced diet these are RARE. This exists so
 * an owner can recognise a real problem, not so they diagnose one that isn't there.
 * Most of these arise from unbalanced home-prepared diets, malabsorption, or a
 * specific breed defect — not from ordinary commercial food.
 */
/**
 * AAFCO Dog Food Nutrient Profiles — transcribed from the source document, not recalled.
 *
 * Values are DRY MATTER basis, presuming 4,000 kcal ME/kg. Foods denser than that should
 * be corrected for energy density before comparing.
 *
 * Reference data only. AAFCO's Official Publication is the authoritative source; this app
 * is not affiliated with or endorsed by AAFCO.
 *
 * ⚠️ An absent maximum does NOT mean unlimited. AAFCO's own wording: it "reflects the lack
 * of information in dogs and cats on toxic concentrations of that nutrient," and setting a
 * maximum arbitrarily "might prove worse than no maximum at all."
 */
const AAFCO_PROFILES: {
  group: string;
  rows: { nutrient: string; unit: string; growth: string; adult: string; max: string; note?: string }[];
}[] = [
  {
    group: "Protein & amino acids",
    rows: [
      { nutrient: "Crude protein", unit: "%", growth: "22.5", adult: "18.0", max: "—" },
      { nutrient: "Arginine", unit: "%", growth: "1.0", adult: "0.51", max: "—" },
      { nutrient: "Histidine", unit: "%", growth: "0.44", adult: "0.19", max: "—" },
      { nutrient: "Isoleucine", unit: "%", growth: "0.71", adult: "0.38", max: "—" },
      { nutrient: "Leucine", unit: "%", growth: "1.29", adult: "0.68", max: "—" },
      { nutrient: "Lysine", unit: "%", growth: "0.90", adult: "0.63", max: "—" },
      { nutrient: "Methionine", unit: "%", growth: "0.35", adult: "0.33", max: "—" },
      { nutrient: "Methionine-cystine", unit: "%", growth: "0.70", adult: "0.65", max: "—" },
      { nutrient: "Phenylalanine", unit: "%", growth: "0.83", adult: "0.45", max: "—" },
      { nutrient: "Phenylalanine-tyrosine", unit: "%", growth: "1.30", adult: "0.74", max: "—" },
      { nutrient: "Threonine", unit: "%", growth: "1.04", adult: "0.48", max: "—" },
      { nutrient: "Tryptophan", unit: "%", growth: "0.20", adult: "0.16", max: "—" },
      { nutrient: "Valine", unit: "%", growth: "0.68", adult: "0.49", max: "—" },
    ],
  },
  {
    group: "Fat & fatty acids",
    rows: [
      { nutrient: "Crude fat", unit: "%", growth: "8.5", adult: "5.5", max: "—" },
      { nutrient: "Linoleic acid (omega-6)", unit: "%", growth: "1.3", adult: "1.1", max: "—" },
      { nutrient: "Alpha-linolenic (ALA)", unit: "%", growth: "0.08", adult: "ND", max: "—" },
      { nutrient: "EPA + DHA", unit: "%", growth: "0.05", adult: "ND", max: "—",
        note: "No adult minimum set — but enough omega-3 is still needed to meet the ratio cap below." },
      { nutrient: "Omega-6 : omega-3 ratio", unit: "ratio", growth: "—", adult: "—", max: "30:1",
        note: "(LA+AA) : (ALA+EPA+DHA). This MAXIMUM is the only fatty-acid ratio AAFCO enforces. The 5:1 target used in holistic practice is far stricter than the legal ceiling." },
    ],
  },
  {
    group: "Minerals",
    rows: [
      { nutrient: "Calcium", unit: "%", growth: "1.2", adult: "0.5", max: "2.5",
        note: "Max drops to 1.8% for formulas that may be fed to large-breed puppies (70+ lb as adults) — excess calcium accelerates bone growth and causes joint disease." },
      { nutrient: "Phosphorus", unit: "%", growth: "1.0", adult: "0.4", max: "1.6" },
      { nutrient: "Ca:P ratio", unit: "ratio", growth: "1:1", adult: "1:1", max: "2:1" },
      { nutrient: "Potassium", unit: "%", growth: "0.6", adult: "0.6", max: "—" },
      { nutrient: "Sodium", unit: "%", growth: "0.3", adult: "0.08", max: "—" },
      { nutrient: "Chloride", unit: "%", growth: "0.45", adult: "0.12", max: "—" },
      { nutrient: "Magnesium", unit: "%", growth: "0.06", adult: "0.06", max: "—" },
      { nutrient: "Iron", unit: "mg/kg", growth: "88", adult: "40", max: "—",
        note: "Iron from CARBONATE or OXIDE sources doesn't count toward the minimum — too poorly absorbed. This is AAFCO agreeing that ferric oxide is a colorant, not a nutrient." },
      { nutrient: "Copper", unit: "mg/kg", growth: "12.4", adult: "7.3", max: "—",
        note: "Copper from OXIDE sources is excluded from the minimum for poor bioavailability." },
      { nutrient: "Manganese", unit: "mg/kg", growth: "7.2", adult: "5.0", max: "—" },
      { nutrient: "Zinc", unit: "mg/kg", growth: "100", adult: "80", max: "—" },
      { nutrient: "Iodine", unit: "mg/kg", growth: "1.0", adult: "1.0", max: "11" },
      { nutrient: "Selenium", unit: "mg/kg", growth: "0.35", adult: "0.35", max: "2" },
    ],
  },
  {
    group: "Vitamins",
    rows: [
      { nutrient: "Vitamin A", unit: "IU/kg", growth: "5,000", adult: "5,000", max: "250,000" },
      { nutrient: "Vitamin D", unit: "IU/kg", growth: "500", adult: "500", max: "3,000",
        note: "Lowered from 5,000 — 1,000 IU/kg below the level shown to disrupt bone formation in growing Great Dane puppies." },
      { nutrient: "Vitamin E", unit: "IU/kg", growth: "50", adult: "50", max: "—",
        note: "Maximum DELETED — no evidence of vitamin E toxicity in dogs to base one on. AAFCO recommends the ratio of vitamin E (IU) to polyunsaturated fat (g) stay above 0.6:1; 50 IU covers up to 83g PUFA, and above that add 0.6 IU per extra gram." },
      { nutrient: "Thiamine (B1)", unit: "mg/kg", growth: "2.25", adult: "2.25", max: "—",
        note: "Processing can destroy up to 90% of thiamine, so formulas must be built to hit the minimum AFTER processing." },
      { nutrient: "Riboflavin (B2)", unit: "mg/kg", growth: "5.2", adult: "5.2", max: "—" },
      { nutrient: "Pantothenic acid (B5)", unit: "mg/kg", growth: "12", adult: "12", max: "—" },
      { nutrient: "Niacin (B3)", unit: "mg/kg", growth: "13.6", adult: "13.6", max: "—" },
      { nutrient: "Pyridoxine (B6)", unit: "mg/kg", growth: "1.5", adult: "1.5", max: "—" },
      { nutrient: "Folic acid (B9)", unit: "mg/kg", growth: "0.216", adult: "0.216", max: "—" },
      { nutrient: "Vitamin B12", unit: "mg/kg", growth: "0.028", adult: "0.028", max: "—" },
      { nutrient: "Choline", unit: "mg/kg", growth: "1,360", adult: "1,360", max: "—" },
    ],
  },
];

const DEFICIENCY_SIGNS: {
  nutrient: string;
  visible: string;
  cause: string;
  urgency: "urgent" | "watch";
}[] = [
  {
    nutrient: "Thiamine (B1)", urgency: "urgent",
    visible: "Appetite loss and wobbliness first, then head tilt, dilated pupils, disorientation — progressing to seizures. Can appear within weeks.",
    cause: "Sulfite-preserved meat (destroys thiamine), raw fish containing thiaminase, or heavily heat-processed food without adequate replacement. THE most dangerous deficiency here and a genuine emergency.",
  },
  {
    nutrient: "Zinc", urgency: "watch",
    visible: "Crusted, scaling, cracked skin specifically around the muzzle, eyes, ears and paw pads. Dull coat, slow wound healing.",
    cause: "A genetic absorption defect in Huskies and Malamutes, or high-phytate plant-heavy diets binding the zinc. Responds dramatically to correct supplementation.",
  },
  {
    nutrient: "Taurine", urgency: "urgent",
    visible: "Exercise intolerance, coughing, collapse — signs of dilated cardiomyopathy. Sometimes vision loss from retinal degeneration.",
    cause: "Legume-heavy grain-free diets, or breed predisposition (Goldens, Newfoundlands, Cockers). Often reversible if caught early, which is why it's worth testing rather than assuming.",
  },
  {
    nutrient: "Calcium", urgency: "urgent",
    visible: "Limping, reluctance to move, pain, and fractures from ordinary activity. Puppies most at risk — bowed legs and swollen joints.",
    cause: "All-meat home-prepared diets with no bone or calcium source. The body strips calcium from bone to hold blood levels steady.",
  },
  {
    nutrient: "Vitamin E", urgency: "watch",
    visible: "Muscle weakness and wasting, and in prolonged cases retinal degeneration affecting vision.",
    cause: "Rare on complete food — stores last months. Demand rises with high polyunsaturated fat intake, so long-term high-dose fish oil without matching vitamin E is the realistic route in.",
  },
  {
    nutrient: "Vitamin B12", urgency: "watch",
    visible: "Lethargy, appetite and weight loss, sometimes neurological signs.",
    cause: "Genuinely common in dogs with EPI, IBD or chronic gut disease — the gut can't absorb it however much is in the bowl. Worth testing in any dog with chronic diarrhoea rather than guessing.",
  },
  {
    nutrient: "Niacin (B3)", urgency: "watch",
    visible: "Classic 'black tongue' — mouth ulceration, thick drooling, foul breath, bloody diarrhoea.",
    cause: "Historically all-corn diets; corn's niacin is bound and poorly available. Rare now.",
  },
  {
    nutrient: "Iron", urgency: "watch",
    visible: "Pale gums, exercise intolerance, weakness.",
    cause: "Chronic blood loss — fleas, hookworms, GI bleeding — far more often than diet. Check the gums, then look for the leak.",
  },
  {
    nutrient: "Iodine", urgency: "watch",
    visible: "Hypothyroid picture — lethargy, weight gain, hair loss, cold intolerance, slow heart rate.",
    cause: "Both too little AND too much cause thyroid disease, which is why doubling up on potassium iodide plus kelp is worth checking on a label.",
  },
  {
    nutrient: "Biotin", urgency: "watch",
    visible: "Crusty dermatitis, hair loss, brittle claws, dull coat.",
    cause: "Large amounts of RAW egg white — avidin binds biotin. Whole eggs including the yolk are fine.",
  },
];

// ── MEDICINAL MUSHROOMS ──────────────────────────────────────────────────────
// Rewritten 2026-08-22 from Kyle's mushroom research. The previous version was
// replaced wholesale at his direction — this is the source of truth for the
// section now. Functional mushrooms as a "Swiss Army knife" supplement:
// targeted support for immunity, organs and the ageing brain.
//
// Two compound families do the work and it's worth knowing which is which,
// because it decides how a product has to be extracted:
//   BETA-GLUCANS — polysaccharides that activate and balance the immune system.
//                  Need HOT WATER extraction.
//   TERPENES     — cross the blood-brain barrier, act on the nervous system and
//                  stabilise mast cells. Need ALCOHOL extraction.
// ── GUT HEALTH ───────────────────────────────────────────────────────────────
// Added 2026-08-22 from Kyle's gut-health research. Companion image:
// assets/images/gut-health-guide.jpg
//
// The framing: 70–80% of the immune system sits behind the gut wall in the GALT.
// Balanced, it keeps the immune system calm. Irritated, the GALT goes into
// overdrive and produces systemic inflammation — which is why skin, behaviour and
// organ problems so often trace back here.
const GUT_AXES: { axis: string; icon: string; detail: string }[] = [
  {
    axis: "The gut–skin axis", icon: "🔥",
    detail: "Red inflamed skin, recurring hot spots, ear infections and obsessive paw-chewing are the smoke and flames of a house fire happening in the gut. Standard skin treatments mask the symptom and leave the GI root cause running.",
  },
  {
    axis: "The gut–brain axis", icon: "🧠",
    detail: "The microbiome steers emotional state like a puppeteer, using the vagus nerve as a direct line. Imbalances drive behaviour problems, aggression, thunderstorm phobia, training difficulty and mood disorders. In older dogs, poor oral and gut microbiomes are linked to cognitive decline and dementia.",
  },
  {
    axis: "Liver & lymphatics", icon: "🫀",
    detail: "The gut never works alone. All blood from the GI tract filters through the liver, and the liver's ability to clear chemicals depends heavily on gut methylation. The gut's lymphatic capillaries — including Peyer's patches — absorb fat-soluble nutrients and carry fat-soluble toxins away. Stagnation in either network cascades outward.",
  },
];

// Leaky gut, mechanically.
const GUT_LEAKY = {
  what: "Chronic inflammation damages the mucosal lining, and the tight cellular junctions that act as gatekeepers start pulling apart. That's gut hyperpermeability — leaky gut.",
  how: "As the barrier degrades, the gut-lining protein ZONULIN rises and widens the gaps between cells. Environmental toxins, pathogens and large undigested food proteins pass straight into the bloodstream.",
  result: "The immune system sees those misplaced proteins as invaders and attacks. That cascade is where chronic food sensitivities, allergies and autoimmune conditions come from — including rheumatoid arthritis and immune-mediated polyarthritis (IMPA).",
};

// What breaks it. Ordered by how much of it an owner actually controls.
const GUT_DISRUPTORS: { name: string; icon: string; detail: string }[] = [
  {
    name: "Processed kibble", icon: "🍖",
    detail: "Cooked at high temperature multiple times, which makes it dead food. High carbohydrate levels feed pathogenic bacteria, there are no live enzymes left, and chemical preservatives act like chemical napalm on beneficial flora.",
  },
  {
    name: "Glyphosate", icon: "☠️",
    detail: "Dogs carry the highest measured glyphosate levels of any animal — averaging 32 times more than humans. It's water-soluble and falls in rainwater globally. In the body it behaves like an antibiotic: it destroys the microbiome and tears apart tight cell junctions. Non-GMO crops sprayed at harvest to dry them — oats, peas, chickpeas, lentils — are why grain-free foods are so often saturated with it.",
  },
  {
    name: "Pharmaceutical overuse", icon: "💊",
    detail: "Metronidazole (Flagyl) is routinely overprescribed for diarrhoea and obliterates the microbiome's dark matter for months or permanently. Acid reducers like famotidine lower stomach acid, so proteins never break down into harmless amino acids — that directly causes severe food sensitivities. NSAIDs and steroids damage the lining too.",
  },
  {
    name: "Stress", icon: "😰",
    detail: "Anxiety in the dog AND in the owner triggers the fight-or-flight response, which halts digestion and promotes gut inflammation and permeability.",
  },
];

// Food that rebuilds it.
const GUT_FOODS: { food: string; detail: string }[] = [
  { food: "Fresh, species-appropriate food", detail: "Moving off processed kibble to fresh, raw or gently cooked meat-based food — with real variety across proteins, organs and raw parts — is what restores a diverse, species-rich microbiome." },
  { food: "Bone broth", detail: "The healing potion for the gut. Rich in collagen and gelatin, which directly seal and repair damaged intestinal membranes." },
  { food: "Fermented raw dairy", detail: "Raw goat's milk, raw cow's milk, fermented goat's milk kefir or ghee — natural viable probiotics and yeasts, easily absorbed without inflammatory risk." },
  { food: "Vegetable fibre", detail: "Small amounts of plants — pureed leafy greens, sweet potato, butternut squash — are the prebiotic. Lactobacillus and bacteroides REQUIRE plant fibre to survive, colonise and regulate the immune system." },
  { food: "Warm, never cold", detail: "The digestive system is the cooking pot, and it doesn't like cold. Food straight from the fridge freezes the digestive fire. Serve at room or body temperature." },
  { food: "Well-sourced fats", detail: "Fats from grass-fed, pasture-raised animals — pork lard, raw egg yolks — transport the fat-soluble gut-healing vitamins A, D and K2. Healthy raw fats do not cause pancreatitis; processed carbs, rancid fats and sugars do." },
];

// Protocols, including the one most people get wrong.
const GUT_PROTOCOLS: { name: string; icon: string; detail: string }[] = [
  {
    name: "Probiotic activation — do this, it matters", icon: "⏱️",
    detail: "Never dump dry freeze-dried probiotic capsules onto kibble; stomach acid destroys them. Open the capsule into a cup of full-fat probiotic yogurt, or bone broth with water, and let it sit at ROOM TEMPERATURE for 30–60 minutes to wake the bacteria up. Feed that liquid 30 minutes before the meal so it slips straight into the small intestine.",
  },
  {
    name: "The SIBO feeding schedule", icon: "🕐",
    detail: "Constant treating stops the gut cleaning itself. Leave 2.5 to 3 hours between meals and treats so the migrating motor complex — the gut's janitor — can sweep pathogens out of the small intestine. That's what prevents small intestinal bacterial overgrowth and the leaky gut behind it.",
  },
  {
    name: "Fecal microbiota transplant (FMT)", icon: "🏆",
    detail: "The gold standard for restoring diversity. Uses the entire fecal biome of a hyper-screened, multi-generational healthy donor dog, introducing billions of diverse bacteria, viruses, fungi and yeasts — eliminating antibiotic resistance and dramatically increasing diversity.",
  },
  {
    name: "S. boulardii + colostrum", icon: "🛡️",
    detail: "Rebuild the protective glycocalyx and the secretory IgA (sIgA) lining. Run it up to six months to prepare the gut wall so beneficial bacteria can actually adhere and colonise instead of passing straight through. S. boulardii also resolves acute diarrhoea, outperforming metronidazole.",
  },
  {
    name: "Humic & fulvic acid", icon: "🌱",
    detail: "Natural soil extracts that detoxify heavy metals, protect the lining from daily glyphosate damage, and help repair tight cell junctions.",
  },
  {
    name: "Digestive enzymes", icon: "⚗️",
    detail: "Vital on cooked diets, on kibble, and through any transition — they break proteins down and maximise absorption.",
  },
  {
    name: "Ozone therapy", icon: "💨",
    detail: "Rectal ozone insufflation beforehand oxygenates and heals intestinal tissue, creating a welcoming environment for newly introduced bacteria to colonise.",
  },
];

// Herbs, chosen by constitution rather than by symptom.
const GUT_HERBS: { group: string; icon: string; herbs: [string, string][] }[] = [
  {
    group: "For WARM dogs — hot-seeking, panting, red tongue", icon: "🔥",
    herbs: [
      ["Aloe, slippery elm, marshmallow root", "Demulcents. Form a soothing barrier that heals ulcerated pockets and calms inflammation."],
      ["Yarrow", "Treats histamine, dampness, pain, and the oesophageal sphincter relaxation behind acid reflux."],
      ["Plantain", "Brings heat down, heals wounds inside the gut, and helps good bacteria stick to the gut wall."],
      ["Cleavers", "Safely moves stagnant lymphatic fluid to clear fat-soluble toxins."],
    ],
  },
  {
    group: "For COOL dogs — blanket-loving, cold-sensitive", icon: "❄️",
    herbs: [
      ["Turmeric", "Warms the middle and improves phase-two liver detoxification."],
      ["Ginger", "Eases nausea, warms the digestive tract, and helps with both constipation and diarrhoea."],
      ["Calendula", "A bacteriostatic police officer that disperses pathogenic biofilms, and herbal sunshine for healing wounds inside the gut."],
    ],
  },
  {
    group: "Universal — any constitution", icon: "🌿",
    herbs: [
      ["Blackberry leaf", "A highly effective astringent that halts acute explosive diarrhoea and soothes leaky anal glands."],
      ["Milk thistle", "Protects liver pathways and drains liver heat."],
      ["Nettles", "Infuses vital minerals to get sluggish organs working again."],
      ["Lion's mane & tremella", "Soothe the nervous system, lower gut pain, and coat and seal tight junctions."],
    ],
  },
];


// ── TCVM FOOD THERAPY ────────────────────────────────────────────────────────
// Added 2026-08-22 from Kyle's TCVM food-therapy research. Companion image:
// assets/images/tcvm-energetic-bowl.jpg
//
// The framework: TCVM works energetically rather than mechanistically. Instead of
// suppressing a symptom, it identifies the underlying imbalance and restores
// harmony so the body heals itself. Food therapy is one of four pillars, and
// ingredients are chosen for thermal nature, preparation, and taste — each of
// which acts on specific organ systems.
const TCVM_PILLARS: [string, string][] = [
  ["Acupuncture", "Moves Chi through the meridians to clear stagnation."],
  ["Herbs", "Formulas matched to a pattern diagnosis, not to a symptom."],
  ["Tui-na", "Bodywork — manual therapy along the same meridians."],
  ["Food therapy", "The one you control three times a day. Whole foods chosen to rebalance."],
];

// Reading the dog in front of you. This is the step everything else depends on.
const TCVM_STATES: {
  state: string;
  icon: string;
  signs: string;
  meaning: string;
  feed: string;
}[] = [
  {
    state: "The HOT dog", icon: "🔥",
    signs: "Red ears, red eyes or tongue, panting, seeks cool surfaces and tile floors.",
    meaning: "Internal heat. Often shows up as allergies, hot spots, pancreatitis, IBD, hot joints, or what TCVM calls Liver Fire.",
    feed: "COOLING foods to clear the heat and add moisture.",
  },
  {
    state: "The COLD dog", icon: "❄️",
    signs: "Stiffness, chilly limbs, pale tongue, weak hind end, low energy, slow to get going in the morning.",
    meaning: "Chi or Yang deficiency — a lack of warmth and energy. Common in seniors and in dogs who struggle through winter.",
    feed: "WARMING, tonifying foods to boost circulation and energy.",
  },
];

// Thermal food lists. The practical core of the whole system.
const TCVM_FOOD_THERAPY: {
  temp: "Cooling" | "Warming" | "Neutral";
  icon: string;
  useFor: string;
  proteins: string;
  plants: string;
}[] = [
  {
    temp: "Cooling", icon: "🧊",
    useFor: "Allergies, red eyes, inflammation, and hot personalities.",
    proteins: "Duck, alligator, cod, rabbit, pork, pork kidney, scallops, clams, mussels, octopus, oysters, chicken egg whites.",
    plants: "Celery, cucumber, cabbage, dandelion greens, lettuce, mushrooms, radish, seaweed and kelp, spinach, broccoli, green beans, asparagus, cranberries, banana, mango, lemon, apple, aloe, green algae, flaxseed, peppermint, chamomile, coriander.",
  },
  {
    temp: "Warming", icon: "🔥",
    useFor: "Seniors, chronic weakness, cold-sensitive dogs, and cold personalities.",
    proteins: "Lamb, venison, goat, chicken, lean grass-fed beef, shrimp, sardines, wild-caught salmon.",
    plants: "Oats, sweet rice, cinnamon, ginger, sage, turmeric.",
  },
  {
    temp: "Neutral", icon: "⚖️",
    useFor: "Maintenance. Safe for any constitution.",
    proteins: "Beef, pork, turkey.",
    plants: "These hold balance without swinging body temperature in either direction — the default when you're unsure of the pattern.",
  },
];

// The Spleen/Stomach rules. Separated out because this is where most owners are
// unknowingly working against themselves every single day.
const TCVM_DIGESTION = {
  principle:
    "In TCVM the Spleen is not the physical organ — it's the whole process of taking food in, transforming it, absorbing it and moving it around. The Spleen system HATES cold and dampness. Both make Chi and Blood stagnate, which surfaces as acid reflux, IBD, burping, or flat energy.",
  serve:
    "Always thaw and warm food to room or body temperature. Cold or frozen food straight from the fridge dampens the stomach fire and makes digestion sluggish.",
  use: [
    ["Gently cooked fresh food", "Highly digestible — the right call for a sensitive or senior gut."],
    ["Warm oatmeal", "An excellent Chi tonic that restores the GI tract."],
    ["Ginger", "Warming. Resolves food stagnation, moves food out of the stomach, assists compromised digestion."],
    ["Sweet potato, yam, winter squash", "Butternut or acorn. Beneficial starches that help carb-dependent dogs hold weight and energy."],
  ] as [string, string][],
  avoid:
    "Cold or frozen food, refined carbohydrates (kibble, cookies), excess fat, and damp-promoting foods — dairy, peanut butter, heavy fats.",
};

// Organ-specific patterns. Liver gets the most detail because it produces the
// complaints owners actually walk in with.
const TCVM_ORGANS: {
  organ: string;
  element: string;
  rules: string;
  patterns: [string, string][];
}[] = [
  {
    organ: "Liver", element: "Wood Element",
    rules: "Rules the eyes, ears, paws and nails, and the tendons and ligaments.",
    patterns: [
      ["Liver Fire / stagnation — chronic ear infections, red gooey eyes, itchy feet, seizures", "Dandelion greens and root, or bitter greens like mustard greens, to drain heat and stagnation. Feed cooling proteins; avoid warming ones."],
      ["Liver Blood or Yin deficiency — dry eye, dry dandruff, brittle nails, ligament tears and blown cruciates", "Blood tonics to build and enrich the blood: very clean beef liver, bison heart and liver, egg yolks, dates, and dark leafy greens (kale, dandelion, kelp)."],
      ["Wind — seizures and itching", "Ground cicada casings (exoskeletons), the classic Chinese herbal addition used to calm internal wind."],
    ],
  },
  {
    organ: "Kidneys", element: "Water Element",
    rules: "Store the Jing (life essence) and rule the hindquarters, hearing and bones.",
    patterns: [
      ["Supporting Kidney Yin and Jing", "Black sesame seeds, chia seeds, and tremella mushrooms."],
    ],
  },
  {
    organ: "Lungs", element: "Metal Element",
    rules: "Rule the hair coat and the skin pores.",
    patterns: [
      ["Weak lungs — coughing, thin hair, respiratory stress", "Feed white foods and mushrooms."],
    ],
  },
];

// The three that change behaviour immediately.
const TCVM_CLINICAL: { title: string; icon: string; detail: string }[] = [
  {
    title: "The temperature rule", icon: "🌡️",
    detail: "Never feed frozen or cold food. The Spleen hates cold — food should be served at room or body temperature to avoid stagnation and acid reflux. This is the single easiest change most owners can make, and it costs nothing.",
  },
  {
    title: "The kibble problem", icon: "🍖",
    detail: "Dry kibble is energetically HOT and dehydrating. Long term that drives Yin deficiency and chronic inflammation — which is why a hot, itchy, allergic dog on kibble is such a common picture.",
  },
  {
    title: "Senior support for the aging Jing", icon: "💊",
    detail: "For seniors, supplement CoQ10 at 5–10 mg per pound twice daily, and vitamin D (tested by a vet), to support cognitive function and heart health.",
  },
];

// Eye diagnostics — each region maps to an organ system.
const TCVM_EYE: [string, string][] = [
  ["Pupil", "Kidney. Cataracts suggest Jing deficiency."],
  ["White / conjunctiva", "Heart. Deep red means Heart Heat."],
  ["Upper & lower eyelids", "Spleen. Drooping or squinting suggests Qi deficiency."],
  ["Inner corner", "Small and large intestine. Watch for discharge or inflammation."],
  ["Outer corner", "Liver. Redness or a toxic brick-red colour."],
];



const MEDICINAL_MUSHROOMS: {
  name: string;
  latin: string;
  headline: string;
  actives: string;
  body: string;
  useFor: string;
}[] = [
  {
    name: "Turkey Tail", latin: "Trametes versicolor",
    headline: "The cancer fighter",
    actives: "PSP and PSK (polysaccharopeptides) — the highest beta-glucan content of the group",
    body: "The powerhouse for immune modulation, and the most famous of the medicinal mushrooms for a reason. It is best known for its role against haemangiosarcoma, where studies show it extends survival times in dogs with this aggressive cancer. It also supports the gut as a prebiotic, and helps regenerate bone marrow — the red and white blood cells that chemotherapy depletes.",
    useFor: "Cancer support, immune modulation, gut health, and recovery of blood counts during and after chemotherapy.",
  },
  {
    name: "Reishi", latin: "Ganoderma lucidum",
    headline: "The natural antihistamine",
    actives: "Beta-glucans, triterpenes (ganoderic acids)",
    body: "Known as the Mushroom of Immortality. It is highly effective for allergies because its terpenes stabilise mast cell membranes — the cells that release histamine — which is what makes it act as a natural antihistamine. It also supports the liver and heart, and has a centering, calming effect on an anxious dog.",
    useFor: "Allergies and itch, anxiety and reactivity, liver and heart support. The one to reach for in an itchy, wound-up dog.",
  },
  {
    name: "Lion's Mane", latin: "Hericium erinaceus",
    headline: "The brain booster",
    actives: "Hericenones (fruiting body), erinacines (mycelium)",
    body: "Stimulates Nerve Growth Factor, which makes it the primary choice for canine cognitive dysfunction — dog dementia — and for neurological conditions such as degenerative myelopathy. It also has a long history of use for digestive health, including IBD and gastritis.",
    useFor: "Cognitive decline and dementia in seniors, nerve and spinal support, and inflammatory gut conditions.",
  },
  {
    name: "Cordyceps", latin: "Cordyceps militaris",
    headline: "The kidney guardian",
    actives: "Cordycepin, adenosine, beta-glucans",
    body: "A vital mushroom for kidney health — it has been shown to lower creatinine and protect the kidneys from damage. It also benefits the lungs, helping with asthma and chronic cough, and acts as an adaptogen that helps the body manage stress and adrenal problems such as Cushing's disease.",
    useFor: "Chronic kidney disease, respiratory conditions, adrenal and stress support, stamina in working or ageing dogs.",
  },
  {
    name: "Chaga", latin: "Inonotus obliquus",
    headline: "The antioxidant powerhouse",
    actives: "Betulinic acid, melanin, beta-glucans, very high polyphenol content",
    body: "One of the most antioxidant-rich foods available. It supports the immune system and fights inflammation and oxidative stress, and is often used for bladder issues, asthma, and as part of a cancer-fighting protocol. Along with reishi it helps harmonise an overactive immune system.",
    useFor: "Chronic inflammation, oxidative stress, bladder support, and as part of a cancer protocol.",
  },
  {
    name: "Maitake", latin: "Grifola frondosa",
    headline: "The immune specialist",
    actives: "D-fraction and MD-fraction beta-glucans",
    body: "Used for immune support, and specifically noted for its potential in treating canine lymphoma. Alongside turkey tail and reishi it stimulates the immune system to target the uncontrolled cell growth behind cancer.",
    useFor: "Immune support and lymphoma. Also a food mushroom, so it can simply be cooked into the bowl.",
  },
  {
    name: "Shiitake", latin: "Lentinula edodes",
    headline: "The dental one",
    actives: "Lentinan (beta-glucan), eritadenine",
    body: "In addition to immune support, shiitake has anti-gingivitis properties, which makes it useful for dental health — a rare thing to get from a supplement rather than a toothbrush.",
    useFor: "Everyday immune support and gum health. A normal culinary mushroom, so the cheapest way in.",
  },
  {
    name: "Snow Mushroom", latin: "Tremella fuciformis",
    headline: "The hydrator",
    actives: "Tremella polysaccharides",
    body: "Contains polysaccharides similar to hyaluronic acid, which aid hydration and skin health. It also offers cognitive benefits, and pairs with lion's mane for an ageing brain — including reducing sundowner symptoms in seniors.",
    useFor: "Dry skin and coat, hydration, and cognitive support in older dogs.",
  },
  {
    name: "Golden Oyster", latin: "Pleurotus citrinopileatus",
    headline: "The longevity one",
    actives: "Ergothioneine, beta-glucans",
    body: "An exceptional source of ergothioneine, a potent antioxidant that supports mitochondrial function and longevity. Mushrooms are far and away the richest dietary source of it, and the oyster family sits at the top of that list.",
    useFor: "Everyday antioxidant and mitochondrial support, and health span in an ageing dog.",
  },
  {
    name: "Button / Crimini", latin: "Agaricus bisporus",
    headline: "The one already in your fridge",
    actives: "Beta-glucans, ergothioneine, conjugated linoleic acid",
    body: "Even common grocery store mushrooms provide real medicinal value. Consuming just a small amount daily may help prevent certain cancers and support the microbiome. ⚠️ These must be COOKED — sauté or steam for 15–20 minutes to break down the tough cell walls so your dog can actually absorb the nutrients.",
    useFor: "Daily whole-food immune and microbiome support at grocery-store cost.",
  },
];

// Practitioner dosing. Deliberately separated from the species table above,
// because it comes from a different KIND of source: holistic veterinary practice
// (Dr. Judy Morgan and others), not from the trials. None of the studies cited
// above establish a dose for a dog — so presenting these as trial-derived would
// be dishonest. They're a starting point used in the field, labelled as such.
const MUSHROOM_DOSING: { level: string; amount: string; note: string }[] = [
  {
    level: "Wellness / prevention",
    amount: "⅛ tsp powder per 10–20 lb, once daily",
    note: "The everyday amount. Works by accumulation over weeks and months, not by dose — consistency beats quantity here.",
  },
  {
    level: "Moderate illness",
    amount: "¼ tsp per 20 lb, once daily",
    note: "Stepped up for an active problem, alongside veterinary treatment rather than instead of it.",
  },
  {
    level: "Serious illness (e.g. cancer)",
    amount: "¼–½ tsp twice daily, or up to 100 mg per 10 lb",
    note: "The therapeutic end, used for acute conditions like cancer or severe infection.",
  },
];

// When a dog most benefits. Mushrooms work at any life stage, but these are the
// three windows where they earn their place.
const MUSHROOM_WHEN: { stage: string; why: string }[] = [
  { stage: "Puppyhood", why: "Supports a developing immune system and helps establish a healthy microbiome from the start." },
  { stage: "Senior years", why: "Combats cognitive decline, supports organ function, and helps prevent cancer." },
  { stage: "Illness", why: "Higher doses for acute conditions — cancer, severe infection, organ disease." },
];

// How they work against specific disease patterns.
const MUSHROOM_DISEASE: { area: string; detail: string }[] = [
  { area: "Cancer", detail: "Turkey tail, reishi and maitake stimulate the immune system to target uncontrolled cell growth. They also help regenerate the bone marrow — red and white blood cells — that chemotherapy depletes." },
  { area: "Allergies & autoimmune", detail: "Reishi and chaga harmonise an overactive immune system. Their terpenes stabilise the cells that release histamine, reducing itching and inflammation." },
  { area: "Cognitive decline", detail: "Lion's mane and tremella support brain health, helping senior dogs stay focused and reducing sundowner symptoms." },
  { area: "Organ support", detail: "Cordyceps is the primary choice for renal disease. Reishi and chaga are the ones for bladder and liver." },
];

const COLLAGEN_TYPES: {
  type: string;
  share: string;
  jobs: string;
  sources: string;
  dose: string;
  best: string;
}[] = [
  {
    type: "Type I",
    share: "~90% of the body's collagen",
    jobs: "Skin, tendons, ligaments, bone, teeth, blood vessel walls",
    sources: "Bovine hide, fish skin and scales (marine collagen is almost all Type I), chicken feet, eggshell membrane",
    dose: "Hydrolyzed peptides, grams per day — it's a raw material, so you need real quantity",
    best: "Coat and skin quality, nail and paw pad condition, tendon and ligament support, recovery in active dogs.",
  },
  {
    type: "Type II",
    share: "The cartilage one",
    jobs: "Articular cartilage — the surface inside joints",
    sources: "Chicken sternum and cartilage, trachea, poultry necks and feet",
    dose: "TWO forms, and they are not interchangeable — see below",
    best: "Joints. This is the one to reach for with stiffness, arthritis, or a large-breed dog you're getting ahead of.",
  },
  {
    type: "Type III",
    share: "Usually alongside Type I",
    jobs: "Skin elasticity, blood vessels, organ and gut structure",
    sources: "Bovine, almost always paired with Type I in the same product",
    best: "Comes along for the ride with Type I. Relevant to gut lining and vascular health rather than something you'd buy on its own.",
    dose: "Hydrolyzed, grams per day, generally combined with Type I",
  },
];

const OMEGA3_TYPES: {
  code: string;
  name: string;
  chain: string;
  job: string;
  sources: string;
  verdict: "best" | "good" | "weak";
  note: string;
}[] = [
  {
    code: "EPA", name: "Eicosapentaenoic acid", chain: "20:5", verdict: "best",
    job: "The anti-inflammatory one",
    sources: "Fish oil, krill, algae, sardines",
    note: "Competes with arachidonic acid for the same enzymes, so it displaces inflammatory signalling at the source. This is the one doing the work for joints, skin, allergies, lipomas and kidney disease. If you're supplementing for inflammation, EPA is the number to read first.",
  },
  {
    code: "DHA", name: "Docosahexaenoic acid", chain: "22:6", verdict: "best",
    job: "The structural one",
    sources: "Fish oil, algae, krill",
    note: "A physical building block of brain, retina and nerve membranes rather than a signalling molecule. Matters most for puppies (brain development), seniors (cognitive decline) and eye health. Less about inflammation than EPA.",
  },
  {
    code: "DPA", name: "Docosapentaenoic acid", chain: "22:5", verdict: "good",
    job: "The overlooked bridge",
    sources: "Fatty fish, mother's milk, seal oil",
    note: "Sits between EPA and DHA and converts to either as the body needs, so it works as a reservoir. Far less studied than the other two and rarely listed on labels, but it shares much of their activity.",
  },
  {
    code: "ETA", name: "Eicosatetraenoic acid", chain: "20:4 n-3", verdict: "good",
    job: "The rare dual-pathway one",
    sources: "Almost exclusively green lipped mussel",
    note: "Unusual because it inhibits BOTH the COX and LOX inflammatory pathways — most omega-3s only affect COX. That mechanism is documented and is the genuine reason green lipped mussel behaves differently from fish oil. ⚠️ Treat the big potency multipliers in supplement marketing with caution; the mechanism is real, head-to-head canine trials proving a specific multiple are not.",
  },
  {
    code: "SDA", name: "Stearidonic acid", chain: "18:4", verdict: "good",
    job: "The better plant option",
    sources: "Echium, blackcurrant seed, hemp (trace)",
    note: "A plant omega-3 that skips the slow first step in the conversion chain, so it reaches EPA far more efficiently than ALA does. Rare in pet food, but the one plant source worth knowing about.",
  },
  {
    code: "ALA", name: "Alpha-linolenic acid", chain: "18:3", verdict: "weak",
    job: "The plant one dogs convert badly",
    sources: "Flaxseed, chia, hemp, walnut, canola",
    note: "Essential, and not useless — but a dog must convert it to EPA and DHA, and converts well under 10% (less again to DHA). It counts fully toward the omega-3 figure on a label, which is exactly how a flax-heavy food advertises a great ratio while delivering little usable omega-3.",
  },
];


// ── THE OMEGA GUIDE ──────────────────────────────────────────────────────────
// Added 2026-08-22 from Kyle's omega research. Replaces the previous omega
// education wholesale. Companion image: assets/images/omega-guide.jpg.
//
// The through-line: dogs cannot make these fats, processed food is drowning in
// omega-6 and starved of omega-3, and the SOURCE decides how much your dog can
// actually use.

// Why they matter — what omega-3 is doing in the body, system by system.
const OMEGA_BENEFITS: { area: string; icon: string; detail: string }[] = [
  {
    area: "Skin & coat", icon: "✨",
    detail: "Highly effective at preventing and managing allergic skin disease. Targets dry skin, hair loss, constant scratching, paw chewing and itching directly.",
  },
  {
    area: "Joints & mobility", icon: "🦴",
    detail: "Relieves joint pain and reduces inflammation in dogs with arthritis.",
  },
  {
    area: "Brain & cognition", icon: "🧠",
    detail: "Crucial for senior brain health. Markedly improves signs of cognitive dysfunction — pacing, altered sleep patterns, barking at walls, changed interaction with owners.",
  },
  {
    area: "Heart & organs", icon: "❤️",
    detail: "Reduces systemic inflammation, decreases the risk of dangerous arrhythmias, and lowers high triglycerides. Normalises fat metabolism, which makes omega-3 highly beneficial for pancreatitis and fatty liver disease.",
  },
  {
    area: "Gut lining", icon: "🛡️",
    detail: "EPA and DHA embed directly into the cell walls of the gut, reinforcing the lining like a strong mesh strainer. That's what stops toxic substances passing through and causing leaky gut and the immune imbalance that follows.",
  },
  {
    area: "Cancer", icon: "🎗️",
    detail: "Acts as a receptor agonist that decreases inflammatory responses, improves chemotherapy efficacy, and enhances survival and quality of life. DHA can also be directly cytotoxic to cancer cells — growing in acidic microenvironments they take in too much DHA and essentially engorge themselves to death.",
  },
];

// Source comparison. This is the section that actually changes what someone buys.
const OMEGA_SOURCES: {
  name: string;
  kind: "marine" | "plant" | "shellfish";
  verdict: "best" | "good" | "caution";
  headline: string;
  detail: string;
}[] = [
  {
    name: "Krill oil", kind: "marine", verdict: "best",
    headline: "The most bioavailable, and the cleanest",
    detail: "Significantly more bioavailable and more easily absorbed in the intestinal tract than standard fish oil — so you need a much lower dose for the same therapeutic effect. Krill sits very low on the food chain, so it has virtually no detectable toxins, and it contains only moderate, safe levels of vitamin A, meaning no toxicity risk.",
  },
  {
    name: "Fish oil", kind: "marine", verdict: "good",
    headline: "Effective, but it comes with rules",
    detail: "A direct, effective source of EPA and DHA for general systemic health. But it carries handling requirements green-lipped mussel doesn't: contamination risk from mercury and PCBs when sourced from higher up the food chain, rapid oxidation, and a bleeding-time effect that matters before surgery. Buy one verified as tested for contaminants, or use a lower food-chain option like krill.",
  },
  {
    name: "Algal oil", kind: "marine", verdict: "best",
    headline: "The sustainable DHA source",
    detail: "Exceptionally heavy in DHA and sourced directly from the algae at the very bottom of the food chain — the same algae the fish eat. Highly direct, pure and sustainable, with no toxin accumulation. The strongest choice where brain and eye health is the goal.",
  },
  {
    name: "Green-lipped mussel", kind: "shellfish", verdict: "best",
    headline: "The joint and mobility specialist",
    detail: "Heavily favoured in canine therapeutic formulations as a specialised joint and mobility aid, typically paired with deer antler velvet, chondroitin and ginseng to target heart health and severe mobility issues in senior dogs. Sits low on the food chain, so virtually no toxins — and it doesn't carry fish oil's storage and surgical cautions.",
  },
  {
    name: "Ahiflower oil", kind: "plant", verdict: "good",
    headline: "The plant option that actually works",
    detail: "The answer for a dog who can't tolerate marine sources. Unlike flax it contains SDA (stearidonic acid), which bypasses the conversion bottleneck and converts to EPA four times better than the ALA in flaxseed. Sustainable and plant-based.",
  },
  {
    name: "Flax · sesame · sunflower", kind: "plant", verdict: "caution",
    headline: "The conversion bottleneck",
    detail: "Dogs lack the efficient biological pathways needed to convert plant-based ALA into the active forms EPA and DHA. A food listing flaxseed as its omega-3 source has not given your dog meaningful EPA or DHA. Marine sources providing direct, pre-formed EPA and DHA are far more biologically valuable.",
  },
  {
    name: "Cod liver oil", kind: "marine", verdict: "caution",
    headline: "⚠️ Vitamin A toxicity risk",
    detail: "Made from the LIVER of the fish, where vitamins are heavily concentrated. Using cod liver oil as a general omega-3 source carries a high risk of vitamin A toxicity — malaise, peeling skin, tremors, convulsions, paralysis, and even death. Salmon and krill oils contain safe, moderate levels. Do not use cod liver oil as your everyday omega source.",
  },
];

// Dosing, straight off the guide.
const OMEGA_DOSING: { level: string; amount: string }[] = [
  { level: "Standard health (EPA/DHA)", amount: "30–60 mg per pound of body weight" },
  { level: "Therapeutic (arthritis / inflammation)", amount: "1,000 mg of oil per 10 lb of body weight" },
  { level: "Krill oil", amount: "500 mg per 20 lb of body weight, daily" },
  { level: "Fish oil", amount: "1,000 mg per 20 lb of body weight, daily" },
];

// The safety-first protocol. Every one of these has a real consequence attached.
const OMEGA_SAFETY: { rule: string; icon: string; detail: string }[] = [
  {
    rule: "The freshness rule — a 4-week window", icon: "🕐",
    detail: "Oils oxidise and become rancid quickly, and rancid oil is highly toxic — it causes the very inflammation and bodily damage you're trying to treat. Buy smaller bottles, use within 4 weeks of opening, and discard immediately if a strong fishy odour develops.",
  },
  {
    rule: "Storage and packaging matter", icon: "🧊",
    detail: "Keep it cool and dark. Refrigerate once opened. Store in dark glass or brushed aluminium — never plastic, which can leach chemicals into the oil.",
  },
  {
    rule: "Stop 7–14 days before surgery", icon: "🩺",
    detail: "Fish oil decreases platelet stickiness and delays clotting time, making it a modest blood thinner. It must be stopped 7 to 14 days before any scheduled surgery to prevent excess bleeding.",
  },
  {
    rule: "Give it with fatty food", icon: "🍽️",
    detail: "Always administer omega-3 with some food in the stomach — specifically food containing healthy fats, such as safflower oil. This markedly increases absorption.",
  },
];

// How much EPA+DHA each fish actually carries, per 100 g of flesh. The reason
// this table exists: "feed fish" is useless advice when the spread between the
// best and worst choice is fifteen-fold. Figures are approximate — fat content
// varies with season, wild vs farmed, and water temperature — but the ORDER is
// stable and that's what a decision needs.
//
// Mercury is tracked separately because the two don't correlate: the highest
// omega-3 fish are mostly LOW mercury, and the worst mercury offenders are
// mediocre omega-3 sources. There is no trade-off to manage — the good choices
// are good on both axes.
const FISH_EPA_DHA: {
  fish: string;
  mg: string;
  mercury: "low" | "moderate" | "high";
  verdict: "best" | "good" | "limited";
  note: string;
}[] = [
  {
    fish: "Mackerel (Atlantic)", mg: "2,670", mercury: "low", verdict: "best",
    note: "The richest common fish there is, and low in mercury. ⚠️ ATLANTIC mackerel only — KING mackerel is a completely different fish and one of the highest-mercury species in the sea. The names are close enough that this mix-up is common and it genuinely matters.",
  },
  {
    fish: "Salmon (wild sockeye)", mg: "2,150", mercury: "low", verdict: "best",
    note: "Excellent, and the astaxanthin that makes it red is a potent antioxidant in its own right. Wild beats farmed here — farmed salmon are raised on grain-based feed and carry noticeably more omega-6.",
  },
  {
    fish: "Herring", mg: "1,730", mercury: "low", verdict: "best",
    note: "Underrated and cheap. Small, short-lived, oily — everything you want. Often sold pickled, which adds salt; look for plain.",
  },
  {
    fish: "Sardines", mg: "1,480", mercury: "low", verdict: "best",
    note: "The most practical option for most owners: shelf-stable, cheap, portion-sized, and eaten whole so you get bone calcium and organ nutrients alongside the oil. Choose water-packed with no added salt.",
  },
  {
    fish: "Anchovies", mg: "1,400", mercury: "low", verdict: "best",
    note: "Tiny and short-lived, which is why nearly every high-potency fish oil is built from them. Whole anchovies are usually heavily salted — the oil is the practical form.",
  },
  {
    fish: "Rainbow trout", mg: "~1,000–1,250", mercury: "low", verdict: "good",
    note: "A solid mid-tier option. Freshwater, farmed responsibly in most places, and mild enough that picky dogs accept it.",
  },
  {
    fish: "Tuna (albacore/white)", mg: "~700–1,000", mercury: "high", verdict: "limited",
    note: "Decent omega-3, but albacore is a large predatory fish that accumulates mercury for years. The omega-3 doesn't justify the exposure when sardines deliver more for less risk. Occasional is fine; daily is not.",
  },
  {
    fish: "Tuna (canned light)", mg: "~150–300", mercury: "moderate", verdict: "limited",
    note: "The worst of both worlds — a fraction of the omega-3 of sardines, with more mercury. Popular because it's familiar, not because it's good. There's no reason to choose this over sardines.",
  },
  {
    fish: "Cod", mg: "~175", mercury: "low", verdict: "limited",
    note: "A lean whitefish — fine protein, negligible omega-3. Note this is the FLESH: cod LIVER oil is a different product entirely, concentrated in omega-3 but also in vitamin A and D, which accumulate.",
  },
];

// ── DEFICIENCY CHECKLIST ─────────────────────────────────────────────────────
// Organised by WHAT AN OWNER SEES, not by nutrient — because nobody notices
// "zinc deficiency", they notice crusting around the muzzle. A nutrient-first
// list only works for someone who already suspects the answer.
//
// Companion to DEFICIENCY_SIGNS, which stays nutrient-first for reference.
//
// urgency: "urgent" = today · "soon" = book an appointment · "watch" = mention
// it at the next visit and look for a pattern first.
const DEFICIENCY_CHECKLIST: {
  area: string;
  emoji: string;
  signs: { see: string; likely: string; urgency: "urgent" | "soon" | "watch"; note: string }[];
}[] = [
  {
    area: "Brain & nerves", emoji: "🧠",
    signs: [
      {
        see: "Wobbling, seizures, head tilt, circling, disorientation",
        likely: "Thiamine (B1)", urgency: "urgent",
        note: "The one genuine emergency on this whole list. Thiamine deficiency damages the brain and can kill, but it reverses fast if caught. Causes: sulfite-preserved meat rolls, a diet built mostly on raw fish, or heavily processed food without enough added back. Don't wait to see if it settles.",
      },
      {
        see: "Weakness in the back end, wobbly gait, muscle tremors",
        likely: "Vitamin E, B12", urgency: "soon",
        note: "Slow-developing rather than sudden. Worth distinguishing from arthritis and from normal age — a deficiency version usually comes with coat or energy changes too.",
      },
    ],
  },
  {
    area: "Coat & skin", emoji: "🐕",
    signs: [
      {
        see: "Dull, dry, brittle coat · flaking · more shedding than usual",
        likely: "Omega-3, omega-6, vitamin E", urgency: "watch",
        note: "The most common thing on this list AND the most over-diagnosed. Season, bathing, sun, swimming and allergies all cause exactly this. If a dog is otherwise well, try 8 weeks of fish oil before assuming anything — that's both the likeliest fix and the cheapest test.",
      },
      {
        see: "Crusting and scaling AROUND THE MUZZLE, EYES, EARS — symmetric, often with hair loss",
        likely: "Zinc", urgency: "soon",
        note: "This specific pattern is what zinc deficiency looks like: FACE FIRST, both sides equally, then footpads and pressure points. Crusty ELBOWS on their own are almost always just a callus from lying on hard floors — that's not this. Northern breeds are most prone.",
      },
      {
        see: "Coat colour fading — black going rusty, dark going pale",
        likely: "Copper", urgency: "watch",
        note: "Copper is needed to make the pigment in dark fur, so a genuine shortage shows as colour loss. Sun bleaching does the same thing and is far more common — check whether it's only the sun-exposed areas.",
      },
      {
        see: "Cuts and scrapes healing slowly",
        likely: "Zinc, protein", urgency: "watch",
        note: "Rarely appears alone. If healing is slow AND the coat is poor AND there's crusting, that's a more meaningful cluster than any one sign.",
      },
    ],
  },
  {
    area: "Energy & muscle", emoji: "⚡",
    signs: [
      {
        see: "Pale gums, tiring quickly, weakness",
        likely: "Iron, B12, copper", urgency: "soon",
        note: "Pale gums means anaemia until proven otherwise, and anaemia has causes far more common than diet — bleeding, parasites, tick disease. Check the gums against your own; they should be bubblegum pink.",
      },
      {
        see: "Muscle loss over the spine and hind end despite eating well",
        likely: "Protein, vitamin E", urgency: "soon",
        note: "Some muscle loss is normal with age. Losing it while eating normally is not, and it's worth a vet visit for reasons beyond nutrition.",
      },
    ],
  },
  {
    area: "Heart", emoji: "❤️",
    signs: [
      {
        see: "Coughing at night, tiring on walks he used to manage, fainting after excitement",
        likely: "Taurine", urgency: "urgent",
        note: "Taurine-deficient heart disease (DCM) is reversible if caught early and fatal if it isn't. Highest risk on legume-heavy grain-free food, in Goldens, and on lamb-and-rice diets. Heart meat and organ-rich diets are protective. Coughing plus exercise intolerance together is a same-week vet call.",
      },
    ],
  },
  {
    area: "Bones & joints", emoji: "🦴",
    signs: [
      {
        see: "Limping with no injury · reluctance to jump · bowed legs in a puppy",
        likely: "Calcium, vitamin D, Ca:P imbalance", urgency: "urgent",
        note: "In a GROWING dog this is an emergency — skeletal damage from an all-meat diet becomes permanent quickly. In an adult it develops slowly. The classic cause is home-cooked food with no calcium source, since muscle meat is nearly calcium-free and phosphorus-rich.",
      },
    ],
  },
  {
    area: "Gut & appetite", emoji: "🥣",
    signs: [
      {
        see: "Long-running loose stool with weight loss",
        likely: "B12, folate, zinc", urgency: "soon",
        note: "Usually the RESULT of gut disease rather than the cause — a damaged gut stops absorbing B12. Either way it needs looking at, and B12 is easy and cheap to measure.",
      },
      {
        see: "Appetite dropping off for no clear reason",
        likely: "Thiamine, zinc, B vitamins", urgency: "soon",
        note: "Non-specific on its own. It matters most as an EARLY sign — appetite often goes before anything visible, especially with thiamine.",
      },
    ],
  },
  {
    area: "Whole-body & metabolic", emoji: "⚖️",
    signs: [
      {
        see: "Weight gain on the same food · seeking heat · thinning coat · low energy",
        likely: "Iodine (thyroid)", urgency: "soon",
        note: "Both too little AND too much iodine cause thyroid disease — the safe window is narrower than people assume, which is why eyeballing kelp powder is a bad idea. This cluster is worth a T4 test; it's cheap and usually on a senior panel already.",
      },
    ],
  },
];

// Said before the checklist, deliberately. A list of deficiency signs handed to
// a worried owner without this framing does more harm than good.
const DEFICIENCY_CONTEXT = [
  {
    h: "Most dogs will never have one",
    b: "If your dog eats a complete-and-balanced commercial food, true nutrient deficiency is genuinely rare — the profile was formulated to prevent exactly this. This checklist matters most for HOME-COOKED and RAW diets, long-term single-food feeding, dogs with absorption problems, and after months on an unbalanced homemade recipe.",
  },
  {
    h: "Every sign here has commoner explanations",
    b: "Dry coat is far more often season, bathing, sun, swimming, fleas or allergies than any deficiency. Slow healing is more often age or infection. Pale gums are more often bleeding or parasites. Read this list as 'these are worth ruling out', never as 'this is what it is'.",
  },
  {
    h: "Clusters matter more than single signs",
    b: "One sign on its own is weak evidence. Dry coat AND slow healing AND crusting at the muzzle together is a pattern worth acting on. A single dull coat in August on a dog who swims is a dog who swims.",
  },
  {
    h: "Blood tests mostly won't answer this",
    b: "A standard senior panel does NOT include zinc, copper, selenium, iodine, vitamin A, vitamin D or most B vitamins — those need separately ordered assays. And blood levels of many minerals stay normal while body stores fall, because the body pulls from tissue to hold the blood level steady. Vitamin D (25-OH), B12 and taurine are the ones where a test genuinely tells you something.",
  },
];

// ── INGREDIENT COMPOSITION DATABASE ──────────────────────────────────────────
// Per 100 g raw, edible portion. Values are standard food-composition figures
// (USDA FoodData Central reference ranges).
//
// ⚠️ PROVENANCE — READ BEFORE RELYING ON THIS COMMERCIALLY.
// These are reference-table values entered by hand, not pulled live from a
// verified database. They are good enough to catch a bowl that is badly short on
// calcium or choline. They are NOT good enough to certify a diet as complete, and
// they should be re-verified against USDA FDC record-by-record before any version
// of this is sold or used to formulate for someone else's dog.
//
// Nutrients chosen deliberately: these are the ones the literature says actually
// fail in home diets. Adding twenty more fields would look more authoritative
// while catching nothing extra.
//
// ca/p/choline in mg · vitD in IU · vitE in mg · zinc in mg · all per 100 g
const INGREDIENT_DB: {
  name: string;
  cat: "meat" | "organ" | "fish" | "egg" | "calcium" | "veg" | "extra";
  kcal: number; protein: number; fat: number;
  ca: number; p: number; vitD: number; vitE: number; zinc: number; choline: number;
}[] = [
  // ── MUSCLE MEAT ──
  { name: "Beef, lean ground (85%)", cat: "meat", kcal: 215, protein: 18.6, fat: 15, ca: 18, p: 175, vitD: 2, vitE: 0.2, zinc: 4.5, choline: 65 },
  { name: "Beef heart", cat: "meat", kcal: 112, protein: 17.7, fat: 3.9, ca: 7, p: 212, vitD: 0, vitE: 0.3, zinc: 1.7, choline: 194 },
  { name: "Chicken thigh, boneless", cat: "meat", kcal: 177, protein: 18.5, fat: 11, ca: 8, p: 160, vitD: 2, vitE: 0.3, zinc: 1.5, choline: 70 },
  { name: "Chicken breast", cat: "meat", kcal: 120, protein: 22.5, fat: 2.6, ca: 5, p: 213, vitD: 1, vitE: 0.2, zinc: 0.7, choline: 82 },
  { name: "Turkey, ground", cat: "meat", kcal: 148, protein: 19.7, fat: 7.4, ca: 14, p: 200, vitD: 3, vitE: 0.2, zinc: 2.4, choline: 75 },
  { name: "Lamb, lean", cat: "meat", kcal: 202, protein: 19.5, fat: 13, ca: 10, p: 175, vitD: 1, vitE: 0.2, zinc: 3.9, choline: 78 },
  { name: "Pork, lean loin", cat: "meat", kcal: 143, protein: 21, fat: 5.9, ca: 16, p: 216, vitD: 20, vitE: 0.2, zinc: 1.9, choline: 82 },
  // ── ORGANS ──
  { name: "Beef liver", cat: "organ", kcal: 135, protein: 20.4, fat: 3.6, ca: 5, p: 387, vitD: 16, vitE: 0.4, zinc: 4, choline: 333 },
  { name: "Chicken liver", cat: "organ", kcal: 116, protein: 16.9, fat: 4.8, ca: 8, p: 297, vitD: 0, vitE: 0.7, zinc: 2.7, choline: 194 },
  { name: "Beef kidney", cat: "organ", kcal: 99, protein: 17.4, fat: 3.1, ca: 13, p: 257, vitD: 0, vitE: 0.2, zinc: 1.9, choline: 513 },
  { name: "Beef spleen", cat: "organ", kcal: 105, protein: 18.3, fat: 3, ca: 10, p: 296, vitD: 0, vitE: 0.3, zinc: 2.1, choline: 100 },
  // ── FISH ──
  { name: "Sardines, canned w/ bones", cat: "fish", kcal: 208, protein: 24.6, fat: 11.5, ca: 382, p: 490, vitD: 193, vitE: 2, zinc: 1.3, choline: 75 },
  { name: "Salmon, wild", cat: "fish", kcal: 142, protein: 19.8, fat: 6.3, ca: 12, p: 200, vitD: 441, vitE: 1.1, zinc: 0.6, choline: 91 },
  { name: "Mackerel, Atlantic", cat: "fish", kcal: 205, protein: 18.6, fat: 13.9, ca: 12, p: 217, vitD: 643, vitE: 1.5, zinc: 0.6, choline: 65 },
  // ── EGG ──
  { name: "Egg, whole", cat: "egg", kcal: 143, protein: 12.6, fat: 9.5, ca: 56, p: 198, vitD: 82, vitE: 1.1, zinc: 1.3, choline: 294 },
  { name: "Egg yolk", cat: "egg", kcal: 322, protein: 15.9, fat: 26.5, ca: 129, p: 390, vitD: 218, vitE: 2.6, zinc: 2.3, choline: 820 },
  // ── CALCIUM SOURCES ──
  { name: "Eggshell powder", cat: "calcium", kcal: 0, protein: 0, fat: 0, ca: 38000, p: 120, vitD: 0, vitE: 0, zinc: 0, choline: 0 },
  { name: "Bone meal (feed grade)", cat: "calcium", kcal: 0, protein: 0, fat: 0, ca: 24000, p: 12000, vitD: 0, vitE: 0, zinc: 0, choline: 0 },
  { name: "Chicken neck, raw w/ bone", cat: "calcium", kcal: 172, protein: 14.9, fat: 12, ca: 1200, p: 700, vitD: 1, vitE: 0.2, zinc: 1.6, choline: 55 },
  // ── VEGETABLES ──
  { name: "Kale", cat: "veg", kcal: 49, protein: 4.3, fat: 0.9, ca: 150, p: 92, vitD: 0, vitE: 1.5, zinc: 0.6, choline: 0 },
  { name: "Broccoli", cat: "veg", kcal: 34, protein: 2.8, fat: 0.4, ca: 47, p: 66, vitD: 0, vitE: 0.8, zinc: 0.4, choline: 19 },
  { name: "Carrot", cat: "veg", kcal: 41, protein: 0.9, fat: 0.2, ca: 33, p: 35, vitD: 0, vitE: 0.7, zinc: 0.2, choline: 9 },
  { name: "Butternut squash", cat: "veg", kcal: 45, protein: 1, fat: 0.1, ca: 48, p: 33, vitD: 0, vitE: 1.4, zinc: 0.2, choline: 10 },
  { name: "Spinach", cat: "veg", kcal: 23, protein: 2.9, fat: 0.4, ca: 99, p: 49, vitD: 0, vitE: 2, zinc: 0.5, choline: 19 },
  { name: "Pumpkin, canned plain", cat: "veg", kcal: 34, protein: 1.1, fat: 0.3, ca: 26, p: 42, vitD: 0, vitE: 1.1, zinc: 0.2, choline: 8 },
  { name: "Sweet potato, cooked", cat: "veg", kcal: 90, protein: 2, fat: 0.2, ca: 38, p: 54, vitD: 0, vitE: 0.7, zinc: 0.3, choline: 13 },
  // ── EXTRAS ──
  { name: "Pumpkin seeds", cat: "extra", kcal: 559, protein: 30, fat: 49, ca: 46, p: 1233, vitD: 0, vitE: 0.6, zinc: 7.8, choline: 63 },
  { name: "Sunflower seeds", cat: "extra", kcal: 584, protein: 21, fat: 51, ca: 78, p: 660, vitD: 0, vitE: 35, zinc: 5, choline: 55 },
  { name: "Yogurt, plain whole", cat: "extra", kcal: 61, protein: 3.5, fat: 3.3, ca: 121, p: 95, vitD: 0, vitE: 0.1, zinc: 0.6, choline: 15 },
  { name: "Green lipped mussel powder", cat: "extra", kcal: 350, protein: 60, fat: 8, ca: 800, p: 700, vitD: 0, vitE: 1, zinc: 3, choline: 60 },
];

// AAFCO adult maintenance minimums expressed PER 1,000 kcal ME. Derived from the
// dry-matter profile in AAFCO_PROFILES at the standard 4,000 kcal/kg assumption.
// Per-1,000-kcal is the right basis here because it cancels both moisture and
// calorie density — a wet bowl and a dry one compare directly.
const AAFCO_PER_1000: { key: string; label: string; min: number; unit: string; max?: number }[] = [
  { key: "protein", label: "Protein", min: 45, unit: "g" },
  { key: "fat", label: "Fat", min: 13.8, unit: "g" },
  { key: "ca", label: "Calcium", min: 1250, unit: "mg", max: 6250 },
  { key: "p", label: "Phosphorus", min: 1000, unit: "mg", max: 4000 },
  { key: "vitD", label: "Vitamin D", min: 125, unit: "IU", max: 750 },
  { key: "vitE", label: "Vitamin E", min: 12.5, unit: "mg", max: 250 },
  { key: "zinc", label: "Zinc", min: 20, unit: "mg" },
  { key: "choline", label: "Choline", min: 340, unit: "mg" },
];

// ── HOME-COOKED BUILDER ──────────────────────────────────────────────────────
// Deliberately built as a GAP DETECTOR rather than a recipe generator, because
// the evidence says recipe generators are where this goes wrong. Stockman et al.
// (JAVMA 2013) evaluated 200 recipes — 129 of them written by VETERINARIANS —
// and only 9 met AAFCO. Rotation didn't rescue it either.
//
// So this tool tells an owner what their bowl is probably MISSING and how to fix
// it with food. It does not certify anything, and it says so.
const HOMEMADE_EVIDENCE = [
  {
    h: "95% of homemade recipes fail — including the ones vets wrote",
    b: "Stockman, Fascetti and Larsen evaluated 200 home-prepared maintenance recipes from 34 sources — textbooks, pet care books, websites — 129 of them authored by veterinarians. ONLY 9 met AAFCO nutrient standards. Only 5 met the stricter NRC guidelines. Most were also vague about ingredient amounts or supplement details, so an owner following them exactly still couldn't land in the same place twice.",
  },
  {
    h: "And rotating recipes doesn't fix it",
    b: "The most common defence of home cooking is that variety balances out over time. The same authors tested that directly: when groups of recipes were evaluated as a rotation, they STILL did not provide a complete diet. Larger surveys agree — the Dog Aging Project looked at 1,726 owner-reported homemade diets and found only about 6% could even potentially be complete.",
  },
  {
    h: "The same nutrients fail every time",
    b: "This isn't random. Homemade diets fail predictably on CALCIUM, VITAMIN D, ZINC, CHOLINE and VITAMIN E. Muscle meat is rich in phosphorus and almost devoid of calcium. Dogs synthesise almost no vitamin D in skin, so all of it must come from food. Choline deficiency drives fat accumulation in the liver. Knowing the five that break means you can aim at them directly — which is what the checklist below does.",
  },
  {
    h: "What this tool is, and isn't",
    b: "It is a gap detector. It gives you a proven structural framework, tells you which nutrients that framework tends to leave short, and shows you the whole foods that close each gap. It does NOT calculate your specific recipe against all 40+ AAFCO minimums, and it cannot certify a diet as complete and balanced. Only a formulation run against a food-composition database can do that. For a dog with kidney, liver, heart or urinary disease, use a board-certified veterinary nutritionist instead — the margins there are too tight for any app.",
  },
];

// The structural framework that actually works — and the one every good fresh
// brand uses. AllProvide's beef recipe reads exactly like this: heart, muscle,
// bone, liver, kidney, vegetables. That is not a coincidence, it's the answer.
const HOMEMADE_FRAMEWORK: {
  part: string;
  pct: string;
  why: string;
  examples: string;
}[] = [
  {
    part: "Muscle meat", pct: "50–60%",
    why: "Protein, all essential amino acids, B vitamins, iron. The base of the bowl — but on its own it is calcium-free and will fail every time.",
    examples: "Beef, lamb, pork, chicken thigh, turkey. Include HEART here (technically muscle) for taurine and CoQ10 — it can be 10–15% of the total.",
  },
  {
    part: "Calcium source — RAW and COOKED differ here", pct: "10–15%",
    why: "THE most common failure point, and the one line of this framework that changes completely depending on how you prepare the food. Calcium matters, and so does the calcium-to-phosphorus ratio — AAFCO wants roughly 1:1 to 2:1, and muscle meat alone runs badly phosphorus-heavy.",
    examples: "IF FEEDING RAW: raw meaty bones — chicken necks, wings, turkey necks — at 10–15%. IF COOKING: NEVER use bone. Cooking makes bone brittle and it splinters. Use ground eggshell instead, about ½ tsp per pound of finished food (~1,000 mg calcium per tsp), or bone meal, and make up the missing weight in muscle meat. Canned sardines with softened bones work for either.",
  },
  {
    part: "Liver", pct: "5%",
    why: "Vitamin A, copper, B12, folate, iron. Close to irreplaceable — very little else supplies vitamin A and copper at useful levels.",
    examples: "Beef, chicken, lamb liver. Hold at 5%: liver is so dense in vitamin A and copper that more becomes a ceiling problem rather than a benefit.",
  },
  {
    part: "Other secreting organ", pct: "5%",
    why: "Selenium, B vitamins, and nutrients muscle meat lacks. Skipping this is the second most common gap after calcium.",
    examples: "Kidney, spleen, pancreas, testicle. NOT heart or gizzard — those are muscle, and they don't do this job.",
  },
  {
    part: "Vegetables and fruit", pct: "10–20%",
    why: "Fibre for the microbiome, potassium, magnesium, manganese, polyphenols. Not strictly required, genuinely useful.",
    examples: "Kale, broccoli, butternut squash, carrots, parsnips, blueberries, pumpkin. Lightly steamed or puréed — dogs extract far less from whole raw vegetables.",
  },
];

// The five that break, and the food that fixes each. Whole food first, because
// that was the brief — a supplement is listed only where food struggles.
const HOMEMADE_GAPS: {
  nutrient: string;
  risk: string;
  fix: string;
  supplement: string;
}[] = [
  {
    nutrient: "Calcium", risk: "Muscle meat is near-zero calcium and high phosphorus. Deficiency in a growing dog causes skeletal deformity; in an adult, bone demineralisation.",
    fix: "Edible bone at 10–15%, OR ground eggshell at roughly ½ tsp per pound of finished food. Canned sardines with the bones contribute too — 300–350 mg per can.",
    supplement: "Eggshell powder or bone meal if you can't feed bone. Avoid calcium carbonate alone — it supplies no phosphorus and can skew the ratio the other way.",
  },
  {
    nutrient: "Vitamin D", risk: "Dogs make almost none in skin — roughly ten times less precursor than we have — so 100% is dietary. One of the most frequently missed.",
    fix: "Oily fish is the strongest food source: sardines, mackerel, salmon. Egg YOLK and liver contribute. Pasture-raised egg yolks carry 3–4x the vitamin D of caged.",
    supplement: "Cod liver oil covers D and A together — but then don't stack more vitamin A on top.",
  },
  {
    nutrient: "Choline", risk: "Rarely discussed and commonly deficient. Choline moves fat out of the liver; chronic shortage leads to fat accumulation there.",
    fix: "EGG YOLK is the single best fix and the easiest — one yolk daily covers a lot of ground. Liver is second.",
    supplement: "Rarely needed if eggs are in the rotation.",
  },
  {
    nutrient: "Zinc", risk: "Deficiency shows first in skin and coat — crusting around the muzzle and eyes, poor healing, dull coat. Northern breeds are especially prone.",
    fix: "Red meat, beef liver, and oysters (by far the richest food source of zinc there is). Pumpkin seeds contribute.",
    supplement: "Zinc as a chelate, proteinate or amino acid complex if food can't reach it. Not zinc oxide — poorly absorbed.",
  },
  {
    nutrient: "Vitamin E", risk: "The hardest one to hit from food alone, and it matters more as you add omega-3 — vitamin E is what stops those fats oxidising.",
    fix: "Sunflower seeds, wheat germ, leafy greens, egg yolk. Genuinely difficult to reach the target from food in a meat-based bowl.",
    supplement: "This is the one where a supplement is usually the honest answer. Use natural d-alpha tocopherol, not synthetic dl-alpha — about double the bioavailability.",
  },
  {
    nutrient: "Iodine", risk: "Drives thyroid function. Both too little and too much cause thyroid disease, and the window is narrower than most people assume.",
    fix: "Kelp — but a TINY amount. Kelp is so concentrated that a heaped spoonful can overshoot the safe ceiling. Measure it; don't eyeball it.",
    supplement: "A measured kelp powder is the practical route. Iodised salt is not appropriate for dogs.",
  },
  {
    nutrient: "Manganese", risk: "Needed for joint cartilage and bone. Quietly missing from most meat-based homemade diets.",
    fix: "Mussels (green lipped mussel powder covers this and joints at once), leafy greens, and blueberries.",
    supplement: "Usually solved by adding mussels rather than a capsule.",
  },
];

// THE FISH REFERENCE SHEET — ordered by position in the food chain, because that
// one variable predicts almost everything else about whether a fish suits a dog.
//
// The trade-off nobody explains: the fish LOWEST on the chain have the least
// mercury and the most omega-3 — and are the ones most likely to carry
// thiaminase. The fish highest up have no thiaminase and dangerous mercury.
// Neither end is simply "good"; they fail in opposite directions.
//
// Mercury tiers follow the FDA's published Best Choices / Good Choices / Avoid
// categories. Omega-3 figures are EPA+DHA per 100 g. Companion to FISH_EPA_DHA
// in the omega section, which covers dosing rather than selection.
const FISH_CHAIN: {
  fish: string;
  level: string;
  omega3: string;
  mercury: "very low" | "low" | "moderate" | "high" | "very high";
  thiaminase: "yes" | "likely" | "no" | "untested";
  verdict: "best" | "good" | "occasional" | "avoid";
  note: string;
}[] = [
  // ── BOTTOM: planktivores ────────────────────────────────────────────────
  {
    fish: "Anchovy", level: "1 · Plankton feeder", omega3: "1,400 mg", mercury: "very low",
    thiaminase: "yes", verdict: "best",
    note: "Tiny, short-lived, bottom of the chain — which is exactly why nearly every quality fish oil is built from anchovies. Thiaminase is documented: a PNAS study tied widespread thiamine deficiency in California salmon to an anchovy-dominated prey base. Cooked, canned or as oil, that's irrelevant.",
  },
  {
    fish: "Sardine", level: "1 · Plankton feeder", omega3: "1,480 mg", mercury: "very low",
    thiaminase: "likely", verdict: "best",
    note: "The most practical fish for most owners — cheap, shelf-stable, portioned, and eaten whole so canned ones deliver bone calcium too. A clupeid feeding at the base of the chain and rich in omega-3, which is the exact profile that predicts thiaminase. Canned removes the question entirely.",
  },
  {
    fish: "Herring", level: "1 · Plankton feeder", omega3: "1,730 mg", mercury: "very low",
    thiaminase: "yes", verdict: "best",
    note: "Underrated and cheap. The single best-documented thiaminase fish in the sea — Atlantic and Pacific both, and the established cause of thiamine deficiency in Baltic salmon. Excellent cooked or canned; never feed it raw as a staple.",
  },
  {
    fish: "Sprat · Menhaden", level: "1 · Plankton feeder", omega3: "high", mercury: "very low",
    thiaminase: "yes", verdict: "good",
    note: "Both tested positive for thiaminase. Rarely sold for direct feeding but common in fish meal, where the heat of rendering has already destroyed the enzyme.",
  },
  {
    fish: "Mussels · Clams", level: "1 · Filter feeder", omega3: "moderate", mercury: "very low",
    thiaminase: "yes", verdict: "good",
    note: "Thiaminase documented in both. Green lipped mussel is the exception worth seeking out — its ETA content is the reason it beats fish oil for joints — and it's sold freeze-dried or as an extract, not raw.",
  },
  // ── LOW-MID ─────────────────────────────────────────────────────────────
  {
    fish: "Mackerel (Atlantic)", level: "2 · Small predator", omega3: "2,670 mg", mercury: "low",
    thiaminase: "untested", verdict: "best",
    note: "The richest common fish there is. ⚠️ ATLANTIC only — KING mackerel is a different fish near the top of the chain and one of the highest-mercury species in the sea. The names are close enough that this mix-up is genuinely common.",
  },
  {
    fish: "Smelt", level: "2 · Small predator", omega3: "moderate", mercury: "very low",
    thiaminase: "yes", verdict: "good",
    note: "Classic thiaminase fish, well documented since the 1940s. Fine cooked, poor choice raw.",
  },
  {
    fish: "Rainbow trout", level: "3 · Mid predator", omega3: "~1,100 mg", mercury: "very low",
    thiaminase: "no", verdict: "best",
    note: "Solid all-rounder and mild enough for picky dogs. Tested free of thiaminase in the older surveys.",
  },
  {
    fish: "Salmon (wild)", level: "3 · Mid predator", omega3: "2,150 mg", mercury: "low",
    thiaminase: "no", verdict: "best",
    note: "Excellent, and the astaxanthin that makes it red is a strong antioxidant. Tested negative for thiaminase. ⚠️ But raw Pacific salmon carries SALMON POISONING DISEASE — a fluke-borne rickettsia that is frequently fatal in dogs. Freeze or cook Pacific salmonids, always. Wild beats farmed: farmed fish eat grain-based feed and carry more omega-6.",
  },
  // ── MID: whitefish ──────────────────────────────────────────────────────
  {
    fish: "Cod · Haddock · Pollock", level: "3 · Mid predator", omega3: "~175 mg", mercury: "low",
    thiaminase: "no", verdict: "good",
    note: "Lean whitefish — good clean protein, negligible omega-3. Fine as a novel protein or a bland-diet base; don't expect it to do anything for inflammation. Note this is the FLESH: cod LIVER oil is a different product, rich in omega-3 but also in vitamin A and D, which accumulate.",
  },
  {
    fish: "Flounder · Sole · Tilapia", level: "3 · Mid predator", omega3: "~150–200 mg", mercury: "low",
    thiaminase: "no", verdict: "good",
    note: "Safe and lean. Farmed tilapia is often criticised for a poor omega-6:3 ratio, which is fair — just don't mistake it for an omega-3 source.",
  },
  // ── HIGH ────────────────────────────────────────────────────────────────
  {
    fish: "Tuna (canned light / skipjack)", level: "4 · Large predator", omega3: "~150–300 mg", mercury: "moderate",
    thiaminase: "no", verdict: "occasional",
    note: "The worst of both worlds — a fifth of sardine's omega-3 with several times the mercury. Popular because it's familiar, not because it's good. There is no reason to choose it over sardines.",
  },
  {
    fish: "Tuna (albacore / yellowfin)", level: "4 · Large predator", omega3: "~700–1,000 mg", mercury: "high",
    thiaminase: "no", verdict: "occasional",
    note: "Decent omega-3, but a large predatory fish accumulating mercury over years. Occasional is fine; daily is not, and small dogs reach a problematic dose far faster than large ones.",
  },
  {
    fish: "Halibut · Grouper · Sea bass", level: "4 · Large predator", omega3: "moderate", mercury: "high",
    thiaminase: "no", verdict: "occasional",
    note: "FDA lists these as once-a-week fish for people. No reason to make them a routine part of a dog's diet when cheaper, safer, richer options exist.",
  },
  // ── TOP: avoid ──────────────────────────────────────────────────────────
  {
    fish: "King mackerel", level: "5 · Apex", omega3: "moderate", mercury: "very high",
    thiaminase: "no", verdict: "avoid",
    note: "On the FDA's avoid list. Long-lived and high on the chain — nothing like the Atlantic mackerel it shares a name with.",
  },
  {
    fish: "Swordfish · Shark · Marlin", level: "5 · Apex", omega3: "moderate", mercury: "very high",
    thiaminase: "no", verdict: "avoid",
    note: "FDA avoid list. Decades of accumulated methylmercury. Never worth it for a dog.",
  },
  {
    fish: "Tilefish (Gulf) · Bigeye tuna · Orange roughy", level: "5 · Apex", omega3: "low–moderate", mercury: "very high",
    thiaminase: "no", verdict: "avoid",
    note: "Gulf tilefish carries the highest mercury the FDA measures. Orange roughy can live over 100 years, which is exactly as much accumulation as it sounds like.",
  },
];

// Fresh vs canned sardines. This one runs against instinct — fresh is normally
// better than canned, and for a dog it is not. Two hazards are destroyed by the
// heat of canning, and a third nutrient is created by it.
const SARDINE_FORM: {
  h: string;
  b: string;
  verdict: "canned" | "fresh" | "either";
}[] = [
  {
    h: "Sardines are clupeids — and clupeids are the classic thiaminase family",
    verdict: "canned",
    b: "FIRST, THE PART THAT SETTLES IT FOR MOST PEOPLE: canned and cooked fish contain NO active thiaminase. Heat denatures the enzyme completely. If you feed canned sardines, this section is not about you — at any amount, for any length of time.\n\nSECOND, IF YOU FEED FISH RAW, THE RISK SCALES WITH PROPORTION. Thiaminase is an enzyme in raw fish flesh that cleaves thiamine (vitamin B1) and inactivates it — including thiamine from the rest of the meal, not just the fish. Deficiency is documented in dogs, foxes and cats, and it isn't mild: appetite loss, then loss of reflexes and coordination, then seizures, and death in severe cases.\n\nBut every documented case involves fish as a PREDOMINANT or EXCLUSIVE diet. The 2023 review's own wording is that clupeids cause deficiency 'if they are a large portion of predator diets.' Cats fed only raw fish. Salmon whose entire prey base is anchovies. A raw fish topper on a thiamine-fortified complete diet is a different exposure by an order of magnitude — and an AAFCO-complete base food supplies at least 2.25 mg/kg of thiamine, formulated to survive processing.\n\nBE PRECISE ABOUT WHAT THAT MEANS: no study has established a safe percentage. 'No documented cases at topper amounts' is an absence of evidence, not proof of safety. What can be said honestly is that the risk is dose-dependent, that it has never been reported outside fish-dominant diets, and that a fortified base diet provides real buffer.\n\nA 2023 review compiled thiaminase data across 300 fish species and found that ecology, not evolution, predicts it. Four factors explained most of the variation: feeding LOW on the food web (the strongest predictor), living in FRESHWATER (59.5% of freshwater species positive vs 21.8% marine), being HIGH IN OMEGA-3, and tropical climate.\n\nSardines hit three of the four hard. They are planktivores — about as low on the food web as a fish gets — they are among the richest fish in omega-3, and they are clupeids. The review names that family directly: clupeids 'are well known to cause thiamine deficiency if they are a large portion of predator diets.' Sprat tested positive, Atlantic herring and sprat are the documented cause of thiamine deficiency in Baltic salmon, and a PNAS study tied widespread thiamine deficiency in California salmon to an ANCHOVY-dominated prey base.\n\nSo treating raw sardines as a thiaminase risk is well founded, even though a specific assay on Sardina pilchardus is hard to find. The family, the trophic level and the fat profile all point the same way.\n\nAnd heat denatures the enzyme completely — canned carries no thiaminase risk at all. This only matters if you feed fish raw.",
  },
  {
    h: "1 in 5 sardine fillets carried Anisakis larvae",
    verdict: "canned",
    b: "Researchers examined 90 semipreserved products from EU retailers — 45 anchovy and 45 sardine fillets. Anisakis larvae were found in 20% of the sardine samples and 28.9% of the anchovy. Every larva recovered was DEAD, killed by the processing.\n\nRead that carefully, because the reassuring half and the alarming half are both in it. Processing worked. But if one in five PROCESSED fillets still contains a larval carcass, raw sardines carry at least that prevalence of LIVE ones. Anisakis is common enough in this family that the herring worm is named after it.",
  },
  {
    h: "⚠️ Freezing kills parasites. It does NOT touch thiaminase.",
    verdict: "fresh",
    b: "This is the distinction people miss, and it decides whether frozen is actually an upgrade. Thiaminase is an ENZYME — only heat denatures it. Freezing, thawing and refreezing leave it fully active. Freezing addresses parasites and nothing else.\n\nSo the three forms line up like this. FRESH: thiaminase active, parasites possible. FROZEN: thiaminase STILL active, parasites killed only if it was frozen cold enough for long enough. CANNED: both hazards gone.\n\nAnd the freezing bar is higher than a kitchen freezer clears. The FDA parasite-destruction standard is −4°F (−20°C) for 7 DAYS, or −31°F (−35°C) for 15 hours. A typical home freezer runs about 0°F (−18°C) — close, not compliant. 'Frozen' at the supermarket doesn't mean parasite-destroyed either; fish is frozen for preservation, not to that specification, unless it is explicitly sold for raw consumption.\n\nBottom line: frozen beats fresh on one hazard, ties it on the other, and neither reaches canned.",
  },
  {
    h: "Canning ADDS a nutrient fresh can't give you",
    verdict: "canned",
    b: "The pressure and heat of canning soften the bones until they're edible, which turns a can of sardines into one of the best non-dairy calcium sources there is — roughly 300–350 mg per can, plus vitamin D. A fresh sardine's bones don't do that.\n\nHome cooking doesn't reproduce it either. Baking or pan-frying dries bones out rather than softening them, so you don't get the calcium and you do get a texture worth being careful about. Canning is a genuinely different process, not just cooking in a tin.",
  },
  {
    h: "And canned is more consistent",
    verdict: "canned",
    b: "Fresh sardine fat content swings with season and fishing ground, so omega-3 varies. Canned fish is packed at peak fat content and sealed, and omega-3 is heat-stable, so the numbers hold. A can runs roughly 700–1,800 mg of omega-3 depending on size and pack — around 1,400 mg for a standard 92 g tin.",
  },
  {
    h: "What to actually buy",
    verdict: "canned",
    b: "Packed in WATER, with NO SALT ADDED. Oil-packed adds omega-6 you're trying to reduce and some of the fish's own oil leaches into it and gets drained away. Salted versions push sodium higher than a dog needs.\n\nBrisling or 'wild caught' on the label is a good sign — small, short-lived fish, which is why sardines are low in mercury to begin with. BPA-free lining if the brand offers it.",
  },
];

// Whole fish versus extracted oil. Both have a job; they're not competing.
const SARDINE_VS_OIL = [
  {
    h: "What the whole fish brings that oil doesn't",
    b: "A can of sardines delivers ~1,400 mg omega-3 alongside 22 g of protein, 300–350 mg of calcium from the softened bones, vitamin D, selenium, CoQ10 and several days' worth of B12. Fish oil delivers the fatty acids and nothing else. Per milligram of omega-3, the fish is the better nutritional buy.",
  },
  {
    h: "What the oil does that fish can't",
    b: "Concentration. Reaching a therapeutic anti-inflammatory dose from sardines alone would take roughly two cans a day — around 370 kcal and 45 g of protein, which is a large share of a medium dog's diet and starts displacing his actual food. A concentrated oil delivers the same fatty acids in a teaspoon or two without rearranging the whole bowl.",
  },
  {
    h: "So the answer is both, with different jobs",
    b: "Use sardines as FOOD — a whole-food topper several times a week, bringing minerals and protein with their omega-3. Use fish oil as a DOSE — the tool for hitting a specific therapeutic number when a condition calls for it. Choosing between them is the wrong question; they're not substitutes for each other.",
  },
];

// Green lipped mussel gets its own evidence block because it's the one joint
// supplement with real randomised canine trials behind it — and because the
// single most important fact about it (extract vs powder) is exactly what the
// marketing leaves out.
const GLM_EVIDENCE: { h: string; b: string; s: string }[] = [
  {
    h: "Beat fish oil head-to-head",
    b: "66 dogs with osteoarthritis, comparing a green lipped mussel lipid extract against fish oil. The mussel group improved on lameness, weight-bearing and force-plate peak vertical force within two weeks. The fish oil group showed no statistically significant improvement even at 12 weeks, and from week four the mussel group was significantly ahead.",
    s: "PCSO-524 vs fish oil comparative trial",
  },
  {
    h: "Worked as plain powder too",
    b: "A double-blind randomised trial fed green lipped mussel POWDER for 6 weeks in three different formats — loose powder, baked into treats, and mixed into the main diet. All three produced statistically significant improvement in arthritis signs, which matters because it means the benefit doesn't depend on a patented extraction.",
    s: "Bierer & Bui · Journal of Nutrition, 2002",
  },
  {
    h: "Why it works differently from fish oil",
    b: "Green lipped mussel is the only meaningful source of ETA (eicosatetraenoic acid), which inhibits BOTH the COX and LOX inflammatory pathways. Fish oil's EPA works mainly on COX alone. That's a genuine second mechanism, not a marketing angle — and it's why the two stack rather than duplicate.",
    s: "Mechanism is well established; the potency multipliers in marketing are not",
  },
  {
    h: "⚠️ Extract and powder are not the same product",
    b: "The trial that beat fish oil used PCSO-524, a specific patented lipid extract. The powder trials used whole mussel powder and showed smaller effects. Both work; they are not interchangeable, and a tub of powder should not be expected to reproduce the extract's results. Most trials are also small and several are industry-funded — good evidence for a supplement, not the standard of a drug approval.",
    s: "Stated because the distinction is usually omitted",
  },
  {
    h: "Powder vs oil — they deliver different things",
    b: "This isn't a quality ladder, it's a trade-off. WHOLE POWDER is the entire mussel freeze-dried: less concentrated ETA, but it also carries the naturally occurring glucosamine, chondroitin and trace minerals — the joint-building materials. LIPID EXTRACT (oil, capsules) concentrates the fatty acid fraction hard, which is why it produced the fastest trial results, but the extraction leaves the glucosamine and chondroitin behind. Powder is a whole food; oil is a targeted anti-inflammatory. Neither is the better product in the abstract.",
    s: "Powder: Bierer & Bui 2002 · Oil: PCSO-524 trials",
  },
  {
    h: "Processing decides whether it works at all",
    b: "The active lipids oxidise easily, so how the mussel was dried matters more than the brand name. Cold-processed or freeze-dried retains activity; heat-dried largely destroys it — and a heat-dried powder can look and cost the same. If a label won't say how it was processed, assume the cheap way.",
    s: "Why the original extract was developed as a stabilised lipid in the first place",
  },
];

// GDV / bloat. Included because it's the one feeding decision that can kill a dog
// in an afternoon, and because two of the most repeated pieces of advice about it
// are either backwards or unsupported. Everything here is from the Purdue
// prospective work unless stated.
//
// tier: "act" = change this today · "know" = real but not modifiable ·
//       "mixed" = the evidence genuinely conflicts, stated as such
const GDV_EVIDENCE: {
  h: string;
  b: string;
  tier: "act" | "know" | "mixed";
}[] = [
  {
    h: "Raised bowls INCREASE the risk — by about 110%",
    tier: "act",
    b: "This is the finding that reverses decades of pet-store advice. In a 5-year prospective study of 1,637 large and giant breed dogs, a raised feeder roughly doubled GDV risk. Around 20% of cases in large breeds and 52% in giant breeds were attributed to it. Elevated bowls were sold for years as bloat prevention; the data says they were causing it. If you have one, floor level is safer.",
  },
  {
    h: "Eating speed is a real, fixable risk",
    tier: "act",
    b: "Fast eaters carry roughly 15% higher risk, and it's one of the few factors entirely under your control. A slow-feeder bowl, a snuffle mat, or simply spreading the food across a wide flat dish all work. For a dog who inhales meals this is the highest-value change available.",
  },
  {
    h: "Two or three smaller meals beat one large one",
    tier: "act",
    b: "One large daily meal raises risk compared with splitting the same food across two or three. Large volume per meal is itself a risk factor, independent of how often you feed. Splitting costs nothing.",
  },
  {
    h: "It's swallowed AIR, not food expanding",
    tier: "know",
    b: "The most common explanation is wrong. When vets analyse the gas from a bloated stomach, it turns out to be essentially ROOM AIR — the dog swallowed it. Aerophagia is the cause; kibble swelling is not. Bacterial fermentation of carbohydrate adds a little, but the bulk is air that went down the throat.\n\nThis matters because it changes what prevention means. You aren't trying to stop food from expanding. You're trying to stop a dog gulping air — which is why eating speed is such a big factor, and why the 'let the kibble soak first' logic doesn't hold.",
  },
  {
    h: "🚨 Moistening dry food can be dangerous — 4.2× risk",
    tier: "act",
    b: "The single most counterintuitive finding in the research. Dogs fed DRY FOOD CONTAINING CITRIC ACID that owners MOISTENED before serving had 4.2 times the GDV risk — a 320% increase. Around 32% of all GDV cases in that study were attributed to this one practice.\n\nCitric acid is a common preservative in dry food. The widely shared advice to 'add water so the kibble doesn't swell in the stomach' can therefore be actively harmful, because it was built on the wrong mechanism in the first place. If you moisten dry food, check the ingredient list for citric acid first.\n\nThis does not apply to foods that are already moist by design — fresh, raw, canned, gently cooked, or freeze-dried rehydrated per the maker's instructions.",
  },
  {
    h: "Do NOT restrict water around meals",
    tier: "act",
    b: "Another reversal. Restricting a dog's water intake before and after eating was found to INCREASE GDV risk. The common advice to withhold water around mealtimes has it backwards. Keep water freely available.",
  },
  {
    h: "Bigger particles beat smaller · dry beats out fresh on risk",
    tier: "know",
    b: "Food made of only SMALL particles increases risk, so a larger kibble is lower risk than a fine or small-piece one. Dry food with fat among the first four ingredients is also implicated — roughly 30% of cases in one study were attributed to it. Feeding only dry food is itself a risk factor.\n\nSo the rough ranking is: moisture-rich fresh, raw, gently cooked and canned diets sit outside the highest-risk pattern; large-piece dry food sits in the middle; small-particle, high-fat dry food sits at the top. If you already feed fresh, you reduced this risk without meaning to.",
  },
  {
    h: "Heat and hard panting plausibly raise the risk",
    tier: "know",
    b: "Heat isn't listed as a direct risk factor, so treat this as mechanism rather than proof. But the documented causes of air swallowing are rapid eating, HYPERVENTILATION, and oesophageal motility problems — and a dog panting hard in the heat is hyperventilating by definition.\n\nThe practical version: don't feed a dog who's still panting hard from exercise or heat. Let him settle and his breathing return to normal first. That's free, it costs you ten minutes, and it lines up with the one mechanism everybody agrees on.",
  },
  {
    h: "⚠️ \"Wait an hour after eating\" — nobody has proven this",
    tier: "mixed",
    b: "WHAT EVERYONE SAYS: don't exercise for an hour after a meal.\n\nWHAT THE RESEARCH SAYS: it's genuinely unclear. Some evidence supports waiting about 2 hours before hard exercise. But the largest study found the reverse — dogs whose exercise was restricted around mealtimes had MORE bloat, not less.\n\nDon't over-read that either. It doesn't prove playing after meals is protective; owners tend to restrict nervous dogs, and nervous dogs bloat more to begin with. So the reversal may just be measuring which dogs already worried their owners.\n\nTHE FAIR SUMMARY: waiting probably doesn't hurt, and nobody has shown it helps.\n\nTHE MISTAKE TO AVOID: letting the waiting rule push your walk into the hottest part of the day. Heat is a proven danger with a body count. The waiting rule is a maybe. Never trade a certainty for a maybe — feed earlier and walk earlier instead of feeding at noon and walking at two.",
  },
  {
    h: "What you can't change",
    tier: "know",
    b: "Risk rises with age. A first-degree relative who bloated raises it substantially — this is strongly heritable. A deep, narrow chest raises it, which is why Great Danes, Weimaraners and Setters dominate the high-risk lists while broader-chested breeds like Labradors sit lower. Anxious or fearful temperament raises it; relaxed dogs are at lower risk.",
  },
  {
    h: "🚨 Know the signs — this kills in hours",
    tier: "act",
    b: "UNPRODUCTIVE RETCHING is the hallmark: trying hard to vomit and bringing nothing up. Add a distended, hard, drum-like belly · pacing and inability to settle · heavy drooling · pale gums · collapse. This is not a wait-and-see condition. Go to an emergency vet immediately — survival depends on hours, not days.",
  },
];

// How much carbohydrate is actually reasonable. Owners get told "grain free good"
// or "dogs don't need carbs" and neither is a number. This is the number — with
// the honest caveat that no body sets a carbohydrate requirement, so every figure
// here is a judgement about displacement and activity, not a published minimum.
const CARB_LEVELS: {
  range: string;
  label: string;
  tier: "ideal" | "fine" | "watch" | "poor";
  b: string;
}[] = [
  {
    range: "0–10%", label: "Raw · freeze-dried · most fresh", tier: "ideal",
    b: "Where ancestral-style diets sit. There is no deficiency at this level — dogs have no carbohydrate requirement and make the glucose they need from protein and fat. Excellent for sedentary dogs, seniors, endurance work, and any dog whose weight or insulin you're managing. The only cost is a smaller muscle glycogen store, which matters solely for repeated hard sprints.",
  },
  {
    range: "10–20%", label: "Gently cooked · premium fresh", tier: "ideal",
    b: "The comfortable middle for most pet dogs. Enough glycogen for ordinary bursts of play, still low enough that carbohydrate isn't displacing meat or driving a meaningful insulin load. If you want one number to aim at for a normally active dog, aim here.",
  },
  {
    range: "20–35%", label: "Better kibble · some fresh", tier: "fine",
    b: "Reasonable for genuinely active dogs, and defensible for any dog if the rest of the formulation is good. Carbohydrate is doing real work here — fuelling burst activity and sparing protein. Judge the food on what the carbohydrate IS (whole vegetables and intact grains, versus refined starch and fractionated legume) rather than on the percentage alone.",
  },
  {
    range: "35–50%", label: "Typical kibble", tier: "watch",
    b: "The mainstream range, and the problem usually isn't toxicity — it's DISPLACEMENT. Every percentage point of starch is a point that isn't meat. A food at 45% carbohydrate has roughly half the bowl doing something other than supplying animal protein and fat. The second concern is metabolic: a dog with no anaerobic demand has nowhere to put that glucose except storage, which means a chronic insulin signal in an animal that evolved without one.",
  },
  {
    range: "50%+", label: "Grain- or legume-heavy budget kibble", tier: "poor",
    b: "Most of the bowl is not food the dog evolved to run on. Extrusion physically requires starch to form a kibble, so this level is a manufacturing constraint being sold as nutrition. Particularly poor for an inactive or overweight dog, who has no glycogen demand to absorb it.",
  },
];

// Match the number to the dog, not to a philosophy.
const CARB_MATCHING = [
  { dog: "Sedentary · senior · overweight · diabetic", target: "under 15%", why: "No anaerobic demand to absorb glucose. Every gram is a storage signal." },
  { dog: "Normal pet dog, walks and plays", target: "10–25%", why: "Enough glycogen for ordinary bursts without a chronic insulin load." },
  { dog: "Endurance — hiking, running, sledding", target: "0–20%", why: "Aerobic work runs on fat, and dogs are exceptional at it. The sled dog trials found LOWER carbohydrate performed better." },
  { dog: "Repeated hard sprints — field trials, agility, lure coursing", target: "higher, or target it", why: "Anaerobic work burns glycogen. Either raise the diet, or use post-exercise repletion instead." },
];

// Lifespan. The single largest effect size in all of dog nutrition — bigger than
// any ingredient, brand, or supplement decision an owner will ever make — and it
// costs nothing. Kept honest about which finding is causal and which isn't.
const LIFESPAN_EVIDENCE: {
  h: string;
  b: string;
  strength: "proven" | "observational" | "conflict";
}[] = [
  {
    h: "Lean Labradors lived 1.8 years longer",
    strength: "proven",
    b: "Kealy et al., Journal of the American Veterinary Medical Association 220(9):1315, 2002 — the Purina Life Span Study. 48 Labrador Retrievers, paired as littermates, one of each pair fed 25% less food than the other from 8 weeks of age until death. The restricted dogs reached a median 13.0 years against 11.2 — 1.8 years, or about 16% longer. (These are the figures printed in the paper. A widely repeated 12.9-vs-11.1 version is a transcription error: 12.9 is the control group's MAXIMUM lifespan from the same paragraph, not its median.)\n\nRun at the Nestlé Purina Research Facility, Gray Summit, Missouri, and funded by Purina. Weigh it on the design rather than the sponsor: paired littermates, randomised, fourteen years to death, and nobody has found a flaw in it. It also agrees with caloric-restriction work in rodents and primates funded by nobody with a stake. That convergence is why it stands.\n\nThey also developed arthritis about 1.5 years later. This wasn't just more life; it was more healthy life.\n\nThis is the first study in a large mammal to prove diet restriction extends lifespan, and it remains the largest single effect anyone has demonstrated in canine nutrition. No food, brand or supplement comes close.",
  },
  {
    h: "It's about body condition, not hunger",
    strength: "proven",
    b: "The mechanism in that study was keeping dogs at a lower body condition score for life — lean, with ribs easily felt. It was NOT about fasting windows, meal timing or any particular diet.\n\nWhich means the intervention is simply: keep your dog lean. If you can feel his ribs easily and he has a visible waist from above, you are already doing the thing with the strongest longevity evidence in the field. Most owners are not — an estimated majority of dogs are overweight.",
  },
  {
    h: "Once-daily feeding tracked with better health — but it's observational",
    strength: "observational",
    b: "The Dog Aging Project examined feeding frequency across more than 24,000 dogs. Controlling for age, sex, breed and other factors, dogs fed once daily had lower cognitive dysfunction scores and lower odds of gastrointestinal, dental, orthopedic, kidney/urinary and liver/pancreas disorders.\n\nRead it carefully: this is a survey, not a trial. It cannot show cause. Owners who feed once daily may differ in a dozen other ways. The authors say so plainly. It's consistent with rodent time-restricted feeding work, and it is not proof.",
  },
  {
    h: "⚠️ And once-daily conflicts with the bloat evidence",
    strength: "conflict",
    b: "Here's the tension nobody mentions: the GDV research found feeding ONE meal a day is a RISK FACTOR for bloat, along with large volume per meal. The longevity survey points the other way.\n\nFor a large or deep-chested breed those two findings pull in opposite directions, and one of them kills dogs in an afternoon while the other is an uncontrolled association.\n\nA reasonable middle path: keep two meals, but compress them into a shorter overnight window. That preserves a long fasting interval without the single-large-meal risk. Nobody has trialled that specific compromise, so it's reasoning rather than evidence — but it doesn't require betting on the weaker study.",
  },
  {
    h: "🚩 The autophagy numbers you've read are not from dogs",
    strength: "observational",
    b: "You'll see confident claims that autophagy starts at 12 hours, or peaks at 16–18, or begins at 17–24. Trace them and they lead to blogs and pet-food companies, not to canine studies. Those figures are imported from rodent and human research and repeated until they sound established.\n\nThe tell is that they disagree with each other by a factor of two. When secondary sources vary that widely and none cite a primary canine measurement, the number was borrowed rather than measured.\n\nWhat IS known in dogs: once-daily feeding tracked with better health in a large survey, and lifelong calorie restriction extended lifespan in a randomised trial. Neither study measured autophagy at all.\n\nSo if you fast your dog overnight, do it because the feeding-frequency data is suggestive and it costs nothing — not because you're hitting a threshold somebody put a number on. On whether a small protein snack 'breaks' it: dietary protein activates mTOR, which does suppress autophagy, so mechanistically a piece of chicken would blunt it more than fat would. How much, and for how long, in a dog — nobody has measured that either.",
  },
];

// What the food sits in. Included because the National Sanitation Foundation
// ranks pet bowls the 4th most germ-laden object in a home, and because the one
// material most people own is the one with a named skin condition attached.
//
// Note the honesty problem here: studies DISAGREE about ceramic. Rather than
// pick the flattering one, both are stated — because the actual lesson is that
// cleaning frequency beats material choice regardless of who's right.
const BOWL_MATERIALS: {
  material: string;
  verdict: "best" | "good" | "avoid";
  b: string;
}[] = [
  {
    material: "Glass",
    verdict: "best",
    b: "Non-porous, nothing leaches, and — unlike ceramic — there's no glaze to contain anything. Won't scratch, so there are no crevices for bacteria to settle into, and you can see when it's actually clean. The only downside is that it breaks. For a calm feeder it's arguably the safest option there is.",
  },
  {
    material: "Stainless steel (304 / 18-8 food grade)",
    verdict: "best",
    b: "The industry default for good reason: non-porous, dishwasher-safe, effectively unbreakable, and nothing to leach. Specify food-grade — cheap unmarked stainless has had contamination issues. One study did find higher total bacterial counts on metal than plastic, which is a reminder that no material substitutes for washing it.",
  },
  {
    material: "Ceramic / stoneware",
    verdict: "good",
    b: "Fine when it's well made, with two real caveats. First, LEAD IN THE GLAZE: pet bowls are not regulated the way human tableware is, and cheap imported ceramics have been found with unsafe lead levels. Buy from a maker who states it's lead-free and food-safe. Second, CHIPS AND CRAZING: once the glaze cracks, the porous clay underneath is exposed and it becomes a bacterial reservoir. Retire a chipped bowl.\n\nThe research is genuinely split — one study found ceramic hosted the most harmful pathogens including E. coli and MRSA, possibly via biofilm; another found ceramic suppressed bacterial growth better than steel or plastic. Intact and washed daily, it's a good bowl.",
  },
  {
    material: "Plastic",
    verdict: "avoid",
    b: "The one clear avoid, for three separate reasons. It carried the highest total bacterial load in testing. It scratches, and those micro-scratches shelter bacteria from any amount of scrubbing. And it causes a named condition — PLASTIC DISH NASAL DERMATITIS, where p-benzylhydroquinone in the plastic blocks melanin production and a black nose develops pink patches. Chewers can also break off and swallow pieces.\n\nThis is the cheapest thing on the list to fix and one of the few genuinely free upgrades in dog care.",
  },
];

// Feeding practice around the bowl itself — temperature and hygiene.
const BOWL_PRACTICE = [
  {
    h: "Wash it every day — more so for wet food",
    b: "Bowls are among the most contaminated objects in a house; one survey put dog water bowls third. Bacterial counts run HIGHER on bowls used for wet or fresh food than dry, so a fresh-fed dog needs the stricter routine. Hot soapy water daily, dishwasher when you can, and a separate sponge from the human dishes.",
  },
  {
    h: "Warm it, don't cook it",
    b: "Cold food straight from the fridge is harder on digestion and much less aromatic, and TCVM has advised against it for a long time. The right way to fix that is a WARM WATER BATH — stand the bowl in hot water for a few minutes. NEVER microwave: it heats unevenly, creates hot spots that can burn a mouth, and degrades some of the fragile nutrients the food was chosen for. Body temperature is the target, not hot.",
  },
  {
    h: "Mind the clock while it thaws or soaks",
    b: "Thawed fresh food and rehydrated raw sit in the bacterial danger zone between about 40°F and 140°F. Two hours at room temperature is the usual limit, and one hour if the room is above 90°F. Soaking for twenty minutes on the counter is fine; leaving a bowl out overnight to thaw is not — do that in the fridge instead.",
  },
];

// Why you cannot compute an omega ratio from a guaranteed analysis. This is the
// single most useful thing an owner can know when comparing two bags, and
// almost nobody knows it — including, until recently, this app.
const GA_MINIMUM_TRAP = [
  {
    h: "\"Min\" is a promise, not a measurement",
    b: "A guaranteed analysis states legal floors and ceilings, not what's actually in the bag. \"Omega-6 (min) 2.5%\" means the company guarantees at least 2.5%. The real figure can be double that, or more, and the label stays perfectly honest.",
  },
  {
    h: "Which makes advertised ratios unreliable",
    b: "If omega-3 is a minimum and omega-6 is also a minimum, dividing one by the other gives you a ratio of two floors — a number that exists nowhere in the food. A company can declare a conservative omega-6 minimum and advertise a beautiful ratio without measuring anything.",
  },
  {
    h: "What to ask for instead",
    b: "A TYPICAL or FULL nutritional analysis reports measured averages, usually as grams per 1,000 kcal or per 100 g. That's arithmetic-grade data. Brands that publish it are showing you something they didn't have to, which is itself a signal. Email and ask for EPA and DHA in milligrams — the good ones answer.",
  },
  {
    h: "The one exception worth trusting",
    b: "Where a brand publishes measured values per 1,000 kcal, that basis cancels out both moisture and calorie density — so a 70%-moisture cooked food and a dry food compare directly, with no conversion. When you can get numbers on that basis, they beat everything else on the label.",
  },
];

// Arachidonic acid, properly. The short version already sits in the omega-6
// panel; this is the evidence layer behind it — including the fact that answers
// the question every owner actually has, which is "is cutting it risky?"
//
// Tier is stated on each item because the honest answer differs a lot by claim:
// the mechanism is textbook, the joint and heart outcomes are trialled, and the
// lipoma link — the reason most people care — is neither.
const AA_EVIDENCE: {
  h: string;
  b: string;
  tier: "established" | "trialled" | "mechanism";
}[] = [
  {
    h: "What it actually does",
    tier: "established",
    b: "Arachidonic acid is the omega-6 the body converts into the signalling molecules that DRIVE inflammation — the series-2 prostaglandins and series-4 leukotrienes. That system is necessary: it's how infection gets fought and wounds heal.\n\nThe problem is surplus. With plenty of AA on hand, those signals fire constantly even with nothing to fight — which is what chronic low-grade inflammation means.\n\nEPA competes for the SAME enzymes and produces a far weaker signal from them. So the ratio between them decides how loudly the inflammatory machinery runs.",
  },
  {
    h: "AAFCO sets NO minimum for it in dogs — and that's the reassurance",
    tier: "established",
    b: "Look at the AAFCO table in this app: linoleic acid is there at 1.1% for adults. Arachidonic acid is not listed at all, for adults OR for growth.\n\nThat omission is deliberate. Dogs carry Δ6-desaturase and readily convert linoleic acid into arachidonic acid themselves — so there's no need to require it in the diet.\n\nCATS ARE DIFFERENT. They lack that enzyme, so AA is genuinely essential for them at 0.02% DM. It's one of the clearest places where cat and dog nutrition part company, and where advice written for one gets wrongly applied to the other.\n\nThe practical consequence: choosing a lower-AA protein cannot create a deficiency in a dog, as long as linoleic acid is adequate.",
  },
  {
    h: "⚠️ But conversion declines with age",
    tier: "established",
    b: "Δ6-desaturase activity falls markedly in older dogs. That's the same enzyme used to make EPA and DHA from plant ALA — which is why a senior dog gets even less out of flaxseed than a young one.\n\nTwo consequences. A senior converts less LA into AA, so the self-supply argument is slightly weaker in an old dog than a young one. And more importantly, a senior converts less ALA into EPA — so PREFORMED marine omega-3 matters more with age, not less.",
  },
  {
    h: "Where lowering AA has actual trial evidence",
    tier: "trialled",
    b: "JOINTS: dogs on a food with 3.5% fish oil omega-3 improved force-plate weight bearing — 82% improved versus 38% on the control food (Roush et al., JAVMA 2010).\n\nHEART: omega-3 reduced arrhythmia risk 2.96-fold and slowed disease progression in dogs with mitral valve disease over 12 months (Nasciutti et al., PLOS ONE 2021), and reduced ventricular arrhythmias in Boxers with ARVC where FLAX OIL did nothing (Smith, Freeman & Rush 2007).\n\nSKIN AND COAT: dull, dry coat and increased shedding is the classic presentation of omega-3 insufficiency, and coat improvement is one of the better-established effects of supplementation.",
  },
  {
    h: "🚩 And where it doesn't — including the reason most people care",
    tier: "mechanism",
    b: "LIPOMAS. The chain runs: high AA → more inflammatory signalling → an environment that favours fatty tumours. Every link is plausible. None of it has been demonstrated in dogs.\n\nNo published canine study links dietary fatty acids to lipoma formation. What IS documented is that obesity is a risk factor, and that age and genetics are the largest drivers.\n\nSo lowering AA is a reasonable thing to do for a lipoma-prone dog — and it should be described as reasonable, not as treatment. Nothing dietary has been shown to shrink a lipoma that already exists.",
  },
];

// Measured arachidonic acid by protein, per 1,000 kcal, from a manufacturer that
// publishes a full nutritional analysis rather than a guaranteed minimum. Real
// numbers from one range beat generalisations about "poultry" and "red meat".
const AA_BY_PROTEIN: { protein: string; aa: string; ratio: string; note: string }[] = [
  { protein: "Rabbit", aa: "0.0", ratio: "4.9:1", note: "The lowest measurable AA in the range — and the highest vitamin E of any recipe at 226 IU." },
  { protein: "Beef (grassfed)", aa: "0.5", ratio: "1.12:1", note: "Lowest AA of the common proteins AND the best ratio. The reason it's the default recommendation for an inflammation-prone dog." },
  { protein: "Turkey", aa: "0.7–0.8", ratio: "5.0–6.0:1", note: "Ratio is slightly WORSE than chicken — but AA is about a third of it, and AA is the metric that matters more. Cooling in TCVM terms where chicken is warming." },
  { protein: "Pork", aa: "0.85", ratio: "4.3:1", note: "Middling on everything. Fine, but not doing anything the others don't do better." },
  { protein: "Chicken", aa: "2.3", ratio: "4.8:1", note: "Roughly 4–5x the AA of beef. Poultry generally runs higher, and chicken is the highest here by a wide margin." },
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
    term: "rawhide",
    severity: "severe",
    reason:
      "The risk here is mechanical, not chemical, and it's the one most owners underestimate. Rawhide softens as a dog chews, and pieces get swallowed whole — which is how it causes choking and intestinal blockage. Blockages are surgical emergencies, and this is one of the more common reasons dogs end up in one. Processing is the second issue: hides are typically treated with lime or sodium sulfide to strip hair, then bleached, and residues vary by origin with little oversight on imported product. There are better ways to satisfy a chewing dog — a raw meaty bone under supervision, a bully stick, or a rubber toy — that carry the same benefit without the swallow-whole failure mode.",
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

  total = Math.max(5, Math.min(100, Math.round(total)));
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

// ── EGG QUALITY ──────────────────────────────────────────────────────────────
// Pastured vs conventional eggs. Held as data rather than prose so the
// comparison reads at a glance, and so every row carries its own citation —
// the same "cite it or don't claim it" rule the ingredient list follows.
//
// Ordered by how much each difference actually matters TO A DOG, which is not
// the same order it matters to a human. Vitamin D leads because dogs make
// almost none of their own.
const EGG_QUALITY: {
  nutrient: string;
  diff: string;
  detail: string;
  source: string;
}[] = [
  {
    nutrient: "Vitamin D",
    diff: "3–4× more",
    detail:
      "Yolks from hens with real outdoor access measured 14.3 µg/100g vs 3.8 µg/100g from indoor hens. This is the one that matters most for a dog: dogs synthesise almost no vitamin D in their skin — they have roughly ten times less of the precursor than we do, and an enzyme that diverts most of what's left into cholesterol. A dog's entire vitamin D supply comes from food, so a food-source difference lands harder for him than it does for you.",
    source: "Kühn et al., Nutrition (2014) · How & Hazewinkel on canine synthesis",
  },
  {
    nutrient: "Omega-6 : omega-3 ratio",
    diff: "Less than half",
    detail:
      "Pastured eggs came in at under half the ratio of caged eggs in the Penn State work. A smaller 2022 analysis found a far wider gap — around 5.7:1 and 10.8:1 for pastured vs 50.6:1 for cage-free — though with only six eggs per group, treat that spread as directional rather than exact.",
    source: "Karsten et al., Renewable Agriculture & Food Systems (2010)",
  },
  {
    nutrient: "Total omega-3",
    diff: "2.5–3× more",
    detail:
      "2.5× in the Penn State comparison; roughly 3× in the 2022 analysis (1.5–1.7% of total fatty acids vs 0.47%). Long-chain omega-3 specifically — the EPA and DHA form, not just plant ALA — was about double.",
    source: "Karsten et al. (2010); Anderson et al., Foods (2022)",
  },
  {
    nutrient: "Carotenoids",
    diff: "About 2× more",
    detail:
      "Around 41–49 µg/g of fresh yolk vs 18 µg/g in cage-free. These are the pigments that make a pastured yolk deep orange instead of pale yellow — lutein and zeaxanthin, which concentrate in the retina. The colour difference you can see in the pan is the nutrient difference.",
    source: "Anderson et al., Foods (2022)",
  },
  {
    nutrient: "Vitamin E",
    diff: "About 2× more",
    detail:
      "Doubled in the Penn State study, with grass-forage hens producing 23% more than clover-forage hens. Worth flagging that the 2022 analysis found no vitamin E difference — but it measured only free alpha-tocopherol rather than the total, which its own authors list as a limitation. The evidence leans toward a real advantage, not proves it.",
    source: "Karsten et al. (2010)",
  },
  {
    nutrient: "Vitamin A",
    diff: "38% higher concentration",
    detail:
      "Higher per gram of yolk — but total vitamin A per egg did not differ significantly, because pastured hens lay slightly smaller eggs. An honest read: the yolk is richer, the whole egg is about the same.",
    source: "Karsten et al. (2010)",
  },
];

// What the carton actually claims, ranked by how much the claim is worth.
// `tier` drives the colour: "good" = a defined standard someone audits,
// "mixed" = real but weak, "empty" = marketing with no standard behind it.
//
// The single most useful fact here: the USDA does NOT define "pasture-raised."
// Without a certifier's seal it's a word the marketing team chose.
const EGG_LABELS: {
  label: string;
  tier: "good" | "mixed" | "empty";
  means: string;
}[] = [
  {
    label: "Pasture-Raised + a certifier's seal",
    tier: "good",
    means:
      "The real thing, and the only claim worth paying up for. Certified Humane requires 108 sq ft per hen of living vegetative cover — actual growing plants, not bare dirt or a concrete slab. Animal Welfare Approved (A Greener World) is comparable. This is the standard the research above was measuring.",
  },
  {
    label: "Pasture-Raised, no seal",
    tier: "mixed",
    means:
      "The USDA does not define this term at all. Uncertified, it means whatever the company wants it to mean. It might be genuine — plenty of small farms are honest and simply haven't paid for certification — but the carton alone isn't evidence. Look at the yolk before you trust it.",
  },
  {
    label: "Free-Range",
    tier: "mixed",
    means:
      "USDA-regulated but hollow: it requires outdoor access without specifying how much space or for how long. A single small door to a porch can qualify a whole barn. Certified Humane tightens it to 2 sq ft per hen and 6 hours a day, which is real but still a long way from 108. This is the tier where tested supermarket eggs came back low on vitamin D.",
  },
  {
    label: "Organic",
    tier: "mixed",
    means:
      "Genuinely meaningful for feed — organic grain, no antibiotics, no hormones — and that's worth something on its own. But its outdoor-access requirement is as loose as free-range, so an organic egg is not automatically a pasture egg. Best used alongside a pasture claim, not instead of one.",
  },
  {
    label: "Cage-Free",
    tier: "mixed",
    means:
      "Means only that the hens aren't in individual cages. It carries no outdoor requirement whatsoever — a cage-free hen can spend her entire life indoors. Better than battery cages for the bird; close to irrelevant for the nutrients in the yolk.",
  },
  {
    label: "Omega-3 Enriched",
    tier: "mixed",
    means:
      "Real, but check the source on the back. Flaxseed-fed hens raise ALA, the plant omega-3 that dogs convert to EPA and DHA very poorly. Algae- or fish-fed hens raise actual DHA, which is the one you want. If the carton won't say which, assume flax.",
  },
  {
    label: "Vegetarian-Fed",
    tier: "empty",
    means:
      "Marketed as a plus, but it's the opposite — this is the clearest tell on the whole carton. Hens are omnivores; one on real pasture eats insects and worms all day. A hen can only be certified vegetarian if she was kept away from anything living, which means she was never on grass. Vegetarian-fed and pasture-raised are close to mutually exclusive.",
  },
  {
    label: "Farm Fresh · All Natural · Nature's ___",
    tier: "empty",
    means:
      "No standard, no definition, no one checking. Every egg sold is from a farm and every egg is natural. Ignore these entirely — they're carton decoration.",
  },
];

// The two caveats that keep the table above from being oversold. Both matter
// more than any single row in it.
const EGG_QUALITY_CAVEATS = [
  {
    title: "The carton label is not the thing",
    body:
      "\"Cage-free\" means only that the hens aren't in cages — it says nothing about daylight or grass. \"Free-range\" requires some outdoor access, but not that the birds use it. When Australian researchers tested supermarket free-range eggs, vitamin D came back low. What produces the difference is hens actually outside on pasture, which is why eggs from a farm stand or a neighbour usually beat a premium carton.",
  },
  {
    title: "Keep it in proportion",
    body:
      "One egg a day is a small slice of a dog's diet. The omega-3 upgrade works out to roughly a tenth of a gram — real, but a rounding error next to sardines or fish oil. The vitamin D, the carotenoids and the vitamin E are where a better egg genuinely earns its price. A conventional egg is still a good food, and feeding one daily beats skipping it because the good ones weren't available.",
  },
];

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
    note: "A novel protein for many dogs. Watch fat content. In TCVM pork is neutral-to-cooling — a good choice for a dog who runs hot, and one of the few common proteins that is." },
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

/**
 * Carbohydrate penalty — a taper, not a staircase.
 *
 * The old version stepped 32/25/22/12/10/5, which meant a food at 44% carbs and one
 * at 36% could take the same hit while 35% and 36% differed by 10 points. Cliff edges
 * in a score are unfair in both directions.
 *
 * Now: nothing below 20% (dogs have no carbohydrate requirement, but a modest amount
 * isn't a fault), then a straight line up to a cap. Max is 24 rather than 32 — high
 * carbohydrate is genuinely poor, but it was previously outweighing several harmful
 * additives combined, which misrepresented what this app is actually about.
 */
function carbPenaltyFor(estCarbPct: number): number {
  if (estCarbPct <= 20) return 0;
  return Math.min(24, Math.round((estCarbPct - 20) * 0.8));
}

/**
 * Synthetic vitamin/mineral load — weighted by WHICH, not just how many.
 *
 * Counting every added vitamin equally was the flaw: thiamine mononitrate, riboflavin
 * and calcium pantothenate are safe synthetic forms, chemically equivalent to the
 * natural ones. A food using twelve of those is not worse than one using four
 * problem forms. Kyle's own research says exactly this.
 *
 * So concerning forms are weighted 3x, poor-absorption forms 1x, and the total tapers
 * to a cap instead of stepping.
 */
const VITAMIN_CONCERN_HIGH = [
  "menadione",
  "sodium selenite",
  "sodium selenate",
  "copper sulfate",
  "ferric oxide",
];
const VITAMIN_CONCERN_LOW = [
  "zinc oxide",
  "zinc sulfate",
  "magnesium oxide",
  "dl-alpha tocopherol",
  "retinyl palmitate",
  "retinyl acetate",
  "pyridoxine hydrochloride",
  "cholecalciferol",
  "vitamin d3 supplement",
  "vitamin d supplement",
  "vitamin a supplement",
  "dl-methionine",
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

// Tint behind the score hero. Thresholds MIRROR getScoreColor above — if you
// change one, change the other, or the number stops matching its own ground.
// (Presentation only. The scoring math is untouched.)
function getScoreTint(score: number): string {
  if (score >= 70) return t.goodTint;
  if (score >= 50) return t.highTint;
  if (score >= 30) return t.highTint;
  return t.criticalTint;
}

// The one line under the label. Short, and never shaming — "here's what's in
// it", not "this food is bad". See docs/THE_LADDER.md on tone.
function getScoreSubline(score: number): string {
  if (score >= 70) return "A solid bag — details below";
  if (score >= 30) return "Mostly fixable — see below";
  return "Worth upgrading — see below";
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

// ── LIPOMAS ────────────────────────────────────────────────────────────────
// Rebuilt 2026-08-20 from Kyle's own holistic research, which REPLACES the
// previous section entirely (his instruction). Two things the old section said
// are now reversed and that's deliberate: it recommended green-lipped mussel and
// duck for lipoma-prone dogs; the TCVM framing lists both as damp-building.
//
// Evidence tiers are attached per PINECONE_PROTOCOL.md and Kyle's standing rule
// (2026-08-13): holistic claims are welcome, they just get labelled. The doses
// below are as given by the practitioners who recommend them — none of the
// dissolving protocols has been tested against a lipoma in a controlled canine
// trial, and the section says so once, plainly, rather than hedging every line.
const LIPOMA_WORRY = [
  { t: "Feel the whole dog, every day", b: "Legs, belly, mammary glands, armpits — not just the obvious spots. You are looking for something NEW, or something old that has changed." },
  { t: "Never diagnose a lump by look or feel", b: "Mast cell tumours are the great imitators — they can look and feel identical to a skin tag, a nipple, or a harmless fatty lump. Only cells under a microscope tell you which it is." },
  { t: "Surface lumps → impression smear", b: "Your vet presses a slide to the surface to collect cells. Quick, no needle." },
  { t: "Deep lumps → fine needle aspirate", b: "A needle draws cells from the CENTRE of the mass. This is what confirms a true lipoma rather than something wearing its costume." },
];

const LIPOMA_RED_FLAGS = [
  "A brand-new lump you have not felt before",
  "An old lump that suddenly changes size, shape or texture",
  "Irregular borders, or fast growth",
  "Your dog licking or obsessing over one spot",
];

const LIPOMA_PREVENT = [
  { icon: "🍲", t: "Get off dry kibble", b: "Move to fresh, raw or gently cooked. High-carbohydrate, highly processed food is the first thing to change." },
  { icon: "🚫", t: "Cut the damp-building foods", b: "Pork, fatty meats (lamb and duck), green-lipped mussel, eggs, honey, spirulina, slippery elm, marshmallow root." },
  { icon: "🌿", t: "Add the drying foods", b: "Celery, alfalfa, chamomile, turmeric, parsley, pumpkin, ginger, kelp, seaweed — and baked sweet potato. Bake or roast it; boiling does the opposite." },
  { icon: "🌡️", t: "Never serve food cold", b: "Straight from the fridge damages digestive energy and builds dampness. Warm it slightly or leave it out to reach room temperature." },
  { icon: "🏃", t: "Move the lymph", b: "The lymphatic system carries fat. Regular exercise and lower-back stimulation keep it moving and stop fatty congestion." },
  { icon: "💉", t: "Reduce the chemical load", b: "Avoid over-vaccinating and unnecessary medication. Levothyroxine, gabapentin and NSAIDs are hard on the liver and are repeatedly linked to multiple lipomas by practitioners." },
  { icon: "🕷️", t: "Rule out tick-borne disease", b: "Chronic infection like Lyme congests the liver and immune system. If your dog has MULTIPLE bumps, ask your vet for a C6 antibody test." },
];

const LIPOMA_REMEDIES = [
  { t: "L-Carnitine", d: "50 mg per kg body weight, twice daily", b: "Amino acid that targets fat metabolism to break down fat cells." },
  { t: "Green tea extract", d: "50 mg per 10 lb daily, sprinkled on food", b: "Concentrated extract raises metabolic rate and fat oxidation. Extract, not brewed tea." },
  { t: "Colostrum", d: "100 mg per 10 lb daily", b: "Promotes muscle mass and raises metabolic rate, reducing fat storage." },
  { t: "MCT oil (from coconut)", d: "Start ½ tsp per 20 lb daily → 1 tsp per 20 lb after 4 weeks", b: "Converts to ketones and lifts metabolic rate. Start low or you get diarrhoea." },
  { t: "Turkey tail + maitake mushroom", d: "20 lb dog: 0.5–1 g twice daily, hot-water extracted", b: "Turkey tail supports Phase II liver detoxification. Hot-water extracted matters — the raw powder is not the same product." },
  { t: "Topical DMSO + aloe vera", d: "70% DMSO with aloe, applied to the lipoma twice daily", b: "DMSO penetrates deeply and triggers a local immune response. ⚠️ Always wear gloves — DMSO carries whatever is on the skin straight into the bloodstream, yours included." },
  { t: "Digestive enzymes", d: "With meals, 3–6 months after leaving kibble", b: "Supports fat digestion while the gut rebuilds. Integrative vets also prescribe custom phlegm-draining herbs." },
];

const LIPOMA_HERBS = [
  { k: "cool", label: "❄️ For COOL dogs", tell: "Seeks warmth, wants blankets, curls up", herbs: "Calendula tincture (lymphatics) · Ashwagandha (especially if hypothyroid) · Turmeric · Self-heal (Prunella vulgaris)" },
  { k: "warm", label: "🔥 For WARM dogs", tell: "Pants, seeks cold floors, sprawls out", herbs: "Cleavers tincture (lymphatics) · Burdock root (helps process fats) · Chickweed · Violet" },
];

const LIPOMA_TINCTURE_DOSE = [
  ["Chihuahua-sized", "1 drop"],
  ["20 lb (King Charles)", "2 drops"],
  ["Corgi-sized", "3–4 drops"],
  ["Golden Retriever", "4–5 drops"],
  ["Giant breed", "5–6 drops"],
];

function LipomaSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>🧬 Lumps, Bumps &amp; Lipomas</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        When to worry, how to prevent them, and what holistic vets use to shrink them.
      </Text>

      {/* ── 1. WHEN TO WORRY ── */}
      <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.critical }}>
        <Text style={{ color: t.critical, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>1 · When to worry about a lump</Text>
        {LIPOMA_WORRY.map((item, i) => (
          <View key={i} style={{ marginBottom: 7 }}>
            <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700" }}>{item.t}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{item.b}</Text>
          </View>
        ))}
        <Text style={{ color: t.critical, fontSize: 12, fontWeight: "700", marginTop: 4, marginBottom: 3 }}>See a vet promptly if:</Text>
        {LIPOMA_RED_FLAGS.map((f, i) => (
          <Text key={i} style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>• {f}</Text>
        ))}
        <Text style={{ color: t.textDim, fontSize: 11.5, marginTop: 7, lineHeight: 16, fontStyle: "italic" }}>
          A lump that has not changed at all in five years is very likely nothing.
        </Text>
      </View>

      {/* ── SURGERY ── */}
      <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
        <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5, marginBottom: 5 }}>When a confirmed lipoma still needs removing</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          True lipomas are benign and usually do not need surgery. Two exceptions: when one grows
          large enough to <Text style={{ fontWeight: "700" }}>interfere with movement</Text> — especially
          in the armpit or groin — and when it gets big enough to outgrow its own blood supply, so the
          core dies, liquefies and drains a thick pus-like fluid. That fluid is dead tissue, not infection.
        </Text>
        <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17.5 }}>
          If it is coming out, take it while it is still a manageable size. A grapefruit-sized removal
          leaves a large empty pocket under the skin that has to heal.
        </Text>
      </View>

      {/* ── 2. PREVENTION ── */}
      <View style={{ backgroundColor: t.accents.liver.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.liver.fg }}>
        <Text style={{ color: t.accents.liver.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>2 · Preventing them — the TCVM view</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 9 }}>
          In Traditional Chinese Veterinary Medicine a lipoma is a pocket of{" "}
          <Text style={{ fontWeight: "700" }}>abnormal phlegm</Text> the body uses to wall off toxins.
          They cluster along the <Text style={{ fontWeight: "700" }}>gallbladder meridian</Text> —
          armpits, flanks and inner hind legs — and are driven by liver congestion. Prevention means
          lowering the toxin load and clearing internal dampness.
        </Text>
        {LIPOMA_PREVENT.map((item, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 7 }}>
            <Text style={{ fontSize: 14 }}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700" }}>{item.t}</Text>
              <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{item.b}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── 3. REMEDIES ── */}
      <View style={{ backgroundColor: t.accents.detox.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.detox.fg }}>
        <Text style={{ color: t.accents.detox.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>3 · What holistic vets use to shrink them</Text>
        <Text style={{ color: t.textDim, fontSize: 11.5, lineHeight: 16.5, marginBottom: 9, fontStyle: "italic" }}>
          Clinical experience, not trial evidence. These are the protocols integrative vets report
          using and the doses they give — none has been tested against a lipoma in a controlled
          canine trial. Run any of them past your own vet, especially alongside medication.
        </Text>
        {LIPOMA_REMEDIES.map((item, i) => (
          <View key={i} style={{ marginBottom: 9 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{item.t}</Text>
            <Text style={{ color: t.accents.detox.fg, fontSize: 12, fontWeight: "600" }}>{item.d}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{item.b}</Text>
          </View>
        ))}
      </View>

      {/* ── HERBS BY CONSTITUTION ── */}
      <View style={{ backgroundColor: t.accents.mussel.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.mussel.fg }}>
        <Text style={{ color: t.accents.mussel.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>Herbs — pick by your dog&apos;s energetics</Text>
        {LIPOMA_HERBS.map((h) => (
          <View key={h.k} style={{ marginBottom: 8 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{h.label}</Text>
            <Text style={{ color: t.textDim, fontSize: 11.5, fontStyle: "italic" }}>{h.tell}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{h.herbs}</Text>
          </View>
        ))}
        <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700", marginTop: 4, marginBottom: 3 }}>
          Calendula / cleavers tincture — drops twice daily, in the mouth
        </Text>
        {LIPOMA_TINCTURE_DOSE.map(([size, dose], i) => (
          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={{ color: t.text, fontSize: 12 }}>{size}</Text>
            <Text style={{ color: t.accents.mussel.fg, fontSize: 12, fontWeight: "600" }}>{dose}</Text>
          </View>
        ))}
        <Text style={{ color: t.textDim, fontSize: 11.5, marginTop: 7, lineHeight: 16, fontStyle: "italic" }}>
          Introduce one herb at a time, three days apart, so you know what caused a reaction.
        </Text>
      </View>

      {/* Kyle's lipoma reference card. Added 2026-08-22. */}
      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 12 }}>
        Save this
      </Text>
      <Image
        source={require("../assets/images/lipoma-guide.jpg")}
        style={{ width: "100%", aspectRatio: 1800 / 1004, borderRadius: 9, marginTop: 6 }}
        resizeMode="contain"
        accessibilityLabel="Holistic guide to pet lipomas — what causes them, red flags that mean it isn't a lipoma, prevention, and herbal remedies"
      />

      <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17, marginTop: 10 }}>
        ⚠️ Educational only, not veterinary advice. Any new lump — or any old lump that changes —
        gets cells looked at before you treat it as a lipoma.
      </Text>
    </View>
  );
}

// ── HEART ──────────────────────────────────────────────────────────────────
// Added 2026-08-20 from Kyle's holistic heart research. Same handling as the
// lipoma section: the protocols and doses are given as the practitioners give
// them, labelled once as clinical rather than trial evidence.
//
// One thing is deliberately pinned to the top rather than buried: this is
// ALONGSIDE Vetmedin and Lasix, never instead. The source says so itself, but
// the dandelion-diuretic paragraph reads like a substitute on a skim, and in
// congestive failure furosemide is what keeps fluid out of the lungs. The
// resting-respiratory-rate number leads for the same reason — it is the one
// item here that is also standard cardiology practice, and it is what tells an
// owner they need a vet tonight.
const HEART_FEED = [
  { t: "Muscle meat and organs", b: "Beef heart, pork heart, beef liver, beef tongue, chicken gizzards. Heart muscle feeds heart muscle — the 'like feeds like' principle." },
  { t: "Dark meat, not breast", b: "Thighs, wings and legs carry markedly more of the heart-relevant amino acids than white breast meat. Cheap and easy to switch." },
  { t: "Fresh omega-3", b: "Canned sardines packed in water, fresh salmon, cod skin rolls, minnows. The goal is lowering inflammation in the heart muscle itself." },
  { t: "Raw goat's milk", b: "Highly digestible and naturally carries carnitine, taurine, vitamin D and GABA." },
];

const HEART_TCVM_FOODS = [
  { k: "Qi tonics (pumping energy)", v: "Beef · dark meat poultry · rabbit · pumpkin · butternut and acorn squash · shiitake" },
  { k: "Blood tonics", v: "Red meats · egg yolks · carrots · spinach · kale · dates · figs" },
  { k: "Fluid-draining foods", v: "Asparagus (drains fluid from the heart via the kidneys) · celery · watermelon · parsley · dandelion greens · radish · turnip" },
  { k: "Lung protection", v: "Shiitake — dissolves phlegm and drains damp, which matters when fluid is the risk" },
];

const HEART_SUPPS = [
  { t: "CoQ10", d: "100 mg per 20 lb (~5 mg/lb), twice daily", b: "Supports failing heart muscle cells. The label dose on most bottles — around 1 mg/lb — is considered too low to affect heart enlargement. Cats under 10 lb: 50–100 mg twice daily." },
  { t: "Taurine", d: "Large DCM-prone breeds: up to 8,000 mg daily", b: "Concentrated in heart muscle. Grain-free kibbles that swap meat for pea protein are the ones linked to deficiency. There is no known toxic dose of taurine." },
  { t: "L-carnitine", d: "Alongside taurine", b: "The other amino acid concentrated in heart muscle. Both are depleted by low-meat diets." },
  { t: "Dandelion leaf + root tincture", d: "0.5 mL per 20 lb, twice daily", b: "A studied herbal diuretic that helps clear airway fluid and cardiac cough. ⚠️ An ADDITION to prescribed diuretics, never a replacement — talk to your vet before changing any Lasix dose." },
  { t: "CBD", d: "1 mg per 10 lb, twice daily", b: "Acts as a vasodilator, lowering the pressure the heart pumps against, and improves cerebral blood flow. Tell your vet — CBD affects the liver enzymes that also process cardiac drugs." },
  { t: "Omega-3 oil", d: "Sardine, anchovy or salmon", b: "Must come in brushed aluminium or a glass pump bottle — clear plastic lets it oxidise and go rancid. Algae oil or phytoplankton work for dogs that react to fish protein." },
  { t: "D-ribose", d: "—", b: "A readily-used sugar that feeds the heart muscle directly as an energy source." },
  { t: "Vitamin D3 and E", d: "Test D3 before supplementing", b: "Seniors and heart patients are often low in D3. Vitamin E is needed for heart muscle function and should always accompany fish oil." },
  { t: "PEA (palmitoylethanolamide)", d: "—", b: "Plant-based, works through the endocannabinoid system to lower the systemic inflammation that accompanies mitral valve disease." },
  { t: "Hawthorn", d: "—", b: "The classic Western heart herb, used to improve heart function directly." },
];

const HEART_FORMULAS = [
  ["Four Substances", "Underlying anaemia and the heart murmurs that follow it"],
  ["Emperor's Tea Pills", "Night anxiety, pacing, vocalising"],
  ["Stasis in the Mansion of the Blood", "Tonifies Heart Qi and moves pooling blood"],
];

function HeartSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>❤️ Heart Support</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        The holistic and TCVM approach to DCM and mitral valve disease — used alongside cardiology,
        not instead of it.
      </Text>

      {/* ── THE SAFETY FRAME, FIRST ── */}
      <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.critical }}>
        <Text style={{ color: t.critical, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>Read this before anything below</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          Everything here is designed to run <Text style={{ fontWeight: "700" }}>alongside</Text> Vetmedin
          and prescribed diuretics like Lasix (furosemide). In congestive failure, furosemide is what
          keeps fluid out of the lungs. <Text style={{ fontWeight: "700" }}>Do not reduce or replace a
          prescribed diuretic with an herbal one</Text> — add, discuss, then let your vet adjust.
        </Text>
        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginTop: 9, marginBottom: 3 }}>
          🫁 The number to count at home: resting respiratory rate
        </Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          Count breaths for a minute while your dog is asleep or fully at rest. It should stay{" "}
          <Text style={{ fontWeight: "700" }}>under 30–35 breaths per minute.</Text> A climbing count is
          the earliest sign fluid is building, often before a cough. This is the one item on this page
          that is also standard cardiology practice — track it daily and bring the numbers to your vet.
        </Text>
        <Text style={{ color: t.critical, fontSize: 12, fontWeight: "700", marginTop: 7, lineHeight: 17 }}>
          Sudden laboured breathing is an emergency. Go to a vet — do not manage it at home.
        </Text>
      </View>

      {/* ── WARNING SIGNS + BREED RISK ── */}
      <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.accents.heart.fg }}>
        <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>Spotting it early</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 9 }}>
          Cardiac disease is one of the leading identified causes of sudden death in dogs. Worth knowing
          how uncertain that picture is: in a 150-dog necropsy series it ranked behind occult cancer
          (mostly hemangiosarcoma), while a larger multicentre study found cardiovascular disease the
          most common identified cause — and <Text style={{ fontWeight: "700" }}>37% of sudden deaths had
          no cause found even after necropsy.</Text> Which is the real argument for watching for signs
          rather than waiting for certainty.
        </Text>

        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
          🌙 The night cough and restlessness
        </Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 9 }}>
          Coughing at night, or being unable to settle and get comfortable lying down, is often fluid
          building in the lungs. It shows up at night because lying flat makes it harder to breathe
          around the fluid. <Text style={{ fontWeight: "700" }}>A dog that suddenly wants to sleep sitting
          up, or keeps repositioning, is telling you something.</Text>
        </Text>

        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
          🐕 Your breed changes what to watch for
        </Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          <Text style={{ fontWeight: "700" }}>Small breeds</Text> — Poodles, Cavalier King Charles
          Spaniels — typically face <Text style={{ fontWeight: "700" }}>mitral valve disease</Text>, which
          usually announces itself as a murmur first and progresses slowly.
        </Text>
        <Text style={{ color: t.text, fontSize: 12, marginTop: 5, lineHeight: 17.5 }}>
          <Text style={{ fontWeight: "700" }}>Large breeds</Text> — Dobermans, Great Danes — are prone
          to <Text style={{ fontWeight: "700" }}>DCM</Text>, which is the more dangerous pattern because
          it can stay silent and then present suddenly. If you have one of these breeds, screening before
          symptoms is the whole game.
        </Text>
      </View>

      {/* ── TCVM FRAMING ── */}
      <View style={{ backgroundColor: t.accents.liver.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.liver.fg }}>
        <Text style={{ color: t.accents.liver.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>How TCVM reads a failing heart</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          Heart disease is an imbalance of the <Text style={{ fontWeight: "700" }}>Fire element</Text>.
          Failure and enlargement are read as <Text style={{ fontWeight: "700" }}>Heart Qi deficiency</Text> —
          not enough pumping energy — together with <Text style={{ fontWeight: "700" }}>blood stagnation</Text>,
          where blood pools and slows. Treatment therefore uses Qi tonics, blood-building tonics, and
          ingredients that move blood.
        </Text>
        <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
          <Text style={{ fontWeight: "700" }}>Like feeds like.</Text> Feeding heart muscle nourishes the
          heart; feeding lung supports the lungs when fluid is the risk.
        </Text>
        <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
          <Text style={{ fontWeight: "700" }}>🦷 The mouth-heart connection.</Text> Bacteria from dental
          disease travel the bloodstream and filter through the heart valves and kidneys, accelerating
          organ damage. Dental cleanings should still happen for heart patients — with close anaesthetic
          and cardiac monitoring, not skipped out of fear.
        </Text>
      </View>

      {/* ── WHAT TO FEED ── */}
      <View style={{ backgroundColor: t.accents.detox.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.detox.fg }}>
        <Text style={{ color: t.accents.detox.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>What to feed</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 9 }}>
          Fresh and meat-based over dry kibble — the argument being that kibble is short on meat protein,
          high in carbohydrate dogs have no requirement for, and carries synthetic mineral forms.
        </Text>
        {HEART_FEED.map((item, i) => (
          <View key={i} style={{ marginBottom: 7 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{item.t}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{item.b}</Text>
          </View>
        ))}
        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginTop: 6, marginBottom: 4 }}>TCVM food categories</Text>
        {HEART_TCVM_FOODS.map((f, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <Text style={{ color: t.accents.detox.fg, fontSize: 12, fontWeight: "600" }}>{f.k}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{f.v}</Text>
          </View>
        ))}
      </View>

      {/* ── THE RECIPE ── */}
      <View style={{ backgroundColor: t.accents.mussel.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.mussel.fg }}>
        <Text style={{ color: t.accents.mussel.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>Dr. Judy Morgan&apos;s heart recipe</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
          90% lean ground beef · beef heart · beef liver · fresh salmon · butternut squash · asparagus ·
          kale · whole eggs with ground shells for calcium · cranberries · shiitake · seaweed powder for
          iodine · virgin wheat germ oil for vitamin E · ground sunflower seeds · green-lipped mussel.
        </Text>
        <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
          Serve raw, baked at <Text style={{ fontWeight: "700" }}>325°F for 30 minutes</Text>, or slow-cooked
          for 4 hours. <Text style={{ fontWeight: "700" }}>Feed all the natural juices</Text> — the minerals
          leach into them.
        </Text>
      </View>

      {/* ── SUPPLEMENTS ── */}
      <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.accents.heart.fg }}>
        <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 13, marginBottom: 4 }}>Supplements and doses</Text>
        <Text style={{ color: t.textDim, fontSize: 11.5, lineHeight: 16.5, marginBottom: 9, fontStyle: "italic" }}>
          Holistic practitioners favour single-ingredient products over blends, because blends rarely
          reach a therapeutic dose of anything. These are the doses they use — clinical practice, not
          controlled trial evidence. Clear them with your vet, especially alongside cardiac medication.
        </Text>
        {HEART_SUPPS.map((s, i) => (
          <View key={i} style={{ marginBottom: 9 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{s.t}</Text>
            {s.d !== "—" && (
              <Text style={{ color: t.accents.heart.fg, fontSize: 12, fontWeight: "600" }}>{s.d}</Text>
            )}
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{s.b}</Text>
          </View>
        ))}
      </View>

      {/* ── CHINESE FORMULAS ── */}
      <View style={{ backgroundColor: t.accents.probiotic.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.probiotic.fg }}>
        <Text style={{ color: t.accents.probiotic.fg, fontWeight: "700", fontSize: 13, marginBottom: 5 }}>Chinese herbal formulas</Text>
        {HEART_FORMULAS.map(([name, use], i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{name}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{use}</Text>
          </View>
        ))}
        <Text style={{ color: t.textDim, fontSize: 11.5, marginTop: 6, lineHeight: 16, fontStyle: "italic" }}>
          These are prescribed by a TCVM-trained vet after a pattern diagnosis — they are matched to the
          individual dog, not bought off a shelf.
        </Text>
      </View>

      {/* Kyle's heart reference card. Added 2026-08-22. */}
      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 12 }}>
        Save this
      </Text>
      <Image
        source={require("../assets/images/heart-guide.jpg")}
        style={{ width: "100%", aspectRatio: 1800 / 1004, borderRadius: 9, marginTop: 6 }}
        resizeMode="contain"
        accessibilityLabel="Holistic canine heart health guide — warning signs, breed risk, foods that feed the heart, TCVM energetics and supportive supplements"
      />

      <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17, marginTop: 10 }}>
        ⚠️ Educational only, not veterinary advice. Heart disease is managed with a vet — this is what to
        bring to that conversation, not a replacement for it.
      </Text>
    </View>
  );
}

// ── MORE FACTS ABOUT PET FOOD ──────────────────────────────────────────────
// Added 2026-08-20. Documented events and regulatory facts — the things that
// happened, with names and numbers attached. Every entry here is verifiable;
// this is deliberately the section with no opinion in it.
const PET_FOOD_FACTS = [
  {
    icon: "💉",
    title: "107 million cans recalled for a euthanasia drug",
    body:
      "February 2018. The FDA and J.M. Smucker recalled over 107 million cans of Gravy Train, Kibbles 'n Bits, Skippy and Ol' Roy after pentobarbital — the drug used to euthanise animals — was found in the food.\n\nSmucker confirmed the source was the TALLOW: rendered animal fat. That is the company admitting it, not an advocate alleging it.\n\nIndependent lab testing found 60% of the Gravy Train cans sampled came back positive. The FDA's position is that pentobarbital should never be present in pet food, and that any amount makes a product adulterated.",
  },
  {
    icon: "🥩",
    title: "By-products come from animals that have died",
    body:
      "The source stream includes 4D animals — dead, dying, diseased and disabled. Dr. Andrew Jones, DVM, states this includes roadkill and animals that have been euthanised.\n\nAAFCO's written definition says by-products come from SLAUGHTERED animals. The 2018 recall is what that definition is worth in practice.\n\nThe species is never named on the label, so you have no way to know what went into the batch you bought.",
  },
  {
    icon: "🥉",
    title: "There is no legal maximum for copper in dog food",
    body:
      "AAFCO deleted the copper maximum in 2007 and has never restored it, despite veterinary hepatologists formally asking. There is a minimum (7.3 mg/kg) and no ceiling at all.\n\nCopper accumulates in the liver and dogs cannot clear the excess. Labradors, Dobermans, Bedlington Terriers, West Highland Whites and Dalmatians are documented as predisposed.\n\nLiver enzymes are not sensitive in the early stages — normal bloodwork does not rule it out.",
  },
  {
    icon: "☠️",
    title: "Melamine killed thousands of pets in 2007",
    body:
      "Melamine — an industrial chemical with no approved use in any food — was added to wheat gluten and rice protein concentrate to inflate apparent protein readings. Standard protein tests measure nitrogen, and melamine is nitrogen-rich, so it made cheap filler test like meat.\n\nCombined with cyanuric acid it forms crystals that cause acute kidney failure. Thousands of pets died, and it produced one of the largest recalls in pet food history.",
  },
  {
    icon: "🌡️",
    title: "Vitamin D overdoses have hit multiple brands",
    body:
      "FDA recalls in 2018–19 found dog foods containing up to 70 times the intended vitamin D, causing hypercalcemia, kidney failure and deaths. Affected brands included Hill's, Nutrisca, Sunshine Mills, Kroger and ELM.\n\nVitamin D has one of the narrowest safe ranges of any nutrient — AAFCO sets 500 IU/kg minimum and 3,000 maximum. An ingredient label tells you D3 is present. It cannot tell you how much.",
  },
  {
    icon: "📋",
    title: "\"Meets AAFCO standards\" is a floor, not a grade",
    body:
      "AAFCO is not a regulator. It is a voluntary membership association of state feed officials with no enforcement power — people hear the name and assume FDA.\n\nThe nutrient profiles are MINIMUMS designed to prevent deficiency disease, not targets for health. The feeding trial standard is 26 weeks with 8 dogs, of which 6 must finish.\n\nUse it to rule a food OUT. Never to rule one IN.",
  },
  {
    icon: "🐟",
    title: "Ingredients are weighed before cooking",
    body:
      "The ingredient list is ordered by weight as the ingredients go in — not as they come out. Fresh meat is roughly 70% water, and most of that water leaves during extrusion.\n\nThis is why a bag can read \"Chicken, corn, wheat, corn gluten meal\" and still be mostly grain by the time it reaches the bowl. The chicken was heaviest at the start of the process, not the end.",
  },
];

function PetFoodFactsSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>📚 More Facts About Pet Food</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        Things that actually happened, with names and numbers attached. No opinions in this section —
        every item here is a documented event or a regulatory fact.
      </Text>

      {PET_FOOD_FACTS.map((f, i) => (
        <View
          key={i}
          style={{
            backgroundColor: t.surfaceSunken,
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
            borderLeftWidth: 3,
            borderLeftColor: t.critical,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <Text style={{ fontSize: 15 }}>{f.icon}</Text>
            <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 13, flex: 1 }}>{f.title}</Text>
          </View>
          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{f.body}</Text>
        </View>
      ))}

      <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17, marginTop: 4 }}>
        Sources: FDA recall notices and advisories · AAFCO Dog Food Nutrient Profiles · J.M. Smucker
        public statements · Dr. Andrew Jones, DVM.
      </Text>
    </View>
  );
}

// ── THE KIBBLE PROBLEM + SYNTHETIC PREMIXES ────────────────────────────────
// Added 2026-08-20 from Kyle's holistic sources. Replaces the older, thinner
// vitamin/mineral copy (archived, not deleted — see docs/ARCHIVE_NOTES.md).
//
// Three corrections were made to the source material, all factual rather than
// positional, and all flagged to Kyle:
//   • "sodium bisulfite" is not a separate preservative — it is part of the
//     compound name "menadione sodium bisulfite complex". Listed separately it
//     reads as not knowing the material.
//   • glyphosate is a HERBICIDE, not an insecticide.
//   • the dehydration→lipoma line was dropped. Today's four-lens research found
//     no established diet-lipoma link in dogs; keeping it here would contradict
//     the app's own lipoma section.
const KIBBLE_PROBLEMS = [
  { icon: "💧", t: "Moisture — 6–8% vs 75% in prey",
    b: "Pets evolved eating high-moisture food; natural prey runs about 75% water. Dry kibble is 6–8%. Holistic vets argue this keeps an animal in mild chronic dehydration, drawing moisture from its own cells to digest — straining kidneys and bladder, and encouraging urinary crystals and bladder infections. ⚪ Mechanism and clinical observation; the moisture figures themselves are simply label facts." },
  { icon: "🍞", t: "Carbohydrate load",
    b: "Dogs have NO biological requirement for carbohydrate. Kibble still runs heavy on corn, wheat, soy, potato, peas and lentils because starch is what holds the shape — you cannot extrude a kibble without it. Holistic practitioners link the resulting insulin load to obesity, diabetes, arthritis, IBD, leaky gut and SIBO, and note that high-carb diets push urine pH alkaline (~7.5), which favours bacterial colonisation. ⚪ The zero-requirement fact is established (NRC); the disease links are mechanistic and clinical." },
  { icon: "🏭", t: "Cooked four to five times",
    b: "Rendering, drying and extrusion mean the ingredients see extreme heat repeatedly. That destroys heat-labile vitamins — which is exactly why a synthetic premix has to be sprayed back on afterwards — and forms Advanced Glycation End products (AGEs), inflammatory compounds associated with organ disease and pancreatitis. ⚪ AGE formation in extruded food is measurable and documented; the disease links in dogs are association, not proof." },
  { icon: "🧪", t: "Heavy metals and environmental toxins",
    b: "Independent screening by the Clean Label Project reported lead, cadmium, arsenic and mercury across popular brands, with arsenic concentrated in rice-based formulas and mercury in fish-based ones. ⚪ Worth knowing the criticism too: Clean Label Project's methodology has been contested, and its comparisons to cigarettes compare different exposure routes. The presence of these metals in plant and fish ingredients is real; the multipliers are the disputed part." },
  { icon: "🌾", t: "Glyphosate on the crops",
    b: "Soy and corn used in pet food are frequently 'Roundup Ready' — bred to be sprayed with glyphosate, a HERBICIDE. Residue testing has found pets consuming substantially more glyphosate by body weight than the average human. ⚪ Residues are documented; the health significance at those levels is contested." },
  { icon: "📦", t: "The bag itself",
    b: "The shiny inner coating of many pet food bags contains PFAS — the same chemical family as non-stick coatings — which can migrate into the food. PFAS in food packaging is a documented and actively regulated concern in human food. ⚪ Migration into pet food specifically is less studied than in human packaging." },
  { icon: "🦠", t: "What happens after you open it",
    b: "Once the bag is open, kibble is exposed to air, warmth and humidity — the conditions for rancidity, mould, storage mites and bacterial contamination including Salmonella. Fat oxidises fastest, which is why the preservative choice on the label matters." },
];

const PREMIX_PROBLEMS = [
  { t: "No co-factors", b: "In whole food, nutrients arrive alongside the compounds that help the body use them. An isolated synthetic arrives alone. Holistic practitioners argue the body may have to draw on its own stores to process it. ⚪ The co-factor principle is real in nutrition science; the specific claim of depletion in dogs is mechanistic." },
  { t: "Recall risk is systemic, not per-brand", b: "Premixes are frequently imported with limited quality control, and calculation errors have caused deadly recalls — excessive vitamin D causing kidney failure and death. Because many major brands buy premix from the SAME suppliers, one bad batch contaminates dozens of brands at once. ⚫ Documented: the 2018–19 vitamin D recalls hit Hill's, Nutrisca, Sunshine Mills, Kroger and ELM." },
  { t: "Copper has no ceiling", b: "Premixes add synthetic copper, and because AAFCO deleted the copper maximum in 2007 and never restored it, there is no legal upper limit at all. Copper accumulates in the liver and dogs cannot clear the excess — which is why copper storage disease is rising in Labradors and Dobermans. ⚫ Documented: AAFCO's own profiles list a copper minimum and no maximum." },
];

const PREMIX_AVOID = [
  ["Zinc oxide", "Poorly absorbed. The cheapest form on the market."],
  ["Zinc sulfate", "Better than oxide, well behind proteinate."],
  ["Copper sulfate", "Highly absorbable — which is the problem in a species with no copper ceiling. Linked to copper storage disease in predisposed breeds."],
  ["Sodium selenite / selenate", "Inorganic selenium. Selenium has the narrowest safety margin on the entire panel — AAFCO's maximum is only about 6× its minimum."],
  ["Menadione (vitamin K3)", "Synthetic K with no natural equivalent. Appears on labels as 'menadione sodium bisulfite complex'. FDA banned it from human over-the-counter supplements; it remains permitted in animal feed."],
  ["dl-alpha-tocopherol", "Synthetic vitamin E. The 'dl-' is a 50/50 mix of mirror-image molecules and the dog can only use one of them."],
];

const PREMIX_PREFER = [
  ["Amino acid chelates / proteinates", "Zinc proteinate, copper proteinate — bound to amino acids and absorbed like food. AAFCO won't even let copper OXIDE count toward a food's copper minimum, citing 'very poor apparent digestibility'."],
  ["Selenium yeast", "Organic selenium. Better absorbed and better tolerated than sodium selenite."],
  ["d-alpha-tocopherol", "Natural vitamin E. One letter's difference from the synthetic, roughly double the usable vitamin."],
  ["Mixed tocopherols as the preservative", "Vitamin E doing the job BHA and BHT would otherwise do."],
  ["Named whole-food sources", "Wild-caught salmon oil for EPA and DHA, dried sea kelp, sea salt — nutrients arriving with their co-factors attached."],
  ["Whole foods on top", "Green-lipped mussel, sardines, eggs. A dense natural package of vitamins and minerals, complete with everything needed to absorb them."],
];

function KibbleProblemSection() {
  return (
    <View style={{ backgroundColor: t.surfaceAlt, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>🏭 The Kibble Problem</Text>
      <Text style={{ color: t.textDim, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
        Why an all-kibble diet is worth moving away from — and why the vitamin premix exists at all.
        ⚫ = documented · ⚪ = mechanism or clinical observation.
      </Text>

      {/* Infographic. Wrapped in a fixed-ratio container so it scales to the
          device width without distorting — the source is 1600x893 (16:9-ish). */}
      <View style={{ width: "100%", aspectRatio: 1600 / 893, borderRadius: 12, overflow: "hidden", marginBottom: 14, backgroundColor: t.surfaceSunken }}>
        <Image
          source={require("../assets/images/kibble-vs-wholefood.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          accessibilityLabel="Infographic comparing the industrial reality of kibble with whole food nutrition: high-heat depletion, chronic dehydration and carb loading, hidden toxins in unnamed meals, versus the co-factor connection in whole foods."
        />
      </View>

      {KIBBLE_PROBLEMS.map((k, i) => (
        <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 9, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 14 }}>{k.icon}</Text>
            <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5, flex: 1 }}>{k.t}</Text>
          </View>
          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{k.b}</Text>
        </View>
      ))}

      {/* ── PREMIX ── */}
      <Text style={{ fontSize: 13, fontWeight: "700", marginTop: 8, marginBottom: 6, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>💊 The Synthetic Premix</Text>
      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 10 }}>
        Because extrusion destroys most of the natural nutrition, manufacturers spray a synthetic vitamin
        and mineral premix back on afterwards to meet minimum standards.{" "}
        <Text style={{ fontWeight: "700" }}>The long list on the label is a symptom of the processing —
        it&apos;s there because the ingredients no longer deliver.</Text>
      </Text>

      {PREMIX_PROBLEMS.map((p, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{p.t}</Text>
          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{p.b}</Text>
        </View>
      ))}

      {/* ── AVOID ── */}
      <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginTop: 4, marginBottom: 10, borderWidth: 1, borderColor: t.critical }}>
        <Text style={{ color: t.critical, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>❌ Forms to avoid</Text>
        <Text style={{ color: t.textDim, fontSize: 11.5, marginBottom: 8, fontStyle: "italic" }}>
          Look for chemical-sounding names, oxides and sulfates.
        </Text>
        {PREMIX_AVOID.map(([name, why], i) => (
          <View key={i} style={{ marginBottom: 7 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{name}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{why}</Text>
          </View>
        ))}
      </View>

      {/* ── PREFER ── */}
      <View style={{ backgroundColor: t.accents.detox.bg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.accents.detox.fg }}>
        <Text style={{ color: t.accents.detox.fg, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>✅ Forms to look for</Text>
        {PREMIX_PREFER.map(([name, why], i) => (
          <View key={i} style={{ marginBottom: 7 }}>
            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{name}</Text>
            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17 }}>{why}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
        The four-word check
      </Text>
      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 8 }}>
        Search any label for <Text style={{ fontWeight: "700" }}>menadione · selenite · oxide · dl-</Text>.
        If none are there, the vitamin block is fine. Thiamine, niacin, B12, riboflavin and ascorbic acid
        are the same molecules found in food — there is nothing to flag.
      </Text>

      <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17 }}>
        ⚠️ Educational only. Prefer whole-food nutrients where you can — then run the four-word check.
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

      {/* Feeding practice */}
      <Text style={{ color: t.dcm, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🍽️ How I Slow His Eating</Text>
      {[
        { title: "Split every meal: slow feeder + Kong Wobbler", body: "Hershey's a Lab — he doesn't chew, he inhales. I put half his food in a slow feeder bowl and the other half in a Kong Wobbler. It took him from finishing in under a minute to about 15 minutes, and it helped tremendously." },
        { title: "Why it's worth the two minutes of setup", body: "Eating speed is one of the few bloat risk factors entirely under your control — the prospective research on large and giant breeds found faster eaters carried higher risk. Bloat kills in hours, and a slow feeder costs about ten dollars. Splitting across two containers also means two smaller portions per sitting rather than one large one." },
        { title: "Feed before play, not after", body: "Don't feed a dog who's still panting hard from heat or exercise. Swallowed air is the mechanism behind bloat, and a hyperventilating dog is swallowing more of it. I let him settle and get his breathing back to normal first — costs ten minutes and nothing else." },
      ].map((item, i) => (
        <View key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: t.dcm }}>
          <Text style={{ color: t.text, fontWeight: "600", fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, marginTop: 2 }}>{item.body}</Text>
        </View>
      ))}

      {/* Omega & Joints */}
      <Text style={{ color: t.accents.mussel.fg, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 }}>🐟 Omega-3 & Joint Support</Text>
      {[
        { title: "Green Lipped Mussel", body: "A systematic review of the canine trials found 'a moderate amount of evidence' for real clinical benefit in dogs with osteoarthritis — genuinely good for a supplement. Contains ETA plus natural glucosamine and chondroitin, which fish oil doesn't. I give it alongside fish oil because they cover different ground, not because the combination has been tested — it hasn't. Buy the plain powder, not a chew." },
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
        <Text style={{ color: t.infoSoft, fontSize: 12, lineHeight: 18 }}>❄️ <Text style={{ fontWeight: "600" }}>Cooling (best):</Text> Duck, rabbit, whitefish/cod, pork, wild boar</Text>
        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>⚖️ <Text style={{ fontWeight: "600" }}>Neutral (fine):</Text> Beef, beef liver, eggs, tripe, wild-caught salmon</Text>
        <Text style={{ color: t.critical, fontSize: 12, lineHeight: 18 }}>🔥 <Text style={{ fontWeight: "600" }}>Warming (limit as staple):</Text> Chicken, turkey, lamb, venison, trout, farmed salmon</Text>
        <Text style={{ color: t.textDim, fontSize: 11, marginTop: 4, lineHeight: 15 }}>Corrected 2026-08-05: venison and turkey are WARMING (venison is often listed as hot), and farmed salmon is warming while wild is nearer neutral — worth knowing, since venison gets recommended for allergies without anyone mentioning it heats a dog up.</Text>
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

/**
 * ── PROGRESSIVE DISCLOSURE ───────────────────────────────────────────────────
 * Twenty-two accordion headers on one screen is a menu of twenty-two things to
 * worry about, which is the opposite of what a frightened owner needs. Sections
 * are therefore grouped behind four "doors" and only the open door renders.
 *
 * Deliberately done with context rather than by moving JSX: nothing is deleted,
 * nothing is reordered, and every section is still exactly where it was in the
 * file. A section simply declares which door it belongs to.
 *
 * A section with NO door renders always — that's how the Layer 1 answer, the
 * score, and the compassionate note stay unconditional.
 */
// Three doors, not four (2026-08-18). "Health topics" was dropped because every
// section behind it was a general article — bloat, lifespan, lipomas, TCVM, life
// stages, deficiency signs — none of which change based on what was scanned.
// They now sit behind "Learn" with the rest of the reference material.
//
// The test for which door a section belongs to: DOES IT CHANGE BASED ON THE SCAN?
//   yes, it describes this bag        -> whats-in-it
//   yes, it's an action for this bag  -> what-to-do
//   no, it's the same for every dog   -> learn  (and it belongs on the website too)
// Numbered on purpose (2026-08-18). A row of three unnumbered tabs reads as a
// menu — the user has to decide where to start, which is the thing that
// overwhelms a beginner. Numbering turns it into a path: read what's in it,
// then what to do about it, then learn more if you want. Most people will
// never open 3, and that's fine — it's the optional one by design.
export const DOORS = [
  { key: "whats-in-it", icon: "📋", label: "1 · What's in it", step: "Start here" },
  { key: "what-to-do", icon: "✅", label: "2 · What to do", step: "Then this" },
  { key: "learn", icon: "📚", label: "3 · Learn more", step: "Optional" },
] as const;

const DoorContext = React.createContext<string | null>(null);

// A–Z topic index (2026-08-20). The "Learn" door held 16 sections stacked in no
// order, which is a wall. Reference material works as an index, not a narrative:
// one short chip per topic, alphabetical, tap to expand. A section declares its
// topic and renders only when that chip is selected.
const TopicContext = React.createContext<string | null>(null);

export const LEARN_TOPICS = [
  "AAFCO", "Bloat", "Carbs", "Collagen", "Deficiency signs", "Gut health", "Heart",
  "Kibble", "Life stages", "Lifespan", "Lipomas", "Missing nutrients",
  "Mushrooms", "Omega-3", "Recalls & facts", "TCVM",
] as const;

// ── THE KIBBLE GUIDE (added 2026-08-21) ──────────────────────────────────────
// The Learn tab's landing content: read a bag WITHOUT scanning it. Same shape as
// the results screen — watch-outs, good signs, next steps — minus the score.
//
// Every entry here is drawn from content already in this repo and already
// checked: HARMFUL_INGREDIENTS' own reason text, docs/MINERAL_FORMS_CHEATSHEET.md,
// docs/SYNTHETIC_VS_NATURAL.md and docs/THE_LADDER.md. Nothing new is claimed.
//
// Two rules from THE_LADDER govern the wording and must survive edits:
//   1. `tier` is never optional. If we can't say what kind of evidence it is,
//      it doesn't go in the guide.
//   2. Every entry ends in `instead` — something to DO. "Avoid X" with no
//      alternative is how you lose the person buying a $22 bag.
const KIBBLE_GUIDE: {
  key: string;
  icon: string;
  title: string;
  headline: string;
  watch: string[];
  why: string;
  tier: string;
  instead: string;
}[] = [
  {
    key: "preservatives",
    icon: "🧪",
    title: "Preservatives",
    headline: "What's keeping the fat from going rancid",
    watch: ["BHA", "BHT", "Ethoxyquin", "TBHQ"],
    why:
      "Fat goes rancid, so every kibble has to be preserved somehow — the question is which one they picked, and that's a pure cost decision. BHA produced tumours in long-term rodent feeding studies and is a Group 2B possible carcinogen; BHT promoted tumours in animals already exposed to a carcinogen. Ethoxyquin started life as a pesticide and rubber stabiliser, and the FDA asked manufacturers to cut its use in 1997.",
    tier: "Rodent feeding studies · not demonstrated in dogs at pet-food levels",
    instead:
      "\"Preserved with mixed tocopherols\" — that's vitamin E. It costs more and it works, which is exactly why it tells you what they did on the lines you can't see.",
  },
  {
    key: "colors",
    icon: "🎨",
    title: "Colours & dyes",
    headline: "The one that's purely for you",
    watch: ["Red 40", "Yellow 5", "Yellow 6", "Blue 2", "Caramel colour", "\"Artificial colour\""],
    why:
      "Your dog is a dichromat — he cannot tell the red kibble from the green one, and he chose his food by smell before he ever saw the bowl. The dye exists so the bag looks appetising to the person holding the scoop. It is money spent on the wrong species.",
    tier: "No canine harm shown at food levels — this is a formulation signal, not a poison",
    instead:
      "Brown food. A company that doesn't spend on making kibble look like breakfast cereal usually had somewhere better to put it.",
  },
  {
    key: "legumes",
    icon: "🫘",
    title: "Legumes (DCM)",
    headline: "Peas and lentils high on a grain-free bag",
    watch: ["Peas", "Pea protein", "Pea starch", "Pea fibre", "Lentils", "Chickpeas", "Potato"],
    why:
      "In 2018 the FDA opened an investigation into reports of dilated cardiomyopathy in dogs eating grain-free diets, and the shared pattern was legumes or potatoes sitting high on the ingredient list. It is an association drawn from case reports — the cause has not been established, and the FDA has not concluded these foods cause DCM. What makes it hard to read is ingredient splitting: pea protein, pea starch and pea fibre are listed separately, so peas can be the largest thing in the bag while never appearing near the top.",
    tier: "FDA case reports · association only — cause NOT established",
    instead:
      "If the bag is grain-free, look for how many times peas or lentils appear and add them together in your head. \"Fewer fillers\" beats \"swapped fillers\" — grain-free is not automatically better.",
  },
  {
    key: "generic",
    icon: "🥩",
    title: "Unnamed meat",
    headline: "When the label won't say which animal",
    watch: ["Meat by-product", "Poultry by-product", "Meat and bone meal", "Animal digest", "Animal fat", "Meat meal"],
    why:
      "The precise problem is that the species isn't disclosed, which means it can change from batch to batch depending on what was cheap that month. You cannot get consistency from an ingredient that isn't named. By-product also covers material from animals that didn't go to slaughter — Dr. Andrew Jones's point about 4D sources, which is why he tells owners to skip it entirely.",
    tier: "Regulatory definition + clinical experience · not a demonstrated toxicity",
    instead:
      "A named animal, every time: \"Chicken meal\", \"Lamb meal\", \"Chicken fat\" — never \"poultry\", \"meat\", or \"animal\". This is the single easiest upgrade to teach and anyone can check it in one second.",
  },
  {
    key: "minerals",
    icon: "⚗️",
    title: "Cheap minerals",
    headline: "Count the word \"oxide\"",
    watch: ["Zinc oxide", "Iron oxide", "Manganese oxide", "Copper oxide"],
    why:
      "Same mineral, three grades of form, and the word after the metal is the whole tell. Chelated forms — proteinate, amino acid chelate, methionine — absorb like food. Sulfates are the adequate middle. Oxides are barely absorbed: AAFCO will not let copper oxide count toward a food's copper minimum at all, citing \"very poor apparent digestibility.\" A regulator saying an ingredient can't count as the nutrient it's named after is as clear as this gets.",
    tier: "Regulatory — AAFCO's own position",
    instead:
      "This is the highest-signal move on the whole label, because mineral forms are invisible to marketing — no bag advertises proteinates on the front. Two or more oxides means they bought the cheapest forms available, and that's what they did everywhere you can't see.",
  },
  {
    key: "forms",
    icon: "💊",
    title: "Selenium & E",
    headline: "Two places where one letter halves the vitamin",
    watch: ["Sodium selenite", "Sodium selenate", "dl-alpha tocopherol"],
    why:
      "Most synthetic vitamins are the identical molecule to the food version and are not worth worrying about. These two are the real exceptions. \"dl-\" alpha tocopherol is a 50/50 mix of mirror-image molecules and the dog can only use one of them — one letter, roughly half the vitamin E. Selenium has the narrowest safety margin on the whole panel: AAFCO's maximum is only about six times its minimum.",
    tier: "Established nutritional chemistry",
    instead:
      "\"Selenium yeast\" or selenomethionine, and \"d-alpha tocopherol\" without the l. And put down the worry about the other forty vitamins — niacin is niacin, B12 is B12.",
  },
  {
    key: "menadione",
    icon: "🩸",
    title: "Menadione",
    headline: "The genuinely contested one",
    watch: ["Menadione", "Menadione sodium bisulfite complex", "Vitamin K3"],
    why:
      "Synthetic vitamin K3. It generates reactive oxygen species and depletes glutathione, which is the mechanistic route to haemolytic anaemia, and the FDA banned it from over-the-counter human supplements. In fairness: the FDA still permits it in animal feed, and across 50+ years there are no published reports of nutritional toxicity in dogs at pet-food levels. The studies showing harm used far higher doses, often injected rather than fed.",
    tier: "Mechanism only · no published canine toxicity at label doses",
    instead:
      "Prefer a food without it — there's no reason to accept it when alternatives exist. But it is not a reason to panic about a bag you already bought, and we don't claim it's been shown to harm dogs, because it hasn't.",
  },
  {
    key: "fillers",
    icon: "🌽",
    title: "Fillers up top",
    headline: "How much of the first five isn't meat",
    watch: ["Ground corn", "Corn gluten meal", "Ground wheat", "Wheat gluten", "Brewers rice", "Soybean meal", "Soy protein"],
    why:
      "Carbs aren't poison and dogs digest cooked starch fine — the issue is displacement. Dogs have no dietary carbohydrate requirement, so every filler slot in the top five is a slot not holding meat. Watch for splitting too: \"corn, corn gluten meal, ground corn\" is one ingredient wearing three hats so none of them has to be listed first.",
    tier: "Established — no dietary carbohydrate requirement in dogs",
    instead:
      "Count how many of the first five ingredients are animals. Three of five being corn, wheat and pea protein means the bag is mostly not meat, whatever the front of it says.",
  },
  {
    key: "sugar",
    icon: "🍬",
    title: "Sweeteners",
    headline: "Food that needs help being eaten",
    watch: ["Corn syrup", "Sugar", "Sucrose", "Fructose", "Molasses", "Sorbitol"],
    why:
      "These are palatants — they exist to make the food get eaten. A recipe that needs sugar added to be attractive to a carnivore is telling you something about everything else in the bag. Added sugar also feeds yeast, which matters if your dog already has itchy paws or recurring ear trouble.",
    tier: "Formulation signal · yeast link is clinical observation, not trial evidence",
    instead:
      "Nothing sweet in the list at all. Good food smells like meat and doesn't need convincing.",
  },
  {
    key: "flavor",
    icon: "👃",
    title: "\"Natural flavour\"",
    headline: "A legal category, not an ingredient",
    watch: ["Natural flavor", "Animal digest", "Hydrolyzed protein", "Yeast culture"],
    why:
      "\"Natural flavour\" doesn't name a substance — it names a permission. In pet food it's usually animal digest: material broken down with enzymes or acid and sprayed onto the outside of the kibble after extrusion. That spray is what makes the food palatable, which means the pieces underneath it aren't.",
    tier: "Regulatory definition — this is what the term legally permits",
    instead:
      "Ask why the food needs a coating. A recipe built on real meat doesn't have to be painted at the end.",
  },
];

// The green list — what a good bag actually looks like. Deliberately the same
// length as the watch list, because a guide that's only warnings teaches
// avoidance and never teaches choosing.
const KIBBLE_GOOD_SIGNS: { icon: string; label: string; detail: string }[] = [
  { icon: "🍗", label: "A named animal at #1", detail: "Chicken, Lamb, Salmon, Beef — not a grain, legume or starch." },
  { icon: "🏷️", label: "Every animal word named", detail: "\"Chicken meal\" is fine. \"Poultry meal\" and \"animal fat\" are not." },
  { icon: "🌿", label: "Preserved with mixed tocopherols", detail: "Natural vitamin E, chosen over the cheaper synthetics." },
  { icon: "⚗️", label: "Proteinates or chelates", detail: "\"Zinc proteinate\" beats sulfate beats oxide. Zero oxides is the goal." },
  { icon: "🧬", label: "Selenium yeast, d-alpha tocopherol", detail: "The two forms that are genuinely better absorbed." },
  { icon: "🐟", label: "A marine omega-3 source", detail: "Fish oil, salmon oil, herring. Flax is not a substitute — see below." },
  { icon: "🫀", label: "Organ meat listed by name", detail: "Liver, heart, kidney — real nutrient density, not just muscle meat." },
  { icon: "📋", label: "An AAFCO feeding-trial statement", detail: "\"Animal feeding tests\" beats \"formulated to meet\" — the food was actually fed." },
];

// What to DO about it. Ordered cheapest-and-easiest first on purpose: the person
// reading this is standing in a pet-food aisle with a budget, not planning a
// home-cooked diet. See docs/THE_LADDER.md — never shame the bowl.
const KIBBLE_UPGRADES: { step: string; detail: string; tier: string }[] = [
  {
    step: "Keep him lean. This one is free.",
    detail:
      "The single best-evidenced thing on this page, and it costs nothing. In Purina's 14-year lifetime study, Labradors kept at a lean body condition lived a median 13.0 years versus 11.2 for littermates fed 25% more — the same food, just less of it. If you can't feel his ribs under light pressure, start here and skip the rest.",
    tier: "Randomised, controlled, lifelong · Kealy et al., funded by Purina",
  },
  {
    step: "Add a whole egg, two or three times a week.",
    detail:
      "The cheapest complete-protein topper there is. Cooked or raw both work — cooking costs a little biotin availability and removes any salmonella question, so cook it if that worries you. Roughly one egg for a 50lb dog.",
    tier: "Established nutrition · whole-food topper",
  },
  {
    step: "Get real EPA and DHA into the bowl.",
    detail:
      "Sardines packed in water, or a fish oil. This matters more than it sounds: dogs convert ALA — the omega-3 in flax and chia — into EPA and DHA very poorly, single digits to low double digits. A food listing flaxseed as its omega-3 source has not given your dog meaningful EPA or DHA. Most kibble runs 15:1 to 30:1 omega-6:3; the target is 5:1 or lower.",
    tier: "Established — species-specific conversion limit in dogs",
  },
  {
    step: "Add fresh food as about 10% of the bowl.",
    detail:
      "Blueberries, pumpkin, leafy greens, a little cooked liver. Under ~10% you're adding nutrients without threatening the completeness of a balanced base. Liver is the one to actually measure — the 10% organ rule exists because of its vitamin A load.",
    tier: "Established · the 10% ceiling is the accumulation guard",
  },
  {
    step: "A spoon of kefir, plain yogurt or goat's milk.",
    detail:
      "Live cultures the extrusion process destroyed. Start with a teaspoon for a small dog, a tablespoon for a large one, and back off if stools loosen.",
    tier: "Mechanism + clinical experience · probiotic trials in dogs are mixed",
  },
  {
    step: "Rotate proteins instead of feeding one bag forever.",
    detail:
      "Different proteins bring different amino-acid and micronutrient profiles, and a dog who has only ever eaten chicken has no tolerance for change when that formula is recalled or reformulated. Transition over about a week.",
    tier: "Clinical experience · not trial-established",
  },
  {
    step: "Swap one meal a week to fresh or gently cooked.",
    detail:
      "The cheapest rung up the ladder. You don't have to leave kibble to stop feeding only kibble — a single fresh meal a week is a real change and it's a budget most people can actually hold.",
    tier: "Processing rationale · see the Kibble topic",
  },
];

// The counterweight. Without this the guide reads as "add everything", which is
// the exact failure mode docs/BLUEPRINT_THE_BOWL.md exists to prevent.
const KIBBLE_DONT_OVERDO = {
  headline: "Before you add five things at once",
  body:
    "Almost nothing you spoon on top accumulates. Water-soluble vitamins pass straight through — a dog cannot get in trouble from the extra B12 in a sardine, and saying so plainly is more honest than flagging everything.\n\nOnly four things are worth tracking as they stack up: the fat-soluble vitamins A, D, E and K; copper; iodine; and selenium. Liver drives vitamin A and copper, kelp drives iodine, and fish oil drives the fat-solubles. Whole foods at topper amounts stack safely — concentrated capsules are the ones that add up.\n\nAnd the biggest one: if a supplement is right for one problem and wrong for another, that conflict is real and it's yours to weigh. Green-lipped mussel is in the heart protocol and avoided for damp, lipoma-prone dogs. Both of those are true at once.",
};

// The Learn tab's landing screen. Deliberately the same shape as a scan result —
// a segmented row, then tappable rows that expand — so someone who has used the
// scanner already knows how to read this, and someone who starts here already
// knows how to read a scan. The only thing missing is the score, because there's
// no bag yet.
function KibbleGuideSection() {
  const [tab, setTab] = useState<"watch" | "list" | "good" | "better">("watch");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [dontOverdoOpen, setDontOverdoOpen] = useState(false);
  const [query, setQuery] = useState("");

  const TABS = [
    { key: "watch" as const, label: "Watch for" },
    { key: "list" as const, label: "Every one" },
    { key: "good" as const, label: "Good signs" },
    { key: "better" as const, label: "Improve it" },
  ];

  // The full flagged-ingredient reference, straight off the same
  // HARMFUL_INGREDIENTS array the scorer uses — so this list can never drift
  // out of sync with what a scan actually flags. Ordered worst first.
  const SEVERITY_ORDER = ["toxic", "severe", "moderate", "mild"];
  const q = query.trim().toLowerCase();
  // Dedupe by term, keeping the FIRST entry. HARMFUL_INGREDIENTS currently holds
  // two "vegetable oil" rows, and every scoring path resolves a term with
  // `.find()` — which stops at the first match. So keeping the first is not just
  // tidier, it makes this reference show exactly the entry the scorer uses.
  // (Scoring is unaffected either way; `.find()` never saw the second one.)
  const seenTerms = new Set<string>();
  const matches = HARMFUL_INGREDIENTS.filter((h) => {
    if (seenTerms.has(h.term)) return false;
    seenTerms.add(h.term);
    return q === "" || h.term.includes(q) || h.reason.toLowerCase().includes(q);
  });
  const bySeverity = SEVERITY_ORDER.map((sev) => ({
    sev,
    items: matches.filter((h) => h.severity === sev),
  })).filter((g) => g.items.length > 0);

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
      <Text style={styles.guideTitle}>Reading a kibble bag</Text>
      <Text style={styles.guideLede}>
        You don&apos;t need to scan anything to use this. Turn the bag over, find
        the ingredient list, and work down. Nothing here is about one brand —
        it&apos;s what the words themselves mean.
      </Text>

      {/* Segmented row — same control as the scan screen's mode picker. */}
      <View style={styles.guideTabs}>
        {TABS.map((tb) => {
          const on = tab === tb.key;
          return (
            <TouchableOpacity
              key={tb.key}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setTab(tb.key);
                setOpenKey(null);
              }}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={[styles.guideTab, on && styles.guideTabOn]}
            >
              <Text style={[styles.guideTabText, on && styles.guideTabTextOn]} numberOfLines={1}>
                {tb.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── WATCH FOR ── one chip per category, tap to expand the detail. */}
      {tab === "watch" && (
        <>
          <Text style={styles.guideHint}>
            {openKey
              ? "Tap the same one again to close it."
              : "Ten things worth knowing. Tap any of them — you don't need to read them in order."}
          </Text>
          {KIBBLE_GUIDE.map((g) => {
            const on = openKey === g.key;
            return (
              <View key={g.key} style={styles.guideCard}>
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setOpenKey(on ? null : g.key);
                  }}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: on }}
                  style={styles.guideCardHead}
                >
                  <Text style={{ fontSize: 18 }}>{g.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.guideCardTitle}>{g.title}</Text>
                    <Text style={styles.guideCardHeadline} numberOfLines={on ? undefined : 1}>
                      {g.headline}
                    </Text>
                  </View>
                  <Text style={styles.guideChevron}>{on ? "▾" : "›"}</Text>
                </TouchableOpacity>

                {on && (
                  <View style={styles.guideCardBody}>
                    {/* The actual words on the label — the reason someone opened this. */}
                    <Text style={styles.guideLabelCue}>On the label it says</Text>
                    <View style={styles.guideTermRow}>
                      {g.watch.map((w) => (
                        <View key={w} style={styles.guideTerm}>
                          <Text style={styles.guideTermText}>{w}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={styles.guideWhy}>{g.why}</Text>

                    <View style={styles.guideTierPill}>
                      <Text style={styles.guideTierText}>{g.tier}</Text>
                    </View>

                    <View style={styles.guideInstead}>
                      <Text style={styles.guideInsteadLabel}>What to do instead</Text>
                      <Text style={styles.guideInsteadText}>{g.instead}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {/* ── EVERY ONE ── the complete flagged-ingredient reference. Reads the
          same HARMFUL_INGREDIENTS array the scorer uses, so what you see here
          is exactly what a scan would flag, with the same reason text and the
          same severity. Nothing is summarised or re-written for this view. */}
      {tab === "list" && (
        <>
          <Text style={styles.guideHint}>
            Every ingredient PawGrade flags, and why — {HARMFUL_INGREDIENTS.length} of
            them. This is the same list the scanner scores against, so nothing
            here is different from what a scan would tell you.
          </Text>
          <TextInput
            style={styles.guideSearch}
            placeholder="Search an ingredient…"
            placeholderTextColor={t.textFaint}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {bySeverity.length === 0 && (
            <Text style={styles.guideEmpty}>
              Nothing matches “{query}”. That doesn&apos;t mean it&apos;s safe —
              it means we don&apos;t flag it. Try the Ask tab.
            </Text>
          )}
          {bySeverity.map((group) => (
            <View key={group.sev} style={{ marginBottom: 6 }}>
              <View style={styles.guideSevHead}>
                <View
                  style={[
                    styles.guideSevDot,
                    { backgroundColor: SEVERITY_COLORS[group.sev] },
                  ]}
                />
                <Text style={styles.guideSevLabel}>
                  {group.sev} · {group.items.length}
                </Text>
                <Text style={styles.guideSevPenalty}>
                  −{SEVERITY_PENALTIES[group.sev]} points each
                </Text>
              </View>
              {group.items.map((h) => {
                const on = openKey === `ing-${h.term}`;
                return (
                  <View key={`${group.sev}-${h.term}`} style={styles.guideCard}>
                    <TouchableOpacity
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setOpenKey(on ? null : `ing-${h.term}`);
                      }}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: on }}
                      style={styles.guideIngHead}
                    >
                      <View
                        style={[
                          styles.guideSevDot,
                          { backgroundColor: SEVERITY_COLORS[h.severity] },
                        ]}
                      />
                      <Text style={styles.guideIngName}>{h.term}</Text>
                      <Text style={styles.guideChevron}>{on ? "▾" : "›"}</Text>
                    </TouchableOpacity>
                    {on && <Text style={styles.guideIngReason}>{h.reason}</Text>}
                  </View>
                );
              })}
            </View>
          ))}
          <Text style={styles.guideFootnote}>
            Severity is capped by evidence: an ingredient flagged on mechanism
            alone can&apos;t be rated worse than mild, and only documented canine
            harm reaches severe or toxic. That&apos;s why some things you may
            have read are “terrible” sit low here.
          </Text>
        </>
      )}

      {/* ── GOOD SIGNS ── the green list, so the guide teaches choosing too. */}
      {tab === "good" && (
        <>
          <Text style={styles.guideHint}>
            A bag doesn&apos;t need all eight. Three or four of these puts it well
            above most of the shelf.
          </Text>
          {KIBBLE_GOOD_SIGNS.map((s) => (
            <View key={s.label} style={styles.guideGoodRow}>
              <Text style={{ fontSize: 16 }}>{s.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.guideGoodLabel}>{s.label}</Text>
                <Text style={styles.guideGoodDetail}>{s.detail}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* ── MAKE IT BETTER ── numbered, cheapest first, with the stacking guard. */}
      {tab === "better" && (
        <>
          <Text style={styles.guideHint}>
            Cheapest and easiest first. Doing one of these is a real change —
            you don&apos;t have to do all seven, and you don&apos;t have to leave
            kibble to make the bowl better.
          </Text>
          {KIBBLE_UPGRADES.map((u, i) => (
            <View key={u.step} style={styles.guideStep}>
              <View style={styles.guideStepNum}>
                <Text style={styles.guideStepNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guideStepTitle}>{u.step}</Text>
                <Text style={styles.guideStepDetail}>{u.detail}</Text>
                <Text style={styles.guideStepTier}>{u.tier}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setDontOverdoOpen((v) => !v);
            }}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ expanded: dontOverdoOpen }}
            style={styles.guideWarnCard}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
              <Text style={{ fontSize: 16 }}>⚖️</Text>
              <Text style={[styles.guideWarnTitle, { flex: 1 }]}>
                {KIBBLE_DONT_OVERDO.headline}
              </Text>
              <Text style={styles.guideChevron}>{dontOverdoOpen ? "▾" : "›"}</Text>
            </View>
            {dontOverdoOpen && (
              <Text style={styles.guideWarnBody}>{KIBBLE_DONT_OVERDO.body}</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
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
  door,
  topic,
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
  /** Which door this section lives behind. Omit to always render. */
  door?: string;
  /** A–Z topic chip this section sits under. Omit to render whenever its door is open. */
  topic?: string;
}) {
  const activeDoor = React.useContext(DoorContext);
  const activeTopic = React.useContext(TopicContext);
  const [open, setOpen] = useState(defaultOpen);
  // Hooks above, early return below — hook order stays stable either way.
  if (door && activeDoor !== door) return null;
  if (topic && activeTopic !== topic) return null;
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
  // Kept as the opening screen: it carries the camera-permission request and
  // the "educational, not veterinary advice" framing (restored 2026-08-18).
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
  // Egg-quality detail under "Make it better" — collapsed by default so the
  // section keeps its three-line calm and the evidence stays opt-in.
  const [eggInfoOpen, setEggInfoOpen] = useState(false);
  // Which of the four doors is open. null = none, so the results screen
  // shows only the Layer 1 answer until the owner chooses to go deeper.
  // Opens on "learn" because the app now LANDS on Learn (see below).
  const [openDoor, setOpenDoor] = useState<string | null>("learn");
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  // Learn without scanning (2026-08-21). The A–Z reference doesn't depend on a
  // scan — gating it behind one meant a new owner had to photograph a bag before
  // they could read anything. This opens the same index standalone.
  //
  // Defaults to TRUE (2026-08-21): after the permission + disclaimer screens the
  // app lands on Learn, not the camera. Someone who just installed a dog-food
  // scanner usually doesn't have a bag in their hand — they have a question. The
  // camera is one tap away and the permission prompt still comes first.
  const [learnMode, setLearnMode] = useState(true);
  // Home-cooked builder: dog weight in lb, and activity multiplier on RER.
  const [hmWeight, setHmWeight] = useState("");
  const [hmActivity, setHmActivity] = useState(1.6);
  // The formulator: chosen ingredients as { dbIndex: grams }.
  const [recipe, setRecipe] = useState<Record<number, string>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
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
  // Omega calculator — lets an owner do the arithmetic this app kept doing by hand.
  const [calcWeight, setCalcWeight] = useState("");
  const [calcKcalA, setCalcKcalA] = useState("");
  const [calcO3A, setCalcO3A] = useState("");
  const [calcKcalB, setCalcKcalB] = useState("");
  const [calcO3B, setCalcO3B] = useState("");
  const [calcSuppMg, setCalcSuppMg] = useState("");
  const [calcSuppServ, setCalcSuppServ] = useState("");
  const [calcMarineShare, setCalcMarineShare] = useState(30);
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
        {/* Build stamp. Added 2026-08-18 because it became impossible to tell
            whether a screen was running current code or a cached bundle —
            several rounds of UI changes were made and reported as "nothing
            changed". If this line is missing, you are NOT on the current build. */}
        <Text
          style={{
            color: t.textFaint,
            fontSize: 10,
            textAlign: "center",
            marginTop: 10,
            letterSpacing: 0.4,
          }}
        >
          BUILD CHECK · gut health section · 22 Aug
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
      // Weighted by WHICH forms, not how many — see vitaminLoadPenalty().
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
        // Estimate carbohydrate share from label position, then taper — see carbPenaltyFor().
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
      {/* `learnMode` has to be in this condition, not just in the section gates.
          Every Learn section lives inside the branch below, so without this the
          📚 tab set its state and rendered nothing — it looked like a dead
          button. Learn now shows the same scroll view a scan does, minus the
          score. (Found and fixed 2026-08-21.) */}
      {!scanned && !learnMode ? (
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
          {/* SCAN SCREEN — rebuilt 2026-08-21 from the approved v1.9 mockup
              (artifact 42693321). Four elements, in this order: a plain title,
              the segmented mode row, a COMPACT framed viewfinder, and one round
              shutter beneath it. The camera used to be flex:1 full-bleed with the
              shutter floating on top of it; Kyle's note was "the camera isn't so
              big". Nothing was removed — the sample scans, the ingredient lookup
              and every mode below are untouched. */}
          <Text style={styles.scanTitle}>
            {scanMode === "manual"
              ? "Type in a label"
              : scanMode === "treats"
                ? "Scan a treat"
                : "Scan a bag"}
          </Text>
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
                Camera
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
                Type in
              </Text>
            </TouchableOpacity>
            {/* Treats mode re-enabled 2026-08-11. The scoring path (scoreTreats),
                TREAT_HARMFUL, TREAT_OK_INGREDIENTS and the results rendering were
                all intact the whole time — only this button was missing. */}
            <TouchableOpacity
              style={[
                styles.modeBtn,
                scanMode === "treats" && styles.modeBtnActive,
              ]}
              onPress={() => { setScanMode("treats"); setScanned(false); setIsTreatScan(false); setTreatScore(null); setProductName(""); scanningRef.current = false; }}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  scanMode === "treats" && styles.modeBtnTextActive,
                ]}
              >
                Treats
              </Text>
            </TouchableOpacity>
          </View>
          {/* In camera modes the instruction now lives INSIDE the viewfinder
              frame (below), where the mockup puts it. Type-in mode has no
              viewfinder, so it keeps a one-line instruction of its own. */}
          {scanMode === "manual" && (
            <Text style={styles.scanHint}>
              Paste the ingredient list from the bag
            </Text>
          )}
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
              {/* The barcode field was removed from this form on 2026-08-18.
                  It was optional, it was labelled "for future scans", and it
                  asked a first-time user to type a barcode number for no
                  benefit to them — it only helped our database. `manualBarcode`
                  state is intentionally kept: Scan mode still captures barcodes
                  automatically, and putting the input back is one block. */}
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
            /* No flex:1 here any more — the viewfinder is a fixed height now, so
               this block sizes to its content and everything below it (sample
               scans, ingredient lookup) stays on the same screen. */
            <View style={{ width: "100%" }}>
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
            {/* The compact framed viewfinder. Fixed 250px tall with a dashed
                border, rather than flex:1 filling the screen — so the sample
                scans and the ingredient lookup underneath are reachable without
                scrolling past a wall of live video. */}
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
              <View style={styles.scanOverlay} pointerEvents="none">
                <Text style={styles.scanOverlayText}>
                  {scanMode === "treats"
                    ? "Point at the ingredient list on a treat bag"
                    : "Point at the ingredient list on the bag"}
                </Text>
              </View>
            </View>
            {/* One round shutter, below the frame — not floating over the video.
                Same handleSmartScan it always called. */}
            <TouchableOpacity style={styles.shutterBtn} onPress={handleSmartScan}>
              <Text style={styles.shutterIcon}>📸</Text>
            </TouchableOpacity>
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
        <TopicContext.Provider value={openTopic}>
        <DoorContext.Provider value={openDoor}>
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
          {/* ── NAVIGATION + LEARN INDEX ──────────────────────────────────
              These were nested INSIDE the treat-scan results block, so they
              only rendered during a treat scan — which is why the Learn tab
              came up blank. Hoisted to be a sibling of the result blocks on
              2026-08-21. Nothing was rewritten; the same JSX moved up one
              level so it renders for a food scan, a treat scan, or Learn. */}
            {score !== null && (
              <View style={{ marginHorizontal: 16, marginBottom: 14 }}>
                {/* Segmented tab row. Was a wrapping grid of large cards, which
                    cost a lot of vertical space before the user reached anything.
                    One compact row instead — tap to open, tap again to close. */}
                <Text
                  style={{
                    color: t.textDim,
                    fontSize: 12.5,
                    lineHeight: 18,
                    marginBottom: 8,
                  }}
                >
                  {openDoor === null
                    ? "New to this? Tap 1 first — it explains the score. You don't need the others."
                    : "Tap the same tab again to close it."}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 6,
                    backgroundColor: t.surfaceAlt,
                    borderRadius: 12,
                    padding: 4,
                  }}
                >
                  {DOORS.map((d) => {
                    const on = openDoor === d.key;
                    return (
                      <TouchableOpacity
                        key={d.key}
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setOpenDoor(on ? null : d.key);
                        }}
                        activeOpacity={0.75}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: on }}
                        accessibilityLabel={`${on ? "Close" : "Open"} ${d.label}`}
                        style={{
                          flex: 1,
                          backgroundColor: on ? t.good : "transparent",
                          borderRadius: 9,
                          paddingVertical: 9,
                          paddingHorizontal: 4,
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Text style={{ fontSize: 15 }}>{d.icon}</Text>
                        <Text
                          style={{
                            color: on ? t.onAccent : t.textDim,
                            fontSize: 11,
                            fontWeight: "700",
                            textAlign: "center",
                          }}
                          numberOfLines={1}
                        >
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* The kibble guide sits ABOVE the A–Z index, because it's the
                thing a brand-new owner needs and the A–Z assumes you already
                know which of 15 topics you want. */}
            {(score !== null || learnMode) && openDoor === "learn" && !openTopic && (
              <KibbleGuideSection />
            )}

            {/* A–Z topic index — only under the Learn door. Alphabetical chips,
                one short phrase each, tap to expand that section below. */}
            {(score !== null || learnMode) && openDoor === "learn" && (
              <View style={{ marginHorizontal: 16, marginBottom: 14 }}>
                <Text style={{ color: t.textDim, fontSize: 12.5, lineHeight: 18, marginBottom: 8 }}>
                  {openTopic
                    ? "Tap the same topic again to close it."
                    : "Pick a topic. You don't need to read them in order."}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
                  {LEARN_TOPICS.map((topic) => {
                    const on = openTopic === topic;
                    return (
                      <TouchableOpacity
                        key={topic}
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setOpenTopic(on ? null : topic);
                        }}
                        activeOpacity={0.75}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: on }}
                        style={{
                          backgroundColor: on ? t.good : t.surface,
                          borderWidth: 1,
                          borderColor: on ? t.good : t.border,
                          borderRadius: 999,
                          paddingVertical: 7,
                          paddingHorizontal: 13,
                        }}
                      >
                        <Text style={{ color: on ? t.onAccent : t.text, fontSize: 12.5, fontWeight: "600" }}>
                          {topic}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

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
                  door="whats-in-it"
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
                  <AccordionSection title="🌿 Protein Energetics (TCVM)"
                  topic="TCVM"
                  door="learn">
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
                  door="what-to-do"
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

                  {/* The evidence layer this section was missing. VOHC is a measured
                      threshold rather than an opinion, which makes it usable by
                      someone who doesn't want to take anyone's word for anything. */}
                  <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 8, padding: 11, marginTop: 4 }}>
                    <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 12.5, marginBottom: 5 }}>
                      🔬 What actually has evidence behind it
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
                      <Text style={{ fontWeight: "700" }}>MECHANICAL CLEANING IS THE PROVEN ONE.</Text>{" "}
                      Physically disrupting the plaque film — gauze, brush, or an appropriate chew
                      — is the single most effective thing you can do at home. In the coconut-oil
                      method above, the GAUZE is the active ingredient. The oil is a lubricant with
                      mild antimicrobial activity, and there is no controlled canine trial showing
                      coconut oil reduces plaque or periodontal disease on its own. Human oil-pulling
                      studies show modest benefit; that hasn&apos;t been reproduced in dogs. It&apos;s
                      safe, it won&apos;t harm enamel, and it isn&apos;t doing the work.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
                      <Text style={{ fontWeight: "700" }}>THE VOHC SEAL IS A MEASURED THRESHOLD,
                      NOT AN OPINION.</Text> The Veterinary Oral Health Council doesn&apos;t test
                      products itself — it reviews trial data against a fixed bar: a minimum of TWO
                      controlled trials, at least a 15% reduction in plaque or tartar versus control
                      in EACH, an average of 20% across both, and statistical significance (p&lt;0.05)
                      in each. A product either cleared that or it didn&apos;t. You can use the seal
                      without trusting anyone&apos;s judgement, because it&apos;s a number.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
                      <Text style={{ fontWeight: "700" }}>PROBIOTICS ON THE TEETH — better evidence
                      than you&apos;d expect.</Text> The idea is bacteriotherapy: crowd out the
                      pathogens that drive periodontal disease rather than killing everything. In
                      dogs, a single <Text style={{ fontStyle: "italic" }}>Lactobacillus
                      acidophilus</Text> strain significantly reduced{" "}
                      <Text style={{ fontStyle: "italic" }}>Porphyromonas gingivalis</Text>, the key
                      periodontal pathogen. Another trial found L. acidophilus with{" "}
                      <Text style={{ fontStyle: "italic" }}>Enterococcus faecium</Text> shifted the
                      salivary microbiome and SIGNIFICANTLY REDUCED GINGIVAL INFLAMMATION. A dual
                      strain study cut plaque accumulation. Human L. reuteri trials point the same
                      way.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17.5 }}>
                      Two honest limits. It is{" "}
                      <Text style={{ fontWeight: "700" }}>STRAIN-SPECIFIC</Text> — the evidence is
                      for named strains, and most probiotics on the shelf are gut strains chosen for
                      digestion, which is a different job. And it{" "}
                      <Text style={{ fontWeight: "700" }}>DOESN&apos;T STICK</Text>: a 2025 review
                      states plainly that no study has shown durable colonisation of the canine
                      subgingival biofilm. The benefit lasts while you keep giving it.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17.5 }}>
                      <Text style={{ fontWeight: "700" }}>Fed or brushed on?</Text> The trials FED it
                      and measured salivary changes, so swallowing it with food is the studied route.
                      But a swallowed probiotic touches the teeth for seconds — brushing it on holds
                      it against the gum margin far longer. The two have never been compared head to
                      head in dogs. Mixing a pinch into coconut oil and brushing is a reasonable way
                      to get more contact time, and it costs nothing if you already buy probiotics.
                    </Text>

                    <Text style={{ color: t.text, fontSize: 12, marginTop: 7, lineHeight: 17.5 }}>
                      <Text style={{ fontWeight: "700" }}>⚠️ NEVER USE HUMAN TOOTHPASTE.</Text> Many
                      contain XYLITOL, which is genuinely toxic to dogs, and fluoride, which
                      isn&apos;t meant to be swallowed. Dog toothpaste is formulated to be
                      swallowed, and its abrasives are low-abrasion — there is no good evidence it
                      damages enamel. The hazard is the human tube, not the pet one.
                    </Text>
                  </View>
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
          {/* `|| learnMode` added 2026-08-21. Every Learn section lives inside
              this block, and every one of them is already individually gated on
              `(score !== null || learnMode)`. Requiring a product name here meant
              Learn rendered nothing at all. The score-dependent children below
              stay gated on `score !== null`, so Learn gets the writing without
              the score — which is exactly the ask. */}
          {!loading && !isTreatScan && (productName !== "" || learnMode) && (
            <>
              {score !== null && (
                /* SCORE HERO — rebuilt 2026-08-21 from the approved v1.9 mockup
                   (artifact 42693321). Was a 168px circular ring stacked over a
                   pill and a caption, ~250px of vertical space before any content.
                   Now one horizontal block: big number on the left, label and
                   one-line verdict on the right, sitting on the score colour's own
                   tint. Same three facts, a third of the height, so the "Watch out"
                   and "Good in here" lists sit above the fold. */
                <View
                  style={[
                    styles.scoreHero,
                    { backgroundColor: getScoreTint(score) },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreHeroNumber,
                      { color: getScoreColor(score) },
                    ]}
                  >
                    {score}
                  </Text>
                  <View style={styles.scoreHeroMeta}>
                    <Text
                      style={[
                        styles.scoreHeroLabel,
                        { color: getScoreColor(score) },
                      ]}
                    >
                      {getScoreLabel(score)}
                    </Text>
                    <Text
                      style={[
                        styles.scoreHeroSub,
                        { color: getScoreColor(score) },
                      ]}
                    >
                      {getScoreSubline(score)}
                    </Text>
                    <Text style={styles.scoreHeroNote}>
                      Processing · Ingredients · Nutrition Research
                    </Text>
                  </View>
                </View>
              )}

              {/* ── AT-A-GLANCE SUMMARY (v1.9 remodel, step 3) ────────────────
                  The scanner-app move: under the score, two short lists that
                  answer "what's wrong" and "what's good" before any scrolling.
                  Both are built from data already computed — `flagged` and the
                  positive half of `scoreBreakdown` — so nothing new is claimed
                  and nothing below is removed. The full detail still lives in
                  the tabs; this is the summary that was missing above them. */}
              {scanned && (flagged.length > 0 || scoreBreakdown.some((b) => b.value > 0)) && (
                <View style={{ marginHorizontal: 16, marginBottom: 14, gap: 10 }}>
                  {flagged.length > 0 && (
                    <View style={{ backgroundColor: t.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: t.border }}>
                      <Text style={{ color: t.critical, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
                        Watch out · {flagged.length}
                      </Text>
                      {flagged.slice(0, 3).map((f, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 6 }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: SEVERITY_COLORS[f.severity] || t.critical }} />
                          <Text numberOfLines={1} style={{ flex: 1, color: t.textStrong, fontSize: 13, fontWeight: "600" }}>{f.name}</Text>
                          <Text style={{ color: t.textFaint, fontSize: 10.5, fontWeight: "700", textTransform: "uppercase" }}>{f.severity}</Text>
                        </View>
                      ))}
                      {flagged.length > 3 && (
                        <Text style={{ color: t.textDim, fontSize: 11.5, marginTop: 2 }}>
                          +{flagged.length - 3} more — open “What&apos;s in it” below
                        </Text>
                      )}
                    </View>
                  )}
                  {scoreBreakdown.some((b) => b.value > 0) && (
                    <View style={{ backgroundColor: t.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: t.border }}>
                      <Text style={{ color: t.good, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
                        Good in here · {scoreBreakdown.filter((b) => b.value > 0).length}
                      </Text>
                      {scoreBreakdown.filter((b) => b.value > 0).slice(0, 3).map((b, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 6 }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.good }} />
                          <Text numberOfLines={1} style={{ flex: 1, color: t.textStrong, fontSize: 13, fontWeight: "600" }}>{b.label}</Text>
                          <Text style={{ color: t.good, fontSize: 11, fontWeight: "700" }}>+{b.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
              {/* Scan-only chrome. Hidden in Learn mode — there's nothing to go
                  back to and no product to name. */}
              {!learnMode && (
                <TouchableOpacity
                  style={styles.backBtnTop}
                  onPress={() => {
                    setScanned(false);
                    scanningRef.current = false;
                  }}
                >
                  <Text style={styles.backBtnTopText}>← Scan Again</Text>
                </TouchableOpacity>
              )}
              {learnMode ? null : (!productName || productName === "Scanned Product" || productName === "Analyzed Product") ? (
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

              {/* ── LAYER 1: THE ANSWER ────────────────────────────────────────
                  An owner should be able to read this card and STOP. Everything
                  below is optional depth, and the last line says so out loud —
                  giving permission to stop is what dissolves overwhelm, more than
                  having fewer sections does.

                  It invents nothing. Every item is already computed by the
                  scorer; this only decides what surfaces first. */}
              {score !== null && (() => {
                const items: { text: string; tone: string }[] = [];

                // Ordered by how much each should change a decision.
                if (toxicAdditives.length > 0)
                  items.push({
                    text: `${toxicAdditives.join(", ")} — avoid outright, this isn't a "less is better" ingredient`,
                    tone: t.critical,
                  });

                const severe = flagged.filter((f) => f.severity === "severe" || f.severity === "toxic");
                if (severe.length > 0)
                  items.push({
                    text: `${severe.slice(0, 3).map((f) => f.name).join(", ")}${severe.length > 3 ? ` +${severe.length - 3} more` : ""} — the synthetic additives actually worth caring about`,
                    tone: t.critical,
                  });

                // Legumes high on the list, named as the DCM pattern.
                const legumesTop5 = legumes.filter((l) => ingredients.slice(0, 5).includes(l));
                if (legumesTop5.length > 0)
                  items.push({
                    text: `${legumesTop5.join(", ")} in the top 5 ingredients — the pattern the FDA investigated for heart disease (DCM)`,
                    tone: t.dcm,
                  });

                if (omegaRating && /poor|high|imbalan|15|20|25|30/i.test(omegaRating.label || ""))
                  items.push({
                    text: `Omega-6:3 ratio looks high — that's the ratio that drives inflammation. Aim for 5:1 or lower`,
                    tone: t.moderateDeep,
                  });

                const milder = flagged.filter((f) => f.severity === "moderate" || f.severity === "mild");
                if (items.length < 3 && milder.length > 0)
                  items.push({
                    text: `${milder.length} lower-concern ingredient${milder.length > 1 ? "s" : ""} — worth knowing, not worth panicking about`,
                    tone: t.moderateDeep,
                  });

                const top = items.slice(0, 3);
                const clean = top.length === 0;

                // The three additions with the best evidence behind them. Deliberately
                // the same three regardless of score — they help every bowl, and a
                // scared owner needs one consistent answer, not a branching tree.
                const ADDITIONS = [
                  { icon: "🥚", what: "An egg a day", why: "The highest biological-value protein there is, plus choline for the liver" },
                  { icon: "🐟", what: "Fish oil or sardines", why: "82% of arthritic dogs improved weight-bearing on a force-plate trial. Also coat, skin and heart" },
                  { icon: "🦠", what: "A probiotic", why: "Canine trials show reduced gut and gum inflammation. Most valuable on dry food or after antibiotics" },
                ];

                return (
                  <View
                    style={{
                      backgroundColor: t.surface, borderRadius: 18, padding: 18,
                      marginHorizontal: 16, marginBottom: 14,
                      borderWidth: 2, borderColor: clean ? t.good : t.borderBright,
                    }}
                  >
                    <Text style={{ color: t.textDim, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 8 }}>
                      The short version
                    </Text>
                    <Text style={{ color: getScoreColor(score), fontSize: 20, fontWeight: "800", marginBottom: 10 }}>
                      {getScoreLabel(score)} — {score}/100
                    </Text>

                    {clean ? (
                      <Text style={{ color: t.text, fontSize: 14, lineHeight: 21 }}>
                        ✅ Nothing on this label raised a flag. That&apos;s genuinely uncommon —
                        most foods trip at least one.
                      </Text>
                    ) : (
                      <>
                        <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginBottom: 6 }}>
                          {top.length === 1 ? "One thing worth knowing:" : `${top.length} things worth knowing:`}
                        </Text>
                        {top.map((it, i) => (
                          <View key={i} style={{ flexDirection: "row", marginBottom: 6 }}>
                            <Text style={{ color: it.tone, fontSize: 14, fontWeight: "800", marginRight: 8 }}>•</Text>
                            <Text style={{ color: t.text, fontSize: 13.5, lineHeight: 20, flex: 1 }}>{it.text}</Text>
                          </View>
                        ))}
                      </>
                    )}

                    <View style={{ backgroundColor: t.goodTint, borderRadius: 12, padding: 13, marginTop: 12 }}>
                      <Text style={{ color: t.goodDeep, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>
                        👉 Three things that upgrade any bowl
                      </Text>
                      {ADDITIONS.map((a, i) => (
                        <View key={i} style={{ flexDirection: "row", marginTop: i === 0 ? 0 : 9 }}>
                          <Text style={{ fontSize: 16, marginRight: 9 }}>{a.icon}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700" }}>{a.what}</Text>
                            <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 16.5, marginTop: 1 }}>{a.why}</Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    <Text style={{ color: t.textMuted, fontSize: 12.5, marginTop: 13, lineHeight: 18, fontStyle: "italic" }}>
                      That&apos;s the important part — you can stop here. Everything below is
                      optional detail for when you want to go deeper.
                    </Text>
                  </View>
                );
              })()}

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

              {/* ── LAYER 2: THE FOUR DOORS ────────────────────────────────────
                  Everything below this point is gated. Nothing was deleted or
                  moved — each section declares a door and only the open one
                  renders. Closed by default, so a scared owner sees the answer
                  and four calm choices instead of twenty-two headers. */}

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
                    <Text style={{ color: t.accents.liver.fg, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>🍞 Carbs &amp; Lipoma-Prone Dogs</Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>High-carbohydrate processed food is the first thing holistic vets change for a lipoma-prone dog — the goal is lowering the inflammatory and toxin load the liver has to clear. Target carbs below 20%, ideally below 15%, and an omega-6:3 ratio of 5:1 or less.</Text>
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
                        <Text style={{ color: t.accents.liver.fg, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>🍞 Carbs &amp; Lipoma-Prone Dogs</Text>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 18 }}>High-carbohydrate processed food is the first thing holistic vets change for a lipoma-prone dog — the goal is lowering the inflammatory and toxin load the liver has to clear. Target carbs below 20%, ideally below 15%, and an omega-6:3 ratio of 5:1 or less.</Text>
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
                  title="🌾 Do dogs need carbs?"
                  topic="Carbs"
                  door="learn"
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

                  {/* The counterpoint. Both studies above are ENDURANCE studies, and
                      quoting them alone overstates the case — sprinting runs on a
                      different fuel and the data goes the other way. */}
                  <View style={{ backgroundColor: t.moderateTint, borderRadius: 9, padding: 11, marginBottom: 7, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                    <Text style={{ color: t.moderateDeep, fontWeight: "700", fontSize: 12.5 }}>
                      But sprinting is the exception · Hill et al., racing Greyhounds
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      A crossover trial fed racing Greyhounds 11 weeks each on a high-protein diet
                      (37% of energy from protein, 30% carbohydrate) and a moderate-protein one
                      (24% protein, 43% carbohydrate). On the{" "}
                      <Text style={{ fontWeight: "700" }}>lower-carbohydrate diet the dogs were 0.18
                      seconds SLOWER over 500 m</Text> — around two lengths. The best-performing
                      split was roughly 24% protein, 34% fat, 42% carbohydrate.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                      <Text style={{ fontWeight: "700" }}>This doesn&apos;t contradict the sled dog
                      work — it measures a different engine.</Text> Endurance is aerobic and burns
                      fat, which dogs carry in abundance. Sprinting is anaerobic and burns muscle
                      glycogen, which comes from carbohydrate and runs out fast. A dog on a very
                      low-carb diet can have excellent stamina and still lack a top gear.
                    </Text>
                  </View>

                  {/* Protein and heat. Belongs here because it's the same trade-off from
                      the other direction — and it's invisible to owners. */}
                  <View style={{ backgroundColor: t.highTint, borderRadius: 9, padding: 11, marginBottom: 7, borderLeftWidth: 3, borderLeftColor: t.high }}>
                    <Text style={{ color: t.highDeep, fontWeight: "700", fontSize: 12.5 }}>
                      🌡️ And protein is what makes a dog run hot
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      Digesting food produces heat — the{" "}
                      <Text style={{ fontWeight: "700" }}>heat increment of feeding</Text>, which can
                      reach 30% of the energy eaten. That heat is{" "}
                      <Text style={{ fontWeight: "700" }}>much larger for protein than for
                      carbohydrate or fat</Text>, and larger still when it&apos;s already hot out.
                      A dog&apos;s thermoneutral zone is only 68–86°F; above that he&apos;s
                      spending energy to cool, and a very high-protein meal adds to the load he&apos;s
                      trying to shed.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                      Worth knowing if you have a heat-sensitive dog on a protein-dense fresh diet.
                      TCVM has called protein-heavy food &quot;warming&quot; for centuries; this is
                      the same observation with a thermometer on it.
                    </Text>
                  </View>

                  {/* Post-exercise repletion. The one place carbohydrate has a clear,
                      measured job — and it's about timing, not diet percentage. */}
                  <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 7 }}>
                    <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5 }}>
                      Where carbs have a clear job · Wakshlag, Veterinary Therapeutics 2002
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                      Dogs given a maltodextrin supplement at{" "}
                      <Text style={{ fontWeight: "700" }}>1.5 g/kg body weight within 30 minutes of
                      exercise</Text> restored muscle glycogen to baseline within 4–24 hours.
                      Without it, glycogen sat at only{" "}
                      <Text style={{ fontWeight: "700" }}>50% of baseline</Text> the next day. Adding
                      protein to the supplement gave no extra glycogen benefit — the carbohydrate
                      did the work.
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                      The recommendation covers dogs working{" "}
                      <Text style={{ fontWeight: "700" }}>between five minutes and three hours a
                      day</Text> at intensity. Note what this means: it&apos;s about TIMING, not
                      diet percentage. A dog doing repeated hard sprints can be topped up after
                      sessions instead of carrying a higher-carbohydrate diet all week — which
                      keeps the glycogen without the chronic insulin load.
                    </Text>
                  </View>

                  <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginTop: 4, marginBottom: 4 }}>
                    So what number is actually good?
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginBottom: 8, lineHeight: 16 }}>
                    Nobody publishes a carbohydrate requirement, so these are judgements about
                    displacement and activity rather than official minimums. Percentages are dry
                    matter.
                  </Text>

                  {CARB_LEVELS.map((c, i) => {
                    const tone =
                      c.tier === "ideal" ? t.good
                      : c.tier === "fine" ? t.info
                      : c.tier === "watch" ? t.moderateDeep
                      : t.critical;
                    return (
                      <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 7 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                          <Text style={{ color: tone, fontSize: 13, fontWeight: "800", marginRight: 8 }}>
                            {c.range}
                          </Text>
                          <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "600", flex: 1 }}>
                            {c.label}
                          </Text>
                        </View>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{c.b}</Text>
                      </View>
                    );
                  })}

                  <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 7, borderLeftWidth: 3, borderLeftColor: t.good }}>
                    <Text style={{ color: t.goodDeep, fontWeight: "800", fontSize: 12.5, marginBottom: 5 }}>
                      Match it to the dog, not to a philosophy
                    </Text>
                    {CARB_MATCHING.map((m, i) => (
                      <View key={i} style={{ marginTop: 6 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700", flex: 1 }}>
                            {m.dog}
                          </Text>
                          <Text style={{ color: t.goodDeep, fontSize: 12, fontWeight: "800" }}>{m.target}</Text>
                        </View>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16, marginTop: 1 }}>
                          {m.why}
                        </Text>
                      </View>
                    ))}
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

              {/* Bloat / GDV. Sits next to the carb section because both are about
                  HOW a dog is fed rather than what's in the bag — and because this
                  is the one feeding decision that can kill a dog in an afternoon. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="🚨 Bloat (GDV)"
                  topic="Bloat"
                  door="learn"
                  askLabel="For my dog"
                  onAskAI={() =>
                    askAboutSection(
                      `What's my dog's actual bloat risk given his breed, age, how fast he eats, and what I feed him — and which of the prevention steps would matter most for him specifically?`,
                    )
                  }
                >
                  <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>
                    Bloat is about <Text style={{ fontWeight: "700" }}>how</Text> a dog is fed, not
                    what&apos;s in the bowl — which is why it sits outside the score. Two of the
                    most repeated pieces of advice about it turn out to be backwards or
                    unsupported, so it&apos;s worth reading even if you think you know this one.
                  </Text>

                  {GDV_EVIDENCE.map((g, i) => {
                    const tone =
                      g.tier === "act"
                        ? { fg: t.critical, bg: t.criticalTint, tag: "DO THIS" }
                        : g.tier === "mixed"
                        ? { fg: t.moderateDeep, bg: t.moderateTint, tag: "EVIDENCE CONFLICTS" }
                        : { fg: t.textDim, bg: t.surfaceSunken, tag: "GOOD TO KNOW" };
                    return (
                      <View
                        key={i}
                        style={{
                          backgroundColor: tone.bg,
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                            {g.h}
                          </Text>
                          <Text style={{ color: tone.fg, fontSize: 9.5, fontWeight: "800", letterSpacing: 0.3 }}>
                            {tone.tag}
                          </Text>
                        </View>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{g.b}</Text>
                      </View>
                    );
                  })}

                  {/* What it sits in. Lives here rather than in its own section because
                      bowl height is already a GDV factor — material and hygiene are the
                      same decision made once. */}
                  <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginTop: 6, marginBottom: 4 }}>
                    🥣 And what it sits in
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginBottom: 8, lineHeight: 16 }}>
                    Height is a bloat factor, so you&apos;re already choosing a bowl. These are the
                    other two things worth getting right while you do.
                  </Text>

                  {BOWL_MATERIALS.map((m, i) => {
                    const tone =
                      m.verdict === "best"
                        ? { fg: t.good, bg: t.goodTint, mark: "✓" }
                        : m.verdict === "good"
                        ? { fg: t.moderateDeep, bg: t.moderateTint, mark: "~" }
                        : { fg: t.critical, bg: t.criticalTint, mark: "✕" };
                    return (
                      <View
                        key={i}
                        style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 8 }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                          <View
                            style={{
                              width: 18, height: 18, borderRadius: 999, backgroundColor: tone.bg,
                              alignItems: "center", justifyContent: "center", marginRight: 8,
                            }}
                          >
                            <Text style={{ color: tone.fg, fontSize: 11, fontWeight: "800" }}>{tone.mark}</Text>
                          </View>
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                            {m.material}
                          </Text>
                        </View>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{m.b}</Text>
                      </View>
                    );
                  })}

                  {BOWL_PRACTICE.map((p, i) => (
                    <View
                      key={i}
                      style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.info }}
                    >
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                        {p.h}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{p.b}</Text>
                    </View>
                  ))}

                  {/* The whole section in four lines. Most owners will read only this. */}
                  <View style={{ backgroundColor: t.goodTint, borderRadius: 10, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.good }}>
                    <Text style={{ color: t.goodDeep, fontWeight: "800", fontSize: 13, marginBottom: 6 }}>
                      If you only do four things
                    </Text>
                    {[
                      "Bowl on the FLOOR, never raised.",
                      "Slow the eating down — flat wide dish, lick mat, or slow-feeder.",
                      "Split the day's food into two or three meals instead of one.",
                      "Walk in the cool hours. That matters more than any waiting rule.",
                    ].map((line, i) => (
                      <View key={i} style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ color: t.good, fontSize: 12.5, fontWeight: "800", marginRight: 7 }}>
                          {i + 1}.
                        </Text>
                        <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, flex: 1 }}>{line}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16, fontStyle: "italic" }}>
                    Primary source: Glickman et al., Purdue University — a 5-year prospective study
                    of 1,637 large and giant breed dogs, plus the associated dietary risk-factor
                    work. Still the largest body of evidence on this.
                  </Text>
                </AccordionSection>
              )}

              {/* Lifespan. Deliberately its own section rather than folded into bloat —
                  this is the single biggest lever an owner has and it shouldn't arrive
                  as a footnote to a safety warning. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="⏳ How long he lives"
                  topic="Lifespan"
                  door="learn"
                  askLabel="For my dog"
                  onAskAI={() =>
                    askAboutSection(
                      `Given my dog's age, weight and body condition, am I already doing the thing that extends lifespan — and if not, what would I change? Be specific about how much food, not just "keep him lean".`,
                    )
                  }
                >
                  <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>
                    The largest proven effect in dog nutrition isn&apos;t a brand, an ingredient or
                    a supplement. It&apos;s how much food goes in the bowl — and it was measured in
                    Labradors.
                  </Text>

                  {LIFESPAN_EVIDENCE.map((l, i) => {
                    const tone =
                      l.strength === "proven"
                        ? { fg: t.good, bg: t.goodTint, tag: "RANDOMISED · CAUSAL" }
                        : l.strength === "conflict"
                        ? { fg: t.moderateDeep, bg: t.moderateTint, tag: "EVIDENCE CONFLICTS" }
                        : { fg: t.info, bg: t.surfaceSunken, tag: "OBSERVATIONAL ONLY" };
                    return (
                      <View
                        key={i}
                        style={{ backgroundColor: tone.bg, borderRadius: 10, padding: 12, marginBottom: 8 }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                            {l.h}
                          </Text>
                          <Text style={{ color: tone.fg, fontSize: 9, fontWeight: "800", letterSpacing: 0.3 }}>
                            {tone.tag}
                          </Text>
                        </View>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{l.b}</Text>
                      </View>
                    );
                  })}

                  <View style={{ backgroundColor: t.goodTint, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: t.good }}>
                    <Text style={{ color: t.goodDeep, fontWeight: "800", fontSize: 13, marginBottom: 5 }}>
                      The two-second check
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18 }}>
                      Run your hands along his sides. You should feel ribs easily under a thin
                      layer, the way the back of your hand feels knuckles — not have to press.
                      Looking down from above, there should be a visible waist behind the ribs.
                      {"\n\n"}
                      If both are true, you are already running the intervention that bought those
                      Labradors nearly two extra years. If not, that&apos;s worth more than every
                      other decision in this app combined.
                    </Text>
                  </View>

                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 9, lineHeight: 16, fontStyle: "italic" }}>
                    Kealy et al., Journal of the American Veterinary Medical Association, 2002 ·
                    Bray et al., GeroScience, 2022 (Dog Aging Project)
                  </Text>
                </AccordionSection>
              )}

              {/* Deficiency checklist. Sign-first, because an owner starts from what
                  they can see. The context block goes ABOVE the list on purpose —
                  handing someone deficiency signs without base rates causes harm. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="🔎 Is my dog missing something?"
                  topic="Missing nutrients"
                  door="learn"
                  askLabel="About my dog"
                  onAskAI={() =>
                    askAboutSection(
                      `Here's what I'm actually seeing in my dog. Help me work out whether it's likely to be a nutrient problem or something far more common — and be honest if there isn't enough to go on.`,
                    )
                  }
                >
                  <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>
                    Built backwards from what you can actually SEE, rather than from nutrient
                    names — because nobody notices &quot;zinc deficiency&quot;, they notice crusty
                    skin. Read the four notes first; they matter more than the list.
                  </Text>

                  {DEFICIENCY_CONTEXT.map((c, i) => (
                    <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 11, marginBottom: 7 }}>
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                        {c.h}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{c.b}</Text>
                    </View>
                  ))}

                  {DEFICIENCY_CHECKLIST.map((grp, i) => (
                    <View key={i} style={{ marginTop: 10 }}>
                      <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "800", marginBottom: 5 }}>
                        {grp.emoji} {grp.area}
                      </Text>
                      {grp.signs.map((s, j) => {
                        const tone =
                          s.urgency === "urgent"
                            ? { fg: t.critical, bg: t.criticalTint, tag: "VET NOW" }
                            : s.urgency === "soon"
                            ? { fg: t.moderateDeep, bg: t.moderateTint, tag: "BOOK A VISIT" }
                            : { fg: t.textDim, bg: t.surfaceSunken, tag: "WATCH" };
                        return (
                          <View key={j} style={{ backgroundColor: tone.bg, borderRadius: 10, padding: 11, marginBottom: 7 }}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
                              <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                                {s.see}
                              </Text>
                              <Text style={{ color: tone.fg, fontSize: 9, fontWeight: "800", letterSpacing: 0.3, marginLeft: 6, marginTop: 2 }}>
                                {tone.tag}
                              </Text>
                            </View>
                            <Text style={{ color: tone.fg, fontSize: 11.5, fontWeight: "700", marginBottom: 3 }}>
                              Could be: {s.likely}
                            </Text>
                            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{s.note}</Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}

                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 8, lineHeight: 16, fontStyle: "italic" }}>
                    This is a prompt for a conversation with your vet, not a diagnosis. Nothing here
                    replaces an exam — and most of these signs have far commoner causes than diet.
                  </Text>
                </AccordionSection>
              )}

              {/* Home-cooked builder. A GAP DETECTOR, not a recipe generator —
                  because the literature says recipe generators are exactly where
                  this goes wrong, including ones written by vets. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="🍳 Build a home-cooked bowl"
                  door="what-to-do"
                  askLabel="Check my recipe"
                  onAskAI={() =>
                    askAboutSection(
                      `I want to home-cook for my dog. Walk me through what my recipe would be missing and how to fix it with real food — and be honest about what you can't verify without running it against a nutrient database.`,
                    )
                  }
                >
                  {/* Evidence first. Anyone who reads only the top of this section
                      should still come away knowing the base rate. */}
                  <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.critical }}>
                    <Text style={{ color: t.criticalDeep, fontWeight: "800", fontSize: 13, marginBottom: 5 }}>
                      Read this before you cook
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18 }}>
                      Home cooking is a genuinely good thing to do — and it fails far more often
                      than owners realise. <Text style={{ fontWeight: "700" }}>Of 200 recipes
                      evaluated, 129 of them written by veterinarians, only 9 met AAFCO
                      standards.</Text> This tool exists to close that gap, not to pretend it
                      isn&apos;t there.
                    </Text>
                  </View>

                  {HOMEMADE_EVIDENCE.map((e, i) => (
                    <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                        {e.h}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{e.b}</Text>
                    </View>
                  ))}

                  {/* The calculator */}
                  <View style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.borderBright }}>
                    <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginBottom: 8 }}>
                      Your dog&apos;s daily amounts
                    </Text>

                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginBottom: 4 }}>Weight (lb)</Text>
                    <TextInput
                      value={hmWeight}
                      onChangeText={setHmWeight}
                      keyboardType="numeric"
                      placeholder="e.g. 75"
                      placeholderTextColor={t.textFaint}
                      style={{
                        backgroundColor: t.surfaceSunken, borderRadius: 8, paddingHorizontal: 12,
                        paddingVertical: 10, color: t.textStrong, fontSize: 15, marginBottom: 10,
                      }}
                    />

                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginBottom: 6 }}>Activity level</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 4 }}>
                      {[
                        { label: "Senior / low", v: 1.4 },
                        { label: "Typical", v: 1.6 },
                        { label: "Active", v: 1.8 },
                        { label: "Very active", v: 2.2 },
                      ].map((a) => (
                        <TouchableOpacity
                          key={a.label}
                          onPress={() => setHmActivity(a.v)}
                          style={{
                            backgroundColor: hmActivity === a.v ? t.good : t.surfaceSunken,
                            borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7,
                            marginRight: 6, marginBottom: 6,
                          }}
                        >
                          <Text style={{
                            color: hmActivity === a.v ? t.onAccent : t.textMuted,
                            fontSize: 12, fontWeight: "700",
                          }}>{a.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {(() => {
                      const lb = parseFloat(hmWeight);
                      if (!lb || lb <= 0) return null;
                      const kg = lb / 2.2046;
                      const rer = 70 * Math.pow(kg, 0.75);
                      const kcal = Math.round(rer * hmActivity);
                      // Raw/moist bowls run ~1.45 kcal/g as fed. Cooking drives off
                      // water and concentrates it, so a cooked bowl weighs less for
                      // the same calories — hence the note below rather than one number.
                      const grams = Math.round(kcal / 1.45);
                      // Percentages sum to 100 and each sits inside the stated range
                      // in HOMEMADE_FRAMEWORK. Keep them in sync if either changes.
                      const rows: [string, string][] = [
                        ["Muscle meat (incl. heart)", `${Math.round(grams * 0.6)} g`],
                        ["RAW: bone · COOKED: eggshell", `${Math.round(grams * 0.12)} g`],
                        ["Liver", `${Math.round(grams * 0.05)} g`],
                        ["Other secreting organ", `${Math.round(grams * 0.05)} g`],
                        ["Vegetables / fruit", `${Math.round(grams * 0.18)} g`],
                      ];
                      return (
                        <View style={{ marginTop: 6 }}>
                          <View style={{ backgroundColor: t.goodTint, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                            <Text style={{ color: t.goodDeep, fontSize: 12.5, fontWeight: "700" }}>
                              ≈ {kcal} kcal/day · about {grams} g of food
                            </Text>
                            <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 3, lineHeight: 15 }}>
                              From resting energy (70 × kg^0.75) × your activity factor. A starting
                              point — adjust by body condition, not by the number. Ribs easily felt,
                              visible waist from above.
                            </Text>
                          </View>
                          {rows.map(([k, v], i) => (
                            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: t.border }}>
                              <Text style={{ color: t.text, fontSize: 12.5, flex: 1 }}>{k}</Text>
                              <Text style={{ color: t.good, fontSize: 12.5, fontWeight: "800" }}>{v}</Text>
                            </View>
                          ))}
                          <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 8, lineHeight: 15, fontStyle: "italic" }}>
                            If you can&apos;t feed bone, swap that line for ground eggshell — roughly
                            ½ tsp per pound of finished food — and make up the weight in muscle meat.
                          </Text>
                        </View>
                      );
                    })()}
                  </View>

                  {/* ── THE FORMULATOR ─────────────────────────────────────────
                      Add ingredients with weights, get nutrients per 1,000 kcal
                      against AAFCO. A gap detector with real arithmetic behind it. */}
                  <View style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.borderBright }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, flex: 1 }}>
                        🧪 Recipe analyser
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setPickerOpen((v) => !v);
                        }}
                        style={{ backgroundColor: t.good, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}
                      >
                        <Text style={{ color: t.onAccent, fontSize: 12, fontWeight: "800" }}>
                          {pickerOpen ? "Done" : "+ Add food"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {pickerOpen && (
                      <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 8, padding: 8, marginBottom: 10 }}>
                        {(["meat", "organ", "fish", "egg", "calcium", "veg", "extra"] as const).map((cat) => (
                          <View key={cat} style={{ marginBottom: 6 }}>
                            <Text style={{ color: t.textDim, fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 3 }}>
                              {cat.toUpperCase()}
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                              {INGREDIENT_DB.map((ing, idx) =>
                                ing.cat !== cat ? null : (
                                  <TouchableOpacity
                                    key={idx}
                                    onPress={() =>
                                      setRecipe((r) =>
                                        r[idx] !== undefined
                                          ? Object.fromEntries(Object.entries(r).filter(([k]) => +k !== idx))
                                          : { ...r, [idx]: "100" },
                                      )
                                    }
                                    style={{
                                      backgroundColor: recipe[idx] !== undefined ? t.good : t.surface,
                                      borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5,
                                      marginRight: 5, marginBottom: 5,
                                    }}
                                  >
                                    <Text style={{
                                      color: recipe[idx] !== undefined ? t.onAccent : t.textMuted,
                                      fontSize: 11, fontWeight: "600",
                                    }}>
                                      {ing.name}
                                    </Text>
                                  </TouchableOpacity>
                                ),
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {Object.keys(recipe).length === 0 ? (
                      <Text style={{ color: t.textMuted, fontSize: 12, lineHeight: 17, fontStyle: "italic" }}>
                        Tap &quot;Add food&quot;, pick your ingredients, then set grams for each.
                        Nutrients are calculated per 1,000 kcal and compared against AAFCO adult
                        minimums.
                      </Text>
                    ) : (
                      <>
                        {Object.entries(recipe).map(([k, g]) => {
                          const ing = INGREDIENT_DB[+k];
                          return (
                            <View key={k} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                              <Text style={{ color: t.text, fontSize: 12.5, flex: 1 }} numberOfLines={1}>
                                {ing.name}
                              </Text>
                              <TextInput
                                value={g}
                                onChangeText={(v) => setRecipe((r) => ({ ...r, [+k]: v }))}
                                keyboardType="numeric"
                                style={{
                                  backgroundColor: t.surfaceSunken, borderRadius: 6, paddingHorizontal: 10,
                                  paddingVertical: 6, color: t.textStrong, fontSize: 13, width: 68,
                                  textAlign: "right", marginRight: 4,
                                }}
                              />
                              <Text style={{ color: t.textDim, fontSize: 12, width: 16 }}>g</Text>
                            </View>
                          );
                        })}

                        {(() => {
                          const tot: Record<string, number> = {
                            kcal: 0, protein: 0, fat: 0, ca: 0, p: 0, vitD: 0, vitE: 0, zinc: 0, choline: 0,
                          };
                          let grams = 0;
                          for (const [k, g] of Object.entries(recipe)) {
                            const q = parseFloat(g);
                            if (!q || q <= 0) continue;
                            const ing = INGREDIENT_DB[+k];
                            grams += q;
                            for (const key of Object.keys(tot)) {
                              tot[key] += ((ing as any)[key] as number) * (q / 100);
                            }
                          }
                          if (tot.kcal < 1) return null;
                          const per1000 = (v: number) => (v / tot.kcal) * 1000;
                          const caP = tot.p > 0 ? tot.ca / tot.p : 0;
                          return (
                            <View style={{ marginTop: 8 }}>
                              <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                                <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                                  {Math.round(grams)} g · {Math.round(tot.kcal)} kcal
                                </Text>
                              </View>

                              {AAFCO_PER_1000.map((n) => {
                                const val = per1000(tot[n.key]);
                                const pct = Math.round((val / n.min) * 100);
                                const over = n.max ? val > n.max : false;
                                const tone = over ? t.critical : pct >= 100 ? t.good : pct >= 75 ? t.moderateDeep : t.critical;
                                return (
                                  <View key={n.key} style={{ marginBottom: 7 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                                      <Text style={{ color: t.text, fontSize: 12, flex: 1 }}>{n.label}</Text>
                                      <Text style={{ color: t.textDim, fontSize: 11, marginRight: 8 }}>
                                        {val < 10 ? val.toFixed(1) : Math.round(val)} / {n.min} {n.unit}
                                      </Text>
                                      <Text style={{ color: tone, fontSize: 12, fontWeight: "800", width: 52, textAlign: "right" }}>
                                        {over ? "OVER MAX" : pct + "%"}
                                      </Text>
                                    </View>
                                    <View style={{ height: 4, backgroundColor: t.surfaceSunken, borderRadius: 999, overflow: "hidden" }}>
                                      <View style={{ height: 4, width: `${Math.min(100, pct)}%`, backgroundColor: tone }} />
                                    </View>
                                  </View>
                                );
                              })}

                              <View style={{
                                backgroundColor: caP >= 1 && caP <= 2 ? t.goodTint : t.criticalTint,
                                borderRadius: 8, padding: 10, marginTop: 4,
                              }}>
                                <Text style={{
                                  color: caP >= 1 && caP <= 2 ? t.goodDeep : t.criticalDeep,
                                  fontSize: 12.5, fontWeight: "700",
                                }}>
                                  Calcium : Phosphorus = {caP.toFixed(2)} : 1
                                </Text>
                                <Text style={{ color: t.text, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                                  {caP >= 1 && caP <= 2
                                    ? "Inside AAFCO's 1:1 – 2:1 range."
                                    : caP < 1
                                    ? "TOO LOW. Muscle meat is phosphorus-heavy — add a calcium source (eggshell, bone, sardines with bones)."
                                    : "TOO HIGH. Reduce the calcium source or add more muscle meat."}
                                </Text>
                              </View>

                              {/* ── THE FIX ENGINE ──────────────────────────────
                                  A gap you can't close is just a report card. For each
                                  short nutrient, find the food in the database with the
                                  best density per calorie and say how much to add. */}
                              {(() => {
                                const short = AAFCO_PER_1000.filter(
                                  (n) => per1000(tot[n.key]) < n.min,
                                );
                                if (short.length === 0)
                                  return (
                                    <View style={{ backgroundColor: t.goodTint, borderRadius: 8, padding: 10, marginTop: 8, borderLeftWidth: 3, borderLeftColor: t.good }}>
                                      <Text style={{ color: t.goodDeep, fontSize: 12.5, fontWeight: "800" }}>
                                        ✓ All eight clear their minimums
                                      </Text>
                                      <Text style={{ color: t.text, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                                        You&apos;ve cleared the nutrients that actually fail in home
                                        diets. Next step for a diet you intend to feed long term:
                                        lab-analyse the finished food.
                                      </Text>
                                    </View>
                                  );
                                return (
                                  <View style={{ backgroundColor: t.moderateTint, borderRadius: 8, padding: 10, marginTop: 8, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                                    <Text style={{ color: t.moderateDeep, fontSize: 12.5, fontWeight: "800", marginBottom: 5 }}>
                                      How to close the gaps
                                    </Text>
                                    {short.map((n) => {
                                      // Best source = highest nutrient per kcal, so the fix
                                      // adds the least energy. Zero-calorie sources (eggshell)
                                      // rank first automatically.
                                      let best = -1, bestScore = 0;
                                      INGREDIENT_DB.forEach((ing, i) => {
                                        const amt = (ing as any)[n.key] as number;
                                        if (!amt) return;
                                        const score = amt / Math.max(ing.kcal, 8);
                                        if (score > bestScore) { bestScore = score; best = i; }
                                      });
                                      if (best < 0) return null;
                                      const src = INGREDIENT_DB[best];
                                      const deficitPer1000 = n.min - per1000(tot[n.key]);
                                      const deficitAbs = (deficitPer1000 * tot.kcal) / 1000;
                                      const gramsNeeded = deficitAbs / (((src as any)[n.key] as number) / 100);
                                      return (
                                        <View key={n.key} style={{ marginTop: 6 }}>
                                          <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700" }}>
                                            {n.label} — short by {deficitAbs < 10 ? deficitAbs.toFixed(1) : Math.round(deficitAbs)} {n.unit}
                                          </Text>
                                          <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16 }}>
                                            Add ≈{" "}
                                            <Text style={{ fontWeight: "700" }}>
                                              {gramsNeeded < 1 ? gramsNeeded.toFixed(2) : Math.round(gramsNeeded)} g {src.name}
                                            </Text>
                                            {src.kcal > 0
                                              ? ` (+${Math.round((gramsNeeded * src.kcal) / 100)} kcal)`
                                              : " (no calories)"}
                                          </Text>
                                        </View>
                                      );
                                    })}
                                    <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 8, lineHeight: 15.5 }}>
                                      Fixes are calculated one at a time — adding a food changes
                                      everything else, so re-check after each change rather than
                                      adding them all at once.
                                    </Text>
                                  </View>
                                );
                              })()}

                              <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 9, lineHeight: 15.5, fontStyle: "italic" }}>
                                Eight nutrients shown — the ones the research says actually fail.
                                AAFCO sets 40+. Passing all eight means you&apos;ve cleared the
                                common failures, NOT that the diet is complete and balanced. The
                                step that closes that gap is a lab analysis of the finished food —
                                which is exactly what fresh brands do, and why they can publish
                                real numbers.
                              </Text>
                            </View>
                          );
                        })()}
                      </>
                    )}
                  </View>

                  {/* The branch. This framework came out of raw feeding, and the bone
                      line is genuinely dangerous if applied to a cooked bowl. */}
                  <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.critical }}>
                    <Text style={{ color: t.criticalDeep, fontWeight: "800", fontSize: 13, marginBottom: 5 }}>
                      🦴 Raw or cooked? One line changes, and it matters
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginBottom: 6 }}>
                      This framework comes from raw feeding, where bone is the calcium source.
                      <Text style={{ fontWeight: "700" }}> Cooking makes bone brittle and it
                      splinters — never cook bone, and never feed bone that has been cooked.</Text>
                    </Text>
                    {[
                      ["RAW / FROZEN", "Use raw meaty bones for the calcium line — chicken necks, wings, turkey necks. Freeze fish first (−4°F for 7 days) and check the fish sheet for thiaminase before feeding fish raw."],
                      ["COOKED", "Swap the bone line for ground eggshell (≈½ tsp per pound of finished food) or bone meal, and make up the weight in muscle meat. Add back thiamine, folate and vitamin C — heat degrades all three. Lightly cook rather than hard-roast."],
                      ["EITHER WAY", "Weights below assume a moist bowl at roughly 1.45 kcal/g. Cooking drives off water and concentrates the calories, so a cooked bowl weighs LESS for the same energy — weigh ingredients raw, then cook."],
                    ].map(([h, b], i) => (
                      <View key={i} style={{ marginTop: 7 }}>
                        <Text style={{ color: t.criticalDeep, fontSize: 11.5, fontWeight: "800", letterSpacing: 0.3 }}>
                          {h}
                        </Text>
                        <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginTop: 2 }}>{b}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginBottom: 4 }}>
                    The framework
                  </Text>
                  {HOMEMADE_FRAMEWORK.map((f, i) => (
                    <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                          {f.part}
                        </Text>
                        <Text style={{ color: t.good, fontSize: 12.5, fontWeight: "800" }}>{f.pct}</Text>
                      </View>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{f.why}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16, marginTop: 4 }}>
                        {f.examples}
                      </Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginTop: 4, marginBottom: 4 }}>
                    The gaps that framework leaves — and the food that fills them
                  </Text>
                  {HOMEMADE_GAPS.map((g, i) => (
                    <View key={i} style={{ backgroundColor: t.moderateTint, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                      <Text style={{ color: t.moderateDeep, fontSize: 12.5, fontWeight: "800", marginBottom: 4 }}>
                        {g.nutrient}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginBottom: 5 }}>
                        {g.risk}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>
                        <Text style={{ fontWeight: "700" }}>Food fix: </Text>{g.fix}
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16, marginTop: 4 }}>
                        <Text style={{ fontWeight: "700" }}>If food can&apos;t: </Text>{g.supplement}
                      </Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16, fontStyle: "italic" }}>
                    Stockman, Fascetti, Kass & Larsen · Journal of the American Veterinary Medical
                    Association, 2013 · plus Dog Aging Project survey data on 1,726 home-prepared diets.
                  </Text>

                </AccordionSection>
              )}

              {/* ── THE OMEGA GUIDE ── Added 2026-08-22 from Kyle's omega
                  research. Sits above the calculator because you need to know
                  WHICH source you're buying before the arithmetic is worth
                  doing. The calculator below is untouched. */}
              <AccordionSection
                title="🐟 The omega guide"
                  topic="Omega-3"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Which omega-3 supplement should I use for my dog, and how much? Cover krill vs fish oil vs algal oil.`,
                  )
                }
              >
                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.good }}>
                  <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                    Why this is foundational, not optional
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                    Dogs need both omega-6 and omega-3 daily and cannot produce either
                    themselves — a deficiency leads to dry skin, coat abnormalities,
                    reproductive issues and a general failure to thrive. The problem is
                    that most commercial and highly processed foods are very high in
                    omega-6 and extremely low in omega-3. The ratio that supports a healthy
                    inflammatory response is
                    <Text style={{ fontWeight: "800" }}> 5:1 or less</Text>. Many kibbles on
                    the shelf run as high as
                    <Text style={{ fontWeight: "800" }}> 30:1</Text>. That imbalance is what
                    makes daily omega-3 supplementation foundational.
                  </Text>
                </View>

                <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 4, marginBottom: 2 }}>
                  What omega-3 actually does
                </Text>
                {OMEGA_BENEFITS.map((b, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 9, marginTop: 8, alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 15 }}>{b.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "800" }}>{b.area}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, marginTop: 2, lineHeight: 17 }}>{b.detail}</Text>
                    </View>
                  </View>
                ))}

                <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 14, marginBottom: 2 }}>
                  Source showdown — this decides what you buy
                </Text>
                {OMEGA_SOURCES.map((s, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: t.surface,
                      borderRadius: 9,
                      padding: 11,
                      marginTop: 7,
                      borderLeftWidth: 3,
                      borderLeftColor:
                        s.verdict === "best" ? t.good
                          : s.verdict === "good" ? t.moderate
                            : t.critical,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "800" }}>{s.name}</Text>
                      <Text
                        style={{
                          color:
                            s.verdict === "best" ? t.good
                              : s.verdict === "good" ? t.moderateDeep
                                : t.critical,
                          fontSize: 10,
                          fontWeight: "800",
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                        }}
                      >
                        {s.verdict === "best" ? "Best" : s.verdict === "good" ? "Good" : "Caution"}
                      </Text>
                    </View>
                    <Text style={{ color: t.good, fontSize: 12, fontWeight: "700", marginTop: 3 }}>{s.headline}</Text>
                    <Text style={{ color: t.text, fontSize: 11.5, marginTop: 4, lineHeight: 17 }}>{s.detail}</Text>
                  </View>
                ))}

                <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginTop: 14 }}>
                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                    Therapeutic dosing guidelines
                  </Text>
                  {OMEGA_DOSING.map((d, i) => (
                    <View
                      key={i}
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: t.border,
                      }}
                    >
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{d.level}</Text>
                      <Text style={{ color: t.good, fontSize: 12.5, fontWeight: "800", marginTop: 2 }}>{d.amount}</Text>
                    </View>
                  ))}
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 9, lineHeight: 17 }}>
                    Krill needs half the milligrams of fish oil for the same effect — that&apos;s
                    the bioavailability difference, not a weaker product.
                  </Text>
                </View>

                <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 14, marginBottom: 2 }}>
                  The &quot;safety first&quot; protocol
                </Text>
                {OMEGA_SAFETY.map((s, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 9, marginTop: 8, alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 15 }}>{s.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "800" }}>{s.rule}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, marginTop: 2, lineHeight: 17 }}>{s.detail}</Text>
                    </View>
                  </View>
                ))}

                <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16 }}>
                  Save this
                </Text>
                <Image
                  source={require("../assets/images/omega-guide.jpg")}
                  style={{
                    width: "100%",
                    aspectRatio: 1800 / 1004,
                    borderRadius: 9,
                    marginTop: 6,
                  }}
                  resizeMode="contain"
                  accessibilityLabel="The Canine Omega Guide — why omegas matter, the bioavailability spectrum of plant versus marine sources, fish oil versus krill and algal alternatives, therapeutic dosing guidelines, and the safety first protocol"
                />
              </AccordionSection>

              {/* Omega calculator — the arithmetic this app kept doing by hand.
                  Labels rarely give EPA/DHA, so the marine-share slider makes the
                  guess explicit instead of hiding it. */}
              <AccordionSection
                title="🧮 Omega-3 calculator"
                  topic="Omega-3"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Help me work out how much EPA and DHA my dog is actually getting from his food and supplements, and whether that's enough.`,
                  )
                }
              >
                <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                  Work out what your dog actually gets. Use GRAMS fed per day, not calories —
                  omega-3 percentages are by weight, and a wet food and a freeze-dried one have
                  completely different calorie densities. Blanks count as zero.
                </Text>

                {(() => {
                  const num = (v: string) => {
                    const n = parseFloat(v);
                    return isNaN(n) ? 0 : n;
                  };
                  const lb = num(calcWeight);
                  const kg = lb * 0.4536;
                  const mbw = kg > 0 ? Math.pow(kg, 0.75) : 0;
                  const share = calcMarineShare / 100;

                  // Grams/day x omega-3% is direct — no calorie-density assumption.
                  // An earlier version took kcal and divided by a fixed 4.75 kcal/g, which
                  // is roughly right for freeze-dried and badly wrong for a 70%-moisture
                  // fresh food (~1.6 kcal/g), understating it by a factor of three.
                  const marineFrom = (grams: string, o3pct: string) =>
                    num(grams) * (num(o3pct) / 100) * 1000 * share;

                  const a = marineFrom(calcKcalA, calcO3A);
                  const b = marineFrom(calcKcalB, calcO3B);
                  const supp = num(calcSuppMg) * num(calcSuppServ);
                  const total = a + b + supp;

                  const maintLo = kg * 20, maintHi = kg * 55;
                  const therLo = mbw * 230, therHi = mbw * 370;

                  const verdict =
                    kg === 0 ? null
                    : total === 0 ? null
                    : total < maintLo ? { txt: "Below maintenance", c: t.high }
                    : total < therLo ? { txt: "Maintenance — fine for general health", c: t.good }
                    : total <= therHi ? { txt: "Therapeutic — anti-inflammatory range", c: t.good }
                    : { txt: "Above the NRC safe upper limit", c: t.critical };

                  const field = (label: string, val: string, set: (v: string) => void, ph: string) => (
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.textDim, fontSize: 10.5, marginBottom: 2 }}>{label}</Text>
                      <TextInput
                        value={val}
                        onChangeText={set}
                        placeholder={ph}
                        placeholderTextColor={t.textDim}
                        keyboardType="decimal-pad"
                        style={{
                          backgroundColor: t.surface,
                          borderWidth: 1,
                          borderColor: t.border,
                          borderRadius: 8,
                          paddingHorizontal: 9,
                          paddingVertical: 7,
                          color: t.textStrong,
                          fontSize: 13,
                        }}
                      />
                    </View>
                  );

                  return (
                    <View>
                      <View style={{ marginBottom: 10 }}>
                        {field("Dog's weight (lbs)", calcWeight, setCalcWeight, "75")}
                      </View>

                      <Text style={{ color: t.info, fontSize: 11, fontWeight: "800", marginBottom: 4, letterSpacing: 0.4 }}>
                        FOOD 1
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8, marginBottom: 9 }}>
                        {field("grams/day", calcKcalA, setCalcKcalA, "714")}
                        {field("omega-3 %", calcO3A, setCalcO3A, "0.41")}
                      </View>

                      <Text style={{ color: t.info, fontSize: 11, fontWeight: "800", marginBottom: 4, letterSpacing: 0.4 }}>
                        FOOD 2 (optional)
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8, marginBottom: 9 }}>
                        {field("grams/day", calcKcalB, setCalcKcalB, "67")}
                        {field("omega-3 %", calcO3B, setCalcO3B, "4.93")}
                      </View>

                      <Text style={{ color: t.info, fontSize: 11, fontWeight: "800", marginBottom: 4, letterSpacing: 0.4 }}>
                        SUPPLEMENT (optional)
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                        {field("mg EPA+DHA / serving", calcSuppMg, setCalcSuppMg, "1325")}
                        {field("servings/day", calcSuppServ, setCalcSuppServ, "1.5")}
                      </View>

                      <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 10 }}>
                        <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700" }}>
                          How much of the food&apos;s omega-3 is marine? {calcMarineShare}%
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                          Labels give TOTAL omega-3, but only the marine part (EPA/DHA) is usable —
                          plant ALA from flax and chia converts at under 10%. If a food lists
                          flaxseed high and fish oil low, drop this. All-marine, raise it.
                        </Text>
                        <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
                          {[15, 30, 50, 80].map((v) => (
                            <TouchableOpacity
                              key={v}
                              onPress={() => setCalcMarineShare(v)}
                              style={{
                                flex: 1,
                                paddingVertical: 7,
                                borderRadius: 7,
                                alignItems: "center",
                                backgroundColor: calcMarineShare === v ? t.good : t.surfaceAlt,
                                borderWidth: 1,
                                borderColor: calcMarineShare === v ? t.good : t.border,
                              }}
                            >
                              <Text style={{ color: calcMarineShare === v ? t.onAccent : t.textMuted, fontSize: 12, fontWeight: "700" }}>
                                {v}%
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View style={{ backgroundColor: t.goodTint, borderRadius: 10, padding: 13 }}>
                        <Text style={{ color: t.textDim, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6 }}>
                          Estimated daily EPA + DHA
                        </Text>
                        <Text style={{ color: t.good, fontSize: 30, fontWeight: "800", marginTop: 2 }}>
                          {Math.round(total).toLocaleString()} mg
                        </Text>
                        {verdict && (
                          <Text style={{ color: verdict.c, fontSize: 13, fontWeight: "700", marginTop: 2 }}>
                            {verdict.txt}
                          </Text>
                        )}
                        {kg > 0 && (
                          <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: t.border }}>
                            {[
                              ["Maintenance", `${Math.round(maintLo).toLocaleString()}–${Math.round(maintHi).toLocaleString()} mg`],
                              ["Therapeutic", `${Math.round(therLo).toLocaleString()}–${Math.round(therHi).toLocaleString()} mg`],
                              ["NRC ceiling", `${Math.round(therHi).toLocaleString()} mg`],
                            ].map(([k, v], i) => (
                              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                                <Text style={{ color: t.textMuted, fontSize: 11.5 }}>{k}</Text>
                                <Text style={{ color: t.text, fontSize: 11.5, fontWeight: "600" }}>{v}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        <Text style={{ color: t.textMuted, fontSize: 10.5, marginTop: 8, lineHeight: 14 }}>
                          Estimate only — the marine share is a judgement, not a measurement. Ask the
                          manufacturer for EPA/DHA in mg to replace it with a real number.
                        </Text>
                      </View>
                    </View>
                  );
                })()}
              </AccordionSection>

              {/* AAFCO reference table. Transcribed from the source document. */}
              <AccordionSection
                title="📋 AAFCO minimums & maximums"
                  topic="AAFCO"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Using the AAFCO minimums, does this food look adequate, and is anything close to a maximum? Explain which numbers actually matter for my dog.`,
                  )
                }
              >
                <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.info }}>
                  <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                    How to read this
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                    All values are <Text style={{ fontWeight: "700" }}>dry matter</Text>, assuming
                    4,000 kcal/kg. To compare a label, convert first: divide the as-fed percentage by
                    (1 − moisture). A 70%-moisture fresh food at 15.5% protein is 52% on dry matter.
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 5, lineHeight: 17 }}>
                    <Text style={{ fontWeight: "700" }}>A blank maximum doesn&apos;t mean unlimited.</Text>{" "}
                    In AAFCO&apos;s own words it reflects &quot;the lack of information in dogs and cats
                    on toxic concentrations,&quot; and setting one arbitrarily &quot;might prove worse
                    than no maximum at all.&quot;
                  </Text>
                </View>

                {AAFCO_PROFILES.map((g, gi) => (
                  <View key={gi} style={{ marginBottom: 12 }}>
                    <Text style={{ color: t.info, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>
                      {g.group}
                    </Text>
                    <View style={{ flexDirection: "row", paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: t.border }}>
                      <Text style={{ flex: 2.4, color: t.textDim, fontSize: 10, fontWeight: "700" }}>NUTRIENT</Text>
                      <Text style={{ flex: 0.9, color: t.textDim, fontSize: 10, fontWeight: "700" }}>UNIT</Text>
                      <Text style={{ flex: 1, color: t.textDim, fontSize: 10, fontWeight: "700", textAlign: "right" }}>PUPPY</Text>
                      <Text style={{ flex: 1, color: t.textDim, fontSize: 10, fontWeight: "700", textAlign: "right" }}>ADULT</Text>
                      <Text style={{ flex: 1.1, color: t.textDim, fontSize: 10, fontWeight: "700", textAlign: "right" }}>MAX</Text>
                    </View>
                    {g.rows.map((r, ri) => (
                      <View key={ri}>
                        <View style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: t.borderBright }}>
                          <Text style={{ flex: 2.4, color: t.text, fontSize: 11.5 }}>{r.nutrient}</Text>
                          <Text style={{ flex: 0.9, color: t.textDim, fontSize: 11 }}>{r.unit}</Text>
                          <Text style={{ flex: 1, color: t.textMuted, fontSize: 11.5, textAlign: "right" }}>{r.growth}</Text>
                          <Text style={{ flex: 1, color: t.textStrong, fontSize: 11.5, textAlign: "right", fontWeight: "700" }}>{r.adult}</Text>
                          <Text style={{ flex: 1.1, color: r.max === "—" ? t.textDim : t.moderateDeep, fontSize: 11.5, textAlign: "right", fontWeight: r.max === "—" ? "400" : "700" }}>{r.max}</Text>
                        </View>
                        {r.note && (
                          <Text style={{ color: t.textMuted, fontSize: 11, lineHeight: 15, paddingVertical: 4, paddingLeft: 6, fontStyle: "italic" }}>
                            {r.note}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}

                <Text style={{ color: t.textMuted, fontSize: 11, lineHeight: 15, marginTop: 4 }}>
                  Source: AAFCO Dog Food Nutrient Profiles, dry matter basis. Reference data only —
                  AAFCO&apos;s Official Publication is authoritative, and this app is not affiliated
                  with or endorsed by AAFCO.
                </Text>
              </AccordionSection>

              {/* Deficiency signs. Framed as "how to recognise", not "what to fear" —
                  on complete food these are rare, and the section says so first. */}
              <AccordionSection
                title="🔍 Deficiency signs"
                  topic="Deficiency signs"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Given this food and my dog, is he at risk of any nutrient deficiency? Be honest — is this actually likely or am I worrying about something rare?`,
                  )
                }
              >
                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 10 }}>
                  <Text style={{ color: t.good, fontWeight: "700", fontSize: 12.5 }}>
                    Read this first: these are rare on complete food
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>
                    A food carrying an AAFCO complete-and-balanced statement is formulated to prevent
                    all of these. Most real cases come from unbalanced home-prepared diets, a gut
                    that can&apos;t absorb, or a specific breed defect — not from ordinary commercial
                    food. This is here so you can recognise a genuine problem, not diagnose one that
                    isn&apos;t there.
                  </Text>
                </View>

                {DEFICIENCY_SIGNS.map((d, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: t.surface,
                      borderRadius: 9,
                      padding: 11,
                      marginBottom: 6,
                      borderLeftWidth: 3,
                      borderLeftColor: d.urgency === "urgent" ? t.critical : t.moderate,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700" }}>{d.nutrient}</Text>
                      {d.urgency === "urgent" && (
                        <Text style={{ color: t.critical, fontSize: 10, fontWeight: "800", letterSpacing: 0.4 }}>
                          SEE A VET
                        </Text>
                      )}
                    </View>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                      <Text style={{ fontWeight: "700" }}>Looks like: </Text>{d.visible}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>Usually because: </Text>{d.cause}
                    </Text>
                  </View>
                ))}

                <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                  ⚠️ Educational only. Every one of these is diagnosed on bloodwork and examination,
                  never from a label — and several look like other conditions entirely. If something
                  here matches your dog, that&apos;s a reason to book an appointment, not to start
                  supplementing.
                </Text>
              </AccordionSection>

              {/* Medicinal mushrooms. Heavily marketed, thinly evidenced in dogs —
                  so the section leads with how much is actually known. */}
              <AccordionSection
                title="🍄 Medicinal mushrooms"
                  topic="Mushrooms"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Would any medicinal mushroom actually help my dog, and which one? Be honest about how strong the evidence is for a dog rather than a human.`,
                  )
                }
              >
                {/* The framing Kyle asked for: mushrooms as a Swiss Army knife,
                    and the two compound families that decide how a product has to
                    be extracted. Replaced the old evidence-tier preamble 2026-08-22. */}
                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.good }}>
                  <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                    The Swiss Army knife of supplements
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                    Functional mushrooms give targeted support to the immune system, the
                    organs, and the ageing brain. Two compound families do the work —
                    <Text style={{ fontWeight: "700" }}> beta-glucans</Text>, the polysaccharides
                    that activate and balance immunity, and
                    <Text style={{ fontWeight: "700" }}> terpenes</Text>, which cross the
                    blood-brain barrier and act on the nervous system. That split is why
                    extraction method matters as much as species.
                  </Text>
                </View>

                {MEDICINAL_MUSHROOMS.map((m, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: t.surface,
                      borderRadius: 9,
                      padding: 11,
                      marginBottom: 6,
                      borderLeftWidth: 3,
                      borderLeftColor: t.good,
                    }}
                  >
                    <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "800" }}>{m.name}</Text>
                    <Text style={{ color: t.textDim, fontSize: 11, fontStyle: "italic" }}>{m.latin}</Text>
                    <Text style={{ color: t.good, fontSize: 12, fontWeight: "700", marginTop: 3 }}>{m.headline}</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>Actives: </Text>{m.actives}
                    </Text>
                    <Text style={{ color: t.text, fontSize: 11.5, marginTop: 4, lineHeight: 17 }}>{m.body}</Text>
                    <Text style={{ color: t.text, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>Use for: </Text>{m.useFor}
                    </Text>
                  </View>
                ))}

                {/* ── HOW THEY FIGHT DISEASE ── */}
                <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginTop: 10, borderWidth: 1, borderColor: t.border }}>
                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginBottom: 2 }}>
                    How they help fight disease
                  </Text>
                  {MUSHROOM_DISEASE.map((d, i) => (
                    <View key={i} style={{ marginTop: 7 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "800" }}>{d.area}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, marginTop: 2, lineHeight: 17 }}>{d.detail}</Text>
                    </View>
                  ))}
                </View>

                {/* ── WHEN A DOG NEEDS THEM ── */}
                <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginTop: 8, borderWidth: 1, borderColor: t.border }}>
                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginBottom: 2 }}>
                    When dogs need them most
                  </Text>
                  {MUSHROOM_WHEN.map((w, i) => (
                    <View key={i} style={{ marginTop: 7 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "800" }}>{w.stage}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, marginTop: 2, lineHeight: 17 }}>{w.why}</Text>
                    </View>
                  ))}
                </View>

                {/* ── HOW MUCH ── */}
                <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginTop: 10, marginBottom: 6 }}>
                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                    How much to give
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 17 }}>
                    Unlike drugs that work immediately, mushrooms give the best results used
                    in small amounts regularly — for weeks, months, or a lifetime.
                    Consistency is the whole game.
                  </Text>
                  {MUSHROOM_DOSING.map((d, i) => (
                    <View
                      key={i}
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: t.border,
                      }}
                    >
                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>
                        {d.level}
                      </Text>
                      <Text style={{ color: t.good, fontSize: 12.5, fontWeight: "800", marginTop: 2 }}>
                        {d.amount}
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                        {d.note}
                      </Text>
                    </View>
                  ))}
                  <Text style={{ color: t.text, fontSize: 12, marginTop: 9, lineHeight: 17, fontWeight: "600" }}>
                    Start low and go slow. Mushrooms are fibrous, and the usual first sign
                    you moved too fast is soft stool — not a reaction to the mushroom, just
                    too much fibre too quickly.
                  </Text>
                </View>

                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginTop: 4 }}>
                  <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                    Buying: this matters more than which species
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                    <Text style={{ fontWeight: "700" }}>Fruiting body, not &quot;mycelium on grain&quot;.</Text>{" "}
                    Most cheap supplements are mycelium grown on rice or oats and sold with the grain
                    still in it — so a large share of what you buy is starch, not mushroom. If the
                    label says &quot;myceliated grain&quot; or lists rice, that&apos;s what you&apos;re paying for.
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                    <Text style={{ fontWeight: "700" }}>Look for a beta-glucan percentage.</Text> That&apos;s
                    the active fraction and the only honest measure of potency. Products quoting
                    &quot;polysaccharides&quot; instead are usually hiding starch in the number —
                    starch is a polysaccharide too.
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                    <Text style={{ fontWeight: "700" }}>Dual extraction for reishi and chaga.</Text> Beta-glucans
                    need hot water; triterpenes need alcohol. A single extraction gets you half the
                    mushroom. Less critical for turkey tail and lion&apos;s mane, where the beta-glucans
                    do most of the work.
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                    ⚠️ Educational only. Mushrooms modulate the immune system, which means they need a
                    conversation with your vet for any dog on immunosuppressants, with an autoimmune
                    condition, or undergoing cancer treatment — and chaga should be avoided in dogs
                    with kidney disease or oxalate stones.
                  </Text>
                </View>

                {/* ── THE TWO REFERENCE CARDS ── Kyle's mushroom infographics.
                    Placed at the END on purpose: they're a summary to save or
                    screenshot, and the graded detail above is what should be read
                    first. `resizeMode="contain"` with an aspect ratio keeps them
                    readable on any width without cropping the text inside. */}
                <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 14 }}>
                  Save these
                </Text>
                <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, marginBottom: 8, lineHeight: 16 }}>
                  Two quick-reference cards covering the same ground. The graded
                  detail above is the honest version — these are the summary.
                </Text>
                <Image
                  source={require("../assets/images/mushrooms-pharmacy.jpg")}
                  style={{
                    width: "100%",
                    aspectRatio: 893 / 1600,
                    borderRadius: 9,
                    marginBottom: 8,
                  }}
                  resizeMode="contain"
                  accessibilityLabel="The Mushroom Pharmacy for Dogs — turkey tail, lion's mane, reishi, cordyceps, and why to use fruiting bodies rather than raw mushrooms"
                />
                <Image
                  source={require("../assets/images/mushrooms-guide.jpg")}
                  style={{
                    width: "100%",
                    aspectRatio: 893 / 1600,
                    borderRadius: 9,
                  }}
                  resizeMode="contain"
                  accessibilityLabel="Guide to Medicinal Mushrooms — turkey tail for cancer support, lion's mane for brain and nerve, reishi for allergies, cordyceps for kidney and lung, chaga as antioxidant"
                />
              </AccordionSection>

              {/* Collagen. Its own section because the type II distinction is genuinely
                  counterintuitive and owners routinely buy the wrong thing. */}
              <AccordionSection
                title="🦴 Collagen — the three types"
                  topic="Collagen"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `Would collagen help my dog, and if so which type and form? He's mid-life and I'm thinking about joints and coat.`,
                  )
                }
              >
                <Text style={[styles.sectionNote, { marginBottom: 10 }]}>
                  &quot;Collagen&quot; isn&apos;t one supplement. Buying the wrong type is how owners
                  end up giving a skin-and-coat powder for a joint problem.
                </Text>

                {COLLAGEN_TYPES.map((c, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: t.surface,
                      borderRadius: 9,
                      padding: 11,
                      marginBottom: 6,
                      borderLeftWidth: 3,
                      borderLeftColor: i === 1 ? t.good : t.info,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "800" }}>{c.type}</Text>
                      <Text style={{ color: t.textDim, fontSize: 10.5 }}>{c.share}</Text>
                    </View>
                    <Text style={{ color: t.text, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                      <Text style={{ fontWeight: "700" }}>Builds: </Text>{c.jobs}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>From: </Text>{c.sources}
                    </Text>
                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>Dose: </Text>{c.dose}
                    </Text>
                    <Text style={{ color: t.good, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                      <Text style={{ fontWeight: "700" }}>Best for: </Text>{c.best}
                    </Text>
                  </View>
                ))}

                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginTop: 4 }}>
                  <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                    The distinction that actually matters
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 5, lineHeight: 18 }}>
                    Type II comes in two forms that work by completely different mechanisms:
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                    <Text style={{ fontWeight: "700" }}>Hydrolyzed (peptides)</Text> — broken into
                    fragments the body reassembles. A raw material. Effective around{" "}
                    <Text style={{ fontWeight: "700" }}>100–500 mg per kg daily</Text>, which means
                    grams, and a tub that empties fast.
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                    <Text style={{ fontWeight: "700" }}>Undenatured (UC-II)</Text> — deliberately left
                    intact, and it isn&apos;t a building block at all. It works by{" "}
                    <Text style={{ fontWeight: "700" }}>oral tolerance</Text>: the immune system
                    encounters intact type II collagen in the gut and stops attacking the dog&apos;s
                    own joint cartilage. Effective at{" "}
                    <Text style={{ fontWeight: "700" }}>0.01–30 mg per kg</Text> — around 40 mg total
                    for an average dog.
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                    That&apos;s a hundredfold difference in dose, and it only makes sense once you
                    know they aren&apos;t doing the same job. 🟢 UC-II has been tested head-to-head
                    against NSAIDs in dogs with naturally occurring osteoarthritis (versus cimicoxib
                    and robenacoxib) — an unusually strong evidence base for a supplement. No adverse
                    effects reported in dogs, humans or horses.
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                    <Text style={{ fontWeight: "700" }}>Practical read:</Text> joints → UC-II, and check
                    the label says &quot;undenatured&quot;, because a tiny milligram figure on a
                    hydrolyzed product means an underdose. Skin, coat and connective tissue → Types I
                    and III, in grams. Whole-food routes to both: chicken feet, trachea and bone broth.
                  </Text>
                </View>
              </AccordionSection>

              {/* Life stages. Exists because "adult maintenance" confuses everyone, and
                  the reason it's confusing is that the category system is incomplete. */}
              <AccordionSection
                title="🎂 Puppy, adult, senior"
                  topic="Life stages"
                  door="learn"
                askLabel="Ask AI"
                onAskAI={() =>
                  askAboutSection(
                    `What life stage is this food for, and is it right for my dog's age? Explain what actually changes nutritionally between puppy, adult and senior foods.`,
                  )
                }
              >
                <View style={{ backgroundColor: t.highTint, borderRadius: 9, padding: 11, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: t.high }}>
                  <Text style={{ color: t.highDeep, fontWeight: "800", fontSize: 13 }}>
                    There is no such thing as &quot;senior&quot; food, legally
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                    AAFCO recognises exactly <Text style={{ fontWeight: "700" }}>two</Text> life
                    stages: <Text style={{ fontWeight: "700" }}>Growth &amp; Reproduction</Text>{" "}
                    (puppies, pregnancy, nursing) and{" "}
                    <Text style={{ fontWeight: "700" }}>Adult Maintenance</Text>. Neither AAFCO nor
                    the NRC defines a senior profile. So a bag labelled &quot;senior&quot; is
                    meeting the ordinary adult standard — the word is marketing, not a
                    specification, and the manufacturer can put whatever they like behind it.
                  </Text>
                </View>

                {[
                  { t: "🍼 Puppy / Growth & Reproduction", c: t.good,
                    b: "The stricter of the two profiles — higher protein, fat, calcium, phosphorus and DHA for brain development. Large-breed puppy formulas additionally CAP calcium, because too much accelerates bone growth and causes joint disease. That cap is the one genuine reason a large-breed puppy food exists." },
                  { t: "🐕 Adult Maintenance", c: t.info,
                    b: "The baseline every non-puppy food meets. Lower minimums than growth across the board. This is what \"complete and balanced for adult maintenance\" on a label means — it clears the floor, nothing more." },
                  { t: "♾️ All Life Stages", c: t.good,
                    b: "Meets the STRICTER growth profile, so it's suitable for any age. Often a better food than an adult-maintenance one, with one caveat: it carries more calories and minerals than a sedentary adult needs, so portion accordingly." },
                  { t: "👴 Senior", c: t.high,
                    b: "Not a regulated category. In practice these are usually adult-maintenance foods with fewer calories, added joint supplements — and often LESS PROTEIN, which is the part worth questioning." },
                ].map((x, i) => (
                  <View key={i} style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: x.c }}>
                    <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700" }}>{x.t}</Text>
                    <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 }}>{x.b}</Text>
                  </View>
                ))}

                <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginTop: 4 }}>
                  <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                    The senior protein myth — reversed
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 4, lineHeight: 18 }}>
                    Older dogs were long fed less protein &quot;to protect the kidneys.&quot; That
                    advice traces to old rat studies that never translated to dogs, and the
                    veterinary position has since reversed. Senior dogs need{" "}
                    <Text style={{ fontWeight: "700" }}>more</Text> protein, not less — roughly
                    28–30% on a dry matter basis, because ageing bodies synthesise protein less
                    efficiently and lose muscle to sarcopenia.
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>
                    Restricting protein in a dog with healthy kidneys doesn&apos;t protect
                    anything — it accelerates muscle loss. Protein restriction is for dogs with{" "}
                    <Text style={{ fontWeight: "700" }}>diagnosed</Text> kidney disease, and even
                    then phosphorus control matters more.
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 6, lineHeight: 16 }}>
                    Practical upshot: a &quot;senior&quot; food that lowers protein may be doing the
                    opposite of what an old dog needs. Check the protein figure rather than the word
                    on the front. What genuinely helps an ageing dog is fewer calories (metabolism
                    slows), more protein, and joint and cognitive support — not less of everything.
                  </Text>
                </View>
              </AccordionSection>

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
                  door="whats-in-it"
                    
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
                  door="whats-in-it"
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
                // Liver is the densest natural copper source, so a liver-containing
                // food is relevant to a copper-sensitive breed even when no copper
                // ingredient is listed. Without this, whole-food formulas — exactly
                // the ones built on liver — never triggered the warning.
                const liver = ingredients.filter((i) => /\bliver\b/i.test(i));
                if (copper.length === 0 && liver.length === 0) return null;
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
                      that can&apos;t clear copper normally.
                      {copper.length > 0 ? (
                        <>
                          {" "}This food contains{" "}
                          <Text style={{ fontWeight: "700" }}>{copper.join(", ")}</Text>.
                          {inorganic
                            ? " That's the inorganic form, which bypasses the liver's regulation and accumulates over years of daily feeding until damage is already advanced. Copper proteinate is the safer form to look for."
                            : " That looks like a chelated form, which the body regulates far better than copper sulfate — the preferable choice for this breed."}
                        </>
                      ) : (
                        <>
                          {" "}No copper supplement is listed, but this food contains{" "}
                          <Text style={{ fontWeight: "700" }}>{liver.join(", ")}</Text> — and liver
                          is the densest natural source of copper there is. That isn&apos;t a
                          criticism: liver is how whole-food formulas meet the requirement without
                          a synthetic premix. It just means copper is present, and for this breed
                          that&apos;s worth knowing.
                        </>
                      )}
                    </Text>

                    {/* The regulatory gap. Copper is the one nutrient where "complete
                        and balanced" bounds the bottom and says nothing about the top. */}
                    <View style={{ backgroundColor: t.surface, borderRadius: 10, padding: 11, marginTop: 9 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 12.5, marginBottom: 2 }}>
                        Why copper gets its own warning
                      </Text>
                      {COPPER_CEILING_GAP.map((c, i) => (
                        <View key={i} style={{ marginTop: 7 }}>
                          <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700", marginBottom: 2 }}>
                            {c.h}
                          </Text>
                          <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5 }}>{c.b}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 8, fontStyle: "italic" }}>
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
                  door="whats-in-it"
                    
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

                    {/* The omega-3 family. "Omega-3" on a label is five different
                        molecules doing different jobs, and the label rarely says which. */}
                    <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5 }}>
                        Not all omega-3 is the same molecule
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                        &quot;Omega-3&quot; covers at least six different fatty acids. They do
                        different jobs, and a label that only gives you a total is hiding which ones
                        you&apos;re actually buying.
                      </Text>

                      {OMEGA3_TYPES.map((o, i) => (
                        <View
                          key={i}
                          style={{
                            marginTop: 8,
                            paddingLeft: 9,
                            borderLeftWidth: 3,
                            borderLeftColor:
                              o.verdict === "best" ? t.good : o.verdict === "good" ? t.goodDeep : t.high,
                          }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "800" }}>{o.code}</Text>
                            <Text style={{ color: t.textDim, fontSize: 10.5 }}>{o.chain}</Text>
                            <Text
                              style={{
                                color: o.verdict === "weak" ? t.high : t.good,
                                fontSize: 10.5,
                                fontWeight: "700",
                                marginLeft: "auto",
                              }}
                            >
                              {o.job}
                            </Text>
                          </View>
                          <Text style={{ color: t.textDim, fontSize: 11, marginTop: 1 }}>
                            {o.name} · {o.sources}
                          </Text>
                          <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                            {o.note}
                          </Text>
                        </View>
                      ))}

                      <View style={{ backgroundColor: t.goodTint, borderRadius: 8, padding: 10, marginTop: 10 }}>
                        <Text style={{ color: t.good, fontSize: 12, fontWeight: "700" }}>
                          Match the EPA:DHA ratio to why you&apos;re buying
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                          <Text style={{ fontWeight: "700" }}>More EPA</Text> for inflammation — joints,
                          itchy skin, allergies, lipomas, kidney disease.{" "}
                          <Text style={{ fontWeight: "700" }}>More DHA</Text> for brains and eyes —
                          puppies, and seniors showing cognitive change. Most fish oils are
                          EPA-dominant, which suits the majority of adult dogs. Algal oils tend to be
                          DHA-dominant. Almost nobody tells owners this, and it&apos;s the difference
                          between buying the right supplement and the popular one.
                        </Text>
                      </View>
                    </View>

                    {/* Dosing. The ratio tells you the balance; this tells you the amount,
                        which is the number owners actually need and almost never see. */}
                    <View style={{ backgroundColor: t.surface, borderRadius: 9, padding: 11, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.info }}>
                      <Text style={{ color: t.textStrong, fontWeight: "700", fontSize: 12.5 }}>
                        How much EPA/DHA does a dog actually need?
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                        Dosing scales to metabolic body weight (kg^0.75), not straight bodyweight —
                        which is why a big dog needs proportionally less than the simple maths
                        suggests.
                      </Text>
                      <View style={{ marginTop: 7 }}>
                        {[
                          ["Coat & general health", "20–55 mg/kg bodyweight"],
                          ["Anti-inflammatory (joints, skin, lipomas)", "230–370 mg/kg^0.75"],
                          ["NRC safe upper limit", "370 mg/kg^0.75 · 2,800 mg per 1,000 kcal"],
                        ].map(([k, v], i) => (
                          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                            <Text style={{ color: t.text, fontSize: 11.5, flex: 1 }}>{k}</Text>
                            <Text style={{ color: t.good, fontSize: 11.5, fontWeight: "700" }}>{v}</Text>
                          </View>
                        ))}
                      </View>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 7, lineHeight: 16 }}>
                        For a 75 lb (34 kg) dog that&apos;s roughly{" "}
                        <Text style={{ fontWeight: "700" }}>3,200–5,200 mg EPA+DHA daily</Text> at
                        therapeutic levels. Read labels for &quot;EPA + DHA per serving&quot;, not
                        &quot;fish oil 1000 mg&quot; — a 1000 mg capsule is often only ~300 mg of the
                        active part.
                      </Text>
                    </View>

                    {/* The three things nobody tells you when they tell you to add fish oil. */}
                    <View style={{ backgroundColor: t.moderateTint, borderRadius: 9, padding: 11, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                      <Text style={{ color: t.moderateDeep, fontWeight: "700", fontSize: 12.5 }}>
                        Before you add fish oil — three things
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, marginTop: 5, lineHeight: 17 }}>
                        <Text style={{ fontWeight: "700" }}>1. Vitamin E protects it.</Text>{" "}
                        Polyunsaturated fats oxidise easily, and vitamin E is what protects them.
                        The rule gets quoted as &quot;10 IU per gram of fish oil&quot;, which is
                        wrong. AAFCO&apos;s actual footnote is{" "}
                        <Text style={{ fontWeight: "700" }}>0.6 IU of vitamin E per gram of
                        PUFA, and only above 83 g of PUFA per 1,000 kcal</Text> — a threshold a
                        supplemented dog almost never reaches. So the added requirement is far
                        smaller than commonly claimed. Buy an oil preserved with mixed tocopherols
                        anyway: that protects the oil from going rancid in the bottle, which is the
                        real risk.
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                        <Text style={{ fontWeight: "700" }}>2. It lengthens bleeding time.</Text>{" "}
                        High-dose omega-3 alters platelet function and reduces vitamin K-dependent
                        clotting factors. Not a day-to-day risk, but{" "}
                        <Text style={{ fontWeight: "700" }}>tell your vet before any surgery or
                        dental</Text>, and take care alongside NSAIDs or aspirin.
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                        <Text style={{ fontWeight: "700" }}>3. Go slowly.</Text> Start at a quarter
                        dose and build over 2–4 weeks. Loose stools are the practical limit and show
                        up long before anything concerning. Omega-3 takes 6–8 weeks to fully
                        incorporate into cell membranes, so judge nothing before then.
                      </Text>
                    </View>

                    {/* The trial evidence. Fish oil gets recommended on vibes constantly;
                        these are the two randomised canine trials that actually tested it,
                        including the one that tested flax head-to-head and found it failed. */}
                    <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                        🔬 What the trials actually show
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                        Fish oil gets recommended on reputation. These are randomised trials in real
                        dogs — including the heart evidence, which most owners never hear about.
                      </Text>

                      {[
                        {
                          h: "Reduced arrhythmias in Boxers with heart disease",
                          b: "24 Boxers with arrhythmogenic right ventricular cardiomyopathy, each having more than 95 abnormal beats a day, were randomised to fish oil, flax oil, or sunflower oil for 6 weeks. Fish oil reduced the arrhythmias. Flax oil did not — which is the cleanest demonstration anywhere that plant ALA cannot stand in for marine EPA and DHA.",
                          s: "Smith, Freeman & Rush · J Vet Intern Med 2007;21:265–273",
                        },
                        {
                          h: "Slowed mitral valve disease over a full year",
                          b: "29 dogs with mitral valve disease, double-blinded and randomised, given roughly 54 mg/kg EPA and 41 mg/kg DHA daily for 12 months. The supplemented dogs were 2.96x less likely to develop arrhythmias, showed smaller heart-size measurements, and had falling IL-6 and TNF-alpha while the control group's rose. 40% of controls progressed to the next disease stage; 40% of the supplemented group didn't progress at all.",
                          s: "Nasciutti et al. · PLOS ONE 2021",
                        },
                        {
                          h: "The honest limit",
                          b: "Both trials studied dogs who ALREADY had heart disease. No one has shown fish oil prevents heart disease in a healthy dog. It's plausible and low-risk, but it isn't proven — and a supplement that helps a sick heart is not automatically a shield for a well one.",
                          s: "Stated because the gap is real, not because the evidence is weak",
                        },
                      ].map((e, i) => (
                        <View
                          key={i}
                          style={{
                            marginTop: 9,
                            paddingTop: 9,
                            borderTopWidth: 1,
                            borderTopColor: t.border,
                          }}
                        >
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                            {e.h}
                          </Text>
                          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{e.b}</Text>
                          <Text style={{ color: t.textDim, fontSize: 10.5, marginTop: 5, fontStyle: "italic" }}>
                            {e.s}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* The label trap. Sits ABOVE the fish table deliberately — an owner
                        should learn that advertised ratios are floors before they start
                        comparing any numbers at all, including the ones in this app. */}
                    <View style={{ backgroundColor: t.moderateTint, borderRadius: 9, padding: 11, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                      <Text style={{ color: t.moderateDeep, fontWeight: "800", fontSize: 13 }}>
                        ⚠️ Why the ratio on the bag may not be real
                      </Text>
                      <Text style={{ color: t.text, fontSize: 12, marginTop: 4, lineHeight: 17.5 }}>
                        Read this before you compare two foods on omega ratio — including with
                        this app. The number is usually built from figures that aren&apos;t
                        measurements.
                      </Text>

                      {GA_MINIMUM_TRAP.map((g, i) => (
                        <View
                          key={i}
                          style={{
                            marginTop: 9,
                            paddingTop: 9,
                            borderTopWidth: 1,
                            borderTopColor: t.border,
                          }}
                        >
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                            {g.h}
                          </Text>
                          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{g.b}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Which fish, by the numbers. "Feed fish" is useless advice when the
                        spread between best and worst is fifteen-fold. */}
                    <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                        🐟 How much omega-3 is actually in each fish
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                        EPA+DHA per 100 g. The best choice carries roughly{" "}
                        <Text style={{ fontWeight: "700" }}>fifteen times</Text> what the worst does —
                        and the richest fish are also the lowest in mercury, so there&apos;s no
                        trade-off to manage.
                      </Text>

                      {FISH_EPA_DHA.map((f, i) => {
                        const vTone =
                          f.verdict === "best" ? t.good : f.verdict === "good" ? t.moderateDeep : t.textDim;
                        const mTone =
                          f.mercury === "low" ? t.good : f.mercury === "moderate" ? t.moderateDeep : t.critical;
                        return (
                          <View
                            key={i}
                            style={{
                              marginTop: 9,
                              paddingTop: 9,
                              borderTopWidth: 1,
                              borderTopColor: t.border,
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                              <Text style={{ color: vTone, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                                {f.fish}
                              </Text>
                              <Text style={{ color: vTone, fontSize: 12.5, fontWeight: "800", marginRight: 8 }}>
                                {f.mg} mg
                              </Text>
                              <View style={{ backgroundColor: t.surface, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 }}>
                                <Text style={{ color: mTone, fontSize: 10, fontWeight: "700" }}>
                                  Hg {f.mercury}
                                </Text>
                              </View>
                            </View>
                            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{f.note}</Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* The reference sheet. Ordered by food chain because that single
                        variable predicts mercury, omega-3 AND thiaminase — in opposite
                        directions, which is why neither end of the chain is simply "good". */}
                    <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                        🐠 Every fish, bottom of the food chain to top
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                        Where a fish sits predicts almost everything about it — and the trade-off
                        runs both ways. <Text style={{ fontWeight: "700" }}>Bottom of the chain:
                        least mercury, most omega-3, most likely to carry thiaminase.</Text>{" "}
                        <Text style={{ fontWeight: "700" }}>Top: no thiaminase, dangerous
                        mercury.</Text> Neither end is simply safe — they fail in opposite
                        directions, and cooking solves only one of the two.
                      </Text>

                      {FISH_CHAIN.map((f, i) => {
                        const vTone =
                          f.verdict === "best" ? t.good
                          : f.verdict === "good" ? t.info
                          : f.verdict === "occasional" ? t.moderateDeep
                          : t.critical;
                        const mTone =
                          f.mercury === "very low" || f.mercury === "low" ? t.good
                          : f.mercury === "moderate" ? t.moderateDeep
                          : t.critical;
                        const tTone =
                          f.thiaminase === "yes" ? t.critical
                          : f.thiaminase === "likely" ? t.moderateDeep
                          : t.textDim;
                        return (
                          <View
                            key={i}
                            style={{ marginTop: 9, paddingTop: 9, borderTopWidth: 1, borderTopColor: t.border }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                              <Text style={{ color: vTone, fontSize: 12.5, fontWeight: "800", flex: 1 }}>
                                {f.fish}
                              </Text>
                              <Text style={{ color: t.textDim, fontSize: 10, fontWeight: "600" }}>
                                {f.level}
                              </Text>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 5 }}>
                              <View style={{ backgroundColor: t.surface, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginRight: 5, marginTop: 3 }}>
                                <Text style={{ color: t.good, fontSize: 10, fontWeight: "700" }}>
                                  ω3 {f.omega3}
                                </Text>
                              </View>
                              <View style={{ backgroundColor: t.surface, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginRight: 5, marginTop: 3 }}>
                                <Text style={{ color: mTone, fontSize: 10, fontWeight: "700" }}>
                                  Hg {f.mercury}
                                </Text>
                              </View>
                              <View style={{ backgroundColor: t.surface, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 3 }}>
                                <Text style={{ color: tTone, fontSize: 10, fontWeight: "700" }}>
                                  thiaminase {f.thiaminase}
                                </Text>
                              </View>
                            </View>
                            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{f.note}</Text>
                          </View>
                        );
                      })}

                      <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginTop: 10, borderLeftWidth: 3, borderLeftColor: t.good }}>
                        <Text style={{ color: t.goodDeep, fontWeight: "800", fontSize: 12.5, marginBottom: 4 }}>
                          The one-line version
                        </Text>
                        <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18 }}>
                          <Text style={{ fontWeight: "700" }}>Feed small fish, and cook or can
                          them.</Text> That gets you the highest omega-3, the lowest mercury, and
                          removes the thiaminase question in one move. Sardines, anchovies, herring
                          and Atlantic mackerel are all the same answer. Everything above them on
                          this list is a compromise in one direction or another.
                        </Text>
                      </View>
                    </View>

                    {/* Sardines: fresh vs canned. Counterintuitive result, so it gets its
                        own block rather than a footnote — canned genuinely wins for a dog. */}
                    <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                        🥫 Fresh or frozen sardines vs canned
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                        Fresh usually beats canned. For a dog it doesn&apos;t — and this is one of
                        the few places where the processed version is genuinely the better food.
                      </Text>

                      {SARDINE_FORM.map((s, i) => {
                        const tone =
                          s.verdict === "canned"
                            ? { fg: t.good, tag: "CANNED WINS" }
                            : s.verdict === "fresh"
                            ? { fg: t.moderateDeep, tag: "IF FEEDING RAW" }
                            : { fg: t.textDim, tag: "EITHER" };
                        return (
                          <View
                            key={i}
                            style={{ marginTop: 9, paddingTop: 9, borderTopWidth: 1, borderTopColor: t.border }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                              <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                                {s.h}
                              </Text>
                              <Text style={{ color: tone.fg, fontSize: 9, fontWeight: "800", letterSpacing: 0.3 }}>
                                {tone.tag}
                              </Text>
                            </View>
                            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{s.b}</Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Whole food vs extracted oil — the question owners actually ask. */}
                    <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.good }}>
                      <Text style={{ color: t.goodDeep, fontWeight: "800", fontSize: 13 }}>
                        Sardines or fish oil — which one?
                      </Text>
                      {SARDINE_VS_OIL.map((s, i) => (
                        <View key={i} style={{ marginTop: 8 }}>
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 2 }}>
                            {s.h}
                          </Text>
                          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{s.b}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Green lipped mussel — the one joint supplement with real randomised
                        canine trials, and the one whose extract/powder distinction is
                        almost always left out of the marketing. */}
                    <View style={{ backgroundColor: t.accents.mussel.bg, borderRadius: 9, padding: 11, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: t.accents.mussel.fg }}>
                      <Text style={{ color: t.accents.mussel.fg, fontWeight: "800", fontSize: 13 }}>
                        🌊 Green lipped mussel — for joints specifically
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4, lineHeight: 16 }}>
                        If the goal is joints rather than general inflammation, this is the one
                        supplement with randomised canine trials behind it — and it does something
                        fish oil doesn&apos;t.
                      </Text>

                      {GLM_EVIDENCE.map((e, i) => (
                        <View
                          key={i}
                          style={{
                            marginTop: 9,
                            paddingTop: 9,
                            borderTopWidth: 1,
                            borderTopColor: t.border,
                          }}
                        >
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginBottom: 3 }}>
                            {e.h}
                          </Text>
                          <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{e.b}</Text>
                          <Text style={{ color: t.textDim, fontSize: 10.5, marginTop: 5, fontStyle: "italic" }}>
                            {e.s}
                          </Text>
                        </View>
                      ))}

                      <Text style={{ color: t.text, fontSize: 12, marginTop: 10, lineHeight: 17.5, fontWeight: "600" }}>
                        Stack it with fish oil rather than choosing between them — different
                        pathways, additive effect.
                      </Text>
                    </View>

                    {/* Buying guide. The fish oil aisle is the single easiest place for an
                        owner to waste money or actively make things worse. */}
                    <View style={{ backgroundColor: t.goodTint, borderRadius: 9, padding: 11, marginBottom: 8 }}>
                      <Text style={{ color: t.good, fontWeight: "800", fontSize: 13 }}>
                        🛒 How to buy fish oil without wasting money
                      </Text>

                      {[
                        {
                          h: "1. Read EPA + DHA, not \"fish oil 1000 mg\"",
                          b: "A 1000 mg capsule is often only ~300 mg of the part that works. If a label won't tell you EPA and DHA separately, that's usually because the numbers are unflattering. Compare products on cost per gram of EPA+DHA — price ÷ (servings × mg per serving). It reorders the shelf.",
                        },
                        {
                          h: "2. It must contain mixed tocopherols",
                          b: "Fish oil is the most unstable fat there is, and RANCID FISH OIL IS PRO-INFLAMMATORY — it does the opposite of what you bought it for. Mixed tocopherols (natural vitamin E) are what stop it oxidising. No antioxidant listed means you're gambling on how it was stored before it reached you.",
                        },
                        {
                          h: "3. Smell it, and keep smelling it",
                          b: "Good fish oil smells mild and oceanic. Sharp, bitter, paint-like or aggressively fishy means it's turned — throw it out rather than finish the bottle. Buy a size you'll use within 2–3 months, keep it dark, and refrigerate after opening.",
                        },
                        {
                          h: "4. Body oil, not liver oil",
                          b: "Salmon, sardine, anchovy and krill oils are body oils — EPA/DHA with no meaningful vitamin A or D. COD LIVER oil is concentrated in both, which accumulate. If a food already contains cod liver oil, adding more from a bottle stacks them. Plain fish oil avoids the issue entirely.",
                        },
                        {
                          h: "5. Watch what else is in it",
                          b: "Blends with plant oils (hemp, flax) count toward the headline omega-3 number while contributing ALA, which dogs convert at under 10% — and hemp seed oil is majority omega-6. Not wrong, but it means fewer usable milligrams per ml than a straight marine oil.",
                        },
                        {
                          h: "6. Liquid beats capsules for big dogs",
                          b: "At therapeutic doses a large dog would need 8–11 standard capsules daily. A concentrated liquid does it in a pump or two, and lets you titrate precisely as you build up.",
                        },
                      ].map((x, i) => (
                        <View key={i} style={{ marginTop: 8 }}>
                          <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700" }}>{x.h}</Text>
                          <Text style={{ color: t.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 }}>{x.b}</Text>
                        </View>
                      ))}

                      <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 10, lineHeight: 16, fontStyle: "italic" }}>
                        The two that matter most: EPA+DHA on the label, and a natural antioxidant in
                        the bottle. Get those right and the rest is preference.
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
                      <View style={{ backgroundColor: t.surface, borderRadius: 8, padding: 10, marginTop: 9 }}>
                        <Text style={{ color: t.textStrong, fontSize: 12, fontWeight: "700" }}>
                          One omega-6 worth knowing by name: arachidonic acid (AA)
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 16 }}>
                          AA is the one the body turns into inflammatory signals — and{" "}
                          <Text style={{ fontWeight: "700" }}>EPA competes with it for the same
                          enzymes</Text>. Whichever is more abundant wins.
                        </Text>
                        <Text style={{ color: t.textMuted, fontSize: 11.5, marginTop: 5, lineHeight: 16 }}>
                          You don&apos;t want zero AA — it&apos;s needed for normal healing and
                          immunity. You want enough EPA sitting next to it. Poultry is higher in AA
                          than beef or lamb, so a chicken-based food asks more of your omega-3.
                        </Text>
                        <Text style={{ color: t.good, fontSize: 11.5, marginTop: 5, lineHeight: 16, fontWeight: "600" }}>
                          Two ways to shift it: add marine omega-3, or choose a lower-AA protein.
                          Adding EPA is the faster lever.
                        </Text>
                      </View>

                      {/* The evidence layer. Tiers are stated per claim because the
                          honest answer differs enormously between them — and the
                          lipoma one, which is why most people read this, is the
                          weakest. */}
                      {AA_EVIDENCE.map((a, i) => {
                        const tone =
                          a.tier === "trialled"
                            ? { fg: t.good, bg: t.goodTint, tag: "TRIALLED IN DOGS" }
                            : a.tier === "mechanism"
                            ? { fg: t.moderateDeep, bg: t.moderateTint, tag: "MECHANISM ONLY" }
                            : { fg: t.textDim, bg: t.surfaceSunken, tag: "ESTABLISHED" };
                        return (
                          <View key={i} style={{ backgroundColor: tone.bg, borderRadius: 9, padding: 11, marginTop: 8 }}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
                              <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                                {a.h}
                              </Text>
                              <Text style={{ color: tone.fg, fontSize: 9, fontWeight: "800", letterSpacing: 0.3, marginLeft: 6, marginTop: 2 }}>
                                {tone.tag}
                              </Text>
                            </View>
                            <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{a.b}</Text>
                          </View>
                        );
                      })}

                      <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", marginTop: 12, marginBottom: 4 }}>
                        Measured AA by protein (per 1,000 kcal)
                      </Text>
                      {AA_BY_PROTEIN.map((p, i) => (
                        <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 9, padding: 10, marginBottom: 6 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                            <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "700", flex: 1 }}>
                              {p.protein}
                            </Text>
                            <Text style={{ color: t.textDim, fontSize: 11, marginRight: 8 }}>{p.ratio}</Text>
                            <Text style={{ color: parseFloat(p.aa) < 1 ? t.good : t.critical, fontSize: 12.5, fontWeight: "800" }}>
                              AA {p.aa}
                            </Text>
                          </View>
                          <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5 }}>{p.note}</Text>
                        </View>
                      ))}
                      <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 2, lineHeight: 15.5, fontStyle: "italic" }}>
                        From a manufacturer publishing a full nutritional analysis rather than a
                        guaranteed minimum. Most brands never disclose arachidonic acid at all — if
                        you can&apos;t find it, assume poultry-based food runs high.
                      </Text>

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
                  door="whats-in-it"
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
                  door="whats-in-it"
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
                          Why position matters: legume protein is low in the sulfur amino acids — methionine and cysteine — that dogs use to make taurine. So peas high in the list usually mean less of the protein is coming from meat. The concern is that displacement, not peas being harmful. Foods with added taurine on the label are less of a question mark, and we can't read taurine off an ingredient panel — so where the legumes sit is our best available proxy for it, not a measurement.{"\n\n"}This is a correlational pattern still under investigation — not a confirmed cause. Plenty of dogs eat these foods without ever developing DCM. Worth knowing who funded the main studies, because it cuts both ways: an 18-month trial finding no heart problems was paid for by Hill's, and a study finding no harm at very high pea levels was paid for by the pulse growers. Nobody neutral has settled it. It's a reason to talk to your vet, not a reason to panic.
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
                    { icon: "🥚", label: "An egg in the morning", expandable: true },
                    { icon: "🐟", label: "Sardines or fish oil", expandable: false },
                    { icon: "🥛", label: "Plain yogurt, kefir, or goat's milk for probiotics", expandable: false },
                  ].map((item, i, arr) => (
                    <View key={i}>
                      <TouchableOpacity
                        activeOpacity={item.expandable ? 0.6 : 1}
                        disabled={!item.expandable}
                        onPress={() => {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setEggInfoOpen((v) => !v);
                        }}
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
                        {item.expandable && (
                          <Text style={{ color: t.info, fontSize: 12, fontWeight: "700" }}>
                            {eggInfoOpen ? "Which eggs? ▾" : "Which eggs? ▸"}
                          </Text>
                        )}
                      </TouchableOpacity>

                      {item.expandable && eggInfoOpen && (
                        <View style={{ paddingBottom: 14, paddingTop: 2 }}>
                          <Text style={{ color: t.textMuted, fontSize: 12.5, lineHeight: 19, marginBottom: 12 }}>
                            Pasture-raised eggs are measurably richer than conventional ones. Here's what the research actually found — and how much of it matters for a dog.
                          </Text>

                          {EGG_QUALITY.map((row, k) => (
                            <View
                              key={k}
                              style={{
                                backgroundColor: t.surfaceSunken,
                                borderRadius: 10,
                                padding: 12,
                                marginBottom: 8,
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700", flex: 1 }}>
                                  {row.nutrient}
                                </Text>
                                <View style={{ backgroundColor: t.goodTint, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
                                  <Text style={{ color: t.good, fontSize: 11, fontWeight: "700" }}>{row.diff}</Text>
                                </View>
                              </View>
                              <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 19 }}>{row.detail}</Text>
                              <Text style={{ color: t.textDim, fontSize: 10.5, marginTop: 6, fontStyle: "italic" }}>
                                {row.source}
                              </Text>
                            </View>
                          ))}

                          {/* The yolk tell — pulled out of the carotenoid row and
                              given its own card, because it's the one check that
                              works without trusting any label. */}
                          <View
                            style={{
                              backgroundColor: t.goodTint,
                              borderRadius: 10,
                              padding: 12,
                              marginBottom: 8,
                              borderLeftWidth: 3,
                              borderLeftColor: t.good,
                            }}
                          >
                            <Text style={{ color: t.goodDeep, fontSize: 12.5, fontWeight: "700", marginBottom: 4 }}>
                              🍳 The check that beats every label
                            </Text>
                            <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 19 }}>
                              Crack one. <Text style={{ fontWeight: "700" }}>Deep orange yolk</Text> means high carotenoids, which a hen only gets from eating real plants and insects — she was outside. <Text style={{ fontWeight: "700" }}>Pale yellow</Text> means she wasn't. You can see the nutrient difference in the pan, and unlike the carton, it can't be marketed at you.
                            </Text>
                          </View>

                          <Text style={{ color: t.textStrong, fontSize: 13.5, fontWeight: "700", marginTop: 6, marginBottom: 8 }}>
                            What the carton is actually telling you
                          </Text>

                          {EGG_LABELS.map((l, k) => {
                            const tone =
                              l.tier === "good"
                                ? { fg: t.good, bg: t.goodTint, mark: "✓" }
                                : l.tier === "empty"
                                ? { fg: t.critical, bg: t.criticalTint, mark: "✕" }
                                : { fg: t.moderateDeep, bg: t.moderateTint, mark: "~" };
                            return (
                              <View
                                key={k}
                                style={{
                                  backgroundColor: t.surfaceSunken,
                                  borderRadius: 10,
                                  padding: 12,
                                  marginBottom: 8,
                                }}
                              >
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 18,
                                      borderRadius: 999,
                                      backgroundColor: tone.bg,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginRight: 8,
                                    }}
                                  >
                                    <Text style={{ color: tone.fg, fontSize: 11, fontWeight: "800" }}>{tone.mark}</Text>
                                  </View>
                                  <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "700", flex: 1 }}>
                                    {l.label}
                                  </Text>
                                </View>
                                <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 19 }}>{l.means}</Text>
                              </View>
                            );
                          })}

                          {EGG_QUALITY_CAVEATS.map((c, k) => (
                            <View
                              key={k}
                              style={{
                                backgroundColor: t.moderateTint,
                                borderRadius: 10,
                                padding: 12,
                                marginBottom: 8,
                              }}
                            >
                              <Text style={{ color: t.moderateDeep, fontSize: 12.5, fontWeight: "700", marginBottom: 4 }}>
                                {c.title}
                              </Text>
                              <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 19 }}>{c.body}</Text>
                            </View>
                          ))}

                          <AskAIChip
                            label="Ask about eggs"
                            onPress={() =>
                              askAboutSection(
                                `Are pasture-raised eggs worth the extra cost for my dog compared to regular store-bought eggs, given what he already eats? Be practical about whether the difference is big enough to matter for him.`,
                              )
                            }
                          />
                        </View>
                      )}
                    </View>
                  ))}
                  <Text style={[styles.sectionNote, { marginTop: 12 }]}>
                    All optional — small upgrades, not corrections.
                  </Text>
                </View>
              )}

              {(score !== null || learnMode) && (
                <AccordionSection title="🐾 Hershey's Protocol"
                  door="what-to-do" bare>
                  <HersheyProtocolSection />
                </AccordionSection>
              )}

              {scoreBreakdown.length > 0 && (
                <AccordionSection
                    title="💊 Recommended Supplements"
                  door="what-to-do"
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

              {(score !== null || learnMode) && (
                <AccordionSection title="🛒 Grocery Store Finds"
                  door="what-to-do">
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

              {(score !== null || learnMode) && (
                <AccordionSection title="🏭 The Kibble Problem"
                  topic="Kibble"
                  door="learn" bare>
                  <KibbleProblemSection />
                </AccordionSection>
              )}

              {(score !== null || learnMode) && (
                <AccordionSection title="📚 More Facts About Pet Food"
                  topic="Recalls & facts"
                  door="learn" bare>
                  <PetFoodFactsSection />
                </AccordionSection>
              )}

              {(score !== null || learnMode) && (
                <AccordionSection title="❤️ Heart Support"
                  topic="Heart"
                  door="learn"
                  bare
                  askLabel="Ask"
                  onAskAI={() => askAboutSection("Explain the holistic approach to canine heart disease for my dog — the TCVM view, what to feed, and which supplements have doses. Be clear about what is clinical experience versus trial evidence, and remind me what must stay alongside prescribed cardiac medication.")}
                >
                  <HeartSection />
                </AccordionSection>
              )}

              {(score !== null || learnMode) && (
                <AccordionSection title="🧬 Lumps, Bumps & Lipomas"
                  topic="Lipomas"
                  door="learn" bare>
                  <LipomaSection />
                </AccordionSection>
              )}

              {/* ── GUT HEALTH ───────────────────────────────────────────────
                  Added 2026-08-22. New "Gut health" chip in LEARN_TOPICS. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="🦠 Gut health"
                  topic="Gut health"
                  door="learn"
                  askLabel="Ask AI"
                  onAskAI={() =>
                    askAboutSection(
                      `My dog has itchy skin and digestive trouble. How do I actually rebuild his gut, and in what order?`,
                    )
                  }
                >
                  <View style={{ backgroundColor: t.goodTint, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: t.good }}>
                    <Text style={{ color: t.goodDeep, fontSize: 13, fontWeight: "800" }}>
                      The 80% rule
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18, marginTop: 4 }}>
                      Between <Text style={{ fontWeight: "800" }}>70% and 80% of the immune
                      system</Text> sits directly behind the gut wall, in the GALT — the
                      gut-associated lymphoid tissue. Balanced, the microbiome digests food,
                      synthesises nutrients and keeps the immune system calm. Irritated, the GALT
                      goes into overdrive and generates chronic systemic inflammation. That is why
                      the gut is the first place to look, not the last.
                    </Text>
                  </View>

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 14, marginBottom: 2 }}>
                    Why gut problems show up somewhere else
                  </Text>
                  {GUT_AXES.map((a, i) => (
                    <View key={i} style={{ flexDirection: "row", gap: 9, marginTop: 8, alignItems: "flex-start" }}>
                      <Text style={{ fontSize: 15 }}>{a.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: t.good, fontSize: 12, fontWeight: "800" }}>{a.axis}</Text>
                        <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 2 }}>{a.detail}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={{ backgroundColor: t.criticalTint, borderRadius: 10, padding: 12, marginTop: 14, borderLeftWidth: 3, borderLeftColor: t.critical }}>
                    <Text style={{ color: t.criticalDeep, fontSize: 13, fontWeight: "800" }}>
                      Leaky gut, mechanically
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginTop: 4 }}>{GUT_LEAKY.what}</Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginTop: 6 }}>{GUT_LEAKY.how}</Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5, marginTop: 6 }}>{GUT_LEAKY.result}</Text>
                  </View>

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    What breaks it
                  </Text>
                  {GUT_DISRUPTORS.map((d, i) => (
                    <View key={i} style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: t.border }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <Text style={{ fontSize: 14 }}>{d.icon}</Text>
                        <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "800" }}>{d.name}</Text>
                      </View>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 4 }}>{d.detail}</Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    What rebuilds it
                  </Text>
                  {GUT_FOODS.map((f, i) => (
                    <View key={i} style={{ marginTop: 7 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "700" }}>{f.food}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 1 }}>{f.detail}</Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    Protocols
                  </Text>
                  {GUT_PROTOCOLS.map((p, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: i < 2 ? t.moderateTint : t.surfaceSunken,
                        borderRadius: 10,
                        padding: 12,
                        marginTop: 8,
                        borderLeftWidth: i < 2 ? 3 : 0,
                        borderLeftColor: t.moderate,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <Text style={{ fontSize: 14 }}>{p.icon}</Text>
                        <Text style={{ color: i < 2 ? t.moderateDeep : t.textStrong, fontSize: 12.5, fontWeight: "800", flex: 1 }}>
                          {p.name}
                        </Text>
                      </View>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 4 }}>{p.detail}</Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    Herbs, chosen by constitution
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16.5, marginBottom: 2 }}>
                    Pick the group that matches your dog, not the symptom. A warming herb in a hot
                    dog makes things worse.
                  </Text>
                  {GUT_HERBS.map((g, i) => (
                    <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginTop: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <Text style={{ fontSize: 14 }}>{g.icon}</Text>
                        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "800", flex: 1 }}>{g.group}</Text>
                      </View>
                      {g.herbs.map(([herb, what], j) => (
                        <View key={j} style={{ marginTop: 6 }}>
                          <Text style={{ color: t.good, fontSize: 11.5, fontWeight: "700" }}>{herb}</Text>
                          <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16 }}>{what}</Text>
                        </View>
                      ))}
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16 }}>
                    Save this
                  </Text>
                  <Image
                    source={require("../assets/images/gut-health-guide.jpg")}
                    style={{ width: "100%", aspectRatio: 1900 / 1060, borderRadius: 9, marginTop: 6 }}
                    resizeMode="contain"
                    accessibilityLabel="The garden within — a dog's guide to gut health: the modern saboteurs, the 80 percent rule, leaky gut syndrome, the microbiome toolkit, herbal support and dietary foundations"
                  />

                  <Text style={{ color: t.textDim, fontSize: 11, lineHeight: 17, marginTop: 12 }}>
                    ⚠️ Educational only, not veterinary advice. FMT and ozone therapy are done
                    through a vet, and any dog on antibiotics, acid reducers or steroids needs that
                    conversation before you change anything.
                  </Text>
                </AccordionSection>
              )}


              {/* ── TCVM FOOD THERAPY ────────────────────────────────────────
                  Added 2026-08-22. Gated on (score || learnMode) rather than on
                  scoreBreakdown, so the TCVM chip actually opens something without
                  a scan — the two Protein Energetics sections are gated on
                  scoreBreakdown.length and therefore render nothing in Learn. */}
              {(score !== null || learnMode) && (
                <AccordionSection
                  title="🌿 TCVM food therapy"
                  topic="TCVM"
                  door="learn"
                  askLabel="Ask AI"
                  onAskAI={() =>
                    askAboutSection(
                      `Is my dog hot or cold in TCVM terms, and which foods should I be feeding to bring him back into balance?`,
                    )
                  }
                >
                  <Text style={{ color: t.text, fontSize: 12.5, lineHeight: 18.5 }}>
                    TCVM works energetically rather than mechanistically. Instead of suppressing a
                    symptom, it looks for the underlying imbalance and restores harmony so the body
                    heals itself. Foods are chosen by thermal nature — cooling, warming or neutral —
                    by how they&apos;re prepared, and by taste, each of which acts on particular
                    organ systems.
                  </Text>
                  <View style={{ backgroundColor: t.goodTint, borderRadius: 10, padding: 12, marginTop: 10, borderLeftWidth: 3, borderLeftColor: t.good }}>
                    <Text style={{ color: t.goodDeep, fontSize: 13, fontWeight: "800", lineHeight: 18 }}>
                      &ldquo;You cannot out-supplement a bad diet.&rdquo;
                    </Text>
                    <Text style={{ color: t.text, fontSize: 12, lineHeight: 17, marginTop: 4 }}>
                      Fresh, high-quality food is the foundation. Highly processed food introduces
                      excess internal heat and stagnation — which no supplement undoes.
                    </Text>
                  </View>

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 14, marginBottom: 4 }}>
                    The four pillars
                  </Text>
                  {TCVM_PILLARS.map(([name, what], i) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: 5 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "800", width: 92 }}>{name}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, flex: 1 }}>{what}</Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    Start here: is your dog hot or cold?
                  </Text>
                  {TCVM_STATES.map((s, i) => (
                    <View key={i} style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: t.border }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <Text style={{ fontSize: 15 }}>{s.icon}</Text>
                        <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "800" }}>{s.state}</Text>
                      </View>
                      <Text style={{ color: t.text, fontSize: 12, lineHeight: 17, marginTop: 5 }}>{s.signs}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16.5, marginTop: 3 }}>{s.meaning}</Text>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "700", marginTop: 5 }}>{s.feed}</Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    The food therapy lists
                  </Text>
                  {TCVM_FOOD_THERAPY.map((f, i) => (
                    <View key={i} style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginTop: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <Text style={{ fontSize: 14 }}>{f.icon}</Text>
                        <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "800" }}>{f.temp} foods</Text>
                      </View>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "700", marginTop: 3 }}>{f.useFor}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 5 }}>
                        <Text style={{ fontWeight: "700" }}>Proteins: </Text>{f.proteins}
                      </Text>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 3 }}>
                        <Text style={{ fontWeight: "700" }}>
                          {f.temp === "Neutral" ? "Why: " : "Plants & herbs: "}
                        </Text>{f.plants}
                      </Text>
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    The digestive system (Spleen &amp; Stomach)
                  </Text>
                  <Text style={{ color: t.text, fontSize: 12, lineHeight: 17.5 }}>{TCVM_DIGESTION.principle}</Text>
                  <View style={{ backgroundColor: t.moderateTint, borderRadius: 9, padding: 11, marginTop: 8, borderLeftWidth: 3, borderLeftColor: t.moderate }}>
                    <Text style={{ color: t.moderateDeep, fontSize: 12, fontWeight: "800" }}>How to serve it</Text>
                    <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 3 }}>{TCVM_DIGESTION.serve}</Text>
                  </View>
                  {TCVM_DIGESTION.use.map(([food, why], i) => (
                    <View key={i} style={{ marginTop: 7 }}>
                      <Text style={{ color: t.good, fontSize: 12, fontWeight: "700" }}>{food}</Text>
                      <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5 }}>{why}</Text>
                    </View>
                  ))}
                  <Text style={{ color: t.critical, fontSize: 12, fontWeight: "700", marginTop: 9 }}>Avoid</Text>
                  <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5 }}>{TCVM_DIGESTION.avoid}</Text>

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    Feeding a specific organ
                  </Text>
                  {TCVM_ORGANS.map((o, i) => (
                    <View key={i} style={{ backgroundColor: t.surface, borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: t.border }}>
                      <Text style={{ color: t.textStrong, fontSize: 13, fontWeight: "800" }}>
                        {o.organ} <Text style={{ color: t.textDim, fontSize: 11 }}>· {o.element}</Text>
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 11.5, lineHeight: 16, marginTop: 2 }}>{o.rules}</Text>
                      {o.patterns.map(([pattern, fix], j) => (
                        <View key={j} style={{ marginTop: 7 }}>
                          <Text style={{ color: t.good, fontSize: 11.5, fontWeight: "700", lineHeight: 16 }}>{pattern}</Text>
                          <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 1 }}>{fix}</Text>
                        </View>
                      ))}
                    </View>
                  ))}

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16, marginBottom: 2 }}>
                    Critical clinical insights
                  </Text>
                  {TCVM_CLINICAL.map((c, i) => (
                    <View key={i} style={{ flexDirection: "row", gap: 9, marginTop: 8, alignItems: "flex-start" }}>
                      <Text style={{ fontSize: 15 }}>{c.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: t.textStrong, fontSize: 12.5, fontWeight: "800" }}>{c.title}</Text>
                        <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16.5, marginTop: 2 }}>{c.detail}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={{ backgroundColor: t.surfaceSunken, borderRadius: 10, padding: 12, marginTop: 14 }}>
                    <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13 }}>
                      The eye as a window to the organs
                    </Text>
                    {TCVM_EYE.map(([part, meaning], i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          marginTop: 7,
                          paddingTop: 7,
                          borderTopWidth: i === 0 ? 0 : 1,
                          borderTopColor: t.border,
                        }}
                      >
                        <Text style={{ color: t.good, fontSize: 11.5, fontWeight: "800", width: 108 }}>{part}</Text>
                        <Text style={{ color: t.text, fontSize: 11.5, lineHeight: 16, flex: 1 }}>{meaning}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={{ color: t.textStrong, fontWeight: "800", fontSize: 13, marginTop: 16 }}>
                    Save this
                  </Text>
                  <Image
                    source={require("../assets/images/tcvm-energetic-bowl.jpg")}
                    style={{ width: "100%", aspectRatio: 1900 / 1060, borderRadius: 9, marginTop: 6 }}
                    resizeMode="contain"
                    accessibilityLabel="The energetic bowl — a guide to TCVM food therapy: identifying a hot or cold pet, the five element personalities, the four pillars, cooling warming and neutral food lists, and the eye as a window to the organs"
                  />
                </AccordionSection>
              )}


              {scoreBreakdown.length > 0 && (
                <AccordionSection title="🌿 Protein Energetics (TCVM)"
                  topic="TCVM"
                  door="learn">
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
        </DoorContext.Provider>
        </TopicContext.Provider>
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

      {/* ── BOTTOM TAB BAR (v1.9 remodel, step 2) ──────────────────────────
          Replaces the in-scroll "doors" as the app's navigation. Three tabs,
          all wired to things that already exist — no dead buttons:
            Scan    = this screen (always active while you're here)
            Hershey = the dog profile, which was previously buried
            Ask     = the AI coach modal
          A History tab is in the design but deliberately NOT shipped here,
          because the screen doesn't exist yet and a tab that does nothing is
          worse than one that's missing. */}
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: t.border,
          backgroundColor: t.surface,
          paddingBottom: 22,
          paddingTop: 8,
        }}
      >
        {[
          /* Learn is FIRST and is where the app opens. Scan is second — still one
             tap, but you no longer have to be holding a bag to get any value. */
          {
            key: "learn",
            icon: "📚",
            label: "Learn",
            active: learnMode,
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setLearnMode(true);
              setOpenDoor("learn");
              setOpenTopic(null);
            },
          },
          {
            key: "scan",
            icon: "📷",
            label: "Scan",
            active: !learnMode,
            onPress: () => { setLearnMode(false); setOpenDoor(null); setOpenTopic(null); },
          },
          {
            key: "dog",
            icon: "🐕",
            label: dogProfileName || "Your dog",
            active: false,
            onPress: async () => {
              const s = await getSession();
              router.push((s ? "/dog-profile" : "/login") as Href);
            },
          },
          {
            key: "ask",
            icon: "💬",
            label: "Ask",
            active: false,
            onPress: () => setCoachVisible(true),
          },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={tab.onPress}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab.active }}
            accessibilityLabel={tab.label}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 3,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 20, opacity: tab.active ? 1 : 0.55 }}>{tab.icon}</Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10.5,
                fontWeight: "700",
                color: tab.active ? t.good : t.textFaint,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  // (The blue instructional heroCard was removed 2026-08-21 — its sentence now
  // sits inside the viewfinder frame, per the v1.9 mockup. Nothing it said was
  // lost; scanTitle + scanOverlayText + scanHint carry it.)
  // ── THE KIBBLE GUIDE (Learn tab landing) ───────────────────────────────────
  guideTitle: {
    color: t.textStrong,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  guideLede: {
    color: t.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  guideTabs: {
    flexDirection: "row",
    backgroundColor: t.surfaceSunken,
    borderRadius: 11,
    padding: 3,
    gap: 3,
    marginBottom: 12,
  },
  guideTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  guideTabOn: { backgroundColor: t.good },
  guideTabText: { color: t.textMuted, fontSize: 12, fontWeight: "700" },
  guideTabTextOn: { color: t.onAccent },
  guideHint: {
    color: t.textDim,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  guideCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    marginBottom: 8,
    overflow: "hidden",
  },
  guideCardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    padding: 13,
  },
  guideCardTitle: {
    color: t.textStrong,
    fontSize: 14.5,
    fontWeight: "700",
  },
  guideCardHeadline: {
    color: t.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  guideChevron: { color: t.textFaint, fontSize: 15, fontWeight: "700" },
  guideCardBody: {
    paddingHorizontal: 13,
    paddingBottom: 14,
    gap: 10,
  },
  guideLabelCue: {
    color: t.textFaint,
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  guideTermRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  guideTerm: {
    backgroundColor: t.criticalTint,
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  guideTermText: { color: t.critical, fontSize: 12, fontWeight: "700" },
  guideWhy: { color: t.text, fontSize: 13, lineHeight: 20 },
  // Evidence tier is never decoration — it's the thing that keeps this guide
  // honest, so it gets its own visible chip rather than a parenthetical.
  guideTierPill: {
    alignSelf: "flex-start",
    backgroundColor: t.surfaceSunken,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  guideTierText: {
    color: t.textDim,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  guideInstead: {
    backgroundColor: t.goodTint,
    borderRadius: 11,
    padding: 11,
    gap: 3,
  },
  guideInsteadLabel: {
    color: t.good,
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  guideInsteadText: { color: t.text, fontSize: 12.5, lineHeight: 18.5 },
  guideGoodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    backgroundColor: t.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    padding: 12,
    marginBottom: 7,
  },
  guideGoodLabel: { color: t.textStrong, fontSize: 13.5, fontWeight: "700" },
  guideGoodDetail: { color: t.textDim, fontSize: 12, lineHeight: 17, marginTop: 2 },
  guideStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    backgroundColor: t.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    padding: 13,
    marginBottom: 8,
  },
  guideStepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: t.good,
    alignItems: "center",
    justifyContent: "center",
  },
  guideStepNumText: { color: t.onAccent, fontSize: 12, fontWeight: "800" },
  guideStepTitle: { color: t.textStrong, fontSize: 13.5, fontWeight: "700", lineHeight: 19 },
  guideStepDetail: { color: t.text, fontSize: 12.5, lineHeight: 19, marginTop: 4 },
  guideStepTier: {
    color: t.textFaint,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 6,
  },
  guideWarnCard: {
    backgroundColor: t.moderateTint,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: t.moderate,
    padding: 13,
    marginTop: 4,
  },
  guideWarnTitle: { color: t.moderateDeep, fontSize: 13.5, fontWeight: "700" },
  guideWarnBody: {
    color: t.text,
    fontSize: 12.5,
    lineHeight: 19.5,
    marginTop: 10,
  },
  // ── "Every one": the full flagged-ingredient reference ──
  guideSearch: {
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 13.5,
    color: t.textStrong,
    marginBottom: 12,
  },
  guideEmpty: {
    color: t.textDim,
    fontSize: 12.5,
    lineHeight: 19,
    paddingVertical: 10,
  },
  guideSevHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
    marginBottom: 7,
  },
  guideSevDot: { width: 8, height: 8, borderRadius: 4 },
  guideSevLabel: {
    color: t.textStrong,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  guideSevPenalty: {
    color: t.textFaint,
    fontSize: 10.5,
    fontWeight: "700",
    marginLeft: "auto",
  },
  guideIngHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  guideIngName: {
    flex: 1,
    color: t.textStrong,
    fontSize: 13.5,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  guideIngReason: {
    color: t.text,
    fontSize: 12.5,
    lineHeight: 19.5,
    paddingHorizontal: 13,
    paddingBottom: 13,
  },
  guideFootnote: {
    color: t.textDim,
    fontSize: 11.5,
    lineHeight: 17.5,
    marginTop: 12,
    fontStyle: "italic",
  },

  // Screen title above the segmented row — plain, quiet, and the only thing
  // that names what you're about to do. Replaced the blue instructional
  // heroCard, whose sentence now sits inside the viewfinder frame.
  scanTitle: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 10,
    color: t.textStrong,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  scanHint: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 10,
    color: t.textMuted,
    fontSize: 13,
  },
  // The framed viewfinder: fixed 250px, dashed border, rounded. Deliberately
  // NOT flex:1 — a full-bleed camera pushed everything else off the screen.
  cameraWrapper: {
    alignSelf: "stretch",
    height: 250,
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: t.borderBright,
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
    paddingBottom: 14,
    paddingHorizontal: 24,
  },
  // A scrim pill rather than a text shadow — RN deprecated the textShadow*
  // props, and a solid ground is more legible over a bright bag anyway.
  scanOverlayText: {
    color: t.overlayControl,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: t.scrimOnCamera,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  // One round shutter, under the frame. 66px, filled with the app's own
  // "good" green so the primary action reads as the primary action.
  shutterBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: t.good,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  shutterIcon: { fontSize: 26 },
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
  // Segmented mode row. Changed 2026-08-21 to the mockup's version: sunken
  // track, and the ACTIVE segment filled with the app's green rather than a
  // white iOS pill. On this screen the segment is the only choice being made,
  // so it earns the colour.
  modeToggle: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: t.surfaceSunken,
    borderRadius: 11,
    padding: 3,
    gap: 3,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: t.good,
  },
  modeBtnText: { color: t.textMuted, fontWeight: "700", fontSize: 12 },
  modeBtnTextActive: { color: t.onAccent, fontWeight: "700" },
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

  // Score hero — horizontal block on the score colour's own tint (food results).
  // Replaced the 168px circular ring + pill + caption stack on 2026-08-21, per the
  // approved v1.9 mockup. The ring was a nice object that cost ~250px of screen
  // before a single ingredient appeared; this holds the same three facts in ~90px.
  scoreHero: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  scoreHeroNumber: {
    fontSize: 52,
    fontWeight: "800",
    lineHeight: 54,
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
  },
  scoreHeroMeta: { flex: 1, gap: 2 },
  scoreHeroLabel: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  scoreHeroSub: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
  },
  scoreHeroNote: {
    fontSize: 10.5,
    color: t.textDim,
    marginTop: 5,
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
