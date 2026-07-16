# PawGrade — Complete App Specification (rebuild brief)

**Purpose of this file:** hand this to any Claude/Fable session and it has everything
needed to understand or rebuild the PawGrade app without guessing. Numbers here were
pulled from the real source (`app/index.tsx`, `lib/theme.ts`), not from memory. If you
change the app, update this file.

> Companion docs: `CLAUDE.md` (working rules + guardrails), `lib/theme.ts` (the visual
> source of truth). This file is the *what*; CLAUDE.md is the *how you're allowed to
> touch it*.

---

## 1. What PawGrade is

An iOS app (React Native / Expo) that scans a dog food's barcode or ingredient label and
returns a **0–100 quality score** plus a plain-language, non-judgmental breakdown of
*why* — and how to make the bowl better. Built by Kyle Cabral. Companion website +
AI assistant is `commonsensedog.com`.

**Core promise / voice:** "I fed my dog kibble for six years because I couldn't afford
better — I'm not here to judge you." Every screen must inform, never shame. Professional
≠ cold. This voice is the product's differentiator; do not sand it off.

**Primary flow:** open → (disclaimer once) → scan screen → point at barcode OR tap to
photo-scan the ingredient label → results screen (score + breakdown + how to improve).

---

## 2. Tech stack

| Layer | Tech |
|---|---|
| App | React Native + Expo (Expo Router), TypeScript, single screen in `app/index.tsx` |
| Camera / scan | `expo-camera` (`CameraView`, barcode + photo capture) |
| Styling | `StyleSheet` + `lib/theme.ts` design tokens (no external UI lib) |
| Data / logging | Supabase (`products`, `ingredients`, `scans`, `feedback`, `barcode_quota`) |
| App backend (the "brain") | `commonsensedog.com/api/*` — Next.js on Vercel. App calls `/api/scan` (Claude Vision OCR+analysis), `/api/coach`, `/api/ingredient`. Keys live server-side; app sends `x-app-secret`. |
| Barcode lookup | Own Supabase DB first → Open Pet Food Facts → Open Food Facts → (Go-UPC, currently disabled) → UPC Item DB → fall back to photo scan |
| AI assistant knowledge | Pinecone `dog-knowledge-database` (voyage-3 embeddings) — powers the website chat/coach, NOT the scanner |

Build/deploy: EAS (`eas build -p ios`, `eas submit`). Use `EAS_NO_VCS=1` if git is flaky.
`.easignore` must let `.env` through so `EXPO_PUBLIC_APP_SECRET` bakes in (else `/api/*` → 403).

---

## 3. Scoring algorithm — DO NOT CHANGE without Kyle's OK

This is the heart of the product and is **presentation-independent**. A revamp must never
alter these numbers. (Two near-identical copies exist in `app/index.tsx` — the live scan
path and a demo path; keep them in sync.)

**Base:** `total = 60`

**Processing method** sets a hard score cap AND a penalty (whichever binds):
| Method | Cap | Penalty |
|---|---|---|
| Raw / raw frozen | 100 | 0 |
| Freeze-dried | 100 | 0 |
| Gently cooked | 88 | small |
| Air-dried / dehydrated | 82 | small |
| Baked / oven-baked | 55 | moderate |
| **Kibble / extruded / dry** | **35** | **-40** |
| Unknown | 75 | — |

**Harmful ingredients** (`HARMFUL_INGREDIENTS`, ~70 entries): penalty =
`SEVERITY_PENALTIES[severity] × positional multiplier`, capped at −10 each.
- Severity base: `mild 2, moderate 10, severe 18, toxic 28`
- Positional multiplier by ingredient index: `<5 → 1.0`, `<10 → 0.65`, `<20 → 0.40`, `else 0.20`
  (things near the top of the list count for more; trace amounts count for less)
- Menadione (synthetic K3) is "severe".

**Carb penalties** (estimated from high-carb ingredient positions):
- carb is #1 ingredient + ≥2 carb sources → −32
- carb is #1 → −25 · multiple carbs in top 2 → −22 · carb in top 2 → −12
- ≥3 carb sources → −10 · ≥2 in top 5 → −5 · single/low → 0

**Other penalties:** vague protein sourcing ("meat meal", "animal fat") in top 5 → −12.

**Bonuses:** organ meats `+5 each (max +25)` · whole-food produce `+2 each (max +10)` ·
anti-inflammatory ingredients `+3 each (max +12)` · no synthetic vitamins `+8` ·
good omega-6:3 ratio (varies) · on TAPF trusted list `+10` · AAFCO feeding-trial verified `+5` ·
dental-benefit ingredients `+3 each (max +9)`.

**Final:** `total = min(total, processingCap)` then `max(5, round(total))`. **Score floor = 5.**

**Labels** (`scoreLabel()` in `lib/theme.ts`, presentation only — softened, no shame):
`90+ Excellent · 75+ Great · 60+ Good · 45+ Fair · 30+ Below Average · <30 Low Quality`

**Colors** (`scoreColor()`): `≥75 good(green) · ≥55 moderate(yellow) · ≥35 high(orange) · else critical(red)`

---

## 4. The knowledge base — 29 data constants (all in `app/index.tsx`)

These ARE the app's intelligence. All must remain used. (Counts approximate.)

**Ingredient judgment:** `HARMFUL_INGREDIENTS` (~70: term/reason/severity) · `SEVERITY_PENALTIES` ·
`SEVERITY_COLORS` · `TOXIC_ADDITIVES` · `VITAMIN_MINERAL_PENALTIES` · `ADDED_VITAMINS`.

