"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentConfig } from "@/lib/agents";
import Avatar from "./Avatar";
import Composer from "./Composer";
import { saveToVault } from "@/lib/vault";

type Msg = { role: "user" | "assistant"; text: string; meta?: { cost?: number; duration?: number } };

export default function ClaudeConsole({ agent }: { agent: AgentConfig }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function patchLast(fn: (m: Msg) => Msg) {
    setMessages((arr) => {
      const copy = [...arr];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  async function send() {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: prompt }, { role: "assistant", text: "" }]);
    setLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let assistantText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          let evt: { type: string; text?: string; error?: string; cost?: number; duration?: number };
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.type === "text") {
            assistantText += evt.text ?? "";
            patchLast((m) => ({ ...m, text: m.text + (evt.text ?? "") }));
          } else if (evt.type === "error") patchLast((m) => ({ ...m, text: m.text || `⚠️ ${evt.error}` }));
          else if (evt.type === "done") patchLast((m) => ({ ...m, meta: { cost: evt.cost, duration: evt.duration } }));
        }
      }
      if (assistantText.trim()) saveToVault({ kind: "chat", agent: agent.name, user: prompt, assistant: assistantText.trim() });
    } catch {
      patchLast((m) => ({ ...m, text: m.text || "⚠️ Couldn't reach the Claude bridge." }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-16 text-center">
              <div className="mx-auto mb-4 w-fit"><Avatar agent={agent} size="lg" /></div>
              <div className="text-lg font-semibold">Chat with {agent.name}</div>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Bridged through the Claude Code CLI on your machine.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Summarize my PawGrade TODO", "Draft a holistic blog intro", "What should I ship next?"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 surface-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.role === "assistant" ? (
                  <Avatar agent={agent} size="sm" />
                ) : (
                  <div className="avatar avatar-sm" style={{ background: "linear-gradient(140deg,#334155,#1e293b)" }}>🧑</div>
                )}
                <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} max-w-[78%]`}>
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      m.role === "user"
                        ? { background: "var(--panel-2)", border: "1px solid var(--border)" }
                        : { background: "rgba(255,255,255,0.02)", border: `1px solid ${agent.accent}33` }
                    }
                  >
                    {m.text || (loading && i === messages.length - 1 ? <span className="typing"><span></span><span></span><span></span></span> : "")}
                  </div>
                  {m.meta?.cost != null && (
                    <div className="mt-1 px-1 text-[10.5px] mono" style={{ color: "var(--muted)" }}>
                      ${m.meta.cost.toFixed(4)} · {Math.round((m.meta.duration ?? 0) / 100) / 10}s
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

        </div>
      </div>

      <Composer
        value={input}
        onChange={setInput}
        onSend={send}
        accent={agent.accent}
        placeholder={`Message ${agent.name}…`}
        disabled={loading}
      />
    </div>
  );
}
