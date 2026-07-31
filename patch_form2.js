const fs = require('fs');
let code = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// Hide Our Story for Wedding 4
code = code.replace(
  '{formData.theme !== "Wedding 1" && (<>',
  '{(formData.theme !== "Wedding 1" && formData.theme !== "Wedding 4") && (<>'
);

// Update Foto A label
code = code.replace(
  '{formData.theme === "Wedding 2" \n                                    ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \n                                    : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}',
  '{formData.theme === "Wedding 2" \n                                    ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" \n                                    : formData.theme === "Wedding 4"\n                                    ? "📌 Foto A: Cover Sampul Depan (halaman pertama foto dalam bingkai)"\n                                    : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}'
);

fs.writeFileSync('src/app/formulir/page.tsx', code);
console.log('Formulir updated successfully!');
