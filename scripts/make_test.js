const fs = require('fs');
const c = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');
const i = c.indexOf('  return (\n    <div className="min-h-screen');
const code = c.substring(0, i) + '\n  return null;\n}\n';
fs.writeFileSync('test.tsx', code);
