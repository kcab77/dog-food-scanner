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
- [x] **Upstash Redis rate limiting** — DONE 2026-06-24. `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` added in Vercel; limiter (20 req/60s per IP) goes live on redeploy. Wired into all 5 AI routes (scan, chat, coach, ingredient, barcode).
- [x] **Proxy the Go-UPC key server-side** — DONE 2026-06-24. App now calls `/api/barcode` (with `x-app-secret`); the paid key lives only as server-side `GOUPC_KEY`, and `EXPO_PUBLIC_GOUPC_KEY` was removed from the app + `.env` so it's no longer baked into the bundle. Backend route is also rate-limited. (Takes effect in the next app build.)

## 🔥 Next update (do these soon)

- [ ] **Deploy commonsensedog.com (Vercel)** — pushes the holistic + Pinecone-first Coach live to ALL existing PawGrade installs (server-side, no App Store resubmission needed). ⚠️ Do the SECURITY items above FIRST.
- [x] **Ship holistic-vet legal disclaimer** — DONE 2026-06-24. Verified the holistic-vet + "educational, not medical advice" framing in both system prompts, AND added a deterministic server-side append (`lib/disclaimer.ts`) so a fixed disclaimer lands on EVERY `/api/coach` + `/api/chat` reply. Renders in both the website chat and the app's coach screen (no app rebuild needed). Ships with the redeploy.
- [ ] **Build standalone AI assistant section** (no-scan chat) — THE GOLDMINE. Own entry point + paywall. Reuses existing holistic+Pinecone backend. ⚠️ Make sure rate limiting is live before this ships — a free-to-chat screen is the #1 abuse target.

## 📱 PawGrade app

- [ ] **Fix omega handling — not all omega-3 is equally bioavailable** (added 2026-08-02). Triggered by Simple Food Project. The app currently treats "omega-3" as one thing and credits the omega-6:3 ratio without asking where the omega-3 actually comes from. That overstates plant sources:
  - **Marine omega-3 (fish, krill, algae) = EPA/DHA**, the forms a dog can actually use.
  - **Plant omega-3 (flax, chia, canola) = ALA**, which a dog must convert to EPA/DHA — and dogs convert it *poorly* (commonly cited as well under ~10%). A flax-heavy food can advertise a great ratio while delivering little usable EPA/DHA.
  - **What to do:** distinguish the omega-3 SOURCE when scoring/explaining, and say so in the results copy (e.g. "this ratio comes mostly from flaxseed — dogs convert that form poorly"). Check what Simple Food Project's ~0.85:1 ratio is actually made of before repeating that number as an anti-inflammatory selling point (it's currently cited in Hershey's protocol and in the KB).
  - ⚠️ Touches scoring math → confirm the approach with Kyle before changing any numbers. Also worth a Pinecone pack + an answer page, since "is flaxseed omega-3 as good as fish oil for dogs?" is a real search query.
- [ ] **Credit PREBIOTICS from vegetables/whole foods** (added 2026-08-02). The app recognises `PROBIOTIC_SOURCES` but nothing recognises the fibre that *feeds* those bacteria — so a food with real prebiotic content gets no credit for it.
  - **The point:** probiotics add bacteria; prebiotics feed the ones already there. Probiotics without prebiotic fibre are far less useful, and prebiotics alone still help. Whole-food produce is where this comes from, which fits the whole-food-first philosophy exactly.
  - **Common prebiotic sources to detect:** chicory root / inulin, dandelion greens, asparagus, Jerusalem artichoke, burdock root, pumpkin, sweet potato (resistant starch, more when cooled), green banana/plantain, mushrooms (beta-glucans), apple pectin, flaxseed.
  - **What to do:** add a `PREBIOTIC_SOURCES` constant, surface it in the results (likely alongside the existing probiotic/fibre reporting), and explain the pairing in the copy — "this has probiotics AND the fibre to feed them" is a genuinely useful distinction almost no other scanner makes.
  - ⚠️ If it affects the score (not just the explanation), confirm with Kyle first. Also worth a Pinecone pack — "prebiotics vs probiotics for dogs" is a real search query and pairs with the existing probiotics/gut-health content.
- [ ] **Apply the SALT DIVIDER rule to scoring + copy** (added 2026-08-02). AAFCO requires ingredients in descending order by weight, and salt is typically included around 1% — so **everything listed below salt is trace-level**. The app currently reads the panel without weighting by position past that line, so a food can get credit for a "superfood" that's present in a sprinkle.
  - **What to do:** find salt on the panel, treat everything after it as trace, and say so in the results — "the blueberries are listed below salt, so this is a sprinkle, not a meaningful amount." That single sentence exposes fairy-dusting better than any score change.
  - ⚠️ **Important nuance — do NOT blanket-penalise below the line.** Plenty of ingredients work correctly at sub-1%: added vitamins/minerals, probiotics, preservatives, and potent extracts. The rule catches *marketing* ingredients (a token superfood), not everything. Penalising indiscriminately would be wrong.
  - **Related:** ingredient splitting is the companion trick (one ingredient split into several AAFCO forms — e.g. rice / brewers rice / rice flour — to push each further down the list and hide combined weight). Worth handling in the same pass.
  - ✅ Already researched and in the KB: `commonsensedog knowledge/Salt Divider Rule (2026-07-19).md` + Pinecone pack + the `/answers` page. The nutrition work is done; this is about wiring it into the scanner.
  - ⚠️ Touches scoring math → confirm with Kyle before changing numbers.
- [ ] **Change the app logo + App Store description** (added 2026-08-02) — new icon/branding and a rewritten listing. Description should now mention the dog profile + personalised AI coach, since that's new since the current listing was written.
- [ ] **Fix the Voyage billing organisation** (added 2026-08-02) — the payment method is on a different Voyage org than the one owning the API key, so it's still capped at 3 requests/min. Mitigated in code (retries on 429) but not cured: heavy traffic can still lose knowledge-base grounding. Easiest fix is creating a new API key under the org that HAS the card, then swapping it in the website, expert-platform, and local `.env`.
- [ ] Submit PawGrade v1.7.0 to App Store
- [x] Fill in affiliate links — DONE (verified 2026-08-03: 7 real `amzn.to` links in `SUPPLEMENT_RECS`, zero placeholders)
- [ ] Fix Supabase RLS on scans table
- [x] Upgrade UPC Item DB to paid plan — DONE May 2026 ($75 plan; lookups working, results cached in Supabase)
- [ ] **Set up a real email provider for sign-in** (added 2026-08-02) — Supabase's built-in email only sends a few per hour, fine for testing but not launch. Add Resend/SendGrid SMTP under Authentication → Emails before the profile feature ships publicly.

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

*Last updated: 2026-08-03*
