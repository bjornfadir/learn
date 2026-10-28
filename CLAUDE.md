# Learning Games portal

Short, playful practice games for several kids of different ages (a 3rd grader in Israel first; English is a second language). Plain HTML, CSS and vanilla JS, no framework and no build step. Hosted on GitHub Pages from the **public** repo `bjornfadir/learn`.

- Home: https://bjornfadir.github.io/learn/
- `.github/workflows/pages.yml` publishes the repo as-is on every push to `main`. Commit built files and audio before pushing.
- **The repo is public:** no children's names, photos or other personal details, anywhere.

## Layout

```
index.html             portal: subjects -> game cards, grade filter, stars per game
games.json             registry the portal reads (subject, title, he, desc, grades, path, stars key)
shared/base.css        colour tokens (light + dark), card, buttons, progress, feedback, place-value house colours
shared/audio.js        Voice: one shared <audio> (iOS-safe), clips as MP3 files + index.json, say/chain/hush/later
shared/core.js         shuffle, seeded PRNG, store (safe localStorage), starCounter, progressBar, pickLang/applyLang (portal-wide learn-lang)
shared/numbers.js      maths numbers: places, levels 1-9,999, makeNumber, numbers in words EN/HE, numClips (spoken numbers)
shared/numbers/<lang>/ the rendered number-piece clips every maths game reuses (+ clips.js to regenerate the list)
shared/houses.css      place-value house columns (roof, digit, highlight states)
shared/print.css       A4 print sheets (controls, .sheet, sections, blanks, answer styling, houses table)
tools/voice.py         renders {key: text} clips with ElevenLabs Lily into MP3 files (re-renders only changed text)
english/spelling/      Long ee & ea Quest (own CLAUDE.md). Older single-file design, see "Debt" below
math/place-value/      Place Value Houses, EN/HE games + printable sheets (own CLAUDE.md)
math/compare/          Hungry Crocodile: greater than / less than, EN/HE games + printable sheets (own CLAUDE.md)
```

## Adding a game

1. Make `<subject>/<game>/index.html`. Link `../../shared/base.css`, `core.js`, `audio.js`, and a `← All games` link to `../../`. Every page carries its own doctype, charset and viewport tags. Reference every local script and stylesheet as `file.js?v=dev` / `file.css?v=dev`: the deploy stamps `dev` with the commit hash, so a browser never mixes a new page with an old cached script. On 2026-10-28 that mix blanked every maths page for a returning visitor.
2. Add it to `games.json`. `stars` is the game's localStorage key (`<game>-stars`); the portal shows it.
3. Spoken lines: build a `{key: text}` clips file and render it with `python3 tools/voice.py <clips.json> <game>/audio/<lang> --lang <lang>`. Then `Voice.load(['../../shared/numbers/<lang>', 'audio/<lang>'])` in the game (maths games get every number for free).
4. Test at 360-390 px phone width and in a tablet viewport: no horizontal scroll, every round completes, correct answers score. For RTL, check every number and place-value row stays LTR.
5. Write the game's own CLAUDE.md, then commit and push.

A new *word list* or *number range* for an existing game should be data, not new code.

## Conventions every game keeps

- **Teaching pattern:** a learn/explore screen first, then short game rounds of 10, a progress bar, instant feedback that shows the right answer and why, stars (+5 for a perfect round), and a "next game" button. Sessions are about 10 minutes.
- **Phone and tablet first:** big tap targets, no reliance on the device keyboard (on-screen keys or tap tiles), `touch-action:manipulation` on game buttons, and `hush()` on every screen change.
- **Accessibility:** text colours >= 4.5:1. Yellow is never used for text (`--sun-ink` exists for that). Feedback lives in `role="status"`. Respect `prefers-reduced-motion`.
- **No native dialogs:** never use alert/confirm/prompt.
- **Languages:** Hebrew pages set `dir="rtl"`; numbers and place-value rows get `dir="ltr"` / `.ltr`. A lone `<`/`>` symbol beside Hebrew text goes in `<bdo dir="ltr">` so it can never mirror. Use commas for thousands in both languages. The language choice is portal-wide (`learn-lang`).

## Voice (ElevenLabs)

- Voice "Lily" `pFZP5JQG7iQjIQuC4Bku`. English uses `eleven_multilingual_v2`. **Hebrew must use `eleven_v3` with `language_code: "he"`**: `multilingual_v2` returned audio that was not Hebrew at all (checked by Adam on 2026-10-28).
- The key lives in `~/.config/elevenlabs/api_key` (chmod 600, outside the repo). It only has text-to-speech permission and can't list voices or read the quota.
- Free tier, about 10,000 characters a month, so the "Voice by ElevenLabs" credit stays on every page with audio. As of 2026-10-28 roughly 8,000 characters have been used (spelling ~2,500, spelling My words ~1,670, numbers + place value ~3,100, compare ~530), leaving ~2,000 until the monthly reset. Check before big re-renders.
- **Pronunciation:** respell only the part that comes out wrong, in the game's clip text. Write letter names as capitals ("B.") and sounds as respellings ("Eee!"). Use `<break time="0.3s" />` for short pauses (multilingual_v2 only). Long pauses plus slow speed sounded like a hypnotist.
- Numbers are spoken by chaining short clips (`en_t3` "three thousand", `en_h2`, `en_and`, `en_n46`) with a 60 ms gap, so any number from 1 to 9,999 needs only ~140 clips per language.

## Debt

- `english/spelling` still has its own copies of the audio player, keyboard and styles, and embeds its clips as base64 in one 1.2 MB file. When its next word list is added, move it onto `shared/` with clips as files and the words in a list JSON.
