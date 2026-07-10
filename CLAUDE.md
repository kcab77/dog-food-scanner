# PawGrade — Project Documentation for Claude

## What This Project Is

**PawGrade** is an iOS app (React Native / Expo) that scans dog food barcodes or ingredient labels and scores them 0–100 based on ingredient quality, processing method, and nutritional value. Built by Kyle Cabral.

**commonsensedog.com** is the companion website with an AI chat assistant (Next.js + Claude API) that answers dog nutrition questions using a Pinecone knowledge base.

---

## 🧠 Obsidian Brain (read this for context)

Kyle keeps a single source-of-truth Obsidian vault at **`~/Documents/Obsidian Vault/`** (WITH a space — ignore the old, redundant no-space `~/Documents/ObsidianVault/`). It holds curated memory, full past conversation transcripts, and dog-nutrition knowledge.

- **Before answering** project/dog/nutrition questions, read the routing maps at the vault root FIRST so you load only what's relevant (don't scan everything): **`_Vault Map.md`** (topic → which note) and **`_Skills Map.md`** (task → which agent/tool/workflow). Then open only the matched note(s) — e.g. `Brain/claude-memory/dog-food-scanner/` (facts), `Brain/transcripts/dog-food-scanner/` (history), `Brain/Nutrition/`, `commonsensedog knowledge/`.
- **Auto-sync:** a `SessionEnd` hook (`~/.claude/hooks/obsidian-sync.mjs`) exports memory + transcripts into the vault after **every** session — automatic, don't duplicate it. Kyle's standing wish: every session ends up in this vault.
- When you learn something durable, write a note (`Brain/Inbox/` by default) with frontmatter + `[[wikilinks]]`. Additive only — never delete vault content.

---

## Project Structure

```
dog-food-scanner/
├── app/                        # React Native / Expo app (PawGrade iOS)
│   └── index.tsx               # Main app — scanning, scoring, supplement recs
├── lib/
│   └── supabase.js             # Supabase logging (scans, feedback tables)
├── common-sense-dog-ai/        # Next.js website — commonsensedog.com
│   ├── app/
│   │   ├── page.tsx            # Home page with AI chat
│   │   └── api/chat/route.ts   # Claude API endpoint (RAG via Pinecone)
│   ├── lib/
│   │   ├── pinecone.ts         # Pinecone search + upsert helpers
│   │   └── blog-data.ts        # Full blog post content (9 articles)
│   └── scripts/
│       ├── seed-pinecone.mjs        # Seeds knowledge summaries (30 entries)
│       ├── seed-blog-content.mjs    # Seeds full blog articles (9 entries)
│       ├── process_content.mjs     # Generates Q&A pairs from any file → Pinecone
│       └── ingest_pack.js          # Upserts a pre-written Q&A JSON pack → Pinecone (no Claude gen)
├── NUTRITION_NOTES.md          # Master dog nutrition reference
├── BLOG_POSTS.md               # Blog post tracker
└── CLAUDE.md                   # This file
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
Embeds (voyage-3) and upserts directly — no Claude generation. IDs are `qa-<topic>-<n>` (collision-safe); skips near-duplicates (>0.95). If the main folder's `.env.local` or scripts are ever missing (iCloud loss), run it from **`common-sense-dog-ai-backup/`** (intact keys + script). After ingesting, also write a readable summary note into the Obsidian vault's `commonsensedog knowledge/`.

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

## PawGrade Scoring System (current app: v1.8.1)

Scoring algorithm (unchanged across recent UI work — **do not change scoring without asking Kyle**):
- Base score: 60
- Kibble cap: 35 (kibble penalty: -40), baked cap: 55, gently cooked cap: 85, raw cap: 100
- Harmful ingredient penalties: capped at -10 per ingredient, scaled by position (ingredients 20+ get 20% penalty)
- Menadione severity: "severe" (-18 before cap)
- Score floor: 5
- Labels: 90–100 Excellent, 75–89 Great, 60–74 Good, 45–59 Fair, 30–44 Use Sparingly, <30 Avoid

---

## Results Screen & Scan Behavior (v1.8.1 — UI layer)

Post-scan results render in `app/index.tsx` in this section order:
1. Compassionate empathy note (always visible, top)
2. Why This Score (always visible)
3. Guaranteed Analysis (always visible)
4. Red Flags — tap a name to expand its one-sentence reason **inline** (uses `expandedRedFlags` state)
5. Ingredient Breakdown *(collapsible)*
6. "Simple additions to upgrade the bowl" (egg / sardines or fish oil / yogurt-kefir-goat's milk)
7. Hershey's Protocol *(collapsible)*
8. Recommended Supplements *(collapsible)* — 7 affiliate cards, order: Probiotics → Fish Oil → Green Lipped Mussel → Heart → Liver → Detox → Four Leaf Rover
9. Grocery Store Finds *(collapsible)*
10. Lipoma Prevention *(collapsible)*
11. TCVM / Protein Energetics *(collapsible)*

- Collapsible sections use the reusable **`<AccordionSection>`** component (RN `LayoutAnimation`, ▸/▾ chevron, collapsed by default; `bare` mode wraps cards that bring their own styling like Lipoma/Hershey).
- **Food type is auto-detected** by Claude Vision (`result.processing_method`) — the manual pre-scan food-type picker was removed.
- **Treats scanner is disabled** (Treats tab hidden). Treats scoring code stays in place for a future rebuild — don't delete it.
- These are **UI-only** concerns: do not change scoring, API calls, or Supabase without asking.

---

## Build, Deploy & Repo State (important)

- **Canonical working copy:** `~/Documents/Projects/dog-food-scanner` — full files + working git; edit and build here. (`~/pawgrade-clean` is a redundant app-only copy; `common-sense-dog-ai-backup/` is an intact website backup with a working `.env.local` + extra scripts.)
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
