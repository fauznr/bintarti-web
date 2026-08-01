const fs = require('fs');
['Wedding1View.tsx', 'Wedding2View.tsx', 'Wedding3View.tsx', 'Wedding5View.tsx'].forEach(file => {
  const path = 'src/components/wedding/' + file;
  let c = fs.readFileSync(path, 'utf8');
  let original = c;
  c = c.replace('const youtubeVideo   = weddingNotes?.youtubeVideo || null;', 'const youtubeVideo   = weddingNotes?.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";');
  c = c.replace('const youtubeVideo = weddingNotes?.youtubeVideo || null;', 'const youtubeVideo = weddingNotes?.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";');
  
  if (c !== original) {
    fs.writeFileSync(path, c);
    console.log('Updated ' + file);
  } else {
    console.log('No change in ' + file);
  }
});
