# 🧠 Pinecone Knowledge Base — Content To-Do

Running roadmap of Q&A packs to feed the `dog-knowledge-database` index (the brain behind the
AI assistant on commonsensedog.com). Goal: feed Pinecone as much high-quality holistic dog
knowledge as possible so the assistant becomes THE go-to instead of normal blog sites.

**How to add a pack:** draft a JSON array of `{question, answer, topic, source}` → Kyle reviews →
`node common-sense-dog-ai/scripts/ingest_pack.js <pack.json>` → write a summary note to Obsidian.

---

## ✅ Already in Pinecone
- [x] Blog topic summaries (30) + full blog articles (9)
- [x] Supplement evidence pack (43 pairs)
- [x] Flea/tick + isoxazolines pack (19 pairs)
- [x] Itchy Skin & Allergies (17 pairs) — ingested 2026-06-28
- [x] Dish Soap & Laundry Detergent / household chemicals (12 pairs) — ingested 2026-06-28
- [x] Processing Methods (12 pairs) — ingested 2026-06-28 (from Obsidian Brain/Nutrition/)
- [x] Vitamins & Minerals — good vs toxic forms (13 pairs) — ingested 2026-06-28 (from Obsidian)
- [x] Reading Pet Food Labels — As Fed/DM/%kcal (10 pairs) — ingested 2026-06-28 (from Obsidian)
- [x] Probiotics & gut health (12 pairs) — ingested 2026-06-28 (fact-checked: BMC Microbiology 2025, gut-skin axis)
- [x] Organs, TCVM & Lipoma diet (12 pairs) — ingested 2026-06-28 (from Obsidian)
- [x] Nutrition Philosophy (9 pairs) — ingested 2026-06-28 (from Obsidian)
- [x] Holistic Parasite Prevention & Natural Deworming (17 pairs) — ingested 2026-06-29
- [x] Natural Parasite Safety & Dosing — companion to above (12 pairs) — ingested 2026-06-30
- [x] Fasting & Bone Broth (frozen broth ball for restless fasting dogs) (6 pairs) — ingested 2026-06-30
- [x] Toxic & Safe Foods ("Can my dog eat ___?") — real toxicology data (20 pairs) — ingested 2026-06-30
- [x] Sensitive Stomach / Chronic Diarrhea / IBD — evidence-graded (11 pairs) — ingested 2026-06-30
- [x] Yeast & Ear Infections — evidence-graded, honest on sugar myth (11 pairs) — ingested 2026-06-30
- [x] Joints & Arthritis — evidence-graded (omega-3 strong, glucosamine mixed) (11 pairs) — ingested 2026-06-30
- [x] Pancreatitis — evidence-graded (low-fat; early-feeding myth-bust) (9 pairs) — ingested 2026-06-30
- [x] Kidney & Liver Support — evidence-graded (phosphorus; copper-hepatitis) (11 pairs) — ingested 2026-06-30
- [x] Diabetes — evidence-graded (insulin-dependent, no "natural cure") (9 pairs) — ingested 2026-06-30
- [x] Myth-Busters (grain-free/DCM nuance, by-products, AAFCO, raw, bones) (10 pairs) — ingested 2026-06-30
- [x] Life Stages (puppy/large-breed calcium, senior protein myth, weight/longevity) (11 pairs) — ingested 2026-06-30
- [x] Heat & Exercise Safety (humidity/panting, heatstroke, heat-vs-fuel, swimming) (10 pairs) — ingested 2026-07-02
- [x] Joint Health Research — citation-backed from Obsidian (Marshall/Roush/Stabile/Kampa etc.) (10 pairs) — ingested 2026-07-02
- [x] Post-Antibiotic Yeast Overgrowth (Hershey case) — FIRST pack under new protocol, confidence-tagged; colloidal-silver claim calibrated (11 pairs) — ingested 2026-07-04
- [x] Anxiety & Calming — protocol pack, confidence-tagged (L-theanine/DAP/probiotics/honest meds take) (10 pairs) — ingested 2026-07-04
- [x] Bloat / GDV — protocol pack (emergency signs, raised-bowl myth-bust, gastropexy) (9 pairs) — ingested 2026-07-04
  - +2 pairs added 2026-07-04: "kibble swells → bloat" MYTH-BUST + wet/raw/freeze-dried food-type question (rehydrated freeze-dried is fine)
