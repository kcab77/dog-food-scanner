/**
 * process_content.mjs
 * Reads any file, uses Claude to generate Q&A pairs, embeds them, and upserts to Pinecone.
 *
 * Usage:
 *   node scripts/process_content.mjs <path-to-file>
 *
 * Requires ANTHROPIC_KEY, PINECONE_API_KEY, PINECONE_INDEX, VOYAGE_API_KEY in .env.local
 */

import { readFileSync } from 'fs'
import { resolve, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Load .env.local
const envFile = readFileSync(resolve(root, '.env.local'), 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY
const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'dog-knowledge-database'
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY

if (!ANTHROPIC_KEY || !PINECONE_API_KEY || !VOYAGE_API_KEY) {
  console.error('Missing required API keys in .env.local (ANTHROPIC_KEY, PINECONE_API_KEY, VOYAGE_API_KEY)')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/process_content.mjs <path-to-file>')
  process.exit(1)
}

const absolutePath = resolve(filePath)
const content = readFileSync(absolutePath, 'utf-8')
const sourceFile = basename(absolutePath)
const sourceName = basename(absolutePath, extname(absolutePath))

// ---- Generate Q&A pairs via Claude ----

async function generateQA(content) {
  console.log('🧠 Generating Q&A pairs via Claude...')

  const prompt = `You are a dog nutrition expert building a knowledge base for an AI assistant on a website called Common Sense Dog (commonsensedog.com), built by PawGrade.

Read the following content and generate at least 50 question and answer pairs that a dog owner would realistically ask. Write questions naturally and conversationally — the way a worried or curious dog owner would actually phrase them.

Rules:
- Questions must be natural and conversational (e.g. "Is copper sulfate bad for my dog?" not "What are the properties of copper sulfate?")
- Answers must be complete, helpful, and at least 2 sentences
- Cover every major topic, fact, and recommendation in the content
- Include questions about specific ingredients, products, dosing, breeds, symptoms, and comparisons
- Add a short topic tag for each pair (e.g. "Organs", "Vitamins", "Processing Methods", "Lipomas", "Supplements")
- Do not duplicate questions
- Generate as many as the content supports — aim for 50-80

Respond with ONLY a valid JSON array, no other text:
[
  {
    "question": "...",
    "answer": "...",
    "topic": "..."
  }
]

Content to process:
---
${content}
---`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    throw new Error(`Claude API error: ${await res.text()}`)
  }

  const data = await res.json()
  const raw = data.content[0].text.trim()

  // Extract JSON array from response
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Claude did not return a valid JSON array')

  return JSON.parse(jsonMatch[0])
}

// ---- Quality check ----

function qualityCheck(pairs) {
  const seen = new Set()
  const valid = []

  for (const pair of pairs) {
    if (!pair.question || !pair.answer) continue
    if (pair.question.length < 10) continue
    if (pair.answer.length < 40) continue

    // Deduplicate by normalized question
    const normalized = pair.question.toLowerCase().replace(/[^a-z0-9\s]/g, '').slice(0, 60)
    if (seen.has(normalized)) continue
    seen.add(normalized)

    valid.push(pair)
  }

  return valid
}

// ---- Batch embed via Voyage AI ----

async function embedBatch(texts) {
  console.log(`📐 Embedding ${texts.length} Q&A pairs via Voyage AI...`)

  const BATCH_SIZE = 50
  const allEmbeddings = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)

    const res = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({ model: 'voyage-3', input: batch }),
    })

    if (!res.ok) throw new Error(`Voyage embedding failed: ${await res.text()}`)
    const data = await res.json()
    allEmbeddings.push(...data.data.map(d => d.embedding))

    if (i + BATCH_SIZE < texts.length) {
      process.stdout.write('  ⏳ Waiting 22s for rate limit...')
      await new Promise(r => setTimeout(r, 22000))
      process.stdout.write(' done\n')
    }
  }

  return allEmbeddings
}

// ---- Get Pinecone index host ----

async function getIndexHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: { 'Api-Key': PINECONE_API_KEY },
  })
  if (!res.ok) throw new Error(`Could not get Pinecone index info: ${await res.text()}`)
  const data = await res.json()
  return data.host
}

// ---- Upsert to Pinecone in batches of 100 ----

async function upsertToPinecone(host, vectors) {
  console.log(`📌 Upserting ${vectors.length} vectors to Pinecone...`)

  const BATCH_SIZE = 100
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE)

    const res = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({ vectors: batch }),
    })

    if (!res.ok) {
      console.error(`  ❌ Upsert batch ${i}-${i + batch.length} failed: ${await res.text()}`)
    } else {
      console.log(`  ✅ Upserted ${batch.length} vectors`)
    }
  }
}

// ---- Main ----

async function main() {
  console.log(`\n📄 Processing: ${sourceFile}\n`)

  // 1. Generate Q&A pairs
  const rawPairs = await generateQA(content)
  console.log(`  Generated ${rawPairs.length} raw Q&A pairs`)

  // 2. Quality check
  const pairs = qualityCheck(rawPairs)
  console.log(`  ${pairs.length} pairs passed quality check\n`)

  if (pairs.length === 0) {
    console.error('No valid Q&A pairs generated. Exiting.')
    process.exit(1)
  }

  // 3. Embed all pairs
  const texts = pairs.map(p => `Q: ${p.question}\nA: ${p.answer}`)
  const embeddings = await embedBatch(texts)

  // 4. Build Pinecone vectors
  const host = await getIndexHost()
  const vectors = pairs.map((pair, i) => ({
    id: `qa-${sourceName}-${i}`,
    values: embeddings[i],
    metadata: {
      text: texts[i],
      question: pair.question,
      answer: pair.answer,
      topic: pair.topic || 'General',
      source: sourceFile,
      source_type: 'qa',
    },
  }))

  // 5. Upsert to Pinecone
  await upsertToPinecone(host, vectors)

  console.log(`\n🎉 Done! Loaded ${pairs.length} Q&A pairs from ${sourceFile} into Pinecone.\n`)
}

main().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
