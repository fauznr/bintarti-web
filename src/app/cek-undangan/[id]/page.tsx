"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Share2,
  ClipboardCheck,
  Loader2,
  Plus,
  Trash2,
  Menu,
  X,
  FileSearch,
  Users,
  BarChart3,
  Download,
  Camera,
  Search,
  MessageSquare
} from "lucide-react";

const WHATSAPP_TEMPLATES: Record<string, string> = {
  casual: "Halo {{namaTamu}}! 👋\n\nKami ingin mengundang Anda untuk hadir di acara kami.\n\nSilakan buka undangan digital berikut untuk informasi lengkap:\n{{link}}\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\n\nTerima kasih.\nKeluarga {{namaAnak}}",
  islamic: "Assalamu'alaikum Wr. Wb.\n\nBismillahirrohmanirrohim. Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i *{{namaTamu}}* untuk menghadiri syukuran kami.\n\nDetail undangan dapat diakses melalui link berikut:\n{{link}}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nWassalamu'alaikum Wr. Wb.\nKeluarga {{namaAnak}}",
  christian: "Syalom Bapak/Ibu/Saudara/i *{{namaTamu}}*,\n\nDengan penuh ucapan syukur atas kasih karunia Tuhan, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri ibadah syukuran acara kami.\n\nSilakan buka undangan digital berikut:\n{{link}}\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTuhan Yesus memberkati.\nKeluarga {{namaAnak}}",
  universal: "Salam Sejahtera Bapak/Ibu/Saudara/i *{{namaTamu}}*,\n\nDengan rasa hormat dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.\n\nSilakan buka undangan digital berikut untuk detail acara:\n{{link}}\n\nKehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan suatu kehormatan dan kebahagiaan bagi kami.\n\nTerima kasih.\nKeluarga {{namaAnak}}",
  formal: "Assalamu'alaikum Wr. Wb.\n\nKepada Yth. Bapak/Ibu/Saudara/i *{{namaTamu}}*\n\nDengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara kami.\n\nSilakan buka undangan digital berikut:\n{{link}}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.\nKeluarga {{namaAnak}}"
};

const WHATSAPP_TEMPLATES_WEDDING: Record<string, string> = {
  casual: "Halo {{namaTamu}}! 👋\n\nKami ingin mengundang Anda untuk hadir di hari bahagia pernikahan kami.\n\nSilakan buka undangan digital berikut untuk informasi lengkap:\n{{link}}\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\n\nTerima kasih.\nKeluarga {{namaPengantin}}",
  islamic: "Assalamu'alaikum Wr. Wb.\n\nBismillahirrohmanirrohim. Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i *{{namaTamu}}* untuk menghadiri acara pernikahan kami.\n\nDetail undangan dapat diakses melalui link berikut:\n{{link}}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nWassalamu'alaikum Wr. Wb.\nKeluarga {{namaPengantin}}",
  christian: "Syalom Bapak/Ibu/Saudara/i *{{namaTamu}}*,\n\nDengan penuh ucapan syukur atas kasih karunia Tuhan, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri ibadah pemberkatan dan resepsi pernikahan kami.\n\nSilakan buka undangan digital berikut:\n{{link}}\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTuhan Yesus memberkati.\nKeluarga {{namaPengantin}}",
  universal: "Salam Sejahtera Bapak/Ibu/Saudara/i *{{namaTamu}}*,\n\nDengan rasa hormat dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\nSilakan buka undangan digital berikut untuk detail acara:\n{{link}}\n\nKehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan suatu kehormatan dan kebahagiaan bagi kami.\n\nTerima kasih.\nKeluarga {{namaPengantin}}",
  formal: "Assalamu'alaikum Wr. Wb.\n\nKepada Yth. Bapak/Ibu/Saudara/i *{{namaTamu}}*\n\nDengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nSilakan buka undangan digital berikut:\n{{link}}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.\nKeluarga {{namaPengantin}}"
};

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
  receptionistPin?: string;
  isPro?: boolean;
  expiryDate?: string | null;
  originalSearchQuery?: string;
  originalSearchType?: string;
}

// Unicode-safe Base64 encoder helper
const safeBtoa = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  }
};

