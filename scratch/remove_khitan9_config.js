const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// The block starts at `const DEFAULT_CONFIG_THEME_KHITAN_9: ThemeConfig = {`
// and ends where the next variable starts, which is likely `const DEFAULT_CONFIG_THEME_AQIQAH_1: ThemeConfig = {` or something similar.
// Or we can just use a regex matching up to the next `const DEFAULT_CONFIG_THEME_`.

const khitan9ConfigRegex = /const DEFAULT_CONFIG_THEME_KHITAN_9: ThemeConfig = \{[\s\S]*?\};\n/g;
content = content.replace(khitan9ConfigRegex, '');

fs.writeFileSync(pageFile, content);
console.log('Removed DEFAULT_CONFIG_THEME_KHITAN_9 block');
