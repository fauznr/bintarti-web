const fs = require('fs');
const crypto = require('crypto');

function getMd5(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

const filesToCompare = [
  {
    new: 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69\\media__1782392187013.jpg',
    old: 'public/templates/birthday-2/bg-profile.jpg',
    name: 'bg-profile.jpg'
  },
  {
    new: 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69\\media__1782392187063.jpg',
    old: 'public/templates/birthday-2/bg-plain.jpg',
    name: 'bg-plain.jpg'
  },
  {
    new: 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69\\media__1782392187073.jpg',
    old: 'public/templates/birthday-2/bg-event.jpg',
    name: 'bg-event.jpg'
  }
];

filesToCompare.forEach(f => {
  const hashNew = getMd5(f.new);
  const hashOld = getMd5(f.old);
  console.log(`${f.name}:`);
  console.log(`  New (Uploaded): ${hashNew}`);
  console.log(`  Old (Current):  ${hashOld}`);
  console.log(`  Identical?     ${hashNew === hashOld ? 'YES' : 'NO'}`);
});
