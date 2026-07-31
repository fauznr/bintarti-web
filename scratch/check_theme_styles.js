const fs = require('fs');
const content = fs.readFileSync('src/app/sandbox-tema/[id]/page.tsx', 'utf8');
const start = content.indexOf('const THEME_STYLES');
const end = content.indexOf('const DEFAULT_CONFIG_THEME_KHITAN_1');
console.log(content.slice(start, end));
