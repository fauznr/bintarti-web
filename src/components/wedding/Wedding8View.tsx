"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Music,
  Disc,
  MicOff,
  Gift,
  Send,
  ChevronDown,
  X,
  Camera,
  Copy,
  CheckCircle2,
  Pen,
  Stamp,
  QrCode,
  Scan
} from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeDecodeGuestName(raw: string): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    try {
      const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return raw;
    }
  }
}

// ─── Velocity Scroll Hook ─────────────────────────────────────────────────────
function useVelocityScroll() {
  const [velocity, setVelocity] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    lastTime.current = performance.now();
    lastScrollY.current = window.scrollY;

    let rafId: number;
    let currentVel = 0;

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY.current;

      // normalized velocity (px per frame ~60fps)
      const rawVel = (dy / dt) * 16;
      currentVel = Math.max(-15, Math.min(15, rawVel));

      lastScrollY.current = currentY;
      lastTime.current = now;
      setScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Smooth inertia decay loop
    const loop = () => {
      currentVel *= 0.88;
      if (Math.abs(currentVel) < 0.01) currentVel = 0;
      setVelocity(currentVel);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { velocity, scrollY };
}

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
function useScrollReveal(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal(delay);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Velocity Marquee Component ───────────────────────────────────────────────
function VelocityMarquee({ text, velocity }: { text: string; velocity: number }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      // Speed reacts to scroll velocity!
      const speed = 0.6 + Math.abs(velocity) * 0.4;
      setOffset((prev) => (prev + speed) % 600);
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [velocity]);

  return (
    <div className="overflow-hidden whitespace-nowrap py-2.5 border-y border-amber-900/30 bg-[#E8D9B5] relative z-30 shadow-md">
      <div
        className="inline-flex gap-8 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-amber-950/80"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: "transform 0.05s linear",
        }}
      >
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

// ─── Paper Texture SVG Background ────────────────────────────────────────────
const PaperTexture = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(ellipse at 20% 15%, rgba(139,90,43,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 85%, rgba(101,67,33,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 40%, rgba(160,120,60,0.04) 0%, transparent 40%),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 28px,
          rgba(139,90,43,0.035) 28px,
          rgba(139,90,43,0.035) 29px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 28px,
          rgba(139,90,43,0.015) 28px,
          rgba(139,90,43,0.015) 29px
        )
      `,
    }}
  />
);

// ─── Crumple Lines Overlay (Removed as requested) ────────────────────────────
const CrumpleLines = () => null;

// ─── Torn Edge SVGs (Removed as requested) ──────────────────────────────────
const TornEdgeTop = (_props: any) => null;
const TornEdgeBottom = (_props: any) => null;

// ─── Wax Seal ─────────────────────────────────────────────────────────────────
const WaxSeal = ({ className = "" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      style={{
        background: "radial-gradient(circle at 38% 38%, #C0392B, #7B1D0E)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.15)",
      }}
    >
      <Heart className="w-5 h-5 text-white/90 fill-white/70" />
    </div>
    <div
      className="absolute inset-0 rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)",
      }}
    />
  </div>
);

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const Box = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 flex items-center justify-center rounded-lg shadow-inner"
        style={{
          background: "linear-gradient(135deg, #2C1A0E, #3D2411)",
          border: "1px solid rgba(205,133,63,0.3)",
        }}
      >
        <span className="font-mono font-black text-2xl text-amber-200">{String(val).padStart(2, "0")}</span>
      </div>
      <span className="text-[10px] font-bold text-amber-900/70 mt-1.5 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center">
      <Box val={time.d} label="Hari" />
      <div className="text-amber-800/60 font-black text-2xl self-start mt-2">:</div>
      <Box val={time.h} label="Jam" />
      <div className="text-amber-800/60 font-black text-2xl self-start mt-2">:</div>
      <Box val={time.m} label="Menit" />
      <div className="text-amber-800/60 font-black text-2xl self-start mt-2">:</div>
      <Box val={time.s} label="Detik" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Wedding8View({ invitationData, guestName, themeId = "wedding-8" }: Props) {
  // ── Velocity Scroll Hook ──
  const { velocity, scrollY } = useVelocityScroll();

  // ── State ──
  const [isOpened, setIsOpened] = useState(false);
  const isPro = !!invitationData?.is_pro;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishes, setWishes] = useState<{ name: string; msg: string; time: string }[]>([
    { name: "Budi Santoso", msg: "Semoga langgeng hingga akhir hayat 💕", time: "2 jam lalu" },
    { name: "Rina Wulandari", msg: "Bahagia selalu, moga rumah tangganya penuh berkah!", time: "5 jam lalu" },
    { name: "Joko & Dewi", msg: "Selamat menempuh hidup baru! 🎊", time: "1 hari lalu" },
  ]);
  const [wishName, setWishName] = useState("");
  const [wishMsg, setWishMsg] = useState("");
  const [wishSent, setWishSent] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Data ──
  const data = invitationData || {};
  const groom = data.groomName || "Raka Ananda";
  const bride = data.brideName || "Sinta Maharani";
  const groomShort = groom.split(" ")[0];
  const brideShort = bride.split(" ")[0];
  const akadDate = data.akadDate || "2025-09-20";
  const akadTime = data.akadTime || "08.00 WIB";
  const akadVenue = data.akadVenue || "Masjid Al-Ikhlas, Jakarta Selatan";
  const resepsiDate = data.resepsiDate || "2025-09-20";
  const resepsiTime = data.resepsiTime || "11.00 – 14.00 WIB";
  const resepsiVenue = data.resepsiVenue || "Gedung Sasana Budaya, Jakarta";
  const musicUrl = data.musicUrl || data.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3";

  const guest = guestName ? safeDecodeGuestName(guestName) : "";

  const galleryPhotos = (data.galleryPhotos && data.galleryPhotos.length > 0)
    ? data.galleryPhotos
    : [
        data.coverPhoto || "/wedding8-couple-casual.jpg",
        "/wedding8-groom-casual.jpg",
        "/wedding8-bride-casual.jpg"
      ];

  // ── Audio ──
  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [musicUrl]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlayingAudio) {
      a.pause();
      setIsPlayingAudio(false);
    } else {
      a.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    }
  };

  // ── Slideshow ──
  useEffect(() => {
    if (!isOpened) return;
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % galleryPhotos.length), 3000);
    return () => clearInterval(t);
  }, [isOpened, galleryPhotos.length]);

  // ── Open handler ──
  const handleOpen = () => {
    setIsOpened(true);
    if (musicUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    }
  };

  // ── Wish submit ──
  const handleWish = () => {
    if (!wishName.trim() || !wishMsg.trim()) return;
    setWishes((p) => [{ name: wishName, msg: wishMsg, time: "Baru saja" }, ...p]);
    setWishName("");
    setWishMsg("");
    setWishSent(true);
    setTimeout(() => setWishSent(false), 3000);
  };

  // ── Copy bank ──
  const copyBank = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedBank(key);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOCK SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isOpened) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        style={{ background: "linear-gradient(160deg, #2C1A0E 0%, #3D2411 40%, #5C3317 70%, #2C1A0E 100%)" }}
      >
        {/* Paper fiber texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(205,133,63,0.03) 4px, rgba(205,133,63,0.03) 5px),
              repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(205,133,63,0.02) 4px, rgba(205,133,63,0.02) 5px)
            `,
          }}
        />

        {/* Crumpled paper sheet */}
        <div
          className="relative mx-auto w-full max-w-sm px-6 py-10 text-center"
          style={{
            background: "linear-gradient(135deg, #F7EDD4 0%, #EFE0B8 30%, #F5E8CC 60%, #EDE0B5 100%)",
            borderRadius: "2px",
            boxShadow: `
              -3px -2px 0 0 rgba(0,0,0,0.15),
              3px -2px 0 0 rgba(0,0,0,0.1),
              -4px 4px 8px rgba(0,0,0,0.3),
              4px 4px 12px rgba(0,0,0,0.25),
              0 8px 32px rgba(0,0,0,0.4)
            `,
            transform: "rotate(-0.8deg)",
          }}
        >
          <PaperTexture />
          <CrumpleLines />

          {/* Corner fold top-right */}
          <div
            className="absolute top-0 right-0 w-10 h-10"
            style={{
              background: "linear-gradient(225deg, #C8B891 50%, transparent 50%)",
              borderRadius: "0 2px 0 0",
            }}
          />
          {/* Subtle stain spots */}
          <div className="absolute top-8 left-5 w-3 h-3 rounded-full opacity-20" style={{ background: "#8B5E3C" }} />
          <div className="absolute bottom-12 right-8 w-2 h-2 rounded-full opacity-15" style={{ background: "#6B4226" }} />

          <div className="relative z-10 space-y-5">
            {/* Stamp-like badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 border-2 rounded-sm"
              style={{ borderColor: "#8B4513", color: "#8B4513", transform: "rotate(1.5deg)" }}
            >
              <Stamp className="w-3 h-3" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">UNDANGAN</span>
            </div>

            {/* Handwritten-style names */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-[0.2em] text-amber-900/60 uppercase">Kepada Yth.</p>
              <div
                className="text-3xl font-black leading-tight"
                style={{ color: "#3D1F08", fontFamily: "'Georgia', serif", letterSpacing: "-0.01em" }}
              >
                {guest || "Tamu Undangan"}
              </div>
              <div className="h-px w-20 mx-auto my-2" style={{ background: "#8B4513" }} />
              <p className="text-[11px] text-amber-900/50 italic" style={{ fontFamily: "Georgia, serif" }}>
                Kami mengundang Anda hadir dalam momen bahagia kami
              </p>
            </div>

            {/* Couple names */}
            <div className="py-3 space-y-1">
              <div className="text-4xl font-black" style={{ color: "#5C2E00", fontFamily: "Georgia, serif" }}>
                {groomShort}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8" style={{ background: "#8B4513" }} />
                <Heart className="w-4 h-4 fill-red-800 text-red-800" />
                <div className="h-px w-8" style={{ background: "#8B4513" }} />
              </div>
              <div className="text-4xl font-black" style={{ color: "#5C2E00", fontFamily: "Georgia, serif" }}>
                {brideShort}
              </div>
            </div>

            {/* Wax seal */}
            <div className="flex justify-center py-1">
              <WaxSeal />
            </div>

            {/* Open button */}
            <button
              onClick={handleOpen}
              className="relative w-full py-3 font-black text-sm tracking-[0.15em] uppercase transition-all active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3D1F08, #5C2E00)",
                color: "#F7EDD4",
                borderRadius: "1px",
                boxShadow: "2px 2px 0 #1A0A00, 3px 3px 8px rgba(0,0,0,0.4)",
                letterSpacing: "0.2em",
              }}
            >
              Buka Surat
              <ChevronDown className="inline ml-1 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN CONTENT (WITH OVERLAPPING SECTIONS & VELOCITY SCROLL)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative max-w-md mx-auto min-h-screen shadow-2xl overflow-x-hidden"
      style={{ background: "#F5EDD6", fontFamily: "Georgia, serif" }}
    >
      {/* Global paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 10% 20%, rgba(139,90,43,0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 80%, rgba(101,67,33,0.06) 0%, transparent 40%),
            repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(139,90,43,0.03) 32px, rgba(139,90,43,0.03) 33px)
          `,
          maxWidth: "inherit",
        }}
      />

      {/* Standardized Floating Music Control */}
      {musicUrl && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-[990] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #3D1F08, #5C2E00)",
            border: "2px solid rgba(205,133,63,0.4)",
            boxShadow: "2px 2px 0 #1A0A00, 0 4px 12px rgba(0,0,0,0.4)",
          }}
          title="Toggle Musik"
        >
          {isPlayingAudio ? (
            <Disc className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <Music className="w-5 h-5 text-amber-200/70 animate-bounce" />
          )}
        </button>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO COVER (Z-INDEX 10)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-between items-center overflow-hidden z-10">
        {/* Background photo with velocity parallax transform */}
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <Image
            src="/wedding8-couple-casual.jpg"
            alt="Hero"
            fill
            className="object-cover object-center object-center"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,237,214,0.55) 0%, rgba(245,237,214,0.2) 40%, rgba(245,237,214,0.65) 85%, #F5EDD6 100%)",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(101,67,33,0.12)", mixBlendMode: "multiply" }} />
        </div>

        <div className="absolute inset-0 z-[2] pointer-events-none">
          <CrumpleLines />
        </div>

        {/* Top header */}
        <div className="relative z-10 pt-10 text-center px-6 space-y-1">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 border-2 rounded-sm"
            style={{ borderColor: "#8B4513", color: "#8B4513" }}
          >
            <Stamp className="w-3 h-3" />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase">Undangan Pernikahan</span>
          </div>
        </div>

        {/* Center content with subtle velocity skew */}
        <div
          className="relative z-10 text-center px-6 space-y-4 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${velocity * -0.5}px) skewY(${velocity * 0.1}deg)`,
          }}
        >
          <p className="text-xs font-bold tracking-[0.3em] text-amber-900/60 uppercase">The Wedding Of</p>
          <div
            className="text-6xl font-black leading-none"
            style={{ color: "#3D1F08", textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}
          >
            {groomShort}
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16" style={{ background: "linear-gradient(to right, transparent, #8B4513)" }} />
            <WaxSeal className="scale-75" />
            <div className="h-[1px] w-16" style={{ background: "linear-gradient(to left, transparent, #8B4513)" }} />
          </div>
          <div
            className="text-6xl font-black leading-none"
            style={{ color: "#3D1F08", textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}
          >
            {brideShort}
          </div>
          <div className="py-2">
            <p className="text-sm text-amber-900/70 italic">&amp;</p>
            <p className="text-xs font-bold tracking-widest text-amber-900/50 uppercase pt-1">
              {akadDate
                ? new Date(akadDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                : "20 September 2025"}
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 pb-12 flex flex-col items-center gap-2">
          <p className="text-[10px] text-amber-900/50 tracking-widest uppercase">Gulir ke bawah</p>
          <ChevronDown className="w-5 h-5 text-amber-900/40 animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 2: COUPLE PROFILE (-MT-12 Z-INDEX 20)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-12 pt-10 pb-16 px-6 z-20 rounded-t-[32px] shadow-2xl" style={{ background: "#F5EDD6" }}>
        <TornEdgeTop color="#F5EDD6" />
        <PaperTexture />
        <CrumpleLines />

        <Reveal className="relative z-10 space-y-8 mt-4">
          <div className="text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#8B4513", color: "#8B4513", transform: "rotate(-1deg)" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Mempelai</span>
            </div>
            <h2 className="text-3xl font-black text-amber-950" style={{ letterSpacing: "-0.01em" }}>
              Yang Berbahagia
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: "#8B4513" }} />
              <Heart className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
              <div className="h-px w-12" style={{ background: "#8B4513" }} />
            </div>
          </div>

          {/* Groom & Bride Overlapping Paper Cards (Large & Prominent) */}
          <div className="relative space-y-6">
            {/* Groom card */}
            <div
              className="relative p-6 sm:p-8 space-y-4 text-center transition-transform duration-100 ease-out z-10"
              style={{
                background: "linear-gradient(135deg, #EFE0B8, #F5EDD6)",
                border: "1px solid rgba(139,90,43,0.3)",
                boxShadow: "-3px -2px 0 rgba(0,0,0,0.06), 4px 6px 18px rgba(0,0,0,0.18)",
                transform: `rotate(${0.8 + velocity * 0.1}deg) translateY(${velocity * -0.2}px)`,
              }}
            >
              <PaperTexture />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div
                  className="relative w-48 h-60 sm:w-56 sm:h-68 overflow-hidden rounded-sm"
                  style={{
                    border: "4px solid rgba(139,90,43,0.35)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  <Image
                    src="/wedding8-groom-casual.jpg"
                    alt={groom}
                    fill
                    className="object-cover object-center object-top"
                    style={{ filter: "sepia(20%)" }}
                  />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <p className="text-xs font-black text-amber-800/60 uppercase tracking-[0.25em]">Mempelai Pria</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">{groom}</h3>
                  <p className="text-sm text-amber-900/80 italic font-semibold pt-1">
                    Putra dari Bapak &amp; Ibu Suharto
                  </p>
                  <div className="flex justify-center gap-1.5 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="w-3 h-3 fill-amber-800/40 text-amber-800/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Ampersand Badge */}
            <div className="relative flex justify-center -my-8 z-20">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-black text-3xl text-amber-200 shadow-2xl border-2 border-amber-900/40"
                style={{ background: "linear-gradient(135deg, #3D1F08, #5C2E00)" }}
              >
                &amp;
              </div>
            </div>

            {/* Bride card */}
            <div
              className="relative p-6 sm:p-8 space-y-4 text-center transition-transform duration-100 ease-out z-10"
              style={{
                background: "linear-gradient(135deg, #F5EDD6, #EFE0B8)",
                border: "1px solid rgba(139,90,43,0.3)",
                boxShadow: "3px -2px 0 rgba(0,0,0,0.06), -4px 6px 18px rgba(0,0,0,0.18)",
                transform: `rotate(${-0.8 + velocity * -0.1}deg) translateY(${velocity * 0.2}px)`,
              }}
            >
              <PaperTexture />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div
                  className="relative w-48 h-60 sm:w-56 sm:h-68 overflow-hidden rounded-sm"
                  style={{
                    border: "4px solid rgba(139,90,43,0.35)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  <Image
                    src="/wedding8-bride-casual.jpg"
                    alt={bride}
                    fill
                    className="object-cover object-center object-top"
                    style={{ filter: "sepia(25%)" }}
                  />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <p className="text-xs font-black text-amber-800/60 uppercase tracking-[0.25em]">Mempelai Wanita</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">{bride}</h3>
                  <p className="text-sm text-amber-900/80 italic font-semibold pt-1">
                    Putri dari Bapak &amp; Ibu Wardhana
                  </p>
                  <div className="flex justify-center gap-1.5 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="w-3 h-3 fill-amber-800/40 text-amber-800/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── VELOCITY MARQUEE BANNER ── */}
      <VelocityMarquee text={`${groomShort} & ${brideShort} • WEDDING INVITATION • SAVE THE DATE • `} velocity={velocity} />

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 3: EVENT DETAILS (-MT-8 Z-INDEX 30)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-8 pt-8 z-30" style={{ background: "#2C1A0E" }}>
        <TornEdgeTop color="#F5EDD6" />
        <div className="py-16 px-6 space-y-8">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <line x1="25%" y1="0" x2="18%" y2="100%" stroke="#F5EDD6" strokeWidth="0.8" />
            <line x1="65%" y1="0" x2="72%" y2="100%" stroke="#F5EDD6" strokeWidth="0.6" />
            <line x1="0" y1="35%" x2="100%" y2="42%" stroke="#F5EDD6" strokeWidth="0.5" />
            <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#F5EDD6" strokeWidth="0.4" />
          </svg>

          <Reveal className="relative z-10 text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#CD853F", color: "#CD853F" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Agenda</span>
            </div>
            <h2 className="text-3xl font-black text-amber-100">Jadwal Acara</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
            </div>
          </Reveal>

          {/* Event Cards with comfortable spacing between Akad and Resepsi */}
          <div className="relative space-y-6">
            {/* Akad card */}
            <Reveal delay={100} className="relative z-10">
              <div
                className="p-5 space-y-3 transition-transform duration-100 ease-out"
                style={{
                  background: "linear-gradient(135deg, #F7EDD4, #EFE0B8)",
                  boxShadow: "-3px -2px 0 rgba(0,0,0,0.2), 3px 6px 14px rgba(0,0,0,0.4)",
                  transform: `rotate(${-0.8 + velocity * -0.1}deg)`,
                }}
              >
                <PaperTexture />
                <CrumpleLines />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-1 border rounded-sm text-[9px] font-black tracking-widest uppercase"
                      style={{ borderColor: "#8B4513", color: "#8B4513" }}
                    >
                      <Stamp className="w-2.5 h-2.5" /> Akad Nikah
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#3D1F08" }}>
                      <Pen className="w-3.5 h-3.5 text-amber-200" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-950">
                      <Calendar className="w-4 h-4 text-amber-800/70 flex-shrink-0" />
                      <span className="text-sm font-bold">
                        {akadDate
                          ? new Date(akadDate).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Sabtu, 20 September 2025"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-950">
                      <Clock className="w-4 h-4 text-amber-800/70 flex-shrink-0" />
                      <span className="text-sm font-bold">{akadTime}</span>
                    </div>
                    <div className="flex items-start gap-2 text-amber-950">
                      <MapPin className="w-4 h-4 text-amber-800/70 flex-shrink-0 mt-0.5" />
                      <span className="text-sm italic text-amber-900/80">{akadVenue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Resepsi card */}
            <Reveal delay={200} className="relative z-10">
              <div
                className="p-5 space-y-3 transition-transform duration-100 ease-out"
                style={{
                  background: "linear-gradient(135deg, #EFE0B8, #F7EDD4)",
                  boxShadow: "3px -2px 0 rgba(0,0,0,0.2), -3px 6px 14px rgba(0,0,0,0.4)",
                  transform: `rotate(${0.8 + velocity * 0.1}deg)`,
                }}
              >
                <PaperTexture />
                <CrumpleLines />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-1 border rounded-sm text-[9px] font-black tracking-widest uppercase"
                      style={{ borderColor: "#8B4513", color: "#8B4513" }}
                    >
                      <Stamp className="w-2.5 h-2.5" /> Resepsi
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#3D1F08" }}>
                      <Heart className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-950">
                      <Calendar className="w-4 h-4 text-amber-800/70 flex-shrink-0" />
                      <span className="text-sm font-bold">
                        {resepsiDate
                          ? new Date(resepsiDate).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Sabtu, 20 September 2025"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-950">
                      <Clock className="w-4 h-4 text-amber-800/70 flex-shrink-0" />
                      <span className="text-sm font-bold">{resepsiTime}</span>
                    </div>
                    <div className="flex items-start gap-2 text-amber-950">
                      <MapPin className="w-4 h-4 text-amber-800/70 flex-shrink-0 mt-0.5" />
                      <span className="text-sm italic text-amber-900/80">{resepsiVenue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Countdown */}
          <Reveal delay={300} className="relative z-10 text-center space-y-4 pt-4">
            <p className="text-xs font-bold text-amber-400/70 tracking-widest uppercase">Menghitung Hari</p>
            <Countdown targetDate={akadDate || "2025-09-20"} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 4: LOVE STORY (-MT-10 Z-INDEX 40)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-10 py-16 px-6 z-40" style={{ background: "#F5EDD6" }}>
        <TornEdgeTop color="#F5EDD6" />
        <PaperTexture />
        <CrumpleLines />

        <Reveal className="relative z-10 space-y-8 mt-4">
          <div className="text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#8B4513", color: "#8B4513", transform: "rotate(1deg)" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Kisah Kami</span>
            </div>
            <h2 className="text-3xl font-black text-amber-950">Perjalanan Cinta</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: "#8B4513" }} />
              <Heart className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
              <div className="h-px w-12" style={{ background: "#8B4513" }} />
            </div>
          </div>

          {/* Timeline with overlapping paper cards */}
          <div className="relative space-y-6 pl-6">
            <div
              className="absolute left-2.5 top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(to bottom, #8B4513, transparent)" }}
            />

            {[
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
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative flex gap-4 items-start">
                  <div
                    className="absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10"
                    style={{ borderColor: "#8B4513", background: "#F5EDD6" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: "#8B4513" }} />
                  </div>
                  <div
                    className="flex-1 p-3.5 transition-transform duration-100 ease-out"
                    style={{
                      background: "linear-gradient(135deg, #F0E3BE, #F7EDD4)",
                      border: "1px solid rgba(139,90,43,0.2)",
                      boxShadow: "1px 2px 6px rgba(0,0,0,0.08)",
                      transform: `rotate(${i % 2 === 0 ? 0.4 + velocity * 0.05 : -0.4 - velocity * 0.05}deg)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black px-1.5 py-0.5 text-amber-100" style={{ background: "#8B4513" }}>
                        {item.year}
                      </span>
                      <h4 className="font-black text-amber-950 text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-amber-900/70 italic leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 5: GALLERY (-MT-10 Z-INDEX 50)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-10 pt-6 z-50" style={{ background: "#2C1A0E" }}>
        <TornEdgeTop color="#F5EDD6" />
        <div className="py-16 px-6 space-y-8">
          <Reveal className="relative z-10 text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#CD853F", color: "#CD853F" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Galeri Foto</span>
            </div>
            <h2 className="text-3xl font-black text-amber-100">Momen Indah</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
            </div>
          </Reveal>

          {/* Slideshow hero with velocity skew */}
          <Reveal delay={100} className="relative z-10">
            <div
              className="relative w-full h-64 overflow-hidden transition-transform duration-100 ease-out"
              style={{
                border: "4px solid rgba(245,237,214,0.2)",
                boxShadow: "-4px -3px 0 rgba(0,0,0,0.3), 4px 4px 16px rgba(0,0,0,0.5)",
                transform: `rotate(${-0.5 + velocity * 0.1}deg)`,
              }}
            >
              {galleryPhotos.map((photo: string, idx: number) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
                  onClick={() => setSelectedImage(photo)}
                >
                  <Image
                    src={photo}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover object-center cursor-pointer"
                    style={{ filter: "sepia(15%)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "rgba(44,26,14,0.2)" }} />
                </div>
              ))}
              <div
                className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase"
                style={{ background: "rgba(245,237,214,0.9)", color: "#3D1F08" }}
              >
                #{String(currentSlide + 1).padStart(2, "0")} / {galleryPhotos.length}
              </div>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
                {galleryPhotos.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all rounded-full ${
                      i === currentSlide ? "w-5 h-1.5 bg-amber-200" : "w-1.5 h-1.5 bg-amber-200/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Photo grid — Overlapping polaroid cards reacting to velocity */}
          <Reveal delay={200} className="relative z-10">
            <div className="grid grid-cols-12 gap-1 sm:gap-2">
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
                    <div
                      onClick={() => setSelectedImage(photo)}
                      className={`cursor-pointer group transition-transform duration-300 hover:scale-[1.02] relative ${aspectClass} w-full overflow-hidden`}
                      style={{
                        background: "transparent",
                        border: "2px solid rgba(205, 133, 63, 0.4)",
                        boxShadow: "-3px -3px 0 rgba(0,0,0,0.3), 3px 3px 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      <Image
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        style={{ filter: "sepia(20%) contrast(1.1)" }}
                      />
                      <div className="absolute inset-0 group-hover:opacity-0 transition-opacity" style={{ background: "rgba(0,0,0,0.2)" }} />
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-amber-500/30 text-[8px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#CD853F" }}>
                        View
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 5.5: QR CODE TAMU UNDANGAN PRESENSI (-MT-8 Z-INDEX 50)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPro && (
        <section id="qrcode-section" className="relative -mt-8 py-16 px-6 z-50 text-center" style={{ background: "#24140B" }}>
        <TornEdgeTop color="#F5EDD6" />
        <Reveal className="relative z-10 space-y-6 mt-4 max-w-sm mx-auto">
          <div className="space-y-2 text-center">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#CD853F", color: "#CD853F" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Presensi Digital</span>
            </div>
            <h2 className="text-3xl font-black text-amber-100">QR Code Tamu Undangan</h2>
          </div>

          <div
            className="p-5 inline-block shadow-2xl transition-transform duration-100 ease-out"
            style={{
              background: "#F7EDD4",
              border: "3px solid #CD853F",
              boxShadow: "-2px -1px 0 rgba(0,0,0,0.3), 3px 4px 12px rgba(0,0,0,0.5)",
              transform: `rotate(${0.5 + velocity * 0.1}deg)`,
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guest || "Tamu Undangan")))}&type=Wedding`)}`}
              alt="QR Code Presensi"
              className="w-44 h-44 mx-auto rounded-sm object-contain"
            />
            <div className="mt-2 pt-2 border-t border-amber-900/30 text-center">
              <span className="text-[11px] font-mono font-bold text-amber-950 tracking-widest">
                VIP-{guest ? guest.substring(0, 3).toUpperCase() : "TMU"}-2026
              </span>
            </div>
          </div>

          <div className="space-y-1 text-center font-sans">
            <span className="text-sm font-black text-amber-100 block">{guest || "Tamu Undangan"}</span>
            <p className="text-xs text-amber-200/80 italic leading-relaxed max-w-xs mx-auto">
              Tunjukkan QR Code ini kepada petugas meja penerima tamu untuk konfirmasi presensi kehadiran.
            </p>
          </div>
        </Reveal>
      </section>
        )}

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 6: GIFT / AMPLOP DIGITAL (-MT-8 Z-INDEX 50)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-8 py-16 px-6 z-50" style={{ background: "#F5EDD6" }}>
        <TornEdgeTop color="#F5EDD6" />
        <PaperTexture />
        <CrumpleLines />

        <Reveal className="relative z-10 space-y-6 mt-4">
          <div className="text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#8B4513", color: "#8B4513", transform: "rotate(-1deg)" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Amplop Digital</span>
            </div>
            <h2 className="text-3xl font-black text-amber-950">Kirim Hadiah</h2>
            <p className="text-xs text-amber-800/60 italic max-w-xs mx-auto leading-relaxed">
              Doa restu Anda adalah karunia terbesar. Namun jika berkenan memberi tanda kasih, kami sangat bersyukur.
            </p>
          </div>

          {/* Bank Cards with comfortable spacing */}
          <div className="relative space-y-5">
            {[
              { bank: "BCA", account: "1234567890", name: `A.N. ${bride}`, icon: "🏦" },
              { bank: "Mandiri", account: "0987654321", name: `A.N. ${groom}`, icon: "🏛️" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-4 space-y-2 transition-transform duration-100 ease-out z-10"
                style={{
                  background: "linear-gradient(135deg, #F0E3BE, #F7EDD4)",
                  border: "1px solid rgba(139,90,43,0.25)",
                  boxShadow:
                    i % 2 === 0
                      ? "-2px -1px 0 rgba(0,0,0,0.08), 2px 2px 8px rgba(0,0,0,0.12)"
                      : "2px -1px 0 rgba(0,0,0,0.08), -2px 2px 8px rgba(0,0,0,0.12)",
                  transform: `rotate(${i % 2 === 0 ? 0.4 + velocity * 0.1 : -0.4 - velocity * 0.1}deg)`,
                }}
              >
                <PaperTexture />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-black text-amber-950 text-lg">{item.bank}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#3D1F08" }}>
                      <Gift className="w-3.5 h-3.5 text-amber-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono font-black text-xl text-amber-950 tracking-wider">{item.account}</p>
                    <p className="text-xs text-amber-800/70 italic">{item.name}</p>
                  </div>
                  <button
                    onClick={() => copyBank(item.account, item.bank)}
                    className="mt-3 w-full py-2.5 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    style={{
                      background: copiedBank === item.bank ? "#2D6A4F" : "linear-gradient(135deg, #3D1F08, #5C2E00)",
                      color: "#F7EDD4",
                      boxShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                    }}
                  >
                    {copiedBank === item.bank ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Nomor
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAPPING SECTION 7: WISHES & CLOSING (-MT-8 Z-INDEX 60)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-8 pt-6 z-60" style={{ background: "#2C1A0E" }}>
        <TornEdgeTop color="#F5EDD6" />
        <div className="py-16 px-6 space-y-8">
          <Reveal className="relative z-10 text-center space-y-2">
            <div
              className="inline-block border-2 px-4 py-1.5 rounded-sm"
              style={{ borderColor: "#CD853F", color: "#CD853F", transform: "rotate(0.5deg)" }}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Buku Tamu</span>
            </div>
            <h2 className="text-3xl font-black text-amber-100">Ucapan &amp; Doa</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
              <Pen className="w-3.5 h-3.5 text-amber-500" />
              <div className="h-px w-12" style={{ background: "#CD853F" }} />
            </div>
          </Reveal>

          {/* Wish form */}
          <Reveal delay={100} className="relative z-10">
            <div
              className="p-5 space-y-3 transition-transform duration-100 ease-out"
              style={{
                background: "linear-gradient(135deg, #F7EDD4, #EFE0B8)",
                boxShadow: "-3px -2px 0 rgba(0,0,0,0.2), 3px 3px 10px rgba(0,0,0,0.4)",
                transform: `rotate(${-0.5 + velocity * 0.08}deg)`,
              }}
            >
              <PaperTexture />
              <div className="relative z-10 space-y-3">
                <p className="text-xs font-black text-amber-900/60 uppercase tracking-widest">Tulis Ucapan Anda</p>
                <input
                  type="text"
                  placeholder="Nama Anda..."
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-bold text-amber-950 placeholder-amber-900/40"
                  style={{
                    background: "rgba(245,237,214,0.6)",
                    border: "none",
                    borderBottom: "1.5px solid rgba(139,90,43,0.4)",
                    fontFamily: "Georgia, serif",
                  }}
                />
                <textarea
                  placeholder="Tulis ucapan & doa tulus Anda di sini..."
                  rows={3}
                  value={wishMsg}
                  onChange={(e) => setWishMsg(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none resize-none text-amber-950 placeholder-amber-900/40"
                  style={{
                    background: "rgba(245,237,214,0.6)",
                    border: "none",
                    borderBottom: "1.5px solid rgba(139,90,43,0.4)",
                    fontFamily: "Georgia, serif",
                    lineHeight: "1.8",
                    backgroundImage:
                      "repeating-linear-gradient(transparent, transparent 26px, rgba(139,90,43,0.12) 26px, rgba(139,90,43,0.12) 27px)",
                  }}
                />
                <button
                  onClick={handleWish}
                  disabled={!wishName.trim() || !wishMsg.trim()}
                  className="w-full py-3 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  style={{
                    background: wishSent ? "#2D6A4F" : "linear-gradient(135deg, #3D1F08, #5C2E00)",
                    color: "#F7EDD4",
                    boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  {wishSent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim!
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Kirim Ucapan
                    </>
                  )}
                </button>
              </div>
            </div>
          </Reveal>

          {/* Wish list */}
          <div className="relative z-10 space-y-3">
            {wishes.map((w, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="p-4 transition-transform duration-100 ease-out"
                  style={{
                    background: "linear-gradient(135deg, #F0E3BE, #F7EDD4)",
                    boxShadow: "1px 2px 6px rgba(0,0,0,0.3)",
                    transform: `rotate(${i % 2 === 0 ? 0.4 + velocity * 0.05 : -0.4 - velocity * 0.05}deg)`,
                  }}
                >
                  <PaperTexture />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-black text-sm text-amber-950">{w.name}</span>
                      <span className="text-[9px] text-amber-800/50 italic">{w.time}</span>
                    </div>
                    <p className="text-xs text-amber-900/70 italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                      "{w.msg}"
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CLOSING */}
        <div className="pb-16 px-6 text-center space-y-6">
          <Reveal className="relative z-10 space-y-4">
            <WaxSeal className="mx-auto" />
            <div>
              <h3 className="text-2xl font-black text-amber-100 mb-1">
                {groomShort} &amp; {brideShort}
              </h3>
              <p className="text-xs text-amber-400/70 italic">
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
              </p>
              <p className="text-[10px] text-amber-600/50 mt-1 font-bold">— QS. Ar-Rum: 21</p>
            </div>
            <div
              className="inline-block border-2 px-4 py-2 rounded-sm"
              style={{ borderColor: "#CD853F", color: "#CD853F" }}
            >
              <span className="text-[9px] font-black tracking-[0.25em] uppercase">Bintarti Digital Invitation</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-amber-200/10 text-amber-200 hover:bg-amber-200/20 transition cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-sm mx-4">
            <div
              className="overflow-hidden"
              style={{
                background: "#F7EDD4",
                padding: "8px 8px 36px 8px",
                boxShadow: "-4px -3px 0 rgba(0,0,0,0.3), 4px 4px 20px rgba(0,0,0,0.6)",
                transform: "rotate(-1deg)",
              }}
            >
              <Image
                src={selectedImage}
                alt="Enlarged"
                width={400}
                height={500}
                className="w-full object-cover"
                style={{ filter: "sepia(15%)" }}
              />
              <p
                className="text-center text-xs font-bold mt-2"
                style={{ color: "#5D3A1A", fontFamily: "'Courier New', monospace" }}
              >
                {groomShort} &amp; {brideShort}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
          {isPro && (
              <button
                onClick={() => setShowQrModal(true)}
                className="fixed bottom-6 right-6 z-[990] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 group"
                aria-label="QR Code Presensi"
                title="QR Code Presensi Tamu"
              >
                <QrCode className="w-5 h-5 text-current group-hover:scale-110 transition-transform" />
              </button>
            )}

          <button
            onClick={toggleAudio}
            className="w-12 h-12 rounded-full border border-amber-900/50 bg-[#3D1F08] text-amber-200 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Music"
          >
            {isPlayingAudio ? (
              <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
            ) : (
              <Music className="w-5 h-5 text-amber-200 animate-bounce" />
            )}
          </button>
        </div>
      )}

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
            className="relative bg-[#24140B] p-6 rounded-2xl border-2 border-[#CD853F] shadow-2xl max-w-xs w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-amber-200 hover:text-white bg-amber-950 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-black text-[#CD853F] tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
              <h3 className="text-xl font-black text-amber-100 uppercase">QR Code Tamu</h3>
            </div>

            <div className="bg-[#F7EDD4] p-4 rounded-xl inline-block shadow-md border border-[#CD853F]/40">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guest || "Tamu Undangan")))}&type=Wedding`)}`}
                alt="QR Code Presensi"
                className="w-48 h-48 mx-auto rounded-sm object-contain"
              />
              <div className="mt-2 pt-2 border-t border-amber-900/30 text-center">
                <span className="text-[11px] font-mono font-bold text-amber-950 tracking-widest">
                  VIP-{guest ? guest.substring(0, 3).toUpperCase() : "TMU"}-2026
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-black text-amber-100 block">{guest || "Tamu Undangan"}</span>
              <p className="text-[11px] text-amber-200/80 leading-snug">
                Tunjukkan QR Code ini kepada panitia meja penerima tamu saat kedatangan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
