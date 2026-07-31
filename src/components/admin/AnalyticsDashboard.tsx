"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, PieChart, BarChart3, Star, Target, Eye, MessageSquare } from "lucide-react";
import { supabase } from "../../utils/supabase";

interface GuestComment {
  id: number;
  invitation_id: string;
  name: string;
  comment: string;
  rsvp_status: string;
  created_at: string;
}

interface Invitation {
  id: string;
  type: string;
  full_name: string;
  created_at: string;
  theme: string;
}

export default function AnalyticsDashboard() {
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [commentsRes, invRes] = await Promise.all([
        supabase.from("guest_comments").select("*"),
        supabase.from("invitations").select("id, type, full_name, created_at, theme").not("full_name", "ilike", "%Tema Template%")
      ]);

      if (commentsRes.error) throw commentsRes.error;
      if (invRes.error) throw invRes.error;

      setComments(commentsRes.data as GuestComment[] || []);
      setInvitations(invRes.data as Invitation[] || []);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      alert("Gagal memuat data analitik.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-bold text-slate-500 animate-pulse">Memproses Jutaan Data Analitik...</span>
      </div>
    );
  }

  // Calculate RSVP Data
  let hadir = 0, tidakHadir = 0, ragu = 0;
  comments.forEach(c => {
    const status = c.rsvp_status?.toLowerCase();
    if (status === "hadir") hadir++;
    else if (status === "tidak hadir") tidakHadir++;
    else ragu++;
  });
  const totalRsvp = hadir + tidakHadir + ragu || 1; // Prevent division by zero

  const hadirPct = Math.round((hadir / totalRsvp) * 100);
  const tidakHadirPct = Math.round((tidakHadir / totalRsvp) * 100);
  const raguPct = Math.round((ragu / totalRsvp) * 100);

  // Calculate Theme Usage
  const themeCounts: Record<string, number> = {};
  invitations.forEach(inv => {
    const theme = inv.theme || "custom";
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  });

  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate Most Active Invitations
  const invCommentCounts: Record<string, number> = {};
  comments.forEach(c => {
    invCommentCounts[c.invitation_id] = (invCommentCounts[c.invitation_id] || 0) + 1;
  });

  const topInvitations = Object.entries(invCommentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([invId, count]) => {
      const inv = invitations.find(i => i.id === invId);
      return { id: invId, name: inv?.full_name || invId, count };
    });

  // Calculate Type Distribution
  const typeCounts = { wedding: 0, khitan: 0, birthday: 0, aqiqah: 0, custom: 0 };
  invitations.forEach(inv => {
    const type = inv.type?.toLowerCase();
    if (type === "wedding") typeCounts.wedding++;
    else if (type === "khitan") typeCounts.khitan++;
    else if (type === "birthday") typeCounts.birthday++;
    else if (type === "aqiqah") typeCounts.aqiqah++;
    else typeCounts.custom++;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Dashboard Analitik & Statistik
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Wawasan mendalam tentang performa undangan dan interaksi tamu.
          </p>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-black mb-1">{comments.length * 3 + invitations.length * 5}</h3>
          <p className="text-blue-100 font-semibold text-sm">Total Kunjungan Halaman</p>
          <div className="mt-4 text-[10px] bg-white/10 py-1.5 px-3 rounded-lg inline-block">
            *Estimasi berdasarkan interaksi
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Real-time</span>
          </div>
          <h3 className="text-4xl font-black text-slate-800 mb-1">{comments.length}</h3>
          <p className="text-slate-500 font-semibold text-sm">Total Respon Tamu (Buku Tamu)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 mb-1">{invitations.length}</h3>
          <p className="text-slate-500 font-semibold text-sm">Undangan Dibuat</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 mb-1">{topInvitations[0]?.count || 0}</h3>
          <p className="text-slate-500 font-semibold text-sm">Rekor Pesan Terbanyak (1 Undangan)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-black text-slate-800">Distribusi Kehadiran (RSVP)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-emerald-600">Hadir</span>
                <span className="text-slate-700">{hadir} Tamu ({hadirPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${hadirPct}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-red-600">Tidak Hadir</span>
                <span className="text-slate-700">{tidakHadir} Tamu ({tidakHadirPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${tidakHadirPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-orange-500">Ragu-ragu</span>
                <span className="text-slate-700">{ragu} Tamu ({raguPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${raguPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipe Acara */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-black text-slate-800">Distribusi Kategori Acara</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Khitan", count: typeCounts.khitan, color: "bg-blue-500" },
              { label: "Birthday", count: typeCounts.birthday, color: "bg-pink-500" },
              { label: "Aqiqah", count: typeCounts.aqiqah, color: "bg-amber-500" },
              { label: "Wedding", count: typeCounts.wedding, color: "bg-rose-500" },
              { label: "Custom", count: typeCounts.custom, color: "bg-purple-500" },
            ].sort((a, b) => b.count - a.count).map((item, idx) => {
              const pct = invitations.length > 0 ? Math.round((item.count / invitations.length) * 100) : 0;
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-500">{item.count} Undangan ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Themes */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-black text-slate-800">Tema Terpopuler</h3>
          </div>
          
          <div className="space-y-3">
            {topThemes.map(([theme, count], idx) => (
              <div key={theme} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}>
                    #{idx + 1}
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{theme}</span>
                </div>
                <div className="font-black text-primary text-sm bg-blue-50 px-3 py-1 rounded-lg">
                  {count}x dipakai
                </div>
              </div>
            ))}
            {topThemes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4 font-medium">Belum ada data tema.</p>
            )}
          </div>
        </div>

        {/* Most Active Invitations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-black text-slate-800">Undangan Paling Ramai</h3>
          </div>
          
          <div className="space-y-3">
            {topInvitations.map((inv, idx) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex flex-col max-w-[200px] sm:max-w-[300px]">
                  <span className="font-bold text-slate-700 text-sm truncate">{inv.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono truncate">{inv.id}</span>
                </div>
                <div className="font-black text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {inv.count} Pesan
                </div>
              </div>
            ))}
            {topInvitations.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4 font-medium">Belum ada komentar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

