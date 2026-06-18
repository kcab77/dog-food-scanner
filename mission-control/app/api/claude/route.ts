import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bridge to the Claude Code CLI. Spawns `claude` in print + streaming-JSON mode
// and forwards tokens to the browser as a live newline-delimited JSON stream:
//   {"type":"text","text":"..."}   – a chunk of the reply
//   {"type":"done","cost":..,"duration":..}
//   {"type":"error","error":".."}

function resolveClaudeBin(): string {
  if (process.env.CLAUDE_BIN && existsSync(process.env.CLAUDE_BIN)) return process.env.CLAUDE_BIN;
  const home = homedir();
  const candidates = [
    path.join(home, ".claude/local/claude"),
    "/usr/local/bin/claude",
    "/opt/homebrew/bin/claude",
    path.join(home, ".npm-global/bin/claude"),
    path.join(home, ".local/bin/claude"),
    path.join(home, ".bun/bin/claude"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return "claude";
}

const REPO_ROOT = path.resolve(process.cwd(), "..");

export async function POST(req: Request) {
  const { prompt } = await req.json().catch(() => ({ prompt: "" }));
  if (!prompt || !prompt.trim()) {
    return Response.json({ error: "Empty prompt" }, { status: 400 });
  }

  const bin = resolveClaudeBin();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const emit = (obj: unknown) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        } catch {}
      };

      const child = spawn(
        bin,
        ["-p", prompt, "--output-format", "stream-json", "--verbose", "--include-partial-messages"],
        { cwd: REPO_ROOT, env: process.env }
      );

      let buf = "";
      let err = "";
      let emittedText = false;
      let closed = false;
      const finish = () => {
        if (closed) return;
        closed = true;
        clearTimeout(timer);
        try {
          controller.close();
        } catch {}
      };

      const timer = setTimeout(() => {
        emit({ type: "error", error: "Claude timed out (120s)." });
        child.kill("SIGKILL");
        finish();
      }, 120_000);

      child.stdout.on("data", (d: Buffer) => {
        buf += d.toString();
        let idx: number;
        while ((idx = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          let evt: Record<string, unknown>;
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          // token-level deltas (streaming)
          const inner = evt.event as { type?: string; delta?: { type?: string; text?: string } } | undefined;
          if (evt.type === "stream_event" && inner?.type === "content_block_delta" && inner.delta?.type === "text_delta") {
            emittedText = true;
            emit({ type: "text", text: inner.delta.text });
          }
          // whole assistant message — only used as a fallback if no deltas streamed
          else if (evt.type === "assistant" && !emittedText) {
            const msg = evt.message as { content?: { type: string; text?: string }[] } | undefined;
            const text = (msg?.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("");
            if (text) {
              emittedText = true;
              emit({ type: "text", text });
            }
          }
          // final result carries cost/timing
          else if (evt.type === "result") {
            emit({ type: "done", cost: evt.total_cost_usd, duration: evt.duration_ms });
          }
        }
      });

      child.stderr.on("data", (d: Buffer) => (err += d.toString()));

      child.on("error", (e: NodeJS.ErrnoException) => {
        const hint =
          e.code === "ENOENT"
            ? " Could not find the 'claude' binary. Set CLAUDE_BIN in mission-control/.env.local (find it with: which claude)."
            : "";
        emit({ type: "error", error: `${e.message}.${hint}` });
        finish();
      });

      child.on("close", () => {
        if (!emittedText && err.trim()) emit({ type: "error", error: err.trim() });
        finish();
      });
    },
    cancel() {
      // browser navigated away / aborted — nothing else to clean up here
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
  });
}
