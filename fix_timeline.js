const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// Find the index of the timeline start
const startIndex = file.indexOf('<div className="relative border-l-2 border-[#5C3A21] ml-4 pl-6 space-y-6 text-left">');

if (startIndex !== -1) {
  // Find the closing bracket of the map function
  const endIndex = file.indexOf('</ScrollReveal>\n                  </div>\n                </ScrollReveal>', startIndex);
  if (endIndex !== -1) {
    const endBlockIndex = file.indexOf('</section>', endIndex);
    
    // We can just regex replace the specific bad block we created
    file = file.replace(
      /\{\(\(weddingNotes\?\.loveStory && weddingNotes\.loveStory\.length > 0\) \? weddingNotes\.loveStory : \[\n\s*\{ year: "2023", tag: "KAWITAN ☕", title: "Tepang pisanan", desc: "Sepisanan kepanggih wonten ing acara pameran budaya seni ing Jogja, saling tukar sapa lalu terjalin komunikasi\." \},\n\s*\{\(weddingNotes\?\.loveStory \|\| \[\]\)\.map\(\(item: any, idx: number\) => \(/,
      '{((weddingNotes?.loveStory && weddingNotes.loveStory.length > 0) ? weddingNotes.loveStory : [\n                { year: "2023", tag: "KAWITAN ☕", title: "Tepang pisanan", desc: "Sepisanan kepanggih wonten ing acara pameran budaya seni ing Jogja, saling tukar sapa lalu terjalin komunikasi." },\n                { year: "2024", tag: "SANGSULAN ⚡", title: "Komitmen Tresna", desc: "Sakwise setahun nongkrong & diskusi bareng, kita sadar saling melengkapi lan mantap melangkah bareng." },\n                { year: "2025", tag: "PIREMBAGAN 💍", title: "Prosesi Lamaran", desc: "Nyuwun pangestu kalih keluarga besar, dianakake prosesi lamaran adat Jawa ingkang hangat lan khidmat." },\n                { year: "2026", tag: "PAWIWAHAN 💒", title: "Pernikahan Sakral", desc: "Momen sakral pawiwahan ngikat janji suci dadi pasangan garwa lan mbina rumah tangga ingkang berkah." }\n              ]).map((item: any, idx: number) => ('
    );
    
    fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
    console.log("Fixed timeline syntax!");
  } else {
    console.log("End index not found");
  }
} else {
  console.log("Start index not found");
}
