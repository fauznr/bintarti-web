const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add import statement at top
content = content.replace(
  'import { supabase } from "../../../utils/supabase";',
  'import { supabase } from "../../../utils/supabase";\nimport Wedding1View from "@/components/wedding/Wedding1View";'
);

// 2. Add return for isWedding after dbError check
const dbErrorCheck = `  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-slate-800">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">{dbError}</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 transition-colors text-white rounded-xl text-xs font-bold shadow-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }`;

const weddingReturn = `  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-slate-800">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">{dbError}</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 transition-colors text-white rounded-xl text-xs font-bold shadow-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (isWedding && !designerOpen) {
    return (
      <Wedding1View 
        invitationData={invitationData}
        guestName={guestName}
        themeId={themeId}
      />
    );
  }`;

if (content.includes(dbErrorCheck)) {
  content = content.replace(dbErrorCheck, weddingReturn);
  fs.writeFileSync(pageFile, content);
  console.log('Successfully integrated Wedding1View component into page.tsx!');
} else {
  console.log('Could not find dbErrorCheck in page.tsx');
}
