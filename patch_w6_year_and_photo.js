const fs = require('fs');

// --- 1. Update Wedding6View.tsx ---
let w6Content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');
// Remove year span
w6Content = w6Content.replace(/<span className="text-\[10px\] text-zinc-400 block mb-1">\{item\.year\}<\/span>\n/g, '');
// Replace hardcoded image
const fallbackRegex = /src="\/indo_prewed_couple_2_1785092595152\.jpg"/;
w6Content = w6Content.replace(fallbackRegex, 'src={weddingNotes.ourStoryPhotoUrl || "/indo_prewed_couple_2_1785092595152.jpg"}');
fs.writeFileSync('src/components/wedding/Wedding6View.tsx', w6Content);
console.log('Updated Wedding6View.tsx');

// --- 2. Update src/app/formulir/page.tsx ---
let formContent = fs.readFileSync('src/app/formulir/page.tsx', 'utf-8');
// Add state
formContent = formContent.replace(
  'const [loveStoryBgBase64, setLoveStoryBgBase64] = useState<string>("");',
  'const [loveStoryBgBase64, setLoveStoryBgBase64] = useState<string>("");\n  const [ourStoryPhotoBase64, setOurStoryPhotoBase64] = useState<string>("");'
);
// Add to submit payload
formContent = formContent.replace(
  'loveStoryBgUrl: loveStoryBgBase64,',
  'loveStoryBgUrl: loveStoryBgBase64,\n          ourStoryPhotoUrl: ourStoryPhotoBase64,'
);
// Load from parsed
formContent = formContent.replace(
  'setLoveStoryBgBase64(parsed.loveStoryBgUrl || "");',
  'setLoveStoryBgBase64(parsed.loveStoryBgUrl || "");\n          setOurStoryPhotoBase64(parsed.ourStoryPhotoUrl || "");'
);
// Add UI block
const newMediaBlock = `
                              {/* Foto Center Love Story */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  Foto Tengah Kisah Cinta / A Peak of Love
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai foto utama di tengah linimasa kisah cinta (khusus Wedding 6).</p>
                                {ourStoryPhotoBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 w-1/2 mx-auto">
                                    <img src={ourStoryPhotoBase64} alt="Our Story Photo" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setOurStoryPhotoBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOurStoryPhotoBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
`;

formContent = formContent.replace(
  '{/* Background Love Story */}',
  newMediaBlock + '\n\n                              {/* Background Love Story */}'
);
fs.writeFileSync('src/app/formulir/page.tsx', formContent);
console.log('Updated formulir/page.tsx');

// --- 3. Update src/app/admin/page.tsx ---
let adminContent = fs.readFileSync('src/app/admin/page.tsx', 'utf-8');
adminContent = adminContent.replace(
  "{ key: 'loveStoryBgUrl', label: '2. Background Kisah Cinta / Love Story' },",
  "{ key: 'loveStoryBgUrl', label: '2. Background Kisah Cinta / Love Story' },\n                          { key: 'ourStoryPhotoUrl', label: 'Foto Tengah Kisah Cinta / A Peak of Love (Khusus Wedding 6)' },"
);
fs.writeFileSync('src/app/admin/page.tsx', adminContent);
console.log('Updated admin/page.tsx');
