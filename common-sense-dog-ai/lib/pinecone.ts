import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const index = pc.index(process.env.PINECONE_INDEX || 'dog-knowledge-database')

// Voyage AI embeddings — 768 dimensions to match the Pinecone index
// Free tier: 50M tokens/month at voyageai.com
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Embed with retry on 429.
 *
 * Without this, a rate-limited embedding throws, searchKnowledgeScored swallows it
 * and returns [], and the assistant quietly answers from general AI knowledge with
 * NO curated research behind it — no error, nothing in the UI, indistinguishable
 * from a normal answer. On the current Voyage plan (3 requests/minute) that
 * happens whenever two people ask a question in the same minute.
 *
 * Retrying trades a couple of seconds of latency for keeping the knowledge base in
 * play. It's a mitigation, not a cure: the real fix is putting the payment method
 * on the organisation that owns the API key.
 */
async function embedText(text: string, attempt = 0): Promise<number[]> {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'voyage-3',
      input: text,
    }),
  })

  if (res.status === 429 && attempt < 3) {
    await sleep(2500 * (attempt + 1)) // 2.5s, 5s, 7.5s
    return embedText(text, attempt + 1)
  }

  const data = await res.json()
  if (!data.data?.[0]?.embedding) {
    throw new Error(`Voyage embedding failed: ${JSON.stringify(data)}`)
  }
  return data.data[0].embedding
}

export async function upsertKnowledge(
  id: string,
  text: string,
  metadata: Record<string, string> = {}
) {
  const values = await embedText(text)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (index as any).upsert([{ id, values, metadata: { text, ...metadata } }])
}

export async function searchKnowledge(query: string, topK = 5): Promise<string[]> {
  if (!process.env.VOYAGE_API_KEY) return []
  try {
    const values = await embedText(query)
    const results = await index.query({ vector: values, topK, includeMetadata: true })
    return results.matches
      .filter(m => (m.score ?? 0) > 0.5)
      .map(m => (m.metadata as { text: string }).text)
  } catch {
    return []
  }
}

export type ScoredChunk = { text: string; score: number }

// Pinecone-first retrieval: returns matches WITH their confidence scores so the
// caller can decide whether the knowledge base answers the question (priority)
// or whether to fall back to the model's general knowledge.
/**
 * `minScore` is caller-tunable because query LENGTH shifts the score range: a full
 * owner question ("is menadione safe in dog food?") scores well above a bare
 * ingredient name, even on the identical passage. A fixed 0.5 floor silently
 * returned nothing for short lookups, so callers doing ingredient-style queries
 * pass a lower floor.
 */
export async function searchKnowledgeScored(
  query: string,
  topK = 8,
  minScore = 0.5,
): Promise<ScoredChunk[]> {
  if (!process.env.VOYAGE_API_KEY) return []
  try {
    const values = await embedText(query)
    const results = await index.query({ vector: values, topK, includeMetadata: true })
    return results.matches
      .map(m => ({ text: (m.metadata as { text: string })?.text ?? '', score: m.score ?? 0 }))
      .filter(c => c.text && c.score > minScore)
      .sort((a, b) => b.score - a.score)
  } catch {
    return []
  }
}
