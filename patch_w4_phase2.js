const fs = require('fs');

let content = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');

// Replace Kenzo & Valerie
content = content.replace(
  'Kenzo <span className="text-slate-400 font-serif italic font-normal">&amp;</span> Valerie',
  '{groomName} <span className="text-slate-400 font-serif italic font-normal">&amp;</span> {brideName}'
);

content = content.replace(
  '#KenzoValerieMatched',
  '{weddingNotes?.hashtag || "#MenujuHalal"}'
);

// Replace Cover date
content = content.replace(
  '<p className="text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">\\n              Selasa, 18 Agustus 2026\\n            </p>',
  '<p className="text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">\\n              {akadDate}\\n            </p>'
);

// Main header date
content = content.replace(
  '18.08.2026 ✦ JAKARTA',
  '{akadDate} ✦ {akadLocation.toUpperCase()}'
);

// Groom section
content = content.replace('Dimas Anggara, S.Kom.', '{groomFullName}');
content = content.replace('Bapak H. Subagyo & Ibu Hj. Tri Murni', '{groomParents}');
content = content.replace('@dimas_anggara', '{groomIg}');
content = content.replace('href="https://instagram.com/dimas_anggara"', 'href={`https://instagram.com/${groomIg.replace("@", "")}`}');
content = content.replace('src="/wedding4-groom.jpg"', 'src={groomPhoto}');

// Bride section
content = content.replace('Annisa Rahma, S.E.', '{brideFullName}');
content = content.replace('Bapak Dr. H. Faisal & Ibu Hj. Nuraini', '{brideParents}');
content = content.replace('@annisa_rahma', '{brideIg}');
content = content.replace('href="https://instagram.com/annisa_rahma"', 'href={`https://instagram.com/${brideIg.replace("@", "")}`}');
content = content.replace('src="/wedding4-bride.jpg"', 'src={bridePhoto}');

// Event Section (Akad / Pemberkatan)
content = content.replace('Akad Nikah', '{eventTypeLabel}');
content = content.replace('Selasa, 18 Agustus 2026', '{akadDate}');
content = content.replace('08:00 WIB - 10:00 WIB', '{akadTime}');
content = content.replace('Masjid Ramlie Musofa, Jakarta Utara', '{akadLocation}');
content = content.replace('Jl. Danau Sunter Utara Raya Sel. No.12C, Sunter Agung, Tanjung Priok, Jakarta Utara', '{akadAddress}');

// Resepsi
// The first 'Selasa, 18 Agustus 2026' was akadDate, the next is resepsiDate
content = content.replace('Selasa, 18 Agustus 2026', '{resepsiDate}');
content = content.replace('11:00 WIB - 15:00 WIB', '{resepsiTime}');
content = content.replace('Glass House Ballroom, Park Hyatt Jakarta', '{resepsiLocation}');
content = content.replace('Lantai 36, Jl. Kebon Sirih No.17-19, Jakarta Pusat', '{resepsiAddress}');


// Replace Bank Accounts logic
const bankOrig = `const bankAccounts = [
    { id: "bca", bank: "BCA", accNumber: "8830 1928 44", name: "Dimas Anggara" },
    { id: "gopay", bank: "GOPAY / OVO", accNumber: "0812 9988 7766", name: "Annisa Rahma" }
  ];`;
const bankNew = `const bankAccounts = Array.isArray(invitationData?.bank_accounts) && invitationData.bank_accounts.length > 0 
    ? invitationData.bank_accounts 
    : (weddingNotes?.giftAccounts || []);`;
content = content.replace(bankOrig, bankNew);

// Replace Love Story logic
const storyOrig = `const loveStoryItems = [
    {
      year: "2022",
      title: "First Swipe, First Coffee",
      description: "Match di dating app, lanjut ngopi di Senopati. Ngobrol sampai kafe tutup."
    },
    {
      year: "2023",
      title: "Officially Us",
      description: "Setelah jalan bareng 6 bulan, akhirnya resmi pacaran pas nonton konser bareng."
    },
    {
      year: "2025",
      title: "The Proposal",
      description: "Dimas tiba-tiba ngeluarin cincin pas kita lagi sunset-an santai di Bali."
    },
    {
      year: "2026",
      title: "Tying the Knot",
      description: "Hari di mana kita bakal janji buat bareng-bareng selamanya. Can't wait!"
    }
  ];`;
const storyNew = `const loveStoryItems = Array.isArray(invitationData?.love_story) && invitationData.love_story.length > 0
    ? invitationData.love_story
    : (weddingNotes?.loveStory || []);`;
content = content.replace(storyOrig, storyNew);


// Hide QR Section if not Pro
const qrSectionOrig = `{/* SECTION 7: QR CODE PRESENSI */}`;
const qrSectionNew = `{isPro && (\\n        {/* SECTION 7: QR CODE PRESENSI */}`;
content = content.replace(qrSectionOrig, qrSectionNew);

// Actually just doing standard replace for QR button:
content = content.replace(
  '<button\\n              onClick={() => setShowQrModal(true)}',
  '{isPro && (<button\\n              onClick={() => setShowQrModal(true)}'
);
content = content.replace(
  'title="QR Code Presensi Tamu"\\n            >\\n              <QrCode className="w-5 h-5 text-slate-900 group-hover:text-amber-500 transition-colors" />\\n            </button>',
  'title="QR Code Presensi Tamu"\\n            >\\n              <QrCode className="w-5 h-5 text-slate-900 group-hover:text-amber-500 transition-colors" />\\n            </button>)}'
);

// Replace QR Code link
content = content.replace(
  'src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("VIP-TMU-2026")}`}',
  'src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(\`https://bintarti.store/checkin?id=\${themeId}&code=\${encodeURIComponent(guestName)}&type=Wedding\`)}`}'
);
content = content.replace(
  'src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent("VIP-TMU-2026")}`}',
  'src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(\`https://bintarti.store/checkin?id=\${themeId}&code=\${encodeURIComponent(guestName)}&type=Wedding\`)}`}'
);
content = content.replace(
  'VIP-TMU-2026',
  '{guestName.toUpperCase()}'
);

// Remove the `isPro &&` from the first attempt since it's hard to target via simple string replacement exactly.
// I will just use regex to target the QR section
content = content.replace(
  /<section id="qrcode-section" className="py-16 px-6 text-center space-y-6 border-b border-slate-200\/80 bg-slate-50 text-slate-800">([\s\S]*?)<\/section>/,
  '{isPro && (<section id="qrcode-section" className="py-16 px-6 text-center space-y-6 border-b border-slate-200/80 bg-slate-50 text-slate-800">$1</section>)}'
);

fs.writeFileSync('src/components/wedding/Wedding4View.tsx', content);
console.log('Phase 2 JS done');
