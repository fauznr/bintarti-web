const fs = require('fs');
const path = 'src/components/wedding/Wedding2View.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '  // Toggle Audio\n  const toggleAudio = () => {';
const endStr = '  return (\n    <div className="min-h-screen';
const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
}

// Replace galleryImages with bgPhotos
content = content.replace(/galleryImages/g, 'bgPhotos');

fs.writeFileSync(path, content);
console.log("Deleted duplicated block and replaced galleryImages.");
