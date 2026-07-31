const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Update activeTab type state to include Wedding
content = content.replace(
  'const [activeTab, setActiveTab] = useState<"Khitan" | "Birthday" | "Aqiqah">("Khitan");',
  'const [activeTab, setActiveTab] = useState<"Wedding" | "Khitan" | "Birthday" | "Aqiqah">("Wedding");'
);

// 2. Update Tabs buttons array to include "Wedding" first
content = content.replace(
  '{(["Khitan", "Aqiqah", "Birthday"] as const).map((tab) => (',
  '{(["Wedding", "Khitan", "Aqiqah", "Birthday"] as const).map((tab) => ('
);

// 3. Update tab label formatting
content = content.replace(
  '{tab === "Birthday" ? "Birthday (Ulang Tahun)" : tab}',
  '{tab === "Wedding" ? "Wedding (Pernikahan)" : tab === "Birthday" ? "Birthday (Ulang Tahun)" : tab}'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully added Wedding tab to Sandbox Tema catalog!');
