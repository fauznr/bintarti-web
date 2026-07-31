                              "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Baby,
  Heart,
  Cake,
  Palette,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Music,
  Calendar,
  Gift,
  Phone,
  Users,
  Camera,
  Plus,
  Loader2,
  Sparkles,
  Upload
} from "lucide-react";
import { musicOptions } from "../../data/formulir";
import { templates } from "../../data/katalog";

// Filter themes
const khitanThemes = templates.filter(t => t.category === "Khitan");
const birthdayThemes = templates.filter(t => t.category === "Birthday");
const aqiqahThemes = templates.filter(t => t.category === "Aqiqah");
const weddingThemes = templates.filter(t => t.category === "Wedding");

export const weddingMusicOptions = [
  { id: "wm1", label: "Beautiful in White - Shane Filan" },
  { id: "wm2", label: "Christina Perri - A Thousand Years" },
  { id: "wm3", label: "Marry Your Daughter - Brian McKnight" },
  { id: "wm4", label: "Baraka Allahu Lakuma - Maher Zain" },
  { id: "wm5", label: "Instrumental Romantic Piano & Violin" }
];

export default function Formulir() {
  const [activeTab, setActiveTab] = useState<"Khitan" | "Aqiqah" | "Wedding" | "Birthday" | "Custom">("Khitan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [waLink, setWaLink] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Bagian 1: Kontak & Tema
    whatsapp: "",
    shopeeOrder: "",
    theme: khitanThemes[0]?.name || "Khitan 1",
    music: "",
    customMusic: "",

    // Bagian 2: Data Utama (Khitan / Aqiqah / Birthday)
    birthdayAge: "",
    fullName: "",
    nickname: "",
    parentsName: "",
    childGender: "Putra",
    childOrder: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",

    // Bagian 2 Khusus Wedding: Data Mempelai & Acara Dual
    groomName: "",
    groomNickname: "",
    groomInstagram: "",
    groomParents: "",
    brideName: "",
    brideNickname: "",
    brideInstagram: "",
    brideParents: "",
    akadDate: "",
    akadTime: "",
                                akadTitle: "",
                                akadLocation: "",
    akadGmaps: "",
    resepsiDate: "",
    resepsiTime: "",
                                resepsiTitle: "",
                                resepsiLocation: "",
    resepsiGmaps: "",
    loveStory: "",
                                dresscodes: [
                                  { name: "Black", hex: "#171717" },
                                  { name: "Charcoal", hex: "#737373" },
                                  { name: "Silver", hex: "#D4D4D4" },
                                  { name: "White", hex: "#FFFFFF" }
                                ],
                                loveStoryList: [
      { year: "2021", title: "Awal Bertemu", description: "Pertama kali kami dipertemukan di bangku perkuliahan dan mulai saling mengenal." },
      { year: "2023", title: "Menjalin Hubungan", description: "Setelah menjalin komunikasi yang intens, kami memutuskan untuk berkomitmen bersama." },
      { year: "2025", title: "Momen Lamaran", description: "Dengan restu kedua orang tua, kami mengikat janji suci dalam prosesi lamaran." },
      { year: "2026", title: "Pernikahan Suci", description: "Momen sakral saat kami mengikat janji suci pernikahan untuk membina rumah tangga bahagia." }
    ],

    // Bagian 3: Data Tambahan
    scheduleList: [{ time: "", description: "" }],
    schedule: "",
    invitedGuests: "",
    youtubeVideo: "",

    // Bagian 4: Fitur Pro
    bankAccounts: [
      { bankName: "", accountNumber: "", recipientName: "" },
      { bankName: "", accountNumber: "", recipientName: "" }
    ],
    giftAddress: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Photo upload states (not saved to localStorage to prevent quota limits)
  const [profileBase64, setProfileBase64] = useState<string>("");
  const [galleryBase64, setGalleryBase64] = useState<string[]>([]);
  const [activitiesBase64, setActivitiesBase64] = useState<string>("");
  
  // Wedding specific photo states (Foto A, Foto B, Mempelai Pria, Mempelai Wanita)
  const [photoCoverBase64, setPhotoCoverBase64] = useState<string>(""); // Foto A (Cover Lockscreen)
  const [photoHeroBase64, setPhotoHeroBase64] = useState<string>("");   // Foto B (Background Hero Utama)
  const [photoStoryBase64, setPhotoStoryBase64] = useState<string>(""); // Foto Our Story
  const [photoGroomBase64, setPhotoGroomBase64] = useState<string>(""); // Profil Pria
  const [photoBrideBase64, setPhotoBrideBase64] = useState<string>(""); // Profil Wanita
  const [photoClosingBase64, setPhotoClosingBase64] = useState<string>(""); // Halaman Penutup
  const [saveTheDateBgBase64, setSaveTheDateBgBase64] = useState<string>("");
  const [quoteBgBase64, setQuoteBgBase64] = useState<string>("");
  const [loveStoryBgBase64, setLoveStoryBgBase64] = useState<string>("");
  const [ourStoryPhotoBase64, setOurStoryPhotoBase64] = useState<string>("");
  const [eventBgBase64, setEventBgBase64] = useState<string>("");
  const [dresscodeBgBase64, setDresscodeBgBase64] = useState<string>("");
  const [ourMomentBgBase64, setOurMomentBgBase64] = useState<string>("");
  const [giftBgBase64, setGiftBgBase64] = useState<string>("");
  const [rsvpBgBase64, setRsvpBgBase64] = useState<string>("");
  const [qrBgBase64, setQrBgBase64] = useState<string>("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [photoCoverLoading, setPhotoCoverLoading] = useState(false);
  const [photoHeroLoading, setPhotoHeroLoading] = useState(false);
  const [photoStoryLoading, setPhotoStoryLoading] = useState(false);
  const [photoGroomLoading, setPhotoGroomLoading] = useState(false);
  const [photoBrideLoading, setPhotoBrideLoading] = useState(false);
  const [photoClosingLoading, setPhotoClosingLoading] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState("");
  
  const [musicCatalog, setMusicCatalog] = useState<{id: string, category: string, label: string, url: string}[]>([]);

  const getDefaultMusicUrl = (tab: string, catArray: typeof musicCatalog) => {
    const cat = tab === "Wedding" ? "Wedding" : (tab === "Birthday" ? "Birthday" : "Umum");
    const fallback = catArray.find(m => m.category === cat) || catArray.find(m => m.category === "Umum");
    return fallback ? fallback.url : "Lainnya";
  };

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch("/api/admin/music");
        if (res.ok) {
          const data = await res.json();
          const parsed = data.map((m: any) => {
            let cat = "Umum";
            let title = m.label;
            if (m.label.includes("||")) {
              const parts = m.label.split("||");
              cat = parts[0];
              title = parts[1];
            }
            return { id: m.id, category: cat, label: title, url: m.url };
          }).filter((m: any) => m.label && m.label !== "custom");
          setMusicCatalog(parsed);
          setFormData(prev => {
            if (!prev.music || !prev.music.startsWith("http")) {
              return { ...prev, music: getDefaultMusicUrl(activeTab, parsed) };
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Failed to load music catalog", e);
      }
    };
    fetchMusic();
  }, []);

  // Native Canvas image compressor
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
          if (!ctx) {
            resolve("");
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          let base64 = "";
          const mime = file.type === "image/png" || file.type === "image/webp" ? "image/webp" : "image/jpeg";
          base64 = canvas.toDataURL(mime, quality);
          
          while (base64.length * 0.75 > 200 * 1024 && quality > 0.3) {
            quality -= 0.1;
            base64 = canvas.toDataURL(mime, quality);
          }
          
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setProfileLoading(true);
    try {
      const base64 = await compressImage(file);
      setProfileBase64(base64);
    } catch (err) {
      alert("Gagal mengompres gambar profil: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePhotoCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoCoverLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoCoverBase64(base64);
    } catch (err) {
      alert("Gagal mengompres gambar Cover Lockscreen: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoCoverLoading(false);
    }
  };

  const handlePhotoHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoHeroLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoHeroBase64(base64);
    } catch (err) {
      alert("Gagal mengompres gambar Hero Utama: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoHeroLoading(false);
    }
  };

  const handlePhotoStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoStoryLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoStoryBase64(base64);
    } catch (err) {
      alert("Gagal mengompres gambar Our Story: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoStoryLoading(false);
    }
  };

  const handlePhotoGroomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoGroomLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoGroomBase64(base64);
    } catch (err) {
      alert("Gagal mengompres foto profil Mempelai Pria: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoGroomLoading(false);
    }
  };

  const handlePhotoBrideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBrideLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoBrideBase64(base64);
    } catch (err) {
      alert("Gagal mengompres foto profil Mempelai Wanita: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoBrideLoading(false);
    }
  };

  
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setBase64: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const base64 = await compressImage(file);
      setBase64(base64);
    } catch (err) {
      alert("Gagal mengompres foto: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClosingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoClosingLoading(true);
    try {
      const base64 = await compressImage(file);
      setPhotoClosingBase64(base64);
    } catch (err) {
      alert("Gagal mengompres foto halaman penutup: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPhotoClosingLoading(false);
    }
  };

  const handleActivitiesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setActivitiesLoading(true);
    try {
      const base64 = await compressImage(file);
      setActivitiesBase64(base64);
    } catch (err) {
      alert("Gagal mengompres gambar kegiatan: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (galleryBase64.length + files.length > 10) {
      alert("Maksimal foto galeri yang diperbolehkan adalah 10 foto!");
      return;
    }
    
    setGalleryLoading(true);
    try {
      const compressedList: string[] = [...galleryBase64];
      for (let i = 0; i < files.length; i++) {
        const base64 = await compressImage(files[i]);
        compressedList.push(base64);
      }
      setGalleryBase64(compressedList);
    } catch (err) {
      alert("Gagal mengompres gambar galeri: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGalleryLoading(false);
    }
  };

  // Load form progress from localStorage on mount
  useEffect(() => {
    try {
      // Check if URL has ?theme= param (e.g. from katalog page)
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get("theme");
      const urlTab = urlParams.get("tab");

      const savedTab = localStorage.getItem("bintarti_form_active_tab");
      const savedData = localStorage.getItem("bintarti_form_data");
      const savedStep = localStorage.getItem("bintarti_form_step");

      if (urlTheme) {
        // URL param overrides everything - find matching tab
        const themeLower = urlTheme.toLowerCase();
        const detectedTab: any = themeLower.includes("wedding") ? "Wedding"
          : themeLower.includes("khitan") ? "Khitan"
          : themeLower.includes("aqiqah") ? "Aqiqah"
          : themeLower.includes("birthday") ? "Birthday"
          : urlTab || "Khitan";
        setActiveTab(detectedTab);
        setFormData(prev => ({ ...prev, theme: urlTheme }));
        setIsLoaded(true);
        return;
      }

      if (savedTab) {
        setActiveTab(savedTab as any);
      }
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Safely migrate schedule to scheduleList if needed
        if (parsed && !parsed.scheduleList) {
          if (parsed.schedule) {
             const lines = parsed.schedule.split('\n');
             parsed.scheduleList = lines.map((line: string) => {
                const match = line.match(/^\[(.*?)\] (.*)$/) || line.match(/^(.*?) - (.*)$/) || line.match(/^(.*?) : (.*)$/);
                if (match) return { time: match[1].trim(), description: match[2].trim() };
                return { time: "", description: line };
             });
          } else {
             parsed.scheduleList = [{ time: "", description: "" }];
          }
        }

        // Safely migrate or initialize bankAccounts array
        if (parsed && !parsed.bankAccounts) {
          parsed.bankAccounts = [
            { bankName: "", accountNumber: "", recipientName: "" },
            { bankName: "", accountNumber: "", recipientName: "" }
          ];
          if (parsed.bankAccount) {
            parsed.bankAccounts[0].accountNumber = parsed.bankAccount;
            delete parsed.bankAccount;
          }
        }
        // Safely migrate or initialize loveStoryList array (for Wedding Our Story section)
        if (parsed && !parsed.loveStoryList) {
          parsed.loveStoryList = [
            { year: "2021", title: "Awal Bertemu", description: "Pertama kali kami dipertemukan dan mulai saling mengenal." },
            { year: "2023", title: "Menjalin Hubungan", description: "Setelah komunikasi yang intens, kami memutuskan untuk berkomitmen." },
            { year: "2025", title: "Momen Lamaran", description: "Dengan restu kedua orang tua, kami mengikat janji dalam prosesi lamaran." },
            { year: "2026", title: "Pernikahan Suci", description: "Momen sakral saat kami mengikat janji suci pernikahan." }
          ];
        }

        setFormData(parsed);

      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10) || 1);
      }
    } catch (e) {
      console.error("Failed to load form cache:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save form progress to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("bintarti_form_active_tab", activeTab);
      localStorage.setItem("bintarti_form_data", JSON.stringify(formData));
      localStorage.setItem("bintarti_form_step", currentStep.toString());
    } catch (e) {
      console.error("Failed to save form cache:", e);
    }
  }, [activeTab, formData, currentStep, isLoaded]);

  const handleTabChange = (tab: "Khitan" | "Aqiqah" | "Wedding" | "Birthday" | "Custom") => {
    setActiveTab(tab);
    if (tab === "Khitan") {
      setFormData(prev => ({
        ...prev,
        theme: khitanThemes[0]?.name || "Khitan 1",
        music: "",
        customMusic: "",
        birthdayAge: ""
      }));
    } else if (tab === "Aqiqah") {
      setFormData(prev => ({
        ...prev,
        theme: aqiqahThemes[0]?.name || "Aqiqah 1",
        music: "",
        customMusic: "",
        birthdayAge: ""
      }));
    } else if (tab === "Birthday") {
      setFormData(prev => ({
        ...prev,
        theme: birthdayThemes[0]?.name || "Birthday 1",
        music: "",
        customMusic: ""
      }));
    } else if (tab === "Wedding") {
      setFormData(prev => ({
        ...prev,
        theme: weddingThemes[0]?.name || "Wedding 1",
        music: "",
        customMusic: "",
        birthdayAge: ""
      }));
    }
    setCurrentStep(1);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleScheduleListChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.scheduleList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, scheduleList: updated };
    });
  };

  const handleLoveStoryChange = (index: number, field: "year" | "title" | "description", value: string) => {
    setFormData(prev => {
      const updated = [...(prev.loveStoryList || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, loveStoryList: updated };
    });
  };


  const addLoveStoryItem = () => {
    if (formData.loveStoryList.length >= 10) return; // limit to 10 moments
    setFormData(prev => ({
      ...prev,
      loveStoryList: [...(prev.loveStoryList || []), { year: "", title: "", description: "" }]
    }));
  };

  const removeLoveStoryItem = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      loveStoryList: prev.loveStoryList.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const addScheduleItem = () => {
    if (formData.scheduleList.length >= 15) return;
    setFormData(prev => ({
      ...prev,
      scheduleList: [...prev.scheduleList, { time: "", description: "" }]
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.scheduleList];
      updated.splice(index, 1);
      return { ...prev, scheduleList: updated };
    });
  };

  const handleBankAccountChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedAccounts = [...prev.bankAccounts];
      updatedAccounts[index] = {
        ...updatedAccounts[index],
        [field]: value
      };
      return {
        ...prev,
        bankAccounts: updatedAccounts
      };
    });
  };

  // Validate step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.whatsapp.trim()) {
        newErrors.whatsapp = "Nomor WhatsApp wajib diisi";
      }
      if (!formData.shopeeOrder.trim()) {
        newErrors.shopeeOrder = "Nomor Pesanan Shopee / Akun Shopee wajib diisi";
      }
      if (formData.music === "Lainnya" && !formData.customMusic.trim()) {
        newErrors.customMusic = "Silakan tulis judul musik request Anda";
      }
    } else if (step === 2) {
      if (activeTab === "Wedding") {
        if (!formData.groomName.trim()) newErrors.groomName = "Nama lengkap mempelai pria wajib diisi";
        if (!formData.groomNickname.trim()) newErrors.groomNickname = "Nama panggilan mempelai pria wajib diisi";
        if (!formData.groomParents.trim()) newErrors.groomParents = "Nama orang tua mempelai pria wajib diisi";
        if (!formData.brideName.trim()) newErrors.brideName = "Nama lengkap mempelai wanita wajib diisi";
        if (!formData.brideNickname.trim()) newErrors.brideNickname = "Nama panggilan mempelai wanita wajib diisi";
        if (!formData.brideParents.trim()) newErrors.brideParents = "Nama orang tua mempelai wanita wajib diisi";
        if (!formData.akadDate.trim()) newErrors.akadDate = "Tanggal akad / pemberkatan wajib diisi";
        if (!formData.akadTime.trim()) newErrors.akadTime = "Waktu akad wajib diisi";
        if (!formData.akadLocation.trim()) newErrors.akadLocation = "Tempat akad wajib diisi";
        if (!formData.resepsiDate.trim()) newErrors.resepsiDate = "Tanggal resepsi wajib diisi";
        if (!formData.resepsiTime.trim()) newErrors.resepsiTime = "Waktu resepsi wajib diisi";
        if (!formData.resepsiLocation.trim()) newErrors.resepsiLocation = "Tempat resepsi wajib diisi";
      } else if (activeTab === "Birthday") {
        if (!formData.birthdayAge.trim()) newErrors.birthdayAge = "Urutan Ulang Tahun Ke- berapa wajib diisi";
        if (!formData.fullName.trim()) newErrors.fullName = "Nama lengkap anak wajib diisi";
        if (!formData.nickname.trim()) newErrors.nickname = "Nama panggilan anak wajib diisi";
        if (!formData.parentsName.trim()) newErrors.parentsName = "Nama kedua orang tua wajib diisi";
        if (!formData.eventDate.trim()) newErrors.eventDate = "Tanggal acara ulang tahun wajib diisi";
        if (!formData.eventTime.trim()) newErrors.eventTime = "Waktu acara wajib diisi";
        if (!formData.eventLocation.trim()) newErrors.eventLocation = "Alamat / tempat acara wajib diisi";
      } else {
        if (!formData.fullName.trim()) newErrors.fullName = "Nama lengkap anak wajib diisi";
        if (!formData.nickname.trim()) newErrors.nickname = "Nama panggilan anak wajib diisi";
        if (!formData.parentsName.trim()) newErrors.parentsName = "Nama kedua orang tua wajib diisi";
        if (!formData.eventDate.trim()) newErrors.eventDate = activeTab === "Khitan" ? "Hari & tanggal acara wajib diisi" : "Tanggal acara aqiqah wajib diisi";
        if (!formData.eventTime.trim()) newErrors.eventTime = "Waktu acara wajib diisi";
        if (!formData.eventLocation.trim()) newErrors.eventLocation = "Alamat / tempat acara wajib diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Generate formatted WhatsApp message text
  const generateWaText = () => {
    const musicText = formData.music === "Lainnya" ? formData.customMusic : formData.music;
    const isWedding = activeTab === "Wedding";
    const isBirthday = activeTab === "Birthday";
    const isAqiqah = activeTab === "Aqiqah";
    
    let text = `*DATA FORMULIR UNDANGAN ${isWedding ? "PERNIKAHAN (WEDDING)" : isBirthday ? "ULANG TAHUN" : isAqiqah ? "AQIQAH" : "KHITAN"} - BINTARTI*\n`;
    text += `===================================\n\n`;
    
    text += `*BAGIAN 1: INFO PEMBELI & TEMA*\n`;
    text += `• No. WhatsApp: ${formData.whatsapp}\n`;
    text += `• No. Pesanan Shopee: ${formData.shopeeOrder}\n`;
    text += `• Tema Pilihan: ${formData.theme}\n`;
    text += `• Musik Latar: ${musicText}\n\n`;
    
    if (isWedding) {
      text += `*BAGIAN 2: DATA MEMPELAI & ACARA PERNIKAHAN*\n`;
      text += `• Mempelai Pria: ${formData.groomName} (${formData.groomNickname})\n`;
      text += `  Orang Tua Pria: ${formData.groomParents}\n\n`;
      text += `• Mempelai Wanita: ${formData.brideName} (${formData.brideNickname})\n`;
      text += `  Orang Tua Wanita: ${formData.brideParents}\n\n`;
      text += `• Acara ${formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad / Pemberkatan"}:\n`;
      text += `  Hari/Tgl: ${formData.akadDate}\n`;
      text += `  Jam: ${formData.akadTime}\n`;
      text += `  Tempat: ${formData.akadLocation}\n`;
      if (formData.akadGmaps) text += `  Maps: ${formData.akadGmaps}\n`;
      text += `\n• Acara Resepsi:\n`;
      text += `  Hari/Tgl: ${formData.resepsiDate}\n`;
      text += `  Jam: ${formData.resepsiTime}\n`;
      text += `  Tempat: ${formData.resepsiLocation}\n`;
      if (formData.resepsiGmaps) text += `  Maps: ${formData.resepsiGmaps}\n\n`;
      
      text += `*BAGIAN 3: STATUS UNGGAH FOTO*\n`;
      text += `• Foto A (Cover Lockscreen & Background): ${photoCoverBase64 ? "✅ Terunggah" : "⚠️ Menggunakan Template"}\n`;
      if (["Wedding 2", "Wedding 3"].includes(formData.theme)) {
        text += `• Foto Our Story: ${photoStoryBase64 ? "✅ Terunggah" : "-"}\n`;
      }
      text += `• Foto Profil Pria & Wanita: ${photoGroomBase64 || photoBrideBase64 ? "✅ Terunggah" : "-"}\n`;
      if (formData.theme === "Wedding 3") {
        text += `• Foto Halaman Penutup: ${photoClosingBase64 ? "✅ Terunggah" : "-"}\n`;
      }
      if (formData.theme === "Wedding 6") {
        text += `• Background Ayat/Kutipan: ${quoteBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Love Story: ${loveStoryBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Save The Date: ${saveTheDateBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Acara/Event: ${eventBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Dresscode: ${dresscodeBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Our Moment: ${ourMomentBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background Kado/Gift: ${giftBgBase64 ? "✅ Terunggah" : "-"}\n`;
        text += `• Background RSVP: ${rsvpBgBase64 ? "✅ Terunggah" : "-"}\n`;
      }
      const galleryLabel = (formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") 
        ? "Foto C (Galeri & Background Slideshow)" 
        : (formData.theme === "Wedding 7" ? "Foto B (Galeri Foto)" : "Foto C (Galeri Album)");
      text += `• ${galleryLabel}: ${galleryBase64.length} foto terunggah\n\n`;
    } else {
      text += `*BAGIAN 2: DATA UTAMA ${isBirthday ? "ULANG TAHUN" : isAqiqah ? "AQIQAH" : "KHITAN"}*\n`;
      if (isBirthday) {
        text += `• Ulang Tahun Ke: ${formData.birthdayAge}\n`;
      }
      text += `• Nama Lengkap Anak: ${formData.fullName}\n`;
      text += `• Nama Panggilan: ${formData.nickname}\n`;
      text += `• Nama Orang Tua: ${formData.parentsName}\n`;
      const childOrderVal = formData.childOrder ? `${formData.childGender} ${formData.childOrder}` : "-";
      text += `• Anak Ke: ${childOrderVal}\n`;
      text += `• Hari, Tanggal Acara: ${formData.eventDate}\n`;
      text += `• Waktu Acara: ${formData.eventTime}\n`;
      text += `• Tempat / Alamat Acara: ${formData.eventLocation}\n\n`;
    }
    
    if (isWedding) {
      // Our Story section for Wedding
      const storyLines = formData.loveStoryList.map((s, i) => {
        if (formData.theme === "Wedding 1" || formData.theme === "Wedding 5") {
           return `  [${s.year || "-"}] ${s.title || "-"}: ${s.description || "-"}`;
        }
        return `  ${s.title || "-"}: ${s.description || "-"}`;
      }).join('\n');
      text += `*BAGIAN 3: PERJALANAN CINTA (OUR STORY)*\n`;
      text += `• Timeline Kisah Cinta:\n${storyLines || "-"}\n`;
      if (formData.youtubeVideo) text += `• Video Prewedding (YouTube): ${formData.youtubeVideo}\n`;
      text += `\n`;
    } else {
      text += `*BAGIAN 3: DATA TAMBAHAN*\n`;
      const scheduleStr = formData.scheduleList.map(s => s.time || s.description ? (s.time ? `[${s.time}] ${s.description}` : s.description) : "").filter(Boolean).join('\n');
      text += `• Activities & Highlights:\n${scheduleStr || "-"}\n\n`;
      text += `• Turut Mengundang:\n${formData.invitedGuests || "-"}\n\n`;
    }
    
    text += `*BAGIAN 4: FITUR PROFESSIONAL*\n`;
    let bankAccountText = "";
    formData.bankAccounts.forEach((acc, idx) => {
      if (acc.bankName || acc.accountNumber || acc.recipientName) {
        bankAccountText += `  [Rekening ${idx + 1}] ${acc.bankName || "-"} - ${acc.accountNumber || "-"} a.n. ${acc.recipientName || "-"}\n`;
      }
    });
    text += `• No. Rekening Amplop Digital:\n${bankAccountText.trim() || "-"}\n\n`;
    text += `===================================\n`;
    text += `_Berkas Foto/Video Galeri tambahan dapat dikirimkan melalui chat ini._`;

    return encodeURIComponent(text);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Format WhatsApp Link
    const messageText = generateWaText();
    const adminWaNumber = "6285158573677";
    const waUrl = `https://wa.me/${adminWaNumber}?text=${messageText}`;
    setWaLink(waUrl);

    try {
      // 1. Submit to Google Spreadsheet / Supabase via server-side API route
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          activeTab,
          formData: {
            ...formData,
            fullName: activeTab === "Wedding" ? `${formData.groomNickname || formData.groomName} & ${formData.brideNickname || formData.brideName}` : formData.fullName,
            eventDate: activeTab === "Wedding" ? formData.akadDate || formData.resepsiDate : formData.eventDate,
            eventTime: activeTab === "Wedding" ? formData.akadTime || formData.resepsiTime : formData.eventTime,
            eventLocation: activeTab === "Wedding" ? formData.akadLocation || formData.resepsiLocation : formData.eventLocation,
            childOrder: formData.childOrder ? `${formData.childGender} ${formData.childOrder}` : "",
            schedule: formData.scheduleList.map(s => s.time || s.description ? (s.time ? `[${s.time}] ${s.description}` : s.description) : "").filter(Boolean).join('\n'),
            bankAccount: JSON.stringify(formData.bankAccounts)
          },
          profilePhoto: profileBase64 || photoCoverBase64 || photoHeroBase64,
          galleryPhotos: galleryBase64,
          activitiesPhoto: activitiesBase64,
          photoCover: photoCoverBase64,
          photoHero: photoHeroBase64,
          photoStory: photoStoryBase64,
          photoGroom: photoGroomBase64,
          photoBride: photoBrideBase64,
          photoClosing: photoClosingBase64,
          emailConfirm: emailConfirm,
          saveTheDateBg: saveTheDateBgBase64,
          quoteBg: quoteBgBase64,
          loveStoryBg: loveStoryBgBase64,
          eventBg: eventBgBase64,
          dresscodeBg: dresscodeBgBase64,
          ourMomentBg: ourMomentBgBase64,
          giftBg: giftBgBase64,
          rsvpBg: rsvpBgBase64,
          qrBg: qrBgBase64
        })
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        console.error("Form submission API error:", resData.error || res.status);
        // Still open WA but warn the user
        alert(`⚠️ Terjadi kesalahan saat menyimpan data: ${resData.error || "Unknown error"}. Screenshot ini dan hubungi admin.`);
        setSubmitStatus("success");
        setIsSubmitting(false);
        window.open(waUrl, "_blank");
        return;
      }

      setSubmitStatus("success");
      setIsSubmitting(false);

      // Clear form cache on success
      try {
        localStorage.removeItem("bintarti_form_active_tab");
        localStorage.removeItem("bintarti_form_data");
        localStorage.removeItem("bintarti_form_step");
      } catch (e) {
        // ignore
      }

      // Auto redirect to WhatsApp
      window.open(waUrl, "_blank");

    } catch (err) {
      console.error("Spreadsheet save error:", err);
      // Still set success since the primary fallback is sending to WhatsApp
      setSubmitStatus("success");
      setIsSubmitting(false);
      window.open(waUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-primary/20 selection:text-primary bg-slate-50/50">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
              <Loader2 className="w-16 h-16 text-primary animate-spin absolute" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Mengunggah Data Acara</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Mohon tunggu, kami sedang memproses formulir dan mengunggah berkas foto Anda ke sistem...
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      )}
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md border border-slate-100 flex items-center justify-center bg-white p-0.5">
              <Image src="/logo.png" alt="Bintarti Logo" width={40} height={40} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-accent">
                Bintarti
              </span>
              <span className="text-[10px] text-slate-800 font-bold -mt-1">
                Undangan Digital
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <a href="/katalog" className="hover:text-primary transition-colors">
              Lihat Katalog
            </a>
            <a href="/cek-undangan" className="hover:text-primary transition-colors">
              Cek Undangan
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20butuh%20bantuan%20mengisi%20formulir"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-500" /> Bantuan Admin
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-enter md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 z-50">
            <Link
              href="/"
              className="text-slate-800 font-bold py-2 border-b border-slate-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
            <a
              href="/katalog"
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Lihat Katalog
            </a>
            <a
              href="/cek-undangan"
              className="text-slate-800 font-bold py-2 border-b border-slate-200"
            >
              Cek Undangan
            </a>
            <a
              href="https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20butuh%20bantuan%20mengisi%20formulir"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-500" /> Tanya Admin via WA
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Pengisian Data Undangan
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 font-heading">
            Formulir Isi Data Acara
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2">
            Isi formulir berikut dengan lengkap dan teliti untuk memudahkan tim kami memproses pembuatan undangan digital Anda.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <button
            onClick={() => handleTabChange("Khitan")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "Khitan"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Baby className="w-4 h-4" /> Khitan
          </button>
          <button
            onClick={() => handleTabChange("Aqiqah")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "Aqiqah"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" /> Aqiqah
          </button>
          <button
            onClick={() => handleTabChange("Wedding")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "Wedding"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Heart className="w-4 h-4" /> Wedding
          </button>
          <button
            onClick={() => handleTabChange("Birthday")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "Birthday"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Cake className="w-4 h-4" /> Birthday
          </button>
          <button
            onClick={() => handleTabChange("Custom")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "Custom"
                ? "bg-primary text-white shadow-md"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Palette className="w-4 h-4" /> Custom <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal uppercase">Soon</span>
          </button>
        </div>

        {/* Tab Contents */}
        <>
          {activeTab !== "Khitan" && activeTab !== "Birthday" && activeTab !== "Aqiqah" && activeTab !== "Wedding" ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center shadow-lg shadow-slate-100 max-w-xl mx-auto flex flex-col items-center fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Formulir Belum Tersedia</h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Formulir pengisian data untuk acara <strong>{activeTab}</strong> sedang dalam proses integrasi sistem kami.
                Namun jangan khawatir, Anda tetap bisa memesan undangan secara manual dengan menghubungi WhatsApp admin kami sekarang.
              </p>
              <a
                href={`https://wa.me/6285158573677?text=Halo%20Admin%20Bintarti,%20saya%20ingin%20memesan%20undangan%20digital%20untuk%20acara%20${activeTab}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
              >
                Hubungi Admin Sekarang <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : submitStatus === "success" ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center shadow-xl shadow-slate-100 max-w-xl mx-auto flex flex-col items-center scale-in">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">Data Berhasil Dikirim!</h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Terima kasih telah mengisi formulir data {activeTab}. Sistem kami sedang mengalihkan Anda ke WhatsApp Admin Bintarti untuk konfirmasi berkas foto/video.
              </p>
              
              <div className="mt-8 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 text-left max-w-md w-full">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Langkah Selanjutnya:
                </h4>
                <ol className="list-decimal pl-4 mt-2 text-xs text-amber-800/80 space-y-1.5">
                  <li>Pastikan Anda mengirimkan pesan chat yang terbuka otomatis di WhatsApp.</li>
                  <li>Kirimkan file-file foto dan video galeri ke WhatsApp admin Kami.</li>
                  <li>Admin kami akan segera melakukan verifikasi pesanan Anda.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-md">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Buka WhatsApp Manual
                </a>
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem("bintarti_form_active_tab");
                      localStorage.removeItem("bintarti_form_data");
                      localStorage.removeItem("bintarti_form_step");
                    } catch (e) {
                      // ignore
                    }
                    setCurrentStep(1);
                    setSubmitStatus("idle");
                    const defaultTheme = activeTab === "Khitan" 
                      ? (khitanThemes[0]?.name || "Khitan 1")
                      : activeTab === "Aqiqah"
                      ? (aqiqahThemes[0]?.name || "Aqiqah Cloud Soft Blue")
                      : activeTab === "Wedding"
                      ? (weddingThemes[0]?.name || "Wedding 1")
                      : (birthdayThemes[0]?.name || "Birthday 1");
                    const defaultMusic = getDefaultMusicUrl(activeTab, musicCatalog);

                    setFormData({
                      whatsapp: "",
                      shopeeOrder: "",
                      theme: defaultTheme,
                      music: defaultMusic,
                      customMusic: "",
                      birthdayAge: "",
                      fullName: "",
                      nickname: "",
                      parentsName: "",
                      childGender: "Putra",
                      childOrder: "",
                      eventDate: "",
                      eventTime: "",
                      eventLocation: "",
                      groomName: "",
                      groomNickname: "",
                      groomInstagram: "",
                      groomParents: "",
                      brideName: "",
                      brideNickname: "",
                      brideInstagram: "",
                      brideParents: "",
                      akadDate: "",
                      akadTime: "",
                      akadTitle: "",
                      akadLocation: "",
                      akadGmaps: "",
                      resepsiDate: "",
                      resepsiTime: "",
                      resepsiTitle: "",
                      resepsiLocation: "",
                      resepsiGmaps: "",
                      loveStory: "",
                      dresscodes: [
                        { name: "Black", hex: "#171717" },
                        { name: "Charcoal", hex: "#737373" },
                        { name: "Silver", hex: "#D4D4D4" },
                        { name: "White", hex: "#FFFFFF" }
                      ],
                      loveStoryList: [
                        { year: "2021", title: "Awal Bertemu", description: "Pertama kali kami dipertemukan dan mulai saling mengenal." },
                        { year: "2023", title: "Menjalin Hubungan", description: "Setelah komunikasi yang intens, kami memutuskan untuk berkomitmen." },
                        { year: "2025", title: "Momen Lamaran", description: "Dengan restu kedua orang tua, kami mengikat janji dalam prosesi lamaran." },
                        { year: "2026", title: "Pernikahan Suci", description: "Momen sakral saat kami mengikat janji suci pernikahan." }
                      ],
                      scheduleList: [{ time: "", description: "" }],
                      schedule: "",
                      invitedGuests: "",
                      youtubeVideo: "",
                      bankAccounts: [
                        { bankName: "", accountNumber: "", recipientName: "" },
                        { bankName: "", accountNumber: "", recipientName: "" }
                      ],
                      giftAddress: ""
                    });
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
                >
                  Isi Ulang Form
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden fade-in">
              {/* Stepper Progress */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 md:px-8">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex flex-col items-center relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border ${
                            currentStep === step
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                              : currentStep > step
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 absolute -bottom-5 whitespace-nowrap hidden sm:block">
                          {step === 1 ? "Kontak & Tema" : step === 2 ? (activeTab === "Wedding" ? "Data Mempelai" : "Data Acara") : step === 3 ? "Galeri & Foto" : "Fitur Pro"}
                        </span>
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${
                            currentStep > step ? "bg-emerald-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="h-6" /> {/* spacer for labels */}
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 md:p-10">
                {/* Honeypot field (hidden from humans, filled by spam bots) */}
                <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                  <label htmlFor="confirm-email-field">Leave this field empty</label>
                  <input
                    id="confirm-email-field"
                    type="text"
                    name="email_confirm"
                    autoComplete="off"
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
                {/* STEP 1: INFO PEMBELI & TEMA */}
                {currentStep === 1 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">Bagian 1: Judul Form {activeTab}</h3>
                          <p className="text-xs text-slate-400">Informasi kontak dan tema undangan pilihan Anda</p>
                        </div>
                      </div>
                      {isLoaded && typeof window !== "undefined" && localStorage.getItem("bintarti_form_data") && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin menghapus semua isian formulir dan memulai dari awal?")) {
                              try {
                                localStorage.removeItem("bintarti_form_active_tab");
                                localStorage.removeItem("bintarti_form_data");
                                localStorage.removeItem("bintarti_form_step");
                              } catch (e) {}
                              const defaultTheme = activeTab === "Khitan" 
                                ? (khitanThemes[0]?.name || "Khitan 1")
                                : activeTab === "Aqiqah"
                                ? (aqiqahThemes[0]?.name || "Aqiqah 1")
                                : activeTab === "Wedding"
                                ? (weddingThemes[0]?.name || "Wedding 1")
                                : (birthdayThemes[0]?.name || "Birthday 1");
                              const defaultMusic = getDefaultMusicUrl(activeTab, musicCatalog);
                              setFormData({
                                whatsapp: "",
                                shopeeOrder: "",
                                theme: defaultTheme,
                                music: defaultMusic,
                                customMusic: "",
                                birthdayAge: "",
                                fullName: "",
                                nickname: "",
                                parentsName: "",
                                childGender: "Putra",
                                childOrder: "",
                                eventDate: "",
                                eventTime: "",
                                eventLocation: "",
                                groomName: "",
                                groomNickname: "",
                                groomInstagram: "",
                                groomParents: "",
                                brideName: "",
                                brideNickname: "",
                                brideInstagram: "",
                                brideParents: "",
                                akadDate: "",
                                akadTime: "",
                                akadTitle: "",
                                akadLocation: "",
                                akadGmaps: "",
                                resepsiDate: "",
                                resepsiTime: "",
                                resepsiTitle: "",
                                resepsiLocation: "",
                                resepsiGmaps: "",
                                loveStory: "",
                                dresscodes: [
                                  { name: "Black", hex: "#171717" },
                                  { name: "Charcoal", hex: "#737373" },
                                  { name: "Silver", hex: "#D4D4D4" },
                                  { name: "White", hex: "#FFFFFF" }
                                ],
                                loveStoryList: [
                                  { year: "2021", title: "Awal Bertemu", description: "Pertama kali kami dipertemukan dan mulai saling mengenal." },
                                  { year: "2023", title: "Menjalin Hubungan", description: "Setelah komunikasi yang intens, kami memutuskan untuk berkomitmen." },
                                  { year: "2025", title: "Momen Lamaran", description: "Dengan restu kedua orang tua, kami mengikat janji dalam prosesi lamaran." },
                                  { year: "2026", title: "Pernikahan Suci", description: "Momen sakral saat kami mengikat janji suci pernikahan." }
                                ],
                                scheduleList: [{ time: "", description: "" }],
                                schedule: "",
                                invitedGuests: "",
                                youtubeVideo: "",
                                bankAccounts: [
                                  { bankName: "", accountNumber: "", recipientName: "" },
                                  { bankName: "", accountNumber: "", recipientName: "" }
                                ],
                                giftAddress: ""
                              });
                              setCurrentStep(1);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 font-bold text-[10px] transition-colors cursor-pointer shrink-0"
                          title="Hapus isian draf saat ini"
                        >
                          Hapus Draf
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* WA */}
                      <div>
                        <label htmlFor="whatsapp" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          placeholder="Contoh: 081234567890"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.whatsapp
                              ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                              : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                          }`}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Nomor WhatsApp yang bisa kami hubungi terkait data {activeTab === "Khitan" ? "khitan" : activeTab === "Aqiqah" ? "aqiqah" : "ulang tahun"} yang Anda kirim.
                        </p>
                        {errors.whatsapp && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp}
                          </p>
                        )}
                      </div>

                      {/* Shopee */}
                      <div>
                        <label htmlFor="shopeeOrder" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          No. Pesanan Shopee / Akun Shopee *
                        </label>
                        <input
                          type="text"
                          id="shopeeOrder"
                          name="shopeeOrder"
                          placeholder="Contoh: 260612ABC123 atau Akun shopee: bintarti_undangan"
                          value={formData.shopeeOrder}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.shopeeOrder
                              ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                              : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                          }`}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Isi nomor pesanan Shopee jika Anda sudah checkout, agar admin mudah melakukan konfirmasi. Jika belum checkout isi nama akun shopee Anda.
                        </p>
                        {errors.shopeeOrder && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.shopeeOrder}
                          </p>
                        )}
                      </div>

                      {/* Theme */}
                      <div>
                        {activeTab === "Wedding" && (
                          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-rose-800 leading-relaxed font-semibold">
                              Pilih tema pernikahan Anda terlebih dahulu di bawah ini. Isian formulir data di langkah selanjutnya akan otomatis menyesuaikan dengan fitur & tampilan tema <strong>{formData.theme}</strong>!
                            </p>
                          </div>
                        )}

                        <label htmlFor="theme" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Pilih Tema Undangan *
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-800"
                        >
                          {(activeTab === "Khitan" 
                            ? khitanThemes 
                            : activeTab === "Aqiqah" 
                            ? aqiqahThemes 
                            : activeTab === "Wedding" 
                            ? weddingThemes 
                            : birthdayThemes).map((tpl) => (
                            <option key={tpl.id} value={tpl.name}>
                              {tpl.name} {tpl.name === "Wedding 1" ? "(Direkomendasikan)" : ""}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Tema yang Anda pilih dari katalog {activeTab === "Khitan" ? "khitan" : activeTab === "Aqiqah" ? "aqiqah" : activeTab === "Wedding" ? "wedding" : "ulang tahun"}.
                        </p>
                      </div>

                      {/* Music */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Pilih Musik Latar
                        </label>
                        <div className="space-y-2 mt-2">
                          {musicCatalog
                            .filter(opt => opt.category === activeTab || opt.category === "Umum")
                            .map((opt) => (
                              <label key={opt.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                                <input
                                  type="radio"
                                  name="music"
                                  value={opt.url}
                                  checked={formData.music === opt.url}
                                  onChange={handleInputChange}
                                  className="w-4 h-4 text-primary focus:ring-primary/20"
                                />
                                <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
                                  <Music className={`w-4 h-4 ${activeTab === "Wedding" ? "text-rose-400" : "text-slate-400"}`} />
                                  {opt.label}
                                </div>
                              </label>
                          ))}
                          <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                            <input
                              type="radio"
                              name="music"
                              value="Lainnya"
                              checked={formData.music === "Lainnya"}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary/20"
                            />
                            <span className="text-sm text-slate-700 font-semibold">Musik Lainnya / Request Sendiri:</span>
                          </label>
                        </div>

                        {formData.music === "Lainnya" && (
                          <div className="mt-3 pl-7 fade-in">
                            <input
                              type="text"
                              name="customMusic"
                              placeholder="Masukkan judul lagu & nama penyanyi"
                              value={formData.customMusic}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.customMusic
                                  ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                  : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                              }`}
                            />
                            {errors.customMusic && (
                              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.customMusic}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATA ACARA / MEMPELAI */}
                {currentStep === 2 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="p-2 rounded-lg bg-rose-50 text-rose-500">
                        {activeTab === "Wedding" ? <Heart className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">
                          Bagian 2: {activeTab === "Wedding" ? "Data Mempelai & Acara Pernikahan" : `Data Acara ${activeTab}`}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {activeTab === "Wedding" 
                            ? "Isi rincian data kedua mempelai serta waktu dan tempat acara Akad & Resepsi"
                            : `Detail data anak serta jadwal & tempat acara ${activeTab}`}
                        </p>
                      </div>
                    </div>

                    {activeTab === "Wedding" ? (
                      /* WEDDING STEP 2 INPUTS */
                      <div className="space-y-8">
                        {/* Mempelai Pria */}
                        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                          <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-2">
                            🤵 Data Mempelai Pria
                          </h4>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Nama Lengkap Mempelai Pria *
                            </label>
                            <input
                              type="text"
                              name="groomName"
                              placeholder="Contoh: Muhammad Irfan Pratama S.Kom"
                              value={formData.groomName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.groomName ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                              }`}
                            />
                            {errors.groomName && <p className="text-xs text-rose-500 mt-1">{errors.groomName}</p>}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Nama Panggilan Pria *
                              </label>
                              <input
                                type="text"
                                name="groomNickname"
                                placeholder="Contoh: Irfan"
                                value={formData.groomNickname}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.groomNickname ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                                }`}
                              />
                              {errors.groomNickname && <p className="text-xs text-rose-500 mt-1">{errors.groomNickname}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Username IG Pria (Opsional)
                              </label>
                              <input
                                type="text"
                                name="groomInstagram"
                                placeholder="@username"
                                value={formData.groomInstagram}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Nama Kedua Orang Tua Pria *
                            </label>
                            <input
                              type="text"
                              name="groomParents"
                              placeholder="Contoh: Putra dari Bpk. H. Ahmad & Ibu Hj. Suminah"
                              value={formData.groomParents}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.groomParents ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                              }`}
                            />
                            {errors.groomParents && <p className="text-xs text-rose-500 mt-1">{errors.groomParents}</p>}
                          </div>
                        </div>

                        {/* Mempelai Wanita */}
                        <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-4">
                          <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-2">
                            👰 Data Mempelai Wanita
                          </h4>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Nama Lengkap Mempelai Wanita *
                            </label>
                            <input
                              type="text"
                              name="brideName"
                              placeholder="Contoh: Annisa Rahmawati S.Ked"
                              value={formData.brideName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.brideName ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                              }`}
                            />
                            {errors.brideName && <p className="text-xs text-rose-500 mt-1">{errors.brideName}</p>}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Nama Panggilan Wanita *
                              </label>
                              <input
                                type="text"
                                name="brideNickname"
                                placeholder="Contoh: Annisa"
                                value={formData.brideNickname}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.brideNickname ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                                }`}
                              />
                              {errors.brideNickname && <p className="text-xs text-rose-500 mt-1">{errors.brideNickname}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Username IG Wanita (Opsional)
                              </label>
                              <input
                                type="text"
                                name="brideInstagram"
                                placeholder="@username"
                                value={formData.brideInstagram}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Nama Kedua Orang Tua Wanita *
                            </label>
                            <input
                              type="text"
                              name="brideParents"
                              placeholder="Contoh: Putri dari Bpk. Ir. H. Bambang & Ibu Hj. Yuli"
                              value={formData.brideParents}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.brideParents ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-primary/20"
                              }`}
                            />
                            {errors.brideParents && <p className="text-xs text-rose-500 mt-1">{errors.brideParents}</p>}
                          </div>
                        </div>

                        {/* Acara 1: Akad */}
                        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            💍 Acara {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah / Pemberkatan"}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *
                              </label>
                              <input
                                type="date"
                                name="akadDate"
                                value={formData.akadDate}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.akadDate ? "border-rose-400" : "border-slate-200"
                                }`}
                              />
                              {errors.akadDate && <p className="text-xs text-rose-500 mt-1">{errors.akadDate}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Waktu / Jam {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *
                              </label>
                              <input
                                type="time"
                                name="akadTime"
                                value={formData.akadTime}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.akadTime ? "border-rose-400" : "border-slate-200"
                                }`}
                              />
                              {errors.akadTime && <p className="text-xs text-rose-500 mt-1">{errors.akadTime}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Tempat / Alamat {formData.theme === "Wedding 3" ? "Pemberkatan" : "Akad Nikah"} *
                            </label>
                            <textarea
                              name="akadLocation"
                              rows={2}
                              placeholder="Contoh: Masjid Agung Jawa Barat, Jl. Asia Afrika No. 100, Bandung"
                              value={formData.akadLocation}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.akadLocation ? "border-rose-400" : "border-slate-200"
                              }`}
                            />
                            {errors.akadLocation && <p className="text-xs text-rose-500 mt-1">{errors.akadLocation}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Link Google Maps Akad (Opsional)
                            </label>
                            <input
                              type="url"
                              name="akadGmaps"
                              placeholder="Contoh: https://maps.app.goo.gl/xxx"
                              value={formData.akadGmaps}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        {/* Acara 2: Resepsi */}
                        <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-4">
                          <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-2">
                            🎉 Acara Resepsi Pernikahan
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Tanggal Resepsi *
                              </label>
                              <input
                                type="date"
                                name="resepsiDate"
                                value={formData.resepsiDate}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.resepsiDate ? "border-rose-400" : "border-slate-200"
                                }`}
                              />
                              {errors.resepsiDate && <p className="text-xs text-rose-500 mt-1">{errors.resepsiDate}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                Waktu / Jam Resepsi *
                              </label>
                              <input
                                type="time"
                                name="resepsiTime"
                                value={formData.resepsiTime}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                  errors.resepsiTime ? "border-rose-400" : "border-slate-200"
                                }`}
                              />
                              {errors.resepsiTime && <p className="text-xs text-rose-500 mt-1">{errors.resepsiTime}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Tempat / Alamat Resepsi *
                            </label>
                            <textarea
                              name="resepsiLocation"
                              rows={2}
                              placeholder="Contoh: Grand Ballroom Hotel Savoy Homann, Jl. Asia Afrika No. 112, Bandung"
                              value={formData.resepsiLocation}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.resepsiLocation ? "border-rose-400" : "border-slate-200"
                              }`}
                            />
                            {errors.resepsiLocation && <p className="text-xs text-rose-500 mt-1">{errors.resepsiLocation}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                              Link Google Maps Resepsi (Opsional)
                            </label>
                            <input
                              type="url"
                              name="resepsiGmaps"
                              placeholder="Contoh: https://maps.app.goo.gl/yyy"
                              value={formData.resepsiGmaps}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* KHITAN / AQIQAH / BIRTHDAY STEP 2 INPUTS */
                      <div className="space-y-4">
                        {activeTab === "Birthday" && (
                          <div>
                            <label htmlFor="birthdayAge" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              Ulang Tahun Ke? *
                            </label>
                            <input
                              type="text"
                              id="birthdayAge"
                              name="birthdayAge"
                              placeholder="Contoh: Kesatu (1) atau Ke-5"
                              value={formData.birthdayAge}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.birthdayAge
                                  ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                  : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                              }`}
                            />
                            {errors.birthdayAge && (
                              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.birthdayAge}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Profile Photo */}
                        <div className="border-t border-slate-100 pt-5 space-y-4">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            📁 Unggah Foto (Opsional)
                          </h4>
                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              Foto Profil Utama (Ditampilkan di profil intro dan closing)
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileUpload}
                                className="hidden"
                                id="profile-upload-input"
                                disabled={profileLoading}
                              />
                              <label
                                htmlFor="profile-upload-input"
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1.5"
                              >
                                <Camera className="w-4 h-4" /> {profileLoading ? "Mengompres..." : "Pilih Foto Profil"}
                              </label>
                              {profileBase64 && (
                                <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={profileBase64} alt="Profile Preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setProfileBase64("")}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] border-none cursor-pointer"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Unggah foto profil terbaik anak untuk ditampilkan di bagian awal dan akhir undangan.
                            </p>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Nama Lengkap Anak yang di {activeTab === "Khitan" ? "Khitan" : activeTab === "Aqiqah" ? "Aqiqah" : "Ulang Tahun"} *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Contoh: Saka Mahendra"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.fullName
                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                            </p>
                          )}
                        </div>

                        {/* Nickname */}
                        <div>
                          <label htmlFor="nickname" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Nama Pendek / Panggilan *
                          </label>
                          <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            placeholder="Contoh: Saka"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.nickname
                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                            }`}
                          />
                          {errors.nickname && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {errors.nickname}
                            </p>
                          )}
                        </div>

                        {/* Parents Name */}
                        <div>
                          <label htmlFor="parentsName" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Nama Kedua Orang Tua Anak *
                          </label>
                          <input
                            type="text"
                            id="parentsName"
                            name="parentsName"
                            placeholder="Contoh penulisan: Bapak Rahmat S. Kom dan Ibu Sinta"
                            value={formData.parentsName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.parentsName
                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                            }`}
                          />
                          {errors.parentsName && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {errors.parentsName}
                            </p>
                          )}
                        </div>

                        {/* Child Order */}
                        <div>
                          <label htmlFor="childOrder" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Anak ke- ?
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <select
                              name="childGender"
                              value={formData.childGender}
                              onChange={handleInputChange}
                              className="w-full sm:w-1/3 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                            >
                              <option value="Putra">Putra</option>
                              <option value="Putri">Putri</option>
                            </select>
                            <input
                              type="text"
                              id="childOrder"
                              name="childOrder"
                              placeholder="Contoh: Pertama (1) atau Kedua dari tiga bersaudara"
                              value={formData.childOrder}
                              onChange={handleInputChange}
                              className="w-full sm:w-2/3 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Event Date */}
                          <div>
                            <label htmlFor="eventDate" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              {activeTab === "Khitan" ? "Tanggal Acara *" : "Tanggal Acara Ulang Tahun *"}
                            </label>
                            <input
                              type="date"
                              id="eventDate"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.eventDate
                                  ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                  : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                              }`}
                            />
                            {errors.eventDate && (
                              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.eventDate}
                              </p>
                            )}
                          </div>

                          {/* Event Time */}
                          <div>
                            <label htmlFor="eventTime" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              Waktu Acara *
                            </label>
                            <input
                              type="time"
                              id="eventTime"
                              name="eventTime"
                              value={formData.eventTime}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.eventTime
                                  ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                  : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                              }`}
                            />
                            {errors.eventTime && (
                              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.eventTime}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Event Location */}
                        <div>
                          <label htmlFor="eventLocation" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Tempat Acara *
                          </label>
                          <textarea
                            id="eventLocation"
                            name="eventLocation"
                            rows={3}
                            placeholder={activeTab === "Khitan" ? "Contoh: Aula Serbaguna Masjid Raya Al-Hikmah, Jl. Soekarno-Hatta No. 123" : "Contoh: Jl. Sersan Bajuri No. 99"}
                            value={formData.eventLocation}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.eventLocation
                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-400"
                                : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                            }`}
                          />
                          {errors.eventLocation && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {errors.eventLocation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: DATA TAMBAHAN */}
                {currentStep === 3 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">
                          {activeTab === "Wedding" ? `Bagian 3: Perjalanan Cinta & Foto Undangan` : "Bagian 3: Data Tambahan (Opsional)"}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {activeTab === "Wedding" 
                            ? `Isi kisah perjalanan cinta & unggah foto untuk tema ${formData.theme}`
                            : "Informasi opsional berupa activities & highlights dan pihak yang turut mengundang"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Schedule (Activities & Highlights) */}
                      {activeTab === "Wedding" ? (
                        /* OUR STORY / PERJALANAN CINTA TIMELINE UNTUK WEDDING 1 */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                              💕 Our Story (Perjalanan Cinta Pasangan)
                            </label>
                            <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">Tampil di {formData.theme}</span>
                          </div>
                          
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Formulir ini khusus untuk section <strong>Our Story</strong> di tema {formData.theme}. Anda dapat menyesuaikan tahun, judul momen, dan cerita singkat kenangan Anda:
                          </p>

                          <div className="space-y-3">
                            {formData.loveStoryList.map((story, index) => (
                              <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">
                                    📌 Momen Cerita {index + 1}
                                  </span>
                                  {formData.loveStoryList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeLoveStoryItem(index)}
                                      className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                      title="Hapus Momen"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                
                                <div className={`grid ${(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"} gap-2.5`}>
                                  {(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") && (
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tahun</label>
                                      <input
                                        type="text"
                                        value={story.year}
                                        onChange={(e) => handleLoveStoryChange(index, "year", e.target.value)}
                                        placeholder="Contoh: 2021"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                      />
                                    </div>
                                  )}
                                  <div className={(formData.theme === "Wedding 1" || formData.theme === "Wedding 5") ? "sm:col-span-2" : ""}>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul Momen</label>
                                    <input
                                      type="text"
                                      value={story.title}
                                      onChange={(e) => handleLoveStoryChange(index, "title", e.target.value)}
                                      placeholder="Contoh: Awal Bertemu"
                                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cerita / Deskripsi Singkat</label>
                                  <textarea
                                    rows={2}
                                    value={story.description}
                                    onChange={(e) => handleLoveStoryChange(index, "description", e.target.value)}
                                    placeholder="Deskripsi cerita kenangan..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {formData.loveStoryList.length < 10 && (
                            <button
                              type="button"
                              onClick={addLoveStoryItem}
                              className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-rose-200 text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Tambah Momen Cerita
                            </button>
                          )}

                          <div className="mt-6 pt-6 border-t border-slate-200">
                            <label htmlFor="youtubeVideo" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-primary" /> Video Prewedding (YouTube) <span className="text-[10px] text-slate-400 font-normal normal-case ml-1">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              id="youtubeVideo"
                              name="youtubeVideo"
                              placeholder="Contoh: https://youtube.com/watch?v=..."
                              value={formData.youtubeVideo || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200/80 bg-white/50 text-slate-800 font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-slate-400 placeholder:font-medium"
                            />
                            <p className="text-[11px] text-slate-500 mt-2">
                              Tautkan video prewedding YouTube Anda. Jika dibiarkan kosong, bagian video tidak akan ditampilkan di undangan.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* ACTIVITIES & HIGHLIGHTS DAN TURUT MENGUNDANG UNTUK KHITAN / AQIQAH / BIRTHDAY */
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              🎨 Activities & Highlights
                            </label>
                            
                            {formData.scheduleList.map((item, index) => (
                               <div key={index} className="flex gap-2 mb-2 items-center">
                                  <input
                                    type="time"
                                    value={item.time}
                                    onChange={(e) => handleScheduleListChange(index, "time", e.target.value)}
                                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-[110px]"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Keterangan acara (Cth: Sambutan)"
                                    value={item.description}
                                    onChange={(e) => handleScheduleListChange(index, "description", e.target.value)}
                                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                  />
                                  {formData.scheduleList.length > 1 && (
                                    <button type="button" onClick={() => removeScheduleItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                               </div>
                            ))}
                            
                            <button type="button" onClick={addScheduleItem} className="mt-2 text-xs font-bold text-primary flex items-center gap-1 hover:bg-primary/5 py-1.5 px-3 rounded-lg border border-primary/20 transition-colors">
                              <Plus className="w-3 h-3" /> Tambah Aktivitas
                            </button>

                            <p className="text-[11px] text-slate-500 mt-2">
                              Tuliskan aktivitas hiburan, sorotan acara, atau susunan acara lainnya yang ingin ditampilkan di bagian 🎨 Activities & Highlights.
                            </p>
                          </div>

                          <div>
                            <label htmlFor="invitedGuests" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              Turut Mengundang (Jika ada)
                            </label>
                            <textarea
                              id="invitedGuests"
                              name="invitedGuests"
                              rows={5}
                              placeholder={activeTab === "Khitan" 
                                ? "Contoh:\n- Keluarga Besar Kakek H. Rahmat\n- Paman Budi & Bibi Sinta\n- Rekan Kerja Bapak" 
                                : activeTab === "Aqiqah"
                                ? "Contoh:\n- Keluarga Besar Bapak H. Ahmad\n- Rekan Kerja Ayah & Ibu\n- Tetangga RT 01"
                                : "Contoh Pengisian :\n1. Keluarga Besar Bapak H. Sutisno & Ibu Hj. Maemunah\n2. Keluarga Besar Uwa Odeng & Uwa Noneng\n3. Alumni SMA 1 Bandung\n4. Dll ....."}
                              value={formData.invitedGuests}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              Daftar nama keluarga atau kerabat yang turut mengundang. Pisahkan dengan tanda koma (,) atau buat baris baru.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Photo Uploads Section */}
                      <div className="border-t border-slate-100 pt-5 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            📁 Berkas Foto Undangan (Opsional & Terpandu)
                          </h4>
                          {activeTab === "Wedding" && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase">
                              Panduan Foto {formData.theme}
                            </span>
                          )}
                        </div>

                        {activeTab === "Wedding" ? (
                          /* PANDUAN VISUAL FOTO UNTUK WEDDING 1 */
                          <div className="space-y-6">
                            {/* FOTO A — 1 foto untuk Cover Lockscreen saja */}
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                                  {formData.theme === "Wedding 2" 
                                    ? "📌 Foto A: Cover Sampul Depan & Background" 
                                    : formData.theme === "Wedding 4"
                                    ? "📌 Foto A: Cover Sampul Depan (halaman pertama foto dalam bingkai)"
                                    : "📌 Foto A: Cover Sampul Depan"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">1 Foto · Portrait (9:16)</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {formData.theme === "Wedding 2" 
                                  ? <>Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol &quot;Buka Undangan&quot;), dan <strong>juga digunakan sebagai background statis</strong> di seluruh halaman undangan.</>
                                  : <>Foto ini tampil saat pertama kali tamu membuka link undangan (sebelum klik tombol &quot;Buka Undangan&quot;). Hanya <strong>1 foto</strong> — bukan background slideshow.</>}
                              </p>
                              
                              <div className="flex items-center gap-4 pt-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoCoverUpload}
                                  className="hidden"
                                  id="photo-cover-input"
                                  disabled={photoCoverLoading}
                                />
                                <label
                                  htmlFor="photo-cover-input"
                                  className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                                >
                                  <Camera className="w-4 h-4" /> {photoCoverLoading ? "Mengompres..." : "Pilih Foto A (Cover Lockscreen)"}
                                </label>

                                {photoCoverBase64 && (
                                  <div className="relative w-14 h-20 rounded-xl overflow-hidden border border-slate-300 shadow-md group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={photoCoverBase64} alt="Foto A Cover Preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setPhotoCoverBase64("")}
                                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-md"
                                      title="Hapus foto A"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {(formData.theme !== "Wedding 1" && formData.theme !== "Wedding 4" && formData.theme !== "Wedding 5" && formData.theme !== "Wedding 6" && formData.theme !== "Wedding 7") && (<>
                            {/* FOTO OUR STORY */}
                            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide inline-block">
                                📖 Foto Our Story
                              </span>
                              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                Unggah foto untuk bagian cerita cinta Anda (Love Story).
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 pt-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoStoryUpload}
                                  className="hidden"
                                  id="photo-story-input"
                                  disabled={photoStoryLoading}
                                />
                                <label
                                  htmlFor="photo-story-input"
                                  className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                                >
                                  <Camera className="w-4 h-4" /> {photoStoryLoading ? "Mengompres..." : "Pilih Foto Our Story"}
                                </label>

                                {photoStoryBase64 && (
                                  <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-300 shadow-md group">
                                    <img src={photoStoryBase64} alt="Foto Our Story Preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setPhotoStoryBase64("")}
                                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-md"
                                      title="Hapus foto Our Story"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            </>)}

                            {/* FOTO PROFIL MEMPELAI (PRIA & WANITA) */}
                            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-4">
                              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide inline-block">
                                👤 Foto Profil Kedua Mempelai (Opsional)
                              </span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Profil Pria */}
                                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                                  <span className="text-[11px] font-bold text-slate-700 block">Foto Profil Pria</span>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoGroomUpload}
                                      className="hidden"
                                      id="photo-groom-input"
                                      disabled={photoGroomLoading}
                                    />
                                    <label
                                      htmlFor="photo-groom-input"
                                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                                    >
                                      <Camera className="w-3.5 h-3.5" /> {photoGroomLoading ? "..." : "Upload Pria"}
                                    </label>
                                    {photoGroomBase64 && (
                                      <div className="relative w-10 h-12 rounded-lg overflow-hidden border border-slate-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photoGroomBase64} alt="Groom Preview" className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => setPhotoGroomBase64("")}
                                          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Profil Wanita */}
                                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                                  <span className="text-[11px] font-bold text-slate-700 block">Foto Profil Wanita</span>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoBrideUpload}
                                      className="hidden"
                                      id="photo-bride-input"
                                      disabled={photoBrideLoading}
                                    />
                                    <label
                                      htmlFor="photo-bride-input"
                                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                                    >
                                      <Camera className="w-3.5 h-3.5" /> {photoBrideLoading ? "..." : "Upload Wanita"}
                                    </label>
                                    {photoBrideBase64 && (
                                      <div className="relative w-10 h-12 rounded-lg overflow-hidden border border-slate-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photoBrideBase64} alt="Bride Preview" className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => setPhotoBrideBase64("")}
                                          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            
                        {/* PENGATURAN BACKGROUND KHUSUS (TEMA PREMIUM) */}
                        {/* PENGATURAN BACKGROUND KHUSUS (TEMA PREMIUM) */}
                        {(formData.theme === "Wedding 6") && (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/60 shadow-sm space-y-6 mt-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-amber-200/50">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Camera className="w-4 h-4" />
                              </div>
                              <h3 className="font-bold text-amber-900">Pengaturan Background Tambahan</h3>
                            </div>
                            
                            <p className="text-xs text-amber-800 leading-relaxed font-medium">
                              Khusus tema yang membutuhkan banyak gambar latar (seperti Wedding 6). Silakan unggah foto untuk masing-masing seksi di bawah ini. Jika dibiarkan kosong, sistem akan otomatis menggunakan Foto A sebagai pengganti.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                              {/* Background Quote */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  1. Background Ayat / Kutipan
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang pada bagian kutipan ayat suci.</p>
                                {quoteBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={quoteBgBase64} alt="Quote Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setQuoteBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setQuoteBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              
                              {/* Foto Center Love Story */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  Foto Tengah Kisah Cinta / A Peak of Love
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai foto utama di tengah linimasa kisah cinta (khusus Wedding 6).</p>
                                {ourStoryPhotoBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 w-1/2 mx-auto">
                                    <img src={ourStoryPhotoBase64} alt="Our Story Photo" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setOurStoryPhotoBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOurStoryPhotoBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>


                              {/* Background Love Story */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  2. Background Kisah Cinta / Love Story
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang pada awal bagian linimasa kisah cinta.</p>
                                {loveStoryBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={loveStoryBgBase64} alt="Love Story Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setLoveStoryBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLoveStoryBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Save The Date */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  3. Background Save The Date
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang bagian Save The Date.</p>
                                {saveTheDateBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={saveTheDateBgBase64} alt="Save The Date Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setSaveTheDateBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSaveTheDateBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Event */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  4. Background Detail Acara / Event
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan di belakang teks jadwal Akad & Resepsi.</p>
                                {eventBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={eventBgBase64} alt="Event Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setEventBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEventBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Dresscode */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  5. Background Panduan Pakaian / Dresscode
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar untuk seksi "A Guide to Attire" (Dresscode).</p>
                                {dresscodeBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={dresscodeBgBase64} alt="Dresscode Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setDresscodeBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setDresscodeBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Our Moment */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  6. Background Our Moment / Gallery
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Latar belakang untuk membingkai foto-foto galeri Anda.</p>
                                {ourMomentBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={ourMomentBgBase64} alt="Our Moment Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setOurMomentBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOurMomentBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Gift */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  7. Background Buku Tamu / Gift
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan di belakang seksi pengiriman ucapan dan dompet digital.</p>
                                {giftBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={giftBgBase64} alt="Gift Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setGiftBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setGiftBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background RSVP */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  8. Background RSVP
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar form konfirmasi kehadiran.</p>
                                {rsvpBgBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={rsvpBgBase64} alt="RSVP Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setRsvpBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setRsvpBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>

                              {/* Background Closing */}
                              <div className="space-y-2 bg-white p-4 rounded-2xl border border-amber-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                  9. Background Penutup
                                </label>
                                <p className="text-[10px] text-slate-400 pb-2">Ditampilkan sebagai latar belakang halaman penutup.</p>
                                {photoClosingBase64 ? (
                                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                                    <img src={photoClosingBase64} alt="Closing Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setPhotoClosingBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setPhotoClosingBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* FOTO HALAMAN PENUTUP (KHUSUS WEDDING 3) */}
                            {formData.theme === "Wedding 3" && (
                              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide inline-block">
                                  🖼️ Foto Halaman Penutup
                                </span>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                  Unggah 1 foto untuk latar belakang bagian penutup / ucapan terima kasih.
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoClosingUpload}
                                    className="hidden"
                                    id="photo-closing-input"
                                    disabled={photoClosingLoading}
                                  />
                                  <label
                                    htmlFor="photo-closing-input"
                                    className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                                  >
                                    <Camera className="w-4 h-4" /> {photoClosingLoading ? "Mengompres..." : "Pilih Foto Penutup"}
                                  </label>

                                  {photoClosingBase64 && (
                                    <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-300 shadow-md group">
                                      <img src={photoClosingBase64} alt="Foto Closing Preview" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => setPhotoClosingBase64("")}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-md"
                                        title="Hapus foto closing"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}


                            {/* FOTO C — Background Slideshow yang berubah-ubah */}
                            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                                  {(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") ? "🎞️ Foto C: Galeri Foto & background Undangan slideshow" : (formData.theme === "Wedding 7" ? "🎞️ Foto B: Galeri Foto" : "🎞️ Foto C: Galeri Foto")}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-black bg-emerald-100 px-2 py-0.5 rounded-full">Bisa banyak foto · Maks 10</span>
                              </div>
                              <div className="bg-emerald-100/70 rounded-xl p-3 border border-emerald-200">
                                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                                  {(formData.theme === "Wedding 1" || formData.theme === "Wedding 4" || formData.theme === "Wedding 5") 
                                    ? <>Unggah foto-foto prewedding Anda di sini. Foto-foto ini akan ditampilkan di galeri undangan. dan akan dijadika background slideshow</>
                                    : <>Unggah foto-foto prewedding Anda di sini. Khusus Wedding 7, foto pertama dari galeri ini akan menjadi foto utama (highlight).</>
                                  }
                                </p>
                              </div>

                              <div className="space-y-3 pt-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleGalleryUpload}
                                  className="hidden"
                                  id="gallery-upload-input"
                                  disabled={galleryLoading}
                                />
                                <label
                                  htmlFor="gallery-upload-input"
                                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                                >
                                  <Plus className="w-4 h-4" /> {galleryLoading ? "Mengompres..." : "Pilih Foto C (Galeri Album)"}
                                </label>
                                
                                {galleryBase64.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {galleryBase64.map((img, idx) => (
                                      <div key={idx} className="relative w-14 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Gallery Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...galleryBase64];
                                            updated.splice(idx, 1);
                                            setGalleryBase64(updated);
                                          }}
                                          className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* GENERAL GALLERY INPUT FOR KHITAN / AQIQAH / BIRTHDAY */
                          <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                              Galeri Foto (Bisa pilih banyak gambar sekaligus, maksimal 10 foto)
                            </label>
                            <div className="space-y-3">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryUpload}
                                className="hidden"
                                id="gallery-upload-input"
                                disabled={galleryLoading}
                              />
                              <label
                                htmlFor="gallery-upload-input"
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1.5"
                              >
                                <Plus className="w-4 h-4" /> {galleryLoading ? "Mengompres..." : "Pilih Galeri Foto"}
                              </label>
                              
                              {galleryBase64.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {galleryBase64.map((img, idx) => (
                                    <div key={idx} className="relative w-12 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={img} alt={`Gallery Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...galleryBase64];
                                          updated.splice(idx, 1);
                                          setGalleryBase64(updated);
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
                      )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: FITUR PRO */}
                {currentStep === 4 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Bagian 4: Fitur Professional</h3>
                        <p className="text-xs text-slate-400">Informasi nomor rekening amplop digital, kirim kado, dan galeri berkas</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Bank Account / E-Wallet (Up to 2 Accounts) */}
                      <div className="space-y-4">
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                          No. Rekening Amplop Digital (Maksimal 2, Opsional)
                        </label>
                        
                        {formData.bankAccounts.map((acc, index) => (
                          <div key={index} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest block">
                              💳 Rekening Penerima {index + 1}
                            </span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Nama Bank / E-Wallet
                                </label>
                                <input
                                  type="text"
                                  placeholder="Contoh: BCA, OVO, Mandiri"
                                  value={acc.bankName}
                                  onChange={(e) => handleBankAccountChange(index, "bankName", e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  No. Rekening / No. HP
                                </label>
                                <input
                                  type="text"
                                  placeholder="Masukkan nomor rekening..."
                                  value={acc.accountNumber}
                                  onChange={(e) => handleBankAccountChange(index, "accountNumber", e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Nama Pemilik Rekening
                                </label>
                                <input
                                  type="text"
                                  placeholder="Masukkan nama penerima..."
                                  value={acc.recipientName}
                                  onChange={(e) => handleBankAccountChange(index, "recipientName", e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <p className="text-[11px] text-slate-500 mt-1">
                          Masukkan informasi nomor rekening yang akan dicantumkan sebagai penerima Amplop Digital dari tamu undangan (maksimal 2 rekening berbeda). Abaikan jika tidak ingin mengaktifkan fitur ini.
                        </p>
                      </div>

                      {/* Gift Address — Tersembunyi untuk Wedding (tidak ada di tema Wedding 1) */}
                      {activeTab !== "Wedding" && (
                      <div>
                        <label htmlFor="giftAddress" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Alamat Penerima Kado (Opsional)
                        </label>
                        <textarea
                          id="giftAddress"
                          name="giftAddress"
                          rows={4}
                          placeholder="Contoh : Bapak Rahmat S. Kom/ Ibu Sinta: Jl. Sersan Bajuri No. 99, RT 002 RW 003 No 30, Isola, Kec. Sukasari, Kota Bandung"
                          value={formData.giftAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <p className="text-[11px] text-slate-500 mt-1 whitespace-pre-line">
                          Alamat ini adalah alamat yang akan Kami cantumkan sebagai alamat penerima kado dari tamu undangan.

                          Abaikan jika Anda tidak ingin menggunakan fitur ini.
                        </p>
                      </div>
                      )}

                      {/* Galeri Info */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Galeri Foto dan Video
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Berkas foto &amp; video dapat dikirim melalui WhatsApp admin Kami. Foto &amp; video yang dikirim dianggap sudah final untuk kami gunakan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
                  {currentStep > 1 ? (
                    <button
                      key="btn-prev"
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      key="btn-next"
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      Lanjut <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      key="btn-submit"
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>Mengirim...</>
                      ) : (
                        <>
                          Kirim ke WhatsApp <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Bintarti Logo" width={32} height={32} className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain" />
            <span className="text-white font-bold tracking-wide font-accent">Bintarti Undangan Digital</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Bintarti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
