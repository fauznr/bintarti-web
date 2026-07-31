"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Trash2, MessageSquare, Download } from "lucide-react";
import { supabase } from "../../utils/supabase";

interface GuestComment {
  id: number;
  invitation_id: string;
  name: string;
  comment: string;
  rsvp_status: string;
  created_at: string;
  invitations?: {
    id: string;
    full_name: string;
    type: string;
    whatsapp?: string;
  };
}

export default function GuestbookManager() {
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("guest_comments")
        .select("*, invitations(id, full_name, type, whatsapp)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments((data as unknown as GuestComment[]) || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      alert("Gagal memuat ucapan tamu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini secara permanen?")) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from("guest_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Gagal menghapus ucapan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredComments = comments.filter(c => {
    const q = searchQuery.toLowerCase();
    const guestName = c.name?.toLowerCase() || "";
    const commentText = c.comment?.toLowerCase() || "";
    const invitationName = c.invitations?.full_name?.toLowerCase() || "";
    const invitationId = c.invitation_id?.toLowerCase() || "";
    const whatsapp = c.invitations?.whatsapp?.toLowerCase() || "";
    
    return guestName.includes(q) || commentText.includes(q) || invitationName.includes(q) || invitationId.includes(q) || whatsapp.includes(q);
  });


  const groupedComments = Object.values(
    filteredComments.reduce((acc, curr) => {
      const id = curr.invitation_id;
      if (!acc[id]) {
        acc[id] = {
          invitationId: id,
          invitationName: curr.invitations?.full_name || id,
          whatsapp: curr.invitations?.whatsapp || "",
          comments: []
        };
      }
      acc[id].comments.push(curr);
      return acc;
    }, {} as Record<string, { invitationId: string, invitationName: string, whatsapp: string, comments: GuestComment[] }>)
  ).sort((a, b) => b.comments.length - a.comments.length);

  const handleExportCSV = (group: { invitationId: string, invitationName: string, whatsapp?: string, comments: GuestComment[] }) => {
    if (group.comments.length === 0) {

      alert("Tidak ada data untuk diekspor.");
      return;
    }
    
    // Create CSV header
    const headers = ["ID Undangan", "Nama Klien (Undangan)", "Nama Tamu", "Status RSVP", "Ucapan", "Tanggal Kirim"];
    
    // Format rows
    const rows = group.comments.map(c => [
      c.invitation_id,
      c.invitations?.full_name || "N/A",
      c.name,
      c.rsvp_status,
      // Enclose text in quotes and escape internal quotes to prevent CSV breakage from commas/newlines
      `"${c.comment.replace(/"/g, '""')}"`,
      new Date(c.created_at).toLocaleString('id-ID')
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Buku_Tamu_${group.invitationName.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Buku Tamu / Ucapan
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Kelola dan moderasi ucapan dari seluruh undangan klien.
          </p>
        </div>
        
        {/* Actions (Search & Download) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama tamu, ucapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
            />
          </div>
          

        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Memuat ucapan...</span>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-slate-700">Tidak ada ucapan ditemukan</h3>
            <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm">
              Coba gunakan kata kunci lain atau belum ada tamu yang mengisi buku tamu.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedComments.map((group) => (
              <div key={group.invitationId} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{group.invitationName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-bold text-slate-500">{group.comments.length} Ucapan</p>
                      {group.whatsapp && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-500">{group.whatsapp}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleExportCSV(group)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Ekspor CSV
                    </button>
                    {group.whatsapp && (
                      <a 
                        href={`https://wa.me/${group.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${group.invitationName}, berikut adalah data buku tamu dari undangan Anda. Silakan cek dokumen CSV yang kami lampirkan ya.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-green-600 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Kirim WA
                      </a>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.comments.map((comment) => (
              <div key={comment.id} className="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-slate-50 hover:bg-white hover:border-primary/30 group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm leading-tight">{comment.name || "Tamu Anonim"}</span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(comment.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                    </div>
                    {comment.rsvp_status && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        comment.rsvp_status.toLowerCase() === "hadir" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : comment.rsvp_status.toLowerCase() === "tidak hadir"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}>
                        {comment.rsvp_status}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm mb-4">
                    <p className="text-sm font-medium text-slate-600 line-clamp-4 italic">
                      "{comment.comment}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex flex-col"></div>
                  
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    disabled={isDeleting === comment.id}
                    className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-100 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Hapus Ucapan"
                  >
                    {isDeleting === comment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
