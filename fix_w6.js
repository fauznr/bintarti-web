const fs = require('fs');

const generateBlock = (num, title, desc, varName, altText) => `
                              {/* Background ${altText} */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  ${num}. ${title}
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">${desc}</p>
                                {${varName} ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={${varName}} alt="${altText} Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => set${varName.charAt(0).toUpperCase() + varName.slice(1)}("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, set${varName.charAt(0).toUpperCase() + varName.slice(1)}, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>`;

const newContent = `                        {/* PENGATURAN BACKGROUND KHUSUS (TEMA PREMIUM) */}
                        {(formData.theme === "Wedding 6") && (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/60 shadow-sm space-y-6 mt-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-amber-200/50">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Camera className="w-4 h-4" />
                              </div>
                              <h3 className="font-bold text-amber-900">Pengaturan Background Tambahan</h3>
                            </div>
                            
                            <p className="text-xs text-amber-800 leading-relaxed font-medium">
                              Khusus tema yang membutuhkan banyak gambar latar (seperti Wedding 6). Silakan unggah foto untuk masing-masing seksi di bawah ini. Jika dibiarkan kosong, sistem akan otomatis menggunakan Foto A sebagai pengganti.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
${generateBlock(1, 'Background Ayat / Kutipan', 'Ditampilkan sebagai latar belakang pada bagian kutipan ayat suci.', 'quoteBgBase64', 'Quote')}
${generateBlock(2, 'Background Kisah Cinta / Love Story', 'Ditampilkan sebagai latar belakang pada awal bagian linimasa kisah cinta.', 'loveStoryBgBase64', 'Love Story')}
${generateBlock(3, 'Background Save The Date', 'Ditampilkan sebagai latar belakang bagian Save The Date.', 'saveTheDateBgBase64', 'Save The Date')}
${generateBlock(4, 'Background Detail Acara / Event', 'Ditampilkan di belakang teks jadwal Akad & Resepsi.', 'eventBgBase64', 'Event')}
${generateBlock(5, 'Background Panduan Pakaian / Dresscode', 'Ditampilkan sebagai latar untuk seksi "A Guide to Attire" (Dresscode).', 'dresscodeBgBase64', 'Dresscode')}
${generateBlock(6, 'Background Our Moment / Gallery', 'Latar belakang untuk membingkai foto-foto galeri Anda.', 'ourMomentBgBase64', 'Our Moment')}
${generateBlock(7, 'Background Buku Tamu / Gift', 'Ditampilkan di belakang seksi pengiriman ucapan dan dompet digital.', 'giftBgBase64', 'Gift')}
${generateBlock(8, 'Background RSVP', 'Ditampilkan sebagai latar form konfirmasi kehadiran.', 'rsvpBgBase64', 'RSVP')}
${generateBlock(9, 'Background Penutup', 'Ditampilkan sebagai latar belakang halaman penutup.', 'photoClosingBase64', 'Closing')}
                            </div>
                          </div>
                        )}`;

const content = fs.readFileSync('src/app/formulir/page.tsx', 'utf-8');
const startTag = '{(formData.theme === "Wedding 6") && (';
const start = content.indexOf(startTag);
if (start === -1) {
  console.log("Could not find Wedding 6 block");
  process.exit(1);
}

const endMarker = '                            </div>\n                          </div>\n                        )}';
let end = content.indexOf(endMarker, start);
if (end === -1) {
  console.log("Could not find end of Wedding 6 block");
  process.exit(1);
}

const finalContent = content.substring(0, start - 24) + newContent + content.substring(end + endMarker.length);
fs.writeFileSync('src/app/formulir/page.tsx', finalContent);
console.log('Successfully updated src/app/formulir/page.tsx');
