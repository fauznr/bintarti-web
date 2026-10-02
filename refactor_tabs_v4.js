const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
let lines = fs.readFileSync(filePath, 'utf-8').split('\n');

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

// Insert Tab Navigation + Kelola
const kelolaStartIdx = lines.findIndex(l => l.includes('<div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">'));
if (kelolaStartIdx !== -1) {
  lines.splice(kelolaStartIdx, 0, tabNavHtml + "\n                {activeTab === 'kelola' && (\n                  <div className=\"space-y-5\">");
}

// Ucapan
const ucapanStartIdx = lines.findIndex(l => l.includes('{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}'));
if (ucapanStartIdx !== -1) {
  lines.splice(ucapanStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'ucapan' && (\n                  <div className=\"space-y-5\">");
}

// Scanner
const scannerStartIdx = lines.findIndex(l => l.includes('{/* Scanner Penerima Tamu Button */}'));
if (scannerStartIdx !== -1) {
  lines.splice(scannerStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'scanner' && (\n                  <div className=\"space-y-5\">");
}

// Statistik
const statStartIdx = lines.findIndex(l => l.includes('{/* Dashboard Analytics & Chart */}'));
if (statStartIdx !== -1) {
  lines.splice(statStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'statistik' && (\n                  <div className=\"space-y-5\">");
}

// Log
const logStartIdx = lines.findIndex(l => l.includes('{/* Log Kehadiran Tamu (Semua Check-in) */}'));
if (logStartIdx !== -1) {
  lines.splice(logStartIdx, 0, "                  </div>\n                )}\n                {activeTab === 'log' && (\n                  <div className=\"space-y-5\">");
}

// Close Log at the end
const pdfBtnIdx = lines.findIndex(l => l.includes('{guests.length > 0 && ('));
const infoIdx = lines.findIndex(l => l.includes('{/* Info Section */}'));

if (pdfBtnIdx !== -1 && infoIdx !== -1) {
  let pdfBlock = lines.splice(pdfBtnIdx, infoIdx - pdfBtnIdx - 1);
  const massiveWrapperEnd = lines.findIndex((l, i) => l.trim() === ')}' && i > 0 && lines[i - 1].trim() === '</div>');
  
  if (massiveWrapperEnd !== -1) {
    lines.splice(massiveWrapperEnd - 1, 0, ...pdfBlock);
    lines.splice(massiveWrapperEnd - 1 + pdfBlock.length, 0, "                  </div>\n                )}");
  } else {
    console.log("Could not find massive wrapper end!");
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Refactoring completed inside the massive wrapper.');
