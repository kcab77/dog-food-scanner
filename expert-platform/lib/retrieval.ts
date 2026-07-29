import { serviceClient } from './supabase'

// The relevance floor. If the best chunk doesn't clear this cosine similarity,
// we do NOT call the model to "try anyway" — we take the refusal path. Tune per
// embedding model; voyage-3 cosine tends to sit ~0.4–0.7 for genuine matches.
export const RELEVANCE_FLOOR = Number(process.env.RELEVANCE_FLOOR ?? '0.55')
export const MATCH_COUNT = Number(process.env.MATCH_COUNT ?? '8')

export type Match = {
  id: string
  source_id: string
  content: string
  similarity: number
  token_count: number | null
}

export type RetrievedSource = {
  source_id: string
  title: string
  url: string | null
  type: string
}

/**
 * Vector search scoped to one expert, with the relevance floor applied in SQL
 * (match_chunks). Returns the chunks plus the deduped source records for
 * citations. An empty `matches` array is the signal to refuse.
 */
export async function retrieve(
  expertId: string,
  queryEmbedding: number[],
): Promise<{ matches: Match[]; sources: RetrievedSource[]; topSimilarity: number }> {
  const sb = serviceClient()

  const { data: matches, error } = await sb.rpc('match_chunks', {
    p_expert: expertId,
    query_embedding: queryEmbedding,
    match_count: MATCH_COUNT,
    similarity_threshold: RELEVANCE_FLOOR,
  })
  if (error) throw new Error(`match_chunks failed: ${error.message}`)

  const rows = (matches ?? []) as Match[]
  if (rows.length === 0) return { matches: [], sources: [], topSimilarity: 0 }

  // Fetch source metadata for citations (deduped, order preserved by first hit)
  const sourceIds = Array.from(new Set(rows.map((m) => m.source_id)))
  const { data: sourceRows } = await sb
    .from('sources')
    .select('id, title, url, type')
    .in('id', sourceIds)

  const byId = new Map((sourceRows ?? []).map((s) => [s.id, s]))
  const seen = new Set<string>()
  const sources: RetrievedSource[] = []
  for (const m of rows) {
    if (seen.has(m.source_id)) continue
    seen.add(m.source_id)
    const s = byId.get(m.source_id)
    if (s) sources.push({ source_id: s.id, title: s.title, url: s.url, type: s.type })
  }

  return { matches: rows, sources, topSimilarity: rows[0]?.similarity ?? 0 }
}

// Very conservative emergency detector. Non-negotiable: anything that reads like
// a medical emergency short-circuits to "contact your vet now" BEFORE any RAG.
const EMERGENCY_PATTERNS = [
  /\b(can'?t|cannot|unable to|won'?t)\s+(breath|breathe|stand|walk|wake)/i,
  /\b(not|isn'?t|won'?t be)\s+breathing\b/i,
  /\b(collaps(e|ed|ing)|unconscious|unresponsive|seizure|seizing|convuls)/i,
  /\b(bloat|distended|swollen)\s+(belly|abdomen|stomach)/i,
  /\b(hit by|hit a|got hit|car accident|fell from)/i,
  /\b(poison|toxic|ate\s+(chocolate|xylitol|grapes|rat\s*bait|antifreeze))/i,
  /\b(bleeding|blood)\s+(won'?t stop|everywhere|a lot|heavil)/i,
  /\b(pale|blue|white)\s+gums\b/i,
  /\bnot\s+urinating\b|\bcan'?t\s+(pee|urinate)\b/i,
  /\b(choking|can'?t swallow)\b/i,
  /\b(emergency|dying|is\s+he\s+dying|is\s+she\s+dying)\b/i,
]

export function looksLikeEmergency(text: string): boolean {
  return EMERGENCY_PATTERNS.some((re) => re.test(text))
}
