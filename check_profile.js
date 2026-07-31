const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/sandbox-tema/[id]/page.tsx', 'utf8').split('\n');
const pIdx = lines.findIndex(l => l.includes('id="profile-section"'));
if (pIdx !== -1) {
    console.log(lines.slice(pIdx, pIdx + 120).join('\n'));
} else {
    console.log("Not found");
}
