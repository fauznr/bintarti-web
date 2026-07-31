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
  UserCheck, 
  Send, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Gift, 
  Video, 
  Camera,
  QrCode,
  Scan,
  X
} from "lucide-react";

interface Wedding1ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// Multi-variant ScrollReveal for Wedding 1 (Triggers on Scroll for Every Section)
const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  variant = "fade-up"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "slide-left" | "slide-right" | "zoom-in" | "drop";
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

  const hiddenStyles: Record<string, React.CSSProperties> = {
    "fade-up":    { opacity: 0, transform: "translateY(32px)" },
    "slide-left": { opacity: 0, transform: "translateX(-36px)" },
    "slide-right":{ opacity: 0, transform: "translateX(36px)" },
    "zoom-in":    { opacity: 0, transform: "scale(0.9)" },
    "drop":       { opacity: 0, transform: "translateY(-32px)" },
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "0.85s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
        ...(isVisible ? { opacity: 1, transform: "none" } : hiddenStyles[variant || "fade-up"]),
      }}
    >
      {children}
    </div>
  );
};

export default function Wedding1View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-1"
}: Wedding1ViewProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form & Comments State
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at: string }>>([
    {
      name: "Bapak H. Hendra Pratama",
      attendance: "Hadir",
      message: "Selamat untuk Fathir & Zahra! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      created_at: "Baru saja"
    },
    {
      name: "Drs. Budi Santoso",
      attendance: "Hadir",
      message: "Selamat menempuh hidup baru. Semoga berbahagia selalu hingga akhir hayat.",
      created_at: "1 jam yang lalu"
    },
    {
      name: "Natasha Salsabila",
      attendance: "Hadir",
      message: "Happy Wedding Fathir & Zahra! Cantik dan ganteng banget, bahagia selalu ya!",
      created_at: "3 jam yang lalu"
    }
  ]);

  // Background Photos Slideshow List (Cinematic Moody Warm Film Images)
  const bgPhotos = [
    "/wedding-moody-bg1.jpg",
    "/wedding-moody-bg2.jpg",
    "/wedding-moody-bg3.jpg",
    "/wedding-moody-bg4.jpg"
  ];

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
    const targetDate = new Date("2026-10-25T10:00:00").getTime();

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

  // Selected Lightbox state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // High quality Cinematic Moody gallery images with warm subtle colors
  const galleryImages = [
    "/wedding-moody-bg1.jpg",
    "/wedding-moody-bg2.jpg",
    "/wedding-moody-bg3.jpg",
    "/wedding-moody-bg4.jpg",
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg4.jpg"
  ];

  const instagramSvg = (
    <svg className="w-3 h-3 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-zinc-100 font-serif relative overflow-x-hidden">
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"} 
      />

      {/* ─────────────────────────────────────────────────────────────────
          COVER / LOCK SCREEN OVERLAY (MONOCHROME BLACK & WHITE)
          ───────────────────────────────────────────────────────────────── */}
      {(!isOpened || isClosingCover) && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-black text-center select-none overflow-hidden transition-all duration-700 ease-in-out ${
          isClosingCover ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
        }`}>
          {/* Background image with high contrast B&W overlay */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Permanent base image layer to guarantee ZERO black flashes */}
            <div 
              className="absolute inset-0 bg-cover bg-center saturate-[0.9] contrast-[1.05] brightness-[0.85]"
              style={{ backgroundImage: `url('/wedding-moody-bg1.jpg')` }}
            />
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform saturate-[0.9] contrast-[1.05] brightness-[0.85] ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

          {/* Content */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto">
            <div className="w-full flex justify-center text-center">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/70 backdrop-blur-md border border-zinc-700 backdrop-blur-md mx-auto shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] text-zinc-200 uppercase text-center">The Wedding of</span>
              </div>
            </div>

            <h1 className="w-full text-center text-4xl sm:text-5xl font-serif text-white font-bold tracking-tight filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
              Fathir &amp; Zahra
            </h1>

            <p className="w-full text-center text-xs font-sans font-medium tracking-[0.2em] text-zinc-300 uppercase">
              Sabtu, 25 Oktober 2026
            </p>

            <div className="w-full pt-4 border-t border-zinc-800 space-y-2">
              <span className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest block text-center">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
              <div className="bg-zinc-950/70 backdrop-blur-md backdrop-blur-md py-2.5 px-5 rounded-xl border border-zinc-700 shadow-xl inline-block max-w-[240px] text-center mx-auto">
                <span className="text-sm font-sans font-extrabold text-zinc-100 block truncate">
                  {guestName}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="mt-4 px-8 py-3.5 rounded-full bg-white text-zinc-950 font-sans font-black text-xs tracking-widest shadow-2xl hover:bg-zinc-200 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-300 uppercase cursor-pointer mx-auto"
            >
              <Heart className="w-4 h-4 fill-zinc-950" /> Buka Undangan
            </button>
          </div>

          <div className="relative z-10 pb-4 text-[10px] font-sans text-zinc-500 tracking-wider text-center uppercase">
            bevitation.com / bintarti.store
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN SINGLE PAGE LANDING CONTENT (MONOCHROME B&W THEME)
          ───────────────────────────────────────────────────────────────── */}
      {(isOpened || isClosingCover) && (
        <div className="w-full max-w-[430px] mx-auto bg-[#0D0B0A] min-h-screen shadow-2xl relative border-x border-zinc-800 pb-24 overflow-hidden">
          {/* Fixed Dynamic Background Crossfade Slideshow */}
          <div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            {/* Permanent base image layer to guarantee ZERO black flashes */}
            <div 
              className="absolute inset-0 bg-cover bg-center saturate-[0.9] contrast-[1.05] brightness-[0.75]"
              style={{ backgroundImage: `url('/wedding-moody-bg1.jpg')` }}
            />
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform saturate-[0.9] contrast-[1.05] brightness-[0.75] ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0D0B0A]/90" />
          </div>
          
          {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="w-12 h-12 rounded-full bg-zinc-950/85 text-white border border-zinc-700 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              aria-label="QR Code Presensi"
              title="QR Code Presensi Tamu"
            >
              <QrCode className="w-5 h-5 text-white group-hover:text-amber-300 transition-colors" />
            </button>

            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-zinc-950/85 text-white border border-zinc-700 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-5 h-5 text-zinc-300 animate-bounce" />
              )}
            </button>
          </div>

          {/* 1. HERO HEADER (MONOCHROME B&W) */}
          <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 relative bg-transparent z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-[#0D0B0A]" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center space-y-5 my-auto max-w-sm mx-auto">
              <div className="w-full flex justify-center text-center">
                <span className="inline-block text-[11px] font-sans tracking-[0.3em] font-extrabold uppercase text-zinc-200 bg-zinc-950/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-700 backdrop-blur-md text-center mx-auto shadow-md">
                  The Wedding of
                </span>
              </div>
              
              <h1 className="w-full text-center text-4xl sm:text-5xl font-serif text-white font-bold tracking-tight filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
                Fathir &amp; Zahra
              </h1>

              <p className="w-full text-center text-xs font-sans text-zinc-300 font-semibold tracking-widest uppercase">
                Sabtu, 25 Januari 2026
              </p>

              <div className="w-full flex justify-center pt-8">
                <ChevronDown className="w-6 h-6 text-zinc-400 animate-bounce opacity-80" />
              </div>
            </div>
          </section>

          {/* 2. HOLY VERSE SECTION */}
          <section className="px-6 py-10 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="zoom-in">
              <div className="bg-zinc-950/70 backdrop-blur-md backdrop-blur-md p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
                <span className="text-xl font-serif text-zinc-100 block font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                <p className="text-xs font-serif text-zinc-300 leading-relaxed italic">
                  “Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
                </p>
                <span className="block font-sans font-extrabold text-[10px] text-zinc-400 uppercase tracking-widest pt-1">
                  (Q.S. Ar-Rum: 21)
                </span>
              </div>
            </ScrollReveal>
          </section>

          {/* 3. PROFIL MEMPELAI (MONOCHROME INDONESIAN COUPLE) */}
          <section className="px-6 py-10 space-y-8 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="drop">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Pasangan Mempelai</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Mempelai Pria &amp; Wanita</h2>
              </div>
            </ScrollReveal>

            {/* Groom Card */}
            <ScrollReveal delay={150} variant="slide-left">
              <div className="bg-zinc-950/70 backdrop-blur-md rounded-3xl p-5 border border-zinc-800 shadow-xl flex flex-col items-center space-y-4">
                <div className="relative w-44 h-56 rounded-2xl overflow-hidden border border-zinc-700 shadow-lg saturate-[0.9] contrast-[1.05]">
                  <Image 
                    src="/wedding-moody-bg2.jpg"
                    alt="Yoshua Pratama"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif font-bold text-white">Fathir Alfarisi, S.T.</h3>
                  <p className="text-xs font-sans text-zinc-400">Putra dari Bapak H. Syamsudin &amp; Ibu Hj. Maimunah</p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-sans font-extrabold text-zinc-200 bg-zinc-800 px-3.5 py-1 rounded-full border border-zinc-700 mt-2 hover:bg-zinc-700 transition-all"
                  >
                    {instagramSvg} @fathir_alfarisi
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Monochrome Divider */}
            <ScrollReveal delay={250} variant="zoom-in">
              <div className="flex justify-center items-center my-2">
                <span className="w-10 h-10 rounded-full bg-white text-zinc-950 font-serif font-bold flex items-center justify-center text-lg shadow-lg border-2 border-zinc-900">
                  &amp;
                </span>
              </div>
            </ScrollReveal>

            {/* Bride Card */}
            <ScrollReveal delay={350} variant="slide-right">
              <div className="bg-zinc-950/70 backdrop-blur-md rounded-3xl p-5 border border-zinc-800 shadow-xl flex flex-col items-center space-y-4">
                <div className="relative w-44 h-56 rounded-2xl overflow-hidden border border-zinc-700 shadow-lg saturate-[0.9] contrast-[1.05]">
                  <Image 
                    src="/wedding-moody-bg3.jpg"
                    alt="Jessica Salsabila"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif font-bold text-white">Zahra Aurelia, S.Ked.</h3>
                  <p className="text-xs font-sans text-zinc-400">Putri dari Bapak Ir. H. Gunawan &amp; Ibu Hj. Rosalina</p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-sans font-extrabold text-zinc-200 bg-zinc-800 px-3.5 py-1 rounded-full border border-zinc-700 mt-2 hover:bg-zinc-700 transition-all"
                  >
                    {instagramSvg} @zahra_aurelia
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 4. OUR STORY TIMELINE */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="slide-left">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Perjalanan Cinta</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Our Story</h2>
              </div>
            </ScrollReveal>

            <div className="space-y-4 text-left font-sans">
              {[
                { year: "2021", title: "Awal Bertemu", desc: "Pertama kali kami dipertemukan di bangku perkuliahan dan mulai saling mengenal satu sama lain." },
                { year: "2023", title: "Menjalin Hubungan", desc: "Setelah menjalin komunikasi yang intens, kami memutuskan untuk berkomitmen melangkah bersama." },
                { year: "2025", title: "Momen Lamaran", desc: "Dengan restu kedua orang tua, kami mengikat janji suci dalam prosesi lamaran keluarga." },
                { year: "2026", title: "Pernikahan Suci", desc: "Momen sakral saat kami mengikat janji suci pernikahan untuk membina rumah tangga bahagia." }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 150} variant={idx % 2 === 0 ? "slide-left" : "slide-right"}>
                  <div className="bg-zinc-950/65 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 flex gap-4 items-start shadow-md">
                    <div className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 font-extrabold text-xs shrink-0">
                      {item.year}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-serif">{item.title}</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* 5. ACARA (AKAD & RESEPSI) */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="slide-right">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Acara Utama</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Rangkaian Acara</h2>
              </div>
            </ScrollReveal>

            {/* Akad Nikah */}
            <ScrollReveal delay={150} variant="slide-right">
              <div className="bg-zinc-950/70 backdrop-blur-md rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-extrabold text-zinc-400 tracking-[0.2em] uppercase">Prosesi Sakral</span>
                  <h3 className="text-xl font-serif text-white font-bold">Akad Nikah</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-zinc-200 text-sm font-sans font-bold">
                    <Calendar className="w-4 h-4 text-zinc-300" />
                    <span>Sabtu, 25 Oktober 2026</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-zinc-300 text-xs font-sans font-semibold">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>10:00 WIB - Selesai</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-zinc-300 text-xs font-sans font-semibold">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>Gedung Serbaguna Bandung</span>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 font-sans font-black text-xs uppercase tracking-wider shadow-md hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Lihat Lokasi Google Maps
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi */}
            <ScrollReveal delay={300} variant="slide-left">
              <div className="bg-zinc-950/70 backdrop-blur-md rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-extrabold text-zinc-400 tracking-[0.2em] uppercase">Perayaan Momen</span>
                  <h3 className="text-xl font-serif text-white font-bold">Resepsi Pernikahan</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-zinc-200 text-sm font-sans font-bold">
                    <Calendar className="w-4 h-4 text-zinc-300" />
                    <span>Sabtu, 25 Oktober 2026</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-zinc-300 text-xs font-sans font-semibold">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>11:30 WIB - Selesai</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-zinc-300 text-xs font-sans font-semibold">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>Gedung Serbaguna Bandung</span>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 font-sans font-black text-xs uppercase tracking-wider shadow-md hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Lihat Lokasi Google Maps
                </a>
              </div>
            </ScrollReveal>
          </section>

          {/* 6. COUNTDOWN TIMER & CALENDAR */}
          <section className="px-6 py-10 text-center space-y-6 relative z-10 bg-transparent">
            <ScrollReveal variant="fade-up">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-extrabold text-white/90 tracking-[0.3em] uppercase block drop-shadow">
                  MENUNGGU HARI BAHAGIA
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Hitung Mundur Pernikahan
                </h2>
                <p className="text-xs font-sans text-zinc-200 leading-relaxed max-w-xs mx-auto drop-shadow">
                  Menghitung setiap detik menuju ikatan suci Fathir &amp; Zahra
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} variant="zoom-in">
              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                {[
                  { val: timeLeft.days, label: "HARI" },
                  { val: timeLeft.hours, label: "JAM" },
                  { val: timeLeft.minutes, label: "MENIT" },
                  { val: timeLeft.seconds, label: "DETIK" }
                ].map((t, i) => (
                  <div key={i} className="bg-zinc-950/85 backdrop-blur-md border border-zinc-700/80 rounded-2xl py-3 px-2 text-center shadow-xl">
                    <span className="block text-2xl font-sans font-extrabold text-white tracking-tight">{t.val}</span>
                    <span className="text-[10px] font-sans font-extrabold text-white uppercase block mt-1 tracking-wider">{t.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250} variant="fade-up">
              <button
                onClick={() => {
                  const icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Pernikahan Fathir & Zahra\nLOCATION:Gedung Serbaguna Bandung\nEND:VEVENT\nEND:VCALENDAR";
                  const blob = new Blob([icsData], { type: "text/calendar" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Pernikahan_Fathir_Zahra.ics";
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 text-zinc-100 border border-zinc-700 text-xs font-sans font-extrabold uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer shadow-md"
              >
                <Calendar className="w-3.5 h-3.5 text-white" /> Simpan di Kalender
              </button>
            </ScrollReveal>
          </section>

          {/* 7. QR CODE TAMU UNDANGAN */}
          <section id="qrcode-section" className="px-6 py-8 text-center space-y-4 relative z-10 bg-transparent">
            <ScrollReveal variant="zoom-in">
              <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4 max-w-sm mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">PRESENSI DIGITAL</span>
                  <h3 className="text-xl font-serif font-bold text-white drop-shadow">QR Code Tamu Undangan</h3>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border border-zinc-200">
                  {/* Standard HTML img for guaranteed rendering */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
                    alt="QR Code Tamu"
                    className="w-44 h-44 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-zinc-200 text-center">
                    <span className="text-[11px] font-mono font-bold text-zinc-800 tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <span className="text-sm font-serif font-bold text-white block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-xs font-sans text-zinc-300 leading-relaxed max-w-xs mx-auto">
                    Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi presensi kehadiran.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 8. PREWEDDING GALLERY (MONOCHROME B&W) */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="drop">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Galeri Foto</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Our Gallery</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((src, idx) => (
                <ScrollReveal key={idx} delay={idx * 80} variant="zoom-in">
                  <div 
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-lg group saturate-[0.9] contrast-[1.05] cursor-pointer hover:border-zinc-500 transition-all"
                  >
                    <Image 
                      src={src} 
                      alt={`Prewedding ${idx+1}`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[10px] font-sans font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        🔍 Perbesar
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* YouTube Prewedding Video Embed Below Photos */}
            <ScrollReveal delay={250} variant="fade-up">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-xl bg-black">
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/5qap5aO4i9A?rel=0"
                  title="Cinematic Prewedding Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
              >
                <div className="relative max-w-lg w-full max-h-[85vh] aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl saturate-[0.9] contrast-[1.05]">
                  <Image 
                    src={selectedImage} 
                    alt="Prewedding Full" 
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

          {/* 9. WEDDING GIFT / AMPLOP DIGITAL */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10 bg-transparent">
            <ScrollReveal variant="slide-left">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Amplop Digital</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Wedding Gift</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100} variant="fade-up">
              <p className="text-xs font-sans text-zinc-100 leading-relaxed max-w-xs mx-auto font-medium drop-shadow">
                Tanpa mengurangi rasa hormat kami, bagi tamu undangan yang ingin memberikan hadiah dapat melalui rekening berikut:
              </p>
            </ScrollReveal>

            <div className="space-y-4 font-sans">
              {/* Bank Card 1 */}
              <ScrollReveal delay={200} variant="slide-left">
                <div className="bg-zinc-950/70 backdrop-blur-md p-5 rounded-3xl border border-zinc-800 text-left space-y-2 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-white tracking-widest">BANK BCA</span>
                    <Gift className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-400">Nomor Rekening:</span>
                    <span className="text-base font-extrabold text-white tracking-wider">1234 5678 90</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
                    <span className="text-xs text-zinc-300 font-medium">a.n. Fathir Alfarisi</span>
                    <button
                      onClick={() => copyToClipboard("1234567890", "bca")}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700 text-[10px] font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                    >
                      {copiedBank === "bca" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedBank === "bca" ? "Tersalin!" : "Salin Rekening"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Bank Card 2 */}
              <ScrollReveal delay={300} variant="slide-right">
                <div className="bg-zinc-950/70 backdrop-blur-md p-5 rounded-3xl border border-zinc-800 text-left space-y-2 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-white tracking-widest">OVO / E-WALLET</span>
                    <Gift className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-400">Nomor E-Wallet:</span>
                    <span className="text-base font-extrabold text-white tracking-wider">0812 3456 7890</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
                    <span className="text-xs text-zinc-300 font-medium">a.n. Zahra Aurelia</span>
                    <button
                      onClick={() => copyToClipboard("081234567890", "ovo")}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700 text-[10px] font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                    >
                      {copiedBank === "ovo" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedBank === "ovo" ? "Tersalin!" : "Salin E-Wallet"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* 10. RSVP & WISHES */}
          <section className="px-6 py-10 space-y-6 text-center font-sans relative z-10 bg-transparent">
            <ScrollReveal variant="fade-up">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-extrabold text-white/80 tracking-[0.25em] uppercase drop-shadow">Konfirmasi Kehadiran</span>
                <h2 className="text-2xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">RSVP &amp; Ucapan</h2>
              </div>
            </ScrollReveal>

            {/* RSVP Form */}
            <ScrollReveal delay={150} variant="slide-right">
              <form onSubmit={handleSubmitRSVP} className="bg-zinc-950/70 backdrop-blur-md p-6 rounded-3xl border border-zinc-800 text-left space-y-4 shadow-xl">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Masukkan Nama Anda" 
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black border border-zinc-700 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Jumlah Tamu</label>
                  <select 
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black border border-zinc-700 text-white focus:outline-none focus:border-white"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3+ Orang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Konfirmasi Kehadiran</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Hadir" 
                        checked={rsvpStatus === "Hadir"} 
                        onChange={() => setRsvpStatus("Hadir")} 
                        className="accent-white" 
                      /> Hadir
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Tidak Hadir" 
                        checked={rsvpStatus === "Tidak Hadir"} 
                        onChange={() => setRsvpStatus("Tidak Hadir")} 
                        className="accent-white" 
                      /> Halangan / Tidak Hadir
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Pesan & Doa Restu</label>
                  <textarea 
                    rows={3} 
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan pesan & doa Anda untuk kedua mempelai..."
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black border border-zinc-700 text-white focus:outline-none focus:border-white resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-white text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Sending..." : "Kirim Ucapan & RSVP"}
                </button>

                {submitSuccess && (
                  <div className="p-3 bg-zinc-800 border border-zinc-600 rounded-xl text-zinc-200 text-xs text-center font-bold">
                    Terima kasih! Pesan dan konfirmasi kehadiran Anda telah tersimpan.
                  </div>
                )}
              </form>
            </ScrollReveal>

            {/* Wishes Feed */}
            <ScrollReveal delay={250} variant="fade-up">
              <div className="space-y-3 text-left">
                <h3 className="text-sm font-serif font-bold text-white drop-shadow">Buku Ucapan ({comments.length})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  {comments.map((item, index) => (
                    <div key={index} className="bg-zinc-950/65 backdrop-blur-md p-3.5 rounded-2xl border border-zinc-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-zinc-200">{item.name}</span>
                        <span className="text-[9px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">{item.attendance}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 11. CLOSING */}
          <section className="px-6 py-12 text-center space-y-6 relative z-10 bg-transparent">
            <ScrollReveal variant="zoom-in">
              <div className="space-y-3">
                <p className="text-xs font-sans text-zinc-200 leading-relaxed max-w-xs mx-auto drop-shadow">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} variant="drop">
              <div className="space-y-1">
                <span className="text-[10px] font-sans text-white/80 font-extrabold uppercase tracking-widest block drop-shadow">Kami yang berbahagia</span>
                <h3 className="text-xl font-serif text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Fathir &amp; Zahra</h3>
                <p className="text-[10px] font-sans text-zinc-300 pt-2 drop-shadow">Beserta Keluarga Besar Kedua Mempelai</p>
              </div>
            </ScrollReveal>
          </section>

          {/* QR Code Fullscreen Modal */}
          {showQrModal && (
            <div 
              onClick={() => setShowQrModal(false)}
              className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className="relative bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl max-w-xs w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-sans font-extrabold text-amber-400 tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                  <h3 className="text-lg font-serif font-bold text-white">QR Code Tamu</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border border-zinc-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
                    alt="QR Code Presensi"
                    className="w-48 h-48 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-zinc-200 text-center">
                    <span className="text-[11px] font-mono font-bold text-zinc-800 tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-[11px] text-zinc-400 leading-snug">
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
