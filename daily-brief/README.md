# Daily Brief

A standalone Node tool that writes one dated markdown brief into the Obsidian vault each
morning. Three sections: **🎯 Today's Top 3 / Ventures** (from `TODO.md` + `focus.json`),
**🌿 Holistic Topic Scout** (trending topics proposed for review — never auto-ingested to
Pinecone), and **🐕 Hershey Health** (from his protocol + running log). Reads-only on your
repo and vault; the only thing it writes is new markdown under `Brain/Inbox/`.

## Setup
Create `daily-brief/.env` from `.env.example` and set two vars: `ANTHROPIC_API_KEY` (used by
the Anthropic SDK) and `VAULT_PATH` (`/Users/Kyle/Documents/Obsidian Vault` — note the space;
keep it unquoted). Install deps from the repo root: `npm install` (adds `@anthropic-ai/sdk`
and `dotenv`).

## Run manually
From the repo root: `npm run brief` (or `node daily-brief/brief.mjs`). It prints the path of
the brief it wrote. A failing section never blocks the others — it's replaced by a
`⚠️ section failed` placeholder so you still get a brief.

## Schedule (macOS launchd, 7 AM daily)
Confirm your node path with `which node` and update the first `<string>` in
`com.kyle.dailybrief.plist` if it isn't `/usr/local/bin/node`. Then:
```
cp daily-brief/com.kyle.dailybrief.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.kyle.dailybrief.plist
```
Test it immediately with `launchctl start com.kyle.dailybrief`; unload with
`launchctl unload ~/Library/LaunchAgents/com.kyle.dailybrief.plist`. Logs go to
`daily-brief/brief.log`.

## Where outputs land (in the vault)
- `Brain/Inbox/Daily Brief/<YYYY-MM-DD>.md` — the daily brief (regenerable; re-running a day overwrites only that file).
- `Brain/Inbox/Topic Review Queue.md` — running backlog of proposed topics (approve, then ingest yourself).
- `Brain/People/Hershey Health Log.md` — running health log; add observations and the brief reads recent ones back.

## Config
- `focus.json` — venture statuses/next-actions fed to the "what's next" agent. Edit freely.
- Model is a `const MODEL` at the top of each `agents/*.mjs` (default `claude-sonnet-4-6`; switch to `claude-haiku-4-5-20251001` to cut cost).
