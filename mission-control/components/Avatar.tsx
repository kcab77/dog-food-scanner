import type { AgentConfig } from "@/lib/agents";

// Per-agent avatar: a soft gradient tile with the agent's emoji/logo, plus an
// optional live status dot. Gradient is derived from the agent's accent color.
function gradientFor(accent: string) {
  return `linear-gradient(140deg, ${accent}, ${accent}99 40%, #1f2330)`;
}

export default function Avatar({
  agent,
  size = "md",
  status,
}: {
  agent: AgentConfig;
  size?: "sm" | "md" | "lg";
  status?: boolean | null; // true=running, false=stopped, null/undefined=no dot
}) {
  const cls = size === "sm" ? "avatar avatar-sm" : size === "lg" ? "avatar avatar-lg" : "avatar";
  const px = size === "sm" ? 36 : size === "lg" ? 48 : 42;
  return (
    <div className={cls} style={{ width: px, height: px, background: gradientFor(agent.accent), boxShadow: `0 6px 18px ${agent.accent}33` }}>
      <span style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.4))" }}>{agent.emoji}</span>
      {status != null && (
        <span className="status-dot" style={{ background: status ? "var(--emerald)" : "#3a4151" }} />
      )}
    </div>
  );
}
