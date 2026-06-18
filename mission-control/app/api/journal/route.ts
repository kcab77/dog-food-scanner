import { existsSync, mkdirSync, readFileSync, appendFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auto-saves chats, goals, and journal entries into the user's Obsidian vault as
// markdown — one file per day inside an "Agentic OS" folder.
//
// Set the vault location in mission-control/.env.local:
//   VAULT_PATH=/Users/you/Documents/ObsidianVault

const DEFAULT_VAULT = "/Users/Kyle/Documents/ObsidianVault";
const FOLDER = "Agentic OS";

function vaultBase() {
  return process.env.VAULT_PATH || DEFAULT_VAULT;
}
function todayName(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hhmm(d = new Date()) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function dailyFile() {
  const base = vaultBase();
  // Require the vault itself to already exist — don't create a stray vault.
  if (!existsSync(base)) {
    return { error: `Vault not found at "${base}". Set VAULT_PATH in mission-control/.env.local to your real Obsidian vault path.` };
  }
  const dir = path.join(base, FOLDER);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${todayName()}.md`);
  if (!existsSync(file)) {
    writeFileSync(file, `---\ndate: ${todayName()}\ntype: agentic-os-log\n---\n\n# ${todayName()}\n`);
  }
  return { file };
}

function block(kind: string, body: Record<string, string>) {
  const t = hhmm();
  if (kind === "chat") {
    return `\n## ${t} · 💬 Chat · ${body.agent ?? "Agent"}\n\n**You:** ${body.user ?? ""}\n\n**${body.agent ?? "Agent"}:** ${body.assistant ?? ""}\n`;
  }
  if (kind === "goal") {
    return `\n## ${t} · 🎯 Goal\n\n- [ ] ${body.text ?? ""}\n`;
  }
  if (kind === "journal") {
    return `\n## ${t} · 📓 Journal\n\n${body.text ?? ""}\n`;
  }
  return `\n## ${t} · ${kind}\n\n${body.text ?? ""}\n`;
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const { kind } = payload as { kind?: string };
  if (!kind) return Response.json({ error: "Missing kind" }, { status: 400 });

  const res = dailyFile();
  if ("error" in res) return Response.json({ error: res.error }, { status: 400 });

  try {
    appendFileSync(res.file, block(kind, payload));
    return Response.json({ ok: true, file: res.file });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

// GET → today's log (so the Journal page can show what's been saved)
export async function GET() {
  const base = vaultBase();
  if (!existsSync(base)) {
    return Response.json({ configured: false, base, content: "" });
  }
  const file = path.join(base, FOLDER, `${todayName()}.md`);
  const content = existsSync(file) ? readFileSync(file, "utf8") : "";
  return Response.json({ configured: true, base, file, content });
}
