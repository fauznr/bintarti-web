const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

// We search backwards from line 1472 to find opening curly braces/parentheses that match
let count = 0;
for (let i = 1471; i >= 0; i--) {
  const line = lines[i];
  if (line.includes("}")) count++;
  if (line.includes("{")) count--;
  if (line.includes("({") || line.includes("&& (") || line.includes("? (")) {
    console.log(`Potential matching start at L${i + 1}: ${line.trim()}`);
  }
}
