const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// Insert weddingNotes and isPro
if (!file.includes('const weddingNotes =')) {
  file = file.replace(
    /const audioRef = useRef<HTMLAudioElement \| null>\(null\);/,
    'const audioRef = useRef<HTMLAudioElement | null>(null);\n\n  const weddingNotes = invitationData?.notes ? (typeof invitationData.notes === "string" ? JSON.parse(invitationData.notes) : invitationData.notes) : {};\n  const isPro = !!invitationData?.is_pro || !!weddingNotes?.isPro;'
  );
}

// Make sure parseGDriveUrl is imported
if (!file.includes('parseGDriveUrl')) {
    file = file.replace(
        /import \{ QRCodeCanvas \} from "qrcode\.react";/,
        'import { QRCodeCanvas } from "qrcode.react";\nimport { parseGDriveUrl, getYoutubeEmbedId } from "@/lib/utils";'
    );
}

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Added weddingNotes and isPro to Wedding5View");
