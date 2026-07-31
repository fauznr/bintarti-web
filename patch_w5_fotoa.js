const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

file = file.replace(
  /weddingNotes\?\.heroPhotoUrl \|\| "\/wedding5-hero\.jpg"/g,
  'invitationData?.child_photo_url || weddingNotes?.heroPhotoUrl || "/wedding5-hero.jpg"'
);

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Fixed Foto A mapping in Wedding5View");
