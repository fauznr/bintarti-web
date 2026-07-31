const fs = require('fs');
const path = require('path');

const mediaSourceDir = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69';
const targetDir = 'public/templates/birthday-2';

const filesToCopy = [
  { src: 'media__1782392187013.jpg', dest: 'bg-profile.jpg' },
  { src: 'media__1782392187063.jpg', dest: 'bg-plain.jpg' },
  { src: 'media__1782392187073.jpg', dest: 'bg-event.jpg' }
];

filesToCopy.forEach(f => {
  const srcPath = path.join(mediaSourceDir, f.src);
  const destPath = path.join(targetDir, f.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${f.src} to ${destPath} successfully.`);
  } else {
    console.error(`Source file ${srcPath} does not exist!`);
  }
});
