const fs = require('fs');

function fixMissingIsPro(n) {
  const f = 'src/components/wedding/Wedding' + n + 'View.tsx';
  let content = fs.readFileSync(f, 'utf8');
  
  // 1. Add isPro definition if missing
  if (!content.includes('const isPro ')) {
    content = content.replace(
      'const groomNick = ',
      'const isPro          = !!invitationData?.is_pro || !!weddingNotes?.isPro;\n  const groomNick = '
    );
  }
  
  // 2. Wrap the qrcode-section in isPro if not already
  // We need to find <section id="qrcode-section"
  // Let's use regex to find the whole section
  const sectionRegex = /(<section\s+id="qrcode-section"[\s\S]*?<\/section>)/;
  if (sectionRegex.test(content)) {
    const match = content.match(sectionRegex)[1];
    const index = content.indexOf(match);
    const beforeStr = content.substring(Math.max(0, index - 20), index);
    if (!beforeStr.includes('isPro && (')) {
      content = content.replace(sectionRegex, '{isPro && (\n        $1\n        )}');
    }
  }
  
  fs.writeFileSync(f, content);
  console.log("Fixed missing isPro in " + f);
}

fixMissingIsPro(6);
fixMissingIsPro(7);
fixMissingIsPro(8);
