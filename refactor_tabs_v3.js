const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
let lines = fs.readFileSync(filePath, 'utf-8').split('\n');

// Find insertion point for state
const stateIdx = lines.findIndex(l => l.includes('const [showUpgradeModal, setShowUpgradeModal] = useState(false);'));
if (stateIdx !== -1 && !lines.find(l => l.includes('const [activeTab, setActiveTab] = useState'))) {
  lines.splice(stateIdx + 1, 0, '  const [activeTab, setActiveTab] = useState("kelola");');
}

const tabNavHtml = `
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                  <button
                    onClick={() => setActiveTab("kelola")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'kelola' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📨 Kelola Penerima Undangan
                  </button>
                  <button
                    onClick={() => setActiveTab("ucapan")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'ucapan' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    💬 Ucapan, Doa & RSVP
                  </button>
                  <button
                    onClick={() => setActiveTab("scanner")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'scanner' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📱 Buku Tamu QR Code
                  </button>
                  <button
                    onClick={() => setActiveTab("statistik")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'statistik' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📊 Statistik & Kehadiran
                  </button>
                  <button
                    onClick={() => setActiveTab("log")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    👥 Log Kehadiran
                  </button>
                </div>
`;

// Wrap individual sections inside the massive wrapper
const kelolaStartIdx = lines.findIndex(l => l.includes('<div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">'));
if (kelolaStartIdx !== -1) {
  lines.splice(kelolaStartIdx, 0, tabNavHtml + "\n                {activeTab === 'kelola' && (\n                  <div className=\"space-y-5\">");
}

const ucapanStartIdx = lines.findIndex(l => l.includes('{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}'));
if (ucapanStartIdx !== -1) {
  lines.splice(ucapanStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'ucapan' && (\n                  <div className=\"space-y-5\">");
}

const scannerStartIdx = lines.findIndex(l => l.includes('{/* Scanner Penerima Tamu Button */}'));
if (scannerStartIdx !== -1) {
  lines.splice(scannerStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'scanner' && (\n                  <div className=\"space-y-5\">");
}

const statStartIdx = lines.findIndex(l => l.includes('{/* Dashboard Analytics & Chart */}'));
if (statStartIdx !== -1) {
  lines.splice(statStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'statistik' && (\n                  <div className=\"space-y-5\">");
}

const logStartIdx = lines.findIndex(l => l.includes('{/* Log Kehadiran Tamu (Semua Check-in) */}'));
if (logStartIdx !== -1) {
  lines.splice(logStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'log' && (\n                  <div className=\"space-y-5\">");
}

// Move PDF Download button inside Log Kehadiran Tamu
// Find where it ends
const pdfBtnIdx = lines.findIndex(l => l.includes('{guests.length > 0 && ('));
const infoIdx = lines.findIndex(l => l.includes('{/* Info Section */}'));

if (pdfBtnIdx !== -1 && infoIdx !== -1) {
  // Grab the PDF code block
  // It starts from pdfBtnIdx to infoIdx - 1
  let pdfBlock = lines.splice(pdfBtnIdx, infoIdx - pdfBtnIdx - 1);
  
  // Now we need to find the `</div>\n)}` of the main wrapper.
  // We can just find the last `</div>` before the old pdfBtnIdx.
  // Let's insert the closing tags for the 'log' tab right before the massive wrapper closes.
  
  // Let's find the closing of massive wrapper `)}`. It should be just above where the pdf block was.
  const massiveWrapperEnd = lines.findIndex(l => l.trim() === ')}' && lines[l - 1].trim() === '</div>');
  
  if (massiveWrapperEnd !== -1) {
    // Insert PDF block BEFORE the massive wrapper ends, so it's inside `activeTab === 'log'`
    lines.splice(massiveWrapperEnd - 1, 0, ...pdfBlock);
    
    // Now close the 'log' tab
    lines.splice(massiveWrapperEnd - 1 + pdfBlock.length, 0, "                  </div>\n                )}");
  } else {
    console.log("Could not find massive wrapper end!");
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Refactoring completed inside the massive wrapper.');
