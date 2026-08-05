# 🔬 Scanner Tracker

**The live coverage map of what PawGrade's scanner actually knows.**

## 🔗 The link

**https://claude.ai/code/artifact/c053bdb5-7469-41c6-8b0e-6be6e3a11b8b**

Private to Kyle unless shared from the page's share menu.

---

## What it holds

A measured — not estimated — picture of the scanner:

- **Ingredient coverage** — every one of the 27 lists the scanner matches against, with term counts,
  grouped by what they do (avoid / earn credit / quality signal / guidance)
- **The scan pipeline** — the six steps from reading a label to personalising the answer
- **Fixes** — flagging errors corrected, with what was wrong and how wide the blast radius was
- **⚠️ Not built yet** — the honest half. Rules written into the copy but not into the logic

Baseline at first publish (2026-08-05): **470 terms · 27 lists · 69 flagged ingredients · 12 results
sections · 580 products cached from 104 scans**.

## When to reference it

- Kyle asks *"what does the scanner cover?"*, *"have we done every ingredient?"*, or wants the
  overall state of the app's knowledge
- Before starting ingredient work — check whether it's already covered rather than duplicating
- After shipping a scoring or coverage change, so the page doesn't drift into being another
  stale index (the exact failure `/os-audit` found three times)

## When to UPDATE it

Republish whenever any of these change:

- A new `*_INGREDIENTS` / `*_SOURCES` / `*_FOODS` constant is added, or an existing one grows
- An ingredient changes severity tier
- A results section is added or removed
- Something moves from "not built" to built — **especially the salt divider, prebiotics,
  ingredient splitting, protein allergen risk, and the `cyanocobalamin` fix**

**Republish, don't recreate.** Same file path (`scratchpad/pawgrade-coverage.html`) in a session that
published it keeps the URL; from any other conversation, pass the URL above as `url`. A new file path
mints a new link and this one goes stale.

## How the numbers were produced

Counted directly from `app/index.tsx` — never estimated. To regenerate:

```bash
python3 - <<'PY'
import re
s = open('app/index.tsx').read()
def count(name):
    m = re.search(r'const ' + name + r'[^=]*=\s*\[(.*?)\n\];', s, re.S)
    if not m: return 0
    b = m.group(1)
    return len(re.findall(r'term:\s*"', b)) or len(re.findall(r'"[^"]+"', b))
for n in ["HARMFUL_INGREDIENTS","SUPERFOODS","OMEGA3_MARINE","OMEGA3_PLANT","GROCERY_FINDS"]:
    print(f"{n:26} {count(n)}")
PY
```

Related: `docs/TODO.md` (the open items this page reports as "not built"), `PINECONE_TODO.md`
(knowledge-base side), and `/os-audit` for whether any of this has gone stale.
