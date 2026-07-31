const fs = require('fs');

let content = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');

// 1. Cover bgPhotos
content = content.replace(
  /className="absolute inset-0 bg-cover bg-center contrast-\[1\.02\] brightness-\[0\.88\]"\s*style={{ backgroundImage: `url\('\/wedding4-hero\.jpg'\)` }}/g,
  `className="absolute inset-0 bg-cover bg-center contrast-[1.02] brightness-[0.88]"\n              style={{ backgroundImage: \\\`url(\\\${bgPhotos[0]})\\\` }}`
);

// 2. Main background
content = content.replace(
  /className="absolute inset-0 bg-cover bg-center brightness-\[0\.95\]"\s*style={{ backgroundImage: `url\('\/wedding4-hero\.jpg'\)` }}/g,
  `className="absolute inset-0 bg-cover bg-center brightness-[0.95]"\n              style={{ backgroundImage: \\\`url(\\\${bgPhotos[0]})\\\` }}`
);

// 3. Polaroid Frame Image
content = content.replace(
  /<Image\s*src="\/wedding4-hero\.jpg"\s*alt="Dimas & Annisa"\s*fill\s*className="object-cover"\s*\/>/g,
  `<Image \n                    src={bgPhotos[0]}\n                    alt={\`\${groomName} & \${brideName}\`}\n                    fill\n                    className="object-cover"\n                  />`
);

// 4. Polaroid Frame Name
content = content.replace(
  /<h2 className="text-3xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase">\s*Dimas &amp; Annisa\s*<\/h2>/g,
  `<h2 className="text-3xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase">\n                  {groomName} <span className="font-serif italic font-normal text-slate-400">&amp;</span> {brideName}\n                </h2>`
);


// 5. Groom and Bride Names globally
content = content.replace(/Dimas Anggara, S\.Kom\./g, '{groomFullName}');
content = content.replace(/Annisa Rahma, S\.E\./g, '{brideFullName}');
content = content.replace(/Dimas &amp; Annisa/g, '{groomName} &amp; {brideName}');
content = content.replace(/Dimas & Annisa/g, '{groomName} & {brideName}');
content = content.replace(/Dimas Anggara/g, '{groomFullName}');
content = content.replace(/Annisa Rahma/g, '{brideFullName}');


// 6. Map Links
content = content.replace(
  /href="https:\/\/maps\.google\.com\/\?q=Masjid\+Ramlie\+Musofa"/g,
  'href={akadMap}'
);
content = content.replace(
  /href="https:\/\/maps\.google\.com\/\?q=Park\+Hyatt\+Jakarta"/g,
  'href={resepsiMap}'
);

fs.writeFileSync('src/components/wedding/Wedding4View.tsx', content);
console.log('Final patch applied');
