const fs = require('fs');
const files = [
  'Wedding2View.tsx', 
  'Wedding3View.tsx', 
  'Wedding4View.tsx', 
  'Wedding5View.tsx', 
  'Wedding6View.tsx', 
  'Wedding7View.tsx', 
  'Wedding8View.tsx'
];

for (const file of files) {
  const path = 'src/components/wedding/' + file;
  let content = fs.readFileSync(path, 'utf8');
  
  // Find the QR Code Modal comment to use as an anchor
  const lines = content.split('\n');
  const index = lines.findIndex(l => l.includes('{/* QR Code Fullscreen Modal */}'));
  
  if (index !== -1) {
    const originalLine = lines[index];
    const match = originalLine.match(/^(\s*)/);
    const indent = match ? match[1] : '';
    
    // Replace if not already replaced
    if (!content.includes('bintarti</p>')) {
      const footer = 
`${indent}{/* FOOTER */}
${indent}<footer className="pb-8 pt-4 text-center relative z-10 bg-transparent">
${indent}  <p className="text-[10px] font-sans text-zinc-500 tracking-[0.2em] uppercase">
${indent}    bintarti
${indent}  </p>
${indent}</footer>

${originalLine}`;

      lines[index] = footer;
      fs.writeFileSync(path, lines.join('\n'), 'utf8');
      console.log('Added to ' + file);
    } else {
      console.log('Already exists in ' + file);
    }
  } else {
    console.log('Could not find anchor in ' + file);
  }
}
