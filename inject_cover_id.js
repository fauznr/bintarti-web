const fs = require('fs');
const path = require('path');

const viewsDir = 'src/components/wedding';
const files = fs.readdirSync(viewsDir).filter(f => f.startsWith('Wedding') && f.endsWith('View.tsx'));

for (const file of files) {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Look for: {(!isOpened || isClosingCover) && (
  //           <div className="...
  // OR similar variations, and inject id="cover-section"
  
  const regex = /(\{\(!isOpened \|\| isClosingCover\) && \(\s*)<div\s+/;
  
  if (content.match(regex)) {
    if (!content.includes('id="cover-section"')) {
      content = content.replace(regex, '$1<div id="cover-section" ');
      fs.writeFileSync(filePath, content);
      console.log(`Injected id="cover-section" into ${file}`);
    } else {
      console.log(`${file} already has id="cover-section"`);
    }
  } else {
    console.log(`Could not find the cover div pattern in ${file}`);
  }
}
