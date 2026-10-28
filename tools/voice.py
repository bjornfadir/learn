"""Render a module's clips with ElevenLabs into MP3 files that shared/audio.js plays.

  python3 tools/voice.py <clips.json> <out_dir> [--lang en|he] [--voice ID] [--speed 0.9]

clips.json is {key: text}. Writes <out_dir>/<key>.mp3, <out_dir>/index.json (the list of keys,
read by Voice.load) and <out_dir>/texts.json (the text each clip was rendered from). Re-runs only
pay for clips that are new or whose text changed, so editing one line re-renders one clip.

Voice: Lily (pFZP5JQG7iQjIQuC4Bku). English uses eleven_multilingual_v2. Hebrew needs eleven_v3
with language_code "he": multilingual_v2 returned audio for Hebrew, but it was not Hebrew at all.
Pronunciation: fix bad clips by respelling the spoken text in the module's clip list, not here.
Key: $ELEVENLABS_API_KEY or ~/.config/elevenlabs/api_key (outside the repo, never commit it).
Stdlib only. ElevenLabs returns MP3 directly.
"""
import argparse, json, os, pathlib, time, urllib.error, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("clips"); ap.add_argument("out")
ap.add_argument("--lang", default="en")
ap.add_argument("--voice", default="pFZP5JQG7iQjIQuC4Bku")   # Lily
ap.add_argument("--speed", type=float, default=0.9)
a = ap.parse_args()

key = os.environ.get("ELEVENLABS_API_KEY") or pathlib.Path("~/.config/elevenlabs/api_key").expanduser().read_text().strip()
clips = json.loads(pathlib.Path(a.clips).read_text())
out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
manifest = out / "texts.json"
done = json.loads(manifest.read_text()) if manifest.exists() else {}

def body(text):
    if a.lang == "en":
        return {"text": text, "model_id": "eleven_multilingual_v2",
                "voice_settings": {"stability": 0.6, "similarity_boost": 0.8, "speed": a.speed}}
    # eleven_v3 only accepts stability 0.0 / 0.5 / 1.0
    return {"text": text, "model_id": "eleven_v3", "language_code": a.lang,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}

def tts(text):
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}?output_format=mp3_44100_64",
        json.dumps(body(text)).encode(), {"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as r: return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code == 429 and attempt < 2: time.sleep(5); continue
            raise SystemExit(f"ElevenLabs {e.code} on {text!r}: {msg}")

todo = [k for k, t in clips.items() if not (out / f"{k}.mp3").exists() or done.get(k) != t]
print(f"{len(todo)} to render ({sum(len(clips[k]) for k in todo)} characters)", flush=True)
for k in todo:
    (out / f"{k}.mp3").write_bytes(tts(clips[k])); done[k] = clips[k]
    manifest.write_text(json.dumps(done, ensure_ascii=False, indent=0))
    print(f"{k:14s} {clips[k]}", flush=True)
(out / "index.json").write_text(json.dumps(sorted(k for k in clips if (out / f"{k}.mp3").exists())))
print(f"{out}/index.json: {len(clips)} clips")
