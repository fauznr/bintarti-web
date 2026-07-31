const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

console.log("=== LAYOUT HIERARCHY ===");
for (let i = 735; i < 1200; i++) {
  const line = lines[i];
  if (line === undefined) break;
  if (line.includes("Kelola Penerima Undangan Dashboard") || line.includes("{/*") || line.includes("Dashboard Analytics") || line.includes("Log Kehadiran Tamu") || line.includes("<div") || line.includes("</div")) {
    if (line.trim().startsWith("<div") || line.trim().startsWith("</div") || line.includes("{/*")) {
      // Print first and last characters and some context
      console.log(`${i + 1}: ${line}`);
    }
  }
}
