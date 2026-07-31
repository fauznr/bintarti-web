const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/sandbox-tema/[id]/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.includes("onScroll=") || l.includes("scroll") && l.includes("EventListener")) {
        console.log("LINE", i+1, l.trim());
    }
});
