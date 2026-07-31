const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Revert specific color classes for Aqiqah so it doesn't get white text on light background
content = content.replace(
  /\(isKhitan \|\| isAqiqah\) \? "text-slate-200" : "text-slate-600"/g,
  'isKhitan ? "text-slate-200" : "text-slate-600"'
);

// Any other white text?
// In RSVP: `isKhitan || isAqiqah ? "text-slate-200" : "text-slate-600"` (handled above)
// In RSVP fields: `isKhitan || isAqiqah ? "text-black placeholder:text-slate-450 font-bold" : "text-slate-900"` (this is fine, text-black is dark)
// In label htmlFor="name": `isKhitan || isAqiqah ? "text-black" : "text-slate-500"` (this is fine, text-black is dark)
// What about `a.n. Adrian Mahendra`? It uses text-slate-500.

fs.writeFileSync(pageFile, content);
console.log("Reverted white text for Aqiqah");
