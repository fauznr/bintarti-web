"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Loader2, Home } from "lucide-react";
import { supabase } from "../../utils/supabase";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export default function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email.trim() || !password.trim()) {
      setAuthError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthError("Email atau kata sandi salah.");
      setIsLoading(false);
      return;
    }
    
    onAuthSuccess();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!email.trim()) {
      setAuthError("Silakan masukkan email Anda terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin",
    });
    
    setIsLoading(false);
    
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess("Tautan reset kata sandi telah dikirim ke email Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative">
      <button 
        onClick={() => window.location.href = "/"}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200 transition-colors text-sm font-bold"
      >
        <Home className="w-4 h-4" /> Kembali
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 md:p-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border border-slate-100 flex items-center justify-center bg-white p-0.5 mb-4">
          <Image src="/logo.png" alt="Bintarti Logo" width={48} height={48} className="w-full h-full object-contain" />
        </div>
        <h2 className="text-xl font-black text-slate-800 font-accent">
          {isResetMode ? "Lupa Kata Sandi" : "Bintarti Admin Portal"}
        </h2>
        <p className="text-slate-400 text-xs mt-1 text-center max-w-xs leading-relaxed">
          {isResetMode ? "Masukkan email Anda untuk menerima tautan reset kata sandi." : "Halaman ini khusus untuk admin. Silakan masuk menggunakan kredensial Anda."}
        </p>

        <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="w-full mt-8 space-y-4">
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@bintarti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              autoFocus
            />
          </div>

          {!isResetMode && (
            <div className="relative">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              />
            </div>
          )}

          {authError && (
            <p className="text-red-500 text-xs font-semibold text-center mt-1 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {authError}
            </p>
          )}
          
          {authSuccess && (
            <p className="text-green-600 text-xs font-semibold text-center mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {authSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-blue-600 disabled:bg-blue-400 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              isResetMode ? "Kirim Tautan Reset" : "Masuk Dasbor Admin"
            )}
          </button>
          
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => { setIsResetMode(!isResetMode); setAuthError(""); setAuthSuccess(""); }}
              className="text-xs text-slate-400 hover:text-primary transition-colors font-semibold"
            >
              {isResetMode ? "Kembali ke Login" : "Lupa kata sandi?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
