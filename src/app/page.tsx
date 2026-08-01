import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Star,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  Award,
  ShieldCheck
} from "lucide-react";
import { services, features, testimonials, faqs } from "../data/landing";
import MobileNavMenu from "./components/MobileNavMenu";
import FaqAccordion from "./components/FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bintarti - Jasa Undangan Digital Premium & Buku Tamu QR Code",
  description: "Platform pembuatan undangan digital elegan & buku tamu digital QR Code. Dilengkapi dengan RSVP real-time, import tamu masal, kelola link otomatis, dan analitik kehadiran. Cocok untuk Pernikahan, Khitanan, Aqiqah, dan Ulang Tahun.",
  keywords: [
    "undangan digital",
    "jasa undangan digital",
    "buku tamu digital",
    "scan qr code tamu",
    "undangan khitanan digital",
    "undangan aqiqah digital",
    "undangan pernikahan online",
    "rsvp online",
    "undangan digital bandung"
  ],
  alternates: {
    canonical: "https://bintarti.store",
  },
  openGraph: {
    title: "Bintarti - Jasa Undangan Digital Premium & Buku Tamu QR Code",
    description: "Platform pembuatan undangan digital elegan & buku tamu digital QR Code. Dilengkapi dengan RSVP real-time, import tamu masal, kelola link otomatis, dan analitik kehadiran.",
    url: "https://bintarti.store",
    siteName: "Bintarti Undangan Digital",
    locale: "id_ID",
    type: "website",
  }
};

const mobileLinks = [
  { href: "#layanan", label: "Layanan", isHash: true },
  { href: "#fitur", label: "Fitur", isHash: true },
  { href: "/katalog", label: "Katalog" },
  { href: "/formulir", label: "Formulir" },
  { href: "/cek-undangan", label: "Cek Undangan" },
  { href: "#testimoni", label: "Testimoni", isHash: true },
  { href: "#faq", label: "FAQ", isHash: true },
];

const WA_LINK = "https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20membuat%20undangan%20digital";

