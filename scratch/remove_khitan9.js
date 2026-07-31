const fs = require('fs');

// 1. Clean katalog.ts
const katalogPath = 'src/data/katalog.ts';
let katalog = fs.readFileSync(katalogPath, 'utf8');
const khitan9Regex = /\{\s*id:\s*12,\s*name:\s*"Khitan 9[^}]+\},/g;
katalog = katalog.replace(khitan9Regex, '');
fs.writeFileSync(katalogPath, katalog);
console.log('Cleaned katalog.ts');

// 2. Clean sandbox-tema/page.tsx
const sandboxPagePath = 'src/app/sandbox-tema/page.tsx';
let sandboxPage = fs.readFileSync(sandboxPagePath, 'utf8');
const sandboxKhitan9Regex = /\{\s*id:\s*"khitan-9"[^}]+\},/g;
sandboxPage = sandboxPage.replace(sandboxKhitan9Regex, '');
fs.writeFileSync(sandboxPagePath, sandboxPage);
console.log('Cleaned sandbox-tema/page.tsx');

// 3. Clean sandbox-tema/[id]/page.tsx (This has 53 references, needs careful manual or global replacements)
const detailPagePath = 'src/app/sandbox-tema/[id]/page.tsx';
let detailPage = fs.readFileSync(detailPagePath, 'utf8');

// Just remove themeId === "khitan-9" checks
detailPage = detailPage.replace(/ && themeId !== "khitan-9"/g, '');
detailPage = detailPage.replace(/ \|\| activeTheme === "khitan-9"/g, '');

// Clean specific khitan-9 logic blocks
// e.g. khitan-9-horizontal-dock and specific renders
const khitan9LogicRegex = /\s*if \(activeTheme === "khitan-9"\) \{[\s\S]*?\}(?=\s*else|\s*const|\s*\/\/)/g;
detailPage = detailPage.replace(khitan9LogicRegex, '');

// Remove the getKhitan9ElementData function
const getKhitan9ElementDataRegex = /\s*const getKhitan9ElementData = \(\) => \{[\s\S]*?\};\s*/g;
detailPage = detailPage.replace(getKhitan9ElementDataRegex, '');

// Replace any leftover `activeTheme === "khitan-9" ? ... : ...`
detailPage = detailPage.replace(/activeTheme === "khitan-9" \? [^:]+ : /g, '');

// Remove explicit references in className or styles that use khitan-9
detailPage = detailPage.replace(/khitan-9/g, 'khitan-invalid');
detailPage = detailPage.replace(/khitan9/g, 'khitaninvalid');

fs.writeFileSync(detailPagePath, detailPage);
console.log('Cleaned sandbox-tema/[id]/page.tsx references');
