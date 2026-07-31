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
  Music, 
  Send, 
  Video, 
  Sparkles,
  ChevronDown,
  Disc,
  QrCode,
  Scan,
  X
} from "lucide-react";

interface Wedding5ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// Scroll Reveal Component with customizable delay and animation
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
      }`}
    >
      {children}
    </div>
  );
}

export default function Wedding5View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-5"
}: Wedding5ViewProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background photos for dynamic crossfade slideshow
  const bgPhotos = [
    "/wedding5-hero.jpg",
    "/wedding5-couple1.jpg",
    "/wedding5-couple2.jpg",
    "/wedding5-couple3.jpg"
  ];

  // Auto-rotate background slideshow every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [bgPhotos.length]);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestName !== "Budi Setiawan" ? guestName : "");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at?: string }>>([
    {
      name: "Bambang & Family",
      attendance: "Hadir (2 Orang)",
      message: "Sugeng ngambah balewisma anyar kagem Farhan lan Nabila. Mugi dadi keluarga ingkang sakinah mawaddah warahmah.",
      created_at: "2 jam yang lalu"
    },
    {
      name: "Siti Nurbaya",
      attendance: "Hadir (1 Orang)",
      message: "Selamat ya Nabila & Mas Farhan! Lancar nganti dina H, senantiasa pinaringan berkah lan kabagyan.",
      created_at: "5 jam yang lalu"
    }
  ]);

  // Countdown timer target (22 November 2026)
  const targetDate = new Date("2026-11-22T08:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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

  // Lightbox State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Gallery photos
  const galleryImages = [
    "/wedding5-hero.jpg",
    "/wedding5-couple1.jpg",
    "/wedding5-groom.jpg",
    "/wedding5-bride.jpg",
    "/wedding5-couple2.jpg",
    "/wedding5-couple3.jpg"
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1E17] font-adea-montserrat relative overflow-x-hidden">
      {/* Google Fonts Links matching Javanese Minimalist Aesthetics (Forum + Lora + Montserrat) */}
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
        .javanese-arch-top {
          border-top-left-radius: 120px;
          border-top-right-radius: 120px;
        }
        .batik-pattern {
          background-color: #FAF6F0;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A2E1B' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M20 20c-5.523 0-10-4.477-10-10S14.477 0 20 0s10 4.477 10 10-4.477 10-10 10zm0 20c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zM0 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S0 25.523 0 20zm40 0c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"} 
      />

      {/* ─────────────────────────────────────────────────────────────────
          100% TRANSPARENT FROSTED COVER SCREEN (WITHOUT FRAMED PHOTO)
          ───────────────────────────────────────────────────────────────── */}
      {(!isOpened || isClosingCover) && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#1A120C] text-center select-none overflow-hidden transition-all duration-700 ease-in-out ${
          isClosingCover ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
        }`}>
          {/* Background image slideshow */}
          <div className="absolute inset-0 overflow-hidden opacity-45">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
          </div>

          {/* Transparent Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A120C]/80 via-[#1A120C]/75 to-[#1A120C]/90 backdrop-blur-[2px]" />

          {/* Content Box */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-6 max-w-sm px-4 w-full mx-auto">
            {/* Wax Seal Badge Accent */}
            <div className="bg-black/50 backdrop-blur-xl text-[#F5E6D3] rounded-full px-5 py-1.5 text-[9px] font-black tracking-widest uppercase border border-[#8C5D3B] shadow-2xl">
              ✦ WALIMATUL 'URSY ✦
            </div>

            {/* Names & Javanese Greeting */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-[#E6C294] tracking-[0.3em] uppercase block">PAWIWAHAN AGENG</span>
              <h1 className="text-4xl sm:text-5xl font-adea-forum font-bold text-[#FAF6F0] tracking-widest uppercase leading-none filter drop-shadow">
                Damar <span className="text-[#E6C294] font-adea-lora italic font-normal">&amp;</span> Sekar
              </h1>
              <p className="text-[11px] font-adea-lora text-[#E6D7C8] italic pt-1 font-medium">
                Sugeng Rawuh ing Pahargyan Pawiwahan Kula
              </p>
            </div>

            {/* Guest Invitation Pill */}
            <div className="w-full pt-2 space-y-1.5">
              <span className="text-[9px] font-bold text-[#D4C3B3] uppercase tracking-widest block">Katur Kagem Panjenengan:</span>
              <div className="bg-black/40 backdrop-blur-xl py-2.5 px-5 rounded-full border border-[#8C5D3B] shadow-2xl inline-block max-w-[260px]">
                <span className="text-sm font-extrabold text-[#FAF6F0] block truncate">
                  {guestName}
                </span>
              </div>
            </div>

            {/* 100% TRANSPARENT BUTTON */}
            <button
              onClick={handleOpenInvitation}
              className="mt-2 px-8 py-3.5 rounded-full bg-black/40 hover:bg-[#8C5D3B]/40 backdrop-blur-xl text-[#FAF6F0] font-black text-xs tracking-widest shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase cursor-pointer mx-auto group border-2 border-[#8C5D3B]"
            >
              <Heart className="w-4 h-4 fill-[#E6C294] text-[#E6C294] group-hover:scale-125 transition-transform" /> Buka Undangan
            </button>
          </div>

          <div className="relative z-10 pb-4 text-[9px] text-[#D4C3B3] font-bold tracking-widest text-center uppercase">
            BATIK KAWUNG ✦ TRANSPARENT GLASS EDITION
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN SINGLE PAGE LANDING CONTENT (COKLAT TUA HIGH CONTRAST)
          ───────────────────────────────────────────────────────────────── */}
      {(isOpened || isClosingCover) && (
        <div className="w-full max-w-[430px] mx-auto bg-[#FAF6F0] min-h-screen shadow-2xl relative border-x border-[#3E2312]/20 pb-24 overflow-hidden batik-pattern">
          
          {/* Fixed Dynamic Background Crossfade Slideshow */}
          <div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0 opacity-30">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform ${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                style={{ backgroundImage: `url('${src}')` }}
              />
            ))}
          </div>

          {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="w-12 h-12 rounded-full bg-[#3E2312] backdrop-blur-xl text-[#FAF6F0] border-2 border-[#5C3A21] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              aria-label="QR Code Presensi"
              title="QR Code Presensi Tamu"
            >
              <QrCode className="w-5 h-5 text-[#FAF6F0] group-hover:text-amber-300 transition-colors" />
            </button>

            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-[#3E2312]/90 backdrop-blur-xl text-[#FAF6F0] border-2 border-[#5C3A21] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-5 h-5 text-[#FAF6F0] animate-bounce" />
              )}
            </button>
          </div>



          {/* 1. HERO SECTION (HIGH CONTRAST COKLAT TUA TEXT) */}
          <section className="w-full min-h-[90dvh] flex flex-col items-center justify-between p-6 relative z-10">
            {/* Top Badge Pill */}
            <div className="relative z-10 pt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xl text-[#3E2312] border border-[#5C3A21]/60 text-[9px] font-black tracking-widest uppercase shadow-md">
                <Sparkles className="w-3 h-3 text-[#5C3A21]" /> PAWIWAHAN AGENG 2026
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/70 backdrop-blur-xl text-[#3E2312] border border-[#5C3A21]/60 text-[9px] font-black tracking-widest uppercase shadow-md">
                SLIDE {currentBgIndex + 1}/4
              </span>
            </div>

            {/* Central Arch Frame Showcase */}
            <div className="relative z-10 w-full flex flex-col items-center text-center space-y-4 my-auto">
              <div className="relative w-56 h-72 javanese-arch-top border-4 border-[#5C3A21] p-2 shadow-2xl bg-transparent backdrop-blur-md transform rotate-0 hover:rotate-1 transition-transform">
                <div className="relative w-full h-full javanese-arch-top overflow-hidden border border-[#3E2312]">
                  <Image 
                    src="/wedding5-hero.jpg"
                    alt="Damar & Sekar"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#211611]/90 to-transparent p-3 text-center">
                    <span className="text-[10px] font-extrabold text-[#FAF6F0] uppercase tracking-widest block">SUGENG RAWUH</span>
                  </div>
                </div>
              </div>

              {/* HIGH CONTRAST COKLAT TUA DATE & LOCATION TEXT */}
              <div className="space-y-1 pt-2">
                <h1 className="text-4xl sm:text-5xl font-adea-forum font-extrabold text-[#2A1E17] tracking-widest uppercase leading-none">
                  Farhan &amp; Nabila
                </h1>
                <p className="text-xs font-adea-montserrat font-extrabold text-[#3E2312] tracking-widest uppercase bg-[#FAF6F0]/80 px-3 py-1 rounded-full border border-[#5C3A21]/40 inline-block shadow-sm">
                  MINGGU, 22 NOVEMBER 2026 ✦ YOGYAKARTA
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="relative z-10 pb-2 flex flex-col items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#3E2312]">Scroll Down</span>
              <ChevronDown className="w-4 h-4 text-[#3E2312] animate-bounce" />
            </div>
          </section>

          {/* 2. HOLY VERSE SECTION */}
          <section className="px-6 py-8 text-center relative z-10">
            <ScrollReveal>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border-2 border-[#5C3A21]/40 shadow-lg space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#3E2312] text-[#FAF6F0] flex items-center justify-center mx-auto text-xs font-serif font-bold border-2 border-[#5C3A21]">
                  ❖
                </div>
                <span className="text-xl font-serif text-[#2A1E17] block font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                <p className="text-xs font-adea-lora text-[#3E2312] leading-relaxed italic font-medium">
                  “Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
                </p>
                <span className="text-[10px] font-extrabold text-[#3E2312] uppercase tracking-wider block">
                  (Q.S. Ar-Rum: 21)
                </span>
              </div>
            </ScrollReveal>
          </section>

          {/* 3. PROFIL MEMPELAI (HIGH CONTRAST COKLAT TUA) */}
          <section className="px-6 py-8 space-y-8 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">SANGSULAN TRESNA</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Groom &amp; Bride</h2>
              </div>
            </ScrollReveal>

            {/* Groom Card */}
            <ScrollReveal delay={150}>
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border-2 border-[#5C3A21]/40 shadow-xl flex flex-col items-center space-y-4 relative">
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#5C3A21] shadow-lg p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image 
                      src="/wedding5-groom.jpg"
                      alt="Farhan Mahendra"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[9px] font-black text-[#FAF6F0] bg-[#3E2312] px-3 py-1 rounded-full tracking-widest uppercase inline-block shadow-sm">
                    MEMPELAI PUTRA
                  </span>
                  <h3 className="text-2xl font-adea-forum font-extrabold text-[#2A1E17] tracking-wider uppercase pt-1">
                    Farhan Mahendra, S.T.
                  </h3>
                  <p className="text-xs font-adea-lora text-[#3E2312] italic font-medium">
                    Putra dari Bapak Drs. Priyono &amp; Ibu Sri Utami
                  </p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#3E2312] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#5C3A21] mt-2 hover:bg-[#3E2312] hover:text-white transition-all shadow-sm"
                  >
                    <svg className="w-3 h-3 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> @farhan_mahendra
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Gold Ring Divider */}
            <ScrollReveal delay={250}>
              <div className="flex justify-center items-center my-1">
                <div className="w-12 h-12 rounded-full bg-[#3E2312] text-[#FAF6F0] font-adea-forum font-bold flex items-center justify-center text-2xl shadow-xl border-2 border-[#5C3A21]">
                  &amp;
                </div>
              </div>
            </ScrollReveal>

            {/* Bride Card */}
            <ScrollReveal delay={350}>
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border-2 border-[#5C3A21]/40 shadow-xl flex flex-col items-center space-y-4 relative">
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#5C3A21] shadow-lg p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image 
                      src="/wedding5-bride.jpg"
                      alt="Nabila Zhafira"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[9px] font-black text-[#FAF6F0] bg-[#3E2312] px-3 py-1 rounded-full tracking-widest uppercase inline-block shadow-sm">
                    MEMPELAI PUTERI
                  </span>
                  <h3 className="text-2xl font-adea-forum font-extrabold text-[#2A1E17] tracking-wider uppercase pt-1">
                    Nabila Zhafira, S.Psi.
                  </h3>
                  <p className="text-xs font-adea-lora text-[#3E2312] italic font-medium">
                    Putri dari Bapak H. Mansur &amp; Ibu Hj. Fatimah
                  </p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#3E2312] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#5C3A21] mt-2 hover:bg-[#3E2312] hover:text-white transition-all shadow-sm"
                  >
                    <svg className="w-3 h-3 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> @nabila_zhafira
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 4. HERITAGE TIMELINE */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">PERJALANAN CINTA</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Our Love Story 💖</h2>
              </div>
            </ScrollReveal>

            <div className="relative border-l-2 border-[#5C3A21] ml-4 pl-6 space-y-6 text-left">
              {[
                { year: "2023", tag: "KAWITAN ☕", title: "Tepang pisanan", desc: "Sepisanan kepanggih wonten ing acara pameran budaya seni ing Jogja, saling tukar sapa lalu terjalin komunikasi." },
                { year: "2024", tag: "SANGSULAN ⚡", title: "Komitmen Tresna", desc: "Sakwise setahun nongkrong &amp; diskusi bareng, kita sadar saling melengkapi lan mantap melangkah bareng." },
                { year: "2025", tag: "PIREMBAGAN 💍", title: "Prosesi Lamaran", desc: "Nyuwun pangestu kalih keluarga besar, dianakake prosesi lamaran adat Jawa ingkang hangat lan khidmat." },
                { year: "2026", tag: "PAWIWAHAN 💒", title: "Pernikahan Sakral", desc: "Momen sakral pawiwahan ngikat janji suci dadi pasangan garwa lan mbina rumah tangga ingkang berkah." }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 120}>
                  <div className="relative bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-[#5C3A21]/40 shadow-md space-y-1.5">
                    {/* Golden Lotus Node */}
                    <div className="absolute -left-[35px] top-4 w-4 h-4 rounded-full bg-[#5C3A21] border-2 border-[#FAF6F0] shadow-md" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#FAF6F0] bg-[#3E2312] px-2.5 py-0.5 rounded-full">
                        {item.year}
                      </span>
                      <span className="text-[9px] font-extrabold text-[#3E2312] bg-[#FAF6F0] border border-[#5C3A21] px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-adea-forum font-extrabold text-[#2A1E17] tracking-wider uppercase">{item.title}</h4>
                    <p className="text-xs text-[#3E2312] leading-relaxed font-adea-lora font-medium">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* 5. RANGKAIAN ACARA (HIGH CONTRAST COKLAT TUA) */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">TITIMANGSA</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Waktu &amp; Tempat</h2>
              </div>
            </ScrollReveal>

            {/* Akad Nikah Card */}
            <ScrollReveal delay={150}>
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border-2 border-[#5C3A21]/40 shadow-xl space-y-4 text-center relative overflow-hidden">
                <div className="inline-block px-5 py-1.5 rounded-full bg-[#3E2312] text-[#FAF6F0] text-xs font-black tracking-wider uppercase shadow-sm">
                  AKAD NIKAH 🕌
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-[#2A1E17] text-sm font-black">
                    <Calendar className="w-4 h-4 text-[#3E2312]" />
                    <span>Minggu, 22 November 2026</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[#3E2312] text-xs font-extrabold">
                    <Clock className="w-4 h-4 text-[#3E2312]" />
                    <span>08:00 WIB - 10:00 WIB</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[#3E2312] text-xs font-extrabold">
                    <MapPin className="w-4 h-4 text-[#3E2312]" />
                    <span>Masjid Keraton Yogyakarta, Alun-Alun Utara</span>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com/?q=Masjid+Ghede+Kauman+Yogyakarta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer border-2 border-[#5C3A21]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FAF6F0]" /> Buka Google Maps
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi Card */}
            <ScrollReveal delay={300}>
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border-2 border-[#5C3A21]/40 shadow-xl space-y-4 text-center relative overflow-hidden">
                <div className="inline-block px-5 py-1.5 rounded-full bg-[#3E2312] text-[#FAF6F0] text-xs font-black tracking-wider uppercase shadow-sm">
                  PAWIWAHAN &amp; RESEPSI 🎊
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-2 text-[#2A1E17] text-sm font-black">
                    <Calendar className="w-4 h-4 text-[#3E2312]" />
                    <span>Minggu, 22 November 2026</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[#3E2312] text-xs font-extrabold">
                    <Clock className="w-4 h-4 text-[#3E2312]" />
                    <span>11:00 WIB - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[#3E2312] text-xs font-extrabold">
                    <MapPin className="w-4 h-4 text-[#3E2312]" />
                    <span>Pendopo Royal Ambarrukmo Yogyakarta</span>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com/?q=Pendopo+Royal+Ambarrukmo+Yogyakarta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer border-2 border-[#5C3A21]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FAF6F0]" /> Buka Google Maps
                </a>
              </div>
            </ScrollReveal>
          </section>

          {/* 6. COUNTDOWN TIMER */}
          <section className="px-6 py-8 text-center space-y-6 relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">NGETUNG DINA</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Countdown Hari Bahagia</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                {[
                  { val: timeLeft.days, label: "DINA" },
                  { val: timeLeft.hours, label: "JAM" },
                  { val: timeLeft.minutes, label: "MENIT" },
                  { val: timeLeft.seconds, label: "DETIK" }
                ].map((t, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-xl text-[#2A1E17] border-2 border-[#5C3A21] rounded-2xl py-3.5 px-2 text-center shadow-xl">
                    <span className="block text-2xl font-adea-forum font-black text-[#3E2312] leading-none">{t.val}</span>
                    <span className="text-[9px] font-black text-[#3E2312] uppercase block mt-1">{t.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <button
                onClick={() => {
                  const icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Pernikahan Damar & Sekar\nLOCATION:Pendopo Royal Ambarrukmo Yogyakarta\nEND:VEVENT\nEND:VCALENDAR";
                  const blob = new Blob([icsData], { type: "text/calendar" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Pernikahan_Damar_Sekar.ics";
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] border-2 border-[#5C3A21] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FAF6F0]" /> Simpan Ke Kalender (.ics)
              </button>
            </ScrollReveal>
          </section>

          {/* 7. QR CODE TAMU UNDANGAN PRESENSI */}
          <section id="qrcode-section" className="px-6 py-8 text-center space-y-4 relative z-10">
            <ScrollReveal>
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-[#5C3A21] shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#5C3A21] uppercase tracking-[0.25em]">PRESENSI DIGITAL</span>
                  <h3 className="text-2xl font-adea-forum text-[#2A1E17] tracking-wider uppercase font-extrabold">QR Code Tamu Undangan</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-[#5C3A21]/30">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
                    alt="QR Code Tamu"
                    className="w-44 h-44 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-[#5C3A21]/20 text-center">
                    <span className="text-[11px] font-mono font-bold text-[#3E2312] tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <span className="text-sm font-extrabold text-[#2A1E17] block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-xs font-adea-lora text-[#3E2312] leading-relaxed max-w-xs mx-auto italic font-medium">
                    Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi presensi kehadiran.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 8. PHOTO GALLERY & LIGHTBOX */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">MEMORI TRESNA</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Our Gallery 📸</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((src, idx) => (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div 
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#5C3A21]/40 shadow-md group cursor-pointer hover:border-[#3E2312] transition-all"
                  >
                    <Image 
                      src={src} 
                      alt={`Prewedding Jawa ${idx+1}`} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-[#211611]/40 group-hover:bg-[#211611]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[10px] font-bold text-[#211611] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#3E2312] shadow-md">
                        🔍 Perbesar
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Video Prewedding Embed */}
            <ScrollReveal delay={250}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#5C3A21] shadow-xl bg-black mt-4">
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/5qap5aO4i9A?rel=0"
                  title="Javanese Casual Prewedding Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 bg-[#211611]/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
              >
                <div className="relative max-w-lg w-full max-h-[85vh] aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[#5C3A21] shadow-2xl bg-[#FAF6F0] p-2">
                  <Image 
                    src={selectedImage} 
                    alt="Prewedding Full" 
                    fill 
                    className="object-contain" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-transparent text-[#2A1E17] rounded-full p-2 border-2 border-[#5C3A21] backdrop-blur-md hover:bg-[#5C3A21]/20 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 9. WEDDING GIFT / AMPLOP DIGITAL */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">TANDA KASIH</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Wedding Gift 🎁</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="text-xs font-adea-lora text-[#3E2312] leading-relaxed max-w-xs mx-auto italic font-medium">
                Mboten ngurangi rasa hormat, kagem Bapak/Ibu/Saudara/i ingkang badhe paring kado digital saget katur liwat rekening menika:
              </p>
            </ScrollReveal>

            <div className="space-y-3.5 text-left">
              {/* Bank Card 1 */}
              <ScrollReveal delay={200}>
                <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border-2 border-[#5C3A21]/40 text-left space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-adea-forum text-base font-extrabold text-[#2A1E17] tracking-wider uppercase">BANK MANDIRI</span>
                    <span className="text-[9px] font-black text-[#FAF6F0] bg-[#3E2312] border border-[#5C3A21] px-2.5 py-0.5 rounded-full">VERIFIED</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#3E2312] font-bold">Nomor Rekening:</span>
                    <span className="text-base font-black text-[#2A1E17] tracking-wider">1370 0982 1123</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#5C3A21]/30">
                    <span className="text-xs text-[#3E2C23] font-black">a.n. Farhan Mahendra</span>
                    <button
                      onClick={() => copyToClipboard("137009821123", "mandiri")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] border border-[#5C3A21] text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
                    >
                      {copiedBank === "mandiri" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#FAF6F0]" />}
                      {copiedBank === "mandiri" ? "Tersalin!" : "Salin No. Rek"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Bank Card 2 */}
              <ScrollReveal delay={300}>
                <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border-2 border-[#5C3A21]/40 text-left space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-adea-forum text-base font-extrabold text-[#2A1E17] tracking-wider uppercase">BANK BCA</span>
                    <span className="text-[9px] font-black text-[#FAF6F0] bg-[#3E2312] border border-[#5C3A21] px-2.5 py-0.5 rounded-full">VERIFIED</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#3E2312] font-bold">Nomor Rekening:</span>
                    <span className="text-base font-black text-[#2A1E17] tracking-wider">8830 7711 00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#5C3A21]/30">
                    <span className="text-xs text-[#3E2C23] font-black">a.n. Nabila Zhafira</span>
                    <button
                      onClick={() => copyToClipboard("8830771100", "bca")}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] border border-[#5C3A21] text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
                    >
                      {copiedBank === "bca" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#FAF6F0]" />}
                      {copiedBank === "bca" ? "Tersalin!" : "Salin No. Rek"}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* 10. RSVP & WISHES GUESTBOOK FEED */}
          <section className="px-6 py-10 space-y-6 text-center relative z-10">
            <ScrollReveal>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#3E2312] tracking-[0.25em] uppercase">KONFIRMASI &amp; UCAPAN</span>
                <h2 className="text-3xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">RSVP &amp; Ucapan 💬</h2>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={150}>
              <form onSubmit={handleSubmitRSVP} className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border-2 border-[#5C3A21]/40 text-left space-y-4 shadow-md">
                <div>
                  <label className="block text-xs font-black text-[#3E2312] mb-1">Nama Asli / Inisial</label>
                  <input 
                    type="text" 
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Contoh: Raditya & Keluarga" 
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/80 border border-[#5C3A21]/40 text-[#2A1E17] focus:outline-none focus:border-[#3E2312] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E2312] mb-1">Jumlah Tamu</label>
                  <select 
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/80 border border-[#5C3A21]/40 text-[#2A1E17] focus:outline-none focus:border-[#3E2312] shadow-sm"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3+ Orang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E2312] mb-1">Konfirmasi Kehadiran</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs font-black text-[#2A1E17] cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Hadir" 
                        checked={rsvpStatus === "Hadir"} 
                        onChange={() => setRsvpStatus("Hadir")} 
                        className="accent-[#3E2312]" 
                      /> Rawuh / Hadir ✨
                    </label>
                    <label className="flex items-center gap-2 text-xs font-black text-[#2A1E17] cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="Tidak Hadir" 
                        checked={rsvpStatus === "Tidak Hadir"} 
                        onChange={() => setRsvpStatus("Tidak Hadir")} 
                        className="accent-[#3E2312]" 
                      /> Halangan / Absen 😔
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E2312] mb-1">Pesan &amp; Doa Restu</label>
                  <textarea 
                    rows={3} 
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Aturi pesan lan doa pangestu kagem mempelai kekalih..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/80 border border-[#5C3A21]/40 text-[#2A1E17] focus:outline-none focus:border-[#3E2312] resize-none shadow-sm"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-[#3E2312] hover:bg-[#5C3A21] text-[#FAF6F0] border-2 border-[#5C3A21] font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#FAF6F0]" /> {isSubmitting ? "Sending..." : "Kirim RSVP & Ucapan"}
                </button>

                {submitSuccess && (
                  <div className="p-3 bg-[#E6D7C8]/90 border border-[#5C3A21] rounded-xl text-[#3E2312] text-xs text-center font-black">
                    Matur nuwun! Pesan lan konfirmasi rawuh panjenengan sampun tersimpan ✨
                  </div>
                )}
              </form>
            </ScrollReveal>

            {/* Comments feed */}
            <ScrollReveal delay={250}>
              <div className="space-y-3 text-left">
                <h3 className="text-sm font-black text-[#2A1E17]">Buku Ucapan ({comments.length})</h3>
                <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                  {comments.map((item, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-xl p-3.5 rounded-2xl border border-[#5C3A21]/40 space-y-1 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs text-[#2A1E17]">{item.name}</span>
                        <span className="text-[9px] text-[#FAF6F0] bg-[#3E2312] border border-[#5C3A21] px-2 py-0.5 rounded-full font-bold">{item.attendance}</span>
                      </div>
                      <p className="text-xs text-[#3E2312] leading-relaxed font-medium font-adea-lora">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 11. CLOSING SECTION */}
          <section className="px-6 py-12 text-center space-y-6 relative z-10">
            <ScrollReveal>
              <div className="space-y-2">
                <h2 className="text-4xl font-adea-forum text-[#2A1E17] tracking-widest uppercase font-extrabold">Terima Kasih</h2>
                <p className="text-xs font-adea-lora text-[#3E2312] leading-relaxed max-w-xs mx-auto italic font-medium">
                  Tiyang ingkang bahagia nyuwun pangestu lan rawuh panjenengan ing pawiwahan menika.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="pt-4 border-t border-[#5C3A21]/40 space-y-1">
                <span className="text-[10px] text-[#3E2312] font-black uppercase tracking-widest block">KAMI YANG BERBAHAGIA</span>
                <h3 className="text-3xl font-adea-forum text-[#2A1E17] tracking-wider uppercase font-extrabold">Farhan &amp; Nabila</h3>
                <p className="text-[10px] text-[#3E2312] pt-1 font-bold font-adea-lora italic">Beserta Keluarga Besar Kedua Mempelai</p>
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
                className="relative bg-[#FAF6F0] p-6 rounded-3xl border-2 border-[#5C3A21] shadow-2xl max-w-xs w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-[#3E2312] hover:text-black bg-white/80 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-[#5C3A21] tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                  <h3 className="text-xl font-adea-forum font-extrabold text-[#2A1E17] uppercase">QR Code Tamu</h3>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-[#5C3A21]/30">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`WEDDING-GUEST-${guestName || "Tamu Undangan"}`)}`}
                    alt="QR Code Presensi"
                    className="w-48 h-48 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 pt-2 border-t border-[#5C3A21]/20 text-center">
                    <span className="text-[11px] font-mono font-bold text-[#3E2312] tracking-widest">
                      VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-2026
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-[#2A1E17] block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-[11px] text-[#3E2312] leading-snug">
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
