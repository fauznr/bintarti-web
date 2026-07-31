const fs = require('fs');

// 1. Fix Wedding 4 YouTube redefinition
let w4 = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');
w4 = w4.replace(
  /const youtubeVideo\s*=\s*weddingNotes\?\.youtubeVideo \|\| null;\s*const getYoutubeEmbedId = \([\s\S]*?const youtubeVideo\s*=\s*getYoutubeEmbedId\(weddingNotes\?\.youtubeVideo\) \|\| null;\s*/,
  'const youtubeVideo   = weddingNotes?.youtubeVideo || null;\n  '
);
fs.writeFileSync('src/components/wedding/Wedding4View.tsx', w4);

// 2. Fix WhatsApp Template (remove giftAddress)
let formPage = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');
formPage = formPage.replace(
  /text \+= `• Alamat Penerima Kado:\\n\$\{formData\.giftAddress \|\| "-"}\\n\\n`;\n\s*/,
  ''
);
fs.writeFileSync('src/app/formulir/page.tsx', formPage);

console.log('Fixed syntax and removed gift address from WA template');
