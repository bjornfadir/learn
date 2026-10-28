# Place Value Houses (math/place-value)

Place value up to thousands (Thousands, Hundreds, Tens, Units) for a 3rd grader just starting the topic, part of the Learning Games portal (`../../CLAUDE.md`). Live at https://bjornfadir.github.io/learn/math/place-value/ . Built 2026-10-28 from the parent's teaching plan below.

## Decisions (2026-10-28)
- English and Hebrew, switchable (remembered per device in the portal-wide `learn-lang`, `?lang=he|en` overrides). Hebrew is RTL, but numbers and rows of houses stay LTR, with Thousands on the left.
- Always "Units", never "Ones". Commas for thousands in both languages (3,246).
- Interactive games plus printable sheets. Colour printing is available, and each place keeps the same colour on screen and on paper (`--th --hu --te --un` in `shared/base.css`; print.html hard-codes the light values).

## Files
```
pv.js        shared by both pages: all UI text (STR) and the module's phrase clips. Levels, makeNumber, houses
             helpers and numbers in words/clips moved to ../../shared/numbers.js (shared with math/compare)
index.html   game: 🏠 Houses explorer (Concrete -> Pictorial: ▲▼ per house, blocks, worth, expanded form, words,
             zero tip), 🔍 What is it worth?, 🧱 Build it (from words + voice), 🏆 Biggest/smallest, 🔄 Swap it, 🖨️ Print
print.html   A4 portrait: chart (houses, x10 arrows, example 3,246, blank rows), one-page worksheet, answer key.
             Seeded (`?lang=&level=&seed=`), so a sheet can be regenerated; Print uses the browser's print dialog
clips.js     node clips.js -> audio/<lang>/clips.json (phrases only), then render with tools/voice.py
audio/en, audio/he   phrase MP3s + index.json (+ texts.json). Spoken numbers live in ../../shared/numbers/<lang>/
```
Levels: 1 = 2 digits, 2 = 3 digits, 3 = 4 digits, 4 = 4 digits with placeholder zeros (3,046; 4,005; 7,010). Stars are in `pv-stars`, the level in `pv-level`.

Worksheet sections (one page = one ~10 minute session): A. worth of an underlined digit, B. expanded form and reverse, C. fill the houses, D. biggest/smallest from given digits. The smallest number may not start with 0, and the game explains why.

Regenerate audio after changing any text in `STR[lang].say` (number words: see `shared/numbers/clips.js`):
`node clips.js && python3 ../../tools/voice.py audio/en/clips.json audio/en --lang en && python3 ../../tools/voice.py audio/he/clips.json audio/he --lang he`

## Not done yet
- Concrete stage on screen is drawings only; real objects (beads, Lego, bundled sticks, play money) are for the parent at home.
- Hebrew worksheet uses LTR math lines inside RTL text; check with a Hebrew-reading parent that it reads naturally.
- Drag-and-drop was swapped for tap-to-place (works better on phones).

## The parent's teaching plan (keep materials consistent with it)

## Teaching approach (already agreed — keep materials consistent with it)

- **"Houses" metaphor:** each digit lives in a house; the house it lives in decides what it's worth. Each house is worth **10× the house to its right**.
- **Place-value table:**

  | Thousands | Hundreds | Tens | Units |
  |-----------|----------|------|-------|
  | 3         | 2        | 4    | 6     |

  3,246 = 3,000 + 200 + 40 + 6
- **Finding the place:** count positions from the right — 1st = units, 2nd = tens, 3rd = hundreds, 4th = thousands.
- **Zero as placeholder:** compare 3,046 vs 346 — the 0 holds the hundreds house open so the 3 stays in thousands.
- **Manipulatives:** beads, Lego bricks, bundled sticks (bundles of 10, 100), play money.
- **Concrete → Pictorial → Abstract:** objects first, then drawings, then digits alone. Don't advance a stage until the child is comfortable.
- **Sessions ~10 minutes.** Short and game-based beats long drills.

### Practice games defined so far
1. **What is the digit worth?** — point to a digit in a number; child says its value (the 4 in 3,246 → 40).
2. **Build it** — say a number; child builds it with objects or fills the table.
3. **Biggest number** — given 4 digits, arrange them into the largest (and smallest) possible number.
4. **Swap it** — swap two digits; how did the number's value change?
