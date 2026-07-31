const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Remove bodyText === undefined check so parents always shows in Closing for Khitan and Aqiqah
content = content.replace(
  'if ((isKhitan || isAqiqah) && layoutConfig.closing.hideBody !== true && layoutConfig.closing.bodyText === undefined) {',
  'if ((isKhitan || isAqiqah) && layoutConfig.closing.hideBody !== true) {'
);

// 2. Fix bank recipient name fallbacks for Aqiqah
content = content.replace(
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {isKhitan ? "Adrian Mahendra" : "Hendra Pratama"}</p>',
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {(isKhitan || isAqiqah) ? "Adrian Mahendra" : "Hendra Pratama"}</p>'
);

content = content.replace(
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {isKhitan ? "Natasha Salsabila" : "Sari Dewi"}</p>',
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {(isKhitan || isAqiqah) ? "Natasha Salsabila" : "Sari Dewi"}</p>'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully synchronized parents name and bank recipient names for Aqiqah 1!');
