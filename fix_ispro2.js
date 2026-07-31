const fs = require('fs');

function fixIsProProperly(n) {
  const f = 'src/components/wedding/Wedding' + n + 'View.tsx';
  let content = fs.readFileSync(f, 'utf8');
  
  if (!content.includes('const isPro ')) {
    content = content.replace(
      'const [isOpened, setIsOpened] = useState(false);',
      'const [isOpened, setIsOpened] = useState(false);\n  const isPro = !!invitationData?.is_pro;'
    );
    fs.writeFileSync(f, content);
    console.log("Properly fixed isPro in " + f);
  } else {
    console.log("Already has isPro in " + f);
  }
}

fixIsProProperly(6);
fixIsProProperly(7);
fixIsProProperly(8);
