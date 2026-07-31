const fs = require('fs');
const path = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/components/admin/GuestbookManager.tsx';
let c = fs.readFileSync(path, 'utf8');

// 1. Add whatsapp to interface
c = c.replace('type: string;', 'type: string;\n    whatsapp?: string;');

// 2. Add whatsapp to select query
c = c.replace('.select("*, invitations(id, full_name, type)")', '.select("*, invitations(id, full_name, type, whatsapp)")');

// 3. Update groupedComments reducer to extract whatsapp
const oldReducer = `        acc[id] = {
          invitationId: id,
          invitationName: curr.invitations?.full_name || id,
          comments: []
        };`;
const newReducer = `        acc[id] = {
          invitationId: id,
          invitationName: curr.invitations?.full_name || id,
          whatsapp: curr.invitations?.whatsapp || "",
          comments: []
        };`;
c = c.replace(oldReducer, newReducer);
c = c.replace('Record<string, { invitationId: string, invitationName: string, comments: GuestComment[] }>', 'Record<string, { invitationId: string, invitationName: string, whatsapp: string, comments: GuestComment[] }>');

// 4. Update the groupedComments header to include the WA button and info
const oldHeader = `                  <div>
                    <h3 className="text-lg font-black text-slate-800">{group.invitationName}</h3>
                    <p className="text-xs font-bold text-slate-500">{group.comments.length} Ucapan</p>
                  </div>
                  <button 
                    onClick={() => handleExportCSV(group)}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor CSV
                  </button>`;

const newHeader = `                  <div>
                    <h3 className="text-lg font-black text-slate-800">{group.invitationName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-bold text-slate-500">{group.comments.length} Ucapan</p>
                      {group.whatsapp && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-500">{group.whatsapp}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleExportCSV(group)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Ekspor CSV
                    </button>
                    {group.whatsapp && (
                      <a 
                        href={\`https://wa.me/\${group.whatsapp.replace(/\\D/g, '')}?text=\${encodeURIComponent(\`Halo \${group.invitationName}, berikut adalah data buku tamu dari undangan Anda. Silakan cek dokumen CSV yang kami lampirkan ya.\`)}\`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-green-600 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Kirim WA
                      </a>
                    )}
                  </div>`;
c = c.replace(oldHeader, newHeader);

// Update handleExportCSV signature slightly just in case it doesn't match the new record type
c = c.replace('group: { invitationId: string, invitationName: string, comments: GuestComment[] }', 'group: { invitationId: string, invitationName: string, whatsapp?: string, comments: GuestComment[] }');

fs.writeFileSync(path, c);
console.log('Successfully added whatsapp feature');
