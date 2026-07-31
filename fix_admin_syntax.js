const fs = require('fs');
const path = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/admin/page.tsx';
let c = fs.readFileSync(path, 'utf8');
c = c.replace(/return invitations\.filter\(item => \{\\n      if \(item\.fullName && item\.fullName\.includes\\\('Default Theme'\\\)\) return false;/g, `return invitations.filter(item => {\n      if (item.fullName && item.fullName.includes('Default Theme')) return false;`);
fs.writeFileSync(path, c);
