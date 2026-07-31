"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Plus, Edit2, Trash2, Loader2, Link as LinkIcon, Search, Play, Pause } from "lucide-react";

interface MusicItem {
  id: string;
  label: string;
  url: string;
}

export default function MusicManager() {
  const [musics, setMusics] = useState<MusicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [formData, setFormData] = useState({ id: "", category: "Wedding", label: "", url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMusics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/music");
      const data = await res.json();
      if (res.ok) {
        setMusics(data.filter((m: MusicItem) => m.url !== "" && m.url !== "custom"));
      } else {
        alert(data.error || "Gagal memuat katalog musik");
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMusics();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => setPlayingId(null);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  const togglePlay = (music: MusicItem) => {
    if (playingId === music.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        let audioUrl = music.url;
        if (audioUrl.includes('drive.google.com')) {
          const match = audioUrl.match(/[-\w]{25,}/);
          if (match) {
            audioUrl = `/api/proxy-audio?id=${match[0]}`;
          }
        }
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          alert("Gagal memutar audio. Pastikan format link benar dan dapat diakses.");
          setPlayingId(null);
        });
        setPlayingId(music.id);
      }
    }
  };



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url || !formData.category) return;

    setIsSaving(true);
    try {
      const isEdit = !!editingId;
      const method = isEdit ? "PUT" : "POST";
      const fullLabel = `${formData.category}||${formData.label}`;
      const body = isEdit 
        ? { id: editingId, label: fullLabel, url: formData.url }
        : { label: fullLabel, url: formData.url };

      const res = await fetch("/api/admin/music", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (res.ok) {
        if (isEdit) {
          setMusics(prev => prev.map(m => m.id === editingId ? data : m));
        } else {
          setMusics(prev => [...prev, data]);
        }
        setIsAdding(false);
        setEditingId(null);
        setFormData({ id: "", category: "Wedding", label: "", url: "" });
      } else {
        alert(data.error || "Gagal menyimpan musik");
      }
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus lagu "${label}" dari katalog global?`)) return;

    try {
      const res = await fetch("/api/admin/music", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        setMusics(prev => prev.filter(m => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus musik");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (music: MusicItem) => {
    let cat = "Wedding";
    let title = music.label;
    if (music.label.includes("||")) {
      const parts = music.label.split("||");
      cat = parts[0];
      title = parts[1];
    }
    setFormData({ id: music.id, category: cat, label: title, url: music.url });
    setEditingId(music.id);
    setIsAdding(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" /> Pengelola Musik
          </h2>
          <p className="text-sm text-slate-500">Kelola katalog lagu yang tersedia untuk Visual Designer.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari lagu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ id: "", category: "Wedding", label: "", url: "" });
            }}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Tambah Lagu
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">{editingId ? "Edit Lagu" : "Tambah Lagu Baru"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Aqiqah">Aqiqah</option>
                  <option value="Khitan">Khitan</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Umum">Umum (Semua)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Judul Lagu</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Contoh: Maher Zain - Rahmatun Lil Alameen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">URL (Google Drive / Direct Link)</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSaving ? "Menyimpan..." : "Simpan Lagu"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="px-6 py-4">Judul Lagu</th>
              <th className="px-6 py-4">URL Sumber</th>
              <th className="px-6 py-4 text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {musics.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Katalog musik masih kosong. Silakan tambah lagu baru.
                </td>
              </tr>
            ) : (
              musics
                .filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()))
                .length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Lagu yang dicari tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  musics
                    .filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((music) => {
                      let cat = "Umum";
                      let title = music.label;
                      if (music.label.includes("||")) {
                        const parts = music.label.split("||");
                        cat = parts[0];
                        title = parts[1];
                      }
                      
                      return (
                      <tr key={music.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-black tracking-wider shrink-0">
                            {cat}
                          </span>
                          <span>{title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono bg-slate-100 p-1.5 rounded truncate max-w-sm">
                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{music.url}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {music.url !== "" && music.url !== "custom" && (
                              <>
                                <button
                                  onClick={() => togglePlay(music)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    playingId === music.id 
                                      ? "text-primary bg-blue-50" 
                                      : "text-slate-400 hover:text-primary hover:bg-blue-50"
                                  }`}
                                  title={playingId === music.id ? "Jeda Lagu" : "Putar Lagu"}
                                >
                                  {playingId === music.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => startEdit(music)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Lagu"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(music.id, music.label)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Lagu"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
