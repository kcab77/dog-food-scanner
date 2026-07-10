// Topic Scout — finds trending holistic pet-health topics via Claude's web_search
// server tool and PROPOSES them for review. Never writes to Pinecone; appends to a
// running review queue note that Kyle approves from manually.
import { ask } from "../lib/claude.mjs";
import { appendDatedBlock } from "../lib/vault.mjs";

const MODEL = "claude-sonnet-4-6"; // change to "claude-haiku-4-5-20251001" to cut cost
const WEB_SEARCH_TOOL = { type: "web_search_20250305", name: "web_search" };

export async function topicScout(date) {
  const system =
    "You are a holistic pet-health content scout for Common Sense Dog (commonsensedog.com). " +
    "Find what's genuinely trending RIGHT NOW and propose topics for Kyle to review — " +
    "never present speculation as established fact.";

  const user = `Use web search to find what's trending in the last ~30 days in holistic / natural pet health. Search angles: holistic dog nutrition, raw/fresh feeding, supplements, natural flea/tick, longevity / Forever Dog topics, vet controversies (e.g. Librela), and seasonal items (it's summer — ticks, swimming, heat).

Return 5 candidate topics as a markdown list. For EACH:
- **Title**
- _Why it's trending / relevant now_ (one line)
- The holistic angle Common Sense Dog would take
- A suggested 1-sentence Q&A seed
- An evidence-confidence tag — **(Strong / Emerging / Anecdotal)** — so Kyle knows what needs fact-checking

Be concise. Do not invent sources or studies.`;

  const md = await ask({
    system,
    user,
    model: MODEL,
    tools: [WEB_SEARCH_TOOL],
    maxTokens: 2500,
  });

  // Append to the running review queue (propose-for-review; NOT ingested to Pinecone).
  const frontmatter =
    "---\n" +
    "title: Topic Review Queue\n" +
    `created: ${date}\n` +
    "tags: [topic-queue, content, review]\n" +
    "type: queue\n" +
    "---\n\n" +
    "Proposed holistic topics awaiting Kyle's review before Pinecone ingestion. " +
    "Approve one, then run `process_content.mjs`.";
  await appendDatedBlock("Brain/Inbox/Topic Review Queue.md", date, md, frontmatter);

  return md;
}
