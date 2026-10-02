const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'cek-undangan', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add activeTab state
if (!content.includes('const [activeTab, setActiveTab] = useState')) {
  content = content.replace(
    'const [showUpgradeModal, setShowUpgradeModal] = useState(false);',
    'const [showUpgradeModal, setShowUpgradeModal] = useState(false);\n  const [activeTab, setActiveTab] = useState("kelola");'
  );
}

// 2. Locate the end of the Dashboard Card
const dashboardEnd = '{/* Kelola Penerima Undangan Dashboard */}';

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

content = content.replace(dashboardEnd, tabNavHtml + '\n            ' + dashboardEnd);

// 3. Wrap Sections
// Section 1: Kelola
content = content.replace(
  "{/* Kelola Penerima Undangan Dashboard */}",
  "{activeTab === 'kelola' && (\n              <>\n                {/* Kelola Penerima Undangan Dashboard */}"
);
content = content.replace(
  "            {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}",
  "              </>\n            )}\n\n            {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}"
);

// Section 2: Ucapan
content = content.replace(
  "{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}",
  "{activeTab === 'ucapan' && (\n              <>\n                {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}"
);
content = content.replace(
  "                {/* Scanner Penerima Tamu Button */}",
  "              </>\n            )}\n\n                {/* Scanner Penerima Tamu Button */}"
);

// Section 3: Scanner
content = content.replace(
  "{/* Scanner Penerima Tamu Button */}",
  "{activeTab === 'scanner' && (\n              <div className=\"space-y-4\">\n                {/* Scanner Penerima Tamu Button */}"
);
content = content.replace(
  "                {/* Dashboard Analytics & Chart */}",
  "              </div>\n            )}\n\n                {/* Dashboard Analytics & Chart */}"
);

// Section 4: Statistik
content = content.replace(
  "{/* Dashboard Analytics & Chart */}",
  "{activeTab === 'statistik' && (\n              <>\n                {/* Dashboard Analytics & Chart */}"
);
content = content.replace(
  "                {/* Log Kehadiran Tamu (Semua Check-in) */}",
  "              </>\n            )}\n\n                {/* Log Kehadiran Tamu (Semua Check-in) */}"
);

// Section 5: Log
content = content.replace(
  "{/* Log Kehadiran Tamu (Semua Check-in) */}",
  "{activeTab === 'log' && (\n              <>\n                {/* Log Kehadiran Tamu (Semua Check-in) */}"
);

// Look for the end of the Content section. The PDF Download button is inside Log Kehadiran Tamu technically? No, it was originally after Log Kehadiran Tamu.
// Let's check where the PDF button is.
content = content.replace(
  "        {/* Info Section */}",
  "              </>\n            )}\n\n        {/* Info Section */}"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring completed successfully.');
