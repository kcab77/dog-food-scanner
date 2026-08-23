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

## 🔬 TOMORROW (2026-08-14) — apply the evidence-audit fixes

**Full findings + citations: `docs/EVIDENCE_AUDIT.md`.** Audit covered 4 batches;
**nothing has been applied to `app/index.tsx` yet.** Roughly half the app is still unaudited.

### 🎨 v1.8 ship blockers — these come FIRST, before any audit fixes

- [ ] **Finish the logo.** Round 7 (chocolate Lab profile, L1/L2/L3) is at the artifact — pick one,
  or send a photo of Hershey and I'll build the silhouette from his actual head proportions.
  Three rounds of hand-drawn attempts missed; a photo ends it.
- [ ] **Test the decluttering — it has never run.** The four doors, the Layer 1 card and 26
  `AccordionSection`s tagged with `door=` are all built and **completely untested**. `npx expo start`
  → `w` → Type In mode. **Nothing was deleted — all 16 sections and 29 data constants are still
  there, just no longer all on screen at once.** This is the "less cluttered but keeps all the
  info" work; it's done, it just needs to be run once.
- [ ] **The three shipping bugs** — delete `app/(tabs)/` (renders a visible "(tabs)" tab in the
  live app), demote the disclaimer gate to a link, fix `SUPPLEMENT_RECS[2]` (variable named
  `fishOil` points at Green Lipped Mussel). ⚠️ The third touches affiliate cards — confirm first.
- [ ] **Then submit v1.8** with the name/subtitle/keywords from `docs/APP_STORE_LISTING.md`.
  ⚠️ Metadata locks once a version is live, so it can only ship attached to a build.

### ⛔ Blocked on Kyle — do these three decisions first

- [ ] **C1 · Fish oil dose.** Card says ~20mg/lb = 44 mg/kg. Joint trials used **60–100 mg/kg**
  (one RCT at 69 mg/kg × 3 months). **For Hershey that's 2,040–3,400 mg/day, not 1,500.**
  NRC ceiling ~5,200 mg. Fix = state maintenance AND joint dose separately. ⚠️ Changes advice.
- [ ] **C5 · Four Leaf Rover card.** Currently "research-backed" + "most trusted brand" — the
  brand's own marketing, on an affiliate link, naming no product and no evidence. Fix or cut.
  ⚠️ Affiliate revenue.
- [ ] **C6 · Cap severity by evidence tier.** ⚠️ **SCORING CHANGE.** Seven entries score harder
  than their own text supports — worst is `dl-methionine` at `moderate` while its text says
  *"no evidence of harm at label levels… a formulation signal rather than a hazard."* Also
  menadione `severe`, potassium sorbate `moderate`, corn syrup `severe`, wheat gluten,
  soy protein isolate, zinc oxide. Proposed rule: mechanism-only → `mild` max; observational →
  `moderate` max; only documented canine harm → `severe`/`toxic`.

### ✅ Safe to apply — no decision needed

- [ ] **C2** · Green lipped mussel: soften "most potent natural anti-inflammatory" → systematic
  review says **"a moderate amount of evidence."** Add citation.
- [ ] **C3** · Delete both "synergistic" claims (probiotics+fish oil, GLM+fish oil). Untested.
- [ ] **C4** · Verify or soften: heart "#1 dietary source of CoQ10"; milk thistle "most
  well-studied **in dogs**" (most silymarin research is human/rodent).
- [ ] **C7** · Replace 5× *"pet nutrition researchers"* with real citations or drop the appeal —
  corn gluten meal, peanut hulls, brewer rice, ground corn, grain fragments.
- [ ] **C8** · Cite or soften tbhq and sodium nitrite (both currently "some studies suggest").
- [ ] **C9** · Verify ground corn *"relatively low digestibility"* — **likely wrong.** Cooked
  ground corn digests fine; the honest criticism is nutritional value, not digestibility.
- [ ] **C10** · Reword the legume/DCM flag to the real mechanism (**protein displacement**, not
  legume toxicity) and say plainly that ingredient position is a **proxy** for taurine adequacy.
