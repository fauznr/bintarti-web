"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../utils/supabase";
import MediaManager from "../../components/admin/MediaManager";
import MusicManager from "../../components/admin/MusicManager";
import GuestbookManager from "../../components/admin/GuestbookManager";
import AnalyticsDashboard from "../../components/admin/AnalyticsDashboard";
import AdminAuth from "../../components/admin/AdminAuth";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Lock,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Trash2,
  ExternalLink,
  Users,
  Eye,
  X,
  Sparkles,
  Plus,
  Camera,
  ImageDown,
  ChevronDown,
  LayoutTemplate,
  Menu,
  Image as ImageIcon,
  Music,
  Heart
} from "lucide-react";

interface AdminInvitation {
  id: string;
  type: string; // "Khitan" | "Birthday"
  whatsapp: string;
  shopeeOrder: string;
  theme: string;
  music: string;
  birthdayAge: string;
  fullName: string;
  nickname: string;
  parentsName: string;
  childOrder: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  schedule: string;
  invitedGuests: string;
  bankAccount: string;
  giftAddress: string;
  mapsLink?: string;
  videoLink?: string;
  status: string;
  linkUndangan: string;
  linkTamu: string;
  notes: string;
  weddingData?: any;
  receptionistPin: string;
  isPro: boolean;
  expiryDate: string | null;
  childPhotoUrl?: string;
  galleryImages?: string[];
  activitiesPhotoUrl?: string;
  layoutConfig?: any;
  createdAt: string;
}

