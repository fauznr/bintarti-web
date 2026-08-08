const fs = require('fs');
const path = require('path');

const viewsDir = 'src/components/wedding';
const files = fs.readdirSync(viewsDir).filter(f => f.startsWith('Wedding') && f.endsWith('View.tsx'));

for (const file of files) {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import (both single and double quotes)
  content = content.replace(/import\s*\{\s*Turnstile\s*\}\s*from\s*['"]@marsidev\/react-turnstile['"];?\r?\n?/g, '');

  // Remove state (might have spaces)
  content = content.replace(/[ \t]*const\s*\[\s*turnstileToken\s*,\s*setTurnstileToken\s*\]\s*=\s*useState\([^)]*\);?\r?\n?/g, '');

  // Remove all lines containing `<Turnstile` until `/>`
  content = content.replace(/[ \t]*<Turnstile[\s\S]*?\/>\r?\n?/g, '');

  // Remove wrapper divs that were empty after Turnstile removal (optional, but let's just use string replacement if possible)
  content = content.replace(/[ \t]*<div className="w-full flex justify-center (my-4|mt-2 mb-4) overflow-hidden">\s*<\/div>\r?\n?/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
}
