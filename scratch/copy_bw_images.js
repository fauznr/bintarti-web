const fs = require('fs');
const path = require('path');

// 1. Copy generated images to public folder
const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4';
const publicDir = 'src/app/sandbox-tema/[id]/../../../../public'; // or absolute 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public'

const heroImg = path.join(brainDir, 'indo_bw_couple_hero_1784879174704.jpg');
const groomImg = path.join(brainDir, 'indo_bw_groom_1784879190165.jpg');
const brideImg = path.join(brainDir, 'indo_bw_bride_1784879201667.jpg');

const targetHero = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public/wedding-bw-hero.jpg';
const targetGroom = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public/wedding-bw-groom.jpg';
const targetBride = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/public/wedding-bw-bride.jpg';

fs.copyFileSync(heroImg, targetHero);
fs.copyFileSync(groomImg, targetGroom);
fs.copyFileSync(brideImg, targetBride);

console.log('Successfully copied monochrome couple images to public folder!');
