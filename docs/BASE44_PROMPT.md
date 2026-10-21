# Base44 / Lovable prompt — Common Sense Dog

⚠️ **Read the warning at the bottom before you paste this.** It changes how you should
use the output.

---

## THE PROMPT (copy everything between the lines)

---

Build a premium, editorial dog-nutrition reference site called **Common Sense Dog**
(commonsensedog.com). It is not a blog and not a store. It is a *field guide* — a
reference tool that scores things and explains mechanisms. Think Yuka crossed with a
well-made natural-history book.

### Who it is for
Everyday dog owners who already bought the bag and fed it this morning. They are not
vets. They are anxious, a little guilty, and they want to know what to DO. The voice is:
"I fed my dog kibble for six years, I'm not judging you." Never shame the bowl. Never
lead with a verdict; lead with what's in it and what to do next.

### Brand and visual direction
- The palette is deliberately **warm forest green on warm near-white** — not the
  white-and-blue every health site defaults to. Keep green as the brand.
- Use these exact tokens. Define them as CSS custom properties on `:root`, and redefine
  ONLY the values inside both `@media (prefers-color-scheme: dark)` and
  `:root[data-theme="dark"]`:

LIGHT:
--leaf #2F7D3C · --leaf-deep #215C2C · --leaf-bright #43A354
--leaf-wash #EDF6EF · --leaf-tint #F5FAF6
--amber #D98A1F · --amber-wash #FDF4E4
--paper #FBFAF8 · --paper-2 #F4F2ED · --surface #FFFFFF
--border #E6E3DC · --border-soft #F0EEE8
--text #1A1D1A · --text-muted #5E625C · --text-faint #8C8F88
--score-excellent #1E7A35 · --score-good #58963F · --score-fair #C68A1E
--score-below #C2661F · --score-low #A93226

DARK:
--leaf #6FCB80 · --leaf-deep #9ADFA6 · --leaf-bright #5BB86C
--leaf-wash #16261A · --leaf-tint #111C14
--amber #E8AC4C · --amber-wash #241C0E
--paper #0F1210 · --paper-2 #161A16 · --surface #191D19
--border #2C312C · --border-soft #232723
--text #ECEFE9 · --text-muted #A3A89F · --text-faint #757A72

- **Amber is a signal colour.** It appears only where something is live or worth acting
  on. Never as decoration.
- Typography: a serif for display/headings (Georgia or similar — this is a field guide,
  not a SaaS landing page) paired with a clean sans for body, and a mono for all numbers,
  scores and data. Numbers must use `font-variant-numeric: tabular-nums`.
- Full-bleed deep-forest sections used as anchors, so the page has rhythm rather than one
  continuous wash of cream.
- Every card must have an actual surface colour. No transparent cards with floating
  borders.

### Pages to build
1. **Home** — a holistic dog-nutrition AI assistant as the hero (chat input, suggested
   questions), then entry points to the four surfaces below.
2. **Food database index** (`/foods`) — searchable/filterable list of ~95 scored dog
   foods. Filter by score band and processing format.
3. **Food detail** (`/foods/[slug]`) — the score 0–100 with its band label, the full
   scoring breakdown line by line, flagged ingredients with severity and reason, the
   ingredient list, and links to other foods from the same brand.
4. **Health A–Z index** (`/library`) — 44 topics, searchable, grouped by letter and tag.
5. **Topic page** (`/library/[slug]`) — THE MOST IMPORTANT PAGE. See its spec below.
6. **Answers** (`/answers`, `/answers/[slug]`) — ~53 SEO question pages.
7. **Chat** (`/chat`) — full-page assistant.
8. **Scan** (`/scan`) — explains the iOS app, links to the App Store.

### The topic page — detailed spec
Two-column on desktop, single column on mobile:
- **LEFT (scrolls):** the article. A hero with emoji, tag pill, title, summary. Then the
  body with real typographic hierarchy — headings, tables, callout blockquotes for
  warnings.
- **RIGHT (sticky, stays in view while the left scrolls):** a live-rendered mechanism
  animation. See the hologram spec below.
- Below the article: a **"What I actually use"** block — 1–2 product cards, each with a
  circular tinted emoji badge, product name, one honest line about what it does, a "how
  to use it" note on a tinted left-ruled strip, and an amber pill CTA button. Must carry
  an FTC affiliate disclosure. Outbound links need `rel="nofollow sponsored noopener"`.
- Then a **numbered learning path** — an ordered list of 3 next topics, each a row with a
  gradient-filled number circle, emoji, title, one-line summary, and an arrow that slides
  on hover. Not a grid of equal-weight cards; an ordered path with an obvious next click.

