const fs = require('fs');
const lines = fs.readFileSync('src/app/sandbox-tema/[id]/page.tsx', 'utf8').replace(/\r\n/g, '\n').split('\n');
let foundIf = -1, foundCss = -1, foundComment = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('if (activeTheme === "khitan-9") {')) { foundIf = i; }
    if (lines[i].includes('css += `')) { foundCss = i; }
    if (lines[i].includes('/* Khitan-9 Space Theme HUD Overrides */')) { foundComment = i; break; }
}
console.log('If:', foundIf, 'Css:', foundCss, 'Comment:', foundComment);
