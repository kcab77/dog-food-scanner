# Onboarding a New Expert — Reusable Template

This platform is **multi-tenant**: one codebase serves many experts. Adding a new
client is **data + ingestion only — no code changes.** Each expert gets a public
assistant at `/<their-slug>`.

This is the repeatable playbook. It took Dr. Judy Morgan as the first example;
the same 4 steps onboard anyone (a vet, a trainer, a nutritionist, any expert
with a body of published work).

---

## What makes it reusable

- **Everything is scoped by `expert_id`.** The chat API, retrieval, citations,
  products, logging, and metering all key off the expert resolved from the URL
  slug. Nothing is hardcoded to one person.
- **Voice is data, not code.** Each expert's tone lives in `experts.persona_prompt`.
- **Their store is data too.** `experts.store_base_url` + the `products` table
  drive product surfacing.
- **The refusal path keeps it safe for any niche** — it only ever answers from
  the retrieved context, so a new expert can't be misrepresented.

---

## The 4 steps to add an expert

### 1. Create the expert row
The `experts` table needs an `owner_id` (a Supabase auth user = the expert's own
login for the future Studio). For a **demo** with no login yet, create a
placeholder auth user first, then the expert:

```sql
-- one-time placeholder owner for a demo (skip once real Studio auth exists)
insert into auth.users (id, email) values (gen_random_uuid(), 'demo+SLUG@example.com')
returning id;  -- use this id as owner_id below

insert into public.experts (owner_id, name, slug, persona_prompt, store_base_url)
values (
  '<owner_id>',
  'Expert Full Name',
  'expert-slug',                              -- becomes /expert-slug
  'You are Expert Name. <2-4 sentences of voice + philosophy>.',
  'https://theirstore.com'
);
```

### 2. (Optional) Add their products
```sql
insert into public.products (expert_id, name, slug, url, keywords) values
  ('<expert_id>', 'Product Name', 'product-slug', 'https://…', array['keyword1','keyword2']);
```
The assistant surfaces a product only when a question contains one of its
`keywords` — deterministic, no hallucinated product pushing.

### 3. Ingest their content
Pick the source that fits. **Only ingest content you have the right to use.**

```bash
# a hand-picked list of public pages (best for a demo — full control)
tsx scripts/ingest.ts --expert expert-slug --urls ./pages.txt --type post

# an entire sitemap (whole blog/site)
tsx scripts/ingest.ts --expert expert-slug --sitemap https://site.com/sitemap.xml --type post

# a folder of files (books/manuscripts as .txt/.md/.html)
tsx scripts/ingest.ts --expert expert-slug --folder ./their-books --type book

# a YouTube channel (needs YOUTUBE_API_KEY + `npm i youtube-transcript`)
tsx scripts/ingest.ts --expert expert-slug --youtube @TheirChannel
```
Flags: `--dry` (chunk + count, no writes), `--limit N`, `--reingest`.

### 4. Share the link
Their assistant is live at `https://<deployment>/expert-slug`. Done.

---

## Environment
Copy `.env.example` → `.env` and fill in `SUPABASE_SERVICE_ROLE_KEY`,
`VOYAGE_API_KEY`, `ANTHROPIC_KEY`. The same values go into the Vercel project's
environment variables for the deployed app.

## Guardrails that apply to every expert (don't remove)
- **Refusal path** — below the `RELEVANCE_FLOOR`, the model is never called; the
  assistant says it's not in the material and refers to the expert. Every such
  question is logged to `unanswered` for the monthly gap report.
- **Emergency short-circuit** — messages that read like a medical emergency skip
  RAG entirely and tell the user to contact their vet now.
- **Educational disclaimer** on every answer.
- **Per-expert metering** — every chat/embed writes to `usage_events`, because
  inference cost scales with each expert's audience.

## Legal note
For a **pitch demo**, ingest only an expert's *public* pages, shown back *to that
expert*. Before a **full production ingest** of someone's books, paid courses, or
full video archive, get explicit written permission — that content is theirs.
