const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Restore Kel. prefix for Closing section
content = content.replace(
  '<p className="font-black" style={{ fontSize: \'1.16em\' }}>{layoutConfig.closing.parentsText !== undefined ? layoutConfig.closing.parentsText : parentsName}</p>',
  '<p className="font-black" style={{ fontSize: \'1.16em\' }}>{layoutConfig.closing.parentsText !== undefined ? layoutConfig.closing.parentsText : (parentsName.startsWith("Kel.") ? parentsName : `Kel. ${parentsName}.`)}</p>'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully added Kel. prefix to Closing section!');
