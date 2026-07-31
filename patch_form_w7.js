const fs = require('fs');

const pathForm = 'src/app/formulir/page.tsx';
let formContent = fs.readFileSync(pathForm, 'utf-8');

// Hide standard Foto B and Our Story for Wedding 7
const checkB = '{(formData.theme !== "Wedding 1" && formData.theme !== "Wedding 4" && formData.theme !== "Wedding 5" && formData.theme !== "Wedding 6") && (<>';
const newCheckB = '{(formData.theme !== "Wedding 1" && formData.theme !== "Wedding 4" && formData.theme !== "Wedding 5" && formData.theme !== "Wedding 6" && formData.theme !== "Wedding 7") && (<>';
formContent = formContent.replace(checkB, newCheckB);

// Rename Foto C to Foto B for Wedding 7
const labelC1 = '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : "🎞️ Foto C: Galeri Foto"}';
const labelC2 = '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : (formData.theme === "Wedding 7" ? "🎞️ Foto B: Galeri Foto" : "🎞️ Foto C: Galeri Foto")}';
formContent = formContent.replace(labelC1, labelC2);

const descC1 = '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") \n                                    ? <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow</>\n                                    : <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan.</>\n                                  }';
const descC2 = '{(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") \n                                    ? <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow</>\n                                    : <>Unggah foto-foto prewedding Anda di sini. Khusus Wedding 7, foto pertama dari galeri ini akan menjadi foto utama (highlight).</>\n                                  }';
formContent = formContent.replace(descC1, descC2);

fs.writeFileSync(pathForm, formContent);
console.log('Patched formulir/page.tsx for Wedding 7 labels');

const pathAdmin = 'src/app/admin/page.tsx';
let adminContent = fs.readFileSync(pathAdmin, 'utf-8');

// Admin also has labels for media
const checkAdminMedia = '{(modalDetails.weddingData?.theme !== "Wedding 1" && modalDetails.weddingData?.theme !== "Wedding 4" && modalDetails.weddingData?.theme !== "Wedding 5" && modalDetails.weddingData?.theme !== "Wedding 6") && (<>';
const newCheckAdminMedia = '{(modalDetails.weddingData?.theme !== "Wedding 1" && modalDetails.weddingData?.theme !== "Wedding 4" && modalDetails.weddingData?.theme !== "Wedding 5" && modalDetails.weddingData?.theme !== "Wedding 6" && modalDetails.weddingData?.theme !== "Wedding 7") && (<>';
if (adminContent.includes(checkAdminMedia)) {
    adminContent = adminContent.replace(checkAdminMedia, newCheckAdminMedia);
} else {
    console.log("Could not find admin media check 1");
}

fs.writeFileSync(pathAdmin, adminContent);
console.log('Patched admin/page.tsx for Wedding 7 labels');
