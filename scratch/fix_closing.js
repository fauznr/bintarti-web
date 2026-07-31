const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// The block for 'parents'
content = content.replace(
  /if \(isKhitan && layoutConfig\.closing\.hideBody !== true && layoutConfig\.closing\.bodyText === undefined\) \{/g,
  'if ((isKhitan || isAqiqah) && layoutConfig.closing.hideBody !== true && layoutConfig.closing.bodyText === undefined) {'
);

// The block for 'bottom'
content = content.replace(
  /if \(layoutConfig\.closing\.hideBottom\) return null;\s*if \(isKhitan\) \{/g,
  'if (layoutConfig.closing.hideBottom) return null;\n                  if (isKhitan || isAqiqah) {'
);

fs.writeFileSync(pageFile, content);
console.log("Replaced isKhitan with (isKhitan || isAqiqah) in closing section");
