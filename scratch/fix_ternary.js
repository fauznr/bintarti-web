const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace ternary
content = content.replace(/\$\{activeTheme === "khitan-9" \? "border-l-\[6px\] border-l-cyan-400" : "border-l-\[6px\] border-l-white"\}/g, 'border-l-[6px] border-l-white');

fs.writeFileSync(pageFile, content);
console.log('Fixed ternary error');
