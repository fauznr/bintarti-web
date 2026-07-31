const fs = require('fs');
const path = require('path');
function searchDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      searchDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('from("invitations")') || content.includes("from('invitations')")) {
        console.log(fullPath);
      }
    }
  });
}
searchDir('src');
