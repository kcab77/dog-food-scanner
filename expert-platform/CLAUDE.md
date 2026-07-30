# Expert Platform — Project Handoff / Context

A **two-sided AI knowledge platform** sold to an expert (first prospects: holistic
veterinarians Dr. Judy Morgan and Dr. Andrew Jones). One backend, two surfaces:

1. **ASSISTANT (public, BUILT)** — a RAG chat over the expert's own published work.
   Answers in the expert's voice, cites the source article, recommends the
   expert's real products, refuses when the answer isn't in their material, and
   short-circuits medical emergencies to "contact your vet."
2. **STUDIO (private, NOT built yet)** — voice/text capture where the expert grows
   their own knowledge base. Spec only; see "Not built yet" below.

The pitch/business model: the expert promotes it to their audience; charge per
end-user (~$30/mo unlimited works on Haiku with fair-use) or a per-expert SaaS
fee. Cost scales with audience → per-expert usage metering is built in.

---

## Live demos (public, no login)
- Dr. Judy Morgan: **https://expert-platform-dun.vercel.app/dr-judy-morgan**
- Dr. Andrew Jones: **https://expert-platform-dun.vercel.app/dr-andrew-jones**

Both seeded ONLY from each vet's **public blog articles** (Judy ~47, Andrew ~60),
as private pitch demos shown to them. **Do not post publicly.** A full-catalog
ingest (books + full blog + YouTube) requires the expert's **written permission**
first — that permission is the thing the demo is pitching.

---

## Stack
- Next.js (App Router) + TypeScript + Tailwind, deployed on **Vercel**
  (project `expert-platform`, team `common-sense-dog-s-projects`; stable alias
  `expert-platform-dun.vercel.app`).
- **Supabase** project `fqafctdxcrtrnhwpohlf` ("expert-platform", free tier):
  Postgres + pgvector + RLS.
- **Voyage** `voyage-3` (1024-dim) embeddings. ⚠️ The key is on Voyage's FREE rate
  tier (3 req/min, 10K TPM) — a payment method was added but has NOT taken effect
  (likely on the wrong Voyage org). Ingest scripts throttle ~21s/call; the live
  chat route has 429 retry/backoff. Fixing the Voyage billing org unlocks fast
  full-catalog ingest.
- **Anthropic**: `claude-sonnet-5` for answers, `claude-haiku-4-5-20251001` for the
  cheap query-understanding rewrite.

## Env vars (`.env`, gitignored; also set in Vercel project)
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VOYAGE_API_KEY`, `ANTHROPIC_KEY`,
`RELEVANCE_FLOOR` (0.45 default), `MATCH_COUNT`, optional `PRODUCT_RELEVANCE_FLOOR`.

---

## Data model (Supabase, all RLS-enabled)
`experts` (id, owner_id→auth.users, name, slug, persona_prompt, store_base_url) ·
`sources` (expert_id, type book|video|post|studio, title, url) ·
`chunks` (source_id, expert_id, content, embedding vector(1024), token_count) ·
`products` (expert_id, name, slug, url, description, embedding vector(1024)) ·
`conversations` / `messages` (role, content, citations jsonb, refused) ·
`unanswered` (question, embedding — feeds a future monthly gap report) ·
`usage_events` (per-expert chat/embed metering).

**RLS model:** an authenticated expert can read/write ONLY their own rows
(owner-scoped via `owns_expert()`); anon has NO table access. The public Assistant
runs server-side under the **service-role key**, hard-scoped to one expert.
SQL functions `match_chunks()` and `match_products()` (SECURITY DEFINER,
service_role only) do relevance-floored vector search.

## Key files
- `supabase/migrations/0001_expert_platform_init.sql` — schema + RLS + match_chunks
  (product semantic-match migration applied separately in the DB).
- `app/api/chat/route.ts` — the core: query-understanding rewrite → embed →
  retrieve (relevance floor) → refuse OR generate in persona → citations +
  semantic product match → log messages/usage/unanswered.
- `app/[expert]/page.tsx` + `Chat.tsx` — the public assistant UI (trust strip,
  starter questions, citation pills, product pills).
- `lib/` — `supabase.ts` (service client), `embed.ts` (Voyage + backoff),
  `retrieval.ts` (match_chunks + relevance floor + emergency detector),
  `starters.ts` (per-expert verified opening questions).
- `scripts/ingest.ts` — CLI: `--folder|--urls|--sitemap|--youtube` → chunk → embed
  → upsert (idempotent, throttled). `scripts/embed-products.ts` embeds products.
- `ONBOARDING.md` — the repeatable 4-step playbook to add a new expert.

## How the Assistant behaves (the important guarantees)
- **Answers ONLY from retrieved context** — never generic AI knowledge.
- **Query understanding first**: a cheap Haiku pass fixes typos ("simperica"→
  "Simparica"), expands intent, resolves follow-ups ("what do you recommend?")
  using conversation context, THEN searches.
- **Deterministic refusal**: when context doesn't genuinely answer, the model
  emits a `[[NOCTX]]` token → the route strips it, drops citations/products,
  marks refused, logs to `unanswered`. No wrong citation ever shown.
- **Product recs** are semantic matches against the expert's REAL catalog (never
  hallucinated), only on real answers.
- **Emergency short-circuit** before any RAG; **educational disclaimer** on every
  answer; **conversation memory** for follow-ups.

## Not built yet (roadmap)
- **Studio** (expert's private capture app): voice/text → transcribe → structure
  into categories (protocol/clinical/product/content/idea/question/person/task/
  note) via strict JSON (zod-validated, retry-once-then-store-unstructured) →
  file into the KB. Extract action items/due dates.
- **Gap report**: cluster the `unanswered` table, email the expert a monthly
  ranked digest.
- **KB export** (JSON + Markdown), **Stripe subscriptions + accounts/paywall** to
  actually charge end-users.
- **Full-catalog ingest** for each expert (books + full blog + YouTube) — gated on
  written permission + the Voyage billing-org fix.

## Legal
Demo = each expert's PUBLIC articles, shown privately to that expert. A live/paid
product on their content needs their written permission (a license). Keep demo
links 1:1, not public.
