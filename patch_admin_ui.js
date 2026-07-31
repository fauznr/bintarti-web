const fs = require('fs');
let file = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const bgAdminUI = `
                    {/* WEDDING 6 EXTRA BACKGROUNDS */}
                    {(selectedInvitation.theme === "Wedding 6" || true) && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 space-y-4">
                        <h5 className="font-bold text-amber-800 mb-2">🖼️ Pengaturan Background Tambahan</h5>
                        
                        {[
                          { key: 'quoteBgUrl', label: 'Background Ayat / Kutipan' },
                          { key: 'loveStoryBgUrl', label: 'Background Kisah Cinta' },
                          { key: 'eventBgUrl', label: 'Background Detail Acara' },
                          { key: 'dresscodeBgUrl', label: 'Background Panduan Pakaian' },
                          { key: 'ourMomentBgUrl', label: 'Background Our Moment (Galeri)' },
                          { key: 'giftBgUrl', label: 'Background Buku Tamu & Amplop' },
                          { key: 'rsvpBgUrl', label: 'Background RSVP' },
                          { key: 'qrBgUrl', label: 'Background QR Code Presensi' }
                        ].map(bg => (
                          <div key={bg.key} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">{bg.label} - URL</label>
                            <input
                              type="text"
                              value={modalDetails.weddingData?.[bg.key] || ""}
                              onChange={(e) => handleWeddingDataChange(bg.key, e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-slate-800"
                            />
                          </div>
                        ))}
                      </div>
                    )}
`;

// Inject into admin/page.tsx
file = file.replace(
  '{selectedInvitation.theme === "Wedding 3" && (',
  bgAdminUI + '\n                    {selectedInvitation.theme === "Wedding 3" && ('
);

fs.writeFileSync('src/app/admin/page.tsx', file);
console.log('Patched admin background uploads UI');
