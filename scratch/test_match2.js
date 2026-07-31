const fs = require('fs');
const lines = fs.readFileSync('src/app/sandbox-tema/[id]/recovered_page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => { 
    if (l.includes('if (activeTheme === "khitan-9") {')) console.log(i + ': ' + l.trim()); 
    if (l.includes('Khitan-9 Space Theme HUD Overrides')) console.log(i + ': ' + l.trim()); 
});
