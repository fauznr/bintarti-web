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
  variant?: "fade-up" | "slide-left" | "slide-right" | "float-up" | "spin-fade" | "drop";
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
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract custom or fallback invitation data
  const groomName = invitationData?.nickname || invitationData?.groom_name || "Bagas";
  const groomFullName = invitationData?.full_name || "Bagas Wicaksono, M.B.A.";
  const groomParents = invitationData?.parents_name || "Bapak Dr. H. Hartono & Ibu Hj. Endang Sulastri";
  
  const brideName = invitationData?.bride_nickname || invitationData?.bride_name || "Bella";
  const brideFullName = invitationData?.bride_full_name || "Cinta Bella, S.Kom.";
  const brideParents = invitationData?.bride_parents || "Bapak Ir. H. Prabowo & Ibu Hj. Kusuma";

  const eventDateStr = invitationData?.event_date || "Selasa, 24 Desember 2026";
  const eventTimeStr = invitationData?.event_time || "08.00 WIB";
  const eventLocation = invitationData?.event_location || "Plataran Heritage Borobudur, Magelang";
  const mapsLink = invitationData?.maps_link || "https://maps.google.com";

  // Gallery Photos
  const galleryPhotos = [
    "/saferia_outdoor_hero.jpg",
    "/saferia_groom_portrait.jpg",
    "/saferia_bride_portrait.jpg",
    "/saferia_nature_couple.jpg",
    "/youth_wedding_hero_1784891997233.jpg",
    "/youth_couple_story_1784892037116.jpg"
  ];

  // RSVP Form State
  const [formName, setFormName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [formAttendance, setFormAttendance] = useState("Hadir");
  const [formPax, setFormPax] = useState("1");
  const [formWish, setFormWish] = useState("");
  const [comments, setComments] = useState<Array<{ name: string; attendance: string; pax: string; wish: string; date: string }>>([
    {
      name: "Budi & Keluarga",
      attendance: "Hadir",
      pax: "2",
      wish: "Selamat untuk Bagas & Bella! Semoga pernikahan ini diberkahi kebahagiaan dan kehangatan selamanya.",
      date: "2 jam yang lalu"
    },
    {
      name: "Siti Rahma",
      attendance: "Hadir",
      pax: "1",
      wish: "Happy Wedding Bagas & Bella! Lancar sampai hari H dan senantiasa rukun bahagia.",
      date: "5 jam yang lalu"
    }
  ]);
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

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formWish.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setComments([
        {
          name: formName,
          attendance: formAttendance,
          pax: formPax,
          wish: formWish,
          date: "Baru saja"
        },
        ...comments
      ]);
      setFormWish("");
      setIsSubmitting(false);
    }, 600);
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
        src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}
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
              src="/saferia_outdoor_hero.jpg"
              alt="Cover Background Photo"
              fill
              className="object-cover object-center opacity-95 filter brightness-95"
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
            <button
              onClick={() => setShowQrModal(true)}
              className="w-11 h-11 bg-[#2C1A14] text-[#FAF7F2] border border-[#2C1A14]/40 shadow-xl flex items-center justify-center hover:bg-black transition-all cursor-pointer group"
              aria-label="QR Code Presensi"
              title="QR Code Presensi Tamu"
            >
              <QrCode className="w-5 h-5 text-[#FAF7F2] group-hover:text-amber-200 transition-colors" />
            </button>

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
              src="/saferia_outdoor_hero.jpg"
              alt="Main Hero Background Photo"
              fill
              className="object-cover object-center opacity-95 filter brightness-95"
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
                {eventDateStr}
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
              src="/saferia_groom_portrait.jpg"
              alt="Groom Background Photo"
              fill
              className="object-cover object-top opacity-100 filter brightness-95"
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
              src="/saferia_bride_portrait.jpg"
              alt="Bride Background Photo"
              fill
              className="object-cover object-top opacity-100 filter brightness-95"
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
              src="/saferia_nature_couple.jpg"
              alt="Journey Background Photo"
              fill
              className="object-cover object-center opacity-95 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
          </div>

          <ScrollReveal>
            <div className="relative z-10 space-y-6 text-white">
              <h2 className="font-tenor text-sm sm:text-base text-white tracking-[0.25em] uppercase font-semibold drop-shadow-md">
                JOURNEY OF LOVE
              </h2>

              <div className="space-y-4 max-w-xs mx-auto text-left font-inter text-xs leading-relaxed text-slate-100">
                <div className="py-2.5 border-b border-white/20 space-y-1">
                  <h4 className="font-bold text-white font-tenor text-[11px] tracking-wider">Awal Bertemu</h4>
                  <p className="text-slate-200 font-light">Pertemuan pertama kami yang sederhana menumbuhkan rasa saling mengerti dan benih-benih cinta yang tulus.</p>
                </div>

                <div className="py-2.5 border-b border-white/20 space-y-1">
                  <h4 className="font-bold text-white font-tenor text-[11px] tracking-wider">Lamaran</h4>
                  <p className="text-slate-200 font-light">Di hadapan kedua keluarga besar, kami mengikrarkan niat suci untuk melangkah ke jenjang pernikahan.</p>
                </div>

                <div className="py-2.5 space-y-1">
                  <h4 className="font-bold text-white font-tenor text-[11px] tracking-wider">Menikah</h4>
                  <p className="text-slate-200 font-light">Hari bahagia tempat kami mengikat janji suci sehidup semati dalam iman, pengharapan, dan kasih.</p>
                </div>
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
                PEMBERKATAN
              </h2>

              <div className="space-y-0.5 font-inter text-xs text-[#2C1A14]">
                <p className="font-semibold text-sm">{eventDateStr}</p>
                <p className="text-[#2C1A14] font-medium">{eventTimeStr}</p>
              </div>

              <div className="space-y-1 font-inter text-xs">
                <MapPin className="w-4 h-4 mx-auto text-[#2C1A14]" />
                <p className="font-bold text-xs text-[#2C1A14]">{eventLocation}</p>
                <p className="text-[#2C1A14]/70 italic leading-relaxed font-light text-[11px]">
                  Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              <a
                href={mapsLink}
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
                <p className="font-semibold text-sm">{eventDateStr}</p>
                <p className="text-[#2C1A14] font-medium">11.00 WIB - Selesai</p>
              </div>

              <div className="space-y-1 font-inter text-xs">
                <MapPin className="w-4 h-4 mx-auto text-[#2C1A14]" />
                <p className="font-bold text-xs text-[#2C1A14]">{eventLocation}</p>
                <p className="text-[#2C1A14]/70 italic leading-relaxed font-light text-[11px]">
                  Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              <a
                href={mapsLink}
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
                href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Pernikahan ${groomName} & ${brideName}%0ADESCRIPTION:Pernikahan Suci ${groomName} & ${brideName}%0ALOCATION:${eventLocation}%0AEND:VEVENT%0AEND:VCALENDAR`}
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
        <section id="qrcode-section" className="py-16 px-6 text-center space-y-6 border-b border-[#2C1A14]/15 bg-white text-[#2C1A14]">
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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
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
        </section>

        {/* ======================================================== */}
        {/* SECTION 9: GALLERY & YOUTUBE PREWEDDING VIDEO            */}
        {/* ======================================================== */}
        <section className="py-16 px-6 text-center border-b border-[#2C1A14]/15 bg-[#FAF7F2]">
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="font-tenor text-base text-[#2C1A14] font-bold tracking-[0.2em] uppercase">
                OUR GALLERY
              </h2>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(photo)}
                    className="relative h-40 sm:h-48 rounded-none overflow-hidden border border-[#2C1A14]/20 shadow-sm cursor-pointer group"
                  >
                    <Image
                      src={photo}
                      alt={`Gallery Photo ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* YouTube Video Embed */}
              <div className="pt-2">
                <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-md border border-[#2C1A14]/30">
                  <iframe
                    src="https://www.youtube.com/embed/5qap5aO4i9A"
                    title="Prewedding Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
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

              {/* BANK MANDIRI */}
              <div className="py-3 border-b border-[#2C1A14]/20 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-tenor text-xs text-[#2C1A14]">BANK MANDIRI</span>
                  <Gift className="w-4 h-4 text-[#2C1A14]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#2C1A14]">1230009876543</p>
                  <p className="font-inter text-xs text-[#2C1A14]/70">a.n. Bagas Wicaksono</p>
                </div>
                <button
                  onClick={() => copyToClipboard("1230009876543", "mandiri")}
                  className="w-full py-1.5 border border-[#2C1A14]/60 bg-white hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] rounded-none text-[9px] font-tenor tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedBank === "mandiri" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBank === "mandiri" ? "TERSALIN!" : "SALIN REKENING"}</span>
                </button>
              </div>

              {/* BANK BCA */}
              <div className="py-3 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-tenor text-xs text-[#2C1A14]">BANK BCA</span>
                  <Gift className="w-4 h-4 text-[#2C1A14]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#2C1A14]">8870123456</p>
                  <p className="font-inter text-[#2C1A14]/70 text-xs">a.n. Cinta Bella</p>
                </div>
                <button
                  onClick={() => copyToClipboard("8870123456", "bca")}
                  className="w-full py-1.5 border border-[#2C1A14]/60 bg-white hover:bg-[#2C1A14] hover:text-white text-[#2C1A14] rounded-none text-[9px] font-tenor tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedBank === "bca" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBank === "bca" ? "TERSALIN!" : "SALIN REKENING"}</span>
                </button>
              </div>
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
              <form onSubmit={handleSubmitWish} className="space-y-3 font-inter text-xs py-3 border-y border-[#2C1A14]/20">
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 border border-[#2C1A14] bg-[#2C1A14] hover:bg-black text-white font-tenor text-[10px] tracking-widest rounded-none shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? "KIRIMKAN..." : "KIRIM KONFIRMASI"}</span>
                </button>
              </form>

              {/* Wishes List Feed */}
              <div className="space-y-3 font-inter text-xs">
                <h4 className="font-tenor text-xs text-[#2C1A14] tracking-wider font-bold text-center uppercase">
                  Doa & Ucapan Tamu ({comments.length})
                </h4>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                  {comments.map((item, idx) => (
                    <div key={idx} className="py-2.5 border-b border-[#2C1A14]/15 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C1A14] font-ovo text-sm">{item.name}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-none border ${
                          item.attendance === "Hadir" ? "border-emerald-600 text-emerald-800" : "border-rose-600 text-rose-800"
                        }`}>
                          {item.attendance} ({item.pax} pax)
                        </span>
                      </div>
                      <p className="text-[#2C1A14]/80 leading-relaxed font-light text-xs">{item.wish}</p>
                      <span className="text-[10px] text-[#2C1A14]/50 block">{item.date}</span>
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
              src="/saferia_nature_couple.jpg"
              alt="Closing Background Photo"
              fill
              className="object-cover object-center opacity-95 filter brightness-90"
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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
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
