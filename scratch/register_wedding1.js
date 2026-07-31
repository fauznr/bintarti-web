const fs = require('fs');

// 1. Update katalog.ts
let katalog = fs.readFileSync('src/data/katalog.ts', 'utf8');
if (!katalog.includes('name: "Wedding 1"')) {
  const newWeddingEntry = `  {
    id: 100,
    name: "Wedding 1",
    category: "Wedding",
    accentColor: "#C5A059",
    bgColor: "bg-slate-50",
    textColor: "text-slate-900",
    fontFamily: "font-serif",
    description: "Desain undangan pernikahan eksklusif berkonsep landing page modern yang terinspirasi dari Jessica Bevitation."
  },\n`;
  katalog = katalog.replace('export const templates: Template[] = [\n', 'export const templates: Template[] = [\n' + newWeddingEntry);
  fs.writeFileSync('src/data/katalog.ts', katalog);
  console.log('Successfully added Wedding 1 to katalog.ts');
}

// 2. Update sandbox-tema/page.tsx
let sandboxPage = fs.readFileSync('src/app/sandbox-tema/page.tsx', 'utf8');
sandboxPage = sandboxPage.replace(
  'type: "Khitan" | "Birthday" | "Aqiqah";',
  'type: "Khitan" | "Birthday" | "Aqiqah" | "Wedding";'
);

if (!sandboxPage.includes('id: "wedding-1"')) {
  const newSandboxEntry = `  {
    id: "wedding-1",
    title: "Bintarti Wedding 1 (Jessica Modern Landing Page)",
    type: "Wedding",
    accentColor: "#C5A059",
    bgColor: "bg-slate-900",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    description: "Tema pernikahan mewah dan minimalis berkonsep landing page modern terinspirasi dari Jessica Bevitation. Menampilkan pengantin (Yoshua & Jessica), kutipan Ar-Rum 21, timeline Our Story, detail akad & resepsi, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-1"
  },\n`;
  sandboxPage = sandboxPage.replace('const sandboxThemes: SandboxTheme[] = [\n', 'const sandboxThemes: SandboxTheme[] = [\n' + newSandboxEntry);
  fs.writeFileSync('src/app/sandbox-tema/page.tsx', sandboxPage);
  console.log('Successfully added wedding-1 to sandbox-tema/page.tsx');
}
