const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const targetOld = `: (isKhitan ? [
          "08:00 - Pembukaan",
          "08:30 - Prosesi Utama",
          "09:30 - Prosesi Adat & Doa",
          "10:30 - Ramah Tamah & Penutup"
        ] : []);`;

const targetNew = `: ((isKhitan || isAqiqah) ? [
          "08:00 - Pembukaan",
          isAqiqah ? "08:30 - Tasyakuran Aqiqah" : "08:30 - Prosesi Utama",
          isAqiqah ? "09:30 - Pemotongan Rambut & Doa" : "09:30 - Prosesi Adat & Doa",
          "10:30 - Ramah Tamah & Penutup"
        ] : []);`;

if (content.includes(targetOld)) {
  content = content.replace(targetOld, targetNew);
  fs.writeFileSync(pageFile, content);
  console.log('Successfully added default schedule lines for Aqiqah 1!');
} else {
  console.error('Target old schedule lines snippet not found!');
}
