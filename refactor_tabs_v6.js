const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add state
content = content.replace(
  'const [showUpgradeModal, setShowUpgradeModal] = useState(false);',
  'const [showUpgradeModal, setShowUpgradeModal] = useState(false);\n  const [activeTab, setActiveTab] = useState("kelola");'
);

// 2. Add Tabs right inside the massive wrapper
const massiveWrapperStart = `<div className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/80 shadow-xl shadow-slate-100/30 space-y-5">`;
const tabsHtml = `
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                  <button type="button" onClick={() => setActiveTab("kelola")} className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'kelola' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}>📨 Kelola Penerima Undangan</button>
                  <button type="button" onClick={() => setActiveTab("ucapan")} className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'ucapan' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}>💬 Ucapan, Doa & RSVP</button>
                  <button type="button" onClick={() => setActiveTab("scanner")} className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'scanner' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}>📱 Buku Tamu QR Code</button>
                  <button type="button" onClick={() => setActiveTab("statistik")} className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'statistik' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}>📊 Statistik & Kehadiran</button>
                  <button type="button" onClick={() => setActiveTab("log")} className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}>👥 Log Kehadiran</button>
                </div>
`;
content = content.replace(
  massiveWrapperStart,
  massiveWrapperStart + '\n' + tabsHtml + '\n                {/* TAB_KELOLA_START */}\n                <div className={activeTab === "kelola" ? "space-y-5" : "hidden"}>'
);

// 3. Kelola End / Ucapan Start
content = content.replace(
  '{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}',
  '</div>\n                {/* TAB_UCAPAN_START */}\n                <div className={activeTab === "ucapan" ? "space-y-5" : "hidden"}>\n            {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}'
);

// 4. Ucapan End / Scanner Start
content = content.replace(
  '{/* Scanner Penerima Tamu Button */}',
  '</div>\n                {/* TAB_SCANNER_START */}\n                <div className={activeTab === "scanner" ? "space-y-5" : "hidden"}>\n                {/* Scanner Penerima Tamu Button */}'
);

// 5. Scanner End / Statistik Start
content = content.replace(
  '{/* Dashboard Analytics & Chart */}',
  '</div>\n                {/* TAB_STATISTIK_START */}\n                <div className={activeTab === "statistik" ? "space-y-5" : "hidden"}>\n                {/* Dashboard Analytics & Chart */}'
);

// 6. Statistik End / Log Start
content = content.replace(
  '{/* Log Kehadiran Tamu (Semua Check-in) */}',
  '</div>\n                {/* TAB_LOG_START */}\n                <div className={activeTab === "log" ? "space-y-5" : "hidden"}>\n                {/* Log Kehadiran Tamu (Semua Check-in) */}'
);

// 7. Log End
// Find the end of the Log section. The PDF Download button is right after it.
// And after the PDF download button is `</div>\n            )}` which ends the massive wrapper.
// Let's replace the `</div>\n            )}` that appears just before `{/* Info Section */}`
// Actually, it's easier to find the exact line.
const endOfMassiveWrapper = `
                  </div>
                )}

          </div>
        )}

        {/* Info Section */}`;

// Let's just find `{/* Info Section */}` and close the `TAB_LOG_START` div right before the `</div>\n            )}`
// We know `</div>\n            )}` comes exactly before `{guests.length > 0 && (`. Wait, NO!
// Let's look at the original code again:
/*
1623:               </div>
1624:             )}
1625: 
1626: 
1627:                 {guests.length > 0 && (
1628:                   <div className="flex">
...
1870:                 )}
1871: 
1872:           </div>
1873:         )}
1874: 
1875:         {/* Info Section */}
*/

// Ah! `Kelola Penerima Undangan Dashboard` ends at 1624. 
// AND THEN `guests.length > 0 && (` starts at 1627.
// AND THEN the ENTIRE `{/* Content Loaded */}` block ends at 1873.

content = content.replace(
  /              <\/div>\n            \)}\n\n\n                \{guests\.length > 0 && \(/,
  '              </div>\n                {/* TAB_LOG_END */}\n                </div>\n              </div>\n            )}\n\n\n                {guests.length > 0 && ('
);

// Wait, we want the PDF button to be inside the Log tab.
// Currently the PDF button is outside the massive wrapper.
// If we want it inside, we should move it. Let's just keep it outside for now so we don't break anything! The PDF button will just show up at the bottom of the tabs. 
// Let's actually move the PDF button into the Log tab, because it's better UX.

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring completed with CSS hidden trick.');
