# 📧 Expert outreach — the pitch template

**The email that asks an expert for permission to build their AI.** Written 2026-08-29,
first sent to Dr. Judy Morgan.

The product being pitched is `expert-platform/` — a RAG assistant trained on one expert's
own material, answering in their voice, citing the source, and refusing when the answer
isn't in their catalogue. **The permission is the thing being asked for. That permission is
also the moat** — anyone can build retrieval; nobody else can get their signature.

---

## ⚠️ Before you send anything

1. **Restore the demo.** The expert-platform Supabase project sits paused (free tier allows
   2 active projects; the app and the website hold both slots). Both demo URLs 404 while
   it's asleep. Restore it the morning you send, and **load both pages yourself** before
   hitting send.
2. **Send from `kyle@commonsensedog.com`**, not Gmail. SPF, DKIM and DMARC are all already
   configured on the domain — that's what keeps it out of spam.
3. **Never put the demo URL in the email.** Say it exists, show it on the call. A dead link
   sinks the pitch before anyone's spoken to you.
4. **Find a real business contact.** Never guess `firstname@` — bounces from a young domain
   damage the sending reputation you need for everyone after this.
5. **Send a handful at a time.** Volume from a new address gets flagged.

---

## The template

Everything in `[SQUARE BRACKETS]` must be rewritten per person. If you send it with the
brackets filled by something generic, don't send it.

```
Subject: Partnership proposal for [NAME] — AI trained only on their work

[IF WRITING VIA A GATEKEEPER, ADD:]
Hi [GATEKEEPER] — I found your address listed for business
inquiries. This is a partnership proposal for [NAME]; if
you're not the right person, I'd be grateful if you could
point me to whoever is.

---

Hi [NAME],

I've followed your work for a while — [ONE REAL SPECIFIC.
See "the opener" below. This is the only line that can't
be templated.]. I'm also the founder of PawGrade: Dog Food
Scanner, currently on the App Store.

The problem I keep running into is that there's so much
content to consume and it takes years to learn. Your
audience asks you the same questions constantly, and most
of the answers already exist somewhere in your archive —
they just can't find them. My goal is to solve that
overwhelm.

I build AI assistants licensed strictly to one expert's own
content. So when somebody asks "[A REAL QUESTION THEIR
AUDIENCE ACTUALLY ASKS, IN THEIR DOMAIN]", the answer is
sourced only from your videos, books and podcasts. It
answers in your voice, cites which video or article each
answer came from, and points to the specific products you
actually recommend.

And when someone asks about something you've never covered,
it says so and stops rather than inventing an answer. That's
the whole point. The risk with AI in health isn't that it's
unhelpful — it's that it confidently says things you'd never
say, with your name on it. This one structurally can't. If
it isn't in your material, it doesn't have an answer.

I built a private demo using your publicly published
articles so you could see it working rather than take my
word for it. I haven't shared it with anyone and I won't.
Anything beyond that — your full catalog, your videos, your
books — would need your written permission, and that
permission is exactly what I'm writing to ask about.

Would you be open to a 20-minute call? I'll show you the
demo and you can decide from there.

Kyle Cabral
Founder, PawGrade
kyle@commonsensedog.com
```

---

## The opener — the only line that matters

Everything else is the same email every time. **This line is why they reply.**

**If you're genuinely in their audience** (Dr. Judy, Dr. Andrew, any pet-health creator):
name what you actually do because of them. *"I feed AllProvide, use TCVM principles, and
keep my 8-year-old Lab on natural flea and tick prevention."* That's not flattery, it's
proof you're a customer rather than a vendor, and it's unfakeable.

**If you're not in their audience** (human-health creators, a different vertical): don't
pretend. Name one specific thing you learned from a specific piece of their work, and be
honest that you came to them through the idea rather than the other way round. A real
sentence about one video beats a fake sentence about being a longtime fan — they can tell,
and getting caught faking it ends the conversation permanently.

**Never write:** *"I love your content"* · *"I'm a huge fan"* · *"your work is amazing."*
Those are what everyone selling them something writes.

---

## Why the email is shaped this way

**The safety paragraph is the centrepiece, not a feature.** An expert's real fear is an AI
with their name on it saying something they don't believe. Naming that fear out loud and
showing it's structurally impossible is the most persuasive thing in the email. Lead the
back half with it.

**"AI is powerful" is deleted on sight.** They get five of those a week. Never open with
what AI can do — open with what *their audience* can't do.

**Don't explain their market to them.** An early draft had a paragraph about people turning
to independent voices for health information. That's their entire career. Telling them
reads as filler.

**The demo line does the heavy lifting.** *"I built it from your public articles, I haven't
shared it, and I'm asking permission for anything more."* That's respectful rather than
presumptuous, and it proves you ship instead of pitch.

**Ask for 20 minutes, not "a chat".** A specific small number is easy to say yes to.

---

## Finding the right contact

In order of what actually works:

1. **A published business/partnership address.** Dr. Judy's site lists `krista@` for
   business inquiries — that's a named person whose job includes evaluating proposals.
   Put them in TO and the general inbox in CC. Two people in TO means neither owns it.
2. **Phone, for small businesses.** Where there's only a support desk (Dr. Andrew:
   `support@drjonesnaturalpet.com`, 1-800-396-1534, 7 days, 8:30–5 Pacific), call and ask
   who handles partnerships. Three minutes gets you a name. Then email *that* person and
   open with "[Name] suggested I send this to you" — a referred email gets read.
3. **YouTube About page.** Creators often list a business email behind the "view email
   address" button specifically for this.
4. **Instagram DM**, as a nudge about a week later. Short, referencing the email, not
   repeating it. Standing note from PetChat outreach: *find the owner, DM beats info@.*

**Never** `info@` alone for a business proposal. That queue is order questions and refunds.

---

## Who's been contacted

| Date | Person | Sent to | Channel | Result |
|---|---|---|---|---|
| 2026-08-29 | Dr. Judy Morgan | krista@ (TO), info@ (CC) | Email | — |
| | Dr. Andrew Jones | *call 1-800-396-1534 first* | — | — |

Keep this filled in. It's how you learn which opener works, and it stops you emailing
someone twice.

---

## After a yes

The technical work is smaller than it looks — `scripts/ingest.ts` already handles URLs,
sitemaps, PDFs and YouTube transcripts. What's missing:

- **EPUB** for books (an EPUB is a zip of XHTML; the parser in `book-ai.html` lifts across)
- **Voyage billing** — still on the free tier at 3 requests/min, so a full-catalog ingest
  would crawl. Fix the org before promising anyone a timeline.
- **Timestamp-anchored citations** for video, so an answer deep-links to the moment. That's
  the feature that makes it feel like NotebookLM rather than a chatbot.
- **Date-weighting.** A ten-year archive contains positions the expert has since abandoned.
  Store the upload date, weight recent material higher, and show the date in the citation.
  Raise this on the call before they do — it's the objection they'll have, and having an
  answer ready is worth more than avoiding the topic.

Related: `expert-platform/CLAUDE.md` · `expert-platform/ONBOARDING.md`
