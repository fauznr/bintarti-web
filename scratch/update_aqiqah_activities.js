const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Line 7349: Hide birthday photo frame for isAqiqah as well
content = content.replace(
  '{!isKhitan && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && (',
  '{!(isKhitan || isAqiqah) && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && ('
);

// 2. Line 7375: Body text styling for isAqiqah
content = content.replace(
  '${isKhitan ? \'text-black\' : \'bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl\'}',
  '${(isKhitan || isAqiqah) ? \'text-black\' : \'bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl\'}'
);

// 3. Line 7396: Schedule line item card for isAqiqah like isKhitan
content = content.replace(
  'if (isKhitan) {\n                            const timeProps = getTextProps("activities", "badge", atmaFont, "#000000");',
  'if (isKhitan || isAqiqah) {\n                            const timeProps = getTextProps("activities", "badge", atmaFont, "#000000");'
);

// 4. Line 7489: Hide birthday photo frame when no schedule lines
content = content.replace(
  '{!isKhitan && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && (\n                      <div \n                        {...(() => {\n                          const p = getFixedElementProps("activities", "avatar", "avatar", "");',
  '{!(isKhitan || isAqiqah) && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && (\n                      <div \n                        {...(() => {\n                          const p = getFixedElementProps("activities", "avatar", "avatar", "");'
);

// 5. Line 7525: Doa / bottom text fallback for isAqiqah like isKhitan
content = content.replace(
  ': (isKhitan ? "Semoga menjadi anak yang sholeh, berbakti kepada orang tua, agama, nusa, dan bangsa." : "Exciting Birthday Games and an Amazing Magic Bubble Show Await!")}',
  ': ((isKhitan || isAqiqah) ? "Semoga menjadi anak yang sholeh, berbakti kepada orang tua, agama, nusa, dan bangsa." : "Exciting Birthday Games and an Amazing Magic Bubble Show Await!")}'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated Aqiqah 1 activities section to use Khitan theme style!');
