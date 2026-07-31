const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Update bgPhotos array in Wedding1View.tsx
const oldBgPhotos = `  // Background Photos Slideshow List (Local high-speed B&W images)
  const bgPhotos = [
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg2.jpg",
    "/wedding-bw-bg3.jpg",
    "/wedding-bw-bg4.jpg",
    "/wedding-bw-bg5.jpg"
  ];`;

const newBgPhotos = `  // Background Photos Slideshow List (Cinematic Moody Warm Film Images)
  const bgPhotos = [
    "/wedding-moody-bg1.jpg",
    "/wedding-moody-bg2.jpg",
    "/wedding-moody-bg3.jpg",
    "/wedding-moody-bg4.jpg"
  ];`;

content = content.replace(oldBgPhotos, newBgPhotos);

// 2. Update galleryImages array in Wedding1View.tsx
const oldGalleryImages = `  // High quality monochrome Indonesian couple gallery images
  const galleryImages = [
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg2.jpg",
    "/wedding-bw-bg3.jpg",
    "/wedding-bw-bg4.jpg",
    "/wedding-bw-bg5.jpg",
    "/wedding-bw-hero.jpg"
  ];`;

const newGalleryImages = `  // High quality Cinematic Moody gallery images with warm subtle colors
  const galleryImages = [
    "/wedding-moody-bg1.jpg",
    "/wedding-moody-bg2.jpg",
    "/wedding-moody-bg3.jpg",
    "/wedding-moody-bg4.jpg",
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg4.jpg"
  ];`;

content = content.replace(oldGalleryImages, newGalleryImages);

// 3. Replace Groom and Bride photo paths
content = content.replace('src="/wedding-bw-groom.jpg"', 'src="/wedding-moody-bg2.jpg"');
content = content.replace('src="/wedding-bw-bride.jpg"', 'src="/wedding-moody-bg3.jpg"');

// 4. Replace base fallback background photo path
content = content.replaceAll("'/wedding-bw-bg1.jpg'", "'/wedding-moody-bg1.jpg'");

// 5. Replace strict grayscale filters with subtle warm cinematic filter (saturate-[0.9] contrast-[1.05])
content = content.replaceAll('grayscale contrast-125', 'saturate-[0.9] contrast-[1.05]');

// 6. Update theme background color to Warm Dark Charcoal/Bronze
content = content.replaceAll('bg-[#09090B]', 'bg-[#0D0B0A]');
content = content.replaceAll('to-[#09090B]', 'to-[#0D0B0A]');

fs.writeFileSync(viewFile, content);
console.log('Successfully updated Wedding1View.tsx to Cinematic Moody aesthetic with subtle warm colors!');
