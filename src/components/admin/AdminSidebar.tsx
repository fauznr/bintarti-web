"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutTemplate, Image as ImageIcon, Music, Lock, Sparkles, LogOut, MessageSquare, BarChart3 } from "lucide-react";

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeAdminTab: "dashboard" | "settings" | "media" | "music" | "guestbook" | "analytics";
  setActiveAdminTab: (tab: "dashboard" | "settings" | "media" | "music" | "guestbook" | "analytics") => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeAdminTab,
  setActiveAdminTab,
  onLogout
}: AdminSidebarProps) {
  const handleTabClick = (tab: "dashboard" | "settings" | "media" | "music" | "guestbook" | "analytics") => {
    setActiveAdminTab(tab);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside className={`bg-white border-r border-slate-200/80 shadow-sm flex flex-col z-20 shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'}`}>
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center bg-white p-0.5">
            <Image src="/logo.png" alt="Bintarti Logo" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wide bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-accent leading-tight">
              Bintarti Admin
            </span>
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <button
          onClick={() => handleTabClick("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "dashboard" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Manajemen Undangan
        </button>

        <button
          onClick={() => handleTabClick("analytics")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "analytics" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <BarChart3 className="w-4 h-4" />
          Analitik & Statistik
        </button>
        
        <button
          onClick={() => handleTabClick("media")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "media" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <ImageIcon className="w-4 h-4" />
          Pengelola Media
        </button>

        <button
          onClick={() => handleTabClick("music")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "music" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <Music className="w-4 h-4" />
          Pengelola Musik
        </button>

        <button
          onClick={() => handleTabClick("guestbook")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "guestbook" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <MessageSquare className="w-4 h-4" />
          Buku Tamu / Ucapan
        </button>

        <button
          onClick={() => handleTabClick("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer ${activeAdminTab === "settings" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <Lock className="w-4 h-4" />
          Pengaturan Akun
        </button>
        
        <div className="pt-4 pb-2">
          <div className="h-px w-full bg-slate-100"></div>
        </div>

        <Link
          href="/sandbox-tema?admin=true"
          target="_blank"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs text-purple-600 hover:bg-purple-50 transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Edit Desain Global
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
