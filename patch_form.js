const fs = require('fs');
let code = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// Hide Our Story for Wedding 1
code = code.replace(
  '{/* FOTO OUR STORY */}',
  '{formData.theme !== "Wedding 1" && (<>\n                            {/* FOTO OUR STORY */}'
);

code = code.replace(
  '                            {/* FOTO PROFIL MEMPELAI (PRIA & WANITA) */}',
  '                            </>)}\n\n                            {/* FOTO PROFIL MEMPELAI (PRIA & WANITA) */}'
);

// Update Foto C description
code = code.replace(
  '{formData.theme === "Wedding 1" ? "🎞️ Foto C: Background Slideshow (Berubah-ubah)" : "🎞️ Foto C: Galeri Foto"}',
  '{formData.theme === "Wedding 1" ? "🎞️ Foto C: Background Slideshow (Berubah-ubah) & Galeri" : "🎞️ Foto C: Galeri Foto"}'
);

code = code.replace(
  '✨ <strong>Ini yang membuat background berubah-ubah!</strong> Foto-foto ini akan bergantian tampil sebagai background slideshow di seluruh halaman undangan setelah tombol &quot;Buka Undangan&quot; diklik. Semakin banyak foto, semakin kaya tampilannya.',
  'Foto ini digunakan untuk background slideshow dan foto foto di galeri.'
);

fs.writeFileSync('src/app/formulir/page.tsx', code);
console.log('Formulir updated successfully!');
