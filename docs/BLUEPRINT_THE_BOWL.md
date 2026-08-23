# 🥣 PawGrade Blueprint — The Bowl Problem

**This is the core product thesis. Model every future feature spec on the format below.**

---

## The problem, stated once

**Three constraints have to be satisfied at the same time, and nothing on the market does all three.**

| # | Constraint | The question it answers |
|---|---|---|
| **1** | **Completeness** | Does the whole bowl actually hit requirements? |
| **2** | **TCVM energetics** | Is it right for *this* dog — warm, cool, damp? |
| **3** | **Not oversupplementing** | Is anything accumulating to a level that harms? |

### Why nobody has solved it

- **Conventional tools do #1 only.** BalanceIT and vet formulators check the numbers and have no concept of a warm dog.
- **Holistic advice does #2 only.** The energetics are the whole framework, and completeness is assumed rather than checked.
- **Almost nobody does #3 systematically.** "Add turmeric, add mussels, add liver, add kelp" is given as separate advice by separate people, and nobody sums the stack.

**PawGrade's position is the intersection.** Not a better version of any one of the three — the only tool that holds all three at once.

---

## What that means in the app

### The bowl, not the bag

**The scan is the starting point, not the answer.** Real feeding is base food + toppers + supplements, and the score should reflect the bowl the dog actually eats.

```
BASE          the scanned food (complete, or not)
+ TOPPERS     sardines · eggs · organ · produce
+ SUPPLEMENTS fish oil · GLM · turmeric · probiotics
= THE BOWL    ← this is what gets checked
```

### The three checks, in order

**1 · Completeness** — does the bowl clear the floor?
Use AAFCO/NRC as a **floor to rule food out, never a target to rule food in.** If the base is a
verified complete diet, toppers under ~10% don't threaten completeness — they threaten #3.

**2 · Energetics** — does it suit the dog?
Warm dog (pants, seeks cold floors) vs cool dog (seeks warmth, curls up). Damp presentation
(lipomas, yeast, heavy discharge). **This is where the same ingredient is right for one dog and wrong
for another** — and where a purely nutritional tool has nothing to say.

**3 · Accumulation** — is the stack safe?
**Only these accumulate. Everything else is passed through.**

| Watch | Trigger |
|---|---|
| **Fat-soluble vitamins A, D, E, K** | Liver, fish oil, cod liver oil, fortified base |
| **Copper** | Liver, organ blends — **flag harder for predisposed breeds** |
| **Iodine** | Kelp, seaweed, shellfish — easy to double up without noticing |
| **Selenium** | Brazil nuts, some fish — narrowest margin on the panel |
| **Vitamin A specifically** | Liver — **the reason the 10% organ rule exists** |

**Water-soluble vitamins do not need tracking.** A dog cannot get in trouble from extra B12 in a
sardine. **Saying so plainly is a credibility win, not a missed flag.**

---

## The conflicts this surfaces — and they are the feature

**When two of the three constraints disagree, that IS the insight.** Don't hide it, don't resolve it
silently. Show the dog's owner the tension and let them choose.

**Live example, from this project:**

> **Green-lipped mussel.** The heart protocol includes it. The lipoma protocol says avoid it —
> damp-building. **Hershey has lipomas.**
>
> Nothing conventional can even represent that conflict, because it has no concept of damp. Nothing
> holistic flags it either, because the two protocols come from different pages.
> **PawGrade can hold both and say: "these disagree, here's why, here's which applies to your dog."**

**That moment is the product.** It's the thing a competitor with a barcode scanner and an ingredient
list cannot reproduce.

---

## Rules that govern every bowl feature

1. **The floor is a floor.** AAFCO rules food out, never in. Name its specific failures — *no copper
   maximum since 2007* — rather than dismissing it, because the app depends on it as a yardstick.
2. **Prefer whole-food nutrients where you can.** Then check for **menadione · selenite · oxide ·
   dl-**. That's the whole synthetic position: her sentence on top, the four-word check underneath.
3. **Whole foods stack safely; concentrates don't.** A topper is 5–10% of the bowl at food
   concentrations. A capsule isn't.
4. **Label the tier, always.** Trial · observational · mechanism · clinical experience. Holistic
   claims are welcome — they get labelled, not softened.
5. **Never shame the bowl.** *"Here's what's in it, here's a better option at the same price."*
6. **One lesson per interaction.** See `docs/THE_LADDER.md`. Overwhelming the owner is the failure
   mode this whole product exists to fix.

---

## 📐 The spec format — use this shape for every future feature

**When Kyle asks for a feature, answer in this structure. Nothing else.**

```
1. THE PROBLEM        one paragraph. Whose problem, and what they do today instead.
2. WHY NOBODY SOLVED IT   what the existing options each miss.
3. THE FEATURE        what it does, in the user's words, not the system's.
4. THE THREE CHECKS   completeness · energetics · accumulation — which apply here.
5. THE CONFLICT       where two constraints disagree, and how it's shown rather than hidden.
6. WHAT SHIPS FIRST   the smallest rung that stands alone. One, not five.
7. WHAT IT RESTS ON   which existing data/constants/state it uses. Nothing new if avoidable.
```

**Section 6 is the one that matters.** Every feature ships as one rung. If it can't, it's scoped
wrong.

---

## Next feature in this shape: the stacking check

**1 · Problem** — owners add toppers and supplements all day on advice from separate sources, and
nobody sums the stack. *"Can I add this?"* has no answer anywhere.

**2 · Why nobody solved it** — nutrition tools have no energetics; holistic advice has no running
total; neither knows the dog's breed risk.

**3 · The feature** — after a scan, add what you're topping with. The app tells you what the bowl
now looks like.

**4 · Three checks** — all three apply. This is the flagship.

**5 · The conflict** — GLM for a lipoma dog. Liver for a Labrador. Kelp on top of a fortified base.

**6 · Ships first** — **accumulation only.** Four flags: fat-solubles, copper, iodine, selenium.
Not completeness, not energetics. One rung.

**7 · Rests on** — the dog profile (breed, already collected), `ORGAN_MEATS`, `SUPERFOODS`,
`ANTI_INFLAMMATORY_FOODS`, `VITAMIN_MINERAL_PENALTIES`. **All of it already exists.**

---

**Related:** `docs/THE_LADDER.md` · `docs/GROWTH_PLAN.md` · `docs/MINERAL_FORMS_CHEATSHEET.md` ·
`docs/SYNTHETIC_VS_NATURAL.md`
