/**
 * process_blogs.mjs
 * Generates 60+ Q&A pairs for every blog post and upserts them to Pinecone.
 *
 * Usage:
 *   node scripts/process_blogs.mjs
 *
 * Requires ANTHROPIC_KEY, PINECONE_API_KEY, PINECONE_INDEX, VOYAGE_API_KEY in .env.local
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fullPosts } from './seed-blog-content.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

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
  console.error('Missing required API keys in .env.local')
  process.exit(1)
}

async function generateQA(title, tag, content, attempt = 1) {
  const targetPairs = attempt === 1 ? 50 : 30  // reduce on retry to avoid truncation

  const prompt = `You are a dog nutrition expert building a knowledge base for an AI assistant on commonsensedog.com.

Read the following blog post and generate ${targetPairs} question and answer pairs that a dog owner would realistically ask. Write questions naturally and conversationally.

Rules:
- Questions must be natural and conversational
- Answers must be complete and helpful (at least 2 sentences)
- Cover key topics, facts, ingredients, doses, and recommendations
- Add a short topic tag for each pair (e.g. "Supplements", "Dosing", "Cancer")
- Do not duplicate questions
- IMPORTANT: Return ONLY a complete, valid JSON array. Do not truncate.

Respond with ONLY a valid JSON array:
[{"question":"...","answer":"...","topic":"..."}]

Blog post: ${title} (${tag})

Content:
---
${content.slice(0, 6000)}
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
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API error: ${await res.text()}`)
  const data = await res.json()
  const raw = data.content[0].text.trim()
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    if (attempt < 3) {
      console.log(`  ⚠️ Invalid JSON, retrying (attempt ${attempt + 1})...`)
      await new Promise(r => setTimeout(r, 5000))
      return generateQA(title, tag, content, attempt + 1)
    }
    throw new Error('Claude did not return valid JSON after 3 attempts')
  }
  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    // Try to recover partial JSON by trimming after last complete object
    const trimmed = jsonMatch[0].replace(/,?\s*\{[^}]*$/, ']')
    return JSON.parse(trimmed)
  }
}

function qualityCheck(pairs) {
  const seen = new Set()
  return pairs.filter(p => {
    if (!p.question || !p.answer) return false
    if (p.question.length < 10 || p.answer.length < 40) return false
    const key = p.question.toLowerCase().replace(/[^a-z0-9\s]/g, '').slice(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function embedBatch(texts) {
  const BATCH_SIZE = 50
  const allEmbeddings = []
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const res = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${VOYAGE_API_KEY}` },
      body: JSON.stringify({ model: 'voyage-3', input: batch }),
    })
    if (!res.ok) throw new Error(`Voyage error: ${await res.text()}`)
    const data = await res.json()
    allEmbeddings.push(...data.data.map(d => d.embedding))
    if (i + BATCH_SIZE < texts.length) {
      process.stdout.write('  ⏳ Waiting 22s...')
      await new Promise(r => setTimeout(r, 22000))
      process.stdout.write(' done\n')
    }
  }
  return allEmbeddings
}

async function getIndexHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: { 'Api-Key': PINECONE_API_KEY },
  })
  if (!res.ok) throw new Error(`Pinecone index error: ${await res.text()}`)
  return (await res.json()).host
}

async function upsertToPinecone(host, vectors) {
  const BATCH_SIZE = 100
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE)
    const res = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': PINECONE_API_KEY },
      body: JSON.stringify({ vectors: batch }),
    })
    if (!res.ok) console.error(`  ❌ Upsert failed: ${await res.text()}`)
    else console.log(`  ✅ Upserted ${batch.length} vectors`)
  }
}

async function main() {
  const skipDone = process.argv.includes('--skip-done')
  console.log(`\n🐾 Processing ${fullPosts.length} blog posts into Q&A pairs\n`)
  const host = await getIndexHost()

  // Fetch already-completed post slugs if --skip-done
  let doneslugs = new Set()
  if (skipDone) {
    const listRes = await fetch(`https://${host}/vectors/list?prefix=qa-blog-&limit=100`, {
      headers: { 'Api-Key': PINECONE_API_KEY },
    })
    if (listRes.ok) {
      const listData = await listRes.json()
      for (const v of (listData.vectors || [])) {
        const slug = v.id.replace('qa-blog-', '').replace(/-\d+$/, '')
        doneslugs.add(slug)
      }
    }
    console.log(`  Skipping already-done: ${[...doneslugs].join(', ') || 'none'}\n`)
  }

  let totalLoaded = 0
  let failed = []

  for (const post of fullPosts) {
    if (doneslugs.has(post.slug)) {
      console.log(`  ⏭️  Skipping ${post.slug} (already done)`)
      continue
    }

    console.log(`\n📝 ${post.title}`)

    try {
      const rawPairs = await generateQA(post.title, post.tag, post.content)
      const pairs = qualityCheck(rawPairs)
      console.log(`  Generated ${pairs.length} Q&A pairs`)

      const texts = pairs.map(p => `Q: ${p.question}\nA: ${p.answer}`)
      const embeddings = await embedBatch(texts)

      const vectors = pairs.map((pair, i) => ({
        id: `qa-blog-${post.slug}-${i}`,
        values: embeddings[i],
        metadata: {
          text: texts[i],
          question: pair.question,
          answer: pair.answer,
          topic: pair.topic || post.tag,
          source: `blog-${post.slug}`,
          source_type: 'qa-blog',
          url: `https://commonsensedog.com/blog/${post.slug}`,
        },
      }))

      await upsertToPinecone(host, vectors)
      totalLoaded += pairs.length
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`)
      failed.push(post.slug)
    }

    if (fullPosts.indexOf(post) < fullPosts.length - 1) {
      process.stdout.write('  ⏳ Waiting 22s before next post...')
      await new Promise(r => setTimeout(r, 22000))
      process.stdout.write(' done\n')
    }
  }

  console.log(`\n🎉 Done! Loaded ${totalLoaded} Q&A pairs.`)
  if (failed.length) console.log(`  ❌ Failed posts: ${failed.join(', ')}`)
  console.log()
}

main().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
