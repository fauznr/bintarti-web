const fs = require('fs');

let file = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Show Tahun for Wedding 5
file = file.replace(
  /<div className=\{\`grid \$\{selectedInvitation\.theme === "Wedding 1" \? "grid-cols-2" : "grid-cols-1"\} gap-3 mb-3\`\}>/g,
  '<div className={`grid ${(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 5") ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-3`}>'
);

file = file.replace(
  /\{selectedInvitation\.theme === "Wedding 1" && \(/g,
  '{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 5") && ('
);

fs.writeFileSync('src/app/admin/page.tsx', file);
console.log("Admin adjustments applied!");
