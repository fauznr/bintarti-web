const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

file = file.replace(
  'src="https://www.youtube.com/embed/u_FvAolXhI0?rel=0&modestbranding=1"',
  'src={`https://www.youtube.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}'
);

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Patched YouTube embed in Wedding6View');
