"use client";

import { useEffect, useState } from "react";
import type { AgentConfig } from "@/lib/agents";
import Avatar from "./Avatar";
import ClaudeConsole from "./ClaudeConsole";
import AgentPanel from "./AgentPanel";
import ProjectsPanel from "./ProjectsPanel";
import PetHealthChat from "./PetHealthChat";
import JournalPanel from "./JournalPanel";

export default function AgentView({ agent }: { agent: AgentConfig }) {
  const [running, setRunning] = useState(false);
  const showStatus = agent.kind === "server" || agent.kind === "shell";

  useEffect(() => {
    if (!showStatus) return;
    let alive = true;
    async function tick() {
      try {
        const r = await fetch("/api/agents");
        const d = await r.json();
        if (!alive) return;
        const s = (d.statuses as { id: string; running: boolean }[]).find((x) => x.id === agent.id);
        setRunning(!!s?.running);
      } catch {}
    }
    tick();
    const t = setInterval(tick, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [agent.id, showStatus]);

  return (
    <div className="flex h-full flex-col">
      {/* chat-app style header */}
      <header className="hairline px-6 py-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.015)" }}>
        <Avatar agent={agent} size="md" status={showStatus ? running : null} />
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold leading-tight flex items-center gap-2">
            {agent.name}
            {showStatus && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: running ? "rgba(52,211,153,0.14)" : "rgba(154,163,178,0.12)", color: running ? "var(--emerald)" : "var(--muted)" }}>
                {running ? "online" : "offline"}
              </span>
            )}
          </h1>
          <p className="text-[12px] truncate" style={{ color: "var(--muted)" }}>{agent.tagline}</p>
        </div>
      </header>

      {/* body */}
      <div className="flex-1 min-h-0">
        {agent.kind === "claude" && <ClaudeConsole agent={agent} />}
        {agent.chat && <PetHealthChat agent={agent} />}
        {(agent.kind === "server" || agent.kind === "shell") && !agent.chat && <AgentPanel agent={agent} running={running} />}
        {agent.kind === "journal" && <JournalPanel agent={agent} />}
        {agent.kind === "projects" && (
          <div className="h-full overflow-y-auto p-6">
            <ProjectsPanel />
          </div>
        )}
      </div>
    </div>
  );
}
