const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// 1. Hide photoStory for Wedding 5
file = file.replace(
  /\{\(formData\.theme !== "Wedding 1" && formData\.theme !== "Wedding 4"\) && \(<>/,
  '{(formData.theme !== "Wedding 1" && formData.theme !== "Wedding 4" && formData.theme !== "Wedding 5") && (<>'
);

// 2. Show Tahun for Wedding 5
file = file.replace(
  /<div className=\{\`grid \$\{formData\.theme === "Wedding 1" \? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"\} gap-2\.5\`\}>/g,
  '<div className={`grid ${(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"} gap-2.5`}>'
);

file = file.replace(
  /\{formData\.theme === "Wedding 1" && \(/g,
  '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") && ('
);

file = file.replace(
  /<div className=\{formData\.theme === "Wedding 1" \? "sm:col-span-2" : ""\}>/g,
  '<div className={(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") ? "sm:col-span-2" : ""}>'
);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log("Formulir adjustments applied!");
