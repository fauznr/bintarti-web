"use client";

import React, { useState, useEffect, useRef } from "react";
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
  MessageCircle, 
  Send, 
  Sparkles, 
  Gift, 
  Video, 
  ChevronDown,
  Camera,
  ExternalLink,
  Disc,
  Zap,
  Smile,
  QrCode,
  Scan,
  X
} from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Wedding4ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// Reusable ScrollReveal component for smooth scroll animation effects
const ScrollReveal = ({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function Wedding4View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-4"
}: Wedding4ViewProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

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
  const groomFullName  = weddingNotes?.groomName         || nameParts[0] || "Dimas Anggara";
  const groomName      = weddingNotes?.groomNickname     || nameParts[0]?.split(" ")[0] || "Dimas";
  const groomParents   = weddingNotes?.groomParents      || "Bapak Budi & Ibu Siti";
  const groomPhoto     = weddingNotes?.groomPhotoUrl     || invitationData?.groom_photo_url || "/wedding4-groom.jpg";
  const groomIg        = weddingNotes?.groomInstagram           || "";
  
  const brideFullName  = weddingNotes?.brideName         || nameParts[1] || "Annisa Larasati";
  const brideName      = weddingNotes?.brideNickname     || nameParts[1]?.split(" ")[0] || "Annisa";
  const brideParents   = weddingNotes?.brideParents      || "Bapak Ahmad & Ibu Rini";
  const bridePhoto     = weddingNotes?.bridePhotoUrl     || invitationData?.bride_photo_url || "/wedding4-bride.jpg";
  const brideIg        = weddingNotes?.brideInstagram           || "";

  const isPro          = !!invitationData?.is_pro || !!weddingNotes?.isPro;
  const youtubeVideo   = weddingNotes?.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";
  const eventTypeLabel = weddingNotes?.akadLabel || (invitationData?.theme === "Wedding 4" ? "{eventTypeLabel}" : "Pemberkatan");
  const akadDate       = formatDateIndonesian(weddingNotes?.akadDate || invitationData?.event_date || "2026-08-18");
  const akadTime       = weddingNotes?.akadTime          || invitationData?.event_time    || "08.00 WIB";
  const akadLocation   = weddingNotes?.akadLocation      || invitationData?.location      || "Masjid Ramlie Musofa";
  const akadAddress    = weddingNotes?.akadAddress       || "{akadAddress}";
  const akadMap        = weddingNotes?.akadGmaps        || "https://goo.gl/maps/";

  const resepsiDate    = formatDateIndonesian(weddingNotes?.resepsiDate || invitationData?.event_date || "2026-08-18");
  const resepsiTime    = weddingNotes?.resepsiTime       || "11.00 WIB - 15.00 WIB";
  const resepsiLocation= weddingNotes?.resepsiLocation   || "Glass House Ballroom";
  const resepsiAddress = weddingNotes?.resepsiAddress    || "Park Hyatt Jakarta, {resepsiAddress}";
  const resepsiMap     = weddingNotes?.resepsiGmaps     || "https://goo.gl/maps/";
  
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
      const match = url.match(/file\/d\/([^/]+)/);
      if (match && match[1]) {
        return `/api/proxy-audio?id=${match[1]}`;
      }
    }
    return url;
  };

  
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  useEffect(() => {
    if (!youtubeVideo) return;
    
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    window.onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (audioRef.current && isPlayingAudio) {
                  audioRef.current.pause();
                }
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                if (audioRef.current && isPlayingAudio) {
                  audioRef.current.play().catch(() => {});
                }
              }
            }
          }
        });
      }
    };
  }, [youtubeVideo, isPlayingAudio]);


  // Form & Comments State
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at: string }>>([]);

  // Background Photos Slideshow (Gen Z White Aesthetic Relaxed Couple Photos)
  const coverPhotoUrl = invitationData?.child_photo_url || invitationData?.childPhotoUrl || weddingNotes?.heroPhotoUrl || invitationData?.coverPhoto || invitationData?.cover_photo || "/wedding4-hero.jpg";
  const bgPhotos = (Array.isArray(invitationData?.gallery_images) && invitationData.gallery_images.length > 0)
    ? invitationData.gallery_images
    : [
        coverPhotoUrl,
        "/wedding4-couple1.jpg",
        "/wedding4-couple2.jpg"
      ];
      
  const loveStoryItems = Array.isArray(invitationData?.love_story) && invitationData.love_story.length > 0
    ? invitationData.love_story
    : (weddingNotes?.loveStory || []);
    
  let parsedBanks = [];
  try {
    if (invitationData?.bank_account && typeof invitationData.bank_account === "string") {
      parsedBanks = JSON.parse(invitationData.bank_account);
    } else if (Array.isArray(invitationData?.bank_accounts)) {
      parsedBanks = invitationData.bank_accounts;
    }
  } catch (e) {}

  const bankAccounts = parsedBanks.length > 0 
    ? parsedBanks 
    : (weddingNotes?.bankAccounts || weddingNotes?.giftAccounts || [{ bankName: "BANK BCA", accountNumber: "1234567890", recipientName: groomName }, { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: brideName }]);
      
  // For standard Bintarti Gallery mapping
  const galleryImages = Array.isArray(invitationData?.gallery_images) && invitationData.gallery_images.length > 0 
    ? invitationData.gallery_images 
    : bgPhotos;


  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgPhotos.length);
    }, 4500);
    return () => clearInterval(bgInterval);
  }, [bgPhotos.length]);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = targetDateObj;

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
  }, []);

  // Load live comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?invitationId=${encodeURIComponent(themeId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setComments(data);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    fetchComments();
  }, [themeId]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) return;

    setIsSubmitting(true);
    const newComment = {
      name: rsvpName,
      attendance: rsvpStatus === "Hadir" ? `Hadir (${rsvpCount} Orang)` : "Tidak Hadir",
      message: rsvpMessage,
      created_at: new Date().toISOString()
    };

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: themeId,
          name: rsvpName,
          attendance: newComment.attendance,
          message: rsvpMessage
        })
      });
      setComments([newComment, ...comments]);
      setRsvpMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setComments([newComment, ...comments]);
      setRsvpMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-adea-montserrat relative overflow-x-hidden">
      {/* Google Fonts Links matching Wedding 2 Theme (Montserrat + Forum + Lora) */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Forum&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" 
        rel="stylesheet" 
      />
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
          COVER / LOCK SCREEN OVERLAY (NUANSA PUTIH - GEN Z CASUAL VIBE)
          ───────────────────────────────────────────────────────────────── */}
      {(!isOpened || isClosingCover) && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-slate-900 text-center select-none overflow-hidden transition-all duration-700 ease-in-out ${
          isClosingCover ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
        }`}>
          {/* Background image with clean bright overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center contrast-[1.02] brightness-[0.88]"
              style={{ backgroundImage: `url('${bgPhotos[0]}')` }}
            />
            {galleryImages.map((src: string, idx: number) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform contrast-[1.02] brightness-[0.88] ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
          </div>

          {/* Clean White Translucent Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/95 backdrop-blur-[2px]" />

          {/* Content Container */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto">
            {/* Gen Z Badge */}
            <div className="w-full flex justify-center text-center">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-slate-800 border border-slate-200/90 shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-slate-800 uppercase">THE WEDDING ERA</span>
                <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">2026</span>
              </div>
            </div>

            {/* Names & Tagline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase leading-none drop-shadow-sm">
                {groomName} <span className="text-slate-400 font-serif italic font-normal">&amp;</span> {brideName}
              </h1>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest shadow-sm">
                {weddingNotes?.hashtag || "#MenujuHalal"}
              </div>
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
              {akadDate}
            </p>

            {/* Guest Card */}
            <div className="w-full pt-4 border-t border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Special Invitation For:</span>
              <div className="bg-white/90 backdrop-blur-md py-3 px-6 rounded-2xl border border-slate-200 shadow-xl inline-block max-w-[260px] text-center mx-auto">
                <span className="text-sm font-extrabold text-slate-900 block truncate">
                  {guestName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  You are warmly invited to join our vibe! ✨
                </span>
              </div>
            </div>

            {/* Open Button */}
            <button
              onClick={handleOpenInvitation}
              className="mt-4 px-8 py-3.5 rounded-full bg-slate-900 text-white font-extrabold text-xs tracking-widest shadow-2xl hover:bg-slate-800 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 border border-slate-900 uppercase cursor-pointer mx-auto group"
            >
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform" /> Buka Undangan
            </button>
          </div>

          {/* Footer watermark */}
          <div className="relative z-10 pb-4 text-[10px] text-slate-400 font-bold tracking-widest text-center uppercase">
            CLEAN WHITE GEN-Z EDITION ✦ BINTARTI
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN SINGLE PAGE LANDING CONTENT (WHITE THEME & CASUAL GEN Z)
          ───────────────────────────────────────────────────────────────── */}
      {(isOpened || isClosingCover) && (
        <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen shadow-2xl relative border-x border-slate-200 pb-24 overflow-hidden">
          
          {/* Fixed Dynamic Background Crossfade Slideshow */}
          <div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center brightness-[0.95]"
              style={{ backgroundImage: `url('${bgPhotos[0]}')` }}
            />
            {galleryImages.map((src: string, idx: number) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform brightness-[0.95] ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 backdrop-blur-[1px]" />
          </div>

          {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            {isPro && (
              <button
              onClick={() => setShowQrModal(true)}
              className="w-12 h-12 rounded-full bg-white/95 text-slate-900 border border-slate-200 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              aria-label="QR Code Presensi"
              title="QR Code Presensi Tamu"
            >
              <QrCode className="w-5 h-5 text-slate-900 group-hover:text-amber-500 transition-colors" />
            </button>
            )}

            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-white/95 text-slate-900 border border-slate-200 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-5 h-5 text-slate-700 animate-bounce" />
              )}
            </button>
          </div>

          {/* 1. HERO HEADER SECTION (PURE WHITE & DYNAMIC SLIDESHOW) */}
          <section className="w-full min-h-[92dvh] flex flex-col items-center justify-between p-6 relative z-10">
            {/* Top Pill */}
            <div className="relative z-10 pt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-800 text-[10px] font-extrabold tracking-widest uppercase shadow-sm backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> CHAPTER 01: THE WEDDING
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase shadow-sm">
                SLIDE {currentBgIndex + 1}/4
              </span>
            </div>

            {/* Center Names Card */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto my-auto">
              {/* Polaroid Frame */}
              <div className="bg-white p-3 pb-6 rounded-2xl shadow-2xl border border-slate-200 max-w-[280px] w-full transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-slate-100">
                  <Image 
                    src={coverPhotoUrl}
                    alt={`${groomName} & ${brideName}`}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    MATCHED 100% 💖
                  </div>
                </div>
                <h2 className="text-3xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase">
                  {groomName} <span className="font-serif italic font-normal text-slate-400">&amp;</span> {brideName}
                </h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {akadDate}
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="relative z-10 pb-4 flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Scroll to Explore</span>
              <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
            </div>
          </section>

          {/* 2. HOLY VERSE / GEN Z QUOTE SECTION */}
          <section className="px-6 py-10 text-center relative bg-white">
            <ScrollReveal>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-3 relative overflow-hidden">
                <div className="absolute -top-3 -right-3 bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1.5 rounded-full rotate-12 shadow-sm border border-amber-200">
                  OUR VOWS ✨
                </div>
                <span className="text-xl font-serif text-slate-800 block font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                <p className="text-xs font-adea-lora text-slate-700 leading-relaxed italic">
                  “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
                </p>
                <div className="pt-2 flex justify-center items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>(Q.S. Ar-Rum: 21)</span>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 3. PROFIL MEMPELAI (GEN Z RELAXED STYLE) */}
          <section className="px-6 py-8 space-y-8 text-center bg-slate-50/50">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">MEET THE COUPLE</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Groom &amp; Bride</h2>
              </div>
            </ScrollReveal>

            {/* Groom Card (Kenzo) */}
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col items-center space-y-4 relative">
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  GROOM 🤵
                </div>
                <div className="relative w-44 h-52 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md">
                  <Image 
                    src={groomPhoto}
                    alt={groomFullName}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase">{groomFullName}</h3>
                  <p className="text-xs font-adea-lora text-slate-500 italic">Putra dari {groomParents}</p>
                  {groomIg && (<a 
                    href={`https://instagram.com/${groomIg.replace("@", "")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"
                  >
                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> {groomIg}
                  </a>)}
                </div>
              </div>
            </ScrollReveal>

            {/* Ampersand Badge */}
            <ScrollReveal delay={250}>
              <div className="flex justify-center items-center my-2">
                <span className="w-12 h-12 rounded-full bg-slate-900 text-white font-serif font-bold flex items-center justify-center text-xl shadow-xl border-4 border-white">
                  &amp;
                </span>
              </div>
            </ScrollReveal>

            {/* Bride Card (Valerie) */}
            <ScrollReveal delay={350}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col items-center space-y-4 relative">
                <div className="absolute top-4 right-4 bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  BRIDE 👰
                </div>
                <div className="relative w-44 h-52 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md">
                  <Image 
                    src={bridePhoto}
                    alt={brideFullName}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-adea-forum font-bold text-slate-900 tracking-wider uppercase">{brideFullName}</h3>
                  <p className="text-xs font-adea-lora text-slate-500 italic">Putri dari {brideParents}</p>
                  {brideIg && (<a 
                    href={`https://instagram.com/${brideIg.replace("@", "")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 mt-2 hover:bg-slate-200 transition-all"
                  >
                    <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> {brideIg}
                  </a>)}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 4. OUR STORY TIMELINE (GEN Z CASUAL & FUN) */}
          <section className="px-6 py-10 space-y-6 text-center bg-white">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">HOW IT STARTED</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Our Love Story 💖</h2>
              </div>
            </ScrollReveal>

            <div className="space-y-3.5 text-left">
              {(loveStoryItems.length > 0 ? loveStoryItems : [
                { year: "2022", badge: "FIRST EYE CONTACT ☕", title: "Tak Sengaja Ketemu", desc: "Pertama kali ketemu di coffee shop aesthetic di Senopati, saling lirik lalu tukeran Instagram." },
                { year: "2023", badge: "OFFICIALLY DATING ⚡", title: "Resmi Pacaran", desc: "Satu tahun nongkrong bareng, baru sadar kita klop banget. Akhirnya jadian di akhir tahun!" },
                { year: "2025", badge: "SHE SAID YES! 💍", title: "Momen Lamaran", desc: "Dimas kejutan lamaran pas sunset trip di Bali. She said YES tanpa ragu!" },
                { year: "2026", badge: "THE BIG DAY 💒", title: "Menikah!", desc: "Momen spesial mengikat janji suci dan memulai perjalanan keluarga kecil bahagia kami." }
              ]).map((item: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 120}>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-extrabold text-[10px]">
                        {item.year || item.tahun}
                      </span>
                      {item.badge && (<span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>)}
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{item.title || item.judul}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc || item.description || item.cerita}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* 5. RANGKAIAN ACARA (AKAD & RESEPSI - PURE WHITE CARDS) */}
          <section className="px-6 py-10 space-y-6 text-center bg-slate-50/50">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">SAVE THE DATE</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Waktu &amp; Tempat</h2>
              </div>
            </ScrollReveal>

            {/* Akad Nikah */}
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 text-center relative overflow-hidden">
                <div className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-black tracking-wider uppercase">
                  AKAD NIKAH 🕌
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-slate-900 text-sm font-extrabold">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <span>{akadDate}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{akadTime}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{akadLocation}</span>
                  </div>
                </div>

                <a 
                  href={akadMap} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi Pernikahan */}
            <ScrollReveal delay={300}>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 text-center relative overflow-hidden">
                <div className="inline-block px-4 py-1 rounded-full bg-amber-500 text-white text-xs font-black tracking-wider uppercase">
                  PARTY &amp; RESEPSI 🎊
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-slate-900 text-sm font-extrabold">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <span>{resepsiDate}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{resepsiTime}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{resepsiLocation}</span>
                  </div>
                </div>

                <a 
                  href={resepsiMap} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
                </a>
              </div>
            </ScrollReveal>
          </section>

          {/* 6. COUNTDOWN TIMER & CALENDAR */}
          <section className="px-6 py-8 text-center space-y-6 bg-white">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">COUNTDOWN</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Countdown Hari Bahagia</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                {[
                  { val: timeLeft.days, label: "HARI" },
                  { val: timeLeft.hours, label: "JAM" },
                  { val: timeLeft.minutes, label: "MENIT" },
                  { val: timeLeft.seconds, label: "DETIK" }
                ].map((t, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200/90 rounded-2xl py-3 px-2 text-center shadow-md">
                    <span className="block text-2xl font-black text-slate-900 leading-none">{t.val}</span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block mt-1">{t.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <button
                onClick={() => {
                  const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Pernikahan ${groomName} & ${brideName}\nLOCATION:${resepsiLocation}, ${resepsiAddress}\nEND:VEVENT\nEND:VCALENDAR`;
                  const blob = new Blob([icsData], { type: "text/calendar" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Pernikahan_${groomName}_${brideName}.ics`;
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-700" /> Simpan Ke Kalender (.ics)
              </button>
            </ScrollReveal>
          </section>

          {/* 7. QR CODE TAMU UNDANGAN PRESENSI */}
          {isPro && (
          <section id="qrcode-section" className="px-6 py-8 text-center space-y-4 bg-slate-50/50">
            <ScrollReveal>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">PRESENSI DIGITAL</span>
                  <h3 className="text-2xl font-adea-forum text-slate-900 tracking-wider uppercase font-bold">QR Code Tamu Undangan</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                    alt="QR Code Tamu"
                    className="w-44 h-44 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-slate-200 text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-900 tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <span className="text-sm font-extrabold text-slate-900 block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Tunjukkan QR Code ini kepada petugas meja penerima tamu untuk konfirmasi presensi kehadiran.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </section>
          )}

          {/* 8. PHOTO GALLERY & LIGHTBOX (GEN Z POLAROID GRID) */}
          <section className="px-6 py-10 space-y-6 text-center bg-white">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">GALLERY ERA</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Our Gallery 📸</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-12 gap-1 sm:gap-2">
              {galleryImages.map((src: string, idx: number) => {
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
                  <ScrollReveal delay={idx * 80} className="w-full h-full">
                    <div 
                      onClick={() => setSelectedImage(src)}
                      className={`relative w-full ${aspectClass} rounded-3xl overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all`}
                    >
                      <Image 
                        src={src} 
                        alt={`Prewedding Gen Z ${idx+1}`} 
                        fill 
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[10px] font-bold text-slate-900 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] backdrop-blur-sm">
                          🔍 Perbesar
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
                );
              })}
            </div>

            {youtubeVideo && (
              <ScrollReveal delay={250}>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-black mt-4">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    src={(() => {
                      const baseSrc = `https://www.youtube.com/embed/${youtubeVideo.split('v=')[1]?.split('&')[0] || youtubeVideo.split('youtu.be/')[1]?.split('?')[0] || youtubeVideo}`;
                      return baseSrc.includes('?') ? `${baseSrc}&enablejsapi=1` : `${baseSrc}?enablejsapi=1`;
                    })()}
                    title="Prewedding Video"
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
                className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
              >
                <div className="relative max-w-lg w-full max-h-[85vh] aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
                  <Image 
                    src={selectedImage} 
                    alt="Prewedding Full" 
                    fill 
                    className="object-contain" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-slate-900 text-white rounded-full p-2 border border-slate-700 hover:bg-black transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 9. WEDDING GIFT / AMPLOP DIGITAL (PURE WHITE CARD & COPY TOAST) */}
          <section className="px-6 py-10 space-y-6 text-center bg-slate-50/50">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">DIGITAL GIFT</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Wedding Gift 🎁</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
                Doa restu Anda adalah hadiah terindah bagi kami. Namun jika ingin memberi kado digital, dapat ditransfer melalui:
              </p>
            </ScrollReveal>

            <div className="space-y-3.5 text-left">
              {bankAccounts.map((bank: any, idx: number) => (
                <ScrollReveal delay={200 + (idx * 50)} key={idx}>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 text-left space-y-3 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-slate-900">{bank.bankName || bank.bank || bank.bank_name || bank.id || "BANK"}</span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">TRANSFER</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 font-medium">Nomor Rekening / No. HP:</span>
                      <span className="text-base font-black text-slate-900 tracking-wider">{bank.accountNumber || bank.accNumber || bank.no_rekening || bank.account_number || bank.account}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-600 font-bold">a.n. {bank.recipientName || bank.name || bank.nama_pemilik || bank.account_name}</span>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber || bank.accNumber || bank.no_rekening || bank.account_number || bank.account, bank.bankName || bank.bank || bank.bank_name || bank.id || idx.toString())}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                      >
                        {copiedBank === (bank.bankName || bank.bank || bank.bank_name || bank.id || idx.toString()) ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedBank === (bank.bankName || bank.bank || bank.bank_name || bank.id || idx.toString()) ? "Tersalin!" : "Salin No. Rek"}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* 10. RSVP & WISHES GUESTBOOK FEED */}
          <section className="px-6 py-10 space-y-6 text-center bg-white">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">RSVP &amp; GUESTBOOK</span>
                <h2 className="text-3xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">RSVP &amp; Ucapan 💬</h2>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={150}>
              <form onSubmit={handleSubmitRSVP} className="bg-slate-50 p-5 rounded-3xl border border-slate-200/90 text-left space-y-4 shadow-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anda / Inisial</label>
                  <input 
                    type="text" 
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Contoh: Keanu & Anya" 
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Tamu</label>
                  <select 
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3+ Orang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kehadiran</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Hadir" 
                        checked={rsvpStatus === "Hadir"} 
                        onChange={() => setRsvpStatus("Hadir")} 
                        className="accent-slate-900" 
                      /> Hadir ✨
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Tidak Hadir" 
                        checked={rsvpStatus === "Tidak Hadir"} 
                        onChange={() => setRsvpStatus("Tidak Hadir")} 
                        className="accent-slate-900" 
                      /> Halangan / Absen 😔
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pesan &amp; Doa Restu</label>
                  <textarea 
                    rows={3} 
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tulis ucapan terbaikmu untuk Kenzo & Valerie..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-900 resize-none shadow-sm"
                  />
                </div>
                <div className="flex justify-center w-full overflow-hidden my-2">
                  <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                    onSuccess={(token) => setTurnstileToken(token)} 
                  />
                </div>

                <button type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Sending..." : "Kirim RSVP & Ucapan"}
                </button>

                {submitSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center font-bold">
                    Terima kasih! Pesan dan konfirmasi kehadiran kamu udah tersimpan ✨
                  </div>
                )}
              </form>
            </ScrollReveal>

            {/* Comments feed */}
            <ScrollReveal delay={250}>
              <div className="space-y-3 text-left">
                <h3 className="text-sm font-black text-slate-900">Buku Ucapan ({comments.length})</h3>
                <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                  {comments.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 space-y-1 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900">{item.name}</span>
                        <span className="text-[9px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold">{item.attendance}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 11. CLOSING SECTION */}
          <section className="px-6 py-12 text-center space-y-6 bg-slate-50/50">
            <ScrollReveal>
              <div className="space-y-2">
                <h2 className="text-4xl font-adea-forum text-slate-900 tracking-widest uppercase font-bold">Terima Kasih</h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
                  Merupakan kebahagiaan tak terhingga bagi kami atas kehadiran dan doa restu sahabat &amp; keluarga tercinta.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="pt-4 border-t border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">WE CAN'T WAIT TO CELEBRATE WITH YOU</span>
                <h3 className="text-3xl font-adea-forum text-slate-900 tracking-wider uppercase font-bold">{groomName} &amp; {brideName}</h3>
                <p className="text-[10px] text-slate-500 pt-1 font-medium">Beserta Keluarga Besar Kedua Mempelai</p>
              </div>
            </ScrollReveal>
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
              className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl max-w-xs w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-amber-600 tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                  <h3 className="text-xl font-adea-forum font-bold text-slate-900 uppercase">QR Code Tamu</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                    alt="QR Code Presensi"
                    className="w-48 h-48 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-slate-200 text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-900 tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-900 block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-[11px] text-slate-600 leading-snug">
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
