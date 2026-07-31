const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4';
const publicDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public';

const imgMap = [
  { src: path.join(brainDir, 'indo_bw_couple_hero_1784879174704.jpg'), target: path.join(publicDir, 'wedding-bw-bg1.jpg') },
  { src: path.join(brainDir, 'indo_bw_groom_1784879190165.jpg'), target: path.join(publicDir, 'wedding-bw-bg2.jpg') },
  { src: path.join(brainDir, 'indo_bw_bride_1784879201667.jpg'), target: path.join(publicDir, 'wedding-bw-bg3.jpg') },
  { src: path.join(brainDir, 'indo_bw_couple_4_1784879911517.jpg'), target: path.join(publicDir, 'wedding-bw-bg4.jpg') },
  { src: path.join(brainDir, 'indo_bw_couple_5_1784879926500.jpg'), target: path.join(publicDir, 'wedding-bw-bg5.jpg') },
];

imgMap.forEach(item => {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.target);
  }
});

console.log('Successfully copied all 5 monochrome background images to public folder!');
