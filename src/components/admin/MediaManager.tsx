"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Image as ImageIcon, Loader2, Trash2, ExternalLink, ChevronRight, Search } from "lucide-react";
import Image from "next/image";

interface MediaFile {
  id: string;
  name: string;
  created_at: string;
  publicUrl: string;
  folderPath: string;
}

interface MediaFolder {
  name: string;
}

export default function MediaManager() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);

  const [activeDefaultTab, setActiveDefaultTab] = useState<"khitan" | "birthday" | "aqiqah" | "wedding" | "custom">("khitan");
  const [activeCustomerTab, setActiveCustomerTab] = useState<"khitan" | "birthday" | "aqiqah" | "wedding" | "custom">("khitan");
  
  const [defaultSearch, setDefaultSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [defaultPage, setDefaultPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);

  useEffect(() => {
    setDefaultPage(1);
  }, [activeDefaultTab, defaultSearch]);

  useEffect(() => {
    setCustomerPage(1);
  }, [activeCustomerTab, customerSearch]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/admin/invitations");
      const data = await res.json();
      if (res.ok) setInvitations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok) {
        setFolders(data);
      } else {
        alert(data.error || "Gagal memuat folder media");
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const fetchFiles = async (folderName: string) => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch(`/api/admin/media?folder=${folderName}`);
      const data = await res.json();
      if (res.ok) {
        setFiles(data);
      } else {
        alert(data.error || "Gagal memuat isi folder");
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingFiles(false);
  };

  useEffect(() => {
    fetchFolders();
    fetchInvitations();
  }, []);



  const handleSelectFolder = (folderName: string) => {
    setSelectedFolder(folderName);
    fetchFiles(folderName);
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Hapus file ${file.name} secara permanen? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    const path = `${file.folderPath}/${file.name}`;
    setDeletingPath(path);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.name !== file.name));
      } else {
        alert(data.error || "Gagal menghapus file");
      }
    } catch (e) {
      console.error(e);
    }
    setDeletingPath(null);
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!confirm(`Hapus seluruh folder ${folderName} beserta isinya? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    setDeletingPath(`folder_${folderName}`);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: true, folderPath: folderName })
      });
      const data = await res.json();
      if (res.ok) {
        setFolders(prev => prev.filter(f => f.name !== folderName));
      } else {
        alert(data.error || "Gagal menghapus folder");
      }
    } catch (e) {
      console.error(e);
    }
    setDeletingPath(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isDefaultTheme = (name: string) => /^(khitan|birthday|aqiqah|wedding)-\d+$/.test(name) || name.startsWith("theme-");
  
  const getCategory = (name: string, isDefault: boolean) => {
    if (isDefault) {
      if (name.startsWith("khitan-")) return "khitan";
      if (name.startsWith("birthday-")) return "birthday";
      if (name.startsWith("aqiqah-")) return "aqiqah";
      if (name.startsWith("wedding-")) return "wedding";
      return "custom";
    } else {
      const inv = invitations.find(i => i.id === name);
      if (inv) {
        const typeLower = (inv.type || "").toLowerCase();
        if (typeLower.includes("khitan")) return "khitan";
        if (typeLower.includes("birthday") || typeLower.includes("ulang tahun")) return "birthday";
        if (typeLower.includes("aqiqah")) return "aqiqah";
        if (typeLower.includes("wedding") || typeLower.includes("pernikahan")) return "wedding";
        return "custom";
      }
      if (name.startsWith("wedding_")) return "wedding";
      if (name.startsWith("khitan_")) return "khitan";
      if (name.startsWith("birthday_")) return "birthday";
      if (name.startsWith("aqiqah_")) return "aqiqah";
      return "custom";
    }
  };

  const defaultFolders = folders.filter(f => isDefaultTheme(f.name));
  const customerFolders = folders.filter(f => !isDefaultTheme(f.name));

  const filteredDefault = defaultFolders
    .filter(f => getCategory(f.name, true) === activeDefaultTab)
    .filter(f => f.name.toLowerCase().includes(defaultSearch.toLowerCase()));
    
  const filteredCustomer = customerFolders
    .filter(f => getCategory(f.name, false) === activeCustomerTab)
    .filter(f => f.name.toLowerCase().includes(customerSearch.toLowerCase()));

  const TABS = [
    { id: "khitan", label: "Khitan" },
    { id: "birthday", label: "Ulang Tahun" },
    { id: "aqiqah", label: "Aqiqah" },
    { id: "wedding", label: "Pernikahan" },
    { id: "custom", label: "Custom" },
  ] as const;

  const renderTabs = (
    activeTab: string, 
    setActiveTab: (tab: any) => void
  ) => (
    <div className="flex overflow-x-auto gap-2 p-4 bg-white border-b border-slate-100 no-scrollbar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === tab.id 
              ? "bg-primary text-white" 
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderFolderList = (folderList: MediaFolder[], page: number, setPage: (p: number) => void) => {
    const totalPages = Math.ceil(folderList.length / 10);
    const startIndex = (page - 1) * 10;
    const paginatedList = folderList.slice(startIndex, startIndex + 10);
    return (
    <div className="divide-y divide-slate-100">
      {paginatedList.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">Tidak ada folder di kategori ini.</div>
      ) : (
        paginatedList.map(folder => (
          <div key={folder.name} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group">
            <button
              onClick={() => handleSelectFolder(folder.name)}
              className="flex-1 flex items-center gap-3 text-left"
            >
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{folder.name}</p>
                <p className="text-xs text-slate-500">Assets Undangan</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.name); }}
                disabled={deletingPath === `folder_${folder.name}`}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Hapus Folder"
              >
                {deletingPath === `folder_${folder.name}` ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Halaman {page} dari {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-50 transition-colors"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-50 transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" /> Pengelola Media
          </h2>
          <p className="text-sm text-slate-500">Kelola foto-foto yang telah diunggah di undangan klien Anda.</p>
        </div>
      </div>

      {!selectedFolder ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-bold text-slate-700 text-sm">
                Media Tema Bawaan (Default)
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari folder default..."
                  value={defaultSearch}
                  onChange={(e) => setDefaultSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
                />
              </div>
            </div>
            {renderTabs(activeDefaultTab, setActiveDefaultTab)}
            {renderFolderList(filteredDefault, defaultPage, setDefaultPage)}
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-bold text-slate-700 text-sm">
                Media dari Customer
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari folder customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
                />
              </div>
            </div>
            {renderTabs(activeCustomerTab, setActiveCustomerTab)}
            {renderFolderList(filteredCustomer, customerPage, setCustomerPage)}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <button
            onClick={() => setSelectedFolder(null)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-6 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Daftar Folder
          </button>
          
          <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-400" /> Folder: {selectedFolder}
          </h3>

          {isLoadingFiles ? (
            <div className="flex items-center justify-center p-8 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Folder ini kosong.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map(file => (
                <div key={file.name} className="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 aspect-square">
                  <Image
                    src={file.publicUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold truncate mb-2">{file.name}</p>
                    <div className="flex gap-2">
                      <a
                        href={file.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-white/20 hover:bg-white/40 rounded text-white text-xs font-bold flex justify-center transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(file)}
                        disabled={deletingPath === `${file.folderPath}/${file.name}`}
                        className="flex-1 py-1.5 bg-red-500/80 hover:bg-red-500 rounded text-white text-xs font-bold flex justify-center transition-colors disabled:opacity-50"
                      >
                        {deletingPath === `${file.folderPath}/${file.name}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
