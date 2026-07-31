const fs = require('fs');

let content = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');

// 1. bgPhotos
const bgPhotosOld = `  const bgPhotos = (invitationData?.galleryPhotos && invitationData.galleryPhotos.length > 0)
    ? invitationData.galleryPhotos
    : [
        weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg",
        "/wedding4-couple1.jpg",
        "/wedding4-couple2.jpg"
      ];`;
const bgPhotosNew = `  const coverPhotoUrl = weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg";
  const bgPhotos = (Array.isArray(invitationData?.gallery_images) && invitationData.gallery_images.length > 0)
    ? invitationData.gallery_images
    : [
        coverPhotoUrl,
        "/wedding4-couple1.jpg",
        "/wedding4-couple2.jpg"
      ];
      
  const loveStoryItems = Array.isArray(invitationData?.love_story) && invitationData.love_story.length > 0
    ? invitationData.love_story
    : (weddingNotes?.loveStory || []);
    
  const bankAccounts = Array.isArray(invitationData?.bank_accounts) && invitationData.bank_accounts.length > 0 
    ? invitationData.bank_accounts 
    : (weddingNotes?.giftAccounts || []);`;
content = content.replace(bgPhotosOld, bgPhotosNew);


// 2. Framed Image inside CHAPTER 01
const frameImageOld = `<Image 
                    src={bgPhotos[0]}
                    alt={\`\${groomName} & \${brideName}\`}
                    fill
                    className="object-cover"
                  />`;
const frameImageNew = `<Image 
                    src={coverPhotoUrl}
                    alt={\`\${groomName} & \${brideName}\`}
                    fill
                    className="object-cover"
                  />`;
content = content.replace(frameImageOld, frameImageNew);


// 3. Groom Parents & IG
content = content.replace(/Putra dari Bapak H\. Subagyo &amp; Ibu Hj\. Tri Murni/g, 'Putra dari {groomParents}');
content = content.replace(
  /<a \n                    href="https:\/\/instagram\.com" \n                    target="_blank" \n                    rel="noopener noreferrer" \n                    className="inline-flex items-center gap-1\.5 text-\[10px\] font-bold text-slate-700 bg-slate-100 px-3\.5 py-1\.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"\n                  >\n                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"\/><path d="M16 11\.37A4 4 0 1 1 12\.63 8 4 4 0 0 1 16 11\.37z"\/><line x1="17\.5" y1="6\.5" x2="17\.51" y2="6\.5"\/><\/svg> @dimas_anggara\n                  <\/a>/g,
  `{groomIg && (<a \n                    href={\`https://instagram.com/\${groomIg.replace("@", "")}\`} \n                    target="_blank" \n                    rel="noopener noreferrer" \n                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"\n                  >\n                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> {groomIg}\n                  </a>)}`
);

// 4. Bride Parents & IG
content = content.replace(/Putri dari Bapak Dr\. H\. Faisal &amp; Ibu Hj\. Nuraini/g, 'Putri dari {brideParents}');
content = content.replace(
  /<a \n                    href="https:\/\/instagram\.com" \n                    target="_blank" \n                    rel="noopener noreferrer" \n                    className="inline-flex items-center gap-1\.5 text-\[10px\] font-bold text-slate-700 bg-slate-100 px-3\.5 py-1\.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"\n                  >\n                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"\/><path d="M16 11\.37A4 4 0 1 1 12\.63 8 4 4 0 0 1 16 11\.37z"\/><line x1="17\.5" y1="6\.5" x2="17\.51" y2="6\.5"\/><\/svg> @annisa_rahma\n                  <\/a>/g,
  `{brideIg && (<a \n                    href={\`https://instagram.com/\${brideIg.replace("@", "")}\`} \n                    target="_blank" \n                    rel="noopener noreferrer" \n                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"\n                  >\n                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> {brideIg}\n                  </a>)}`
);

// 5. Love Story Loop
const storyOld = `{[
                { year: "2022", badge: "FIRST EYE CONTACT ☕", title: "Tak Sengaja Ketemu", desc: "Pertama kali ketemu di coffee shop aesthetic di Senopati, saling lirik lalu tukeran Instagram." },
                { year: "2023", badge: "OFFICIALLY DATING ⚡", title: "Resmi Pacaran", desc: "Satu tahun nongkrong bareng, baru sadar kita klop banget. Akhirnya jadian di akhir tahun!" },
                { year: "2025", badge: "SHE SAID YES! 💍", title: "Momen Lamaran", desc: "Dimas kejutan lamaran pas sunset trip di Bali. She said YES tanpa ragu!" },
                { year: "2026", badge: "THE BIG DAY 💒", title: "Menikah!", desc: "Momen spesial mengikat janji suci dan memulai perjalanan keluarga kecil bahagia kami." }
              ].map((item, idx) => (`;
