const fs = require('fs');
const path = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/sandbox-tema/[id]/page.tsx';
let c = fs.readFileSync(path, 'utf8');

const uiPattern = `                {/* Link Preview Card */}
                {showLinkPreview && (
                  <div className="relative flex p-1.5 mb-2 rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden text-left shadow-sm">
                    {/* Left: Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-12 rounded bg-slate-200 overflow-hidden mr-2 flex items-center justify-center relative">
                      <Image 
                        src={layoutConfig?.cover?.bgUrl || "https://bintarti.store/icon.png"} 
                        alt="Thumbnail" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Middle: Text info */}
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-6 relative z-10">
                      <h4 className="text-[10px] font-bold text-slate-800 truncate" style={averiaFont}>
                        {invitationData?.full_name ? \`Undangan: \${invitationData.full_name}\` : "Undangan Spesial Bintarti"}
                      </h4>
                      <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5 leading-tight" style={averiaFont}>
                        Kami mengundang Bapak/Ibu/Saudara/i untuk hadir.
                      </p>
                      <span className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-wider" style={averiaFont}>bintarti.store</span>
                    </div>
                    
                    {/* Right: X Button */}
                    <button 
                      type="button" 
                      onClick={() => setShowLinkPreview(false)}
                      className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors z-20 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                )}
`;

c = c.replace(uiPattern, '');
// And remove state
c = c.replace('const [showLinkPreview, setShowLinkPreview] = useState(true);\n', '');
fs.writeFileSync(path, c);
console.log('Removed mock link preview');
