# 📈 PawGrade — Growth Plan

**Written 2026-08-13.** The distribution strategy, and why it's shaped this way.

Baseline it has to beat: **143 App Store impressions, 0 product page views, 0 downloads in 90 days.**

---

## 🎯 The product principle: improvement, not purity

**Stated by Kyle, 2026-08-13:**

> *"My goal is improvement. Not everybody has money for expensive good food, so I want to make
> sure if they're spending money on good food it's worth it. I do hate kibble, but I want to
> steer them at better kibble options."*

**This is the principle the product already runs on — it just hadn't been written down.** It
explains three decisions that otherwise look like softness:

- **Kibble as the neutral baseline** (2026-07-19) — no penalty, no cap; gentler formats earn a
  bonus instead. That's "improvement, not purity" expressed as arithmetic.
- **Softened score labels** (2026-07-12) — "Poor ❌" and "Very Poor 🚫" removed.
- **The voice** — *"I fed my dog kibble for six years, I'm not judging you."*

**Why it's also the commercially correct call:** the market for *"stop feeding kibble"* is small
and already converted. The market for *"which bag should I buy instead"* is everyone. **And a
person told their only option is failure feels guilty and changes nothing.**

### 🪜 THE UPGRADE LADDER — the concrete expression of it

**Kyle, 2026-08-14: "upgrade as much as the wallet can provide."**

**The ladder already exists in `PROCESSING_METHODS`** — Kibble +0 → Baked +8 → Air-Dried +18 →
Gently Cooked +22 → Raw/Freeze-dried +25. **It has never been shown to the user as a ladder.**

| Rung | Move | Cost |
|---|---|---|
| **0** | What they feed now | — |
| **1** | **A better bag at the same price** | **£0** |
| **2** | **Same food + egg / sardines / kefir** | **pennies a day** |
| **3** | **Swap 25% of the bowl for fresh or freeze-dried** | a little more |
| **4** | Move the base to air-dried or baked | moderate |
| **5** | Gently cooked or freeze-dried | real money |
| **6** | Fresh or raw | most |

**Why it beats a score on its own:** *38* is a verdict. *"You're on rung 0, rung 1 costs nothing"*
is a plan. **Everybody gets a next step; nobody gets told they failed.**

**And it keeps them in the category.** Rung 1 is still kibble, same aisle, same price — which
answers the retention worry directly. You're not sending customers away, you're changing the bag.

**Rung 3 is the one nobody talks about.** Owners think it's binary — raw or kibble. **Replacing a
quarter of the bowl is both allowed and effective**, and almost nobody tells them so.

**It's also Kyle's own story:** kibble for six years → half-and-half → fresh. **He climbed the
ladder rather than jumping it, and that's what makes it credible to someone on rung 0.**

### 💷 Costing the rungs — solved without a pricing database

**Don't collect prices. Collect multipliers.** What matters to an owner isn't "£78 a month," it's
**"how much more than I pay now."**

**So express every rung as a multiple of their current spend**, keyed off processing method — which
the app already detects:

| Rung | Typical multiple of kibble |
|---|---|
| Better kibble | **1×** |
| Kibble + toppers | 1.05–1.2× |
| 25% fresh swap | ~1.5× |
| Air-dried / baked | 2–3× |
| Freeze-dried / gently cooked | 4–6× |
| Raw | 3–5× |

**No scraping, no per-brand prices, no maintenance, nothing to go stale.** Multipliers by format
are stable; individual prices are not. ⚠️ **These figures need sourcing before they ship** — they're
a starting estimate, not researched numbers.

### 📊 Show it as charts, not paragraphs

**Decided 2026-08-14. Mockup: `pawgrade-charts.html`.**

**Numbers become pictures at the top; the evidence writing moves one tap down. Nothing is removed.**

- **Score** — big, immediate
- **The ladder** — current rung marked, next rung outlined in green with its cost
- **Omega 6:3** — a coloured band with a marker, not a sentence. Shows position, target and worst
  case simultaneously
