const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace('if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "header"', 'if (isKhitan || isAqiqah || isWedding) {\n                    const props = getTextProps("closing", "header"');
content = content.replace('if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "body"', 'if (isKhitan || isAqiqah || isWedding) {\n                    const props = getTextProps("closing", "body"');
content = content.replace('if ((isKhitan || isAqiqah) && layoutConfig.closing.hideBody !== true)', 'if ((isKhitan || isAqiqah || isWedding) && layoutConfig.closing.hideBody !== true)');
content = content.replace('if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "bottom"', 'if (isKhitan || isAqiqah || isWedding) {\n                    const props = getTextProps("closing", "bottom"');

fs.writeFileSync(pageFile, content);
console.log('Successfully updated closing section conditionals for Wedding!');
