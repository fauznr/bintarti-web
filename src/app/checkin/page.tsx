"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Home } from "lucide-react";

function CheckinContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id") || "";
  const code = searchParams.get("code") || "";
  const typeHint = searchParams.get("type") || "";

  const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
  const [guest, setGuest] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!invitationId || !code) {
      setStatus("error");
      setErrorMsg("Parameter check-in tidak lengkap.");
      return;
    }

    const loadGuestDetails = async () => {
      try {
        // Check invitation expiry first
        const invRes = await fetch(`/api/invitations/search?type=slug&query=${encodeURIComponent(invitationId)}&_t=${Date.now()}`, {
          cache: "no-store"
        });
        if (invRes.ok) {
          const invData = await invRes.json();
          if (invData && invData.found && invData.expiryDate) {
            const expiry = new Date(invData.expiryDate);
            if (expiry < new Date()) {
              setStatus("error");
              setErrorMsg("Undangan telah kedaluwarsa. Masa aktif check-in sudah habis.");
              return;
            }
          }
        }

        const res = await fetch(`/api/guests?invitationId=${encodeURIComponent(invitationId)}&type=${encodeURIComponent(typeHint)}&_t=${Date.now()}`, {
          cache: "no-store"
        });
        if (res.ok) {
          const list = await res.json();
          const found = list.find((g: any) => g.code === code);
          if (found) {
            setGuest(found);
            if (found.present) {
              setStatus("success");
            } else {
              setStatus("ready");
            }
          } else {
            // Decrypt name from base64 if not present in db.json list yet
            let decodedName = "";
            try {
              const binaryStr = atob(code);
              const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
              decodedName = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
            } catch {
              try {
                decodedName = decodeURIComponent(escape(atob(code)));
              } catch {}
            }
            if (decodedName && decodedName.trim() && !/[\uFFFD\u0000-\u001F\u007F-\u009F]/.test(decodedName)) {
              setGuest({
                invitationId,
                code,
                name: decodedName.trim(),
                present: false
              });
              setStatus("ready");
            } else {
              setGuest({
                invitationId,
                code,
                name: "Tamu Undangan",
                present: false
              });
              setStatus("ready");
            }
          }
        } else {
          setStatus("error");
          setErrorMsg("Gagal memuat data undangan.");
        }
      } catch (err) {
        console.error("Error loading guest:", err);
        setStatus("error");
        setErrorMsg("Terjadi kesalahan koneksi server.");
      }
    };

    loadGuestDetails();
  }, [invitationId, code]);

  const handleCheckin = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          code,
          present: true,
          type: typeHint
        }),
        cache: "no-store"
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        alert(data.error || "Gagal melakukan check-in.");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center fade-in">
      {status === "loading" && (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Memuat Data Tamu</h3>
          <p className="text-slate-500 text-xs">
            Mencari data nama tamu di database...
          </p>
        </div>
      )}

      {status === "ready" && guest && (
        <div className="space-y-6 w-full">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mx-auto shadow-inner">
            <Loader2 className="w-10 h-10 animate-pulse text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Konfirmasi Kehadiran</h3>
            <p className="text-slate-400 text-xs mt-1">Silakan konfirmasi kehadiran tamu berikut</p>
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Tamu</p>
            <p className="text-lg font-black text-slate-800 mt-1 uppercase">{guest.name}</p>
          </div>

          <button
            onClick={handleCheckin}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-350 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:shadow-xl transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Konfirmasi Hadir"
            )}
          </button>
        </div>
      )}

      {status === "success" && guest && (
        <div className="space-y-5 w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800">Check-in Berhasil!</h3>
            <p className="text-slate-400 text-xs mt-1">Selamat Datang di Acara Kami</p>
          </div>
          
          <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Tamu</p>
            <p className="text-lg font-black text-slate-800 mt-1 uppercase">{guest.name}</p>
          </div>

          <div className="text-[10px] text-slate-400">
            Kehadiran tamu telah tercatat di database penerima tamu.
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-5 w-full">
          <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Check-in Gagal</h3>
            <p className="text-red-500 text-xs mt-2 font-semibold bg-red-50 px-3 py-1.5 rounded-lg inline-block border border-red-100">
              {errorMsg}
            </p>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
            Pastikan barcode/QR code yang di-scan berasal dari undangan resmi dan koneksi internet stabil.
          </p>
          <Link
            href="/"
            className="mt-6 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CheckinPage() {
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
          <p className="text-sm text-slate-500 font-semibold">Memuat halaman check-in...</p>
        </div>
      }>
        <CheckinContent />
      </Suspense>
    </div>
  );
}
