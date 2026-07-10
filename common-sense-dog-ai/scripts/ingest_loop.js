#!/usr/bin/env node
/**
 * CSD Knowledge Ingestion Loop
 * -----------------------------
 * Watches an Obsidian vault folder for new/changed markdown notes,
 * chunks them, embeds via Pinecone's hosted inference API, and upserts
 * into your Pinecone index with metadata (source, tier, date, tags).
 *
 * Usage:
 *   node ingest_loop.js              # one-shot run over the folder
 *   node ingest_loop.js --watch      # keep running, re-check every N minutes
 *
 * Requires:
 *   npm install @pinecone-database/pinecone gray-matter glob
 *
 * Env vars needed (put in a .env file, load with `node --env-file=.env ingest_loop.js`):
 *   PINECONE_API_KEY=...
 *   PINECONE_INDEX=csd-knowledge
 *   VAULT_PATH=/Users/Kyle/Documents/ObsidianVault/Brain
 *
 * ⚠️ COMPATIBILITY NOTE (added by Claude 2026-07-06): This script embeds with
 * Pinecone-hosted `llama-text-embed-v2`. The LIVE index `dog-knowledge-database`
 * is built with Voyage `voyage-3` (1024-dim). Those two embedding spaces are NOT
 * interchangeable — do NOT point this at `dog-knowledge-database` or retrieval
 * accuracy breaks. This targets a SEPARATE index (`csd-knowledge`). See the
 * pinecone ingestion protocol memory before running.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { glob } = require("glob");
const matter = require("gray-matter");
const { Pinecone } = require("@pinecone-database/pinecone");

// ---- CONFIG ----
const VAULT_PATH = process.env.VAULT_PATH || "./Brain";
const MANIFEST_PATH = path.join(__dirname, ".ingest_manifest.json");
const CHUNK_MAX_CHARS = 1200; // rough chunk size, tune to your embedding model
const NAMESPACE = "csd-notes"; // logical namespace inside your Pinecone index

// ---- SETUP ----
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX);

// ---- MANIFEST (tracks what's already been ingested, by content hash) ----
function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  }
  return {};
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// ---- STEP 1: FIND NOTES ----
async function findNotes() {
  const files = await glob("**/*.md", { cwd: VAULT_PATH, absolute: true });
  return files;
}

// ---- STEP 2: PARSE FRONTMATTER + BODY ----
function parseNote(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    filePath,
    title: data.title || path.basename(filePath, ".md"),
    source: data.source || "unspecified",
    source_url: data.source_url || null,
    author: data.author || null,
    // tier1-study | tier2-practitioner | tier3-anecdotal | tier4-unverified
    tier: data.tier || "tier3-anecdotal",
    cross_reference: data.cross_reference || [],
    date: data.date || null,
    tags: data.tags || [],
    body: content.trim(),
  };
}

// ---- STEP 3: CHUNK (simple paragraph-aware splitter) ----
function chunkText(text, maxChars = CHUNK_MAX_CHARS) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ---- STEP 4: EMBED (Pinecone hosted inference) ----
async function embedChunks(chunks) {
  // Requires your index to be created with an integrated embedding model,
  // e.g. llama-text-embed-v2. Adjust model name to match your index config.
  const response = await pc.inference.embed(
    "llama-text-embed-v2",
    chunks,
    { inputType: "passage", truncate: "END" }
  );
  return response.data.map((d) => d.values);
}

// ---- STEP 5: UPSERT ----
async function upsertNote(note) {
  const chunks = chunkText(note.body);
  if (chunks.length === 0) return { skipped: true, reason: "empty body" };

  const vectors = await embedChunks(chunks);

  const records = chunks.map((chunk, i) => ({
    id: `${path.basename(note.filePath, ".md")}-${i}`,
    values: vectors[i],
    metadata: {
      title: note.title,
      source: note.source,
      source_url: note.source_url || "",
      author: note.author || "",
      tier: note.tier,
      cross_reference: note.cross_reference,
      date: note.date,
      tags: note.tags,
      chunk_index: i,
      total_chunks: chunks.length,
      text: chunk, // storing raw text in metadata so retrieval can surface it directly
    },
  }));

  await index.namespace(NAMESPACE).upsert(records);
  return { skipped: false, chunkCount: chunks.length };
}

// ---- MAIN LOOP ----
async function runOnce() {
  const manifest = loadManifest();
  const files = await findNotes();
  let ingested = 0;
  let skipped = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const hash = hashContent(raw);

    if (manifest[filePath] === hash) {
      skipped++;
      continue; // unchanged since last ingest
    }

    const note = parseNote(filePath);

    if (note.tier === "tier4-unverified") {
      if (!note.source_url && !note.source) {
        console.warn(`⚠ ${note.title}: tier4-unverified note has no source/source_url — add one before ingesting.`);
      }
      if (!note.cross_reference || note.cross_reference.length === 0) {
        console.warn(`⚠ ${note.title}: tier4-unverified note has no cross_reference to a tier1/tier2 source.`);
      }
    }

    try {
      const result = await upsertNote(note);
      if (!result.skipped) {
        console.log(`✓ Ingested: ${note.title} (${result.chunkCount} chunks, tier: ${note.tier})`);
        manifest[filePath] = hash;
        ingested++;
      } else {
        console.log(`- Skipped (empty): ${note.title}`);
      }
    } catch (err) {
      console.error(`✗ Failed: ${note.title} — ${err.message}`);
    }
  }

  saveManifest(manifest);
  console.log(`\nDone. Ingested: ${ingested}, unchanged/skipped: ${skipped}, total notes: ${files.length}`);
}

async function watch(intervalMinutes = 10) {
  console.log(`Watching ${VAULT_PATH} every ${intervalMinutes} min. Ctrl+C to stop.`);
  await runOnce();
  setInterval(runOnce, intervalMinutes * 60 * 1000);
}

// ---- ENTRY ----
const args = process.argv.slice(2);
if (args.includes("--watch")) {
  watch();
} else {
  runOnce().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
