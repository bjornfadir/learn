// Writes shared/numbers/<lang>/clips.json (every number piece) for tools/voice.py:
//   node shared/numbers/clips.js && python3 tools/voice.py shared/numbers/en/clips.json shared/numbers/en --lang en
//   (same for he). Already rendered: only re-run after changing number words in shared/numbers.js.
global.randInt = () => 0;
const fs = require('fs'), path = require('path');
const { numberClipTexts } = require('../numbers.js');
for (const lang of ['en', 'he']) {
  const d = path.join(__dirname, lang); fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'clips.json'), JSON.stringify(numberClipTexts(lang)));
}
