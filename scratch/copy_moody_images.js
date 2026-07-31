const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4';
const publicDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public';

const imgMap = [
  { src: path.join(brainDir, 'cinematic_moody_hero_1784890198153.jpg'), target: path.join(publicDir, 'wedding-moody-bg1.jpg') },
  { src: path.join(brainDir, 'cinematic_moody_groom_1784890217281.jpg'), target: path.join(publicDir, 'wedding-moody-bg2.jpg') },
  { src: path.join(brainDir, 'cinematic_moody_bride_1784890232654.jpg'), target: path.join(publicDir, 'wedding-moody-bg3.jpg') },
  { src: path.join(brainDir, 'cinematic_moody_couple_4_1784890249495.jpg'), target: path.join(publicDir, 'wedding-moody-bg4.jpg') },
];

imgMap.forEach(item => {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.target);
  }
});

console.log('Successfully copied all Cinematic Moody photos to public directory!');
