const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// Inject akadTitle
const akadTitleUI = `
                            <div className="space-y-1 mt-4">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase">
                                Judul Acara 1 (Opsional, Default: Akad Nikah / Holy Matrimony)
                              </label>
                              <input
                                type="text"
                                name="akadTitle"
                                value={formData.akadTitle || ""}
                                onChange={handleInputChange}
                                placeholder="Contoh: Holy Matrimony"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800"
                              />
                            </div>
`;
file = file.replace(
  'Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *',
  akadTitleUI + '\n                              Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *'
);

// Inject resepsiTitle
const resepsiTitleUI = `
                            <div className="space-y-1 mt-4">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase">
                                Judul Acara 2 (Opsional, Default: Resepsi / Reception)
                              </label>
                              <input
                                type="text"
                                name="resepsiTitle"
                                value={formData.resepsiTitle || ""}
                                onChange={handleInputChange}
                                placeholder="Contoh: Reception"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800"
                              />
                            </div>
`;
file = file.replace(
  'Tanggal Resepsi *',
  resepsiTitleUI + '\n                              Tanggal Resepsi *'
);

// Inject Dresscode UI
const dresscodeUI = `
                        {/* Dresscode Guide (Untuk Wedding 6) */}
                        {(formData.theme === "Wedding 6" || true) && (
                          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 mt-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Shirt className="w-4 h-4" />
                              </div>
                              <h3 className="font-bold text-slate-800">Panduan Pakaian (Dresscode) - Opsional</h3>
                            </div>
                            
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Khusus untuk tema yang mendukung fitur Dresscode (seperti Wedding 6). Kosongkan jika tidak diperlukan.
                            </p>
                            
                            <div className="space-y-4">
                              {formData.dresscodes && formData.dresscodes.map((dress, idx) => (
                                <div key={idx} className="flex items-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                                  <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Nama Warna</label>
                                    <input 
                                      type="text"
                                      value={dress.name}
                                      onChange={(e) => updateDresscode(idx, 'name', e.target.value)}
                                      placeholder="Contoh: Black"
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800"
                                    />
                                  </div>
                                  <div className="w-24 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Kode Hex</label>
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="color"
                                        value={dress.hex}
                                        onChange={(e) => updateDresscode(idx, 'hex', e.target.value)}
                                        className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer bg-transparent"
                                      />
                                      <input 
                                        type="text"
                                        value={dress.hex}
                                        onChange={(e) => updateDresscode(idx, 'hex', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800 uppercase"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDresscode(idx)}
                                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              
                              {formData.dresscodes && formData.dresscodes.length < 10 && (
                                <button
                                  type="button"
                                  onClick={addDresscode}
                                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Tambah Warna Dresscode
                                </button>
                              )}
                            </div>
                          </div>
                        )}
`;
// Inject it before Love Story (Kisah Cinta) section
file = file.replace(
  '{/* Kisah Cinta (Love Story) */}',
  dresscodeUI + '\n                        {/* Kisah Cinta (Love Story) */}'
);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Patched UI logic in formulir');
