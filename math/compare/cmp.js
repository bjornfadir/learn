/* Greater than / less than ("Hungry Crocodile"), shared by the game (index.html) and the sheets (print.html).
   Teaching: the crocodile's open mouth always eats the bigger number (so 7 > 3 and 3 < 7). To compare,
   line the numbers up in their place-value houses and start at the biggest house: the first house that
   differs decides. More houses (digits) always means a bigger number (3,046 > 346).
   Numbers, levels and spoken numbers come from shared/numbers.js. */

/* Pair kinds, weighted toward the classic mistakes:
   near   = same except one house (4,150 vs 4,180)
   swap   = two digits swapped (2,519 vs 2,591), catches "look at the digits, not their houses"
   length = different number of houses (3,046 vs 346), catches "the bigger first digit wins"
   equal  = the same number (only when "=" is an allowed answer) */
function makePair(level, rnd = Math.random, allowEqual = false) {
  const w = LEVELS[level - 1].digits, a = makeNumber(level, rnd), d = digitsOf(a, w);
  const r = rnd();
  let b;
  if (allowEqual && r < 0.12) b = a;
  else if (r < 0.40) b = makeNumber(level, rnd);
  else if (r < 0.70) {                                           // near: change one house
    const i = randInt(w > 1 ? 1 : 0, w - 1, rnd), e = [...d];
    do e[i] = randInt(0, 9, rnd); while (e[i] === d[i]);
    b = +e.join('');
  } else if (r < 0.88 && w > 1 && new Set(d).size > 1) {         // swap two different digits (not a 0 to the front)
    let i, j, t = 0;
    do { i = randInt(0, w - 2, rnd); j = randInt(i + 1, w - 1, rnd); t++; } while ((d[i] === d[j] || (i === 0 && d[j] === 0)) && t < 30);
    const e = [...d]; [e[i], e[j]] = [e[j], e[i]]; b = +e.join('');
  } else if (w > 2) {                                            // length: drop one digit, often a placeholder zero
    const z = d.indexOf(0, 1), k = z > 0 ? z : randInt(1, w - 1, rnd);
    b = +d.filter((_, i) => i !== k).join('');
  } else b = makeNumber(level, rnd);
  if (a === b && !allowEqual) b = a + (a % 10 === 9 ? -1 : 1);
  return rnd() < 0.5 ? [a, b] : [b, a];
}
const sym = (a, b) => a > b ? '>' : a < b ? '<' : '=';
/* Why one is bigger: { kind: 'len' | 'place' | 'eq', i: deciding column (in the wider width), w } */
function why(a, b) {
  const la = String(a).length, lb = String(b).length, w = Math.max(la, lb);
  if (a === b) return { kind: 'eq', w };
  if (la !== lb) return { kind: 'len', w, i: 0 };
  const da = digitsOf(a, w), db = digitsOf(b, w);
  return { kind: 'place', w, i: da.findIndex((x, k) => x !== db[k]) };
}

