const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const badThemeStylesType = `const THEME_STYLES: Record<string, {
  "wedding-1": {
    accentColor: "#C5A059",
    mainBg: "#FAF8F5",
    mainTextColor: "#1E293B",
    galleryBg: "#F3EFEA",
    galleryTitleColor: "#C5A059",
    badgeBgClass: "bg-[#1E293B] text-amber-200 border border-[#C5A059]/40",
    btnAccentClass: "bg-[#C5A059] hover:bg-[#B38F48] text-white",
    btnGradientClass: "from-[#C5A059] via-[#D4AF37] to-[#9A7B38] text-white",
    avatarBorderClass: "border-[#C5A059]",
    bubbleColor: "#C5A059"
  },
  accentColor: string;
  mainBg: string;
  mainTextColor: string;
  galleryBg: string;
  galleryTitleColor: string;
  badgeBgClass: string;
  btnAccentClass: string;
  btnGradientClass: string;
  avatarBorderClass: string;
  bubbleColor: string;
}> = {
  "khitan-1": {`;

const fixedThemeStyles = `const THEME_STYLES: Record<string, {
  accentColor: string;
  mainBg: string;
  mainTextColor: string;
  galleryBg: string;
  galleryTitleColor: string;
  badgeBgClass: string;
  btnAccentClass: string;
  btnGradientClass: string;
  avatarBorderClass: string;
  bubbleColor: string;
}> = {
  "wedding-1": {
    accentColor: "#C5A059",
    mainBg: "#FAF8F5",
    mainTextColor: "#1E293B",
    galleryBg: "#F3EFEA",
    galleryTitleColor: "#C5A059",
    badgeBgClass: "bg-[#1E293B] text-amber-200 border border-[#C5A059]/40",
    btnAccentClass: "bg-[#C5A059] hover:bg-[#B38F48] text-white",
    btnGradientClass: "from-[#C5A059] via-[#D4AF37] to-[#9A7B38] text-white",
    avatarBorderClass: "border-[#C5A059]",
    bubbleColor: "#C5A059"
  },
  "khitan-1": {`;

if (content.includes(badThemeStylesType)) {
  content = content.replace(badThemeStylesType, fixedThemeStyles);
  fs.writeFileSync(pageFile, content);
  console.log('Successfully fixed THEME_STYLES structure in page.tsx!');
} else {
  console.log('Target string not found, checking current content...');
}
