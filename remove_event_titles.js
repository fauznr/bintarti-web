const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

const akadBlockStart = file.indexOf('<div className="space-y-1 mt-4">\n                              <label className="text-[10px] font-bold text-slate-400 block uppercase">\n                                Judul Acara 1 (Opsional, Default: Akad Nikah / Holy Matrimony)');
const akadBlockEnd = file.indexOf('Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *');

if (akadBlockStart !== -1 && akadBlockEnd !== -1) {
  file = file.substring(0, akadBlockStart) + '                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pb-2">\n' + file.substring(akadBlockEnd);
}

const resepsiBlockStart = file.indexOf('<div className="space-y-1 mt-4">\n                              <label className="text-[10px] font-bold text-slate-400 block uppercase">\n                                Judul Acara 2 (Opsional, Default: Resepsi / Reception)');
const resepsiBlockEnd = file.indexOf('Tanggal Resepsi *');

if (resepsiBlockStart !== -1 && resepsiBlockEnd !== -1) {
  file = file.substring(0, resepsiBlockStart) + '                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pb-2">\n' + file.substring(resepsiBlockEnd);
}

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Removed event titles from formulir UI');
