const fs = require('fs');

const pathKatalog = 'src/app/katalog/page.tsx';
let kat = fs.readFileSync(pathKatalog, 'utf-8');

// We want to add QrCode icon import if not present
if (!kat.includes('QrCode')) {
  kat = kat.replace('import { Search', 'import { Search, QrCode');
}

// In the overlay, let's change it from a single button to a column of buttons: 
// 1) Lihat Demo Live
// 2) a small QR code rendering the demo URL, or a button to view QR
const overlayTarget = `<a 
                          href={tpl.demoUrl || (tpl.name.includes("Custom") ? \`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20konsultasi%20desain%20\${encodeURIComponent(tpl.name)}\` : \`/demo?theme=\${tpl.id}\`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform"
                        >
                          {tpl.demoUrl ? "Lihat Demo Live" : tpl.name.includes("Custom") ? "Konsultasi Custom" : "Lihat Demo Live"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>`;

const overlayReplacement = `<div className="flex flex-col items-center gap-3">
                        <a 
                          href={tpl.demoUrl || (tpl.name.includes("Custom") ? \`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20konsultasi%20desain%20\${encodeURIComponent(tpl.name)}\` : \`/demo?theme=\${tpl.id}\`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:-translate-y-0.5"
                        >
                          {tpl.demoUrl ? "Lihat Demo Live" : tpl.name.includes("Custom") ? "Konsultasi Custom" : "Lihat Demo Live"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <div className="bg-white p-1.5 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform hidden md:block" title="Scan QR Code untuk lihat di HP">
                          <img 
                            src={\`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=\${encodeURIComponent("https://bintarti.store" + (tpl.demoUrl || (tpl.name.includes("Custom") ? "" : \`/sandbox-tema/\${tpl.id}\`)))}\`}
                            alt="QR Demo"
                            className="w-14 h-14 rounded-md"
                          />
                        </div>
                      </div>`;

if (kat.includes(overlayTarget)) {
    kat = kat.replace(overlayTarget, overlayReplacement);
    fs.writeFileSync(pathKatalog, kat);
    console.log("Katalog QR Scan Link added successfully!");
} else {
    console.log("Overlay target not found in Katalog!");
}
