const fs = require('fs');
const filePath = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add aqiqah-1 to THEME_STYLES (specifically after birthday-8 block inside THEME_STYLES)
const aqiqahThemeStyle = `  "aqiqah-1": {
    accentColor: "#0284C7",
    mainBg: "#F0F9FF",
    mainTextColor: "#0C4A6E",
    galleryBg: "#E0F2FE",
    galleryTitleColor: "#0369A1",
    badgeBgClass: "bg-sky-100/90 border-sky-200/50 text-sky-800",
    btnAccentClass: "bg-sky-600 hover:bg-sky-700 text-white",
    btnGradientClass: "from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white",
    avatarBorderClass: "border-sky-300",
    bubbleColor: "#38BDF8"
  }`;

const target = `  "birthday-8": {
    accentColor: "#000000",
    mainBg: "#EAEBE7",
    mainTextColor: "#000000",
    galleryBg: "#EAEBE7",
    galleryTitleColor: "#000000",
    badgeBgClass: "bg-yellow-100/90 border-yellow-300 text-yellow-800",
    btnAccentClass: "bg-[#EF8D20] hover:bg-[#D77C1B] text-white",
    btnGradientClass: "from-[#EF8D20] to-[#FFAB40] hover:from-[#D77C1B] hover:to-[#FF9800] text-white",
    avatarBorderClass: "border-[#EF8D20]",
    bubbleColor: "#EF8D20"
  }`;

content = content.replace(target, `${target},\n${aqiqahThemeStyle}`);

// 2. Add fallback to themeStyle declaration
content = content.replace(
  'const themeStyle = THEME_STYLES[activeTheme];',
  'const themeStyle = THEME_STYLES[activeTheme] || THEME_STYLES["birthday-1"];'
);

fs.writeFileSync(filePath, content);
console.log('Successfully updated THEME_STYLES and added fallback for themeStyle!');
