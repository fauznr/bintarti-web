const fs = require('fs');

let content = fs.readFileSync('src/data/katalog.ts', 'utf8');

// Replace Khitan demoUrls
content = content.replace(/demoUrl: "https:\/\/onlineundangan\.id\/bintarti-(khitan-\d+)\/"/g, 'demoUrl: "/sandbox-tema/$1"');
// Also replace birthday just in case? The user didn't mention birthday, only khitan.

fs.writeFileSync('src/data/katalog.ts', content);
console.log('Khitan demo URLs updated successfully.');
