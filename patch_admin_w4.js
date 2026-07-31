const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Update Foto A label
content = content.replace(
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \\n                            : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}',
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \\n                            : selectedInvitation.theme === "Wedding 4"\\n                            ? "📌 Foto A: Cover Sampul Depan (halaman pertama foto dalam bingkai)"\\n                            : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}'
);

// Update Foto A description text
content = content.replace(
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? \\'1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"), dan juga digunakan sebagai background statis di seluruh halaman undangan.\\' \\n                            : \\'1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"). Hanya 1 foto — bukan background slideshow.\\'}',
  '{selectedInvitation.theme === "Wedding 2" \\n                            ? \\'1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"), dan juga digunakan sebagai background statis di seluruh halaman undangan.\\' \\n                            : \\'1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"). Hanya 1 foto — bukan background slideshow.\\'}'
);

// Hide Our Story
content = content.replace(
  '{selectedInvitation.theme !== "Wedding 1" && (',
  '{(selectedInvitation.theme !== "Wedding 1" && selectedInvitation.theme !== "Wedding 4") && ('
);

fs.writeFileSync('src/app/admin/page.tsx', content);
console.log('Admin page updated successfully');
