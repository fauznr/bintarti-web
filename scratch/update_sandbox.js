const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add Aqiqah to type
content = content.replace(
  'type: "Khitan" | "Birthday";',
  'type: "Khitan" | "Birthday" | "Aqiqah";'
);

// 2. Add Aqiqah to useState
content = content.replace(
  'useState<"Khitan" | "Birthday">("Khitan");',
  'useState<"Khitan" | "Birthday" | "Aqiqah">("Khitan");'
);

// 3. Add Aqiqah 1 to sandboxThemes
const aqiqahTheme = `
  {
    id: "aqiqah-1",
    title: "Bintarti Aqiqah 1",
    type: "Aqiqah",
    accentColor: "#1E40AF",
    bgColor: "bg-blue-50",
    textColor: "text-slate-800",
    fontFamily: "font-sans",
    description: "Tema Aqiqah lucu dengan background awan dan bintang serta dekorasi teddy bear.",
    previewUrl: "/sandbox-tema/aqiqah-1"
  }
];`;

content = content.replace(
  '  }\n];',
  '  },' + aqiqahTheme
);

// 4. Add the Aqiqah tab in the UI
// Look for the Birthday tab button
const birthdayTabBtn = `onClick={() => setActiveTab("Birthday")}`;
const aqiqahTabBtn = `<button
                onClick={() => setActiveTab("Aqiqah")}
                className={\`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 \${
                  activeTab === "Aqiqah"
                    ? "bg-slate-800 text-white shadow-md shadow-slate-200"
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                }\`}
              >
                <Cake className="w-4 h-4" />
                <span>Aqiqah</span>
              </button>`;
content = content.replace(
  /(<button[^>]*onClick={\(\) => setActiveTab\("Birthday"\)}[\s\S]*?<\/button>)/,
  '$1\n' + aqiqahTabBtn
);

fs.writeFileSync(pageFile, content);
console.log("Updated Sandbox page!");
