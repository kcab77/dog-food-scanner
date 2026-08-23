# 🔬 Evidence Audit — PawGrade

**Started 2026-08-13.** Every claim the app makes, checked against a primary source, tiered by
how strong the evidence actually is.

**The rule being applied** (Kyle, 2026-08-13): *anecdote can tell you what to TRY; it can't tell
you what's TRUE.*

| Tier | Can say *do this* | Can say *this causes that* |
|---|---|---|
| **Trial** — randomised, controlled | ✅ | ✅ |
| **Study** — observational, association | ✅ | ✅ with hedging |
| **Mechanism** — plausible, untested in dogs | ✅ | ❌ |
| **Clinical** — what vets consistently report | ✅ | ❌ |
| **Owner reports** — widely reported, no trial | ✅ | ❌ |

---

## ✅ Batch 1 — `SUPPLEMENT_RECS` (7 affiliate cards) — DONE

**Headline: all 7 are affiliate cards and they carry zero citations between them.** For a product
positioned on evidence honesty, the place that earns money is currently the least sourced.

### 🔴 C1 — Fish oil dose is roughly half the therapeutic dose

Card says **"~20mg EPA+DHA per pound"** = **44 mg/kg**.

- Randomised, double-blind, multicentre trial: **69 mg/kg/day, 3 months** — significant improvement
  in pain, lameness, joint disease
- Synthesis of 23 randomised trials: efficacy **60–100 mg/kg/day**
- NRC safe upper limit: **370 mg/kg^0.75**

**Hershey, 75 lb / 34 kg:** app says 1,500 mg; trials used **2,040–3,400 mg**; safe ceiling ~5,200 mg.

**Not wrong — mislabelled.** It's a maintenance dose presented as the joint dose.
**Fix:** give both, and name which is which. **→ Needs Kyle's sign-off (changes advice).**

### 🟡 C2 — Green lipped mussel overstated

Card: *"one of the most potent natural anti-inflammatories."*
Systematic review: **"a moderate amount of evidence exists for a scientifically valid
relationship"** with clinical benefit in canine OA — with noted methodological deficiencies.
**Fix:** downgrade wording, add citation, tier = **Trial (moderate)**.

### 🟡 C3 — Two unsupported "synergy" claims

Probiotics + fish oil, and GLM + fish oil. **Synergy is a specific claim (combined > sum) and
neither combination has been tested.** Fix: "these do different jobs and can be given together."

### 🟡 C4 — Unverified superlatives

- Heart: *"the #1 dietary source of CoQ10"* — high, yes; **"#1" unverified**
- Milk thistle: *"one of the most well-studied natural liver protectants **in dogs**"* — most
  silymarin research is human/rodent. **Verify or reword.**

### 🔴 C5 — Four Leaf Rover card is marketing, not content

*"Research-backed"*, *"one of the most trusted brands"* — the brand's own claims, on an affiliate
link, naming no product and no evidence. **→ Needs Kyle's decision (affiliate revenue).**

---

## ✅ Batch 2 — `HARMFUL_INGREDIENTS` — DONE

**This section is genuinely good.** Several entries are models of how to do it — potassium sorbate,
calcium propionate and menadione each present the evidence *against their own flag* and say plainly
where it runs out. **Don't lose that in any rewrite.**

Two systematic problems, though.

### 🔴 C6 — Severity tiers contradict their own reason text

**The app says the honest thing and then scores as if the claim were proven.**

| Ingredient | Severity | What its own text says |
|---|---|---|
| **menadione** | `severe` | *"We don't claim it has been shown to harm dogs at label doses, because it hasn't."* |
| **potassium sorbate** | `moderate` | *"A preference against, not a demonstrated harm."* |
| **corn syrup** | `severe` | *"⚪ Mechanistic, not trial-based"* |
| **dl-methionine** | `moderate` | *"Generally safe… no evidence of harm at label levels… a formulation signal rather than a hazard"* |
| **wheat gluten** | `moderate` | *"⚪ Mechanistic / formulation signal"* |
| **soy protein isolate** | `moderate` | *"⚪ Mechanistic / formulation signal"* |
| **zinc oxide** | `moderate` | Bioavailability problem, not a harm |

**`dl-methionine` is the clearest case: the text says "no evidence of harm" and it still deducts
points as a moderate hazard.**

**Proposed rule — severity capped by evidence tier:**

- **Trial / documented canine harm** → may be `toxic` or `severe`
- **Observational / association** → up to `moderate`
- **Mechanism only / formulation signal** → `mild` maximum

