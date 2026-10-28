/* Numbers shared by every maths game: places and levels (1-9,999), number generation, numbers in
   words (English British "and", Hebrew feminine counting forms with the joining ו on the last element),
   and the clip keys that speak any number by chaining short clips from shared/numbers/<lang>/.
   Needs shared/core.js (randInt). Uses commas for thousands in both languages (3,246). */
const PLACES = ['th', 'hu', 'te', 'un'];               // left to right; CSS colours --th --hu --te --un
const PLACE_VAL = { th: 1000, hu: 100, te: 10, un: 1 };

/* Levels: 2-digit -> 3-digit -> 4-digit -> 4-digit with zeros */
const LEVELS = [
  { id: 1, digits: 2 }, { id: 2, digits: 3 }, { id: 3, digits: 4 }, { id: 4, digits: 4, zeros: true },
];
function makeNumber(level, rnd = Math.random) {
  const L = LEVELS[level - 1], n = L.digits;
  const d = [randInt(1, 9, rnd)];
  for (let i = 1; i < n; i++) d.push(randInt(L.zeros ? 0 : 1, 9, rnd));
  if (L.zeros && !d.slice(1).includes(0)) d[randInt(1, n - 1, rnd)] = 0;   // at least one placeholder zero
  if (L.zeros && rnd() < 0.3) d[randInt(1, n - 1, rnd)] = 0;              // sometimes two (4,005; 7,010)
  return +d.join('');
}
/* digits of n padded to `width` houses, e.g. digitsOf(46,4) -> [0,0,4,6] */
const digitsOf = (n, width) => String(n).padStart(width, '0').split('').map(Number);
const housesFor = width => PLACES.slice(4 - width);
const fmt = n => n.toLocaleString('en-US');           // commas in both languages (Israel uses them too)

/* ---------- Words ---------- */
const EN_1_19 = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const en99 = n => n < 20 ? EN_1_19[n] : EN_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + EN_1_19[n % 10] : '');
/* British style, which goes with "Units": 3,246 = three thousand, two hundred and forty-six */
function enParts(n) {
  const t = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, r = n % 100, p = [];
  if (t) p.push({ k: 'en_t' + t, w: EN_1_19[t] + ' thousand' });
  if (h) p.push({ k: 'en_h' + h, w: EN_1_19[h] + ' hundred' });
  if (r) { if (t || h) p.push({ k: 'en_and', w: 'and' }); p.push({ k: 'en_n' + r, w: en99(r) }); }
  return p;
}
/* Hebrew counting forms (feminine). "ו" joins the last element: 3,246 שלושת אלפים מאתיים ארבעים ושש,
   3,006 שלושת אלפים ושש, 3,200 שלושת אלפים ומאתיים. A compound 21-99 already carries its own ו. */
const HE_1_19 = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה'];
const HE_TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const HE_H = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];
const HE_T = ['', 'אלף', 'אלפיים', 'שלושת אלפים', 'ארבעת אלפים', 'חמשת אלפים', 'ששת אלפים', 'שבעת אלפים', 'שמונת אלפים', 'תשעת אלפים'];
const he99 = n => n < 20 ? HE_1_19[n] : HE_TENS[Math.floor(n / 10)] + (n % 10 ? ' ו' + HE_1_19[n % 10] : '');
const heSingle = n => n < 20 || n % 10 === 0;          // one word, so it takes the joining ו itself
function heParts(n) {
  const t = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, r = n % 100, p = [];
  if (t) p.push({ k: 'he_t' + t, w: HE_T[t] });
  if (h) p.push({ k: 'he_h' + h, w: HE_H[h] });
  if (r) p.push({ k: 'he_n' + r, w: he99(r) });
  const last = p[p.length - 1];
  if (p.length > 1 && (last.k.startsWith('he_h') || heSingle(r))) { last.k = 'he_v' + last.k.slice(3); last.w = 'ו' + last.w; }
  return p;
}
const numParts = (n, lang) => n === 0 ? [{ k: lang + '_zero', w: lang === 'he' ? 'אפס' : 'zero' }] : (lang === 'he' ? heParts(n) : enParts(n));
const numWords = (n, lang) => { const p = numParts(n, lang); return lang === 'en' ? p.map(x => x.w).join(' ').replace(' thousand ', ' thousand, ').replace(/thousand, and/, 'thousand and') : p.map(x => x.w).join(' '); };
const numClips = (n, lang) => numParts(n, lang).map(x => x.k);

/* Every number-piece clip, with its text. shared/numbers/clips.js writes these for tools/voice.py. */
function numberClipTexts(lang) {
  const T = {};
  for (let n = 1; n <= 99; n++) T[lang + '_n' + n] = lang === 'he' ? he99(n) : en99(n);
  for (let d = 1; d <= 9; d++) {
    T[lang + '_h' + d] = lang === 'he' ? HE_H[d] : EN_1_19[d] + ' hundred';
    T[lang + '_t' + d] = lang === 'he' ? HE_T[d] : EN_1_19[d] + ' thousand';
  }
  if (lang === 'he') {
    for (let n = 1; n <= 99; n++) if (heSingle(n)) T['he_vn' + n] = 'ו' + he99(n);
    for (let d = 1; d <= 9; d++) T['he_vh' + d] = 'ו' + HE_H[d];
  } else T.en_and = 'and';
  T[lang + '_zero'] = lang === 'he' ? 'אפס' : 'zero';
  return T;
}
if (typeof module !== 'undefined') module.exports = { numWords, numClips, numberClipTexts, makeNumber, digitsOf, LEVELS };
