"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Music, 
  Disc,
  Pause, 
  Copy, 
  Check, 
  Video, 
  Gift, 
  Send, 
  ChevronDown,
  QrCode,
  Scan,
  X
} from "lucide-react";

// Multi-variant ScrollReveal for Wedding 2
// Variants: fade-up | flip-up | slide-left | slide-right | zoom-pop | drop
function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up"
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: "fade-up" | "flip-up" | "slide-left" | "slide-right" | "zoom-pop" | "drop";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const hiddenStyle: React.CSSProperties = {
    "fade-up":    { opacity: 0, transform: "translateY(24px)" },
    "flip-up":    { opacity: 0, transform: "perspective(600px) rotateX(15deg) translateY(18px)", transformOrigin: "top" },
    "slide-left": { opacity: 0, transform: "translateX(-24px)" },
    "slide-right":{ opacity: 0, transform: "translateX(24px)" },
    "zoom-pop":   { opacity: 0, transform: "scale(0.9)" },
    "drop":       { opacity: 0, transform: "translateY(-24px)" },
  }[variant || "fade-up"];

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "0.7s",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: `${delay}ms`,
        ...(isVisible ? { opacity: 1, transform: "none" } : hiddenStyle),
      }}
    >
      {children}
    </div>
  );
}

interface Wedding2ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

