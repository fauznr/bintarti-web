const fs = require('fs');
const path = require('path');

const viewsDir = 'src/components/wedding';
const files = fs.readdirSync(viewsDir).filter(f => f.startsWith('Wedding') && f.endsWith('View.tsx'));

for (const file of files) {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  content = content.replace(/import\s*\{\s*Turnstile\s*\}\s*from\s*"@marsidev\/react-turnstile";\r?\n?/g, '');

  // Remove state
  content = content.replace(/[ \t]*const\s*\[turnstileToken,\s*setTurnstileToken\]\s*=\s*useState\(""\);\r?\n?/g, '');

  // Remove validation block
  const validationRegex = /[ \t]*if\s*\(!turnstileToken\)\s*\{\r?\n[ \t]*alert\("Harap tunggu CAPTCHA selesai atau refresh halaman."\);\r?\n[ \t]*return;\r?\n[ \t]*\}\r?\n?/g;
  content = content.replace(validationRegex, '');

  // Remove UI block
  const uiRegex = /[ \t]*<div className="w-full flex justify-center my-4 overflow-hidden">\r?\n[ \t]*<Turnstile\s*\r?\n[ \t]*siteKey=\{process\.env\.NEXT_PUBLIC_TURNSTILE_SITE_KEY \|\| "1x00000000000000000000AA"\}\s*\r?\n[ \t]*onSuccess=\{\(token\) => setTurnstileToken\(token\)\}\s*\r?\n[ \t]*\/>\r?\n[ \t]*<\/div>\r?\n?/g;
  content = content.replace(uiRegex, '');
  
  const uiRegex2 = /[ \t]*<div className="w-full flex justify-center mt-2 mb-4 overflow-hidden">\r?\n[ \t]*<Turnstile\s*\r?\n[ \t]*siteKey=\{process\.env\.NEXT_PUBLIC_TURNSTILE_SITE_KEY \|\| "1x00000000000000000000AA"\}\s*\r?\n[ \t]*onSuccess=\{\(token\) => setTurnstileToken\(token\)\}\s*\r?\n[ \t]*\/>\r?\n[ \t]*<\/div>\r?\n?/g;
  content = content.replace(uiRegex2, '');

  // Remove turnstileToken from fetch body (handles 'turnstileToken,' or 'turnstileToken' at end of object)
  content = content.replace(/,\s*turnstileToken/g, '');
  content = content.replace(/turnstileToken\s*,/g, '');
  content = content.replace(/[ \t]*turnstileToken\r?\n/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
}
