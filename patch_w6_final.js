const fs = require('fs');
let content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');

// 1. eventDateStr
content = content.replace('const eventDateStr = akadDateStr;', 'const eventDateStr = akadDateDisplay;');

// 2. Instagram
content = content.replace(/href="https:\/\/instagram\.com"/, 'href={`https://instagram.com/${weddingNotes?.brideInstagram?.replace("@","") || ""}`}');
content = content.replace(/href="https:\/\/instagram\.com"/, 'href={`https://instagram.com/${weddingNotes?.groomInstagram?.replace("@","") || ""}`}');

// 3. & 4. PUTRI/PUTRA
content = content.replace('PUTRI KEDUA DARI', 'PUTRI DARI');
content = content.replace('PUTRA KEDUA DARI', 'PUTRA DARI');

// 5. A PEAK OF LOVE dynamic
const loveStoryInjection = `
  const loveStory: Array<{ year: string; title: string; desc: string }> = (() => {
    if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
      return weddingNotes.loveStory.map((s: any) => ({ year: s.year, title: s.title, desc: s.description || s.desc || "" }));
    }
    return [
      { year: "2023", title: "Awal Bertemu", desc: "Pertemuan pertama kami yang sederhana menumbuhkan rasa saling mengerti dan benih-benih cinta yang tulus." }
    ];
  })();
`;

// Insert the loveStory array variable right before useEffect declarations
content = content.replace('  const [currentSlide, setCurrentSlide] = useState(0);', '  const [currentSlide, setCurrentSlide] = useState(0);' + loveStoryInjection);

// Replace the hardcoded A PEAK OF LOVE content
const hardcodedStoryRegex = /<div className="space-y-6 text-center font-montserrat max-w-xs mx-auto">[\s\S]*?<\/div>\s*<\/div>\s*<\/ScrollReveal>/;
const dynamicStory = `<div className="space-y-6 text-center font-montserrat max-w-xs mx-auto">
                {loveStory.map((item, idx) => (
                  <div key={idx} className="space-y-1 py-2 text-center">
                    <h4 className="font-cinzel text-xs font-bold text-white">{item.title}</h4>
                    <span className="text-[10px] text-zinc-400 block mb-1">{item.year}</span>
                    <p className="text-xs text-zinc-200 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>`;

content = content.replace(hardcodedStoryRegex, dynamicStory);

// 6. Bank account name
content = content.replace(/a\.n\. \{bank\.accountName\}/g, 'a.n. {bank.recipientName || bank.accountHolder}');

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', content);
console.log('Applied final UI fixes for Wedding 6.');