export default function Wedding2View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-2"
}: Wedding2ViewProps) {
  const [isOpened, setIsOpened] = useState(false);

  const parseGDriveUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('drive.google.com') && url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
        return `/api/proxy-audio?id=${match[1]}`;
      }
    } else if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/file\/d\/([^/]+)/);
      if (match && match[1]) {
        return `/api/proxy-audio?id=${match[1]}`;
      }
    }
    return url;
  };
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const storyPhoto = weddingNotes?.storyPhotoUrl || invitationData?.child_photo_url || "/wedding2-couple4.jpg";
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
  // Hero Photo (Foto B) - Background Hero Utama
  const heroPhoto = weddingNotes?.heroPhotoUrl || coverPhoto;

  // Background Photos Slideshow (reads from gallery_images Supabase field)
  const bgPhotos = (() => {
    const imgs = invitationData?.gallery_images;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs;
    if (typeof imgs === "string" && imgs.length > 0) return [imgs];
    return [
      "/wedding-moody-bg1.jpg",
      "/wedding-moody-bg2.jpg",
      "/wedding-moody-bg3.jpg",
      "/wedding-moody-bg4.jpg"
    ];
  })();

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const dateStr = akadDate || "2026-10-25";
    const safeDateStr = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const targetDate = new Date(safeDateStr + "T10:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [akadDate]);

  // Handle Cover Open
  const handleOpenInvitation = () => {
    setIsClosingCover(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsClosingCover(false);
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
    }, 600);
  };

  // Toggle Audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  // RSVP Form & Wishes Feed State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [rsvpStatus, setRsvpAttendance] = useState("Hadir");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [comments, setComments] = useState<any[]>(() => {
    if (invitationData && invitationData.id && !invitationData.id.startsWith("wedding-")) {
      return [];
    }
    return [
      {
        id: 1,
        name: "Tante Rina & Om Hermawan",
        attendance: "Hadir",
        message: `Selamat atas pernikahan ${lockscreenNames}! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.`,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 2,
        name: "Dimas Anggara",
        attendance: "Hadir",
        message: `Selamat brader! Semoga lancar acaranya dan bahagia selalu! 🥂`,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ];
  });

  useEffect(() => {
    fetch("/api/comments?invitationId=" + themeId)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setComments(data);
        }
      })
      .catch(() => {});
  }, [themeId]);

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) return;

    setIsSubmitting(true);
    const newComment = {
      id: Date.now(),
      name: rsvpName,
      rsvp_status: rsvpStatus,
      comment: rsvpMessage,
      created_at: new Date().toISOString()
    };

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: themeId,
          name: rsvpName,
          rsvpStatus: rsvpStatus,
          comment: rsvpMessage
        })
      });
      setComments([newComment, ...comments]);
      setRsvpName("");
      setRsvpMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch {
      setComments([newComment, ...comments]);
      setRsvpName("");
      setRsvpMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy Bank Account Clipboard Toast Function
  const copyToClipboard = (text: string, bankId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 3000);
  };

  const galleryImages = bgPhotos;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2E2B2A] relative overflow-x-hidden selection:bg-[#B88E52]/20 selection:text-[#B88E52]">
      {/* Google Fonts Links matching Bevitation Adea Theme (Montserrat + Forum + Lora) */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Forum&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet" 
      />

      {/* Dynamic Font Styling Utility */}
      <style jsx global>{`
        .font-adea-forum {
          font-family: 'Forum', serif;
        }
        .font-adea-lora {
          font-family: 'Lora', serif;
        }
        .font-adea-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        src={parseGDriveUrl(invitationData?.music || invitationData?.music_url) || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"} 
      />

      {/* ─────────────────────────────────────────────────────────────────
          COVER / LOCK SCREEN OVERLAY (BEVITATION ADEA MINIMALIST CANVAS)
          ───────────────────────────────────────────────────────────────── */}
      {(!isOpened || isClosingCover) && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#FAF7F2] text-center select-none overflow-hidden font-adea-montserrat transition-all duration-700 ease-in-out ${
          isClosingCover ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
        }`}>
          {/* Subtle Clean Floral Border Line */}
          <div className="absolute inset-4 border border-[#E5DBCF] rounded-[32px] pointer-events-none" />

          {/* Minimalist Cover Content */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-6 w-full mx-auto">
            <span className="text-[11px] font-adea-montserrat tracking-[0.35em] text-[#8C827A] uppercase font-medium">
              THE WEDDING OF
            </span>

            {/* Minimalist Arch Photo Frame */}
            <div className="relative w-44 h-64 rounded-t-[100px] rounded-b-2xl overflow-hidden border border-[#D9CDBC] shadow-md my-2">
              <Image 
                src={coverPhoto}
                alt={lockscreenNames}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-1">
              <h1 className="w-full text-center text-3xl sm:text-4xl font-adea-forum text-[#2E2B2A] tracking-wider uppercase font-semibold">
                {lockscreenNames}
              </h1>
              <p className="text-[11px] font-adea-montserrat tracking-[0.25em] text-[#8C827A] uppercase pt-1">
                {akadDateDisplay.toUpperCase()}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-[#E5DBCF] space-y-2">
              <span className="text-[10px] font-adea-montserrat font-medium text-[#8C827A] uppercase tracking-widest block text-center">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
              <div className="bg-[#FFF] py-2 px-5 rounded-xl border border-[#E5DBCF] shadow-sm inline-block max-w-[240px] text-center mx-auto">
                <span className="text-xs font-adea-montserrat font-semibold text-[#2E2B2A] block truncate">
                  {guestName}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="mt-2 px-8 py-3 rounded-full bg-[#3D3A37] text-white font-adea-montserrat font-medium text-xs tracking-widest shadow-md hover:bg-[#2E2B2A] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase cursor-pointer mx-auto"
            >
              <Heart className="w-3.5 h-3.5 fill-white" /> Buka Undangan
            </button>
          </div>

          <div className="relative z-10 pb-2 text-[9px] font-adea-montserrat text-[#A0958C] tracking-wider text-center uppercase">
            bevitation.com / bintarti.store
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN MINIMALIST LANDING CONTENT (ULTRA CLEAN ADEA STYLE)
          ───────────────────────────────────────────────────────────────── */}
      {(isOpened || isClosingCover) && (
        <div className="w-full max-w-[430px] mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative border-x border-[#E5DBCF] pb-24 overflow-hidden font-adea-montserrat">
          
          {/* Persistent Background Photo Layer for Translucent Sections */}
          <div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 saturate-[0.95]"
              style={{ backgroundImage: `url(${coverPhoto})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          </div>

          {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            {isPro && (
              <button
                onClick={() => setShowQrModal(true)}
                className="w-12 h-12 rounded-full bg-[#3D3A37] text-white border border-[#5C5651] shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                aria-label="QR Code Presensi"
                title="QR Code Presensi Tamu"
              >
                <QrCode className="w-5 h-5 text-white group-hover:text-amber-200 transition-colors" />
              </button>
            )}

            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-[#3D3A37]/90 text-white border border-[#D9CDBC]/40 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-5 h-5 text-zinc-300 animate-bounce" />
              )}
            </button>
          </div>

          {/* 1. HERO SECTION (FULL-SCREEN BACKGROUND PHOTO) */}
          <section className="w-full min-h-[95dvh] flex flex-col items-center justify-center text-center p-6 relative z-10 overflow-hidden">
            {/* Full-Screen Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${heroPhoto})` }}
            />
            {/* Dark Vignette Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-6 my-auto max-w-sm mx-auto px-4">
              <span className="text-[11px] font-adea-montserrat tracking-[0.4em] text-zinc-200 uppercase font-semibold drop-shadow-md">
                THE WEDDING OF
              </span>

              <h1 className="w-full text-center text-4xl sm:text-5xl font-adea-forum text-white tracking-widest uppercase font-bold drop-shadow-lg leading-tight">
                {lockscreenNames}
              </h1>

              <p className="text-[11px] font-adea-montserrat tracking-[0.3em] text-zinc-200 uppercase font-medium drop-shadow-md">
                {akadDateDisplay.toUpperCase()}
              </p>

              <div className="w-full flex justify-center pt-8">
                <ChevronDown className="w-6 h-6 text-white animate-bounce opacity-80 filter drop-shadow" />
              </div>
            </div>
          </section>

          {/* 2. GROOM & BRIDE SECTION */}
          <section className="px-6 py-12 space-y-10 text-center border-t border-[#E5DBCF] bg-[#FAF7F2] relative z-10">
            <ScrollReveal variant="drop">
              <div className="space-y-3">
                <h2 className="text-3xl font-adea-forum text-[#2E2B2A] uppercase tracking-widest">Groom &amp; Bride</h2>
                <p className="text-xs font-adea-lora text-[#6B635B] italic leading-relaxed max-w-xs mx-auto">
                  Dengan segala puji bagi Allah yang telah menciptakan makhluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkaikan cinta yang Engkau berikan dalam ikatan pernikahan.
                </p>
              </div>
            </ScrollReveal>

            {/* Groom */}
            <ScrollReveal delay={150} variant="slide-left">
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-48 h-64 rounded-t-[100px] rounded-b-2xl overflow-hidden border border-[#D9CDBC] shadow-md">
                  <Image 
                    src={groomPhoto}
                    alt={groomFullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-adea-forum text-[#2E2B2A] font-semibold tracking-wider uppercase">{groomFullName}</h3>
                  <p className="text-xs font-adea-lora text-[#7A7269] italic">{groomParents}</p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-adea-montserrat font-medium text-[#2E2B2A] bg-[#FFF] px-3.5 py-1 rounded-full border border-[#D9CDBC] mt-2 hover:bg-[#2E2B2A] hover:text-white transition-all"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> {groomInstagram || "Instagram"}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Divider & */}
            <ScrollReveal delay={200} variant="zoom-pop">
              <div className="flex justify-center items-center">
                <span className="text-2xl font-adea-forum text-[#8C827A] italic">&amp;</span>
              </div>
            </ScrollReveal>

            {/* Bride */}
            <ScrollReveal delay={250} variant="slide-right">
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-48 h-64 rounded-t-[100px] rounded-b-2xl overflow-hidden border border-[#D9CDBC] shadow-md">
                  <Image 
                    src={bridePhoto}
                    alt={brideFullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-adea-forum text-[#2E2B2A] font-semibold tracking-wider uppercase">{brideFullName}</h3>
                  <p className="text-xs font-adea-lora text-[#7A7269] italic">{brideParents}</p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-adea-montserrat font-medium text-[#2E2B2A] bg-[#FFF] px-3.5 py-1 rounded-full border border-[#D9CDBC] mt-2 hover:bg-[#2E2B2A] hover:text-white transition-all"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> {brideInstagram || "Instagram"}
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 3. HOLY VERSE (Q.S. AR-RUM: 21) - TRANSPARENT BACKGROUND */}
          <section className="px-6 py-12 text-center bg-transparent relative z-10 border-t border-white/20 text-white">
            <ScrollReveal variant="flip-up">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl space-y-3 max-w-xs mx-auto">
                <p className="text-xs font-adea-lora text-zinc-100 italic leading-relaxed">
                  “Dan diantara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.”
                </p>
                <span className="block text-[11px] font-adea-montserrat font-semibold text-zinc-200 uppercase tracking-widest pt-1">
                  Q.S. Ar-Rum: 21
                </span>
              </div>
            </ScrollReveal>
          </section>

          {/* 4. COUNTDOWN TIMER - TRANSPARENT BACKGROUND */}
          <section className="px-6 py-12 text-center space-y-6 bg-transparent relative z-10 border-t border-white/20 text-white">
            <ScrollReveal variant="drop">
              <h2 className="text-3xl font-adea-forum text-white uppercase tracking-widest font-semibold drop-shadow-md">Countdown Time</h2>
            </ScrollReveal>

            <ScrollReveal delay={150} variant="zoom-pop">
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {[
                  { val: timeLeft.days, label: "Hari" },
                  { val: timeLeft.hours, label: "Jam" },
                  { val: timeLeft.minutes, label: "Menit" },
                  { val: timeLeft.seconds, label: "Detik" }
                ].map((t, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl py-3 px-2 text-center shadow-lg">
                    <span className="block text-2xl font-adea-forum font-bold text-white">{t.val}</span>
                    <span className="text-[9px] font-adea-montserrat font-bold text-zinc-300 uppercase block mt-0.5">{t.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250} variant="fade-up">
              <button
                onClick={() => {
                  const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Pernikahan ${groomNickname} & ${brideNickname}\nLOCATION:${akadLocation.split(",")[0]}\nEND:VEVENT\nEND:VCALENDAR`;
                  const blob = new Blob([icsData], { type: "text/calendar" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Pernikahan_Adea_Novia.ics";
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-adea-montserrat font-bold uppercase tracking-wider shadow-xl hover:bg-zinc-200 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-950" /> Simpan di Kalender
              </button>
            </ScrollReveal>
          </section>

          {/* 5. AKAD NIKAH & RESEPSI - SOLID CANVAS */}
          <section className="px-6 py-12 space-y-8 text-center border-t border-[#E5DBCF] bg-[#FAF7F2] relative z-10">
            {/* Akad */}
            <ScrollReveal variant="slide-right">
              <div className="bg-[#FFF] rounded-[28px] p-6 border border-[#D9CDBC] shadow-sm space-y-3 text-center">
                <h3 className="text-2xl font-adea-forum text-[#2E2B2A] uppercase tracking-wider font-semibold">Akad Nikah</h3>
                <div className="space-y-1 text-xs font-adea-montserrat text-[#6B635B]">
                  <p className="font-semibold text-[#2E2B2A]">{akadDateDisplay}</p>
                  <p>{akadTime}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <p className="text-[12px] text-[#2E2B2A] font-semibold max-w-xs mx-auto">{akadLocation}</p>
                </div>
                <a 
                  href={akadGmapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#3D3A37] text-white text-[11px] font-adea-montserrat font-medium uppercase tracking-wider shadow-md hover:bg-[#2E2B2A] transition-all cursor-pointer mt-2"
                >
                  <MapPin className="w-3 h-3" /> Google Maps
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi */}
            <ScrollReveal delay={150} variant="slide-left">
              <div className="bg-[#FFF] rounded-[28px] p-6 border border-[#D9CDBC] shadow-sm space-y-3 text-center">
                <h3 className="text-2xl font-adea-forum text-[#2E2B2A] uppercase tracking-wider font-semibold">Resepsi</h3>
                <div className="space-y-1 text-xs font-adea-montserrat text-[#6B635B]">
                  <p className="font-semibold text-[#2E2B2A]">{resepsiDateDisplay}</p>
                  <p>{resepsiTime}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <p className="text-[12px] text-[#2E2B2A] font-semibold max-w-xs mx-auto">{resepsiLocation}</p>
                </div>
                <a 
                  href={resepsiGmapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#3D3A37] text-white text-[11px] font-adea-montserrat font-medium uppercase tracking-wider shadow-md hover:bg-[#2E2B2A] transition-all cursor-pointer mt-2"
                >
                  <MapPin className="w-3 h-3" /> Google Maps
                </a>
              </div>
            </ScrollReveal>
          </section>

          {/* 6. LOVE STORY - SOLID CANVAS */}
          <section className="px-6 py-12 space-y-6 text-center border-t border-[#E5DBCF] bg-[#FAF7F2] relative z-10">
            <ScrollReveal variant="flip-up">
              <h2 className="text-3xl font-adea-forum text-[#2E2B2A] uppercase tracking-widest">Love Story</h2>
            </ScrollReveal>

            <ScrollReveal delay={150} variant="fade-up">
              <div className="space-y-4 text-left">
                {/* Love Story Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D9CDBC] shadow-sm mb-4">
                  <Image 
                    src={storyPhoto} 
                    alt="Love Story"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3 bg-[#FFF] p-5 rounded-2xl border border-[#D9CDBC] shadow-sm">
                  {loveStory.map((story, idx) => (
                    <div key={idx} className={idx > 0 ? "pt-2 border-t border-[#E5DBCF]" : ""}>
                      <h4 className="font-adea-forum text-lg text-[#2E2B2A] uppercase font-semibold">{story.title}</h4>
                      <p className="text-xs font-adea-montserrat text-[#7A7269] mt-1 leading-relaxed">
                        {story.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 7. PHOTO GALLERY - SOLID CANVAS */}
          <section className="px-6 py-12 space-y-6 text-center border-t border-[#E5DBCF] bg-[#FAF7F2] relative z-10">
            <ScrollReveal variant="drop">
              <h2 className="text-3xl font-adea-forum text-[#2E2B2A] uppercase tracking-widest">Our Gallery</h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {galleryImages.map((src, idx) => (
                <ScrollReveal key={idx} delay={idx * 60} variant={idx % 3 === 0 ? "zoom-pop" : idx % 3 === 1 ? "slide-left" : "slide-right"}>
                  <div 
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#D9CDBC] shadow-sm group cursor-pointer hover:opacity-90 transition-all"
                  >
                    <Image 
                      src={src} 
                      alt={`Gallery ${idx+1}`} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* YouTube Prewedding Video Embed Below Photos */}
            {(youtubeVideo || videoLink) && (
              <ScrollReveal delay={200} variant="flip-up">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#D9CDBC] shadow-md bg-stone-900 mt-4">
                  <iframe
                    id="youtube-player-iframe"
                    className="w-full h-full border-0"
                    src={(() => {
                      const baseSrc = youtubeVideo 
                        ? `https://www.youtube.com/embed/${youtubeVideo.split('v=')[1]?.split('&')[0] || youtubeVideo.split('youtu.be/')[1]?.split('?')[0] || youtubeVideo}` 
                        : videoLink;
                      return baseSrc.includes('?') ? `${baseSrc}&enablejsapi=1` : `${baseSrc}?enablejsapi=1`;
                    })()}
                    title="Cinematic Prewedding Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
              <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
              >
                <div className="relative max-w-lg w-full max-h-[85vh] aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <Image 
                    src={selectedImage} 
                    alt="Gallery Full" 
                    fill 
                    className="object-contain" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 border border-zinc-600 hover:bg-black transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 7.5 QR CODE TAMU UNDANGAN (AFTER GALERI) */}
          {isPro && (
            <section id="qrcode-section" className="px-6 py-12 space-y-6 text-center border-t border-white/20 bg-transparent relative z-10">
              <ScrollReveal variant="zoom-pop">
                <div className="bg-white/20 backdrop-blur-md rounded-[28px] p-6 border border-white/20 shadow-md space-y-4 max-w-sm mx-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-adea-montserrat font-bold text-zinc-300 tracking-[0.25em] uppercase">PRESENSI DIGITAL</span>
                    <h2 className="text-2xl font-adea-forum text-white uppercase tracking-wider font-semibold drop-shadow-md">QR Code Tamu Undangan</h2>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl inline-block shadow-md border border-white/20">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                      alt="QR Code Tamu"
                      className="w-44 h-44 mx-auto rounded-lg object-contain bg-white"
                    />
                    <div className="mt-2 pt-2 border-t border-white/20 text-center">
                      <span className="text-[11px] font-mono font-bold text-white tracking-widest drop-shadow-sm">
                        VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center font-adea-montserrat">
                    <span className="text-sm font-semibold text-white block drop-shadow-sm">{guestName || "Tamu Undangan"}</span>
                    <p className="text-xs text-zinc-200 leading-relaxed max-w-xs mx-auto drop-shadow-sm">
                      Tunjukkan QR Code ini kepada petugas meja penerima tamu untuk konfirmasi presensi kehadiran.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* 8. WEDDING GIFT - SOLID CANVAS */}
          <section className="px-6 py-12 space-y-6 text-center border-t border-[#E5DBCF] bg-[#FAF7F2] relative z-10">
            <ScrollReveal variant="slide-left">
              <div className="space-y-2">
                <h2 className="text-3xl font-adea-forum text-[#2E2B2A] uppercase tracking-widest">Wedding Gift</h2>
                <p className="text-xs font-adea-montserrat text-[#7A7269] max-w-xs mx-auto leading-relaxed">
                  Tanpa mengurangi rasa hormat kami bagi tamu yang ingin mengirimkan hadiah kepada kedua mempelai dapat mengirimkannya melalui :
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-4 font-adea-montserrat">
              {bankAccounts.map((bank, idx) => (
                <ScrollReveal key={idx} delay={150 * (idx + 1)} variant={idx % 2 === 0 ? "slide-left" : "slide-right"}>
                  <div className="bg-[#FFF] p-5 rounded-2xl border border-[#D9CDBC] text-left space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-[#2E2B2A] tracking-wider uppercase">{bank.bankName}</span>
                      <Gift className="w-4 h-4 text-[#8C827A]" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#8C827A]">Nomor Rekening:</span>
                      <span className="text-sm font-semibold text-[#2E2B2A] tracking-wider">{bank.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E5DBCF]">
                      <span className="text-xs text-[#6B635B]">a.n. {bank.recipientName}</span>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber, bank.accountNumber)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3D3A37] text-white text-[10px] font-medium hover:bg-[#2E2B2A] transition-all cursor-pointer"
                      >
                        {copiedBank === bank.accountNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedBank === bank.accountNumber ? "Tersalin!" : "Salin Rekening"}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* 9. RSVP FORM & WISHES FEED - TRANSPARENT BACKGROUND */}
          <section className="px-6 py-12 space-y-6 text-center bg-transparent relative z-10 border-t border-white/20 text-white font-adea-montserrat">
            <ScrollReveal variant="fade-up">
              <div className="space-y-1">
                <span className="text-[10px] font-adea-montserrat font-semibold text-zinc-300 tracking-[0.25em] uppercase">Konfirmasi &amp; Doa</span>
                <h2 className="text-3xl font-adea-forum text-white uppercase tracking-widest font-bold drop-shadow-md">RSVP &amp; Ucapan</h2>
              </div>
            </ScrollReveal>

            {/* RSVP Form */}
            <ScrollReveal delay={150} variant="flip-up">
              <form onSubmit={handleSubmitRsvp} className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Masukkan Nama Anda..." 
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-white" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1">Jumlah Tamu</label>
                  <select 
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-white/20 bg-white/30 text-white focus:outline-none focus:border-white"
                  >
                    <option value="1" className="bg-zinc-900 text-white">1 Orang</option>
                    <option value="2" className="bg-zinc-900 text-white">2 Orang</option>
                    <option value="3" className="bg-zinc-900 text-white">3+ Orang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1">Konfirmasi Kehadiran</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Hadir" 
                        checked={rsvpStatus === "Hadir"} 
                        onChange={() => setRsvpAttendance("Hadir")} 
                        className="accent-white" 
                      /> Hadir
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Tidak Hadir" 
                        checked={rsvpStatus === "Tidak Hadir"} 
                        onChange={() => setRsvpAttendance("Tidak Hadir")} 
                        className="accent-white" 
                      /> Halangan / Tidak Hadir
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1">Pesan &amp; Doa Restu</label>
                  <textarea 
                    rows={3} 
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan pesan &amp; doa Anda untuk kedua mempelai..."
                    required
                    className="w-full text-xs p-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Sending..." : "Kirim Ucapan & RSVP"}
                </button>

                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold text-center">
                    Terima kasih! Pesan dan konfirmasi kehadiran Anda telah tersimpan. ❤️
                  </div>
                )}
              </form>
            </ScrollReveal>

            {/* Comments Feed */}
            <ScrollReveal delay={250} variant="fade-up">
              <div className="space-y-3 text-left">
                <span className="text-xs font-semibold text-zinc-300 block">Ucapan &amp; Doa Restu:</span>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {comments.length > 0 ? comments.map((item, i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-md space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-white">{item.name}</span>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                          (item.rsvp_status || item.attendance)?.includes("Hadir") ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/30" : "bg-amber-900/80 text-amber-200 border border-amber-500/30"
                        }`}>
                          {item.rsvp_status || item.attendance || "Hadir"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed pt-1">{item.comment || item.message}</p>
                      <span className="block text-[9px] text-zinc-400 mt-1">
                        {item.created_at && !isNaN(new Date(item.created_at).getTime()) ? new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : item.created_at}
                      </span>
                    </div>
                  )) : (
                    <p className="text-xs text-zinc-400">Belum ada ucapan.</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 10. CLOSING - TRANSPARENT BACKGROUND */}
          <section className="px-6 py-16 text-center space-y-6 bg-transparent relative z-10 border-t border-white/20 text-white">
            <ScrollReveal variant="zoom-pop">
              <div className="space-y-3 max-w-xs mx-auto">
                <h3 className="text-4xl font-adea-forum text-white uppercase tracking-widest font-bold filter drop-shadow-md">Terima Kasih</h3>
                <p className="text-xs font-adea-lora text-zinc-100 italic leading-relaxed drop-shadow">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
                </p>
                <div className="pt-4">
                  <span className="text-xs font-adea-montserrat font-medium text-zinc-300 block uppercase tracking-widest">KAMI YANG BERBAHAGIA,</span>
                  <span className="text-3xl font-adea-forum text-white block mt-1 uppercase font-bold drop-shadow-md">{coupleNames}</span>
                </div>
              </div>
            </ScrollReveal>

            <div className="pt-8 text-[10px] font-adea-montserrat text-zinc-300 tracking-wider uppercase border-t border-white/20">
              Bintarti Digital Wedding Invitation • 2026
            </div>
          </section>

          {/* QR Code Fullscreen Modal */}
          {showQrModal && (
            <div 
              onClick={() => setShowQrModal(false)}
              className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#FAF7F2] p-6 rounded-[28px] border border-[#D9CDBC] shadow-2xl max-w-xs w-full text-center space-y-4 font-adea-montserrat animate-in fade-in zoom-in-95 duration-200"
              >
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 bg-stone-200 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-[#8C827A] tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                  <h3 className="text-xl font-adea-forum text-[#2E2B2A] uppercase font-semibold">QR Code Tamu</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-[#E5DBCF]">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                    alt="QR Code Presensi"
                    className="w-48 h-48 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-[#E5DBCF] text-center">
                    <span className="text-[11px] font-mono font-bold text-[#2E2B2A] tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#2E2B2A] block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-[11px] text-[#6B635B] leading-snug">
                    Tunjukkan QR Code ini kepada panitia meja penerima tamu saat kedatangan.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
