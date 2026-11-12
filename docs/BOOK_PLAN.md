# 📕 The Book — plan

*Written 2026-11-12. Model: Jethro Kloss, Back to Eden (1939) — but for dogs, and with the
one thing that book is fairly criticised for fixed.*

---

## The thesis, in one sentence

**A home-remedy reference for dog owners that tells you what the evidence actually is** —
the practical, kitchen-first holistic guidance of Back to Eden, with every claim carrying an
honest tier instead of blanket confidence.

## Why Back to Eden is the right model

Kloss self-published in 1939 and it has stayed in print for eighty-odd years. Worth being
precise about *why*, because those are the properties to copy:

- **It's a reference, not a narrative.** People keep it on a shelf and come back to it for
  decades. Reference books have a long tail; story books have a launch and a decline.
- **It's modular.** He didn't write a 400-page argument, he wrote hundreds of short entries.
  That's a book you can write in pieces, on a gig-work schedule, without holding the whole
  thing in your head.
- **It sold on word of mouth,** not a publisher's marketing budget. Which is the only
  distribution a self-published first-time author ever has.
- **It had a voice.** Conviction, a point of view, a named person behind it.

**And the fair criticism of it is the opening.** Back to Eden asserts. It does not distinguish
"this is a controlled trial" from "this worked for a woman I knew in 1922", and that is exactly
why the mainstream dismisses the whole genre. A book in that tradition that labels its own
confidence — 🟢 strong · 🟡 moderate · 🟠 emerging/mechanistic · ⚪ anecdotal — is a genuinely
new object. Nobody in holistic pet health has written it.

That tier scale already exists in the knowledge base and already runs through the Q&A packs.
It is the product, not a formatting choice.

## Who buys it

The same person the app is for: an owner who has decided the bag of kibble isn't good enough
and doesn't know what to do next. Not a vet, not a breeder. Slightly anxious, already spending
money on supplements, currently getting advice from Facebook groups and YouTube.

Secondary and real: **people who buy gifts for that person.** A physical reference is a gift;
an app is not.

## What you are starting from

Measured 2026-11-12 from the repo:

| | |
|---|---|
| Library topics | 46 (26,169 words) |
| Q&A pairs | 999 (105,973 words) |
| **Total prose already written** | **132,142 words** |
| Illustrated guide plates | 12 |
| Scored foods | 95 |

A typical nonfiction book is 60,000–80,000 words. **You have roughly 1.9 books of material
already drafted.** This is not a writing project from zero. It is an editing and structuring
project with some gap-filling.

That is the single most important fact in this plan and it should change how daunting this
feels.

## Structure

Follow the existing shape rather than inventing one — it's already organised the way a reader
needs:

**Part I — The bowl**
Nutrition (12 topics). What's in commercial food, how to read a label, processing methods,
mineral forms, the salt divider, omega ratios, polyphenols.

**Part II — By what's wrong**
Conditions (16 topics), organised the way `/remedies` already is: Tummy · Skin & Coat · Joints ·
Calm · Teeth · Immunity. Kitchen fix first, then why, then when it isn't enough.

**Part III — The pantry**
Supplements (8 topics) by what they help, not by what they are. Every entry with a dose, a
form, a timing, and a "when NOT to."

**Part IV — Prevention**
Parasite prevention (4), safety (3). The seasonal, practical half.

**Part V — Reference**
The A–Z, the toxic/safe food chart, emergency numbers, the 10% rule. The part people
photograph and stick on the fridge.

**Throughout:** the 12 illustrated plates, and Hershey as the running thread. Kloss had
himself; you have an 8-year-old Lab with lipomas who is the reason any of this exists.

## The honest gap

What is genuinely missing, not what needs reformatting:

1. **A through-line.** 999 Q&A pairs is a database, not a book. It needs a voice connecting
   the entries — the thing a reader follows from page to page.
2. **An opening chapter.** Why you, why this, Hershey. Kloss had a conversion story; yours is
   six years of kibble and a dog with lipomas.
