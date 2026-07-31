const fs = require('fs');

const pathW7 = 'src/components/wedding/Wedding7View.tsx';
let w7 = fs.readFileSync(pathW7, 'utf-8');

// 1. Add bankAccounts dynamic variable
if (!w7.includes('const bankAccounts =')) {
  w7 = w7.replace(
    'const fallbackBride = "/indo_prewed_bride_1_1785092571671.jpg";',
    'const fallbackBride = "/indo_prewed_bride_1_1785092571671.jpg";\n  const bankAccounts = weddingNotes.bankAccount ? JSON.parse(weddingNotes.bankAccount) : [];'
  );
}

// 2. Replace hardcoded bank block with map
const hardcodedBankRegex = /\{\/\* BCA \*\/\}\s*<div className="bg-[#6a8f7f]\/5 p-4 rounded-2xl border border-[#6a8f7f]\/20 text-center space-y-3">[\s\S]*?<\/div>/;

const dynamicBank = `
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank: any, idx: number) => (
                  <div key={idx} className="bg-[#6a8f7f]/5 p-4 rounded-2xl border border-[#6a8f7f]/20 text-center space-y-3">
                    <p className="font-montserrat text-[10px] font-bold text-[#6a8f7f] uppercase tracking-[0.2em]">
                      BANK {bank.bankName}
                    </p>
                    <div className="space-y-1">
                      <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-widest">{bank.accountNumber}</p>
                      <p className="font-montserrat text-xs text-[#4A5568] uppercase font-bold tracking-wider">a.n. {bank.accountHolder || bank.bankName}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, bank.bankName)}
                      className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white border border-[#6a8f7f]/30 text-[10px] font-bold text-[#6a8f7f] uppercase tracking-widest hover:bg-[#6a8f7f] hover:text-white transition-all shadow-sm"
                    >
                      {copiedBank === bank.bankName ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === bank.bankName ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-[#6a8f7f]/5 p-4 rounded-2xl border border-[#6a8f7f]/20 text-center space-y-3">
                    <p className="font-montserrat text-[10px] font-bold text-[#6a8f7f] uppercase tracking-[0.2em]">
                      BANK BCA
                    </p>
                    <div className="space-y-1">
                      <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-widest">1234567890</p>
                      <p className="font-montserrat text-xs text-[#4A5568] uppercase font-bold tracking-wider">a.n. Aditya Bayu</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard("1234567890", "BCA")}
                      className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white border border-[#6a8f7f]/30 text-[10px] font-bold text-[#6a8f7f] uppercase tracking-widest hover:bg-[#6a8f7f] hover:text-white transition-all shadow-sm"
                    >
                      {copiedBank === "BCA" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === "BCA" ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
              )}
`;

w7 = w7.replace(hardcodedBankRegex, dynamicBank);

fs.writeFileSync(pathW7, w7);
console.log('Patched Wedding7View.tsx for dynamic bank accounts');
