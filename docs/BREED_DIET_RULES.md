# 🐕 Breed → diet rules

**Saved 2026-08-14 at Kyle's request.**

---

## ⚠️ READ THIS FIRST — nothing here has been verified

**Every line below is written from general knowledge. Not one has been checked against a primary
source in the session that produced it.** Kyle's own question was *"idk how accurate that actually
is"* — correct instinct, and this file exists to be checked, not to be shipped.

**Two things get confused throughout, and they have different evidence strengths:**

1. **The breed predisposition** — usually well established, often with a named gene
2. **The dietary rule derived from it** — sometimes direct, sometimes my inference

**A solid predisposition does not make the feeding advice solid.** Each entry below separates them.

**Nothing goes in the app until the ✅ column is earned by reading the source.**

---

## The rules

### 🥇 Strongest — named genetic defect, direct dietary consequence

**Bedlington Terrier · copper**
Predisposition: **COMMD1 gene mutation**, one of the best-characterised in veterinary genetics.
Dietary rule: restrict copper. **Direct — the defect is copper handling itself.**
*Verify: the COMMD1 literature.*

**Dalmatian · purines**
Predisposition: defective purine metabolism (uric acid transport) → urate stones. Breed-wide, not
individual.
Dietary rule: avoid organ meat and high-purine proteins. **Direct.**
*Verify: SLC2A9 / urate transport literature.*

**Large-breed puppies · calcium**
Predisposition: skeletal development sensitivity to calcium excess.
Dietary rule: **calcium max 1.8% DM, not the usual 2.5%.**
✅ **This one IS verified** — AAFCO's own profile carries the separate large-breed-growth limit,
read from the primary PDF on 2026-08-14.

### 🥈 Established predisposition, dietary rule partly inferred

**Labrador · copper**
Predisposition: copper-associated hepatopathy — established, ATP7A/ATP7B variants studied.
Dietary rule: watch copper load, prefer proteinate over sulfate.
⚠️ **Smedley 2009 was read only as an abstract.** And AAFCO sets **no copper maximum**, so there's
no threshold to compare against. See `docs/EVIDENCE_AUDIT.md`.

**Husky / Malamute · zinc**
Predisposition: zinc-responsive dermatosis — genetic absorption defect in northern breeds.
Well documented.
Dietary rule: **prefer chelated zinc; be wary of legume- and grain-heavy foods.**
⚠️ **The second half is inference.** The phytate–zinc binding mechanism is real, but "therefore
huskies shouldn't eat peas" is reasoning, not a study. **Kyle raised this exact example — worth
checking properly.**

**Miniature Schnauzer · fat**
Predisposition: idiopathic hyperlipidaemia, pancreatitis risk. Established.
Dietary rule: lower fat. Direct, but no specific threshold verified.

**German Shepherd · EPI**
Predisposition: hereditary exocrine pancreatic insufficiency. Established.
Dietary rule: affects digestibility and enzyme needs — **this is treatment territory, arguably
outside the app's scope.**

### 🥉 Weakest link between breed and food

**Doberman · Great Dane · Boxer · Irish Wolfhound · Cocker · Newfoundland · Golden · DCM**
Predisposition: genetic DCM — established, breed-specific.
Dietary rule: **the legume/taurine question matters more in these breeds.**
⚠️ **The diet interaction is precisely the unresolved part** — both landmark studies were
industry-funded and neither settles it. The *breed* risk is real; the *diet* link is not
established. Don't merge them.

**Great Dane · Weimaraner · Setters · Standard Poodle · bloat**
Predisposition: deep narrow chest, heritable. Established.
Dietary rule: eating speed, meal size, moisture.
⚠️ **Three GDV claims in the app are flagged as possibly overstating their source** (C15) — resolve
that before building breed rules on top of them.

---

## Why this belongs in the app anyway

**It's a food rule, not a diagnosis.** *"This food is a worse choice for your breed because of this
ingredient"* is label reading — the lane Kyle committed to on 2026-08-14.

**And the wiring exists:** `app/dog-profile.tsx` already captures the dog. **Combined with the
upgrade ladder, breed rules make the app personal, which is the thing no general AI tool can copy.**

**Scope discipline:** roughly ten rules that change a food recommendation. **Not a veterinary
curriculum.** If a rule doesn't change which bag someone buys, it doesn't belong here.

---

## Before any of it ships

- [ ] Read a primary source for each predisposition
- [ ] Separate the predisposition from the dietary rule in the copy, every time
- [ ] Label the tier — most of these are **mechanism** or **clinical experience**, not trial
- [ ] Resolve C15 (GDV claims) before the bloat rules
- [ ] Never state a breed risk without also saying most dogs of that breed never develop it

Related: `docs/EVIDENCE_AUDIT.md` · `docs/GROWTH_PLAN.md` § upgrade ladder ·
`~/.claude/skills/primary-sources/SKILL.md`