- **Calorie split** — one stacked bar, protein / fat / carbs
- **AAFCO comparison** — bars with the minimum drawn as a line; borderline reads instantly
- **Flagged ingredients** — points deducted, plus the **evidence tier chip** (`STUDY` · `MECH` ·
  `SIGNAL`) beside each. **That's the audit made visible, and it costs no space.**

**No charting library.** Every element is a `View` with a width percentage — bands are flexed
Views, markers are absolutely positioned, the ladder is rows. **No dependency, no bundle cost,
nothing to break in an Expo build.** All colours via `lib/theme.ts`; zero raw hex.

**⚠️ Build AFTER v1.8 ships.** There are already ~2,300 lines in the app that have never been
rendered. Adding charts on top means debugging two untested things at once.

### 🔁 Onboarding, email capture and retention

**Kyle's model (2026-08-14):** enter the dog → confirm by email → scan → get a personalised result.
**Right instinct, wrong order.**

**⚠️ Never gate the scanner.** Install → immediately asked for an email and a dog profile is the
classic conversion killer. **Most people bail before seeing anything work.**

**Value first, then capture:**

1. **Scan immediately. No account, no email, no profile.** They get a real score in ten seconds.
2. **Then offer the upgrade:** *"Want this scored for YOUR dog — breed, age, weight, conditions?"*
3. **Profile + email is now an exchange for something they've already seen the value of.**

**The profile isn't an email-harvesting device — it's what powers personalisation.** Breed rules,
life stage, weight-based dosing, the ladder's starting rung. `app/dog-profile.tsx` already exists.

#### 💰 Free vs paid, and who actually pays

> **FREE — everything that builds trust:** scan food, treats and supplements · score · flags ·
> the ladder · recall alerts.
> **PAID (~$10/mo) — an assistant that remembers your dog** and answers questions about *them*.

**⚠️ Don't paywall treats or supplements.** They're the acquisition engine — more things to scan
means more reasons to open the app, and users are what the subscription needs. Charging for them
caps the funnel at the top.

**Why memory is the right thing to sell:** a general AI can't see the bag, doesn't know the dog,
remembers nothing, and hasn't been fact-checked. **It compounds** — month six it knows what's been
tried, what worked, and which rung they're on. That's honest retention, not a streak.

**Most of it already exists:** `app/dog-profile.tsx` + scan logging in `lib/supabase.js` +
`/api/coach` (already reads the profile server-side from the auth token) + 63 Pinecone packs.
**Connecting four things, not building from nothing.** Show the user what it remembers — visible
memory is trusted and correctable; silent memory isn't.

**⚠️ The apparent contradiction, and its resolution.** Kyle: *"the ones with money are the ones who
pay, not broke people."* True as stated — **but the sharper predictor is URGENCY, not income.**

**People spend money they don't have on a sick dog.** The owner whose dog has been itching for six
months and who's spent $400 at the vet with no answer will pay $10 without hesitating. The
comfortable owner with a healthy dog often won't bother.

**So the two tiers serve two different people, and there's no conflict:**

| | Who | What they get |
|---|---|---|
| **Free** | The budget kibble buyer | The mission — a better bag, the ladder, honest scoring |
| **Paid** | The worried owner with a problem | The memory, the personalised answers |

**Marketing implication:** aim the paid tier at the *problem*, never at affluence. **"Your dog is
itchy and nobody can tell you why"** converts. "Premium features" does not.

**At $10/mo the target is ~350 subscribers to replace gig income** — roughly the price of one bag
of treats a month.

#### The retention problem, and the four things that fix it

**Ranked by strength:**

**1. 🪜 The ladder is a progression loop — this is the strongest one and it's already designed.**
You're on rung 0. Rung 1 costs nothing. **They do it, and they come back to see rung 2.** That's a
reason to return that has nothing to do with notifications or streaks — it's just an unfinished
staircase. **No other dog app has one.**

