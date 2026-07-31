const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

const badBlock = `  
  const eventDateStr = akadDateStr;
  const eventLocation = akadLocation;
  const eventAddress = "Detail alamat..."; // Provide fallback
  const mapsLink = akadGmaps;`;

file = file.replace(badBlock, '');

file = file.replace(
  'const resepsiGmaps = weddingNotes.resepsiGmaps || akadGmaps;',
  'const resepsiGmaps = weddingNotes.resepsiGmaps || akadGmaps;' + '\n' + badBlock
);

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Fixed block-scoped variable usage');
