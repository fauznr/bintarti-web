const fs = require('fs');
let c = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

c = c.replace(/Reza &amp; Dania/g, '{lockscreenNames}');
c = c.replace(/alt="Reza & Dania"/g, 'alt={lockscreenNames}');
c = c.replace(/alt="Reza Mahendra"/g, 'alt={groomFullName}');
c = c.replace(/alt="Dania Putri"/g, 'alt={brideFullName}');
c = c.replace(/Minggu, 24 Agustus 2026/g, '{akadDateDisplay}');

// Fix Gallery Images mapping to use bgPhotos
const galleryTarget = `  const galleryImages = [
    "/wedding2-bg1.jpg",
    "/wedding2-bg2.jpg",
    "/wedding2-bg3.jpg",
    "/wedding2-bg4.jpg",
    "/wedding-moody-bg1.jpg",
    "/wedding-moody-bg4.jpg"
  ];`;
c = c.replace(galleryTarget, '  const galleryImages = bgPhotos;');

// Add storyPhoto variable inside the component
const storyTarget = `  // Our Story timeline — from notes.loveStory`;
c = c.replace(storyTarget, `  const storyPhoto = weddingNotes?.storyPhotoUrl || invitationData?.child_photo_url || "/wedding2-couple4.jpg";\n  // Our Story timeline — from notes.loveStory`);

// Use storyPhoto in Our Story image
const imgTarget = `src="/wedding2-couple4.jpg"`;
c = c.replace(imgTarget, `src={storyPhoto}`);

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', c);
console.log('Replacements done!');
