const fs = require('fs');

let file = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const oldLabel = `{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") ? "🎞️ Foto C: Background Slideshow (Berubah-ubah) & Galeri" : "🎞️ Foto C: Galeri Foto"}`;
const newLabel = `{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : "🎞️ Foto C: Galeri Foto"}`;

file = file.replace(oldLabel, newLabel);

const oldDesc = `{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4") 
                            ? " ✨ Ini yang membuat background berubah-ubah! Foto-foto ini akan bergantian tampil sebagai background slideshow di seluruh halaman undangan setelah tombol 'Buka Undangan' diklik. Semakin banyak foto, semakin kaya tampilannya." 
                            : " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}`;

const newDesc = `{(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") 
                            ? " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow" 
                            : " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}`;

file = file.replace(oldDesc, newDesc);

fs.writeFileSync('src/app/admin/page.tsx', file);
console.log("Updated admin/page.tsx");
