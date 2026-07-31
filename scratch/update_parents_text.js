const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const startIndex = content.indexOf('export const DEFAULT_CONFIG_THEME_AQIQAH_1');
const endIndex = content.indexOf('function getDefaultConfigForTheme', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  let configBlock = content.substring(startIndex, endIndex);
  configBlock = configBlock.replace(
    /"parentsText": "Kel\. Bapak Adrian Mahendra & Ibu Natasha Salsabila\."/,
    '"parentsText": "Kel. Bapak Budi Santoso & Ibu Ratna Sari."'
  );
  content = content.substring(0, startIndex) + configBlock + content.substring(endIndex);
  fs.writeFileSync(pageFile, content);
  console.log("Replaced parentsText in AQIQAH_1 config");
}
