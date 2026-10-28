/* Shared voice player for every game.
   Clips are MP3 files in a folder with an index.json listing the keys that exist:
     Voice.load('audio/en')  ->  audio/en/index.json + audio/en/<key>.mp3
   One shared <audio> element is reused, because iOS only lets an element play outside a tap
   once a tap has played it, and chained clips run after awaits.
   say(key | [keys]) plays in order; chain(keys, onEach(i), done, gap) adds a per-clip callback.
   A new call cancels the one playing. Missing keys are skipped silently.
   hush() stops speech and cancels delayed auto-play queued with later(); call it on every screen change. */
const Voice = (() => {
  const player = new Audio();
  let dir = '', have = new Set(), chainId = 0, pending = null, timers = [];
  async function load(d) {
    dir = d; have = new Set();
    try { const r = await fetch(d + '/index.json'); if (r.ok) have = new Set(await r.json()); } catch (e) {}
  }
  function play(k) {
    return new Promise(res => {
      try {
        if (pending) pending(); pending = res;
        if (!have.has(k)) return res();
        player.onended = player.onerror = res;
        player.src = dir + '/' + k + '.mp3';
        const p = player.play(); if (p) p.catch(res);
      } catch (e) { res(); }
    });
  }
  function chain(keys, onEach, done, gap = 180) {
    const id = ++chainId;
    (async () => {
      for (let i = 0; i < keys.length; i++) {
        if (id !== chainId) return;
        onEach && onEach(i);
        await play(keys[i]);
        if (id !== chainId) return;
        if (i < keys.length - 1 && gap) await new Promise(r => setTimeout(r, gap));
      }
      done && done();
    })();
  }
  const say = k => chain(Array.isArray(k) ? k : [k]);
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function hush() {
    chainId++; timers.forEach(clearTimeout); timers = [];
    try { player.pause(); } catch (e) {}
    if (pending) { const p = pending; pending = null; p(); }
  }
  return { load, say, chain, later, hush, has: k => have.has(k) };
})();
