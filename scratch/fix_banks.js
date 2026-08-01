const fs = require('fs');

// W4
let c4 = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');
c4 = c4.replace(
  /: \(weddingNotes\?\.bankAccounts \|\| weddingNotes\?\.giftAccounts \|\| \[\]\);/,
  ': (weddingNotes?.bankAccounts || weddingNotes?.giftAccounts || [{ bankName: "BANK BCA", accountNumber: "1234567890", recipientName: groomName }, { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: brideName }]);'
);
fs.writeFileSync('src/components/wedding/Wedding4View.tsx', c4);

// W5
let c5 = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');
c5 = c5.replace(
  'let bankAccounts: any[] = [];',
  'let bankAccounts: any[] = [{ bankName: "BANK BCA", accountNumber: "1234567890", recipientName: groomNick }, { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: brideNick }];'
);
fs.writeFileSync('src/components/wedding/Wedding5View.tsx', c5);

// W7
let c7 = fs.readFileSync('src/components/wedding/Wedding7View.tsx', 'utf8');
c7 = c7.replace(
  'const bankAccounts = weddingNotes.bankAccount ? JSON.parse(weddingNotes.bankAccount) : [];',
  'const bankAccounts = weddingNotes.bankAccount ? JSON.parse(weddingNotes.bankAccount) : [{ bankName: "BANK BCA", accountNumber: "1234567890", recipientName: "Aditya" }, { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: "Kirana" }];'
);
fs.writeFileSync('src/components/wedding/Wedding7View.tsx', c7);

console.log('done');