### The mechanism animations (the important part)
Each topic gets a short looping animated explainer, roughly 30 seconds, broken into 6–8
captioned stages. Requirements:

- **Rendered live in the browser** (SVG or Canvas/WebGL). NOT a video file, NOT a YouTube
  embed. It must be kilobytes, never buffer, and work offline.
- **Transparent background.** It takes the colour of the page behind it and must look
  correct in both light and dark themes. If you use glow/additive blending, note that it
  washes out to invisible on a light background — so on light themes render as a clean
  botanical/blueprint line drawing instead, and reserve the glow for dark.
- **Use RECOGNISABLE ILLUSTRATED FORMS, not abstract primitives.** This is the single most
  important instruction here. A circle labelled "enzyme" teaches nothing. Draw an actual
  sardine that reads as a fish. An actual gut villus. An actual kibble piece, bowl, bone,
  leaf, mushroom. Hand-authored SVG line art that animates is better than 3D primitives.
- **Interactive:** the viewer can scrub the timeline by dragging, jump to any stage by
  clicking it, play/pause, and change speed (1x / 2x). Clicking a paragraph in the left
  column jumps the animation to that stage, and the active paragraph highlights as the
  animation reaches it.
- Respect `prefers-reduced-motion`: no autoplay, park on a representative frame.
- Degrade gracefully: if WebGL/SVG fails, the stage captions still render as readable text.

Example of a topic's stages, so you understand the level of specificity required —
**Probiotics**, framed as a garden (the gut as soil, bacteria as flowers, overgrowth as
weeds):
1. The garden — ~80% of the immune system lives in the gut lining
2. Under siege — antibiotics, processed kibble, steroids and chronic stress scorch it
3. Step 1 · calm the fire — slippery elm, marshmallow root, aloe, curcumin
4. Step 2 · prepare the soil — stomach acid, bile flow, digestive enzymes
5. Step 3 · clear the weeds — antimicrobial herbs, S. boulardii
6. Step 4 · plant — spore-based and broad-spectrum strains
7. Water and feed — prebiotics: larch bark, turkey tail, chlorella
8. Variety, not monoculture — split the bed in two; left stays diverse, right collapses
   to a single species

### Hard SEO requirements — do not compromise these
- Every page's **full text must be in the HTML**. The animation supplements the article;
  it never replaces it. Search engines cannot read a canvas.
- Server-render everything. Static generation for all topic, food, and answer pages.
- A dynamic sitemap that includes EVERY food page, topic page, answer page and blog post.
- `Organization` and `WebSite` JSON-LD in the root layout, both carrying
  `alternateName: ["commonsensedog", "commonsensedog.com", "CSDog", "csdog", "CS Dog"]`,
  and `Article` JSON-LD on each topic page.
- The one-word string "commonsensedog" must appear in visible body text (the footer).
- Unique `<title>` and meta description per page.

### Accessibility and quality
- Works at 400px wide with a 16px side gutter; never scrolls horizontally.
- Visible keyboard focus on every interactive element.
- Colour is never the only signal — pair it with an icon, glyph or label.
- Legal disclaimer in the footer: educational only, not veterinary advice, and a line
  saying blood in the stool, sustained weight loss or a dog going off food needs a vet.

### Do NOT
- Do not use a purple-to-blue gradient hero, Inter or Space Grotesk, emoji as section
  markers, or `rounded-lg` on everything. Those are the generic AI-site defaults.
- Do not invent nutrition facts, studies, doses or statistics. Leave content slots empty
  and I will supply the real text.
- Do not add a cookie banner, newsletter popup, or fake testimonials.

---

## ⚠️ READ THIS BEFORE YOU USE IT

**Do not let Base44 replace your live site.** What you have today is not a design — it is:

- 95 scored foods generated by your real scoring engine (`scoring.generated.ts`, 2,046 lines)
- 44 topic pages synced out of your Obsidian vault by `sync-library.mjs`
- 53 answer pages
- A Pinecone-backed AI assistant across 5 API routes, with Upstash rate limiting on all of
  them (added *because* the endpoints got abused and burned your Anthropic credit)
- A `.env` full of keys and a deploy pipeline that works

Base44 will produce a good-looking front end. It will NOT reproduce any of the above, and
your own `CLAUDE.md` records what happened the last time a revamp was done from scratch:
it "rewrote the results screen from scratch and silently deleted half the app."

**So use it for the design, not the rebuild.** Point it at ONE page — the topic page —
get a look you love, then have that design ported into the existing Next.js app where the
data and the API routes already live. You keep everything that works and you still get the
new look.

Generated 2026-10-20.
