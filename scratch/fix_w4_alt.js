const fs = require('fs');
let c = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');
c = c.replace('alt="{groomFullName}"', 'alt={groomFullName}');
c = c.replace('alt="{brideFullName}"', 'alt={brideFullName}');
fs.writeFileSync('src/components/wedding/Wedding4View.tsx', c);
console.log('done');
