const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add DEFAULT_CONFIG_THEME_AQIQAH_1 definition before getDefaultConfigForTheme or after DEFAULT_CONFIG_THEME_KHITAN_8
const aqiqah1Config = `const DEFAULT_CONFIG_THEME_AQIQAH_1: ThemeConfig = {
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

content = content.replace(
  'theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_4 :',
  'theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_AQIQAH_1 :'
);

if (!content.includes('DEFAULT_CONFIG_THEME_AQIQAH_1')) {
  content = content.replace(
    'const DEFAULT_CONFIG_THEME_KHITAN_8: ThemeConfig =',
    `${aqiqah1Config}\nconst DEFAULT_CONFIG_THEME_KHITAN_8: ThemeConfig =`
  );
}

// 2. Define isAqiqah variable
if (!content.includes('const isAqiqah')) {
  content = content.replace(
    'const isKhitan = ',
    'const isAqiqah = activeTheme === "aqiqah-1";\n  const isKhitan = '
  );
}

// 3. Update Text Fallbacks for Aqiqah
content = content.replace(
  'isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash"',
  'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash"'
);

content = content.replace(
  'isKhitan ? "Undangan Khitanan" : "To the Birthday of"',
  'isAqiqah ? "Undangan Aqiqah" : isKhitan ? "Undangan Khitanan" : "To the Birthday of"'
);

content = content.replace(
  'isKhitan ? "Walimatul Khitan" : "Birthday"',
  'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "Birthday"'
);

content = content.replace(
  'isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights"',
  'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights"'
);

content = content.replace(
  'isKhitan ? "🎨 Rangkaian Acara" : "🎨 Activities & Highlights"',
  'isAqiqah ? "🎨 Rangkaian Acara" : isKhitan ? "🎨 Rangkaian Acara" : "🎨 Activities & Highlights"'
);

content = content.replace(
  'isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble"',
  'isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble"'
);

fs.writeFileSync(pageFile, content);
console.log('Fully restored Aqiqah-1 theme config and texts!');
