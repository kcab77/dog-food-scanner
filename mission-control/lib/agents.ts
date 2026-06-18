// Central registry for every agent / project Mission Control manages.
// Add a new entry here and it shows up in the sidebar automatically.

export type AgentKind = "claude" | "server" | "shell" | "projects" | "journal";

export interface AgentConfig {
  id: string;
  name: string;
  kind: AgentKind;
  tagline: string;
  emoji: string;
  accent: string; // hex — drives the glow/theme of the section
  // server kind:
  cwd?: string; // path relative to the repo root
  command?: string; // start command
  port?: number;
  healthUrl?: string; // hit to detect "running"
  // shell kind:
  runCommand?: string; // default command (editable in the UI)
  configured?: boolean; // false = placeholder the user still needs to wire up
  docs?: string;
  // server kind that exposes a chat UI (proxied to its own endpoint):
  chat?: boolean;
  baseUrl?: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: "claude",
    name: "Claude",
    kind: "claude",
    tagline: "Your primary agent — via the Claude Code CLI",
    emoji: "✦",
    accent: "#8b5cf6",
  },
  {
    id: "pet-health-assistant",
    name: "Pet Health Assistant",
    kind: "server",
    tagline: "Express AI assistant — local server",
    emoji: "🐾",
    accent: "#34d399",
    cwd: "pet-health-assistant",
    command: "node server.js",
    port: 3002,
    healthUrl: "http://localhost:3002",
    chat: true,
    baseUrl: "http://localhost:3002",
  },
  {
    id: "hermes",
    name: "Hermes",
    kind: "shell",
    tagline: "Configurable agent — set its run command",
    emoji: "⚡",
    accent: "#22d3ee",
    runCommand: "# e.g. node hermes/start.js  (set your real command)",
    configured: false,
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    kind: "shell",
    tagline: "Configurable agent — set its run command",
    emoji: "🦞",
    accent: "#fbbf24",
    runCommand: "# e.g. python openclaw/run.py  (set your real command)",
    configured: false,
  },
  {
    id: "journal",
    name: "Journal & Goals",
    kind: "journal",
    tagline: "Auto-saved to your Obsidian vault",
    emoji: "📓",
    accent: "#f59e0b",
  },
  {
    id: "projects",
    name: "Projects",
    kind: "projects",
    tagline: "Everything in this repo, at a glance",
    emoji: "◈",
    accent: "#f472b6",
  },
];

// Static project cards for the Projects section (this repo).
export const PROJECTS = [
  { name: "PawGrade (iOS)", desc: "Dog food scanner, scores 0–100. v1.7.0.", color: "#34d399", status: "active" },
  { name: "Common Sense Dog", desc: "Next.js site + holistic AI chat (Pinecone RAG).", color: "#22d3ee", status: "active" },
  { name: "PetChat / Pet Store Agent", desc: "Embeddable pet store chat SaaS. Pending Railway.", color: "#fbbf24", status: "active" },
  { name: "Pet Health Assistant", desc: "Express AI assistant on :3002.", color: "#8b5cf6", status: "local" },
  { name: "Agent OS", desc: "Local command center (the simpler dashboard).", color: "#f472b6", status: "local" },
];
