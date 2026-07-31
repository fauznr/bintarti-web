const fs = require('fs');

const content = fs.readFileSync('src/app/sandbox-tema/[id]/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('id=') && (line.includes('turut') || line.includes('profile') || line.includes('event') || line.includes('maps') || line.includes('activities') || line.includes('gallery') || line.includes('rsvp') || line.includes('envelope') || line.includes('checkin') || line.includes('closing'))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
