#!/usr/bin/env bash
# Mission Control — local launcher.
cd "$(dirname "$0")"
( sleep 3; open "http://localhost:3000" 2>/dev/null ) &
npm run dev
