"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentConfig } from "@/lib/agents";
import Avatar from "./Avatar";
import Composer from "./Composer";
import { saveToVault } from "@/lib/vault";

type Msg = { role: "user" | "assistant"; content: string };
type Pet = { petId: string; name: string; species: string; breed?: string };

// Real chat with the Pet Health Assistant Express server (SSE streaming).
export default function PetHealthChat({ agent }: { agent: AgentConfig }) {
  const base = agent.baseUrl || "http://localhost:3002";
  const [state, setState] = useState<"checking" | "offline" | "ready">("checking");
  const [starting, setStarting] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const loadHistory = useCallback(
    async (id: string) => {
      try {
        const r = await fetch(`${base}/api/pets/${id}/chat`);
        setMessages(r.ok ? await r.json() : []);
      } catch {
        setMessages([]);
      }
    },
    [base]
  );

  const connect = useCallback(async () => {
    setState("checking");
    try {
      const r = await fetch(`${base}/api/pets`);
      if (!r.ok) throw new Error();
      let list: Pet[] = await r.json();
      // seed a default pet (Hershey) if none exist yet
      if (list.length === 0) {
        await fetch(`${base}/api/pets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Hershey",
            species: "dog",
            breed: "Labrador mix",
            age: "8",
            weight: "75",
            conditions: "lipomas (managed holistically)",
            diet: "freeze-dried + gently cooked + raw",
          }),
        });
        list = await (await fetch(`${base}/api/pets`)).json();
      }
      setPets(list);
      const first = list[0]?.petId ?? "";
      setPetId(first);
      if (first) await loadHistory(first);
      setState("ready");
    } catch {
      setState("offline");
    }
  }, [base, loadHistory]);

  useEffect(() => {
    connect();
  }, [connect]);

  async function startServer() {
    setStarting(true);
    try {
      await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agent.id, action: "start" }),
      });
      // poll until it answers
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const r = await fetch(`${base}/api/pets`);
          if (r.ok) break;
        } catch {}
      }
      await connect();
    } finally {
      setStarting(false);
    }
  }

  async function switchPet(id: string) {
    setPetId(id);
    await loadHistory(id);
  }

  async function send() {
    const message = input.trim();
    if (!message || streaming || !petId) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const res = await fetch(`${base}/api/pets/${petId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
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
        let idx;
        while ((idx = buf.indexOf("\n\n")) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 2);
          if (!line.startsWith("data:")) continue;
          const data = JSON.parse(line.slice(5).trim());
          if (data.text) {
            assistantText += data.text;
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + data.text };
              return copy;
            });
          } else if (data.error) {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${data.error}` };
              return copy;
            });
          } else if (data.done && assistantText.trim()) {
            saveToVault({ kind: "chat", agent: agent.name, user: message, assistant: assistantText.trim() });
          }
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "⚠️ Lost connection to the Pet Health server." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  // ── Offline / loading states ───────────────────────────────────────────────
  if (state !== "ready") {
    return (
      <div className="grid h-full place-items-center p-6 text-center">
        <div>
          <div className="mx-auto mb-4 w-fit"><Avatar agent={agent} size="lg" /></div>
          {state === "checking" ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Connecting to {agent.name}…</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Server is offline</h2>
              <p className="text-sm mt-1 mb-5" style={{ color: "var(--muted)" }}>
                Start the Pet Health server to begin chatting.
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={startServer}
                disabled={starting}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${agent.accent}, #059669)` }}
              >
                {starting ? "Starting…" : "▶ Start server"}
              </motion.button>
              <p className="text-[11px] mt-3 mono" style={{ color: "var(--muted)" }}>
                needs ANTHROPIC_API_KEY in pet-health-assistant/.env
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Chat ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {pets.length > 0 && (
        <div className="px-6 pt-3 flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>Pet:</span>
          <select
            value={petId}
            onChange={(e) => switchPet(e.target.value)}
            className="surface-2 text-xs px-2.5 py-1.5 outline-none"
            style={{ color: "var(--text)" }}
          >
            {pets.map((p) => (
              <option key={p.petId} value={p.petId} style={{ background: "#14161d" }}>
                {p.name} · {p.species}
              </option>
            ))}
          </select>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="mt-14 text-center">
              <div className="text-lg font-semibold">Chat with {agent.name}</div>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Ask about nutrition, supplements, or symptoms — tailored to your pet&apos;s profile.
              </p>
            </div>
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
                <div className={`max-w-[78%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      m.role === "user"
                        ? { background: "var(--panel-2)", border: "1px solid var(--border)" }
                        : { background: "rgba(255,255,255,0.02)", border: `1px solid ${agent.accent}33` }
                    }
                  >
                    {m.content || (streaming && i === messages.length - 1 ? <span className="typing"><span></span><span></span><span></span></span> : "")}
                  </div>
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
        disabled={streaming}
      />
    </div>
  );
}
