const fs = require('fs');
let content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');

// 1. Add formatEventDate function and Date variables
if (!content.includes('const formatEventDate')) {
  const dateStrDecls = 'const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "Sabtu, 17 Februari 2026";';
  content = content.replace(dateStrDecls, 
    `const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch(e) {
      return dateStr;
    }
  };
  const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "2026-02-17";
  const akadDateDisplay = formatEventDate(akadDateStr);`);
  
  content = content.replace('const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;',
    'const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;\n  const resepsiDateDisplay = formatEventDate(resepsiDateStr);');
}

// 2. Replace hardcoded dates in JSX
content = content.replace(/>\{akadDateStr\}<\/p>/g, '>{akadDateDisplay}</p>');
content = content.replace(/>\{resepsiDateStr\}<\/p>/g, '>{resepsiDateDisplay}</p>');

// 3. Fix targetDate for countdown
content = content.replace(/const targetDate = new Date\("2026-02-17T08:00:00"\)\.getTime\(\);/g, 
  'const targetDate = new Date((akadDateStr || "2026-02-17") + "T08:00:00").getTime();');

// 4. Fix Lockscreen and Hero backgrounds
if (!content.includes('const photoCoverUrl')) {
  content = content.replace('const fallbackHero = invitationData?.child_photo_url || "/indo_prewed_simple_1_1785092558852.jpg";',
    `const photoCoverUrl = invitationData?.child_photo_url || "/indo_prewed_simple_1_1785092558852.jpg";
  const fallbackHero = photoCoverUrl;
  const heroPhotoUrl = weddingNotes.heroPhotoUrl || fallbackHero;`);
}

content = content.replace(/src="\/indo_prewed_simple_1_1785092558852\.jpg"/g, (match, offset, str) => {
  // Only replace for cover and hero. 
  // Let's replace the first two occurrences manually.
  return match; 
});

content = content.replace(/<Image\s+src="\/indo_prewed_simple_1_1785092558852\.jpg"\s+alt="Ivanna Cover Photo"/g, 
  '<Image\n              src={photoCoverUrl}\n              alt="Ivanna Cover Photo"');

content = content.replace(/<Image\s+src="\/indo_prewed_simple_1_1785092558852\.jpg"\s+alt="Main Hero Background"/g, 
  '<Image\n              src={heroPhotoUrl}\n              alt="Main Hero Background"');

// 5. Fix Gallery Photos
if (!content.includes('const actualGalleryPhotos =')) {
  content = content.replace(/const galleryPhotos = \[[^\]]+\];/m, 
    `const dbGallery = invitationData?.gallery_images || weddingNotes?.gallery || [];
  const galleryPhotos = dbGallery.length > 0 ? dbGallery : [
    "/indo_prewed_simple_1_1785092558852.jpg",
    "/indo_prewed_couple_2_1785092595152.jpg",
    "/indo_prewed_peakoflove_1_1785094159557.jpg",
    "/indo_prewed_lovequote_2_1785094184195.jpg",
    "/indo_prewed_events_1_1785093412537.jpg",
    "/indo_prewed_livestream_1_1785093423516.jpg",
    "/indo_prewed_gift_1_1785093433664.jpg",
    "/indo_prewed_rsvp_1_1785094172087.jpg",
    "/indo_prewed_closing_1_1785093445446.jpg",
    "/indo_prewed_bride_1_1785092571671.jpg",
    "/indo_prewed_groom_1_1785092582755.jpg"
  ];`);
}

// 6. Fix Bank Accounts
if (!content.includes('const bankAccounts = weddingNotes.bankAccounts')) {
  content = content.replace('const youtubeEmbedId =', 
    `const bankAccounts = weddingNotes.bankAccounts || [
    { bankName: "BANK BCA", accountNumber: "0123 456 789", accountName: "Amanda Manopo" },
    { bankName: "GOPAY / DIGITAL WALLET", accountNumber: "0812 3456 7890", accountName: "Rizky Febrian" }
  ];\n  const youtubeEmbedId =`);
}

// Let's replace the whole Gift section for bank accounts
const giftSectionRegex = /\{activeTabGift === "envelope" \? \([\s\S]*?\) : \(/;
const newGiftSection = `{activeTabGift === "envelope" ? (
                <div className="space-y-6 pt-4 text-left">
                  {bankAccounts.map((bank: any, idx: number) => (
                    <div key={idx} className={\`space-y-2 pb-4 \${idx !== bankAccounts.length - 1 ? 'border-b border-white/10' : ''}\`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-cinzel text-xs text-white uppercase">{bank.bankName}</span>
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-mono text-base font-bold text-white">{bank.accountNumber}</p>
                        <p className="font-montserrat text-xs text-zinc-300">a.n. {bank.accountName}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber, \`bank-\${idx}\`)}
                        className="w-full py-2 border border-white/70 bg-transparent hover:bg-white hover:text-black text-white rounded-full text-[10px] font-cinzel tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                      >
                        {copiedBank === \`bank-\${idx}\` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank === \`bank-\${idx}\` ? "TERSALIN!" : "SALIN NO. REKENING"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (`;
content = content.replace(giftSectionRegex, newGiftSection);

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', content);
console.log('Applied date, cover, hero, gallery, and bank fixes.');
