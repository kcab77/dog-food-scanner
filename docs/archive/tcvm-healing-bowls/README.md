# 🗄️ ARCHIVED — TCVM healing bowls (homemade diet recipes)

**Archived 2026-08-22 at Kyle's instruction. Do NOT put this back in the app until
Kyle says he has permission.**

## Why this is here

The recipes, five-element food guide, cooking methods, prep rules and measuring
table were derived from **Dr. Judy Morgan's** YouTube material. The content was
de-branded first (her name removed from the section title, "The Famous Puploaf"
renamed, the branded header cropped off the infographic) — but Kyle decided to
pull the whole thing and **ask her permission** rather than ship a de-branded
version of someone else's work.

That is the right call and it is the reason this folder exists rather than a
`git rm`.

## What's in here

| File | What it is |
|---|---|
| `constants.tsx.txt` | `TCVM_ELEMENTS` · `TCVM_RECIPES` · `TCVM_METHODS` · `TCVM_PREP` · `TCVM_MEASURING` |
| `section.tsx.txt` | The JSX that rendered inside **🍳 Build a home-cooked bowl** |
| `tcvm-healing-bowls.jpg` | The recipe card, header band already cropped off |

## What was NOT archived (and why)

- **The home-cooked builder / nutrient gap-checker** stays in the app. It is
  built on Stockman et al. 2013 and the AAFCO profiles — published research, not
  her material, and it predates this work.
- **🌿 TCVM food therapy** (the energetic bowl section) **stays live — Kyle
  decided this on 2026-08-22 and he's right.** Five-element theory, hot/cold
  constitutions, the cooling/warming/neutral food classifications and the eye
  diagnostic map are centuries-old traditional Chinese medicine — general
  knowledge, not anyone's IP. Its infographic carries no practitioner name, and
  the text is written in Kyle's own phrasing rather than copied.
  **The line: general TCVM knowledge is fine; a named person's recipes and brand
  are not.**
- The two **Protein Energetics (TCVM)** sections predate all of this.

## How to restore

1. Paste `constants.tsx.txt` back into `app/index.tsx` above `const MEDICINAL_MUSHROOMS`.
2. Paste `section.tsx.txt` back inside the **🍳 Build a home-cooked bowl**
   `AccordionSection`, just before its closing tag.
3. Move `tcvm-healing-bowls.jpg` back to `assets/images/`.
4. `npx tsc --noEmit` — app/ and lib/ must be zero errors.

## The standing rule this came from

Facts, ingredient lists and techniques are not copyrightable. **Someone's name,
brand and specific expression are.** Cite and link to a practitioner — that's
what the app already does with the drjudymorgan.com links — but don't put their
name on a feature, and don't ship a de-branded copy of their work either.

Related: `docs/BLUEPRINT_THE_BOWL.md` · `docs/THE_LADDER.md`