**Correctly rated under that rule, no change needed:** xylitol, ethoxyquin, BHA, BHT, copper
sulfate, sodium selenite, sodium metabisulfite (documented fatal canine thiamine cases — the
`severe` is earned), cellulose.

**⚠️ THIS IS A SCORING CHANGE — do not apply without Kyle's explicit approval.**

### 🟡 C7 — "Pet nutrition researchers" is a citation-shaped phrase with no citation

Appears **five times** — corn gluten meal, peanut hulls, brewer rice, ground corn, grain fragments.
**Name the researcher or drop the appeal to authority.** These are the weakest entries in the file
and they're the ones most likely to be challenged.

### 🟡 C8 — Two entries with vague sourcing

- **tbhq** — *"Some animal studies have associated…"* — which studies?
- **sodium nitrite** — *"Research suggests…"* — no citation

### 🟡 C9 — One claim I think may simply be wrong

**ground corn: *"relatively low digestibility for dogs."*** Cooked, ground corn is generally well
digested by dogs. **The honest criticism is nutritional value and cost, not digestibility.**
**Verify before the next release.**

---

## 🩺 Batch 3 — DCM / legume flag — DONE (research complete, wording change pending)

**The scoring rule is correct and better designed than either public camp.**
`app/index.tsx:3987-3991` requires grain-free **AND** (legume/potato in top 5 **OR** 3+ legume
fractions). **Grain-free alone never triggers it.**

**What the evidence actually shows** — both landmark studies read in full:

