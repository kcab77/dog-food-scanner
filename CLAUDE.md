# PawGrade — Project Documentation for Claude

## What This Project Is

**PawGrade** is an iOS app (React Native / Expo) that scans dog food barcodes or ingredient labels and scores them 0–100 based on ingredient quality, processing method, and nutritional value. Built by Kyle Cabral.

**commonsensedog.com** is the companion website with an AI chat assistant (Next.js + Claude API) that answers dog nutrition questions using a Pinecone knowledge base.

---

## 🧠 Obsidian Brain (read this for context)

Kyle keeps a single source-of-truth Obsidian vault at **`~/Documents/Obsidian Vault/`** (WITH a space — ignore the old, redundant no-space `~/Documents/ObsidianVault/`). It holds curated memory, full past conversation transcripts, and dog-nutrition knowledge.

- **Before answering** project/dog/nutrition questions, read **`index.md`** at the vault root FIRST — it's the maintained catalog of every page, and the entry point as of 2026-07-29. Load only what it matches (don't scan everything). Secondary routing: **`_Vault Map.md`** (topic → folder) and **`_Skills Map.md`** (task → which agent/tool/workflow). Then open only the matched note(s) — e.g. `Brain/claude-memory/dog-food-scanner/` (facts), `Brain/transcripts/dog-food-scanner/` (history), `Brain/Nutrition/`, `commonsensedog knowledge/`.
- **⚠️ The vault holds TWO brains** (separated 2026-08-03). 🐕 **Dog brain** = everything above.
  💼 **Expert brain** = `wiki/expert-platform/` only — the white-label assistant sold to other
  experts (code: `expert-platform/`, knowledge: Supabase pgvector, *not* the vault). File expert
  work there, never in `wiki/business/`. Never put a client expert's content in this vault. Map:
  `wiki/projects/Two Brains - separation map.md`.
- **Working on `expert-platform/`? Launch Claude from that directory** (`cd expert-platform && claude`)
  so the SessionEnd hook files transcripts/memory under `expert-platform` instead of lumping them
  into `dog-food-scanner`. The hook labels by launch directory.
- **Auto-sync:** a `SessionEnd` hook (`~/.claude/hooks/obsidian-sync.mjs`) exports memory + transcripts into the vault after **every** session — automatic, don't duplicate it. Kyle's standing wish: every session ends up in this vault.
- When you learn something durable, write a note (`Brain/Inbox/` by default) with frontmatter + `[[wikilinks]]`. Additive only — never delete vault content.

---

## 🥇 Precedence — who wins when two files disagree

There are several places that describe how things work. When they conflict, this is the
order. Without it, every duplicated fact is an unresolved argument.

1. **The code and the database** — always win over any prose. If `app.json` says the version
   and this file says something else, `app.json` is right and this file is a bug.
2. **This file** (repo `CLAUDE.md`) — the authority on *code, build, deploy, scoring, and app
   behaviour*.
3. **Vault `CLAUDE.md`** (`~/Documents/Obsidian Vault/`) — the authority on *knowledge:*
   how notes are written, filed, graded, and ingested. It does not govern code.
4. **`PINECONE_PROTOCOL.md`** — overrides everything on *what may enter the knowledge base*.
   Nothing else can relax it.
5. **Memory notes** (`~/.claude/projects/.../memory/`) — background only. Point-in-time
   observations that can be stale; verify against 1–2 before acting on them.

**When you find a conflict, fix the loser** — don't just work around it. That's how these
drift in the first place.

---

## 🔬 Evidence rule — ON FOR *YOUR OWN* RESEARCH, OFF FOR KYLE'S

**⚠️ CHANGED 2026-08-22 — read this before applying anything below.**

**Content Kyle provides is trusted. It goes in as given.** When Kyle pastes a document,
an infographic, a video summary, or tells you something directly, that comes from sources
he has already vetted — **do not re-verify it, do not rank it, do not attach confidence
tiers, and do not append caveats that undercut it.** Write it in his framing.

> *"you don't have to rank anything I tell you, only if I tell you to verify it for me."*
> — Kyle, 2026-08-22

**Verify only when Kyle explicitly asks you to.** Then the full checklist below applies.

