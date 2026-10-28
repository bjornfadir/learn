/* Small helpers shared by every game: shuffling, seeded randomness, safe storage, stars, progress bar.
   Storage keys are per game ("<game>-stars") so the portal can show each game's stars;
   everything is per device and per browser, with no accounts. */
const shuffle = (a, rnd = Math.random) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* mulberry32: seedable PRNG, so a printed worksheet can be regenerated from its seed */
const seeded = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const randInt = (lo, hi, rnd = Math.random) => lo + Math.floor(rnd() * (hi - lo + 1));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
function starCounter(key, el) {
  let n = +store.get(key, 0) || 0;
  const show = () => { el.textContent = '⭐ ' + n; };
  show();
  return { add(k = 1) { n += k; show(); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); store.set(key, n); } };
}
const progressBar = (n, idx, results) => '<div class="progress">' + Array.from({ length: n }, (_, i) => `<i class="${i < idx ? (results[i] ? 'ok' : 'bad') : i === idx ? 'now' : ''}"></i>`).join('') + '</div>';
