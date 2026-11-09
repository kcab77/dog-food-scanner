# Website UI prompt — homepage-led, A–Z front and centre, app emphasised

Copy everything between the lines. Supersedes the earlier two prompts for UI work.

---

Design the website for **Common Sense Dog** (commonsensedog.com) — a holistic dog
nutrition reference whose job is to get worried dog owners into a free iPhone app
called **PawGrade**, which scans a dog food label and scores it 0–100.

### Who is standing in front of this
A dog owner holding a bag of food, who has just read an ingredient list with forty
items on it and does not know whether any of them are bad. They are not a vet. They
are slightly anxious and slightly guilty. They have about twenty seconds of patience.

Two rules that follow from that, and they govern every decision below:
- **Never shame the food they already bought.** The voice is "I fed my dog kibble for
  six years, I'm not judging you." Lead with what's in it and what to do next, never
  with a verdict.
- **One obvious thing to do on every screen.** If a page offers four equal choices, it
  has offered none.

### The homepage — in this exact order
1. **Hero.** One sentence saying what this is, and the single primary action:
   **Get the app — free.** Big, unmissable, above the fold. Secondary, quieter link:
   "or browse the health library below". No carousel, no stock photo of a golden
   retriever in a field, no email capture.
2. **The A–Z, right there on the homepage.** Not behind a nav link. This is the body of
   the page and the thing that proves the site is real. Specification below.
3. **Food database strip.** "95 dog foods, scored." A horizontal row of 5–6 real score
   cards (the number, the band colour, the brand) → links to the full database.
4. **Ask the assistant.** A single text input with 3 example questions as clickable
   chips. Not a floating chat bubble.
5. **App band.** Full-bleed deep-forest section. What the app does in three short
   lines — scan a label, get a 0–100 score, get told what to add to the bowl — and the
   App Store button. This is the second and final ask.

### The A–Z, specifically
44 real topics across 20 letters. Build it as a **dense, scannable index**, not a grid
of big cards — the point is that a reader sees the breadth instantly.

- A sticky letter rail (A B C D E F G H J K L M N O P S T V Y Z) that jumps on click.
  Letters with no topics are shown greyed, not hidden — the gaps are honest.
- Under each letter, topics as compact rows: emoji, title, and a one-line summary in
  muted text. Row height small enough that 6–8 fit on a phone screen.
- A search box at the top of the section that filters live as you type, matching both
  title and summary.
- Filter chips for the 7 tags, with real counts:
  **Conditions (16) · Nutrition (11) · Supplements (8) · Parasite Prevention (3) ·
  Safety (3) · Real Routines (2) · Reference (1)**

Real titles to build with, so you can see the shape of it:
`AAFCO Nutrient Profiles` · `Anxiety/Calming & Bloat/GDV` · `Breed-Aware Health & Diet
Flags` · `Cancer Support & Urinary Health` · `Cognitive Dysfunction (CCDS)` · `Dental
Health & Vaccines/Titers` · `Fleas, Ticks & Isoxazolines` · `Fasting & Bone Broth` ·
`Gut Health & Leaky Gut` · `Heat & Exercise Safety` · `Joints/Arthritis & Pancreatitis`
· `Kidney, Liver & Diabetes` · `Laryngeal Paralysis & GOLPP` · `Lipomas &
Organ-Support Diet` · `Lymphoma & Swollen Lymph Nodes` · `Medicinal Mushrooms` ·
`Mineral Forms (chelate vs sulfate vs oxide)` · `Nutrition Philosophy` · `Omega-3
(ratios, sources, dosing)` · `Probiotics — which one, and when` · `Food Processing
Methods` · `The Salt Divider Rule` · `TCVM Food Therapy` · `Thyroid Support` · `Toxic &
Safe Foods` · `Vitamins & Minerals` · `Yeast in Dogs` · `Zoonotic Parasites`

### Navigation
`Learn (A–Z)` · `Foods` · `Ask` · **`Get the app`** — four items, last one styled as a
filled button so it reads as the primary action from every page. No hamburger on
desktop. Sticky on scroll.

### Colour — use these exact values
A warm forest-green-on-warm-off-white palette. Deliberately not the white-and-blue
every health site defaults to — it should read like a field guide. Define as CSS custom
properties on `:root`, then redefine ONLY the values inside both
`@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`.

LIGHT
--leaf #2F7D3C · --leaf-deep #215C2C · --leaf-bright #43A354 · --leaf-wash #EDF6EF
--amber #D98A1F · --amber-wash #FDF4E4
--paper #FBFAF8 · --paper-2 #F4F2ED · --surface #FFFFFF · --border #E6E3DC
--text #1A1D1A · --text-muted #5E625C · --text-faint #8C8F88
--score-excellent #1E7A35 · --score-good #58963F · --score-fair #C68A1E
--score-below #C2661F · --score-low #A93226

DARK
--leaf #6FCB80 · --leaf-deep #9ADFA6 · --leaf-bright #5BB86C · --leaf-wash #16261A
--amber #E8AC4C · --amber-wash #241C0E
--paper #0F1210 · --paper-2 #161A16 · --surface #191D19 · --border #2C312C
--text #ECEFE9 · --text-muted #A3A89F · --text-faint #757A72

Rules for using it:
- **Green is the brand** and carries everything editorial.
- **Amber is a signal colour** — app CTAs and "this is live / do this now". Never
  decoration. If amber is everywhere, it signals nothing.
- The five score colours are **semantic only** — they appear on scores and nowhere else,
  so a colour always means the same thing.
- Deep forest (`--leaf-deep` as a full-bleed background) for one or two anchor sections,
  so the page has rhythm instead of one unbroken wash of off-white.
- **Every card gets a real surface colour.** No transparent cards with floating borders.

### Typography
A serif for headings — this is a field guide, not a SaaS product — a clean sans for
body, and a monospace for every number and score with `font-variant-numeric:
tabular-nums` so digits line up in columns. Pick five sizes and never deviate. Body
text near 65 characters wide.

### Hard requirements
- Full page text present in the HTML, server-rendered. The A–Z must be real markup, not
  JavaScript-rendered — it is the main thing search engines read.
- Works at 400px with a 16px gutter; never scrolls horizontally.
- Visible keyboard focus everywhere; the letter rail must be keyboard-navigable.
- Colour is never the only signal — pair every score colour with its band label.
- Footer disclaimer: educational only, not veterinary advice, and a line saying blood in
  the stool, sustained weight loss, or a dog going off food needs a vet.

### Do NOT
- No purple-to-blue gradient hero, no Inter or Space Grotesk, no emoji as section
  markers, no `rounded-lg` on everything. Those are the generic AI-site defaults.
- No cookie banner, no newsletter popup, no testimonials, no "as seen in" logos.
- Do not invent nutrition facts, doses, or statistics. Use the real titles above and
  leave body text as slots — I will supply it.

### Build order
Build the **homepage only**, at full fidelity, before anything else. It is where the
A–Z, the colour system and the app emphasis all have to work together — if it is right,
the rest of the site follows from it.

---

⚠️ Use the result as a **design to port**, not a replacement site. The live site carries
95 foods generated by a real scoring engine, 44 topics synced from an Obsidian vault,
999 Q&A pairs in Pinecone, and five rate-limited API routes. A regenerated front end
reproduces none of that, and the 208 pages currently indexed by Google would be lost.

Generated 2026-11-09.
