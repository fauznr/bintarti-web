  // ─── DYNAMIC DATA: Baca dari invitationData.notes (JSON Wedding) atau fallback ───
  const weddingNotes = (() => {
    try {
      if (invitationData?.notes) {
        const parsed = JSON.parse(invitationData.notes as string);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch {}
    return null;
  })();

  const coupleNames    = invitationData?.full_name       || "Fathir & Zahra";
  const nameParts      = coupleNames.split("&").map((s: string) => s.trim());
  const groomFullName  = weddingNotes?.groomName         || nameParts[0] || "Fathir Alfarisi, S.T.";
  const groomNickname  = weddingNotes?.groomNickname     || nameParts[0]?.split(" ")[0] || "Fathir";
  const groomParents   = weddingNotes?.groomParents      || "Bapak H. Syamsudin & Ibu Hj. Maimunah";
  const groomInstagram = weddingNotes?.groomInstagram;
  const groomPhoto     = weddingNotes?.groomPhotoUrl     || invitationData?.groom_photo_url || invitationData?.child_photo_url || "/wedding-moody-bg2.jpg";
  const brideFullName  = weddingNotes?.brideName         || nameParts[1] || "Zahra Aurelia, S.Ked.";
  const brideNickname  = weddingNotes?.brideNickname     || nameParts[1]?.split(" ")[0] || "Zahra";
  const brideParents   = weddingNotes?.brideParents      || "Bapak Ir. H. Gunawan & Ibu Hj. Rosalina";
  const brideInstagram = weddingNotes?.brideInstagram;
  const bridePhoto     = weddingNotes?.bridePhotoUrl     || invitationData?.bride_photo_url || "/wedding-moody-bg3.jpg";
  const lockscreenNames= `${groomNickname} & ${brideNickname}`;
  const isPro          = !!invitationData?.is_pro || !!weddingNotes?.isPro;
  const youtubeVideo   = weddingNotes?.youtubeVideo || null;

  const akadDate       = weddingNotes?.akadDate          || invitationData?.event_date    || "2026-10-25";
  const akadTime       = weddingNotes?.akadTime          || invitationData?.event_time    || "10:00 WIB - Selesai";
  const akadLocation   = weddingNotes?.akadLocation      || invitationData?.event_location || "Gedung Serbaguna Bandung";
  const resepsiDate    = weddingNotes?.resepsiDate       || invitationData?.event_date    || "2026-10-25";
  const resepsiTime    = weddingNotes?.resepsiTime       || invitationData?.event_time    || "11:30 WIB - Selesai";
  const resepsiLocation= weddingNotes?.resepsiLocation   || invitationData?.event_location || "Gedung Serbaguna Bandung";
  const mapsLink       = invitationData?.maps_link       || "https://maps.google.com";
  const akadGmapsLink  = weddingNotes?.akadGmaps         || mapsLink;
  const resepsiGmapsLink= weddingNotes?.resepsiGmaps      || mapsLink;
  const isDemo         = !invitationData || Object.keys(invitationData).length === 0;
  const videoLink      = isDemo ? "https://www.youtube.com/embed/5qap5aO4i9A?rel=0" : (invitationData?.video_link || "");

  // Format event date for display (e.g. "Sabtu, 25 Oktober 2026")
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch { return dateStr; }
  };
  const akadDateDisplay    = formatEventDate(akadDate);
  const resepsiDateDisplay = formatEventDate(resepsiDate);

  // Bank accounts — prioritize notes.bankAccounts, then bank_account JSON column
  const bankAccounts: Array<{ bankName: string; accountNumber: string; recipientName: string }> = (() => {
    try {
      if (weddingNotes?.bankAccounts && Array.isArray(weddingNotes.bankAccounts) && weddingNotes.bankAccounts.length > 0)
        return weddingNotes.bankAccounts;
      if (invitationData?.bank_account) {
        const parsed = JSON.parse(invitationData.bank_account as string);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { bankName: "BANK BCA", accountNumber: "1234567890", recipientName: groomNickname },
      { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: brideNickname }
    ];
  })();

  // Our Story timeline — from notes.loveStory
  const loveStory: Array<{ year: string; title: string; desc: string }> = (() => {
    try {
      if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
        return weddingNotes.loveStory.map((s: any) => ({ year: s.year, title: s.title, desc: s.description || s.desc || "" }));
      }
    } catch {}
    return [
      { year: "2021", title: "Awal Bertemu", desc: "Pertama kali kami dipertemukan dan mulai saling mengenal satu sama lain." },
      { year: "2023", title: "Menjalin Hubungan", desc: "Setelah komunikasi yang intens, kami memutuskan untuk berkomitmen bersama." },
      { year: "2025", title: "Momen Lamaran", desc: "Dengan restu kedua orang tua, kami mengikat janji dalam prosesi lamaran." },
      { year: "2026", title: "Pernikahan Suci", desc: "Momen sakral saat kami mengikat janji suci pernikahan." }
    ];
  })();

  // Cover Photo (Foto A) - Hanya 1 foto untuk lockscreen
  const coverPhoto = invitationData?.child_photo_url || "/wedding-moody-bg1.jpg";