- [ ] **C14** · Kealy lifespan figures → **12.9 vs 11.1 years** (app says 13.0 vs 11.2),
  "roughly 15–16%" not 16%.
- [ ] **C16** · Name the study — author, journal, year — on every finding in `GDV_EVIDENCE`
  and `LIFESPAN_EVIDENCE`. Currently described but never attributed.

### 📄 Blocked on reading full papers

- [ ] **C15 · Three GDV claims may overstate their source.** Glickman 2000 (non-dietary,
  *JAVMA* 217(10):1492) abstract says several small meals, moistening, and water restriction were
  **"not associated with a decreased risk"** — which is NOT the same as "increases risk," and the
  app currently says the latter. The 4.2× citric-acid finding is **Raghavan's**, a different
  paper. **Read both in full before touching these three entries.**

### 🔨 New build work

- [ ] **C11** · Build `<EvidenceBadge>` — 5 tiers (Trial · Study · Mechanism · Clinical ·
  Owner reports), **saturation encodes confidence, hue does not encode judgement**. Tokens in
  `lib/theme.ts` — zero raw hex.
- [ ] **C12** · Tag every audited claim with its tier.
- [ ] **C13** · Add **rawhide** to `TREAT_HARMFUL` — missing entirely.
- [ ] **C17** · Unify the three existing tier vocabularies (`GDV_EVIDENCE.tier`,
  `LIFESPAN_EVIDENCE.strength`, `CARB_LEVELS.tier`). **Split into two fields** — evidence
  strength and actionability — they're currently conflated.

### ☠️ Exposure & cancer content (added 2026-08-13) — Kyle wants this in

**⚠️ Keep these two claims SEPARATE — conflating them is the mistake that gets the app dismissed:**

- [ ] **Lawn/garden chemicals → cancer.** There IS canine-specific research (Scottish Terrier
  bladder cancer and phenoxy herbicides; lymphoma and lawn treatment). **Verify the actual studies
  before either of us repeats the claim.** Strong, defensible, under-covered ground.
- [ ] **Isoxazolines (Simparica, Bravecto, NexGard).** The 2018 FDA class warning is about
  **neurologic adverse events — seizures, tremors, ataxia. It is NOT a cancer warning.** Pull the
  exact FDA language. *"The FDA issued a class-wide neurologic warning, here it is"* is unarguable;
  "causes cancer" is the sentence a vet screenshots.
- [ ] **Audit the existing flea/tick + isoxazolines Pinecone pack (19 pairs)** against today's
  standard. **Those went in before the evidence rule existed and make the strongest claims in the
  whole KB.**
- [ ] **Also uncited:** the Detox card already claims pesticide/lawn-chemical exposure and value
  "after flea treatments, vaccines" with no sources. Folds into **C4**.

**Where it lives:** NOT the results screen — that undoes the decluttering. It belongs in the AI
chat (the KB already has the pack) and as a v2.0 companion to the supplement scanner. Same question
as Yuka's move from food to cosmetics: *what am I exposing my dog to?*

### 🥉 Copper content (added 2026-08-13) — VERIFY BEFORE SHIPPING ANY OF IT

**⚠️ Verification status is uneven. Do not put the unverified rows in the app as stated.**

**✅ Solid — read directly off AllProvide's own nutrition panels (PDF pages 7 and 8):**

| AllProvide recipe | mg/1,000 kcal | mg/kg DM |
|---|---|---|
| Chicken (Signature) | 1.4 | 7.5 |
| Beef (Signature) | 3.4 | 17.0 |

Panel note confirms micronutrients are per 1,000 kcal; ×(kcal ME/kg DM ÷ 1000) gives the DM column
(beef 5019, chicken 5323). Verified against zinc, iron and manganese on both pages.

