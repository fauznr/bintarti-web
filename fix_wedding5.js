const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1. Fix bgPhotos
file = file.replace(
  /const bgPhotos = \(invitationData\?\.galleryPhotos && invitationData\.galleryPhotos\.length > 0\)\n\s*\? invitationData\.galleryPhotos/,
  'const bgPhotos = (invitationData?.gallery_images && invitationData.gallery_images.length > 0)\n    ? invitationData.gallery_images'
);

// 2. Fix Audio
file = file.replace(
  /<audio \n\s*ref=\{audioRef\} \n\s*loop \n\s*src=\{invitationData\?\.music_url \|\| "https:\/\/assets\.mixkit\.co\/music\/preview\/mixkit-romantic-wedding-462\.mp3"\} \n\s*\/>/,
  '<audio \n        ref={audioRef} \n        loop \n        src={parseGDriveUrl(invitationData?.music || invitationData?.music_url) || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"} \n      />'
);

// Need to import parseGDriveUrl and getYoutubeEmbedId if not already imported
if (!file.includes('parseGDriveUrl')) {
  file = file.replace(
    /import \{ QRCodeCanvas \} from "qrcode\.react";/,
    'import { QRCodeCanvas } from "qrcode.react";\nimport { parseGDriveUrl, getYoutubeEmbedId } from "@/lib/utils";'
  );
}

// 3. Fix YouTube
file = file.replace(
  /<iframe\n\s*src=\{weddingNotes\?\.streamingUrl \|\| "https:\/\/www\.youtube\.com\/embed\/5qap5aO4i9A\?rel=0"\}/,
  '<iframe\n                src={weddingNotes?.streamingUrl ? `https://www.youtube.com/embed/${getYoutubeEmbedId(weddingNotes.streamingUrl)}?rel=0` : "https://www.youtube.com/embed/5qap5aO4i9A?rel=0"}'
);

// 4. Fix Google Maps
file = file.replace(
  /href=\{weddingNotes\?\.akadMapsUrl \|\| "https:\/\/maps\.google\.com\/\?q=Masjid\+Ghede\+Kauman\+Yogyakarta"\}/,
  'href={weddingNotes?.akadGmaps || "https://maps.google.com/?q=Masjid+Ghede+Kauman+Yogyakarta"}'
);
file = file.replace(
  /href=\{weddingNotes\?\.resepsiMapsUrl \|\| "https:\/\/maps\.google\.com\/\?q=Pendopo\+Royal\+Ambarrukmo\+Yogyakarta"\}/,
  'href={weddingNotes?.resepsiGmaps || "https://maps.google.com/?q=Pendopo+Royal+Ambarrukmo+Yogyakarta"}'
);

// 5. Fix Bank Accounts
file = file.replace(
  /bankName: "BANK MANDIRI",\n\s*accountNumber: "1370 0982 1123",\n\s*accountHolder: "a\.n\. Farhan Mahendra"/,
  'bankName: "BANK MANDIRI",\n        accountNumber: "1370 0982 1123",\n        recipientName: "a.n. Farhan Mahendra"'
);
file = file.replace(
  /bankName: "BANK BCA",\n\s*accountNumber: "8830 7711 00",\n\s*accountHolder: "a\.n\. Nabila Zhafira"/,
  'bankName: "BANK BCA",\n        accountNumber: "8830 7711 00",\n        recipientName: "a.n. Nabila Zhafira"'
);
// Fix the map function for bank accounts
file = file.replace(
  /\{bank\.accountHolder\}/g,
  '{bank.recipientName || bank.accountHolder}'
);

// 6. Fix QR Code visibility
// Find the QR Code section and wrap it
if (!file.includes('{isPro && (')) {
  file = file.replace(
    /\{\/\* 9\. QR CODE PRESENSI DIGITAL \*\/\}\n\s*<section className="px-6 py-12 text-center bg-white">/,
    '{/* 9. QR CODE PRESENSI DIGITAL */}\n          {isPro && (\n          <section id="qrcode-section" className="px-6 py-12 text-center bg-white">'
  );
  file = file.replace(
    /<\/p>\n\s*<\/div>\n\s*<\/div>\n\s*<\/ScrollReveal>\n\s*<\/section>/,
    '</p>\n                </div>\n              </div>\n            </ScrollReveal>\n          </section>\n          )}'
  );
}

// 7. Fix Timeline Love Story
file = file.replace(
  /const timelineData = \[\n\s*\{ year: "2023", tag: "KAWITAN ☕", title: "Tepang pisanan", desc: "Sepisanan kepanggih wonten ing acara pameran budaya seni ing Jogja, saling tukar sapa lalu terjalin komunikasi\." \},\n\s*\{ year: "2024", tag: "SANGSULAN ⚡", title: "Komitmen Tresna", desc: "Sakwise setahun nongkrong &amp; diskusi bareng, kita sadar saling melengkapi lan mantap melangkah bareng\." \},\n\s*\{ year: "2025", tag: "PIREMBAGAN 💍", title: "Prosesi Lamaran", desc: "Nyuwun pangestu kalih keluarga besar, dianakake prosesi lamaran adat Jawa ingkang hangat lan khidmat\." \},\n\s*\{ year: "2026", tag: "PAWIWAHAN 💒", title: "Pernikahan Sakral", desc: "Momen sakral pawiwahan ngikat janji suci dadi pasangan garwa lan mbina rumah tangga ingkang berkah\." \}\n\s*\];/,
  'const timelineData = (weddingNotes?.loveStory && weddingNotes.loveStory.length > 0) ? weddingNotes.loveStory : [\n    { year: "2023", tag: "KAWITAN ☕", title: "Tepang pisanan", desc: "Sepisanan kepanggih wonten ing acara pameran budaya seni ing Jogja, saling tukar sapa lalu terjalin komunikasi." },\n    { year: "2024", tag: "SANGSULAN ⚡", title: "Komitmen Tresna", desc: "Sakwise setahun nongkrong & diskusi bareng, kita sadar saling melengkapi lan mantap melangkah bareng." },\n    { year: "2025", tag: "PIREMBAGAN 💍", title: "Prosesi Lamaran", desc: "Nyuwun pangestu kalih keluarga besar, dianakake prosesi lamaran adat Jawa ingkang hangat lan khidmat." },\n    { year: "2026", tag: "PAWIWAHAN 💒", title: "Pernikahan Sakral", desc: "Momen sakral pawiwahan ngikat janji suci dadi pasangan garwa lan mbina rumah tangga ingkang berkah." }\n  ];'
);
file = file.replace(
  /\{item\.desc\}/g,
  '{item.desc || item.description}'
);
file = file.replace(
  /\{item\.tag\}/g,
  '{item.tag || item.title}'
);


fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Wedding5View.tsx fixed!");
