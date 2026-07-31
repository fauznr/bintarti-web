const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Update elementOrder in DEFAULT_CONFIG_THEME_AQIQAH_1 closing section
const oldClosingConfig = `  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    avatarScale: 100,
    ornaments: [],
    elementOrder: ["avatar", "header", "body"]
  }`;

const newClosingConfig = `  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    avatarScale: 100,
    ornaments: [],
    elementOrder: ["avatar", "header", "body", "parents", "bottom"]
  }`;

content = content.replace(oldClosingConfig, newClosingConfig);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated closing elementOrder in DEFAULT_CONFIG_THEME_AQIQAH_1 to include parents and bottom!');
