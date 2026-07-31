const fs = require('fs');
const content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
const lines = content.split('\n');
let inGallery = false;
lines.forEach((line, i) => {
  if (line.includes('id="gallery"')) { inGallery = true; }
  if (inGallery) {
    console.log('Line ' + (i + 1) + ': ' + line.trim());
  }
  if (inGallery && line.includes('</section>')) { inGallery = false; }
});
