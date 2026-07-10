/**
 * add-new-posts.mjs
 * Adds the 2 new blog posts (TCVM organ meats + turmeric/curcumin) to Pinecone.
 * Run: node scripts/add-new-posts.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Load .env.local
const envFile = readFileSync(resolve(root, '.env.local'), 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX   = process.env.PINECONE_INDEX || 'dog-knowledge-database'
const VOYAGE_API_KEY   = process.env.VOYAGE_API_KEY

if (!PINECONE_API_KEY || !VOYAGE_API_KEY) {
  console.error('❌ Missing PINECONE_API_KEY or VOYAGE_API_KEY in .env.local')
  process.exit(1)
}

const posts = [
  {
    id: 'blog-tcvm-organ-meats-dogs',
    slug: 'tcvm-organ-meats-dogs',
    title: 'TCVM and the "Like Supports Like" Principle: Why Organ Meats Are the Most Targeted Food You Can Feed Your Dog',
    tag: 'Nutrition',
    text: `Traditional Chinese Veterinary Medicine has used organ meats as targeted, organ-specific medicine for over 3,000 years. The core principle: heart feeds heart, liver feeds liver, kidney supports kidney. Modern nutritional science confirms why.

HEART feeds the HEART: Beef heart contains 1,100–1,400 mg taurine per 100g — the richest whole-food source of CoQ10 and L-carnitine. Taurine deficiency directly causes dilated cardiomyopathy (DCM). The landmark Golden Retriever DCM study showed 23 of 24 DCM dogs were on grain-free diets low in taurine; after taurine supplementation most showed echocardiographic improvement. L-carnitine deficiency caused DCM in Boxers which resolved with carnitine supplementation and recurred when withdrawn. CoQ10 is measurably depleted in dog hearts with congestive heart failure. TCVM: warming nature, Heart and Shen (spirit/mind) affinity. Good for dogs with anxiety or poor sleep. Feed 5–10% of diet; counts as muscle meat not organ.

LIVER feeds the LIVER: Richest source of bioavailable vitamin A, heme iron, and active B vitamins (B12, folate, riboflavin, B6) used directly without conversion. Copper and B12 are essential cofactors for liver cell regeneration. Liver provides glutathione precursors (cysteine, glycine, glutamine). ACVIM consensus lists nutritional support including B vitamins and antioxidants as key for managing liver disease. TCVM: slightly warming to neutral, nourishes Blood deficiency; good for anemic or lethargic dogs. Critical: no more than 5% of diet — vitamin A toxicity risk. Feed 1–2x per week maximum.

KIDNEY feeds the KIDNEYS: One of the highest whole-food sources of selenium — essential for glutathione peroxidase activity, the kidney's primary antioxidant defense against oxidative tubular damage. Often higher in B12 than liver gram-for-gram. Provides riboflavin and zinc for kidney cell function and DNA repair. Contains organ-specific growth factors and structural proteins that mirror the metabolic needs of kidney tissue. TCVM: governs Jing (constitutional essence), bone, and aging-related decline. Indicated for aging dogs, dogs with bone/joint issues, hormonal imbalances. Feed as part of 10% total organ allocation.

LUNG feeds respiratory system and skin: Rich in elastin — structural protein enabling lung expansion and providing skin elasticity. One of the richest food sources of Diamine Oxidase (DAO), the enzyme that breaks down histamine in the gut. Dogs with chronic itching, hives, ear infections, or allergic skin reactions may have impaired histamine metabolism; DAO-rich lung foods directly support this pathway. TCVM: governs Wei Qi (defensive energy at body's surface, equivalent to mucosal immune function). Indicated for dogs with allergies, skin conditions, respiratory issues. Feed 5% of diet or as freeze-dried single-ingredient treats.

BRAIN feeds the nervous system: Approximately 60% fat by dry weight, rich in DHA in its most bioavailable phospholipid-bound form — matching the nervous system's own molecular structure. Provides phosphatidylserine for neuronal membrane fluidity, memory consolidation, and synaptic signaling. Studies show phosphatidylserine supplementation improves cognitive function in dogs with cognitive dysfunction syndrome (canine dementia). TCVM: falls under Kidney system (Kidney governs marrow and brain). Best for senior dogs showing cognitive decline, neurological issues, or puppies during peak brain development. Feed small amounts 1–2x per week; lamb and beef brain most common.

TCVM thermal energetics: Warming foods (venison, lamb, chicken, beef, ginger) for cold-intolerant dogs, low energy, slow metabolism, stiff joints in cold weather. Cooling foods (duck, rabbit, fish, turkey, pork) for dogs with chronic inflammation, allergies, hot spots, restlessness, panting, seeks cool surfaces. Neutral foods (beef, pork, eggs, vegetables) appropriate for most dogs.

NRC 10% organ rule: Total secreting organs maximum 10% of diet combined. Liver specifically no more than 5% — vitamin A toxicity above this. Heart classified as muscle meat, not organ. Introduce slowly for sensitive dogs. Commercial "by-products" and "meat by-products" are rendered and heat-processed — the bioavailable enzymes, structural proteins, and heat-sensitive vitamins in fresh organ meat are destroyed in rendering. They are not equivalent to fresh organ meat.`,
  },
  {
    id: 'blog-turmeric-curcumin-dogs',
    slug: 'turmeric-curcumin-dogs',
    title: 'Turmeric and Curcumin for Dogs: Anti-Inflammatory, Liver-Protective, and Backed by Real Studies',
    tag: 'Supplements',
    text: `Curcumin — the active polyphenol in turmeric — is one of the most studied natural compounds in veterinary medicine. Clinical trials show documented effects on liver disease, joint inflammation, lipoma formation, and cancer in dogs.

How curcumin works — mechanisms: NF-κB inhibition (blocks inflammatory cytokines IL-1β, IL-6, TNF-α driving arthritis, allergies, skin disease, organ inflammation). Nrf2 pathway activation (upregulates body's own antioxidant enzymes including glutathione peroxidase and superoxide dismutase). AMPK activation (same pathway as exercise and caloric restriction; reduces insulin resistance, promotes healthy fat metabolism). Inhibition of adipocyte differentiation — curcumin suppresses PPARγ and C/EBPα transcription factors that drive stem cells to become fat cells, directly relevant to lipoma formation. Phase II enzyme induction (supports liver detoxification — CYP enzymes, glucuronidation, sulfation).

Bioavailability problem and solutions: Standard turmeric powder has extremely poor absorption — most passes through without entering circulation. Solutions: (1) Black pepper/piperine — landmark pharmacokinetic study showed piperine increased serum curcumin levels by 2,000% by inhibiting intestinal and hepatic first-pass metabolism. Always combine turmeric with black pepper. (2) Fat — curcumin is fat-soluble; mix with coconut oil or olive oil. (3) Phytosome form — curcumin bound to phosphatidylcholine achieves far higher serum levels than standard extract; used in clinical veterinary trials.

Liver disease — 2025 clinical trial: Turmeric + pomegranate peel extract vs. Silybin-Phosphatidylcholine pharmaceutical drug in 30 dogs with corticosteroid-induced hepatopathy. The herbal turmeric group normalized liver enzymes (ALT, AST, ALP) faster than the pharmaceutical group and restored normal hepatic architecture on ultrasound sooner. Study published 2025. Curcumin mechanisms: NF-κB suppression in hepatocytes, Nrf2 activation upregulating liver's antioxidant defenses, scavenging reactive oxygen species causing hepatocellular damage.

Joint disease and osteoarthritis: Multiple studies show curcumin reduces biomarkers of joint inflammation and improves mobility scores in dogs with osteoarthritis. NF-κB inhibition and prostaglandin E2 suppression target the same inflammatory pathway as NSAIDs (carprofen, meloxicam) without hepatotoxic and gastric side effects of long-term NSAID use. Can work synergistically with NSAIDs, potentially allowing dose reduction.

Lipomas — blocking fat cell growth: Curcumin directly inhibits adipogenesis by suppressing PPARγ and C/EBPα transcription factors that regulate fat cell formation. Also suppresses angiogenesis — the new blood vessel formation that supplies growing fat deposits. A lipoma without blood supply cannot expand. Works best combined with fish oil (fixes omega ratio) and medicinal mushrooms like reishi and maitake.

Cancer — complementary support: Curcumin induces apoptosis (programmed cell death) in osteosarcoma, mast cell tumor, and lymphoma cell lines in vitro. Inhibits STAT3 and NF-κB signaling pathways cancer cells use for survival and proliferation. Used by veterinary oncologists as adjunctive agent; does not replace surgery, chemotherapy, or radiation.

Golden Paste recipe for dogs: ½ cup turmeric powder, 1 cup filtered water, 1½ tsp freshly ground black pepper, ¼ cup coconut oil or olive oil. Cook turmeric with water on medium-low heat stirring until paste forms (5–10 min). Add pepper and oil. Refrigerate up to 2 weeks or freeze in ice cube trays. Starting doses: ⅛ tsp for small dogs under 20 lbs; ¼ tsp for medium dogs 20–50 lbs; ½ tsp for large dogs 50–80 lbs; 1 tsp for giant breeds 80+ lbs. Always start at ¼ of target dose and increase over 2–3 weeks to avoid loose stools.

Drug interactions: Anticoagulants — mild platelet inhibition, caution with warfarin. Chemotherapy — affects CYP enzyme activity, discuss with oncologist during active treatment. NSAIDs — combination can increase GI effects in sensitive dogs. Diabetes medications — modest blood glucose-lowering effect, monitor blood sugar. Iron absorption — chelates iron at high doses; time away from iron-containing meals for anemic dogs.

Signs a dog may benefit: Chronic joint stiffness, limping, difficulty rising. Lipomas that appeared or are growing. Elevated liver enzymes (ALT, AST, ALP) on bloodwork. Chronic skin inflammation, hot spots, atopic dermatitis. Dogs on long-term NSAIDs, phenobarbital, or hepatotoxic medications. Senior dogs with any chronic inflammatory condition.`,
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
  if (!data.data?.[0]?.embedding) throw new Error(`Voyage embedding failed: ${JSON.stringify(data)}`)
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

async function upsert(host, post) {
  const fullText = `${post.title}\n\nTopic: ${post.tag}\n\n${post.text}`
  const vector = await embedText(fullText)

  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Api-Key': PINECONE_API_KEY },
    body: JSON.stringify({
      vectors: [{
        id: post.id,
        values: vector,
        metadata: {
          text: fullText,
          title: post.title,
          slug: post.slug,
          tag: post.tag,
          source: 'blog',
          url: `https://commonsensedog.com/blog/${post.slug}`,
        },
      }],
    }),
  })

  if (!res.ok) throw new Error(`Upsert failed: ${await res.text()}`)
  return true
}

async function main() {
  console.log('🌲 Getting Pinecone index host...')
  const host = await getIndexHost()
  console.log(`   Host: ${host}\n`)

  for (const post of posts) {
    console.log(`📌 Upserting: "${post.title}"`)
    console.log(`   ID: ${post.id}`)
    await upsert(host, post)
    console.log(`   ✅ Done\n`)
  }

  console.log('✅ Both posts added to Pinecone successfully!')
}

main().catch(e => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
