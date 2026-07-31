const fs = require('fs');

const files = ['Wedding1View.tsx','Wedding2View.tsx','Wedding3View.tsx','Wedding4View.tsx','Wedding5View.tsx'];

files.forEach(f => {
  let content = fs.readFileSync('src/components/wedding/' + f, 'utf8');
  
  // We want to replace the button that has setShowQrModal(true)
  // Let's find the exact block using regex
  const regex = /(<button\s+onClick=\{\(\) => setShowQrModal\(true\)\}[\s\S]*?<\/button>)/;
  
  if (regex.test(content)) {
    // Check if it's already wrapped in isPro
    const match = content.match(regex)[1];
    
    // We only replace if it's not already wrapped! 
    // To be safe, we will just replace the exact match with {isPro && ( match )}
    // BUT we need to make sure we don't double wrap it.
    
    // Let's check 20 characters before the match to see if it's already '{isPro && ('
    const index = content.indexOf(match);
    const beforeStr = content.substring(Math.max(0, index - 20), index);
    
    if (!beforeStr.includes('isPro && (')) {
      content = content.replace(regex, '{isPro && (\n              $1\n            )}');
      fs.writeFileSync('src/components/wedding/' + f, content);
      console.log('Patched ' + f);
    } else {
      console.log(f + ' is already patched');
    }
  } else {
    console.log(f + ' does not contain the button pattern');
  }
});
