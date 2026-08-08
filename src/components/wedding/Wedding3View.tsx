"use client";

import React, { useState, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import Image from "next/image";
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Music, 
  Disc,
  MessageCircle, 
  Send, 
  Video, 
  Sparkles,
  Camera,
  ChevronDown,
  Navigation,
  Globe,
  Share2,
  X,
  ExternalLink,
  Gift,
  CheckCircle2,
  HelpCircle,
  XCircle,
  QrCode,
  Scan
} from "lucide-react";

interface Wedding3ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// Multi-variant ScrollReveal for Wedding 3
// Variants: fade-up | slide-left | slide-right | float-up | spin-fade | drop
function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up"
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: "fade-up" | "slide-left" | "slide-right" | "float-up" | "spin-fade" | "drop"; className?: string;
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
    "slide-left": { opacity: 0, transform: "translateX(-24px)" },
    "slide-right":{ opacity: 0, transform: "translateX(24px)" },
    "float-up":   { opacity: 0, transform: "translateY(32px) scale(0.98)" },
    "spin-fade":  { opacity: 0, transform: "rotate(-3deg) scale(0.96)" },
    "drop":       { opacity: 0, transform: "translateY(-24px)" },
  }[variant || "fade-up"];

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "0.7s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        ...(isVisible ? { opacity: 1, transform: "none" } : hiddenStyle),
      }}
    >
      {children}
    </div>
  );
}

