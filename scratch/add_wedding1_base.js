const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add DEFAULT_CONFIG_THEME_WEDDING_1 right before DEFAULT_CONFIG_THEME_AQIQAH_1
const weddingConfigCode = `const DEFAULT_CONFIG_THEME_WEDDING_1: ThemeConfig = {
  cover: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 15,
    bottom: 15,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  profile: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 15,
    fontScale: 1,
    avatarScale: 120,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla",
    elementOrder: ["header", "body", "avatar", "parents", "bottom"]
  },
  turut: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  event: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla",
    elementOrder: ["header", "countdown", "location", "button"]
  },
  maps: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  activities: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  gallery: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  rsvp: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 15,
    bottom: 15,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  envelope: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 15,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  checkin: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla"
  },
  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 15,
    fontScale: 1,
    avatarScale: 120,
    headerFontFamily: "ArefRuqaa",
    bodyFontFamily: "Karla",
    elementOrder: ["avatar", "header", "body", "parents", "bottom"]
  }
};\n\n`;

if (!content.includes('DEFAULT_CONFIG_THEME_WEDDING_1')) {
  content = content.replace('const DEFAULT_CONFIG_THEME_AQIQAH_1:', weddingConfigCode + 'const DEFAULT_CONFIG_THEME_AQIQAH_1:');
}

// 2. Add wedding-1 to getDefaultConfigForTheme
content = content.replace(
  'theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_AQIQAH_1 :',
  'theme === "wedding-1" ? DEFAULT_CONFIG_THEME_WEDDING_1 :\n    theme === "aqiqah-1" ? DEFAULT_CONFIG_THEME_AQIQAH_1 :'
);

// 3. Add wedding-1 to themeStyle
const weddingStyleCode = `  "wedding-1": {
    accentColor: "#C5A059",
    badgeBgClass: "bg-[#1E293B] text-amber-200 border border-[#C5A059]/40",
    btnGradientClass: "from-[#C5A059] via-[#D4AF37] to-[#9A7B38]",
    sectionBg: "#FAF8F5",
    galleryBg: "#F3EFEA"
  },\n`;

if (!content.includes('"wedding-1": {')) {
  content = content.replace('  "aqiqah-1": {', weddingStyleCode + '  "aqiqah-1": {');
}

// 4. Update normalizedTheme cast
content = content.replace(
  ': normalizedTheme === "aqiqah-1"\n                     ? "aqiqah-1"',
  ': normalizedTheme === "wedding-1"\n                     ? "wedding-1"\n                     : normalizedTheme === "aqiqah-1"\n                     ? "aqiqah-1"'
);

content = content.replace(
  '| "aqiqah-1";',
  '| "aqiqah-1" | "wedding-1";'
);

// 5. Define isWedding right after isAqiqah
if (!content.includes('const isWedding =')) {
  content = content.replace(
    'const isAqiqah = activeTheme === "aqiqah-1" || (activeTheme && activeTheme.includes("aqiqah")) || (themeId && themeId.startsWith("aqiqah_")) || (invitationData && (invitationData.type === "Aqiqah" || (invitationData.theme && invitationData.theme.toLowerCase().includes("aqiqah"))));',
    'const isAqiqah = activeTheme === "aqiqah-1" || (activeTheme && activeTheme.includes("aqiqah")) || (themeId && themeId.startsWith("aqiqah_")) || (invitationData && (invitationData.type === "Aqiqah" || (invitationData.theme && invitationData.theme.toLowerCase().includes("aqiqah"))));\n  const isWedding = activeTheme === "wedding-1" || (activeTheme && activeTheme.includes("wedding")) || (themeId && themeId.startsWith("wedding_")) || (invitationData && (invitationData.type === "Wedding" || (invitationData.theme && invitationData.theme.toLowerCase().includes("wedding"))));'
  );
}

// 6. Data Fallbacks for Wedding
content = content.replace(
  'const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : ((isKhitan || isAqiqah) ? "Saka Niskala"',
  'const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : (isWedding ? "Yoshua & Jessica" : (isKhitan || isAqiqah) ? "Saka Niskala"'
);

content = content.replace(
  'const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : ((isKhitan || isAqiqah) ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"',
  'const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : (isWedding ? "Bapak H. Bambang & Ibu Hj. Retno / Bapak H. Hendra & Ibu Hj. Ratna" : (isKhitan || isAqiqah) ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"'
);

content = content.replace(
  'const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : ((isKhitan || isAqiqah) ? "Saka"',
  'const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : (isWedding ? "Yoshua & Jessica" : (isKhitan || isAqiqah) ? "Saka"'
);

// 7. Cover fallbacks
content = content.replace(
  '{layoutConfig.cover.badgeText !== undefined ? layoutConfig.cover.badgeText : (isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash")}',
  '{layoutConfig.cover.badgeText !== undefined ? layoutConfig.cover.badgeText : (isWedding ? "The Wedding of" : isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "🎉 You\'re Invited: Birthday Bash")}'
);

content = content.replace(
  '{layoutConfig.cover.bodyText !== undefined ? layoutConfig.cover.bodyText : (isAqiqah ? "Undangan Aqiqah" : isKhitan ? "Undangan Khitanan" : "To the Birthday of")}',
  '{layoutConfig.cover.bodyText !== undefined ? layoutConfig.cover.bodyText : (isWedding ? "Undangan Pernikahan" : isAqiqah ? "Undangan Aqiqah" : isKhitan ? "Undangan Khitanan" : "To the Birthday of")}'
);

// 8. Event Header fallback
content = content.replace(
  '{layoutConfig.event.headerText !== undefined ? layoutConfig.event.headerText : (isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "Birthday")}',
  '{layoutConfig.event.headerText !== undefined ? layoutConfig.event.headerText : (isWedding ? "Akad Nikah & Resepsi" : isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Walimatul Khitan" : "Birthday")}'
);

// 9. Activities Header & Body fallbacks
content = content.replace(
  '{layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights")}',
  '{layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isWedding ? "💕 Our Love Story" : isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights")}'
);

content = content.replace(
  '{layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isAqiqah ? "🎨 Rangkaian Acara" : isKhitan ? "🎨 Rangkaian Acara" : "🎨 Activities & Highlights")}',
  '{layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isWedding ? "💕 Our Love Story" : isAqiqah ? "🎨 Rangkaian Acara" : isKhitan ? "🎨 Rangkaian Acara" : "🎨 Activities & Highlights")}'
);

content = content.replace(
  '{layoutConfig.activities.bodyText !== undefined ? layoutConfig.activities.bodyText : (isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble")}',
  '{layoutConfig.activities.bodyText !== undefined ? layoutConfig.activities.bodyText : (isWedding ? "Kisah Perjalanan Cinta Kami" : isAqiqah ? "Tasyakuran Aqiqah" : isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble")}'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully added Wedding 1 base definitions to sandbox-tema/[id]/page.tsx!');
