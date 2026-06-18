#!/bin/bash
# One command for the whole thing:
#   - Brain OS  (your Obsidian vault: List + Galaxy)  on http://localhost:4318
#   - agent-os  (your command center)                 on http://localhost:4317, embedded as a tab
# Opens the browser to Brain OS. Click the "Agent OS" tab to see your dashboard.
# Press Ctrl+C to stop both.
cd "$(dirname "$0")"

echo "🧠 Starting Brain OS (vault) on :4318 ..."
( cd brain-os && node server.mjs ) &
BRAIN_PID=$!

echo "🛠  Starting agent-os on :4317 ..."
( bash agent-os/start.sh ) &
AGENT_PID=$!

sleep 2
open "http://localhost:4318" 2>/dev/null || true

echo ""
echo "✅ Dashboard up:  http://localhost:4318  (Agent OS is a tab inside it)"
echo "   Press Ctrl+C to stop both."
trap "kill $BRAIN_PID $AGENT_PID 2>/dev/null; exit 0" INT TERM
wait
