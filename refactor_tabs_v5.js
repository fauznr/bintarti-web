const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
let lines = fs.readFileSync(filePath, 'utf-8').split('\n');
let newLines = [];

const tabNavHtml = `
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setActiveTab("kelola")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'kelola' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📨 Kelola Penerima Undangan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ucapan")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'ucapan' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    💬 Ucapan, Doa & RSVP
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("scanner")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'scanner' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📱 Buku Tamu QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("statistik")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'statistik' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    📊 Statistik & Kehadiran
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("log")}
                    className={\`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 \${activeTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    👥 Log Kehadiran
                  </button>
                </div>
`;

let isInsideMassiveWrapper = false;
let pdfBlock = [];
let capturePdf = false;
let pdfCaptured = false;

// First pass: extract PDF block and remove it from original lines
const pdfStartIdx = lines.findIndex(l => l.includes('{guests.length > 0 && ('));
const pdfEndIdx = lines.findIndex(l => l.includes('{/* Info Section */}'));

if (pdfStartIdx !== -1 && pdfEndIdx !== -1) {
  // Extract and remove the PDF block
  pdfBlock = lines.splice(pdfStartIdx, pdfEndIdx - pdfStartIdx);
}

// Now we rebuild the file
for (let i = 0; i < lines.length; i++) {
  let l = lines[i];

  if (l.includes('const [showUpgradeModal, setShowUpgradeModal] = useState(false);')) {
    newLines.push(l);
    newLines.push('  const [activeTab, setActiveTab] = useState("kelola");');
    continue;
  }

  if (l.includes('<div className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/80 shadow-xl shadow-slate-100/30 space-y-5">')) {
    newLines.push(l);
    newLines.push(tabNavHtml);
    newLines.push("                {activeTab === 'kelola' && (");
    newLines.push("                  <div className=\"space-y-5\">");
    isInsideMassiveWrapper = true;
    continue;
  }

  if (l.includes('{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}')) {
    newLines.push("                  </div>");
    newLines.push("                )}");
    newLines.push("                {activeTab === 'ucapan' && (");
    newLines.push("                  <div className=\"space-y-5\">");
    newLines.push(l);
    continue;
  }

  if (l.includes('{/* Scanner Penerima Tamu Button */}')) {
    newLines.push("                  </div>");
    newLines.push("                )}");
    newLines.push("                {activeTab === 'scanner' && (");
    newLines.push("                  <div className=\"space-y-5\">");
    newLines.push(l);
    continue;
  }

  if (l.includes('{/* Dashboard Analytics & Chart */}')) {
    newLines.push("                  </div>");
    newLines.push("                )}");
    newLines.push("                {activeTab === 'statistik' && (");
    newLines.push("                  <div className=\"space-y-5\">");
    newLines.push(l);
    continue;
  }

  if (l.includes('{/* Log Kehadiran Tamu (Semua Check-in) */}')) {
    newLines.push("                  </div>");
    newLines.push("                )}");
    newLines.push("                {activeTab === 'log' && (");
    newLines.push("                  <div className=\"space-y-5\">");
    newLines.push(l);
    continue;
  }

  // Check for the end of the massive wrapper
  if (isInsideMassiveWrapper && l.trim() === ')}' && i > 0 && lines[i - 1].trim() === '</div>' && lines[i + 1] && lines[i + 1].includes('{/* Info Section */}')) {
    // We are at the end of the massive wrapper
    if (pdfBlock.length > 0) {
      newLines.push(...pdfBlock);
    }
    newLines.push("                  </div>");
    newLines.push("                )}");
    newLines.push(l); // push the `)}`
    isInsideMassiveWrapper = false;
    continue;
  }

  newLines.push(l);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
console.log('Refactoring completed bulletproof.');
