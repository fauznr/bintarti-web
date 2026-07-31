const fs = require('fs');
const path = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/components/admin/GuestbookManager.tsx';
let c = fs.readFileSync(path, 'utf8');

const groupedCommentsCode = `
  const groupedComments = Object.values(
    filteredComments.reduce((acc, curr) => {
      const id = curr.invitation_id;
      if (!acc[id]) {
        acc[id] = {
          invitationId: id,
          invitationName: curr.invitations?.full_name || id,
          comments: []
        };
      }
      acc[id].comments.push(curr);
      return acc;
    }, {} as Record<string, { invitationId: string, invitationName: string, comments: GuestComment[] }>)
  ).sort((a, b) => b.comments.length - a.comments.length);

  const handleExportCSV = (group: { invitationId: string, invitationName: string, comments: GuestComment[] }) => {
    if (group.comments.length === 0) {
`;

c = c.replace('  const handleExportCSV = () => {\n    if (filteredComments.length === 0) {', groupedCommentsCode);
c = c.replace(/const rows = filteredComments\.map\(c =>/g, 'const rows = group.comments.map(c =>');
c = c.replace(/Data_Buku_Tamu_\$\{new Date/g, 'Buku_Tamu_${group.invitationName.replace(/[^a-z0-9]/gi, "_")}_${new Date');

// Remove global export button
const globalExportBtn = `          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm border border-emerald-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Ekspor CSV
          </button>`;
c = c.replace(globalExportBtn, '');

// Update render
const oldRenderStart = `        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComments.map((comment) => (`;

const newRenderStart = `        ) : (
          <div className="space-y-10">
            {groupedComments.map((group) => (
              <div key={group.invitationId} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{group.invitationName}</h3>
                    <p className="text-xs font-bold text-slate-500">{group.comments.length} Ucapan</p>
                  </div>
                  <button 
                    onClick={() => handleExportCSV(group)}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor CSV
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.comments.map((comment) => (`;

c = c.replace(oldRenderStart, newRenderStart);

const oldRenderEnd = `                  </button>
                </div>
              </div>
            ))}
          </div>
        )}`;

const newRenderEnd = `                  </button>
                </div>
              </div>
            ))}
                </div>
              </div>
            ))}
          </div>
        )}`;

c = c.replace(oldRenderEnd, newRenderEnd);

// Also remove the "Di Undangan:" part inside the card since it's already grouped by invitation!
const diUndanganBlock = `                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Di Undangan:</span>
                    <span className="text-xs font-bold text-primary truncate max-w-[150px]">
                      {comment.invitations?.full_name || comment.invitation_id}
                    </span>
                  </div>`;
c = c.replace(diUndanganBlock, '                  <div className="flex flex-col"></div>');

fs.writeFileSync(path, c);
console.log('Successfully refactored GuestbookManager');
