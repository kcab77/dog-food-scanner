# 🧠 Knowledge gaps — one a day

*Measured 2026-11-06 from the 999 Q&A pairs in `common-sense-dog-ai/scripts/qa-*.json`,
grouped by which of the 44 library topics they actually serve.*

**Read this first.** A raw count of Pinecone `topic` tags says 126 topics are thin. That
number is wrong and chasing it would waste weeks. Most of it is **tag fragmentation** —
`omega-3` has 2 pairs and `omegas` has 24; they are the same knowledge under two labels,
and retrieval already finds both because it searches embeddings, not tags.

Grouped by what the AI can actually answer, **only 8 of 44 library topics are thin, and
only 4 are real.** The list below is in priority order. One a day finishes it this week.

---

## The real gaps

- [ ] **1 · Holistic Parasite Prevention & Natural Deworming** — *2 pairs*
      The highest-value gap by a distance. Flea/tick is one of the most-asked owner
      questions, it's seasonal (so it spikes), and you have a genuine position plus a
      real result with Hershey — two ticks found on the bed after hiking, neither
      attached, after switching off Simparica. Cover: isoxazoline risk honestly, what
      the natural options actually do and don't do, when conventional is the right
      call anyway, and regional risk (heartworm is not optional everywhere).

- [ ] **2 · Supplements (by what they help)** — *0 pairs*
      Reframes the whole shelf around the owner's question — "my dog's joints hurt",
      not "what is green-lipped mussel". Also the natural home for your affiliate
      products, so it earns twice. Needs a "when NOT to" for each.

- [ ] **3 · Joint Health Research (Citation-Backed)** — *0 pairs*
      Joints already has 48 pairs, so this is not a hole — it's the citation-backed
      version. Worth doing because joints is where owners spend real money and where
      marketing claims are worst. Pairs here should carry the trial design, not just
      the finding.

- [ ] **4 · Leaky Gut — Chronic vs Temporary** — *1 pair*
      Leaky Gut has 41 pairs, so the subject is covered; the *distinction* isn't. This
      is the one that changes what an owner should do, so it earns its own pairs.

## Not real gaps — do not spend days on these

- **Evidence-Based Holistic Topics (+ Batch 2)**, **Holistic Topics Expansion (+ Batch 2)**
  — named after the ingestion batch, not a subject. No Pinecone tag will ever match them
  because there is no such topic. Consider renaming or folding them into real subjects.
- **Hershey's Health Protocol** — personal, not general guidance. Arguably should stay
  out of the assistant's retrieval on purpose.

---

## After these four — stop guessing, use the data

The best gap list is the one your users write. Once the app is running, the questions
that return **no strong match** (score < 0.65 in `/api/coach`) are exactly the topics to
deepen next, ranked by how often they're asked.

Log the query and the top retrieval score on every coach call, then read it weekly.
That turns this from a guessing game into a queue, and it never goes stale.

## How to add pairs

```bash
node common-sense-dog-ai/scripts/process_content.mjs <file>   # generates, embeds, upserts
```

Rules that make them worth having (from `PINECONE_PROTOCOL.md` and the house style that
already runs through the 999):
- Lead with the **dose, form and timing**, not the concept
- Carry the confidence through — *"no canine trials"*, *"mechanism only"*, *"owner
  reports, weak study design"*
- At least one **"when NOT to"** pair per topic
- Never invent a dose or a study
