const fs = require('fs');
const file = 'src/components/wedding/Wedding7View.tsx';
let c = fs.readFileSync(file, 'utf8');

// Fix 1: Gallery
c = c.replace(
  'invitationData.gallery_images.map((g: any) => g.image_url)',
  'invitationData.gallery_images.map((g: any) => typeof g === "string" ? g : (g.image_url || g))'
);

// Fix 2: Bank Account Holder
c = c.replace(
  'a.n. {bank.accountHolder || bank.bankName}',
  'a.n. {bank.recipientName || bank.accountName || bank.accountHolder || bank.bankName}'
);

// Fix 3: Cover & Hero photos
const fallbackIndex = c.indexOf('const fallbackHero');
const coverDefs = `
  const coverPhotoUrl = invitationData?.child_photo_url || invitationData?.childPhotoUrl || weddingNotes?.heroPhotoUrl || weddingNotes?.photoHero || "/indo_prewed_simple_1_1785092558852.jpg";
  const heroPhotoUrl = weddingNotes?.heroPhotoUrl || weddingNotes?.photoHero || coverPhotoUrl || "/indo_prewed_simple_1_1785092558852.jpg";
`;
if (!c.includes('const coverPhotoUrl =')) {
  c = c.slice(0, fallbackIndex) + coverDefs + c.slice(fallbackIndex);
}

// Replace photo sources
c = c.replace('src={weddingNotes.photoHero || weddingNotes.heroPhotoUrl || fallbackHero}', 'src={coverPhotoUrl}');
c = c.replace('src={weddingNotes.photoHero || weddingNotes.heroPhotoUrl || fallbackHero}', 'src={heroPhotoUrl}');

// Also fix groom and bride fallbacks
c = c.replace('src={weddingNotes.photoGroom || weddingNotes.groomPhotoUrl || weddingNotes.photoHero || weddingNotes.heroPhotoUrl || fallbackGroom}', 'src={weddingNotes.photoGroom || weddingNotes.groomPhotoUrl || heroPhotoUrl || fallbackGroom}');
c = c.replace('src={weddingNotes.photoBride || weddingNotes.bridePhotoUrl || weddingNotes.photoHero || weddingNotes.heroPhotoUrl || fallbackBride}', 'src={weddingNotes.photoBride || weddingNotes.bridePhotoUrl || heroPhotoUrl || fallbackBride}');

fs.writeFileSync(file, c);
console.log('Fixed photo, bank, gallery fallbacks');
