const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1 & 2. Fix Photo URLs mapping
file = file.replace(/photoGroomUrl/g, 'groomPhotoUrl');
file = file.replace(/photoBrideUrl/g, 'bridePhotoUrl');

// 3 & 4. Fix Maps URLs mapping
file = file.replace(/akadMaps/g, 'akadGmaps');
file = file.replace(/resepsiMaps/g, 'resepsiGmaps');

// 5 & 6. Fix Times
file = file.replace(
  /<span>08:00 WIB - 10:00 WIB<\/span>/,
  '<span>{weddingNotes?.akadTime || "08:00 WIB - 10:00 WIB"}</span>'
);
file = file.replace(
  /<span>11:00 WIB - 15:00 WIB<\/span>/,
  '<span>{weddingNotes?.resepsiTime || "11:00 WIB - 13:00 WIB"}</span>'
);

// 7 & 8. Fix Lockscreen names and alt
file = file.replace(
  /Damar <span className="text-\[#E6C294\] font-adea-lora italic font-normal">&amp;<\/span> Sekar/,
  '{groomNick} <span className="text-[#E6C294] font-adea-lora italic font-normal">&amp;</span> {brideNick}'
);
file = file.replace(
  /alt="Damar & Sekar"/,
  'alt={`${groomNick} & ${brideNick}`}'
);

// 9 & 10. Fix Locations in text
file = file.replace(
  /<span>Masjid Keraton Yogyakarta, Alun-Alun Utara<\/span>/,
  '<span>{weddingNotes?.akadLocation || "Masjid Ghede Kauman, Yogyakarta"}</span>'
);
file = file.replace(
  /<span>\{weddingNotes\?\.resepsiLocation \|\| "Pendopo Royal Ambarrukmo"\} Yogyakarta<\/span>/,
  '<span>{weddingNotes?.resepsiLocation || "Pendopo Royal Ambarrukmo, Yogyakarta"}</span>'
);

// 11. IG buttons text
file = file.replace(
  /@farhan_mahendra/,
  '@{weddingNotes?.groomInstagram?.replace("@","") || "farhan_mahendra"}'
);
file = file.replace(
  /@nabila_zhafira/,
  '@{weddingNotes?.brideInstagram?.replace("@","") || "nabila_zhafira"}'
);

// 12. ICS Data
file = file.replace(
  /const icsData = "BEGIN:VCALENDAR\\nVERSION:2\.0\\nBEGIN:VEVENT\\nSUMMARY:Pernikahan Damar & Sekar\\nLOCATION:Pendopo Royal Ambarrukmo Yogyakarta\\nEND:VEVENT\\nEND:VCALENDAR";/,
  'const icsData = `BEGIN:VCALENDAR\\nVERSION:2.0\\nBEGIN:VEVENT\\nSUMMARY:Pernikahan ${groomNick} & ${brideNick}\\nLOCATION:${weddingNotes?.resepsiLocation || "Yogyakarta"}\\nEND:VEVENT\\nEND:VCALENDAR`;'
);
file = file.replace(
  /a\.download = "Pernikahan_Damar_Sekar\.ics";/,
  'a.download = `Pernikahan_${groomNick}_${brideNick}.ics`;'
);

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Real fixes applied to Wedding5View!");
