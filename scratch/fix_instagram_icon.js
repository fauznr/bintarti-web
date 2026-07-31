const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// Replace import Instagram from lucide-react
content = content.replace('  Instagram,\n', '');

// Replace <Instagram className="w-3 h-3 text-[#D4AF37]" /> with SVG
const instagramSvg = `<svg className="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;

content = content.replaceAll('<Instagram className="w-3 h-3 text-[#D4AF37]" />', instagramSvg);

fs.writeFileSync(viewFile, content);
console.log('Successfully replaced Instagram icon in Wedding1View.tsx!');
