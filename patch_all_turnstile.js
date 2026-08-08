const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'wedding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('View.tsx') && f !== 'Wedding1View.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (content.includes('react-turnstile')) {
    console.log(`Skipping ${file} - already patched`);
    continue;
  }

  // 1. Add import
  content = content.replace(
    'import ScrollReveal from "../ScrollReveal";',
    'import ScrollReveal from "../ScrollReveal";\nimport { Turnstile } from "@marsidev/react-turnstile";'
  );

  // 2. Add state and validation
  content = content.replace(
    '  const handleSubmitRSVP = async (e: React.FormEvent) => {\n    e.preventDefault();',
    `  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      alert("Harap tunggu CAPTCHA selesai atau refresh halaman.");
      return;
    }`
  );

  // 3. Add token to payload
  // There are two forms of payload, find the JSON.stringify block
  content = content.replace(
    /rsvpStatus: newComment\.rsvp_status,\s*comment: rsvpMessage/g,
    'rsvpStatus: newComment.rsvp_status,\n          comment: rsvpMessage,\n          turnstileToken'
  );

  // 4. Add Turnstile component
  const turnstileComponent = `\n                <div className="flex justify-center w-full overflow-hidden my-2">\n                  <Turnstile \n                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} \n                    onSuccess={(token) => setTurnstileToken(token)} \n                  />\n                </div>\n\n                <button`;
  
  content = content.replace(
    /\s*<button\s*type="submit"/g,
    turnstileComponent + ' type="submit"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ${file}`);
}
