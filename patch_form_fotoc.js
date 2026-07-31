const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

const oldLabel = '{formData.theme === "Wedding 1" ? "🎞️ Foto C: Background Slideshow (Berubah-ubah) & Galeri" : "🎞️ Foto C: Galeri Foto"}';
const newLabel = '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : "🎞️ Foto C: Galeri Foto"}';
file = file.replace(oldLabel, newLabel);

const oldDesc = `{formData.theme === "Wedding 1" 
                                    ? <>Foto ini digunakan untuk background slideshow dan foto foto di galeri.</>
                                    : <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan.</>

                                  }`;
const newDesc = `{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") 
                                    ? <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow</>
                                    : <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan.</>
                                  }`;
file = file.replace(oldDesc, newDesc);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log("Updated formulir/page.tsx");
