const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== HEADINGS AND COMPONENT BLOCKS ===");
lines.forEach((line, idx) => {
  // Print h1, h2, h3 and tab-related triggers
  if (line.includes("<h1") || line.includes("<h2") || line.includes("<h3") || line.includes("activeTab") || line.includes("tab === ") || line.includes("useState(")) {
    if (line.length < 150) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  }
});
