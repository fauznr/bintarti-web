const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace Kel. ${parentsName}. with parentsName directly in closing section
content = content.replace(
  '<p className="font-black" style={{ fontSize: \'1.16em\' }}>{layoutConfig.closing.parentsText !== undefined ? layoutConfig.closing.parentsText : `Kel. ${parentsName}.`}</p>',
  '<p className="font-black" style={{ fontSize: \'1.16em\' }}>{layoutConfig.closing.parentsText !== undefined ? layoutConfig.closing.parentsText : parentsName}</p>'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully made parents name 100% identical between Profile Intro and Closing!');
