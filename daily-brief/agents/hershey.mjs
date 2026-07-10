// Hershey Health — reads his profile + protocol + recent log, asks Claude for
// today's focus (open items, seasonal reminder, one log prompt). Read-only on the
// protocol; creates the log note if missing but never invents observations.
import { readNote, writeNote } from "../lib/vault.mjs";
import { ask } from "../lib/claude.mjs";

const MODEL = "claude-sonnet-4-6"; // change to "claude-haiku-4-5-20251001" to cut cost

const LOG_PATH = "Brain/People/Hershey Health Log.md";

export async function hershey(date) {
  const profile = await readNote("Brain/People/Hershey.md");
  const protocol = await readNote("Brain/People/Hershey Health Protocol.md");

  // Read/create the ongoing log. Kyle adds dated observations; we only scaffold it.
  let log = await readNote(LOG_PATH);
  if (log === null) {
    log =
      "---\n" +
      "title: Hershey Health Log\n" +
      `created: ${date}\n` +
      "tags: [hershey, health, log]\n" +
      "type: log\n" +
      "---\n\n" +
      "Running health log for Hershey — add dated observations (energy, stool, coat, lumps). " +
      "The daily brief reads recent entries back.\n\n## Entries\n";
    await writeNote(LOG_PATH, log);
  }

  // Pull the last ~10 entry/heading lines for recency.
  const entryLines = log.split("\n").filter((l) => /^\s*[-*]\s|^##\s/.test(l));
  const recent = entryLines.slice(-10).join("\n") || "(log started; no observations yet)";

  const system =
    "You are Kyle's holistic dog-health assistant. Keep it warm, specific, and " +
    'non-alarmist — Hershey is fully healthy. Do not invent medical facts beyond the ' +
    'protocol; if unsure, say "check with vet."';

  const user = `Based on Hershey's protocol and recent log, produce today's Hershey focus (date: ${date}):

(a) Any open/overdue items — e.g. add a thyroid T4 panel at next annual bloodwork; diet transition toward 100% whole food (next step: confirm AAFCO complete-and-balanced on AllProvide + Simple Food Project so kibble can be dropped); watch the clumpy shedding noted March 2026.
(b) A seasonal reminder appropriate to the current date — it's summer, peak tick + swimming season, so reinforce the flea/tick stack (The Resistance daily in food; EVICT + rose geranium before outings; flea comb + rose-geranium bandana after every swim).
(c) One gentle question prompting Kyle to log an observation today (energy, stool, coat, lumps).

# Hershey profile
${profile || "(missing)"}

# Hershey Health Protocol
${protocol || "(missing)"}

# Recent log entries
${recent}`;

  return ask({ system, user, model: MODEL, maxTokens: 1200 });
}
