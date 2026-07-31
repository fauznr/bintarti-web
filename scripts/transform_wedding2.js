const fs = require('fs');
let code = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

// 1. Rename Wedding1ViewProps and Wedding1View
code = code.replace(/Wedding1ViewProps/g, 'Wedding2ViewProps');
code = code.replace(/Wedding1View/g, 'Wedding2View');

// 2. Remove the background slideshow state and interval
code = code.replace(/  const \[currentBgIndex, setCurrentBgIndex\] = useState\(0\);\n\n  useEffect\(\(\) => \{\n    const bgInterval = setInterval\(\(\) => \{\n      setCurrentBgIndex\(\(prev\) => \(prev \+ 1\) % bgPhotos\.length\);\n    \}, 4500\);\n    return \(\) => clearInterval\(bgInterval\);\n  \}, \[bgPhotos\.length\]\);\n\n/g, '');

// 3. Replace the background image source from bgPhotos[currentBgIndex] to coverPhoto
code = code.replace(/<Image\s+src=\{bgPhotos\[currentBgIndex\]\}/g, '<Image \n          src={coverPhoto}');

// Also remove the "transition-all duration-[4000ms] ease-in-out" from the background image since it's static
code = code.replace(/className="object-cover opacity-35 scale-105 transition-all duration-\[4000ms\] ease-in-out"/g, 'className="object-cover opacity-35 scale-105"');

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', code);
console.log('Successfully transformed Wedding2View.tsx');
