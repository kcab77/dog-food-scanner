# 🍎 App Store Listing — PawGrade

**The canonical copy for App Store Connect.** When Kyle asks for "the description" or
"the app store stuff", it's this file. Update it here first, then paste into App Store Connect —
never the other way round, or the two drift.

Last revised: **2026-08-27** (was 2026-08-12) · Written against a baseline of **143 impressions / 0 product page
views / 0 downloads over 90 days** — an invisibility problem, not a conversion problem.

---

## The three indexed fields

On iOS, **only the name, subtitle and keyword field are indexed for search.** The description is
not. Apple combines all three and auto-generates keyword combinations, so never repeat a word
across them — it's wasted space.

| Field | Limit | Value | Used |
|---|---|---|---|
| **App name** | 30 | `PawGrade: Dog Food Scanner` | 26 |
| **Subtitle** | 30 | `Know what's in the bag` | 22 |
| **Keywords** | 100 | see below | 100 |

```
kibble,raw,ingredients,label,nutrition,puppy,vet,allergy,grainfree,treats,rating,checker,toxic,additives
```

**Keyword rules:** no spaces after commas (they cost characters) · single words, not phrases
(Apple builds the combinations) · never repeat `dog`, `food`, `scanner`, `bag` — already covered
by the name and subtitle.

**Why the name changed:** "PawGrade" alone is a term nobody searches. The name field carries the
most weight in Apple's index, and it's also the only text visible at the impression stage, so it
drives both ranking and tap-through.

---

## Description — paste-ready

The description is **conversion copy, not keyword copy**. Its one job is the first three lines,
because most people never tap "more".

```
I was completely overwhelmed when I first got Hershey.

Every decision felt high-stakes — food, vaccines, preventatives, supplements. I didn't know anything. So I did what everyone does: I trusted my vet, I bought what they recommended, and I assumed the system was looking out for my dog.

That was 7 years ago. I've been learning ever since.

At some point I came across a statistic I couldn't shake: almost half of dogs over ten develop cancer. I started asking why, and the more I researched, the more I realized how little I actually knew about what was going into Hershey's bowl every single day. Ingredients linked to liver damage. Synthetic preservatives flagged by cancer researchers. Things that have been in "premium" pet food for decades.

I'm not saying don't trust your vet. I'm saying be thoughtful about who you trust — and with what. PawGrade doesn't tell you what to do. It just shows you what's in the food and what the research says. That's it. You decide.

Point your camera at any dog food or treat and get an instant breakdown:

Safety score 0–100 based on peer-reviewed research, not brand partnerships
Flags 60+ harmful ingredients — BHA, BHT, menadione, artificial dyes, and more — with the science behind each one
Detects how the food was made — freeze-dried and raw score higher than kibble because the nutrition genuinely is different
Decodes the mineral block — chelate beats sulfate beats oxide, the part of the label almost nobody can read
Smart Scan — no barcode needed, just point at any part of the bag
Supplement recommendations based on what the food is missing
Tap any ingredient for a plain-English explanation of what it is, why it's in the food, and what long-term exposure looks like.

I built this out of love — for Hershey, and for every dog owner who felt as lost as I did and just wants to do right by their dog.

Free to download.

Scoring is never influenced by partnerships. Some product links are affiliate; they don't affect any score.

For informational and educational purposes only. Not veterinary advice.
```

**Kyle's rewrite, saved 2026-08-27.** It opens on the personal story rather than the feature
list, which is the stronger choice — the first three lines are the only ones most people read, and
"I was completely overwhelmed when I first got Hershey" earns more attention than a spec. Four
edits were made to his draft, all of them things the warnings below already covered:

| His draft | Changed to | Why |
|---|---|---|
| "1 in 2 dogs **now** develops cancer" | "almost half of dogs over ten develop cancer" | The 1-in-2 figure is wrong. See warning 1 — this is the one that matters. |
| "Separate Treats Scanner with its own scoring system" | "Decodes the mineral block…" | The Treats tab is hidden in the build. See warning 4. |
| "Free to download. **No subscription.**" | "Free to download." | A paid AI tier is planned. See warning 2. |
| *(nothing)* | "Some product links are affiliate; they don't affect any score." | See warning 3. |

---

**4. A feature that isn't shipping.** The description promised *"separate treats scanner with
its own rules"* while the Treats tab was hidden in the build. That's an Apple 2.3.1 rejection
(accurate metadata) and it misleads anyone who downloads for it. Replaced 2026-08-27 with the
mineral-forms line, which is real and shipping. **Put it back the day the tab is un-hidden — not
before.**

---

## ⚠️ Three things that must not creep back in

**1. The cancer statistic.** An earlier draft said *"1 in 2 dogs now develops cancer."* That's
wrong. The Veterinary Cancer Society figure is **1 in 4 dogs overall, and almost 50% of dogs over
age 10.** Use the over-ten framing — it's accurate, sourced, and hits harder. Also avoid "now":
the rising-trend claim is confounded by better diagnostics and longer lifespans.

This one matters more for PawGrade than for most apps. The entire pitch is *"I checked the
research and most people don't."* One overstated number in the opening paragraph is exactly what
a skeptic uses to dismiss everything else.

**2. "No subscription."** A paid AI tier is planned. Promising no subscription and adding one
later generates one-star reviews from people who feel baited. "Free to download" says the same
useful thing without the trap.

**3. Undisclosed affiliates.** The description asks readers to distrust brand partnerships while
the app carries affiliate links. Disclosing them is what makes the first claim credible — and it's
the same standard Kyle applies to vets.

---

## Screenshots

The **first two do roughly 80% of the work** — most people never swipe past them.

- **Lead with a RESULT** — score, breakdown, a flagged ingredient with its reason. Show the
  payoff, not the setup.
- **Never screenshot the disclaimer screen.** It's four bullets of legal text and it reads as
  "this is complicated and possibly legally fraught."
- **Add a short caption overlay** to each. Bare screenshots underperform captioned ones.

---

## Blockers to clear before resubmitting

- [ ] **The `(tabs)` route** — `app/(tabs)/` is leftover Expo starter template and renders a tab
      literally labelled "(tabs)" in the shipped app.
- [ ] **The disclaimer gate** — demote from a full screen to a one-line note plus a link.
- [ ] **`SUPPLEMENT_RECS[2]`** (`app/index.tsx`) — variable named `fishOil`, index 2 is Green
      Lipped Mussel. Wrong affiliate card on every low-scoring scan.

Related: `docs/TODO.md` (full outstanding list) · `PROJECTS.md` · `CLAUDE.md`
