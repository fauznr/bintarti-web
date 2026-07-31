const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

// 1. SECTION 2: QUOTE
file = file.replace(
  'src="/indo_prewed_lovequote_2_1785094184195.jpg"',
  'src={quoteBgUrl}'
);

// 2. SECTION 3: PROFILE
file = file.replace(
  'src="/indo_prewed_bride_1_1785092571671.jpg"',
  'src={bridePhotoUrl}'
);
file = file.replace(
  'src="/indo_prewed_groom_1_1785092582755.jpg"',
  'src={groomPhotoUrl}'
);

// 3. SECTION 4: PEAK OF LOVE
file = file.replace(
  'src="/indo_prewed_peakoflove_1_1785094159557.jpg"',
  'src={loveStoryBgUrl}'
);
// Replace hardcoded timeline with loveStoryList map
const oldTimeline = `
                {/* 2018 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[27px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="font-playfair text-sm text-white font-bold tracking-widest block mb-1">2018</span>
                  <h4 className="font-cinzel text-xs text-white font-bold tracking-widest mb-2">Awal Berjumpa</h4>
                  <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                    Kami bertemu pertama kali di acara kampus. Sebuah sapaan sederhana yang mengawali segalanya.
                  </p>
                </div>

                {/* 2020 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[27px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="font-playfair text-sm text-white font-bold tracking-widest block mb-1">2020</span>
                  <h4 className="font-cinzel text-xs text-white font-bold tracking-widest mb-2">Menjalin Kasih</h4>
                  <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                    Setelah lulus, kami memutuskan untuk menjalin hubungan dan saling mendukung karir masing-masing.
                  </p>
                </div>

                {/* 2023 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[27px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="font-playfair text-sm text-white font-bold tracking-widest block mb-1">2023</span>
                  <h4 className="font-cinzel text-xs text-white font-bold tracking-widest mb-2">Momen Lamaran</h4>
                  <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                    Di bawah rintik hujan kota Bandung, ia melamar saya. Sebuah "Ya" yang mengubah hidup kami.
                  </p>
                </div>

                {/* 2024 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[27px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="font-playfair text-sm text-white font-bold tracking-widest block mb-1">2024</span>
                  <h4 className="font-cinzel text-xs text-white font-bold tracking-widest mb-2">Puncak Cinta</h4>
                  <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                    Hari ini kami mengikat janji suci pernikahan untuk memulai lembaran baru sebagai suami istri.
                  </p>
                </div>
`;
const newTimeline = `
                {loveStoryList.map((story: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute top-1 -left-[27px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <span className="font-playfair text-sm text-white font-bold tracking-widest block mb-1">{story.year}</span>
                    <h4 className="font-cinzel text-xs text-white font-bold tracking-widest mb-2">{story.title}</h4>
                    <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                      {story.description}
                    </p>
                  </div>
                ))}
`;
file = file.replace(oldTimeline, newTimeline);

// 4. SECTION 5: EVENT DETAILS
file = file.replace(
  'src="/indo_prewed_events_1_1785093412537.jpg"',
  'src={eventBgUrl}'
);
// Replace HOLY MATRIMONY text
file = file.replace(
  'HOLY MATRIMONY\n                </h3>',
  '{akadTitle}\n                </h3>'
);
// Replace RECEPTION text
file = file.replace(
  'RECEPTION\n                </h3>',
  '{resepsiTitle}\n                </h3>'
);
// Replace hardcoded dates/times for Events
file = file.replace(
  '<p className="font-bold text-sm text-white uppercase tracking-wider">{eventDateStr}</p>\n                  <p className="text-white font-semibold">{eventTimeMatrimony}</p>',
  '<p className="font-bold text-sm text-white uppercase tracking-wider">{akadDateStr}</p>\n                  <p className="text-white font-semibold">{akadTimeStr}</p>'
);
file = file.replace(
  '<p className="font-bold text-sm text-white uppercase tracking-wider">{eventDateStr}</p>\n                  <p className="text-white font-semibold">{eventTimeReception}</p>',
  '<p className="font-bold text-sm text-white uppercase tracking-wider">{resepsiDateStr}</p>\n                  <p className="text-white font-semibold">{resepsiTimeStr}</p>'
);

// Map Location and Gmaps for Akad
file = file.replace(
  '<p className="font-bold text-xs text-white">{eventLocation}</p>\n                  <p className="text-zinc-300 italic font-light text-[11px] leading-relaxed">\n                    {eventAddress}\n                  </p>',
  '<p className="font-bold text-xs text-white">{akadLocation}</p>\n                  <p className="text-zinc-300 italic font-light text-[11px] leading-relaxed">\n                    {/* Optional address detail if exists */}\n                  </p>'
);
file = file.replace(
  'href={mapsLink}',
  'href={akadGmaps}'
);

// Actually, wait, replacing the second instance is tricky with generic replace.
// Let's use multi_replace for targeted replacement if regex fails.
fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Patched phase 1');
