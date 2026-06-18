# Mission Control 🛰️

A gorgeous, local mission-control dashboard for driving **Claude** (via the Claude
Code CLI) and your other AI agents — all from one animated command center.
Next.js 16 · Tailwind v4 · Framer Motion. Runs 100% on your machine.

## Run it

```bash
./mission-control/start.sh      # or: cd mission-control && npm run dev
```

Opens **http://localhost:3000**.

## Sections (sidebar)

| Section | What it does |
|---|---|
| **✦ Claude** | Chat with Claude, bridged through the `claude` CLI on your machine. Shows cost + timing per reply. |
| **🐾 Pet Health Assistant** | Start / stop the Express server (`:3002`) and watch its live logs. |
| **⚡ Hermes** | Configurable agent — type its run command, hit Run, see output. |
| **🦞 OpenClaw** | Same — a configurable runner. Wire in the real command when ready. |
| **◈ Projects** | At-a-glance cards for everything in this repo. |

Add more agents by editing `lib/agents.ts` — they appear in the sidebar automatically.

## The Claude CLI bridge

`app/api/claude/route.ts` spawns your `claude` binary in print mode. It auto-detects
common install locations (`~/.claude/local/claude`, Homebrew, npm-global, etc.).

If Claude says it can't find the binary, find your path and set it:

```bash
which claude
echo "CLAUDE_BIN=/your/path/to/claude" >> mission-control/.env.local
```

## How agents run

`app/api/agents/route.ts` manages local processes (start/stop/logs) and one-off
shell runs. Process handles live in-memory for the dev session. The Pet Health
Assistant needs its own `ANTHROPIC_API_KEY` in the environment to actually answer
(it reads `process.env.ANTHROPIC_API_KEY`).

## Notes

- **Local only.** Nothing here is deployed; it spawns processes on your machine, so
  don't expose it to the internet.
- This is separate from `agent-os/` (the simpler localStorage dashboard). Mission
  Control is the heavier, prettier "command center" version.
