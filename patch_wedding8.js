const fs = require('fs');

let c = fs.readFileSync('src/components/wedding/Wedding8View.tsx', 'utf8');

c = c.replace(
  /const handleSubmitRSVP = async \(\) => \{\r?\n\s*if \(!rsvpName\.trim\(\) \|\| !rsvpMessage\.trim\(\)\) return;/,
  'const handleSubmitRSVP = async () => {\n    if (!turnstileToken) {\n      alert("Harap tunggu CAPTCHA selesai atau refresh halaman.");\n      return;\n    }\n    if (!rsvpName.trim() || !rsvpMessage.trim()) return;'
);

c = c.replace(
  /<button\r?\n\s*onClick=\{handleSubmitRSVP\}/,
  '<div className="w-full flex justify-center my-4 overflow-hidden">\n                  <Turnstile \n                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} \n                    onSuccess={(token) => setTurnstileToken(token)} \n                  />\n                </div>\n                <button\n                  onClick={handleSubmitRSVP}'
);

fs.writeFileSync('src/components/wedding/Wedding8View.tsx', c);
