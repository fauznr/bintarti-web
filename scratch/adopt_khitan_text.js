const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace all `isKhitan ?` with `(isKhitan || isAqiqah) ?` EXCEPT where we already replaced it in my previous script (which is around `isKhitan ? "Saka Niskala"` and etc. But wait, I used string replacement, so it's already `((isKhitan || isAqiqah) ? "Saka Niskala"`.
// Wait, `isKhitan ?` can be replaced globally! Because if it's already in an `isAqiqah ? A : isKhitan ? B : C`, changing it to `isAqiqah ? A : (isKhitan || isAqiqah) ? B : C` will just never hit the `isAqiqah` in the second check (since it's caught by the first). This is perfectly safe!

// Let's do a global replace for `isKhitan ?` -> `(isKhitan || isAqiqah) ?`
content = content.replace(/\bisKhitan \?/g, '(isKhitan || isAqiqah) ?');

fs.writeFileSync(pageFile, content);
console.log("Globally replaced isKhitan ? with (isKhitan || isAqiqah) ?");
