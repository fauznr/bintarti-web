const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const targetStr = '{(isKhitan || isAqiqah) ? (';
const weddingProfileCode = `{isWedding ? (
                <div className="w-full space-y-3 my-auto py-3">
                  {/* Verse Box */}
                  <div className="text-center px-2 mb-1 space-y-1">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-200/80 shadow-sm max-w-[340px] mx-auto">
                      <p className="text-[10px] font-semibold text-slate-800 leading-relaxed font-serif">
                        “Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
                      </p>
                      <span className="block font-black uppercase tracking-wider text-[8px] text-amber-800 mt-1 font-sans">(Q.S. Ar-Rum: 21)</span>
                    </div>
                  </div>

                  {/* Dual Couple Cards */}
                  <div className="flex flex-col gap-2.5 w-full max-w-[340px] mx-auto px-1">
                    {/* Groom */}
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3 text-left">
                      <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-sm">
                        <Image 
                          src={invitationData?.child_photo_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"} 
                          alt="Yoshua" 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-black text-slate-900 leading-tight">Yoshua Pratama, S.T.</h3>
                        <p className="text-[10px] text-slate-500 font-semibold leading-snug">Putra dari Bapak H. Bambang & Ibu Hj. Retno</p>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] text-amber-800 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 mt-0.5">
                          @yoshua_pratama
                        </a>
                      </div>
                    </div>

                    {/* & Icon Divider */}
                    <div className="flex justify-center items-center my-[-10px] z-10">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white font-serif font-black flex items-center justify-center text-xs shadow-md border-2 border-white">
                        &
                      </span>
                    </div>

                    {/* Bride */}
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3 text-left">
                      <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-sm">
                        <Image 
                          src={invitationData?.activities_photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"} 
                          alt="Jessica" 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-black text-slate-900 leading-tight">Jessica Salsabila, S.Ked.</h3>
                        <p className="text-[10px] text-slate-500 font-semibold leading-snug">Putri dari Bapak H. Hendra & Ibu Hj. Ratna</p>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] text-amber-800 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 mt-0.5">
                          @jessica_salsabila
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : ` + targetStr;

if (!content.includes('Yoshua Pratama, S.T.')) {
  content = content.replace(targetStr, weddingProfileCode);
  fs.writeFileSync(pageFile, content);
  console.log('Successfully added Wedding dual profile card rendering!');
} else {
  console.log('Wedding dual profile card already present.');
}
