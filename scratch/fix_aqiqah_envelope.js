const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Update line 4800 condition so default bankAccounts populate for isKhitan, isAqiqah, and all static previews
const targetStr = `} else if (isKhitan && (!isCustomInvitation || (isCustomInvitation && (!invitationData?.bank_account || invitationData?.bank_account.trim() === "" || invitationData?.bank_account === "[]")))) {
      bankAccounts = [
        { bankName: "BANK BCA", accountNumber: "1234 5678 90", recipientName: "Adrian Mahendra" },
        { bankName: "OVO / GOPAY", accountNumber: "0812 3456 7890", recipientName: "Natasha Salsabila" }
      ];
    }`;

const replacementStr = `} else if ((isKhitan || isAqiqah || !isCustomInvitation) && (!isCustomInvitation || (isCustomInvitation && (!invitationData?.bank_account || invitationData?.bank_account.trim() === "" || invitationData?.bank_account === "[]")))) {
      bankAccounts = [
        { bankName: "BANK BCA", accountNumber: "1234 5678 90", recipientName: isKhitan ? "Adrian Mahendra" : "Hendra Pratama" },
        { bankName: "OVO / GOPAY", accountNumber: "0812 3456 7890", recipientName: isKhitan ? "Natasha Salsabila" : "Sari Dewi" }
      ];
    }`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync(pageFile, content);
console.log('Successfully enabled Amplop Digital & Dompet Bahagia bank card for Aqiqah 1!');
