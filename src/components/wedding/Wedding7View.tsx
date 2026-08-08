"use client";

import React, { useState, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import Image from "next/image";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Send,
  Gift,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Shirt,
  User,
  Disc,
  Music,
  X,
  ChevronRight,
  ShieldCheck,
  Share2,
  ExternalLink,
  QrCode,
  Scan
} from "lucide-react";

// Helper inline SVG icons for Instagram and Youtube
const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const Youtube = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface Wedding7ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// ----------------------------------------------------------------------
// SVG Torn Paper Edge Components (Attarivitation Papercut Texture)
// ----------------------------------------------------------------------
const TornPaperTop = ({
  color = "#FAFBFB",
  className = ""
}: {
  color?: string;
  className?: string;
}) => (
  <div className={`w-full overflow-hidden leading-none select-none z-20 relative ${className}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-full h-10 sm:h-16"
    >
      <path
        d="M0,0 L0,45 Q120,95 280,35 Q440,105 600,45 Q760,100 920,35 Q1060,85 1200,40 L1200,0 Z"
        fill={color}
      />
      <path
        d="M0,20 Q140,75 290,40 Q460,90 620,30 Q770,80 940,25 Q1080,70 1200,30 L1200,0 L0,0 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  </div>
);

const TornPaperBottom = ({
  color = "#FAFBFB",
  className = ""
}: {
  color?: string;
  className?: string;
}) => (
  <div className={`w-full overflow-hidden leading-none select-none z-20 relative ${className}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-full h-10 sm:h-16"
    >
      <path
        d="M0,120 L0,75 Q120,25 280,85 Q440,15 600,75 Q760,20 920,85 Q1060,35 1200,80 L1200,120 Z"
        fill={color}
      />
      <path
        d="M0,100 Q140,45 290,80 Q460,30 620,90 Q770,40 940,95 Q1080,50 1200,90 L1200,120 L0,120 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  </div>
);

// ----------------------------------------------------------------------
// Scroll Reveal Component
// ----------------------------------------------------------------------
function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up"
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: "fade-up" | "fade-down" | "slide-left" | "slide-right" | "zoom-in"; className?: string;
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

  const getVariantClasses = () => {
    if (isVisible) return "opacity-100 translate-y-0 translate-x-0 scale-100";
    switch (variant) {
      case "fade-down":
        return "opacity-0 -translate-y-8 scale-95";
      case "slide-left":
        return "opacity-0 translate-x-8";
      case "slide-right":
        return "opacity-0 -translate-x-8";
      case "zoom-in":
        return "opacity-0 scale-90";
      case "fade-up":
      default:
        return "opacity-0 translate-y-8 scale-95";
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${getVariantClasses()}`}
    >
      {children}
    </div>
  );
}

// Helper function to safely decode guest names (from Base64, URL encoding, or plain text) without garbled UTF-8 characters or boxes
function safeDecodeGuestName(rawStr: string | null | undefined): string {
  if (!rawStr || typeof rawStr !== "string") return "Tamu Undangan";
  let trimmed = rawStr.trim();

  // 1. If URL-encoded (%20, etc.), decode first
  if (trimmed.includes("%")) {
    try {
      trimmed = decodeURIComponent(trimmed.replace(/\+/g, " "));
    } catch {}
  }

  // 2. Check if string matches Base64 format
  const isBase64Pattern = /^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length >= 4;

  if (isBase64Pattern) {
    let decoded = "";
    try {
      const binaryStr = atob(trimmed);
      const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
      decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      try {
        const binaryStr = atob(trimmed);
        decoded = decodeURIComponent(escape(binaryStr));
      } catch {
        decoded = "";
      }
    }

    // Must be valid printable text without replacement or control chars
    if (decoded && decoded.trim() && !/[\uFFFD\u0000-\u001F\u007F-\u009F]/.test(decoded)) {
      return decoded.trim();
    }

    // If it's a Base64 code that failed UTF-8 decoding, do NOT return raw code as name
    if (trimmed.includes("=") || /^[A-Za-z0-9+/]{8,}$/.test(trimmed)) {
      return "Tamu Undangan";
    }
  }

  // Clean plain text string
  const sanitized = trimmed.replace(/[\uFFFD\u0000-\u001F\u007F-\u009F]/g, "").trim();
  if (sanitized && sanitized !== "null" && sanitized !== "undefined" && !/[\u0080-\u00FF]/.test(sanitized)) {
    return sanitized;
  }
  return "Tamu Undangan";
}

// ----------------------------------------------------------------------
// Main Wedding 7 View Component (White & Sage Green #6a8f7f Papercut Theme)
// ----------------------------------------------------------------------
export default function Wedding7View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-7",
}: Wedding7ViewProps) {
  const [isOpened, setIsOpened] = useState(false);
  const isPro = !!invitationData?.is_pro;
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic Guest Name Resolution (from props, URL query parameter ?to= / ?name=, or Base64 URL hash)
  const [displayGuestName, setDisplayGuestName] = useState<string>(() => {
    return safeDecodeGuestName(guestName);
  });

  // Form State for Guestbook / Wishes
  const [wishes, setWishes] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchComments() {
      if (!themeId) return;
      try {
        const res = await fetch(`/api/comments?invitationId=${encodeURIComponent(themeId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.map((d: any) => ({
              name: d.name,
              status: d.rsvp_status || "Hadir",
              message: d.comment,
              time: d.created_at ? new Date(d.created_at).toLocaleDateString("id-ID") : "Baru saja"
            }));
            setWishes(mapped);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    fetchComments();
  }, [themeId]);
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Hadir");
  const [formPax, setFormPax] = useState("1");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let resolved = safeDecodeGuestName(guestName);
    if (resolved !== "Tamu Undangan") {
      setDisplayGuestName(resolved);
      setFormName(resolved);
      return;
    }

    if (typeof window !== "undefined") {
      // 1. Check URL Query Parameters (?to=, ?name=, ?guest=)
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get("to") || urlParams.get("name") || urlParams.get("guest");
      if (toParam) {
        resolved = safeDecodeGuestName(toParam);
        if (resolved !== "Tamu Undangan") {
          setDisplayGuestName(resolved);
          setFormName(resolved);
          return;
        }
      }

      // 2. Check Base64 URL Hash (#hash)
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        resolved = safeDecodeGuestName(hash.substring(1));
        if (resolved !== "Tamu Undangan") {
          setDisplayGuestName(resolved);
          setFormName(resolved);
          return;
        }
      }
    }
    setDisplayGuestName(resolved);
  }, [guestName]);

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const weddingNotes = invitationData?.notes ? (typeof invitationData.notes === "string" ? JSON.parse(invitationData.notes) : invitationData.notes) : {};
  
  const coverPhotoUrl = invitationData?.child_photo_url || invitationData?.childPhotoUrl || weddingNotes?.heroPhotoUrl || weddingNotes?.photoHero || "/indo_prewed_simple_1_1785092558852.jpg";
  const heroPhotoUrl = weddingNotes?.heroPhotoUrl || weddingNotes?.photoHero || coverPhotoUrl || "/indo_prewed_simple_1_1785092558852.jpg";
