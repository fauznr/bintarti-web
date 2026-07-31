const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Fix activeTheme ternary so normalizedTheme === "wedding-1" yields "wedding-1"
content = content.replace(
  'const activeTheme = (normalizedTheme === "khitan-1"',
  'const activeTheme = (normalizedTheme === "wedding-1"\n    ? "wedding-1"\n    : normalizedTheme === "khitan-1"'
);

// 2. Remove the misplaced "wedding-1" entry inside SECTION_BG_MAP
const misplacedEntry = `    "wedding-1": {
    accentColor: "#C5A059",
    badgeBgClass: "bg-[#1E293B] text-amber-200 border border-[#C5A059]/40",
    btnGradientClass: "from-[#C5A059] via-[#D4AF37] to-[#9A7B38]",
    sectionBg: "#FAF8F5",
    galleryBg: "#F3EFEA"
  },\n`;

content = content.replace(misplacedEntry, '');

// 3. Add proper wedding-1 entry into SECTION_BG_MAP
const properSectionBgEntry = `  "wedding-1": {
    cover: "",
    profile: "",
    turut: "",
    event: "",
    maps: "",
    activities: "",
    gallery: "",
    rsvp: "",
    envelope: "",
    checkin: "",
    closing: "",
    default: "",
  },\n`;

content = content.replace(
  'const SECTION_BG_MAP: Record<string, Record<string, string>> = {\n',
  'const SECTION_BG_MAP: Record<string, Record<string, string>> = {\n' + properSectionBgEntry
);

// 4. Add proper wedding-1 entry into THEME_STYLES
const properThemeStyleEntry = `  "wedding-1": {
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
  },\n`;

if (!content.includes('"wedding-1": {\n    accentColor: "#C5A059",\n    mainBg: "#FAF8F5"')) {
  content = content.replace(
    'const THEME_STYLES: Record<string, {\n',
    'const THEME_STYLES: Record<string, {\n' + properThemeStyleEntry
  );
}

fs.writeFileSync(pageFile, content);
console.log('Successfully fixed activeTheme resolution and theme maps for wedding-1!');
