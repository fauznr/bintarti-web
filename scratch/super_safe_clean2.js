const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let lines = fs.readFileSync(pageFile, 'utf8').split('\n');

// 1. Remove the khitan-9 CSS block
let cssStart = -1;
let cssEnd = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('if (activeTheme === "khitan-9") {') && lines[i+2]?.includes('/* Khitan-9 Space Theme HUD Overrides */')) {
        cssStart = i;
    }
    if (cssStart !== -1 && i > cssStart && lines[i] === '    }') {
        cssEnd = i;
        break;
    }
}

if (cssStart !== -1 && cssEnd !== -1) {
    lines.splice(cssStart, cssEnd - cssStart + 1);
    console.log('Removed CSS block from', cssStart, 'to', cssEnd);
} else {
    console.log('FAILED to find CSS block!!!');
}

// Write back so we can use string replace for the rest
let content = lines.join('\n');

// 2. Remove khitan-9 specific JSX elements (Starfield, shooting stars)
content = content.replace(/\{activeTheme === "khitan-9" && \(\s*<>\s*<div className="khitan-9-starfield"><\/div>\s*<div className="khitan-9-shooting-stars"><\/div>\s*<\/>\s*\)\}/g, '');

// 3. Remove horizontal-dock logic for khitan-9 in scrollStep
const scrollStepRegex = /const scrollStep = \(\) => \{[\s\S]*?animationFrameId = requestAnimationFrame\(scrollStep\);\s*\};\s*animationFrameId = requestAnimationFrame\(scrollStep\);/;
const replacementScrollStep = `const scrollStep = () => {
      if (exactScrollY === null) {
        exactScrollY = window.scrollY;
      }
      
      const amount = 1.0; 
      
      if (exactScrollY !== null) {
        exactScrollY += amount;
        window.scrollTo({ top: exactScrollY, behavior: 'auto' });
      }
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };
    
    animationFrameId = requestAnimationFrame(scrollStep);`;

content = content.replace(scrollStepRegex, replacementScrollStep);

// 4. Clean up khitan-9 from union types and validation checks
content = content.replace(/ && themeId !== "khitan-9"/g, '');
content = content.replace(/ \|\| activeTheme === "khitan-9"/g, '');
content = content.replace(/ \|\| themeId === "khitan-9"/g, '');
content = content.replace(/themeId === "khitan-9" \|\| /g, '');
content = content.replace(/ \| "khitan-9"/g, '');
content = content.replace(/\s*:\s*normalizedTheme === "khitan-9"\s*\?\s*"khitan-9"/g, '');
content = content.replace(/theme === "khitan-9" \? DEFAULT_CONFIG_THEME_KHITAN_9 :/g, '');
content = content.replace(/activeTheme === "khitan-9" \? atmaFontRaw : /g, '');
content = content.replace(/activeTheme === "khitan-9" \? DEFAULT_CONFIG_THEME_KHITAN_9 : /g, '');

// 5. Remove BG_THEMES config for khitan-9
const bgThemesKhitan9Regex = /\s*"khitan-9":\s*\{[^}]+\},/g;
content = content.replace(bgThemesKhitan9Regex, '');

// 6. Remove khitan9Container reset
const khitan9ContainerReset = /\s*const khitan9Container = document\.querySelector\('\.khitan-9-horizontal-dock'\);\s*if \(khitan9Container\) \(khitan9Container as HTMLElement\)\.style\.scrollBehavior = '';/g;
content = content.replace(khitan9ContainerReset, '');

// 7. Remove specific inline style returns
content = content.replace(/\s*if \(activeTheme === "khitan-9"\) return "bg-slate-900\/90 border-cyan-600\/50 text-cyan-400";/g, '');
content = content.replace(/\s*if \(activeTheme === "khitan-9"\) return "bg-cyan-600";/g, '');

// 8. Remove `getKhitan9ElementData` block
content = content.replace(/\s*const getKhitan9ElementData = \(\) => \{[\s\S]*?\};\s*/g, '');

// 9. Clean up array objects pointing to khitan9 assets
content = content.replace(/\s*\{\s*id:\s*"9[123]",\s*url:\s*"\/templates\/khitan-9[^}]+\},?/g, '');

// 10. Remove DEFAULT_CONFIG_THEME_KHITAN_9 block
const khitan9ConfigRegex = /const DEFAULT_CONFIG_THEME_KHITAN_9: ThemeConfig = \{[\s\S]*?\};\n/g;
content = content.replace(khitan9ConfigRegex, '');

fs.writeFileSync(pageFile, content);
console.log("Cleaned page.tsx safely and accurately!");
