const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

const bgUploadsUI = `
                        {/* PENGATURAN BACKGROUND KHUSUS (TEMA PREMIUM) */}
                        {(formData.theme === "Wedding 6" || true) && (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/60 shadow-sm space-y-6 mt-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-amber-200/50">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Image className="w-4 h-4" />
                              </div>
                              <h3 className="font-bold text-amber-900">Pengaturan Background Tambahan</h3>
                            </div>
                            
                            <p className="text-xs text-amber-800 leading-relaxed font-medium">
                              Khusus tema yang membutuhkan banyak gambar latar (seperti Wedding 6). Silakan unggah foto untuk masing-masing seksi di bawah ini. Jika dibiarkan kosong, sistem akan otomatis menggunakan Foto A sebagai pengganti.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Background Quotes */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  1. Background Ayat / Kutipan
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang pada bagian kutipan ayat suci.</p>
                                {quoteBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={quoteBgBase64} alt="Quote Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setQuoteBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setQuoteBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Kisah Cinta */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  2. Background Kisah Cinta
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang pada awal bagian linimasa kisah cinta.</p>
                                {loveStoryBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={loveStoryBgBase64} alt="Love Story Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setLoveStoryBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLoveStoryBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Acara */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  3. Background Detail Acara
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan di belakang teks jadwal Akad & Resepsi.</p>
                                {eventBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={eventBgBase64} alt="Event Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setEventBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEventBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Dresscode */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  4. Background Panduan Pakaian
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar untuk seksi "A Guide to Attire" (Dresscode).</p>
                                {dresscodeBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={dresscodeBgBase64} alt="Dresscode Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setDresscodeBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setDresscodeBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Our Moment */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  5. Background Our Moment (Galeri)
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Latar belakang untuk membingkai foto-foto galeri Anda.</p>
                                {ourMomentBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={ourMomentBgBase64} alt="Our Moment Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setOurMomentBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOurMomentBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Gift */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  6. Background Buku Tamu & Amplop
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan di belakang seksi pengiriman ucapan dan dompet digital.</p>
                                {giftBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={giftBgBase64} alt="Gift Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setGiftBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setGiftBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
                              
                              {/* Background RSVP */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  7. Background RSVP
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar form konfirmasi kehadiran.</p>
                                {rsvpBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={rsvpBgBase64} alt="RSVP Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setRsvpBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setRsvpBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
                              
                              {/* Background QR Code */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  8. Background QR Code Presensi
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan di belakang kotak QR Code untuk tamu undangan VIP.</p>
                                {qrBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={qrBgBase64} alt="QR Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setQrBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setQrBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                            </div>
                          </div>
                        )}
`;

// Inject before Penutup
if (file.includes('{/* FOTO HALAMAN PENUTUP (KHUSUS WEDDING 3) */}')) {
  file = file.replace(
    '{/* FOTO HALAMAN PENUTUP (KHUSUS WEDDING 3) */}',
    bgUploadsUI + '\n                        {/* FOTO HALAMAN PENUTUP (KHUSUS WEDDING 3) */}'
  );
  fs.writeFileSync('src/app/formulir/page.tsx', file);
  console.log('Successfully injected background uploads!');
} else {
  console.log('Target string still not found!');
}
