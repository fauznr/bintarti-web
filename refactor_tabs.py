import os
import re

file_path = os.path.join(os.path.dirname(__file__), 'src', 'app', 'cek-undangan', '[id]', 'page.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
content = content.replace(
    'const [showUpgradeModal, setShowUpgradeModal] = useState(false);',
    'const [showUpgradeModal, setShowUpgradeModal] = useState(false);\n  const [activeTab, setActiveTab] = useState("kelola");'
)

# 2. Add Tabs right inside the massive wrapper
massive_wrapper_start = '<div className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/80 shadow-xl shadow-slate-100/30 space-y-5">'
tabs_html = """
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                  <button type="button" onClick={() => setActiveTab("kelola")} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${activeTab === 'kelola' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>📨 Kelola Penerima Undangan</button>
                  <button type="button" onClick={() => setActiveTab("ucapan")} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${activeTab === 'ucapan' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>💬 Ucapan, Doa & RSVP</button>
                  <button type="button" onClick={() => setActiveTab("scanner")} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${activeTab === 'scanner' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>📱 Buku Tamu QR Code</button>
                  <button type="button" onClick={() => setActiveTab("statistik")} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${activeTab === 'statistik' ? 'bg-purple-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>📊 Statistik & Kehadiran</button>
                  <button type="button" onClick={() => setActiveTab("log")} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${activeTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>👥 Log Kehadiran</button>
                </div>
"""
content = content.replace(
    massive_wrapper_start,
    massive_wrapper_start + '\n' + tabs_html + '\n                {/* TAB_KELOLA_START */}\n                <div className={activeTab === "kelola" ? "space-y-5" : "hidden"}>'
)

# 3. Kelola End / Ucapan Start
content = content.replace(
    '{/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}',
    '</div>\n                {/* TAB_UCAPAN_START */}\n                <div className={activeTab === "ucapan" ? "space-y-5" : "hidden"}>\n            {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}'
)

# 4. Ucapan End / Scanner Start
content = content.replace(
    '{/* Scanner Penerima Tamu Button */}',
    '</div>\n                {/* TAB_SCANNER_START */}\n                <div className={activeTab === "scanner" ? "space-y-5" : "hidden"}>\n                {/* Scanner Penerima Tamu Button */}'
)

# 5. Scanner End / Statistik Start
content = content.replace(
    '{/* Dashboard Analytics & Chart */}',
    '</div>\n                {/* TAB_STATISTIK_START */}\n                <div className={activeTab === "statistik" ? "space-y-5" : "hidden"}>\n                {/* Dashboard Analytics & Chart */}'
)

# 6. Statistik End / Log Start
content = content.replace(
    '{/* Log Kehadiran Tamu (Semua Check-in) */}',
    '</div>\n                {/* TAB_LOG_START */}\n                <div className={activeTab === "log" ? "space-y-5" : "hidden"}>\n                {/* Log Kehadiran Tamu (Semua Check-in) */}'
)

# 7. Log End
# We use regex to match the PDF download button which looks like:
# {guests.length > 0 && (
#   <div className="flex">
#     {!result.isPro ? (
pattern = r'(\{guests\.length > 0 && \(\s*<div className="flex">\s*\{\!result\.isPro \? \()'
content = re.sub(pattern, r'</div>\n                \1', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactoring completed with Python script.")