const CSTR = {
  en: {
    title: 'Hungry Crocodile', sub: 'Greater than, less than',
    place: { th: 'Thousands', hu: 'Hundreds', te: 'Tens', un: 'Units' },
    modes: { learn: '🐊 Learn', feed: '🍽️ Feed the crocodile', symbol: '⚖️ Pick the symbol', tf: '✅ True or false?', print: '🖨️ Print' },
    sym: { '>': 'is greater than ', '<': 'is less than ', '=': 'is equal to ' },   // Hebrew מ־/ל־ attach to the number, English needs the space
    learnIntro: 'The hungry crocodile always opens its mouth to eat the <b>bigger</b> number.',
    legend: { '<': 'less than', '>': 'greater than', '=': 'equal to' },
    learnHow: 'Line the numbers up in their houses. Start at the biggest house: the first house that is different decides.',
    step: '▶ Compare step by step', newPair: '🎲 New numbers', hear: '🔊 Hear it',
    stepSame: (p, x) => `${p}: ${x} and ${x} are the same. Look at the next house.`,
    whyLen: (big, small, nb, ns) => `${big} has ${nb} houses and ${small} has only ${ns}. More houses means a bigger number.`,
    whyPlace: (p, x, y) => `Start at the biggest house. The first house that is different is ${p}: ${x} is more than ${y}.`,
    whyEq: 'Every house is the same, so the numbers are equal.',
    feedBig: 'Feed the crocodile the <b>bigger</b> number!', feedSmall: 'Which number is <b>smaller</b>?',
    symbolQ: 'Which symbol goes in the middle?', tfQ: 'Is this true?', yes: '✅ True', no: '❌ False',
    tfFix: 'The true sentence is:',
    say: {
      intro: 'The hungry crocodile always eats the bigger number!',
      gt: 'is greater than', lt: 'is less than', eq: 'The numbers are equal.',
      feedBig: 'Feed the crocodile the bigger number!', feedSmall: 'Which number is smaller?',
      symbolQ: 'Which symbol goes in the middle?', tfQ: 'Is this true?', true: 'True!', false: 'False!',
      p0: 'Great job!', p1: 'Super!', p2: 'You got it!', p3: 'Brilliant!', almost: 'Almost! Look carefully.', done10: 'Perfect score! Well done!',
    },
  },
  he: {
    title: 'התנין הרעב', sub: 'גדול מ־, קטן מ־',
    place: { th: 'אלפים', hu: 'מאות', te: 'עשרות', un: 'יחידות' },
    modes: { learn: '🐊 לומדים', feed: '🍽️ האכילו את התנין', symbol: '⚖️ בחרו סימן', tf: '✅ נכון או לא?', print: '🖨️ להדפסה' },
    sym: { '>': 'גדול מ־', '<': 'קטן מ־', '=': 'שווה ל־' },
    learnIntro: 'התנין הרעב תמיד פותח את הפה כדי לאכול את המספר <b>הגדול</b> יותר.',
    legend: { '<': 'קטן מ־', '>': 'גדול מ־', '=': 'שווה ל־' },
    learnHow: 'מסדרים את המספרים בבתים. מתחילים מהבית הגדול ביותר: הבית הראשון שבו יש הבדל קובע.',
    step: '▶ משווים צעד אחר צעד', newPair: '🎲 מספרים חדשים', hear: '🔊 הקשיבו',
    stepSame: (p, x) => `${p}: ${x} ו־${x} זהים. עוברים לבית הבא.`,
    whyLen: (big, small, nb, ns) => `ל־${big} יש ${nb} בתים ול־${small} רק ${ns}. יותר בתים פירושו מספר גדול יותר.`,
    whyPlace: (p, x, y) => `מתחילים מהבית הגדול ביותר. הבית הראשון שבו יש הבדל הוא ה${p}: ${x} גדול מ־${y}.`,
    whyEq: 'כל הבתים זהים, ולכן המספרים שווים.',
    feedBig: 'האכילו את התנין במספר <b>הגדול</b> יותר!', feedSmall: 'איזה מספר <b>קטן</b> יותר?',
    symbolQ: 'איזה סימן מתאים באמצע?', tfQ: 'זה נכון?', yes: '✅ נכון', no: '❌ לא נכון',
    tfFix: 'המשפט הנכון הוא:',
    say: {
      intro: 'התנין הרעב תמיד אוכל את המספר הגדול יותר!',
      gt: 'גדול מאשר', lt: 'קטן מאשר', eq: 'המספרים שווים.',
      feedBig: 'האכילו את התנין במספר הגדול יותר!', feedSmall: 'איזה מספר קטן יותר?',
      symbolQ: 'איזה סימן מתאים באמצע?', tfQ: 'זה נכון?', true: 'נכון!', false: 'לא נכון!',
      p0: 'כל הכבוד!', p1: 'מעולה!', p2: 'הצלחת!', p3: 'מצוין!', almost: 'כמעט! הסתכלו טוב.', done10: 'ציון מושלם! כל הכבוד!',
    },
  },
};
/* Module phrase clips (numbers come from shared/numbers/<lang>/). clips.js writes these for tools/voice.py. */
function allClipTexts(lang) {
  const T = {};
  for (const [k, v] of Object.entries(CSTR[lang].say)) T[lang + '_' + k] = v;
  return T;
}
/* Spoken sentence: "4,105 is less than 4,150" = number clips + gt/lt + number clips; equal = one phrase */
const sentenceClips = (a, b, lang) => a === b ? [lang + '_eq'] :
  [...numClips(a, lang), lang + (a > b ? '_gt' : '_lt'), ...numClips(b, lang)];

/* The crocodile: an open jaw drawn as the symbol itself, mouth toward the bigger number.
   '>' opens to the left, '<' to the right; '=' is two flat bars (mouth closed). */
function croc(s, size = 64) {
  if (s === '=') return `<svg class="croc" viewBox="0 0 100 80" width="${size}" height="${size * .8}" aria-label="=" role="img"><rect x="14" y="22" width="72" height="12" rx="6" fill="var(--croc)"/><rect x="14" y="46" width="72" height="12" rx="6" fill="var(--croc)"/></svg>`;
  const flip = s === '<' ? ' transform="translate(100 0) scale(-1 1)"' : '';
  return `<svg class="croc" viewBox="0 0 100 80" width="${size}" height="${size * .8}" aria-label="${s}" role="img"><g${flip}>
    <path d="M10 8 L90 40 L10 72" fill="none" stroke="var(--croc)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 20 l5 9 l5 -5 l5 9 l5 -5 l5 9 l5 -5 l5 9" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 60 l5 -9 l5 5 l5 -9 l5 5 l5 -9 l5 5 l5 -9" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="74" cy="27" r="6" fill="#fff"/><circle cx="75" cy="27" r="3" fill="#173a3a"/></g></svg>`;
}
if (typeof module !== 'undefined') module.exports = { allClipTexts, CSTR };
