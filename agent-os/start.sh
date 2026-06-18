#!/usr/bin/env bash
# Agent OS — local command center launcher (Node backend).
# Serves the dashboard + local API on http://localhost:4317 and opens your browser.
# Runs ONLY on your machine. Reads keys from common-sense-dog-ai/.env.local at runtime.
cd "$(dirname "$0")"
PORT=4317
( sleep 1; open "http://localhost:$PORT" 2>/dev/null ) &
node server.js
