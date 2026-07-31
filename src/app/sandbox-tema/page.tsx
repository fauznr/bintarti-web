"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { 
  Palette, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Search, 
  Menu, 
  X,
  Cake
} from "lucide-react";

interface SandboxTheme {
  id: string;
  title: string;
  type: "Khitan" | "Birthday" | "Aqiqah" | "Wedding";
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  description: string;
  previewUrl: string;
  previewImage?: string;
}

const sandboxThemes: SandboxTheme[] = [
  {
    id: "wedding-8",
    title: "Bintarti Wedding 8 (Crumpled Paper Vintage Edition)",
    type: "Wedding",
    accentColor: "#8B4513",
    bgColor: "bg-[#2C1A0E]",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    previewImage: "/wedding8-thumb.jpg",
    description: "Tema pernikahan vintage bertekstur kertas lecek (Crumpled Paper Edition) dengan efek velocity scroll interaktif & overlapping section. Menampilkan pengantin Raka & Sinta, foto prewedding kasual Indonesia, polaroid gallery, stamp vintage, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-8"
  },
  {
    id: "wedding-7",
    title: "Bintarti Wedding 7 (Premium Crossfade & Masonry Edition)",
    type: "Wedding",
    accentColor: "#FFFFFF",
    bgColor: "bg-[#0A0A0A]",
    textColor: "text-white",
    fontFamily: "font-serif",
    previewImage: "/wedding7-thumb.jpg",
    description: "Tema pernikahan super premium berkonsep transisi crossfade foto background 100vh yang mulus & galeri foto masonry modern. Menampilkan pengantin Aditya & Kirana, musik autoplay, sinematik video sample, amplop digital, rsvp & ucapan tamu.",
    previewUrl: "/sandbox-tema/wedding-7"
  },
  {
    id: "wedding-6",
    title: "Bintarti Wedding 6 (Premium Monochrome Edition)",
    type: "Wedding",
    accentColor: "#FFFFFF",
    bgColor: "bg-[#050505]",
    textColor: "text-white",
    fontFamily: "font-serif",
    previewImage: "/wedding6-thumb.jpg",
    description: "Tema pernikahan super premium monokrom eksklusif. Menampilkan pengantin Rizky & Amanda, lockscreen modal sinematik, foto prewedding full page setiap section, film sinematik, slideshow galeri otomatis, amplop digital & ucapan tamu.",
    previewUrl: "/sandbox-tema/wedding-6"
  },
  {
    id: "wedding-5",
    title: "Bintarti Wedding 5 (Jawa Minimalis Gen Z)",
    type: "Wedding",
    accentColor: "#3E2C23",
    bgColor: "bg-[#FAF6F0]",
    textColor: "text-[#2A1E17]",
    fontFamily: "font-serif",
    previewImage: "/wedding5-thumb.jpg",
    description: "Tema pernikahan Jawa minimalis bernuansa warm terracotta, porcelain beige & kayu jati dengan foto mempelai kasual ala Gen Z (Farhan & Nabila). Menampilkan ucapan Sugeng Rawuh, lock screen modal, background slideshow, timeline Lelakon Tresna, akad & pawiwahan, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-5"
  },
  {
    id: "wedding-4",
    title: "Bintarti Wedding 4 (Gen Z Pure White Casual)",
    type: "Wedding",
    accentColor: "#0F172A",
    bgColor: "bg-white",
    textColor: "text-slate-900",
    fontFamily: "font-sans",
    previewImage: "/wedding4-thumb.jpg",
    description: "Tema pernikahan modern Gen Z bernuansa putih bersih (Pure White Edition) dengan foto mempelai santai estetik. Menampilkan pasangan Dimas & Annisa, lock screen modal, musik interaktif, countdown timer, foto polaroid prewedding, amplop digital & buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-4"
  },
  {
    id: "wedding-3",
    title: "Bintarti Wedding 3 (Terracotta Linen Edition)",
    type: "Wedding",
    accentColor: "#B85B42",
    bgColor: "bg-[#FAF7F2]",
    textColor: "text-[#2C1A14]",
    fontFamily: "font-serif",
    previewImage: "/wedding3-thumb.jpg",
    description: "Tema pernikahan estetik bernuansa terracotta linen dengan animasi scroll elastis. Menampilkan pengantin Bagas & Bella, cover modal dengan lock screen, bingkai arch foto lengkung, ayat 1 Korintus 13:13, timeline Journey of Love, live streaming & filter IG.",
    previewUrl: "/sandbox-tema/wedding-3"
  },
  {
    id: "wedding-2",
    title: "Bintarti Wedding 2 (Terracotta Botanical Edition)",
    type: "Wedding",
    accentColor: "#C47B5A",
    bgColor: "bg-[#FAF7F2]",
    textColor: "text-[#2D2A26]",
    fontFamily: "font-serif",
    previewImage: "/wedding2-thumb.jpg",
    description: "Tema pernikahan estetik bernuansa terracotta botanical dan bingkai arch minimalis dengan animasi scroll 3D. Menampilkan pengantin Reza & Dania, font Cormorant Garamond & Great Vibes, timeline Our Story, detail akad & resepsi, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-2"
  },
  {
    id: "wedding-1",
    title: "Bintarti Wedding 1 (Modern Elegance Landing Page)",
    type: "Wedding",
    accentColor: "#C5A059",
    bgColor: "bg-slate-900",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    previewImage: "/wedding1-thumb.jpg",
    description: "Tema pernikahan mewah dan minimalis berkonsep landing page modern dengan multi-variant scroll reveal. Menampilkan pengantin Fathir & Zahra, kutipan Ar-Rum 21, timeline Our Story, detail akad & resepsi, amplop digital, dan buku tamu ucapan.",
    previewUrl: "/sandbox-tema/wedding-1"
  },
  {
    id: "khitan-1",
    title: "Bintarti Khitan 1 (Saka Niskala)",
    type: "Khitan",
    accentColor: "#D4AF37",
    bgColor: "bg-indigo-950",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    description: "Tema khitan tradisional Jawa yang mewah dengan dominasi warna biru gelap, ornamen gunungan dan wayang emas, serta kombinasi font Playfair Display & Karla.",
    previewUrl: "/sandbox-tema/khitan-1"
  },
  {
    id: "khitan-2",
    title: "Bintarti Khitan 2 (Wayang Klasik)",
    type: "Khitan",
    accentColor: "#8C6239",
    bgColor: "bg-[#ebdcc7]/60",
    textColor: "text-amber-955",
    fontFamily: "font-serif",
    description: "Tema khitan bernuansa wayang Jawa klasik dengan background kertas kuno/parchment cokelat, bingkai ornamen wayang, serta tipografi modern dari Google Fonts.",
    previewUrl: "/sandbox-tema/khitan-2"
  },
  {
    id: "khitan-3",
    title: "Bintarti Khitan 3 (Tosca Islamic)",
    type: "Khitan",
    accentColor: "#0D5C68",
    bgColor: "bg-[#e0f2f1]/80",
    textColor: "text-teal-900",
    fontFamily: "font-sans",
    description: "Tema khitan bernuansa Islami modern dengan dominasi warna hijau tosca/teal yang menawan, ornamen kubah masjid & mandala emas, serta tipografi yang disesuaikan.",
    previewUrl: "/sandbox-tema/khitan-3"
  },
  {
    id: "khitan-4",
    title: "Bintarti Khitan 4 (Crayon Playful)",
    type: "Khitan",
    accentColor: "#2563EB",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    fontFamily: "font-sans",
    description: "Tema khitan ceria bernuansa sekolah/crayon dengan background coretan kreatif (doodles) pensil, palet lukis, jangka, buku, buah apel, serta balon-balon warna cerah.",
    previewUrl: "/sandbox-tema/khitan-4"
  },
  {
    id: "khitan-5",
    title: "Bintarti Khitan 5 (Cyberpunk Gamer)",
    type: "Khitan",
    accentColor: "#38BDF8",
    bgColor: "bg-slate-950",
    textColor: "text-sky-400",
    fontFamily: "font-mono",
    description: "Tema khitan futuristik bertema game/teknologi dengan background gelap pekat, ornamen sirkuit HUD hologram biru neon, gamepad controller, serta tipografi Bungee yang berani.",
    previewUrl: "/sandbox-tema/khitan-5"
  },
  {
    id: "khitan-6",
    title: "Bintarti Khitan 6 (Javanese Classic Batik)",
    type: "Khitan",
    accentColor: "#B89047",
    bgColor: "bg-[#130F0A]",
    textColor: "text-[#F4EFE6]",
    fontFamily: "font-serif",
    description: "Tema khitan tradisional Jawa klasik dengan background batik parang cokelat gelap, ornamen mega mendung emas di atas, gunungan & keris emas di bawah, serta font Aref Ruqaa yang elegan.",
    previewUrl: "/sandbox-tema/khitan-6"
  },
  {
    id: "khitan-7",
    title: "Bintarti Khitan 7 (Beach Summer Pool Party)",
    type: "Khitan",
    accentColor: "#EA580C",
    bgColor: "bg-sky-100",
    textColor: "text-sky-900",
    fontFamily: "font-sans",
    description: "Tema khitan ceria petualangan musim panas bernuansa pantai dan kolam renang dengan background pemandangan sunset pantai tropis, tekstur air kolam, pelampung, papan selancar, serta font Atma yang playful.",
    previewUrl: "/sandbox-tema/khitan-7"
  },
  {
    id: "khitan-8",
    title: "Bintarti Khitan 8 (Islamic Calligraphy Paper)",
    type: "Khitan",
    accentColor: "#0F766E",
    bgColor: "bg-[#F3F4F6]",
    textColor: "text-[#0F766E]",
    fontFamily: "font-serif",
    description: "Tema khitan Islami elegan bersahaja dengan latar belakang tekstur kertas putih bernuansa ornamen arabes geometris, kaligrafi bulan sabit, serta font kaligrafi arab Aref Ruqaa.",
    previewUrl: "/sandbox-tema/khitan-8"
  },
  
  {
    id: "birthday-1",
    title: "Bintarti Birthday 1 (Kanaya)",
    type: "Birthday",
    accentColor: "#E91E63",
    bgColor: "bg-[#CBE5F8]",
    textColor: "text-[#1E4D2B]",
    fontFamily: "font-sans",
    description: "Tema ulang tahun anak yang ceria, penuh warna pastel, dekorasi balon, elemen magis bubble, dan musik latar ceria.",
    previewUrl: "/sandbox-tema/birthday-1"
  },
  {
    id: "birthday-2",
    title: "Bintarti Birthday 2 (Safari Animals)",
    type: "Birthday",
    accentColor: "#10B981",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-950",
    fontFamily: "font-sans",
    description: "Tema ulang tahun anak bernuansa petualangan safari dengan dekorasi hewan hutan cat air (watercolor) yang imut dan premium.",
    previewUrl: "/sandbox-tema/birthday-2"
  },
  {
    id: "birthday-3",
    title: "Bintarti Birthday 3 (Outer Space)",
    type: "Birthday",
    accentColor: "#6366F1",
    bgColor: "bg-slate-900",
    textColor: "text-indigo-200",
    fontFamily: "font-sans",
    description: "Tema luar angkasa petualangan dengan roket, planet Saturnus, satelit, bintang-bintang, dan nuansa biru langit yang imajinatif.",
    previewUrl: "/sandbox-tema/birthday-3"
  },
  {
    id: "birthday-4",
    title: "Bintarti Birthday 4 (Rock Music)",
    type: "Birthday",
    accentColor: "#84CC16",
    bgColor: "bg-zinc-900",
    textColor: "text-lime-400",
    fontFamily: "font-sans",
    description: "Tema musik rock berwarna-warni dengan gitar elektrik, keyboard piano, drum set, dan elemen graffiti yang energik dan seru.",
    previewUrl: "/sandbox-tema/birthday-4"
  },
  {
    id: "birthday-5",
    title: "Bintarti Birthday 5 (Balinese Traditional)",
    type: "Birthday",
    accentColor: "#EAB308",
    bgColor: "bg-amber-50",
    textColor: "text-amber-955",
    fontFamily: "font-serif",
    description: "Tema ulang tahun adat Bali tradisional dengan dekorasi pura, canang sari, penjor bali, tedung payung adat, dan tulisan Averia Gruesa Libre.",
    previewUrl: "/sandbox-tema/birthday-5"
  },
  {
    id: "birthday-6",
    title: "Bintarti Birthday 6 (Pink Heart Balloons)",
    type: "Birthday",
    accentColor: "#EC4899",
    bgColor: "bg-rose-50",
    textColor: "text-rose-900",
    fontFamily: "font-serif",
    description: "Tema balon hati merah muda yang romantis dan imut dengan dekorasi hadiah ulang tahun, menggunakan font Bree Serif dan Cookie.",
    previewUrl: "/sandbox-tema/birthday-6"
  },
  {
    id: "birthday-7",
    title: "Bintarti Birthday 7 (Watercolor Balloons & Confetti)",
    type: "Birthday",
    accentColor: "#3B82F6",
    bgColor: "bg-sky-50",
    textColor: "text-sky-900",
    fontFamily: "font-serif",
    description: "Tema meriah balon air dan confetti warna-warni yang ceria, menggunakan kombinasi font Bree Serif dan Beth Ellen.",
    previewUrl: "/sandbox-tema/birthday-7"
  },
  {
    id: "birthday-8",
    title: "Bintarti Birthday 8 (Construction Vehicles)",
    type: "Birthday",
    accentColor: "#F97316",
    bgColor: "bg-yellow-50",
    textColor: "text-amber-900",
    fontFamily: "font-sans",
    description: "Tema konstruksi alat berat dan jalan raya yang asyik dengan ornamen excavator dan crane, menggunakan font Bungee dan Bungee Inline.",
    previewUrl: "/sandbox-tema/birthday-8"
  },
  {
    id: "aqiqah-1",
    title: "Bintarti Aqiqah 1",
    type: "Aqiqah",
    accentColor: "#1E40AF",
    bgColor: "bg-blue-50",
    textColor: "text-slate-800",
    fontFamily: "font-sans",
    description: "Tema Aqiqah lucu dengan background awan dan bintang serta dekorasi teddy bear.",
    previewUrl: "/sandbox-tema/aqiqah-1"
  }
];

function SandboxCatalogContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [activeTab, setActiveTab] = useState<"Wedding" | "Khitan" | "Birthday" | "Aqiqah">("Wedding");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter themes
  const filteredThemes = sandboxThemes.filter((theme) => {
    const matchesCategory = theme.type === activeTab;
    const matchesSearch = theme.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          theme.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          theme.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-primary/20 selection:text-primary bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md border border-slate-100 flex items-center justify-center bg-white p-0.5">
              <Image src="/logo.png" alt="Bintarti Logo" width={40} height={40} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-accent">
                Bintarti
              </span>
              <span className="text-[10px] text-slate-800 font-bold -mt-1">
                Undangan Digital
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <Link href="/katalog" className="hover:text-primary transition-colors">
              Katalog Resmi
            </Link>
            <Link href="/formulir" className="hover:text-primary transition-colors">
              Formulir
            </Link>
            <Link href="/cek-undangan" className="hover:text-primary transition-colors">
              Cek Undangan
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Lingkungan Sandbox
            </div>
          </div>

          {/* Mobile Actions Menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-enter md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 z-50">
            <Link 
              href="/" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <Link 
              href="/katalog" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Katalog Resmi
            </Link>
            <Link 
              href="/formulir" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Formulir
            </Link>
            <Link 
              href="/cek-undangan" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Cek Undangan
            </Link>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-blue-700 font-accent text-xs font-semibold mb-4 tracking-wider uppercase">
              <Palette className="w-3.5 h-3.5" />
              Developer Sandbox
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-accent">
              🧪 Sandbox Tema Bintarti
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-sans">
              Area pengujian terisolasi untuk tema-tema undangan digital Next.js. Semua data tamu, rsvp, dan form komentar di sandbox menggunakan mock data lokal secara interaktif.
            </p>
          </div>
        </section>

        {/* Filter & Grid Showcase Section */}
        <section className="py-12 max-w-7xl mx-auto px-6">
          {/* Search & Tabs Controls */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 border-b border-slate-200 pb-8">
            {/* Tabs selector */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              {(["Wedding", "Khitan", "Aqiqah", "Birthday"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer ${
                    activeTab === tab 
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab === "Wedding" ? "Wedding (Pernikahan)" : tab === "Birthday" ? "Birthday (Ulang Tahun)" : tab}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Cari tema sandbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme) => {
              const previewUrlWithAdmin = isAdmin ? `/sandbox-tema/${theme.id}?admin=true` : `/sandbox-tema/${theme.id}`;
              return (
                <div 
                  key={theme.id} 
                  className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Template Visual Mockup Display */}
                    <div className="w-full aspect-square rounded-2xl border border-slate-200 relative overflow-hidden group bg-slate-50 flex items-center justify-center">
                      {theme.previewImage ? (
                        <Image 
                          src={theme.previewImage} 
                          alt={theme.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className={`w-full h-full ${theme.bgColor} p-6 flex flex-col justify-between`}>
                          <span className="self-start px-3 py-1 rounded-full bg-white/90 text-[10px] font-black text-blue-700 border border-slate-200 shadow-xs uppercase">
                            {theme.type}
                          </span>

                          <div className="my-auto text-center space-y-2">
                            <p className={`text-[9px] tracking-widest uppercase opacity-75 font-semibold ${theme.textColor}`}>
                              {theme.type === "Aqiqah" ? "Tasyakuran Aqiqah" : theme.type === "Khitan" ? "Walimatul Khitan" : "Happy Birthday"}
                            </p>
                            <h4 className={`text-xl font-bold tracking-tight ${theme.textColor} ${theme.fontFamily}`}>
                              {theme.type === "Khitan" ? "Saka Niskala" : "Kanaya Putri"}
                            </h4>
                            <div className="w-8 h-0.5 mx-auto opacity-35" style={{ backgroundColor: theme.accentColor }} />
                          </div>

                          <div className="flex justify-between items-center z-10">
                            <span className="text-[9px] text-slate-700 font-bold">Bintarti Invitation</span>
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: theme.accentColor }} />
                          </div>
                        </div>
                      )}

                      {/* Quick Preview overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center transition-all duration-300 rounded-2xl">
                        <Link 
                          href={previewUrlWithAdmin}
                          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform cursor-pointer"
                        >
                          {isAdmin ? "✏️ Edit Desain" : "Lihat Demo Live"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mt-5 mb-2 tracking-wide font-accent">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans mb-4">
                      {theme.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <Link 
                      href={previewUrlWithAdmin}
                      className="text-xs text-blue-700 hover:text-primary font-bold flex items-center gap-1 transition-colors"
                    >
                      {isAdmin ? "✏️ Edit Desain" : "Lihat Demo Live"} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <a 
                      href={`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20tertarik%20dengan%20katalog%20tema%20sandbox%20${encodeURIComponent(theme.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-700 hover:text-primary font-bold flex items-center gap-1 transition-colors"
                    >
                      Pesan Sekarang <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state when no search matches */}
          {filteredThemes.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-slate-700 mt-4">Tema tidak ditemukan</h3>
              <p className="text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-sm border border-slate-800">
                <Image src="/logo.png" alt="Bintarti Logo" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold tracking-wide text-white font-accent">Bintarti</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-sans">
              Bintarti adalah platform pembuat undangan digital modern yang elegan, efisien, dan ramah lingkungan. Kami berkomitmen memberikan layanan terbaik untuk menyukseskan acara spesial Anda.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-accent">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda Utama</Link></li>
              <li><Link href="/katalog" className="hover:text-white transition-colors">Katalog Tema</Link></li>
              <li><a href="https://wa.me/6285158573677" className="hover:text-white transition-colors">Hubungi Admin</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-accent">Hubungi Kami</h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>WhatsApp: +62 851-5857-3677</li>
              <li>Email: support@bintarti.com</li>
              <li>Jam Kerja: 08.00 - 21.00 WIB</li>
              <li>Bandung, Jawa Barat, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <span>&copy; {new Date().getFullYear()} Bintarti. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Syarat &amp; Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SandboxCatalog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Memuat Sandbox...</p>
        </div>
      </div>
    }>
      <SandboxCatalogContent />
    </Suspense>
  );
}
