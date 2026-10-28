/* Place value: shared by the games (index.html) and the printable sheets (print.html).
   Houses metaphor: each digit lives in a house; the house decides its worth; each house is
   worth 10x the house to its right. Always "Units", never "Ones". English uses commas (3,246).
   Hebrew pages are RTL, but every number and every row of houses stays LTR (Thousands on the left). */

/* Module phrase clips (numbers come from shared/numbers/<lang>/). clips.js writes these for tools/voice.py. */
function allClipTexts(lang) {
  const T = {};
  for (const [k, v] of Object.entries(STR[lang].say)) T[lang + '_' + k] = v;
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

/* Make it usable from Node too (tools/voice.py reads the clip list through `node -e`) */
if (typeof module !== 'undefined') module.exports = { allClipTexts, STR };
