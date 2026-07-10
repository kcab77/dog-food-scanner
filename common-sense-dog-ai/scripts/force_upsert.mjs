// force_upsert.mjs — re-embed a pack and OVERWRITE by deterministic id (no dedup).
// Use to push CORRECTIONS to already-ingested packs (ingest_pack.js skips near-dupes).
// Usage: node scripts/force_upsert.mjs scripts/qa-holistic-parasites.json
import fs from 'fs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envFile = readFileSync(resolve(root, '.env.local'), 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'dog-knowledge-database';
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;

async function embedTexts(texts) {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${VOYAGE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'voyage-3', input: texts, input_type: 'document' }),
  });
  return (await res.json()).data.map(d => d.embedding);
}
async function getHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, { headers: { 'Api-Key': PINECONE_API_KEY } });
  return (await res.json()).host;
}

const pairs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const host = await getHost();
const texts = pairs.map(p => `Q: ${p.question}\nA: ${p.answer}`);
const embeddings = await embedTexts(texts);
const vectors = pairs.map((p, idx) => ({
  id: `qa-${p.topic}-${idx}`,
  values: embeddings[idx],
  metadata: { question: p.question, answer: p.answer, topic: p.topic, source: p.source },
}));
const res = await fetch(`https://${host}/vectors/upsert`, {
  method: 'POST',
  headers: { 'Api-Key': PINECONE_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ vectors }),
});
console.log('Force-upserted', vectors.length, 'vectors →', (await res.json()).upsertedCount ?? 'ok');
