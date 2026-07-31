const fs = require('fs');
const content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('activeTabGift === "envelope"')) {
    for(let j = i; j < i + 40; j++) {
      console.log('Line ' + (j + 1) + ': ' + lines[j].trim());
    }
  }
});
