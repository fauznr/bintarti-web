const fs = require('fs');
const content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('BgUrl')) {
    console.log('Line ' + (i + 1) + ': ' + line.trim());
  }
});
