const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== Lines 720 - 820 ===");
for (let i = 719; i < 820; i++) {
  if (lines[i] !== undefined) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