**Protein / meal classification:** `NAMED_MEALS` · `GENERIC_MEALS` · `MEAT_MEALS` ·
`GENERIC_PROTEIN_TERMS` · `SPECIFIC_PROTEIN_TERMS`.

**Carbs / fillers:** `LENTIL_LEGUME` · `HIGH_CARB_INGREDIENTS`.

**Whole-food bonuses:** `ORGAN_MEATS` · `SUPERFOODS` · `WHOLE_FOOD_PRODUCE` ·
`ANTI_INFLAMMATORY_FOODS` · `ORGAN_COVERAGE` *(⚠️ defined but NOT currently rendered —
wire in or leave, ask Kyle)* · `HIGH_FIBER` · `PROBIOTIC_SOURCES` · `INGREDIENT_NUTRIENTS`.

**Trust signals:** `AAFCO_TRIAL_KEYWORDS` · `TAPF_APPROVED_BRANDS` · `PROCESSING_METHODS`.

**Recommendations / content:** `SUPPLEMENT_RECS` (**exactly 7 affiliate cards, fixed order:**
Probiotics → Fish Oil → Green Lipped Mussel → Heart → Liver → Detox → Four Leaf Rover) ·
`GROCERY_FINDS` (~16) · `DENTAL_INGREDIENTS`.

**Dormant (Treats scanner, hidden but must stay):** `TREAT_HARMFUL` · `TREAT_OK_INGREDIENTS`.

---

## 5. Scan pipeline (`handleBarCodeScanned`)

1. Own Supabase `products` DB (owned sources: `smartscan`, `manual`) — trusted, served first
2. Open Pet Food Facts API
3. Open Food Facts API
4. Supabase products (broader) — with a French-text guard to reject mis-imported EU rows
5. ~~Go-UPC~~ **disabled** (`GOUPC_ENABLED = false`, subscription cancelled) — flag exists to re-enable
6. UPC Item DB (name/brand only)
7. Sanity check the ingredient text; if junk or nothing found → **auto-switch to photo Smart Scan**

Smart Scan sends the label photo to `/api/scan` (Claude Vision) → extracts ingredients +
processing method → saved as a `smartscan` row. Guaranteed Analysis panel photo → `/api/*`
→ real protein/fat/fiber/moisture/carbs/omega numbers cached to the product.

Food type is auto-detected by Claude Vision (`result.processing_method`); a manual
food-type picker appears only when detection is Unknown.

---

## 6. Results screen — all 16 sections must render (order in CLAUDE.md)

1. **Score hero** — circular score ring (color = verdict) on dark ground
2. Compassionate note from Kyle ("don't feel bad…")
3. "Here's how to improve" card (`getNextStep()`)
4. Why This Score — the +/− breakdown ledger
5. Guaranteed Analysis — protein/fat/fiber/moisture/carbs + omega ratio (+ high-carb/lipoma note)
6. Processing Method
7. Ingredient Breakdown — colored ingredient pills, tap → detail modal
8. Ingredients to Watch — red-flag rows, tap → expand reason inline
9. Simple additions to upgrade the bowl (egg / sardines-or-fish-oil / kefir-yogurt)
10. Hershey's Protocol
11. Recommended Supplements — the 7 affiliate cards
12. Grocery Store Finds
13. Lipoma Prevention
14. TCVM / Protein Energetics
15. Dental Benefits + Dental Care Tips
16. FDA recall banner (when matched) + data-source / AAFCO / TAPF status line

**Behaviour that must survive:** ingredient pill → detail modal · red flag → inline expand ·
collapsible `AccordionSection`s · feedback modal · AI coach modal · dormant Treats code stays.

**Approved-but-not-yet-built** (from the prototype Kyle signed off on): DCM heart-risk panel
(grain-free + legume/potato pattern, FDA-linked, its own indigo `t.dcm`), a formal
5-section reorder (Concerns → Additions → DCM → Processing → Community), and a
community "suggest an edit" moderation queue.

---

## 7. Design system — `lib/theme.ts` (the ONLY place colors live)

Zero raw hex in components (currently 0 — keep it). To restyle the whole app, edit tokens here.

- **Grounds:** `bg #0C0E1A`, `surface #151830`, `surfaceAlt #1C2043`, `border #282E4E`
- **Text:** `textStrong #F0F2FA`, `text`, `textMuted #9198BC`, `textDim`, `textFaint`
- **Severity (produce palette):** `good/kale #35D89A` · `moderate/turmeric #F5C542` ·
  `high/carrot #FF9A3D` · `critical/chili #FF5E7E` · `toxic` (deep red)
- **`dcm` indigo `#8091FF`** — reserved EXCLUSIVELY for the DCM/heart category, never a severity tier
- Tokens are **semantic** (`t.critical`, not `t.chili`) so they stay true when values change
- Also exports `radius`, `space`, `type` scales, `scoreColor()`, `scoreLabel()`, `severityColor`
- Display face intent: SF Pro Rounded (carries the friendly, non-judgmental tone)

---

## 8. Hard rules for anyone rebuilding

1. **Edit in place. Never rewrite `app/index.tsx` from scratch** — a past attempt did that
   and silently deleted half the app. Read the real code, make targeted edits.
2. **Delete nothing.** Restyling changes *how* info shows, never *whether*. Cutting something?
   Ask Kyle.
3. **Never touch the scoring math** (section 3), API calls, Supabase, Pinecone, or keys.
4. **Colors only via `lib/theme.ts`.** No raw hex in components.
5. Before "done": `npx tsc --noEmit` clean (app/ + lib/), walk the 16-section + 29-constant
   checklist, confirm 0 hex literals, report ✅ per item. You cannot run the app — say so.

---

*Numbers verified against source 2026-07-16. Keep this file current when the app changes.*
