const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/sandbox-tema/[id]/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('supabase.from(')) {
    console.log(i + 1, l.trim());
  }
});
