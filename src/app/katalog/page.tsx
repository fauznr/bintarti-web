"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { 
  Palette, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Search,
  Menu,
  X
} from "lucide-react";
import { templates } from "../../data/katalog";


export default function Katalog() {
  const [activeTab, setActiveTab] = useState<"Semua" | "Wedding" | "Khitan" | "Birthday" | "Aqiqah" | "Custom">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = activeTab === "Semua" ? true : tpl.category === activeTab;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
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
            <a href="/formulir" className="hover:text-primary transition-colors">
              Formulir
            </a>
            <a href="/cek-undangan" className="hover:text-primary transition-colors">
              Cek Undangan
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20membuat%20undangan%20digital"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Hubungi Kami
            </a>
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
            <a 
              href="/formulir" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Formulir
            </a>
            <a 
              href="/cek-undangan" 
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Cek Undangan
            </a>
            <a 
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20membuat%20undangan%20digital"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-center shadow-lg shadow-primary/25 transition-all"
            >
              Hubungi Kami
            </a>
          </div>
        )}
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-blue-700 font-accent text-xs font-semibold mb-4 tracking-wider uppercase">
            <Palette className="w-3.5 h-3.5" />
            Koleksi Premium
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-accent">
            Katalog Tema Undangan
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-sans">
            Pilih tema undangan digital favorit Anda. Kami menawarkan desain premium, responsif, elegan, dan bisa disesuaikan sepenuhnya untuk setiap jenis momen.
          </p>
        </div>
      </section>

      {/* Filter & Grid Showcase Section */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {/* Search & Tabs Controls */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 border-b border-slate-200 pb-8">
          {/* Tabs selector */}
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            {(["Semua", "Wedding", "Khitan", "Birthday", "Aqiqah", "Custom"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border cursor-pointer ${
                  activeTab === tab 
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab === "Aqiqah" ? "Aqiqah (Soon)" : tab}
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
              placeholder="Cari tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Templates Grid or Coming Soon message */}
        {activeTab === "Aqiqah" ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-6 border border-dashed border-slate-300 rounded-[32px] bg-slate-50/50">
            <span className="p-4 bg-primary/10 rounded-full text-primary mb-6">
              <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-accent text-center mb-3">
              Tema {activeTab}: Coming Soon!
            </h2>
            <p className="text-slate-600 text-center max-w-md mb-8 leading-relaxed font-sans">
              Kami sedang menyiapkan koleksi tema undangan aqiqah yang cantik, islami, dan penuh kebahagiaan untuk menyambut kelahiran buah hati Anda.
            </p>
            <a 
              href={`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20tertarik%20dengan%20katalog%20tema%20${activeTab.toLowerCase()}%20yang%20akan%20datang`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              Hubungi Admin untuk Info
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Template Visual Mockup Display */}
                    <div className="w-full aspect-square rounded-2xl border border-slate-200 relative overflow-hidden group bg-slate-50 flex items-center justify-center">
                      {tpl.previewImage ? (
                        <Image 
                          src={tpl.previewImage} 
                          alt={tpl.name} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          priority={tpl.id <= 6}
                        />
                      ) : (
                        <div className={`w-full h-full ${tpl.bgColor} p-6 flex flex-col justify-between`}>
                          <span className="self-start px-3 py-1 rounded-full bg-white text-[10px] font-bold text-blue-700 border border-slate-200 shadow-xs">
                            {tpl.category}
                          </span>

                          <div className="my-auto text-center space-y-2">
                            <p className={`text-[9px] tracking-widest uppercase opacity-75 font-semibold ${tpl.textColor}`}>
                              {tpl.category === "Wedding" ? "The Wedding of" : tpl.category === "Khitan" ? "Walimatul Khitan" : tpl.category === "Aqiqah" ? "Tasyakuran Aqiqah" : tpl.category === "Birthday" ? "Happy Birthday" : "Special Event"}
                            </p>
                            <h4 className={`text-xl font-bold tracking-tight ${tpl.textColor} ${tpl.fontFamily}`}>
                              {tpl.category === "Wedding" ? "Sarah & Dimas" : tpl.category === "Khitan" ? "Fahri Ramadhan" : tpl.category === "Aqiqah" ? "Baby Aisyah" : tpl.category === "Birthday" ? "Rian Hidayat" : "Gala Launching"}
                            </h4>
                            <div className="w-8 h-0.5 mx-auto opacity-35" style={{ backgroundColor: tpl.accentColor }} />
                          </div>

                          <div className="flex justify-between items-center z-10">
                            <span className="text-[9px] text-slate-700 font-bold">Bintarti Invitation</span>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.accentColor }} />
                          </div>
                        </div>
                      )}

                      {/* Quick Preview overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center transition-all duration-300 rounded-2xl">
                        <div className="flex flex-col items-center gap-3">
                        <a 
                          href={tpl.demoUrl || (tpl.name.includes("Custom") ? `https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20konsultasi%20desain%20${encodeURIComponent(tpl.name)}` : `/demo?theme=${tpl.id}`)}
                          target={(tpl.demoUrl?.startsWith("http") || tpl.name.includes("Custom")) ? "_blank" : undefined}
                          rel={(tpl.demoUrl?.startsWith("http") || tpl.name.includes("Custom")) ? "noopener noreferrer" : undefined}
                          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:-translate-y-0.5"
                        >
                          {tpl.demoUrl ? "Lihat Demo Live" : tpl.name.includes("Custom") ? "Konsultasi Custom" : "Lihat Demo Live"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mt-5 mb-2 tracking-wide font-accent">
                      {tpl.name}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans mb-4">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <a 
                      href={tpl.demoUrl || (tpl.name.includes("Custom") ? `https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20konsultasi%20desain%20${encodeURIComponent(tpl.name)}` : `/demo?theme=${tpl.id}`)}
                      target={(tpl.demoUrl?.startsWith("http") || tpl.name.includes("Custom")) ? "_blank" : undefined}
                      rel={(tpl.demoUrl?.startsWith("http") || tpl.name.includes("Custom")) ? "noopener noreferrer" : undefined}
                      className="text-xs text-blue-700 hover:text-primary font-bold flex items-center gap-1 transition-colors"
                    >
                      {tpl.name.includes("Custom") ? "Konsultasi Custom" : "Lihat Demo Live"} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href={`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20tertarik%20dengan%20katalog%20tema%20${encodeURIComponent(tpl.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-700 hover:text-primary font-bold flex items-center gap-1 transition-colors"
                    >
                      Pesan Sekarang <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state when no search matches */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <span className="text-4xl">🔍</span>
                <h3 className="text-lg font-bold text-slate-700 mt-4">Tema tidak ditemukan</h3>
                <p className="text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </>
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
