/* Shared voice player for every game.
   Clips are MP3 files in a folder with an index.json listing the keys that exist:
     Voice.load('audio/en')  ->  audio/en/index.json + audio/en/<key>.mp3
   One shared <audio> element is reused, because iOS only lets an element play outside a tap
   once a tap has played it, and chained clips run after awaits.
   say(key | [keys]) plays in order; chain(keys, onEach(i), done, gap) adds a per-clip callback.
   A new call cancels the one playing. Missing keys are skipped silently.
   hush() stops speech and cancels delayed auto-play queued with later(); call it on every screen change.
   load() can be called again (language switch): only the latest call's list is used, and playback
   waits for it, so a slow earlier fetch can't leave the other language's clips loaded. */
const Voice = (() => {
  const player = new Audio();
  let dir = '', have = new Set(), chainId = 0, pending = null, timers = [], loadId = 0, loading = null;
  function load(d) {
    const id = ++loadId; dir = d; have = new Set();
    // no-cache revalidates (cheap 304), so a list that 404'd before a deploy isn't reused from cache
    loading = fetch(d + '/index.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : []).catch(() => [])
      .then(keys => { if (id === loadId) { have = new Set(keys); loading = null; } });
    return loading;
  }
  async function play(k) {
    while (loading) await loading;   // loop: a newer load() may start while we wait
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