function formatFriendlyDate(dateStr: string) {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [_, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(date.getTime())) return dateStr;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${days[date.getDay()]}, ${parseInt(day)} ${months[date.getMonth()]} ${year}`;
}

const DEFAULT_MUSIC_CATALOG = [
  { label: "-- Pilih Lagu dari Katalog --", url: "" },
  { label: "Gunakan Link Sendiri (Custom)", url: "custom" }
];

function formatFriendlyTime(timeStr: string) {
  if (!timeStr) return "";
  const match = timeStr.match(/^(\d{2}):(\d{2})$/);
  if (match) return `${timeStr} WIB`;
  const matchWithSec = timeStr.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (matchWithSec) return `${matchWithSec[1]}:${matchWithSec[2]} WIB`;
  return timeStr;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "settings" | "media" | "music" | "guestbook" | "analytics">("dashboard");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dashboard Data States
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [selectedInvitation, setSelectedInvitation] = useState<AdminInvitation | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [modalExpiryDate, setModalExpiryDate] = useState("");
  const [isSavingExpiryDate, setIsSavingExpiryDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Edit states
  const [modalDetails, setModalDetails] = useState<Partial<AdminInvitation>>({});
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Modal Create states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [musicCatalog, setMusicCatalog] = useState(DEFAULT_MUSIC_CATALOG);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        const res = await fetch('/api/admin/music');
        if (res.ok) {
          const dbMusic = await res.json();
          // Merge with DEFAULT_MUSIC_CATALOG to keep "Pilih Lagu" and "Custom"
          // We can just use what's in the DB if it contains them, 
          // but to be safe, filter out defaults from DB and prepend our local defaults.
          const filteredDbMusic = dbMusic.filter((m: any) => m.url !== "" && m.url !== "custom");
          setMusicCatalog([...DEFAULT_MUSIC_CATALOG, ...filteredDbMusic]);
        }
      } catch (error) {
        console.error("Failed to load global music catalog", error);
      }
    };
    loadMusic();
  }, []);

  const [createFields, setCreateFields] = useState<Partial<AdminInvitation>>({
    type: "Khitan",
    fullName: "",
    nickname: "",
    parentsName: "",
    childOrder: "",
    birthdayAge: "",
    whatsapp: "",
    shopeeOrder: "",
    theme: "",
    music: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    schedule: "",
    invitedGuests: "",
    mapsLink: "",
    videoLink: "",
    bankAccount: "",
    giftAddress: "",
    isPro: false,
    status: "Diproses"
  });

  // Track edited rows to show "Save" button
  // Key: invitationId, Value: { status, linkUndangan, linkTamu }
  const [editedRows, setEditedRows] = useState<Record<string, Partial<AdminInvitation>>>({});
  const [savingRows, setSavingRows] = useState<Record<string, boolean>>({});

  const [profileLoading, setProfileLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Delete modal states
  const [invitationToDelete, setInvitationToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context is not available"));
          ctx.drawImage(img, 0, 0, width, height);
          
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileLoading(true);
    try {
      const base64 = await compressImage(file);
      handleModalFieldChange("childPhotoUrl", base64);
    } catch (err) {
      alert("Gagal mengompres gambar profil: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleActivitiesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActivitiesLoading(true);
    try {
      const base64 = await compressImage(file);
      handleModalFieldChange("activitiesPhotoUrl", base64);
    } catch (err) {
      alert("Gagal mengompres gambar kegiatan: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = Array.isArray(modalDetails.galleryImages) ? [...modalDetails.galleryImages] : [];
    if (currentImages.length + files.length > 10) {
      alert("Maksimal 10 foto dalam galeri!");
      return;
    }

    setGalleryLoading(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await compressImage(file);
        compressedList.push(base64);
      }
      handleModalFieldChange("galleryImages", [...currentImages, ...compressedList] as any);
    } catch (err) {
      alert("Gagal mengompres gambar galeri: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        fetchInvitations();
      }
      setIsLoadingAuth(false);
    });
  }, []);

  

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!newPassword.trim() || newPassword.length < 6) {
      setAuthError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);
    
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess("Kata sandi berhasil diperbarui!");
      setNewPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("bintarti_admin_authenticated");
    sessionStorage.removeItem("bintarti_admin_pin");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setInvitations([]);
    setEditedRows({});
    setExpiryFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
    setActiveAdminTab("dashboard");
  };

  const getAuthHeaders = async (includeContentType = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: any = { "Authorization": `Bearer ${session?.access_token || ""}` };
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
  };

  const fetchInvitations = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/admin/invitations?_t=${Date.now()}`, {
        headers: await getAuthHeaders(),
        cache: "no-store"
      });

      if (res.ok) {
        const data = await res.json();
        // Parse wedding data if it's stored in notes as JSON
        const processedData = data.map((item: any) => {
          let weddingData = null;
          if (item.type?.toLowerCase().includes("wedding") && item.notes) {
            try {
              const parsed = JSON.parse(item.notes);
              if (parsed && typeof parsed === "object") {
                weddingData = parsed;
                // If the json has an adminNoteText, use it as the actual admin note
                item.notes = parsed.adminNoteText || "";
              }
            } catch (e) {
              // Not JSON, just regular note
            }
          }
          return { ...item, weddingData };
        });
        setInvitations(processedData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      return false;
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleReload = () => {
    fetchInvitations();
  };

  const handleFieldChange = (id: string, field: keyof AdminInvitation, value: any) => {
    const original = invitations.find(item => item.id === id);
    if (!original) return;

    setEditedRows(prev => {
      const currentEdit = prev[id] || {};
      const updatedEdit = {
        ...currentEdit,
        [field]: value
      };

      // Check if changes are different from original data
      const isStatusChanged = updatedEdit.status !== undefined && updatedEdit.status !== original.status;
      const isLinkUndanganChanged = updatedEdit.linkUndangan !== undefined && updatedEdit.linkUndangan !== original.linkUndangan;
      const isLinkTamuChanged = updatedEdit.linkTamu !== undefined && updatedEdit.linkTamu !== original.linkTamu;
      const isProChanged = updatedEdit.isPro !== undefined && updatedEdit.isPro !== original.isPro;

      if (!isStatusChanged && !isLinkUndanganChanged && !isLinkTamuChanged && !isProChanged) {
        // If back to original, remove from dirty state tracker
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }

      return {
        ...prev,
        [id]: updatedEdit
      };
    });
  };

  const handleSaveRow = async (id: string) => {
    
    const edits = editedRows[id];
    if (!edits) return;

    setSavingRows(prev => ({ ...prev, [id]: true }));

    try {
      const res = await fetch("/api/admin/invitations", {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({
          id,
          ...edits
        })
      });

      if (res.ok) {
        // Check if status is updated to Selesai
        const originalItem = invitations.find(item => item.id === id);
        const mergedItem = originalItem ? { ...originalItem, ...edits } : null;

        // Update local state table
        setInvitations(prev =>
          prev.map(item =>
            item.id === id
              ? {
                  ...item,
                  status: edits.status !== undefined ? edits.status : item.status,
                  linkUndangan: edits.linkUndangan !== undefined ? edits.linkUndangan : item.linkUndangan,
                  linkTamu: edits.linkTamu !== undefined ? edits.linkTamu : item.linkTamu,
                  isPro: edits.isPro !== undefined ? edits.isPro : item.isPro
                }
              : item
          )
        );

        // Remove from dirty state
        setEditedRows(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });

        // Trigger WhatsApp auto-send prompt if status is changed to Selesai
        if (edits.status && edits.status.toLowerCase() === "selesai" && mergedItem) {
          setTimeout(() => {
            if (confirm("Status undangan berhasil diubah menjadi 'Selesai'. Apakah Anda ingin langsung mengirim pesan WhatsApp template otomatis ke nomor klien?")) {
              handleSendWhatsAppCompletion(mergedItem);
            }
          }, 100);
        }
      } else {
        alert("Gagal menyimpan perubahan.");
      }
    } catch (err) {
      console.error("Save row error:", err);
      alert("Terjadi kesalahan koneksi saat menyimpan.");
    } finally {
      setSavingRows(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDownloadCover = (item: AdminInvitation) => {
    setDownloadingId(item.id);
    
    const filename = encodeURIComponent(item.shopeeOrder || item.id);
    const encodedId = encodeURIComponent(item.id);
    const popupUrl = `/sandbox-tema/${encodedId}?downloadCover=true&filename=${filename}`;
    
    // Open a popup window so the browser actively renders it (Chrome throttles hidden iframes)
    const popup = window.open(popupUrl, "BintartiScreenshot", "width=450,height=1000,left=-10000");
    
    let fallbackTimeout: NodeJS.Timeout;

    const cleanup = () => {
       if (popup && !popup.closed) {
         popup.close();
       }
       setDownloadingId(null);
       window.removeEventListener("message", onMessage);
       clearTimeout(fallbackTimeout);
    };

    const onMessage = (e: MessageEvent) => {
      if (e.data === "DOWNLOAD_COVER_DONE_" + item.id || e.data === "DOWNLOAD_COVER_ERROR_" + item.id) {
         cleanup();
         if (e.data === "DOWNLOAD_COVER_ERROR_" + item.id) {
           alert("Gagal mengunduh gambar cover. Silakan coba lagi.");
         }
      }
    };
    
    fallbackTimeout = setTimeout(() => {
      cleanup();
      alert("Proses download terhenti karena memakan waktu terlalu lama (15 detik). Pastikan koneksi lancar dan coba lagi.");
    }, 15000);

    window.addEventListener("message", onMessage);
  };

  const handleDeleteRow = (id: string, name: string) => {
    setInvitationToDelete({ id, name });
    setDeleteConfirmText("");
  };

  const executeDeleteRow = async () => {
    if (!invitationToDelete) return;

    if (deleteConfirmText !== "HAPUS") {
      alert("Silakan ketik 'HAPUS' untuk mengonfirmasi.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/invitations?id=${encodeURIComponent(invitationToDelete.id)}`, {
        method: "DELETE",
        headers: await getAuthHeaders()
      });

      if (res.ok) {
        setInvitations(prev => prev.filter(item => item.id !== invitationToDelete.id));
        setEditedRows(prev => {
          const copy = { ...prev };
          delete copy[invitationToDelete.id];
          return copy;
        });
        setInvitationToDelete(null);
      } else {
        alert("Gagal menghapus data undangan.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getWhatsAppLink = (number: string, text?: string) => {
    let phone = number.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }
    return `https://api.whatsapp.com/send?phone=${phone}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
  };

  const handleSendWhatsAppCompletion = (item: AdminInvitation) => {
    const namaKlien = item.fullName.split(" ")[0] || "Klien";
    const namaAnak = item.fullName || "Anak";
    
    // Build links
    const manageLink = `https://bintarti.store/cek-undangan/${item.id}`;
    const scannerLink = `https://bintarti.store/checkin/scan?id=${item.id}`;
    const pinCode = item.receptionistPin || "2104";

    const proMessage = item.isPro 
      ? `*Fitur Scanner Penerima Tamu (PRO)*:
Gunakan link pemindai & PIN berikut untuk penerima tamu Anda di hari-H:
🔗 ${scannerLink}
🔑 PIN Otorisasi Receptionist: *${pinCode}*`
      : `*Catatan*: Untuk mengaktifkan fitur Scanner Penerima Tamu di pintu masuk dan analitik kehadiran real-time, silakan hubungi admin untuk upgrade ke versi PRO.`;

    let message = `Halo *${namaKlien}*! 👋

Kabar gembira, undangan digital Anda untuk acara *${namaAnak}* telah *SELESAI* dibuat dan aktif! 🎉`;

    if (item.linkUndangan) {
      message += `\n\nPratinjau Undangan Anda:
🔗 ${item.linkUndangan}`;
    }

    message += `\n\nAnda sekarang dapat mengelola daftar tamu, memantau kehadiran, dan membagikan undangan Anda melalui tautan Panel Kelola berikut:
🔗 ${manageLink}

${proMessage}

Terima kasih telah mempercayakan undangan digital Anda kepada Bintarti! Semoga acara berjalan lancar. 🙏`;

    const waUrl = getWhatsAppLink(item.whatsapp, message);
    window.open(waUrl, "_blank");
  };

  const handleOpenDetails = (item: AdminInvitation) => {
    setSelectedInvitation(item);
    setAdminNote(item.notes || "");
    setModalExpiryDate(item.expiryDate ? item.expiryDate.split("T")[0] : "");
    setModalDetails({
      fullName: item.fullName || "",
      nickname: item.nickname || "",
      parentsName: item.parentsName || "",
      childOrder: item.childOrder || "",
      birthdayAge: item.birthdayAge || "",
      eventDate: item.eventDate || "",
      eventTime: item.eventTime || "",
      eventLocation: item.eventLocation || "",
      theme: item.theme || "",
      music: item.music || "",
      schedule: item.schedule || "",
      invitedGuests: item.invitedGuests || "",
      bankAccount: item.bankAccount || "",
      giftAddress: item.giftAddress || "",
      mapsLink: item.mapsLink || "",
      videoLink: item.videoLink || "",
      whatsapp: item.whatsapp || "",
      shopeeOrder: item.shopeeOrder || "",
      receptionistPin: item.receptionistPin || "",
      childPhotoUrl: item.childPhotoUrl || "",
      galleryImages: item.galleryImages || [],
      activitiesPhotoUrl: item.activitiesPhotoUrl || "",
      weddingData: item.weddingData || {}
    });
  };

  const handleWeddingDataChange = (field: string, value: string) => {
    setModalDetails(prev => ({
      ...prev,
      weddingData: {
        ...(prev.weddingData || {}),
        [field]: value
      }
    }));
  };

  const handleModalFieldChange = (field: keyof AdminInvitation, value: any) => {
    setModalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveModalDetails = async () => {
    if (!selectedInvitation) return;
    
    

    setIsSavingDetails(true);
    try {
      // Reconstruct notes JSON if it's a wedding
      let finalNotes = selectedInvitation.notes || "";
      if (selectedInvitation.type?.toLowerCase().includes("wedding")) {
        finalNotes = JSON.stringify({
          ...(modalDetails.weddingData || {}),
          adminNoteText: adminNote // preserve admin note
        });

        // Sync to top-level fields so other pages see the changes
        if (modalDetails.weddingData?.akadDate || modalDetails.weddingData?.resepsiDate) {
          modalDetails.eventDate = modalDetails.weddingData.akadDate || modalDetails.weddingData.resepsiDate;
        }
        if (modalDetails.weddingData?.groomNickname && modalDetails.weddingData?.brideNickname) {
          modalDetails.fullName = `${modalDetails.weddingData.groomNickname} & ${modalDetails.weddingData.brideNickname}`;
        }
      }

      const res = await fetch("/api/admin/invitations", {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({
          id: selectedInvitation.id,
          ...modalDetails,
          notes: finalNotes
        })
      });

      if (res.ok) {
        // Update local state list
        setInvitations(prev =>
          prev.map(item =>
            item.id === selectedInvitation.id
              ? { ...item, ...modalDetails }
              : item
          )
        );
        // Update selected locally
        setSelectedInvitation(prev => prev ? { ...prev, ...modalDetails } : null);
        alert("Detail acara berhasil disimpan!");
      } else {
        alert("Gagal menyimpan detail acara.");
      }
    } catch (err) {
      console.error("Save details error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleSaveExpiryDate = async () => {
    if (!selectedInvitation) return;
    
    

    setIsSavingExpiryDate(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({
          id: selectedInvitation.id,
          expiryDate: modalExpiryDate ? new Date(modalExpiryDate).toISOString() : null
        })
      });

      if (res.ok) {
        const updatedExpiry = modalExpiryDate ? new Date(modalExpiryDate).toISOString() : null;
        // Update local state list
        setInvitations(prev =>
          prev.map(item =>
            item.id === selectedInvitation.id
              ? { ...item, expiryDate: updatedExpiry }
              : item
          )
        );
        // Update selected notes locally
        setSelectedInvitation(prev => prev ? { ...prev, expiryDate: updatedExpiry } : null);
        alert("Tanggal kedaluwarsa berhasil disimpan.");
      } else {
        alert("Gagal menyimpan tanggal kedaluwarsa.");
      }
    } catch (err) {
      console.error("Save expiry date error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSavingExpiryDate(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedInvitation) return;
    
    

    setIsSavingNote(true);
    try {
      // Reconstruct notes JSON if it's a wedding
      let finalNotes = adminNote;
      if (selectedInvitation.type?.toLowerCase().includes("wedding")) {
        finalNotes = JSON.stringify({
          ...(selectedInvitation.weddingData || {}),
          adminNoteText: adminNote
        });
      }

      const res = await fetch("/api/admin/invitations", {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({
          id: selectedInvitation.id,
          notes: finalNotes
        })
      });

      if (res.ok) {
        // Update local state list
        setInvitations(prev =>
          prev.map(item =>
            item.id === selectedInvitation.id
              ? { ...item, notes: adminNote }
              : item
          )
        );
        // Update selected notes locally
        setSelectedInvitation(prev => prev ? { ...prev, notes: adminNote } : null);
      } else {
        alert("Gagal menyimpan catatan.");
      }
    } catch (err) {
      console.error("Save note error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!createFields.type || !createFields.fullName || !createFields.whatsapp) {
      alert("Tipe Acara, Nama Lengkap Anak, dan WhatsApp wajib diisi!");
      return;
    }

    
    

    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(createFields)
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.invitation) {
          // Map backend format back to AdminInvitation format
          const newItem: AdminInvitation = {
            id: resData.invitation.id,
            type: resData.invitation.type,
            whatsapp: resData.invitation.whatsapp,
            shopeeOrder: resData.invitation.shopee_order || "",
            theme: resData.invitation.theme || "",
            music: resData.invitation.music || "",
            birthdayAge: resData.invitation.birthday_age || "",
            fullName: resData.invitation.full_name,
            nickname: resData.invitation.nickname || "",
            parentsName: resData.invitation.parents_name || "",
            childOrder: resData.invitation.child_order || "",
            eventDate: resData.invitation.event_date || "",
            eventTime: resData.invitation.event_time || "",
            eventLocation: resData.invitation.event_location || "",
            schedule: resData.invitation.schedule || "",
            invitedGuests: resData.invitation.invited_guests || "",
            bankAccount: resData.invitation.bank_account || "",
            giftAddress: resData.invitation.gift_address || "",
            mapsLink: resData.invitation.maps_link || "",
            videoLink: resData.invitation.video_link || "",
            status: resData.invitation.status || "Diproses",
            linkUndangan: resData.invitation.link_undangan || "",
            linkTamu: resData.invitation.link_tamu || "",
            notes: resData.invitation.notes || "",
            receptionistPin: resData.invitation.receptionist_pin || "",
            isPro: !!resData.invitation.is_pro,
            expiryDate: resData.invitation.expiry_date || null,
            childPhotoUrl: resData.invitation.child_photo_url || "",
            galleryImages: resData.invitation.gallery_images || [],
            activitiesPhotoUrl: resData.invitation.activities_photo_url || "",
            layoutConfig: resData.invitation.layout_config || null,
            createdAt: resData.invitation.created_at
          };

          setInvitations(prev => [newItem, ...prev]);
          setIsCreateModalOpen(false);
          // Reset create fields
          setCreateFields({
            type: "Khitan",
            fullName: "",
            nickname: "",
            parentsName: "",
            childOrder: "",
            birthdayAge: "",
            whatsapp: "",
            shopeeOrder: "",
            theme: "",
            music: "",
            eventDate: "",
            eventTime: "",
            eventLocation: "",
            schedule: "",
            invitedGuests: "",
            mapsLink: "",
            videoLink: "",
            bankAccount: "",
            giftAddress: "",
            isPro: false,
            status: "Diproses"
          });
          alert("Undangan baru berhasil dibuat!");
        } else {
          alert(`Gagal membuat undangan: ${resData.error || "Unknown error"}`);
        }
      } else {
        const errData = await res.json();
        alert(`Gagal membuat undangan: ${errData.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Create invitation error:", err);
      alert(`Terjadi kesalahan koneksi: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Filtered invitations list
  const filteredInvitations = useMemo(() => {
    return invitations.filter(item => {
      if (item.fullName && item.fullName.includes('Default Theme')) return false;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        (item.fullName || "").toLowerCase().includes(query) ||
        (item.nickname || "").toLowerCase().includes(query) ||
        (item.whatsapp || "").includes(query) ||
        (item.shopeeOrder || "").toLowerCase().includes(query) ||
        (item.id || "").toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || (item.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === "all" || (item.type || "").toLowerCase() === typeFilter.toLowerCase();

      let matchesExpiry = true;
      const isItemExpired = item.expiryDate ? new Date(item.expiryDate) < new Date() : false;
      if (expiryFilter === "active") {
        matchesExpiry = !isItemExpired;
      } else if (expiryFilter === "expired") {
        matchesExpiry = isItemExpired;
      }

      return matchesSearch && matchesStatus && matchesType && matchesExpiry;
    });
  }, [invitations, searchQuery, statusFilter, typeFilter, expiryFilter]);


  // Pagination helper calculations
  const itemsPerPage = 10;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredInvitations.length / itemsPerPage));
  }, [filteredInvitations.length]);

  const paginatedInvitations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvitations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvitations, currentPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, expiryFilter]);

  // Check if modal details are dirty compared to original invitation
  const isDetailsDirty = useMemo(() => {
    if (!selectedInvitation) return false;
    return (
      modalDetails.fullName !== (selectedInvitation.fullName || "") ||
      modalDetails.nickname !== (selectedInvitation.nickname || "") ||
      modalDetails.parentsName !== (selectedInvitation.parentsName || "") ||
      modalDetails.childOrder !== (selectedInvitation.childOrder || "") ||
      modalDetails.birthdayAge !== (selectedInvitation.birthdayAge || "") ||
      modalDetails.eventDate !== (selectedInvitation.eventDate || "") ||
      modalDetails.eventTime !== (selectedInvitation.eventTime || "") ||
      modalDetails.eventLocation !== (selectedInvitation.eventLocation || "") ||
      modalDetails.theme !== (selectedInvitation.theme || "") ||
      modalDetails.music !== (selectedInvitation.music || "") ||
      modalDetails.schedule !== (selectedInvitation.schedule || "") ||
      modalDetails.invitedGuests !== (selectedInvitation.invitedGuests || "") ||
      modalDetails.bankAccount !== (selectedInvitation.bankAccount || "") ||
      modalDetails.giftAddress !== (selectedInvitation.giftAddress || "") ||
      modalDetails.mapsLink !== (selectedInvitation.mapsLink || "") ||
      modalDetails.videoLink !== (selectedInvitation.videoLink || "") ||
      modalDetails.whatsapp !== (selectedInvitation.whatsapp || "") ||
      modalDetails.shopeeOrder !== (selectedInvitation.shopeeOrder || "") ||
      modalDetails.receptionistPin !== (selectedInvitation.receptionistPin || "") ||
      modalDetails.childPhotoUrl !== (selectedInvitation.childPhotoUrl || "") ||
      JSON.stringify(modalDetails.galleryImages) !== JSON.stringify(selectedInvitation.galleryImages || []) ||
      modalDetails.activitiesPhotoUrl !== (selectedInvitation.activitiesPhotoUrl || "") ||
      JSON.stringify(modalDetails.weddingData || {}) !== JSON.stringify(selectedInvitation.weddingData || {})
    );
  }, [selectedInvitation, modalDetails]);

  // Calculate statistics
  const stats = useMemo(() => {
    const realInvitations = invitations.filter(i => !(i.fullName && i.fullName.includes("Default Theme")));
    return {
      total: realInvitations.length,
      active: realInvitations.filter(i => !i.expiryDate || new Date(i.expiryDate) >= new Date()).length,
      expired: realInvitations.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date()).length,
      processed: realInvitations.filter(i => i.status.toLowerCase() === "diproses").length,
      completed: realInvitations.filter(i => i.status.toLowerCase() === "selesai").length,
      revised: realInvitations.filter(i => i.status.toLowerCase() === "revisi").length
    };
  }, [invitations]);

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "selesai") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "revisi") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- 1. LOGIN OVERLAY ---
  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => { setIsAuthenticated(true); fetchInvitations(); }} />;
  }

  // --- 2. MAIN DASHBOARD ---
  return (
    <>
      <div className="flex h-screen bg-slate-50/50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          activeAdminTab={activeAdminTab} 
          setActiveAdminTab={setActiveAdminTab} 
          onLogout={handleLogout} 
        />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50/50">
        {/* Top Header for Action Buttons */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-100/50 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer border-none"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {activeAdminTab === "dashboard" ? "Dasbor Undangan" : activeAdminTab === "analytics" ? "Analitik & Statistik" : activeAdminTab === "guestbook" ? "Buku Tamu / Ucapan" : "Pengaturan Keamanan"}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {activeAdminTab === "dashboard" ? "Kelola data klien dan undangan Bintarti" : activeAdminTab === "analytics" ? "Pantau tren, kunjungan, dan statistik undangan" : activeAdminTab === "guestbook" ? "Kelola ucapan dari seluruh undangan klien" : "Kelola kredensial login admin"}
              </p>
            </div>
          </div>
          
          {activeAdminTab === "dashboard" && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReload}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer bg-white"
                title="Segarkan data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Undangan
              </button>
            </div>
          )}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
        {activeAdminTab === "settings" && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Pengaturan Akun Keamanan
            </h2>
            <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
              Kelola kredensial login admin Anda di sini. Disarankan untuk menggunakan kata sandi yang kuat (kombinasi huruf dan angka).
            </p>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru (min. 6 karakter)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              {authError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
                </div>
              )}
              
              {authSuccess && (
                <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {authSuccess}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUpdatingPassword ? <><Loader2 className="w-4 h-4 animate-spin" /> Memperbarui...</> : <><Save className="w-4 h-4" /> Simpan Kata Sandi</>}
              </button>
            </form>
          </div>
        )}
        
        {activeAdminTab === "media" && <MediaManager />}
        {activeAdminTab === "music" && <MusicManager />}
        {activeAdminTab === "guestbook" && <GuestbookManager />}
        {activeAdminTab === "analytics" && <AnalyticsDashboard />}

        {activeAdminTab === "dashboard" && (
          <>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Undangan</span>
              <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center text-lg font-bold">
              📊
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Undangan Aktif</span>
              <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-555 border border-emerald-100 flex items-center justify-center text-lg font-bold">
              ⏳
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kedaluwarsa</span>
              <p className="text-2xl font-black text-red-600">{stats.expired}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center text-lg font-bold">
              🔒
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Diproses</span>
              <p className="text-2xl font-black text-blue-600">{stats.processed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Revisi</span>
              <p className="text-2xl font-black text-amber-600">{stats.revised}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin [animation-duration:10s]" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Selesai</span>
              <p className="text-2xl font-black text-emerald-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, WA, Shopee, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-initial">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">📂 Semua Acara</option>
                <option value="wedding">💍 Wedding</option>
                <option value="khitan">🎉 Khitan</option>
                <option value="aqiqah">🐏 Aqiqah</option>
                <option value="birthday">🎂 Birthday</option>
              </select>
            </div>

            <div className="flex-1 md:flex-initial">
              <select
                value={expiryFilter}
                onChange={(e) => setExpiryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">⏳ Semua Masa Aktif</option>
                <option value="active">🟢 Undangan Aktif</option>
                <option value="expired">🔴 Kedaluwarsa</option>
              </select>
            </div>

            <div className="flex-1 md:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">📋 Semua Status</option>
                <option value="diproses">🔵 Diproses</option>
                <option value="revisi">🟡 Revisi</option>
                <option value="selesai">🟢 Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Data Undangan / Acara</th>
                  <th className="px-6 py-4">Kontak / Shopee</th>
                  <th className="px-6 py-4 w-32">Status</th>
                  <th className="px-6 py-4 w-32">Paket</th>
                  <th className="px-6 py-4 w-52">Link Undangan (Preview)</th>
                  <th className="px-6 py-4 w-52">Link Tamu (Spread)</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoadingData && invitations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                      <span>Memuat data undangan dari database...</span>
                    </td>
                  </tr>
                ) : paginatedInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 text-slate-350 mx-auto mb-2" />
                      <p className="font-semibold text-slate-500">Tidak ada undangan ditemukan</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Silakan sesuaikan filter atau kata pencarian Anda.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedInvitations.map((item) => {
                    const id = item.id;
                    const edits = editedRows[id] || {};
                    const isDirty = 
                      edits.status !== undefined || 
                      edits.linkUndangan !== undefined || 
                      edits.linkTamu !== undefined ||
                      edits.isPro !== undefined;
                    const isSaving = savingRows[id] || false;

                    const currentStatus = edits.status !== undefined ? edits.status : item.status;
                    const currentLinkUndangan = edits.linkUndangan !== undefined ? edits.linkUndangan : item.linkUndangan;
                    const currentLinkTamu = edits.linkTamu !== undefined ? edits.linkTamu : item.linkTamu;
                    const currentIsPro = edits.isPro !== undefined ? edits.isPro : item.isPro;

                    return (
                      <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Info Undangan */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 text-sm">
                                {item.fullName}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 flex items-center gap-1 ${
                                item.type === "Khitan" ? "bg-blue-100 text-blue-800" :
                                item.type === "Aqiqah" ? "bg-emerald-100 text-emerald-800" :
                                item.type?.toLowerCase().includes("wedding") ? "bg-slate-800 text-slate-100" :
                                "bg-pink-100 text-pink-800"
                              }`}>
                                {item.type?.toLowerCase().includes("wedding") && <Heart className="w-2.5 h-2.5" />}
                                {item.type}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 border ${
                                item.isPro 
                                  ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" 
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}>
                                {item.isPro ? "⭐ PRO" : "REGULAR"}
                              </span>
                            </div>
                            {item.type?.toLowerCase().includes("wedding") ? (
                              <p className="text-[10px] text-slate-500 leading-tight">
                                Tgl Pernikahan: <span className="font-semibold">{formatFriendlyDate(item.eventDate)}</span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-500 leading-tight">
                                Anak: {item.parentsName} {item.childOrder ? `(Anak ke-${item.childOrder})` : ""}
                              </p>
                            )}
                            <p className="text-[10px] text-slate-400">
                              Tema: <strong className="text-slate-650">{item.theme}</strong> | ID: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-slate-600">{id}</code>
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
                              📅 {formatFriendlyDate(item.eventDate)} ({formatFriendlyTime(item.eventTime)})
                            </p>
                            {item.expiryDate ? (
                              <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                                ⏳ Expiry: {new Date(item.expiryDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                {new Date(item.expiryDate) < new Date() ? (
                                  <span className="text-[8px] bg-red-100 text-red-700 px-1 rounded font-black uppercase shrink-0">Expired</span>
                                ) : (
                                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase shrink-0">Aktif</span>
                                )}
                              </p>
                            ) : (
                              <p className="text-[9px] text-slate-400 font-semibold">⏳ Expiry: Belum Set / Selamanya</p>
                            )}
                            {item.notes && (
                              <p className="text-[10px] text-amber-750 bg-amber-50/60 border border-amber-150 rounded-lg px-2 py-1 mt-1 font-semibold inline-block max-w-full truncate" title={item.notes}>
                                📝 Catatan: {item.notes}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Kontak Pembeli */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 font-semibold text-slate-600">
                            <a
                              href={getWhatsAppLink(item.whatsapp)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-emerald-600 flex items-center gap-1 text-[11px]"
                              title="Chat WhatsApp"
                            >
                              📱 {item.whatsapp}
                            </a>
                            <p className="text-[10px] text-slate-500">
                              🛍️ {item.shopeeOrder}
                            </p>
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="px-6 py-4">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleFieldChange(id, "status", e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadgeClass(currentStatus)}`}
                          >
                            <option value="Diproses">🔴 Diproses</option>
                            <option value="Revisi">🟡 Revisi</option>
                            <option value="Selesai">🟢 Selesai</option>
                          </select>
                        </td>

                        {/* Paket Dropdown */}
                        <td className="px-6 py-4">
                          <select
                            value={currentIsPro ? "pro" : "regular"}
                            onChange={(e) => handleFieldChange(id, "isPro", e.target.value === "pro")}
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary ${
                              currentIsPro
                                ? "bg-amber-50 text-amber-700 border-amber-200 text-amber-800"
                                : "bg-slate-50 text-slate-650 border-slate-200"
                            }`}
                          >
                            <option value="regular">Regular</option>
                            <option value="pro">⭐ PRO</option>
                          </select>
                        </td>

                        {/* Link Undangan Input */}
                        <td className="px-6 py-4">
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              value={currentLinkUndangan}
                              onChange={(e) => handleFieldChange(id, "linkUndangan", e.target.value)}
                              placeholder="Belum ada link preview"
                              className="flex-1 min-w-0 px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-[10px] font-mono bg-white text-slate-700"
                            />
                            {item.linkUndangan && (
                              <a
                                href={item.linkUndangan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-100 rounded text-slate-500 hover:bg-slate-200 transition-colors"
                                title="Buka Link Preview"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Link Tamu Input */}
                        <td className="px-6 py-4">
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              value={currentLinkTamu}
                              onChange={(e) => handleFieldChange(id, "linkTamu", e.target.value)}
                              placeholder="Belum ada link tamu"
                              className="flex-1 min-w-0 px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-[10px] font-mono bg-white text-slate-700"
                            />
                            {item.linkTamu && (
                              <a
                                href={item.linkTamu}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-100 rounded text-slate-500 hover:bg-slate-200 transition-colors"
                                title="Buka Link Tamu"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="px-6 py-4 text-center align-top">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              {/* Save Button (shows only if row is modified/dirty) */}
                              {isDirty && (
                                <button
                                  onClick={() => handleSaveRow(id)}
                                  disabled={isSaving}
                                  className="p-1.5 rounded-lg border transition-all bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 shadow-sm animate-pulse"
                                  title="Simpan Perubahan ke Database"
                                >
                                  {isSaving ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Save className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              
                              {/* Aksi Accordion Toggle */}
                              <button
                                onClick={() => setOpenActionId(openActionId === id ? null : id)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm border border-slate-200"
                              >
                                Aksi <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openActionId === id ? 'rotate-180' : ''}`} />
                              </button>
                            </div>

                            {/* Accordion Content */}
                            {openActionId === id && (
                              <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 w-max max-w-[160px] animate-in fade-in slide-in-from-top-2 shadow-sm">
                                {/* Kirim WA Selesai (Quick button for completed invitations) */}
                                {currentStatus.toLowerCase() === "selesai" && (
                                  <button
                                    onClick={() => {
                                      const mergedItem = { ...item, ...edits };
                                      handleSendWhatsAppCompletion(mergedItem);
                                    }}
                                    className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                    title="Kirim Link Undangan Selesai ke WhatsApp Klien"
                                  >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.022-.014-.117-.066-.27-.147-.154-.082-.904-.447-1.043-.498-.139-.051-.25-.078-.354.078-.105.157-.402.498-.493.602-.09.105-.18.117-.333.037-.153-.082-.647-.238-1.233-.761-.457-.408-.765-.912-.855-1.066-.09-.155-.01-.238.067-.315.07-.069.155-.18.232-.27.078-.09.105-.152.158-.255.053-.105.027-.197-.013-.278-.04-.082-.354-.855-.486-1.173-.127-.308-.26-.266-.355-.271-.09-.004-.194-.006-.299-.006-.105 0-.276.04-.42.197-.144.157-.55.539-.55 1.314 0 .775.562 1.524.64 1.631.078.105 1.107 1.691 2.682 2.373.375.162.668.258.898.333.376.12.717.103.987.063.302-.045.904-.37 1.03-.728.127-.358.127-.665.09-.729-.04-.063-.15-.1-.271-.157zm-5.267 6.053h-.005c-1.849 0-3.664-.497-5.253-1.439l-.377-.224-3.902.956.98-3.547-.247-.393c-.985-1.57-1.505-3.379-1.505-5.228.004-5.362 4.369-9.728 9.736-9.728 2.6 0 5.044 1.012 6.877 2.85 1.832 1.838 2.84 4.28 2.84 6.883-.004 5.365-4.37 9.729-9.736 9.729zm8.56-14.712C18.91 3.86 16.55 2.5 14 2.5c-5.176 0-9.39 4.214-9.39 9.39 0 1.849.497 3.655 1.439 5.253l-1.53 5.545 5.672-1.488c1.528.834 3.25 1.272 5.008 1.274h.008c5.177 0 9.39-4.214 9.39-9.39 0-2.51-.978-4.87-2.775-6.67z" />
                                    </svg>
                                  </button>
                                )}

                                {/* Lihat Detail (Open modal details) */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetails(item)}
                                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-655 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                                  title="Lihat Detail Form Isian"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Lihat Undangan Jadi (Sandbox preview) */}
                                <Link
                                  href={`/sandbox-tema/${id}?admin=true`}
                                  target="_blank"
                                  className="p-1.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-600 hover:text-purple-750 hover:bg-purple-100 transition-colors"
                                  title="Lihat Undangan Jadi (Sandbox Preview)"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </Link>

                                {/* Kelola Penerima (Open dashboard kelola) */}
                                <Link
                                  href={`/cek-undangan/${id}`}
                                  target="_blank"
                                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-650 hover:text-primary hover:border-primary/50 transition-colors"
                                  title="Buka Panel Kelola Tamu"
                                >
                                  <Users className="w-3.5 h-3.5" />
                                </Link>

                                {/* Download Cover Button */}
                                <button
                                  onClick={() => handleDownloadCover(item)}
                                  disabled={downloadingId === id}
                                  className={`p-1.5 border rounded-lg transition-colors flex items-center justify-center ${downloadingId === id ? 'bg-primary/10 border-primary/20 text-primary animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-650 hover:text-primary hover:border-primary/50 cursor-pointer'}`}
                                  title="Download Gambar Cover (Lockscreen)"
                                >
                                  {downloadingId === id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <ImageDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteRow(id, item.fullName)}
                                  className="p-1.5 border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-650 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus data pesanan secara permanen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 gap-3">
              <div className="text-xs text-slate-550 font-medium">
                Menampilkan <span className="font-extrabold text-slate-700">{Math.min(filteredInvitations.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredInvitations.length, currentPage * itemsPerPage)}</span> dari <span className="font-extrabold text-slate-700">{filteredInvitations.length}</span> undangan
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-sm"
                  }`}
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isNearCurrent = Math.abs(pageNum - currentPage) <= 1;
                  const isEnd = pageNum === 1 || pageNum === totalPages;
                  
                  if (!isNearCurrent && !isEnd) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return <span key={pageNum} className="px-1 text-slate-400 font-bold">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl border text-xs font-black transition-all duration-300 cursor-pointer flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-sm"
                  }`}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </>
        )}
          </div>
        </main>
      </div>
    </div>
      {/* Detail Modal Overlay */}
      {selectedInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] scale-in">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedInvitation.type === "Khitan" ? "bg-blue-50 text-blue-500" :
                  selectedInvitation.type === "Aqiqah" ? "bg-emerald-50 text-emerald-500" :
                  "bg-pink-50 text-pink-500"
                }`}>
                  {selectedInvitation.type === "Khitan" ? "🎉" :
                   selectedInvitation.type === "Aqiqah" ? "🐏" : "🎂"}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Detail Data: {selectedInvitation.fullName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Undangan {selectedInvitation.type} | ID: {selectedInvitation.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvitation(null)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Profil */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  👤 Profil Acara
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedInvitation.type?.toLowerCase().includes("wedding") ? (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Pengantin Pria</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.groomName || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, groomName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Panggilan Pria</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.groomNickname || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, groomNickname: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Instagram Pria</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.groomInstagram || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, groomInstagram: e.target.value })}
                          placeholder="@username"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Orang Tua Pria</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.groomParents || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, groomParents: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Pengantin Wanita</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.brideName || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, brideName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Panggilan Wanita</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.brideNickname || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, brideNickname: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Instagram Wanita</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.brideInstagram || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, brideInstagram: e.target.value })}
                          placeholder="@username"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Orang Tua Wanita</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.brideParents || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, brideParents: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Lengkap Anak</label>
                        <input
                          type="text"
                          value={modalDetails.fullName || ""}
                          onChange={(e) => handleModalFieldChange("fullName", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Panggilan</label>
                        <input
                          type="text"
                          value={modalDetails.nickname || ""}
                          onChange={(e) => handleModalFieldChange("nickname", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Orang Tua</label>
                        <input
                          type="text"
                          value={modalDetails.parentsName || ""}
                          onChange={(e) => handleModalFieldChange("parentsName", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      {selectedInvitation.type === "Khitan" || selectedInvitation.type === "Aqiqah" ? (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Anak Ke</label>
                          <input
                            type="text"
                            value={modalDetails.childOrder || ""}
                            onChange={(e) => handleModalFieldChange("childOrder", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Ulang Tahun Ke</label>
                          <input
                            type="text"
                            value={modalDetails.birthdayAge || ""}
                            onChange={(e) => handleModalFieldChange("birthdayAge", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Section 2: Waktu & Tempat */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  📍 Jadwal & Lokasi Acara
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedInvitation.type?.toLowerCase().includes("wedding") ? (
                    <>
                      <div className="sm:col-span-2 border-b border-slate-100 pb-2 mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">💍 {selectedInvitation.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"}</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tanggal {selectedInvitation.theme === "Wedding 3" ? "Pemberkatan" : "Akad"}</label>
                        <input
                          type="date"
                          value={modalDetails.weddingData?.akadDate || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, akadDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Waktu {selectedInvitation.theme === "Wedding 3" ? "Pemberkatan" : "Akad"}</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.akadTime || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, akadTime: e.target.value })}
                          placeholder="09:00 WIB"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lokasi {selectedInvitation.theme === "Wedding 3" ? "Pemberkatan" : "Akad"}</label>
                        <textarea
                          value={modalDetails.weddingData?.akadLocation || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, akadLocation: e.target.value })}
                          className="w-full h-16 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Google Maps {selectedInvitation.theme === "Wedding 3" ? "Pemberkatan" : "Akad"} (Opsional)</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.akadGmaps || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, akadGmaps: e.target.value })}
                          placeholder="https://maps.app.goo.gl/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2 border-b border-slate-100 pb-2 mb-2 mt-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">🎉 Resepsi Pernikahan</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tanggal Resepsi</label>
                        <input
                          type="date"
                          value={modalDetails.weddingData?.resepsiDate || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, resepsiDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Waktu Resepsi</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.resepsiTime || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, resepsiTime: e.target.value })}
                          placeholder="11:00 - Selesai"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lokasi Resepsi</label>
                        <textarea
                          value={modalDetails.weddingData?.resepsiLocation || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, resepsiLocation: e.target.value })}
                          className="w-full h-16 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Google Maps Resepsi (Opsional)</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.resepsiGmaps || ""}
                          onChange={(e) => handleModalFieldChange("weddingData", { ...modalDetails.weddingData, resepsiGmaps: e.target.value })}
                          placeholder="https://maps.app.goo.gl/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2 border-b border-slate-100 pb-2 mb-2 mt-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">📖 Our Story</span>
                      </div>
                      <div className="sm:col-span-2">
                        {(Array.isArray(modalDetails.weddingData?.loveStory) ? modalDetails.weddingData.loveStory : []).map((story: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const newStory = [...(modalDetails.weddingData?.loveStory || [])];
                                newStory.splice(idx, 1);
                                handleModalFieldChange("weddingData", { ...modalDetails.weddingData, loveStory: newStory });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                              title="Hapus Momen"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <h5 className="font-bold text-slate-700 mb-3 text-[11px]">📌 Momen Cerita {idx + 1}</h5>
                            <div className={`grid ${(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 5") ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-3`}>
                              {(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 5") && (
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tahun</label>
                                  <input
                                    type="text"
                                    value={story.year || ""}
                                    onChange={(e) => {
                                      const newStory = [...(modalDetails.weddingData?.loveStory || [])];
                                      newStory[idx] = { ...newStory[idx], year: e.target.value };
                                      handleModalFieldChange("weddingData", { ...modalDetails.weddingData, loveStory: newStory });
                                    }}
                                    placeholder="Contoh: 2021"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                              )}
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Judul Momen</label>
                                <input
                                  type="text"
                                  value={story.title || ""}
                                  onChange={(e) => {
                                    const newStory = [...(modalDetails.weddingData?.loveStory || [])];
                                    newStory[idx] = { ...newStory[idx], title: e.target.value };
                                    handleModalFieldChange("weddingData", { ...modalDetails.weddingData, loveStory: newStory });
                                  }}
                                  placeholder="Contoh: Awal Bertemu"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Cerita / Deskripsi Singkat</label>
                              <textarea
                                value={story.description || ""}
                                onChange={(e) => {
                                  const newStory = [...(modalDetails.weddingData?.loveStory || [])];
                                  newStory[idx] = { ...newStory[idx], description: e.target.value };
                                  handleModalFieldChange("weddingData", { ...modalDetails.weddingData, loveStory: newStory });
                                }}
                                placeholder="Pertama kali kami dipertemukan..."
                                className="w-full h-20 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newStory = [...(modalDetails.weddingData?.loveStory || []), { year: "", title: "", description: "" }];
                            handleModalFieldChange("weddingData", { ...modalDetails.weddingData, loveStory: newStory });
                          }}
                          className="w-full px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Tambah Momen Cerita
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={modalDetails.eventDate || ""}
                          onChange={(e) => handleModalFieldChange("eventDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Waktu / Jam</label>
                        <input
                          type="time"
                          value={modalDetails.eventTime || ""}
                          onChange={(e) => handleModalFieldChange("eventTime", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lokasi Acara</label>
                        <textarea
                          value={modalDetails.eventLocation || ""}
                          onChange={(e) => handleModalFieldChange("eventLocation", e.target.value)}
                          className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 3: Fitur & Kado */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  ⚙️ Pengaturan & Kado Digital
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tema Undangan</label>
                    <input
                      type="text"
                      value={modalDetails.theme || ""}
                      onChange={(e) => handleModalFieldChange("theme", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lagu Background</label>
                    <select
                      value={modalDetails.music || ""}
                      onChange={(e) => handleModalFieldChange("music", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold cursor-pointer"
                    >
                      {musicCatalog.map((item, idx) => {
                        let title = item.label;
                        if (item.label.includes("||")) {
                          const parts = item.label.split("||");
                          title = `[${parts[0]}] ${parts[1]}`;
                        }
                        return <option key={idx} value={item.url}>{title}</option>
                      })}
                    </select>
                    {(!musicCatalog.find(m => m.url === (modalDetails.music || "")) || modalDetails.music === "custom") && (
                      <input
                        type="text"
                        placeholder="Link GDrive..."
                        value={modalDetails.music !== "custom" ? (modalDetails.music || "") : ""}
                        onChange={(e) => handleModalFieldChange("music", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                    )}
                  </div>
                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                    <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">🎨 Activities & Highlights</label>
                    <textarea
                      value={modalDetails.schedule || ""}
                      onChange={(e) => handleModalFieldChange("schedule", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-y"
                    />
                  </div>
                  )}
                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Turut mengundang</label>
                    <textarea
                      value={modalDetails.invitedGuests || ""}
                      onChange={(e) => handleModalFieldChange("invitedGuests", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-y"
                    />
                  </div>
                  )}

                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Google Maps (Navigasi / Tombol Maps)</label>
                    <input
                      type="text"
                      value={modalDetails.mapsLink || ""}
                      onChange={(e) => handleModalFieldChange("mapsLink", e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  )}
                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Video YouTube (Galeri)</label>
                    <input
                      type="text"
                      value={modalDetails.videoLink || ""}
                      onChange={(e) => handleModalFieldChange("videoLink", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  )}
                   <div className="sm:col-span-2">
                    {(() => {
                      let accounts = [{ bankName: "", accountNumber: "", recipientName: "" }, { bankName: "", accountNumber: "", recipientName: "" }];
                      try {
                        const parsed = JSON.parse(modalDetails.bankAccount || "");
                        if (Array.isArray(parsed)) {
                          accounts[0] = parsed[0] || accounts[0];
                          accounts[1] = parsed[1] || accounts[1];
                        }
                      } catch (error) {
                        if (modalDetails.bankAccount) {
                          accounts[0].accountNumber = modalDetails.bankAccount;
                        }
                      }
                      
                      const handleAccountChange = (idx: number, key: string, val: string) => {
                        const newAccs = [...accounts];
                        newAccs[idx] = { ...newAccs[idx], [key]: val };
                        handleModalFieldChange("bankAccount", JSON.stringify(newAccs));
                      };

                      return (
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                            Rekening Amplop Digital (Maksimal 2)
                          </label>
                          
                          {accounts.map((acc, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                              <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                                Rekening Penerima {index + 1}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">Nama Bank</label>
                                  <input
                                    type="text"
                                    value={acc.bankName || ""}
                                    onChange={(e) => handleAccountChange(index, "bankName", e.target.value)}
                                    placeholder="BCA, Mandiri, OVO..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">No. Rekening</label>
                                  <input
                                    type="text"
                                    value={acc.accountNumber || ""}
                                    onChange={(e) => handleAccountChange(index, "accountNumber", e.target.value)}
                                    placeholder="Nomor rekening/HP..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">Nama Penerima</label>
                                  <input
                                    type="text"
                                    value={acc.recipientName || ""}
                                    onChange={(e) => handleAccountChange(index, "recipientName", e.target.value)}
                                    placeholder="Nama pemilik..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Alamat Pengiriman Kado</label>
                    <textarea
                      value={modalDetails.giftAddress || ""}
                      onChange={(e) => handleModalFieldChange("giftAddress", e.target.value)}
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                    />
                  </div>
                  )}
                </div>
              </div>

              {/* Section 3.5: Media (Foto & Galeri) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  {selectedInvitation.type?.toLowerCase().includes("wedding") ? `🖼️ Berkas Foto Undangan (Opsional & Terpandu) Panduan Foto ${selectedInvitation.theme || "Wedding"}` : "🖼️ Media (Foto & Galeri)"}
                </h4>
                <div className="grid grid-cols-1 gap-4 text-xs">
                  {selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2 space-y-4">
                      <div>
                        <h5 className="font-bold text-slate-700 mb-1">
                          {selectedInvitation.theme === "Wedding 2" 
                            ? "📌 Foto A: Cover Sampul Depan (Lockscreen) & Background" 
                            : selectedInvitation.theme === "Wedding 4"
                            ? "📌 Foto A: Cover Sampul Depan (halaman pertama foto dalam bingkai)"
                            : selectedInvitation.theme === "Wedding 5" ? "📌 Foto A: Cover Sampul Depan" : "📌 Foto A: Cover Sampul Depan (Lockscreen)"}
                        </h5>
                        <p className="text-[10px] text-slate-500 mb-3">
                          {selectedInvitation.theme === "Wedding 2" 
                            ? '1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"), dan juga digunakan sebagai background statis di seluruh halaman undangan.' 
                            : '1 Foto · Portrait (9:16). Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol "Buka Undangan"). Hanya 1 foto — bukan background slideshow.'}
                        </p>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Pilih Foto A (Cover Lockscreen) - URL</label>
                        <input
                          type="text"
                          value={modalDetails.childPhotoUrl || ""}
                          onChange={(e) => handleModalFieldChange("childPhotoUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>

                      {(!["Wedding 1", "Wedding 4", "Wedding 5", "Wedding 6", "Wedding 7"].includes(selectedInvitation.theme)) && (
                        <div>
                          <h5 className="font-bold text-slate-700 mb-1">📖 Foto Our Story</h5>
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Bagian Love Story - URL</label>
                          <input
                            type="text"
                            value={modalDetails.weddingData?.storyPhotoUrl || ""}
                            onChange={(e) => handleWeddingDataChange("storyPhotoUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                          />
                        </div>
                      )}
                    </div>

                    {(selectedInvitation.theme !== "Wedding 7") && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-700 mb-3">👤 Foto Profil Kedua Mempelai (Opsional)</h5>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Profil Pria (URL)</label>
                          <input
                            type="text"
                            value={modalDetails.weddingData?.groomPhotoUrl || ""}
                            onChange={(e) => handleWeddingDataChange("groomPhotoUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Profil Wanita (URL)</label>
                          <input
                            type="text"
                            value={modalDetails.weddingData?.bridePhotoUrl || ""}
                            onChange={(e) => handleWeddingDataChange("bridePhotoUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                    )}

                    
                    {/* WEDDING 6 EXTRA BACKGROUNDS */}
                    {(selectedInvitation.theme === "Wedding 6") && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 space-y-4">
                        <h5 className="font-bold text-amber-800 mb-2">🖼️ Pengaturan Background Tambahan</h5>
                        
                        {[
                          { key: 'quoteBgUrl', label: '1. Background Ayat / Kutipan' },
                          { key: 'loveStoryBgUrl', label: '2. Background Kisah Cinta / Love Story' },
                          { key: 'ourStoryPhotoUrl', label: 'Foto Tengah Kisah Cinta / A Peak of Love (Khusus Wedding 6)' },
                          { key: 'saveTheDateBgUrl', label: '3. Background Save The Date' },
                          { key: 'eventBgUrl', label: '4. Background Detail Acara / Event' },
                          { key: 'dresscodeBgUrl', label: '5. Background Panduan Pakaian / Dresscode' },
                          { key: 'ourMomentBgUrl', label: '6. Background Our Moment / Gallery' },
                          { key: 'giftBgUrl', label: '7. Background Buku Tamu / Gift' },
                          { key: 'rsvpBgUrl', label: '8. Background RSVP' },
                          { key: 'closingPhotoUrl', label: '9. Background Penutup' }
                        ].map(bg => (
                          <div key={bg.key} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">{bg.label} - URL</label>
                            <input
                              type="text"
                              value={modalDetails.weddingData?.[bg.key] || ""}
                              onChange={(e) => handleWeddingDataChange(bg.key, e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-slate-800"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedInvitation.theme === "Wedding 3" && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h5 className="font-bold text-slate-700 mb-1">🖼️ Foto Halaman Penutup</h5>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Halaman Penutup - URL</label>
                        <input
                          type="text"
                          value={modalDetails.weddingData?.closingPhotoUrl || ""}
                          onChange={(e) => handleWeddingDataChange("closingPhotoUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                        />
                      </div>
                    )}
                  </>
                  )}
                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Profil Anak (URL / Upload)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={modalDetails.childPhotoUrl || ""}
                        onChange={(e) => handleModalFieldChange("childPhotoUrl", e.target.value)}
                        placeholder="https://... atau pilih berkas untuk diunggah"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileUpload}
                        className="hidden"
                        id="admin-profile-upload"
                        disabled={profileLoading}
                      />
                      <label
                        htmlFor="admin-profile-upload"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1 flex-shrink-0"
                      >
                        <Camera className="w-3.5 h-3.5" /> {profileLoading ? "Mengompres..." : "Pilih Berkas"}
                      </label>
                      {modalDetails.childPhotoUrl && (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                          <img src={modalDetails.childPhotoUrl} alt="Profil" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleModalFieldChange("childPhotoUrl", "")}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] border-none cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {!selectedInvitation.type?.toLowerCase().includes("wedding") && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Foto Activities & Highlights (URL / Upload)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={modalDetails.activitiesPhotoUrl || ""}
                        onChange={(e) => handleModalFieldChange("activitiesPhotoUrl", e.target.value)}
                        placeholder="https://... atau pilih berkas untuk diunggah"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleActivitiesUpload}
                        className="hidden"
                        id="admin-activities-upload"
                        disabled={activitiesLoading}
                      />
                      <label
                        htmlFor="admin-activities-upload"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1 flex-shrink-0"
                      >
                        <Camera className="w-3.5 h-3.5" /> {activitiesLoading ? "Mengompres..." : "Pilih Berkas"}
                      </label>
                      {modalDetails.activitiesPhotoUrl && (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                          <img src={modalDetails.activitiesPhotoUrl} alt="Activities" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleModalFieldChange("activitiesPhotoUrl", "")}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] border-none cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  <div>
                    {selectedInvitation.type?.toLowerCase().includes("wedding") ? (
                      <div className="mb-2">
                        <h5 className="font-bold text-slate-700 mb-1">
                          {(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : "🎞️ Foto C: Galeri Foto"}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          Bisa banyak foto · Maks 10. 
                          {(selectedInvitation.theme === "Wedding 1" || selectedInvitation.theme === "Wedding 4" || selectedInvitation.theme === "Wedding 5") 
                            ? " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow" 
                            : " Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan."}
                        </p>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mt-3 mb-1">
                          Pilih Foto C (Galeri Album) - URL, pisahkan baris
                        </label>
                      </div>
                    ) : (
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Foto Galeri (URL, satu per baris atau dipisahkan koma, maks 10)
                      </label>
                    )}
                    <div className="space-y-2">
                      <div className="flex gap-3 items-end">
                        <textarea
                          value={Array.isArray(modalDetails.galleryImages) ? modalDetails.galleryImages.join("\n") : (modalDetails.galleryImages || "")}
                          onChange={(e) => {
                            const lines = e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                            handleModalFieldChange("galleryImages", lines as any);
                          }}
                          placeholder="https://image1.jpg&#10;https://image2.jpg"
                          className="flex-1 h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                        />
                        <div className="flex-shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryUpload}
                            className="hidden"
                            id="admin-gallery-upload"
                            disabled={galleryLoading}
                          />
                          <label
                            htmlFor="admin-gallery-upload"
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" /> {galleryLoading ? "Mengompres..." : "Unggah Galeri"}
                          </label>
                        </div>
                      </div>
                      
                      {Array.isArray(modalDetails.galleryImages) && modalDetails.galleryImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {modalDetails.galleryImages.map((imgUrl, i) => (
                            <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                              <img src={imgUrl} alt={`Galeri ${i+1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const currentGallery = modalDetails.galleryImages || [];
                                  const updated = currentGallery.filter((_, idx) => idx !== i);
                                  handleModalFieldChange("galleryImages", updated as any);
                                }}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] border-none cursor-pointer"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedInvitation.type?.toLowerCase().includes("wedding") && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                      <h5 className="font-bold text-slate-700 mb-1">▶️ Video Prewedding (YouTube)</h5>
                      <p className="text-[10px] text-slate-500 mb-2">Tautan video YouTube (Opsional). Jika dikosongkan, bagian video tidak akan ditampilkan.</p>
                      <input
                        type="text"
                        value={modalDetails.weddingData?.youtubeVideo || ""}
                        onChange={(e) => handleWeddingDataChange("youtubeVideo", e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Metadata Transaksi */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  🛒 Data Pemesan & Sistem
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">No. WhatsApp Pemesan</label>
                    <input
                      type="text"
                      value={modalDetails.whatsapp || ""}
                      onChange={(e) => handleModalFieldChange("whatsapp", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">No. Pesanan Shopee</label>
                    <input
                      type="text"
                      value={modalDetails.shopeeOrder || ""}
                      onChange={(e) => handleModalFieldChange("shopeeOrder", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800 mb-0.5">👑 Fitur Paket Pro</h5>
                      <p className="text-[10px] text-slate-500">Aktifkan untuk menampilkan Barcode/QR Code Tamu di halaman undangan.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={modalDetails.isPro || false}
                        onChange={(e) => handleModalFieldChange("isPro", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Status Pengerjaan</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{selectedInvitation.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Paket Undangan</span>
                    <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold border ${
                      selectedInvitation.isPro 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {selectedInvitation.isPro ? "⭐ PRO Version" : "Regular Version"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Waktu Masuk Database</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">
                      ⏱️ {selectedInvitation.createdAt ? new Date(selectedInvitation.createdAt).toLocaleString("id-ID") : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4.5: Buku Tamu & Scanner QR */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  📱 Buku Tamu & Scanner QR
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Link Scanner Penerima Tamu</span>
                    <div className="flex gap-1.5 mt-0.5">
                      <input
                        type="text"
                        readOnly
                        value={`https://bintarti.store/checkin/scan?id=${selectedInvitation.id}`}
                        className="flex-1 px-2 py-1 rounded border border-slate-200 bg-slate-55 font-mono text-[9px] text-slate-600 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://bintarti.store/checkin/scan?id=${selectedInvitation.id}`);
                          alert("Link scanner berhasil disalin!");
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 font-semibold cursor-pointer text-[9px]"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">PIN Scanner (4 Digit)</label>
                    <div className="flex gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={modalDetails.receptionistPin || ""}
                        onChange={(e) => handleModalFieldChange("receptionistPin", e.target.value)}
                        className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white font-mono text-center font-bold text-slate-800"
                        maxLength={4}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(modalDetails.receptionistPin || "2104");
                          alert("PIN scanner berhasil disalin!");
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-pointer text-xs flex items-center justify-center"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4.7: Masa Aktif Undangan */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  ⏳ Masa Aktif Undangan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Tanggal Kedaluwarsa (Expiry Date)
                    </label>
                    <input
                      type="date"
                      value={modalExpiryDate}
                      onChange={(e) => setModalExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-700 font-sans"
                    />
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <button
                      type="button"
                      onClick={handleSaveExpiryDate}
                      disabled={isSavingExpiryDate || modalExpiryDate === (selectedInvitation.expiryDate ? selectedInvitation.expiryDate.split("T")[0] : "")}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-250 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSavingExpiryDate ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Simpan Masa Aktif
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 5: Catatan Admin */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  📝 Catatan Admin
                </h4>
                <div className="space-y-2">
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Tambahkan catatan atau instruksi khusus untuk pesanan ini..."
                    className="w-full h-24 p-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-slate-50/50 text-slate-700 leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={isSavingNote || adminNote.trim() === (selectedInvitation.notes || "")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-250 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingNote ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Simpan Catatan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 rounded-b-3xl">
              {/* Save Details Button */}
              <button
                type="button"
                onClick={handleSaveModalDetails}
                disabled={isSavingDetails}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-250 disabled:text-slate-450 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isSavingDetails ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Simpan Detail Acara
                  </>
                )}
              </button>

              <Link
                href={`/sandbox-tema/${selectedInvitation.id}?admin=true`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Edit Desain Visual
              </Link>

              {selectedInvitation.linkUndangan && (
                <a
                  href={selectedInvitation.linkUndangan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Preview
                </a>
              )}
              <Link
                href={`/cek-undangan/${selectedInvitation.id}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" /> Kelola Tamu
              </Link>
              <button
                type="button"
                onClick={() => setSelectedInvitation(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Modal Overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] scale-in">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Buat Undangan Baru</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Manual Insertion Form
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Tipe & Kontak */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  📞 Tipe Acara & Kontak
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tipe Acara</label>
                    <select
                      value={createFields.type || "Khitan"}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    >
                      <option value="Khitan">🎉 Khitan</option>
                      <option value="Aqiqah">🐏 Aqiqah</option>
                      <option value="Birthday">🎂 Birthday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">No. WhatsApp Pemesan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 08123456789"
                      value={createFields.whatsapp || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Lengkap Anak</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap anak..."
                      value={createFields.fullName || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Panggilan</label>
                    <input
                      type="text"
                      placeholder="Nama panggilan..."
                      value={createFields.nickname || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Nama Orang Tua</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bpk. Budi & Ibu Ani"
                      value={createFields.parentsName || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, parentsName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  {createFields.type === "Birthday" ? (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Ulang Tahun Ke</label>
                      <input
                        type="text"
                        placeholder="Contoh: 5"
                        value={createFields.birthdayAge || ""}
                        onChange={(e) => setCreateFields(prev => ({ ...prev, birthdayAge: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Anak Ke (Urutan)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Kedua (2)"
                        value={createFields.childOrder || ""}
                        onChange={(e) => setCreateFields(prev => ({ ...prev, childOrder: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">No. Pesanan Shopee</label>
                    <input
                      type="text"
                      placeholder="ID Pesanan Shopee..."
                      value={createFields.shopeeOrder || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, shopeeOrder: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Paket Undangan</label>
                    <select
                      value={createFields.isPro ? "pro" : "regular"}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, isPro: e.target.value === "pro" }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    >
                      <option value="regular">Regular Version</option>
                      <option value="pro">⭐ PRO Version</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Waktu & Lokasi */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  📍 Jadwal & Lokasi Acara
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={createFields.eventDate || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Waktu / Jam</label>
                    <input
                      type="time"
                      value={createFields.eventTime || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, eventTime: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lokasi Acara</label>
                    <textarea
                      placeholder="Alamat lengkap lokasi acara..."
                      value={createFields.eventLocation || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, eventLocation: e.target.value }))}
                      className="w-full h-20 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Fitur & Tema */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-1">
                  ⚙️ Desain & Fitur
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tema Undangan</label>
                    <input
                      type="text"
                      placeholder="Contoh: birthday-1, birthday-4..."
                      value={createFields.theme || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lagu Background</label>
                    <select
                      value={createFields.music || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, music: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold cursor-pointer"
                    >
                      {musicCatalog.map((item, idx) => {
                        let title = item.label;
                        if (item.label.includes("||")) {
                          const parts = item.label.split("||");
                          title = `[${parts[0]}] ${parts[1]}`;
                        }
                        return <option key={idx} value={item.url}>{title}</option>
                      })}
                    </select>
                    {(!musicCatalog.find(m => m.url === (createFields.music || "")) || createFields.music === "custom") && (
                      <input
                        type="text"
                        placeholder="Link GDrive..."
                        value={createFields.music !== "custom" ? (createFields.music || "") : ""}
                        onChange={(e) => setCreateFields(prev => ({ ...prev, music: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                      />
                    )}
                  </div>
                    <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">🎨 Activities & Highlights</label>
                    <textarea
                      placeholder="Deskripsi kegiatan dan highlights acara..."
                      value={createFields.schedule || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, schedule: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-y"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Turut Mengundang</label>
                    <textarea
                      placeholder="Daftar yang turut mengundang..."
                      value={createFields.invitedGuests || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, invitedGuests: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Google Maps (Navigasi / Tombol Maps)</label>
                    <input
                      type="text"
                      placeholder="https://maps.app.goo.gl/..."
                      value={createFields.mapsLink || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, mapsLink: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Link Video YouTube (Galeri)</label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      value={createFields.videoLink || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, videoLink: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    {(() => {
                      let accounts = [{ bankName: "", accountNumber: "", recipientName: "" }, { bankName: "", accountNumber: "", recipientName: "" }];
                      try {
                        const parsed = JSON.parse(createFields.bankAccount || "");
                        if (Array.isArray(parsed)) {
                          accounts[0] = parsed[0] || accounts[0];
                          accounts[1] = parsed[1] || accounts[1];
                        }
                      } catch (error) {
                        if (createFields.bankAccount) {
                          accounts[0].accountNumber = createFields.bankAccount;
                        }
                      }
                      
                      const handleAccountChange = (idx: number, key: string, val: string) => {
                        const newAccs = [...accounts];
                        newAccs[idx] = { ...newAccs[idx], [key]: val };
                        setCreateFields(prev => ({ ...prev, bankAccount: JSON.stringify(newAccs) }));
                      };

                      return (
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                            Rekening Amplop Digital (Maksimal 2)
                          </label>
                          
                          {accounts.map((acc, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                              <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                                Rekening Penerima {index + 1}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">Nama Bank</label>
                                  <input
                                    type="text"
                                    value={acc.bankName || ""}
                                    onChange={(e) => handleAccountChange(index, "bankName", e.target.value)}
                                    placeholder="BCA, Mandiri, OVO..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">No. Rekening</label>
                                  <input
                                    type="text"
                                    value={acc.accountNumber || ""}
                                    onChange={(e) => handleAccountChange(index, "accountNumber", e.target.value)}
                                    placeholder="Nomor rekening/HP..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-bold text-slate-450 block uppercase mb-0.5">Nama Penerima</label>
                                  <input
                                    type="text"
                                    value={acc.recipientName || ""}
                                    onChange={(e) => handleAccountChange(index, "recipientName", e.target.value)}
                                    placeholder="Nama pemilik..."
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary bg-white text-slate-800 font-semibold"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Alamat Pengiriman Kado</label>
                    <textarea
                      placeholder="Alamat lengkap untuk pengiriman kado fisik..."
                      value={createFields.giftAddress || ""}
                      onChange={(e) => setCreateFields(prev => ({ ...prev, giftAddress: e.target.value }))}
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 font-semibold resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCreateInvitation}
                disabled={isCreating}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-250 disabled:text-slate-450 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Buat Undangan Baru
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {invitationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all animate-scale-up">
            {/* Warning Header */}
            <div className="p-6 pb-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center border border-red-150 mb-3 animate-pulse">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Hapus Undangan Permanen?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Anda akan menghapus data undangan <span className="font-extrabold text-slate-800 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">"{invitationToDelete.name}"</span> secara permanen dari server database Bintarti.
              </p>
              <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  ⚠️ PENTING
                </span>
                <p className="text-[11px] text-amber-700 leading-relaxed font-semibold">
                  Tindakan ini tidak dapat dibatalkan. Seluruh data RSVP tamu, ucapan doa restu, foto-foto terunggah, dan log check-in QR Code dari undangan ini akan dihapus selamanya.
                </p>
              </div>
            </div>

            {/* Input Confirmation */}
            <div className="px-6 py-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Ketik <span className="text-red-500 font-extrabold bg-red-50 px-1 rounded">HAPUS</span> untuk mengonfirmasi:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Ketik HAPUS..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 font-bold bg-white"
              />
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 mt-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setInvitationToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteRow}
                disabled={isDeleting || deleteConfirmText !== "HAPUS"}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  deleteConfirmText === "HAPUS"
                    ? "bg-red-500 hover:bg-red-600 shadow-md shadow-red-200"
                    : "bg-slate-300 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Ya, Hapus Permanen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

