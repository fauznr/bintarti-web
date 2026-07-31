const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Lighten Cover background image brightness & overlay
content = content.replace(
  'brightness-[0.45]',
  'brightness-[0.85]'
);
content = content.replace(
  'from-black/80 via-black/40 to-black/90',
  'from-black/50 via-black/20 to-black/60'
);
content = content.replace(
  'from-black/80 via-black/50 to-black/95',
  'from-black/50 via-black/25 to-black/70'
);

// 2. Lighten Main Opened background image brightness & overlay
content = content.replace(
  'brightness-[0.35]',
  'brightness-[0.75]'
);
content = content.replace(
  'from-black/80 via-black/50 to-[#09090B]',
  'from-black/50 via-black/30 to-[#09090B]/90'
);

// 3. Make card background containers semi-transparent glassmorphism so the bright photo background shines through nicely
content = content.replaceAll('bg-zinc-900/90', 'bg-zinc-950/70 backdrop-blur-md');
content = content.replaceAll('bg-zinc-900/80', 'bg-zinc-950/65 backdrop-blur-md');

fs.writeFileSync(viewFile, content);
console.log('Successfully brightened background photos and softened overlays!');