- [**JAS 2025**](https://academic.oup.com/jas/article/doi/10.1093/jas/skaf225/8196486) — 60 dogs,
  randomised, double-blind, 18 months, echo + troponin + NT-proBNP + taurine. No DCM.
  **But: 0.1% taurine added to every arm** (removes the variable), **underpowered** by the authors'
  own admission (n=60 vs ~0.5% prevalence), and **funded by Hill's with all authors Hill's
  employees.**
- [**PLOS One**](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0285381) —
  8 beagles, 28 days, 42% lentil / 58% pea flour. **28 days cannot detect DCM.**
  **Funded by pulse growers.** Authors note beagles aren't DCM-predisposed.

### 🟡 C10 — Reword the legume flag to state the real mechanism

**The concern is protein displacement, not legume toxicity.** Legume protein is low in sulfur amino
acids (methionine, cysteine) which dogs use to make taurine — so high legume inclusion means less
of the protein is coming from meat.

**Replace any implication that legumes damage hearts with:**

> *"Peas high in the list usually mean less of the protein is coming from meat. The heart concern is
> about that displacement, not about peas themselves. Foods with added taurine are less of a
> question mark."*

**Same flag, honest reason, survives whichever way the research lands.**

**Also worth stating in-app:** the app can't read taurine off a label, so **the legume-position rule
is a proxy** and should say so.

---

## ✅ Batch 4 — `GDV_EVIDENCE` · `LIFESPAN_EVIDENCE` · `CARB_LEVELS` — DONE

**The writing here is the best in the app.** The autophagy debunk, the "wait an hour" entry and the
once-daily-vs-bloat conflict callout all do the hard thing — state the tension and refuse to
resolve it dishonestly. **Keep all of it.**

But three findings.

### 🔴 C14 — The Kealy lifespan numbers are slightly wrong

App says: **"median 13.0 years against 11.2 — 1.8 years, or 16% longer."**

Published figures ([Kealy et al., *JAVMA* 220(9):1315, 2002](https://pubmed.ncbi.nlm.nih.gov/11991408/)):
**12.9 restricted vs 11.1 control.** Purina's own summary reports the gain as **15%**.

**The 1.8-year difference is right. Both absolute numbers are off by 0.1**, and the percentage
depends on how it's computed (1.8/11.1 = 16.2%; Purina says 15%).

**Fix:** state **12.9 vs 11.1**, and say "roughly 15–16%" rather than a false-precision single
figure. **Small, but this is exactly the kind of number someone checks.**

### 🔴 C15 — Several GDV claims may be stated more strongly than the source supports

**⚠️ Verify against the full papers before changing anything — this is from abstracts.**

The app blends findings from at least two different studies without distinguishing them:

- [**Glickman et al., *JAVMA* 217(10):1492, 2000**](https://avmajournals.avma.org/view/journals/javma/217/10/javma.2000.217.1492.xml) — non-dietary risk factors, the 1,637-dog prospective cohort
- **Raghavan et al.** — dietary risk factors, where the citric-acid/moistening and fat-in-first-four findings actually come from

**The non-dietary paper's abstract states that feeding several small meals per day, moistening dry
food, and restricting water or exercise around meals were NOT associated with a *decreased* risk on
multivariate analysis.**

That sits awkwardly against three of our entries:

| Our claim | Problem |
|---|---|
| *"Two or three smaller meals beat one large one"* | The multivariate result found no protective effect |
| *"Do NOT restrict water — found to INCREASE risk"* | Source says "not associated with decreased risk" — **not the same as increases risk** |
| *"Moistening dry food — 4.2× risk"* | True, but from **Raghavan**, and only for foods containing citric acid — needs attributing to the right paper |

**"Not protective" and "harmful" are different findings.** We may have upgraded one into the other.

### 🟡 C16 — No study is named anywhere in these constants

Every finding is *described* ("a 5-year prospective study of 1,637 dogs") but **none is attributed**.
For an app whose entire thesis is that it cites, describing a study without naming it is the gap.
**Add author, journal, year to each.**

### 🟢 C17 — The tier system already half-exists (good news for C11)

Three vocabularies are already in the code, doing **two different jobs**:

- `GDV_EVIDENCE.tier`: `"act" | "know" | "mixed"` — **actionability**
- `LIFESPAN_EVIDENCE.strength`: `"proven" | "observational" | "conflict"` — **evidence strength**
- `CARB_LEVELS.tier`: `"ideal" | "fine" | "watch" | "poor"` — **quality, not evidence at all**

**C11 is therefore mostly unification, not invention.** Separate the two axes: one field for
evidence strength (the badge), one for actionability. Don't collapse them — they're genuinely
different questions.

---

## ⚖️ Contested claim #2 — bloat mechanism (logged 2026-08-13)

**Dr. Judy Morgan and the app directly disagree on what causes bloat.**

**Her position** — [Kick Kibble To The Curb — Bloating and Cystitis](https://drjudymorgan.com/blogs/blog/kick-kibble-to-the-curb-bloating-and-cystitis),
**dated 27 September 2016**:

> *"Kibble that blows apart and makes a very large volume when water is added can be dangerous for
> animals prone to bloat."*

> *"This is one of the reasons owners of large breed dogs will break the meals into several
> feedings, to avoid production of gas when the kibble swells in the stomach."*

**The app's position** (`GDV_EVIDENCE`): *"It's swallowed AIR, not food expanding… Aerophagia is
the cause; kibble swelling is not."* — resting on gas-analysis work finding bloated stomachs
contain essentially room air.

**⚠️ Note the date.** Nearly ten years old; this may not be her current position. Same trap Kyle
flagged this morning about undated blog posts.

**But they agree on the action.** She says drop kibble for high-moisture species-appropriate food;
the app says moisture-rich diets sit outside the highest-risk pattern and dry-only is itself a risk
factor. **Same destination, different stated mechanism.**

**And she does NOT recommend soaking kibble** — she notes 4+ cups of water per cup would be needed
and most kibble won't absorb it.

**Why the mechanism still matters:** the kibble-swelling belief is exactly what leads people to
soak their kibble. She avoids that trap by rejecting kibble entirely — **someone who keeps feeding
kibble and accepts her mechanism will not.** (See **C15** — the moistening risk figure itself
still needs verifying.)

---

## 🏷️ C23 — Source & funding labels (Kyle's call, 2026-08-13)

**Two dimensions on every claim, not one:** how strong is the evidence, and **who paid for it.**

> `Trial · independent` · `Trial · industry-funded (Hill's)` · `Clinical experience · Dr. Judy Morgan`

**⚠️ The direction of the conflict matters more than its existence.** A funded study that finds
what its funder wanted is weak. **A funded study that finds something *against* its funder's
interest is strong** — nobody pays for that result. Label the funder and let the reader weigh it.

**And label both sides.** A GLM trial funded by a GLM manufacturer has the same problem as a Hill's
trial about kibble. **Labelling only conventional sources reads as bias; labelling everything reads
as rigour.**

### What we know so far

| Claim in app | Source | Funding | Direction |
|---|---|---|---|
| **Lifespan +1.8 yrs** (Kealy 2002, *JAVMA* 220:1315) | Conventional trial, randomised, paired littermates | **⚠️ PURINA** — this is the Purina Life Span Study | **Against funder's interest** — the finding is *feed less food*. Nobody sells more kibble with it. **Strongest possible version of industry-funded evidence.** |
| **No DCM in 18 months** ([JAS 2025](https://academic.oup.com/jas/article/doi/10.1093/jas/skaf225/8196486)) | Conventional RCT | **Hill's** — all authors Hill's employees | **Favours funder.** Conclusion "quality formulation is what matters" points buyers at big formulators. Weigh accordingly. |
| **No harm at high pulse inclusion** ([PLOS One](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0285381)) | Conventional, 8 beagles, 28 days | **Pulse growers** (Alberta/Manitoba/Ontario/Saskatchewan/Pulse Canada) | **Favours funder.** They sell peas and lentils. |
| **No DCM in Huskies at 45% pulses** | Conventional | **Champion Pet Foods** (Orijen, Acana) | **Favours funder.** Grain-free brand. |
| **Raised bowls +110% GDV risk** (Glickman, Purdue) | Conventional prospective cohort | Academic — **verify** | — |
| **Copper rising post-1997** (Smedley 2009, *Vet Path*) | Conventional | **Verify** | — |
| **Lipomas as dampness / dry the dog out** | **Holistic — Dr. Judy Morgan, TCVM** | Practitioner, sells related products | Clinical experience, not a trial. Label as such. |

### 🎯 The thing worth noticing

**Your single best piece of evidence — the 1.8-year lifespan finding — is a Purina study.**

**And that's exactly why it's credible:** Purina funded a 14-year trial whose conclusion is *feed
your dog 25% less of it.* **A company doesn't buy that result.**

**Which is the argument against a blanket "conventional/name-brand = bad" rule.** The label should
report the funder and let the reader judge — not pre-judge for them. Otherwise the app has to throw
out its own strongest study.

---

## ⏳ Still to audit

- `GDV_EVIDENCE` · `LIFESPAN_EVIDENCE` · `CARB_LEVELS` · `HOMEMADE_EVIDENCE` · `AA_EVIDENCE`
- `DEFICIENCY_CHECKLIST` · `INGREDIENT_DB` (30 entries) · `FISH_EPA_DHA` (17 species)
- `EGG_QUALITY` · `BOWL_MATERIALS` · `GA_MINIMUM_TRAP` · `SARDINE_VS_OIL`
- `TREAT_HARMFUL` (**rawhide is missing entirely**)
- Lipoma section · Dental section · TCVM section · Hershey's Protocol

---

# 📋 THE CHANGE LIST

## Needs Kyle's decision before anything happens

| # | Change | Why it needs you |
|---|---|---|
| **C1** | Fish oil: state maintenance **and** joint dose | Changes advice people act on |
| **C5** | Four Leaf Rover card — fix or cut | Affiliate revenue |
| **C6** | Cap severity by evidence tier | **Scoring change** |

## Safe to do without a decision

| # | Change |
|---|---|
| **C2** | GLM: soften wording, add systematic-review citation |
| **C3** | Remove both "synergy" claims |
| **C4** | Verify or soften CoQ10 "#1" and milk thistle "in dogs" |
| **C7** | Replace 5× "pet nutrition researchers" with real citations or drop the appeal |
| **C8** | Cite or soften tbhq and sodium nitrite |
| **C9** | Verify ground corn digestibility — likely wrong |
| **C10** | Reword legume flag to displacement mechanism + say it's a proxy |
| **C14** | Kealy figures → **12.9 vs 11.1**, "roughly 15–16%" |
| **C16** | Name the study (author, journal, year) on every finding in `GDV_EVIDENCE` and `LIFESPAN_EVIDENCE` |

## Blocked — needs the full papers read first

| # | Change |
|---|---|
| **C15** | **GDV claims may overstate the source.** Read Glickman 2000 (non-dietary) and Raghavan (dietary) in full, then correct the meal-frequency, water-restriction and moistening entries. **Three claims are affected; two may be reversed.** |

## New build work

| # | Change |
|---|---|
| **C11** | Build `<EvidenceBadge>` — 5 tiers, saturation encodes confidence, tokens in `lib/theme.ts` |
| **C12** | Tag every audited claim with its tier |
| **C13** | Add rawhide to `TREAT_HARMFUL` |
| **C17** | Unify the three existing tier vocabularies. **Split into two fields** — evidence strength (badge) and actionability — rather than collapsing them |

---

Related: `CLAUDE.md` § Evidence rule · `PINECONE_PROTOCOL.md` · `docs/TODO.md` ·
`~/.claude/skills/primary-sources/`
