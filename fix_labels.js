const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

const badAkad = `                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                
                                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pb-2">
Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *
                              </label>`;
const goodAkad = `                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *
                              </label>`;

file = file.replace(badAkad, goodAkad);

const badResepsi = `                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                
                                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pb-2">
Tanggal Resepsi *
                              </label>`;
const goodResepsi = `                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Resepsi *
                              </label>`;

file = file.replace(badResepsi, goodResepsi);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Fixed label syntax errors');
