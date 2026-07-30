# PawGrade UI Revamp — Prompt

Copy everything below the line into a fresh session.

Why the last attempt lost half the app: the model **rewrote the results screen from
scratch** instead of restyling what was there. Anything it didn't happen to think of
simply vanished. The fixes baked into this prompt are: (1) an explicit do-not-delete
inventory, (2) a ban on from-scratch rewrites, and (3) a mandatory self-audit before
it's allowed to call the job done.

---

## TASK

Revamp the **visual presentation** of the PawGrade results screen in `app/index.tsx`
so it is more readable and more professional. This is a **re-presentation task, not a
content-reduction task.**

## THE ONE RULE THAT MATTERS

**You may not delete or omit ANY existing information.** Every section, every data
constant, every ingredient warning, every supplement card, every piece of copy that
renders today must still render when you are done. You are changing *how* the
information is presented, never *whether* it is presented.

If you think something should be cut, **stop and ask me.** Do not cut it yourself.

## HOW TO WORK (this is the part the last attempt got wrong)

- **Edit the existing file in place.** Do NOT rewrite `app/index.tsx` from scratch, do
  not regenerate the results screen from memory, do not "recreate" sections. Use
  targeted edits against the code that is actually there.
- Read the current results screen fully **before** changing anything, so you know what
  exists. It is ~6,500 lines — read it properly, don't skim and guess.
- Work in small passes and typecheck between them (`npx tsc --noEmit`).

## THE LOOK

All colours live in **`lib/theme.ts`** — the single source of truth. Use the semantic
tokens (`t.good`, `t.critical`, `t.surface`, `t.textMuted`, `t.dcm`…).

**Never write a raw hex code into a component.** If you need a colour that doesn't
exist, add a named token to `lib/theme.ts`. There are currently zero hex literals in
`app/index.tsx` — keep it that way.

Goals: cleaner hierarchy, more breathing room, calmer and more credible, easier to
scan. Keep it warm and non-judgmental — PawGrade's whole voice is "I fed my dog kibble
for six years, I'm not here to judge you." Professional ≠ cold.

## DO-NOT-DELETE INVENTORY

### Results sections that must all still exist
1. Compassionate note from Kyle (the "don't feel bad" message)
2. "Here's how to improve" card (`getNextStep()`)
3. Why This Score (the score breakdown rows)
4. Guaranteed Analysis (protein / fat / fiber / moisture / carbs / omega ratio)
5. Processing Method
6. Ingredient Breakdown (the coloured ingredient pills)
7. Ingredients to Watch (the red-flag list, tap-to-expand reasons)
8. Simple additions to upgrade the bowl
9. Hershey's Protocol
10. Recommended Supplements — **all 7 affiliate cards**, in order: Probiotics → Fish Oil
    → Green Lipped Mussel → Heart → Liver → Detox → Four Leaf Rover
11. Grocery Store Finds
12. Lipoma Prevention
13. TCVM / Protein Energetics
14. Dental Benefits + Dental Care Tips
15. FDA recall alert banner
16. Data-source line, AAFCO status, TAPF list status

### Data constants that must all still be used (all in `app/index.tsx`)
`HARMFUL_INGREDIENTS`, `SEVERITY_PENALTIES`, `SEVERITY_COLORS`, `SUPPLEMENT_RECS`,
`TOXIC_ADDITIVES`, `NAMED_MEALS`, `GENERIC_MEALS`, `MEAT_MEALS`, `ADDED_VITAMINS`,
`VITAMIN_MINERAL_PENALTIES`, `LENTIL_LEGUME`, `HIGH_CARB_INGREDIENTS`, `ORGAN_MEATS`,
`SUPERFOODS`, `WHOLE_FOOD_PRODUCE`, `ANTI_INFLAMMATORY_FOODS`, `ORGAN_COVERAGE`,
`HIGH_FIBER`, `PROBIOTIC_SOURCES`, `AAFCO_TRIAL_KEYWORDS`, `GENERIC_PROTEIN_TERMS`,
`SPECIFIC_PROTEIN_TERMS`, `INGREDIENT_NUTRIENTS`, `GROCERY_FINDS`, `PROCESSING_METHODS`,
`DENTAL_INGREDIENTS`, `TAPF_APPROVED_BRANDS`, `TREAT_HARMFUL`, `TREAT_OK_INGREDIENTS`.

If a constant is defined but you can't find where it renders, **tell me** — don't
quietly drop it.

### Behaviour that must survive
- Tapping an ingredient pill opens its detail modal
- Tapping a red flag expands its reason inline
- Collapsible sections stay collapsible
- The feedback modal and the AI coach still open
- Treats scoring code stays in the file (it's dormant, not dead — don't delete it)

## DO NOT TOUCH

- **The scoring algorithm.** No changes to penalties, caps, thresholds, or the score
  floor. Presentation only.
- API calls, Supabase, Pinecone, or any key/env handling.
- `lib/productLookup.js` logic.

## BEFORE YOU TELL ME YOU'RE DONE

1. Run `npx tsc --noEmit` — `app/index.tsx` and `lib/` must be **zero errors**.
2. Walk the do-not-delete inventory above item by item and confirm each one still
   renders. **Report the checklist back to me** with a ✅ per item.
3. Confirm zero raw hex literals were added: `grep -c '#[0-9a-fA-F]\{3,6\}' app/index.tsx`
   should return `0`.
4. Tell me plainly what you changed, and anything you were unsure about.

Do not claim it works. You cannot run the app. Say what you verified and what I still
need to test on device.
