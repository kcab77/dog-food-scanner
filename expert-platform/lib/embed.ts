// Voyage `voyage-3` embeddings (1024-dim). Must match the vector() size in the
// schema. `input_type` differs for stored docs vs. a live query, which improves
// retrieval quality — ingestion uses 'document', the Assistant uses 'query'.
const EMBED_MODEL = 'voyage-3'

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embed([text], 'query')
  return vec
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// A live chat request can't wait as long as a batch ingest — short, bounded
// backoff so a visitor sees a brief delay instead of a raw error if the
// account is still on Voyage's free-tier rate limit (3 req/min).
export async function embed(
  texts: string[],
  inputType: 'document' | 'query',
  attempt = 0,
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) throw new Error('Missing VOYAGE_API_KEY')
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts, input_type: inputType }),
  })
  if (res.status === 429 && attempt < 3) {
    await sleep(4000 * (attempt + 1)) // 4s, 8s, 12s
    return embed(texts, inputType, attempt + 1)
  }
  if (!res.ok) throw new Error(`Voyage embed failed (${res.status}): ${await res.text()}`)
  const data = await res.json()
  return data.data.map((d: { embedding: number[] }) => d.embedding)
}
