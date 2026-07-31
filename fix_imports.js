const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

if (!file.includes('import { parseGDriveUrl')) {
    file = file.replace(
        /import \{ QRCodeCanvas \} from "qrcode\.react";/,
        'import { QRCodeCanvas } from "qrcode.react";\nimport { parseGDriveUrl, getYoutubeEmbedId } from "@/lib/utils";'
    );
    fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
    console.log("Imported parseGDriveUrl");
} else {
    console.log("Already imported");
}
