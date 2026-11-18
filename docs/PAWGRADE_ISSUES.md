# PawGrade — Issues & Fix List

Kyle's running list of what's wrong with the app. Add to it as things come up; mark items
✅ with the date + build they shipped in. Newest status at the top of each item.

**Last updated:** 2026-11-17 · **1.9.2 (66) SUBMITTED FOR REVIEW 2026-11-17** (camera fix); **build 67** = 66 + keyboard fix + scan-count fix

---

## 🔧 Bugs — fix next build

### 1. Can't close the keyboard in the type-in ingredients box
- **What happens:** you type ingredients into the manual entry box and there's no way to put
  the keyboard down when you're done. It covers the screen / the Analyze button.
- **Why:** the box is `multiline` (`app/index.tsx` ~10032, the `manualIngredientText`
  TextInput). On a multiline input, iOS's Return key inserts a new line instead of closing the
  keyboard, and nothing else on that screen dismisses it.
- **Fix (small):** any one of these —
  - a "Done" bar above the keyboard (`InputAccessoryView`) that calls `Keyboard.dismiss()`, or
  - `returnKeyType="done"` + `submitBehavior="blurAndSubmit"` (ingredients are comma-separated,
    so losing the newline is fine), and/or
  - `keyboardDismissMode="on-drag"` on the parent ScrollView so a swipe down closes it.
- **Status:** ✅ fixed 2026-11-17 — Return key is now "Done" (`returnKeyType="done"` +
  `submitBehavior="blurAndSubmit"`). Ships in build 67.

---

## 🎯 Long-term goals

### 2. Type-in should understand a whole homemade meal, not just a bag label
- **What happens now:** typed "eggs, fish, meat" → **52**. Added "it's raw" → **82**.
  The score is reading it like a kibble ingredient panel, and the processing bonus does most of
  the moving. It doesn't really know what it's looking at.
- **What it should do:**
  - Recognise food categories from plain words: protein sources (meat / fish / eggs / organ),
    carbs, veg, fats, supplements.
  - Say **whether it's a complete meal for a dog or not** — and what's missing (e.g. no calcium
    source, no organ, no omega-3) — and be accurate about it.
  - Explain the score in plain language: why it got that number.
- **Notes for whoever builds it:**
  - Ties straight into the Bowl Problem thesis — completeness · energetics · not
    oversupplementing (`docs/BLUEPRINT_THE_BOWL.md`, `docs/BLUEPRINT_BOWL_ADDITIONS.md`).
    Follow the 7-part feature-spec format before building.
  - Scoring changes need Kyle's sign-off (CLAUDE.md → PawGrade Scoring System).
  - "Complete meal" claims need a real reference standard (AAFCO / NRC nutrient profiles) —
    don't let it call something complete on vibes.
- **Status:** idea / not started — logged 2026-11-17.

### 5. Treats: snap the ingredient list → a real "is this good for MY dog?" read, like asking Claude
- **The idea:** take a photo of any treat (or food) ingredient panel and get a conversational,
  thorough inspection — what each ingredient is, what's good, what's a concern, and a clear
  verdict for *this* dog — the way people are already doing with Claude/ChatGPT for human food.
- **Why it matters:** Kyle saw someone in a store today doing exactly this with an AI chat app for
  human food. **The goal is that dog owners do it in PawGrade instead of leaving for Claude** —
  keeps people in the app.
- **What already exists (build on it, don't rebuild):**
  - The Treats tab is live (`scoreTreats`, `TREAT_HARMFUL`, `TREAT_OK_INGREDIENTS` in
    `app/index.tsx`) and the camera already reads labels via Claude Vision.
  - The ingredient-detail modal + `/api/ingredient` already give a Claude explanation per ingredient.
  - `dog-profile.tsx` stores the dog's details (breed, weight, conditions) — that's what makes it
    "for **my** dog" rather than generic.
  - The AI coach / chat backend (Pinecone RAG on commonsensedog.com) can answer follow-ups.
- **What's missing:** one plain-language "inspection" write-up tying it together, personalised
  to the dog profile, with the option to ask follow-up questions right there.
- ⚠️ Known gap: a treat scanned in smart/manual mode is still scored as *food* (CLAUDE.md).
- Same rules as #2: scoring changes need Kyle's sign-off; spec it in the 7-part format first.
  Related to #2 — both are "understand what I'm actually feeding" features.
- **Status:** idea / not started — logged 2026-11-17.

---

### 6. People download but don't seem to scan — measure it
- **Kyle's read (2026-11-17):** downloads went ~5/mo → ~10/mo (8 so far in Nov), but it doesn't
  look like downloaders are using the scanner.
- **Likely causes, all addressed in build 66:**
  1. **Anthropic balance hit $0** (found 2026-11-15) → every label scan errored. Topped up
     2026-11-17 and verified the live API answers. Unknown how long it was at $0.
  2. **Camera "Don't Allow" lock-out** — denied users were stuck forever (fixed, see ✅ below).
  3. **Scanner was less prominent** after the Learn-tab rebuild; now opens straight to scan.
- **Next step:** run `scripts/scan-report.mjs` (needs the Supabase `service_role` key) → scans per
  week vs downloads per month. That says whether it's "broken" or "hidden" instead of guessing.
- **Ongoing:** keep the Anthropic balance funded — consider auto-reload or a low-balance alert so
  a $0 balance never silently kills the scanner again.
- **Status:** open — re-check ~4 weeks after 1.9.2 goes live.

---

## 🕓 Later / housekeeping

### 3. Expo package versions are a few patches behind
- ~15 packages behind what SDK 55 expects (e.g. `expo-camera` 55.0.18 vs ~55.0.23,
  `react-native` 0.83.6 vs 0.83.10). Not breaking anything.
- **Fix:** `npx expo install --fix`, then test in simulator + TestFlight before shipping.
  Do it at the start of a build cycle, never the night of a submission.
- **Status:** open — deliberately deferred 2026-11-17.

### 4. EAS upload is 152 MB
- Slows every build upload. Tighten `.easignore` to exclude non-app folders
  (`_archive/`, `common-sense-dog-ai*/`, `expert-platform/`, etc.).
- ⚠️ Keep `.env` un-ignored and never ignore an app code dir like `storage/` (see CLAUDE.md).
- **Status:** open.

---

## ✅ Fixed

### Changing the food type counted as a second scan — fixed 2026-11-17, NOT in build 66
- **Was:** after a scan, tapping "What type of food is this?" → Raw re-ran the whole analysis,
  and every run inserted a row into Supabase `scans`. One food = 2+ scans in the log.
- **Now:** that picker passes `isRescore` to `processIngredients` → score updates, no new log row.
- Note: the logged row keeps the *first* score (before the food type was corrected).
- Re-typing ingredients and pressing Analyze again still counts as a new scan (it is one).
- **Ships in:** build 67.

### Camera "Don't Allow" left users stuck — fixed 2026-11-17, build 1.9.2 (66)
- **Was:** the whole app was locked behind the camera prompt on launch. Tap "Don't Allow" and
  iOS never asks again → stuck on that screen forever.
- **Now:** app opens straight in; the camera frame itself asks for access, and if it was denied
  it shows an **Open Settings** button. Manual entry + sample scans work with no camera.
- **Verify on device:** delete app → reinstall from TestFlight → tap Don't Allow → confirm the
  Open Settings button appears and works.
