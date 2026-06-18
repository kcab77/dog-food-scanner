"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import type { AgentConfig } from "@/lib/agents";

export default function JournalPanel({ agent }: { agent: AgentConfig }) {
  const [mode, setMode] = useState<"journal" | "goal">("journal");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [content, setContent] = useState("");
  const [base, setBase] = useState("");
  const [configured, setConfigured] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/journal");
      const d = await r.json();
      setContent(d.content || "");
      setBase(d.base || "");
      setConfigured(!!d.configured);
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function save() {
    const t = text.trim();
    if (!t || saving) return;
    setSaving(true);
    try {
      const r = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: mode, text: t }),
      });
      const d = await r.json();
      if (d.error) {
        setToast(`⚠️ ${d.error}`);
      } else {
        setText("");
        setToast(mode === "goal" ? "🎯 Goal saved to vault" : "📓 Entry saved to vault");
        refresh();
      }
    } catch {
      setToast("⚠️ Couldn't save.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 3500);
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {!configured && (
          <div className="surface p-4 text-sm" style={{ borderColor: "rgba(251,191,36,0.4)" }}>
            <strong className="text-amber-300">Vault not found</strong>
            <p className="mt-1" style={{ color: "var(--muted)" }}>
              Looked in <code className="mono">{base}</code>. Add{" "}
              <code className="mono">VAULT_PATH=/path/to/your/ObsidianVault</code> to{" "}
              <code className="mono">mission-control/.env.local</code> and restart. Until then, entries won&apos;t save.
            </p>
          </div>
        )}

        {/* composer */}
        <div className="surface p-4">
          <div className="flex gap-2 mb-3">
            {(["journal", "goal"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-sm px-3 py-1.5 rounded-lg font-medium"
                style={
                  mode === m
                    ? { background: `${agent.accent}22`, color: agent.accent, border: `1px solid ${agent.accent}55` }
                    : { background: "var(--panel-2)", color: "var(--muted)", border: "1px solid var(--border)" }
                }
              >
                {m === "journal" ? "📓 Journal entry" : "🎯 Goal"}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={mode === "goal" ? "What do you want to accomplish?" : "What's on your mind?"}
            className="w-full resize-none surface-2 px-3 py-2.5 text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs mono" style={{ color: "var(--muted)" }}>{toast}</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={save}
              disabled={saving || !text.trim()}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${agent.accent}, #b45309)` }}
            >
              {saving ? "Saving…" : "Save to vault"}
            </motion.button>
          </div>
        </div>

        {/* today's log */}
        <div className="surface overflow-hidden">
          <div className="px-4 py-2.5 text-xs uppercase tracking-wider hairline" style={{ color: "var(--muted)" }}>
            Today&apos;s log {content ? "" : "· empty"}
          </div>
          <pre className="p-4 text-[12.5px] leading-relaxed mono whitespace-pre-wrap" style={{ color: "#cbd5e1", maxHeight: 380, overflow: "auto" }}>
            {content || "Nothing saved today yet. Chats, goals, and journal entries will appear here."}
          </pre>
        </div>
      </div>
    </div>
  );
}