**2. 📬 Recall alerts — the best reason anyone will ever give you their email.**
Not "join our newsletter." **"We'll email you if the food you scanned gets recalled."** FDA recall
data is public and free. **Concrete, genuinely valuable, and it justifies both the email and the
scan history.** Cheap to build, and nobody unsubscribes from it.

**3. 🍖 More categories to scan.** Food is bought monthly; treats and supplements far more often.
**Frequency comes from scope** — that's the v1.9/v2.0 expansion doing double duty.

**4. 💬 The AI chat.** Questions arise constantly, and the scan gives it context nothing else has.
Later, and it's the paid tier.

**What does NOT retain:** telling someone their food is bad and offering no path. **That's the app
today, and it's the churn scenario** — scan once, feel bad, delete.

### 🎯 The customer: the kibble buyer

**Decided 2026-08-14.** Not the raw feeder — they need the scanner least and buy nothing.

- **Holistic voices say "stop feeding kibble"** — useless to someone who can't, and it reads as judgement
- **Vets say "any AAFCO food is adequate"** — true, and it stops there
- **Nobody says "here's which kibble, and here's what to add"**

**That gap is the whole opportunity.** It's also where the revenue is: **a kibble-fed dog needs the
supplements the affiliate cards sell; a raw-fed dog doesn't.** The customer we're best placed to
help is the one who funds the app.

**⚠️ Don't attack the vet.** "Your vet is wrong" loses — owners trust their vet over an app.
**"Your vet is right that it's adequate. Adequate is a floor, not a goal."** Unarguable, and it
asks nobody to pick a side.

### It defines a different job from a holistic vet's, not a weaker one

A vet advises people who have already decided to change and can usually afford to. **PawGrade is
for someone in a supermarket aisle with $40.** That isn't a diluted version of the same work —
it's a different room, and it needs different arithmetic.

---

## ⚖️ Where PawGrade sits on contested claims

**Checked against primary sources 2026-08-13.** Record this so it doesn't get re-litigated.

