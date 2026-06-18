# PawGrade — Project Documentation for Claude

## What This Project Is

**PawGrade** is an iOS app (React Native / Expo) that scans dog food barcodes or ingredient labels and scores them 0–100 based on ingredient quality, processing method, and nutritional value. Built by Kyle Cabral.

**commonsensedog.com** is the companion website with an AI chat assistant (Next.js + Claude API) that answers dog nutrition questions using a Pinecone knowledge base.

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
│       └── process_content.mjs     # Generates Q&A pairs from any file → Pinecone
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

### What's Stored (39 total entries)

| Prefix | Count | Script | Content |
|--------|-------|--------|---------|
| `blog-` | 30 | `seed-pinecone.mjs` | Topic summaries + brain dumps |
| `fullblog-` | 9 | `seed-blog-content.mjs` | Full blog article text |
| `qa-` | varies | `process_content.mjs` | Q&A pairs generated from source files |

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

## PawGrade Scoring System (v1.7.0)

- Base score: 60
- Kibble cap: 35 (kibble penalty: -40), baked cap: 55, gently cooked cap: 85, raw cap: 100
- Harmful ingredient penalties: capped at -10 per ingredient, scaled by position (ingredients 20+ get 20% penalty)
- Menadione severity: "severe" (-18 before cap)
- Score floor: 5
- Labels: 90–100 Excellent, 75–89 Great, 60–74 Good, 45–59 Fair, 30–44 Use Sparingly, <30 Avoid

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
