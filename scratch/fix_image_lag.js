const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// We want to add priority={true} to all <Image elements.
// This will force Next.js to load them upfront (after envelope opened), meaning they won't cause lag when scrolling into view.

content = content.replace(/<Image\s/g, '<Image priority ');

fs.writeFileSync(pageFile, content);
console.log("Added priority to all Image components to prevent scroll freeze!");
