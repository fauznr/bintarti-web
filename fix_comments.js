const fs = require('fs');

const files = [
  'Wedding2View.tsx',
  'Wedding3View.tsx',
  'Wedding4View.tsx',
  'Wedding5View.tsx',
  'Wedding6View.tsx',
  'Wedding7View.tsx',
  'Wedding8View.backup.tsx',
  'Wedding8View.tsx'
];

files.forEach(f => {
  const path = 'src/components/wedding/' + f;
  let c = fs.readFileSync(path, 'utf8');
  
  // Fix the corrupted comment line
  c = c.replace(/comment:\s*,\s*turnstileToken/g, 'comment: rsvpMessage,\n          turnstileToken');
  c = c.replace(/comment:\s*,\s*\n\s*turnstileToken/g, 'comment: rsvpMessage,\n          turnstileToken');
  
  // Actually, wait, some templates might use formMessage or rsvpMessage or formName.
  // Let's check what they used originally.
  // We can just look at the state declarations above it!
});
