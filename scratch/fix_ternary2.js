const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace(/\$\{activeTheme === "khitan-9" \? "border-l-\[6px\] border-t-\[4px\] border-b-\[4px\] border-t-transparent border-b-transparent border-l-current ml-1" : "border-t-\[6px\] border-t-current mt-0\.5"\}/g, 'border-t-[6px] border-t-current mt-0.5');

content = content.replace(/className=\{activeTheme === "khitan-9" \? "khitan-9-horizontal-dock animate-fade-in" : "max-w-\[430px\] mx-auto space-y-4 animate-fade-in pb-12 pt-4 px-2 sm:px-3"\}/g, 'className="max-w-[430px] mx-auto space-y-4 animate-fade-in pb-12 pt-4 px-2 sm:px-3"');

fs.writeFileSync(pageFile, content);
console.log('Fixed remaining ternaries');