const fallbackHero = "/indo_prewed_simple_1_1785092558852.jpg";
  const fallbackGroom = "/indo_prewed_groom_1_1785092582755.jpg";
  const fallbackBride = "/indo_prewed_bride_1_1785092571671.jpg";
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
    : (weddingNotes?.bankAccounts || weddingNotes?.giftAccounts || [{ bankName: "BANK BCA", accountNumber: "1234567890", recipientName: "Aditya" }, { bankName: "OVO / E-WALLET", accountNumber: "081234567890", recipientName: "Kirana" }]);

  // Dynamic Data Extraction with Defaults
  const groomName = weddingNotes.groomNickname || invitationData?.groom_nickname || invitationData?.groom_name || "Aditya";
  const groomFullName = weddingNotes.groomName || invitationData?.groom_full_name || "Aditya Bayu, S.Par.";
  const groomParents = weddingNotes.groomParents || invitationData?.groom_parents || "Putra Pertama dari Bapak H. Achmad & Ibu Hj. Nurul";
  const groomIg = weddingNotes.groomInstagram || invitationData?.groom_instagram || "@aditya_bayu";

  const brideName = weddingNotes.brideNickname || invitationData?.bride_nickname || invitationData?.bride_name || "Kirana";
  const brideFullName = weddingNotes.brideName || invitationData?.bride_full_name || "Kirana Larasati, A.Md.Ak.";
  const brideParents = weddingNotes.brideParents || invitationData?.bride_parents || "Putri Pertama dari Bapak H. Syamsul & Ibu Hj. Dewati";
  const brideIg = weddingNotes.brideInstagram || invitationData?.bride_instagram || "@kirana_larasati";

  
  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  };

  const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "2026-01-01";
  const akadDateDisplay = formatEventDate(akadDateStr);
  const akadTimeStr = weddingNotes.akadTime || "08.00 WIB - Selesai";
  const akadLocationStr = weddingNotes.akadLocation || "Pendopo Papuri\nJl. Soekarno Hatta No.785, Bandung";

  const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;
  const resepsiDateDisplay = formatEventDate(resepsiDateStr);
  const resepsiTimeStr = weddingNotes.resepsiTime || "11.00 - 14.00 WIB";
  const resepsiLocationStr = weddingNotes.resepsiLocation || "Pendopo Papuri\nJl. Soekarno Hatta No.785, Bandung";
  
  const eventDateStr = akadDateDisplay;
  
  const weddingDateStr = invitationData?.wedding_date || "2026-01-01T08:00:00";

  const audioUrl = invitationData?.music_url || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-112191.mp3";

  // Gallery Photos
  const galleryPhotos = invitationData?.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0
    ? invitationData.gallery_images.map((g: any) => typeof g === "string" ? g : (g.image_url || g))
    : [
        "/indo_prewed_simple_1_1785092558852.jpg",
        "/indo_prewed_couple_2_1785092595152.jpg",
        "/indo_prewed_events_1_1785093412537.jpg",
        "/indo_prewed_bride_1_1785092571671.jpg",
        "/indo_prewed_groom_1_1785092582755.jpg",
        "/indo_prewed_closing_1_1785093445446.jpg"
      ];

  // Love Story Data
  const loveStory = (() => {
    if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
      return weddingNotes.loveStory.map((s: any) => ({
        date: s.year,
        title: s.title,
        desc: s.description || s.desc || ""
      }));
    }
    return [
      {
        title: "Pertama Bertemu",
        date: "15 Juni 2021",
        desc: "Pertemuan pertama kami yang tidak disengaja di sebuah acara kampus."
      }
    ];
  })();

  // Automatic Slide Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryPhotos.length]);

  // Countdown Timer Hook
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(weddingDateStr).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  // Open Invitation & Play Audio
  const handleOpenInvitation = () => {
    setIsClosingCover(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsClosingCover(false);
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlayingAudio(true))
          .catch((err) => console.log("Audio autoplay blocked:", err));
      }
    }, 600);
  };

  // Toggle Audio Playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Copy Bank Account Number
  const copyToClipboard = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 3000);
  };

  // Handle Form Submit
  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMessage) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setWishes([
        {
          name: formName,
          status: formStatus,
          message: formMessage,
          time: "Baru saja"
        },
        ...wishes
      ]);
      setFormName("");
      setFormMessage("");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFB] text-[#2D3748] font-montserrat antialiased selection:bg-[#6a8f7f] selection:text-white overflow-x-hidden">
      {/* Background Audio Player */}
      <audio ref={audioRef} src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"} loop preload="auto" />

      {/* ======================================================== */}
      {/* COVER / LOCKSCREEN MODAL (WHITE & SAGE GREEN STYLE)     */}
      {/* ======================================================== */}
      {!isOpened && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-[#FAFBFB] transition-all duration-700 ease-in-out ${
            isClosingCover ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          {/* Light Prewedding Background with Soft White Overlay */}
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <Image
              src={coverPhotoUrl}
              alt="Cover Background"
              fill
              className="object-cover object-center object-center brightness-95 scale-105 animate-pulse duration-[10000ms]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFB]/40 via-[#FAFBFB]/25 to-[#FAFBFB]/50" />
          </div>

          {/* Papercut Frame Container */}
          <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl bg-white/90 border border-[#6a8f7f]/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(106,143,127,0.15)] text-center space-y-6 transform transition-all">
            {/* Top Subtitle */}
            <div className="space-y-1">
              <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#6a8f7f] uppercase font-bold">
                THE WEDDING OF
              </span>
              <div className="h-0.5 w-12 bg-[#6a8f7f]/50 mx-auto" />
            </div>

            {/* Couple Names */}
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#1A202C] tracking-wider uppercase leading-tight drop-shadow-sm">
              {brideName} <span className="text-[#6a8f7f] font-serif italic">&amp;</span> {groomName}
            </h1>

            {/* Date */}
            <p className="font-cinzel text-xs text-[#6a8f7f] tracking-[0.2em] font-semibold">
              {eventDateStr}
            </p>

            {/* Guest Invitation Box */}
            <div className="py-4 px-5 rounded-2xl bg-[#F4F6F5] border border-[#6a8f7f]/30 space-y-1.5 shadow-inner">
              <p className="font-montserrat text-[10px] text-zinc-500 tracking-wider font-light uppercase">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <h4 className="font-cinzel text-base sm:text-lg text-[#1A202C] font-bold tracking-wide break-words">
                {displayGuestName}
              </h4>
              <p className="font-montserrat text-[9px] text-zinc-400 italic">
                *Mohon maaf bila ada kesalahan penulisan nama/gelar
              </p>
            </div>

            {/* Buka Undangan Button */}
            <button
              onClick={handleOpenInvitation}
              className="w-full py-3.5 px-6 rounded-full bg-[#6a8f7f] hover:bg-[#587a6d] text-white font-cinzel text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_10px_25px_rgba(106,143,127,0.3)] hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white animate-spin duration-3000" />
              <span>BUKA UNDANGAN</span>
            </button>
          </div>
        </div>
      )}
{/* MAIN CONTENT WRAPPER */}
      <div className="max-w-md mx-auto min-h-screen bg-[#FAFBFB] shadow-2xl relative border-x border-[#6a8f7f]/10 pb-8">
        {/* ======================================================== */}
        {/* SECTION 1: HERO / MAIN COVER                           */}
        {/* ======================================================== */}
        <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden">
          {/* Full Page Prewedding Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroPhotoUrl}
              alt="Hero Background"
              fill
              className="object-cover object-center object-center brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFB]/35 via-[#FAFBFB]/20 to-[#FAFBFB]" />
          </div>

          <div className="pt-16 pb-8 px-6 z-10 space-y-4 w-full">
            <ScrollReveal variant="fade-down">
              <span className="font-cinzel text-xs text-[#6a8f7f] tracking-[0.3em] uppercase font-bold">
                THE WEDDING OF
              </span>
              <h1 className="font-cinzel text-4xl font-bold text-[#1A202C] tracking-widest uppercase pt-2">
                {brideName} <span className="text-[#6a8f7f] font-serif italic">&amp;</span> {groomName}
              </h1>
              <p className="font-cinzel text-xs text-[#6a8f7f] tracking-[0.2em] font-semibold pt-1">
                {eventDateStr}
              </p>
            </ScrollReveal>
          </div>

          {/* Quran Surah Ar-Rum 21 Card */}
          <div className="z-10 px-6 my-auto w-full">
            <ScrollReveal delay={200} variant="zoom-in">
              <div className="p-6 rounded-3xl bg-white/90 border border-[#6a8f7f]/40 backdrop-blur-md space-y-3 text-center shadow-xl">
                <p className="font-lora text-xs text-[#4A5568] leading-relaxed italic font-light">
                  “Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.”
                </p>
                <span className="block font-cinzel text-[10px] text-[#6a8f7f] tracking-widest font-bold uppercase">
                  Q.S. AR-RUM: 21
                </span>
              </div>
            </ScrollReveal>
          </div>

          <TornPaperBottom color="#FAFBFB" />
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: COUPLE PROFILE ("WE ARE GETTING MARRIED")    */}
        {/* ======================================================== */}
        <section id="couple" className="relative py-16 px-6 text-center space-y-12 overflow-hidden bg-[#FAFBFB]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-2">
              <span className="font-cinzel text-[10px] text-[#6a8f7f] tracking-[0.3em] uppercase font-bold">
                WE ARE
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#1A202C] tracking-[0.15em] uppercase">
                GETTING MARRIED
              </h2>
              <div className="h-0.5 w-12 bg-[#6a8f7f]/50 mx-auto my-2" />
              <p className="font-montserrat text-xs text-[#4A5568] leading-relaxed max-w-xs mx-auto font-light">
                Dengan segala puji bagi Allah yang telah menciptakan makhluk-Nya berpasang-pasangan, ya Allah izinkanlah kami merangkaikan cinta yang Engkau berikan dalam ikatan pernikahan.
              </p>
            </div>
          </ScrollReveal>

          {/* GROOM PROFILE */}
          <ScrollReveal delay={200} variant="slide-left">
            <div className="space-y-4">
              <div className="relative w-48 h-64 mx-auto rounded-3xl overflow-hidden border-2 border-[#6a8f7f]/50 shadow-2xl group">
                <Image
                  src={weddingNotes.photoGroom || weddingNotes.groomPhotoUrl || heroPhotoUrl || fallbackGroom}
                  alt="Groom Photo"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">
                  {groomFullName}
                </h3>
                <p className="font-montserrat text-xs text-[#718096] font-light">
                  {groomParents}
                </p>
                <a
                  href={`https://instagram.com/${groomIg.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 pt-2 text-[10px] font-cinzel text-[#6a8f7f] hover:underline tracking-widest font-semibold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{groomIg}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <div className="font-cinzel text-2xl text-[#6a8f7f] italic font-serif">&amp;</div>

          {/* BRIDE PROFILE */}
          <ScrollReveal delay={300} variant="slide-right">
            <div className="space-y-4">
              <div className="relative w-48 h-64 mx-auto rounded-3xl overflow-hidden border-2 border-[#6a8f7f]/50 shadow-2xl group">
                <Image
                  src={weddingNotes.photoBride || weddingNotes.bridePhotoUrl || heroPhotoUrl || fallbackBride}
                  alt="Bride Photo"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">
                  {brideFullName}
                </h3>
                <p className="font-montserrat text-xs text-[#718096] font-light">
                  {brideParents}
                </p>
                <a
                  href={`https://instagram.com/${brideIg.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 pt-2 text-[10px] font-cinzel text-[#6a8f7f] hover:underline tracking-widest font-semibold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{brideIg}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>


        {/* ======================================================== */}
        {/* SECTION 6: LOVE STORY                                  */}
        {/* ======================================================== */}
        <section id="story" className="relative py-16 px-6 text-center space-y-8 bg-[#FAFBFB]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-2">
              <span className="font-cinzel text-[10px] text-[#6a8f7f] tracking-[0.3em] uppercase font-bold">
                OUR
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#1A202C] tracking-widest uppercase">
                LOVE STORY
              </h2>
              <div className="h-0.5 w-12 bg-[#6a8f7f]/50 mx-auto my-2" />
              <p className="font-lora text-xs text-[#4A5568] italic max-w-xs mx-auto">
                “Menikah bukan perlombaan, bukan soal cepat atau lambat. Tetapi, siapa yang siap mengemban amanah yang besar.”
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline Cards */}
          <div className="space-y-4 text-left">
            {loveStory.map((story: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 150} variant="slide-left">
                <div className="p-5 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-md space-y-1 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-cinzel text-[#6a8f7f] font-bold tracking-wider">
                    <span>{story.title}</span>
                    <span>{story.date}</span>
                  </div>
                  <p className="font-montserrat text-xs text-[#4A5568] leading-relaxed pt-1 font-light">
                    {story.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <div className="bg-[#6a8f7f]">
          <TornPaperTop color="#FAFBFB" />
        </div>

        {/* ======================================================== */}
        {/* SECTION 7: PHOTO GALLERY & CINEMATIC VIDEO             */}
        {/* ======================================================== */}
        <section id="gallery" className="relative py-16 px-6 text-center space-y-8 bg-[#6a8f7f]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-2">
              <span className="font-cinzel text-[10px] text-white/90 tracking-[0.3em] uppercase font-bold">
                GALLERY
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-white tracking-widest uppercase">
                OUR MOMENT
              </h2>
              <div className="h-0.5 w-12 bg-white/40 mx-auto my-2" />
              <p className="font-lora text-xs text-white/90 italic">
                Foto &amp; Video Prewedding {brideName} &amp; {groomName}
              </p>
            </div>
          </ScrollReveal>

          {/* Hero Slideshow Carousel */}
          <ScrollReveal delay={200} variant="zoom-in">
            <div className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/30 shadow-2xl group cursor-pointer">
              {galleryPhotos.map((photo: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(photo)}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`Gallery Slide ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              ))}

              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-[#6a8f7f]/40 rounded-full text-[9px] font-cinzel tracking-widest text-[#6a8f7f] uppercase font-bold flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#6a8f7f]" /> FEATURED MOMENT
                </span>
              </div>

              <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center gap-1.5">
                {galleryPhotos.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    className={`transition-all rounded-full ${
                      idx === currentSlide ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 sm:gap-2 pt-6 pb-4">
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
                      className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-[#6a8f7f]/30 shadow-md cursor-pointer group hover:scale-105 transition-all duration-300`}
                    >
                      <Image
                        src={photo}
                        alt={`Gallery Photo ${idx + 1}`}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#6a8f7f]/0 group-hover:bg-[#6a8f7f]/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="p-2 rounded-full bg-white/90 backdrop-blur-md border border-[#6a8f7f]/60 text-[#6a8f7f]">
                          <Camera className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Cinematic Prewedding Video Embed */}
          <ScrollReveal delay={300} variant="fade-up">
            <div className="pt-6 space-y-3 text-center">
              <h3 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase">
                CINEMATIC PREWEDDING FILM
              </h3>
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-[#6a8f7f]/40 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/u_FvAolXhI0?rel=0&modestbranding=1"
                  title="Prewedding Film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </ScrollReveal>
        </section>

        <TornPaperBottom color="#FAFBFB" />

        {/* ======================================================== */}
        {/* SECTION 8: WEDDING GIFT / DIGITAL ENVELOPE             */}
        {/* ======================================================== */}
        <section id="gift" className="relative py-16 px-6 text-center space-y-8 bg-[#FAFBFB]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-2">
              <span className="font-cinzel text-[10px] text-[#6a8f7f] tracking-[0.3em] uppercase font-bold">
                SEND A
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#1A202C] tracking-widest uppercase">
                WEDDING GIFT
              </h2>
              <div className="h-0.5 w-12 bg-[#6a8f7f]/50 mx-auto my-2" />
              <p className="font-montserrat text-xs text-[#4A5568] leading-relaxed max-w-xs mx-auto font-light">
                Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami akan senang hati menerimanya.
              </p>
            </div>
          </ScrollReveal>

          {/* DIGITAL ENVELOPE CARDS */}
          <ScrollReveal delay={200} variant="zoom-in">
            <div className="space-y-4">

              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                    <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                      BANK {bank.bankName}
                    </span>
                    <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">{bank.accountNumber}</p>
                    <p className="font-montserrat text-xs text-[#718096] font-light">a.n. {bank.recipientName || bank.accountName || bank.accountHolder || bank.bankName}</p>
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, bank.bankName)}
                      className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                    >
                      {copiedBank === bank.bankName ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === bank.bankName ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-3 text-center">
                    <span className="font-cinzel text-xs font-bold text-[#6a8f7f] tracking-widest uppercase">
                      BANK BCA
                    </span>
                    <p className="font-cinzel text-lg font-bold text-[#1A202C] tracking-wider">1234567890</p>
                    <p className="font-montserrat text-xs text-[#718096] font-light">a.n. Aditya Bayu</p>
                    <button
                      onClick={() => copyToClipboard("1234567890", "BCA")}
                      className="px-5 py-2 rounded-full border border-[#6a8f7f] bg-white hover:bg-[#6a8f7f] hover:text-white text-[#6a8f7f] text-[9px] font-cinzel tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-sm"
                    >
                      {copiedBank === "BCA" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === "BCA" ? "TERSALIN!" : "SALIN REKENING"}</span>
                    </button>
                  </div>
              )}

            </div>
          </ScrollReveal>
        </section>

        <div className="bg-[#6a8f7f]">
          <TornPaperTop color="#FAFBFB" />
        </div>

        {/* ======================================================== */}
        {/* SECTION 9: RSVP & GUEST WISHES                         */}
        {/* ======================================================== */}
        <section id="wishes" className="relative py-16 px-6 space-y-8 bg-[#6a8f7f]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-2 text-center">
              <span className="font-cinzel text-[10px] text-white/90 tracking-[0.3em] uppercase font-bold">
                GREET &amp; WISH
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-white tracking-widest uppercase">
                THEM ALL THE BEST
              </h2>
              <div className="h-0.5 w-12 bg-white/40 mx-auto my-2" />
              <p className="font-montserrat text-xs text-white/90 leading-relaxed max-w-xs mx-auto font-light">
                Sapa dan kirim ucapan beserta doa yang terbaik untuk mereka yang berbahagia.
              </p>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={200} variant="zoom-in">
            <form onSubmit={handleSubmitWish} className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-xl space-y-4">
              <div className="space-y-1">
                <label className="font-cinzel text-[10px] text-[#6a8f7f] tracking-wider font-bold uppercase block">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F6F5] border border-[#6a8f7f]/30 text-[#1A202C] text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#6a8f7f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-cinzel text-[10px] text-[#6a8f7f] tracking-wider font-bold uppercase block">
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F4F6F5] border border-[#6a8f7f]/30 text-[#1A202C] text-xs focus:outline-none focus:border-[#6a8f7f]"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Ragu-ragu">Ragu-ragu</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-cinzel text-[10px] text-[#6a8f7f] tracking-wider font-bold uppercase block">
                    Jumlah Tamu
                  </label>
                  <select
                    value={formPax}
                    onChange={(e) => setFormPax(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F4F6F5] border border-[#6a8f7f]/30 text-[#1A202C] text-xs focus:outline-none focus:border-[#6a8f7f]"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-cinzel text-[10px] text-[#6a8f7f] tracking-wider font-bold uppercase block">
                  Ucapan &amp; Doa
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F6F5] border border-[#6a8f7f]/30 text-[#1A202C] text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#6a8f7f] resize-none"
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
                className="w-full py-3 rounded-full bg-[#6a8f7f] hover:bg-[#587a6d] text-white font-cinzel text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "KIRIM..." : "KIRIM UCAPAN"}</span>
              </button>
            </form>
          </ScrollReveal>

          {/* Wishes List */}
          <div className="space-y-3 pt-2">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wider text-center uppercase">
              {wishes.length} UCAPAN DITERIMA
            </h4>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {wishes.map((w, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-[#6a8f7f]/20 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs font-bold text-[#1A202C]">{w.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#6a8f7f]/10 text-[#6a8f7f] text-[9px] font-cinzel font-semibold">
                      {w.status}
                    </span>
                  </div>
                  <p className="font-montserrat text-xs text-[#4A5568] leading-relaxed font-light pt-0.5">
                    {w.message}
                  </p>
                  <span className="block text-[9px] text-[#A0AEC0] text-right pt-1">
                    {w.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: QR CODE TAMU UNDANGAN PRESENSI                 */}
        {/* ======================================================== */}
        {isPro && (
        <section id="qrcode-section" className="relative py-16 px-6 text-center space-y-8 bg-[#6a8f7f]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-1">
                <span className="font-cinzel text-[10px] text-white/80 tracking-[0.3em] uppercase font-bold">
                  PRESENSI DIGITAL
                </span>
                <h2 className="font-cinzel text-2xl font-bold text-white tracking-widest uppercase">
                  QR Code Tamu Undangan
                </h2>
                <div className="h-0.5 w-12 bg-white/40 mx-auto my-2" />
              </div>

              <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl border border-white/30">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                  alt="QR Code Presensi"
                  className="w-44 h-44 mx-auto rounded-xl object-contain"
                />
                <div className="mt-2 pt-2 border-t border-zinc-200 text-center">
                  <span className="text-[11px] font-mono font-bold text-zinc-800 tracking-widest">
                    VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-{akadDateStr ? akadDateStr.split("-")[0] : "2026"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-center">
                <span className="font-cinzel text-sm font-bold text-white block">{guestName || "Tamu Undangan"}</span>
                <p className="font-montserrat text-xs text-white/90 leading-relaxed font-light max-w-xs mx-auto">
                  Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi presensi kehadiran.
                </p>
              </div>

              {/* Health Protocol Reminder */}
              <div className="p-6 rounded-3xl bg-white border border-[#6a8f7f]/30 shadow-md space-y-3 text-[#1A202C] mt-6">
                <ShieldCheck className="w-6 h-6 text-[#6a8f7f] mx-auto" />
                <h3 className="font-cinzel text-xs font-bold text-[#1A202C] tracking-widest uppercase">
                  REMINDER HEALTH PROTOCOL
                </h3>
                <p className="font-montserrat text-[11px] text-[#718096] leading-relaxed font-light">
                  Demi keamanan dan kenyamanan bersama, kami menghimbau agar Tamu Undangan tetap menerapkan Protokol Kesehatan.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>
        )}

        <TornPaperBottom color="#FAFBFB" />

        {/* ======================================================== */}
        {/* SECTION 10: CLOSING & FOOTER                           */}
        {/* ======================================================== */}
        <section className="relative py-16 px-6 text-center space-y-8 bg-[#FAFBFB]">
          <ScrollReveal variant="fade-up">
            <div className="space-y-4">
              <p className="font-lora text-xs text-[#4A5568] leading-relaxed italic max-w-xs mx-auto">
                “Bismillah, semoga dengan niat yang baik dan ikhlas segala sesuatunya berjalan dengan lancar. Kami memohon doa restu dari keluarga, sahabat, rekan-rekan. Semoga ini semua menjadi awal lembaran baru yang indah dan penuh berkah serta menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.”
              </p>
              <div className="space-y-1">
                <span className="font-cinzel text-xs text-[#6a8f7f] tracking-widest font-bold uppercase block">
                  KAMI YANG BERBAHAGIA
                </span>
                <h2 className="font-cinzel text-3xl font-bold text-[#1A202C] tracking-widest uppercase">
                  {brideName} <span className="text-[#6a8f7f] font-serif italic">&amp;</span> {groomName}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          {/* Footer Branding */}
          <div className="pt-12 border-t border-[#6a8f7f]/20 space-y-2 text-center text-[#718096] text-[10px]">
            <p className="font-cinzel tracking-widest font-semibold text-[#4A5568]">
              DIGITAL WEDDING INVITATION © 2026
            </p>
            <p className="font-montserrat font-light">
              Designed &amp; Developed with Love by Bintarti Invitations
            </p>
          </div>
        </section>
      </div>

      {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
          {isPro && (
              <button
                onClick={() => setShowQrModal(true)}
                className="w-12 h-12 rounded-full border border-white/40 bg-white/90 backdrop-blur-md text-[#6a8f7f] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                aria-label="QR Code Presensi"
                title="QR Code Presensi Tamu"
              >
                <QrCode className="w-5 h-5 text-current group-hover:scale-110 transition-transform" />
              </button>
            )}

          <button
            onClick={toggleAudio}
            className="w-12 h-12 rounded-full border border-white/40 bg-[#1A202C]/90 backdrop-blur-md text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Toggle Music"
          >
            {isPlayingAudio ? (
              <Disc className="w-6 h-6 text-[#6a8f7f] animate-spin" style={{ animationDuration: '3s' }} />
            ) : (
              <Music className="w-5 h-5 text-slate-300 animate-bounce" />
            )}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white p-2 border border-white/40 bg-black/40 backdrop-blur-md rounded-full hover:bg-white hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-lg h-[80vh] overflow-hidden">
            <Image
              src={selectedImage}
              alt="Enlarged View"
              fill
              className="object-contain"
            />
          </div>
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
            className="relative bg-[#FAFBFB] p-6 rounded-3xl border border-[#6a8f7f]/30 shadow-2xl max-w-xs w-full text-center space-y-4 font-montserrat animate-in fade-in zoom-in-95 duration-200"
          >
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 bg-stone-200 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-bold text-[#6a8f7f] tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
              <h3 className="font-cinzel text-xl font-bold text-[#1A202C] uppercase">QR Code Tamu</h3>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-[#6a8f7f]/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
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
              <span className="font-cinzel text-sm font-bold text-[#1A202C] block">{guestName || "Tamu Undangan"}</span>
              <p className="text-[11px] text-[#4A5568] leading-snug">
                Tunjukkan QR Code ini kepada panitia meja penerima tamu saat kedatangan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
