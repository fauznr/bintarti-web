const fs = require('fs');
let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

file = file.replace(
  'const closingPhotoUrl = weddingNotes.closingPhotoUrl || fallbackHero;',
  'const closingPhotoUrl = weddingNotes.closingPhotoUrl || fallbackHero;\n  const saveTheDateBgUrl = weddingNotes.saveTheDateBgUrl || fallbackHero;'
);

file = file.replace(
  'src="/indo_prewed_couple_2_1785092595152.jpg"\n                alt="Save The Date Background"',
  'src={saveTheDateBgUrl}\n                alt="Save The Date Background"'
);

file = file.replace(
  'src="/indo_prewed_closing_1_1785093445446.jpg"\n              alt="Closing Background"',
  'src={closingPhotoUrl}\n              alt="Closing Background"'
);

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Updated Wedding6View.tsx');