**✅ Verified via the clinical review** ([Today's Veterinary Practice](https://todaysveterinarypractice.com/internal-medicine/copper-hepatopathy-in-dogs/)):
normal hepatic copper 120–400 mg/kg DW · >600 potentially harmful · 400–600 manageable by diet ·
copper-restricted diets <0.12 mg/100 kcal (**1.2 mg/1,000 kcal**) · **hepatic enzymes are NOT
sensitive for subclinical stages** · predisposed breeds: Bedlington, Labrador, Doberman, West
Highland White, Dalmatian, Skye, Anatolian Shepherd, Welsh Corgi, Clumber Spaniel.

**❌ NOT verified — search summaries only. Fetch the primary sources first:**

- **AAFCO copper min 7.3 / max 25 mg/kg DM.** ⚠️ **I told Kyle earlier there was "no maximum" —
  that appears wrong or outdated and I corrected it mid-conversation. Get the actual AAFCO Dog Food
  Nutrient Profiles document before stating either version.**
- Smedley et al. 2009 (*Vet Pathology*) — hepatic copper higher in Labs after the 1997 change. **Read in full.**
- JAVMA 2021 "Is it time to reconsider current guidelines…" — **paywalled, abstract only.**
- The 1997 change itself (copper oxide → bioavailable forms; old ceiling 71 mg/1,000 kcal).
- Purina Pro Plan uses **copper proteinate** — from a retail listing, not Purina's label deck.

**App changes to make once verified:**

- [ ] **C19 · The Liver Treats card doesn't account for the base diet.** It recommends liver up to
  5% of diet — written as if the dog's food *isn't* already organ-rich. **On an organ-heavy complete
  diet (AllProvide has liver AND kidney in the top five) that stacks.** Add the conditional.
- [ ] **C20 · State the counterintuitive fact plainly: fresh/organ-rich food is NOT automatically
  lower in copper than kibble.** AllProvide beef is 17.0; the chicken kibble Hershey ate used
  copper proteinate. **Owners assume fresh = lower on everything. Here it isn't.**
- [ ] **C21 · Split "organs" in the copy — liver is the copper driver, kidney moderate, heart
  essentially none.** The app currently treats organ meats as one category.
- [ ] **C22 · Breed-risk note** for the nine predisposed breeds, with the honest caveat that
  screening is imperfect (enzymes miss subclinical stages) — surfaced only when a dog profile
  matches, not as another always-on section.

### ⏳ Still unaudited (~half the app)

`INGREDIENT_DB` (30) · `FISH_EPA_DHA` (17 species) · `DEFICIENCY_CHECKLIST` · `AA_EVIDENCE` ·
`HOMEMADE_EVIDENCE` · `EGG_QUALITY` · `BOWL_MATERIALS` · `GA_MINIMUM_TRAP` · `SARDINE_VS_OIL` ·
`TREAT_HARMFUL` · lipoma · dental · TCVM · Hershey's Protocol

---

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

*Last updated: 2026-08-22*

---

# 📌 Session 2026-08-08 → 08-12 — everything outstanding

## 🍎 App Store — do before resubmitting (free, ~30 min, biggest ROI available)

Baseline to beat: **143 impressions in 90 days, 0 product page views, 0 downloads.**
That's an invisibility problem, not a conversion problem. These edits are the cheapest fix.

- [ ] **App name → `PawGrade: Dog Food Scanner`** (26/30 chars). Heaviest-weighted search field. "PawGrade" alone is a term nobody searches.
- [ ] **Subtitle → `Know what's in the bag`** (22/30). Also indexed.
- [ ] **Keywords →** `kibble,raw,ingredients,label,nutrition,puppy,vet,allergy,grainfree,treats,rating,checker,toxic,additives`
      (100/100. No spaces after commas. Don't repeat words already in the name/subtitle — Apple indexes all three fields together and auto-combines.)
- [ ] **Description fix 1 — the cancer stat.** "1 in 2 dogs now develops cancer" is wrong. Veterinary Cancer Society says **1 in 4 dogs overall, almost 50% of dogs over age 10.** Use: *"Almost half of dogs over ten develop cancer."* True, sourced, hits harder. Also drop "now" — the rising-trend claim is confounded by better diagnostics and longer lifespans.
- [ ] **Description fix 2 — delete "No subscription."** A paid AI tier is planned; this line becomes a bait-and-switch. Keep "Free to download."
- [ ] **Description fix 3 — disclose affiliates.** "Scoring is never influenced by partnerships. Some product links are affiliate — they don't affect any score." Better than being caught by a reader who notices.
- [ ] **Screenshots** — first two do ~80% of the work. **Lead with a RESULT** (score + breakdown + a flagged ingredient), not the disclaimer screen. Add a short caption overlay to each.

## 🐞 Shipping bugs — fix before resubmit

- [ ] **Delete the `(tabs)` route.** `app/(tabs)/` is leftover Expo starter template and it renders a tab literally labelled "(tabs)" in the live app.
- [ ] **Demote the disclaimer gate.** Four bullets of legal text as screen one is the worst overwhelm offender in the app. Move to a one-line note + "Full disclaimer" link.
- [ ] **`SUPPLEMENT_RECS[2]` bug** — `app/index.tsx:2960`. Variable is named `fishOil`, comment says Fish Oil, but index 2 is Green Lipped Mussel. Wrong affiliate card shows on every low-scoring scan. One-character fix (`[2]` → `[1]`) — **needs Kyle's call, it changes which link earns.**
- [ ] **Two severity tiers contradict their own text.** Menadione is `severe` while its entry says harm to dogs hasn't been shown at food levels. Potassium sorbate is `moderate` after EFSA didn't confirm in-vivo genotoxicity. **Scoring change — needs Kyle's approval.**

## 🎨 Redesign — Kyle picked option D (Calm Card)

Mockups: https://claude.ai/code/artifact/2f6b7a08-f4b7-4003-8aa6-df49a5227627

- [ ] **Build the D home screen** — segmented control for Food/Treats/Type-in, one card owning the screen, plus the "New to this? What makes a food good — in 60 seconds" door (which doubles as the AI upsell hook).
- [ ] **Four doors on the results screen** — collapse ~22 accordion headers into: *What's in it · What to do · Health topics · Learn & tools.* Nothing deleted, everything two taps deep. **This is where the real clutter lives.**
- [x] **Layer 1 "short version" card** — DONE. Score + up to 3 flags (legumes-in-top-5 named as the FDA DCM pattern) + three evidence-backed additions + the permission-to-stop line.
- [ ] **Make the dog profile prominent.** It's currently a 34px 🐾 chip. It's also the activation moment — generic advice is free everywhere, "for an 8-year-old Lab with lipomas" is the product. Email is already captured automatically via Supabase OTP sign-in.

## 📚 Evidence gaps still open

- [ ] **The 7 supplement cards have zero citations** — the most exposed content in the app, since it's where money changes hands. Fish oil (Roush 2010, Smith 2007, Nasciutti 2021) and green lipped mussel (Bierer & Bui 2002, PCSO-524) evidence already exists elsewhere in the app — just needs wiring to the cards.
- [ ] **Probiotics** — real canine strain-specific evidence exists, none of it is in.
- [ ] **Republish the Scanner Tracker artifact** — 20+ new constants and 4 new sections since last publish. Same file path keeps the URL.
- [ ] **Treat list**: `TREAT_HARMFUL` (25 entries) has no citations, and **rawhide is missing** — probably the most common treat hazard in the aisle.

## 📣 Getting seen (ranked by leverage)

1. [ ] **Did the Dr. Judy Morgan email actually get sent?** Drafted 2026-08-03. One mention to her audience beats a year of the current impressions chart. If sent and no reply, follow up once.
2. [ ] **SEO pages** — the full plan already exists (`twinkly-churning-crystal.md`, unstarted). Phases A & B convert existing `qa-*.json` packs into indexed answer pages. **The content is already written; it's trapped in Pinecone, which Google can't read.** Mechanical fix, not a writing project.
3. [ ] **TikTok with a reveal hook** — "I scanned the 10 best-selling foods at Petco. Eight failed." The scanner is inherently visual. Informational framing got minimal traction; confrontational framing is the format that works.
4. [ ] **ASO** — the App Store section above.
- **Skip:** stickers on poop stations (brutal physical→install funnel), and Reddit/FB promotion (you've already hit the ban wall — the version that works is months of genuine participation).

## ❓ Unresolved data

- [ ] **Simple Food Project omega numbers.** The 4.93%/5.76% screenshot and the 5.2%/2.5% label can't both be right. Email SFP for the **typical** analysis (not guaranteed) with EPA and DHA in mg, for both duck and beef & salmon.
- [ ] **Woof Creek EPA/DHA per teaspoon.** All dosing rests on 410 EPA / 440 DHA per tsp — confirm off the bottle actually in the house.
- [ ] **Request Hershey's bloodwork numbers.** Platelets, ALT, T4, Anaplasma result. Already paid for; "everything looked good" isn't a number.

## 🐕 Hershey — active

- [ ] **Pull ALL hard chews for 2 weeks** — knuckle bones, wiffle balls, latex balls. Wiffle balls are the best fit for bilateral LOWER gum bleeding (that's where a ball presses). Keep chicken feet and raw carrots.
- [ ] **Brush the LOWER gum line specifically.** That's the spot a finger-and-gauze misses, and where the bleeding is.
- [ ] **Restart manuka honey** on the lower gums — it already helped the front teeth, and it's helping now.
- [ ] **HOLD the fish oil** until the gums are clear. Omega-3 lengthens bleeding time; sardines already put him at ~44 mg/kg. Don't add an antiplatelet effect during unexplained bleeding.
- [ ] **Then: beef switch** when the AllProvide chicken runs out. 4.8:1 → 1.12:1, AA 2.3 → 0.5, vit E 26 → 100. Keep sardines (beef has LESS absolute EPA/DHA) and the daily egg.
- [ ] **Check the ceramic bowl** — chipped or crazed? Stated lead-free? (10-second check; pet bowls aren't regulated like human tableware.)
- [ ] **Annual note each August:** how long on the ball field before he stops. Turns vague worry into a data point.
- **Not needed:** Ascophyllum kelp (no plaque or tartar to treat) · sweet potato for sprints (45 min of ball at 7pm ruled out glycogen) · protein reduction (seniors need MORE) · SFP percentage change (ratio is unaffected, and the two foods cost the same per calorie).

## ⚠️ Device testing

- [ ] **Nothing built 08-08→08-12 has run on a device.** ~2,300 new lines, 26 sections, Layer 1 card, treats tab re-enabled. No Xcode locally — use `npx expo start` then press `w` for web, and use Type In mode to paste an ingredient list.

---

## 📈 Growth — the play (full detail in `docs/GROWTH_PLAN.md`)

**Scan real foods yourself and publish every result on commonsensedog.com.** One activity does five
jobs: SEO, trust, proof the app works, a funnel to downloads, and TikTok content — and the app
generates the analysis, so Kyle is publishing output rather than writing articles.

- [ ] **Ship the App Store fixes first** — no point driving traffic to a broken listing
- [ ] **Scan and publish 25–30 brand pages**, 3–5 a week. Slug format: `is-purina-pro-plan-good-for-dogs`
- [ ] **⚠️ Publish the GOOD scores too.** If everything fails it reads as an axe to grind and the whole thing gets dismissed. Some foods scoring well is what makes the low scores credible.
- [ ] **Affiliate disclosure on every page**
- [ ] **Request indexing in Search Console** after each batch
- [ ] **Film the same scans for TikTok** — "I scanned the 10 best-selling foods at Petco. Eight failed." Reveal, not lecture.
- [ ] **Expert-AI platform: waits.** It needs one live PawGrade example first — see GROWTH_PLAN for the full reasoning, the competitive landscape (Delphi, Coachvox, BuddyPro), and the two angles worth taking when it's time.
