const fs = require('fs');
const content = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = content.split('\n');
for (const l of lines) {
  if (l.includes('"step_index":290,')) {
    fs.writeFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/scratch/step290.json', l);
    console.log('Saved step 290');
    break;
  }
}
