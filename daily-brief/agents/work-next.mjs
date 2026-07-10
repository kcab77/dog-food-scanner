// "What to work on next" — reads repo TODO.md (single source of truth) + focus.json,
// asks Claude (as chief-of-staff) for today's top 3 + per-venture next actions.
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ask } from "../lib/claude.mjs";

const MODEL = "claude-sonnet-4-6"; // change to "claude-haiku-4-5-20251001" to cut cost
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", ".."); // one level above daily-brief/

export async function workNext() {
  let todo;
  try {
    todo = await fs.readFile(path.join(REPO_ROOT, "TODO.md"), "utf-8");
  } catch {
    todo = "(no TODO.md found at the repo root)";
  }

  let focus = { ventures: [] };
  try {
    focus = JSON.parse(await fs.readFile(path.resolve(__dirname, "..", "focus.json"), "utf-8"));
  } catch {
    /* defaults */
  }

  const system =
    "You are Kyle's chief-of-staff. He's a solo dev funding this with Uber Eats and " +
    "wants to exit gig work. Be concise and direct — no fluff. Respect that PawGrade's " +
    "affiliate links are the current unblock for shipping.";

  const user = `Given his open TODOs and venture statuses, pick the 3 highest-leverage things to do TODAY, in priority order — each with a concrete first step he can start in under 10 minutes. Then give a one-line status + next action per venture.

Return EXACTLY two markdown sections separated by a line containing only "===VENTURES===":
1. A numbered list (1-3) of today's top 3, each with its <10-minute first step.
2. After the separator: a per-venture "**Name** — status; next: action" list.

# TODO.md
${todo}

# Ventures (focus.json)
${JSON.stringify(focus.ventures || focus, null, 2)}`;

  const text = await ask({ system, user, model: MODEL, maxTokens: 1500 });
  const [top3, ventures] = text.split(/^\s*===VENTURES===\s*$/m);
  return {
    top3: (top3 || text).trim(),
    ventures: (ventures || "").trim() || "_(see Top 3 above)_",
  };
}
