/* Place value: shared by the games (index.html) and the printable sheets (print.html).
   Houses metaphor: each digit lives in a house; the house decides its worth; each house is
   worth 10x the house to its right. Always "Units", never "Ones". English uses commas (3,246).
   Hebrew pages are RTL, but every number and every row of houses stays LTR (Thousands on the left). */

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

/* Every clip key the module can ask for, with its text, per language. tools/voice.py renders these. */
function allClipTexts(lang) {
  const T = {}, S = STR[lang];
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
  for (const [k, v] of Object.entries(S.say)) T[lang + '_' + k] = v;
  return T;
}

/* ---------- Text, both languages ---------- */
const STR = {
  en: {
    dir: 'ltr', title: 'Place Value Houses', sub: 'Thousands, Hundreds, Tens and Units',
    place: { th: 'Thousands', hu: 'Hundreds', te: 'Tens', un: 'Units' },
    short: { th: 'Th', hu: 'H', te: 'T', un: 'U' },
    modes: { learn: '🏠 Houses', worth: '🔍 What is it worth?', build: '🧱 Build it', biggest: '🏆 Biggest number', swap: '🔄 Swap it', print: '🖨️ Print' },
    level: 'Level', levels: ['2 digits', '3 digits', '4 digits', 'With zeros'],
    learnIntro: 'Every digit lives in a <b>house</b>. The house it lives in decides what it is worth. Each house is worth <b>10 times</b> the house to its right.',
    learnHow: 'Tap ▲ and ▼ to change the digits. Watch the blocks and the worth change.',
    zeroTip: h => `The <b>0</b> keeps the ${h} house open, so the other digits stay in the right houses.`,
    expanded: 'Expanded form', inWords: 'In words', hear: '🔊 Hear it', newNum: '🎲 New number',
    worthQ: 'What is the coloured digit worth?', worthA: (d, h, v) => `The ${d} lives in the ${h} house, so it is worth ${v}.`,
    buildQ: 'Build this number in the houses:', check: 'Check ✓', reset: '↺ Start again',
    biggestQ: 'Make the <b>biggest</b> number with these digits', smallestQ: 'Make the <b>smallest</b> number with these digits',
    noZeroFirst: 'A number cannot start with 0, so the smallest digit that is not 0 goes first.',
    bigTip: 'Put the biggest digit in the biggest house.', smallTip: 'Put the smallest digit in the biggest house.',
    swapQ: 'Swap the two coloured digits. Does the number get bigger or smaller?', bigger: '⬆ Bigger', smaller: '⬇ Smaller',
    swapA: (d, a, b) => `The ${d} moved from the ${a} house to the ${b} house.`,
    undo: '↩ Undo', next: 'Next →', score: 'See my score →', again: 'Play again', of: 'out of',
    praise: ['Great job! 🎉', 'Super! 🌟', 'You got it! 💪', 'Brilliant! ✨'], almost: 'Almost! Look carefully:',
    end: [g => g === 10 ? 'Perfect score! +5 bonus stars.' : g >= 7 ? 'Really good!' : 'Good effort. Try again and it gets easier!'],
    nextMode: 'Next game →', voice: 'Voice by ElevenLabs', home: '← All games',
    say: {
      intro: 'Every digit lives in a house. The house decides what the digit is worth.',
      p0: 'Great job!', p1: 'Super!', p2: 'You got it!', p3: 'Brilliant!', almost: 'Almost! Look carefully.',
      worthQ: 'What is the coloured digit worth?', buildQ: 'Build this number.', biggestQ: 'Make the biggest number.',
      smallestQ: 'Make the smallest number.', swapQ: 'Does the number get bigger, or smaller?',
      bigger: 'It got bigger!', smaller: 'It got smaller!', done10: 'Perfect score! Well done!',
      th: 'thousands', hu: 'hundreds', te: 'tens', un: 'units',
    },
  },
  he: {
    dir: 'rtl', title: 'בתים של ערך המקום', sub: 'אלפים, מאות, עשרות ויחידות',
    place: { th: 'אלפים', hu: 'מאות', te: 'עשרות', un: 'יחידות' },
    short: { th: 'א', hu: 'מ', te: 'ע', un: 'י' },
    modes: { learn: '🏠 הבתים', worth: '🔍 כמה זה שווה?', build: '🧱 בנו את המספר', biggest: '🏆 המספר הגדול', swap: '🔄 החליפו', print: '🖨️ להדפסה' },
    level: 'רמה', levels: ['2 ספרות', '3 ספרות', '4 ספרות', 'עם אפסים'],
    learnIntro: 'כל ספרה גרה ב<b>בית</b>. הבית שבו היא גרה קובע כמה היא שווה. כל בית שווה <b>פי 10</b> מהבית שמימינו.',
    learnHow: 'לחצו ▲ ו־▼ כדי לשנות את הספרות. שימו לב איך הקוביות והערך משתנים.',
    zeroTip: h => `ה־<b>0</b> שומר על בית ה${h} פתוח, כך ששאר הספרות נשארות בבתים הנכונים.`,
    expanded: 'פירוק לפי ערך המקום', inWords: 'במילים', hear: '🔊 הקשיבו', newNum: '🎲 מספר חדש',
    worthQ: 'כמה שווה הספרה הצבועה?', worthA: (d, h, v) => `ה־${d} גרה בבית ה${h}, ולכן היא שווה ${v}.`,
    buildQ: 'בנו את המספר הזה בבתים:', check: 'בדיקה ✓', reset: '↺ מההתחלה',
    biggestQ: 'בנו את המספר <b>הגדול ביותר</b> מהספרות האלה', smallestQ: 'בנו את המספר <b>הקטן ביותר</b> מהספרות האלה',
    noZeroFirst: 'מספר לא יכול להתחיל ב־0, ולכן הספרה הקטנה ביותר שאינה 0 באה ראשונה.',
    bigTip: 'שימו את הספרה הגדולה ביותר בבית הגדול ביותר.', smallTip: 'שימו את הספרה הקטנה ביותר בבית הגדול ביותר.',
    swapQ: 'מחליפים את שתי הספרות הצבועות. המספר יגדל או יקטן?', bigger: '⬆ יגדל', smaller: '⬇ יקטן',
    swapA: (d, a, b) => `ה־${d} עברה מבית ה${a} לבית ה${b}.`,
    undo: '↩ ביטול', next: 'הבא ←', score: 'לתוצאה שלי ←', again: 'לשחק שוב', of: 'מתוך',
    praise: ['כל הכבוד! 🎉', 'מעולה! 🌟', 'הצלחת! 💪', 'מצוין! ✨'], almost: 'כמעט! הסתכלו טוב:',
    end: [g => g === 10 ? 'ציון מושלם! 5 כוכבי בונוס.' : g >= 7 ? 'יפה מאוד!' : 'ניסיון יפה. בפעם הבאה זה יהיה קל יותר!'],
    nextMode: 'למשחק הבא ←', voice: 'הקול: ElevenLabs', home: 'כל המשחקים →',
    say: {
      intro: 'כל ספרה גרה בבית. הבית קובע כמה הספרה שווה.',
      p0: 'כל הכבוד!', p1: 'מעולה!', p2: 'הצלחת!', p3: 'מצוין!', almost: 'כמעט! הסתכלו טוב.',
      worthQ: 'כמה שווה הספרה הצבועה?', buildQ: 'בנו את המספר.', biggestQ: 'בנו את המספר הגדול ביותר.',
      smallestQ: 'בנו את המספר הקטן ביותר.', swapQ: 'המספר יגדל, או יקטן?',
      bigger: 'הוא גדל!', smaller: 'הוא קטן!', done10: 'ציון מושלם! כל הכבוד!',
      th: 'אלפים', hu: 'מאות', te: 'עשרות', un: 'יחידות',
    },
  },
};

/* Language choice is remembered per device; ?lang=he|en overrides (handy for printing links) */
function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  const l = q === 'he' || q === 'en' ? q : store.get('pv-lang', 'en');
  return l === 'he' ? 'he' : 'en';
}
function applyLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = STR[lang].dir;
  store.set('pv-lang', lang);
}
/* Make it usable from Node too (tools/voice.py reads the clip list through `node -e`) */
if (typeof module !== 'undefined') module.exports = { allClipTexts, numWords, numClips, STR };
