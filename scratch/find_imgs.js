const fs = require('fs');
const code = fs.readFileSync('src/app/sandbox-tema/[id]/page.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('<img') || line.includes('<Image')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
