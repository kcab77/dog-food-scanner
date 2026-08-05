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

- [x] **Fix omega handling — not all omega-3 is equally bioavailable** — DONE 2026-08-05. Split `OMEGA3_MARINE` / `OMEGA3_PLANT`, added a "Where the omega-3 comes from" results section, and credited marine sources with a +3 scoring bonus (a credit for fish/krill/algae rather than a penalty for flax). Knowledge pack `qa-omega-sources-2026-08-05.json` written for the assistant. Hershey's protocol corrected — its ~0.85:1 ratio is flax-driven; the krill, cod liver oil, salmon oil and added fish oil do the real work. Original note follows:
- [ ] ~~Fix omega handling~~ (original, 2026-08-02). Triggered by Simple Food Project. The app currently treats "omega-3" as one thing and credits the omega-6:3 ratio without asking where the omega-3 actually comes from. That overstates plant sources:
  - **Marine omega-3 (fish, krill, algae) = EPA/DHA**, the forms a dog can actually use.
  - **Plant omega-3 (flax, chia, canola) = ALA**, which a dog must convert to EPA/DHA — and dogs convert it *poorly* (commonly cited as well under ~10%). A flax-heavy food can advertise a great ratio while delivering little usable EPA/DHA.
  - **What to do:** distinguish the omega-3 SOURCE when scoring/explaining, and say so in the results copy (e.g. "this ratio comes mostly from flaxseed — dogs convert that form poorly"). Check what Simple Food Project's ~0.85:1 ratio is actually made of before repeating that number as an anti-inflammatory selling point (it's currently cited in Hershey's protocol and in the KB).
  - ⚠️ Touches scoring math → confirm the approach with Kyle before changing any numbers. Also worth a Pinecone pack + an answer page, since "is flaxseed omega-3 as good as fish oil for dogs?" is a real search query.
- [x] **Credit PREBIOTICS from vegetables/whole foods** — DONE 2026-08-05. `PREBIOTIC_SOURCES` (29 terms) + a gut-support panel that names both halves and says which is missing. Original note: The app recognises `PROBIOTIC_SOURCES` but nothing recognises the fibre that *feeds* those bacteria — so a food with real prebiotic content gets no credit for it.
  - **The point:** probiotics add bacteria; prebiotics feed the ones already there. Probiotics without prebiotic fibre are far less useful, and prebiotics alone still help. Whole-food produce is where this comes from, which fits the whole-food-first philosophy exactly.
  - **Common prebiotic sources to detect:** chicory root / inulin, dandelion greens, asparagus, Jerusalem artichoke, burdock root, pumpkin, sweet potato (resistant starch, more when cooled), green banana/plantain, mushrooms (beta-glucans), apple pectin, flaxseed.
  - **What to do:** add a `PREBIOTIC_SOURCES` constant, surface it in the results (likely alongside the existing probiotic/fibre reporting), and explain the pairing in the copy — "this has probiotics AND the fibre to feed them" is a genuinely useful distinction almost no other scanner makes.
  - ⚠️ If it affects the score (not just the explanation), confirm with Kyle first. Also worth a Pinecone pack — "prebiotics vs probiotics for dogs" is a real search query and pairs with the existing probiotics/gut-health content.
- [x] **Apply the SALT DIVIDER rule** — DONE 2026-08-05 as detection + copy, not scoring. `analyseSaltDivider()` finds salt, splits what follows into *marketing* ingredients (superfoods, produce) and *legitimate* sub-1% ones (vitamins, minerals, preservatives) — the nuance this note demanded. No scoring change: SUPERFOODS never scored, so there was no credit to withhold, and the note itself said the sentence beats a score change. Ingredient splitting shipped alongside. Original note: AAFCO requires ingredients in descending order by weight, and salt is typically included around 1% — so **everything listed below salt is trace-level**. The app currently reads the panel without weighting by position past that line, so a food can get credit for a "superfood" that's present in a sprinkle.
  - **What to do:** find salt on the panel, treat everything after it as trace, and say so in the results — "the blueberries are listed below salt, so this is a sprinkle, not a meaningful amount." That single sentence exposes fairy-dusting better than any score change.
  - ⚠️ **Important nuance — do NOT blanket-penalise below the line.** Plenty of ingredients work correctly at sub-1%: added vitamins/minerals, probiotics, preservatives, and potent extracts. The rule catches *marketing* ingredients (a token superfood), not everything. Penalising indiscriminately would be wrong.
  - **Related:** ingredient splitting is the companion trick (one ingredient split into several AAFCO forms — e.g. rice / brewers rice / rice flour — to push each further down the list and hide combined weight). Worth handling in the same pass.
  - ✅ Already researched and in the KB: `commonsensedog knowledge/Salt Divider Rule (2026-07-19).md` + Pinecone pack + the `/answers` page. The nutrition work is done; this is about wiring it into the scanner.
  - ⚠️ Touches scoring math → confirm with Kyle before changing numbers.
- [ ] **Treat scanner — rebuild, later** (added 2026-08-05, explicitly NOT now). Kyle wants this eventually, not yet. The dormant code is already in `app/index.tsx` (`TREAT_HARMFUL` 25 terms, `TREAT_OK_INGREDIENTS` 9, treat processing methods, `DENTAL_INGREDIENTS`) and the Treats tab is hidden rather than deleted — **don't delete any of it.** When it comes back it should inherit what the food scanner learned this week: the salt divider, ingredient splitting, protein allergen risk, and Ask AI per section. Treats also need their own scoring logic — a single-ingredient dehydrated liver treat and a complete diet can't share a scale.
- [ ] **Source the remaining uncited harmful ingredients** (added 2026-08-05). Only 34% of the 68 flagged ingredients carry a real source: 6 named studies, 17 regulatory bodies, 27 vague ("studies show"), and **18 with nothing at all**. Highest priority is **menadione** — Kyle's signature flag, currently uncited. Also uncited: `dl-methionine` `cellulose` `beet pulp` `ground wheat` `artificial flavor/flavour` `animal fat` `bone meal` `feather meal` `molasses` `sorbitol` `rendered fat` `ferric oxide` `retinyl palmitate/acetate` `dl-alpha tocopherol` `zinc oxide`. Web-verify per `PINECONE_PROTOCOL.md`; where no real evidence exists, say so plainly rather than inventing one — "no controlled dog trials, this is mechanistic" is an honest finding.
- [ ] **Change the app logo + App Store description** (added 2026-08-02) — new icon/branding and a rewritten listing. Description should now mention the dog profile + personalised AI coach, since that's new since the current listing was written.
- [ ] **Fix the Voyage billing organisation** (added 2026-08-02) — the payment method is on a different Voyage org than the one owning the API key, so it's still capped at 3 requests/min. Mitigated in code (retries on 429) but not cured: heavy traffic can still lose knowledge-base grounding. Easiest fix is creating a new API key under the org that HAS the card, then swapping it in the website, expert-platform, and local `.env`.
- [ ] Submit PawGrade v1.7.0 to App Store
- [x] Fill in affiliate links — DONE (verified 2026-08-03: 7 real `amzn.to` links in `SUPPLEMENT_RECS`, zero placeholders)
- [x] Fix Supabase RLS on scans table — DONE 2026-08-03. `scans` had an INSERT policy but no SELECT policy. Added a nullable `user_id` + scoped policy (`auth.uid() = user_id`) so signed-in users read only their own scans, and `is_dev` so Kyle's own testing can be filtered out. A blanket SELECT for `anon` was deliberately NOT used — the anon key is extractable from the app bundle.
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

*Last updated: 2026-08-05*
