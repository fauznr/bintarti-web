const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1. Add Bank Accounts & Youtube parsing
file = file.replace(
  /const isPro = !!invitationData\?\.is_pro \|\| !!weddingNotes\?\.isPro;/,
  `const isPro = !!invitationData?.is_pro || !!weddingNotes?.isPro;
  
  const youtubeVideo = weddingNotes?.youtubeVideo || null;
  const videoLink = isDemo ? "https://www.youtube.com/embed/5qap5aO4i9A?rel=0" : (invitationData?.video_link || "");

  let bankAccounts: any[] = [];
  try {
    if (weddingNotes?.bankAccounts && Array.isArray(weddingNotes.bankAccounts)) {
      bankAccounts = weddingNotes.bankAccounts;
    } else {
      if (invitationData?.bank_account) {
        const parsed = JSON.parse(invitationData.bank_account as string);
        if (Array.isArray(parsed)) {
          bankAccounts = parsed;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const galleryImages = (invitationData?.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0)
    ? invitationData.gallery_images
    : [`
);

// Remove the old galleryImages
file = file.replace(
  /const galleryImages = \[\n\s*"https:\/\/images\.unsplash\.com\/photo-1519741497674-611481863552\?q=80&w=2000&auto=format&fit=crop",[\s\S]*?\];/,
  ''
);

// 2. Hero Location
file = file.replace(
  /\{akadDateDisplay\.toUpperCase\(\)\} ✦ \{weddingNotes\?\.akadLocation\?\.split\(","\)\[0\]\?\.toUpperCase\(\) \|\| "YOGYAKARTA"\}/,
  '{akadDateDisplay.toUpperCase()}'
);

// 3. Groom & Bride Photos
file = file.replace(
  /src="\/wedding5-hero\.jpg"/,
  'src={weddingNotes?.heroPhotoUrl || "/wedding5-hero.jpg"}'
);
file = file.replace(
  /src="\/wedding5-groom\.jpg"/,
  'src={weddingNotes?.photoGroomUrl || "/wedding5-groom.jpg"}'
);
file = file.replace(
  /src="\/wedding5-bride\.jpg"/,
  'src={weddingNotes?.photoBrideUrl || "/wedding5-bride.jpg"}'
);

// 4. IG Buttons
file = file.replace(
  /<a\n\s*href="https:\/\/instagram\.com"/,
  '<a\n                      href={`https://instagram.com/${weddingNotes?.groomInstagram?.replace("@","") || "farhanmahendra"}`}'
);
// Wait, I need to make sure both get replaced. I'll just use global replace for https://instagram.com
let igCount = 0;
file = file.replace(/href="https:\/\/instagram\.com"/g, (match) => {
  igCount++;
  if (igCount === 1) return 'href={`https://instagram.com/${weddingNotes?.groomInstagram?.replace("@","") || "farhanmahendra"}`}';
  if (igCount === 2) return 'href={`https://instagram.com/${weddingNotes?.brideInstagram?.replace("@","") || "nabilazhafira"}`}';
  return match;
});

// 5. Maps
file = file.replace(
  /href="https:\/\/maps\.google\.com\/\?q=Masjid\+Ghede\+Kauman\+Yogyakarta"/,
  'href={weddingNotes?.akadMaps || "https://maps.google.com/?q=Masjid+Ghede+Kauman+Yogyakarta"}'
);
file = file.replace(
  /href="https:\/\/maps\.google\.com\/\?q=Pendopo\+Royal\+Ambarrukmo\+Yogyakarta"/,
  'href={weddingNotes?.resepsiMaps || "https://maps.google.com/?q=Pendopo+Royal+Ambarrukmo+Yogyakarta"}'
);

// 6. YouTube
// Note: We'll replace the hardcoded src with the baseSrc logic.
file = file.replace(
  /src="https:\/\/www\.youtube\.com\/embed\/5qap5aO4i9A\?rel=0"/,
  `src={youtubeVideo ? \`https://www.youtube.com/embed/\${youtubeVideo.split('v=')[1]?.split('&')[0] || youtubeVideo.split('youtu.be/')[1]?.split('?')[0] || youtubeVideo}\` : videoLink.includes('youtube.com/embed/') ? videoLink : \`https://www.youtube.com/embed/\${videoLink.split('v=')[1]?.split('&')[0] || videoLink.split('youtu.be/')[1]?.split('?')[0] || videoLink}\`}`
);
// Wrap the iframe with a check if youtubeVideo or videoLink exists
file = file.replace(
  /<iframe\n\s*className="w-full h-full rounded-2xl shadow-xl border-4 border-\[#5C3A21\]\/20"\n\s*src=\{youtubeVideo/g,
  `{(youtubeVideo || videoLink) ? (
                  <iframe
                    className="w-full h-full rounded-2xl shadow-xl border-4 border-[#5C3A21]/20"
                    src={youtubeVideo`
);
file = file.replace(
  /allowFullScreen\n\s*><\/iframe>/,
  `allowFullScreen\n                  ></iframe>\n                ) : (\n                  <div className="w-full h-full rounded-2xl bg-[#5C3A21]/10 flex items-center justify-center border-4 border-[#5C3A21]/20">\n                    <span className="text-[#3E2312] font-semibold text-sm">Video belum tersedia</span>\n                  </div>\n                )}`
);

// 7. Bank Accounts
// Replace the hardcoded bank cards with a mapping over bankAccounts
const bankCard1Start = file.indexOf('{/* Bank Card 1 */}');
if (bankCard1Start !== -1) {
  const bankCard2End = file.indexOf('</section>', bankCard1Start);
  if (bankCard2End !== -1) {
    const bankSection = `
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank: any, idx: number) => (
                  <ScrollReveal key={idx} delay={200 + idx * 100}>
                    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border-2 border-[#5C3A21]/40 text-left space-y-3 shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="font-adea-forum text-base font-extrabold text-[#2A1E17] tracking-wider uppercase">{bank.bankName || "BANK"}</span>
                        <span className="text-[9px] font-black text-[#FAF6F0] bg-[#3E2312] border border-[#5C3A21] px-2.5 py-0.5 rounded-full">VERIFIED</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-[#3E2312] font-bold">Nomor Rekening:</span>
                        <span className="text-base font-black text-[#2A1E17] tracking-wider">{bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#5C3A21]/30">
                        <span className="text-xs text-[#3E2C23] font-black">{bank.recipientName || bank.accountHolder}</span>
                        <button
                          onClick={() => copyToClipboard(bank.accountNumber, \`bank-\${idx}\`)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] border border-[#5C3A21] text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
                        >
                          {copiedBank === \`bank-\${idx}\` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#FAF6F0]" />}
                          {copiedBank === \`bank-\${idx}\` ? "Tersalin!" : "Salin No. Rek"}
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))
              ) : (
                <div className="text-center p-4 bg-white/40 rounded-xl border border-[#5C3A21]/20">
                  <span className="text-sm font-semibold text-[#3E2312]">Belum ada data rekening</span>
                </div>
              )}
            </div>
          `;
    file = file.substring(0, bankCard1Start) + bankSection + file.substring(bankCard2End - 13);
  }
}


fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Wedding5View final fixes applied!");
