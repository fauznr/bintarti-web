const fs = require('fs');
const content = fs.readFileSync('src/app/formulir/page.tsx', 'utf-8');
const lines = content.split('\n');
let indices = [];
lines.forEach((line, index) => {
    if (line.includes('"use client";')) {
        indices.push(index + 1);
    }
});
console.log('use client lines:', indices);
console.log('Total lines:', lines.length);
