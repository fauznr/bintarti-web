const fs = require('fs');
const filePath = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Move DEFAULT_CONFIG_THEME_AQIQAH_1 definition above getDefaultConfigForTheme
const aqiqahDef = `const DEFAULT_CONFIG_THEME_AQIQAH_1: ThemeConfig = {
  cover: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    customText: "Tasyakuran Aqiqah",
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["badge", "title", "divider", "nama", "parents", "button"]
  },
  profile: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    avatarScale: 100,
    avatarX: 0,
    avatarY: 0,
    ornaments: [],
    elementOrder: ["header", "avatar", "body", "bottom"]
  },
  turut: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body"]
  },
  checkin: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "qr", "button"]
  },
  event: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    buttonScale: 1.0,
    countdownScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "countdown", "location", "button"]
  },
  maps: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "mapframe", "button"]
  },
  gallery: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 5,
    right: 5,
    top: 10,
    bottom: 10,
    fontFamily: "Atma",
    fontColor: "#0284C7",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "grid"]
  },
  activities: {
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
    ornaments: [],
    elementOrder: ["header", "list"]
  },
  envelope: {
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
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body", "bank", "button"]
  },
  rsvp: {
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
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "form", "messages"]
  },
  closing: {
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
  },
  global: {
    musicUrl: "https://eehktxhhpsdffpwlxghm.supabase.co/storage/v1/object/public/invitation-assets/music/happy-birthday.mp3"
  }
};\n`;

// First remove any existing DEFAULT_CONFIG_THEME_AQIQAH_1 declaration
content = content.replace(/const DEFAULT_CONFIG_THEME_AQIQAH_1: ThemeConfig = \{[\s\S]*?\};\n/g, '');

// Place it right above function getDefaultConfigForTheme
content = content.replace(
  'function getDefaultConfigForTheme(theme: string): ThemeConfig {',
  `${aqiqahDef}\nfunction getDefaultConfigForTheme(theme: string): ThemeConfig {`
);

fs.writeFileSync(filePath, content);
console.log('Fixed hoisting for DEFAULT_CONFIG_THEME_AQIQAH_1!');
