"""Inject the generated voice clips into src/game.html -> index.html."""
import json, pathlib, sys
root = pathlib.Path(__file__).parent
voice = sys.argv[1] if len(sys.argv) > 1 else "lily"  # reads tts/audio_<voice>.json (lily = ElevenLabs Lily, the live voice)
clips = json.loads((root / f"tts/audio_{voice}.json").read_text())
html = (root / "src/game.html").read_text()
assert "__CLIPS__" in html
out = html.replace("__CLIPS__", json.dumps(clips), 1)
(root / "index.html").write_text(out)  # served by GitHub Pages at /learn/english/spelling/
print(f"index.html: {len(out)//1024} KB, {len(clips)} clips")
