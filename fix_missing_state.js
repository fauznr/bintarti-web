const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'wedding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('View.tsx') && f !== 'Wedding1View.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // If setTurnstileToken is in the file (in the Turnstile component) but useState is NOT
  if (content.includes('setTurnstileToken') && !content.includes('const [turnstileToken, setTurnstileToken] = useState')) {
    // Find a good place to inject it. We can inject it right after `const [isSubmitting, setIsSubmitting] = useState(false);`
    // or just search for the first `useState(` and inject it after that line.
    
    // Instead of regex, let's just insert it at the very beginning of the component body.
    // e.g. `export default function WeddingXView({ ... }) {`
    const functionDeclarationMatch = content.match(/export default function \w+\(.*?\)\s*\{/s);
    if (functionDeclarationMatch) {
      const insertionPoint = functionDeclarationMatch.index + functionDeclarationMatch[0].length;
      content = content.slice(0, insertionPoint) + '\n  const [turnstileToken, setTurnstileToken] = useState("");\n' + content.slice(insertionPoint);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed missing state in ${file}`);
    }
  }
}
