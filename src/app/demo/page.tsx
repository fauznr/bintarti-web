"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Music, 
  VolumeX, 
  Clock, 
  MessageSquare, 
  Copy, 
  ArrowLeft,
  MailOpen,
  CheckCircle2
} from "lucide-react";
import { themeConfigs } from "../../data/demo";



function InvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Theme selection
  const themeId = parseInt(searchParams.get("theme") || "1", 10);
  const theme = themeConfigs[themeId] || themeConfigs[1];

  // Invitation interaction states
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCopied, setShowCopied] = useState(false);
  
  // RSVP Form state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpMsg, setRsvpMsg] = useState("");
  const [wishes, setWishes] = useState([
    { name: "Keluarga Handoyo", status: "Hadir", text: "Selamat ya! Semoga acara berjalan lancar dan menjadi berkah untuk seluruh keluarga." },
    { name: "Siti Rahma", status: "Hadir", text: "Selamat untuk momen bahagianya. Senang sekali bisa mendapatkan kabar gembira ini." },
    { name: "Roni Setiawan", status: "Tidak Hadir", text: "Maaf belum bisa hadir karena bertepatan dengan dinas luar kota. Semoga sukses lancar acaranya!" }
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date("2026-12-28T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Audio configuration
  useEffect(() => {
    // Standard instrumental audio stream (piano theme)
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser:", err));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log(err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(theme.bankAccount);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) return;

    setWishes([
      { name: rsvpName, status: rsvpStatus, text: rsvpMsg },
      ...wishes
    ]);
    setRsvpName("");
    setRsvpMsg("");
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col items-center ${theme.fontFamily} antialiased`}>
      {/* Back button wrapper */}
      <div className="w-full max-w-md bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center gap-3">
        <button 
          onClick={() => router.push("/")}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer text-slate-700"
          aria-label="Kembali ke Landing Page"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Demo</span>
          <span className="text-sm font-bold text-slate-800">{theme.name}</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col pb-24 overflow-x-clip">
        
        {/* Cover Overlay Screen */}
        {!isOpen && (
          <div className="fixed inset-0 max-w-md mx-auto z-45 bg-white flex flex-col items-center justify-between p-8 text-center fade-in">
            <div className="pt-12 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center p-2 border border-slate-100">
                <Image src="/logo.png" alt="Bintarti" width={64} height={64} className="w-full h-full object-contain" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bintarti Digital Invitation</p>
            </div>

            <div className="space-y-4 my-auto">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{theme.title}</span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {theme.names}
              </h1>
              <p className="text-sm text-slate-500">Kami mengundang Anda untuk merayakan momen bahagia kami.</p>
            </div>

            <div className="pb-16 w-full space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-xs mx-auto">
                <p className="text-xs text-slate-400">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                <p className="text-base font-bold text-slate-800 mt-1 uppercase">Tamu Undangan Spesial</p>
              </div>
              
              <button
                onClick={handleOpenInvitation}
                className={`w-full py-4 rounded-2xl ${theme.accentBg} text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
              >
                <MailOpen className="w-5 h-5" />
                Buka Undangan
              </button>
            </div>
          </div>
        )}

        {/* Live Invitation Main Content */}
        {isOpen && (
          <div className="flex flex-col fade-in">
            {/* Music Floating Button */}
            <button 
              onClick={toggleMusic}
              className={`fixed bottom-24 right-4 z-40 p-3 rounded-full ${theme.accentBg} text-white shadow-lg flex items-center justify-center cursor-pointer`}
              aria-label="Toggle Background Music"
            >
              {isPlaying ? <Music className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* SECTION 1: HERO / COVER */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center p-8 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
              {/* Decorative background leaves/elements */}
              <div className="absolute top-10 left-10 text-slate-200/50 pointer-events-none float-slow"><Heart className="w-16 h-16 fill-current" /></div>
              <div className="absolute bottom-20 right-10 text-slate-200/50 pointer-events-none float-delayed"><Heart className="w-12 h-12 fill-current" /></div>

              <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText} mb-3`}>{theme.title}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none mb-4">
                {theme.names}
              </h2>
              <div className={`w-12 h-1 ${theme.accentBg} mb-6`} />
              <p className="text-sm font-semibold text-slate-600 mb-2">{theme.dateStr}</p>
              <p className="text-xs text-slate-500">{theme.venue}</p>

              <div className="absolute bottom-8 animate-bounce text-slate-400">
                <p className="text-[10px] uppercase tracking-widest font-bold">Scroll Ke Bawah</p>
                <span className="block text-center mt-1">↓</span>
              </div>
            </section>

            {/* SECTION 2: QUOTE / DOA */}
            <section className="p-8 text-center bg-white border-b border-slate-100">
              <div className="max-w-xs mx-auto space-y-4">
                <Heart className={`w-8 h-8 ${theme.accentText} mx-auto fill-current opacity-30`} />
                <p className="text-sm italic text-slate-700 leading-relaxed">
                  {theme.quote}
                </p>
                <p className={`text-xs font-bold ${theme.accentText}`}>
                  {theme.quoteAuthor}
                </p>
              </div>
            </section>

            {/* SECTION 3: DETAIL ACARA */}
            <section id="mempelai" className="p-8 bg-slate-50/50 border-b border-slate-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Mempelai / Profil</h3>
                <div className={`w-8 h-0.5 ${theme.accentBg} mx-auto mt-2`} />
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl mb-4 shadow-inner">
                    {theme.category === "Pernikahan" ? "👰" : theme.category === "Khitan" ? "👦" : theme.category === "Birthday" ? "🎂" : "👶"}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{theme.names.split(" & ")[0]}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{theme.details.split(" & ")[0]}</p>
                </div>

                {theme.category === "Pernikahan" && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl mb-4 shadow-inner">
                      🤵
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{theme.names.split(" & ")[1]}</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{theme.details.split(" & ")[1] || theme.details}</p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 4: TIME & LOCATION */}
            <section id="acara" className="p-8 bg-white border-b border-slate-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Waktu &amp; Lokasi</h3>
                <div className={`w-8 h-0.5 ${theme.accentBg} mx-auto mt-2`} />
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-2 text-center mb-8 max-w-xs mx-auto">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-xs">
                  <span className={`text-xl font-bold ${theme.accentText}`}>{timeLeft.days}</span>
                  <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Hari</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-xs">
                  <span className={`text-xl font-bold ${theme.accentText}`}>{timeLeft.hours}</span>
                  <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Jam</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-xs">
                  <span className={`text-xl font-bold ${theme.accentText}`}>{timeLeft.minutes}</span>
                  <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Menit</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-xs">
                  <span className={`text-xl font-bold ${theme.accentText}`}>{timeLeft.seconds}</span>
                  <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Detik</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${theme.accentBg}/10 flex items-center justify-center ${theme.accentText} shrink-0`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Hari &amp; Tanggal</h4>
                      <p className="text-xs text-slate-600 mt-1">{theme.dateStr}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${theme.accentBg}/10 flex items-center justify-center ${theme.accentText} shrink-0`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Waktu Pelaksanaan</h4>
                      <p className="text-xs text-slate-600 mt-1">{theme.timeStr}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${theme.accentBg}/10 flex items-center justify-center ${theme.accentText} shrink-0`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Lokasi Acara</h4>
                      <p className="text-xs text-slate-600 mt-1">{theme.venue}</p>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-slate-50 transition-all cursor-pointer`}
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    Buka Google Maps Lokasi
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 5: RSVP & GUESTBOOK */}
            <section id="rsvp" className="p-8 bg-slate-50/50 border-b border-slate-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Konfirmasi RSVP</h3>
                <div className={`w-8 h-0.5 ${theme.accentBg} mx-auto mt-2`} />
              </div>

              <form onSubmit={handleAddWish} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 mb-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Tamu</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama Anda"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Konfirmasi Kehadiran</label>
                  <select 
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800 bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ucapan / Doa Restu</label>
                  <textarea 
                    rows={3}
                    placeholder="Tuliskan ucapan selamat & doa Anda..."
                    value={rsvpMsg}
                    onChange={(e) => setRsvpMsg(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl ${theme.accentBg} text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer`}
                >
                  Kirim Ucapan &amp; Konfirmasi
                </button>
              </form>

              {/* Wishes List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-bold text-slate-800">Ucapan &amp; Doa ({wishes.length})</span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {wishes.map((w, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{w.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${w.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          {w.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{w.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 6: KADO DIGITAL */}
            <section id="kado" className="p-8 bg-white text-center">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Kado Digital</h3>
                <div className={`w-8 h-0.5 ${theme.accentBg} mx-auto mt-2`} />
                <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">Bagi Anda yang ingin memberikan tanda kasih untuk keluarga, Anda dapat mengirimkannya secara cashless melalui rekening di bawah ini:</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 max-w-xs mx-auto space-y-4">
                <div className="mx-auto w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-lg font-bold text-slate-800">
                  {theme.bankName}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Nomor Rekening:</p>
                  <p className="text-lg font-extrabold text-slate-800 tracking-wider">{theme.bankAccount}</p>
                  <p className="text-xs text-slate-500">a/n {theme.bankHolder}</p>
                </div>

                <button
                  onClick={handleCopyAccount}
                  className={`mx-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Salin Rekening
                </button>

                {showCopied && (
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1 fade-in">
                    <CheckCircle2 className="w-3 h-3" />
                    Nomor Rekening Tersalin!
                  </div>
                )}
              </div>

              {/* Thank you note */}
              <div className="mt-12 space-y-4">
                <p className="text-sm font-semibold text-slate-800">Terima Kasih atas Doa &amp; Restu Anda</p>
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center p-2 border border-slate-100">
                  <Image src="/logo.png" alt="Bintarti" width={40} height={40} className="w-full h-full object-contain" />
                </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
      </div>
    }>
      <InvitationContent />
    </Suspense>
  );
}
