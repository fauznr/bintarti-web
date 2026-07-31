const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Update Foto A label
content = content.replace(
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \\n                            : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}',
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \\n                            : selectedInvitation.theme === "Wedding 4"\\n                            ? "📌 Foto A: Cover Sampul Depan (halaman pertama foto dalam bingkai)"\\n                            : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}'
);

// 2. Hide Our Story for Wedding 4
content = content.replace(
  '{selectedInvitation.theme !== "Wedding 1" && (',
  '{(selectedInvitation.theme !== "Wedding 1" && selectedInvitation.theme !== "Wedding 4") && ('
);

// 3. Update Foto C label
content = content.replace(
  '{selectedInvitation.theme === "Wedding 1" ? "🎞️ Foto C: Background Slideshow (Berubah-ubah)" : "🎞️ Foto C: Galeri Foto"}',
  '{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4") ? "🎞️ Foto C: Background Slideshow (Berubah-ubah) & Galeri" : "🎞️ Foto C: Galeri Foto"}'
);

// 4. Update Foto C description
content = content.replace(
  '{selectedInvitation.theme === "Wedding 1" \\n                            ? " ✨ Ini yang membuat background berubah-ubah! Foto-foto ini akan bergantian tampil sebagai background slideshow di seluruh halaman undangan setelah tombol \\'Buka Undangan\\' diklik. Semakin banyak foto, semakin kaya tampilannya." \\n                            : " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}',
  '{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4") \\n                            ? " ✨ Ini yang membuat background berubah-ubah! Foto-foto ini akan bergantian tampil sebagai background slideshow di seluruh halaman undangan setelah tombol \\'Buka Undangan\\' diklik. Semakin banyak foto, semakin kaya tampilannya." \\n                            : " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}'
);


fs.writeFileSync('src/app/admin/page.tsx', content);
console.log('Admin page patched perfectly');
