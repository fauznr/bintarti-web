const fs = require('fs');

const pathW7 = 'src/components/wedding/Wedding7View.tsx';
const lines = fs.readFileSync(pathW7, 'utf-8').split('\n');

// 1. Extract SECTION 5 text (L862 to L912) and modify it
const startIndex = lines.findIndex(line => line.includes('SECTION 5: QR CODE TAMU UNDANGAN PRESENSI'));
const endIndex = lines.findIndex((line, i) => i > startIndex && line.includes('</section>'));
let qrBlockLines = [];

// Get the lines from {isPro && ( to )}
// In the file, it's:
// L865: {isPro && (
// L912: )}
// We will just find those accurately.
const isProStart = lines.findIndex((line, i) => i >= startIndex - 2 && line.includes('{isPro && ('));
const isProEnd = lines.findIndex((line, i) => i > isProStart && line.trim() === ')}');

for (let i = isProStart - 3; i <= isProEnd; i++) {
    qrBlockLines.push(lines[i]);
}

let qrBlock = qrBlockLines.join('\n');
qrBlock = qrBlock.replace(
    'VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026',
    'VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-{akadDateStr ? akadDateStr.split("-")[0] : "2026"}'
);

// 2. Determine what to delete (L837 to L914)
const topTornIndex = lines.findIndex(line => line.includes('<TornPaperTop color="#FAFBFB" />'));
// Find the div wrapping topTornIndex
const divStart = topTornIndex - 1;
const divEnd = topTornIndex + 1;

const bottomTornIndex = lines.findIndex((line, i) => i > isProEnd && line.includes('<TornPaperBottom color="#FAFBFB" />'));

// Create a new array of lines without the deleted block
let newLines = [];
for (let i = 0; i < lines.length; i++) {
    if (i >= divStart && i <= bottomTornIndex) {
        continue;
    }
    newLines.push(lines[i]);
}

// 3. Insert qrBlock after RSVP section (SECTION 9)
// Find SECTION 9 end
let rsvpEndIndex = newLines.findIndex((line, i) => i > 1000 && line.includes('SECTION 10: CLOSING'));
if (rsvpEndIndex === -1) {
    console.log("Could not find CLOSING section");
    process.exit(1);
}
// We want to insert BEFORE the TornPaperBottom that is just above SECTION 10
// The file has:
// </section>
// <TornPaperBottom color="#FAFBFB" />
// {/* === SECTION 10 === */}
// So we find the TornPaperBottom that precedes SECTION 10
let targetIndex = rsvpEndIndex - 1;
while (targetIndex > 0 && !newLines[targetIndex].includes('<TornPaperBottom')) {
    targetIndex--;
}

newLines.splice(targetIndex, 0, qrBlock + '\n');

// 4. Also fix the BCA / Mandiri hardcoded bank accounts that I missed before!
let finalCode = newLines.join('\n');
const bankRegex = /\{\/\* BCA \*\/\}\s*<div className="p-6 rounded-3xl bg-white border border-\[\#6a8f7f\]\/30 shadow-xl space-y-3 text-center">[\s\S]*?\{\/\* MANDIRI \*\/\}\s*<div className="p-6 rounded-3xl bg-white border border-\[\#6a8f7f\]\/30 shadow-xl space-y-3 text-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Instead of regex, I will do string replacement for the bank block
const bcaMandiriBlock = `              {/* BCA */}
              <div className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                  BANK BCA
                </span>
                <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">
                  1234 5678 90
                </p>
                <p className="font-montserrat text-xs text-[#718096] font-light">
                  a.n. Aditya Bayu
                </p>
                <button
                  onClick={() => copyToClipboard("1234567890", "BCA")}
                  className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                >
                  {copiedBank === "BCA" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank === "BCA" ? "TERSALIN!" : "SALIN REKENING"}</span>
                </button>
              </div>

              {/* MANDIRI */}
              <div className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                  BANK MANDIRI
                </span>
                <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">
                  0987 6543 21
                </p>
                <p className="font-montserrat text-xs text-[#718096] font-light">
                  a.n. Kirana Larasati
                </p>
                <button
                  onClick={() => copyToClipboard("0987654321", "MANDIRI")}
                  className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                >
                  {copiedBank === "MANDIRI" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank === "MANDIRI" ? "TERSALIN!" : "SALIN REKENING"}</span>
                </button>
              </div>`;

const dynamicBank = `
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                    <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                      BANK {bank.bankName}
                    </span>
                    <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">{bank.accountNumber}</p>
                    <p className="font-montserrat text-xs text-[#718096] font-light">a.n. {bank.accountHolder || bank.bankName}</p>
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, bank.bankName)}
                      className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                    >
                      {copiedBank === bank.bankName ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === bank.bankName ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                    <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                      BANK BCA
                    </span>
                    <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">1234567890</p>
                    <p className="font-montserrat text-xs text-[#718096] font-light">a.n. Aditya Bayu</p>
                    <button
                      onClick={() => copyToClipboard("1234567890", "BCA")}
                      className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                    >
                      {copiedBank === "BCA" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === "BCA" ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
              )}
`;

finalCode = finalCode.replace(bcaMandiriBlock, dynamicBank);

fs.writeFileSync(pathW7, finalCode);
console.log('Moved QR section and patched banks successfully');
