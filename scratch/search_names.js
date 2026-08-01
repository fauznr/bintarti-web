const fs = require('fs');
const files = ['Wedding1View.tsx', 'Wedding2View.tsx', 'Wedding3View.tsx', 'Wedding4View.tsx', 'Wedding5View.tsx', 'Wedding6View.tsx', 'Wedding7View.tsx', 'Wedding8View.tsx'];
files.forEach(f => {
  const c = fs.readFileSync('src/components/wedding/' + f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('{groomFullName}') || l.includes('{brideFullName}') || l.includes('{groomParents}') || l.includes('{brideParents}')) {
       if(l.includes('="') || l.includes('|| "') || l.includes('|| "{')) {
          console.log(f + ': ' + i + ' => ' + l.trim());
       }
    }
  });
});
