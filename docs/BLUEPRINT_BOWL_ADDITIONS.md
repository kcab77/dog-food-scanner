# 🥣 Blueprint — Bowl Additions, driven by the label

*Spec'd 2026-10-16, from Kyle's ask after a real user's Diamond chicken scored 18 and he
felt bad about it. Written in the 7-part shape (see `docs/BLUEPRINT_THE_BOWL.md`).*

---

## 1. THE PROBLEM — whose, and what they do today instead

**Whose:** the kibble buyer who just scanned the bag they already own and fed this
morning. `docs/GROWTH_PLAN.md` § "The customer" says this is the person PawGrade is for.

**What the app does today:** shows them a number, a label, and three additions that are
**identical for every food ever scanned**. `ADDITIONS` (`app/index.tsx` ~11105) is a
hardcoded array of egg / fish oil / probiotic, and `getNextStep()` (~7101) takes only
`score` and `processing` — it never receives the ingredient list. So it returns one of
exactly two messages, and both recommend fish oil.

**What they do instead:** nothing, or they stop using the app. A score of 18 with generic
advice reads as a verdict on them. That is the specific failure mode
`docs/THE_LADDER.md` exists to prevent, and the voice note in `CLAUDE.md` —
*"I fed my dog kibble for six years, I'm not judging you"* — is the thing being
contradicted at the exact moment it matters most.

**This is not a rare edge case.** Across the 95 scored foods in
`common-sense-dog-ai/lib/foods-data.ts`: kibble's median score is **42**, 20 of 66
kibble foods score **under 30**, and **55 of 95 foods land in "Below Average" or
"Low Quality."** The majority of real scans end in the two worst bands. An 18 is not a
bug to fix in the scorer — there is already another kibble at exactly 18. The score is
behaving. **The response to the score is what's missing.**

---

## 2. WHY NOBODY SOLVED IT

| Option | What it misses |
|---|---|
| **Yuka / Open Pet Food Facts** | Score and stop. No remediation at all — the number *is* the product. |
| **Chewy / brand sites** | Remediation is always "buy this other bag." Nobody says "keep that bag and add an egg." |
| **Holistic blogs & vets** | Give additions, but generically, never keyed to what's actually in *this* label — and they never subtract what the food already provides. |
| **PawGrade today** | Has the per-label data and throws it away at the last step. |

The gap: **nobody reads the specific deficit off the label and answers only that
deficit.** It's not a data problem here — the data already exists and is computed.

---

## 3. THE FEATURE — in the user's words

> *"I want to like have a suggestion of what to add to the bowl, like sardines or eggs or
> omega 3s based on what the ingredients say... I want to be able to suggest a better
> option or better at-home additives to not turn off the customer."*
> — Kyle, 2026-10-16

So: the additions block stops being a fixed list of three and becomes **the answer to
this label's actual gaps**, in grocery-store terms, with a dose.

The scorer already emits the deficit vocabulary. Real output for Diamond Nutragold:

```
🔴 Poor omega ratio (est. ~12:1 — typical for kibble)   −10
Est. ~27% carbohydrate — multiple carb sources           −6
Unidentified generic meal (1) — sourcing unknown         −7
High synthetic vitamin/mineral load (1 added)            −2
Whole food fruits & vegetables (6)                      +10
Anti-inflammatory ingredients (1)                        +3
```

Every negative line is a sentence waiting to be written. The omega line becomes
*"this food runs about 12:1 omega-6:3 — a tin of sardines three times a week moves it."*
The produce line **does not fire**, because this food already has six. That restraint is
the feature as much as the suggestions are.

---

## 4. THE THREE CHECKS

| Check | How it applies |
|---|---|
| **Completeness** | An addition only appears when the label shows that gap. Six produce items present → no produce suggestion. |
| **Energetics (TCVM)** | Each addition carries warm/cool. Sardines are cooling, so for a dog that runs hot (Hershey) they're a *better* fit than lamb — and the last commit (`4df891c`) already added the warm/cool note to every herb section, so the pattern exists to follow. |
| **Not oversupplementing** | **The hard one, and the differentiator.** Dose must subtract what the bowl already provides. The fish-oil copy at `app/index.tsx:685` already says *"whatever the food already provides counts toward it"* — this makes that arithmetic real instead of advisory. |

---

## 5. THE CONFLICT — shown, not hidden

**Diamond Nutragold already contains salmon and ocean fish meal, and the scorer credits
it: "Anti-inflammatory ingredients (1)."** Yet its omega ratio is still ~12:1, because
kibble's omega-6 load from chicken fat swamps the fish.

So the honest answer is **not** "add fish oil" and **not** "you're covered." It is:
*the fish in here is real but it is outnumbered; sardines help because they shift the
ratio, not because the food has no omega-3 at all.*

Two constraints disagree — completeness says the nutrient is present, accumulation says
don't stack blindly — and the resolution is a sentence that names both. A tool that
only had an ingredient list could not say this. **That conflict is the feature.**

---

## 6. WHAT SHIPS FIRST — ONE rung

**The omega rung. Nothing else.**

Chosen because: poor/very-poor omega ratio fires on nearly every kibble (so it's the
highest-coverage single fix), it's the deficit with a **real dose protocol already
written** in the codebase (`app/index.tsx:685` — 20mg/lb wellness, 30–45mg/lb joints,
with the trial citations), it's the one where the already-in-the-bowl subtraction is
actually checkable, and sardines are precisely what Kyle named.

```
🐟  This bowl runs about 12:1 omega-6:3
    Target is 5:1 or lower. There IS salmon in here — it's just outnumbered
    by the chicken fat.

    One tin of sardines in water, 3× a week          ~1,400mg EPA+DHA
    For a 75lb dog the wellness target is ~1,500mg/day.
    Cooling in TCVM — good for a dog that runs warm.
```

Explicitly NOT in rung 1: organ meats, produce, probiotics, carb dilution, the swap
suggestions from `docs/TODO.md`. Each is its own rung later. **Section 6 is load-bearing.**

---

## 7. WHAT IT RESTS ON

Nothing new. Everything already exists:

- `breakdown[]` from the scorer — the deficit list, already computed and already rendered
- `ANTI_INFLAMMATORY_FOODS` — detects marine omega-3 already in the label
- `GROCERY_FINDS` — already contains "Sardines in water" with aisle info
- `SUPPLEMENT_RECS[2]` — the fish-oil card with the full dose protocol and trial citations
- `dog_profiles.weight` (`lib/supabase.js:64`) — turns a per-pound formula into a number
- `lib/theme.ts` tokens — no new colour

**Build:** one function `getBowlAdditions(breakdown, ingredientList, weightLb?)` returning
`{icon, what, why, dose, energetics}[]`, and swap the hardcoded `ADDITIONS` array for its
result. `getNextStep()` gains the ingredient list as a third argument.

**Does not touch:** the scoring math, any API, Supabase writes, or the section order.
Per `CLAUDE.md` § UI REVAMP RULES — edit in place, delete nothing, and the existing
three-addition block keeps working as the fallback when no deficit is detected.
