const fs = require('fs');
const path = 'src/components/wedding/Wedding2View.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Love Story Block
const loveStoryRegex = /<div className="space-y-3 bg-\[#FFF\] p-5 rounded-2xl border border-\[#D9CDBC\] shadow-sm">[\s\S]*?<\/div>\s*<\/div>/;
const newLoveStory = `<div className="space-y-3 bg-[#FFF] p-5 rounded-2xl border border-[#D9CDBC] shadow-sm">
                  {loveStory.map((story, idx) => (
                    <div key={idx} className={idx > 0 ? "pt-2 border-t border-[#E5DBCF]" : ""}>
                      <h4 className="font-adea-forum text-lg text-[#2E2B2A] uppercase font-semibold">{story.title}</h4>
                      <p className="text-xs font-adea-montserrat text-[#7A7269] mt-1 leading-relaxed">
                        {story.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>`;
content = content.replace(loveStoryRegex, newLoveStory);

// Replace YouTube iframe
const youtubeRegex = /\{\/\* YouTube Prewedding Video Embed Below Photos \*\/\}\s*<ScrollReveal delay=\{200\} variant="flip-up">[\s\S]*?<\/ScrollReveal>/;
const newYoutube = `{/* YouTube Prewedding Video Embed Below Photos */}
            {(youtubeVideo || videoLink) && (
              <ScrollReveal delay={200} variant="flip-up">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#D9CDBC] shadow-md bg-stone-900 mt-4">
                  <iframe
                    ref={iframeRef}
                    id="youtube-player-iframe"
                    className="w-full h-full border-0"
                    src={(() => {
                      const baseSrc = youtubeVideo 
                        ? \`https://www.youtube.com/embed/\${youtubeVideo.split('v=')[1]?.split('&')[0] || youtubeVideo.split('youtu.be/')[1]?.split('?')[0] || youtubeVideo}\` 
                        : videoLink;
                      return baseSrc.includes('?') ? \`\${baseSrc}&enablejsapi=1\` : \`\${baseSrc}?enablejsapi=1\`;
                    })()}
                    title="Cinematic Prewedding Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </ScrollReveal>
            )}`;
content = content.replace(youtubeRegex, newYoutube);

// Replace Bank Accounts block
const bankRegex = /<div className="space-y-4 font-adea-montserrat">[\s\S]*?<\/div>\s*<\/section>/;
const newBank = `<div className="space-y-4 font-adea-montserrat">
              {bankAccounts.map((bank, idx) => (
                <ScrollReveal key={idx} delay={150 * (idx + 1)} variant={idx % 2 === 0 ? "slide-left" : "slide-right"}>
                  <div className="bg-[#FFF] p-5 rounded-2xl border border-[#D9CDBC] text-left space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-[#2E2B2A] tracking-wider uppercase">{bank.bankName}</span>
                      <Gift className="w-4 h-4 text-[#8C827A]" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#8C827A]">Nomor Rekening:</span>
                      <span className="text-sm font-semibold text-[#2E2B2A] tracking-wider">{bank.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E5DBCF]">
                      <span className="text-xs text-[#6B635B]">a.n. {bank.recipientName}</span>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber, bank.accountNumber)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3D3A37] text-white text-[10px] font-medium hover:bg-[#2E2B2A] transition-all cursor-pointer"
                      >
                        {copiedBank === bank.accountNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedBank === bank.accountNumber ? "Tersalin!" : "Salin Rekening"}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>`;
content = content.replace(bankRegex, newBank);

// Let's manually write back to the file
fs.writeFileSync(path, content);
console.log("Updated components for Wedding 2.");
