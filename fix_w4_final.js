const fs = require('fs');

let content = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');

// 1. Cover Photo URL logic
const coverOld = 'const coverPhotoUrl = weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg";';
const coverNew = 'const coverPhotoUrl = invitationData?.child_photo_url || invitationData?.childPhotoUrl || weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg";';
content = content.replace(coverOld, coverNew);

// 2. Remove "✦ QWE" (which was akadLocation) from the cover frame
content = content.replace(
  '{akadDate} ✦ {akadLocation.toUpperCase()}',
  '{akadDate}'
);

// 3. Fix Bank Accounts parsing
const bankOld = `  const bankAccounts = (Array.isArray(invitationData?.bank_accounts) && invitationData.bank_accounts.length > 0)
    ? invitationData.bank_accounts
    : (weddingNotes?.bankAccounts || weddingNotes?.giftAccounts || []);`;
const bankNew = `  let parsedBanks = [];
  try {
    if (invitationData?.bank_account && typeof invitationData.bank_account === "string") {
      parsedBanks = JSON.parse(invitationData.bank_account);
    } else if (Array.isArray(invitationData?.bank_accounts) && invitationData.bank_accounts.length > 0) {
      parsedBanks = invitationData.bank_accounts;
    }
  } catch (e) {}

  const bankAccounts = parsedBanks.length > 0
    ? parsedBanks
    : (weddingNotes?.bankAccounts || weddingNotes?.giftAccounts || []);`;
// Note: My previous script used slightly different formatting, let's use a regex that matches `const bankAccounts = ...`
content = content.replace(
  /const bankAccounts = Array\.isArray\(invitationData\?\.bank_accounts\)[\s\S]*?\n\s*: \(weddingNotes\?\.bankAccounts \|\| weddingNotes\?\.giftAccounts \|\| \[\]\);/m,
  bankNew
);


// 4. Groom and Bride IG
content = content.replace(
  /const groomIg\s*=\s*weddingNotes\?\.groomIg\s*\|\|\s*\"\{groomIg\}\";/g,
  'const groomIg        = weddingNotes?.groomInstagram           || "";'
);
content = content.replace(
  /const brideIg\s*=\s*weddingNotes\?\.brideIg\s*\|\|\s*\"\{brideIg\}\";/g,
  'const brideIg        = weddingNotes?.brideInstagram           || "";'
);

// 5. Akad Date in Akad Section
content = content.replace(
  /<div className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-black tracking-wider uppercase">\s*AKAD NIKAH 🕌\s*<\/div>\s*<div className="space-y-2">\s*<div className="flex justify-center items-center gap-2 text-slate-900 text-sm font-extrabold">\s*<Calendar className="w-4 h-4 text-slate-700" \/>\s*<span>\{resepsiDate\}<\/span>/,
  '<div className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-black tracking-wider uppercase">\n                  AKAD NIKAH 🕌\n                </div>\n\n                <div className="space-y-2">\n                  <div className="flex justify-center items-center gap-2 text-slate-900 text-sm font-extrabold">\n                    <Calendar className="w-4 h-4 text-slate-700" />\n                    <span>{akadDate}</span>'
);

// 6. Akad Address
content = content.replace(
  /<span>Masjid Ramlie Musofa, Sunter, Jakarta Utara<\/span>/g,
  '<span>{akadLocation}</span>'
);

// 7. Resepsi Date
content = content.replace(
  /<span>Selasa, 18 Agustus 2026<\/span>/g,
  '<span>{resepsiDate}</span>'
);

fs.writeFileSync('src/components/wedding/Wedding4View.tsx', content);
console.log('Final touches applied');
