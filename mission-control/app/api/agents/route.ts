import { NextResponse } from "next/server";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { AGENTS } from "@/lib/agents";

// Controls local agents/servers: start, stop, status, logs, and one-off shell
// runs. Process handles + recent logs are kept on globalThis so they survive
// dev hot-reloads.

const REPO_ROOT = path.resolve(process.cwd(), "..");

type Store = {
  procs: Map<string, ChildProcess>;
  logs: Map<string, string>;
};
const g = globalThis as unknown as { __mc?: Store };
const store: Store = (g.__mc ??= { procs: new Map(), logs: new Map() });

function appendLog(id: string, text: string) {
  const prev = store.logs.get(id) ?? "";
  store.logs.set(id, (prev + text).slice(-8000)); // keep last 8k chars
}

async function checkHealth(url?: string): Promise<boolean> {
  if (!url) return false;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return r.ok || r.status < 500;
  } catch {
    return false;
  }
}

// ── GET: status of every agent ───────────────────────────────────────────────
export async function GET() {
  const statuses = await Promise.all(
    AGENTS.map(async (a) => {
      const tracked = store.procs.has(a.id) && !store.procs.get(a.id)!.killed;
      const healthy = a.kind === "server" ? await checkHealth(a.healthUrl) : false;
      return { id: a.id, running: a.kind === "server" ? healthy || tracked : tracked, tracked, healthy };
    })
  );
  return NextResponse.json({ statuses });
}

// ── POST: control actions ────────────────────────────────────────────────────
export async function POST(req: Request) {
  const { id, action, command } = await req.json().catch(() => ({}));
  const agent = AGENTS.find((a) => a.id === id);
  if (!agent) return NextResponse.json({ error: "Unknown agent" }, { status: 404 });

  if (action === "logs") {
    return NextResponse.json({ logs: store.logs.get(id) ?? "" });
  }

  if (action === "stop") {
    const proc = store.procs.get(id);
    if (proc && !proc.killed) {
      proc.kill("SIGTERM");
      store.procs.delete(id);
      appendLog(id, `\n[mission-control] stopped ${id}\n`);
      return NextResponse.json({ ok: true, running: false });
    }
    return NextResponse.json({ ok: true, running: false, note: "was not tracked (may be running outside mission control)" });
  }

  if (action === "start" || action === "run") {
    if (store.procs.has(id) && !store.procs.get(id)!.killed) {
      return NextResponse.json({ ok: true, running: true, note: "already running" });
    }
    // server agents use their configured command; shell agents use the posted command
    const cmd = agent.kind === "server" ? agent.command : (command || agent.runCommand || "");
    if (!cmd || cmd.trim().startsWith("#")) {
      return NextResponse.json({ error: "No command configured for this agent." }, { status: 400 });
    }
    const cwd = agent.cwd ? path.join(REPO_ROOT, agent.cwd) : REPO_ROOT;
    store.logs.set(id, `[mission-control] $ ${cmd}  (cwd: ${agent.cwd ?? "."})\n`);

    const child = spawn(cmd, { cwd, env: process.env, shell: true });
    store.procs.set(id, child);
    child.stdout?.on("data", (d) => appendLog(id, d.toString()));
    child.stderr?.on("data", (d) => appendLog(id, d.toString()));
    child.on("close", (code) => {
      appendLog(id, `\n[mission-control] process exited (code ${code})\n`);
      store.procs.delete(id);
    });
    child.on("error", (e) => appendLog(id, `\n[mission-control] error: ${e.message}\n`));

    // give it a beat to boot / surface immediate errors
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: true, running: !child.killed, logs: store.logs.get(id) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
