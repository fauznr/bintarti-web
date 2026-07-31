const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

let startLine = 0;
lines.forEach((line, idx) => {
  if (line.includes("return (") && idx > 550 && startLine === 0) {
    startLine = idx + 1;
  }
});

console.log(`=== main return block starts at L${startLine} ===`);
for (let i = startLine - 1; i < startLine + 180; i++) {
  if (lines[i] !== undefined) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
