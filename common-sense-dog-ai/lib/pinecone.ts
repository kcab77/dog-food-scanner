import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const index = pc.index(process.env.PINECONE_INDEX || 'dog-knowledge-database')

// Voyage AI embeddings — 768 dimensions to match the Pinecone index
// Free tier: 50M tokens/month at voyageai.com
async function embedText(text: string): Promise<number[]> {
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
export async function searchKnowledgeScored(query: string, topK = 8): Promise<ScoredChunk[]> {
  if (!process.env.VOYAGE_API_KEY) return []
  try {
    const values = await embedText(query)
    const results = await index.query({ vector: values, topK, includeMetadata: true })
    return results.matches
      .map(m => ({ text: (m.metadata as { text: string })?.text ?? '', score: m.score ?? 0 }))
      .filter(c => c.text && c.score > 0.5)
      .sort((a, b) => b.score - a.score)
  } catch {
    return []
  }
}
