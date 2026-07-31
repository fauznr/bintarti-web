const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace "<Image priority priority " with "<Image priority "
content = content.replace(/<Image priority\s+priority/g, '<Image priority');

// What if there is priority={true} ?
content = content.replace(/priority\s+priority/g, 'priority');
content = content.replace(/priority\s+priority=\{true\}/g, 'priority');
content = content.replace(/priority=\{true\}\s+priority/g, 'priority');

// Let's just fix the double priority
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('priority')) {
        let count = (line.match(/priority/g) || []).length;
        if (count > 1) {
            lines[i] = line.replace(/priority/, ''); // remove first occurrence
        }
    }
}
content = lines.join('\n');

fs.writeFileSync(pageFile, content);
console.log("Fixed double priority attributes!");