**The rule below still governs research YOU initiate** — anything you go and look up
yourself, on your own initiative, to fill a gap. Your own web searching is not trusted
the way Kyle's sources are.

---

**A search-result summary is a pointer to a source, not the source.** Before stating any
study, number, dose, or finding **that you found yourself** — in chat, in the app, in
Pinecone, or in a note — **fetch the primary source and read the METHODS.**

The methods are where findings fall apart: route of administration (injected vs fed),
whether the groups ate different amounts, dose vs real-world exposure, in vitro vs in vivo,
species, randomised vs observational, pre-selected populations. Every reversal in this
project traces to skipping that step.

**Label confidence in the text itself** — *randomised · observational · mechanism only ·
not verified · no data in this species.* Say "uncertain" and stay there rather than
manufacturing a clean answer. Don't reverse a position without naming what new evidence
changed it.

Full checklist: the **`primary-sources`** skill (`~/.claude/skills/primary-sources/`).

---

## Project Structure

**Every top-level directory is listed here.** An unlisted folder is invisible to a fresh
session — it won't get searched, and you'll be told something isn't there when it is.
Add a line here whenever you add a directory. (Full product-level map: `PROJECTS.md`.)

```
dog-food-scanner/
│
│  ── 1. PawGrade iOS app (repo root IS the app) ──
├── app/                        # React Native / Expo screens
│   ├── index.tsx               # Main app — scanning, scoring, supplement recs
│   ├── dog-profile.tsx         # Dog profile form (feeds the AI coach)
│   └── login.tsx               # Email OTP sign-in
├── lib/                        # App-side helpers
│   ├── supabase.js             # Auth, dog profiles, scan/feedback logging
│   └── theme.ts                # 🎨 SINGLE SOURCE OF TRUTH for all app colour
├── components/ constants/ hooks/   # Expo starter scaffolding (largely unused)
├── storage/ assets/            # App storage helpers · icons, images, fonts
├── credentials/                # 🔒 iOS signing (gitignored — never commit)
│
│  ── 2. commonsensedog.com (Next.js website) ──
├── common-sense-dog-ai/
│   ├── app/
│   │   ├── page.tsx            # Home page with AI chat
│   │   ├── answers/[slug]/     # SEO answer pages
│   │   ├── library/[slug]/     # Health A–Z (generated from the Obsidian vault)
│   │   └── api/                # chat · coach · scan · ingredient · barcode
│   ├── lib/
│   │   ├── pinecone.ts         # Pinecone search + upsert helpers
│   │   ├── blog-data.ts        # ⚠️ Blog content lives HERE, not in the root lib/
│   │   ├── answers-data.ts     # SEO answer page content
│   │   └── library-data.ts     # AUTO-GENERATED — do not hand-edit
│   └── scripts/
│       ├── sync-library.mjs        # Obsidian vault → library-data.ts
│       ├── seed-pinecone.mjs       # Seeds knowledge summaries (--new-only supported)
│       ├── seed-blog-content.mjs   # Seeds full blog articles
│       ├── process_content.mjs     # File → Q&A pairs → Pinecone (uses Claude)
│       ├── ingest_pack.js          # Pre-written Q&A JSON → Pinecone (no Claude)
│       └── qa-*.json               # The Q&A packs themselves
├── common-sense-dog-ai-backup/ # ⚠️ KEY STORE ONLY — code has drifted, never run from it
│
│  ── 3. Expert platform (separate product, separate brain) ──
├── expert-platform/            # White-label expert AI — has its own CLAUDE.md
│                               # ⚠️ Run Claude FROM this dir for expert work
│
│  ── 4. Other ventures & tooling ──
├── pet-store-chat-agent/       # PetChat SaaS (embeddable pet-store agent)
├── agent-os/ brain-os/ daily-brief/   # Local dashboards + vault browser
├── supabase/                   # SQL migrations
├── scripts/                    # Repo-level utility scripts
│
│  ── 5. Docs & records ──
├── docs/                       # TODO.md · APP_SPEC.md · NUTRITION_NOTES.md · BLOG_POSTS.md
│                               # EVIDENCE_AUDIT.md 🔬 every app claim vs its primary source,
│                               #   + THE CHANGE LIST — read before editing any claim text
│                               # BREED_DIET_RULES.md 🐕 breed→food rules, ⚠️ UNVERIFIED —
│                               #   a list to check, not a reference to ship
│                               # SOURCES.md 📚 primary sources actually FETCHED AND READ,
│                               #   with funder + institution. Check here before researching twice
├── storm-reports/              # 🌩️ storm-research briefings (multi-lens, citation-verified)
│                               # APP_STORE_LISTING.md 🍎 canonical store copy — read before writing any
│                               # GROWTH_PLAN.md 📈 distribution + product roadmap (Yuka model,
│                               #   v1.8→v2.1 treats/supplements) + expert-partnership plan
├── audits/                     # /os-audit reports (dated)
├── drafts/                     # Work-in-progress writing
├── PROJECTS.md                 # The four products, mapped
├── PINECONE_PROTOCOL.md        # 🔒 MANDATORY before any KB addition
├── PINECONE_TODO.md            # Knowledge-pack tracker
└── CLAUDE.md                   # This file
│
│  ── 6. Inert (gitignored — nothing reads these) ──
├── _archive/                   # 403 MB of old material
├── _icloud-duplicates/         # Quarantined " 2" files; several DIFFER from originals
├── knowledge-vault/            # ⚠️ NOT the knowledge base — folded in, see its README
└── memory/                     # Legacy; Claude's real memory is in ~/.claude/projects/
```

