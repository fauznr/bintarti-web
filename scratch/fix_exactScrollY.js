const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace('let animationFrameId: number;', 'let animationFrameId: number;\n    let exactScrollY: number | null = null;');

fs.writeFileSync(pageFile, content);
console.log('Fixed exactScrollY');
