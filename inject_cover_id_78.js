const fs = require('fs');

let w7 = fs.readFileSync('src/components/wedding/Wedding7View.tsx', 'utf8');
w7 = w7.replace(
  /\{\!isOpened && \(\r?\n\s*<div\r?\n\s*className=\{\`fixed inset-0/,
  '{!isOpened && (\n        <div\n          id="cover-section"\n          className={`fixed inset-0'
);
fs.writeFileSync('src/components/wedding/Wedding7View.tsx', w7);

let w8 = fs.readFileSync('src/components/wedding/Wedding8View.tsx', 'utf8');
w8 = w8.replace(
  /if \(\!isOpened\) \{\r?\n\s*return \(\r?\n\s*<div\r?\n\s*className="min-h-screen/,
  'if (!isOpened) {\n    return (\n      <div\n        id="cover-section"\n        className="min-h-screen'
);
fs.writeFileSync('src/components/wedding/Wedding8View.tsx', w8);

console.log('Fixed Wedding 7 and 8');
