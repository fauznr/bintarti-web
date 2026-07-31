const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4';
const publicDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public';

const imgMap = [
  { src: path.join(brainDir, 'wedding2_hero_1784890824280.jpg'), target: path.join(publicDir, 'wedding2-bg1.jpg') },
  { src: path.join(brainDir, 'wedding2_groom_1784890843247.jpg'), target: path.join(publicDir, 'wedding2-bg2.jpg') },
  { src: path.join(brainDir, 'wedding2_bride_1784890857596.jpg'), target: path.join(publicDir, 'wedding2-bg3.jpg') },
  { src: path.join(brainDir, 'wedding2_couple4_1784890874102.jpg'), target: path.join(publicDir, 'wedding2-bg4.jpg') },
];

imgMap.forEach(item => {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.target);
  }
});

console.log('Successfully copied all Wedding 2 Adea theme photos to public directory!');
