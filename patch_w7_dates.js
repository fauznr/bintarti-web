const fs = require('fs');

const pathW7 = 'src/components/wedding/Wedding7View.tsx';
let w7 = fs.readFileSync(pathW7, 'utf-8');

// 1. Add date formatter and dynamic variables
const hookInsertStr = 'const weddingDateStr = invitationData?.wedding_date || "2026-01-01T08:00:00";';
const newVars = `
  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  };

  const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "2026-01-01";
  const akadDateDisplay = formatEventDate(akadDateStr);
  const akadTimeStr = weddingNotes.akadTime || "08.00 WIB - Selesai";
  const akadLocationStr = weddingNotes.akadLocation || "Pendopo Papuri\\nJl. Soekarno Hatta No.785, Bandung";

  const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;
  const resepsiDateDisplay = formatEventDate(resepsiDateStr);
  const resepsiTimeStr = weddingNotes.resepsiTime || "11.00 - 14.00 WIB";
  const resepsiLocationStr = weddingNotes.resepsiLocation || "Pendopo Papuri\\nJl. Soekarno Hatta No.785, Bandung";
  
  const eventDateStr = akadDateDisplay;
  
  const weddingDateStr = invitationData?.wedding_date || "2026-01-01T08:00:00";
`;

if (!w7.includes('const akadDateDisplay =')) {
  w7 = w7.replace(hookInsertStr, newVars);
}

// 2. Replace Lockscreen and Hero hardcoded strings
w7 = w7.replace(/>MINGGU, 01 JANUARI 2026</g, '>{eventDateStr}<');
w7 = w7.replace(/>BANDUNG, 01 JANUARI 2026</g, '>{eventDateStr}<');

// 3. Replace Akad Card (lines around 773-784)
const akadCardRegex = /<p className="font-cinzel font-bold text-\[\#6a8f7f\] tracking-wider text-sm">\s*\{eventDateStr\}\s*<\/p>\s*<p className="flex items-center justify-center gap-1 text-\[\#718096\]">\s*<Clock className="w-3\.5 h-3\.5 text-\[\#6a8f7f\]" \/> 08\.00 WIB - Selesai\s*<\/p>\s*<\/div>\s*<div className="pt-2 border-t border-\[\#6a8f7f\]\/20 space-y-1">\s*<h4 className="font-cinzel text-sm font-bold text-\[\#1A202C\]">\s*Pendopo Papuri\s*<\/h4>\s*<p className="font-montserrat text-\[11px\] text-\[\#718096\] leading-relaxed font-light">\s*Jl\. Soekarno Hatta No\.785, Babakan Penghulu, Kec\. Cinambo, Kota Bandung\s*<\/p>/m;

const akadCardReplacement = `<p className="font-cinzel font-bold text-[#6a8f7f] tracking-wider text-sm">
                  {akadDateDisplay}
                </p>
                <p className="flex items-center justify-center gap-1 text-[#718096]">
                  <Clock className="w-3.5 h-3.5 text-[#6a8f7f]" /> {akadTimeStr}
                </p>
              </div>
              <div className="pt-2 border-t border-[#6a8f7f]/20 space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-[#1A202C] whitespace-pre-line">
                  {akadLocationStr.split('\\n')[0]}
                </h4>
                <p className="font-montserrat text-[11px] text-[#718096] leading-relaxed font-light whitespace-pre-line">
                  {akadLocationStr.split('\\n').slice(1).join('\\n')}
                </p>`;
                
w7 = w7.replace(akadCardRegex, akadCardReplacement);

// 4. Replace Resepsi Card (lines around 810-822)
const resepsiCardRegex = /<p className="font-cinzel font-bold text-\[\#6a8f7f\] tracking-wider text-sm">\s*\{eventDateStr\}\s*<\/p>\s*<p className="flex items-center justify-center gap-1 text-\[\#718096\]">\s*<Clock className="w-3\.5 h-3\.5 text-\[\#6a8f7f\]" \/> 11\.00 - 14\.00 WIB\s*<\/p>\s*<\/div>\s*<div className="pt-2 border-t border-\[\#6a8f7f\]\/20 space-y-1">\s*<h4 className="font-cinzel text-sm font-bold text-\[\#1A202C\]">\s*Pendopo Papuri\s*<\/h4>\s*<p className="font-montserrat text-\[11px\] text-\[\#718096\] leading-relaxed font-light">\s*Jl\. Soekarno Hatta No\.785, Babakan Penghulu, Kec\. Cinambo, Kota Bandung\s*<\/p>/m;

const resepsiCardReplacement = `<p className="font-cinzel font-bold text-[#6a8f7f] tracking-wider text-sm">
                  {resepsiDateDisplay}
                </p>
                <p className="flex items-center justify-center gap-1 text-[#718096]">
                  <Clock className="w-3.5 h-3.5 text-[#6a8f7f]" /> {resepsiTimeStr}
                </p>
              </div>
              <div className="pt-2 border-t border-[#6a8f7f]/20 space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-[#1A202C] whitespace-pre-line">
                  {resepsiLocationStr.split('\\n')[0]}
                </h4>
                <p className="font-montserrat text-[11px] text-[#718096] leading-relaxed font-light whitespace-pre-line">
                  {resepsiLocationStr.split('\\n').slice(1).join('\\n')}
                </p>`;
                
w7 = w7.replace(resepsiCardRegex, resepsiCardReplacement);

fs.writeFileSync(pathW7, w7);
console.log('Patched Wedding7View.tsx event dates and locations');
