const fs = require('fs');
const files = [
  'Wedding1View.tsx',
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
  
  // Find and replace the footer block.
  // It could be `{/* 12. FOOTER */}` or `{/* FOOTER */}`
  const footerRegex = /\{\/\*\s*(?:12\.\s*)?FOOTER\s*\*\/\}\s*<footer className="pb-8 pt-4 text-center relative z-10 bg-transparent">\s*<p className="text-\[10px\] font-sans text-zinc-500 tracking-\[0\.2em\] uppercase">\s*bintarti\s*<\/p>\s*<\/footer>/g;

  if (footerRegex.test(content)) {
    const match = content.match(footerRegex)[0];
    const indent = match.match(/^\s*/)[0];
    const newFooter = `{/* FOOTER */}
${indent}<footer className="pb-8 pt-4 flex flex-col items-center justify-center relative z-10 bg-transparent opacity-80">
${indent}  <img src="/logo.png" alt="Bintarti" className="w-6 h-6 mb-1.5" />
${indent}  <p className="text-[10px] font-sans text-zinc-500 tracking-[0.2em] uppercase">
${indent}    bintarti
${indent}  </p>
${indent}</footer>`;
    
    content = content.replace(footerRegex, newFooter);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('No match found in ' + file);
  }
}
