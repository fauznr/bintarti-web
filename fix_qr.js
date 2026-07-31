const fs = require('fs');
const path = require('path');
const dir = 'src/components/wedding';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Wedding') && f.endsWith('View.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match both guestName and guest
  content = content.replace(
    /src=\{\`https:\/\/api\.qrserver\.com\/v1\/create-qr-code\/\?size=250x250&data=\$\{encodeURIComponent\(\`WEDDING-GUEST-\$\{(guestName|guest) \|\| "Tamu Undangan"\}\`\)\}\`\}/g,
    'src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent($1 || "Tamu Undangan")))}&type=Wedding`)}`}'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
