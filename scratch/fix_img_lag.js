const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// We want to add decoding="async" to all <img tags.

content = content.replace(/<img\s/g, '<img decoding="async" ');

fs.writeFileSync(pageFile, content);
console.log("Added decoding=async to all img tags to prevent scroll freeze!");
