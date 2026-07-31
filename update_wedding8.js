const fs = require('fs');
const path = 'src/components/wedding/Wedding8View.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace variables block
const dataStart = content.indexOf('// ── Data ──');
const audioStart = content.indexOf('// ── Audio ──');

const newDataBlock = `// ── Data ──
  const weddingNotes = (() => {
    try {
      if (invitationData?.notes) {
        const parsed = typeof invitationData.notes === "string" ? JSON.parse(invitationData.notes) : invitationData.notes;
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch {}
    return null;
  })();

  const data = invitationData || {};
  const coupleNames = invitationData?.full_name || "Raka & Sinta";
  const nameParts = coupleNames.split("&").map((s) => s.trim());
  const groom = weddingNotes?.groomName || data.groomName || nameParts[0] || "Raka Ananda";
  const bride = weddingNotes?.brideName || data.brideName || nameParts[1] || "Sinta Maharani";
  const groomShort = weddingNotes?.groomNickname || groom.split(" ")[0];
  const brideShort = weddingNotes?.brideNickname || bride.split(" ")[0];
  
  const akadDate = weddingNotes?.akadDate || data.akadDate || "2025-09-20";
  const akadTime = weddingNotes?.akadTime || data.akadTime || "08.00 WIB";
  const akadVenue = weddingNotes?.akadLocation || data.akadVenue || "Masjid Al-Ikhlas, Jakarta Selatan";
  
  const resepsiDate = weddingNotes?.resepsiDate || data.resepsiDate || "2025-09-20";
  const resepsiTime = weddingNotes?.resepsiTime || data.resepsiTime || "11.00 – 14.00 WIB";
  const resepsiVenue = weddingNotes?.resepsiLocation || data.resepsiVenue || "Gedung Sasana Budaya, Jakarta";
  
  const musicUrl = data.musicUrl || data.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3";

  const guest = guestName ? safeDecodeGuestName(guestName) : "";

  const coverPhotoUrl = weddingNotes?.heroPhotoUrl || data.coverPhoto || "/wedding8-couple-casual.jpg";
  const groomPhotoUrl = weddingNotes?.groomPhotoUrl || "/wedding8-groom-casual.jpg";
  const bridePhotoUrl = weddingNotes?.bridePhotoUrl || "/wedding8-bride-casual.jpg";

  const galleryPhotos = (() => {
    const imgs = invitationData?.gallery_images || data.galleryPhotos;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs;
    if (typeof imgs === "string" && imgs.length > 0) {
      try {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
      return imgs.split(",").filter(s => s.trim() !== "");
    }
    return [
      coverPhotoUrl,
      groomPhotoUrl,
      bridePhotoUrl
    ];
  })();

  const loveStory = (() => {
    try {
      if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
        return weddingNotes.loveStory.map((s) => ({
          year: s.year || "",
          title: s.title || "",
          desc: s.description || s.desc || ""
        }));
      }
    } catch {}
    return [
      {
        year: "2018",
        title: "Pertama Bertemu",
        desc: "Takdir mempertemukan kami di sebuah acara yang tak terduga. Senyum pertamamu tak pernah terlupakan.",
      },
      {
        year: "2020",
        title: "Mulai Bersama",
        desc: "Dengan memberanikan diri, kami memulai perjalanan baru. Setiap langkah terasa lebih ringan berdua.",
      },
      {
        year: "2023",
        title: "Lamaran",
        desc: "Di bawah langit sore yang jingga, sebuah janji diucapkan. Sebuah 'iya' yang mengubah segalanya.",
      },
      {
        year: "2025",
        title: "Hari Bahagia",
        desc: "Hari yang dinantikan. Bersama, kami melangkah menuju babak baru kehidupan yang penuh berkah.",
      },
    ];
  })();

  `;

content = content.substring(0, dataStart) + newDataBlock + content.substring(audioStart);

// 2. Replace hardcoded images
content = content.replace(/src="\/wedding8-couple-casual\.jpg"/g, 'src={coverPhotoUrl}');
content = content.replace(/src="\/wedding8-groom-casual\.jpg"/g, 'src={groomPhotoUrl}');
content = content.replace(/src="\/wedding8-bride-casual\.jpg"/g, 'src={bridePhotoUrl}');

// 3. Replace loveStory map
const loveStoryRegex = /\{\[\s*\{\s*year:\s*"2018"[\s\S]*?\]\.map\(\(item, i\) => \(/;
if (loveStoryRegex.test(content)) {
  content = content.replace(loveStoryRegex, '{loveStory.map((item, i) => (');
} else {
  console.log("Failed to find love story block!");
}

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete');
