/**
 * seed-pinecone.mjs
 * Seeds all blog posts from lib/blog-data.ts into Pinecone.
 *
 * Usage:
 *   node scripts/seed-pinecone.mjs
 *
 * Requires PINECONE_API_KEY, PINECONE_INDEX, and GEMINI_KEY in .env.local
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
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'dog-knowledge-database'
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY

if (!PINECONE_API_KEY || !VOYAGE_API_KEY) {
  console.error('Missing PINECONE_API_KEY or VOYAGE_API_KEY in .env.local')
  process.exit(1)
}

// ---- Inline blog posts (matches lib/blog-data.ts slugs) ----
// We strip HTML tags to get clean text for embedding
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Import blog post slugs + text using dynamic import workaround (TS → need tsx or manual)
// Instead we re-declare the minimal data needed for seeding as plain JS objects
const posts = [
  {
    slug: 'medicinal-mushrooms-for-dogs',
    title: 'Medicinal Mushrooms for Dogs: The Evidence, the Best Types, and What Actually Works',
    tag: 'Supplements',
    summary: 'Turkey tail, reishi, lion\'s mane, chaga, cordyceps, and shiitake mushrooms for dogs. Clinical evidence, dosing, and what actually works based on real studies including University of Pennsylvania clinical trials showing survival benefits in dogs with hemangiosarcoma.',
  },
  {
    slug: 'lipomas-in-dogs',
    title: 'Lipomas in Dogs: What They Are, Why They Form, and Natural Management',
    tag: 'Health',
    summary: 'Lipomas (fatty tumors) in dogs are linked to diet, toxin accumulation, and chronic inflammation. Natural management through anti-inflammatory diet, omega-3s, reishi, turmeric, and reducing synthetic additives. How to distinguish benign lipomas from infiltrative or cancerous masses.',
  },
  {
    slug: 'fish-oil-omega3-dogs',
    title: 'Fish Oil and Omega-3s for Dogs: What the Research Actually Shows',
    tag: 'Nutrition',
    summary: 'EPA and DHA omega-3 fatty acids from fish oil reduce inflammation, support skin and coat, heart health, joint function, cognitive function, and kidney health in dogs. Proper dosing, sourcing (triglyceride vs ethyl ester form), and how to avoid rancid fish oil.',
  },
  {
    slug: 'heart-health-dogs',
    title: 'Heart Health in Dogs: Nutrition, Supplements, and What to Watch For',
    tag: 'Health',
    summary: 'Canine dilated cardiomyopathy (DCM), taurine deficiency, CoQ10, omega-3s, hawthorn berry for dogs. The grain-free diet and heart disease debate, taurine biosynthesis, breeds at risk, and a complete heart-support protocol for prevention and management.',
  },
  {
    slug: 'liver-support-dogs',
    title: 'Liver Support for Dogs: Diet, Supplements, and Natural Detox Protocols',
    tag: 'Health',
    summary: 'Milk thistle (silymarin), SAMe, dandelion root, and diet for liver support in dogs. Monthly flea/tick preventatives, vaccines, and medications burden the liver. How to support liver health through whole food diet, rotating proteins, liver-friendly supplements, and reducing chemical load.',
  },
  {
    slug: 'probiotics-enzymes-dogs',
    title: 'Probiotics and Digestive Enzymes for Dogs: A Complete Guide',
    tag: 'Gut Health',
    summary: 'Digestive enzymes and probiotics for dogs — which strains matter, what doses work, fermented foods vs capsules, soil-based organisms, and how to rebuild gut health after antibiotics or chronic kibble feeding. Leaky gut, yeast overgrowth, and the gut-immune connection in dogs.',
  },
  {
    slug: 'intermittent-fasting-dogs',
    title: 'Intermittent Fasting for Dogs: The Ancestral Feeding Pattern and What It Does',
    tag: 'Nutrition',
    summary: 'Dogs evolved as feast-famine animals. Intermittent fasting for dogs triggers autophagy, reduces inflammation, improves insulin sensitivity, supports weight management, and may extend lifespan. How to implement a fasting protocol, which dogs should not fast, and meal timing strategies.',
  },
]

// ---- Embed + upsert ----

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

async function upsert(id, vector, metadata) {
  const res = await fetch(
    `https://api.pinecone.io/vectors/upsert`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({ vectors: [{ id, values: vector, metadata }] }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Pinecone upsert failed: ${err}`)
  }
  return res.json()
}

// Get the index host from Pinecone
async function getIndexHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: { 'Api-Key': PINECONE_API_KEY },
  })
  if (!res.ok) throw new Error(`Could not get index info: ${await res.text()}`)
  const data = await res.json()
  return data.host
}

async function main() {
  console.log(`🌲 Seeding ${posts.length} blog posts into Pinecone index: ${PINECONE_INDEX}\n`)

  const host = await getIndexHost()
  console.log(`📍 Index host: ${host}\n`)

  for (const post of posts) {
    const text = `${post.title}\n\nTopic: ${post.tag}\n\n${post.summary}`
    console.log(`Embedding: ${post.slug}...`)
    const vector = await embedText(text)

    const res = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({
        vectors: [{
          id: `blog-${post.slug}`,
          values: vector,
          metadata: {
            text,
            title: post.title,
            slug: post.slug,
            tag: post.tag,
            source: 'blog',
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

    // 22-second delay to respect 3 RPM rate limit on free tier
    if (posts.indexOf(post) < posts.length - 1) {
      process.stdout.write('  ⏳ Waiting 22s for rate limit...')
      await new Promise(r => setTimeout(r, 22000))
      process.stdout.write(' done\n')
    }
  }

  console.log('\n🎉 Seeding complete!')
}

main().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
