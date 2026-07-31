const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Update activeTheme condition to include wedding-2
content = content.replace(
  'normalizedTheme === "wedding-1"\n    ? "wedding-1"',
  'normalizedTheme === "wedding-1"\n    ? "wedding-1"\n    : normalizedTheme === "wedding-2"\n      ? "wedding-2"'
);

// Update type cast to include "wedding-2"
content = content.replace(
  '| "wedding-1";',
  '| "wedding-1" | "wedding-2";'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated activeTheme type and condition for wedding-2!');
