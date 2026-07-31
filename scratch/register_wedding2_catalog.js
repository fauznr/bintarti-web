const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const wedding2Theme = `  {
    id: "wedding-2",
    title: "Bintarti Wedding 2 (Adea Terracotta Botanical)",
    type: "Wedding",
    accentColor: "#C47B5A",
    bgColor: "bg-[#FAF7F2]",
    textColor: "text-[#2D2A26]",
    fontFamily: "font-serif",
    description: "Tema pernikahan estetik bernuansa terracotta botanical dan bingkai arch minimalis terinspirasi dari Adea Bevitation. Menampilkan font Cormorant Garamond & Great Vibes, timeline Our Story, detail akad & resepsi, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-2"
  },`;

content = content.replace(
  'const sandboxThemes: SandboxTheme[] = [',
  `const sandboxThemes: SandboxTheme[] = [\n${wedding2Theme}`
);

fs.writeFileSync(pageFile, content);
console.log('Successfully registered wedding-2 in sandbox catalog!');
