const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

function showLines(startLine, endLine) {
  console.log(`\n=== Lines ${startLine} - ${endLine} ===`);
  for (let i = startLine - 1; i < endLine; i++) {
    if (lines[i] !== undefined) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
}

showLines(1110, 1130);
showLines(1170, 1195);
showLines(1405, 1425);
