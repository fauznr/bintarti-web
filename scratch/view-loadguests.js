const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

let startLine = 0;
let endLine = 0;

lines.forEach((line, idx) => {
  if (line.includes("const loadGuests") || line.includes("function loadGuests")) {
    startLine = idx + 1;
  }
});

if (startLine > 0) {
  // Read next 50 lines to show the whole loadGuests function
  endLine = startLine + 50;
  console.log(`=== loadGuests function (Lines ${startLine} - ${endLine}) ===`);
  for (let i = startLine - 1; i < endLine; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log("loadGuests not found");
}
