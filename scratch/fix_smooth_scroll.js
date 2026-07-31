const fs = require('fs');
const layoutFile = 'src/app/layout.tsx';
let content = fs.readFileSync(layoutFile, 'utf8');

content = content.replace(' scroll-smooth', '');

fs.writeFileSync(layoutFile, content);
console.log("Removed scroll-smooth from layout.tsx!");
