import { serviceClient } from './supabase'

// The relevance floor. If the best chunk doesn't clear this cosine similarity,
// we do NOT call the model to "try anyway" — we take the refusal path. Tune per
// embedding model; voyage-3 cosine tends to sit ~0.4–0.7 for genuine matches.
// Tuned against real scores: her dog-focused chunks score a genuine topic
// (e.g. "raw diet") around 0.42+, while truly off-topic queries (a flea/tick
// brand she never names) sit near 0.28 — so 0.40 cleanly separates "she covers
// this" from "she doesn't." The route's soft-refusal safety net catches any
// weak match that still leads to a non-answer, so no misleading citations.
export const RELEVANCE_FLOOR = Number(process.env.RELEVANCE_FLOOR ?? '0.40')
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

  // Over-fetch, then BLEND. Compiled pages (type='wiki') are dense syntheses and
  // can dominate a pure top-N by similarity — measured: a broad question returned
  // 3 compiled pages and ZERO original articles, so the model had none of the
  // expert's actual wording to ground on. Conversely a narrow question can return
  // only originals and lose the cross-source overview. Reserving slots for each
  // means the model always gets the best of BOTH, which is the point of a hybrid
  // index. Falls back gracefully when only one kind exists.
  const { data: matches, error } = await sb.rpc('match_chunks', {
    p_expert: expertId,
    query_embedding: queryEmbedding,
    match_count: MATCH_COUNT * 3,
    similarity_threshold: RELEVANCE_FLOOR,
  })
  if (error) throw new Error(`match_chunks failed: ${error.message}`)

  const candidates = (matches ?? []) as Match[]
  if (candidates.length === 0) return { matches: [], sources: [], topSimilarity: 0 }

  // Need source types to partition candidates.
  const candIds = Array.from(new Set(candidates.map((m) => m.source_id)))
  const { data: candSources } = await sb.from('sources').select('id, type').in('id', candIds)
  const typeOf = new Map((candSources ?? []).map((s) => [s.id, s.type]))

  const compiled = candidates.filter((m) => typeOf.get(m.source_id) === 'wiki')
  const original = candidates.filter((m) => typeOf.get(m.source_id) !== 'wiki')
  const half = Math.ceil(MATCH_COUNT / 2)
  const picked = [...compiled.slice(0, half), ...original.slice(0, half)]
  // Backfill if one side was short, so we still use the full budget.
  if (picked.length < MATCH_COUNT) {
    for (const m of candidates) {
      if (picked.length >= MATCH_COUNT) break
      if (!picked.includes(m)) picked.push(m)
    }
  }
  // Best-first, so the strongest evidence leads the prompt.
  const rows = picked.sort((a, b) => b.similarity - a.similarity).slice(0, MATCH_COUNT)

  // Fetch source metadata for citations (deduped, order preserved by first hit)
  const sourceIds = Array.from(new Set(rows.map((m) => m.source_id)))
  const { data: sourceRows } = await sb
    .from('sources')
    .select('id, title, url, type, metadata')
    .in('id', sourceIds)

  const byId = new Map((sourceRows ?? []).map((s) => [s.id, s]))

  // A matched chunk may belong to a COMPILED page (type='wiki'), which is our own
  // synthesis and has no URL — citing it would be unverifiable. Resolve those
  // through metadata.derived_from back to the expert's real videos/articles, so a
  // citation always points at something the user can actually go read/watch.
  const derivedIds = new Set<string>()
  for (const s of sourceRows ?? []) {
    if (s.type === 'wiki') {
      for (const id of (s.metadata as { derived_from?: string[] })?.derived_from ?? []) derivedIds.add(id)
    }
  }
  if (derivedIds.size) {
    const { data: originals } = await sb
      .from('sources')
      .select('id, title, url, type, metadata')
      .in('id', Array.from(derivedIds))
    for (const o of originals ?? []) if (!byId.has(o.id)) byId.set(o.id, o)
  }

  const seen = new Set<string>()
  const sources: RetrievedSource[] = []
  const push = (id: string) => {
    if (seen.has(id)) return
    const s = byId.get(id)
    if (!s || s.type === 'wiki') return // never cite our own synthesis
    seen.add(id)
    sources.push({ source_id: s.id, title: s.title, url: s.url, type: s.type })
  }
  for (const m of rows) {
    const s = byId.get(m.source_id)
    if (!s) continue
    if (s.type === 'wiki') {
      // Cite the sources this page was compiled from, best-first, capped so one
      // broad compiled page doesn't flood the citation list.
      const from = (s.metadata as { derived_from?: string[] })?.derived_from ?? []
      from.slice(0, 4).forEach(push)
    } else {
      push(m.source_id)
    }
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
