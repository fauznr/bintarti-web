const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// Replace Hero section (lines 262-284) with bulletproof centered structure
const oldHero = `<section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 bg-cover bg-center" style={{ backgroundImage: \`url(\${invitationData?.child_photo_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"})\` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-[#0F172A]" />

            <div className="relative z-10 space-y-4 animate-fade-in-up flex flex-col items-center justify-center text-center my-auto w-full max-w-sm mx-auto">
              <span className="text-[11px] font-sans tracking-[0.3em] font-extrabold uppercase text-[#D4AF37] bg-slate-900/80 px-4 py-1.5 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
                The Wedding of
              </span>
              
              <h1 className="text-4xl font-serif text-[#C5A059] font-bold tracking-tight filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Yoshua & Jessica
              </h1>

              <p className="text-xs font-sans text-slate-300 font-semibold tracking-widest uppercase">
                Sabtu, 25 Januari 2026
              </p>

              <div className="pt-8">
                <ChevronDown className="w-6 h-6 text-[#C5A059] mx-auto animate-bounce opacity-80" />
              </div>
            </div>
          </section>`;

const newHero = `<section className="w-full min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 relative bg-cover bg-center" style={{ backgroundImage: \`url(\${invitationData?.child_photo_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"})\` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-[#0F172A]" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-5 my-auto max-w-sm mx-auto">
              <div className="w-full flex justify-center text-center">
                <span className="inline-block text-[11px] font-sans tracking-[0.3em] font-extrabold uppercase text-[#D4AF37] bg-slate-900/90 px-4 py-1.5 rounded-full border border-[#C5A059]/50 backdrop-blur-md text-center mx-auto shadow-md">
                  The Wedding of
                </span>
              </div>
              
              <h1 className="w-full text-center text-4xl sm:text-5xl font-serif text-[#C5A059] font-bold tracking-tight filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-tight">
                Yoshua & Jessica
              </h1>

              <p className="w-full text-center text-xs font-sans text-slate-300 font-semibold tracking-widest uppercase">
                Sabtu, 25 Januari 2026
              </p>

              <div className="w-full flex justify-center pt-8">
                <ChevronDown className="w-6 h-6 text-[#C5A059] animate-bounce opacity-80" />
              </div>
            </div>
          </section>`;

content = content.replace(oldHero, newHero);

// Also replace Cover section content
const oldCoverContent = `<div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase">The Wedding of</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif text-[#C5A059] font-bold tracking-tight filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">
              Yoshua & Jessica
            </h1>

            <p className="text-xs font-sans font-medium tracking-widest text-slate-300 uppercase">
              Sabtu, 25 Januari 2026
            </p>`;

const newCoverContent = `<div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto">
            <div className="w-full flex justify-center text-center">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 backdrop-blur-md mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase text-center">The Wedding of</span>
              </div>
            </div>

            <h1 className="w-full text-center text-4xl sm:text-5xl font-serif text-[#C5A059] font-bold tracking-tight filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">
              Yoshua & Jessica
            </h1>

            <p className="w-full text-center text-xs font-sans font-medium tracking-widest text-slate-300 uppercase">
              Sabtu, 25 Januari 2026
            </p>`;

content = content.replace(oldCoverContent, newCoverContent);

fs.writeFileSync(viewFile, content);
console.log('Successfully applied 100% bulletproof flex centering to hero and cover!');
