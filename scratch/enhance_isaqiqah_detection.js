const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace(
  'const isAqiqah = activeTheme === "aqiqah-1";',
  'const isAqiqah = activeTheme === "aqiqah-1" || (activeTheme && activeTheme.includes("aqiqah")) || (themeId && themeId.startsWith("aqiqah_")) || (invitationData && (invitationData.type === "Aqiqah" || (invitationData.theme && invitationData.theme.toLowerCase().includes("aqiqah"))));'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully enhanced isAqiqah detection in page.tsx!');
