const fs = require('fs');

const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const aqiqah1Config = `
export const DEFAULT_CONFIG_THEME_AQIQAH_1: ThemeConfig = {
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
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
    fontColor: "#1E40AF",
    fontScale: 1.0,
    avatarScale: 100,
    ornaments: [],
    elementOrder: ["avatar", "header", "body"]
  },
  global: {
    musicUrl: "https://eehktxhhpsdffpwlxghm.supabase.co/storage/v1/object/public/invitation-assets/music/happy-birthday.mp3"
  }
};
`;

// 1. Insert DEFAULT_CONFIG_THEME_AQIQAH_1 before function getDefaultConfigForTheme
content = content.replace(
  'function getDefaultConfigForTheme(theme: string): ThemeConfig {',
  aqiqah1Config + '\nfunction getDefaultConfigForTheme(theme: string): ThemeConfig {'
);

// 2. Add to defaultForTheme mapping
content = content.replace(
  'theme === "khitan-9" ? DEFAULT_CONFIG_THEME_KHITAN_9 :',
  'theme === "khitan-9" ? DEFAULT_CONFIG_THEME_KHITAN_9 :\n    theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_AQIQAH_1 :'
);

// 3. Add to globalOverrides
const overrideAqiqah = `
    "aqiqah-1": {
      cover: "/templates/aqiqah-1/bg-cover.jpg",
      profile: "/templates/aqiqah-1/bg-sections.jpg",
      turut: "/templates/aqiqah-1/bg-sections.jpg",
      event: "/templates/aqiqah-1/bg-corners.jpg",
      maps: "/templates/aqiqah-1/bg-sections.jpg",
      activities: "/templates/aqiqah-1/bg-corners.jpg",
      gallery: "/templates/aqiqah-1/bg-sections.jpg",
      rsvp: "/templates/aqiqah-1/bg-sections.jpg",
      envelope: "/templates/aqiqah-1/bg-sections.jpg",
      checkin: "/templates/aqiqah-1/bg-sections.jpg",
      closing: "/templates/aqiqah-1/bg-sections.jpg",
      default: "/templates/aqiqah-1/bg-corners.jpg"
    },
`;
content = content.replace(
  'const globalOverrides: any = {',
  'const globalOverrides: any = {' + overrideAqiqah
);

// 4. Update the normalizedTheme fallback
content = content.replace(
  '| "khitan-9" | "birthday-1"',
  '| "khitan-9" | "aqiqah-1" | "birthday-1"'
);
content = content.replace(
  '| "birthday-8";',
  '| "birthday-8" | "aqiqah-1";'
);
content = content.replace(
  ' ? "birthday-2" \n                              : "birthday-1"',
  ' ? "birthday-2" \n                              : normalizedTheme === "aqiqah-1" ? "aqiqah-1" : "birthday-1"'
);

// 5. Update isAqiqah definition (if not exists, create it)
if (!content.includes('const isAqiqah')) {
  content = content.replace(
    'const isKhitan = ',
    'const isAqiqah = activeTheme === "aqiqah-1";\n  const isKhitan = '
  );
} else {
  content = content.replace(
    'const isAqiqah = ',
    'const isAqiqah = activeTheme === "aqiqah-1" || '
  );
}

// 6. Update `activeTheme === "birthday-8"` logic everywhere where theme limits appear?
// Let's replace `!isKhitan && !isCustomInvitation` with `!isKhitan && !isAqiqah && !isCustomInvitation` where appropriate, OR just add `themeId === "aqiqah-1"` in `themeId === "khitan-9" && themeId !== "birthday-1"`
content = content.replace(/themeId !== "khitan-9" && themeId !== "birthday-1"/g, 'themeId !== "khitan-9" && themeId !== "aqiqah-1" && themeId !== "birthday-1"');

// 7. Update text rendering for Cover
content = content.replace(
  'isKhitan ? "Khitankan:" : isCustomInvitation',
  'isAqiqah ? "Tasyakuran:" : isKhitan ? "Khitankan:" : isCustomInvitation'
);

content = content.replace(
  'isKhitan ? "Kami bermaksud menyelenggarakan syukuran Khitanan putra kami:" : isCustomInvitation',
  'isAqiqah ? "Kami bermaksud menyelenggarakan syukuran Aqiqah putra/putri kami:" : isKhitan ? "Kami bermaksud menyelenggarakan syukuran Khitanan putra kami:" : isCustomInvitation'
);

// 8. Update Bank accounts theme colors (we used #1E40AF for aqiqah-1)
content = content.replace(
  /activeTheme === "khitan-8" \? "#0F766E" : undefined/g,
  'activeTheme === "khitan-8" ? "#0F766E" : activeTheme === "aqiqah-1" ? "#1E40AF" : undefined'
);
content = content.replace(
  /themeId === "khitan-8" \|\| themeId === "khitan-9" \|\| themeId === "birthday-1"/g,
  'themeId === "khitan-8" || themeId === "khitan-9" || themeId === "aqiqah-1" || themeId === "birthday-1"'
);
content = content.replace(
  /themeId === "khitan-8" \|\| themeId === "birthday-1"/g,
  'themeId === "khitan-8" || themeId === "khitan-9" || themeId === "aqiqah-1" || themeId === "birthday-1"'
);


fs.writeFileSync(pageFile, content);
console.log("Injected Aqiqah 1 successfully!");
