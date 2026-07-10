// Daily Brief orchestrator. Runs the three agents, assembles one dated markdown
// brief, and writes it to the vault. Resilient: a failing agent becomes a
// placeholder so the brief still generates.
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// Load daily-brief/.env regardless of the current working directory (matters for
// `npm run brief` from the repo root and for the launchd job).
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });

import { writeNote } from "./lib/vault.mjs";
import { workNext } from "./agents/work-next.mjs";
import { topicScout } from "./agents/topic-scout.mjs";
import { hershey } from "./agents/hershey.mjs";

function todayLocal() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function safe(label, fn) {
  try {
    return await fn();
  } catch (e) {
    return { __error: `⚠️ section failed: ${label} — ${e.message}` };
  }
}

async function main() {
  const date = todayLocal();

  const wn = await safe("work-next", () => workNext());
  const ts = await safe("topic-scout", () => topicScout(date));
  const hh = await safe("hershey", () => hershey(date));

  const top3 = wn.__error || wn.top3;
  const ventures = wn.__error ? "_(unavailable)_" : wn.ventures;
  const topics = ts && ts.__error ? ts.__error : ts;
  const hersheyMd = hh && hh.__error ? hh.__error : hh;

  const body = [
    "---",
    `title: Daily Brief — ${date}`,
    `created: ${date}`,
    "tags: [daily-brief, hershey, ventures]",
    "type: note",
    "---",
    "",
    `Good morning, Kyle. Here's your brief for **${date}**.`,
    "",
    "## 🎯 Today's Top 3",
    "",
    top3,
    "",
    "## 🚀 Ventures — what's next",
    "",
    ventures,
    "",
    "## 🌿 Holistic Topic Scout (review before Pinecone)",
    "",
    topics,
    "",
    "> To ingest an approved topic: `node common-sense-dog-ai/scripts/process_content.mjs <file>` (voyage-3, 1024-dim, index `dog-knowledge-database`).",
    "",
    "## 🐕 Hershey Health",
    "",
    hersheyMd,
    "",
    "---",
    "_Generated automatically; edit freely._",
    "",
  ].join("\n");

  const out = await writeNote(`Brain/Inbox/Daily Brief/${date}.md`, body);
  console.log(`Daily brief written: ${out}`);
}

main().catch((e) => {
  console.error("Daily brief failed:", e);
  process.exit(1);
});