---

## Nutrition Philosophy

Kyle's approach is evidence-based holistic dog nutrition:

- **Whole food over synthetic** — nutrients from food sources beat isolated synthetic vitamins
- **Processing method matters** — ranked: homemade > raw > freeze-dried > gently cooked > air-dried > wet > kibble
- **Omega ratio is critical** — target 5:1 omega-6:3 or lower (most kibble is 15:1–30:1)
- **Inorganic = bad** — sulfates, oxides, selenite accumulate and damage organs; chelated/proteinate = good
- **Like feeds like (TCVM)** — heart feeds heart (taurine, CoQ10), liver feeds liver (B12, iron), kidney feeds kidneys (selenium)
- **Inflammation is the root** — lipomas, cancer, arthritis all driven by chronic low-grade inflammation; fix the diet, fix the inflammation

Key dangerous ingredients: menadione (synthetic K3), sodium selenite, copper sulfate, BHA, BHT, ethoxyquin.

---

## Pinecone Knowledge Base

**Index:** `dog-knowledge-database`  
**Embeddings:** Voyage AI (`voyage-3`, 1024 dimensions)  
**Search threshold:** 0.5 confidence score, top 5 results injected into Claude context

### What's Stored (grows over time — was 39 seed entries + qa- packs added since)

| Prefix | Count | Script | Content |
|--------|-------|--------|---------|
| `blog-` | 30 | `seed-pinecone.mjs` | Topic summaries + brain dumps |
| `fullblog-` | 9 | `seed-blog-content.mjs` | Full blog article text |
| `qa-` | grows | `process_content.mjs` / `ingest_pack.js` | Q&A pairs (generated from files, or pre-written packs). Recent packs: supplement evidence (43), flea/tick + isoxazolines (19) |

### Adding New Knowledge

**Add a summary manually:**
Edit `common-sense-dog-ai/scripts/seed-pinecone.mjs`, add a new entry to the `posts` array, then run:
```bash
node common-sense-dog-ai/scripts/seed-pinecone.mjs --new-only
```

**Process any file into Q&A pairs (RECOMMENDED for new content):**
```bash
node common-sense-dog-ai/scripts/process_content.mjs <path-to-file>
```
This uses Claude to generate 50+ Q&A pairs from the file, embeds them, and upserts to Pinecone automatically.

**Ingest pre-written Q&A pairs (when Kyle hands you a JSON array of `{question, answer, topic, source}`):**
```bash
node common-sense-dog-ai/scripts/ingest_pack.js <pairs.json>
```
Embeds (voyage-3) and upserts directly — no Claude generation. IDs are `qa-<topic>-<n>` (collision-safe); skips near-duplicates (>0.95). After ingesting, also write a readable summary note into the Obsidian vault's `commonsensedog knowledge/`.

