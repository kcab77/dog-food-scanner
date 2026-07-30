#!/bin/bash
# Double-click me → opens PawGrade in your browser (web preview).
# The scan screen + demo buttons work; camera is limited on web, so use
# the "Try a sample scan" buttons to see the full results screen.
cd "$(dirname "$0")"
npx expo start --web
