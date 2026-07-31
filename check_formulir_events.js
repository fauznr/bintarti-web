const fs = require('fs');
const content = fs.readFileSync('src/app/formulir/page.tsx', 'utf-8');
const lines = content.split('\n');
const searchTerms = ['akadTitle', 'akadDate', 'akadTime', 'akadLocation', 'akadGmaps', 'resepsiTitle', 'resepsiDate', 'resepsiTime', 'resepsiLocation', 'resepsiGmaps', 'event_date', 'event_time', 'event_location'];
lines.forEach((line, i) => {
  searchTerms.forEach(term => {
    if (line.includes(term)) {
      console.log('Line ' + (i + 1) + ': ' + line.trim());
    }
  });
});
