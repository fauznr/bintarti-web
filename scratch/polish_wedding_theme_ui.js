const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Fix Cover Badge background for isWedding
content = content.replace(
  '${activeTheme === "birthday-8" ? "bg-[#EF8D21]" : activeTheme === "birthday-7" ? "bg-[#7B68B1]" : activeTheme === "birthday-2" ? "bg-emerald-600/90" : isKhitan ? "" : "bg-pink-500/90"}',
  '${isWedding ? "bg-slate-900/90 text-[#D4AF37] border border-[#C5A059]/50 font-serif" : activeTheme === "birthday-8" ? "bg-[#EF8D21]" : activeTheme === "birthday-7" ? "bg-[#7B68B1]" : activeTheme === "birthday-2" ? "bg-emerald-600/90" : isKhitan ? "" : "bg-pink-500/90"}'
);

// 2. Fix Cover Header font & color for isWedding
content = content.replace(
  'const props = getTextProps("cover", "header", activeTheme === "birthday-8" ? bungeeInlineFont : atmaFont, activeTheme === "birthday-8" ? "#EF8D20" : themeStyle.accentColor);',
  'const props = getTextProps("cover", "header", isWedding ? playfairDisplayFont : activeTheme === "birthday-8" ? bungeeInlineFont : atmaFont, isWedding ? "#C5A059" : activeTheme === "birthday-8" ? "#EF8D20" : themeStyle.accentColor);'
);

// 3. Fix Cover Header className animation/style for isWedding
content = content.replace(
  'className={`${props.className} text-6xl font-bold tracking-normal filter drop-shadow-[0_2.5px_0_rgba(255,255,255,1)] animate-pulse`}',
  'className={`${props.className} ${isWedding ? "text-4xl sm:text-5xl font-serif filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" : "text-6xl font-bold tracking-normal filter drop-shadow-[0_2.5px_0_rgba(255,255,255,1)] animate-pulse"}`}'
);

// 4. Fix Countdown Timer item styling for isWedding
content = content.replace(
  '<div key={idx} className={`bg-white/90 border ${activeTheme === "birthday-4" ? "border-lime-200" : activeTheme === "birthday-3" ? "border-amber-200" : activeTheme === "birthday-2" ? "border-emerald-250" : "border-yellow-200"} rounded-2xl px-2.5 py-2 text-center min-w-[52px] shadow-md`}>',
  '<div key={idx} className={`bg-white/90 border ${isWedding ? "border-[#C5A059]/40 bg-slate-900/90 text-amber-200" : activeTheme === "birthday-4" ? "border-lime-200" : activeTheme === "birthday-3" ? "border-amber-200" : activeTheme === "birthday-2" ? "border-emerald-250" : "border-yellow-200"} rounded-2xl px-2.5 py-2 text-center min-w-[52px] shadow-md`}>'
);

content = content.replace(
  '<span className="block text-xl font-extrabold text-slate-800 leading-none">{item.value}</span>',
  '<span className={`block text-xl font-extrabold leading-none ${isWedding ? "text-[#D4AF37]" : "text-slate-800"}`}>{item.value}</span>'
);

content = content.replace(
  '<span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block mt-1">{item.label}</span>',
  '<span className={`text-[8px] font-black uppercase tracking-wider block mt-1 ${isWedding ? "text-amber-100/80" : "text-slate-500"}`}>{item.label}</span>'
);

// 5. Fix Save to Calendar ICS summary for isWedding
content = content.replace(
  '`SUMMARY:${isKhitan ? "Walimatul Khitan" : "Birthday Party"} ${childFullName}`,',
  '`SUMMARY:${isWedding ? "The Wedding of Yoshua & Jessica" : isKhitan ? "Walimatul Khitan" : "Birthday Party"} ${childFullName}`,'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully polished wedding-1 cover, header font, countdown, and calendar summary!');
