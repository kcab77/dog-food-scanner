# Base44 prompt — professional look, two sides (Learn / What I Use)

Copy everything between the lines.

---

Redesign a dog-nutrition website called **Common Sense Dog** (commonsensedog.com) so it
looks genuinely professional, and restructure it around **two clearly separated halves
that feed each other**:

**1. LEARN — the educational side.** A health A–Z of 44 researched topics, ~53 answer
pages, and a database of 95 dog foods scored 0–100 on ingredient quality. This side sells
nothing. It is the reason anyone trusts the other half.

**2. WHAT I USE — the affiliate side.** Curated product recommendations, organised by what
problem they solve. This side is honest and narrow, not a storefront.

### The rule that connects them — this is the core of the design
**Every product links back to the article that justifies it, and every article links
forward to the product it argues for.** A reader can always click from "buy this" to "here
is why," and back. Never a product without a reason attached; never a recommendation that
appears on a page whose content doesn't argue for it.

That round-trip is the whole credibility mechanic. Design it explicitly:
- On a product card: a visible "Why I recommend this →" link to the relevant topic.
- On a topic page: a "What I actually use for this" block near the end, with 1–2 products
  maximum, never more.

### What "professional" means here, concretely
- **Restraint.** One accent colour doing real work, lots of calm space, no decorative
  gradients or drop shadows on everything.
- **A real type scale.** Pick five sizes and never deviate. Serif for headings (this is a
  field guide, not a SaaS product), clean sans for body, monospace for every number and
  score with `font-variant-numeric: tabular-nums`.
- **Consistent spacing from a defined scale.** The single biggest thing that separates
  professional from amateur is that the gaps are all from the same set of values.
- **Every card has a real surface colour**, a consistent corner radius, and consistent
  internal padding. No transparent cards with floating borders.
- **A clear visual distinction between the two sides** without making them feel like
  different websites: same type, same spacing, same components. Differentiate with
  surface and accent — e.g. the educational side on the pale ground, the affiliate side on
  a subtly tinted surface with the amber signal colour on its calls-to-action.

### Palette — use these exact values
Define as CSS custom properties on `:root`, and redefine ONLY the values inside both
`@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`.

LIGHT: --leaf #2F7D3C · --leaf-deep #215C2C · --leaf-bright #43A354 · --leaf-wash #EDF6EF
--amber #D98A1F · --amber-wash #FDF4E4 · --paper #FBFAF8 · --paper-2 #F4F2ED
--surface #FFFFFF · --border #E6E3DC · --text #1A1D1A · --text-muted #5E625C
--score-excellent #1E7A35 · --score-good #58963F · --score-fair #C68A1E
--score-below #C2661F · --score-low #A93226

DARK: --leaf #6FCB80 · --leaf-deep #9ADFA6 · --leaf-bright #5BB86C · --leaf-wash #16261A
--amber #E8AC4C · --amber-wash #241C0E · --paper #0F1210 · --paper-2 #161A16
--surface #191D19 · --border #2C312C · --text #ECEFE9 · --text-muted #A3A89F

**Amber is a signal colour.** It appears only on calls-to-action and things that are live
or worth acting on. Never as decoration. Green is the brand and carries the educational
side.

### Navigation
Top-level nav makes the two sides obvious and equal:
`Learn` · `Foods` · `What I Use` · `Ask` · `Get the app`
Not a hamburger on desktop. The two halves should be legible in the first three seconds.

### Pages
**Learn side**
- Health A–Z index: 44 topics, searchable, grouped by tag.
- Topic page: hero with emoji / tag pill / title / summary, then the article with proper
  hierarchy — headings, tables, callout blockquotes for warnings. End with the "What I
  actually use" block, then a **numbered path of 3 next topics** (an ordered list with
  filled number circles and a sliding arrow, not a grid of equal cards).
- Food database index: filter by score band and by processing format.
- Food detail: the 0–100 score with its band label, the scoring breakdown line by line,
  flagged ingredients with severity and reason, and links to other foods from the brand.

**What I Use side**
- An index grouped by the problem solved — Gut & digestion · Joints & mobility · Skin &
  coat · Immune & recovery — not by product type.
- Each product card: a circular tinted badge, the product name, ONE honest sentence about
  what it does, a "how to use it" note on a tinted left-ruled strip, a visible
  "Why I recommend this →" link to the topic, and an amber pill button.
- A persistent, plainly-worded FTC affiliate disclosure on every page that carries a
  product. Outbound product links get `rel="nofollow sponsored noopener"`.
- No star ratings, no fake review counts, no "as seen in" logos, no countdown timers.
  Those read as cheap and destroy the trust the other half built.

### Tone
The voice is "I fed my dog kibble for six years, I'm not judging you." Never shame the
reader's current food. Lead with what's in it and what to do next, never with a verdict.
The affiliate copy is the same voice — quieter than marketing, specific about dose and
when NOT to use something.

### Hard requirements — do not compromise
- Full page text in the HTML, server-rendered. No content that only exists in JavaScript.
- Unique `<title>` and meta description per page.
- Works at 400px wide with a 16px gutter; never scrolls horizontally.
- Visible keyboard focus on everything interactive.
- Colour is never the only signal — pair with an icon or label.
- Footer legal line: educational only, not veterinary advice; blood in the stool,
  sustained weight loss, or a dog going off food needs a vet.

### Do NOT
- No purple-to-blue gradient hero, no Inter or Space Grotesk, no emoji as section markers,
  no `rounded-lg` on every element. Those are the generic AI-site defaults.
- Do not invent nutrition facts, doses, studies or statistics. Leave content slots empty —
  I will supply the real text.
- No cookie banner, no newsletter popup, no testimonials.

### Start here
Build **only two pages at full fidelity first**: one topic page from the Learn side, and
the "What I Use" index. Those two show whether the connection between the halves works.
Once I approve them, we do the rest.

---

⚠️ Use the result as a **design to port**, not a site to switch to. The live site carries
95 foods generated by a real scoring engine, 44 topics synced from an Obsidian vault, and
five rate-limited API routes. None of that comes with a regenerated front end.

Generated 2026-10-21.
