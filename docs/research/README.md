# 🔬 Research working area

Where source material is collected and turned into verified notes.

**The whole point of this folder is the separation below.** Get it wrong once and someone else's
copyrighted words end up in a commercial knowledge base.

---

## The two halves

### `transcripts/` — RAW SOURCE · 🚫 gitignored · 🚫 NEVER INGESTED

YouTube and podcast transcripts from Dr. Judy Morgan, Dr. Andrew Jones, Dr. Karen Becker and
others. **These are other people's copyrighted words**, kept as personal study copies.

- **Never committed** (gitignored)
- **Never fed to `process_content.mjs`, `ingest_pack.js`, or `seed-pinecone.mjs`**
- **Never synced to the Obsidian vault**, because `sync-library.mjs` reads the vault and could
  sweep them into the website

**They exist so Claude can re-read a source in a later session without you re-pasting it.**
That's their only job.

### The notes — KYLE'S WORDS · ✅ vault · ✅ ingestable

The verified output goes into the Obsidian vault as normal notes: **your explanation of a fact you
checked, citing the source by name.** Those are yours, and they can go into the app and Pinecone.

---

## Why paraphrase alone isn't the line

**What makes a note yours is the verification, not the rewording.**

Rewording her video is a rewrite of her work. **Taking her claim, checking it against the
literature, labelling its tier, naming who funded the study and stating where it's uncertain — that
is original analytical work** that happens to cite her.

That's also the only version worth publishing.

---

## Per-topic workflow

1. **Collect** — transcript sections saved to `transcripts/<topic>-<source>-<date>.md`.
   Section around the claim is enough; whole transcripts aren't needed.
2. **Compare** — where do the three of them agree, and where do they diverge?
3. **Verify** — fetch the primary sources, read the METHODS, per
   `~/.claude/skills/primary-sources/SKILL.md`.
4. **Label** — evidence tier + funder + date.
5. **Write** — one note per topic into the vault, in Kyle's words.
6. **Apply** — app changes go on the list in `docs/EVIDENCE_AUDIT.md`.

**Always record the DATE of the source.** Judy Morgan's bloat post is from 2016 and reads as
current — that nearly caused a wrong correction on 2026-08-13.

---

## Topic order

1. Lipomas · 2. Joints/arthritis · 3. Itchy skin & allergies · 4. Gut/probiotics · 5. Yeast ·
6. Dental · 7. Fleas & ticks · 8. Kidney & liver · 9. Cancer & environmental exposure · 10. Vaccines

Related: `docs/EVIDENCE_AUDIT.md` · `PINECONE_PROTOCOL.md` · `CLAUDE.md` § Evidence rule
