const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1. Fix galleryImages array
file = file.replace(
  /const galleryImages = \(invitationData\?\.gallery_images && Array\.isArray\(invitationData\.gallery_images\) && invitationData\.gallery_images\.length > 0\)\n\s*\? invitationData\.gallery_images\n\s*: \[\n\n\s*\/\/ Dynamic Variables/,
  'const galleryImages = (invitationData?.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0)\n    ? invitationData.gallery_images\n    : [];\n\n  // Dynamic Variables'
);

// 2. Fix the broken HTML tag
file = file.replace(
  /v>\n\s*<\/section>/,
  '</section>'
);

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Syntax errors fixed!");