**DCM and legumes — the app is NOT where either camp is.** Dr. Judy Morgan is openly sceptical of
the grain-free link, calling the mechanism *"all speculation"* and the episode *"a huge hoax"*
([source](https://drjudymorgan.com/blogs/blog/dilated-cardiomyopathy-and-grain-free-diets-the-saga-continues),
Feb 2024). The conventional camp treats grain-free itself as the risk.

**`app/index.tsx:3987-3991` does neither.** It requires grain-free **AND** either legumes/potato in
the top five ingredients, or three-plus legume fractions (the ingredient-splitting trick):

```js
const legumeOrPotatoTop5 = top5.some((i) => isLegume(i) || isPotato(i));
const fractionated = fractionCount >= 3;
const triggered = grainFree && (legumeOrPotatoTop5 || fractionated);
```

**So grain-free alone never triggers it — high legume inclusion does.** That's the dose-shaped
version of the claim, and it's materially different from the one Morgan calls a hoax. **Don't
"fix" this to match either side without reading the underlying studies first** (see `docs/TODO.md`).

**Menadione — no conflict.** Morgan's own word is *"controversial."* The app says harm hasn't been
shown. Those are the same level of hedge.

**Kibble — less distance than assumed.** Her *Kick the Kibble* course teaches *"easy ways to add
whole food toppers to enhance any cat's diet"* — improvement, not purity. Same model.

---

## The distribution insight everything else follows from

**Trust and distribution are the same problem.**

Kyle isn't a vet and has no credential. Dr. Judy, Dr. Becker and Dr. Jones all have DVMs — that's
why people listen to them. No amount of good work substitutes for that.

**But there is a different basis for trust available, and it's already built:** the app cites ~30
studies, labels evidence tiers in the text, and *publicly contradicts its own side* — the
carbohydrate-lipoma link is marked NOT PROVEN, menadione says "we don't claim harm has been shown,
because it hasn't." **Almost nobody in pet nutrition does that.** Conventional and holistic are
both confident-assertion cultures.

**That rigour is the trust asset. It just needs to be seen.** Which makes the question not "how do
I look credible" but **"how do I get seen demonstrating rigour, repeatedly."**

---

## 🎯 THE PLAY: scan real foods, publish every result

**Kyle scans the best-selling dog foods himself and publishes each analysis as a page on
commonsensedog.com.**

This is the highest-leverage thing available, because one activity does five jobs:

| | |
|---|---|
| **SEO** | *"is [brand] good for dogs"* is searched constantly, with clear intent and no ambiguity |
| **Trust** | Shows the rigour instead of claiming it |
| **Proof** | Demonstrates the app produces something real |
| **Funnel** | Every page ends in "scan your own bag" |
| **Video** | Same scan becomes a TikTok with no extra work |

**And content production is nearly free** — the app generates the analysis. Kyle is publishing
output, not writing articles. That's what makes 30 pages achievable for one person doing gig work.

### ⚠️ The rule that makes it credible: some foods must score well

**If every food fails, it reads as an axe to grind and the whole thing gets dismissed.**

Scoring some foods highly is what makes the low scores believable. **Publish the good ones with the
same enthusiasm as the bad ones** — including brands with no affiliate relationship. A page that
says *"this is genuinely good and I don't earn anything from it"* is worth more trust than ten
takedowns.

### What to scan, roughly in search-volume order

**Mass market** (highest volume, mostly low scores — the "why is this everywhere" pages):
Purina Pro Plan · Pedigree · Iams · Beneful · Kibbles 'n Bits · Alpo

**Premium kibble** (highest search intent — people actively deciding):
Blue Buffalo · Hill's Science Diet · Royal Canin · Taste of the Wild · Wellness · Merrick ·
Nutro · Kirkland Signature (huge volume, Costco)

**Boutique / grain-free** (the DCM angle — genuinely useful and under-covered):
Orijen · Acana · Zignature · Fromm · Canidae

**Fresh / subscription** (rising search, and where good scores will land):
The Farmer's Dog · Ollie · Nom Nom · Spot & Tango · JustFoodForDogs

**Fresh / raw** (where Kyle's own choices sit — be explicit about the conflict):
AllProvide · Simple Food Project · Primal · Stella & Chewy's · Instinct

**Target: 25–30 pages.** That's enough to start ranking and enough to look like a body of work
rather than a few posts.

### Page structure — reuse the proven pattern

`app/answers/[slug]/page.tsx` already exists and works. Each page needs:

- **Slug:** `is-purina-pro-plan-good-for-dogs` — match the actual search query
- **The score, stated immediately.** Don't bury it.
- **The breakdown**, exactly as the app produces it
- **Flagged ingredients with the evidence** — this is the differentiator; nobody else cites
- **What's actually good about it** — every food has something
- **"How to improve this bowl"** — the three additions
- **Affiliate disclosure**, plainly, on every page
- **CTA:** scan your own → App Store

**The sitemap picks these up automatically** (`app/sitemap.ts` reads `getAnswerSlugs()`), so
there's no sitemap maintenance.

### The TikTok version, free

**Same scans, filmed.** *"I scanned the 10 best-selling dog foods at Petco. Eight failed."*

That's a reveal, not a lecture — and the scanner is inherently visual. **The informational framing
got minimal traction; the confrontational one is the format that works on that platform.**

---

## Order of operations

**1. Ship v1.8 first — as one release** *(see `docs/APP_STORE_LISTING.md`)*
Logo · test the four-door declutter · the `(tabs)` bug, disclaimer gate and `SUPPLEMENT_RECS[2]` ·
then name, subtitle, keywords, description, screenshots.
**⚠️ The metadata can't ship on its own** — those fields lock when a version goes live, and a new
version needs a build attached. They ride along with the release or they don't go out.
**No point driving traffic to a broken listing either way.**

**2. Then scan and publish**, 3–5 pages a week. Mix good scores with bad ones from the start.

**3. Request indexing in Search Console** after each batch.

**4. Post the scans to TikTok** as you make them. Zero extra production cost.

**5. Only then approach the experts** — see below.

---

## 🧭 The product model: Yuka, for dogs

**Yuka is the template, and it's a proven one** — scan a barcode, get 0–100, get told why, get
shown something better. Tens of millions of users, free with a paid tier.

**Three things make it work, and PawGrade already has all three:**

| Yuka | PawGrade |
|---|---|
| One gesture — point the camera | Scan the bag |
| One number, immediately | 0–100, stated first |
| One action — a better alternative | "How to improve this bowl" |

**The part worth copying deliberately is how Yuka grew: same gesture, new category.** It started
with food and added cosmetics. Nothing about the interaction changed — the scan just started
meaning more.

**PawGrade's version of that move is food → treats → supplements.** Every one of them is a bag or
a bottle with an ingredient panel, and a dog owner buys all three.

### Roadmap

**v1.8 — the current release.** Logo · the four-door declutter (built, untested) · the `(tabs)`
route, disclaimer gate and `SUPPLEMENT_RECS[2]` bugs · the new name, subtitle and keywords from
`docs/APP_STORE_LISTING.md`. **Metadata is locked once a version is live, so all of this ships
together — the App Store fields can't go out on their own.**

**v1.9 — treats, and the same-tier alternative.**

*Treats:* `TREAT_HARMFUL` and `TREAT_OK_INGREDIENTS` already exist in `app/index.tsx`, dormant.
**This is reviving code, not writing it** — the cheapest expansion available. Treats are also
bought far more often than food, so it raises scans per user.

*The same-tier alternative — the feature the product principle demands.* **Right now the app
grades but doesn't upgrade.** Someone scans, gets 38, reads why, and is never told what to buy
instead. The card:

> **You're feeding this — 38.**
> **For about the same money, this one scores 61.**

**This is the mechanism, not the score.** Yuka's score gets attention; the *alternative* is what
changes what lands in the trolley.

- **No price data needed.** A tier label per product — grocery / mid / premium — is enough. The
  rule is simply *best in the same tier*.
- **⚠️ One discipline, non-negotiable:** the alternative must be the genuinely best option in that
  tier, **including brands earning us nothing.** Same rule already committed to for the published
  scans. Break it and the feature is an ad, and people can smell an ad.
- It also gives every *"is [brand] good for dogs"* page its closing line: **"if switching to fresh
  isn't realistic, here's the better bag at the same price."**

**v2.0 — supplements.** This is where PawGrade beats Yuka rather than imitating it, because the
quality axis is real, printed on the label, and invisible to buyers:

- **Mushrooms** — most dog products are **mycelium grown on grain**, which is largely starch, not
  fruiting body. Beta-glucan vs alpha-glucan is a genuine difference, and it's declarable.
- **Probiotics** — CFU *at manufacture* vs *at expiry*; dog-specific strains vs strains borrowed
  from human formulas.
- **Fish oil** — "1,000 mg fish oil" is not 1,000 mg EPA+DHA, and the actual number is often
  a third of that. Also form (TG vs EE) and rancidity.

**Nobody surfaces these, they're checkable from the panel, and they point at products already in
the supplement cards** — so the feature and the revenue line up.

**v2.1 — expert AI chat.** The paid tier. See below.

---

## 🤝 The expert-AI platform — conclusion, and why it waits

**The idea is sound and the business is probably better than PawGrade** — B2B recurring revenue
beats consumer downloads. But:

**The market is crowded.** Delphi.ai ($99–349/mo, ingests YouTube and podcasts, deploys to web and
SMS, named authors as clients), Coachvox, BuddyPro, Agent37, Personify. One comparison piece calls
it "dozens of platforms." **It's invisible to Kyle because it's B2B and white-labelled — which is
itself a signal that he isn't in that market's information flow.**

**It's a sales business, not a product business.** Finding creators, reaching them, convincing them,
onboarding them. **Two cold emails went unanswered. That's the job description, not a stumble.**

**And asking a vet to put their name on your software requires vastly more trust than asking a
stranger to download a free app.** The ladder is: free app → audience → visible credibility →
expert partnerships. Emailing Dr. Judy now is starting at the top rung.

### 🔄 The pivot: don't sell the platform — host the expert inside PawGrade

**Decided 2026-08-13. This replaces the white-label play as the primary direction.**

Instead of selling software to Dr. Judy Morgan (or Becker, or Jones), **offer her a room inside
PawGrade**: her AI, trained on her published work, answering questions for PawGrade users.
Subscription revenue, split.

**Why this ask is far easier than the one it replaces:**

| Selling a white-label platform | Hosting the expert in PawGrade |
|---|---|
| She buys software and owns the risk | She gets distribution and a revenue share |
| She has to market it to her own audience | Kyle brings the audience |
| Kyle is a vendor competing with Delphi | Kyle is a partner offering reach |
| Needs her to say yes to a bill | Needs her to say yes to income |

**And it fixes PawGrade's own gap.** The app currently has nothing to charge for. A named vet's
AI chat is a subscription tier people would actually pay for — **and it borrows the credential
Kyle doesn't have**, which is the real constraint (see the top of this file).

**It's also the same build either way.** The expert-AI product doesn't change; only who it's
aimed at. The backend — Pinecone RAG, `/api/coach` — already exists.

**The prerequisite hasn't changed: users.** No vet attaches their name to an app with no
downloads. **So this still comes after the scan-and-publish work** — but the *first contact*
doesn't have to wait, and shouldn't be a pitch (see tactics below).

### The other angles, if the partnership route stalls

**Not "Delphi but cheaper" — price isn't why creators aren't buying, obscurity is.**

**Two real angles instead:**

- **Serve who Delphi ignores.** At $349/mo they chase people with real audiences. Thousands of
  creators at 5–30k followers can't justify that and get pitched by nobody. **$29–49/mo for
  micro-creators is an uncontested segment** where being small is an advantage.
- **Own the vertical.** *AI assistants for pet and animal health experts, with veterinary evidence
  built in.* Delphi will never bother. Kyle has the domain knowledge and a cited knowledge base.

### Tactics for when he does reach out

- **`kyle@commonsensedog.com`**, not Gmail. He owns the domain.
- **Build first, pitch never.** Take their public content, build a working demo, send the link:
  *"I built this from your published material. Delete it if you want."* One weekend, and it
  converts at a completely different rate than a description.
- **Go SMALLER, not bigger.** After Judy didn't reply, the instinct is to aim at Hormozi or PBD.
  Wrong direction — they're less accessible, not more. **The first customer should be someone who
  needs you more than you need them.** 10–30k followers, will actually reply, becomes the case
  study.
- **A partner is the right instinct — but for DISTRIBUTION, not code.** Kyle can build it. The gap
  is reach. And nobody partners on a prototype: **you need one live deployment first.**

---

## What this all rests on

**One live example unblocks everything** — the case study, the pricing proof, the partner
conversation, and eventually the call to Dr. Judy.

**And PawGrade is that example.** It isn't competing with the expert platform for attention —
**it's the on-ramp.** Judy ignored a cold email from a stranger with a Gmail address. She would not
ignore *"the guy who built the dog food scanner my audience uses."*

Related: `docs/TODO.md` · `docs/APP_STORE_LISTING.md` · `twinkly-churning-crystal.md` (the existing
SEO plan — Phases A & B convert the `qa-*.json` packs into indexed pages, still unstarted)

---

## 🥣 The core thesis — see `docs/BLUEPRINT_THE_BOWL.md`

**Three constraints at once: completeness · TCVM energetics · not oversupplementing.** Conventional
tools do the first only. Holistic advice does the second only. Almost nobody sums the stack for the
third. **PawGrade is the intersection** — and where two constraints disagree, that conflict is the
feature, not a bug to hide.

**Every feature spec follows the 7-part format in that document.**
