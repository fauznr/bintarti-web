const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== BLOCK TRACE (Lines 1400 - 1480) ===");
for (let i = 1399; i < 1480; i++) {
  const line = lines[i];
  let trace = "";
  if (line.includes("{") || line.includes("}") || line.includes("(") || line.includes(")")) {
    trace = ` [contains braces/parens]`;
  }
  console.log(`${i + 1}: ${line.trim()}${trace}`);
}
