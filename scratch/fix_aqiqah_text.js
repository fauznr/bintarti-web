const fs = require('fs');

const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replacements for Aqiqah text
const replacements = [
  {
    from: 'isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash"',
    to: 'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash"'
  },
  {
    from: 'isKhitan ? "Undangan Khitanan" : "To the Birthday of"',
    to: 'isAqiqah ? "Undangan Aqiqah" : isKhitan ? "Undangan Khitanan" : "To the Birthday of"'
  },
  {
    from: 'isKhitan ? "Walimatul Khitan" : "Birthday"',
    to: 'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "Birthday"'
  },
  {
    from: 'isKhitan ? "Walimatul Khitan" : "Birthday Party"',
    to: 'isAqiqah ? "Aqiqah" : isKhitan ? "Walimatul Khitan" : "Birthday Party"'
  },
  {
    from: 'isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights"',
    to: 'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights"'
  },
  {
    from: 'isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble"',
    to: 'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble"'
  },
  {
    from: '"Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan acara khitanan putra kami:"',
    to: 'isAqiqah ? "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan tasyakuran aqiqah putra/putri kami:" : "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan acara khitanan putra kami:"'
  },
  {
    from: 'isKhitan ? `Galeri Khitan ${idx + 1}` : `Birthday Gallery ${idx + 1}`',
    to: 'isAqiqah ? `Galeri Aqiqah ${idx + 1}` : isKhitan ? `Galeri Khitan ${idx + 1}` : `Birthday Gallery ${idx + 1}`'
  },
  {
    from: 'isKhitan ? "Khitan" : "Birthday"',
    to: 'isAqiqah ? "Aqiqah" : isKhitan ? "Khitan" : "Birthday"'
  },
  {
    from: 'isKhitan ? "Khitan" : "Birthday"', // sometimes used in analytics or types
    to: 'isAqiqah ? "Aqiqah" : isKhitan ? "Khitan" : "Birthday"'
  },
  {
    from: 'isKhitan ? "bg-white text-slate-800 border border-slate-200" : "text-white"',
    to: '(isKhitan || isAqiqah) ? "bg-white text-slate-800 border border-slate-200" : "text-white"'
  },
  {
    from: 'isKhitan ? "" : "bg-pink-500/90"',
    to: '(isKhitan || isAqiqah) ? "" : "bg-pink-500/90"'
  }
];

replacements.forEach(({from, to}) => {
  content = content.replace(new RegExp(from.replace(/[.*+?^$\{}[\]\(\)]/g, '\\$&'), 'g'), to);
});

fs.writeFileSync(pageFile, content);
console.log("Replaced text for Aqiqah!");
