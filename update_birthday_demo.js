const fs = require('fs');

let content = fs.readFileSync('src/data/katalog.ts', 'utf8');

// Replace Birthday demoUrls
content = content.replace(/demoUrl: "https:\/\/onlineundangan\.id\/bintarti-(birthday-\d+)\/"/g, 'demoUrl: "/sandbox-tema/$1"');

fs.writeFileSync('src/data/katalog.ts', content);
console.log('Birthday demo URLs updated successfully.');
