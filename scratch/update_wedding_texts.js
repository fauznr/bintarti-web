const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Bank names update
content = content.replace(
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {(isKhitan || isAqiqah) ? "Adrian Mahendra" : "Hendra Pratama"}</p>',
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {isWedding ? "Yoshua Pratama" : (isKhitan || isAqiqah) ? "Adrian Mahendra" : "Hendra Pratama"}</p>'
);

content = content.replace(
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {(isKhitan || isAqiqah) ? "Natasha Salsabila" : "Sari Dewi"}</p>',
  '<p className="text-[8px] text-slate-500 font-bold">a.n. {isWedding ? "Jessica Salsabila" : (isKhitan || isAqiqah) ? "Natasha Salsabila" : "Sari Dewi"}</p>'
);

// 2. Closing section signature & text for isWedding
content = content.replace(
  '{layoutConfig.closing.bottomText !== undefined ? layoutConfig.closing.bottomText : ((isKhitan || isAqiqah) ? "Kel. Bapak Adrian Mahendra & Ibu Natasha Salsabila." : "Bapak Hendra Pratama & Ibu Sari Dewi")}',
  '{layoutConfig.closing.bottomText !== undefined ? layoutConfig.closing.bottomText : (isWedding ? "Kami yang berbahagia, Yoshua & Jessica" : (isKhitan || isAqiqah) ? "Kel. Bapak Adrian Mahendra & Ibu Natasha Salsabila." : "Bapak Hendra Pratama & Ibu Sari Dewi")}'
);

// 3. Activities bottom text for isWedding
content = content.replace(
  '{layoutConfig.activities.bottomText !== undefined ? layoutConfig.activities.bottomText : ((isKhitan || isAqiqah) ? "Semoga menjadi anak yang sholeh, berbakti kepada orang tua, agama, nusa, dan bangsa." : "Exciting Birthday Games and an Amazing Magic Bubble Show Await!")}',
  '{layoutConfig.activities.bottomText !== undefined ? layoutConfig.activities.bottomText : (isWedding ? "Semoga Allah SWT memberkahi pernikahan kami dan melimpahkan kebahagiaan serta mawaddah warahmah." : (isKhitan || isAqiqah) ? "Semoga menjadi anak yang sholeh, berbakti kepada orang tua, agama, nusa, dan bangsa." : "Exciting Birthday Games and an Amazing Magic Bubble Show Await!")}'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated bank names and closing texts for Wedding!');
