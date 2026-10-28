# Hungry Crocodile (math/compare)

Greater than / less than / equal for numbers up to 9,999, part of the Learning Games portal (`../../CLAUDE.md`). It builds on Place Value Houses (`../place-value/`), with the same levels, houses, colours and spoken numbers. Live at https://bjornfadir.github.io/learn/math/compare/ . Built 2026-10-28 with the build-learning-module skill. There was no written plan; the decisions below came from Adam.

## Decisions (2026-10-28)
- **Hungry crocodile:** its open mouth always eats the bigger number (7 > 3, 3 < 7). The symbol buttons and legend are crocodiles drawn as the symbol itself (`croc()` in cmp.js), and `=` is a closed mouth (two bars).
- **How to compare:** line both numbers up in their houses and start at the biggest house. The first house that differs decides. More houses always means a bigger number (3,046 > 346).
- Levels match place value: 2 digits, 3 digits, 4 digits, with zeros. Pairs lean toward the classic traps (`makePair`): near pairs (one house differs), swapped digits (2,519 vs 2,591), different lengths (3,046 vs 346), and equal pairs (only where `=` is an answer).
- English and Hebrew, switchable (portal-wide `learn-lang`). Number sentences stay LTR in Hebrew too. Spoken Hebrew uses "גדול מאשר / קטן מאשר" because the written מ־ prefix can't be a separate clip, and "המספרים שווים" for equal.
- Games: 🍽️ Feed the crocodile (tap the bigger, sometimes the smaller), ⚖️ Pick the symbol (<, =, >), ✅ True or false (statements often wrong in the classic way). Plus 🐊 Learn (step-by-step house comparison) and 🖨️ Print. "Order them" was not picked.
- Colour printing available. Worksheet: A. write <, > or = (8), B. circle the bigger number (4), C. true or false (4), plus an answer key. Seeded via `?lang=&level=&seed=`.

## Files
```
cmp.js       makePair, sym, why (deciding house), CSTR (all UI text EN/HE), phrase clips, sentenceClips, croc() SVG
index.html   the game; feedback shows the true sentence, both numbers in their houses with the deciding house highlighted, and why
print.html   worksheet + answer key (shared/print.css)
clips.js     node clips.js -> audio/<lang>/clips.json (16 phrases per language), render with ../../tools/voice.py
audio/<lang> phrase MP3s; numbers come from ../../shared/numbers/<lang>/
```
Stars are in `cmp-stars`, the level in `cmp-level`.
