const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf8');

// Replace the data extraction block
const oldExtraction = `  const groomName = invitationData?.nickname || invitationData?.groom_name || "Rizky";
  const groomFullName = invitationData?.full_name || "Rizky Febrian, S.T.";
  const groomParents = invitationData?.parents_name || "Bapak H. Sutrisno & Ibu Hj. Suhartini";
  
  const brideName = invitationData?.bride_nickname || invitationData?.bride_name || "Amanda";
  const brideFullName = invitationData?.bride_full_name || "Amanda Manopo, S.Ked.";
  const brideParents = invitationData?.bride_parents || "Bapak H. Burhanuddin & Ibu Hj. Kartini";

  const eventDateStr = invitationData?.event_date || "Sabtu, 17 Februari 2026";
  const eventTimeMatrimony = "08.00 - 10.00 WIB";
  const eventTimeReception = "11.00 - 14.00 WIB";
  const eventLocation = invitationData?.event_location || "Royal Tulip Hotel Ballroom, Bogor";
  const eventAddress = "Jl. Otto Iskandar Dinata No.3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung";
  const mapsLink = invitationData?.maps_link || "https://maps.app.goo.gl/9TKDRtj6jToyd2o46";`;

const newExtraction = `  // Parse weddingNotes
  let weddingNotes: any = {};
  try {
    if (invitationData?.notes) {
      weddingNotes = JSON.parse(invitationData.notes);
    }
  } catch (e) {
    console.error("Failed to parse wedding notes", e);
  }
  const isProParsed = !!invitationData?.is_pro || !!weddingNotes?.isPro;

  const groomName = weddingNotes.groomNickname || weddingNotes.groomName || invitationData?.nickname || invitationData?.groom_name || "Rizky";
  const groomFullName = weddingNotes.groomName || invitationData?.full_name || "Rizky Febrian, S.T.";
  const groomParents = weddingNotes.groomParents || invitationData?.parents_name || "Bapak H. Sutrisno & Ibu Hj. Suhartini";
  
  const brideName = weddingNotes.brideNickname || weddingNotes.brideName || invitationData?.bride_nickname || invitationData?.bride_name || "Amanda";
  const brideFullName = weddingNotes.brideName || invitationData?.bride_full_name || "Amanda Manopo, S.Ked.";
  const brideParents = weddingNotes.brideParents || invitationData?.bride_parents || "Bapak H. Burhanuddin & Ibu Hj. Kartini";

  const akadTitle = weddingNotes.akadTitle || "HOLY MATRIMONY";
  const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "Sabtu, 17 Februari 2026";
  const akadTimeStr = weddingNotes.akadTime || "08.00 - 10.00 WIB";
  const akadLocation = weddingNotes.akadLocation || invitationData?.event_location || "Royal Tulip Hotel Ballroom, Bogor";
  const akadGmaps = weddingNotes.akadGmaps || invitationData?.maps_link || "https://maps.app.goo.gl/9TKDRtj6jToyd2o46";

  const resepsiTitle = weddingNotes.resepsiTitle || "RECEPTION";
  const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;
  const resepsiTimeStr = weddingNotes.resepsiTime || "11.00 - 14.00 WIB";
  const resepsiLocation = weddingNotes.resepsiLocation || akadLocation;
  const resepsiGmaps = weddingNotes.resepsiGmaps || akadGmaps;
  
  const fallbackHero = invitationData?.child_photo_url || "/indo_prewed_simple_1_1785092558852.jpg";
  const quoteBgUrl = weddingNotes.quoteBgUrl || fallbackHero;
  const loveStoryBgUrl = weddingNotes.loveStoryBgUrl || fallbackHero;
  const eventBgUrl = weddingNotes.eventBgUrl || fallbackHero;
  const dresscodeBgUrl = weddingNotes.dresscodeBgUrl || fallbackHero;
  const ourMomentBgUrl = weddingNotes.ourMomentBgUrl || fallbackHero;
  const giftBgUrl = weddingNotes.giftBgUrl || fallbackHero;
  const rsvpBgUrl = weddingNotes.rsvpBgUrl || fallbackHero;
  const qrBgUrl = weddingNotes.qrBgUrl || fallbackHero;
  const closingPhotoUrl = weddingNotes.closingPhotoUrl || fallbackHero;
  
  const groomPhotoUrl = weddingNotes.groomPhotoUrl || "/indo_prewed_groom_1_1785092582755.jpg";
  const bridePhotoUrl = weddingNotes.bridePhotoUrl || "/indo_prewed_bride_1_1785092571671.jpg";
  
  const youtubeVideo = weddingNotes.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";
  const youtubeEmbedId = youtubeVideo.includes('v=') ? youtubeVideo.split('v=')[1]?.split('&')[0] : (youtubeVideo.split('/').pop() || 'u_FvAolXhI0');

  const loveStoryList = (weddingNotes.loveStoryList && weddingNotes.loveStoryList.length > 0) ? weddingNotes.loveStoryList : [
    { year: "2018", title: "Awal Berjumpa", description: "Kami bertemu pertama kali di acara kampus. Sebuah sapaan sederhana yang mengawali segalanya." },
    { year: "2020", title: "Menjalin Kasih", description: "Setelah lulus, kami memutuskan untuk menjalin hubungan dan saling mendukung karir masing-masing." },
    { year: "2023", title: "Momen Lamaran", description: "Di bawah rintik hujan kota Bandung, ia melamar saya. Sebuah 'Ya' yang mengubah hidup kami." },
    { year: "2024", title: "Puncak Cinta", description: "Hari ini kami mengikat janji suci pernikahan untuk memulai lembaran baru sebagai suami istri." }
  ];

  const dresscodes = (weddingNotes.dresscodes && weddingNotes.dresscodes.length > 0) ? weddingNotes.dresscodes : [
    { name: "Black", hex: "#171717" },
    { name: "Charcoal", hex: "#737373" },
    { name: "Silver", hex: "#D4D4D4" },
    { name: "White", hex: "#FFFFFF" }
  ];`;

file = file.replace(oldExtraction, newExtraction);
file = file.replace('const isPro = !!invitationData?.is_pro;', ''); // Remove the duplicate isPro from earlier
file = file.replace('const isProParsed', 'const isPro = isProParsed'); 

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', file);
console.log('Patched data extraction in Wedding6View');
