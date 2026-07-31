const fs = require('fs');

let file = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// For Foto A
file = file.replace(
  /: "📌 Foto A: Cover Sampul Depan \(Lockscreen\)"\}/,
  ': selectedInvitation.theme === "Wedding 5" ? "📌 Foto A: Cover Sampul Depan" : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}'
);

file = file.replace(
  /: "Foto ini tampil saat pertama kali tamu membuka link undangan \(sebelum klik tombol \\"Buka Undangan\\"\)\. Jika kosong, akan menggunakan animasi default atau foto placeholder\."\}/,
  ': selectedInvitation.theme === "Wedding 5" ? "Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol \\"Buka Undangan\\"). Hanya 1 foto — bukan background slideshow." : "Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol \\"Buka Undangan\\"). Jika kosong, akan menggunakan animasi default atau foto placeholder."}'
);

// For Foto C
file = file.replace(
  /\{\(selectedInvitation\.theme === "Wedding 1" \|\| selectedInvitation\.theme === "Wedding 4"\) \? "🎞️ Foto C: Background Slideshow \(Berubah-ubah\) & Galeri" : "🎞️ Foto C: Galeri Foto"\}/,
  '{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") ? "🎞️ Foto C: Background Slideshow (Berubah-ubah) & Galeri" : "🎞️ Foto C: Galeri Foto"}'
);

file = file.replace(
  /\{\(selectedInvitation\.theme === "Wedding 1" \|\| selectedInvitation\.theme === "Wedding 4"\) \? "Unggah foto-foto prewedding Anda di sini\. Foto-foto ini akan ditampilkan di galeri undangan sekaligus menjadi background animasi \(slide show\) di dalam undangan\." : "Unggah foto-foto prewedding Anda di sini\. Foto-foto ini akan ditampilkan di galeri undangan\."\}/,
  '{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") ? "Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan sekaligus menjadi background animasi (slide show) di dalam undangan." : "Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}'
);

fs.writeFileSync('src/app/admin/page.tsx', file);
console.log("Admin copywriting fixed!");