- [x] Zoonotic Parasites (dog→human) — protocol pack, CDC/CAPC sourced, anti-alarmist (9 pairs) — ingested 2026-07-04
- [x] Cancer Prevention & Support — protocol pack (obesity/omega-3/turkey-tail PSP + honest keto/turmeric; NOT a cure) (10 pairs) — ingested 2026-07-04
- [x] Urinary Health — protocol pack (struvite vs oxalate, hydration, cranberry-oxalate caution) (10 pairs) — ingested 2026-07-04
- [x] Dental Health — protocol pack (brushing gold-standard, VOHC, anesthesia-free + raw-bone myths) (9 pairs) — ingested 2026-07-04
- [x] Vaccines & Titers — protocol pack (core essential, 3yr intervals + titers, NOT anti-vax) (10 pairs) — ingested 2026-07-04
- [x] GI Motility, Recovery & Colon Support (Hershey case) — protocol pack, confidence-tagged (gastrocolic reflex, freeze-dried rehydration, bone abrasion, antibiotic+NSAID dark stool, flora-recovery color shifts, colon red flags, herbal support, MicrocynAH, cough vs kennel cough, manuka-during-yeast) (18 pairs) — ingested 2026-07-05
- [x] **Holistic Thyroid Support** (organ series #1) — confidence-tagged, web-verified; honest "no natural cure / levothyroxine is standard", iodine-excess + hormone-containing-glandular safety warnings (12 + diet-context + herbs = 14 pairs) — ingested 2026-07-06. SEO article: `drafts/thyroid-support-for-dogs.md`; answer page `/answers/natural-thyroid-support-for-dogs`
- [x] **Holistic Heart Support** (complementary to existing heart pack) — from Kyle's NotebookLM video summary; gaps only: hawthorn, resting-respiratory-rate monitoring, NT-proBNP, dandelion diuretic, CBD caution, dental-heart association (verified: assoc not cause), cardiac nutrients + diet-context (7 pairs) — ingested 2026-07-06. Flagged in FACTCHECK_QUEUE.
- [x] Milk-thistle SEO answer page + 301 redirect from dead WP URL — `/answers/milk-thistle-for-dogs`
- [x] **Evidence-Based Holistic Topics** — Kyle-supplied research roundup (omega-3 OA, probiotics, curcumin, CBD, MCT/CDS, antioxidant brain-aging, GLM, raw diet metabolic, B. longum anxiety) + acupuncture + Coriolus/PSP hemangiosarcoma cancer-caution case; web-verified the two cancer/epilepsy-critical citations directly (15 pairs) — ingested 2026-07-12. Obsidian summary: `commonsensedog knowledge/Evidence-Based Holistic Topics (2026-07-12).md`
- [x] **Cognitive Dysfunction (CCDS/DISHA)** — companion pack to the evidence pack above; DISHA symptom framing, mimics-to-rule-out-first (joint pain/vision-hearing loss/UTI/thyroid), MCT+antioxidant diet reuse, diet+enrichment combo (4 pairs) — ingested 2026-07-12. Obsidian summary: `commonsensedog knowledge/Cognitive Dysfunction - CCDS DISHA (2026-07-12).md`
- [x] **Evidence-Based Holistic Topics — Batch 2** — 9 new topics from Kyle's expanded doc (skipped 11 dupes already in the pack above): SAMe (liver + cognitive), glucosamine/chondroitin, boswellia, melatonin, alpha-casozepine, cranberry (trial data contradicts the popular UTI belief — corrected), quercetin, yucca, Lion's Mane/mushroom blends (10 pairs) — ingested 2026-07-12. Obsidian summary: `commonsensedog knowledge/Evidence-Based Holistic Topics Batch 2 (2026-07-12).md`
- [x] **AAFCO Nutrient Profiles (minimums/maximums) + therapeutic-vs-AAFCO-minimum framing** — transcribed directly from AAFCO's own official PFC committee PDF (highest-accuracy source, not a third-party reproduction). Covers protein/fat/amino acids, minerals (calcium/phosphorus/selenium/copper/iron/zinc), vitamins, the "adult food has NO omega-3 minimum" gotcha, large-breed-puppy calcium cap, and real therapeutic dose comparisons (vitamin E, zinc-responsive dermatosis) with explicit unit-basis caveats (10 pairs) — ingested 2026-07-13. Full table + footnotes in Obsidian: `commonsensedog knowledge/AAFCO Dog Food Nutrient Profiles — Minimums, Maximums & Therapeutic Doses.md`
- [x] **Fragrance Avoidance (toys, shampoo, products)** — companion to the household-chemicals pack; fills the shampoo/toys gap. Fragrance-free default, "low on ingredient list" fallback rule, unscented-vs-fragrance-free distinction, labeling-loophole explanation. Honestly tiered ⚪ traditional/precautionary, not trial-backed (6 pairs) — ingested 2026-07-14. Obsidian summary: `commonsensedog knowledge/Fragrance Avoidance - Toys, Shampoo, Products (2026-07-14).md`
- [x] **Manuka honey (gums) + Anthocyanins/purple veg & cancer** — Hershey case log (gum redness improved topically, tier 3) + web-verified anthocyanin-cancer research with explicit "in vitro ≠ cures cancer in a dog" honesty caveat (cancer = extra scrutiny per protocol), plus a safe-vs-toxic purple produce companion pair (3 pairs) — ingested 2026-07-14. Obsidian summary: `commonsensedog knowledge/Manuka Honey Gums + Anthocyanins-Cancer (2026-07-14).md`
- [x] **Holistic Topics Expansion** — 17 new topics from Kyle's own research doc (colostrum, L-theanine, UC-II collagen, milk thistle, slippery elm, digestive enzymes, colloidal silver, diatomaceous earth, bone broth, ACV, coconut/MCT, time-restricted feeding, keto/cancer, fermented veg, homemade-diet-balancing risk, TCVM energetics, homeopathy) + 1 bonus pair cross-referencing named holistic vets (Becker/Morgan/Jones) against the evidence. Web-verified colloidal silver (FDA/argyria) + the UC Davis 95%-deficient homemade-diet stat (18 pairs) — ingested 2026-07-17. Obsidian summary: `commonsensedog knowledge/Holistic Topics Expansion (2026-07-17).md`
- [x] **Salt Divider Rule** — reading-a-label heuristic (fulfills part of the "reading a label: ingredient splitting, dry-matter basis" backlog item below): AAFCO descending-order-by-weight rule + salt's ~1% inclusion means everything below salt on the panel is trace-level; ingredient-splitting trick explained (potato/rice split into multiple AAFCO forms to hide combined weight); "trace ≠ worthless" caveat (added vitamins/probiotics/preservatives work at sub-1% doses). Web-verified the AAFCO rule directly (5 pairs) — ingested 2026-07-19. Obsidian summary: `commonsensedog knowledge/Salt Divider Rule (2026-07-19).md`
- [x] **Holistic Topics Expansion — Batch 2** — 12 more non-overlapping topics (raw goat milk/kefir, green tripe, garlic-for-fleas ⚠️, PEA, eggshell membrane, velvet antler, spirulina, beta-glucans, kelp/dental, ashwagandha, manuka honey wounds/GI, fecal microbiota transplant) + 1 bonus vet cross-reference pair. Garlic web-verified and flagged hard — 2025 in-vitro study shows dose-dependent RBC damage (dried worse than fresh) + no evidence it works as a flea preventive, directly contradicting Dr. Andrew Jones's public recommendation (13 pairs) — ingested 2026-07-21. Obsidian summary: `commonsensedog knowledge/Holistic Topics Expansion Batch 2 (2026-07-21).md`
- [x] **Tooth Enamel Remineralization (human research + dog-safety cross-reference)** — Kyle-supplied research brief, reframed dog-first: enamel biology (doesn't regrow; early demineralization can be reversed), human toothpaste is dangerous for dogs (fluoride + xylitol + SLS), hydroxyapatite as the promising fluoride alternative, kelp/diet/raw-bone dental support, and an honest "not available yet" on the Nov 2025 lab-stage regeneration gel. Web-verified the one new safety-critical figure (canine fluoride toxicity dose) directly against Merck Veterinary Manual — matched exactly (9 pairs) — ingested 2026-07-24. Obsidian summary: `commonsensedog knowledge/Tooth Enamel Remineralization — Human Research + Dog Safety Cross-Reference (2026-07-24).md`
- [x] **Lipomas — evidence-based (what they are, prevention, what actually shrinks them)** — Kyle-supplied evidence-graded reference; core to the brand (Hershey). Leads with the safety crux (FNA first — MCTs mimic lipomas by feel; the harm is diagnostic delay), VetCompass risk factors (obesity ~5×, age ~17.5×, breeds), honest "no herb/detox has any evidence of dissolving a lipoma — mechanism doesn't fit," and the rarely-offered intralesional triamcinolone option. Web-verified the two load-bearing studies (O'Neill VetCompass 2018 + Lamagna triamcinolone 2012) directly (13 pairs) — ingested 2026-07-28. Obsidian summary: `commonsensedog knowledge/Lipomas in Dogs — Evidence-Based (2026-07-28).md`. Also published as website answer pages (see below).

## 🔍 In review (drafted, awaiting Kyle's approval before ingest)
*(none right now — all caught up; all Brain/Nutrition/ vault notes are now packed)*

## 📝 Queue — next up
*(empty — pick from backlog below)*

## 💡 Backlog — high-value ideas (prioritized)
**Condition → holistic diet fixes (goldmine):**
- [ ] Yeast & ear infections · hot spots *(some hot-spot/yeast covered in allergy pack — expand)*
- [ ] Sensitive stomach / chronic diarrhea / IBD
- [ ] Pancreatitis (low-fat holistic approach)
- [ ] Kidney & liver support
- [ ] Diabetes
- [ ] Anal gland issues · bad breath / dental · coprophagia (poop eating)

**Life stages:**
- [ ] Puppy feeding · senior dog needs · pregnant/nursing · weight loss / obesity

**Ingredient deep-dives (also feeds the scanner's brain):**
- [ ] Legumes & the DCM story · carrageenan · guar/xanthan gum · glyphosate & mycotoxins in kibble ·
      "natural flavors" · rendered fats · pea protein

**Myth-busters (rank well in search + match the voice):**
- [ ] "Grain-free causes DCM" · "by-products are fine" · "AAFCO complete = healthy" ·
      "dogs are basically omnivores"

**Practical how-tos:**
- [ ] Transitioning kibble → fresh safely · raw feeding 80/10/10 basics · balancing a homemade bowl ·
      reading a label (ingredient splitting, dry-matter basis)

## ⚙️ Smartest ongoing source
- [ ] **Mine real chat questions from Supabase** (especially "no match" fallbacks) → turn the actual
      questions people ask into knowledge. Self-improving loop.
