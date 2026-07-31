const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

content = content.replace(
  /const galleryImages = useMemo\(\(\) => \{\s*if \(isKhitan\) \{/,
  'const galleryImages = useMemo(() => {\n    if (isKhitan || isAqiqah) {'
);

fs.writeFileSync(pageFile, content);
console.log("Updated galleryImages logic");
