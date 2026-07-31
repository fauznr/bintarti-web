const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Line 5088 check
content = content.replace(
  '&& themeId !== "aqiqah-1" && !isCustomInvitation)',
  '&& themeId !== "aqiqah-1" && themeId !== "wedding-1" && !isCustomInvitation)'
);

// 2. Line 8140 check
content = content.replace(
  '|| themeId === "aqiqah-1" || (invitationData && invitationData.gift_address))',
  '|| themeId === "aqiqah-1" || themeId === "wedding-1" || (invitationData && invitationData.gift_address))'
);

// 3. Line 8151 check
content = content.replace(
  '|| themeId === "aqiqah-1") && (',
  '|| themeId === "aqiqah-1" || themeId === "wedding-1") && ('
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated themeId checks for wedding-1 in page.tsx!');
