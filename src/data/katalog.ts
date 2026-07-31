export interface Template {
  id: number;
  name: string;
  category: "Wedding" | "Khitan" | "Birthday" | "Aqiqah" | "Custom";
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  description: string;
  previewImage?: string;
  demoUrl?: string;
}

export const templates: Template[] = [
  {
    id: 101,
    name: "Wedding 1",
    category: "Wedding",
    accentColor: "#C5A059",
    bgColor: "bg-zinc-950",
    textColor: "text-zinc-100",
    fontFamily: "font-serif",
    description: "Desain undangan pernikahan eksklusif berkonsep Monochrome Black & White modern yang terinspirasi dari Jessica Bevitation.",
    previewImage: "/wedding1-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-1"
  },
  {
    id: 102,
    name: "Wedding 2",
    category: "Wedding",
    accentColor: "#C47B5A",
    bgColor: "bg-[#FAF7F2]",
    textColor: "text-[#2D2A26]",
    fontFamily: "font-serif",
    description: "Tema pernikahan estetik bernuansa terracotta botanical dan bingkai arch minimalis terinspirasi dari Adea Bevitation.",
    previewImage: "/wedding2-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-2"
  },
  {
    id: 103,
    name: "Wedding 3",
    category: "Wedding",
    accentColor: "#2C1A14",
    bgColor: "bg-[#FAF7F2]",
    textColor: "text-[#2C1A14]",
    fontFamily: "font-serif",
    description: "Desain pernikahan Terracotta Aesthetic bernuansa alami, hangat, elegan dengan gabungan font Ovo & Tenor Sans.",
    previewImage: "/wedding3-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-3"
  },
  {
    id: 104,
    name: "Wedding 4",
    category: "Wedding",
    accentColor: "#0F172A",
    bgColor: "bg-white",
    textColor: "text-slate-900",
    fontFamily: "font-sans",
    description: "Desain pernikahan Clean White Gen-Z Vibe berkonsep santai, estetik, ceria dengan aksen badge modern.",
    previewImage: "/wedding4-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-4"
  },
  {
    id: 105,
    name: "Wedding 5",
    category: "Wedding",
    accentColor: "#8C5D3B",
    bgColor: "bg-[#FAF6F0]",
    textColor: "text-[#3E2312]",
    fontFamily: "font-serif",
    description: "Desain pernikahan Coklat Tua Classic Java dengan hiasan pola batik kawung dan nuansa adat sakral.",
    previewImage: "/wedding5-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-5"
  },
  {
    id: 106,
    name: "Wedding 6",
    category: "Wedding",
    accentColor: "#D4AF37",
    bgColor: "bg-[#050505]",
    textColor: "text-white",
    fontFamily: "font-serif",
    description: "Desain undangan pernikahan super mewah dengan warna Dark Emerald Rose Gold, tipografi Playfair Display & Cinzel.",
    previewImage: "/wedding6-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-6"
  },
  {
    id: 107,
    name: "Wedding 7",
    category: "Wedding",
    accentColor: "#6A8F7F",
    bgColor: "bg-[#FAFBFB]",
    textColor: "text-[#1A202C]",
    fontFamily: "font-sans",
    description: "Desain pernikahan Sage Green & White Papercut dengan dedaunan botanis segar, bingkai alami, dan font Cinzel.",
    previewImage: "/wedding7-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-7"
  },
  {
    id: 108,
    name: "Wedding 8",
    category: "Wedding",
    accentColor: "#CD853F",
    bgColor: "bg-[#24140B]",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    description: "Desain pernikahan Vintage Rustic Brown & Wax Seal dengan kartu polaroid miring interaktif merespons gerakan scroll.",
    previewImage: "/wedding8-thumb.jpg",
    demoUrl: "/sandbox-tema/wedding-8"
  },
  {
    id: 4,
    name: "Khitan 1",
    category: "Khitan",
    accentColor: "#D4AF37",
    bgColor: "bg-blue-900",
    textColor: "text-blue-100",
    fontFamily: "font-sans",
    description: "Tema biru gelap mewah dengan ornamen mahkota emas bergaya tradisional, hiasan awan klasik, dan karakter anak-anak kartun berpakaian adat nusantara yang ceria.",
    previewImage: "/khitan1.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-1/"
  },
  {
    id: 5,
    name: "Khitan 2",
    category: "Khitan",
    accentColor: "#92400E",
    bgColor: "bg-amber-50/40",
    textColor: "text-amber-955",
    fontFamily: "font-serif",
    description: "Sentuhan estetis tradisional jawa bermotif kertas kuno dengan hiasan wayang kulit yang sakral.",
    previewImage: "/khitan2.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-2/"
  },
  {
    id: 6,
    name: "Khitan 3",
    category: "Khitan",
    accentColor: "#0D9488",
    bgColor: "bg-teal-50/70",
    textColor: "text-teal-900",
    fontFamily: "font-sans",
    description: "Keindahan nuansa hijau tosca islami dipadukan ornamen lentera gantung lan kubah masjid yang damai.",
    previewImage: "/khitan3.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-3/"
  },
  {
    id: 7,
    name: "Khitan 4",
    category: "Khitan",
    accentColor: "#3B82F6",
    bgColor: "bg-blue-50/70",
    textColor: "text-slate-800",
    fontFamily: "font-sans",
    description: "Tema sekolah ceria dengan karakter anak-anak kartun lucu, buku terbuka, apel merah, pensil warna-warni, dan latar biru muda yang menyenangkan.",
    previewImage: "/khitan4.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-4/"
  },
  {
    id: 8,
    name: "Khitan 5",
    category: "Khitan",
    accentColor: "#84CC16",
    bgColor: "bg-slate-900",
    textColor: "text-lime-300",
    fontFamily: "font-sans",
    description: "Tema gamer cyber gelap dengan ikon joystick controller, elemen futuristik neon biru-hijau, dan tipografi bold khas dunia gaming.",
    previewImage: "/khitan5.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-5/"
  },
  {
    id: 9,
    name: "Khitan 6",
    category: "Khitan",
    accentColor: "#D4AF37",
    bgColor: "bg-neutral-900",
    textColor: "text-amber-100",
    fontFamily: "font-serif",
    description: "Tema hitam elegan premium dengan ornamen emas bermotif batik bunga dan awan klasik, berlatar tekstur tenun gelap yang mewah dan berkelas.",
    previewImage: "/khitan6.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-6/"
  },
  {
    id: 10,
    name: "Khitan 7",
    category: "Khitan",
    accentColor: "#F97316",
    bgColor: "bg-orange-50/70",
    textColor: "text-orange-900",
    fontFamily: "font-sans",
    description: "Tema pantai tropis ceria dengan gradasi sunset oranye, pohon kelapa, kursi pantai, payung jerami, dan pemandangan laut yang menyegarkan.",
    previewImage: "/khitan7.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-7/"
  },
  {
    id: 11,
    name: "Khitan 8",
    category: "Khitan",
    accentColor: "#6B7280",
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
    fontFamily: "font-serif",
    description: "Tema putih bersih islami elegan dengan hiasan kaligrafi arab di bagian atas dan motif geometris islami halus yang anggun dan khidmat.",
    previewImage: "/khitan8.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-khitan-8/"
  },
  
  {
    id: 25,
    name: "Custom Khitan",
    category: "Khitan",
    accentColor: "#10B981",
    bgColor: "bg-emerald-50/70",
    textColor: "text-emerald-900",
    fontFamily: "font-sans",
    description: "Ingin tema khitan yang unik dan berbeda? Kami siap buatkan desain undangan khitan kustom sesuai keinginan Anda. Konsultasikan ide Anda sekarang!",
    previewImage: "/khitan-custom.jpg"
  },
  {
    id: 12,
    name: "Birthday 1",
    category: "Birthday",
    accentColor: "#F59E0B",
    bgColor: "bg-yellow-50/70",
    textColor: "text-yellow-900",
    fontFamily: "font-sans",
    description: "Tema kuning ceria 3D dengan elemen es krim, donat, matahari, awan, bunga daisy, dan suasana pesta yang menyenangkan.",
    previewImage: "/birthday1.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-1/"
  },
  {
    id: 13,
    name: "Birthday 2",
    category: "Birthday",
    accentColor: "#D97706",
    bgColor: "bg-amber-50/40",
    textColor: "text-amber-900",
    fontFamily: "font-sans",
    description: "Tema safari hewan lucu dengan ilustrasi watercolor singa, jerapah, gajah, monyet, zebra, dan koala di tengah dedaunan tropis.",
    previewImage: "/birthday2.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-2/"
  },
  {
    id: 14,
    name: "Birthday 3",
    category: "Birthday",
    accentColor: "#3B82F6",
    bgColor: "bg-blue-50/70",
    textColor: "text-blue-900",
    fontFamily: "font-sans",
    description: "Tema luar angkasa petualangan dengan roket, planet Saturnus, satelit, bintang-bintang, dan nuansa biru langit yang imajinatif.",
    previewImage: "/birthday3.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-3/"
  },
  {
    id: 15,
    name: "Birthday 4",
    category: "Birthday",
    accentColor: "#84CC16",
    bgColor: "bg-lime-50/70",
    textColor: "text-lime-900",
    fontFamily: "font-sans",
    description: "Tema musik rock berwarna-warni dengan gitar elektrik, keyboard piano, drum set, dan elemen graffiti yang energik dan seru.",
    previewImage: "/birthday4.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-4/"
  },
  {
    id: 16,
    name: "Birthday 5",
    category: "Birthday",
    accentColor: "#92400E",
    bgColor: "bg-amber-50/30",
    textColor: "text-amber-950",
    fontFamily: "font-serif",
    description: "Tema otonan Bali tradisional dengan ilustrasi pura, penjor, canang sari, dan nuansa upacara Manusa Yadna yang sakral.",
    previewImage: "/birthday5.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-5/"
  },
  {
    id: 17,
    name: "Birthday 6",
    category: "Birthday",
    accentColor: "#EC4899",
    bgColor: "bg-pink-50/70",
    textColor: "text-pink-900",
    fontFamily: "font-sans",
    description: "Tema pink romantis 3D dengan balon hati mengkilap, kotak hadiah berpita, dan nuansa merah muda yang manis dan feminin.",
    previewImage: "/birthday6.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-6/"
  },
  {
    id: 18,
    name: "Birthday 7",
    category: "Birthday",
    accentColor: "#8B5CF6",
    bgColor: "bg-violet-50/70",
    textColor: "text-violet-900",
    fontFamily: "font-sans",
    description: "Tema pastel ungu lavender dengan balon watercolor warna-warni, confetti meriah, dan suasana pesta yang lembut dan ceria.",
    previewImage: "/birthday7.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-7/"
  },
  {
    id: 19,
    name: "Birthday 8",
    category: "Birthday",
    accentColor: "#D97706",
    bgColor: "bg-stone-50/70",
    textColor: "text-stone-900",
    fontFamily: "font-sans",
    description: "Tema konstruksi seru dengan excavator, dump truck, crane, helm proyek, kerucut lalu lintas, dan garis peringatan kuning-hitam.",
    previewImage: "/birthday8.jpg",
    demoUrl: "https://onlineundangan.id/bintarti-birthday-8/"
  },
  {
    id: 26,
    name: "Custom Birthday",
    category: "Birthday",
    accentColor: "#F59E0B",
    bgColor: "bg-amber-50/70",
    textColor: "text-amber-900",
    fontFamily: "font-sans",
    description: "Ingin tema ulang tahun yang unik dan berbeda? Kami siap buatkan desain undangan birthday kustom sesuai keinginan Anda. Konsultasikan ide Anda sekarang!",
    previewImage: "/birthday-custom.jpg"
  },
  {
    id: 21,
    name: "Aqiqah Cloud Soft Blue",
    category: "Aqiqah",
    accentColor: "#06B6D4",
    bgColor: "bg-cyan-50/70",
    textColor: "text-cyan-900",
    fontFamily: "font-sans",
    description: "Desain syukuran aqiqah dengan ilustrasi awan ramah dan bintang-bintang kecil yang imut."
  },
  {
    id: 22,
    name: "Aqiqah Blossom Pink",
    category: "Aqiqah",
    accentColor: "#F43F5E",
    bgColor: "bg-rose-50/70",
    textColor: "text-rose-900",
    fontFamily: "font-sans",
    description: "Kombinasi warna bunga sakura merah muda yang manis untuk menyambut bayi perempuan tercinta."
  },
  {
    id: 23,
    name: "Premium Custom Event",
    category: "Custom",
    accentColor: "#10B981",
    bgColor: "bg-emerald-50/70",
    textColor: "text-emerald-900",
    fontFamily: "font-sans",
    description: "Desain kustom premium untuk berbagai acara gala, gathering, peresmian, atau pesta bertema khusus."
  }
];
