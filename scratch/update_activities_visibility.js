const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace !isKhitan && activitiesPhoto
content = content.replace(
  /!isKhitan && activitiesPhoto/g,
  '!(isKhitan || isAqiqah) && activitiesPhoto'
);

fs.writeFileSync(pageFile, content);
console.log("Updated activities photo visibility");
