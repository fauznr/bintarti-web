const fs = require("fs");

const file = "src/app/cek-undangan/[id]/page.tsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

console.log("=== IMPORTS ===");
for (let i = 0; i < 40; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}

console.log("\n=== TABS OR NAVIGATION SECTIONS ===");
lines.forEach((line, idx) => {
  if (line.includes("const tabs") || line.includes("activeTab") || line.includes("setActiveTab") || line.includes("tamu") || line.includes("RSVP")) {
    if (line.length < 150) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  }
});
