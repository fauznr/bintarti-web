const fs = require('fs');
let code = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

const slideShowStart = code.indexOf('{bgPhotos.map((src, idx) => (');
const overlayStart = code.indexOf('{/* Dark Overlay for Readability */}', slideShowStart);

if (slideShowStart !== -1 && overlayStart !== -1) {
  const replacement = `<Image 
          src={coverPhoto} 
          alt="Wedding Background" 
          fill 
          className="object-cover opacity-80" 
          priority
        />
        `;
  code = code.substring(0, slideShowStart) + replacement + code.substring(overlayStart);
}

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', code);
console.log('Successfully updated background to be static');
