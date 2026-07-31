const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

// 5. SECTION 6: DRESSCODE
file = file.replace(
  'src="/indo_prewed_livestream_1_1785093423516.jpg"\n              alt="Dresscode Background"',
  'src={dresscodeBgUrl}\n              alt="Dresscode Background"'
);

const oldDresscodeUI = `              {/* Color Palette Swatches */}
              <div className="flex justify-center items-center gap-3 pt-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-[#171717] border border-white/30 shadow-md" />
                  <span className="text-[9px] text-zinc-300 font-montserrat">Black</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-[#737373] border border-white/40 shadow-md" />
                  <span className="text-[9px] text-zinc-300 font-montserrat">Charcoal</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-[#D4D4D4] border border-white/40 shadow-md" />
                  <span className="text-[9px] text-zinc-300 font-montserrat">Silver</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-white/40 shadow-md" />
                  <span className="text-[9px] text-zinc-300 font-montserrat">White</span>
                </div>
              </div>`;
const newDresscodeUI = `              {/* Color Palette Swatches */}
              <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                {dresscodes.map((dress: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full border border-white/30 shadow-md" style={{ backgroundColor: dress.hex || '#FFFFFF' }} />
                    <span className="text-[9px] text-zinc-300 font-montserrat">{dress.name}</span>
                  </div>
                ))}
              </div>`;
file = file.replace(oldDresscodeUI, newDresscodeUI);

// Optional: Hide dresscode section entirely if dresscodes array is empty
file = file.replace(
  '<section className="relative py-16 px-6 border-b border-white/10 text-center overflow-hidden">',
  '{dresscodes && dresscodes.length > 0 && (\n        <section className="relative py-16 px-6 border-b border-white/10 text-center overflow-hidden">'
);
file = file.replace(
  '            </ScrollReveal>\n        </section>\n\n        {/* ======================================================== */}\n        {/* SECTION 7: QR CODE TAMU UNDANGAN PRESENSI                 */}',
  '            </ScrollReveal>\n        </section>\n        )}\n\n        {/* ======================================================== */}\n        {/* SECTION 7: QR CODE TAMU UNDANGAN PRESENSI                 */}'
);

// 6. GALLERY & VIDEO
file = file.replace(
  'src="/indo_prewed_simple_1_1785092558852.jpg"\n              alt="Gallery Background"',
  'src={ourMomentBgUrl}\n              alt="Gallery Background"'
);

// 7. WEDDING GIFT & RSVP & CLOSING
file = file.replace(
  'src="/indo_prewed_gift_1_1785094200427.jpg"\n              alt="Gift Background"',
  'src={giftBgUrl}\n              alt="Gift Background"'
);
file = file.replace(
  'src="/indo_prewed_gift_1_1785094200427.jpg"\n              alt="Wishes Background"',
  'src={rsvpBgUrl}\n              alt="Wishes Background"'
);
file = file.replace(
  'src="/indo_prewed_closing_1_1785094215233.jpg"\n              alt="Closing Background"',
  'src={closingPhotoUrl}\n              alt="Closing Background"'
);

// Move QR Section Below Wishes
// We can use a targeted extraction of the QR code section.
const qrStartIndex = file.indexOf('{/* ======================================================== */}\n        {/* SECTION 7: QR CODE TAMU UNDANGAN PRESENSI                 */}\n        {/* ======================================================== */}\n        {isPro && (');
const qrEndIndex = file.indexOf('</section>\n        )}\n\n        {/* ======================================================== */}\n        {/* SECTION 8: GALLERY & PREWEDDING CINEMATIC VIDEO          */}') + 16; 

if (qrStartIndex > -1 && qrEndIndex > qrStartIndex) {
  const qrSectionStr = file.substring(qrStartIndex, qrEndIndex);
  // Remove it from current location
  file = file.substring(0, qrStartIndex) + file.substring(qrEndIndex);
  
  // Insert it before CLOSING
  const closingIndex = file.indexOf('{/* ======================================================== */}\n        {/* SECTION 11: CLOSING                                      */}\n        {/* ======================================================== */}');
  if (closingIndex > -1) {
    file = file.substring(0, closingIndex) + qrSectionStr + '\n\n        ' + file.substring(closingIndex);
  }
}

// Replace QR Background
file = file.replace(
  'src="/indo_prewed_livestream_1_1785093423516.jpg"\n              alt="QR Section Background"',
  'src={qrBgUrl}\n              alt="QR Section Background"'
);


fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Patched phase 2');
