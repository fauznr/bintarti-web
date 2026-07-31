const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/formulir/page.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('api/submit-form'));
if (idx !== -1) {
    console.log(lines.slice(idx - 25, idx + 5).join('\n'));
} else {
    console.log("Not found");
}
