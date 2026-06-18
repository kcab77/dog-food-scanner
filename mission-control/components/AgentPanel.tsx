"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { AgentConfig } from "@/lib/agents";

export default function AgentPanel({ agent, running }: { agent: AgentConfig; running: boolean }) {
  const [logs, setLogs] = useState("");
  const [busy, setBusy] = useState(false);
  const [command, setCommand] = useState(agent.runCommand ?? "");
  const logRef = useRef<HTMLPreElement>(null);

  const isServer = agent.kind === "server";

  async function poll() {
    try {
      const r = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agent.id, action: "logs" }),
      });
      const d = await r.json();
      setLogs(d.logs ?? "");
    } catch {}
  }

  useEffect(() => {
    poll();
    const t = setInterval(poll, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent.id]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  async function act(action: "start" | "stop" | "run") {
    setBusy(true);
    try {
      const r = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agent.id, action, command }),
      });
      const d = await r.json();
      if (d.logs) setLogs(d.logs);
      if (d.error) setLogs((l) => l + `\n⚠️ ${d.error}\n`);
      setTimeout(poll, 400);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* control bar */}
      <div className="surface p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${running ? "pulse" : ""}`}
              style={{ background: running ? agent.accent : "#4b5563", color: agent.accent }}
            />
            <span className="text-sm font-medium">{running ? "Running" : "Stopped"}</span>
            {agent.port && (
              <a
                href={`http://localhost:${agent.port}`}
                target="_blank"
                className="text-xs mono px-2 py-1 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}
              >
                localhost:{agent.port} ↗
              </a>
            )}
            {agent.configured === false && (
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(251,191,36,0.12)", color: "var(--amber)" }}>
                needs setup
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isServer ? (
              <>
                <ActionButton label="Start" accent={agent.accent} onClick={() => act("start")} disabled={busy || running} />
                <ActionButton label="Stop" ghost onClick={() => act("stop")} disabled={busy || !running} />
              </>
            ) : (
              <ActionButton label={busy ? "Running…" : "▶ Run"} accent={agent.accent} onClick={() => act("run")} disabled={busy} />
            )}
          </div>
        </div>

        {!isServer && (
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="mt-4 w-full glass px-3 py-2 text-sm mono outline-none"
            placeholder="command to run…"
            style={{ color: "var(--text)" }}
          />
        )}
        {isServer && (
          <div className="mt-3 text-xs mono" style={{ color: "var(--muted)" }}>
            $ {agent.command} <span className="opacity-60">· cwd: {agent.cwd}</span>
          </div>
        )}
      </div>

      {/* live logs */}
      <div className="surface flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-between" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
          <span>Live output</span>
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>●</motion.span>
        </div>
        <pre ref={logRef} className="flex-1 overflow-auto p-4 text-[12.5px] leading-relaxed mono whitespace-pre-wrap" style={{ color: "#cbd5e1" }}>
          {logs || "No output yet. Hit start/run to launch this agent."}
        </pre>
      </div>
    </div>
  );
}

function ActionButton({ label, accent, ghost, onClick, disabled }: { label: string; accent?: string; ghost?: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40"
      style={
        ghost
          ? { background: "rgba(255,255,255,0.06)", color: "var(--text)", border: "1px solid var(--border)" }
          : { background: `linear-gradient(135deg, ${accent}, #6d28d9)`, color: "#fff", boxShadow: `0 6px 20px ${accent}44` }
      }
    >
      {label}
    </motion.button>
  );
}
