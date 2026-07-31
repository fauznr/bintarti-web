"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Menu,
  X,
  Phone,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSearch,
  Inbox,
  RefreshCw
} from "lucide-react";


interface InvitationResult {
  found: boolean;
  id?: string;
  source: string; // "Khitan" or "Birthday"
  namaAnak: string;
  tema: string;
  status: string;
  linkUndangan: string;
  linkTamu: string;
  tanggalAcara: string;
  waktuAcara: string;
  tempatAcara: string;
}

export default function CekUndangan() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<"whatsapp" | "shopee">("whatsapp");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<InvitationResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const getInvitationId = (result: InvitationResult) => {
    if (result.id) return result.id;
    const link = result.linkTamu || result.linkUndangan || "";
    try {
      const url = new URL(link);
      let pathname = url.pathname.replace(/^\/|\/$/g, "");
      if (pathname.startsWith("cek-undangan/")) {
        pathname = pathname.replace(/^cek-undangan\//, "");
      }
      if (pathname) {
        return pathname;
      }
    } catch (e) {
      // ignore URL parsing error
    }
    return `${result.source.toLowerCase()}_${result.namaAnak.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    try {
      const params = new URLSearchParams({
        type: searchType,
        query: searchQuery.trim(),
        _t: Date.now().toString()
      });

      const res = await fetch(`/api/invitations/search?${params.toString()}`, { cache: "no-store" });
      let allResults: InvitationResult[] = [];
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          allResults = data;
        } else if (data && data.found) {
          allResults = [data];
        }
      }

      setResults(allResults);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleManage = (result: InvitationResult) => {
    const id = getInvitationId(result);
    // Save to localStorage so child page can load it instantly
    const savedData = {
      ...result,
      originalSearchQuery: searchQuery.trim(),
      originalSearchType: searchType
    };
    localStorage.setItem(`bintarti_active_invitation_${id}`, JSON.stringify(savedData));
    localStorage.setItem("bintarti_active_invitation_latest", JSON.stringify(savedData));
    // Redirect
    router.push(`/cek-undangan/${id}`);
  };

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    const configs: Record<string, { color: string; icon: ReactNode; label: string }> = {
      selesai: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Selesai"
      },
      revisi: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Revisi"
      }
    };
    return configs[s] || {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Clock className="w-4 h-4" />,
      label: "Diproses"
    };
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-primary/20 selection:text-primary bg-slate-50/50">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <a href="/katalog" className="hover:text-primary transition-colors">
              Katalog
            </a>
            <a href="/formulir" className="hover:text-primary transition-colors">
              Formulir
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20cek%20status%20undangan%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-500" /> Bantuan Admin
            </a>
          </div>

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
            <Link href="/" className="text-slate-800 font-bold py-2 border-b border-slate-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <a href="/katalog" className="text-slate-800 font-bold py-2 border-b border-slate-200">
              Katalog
            </a>
            <a href="/formulir" className="text-slate-800 font-bold py-2 border-b border-slate-200">
              Formulir
            </a>
            <a
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20cek%20status%20undangan%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-500" /> Tanya Admin via WA
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Lacak Pesanan
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 font-heading">
            Cek Status Undangan
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2">
            Masukkan nomor WhatsApp atau nomor pesanan Shopee Anda untuk melihat status undangan dan mendapatkan link undangan.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 md:px-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Cari Undangan Anda</h3>
                <p className="text-xs text-slate-400">Pilih metode pencarian dan masukkan data Anda</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            {/* Search Type Toggle */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setSearchType("whatsapp"); setSearchQuery(""); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  searchType === "whatsapp"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                No. WhatsApp
              </button>
              <button
                onClick={() => { setSearchType("shopee"); setSearchQuery(""); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  searchType === "shopee"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                No. Pesanan Shopee
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "whatsapp"
                    ? "Masukkan nomor WhatsApp, contoh: 081234567890"
                    : "Masukkan nomor pesanan Shopee, contoh: 260612ABC123"
                }
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Cari Undangan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <>
          {isSearching && (
            <div className="mt-8 space-y-4 fade-in">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/4" />
                  </div>
                  <div className="h-7 bg-slate-200 rounded-full w-20" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-6 bg-slate-50 rounded-xl p-3 border border-slate-100 animate-pulse font-sans leading-relaxed">
                ⚙️ Menghubungkan ke database Google Sheets... <br />
                <span className="text-[11px] text-slate-400">Proses pencarian pertama setelah beberapa lama mungkin membutuhkan waktu 2-3 detik untuk inisialisasi server. Terima kasih atas kesabaran Anda.</span>
              </p>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center shadow-lg shadow-slate-100 flex flex-col items-center fade-in">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Data Tidak Ditemukan</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                Kami tidak menemukan data undangan dengan {searchType === "whatsapp" ? "nomor WhatsApp" : "nomor pesanan Shopee"} tersebut. Pastikan data yang Anda masukkan sudah benar atau hubungi admin untuk bantuan.
              </p>
              <a
                href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20mengecek%20status%20undangan%20saya%20tapi%20data%20tidak%20ditemukan."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Hubungi Admin
              </a>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="mt-8 space-y-6 fade-in">
              {results.map((result, idx) => {
                const statusCfg = getStatusConfig(result.status);
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden scale-in"
                  >
                    {/* Result Header */}
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          result.source === "Khitan" ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"
                        }`}>
                          {result.source === "Khitan" ? "🎉" : "🎂"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{result.namaAnak || "—"}</h3>
                          <p className="text-xs text-slate-400">Undangan {result.source}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    {/* Result Body */}
                    <div className="p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tema Pilihan</span>
                          <span className="text-sm font-bold text-slate-700">{result.tema || "—"}</span>
                        </div>
                        <button
                          onClick={() => handleManage(result)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 hover:shadow-md cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Kelola Undangan & Tamu
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-3">ℹ️ Informasi Penting</h3>
          <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              Gunakan nomor WhatsApp atau nomor pesanan Shopee yang sama saat Anda mengisi formulir.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              Link undangan akan tersedia setelah admin menyelesaikan pembuatan undangan Anda.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              Anda dapat mengelola nama-nama penerima undangan (tamu), memantau konfirmasi kedatangan, dan membagikan undangan di halaman kelola masing-masing.
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Bintarti Logo" width={32} height={32} className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain" />
            <span className="text-white font-bold tracking-wide font-accent">Bintarti Undangan Digital</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Bintarti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