export default function Wedding3View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-3"
}: Wedding3ViewProps) {
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

  // Parse weddingNotes from JSON
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
  const groomFullName  = weddingNotes?.groomName         || nameParts[0] || "Bagas Wicaksono, M.B.A.";
  const groomName      = weddingNotes?.groomNickname     || nameParts[0]?.split(" ")[0] || "Bagas";
  const groomParents   = weddingNotes?.groomParents      || "Bapak Dr. H. Hartono & Ibu Hj. Endang Sulastri";
  const groomPhoto     = weddingNotes?.groomPhotoUrl     || invitationData?.groom_photo_url || "/saferia_groom_portrait.jpg";
  
  const brideFullName  = weddingNotes?.brideName         || nameParts[1] || "Cinta Bella, S.Kom.";
  const brideName      = weddingNotes?.brideNickname     || nameParts[1]?.split(" ")[0] || "Bella";
  const brideParents   = weddingNotes?.brideParents      || "Bapak Ir. H. Prabowo & Ibu Hj. Kusuma";
  const bridePhoto     = weddingNotes?.bridePhotoUrl     || invitationData?.bride_photo_url || "/saferia_bride_portrait.jpg";

  const isPro          = !!invitationData?.is_pro || !!weddingNotes?.isPro;
  const youtubeVideo   = weddingNotes?.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";

  const eventTypeLabel = invitationData?.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah";
  const akadDate       = formatDateIndonesian(weddingNotes?.akadDate || invitationData?.event_date || "2026-12-24");
  const akadTime       = weddingNotes?.akadTime          || invitationData?.event_time    || "08.00 WIB";
  const akadLocation   = weddingNotes?.akadLocation      || invitationData?.event_location || "Plataran Heritage Borobudur, Magelang";
  const resepsiDate    = formatDateIndonesian(weddingNotes?.resepsiDate || invitationData?.event_date || "2026-12-24");
  const resepsiTime    = weddingNotes?.resepsiTime       || invitationData?.event_time    || "11.00 WIB - Selesai";
  const resepsiLocation= weddingNotes?.resepsiLocation   || invitationData?.event_location || "Plataran Heritage Borobudur, Magelang";

  const mapsLink = invitationData?.maps_link || "https://maps.google.com";
  const akadGmapsLink  = weddingNotes?.akadGmaps         || mapsLink;
  const resepsiGmapsLink= weddingNotes?.resepsiGmaps      || mapsLink;

  const coverPhoto = invitationData?.child_photo_url || weddingNotes?.heroPhotoUrl || "/saferia_outdoor_hero.jpg";
  const storyPhoto = weddingNotes?.storyPhotoUrl || "/saferia_nature_couple.jpg";
  const closingPhoto = weddingNotes?.closingPhotoUrl || "/saferia_nature_couple.jpg";

  const bankAccounts = (() => {
    try {
      if (weddingNotes?.bankAccounts && Array.isArray(weddingNotes.bankAccounts) && weddingNotes.bankAccounts.length > 0)
        return weddingNotes.bankAccounts;
      if (invitationData?.bank_account) {
        const parsed = JSON.parse(invitationData.bank_account as string);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      { bankName: "BANK BCA", accountNumber: "1234567890", recipientName: groomName },
      { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: brideName }
    ];
  })();

  const loveStory = (() => {
    try {
      if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
        return weddingNotes.loveStory.map((s: any) => ({ year: s.year, title: s.title, desc: s.description || s.desc || "" }));
      }
    } catch (e) {}
    return [
      { year: "2024", title: "Awal Berjumpa", desc: "Pertemuan tak terduga di sebuah acara yang menumbuhkan rasa." },
      { year: "2025", title: "Momen Lamaran", desc: "Dengan restu kedua orang tua, kami mengikat janji dalam prosesi lamaran." },
      { year: "2026", title: "Hari Bahagia", desc: "Hari ini, kami melangkah menuju kehidupan baru bersama selamanya." }
    ];
  })();

  // Gallery Photos
  const galleryPhotos = (() => {
    try {
      const imgs = invitationData?.gallery_images;
      if (Array.isArray(imgs) && imgs.length > 0) return imgs;
      if (typeof imgs === 'string') {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [
      coverPhoto,
      groomPhoto,
      bridePhoto
    ];
  })();

  // RSVP Form State
  const [formName, setFormName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [formAttendance, setFormAttendance] = useState("Hadir");
  const [formPax, setFormPax] = useState("1");
  const [formWish, setFormWish] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown State (Default 24 Dec 2026)
  const targetDate = new Date("2026-12-24T08:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

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

  const copyToClipboard = (text: string, bankId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      alert("Harap tunggu CAPTCHA selesai atau refresh halaman.");
      return;
    }
    if (!formName.trim() || !formWish.trim()) return;

    setIsSubmitting(true);
    const newComment = {
      name: formName,
      rsvp_status: formAttendance === "Hadir" ? `Hadir (${formPax} Orang)` : "Tidak Hadir",
      comment: formWish,
      created_at: new Date().toISOString()
    };

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: themeId,
          name: formName,
          rsvpStatus: newComment.rsvp_status,
          comment: formWish,
          turnstileToken
        })
      });
      setComments([newComment, ...comments]);
      setFormWish("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setComments([newComment, ...comments]);
      setFormWish("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#2C1A14] font-sans antialiased overflow-x-hidden selection:bg-[#2C1A14] selection:text-white">
      {/* Inject Exact Fonts: Tenor Sans, Ovo, Inter, Cinzel */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Ovo&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&display=swap');

        .font-tenor {
          font-family: 'Tenor Sans', sans-serif;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .font-ovo {
          font-family: 'Ovo', 'Playfair Display', serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .font-cinzel {
          font-family: 'Cinzel', serif;
        }
      `}</style>

      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src={parseGDriveUrl(invitationData?.music || invitationData?.music_url) || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}
        loop
        preload="auto"
      />

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] p-8 w-full max-w-sm rounded-none border border-[#2C1A14]/20 shadow-2xl relative text-center">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-[#2C1A14] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-tenor text-sm font-bold text-[#2C1A14] tracking-widest mb-6">SCAN QR PRESENSI</h3>
            <div className="w-48 h-48 mx-auto bg-white border border-[#2C1A14]/10 p-2 mb-4">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[#2C1A14]/30">
                <QrCode className="w-20 h-20" />
              </div>
            </div>
            <p className="text-[10px] text-[#2C1A14]/60 font-inter tracking-wide uppercase">
              Tunjukkan QR ini kepada penerima tamu
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COVER OVERLAY / LOCK SCREEN MODAL                        */}
      {/* (Foto 100% Clear Jelas - Tanpa Efek Putih/Haze)         */}
      {/* ======================================================== */}
      {(!isOpened || isClosingCover) && (
        <div className={`fixed inset-0 z-[999] bg-black flex flex-col items-center justify-between p-6 sm:p-10 text-center overflow-hidden transition-all duration-700 ease-in-out ${
          isClosingCover ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
        }`}>
          {/* FULL SECTION BACKGROUND IMAGE (100% CLEAR, NO WHITE HAZE) */}
          <div className="absolute inset-0 z-0">
            <Image
              src={coverPhoto}
              alt="Cover Background Photo"
              fill
              className="object-cover object-center object-center opacity-95 filter brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
          </div>

          {/* Top Title */}
          <div className="pt-8 z-10 relative">
            <span className="text-white font-tenor text-xs font-semibold tracking-[0.2em] block mb-2 drop-shadow-md">
              Undangan Pernikahan
            </span>
            <h1 className="font-ovo text-3xl sm:text-4xl text-white tracking-wide font-normal drop-shadow-lg">
              {groomName} & {brideName}
            </h1>
          </div>

          {/* Guest Name & Open Invitation Button (Di Bawah) */}
          <div className="w-full max-w-xs pb-8 z-10 relative flex flex-col items-center gap-4 mt-auto">
            <div className="w-full py-2 text-center space-y-1">
              <p className="text-[10px] text-slate-300 font-inter uppercase tracking-widest drop-shadow-sm">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-ovo capitalize drop-shadow-md">
                {guestName}
              </h3>
            </div>

            {/* Tombol Kotak Diperkecil */}
            <button
              onClick={handleOpenInvitation}
              className="w-full py-2.5 px-6 border border-white bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white font-tenor text-[10px] tracking-[0.2em] rounded-none shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <Heart className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
              <span>BUKA UNDANGAN</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN INVITATION CONTENT CONTAINER */}
      {(isOpened || isClosingCover) && (
        <div className="max-w-md mx-auto bg-[#FAF7F2] shadow-2xl min-h-screen relative border-x border-[#2C1A14]/10">

        {/* Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
        {isOpened && (
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            {isPro && (
              <button
              onClick={() => setShowQrModal(true)}
              className="w-11 h-11 bg-[#2C1A14] text-[#FAF7F2] border border-[#2C1A14]/40 shadow-xl flex items-center justify-center hover:bg-black transition-all cursor-pointer group"
              aria-label="QR Code Presensi"
              title="QR Code Presensi Tamu"
            >
              <QrCode className="w-5 h-5 text-[#FAF7F2] group-hover:text-amber-200 transition-colors" />
            </button>
            )}

            <button
              onClick={toggleAudio}
              className="w-11 h-11 bg-[#2C1A14] text-[#FAF7F2] border border-[#2C1A14]/40 shadow-xl flex items-center justify-center hover:bg-black transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-4 h-4 text-[#FAF7F2] animate-bounce" />
              )}
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: HERO / MAIN HEADER                            */}
        {/* (Foto 100% Clear Jelas - Tanpa Efek Putih/Haze)         */}
        {/* ======================================================== */}
        <section className="relative min-h-screen flex flex-col items-center justify-between py-20 px-6 text-center border-b border-[#2C1A14]/15 overflow-hidden">
          {/* FULL BACKGROUND PHOTO (100% CLEAR) */}
          <div className="absolute inset-0 z-0">
            <Image
              src={coverPhoto}
              alt="Main Hero Background Photo"
              fill
              className="object-cover object-center object-center opacity-95 filter brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/75" />
          </div>

          <ScrollReveal variant="spin-fade">
            <div className="space-y-3 z-10 relative pt-12">
              <h3 className="font-tenor text-[11px] text-white tracking-[0.25em] uppercase font-semibold drop-shadow-md">
                The Wedding of
              </h3>
              <h1 className="font-ovo text-4xl sm:text-5xl text-white font-normal tracking-tight leading-tight drop-shadow-lg">
                {groomName} <br /> & <br /> {brideName}
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300} variant="slide-left">
            <div className="space-y-3 z-10 relative pb-8 my-auto">
              <p className="font-tenor text-xs sm:text-sm text-white tracking-[0.2em] font-semibold drop-shadow-md">
                {akadDate}
              </p>
              <p className="text-[10px] text-slate-300 font-inter italic tracking-widest animate-pulse drop-shadow-sm">
                Scroll Down ↓
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: BIBLE VERSE / HOLY QUOTE                       */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center border-b border-[#2C1A14]/15 bg-white text-[#2C1A14] relative">
          <ScrollReveal>
            <div className="max-w-xs mx-auto space-y-5">
              <div className="w-9 h-9 mx-auto rounded-full border border-[#2C1A14]/30 bg-[#2C1A14]/10 flex items-center justify-center text-[#2C1A14]">
                <Heart className="w-4 h-4 fill-[#2C1A14]" />
              </div>

              <blockquote className="font-ovo text-sm sm:text-base text-[#2C1A14]/90 italic leading-relaxed font-light">
                "Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih."
              </blockquote>

              <h4 className="font-tenor text-[11px] font-bold text-[#2C1A14] tracking-[0.2em]">
                1 Korintus 13:13
              </h4>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: GROOM PROFILE                                 */}
        {/* ======================================================== */}
        <section className="relative min-h-[95vh] flex flex-col justify-end px-6 pb-10 text-center border-b border-[#2C1A14]/15 overflow-hidden">
          {/* FULL BACKGROUND GROOM PHOTO */}
          <div className="absolute inset-0 z-0">
            <Image
              src={groomPhoto}
              alt="Groom Background Photo"
              fill
              className="object-cover object-center object-top opacity-100 filter brightness-95"
            />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          </div>

          <ScrollReveal>
            <div className="relative z-10 max-w-xs mx-auto space-y-2.5 pt-40 text-white">
              <h3 className="font-tenor text-[10px] text-white tracking-[0.25em] uppercase font-bold drop-shadow-sm">
                The Groom
              </h3>

              <div className="space-y-1">
                <h2 className="font-ovo text-2xl sm:text-3xl text-white font-normal drop-shadow-md">
                  {groomFullName}
                </h2>
                <p className="font-inter text-[11px] text-slate-200 leading-relaxed font-light">
                  Putra dari <br />
                  <span className="font-semibold text-white">{groomParents}</span>
                </p>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-white bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white text-[9px] font-tenor tracking-widest rounded-none transition-all shadow-md"
              >
                <Camera className="w-3 h-3" />
                <span>INSTAGRAM</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* AMPERSAND DIVIDER */}
        <div className="py-4 bg-[#FAF7F2] flex items-center justify-center gap-4 text-[#2C1A14]">
          <div className="h-[1px] w-12 bg-[#2C1A14]/30" />
          <span className="font-ovo text-2xl text-[#2C1A14] italic">&</span>
          <div className="h-[1px] w-12 bg-[#2C1A14]/30" />
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: BRIDE PROFILE                                 */}
        {/* ======================================================== */}
        <section className="relative min-h-[95vh] flex flex-col justify-end px-6 pb-10 text-center border-b border-[#2C1A14]/15 overflow-hidden">
          {/* FULL BACKGROUND BRIDE PHOTO */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bridePhoto}
              alt="Bride Background Photo"
              fill
              className="object-cover object-center object-top opacity-100 filter brightness-95"
            />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          </div>

          <ScrollReveal delay={200} variant="slide-left">
            <div className="relative z-10 max-w-xs mx-auto space-y-2.5 pt-40 text-white">
              <h3 className="font-tenor text-[10px] text-white tracking-[0.25em] uppercase font-bold drop-shadow-sm">
                The Bride
              </h3>

              <div className="space-y-1">
                <h2 className="font-ovo text-2xl sm:text-3xl text-white font-normal drop-shadow-md">
                  {brideFullName}
                </h2>
                <p className="font-inter text-[11px] text-slate-200 leading-relaxed font-light">
                  Putri dari <br />
                  <span className="font-semibold text-white">{brideParents}</span>
                </p>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-white bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white text-[9px] font-tenor tracking-widest rounded-none transition-all shadow-md"
              >
                <Camera className="w-3 h-3" />
                <span>INSTAGRAM</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: JOURNEY OF LOVE (TIMELINE)                   */}
        {/* ======================================================== */}
        <section className="relative py-24 px-6 text-center border-b border-[#2C1A14]/15 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={storyPhoto}
              alt="Journey Background Photo"
              fill
              className="object-cover object-center object-center opacity-95 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
          </div>

          <ScrollReveal>
            <div className="relative z-10 space-y-6 text-white">
              <h2 className="font-tenor text-sm sm:text-base text-white tracking-[0.25em] uppercase font-semibold drop-shadow-md">
                JOURNEY OF LOVE
              </h2>

              <div className="space-y-4 max-w-xs mx-auto text-left font-inter text-xs leading-relaxed text-slate-100">
                {loveStory.map((story: any, idx: number) => (
                  <div key={idx} className={`py-2.5 ${idx !== loveStory.length - 1 ? "border-b border-white/20" : ""} space-y-1`}>
                    <h4 className="font-bold text-white font-tenor text-[11px] tracking-wider">
                      {story.title}
                    </h4>
                    <p className="text-slate-200 font-light">{story.desc}</p>
                  </div>
                ))}
              </div>

              <p className="font-ovo text-lg text-white italic font-normal pt-1 drop-shadow-md">
                -{groomName} & {brideName}-
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: EVENT DETAILS (PEMBERKATAN & RESEPSI)         */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center space-y-10 border-b border-[#2C1A14]/15 bg-white text-[#2C1A14]">
          {/* PEMBERKATAN */}
          <ScrollReveal>
            <div className="space-y-4 max-w-sm mx-auto pb-8 border-b border-[#2C1A14]/20">
              <div className="w-9 h-9 mx-auto rounded-full border border-[#2C1A14]/30 bg-[#2C1A14]/10 flex items-center justify-center text-[#2C1A14]">
                <Sparkles className="w-4 h-4" />
              </div>

              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em]">
                {eventTypeLabel.toUpperCase()}
              </h2>

              <div className="space-y-0.5 font-inter text-xs text-[#2C1A14]">
                <p className="font-semibold text-sm">{akadDate}</p>
                <p className="text-[#2C1A14] font-medium">{akadTime}</p>
              </div>

              <div className="space-y-1 font-inter text-xs">
                <MapPin className="w-4 h-4 mx-auto text-[#2C1A14]" />
                <p className="font-bold text-xs text-[#2C1A14]">{akadLocation}</p>
                <p className="text-[#2C1A14]/70 italic leading-relaxed font-light text-[11px]">
                  {/* Address info can be added here if available */}
                </p>
              </div>

              <a
                href={akadGmapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#2C1A14] bg-white/80 backdrop-blur-md hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] text-[9px] font-tenor tracking-widest rounded-none transition-all shadow-sm"
              >
                <Navigation className="w-3 h-3 fill-current" />
                <span>GOOGLE MAPS</span>
              </a>
            </div>
          </ScrollReveal>

          {/* RESEPSI */}
          <ScrollReveal delay={200} variant="drop">
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="w-9 h-9 mx-auto rounded-full border border-[#2C1A14]/30 bg-[#2C1A14]/10 flex items-center justify-center text-[#2C1A14]">
                <Heart className="w-4 h-4 fill-[#2C1A14]" />
              </div>

              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em]">
                RESEPSI
              </h2>

              <div className="space-y-0.5 font-inter text-xs text-[#2C1A14]">
                <p className="font-semibold text-sm">{resepsiDate}</p>
                <p className="text-[#2C1A14] font-medium">{resepsiTime}</p>
              </div>

              <div className="space-y-1 font-inter text-xs">
                <MapPin className="w-4 h-4 mx-auto text-[#2C1A14]" />
                <p className="font-bold text-xs text-[#2C1A14]">{resepsiLocation}</p>
                <p className="text-[#2C1A14]/70 italic leading-relaxed font-light text-[11px]">
                  {/* Address info can be added here if available */}
                </p>
              </div>

              <a
                href={resepsiGmapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#2C1A14] bg-white/80 backdrop-blur-md hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] text-[9px] font-tenor tracking-widest rounded-none transition-all shadow-sm"
              >
                <Navigation className="w-3 h-3 fill-current" />
                <span>GOOGLE MAPS</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 7: COUNTDOWN TIMER & CALENDAR                    */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center border-b border-[#2C1A14]/15 bg-[#FAF7F2] text-[#2C1A14]">
          <ScrollReveal>
            <div className="space-y-6 max-w-sm mx-auto">
              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em]">
                COUNTDOWN TIME
              </h2>

              {/* 4 DIGIT TEXT DISPLAY */}
              <div className="grid grid-cols-4 gap-2 border-y border-[#2C1A14]/20 py-4">
                <div className="text-center">
                  <span className="font-ovo text-2xl sm:text-3xl font-bold text-[#2C1A14] block">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="font-inter text-[10px] text-[#2C1A14]/70 uppercase tracking-widest">Hari</span>
                </div>

                <div className="text-center">
                  <span className="font-ovo text-2xl sm:text-3xl font-bold text-[#2C1A14] block">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="font-inter text-[10px] text-[#2C1A14]/70 uppercase tracking-widest">Jam</span>
                </div>

                <div className="text-center">
                  <span className="font-ovo text-2xl sm:text-3xl font-bold text-[#2C1A14] block">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="font-inter text-[10px] text-[#2C1A14]/70 uppercase tracking-widest">Menit</span>
                </div>

                <div className="text-center">
                  <span className="font-ovo text-2xl sm:text-3xl font-bold text-[#2C1A14] block">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="font-inter text-[10px] text-[#2C1A14]/70 uppercase tracking-widest">Detik</span>
                </div>
              </div>

              <a
                href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Pernikahan ${groomName} & ${brideName}%0ADESCRIPTION:Pernikahan Suci ${groomName} & ${brideName}%0ALOCATION:${akadLocation}%0AEND:VEVENT%0AEND:VCALENDAR`}
                download="wedding_calendar.ics"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#2C1A14] bg-white/80 backdrop-blur-md hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] text-[10px] font-tenor tracking-widest rounded-none transition-all shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 fill-current" />
                <span>SIMPAN DI KALENDER</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 8: QR CODE TAMU UNDANGAN PRESENSI                 */}
        {/* ======================================================== */}
        {isPro && (<section id="qrcode-section" className="py-16 px-6 text-center space-y-6 border-b border-[#2C1A14]/15 bg-white text-[#2C1A14]">
          <ScrollReveal>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-1">
                <span className="font-inter text-[10px] text-[#2C1A14]/60 uppercase tracking-[0.25em]">PRESENSI DIGITAL</span>
                <h3 className="font-tenor text-base text-[#2C1A14] font-bold tracking-wider uppercase">
                  QR Code Tamu Undangan
                </h3>
              </div>

              <div className="bg-white p-4 inline-block border border-[#2C1A14]/30 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                  alt="QR Code Presensi"
                  className="w-44 h-44 mx-auto object-contain"
                />
                <div className="mt-2 pt-2 border-t border-[#2C1A14]/20 text-center">
                  <span className="text-[11px] font-mono font-bold text-[#2C1A14] tracking-widest">
                    VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-tenor text-sm font-bold text-[#2C1A14] block">{guestName || "Tamu Undangan"}</span>
                <p className="font-inter text-xs text-[#2C1A14]/80 leading-relaxed font-light max-w-xs mx-auto">
                  Tunjukkan QR Code ini kepada petugas meja penerima tamu untuk konfirmasi presensi kehadiran.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>)}

        {/* ======================================================== */}
        {/* SECTION 9: GALLERY & YOUTUBE PREWEDDING VIDEO            */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center border-b border-[#2C1A14]/15 bg-[#FAF7F2]">
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em] uppercase">
                OUR GALLERY
              </h2>

              <div className="grid grid-cols-12 gap-1 sm:gap-2 pt-4 pb-8">
                {galleryPhotos.map((photo: string, idx: number) => {
                  const galleryImages = galleryPhotos;
                const total = Array.isArray(invitationData?.gallery_images) && invitationData.gallery_images.length > 0 ? invitationData.gallery_images.length : galleryImages.length;
                const isLastRow = idx >= total - (total % 3 === 0 ? 3 : total % 3);
                const itemsInLastRow = total % 3 === 0 ? 3 : total % 3;

                let colSpan = "";
                let aspectClass = "";

                if (isLastRow && itemsInLastRow === 1) {
                  colSpan = "col-span-12";
                  aspectClass = "aspect-[21/9] sm:aspect-[3/1]";
                } else if (isLastRow && itemsInLastRow === 2) {
                  colSpan = "col-span-6";
                  aspectClass = "aspect-[3/2]";
                } else {
                  const patternIdx = idx % 9;
                  if (patternIdx === 0) { colSpan = "col-span-4 sm:col-span-3"; aspectClass = "aspect-[3/4]"; }
                  else if (patternIdx === 1) { colSpan = "col-span-4 sm:col-span-3"; aspectClass = "h-full min-h-[150px]"; }
                  else if (patternIdx === 2) { colSpan = "col-span-4 sm:col-span-6"; aspectClass = "h-full min-h-[150px]"; }
                  else if (patternIdx === 3) { colSpan = "col-span-4"; aspectClass = "aspect-[4/5]"; }
                  else if (patternIdx === 4) { colSpan = "col-span-4"; aspectClass = "h-full min-h-[150px]"; }
                  else if (patternIdx === 5) { colSpan = "col-span-4"; aspectClass = "h-full min-h-[150px]"; }
                  else if (patternIdx === 6) { colSpan = "col-span-4 sm:col-span-5"; aspectClass = "h-full min-h-[150px]"; }
                  else if (patternIdx === 7) { colSpan = "col-span-4 sm:col-span-3"; aspectClass = "aspect-[3/4]"; }
                  else if (patternIdx === 8) { colSpan = "col-span-4 sm:col-span-4"; aspectClass = "h-full min-h-[150px]"; }
                }
                  return (
                  <div key={idx} className={colSpan}>
                    <ScrollReveal delay={idx * 60} className="w-full h-full">
                      <div
                        onClick={() => setSelectedImage(photo)}
                        className={`relative w-full ${aspectClass} rounded-sm bg-white p-1.5 shadow-md border border-[#2C1A14]/20 cursor-pointer group hover:scale-105 transition-all duration-300`}
                      >
                        <div className="relative w-full h-full overflow-hidden border border-[#2C1A14]/10">
                          <Image
                            src={photo}
                            alt={`Gallery Photo ${idx + 1}`}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                  );
                })}
              </div>

              {/* YouTube Video Embed */}
              {youtubeVideo && (
                <div className="pt-2">
                  <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-md border border-[#2C1A14]/30">
                    <iframe
                      src={youtubeVideo.includes("watch?v=") ? youtubeVideo.replace("watch?v=", "embed/") : youtubeVideo}
                      title="Prewedding Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white p-2 border border-white/40 bg-black/40 backdrop-blur-md rounded-none hover:bg-white hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-lg h-[80vh] overflow-hidden">
              <Image
                src={selectedImage}
                alt="Enlarged Photo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 10: WEDDING GIFT / DIGITAL ENVELOPE              */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center border-b border-[#2C1A14]/15 bg-white text-[#2C1A14]">
          <ScrollReveal>
            <div className="space-y-6 max-w-sm mx-auto">
              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em] uppercase">
                WEDDING GIFT
              </h2>
              <p className="font-inter text-xs text-[#2C1A14]/80 leading-relaxed font-light">
                Tanpa mengurangi rasa hormat kami bagi tamu yang ingin mengirimkan hadiah kepada kedua mempelai dapat mengirimkannya melalui :
              </p>

              {bankAccounts.map((bank: any, idx: number) => {
                const isLast = idx === bankAccounts.length - 1;
                const accId = `bank-${idx}`;
                return (
                  <div key={idx} className={`py-3 ${!isLast ? 'border-b border-[#2C1A14]/20' : ''} space-y-2 text-left`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-tenor text-xs text-[#2C1A14] uppercase">{bank.bankName}</span>
                      <Gift className="w-4 h-4 text-[#2C1A14]" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-[#2C1A14]">{bank.accountNumber}</p>
                      <p className="font-inter text-xs text-[#2C1A14]/70">a.n. {bank.recipientName}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, accId)}
                      className="w-full py-1.5 border border-[#2C1A14]/60 bg-white hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] rounded-none text-[9px] font-tenor tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      {copiedBank === accId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBank === accId ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 11: RSVP & WISHES GUESTBOOK                      */}
        {/* ======================================================== */}
        <section className="py-16 px-6 border-b border-[#2C1A14]/15 bg-[#FAF7F2]">
          <ScrollReveal>
            <div className="space-y-6 max-w-sm mx-auto">
              <div className="text-center space-y-2">
                <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em] uppercase">
                  RSVP
                </h2>
                <p className="font-inter text-xs text-[#2C1A14]/80 leading-relaxed font-light">
                  Bagi tamu undangan yang akan hadir di acara pernikahan kami silahkan kirimkan konfirmasi kehadiran dengan mengisi form berikut :
                </p>
              </div>

              {/* RSVP Form */}
              <form onSubmit={handleSubmitRsvp} className="space-y-3 font-inter text-xs py-3 border-y border-[#2C1A14]/20">
                <div>
                  <label className="block text-[#2C1A14] font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-3 py-2 rounded-none border border-[#2C1A14]/30 focus:outline-none focus:border-[#2C1A14] bg-white/60 text-[#2C1A14] placeholder-[#2C1A14]/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#2C1A14] font-semibold mb-1">Kehadiran</label>
                    <select
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-none border border-[#2C1A14]/30 focus:outline-none focus:border-[#2C1A14] bg-white/60 text-[#2C1A14]"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#2C1A14] font-semibold mb-1">Jumlah (Pax)</label>
                    <select
                      value={formPax}
                      onChange={(e) => setFormPax(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-none border border-[#2C1A14]/30 focus:outline-none focus:border-[#2C1A14] bg-white/60 text-[#2C1A14]"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#2C1A14] font-[#2C1A14] font-semibold mb-1">Ucapan & Doa Restu</label>
                  <textarea
                    rows={3}
                    required
                    value={formWish}
                    onChange={(e) => setFormWish(e.target.value)}
                    placeholder="Tuliskan harapan dan doa untuk kedua mempelai..."
                    className="w-full px-3 py-2 rounded-none border border-[#2C1A14]/30 focus:outline-none focus:border-[#2C1A14] bg-white/60 text-[#2C1A14] placeholder-[#2C1A14]/40"
                  />
                </div>

                {/* Tombol Kotak Diperkecil */}
                <div className="flex justify-center w-full overflow-hidden my-2">
                  <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                    onSuccess={(token) => setTurnstileToken(token)} 
                  />
                </div>

                <button type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 border border-[#2C1A14] bg-[#2C1A14] hover:bg-black text-white font-tenor text-[10px] tracking-widest rounded-none shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? "KIRIMKAN..." : "KIRIM KONFIRMASI"}</span>
                </button>
              </form>
              {submitSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs py-2 px-3 mt-4 text-center animate-pulse">
                  Terima kasih! Konfirmasi kehadiran Anda telah terkirim.
                </div>
              )}

              {/* Wishes List Feed */}
              <div className="space-y-3 font-inter text-xs">
                <h4 className="font-tenor text-xs text-[#2C1A14] tracking-wider font-bold text-center uppercase">
                  Doa & Ucapan Tamu ({comments.length})
                </h4>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                  {comments.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 border-b border-[#2C1A14]/15 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C1A14] font-ovo text-sm">{item.name}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-none border ${
                          item.rsvp_status?.includes("Hadir") && !item.rsvp_status?.includes("Tidak") ? "border-emerald-600 text-emerald-800" : "border-rose-600 text-rose-800"
                        }`}>
                          {item.rsvp_status}
                        </span>
                      </div>
                      <p className="text-[#2C1A14]/80 leading-relaxed font-light text-xs">{item.comment}</p>
                      <span className="text-[10px] text-[#2C1A14]/50 block">{new Date(item.created_at || new Date()).toLocaleDateString('id-ID')}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 12: CLOSING SECTION                              */}
        {/* (Background Foto Prewedding Crisp + Dark Overlay)       */}
        {/* ======================================================== */}
        <section className="relative py-24 px-6 text-center space-y-8 text-white overflow-hidden border-t border-white/10">
          {/* FULL SECTION BACKGROUND PHOTO */}
          <div className="absolute inset-0 z-0">
            <Image
              src={closingPhoto}
              alt="Closing Background Photo"
              fill
              className="object-cover object-center object-center opacity-95 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          </div>

          <ScrollReveal>
            <div className="relative z-10 space-y-6 max-w-sm mx-auto">
              <p className="font-inter text-xs text-slate-200 leading-relaxed italic font-light drop-shadow-sm">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
              </p>
              <p className="font-inter text-xs text-slate-200 font-light drop-shadow-sm">
                Atas kehadiran dan doa restunya, kami ucapkan terima kasih.
              </p>
              <div className="pt-4 space-y-2">
                <p className="font-inter text-xs text-slate-300 font-medium tracking-widest uppercase drop-shadow-sm">Kami yang berbahagia,</p>
                <h2 className="font-ovo text-3xl sm:text-4xl text-white font-normal drop-shadow-md">
                  {groomName} & {brideName}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <footer className="relative z-10 pt-8 border-t border-white/20 text-[10px] text-slate-400 font-inter">
            <p>© 2026 Bintarti Undangan Digital. All rights reserved.</p>
          </footer>
        </section>

        {/* FOOTER */}
<footer className="pb-8 pt-4 flex flex-col items-center justify-center relative z-10 bg-transparent opacity-80">
  <img src="/logo.png" alt="Bintarti" className="w-6 h-6 mb-1.5 opacity-80" />
  <p className="text-[10px] font-sans text-zinc-500 mt-1">
    © 2026 Bintarti. All rights reserved.
  </p>
</footer>

        {/* QR Code Fullscreen Modal */}
        {showQrModal && (
          <div 
            onClick={() => setShowQrModal(false)}
            className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white p-6 border border-[#2C1A14]/30 shadow-2xl max-w-xs w-full text-center space-y-4 font-inter animate-in fade-in zoom-in-95 duration-200"
            >
              <button 
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-[#2C1A14] hover:opacity-75 bg-[#FAF7F2] p-1.5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold text-[#2C1A14]/70 tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                <h3 className="font-tenor text-lg font-bold text-[#2C1A14] uppercase">QR Code Tamu</h3>
              </div>

              <div className="bg-white p-4 inline-block border border-[#2C1A14]/20 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                  alt="QR Code Presensi"
                  className="w-48 h-48 mx-auto object-contain"
                />
                <div className="mt-2 pt-2 border-t border-[#2C1A14]/20 text-center">
                  <span className="text-[11px] font-mono font-bold text-[#2C1A14] tracking-widest">
                    VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-tenor text-sm font-bold text-[#2C1A14] block">{guestName || "Tamu Undangan"}</span>
                <p className="text-[11px] text-[#2C1A14]/80 leading-snug">
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
