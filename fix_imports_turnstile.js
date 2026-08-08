const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'wedding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('View.tsx') && f !== 'Wedding1View.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import { Turnstile }')) {
    // Add import right after the React import
    content = content.replace(
      /import React(.*?)from "react";/,
      'import React$1from "react";\nimport { Turnstile } from "@marsidev/react-turnstile";'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added import to ${file}`);
  }
}
