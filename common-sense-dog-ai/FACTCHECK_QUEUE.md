# 🔍 Fact-Check Queue — claims to verify later

Lower-confidence claims (🟡 moderate / ⚪ traditional/emerging) that are **live in Pinecone** but
flagged for Kyle's expert review. High-confidence 🟢 claims are NOT listed here.
When Kyle verifies or corrects one: fix in the pack JSON → `node scripts/force_upsert.mjs <pack.json>`
(force_upsert overrides the >0.95 near-dupe skip so edits actually apply), then check it off.

---

## Holistic Thyroid Support (ingested 2026-07-06) — pack: `scripts/qa-thyroid-holistic.json` + `qa-thyroid-diet-context.json`

**🟡 Moderate — verify the strength of the benefit claim:**
- [ ] **Selenium + zinc as thyroid support** — mechanism (T4→T3 conversion) is solid; the claim that *supplementing* them meaningfully helps a hypothyroid dog is moderate. Confirm you're comfortable recommending them as adjunct.
- [ ] **Kelp/iodine dosing guidance** — "kibble already fortified, so ≤ a few times/week; homemade/raw may need daily" — verify the frequency framing matches your practice.
- [ ] **Coat improves within 1–3 months** of proper levothyroxine dosing — check that timeframe.
- [ ] **Supplement–levothyroxine interactions** — calcium reduces absorption; separate from meds. Confirm the specifics.
- [ ] **Overweight/tired differential** (Cushing's, heart, arthritis vs thyroid) — sanity-check the list.
- [ ] **Diet context (kibble vs fresh)** — iodine EXCESS is a kibble-fed concern; iodine DEFICIENCY a raw/homemade concern; cheaper kibble uses less-bioavailable selenite/oxide forms. Verify the mineral-form claim.

**⚪ Traditional / Emerging — lowest confidence, verify hardest:**
- [ ] **Thyroid glandulars ("like feeds like")** — no canine trial evidence. BUT the paired warning (some glandular/raw thyroid products contain active hormone → "nutritional thyrotoxicosis") is well-documented — confirm both halves.
- [ ] **Ashwagandha** — human subclinical-hypothyroid data only, NO canine trials. Flagged as extrapolation. Verify you want it in at all, even labeled.
- [ ] **Thyroid herbs pair** — ashwagandha/guggul/adaptogens for hypo (traditional/human data); the key safety claim to confirm is that **bugleweed/lemon balm/motherwort are ANTI-thyroid (for hyperthyroid) and wrong for a hypothyroid dog** — verify that direction.

---

## Holistic Heart Support (ingested 2026-07-06, from Kyle's NotebookLM video summary) — pack: `scripts/qa-heart-holistic.json`

Complementary to existing heart pack (CoQ10/taurine/MMVD-vs-DCM already covered). 🟢 RRR home-monitoring & NT-proBNP are solid; these are the softer ones:

**🟠 Emerging / ⚪ Traditional — verify hardest:**
- [ ] **Hawthorn berry** — traditional/human cardiotonic data, NO canine RCTs; flagged that it can interact with heart meds. Confirm.
- [ ] **Dandelion as diuretic** — traditional; the key SAFETY claim is that it must NOT replace prescription furosemide in real CHF (can be fatal). Verify framing.
- [ ] **CBD for heart** — canine cardiac benefit NOT established; included mainly as a CYP450 drug-interaction caution. Confirm you want it in even labeled low.

**🟡 Moderate:**
- [ ] **Dental disease ↔ heart** — real association (Glickman ~60k dogs; endocarditis link, PMID 19222358) but NOT proven cause. Confirm the "risk factor, not cause" framing is how you want it.
- [ ] **NT-proBNP** — confirm it's positioned as screening/triage, not a replacement for echo.
- [ ] **Cardiac nutrients + kibble** — selenium/Vit E/magnesium + "nutrients baked out of kibble" / omega-3 & cachexia (Freeman). Verify the processing-loss claim.
- [ ] NOTE: dropped the "2nd leading cause of sudden death" stat from the video — couldn't verify it, left it out rather than assert it.

---

## Vaccine spacing + Bone broth/fasting (ingested 2026-07-06) — pack: `scripts/qa-vax-spacing-broth-fast.json`

- [ ] **Vaccine spacing (Dr. Jean Dodds protocol)** — rabies 3–4 wk apart, one treatment at a time. Web-verified as Dodds' real protocol, but it's NOT universally accepted by conventional vets (noted in answer). Confirm you're good with the framing.
- [ ] **Bone broth & autophagy** — CORRECTED Kyle's "doesn't break a fast" claim → honest version (amino acids partially blunt autophagy via mTOR; practically minor per Dr. Fung). Canine fasting-autophagy is extrapolated from human/rodent data. Verify you're happy with the correction vs. the original claim.

---

## Breed-Aware Health & Diet Flags (12 breeds, ingested 2026-07-06) — pack: `scripts/qa-breed-predispositions.json`

Predispositions are established (tier 2, Merck/ACVIM). One nuance to verify:
- [ ] **Grain-free/legume ("BEG") diet ↔ DCM** (in Doberman & Boxer entries) — phrased as FDA-investigated ASSOCIATION, not proven cause. Confirm framing matches your stance.
- [ ] Spot-check the breed→lever claims you know best (e.g., Lab POMC obesity gene, GSD as the classic EPI breed, Schnauzer low-fat, Dalmatian/English-Bulldog urate) — all standard vet knowledge but worth your eye.

---

## Leaky Gut — chronic vs temporary (3 pairs, ingested 2026-07-06) — pack: `scripts/qa-leaky-gut-distinction.json`

- [ ] **"Leaky gut syndrome" terminology** — intestinal PERMEABILITY is real & measurable (🟡, lactulose-mannitol, IBD link); "syndrome" as a discrete diagnosis is looser/holistic (⚪). Confirm the honest framing. The Hershey ruling + enzyme-vs-malabsorption distinction are tier-3 case logic (your own).

---

*Next packs append their flagged claims below as they're ingested.*
