const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

// Find insertion point for state
const stateIdx = lines.findIndex(l => l.includes('const [showUpgradeModal, setShowUpgradeModal] = useState(false);'));
if (stateIdx !== -1 && !lines.find(l => l.includes('const [activeTab, setActiveTab] = useState'))) {
  lines.splice(stateIdx + 1, 0, '  const [activeTab, setActiveTab] = useState("kelola");');
}

// Find Dashboard End
const dashboardEndIdx = lines.findIndex(l => l.includes('{/* Kelola Penerima Undangan Dashboard */}'));

const tabNavHtml = `
            {/* Tab Navigation */}
            {result.status.toLowerCase() === 'selesai' && (
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
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
            )}
`;

if (dashboardEndIdx !== -1) {
  lines.splice(dashboardEndIdx, 0, tabNavHtml);
}

// Recalculate indices
const s1 = lines.findIndex(l => l.includes('{/* Kelola Penerima Undangan Dashboard */}'));
const s2 = lines.findIndex(l => l.includes('{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}'));
const s3 = lines.findIndex(l => l.includes('{/* Scanner Penerima Tamu Button */}'));
const s4 = lines.findIndex(l => l.includes('{/* Dashboard Analytics & Chart */}'));
const s5 = lines.findIndex(l => l.includes('{/* Log Kehadiran Tamu (Semua Check-in) */}'));
const sInfo = lines.findIndex(l => l.includes('{/* Info Section */}'));

if (sInfo !== -1) {
  lines.splice(sInfo, 0, "              </div>\n            )}");
}
if (s5 !== -1) {
  lines.splice(s5, 0, "              </div>\n            )}\n            {activeTab === 'log' && (\n              <div className=\"space-y-4\">");
}
if (s4 !== -1) {
  lines.splice(s4, 0, "              </div>\n            )}\n            {activeTab === 'statistik' && (\n              <div className=\"space-y-4\">");
}
if (s3 !== -1) {
  lines.splice(s3, 0, "              </>\n            )}\n            {activeTab === 'scanner' && (\n              <div className=\"space-y-4\">");
}
if (s2 !== -1) {
  lines.splice(s2, 0, "              </>\n            )}\n            {activeTab === 'ucapan' && (\n              <>");
}
if (s1 !== -1) {
  lines.splice(s1, 0, "            {activeTab === 'kelola' && (\n              <>");
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Refactoring completed successfully line by line.');
