const fs = require('fs');
const lines = fs.readFileSync('src/app/sandbox-tema/[id]/recovered_page.tsx', 'utf8').split('\n');
let cssStart = -1, cssEnd = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('if (activeTheme === "khitan-9") {') && lines[i+1] && lines[i+1].includes('/* Khitan-9 Space Theme HUD Overrides */')) {
        cssStart = i;
    }
    if (cssStart !== -1 && i > cssStart && lines[i] === '    }') {
        cssEnd = i;
        break;
    }
}
console.log('Start:', cssStart, 'End:', cssEnd);
console.log('Next line:', lines[cssEnd + 1]);
