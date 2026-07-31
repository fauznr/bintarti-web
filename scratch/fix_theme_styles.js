const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const aqiqahThemeStyle = `
  "aqiqah-1": {
    accentColor: "#1E40AF",
    mainBg: "#EFF6FF",
    mainTextColor: "#1E3A8A",
    galleryBg: "#DBEAFE",
    galleryTitleColor: "#1E3A8A",
    badgeBgClass: "bg-blue-600",
    btnAccentClass: "bg-blue-500",
    btnGradientClass: "from-blue-500 to-blue-700",
    avatarBorderClass: "border-blue-300",
    bubbleColor: "#93C5FD",
  },
`;

content = content.replace(
  '}> = {',
  '}> = {' + aqiqahThemeStyle
);

fs.writeFileSync(pageFile, content);
console.log("Added aqiqah-1 to THEME_STYLES!");
