const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'wedding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('View.tsx') && f !== 'Wedding1View.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the state and validation inside handleSubmitRsvp or handleSubmitRSVP
  if (!content.includes('const [turnstileToken, setTurnstileToken] = useState')) {
    content = content.replace(
      /const handleSubmitRSVP = async \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);/i,
      `const [turnstileToken, setTurnstileToken] = useState("");\n\n  const handleSubmitRsvp = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!turnstileToken) {\n      alert("Harap tunggu CAPTCHA selesai atau refresh halaman.");\n      return;\n    }`
    );
  }

  // Also fix the onSubmit={handleSubmitRSVP} to match the new casing just in case
  content = content.replace(/onSubmit=\{handleSubmitRSVP\}/g, 'onSubmit={handleSubmitRsvp}');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed state in ${file}`);
}
