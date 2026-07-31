const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Remove array elements containing khitan-invalid
content = content.replace(/\s*\{\s*id:\s*"9[123]",\s*url:\s*"\/templates\/khitan-invalid[^}]+\},?/g, '');

// Remove ternary checks
content = content.replace(/theme === "khitan-invalid" \? DEFAULT_CONFIG_THEME_KHITAN_9 :/g, '');

// Remove khitan-invalid from BG_THEMES (multiline)
content = content.replace(/\s*"khitan-invalid":\s*\{[\s\S]*?\},/g, '');

// Remove from useMemo conditionals
content = content.replace(/\s*:\s*normalizedTheme === "khitan-invalid"\s*\?\s*"khitan-invalid"/g, '');

// Remove from TS union
content = content.replace(/ \| "khitan-invalid"/g, '');

// Remove variable and references
content = content.replace(/\s*const khitaninvalidContainer = document.querySelector\('\.khitan-invalid-horizontal-dock'\);\s*if \(khitaninvalidContainer\) \(khitaninvalidContainer as HTMLElement\)\.style\.scrollBehavior = '';/g, '');

// Remove from style returning functions
content = content.replace(/\s*if \(activeTheme === "khitan-invalid"\) return "bg-slate-900\/90 border-cyan-600\/50 text-cyan-400";/g, '');
content = content.replace(/\s*if \(activeTheme === "khitan-invalid"\) return "bg-cyan-600";/g, '');

// Remove JSX blocks
content = content.replace(/\s*\{activeTheme === "khitan-invalid" && \([\s\S]*?\}\)/g, '');

// Remove from long `|| themeId === "khitan-invalid"` conditionals
content = content.replace(/ \|\| themeId === "khitan-invalid"/g, '');
content = content.replace(/themeId === "khitan-invalid" \|\| /g, '');

// Ensure no commas left dangling in arrays or objects if necessary
// But mostly these are cleaned by the above

fs.writeFileSync(pageFile, content);
console.log("Cleaned khitan-invalid references");
