const fs = require('fs');

let content = fs.readFileSync('src/data/katalog.ts', 'utf8');

// Replace all occurrences of /sandbox-tema/ in demoUrl with /
content = content.replace(/demoUrl: "\/sandbox-tema\/(.*?)"/g, 'demoUrl: "/$1"');

fs.writeFileSync('src/data/katalog.ts', content);
console.log('Successfully shortened demo URLs in katalog.ts.');
