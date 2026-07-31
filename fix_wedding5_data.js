const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1. Add variable declarations at the top
if (!file.includes('const groomName =')) {
  file = file.replace(
    /const audioRef = useRef<HTMLAudioElement \| null>\(null\);/,
    `const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic Variables
  const groomNameFull = invitationData?.full_name?.split("&")[0]?.trim() || "Farhan Mahendra, S.T.";
  const brideNameFull = invitationData?.full_name?.split("&")[1]?.trim() || "Nabila Zhafira, S.Psi.";
  const groomNick = invitationData?.nickname?.split("&")[0]?.trim() || "Farhan";
  const brideNick = invitationData?.nickname?.split("&")[1]?.trim() || "Nabila";
  
  const akadDate = weddingNotes?.akadDate || invitationData?.event_date || "2026-11-22";
  const resepsiDate = weddingNotes?.resepsiDate || invitationData?.event_date || "2026-11-22";

  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const akadDateDisplay = formatEventDate(akadDate);
  const resepsiDateDisplay = formatEventDate(resepsiDate);

  const groomName = weddingNotes?.groomName || groomNick;
  const brideName = weddingNotes?.brideName || brideNick;
  const groomParents = weddingNotes?.groomParents || "Bapak Drs. Priyono & Ibu Sri Utami";
  const brideParents = weddingNotes?.brideParents || "Bapak H. Mansur & Ibu Hj. Fatimah";
  
  const quoteText = weddingNotes?.quoteText || "“Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”";
  const quoteSource = weddingNotes?.quoteSource || "(Q.S. Ar-Rum: 21)";
  
  // Update targetDate dynamically
  const targetDate = new Date((akadDate || "2026-11-22") + "T08:00:00").getTime();
`
  );
}

// 2. Replace targetDate
file = file.replace(
  /const targetDate = new Date\("2026-11-22T08:00:00"\)\.getTime\(\);/,
  '// targetDate is now dynamic above'
);

// 3. Replace Hero Names
file = file.replace(
  /Farhan &amp; Nabila/g,
  '{groomNick} & {brideNick}'
);
file = file.replace(
  /Farhan & Nabila/g,
  '{groomNick} & {brideNick}'
);

// 4. Replace Hero Date
file = file.replace(
  /MINGGU, 22 NOVEMBER 2026 ✦ YOGYAKARTA/,
  '{akadDateDisplay.toUpperCase()} ✦ {weddingNotes?.akadLocation?.split(",")[0]?.toUpperCase() || "YOGYAKARTA"}'
);
file = file.replace(
  /PAWIWAHAN AGENG 2026/,
  'PAWIWAHAN AGENG {akadDate ? akadDate.split("-")[0] : "2026"}'
);

// 5. Replace Quotes
file = file.replace(
  /“Dan di antara tanda-tanda \(kebesaran-Nya\) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang\.”/,
  '{quoteText}'
);
file = file.replace(
  /\(Q\.S\. Ar-Rum: 21\)/,
  '{quoteSource}'
);

// 6. Replace Profile Section
file = file.replace(
  /alt="Farhan Mahendra"/,
  'alt={groomNameFull}'
);
file = file.replace(
  /Farhan Mahendra, S\.T\./,
  '{groomNameFull}'
);
file = file.replace(
  /Putra dari Bapak Drs\. Priyono &amp; Ibu Sri Utami/,
  'Putra dari {groomParents}'
);
file = file.replace(
  /alt="Nabila Zhafira"/,
  'alt={brideNameFull}'
);
file = file.replace(
  /Nabila Zhafira, S\.Psi\./,
  '{brideNameFull}'
);
file = file.replace(
  /Putri dari Bapak H\. Mansur &amp; Ibu Hj\. Fatimah/,
  'Putri dari {brideParents}'
);

// 7. Replace Schedule Dates and Times and Locations
file = file.replace(
  /<span>Minggu, 22 November 2026<\/span>/g,
  '<span>{akadDateDisplay}</span>'
);
// Wait, the resepsi might be the second one!
// Let's replace the first one with akad and second with resepsi
let matchCount = 0;
file = file.replace(/<span>\{akadDateDisplay\}<\/span>/g, (match) => {
  matchCount++;
  if (matchCount === 2) return '<span>{resepsiDateDisplay}</span>';
  return match;
});

// Update times and locations
file = file.replace(
  /<span>08:00 WIB - Selesai<\/span>/,
  '<span>{weddingNotes?.akadTime || "08:00 WIB - Selesai"}</span>'
);
file = file.replace(
  /<span>10:00 WIB - Selesai<\/span>/,
  '<span>{weddingNotes?.resepsiTime || "10:00 WIB - Selesai"}</span>'
);
file = file.replace(
  /Masjid Ghede Kauman/,
  '{weddingNotes?.akadLocation || "Masjid Ghede Kauman"}'
);
file = file.replace(
  /Pendopo Royal Ambarrukmo/,
  '{weddingNotes?.resepsiLocation || "Pendopo Royal Ambarrukmo"}'
);
file = file.replace(
  /Jl. Alun-Alun Keraton, Ngupasan, Gondomanan, Yogyakarta/,
  '{weddingNotes?.akadAddress || "Yogyakarta"}'
);
file = file.replace(
  /Jl. Laksda Adisucipto No.81, Ambarukmo, Caturtunggal, Depok, Sleman/,
  '{weddingNotes?.resepsiAddress || "Yogyakarta"}'
);


// 8. Replace QR Code Year
file = file.replace(
  /VIP-\{guestName \? guestName\.substring\(0, 3\)\.toUpperCase\(\) : "TMU"\}-2026/g,
  'VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-{akadDate ? akadDate.split("-")[0] : "2026"}'
);

// 9. Dummy Comments
// Replace the entire useState for comments to use empty array
file = file.replace(
  /const \[comments, setComments\] = useState\(\[\n[\s\S]*?\]\);/,
  'const [comments, setComments] = useState<any[]>([]);'
);


fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Wedding5View dynamic data bindings fixed!");
