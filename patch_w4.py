import sys
import re

content = open('src/components/wedding/Wedding4View.tsx', 'r', encoding='utf-8').read()

top_injection = """
  const formatDateIndonesian = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch(e) {
      return dateStr;
    }
  };

  const weddingNotes = (() => {
    if (invitationData?.notes) {
      try {
        const parsed = JSON.parse(invitationData.notes as string);
        if (parsed && typeof parsed === "object") return parsed;
      } catch (e) {
        console.error("Failed to parse wedding notes", e);
      }
    }
    return null;
  })();

  const nameParts = (invitationData?.full_name || "").split("&").map((n: string) => n.trim());
  const groomFullName  = weddingNotes?.groomName         || nameParts[0] || "Dimas Anggara, S.Kom.";
  const groomName      = weddingNotes?.groomNickname     || nameParts[0]?.split(" ")[0] || "Dimas";
  const groomParents   = weddingNotes?.groomParents      || "Bapak H. Subagyo & Ibu Hj. Tri Murni";
  const groomPhoto     = weddingNotes?.groomPhotoUrl     || invitationData?.groom_photo_url || "/wedding4-groom.jpg";
  const groomIg        = weddingNotes?.groomIg           || "@dimas_anggara";
  
  const brideFullName  = weddingNotes?.brideName         || nameParts[1] || "Annisa Rahma, S.E.";
  const brideName      = weddingNotes?.brideNickname     || nameParts[1]?.split(" ")[0] || "Annisa";
  const brideParents   = weddingNotes?.brideParents      || "Bapak Dr. H. Faisal & Ibu Hj. Nuraini";
  const bridePhoto     = weddingNotes?.bridePhotoUrl     || invitationData?.bride_photo_url || "/wedding4-bride.jpg";
  const brideIg        = weddingNotes?.brideIg           || "@annisa_rahma";

  const isPro          = !!invitationData?.is_pro || !!weddingNotes?.isPro;
  const youtubeVideo   = weddingNotes?.youtubeVideo || null;
  
  const eventTypeLabel = weddingNotes?.akadLabel || (invitationData?.theme === "Wedding 4" ? "Akad Nikah" : "Pemberkatan");
  const akadDate       = formatDateIndonesian(weddingNotes?.akadDate || invitationData?.event_date || "2026-08-18");
  const akadTime       = weddingNotes?.akadTime          || invitationData?.event_time    || "08.00 WIB";
  const akadLocation   = weddingNotes?.akadLocation      || invitationData?.location      || "Masjid Ramlie Musofa";
  const akadAddress    = weddingNotes?.akadAddress       || "Jl. Danau Sunter Utara Raya Sel. No.12C, Sunter Agung, Tanjung Priok, Jakarta Utara";
  const akadMap        = weddingNotes?.akadMapUrl        || "https://goo.gl/maps/";

  const resepsiDate    = formatDateIndonesian(weddingNotes?.resepsiDate || invitationData?.event_date || "2026-08-18");
  const resepsiTime    = weddingNotes?.resepsiTime       || "11.00 WIB - 15.00 WIB";
  const resepsiLocation= weddingNotes?.resepsiLocation   || "Glass House Ballroom";
  const resepsiAddress = weddingNotes?.resepsiAddress    || "Park Hyatt Jakarta, Lantai 36, Jl. Kebon Sirih No.17-19, Jakarta Pusat";
  const resepsiMap     = weddingNotes?.resepsiMapUrl     || "https://goo.gl/maps/";
  
  const targetDateRaw  = weddingNotes?.akadDate || invitationData?.event_date || "2026-08-18";
  const targetDateObj  = new Date(targetDateRaw + "T08:00:00").getTime();

  const parseGDriveUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('drive.google.com') && url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
        return `/api/proxy-audio?id=${match[1]}`;
      }
    } else if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/file\\/d\\/([^/]+)/);
      if (match && match[1]) {
        return `/api/proxy-audio?id=${match[1]}`;
      }
    }
    return url;
  };
"""

# 1. Inject variables right after const [showQrModal, setShowQrModal] = useState(false);
content = content.replace('  const [showQrModal, setShowQrModal] = useState(false);', '  const [showQrModal, setShowQrModal] = useState(false);\n' + top_injection)

# 2. Replace comments dummy data
comments_orig = """  const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at: string }>>([
    {
      name: "Keanu & Anya ⚡",
      attendance: "Hadir (2 Orang)",
      message: "Congratsss Dimas & Annisa! Visual berdua ga main-main, vibe gen-z terkece emang. Bahagia selamanya yaww! ✨❤️",
      created_at: "Baru saja"
    },
    {
      name: "Devon Mahendra",
      attendance: "Hadir (1 Orang)",
      message: "Happy Wedding Bro Dimas & Annisa! Lancar jaya acaranya, ditunggu nongkrong bareng abis honeymoon ☕🔥",
      created_at: "30 menit lalu"
    },
    {
      name: "Siska & Gank Bestie 💖",
      attendance: "Hadir (3 Orang)",
      message: "Cakep banget foto prewed-nya super santai estetik! Can't wait to see you guys in white! Lovesss 🕊️✨",
      created_at: "2 jam yang lalu"
    }
  ]);"""
content = content.replace(comments_orig, '  const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at: string }>>([]);')

# 3. Replace background Photos fallback
bgphotos_orig = """        invitationData?.coverPhoto || "/wedding4-hero.jpg",
        "/wedding4-couple1.jpg",
        "/wedding4-couple2.jpg",
        "/wedding4-couple3.jpg"
      ];"""
bgphotos_new = """        weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg",
        "/wedding4-couple1.jpg",
        "/wedding4-couple2.jpg"
      ];
      
  // For standard Bintarti Gallery mapping
  const galleryImages = Array.isArray(invitationData?.gallery_images) && invitationData.gallery_images.length > 0 
    ? invitationData.gallery_images 
    : bgPhotos;
"""
content = content.replace(bgphotos_orig, bgphotos_new)

# 4. Replace hardcoded targetDate
content = content.replace('const targetDate = new Date("2026-08-18T09:00:00").getTime();', 'const targetDate = targetDateObj;')

open('src/components/wedding/Wedding4View.tsx', 'w', encoding='utf-8').write(content)
print('Phase 1 done')