> ⚠️ **Do NOT run ingestion from `common-sense-dog-ai-backup/`.** That folder is a **key store**,
> not a working copy. Its scripts have drifted from live and verified different as of 2026-08-03:
> `lib/pinecone.ts` 116 lines vs live 99 (**the backup lacks the Voyage 429 retry/backoff**),
> `seed-pinecone.mjs` 364 vs 187, and it has no `lib/answers-data.ts` at all (none of the 50 live
> answer pages). Running from it succeeds silently while behaving differently from production.
> **If `.env.local` goes missing, copy the keys OUT of the backup into `common-sense-dog-ai/` and
> run from there.** Never the reverse.

---

## Auto-Processing New Content

**When Kyle drops a new file (markdown, text, brain dump) and asks you to process it:**

1. Run: `node common-sense-dog-ai/scripts/process_content.mjs <file-path>`
2. The script will generate Q&A pairs via Claude, embed them, and load them into Pinecone
3. No other steps needed — it handles everything automatically

**When Kyle writes new blog posts in `lib/blog-data.ts`:**
1. Add the full content to `seed-blog-content.mjs`
2. Run: `node common-sense-dog-ai/scripts/seed-blog-content.mjs --new-only`

---

## PawGrade Scoring System

*(Current version is whatever `app.json` → `version` says — don't trust a number written here.)*

Scoring algorithm (**do not change scoring without asking Kyle** — full detail + rationale in
`docs/APP_SPEC.md` § 3, keep that file in sync too):
- Base score: 60
- **Processing method is bonus-based, not cap-based (changed 2026-07-19).** Kibble is the
  neutral baseline — no penalty, no cap. Gentler formats earn a bonus instead: Raw/Freeze-dried
  +25, Gently Cooked +22, Air-Dried +18, Baked +8, Kibble/Unknown +0. `scoreCap` is now a
  uniform 100 everywhere (just the general ceiling).
- Harmful ingredient penalties: capped at -10 per ingredient, scaled by position (ingredients 20+ get 20% penalty)
- **Severity is capped by evidence tier (changed 2026-08-14, Kyle approved).** Mechanism-only or
  "formulation signal" → `mild` max. Observational/association → `moderate` max. Only documented
  canine harm → `severe`/`toxic`. Applied to seven entries: menadione severe→moderate, and
  potassium sorbate / corn syrup / dl-methionine / wheat gluten / soy protein isolate / zinc oxide
  → `mild`. **Rationale: those entries' own reason text said no canine harm had been shown while
  the score punished as if it had.** Penalties: mild 2 · moderate 10 · severe 18 · toxic 28.
  Full record: `docs/EVIDENCE_AUDIT.md` § C6.
- Score floor: 5
- Labels (softened 2026-07-12): 90–100 Excellent, 75–89 Great, 60–74 Good, 45–59 Fair,
  30–44 Below Average, <30 Low Quality

---

## 🚫 UI REVAMP RULES — DO NOT DELETE CONTENT (read before any UI work)

A past revamp **rewrote the results screen from scratch and silently deleted half the
app.** Never do this. When restyling:

1. **Edit `app/index.tsx` IN PLACE.** Never rewrite it from scratch or regenerate a
   section from memory. Read the real code first, then make targeted edits.
2. **Delete nothing.** Restyling changes *how* info is shown, never *whether* it's
   shown. If you think something should be cut → **ask Kyle, don't cut it.**
3. **Colours only via `lib/theme.ts` tokens.** The invariant is **zero** raw hex in components.
   Verify rather than trust: `grep -cE "#[0-9a-fA-F]{3,8}\b" app/index.tsx` must print `0`.
4. **Never touch the scoring math**, API calls, Supabase, or keys.
5. Before saying "done": run `npx tsc --noEmit` (app/ + lib/ must be zero errors), then
   walk the checklist below and report ✅ per item. You cannot run the app — say so.

**All 16 sections must still render:** compassionate note · "how to improve" card · Why
This Score · Guaranteed Analysis · Processing Method · Ingredient Breakdown pills ·
Ingredients to Watch · Simple additions · Hershey's Protocol · Recommended Supplements
(**all 7** cards: Probiotics→Fish Oil→Green Lipped Mussel→Heart→Liver→Detox→Four Leaf
Rover) · Grocery Store Finds · Lipoma Prevention · TCVM/Protein Energetics · Dental
Benefits + Tips · FDA recall banner · data-source/AAFCO/TAPF status.

**All 29 data constants must still be used:** `HARMFUL_INGREDIENTS` `SEVERITY_PENALTIES`
`SEVERITY_COLORS` `SUPPLEMENT_RECS` `TOXIC_ADDITIVES` `NAMED_MEALS` `GENERIC_MEALS`
`MEAT_MEALS` `ADDED_VITAMINS` `VITAMIN_MINERAL_PENALTIES` `LENTIL_LEGUME`
`HIGH_CARB_INGREDIENTS` `ORGAN_MEATS` `SUPERFOODS` `WHOLE_FOOD_PRODUCE`
`ANTI_INFLAMMATORY_FOODS` `ORGAN_COVERAGE` `HIGH_FIBER` `PROBIOTIC_SOURCES`
`AAFCO_TRIAL_KEYWORDS` `GENERIC_PROTEIN_TERMS` `SPECIFIC_PROTEIN_TERMS`
`INGREDIENT_NUTRIENTS` `GROCERY_FINDS` `PROCESSING_METHODS` `DENTAL_INGREDIENTS`
`TAPF_APPROVED_BRANDS` `TREAT_HARMFUL` `TREAT_OK_INGREDIENTS`.

**Behaviour that must survive:** ingredient pill → detail modal · red flag → expands
inline · sections stay collapsible · feedback modal + AI coach still open · dormant
Treats code stays in the file (don't delete it).

Tone: professional ≠ cold. PawGrade's voice is "I fed my dog kibble for six years, I'm
not judging you." Don't sand that off.

---

## 🎨 Design System — `lib/theme.ts` (READ THIS BEFORE ANY UI/VISUAL WORK)

**`lib/theme.ts` is the single source of truth for the app's entire appearance.**

To restyle / revamp / re-theme the app: **edit `lib/theme.ts` and nothing else.**
Every colour in `app/index.tsx` resolves through the `t` object. Change a token's
value there and it propagates across the whole app automatically.

- Tokens are **semantic**, not literal: `t.critical`, `t.good`, `t.surface`, `t.textMuted`.
  (A token named for its *meaning* stays true when you change red → magenta.
  One named `chili` becomes a lie.)
- `t.dcm` (indigo) is reserved **exclusively** for the DCM / heart-risk category so it
  never reads as "just another severity tier". Don't reuse it for anything else.
- Also exports: `radius`, `space`, `type` scales, plus `scoreColor()`, `scoreLabel()`,
  and `severityColor` — so grading *presentation* is themed in one place too.

**Hard rule: never reintroduce a raw hex literal into a component.** Add a token to
`lib/theme.ts` instead. A one-off migration on 2026-07-14 moved every hex literal out of
`app/index.tsx`; the count must stay at zero or the app becomes un-revampable again.
Check it, don't assume: `grep -cE "#[0-9a-fA-F]{3,8}\b" app/index.tsx`.

**Light/Dark mode (added 2026-07-19):** `lib/theme.ts` now defines a full `lightPalette` and
`darkPalette` (both real Apple system-colour pairs, not a naive invert), mapped through the
same `buildTokens()` shape so they can't drift out of sync. The active mode is chosen **once,
at app launch**, from `Appearance.getColorScheme()` — it automatically matches the device's
OS Light/Dark setting.

⚠️ **Known limitation, by design, not a bug:** because `t` is one static object imported
throughout the app rather than a React context, it does **not** live-update if the user
flips Light/Dark mode while the app is already open — a relaunch picks up the change. Making
it reactive mid-session is a genuinely separate, larger project: every colour access would
need to move to a theme hook, and the large `StyleSheet.create()` block (evaluated once at
module load, ~490 `t.xxx` references) would need to move inside the component behind
`useMemo`. Don't attempt this as a quick add-on to an unrelated task — scope it properly.

Scoring *math* is NOT in the theme — only presentation. Don't change scoring (see above).

---

## Results Screen & Scan Behavior (UI layer)

Post-scan results render in `app/index.tsx` in this section order (reordered 2026-07-12 for an
"inform, don't judge" flow — factual/actionable content leads, the red-flag callout is opt-in):
1. Compassionate empathy note (always visible, top)
2. "Here's how to improve" actionable card (`getNextStep()`, always visible when scored)
3. Why This Score (always visible)
4. Guaranteed Analysis (always visible)
5. Ingredient Breakdown *(collapsible, **open by default**)* — pill-colored, informational first
6. "🚩 Ingredients to Watch" — formerly "Red Flags"; now *collapsible, closed by default* so it's
   opt-in rather than an unavoidable red banner. Tap a name to expand its one-sentence reason
   **inline** (uses `expandedRedFlags` state). Red title text via `AccordionSection`'s `titleColor` prop.
7. "Simple additions to upgrade the bowl" (egg / sardines or fish oil / yogurt-kefir-goat's milk)
8. Hershey's Protocol *(collapsible)*
9. Recommended Supplements *(collapsible)* — 7 affiliate cards, order: Probiotics → Fish Oil → Green Lipped Mussel → Heart → Liver → Detox → Four Leaf Rover
10. Grocery Store Finds *(collapsible)*
11. Lipoma Prevention *(collapsible)*
12. TCVM / Protein Energetics *(collapsible)*

Score labels (`getScoreLabel`) were also softened 2026-07-12: no more "Poor ❌"/"Very Poor 🚫" —
now "Below Average"/"Low Quality" (colors/thresholds/scoring math unchanged, presentation only).

- Collapsible sections use the reusable **`<AccordionSection>`** component (RN `LayoutAnimation`, ▸/▾ chevron, collapsed by default; `bare` mode wraps cards that bring their own styling like Lipoma/Hershey).
- **Food type is auto-detected** by Claude Vision (`result.processing_method`) — the manual pre-scan food-type picker was removed.
- **Treats scanner is disabled** (Treats tab hidden). Treats scoring code stays in place for a future rebuild — don't delete it.
- These are **UI-only** concerns: do not change scoring, API calls, or Supabase without asking.

---

## Build, Deploy & Repo State (important)

- **Canonical working copy:** `~/Documents/Projects/dog-food-scanner` — full files + working git; edit and build here. (`~/pawgrade-clean` is a redundant app-only copy.)
- **`common-sense-dog-ai-backup/` is a KEY STORE, not a working copy.** Its value is the intact `.env.local` that survived the iCloud loss. Its *code* has drifted from live and is no longer interchangeable (verified 2026-08-03 — see the ingestion warning above). Treat it as read-only reference: copy keys out of it, never run from it, never copy code out of it without diffing first.
- **Git can be flaky** (past iCloud corruption). If EAS errors on git, build with `EAS_NO_VCS=1` (archives the working dir via `.easignore`):
  ```bash
  EAS_NO_VCS=1 eas build -p ios --profile production
  EAS_NO_VCS=1 eas submit -p ios --profile production --latest
  ```
- **`.easignore` is critical:** it deliberately lets `.env` through so `EXPO_PUBLIC_APP_SECRET` (+ `EXPO_PUBLIC_GOUPC_KEY`) get baked into the build. Without it, the app's calls to `commonsensedog.com/api/*` return **403** (that secret gates those endpoints). Never `.easignore` an app code dir (e.g. `storage/`) — it breaks the JS bundle.
- **Apple PLA gotcha:** if build/submit fails with a 403 / "Program License Agreement" error, Kyle must accept the updated agreement at developer.apple.com first.
- **Public release:** `eas submit` only uploads to App Store Connect → TestFlight. Going live is a separate "Submit for Review" in the App Store Connect web UI (Kyle does that step).

---

## Key APIs & Services

| Service | Key Env Var | Purpose |
|---------|------------|---------|
| Anthropic | `ANTHROPIC_KEY` | Claude API for chat + Q&A generation |
| Pinecone | `PINECONE_API_KEY` | Vector database |
| Voyage AI | `VOYAGE_API_KEY` | Embeddings (1024-dim) |
| Supabase | in `lib/supabase.js` | Scan logging, feedback |
| UPC Item DB | in app | Barcode → product name (paid plan) |

---

## Hershey (Kyle's Dog)

75lb Labrador mix. Subject of PawGrade's personal story. Has lipomas managed holistically. Runs hot (TCVM). On: Simple Food Project (freeze-dried) + AllProvide (gently cooked) + Primal. The Resistance for flea/tick. Heartgard Plus monthly.
