const fs = require('fs');

const pathW7 = 'src/components/wedding/Wedding7View.tsx';
let w7 = fs.readFileSync(pathW7, 'utf-8');

// 1. Add weddingNotes
if (!w7.includes('const weddingNotes =')) {
  w7 = w7.replace(
    'const audioRef = useRef<HTMLAudioElement | null>(null);',
    'const audioRef = useRef<HTMLAudioElement | null>(null);\n\n  const weddingNotes = invitationData?.wedding_notes ? JSON.parse(invitationData.wedding_notes) : {};\n  const fallbackHero = "/indo_prewed_simple_1_1785092558852.jpg";\n  const fallbackGroom = "/indo_prewed_groom_1_1785092582755.jpg";\n  const fallbackBride = "/indo_prewed_bride_1_1785092571671.jpg";'
  );
}

// 2. Replace hardcoded images
w7 = w7.replace(/src="\/indo_prewed_simple_1_1785092558852\.jpg"/g, 'src={weddingNotes.photoHero || fallbackHero}');
w7 = w7.replace(/src="\/indo_prewed_groom_1_1785092582755\.jpg"/g, 'src={weddingNotes.photoGroom || weddingNotes.photoHero || fallbackGroom}');
w7 = w7.replace(/src="\/indo_prewed_bride_1_1785092571671\.jpg"/g, 'src={weddingNotes.photoBride || weddingNotes.photoHero || fallbackBride}');

// 3. Replace galleryPhotos
const galleryRegex = /const galleryPhotos = \[\s*".*?",\s*".*?",\s*".*?",\s*".*?",\s*".*?",\s*".*?"\s*\];/;
const galleryDyn = `const galleryPhotos = invitationData?.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0
    ? invitationData.gallery_images.map((g: any) => g.image_url)
    : [
        "/indo_prewed_simple_1_1785092558852.jpg",
        "/indo_prewed_couple_2_1785092595152.jpg",
        "/indo_prewed_events_1_1785093412537.jpg",
        "/indo_prewed_bride_1_1785092571671.jpg",
        "/indo_prewed_groom_1_1785092582755.jpg",
        "/indo_prewed_closing_1_1785093445446.jpg"
      ];`;
w7 = w7.replace(galleryRegex, galleryDyn);

// 4. Replace storyList
const storyRegex = /const storyList = \[\s*\{[\s\S]*?\}\s*\];/;
const storyDyn = `const loveStory = (() => {
    if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
      return weddingNotes.loveStory.map((s: any) => ({
        date: s.year,
        title: s.title,
        desc: s.description || s.desc || ""
      }));
    }
    return [
      {
        title: "Pertama Bertemu",
        date: "15 Juni 2021",
        desc: "Pertemuan pertama kami yang tidak disengaja di sebuah acara kampus."
      }
    ];
  })();`;
w7 = w7.replace(storyRegex, storyDyn);
w7 = w7.replace(/\{storyList\.map/g, '{loveStory.map');

fs.writeFileSync(pathW7, w7);
console.log('Patched Wedding7View.tsx data extraction');
