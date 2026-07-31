const fs = require('fs');
const content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
const lines = content.split('\n');
const searchTerms = ['akadTitle', 'akadDateStr', 'akadTimeStr', 'akadLocation', 'akadGmaps', 'resepsiTitle', 'resepsiDateStr', 'resepsiTimeStr', 'eventLocation', 'eventAddress', 'mapsLink'];
lines.forEach((line, i) => {
  if (i > 50 && i < 300) {
    searchTerms.forEach(term => {
      if (line.includes(term)) {
        console.log('Line ' + (i + 1) + ': ' + line.trim());
      }
    });
  }
});
