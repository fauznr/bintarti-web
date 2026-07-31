const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Cover container alignment
content = content.replace(
  'className="relative z-10 my-auto flex flex-col items-center space-y-6 max-w-sm px-4"',
  'className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto"'
);

// 2. Opened Hero Header height & alignment
content = content.replace(
  'className="relative h-[85vh] flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"',
  'className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"'
);

content = content.replace(
  'className="relative z-10 space-y-4 animate-fade-in-up"',
  'className="relative z-10 space-y-4 animate-fade-in-up flex flex-col items-center justify-center text-center my-auto w-full max-w-sm mx-auto"'
);

fs.writeFileSync(viewFile, content);
console.log('Successfully centered "The Wedding of Yoshua & Jessica Sabtu, 25 Januari 2026" perfectly!');