const storyNew = `{(loveStoryItems.length > 0 ? loveStoryItems : [
                { year: "2022", badge: "FIRST EYE CONTACT ☕", title: "Tak Sengaja Ketemu", desc: "Pertama kali ketemu di coffee shop aesthetic di Senopati, saling lirik lalu tukeran Instagram." },
                { year: "2023", badge: "OFFICIALLY DATING ⚡", title: "Resmi Pacaran", desc: "Satu tahun nongkrong bareng, baru sadar kita klop banget. Akhirnya jadian di akhir tahun!" },
                { year: "2025", badge: "SHE SAID YES! 💍", title: "Momen Lamaran", desc: "Dimas kejutan lamaran pas sunset trip di Bali. She said YES tanpa ragu!" },
                { year: "2026", badge: "THE BIG DAY 💒", title: "Menikah!", desc: "Momen spesial mengikat janji suci dan memulai perjalanan keluarga kecil bahagia kami." }
              ]).map((item: any, idx: number) => (`;
content = content.replace(storyOld, storyNew);

// Fix love story item properties based on standard bintarti schema
content = content.replace(
  /<span className="px-2\.5 py-0\.5 rounded-full bg-slate-900 text-white font-extrabold text-\[10px\]">\n\s*{item\.year}\n\s*<\/span>/g,
  `<span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-extrabold text-[10px]">\n                        {item.year || item.tahun}\n                      </span>`
);
content = content.replace(
  /<span className="text-\[9px\] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0\.5 rounded-full">\n\s*{item\.badge}\n\s*<\/span>/g,
  `{item.badge && (<span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">\n                        {item.badge}\n                      </span>)}`
);
content = content.replace(
  /<h4 className="text-sm font-black text-slate-900">{item\.title}<\/h4>/g,
  `<h4 className="text-sm font-black text-slate-900">{item.title || item.judul}</h4>`
);
content = content.replace(
  /<p className="text-xs text-slate-600 leading-relaxed font-normal">{item\.desc}<\/p>/g,
  `<p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc || item.description || item.cerita}</p>`
);


// 6. ICS Download Name
content = content.replace(/Pernikahan Kenzo & Valerie/g, 'Pernikahan ${groomName} & ${brideName}');
content = content.replace(/Pernikahan_Kenzo_Valerie\.ics/g, 'Pernikahan_${groomName}_${brideName}.ics');


// 7. Gallery mapping
content = content.replace(
  /\{bgPhotos\.map\(\(src: string, idx: number\) => \(/g,
  `{galleryImages.map((src: string, idx: number) => (`
);


// 8. Bank Account mapping
const bankOld = `{/* Bank Transfer Card 1 */}
              <ScrollReveal delay={200}>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 text-left space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-slate-900">BCA</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">TRANSFER</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-medium">Nomor Rekening:</span>
                    <span className="text-base font-black text-slate-900 tracking-wider">8830 1928 44</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600 font-bold">a.n. {groomFullName}</span>
                    <button
                      onClick={() => copyToClipboard("8830192844", "bca")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedBank === "bca" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedBank === "bca" ? "Tersalin!" : "Salin No. Rek"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* E-Wallet Card 2 */}
              <ScrollReveal delay={300}>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 text-left space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-slate-900">GOPAY / OVO</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">E-WALLET</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-medium">Nomor Handphone:</span>
                    <span className="text-base font-black text-slate-900 tracking-wider">0812 9988 7766</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600 font-bold">a.n. {brideFullName}</span>
                    <button
                      onClick={() => copyToClipboard("081299887766", "ewallet")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedBank === "ewallet" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedBank === "ewallet" ? "Tersalin!" : "Salin E-Wallet"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>`;

const bankNew = `{bankAccounts.map((bank: any, idx: number) => (
                <ScrollReveal delay={200 + (idx * 50)} key={idx}>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 text-left space-y-3 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-slate-900">{bank.bank || bank.bank_name}</span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">TRANSFER</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 font-medium">Nomor Rekening / No. HP:</span>
                      <span className="text-base font-black text-slate-900 tracking-wider">{bank.accNumber || bank.no_rekening || bank.account_number}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-600 font-bold">a.n. {bank.name || bank.nama_pemilik || bank.account_name}</span>
                      <button
                        onClick={() => copyToClipboard(bank.accNumber || bank.no_rekening || bank.account_number, bank.bank || bank.bank_name || bank.id || idx.toString())}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                      >
                        {copiedBank === (bank.bank || bank.bank_name || bank.id || idx.toString()) ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedBank === (bank.bank || bank.bank_name || bank.id || idx.toString()) ? "Tersalin!" : "Salin No. Rek"}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}`;
              
content = content.replace(bankOld, bankNew);


fs.writeFileSync('src/components/wedding/Wedding4View.tsx', content);
console.log('Successfully applied FULL fix to Wedding4View!');
