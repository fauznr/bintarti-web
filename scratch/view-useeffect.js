const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

let effectCount = 0;
let braceCount = 0;
let recording = false;
let startLine = 0;

console.log("=== useEffect BLOCKS ===");
lines.forEach((line, idx) => {
  if (line.includes("useEffect(") && !recording) {
    recording = true;
    startLine = idx + 1;
    braceCount = 0;
    console.log(`\n--- useEffect #${++effectCount} starting at L${startLine} ---`);
  }
  
  if (recording) {
    console.log(`${idx + 1}: ${line}`);
    // Count braces to find the end of useEffect
    for (let char of line) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
    }
    // Simple heuristic: if we match parentheses and braces or see ); at the end of the block
    if (line.includes("}, [") || line.includes("});") || (braceCount <= 0 && idx > startLine)) {
      recording = false;
    }
  }
});
