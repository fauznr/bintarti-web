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
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Download,
  Home,
  User,
  Image as ImageIcon,
  MessageSquare,
  Shirt,
  Play,
  Disc,
  Scan
} from "lucide-react";

interface Wedding6ViewProps {
  invitationData?: any;
  guestName?: string;
  themeId?: string;
}

// Scroll Reveal Component with customizable delay and animation variants
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

export default function Wedding6View({
  invitationData,
  guestName = "Tamu Undangan",
  themeId = "wedding-6"
}: Wedding6ViewProps) {

  const [isOpened, setIsOpened] = useState(false);
  
  const [isClosingCover, setIsClosingCover] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTabGift, setActiveTabGift] = useState<"envelope" | "registry">("envelope");
  const [activeNav, setActiveNav] = useState("home");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract custom or fallback invitation data
  // Parse weddingNotes
  let weddingNotes: any = {};
  try {
    if (invitationData?.notes) {
      weddingNotes = JSON.parse(invitationData.notes);
    }
  } catch (e) {
    console.error("Failed to parse wedding notes", e);
  }
  const isPro = !!invitationData?.is_pro || !!weddingNotes?.isPro;

  const groomName = weddingNotes.groomNickname || weddingNotes.groomName || invitationData?.nickname || invitationData?.groom_name || "Rizky";
  const groomFullName = weddingNotes.groomName || invitationData?.full_name || "Rizky Febrian, S.T.";
  const groomParents = weddingNotes.groomParents || invitationData?.parents_name || "Bapak H. Sutrisno & Ibu Hj. Suhartini";
  
  const brideName = weddingNotes.brideNickname || weddingNotes.brideName || invitationData?.bride_nickname || invitationData?.bride_name || "Amanda";
  const brideFullName = weddingNotes.brideName || invitationData?.bride_full_name || "Amanda Manopo, S.Ked.";
  const brideParents = weddingNotes.brideParents || invitationData?.bride_parents || "Bapak H. Burhanuddin & Ibu Hj. Kartini";



  const akadTitle = weddingNotes.akadTitle || "HOLY MATRIMONY";
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch(e) {
      return dateStr;
    }
  };
  const akadDateStr = weddingNotes.akadDate || invitationData?.event_date || "2026-02-17";
  const akadDateDisplay = formatEventDate(akadDateStr);
  const akadTimeStr = weddingNotes.akadTime || "08.00 - 10.00 WIB";
  const akadLocation = weddingNotes.akadLocation || invitationData?.event_location || "Royal Tulip Hotel Ballroom, Bogor";
  const akadGmaps = weddingNotes.akadGmaps || invitationData?.maps_link || "https://maps.app.goo.gl/9TKDRtj6jToyd2o46";

  const resepsiTitle = weddingNotes.resepsiTitle || "RECEPTION";
  const resepsiDateStr = weddingNotes.resepsiDate || akadDateStr;
  const resepsiDateDisplay = formatEventDate(resepsiDateStr);
  const resepsiTimeStr = weddingNotes.resepsiTime || "11.00 - 14.00 WIB";
  const resepsiLocation = weddingNotes.resepsiLocation || akadLocation;
  const resepsiGmaps = weddingNotes.resepsiGmaps || akadGmaps;
  
  const eventDateStr = akadDateDisplay;
  const eventLocation = akadLocation;
  const eventAddress = "Detail alamat..."; // Provide fallback
  const mapsLink = akadGmaps;
  
  const photoCoverUrl = invitationData?.child_photo_url || "/indo_prewed_simple_1_1785092558852.jpg";
  const fallbackHero = photoCoverUrl;
  const heroPhotoUrl = weddingNotes.heroPhotoUrl || fallbackHero;
  const quoteBgUrl = weddingNotes.quoteBgUrl || fallbackHero;
  const loveStoryBgUrl = weddingNotes.loveStoryBgUrl || fallbackHero;
  const eventBgUrl = weddingNotes.eventBgUrl || fallbackHero;
  const dresscodeBgUrl = weddingNotes.dresscodeBgUrl || fallbackHero;
  const ourMomentBgUrl = weddingNotes.ourMomentBgUrl || fallbackHero;
  const giftBgUrl = weddingNotes.giftBgUrl || fallbackHero;
  const rsvpBgUrl = weddingNotes.rsvpBgUrl || fallbackHero;
  const qrBgUrl = weddingNotes.qrBgUrl || fallbackHero;
  const closingPhotoUrl = weddingNotes.closingPhotoUrl || fallbackHero;
  const saveTheDateBgUrl = weddingNotes.saveTheDateBgUrl || fallbackHero;
  
  const groomPhotoUrl = weddingNotes.groomPhotoUrl || "/indo_prewed_groom_1_1785092582755.jpg";
  const bridePhotoUrl = weddingNotes.bridePhotoUrl || "/indo_prewed_bride_1_1785092571671.jpg";
  
  const youtubeVideo = weddingNotes.youtubeVideo || "https://www.youtube.com/watch?v=u_FvAolXhI0";
  const bankAccounts = weddingNotes.bankAccounts || [
    { bankName: "BANK BCA", accountNumber: "0123 456 789", accountName: "Amanda Manopo" },
    { bankName: "GOPAY / DIGITAL WALLET", accountNumber: "0812 3456 7890", accountName: "Rizky Febrian" }
  ];
  const youtubeEmbedId = youtubeVideo.includes('v=') ? youtubeVideo.split('v=')[1]?.split('&')[0] : (youtubeVideo.split('/').pop() || 'u_FvAolXhI0');

  const loveStoryList = (weddingNotes.loveStoryList && weddingNotes.loveStoryList.length > 0) ? weddingNotes.loveStoryList : [
    { year: "2018", title: "Awal Berjumpa", description: "Kami bertemu pertama kali di acara kampus. Sebuah sapaan sederhana yang mengawali segalanya." },
    { year: "2020", title: "Menjalin Kasih", description: "Setelah lulus, kami memutuskan untuk menjalin hubungan dan saling mendukung karir masing-masing." },
    { year: "2023", title: "Momen Lamaran", description: "Di bawah rintik hujan kota Bandung, ia melamar saya. Sebuah 'Ya' yang mengubah hidup kami." },
    { year: "2024", title: "Puncak Cinta", description: "Hari ini kami mengikat janji suci pernikahan untuk memulai lembaran baru sebagai suami istri." }
  ];

  const dresscodes = (weddingNotes.dresscodes && weddingNotes.dresscodes.length > 0) ? weddingNotes.dresscodes : [
    { name: "Black", hex: "#171717" },
    { name: "Charcoal", hex: "#737373" },
    { name: "Silver", hex: "#D4D4D4" },
    { name: "White", hex: "#FFFFFF" }
  ];

  // Gallery Photos
  const dbGallery = invitationData?.gallery_images || weddingNotes?.gallery || [];
  const galleryPhotos = dbGallery.length > 0 ? dbGallery : [
    "/indo_prewed_simple_1_1785092558852.jpg",
    "/indo_prewed_couple_2_1785092595152.jpg",
    "/indo_prewed_peakoflove_1_1785094159557.jpg",
    "/indo_prewed_lovequote_2_1785094184195.jpg",
    "/indo_prewed_events_1_1785093412537.jpg",
    "/indo_prewed_livestream_1_1785093423516.jpg",
    "/indo_prewed_gift_1_1785093433664.jpg",
    "/indo_prewed_rsvp_1_1785094172087.jpg",
    "/indo_prewed_closing_1_1785093445446.jpg",
    "/indo_prewed_bride_1_1785092571671.jpg",
    "/indo_prewed_groom_1_1785092582755.jpg"
  ];

  // RSVP Form State
  const [formName, setFormName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [formAttendance, setFormAttendance] = useState("Hadir");
  const [formPax, setFormPax] = useState("1");
  const [formWish, setFormWish] = useState("");
  const [comments, setComments] = useState<Array<any>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?invitationId=${encodeURIComponent(themeId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setComments(data);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    fetchComments();
  }, [themeId]);

  // Countdown State (Default 17 Feb 2026)
  const targetDate = new Date((akadDateStr || "2026-02-17") + "T08:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Gallery Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const loveStory: Array<{ year: string; title: string; desc: string }> = (() => {
    if (weddingNotes?.loveStory && Array.isArray(weddingNotes.loveStory) && weddingNotes.loveStory.length > 0) {
      return weddingNotes.loveStory.map((s: any) => ({ year: s.year, title: s.title, desc: s.description || s.desc || "" }));
    }
    return [
      { year: "2023", title: "Awal Bertemu", desc: "Pertemuan pertama kami yang sederhana menumbuhkan rasa saling mengerti dan benih-benih cinta yang tulus." }
    ];
  })();


  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 3500);
    return () => clearInterval(slideTimer);
  }, [galleryPhotos.length]);

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

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formWish.trim()) return;
    setIsSubmitting(true);

    const rsvpValue = formAttendance === "Hadir" ? `Hadir (${formPax} Orang)` : "Tidak Hadir";
    const newComment = {
      name: formName,
      rsvp_status: rsvpValue,
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
          rsvpStatus: rsvpValue,
          comment: formWish
        })
      });
      setComments([newComment, ...comments]);
      setFormWish("");
    } catch (err) {
      setComments([newComment, ...comments]);
      setFormWish("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      {/* Inject Google Fonts: Playfair Display, Cinzel, Montserrat, Lora */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-cinzel {
          font-family: 'Cinzel', serif;
          letter-spacing: 0.15em;
        }

        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .font-lora {
          font-family: 'Lora', serif;
        }
      `}</style>

      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}
        loop
        preload="auto"
      />

      {/* ======================================================== */}
      {/* COVER OVERLAY / LOCK SCREEN MODAL                        */}
      {/* ======================================================== */}
      {(!isOpened || isClosingCover) && (
        <div
          className={`fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-between p-6 text-center overflow-hidden transition-all duration-700 ease-in-out ${
            isClosingCover
              ? "opacity-0 scale-105 -translate-y-8 blur-sm pointer-events-none"
              : "opacity-100 scale-100 translate-y-0 blur-none"
          }`}
        >
          {/* Full background photo with dark vignette overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={photoCoverUrl}
              alt="Ivanna Cover Photo"
              fill
              className="object-cover object-center object-center opacity-65 filter brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/40 to-[#050505]/95" />
          </div>

          {/* TOP CONTAINER: THE WEDDING OF, NAMES & DATE */}
          <div className="w-full max-w-sm z-10 relative flex flex-col items-center pt-8 space-y-2">
            <span className="font-cinzel text-[10px] sm:text-xs text-white tracking-[0.25em] uppercase font-semibold">
              THE WEDDING OF
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl text-white tracking-wide font-normal drop-shadow-md">
              {brideName} <span className="text-zinc-400 font-lora italic">&amp;</span> {groomName}
            </h1>
            <p className="font-cinzel text-xs text-zinc-300 tracking-[0.2em] font-semibold pt-1">
              {eventDateStr}
            </p>
          </div>

          {/* BOTTOM CONTAINER: GUEST NAME & ACTION BUTTONS */}
          <div className="w-full max-w-sm z-10 relative flex flex-col items-center gap-3 pb-6">
            {/* Guest Name Box (No Card) */}
            <div className="w-full p-2 text-center space-y-1">
              <p className="text-[9px] text-zinc-400 font-montserrat uppercase tracking-widest">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-white font-playfair capitalize">
                {guestName}
              </h3>
            </div>

            {/* Transparent Action Button */}
            <div className="w-full flex justify-center pt-1">
              <button
                onClick={handleOpenInvitation}
                className="w-full py-3 px-6 bg-transparent border border-white/70 hover:bg-white hover:text-black text-white font-cinzel text-xs font-bold tracking-wider rounded-full shadow-lg transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>BUKA UNDANGAN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INVITATION CONTENT CONTAINER */}
      {(isOpened || isClosingCover) && (
        <div className="max-w-md mx-auto bg-[#050505] shadow-2xl min-h-screen relative border-x border-white/10 pb-20">

        {/* ======================================================== */}
        {/* SECTION 1: HERO / MAIN HEADER                            */}
        {/* ======================================================== */}
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-end pb-8 pt-16 px-4 text-center border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroPhotoUrl}
              alt="Main Hero Background"
              fill
              className="object-cover object-center object-center opacity-60 filter brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/50 to-[#050505]/95" />
          </div>

          <ScrollReveal variant="zoom-in">
            <div className="space-y-3 z-10 relative flex flex-col items-center max-w-xs mx-auto">
              <h3 className="font-cinzel text-[10px] text-white tracking-[0.25em] uppercase font-semibold">
                THE WEDDING OF
              </h3>

              <h1 className="font-playfair text-3xl sm:text-4xl text-white font-normal tracking-wide leading-tight">
                {brideName} &amp; {groomName}
              </h1>

              {/* Ecclesiastes 4:9-10 Quote */}
              <div className="text-center space-y-1 mt-2 px-2">
                <blockquote className="font-lora text-[11px] sm:text-xs text-white/90 italic leading-relaxed font-light">
                  “Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow. But woe to him who is alone when he falls and has not another to lift him up.”
                </blockquote>
                <h4 className="font-cinzel text-[9px] font-bold text-white tracking-widest pt-0.5">
                  Ecclesiastes 4:9-10
                </h4>
              </div>

              <p className="font-cinzel text-[10px] text-zinc-400 tracking-[0.2em] font-semibold pt-1">
                {eventDateStr}
              </p>

              <p className="text-[9px] text-zinc-400 font-montserrat italic tracking-widest animate-pulse pt-2">
                Scroll Down ↓
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: PERSONAL LOVE QUOTE                           */}
        {/* ======================================================== */}
        <section className="relative min-h-[75vh] flex flex-col justify-center items-center py-24 px-6 text-center border-b border-white/10 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={quoteBgUrl}
              alt="Love Quote Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505]/95" />
          </div>

          <ScrollReveal variant="zoom-in">
            <div className="max-w-sm mx-auto space-y-4 flex flex-col items-center justify-center z-10 relative">
              <div className="w-12 h-12 mx-auto rounded-full border border-white/30 bg-black/70 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                <Sparkles className="w-5 h-5" />
              </div>

              <div className="space-y-3 px-2">
                <blockquote className="font-lora text-xs sm:text-sm text-white/95 italic leading-relaxed font-light">
                  "I never feel like I'm wasting time with you. We could sit in silence for hours and it would still feel so full and good and necessary. I'm so thankful for you."
                </blockquote>
                <p className="font-cinzel text-xs text-white font-bold tracking-[0.2em] pt-1">
                  - {brideName} &amp; {groomName} -
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: GROOM & BRIDE PROFILE                         */}
        {/* ======================================================== */}
        <section id="couple" className="border-b border-white/10">
          {/* THE BRIDE */}
          <div className="relative min-h-screen flex flex-col justify-end p-6 sm:p-8 text-left items-start overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 z-0">
              <Image
                src={bridePhotoUrl}
                alt="The Bride Photo"
                fill
                className="object-cover object-center object-center filter brightness-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            </div>

            <ScrollReveal variant="slide-right">
              <div className="z-10 relative space-y-2 pb-12 flex flex-col items-start text-left max-w-xs drop-shadow-lg">
                <span className="font-cinzel text-[10px] sm:text-xs text-white tracking-[0.25em] uppercase font-bold">
                  THE BRIDE
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl text-white font-normal leading-tight">
                  {brideFullName}
                </h2>
                <div className="space-y-0.5 pt-1">
                  <p className="uppercase tracking-widest text-[9px] text-zinc-400 font-semibold">
                    PUTRI DARI
                  </p>
                  <p className="font-montserrat text-xs sm:text-sm text-white font-medium">
                    {brideParents}
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${weddingNotes?.brideInstagram?.replace("@","") || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/70 bg-transparent backdrop-blur-md hover:bg-white hover:text-black text-white text-[10px] font-cinzel tracking-widest rounded-full transition-all shadow-lg cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>INSTAGRAM</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* THE GROOM */}
          <div className="relative min-h-screen flex flex-col justify-end p-6 sm:p-8 text-right items-end overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={groomPhotoUrl}
                alt="The Groom Photo"
                fill
                className="object-cover object-center object-center filter brightness-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            </div>

            <ScrollReveal variant="slide-left">
              <div className="z-10 relative space-y-2 pb-12 flex flex-col items-end text-right max-w-xs drop-shadow-lg">
                <span className="font-cinzel text-[10px] sm:text-xs text-white tracking-[0.25em] uppercase font-bold">
                  THE GROOM
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl text-white font-normal leading-tight">
                  {groomFullName}
                </h2>
                <div className="space-y-0.5 pt-1">
                  <p className="uppercase tracking-widest text-[9px] text-zinc-400 font-semibold">
                    PUTRA DARI
                  </p>
                  <p className="font-montserrat text-xs sm:text-sm text-white font-medium">
                    {groomParents}
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${weddingNotes?.groomInstagram?.replace("@","") || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/70 bg-transparent backdrop-blur-md hover:bg-white hover:text-black text-white text-[10px] font-cinzel tracking-widest rounded-full transition-all shadow-lg cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>INSTAGRAM</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: A PEAK OF LOVE / STORY TIMELINE               */}
        {/* ======================================================== */}
        <section className="relative min-h-screen flex flex-col justify-center items-center py-20 px-6 border-b border-white/10 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={loveStoryBgUrl}
              alt="Story Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>

          <ScrollReveal variant="fade-up">
            <div className="space-y-8 max-w-sm mx-auto flex flex-col items-center z-10 relative">
              <div className="space-y-2 text-center">
                <h2 className="font-cinzel text-xl sm:text-2xl text-white font-bold tracking-[0.2em]">
                  A PEAK OF LOVE
                </h2>
                <p className="font-lora text-xs text-zinc-300 italic">
                  - {brideName} &amp; {groomName} -
                </p>
              </div>

              {/* Story Couple Photo Centered */}
              <div className="relative w-56 h-64 mx-auto rounded-3xl overflow-hidden border border-white/30 shadow-2xl shadow-white/10">
                <Image
                  src={weddingNotes.ourStoryPhotoUrl || "/indo_prewed_couple_2_1785092595152.jpg"}
                  alt="Story Photo"
                  fill
                  className="object-cover object-center object-center"
                />
              </div>

              {/* Story Milestones */}
              <div className="space-y-6 text-center font-montserrat max-w-xs mx-auto">
                {loveStory.map((item, idx) => (
                  <div key={idx} className="space-y-1 py-2 text-center">
                    <h4 className="font-cinzel text-xs font-bold text-white">{item.title}</h4>
                                        <p className="text-xs text-zinc-200 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: SAVE THE DATE & EVENT DETAILS                 */}
        {/* ======================================================== */}
        <section id="event" className="border-b border-white/10">
          {/* SAVE THE DATE */}
          <div className="relative min-h-screen flex flex-col justify-end p-6 sm:p-8 text-left items-start overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 z-0">
              <Image
                src={saveTheDateBgUrl}
                alt="Save The Date Background"
                fill
                className="object-cover object-center object-center filter brightness-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>

            <ScrollReveal variant="slide-right">
              <div className="z-10 relative space-y-4 pb-12 flex flex-col items-start text-left max-w-xs drop-shadow-lg">
                <span className="font-cinzel text-xl sm:text-2xl text-white font-bold tracking-[0.2em]">
                  SAVE THE DATE
                </span>
                
                <blockquote className="font-lora text-xs sm:text-sm text-white/95 italic leading-relaxed font-light">
                  "Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan. Sudah sewajarnya setiap upaya meraih cinta-Nya dilakukan dengan sukacita."
                </blockquote>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 w-full pt-1">
                  <div className="bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/30 text-center">
                    <span className="font-playfair text-xl font-bold text-white block">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="font-montserrat text-[8px] text-zinc-300 uppercase tracking-widest">Hari</span>
                  </div>

                  <div className="bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/30 text-center">
                    <span className="font-playfair text-xl font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="font-montserrat text-[8px] text-zinc-300 uppercase tracking-widest">Jam</span>
                  </div>

                  <div className="bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/30 text-center">
                    <span className="font-playfair text-xl font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="font-montserrat text-[8px] text-zinc-300 uppercase tracking-widest">Menit</span>
                  </div>

                  <div className="bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/30 text-center">
                    <span className="font-playfair text-xl font-bold text-white block">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="font-montserrat text-[8px] text-zinc-300 uppercase tracking-widest">Detik</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:The Wedding of ${brideName} %26 ${groomName}%0ADESCRIPTION:Pernikahan ${brideName} %26 ${groomName}%0ALOCATION:${eventLocation}%0AEND:VEVENT%0AEND:VCALENDAR`}
                    download="wedding_calendar.ics"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-white/70 hover:bg-white hover:text-black text-white font-cinzel text-[10px] font-bold tracking-[0.2em] rounded-full shadow-lg transition-all cursor-pointer backdrop-blur-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>SIMPAN TANGGAL</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* HOLY MATRIMONY & RECEPTION */}
          <div className="relative min-h-screen flex flex-col justify-center items-center py-20 px-6 space-y-14 text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={eventBgUrl}
                alt="Event Details Background"
                fill
                className="object-cover object-center object-center brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
            </div>

            {/* HOLY MATRIMONY */}
            <ScrollReveal delay={150} variant="slide-left">
              <div className="max-w-sm mx-auto space-y-4 text-center z-10 relative">
                <div className="w-10 h-10 mx-auto rounded-full border border-white/30 bg-black/70 backdrop-blur-md flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-base text-white font-bold tracking-widest">
                  {akadTitle}
                </h3>
                <div className="space-y-1 font-montserrat text-xs text-zinc-200">
                  <p className="font-bold text-sm text-white uppercase tracking-wider">{akadDateDisplay}</p>
                  <p className="text-white font-semibold">{akadTimeStr}</p>
                </div>
                <div className="space-y-1 font-montserrat text-xs">
                  <MapPin className="w-4 h-4 mx-auto text-white" />
                  <p className="font-bold text-xs text-white">{akadLocation}</p>
                  <p className="text-zinc-300 italic font-light text-[11px] leading-relaxed">
                    {/* Optional address detail if exists */}
                  </p>
                </div>
                <a
                  href={akadGmaps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 border border-white/70 bg-transparent hover:bg-white hover:text-black text-white text-[9px] font-cinzel tracking-widest rounded-full transition-all shadow-md backdrop-blur-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GOOGLE MAPS</span>
                </a>
              </div>
            </ScrollReveal>

            {/* RECEPTION */}
            <ScrollReveal delay={300} variant="slide-right">
              <div className="max-w-sm mx-auto space-y-4 text-center z-10 relative">
                <div className="w-10 h-10 mx-auto rounded-full border border-white/30 bg-black/70 backdrop-blur-md flex items-center justify-center text-white">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <h3 className="font-cinzel text-base text-white font-bold tracking-widest">
                  {resepsiTitle}
                </h3>
                <div className="space-y-1 font-montserrat text-xs text-zinc-200">
                  <p className="font-bold text-sm text-white uppercase tracking-wider">{resepsiDateDisplay}</p>
                  <p className="text-white font-semibold">{resepsiTimeStr}</p>
                </div>
                <div className="space-y-1 font-montserrat text-xs">
                  <MapPin className="w-4 h-4 mx-auto text-white" />
                  <p className="font-bold text-xs text-white">{resepsiLocation}</p>
                </div>
                <a
                  href={resepsiGmaps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 border border-white/70 bg-transparent hover:bg-white hover:text-black text-white text-[9px] font-cinzel tracking-widest rounded-full transition-all shadow-md backdrop-blur-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GOOGLE MAPS</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: DRESSCODE GUIDE                               */}
        {/* ======================================================== */}
        {dresscodes && dresscodes.length > 0 && (
        <section className="relative py-16 px-6 border-b border-white/10 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={dresscodeBgUrl}
              alt="Dresscode Background"
              fill
              className="object-cover object-center object-center opacity-65 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-[#050505]/90 to-[#050505]/95" />
          </div>

          <ScrollReveal variant="zoom-in">
            <div className="space-y-6 max-w-sm mx-auto z-10 relative">
              <div className="space-y-2">
                <Shirt className="w-6 h-6 mx-auto text-white" />
                <h2 className="font-cinzel text-lg text-white font-bold tracking-[0.2em]">
                  A GUIDE TO ATTIRE
                </h2>
                <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                  Kami dengan hormat menganjurkan para tamu untuk mengenakan warna-warna pilihan di bawah ini pada hari istimewa kami:
                </p>
              </div>

              {/* Color Palette Swatches */}
              <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                {dresscodes.map((dress: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full border border-white/30 shadow-md" style={{ backgroundColor: dress.hex || '#FFFFFF' }} />
                    <span className="text-[9px] text-zinc-300 font-montserrat">{dress.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

           )}

        {/* ======================================================== */}
        {/* SECTION 8: GALLERY & PREWEDDING CINEMATIC VIDEO          */}
        {/* ======================================================== */}
        <section id="gallery" className="relative py-20 px-6 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={ourMomentBgUrl}
              alt="Gallery Section Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>

          <ScrollReveal variant="zoom-in">
            <div className="space-y-8 max-w-sm mx-auto z-10 relative">
              <div className="space-y-2 text-center">
                <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-[9px] font-cinzel tracking-widest text-white uppercase font-bold inline-flex items-center gap-1.5 shadow-md">
                  <Camera className="w-3.5 h-3.5 text-white" /> OUR SWEET MEMORIES
                </span>
                <h2 className="font-cinzel text-xl text-white font-bold tracking-[0.2em] uppercase pt-1">
                  OUR MOMENT
                </h2>
                <p className="font-lora text-xs text-zinc-300 italic max-w-xs mx-auto">
                  "I was created in time to fill your time, and I use all the time in my life to love you."
                </p>
              </div>

              {/* Hero Slideshow + Uniform Grid */}
              <div className="space-y-3 pt-2">
                {/* Hero Slideshow */}
                <div className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group cursor-pointer">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  ))}

                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-cinzel tracking-widest text-white uppercase font-bold flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> HIGHLIGHT #0{currentSlide + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center gap-1.5">
                    {galleryPhotos.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                        className={`transition-all rounded-full ${
                          idx === currentSlide ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Asymmetrical Photo Grid */}
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
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(photo)}
                      className={`relative w-full ${aspectClass} ${colSpan} rounded-2xl overflow-hidden border border-white/25 shadow-lg cursor-pointer group transition-all duration-300 hover:border-white/60 hover:shadow-2xl`}
                    >
                      <Image
                        src={photo}
                        alt={`Gallery Photo ${idx + 1}`}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/60 text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Camera className="w-4 h-4 text-white" />
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/30 rounded-full text-[8px] font-cinzel text-zinc-200 tracking-wider font-bold">
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Relevant Prewedding Cinematic Video Showcase */}
              <div className="pt-8 space-y-4 text-center">
                <div className="space-y-1.5">
                  <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-[9px] font-cinzel tracking-widest text-white uppercase font-bold inline-flex items-center gap-1.5 shadow-md">
                    <Video className="w-3.5 h-3.5 text-white" /> CINEMATIC FILM
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-white tracking-[0.2em] uppercase pt-2">
                    A LOVE STORY IN MOTION
                  </h3>
                  <p className="font-lora text-xs text-zinc-300 italic max-w-xs mx-auto">
                    Dokumentasi film manis perjalanan cinta Jeanefer &amp; Rinaldy.
                  </p>
                </div>

                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/40 bg-black/90 group">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}
                    title="Prewedding Cinematic Film"
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
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white p-2.5 border border-white/40 bg-black/50 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Next / Prev Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryPhotos.indexOf(selectedImage);
                const prevIndex = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
                setSelectedImage(galleryPhotos[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/40 text-white hover:bg-white hover:text-black transition-all z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryPhotos.indexOf(selectedImage);
                const nextIndex = (currentIndex + 1) % galleryPhotos.length;
                setSelectedImage(galleryPhotos[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/40 text-white hover:bg-white hover:text-black transition-all z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-lg h-[80vh] overflow-hidden rounded-2xl flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Enlarged Photo"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/70 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-cinzel tracking-widest text-white font-bold">
                {galleryPhotos.indexOf(selectedImage) + 1} / {galleryPhotos.length}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 9: WEDDING GIFT / DIGITAL ENVELOPE               */}
        {/* ======================================================== */}
        <section id="gift" className="relative py-20 px-6 border-b border-white/10 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={giftBgUrl}
              alt="Gift Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>

          <ScrollReveal variant="fade-up">
            <div className="space-y-6 max-w-sm mx-auto z-10 relative">
              <h2 className="font-cinzel text-xl text-white font-bold tracking-[0.2em] uppercase">
                WEDDING GIFT
              </h2>
              <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                Tanpa mengurangi rasa hormat kami, bagi tamu yang ingin mengirimkan hadiah kepada kedua mempelai dapat mengirimnya melalui:
              </p>

              {/* Tabs: E-AMPLOP / GIFT REGISTRY */}
              <div className="flex border-b border-white/20 font-cinzel text-xs font-semibold">
                <button
                  onClick={() => setActiveTabGift("envelope")}
                  className={`flex-1 py-2.5 transition-all border-b-2 ${
                    activeTabGift === "envelope" ? "border-white text-white" : "border-transparent text-zinc-500"
                  }`}
                >
                  E-AMPLOP
                </button>
                <button
                  onClick={() => setActiveTabGift("registry")}
                  className={`flex-1 py-2.5 transition-all border-b-2 ${
                    activeTabGift === "registry" ? "border-white text-white" : "border-transparent text-zinc-500"
                  }`}
                >
                  GIFT REGISTRY
                </button>
              </div>

              {activeTabGift === "envelope" ? (
                <div className="space-y-6 pt-4 text-left">
                  {bankAccounts.map((bank: any, idx: number) => (
                    <div key={idx} className={`space-y-2 pb-4 ${idx !== bankAccounts.length - 1 ? 'border-b border-white/10' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-cinzel text-xs text-white uppercase">{bank.bankName}</span>
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-mono text-base font-bold text-white">{bank.accountNumber}</p>
                        <p className="font-montserrat text-xs text-zinc-300">a.n. {bank.recipientName || bank.accountHolder}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber, `bank-${idx}`)}
                        className="w-full py-2 border border-white/70 bg-transparent hover:bg-white hover:text-black text-white rounded-full text-[10px] font-cinzel tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                      >
                        {copiedBank === `bank-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank === `bank-${idx}` ? "TERSALIN!" : "SALIN NO. REKENING"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-left pt-4">
                  <span className="font-bold font-cinzel text-xs text-white block">ALAMAT PENGIRIMAN HADIAH</span>
                  <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                    Jl. Otto Iskandar Dinata No.3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung (Alamat Rumah Pasangan)
                  </p>
                  <button
                    onClick={() => copyToClipboard("Jl. Otto Iskandar Dinata No.3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung", "address")}
                    className="w-full py-2 border border-white/70 bg-transparent hover:bg-white hover:text-black text-white rounded-full text-[10px] font-cinzel tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                  >
                    {copiedBank === "address" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBank === "address" ? "TERSALIN!" : "SALIN ALAMAT"}</span>
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 10: RSVP & WISHES GUESTBOOK                      */}
        {/* ======================================================== */}
        <section id="wishes" className="relative py-20 px-6 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={rsvpBgUrl}
              alt="RSVP Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>

          <ScrollReveal variant="zoom-in">
            <div className="space-y-6 max-w-sm mx-auto z-10 relative">
              <div className="text-center space-y-2">
                <h2 className="font-cinzel text-xl text-white font-bold tracking-[0.2em] uppercase">
                  RSVP &amp; WISHES
                </h2>
                <p className="font-montserrat text-xs text-zinc-300 leading-relaxed font-light">
                  Bagi tamu undangan yang akan hadir di acara pernikahan kami silahkan kirimkan konfirmasi kehadiran dengan mengisi form berikut:
                </p>
              </div>

              {/* RSVP Form */}
              <form onSubmit={handleSubmitWish} className="space-y-4 font-montserrat text-xs max-w-sm mx-auto">
                <div>
                  <label className="block text-white font-semibold mb-1 text-left">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/30 focus:outline-none focus:border-white bg-black/60 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white font-semibold mb-1 text-left">Kehadiran</label>
                    <select
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/30 focus:outline-none focus:border-white bg-black/60 text-white"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-1 text-left">Jumlah Pax</label>
                    <select
                      value={formPax}
                      onChange={(e) => setFormPax(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/30 focus:outline-none focus:border-white bg-black/60 text-white"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-1 text-left">Ucapan &amp; Doa Restu</label>
                  <textarea
                    rows={3}
                    required
                    value={formWish}
                    onChange={(e) => setFormWish(e.target.value)}
                    placeholder="Tuliskan harapan dan doa untuk kedua mempelai..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/30 focus:outline-none focus:border-white bg-black/60 text-white placeholder-zinc-500"
                  />
                </div>
                <div className="flex justify-center w-full overflow-hidden my-2">
                </div>

                <button type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-transparent border border-white/80 hover:bg-white hover:text-black text-white font-cinzel text-xs font-bold tracking-widest rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "KIRIMKAN..." : "KIRIM KONFIRMASI"}</span>
                </button>
              </form>

              {/* Wishes List Feed */}
              <div className="space-y-4 font-montserrat text-xs pt-4">
                <h4 className="font-cinzel text-xs text-white tracking-wider font-bold text-center uppercase">
                  DOA &amp; UCAPAN TAMU ({comments.length})
                </h4>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                  {comments.map((item, idx) => (
                    <div key={idx} className="p-3.5 border-b border-white/10 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-playfair text-sm">{item.name}</span>
                        <span className={`px-2.5 py-0.5 text-[9px] font-semibold rounded-full border ${
    (item.rsvp_status || item.attendance || "").includes("Hadir") ? "border-emerald-400 text-emerald-300 bg-emerald-950/40" : "border-rose-400 text-rose-300 bg-rose-950/40"
  }`}>
    {item.rsvp_status || item.attendance || "Tidak Hadir"}
  </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-light text-xs">{item.comment || item.wish}</p>
                      <span className="text-[9px] text-zinc-500 block">{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================================== */}
        {/* SECTION 10: QR CODE PRESENSI                             */}
        {/* ======================================================== */}
        {isPro && (
          <section id="qrcode-section" className="relative min-h-[60vh] flex flex-col justify-center items-center py-20 px-6 text-center border-b border-white/10 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={qrBgUrl}
                alt="QR Code Background"
                fill
                className="object-cover object-center object-center opacity-40 filter grayscale"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <ScrollReveal variant="zoom-in">
              <div className="space-y-6 z-10 relative flex flex-col items-center max-w-sm mx-auto">
                <div className="space-y-2">
                  <span className="font-cinzel text-[10px] text-white tracking-[0.25em] uppercase font-semibold">
                    PRESENSI DIGITAL
                  </span>
                  <h2 className="font-playfair text-2xl sm:text-3xl text-white font-normal tracking-wide">
                    QR Code Tamu
                  </h2>
                </div>

                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" && window.location.hash.substring(1) ? window.location.hash.substring(1) : btoa(unescape(encodeURIComponent(guestName || "Tamu Undangan")))}&type=Wedding`)}`}
                      alt="QR Code Tamu"
                      className="w-40 h-40 mx-auto rounded-xl object-contain"
                    />
                    <div className="mt-3 pt-3 border-t border-dashed border-zinc-300 text-center">
                      <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-widest uppercase">
                        VIP-{guestName ? guestName.substring(0, 3).toUpperCase() : "TMU"}-{akadDateStr ? akadDateStr.split("-")[0] : "2026"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-white font-playfair tracking-wide block">{guestName || "Tamu Undangan"}</span>
                  <p className="text-[10px] text-zinc-300 font-montserrat leading-relaxed max-w-xs mx-auto italic">
                    Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi kehadiran.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 11: CLOSING SECTION                              */}
        {/* ======================================================== */}
        <section className="relative min-h-screen flex flex-col justify-end py-20 px-6 text-center space-y-8 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={closingPhotoUrl}
              alt="Closing Background"
              fill
              className="object-cover object-center object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/75" />
          </div>

          <ScrollReveal variant="fade-down">
            <div className="space-y-6 max-w-sm mx-auto z-10 relative">
              <h2 className="font-cinzel text-lg text-white font-bold tracking-[0.2em] uppercase">
                THANK YOU FOR YOUR ATTENDANCE
              </h2>
              <p className="font-lora text-xs text-zinc-200 leading-relaxed italic font-light">
                Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.
              </p>
              <div className="pt-4 space-y-2">
                <h2 className="font-playfair text-3xl sm:text-4xl text-white font-normal">
                  {brideName} &amp; {groomName}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <footer className="pt-8 border-t border-white/10 text-[10px] text-zinc-400 font-montserrat z-10 relative">
            <p>Digital Wedding Invitation © 2026 Bintarti. All rights reserved.</p>
          </footer>
        </section>

        {/* Standardized Floating Control Stack (QR Icon Vertical ABOVE Music Icon) */}
        {isOpened && (
          <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-center gap-3">
            {isPro && (
              <button
                onClick={() => setShowQrModal(true)}
                className="w-12 h-12 rounded-full bg-[#050505]/90 text-white border border-white/30 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                aria-label="QR Code Presensi"
                title="QR Code Presensi Tamu"
              >
                <QrCode className="w-5 h-5 text-current group-hover:scale-110 transition-transform" />
              </button>
            )}

            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-[#050505]/90 text-white border border-white/30 shadow-2xl flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Music"
            >
              {isPlayingAudio ? (
                <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Music className="w-5 h-5 text-zinc-300 animate-bounce" />
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
              className="relative bg-[#0F0F0F] p-6 rounded-3xl border border-white/20 shadow-2xl max-w-xs w-full text-center space-y-4 font-montserrat animate-in fade-in zoom-in-95 duration-200"
            >
              <button 
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold text-amber-400 tracking-[0.2em] uppercase">KARTU PRESENSI VIP</span>
                <h3 className="font-cinzel text-lg font-bold text-white uppercase">QR Code Tamu</h3>
              </div>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-white/20">
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
                <span className="font-cinzel text-sm font-bold text-white block">{guestName || "Tamu Undangan"}</span>
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
