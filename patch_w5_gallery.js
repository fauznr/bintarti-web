const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// 1. Fix bgPhotos
const oldBgPhotos = `  const bgPhotos = (invitationData?.gallery_images && invitationData.gallery_images.length > 0)
    ? invitationData.gallery_images
    : [
        invitationData?.coverPhoto || "/wedding5-hero.jpg",
        "/wedding5-couple1.jpg",
        "/wedding5-couple2.jpg",
        "/wedding5-couple3.jpg"
      ];`;
const newBgPhotos = `  const bgPhotos = (invitationData?.gallery_images && invitationData.gallery_images.length > 0)
    ? invitationData.gallery_images
    : [
        weddingNotes?.heroPhotoUrl || "/wedding5-hero.jpg",
        weddingNotes?.groomPhotoUrl || "/wedding5-groom.jpg",
        weddingNotes?.bridePhotoUrl || "/wedding5-bride.jpg"
      ];`;
file = file.replace(oldBgPhotos, newBgPhotos);

// 2. Remove the second galleryImages declaration and use safeGalleryImages instead!
// Oh wait, safeGalleryImages was defined at line 105.
// Let's replace the second galleryImages array with nothing, and just make sure safeGalleryImages is used.
file = file.replace(
  /const galleryImages = \[\n\s*"\/wedding5-hero\.jpg",\n\s*"\/wedding5-couple1\.jpg",\n\s*"\/wedding5-groom\.jpg",\n\s*"\/wedding5-bride\.jpg",\n\s*"\/wedding5-couple2\.jpg",\n\s*"\/wedding5-couple3\.jpg"\n\s*\];/,
  ''
);

// We must also ensure safeGalleryImages has a default if empty!
// Wait, safeGalleryImages is defined like this:
// const safeGalleryImages = (invitationData?.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0) ? invitationData.gallery_images : [];
// In the gallery section, it maps over safeGalleryImages. If empty, the section is hidden because we did `(safeGalleryImages.length > 0 || youtubeVideo || videoLink) && (` previously.
// Let's verify the gallery section logic.
fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Fixed bgPhotos and removed duplicate galleryImages");
