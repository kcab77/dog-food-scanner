# 🔬 Pinecone Ingestion Protocol — Common Sense Dog

**Every knowledge pack added to the `dog-knowledge-database` index follows this. No exceptions.**
The goal: a knowledge base that's *sourced, graded, verified, and honest* — not "AI said so."

---

## 1. Source rule — every claim must be citable
- Each factual claim traces to a **real, nameable source**: a peer-reviewed study/RCT, veterinary journal, or an authoritative body (FDA, ASPCA/APCC, NIH/PMC, WSAVA, AAFCO, Merck Veterinary Manual).
- **No uncited "the AI just knows."** If a claim has no credible source, it does **not** go in.
- Priority: clinical trials > systematic reviews > authoritative guidelines > mechanistic/physiological reasoning.

## 2. Verify before ingest (catch errors like Alves→Kampa)
- **Web-search each key study/claim** to confirm (a) it's real and (b) it actually says what we claim.
- Confirm author, year, finding, and effect size. Do not transcribe citations blindly (even from Kyle's own notes — they've had errors).

## 3. Confidence label on EVERY claim (reader-facing)
Each answer states its evidence tier in plain sight so the reader knows how solid it is:
- 🟢 **Strong** — multiple RCTs / robust clinical data
- 🟡 **Moderate** — at least one solid RCT, limited replication
- 🟠 **Emerging** — small / pilot / early studies
- ⚪ **Traditional / Mechanistic** — no direct canine trials; established toxicology/physiology or long traditional use (labeled honestly, never inflated to "proven")
- ❌ **No credible basis → excluded**
- When evidence is **mixed**, say so explicitly (e.g., glucosamine/chondroitin).

## 4. Pack format (JSON per pair)
```json
{
  "question": "owner-phrased question",
  "answer": "answer with an inline confidence tag + the citation, e.g. '🟢 Strong evidence: … (Roush et al., 2010, JAVMA)'",
  "confidence": "strong | moderate | emerging | traditional",
  "sources": ["Roush et al., 2010, JAVMA (PMID 20043801)"],
  "topic": "kebab-topic",
  "source": "Common Sense Dog — <Pack Name>"
}
```
The confidence tag + citation **must be in the answer text** (that's what the assistant shows the reader), not just metadata.

## 5. Human review
Kyle reviews before ingest — his 7 years of expertise is the final filter no AI replaces. Extra scrutiny on anything health-critical. Keep the educational-only framing; recommend a (holistic) vet for real conditions.

## 6. Ingest + sync
- New pack: `node common-sense-dog-ai/scripts/ingest_pack.js <pack.json>`
- **Corrections:** `node common-sense-dog-ai/scripts/force_upsert.mjs <pack.json>` (ingest_pack skips >0.95 near-dupes, so edits won't apply otherwise)
- Write an Obsidian summary note (with sources) to `commonsensedog knowledge/`; update `PINECONE_TODO.md`.

## 7. Honesty guardrails (non-negotiable)
- **Never claim "100% accurate"** anywhere (site, marketing, packs).
- Label traditional/holistic claims **as** traditional — don't dress them up as proven.
- Keep the site disclaimer: educational only, not veterinary advice.
- If unsure → say so, or leave it out.

---
*Established 2026-07-02 after verifying the joints pack (caught + fixed the Alves→Kampa citation error). This is the standard from here forward.*
