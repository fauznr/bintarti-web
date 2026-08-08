const fs = require('fs');

let c = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

c = c.replace(
  'import { useState, useEffect } from "react";', 
  'import { useState, useEffect } from "react";\nimport { Turnstile } from "@marsidev/react-turnstile";'
);

c = c.replace(
  'const [isLoaded, setIsLoaded] = useState(false);', 
  'const [isLoaded, setIsLoaded] = useState(false);\n  const [turnstileToken, setTurnstileToken] = useState("");'
);

c = c.replace(
  'if (!validateStep(4)) return;', 
  'if (!validateStep(4)) return;\n\n    if (!turnstileToken) {\n      alert("Harap tunggu CAPTCHA selesai atau refresh halaman.");\n      return;\n    }'
);

c = c.replace(
  'body: JSON.stringify({', 
  'body: JSON.stringify({\n          turnstileToken,'
);

c = c.replace(
  '<div className="flex justify-between mt-8 pt-6 border-t border-slate-100">', 
  '{currentStep === 4 && (\n                  <div className="flex justify-center w-full overflow-hidden my-4">\n                    <Turnstile \n                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} \n                      onSuccess={(token) => setTurnstileToken(token)} \n                    />\n                  </div>\n                )}\n                <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">'
);

fs.writeFileSync('src/app/formulir/page.tsx', c);
console.log("Patched src/app/formulir/page.tsx");
