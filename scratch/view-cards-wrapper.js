const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== Lines 1150 - 1180 ===");
for (let i = 1149; i < 1180; i++) {
  if (lines[i] !== undefined) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
