const fs = require('fs');
const path = 'src/components/wedding/Wedding2View.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace handleSubmitRsvp to handleSubmitRSVP
content = content.replace(/onSubmit=\{handleSubmitRsvp\}/g, 'onSubmit={handleSubmitRSVP}');

// Replace rsvpAttendance to rsvpStatus
content = content.replace(/rsvpAttendance/g, 'rsvpStatus');

// Replace the entire comments feed mapping
const commentsFeedRegex = /<div className="space-y-2\.5 max-h-72 overflow-y-auto pr-1">[\s\S]*?<\/div>\s*<\/div>/;
const newCommentsFeed = `<div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {comments.length > 0 ? comments.map((item, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-md space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-white">{item.name}</span>
                        <span className={\`text-[9px] font-bold px-2.5 py-0.5 rounded-full \${
                          (item.rsvp_status || item.attendance)?.includes("Hadir") ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/30" : "bg-amber-900/80 text-amber-200 border border-amber-500/30"
                        }\`}>
                          {item.rsvp_status || item.attendance || "Hadir"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed pt-1">{item.comment || item.message}</p>
                      <span className="block text-[9px] text-zinc-400 mt-1">
                        {item.created_at && !isNaN(new Date(item.created_at).getTime()) ? new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : item.created_at}
                      </span>
                    </div>
                  )) : (
                    <p className="text-xs text-zinc-400">Belum ada ucapan.</p>
                  )}
                </div>
              </div>`;
content = content.replace(commentsFeedRegex, newCommentsFeed);

// Replace the closing text
content = content.replace(/<span className="text-3xl font-adea-forum text-white block mt-1 uppercase font-bold drop-shadow-md">Reza &amp; Dania<\/span>/, '<span className="text-3xl font-adea-forum text-white block mt-1 uppercase font-bold drop-shadow-md">{coupleNames}</span>');

fs.writeFileSync(path, content);
console.log("Updated RSVP and Comments mapping.");
