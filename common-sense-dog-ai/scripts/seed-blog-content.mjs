/**
 * seed-blog-content.mjs
 * Seeds full blog post content (from lib/blog-data.ts) into Pinecone.
 * IDs are prefixed with "fullblog-" to avoid conflicts with summary entries.
 *
 * Usage:
 *   node scripts/seed-blog-content.mjs            # seed all
 *   node scripts/seed-blog-content.mjs --new-only # seed only new posts
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const envFile = readFileSync(resolve(root, '.env.local'), 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'dog-knowledge-database'
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY

if (!PINECONE_API_KEY || !VOYAGE_API_KEY) {
  console.error('Missing PINECONE_API_KEY or VOYAGE_API_KEY in .env.local')
  process.exit(1)
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const fullPosts = [
  {
    slug: 'medicinal-mushrooms-for-dogs',
    title: 'Medicinal Mushrooms for Dogs: The Evidence, the Best Types, and What Actually Works',
    tag: 'Supplements',
    content: `Medicinal mushrooms have been used in human medicine for thousands of years. In veterinary medicine, they're one of the fastest-growing areas of integrative care — and unlike most trends in pet health, the research behind several of these mushrooms is genuinely compelling. A University of Pennsylvania clinical trial. Published studies on immune modulation, cancer, insulin resistance, and liver function. Real data, not just anecdote.

How Medicinal Mushrooms Work: The primary active compounds in medicinal mushrooms are beta-glucans — complex polysaccharides found in the cell walls of the mushroom. Beta-glucans are biological response modifiers: they don't directly attack pathogens or tumors, but they modulate the immune system's ability to recognize and respond to them. Different mushroom species contain different beta-glucan profiles, and many also contain unique secondary compounds — triterpenes, ergosterol (a precursor to Vitamin D), cordycepin, and others. One critical note on sourcing: the active compounds are concentrated in the fruiting body (the actual mushroom) not the mycelium (the root structure). Many cheap supplements are mycelium grown on grain — which is mostly starch with very low beta-glucan content. Always look for products specifying "fruiting body" and listing beta-glucan percentage.

Turkey Tail (Trametes versicolor): Turkey tail has the strongest clinical evidence of any medicinal mushroom in dogs. A randomized, placebo-controlled clinical trial at the University of Pennsylvania School of Veterinary Medicine gave turkey tail extract to dogs with hemangiosarcoma — one of the most aggressive cancers in dogs. Dogs receiving the highest dose had the longest median survival times ever reported for this disease without chemotherapy. The active compounds — PSK (polysaccharide-K) and PSP (polysaccharide-peptide) — are among the most studied anti-cancer compounds in both human and veterinary oncology. PSK is an approved cancer treatment drug in Japan. Turkey tail also supports gut microbiome diversity. Best uses: dogs with cancer, compromised immune function, chronic digestive issues, senior dogs.

Reishi (Ganoderma lucidum): Reishi activates AMPK (AMP-activated protein kinase) — the same cellular energy sensor activated by exercise and caloric restriction. AMPK activation reduces insulin resistance, improves fat metabolism, and inhibits the inflammatory pathways that drive chronic disease. Reishi's triterpenes directly inhibit adipocyte differentiation — the process by which stem cells become fat cells. Directly relevant to lipoma management. Reishi also has documented hepatoprotective effects. Best uses: dogs with lipomas, dogs on long-term medications, dogs with allergies or chronic inflammation, senior dogs.

Maitake (Grifola frondosa): Maitake's primary documented mechanism is improving insulin sensitivity and lowering blood glucose. Directly relevant for overweight dogs and dogs with lipomas, since high insulin drives fat storage. Maitake also contains the D-fraction — a specific beta-glucan extract shown to activate macrophages and natural killer cells, enhancing immune surveillance.

Chaga (Inonotus obliquus): Chaga has the highest ORAC (antioxidant) score of any studied natural substance. Its betulinic acid and inotodiol compounds have documented anti-tumor and anti-inflammatory activity. High antioxidant and anti-inflammatory properties make it a common addition to multi-mushroom formulas for cancer-prone or senior dogs.

Lion's Mane (Hericium erinaceus): Lion's mane is the most studied mushroom for neurological function. It stimulates Nerve Growth Factor (NGF) — a protein essential for the survival and growth of neurons. Studies in aging dogs and rodent models show improvements in memory, learning, and cognitive function. Relevant for senior dogs with cognitive dysfunction syndrome (the canine equivalent of Alzheimer's). Known in Chinese culture as the longevity and brain mushroom.

Choosing a Quality Supplement: Look for fruiting body not mycelium. Beta-glucan percentage should be listed — aim for at least 20-30%. Third-party tested for heavy metals. Multi-mushroom blends combining turkey tail, reishi, maitake, and chaga provide broader coverage. Real Mushrooms and Four Leaf Rover are well-regarded brands.`,
  },
  {
    slug: 'lipomas-in-dogs',
    title: 'Lipomas in Dogs: What They Are, Which Breeds Are Most at Risk, and What You Can Do',
    tag: 'Conditions',
    content: `A lipoma is a benign (non-cancerous) mass made up of fat cells that grows just beneath the skin. They're typically soft, movable, and painless. The problem is when they grow large enough to restrict movement — especially in the armpit, groin, or between the legs — or when they grow deeper into muscle tissue (infiltrative lipomas). Any new lump should always be checked by a vet. A fine needle aspirate — a simple, low-cost in-office procedure — can tell you within minutes whether you're dealing with a lipoma or something that needs more attention.

Breeds Most Prone to Lipomas: A large UK study of over 384,000 dogs found lipomas are most common in dogs aged 9-12, dogs above their ideal body weight, and certain breeds. Spayed females had the highest odds of any group. Highest-risk breeds: Labrador Retrievers (one of the highest-risk breeds, especially as they age), Weimaraners (among the highest breed risk in research), Doberman Pinschers (prone to both standard and infiltrative lipomas), Golden Retrievers (very commonly affected), Miniature Schnauzers (high fat metabolism predisposes them), mixed breeds (especially overweight dogs).

What Causes Lipomas: Research consistently points to these drivers — chronic inflammation (lipoma tissue contains elevated numbers of actively proliferating fat stem cells driven by inflammatory signals), insulin resistance and excess carbohydrates (high-starch kibble diets drive this cycle), poor omega-6 to omega-3 ratio (most commercial kibble has a ratio of 10:1 to 20:1; the ideal is closer to 5:1 or lower), impaired liver function (when the liver can't process lipids efficiently, excess fat gets pushed into peripheral storage), and genetics (predisposed breeds carry inherited tendencies regardless of diet).

Diet Changes That Help: Cut ultra-processed carbohydrates (kibble high in starch drives insulin resistance and fat storage). Fix the omega ratio — add whole food omega-3 sources (sardines, salmon, mackerel) several times per week. Remove inflammatory oils — sunflower, safflower, corn, soybean, and vegetable oil are all high omega-6. Avoid peas, lentils, and soy — pro-inflammatory and associated with additional metabolic concerns. Lose the extra weight — even modest weight loss reduces the inflammatory signals that drive fat cell proliferation.

Supplements That May Help: Fish Oil (Omega-3/EPA+DHA) — the most important supplement for lipoma-prone dogs. Research shows fish oil lowers blood glucose, raises adiponectin (an anti-inflammatory fat hormone), and improves how the body handles stored fat. Turmeric/Curcumin — curcumin directly inhibits fat cell formation and suppresses the blood vessel growth that allows fat deposits to expand. Use with black pepper (piperine) — increases absorption by up to 2,000%. Milk Thistle — a healthy liver that efficiently processes fats is less likely to push excess lipids into peripheral fat storage. Medicinal Mushrooms — Reishi reduces insulin resistance via AMPK activation and directly inhibits fat cell differentiation. Maitake enhances insulin sensitivity and lowers circulating glucose. Exercise and Lymphatic Drainage — the lymphatic system has no pump and relies entirely on movement. Daily exercise stimulates lymphatic flow, improves insulin sensitivity, and reduces inflammatory cytokines.

When to Have a Lipoma Removed: The lipoma is restricting movement or causing pain. It's growing rapidly (more than 20% in a few months). Location will likely cause problems. Fine needle aspirate shows anything other than pure fat cells.`,
  },
  {
    slug: 'fish-oil-omega3-dogs',
    title: 'Fish Oil and Omega-3s for Dogs: The Evidence, the Best Sources, and What Most Owners Get Wrong',
    tag: 'Supplements',
    content: `Omega-3 fatty acids are one of the most research-backed supplements in dog nutrition. The three most relevant for dogs are: EPA (eicosapentaenoic acid) — the primary anti-inflammatory omega-3, directly reduces inflammatory cytokines and supports joint, skin, and immune health. DHA (docosahexaenoic acid) — critical for brain development, vision, and neurological function. ALA (alpha-linolenic acid) — found in plant sources like flaxseed. Dogs convert ALA to EPA and DHA very inefficiently — less than 15% conversion rate. Plant-based omega-3s are not an adequate substitute for marine sources.

The ratio of omega-6 to omega-3 in the diet matters as much as the absolute amount. Most commercial kibble has a ratio of 10:1 to 25:1. The optimal ratio for dogs is thought to be closer to 5:1 or lower.

Clinical Evidence: Joint Health — a randomized controlled trial found dogs with osteoarthritis fed a diet supplemented with fish oil showed significant improvement in weight-bearing ability and overall mobility scores. Skin and Coat — EPA and DHA are incorporated directly into skin cell membranes, reducing the inflammatory response that drives itching, flaking, and coat dullness. Dogs with atopic dermatitis showed measurable symptom reduction. Kidney Disease — dogs with chronic kidney disease supplemented with fish oil had significantly slower progression of kidney dysfunction and longer survival times. Heart Disease — 24 Boxer dogs with arrhythmogenic cardiomyopathy were randomized to fish oil, flax oil, or sunflower oil. Fish oil significantly reduced ventricular arrhythmias. Flax oil was not effective. Lipoma Management — fish oil in dogs specifically lowers blood glucose, raises adiponectin (an anti-inflammatory fat hormone), and improves how the body handles stored fat.

Best Sources: Whole food fish is the best option — sardines, mackerel, and salmon provide EPA and DHA in a naturally occurring phospholipid form that is more bioavailable than capsules. They also provide protein, taurine, vitamin D, selenium, and other cofactors. Canned sardines in water (no salt added) — easiest, cheapest, most accessible. Wild-caught salmon (cooked) — always cook before feeding, raw Pacific salmon can carry salmon poisoning disease. Canned mackerel in water. Avoid tuna — high mercury content. Fish oil supplements are good with caveats — check for oxidation (should smell like the ocean, not rotten fish), EPA/DHA content in milligrams, triglyceride form (more bioavailable than ethyl ester), and third-party testing. Krill oil provides omega-3s in phospholipid form plus astaxanthin — more expensive but requires a lower dose.

Dosing: General health maintenance: 20 mg combined EPA/DHA per kg of body weight per day. Anti-inflammatory (skin, joints, lipomas): 50-55 mg combined EPA/DHA per kg per day. For a 75 lb (34 kg) dog: maintenance = ~680 mg EPA/DHA/day; anti-inflammatory = ~1,700-1,870 mg EPA/DHA/day. Introduce gradually — start at 25% of target dose and increase over 2 weeks to avoid loose stools.

Signs of Omega-3 Deficiency: Dull, dry, or coarse coat. Flaky skin or dandruff. Chronic itching or skin inflammation. Stiff joints, difficulty rising. Growing or new lipomas. Excessive shedding beyond normal seasonal patterns.`,
  },
  {
    slug: 'heart-health-dogs',
    title: 'Heart Health in Dogs: Supplements, Whole Foods, and What the Clinical Trials Actually Show',
    tag: 'Heart Health',
    content: `Heart disease is the second leading cause of death in dogs. The most common form — myxomatous mitral valve disease (MMVD) — affects more than 10% of all dogs over age 10, and up to 100% of Cavalier King Charles Spaniels by age 10. Specific nutritional deficiencies are directly implicated, and clinical trials show that correcting them can reverse cardiac damage, reduce arrhythmias, and extend survival.

Breeds Most at Risk: MMVD is overrepresented in Cavalier King Charles Spaniels (up to 100% affected by age 10), Dachshunds, Chihuahuas, and Miniature Poodles. Dilated cardiomyopathy (DCM) primarily affects large breeds: Doberman Pinschers (prevalence up to 58%), Irish Wolfhounds, Great Danes, Boxers, and Golden Retrievers (emerging taurine-related DCM concern).

Taurine — The Most Important Nutrient for Cardiac Dogs: The landmark case — 24 Golden Retrievers with DCM were evaluated, and 23 of the 24 were eating grain-free or legume-rich diets. After diet change and taurine supplementation, most dogs showed measurable cardiac improvement on echocardiogram. The MUST trial enrolled 14 American Cocker Spaniels with DCM confirmed taurine deficiency. All were supplemented with taurine and L-carnitine. Most dogs improved enough to discontinue cardiovascular drugs. Typical dose: 500 mg twice daily for medium dogs; 1,000 mg twice daily for large breeds. Whole food sources: dark meat poultry, beef heart, sardines, clams.

L-Carnitine — Critical for the Heart's Energy Supply: The heart muscle runs almost entirely on fat for fuel — and L-carnitine is what transports fatty acids into the mitochondria to be burned. A landmark study in Boxers found that myocardial carnitine deficiency caused DCM. Two dogs treated with high-dose L-carnitine showed marked improvement. When supplementation was withdrawn, DCM recurred. Typical dose: 1-2 g/day for medium dogs; 2-4 g/day for large breeds. Whole food sources: red meat, especially beef and lamb.

CoQ10: Powers the mitochondrial electron transport chain in heart muscle cells. Cavalier King Charles Spaniels with congestive heart failure have significantly depleted myocardial CoQ10. Typical dose: 100-200 mg/day for medium-large dogs. Use ubiquinol form — better absorbed, especially in older dogs. Give with a fat-containing meal.

Omega-3 Fatty Acids: 24 Boxer dogs with arrhythmogenic cardiomyopathy were randomized to fish oil, flax oil, or sunflower oil. Fish oil significantly reduced ventricular arrhythmias. In 29 MMVD dogs over 12 months, omega-3 supplementation reduced arrhythmia risk by 2.96 times and reduced cardiac enlargement. 40% of control dogs progressed to symptomatic heart failure — the omega-3 group remained significantly more stable.

Magnesium: A retrospective study of 181 dogs with MMVD found that dogs with hypomagnesemia had approximately a 4-fold increased risk of death — 1-year survival was 53% in hypomagnesemic dogs vs. 91.5% in those with normal magnesium. Whole food sources: pumpkin seeds, spinach (cooked), sardines. Supplement: magnesium glycinate or magnesium taurate.

Signs of Heart Disease: Coughing especially at night or after lying down. Exercise intolerance. Labored or rapid breathing at rest. Distended abdomen (fluid accumulation). Weakness or fainting. Blue or gray gums (emergency). Many dogs with early heart disease show no symptoms at all — annual echocardiograms are recommended for predisposed breeds after age 5.`,
  },
  {
    slug: 'liver-support-dogs',
    title: 'Liver Support for Dogs: Supplements and Whole Foods That Actually Have Evidence Behind Them',
    tag: 'Organ Health',
    content: `The liver is the most metabolically active organ in a dog's body. It filters toxins, metabolizes fat, produces bile, regulates blood sugar, and synthesizes proteins the immune system depends on. When it's under stress — from medications, poor diet, or chronic inflammation — everything downstream suffers. The liver is also one of the most regenerative organs in the body.

Why Dogs' Livers Are Under More Stress Than You Think: Documented hepatotoxic drugs in dogs include NSAIDs (carprofen, meloxicam), azathioprine, azole antifungals, diazepam, doxycycline, lomustine, phenobarbital, and sulfonamide antibiotics. Add ultra-processed kibble, chronic low-grade inflammation, and excess body fat — and the liver in most middle-aged dogs is quietly working overtime. Monthly flea and tick preventatives, vaccines, lawn chemicals, and environmental toxins all add to the liver's chemical burden year-round.

Milk Thistle (Silymarin) — Strongest Evidence: A direct 30-day feeding trial in 40 dogs using a silymarin phytosome plus vitamin E supplement showed significant reductions in AST, ALT, ALP, and LDH — and measurable reduction in liver size on ultrasound. Form matters: the silybin-phosphatidylcholine phytosome form produces nearly 3x higher blood levels than standard silymarin. Typical dose: 20-50 mg/kg/day of standardized silymarin.

SAMe (S-Adenosylmethionine): SAMe plus silybin together significantly reduced inflammatory markers in canine hepatocytes and inhibited the NF-κB pathway through distinct, complementary mechanisms. The combination was more effective than either alone. Typical dose: 18-20 mg/kg/day on an empty stomach. Use enteric-coated tablets.

N-Acetyl Cysteine (NAC): NAC is the established veterinary antidote for acetaminophen poisoning in dogs. In a randomized pilot study of 60 hospitalized ill dogs, NAC significantly preserved erythrocyte glutathione compared to placebo.

Vitamin E: Recommended by the ACVIM consensus for dogs with necroinflammatory liver disease. Fat-soluble antioxidant that protects cell membranes from oxidative damage. Typical dose: 10 IU/kg/day. Use natural vitamin E (d-alpha tocopherol).

Whole Foods That Support Liver Function: Eggs — provide the most bioavailable protein of any single food, critical because protein is essential for liver cell regeneration. Also provide choline, essential for fat transport out of the liver. Choline deficiency causes fatty liver. Turmeric/Curcumin — a 2025 controlled clinical trial compared turmeric and pomegranate peel extract against a commercial hepatoprotective pharmaceutical in 30 dogs with corticosteroid-induced hepatopathy. The herbal group normalized liver enzymes faster and restored normal hepatic appearance on ultrasound sooner. Use with black pepper — increases curcumin bioavailability by up to 2,000%. Bone broth (low sodium, no onion) — provides glycine, one of the primary amino acids in glutathione synthesis.

What to Avoid: Long-term NSAIDs without monitoring — run a liver panel every 6 months. High-fat, ultra-processed diets drive hepatic lipidosis. Xylitol causes acute liver failure. Acetaminophen (Tylenol) — never give to dogs, even one tablet can cause fatal liver failure.

Signs of Liver Stress: Yellow tinge to skin, eyes, or gums (jaundice). Increased thirst and urination. Decreased appetite. Distended abdomen. Unexplained weight loss. Lethargy, confusion, or behavioral changes.`,
  },
  {
    slug: 'probiotics-enzymes-dogs',
    title: 'Why Probiotics, Prebiotics, and Digestive Enzymes Could Be the Missing Piece in Your Dog\'s Diet',
    tag: 'Gut Health',
    content: `Digestive enzymes break food down so your dog can actually absorb the nutrients in it. Probiotics are the live beneficial bacteria that live in your dog's gut and keep everything in balance. Prebiotics are the fiber that feeds those good bacteria so they can survive and thrive. Think of it like a garden: enzymes are the tools that break up the soil, probiotics are the seeds you plant, prebiotics are the water and fertilizer that keep them alive.

The Kibble Problem Nobody Talks About: Every whole food contains natural digestive enzymes. Raw meat has them. Fresh vegetables have them. Dogs' ancestors ate enzyme-rich food at every meal. Kibble is processed at 250-300°F under high pressure. Temperatures as low as 118°F can destroy virtually all natural enzymes in food. By the time kibble reaches your dog's bowl, there are zero enzymes left. Probiotics some brands add to their formula are also killed by heat before the bag is sealed. This means the pancreas has to compensate by working overtime every single meal, every single day. Over years this adds up — bloating, gas, loose stools, and poor nutrient absorption are often the first signs.

How Processing Method Changes Everything: Raw and freeze-dried — enzymes and beneficial bacteria are almost fully intact. Dogs eating raw diets generally don't need enzyme supplements. Gently cooked — low heat preserves far more nutrients than kibble, but does destroy some enzymes. Adding a digestive enzyme supplement is a smart move. Kibble — high heat destroys virtually all enzymes. Supplementing is highly recommended.

Why Variety Matters: Dogs' guts are home to hundreds of different bacterial strains, and different strains do different jobs. Rotating probiotic strains — or using a blend that contains multiple strains — helps build a more diverse and resilient gut microbiome. Rotating proteins and food types naturally exposes the dog to different nutrients and different beneficial bacteria, building gut health over time.

Daily Probiotic Use: Holistic vets broadly agree that daily probiotic use is safe and beneficial for most dogs long term. Cornell University's College of Veterinary Medicine notes that research supports ongoing probiotic use for gut, skin, coat, and immune health. The current recommendation is 1-10 billion CFUs per day depending on size and health status. Be especially consistent after antibiotics, during or after stressful events, for dogs on kibble-heavy diets, and for dogs with chronic digestive issues, allergies, or skin problems.

Simple Ways to Start: Add a quality digestive enzyme supplement to each meal. Use a probiotic with multiple strains — look for Lactobacillus acidophilus, Bifidobacterium, and Bacillus on the label. Feed natural prebiotics — plain canned pumpkin, blueberries, and chicory root are easy additions. Rotate proteins and food types — different foods feed different bacteria. Fermented options like kefir and goat's milk are excellent natural probiotic and prebiotic sources safe to give daily.`,
  },
  {
    slug: 'intermittent-fasting-dogs',
    title: 'Intermittent Fasting and Caloric Restriction in Dogs: What the Trials Actually Show',
    tag: 'Lifestyle',
    content: `The Purina Labrador Study — The Landmark Evidence: The most important study in canine nutrition science is the Purina LifeSpan Study — a controlled clinical trial spanning two decades following 48 Labrador Retrievers from puppyhood to death. Half were fed freely. Half were fed 25% less than their paired counterparts from 8 weeks of age. Results: diet-restricted dogs lived a median of 1.8 years (15%) longer — 13.0 years vs 11.2 years. Diet-restricted dogs had significantly lower serum insulin, glucose, and triglycerides throughout life. Onset of chronic diseases including osteoarthritis and neoplasia (tumors) was significantly delayed.

Once-Daily Feeding — The Dog Aging Project: An analysis of 24,000+ pet dogs found that dogs fed once daily were significantly healthier across every health category measured compared to dogs fed twice or more per day. Dogs fed once daily had lower odds of gastrointestinal disorders, dental disease, orthopedic disorders, kidney and urinary disorders, liver and pancreatic disorders, and cognitive dysfunction. The odds of poor health increased step-wise from once-daily to twice-daily to three-or-more meals per day.

Intermittent Fasting Metabolic Evidence: A clinical trial in Frontiers in Veterinary Science put healthy dogs through a 48-hour intermittent fasting protocol on a high-fat diet containing MCTs. Results showed significant reduction in blood glucose and insulin, induction of nutritional ketosis, lowest HOMA insulin resistance scores of any feeding regime tested, and immunological changes consistent with reduced inflammation.

Why Kibble Makes This Harder: Kibble is calorie-dense, highly palatable, and engineered for overconsumption. Feeding guidelines on kibble bags are almost always set too high. Dogs fed fresh, whole-food diets tend to naturally eat less because whole food has higher water content and produces stronger satiety signals per calorie.

What to Actually Do: Switch to once-daily feeding — the Dog Aging Project data is large enough that this alone is worth doing for any healthy adult dog. Puppies under 6 months still need multiple meals. Use body condition score, not the bag label — you should be able to feel your dog's ribs easily but not see them. Consider a 24-hour fast once a week — widely practiced in raw feeding communities, fresh water always available. Avoid free feeding — leaving food available all day keeps insulin elevated continuously. Talk to your vet before fasting a dog with existing health conditions.`,
  },
  {
    slug: 'tcvm-organ-meats-dogs',
    title: 'TCVM and the "Like Supports Like" Principle: Why Organ Meats Are the Most Targeted Food You Can Feed Your Dog',
    tag: 'Nutrition',
    content: `Traditional Chinese Veterinary Medicine has used organ meats as targeted, organ-specific medicine for over 3,000 years. The core principle: heart feeds heart, liver feeds liver, kidney supports kidney. Modern nutritional science is confirming why — because organ meats are among the most nutrient-dense foods on the planet, and they concentrate exactly the compounds the corresponding organ needs to function.

Heart — Feeds the Heart: Beef heart is one of the most taurine-rich foods in existence — approximately 1,100-1,400 mg of taurine per 100g, compared to roughly 50 mg in a typical chicken breast. Taurine deficiency is directly implicated in dilated cardiomyopathy (DCM) in dogs. The landmark study enrolled 24 Golden Retrievers with DCM; 23 of the 24 were eating grain-free or legume-heavy diets low in taurine-containing whole foods. After diet correction and taurine supplementation, most showed measurable echocardiographic improvement. Beef heart is also the richest whole-food source of CoQ10 and L-carnitine — the exact two compounds the heart uses to produce cellular energy. Heart is a muscle meat not a true organ, so there's no feeding cap. Can be fed as 5-10% of total diet. In TCVM, heart has a warming thermal nature and an affinity for the Heart and Shen (spirit and mind) — dogs with anxiety or restlessness are often given heart-based foods.

Liver — Feeds the Liver: Liver is the original superfood. Calorie for calorie, it has no rival in nutrient density. It is the body's primary storage depot for vitamin A, the most bioavailable source of heme iron, and contains active forms of B vitamins — B12, folate, riboflavin, and B6. Also provides glutathione precursors — cysteine, glycine, and glutamine — in highly bioavailable form. Glutathione is the liver's primary antioxidant defense system. Critical caveat on dosing: liver is extremely high in vitamin A, which is fat-soluble and accumulates. Vitamin A toxicity causes bone pain, progressive stiffness, and eventually irreversible skeletal deformities. Liver should represent no more than 5% of the total diet — approximately 1 oz per 20 lbs of body weight, fed 1-2 times per week maximum.

Kidney — Feeds the Kidneys: Kidney is one of the highest whole-food sources of selenium — a trace mineral essential for glutathione peroxidase activity, which is one of the kidney's primary antioxidant defenses. Kidney also provides extraordinary concentrations of vitamin B12, riboflavin, and zinc. In TCVM, kidney is the foundational organ of Jing — the constitutional energy a dog is born with and slowly expends. Kidney tonic foods are given to aging dogs, dogs with bone and joint issues, and dogs with hormonal imbalances. Feeding guideline: part of the secreting organ portion (10% total organs combined).

Lung — Feeds the Respiratory System and Skin: Lung tissue is rich in elastin — the elastic structural protein that allows expansion and recoil, also the primary structural protein in skin. Lung is also one of the richest food sources of Diamine Oxidase (DAO) — the enzyme responsible for breaking down histamine in the GI tract. Dogs with chronic itching, hives, or recurrent allergic skin reactions may have impaired histamine degradation. Freeze-dried lung is widely available as single-ingredient treats, ideal for allergy-prone dogs.

Brain — Feeds the Nervous System: Brain tissue is approximately 60% fat by dry weight, with a substantial portion being DHA — the omega-3 fatty acid that is the primary structural component of neuronal cell membranes. Brain also provides phosphatidylserine — a phospholipid that supports neuronal membrane fluidity and memory consolidation. Best fed raw or very lightly warmed. Small amounts, 1-2x per week.

The 10% Rule for Organ Meats: Total secreting organs (liver, kidney, spleen, pancreas combined) — 10% of the diet. Liver specifically — no more than 5% due to vitamin A toxicity risk. Heart — classified as muscle meat, not organ, so it can be 5-10% of the muscle meat portion without contributing to the organ cap. Even adding organ meats as toppers to a kibble-based diet meaningfully upgrades any meal — a tablespoon of raw chicken liver twice a week provides nutrient density that kibble cannot replicate.`,
  },
  {
    slug: 'turmeric-curcumin-dogs',
    title: 'Turmeric and Curcumin for Dogs: Anti-Inflammatory, Liver-Protective, and Backed by Real Studies',
    tag: 'Supplements',
    content: `Curcumin — the active polyphenol in turmeric — is one of the most studied natural compounds in both human and veterinary medicine. It has veterinary research that includes direct animal feeding trials, a 2025 head-to-head comparison against a pharmaceutical liver drug, and mechanisms documented down to the molecular pathway level. The challenge isn't whether it works — it's getting enough of it absorbed to make a difference.

How Curcumin Works: NF-κB inhibition — NF-κB is the primary master switch for chronic inflammation. Curcumin directly suppresses this pathway, blocking the downstream cascade of inflammatory cytokines (IL-1β, IL-6, TNF-α) that drive arthritis, allergies, skin disease, and organ inflammation. Nrf2 pathway activation — upregulates the body's own antioxidant enzyme systems including glutathione peroxidase and superoxide dismutase. AMPK activation — the same cellular energy sensor activated by exercise and caloric restriction. Reduces insulin resistance, promotes healthy fat metabolism, and inhibits abnormal cell proliferation. Inhibition of adipocyte differentiation — curcumin directly suppresses the transcription factors that drive stem cells to become fat cells — directly relevant to lipoma development. Phase II enzyme induction — curcumin upregulates the liver's detoxification pathways supporting the clearance of drug metabolites and environmental toxins.

The Bioavailability Problem — and How to Solve It: Standard turmeric powder has extremely poor bioavailability — the majority passes through without ever entering systemic circulation. Black pepper (piperine) is non-negotiable: combining curcumin with piperine increased serum curcumin levels by 2,000% in both humans and animals. Piperine inhibits intestinal and hepatic first-pass metabolism that normally degrades curcumin. Always use turmeric with black pepper. Without it, you're largely wasting the supplement. Fat is also required — curcumin is fat-soluble. Mix with coconut oil, olive oil, or a fat-containing meal. Phytosome form is the premium option — curcumin bound to phosphatidylcholine achieves far higher serum levels.

Liver Disease — Outperforming a Pharmaceutical Drug: A 2025 controlled clinical trial compared turmeric and pomegranate peel extract against a commercial hepatoprotective pharmaceutical in 30 dogs with corticosteroid-induced hepatopathy. The herbal group normalized liver enzymes (ALT, AST, ALP) faster than the pharmaceutical group and restored normal hepatic architecture on ultrasound sooner. Curcumin's liver mechanisms include direct NF-κB suppression in hepatocytes, Nrf2 activation, and scavenging of reactive oxygen species that cause hepatocellular damage. Important for dogs on long-term NSAIDs, phenobarbital, or other hepatotoxic medications.

Inflammation and Joint Disease: Several studies in dogs with osteoarthritis show curcumin-based supplementation reduces biomarkers of joint inflammation and improves functional mobility. The mechanism — NF-κB inhibition and prostaglandin E2 suppression — targets essentially the same inflammatory pathway as NSAIDs like carprofen and meloxicam, but without the hepatotoxic and gastric side effects. For dogs already on NSAIDs, curcumin can work synergistically — potentially allowing dose reduction over time.

Lipomas — Blocking Fat Cell Growth at the Source: Curcumin directly inhibits adipogenesis at the transcriptional level. In documented studies, curcumin suppressed lipid accumulation and inhibited PPARγ and C/EBPα, the key regulators of fat cell formation. It also suppresses angiogenesis — the formation of new blood vessels that supply growing fat deposits. A lipoma that cannot recruit a blood supply cannot expand. Combined with fish oil (which fixes the omega-6/omega-3 ratio) and medicinal mushrooms like reishi and maitake (which address insulin resistance), curcumin completes the core nutritional strategy for lipoma management.

Cancer — Complementary Support: Curcumin induces apoptosis in osteosarcoma, mast cell tumor, and lymphoma cell lines and inhibits the STAT3 and NF-κB signaling pathways that cancer cells depend on for survival. Several veterinary oncologists incorporate curcumin into complementary cancer protocols. It is not a cancer treatment and does not replace surgery, chemotherapy, or radiation — but the evidence for its role as an adjunctive agent is substantial.

Golden Paste — The Most Practical Delivery Method: Mix 1/2 cup turmeric powder with 1 cup water in a saucepan over medium-low heat, stirring until a thick paste forms (5-10 minutes). Add 1.5 tsp freshly ground black pepper and 1/4 cup coconut oil or olive oil. Cool completely. Keeps refrigerated up to 2 weeks or frozen for 3+ months. Starting dose: 1/8 tsp for small dogs under 20 lbs; 1/4 tsp for medium dogs 20-50 lbs; 1/2 tsp for large dogs 50-80 lbs; 1 tsp for giant breeds 80+ lbs. Always start at 1/4 of target dose and increase over 2-3 weeks — turmeric is a potent GI motility agent and causes loose stools if increased too quickly.

Drug Interactions: Use with caution alongside anticoagulants (mild platelet-inhibiting properties). Discuss with oncologist before adding during active cancer treatment. Monitor stools in dogs on NSAIDs (both inhibit prostaglandin synthesis). Monitor blood sugar in diabetic dogs (modest blood glucose-lowering effects). Time away from iron-containing meals if dog is anemic (curcumin chelates iron at high doses).`,
  },
]

async function embedText(text) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ model: 'voyage-3', input: text }),
  })
  const data = await res.json()
  if (!data.data?.[0]?.embedding) {
    throw new Error(`Voyage embedding failed: ${JSON.stringify(data)}`)
  }
  return data.data[0].embedding
}

async function getIndexHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: { 'Api-Key': PINECONE_API_KEY },
  })
  if (!res.ok) throw new Error(`Could not get index info: ${await res.text()}`)
  const data = await res.json()
  return data.host
}

async function main() {
  const newOnly = process.argv.includes('--new-only')
  const host = await getIndexHost()

  let existingIds = new Set()
  if (newOnly) {
    const listRes = await fetch(`https://${host}/vectors/list?prefix=fullblog-&limit=100`, {
      headers: { 'Api-Key': PINECONE_API_KEY },
    })
    if (listRes.ok) {
      const listData = await listRes.json()
      existingIds = new Set((listData.vectors || []).map(v => v.id))
    }
  }

  const toSeed = newOnly ? fullPosts.filter(p => !existingIds.has(`fullblog-${p.slug}`)) : fullPosts
  console.log(`🌲 Seeding ${toSeed.length} full blog posts into Pinecone index: ${PINECONE_INDEX}${newOnly ? ' (--new-only)' : ''}\n`)
  console.log(`📍 Index host: ${host}\n`)

  for (const post of toSeed) {
    const text = `${post.title}\n\nTopic: ${post.tag}\n\n${post.content}`
    console.log(`Embedding: fullblog-${post.slug}...`)
    const vector = await embedText(text)

    const res = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({
        vectors: [{
          id: `fullblog-${post.slug}`,
          values: vector,
          metadata: {
            text,
            title: post.title,
            slug: post.slug,
            tag: post.tag,
            source: 'blog-full',
            url: `https://commonsensedog.com/blog/${post.slug}`,
          },
        }],
      }),
    })

    if (!res.ok) {
      console.error(`  ❌ Failed: ${await res.text()}`)
    } else {
      console.log(`  ✅ Done`)
    }

    if (toSeed.indexOf(post) < toSeed.length - 1) {
      process.stdout.write('  ⏳ Waiting 22s for rate limit...')
      await new Promise(r => setTimeout(r, 22000))
      process.stdout.write(' done\n')
    }
  }

  console.log('\n🎉 Seeding complete!')
}

export { fullPosts }

// Only run when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
}
