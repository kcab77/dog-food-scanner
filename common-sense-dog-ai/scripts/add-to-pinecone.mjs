/**
 * add-to-pinecone.mjs
 * Adds a single piece of content to the Pinecone knowledge base.
 *
 * Usage:
 *   node scripts/add-to-pinecone.mjs --id "blog-my-new-post" --title "My Post Title" --text "Full content here..." --tag "Supplements"
 *
 * Or pipe from stdin:
 *   echo "content here" | node scripts/add-to-pinecone.mjs --id "my-id" --title "My Title"
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
  console.error('❌ Missing PINECONE_API_KEY or VOYAGE_API_KEY in .env.local')
  process.exit(1)
}

// Parse args: --key value pairs
const args = process.argv.slice(2)
const parsed = {}
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    parsed[args[i].slice(2)] = args[i + 1]
    i++
  }
}

const id = parsed.id
const title = parsed.title
const text = parsed.text || title
const tag = parsed.tag || 'General'
const slug = parsed.slug || id

if (!id || !title) {
  console.error('Usage: node add-to-pinecone.mjs --id "blog-my-post" --title "My Post Title" --text "Content..." --tag "Supplements" --slug "my-post"')
  process.exit(1)
}

async function embedText(text) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ model: 'voyage-3-lite', input: text }),
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

async function main() {
  const fullText = `${title}\n\nTopic: ${tag}\n\n${text}`

  console.log(`🌲 Adding to Pinecone: "${title}"`)
  console.log(`   ID: ${id} | Tag: ${tag}`)

  const host = await getIndexHost()
  const vector = await embedText(fullText)

  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': PINECONE_API_KEY,
    },
    body: JSON.stringify({
      vectors: [{
        id,
        values: vector,
        metadata: {
          text: fullText,
          title,
          slug: slug || id,
          tag,
          source: 'blog',
          url: `https://commonsensedog.com/blog/${slug || id.replace('blog-', '')}`,
        },
      }],
    }),
  })

  if (!res.ok) {
    console.error(`❌ Failed: ${await res.text()}`)
    process.exit(1)
  }

  console.log(`✅ Added successfully!`)
  console.log(`\nNext steps:`)
  console.log(`  1. Add the post to common-sense-dog-ai/lib/blog-data.ts`)
  console.log(`  2. Deploy to Vercel (git push)`)
}

main().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
