const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== MAIN RENDERING SECTIONS ===");
lines.forEach((line, idx) => {
  // Let's look for tags that define main cards or sections, e.g. <div or headings
  if (line.includes("<h2") || line.includes("<h3") || line.includes("<h4") || line.includes("title=") || line.includes("label=")) {
    if (line.trim().length > 0 && line.trim().length < 160 && !line.includes("svg") && !line.includes("path")) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  }
});
