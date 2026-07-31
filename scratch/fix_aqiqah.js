const fs = require('fs');
const filePath = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add aqiqah-1 to THEME_STYLES
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
  },`;

content = content.replace('"birthday-8": {', `${aqiqahThemeStyle}\n  "birthday-8": {`);

// 2. Add aqiqah-1 to theme config fallback
content = content.replace(
  'theme === "birthday-8" ? DEFAULT_CONFIG_THEME_8 :',
  'theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_4 :\n  theme === "birthday-8" ? DEFAULT_CONFIG_THEME_8 :'
);

// 3. Add aqiqah-1 to activeTheme mapping and TS union
content = content.replace(
  ': normalizedTheme === "birthday-8"',
  ': normalizedTheme === "aqiqah-1"\n                    ? "aqiqah-1"\n                    : normalizedTheme === "birthday-8"'
);

content = content.replace(
  '| "birthday-8";',
  '| "birthday-8" | "aqiqah-1";'
);

// 4. Add aqiqah-1 to line 4713 validation check
content = content.replace(
  '&& themeId !== "birthday-8"',
  '&& themeId !== "birthday-8" && themeId !== "aqiqah-1"'
);

// 5. Add aqiqah-1 to bank card / gift section condition checks
content = content.replace(
  '|| themeId === "birthday-8" || (invitationData && invitationData.gift_address)',
  '|| themeId === "birthday-8" || themeId === "aqiqah-1" || (invitationData && invitationData.gift_address)'
);

content = content.replace(
  '|| themeId === "birthday-8") && (',
  '|| themeId === "birthday-8" || themeId === "aqiqah-1") && ('
);

fs.writeFileSync(filePath, content);
console.log('Successfully updated page.tsx to support aqiqah-1 theme!');