export default function KelolaUndangan() {
  const params = useParams();
  const invitationId = params.id as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [result, setResult] = useState<InvitationResult | null>(null);
  const isExpired = result?.expiryDate ? new Date(result.expiryDate) < new Date() : false;
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // States for guest manager
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [singleInput, setSingleInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [shareMode, setShareMode] = useState<"single" | "bulk">("single");
  const [messageTemplate, setMessageTemplate] = useState("formal");

  // States for comments / RSVP webhook
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [customTemplateText, setCustomTemplateText] = useState("");
  const [guestSearchQuery, setGuestSearchQuery] = useState("");

  useEffect(() => {
    if (!invitationId) return;

    let hasCache = false;

    // 1. Try loading from localStorage first for instant display
    let saved = localStorage.getItem(`bintarti_active_invitation_${invitationId}`);
    if (!saved) {
      saved = localStorage.getItem("bintarti_active_invitation_latest");
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Make sure the cache matches the current invitationId (slug)
        const parsedId = parsed.id || (parsed.linkTamu || parsed.linkUndangan || "").split("/").pop()?.split("#")[0];
        if (!parsedId || parsedId === invitationId) {
          setResult(parsed);
          setIsLoadingDetails(false);
          hasCache = true;
          const isWedding = parsed.source?.toLowerCase().includes("wedding");
          const dict = isWedding ? WHATSAPP_TEMPLATES_WEDDING : WHATSAPP_TEMPLATES;
          setCustomTemplateText(dict.formal);
        }
      } catch (e) {
        // ignore JSON parse error, fall through to fetch
      }
    }

    // 2. Always fetch fresh details from the database by slug in the background
    fetchDetails(invitationId, !hasCache);
    loadGuests(invitationId);
    loadComments(invitationId);
  }, [invitationId]);

  const fetchDetails = async (slug: string, showLoader = true) => {
    if (showLoader) {
      setIsLoadingDetails(true);
    }
    try {
      const searchParams = new URLSearchParams({
        type: "slug",
        query: slug,
        _t: Date.now().toString()
      });

      const res = await fetch(`/api/invitations/search?${searchParams.toString()}`, { cache: "no-store" });
      
      let foundResult: InvitationResult | null = null;
      if (res.ok) {
        const data = await res.json();
        // Since type is slug, the API returns a single object directly
        if (data && data.found) {
          foundResult = data;
        }
      }

      if (foundResult) {
        setResult(foundResult);
        const isWedding = foundResult.source?.toLowerCase().includes("wedding");
        const dict = isWedding ? WHATSAPP_TEMPLATES_WEDDING : WHATSAPP_TEMPLATES;
        setCustomTemplateText(dict[messageTemplate] || dict.formal);
        localStorage.setItem(`bintarti_active_invitation_${slug}`, JSON.stringify(foundResult));
        loadGuests(slug);
      } else {
        setResult(prev => {
          if (prev) {
            console.log("Background fetch failed to find invitation, keeping cache.");
            return prev;
          }
          return null;
        });
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      setResult(prev => {
        if (prev) return prev;
        return null;
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const loadGuests = async (slug: string, showSpinner = true) => {
    if (showSpinner) setIsLoadingGuests(true);
    try {
      const typeHint = result?.source || "";
      const res = await fetch(`/api/guests?invitationId=${encodeURIComponent(slug)}` + (typeHint ? `&type=${encodeURIComponent(typeHint)}` : "") + `&_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      }
    } catch (err) {
      console.error("Error loading guests:", err);
    } finally {
      if (showSpinner) setIsLoadingGuests(false);
    }
  };

  const loadComments = async (slug: string, showSpinner = true) => {
    if (showSpinner) setIsLoadingComments(true);
    try {
      const res = await fetch(`/api/comments?invitationId=${encodeURIComponent(slug)}&_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      if (showSpinner) setIsLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;
    try {
      const res = await fetch(`/api/comments?id=${commentId}&invitationId=${encodeURIComponent(invitationId as string)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadComments(invitationId as string);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus ucapan");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Gagal menghapus ucapan");
    }
  };

  // Real-time Auto-refresh: Polling guest list and comments in background every 5 seconds
  // so stats, check-in logs, and wishes update automatically.
  useEffect(() => {
    if (!invitationId) return;

    const interval = setInterval(() => {
      loadGuests(invitationId, false);
      loadComments(invitationId, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [invitationId]);

  const handleAddSingleGuest = async () => {
    if (isExpired) return;
    if (!singleInput.trim() || !invitationId) return;
    const guestName = singleInput.trim();

    const code = safeBtoa(guestName);

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          guests: [{ name: guestName, code }],
          type: result?.source
        })
      });
      if (res.ok) {
        setSingleInput("");
        await loadGuests(invitationId);
      } else {
        const errData = await res.json();
        alert(errData.error || "Gagal menambahkan tamu");
      }
    } catch (err) {
      console.error("Error adding guest:", err);
    }
  };

  const handleAddBulkGuests = async () => {
    if (isExpired) return;
    if (!bulkInput.trim() || !invitationId) return;
    const names = getBulkNames(bulkInput);
    if (names.length === 0) return;

    const guestsPayload = names.map(name => {
      const code = safeBtoa(name);
      return { name, code };
    });

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          guests: guestsPayload,
          type: result?.source
        })
      });
      if (res.ok) {
        setBulkInput("");
        await loadGuests(invitationId);
      } else {
        const errData = await res.json();
        alert(errData.error || "Gagal menambahkan tamu masal");
      }
    } catch (err) {
      console.error("Error adding bulk guests:", err);
    }
  };

  const handleDeleteGuest = async (code: string) => {
    if (isExpired) return;
    if (!confirm("Apakah Anda yakin ingin menghapus tamu ini?") || !invitationId) return;

    try {
      const typeHint = result?.source || "";
      const res = await fetch(`/api/guests?invitationId=${encodeURIComponent(invitationId)}&code=${encodeURIComponent(code)}` + (typeHint ? `&type=${encodeURIComponent(typeHint)}` : ""), {
        method: "DELETE"
      });
      if (res.ok) {
        await loadGuests(invitationId);
      } else {
        alert("Gagal menghapus tamu");
      }
    } catch (err) {
      console.error("Error deleting guest:", err);
    }
  };

  const handleToggleSent = async (code: string, currentSent: boolean) => {
    if (isExpired) return;
    if (!invitationId) return;
    try {
      const res = await fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          code,
          sent: !currentSent,
          type: result?.source
        })
      });
      if (res.ok) {
        setGuests(prev => prev.map(g => g.code === code ? { ...g, sent: !currentSent } : g));
      }
    } catch (err) {
      console.error("Error updating sent status:", err);
    }
  };

  const handleTogglePresence = async (code: string, currentPresent: boolean) => {
    if (isExpired) return;
    if (!invitationId) return;
    try {
      const res = await fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          code,
          present: !currentPresent,
          type: result?.source
        })
      });
      if (res.ok) {
        setGuests(prev => prev.map(g => g.code === code ? { ...g, present: !currentPresent, checkinTime: !currentPresent ? new Date().toISOString() : null } : g));
      }
    } catch (err) {
      console.error("Error updating presence status:", err);
    }
  };

  const handleToggleAllSent = async () => {
    if (isExpired) return;
    if (guests.length === 0 || !invitationId) return;

    const allChecked = guests.every(g => g.sent);
    const targetSent = !allChecked;

    setGuests(prev => prev.map(g => ({ ...g, sent: targetSent })));

    try {
      await Promise.all(
        guests.map(g =>
          fetch("/api/guests", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invitationId,
              code: g.code,
              sent: targetSent,
              type: result?.source
            })
          })
        )
      );
      await loadGuests(invitationId);
    } catch (err) {
      console.error("Error updating all sent status:", err);
    }
  };

  const getGuestLink = (baseLink: string, guestName: string) => {
    if (!baseLink) return "";
    if (!guestName.trim()) return baseLink;
    const formattedName = guestName.trim();

    let cleanLink = baseLink.trim();
    if (cleanLink.includes("?to=")) {
      cleanLink = cleanLink.split("?to=")[0];
    } else if (cleanLink.includes("&to=")) {
      cleanLink = cleanLink.split("&to=")[0];
    }
    if (cleanLink.includes("#")) {
      cleanLink = cleanLink.split("#")[0];
    }

    const hash = safeBtoa(formattedName);

    if (cleanLink.endsWith("/")) {
      return cleanLink + "#" + hash;
    }
    return cleanLink + "/#" + hash;
  };

  const getBulkNames = (inputText: string) => {
    if (!inputText) return [];
    
    // If there is a newline, split ONLY by newline (safer for names with titles like Budi, S.H.)
    if (inputText.includes("\n") || inputText.includes("\r")) {
      return inputText
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(name => name.length > 0);
    }
    
    // Otherwise, if no newlines but has commas, split by comma
    if (inputText.includes(",")) {
      return inputText
        .split(",")
        .map(name => name.trim())
        .filter(name => name.length > 0);
    }
    
    // Default: return the whole trimmed input as a single name
    return [inputText.trim()].filter(name => name.length > 0);
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getWhatsAppMessage = (link: string, namaAnak: string, namaTamu: string) => {
    const templateText = customTemplateText || WHATSAPP_TEMPLATES.formal;
    let replaced = templateText
      .replaceAll("{{link}}", link)
      .replaceAll("{{namaAnak}}", namaAnak)
      .replaceAll("{{namaPengantin}}", namaAnak);

    if (namaTamu && namaTamu.trim()) {
      replaced = replaced.replaceAll("{{namaTamu}}", namaTamu.trim());
    } else {
      replaced = replaced
        .replaceAll(" *{{namaTamu}}*", "")
        .replaceAll("*{{namaTamu}}*", "")
        .replaceAll("{{namaTamu}}", "");
    }
    return encodeURIComponent(replaced);
  };

  const getWhatsAppMessagePreview = (namaAnak: string) => {
    const isWedding = result?.source?.toLowerCase().includes("wedding");
    const dict = isWedding ? WHATSAPP_TEMPLATES_WEDDING : WHATSAPP_TEMPLATES;
    const templateText = customTemplateText || dict.formal;
    return templateText
      .replaceAll("{{link}}", "[Link Undangan]")
      .replaceAll("{{namaAnak}}", namaAnak)
      .replaceAll("{{namaPengantin}}", namaAnak)
      .replaceAll("{{namaTamu}}", "[Nama Tamu]");
  };

  const shareToWhatsApp = (link: string, namaAnak: string, namaTamu: string = "") => {
    const text = getWhatsAppMessage(link, namaAnak, namaTamu);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleTemplateChange = (val: string) => {
    setMessageTemplate(val);
    const isWedding = result?.source?.toLowerCase().includes("wedding");
    const dict = isWedding ? WHATSAPP_TEMPLATES_WEDDING : WHATSAPP_TEMPLATES;
    const templateText = dict[val] || dict.formal;
    setCustomTemplateText(templateText);
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

  // Analytics calculations
  const totalGuests = guests.length;
  const presentGuests = guests.filter((g) => g.present).length;
  const absentGuests = totalGuests - presentGuests;
  const sentGuests = guests.filter((g) => g.sent).length;
  const unsentGuests = totalGuests - sentGuests;

  const presentPercent = totalGuests > 0 ? Math.round((presentGuests / totalGuests) * 100) : 0;
  const sentPercent = totalGuests > 0 ? Math.round((sentGuests / totalGuests) * 100) : 0;

  // SVG Circle stroke dash calculations
  // Circumference for r=36 is 2 * Math.PI * 36 = 226.19
  const svgCircumference = 226.2;
  const presentStrokeOffset = svgCircumference - (presentPercent / 100) * svgCircumference;
  const sentStrokeOffset = svgCircumference - (sentPercent / 100) * svgCircumference;

  // Find 3 most recent checkins
  const recentCheckins = [...guests]
    .filter((g) => g.present && g.checkinTime)
    .sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime())
    .slice(0, 3);

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
            <Link href="/cek-undangan" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Pencarian
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
            <Link href="/cek-undangan" className="text-slate-800 font-bold py-2 border-b border-slate-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Pencarian
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
        {/* Navigation link */}
        <Link href="/cek-undangan" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-6 group cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Pencarian
        </Link>

        {/* Loading details */}
        {isLoadingDetails && (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xl shadow-slate-100/50 flex flex-col items-center justify-center gap-4 fade-in">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-slate-500 font-semibold">Mengambil informasi detail undangan...</p>
          </div>
        )}

        {/* Details not found */}
        {!isLoadingDetails && !result && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center shadow-xl shadow-slate-100/50 flex flex-col items-center justify-center fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5 border border-red-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Undangan Tidak Ditemukan</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
              Link undangan tidak valid atau sesi pencarian Anda telah kedaluwarsa. Silakan lakukan pencarian ulang dengan data Anda yang benar.
            </p>
            <Link
              href="/cek-undangan"
              className="mt-6 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <FileSearch className="w-4 h-4" /> Cari Ulang Undangan
            </Link>
          </div>
        )}

        {/* Content Loaded */}
        {!isLoadingDetails && result && (
          <div className="space-y-6 fade-in">
            {isExpired && (
              <div className="bg-red-50 border border-red-250 text-red-700 p-5 rounded-3xl flex items-start gap-3 shadow-md">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <p className="font-extrabold text-sm">Masa Aktif Undangan Telah Kedaluwarsa</p>
                  <p className="text-xs text-red-650 mt-1 leading-relaxed">
                    Undangan ini telah berakhir pada <strong>{result.expiryDate ? new Date(result.expiryDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "—"}</strong> (3 bulan setelah acara selesai). Semua fitur pengelolaan tamu, download data, pemindai barcode, dan pengiriman undangan dinonaktifkan secara otomatis.
                  </p>
                </div>
              </div>
            )}

            {/* Dashboard Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
              {/* Header */}
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Clear client-side local cache
                      localStorage.removeItem(`bintarti_active_invitation_${invitationId}`);
                      localStorage.removeItem("bintarti_active_invitation_latest");
                      
                      // Fetch fresh details with loader visible
                      fetchDetails(invitationId, true);
                      loadGuests(invitationId);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    title="Bersihkan cache lokal & muat ulang data baru"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Segarkan
                  </button>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusConfig(result.status).color}`}>
                    {getStatusConfig(result.status).icon} {getStatusConfig(result.status).label}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tema Pilihan</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{result.tema || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Acara</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{result.tanggalAcara || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Acara</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{result.waktuAcara || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tempat Acara</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5 line-clamp-2">{result.tempatAcara || "—"}</p>
                  </div>
                </div>

                {/* Link Undangan Preview */}
                {result.status.toLowerCase() === 'selesai' && result.linkUndangan && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">🔗 Link Undangan (Preview)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2.5 bg-white rounded-xl border border-blue-100 text-sm text-blue-700 font-mono truncate">
                        {result.linkUndangan}
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.linkUndangan, `link-preview`)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 ${
                          copiedField === `link-preview`
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Copy link"
                      >
                        {copiedField === `link-preview` ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={result.linkUndangan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                        title="Buka link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* No links yet message */}
                {result.status.toLowerCase() !== 'selesai' && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Link undangan Anda belum tersedia. Undangan sedang dalam proses pembuatan oleh tim kami. Silakan cek kembali nanti atau hubungi admin untuk info lebih lanjut.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kelola Penerima Undangan Dashboard */}
            {result.status.toLowerCase() === 'selesai' && result.linkTamu && (
              <div className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/80 shadow-xl shadow-slate-100/30 space-y-5">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    📨 Kelola Penerima Undangan
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Kelola daftar tamu, buat tautan personal, pantau konfirmasi kehadiran QR Code, dan bagikan undangan melalui WhatsApp.
                  </p>
                </div>


                {/* Format Pesan Dropdown & Editor */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Format Pesan WhatsApp
                    </label>
                    <select
                      value={messageTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="px-2 py-1 text-[10px] rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="formal">👔 Templat: Formal</option>
                      <option value="casual">👋 Templat: Santai</option>
                      <option value="islamic">🕌 Templat: Islami</option>
                      <option value="christian">⛪ Templat: Nasrani</option>
                      <option value="universal">🌍 Templat: Universal</option>
                    </select>
                  </div>

                  {/* Editable Message Textarea */}
                  <div>
                    <textarea
                      rows={5}
                      value={customTemplateText}
                      onChange={(e) => setCustomTemplateText(e.target.value)}
                      placeholder="Tulis format pesan undangan Anda..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/20 text-slate-700 font-sans resize-y leading-relaxed"
                    />
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-slate-400 mt-1 font-medium">
                      <span>Gunakan placeholder:</span>
                      <code className="bg-slate-100 text-slate-650 px-1 rounded font-mono">{"{{namaTamu}}"}</code>
                      <span>(Nama Tamu)</span>
                      <code className="bg-slate-100 text-slate-650 px-1 rounded font-mono">{"{{link}}"}</code>
                      <span>(Link Undangan)</span>
                      {result.source?.toLowerCase().includes("wedding") ? (
                        <>
                          <code className="bg-slate-100 text-slate-650 px-1 rounded font-mono">{"{{namaPengantin}}"}</code>
                          <span>(Nama Pengantin)</span>
                        </>
                      ) : (
                        <>
                          <code className="bg-slate-100 text-slate-650 px-1 rounded font-mono">{"{{namaAnak}}"}</code>
                          <span>(Nama Anak)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Mode Switch Tabs */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setShareMode("single")}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 ${
                      shareMode === "single"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Input Satu Tamu
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareMode("bulk")}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 ${
                      shareMode === "bulk"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Input Masal (Banyak Tamu)
                  </button>
                </div>

                {/* Form Input Section */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  {shareMode === "single" ? (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                          Nama Tamu
                        </label>
                        <input
                          type="text"
                          disabled={isExpired}
                          placeholder={isExpired ? "Fitur dinonaktifkan (Undangan Kedaluwarsa)" : "Masukkan nama tamu, contoh: Budi Setiawan"}
                          value={singleInput}
                          onChange={(e) => setSingleInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddSingleGuest()}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white font-sans disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSingleGuest}
                        disabled={isExpired}
                        className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shrink-0 h-[34px] cursor-pointer ${
                          isExpired 
                            ? "bg-slate-300 text-slate-450 cursor-not-allowed opacity-60" 
                            : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                          Daftar Nama Tamu (Satu nama per baris / pisah koma)
                        </label>
                        <textarea
                          rows={3}
                          disabled={isExpired}
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          placeholder={isExpired ? "Fitur dinonaktifkan (Undangan Kedaluwarsa)" : "Contoh:\nBudi & Istri\nKeluarga Pak Joko\nSiti Aminah"}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white font-sans resize-y disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBulkGuests}
                        disabled={isExpired}
                        className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          isExpired
                            ? "bg-slate-300 text-slate-450 cursor-not-allowed opacity-60"
                            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambahkan Tamu Masal
                      </button>
                    </div>
                  )}
                </div>

                {/* Guest List Section */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  {isLoadingGuests ? (
                    <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                      <span className="text-xs">Memuat daftar tamu...</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {/* Guest List Header */}
                      <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={isExpired || guests.length === 0}
                            checked={guests.length > 0 && guests.every(g => g.sent)}
                            onChange={handleToggleAllSent}
                            className="w-3.5 h-3.5 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Pilih Semua"
                          />
                          <span>Tamu ({guests.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => loadGuests(invitationId)}
                            className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer"
                            title="Segarkan daftar tamu"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoadingGuests ? "animate-spin" : ""}`} />
                          </button>
                          <span>Aksi</span>
                        </div>
                      </div>

                      {/* Search Bar for Added Guests */}
                      {guests.length > 0 && (
                        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-2 relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Cari nama tamu yang sudah ditambahkan..."
                            value={guestSearchQuery}
                            onChange={(e) => setGuestSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/40 text-slate-700 font-sans"
                          />
                          {guestSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setGuestSearchQuery("")}
                              className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      {guests.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <p className="text-xs font-semibold">Belum ada tamu terdaftar</p>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                            Gunakan form di atas untuk menambahkan nama tamu yang ingin dikirimkan undangan.
                          </p>
                        </div>
                      ) : guests.filter((g) =>
                          g.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
                          g.code.toLowerCase().includes(guestSearchQuery.toLowerCase())
                        ).length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <p className="text-xs font-semibold">Tamu tidak ditemukan</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Tidak ada nama tamu atau kode yang cocok dengan kata kunci "{guestSearchQuery}".
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {guests
                          .filter((g) =>
                            g.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
                            g.code.toLowerCase().includes(guestSearchQuery.toLowerCase())
                          )
                          .map((guest, guestIdx) => {
                          const finalLink = getGuestLink(result.linkTamu || result.linkUndangan, guest.name);
                          return (
                            <div
                              key={guest.code}
                              className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                                guest.sent ? "bg-slate-50/40 opacity-90" : "bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  checked={guest.sent}
                                  onChange={() => handleToggleSent(guest.code, guest.sent)}
                                  disabled={isExpired}
                                  className="w-3.5 h-3.5 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0 disabled:opacity-50"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-bold truncate ${guest.sent ? "line-through text-slate-400" : "text-slate-700"}`}>
                                      {guest.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePresence(guest.code, guest.present)}
                                      disabled={isExpired}
                                      className="cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                      title={isExpired ? "Undangan kedaluwarsa" : "Klik untuk mengubah status kehadiran manual"}
                                    >
                                      {guest.present ? (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 shrink-0 uppercase tracking-wide hover:bg-emerald-200 transition-colors">
                                          ✅ Hadir {guest.checkinTime ? new Date(guest.checkinTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500 shrink-0 uppercase tracking-wide hover:bg-slate-200 transition-colors">
                                          Belum Hadir
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono">
                                    #{guest.code}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Copy link per-tamu */}
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(finalLink, `g-copy-${guestIdx}`)}
                                  disabled={isExpired}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    isExpired
                                      ? "bg-slate-100 border-slate-200 text-slate-350 cursor-not-allowed opacity-50"
                                      : copiedField === `g-copy-${guestIdx}`
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                  }`}
                                  title="Salin link undangan tamu"
                                >
                                  {copiedField === `g-copy-${guestIdx}` ? (
                                    <ClipboardCheck className="w-3.5 h-3.5" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Kirim WA */}
                                <button
                                  type="button"
                                  disabled={isExpired}
                                  onClick={() => {
                                    shareToWhatsApp(finalLink, result.namaAnak, guest.name);
                                    if (!guest.sent) {
                                      handleToggleSent(guest.code, false);
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                                    isExpired
                                      ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                                      : guest.sent
                                      ? "bg-slate-250 text-slate-600 hover:bg-slate-200"
                                      : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                                  }`}
                                  title="Kirim via WhatsApp"
                                >
                                  <Share2 className="w-3.5 h-3.5" /> Kirim
                                </button>

                                {/* Hapus Tamu */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGuest(guest.code)}
                                  disabled={isExpired}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    isExpired
                                      ? "bg-slate-50 border-slate-150 text-slate-350 cursor-not-allowed opacity-50"
                                      : "border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600"
                                  }`}
                                  title="Hapus tamu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>

            {/* Ucapan, Doa & RSVP Tamu (WordPress Webhook integration) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      💬 Ucapan, Doa & RSVP Tamu
                    </h4>
                    <p className="text-[10px] text-slate-400">Pesan ucapan langsung dari halaman undangan WordPress</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => loadComments(invitationId as string)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer border-none bg-transparent"
                  title="Segarkan ucapan"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingComments ? "animate-spin text-emerald-500" : ""}`} />
                </button>
              </div>

              {isLoadingComments ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-slate-350 animate-spin" />
                  <span>Memuat ucapan tamu...</span>
                </div>
              ) : comments.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="w-8 h-8 text-slate-200" />
                  <span className="font-semibold text-slate-650">Belum ada ucapan dari tamu</span>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Pesan yang dikirimkan tamu dari widget RSVP/CommentKit di undangan Elementor Anda akan tampil secara otomatis di sini.
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl bg-slate-50/30">
                  {comments.map((c) => (
                    <div key={c.id} className="p-4 flex gap-3 hover:bg-slate-50/50 transition-colors group">
                      {/* Avatar / Initial */}
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {c.name ? c.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate">{c.name}</span>
                            {c.rsvp_status && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                                c.rsvp_status === "Hadir"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : c.rsvp_status === "Tidak Hadir"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-150 text-slate-700"
                              }`}>
                                {c.rsvp_status}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 font-sans">
                            {new Date(c.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-650 mt-1.5 leading-relaxed break-words font-sans bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm inline-block max-w-full">
                          {c.comment}
                        </p>
                      </div>

                      {/* Action Button: Delete (Spam Control) */}
                      <div className="shrink-0 flex items-start">
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer border-none bg-transparent"
                          title="Hapus ucapan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

                {/* Scanner Penerima Tamu Button */}
                <div className="flex">
                  {isExpired ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed text-center shadow-sm"
                      title="Scanner QR Code dinonaktifkan karena masa aktif undangan telah kedaluwarsa."
                    >
                      <Camera className="w-4 h-4 text-slate-350" /> Scanner Dinonaktifkan (Expired)
                    </button>
                  ) : !result.isPro ? (
                    <button
                      type="button"
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-center shadow-sm"
                      title="Scanner QR Code Penerima Tamu (Hanya tersedia di versi PRO)"
                    >
                      <Camera className="w-4 h-4 text-slate-400" /> 🔒 Scanner Penerima Tamu (PRO)
                    </button>
                  ) : (
                    <Link
                      href={`/checkin/scan?id=${invitationId}`}
                      target="_blank"
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md shadow-emerald-100 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                      title="Buka scanner barcode kamera langsung untuk penerima tamu di pintu masuk"
                    >
                      <Camera className="w-4 h-4" /> Buka Scanner Penerima Tamu
                    </Link>
                  )}
                </div>

                {/* Info Credentials PIN Scanner */}
                <div className="relative overflow-hidden rounded-2xl">
                  <div className={`bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-5 border border-emerald-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between ${isExpired || !result.isPro ? "blur-[2.5px] select-none pointer-events-none" : ""}`}>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 font-accent">
                        📱 Buku Tamu QR Code (Penerima Tamu)
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg font-sans">
                        Bagikan link pemindai ini beserta PIN masuk kepada petugas penerima tamu Anda di hari-H untuk mencatat kehadiran tamu secara non-stop tanpa perlu aplikasi tambahan.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 font-sans">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`https://bintarti.store/checkin/scan?id=${invitationId}`}
                          className="px-3 py-1.5 bg-white text-slate-700 font-mono text-[10px] rounded-lg border border-slate-200 focus:outline-none min-w-0 flex-1 md:w-48"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`https://bintarti.store/checkin/scan?id=${invitationId}`, 'scanner-link')}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            copiedField === 'scanner-link'
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                          }`}
                        >
                          {copiedField === 'scanner-link' ? 'Tersalin!' : 'Salin Link'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between md:justify-start gap-4">
                        <span className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wider">
                          PIN Otorisasi:
                        </span>
                        <code className="px-3 py-1 bg-emerald-100/60 text-emerald-850 rounded-lg border border-emerald-200 font-mono font-bold text-sm tracking-widest">
                          {result.receptionistPin || "2104"}
                        </code>
                      </div>
                    </div>
                  </div>
                  {isExpired && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center font-bold text-slate-600 text-[10px] uppercase tracking-wider gap-1.5">
                      <span>🔒 Fitur Dinonaktifkan (Undangan Kedaluwarsa)</span>
                    </div>
                  )}
                  {!isExpired && !result.isPro && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] flex flex-col items-center justify-center font-bold text-slate-600 text-[10px] uppercase tracking-wider gap-1.5">
                      <span>🔒 Tautan & PIN Scanner Hanya Tersedia di Paket PRO</span>
                      <button 
                        onClick={() => setShowUpgradeModal(true)} 
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[9px] rounded shadow-sm cursor-pointer border-none"
                      >
                        Upgrade ke PRO
                      </button>
                    </div>
                  )}
                </div>

                {/* Dashboard Analytics & Chart */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5 relative">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Statistik & Kehadiran Tamu
                      </h4>
                      <p className="text-[10px] text-slate-400">Analitik kehadiran dan pengiriman real-time</p>
                    </div>
                  </div>

                  <div className={!result.isPro ? "blur-[3.5px] select-none pointer-events-none space-y-5" : "space-y-5"}>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Stat: Total Tamu */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tamu</span>
                        <span className="p-1 rounded-lg bg-slate-200/50 text-slate-600">
                          <Users className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-slate-800 font-accent">{totalGuests}</span>
                        <span className="text-[10px] text-slate-400 ml-1 font-semibold">orang</span>
                      </div>
                      <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-20 h-20 text-slate-900" />
                      </div>
                    </div>

                    {/* Stat: Kehadiran */}
                    <div className="p-4 rounded-xl bg-emerald-50/20 border border-emerald-100/40 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-755 uppercase tracking-wider">Hadir (Konfirmasi)</span>
                        <span className="p-1 rounded-lg bg-emerald-100/50 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-slate-800 font-accent">{presentGuests}</span>
                        <span className="text-[10px] text-slate-400 ml-1 font-semibold">/ {totalGuests}</span>
                        <span className="text-[10px] font-bold text-emerald-600 ml-1.5">({presentPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                        <div className="bg-emerald-500 h-1 rounded-full transition-all duration-500" style={{ width: `${presentPercent}%` }} />
                      </div>
                    </div>

                    {/* Stat: Terkirim */}
                    <div className="p-4 rounded-xl bg-blue-50/20 border border-blue-100/40 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-blue-755 uppercase tracking-wider">Undangan Terkirim</span>
                        <span className="p-1 rounded-lg bg-blue-100/50 text-blue-600">
                          <Share2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-slate-800 font-accent">{sentGuests}</span>
                        <span className="text-[10px] text-slate-400 ml-1 font-semibold">/ {totalGuests}</span>
                        <span className="text-[10px] font-bold text-blue-655 ml-1.5">({sentPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-500 h-1 rounded-full transition-all duration-500" style={{ width: `${sentPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Charts and Recent Checkin Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual Charts Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-center sm:flex-row gap-6 items-center">
                      {/* Attendance Donut */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Kehadiran</span>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* SVG Donut */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              className="text-slate-100"
                              strokeWidth="7"
                              stroke="currentColor"
                              fill="transparent"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              className="text-emerald-500 transition-all duration-500"
                              strokeWidth="7"
                              strokeDasharray={svgCircumference}
                              strokeDashoffset={presentStrokeOffset}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-lg font-extrabold text-slate-800 font-accent leading-none">{presentPercent}%</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Hadir</span>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex gap-3 mt-3 text-[9px] font-semibold">
                          <span className="flex items-center gap-1 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            Hadir ({presentGuests})
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0" />
                            Belum ({absentGuests})
                          </span>
                        </div>
                      </div>

                      {/* Delivery Donut */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Pengiriman WA</span>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* SVG Donut */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              className="text-slate-100"
                              strokeWidth="7"
                              stroke="currentColor"
                              fill="transparent"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              className="text-blue-500 transition-all duration-500"
                              strokeWidth="7"
                              strokeDasharray={svgCircumference}
                              strokeDashoffset={sentStrokeOffset}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-lg font-extrabold text-slate-800 font-accent leading-none">{sentPercent}%</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Terkirim</span>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex gap-3 mt-3 text-[9px] font-semibold">
                          <span className="flex items-center gap-1 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            Terkirim ({sentGuests})
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0" />
                            Belum ({unsentGuests})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Aktivitas Check-in Terbaru
                        </span>
                        {recentCheckins.length === 0 ? (
                          <div className="py-6 text-center text-slate-450 text-xs font-medium flex flex-col items-center justify-center gap-1">
                            <Clock className="w-5 h-5 text-slate-300" />
                            <span>Belum ada tamu yang check-in</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {recentCheckins.map((guest) => (
                              <div key={guest.code} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                  <span className="text-xs font-bold text-slate-700 truncate">{guest.name}</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                                  {guest.checkinTime ? new Date(guest.checkinTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "Hadir"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 italic mt-2 text-right">
                        *Diperbarui secara real-time saat QR scan
                      </div>
                    </div>
                  </div>

                  {/* Close the blurred content wrapper */}
                  </div>

                  {/* Upgrade PRO overlay promo card */}
                  {!result.isPro && (
                    <div className="absolute inset-x-5 bottom-5 top-16 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 p-4 rounded-2xl">
                      <div className="bg-gradient-to-br from-blue-600/95 to-indigo-650/95 text-white p-6 rounded-2xl shadow-xl max-w-sm text-center border border-blue-300/40 flex flex-col items-center gap-3.5 scale-in">
                        <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-lg shadow-inner">
                          👑
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm tracking-wide uppercase">Analitik Kehadiran Tamu PRO</h5>
                          <p className="text-[10px] text-indigo-50/90 leading-relaxed mt-1.5 font-medium">
                            Dapatkan visualisasi persentase grafik lingkaran (Donut Chart) real-time, statistik kehadiran tamu dinamis, dan log kedatangan terbaru petugas untuk kontrol acara Anda.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowUpgradeModal(true)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-blue-600 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none font-sans"
                        >
                          Upgrade ke PRO Sekarang
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Log Kehadiran Tamu (Semua Check-in) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Log Kehadiran Tamu (Semua Check-in)
                      </h4>
                      <p className="text-[10px] text-slate-400">Daftar lengkap seluruh tamu yang telah melakukan scan check-in</p>
                    </div>
                  </div>

                  <div className={!result.isPro ? "blur-[3.5px] select-none pointer-events-none" : ""}>
                    {guests.filter(g => g.present).length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-medium flex flex-col items-center justify-center gap-1">
                        <Clock className="w-5 h-5 text-slate-300" />
                        <span>Belum ada tamu yang check-in</span>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                        {[...guests]
                          .filter(g => g.present && g.checkinTime)
                          .sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime())
                          .map((guest, idx) => (
                            <div key={guest.code} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-[10px] font-bold text-slate-450 font-mono w-6">
                                  #{idx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-755 truncate uppercase tracking-wide">
                                  {guest.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                  {guest.checkinTime ? new Date(guest.checkinTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Hadir"}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {!result.isPro && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 p-4 rounded-2xl">
                      <div className="bg-gradient-to-br from-blue-600/95 to-indigo-650/95 text-white p-4 rounded-xl shadow-lg max-w-xs text-center border border-blue-300/40 flex flex-col items-center gap-2 scale-in">
                        <span className="text-base">👑</span>
                        <div>
                          <h5 className="font-extrabold text-xs tracking-wide uppercase">Log Kehadiran Lengkap PRO</h5>
                          <p className="text-[9px] text-indigo-50/90 leading-relaxed mt-1 font-medium">
                            Lihat list lengkap semua nama tamu yang hadir beserta rincian detail jam masuk mereka ke acara Anda.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowUpgradeModal(true)}
                          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-blue-600 font-extrabold text-[10px] rounded-lg shadow transition-all cursor-pointer border-none font-sans"
                        >
                          Upgrade ke PRO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


                {guests.length > 0 && (
                  <div className="flex">
                    {!result.isPro ? (
                      <button
                        type="button"
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-2.5 rounded-xl border border-slate-250 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        title="Unduh laporan rekap data tamu dalam format PDF (Hanya tersedia di versi PRO)"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                        🔒 Unduh Laporan PDF (PRO)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const total = guests.length;
                          const present = guests.filter(g => g.present).length;
                          const absent = total - present;
                          const sent = guests.filter(g => g.sent).length;
                          
                          const printWindow = window.open('', '_blank');
                          if (!printWindow) {
                            alert("Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir oleh browser.");
                            return;
                          }

                          const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                          const printTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                          let guestRows = '';
                          guests.forEach((g, i) => {
                            const finalLink = getGuestLink(result.linkTamu || result.linkUndangan, g.name);
                            const presenceStatus = g.present 
                              ? `<span style="color: #059669; font-weight: bold;">Hadir</span>` 
                              : `<span style="color: #64748b;">Belum Hadir</span>`;
                            const checkinHour = g.present && g.checkinTime 
                              ? new Date(g.checkinTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
                              : '-';
                            const sentStatus = g.sent 
                              ? `<span style="color: #2563eb;">Terkirim</span>` 
                              : `<span style="color: #64748b;">Belum Kirim</span>`;
                              
                            guestRows += `
                              <tr>
                                <td style="text-align: center;">${i + 1}</td>
                                <td><strong>${g.name}</strong></td>
                                <td style="text-align: center;">${presenceStatus}</td>
                                <td style="text-align: center;">${checkinHour}</td>
                                <td style="text-align: center;">${sentStatus}</td>
                                <td style="font-family: monospace; font-size: 10px; word-break: break-all;">${finalLink}</td>
                              </tr>
                            `;
                          });

                          const htmlContent = `
                            <html>
                              <head>
                                <title>Laporan Rekap Tamu - ${result.namaAnak}</title>
                                <style>
                                  body {
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    color: #1e293b;
                                    padding: 30px;
                                    margin: 0;
                                    line-height: 1.5;
                                  }
                                  .header {
                                    border-bottom: 3px double #cbd5e1;
                                    padding-bottom: 15px;
                                    margin-bottom: 25px;
                                    text-align: center;
                                  }
                                  .logo-text {
                                    font-size: 24px;
                                    font-weight: 800;
                                    letter-spacing: 0.5px;
                                    color: #10b981;
                                    margin: 0 0 5px 0;
                                  }
                                  .subtitle {
                                    font-size: 14px;
                                    color: #64748b;
                                    margin: 0;
                                    font-weight: 600;
                                  }
                                  .title-section {
                                    margin-bottom: 25px;
                                  }
                                  .title-section h1 {
                                    font-size: 20px;
                                    margin: 0 0 8px 0;
                                    color: #0f172a;
                                  }
                                  .meta-info {
                                    font-size: 12px;
                                    color: #64748b;
                                  }
                                  .stats-grid {
                                    display: grid;
                                    grid-template-columns: repeat(4, 1fr);
                                    gap: 15px;
                                    margin-bottom: 30px;
                                  }
                                  .stats-card {
                                    background-color: #f8fafc;
                                    border: 1px solid #e2e8f0;
                                    border-radius: 8px;
                                    padding: 12px 15px;
                                    text-align: center;
                                  }
                                  .stats-card .label {
                                    font-size: 10px;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    color: #64748b;
                                    font-weight: bold;
                                    display: block;
                                    margin-bottom: 5px;
                                  }
                                  .stats-card .value {
                                    font-size: 20px;
                                    font-weight: 800;
                                    color: #0f172a;
                                  }
                                  table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-bottom: 20px;
                                    font-size: 12px;
                                  }
                                  th {
                                    background-color: #f1f5f9;
                                    color: #475569;
                                    font-weight: bold;
                                    text-transform: uppercase;
                                    font-size: 10px;
                                    letter-spacing: 0.5px;
                                    padding: 10px;
                                    border: 1px solid #cbd5e1;
                                  }
                                  td {
                                    padding: 10px;
                                    border: 1px solid #e2e8f0;
                                  }
                                  tr:nth-child(even) {
                                    background-color: #f8fafc;
                                  }
                                  .footer {
                                    margin-top: 50px;
                                    font-size: 10px;
                                    color: #94a3b8;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                    padding-top: 15px;
                                  }
                                  @media print {
                                    body {
                                      padding: 0;
                                      margin: 0;
                                    }
                                    .no-print {
                                      display: none;
                                    }
                                  }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="logo-text">BINTARTI</div>
                                  <div class="subtitle">Undangan Digital & Layanan Buku Tamu QR Code</div>
                                </div>
                                
                                <div class="title-section">
                                  <h1>Laporan Rekap Tamu & Konfirmasi Kehadiran</h1>
                                  <div class="meta-info">
                                    <strong>Acara:</strong> ${result.namaAnak} (${result.source.toLowerCase().includes('wedding') ? 'Pernikahan' : result.source.toLowerCase().includes('khitan') ? 'Khitanan' : result.source.toLowerCase().includes('aqiqah') ? 'Aqiqah' : 'Ulang Tahun'})<br>
                                    <strong>Tanggal Cetak:</strong> ${printDate} - Pukul ${printTime} WIB
                                  </div>
                                </div>

                                <div class="stats-grid">
                                  <div class="stats-card">
                                    <span class="label">Total Tamu</span>
                                    <span class="value">${total}</span>
                                  </div>
                                  <div class="stats-card">
                                    <span class="label">Hadir</span>
                                    <span class="value">${present}</span>
                                  </div>
                                  <div class="stats-card">
                                    <span class="label">Belum Hadir</span>
                                    <span class="value">${absent}</span>
                                  </div>
                                  <div class="stats-card">
                                    <span class="label">WA Terkirim</span>
                                    <span class="value">${sent}</span>
                                  </div>
                                </div>

                                <table>
                                  <thead>
                                    <tr>
                                      <th style="width: 5%; text-align: center;">No</th>
                                      <th style="width: 25%; text-align: left;">Nama Tamu</th>
                                      <th style="width: 15%; text-align: center;">Kehadiran</th>
                                      <th style="width: 12%; text-align: center;">Jam Hadir</th>
                                      <th style="width: 13%; text-align: center;">Status Kirim</th>
                                      <th style="width: 30%; text-align: left;">Link Undangan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${guestRows}
                                  </tbody>
                                </table>

                                <div class="footer">
                                  Laporan ini dibuat secara otomatis oleh Bintarti Digital Invitation System. &copy; ${new Date().getFullYear()} Bintarti. All rights reserved.
                                </div>

                                <script>
                                  window.onload = function() {
                                    window.print();
                                    setTimeout(function() {
                                      window.close();
                                    }, 500);
                                  };
                                </script>
                              </body>
                            </html>
                          `;
                          
                          printWindow.document.write(htmlContent);
                          printWindow.document.close();
                        }}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        title="Unduh laporan rekap data tamu dalam format PDF"
                      >
                        <Download className="w-4 h-4 text-slate-500" />
                        Unduh Laporan PDF (Cetak)
                      </button>
                    )}
                  </div>
                )}

          </div>
        )}

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
              <strong>Link Undangan (Preview)</strong> adalah link pratinjau untuk dicoba oleh pemilik acara sendiri. <strong>Kelola Penerima Undangan</strong> digunakan untuk generate link personal per tamu undangan.
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
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Bintarti. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Upgrade PRO Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 flex flex-col scale-in overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h3 className="font-black text-slate-800 text-base font-accent">Upgrade Bintarti PRO</h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-center font-sans">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
                👑
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-base">Aktifkan Semua Fitur Premium</h4>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Nikmati fitur premium terkuat untuk kelancaran buku tamu acara Anda. Dengan paket PRO Anda mendapatkan:
                </p>
              </div>

              {/* List Features */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs text-slate-700 space-y-2.5 font-medium">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Laporan PDF</strong>: Cetak rekapitulasi kehadiran tamu secara instan & rapi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Statistik & Grafik Donut</strong>: Monitoring presentase tamu hadir secara visual.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Scanner Penerima Tamu</strong>: Scan barcode tamu non-stop langsung di HP petugas penerima tamu.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Umpan Balik Audio (Beep)</strong>: Scanner otomatis berbunyi beep jika check-in sukses.</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-normal">
                Hubungi admin kami di WhatsApp untuk melakukan aktivasi instan paket PRO Anda.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <a
                href={`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20upgrade%20undangan%20saya%20(${invitationId})%20ke%20versi%20PRO`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm text-center shadow-lg shadow-emerald-100 hover:shadow-emerald-250 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Hubungi Admin via WA
              </a>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
