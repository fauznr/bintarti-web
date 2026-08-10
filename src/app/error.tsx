"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD6] px-4 text-center">
      <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-3 font-serif">
          Sesuatu Telah Terjadi
        </h2>
        
        <p className="text-slate-600 mb-8 text-sm leading-relaxed">
          Maaf, sistem mengalami sedikit gangguan saat mencoba memuat halaman ini. Silakan coba muat ulang atau kembali ke beranda.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
