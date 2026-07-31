"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  LogOut, 
  UserCheck, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Home,
  SwitchCamera
} from "lucide-react";

// Web Audio API success beep helper — uses a persistent AudioContext
// to comply with Safari's strict autoplay policy (context must be created/resumed
// inside a direct user-interaction handler, not an async callback).
const createOrResumeAudioCtx = async (ref: React.MutableRefObject<AudioContext | null>) => {
  if (!ref.current) {
    ref.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (ref.current.state === "suspended") {
    await ref.current.resume();
  }
  return ref.current;
};

const playBeepSound = async (audioCtxRef: React.MutableRefObject<AudioContext | null>) => {
  try {
    const ctx = await createOrResumeAudioCtx(audioCtxRef);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (err) {
    console.error("Audio beep failed:", err);
  }
};

function ScannerContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id") || "";

  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [resolvedId, setResolvedId] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  
  // Scanner state
  const [isHtml5QrcodeLoaded, setIsHtml5QrcodeLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "processing" | "success" | "error" | "duplicate">("idle");
  const [scannedGuest, setScannedGuest] = useState<any>(null);
  const [duplicateGuest, setDuplicateGuest] = useState<any>(null);
  const [scanErrorMsg, setScanErrorMsg] = useState("");
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [presentGuests, setPresentGuests] = useState<any[]>([]);
  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const isExpired = invitationDetails?.expiryDate ? new Date(invitationDetails.expiryDate) < new Date() : false;
  
  const qrScannerRef = useRef<any>(null);
  // Persistent AudioContext ref — pre-warmed on first user interaction
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scannerContainerId = "qr-reader-viewport";

  const getTypeHint = () => {
    if (invitationDetails?.source) {
      return invitationDetails.source;
    }
    const activeId = resolvedId || invitationId || "";
    const prefix = activeId.split("_")[0]?.toLowerCase();
    if (["khitan", "birthday", "aqiqah", "wedding"].includes(prefix)) {
      return prefix;
    }
    return "";
  };

  const loadPresentGuests = async (targetId: string) => {
    try {
      const res = await fetch(`/api/guests?invitationId=${encodeURIComponent(targetId)}&_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const list = await res.json();
        const presentList = list
          .filter((g: any) => g.present && g.checkinTime)
          .sort((a: any, b: any) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
        setPresentGuests(presentList);
        setCheckedInCount(presentList.length);
      }
    } catch (err) {
      console.error("Error loading present guests:", err);
    }
  };

  const loadInvitationDetails = async (targetId: string) => {
    try {
      const res = await fetch(`/api/invitations/search?type=slug&query=${encodeURIComponent(targetId)}&_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.found) {
          setInvitationDetails(data);
        }
      }
    } catch (err) {
      console.error("Error loading invitation details:", err);
    }
  };

  // Load present guests list and invitation details once authorized
  useEffect(() => {
    if (isAuthorized && (resolvedId || invitationId)) {
      const targetId = resolvedId || invitationId;
      loadPresentGuests(targetId);
      loadInvitationDetails(targetId);
    }
  }, [isAuthorized, resolvedId, invitationId]);

  // Check login session on mount
  useEffect(() => {
    if (!invitationId) return;
    const sessionAuth = sessionStorage.getItem(`receptionist_authorized_${invitationId}`);
    const sessionResolvedId = sessionStorage.getItem(`receptionist_resolved_id_${invitationId}`);
    if (sessionAuth === "true" && sessionResolvedId) {
      setIsAuthorized(true);
      setResolvedId(sessionResolvedId);
    }
  }, [invitationId]);

  // Dynamically load html5-qrcode script
  useEffect(() => {
    if (!isAuthorized) return;

    if ((window as any).Html5Qrcode) {
      setIsHtml5QrcodeLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
    script.async = true;
    script.onload = () => {
      setIsHtml5QrcodeLoaded(true);
    };
    script.onerror = () => {
      setScanErrorMsg("Gagal memuat library pemindai kamera.");
      setScanStatus("error");
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if unmounted before load
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthorized]);

  // Start scanner once script is loaded
  useEffect(() => {
    if (!isAuthorized || !isHtml5QrcodeLoaded || isExpired) return;

    startScanning();

    return () => {
      stopScanning();
    };
  }, [isAuthorized, isHtml5QrcodeLoaded, isExpired]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId) return;

    // Pre-warm AudioContext inside this direct user-interaction handler
    // so Safari allows audio to play later during async scan callbacks.
    try { await createOrResumeAudioCtx(audioCtxRef); } catch (_) {}

    setPinError(false);
    setIsSubmittingPin(true);

    try {
      const res = await fetch("/api/checkin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, pin }),
        cache: "no-store"
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        setResolvedId(data.invitationId);
        setPinError(false);
        sessionStorage.setItem(`receptionist_authorized_${invitationId}`, "true");
        sessionStorage.setItem(`receptionist_resolved_id_${invitationId}`, data.invitationId);
      } else {
        setPinError(true);
        setPin("");
        setTimeout(() => setPinError(false), 2000);
      }
    } catch (err) {
      console.error("PIN verification error:", err);
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 2000);
    } finally {
      setIsSubmittingPin(false);
    }
  };

  const handleLogout = () => {
    stopScanning();
    setIsAuthorized(false);
    setResolvedId("");
    sessionStorage.removeItem(`receptionist_authorized_${invitationId}`);
    sessionStorage.removeItem(`receptionist_resolved_id_${invitationId}`);
  };

  const startScanning = async (mode?: "user" | "environment") => {
    const activeMode = (mode === "user" || mode === "environment") ? mode : facingMode;
    try {
      setScanStatus("scanning");
      setScannedGuest(null);

      // Delay slightly to ensure viewport element is ready in DOM
      setTimeout(async () => {
        const Html5Qrcode = (window as any).Html5Qrcode;
        if (!Html5Qrcode) return;

        if (!qrScannerRef.current) {
          qrScannerRef.current = new Html5Qrcode(scannerContainerId);
        }

        const config = { 
          fps: 10, 
          qrbox: (width: number, height: number) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        };

        await qrScannerRef.current.start(
          { facingMode: activeMode },
          config,
          onScanSuccess,
          onScanFailure
        );
      }, 300);
    } catch (err: any) {
      console.error("Error starting camera scanner:", err);
      setScanErrorMsg("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
      setScanStatus("error");
    }
  };

  const toggleCamera = async () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    
    try {
      await stopScanning();
    } catch (e) {
      console.error(e);
    }
    
    startScanning(nextMode);
  };

  const stopScanning = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Pause scanning immediately on detection
    await stopScanning();
    setScanStatus("processing");

    try {
      // Parse QR code text (expected format: URL containing id and code query parameters,
      // or fallback path: /cek-undangan/[id]/#[base64Code])
      let scannedInvitationId = "";
      let code = "";

      if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
        const url = new URL(decodedText);
        scannedInvitationId = url.searchParams.get("id") || "";
        code = url.searchParams.get("code") || "";

        // Fallback for paths with hash like: /cek-undangan/[id]/#[base64Code]
        if (!scannedInvitationId) {
          const segments = url.pathname.split("/").filter(Boolean);
          if (segments.length > 0) {
            scannedInvitationId = segments[segments.length - 1];
          }
        }
        if (!code && url.hash) {
          let rawHash = url.hash;
          if (rawHash.startsWith("#")) {
            rawHash = rawHash.substring(1);
          }
          if (rawHash.startsWith("/")) {
            rawHash = rawHash.substring(1);
          }
          code = rawHash.split("?")[0];
        }
      } else {
        // Fallback: parse comma separated string "id,code"
        const parts = decodedText.split(",");
        if (parts.length >= 2) {
          scannedInvitationId = parts[0].trim();
          code = parts[1].trim();
        }
      }

      if (!scannedInvitationId || !code) {
        throw new Error("Format Barcode/QR Code tidak valid.");
      }

      // STRICT ISOLATION CHECK: Validate that the scanned guest belongs to this event
      if (scannedInvitationId !== invitationId && scannedInvitationId !== resolvedId) {
        const typeHint = getTypeHint();
        const checkRes = await fetch(`/api/guests?invitationId=${encodeURIComponent(scannedInvitationId)}&type=${encodeURIComponent(typeHint)}&_t=${Date.now()}`, {
          cache: "no-store"
        });
        if (checkRes.ok) {
          const list = await checkRes.json();
          if (list.length > 0 && list[0].invitationId !== resolvedId) {
            throw new Error("Barcode tidak berlaku untuk acara ini!");
          }
        } else {
          throw new Error("Barcode tidak berlaku untuk acara ini!");
        }
      }

      // 1. Fetch guest name from database
      const typeHint = getTypeHint();
      const fetchRes = await fetch(`/api/guests?invitationId=${encodeURIComponent(scannedInvitationId)}&type=${encodeURIComponent(typeHint)}&_t=${Date.now()}`, {
        cache: "no-store"
      });

      let guestName = "";
      if (fetchRes.ok) {
        const list = await fetchRes.json();
        const found = list.find((g: any) => g.code === code);
        if (found) {
          guestName = found.name;
        }
      }

      // If not found in database, decode name from base64 code fallback
      if (!guestName) {
        try {
          guestName = decodeURIComponent(escape(atob(code)));
        } catch {
          guestName = atob(code);
        }
      }

      // 2. Perform check-in PATCH API
      const patchRes = await fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: scannedInvitationId,
          code,
          present: true,
          type: typeHint
        }),
        cache: "no-store"
      });

      if (patchRes.ok) {
        if (soundEnabled) {
          playBeepSound(audioCtxRef);
        }
        setScannedGuest({ name: guestName });
        setScanStatus("success");
        loadPresentGuests(resolvedId || invitationId);

        // Resume scanning automatically after 3 seconds
        setTimeout(() => {
          startScanning();
        }, 3000);
      } else if (patchRes.status === 409) {
        // Guest already checked in — show duplicate warning
        const errData = await patchRes.json();
        setDuplicateGuest({
          name: errData.guestName || guestName,
          checkinTime: errData.checkinTime
        });
        setScanStatus("duplicate");

        // Resume scanning automatically after 4 seconds
        setTimeout(() => {
          setDuplicateGuest(null);
          startScanning();
        }, 4000);
      } else {
        const errData = await patchRes.json();
        throw new Error(errData.error || "Gagal melakukan konfirmasi check-in.");
      }
    } catch (err: any) {
      console.error("Scan processing error:", err);
      setScanErrorMsg(err.message || "Gagal memproses QR Code.");
      setScanStatus("error");
    }
  };

  const onScanFailure = (error: any) => {
    // Silently ignore scan frame failures (normal behavior for html5-qrcode)
  };

  // If invitationId is not provided in URL
  if (!invitationId) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-center shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center gap-6 fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner border border-amber-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Akses Scanner Ditolak</h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed font-semibold">
            Tautan pemindai tidak valid. Harap gunakan tautan scanner penerima tamu resmi yang terdapat pada dasbor kelola undangan Anda.
          </p>
        </div>
        <Link href="/cek-undangan" className="w-full py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          Cari Undangan Saya
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-center shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center fade-in">
      
      {/* 1. Login/Authentication Screen */}
      {!isAuthorized && (
        <form onSubmit={handlePinSubmit} className="space-y-6 w-full py-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Scanner Otorisasi</h3>
            <p className="text-slate-400 text-xs mt-1">Masukkan PIN Penerima Tamu untuk mengaktifkan kamera scanner</p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Masukkan 4 Digit PIN"
              maxLength={6}
              value={pin}
              disabled={isSubmittingPin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-center font-bold text-lg focus:outline-none focus:ring-2 bg-slate-50/50 transition-all ${
                pinError 
                  ? "border-red-500 focus:ring-red-200 text-red-600" 
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500 text-slate-850"
              }`}
            />
            {pinError && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">PIN Otorisasi Salah!</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmittingPin}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmittingPin ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi PIN...
              </>
            ) : (
              "Aktifkan Scanner"
            )}
          </button>
        </form>
      )}

      {/* 2. Active Scanner Screen */}
      {isAuthorized && !isExpired && (
        <div className="space-y-4 w-full relative">
          
          {/* Welcome Event Banner */}
          <div className="text-center py-3.5 px-4 bg-gradient-to-r from-indigo-50/60 via-blue-50/40 to-slate-50/50 rounded-2xl border border-indigo-100/40">
            <span className="text-[9px] font-black text-indigo-500/80 uppercase tracking-widest block font-accent">
              Selamat Datang Di Acara
            </span>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mt-1 leading-tight font-sans">
              {invitationDetails 
                ? `${
                    invitationDetails.source === 'Khitan' ? 'Khitanan' :
                    invitationDetails.source === 'Birthday' ? 'Birthday' :
                    invitationDetails.source === 'Aqiqah' ? 'Aqiqah' :
                    invitationDetails.source === 'Wedding' ? 'Pernikahan' :
                    'Acara'
                  } ${invitationDetails.namaAnak}` 
                : 'Memuat Detail Acara...'}
            </h2>
          </div>

          {/* Header Dashboard Controls */}
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-extrabold text-slate-650 uppercase tracking-wider truncate">
                Check-in: {checkedInCount} Tamu
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCamera}
                disabled={scanStatus !== "scanning"}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={facingMode === "environment" ? "Gunakan Kamera Depan" : "Gunakan Kamera Belakang"}
              >
                <SwitchCamera className={`w-3.5 h-3.5 ${facingMode === "user" ? "text-indigo-600" : "text-slate-500"}`} />
              </button>

              <button
                type="button"
                onClick={async () => {
                  // Pre-warm AudioContext on this direct tap so Safari unlocks audio
                  try { await createOrResumeAudioCtx(audioCtxRef); } catch (_) {}
                  setSoundEnabled(!soundEnabled);
                }}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all shadow-sm cursor-pointer"
                title={soundEnabled ? "Matikan Suara Beep" : "Aktifkan Suara Beep"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-slate-450" />}
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all shadow-sm cursor-pointer"
                title="Kunci Scanner"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Camera Scan Viewport Container */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-100 shadow-inner flex items-center justify-center">
            {/* Viewport DOM element required by html5-qrcode */}
            <div id={scannerContainerId} className="w-full h-full object-cover [&_video]:object-cover" />

            {/* Custom styled scanning box guide */}
            {scanStatus === "scanning" && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-[70%] aspect-square border-2 border-dashed border-indigo-400 rounded-2xl relative">
                  {/* Glowing corners */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
                  
                  {/* Laser line effect */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-bounce shadow-md shadow-indigo-500/50" />
                </div>
                <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-indigo-200 border border-indigo-500/30 flex items-center gap-1">
                  <Camera className="w-3 h-3 animate-pulse" /> Posisikan QR Code di Tengah Box
                </div>
              </div>
            )}

            {/* Processing Overlay */}
            {scanStatus === "processing" && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <span className="text-xs font-bold text-white tracking-wide">Memverifikasi Data Tamu...</span>
              </div>
            )}

            {/* Success Overlay Screen */}
            {scanStatus === "success" && scannedGuest && (
              <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white z-10 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black tracking-wide uppercase">Check-in Sukses</h4>
                <p className="text-xs text-emerald-100 opacity-90 mt-0.5">Selamat Datang di Acara Kami</p>
                
                <div className="w-full mt-5 px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 block">Nama Tamu</span>
                  <span className="text-base font-extrabold block truncate mt-0.5 uppercase tracking-wide">
                    {scannedGuest.name}
                  </span>
                </div>
                <span className="text-[8px] text-emerald-250 mt-4 tracking-wider font-semibold animate-pulse">
                  Membuka kamera kembali dalam 3 detik...
                </span>
              </div>
            )}

            {/* Duplicate Check-in Warning Overlay */}
            {scanStatus === "duplicate" && duplicateGuest && (
              <div className="absolute inset-0 bg-amber-500/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white z-10 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-white text-amber-500 flex items-center justify-center shadow-lg mb-4">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black tracking-wide uppercase">Sudah Check-in!</h4>
                <p className="text-xs text-amber-100 opacity-90 mt-0.5">Tamu ini sudah hadir sebelumnya</p>

                <div className="w-full mt-5 px-4 py-3 bg-white/15 rounded-xl border border-white/25 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 block">Nama Tamu</span>
                  <span className="text-base font-extrabold block truncate mt-0.5 uppercase tracking-wide">
                    {duplicateGuest.name}
                  </span>
                  {duplicateGuest.checkinTime && (
                    <span className="text-[10px] text-amber-100 mt-1 block opacity-80">
                      Check-in:{" "}
                      {new Date(duplicateGuest.checkinTime).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </span>
                  )}
                </div>
                <span className="text-[8px] text-amber-100 mt-4 tracking-wider font-semibold animate-pulse">
                  Membuka kamera kembali dalam 4 detik...
                </span>
              </div>
            )}

            {/* Error Overlay Screen */}
            {scanStatus === "error" && (
              <div className="absolute inset-0 bg-red-650/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white z-10 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-white text-red-650 flex items-center justify-center shadow-lg mb-4">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black tracking-wide uppercase">Pemindaian Gagal</h4>
                <p className="text-xs text-red-100 opacity-90 mt-0.5">{scanErrorMsg}</p>
                
                <button
                  type="button"
                  onClick={() => startScanning()}
                  className="mt-6 px-4 py-2 bg-white text-red-650 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ulangi Pindai
                </button>
              </div>
            )}
          </div>

          {/* Check-in Log List */}
          <div className="w-full pt-4 border-t border-slate-100 mt-4 text-left">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-accent">
              📋 Log Kehadiran Tamu (Terbaru)
            </h4>
            
            {presentGuests.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-1 bg-slate-50 rounded-xl border border-slate-100">
                <span>Belum ada tamu check-in</span>
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                {presentGuests.map((guest, idx) => (
                  <div key={guest.code || idx} className="flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-50 transition-colors">
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="text-xs font-bold text-slate-700 truncate block uppercase tracking-wide">
                        {guest.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      {guest.checkinTime ? new Date(guest.checkinTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Masuk"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Expired Scanner Screen */}
      {isAuthorized && isExpired && (
        <div className="space-y-6 w-full py-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Scanner Kedaluwarsa</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Masa aktif undangan ini telah berakhir pada <strong>{new Date(invitationDetails.expiryDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
            </p>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed font-semibold">
              Pemindaian barcode penerima tamu dinonaktifkan secara otomatis (3 bulan setelah acara selesai). Silakan hubungi admin untuk perpanjangan masa aktif.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            Keluar dari Sistem
          </button>
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans bg-slate-50/50 flex flex-col items-center justify-center p-6">
      {/* Header Logo */}
      <div className="flex items-center gap-2 mb-8">
        <Image src="/logo.png" alt="Bintarti Logo" width={32} height={32} className="rounded-lg bg-white p-0.5 object-contain shadow-sm" />
        <span className="font-bold tracking-wide bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-accent">
          Bintarti Undangan Digital
        </span>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 font-semibold">Memuat scanner...</p>
        </div>
      }>
        <ScannerContent />
      </Suspense>

      <div className="mt-8 text-[10px] text-slate-400 font-semibold flex items-center gap-4">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" /> Beranda
        </Link>
        <span>•</span>
        <Link href="/cek-undangan" className="hover:text-primary transition-colors">
          Cek Undangan
        </Link>
      </div>
    </div>
  );
}