3. **Consistency pass.** The pairs were generated in batches over a year. Tone will drift.
4. **Every claim re-checked against its tier.** This is the differentiator; it cannot be
   approximate. `docs/EVIDENCE_AUDIT.md` is the existing machinery for it.
5. **Illustration for Part V.** The fridge chart already exists as a template.

## Production

**Self-publish. Do not query agents.** A first book from an unknown author in a niche
category, where you already own the audience channel, is the exact case where self-publishing
wins — and you keep the rights to the kids' edition and any later version.

- **Amazon KDP** for ebook and paperback. Free to publish.
- **IngramSpark** later if you want bookshops and libraries to be able to order it.
- Cover: pay a designer. It is the single highest-leverage spend and the one thing that cannot
  be done adequately in-house.

## Economics

Verified from KDP's royalty page, 2026-11-12:

- **eBook: 70% royalty** on a list price between **$2.99 and $12.99** (that ceiling rose from
  $9.99 on 2026-07-07). Below $2.99 or above $12.99 drops you to 35%. A delivery cost is
  deducted from the 70% option; Amazon doesn't publish the amount on that page.
- **Paperback: 60% of list, minus printing cost**, which depends on page count and trim size.
  Run the real numbers in KDP's Printing Cost & Royalty Calculator before setting a price —
  a 300-page book's print cost is not trivial.

**Rough shape at $9.99 ebook:** roughly $6.50–7 per sale. 1,000 copies in year one is about
$6,500–7,000. That is not a salary. **It is a credibility asset that also pays** — and it
compounds, because a reference book sells for years and an app install does not.

Price the paperback higher than feels comfortable. A reference people keep is not competing
with a $2.99 novel.

## The flywheel — why this isn't a side quest

This is the part that makes the book worth the hours:

- **Book → site.** Every chapter is a page that already exists or should. Writing the book
  fills the knowledge gaps (`docs/KNOWLEDGE_GAPS.md`) as a side effect.
- **Site → book.** 217 indexed pages drive search traffic; each one can carry the book.
- **Book → app.** "Scan your dog's food" in the back of a book someone paid for converts far
  better than an App Store listing.
- **Book → authority.** "Author of —" is the credential you don't have and can't buy. It is
  also what makes the expert-partnership plan in `docs/GROWTH_PLAN.md` a real conversation.
- **Book → Pinecone.** Every chapter written becomes Q&A pairs, which makes the assistant
  better, which makes the app worth subscribing to.

Nothing else on the roadmap feeds four other things at once.

## Timeline

Deliberately slow, because the current failure mode is starting things rather than finishing
them.

- **Months 1–2 — structure.** Table of contents, the opening chapter, one finished Part as a
  sample. Nothing else. If Part I can't be finished, the book can't be.
- **Months 3–6 — the draft.** One topic per writing session, in the existing order. The
  material exists; this is editing with connective tissue.
- **Month 7 — the tier audit.** Every claim against its evidence. The differentiator.
- **Month 8 — edit + cover + layout.**
- **Month 9 — publish.** Ebook and paperback together.

**One section a week is a book in a year.** That is the same cadence as the knowledge-gap list
and it is the only pace that has worked so far.

## The kids' edition

Right instinct, wrong order — do it **second**, and here's why that's not a brush-off:

- It's a different skill. A children's book lives or dies on illustration, which means paying
  an illustrator properly, which means having revenue first.
- It's a **gift purchase** — better margin, impulse buy, seasonal. A genuinely good second
  product.
- The adult book validates the material and funds the illustration.
- And the angle is already there: a kid who knows which foods are dangerous for the family dog
  is doing something real. "What can I share with my dog?" is a question children actually ask,
  and the toxic/safe chart is already written.

## What could go wrong

- **It never gets finished.** The main risk, by a distance. Mitigation is the one-section-a-week
  cadence and shipping Part I as a standalone before committing to the rest.
- **The tier discipline slips under deadline.** If it does, the book becomes another holistic
  dog book and the whole thesis is gone.
- **Writing it stalls everything else.** It shouldn't — the chapters are the site's content —
  but only if each chapter gets published to the site as it's written, not held back for the
  launch.
