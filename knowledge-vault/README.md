# knowledge-vault/ — FOLDED IN, no longer authoritative

> ⚠️ **This is not the knowledge base.** Despite the name, nothing here is wired to any retrieval
> path — not Pinecone, not the website, not the AI coach. Do not treat it as a source of truth.

**The real knowledge base is:**

| Layer | Where |
|---|---|
| Vector store (what the assistant searches) | Pinecone index `dog-knowledge-database` |
| Human-readable notes | `~/Documents/Obsidian Vault/commonsensedog knowledge/` |
| Q&A packs (source for Pinecone) | `common-sense-dog-ai/scripts/qa-*.json` |

## What this folder is

An evidence-tiered `addClaim` experiment from **2026-06-14**. Each file is one claim with a tier
(Strong / Moderate / Weak-Anecdotal), a source, and a `verified` / `draft` gate. The idea was good —
the gate in particular — but the pipeline that would have pushed verified claims into the vector
store was never finished, so 13 claims sat here unreachable for seven weeks.

Found frozen by `/os-audit` on 2026-08-03.

## What happened to the content

**All 13 claims were folded into the Obsidian vault** on 2026-08-03:

`commonsensedog knowledge/Tick-Borne Disease & Collar Safety — folded from knowledge-vault (2026-08-03).md`

That note preserves every claim with its original tier, source and verification status. Five were
genuinely new to the knowledge base — the tick attachment window, deer vs American dog tick,
regional Lyme prevalence, reinfection/4DX, doxycycline treatment — plus the Seresto controversy.
The two draft claims stayed drafts.

## Why the folder is still here

Kept deliberately (Kyle's call, 2026-08-03) rather than deleted — it's the original record, and the
tier/gate schema is worth reusing if the claim pipeline ever gets rebuilt. **Additive only; nothing
was removed.**

## If you rebuild this

The one genuinely good idea here is the `verified: false / draft: true` gate — a claim that hasn't
been checked cannot reach retrieval. That belongs in whatever replaces it. It's the same principle
as `PINECONE_PROTOCOL.md`, just enforced by the data instead of by discipline.
