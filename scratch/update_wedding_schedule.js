const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const oldScheduleCode = `: ((isKhitan || isAqiqah) ? [
          "08:00 - Pembukaan",
          isAqiqah ? "08:30 - Tasyakuran Aqiqah" : "08:30 - Prosesi Utama",
          isAqiqah ? "09:30 - Pemotongan Rambut & Doa" : "09:30 - Prosesi Adat & Doa",
          "10:30 - Ramah Tamah & Penutup"
        ] : []);`;

const newScheduleCode = `: (isWedding ? [
          "2021 - Awal Bertemu",
          "2023 - Menjalin Hubungan",
          "2025 - Momen Lamaran",
          "2026 - Pernikahan Suci"
        ] : (isKhitan || isAqiqah) ? [
          "08:00 - Pembukaan",
          isAqiqah ? "08:30 - Tasyakuran Aqiqah" : "08:30 - Prosesi Utama",
          isAqiqah ? "09:30 - Pemotongan Rambut & Doa" : "09:30 - Prosesi Adat & Doa",
          "10:30 - Ramah Tamah & Penutup"
        ] : []);`;

content = content.replace(oldScheduleCode, newScheduleCode);
fs.writeFileSync(pageFile, content);
console.log('Successfully updated scheduleLines fallback for Wedding!');
