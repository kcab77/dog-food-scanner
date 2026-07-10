// ingest_pack.js — upsert pre-made Q&A pairs directly to Pinecone
// Skips the Claude API generation step since pairs are ready.
// Usage: node scripts/ingest_pack.js scripts/qa-knowledge-pack.json

import fs from 'fs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env.local
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
  const data = await res.json();
  return data.data.map(d => d.embedding);
}

async function getPineconeHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: { 'Api-Key': PINECONE_API_KEY },
  });
  const data = await res.json();
  return data.host;
}

async function queryNearest(host, vector) {
  const res = await fetch(`https://${host}/query`, {
    method: 'POST',
    headers: { 'Api-Key': PINECONE_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ vector, topK: 1, includeMetadata: true }),
  });
  const data = await res.json();
  return data.matches?.[0]?.score ?? 0;
}

async function upsertVectors(host, vectors) {
  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: 'POST',
    headers: { 'Api-Key': PINECONE_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ vectors }),
  });
  return res.json();
}

const pairs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log(`Loaded ${pairs.length} Q&A pairs`);

const host = await getPineconeHost();

const BATCH = 50;
for (let i = 0; i < pairs.length; i += BATCH) {
  const batch = pairs.slice(i, i + BATCH);
  const texts = batch.map(p => `Q: ${p.question}\nA: ${p.answer}`);
  const embeddings = await embedTexts(texts);

  const vectors = [];
  for (let j = 0; j < batch.length; j++) {
    const values = embeddings[j];
    const topScore = await queryNearest(host, values);
    if (topScore > 0.95) {
      console.log(`SKIP (dup ${topScore.toFixed(3)}): ${batch[j].question}`);
      continue;
    }
    vectors.push({
      id: `qa-${batch[j].topic}-${i + j}`,
      values,
      metadata: {
        question: batch[j].question,
        answer: batch[j].answer,
        topic: batch[j].topic,
        source: batch[j].source,
      },
    });
  }

  if (vectors.length) {
    await upsertVectors(host, vectors);
    console.log(`Upserted ${vectors.length}/${batch.length} from batch ${i / BATCH + 1}`);
  }
}
console.log('Done.');
