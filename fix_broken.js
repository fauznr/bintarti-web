const fs = require('fs');

function fixW2() {
  let content = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');
  content = content.replace('{isPro && (\n              {isPro && (', '{isPro && (');
  content = content.replace(')}\n            )}\n\n            <button\n              onClick={toggleAudio}', ')}\n\n            <button\n              onClick={toggleAudio}');
  fs.writeFileSync('src/components/wedding/Wedding2View.tsx', content);
}

function fixW(n) {
  const f = 'src/components/wedding/Wedding' + n + 'View.tsx';
  let content = fs.readFileSync(f, 'utf8');
  
  // Find the toggleAudio button to copy its className
  const audioRegex = /<button\s+onClick=\{toggleAudio\}\s+className="([^"]+)"/;
  const match = content.match(audioRegex);
  const audioClass = match ? match[1] : '';
  
  // Reconstruct QR button based on audio button
  const qrButton = `{isPro && (
              <button
                onClick={() => setShowQrModal(true)}
                className="${audioClass} group"
                aria-label="QR Code Presensi"
                title="QR Code Presensi Tamu"
              >
                <QrCode className="w-5 h-5 text-current group-hover:scale-110 transition-transform" />
              </button>
            )}`;
            
  content = content.replace('{isPro && (\\n              \\n            )}', qrButton);
  fs.writeFileSync(f, content);
}

fixW2();
fixW(6);
fixW(7);
fixW(8);

console.log("Fixed all broken files.");
