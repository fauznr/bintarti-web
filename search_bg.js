const fs = require('fs');
const content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
const lines = content.split('\n');
const searchTerms = ['rsvpBgUrl', 'closingPhotoUrl', 'ourMomentBgUrl', 'indo_prewed', 'indo_prewed_rsvp_1'];
lines.forEach((line, i) => {
  searchTerms.forEach(term => {
    if (line.includes(term)) {
      console.log('Line ' + (i + 1) + ': ' + line.trim());
    }
  });
});
