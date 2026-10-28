"""Writes audio/words/clips.json for the My words mode, then render with the shared tool:

  python3 words/clips.py && python3 ../../tools/voice.py audio/words/clips.json audio/words --lang en

One clip per word in words/long-e.json (the 10 test words are already embedded in the game), plus the
mode's phrases. Words are spoken as "word." so each one gets a clean, finished intonation.
"""
import json, pathlib
here = pathlib.Path(__file__).parent
lex = json.loads((here / "long-e.json").read_text())
embedded = {"feet", "deep", "sleep", "week", "bleed", "beak", "east", "steam", "seal", "peas"}
words = lex["ee"] + lex["ea"] + lex["both"] + list(lex["tricky"])
clips = {f"w_{w}": f"{w}." for w in words if w not in embedded}
clips.update({
    "my_intro": "Do you know more words with E E or E A? Type one and check it!",
    "my_ee": "Yes! It's on the double E team!",
    "my_ea": "Yes! It's on the E A team!",
    "my_both": "Wow! It has double E and E A!",
    "my_tricky": "Great spelling! But this one is tricky. It doesn't make the long E sound.",
    "my_almost": "Almost! Did you mean",
    "my_unknown": "Hmm, I don't know that word yet. Ask a grown-up to check it.",
    "my_again": "You already found that one! Try another.",
    "my_nopair": "That word doesn't have double E or E A. Try another one!",
})
out = here.parent / "audio" / "words"; out.mkdir(parents=True, exist_ok=True)
(out / "clips.json").write_text(json.dumps(clips, indent=0))
print(len(clips), "clips,", sum(map(len, clips.values())), "characters")
