import {
  Heart,
  Crown,
  Cake,
  Baby,
  Sparkles,
  Music,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  MailOpen,
  Camera,
  Users,
  BarChart3
} from "lucide-react";

import { ElementType } from "react";

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: ElementType;
  color: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  event: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Undangan Pernikahan",
    description: "Desain romantis, premium, dan anggun untuk merayakan hari bersatunya cinta Anda berdua.",
    icon: Heart,
    color: "from-pink-500/20 to-rose-500/20 text-rose-600"
  },
  {
    id: 2,
    title: "Undangan Khitanan",
    description: "Pilihan tema menarik dan ceria untuk menyebarkan kabar syukuran khitanan putra Anda.",
    icon: Crown,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-600"
  },
  {
    id: 3,
    title: "Undangan Ulang Tahun",
    description: "Desain playful dan meriah yang disukai anak-anak, remaja, hingga acara ultah dewasa.",
    icon: Cake,
    color: "from-purple-500/20 to-indigo-500/20 text-indigo-600"
  },
  {
    id: 4,
    title: "Undangan Aqiqah",
    description: "Nuansa lembut, islami, dan menggemaskan untuk menyambut kehadiran buah hati tercinta.",
    icon: Baby,
    color: "from-sky-500/20 to-cyan-500/20 text-sky-600"
  },
  {
    id: 5,
    title: "Undangan Custom",
    description: "Bebas berkreasi dengan struktur halaman, musik, dan fitur sesuai dengan konsep impian Anda.",
    icon: Sparkles,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600"
  }
];

export const features = [
  { title: "Buku Tamu QR Code", desc: "Pemindai QR Code tamu di pintu masuk untuk pencatatan kehadiran yang instan dan profesional (Anti-Duplikasi).", icon: Camera },
  { title: "RSVP & Ucapan Real-Time", desc: "Konfirmasi kehadiran dan pesan doa dari tamu terintegrasi otomatis ke dashboard pengelolaan Anda.", icon: CheckCircle2 },
  { title: "Kelola Penerima Tamu", desc: "Input nama tamu satuan/masal, generate link personal, dan bagikan undangan lewat WhatsApp secara terorganisir.", icon: Users },
  { title: "Statistik & Analitik Live", desc: "Grafik donat interaktif memantau persentase kehadiran tamu dan status pengiriman pesan WhatsApp secara real-time.", icon: BarChart3 },
  { title: "Background Musik Kustom", desc: "Pengaturan musik latar otomatis berformat MP3 yang langsung diputar saat undangan dibuka oleh tamu.", icon: Music },
  { title: "Peta Navigasi Lokasi", desc: "Integrasi Google Maps sekali klik memudahkan tamu undangan menjangkau lokasi acara Anda dengan akurat.", icon: MapPin },
  { title: "Amplop & Rekening Digital", desc: "Fasilitas pencantuman nomor rekening bank, e-wallet, dan alamat kado fisik untuk memudahkan tamu memberi hadiah.", icon: MailOpen },
  { title: "Galeri Foto Premium", desc: "Pamerkan kumpulan foto dan video terbaik Anda dengan slider galeri beresolusi tinggi yang elegan.", icon: ImageIcon }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah & Dimas",
    role: "Pengantin Pernikahan",
    quote: "Bintarti sangat membantu! Desainnya sangat elegan dan fitur RSVP online-nya memudahkan kami mendata tamu secara real-time. Teman-teman memuji undangannya sangat premium.",
    rating: 5,
    avatar: "👩‍❤️‍👨",
    event: "Wedding White Blue"
  },
  {
    id: 2,
    name: "Bapak Ahmad Subagja",
    role: "Orang Tua Wali",
    quote: "Praktis sekali. Kami kirim undangan lewat WhatsApp ke ratusan kerabat hanya dalam 5 menit. Respon tamu cepat terkumpul dan kami tahu pasti siapa saja yang hadir.",
    rating: 5,
    avatar: "👨",
    event: "Undangan Syukuran Khitan"
  },
  {
    id: 3,
    name: "Rian Hidayat",
    role: "Panitia Event Ultah",
    quote: "Suka banget sama template minimalisnya. Keren dan responsif banget di handphone temen-temen. Tombol petunjuk arah Google Maps-nya juga sangat akurat.",
    rating: 5,
    avatar: "🧑",
    event: "Modern Minimalist Birthday"
  }
];

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "Bagaimana cara melakukan pemesanan?",
    answer: "Caranya sangat mudah. Cukup klik tombol 'PESAN SEKARANG' untuk terhubung ke WhatsApp Admin kami. Pilih template favorit Anda, lalu kirimkan data acara seperti nama, tanggal, waktu, dan lokasi. Tim kami akan menyiapkan draft undangan Anda dalam hitungan menit."
  },
  {
    id: 2,
    question: "Berapa lama proses pengerjaan undangan?",
    answer: "Proses pembuatan undangan digital di Bintarti cepat 1x24 Jam Sesuai No urut orderan. Begitu data Anda kirimkan lengkap, undangan digital Anda siap dipublikasikan dan bisa langsung dibagikan."
  },
  {
    id: 3,
    question: "Apakah saya bisa memesan desain custom khusus?",
    answer: "Tentu saja! Anda bisa memilih template custom atau meminta modifikasi latar musik, susunan acara, galeri foto sesuai keinginan."
  },
  {
    id: 4,
    question: "Apakah ada batas revisi data setelah undangan aktif?",
    answer: "Tidak ada batasan! Kami memberikan garansi revisi data tanpa batas. Anda bisa mengubah tanggal, waktu, lokasi, menambahkan galeri foto baru, atau memperbarui informasi RSVP kapan saja secara gratis melalui dashboard mandiri atau dibantu admin."
  }
];
