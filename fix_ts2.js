const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');
let lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
  // Fix initial state duplicate titles
  if (lines[i].includes('akadTitle: "",')) {
    lines.splice(i, 1);
    i--; // Recheck current index
  }
  if (lines[i].includes('resepsiTitle: "",')) {
    lines.splice(i, 1);
    i--;
  }
}

// Re-inject properly
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('akadLocation: "",')) {
    const spaces = lines[i].match(/^\s*/)[0];
    lines.splice(i, 0, spaces + 'akadTitle: "",');
    i++;
  }
  if (lines[i].includes('resepsiLocation: "",')) {
    const spaces = lines[i].match(/^\s*/)[0];
    lines.splice(i, 0, spaces + 'resepsiTitle: "",');
    i++;
  }
}

// Fix dresscodes which also probably suffered the same fate
// Let's remove all dresscodes array blocks and re-insert them above loveStoryList
let newLines = [];
let insideDresscodes = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('dresscodes: [')) {
    insideDresscodes = true;
    continue;
  }
  if (insideDresscodes) {
    if (lines[i].includes('],') && lines[i+1] && lines[i+1].includes('loveStoryList: [')) {
      insideDresscodes = false;
    }
    continue;
  }
  newLines.push(lines[i]);
}

for (let i = 0; i < newLines.length; i++) {
  if (newLines[i].includes('loveStoryList: [')) {
    const spaces = newLines[i].match(/^\s*/)[0];
    const dresscodeStr = 
`${spaces}dresscodes: [
${spaces}  { name: "Black", hex: "#171717" },
${spaces}  { name: "Charcoal", hex: "#737373" },
${spaces}  { name: "Silver", hex: "#D4D4D4" },
${spaces}  { name: "White", hex: "#FFFFFF" }
${spaces}],`;
    newLines.splice(i, 0, dresscodeStr);
    i++;
  }
}

fs.writeFileSync('src/app/formulir/page.tsx', newLines.join('\n'));
console.log('Fixed typescript errors completely');
