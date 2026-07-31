const fs = require('fs');

// 1. Remove FloatingQrScanner from sandbox-tema
const pathSandbox = 'src/app/sandbox-tema/[id]/page.tsx';
let sandbox = fs.readFileSync(pathSandbox, 'utf8');

// Remove the component definition
const scannerDefRegex = /  \/\/ Scan QR floating button for desktop users\n  const FloatingQrScanner = \(\) => \([\s\S]*?\);\n\n/;
sandbox = sandbox.replace(scannerDefRegex, '');

// Remove the usage `<FloatingQrScanner />`
sandbox = sandbox.replace(/        <FloatingQrScanner \/>\n/g, '');

fs.writeFileSync(pathSandbox, sandbox);
console.log("Removed FloatingQrScanner from sandbox");


// 2. Fix floating icons in Wedding7View.tsx
const pathW7 = 'src/components/wedding/Wedding7View.tsx';
let w7 = fs.readFileSync(pathW7, 'utf8');

// Remove the first redundant audio toggle (L541-L552)
const audioRegex = /\s*\{\/\* Floating Audio Disc Toggle Button \*\/\}\s*\{isOpened && \(\s*<button\s*onClick=\{toggleAudio\}\s*className="fixed bottom-5 right-5 z-\[900\][\s\S]*?<\/button>\s*\)\}\s*/;
w7 = w7.replace(audioRegex, '\n');

// Fix the QR button className in the standardized stack
const badQrClass = /className="fixed bottom-5 right-5 z-\[900\] p-3 rounded-full bg-white\/90 border border-\[\#6a8f7f\]\/60 text-\[\#6a8f7f\] shadow-2xl backdrop-blur-md hover:scale-110 transition-all cursor-pointer group group"/g;
const goodQrClass = `className="w-12 h-12 rounded-full border border-white/40 bg-white/90 backdrop-blur-md text-[#6a8f7f] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"`;
w7 = w7.replace(badQrClass, goodQrClass);

fs.writeFileSync(pathW7, w7);
console.log("Fixed Wedding 7 icons overlapping");
