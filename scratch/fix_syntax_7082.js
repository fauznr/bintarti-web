const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace(') : {(isKhitan || isAqiqah) ? (', ') : (isKhitan || isAqiqah) ? (');

fs.writeFileSync(pageFile, content);
console.log('Successfully fixed syntax on line 7082 in page.tsx!');
