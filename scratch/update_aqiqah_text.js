const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Update isKhitanMode assignments
content = content.replace(
  /const isKhitanMode = themeId === "khitan-1" \|\| themeId === "khitan-2" \|\| \(activeTheme && \(activeTheme\.includes\("khitan"\) \|\| activeTheme === "khitan-1"\)\);/g,
  'const isKhitanMode = themeId === "khitan-1" || themeId === "khitan-2" || themeId === "aqiqah-1" || (activeTheme && (activeTheme.includes("khitan") || activeTheme === "khitan-1" || activeTheme === "aqiqah-1"));'
);

// Update childFullName, parentsName, childNickname
content = content.replace(
  /\(isKhitan \? "Saka Niskala"/g,
  '((isKhitan || isAqiqah) ? "Saka Niskala"'
);
content = content.replace(
  /\(isKhitan \? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"/g,
  '((isKhitan || isAqiqah) ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"'
);
content = content.replace(
  /\(isKhitan \? "Saka"/g,
  '((isKhitan || isAqiqah) ? "Saka"'
);

// Update photos: For Aqiqah, if there's no kid.png in aqiqah-1, we can just use the khitan-1 kid.png as a placeholder.
// wait, the expression is isKhitan ? `/templates/\${activeTheme}/kid.png` : ...
content = content.replace(
  /\(isKhitan \? `\/templates\/\$\{activeTheme\}\/kid.png`/g,
  '(isKhitan ? `/templates/${activeTheme}/kid.png` : isAqiqah ? `/templates/khitan-1/kid.png`'
);
content = content.replace(
  /\(isKhitan \? `\/templates\/\$\{activeTheme\}\/kid2.png`/g,
  '(isKhitan ? `/templates/${activeTheme}/kid2.png` : isAqiqah ? `/templates/khitan-1/kid2.png`'
);

fs.writeFileSync(pageFile, content);
console.log("Updated Aqiqah text/isian to adopt from Khitan");
