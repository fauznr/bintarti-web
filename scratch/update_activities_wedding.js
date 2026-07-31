const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace(
  '{!(isKhitan || isAqiqah) && activitiesPhoto',
  '{!(isKhitan || isAqiqah || isWedding) && activitiesPhoto'
);

content = content.replace(
  'if (isKhitan || isAqiqah) {\n                            const timeProps = getTextProps("activities", "badge", atmaFont, "#000000");',
  'if (isKhitan || isAqiqah || isWedding) {\n                            const timeProps = getTextProps("activities", "badge", atmaFont, "#000000");'
);

content = content.replace(
  'className={`${props.className} text-[11px] font-bold leading-relaxed whitespace-pre-line text-center p-2.5 ${(isKhitan || isAqiqah) ? \'text-black\' : \'bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl\'}`}',
  'className={`${props.className} text-[11px] font-bold leading-relaxed whitespace-pre-line text-center p-2.5 ${(isKhitan || isAqiqah || isWedding) ? \'text-black\' : \'bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl\'}`}'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated activities section conditionals for Wedding!');
