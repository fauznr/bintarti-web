const fs = require('fs');

const w1 = fs.readFileSync('src/components/wedding/Wedding1View.tsx', 'utf8');
const w2 = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

const w1Start = w1.indexOf('  const toggleAudio');
const w1End = w1.indexOf('  return (', w1Start);
const block = w1.substring(w1Start, w1End);

const w2End = w2.indexOf('  return (\n    <div className="min-h-screen');

const newW2 = w2.substring(0, w2End) + block + w2.substring(w2End);

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', newW2);
console.log("Restored toggleAudio and RSVP block.");
