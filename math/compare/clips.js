// Writes audio/<lang>/clips.json (this module's phrases; numbers are in shared/numbers/) for tools/voice.py:
//   node clips.js && python3 ../../tools/voice.py audio/en/clips.json audio/en --lang en
//                 && python3 ../../tools/voice.py audio/he/clips.json audio/he --lang he
const fs = require('fs');
const { allClipTexts } = require('./cmp.js');
for (const lang of ['en', 'he']) {
  fs.mkdirSync(`audio/${lang}`, { recursive: true });
  fs.writeFileSync(`audio/${lang}/clips.json`, JSON.stringify(allClipTexts(lang), null, 0));
  const t = allClipTexts(lang); console.log(lang, Object.keys(t).length, 'clips', Object.values(t).join('').length, 'chars');
}
