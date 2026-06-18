# Agent OS — your local command center (v2)

A localhost command center that doesn't just *list* your work — it *runs* it.
Tracks projects, tasks, content, and agent prompts, AND pulls live data from your
real app, runs your SEO agents through Claude, and pushes finished articles into
Pinecone. Runs entirely on your machine.

## Run it

```bash
./agent-os/start.sh
```

Opens **http://localhost:4317**. `Ctrl+C` to stop.

> Needs Node (you have v24). The server reads your keys from
> `common-sense-dog-ai/.env.local` **at runtime** — it never copies, moves, or
> ships them. It only ever runs locally.

## What's live in v2

**🔴 Live data (Dashboard)** — real scan count, average score, feedback count, and
recent scans pulled straight from Supabase. No manual entry.

**▶ Run agents (Agents tab)** — hit **Run** on any agent, fill the `{{VARIABLES}}`,
and it calls Claude through the local server (key stays server-side). Output can be
copied or **saved as a draft**. Chain them: Keyword → Outline → Writer → Linker.

**✍️ Drafts → Pinecone (Content tab)** — saved drafts appear with a **Push to
Pinecone** button that runs your existing `process_content.mjs` pipeline.
⚠️ Pushing costs Anthropic + Voyage tokens — it asks for confirmation first.

**✅ TODO.md sync (Tasks tab)** — the Tasks tab reads and writes `TODO.md` directly.
Check a box in the browser, it updates the file. The file is the single source of
truth — tell Claude "add X to my to-do" and it shows up here too.

## Static fallback

If you open `index.html` directly (no server), it still works for projects/agents
(stored in your browser) — but live data, Run, drafts, and TODO sync are disabled
until you start the server. The UI tells you when it's in static mode.

## Data & safety

- Projects / content / agent prompts: saved in your browser (localStorage), Export/Import to JSON.
- Tasks: live in `TODO.md` (version-controlled in the repo).
- Drafts: saved to `agent-os/drafts/`.
- Keys: read from `common-sense-dog-ai/.env.local` at runtime, never stored here.
