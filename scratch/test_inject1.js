const fs = require('fs');

const w1Path = 'src/components/wedding/Wedding1View.tsx';
const w2Path = 'scratch/Wedding2View_test.tsx';

let w1 = fs.readFileSync(w1Path, 'utf8');
let w2 = fs.readFileSync(w2Path, 'utf8');

// Extract logic block from Wedding 1
const w1StartIdx = w1.indexOf('  const [isOpened, setIsOpened] = useState(false);');
const w1EndIdx = w1.indexOf('  return (', w1StartIdx);
let logicBlock = w1.substring(w1StartIdx, w1EndIdx);

// Remove the bgInterval logic since Wedding 2 background is static
logicBlock = logicBlock.replace(/  const \[currentBgIndex, setCurrentBgIndex\] = useState\(0\);\n\n  useEffect\(\(\) => \{\n    const bgInterval = setInterval\(\(\) => \{\n      setCurrentBgIndex\(\(prev\) => \(prev \+ 1\) % bgPhotos\.length\);\n    \}, 4500\);\n    return \(\) => clearInterval\(bgInterval\);\n  \}, \[bgPhotos\.length\]\);\n/, '');

// Find where to replace in Wedding 2
const w2StartIdx = w2.indexOf('  const [isOpened, setIsOpened] = useState(false);');
const w2EndIdx = w2.indexOf('  return (', w2StartIdx);

// Replace logic block
w2 = w2.substring(0, w2StartIdx) + logicBlock + w2.substring(w2EndIdx);

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', w2);
console.log("Injected logic block.");
