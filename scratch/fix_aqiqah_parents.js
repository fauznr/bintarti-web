const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Update line 4769 parentsName & childFullName defaults
content = content.replace(
  'const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : (isKhitan ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila" : "Bapak Hendra Pratama & Ibu Sari Dewi");',
  'const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : ((isKhitan || isAqiqah) ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila" : "Bapak Hendra Pratama & Ibu Sari Dewi");'
);

content = content.replace(
  'const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : (isKhitan ? "Saka Niskala" :',
  'const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : ((isKhitan || isAqiqah) ? "Saka Niskala" :'
);

content = content.replace(
  'const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : (isKhitan ? "Saka" :',
  'const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : ((isKhitan || isAqiqah) ? "Saka" :'
);

// 2. Update line 6950 in Profile section so isAqiqah renders the same parents / child order block as khitan-1
content = content.replace(
  '                {isKhitan ? (\n                  <>\n                    {(() => {\n                      const props = getTextProps("profile", "bottom"',
  '                {(isKhitan || isAqiqah) ? (\n                  <>\n                    {(() => {\n                      const props = getTextProps("profile", "bottom"'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated Aqiqah 1 parents & child profile info to match Khitan 1!');
