import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const index = pc.index(process.env.PINECONE_INDEX || 'dog-knowledge-database')

// Voyage AI embeddings — 1024 dimensions to match the Pinecone index
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

// A single retrieved knowledge item. `tier`/`source`/`category` come from the
// vector's metadata so the assistant can label/caveat claims by evidence
// strength and cite the source. They're optional because legacy vectors seeded
// before the evidence-tagging system won't have them.
export type KnowledgeResult = {
  text: string
  tier?: string // "Strong" | "Moderate" | "Weak-Anecdotal" (undefined for legacy entries)
  source?: string
  category?: string
}

// Shape of the metadata we read off each Pinecone match.
type ChunkMetadata = {
  text?: string
  tier?: string
  source?: string
  category?: string
}

// Pull the fields we care about off a match's metadata into a KnowledgeResult.
function toKnowledgeResult(metadata: ChunkMetadata | undefined): KnowledgeResult {
  const md = metadata ?? {}
  return { text: md.text ?? '', tier: md.tier, source: md.source, category: md.category }
}

export async function searchKnowledge(query: string, topK = 5): Promise<KnowledgeResult[]> {
  if (!process.env.VOYAGE_API_KEY) return []
  try {
    const values = await embedText(query)
    const results = await index.query({ vector: values, topK, includeMetadata: true })
    return results.matches
      .filter(m => (m.score ?? 0) > 0.5)
      .map(m => toKnowledgeResult(m.metadata as ChunkMetadata))
      .filter(c => c.text)
  } catch {
    return []
  }
}

export type ScoredChunk = KnowledgeResult & { score: number }

// Pinecone-first retrieval: returns matches WITH their confidence scores so the
// caller can decide whether the knowledge base answers the question (priority)
// or whether to fall back to the model's general knowledge.
export async function searchKnowledgeScored(query: string, topK = 8): Promise<ScoredChunk[]> {
  if (!process.env.VOYAGE_API_KEY) return []
  try {
    const values = await embedText(query)
    const results = await index.query({ vector: values, topK, includeMetadata: true })
    return results.matches
      .map(m => ({ ...toKnowledgeResult(m.metadata as ChunkMetadata), score: m.score ?? 0 }))
      .filter(c => c.text && c.score > 0.5)
      .sort((a, b) => b.score - a.score)
  } catch {
    return []
  }
}

// ── Evidence-tier formatting + answer policy ────────────────────────────────
// Both the chat and coach routes inject retrieved chunks into the system prompt.
// These two exports keep that consistent and give you ONE place to tune wording.

// Formats a retrieved chunk for the system prompt, prefixing its evidence tier
// and source so the model can label/caveat the claim and cite where it's from.
export function formatChunkForPrompt(c: KnowledgeResult): string {
  const tier = c.tier ?? 'Unrated'
  const source = c.source ?? 'unspecified'
  return `[Evidence tier: ${tier} | Source: ${source}]\n${c.text}`
}

// The assistant's evidence/sourcing rules. TUNE THE WORDING HERE — this single
// string is appended to the system prompt of every route that uses the KB
// whenever any knowledge chunks are retrieved.
export const EVIDENCE_TIER_INSTRUCTION = `EVIDENCE & SOURCING RULES:
- Each knowledge item above is tagged with an evidence tier and a source.
- When a claim comes from the knowledge base, state its evidence strength in plain language (e.g. "there's strong evidence", "moderate evidence", "this is anecdotal").
- ALWAYS flag "Weak-Anecdotal" items as anecdotal and not yet proven — never present them as established fact.
- Treat "Unrated" items (legacy entries with no verified tier yet) with the SAME caution as Weak-Anecdotal: caveat them as unverified and never present them as established fact.
- Cite the source when it adds credibility (e.g. "per the FDA", "as Dr. Judy Morgan recommends").
- For high-stakes topics (toxins, medication interactions, serious symptoms, major diet changes) OR any Weak-Anecdotal or Unrated claim, add a brief note to check with a holistic/integrative vet.`
