const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// 1. Add getDefaultMusicUrl helper inside the component
file = file.replace(
  /const \[musicCatalog, setMusicCatalog\] = useState<\{[^\}]+\}\[\]>\(\[\]\);/,
  `const [musicCatalog, setMusicCatalog] = useState<{id: string, category: string, label: string, url: string}[]>([]);\n\n  const getDefaultMusicUrl = (tab: string, catArray: typeof musicCatalog) => {\n    const cat = tab === "Wedding" ? "Wedding" : (tab === "Birthday" ? "Birthday" : "Umum");\n    const fallback = catArray.find(m => m.category === cat) || catArray.find(m => m.category === "Umum");\n    return fallback ? fallback.url : "Lainnya";\n  };`
);

// 2. Set default music when catalog loads
file = file.replace(
  /setMusicCatalog\(parsed\);/,
  `setMusicCatalog(parsed);\n          setFormData(prev => {\n            if (!prev.music || !prev.music.startsWith("http")) {\n              return { ...prev, music: getDefaultMusicUrl(activeTab, parsed) };\n            }\n            return prev;\n          });`
);

// 3. Update the hardcoded defaults in activeTab change
file = file.replace(
  /music: "Maher Zain - Rahmatun Lil Alameen",/g,
  `music: "",` // will be set by the new logic or we can just leave it empty
);
file = file.replace(
  /music: "Happy Birthday",/g,
  `music: "",`
);
file = file.replace(
  /music: "Beautiful in White - Shane Filan",/g,
  `music: "",`
);

// Wait, the activeTab switch uses `defaultMusic` logic around line 1020:
/*
const defaultMusic = isBirthday
  ? "Happy Birthday"
  : isWedding
  ? "Beautiful in White - Shane Filan"
  : "Maher Zain - Rahmatun Lil Alameen";
*/
file = file.replace(
  /const defaultMusic = isBirthday\n\s*\? "Happy Birthday"\n\s*: isWedding\n\s*\? "Beautiful in White - Shane Filan"\n\s*: "Maher Zain - Rahmatun Lil Alameen";/g,
  `const defaultMusic = getDefaultMusicUrl(selectedThemeType, musicCatalog);`
);

file = file.replace(
  /const defaultMusic = isBirthdayType\n\s*\? "Happy Birthday"\n\s*: isWeddingType\n\s*\? "Beautiful in White - Shane Filan"\n\s*: "Maher Zain - Rahmatun Lil Alameen";/g,
  `const defaultMusic = getDefaultMusicUrl(template.type, musicCatalog);`
);


// 4. Update the text for Foto A and Foto C
file = file.replace(
  /📌 Foto A: Cover Sampul Depan \(Lockscreen\)/g,
  '📌 Foto A: Cover Sampul Depan'
);
file = file.replace(
  /1 Foto · Portrait \(9:16\)\n\s*Foto ini tampil saat pertama kali tamu membuka link undangan \(sebelum klik tombol "Buka Undangan"\)\. Jika kosong, akan menggunakan animasi default atau foto placeholder\./g,
  '1 Foto · Portrait (9:16)\n                                Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"). Hanya 1 foto — bukan background slideshow.'
);

file = file.replace(
  /📌 Foto C: Galeri Foto/g,
  '📌 Foto C: Galeri Foto & background slide show'
);
file = file.replace(
  /Bisa banyak foto · Maks 10\n\s*Unggah foto-foto prewedding Anda di sini\. Foto-foto ini akan ditampilkan di galeri undangan\./g,
  'Bisa banyak foto · Maks 10\n                                Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan sekaligus menjadi background animasi (slide show) di dalam undangan.'
);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log("Formulir music and copywriting fixed!");
