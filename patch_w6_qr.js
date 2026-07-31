const fs = require('fs');

const w6Path = 'src/components/wedding/Wedding6View.tsx';
let content = fs.readFileSync(w6Path, 'utf-8');

const qrSection = "        {/* ======================================================== */}\n" +
"        {/* SECTION 10: QR CODE PRESENSI                             */}\n" +
"        {/* ======================================================== */}\n" +
"        {isPro && (\n" +
"          <section id=\"qrcode-section\" className=\"relative min-h-[60vh] flex flex-col justify-center items-center py-20 px-6 text-center border-b border-white/10 text-white overflow-hidden\">\n" +
"            <div className=\"absolute inset-0 z-0\">\n" +
"              <Image\n" +
"                src={qrBgUrl}\n" +
"                alt=\"QR Code Background\"\n" +
"                fill\n" +
"                className=\"object-cover object-center opacity-40 filter grayscale\"\n" +
"              />\n" +
"              <div className=\"absolute inset-0 bg-black/60\" />\n" +
"            </div>\n\n" +
"            <ScrollReveal variant=\"zoom-in\">\n" +
"              <div className=\"space-y-6 z-10 relative flex flex-col items-center max-w-sm mx-auto\">\n" +
"                <div className=\"space-y-2\">\n" +
"                  <span className=\"font-cinzel text-[10px] text-white tracking-[0.25em] uppercase font-semibold\">\n" +
"                    PRESENSI DIGITAL\n" +
"                  </span>\n" +
"                  <h2 className=\"font-playfair text-2xl sm:text-3xl text-white font-normal tracking-wide\">\n" +
"                    QR Code Tamu\n" +
"                  </h2>\n" +
"                </div>\n\n" +
"                <div className=\"bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl\">\n" +
"                  <div className=\"bg-white p-3 rounded-2xl inline-block shadow-inner\">\n" +
"                    <img\n" +
"                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== \"undefined\" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || \"Tamu Undangan\")))}&type=Wedding`)}`}\n" +
"                      alt=\"QR Code Tamu\"\n" +
"                      className=\"w-40 h-40 mx-auto rounded-xl object-contain\"\n" +
"                    />\n" +
"                    <div className=\"mt-3 pt-3 border-t border-dashed border-zinc-300 text-center\">\n" +
"                      <span className=\"text-[10px] font-mono font-bold text-zinc-800 tracking-widest uppercase\">\n" +
"                        VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : \"TMU\"}-{akadDateStr ? akadDateStr.split(\"-\")[0] : \"2026\"}\n" +
"                      </span>\n" +
"                    </div>\n" +
"                  </div>\n" +
"                </div>\n\n" +
"                <div className=\"space-y-1\">\n" +
"                  <span className=\"text-sm font-bold text-white font-playfair tracking-wide block\">{guestName || \"Tamu Undangan\"}</span>\n" +
"                  <p className=\"text-[10px] text-zinc-300 font-montserrat leading-relaxed max-w-xs mx-auto italic\">\n" +
"                    Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi kehadiran.\n" +
"                  </p>\n" +
"                </div>\n" +
"              </div>\n" +
"            </ScrollReveal>\n" +
"          </section>\n" +
"        )}\n\n";

const splitStr = '        {/* ======================================================== */}\n        {/* SECTION 11: CLOSING SECTION                              */}';
if (content.includes('SECTION 10: QR CODE PRESENSI')) {
  console.log('Already has QR Section');
} else {
  content = content.replace(splitStr, qrSection + splitStr);
  fs.writeFileSync(w6Path, content);
  console.log('Injected QR Section');
}
