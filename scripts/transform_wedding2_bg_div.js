const fs = require('fs');
let code = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

const slideShowStart = code.indexOf('{bgPhotos.map((src: string, idx: number) => (');
const overlayStart = code.indexOf('<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30', slideShowStart);

if (slideShowStart !== -1 && overlayStart !== -1) {
  const replacement = `<div 
                className="absolute inset-0 bg-cover bg-center saturate-[0.9] contrast-[1.05] brightness-[0.75]"
                style={{ backgroundImage: \`url('\${coverPhoto}')\` }}
              />
            `;
  code = code.substring(0, slideShowStart) + replacement + code.substring(overlayStart);
}

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', code);
console.log('Successfully updated background div to be static');
