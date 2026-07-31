const fs = require("fs");

const content = fs.readFileSync("src/app/cek-undangan/[id]/page.tsx", "utf8");
const lines = content.split("\n");

let startLine = 0;
let endLine = 0;

lines.forEach((line, idx) => {
  if (line.includes("Ucapan, Doa & RSVP Tamu (WordPress Webhook integration)")) {
    startLine = idx + 1;
  }
  if (startLine > 0 && endLine === 0 && line.includes("guests.length > 0 && (") && idx > startLine) {
    endLine = idx; // stops right before the next block
  }
});

console.log(`Comments card starts at L${startLine} and ends around L${endLine}`);
if (startLine > 0 && endLine > startLine) {
  for (let i = startLine - 1; i < endLine; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
