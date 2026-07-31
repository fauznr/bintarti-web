const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// 1. Fix interface
file = file.replace(
  /useState<\{id: string, category: string, label: string\}\[\]>\(\[\]\);/,
  'useState<{id: string, category: string, label: string, url: string}[]>([]);'
);

// 2. Fix parsed mapping
file = file.replace(
  /return \{ id: m\.id, category: cat, label: title \};/,
  'return { id: m.id, category: cat, label: title, url: m.url };'
);

// 3. Revert WA template for WhatsApp message if it shows URL, wait, the WhatsApp message currently shows formData.music which is now the URL!
// Let's modify the WhatsApp template in formulir/page.tsx so that it shows the label instead of the URL, if possible. But the label is not easily available if formData.music only stores the URL.
// Actually, Bintarti CS seeing the URL is totally fine! The URL is all they need. 
// However, earlier in the form: `const musicText = formData.music === "Lainnya" ? formData.customMusic : formData.music;`
// We'll leave it as is, it'll just print the URL in WhatsApp.

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Fixed music catalog URL property in formulir');
