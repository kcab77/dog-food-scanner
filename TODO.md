# PawGrade / Common Sense Dog — To-Do

Running list of things to do. Just tell Claude "add this to my to-do" and it goes here.
Check items off with `[x]` when done.

---

## 🚨 SECURITY — do BEFORE redeploying the assistant (got abused last time)

Root cause last time: public AI endpoints with NO rate limiting + weak protection
(`/api/chat` only checks a spoofable Origin header; app "secret" is `EXPO_PUBLIC_*`
so it's baked into the app bundle and extractable). Someone hit it unlimited times
and burned Anthropic tokens.

- [x] **Anthropic spend cap** — Kyle uses prepaid credits, so loss is bounded to whatever's loaded. ✅ (Still: an attacker can burn the WHOLE balance + take the assistant offline for real users — rate limiting is what prevents that.)
- [x] **Rotate `ANTHROPIC_KEY`** — done.
- [~] **Upstash Redis rate limiting** — CODE DONE (lib/ratelimit.ts + wired into all 4 AI routes, 20 req/60s per IP, fails open until configured). Packages installed. **You just need to:**
      1. Create free account at upstash.com → new Redis database
      2. Copy its `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
      3. Add both as env vars in Vercel (Project → Settings → Environment Variables)
      4. Redeploy. That's it — limiter activates automatically once the env vars exist.
- [ ] **Proxy the Go-UPC key server-side** — move `EXPO_PUBLIC_GOUPC_KEY` out of the app; have the app call your `/api/barcode` and keep the paid key on the server only.

## 🔥 Next update (do these soon)

- [ ] **Deploy commonsensedog.com (Vercel)** — pushes the holistic + Pinecone-first Coach live to ALL existing PawGrade installs (server-side, no App Store resubmission needed). ⚠️ Do the SECURITY items above FIRST.
- [ ] **Ship holistic-vet legal disclaimer** — already coded in `/api/coach` + `/api/chat` ("consult a holistic/integrative vet" + "educational, not medical advice"). Just verify & deploy.
- [ ] **Build standalone AI assistant section** (no-scan chat) — THE GOLDMINE. Own entry point + paywall. Reuses existing holistic+Pinecone backend. ⚠️ Make sure rate limiting is live before this ships — a free-to-chat screen is the #1 abuse target.

## 📱 PawGrade app

- [ ] Submit PawGrade v1.7.0 to App Store
- [ ] Fill in affiliate links
- [ ] Fix Supabase RLS on scans table
- [ ] Upgrade UPC Item DB to paid plan (one-line code change once API key is ready)

## 🌐 Website / AI

- [x] Make AI assistant Pinecone-first (chat + coach) — done 2026-06-11
- [x] Lock AI to 100% holistic (no synthetic/harmful ingredients, whole foods/natural medicine first) — done 2026-06-11

## 🧪 SaaS / PetChat

- [ ] Deploy Pet Store Agent to Railway
- [ ] Send follow-up email to pet store (chat-hours objection) — ~2026-03-25

## 💡 Ideas / later

- [ ] Agent OS dashboard: add a "Run agent" button that calls Claude directly
- [ ] Agent OS dashboard: auto-push finished articles into `blog-data.ts` + Pinecone

---

*Last updated: 2026-06-11*
