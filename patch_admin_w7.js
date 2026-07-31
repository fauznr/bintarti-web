const fs = require('fs');
const path = 'src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf-8');

const target = `<div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-700 mb-3">👤 Foto Profil Kedua Mempelai (Opsional)</h5>`;

const replacement = `{(selectedInvitation.theme !== "Wedding 7") && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-700 mb-3">👤 Foto Profil Kedua Mempelai (Opsional)</h5>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    
    // Now find the closing div of this block.
    // The block ends around line 2230.
    const endTarget = `                      </div>
                    </div>

                    
                    {/* WEDDING 6 EXTRA BACKGROUNDS */}`;
    const endReplacement = `                      </div>
                    </div>
                    )}

                    
                    {/* WEDDING 6 EXTRA BACKGROUNDS */}`;
    if (content.includes(endTarget)) {
        content = content.replace(endTarget, endReplacement);
        fs.writeFileSync(path, content);
        console.log("Admin page patched for Wedding 7 profile photos");
    } else {
        console.log("Could not find endTarget");
    }
} else {
    console.log("Could not find target block");
}