export default function Home() {
  return (
    <div className="animated-bg min-h-screen text-slate-900 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Bintarti Undangan Digital",
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "url": "https://bintarti.store",
            "description": "Platform pembuatan undangan digital elegan & buku tamu digital QR Code dengan RSVP real-time, kelola tamu masal, dan analitik kehadiran.",
            "offers": {
              "@type": "Offer",
              "price": "99000",
              "priceCurrency": "IDR",
              "priceValidUntil": "2027-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "120"
            }
          })
        }}
      />

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary-light/10 rounded-full filter blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-blue-300/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />

      {/* 2. Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
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
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <a href="#layanan" className="hover:text-primary transition-colors">Layanan</a>
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <Link href="/katalog" className="hover:text-primary transition-colors">Katalog</Link>
            <Link href="/formulir" className="hover:text-primary transition-colors">Formulir</Link>
            <Link href="/cek-undangan" className="hover:text-primary transition-colors">Cek Undangan</Link>
            <a href="#testimoni" className="hover:text-primary transition-colors">Testimoni</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Buat Undangan
            </a>
          </div>

          {/* Mobile Menu (Client Component) */}
          <MobileNavMenu
            links={mobileLinks}
            ctaHref={WA_LINK}
            ctaLabel="Buat Undangan Sekarang"
          />
        </div>
      </header>

      <main id="main-content">
      {/* 3. Hero Section (Simpel & Centered) */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-blue-700 font-accent text-xs font-semibold mb-8 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Undangan Digital Modern untuk Setiap Momen Istimewa
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6 max-w-3xl">
            Buat Undangan Digital Impianmu
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-slate-700 max-w-2xl mb-10 leading-relaxed font-sans">
            Buat undangan digital Pernikahan, Khitanan, Aqiqah, dan Ulang Tahun yang elegan. Lengkap dengan RSVP real-time, import tamu masal, kelola link otomatis, serta buku tamu digital QR Code scanner (PRO).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              Buat Undangan Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/katalog"
              className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center gap-2 border border-slate-200 hover:-translate-y-0.5 transition-all duration-300"
            >
              Lihat Katalog
            </Link>
            <Link
              href="/cek-undangan"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-lg flex items-center justify-center gap-2 border border-blue-200 hover:-translate-y-0.5 transition-all duration-300"
            >
              <CheckCircle2 className="w-5 h-5" /> Cek Undangan
            </Link>
          </div>

          {/* Hero Social Proof / Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-slate-200 pt-10 w-full max-w-2xl">
            <div>
              <p className="text-3xl font-extrabold text-blue-700 font-accent">10k+</p>
              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">Undangan Dibuat</p>
            </div>
            <div className="border-r border-slate-200 hidden sm:block" />
            <div>
              <p className="text-3xl font-extrabold text-blue-700 font-accent">99.8%</p>
              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">Kepuasan Pelanggan</p>
            </div>
            <div className="border-r border-slate-200 hidden sm:block" />
            <div>
              <p className="text-3xl font-extrabold text-blue-700 font-accent">24/7</p>
              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">Dukungan Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Layanan Section */}
      <section id="layanan" className="py-20 md:py-28 bg-slate-100/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-xs uppercase tracking-widest text-blue-700 font-bold mb-3 font-accent">Format Momen Anda</h2>
            <p className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Layanan Undangan Premium
            </p>
            <p className="text-base text-slate-700 leading-relaxed font-sans">
              Kami melayani pembuatan undangan digital interaktif untuk berbagai jenis momen kebahagiaan Anda dengan hasil setara studio desain profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="bg-white border border-slate-200/80 backdrop-blur-md shadow-lg shadow-slate-200/50 rounded-3xl p-8 flex flex-col items-center lg:items-start text-center lg:text-left h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${svc.color} flex items-center justify-center shadow-sm mb-6`}>
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 tracking-wide">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">
                    {svc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Fitur Unggulan Section */}
      <section id="fitur" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col text-center lg:text-left items-center lg:items-start">
              <h2 className="text-xs uppercase tracking-widest text-blue-700 font-bold mb-3 font-accent">Fitur Melimpah</h2>
              <p className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">
                Teknologi &amp; Fitur Unggulan Terbaik
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                Setiap undangan dibekali dengan dashboard mandiri untuk mengelola tamu, RSVP real-time terintegrasi otomatis, buku tamu digital QR Code, serta visualisasi grafik analitik kehadiran.
              </p>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4 text-left">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-accent">Selalu Up-to-Date</h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Kami selalu memperbarui engine web kami agar undangan lancar diakses di peramban Chrome, Safari, Firefox, dan platform Android/iOS terbaru.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Features Grid Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-slate-200 rounded-2xl shadow-md shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-4 mb-2 tracking-wide font-accent">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>



      {/* 7. Testimoni Section (Simpel Grid) */}
      <section id="testimoni" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-700 font-bold mb-3 font-accent">Kisah Bahagia</h2>
            <p className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Apa Kata Klien Kami?
            </p>
            <p className="text-base text-slate-700 font-sans">
              Kepuasan Anda adalah kebanggaan kami. Simak testimoni nyata dari klien bahagia kami.
            </p>
          </div>

          {/* Simple Grid display of testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi) => (
              <div
                key={testi.id}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg shadow-slate-200/50 relative flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-amber-500 mb-5">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  <p className="text-base text-slate-800 italic leading-relaxed font-sans mb-6">
                    &quot;{testi.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg border border-primary/20 shadow-inner">
                      {testi.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 font-accent">
                        {testi.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[9px] font-bold text-blue-700">
                    {testi.event}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-slate-100/50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-700 font-bold mb-3 font-accent">FAQ</h2>
            <p className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </p>
            <p className="text-base text-slate-700 font-sans">
              Ada yang kurang jelas? Temukan jawaban lengkap atas pertanyaan-pertanyaan umum seputar layanan Bintarti di bawah ini.
            </p>
          </div>

          {/* FAQ Accordion (Client Component) */}
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* 9. CTA Akhir Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-tr from-primary via-blue-600 to-indigo-600 text-white text-center">

        {/* Decorative circle elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 filter blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-light/10 rounded-full -translate-x-1/3 translate-y-1/3 filter blur-xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 shadow-lg">
            <Sparkles className="w-8 h-8 text-primary-light" />
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight max-w-2xl font-heading">
            Siap Membuat Undangan Digital yang Berkesan?
          </h2>

          <p className="text-lg text-blue-100 max-w-xl mb-12 leading-relaxed font-sans">
            Klik tombol di bawah ini sekarang juga untuk menghubungi admin kami dan wujudkan undangan digital impian Anda dengan cepat, mudah, dan premium.
          </p>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 rounded-2xl bg-white hover:bg-slate-100 text-primary hover:text-blue-600 font-extrabold text-xl shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
          >
            PESAN SEKARANG
          </a>

          <div className="mt-8 flex justify-center items-center gap-6 text-xs text-blue-100">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Pembayaran Aman</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Jaminan Kualitas 100%</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Bebas Revisi Data</span>
          </div>

        </div>
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

          {/* Tautan Cepat */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-accent">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li><a href="#layanan" className="hover:text-white transition-colors">Layanan Kami</a></li>
              <li><a href="#fitur" className="hover:text-white transition-colors">Fitur Unggulan</a></li>
              <li><a href="#testimoni" className="hover:text-white transition-colors">Testimoni Klien</a></li>
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

      {/* 10. WhatsApp Floating Button */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/35 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 group"
        aria-label="Contact support on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping group-hover:animate-none pointer-events-none" />
        <MessageCircle className="w-8 h-8 fill-white/10" />
      </a>

    </div>
  );
}
