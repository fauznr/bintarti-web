"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../../utils/supabase";
import * as htmlToImage from "html-to-image";

const BoundingBoxOverlay = ({ 
  designerOpen, 
  selectedElement, 
  layoutConfig,
  setLayoutConfig,
  onDragEnd
}: { 
  designerOpen: boolean; 
  selectedElement: any;
  layoutConfig: any;
  setLayoutConfig: React.Dispatch<React.SetStateAction<any>>;
  onDragEnd?: () => void;
}) => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    if (!designerOpen || !selectedElement) {
      setRect(null);
      return;
    }
    const updateRect = () => {
      const el = document.getElementById(`el-${selectedElement.section}-${selectedElement.key}`);
      if (el) {
        setRect(el.getBoundingClientRect());
      }
    };
    updateRect();
    const interval = setInterval(updateRect, 30);
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [designerOpen, selectedElement]);

  const handleResize = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    
    const sec = selectedElement.section;
    const key = selectedElement.key;
    const type = selectedElement.type;
    const conf = layoutConfig[sec];
    
    let startVal = 1;
    let propName = 'fontScale';

    if (type === 'custom') {
       const customEl = (conf.customElements || []).find((c: any) => c.id === key);
       if (dir === 'w' || dir === 'e') {
           propName = 'width';
           startVal = customEl?.width || 100;
       } else {
           propName = 'fontSize';
           startVal = customEl?.fontSize || 14;
       }
    } else {
       if (key === 'header') propName = 'headerFontScale';
       else if (key === 'badge') propName = 'badgeFontScale';
       else if (key === 'body') propName = 'bodyFontScale';
       else if (key === 'bottom') propName = 'bottomFontScale';
       else if (key === 'avatar') propName = 'avatarScale';
       else if (key === 'parents') propName = 'parentsFontScale';

       if (dir === 'w' || dir === 'e') {
          propName = key === 'avatar' ? 'width' : `${key}Width`;
          startVal = conf?.[propName] || 100;
       } else {
          startVal = conf?.[propName] !== undefined ? conf[propName] : 1;
       }
    }

    const onMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - startX;
      const dy = moveEv.clientY - startY;
      
      let delta = 0;
      if (dir === 'se') delta = Math.max(dx, dy) * 0.01;
      else if (dir === 'sw') delta = Math.max(-dx, dy) * 0.01;
      else if (dir === 'ne') delta = Math.max(dx, -dy) * 0.01;
      else if (dir === 'nw') delta = Math.max(-dx, -dy) * 0.01;
      else if (dir === 'e') delta = dx * 0.5;
      else if (dir === 'w') delta = -dx * 0.5;

      const newConf = { ...layoutConfig[sec] };
      
      if (type === 'custom') {
         if (dir === 'se' || dir === 'sw' || dir === 'ne' || dir === 'nw') delta *= 50; // faster scaling for fontSize px
         let finalVal = startVal + delta;
         finalVal = Math.max(8, finalVal);
         
         const updatedCustoms = [...(newConf.customElements || [])];
         const idx = updatedCustoms.findIndex((c: any) => c.id === key);
         if (idx > -1) {
            updatedCustoms[idx] = { ...updatedCustoms[idx], [propName]: finalVal };
            newConf.customElements = updatedCustoms;
         }
      } else {
         let finalVal = startVal + delta;
         if (!propName.endsWith('Width') && propName !== 'width') {
            if (key === 'avatar') finalVal = Math.max(10, finalVal);
            else finalVal = Math.max(0.1, finalVal);
         } else {
            finalVal = Math.max(10, finalVal);
         }
         newConf[propName] = finalVal;
      }
      
      setLayoutConfig((prev: any) => ({ ...prev, [sec]: newConf }));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (onDragEnd) onDragEnd();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  if (!rect || !designerOpen || !selectedElement) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: 'none',
        zIndex: 9999,
        border: '1.5px solid #9333ea',
      }}
    >
       <div 
         style={{ position: 'absolute', top: -6, left: -6, width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'nwse-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'nw')}
       />
       <div 
         style={{ position: 'absolute', top: -6, right: -6, width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'nesw-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'ne')}
       />
       <div 
         style={{ position: 'absolute', bottom: -6, left: -6, width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'nesw-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'sw')}
       />
       <div 
         style={{ position: 'absolute', bottom: -6, right: -6, width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'nwse-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'se')}
       />
       <div 
         style={{ position: 'absolute', top: '50%', left: -5, width: 10, height: 24, transform: 'translateY(-50%)', borderRadius: 4, backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'ew-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'w')}
       />
       <div 
         style={{ position: 'absolute', top: '50%', right: -5, width: 10, height: 24, transform: 'translateY(-50%)', borderRadius: 4, backgroundColor: 'white', border: '1.5px solid #9333ea', pointerEvents: 'auto', cursor: 'ew-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
         onPointerDown={(e) => handleResize(e, 'e')}
       />
    </div>
  );
};

import { ArrowLeft, 
  MapPin, 
  VolumeX, 
  Sparkles, 
  X,
  Send,
  PartyPopper,
  Settings,
  RefreshCw,
  Copy,
  Heart,
  Calendar,
  Image as LucideImage,
  MessageSquare,
  Gift,
  Loader2,
  Save,
  Plus,
  Trash2, Smartphone, Monitor, Eye, EyeOff, QrCode, Upload, Disc3, Play, Pause, Music, FolderOpen, Undo2, Redo2 } from "lucide-react";

// Mock comment presets

const INITIAL_MOCK_COMMENTS_BIRTHDAY = [
  { id: 1, name: "Tante Sarah & Om Dimas", comment: "Happy Birthday Kanaya Almirha sayang! Semoga panjang umur, sehat selalu, tambah pintar, dan jadi kebanggaan Ayah dan Ibu yaa. Kado cantiknya nyusul pas hari H yaa! 🎂🎉", rsvp_status: "Hadir", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, name: "Kakak Rian Hidayat", comment: "Selamat ulang tahun Kanaya yang ke-5! Seru banget ada Magic Bubble Show, gak sabar mau dateng dan main bareng temen-temen. HBD yaa! 🥳🎈", rsvp_status: "Hadir", created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 3, name: "Tante Fatimah", comment: "Barakallah fii umrik anak sholehah Kanaya. Semoga tumbuh sehat dan cerdas ya nak. Maaf Tante belum bisa hadir karena di luar kota, tapi doa terbaik selalu mengiringi Kanaya. Hugs! ❤️", rsvp_status: "Tidak Hadir", created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
];

const INITIAL_MOCK_COMMENTS_KHITAN = [
  { id: 1, name: "Om Hermawan & Tante Dewi", comment: "Selamat atas khitanannya Saka Niskala ganteng! Semoga setelah dikhitan tumbuh menjadi anak yang sholeh, berbakti kepada orang tua, berguna bagi nusa, bangsa, dan agama. Aamiin. 🤲✨", rsvp_status: "Hadir", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, name: "Uwak Syamsudin", comment: "Alhamdulillah, selamat atas walimatul khitan untuk ananda Saka. Semoga lekas sembuh dan tumbuh menjadi anak yang cerdas serta tangguh. Selamat ya buat kedua orang tuanya juga. 🎉😊", rsvp_status: "Hadir", created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 3, name: "Tante Fitriani", comment: "Selamat khitanan Saka sayang. Semoga kelak menjadi anak sholeh penyejuk hati orang tua. Maaf tante belum bisa hadir langsung karena masih di luar kota, doa terbaik untuk Saka sekeluarga. ❤️", rsvp_status: "Tidak Hadir", created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
];

const parseGDriveUrl = (url: string) => {
  if (!url) return "";
  const match = url.match(/[-\w]{25,}/);
  if (match) {
    return `/api/proxy-audio?id=${match[0]}`;
  }
  return url;
};

const DEFAULT_MUSIC_CATALOG = [
  { label: "-- Pilih Lagu dari Katalog --", url: "" },
  { label: "Gunakan Link Sendiri (Custom)", url: "custom" }
];

interface CustomElementConfig {
  id: string;
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  width?: number;
  transformX?: number;
  transformY?: number;
}

interface OrnamentConfig {
  id: string;
  url: string;
  transformX: number;
  transformY: number;
  scale: number;
  flipHorizontal?: boolean;
  animation?: 'none' | 'float' | 'spin' | 'pulse';
}

interface CardConfig {
  hidden?: boolean;
  bgSizeWidth: number;
  bgSizeHeight: number;
  bgPosX: number; // 0 to 100%
  bgPosY: number; // 0 to 100%
  left: number;
  right: number;
  top: number;
  bottom: number;
  fontScale: number;
  bgUrl?: string;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  fontFamily?: string;
  fontColor?: string;
  lineHeight?: number;
  customText?: string;
  headerFontFamily?: string;
  headerFontColor?: string;
  headerFontScale?: number;
  headerText?: string;
  bodyFontFamily?: string;
  bodyFontColor?: string;
  bodyFontScale?: number;
  bodyText?: string;
  bottomText?: string;
  bottomFontFamily?: string;
  bottomFontColor?: string;
  bottomFontScale?: number;
  buttonScale?: number;
  countdownScale?: number;
  customElements?: CustomElementConfig[];
  hideHeader?: boolean;
  hideBody?: boolean;
  hideBottom?: boolean;
  elementOrder?: string[];
  badgeText?: string;
  badgeFontFamily?: string;
  badgeFontColor?: string;
  badgeFontScale?: number;
  hideBadge?: boolean;
  parentsText?: string;
  parentsFontFamily?: string;
  parentsFontColor?: string;
  parentsFontScale?: number;
  ornaments?: OrnamentConfig[];
  [key: string]: any;
}

interface ThemeConfig {
  cover: CardConfig;
  profile: CardConfig;
  turut: CardConfig;
  event: CardConfig;
  maps: CardConfig;
  activities: CardConfig;
  gallery: CardConfig;
  rsvp: CardConfig;
  envelope: CardConfig;
  checkin: CardConfig;
  closing: CardConfig;
  global?: any;
}

const DEFAULT_CONFIG_THEME_KHITAN_1: ThemeConfig = {
  cover: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 25,
    bottom: 25,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  profile: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 20,
    fontScale: 1,
    avatarScale: 110,
    headerFontFamily: "Karla",
    bodyFontFamily: "Karla"
  },
  turut: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  event: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 15,
    fontScale: 1.1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  maps: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  activities: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  gallery: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  rsvp: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 25,
    bottom: 15,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla",
    lineHeight: 1.5
  },
  envelope: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 15,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  checkin: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontScale: 1,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  },
  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 15,
    fontScale: 1,
    avatarScale: 110,
    headerFontFamily: "Rolleston",
    bodyFontFamily: "Karla"
  }
};

const DEFAULT_CONFIG_THEME_KHITAN_2: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing }
};

const DEFAULT_CONFIG_THEME_KHITAN_3: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing }
};

const DEFAULT_CONFIG_THEME_KHITAN_4: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover, headerFontFamily: "Atma" },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile, headerFontFamily: "Atma" },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut, headerFontFamily: "Atma" },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event, headerFontFamily: "Atma" },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps, headerFontFamily: "Atma" },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities, headerFontFamily: "Atma" },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery, headerFontFamily: "Atma" },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp, headerFontFamily: "Atma" },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope, headerFontFamily: "Atma" },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin, headerFontFamily: "Atma" },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing, headerFontFamily: "Atma" }
};

const DEFAULT_CONFIG_THEME_KHITAN_5: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover, headerFontFamily: "Bungee" },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile, headerFontFamily: "Bungee" },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut, headerFontFamily: "Bungee" },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event, headerFontFamily: "Bungee" },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps, headerFontFamily: "Bungee" },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities, headerFontFamily: "Bungee" },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery, headerFontFamily: "Bungee" },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp, headerFontFamily: "Bungee" },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope, headerFontFamily: "Bungee" },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin, headerFontFamily: "Bungee" },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing, headerFontFamily: "Bungee" }
};

const DEFAULT_CONFIG_THEME_KHITAN_6: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" }
};

const DEFAULT_CONFIG_THEME_KHITAN_7: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin, headerFontFamily: "Atma", bodyFontFamily: "Atma" },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing, headerFontFamily: "Atma", bodyFontFamily: "Atma" }
};

const DEFAULT_CONFIG_THEME_KHITAN_8: ThemeConfig = {
  cover: { ...DEFAULT_CONFIG_THEME_KHITAN_1.cover, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  profile: { ...DEFAULT_CONFIG_THEME_KHITAN_1.profile, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  turut: { ...DEFAULT_CONFIG_THEME_KHITAN_1.turut, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  event: { ...DEFAULT_CONFIG_THEME_KHITAN_1.event, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  maps: { ...DEFAULT_CONFIG_THEME_KHITAN_1.maps, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  activities: { ...DEFAULT_CONFIG_THEME_KHITAN_1.activities, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  gallery: { ...DEFAULT_CONFIG_THEME_KHITAN_1.gallery, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  rsvp: { ...DEFAULT_CONFIG_THEME_KHITAN_1.rsvp, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  envelope: { ...DEFAULT_CONFIG_THEME_KHITAN_1.envelope, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  checkin: { ...DEFAULT_CONFIG_THEME_KHITAN_1.checkin, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" },
  closing: { ...DEFAULT_CONFIG_THEME_KHITAN_1.closing, headerFontFamily: "ArefRuqaa", bodyFontFamily: "ArefRuqaa" }
};

const DEFAULT_CONFIG_THEME_1: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_2: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_3: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_4: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_5: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_6: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_7: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};

const DEFAULT_CONFIG_THEME_8: ThemeConfig = {
  "cover": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 25,
    "fontScale": 1,
    "bgSizeWidth": 125,
    "bgSizeHeight": 100,
    "bodyFontScale": 0.8,
    "bodyMarginTop": 12,
    "badgeFontScale": 0.7,
    "badgeMarginTop": 50,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -3,
    "bodyTransformY": -155,
    "badgePaddingTop": 5,
    "bottomFontScale": 1.05,
    "headerMarginTop": 69,
    "badgePaddingLeft": 10,
    "bodyMarginBottom": -61,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 1,
    "bottomTransformY": 0,
    "headerTransformX": 2,
    "headerTransformY": -23,
    "badgeMarginBottom": 0,
    "badgePaddingRight": 10,
    "badgePaddingBottom": 5,
    "headerMarginBottom": 31
  },
  "profile": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 52,
    "bgPosY": 49,
    "bottom": 20,
    "avatarX": 3,
    "avatarY": -90,
    "fontScale": 1,
    "avatarScale": 130,
    "bgSizeWidth": 134,
    "bgSizeHeight": 100,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 2.4,
    "badgeFontScale": 1.2,
    "bodyTransformX": 4,
    "bodyTransformY": -91,
    "headerFontScale": 0.8,
    "bodyMarginBottom": 10,
    "bottomFontFamily": "Averia",
    "bottomTransformX": 4,
    "bottomTransformY": -86,
    "headerPaddingTop": 5,
    "headerTransformX": 2,
    "headerTransformY": -104,
    "headerPaddingLeft": 5,
    "badgePaddingBottom": 19,
    "bodyAnimationClass": "animate-pulse",
    "headerMarginBottom": 0,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5
  },
  "turut": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyTransformX": 2,
    "bodyTransformY": -215,
    "headerTransformX": 1,
    "headerTransformY": -211,
    "headerPaddingBottom": 15,
    "headerAnimationClass": "animate-pulse"
  },
  "event": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1.1,
    "bgSizeWidth": 128,
    "bgSizeHeight": 101,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "bodyTransformX": -1,
    "bodyTransformY": -14,
    "countdownScale": 1.15,
    "bottomFontScale": 0.95,
    "headerFontColor": "#e81e61",
    "headerFontScale": 2.35,
    "bottomFontFamily": "Averia",
    "bottomPaddingTop": 5,
    "bottomTransformX": -5,
    "bottomTransformY": -171,
    "buttonTransformX": 0,
    "buttonTransformY": 118,
    "headerTransformX": -2,
    "headerTransformY": -8,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 8,
    "locationTransformX": -3,
    "locationTransformY": 86,
    "bottomPaddingBottom": 5,
    "countdownTransformX": -5,
    "countdownTransformY": 89,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "maps": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 109,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.45,
    "bodyPaddingTop": 9,
    "bodyTransformX": 0,
    "bodyTransformY": -1,
    "bottomFontColor": "#000000",
    "bottomFontScale": 0.8,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -16,
    "bottomTransformY": 1,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 9,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "activities": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 44,
    "bgPosY": 50,
    "bottom": 10,
    "avatarX": -2,
    "avatarY": -1,
    "fontScale": 1,
    "bgSizeWidth": 132,
    "bottomWidth": 102,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyFontScale": 1.35,
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.85,
    "headerFontScale": 0.8,
    "bottomTransformX": 3,
    "bottomTransformY": 3,
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 10,
    "headerPaddingLeft": 9,
    "bodyAnimationClass": "animate-pulse",
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "gallery": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 100,
    "bgSizeHeight": 100,
    "headerFontColor": "#e81e61",
    "headerMarginTop": 0,
    "bodyPaddingBottom": 5,
    "headerMarginBottom": 0,
    "headerPaddingBottom": 10,
    "headerAnimationClass": "animate-pulse"
  },
  "rsvp": {
    "top": 25,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 15,
    "fontScale": 1,
    "lineHeight": 1.5,
    "bgSizeWidth": 135,
    "bgSizeHeight": 105,
    "bodyFontScale": 0.7,
    "bodyFontFamily": "Averia",
    "bodyPaddingTop": 5,
    "headerFontColor": "#e81e61",
    "headerFontScale": 1.55,
    "headerTransformX": 0,
    "headerTransformY": -1,
    "bodyPaddingBottom": 4,
    "headerPaddingBottom": 4
  },
  "envelope": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 57,
    "bgPosY": 34,
    "bottom": 15,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 101,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.95,
    "headerFontScale": 0.8,
    "bottomFontFamily": "Averia",
    "headerPaddingTop": 5,
    "bodyPaddingBottom": 5,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "headerPaddingBottom": 5
  },
  "checkin": {
    "top": 10,
    "left": 10,
    "right": 10,
    "bgPosX": 46,
    "bgPosY": 50,
    "bottom": 10,
    "fontScale": 1,
    "bgSizeWidth": 135,
    "bottomWidth": 105,
    "bgSizeHeight": 105,
    "bodyFontColor": "#e81e61",
    "bodyPaddingTop": 10,
    "bottomFontScale": 0.9,
    "headerFontScale": 0.85,
    "bottomFontFamily": "Averia",
    "bottomTransformX": -10,
    "bottomTransformY": 19,
    "headerPaddingLeft": 9,
    "headerPaddingRight": 9,
    "bottomPaddingBottom": 10
  },
  "closing": {
    "top": 15,
    "left": 10,
    "right": 10,
    "bgPosX": 50,
    "bgPosY": 50,
    "bottom": 15,
    "avatarX": -2,
    "avatarY": -2,
    "fontScale": 1,
    "avatarScale": 190,
    "bgSizeWidth": 122,
    "bgSizeHeight": 100,
    "bodyFontFamily": "Averia",
    "bodyTransformX": -1,
    "bodyTransformY": -8,
    "headerPaddingTop": 5,
    "headerTransformX": 0,
    "headerTransformY": -10,
    "bodyPaddingBottom": 12,
    "headerPaddingLeft": 5,
    "headerPaddingRight": 5,
    "headerPaddingBottom": 5,
    "headerAnimationClass": "animate-pulse"
  },
  "global": {
    "musicUrl": "https://drive.google.com/file/d/1dtuutyBPZnthZq-T5vDvARRjBiEjVGuQ/view?usp=drive_link"
  }
};


const DEFAULT_CONFIG_THEME_KHITAN_9: ThemeConfig = {
  cover: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    customText: "Walimatul Khitan",
    buttonScale: 1.0,
    ornaments: [
      { id: "91", url: "/templates/khitan-9/ornament-planet.png", transformX: 30, transformY: 400, scale: 0.8, flipHorizontal: false },
      { id: "92", url: "/templates/khitan-9/ornament-astronaut.png", transformX: -20, transformY: 480, scale: 1.2, flipHorizontal: false }
    ],
    elementOrder: ["badge", "title", "divider", "nama", "parents", "button"]
  },
  profile: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#E0E7FF",
    fontScale: 1.0,
    avatarScale: 110,
    avatarX: 0,
    avatarY: -10,
    ornaments: [
      { id: "93", url: "/templates/khitan-9/ornament-rocket.png", transformX: 50, transformY: 200, scale: 1.0, flipHorizontal: false }
    ],
    elementOrder: ["header", "avatar", "body", "bottom"]
  },
  turut: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body"]
  },
  checkin: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "qr", "button"]
  },
  event: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    countdownScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "countdown", "location", "button"]
  },
  maps: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "mapframe", "button"]
  },
  gallery: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 5,
    right: 5,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "grid"]
  },
  activities: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "list"]
  },
  envelope: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body", "bank", "button"]
  },
  rsvp: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "form", "messages"]
  },
  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    avatarScale: 100,
    ornaments: [],
    elementOrder: ["avatar", "header", "body"]
  },
  global: {
    musicUrl: "https://eehktxhhpsdffpwlxghm.supabase.co/storage/v1/object/public/invitation-assets/music/happy-birthday.mp3"
  }
};

function getDefaultConfigForTheme(theme: string): ThemeConfig {
  const defaultForTheme = 
    theme === "khitan-1" ? DEFAULT_CONFIG_THEME_KHITAN_1 :
    theme === "khitan-2" ? DEFAULT_CONFIG_THEME_KHITAN_2 :
    theme === "khitan-3" ? DEFAULT_CONFIG_THEME_KHITAN_3 :
    theme === "khitan-4" ? DEFAULT_CONFIG_THEME_KHITAN_4 :
    theme === "khitan-5" ? DEFAULT_CONFIG_THEME_KHITAN_5 :
    theme === "khitan-6" ? DEFAULT_CONFIG_THEME_KHITAN_6 :
    theme === "khitan-7" ? DEFAULT_CONFIG_THEME_KHITAN_7 :
    theme === "khitan-8" ? DEFAULT_CONFIG_THEME_KHITAN_8 :
    theme === "khitan-9" ? DEFAULT_CONFIG_THEME_KHITAN_9 :
    theme === "birthday-8" ? DEFAULT_CONFIG_THEME_8 :
    theme === "birthday-7" ? DEFAULT_CONFIG_THEME_7 :
    theme === "birthday-6" ? DEFAULT_CONFIG_THEME_6 :
    theme === "birthday-5" ? DEFAULT_CONFIG_THEME_5 :
    theme === "birthday-4" ? DEFAULT_CONFIG_THEME_4 :
    theme === "birthday-3" ? DEFAULT_CONFIG_THEME_3 :
    theme === "birthday-2" ? DEFAULT_CONFIG_THEME_2 : DEFAULT_CONFIG_THEME_1;

  const globalOverrides: any = {
    cover: {
      top: 25,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 25,
      fontScale: 1,
      bgSizeWidth: 125,
      bgSizeHeight: 100,
      bodyMarginTop: 12,
      headerMarginTop: 69,
      bodyMarginBottom: -61,
      headerMarginBottom: 31,
      badgePaddingTop: 5,
      badgePaddingBottom: 5,
      badgePaddingLeft: 10,
      badgePaddingRight: 10,
      badgeFontScale: 0.7,
      badgeMarginTop: 50,
      bottomFontScale: 1.05,
      bodyFontScale: 0.8,
      badgeMarginBottom: 0
    },
    profile: {
      top: 15,
      left: 10,
      right: 10,
      bgPosX: 52,
      bgPosY: 49,
      bottom: 20,
      fontScale: 1,
      avatarScale: 110,
      bgSizeWidth: 134,
      bgSizeHeight: 100,
      headerFontScale: 0.8,
      badgeFontScale: 1.2,
      badgePaddingBottom: 19,
      headerPaddingBottom: 8,
      bodyMarginBottom: 10
    },
    turut: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 10,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerPaddingBottom: 15
    },
    event: {
      top: 15,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 15,
      fontScale: 1.1,
      bgSizeWidth: 120,
      bgSizeHeight: 100,
      headerFontScale: 1.5,
      headerMarginBottom: 8,
      bodyPaddingTop: 5,
      bodyPaddingBottom: 5,
      bottomPaddingTop: 5,
      bottomPaddingBottom: 5,
      headerPaddingBottom: 10
    },
    maps: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 10,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerFontScale: 0.8,
      headerPaddingTop: 5,
      headerPaddingLeft: 9,
      headerPaddingRight: 9,
      headerPaddingBottom: 5,
      bodyFontScale: 1.45,
      bodyPaddingTop: 9,
      bodyPaddingBottom: 9,
      bottomFontScale: 0.8
    },
    activities: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 10,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerFontScale: 0.8,
      headerPaddingTop: 5,
      headerPaddingBottom: 5,
      headerPaddingLeft: 9,
      headerPaddingRight: 9,
      bodyFontScale: 1.35,
      bodyPaddingTop: 10,
      bodyPaddingBottom: 10,
      bottomFontScale: 0.85
    },
    gallery: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 10,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerMarginBottom: 0,
      headerMarginTop: 0,
      headerPaddingBottom: 10,
      bodyPaddingBottom: 5
    },
    rsvp: {
      top: 25,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 15,
      fontScale: 1,
      lineHeight: 1.5,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerFontScale: 1.55,
      bodyFontScale: 0.7,
      headerPaddingBottom: 4,
      bodyPaddingBottom: 4,
      bodyPaddingTop: 5
    },
    envelope: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 15,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerFontScale: 0.8,
      headerPaddingTop: 5,
      headerPaddingBottom: 5,
      headerPaddingLeft: 9,
      headerPaddingRight: 9,
      bodyPaddingTop: 10,
      bodyPaddingBottom: 5,
      bottomFontScale: 0.7
    },
    checkin: {
      top: 10,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 10,
      fontScale: 1,
      bgSizeWidth: 100,
      bgSizeHeight: 100,
      headerPaddingLeft: 9,
      headerPaddingRight: 9,
      bottomFontScale: 0.75,
      bottomPaddingBottom: 10,
      bodyPaddingTop: 10,
      headerFontScale: 0.85
    },
    closing: {
      top: 15,
      left: 10,
      right: 10,
      bgPosX: 50,
      bgPosY: 50,
      bottom: 15,
      fontScale: 1,
      avatarScale: 190,
      bgSizeWidth: 117,
      bgSizeHeight: 100,
      headerPaddingTop: 5,
      headerPaddingBottom: 5,
      headerPaddingLeft: 5,
      headerPaddingRight: 5,
      bodyPaddingBottom: 12
    }
  };

  const merged: any = {};
  for (const section in defaultForTheme) {
    merged[section] = {
      ...(defaultForTheme as any)[section],
      ...globalOverrides[section]
    };
  }

  return merged as ThemeConfig;
}

function formatFriendlyDate(dateStr: string) {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return dateStr;
  }
  const [, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(date.getTime())) return dateStr;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${days[date.getDay()]}, ${parseInt(day)} ${months[date.getMonth()]} ${year}`;
}

function formatFriendlyTime(timeStr: string) {
  if (!timeStr) return "";
  const match = timeStr.match(/^(\d{2}):(\d{2})$/);
  if (match) {
    return `${timeStr} WIB`;
  }
  const matchWithSec = timeStr.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (matchWithSec) {
    return `${matchWithSec[1]}:${matchWithSec[2]} WIB`;
  }
  return timeStr;
}
function getYouTubeEmbedUrl(url: string) {
  if (!url) return "https://www.youtube.com/embed/ZbZSe6N_BXs?rel=0&modestbranding=1";
  
  // Try to match standard formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  let videoId = "ZbZSe6N_BXs";
  
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  const shortMatch = url.match(/youtu\.be\/([^&#?]+)/);
  const embedMatch = url.match(/youtube\.com\/embed\/([^&#?]+)/);
  
  if (watchMatch) {
    videoId = watchMatch[1];
  } else if (shortMatch) {
    videoId = shortMatch[1];
  } else if (embedMatch) {
    videoId = embedMatch[1];
  } else if (url.trim().length > 5 && !url.includes("http")) {
    videoId = url.trim();
  }
  
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

const SECTION_BG_MAP: Record<string, Record<string, string>> = {
  "birthday-8": {
    cover: "/templates/birthday-8/bg-cover.jpg",
    profile: "/templates/birthday-8/bg-profile.jpg",
    turut: "/templates/birthday-8/bg-plain.jpg",
    event: "/templates/birthday-8/bg-plain.jpg",
    maps: "/templates/birthday-8/bg-plain.jpg",
    activities: "/templates/birthday-8/bg-plain.jpg",
    gallery: "/templates/birthday-8/bg-plain.jpg",
    rsvp: "/templates/birthday-8/bg-plain.jpg",
    envelope: "/templates/birthday-8/bg-plain.jpg",
    checkin: "/templates/birthday-8/bg-plain.jpg",
    closing: "/templates/birthday-8/bg-profile.jpg",
    default: "/templates/birthday-8/bg-plain.jpg",
  },
  "birthday-7": {
    cover: "/templates/birthday-7/bg-cover.jpg",
    profile: "/templates/birthday-7/bg-profile.jpg",
    turut: "/templates/birthday-7/bg-plain.jpg",
    event: "/templates/birthday-7/bg-plain.jpg",
    maps: "/templates/birthday-7/bg-frame.jpg",
    activities: "/templates/birthday-7/bg-activities.jpg",
    gallery: "/templates/birthday-7/bg-plain.jpg",
    rsvp: "/templates/birthday-7/bg-frame.jpg",
    envelope: "/templates/birthday-7/bg-plain.jpg",
    checkin: "/templates/birthday-7/bg-plain.jpg",
    closing: "/templates/birthday-7/bg-profile.jpg",
    default: "/templates/birthday-7/bg-plain.jpg",
  },
  "birthday-6": {
    cover: "/templates/birthday-6/bg-cover.jpg",
    profile: "/templates/birthday-6/bg-profile.jpg",
    turut: "/templates/birthday-6/bg-plain.jpg",
    event: "/templates/birthday-6/bg-plain.jpg",
    maps: "/templates/birthday-6/bg-plain.jpg",
    activities: "/templates/birthday-6/bg-plain.jpg",
    gallery: "/templates/birthday-6/bg-plain.jpg",
    rsvp: "/templates/birthday-6/bg-plain.jpg",
    envelope: "/templates/birthday-6/bg-plain.jpg",
    checkin: "/templates/birthday-6/bg-plain.jpg",
    closing: "/templates/birthday-6/bg-plain.jpg",
    default: "/templates/birthday-6/bg-plain.jpg",
  },
  "birthday-5": {
    cover: "/templates/birthday-5/bg-cover.jpg",
    profile: "/templates/birthday-5/bg-profile.jpg",
    turut: "/templates/birthday-5/bg-plain.jpg",
    event: "/templates/birthday-5/bg-plain.jpg",
    maps: "/templates/birthday-5/bg-plain.jpg",
    activities: "/templates/birthday-5/bg-plain.jpg",
    gallery: "/templates/birthday-5/bg-plain.jpg",
    rsvp: "/templates/birthday-5/bg-plain.jpg",
    envelope: "/templates/birthday-5/bg-plain.jpg",
    checkin: "/templates/birthday-5/bg-plain.jpg",
    closing: "/templates/birthday-5/bg-plain.jpg",
    default: "/templates/birthday-5/bg-plain.jpg",
  },
  "birthday-4": {
    cover: "/templates/birthday-4/bg-cover.jpg",
    profile: "/templates/birthday-4/bg-profile.jpg",
    turut: "/templates/birthday-4/bg-turut.jpg",
    event: "/templates/birthday-4/bg-event.jpg",
    maps: "/templates/birthday-4/bg-maps.jpg",
    activities: "/templates/birthday-4/bg-activities.jpg",
    gallery: "",
    rsvp: "",
    envelope: "/templates/birthday-4/bg-envelope.jpg",
    checkin: "/templates/birthday-4/bg-checkin.jpg",
    closing: "/templates/birthday-4/bg-closing.jpg",
    default: "/templates/birthday-4/bg-plain.jpg",
  },
  "birthday-3": {
    cover: "/templates/birthday-3/bg-cover.jpg",
    profile: "/templates/birthday-3/bg-profile.jpg",
    turut: "/templates/birthday-3/bg-turut.jpg",
    event: "/templates/birthday-3/bg-event.jpg",
    maps: "/templates/birthday-3/bg-maps.jpg",
    activities: "/templates/birthday-3/bg-activities.jpg",
    gallery: "",
    rsvp: "/templates/birthday-3/bg-rsvp.jpg",
    envelope: "/templates/birthday-3/bg-envelope.jpg",
    checkin: "/templates/birthday-3/bg-checkin.jpg",
    closing: "/templates/birthday-3/bg-closing.jpg",
    default: "/templates/birthday-3/bg-plain.jpg",
  },
  "khitan-1": {
    cover: "/templates/khitan-1/bg-children.jpg",
    profile: "/templates/khitan-1/bg-pattern.jpg",
    turut: "/templates/khitan-1/bg-children.jpg",
    event: "/templates/khitan-1/bg-leaves.jpg",
    maps: "/templates/khitan-1/bg-pattern.jpg",
    activities: "/templates/khitan-1/bg-leaves.jpg",
    gallery: "/templates/khitan-1/bg-pattern.jpg",
    rsvp: "/templates/khitan-1/bg-children.jpg",
    envelope: "/templates/khitan-1/bg-pattern.jpg",
    checkin: "/templates/khitan-1/bg-pattern.jpg",
    closing: "/templates/khitan-1/bg-children.jpg",
    default: "/templates/khitan-1/bg-pattern.jpg"
  },
  "khitan-2": {
    cover: "/templates/khitan-2/bg-cover.jpg",
    profile: "/templates/khitan-2/bg-sections.jpg",
    turut: "/templates/khitan-2/bg-sections.jpg",
    event: "/templates/khitan-2/bg-corners.jpg",
    maps: "/templates/khitan-2/bg-sections.jpg",
    activities: "/templates/khitan-2/bg-corners.jpg",
    gallery: "/templates/khitan-2/bg-sections.jpg",
    rsvp: "/templates/khitan-2/bg-sections.jpg",
    envelope: "/templates/khitan-2/bg-sections.jpg",
    checkin: "/templates/khitan-2/bg-sections.jpg",
    closing: "/templates/khitan-2/bg-sections.jpg",
    default: "/templates/khitan-2/bg-sections.jpg"
  },
  "khitan-3": {
    cover: "/templates/khitan-3/bg-cover.jpg",
    profile: "/templates/khitan-3/bg-sections.jpg",
    turut: "/templates/khitan-3/bg-sections.jpg",
    event: "/templates/khitan-3/bg-corners.jpg",
    maps: "/templates/khitan-3/bg-sections.jpg",
    activities: "/templates/khitan-3/bg-corners.jpg",
    gallery: "/templates/khitan-3/bg-sections.jpg",
    rsvp: "/templates/khitan-3/bg-sections.jpg",
    envelope: "/templates/khitan-3/bg-sections.jpg",
    checkin: "/templates/khitan-3/bg-sections.jpg",
    closing: "/templates/khitan-3/bg-sections.jpg",
    default: "/templates/khitan-3/bg-sections.jpg"
  },
  "khitan-4": {
    cover: "/templates/khitan-4/bg-cover.jpg",
    profile: "/templates/khitan-4/bg-sections.jpg",
    turut: "/templates/khitan-4/bg-sections.jpg",
    event: "/templates/khitan-4/bg-corners.jpg",
    maps: "/templates/khitan-4/bg-sections.jpg",
    activities: "/templates/khitan-4/bg-corners.jpg",
    gallery: "/templates/khitan-4/bg-sections.jpg",
    rsvp: "/templates/khitan-4/bg-sections.jpg",
    envelope: "/templates/khitan-4/bg-sections.jpg",
    checkin: "/templates/khitan-4/bg-sections.jpg",
    closing: "/templates/khitan-4/bg-sections.jpg",
    default: "/templates/khitan-4/bg-sections.jpg"
  },
  "khitan-5": {
    cover: "/templates/khitan-5/bg-cover.jpg",
    profile: "/templates/khitan-5/bg-sections.jpg",
    turut: "/templates/khitan-5/bg-sections.jpg",
    event: "/templates/khitan-5/bg-corners.jpg",
    maps: "/templates/khitan-5/bg-sections.jpg",
    activities: "/templates/khitan-5/bg-corners.jpg",
    gallery: "/templates/khitan-5/bg-sections.jpg",
    rsvp: "/templates/khitan-5/bg-sections.jpg",
    envelope: "/templates/khitan-5/bg-sections.jpg",
    checkin: "/templates/khitan-5/bg-sections.jpg",
    closing: "/templates/khitan-5/bg-sections.jpg",
    default: "/templates/khitan-5/bg-sections.jpg"
  },
  "khitan-6": {
    cover: "/templates/khitan-6/bg-cover.jpg",
    profile: "/templates/khitan-6/bg-sections.jpg",
    turut: "/templates/khitan-6/bg-sections.jpg",
    event: "/templates/khitan-6/bg-corners.jpg",
    maps: "/templates/khitan-6/bg-sections.jpg",
    activities: "/templates/khitan-6/bg-corners.jpg",
    gallery: "/templates/khitan-6/bg-sections.jpg",
    rsvp: "/templates/khitan-6/bg-sections.jpg",
    envelope: "/templates/khitan-6/bg-sections.jpg",
    checkin: "/templates/khitan-6/bg-sections.jpg",
    closing: "/templates/khitan-6/bg-sections.jpg",
    default: "/templates/khitan-6/bg-sections.jpg"
  },
  "khitan-7": {
    cover: "/templates/khitan-7/bg-cover.jpg",
    profile: "/templates/khitan-7/bg-sections.jpg",
    turut: "/templates/khitan-7/bg-sections.jpg",
    event: "/templates/khitan-7/bg-corners.jpg",
    maps: "/templates/khitan-7/bg-sections.jpg",
    activities: "/templates/khitan-7/bg-corners.jpg",
    gallery: "/templates/khitan-7/bg-sections.jpg",
    rsvp: "/templates/khitan-7/bg-sections.jpg",
    envelope: "/templates/khitan-7/bg-sections.jpg",
    checkin: "/templates/khitan-7/bg-sections.jpg",
    closing: "/templates/khitan-7/bg-sections.jpg",
    default: "/templates/khitan-7/bg-sections.jpg"
  },

  "khitan-9": {
    cover: "/templates/khitan-9/bg-cover.jpg",
    profile: "/templates/khitan-9/bg-sections.jpg",
    turut: "/templates/khitan-9/bg-sections.jpg",
    event: "/templates/khitan-9/bg-corners.jpg",
    maps: "/templates/khitan-9/bg-sections.jpg",
    activities: "/templates/khitan-9/bg-corners.jpg",
    gallery: "/templates/khitan-9/bg-sections.jpg",
    rsvp: "/templates/khitan-9/bg-sections.jpg",
    envelope: "/templates/khitan-9/bg-sections.jpg",
    checkin: "/templates/khitan-9/bg-sections.jpg",
    closing: "/templates/khitan-9/bg-sections.jpg",
    default: "/templates/khitan-9/bg-sections.jpg"
  },
  "khitan-8": {
    cover: "/templates/khitan-8/bg-cover.jpg",
    profile: "/templates/khitan-8/bg-sections.jpg",
    turut: "/templates/khitan-8/bg-sections.jpg",
    event: "/templates/khitan-8/bg-corners.jpg",
    maps: "/templates/khitan-8/bg-sections.jpg",
    activities: "/templates/khitan-8/bg-corners.jpg",
    gallery: "/templates/khitan-8/bg-sections.jpg",
    rsvp: "/templates/khitan-8/bg-sections.jpg",
    envelope: "/templates/khitan-8/bg-sections.jpg",
    checkin: "/templates/khitan-8/bg-sections.jpg",
    closing: "/templates/khitan-8/bg-sections.jpg",
    default: "/templates/khitan-8/bg-sections.jpg"
  },
  "birthday-2": {
    cover: "/templates/birthday-2/bg-cover.jpg",
    profile: "/templates/birthday-2/bg-profile.jpg",
    turut: "/templates/birthday-2/bg-turut.jpg",
    event: "/templates/birthday-2/bg-event.jpg",
    maps: "/templates/birthday-2/bg-maps.jpg",
    activities: "/templates/birthday-2/bg-activities.jpg",
    gallery: "/templates/birthday-2/bg-plain.jpg",
    rsvp: "/templates/birthday-2/bg-rsvp.jpg",
    envelope: "/templates/birthday-2/bg-envelope.jpg",
    checkin: "/templates/birthday-2/bg-checkin.jpg",
    closing: "/templates/birthday-2/bg-closing.jpg",
    default: "/templates/birthday-2/bg-plain.jpg",
  },

  "birthday-1": {
    cover: "/templates/birthday-1/bg-cover.jpg",
    closing: "/templates/birthday-1/bg-cover.jpg",
    profile: "/templates/birthday-1/bg-profile.jpg",
    turut: "/templates/birthday-1/bg-profile.jpg",
    envelope: "/templates/birthday-1/bg-profile.jpg",
    event: "/templates/birthday-1/bg-event.jpg",
    maps: "/templates/birthday-1/bg-event.jpg",
    activities: "/templates/birthday-1/bg-event.jpg",
    checkin: "/templates/birthday-1/bg-event.jpg",
    default: "/templates/birthday-1/bg-event.jpg",
  }
};

function getSectionBg(theme: string, section: string): string {
  const mapping = SECTION_BG_MAP[theme] || SECTION_BG_MAP["birthday-1"];
  return mapping[section] !== undefined ? mapping[section] : mapping["default"];
}

const atmaFontRaw = { fontFamily: "'Atma', cursive" };
const averiaFontRaw = { fontFamily: "'Averia Gruesa Libre', sans-serif" };
const breeFont = { fontFamily: "var(--font-bree-serif), serif" };
const cookieFont = { fontFamily: "var(--font-cookie), cursive" };
const bethFont = { fontFamily: "var(--font-beth-ellen), cursive" };
const bungeeFont = { fontFamily: "var(--font-bungee), sans-serif" };
const bungeeInlineFont = { fontFamily: "var(--font-bungee-inline), sans-serif" };
const karlaFont = { fontFamily: "var(--font-karla), sans-serif" };
const playfairDisplayFont = { fontFamily: "var(--font-playfair-display), serif" };
const lucidaCalligraphyFont = { fontFamily: "'Lucida Calligraphy', 'Lucida Handwriting', cursive" };
const arefRuqaaFont = { fontFamily: "var(--font-aref-ruqaa), serif" };
const betterSaturdayFontRaw = { fontFamily: "'Better Saturday', cursive" };

const THEME_STYLES: Record<string, {
  accentColor: string;
  mainBg: string;
  mainTextColor: string;
  galleryBg: string;
  galleryTitleColor: string;
  badgeBgClass: string;
  btnAccentClass: string;
  btnGradientClass: string;
  avatarBorderClass: string;
  bubbleColor: string;
}> = {
  "khitan-1": {
    accentColor: "#E5A93B",
    mainBg: "#071530",
    mainTextColor: "#FFFFFF",
    galleryBg: "#071530",
    galleryTitleColor: "#E5A93B",
    badgeBgClass: "bg-amber-950/50 border-amber-500/30 text-amber-300",
    btnAccentClass: "bg-[#1214a1] hover:bg-[#0d0f81] text-white",
    btnGradientClass: "from-[#1214a1] to-[#1a1da8] hover:from-[#0d0f81] hover:to-[#1a1da8] text-white",
    avatarBorderClass: "border-amber-500/60",
    bubbleColor: "#E5A93B"
  },
  "khitan-2": {
    accentColor: "#8C6239",
    mainBg: "#F2EDE4",
    mainTextColor: "#5C3D2E",
    galleryBg: "#F2EDE4",
    galleryTitleColor: "#8C6239",
    badgeBgClass: "bg-[#ebdcc7] border-[#8c6239]/30 text-[#5C3D2E]",
    btnAccentClass: "bg-[#5C3D2E] hover:bg-[#462d22] text-white",
    btnGradientClass: "from-[#5C3D2E] to-[#8C6239] hover:from-[#462d22] hover:to-[#5C3D2E] text-white",
    avatarBorderClass: "border-[#8C6239]/60",
    bubbleColor: "#8C6239"
  },
  "khitan-3": {
    accentColor: "#D4AF37",
    mainBg: "#0D5C68",
    mainTextColor: "#FFFFFF",
    galleryBg: "#0D5C68",
    galleryTitleColor: "#D4AF37",
    badgeBgClass: "bg-teal-950/50 border-teal-500/30 text-teal-200",
    btnAccentClass: "bg-[#0D5C68] hover:bg-[#094751] text-white border border-[#D4AF37]/30",
    btnGradientClass: "from-[#0D5C68] to-[#116A7B] hover:from-[#094751] hover:to-[#0D5C68] text-white",
    avatarBorderClass: "border-[#D4AF37]/60",
    bubbleColor: "#D4AF37"
  },
  "khitan-4": {
    accentColor: "#2563EB",
    mainBg: "#DCEFFC",
    mainTextColor: "#1E3A8A",
    galleryBg: "#DCEFFC",
    galleryTitleColor: "#1E3A8A",
    badgeBgClass: "bg-blue-100 border-blue-300 text-blue-800",
    btnAccentClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
    btnGradientClass: "from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white",
    avatarBorderClass: "border-blue-400/60",
    bubbleColor: "#2563EB"
  },
  "khitan-5": {
    accentColor: "#38BDF8",
    mainBg: "#020617",
    mainTextColor: "#FFFFFF",
    galleryBg: "#020617",
    galleryTitleColor: "#38BDF8",
    badgeBgClass: "bg-sky-950/70 border-sky-500/40 text-sky-300",
    btnAccentClass: "bg-[#0284C7] hover:bg-[#0369A1] text-white border border-sky-500/50",
    btnGradientClass: "from-[#0369A1] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0369A1] text-white",
    avatarBorderClass: "border-sky-500/60",
    bubbleColor: "#38BDF8"
  },
  "khitan-6": {
    accentColor: "#B89047",
    mainBg: "#130F0A",
    mainTextColor: "#F4EFE6",
    galleryBg: "#130F0A",
    galleryTitleColor: "#B89047",
    badgeBgClass: "bg-amber-950/60 border-amber-800/40 text-[#C5A880]",
    btnAccentClass: "bg-[#7A5C2D] hover:bg-[#5C4522] text-[#F4EFE6] border border-[#B89047]/30",
    btnGradientClass: "from-[#5C4522] to-[#7A5C2D] hover:from-[#453319] hover:to-[#5C4522] text-[#F4EFE6]",
    avatarBorderClass: "border-[#B89047]/60",
    bubbleColor: "#B89047"
  },
  "khitan-7": {
    accentColor: "#EA580C",
    mainBg: "#E0F2FE",
    mainTextColor: "#0369A1",
    galleryBg: "#E0F2FE",
    galleryTitleColor: "#EA580C",
    badgeBgClass: "bg-sky-100/90 border-sky-300/50 text-sky-800",
    btnAccentClass: "bg-[#EA580C] hover:bg-[#C2410C] text-white",
    btnGradientClass: "from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white",
    avatarBorderClass: "border-[#EA580C]/60",
    bubbleColor: "#EA580C"
  },
  "khitan-8": {
    accentColor: "#0F766E",
    mainBg: "#F2F5F5",
    mainTextColor: "#1F2937",
    galleryBg: "#F2F5F5",
    galleryTitleColor: "#0F766E",
    badgeBgClass: "bg-teal-50 border-teal-200 text-teal-800",
    btnAccentClass: "bg-[#0F766E] hover:bg-[#0D5C68] text-white",
    btnGradientClass: "from-[#0F766E] to-[#14B8A6] hover:from-[#0D5C68] hover:to-[#0F766E] text-white",
    avatarBorderClass: "border-[#0F766E]/60",
    bubbleColor: "#0F766E"
  },
  "khitan-9": {
    accentColor: "#06B6D4",
    mainBg: "#0B0C10",
    mainTextColor: "#E2E8F0",
    galleryBg: "#0B0C10",
    galleryTitleColor: "#06B6D4",
    badgeBgClass: "bg-slate-900 border-cyan-500/50 text-cyan-400",
    btnAccentClass: "bg-cyan-600 hover:bg-cyan-700 text-white",
    btnGradientClass: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white",
    avatarBorderClass: "border-cyan-400/50",
    bubbleColor: "#06B6D4"
  },
  "birthday-1": {
    accentColor: "#E91E63",
    mainBg: "#CBE5F8",
    mainTextColor: "#1E4D2B",
    galleryBg: "#FCC200",
    galleryTitleColor: "#2a7a2a",
    badgeBgClass: "bg-purple-100/90 border-purple-200/50 text-purple-700",
    btnAccentClass: "bg-[#E91E63] hover:bg-pink-600",
    btnGradientClass: "from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    avatarBorderClass: "border-pink-200",
    bubbleColor: "#FF69B4"
  },
  "birthday-2": {
    accentColor: "#059669",
    mainBg: "#F7F5F0",
    mainTextColor: "#2D3E2B",
    galleryBg: "#EFEBE4",
    galleryTitleColor: "#3F6239",
    badgeBgClass: "bg-emerald-100/90 border-emerald-200/50 text-emerald-800",
    btnAccentClass: "bg-[#059669] hover:bg-emerald-700",
    btnGradientClass: "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
    avatarBorderClass: "border-emerald-250",
    bubbleColor: "#10B981"
  },
  "birthday-3": {
    accentColor: "#D97706",
    mainBg: "#E0F2FE",
    mainTextColor: "#1E293B",
    galleryBg: "#B1CCDF",
    galleryTitleColor: "#1E293B",
    badgeBgClass: "bg-amber-100/90 border-amber-200/50 text-amber-800",
    btnAccentClass: "bg-amber-500 hover:bg-amber-600",
    btnGradientClass: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    avatarBorderClass: "border-amber-250",
    bubbleColor: "#F59E0B"
  },
  "birthday-4": {
    accentColor: "#00B5C5",
    mainBg: "#ECFDF5",
    mainTextColor: "#064E3B",
    galleryBg: "#00B5C5",
    galleryTitleColor: "#FFFFFF",
    badgeBgClass: "bg-lime-100/90 border-lime-200/50 text-lime-850",
    btnAccentClass: "bg-lime-600 hover:bg-lime-700",
    btnGradientClass: "from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700",
    avatarBorderClass: "border-lime-250",
    bubbleColor: "#84CC16"
  },
  "birthday-5": {
    accentColor: "#D97706",
    mainBg: "#FFFBEB",
    mainTextColor: "#451A03",
    galleryBg: "#FEF3C7",
    galleryTitleColor: "#78350F",
    badgeBgClass: "bg-amber-100/90 border-amber-200/50 text-amber-900",
    btnAccentClass: "bg-amber-600 hover:bg-amber-700",
    btnGradientClass: "from-amber-500 to-yellow-650 hover:from-amber-600 hover:to-yellow-750",
    avatarBorderClass: "border-amber-300",
    bubbleColor: "#F59E0B"
  },
  "birthday-6": {
    accentColor: "#DB2777",
    mainBg: "#FDF2F8",
    mainTextColor: "#4C0519",
    galleryBg: "#FCE7F3",
    galleryTitleColor: "#9D174D",
    badgeBgClass: "bg-pink-100/90 border-pink-200/50 text-pink-700",
    btnAccentClass: "bg-pink-600 hover:bg-pink-700",
    btnGradientClass: "from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    avatarBorderClass: "border-pink-250",
    bubbleColor: "#EC4899"
  },
  "birthday-7": {
    accentColor: "#7B68B1",
    mainBg: "#F6F5F9",
    mainTextColor: "#2E244B",
    galleryBg: "#F0EEF6",
    galleryTitleColor: "#7B68B1",
    badgeBgClass: "bg-purple-100/90 border-purple-200/50 text-purple-700",
    btnAccentClass: "bg-[#7B68B1] hover:bg-[#68569C]",
    btnGradientClass: "from-[#7B68B1] to-[#9B89D1] hover:from-[#68569C] hover:to-[#8B79C1]",
    avatarBorderClass: "border-purple-200",
    bubbleColor: "#9B89D1"
  },
  "birthday-8": {
    accentColor: "#000000",
    mainBg: "#EAEBE7",
    mainTextColor: "#000000",
    galleryBg: "#EAEBE7",
    galleryTitleColor: "#000000",
    badgeBgClass: "bg-yellow-100/90 border-yellow-300 text-yellow-800",
    btnAccentClass: "bg-[#EF8D20] hover:bg-[#D77C1B] text-white",
    btnGradientClass: "from-[#EF8D20] to-[#FFAB40] hover:from-[#D77C1B] hover:to-[#FF9800] text-white",
    avatarBorderClass: "border-[#EF8D20]",
    bubbleColor: "#EF8D20"
  }
};



const InlineEditorOverlay = ({ designerOpen, inlineEditingKey, inlineEditingValue, setInlineEditingValue, onSave, onClose }: any) => { 
  const [rect, setRect] = React.useState<DOMRect | null>(null); 
  React.useEffect(() => { 
    if (!designerOpen || !inlineEditingKey) { 
      setRect(null); return; 
    } 
    const updateRect = () => { 
      const el = document.getElementById('el-' + inlineEditingKey.section + '-' + inlineEditingKey.key); 
      if (el) setRect(el.getBoundingClientRect()); 
    }; 
    updateRect(); 
    const interval = setInterval(updateRect, 100); 
    window.addEventListener('scroll', updateRect, true); 
    window.addEventListener('resize', updateRect); 
    return () => { 
      clearInterval(interval); 
      window.removeEventListener('scroll', updateRect, true); 
      window.removeEventListener('resize', updateRect); 
    }; 
  }, [designerOpen, inlineEditingKey]); 
  
  if (!rect || !designerOpen || !inlineEditingKey) return null; 
  
  return ( 
    <div style={{ position: 'fixed', top: rect.top - 5, left: rect.left - 5, width: rect.width + 10, height: rect.height + 10, zIndex: 10000 }}> 
      <textarea autoFocus value={inlineEditingValue} onChange={(e) => setInlineEditingValue(e.target.value)} onBlur={onSave} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} style={{ width: '100%', height: '100%', resize: 'none', background: 'rgba(255,255,255,0.95)', border: '2px solid #3b82f6', borderRadius: '8px', outline: 'none', padding: '8px', fontSize: '14px', color: '#0f172a', fontFamily: 'sans-serif', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} /> 
    </div> 
  ); 
};
export default function ThemePreviewPage() {
  const params = useParams();
  const themeId = params.id as string;
  const [editingTextElement, setEditingTextElement] = useState<{section: string, type: string, key: string} | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFolders, setMediaFolders] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [selectedMediaFolder, setSelectedMediaFolder] = useState<string | null>(null);
  const [mediaSelectionTarget, setMediaSelectionTarget] = useState<'background' | number | null>(null);
  const [mediaFolderPage, setMediaFolderPage] = useState(1);
  const [mediaFilePage, setMediaFilePage] = useState(1);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);


  const loadMediaFolders = async () => {
    setIsMediaLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMediaFolders(data || []);
      setMediaFolderPage(1);
    } catch(e) {
      console.error(e);
    }
    setIsMediaLoading(false);
  };

  const loadMediaFiles = async (folder: string) => {
    setIsMediaLoading(true);
    try {
      const res = await fetch(`/api/admin/media?folder=${folder}`);
      const data = await res.json();
      setMediaFiles(data || []);
      setSelectedMediaFolder(folder);
      setMediaFilePage(1);
    } catch(e) {
      console.error(e);
    }
    setIsMediaLoading(false);
  };
  const navItems = [
    { id: "profile", label: "Profil", icon: Heart },
    { id: "event", label: "Acara", icon: Calendar },
    { id: "gallery", label: "Galeri", icon: LucideImage },
    { id: "rsvp", label: "RSVP", icon: MessageSquare },
    { id: "envelope", label: "Amplop", icon: Gift }
  ];

  const isCustomInvitation = themeId && (
    themeId.startsWith("birthday_") ||
    themeId.startsWith("khitan_") ||
    themeId.startsWith("aqiqah_") ||
    themeId.startsWith("wedding_") ||
    themeId.startsWith("custom_")
  );

  // ==========================================
  // 1. ALL HOOK DECLARATIONS MUST BE AT THE TOP (UNCONDITIONAL)
  // ==========================================

  // Cover state
  const [isOpened, setIsOpened] = useState(false);
  const [activeDesignerTab, setActiveDesignerTab] = useState<"background" | "typography" | "spacing" | "music">("background");


  // Drag State
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    startMarginLeft: number;
    startMarginTop: number;
    elementSection: keyof ThemeConfig;
    elementType: "default" | "custom" | "avatar" | "ornament";
    elementKey: string;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, section: keyof ThemeConfig, type: "default" | "custom" | "avatar" | "ornament", key: string) => {
    if (!designerOpen) return;
    e.stopPropagation();
    e.preventDefault();
    
    // Select the element immediately
    setSelectedSection(section);
    setSelectedElement({ section, type, key });

    // Ensure layoutConfig is captured from the latest state (it's accessible in scope)
    const conf = layoutConfig[section] as any;
    if (!conf) return;

    let mLeft = 0, mTop = 0;
    if (type === "default") {
      mLeft = conf[`${key}TransformX`] || 0;
      mTop = conf[`${key}TransformY`] || 0;
    } else if (type === "custom") {
      const el = (conf.customElements || []).find((e: any) => e.id === key);
      mLeft = (el?.transformX !== undefined) ? el.transformX : (el?.marginLeft || 0);
      mTop = (el?.transformY !== undefined) ? el.transformY : (el?.marginTop || 0);
    } else if (type === "ornament") {
      const el = (conf.ornaments || []).find((e: any) => e.id === key);
      mLeft = el?.transformX || 0;
      mTop = el?.transformY || 0;
    } else if (type === "avatar") {
      mLeft = conf.avatarX || 0;
      mTop = conf.avatarY || 0;
    }

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startMarginLeft: mLeft,
      startMarginTop: mTop,
      elementSection: section,
      elementType: type,
      elementKey: key
    });
  };

  useEffect(() => {
    if (!dragState?.isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Scale down movement slightly if needed, but 1:1 is usually fine
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      const newLeft = dragState.startMarginLeft + deltaX;
      const newTop = dragState.startMarginTop + deltaY;

      setLayoutConfig(prev => {
        const conf = prev[dragState.elementSection] as any;
        if (!conf) return prev;
        const newSectionConf = { ...conf };

        if (dragState.elementType === "default") {
          newSectionConf[`${dragState.elementKey}TransformX`] = newLeft;
          newSectionConf[`${dragState.elementKey}TransformY`] = newTop;
        } else if (dragState.elementType === "custom") {
          newSectionConf.customElements = (conf.customElements || []).map((el: any) => 
            el.id === dragState.elementKey ? { ...el, transformX: newLeft, transformY: newTop } : el
          );
        } else if (dragState.elementType === "ornament") {
          newSectionConf.ornaments = (conf.ornaments || []).map((el: any) => 
            el.id === dragState.elementKey ? { ...el, transformX: newLeft, transformY: newTop } : el
          );
        } else if (dragState.elementType === "avatar") {
          newSectionConf.avatarX = newLeft;
          newSectionConf.avatarY = newTop;
        }

        return {
          ...prev,
          [dragState.elementSection]: newSectionConf
        };
      });
    };

    const handlePointerUp = () => {
      setDragState(null);
      pushHistory(latestConfigRef.current);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  const [confettiActive, setConfettiActive] = useState(false);

  interface InvitationData {
    id: string;
    type?: string;
    full_name?: string;
    nickname?: string;
    parents_name?: string;
    birthday_age?: string;
    event_date?: string;
    event_time?: string;
    event_location?: string;
    invited_guests?: string;
    video_link?: string;
    maps_link?: string;
    gift_address?: string;
    bank_account?: string;
    theme?: string;
    is_pro?: boolean;
    schedule?: string;
    child_order?: string;
    child_photo_url?: string;
    gallery_images?: string[] | string;
    activities_photo_url?: string;
  }

  // Database data state
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [baseTemplateConfig, setBaseTemplateConfig] = useState<string | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  // Music State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicCatalog, setMusicCatalog] = useState(DEFAULT_MUSIC_CATALOG);

  // Load global music catalog from DB
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const res = await fetch('/api/admin/music');
        if (res.ok) {
          const dbMusic = await res.json();
          // Merge with DEFAULT_MUSIC_CATALOG to keep "Pilih Lagu" and "Custom"
          const filteredDbMusic = dbMusic.filter((m: any) => m.url !== "" && m.url !== "custom");
          setMusicCatalog([...DEFAULT_MUSIC_CATALOG, ...filteredDbMusic]);
        }
      } catch (e) {
        console.error("Failed to load global music catalog", e);
      }
    };
    loadMusic();
  }, []);



  // Lightbox gallery
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  // RSVP Form States
  const [comments, setComments] = useState<any[]>([]);
  const [formName, setFormName] = useState("Budi Setiawan");
  const [formRsvp, setFormRsvp] = useState("Hadir");
  const [formComment, setFormComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // URL Hash Guest Name simulation
  const [guestName, setGuestName] = useState("Budi Setiawan");

  // Countdown timer state & calculations
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Active Navigation Tab
  const [activeNavTab, setActiveNavTab] = useState("profile");

  // Designer Control States
    const [designerOpen, setDesignerOpen] = useState(false);
  const [previewRatio, setPreviewRatio] = useState<string>("9/16");
  const [inlineEditingKey, setInlineEditingKey] = useState<{section: string, key: string, type: string, currentText: string} | null>(null);
  const [inlineEditingValue, setInlineEditingValue] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBgUploading, setIsBgUploading] = useState(false);
  const [isOrnamentUploading, setIsOrnamentUploading] = useState<{ [key: number]: boolean }>({});
  const [isSavingDbConfig, setIsSavingDbConfig] = useState(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [isDbFetched, setIsDbFetched] = useState(false);
  const searchParams = useSearchParams();
  const hasTriggeredDownload = useRef(false);

  useEffect(() => {
    setIsConfigLoaded(false);
    setIsDbFetched(false);
    setInvitationData(null);
    setBaseTemplateConfig(null);
  }, [themeId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminQuery = searchParams.get("admin") === "true";
      const isAdminSession = sessionStorage.getItem("bintarti_admin_authenticated") === "true";
      if (isAdminQuery || isAdminSession) {
        setIsAdmin(true);
      }
    }
  }, [searchParams]);
  const [layoutConfig, setLayoutConfig] = useState<ThemeConfig>(DEFAULT_CONFIG_THEME_1);
  const latestConfigRef = React.useRef<ThemeConfig>(layoutConfig);
  useEffect(() => {
    latestConfigRef.current = layoutConfig;
  }, [layoutConfig]);

  const [historyState, setHistoryState] = useState<{ list: ThemeConfig[]; index: number }>({ list: [], index: -1 });

  const pushHistory = (newConfig: ThemeConfig) => {
    setHistoryState((prev) => {
      const newList = prev.list.slice(0, prev.index + 1);
      newList.push(newConfig);
      if (newList.length > 20) {
        newList.shift();
      }
      return { list: newList, index: newList.length - 1 };
    });
  };

  const undo = () => {
    setHistoryState((prev) => {
      if (prev.index > 0) {
        const prevConfig = prev.list[prev.index - 1];
        setLayoutConfig(prevConfig);
        return { ...prev, index: prev.index - 1 };
      }
      return prev;
    });
  };

  const redo = () => {
    setHistoryState((prev) => {
      if (prev.index < prev.list.length - 1) {
        const nextConfig = prev.list[prev.index + 1];
        setLayoutConfig(nextConfig);
        return { ...prev, index: prev.index + 1 };
      }
      return prev;
    });
  };

  // Push initial history when layoutConfig is loaded from DB or default
  useEffect(() => {
    if (historyState.list.length === 0 && layoutConfig) {
      pushHistory(layoutConfig);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === "y") {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const [selectedSection, setSelectedSection] = useState<keyof ThemeConfig>("cover");
  const [panelPosition, setPanelPosition] = useState<"bottom" | "left" | "right">("bottom");
  const [selectedElement, setSelectedElement] = useState<{
    section: keyof ThemeConfig;
    type: "default" | "custom" | "avatar" | "button" | "ornament";
    key: string;
  }>({
    section: "cover",
    type: "default",
    key: "header"
  });

  useEffect(() => {
    setSelectedElement(prev => {
      if (prev && prev.section !== selectedSection) {
        return {
          section: selectedSection,
          type: "default",
          key: "header"
        };
      }
      return prev;
    });
  }, [selectedSection]);

  const rawTheme = isCustomInvitation ? (invitationData?.theme || "birthday-1") : themeId;
  const normalizedTheme = rawTheme ? rawTheme.toLowerCase().replace(/\s+/g, "-") : "birthday-1";
  const activeTheme = (normalizedTheme === "khitan-1"
    ? "khitan-1"
    : normalizedTheme === "khitan-2"
      ? "khitan-2"
      : normalizedTheme === "khitan-3"
        ? "khitan-3"
        : normalizedTheme === "khitan-4"
          ? "khitan-4"
          : normalizedTheme === "khitan-5"
            ? "khitan-5"
            : normalizedTheme === "khitan-6"
              ? "khitan-6"
              : normalizedTheme === "khitan-7"
                ? "khitan-7"
                : normalizedTheme === "khitan-8"
                  ? "khitan-8"
                : normalizedTheme === "khitan-9"
                  ? "khitan-9"
                  : normalizedTheme === "birthday-8"
                    ? "birthday-8"
                    : normalizedTheme === "birthday-7"
                    ? "birthday-7"
                    : normalizedTheme === "birthday-6"
                      ? "birthday-6"
                      : normalizedTheme === "birthday-5"
                        ? "birthday-5"
                        : normalizedTheme === "birthday-4"
                          ? "birthday-4"
                          : normalizedTheme === "birthday-3" 
                            ? "birthday-3" 
                            : normalizedTheme === "birthday-2" 
                              ? "birthday-2" 
                              : "birthday-1") as "khitan-1" | "khitan-2" | "khitan-3" | "khitan-4" | "khitan-5" | "khitan-6" | "khitan-7" | "khitan-8" | "khitan-9" | "birthday-1" | "birthday-2" | "birthday-3" | "birthday-4" | "birthday-5" | "birthday-6" | "birthday-7" | "birthday-8";

  const isKhitan = activeTheme === "khitan-1" || activeTheme === "khitan-2" || activeTheme === "khitan-3" || activeTheme === "khitan-4" || activeTheme === "khitan-5" || activeTheme === "khitan-6" || activeTheme === "khitan-7" || activeTheme === "khitan-8" || activeTheme === "khitan-9";

  useEffect(() => {
    if (!isAutoScrolling || !isOpened) {
      document.documentElement.style.scrollBehavior = '';
      return;
    }
    
    // Disable smooth scrolling while auto-scrolling to prevent animation queueing/stuttering
    document.documentElement.style.scrollBehavior = 'auto';

    let animationFrameId: number;

    const scrollStep = () => {
      if (activeTheme === "khitan-9") {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        if (scrollContainer) {
          // Temporarily disable smooth scroll on the container too just in case
          (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
          scrollContainer.scrollLeft += 1;
        }
      } else {
        window.scrollBy(0, 1);
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };
    
    animationFrameId = requestAnimationFrame(scrollStep);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.scrollBehavior = '';
      const khitan9Container = document.querySelector('.khitan-9-horizontal-dock');
      if (khitan9Container) (khitan9Container as HTMLElement).style.scrollBehavior = '';
    };
  }, [isAutoScrolling, isOpened, activeTheme]);

  const averiaFont = activeTheme === "khitan-8"
    ? arefRuqaaFont
    : activeTheme === "khitan-7"
      ? atmaFontRaw
      : activeTheme === "khitan-6"
        ? arefRuqaaFont
        : isKhitan
          ? karlaFont
          : activeTheme === "birthday-8"
            ? bungeeFont
            : (activeTheme === "birthday-7" || activeTheme === "birthday-6")
              ? breeFont
              : activeTheme === "birthday-5"
                ? averiaFontRaw
                : {};

  const atmaFont = activeTheme === "khitan-8"
    ? arefRuqaaFont
    : activeTheme === "khitan-7"
      ? atmaFontRaw
      : activeTheme === "khitan-6"
        ? arefRuqaaFont
        : isKhitan
          ? playfairDisplayFont
          : activeTheme === "birthday-8"
            ? bungeeFont
            : activeTheme === "birthday-7"
              ? bethFont
              : activeTheme === "birthday-6"
                ? cookieFont
                : activeTheme === "birthday-5"
                  ? averiaFont
                  : atmaFontRaw;

  // Supabase Fetch Effect
  useEffect(() => {
    setDbLoading(true); // Always show loading until DB fetch is done to prevent layout shift

    if (isCustomInvitation) {
      const loadDbData = async () => {
        try {
          const { data, error } = await supabase
            .from("invitations")
            .select()
            .eq("id", themeId)
            .single();
          if (error) {
            console.error("Error loading custom data:", error);
            setDbError("Gagal memuat data undangan kustom.");
          } else if (data) {
            // Fetch base template config dynamically from the database (admin's latest update in sandbox)
            const rawTheme = data.theme || "birthday-1";
            const normalizedTheme = rawTheme ? rawTheme.toLowerCase().replace(/\s+/g, "-") : "birthday-1";
            const templateId = normalizedTheme.startsWith("khitan-") || normalizedTheme.startsWith("birthday-")
              ? normalizedTheme
              : normalizedTheme.includes("khitan")
                ? "khitan-1"
                : "birthday-1";

            try {
              const { data: templateData } = await supabase
                .from("invitations")
                .select("layout_config")
                .eq("id", templateId)
                .single();
              if (templateData && templateData.layout_config) {
                setBaseTemplateConfig(typeof templateData.layout_config === "string"
                  ? templateData.layout_config
                  : JSON.stringify(templateData.layout_config)
                );
              }
            } catch (tplErr) {
              console.error("Failed to load base template dynamic config:", tplErr);
            }

            // Set invitationData after baseTemplateConfig is fetched
            setInvitationData(data as InvitationData);
          }
        } catch (e) {
          console.error("Catch loading custom data:", e);
          setDbError(e instanceof Error ? e.message : "Terjadi kesalahan koneksi.");
        } finally {
          setDbLoading(false);
          setIsDbFetched(true);
        }
      };

      const loadComments = async () => {
        try {
          const res = await fetch(`/api/comments?invitationId=${encodeURIComponent(themeId)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setComments(data);
              return;
            }
          }
        } catch (e) {
          console.error("Error loading comments:", e);
        }
        
        // Fallback to mock comments if no comments exist or fetch fails
        const isKhitanMode = themeId === "khitan-1" || themeId === "khitan-2" || (activeTheme && (activeTheme.includes("khitan") || activeTheme === "khitan-1"));
        setComments(isKhitanMode ? INITIAL_MOCK_COMMENTS_KHITAN : INITIAL_MOCK_COMMENTS_BIRTHDAY);
      };

      loadDbData();
      loadComments();
    } else if (themeId) {
      // For default templates, fetch layout config silently in the background
      const loadDefaultThemeDbConfig = async () => {
        try {
          const { data } = await supabase
            .from("invitations")
            .select("layout_config")
            .eq("id", themeId)
            .single();
          if (data && data.layout_config) {
            setInvitationData({
              id: themeId,
              layout_config: data.layout_config
            } as any);
          }
        } catch {
          console.log("No global theme configuration on server, using codebase/local defaults.");
        } finally {
          setIsDbFetched(true);
          setDbLoading(false);
        }
      };
      loadDefaultThemeDbConfig();
      
      const isKhitanMode = themeId === "khitan-1" || themeId === "khitan-2" || (activeTheme && (activeTheme.includes("khitan") || activeTheme === "khitan-1"));
      setComments(isKhitanMode ? INITIAL_MOCK_COMMENTS_KHITAN : INITIAL_MOCK_COMMENTS_BIRTHDAY);
    }
  }, [themeId, isCustomInvitation]);

  // Countdown Timer Effect
  useEffect(() => {
    let parseDateStr = "2026-03-31T10:00:00+07:00";
    if (invitationData && invitationData.event_date) {
      const timePart = invitationData.event_time ? invitationData.event_time.trim() : "10:00";
      const cleanedTime = timePart.match(/^\d{2}:\d{2}/) ? timePart.substring(0, 5) : "10:00";
      parseDateStr = `${invitationData.event_date}T${cleanedTime}:00`;
    }
    
    // Parse targetDate or fallback if parse fails
    let targetDate = new Date(parseDateStr).getTime();
    if (isNaN(targetDate)) {
      // Fallback in case of invalid date formats from DB
      targetDate = new Date("2026-03-31T10:00:00+07:00").getTime();
    }

    const calculateTimeLeft = () => {
      const difference = targetDate - Date.now();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [invitationData]);

  // Download Cover Effect
  useEffect(() => {
    const isDownloadCover = searchParams.get("downloadCover") === "true";
    const filename = searchParams.get("filename") || "cover";
    
    if (isDownloadCover && isConfigLoaded && isDbFetched && !hasTriggeredDownload.current) {
      hasTriggeredDownload.current = true;
      // Tunggu font dan image background selesai diload sempurna
      const timer = setTimeout(async () => {
        const el = document.getElementById("cover-section");
        if (el) {
          try {
            console.log("Starting html-to-image capture...");
            const dataUrl = await htmlToImage.toJpeg(el, { 
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: "#ffffff",
            });
            console.log("html-to-image capture success, generating JPG...");
            
            // Trigger download
            const link = document.createElement("a");
            link.download = `${filename}.jpg`;
            link.href = dataUrl;
            link.click();
            
            // Beritahu parent window (Admin Panel) jika ada
            if (window.opener) {
              window.opener.postMessage("DOWNLOAD_COVER_DONE_" + themeId, "*");
            } else if (window.parent !== window) {
              window.parent.postMessage("DOWNLOAD_COVER_DONE_" + themeId, "*");
            }
          } catch (err) {
            console.error("Screenshot error:", err);
            if (window.opener) {
              window.opener.postMessage("DOWNLOAD_COVER_ERROR_" + themeId, "*");
            } else if (window.parent !== window) {
              window.parent.postMessage("DOWNLOAD_COVER_ERROR_" + themeId, "*");
            }
          }
        } else {
          console.error("Screenshot error: #cover-section element not found!");
          if (window.opener) {
            window.opener.postMessage("DOWNLOAD_COVER_ERROR_" + themeId, "*");
          } else if (window.parent !== window) {
            window.parent.postMessage("DOWNLOAD_COVER_ERROR_" + themeId, "*");
          }
        }
      }, 3500); // Wait 3.5s to ensure bg images from supabase load completely
      return () => clearTimeout(timer);
    }
  }, [searchParams, isConfigLoaded, isDbFetched, themeId]);

  // Intersection Observer Effect
  useEffect(() => {
    if (!isOpened) return;
    
    const sections = ["profile", "event", "gallery", "rsvp", "checkin"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("-section", "");
          setActiveNavTab(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach((sec) => {
      const el = document.getElementById(`${sec}-section`);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((sec) => {
        const el = document.getElementById(`${sec}-section`);
        if (el) observer.unobserve(el);
      });
    };
  }, [isOpened]);

  // Local Storage and Hash Loading Effect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        try {
          const decoded = decodeURIComponent(escape(atob(hash.substring(1))));
          if (decoded) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGuestName(decoded);
            setFormName(decoded);
          }
        } catch {
          try {
            const decoded = atob(hash.substring(1));
            if (decoded) {
              setGuestName(decoded);
              setFormName(decoded);
            }
          } catch {}
        }
      }

      // Scoped load from localStorage is handled by the activeTheme useEffect below

      // Load panel position
      const savedPos = localStorage.getItem("bintarti_panel_position");
      if (savedPos === "left" || savedPos === "right" || savedPos === "bottom") {
        setPanelPosition(savedPos);
      }
    }
  }, []);

  // Effect to load config when themeId, activeTheme or invitationData changes
  useEffect(() => {
    if (isConfigLoaded) return;
    if (!isDbFetched) return;
    if (typeof window !== "undefined" && themeId) {
      const defaultForTheme = getDefaultConfigForTheme(activeTheme);

      // Resolve default config fallback, overriding with dynamic baseTemplateConfig if fetched from database
      let resolvedDefaultForTheme = defaultForTheme;
      if (isCustomInvitation && baseTemplateConfig) {
        try {
          const parsedBase = JSON.parse(baseTemplateConfig);
          resolvedDefaultForTheme = {
            ...defaultForTheme,
            ...parsedBase
          };
        } catch (e) {
          console.error("Error parsing baseTemplateConfig JSON:", e);
        }
      }
      
      // Clone it to prevent mutating global constants
      resolvedDefaultForTheme = {
        ...resolvedDefaultForTheme,
      };
      (resolvedDefaultForTheme as any).global = { ...(resolvedDefaultForTheme as any).global };
      
      if (invitationData && (invitationData as any).music) {
        (resolvedDefaultForTheme as any).global.musicUrl = (invitationData as any).music;
      }

      // 1. Try loading from database first if invitationData exists
      if (invitationData) {
        const dbConfig = (invitationData as any).layout_config;
        if (dbConfig) {
          try {
            const parsed = typeof dbConfig === "string" ? JSON.parse(dbConfig) : dbConfig;
            
            if ((invitationData as any).music) {
                if (!parsed.global) parsed.global = {};
                parsed.global.musicUrl = (invitationData as any).music;
            }
            
            setLayoutConfig({
              ...resolvedDefaultForTheme,
              ...parsed
            });
            setIsConfigLoaded(true);
            return;
          } catch (e) {
            console.error("Error parsing db layout_config:", e);
          }
        }
      }

      // 2. Fallback to localStorage
      const savedConfig = localStorage.getItem(`bintarti_theme_config_${themeId}`);
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setLayoutConfig({
            ...resolvedDefaultForTheme,
            ...parsed
          });
        } catch {
          setLayoutConfig(resolvedDefaultForTheme);
        }
      } else {
        setLayoutConfig(resolvedDefaultForTheme);
      }
      setIsConfigLoaded(true);
    }
  }, [themeId, activeTheme, invitationData, isCustomInvitation, isConfigLoaded, isDbFetched, baseTemplateConfig]);

  const galleryImages = useMemo(() => {
    if (isKhitan) {
      return [
        `/templates/${activeTheme}/gallery-1.jpg`,
        `/templates/${activeTheme}/gallery-2.jpg`,
        `/templates/${activeTheme}/gallery-3.jpg`,
        `/templates/${activeTheme}/gallery-4.jpg`
      ];
    }
    if (activeTheme === "birthday-8") {
      return [
        "/templates/birthday-8/kid-1.jpg",
        "/templates/birthday-8/kid-2.jpg",
        "/templates/birthday-8/kid-1.jpg"
      ];
    }
    if (activeTheme === "birthday-6") {
      return [
        "/templates/birthday-2/kid-1.jpg",
        "/templates/birthday-2/kid-2.jpg",
        "/templates/birthday-2/kid-3.jpg"
      ];
    }
    if (activeTheme === "birthday-5") {
      return [
        "/templates/birthday-5/kid-1.jpg",
        "/templates/birthday-5/kid-2.jpg",
        "/templates/birthday-5/kid-3.jpg"
      ];
    }
    return activeTheme === "birthday-1"
      ? [
          "/templates/birthday-1/kid-1.jpg",
          "/templates/birthday-1/kid-2.jpg",
          "/templates/birthday-1/kid-3.jpg"
        ]
      : [
          "/templates/birthday-2/kid-1.jpg",
          "/templates/birthday-2/kid-2.jpg",
          "/templates/birthday-2/kid-3.jpg"
        ];
  }, [activeTheme]);

  const galleryList = useMemo(() => {
    let customGallery: string[] = [];
    if (invitationData && invitationData.gallery_images) {
      if (Array.isArray(invitationData.gallery_images)) {
        customGallery = invitationData.gallery_images;
      } else if (typeof invitationData.gallery_images === "string") {
        try {
          const parsed = JSON.parse(invitationData.gallery_images);
          if (Array.isArray(parsed)) {
            customGallery = parsed;
          }
        } catch {
          customGallery = invitationData.gallery_images.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "");
        }
      }
    }
    return customGallery.length > 0 ? customGallery : galleryImages;
  }, [invitationData?.gallery_images, galleryImages]);

  // Dynamic mapped variables from Supabase (falling back to mock data)
  const {
    childFullName,
    parentsName,
    childNickname,
    birthdayAge,
    eventLocationStr,
    eventDateStr,
    eventTimeStr,
    invitedGuestsList,
    bankAccounts,
    isLegacyBank,
    showEnvelopeSection,
    showCheckin,
    filteredNavItems,
    scheduleLines,
    showActivities,
    showVideo,
    showTurut,
    childPhoto,
    activitiesPhoto
  } = useMemo(() => {
    const childPhoto = (invitationData && invitationData.child_photo_url) 
      ? invitationData.child_photo_url 
      : (isKhitan ? `/templates/${activeTheme}/kid.png` : activeTheme === "birthday-8" ? "/templates/birthday-8/kid-1.jpg" : activeTheme === "birthday-5" ? "/templates/birthday-5/kid-1.jpg" : activeTheme === "birthday-1" ? "/templates/birthday-1/kid-1.jpg" : "/templates/birthday-2/kid-1.jpg");

    const activitiesPhoto = (invitationData && invitationData.activities_photo_url) 
      ? invitationData.activities_photo_url 
      : (isKhitan ? `/templates/${activeTheme}/kid2.png` : activeTheme === "birthday-8" ? "/templates/birthday-8/kid-2.jpg" : activeTheme === "birthday-5" ? "/templates/birthday-5/kid-2.jpg" : activeTheme === "birthday-1" ? "/templates/birthday-1/kid-2.jpg" : "/templates/birthday-2/kid-2.jpg");

    const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : (isKhitan ? "Saka Niskala" : activeTheme === "birthday-8" ? "Saka Niskala" : activeTheme === "birthday-5" ? "Putu Gede Satria Wijaya" : "Kanaya Almirha");
    const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : (isKhitan ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila" : "Bapak Hendra Pratama & Ibu Sari Dewi");
    const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : (isKhitan ? "Saka" : activeTheme === "birthday-8" ? "Saka" : activeTheme === "birthday-5" ? "Satria" : "Kanaya");
    const birthdayAge = (invitationData && invitationData.birthday_age) ? invitationData.birthday_age : "5";
    const rawEventDate = (invitationData && invitationData.event_date) ? invitationData.event_date : (isKhitan ? "2026-03-31" : "2026-03-31");
    const rawEventTime = (invitationData && invitationData.event_time) ? invitationData.event_time : "10:00 WIB";
    const eventLocationStr = (invitationData && invitationData.event_location) ? invitationData.event_location : "Pranaya Java Hotel Bandung";
    const eventDateStr = formatFriendlyDate(rawEventDate);
    const eventTimeStr = formatFriendlyTime(rawEventTime);

    const invitedGuestsList = invitationData && invitationData.invited_guests
      ? invitationData.invited_guests.split('\n').filter((g: string) => g.trim() !== '')
      : [
          "Bapak Hendra Pratama",
          "Ibu Sari Dewi Pratama",
          "Bapak Sunaryo",
          "Bapak Djohan Setiabudi"
        ];

    let bankAccounts: Array<{ bankName: string; accountNumber: string; recipientName: string }> = [];
    let isLegacyBank = false;
    if (invitationData && invitationData.bank_account) {
      try {
        const parsed = JSON.parse(invitationData.bank_account);
        if (Array.isArray(parsed)) {
          bankAccounts = parsed.filter(acc => (acc.bankName && acc.bankName.trim() !== "") || (acc.accountNumber && acc.accountNumber.trim() !== "") || (acc.recipientName && acc.recipientName.trim() !== ""));
        } else {
          isLegacyBank = true;
        }
      } catch {
        isLegacyBank = true;
      }
    } else if (isKhitan && (!isCustomInvitation || (isCustomInvitation && (!invitationData?.bank_account || invitationData?.bank_account.trim() === "" || invitationData?.bank_account === "[]")))) {
      bankAccounts = [
        { bankName: "BANK BCA", accountNumber: "1234 5678 90", recipientName: "Adrian Mahendra" },
        { bankName: "OVO / GOPAY", accountNumber: "0812 3456 7890", recipientName: "Natasha Salsabila" }
      ];
    }

    const showEnvelopeSection = !isCustomInvitation || (
      (!isLegacyBank && bankAccounts.length > 0) || 
      (isLegacyBank && invitationData?.bank_account && invitationData.bank_account.trim() !== "")
    );

    const showCheckin = !isCustomInvitation || (invitationData && !!invitationData.is_pro);

    const filteredNavItems = navItems.filter(item => {
      if ((layoutConfig[item.id as keyof ThemeConfig] as any)?.hidden) return false;
      if (item.id === "envelope") return showEnvelopeSection;
      return true;
    });

    const scheduleLines = invitationData && invitationData.schedule
      ? invitationData.schedule.split('\n').filter((line: string) => line.trim() !== '')
      : (isKhitan ? [
          "08:00 - Pembukaan",
          "08:30 - Prosesi Utama",
          "09:30 - Prosesi Adat & Doa",
          "10:30 - Ramah Tamah & Penutup"
        ] : []);

    const showActivities = !isCustomInvitation || scheduleLines.length > 0;
    const showVideo = !isCustomInvitation || (invitationData && invitationData.video_link && invitationData.video_link.trim() !== "");
    const showTurut = !isCustomInvitation || (invitationData && invitationData.invited_guests && invitationData.invited_guests.trim() !== "");

    return {
      childFullName,
      parentsName,
      childNickname,
      birthdayAge,
      eventLocationStr,
      eventDateStr,
      eventTimeStr,
      invitedGuestsList,
      bankAccounts,
      isLegacyBank,
      showEnvelopeSection,
      showCheckin,
      filteredNavItems,
      scheduleLines,
      showActivities,
      showVideo,
      showTurut,
      childPhoto,
      activitiesPhoto
    };
  }, [invitationData, activeTheme, isCustomInvitation]);

  const renderKhitanOrnaments = (position?: "top" | "bottom" | "both") => {
    if (position) {}
    return null;
  };

  const renderCustomOrnaments = (sectionKey: keyof ThemeConfig) => {
    const sectionConf = layoutConfig[sectionKey];
    if (!sectionConf || !sectionConf.ornaments) return null;

    return (
      <>
        {sectionConf.ornaments.map((ornament: OrnamentConfig, idx: number) => {
          if (!ornament) return null;
          const isSelected = selectedElement && selectedElement.section === sectionKey && selectedElement.type === "ornament" && selectedElement.key === ornament.id;
          let animationClass = "";
          if (ornament.animation === "float" || !ornament.animation) animationClass = "animate-idle-float";
          else if (ornament.animation === "spin") animationClass = "animate-spin-slow";
          else if (ornament.animation === "pulse") animationClass = "animate-pulse";

          return (
            <div
              key={ornament.id}
              className={`absolute z-10 ${designerOpen ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-500/80' : 'pointer-events-none'} ${isSelected ? 'outline outline-2 outline-blue-500' : ''}`}
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${ornament.transformX}px, ${ornament.transformY}px)`,
                touchAction: designerOpen ? "none" : "auto",
              }}
              onPointerDown={(e: React.PointerEvent) => {
                if (!designerOpen) return;
                e.stopPropagation();
                e.preventDefault();
                handlePointerDown(e, sectionKey, "ornament", ornament.id);
              }}
            >
              <div className={animationClass}>
                <img
                  src={ornament.url}
                  alt="Ornament"
                  className="object-contain"
                  style={{
                    width: `${100 * ornament.scale}px`,
                    height: `${100 * ornament.scale}px`,
                    pointerEvents: "none",
                    transform: ornament.flipHorizontal ? "scaleX(-1)" : "none"
                  }}
                />
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const handleNavClick = (id: string) => {
    const element = document.getElementById(`${id}-section`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ==========================================
  // 2. CONDITIONAL RETURNS (EARLY RETURNS) MUST BE AFTER ALL HOOKS
  // ==========================================
  
  if (themeId !== "khitan-1" && themeId !== "khitan-2" && themeId !== "khitan-3" && themeId !== "khitan-4" && themeId !== "khitan-5" && themeId !== "khitan-6" && themeId !== "khitan-7" && themeId !== "khitan-8" && themeId !== "khitan-9" && themeId !== "birthday-1" && themeId !== "birthday-2" && themeId !== "birthday-3" && themeId !== "birthday-4" && themeId !== "birthday-5" && themeId !== "birthday-6" && themeId !== "birthday-7" && themeId !== "birthday-8" && !isCustomInvitation) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-slate-800">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">Maaf, tautan undangan yang Anda tuju tidak tersedia atau penulisan namanya kurang tepat.</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 transition-colors text-white rounded-xl text-xs font-bold shadow-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 mt-4">Memuat data undangan kustom Anda...</p>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold text-slate-800">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">{dbError}</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 transition-colors text-white rounded-xl text-xs font-bold shadow-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ==========================================
  // 3. RENDER VARIABLES MAPPING (SAFE TO PLACE AFTER CONDITIONAL RETURNS)
  // ==========================================

  const themeStyle = THEME_STYLES[activeTheme];

  const getSectionBadgeStyle = (sectionKey: keyof ThemeConfig, defaultFont: any, defaultColor: string) => {
    const conf = layoutConfig[sectionKey];
    if (!conf) return { ...defaultFont, color: defaultColor };
    
    let fontStyle = defaultFont;
    const resolvedFont = conf.badgeFontFamily || conf.fontFamily;
    if (resolvedFont) {
      if (resolvedFont === "Atma") fontStyle = atmaFontRaw;
      else if (resolvedFont === "Averia") fontStyle = averiaFontRaw;
      else if (resolvedFont === "Bree") fontStyle = breeFont;
      else if (resolvedFont === "Cookie") fontStyle = cookieFont;
      else if (resolvedFont === "Beth") fontStyle = bethFont;
      else if (resolvedFont === "Bungee") fontStyle = bungeeFont;
      else if (resolvedFont === "BungeeInline") fontStyle = bungeeInlineFont;
      else if (resolvedFont === "Rolleston") fontStyle = playfairDisplayFont;
      else if (resolvedFont === "Karla") fontStyle = karlaFont;
      else if (resolvedFont === "LucidaCalligraphy") fontStyle = lucidaCalligraphyFont;
      else if (resolvedFont === "ArefRuqaa") fontStyle = arefRuqaaFont;
      else if (resolvedFont === "SansSerif") fontStyle = { fontFamily: "sans-serif" };
    }

    const color = conf.badgeFontColor || conf.fontColor || defaultColor;
    const scale = conf.badgeFontScale !== undefined ? conf.badgeFontScale : 1.0;
    const fontScale = conf.fontScale !== undefined ? conf.fontScale : 1.0;

    return {
      ...fontStyle,
      color,
      fontSize: scale !== 1.0 || fontScale !== 1.0 ? `calc(${fontScale} * ${scale} * 100%)` : undefined,
      lineHeight: conf.lineHeight ? conf.lineHeight : undefined
    };
  };

  const getSectionHeaderStyle = (sectionKey: keyof ThemeConfig, defaultFont: any, defaultColor: string) => {
    const conf = layoutConfig[sectionKey];
    if (!conf) return { ...defaultFont, color: defaultColor };
    
    // Resolve font family object
    let fontStyle = defaultFont;
    const resolvedFont = conf.headerFontFamily || conf.fontFamily;
    if (resolvedFont) {
      if (resolvedFont === "Atma") fontStyle = atmaFontRaw;
      else if (resolvedFont === "Averia") fontStyle = averiaFontRaw;
      else if (resolvedFont === "Bree") fontStyle = breeFont;
      else if (resolvedFont === "Cookie") fontStyle = cookieFont;
      else if (resolvedFont === "Beth") fontStyle = bethFont;
      else if (resolvedFont === "Bungee") fontStyle = bungeeFont;
      else if (resolvedFont === "BungeeInline") fontStyle = bungeeInlineFont;
      else if (resolvedFont === "Rolleston") fontStyle = playfairDisplayFont;
      else if (resolvedFont === "Karla") fontStyle = karlaFont;
      else if (resolvedFont === "LucidaCalligraphy") fontStyle = lucidaCalligraphyFont;
      else if (resolvedFont === "ArefRuqaa") fontStyle = arefRuqaaFont;
      else if (resolvedFont === "SansSerif") fontStyle = { fontFamily: "sans-serif" };
    }

    // Resolve color
    const color = conf.headerFontColor || conf.fontColor || defaultColor;

    // Resolve scale
    const scale = conf.headerFontScale !== undefined ? conf.headerFontScale : 1.0;
    const fontScale = conf.fontScale !== undefined ? conf.fontScale : 1.0;

    return {
      ...fontStyle,
      color,
      fontSize: scale !== 1.0 || fontScale !== 1.0 ? `calc(${fontScale} * ${scale} * 100%)` : undefined,
      lineHeight: conf.lineHeight ? conf.lineHeight : undefined
    };
  };

  const getSectionBodyStyle = (sectionKey: keyof ThemeConfig, defaultFont: any, defaultColor: string) => {
    const conf = layoutConfig[sectionKey];
    const defaultThemeColor = THEME_STYLES[activeTheme]?.mainTextColor || defaultColor;
    if (!conf) return { ...defaultFont, color: defaultThemeColor };
    
    // Resolve font family object
    let fontStyle = defaultFont;
    const resolvedFont = conf.bodyFontFamily || conf.fontFamily;
    if (resolvedFont) {
      if (resolvedFont === "Atma") fontStyle = atmaFontRaw;
      else if (resolvedFont === "Averia") fontStyle = averiaFontRaw;
      else if (resolvedFont === "Bree") fontStyle = breeFont;
      else if (resolvedFont === "Cookie") fontStyle = cookieFont;
      else if (resolvedFont === "Beth") fontStyle = bethFont;
      else if (resolvedFont === "Bungee") fontStyle = bungeeFont;
      else if (resolvedFont === "BungeeInline") fontStyle = bungeeInlineFont;
      else if (resolvedFont === "Rolleston") fontStyle = playfairDisplayFont;
      else if (resolvedFont === "Karla") fontStyle = karlaFont;
      else if (resolvedFont === "LucidaCalligraphy") fontStyle = lucidaCalligraphyFont;
      else if (resolvedFont === "ArefRuqaa") fontStyle = arefRuqaaFont;
      else if (resolvedFont === "SansSerif") fontStyle = { fontFamily: "sans-serif" };
    }

    // Resolve color
    const color = conf.bodyFontColor || conf.fontColor || defaultThemeColor;

    // Resolve scale
    const scale = conf.bodyFontScale !== undefined ? conf.bodyFontScale : 1.0;
    const fontScale = conf.fontScale !== undefined ? conf.fontScale : 1.0;

    return {
      ...fontStyle,
      color,
      fontSize: scale !== 1.0 || fontScale !== 1.0 ? `calc(${fontScale} * ${scale} * 100%)` : undefined,
      lineHeight: conf.lineHeight ? conf.lineHeight : undefined
    };
  };

  const getSectionBottomStyle = (sectionKey: keyof ThemeConfig, defaultFont: any, defaultColor: string) => {
    const conf = layoutConfig[sectionKey];
    const defaultThemeColor = THEME_STYLES[activeTheme]?.mainTextColor || defaultColor;
    if (!conf) return { ...defaultFont, color: defaultThemeColor };
    
    // Resolve font family object
    let fontStyle = defaultFont;
    const resolvedFont = conf.bottomFontFamily || conf.fontFamily;
    if (resolvedFont) {
      if (resolvedFont === "Atma") fontStyle = atmaFontRaw;
      else if (resolvedFont === "Averia") fontStyle = averiaFontRaw;
      else if (resolvedFont === "Bree") fontStyle = breeFont;
      else if (resolvedFont === "Cookie") fontStyle = cookieFont;
      else if (resolvedFont === "Beth") fontStyle = bethFont;
      else if (resolvedFont === "Bungee") fontStyle = bungeeFont;
      else if (resolvedFont === "BungeeInline") fontStyle = bungeeInlineFont;
      else if (resolvedFont === "Rolleston") fontStyle = playfairDisplayFont;
      else if (resolvedFont === "Karla") fontStyle = karlaFont;
      else if (resolvedFont === "LucidaCalligraphy") fontStyle = lucidaCalligraphyFont;
      else if (resolvedFont === "ArefRuqaa") fontStyle = arefRuqaaFont;
      else if (resolvedFont === "SansSerif") fontStyle = { fontFamily: "sans-serif" };
    }

    // Resolve color
    const color = conf.bottomFontColor || conf.fontColor || defaultThemeColor;

    // Resolve scale
    const scale = conf.bottomFontScale !== undefined ? conf.bottomFontScale : 1.0;
    const fontScale = conf.fontScale !== undefined ? conf.fontScale : 1.0;

    return {
      ...fontStyle,
      color,
      fontSize: scale !== 1.0 || fontScale !== 1.0 ? `calc(${fontScale} * ${scale} * 100%)` : undefined,
      lineHeight: conf.lineHeight ? conf.lineHeight : undefined
    };
  };

  const getFontFamilyValue = (fontName: string) => {
    if (fontName === "Atma") return "'Atma', cursive";
    if (fontName === "Averia") return "'Averia Gruesa Libre', sans-serif";
    if (fontName === "Bree") return "var(--font-bree-serif), serif";
    if (fontName === "Cookie") return "var(--font-cookie), cursive";
    if (fontName === "Beth") return "var(--font-beth-ellen), cursive";
    if (fontName === "Bungee") return "var(--font-bungee), sans-serif";
    if (fontName === "BungeeInline") return "var(--font-bungee-inline), sans-serif";
    if (fontName === "SansSerif") return "sans-serif";
    if (fontName === "Karla") return "var(--font-karla), sans-serif";
    if (fontName === "Rolleston") return "var(--font-playfair-display), serif";
    if (fontName === "LucidaCalligraphy") return "'Lucida Calligraphy', 'Lucida Handwriting', cursive";
    if (fontName === "ArefRuqaa") return "var(--font-aref-ruqaa), serif";
    if (fontName === "BetterSaturday") return "'Better Saturday', cursive";
    if (fontName === "BetterSaturday") return "'Better Saturday', cursive";
    return undefined;
  };

  const getBankCardClass = () => {
    if (activeTheme === "khitan-2") return "bg-[#ebdcc7]/50 border-[#8c6239]/30";
    if (activeTheme === "khitan-1") return "bg-blue-50/80 border-blue-200/60";
    if (activeTheme === "khitan-3") return "bg-[#e0f2f1]/80 border-teal-300/50";
    if (activeTheme === "khitan-4") return "bg-white/90 border-blue-200";
    if (activeTheme === "khitan-5") return "bg-slate-900/95 border-sky-500/35";
    if (activeTheme === "khitan-6") return "bg-[#f4efe6]/90 border-[#B89047]/30";
    if (activeTheme === "khitan-7") return "bg-sky-50/90 border-sky-300/40 text-[#0369A1]";
    if (activeTheme === "khitan-8") return "bg-[#F3F4F6]/90 border-teal-600/30 text-[#0F766E]";
    if (activeTheme === "khitan-9") return "bg-slate-900/90 border-cyan-600/50 text-cyan-400";
    if (activeTheme === "birthday-8") return "bg-amber-50/80 border-amber-100";
    if (activeTheme === "birthday-7") return "bg-blue-50/80 border-blue-100";
    if (activeTheme === "birthday-6") return "bg-pink-50/80 border-pink-100";
    if (activeTheme === "birthday-4") return "bg-lime-55/80 border-lime-100";
    if (activeTheme === "birthday-3" || activeTheme === "birthday-5") return "bg-amber-55/80 border-amber-100";
    if (activeTheme === "birthday-2") return "bg-emerald-55/80 border-emerald-100";
    return "bg-blue-50/80 border-blue-100";
  };

  const getBankBtnClass = () => {
    if (activeTheme === "khitan-1") return "bg-[#1214a1]";
    if (activeTheme === "khitan-2") return "bg-[#5C3D2E]";
    if (activeTheme === "khitan-3") return "bg-[#0D5C68]";
    if (activeTheme === "khitan-4") return "bg-[#2563EB]";
    if (activeTheme === "khitan-5") return "bg-[#0284C7]";
    if (activeTheme === "khitan-6") return "bg-[#7A5C2D]";
    if (activeTheme === "khitan-7") return "bg-[#EA580C]";
    if (activeTheme === "khitan-8") return "bg-[#0F766E]";
    if (activeTheme === "khitan-9") return "bg-cyan-600";
    if (activeTheme === "birthday-8") return "bg-[#EF8D20]";
    if (activeTheme === "birthday-7") return "bg-[#7B68B1]";
    if (activeTheme === "birthday-6") return "bg-pink-650";
    if (activeTheme === "birthday-4") return "bg-lime-600";
    if (activeTheme === "birthday-3" || activeTheme === "birthday-5") return "bg-amber-600";
    if (activeTheme === "birthday-2") return "bg-emerald-600";
    return "bg-blue-600";
  };

    const getTextProps = (sectionKey: keyof ThemeConfig, elementKey: string, defaultFont: any, defaultColor: string) => {
    const elConfig = layoutConfig[sectionKey] || {};
    
    // Support custom elements visibility check
    const customElements = (elConfig as any).customElements || [];
    const customEl = customElements.find((c: any) => c.id === elementKey);

    const isSelected = selectedElement && selectedElement.section === sectionKey && selectedElement.type === "default" && selectedElement.key === elementKey;
    const conf = layoutConfig[sectionKey];
    
    let baseStyles: React.CSSProperties = {};
    if (elementKey === "header") {
      baseStyles = getSectionHeaderStyle(sectionKey, defaultFont, defaultColor);
    } else if (elementKey === "body") {
      baseStyles = getSectionBodyStyle(sectionKey, defaultFont, defaultColor);
    } else if (elementKey === "bottom") {
      baseStyles = getSectionBottomStyle(sectionKey, defaultFont, defaultColor);
    } else if (elementKey === "badge") {
      baseStyles = getSectionBadgeStyle(sectionKey, defaultFont, defaultColor);
    } else {
      let fontStyle = defaultFont;
      const resolvedFont = conf && (conf as any)[`${elementKey}FontFamily`] || conf?.fontFamily;
      if (resolvedFont) {
        if (resolvedFont === "Atma") fontStyle = atmaFontRaw;
        else if (resolvedFont === "Averia") fontStyle = averiaFontRaw;
        else if (resolvedFont === "Bree") fontStyle = breeFont;
        else if (resolvedFont === "Cookie") fontStyle = cookieFont;
        else if (resolvedFont === "Beth") fontStyle = bethFont;
        else if (resolvedFont === "Bungee") fontStyle = bungeeFont;
        else if (resolvedFont === "BungeeInline") fontStyle = bungeeInlineFont;
        else if (resolvedFont === "Rolleston") fontStyle = playfairDisplayFont;
        else if (resolvedFont === "Karla") fontStyle = karlaFont;
        else if (resolvedFont === "LucidaCalligraphy") fontStyle = lucidaCalligraphyFont;
        else if (resolvedFont === "ArefRuqaa") fontStyle = arefRuqaaFont;
        else if (resolvedFont === "BetterSaturday") fontStyle = betterSaturdayFontRaw;
        else if (resolvedFont === "BetterSaturday") fontStyle = betterSaturdayFontRaw;
        else if (resolvedFont === "SansSerif") fontStyle = { fontFamily: "sans-serif" };
      }
      const color = conf && (conf as any)[`${elementKey}FontColor`] || conf?.fontColor || defaultColor;
      const scale = conf && (conf as any)[`${elementKey}FontScale`] !== undefined ? (conf as any)[`${elementKey}FontScale`] : 1.0;
      const fontScale = conf?.fontScale !== undefined ? conf.fontScale : 1.0;
      baseStyles = {
        ...fontStyle,
        color,
        fontSize: scale !== 1.0 || fontScale !== 1.0 ? `calc(${fontScale} * ${scale} * 100%)` : undefined,
        lineHeight: conf?.lineHeight ? conf.lineHeight : undefined
      };
    }

    const marginTop = conf && (conf as any)[`${elementKey}MarginTop`] !== undefined ? (conf as any)[`${elementKey}MarginTop`] : 0;
    const marginBottom = conf && (conf as any)[`${elementKey}MarginBottom`] !== undefined ? (conf as any)[`${elementKey}MarginBottom`] : 0;
    const marginLeft = conf && (conf as any)[`${elementKey}MarginLeft`] !== undefined ? (conf as any)[`${elementKey}MarginLeft`] : 0;
    const marginRight = conf && (conf as any)[`${elementKey}MarginRight`] !== undefined ? (conf as any)[`${elementKey}MarginRight`] : 0;
    const paddingTop = conf && (conf as any)[`${elementKey}PaddingTop`] !== undefined ? (conf as any)[`${elementKey}PaddingTop`] : 0;
    const paddingBottom = conf && (conf as any)[`${elementKey}PaddingBottom`] !== undefined ? (conf as any)[`${elementKey}PaddingBottom`] : 0;
    const paddingLeft = conf && (conf as any)[`${elementKey}PaddingLeft`] !== undefined ? (conf as any)[`${elementKey}PaddingLeft`] : 0;
    const paddingRight = conf && (conf as any)[`${elementKey}PaddingRight`] !== undefined ? (conf as any)[`${elementKey}PaddingRight`] : 0;
    const width = conf && (conf as any)[`${elementKey}Width`] !== undefined ? (conf as any)[`${elementKey}Width`] : 100;
    const transformX = conf && (conf as any)[`${elementKey}TransformX`] !== undefined ? (conf as any)[`${elementKey}TransformX`] : 0;
    const transformY = conf && (conf as any)[`${elementKey}TransformY`] !== undefined ? (conf as any)[`${elementKey}TransformY`] : 0;

    const isHidden = conf && (
      elementKey === "badge" ? conf.hideBadge :
      elementKey === "header" ? conf.hideHeader :
      elementKey === "body" ? conf.hideBody :
      elementKey === "bottom" ? conf.hideBottom : false
    );

    const mergedStyles: React.CSSProperties = {
      ...baseStyles,
      marginTop: `${marginTop}px`,
      marginBottom: `${marginBottom}px`,
      marginLeft: marginLeft !== 0 ? `${marginLeft}px` : (width !== 100 ? 'auto' : '0px'),
      marginRight: marginRight !== 0 ? `${marginRight}px` : (width !== 100 ? 'auto' : '0px'),
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingLeft: `${paddingLeft}px`,
      paddingRight: `${paddingRight}px`,
      width: width !== 100 ? `${width}%` : undefined,
      maxWidth: width !== 100 ? "none" : undefined,
      transform: (transformX !== 0 || transformY !== 0) ? `translate(${transformX}px, ${transformY}px)` : undefined,
      order: getOrderIndex(sectionKey, elementKey),
      position: "relative",
      zIndex: isSelected ? 10 : 1,
      ...(designerOpen ? { cursor: "pointer" } : {}),
      ...(isHidden ? { display: "none" } : {})
    };

    const isEditingThis = editingTextElement?.section === sectionKey && editingTextElement?.key === elementKey;
    const animationClass = conf && (conf as any)[`${elementKey}AnimationClass`] || conf?.animationClass || "";
    return {
      id: `el-${sectionKey}-${elementKey}`,
      style: mergedStyles,
      className: `${designerOpen ? `touch-none hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-500/80 transition-all duration-150 ${isSelected ? "outline outline-2 outline-blue-600 shadow-sm bg-blue-500/10" : ""}` : ""} font-${elementKey}-custom ${animationClass}`,
      onDoubleClick: (e: any) => {
        if (!designerOpen) return;
        e.stopPropagation();
        
        let currentText = e.currentTarget.innerText || e.currentTarget.textContent || "";
        if (customEl && customEl.text) {
           currentText = customEl.text;
        }
        
        setInlineEditingKey({ section: sectionKey, key: elementKey, type: customEl ? 'custom' : 'fixed', currentText });
        setInlineEditingValue(currentText);
      },
      onPointerDown: designerOpen ? (e: React.PointerEvent) => {
        if (isEditingThis) return;
        e.stopPropagation();
        handlePointerDown(e, sectionKey, "default", elementKey);
      } : undefined
    };
  };

  const renderCustomElements = (sectionKey: keyof ThemeConfig) => {
    const elements = layoutConfig[sectionKey]?.customElements || [];
    return elements.map((el: any) => {
      const isElSelected = selectedElement && selectedElement.section === sectionKey && selectedElement.type === "custom" && selectedElement.key === el.id;
      
      const customElStyle: React.CSSProperties = {
      fontFamily: getFontFamilyValue(el.fontFamily || "SansSerif"),
        fontSize: `${el.fontSize || 14}px`,
        color: el.fontColor || '#ffffff',
        marginTop: `${el.marginTop || 0}px`,
        marginBottom: `${el.marginBottom || 0}px`,
        marginLeft: el.marginLeft ? `${el.marginLeft}px` : (el.width !== undefined && el.width !== 100 ? 'auto' : '0px'),
        marginRight: el.marginRight ? `${el.marginRight}px` : (el.width !== undefined && el.width !== 100 ? 'auto' : '0px'),
        paddingTop: `${el.paddingTop || 0}px`,
        paddingBottom: `${el.paddingBottom || 0}px`,
        paddingLeft: `${el.paddingLeft || 0}px`,
        paddingRight: `${el.paddingRight || 0}px`,
        width: el.width !== undefined && el.width !== 100 ? `${el.width}%` : undefined,
        cursor: "pointer",
        textAlign: "center",
        wordBreak: "break-word",
        touchAction: designerOpen ? "none" : "auto",
        whiteSpace: "pre-line",
        display: "block",
        transform: (el.transformX !== undefined || el.transformY !== undefined) ? `translate(${el.transformX || 0}px, ${el.transformY || 0}px)` : undefined,
        order: getOrderIndex(sectionKey, el.id),
        position: "relative",
        zIndex: isElSelected ? 10 : 1,
      };

      return (
        <div
          key={el.id}
          id={`el-${sectionKey}-${el.id}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSection(sectionKey);
            setSelectedElement({ section: sectionKey, type: "custom", key: el.id });
          }}
          className={`hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-500/80 transition-all duration-150 ${
            isElSelected ? "outline outline-2 outline-blue-600 shadow-sm bg-blue-500/10" : ""
          } ${el.animationClass || ""}`}
          onDoubleClick={(e) => {
            if(!designerOpen) return;
            e.stopPropagation();
            setInlineEditingKey({ section: sectionKey, key: el.id, type: "custom", currentText: el.text });
            setInlineEditingValue(el.text || "");
          }}
          onPointerDown={designerOpen ? (e: React.PointerEvent) => {
            e.stopPropagation();
            handlePointerDown(e, sectionKey, "custom", el.id);
          } : undefined}
          style={customElStyle}
        >
          {el.text}
        </div>
      );
    });
  };

    const getOrderIndex = (sectionKey: keyof ThemeConfig, elId: string) => {
    const sorted = getSortedElements(sectionKey);
    const idx = sorted.findIndex((el: any) => el.id === elId);
    return idx !== -1 ? idx : 99;
  };

  const getFixedElementProps = (sectionKey: keyof ThemeConfig, elementId: string, elementType: "default" | "avatar" = "default", baseTransform: string = "", extraStyle: React.CSSProperties = {}) => {
    const conf = layoutConfig[sectionKey];
    
    let x = 0;
    let y = 0;
    
    if (elementType === "avatar") {
       x = conf?.avatarX || 0;
       y = conf?.avatarY || 0;
    } else {
       x = conf && (conf as any)[`${elementId}TransformX`] !== undefined ? (conf as any)[`${elementId}TransformX`] : 0;
       y = conf && (conf as any)[`${elementId}TransformY`] !== undefined ? (conf as any)[`${elementId}TransformY`] : 0;
    }
    
    const isSelected = selectedElement && selectedElement.section === sectionKey && selectedElement.type === elementType && selectedElement.key === elementId;
    
    let transformStr = baseTransform;
    if (x !== 0 || y !== 0) {
      transformStr = `${baseTransform} translate(${x}px, ${y}px)`.trim();
    }

    return {
      id: `el-${sectionKey}-${elementId}`,
      style: {
        ...extraStyle,
        order: getOrderIndex(sectionKey, elementId),
        transform: transformStr || undefined,
        cursor: designerOpen ? "pointer" : "auto",
        touchAction: designerOpen ? "none" : "auto",
        zIndex: isSelected ? 10 : undefined
      } as React.CSSProperties,
      className: designerOpen ? ` hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-500/80 transition-all duration-150 ${
        isSelected ? "" : ""
      }` : "",
      onPointerDown: (e: React.PointerEvent) => {
        if (!designerOpen) return;
        e.stopPropagation();
        e.preventDefault();
        handlePointerDown(e, sectionKey, elementType, elementId);
      }
    };
  };

  const getSortedElements = (sectionKey: keyof ThemeConfig) => {
    const conf = layoutConfig[sectionKey];
    const customList = conf?.customElements || [];
    
    let allElements: any[] = [];
    
    if (sectionKey === "cover") {
      allElements = [
        { id: "badge", type: "default" as const, key: "badge", name: "Badge" },
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
        { id: "button", type: "default" as const, key: "button", name: "Tombol Buka" },
      ];
    } else if (sectionKey === "profile") {
      allElements = [
        { id: "badge", type: "default" as const, key: "badge", name: "Badge" },
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "avatar", type: "avatar" as const, key: "avatar", name: "Foto Profil" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
        { id: "parents", type: "default" as const, key: "parents", name: "Parents" },
      ];
    } else if (sectionKey === "event") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "date", type: "default" as const, key: "date", name: "Tanggal" },
        { id: "time", type: "default" as const, key: "time", name: "Waktu" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "location", type: "default" as const, key: "location", name: "Tombol Lokasi" },
        { id: "countdown", type: "default" as const, key: "countdown", name: "Hitungan Mundur" },
        { id: "button", type: "default" as const, key: "button", name: "Simpan Tanggal" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "maps") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "map", type: "default" as const, key: "map", name: "Peta (Map)" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
        { id: "button", type: "default" as const, key: "button", name: "Tombol Maps" },
      ];
    } else if (sectionKey === "activities") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "avatar", type: "avatar" as const, key: "avatar", name: "Foto Aktivitas" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "gallery") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "video", type: "default" as const, key: "video", name: "Video" },
        { id: "gallery", type: "default" as const, key: "gallery", name: "Grid Galeri" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "rsvp") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "form", type: "default" as const, key: "form", name: "Form RSVP" },
        { id: "comments", type: "default" as const, key: "comments", name: "Komentar" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "envelope") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "bank", type: "default" as const, key: "bank", name: "Card Dompet" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "checkin") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "qr", type: "default" as const, key: "qr", name: "QR Code" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else if (sectionKey === "closing") {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "avatar", type: "avatar" as const, key: "avatar", name: "Foto Closing" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "parents", type: "default" as const, key: "parents", name: "Parents" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    } else {
      allElements = [
        { id: "header", type: "default" as const, key: "header", name: "Header" },
        { id: "body", type: "default" as const, key: "body", name: "Body" },
        { id: "bottom", type: "default" as const, key: "bottom", name: "Bottom" },
      ];
    }

    allElements = [
      ...allElements,
      ...customList.map((el: any, idx: number) => ({
        id: el.id,
        type: "custom" as const,
        key: el.id,
        name: el.text ? (el.text.length > 15 ? el.text.substring(0, 15) + "..." : el.text) : `Teks ${idx + 1}`
      }))
    ];

    const order = conf?.elementOrder;
    if (order && Array.isArray(order)) {
      const sorted: typeof allElements = [];
      order.forEach((id) => {
        const found = allElements.find((el) => el.id === id);
        if (found) sorted.push(found);
      });
      allElements.forEach((el) => {
        if (!sorted.find((s) => s.id === el.id)) {
          sorted.push(el);
        }
      });
      return sorted;
    }
    return allElements;
  };

  const moveElementOrder = (sectionKey: keyof ThemeConfig, elementId: string, direction: "up" | "down") => {
    const sorted = getSortedElements(sectionKey);
    const index = sorted.findIndex((el) => el.id === elementId);
    if (index === -1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    
    const newSorted = [...sorted];
    const temp = newSorted[index];
    newSorted[index] = newSorted[targetIndex];
    newSorted[targetIndex] = temp;
    
    const newOrder = newSorted.map((el) => el.id);
    updateConfig("elementOrder" as any, newOrder, sectionKey);
  };

  const renderSingleCustomElement = (sectionKey: keyof ThemeConfig, elId: string) => {
    const el = (layoutConfig[sectionKey]?.customElements || []).find((e: any) => e.id === elId);
    if (!el) return null;
    const isElSelected = selectedElement && selectedElement.section === sectionKey && selectedElement.type === "custom" && selectedElement.key === el.id;
    
    const customElStyle: React.CSSProperties = {
      fontFamily: getFontFamilyValue(el.fontFamily || "SansSerif"),
      fontSize: `${el.fontSize || 14}px`,
      color: el.fontColor || '#ffffff',
      marginTop: `${el.marginTop || 0}px`,
      marginBottom: `${el.marginBottom || 0}px`,
      marginLeft: `${el.marginLeft || 0}px`,
      marginRight: `${el.marginRight || 0}px`,
      transform: (el.transformX || el.transformY) ? `translate(${el.transformX || 0}px, ${el.transformY || 0}px)` : undefined,
      paddingTop: `${el.paddingTop || 0}px`,
      paddingBottom: `${el.paddingBottom || 0}px`,
      paddingLeft: `${el.paddingLeft || 0}px`,
      paddingRight: `${el.paddingRight || 0}px`,
      cursor: "pointer",
      textAlign: "center",
      wordBreak: "break-word",
        touchAction: designerOpen ? "none" : "auto",
      display: "block",
      order: getOrderIndex(sectionKey, el.id)
    };

    return (
      <div
        key={el.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedSection(sectionKey);
          setSelectedElement({ section: sectionKey, type: "custom", key: el.id });
        }}
        className={`hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-500/80 transition-all duration-150 ${
          isElSelected ? "outline outline-2 outline-blue-600 shadow-md bg-blue-500/5" : ""
        }`}
        style={customElStyle}
      >
        {el.text}
      </div>
    );
  };

  const getActiveElementProps = () => {
    if (!selectedElement) return null;
    const { section, type, key } = selectedElement;
    const config = layoutConfig[section];
    if (!config) return null;
    
    if (type === "avatar") {
      return {
        text: "",
        fontFamily: "",
        fontSize: 1.0,
        fontColor: "",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        avatarScale: config.avatarScale !== undefined ? config.avatarScale : 100,
        avatarX: config.avatarX !== undefined ? config.avatarX : 0,
        avatarY: config.avatarY !== undefined ? config.avatarY : 0,
      };
    }
    
    if (type === "default") {
      const fontKey = 
        key === "header" ? "headerFontFamily" : 
        key === "body" ? "bodyFontFamily" : 
        key === "bottom" ? "bottomFontFamily" : 
        key === "badge" ? "badgeFontFamily" : 
        `${key}FontFamily`;
      const scaleKey = 
        key === "header" ? "headerFontScale" : 
        key === "body" ? "bodyFontScale" : 
        key === "bottom" ? "bottomFontScale" : 
        key === "badge" ? "badgeFontScale" : 
        `${key}FontScale`;
      const colorKey = 
        key === "header" ? "headerFontColor" : 
        key === "body" ? "bodyFontColor" : 
        key === "bottom" ? "bottomFontColor" : 
        key === "badge" ? "badgeFontColor" : 
        `${key}FontColor`;
      const textKey = 
        key === "header" ? "headerText" : 
        key === "body" ? "bodyText" : 
        key === "bottom" ? "bottomText" : 
        key === "badge" ? "badgeText" : 
        `${key}Text`;
      const animKey = 
        key === "header" ? "headerAnimationClass" : 
        key === "body" ? "bodyAnimationClass" : 
        key === "bottom" ? "bottomAnimationClass" : 
        key === "badge" ? "badgeAnimationClass" : 
        `${key}AnimationClass`;

      return {
        text: config[textKey] !== undefined ? config[textKey] : "",
        fontFamily: config[fontKey] || "",
        fontSize: config[scaleKey] !== undefined ? config[scaleKey] : 1.0,
        fontColor: config[colorKey] || "#ffffff",
        animationClass: config[animKey] || "",
        marginTop: (config as any)[`${key}MarginTop`] !== undefined ? (config as any)[`${key}MarginTop`] : 0,
        marginBottom: (config as any)[`${key}MarginBottom`] !== undefined ? (config as any)[`${key}MarginBottom`] : 0,
        marginLeft: (config as any)[`${key}MarginLeft`] !== undefined ? (config as any)[`${key}MarginLeft`] : 0,
        marginRight: (config as any)[`${key}MarginRight`] !== undefined ? (config as any)[`${key}MarginRight`] : 0,
        paddingTop: (config as any)[`${key}PaddingTop`] !== undefined ? (config as any)[`${key}PaddingTop`] : 0,
        paddingBottom: (config as any)[`${key}PaddingBottom`] !== undefined ? (config as any)[`${key}PaddingBottom`] : 0,
        paddingLeft: (config as any)[`${key}PaddingLeft`] !== undefined ? (config as any)[`${key}PaddingLeft`] : 0,
        paddingRight: (config as any)[`${key}PaddingRight`] !== undefined ? (config as any)[`${key}PaddingRight`] : 0,
        width: (config as any)[`${key}Width`] !== undefined ? (config as any)[`${key}Width`] : 100,
      };
    } else {
      const el = (config.customElements || []).find((e: any) => e.id === key);
      if (!el) return null;
      return {
        text: el.text || "",
        fontFamily: el.fontFamily || "Karla",
        fontSize: el.fontSize !== undefined ? el.fontSize : 14,
        fontColor: el.fontColor || "#ffffff",
        animationClass: el.animationClass || "",
        marginTop: el.marginTop !== undefined ? el.marginTop : 0,
        marginBottom: el.marginBottom !== undefined ? el.marginBottom : 0,
        marginLeft: el.marginLeft !== undefined ? el.marginLeft : 0,
        marginRight: el.marginRight !== undefined ? el.marginRight : 0,
        paddingTop: el.paddingTop !== undefined ? el.paddingTop : 0,
        paddingBottom: el.paddingBottom !== undefined ? el.paddingBottom : 0,
        paddingLeft: el.paddingLeft !== undefined ? el.paddingLeft : 0,
        paddingRight: el.paddingRight !== undefined ? el.paddingRight : 0,
      };
    }
  };

  const updateActiveElementProp = (propName: string, value: any) => {
    if (!selectedElement) return;
    const { section, type, key } = selectedElement;
    
    if (type === "avatar") {
      updateConfig(propName as any, value, section);
      return;
    }
    
    if (type === "default") {
      let actualProp = propName;
      if (propName === "fontFamily") {
        actualProp = 
          key === "header" ? "headerFontFamily" : 
          key === "body" ? "bodyFontFamily" : 
          key === "bottom" ? "bottomFontFamily" : 
          key === "badge" ? "badgeFontFamily" : 
          `${key}FontFamily`;
      } else if (propName === "fontSize") {
        actualProp = 
          key === "header" ? "headerFontScale" : 
          key === "body" ? "bodyFontScale" : 
          key === "bottom" ? "bottomFontScale" : 
          key === "badge" ? "badgeFontScale" : 
          `${key}FontScale`;
      } else if (propName === "fontColor") {
        actualProp = 
          key === "header" ? "headerFontColor" : 
          key === "body" ? "bodyFontColor" : 
          key === "bottom" ? "bottomFontColor" : 
          key === "badge" ? "badgeFontColor" : 
          `${key}FontColor`;
      } else if (propName === "text") {
        actualProp = 
          key === "header" ? "headerText" : 
          key === "body" ? "bodyText" : 
          key === "bottom" ? "bottomText" : 
          key === "badge" ? "badgeText" : 
          `${key}Text`;
      } else if (propName === "animationClass") {
        actualProp = 
          key === "header" ? "headerAnimationClass" : 
          key === "body" ? "bodyAnimationClass" : 
          key === "bottom" ? "bottomAnimationClass" : 
          key === "badge" ? "badgeAnimationClass" : 
          `${key}AnimationClass`;
      } else {
        actualProp = `${key}${propName.charAt(0).toUpperCase() + propName.slice(1)}`;
      }
      updateConfig(actualProp as any, value, section);
    } else {
      const currentElements = layoutConfig[section].customElements || [];
      const updatedElements = currentElements.map((el: any) => {
        if (el.id === key) {
          return { ...el, [propName]: value };
        }
        return el;
      });
      updateConfig("customElements" as any, updatedElements, section);
    }
  };

  const handleAddTextElement = () => {
    const newId = `custom-text-${Date.now()}`;
    const newElement = {
      id: newId,
      text: "Teks Baru",
      fontFamily: "Karla",
      fontSize: 14,
      fontColor: "#ffffff",
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      width: 100
    };
    const currentElements = layoutConfig[selectedSection].customElements || [];
    const updatedElements = [...currentElements, newElement];
    updateConfig("customElements" as any, updatedElements, selectedSection);
    setSelectedElement({
      section: selectedSection,
      type: "custom",
      key: newId
    });
  };

  const handleDeleteActiveCustomElement = () => {
    if (!selectedElement || selectedElement.type !== "custom") return;
    const { section, key } = selectedElement;
    const currentElements = layoutConfig[section].customElements || [];
    const updatedElements = currentElements.filter((el: any) => el.id !== key);
    updateConfig("customElements" as any, updatedElements, section);
    setSelectedElement({
      section,
      type: "default",
      key: "header"
    });
  };

  // ==========================================
  // 4. EVENT HANDLERS & HELPERS
  // ==========================================

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 5000);
    
    // Request Fullscreen (cross-browser)
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch(e) {}
    
    // Play music if available
    const gConfig = (layoutConfig as any).global;
    if (audioRef.current && gConfig?.musicUrl) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Autoplay blocked by browser"));
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    if (isCustomInvitation) {
      setIsSubmittingComment(true);
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            invitationId: themeId,
            name: formName.trim(),
            comment: formComment.trim(),
            rsvpStatus: formRsvp
          })
        });

        if (res.ok) {
          const resultData = await res.json();
          if (resultData.success && resultData.comment) {
            // Transform field names from DB (snake_case) to state matching
            const formatted = {
              id: resultData.comment.id,
              name: resultData.comment.name,
              comment: resultData.comment.comment,
              rsvp_status: resultData.comment.rsvp_status,
              created_at: resultData.comment.created_at
            };
            setComments(prev => [formatted, ...prev]);
            setFormComment("");
            alert("Ucapan Anda berhasil dikirim!");
          } else {
            alert("Gagal mengirim ucapan.");
          }
        } else {
          alert("Gagal mengirim ucapan.");
        }
      } catch (err) {
        console.error("Submit comment error:", err);
        alert("Terjadi kesalahan koneksi.");
      } finally {
        setIsSubmittingComment(false);
      }
    } else {
      const newCommentObj = {
        id: Date.now(),
        name: formName.trim(),
        comment: formComment.trim(),
        rsvp_status: formRsvp,
        created_at: new Date().toISOString()
      };

      setComments([newCommentObj, ...comments]);
      setFormComment("");
      alert("Sandbox: Ucapan berhasil ditambahkan!");
    }
  };

  const handleLocalBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 5MB.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      alert("Anda harus login sebagai Admin untuk mengubah background.");
      return;
    }

    setIsBgUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new (window.Image || Image)();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 900;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.90);
          
          try {
            const res = await fetch("/api/admin/upload-bg", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                base64Data: compressedDataUrl,
                invitationId: themeId,
                section: selectedSection
              })
            });

            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "Gagal mengunggah gambar");
            }

            const result = await res.json();
            if (result.success && result.url) {
              updateConfig("bgUrl", result.url);
              alert("Background berhasil diunggah ke server!");
            } else {
              throw new Error("Gagal mengunggah gambar ke server");
            }
          } catch (err: any) {
            console.error(err);
            alert("Error: " + err.message);
          } finally {
            setIsBgUploading(false);
          }
        } else {
          setIsBgUploading(false);
        }
      };
      img.onerror = () => {
        setIsBgUploading(false);
        alert("Gagal membaca file gambar.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsBgUploading(false);
      alert("Terjadi kesalahan saat membaca file.");
    };
    reader.readAsDataURL(file);
  };

  const handleOrnamentUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB untuk ornamen.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      alert("Anda harus login sebagai Admin untuk mengubah ornamen.");
      return;
    }

    setIsOrnamentUploading(prev => ({ ...prev, [slotIdx]: true }));

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new (window.Image || Image)();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 400; // ornaments are usually smaller
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.9);
          
          try {
            const res = await fetch("/api/admin/upload-bg", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                base64Data: compressedDataUrl,
                invitationId: themeId,
                section: `ornament_${selectedSection}_${slotIdx}_${Date.now()}`
              })
            });

            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "Gagal mengunggah ornamen");
            }

            const result = await res.json();
            if (result.success && result.url) {
              setLayoutConfig(prev => {
                const conf = prev[selectedSection] as any;
                if (!conf) return prev;
                
                const currentOrnaments = conf.ornaments ? [...conf.ornaments] : [];
                currentOrnaments[slotIdx] = {
                  id: `ornament_${slotIdx}`,
                  url: result.url,
                  transformX: 0,
                  transformY: 0,
                  scale: 1,
                  animation: 'float'
                };

                return {
                  ...prev,
                  [selectedSection]: {
                    ...conf,
                    ornaments: currentOrnaments
                  }
                };
              });
            } else {
              throw new Error("Gagal mengunggah ornamen ke server");
            }
          } catch (err: any) {
            console.error(err);
            alert("Error: " + err.message);
          } finally {
            setIsOrnamentUploading(prev => ({ ...prev, [slotIdx]: false }));
          }
        } else {
          setIsOrnamentUploading(prev => ({ ...prev, [slotIdx]: false }));
        }
      };
      img.onerror = () => {
        setIsOrnamentUploading(prev => ({ ...prev, [slotIdx]: false }));
        alert("Gagal membaca file gambar.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsOrnamentUploading(prev => ({ ...prev, [slotIdx]: false }));
      alert("Terjadi kesalahan saat membaca file.");
    };
    reader.readAsDataURL(file);
  };

  const handleOrnamentScale = (slotIdx: number, scale: number) => {
    setLayoutConfig(prev => {
      const conf = prev[selectedSection] as any;
      if (!conf || !conf.ornaments) return prev;
      
      const newOrnaments = [...conf.ornaments];
      if (newOrnaments[slotIdx]) {
        newOrnaments[slotIdx] = { ...newOrnaments[slotIdx], scale };
      }

      return {
        ...prev,
        [selectedSection]: {
          ...conf,
          ornaments: newOrnaments
        }
      };
    });
  };

  const handleOrnamentFlip = (slotIdx: number, flip: boolean) => {
    setLayoutConfig(prev => {
      const conf = prev[selectedSection] as any;
      if (!conf || !conf.ornaments) return prev;
      
      const newOrnaments = [...conf.ornaments];
      if (newOrnaments[slotIdx]) {
        newOrnaments[slotIdx] = { ...newOrnaments[slotIdx], flipHorizontal: flip };
      }

      return {
        ...prev,
        [selectedSection]: {
          ...conf,
          ornaments: newOrnaments
        }
      };
    });
  };

  const handleDeleteOrnament = (slotIdx: number) => {
    setLayoutConfig(prev => {
      const conf = prev[selectedSection] as any;
      if (!conf || !conf.ornaments) return prev;
      
      const newOrnaments = [...conf.ornaments];
      delete newOrnaments[slotIdx]; // Leave it undefined so indices don't shift

      return {
        ...prev,
        [selectedSection]: {
          ...conf,
          ornaments: newOrnaments
        }
      };
    });
  };

  // Update Config Field
  const updateConfig = (field: keyof CardConfig, value: any, sectionKey: keyof ThemeConfig = selectedSection) => {
    const updated = {
      ...layoutConfig,
      [sectionKey]: {
        ...layoutConfig[sectionKey],
        [field]: value
      }
    };
    setLayoutConfig(updated);
    localStorage.setItem(`bintarti_theme_config_${themeId}`, JSON.stringify(updated));
  };

  const handleResetConfig = () => {
    if (confirm("Reset ulang semua setelan visual ke bawaan baru Anda?")) {
      const defaultForTheme = getDefaultConfigForTheme(activeTheme);
      setLayoutConfig(defaultForTheme);
      localStorage.removeItem(`bintarti_theme_config_${themeId}`);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(layoutConfig, null, 2));
    alert("Kode konfigurasi visual berhasil disalin! Silakan kirimkan kode ini ke Developer.");
  };

  const handleSaveDesignToDb = async () => {
    if (!themeId) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      alert("Anda harus login sebagai Admin untuk menyimpan tema.");
      return;
    }
    
    setIsSavingDbConfig(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: themeId,
          layoutConfig: layoutConfig,
          music: (layoutConfig as any).global?.musicUrl
        })
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          // Update database cache locally so we don't reload
          if (invitationData) {
            setInvitationData({
              ...invitationData,
              layout_config: layoutConfig,
              full_name: invitationData.full_name,
              nickname: invitationData.nickname,
              parents_name: invitationData.parents_name,
              birthday_age: invitationData.birthday_age,
              child_order: invitationData.child_order,
              event_location: invitationData.event_location,
              schedule: invitationData.schedule,
              invited_guests: invitationData.invited_guests,
              gift_address: invitationData.gift_address
            } as any);
          } else {
            // For default theme templates, set invitationData state with layoutConfig
            setInvitationData({
              id: themeId,
              layout_config: layoutConfig
            } as any);
          }
          if (isCustomInvitation) {
            alert("Desain kustom customer berhasil disimpan permanen ke database! 🎉");
          } else {
            alert("Setelan default global tema berhasil disimpan permanen ke database server! 🌟");
          }
        } else {
          alert(`Gagal menyimpan ke database: ${resData.error || "Unknown error"}`);
        }
      } else {
        const errData = await res.json();
        alert(`Gagal menyimpan ke database: ${errData.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Save db config error:", err);
      alert(`Terjadi kesalahan koneksi: ${err.message}`);
    } finally {
      setIsSavingDbConfig(false);
    }
  };

  const generateDynamicStyles = () => {
    let css = "";
    
    const getFontVal = (fontName?: string) => {
      if (!fontName) return "";
      if (fontName === "Atma") return "'Atma', cursive";
      if (fontName === "Averia") return "'Averia Gruesa Libre', sans-serif";
      if (fontName === "Bree") return "var(--font-bree-serif), serif";
      if (fontName === "Cookie") return "var(--font-cookie), cursive";
      if (fontName === "Beth") return "var(--font-beth-ellen), cursive";
      if (fontName === "Bungee") return "var(--font-bungee), sans-serif";
      if (fontName === "BungeeInline") return "var(--font-bungee-inline), sans-serif";
      if (fontName === "Rolleston") return "var(--font-playfair-display), serif";
      if (fontName === "Karla") return "var(--font-karla), sans-serif";
      if (fontName === "LucidaCalligraphy") return "'Lucida Calligraphy', 'Lucida Handwriting', cursive";
      if (fontName === "ArefRuqaa") return "var(--font-aref-ruqaa), serif";
      if (fontName === "SansSerif") return "sans-serif";
      return "";
    };

    Object.keys(layoutConfig).forEach((key) => {
      const sectionKey = key as keyof ThemeConfig;
      const conf = layoutConfig[sectionKey];
      if (!conf) return;
      
      // 1. Header Styles Rules
      let headerRules = "";
      const resolvedHeaderFont = conf.headerFontFamily || conf.fontFamily;
      if (resolvedHeaderFont) {
        let val = getFontVal(resolvedHeaderFont);
        if (val) headerRules += `font-family: ${val} !important;`;
      }
      const resolvedHeaderColor = conf.headerFontColor || conf.fontColor;
      if (resolvedHeaderColor) {
        headerRules += `color: ${resolvedHeaderColor} !important;`;
      }
      if (conf.headerFontScale) {
        headerRules += `font-size: calc(${conf.fontScale || 1} * ${conf.headerFontScale} * 1rem) !important;`;
      }
      
      if (headerRules) {
        css += `
          #${sectionKey}-section .font-header-custom {
            ${headerRules}
          }
        `;
      }
      
      // 2. Body/Subtitle Styles Rules
      let bodyRules = "";
      const resolvedBodyFont = conf.bodyFontFamily || conf.fontFamily;
      if (resolvedBodyFont) {
        let val = getFontVal(resolvedBodyFont);
        if (val) bodyRules += `font-family: ${val} !important;`;
      }
      const resolvedBodyColor = conf.bodyFontColor || conf.fontColor;
      if (resolvedBodyColor) {
        bodyRules += `color: ${resolvedBodyColor} !important;`;
      }
      if (conf.bodyFontScale) {
        bodyRules += `font-size: calc(${conf.fontScale || 1} * ${conf.bodyFontScale} * 1rem) !important;`;
      }
      
      if (bodyRules) {
        css += `
          #${sectionKey}-section .font-body-custom {
            ${bodyRules}
          }
        `;
      }

      // 2.5. Bottom Styles Rules
      let bottomRules = "";
      const resolvedBottomFont = conf.bottomFontFamily || conf.fontFamily;
      if (resolvedBottomFont) {
        let val = getFontVal(resolvedBottomFont);
        if (val) bottomRules += `font-family: ${val} !important;`;
      }
      const resolvedBottomColor = conf.bottomFontColor || conf.fontColor;
      if (resolvedBottomColor) {
        bottomRules += `color: ${resolvedBottomColor} !important;`;
      }
      if (conf.bottomFontScale) {
        bottomRules += `font-size: calc(${conf.fontScale || 1} * ${conf.bottomFontScale} * 1rem) !important;`;
      }
      
      if (bottomRules) {
        css += `
          #${sectionKey}-section .font-bottom-custom {
            ${bottomRules}
          }
        `;
      }
      
      // 3. Section General Rules
      let generalRules = "";
      if (conf.lineHeight) {
        generalRules += `line-height: ${conf.lineHeight} !important;`;
      }
      if (generalRules) {
        css += `
          #${sectionKey}-section {
            ${generalRules}
          }
        `;
      }
    });
    
    // Custom scrollbar styling for floating panel
    css += `
      .designer-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .designer-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .designer-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(147, 51, 234, 0.25) !important;
        border-radius: 10px;
      }
      .designer-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(147, 51, 234, 0.45) !important;
      }
    `;

    if (activeTheme === "khitan-9") {
      css += `
        /* Khitan-9 Space Theme HUD Overrides */
        
        /* 1. Moving Starfield Background */
        body {
          background-color: #0B0C10 !important;
        }
        .khitan-9-starfield {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 0;
          background-image: 
            radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 40px 70px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 50px 160px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2.5px 2.5px at 130px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 160px 120px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: starsMove 80s linear infinite;
          opacity: 0.4;
          pointer-events: none;
        }
        @keyframes starsMove {
          from { background-position: 0 0; }
          to { background-position: -10000px 5000px; }
        }

        /* 2. Glassmorphism Panels */
        #profile-section > div.bg-white\\/60,
        #event-section > div.bg-white\\/60,
        #maps-section > div.bg-white\\/60,
        #gallery-section > div.bg-white\\/60,
        #activities-section > div.bg-white\\/60,
        #rsvp-section > div.bg-white\\/60,
        #envelope-section > div.bg-white\\/60,
        #checkin-section > div.bg-white\\/60,
        #closing-section > div.bg-white\\/60,
        #turut-section > div.bg-white\\/60 {
          background-color: rgba(11, 12, 16, 0.55) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(6, 182, 212, 0.4) !important;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15) !important;
          border-radius: 32px !important;
        }

        #cover-section {
          border: 1px solid rgba(6, 182, 212, 0.4) !important;
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.2) !important;
        }
        
        /* 3. Glowing Text */
        #cover-section h1,
        #profile-section h2,
        #event-section h2,
        #maps-section h2,
        #gallery-section h2,
        #activities-section h2,
        #rsvp-section h2,
        #envelope-section h2,
        #checkin-section h2,
        #closing-section h2,
        #turut-section h2 {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.9), 0 0 20px rgba(6, 182, 212, 0.4) !important;
          letter-spacing: 2px !important;
        }

        /* 4. Sci-Fi Buttons & Input Fields */
        button {
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3) !important;
          border: 1px solid rgba(6, 182, 212, 0.5) !important;
          backdrop-filter: blur(4px) !important;
        }
        button:hover {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.8) !important;
        }
        
        input, textarea {
          background-color: rgba(11, 12, 16, 0.6) !important;
          border: 1px solid rgba(6, 182, 212, 0.4) !important;
          color: #E2E8F0 !important;
        }
        input:focus, textarea:focus {
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5) !important;
          border-color: rgba(6, 182, 212, 0.8) !important;
        }

        /* 5. Avatar Orbit Ring */
        .rounded-full.border-4 {
          border-width: 2px !important;
          border-color: rgba(6, 182, 212, 0.8) !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(6, 182, 212, 0.5) !important;
          animation: orbitPulse 3s infinite alternate;
        }
        @keyframes orbitPulse {
          0% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.3), inset 0 0 5px rgba(6, 182, 212, 0.3); }
          100% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.9), inset 0 0 15px rgba(6, 182, 212, 0.9); }
        }

        /* 6. Gallery Float Effect */
        #gallery-section img {
          border: 1px solid rgba(6, 182, 212, 0.3) !important;
          border-radius: 12px !important;
          transition: transform 0.4s ease, box-shadow 0.4s ease !important;
        }
        #gallery-section img:hover {
          transform: scale(1.08) translateY(-8px) !important;
          box-shadow: 0 15px 25px rgba(6, 182, 212, 0.6) !important;
          z-index: 10;
        }
        
        /* 7. Countdown Digits Styling */
        .flex.items-center.gap-2.justify-center.mt-2 > div {
           background-color: rgba(11, 12, 16, 0.7) !important;
           border: 1px solid rgba(6, 182, 212, 0.5) !important;
           box-shadow: inset 0 0 8px rgba(6, 182, 212, 0.4) !important;
           color: #22d3ee !important;
        }

        /* --- DEEP LAYOUT HIJACKING --- */
        
        /* A. Cover Layout Hijacking */
        #cover-section {
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          padding-bottom: 25px !important;
        }
        #cover-section > div.absolute.flex.flex-col {
          position: static !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          width: 100% !important;
        }
        #cover-section > div > div.space-y-3 {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }
        /* Name to top */
        #cover-section h1 { order: 1 !important; margin-top: 30px !important; transform: scale(1.1) !important; }
        /* Teks Pengantar bottom left */
        #cover-section p.text-xs.font-bold.uppercase { order: 2 !important; position: absolute !important; bottom: 150px !important; left: 20px !important; text-align: left !important; }
        /* Badge top left */
        #cover-section div.text-\\[10px\\].font-black { order: 3 !important; position: absolute !important; top: 15px !important; left: 15px !important; z-index: 10 !important; }
        /* Date bottom left */
        #cover-section p.opacity-85 { position: absolute !important; bottom: 130px !important; left: 20px !important; text-align: left !important; }
        
        #cover-section > div > div.w-full.space-y-4 {
          position: absolute !important;
          bottom: 25px !important;
          left: 0 !important;
          right: 0 !important;
          padding: 0 20px !important;
        }
        #cover-section > div > div.w-full.space-y-4 > div { /* Kepada yth box */
          align-items: flex-start !important;
          text-align: left !important;
        }
        #cover-section > div > div.w-full.space-y-4 > div > span.bg-white\\/60 {
          margin: 0 !important;
        }
        #cover-section button {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* B. Profile Layout Hijacking (Side-by-side) */
        #profile-section > div.bg-white\\/60 {
          display: grid !important;
          grid-template-columns: 120px 1fr !important;
          gap: 15px !important;
          align-items: center !important;
          padding: 20px !important;
          text-align: left !important;
        }
        #profile-section h3 { grid-column: 1 / -1 !important; text-align: center !important; margin-bottom: 10px !important; }
        #profile-section > div > div.relative.shrink-0 { /* Avatar */
          grid-column: 1 !important;
          grid-row: 2 / span 4 !important;
          margin: 0 !important;
          width: 110px !important;
          height: 146px !important;
        }
        #profile-section h2 { /* Name */
          grid-column: 2 !important;
          text-align: left !important;
          padding: 0 !important;
          margin: 0 !important;
          font-size: 1.5rem !important;
        }
        #profile-section p { /* Order & Parents */
          grid-column: 2 !important;
          text-align: left !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* C. Event Layout Hijacking (Grid/Columns) */
        #event-section > div > div.absolute.flex.flex-col {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          grid-template-rows: auto auto auto auto auto !important;
          gap: 15px !important;
          padding: 20px !important;
          position: static !important;
          height: 100% !important;
          align-content: center !important;
        }
        #event-section > div > div > div.flex.gap-2 { /* Countdown */
          grid-column: 1 / -1 !important;
          order: 1 !important; /* Force to top */
          transform: scale(1.05) !important;
          margin-bottom: 15px !important;
        }
        #event-section h3 { /* Walimatul Khitan */
          grid-column: 1 / -1 !important;
          order: 2 !important;
        }
        #event-section > div > div > div:nth-of-type(1) { /* Date & Time */
          grid-column: 1 !important;
          order: 3 !important;
          text-align: left !important;
          border-right: 1px solid rgba(6, 182, 212, 0.4) !important;
          padding-right: 10px !important;
        }
        #event-section > div > div > div:nth-of-type(2) { /* Location */
          grid-column: 2 !important;
          order: 4 !important;
          text-align: left !important;
        }
        #event-section a { /* Maps Button */
          grid-column: 1 / -1 !important;
          order: 5 !important;
          margin-top: 10px !important;
        }
        #event-section button { /* Save the Date */
          grid-column: 1 / -1 !important;
          order: 6 !important;
        }

        /* --- LEVEL 10/10 WOW EFFECTS --- */

        /* 1. Sci-Fi Clip Path Borders (Instead of standard border-radius) */
        #profile-section > div.bg-white\\/60,
        #event-section > div.bg-white\\/60,
        #maps-section > div.bg-white\\/60,
        #gallery-section > div.bg-white\\/60,
        #activities-section > div.bg-white\\/60,
        #rsvp-section > div.bg-white\\/60,
        #envelope-section > div.bg-white\\/60,
        #checkin-section > div.bg-white\\/60,
        #closing-section > div.bg-white\\/60,
        #turut-section > div.bg-white\\/60 {
          border-radius: 0 !important;
          clip-path: polygon(
            0% 20px, 
            20px 0%, 
            calc(100% - 20px) 0%, 
            100% 20px, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            20px 100%, 
            0% calc(100% - 20px)
          ) !important;
          border: none !important;
          border-left: 3px solid rgba(6, 182, 212, 0.9) !important;
          border-right: 3px solid rgba(6, 182, 212, 0.9) !important;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05) !important;
        }

        /* Cover also gets Clip Path */
        #cover-section {
          border-radius: 0 !important;
          clip-path: polygon(
            0% 40px, 40px 0%, calc(100% - 40px) 0%, 100% 40px, 
            100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0% calc(100% - 40px)
          ) !important;
          border: none !important;
          border-top: 3px solid rgba(6, 182, 212, 0.9) !important;
          border-bottom: 3px solid rgba(6, 182, 212, 0.9) !important;
        }

        /* 2. Radar Scanline Animation on Avatar */
        #profile-section > div > div.relative.shrink-0::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(6, 182, 212, 0.8);
          box-shadow: 0 0 10px rgba(6, 182, 212, 1);
          animation: radarScan 3s ease-in-out infinite;
          z-index: 10;
        }
        @keyframes radarScan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { top: 98%; opacity: 1; }
        }

        /* 3. Glitch / Typewriter Effect on Headers */
        #cover-section h1 {
          animation: glitch 4s infinite;
        }
        @keyframes glitch {
          0%, 96% { transform: scale(1.1) skewX(0deg); opacity: 1; }
          97% { transform: scale(1.1) skewX(10deg); opacity: 0.8; text-shadow: -2px 0 red, 2px 0 cyan; }
          98% { transform: scale(1.1) skewX(-10deg); opacity: 0.8; text-shadow: 2px 0 red, -2px 0 cyan; }
          99% { transform: scale(1.1) skewX(0deg); opacity: 1; text-shadow: 0 0 10px rgba(6, 182, 212, 0.9); }
        }

        /* Body Teks Pengantar - Typewriter blink cursor */
        #cover-section p.text-xs.font-bold.uppercase::after {
          content: "|";
          animation: blinkCursor 1s step-end infinite;
          color: rgba(6, 182, 212, 0.9);
          margin-left: 4px;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* 4. Shooting Stars Overlay */
        .khitan-9-shooting-stars {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }
        .khitan-9-shooting-stars::before,
        .khitan-9-shooting-stars::after {
          content: "";
          position: absolute;
          top: -50px;
          width: 1px;
          height: 150px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(6, 182, 212, 1));
          animation: shootingStar 6s linear infinite;
          transform: rotate(45deg);
          opacity: 0;
        }
        .khitan-9-shooting-stars::before {
          left: 20%;
          animation-delay: 2s;
        }
        .khitan-9-shooting-stars::after {
          left: 70%;
          animation-delay: 5s;
          animation-duration: 8s;
        }
        @keyframes shootingStar {
          0% { transform: translate(0, 0) rotate(45deg); opacity: 1; }
          20% { transform: translate(500px, 500px) rotate(45deg); opacity: 0; }
          100% { opacity: 0; }
        }

        /* 5. Pulse Reactor Buttons */
        button, a[href*="maps"] {
          position: relative;
          overflow: hidden;
          background: rgba(11, 12, 16, 0.8) !important;
          color: #22d3ee !important;
          border: none !important;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.2), inset 0 0 10px rgba(6, 182, 212, 0.1) !important;
          text-transform: uppercase !important;
          letter-spacing: 2px !important;
          transition: all 0.3s ease !important;
          border-radius: 0 !important;
          clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px) !important;
        }
        button::before, a[href*="maps"]::before {
          content: "";
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(6, 182, 212, 0.3), transparent);
          transform: skewX(-20deg);
          animation: reactorSweep 3s infinite;
        }
        @keyframes reactorSweep {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }
        button:hover, a[href*="maps"]:hover {
          background: rgba(6, 182, 212, 0.3) !important;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 15px rgba(6, 182, 212, 0.4) !important;
          color: #fff !important;
        }

        /* --- HORIZONTAL SPACE DOCK OVERRIDE --- */
        body, html {
          overflow-y: hidden !important;
          overflow-x: hidden !important;
          overscroll-behavior-y: none !important;
        }
        
        .khitan-9-horizontal-dock {
          display: flex !important;
          flex-direction: row !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          scroll-snap-type: x mandatory !important;
          scroll-behavior: smooth !important;
          align-items: center !important;
          padding: 0 !important;
          margin: 0 !important;
          gap: 5vw !important;
          padding-left: 5vw !important;
          padding-right: 5vw !important;
          max-width: none !important;
        }
        
        /* Hide scrollbar for cleaner look */
        .khitan-9-horizontal-dock::-webkit-scrollbar {
          display: none;
        }
        .khitan-9-horizontal-dock {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Make each section a horizontal full-screen slide */
        #profile-section, #event-section, #maps-section, #gallery-section, #activities-section, #rsvp-section, #envelope-section, #checkin-section, #closing-section, #turut-section {
          flex-shrink: 0 !important;
          width: 90vw !important;
          max-width: 430px !important;
          height: 85vh !important;
          scroll-snap-align: center !important;
          margin: 0 !important; /* override mx-auto */
          position: relative !important;
          transform: none !important; /* Reset any previous translations */
        }
        
        /* Ensure inner absolute wrappers fill the height in horizontal mode */
        .khitan-9-horizontal-dock > div > div.absolute.flex.flex-col {
           height: 100% !important;
        }

        /* Fix the Back to catalog header so it floats above the horizontal scroll */
        .khitan-9-horizontal-dock > div.flex.justify-between {
          position: fixed !important;
          top: 15px !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 100 !important;
          width: 100vw !important;
          padding: 0 20px !important;
        }
        
        /* Confetti Overlay Fix */
        .khitan-9-horizontal-dock > div.fixed.inset-0.pointer-events-none {
           position: fixed !important;
           width: 100vw !important;
           height: 100vh !important;
        }

        /* --- THEMATIC UI/UX CONTENT OVERHAUL --- */
        
        /* 1. PROFILE -> Space ID Card */
        #profile-section > div > div.absolute.flex.flex-col {
           background-image: 
             linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
             linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px);
           background-size: 20px 20px;
        }
        #profile-section::after {
          content: "GALACTIC CITIZEN ID: 9942-X-AE";
          position: absolute;
          bottom: -20px;
          right: 10px;
          color: #22d3ee;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 2px;
          background: #0B0C10;
          padding: 2px 10px;
          border: 1px solid #22d3ee;
        }
        /* Mock barcode at the bottom of Profile */
        #profile-section h2::after {
          content: "";
          display: block;
          height: 30px;
          width: 100%;
          margin-top: 15px;
          background: 
            repeating-linear-gradient(
              to right,
              #22d3ee,
              #22d3ee 2px,
              transparent 2px,
              transparent 4px,
              #22d3ee 4px,
              #22d3ee 5px,
              transparent 5px,
              transparent 8px
            );
          opacity: 0.7;
        }
        #profile-section p {
          font-family: monospace !important;
          text-transform: uppercase !important;
          color: #94a3b8 !important;
        }
        #profile-section p::before {
          content: "GUARDIAN DATA: ";
          color: #22d3ee;
          font-size: 0.8em;
          display: block;
          margin-bottom: 2px;
        }

        /* 2. EVENT -> Intergalactic Boarding Pass */
        #event-section > div.bg-white\\/60 {
           /* Boarding pass cutouts */
           clip-path: polygon(
             0% 10%, 
             5% 10%, 5% 15%, 0% 15%, 
             0% 85%, 
             5% 85%, 5% 90%, 0% 90%, 
             0% 100%, 100% 100%, 
             100% 90%, 
             95% 90%, 95% 85%, 100% 85%, 
             100% 15%, 
             95% 15%, 95% 10%, 100% 10%, 
             100% 0%, 0% 0%
           ) !important;
           border: 2px dashed rgba(6, 182, 212, 0.5) !important; /* Ticket perforation */
           background: rgba(11, 12, 16, 0.85) !important;
        }
        #event-section::before {
          content: "BOARDING PASS";
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #22d3ee;
          color: #0B0C10;
          padding: 2px 15px;
          font-weight: 900;
          font-family: monospace;
          letter-spacing: 4px;
          z-index: 20;
        }
        /* Date & Time labels */
        #event-section > div > div > div:nth-of-type(1)::before {
          content: "DEPARTURE TIME";
          display: block;
          color: #ef4444; /* Red alert color */
          font-size: 10px;
          font-family: monospace;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        /* Location labels */
        #event-section > div > div > div:nth-of-type(2)::before {
          content: "DESTINATION COORDS";
          display: block;
          color: #22d3ee;
          font-size: 10px;
          font-family: monospace;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }

        /* 3. GALLERY -> Orbiting Data Nodes */
        #gallery-section .columns-2 {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 15px !important;
          margin-top: 30px !important;
        }
        #gallery-section img {
          width: 80px !important;
          height: 80px !important;
          border-radius: 50% !important; /* Data nodes as circles */
          object-fit: cover !important;
          animation: floatNode 6s ease-in-out infinite alternate;
          border: 2px solid #22d3ee !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.6) !important;
        }
        #gallery-section > div > div > div:nth-child(1) img { animation-delay: 0s; transform: translate(-20px, -20px); width: 120px !important; height: 120px !important; }
        #gallery-section > div > div > div:nth-child(2) img { animation-delay: 1s; transform: translate(30px, 10px); }
        #gallery-section > div > div > div:nth-child(3) img { animation-delay: 2s; transform: translate(-10px, 40px); width: 100px !important; height: 100px !important;}
        #gallery-section > div > div > div:nth-child(4) img { animation-delay: 3s; transform: translate(20px, -30px); }
        @keyframes floatNode {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.1); }
        }
        /* Connect nodes with lines */
        #gallery-section::after {
          content: "";
          position: absolute;
          top: 50%; left: 10%; right: 10%;
          height: 1px;
          background: rgba(6, 182, 212, 0.3);
          z-index: -1;
          transform: rotate(15deg);
        }
      `;
    }

    return css;
  };

  const renderSectionTextInput = () => {
    if (!invitationData) return null;
    
    const handleDbFieldChange = (field: string, value: string) => {
      setInvitationData(prev => prev ? { ...prev, [field]: value } : null);
    };

    if (selectedSection === "cover") {
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama Panggilan Anak..."
            value={invitationData.nickname || ""}
            onChange={(e) => handleDbFieldChange("nickname", e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    if (selectedSection === "profile") {
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama Lengkap Anak..."
            value={invitationData.full_name || ""}
            onChange={(e) => handleDbFieldChange("full_name", e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
          <input
            type="text"
            placeholder="Nama Orang Tua..."
            value={invitationData.parents_name || ""}
            onChange={(e) => handleDbFieldChange("parents_name", e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
          <input
            type="text"
            placeholder="Urutan Anak / Umur Ulang Tahun..."
            value={invitationData.child_order || invitationData.birthday_age || ""}
            onChange={(e) => {
              if (invitationData.type === "Birthday") {
                handleDbFieldChange("birthday_age", e.target.value);
              } else {
                handleDbFieldChange("child_order", e.target.value);
              }
            }}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    if (selectedSection === "event") {
      return (
        <div className="space-y-2">
          <textarea
            placeholder="Alamat Lokasi Acara..."
            value={invitationData.event_location || ""}
            onChange={(e) => handleDbFieldChange("event_location", e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    if (selectedSection === "activities") {
      return (
        <div className="space-y-2">
          <textarea
            placeholder="Activities & Highlights..."
            value={invitationData.schedule || ""}
            onChange={(e) => handleDbFieldChange("schedule", e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    if (selectedSection === "turut") {
      return (
        <div className="space-y-2">
          <textarea
            placeholder="Turut Mengundang..."
            value={invitationData.invited_guests || ""}
            onChange={(e) => handleDbFieldChange("invited_guests", e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    if (selectedSection === "envelope") {
      return (
        <div className="space-y-2">
          <textarea
            placeholder="Alamat Pengiriman Kado..."
            value={invitationData.gift_address || ""}
            onChange={(e) => handleDbFieldChange("gift_address", e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
          />
        </div>
      );
    }
    
    return (
      <textarea
        placeholder="Gunakan kolom input kustom teks untuk section ini..."
        value={layoutConfig[selectedSection].customText || ""}
        onChange={(e) => updateConfig("customText", e.target.value)}
        rows={2}
        className="w-full text-xs p-2 rounded-lg border border-slate-200 font-sans"
      />
    );
  };

  const changePanelPosition = (pos: "bottom" | "left" | "right") => {
    setPanelPosition(pos);
    localStorage.setItem("bintarti_panel_position", pos);
  };

  // Dynamic CSS classes for visual designer docking
  const getPanelClasses = () => {
    const base = "fixed z-[60] bg-white/95 backdrop-blur-md p-5 overflow-y-auto designer-scrollbar font-sans text-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-300 border border-slate-100 rounded-[28px]";
    if (panelPosition === "left") {
      return `${base} left-4 top-4 bottom-4 w-full max-w-[325px] h-[calc(100vh-32px)]`;
    }
    if (panelPosition === "right") {
      return `${base} right-4 top-4 bottom-4 w-full max-w-[325px] h-[calc(100vh-32px)]`;
    }
    return `${base} left-4 right-4 bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 w-auto md:w-full md:max-w-xl max-h-[45vh]`;
  };

  // Typography Styles defined outside of component

  return (
    <div 
      className="relative min-h-screen overflow-x-clip font-sans"
      style={{ 
        backgroundColor: themeStyle.mainBg, 
        color: themeStyle.mainTextColor,
        "--preview-ratio": designerOpen ? previewRatio : "9/16",
        ...averiaFont
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: generateDynamicStyles() }} />
      {activeTheme === "khitan-9" && (
        <>
          <div className="khitan-9-starfield"></div>
          <div className="khitan-9-shooting-stars"></div>
        </>
      )}
      {designerOpen && (
        <style dangerouslySetInnerHTML={{ __html: `
          iframe { pointer-events: none !important; }
          img, a { -webkit-user-drag: none !important; user-select: none !important; }
          
          ${dragState?.isDragging ? `
          /* Garis Bantu Tengah Vertikal & Horizontal */
          #cover-section::after, #profile-section::after, #event-section::after, #activities-section::after, #turut-section::after, #envelope-section::after, #gallery-section::after, #wishes-section::after, #closing-section::after {
            content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px;
            border-left: 1px dashed rgba(239, 68, 68, 0.55);
            z-index: 99; pointer-events: none; transform: translateX(-50%);
          }
          #cover-section::before, #profile-section::before, #event-section::before, #activities-section::before, #turut-section::before, #envelope-section::before, #gallery-section::before, #wishes-section::before, #closing-section::before {
            content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px;
            border-top: 1px dashed rgba(239, 68, 68, 0.55);
            z-index: 99; pointer-events: none; transform: translateY(-50%);
          }
          ` : ""}
        `}} />
      )}
      
      {/* ─────────────────────────────────────────────────────────────────
          COVER / LOCK SCREEN OVERLAY 
          ───────────────────────────────────────────────────────────────── */}
      {!isOpened && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-0 sm:p-4 text-center select-none overflow-hidden"
          style={{ backgroundColor: themeStyle.mainBg }}
        >
          


          {/* High Fidelity Cover Card: Centered both horizontally & vertically */}
          <div 
            id="cover-section"
            className="w-full max-w-[430px] min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-center bg-no-repeat relative shadow-2xl sm:rounded-[36px] my-auto"
            style={{ display: (layoutConfig.cover as any)?.hidden ? "none" : undefined,  
              backgroundImage: `url(${layoutConfig.cover.bgUrl || getSectionBg(activeTheme, "cover")})`,
              backgroundSize: `${layoutConfig.cover.bgSizeWidth}% ${layoutConfig.cover.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.cover.bgPosX}% ${layoutConfig.cover.bgPosY}%`
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("cover")}
            <div 
              className="absolute flex flex-col justify-between items-center text-center"
              style={{
                color: themeStyle.mainTextColor,
                left: `${layoutConfig.cover.left}%`,
                right: `${layoutConfig.cover.right}%`,
                top: `${layoutConfig.cover.top}%`,
                bottom: `${layoutConfig.cover.bottom}%`,
                fontSize: `${layoutConfig.cover.fontScale}rem`
              }}
            >
              <div className="space-y-3 flex flex-col items-center w-full mt-2">
                {activeTheme !== "birthday-4" && !layoutConfig.cover.hideBadge && (
                  (() => {
                    const props = getTextProps("cover", "badge", atmaFont, isKhitan ? "#1e293b" : "#ffffff");
                    return (
                      <div 
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        className={`${props.className} text-[10px] font-black ${isKhitan ? "bg-white text-slate-800 border border-slate-200" : "text-white"} ${activeTheme === "birthday-8" ? "bg-[#EF8D21]" : activeTheme === "birthday-7" ? "bg-[#7B68B1]" : activeTheme === "birthday-2" ? "bg-emerald-600/90" : isKhitan ? "" : "bg-pink-500/90"} px-3.5 py-1.5 rounded-full inline-block tracking-wider uppercase shadow-sm cursor-pointer`} 
                        style={props.style}
                      >
                        {layoutConfig.cover.badgeText !== undefined ? layoutConfig.cover.badgeText : (isKhitan ? "Walimatul Khitan" : "🎉 You're Invited: Birthday Bash")}
                      </div>
                    );
                  })()
                )}
                
                {activeTheme !== "birthday-4" && (
                  (() => {
                    const props = getTextProps("cover", "body", averiaFont, "#1e293b");
                    return (
                      <p 
                        className={`${props.className} text-xs font-bold uppercase tracking-widest`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.cover.bodyText !== undefined ? layoutConfig.cover.bodyText : (isKhitan ? "Undangan Khitanan" : "To the Birthday of")}
                      </p>
                    );
                  })()
                )}

                {(() => {
                  const props = getTextProps("cover", "header", activeTheme === "birthday-8" ? bungeeInlineFont : atmaFont, activeTheme === "birthday-8" ? "#EF8D20" : themeStyle.accentColor);
                  return (
                    <h1 
                      className={`${props.className} text-6xl font-bold tracking-normal filter drop-shadow-[0_2.5px_0_rgba(255,255,255,1)] animate-pulse`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.cover.headerText !== undefined ? layoutConfig.cover.headerText : childNickname}
                    </h1>
                  );
                })()}
                
                {(() => {
                  const props = getTextProps("cover", "bottom", averiaFont, "#334155");
                  return (
                    <p 
                      className={`${props.className} text-xs font-black uppercase tracking-wider opacity-85`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.cover.bottomText !== undefined ? layoutConfig.cover.bottomText : eventDateStr}
                    </p>
                  );
                })()}

                {/* Render custom layout elements */}
                {renderCustomElements("cover")}
              </div>

              <div className="w-full space-y-4 flex flex-col items-center mb-2">
                <div className="border-t border-dashed border-[#1E4D2B]/30 pt-3 w-full space-y-1">
                  <span className={`text-[9px] opacity-75 font-bold uppercase tracking-wider block ${isKhitan ? "text-slate-200" : "text-slate-600"}`} style={averiaFont}>Kepada Yth. Bapak/Ibu/Sdr:</span>
                  <span className="text-base font-black tracking-wide block truncate bg-white/60 py-1.5 px-3 rounded-xl border border-white/40 shadow-sm max-w-[200px] mx-auto">
                    {guestName}
                  </span>
                </div>

                <button
                  onClick={handleOpenInvitation}
                  {...(() => {
                    const p = getFixedElementProps("cover", "button", "default", `scale(${layoutConfig.cover.buttonScale || 1.0})`);
                    return {
                      className: `w-full max-w-[200px] py-3.5 px-6 rounded-2xl bg-gradient-to-r ${themeStyle.btnGradientClass} text-white font-extrabold text-xs shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 border-none ${p.className}`,
                      style: { ...p.style, transformOrigin: "center" },
                      onPointerDown: p.onPointerDown
                    };
                  })()}
                >
                  <PartyPopper className="w-4 h-4 animate-bounce" /> Buka Undangan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons: Muted Audio & Designer control panel */}
      {(layoutConfig as any).global?.musicUrl && (
        <>
          <audio 
            ref={audioRef} 
            src={parseGDriveUrl((layoutConfig as any).global.musicUrl)} 
            loop 
            preload="auto"
          />
        </>
      )}
      
        <InlineEditorOverlay
          designerOpen={designerOpen}
          inlineEditingKey={inlineEditingKey}
          inlineEditingValue={inlineEditingValue}
          setInlineEditingValue={setInlineEditingValue}
          onClose={() => setInlineEditingKey(null)}
          onSave={() => {
            if (!inlineEditingKey) return;
            const sec = inlineEditingKey.section;
            const key = inlineEditingKey.key;
            
            setLayoutConfig((prev: any) => {
              const newConf = { ...prev[sec] };
              
              if (inlineEditingKey.type === 'custom') {
                 const customEls = [...(newConf.customElements || [])];
                 const idx = customEls.findIndex((c: any) => c.id === key);
                 if (idx > -1) {
                    customEls[idx] = { ...customEls[idx], text: inlineEditingValue };
                 }
                 newConf.customElements = customEls;
              } else {
                 // Generic mapping: key -> {key}Text (e.g. header -> headerText, badge -> badgeText, parents -> parentsText)
                 const textPropName = `${key}Text`;
                 newConf[textPropName] = inlineEditingValue;
              }
              return { ...prev, [sec]: newConf };
            });
            setInlineEditingKey(null);
          }}
        />
        <BoundingBoxOverlay designerOpen={designerOpen} selectedElement={selectedElement} layoutConfig={layoutConfig} setLayoutConfig={setLayoutConfig} onDragEnd={() => pushHistory(latestConfigRef.current)} />
        
      {/* Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={() => {
            try {
              const doc = document as any;
              if (doc.exitFullscreen) {
                doc.exitFullscreen().catch(() => {});
              } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
              } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
              }
            } catch(e) {}
          }}
          className="fixed top-6 right-6 z-[70] w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all cursor-pointer shadow-lg"
          title="Keluar Layar Penuh"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className={`fixed ${isOpened ? 'bottom-[88px]' : 'bottom-6'} right-6 z-[60] flex flex-col gap-3 transition-all duration-300`}>
        {isAdmin && (
          <button
            onClick={() => setDesignerOpen(!designerOpen)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            title="Buka Control Panel Desain"
          >
            <Settings className={`w-5 h-5 ${designerOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
          </button>
        )}
        

        {isOpened && (layoutConfig as any).global?.musicUrl && (
          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  audioRef.current.play().then(() => {
                    setIsPlaying(true);
                  }).catch((err) => {
                    console.error("Audio playback failed", err);
                    alert("Lagu tidak dapat diputar. Pastikan link Google Drive disetting 'Siapa saja yang memiliki link' (Public) dan formatnya benar.");
                    setIsPlaying(false);
                  });
                }
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          >
            <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-[spin_3s_linear_infinite] text-blue-600' : 'opacity-50'}`} />
          </button>
        )}
        
        {/* Floating Auto-Scroll Button */}
        {isOpened && (
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none ${
              isAutoScrolling 
                ? 'bg-blue-600 border-blue-600 text-white animate-pulse' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}
            title={isAutoScrolling ? "Hentikan Auto Scroll" : "Mulai Auto Scroll"}
          >
            <div className={`w-5 h-5 flex flex-col items-center justify-center gap-0.5 ${isAutoScrolling ? 'animate-bounce' : ''}`}>
               <span className="text-[9px] font-black uppercase leading-none">AUTO</span>
               <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent ${activeTheme === "khitan-9" ? "border-l-[6px] border-t-[4px] border-b-[4px] border-t-transparent border-b-transparent border-l-current ml-1" : "border-t-[6px] border-t-current mt-0.5"}`}></div>
            </div>
          </button>
        )}

        {isOpened && showCheckin && layoutConfig.checkin && !layoutConfig.checkin.hidden && (
          <button
            onClick={() => setShowBarcodeModal(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            title="Tampilkan Barcode Check-in"
          >
            <QrCode className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative animate-scale-in">
            <button
              onClick={() => setShowBarcodeModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer border-none"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-4 pt-2">
              <h3 className="font-black text-slate-800 text-lg">Barcode Kehadiran</h3>
              <p className="text-xs text-slate-500 font-medium">Tunjukkan barcode ini kepada penerima tamu saat Anda tiba di lokasi acara.</p>
              
              <div className="mx-auto w-48 h-48 border-2 border-slate-100 rounded-2xl overflow-hidden bg-white p-2">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" ? window.location.hash.substring(1) || btoa(guestName) : btoa(guestName)}&type=${isKhitan ? "Khitan" : "Birthday"}`)}`}
                  alt="Check-in QR Code"
                  width={192}
                  height={192}
                  className="object-contain w-full h-full"
                  unoptimized={true}
                />
              </div>
              <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{guestName}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN INVITATION SECTIONS
          ───────────────────────────────────────────────────────────────── */}
      {isOpened && (
        <div className={activeTheme === "khitan-9" ? "khitan-9-horizontal-dock animate-fade-in" : "max-w-[430px] mx-auto space-y-4 animate-fade-in pb-12 pt-4 px-2 sm:px-3"}>
          


          {/* Confetti Overlay */}
          {confettiActive && (
            <div className="fixed inset-0 pointer-events-none z-35 overflow-hidden">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full animate-fall"
                  style={{
                    backgroundColor: activeTheme === "birthday-4"
                      ? ["#84CC16", "#10B981", "#059669", "#EC4899", "#F43F5E"][i % 5]
                      : activeTheme === "birthday-3"
                        ? ["#F59E0B", "#D97706", "#3B82F6", "#60A5FA", "#93C5FD"][i % 5]
                        : activeTheme === "birthday-2"
                          ? ["#10B981", "#059669", "#34D399", "#6EE7B7", "#A7F3D0"][i % 5]
                          : ["#FF69B4", "#BA55D3", "#FFD700", "#00BFFF", "#7FFF00"][i % 5],
                    left: `${((i * 17) % 100)}%`,
                    top: `-10px`,
                    animationDelay: `${((i * 0.3) % 3)}s`,
                    animationDuration: `${(((i * 0.7) % 4) + 2)}s`
                  }}
                />
              ))}
            </div>
          )}


          {/* SECTION 1: PROFILE INTRO */}
          <div 
            id="profile-section"
            className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
            style={{ display: (layoutConfig.profile as any)?.hidden ? "none" : undefined,  
              backgroundImage: `url(${layoutConfig.profile.bgUrl || getSectionBg(activeTheme, "profile")})`,
              backgroundSize: `${layoutConfig.profile.bgSizeWidth}% ${layoutConfig.profile.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.profile.bgPosX}% ${layoutConfig.profile.bgPosY}%`
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("profile")}
            <div 
              className="absolute flex flex-col justify-center items-center text-center space-y-4"
              style={{
                left: `${layoutConfig.profile.left}%`,
                right: `${layoutConfig.profile.right}%`,
                top: `${layoutConfig.profile.top}%`,
                bottom: `${layoutConfig.profile.bottom}%`,
                fontSize: `${layoutConfig.profile.fontScale}rem`
              }}
            >
              {isKhitan ? (
                <>
                  {(() => {
                    const props = getTextProps("profile", "badge", { fontFamily: "serif" }, "#f59e0b");
                    return (
                      <p 
                        className={`${props.className} text-sm font-semibold leading-none px-4`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.profile.badgeText !== undefined ? layoutConfig.profile.badgeText : "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم"}
                      </p>
                    );
                  })()}
                  {(() => {
                    const props = getTextProps("profile", "header", karlaFont, "#FFFFFF");
                    return (
                      <p 
                        className={`${props.className} text-[9px] font-medium leading-relaxed max-w-[320px] text-slate-100 opacity-90 px-4 mb-2`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.profile.headerText !== undefined ? layoutConfig.profile.headerText : "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan acara khitanan putra kami:"}
                      </p>
                    );
                  })()}
                </>

              ) : activeTheme !== "birthday-4" && (
                (() => {
                  const props = getTextProps("profile", "header", atmaFont, themeStyle.accentColor);
                  return (
                    <span 
                      className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.profile.headerText !== undefined ? layoutConfig.profile.headerText : "🌸 A Day Full of Happiness"}
                    </span>
                  );
                })()
              )}

              {/* Kid Picture in Rounded Frame */}
              <div 
                onPointerDown={(e) => { if (designerOpen) handlePointerDown(e, "profile", "avatar", "avatar"); }}
                className={`relative shrink-0 rounded-[24px] overflow-hidden border-4 border-white shadow-md mx-auto transition-all ${
                  designerOpen ? "touch-none hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-500/80 cursor-pointer" : ""
                } ${
                  selectedElement?.section === "profile" && selectedElement?.type === "avatar"
                    ? "outline outline-2 outline-blue-600 shadow-lg"
                    : ""
                }`}
                style={{
                  width: `${(layoutConfig.profile.avatarScale || 100) * 0.5}%`,
                  transform: `translate(${layoutConfig.profile.avatarX || 0}px, ${layoutConfig.profile.avatarY || 0}px)`,
                  aspectRatio: "3/4",
                  order: getOrderIndex("profile", "avatar")
                }}
              >
                <Image 
                  src={childPhoto} 
                  alt={childFullName} 
                  fill
                  priority
                  sizes="(max-width: 430px) 50vw, 215px"
                  className="object-cover"
                />
              </div>

              <>
                {(() => {
                  const props = getTextProps("profile", "body", activeTheme === "birthday-8" ? bungeeInlineFont : atmaFont, activeTheme === "birthday-8" ? "#EF8D20" : themeStyle.accentColor);
                  return (
                    <h2 
                      className={`${props.className} text-3xl font-bold tracking-normal filter drop-shadow-[0_1.5px_0_rgba(255,255,255,1)] px-4 mt-2`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.profile.bodyText !== undefined ? layoutConfig.profile.bodyText : childFullName}
                    </h2>
                  );
                })()}
                
                {isKhitan ? (
                  <>
                    {(() => {
                      const props = getTextProps("profile", "bottom", karlaFont, "#FFFFFF");
                      return (
                        <p 
                          className={`${props.className} text-xs font-bold tracking-wider opacity-90 px-4 mt-1`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.profile.bottomText !== undefined ? layoutConfig.profile.bottomText : (invitationData && invitationData.child_order ? invitationData.child_order : "Putra Pertama")}
                        </p>
                      );
                    })()}
                    {(() => {
                      const props = getTextProps("profile", "parents", karlaFont, "#FFFFFF");
                      return (
                        <p 
                          className={`${props.className} text-[10px] font-medium opacity-80 leading-normal px-4 mt-1`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.profile.parentsText !== undefined ? layoutConfig.profile.parentsText : parentsName}
                        </p>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const props = getTextProps("profile", "bottom", averiaFont, "#334155");
                      return (
                        <p 
                          className={`${props.className} text-xs font-bold uppercase tracking-widest opacity-85 px-4 mt-1`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.profile.bottomText !== undefined ? layoutConfig.profile.bottomText : `${birthdayAge}th Birthday Party`}
                        </p>
                      );
                    })()}
                  </>
                )}
              </>

              {/* Render custom layout elements */}
              {renderCustomElements("profile")}
            </div>
          </div>

          {/* SECTION 2: EVENT DETAILS */}
          <div 
            id="event-section"
            className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
            style={{ display: (layoutConfig.event as any)?.hidden ? "none" : undefined,  
              backgroundImage: `url(${layoutConfig.event.bgUrl || getSectionBg(activeTheme, "event")})`,
              backgroundSize: `${layoutConfig.event.bgSizeWidth}% ${layoutConfig.event.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.event.bgPosX}% ${layoutConfig.event.bgPosY}%`
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("event")}
            <div 
              className="absolute flex flex-col justify-center items-center text-center space-y-4"
              style={{
                left: `${layoutConfig.event.left}%`,
                right: `${layoutConfig.event.right}%`,
                top: `${layoutConfig.event.top}%`,
                bottom: `${layoutConfig.event.bottom}%`,
                fontSize: `${layoutConfig.event.fontScale}rem`
              }}
            >
              {/* Large Birthday title */}
              {(() => {
                const props = getTextProps("event", "header", atmaFont, activeTheme === "birthday-4" ? "#00B5C5" : themeStyle.galleryTitleColor);
                return (
                  <h3 
                    className={`${props.className} text-4xl font-bold filter drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] leading-none`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.event.headerText !== undefined ? layoutConfig.event.headerText : (isKhitan ? "Walimatul Khitan" : "Birthday")}
                  </h3>
                );
              })()}

              {/* Date & Time */}
              {/* Date & Time */}
              {layoutConfig.event.bodyText !== undefined ? (
                (() => {
                  const props = getTextProps("event", "body", averiaFont, "#1e293b");
                  return (
                    <div 
                      className={`${props.className} space-y-0.5`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      <p className="text-[1em] font-black leading-snug whitespace-pre-line">
                        {layoutConfig.event.bodyText}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-0.5 flex flex-col items-center">
                  {(() => {
                    const props = getTextProps("event", "date", averiaFont, "#1e293b");
                    return (
                      <p 
                        className={`${props.className} text-[1em] font-black leading-snug max-w-[280px] text-center`} 
                        style={props.style}
                        id={props.id}
                        onPointerDown={props.onPointerDown}
                        onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.event.dateText !== undefined ? layoutConfig.event.dateText : eventDateStr}
                      </p>
                    );
                  })()}
                  {(() => {
                    const props = getTextProps("event", "time", averiaFont, "#1e293b");
                    return (
                      <p 
                        className={`${props.className} text-[1em] font-black text-center`} 
                        style={props.style}
                        id={props.id}
                        onPointerDown={props.onPointerDown}
                        onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.event.timeText !== undefined ? layoutConfig.event.timeText : eventTimeStr}
                      </p>
                    );
                  })()}
                </div>
              )}

              {/* Location */}
              {(() => {
                const props = getTextProps("event", "bottom", averiaFont, "#475569");
                return (
                  <div 
                    className={`${props.className} space-y-0.5`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.event.bottomText === undefined && (
                      <p className="text-[0.85em] font-black uppercase tracking-wide opacity-75">Location:</p>
                    )}
                    <p className="text-[1em] font-bold leading-snug">
                      {layoutConfig.event.bottomText !== undefined ? layoutConfig.event.bottomText : eventLocationStr}
                    </p>
                  </div>
                );
              })()}

              {/* Lihat Lokasi button */}
              <a
                href={invitationData 
                  ? (invitationData.maps_link 
                      ? invitationData.maps_link 
                      : (invitationData.event_location 
                          ? `https://maps.google.com/?q=${encodeURIComponent(invitationData.event_location)}`
                          : "https://www.google.com/maps/place/6%C2%B054'49.9%22S+107%C2%B036'32.3%22E/@-6.9138461,107.6070869,17z"))
                  : "https://www.google.com/maps/place/6%C2%B054'49.9%22S+107%C2%B036'32.3%22E/@-6.9138461,107.6070869,17z"}
                target="_blank"
                rel="noopener noreferrer"
                {...(() => {
                  const p = getFixedElementProps("event", "location", "default", `scale(${layoutConfig.event.buttonScale || 1.0})`, { ...atmaFont, color: "#ffffff", transformOrigin: "center" });
                  return {
                    className: `inline-flex items-center gap-1.5 py-2 px-6 ${themeStyle.btnAccentClass} text-white rounded-full text-[11px] font-bold transition-all shadow-md cursor-pointer border-none uppercase tracking-wider mx-auto ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                <MapPin className="w-3.5 h-3.5" /> Lihat Lokasi
              </a>

              {/* Countdown Timer Label */}
              <div 
                {...(() => {
                  const p = getFixedElementProps("event", "countdown", "default", `scale(${layoutConfig.event.countdownScale || 1.0})`, { transformOrigin: "center" });
                  return {
                    className: `flex gap-2 justify-center select-none ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                {[
                  { value: timeLeft.days, label: "Hari" },
                  { value: timeLeft.hours, label: "Jam" },
                  { value: timeLeft.minutes, label: "Menit" },
                  { value: timeLeft.seconds, label: "Detik" }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-white/90 border ${activeTheme === "birthday-4" ? "border-lime-200" : activeTheme === "birthday-3" ? "border-amber-200" : activeTheme === "birthday-2" ? "border-emerald-250" : "border-yellow-200"} rounded-2xl px-2.5 py-2 text-center min-w-[52px] shadow-md`}>
                    <span className="block text-xl font-extrabold text-slate-800 leading-none">{item.value}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Save The Date button */}
              <button
                onClick={() => {
                  let parseDateStr = "2026-03-31T10:00:00";
                  if (invitationData && invitationData.event_date) {
                    const timePart = invitationData.event_time ? invitationData.event_time.trim() : "10:00";
                    const cleanedTime = timePart.match(/^\d{2}:\d{2}/) ? timePart.substring(0, 5) : "10:00";
                    parseDateStr = `${invitationData.event_date}T${cleanedTime}:00`;
                  }
                  const finalEventDate = new Date(parseDateStr);
                  const icsContent = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'BEGIN:VEVENT',
                    `DTSTART:${isNaN(finalEventDate.getTime()) ? '20260331T100000Z' : finalEventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}`,
                    `SUMMARY:${isKhitan ? "Walimatul Khitan" : "Birthday Party"} ${childFullName}`,
                    `LOCATION:${eventLocationStr}`,
                    `DESCRIPTION:${isKhitan ? "Walimatul Khitan" : `${birthdayAge}th Birthday Party`} ${childFullName}`,
                    'END:VEVENT',
                    'END:VCALENDAR'
                  ].join('\n');
                  const blob = new Blob([icsContent], { type: 'text/calendar' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = isKhitan ? 'khitan-saka.ics' : 'birthday-kanaya.ics';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                {...(() => {
                  const p = getFixedElementProps("event", "button", "default", `scale(${layoutConfig.event.buttonScale || 1.0})`, { ...atmaFont, transformOrigin: "center" });
                  return {
                    className: `inline-flex items-center gap-2 py-2.5 px-8 ${themeStyle.btnAccentClass} text-white rounded-full text-[11px] font-bold transition-all shadow-lg cursor-pointer border-none uppercase tracking-wider mx-auto ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                {isKhitan ? "Simpan Tanggal" : "Save The Date"}
              </button>
              
              {/* Render custom layout elements */}
              {renderCustomElements("event")}
            </div>
          </div>

          {/* MAPS EMBED SECTION */}
          <div 
            id="maps-section"
            className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
            style={{ display: (layoutConfig.maps as any)?.hidden ? "none" : undefined,  
              backgroundImage: `url(${layoutConfig.maps.bgUrl || getSectionBg(activeTheme, "maps")})`,
              backgroundSize: `${layoutConfig.maps.bgSizeWidth}% ${layoutConfig.maps.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.maps.bgPosX}% ${layoutConfig.maps.bgPosY}%`
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("maps")}
            <div 
              className="absolute flex flex-col justify-center items-center text-center space-y-3"
              style={{
                left: `${layoutConfig.maps.left}%`,
                right: `${layoutConfig.maps.right}%`,
                top: `${layoutConfig.maps.top}%`,
                bottom: `${layoutConfig.maps.bottom}%`,
                fontSize: `${layoutConfig.maps.fontScale}rem`
              }}
            >
              {(() => {
                const props = getTextProps("maps", "header", atmaFont, themeStyle.accentColor);
                return (
                  <span 
                    className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.maps.headerText !== undefined ? layoutConfig.maps.headerText : "📍 Google Maps"}
                  </span>
                );
              })()}

              {(() => {
                const props = getTextProps("maps", "body", atmaFont, themeStyle.accentColor);
                return (
                  <h3 
                    className={`${props.className} text-xl font-bold`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.maps.bodyText !== undefined ? layoutConfig.maps.bodyText : "Petunjuk Arah"}
                  </h3>
                );
              })()}
              
              <div 
                {...(() => {
                  const p = getFixedElementProps("maps", "map", "default", "", { backgroundColor: themeStyle.accentColor });
                  return {
                    className: `w-full aspect-square p-1 rounded-2xl border-2 border-white shadow-md mx-auto ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <iframe 
                    src={invitationData
                      ? (invitationData.maps_link 
                          ? (invitationData.maps_link.includes("maps/embed") 
                              ? invitationData.maps_link 
                              : `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.maps_link)}&t=&z=15&ie=UTF8&iwloc=&output=embed`)
                          : (invitationData.event_location
                              ? `https://maps.google.com/maps?q=${encodeURIComponent(invitationData.event_location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                              : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.037145281488!2d107.60638597585093!3d-6.8861343673831885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e658ba3aa575%3A0x64e0ad8f85f3de21!2sHotel%20Pranaya!5e0!3m2!1sid!2sid!4v1703770425000!5m2!1sid!2sid"))
                      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.037145281488!2d107.60638597585093!3d-6.8861343673831885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e658ba3aa575%3A0x64e0ad8f85f3de21!2sHotel%20Pranaya!5e0!3m2!1sid!2sid!4v1703770425000!5m2!1sid!2sid"}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen
                  />
                </div>
              </div>

              {(() => {
                const props = getTextProps("maps", "bottom", averiaFont, "#334155");
                return (
                  <p 
                    className={`${props.className} text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.maps.bottomText !== undefined ? layoutConfig.maps.bottomText : "Ketuk peta untuk memperbesar lokasi atau mendapatkan navigasi langsung melalui Google Maps."}
                  </p>
                );
              })()}

              {/* Render custom layout elements */}
              {renderCustomElements("maps")}
            </div>
          </div>

          {/* SECTION 3: ACTIVITIES */}
          {showActivities && (
            <div 
              id="activities-section"
              className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
              style={{ display: (layoutConfig.activities as any)?.hidden ? "none" : undefined,  
                backgroundImage: `url(${layoutConfig.activities.bgUrl || getSectionBg(activeTheme, "activities")})`,
                backgroundSize: `${layoutConfig.activities.bgSizeWidth}% ${layoutConfig.activities.bgSizeHeight}%`,
                backgroundPosition: `${layoutConfig.activities.bgPosX}% ${layoutConfig.activities.bgPosY}%`
              }}
            >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("activities")}
              <div 
                className="absolute flex flex-col justify-center items-center text-center space-y-3"
                style={{
                  left: `${layoutConfig.activities.left}%`,
                  right: `${layoutConfig.activities.right}%`,
                  top: `${layoutConfig.activities.top}%`,
                  bottom: `${layoutConfig.activities.bottom}%`,
                  fontSize: `${layoutConfig.activities.fontScale}rem`
                }}
              >
                {scheduleLines.length > 0 ? (
                  <>
                    {(() => {
                      const props = getTextProps("activities", "header", atmaFont, themeStyle.accentColor);
                      return (
                        <span 
                          className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isKhitan ? "Syukuran & Walimatul Khitan" : "🎨 Activities & Highlights")}
                        </span>
                      );
                    })()}
                     {!isKhitan && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && (
                      <div 
                        {...(() => {
                          const p = getFixedElementProps("activities", "avatar", "avatar", "");
                          return {
                            className: `relative shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-sm mx-auto my-1 ${p.className}`,
                            style: { ...p.style, width: `${(layoutConfig.activities.avatarScale || 100) * 0.32}%`, aspectRatio: "1/1" },
                            onPointerDown: p.onPointerDown
                          };
                        })()}
                      >
                        <Image 
                          src={activitiesPhoto} 
                          alt="Activities Highlight" 
                          fill
                          sizes="(max-width: 430px) 32vw, 138px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="w-full max-h-[200px] overflow-y-auto space-y-2 pr-1 select-none mt-1">
                      {layoutConfig.activities.bodyText !== undefined ? (
                        (() => {
                          const props = getTextProps("activities", "body", averiaFont, "#1e293b");
                          return (
                            <p 
                              className={`${props.className} text-[11px] font-bold leading-relaxed whitespace-pre-line text-center p-2.5 ${isKhitan ? 'text-black' : 'bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl'}`} 
                              style={props.style}
                              id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                            >
                              {layoutConfig.activities.bodyText}
                            </p>
                          );
                        })()
                      ) : (
                        <>
                          {scheduleLines.map((line: string, idx: number) => {
                          let time = "";
                          let desc = line;
                          const match = line.match(/^\[(.*?)\]\s*(.*)$/) || line.match(/^([0-9.:\-\s]+[WIBwib]*)\s*[:\-]\s*(.*)$/);
                          if (match) {
                            time = match[1].trim();
                            desc = match[2].trim();
                          }
                          
                          if (isKhitan) {
                            const timeProps = getTextProps("activities", "badge", atmaFont, "#000000");
                            const descProps = getTextProps("activities", "body", averiaFont, "#000000");
                            return (
                              <div key={idx} className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-2.5 text-center shadow-sm flex flex-col items-center gap-1.5 justify-center mx-auto w-[85%]">
                                {time && (
                                  <span 
                                    id={timeProps.id}
                                    onPointerDown={timeProps.onPointerDown}
                                    onDoubleClick={timeProps.onDoubleClick}
                                    className={`${timeProps.className} text-[11px] font-black text-black leading-none`} 
                                    style={timeProps.style}
                                  >
                                    {time}
                                  </span>
                                )}
                                <p 
                                  id={descProps.id}
                                  onPointerDown={descProps.onPointerDown}
                                  onDoubleClick={descProps.onDoubleClick}
                                  className={`${descProps.className} text-[0.9rem] font-semibold text-black leading-snug`} 
                                  style={descProps.style}
                                >
                                  {desc}
                                </p>
                              </div>
                            );
                          }

                          const timePropsBd = getTextProps("activities", "badge", atmaFont, themeStyle.accentColor);
                          const descPropsBd = getTextProps("activities", "body", averiaFont, "#1e293b");
                          return (
                            <div key={idx} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-2.5 text-center shadow-sm flex flex-col items-center gap-1.5 justify-center">
                              {time && (
                                <span 
                                  id={timePropsBd.id}
                                  onPointerDown={timePropsBd.onPointerDown}
                                  onDoubleClick={timePropsBd.onDoubleClick}
                                  className={`${timePropsBd.className} text-[10px] font-black ${activeTheme === "birthday-4" ? "text-lime-800 bg-lime-100/85" : activeTheme === "birthday-3" ? "text-amber-800 bg-amber-100/85" : activeTheme === "birthday-2" ? "text-emerald-800 bg-emerald-100/85" : "text-blue-700 bg-blue-100/85"} px-2.5 py-1 rounded-lg leading-none`} 
                                  style={timePropsBd.style}
                                >
                                  {time}
                                </span>
                              )}
                              <p 
                                id={descPropsBd.id}
                                onPointerDown={descPropsBd.onPointerDown}
                                onDoubleClick={descPropsBd.onDoubleClick}
                                className={`${descPropsBd.className} text-[11px] font-bold leading-snug`} 
                                style={descPropsBd.style}
                              >
                                {desc}
                              </p>
                            </div>
                          );
                        })}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {(() => {
                      const props = getTextProps("activities", "header", atmaFont, themeStyle.accentColor);
                      return (
                        <span 
                          className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.activities.headerText !== undefined ? layoutConfig.activities.headerText : (isKhitan ? "🎨 Rangkaian Acara" : "🎨 Activities & Highlights")}
                        </span>
                      );
                    })()}
                    
                    {(() => {
                      const props = getTextProps("activities", "body", atmaFont, themeStyle.accentColor);
                      return (
                        <h3 
                          className={`${props.className} text-xl font-bold leading-tight`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.activities.bodyText !== undefined ? layoutConfig.activities.bodyText : (isKhitan ? "Syukuran & Walimatul Khitan" : "Birthday Games & Magic Bubble")}
                        </h3>
                      );
                    })()}

                    {/* Event Activity photo frame */}
                    {!isKhitan && activitiesPhoto && (!isCustomInvitation || !!invitationData?.activities_photo_url) && (
                      <div 
                        {...(() => {
                          const p = getFixedElementProps("activities", "avatar", "avatar", "");
                          return {
                            className: `relative overflow-hidden border-4 border-white shadow-md mx-auto ${p.className}`,
                            style: { 
                              ...p.style, 
                              width: `${(layoutConfig.activities.avatarScale || 100) * 0.45}%`, 
                              aspectRatio: "1/1",
                              borderRadius: "24px"
                            },
                            onPointerDown: p.onPointerDown
                          };
                        })()}
                      >
                        <Image 
                          src={activitiesPhoto} 
                          alt="Birthday Games" 
                          fill
                          sizes="(max-width: 430px) 45vw, 195px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {(() => {
                      const props = getTextProps("activities", "bottom", averiaFont, "#334155");
                      return (
                        <p 
                          className={`${props.className} text-[10px] font-bold leading-relaxed max-w-[190px] mx-auto`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.activities.bottomText !== undefined ? layoutConfig.activities.bottomText : (isKhitan ? "Semoga menjadi anak yang sholeh, berbakti kepada orang tua, agama, nusa, dan bangsa." : "Exciting Birthday Games and an Amazing Magic Bubble Show Await!")}
                        </p>
                      );
                    })()}
                  </>
                )}
                {/* Render custom layout elements */}
                {renderCustomElements("activities")}
              </div>
            </div>
          )}

          {/* SECTION 4: GALLERY PHOTOS + VIDEO */}
          <div 
            id="gallery-section"
            className="w-full min-h-[740px] bg-no-repeat relative rounded-[32px] shadow-lg pb-8"
            style={{ display: (layoutConfig.gallery as any)?.hidden ? "none" : undefined,  
              backgroundImage: (layoutConfig.gallery.bgUrl || (activeTheme === "birthday-4" || activeTheme === "birthday-3" || activeTheme === "birthday-2" ? getSectionBg(activeTheme, "gallery") : "")) ? `url(${layoutConfig.gallery.bgUrl || (activeTheme === "birthday-4" || activeTheme === "birthday-3" || activeTheme === "birthday-2" ? getSectionBg(activeTheme, "gallery") : "")})` : 'none',
              backgroundSize: `${layoutConfig.gallery.bgSizeWidth}% ${layoutConfig.gallery.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.gallery.bgPosX}% ${layoutConfig.gallery.bgPosY}%`,
              backgroundColor: themeStyle.galleryBg
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("gallery")}
            <div 
              className={`absolute inset-0 flex flex-col items-center text-center px-4 pb-6 ${showVideo ? 'space-y-4 pt-10' : 'justify-center space-y-6 pt-0'}`}
              style={{
                fontSize: `${layoutConfig.gallery.fontScale}rem`
              }}
            >
              {(() => {
                const props = getTextProps("gallery", "header", atmaFont, themeStyle.galleryTitleColor);
                return (
                  <h3 
                    className={`${props.className} text-3xl font-bold tracking-wide filter drop-shadow-[0_1.5px_0_rgba(255,255,255,0.6)]`} 
                    style={props.style}
                    id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                  >
                    {layoutConfig.gallery.headerText !== undefined ? layoutConfig.gallery.headerText : "Galeri Foto"}
                  </h3>
                );
              })()}

              {/* Horizontal scrollable carousel */}
              <div className="w-full flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className="relative aspect-[3/4] w-[60%] shrink-0 snap-center rounded-2xl overflow-hidden border-2 border-white shadow-md active:scale-95 transition-all focus:outline-none cursor-zoom-in"
                  >
                    <Image 
                      src={img} 
                      alt={isKhitan ? `Galeri Khitan ${idx + 1}` : `Birthday Gallery ${idx + 1}`} 
                      fill
                      sizes="(max-width: 430px) 60vw, 258px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <p 
                className="text-[9px] font-bold uppercase tracking-wider opacity-75 select-none" 
                style={{ ...averiaFont, color: activeTheme === "birthday-4" ? "rgba(255,255,255,0.8)" : "#64748b" }}
              >
                Swipe ke kanan untuk melihat foto ➔
              </p>

              {showVideo && (
                <>
                  {/* Divider */}
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px" style={{ backgroundColor: `${themeStyle.galleryTitleColor}40` }} />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ ...averiaFont, color: themeStyle.galleryTitleColor }}>🎬 Video</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${themeStyle.galleryTitleColor}40` }} />
                  </div>

                  {/* YouTube Video Embed */}
                  <div className="w-full space-y-2">
                    {(() => {
                      const props = getTextProps("gallery", "body", atmaFont, themeStyle.galleryTitleColor);
                      return (
                        <h4 
                          className={`${props.className} text-sm font-bold`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.gallery.bodyText !== undefined ? layoutConfig.gallery.bodyText : `Momen Spesial ${childNickname}`}
                        </h4>
                      );
                    })()}
                    <div 
                      {...(() => {
                        const p = getFixedElementProps("gallery", "video");
                        return {
                          className: `w-full aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-md ${p.className}`,
                          style: p.style,
                          onPointerDown: p.onPointerDown
                        };
                      })()}
                    >
                      <iframe
                        src={invitationData ? getYouTubeEmbedUrl(invitationData.video_link || "") : "https://www.youtube.com/embed/ZbZSe6N_BXs?rel=0&modestbranding=1"}
                        title={isKhitan ? "Video Dokumentasi" : "Birthday Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                        style={{ border: 0 }}
                      />
                    </div>
                    {(() => {
                      const props = getTextProps("gallery", "bottom", averiaFont, activeTheme === "birthday-4" ? "rgba(255,255,255,0.8)" : "#64748b");
                      return (
                        <p 
                          className={`${props.className} text-[8px] font-bold`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.gallery.bottomText !== undefined ? layoutConfig.gallery.bottomText : "Tap untuk memutar video 🎥"}
                        </p>
                      );
                    })()}
                  </div>
                </>
              )}
              {/* Render custom layout elements */}
              {renderCustomElements("gallery")}
            </div>
          </div>


          {/* SECTION 5: RSVP DOUBLE-BORDER STAMP CARD */}
          <div 
            id="rsvp-section"
            className="w-full min-h-[620px] bg-no-repeat relative rounded-[32px] shadow-lg pb-8"
            style={{ display: (layoutConfig.rsvp as any)?.hidden ? "none" : undefined,  
              backgroundImage: (layoutConfig.rsvp.bgUrl || getSectionBg(activeTheme, "rsvp")) ? `url(${layoutConfig.rsvp.bgUrl || getSectionBg(activeTheme, "rsvp")})` : 'none',
              backgroundSize: `${layoutConfig.rsvp.bgSizeWidth}% ${layoutConfig.rsvp.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.rsvp.bgPosX}% ${layoutConfig.rsvp.bgPosY}%`,
              backgroundColor: activeTheme === "birthday-4" ? "#FD2274" : "transparent"
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("rsvp")}
            <div 
              className="flex flex-col items-center text-center space-y-4"
              style={{
                paddingLeft: `${layoutConfig.rsvp.left}%`,
                paddingRight: `${layoutConfig.rsvp.right}%`,
                paddingTop: `${layoutConfig.rsvp.top}%`,
                paddingBottom: `${layoutConfig.rsvp.bottom}%`,
                fontSize: `${layoutConfig.rsvp.fontScale}rem`
              }}
            >
              <div className="space-y-1">
                {(() => {
                  const props = getTextProps("rsvp", "header", atmaFont, themeStyle.accentColor);
                  return (
                    <h3 
                      className={`${props.className} ${isKhitan ? "text-4xl" : "text-2xl"} font-bold`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.rsvp.headerText !== undefined ? layoutConfig.rsvp.headerText : (isKhitan ? "Ucapan & Doa Restu" : "Greetings & Prayers")}
                    </h3>
                  );
                })()}
                {(() => {
                  const props = getTextProps("rsvp", "body", averiaFont, activeTheme === "birthday-4" ? "rgba(255,255,255,0.9)" : "#475569");
                  return (
                    <p 
                      className={`${props.className} text-[9px] font-bold uppercase tracking-wider`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.rsvp.bodyText !== undefined ? layoutConfig.rsvp.bodyText : "Konfirmasi Kehadiran & Ucapan"}
                    </p>
                  );
                })()}
              </div>

              <form 
                onSubmit={handleSubmitComment} 
                {...(() => {
                  const p = getFixedElementProps("rsvp", "form", "default", "", { zIndex: 10 });
                  return {
                    className: `w-full space-y-2.5 text-left bg-white/70 p-4 rounded-3xl border border-white/50 shadow-sm relative mx-auto ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                <div>
                  <label htmlFor="name" className={`block text-[8px] font-black uppercase tracking-wider mb-1 ${isKhitan ? "text-black" : "text-slate-500"}`} style={averiaFont}>
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className={`w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 ${activeTheme === "birthday-4" ? "focus:ring-lime-500/20 focus:border-lime-500" : activeTheme === "birthday-3" ? "focus:ring-amber-500/20 focus:border-amber-500" : activeTheme === "birthday-2" ? "focus:ring-emerald-500/20 focus:border-emerald-500" : "focus:ring-pink-500/20 focus:border-pink-500"} bg-white/80 ${isKhitan ? "text-black placeholder:text-slate-450 font-bold" : "text-slate-900"}`}
                    style={averiaFont}
                  />
                </div>

                <div>
                  <label className={`block text-[8px] font-black uppercase tracking-wider mb-1 ${isKhitan ? "text-black" : "text-slate-500"}`} style={averiaFont}>
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Hadir", "Tidak Hadir"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormRsvp(status)}
                        className={`py-1.5 px-2.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          formRsvp === status
                            ? (activeTheme === "birthday-8" ? "bg-[#EF8D20] border-[#EF8D20] text-white shadow-sm" : activeTheme === "birthday-7" ? "bg-[#7B68B1] border-[#7B68B1] text-white shadow-sm" : activeTheme === "birthday-4" ? "bg-lime-600 border-lime-600 text-white shadow-sm" : activeTheme === "birthday-3" ? "bg-amber-600 border-amber-600 text-white shadow-sm" : activeTheme === "birthday-2" ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" : "bg-blue-600 border-blue-600 text-white shadow-sm")
                            : (isKhitan ? "bg-white border-slate-300 text-black hover:bg-slate-50" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-55")
                        }`}
                        style={averiaFont}
                      >
                        {status === "Hadir" ? "✅ Hadir" : "❌ Berhalangan"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className={`block text-[8px] font-black uppercase tracking-wider mb-1 ${isKhitan ? "text-black" : "text-slate-500"}`} style={averiaFont}>
                    Ucapan &amp; Doa Restu
                  </label>
                  <textarea
                    id="comment"
                    required
                    rows={2}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Tuliskan doa ucapan selamat..."
                    className={`w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 ${activeTheme === "birthday-8" ? "focus:ring-orange-500/20 focus:border-[#EF8D20]" : activeTheme === "birthday-7" ? "focus:ring-blue-500/20 focus:border-[#7B68B1]" : activeTheme === "birthday-4" ? "focus:ring-lime-500/20 focus:border-lime-500" : activeTheme === "birthday-3" ? "focus:ring-amber-500/20 focus:border-amber-500" : activeTheme === "birthday-2" ? "focus:ring-emerald-500/20 focus:border-emerald-500" : "focus:ring-pink-500/20 focus:border-pink-500"} bg-white/80 resize-none ${isKhitan ? "text-black placeholder:text-slate-450 font-bold" : "text-slate-900"}`}
                    style={averiaFont}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className={`w-full py-2 rounded-xl ${themeStyle.btnAccentClass} text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer border-none ${isSubmittingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{ ...atmaFont, transform: `scale(${layoutConfig.rsvp.buttonScale || 1.0})`, transformOrigin: "center" }}
                >
                  <Send className="w-3 h-3" /> {isSubmittingComment ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>

              {/* Wishes List */}
              <div 
                {...(() => {
                  const p = getFixedElementProps("rsvp", "comments", "default", "", { zIndex: 10 });
                  return {
                    className: `w-full space-y-3 pt-3 border-t border-dashed border-[#1E4D2B]/20 text-left relative mx-auto ${p.className}`,
                    style: p.style,
                    onPointerDown: p.onPointerDown
                  };
                })()}
              >
                <h4 className={`text-[9px] font-black uppercase tracking-wider ${isKhitan ? "text-slate-200" : "text-slate-600"}`} style={averiaFont}>
                  💬 Buku Ucapan ({comments.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 bg-white/60 rounded-2xl border border-white/40 flex gap-2 shadow-sm">
                      <div className={`w-6 h-6 rounded-full ${activeTheme === "birthday-8" ? "bg-orange-100 text-orange-800" : activeTheme === "birthday-7" ? "bg-blue-100 text-blue-800" : activeTheme === "birthday-4" ? "bg-lime-100 text-lime-800" : activeTheme === "birthday-3" ? "bg-amber-100 text-amber-800" : activeTheme === "birthday-2" ? "bg-emerald-100 text-emerald-800" : "bg-pink-100 text-pink-600"} flex items-center justify-center font-bold text-[10px] shrink-0 select-none`}>
                        {comment.name ? comment.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-extrabold text-slate-700 truncate">{comment.name}</span>
                          <span className={`px-1 py-0.5 rounded text-[6px] font-black uppercase ${
                            comment.rsvp_status === "Hadir" ? "bg-emerald-150 text-emerald-800" : "bg-rose-150 text-rose-800"
                          }`}>
                            {comment.rsvp_status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5 font-sans leading-relaxed break-words bg-white/80 p-1.5 rounded-xl border border-slate-100 shadow-sm inline-block w-full">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5.7: AMPLOP DIGITAL */}
          {showEnvelopeSection && (
            <div
              id="envelope-section"
              className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
              style={{ display: (layoutConfig.envelope as any)?.hidden ? "none" : undefined, 
                backgroundImage: `url(${layoutConfig.envelope.bgUrl || getSectionBg(activeTheme, "envelope")})`,
                backgroundSize: `${layoutConfig.envelope.bgSizeWidth}% ${layoutConfig.envelope.bgSizeHeight}%`,
                backgroundPosition: `${layoutConfig.envelope.bgPosX}% ${layoutConfig.envelope.bgPosY}%`
              }}
            >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("envelope")}
              <div
                className="absolute flex flex-col justify-center items-center text-center space-y-4"
                style={{
                  left: `${layoutConfig.envelope.left}%`,
                  right: `${layoutConfig.envelope.right}%`,
                  top: `${layoutConfig.envelope.top}%`,
                  bottom: `${layoutConfig.envelope.bottom}%`,
                  fontSize: `${layoutConfig.envelope.fontScale}rem`
                }}
              >
                {(() => {
                  const props = getTextProps("envelope", "header", atmaFont, themeStyle.accentColor);
                  return (
                    <span 
                      className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.envelope.headerText !== undefined ? layoutConfig.envelope.headerText : "💝 Amplop Digital"}
                    </span>
                  );
                })()}

                <div className="space-y-1">
                  {(() => {
                    const props = getTextProps("envelope", "body", atmaFont, themeStyle.accentColor);
                    return (
                      <h3 
                        className={`${props.className} text-2xl font-bold`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.envelope.bodyText !== undefined ? layoutConfig.envelope.bodyText : "Dompet Bahagia"}
                      </h3>
                    );
                  })()}
                  {(() => {
                    const props = getTextProps("envelope", "bottom", averiaFont, "#475569");
                    return (
                      <p 
                        className={`${props.className} text-[10px] font-bold max-w-[200px] mx-auto leading-relaxed`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.envelope.bottomText !== undefined ? layoutConfig.envelope.bottomText : "Bagi yang ingin berbagi kebahagiaan, dengan sepenuh hati kami terima doa dan perhatian Anda 🙏"}
                      </p>
                    );
                  })()}
                </div>

                {/* Envelope decoration */}
                <div className="relative w-[70px] h-[52px] mx-auto">
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme === "birthday-8" ? "from-amber-400 to-[#EF8D20]" : activeTheme === "birthday-7" ? "from-blue-400 to-[#7B68B1]" : activeTheme === "birthday-6" ? "from-pink-400 to-rose-600" : activeTheme === "birthday-4" ? "from-lime-400 to-emerald-600" : (activeTheme === "birthday-3" || activeTheme === "birthday-5") ? "from-amber-400 to-orange-650" : activeTheme === "birthday-2" ? "from-emerald-400 to-teal-600" : "from-pink-400 to-blue-500"} rounded-xl shadow-lg`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gift className="w-7 h-7 text-white drop-shadow" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[7px]">✨</span>
                  </div>
                </div>

                {/* Bank transfer card */}
                {(bankAccounts.length > 0 || isLegacyBank || themeId === "khitan-1" || themeId === "khitan-2" || themeId === "khitan-3" || themeId === "khitan-4" || themeId === "khitan-5" || themeId === "khitan-6" || themeId === "khitan-7" || themeId === "khitan-8" || themeId === "khitan-9" || themeId === "birthday-1" || themeId === "birthday-2" || themeId === "birthday-3" || themeId === "birthday-4" || themeId === "birthday-5" || themeId === "birthday-6" || themeId === "birthday-7" || themeId === "birthday-8" || (invitationData && invitationData.gift_address)) && (
                  <div 
                    {...(() => {
                      const p = getFixedElementProps("envelope", "bank", "default", "", { zIndex: 10 });
                      return {
                        className: `w-full bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-md p-4 space-y-3 mx-auto ${p.className}`,
                        style: p.style,
                        onPointerDown: p.onPointerDown
                      };
                    })()}
                  >
                    {(bankAccounts.length > 0 || isLegacyBank || themeId === "khitan-1" || themeId === "khitan-2" || themeId === "khitan-3" || themeId === "khitan-4" || themeId === "khitan-5" || themeId === "khitan-6" || themeId === "khitan-7" || themeId === "khitan-8" || themeId === "birthday-1" || themeId === "birthday-2" || themeId === "birthday-3" || themeId === "birthday-4" || themeId === "birthday-5" || themeId === "birthday-6" || themeId === "birthday-7" || themeId === "birthday-8") && (
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 animate-pulse" style={averiaFont}>
                        Transfer / Kirim Hadiah melalui
                      </p>
                    )}
                    {isLegacyBank ? (
                       <div className={`flex flex-col ${getBankCardClass()} rounded-2xl p-2.5 border text-left`} style={{ color: activeTheme === "khitan-1" ? "#000000" : activeTheme === "khitan-3" ? "#0C4A54" : activeTheme === "khitan-4" ? "#1E3A8A" : activeTheme === "khitan-5" ? "#38BDF8" : activeTheme === "khitan-6" ? "#000000" : activeTheme === "khitan-7" ? "#0369A1" : activeTheme === "khitan-8" ? "#0F766E" : undefined }}>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Informasi Rekening / E-Wallet</p>
                        <p className="text-xs font-black text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                          {invitationData?.bank_account}
                        </p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(invitationData?.bank_account || ""); alert('Informasi rekening disalin!'); }}
                          className={`text-[7px] font-black uppercase ${getBankBtnClass()} text-white px-2 py-1 rounded-lg cursor-pointer border-none shrink-0 self-start mt-2`}
                          style={{ transform: `scale(${layoutConfig.envelope.buttonScale || 1.0})`, transformOrigin: "left center" }}
                        >
                          Salin Rekening
                        </button>
                      </div>
                    ) : bankAccounts.length > 0 ? (
                      bankAccounts.map((acc, idx) => (
                        <div key={idx} className={`flex items-center gap-3 ${getBankCardClass()} rounded-2xl p-2.5 border`} style={{ color: activeTheme === "khitan-1" ? "#000000" : activeTheme === "khitan-3" ? "#0C4A54" : activeTheme === "khitan-4" ? "#1E3A8A" : activeTheme === "khitan-5" ? "#38BDF8" : activeTheme === "khitan-6" ? "#000000" : activeTheme === "khitan-7" ? "#0369A1" : activeTheme === "khitan-8" ? "#0F766E" : undefined }}>
                          <div className={`w-8 h-8 rounded-xl ${getBankBtnClass()} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-black text-[9px] uppercase">{acc.bankName ? acc.bankName.substring(0, 3) : "BANK"}</span>
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide truncate">{acc.bankName || "Bank"}</p>
                            <p className="text-xs font-black text-slate-800 tracking-wider truncate">{acc.accountNumber}</p>
                            {acc.recipientName && <p className="text-[8px] text-slate-500 font-bold truncate">a.n. {acc.recipientName}</p>}
                          </div>
                          <button
                            onClick={() => { 
                              navigator.clipboard.writeText(acc.accountNumber); 
                              alert(`No. Rekening ${acc.bankName || ""} disalin!`); 
                            }}
                            className={`text-[7px] font-black uppercase ${getBankBtnClass()} text-white px-2 py-1 rounded-lg cursor-pointer border-none shrink-0`}
                            style={{ transform: `scale(${layoutConfig.envelope.buttonScale || 1.0})`, transformOrigin: "right center" }}
                          >
                            Salin
                          </button>
                        </div>
                      ))
                    ) : (themeId === "khitan-1" || themeId === "khitan-2" || themeId === "khitan-3" || themeId === "khitan-4" || themeId === "khitan-5" || themeId === "khitan-6" || themeId === "khitan-7" || themeId === "khitan-8" || themeId === "birthday-1" || themeId === "birthday-2" || themeId === "birthday-3" || themeId === "birthday-4" || themeId === "birthday-5" || themeId === "birthday-6" || themeId === "birthday-7" || themeId === "birthday-8") && (
                      <>
                        {/* BCA */}
                        <div className={`flex items-center gap-3 ${getBankCardClass()} rounded-2xl p-2.5 border`} style={{ color: activeTheme === "khitan-1" ? "#000000" : activeTheme === "khitan-3" ? "#0C4A54" : activeTheme === "khitan-4" ? "#1E3A8A" : activeTheme === "khitan-5" ? "#38BDF8" : activeTheme === "khitan-6" ? "#000000" : activeTheme === "khitan-7" ? "#0369A1" : activeTheme === "khitan-8" ? "#0F766E" : undefined }}>
                          <div className={`w-8 h-8 rounded-xl ${getBankBtnClass()} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-black text-[8px]">BCA</span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Bank BCA</p>
                            <p className="text-sm font-black text-slate-800 tracking-wider">1234 5678 90</p>
                            <p className="text-[8px] text-slate-500 font-bold">a.n. {isKhitan ? "Adrian Mahendra" : "Hendra Pratama"}</p>
                          </div>
                          <button
                            onClick={() => { navigator.clipboard.writeText('1234567890'); alert('No. rekening disalin!'); }}
                            className={`text-[7px] font-black uppercase ${getBankBtnClass()} text-white px-2 py-1 rounded-lg cursor-pointer border-none shrink-0`}
                            style={{ transform: `scale(${layoutConfig.envelope.buttonScale || 1.0})`, transformOrigin: "right center" }}
                          >
                            Salin
                          </button>
                        </div>

                        {/* OVO */}
                        <div className={`flex items-center gap-3 ${getBankCardClass()} rounded-2xl p-2.5 border`} style={{ color: activeTheme === "khitan-1" ? "#000000" : activeTheme === "khitan-3" ? "#0C4A54" : activeTheme === "khitan-4" ? "#1E3A8A" : activeTheme === "khitan-5" ? "#38BDF8" : activeTheme === "khitan-6" ? "#000000" : activeTheme === "khitan-7" ? "#0369A1" : activeTheme === "khitan-8" ? "#0F766E" : undefined }}>
                          <div className={`w-8 h-8 rounded-xl ${getBankBtnClass()} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-black text-[8px]">OVO</span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide">OVO / GoPay</p>
                            <p className="text-sm font-black text-slate-800 tracking-wider">0812 3456 7890</p>
                            <p className="text-[8px] text-slate-500 font-bold">a.n. {isKhitan ? "Natasha Salsabila" : "Sari Dewi"}</p>
                          </div>
                          <button
                            onClick={() => { navigator.clipboard.writeText('081234567890'); alert('No. HP disalin!'); }}
                            className={`text-[7px] font-black uppercase ${getBankBtnClass()} text-white px-2 py-1 rounded-lg cursor-pointer border-none shrink-0`}
                            style={{ transform: `scale(${layoutConfig.envelope.buttonScale || 1.0})`, transformOrigin: "right center" }}
                          >
                            Salin
                          </button>
                        </div>
                      </>
                    )}

                    {invitationData && invitationData.gift_address && (
                      <div className={`flex flex-col ${getBankCardClass()} rounded-2xl p-2.5 border text-left mt-2`} style={{ color: activeTheme === "khitan-1" ? "#000000" : activeTheme === "khitan-3" ? "#0C4A54" : activeTheme === "khitan-4" ? "#1E3A8A" : activeTheme === "khitan-5" ? "#38BDF8" : activeTheme === "khitan-6" ? "#000000" : activeTheme === "khitan-7" ? "#0369A1" : activeTheme === "khitan-8" ? "#0F766E" : undefined }}>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Alamat Pengiriman Kado</p>
                        <p className="text-xs font-bold text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                          {invitationData?.gift_address}
                        </p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(invitationData?.gift_address || ""); alert('Alamat kado disalin!'); }}
                          className={`text-[7px] font-black uppercase ${getBankBtnClass()} text-white px-2 py-1 rounded-lg cursor-pointer border-none shrink-0 self-start mt-2`}
                          style={{ transform: `scale(${layoutConfig.envelope.buttonScale || 1.0})`, transformOrigin: "left center" }}
                        >
                          Salin Alamat
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Render custom layout elements */}
                {renderCustomElements("envelope")}
              </div>
            </div>
          )}

          {/* SECTION 5.5: CHECK-IN BARCODE */}
          {showCheckin && (
            <div 
              id="checkin-section"
              className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
              style={{ display: (layoutConfig.checkin as any)?.hidden ? "none" : undefined,  
                backgroundImage: `url(${layoutConfig.checkin.bgUrl || getSectionBg(activeTheme, "checkin")})`,
                backgroundSize: `${layoutConfig.checkin.bgSizeWidth}% ${layoutConfig.checkin.bgSizeHeight}%`,
                backgroundPosition: `${layoutConfig.checkin.bgPosX}% ${layoutConfig.checkin.bgPosY}%`
              }}
            >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("checkin")}
              <div 
                className="absolute flex flex-col justify-center items-center text-center space-y-5"
                style={{
                  left: `${layoutConfig.checkin.left}%`,
                  right: `${layoutConfig.checkin.right}%`,
                  top: `${layoutConfig.checkin.top}%`,
                  bottom: `${layoutConfig.checkin.bottom}%`,
                  fontSize: `${layoutConfig.checkin.fontScale}rem`
                }}
              >
                {/* Header and Title */}
                <div className="space-y-1">
                  {(() => {
                    const props = getTextProps("checkin", "header", atmaFont, themeStyle.accentColor);
                    return (
                      <span 
                        className={`${props.className} text-[10px] font-black uppercase tracking-widest block ${themeStyle.badgeBgClass} px-3 py-1 rounded-full border`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.checkin.headerText !== undefined ? layoutConfig.checkin.headerText : "🎟️ Check-In"}
                      </span>
                    );
                  })()}
                  {(() => {
                    const props = getTextProps("checkin", "body", atmaFont, themeStyle.accentColor);
                    return (
                      <h3 
                        className={`${props.className} text-2xl font-bold filter drop-shadow-[0_1px_0_rgba(255,255,255,1)]`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.checkin.bodyText !== undefined ? layoutConfig.checkin.bodyText : "Barcode Masuk"}
                      </h3>
                    );
                  })()}
                </div>

                {(() => {
                  const props = getTextProps("checkin", "bottom", averiaFont, "#475569");
                  return (
                    <p 
                      className={`${props.className} text-[10px] font-bold max-w-[200px] mx-auto leading-relaxed`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.checkin.bottomText !== undefined ? layoutConfig.checkin.bottomText : "Tunjukkan barcode ini kepada panitia saat tiba di lokasi acara."}
                    </p>
                  );
                })()}

                {/* Check-In QR Code Section */}
                <div 
                  {...(() => {
                    const p = getFixedElementProps("checkin", "qr");
                    return {
                      className: `bg-white/95 border-2 ${themeStyle.avatarBorderClass} rounded-3xl p-5 flex flex-col items-center gap-3 shadow-lg max-w-[200px] mx-auto select-none ${p.className}`,
                      style: p.style,
                      onPointerDown: p.onPointerDown
                    };
                  })()}
                >
                  <div className="relative w-36 h-36 border border-slate-100 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://bintarti.store/checkin?id=${themeId}&code=${typeof window !== "undefined" ? window.location.hash.substring(1) || btoa(guestName) : btoa(guestName)}&type=${isKhitan ? "Khitan" : "Birthday"}`)}`}
                      alt="Check-in QR Code"
                      width={144}
                      height={144}
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>
                  <div className="text-center font-sans space-y-1">
                    <span className="block text-[9px] font-black uppercase tracking-wider" style={{ color: themeStyle.accentColor }}>Check-In Barcode</span>
                    <span className="block text-[8px] text-slate-500 font-bold leading-tight">
                      {isKhitan ? "Tunjukkan barcode ini kepada panitia." : "Show this barcode at check-in."}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-bold leading-tight">
                      {isKhitan ? "Sampai jumpa di lokasi acara! 🎉" : "See you at the party! 🎉"}
                    </span>
                  </div>
                </div>
                {/* Render custom layout elements */}
                {renderCustomElements("checkin")}
              </div>
            </div>
          )}

          {/* SECTION 6.5: TURUT MENGUNDANG */}
          {showTurut && (
            <div
              id="turut-section"
              className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
              style={{ display: (layoutConfig.turut as any)?.hidden ? "none" : undefined, 
                backgroundImage: `url(${layoutConfig.turut.bgUrl || getSectionBg(activeTheme, "turut")})`,
                backgroundSize: `${layoutConfig.turut.bgSizeWidth}% ${layoutConfig.turut.bgSizeHeight}%`,
                backgroundPosition: `${layoutConfig.turut.bgPosX}% ${layoutConfig.turut.bgPosY}%`
              }}
            >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("turut")}
              <div
                className="absolute flex flex-col justify-center items-center text-center"
                style={{
                  left: `${layoutConfig.turut.left}%`,
                  right: `${layoutConfig.turut.right}%`,
                  top: `${layoutConfig.turut.top}%`,
                  bottom: `${layoutConfig.turut.bottom}%`,
                  fontSize: `${layoutConfig.turut.fontScale}rem`
                }}
              >
                {(() => {
                  const props = getTextProps("turut", "header", atmaFont, themeStyle.accentColor);
                  return (
                    <h3 
                      className={`${props.className} text-3xl font-bold filter drop-shadow-[0_1.5px_0_rgba(255,255,255,1)] mb-8`} 
                      style={props.style}
                      id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                    >
                      {layoutConfig.turut.headerText !== undefined ? layoutConfig.turut.headerText : "Turut Mengundang"}
                    </h3>
                  );
                })()}

                {/* Simple flat name list - no box */}
                <div className="space-y-3 w-full">
                  {(() => {
                    const props = getTextProps("turut", "body", atmaFont, "#1e293b");
                    if (layoutConfig.turut.bodyText !== undefined) {
                      return (
                        <p 
                          className={`${props.className} text-sm font-bold leading-relaxed whitespace-pre-line`} 
                          style={props.style}
                          id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                        >
                          {layoutConfig.turut.bodyText}
                        </p>
                      );
                    }
                    return (
                      <div 
                        className={`${props.className} space-y-3 w-full`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {invitedGuestsList.map((name: string, idx: number) => (
                          <p key={idx} className="text-sm font-bold leading-snug">
                            {name}
                          </p>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Render custom layout elements */}
                {renderCustomElements("turut")}
              </div>
            </div>
          )}

          {/* SECTION 6: CLOSING SIGNATURE */}
          <div 
            id="closing-section"
            className="w-full min-h-[100dvh] aspect-auto md:min-h-0 md:aspect-[var(--preview-ratio)] bg-no-repeat relative rounded-[32px] shadow-lg"
            style={{ display: (layoutConfig.closing as any)?.hidden ? "none" : undefined,  
              backgroundImage: `url(${layoutConfig.closing.bgUrl || getSectionBg(activeTheme, "closing")})`,
              backgroundSize: `${layoutConfig.closing.bgSizeWidth}% ${layoutConfig.closing.bgSizeHeight}%`,
              backgroundPosition: `${layoutConfig.closing.bgPosX}% ${layoutConfig.closing.bgPosY}%`
            }}
          >
            {renderKhitanOrnaments("both")}
            {renderCustomOrnaments("closing")}
            <div 
              className="absolute flex flex-col justify-center items-center text-center space-y-4"
              style={{
                left: `${layoutConfig.closing.left}%`,
                right: `${layoutConfig.closing.right}%`,
                top: `${layoutConfig.closing.top}%`,
                bottom: `${layoutConfig.closing.bottom}%`,
                fontSize: `${layoutConfig.closing.fontScale}rem`
              }}
            >
              {getSortedElements("closing").map((el) => {
                if (el.type === "custom") {
                  return renderSingleCustomElement("closing", el.id);
                }
                
                if (el.id === "header") {
                  if (layoutConfig.closing.hideHeader) return null;

                  const avatarEl = (
                    <div 
                      key="avatar"
                      {...(() => {
                        const p = getFixedElementProps("closing", "avatar", "avatar", "");
                        return {
                          className: `relative shrink-0 rounded-[20px] overflow-hidden border-4 border-white shadow-md mx-auto ${p.className}`,
                          style: { ...p.style, width: `${(layoutConfig.closing.avatarScale || 100) * 0.96}px`, aspectRatio: "3/4" },
                          onPointerDown: p.onPointerDown
                        };
                      })()}
                    >
                      <Image 
                        src={childPhoto} 
                        alt={childFullName} 
                        fill
                        sizes="(max-width: 430px) 30vw, 96px"
                        className="object-cover"
                      />
                    </div>
                  );

                  if (isKhitan) {
                    const props = getTextProps("closing", "header", karlaFont, "#1e293b");
                    return (
                      <div key="header" className="space-y-4 flex flex-col items-center">
                         {avatarEl}
                         
                         {/* Kotak Putih Berisi Teks */}
                         <div 
                           className={`${props.className} bg-white/95 p-4 rounded-2xl shadow-md border border-white/30 text-center text-[12px] font-bold max-w-[280px] mx-auto leading-relaxed`} 
                           style={props.style}
                           id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                         >
                           {layoutConfig.closing.headerText !== undefined ? layoutConfig.closing.headerText : "Atas kehadiran dan do'a restu Bapak/Ibu/Saudara/i, kami ucapkan Terimakasih."}
                         </div>
                      </div>
                    );
                  } else {
                    const props = getTextProps("closing", "header", atmaFont, themeStyle.accentColor);
                    return (
                      <div key="header" className="space-y-4 flex flex-col items-center">
                         {avatarEl}
                         
                         <h3 
                           className={`${props.className} text-2xl font-bold filter drop-shadow-[0_1.5px_0_rgba(255,255,255,1)]`} 
                           style={props.style}
                           id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                         >
                           {layoutConfig.closing.headerText !== undefined ? layoutConfig.closing.headerText : "Hope to see you there!"}
                         </h3>
                      </div>
                    );
                  }
                }
                
                if (el.id === "body") {
                  if (layoutConfig.closing.hideBody) return null;
                  if (isKhitan) {
                    const props = getTextProps("closing", "body", karlaFont, "#ffffff");
                    return (
                      <div 
                        key="body"
                        className={`${props.className} text-xs font-bold space-y-1 mt-4 text-center`}
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.closing.bodyText !== undefined ? (
                          <p className="whitespace-pre-line leading-relaxed" style={{ fontSize: '1em' }}>{layoutConfig.closing.bodyText}</p>
                        ) : (
                          <p className="opacity-95 uppercase tracking-wider" style={{ fontSize: '0.92em' }}>Kami Yang Mengundang,</p>
                        )}
                      </div>
                    );
                  } else {
                    const props = getTextProps("closing", "body", averiaFont, "#334155");
                    return (
                      <p 
                        key="body"
                        className={`${props.className} text-xs font-bold uppercase tracking-widest text-center mt-2`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.closing.bodyText !== undefined ? layoutConfig.closing.bodyText : `With Love, ${childNickname}`}
                      </p>
                    );
                  }
                }
                
                if (el.id === "parents") {
                  if (isKhitan && layoutConfig.closing.hideBody !== true && layoutConfig.closing.bodyText === undefined) {
                    const props = getTextProps("closing", "parents", karlaFont, "#ffffff");
                    return (
                      <div 
                        key="parents"
                        className={`${props.className} text-xs font-bold text-center mt-1`}
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        <p className="font-black" style={{ fontSize: '1.16em' }}>{layoutConfig.closing.parentsText !== undefined ? layoutConfig.closing.parentsText : `Kel. ${parentsName}.`}</p>
                      </div>
                    );
                  }
                  return null;
                }
                
                if (el.id === "bottom") {
                  if (layoutConfig.closing.hideBottom) return null;
                  if (isKhitan) {
                    const props = getTextProps("closing", "bottom", atmaFont, "#ffffff");
                    return (
                      <p 
                        key="bottom"
                        className={`${props.className} text-base font-bold mt-3 text-center`} 
                        style={props.style}
                        id={props.id}
                      onPointerDown={props.onPointerDown}
                      onDoubleClick={props.onDoubleClick}
                      >
                        {layoutConfig.closing.bottomText !== undefined ? layoutConfig.closing.bottomText : "Wassalamu’alaikum Wr. Wb."}
                      </p>
                    );
                  }
                  return null;
                }
                return null;
              })}
              {/* Render custom layout elements */}
              {renderCustomElements("closing")}
            </div>
          </div>

        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {activeImageIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIdx(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white transition-colors cursor-pointer border-none"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-full max-h-[85vh] aspect-video w-[600px] h-[400px]">
            <Image 
              src={galleryList[activeImageIdx]} 
              alt="Lightbox Gallery View" 
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          LIVE LAYOUT DESIGNER TOOLBAR
          ───────────────────────────────────────────────────────────────── */}


      {isAdmin && designerOpen && (
        <div className={getPanelClasses()}>
          <div className="w-full space-y-4 flex flex-col h-full justify-between">
            {/* Header Area */}
            <div className="space-y-3 shrink-0">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-xl text-blue-600">
                    <Settings className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">
                    Visual Designer
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={undo}
                    disabled={historyState.index <= 0}
                    className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-700 cursor-pointer transition-colors border-none bg-transparent"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyState.index >= historyState.list.length - 1}
                    className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-700 cursor-pointer transition-colors border-none bg-transparent"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                  <div className="flex items-center bg-slate-100 rounded-lg px-2 mr-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 mr-2">Rasio:</span>
                    <select 
                      value={previewRatio} 
                      onChange={(e) => setPreviewRatio(e.target.value)}
                      className="text-[10px] bg-transparent border-none text-blue-600 font-bold focus:outline-none cursor-pointer py-1"
                    >
                      <option value="9/16">16:9 (Standar)</option>
                      <option value="9/18">18:9 (Medium)</option>
                      <option value="9/19.5">19.5:9 (iPhone)</option>
                      <option value="9/20">20:9 (Android)</option>
                      <option value="9/21">21:9 (Panjang)</option>
                    </select>
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2">
                      <input 
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        checked={!(layoutConfig[selectedSection] as any)?.hidden}
                        onChange={(e) => {
                          updateConfig("hidden", !e.target.checked);
                        }}
                      />
                      Tampilkan Halaman Ini
                    </label>
                  </div>
                  </div>
                  <button 
                    onClick={() => setDesignerOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Mode Indicator & Panel Dock Switcher */}
              <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
                <div className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-black tracking-wide flex items-center gap-1.5 ${
                  isCustomInvitation 
                    ? "bg-emerald-50 border-emerald-250 text-emerald-700" 
                    : "bg-amber-50 border-amber-250 text-amber-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCustomInvitation ? "bg-emerald-550 animate-pulse" : "bg-amber-500"}`}></span>
                  <span>
                    {isCustomInvitation 
                      ? `MODE: UNDANGAN CLIENT (${childFullName || "Klien"})` 
                      : `MODE: TEMA DEFAULT GLOBAL (${activeTheme})`
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2 px-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Panel Dock:</span>
                  <div className="flex gap-1 text-[8px] font-black uppercase">
                    {(["bottom", "left", "right"] as const).map((pos) => (
                      <button 
                        key={pos}
                        onClick={() => changePanelPosition(pos)} 
                        className={`px-2 py-1 rounded-lg transition-all border-none cursor-pointer ${
                          panelPosition === pos 
                            ? "bg-blue-600 text-white shadow-sm font-black" 
                            : "bg-white text-slate-600 hover:bg-slate-105 border border-slate-200"
                        }`}
                      >
                        {pos === "bottom" ? "Bawah" : pos === "left" ? "Kiri" : "Kanan"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            
            
            {/* Section Picker (Always Visible) */}
            <div className="bg-white p-3 rounded-2xl border border-slate-205/65 shadow-sm mx-1 mt-2 mb-1">
              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Pilih Section Kartu</label>
                <select 
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value as keyof ThemeConfig)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-sans focus:ring-1 focus:ring-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="cover">Cover (Lock Screen)</option>
                  <option value="profile">Profile Intro (Putra/Putri)</option>
                  <option value="event">Event Details (Khitan/Birthday)</option>
                  <option value="maps">Google Maps Embed</option>
                  <option value="activities">Activities & Highlights</option>
                  <option value="gallery">Galeri Foto Carousel</option>
                  <option value="rsvp">Form RSVP & Wishes</option>
                  <option value="envelope">Amplop Digital & Hadiah</option>
                  <option value="checkin">Check-In QR Code & Countdown</option>
                  <option value="turut">Turut Mengundang</option>
                  <option value="closing">Closing Card (Terimakasih)</option>
                </select>
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl mb-1 mx-1 mt-3">
              <button 
                onClick={() => setActiveDesignerTab("background")}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all border-none cursor-pointer ${activeDesignerTab === "background" ? "bg-white text-blue-700 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-200"}`}
              >
                1. Latar
              </button>
              <button 
                onClick={() => setActiveDesignerTab("typography")}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all border-none cursor-pointer ${activeDesignerTab === "typography" ? "bg-white text-blue-700 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-200"}`}
              >
                2. Teks
              </button>
              <button 
                onClick={() => setActiveDesignerTab("spacing")}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all border-none cursor-pointer ${activeDesignerTab === "spacing" ? "bg-white text-blue-700 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-200"}`}
              >
                3. Jarak
              </button>
              <button 
                onClick={() => setActiveDesignerTab("music")}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all border-none cursor-pointer ${activeDesignerTab === "music" ? "bg-white text-blue-700 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-200"}`}
              >
                4. Musik
              </button>
            </div>
            
            {/* Scrollable Editor Panels */}
            <div className="flex-1 overflow-y-auto designer-scrollbar space-y-4 py-2 pr-1">

              
              {activeDesignerTab === "background" && (
              /* Section & Background Card */
              <div className="bg-white p-3 rounded-2xl border border-slate-205/65 shadow-sm space-y-3">
                <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">1. Pengaturan Latar Belakang</span>
                
                
                {/* Custom Background Image URL */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">URL Background Kustom</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/custom-bg.jpg"
                    value={layoutConfig[selectedSection].bgUrl && !layoutConfig[selectedSection].bgUrl.startsWith("data:") ? layoutConfig[selectedSection].bgUrl : ""}
                    onChange={(e) => updateConfig("bgUrl", e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                  />
                </div>

                {/* Select Background from Media Gallery */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Pilih dari Galeri Server</label>
                  <button 
                    onClick={() => {
                      setMediaSelectionTarget('background');
                      setIsMediaModalOpen(true);
                      loadMediaFolders();
                    }}
                    className="w-full py-2 rounded-xl text-[10px] font-black text-center border transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 cursor-pointer shadow-sm"
                  >
                    Buka Pengelola Media
                  </button>
                </div>

                {/* Upload Background from Local */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Unggah dari Komputer</label>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLocalBgUpload}
                      className="hidden"
                      id="local-bg-upload-input"
                      disabled={isBgUploading}
                    />
                    <label 
                      htmlFor={isBgUploading ? undefined : "local-bg-upload-input"}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black text-center border transition-all ${
                        isBgUploading 
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed select-none animate-pulse" 
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer border-blue-200 hover:scale-[1.01]"
                      }`}
                    >
                      {isBgUploading ? "⏳ Mengunggah..." : "📁 Pilih File Lokal..."}
                    </label>
                    {layoutConfig[selectedSection].bgUrl && (
                      <button
                        type="button"
                        onClick={() => updateConfig("bgUrl", "")}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                        disabled={isBgUploading}
                       title="Hapus"><Trash2 className="w-3 h-3" /></button>
                    )}
                  </div>
                </div>

                {/* Background Adjustments (Size & Position) */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="block text-[8px] font-black uppercase text-blue-700 tracking-wider">📐 Ukuran & Posisi Background</span>
                  
                  {/* bgSizeWidth */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Lebar Background (Width)</span>
                      <span className="font-mono text-blue-700">{layoutConfig[selectedSection].bgSizeWidth ?? 100}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="range"
                        min="50"
                        max="300"
                        step="1"
                        value={layoutConfig[selectedSection].bgSizeWidth ?? 100}
                        onChange={(e) => updateConfig("bgSizeWidth", parseInt(e.target.value) || 100)}
                        className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="number"
                        min="50"
                        max="300"
                        value={layoutConfig[selectedSection].bgSizeWidth ?? 100}
                        onChange={(e) => updateConfig("bgSizeWidth", parseInt(e.target.value) || 100)}
                        className="w-14 text-xs p-1 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* bgSizeHeight */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Tinggi Background (Height)</span>
                      <span className="font-mono text-blue-700">{layoutConfig[selectedSection].bgSizeHeight ?? 100}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="range"
                        min="50"
                        max="300"
                        step="1"
                        value={layoutConfig[selectedSection].bgSizeHeight ?? 100}
                        onChange={(e) => updateConfig("bgSizeHeight", parseInt(e.target.value) || 100)}
                        className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="number"
                        min="50"
                        max="300"
                        value={layoutConfig[selectedSection].bgSizeHeight ?? 100}
                        onChange={(e) => updateConfig("bgSizeHeight", parseInt(e.target.value) || 100)}
                        className="w-14 text-xs p-1 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* bgPosX */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Posisi X (Horizontal)</span>
                      <span className="font-mono text-blue-700">{layoutConfig[selectedSection].bgPosX ?? 50}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={layoutConfig[selectedSection].bgPosX ?? 50}
                        onChange={(e) => updateConfig("bgPosX", parseInt(e.target.value) || 0)}
                        className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={layoutConfig[selectedSection].bgPosX ?? 50}
                        onChange={(e) => updateConfig("bgPosX", parseInt(e.target.value) || 0)}
                        className="w-14 text-xs p-1 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* bgPosY */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Posisi Y (Vertical)</span>
                      <span className="font-mono text-blue-700">{layoutConfig[selectedSection].bgPosY ?? 50}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={layoutConfig[selectedSection].bgPosY ?? 50}
                        onChange={(e) => updateConfig("bgPosY", parseInt(e.target.value) || 0)}
                        className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={layoutConfig[selectedSection].bgPosY ?? 50}
                        onChange={(e) => updateConfig("bgPosY", parseInt(e.target.value) || 0)}
                        className="w-14 text-xs p-1 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Ornamen UI */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="block text-[8px] font-black uppercase text-blue-700 tracking-wider">🌸 Ornamen Tambahan (Maks 3)</span>
                  <div className="space-y-2">
                    {[0, 1, 2].map(slotIdx => {
                      const ornament = layoutConfig[selectedSection]?.ornaments?.[slotIdx];
                      const isUploading = isOrnamentUploading[slotIdx];
                      return (
                        <div key={slotIdx} className="border border-slate-200 rounded-xl p-2 flex items-center justify-between bg-slate-50">
                          {ornament ? (
                            <>
                              <img 
                                src={ornament.url} 
                                className="w-8 h-8 object-contain rounded bg-white shadow-sm border border-slate-100" 
                                style={{ transform: ornament.flipHorizontal ? "scaleX(-1)" : "none" }}
                              />
                              <div className="flex-1 px-3">
                                <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-wider mb-1">
                                  <span>Skala</span>
                                  <span>{ornament.scale}x</span>
                                </div>
                                <input 
                                  type="range" min="0.3" max="3" step="0.1" 
                                  value={ornament.scale} 
                                  onChange={(e) => handleOrnamentScale(slotIdx, parseFloat(e.target.value))} 
                                  className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <label className="text-[9px] font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                                    <input 
                                      type="checkbox" 
                                      checked={!!ornament.flipHorizontal}
                                      onChange={(e) => handleOrnamentFlip(slotIdx, e.target.checked)}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-3 h-3"
                                    />
                                    Mirror Horizontal
                                  </label>
                                </div>
                              </div>
                              <button onClick={() => handleDeleteOrnament(slotIdx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-100" title="Hapus Ornamen">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 ml-1">Slot {slotIdx + 1} Kosong</span>
                              <div className="flex gap-1 relative">
                                <button 
                                  onClick={() => {
                                    setMediaSelectionTarget(slotIdx);
                                    setIsMediaModalOpen(true);
                                    loadMediaFolders();
                                  }}
                                  className="px-2 py-1 rounded-lg text-[9px] font-black border transition-all bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer shadow-sm flex items-center gap-1"
                                >
                                  <FolderOpen className="w-3 h-3" /> Galeri
                                </button>
                                <input 
                                  type="file" id={`ornament-upload-${slotIdx}`} className="hidden" accept="image/*" 
                                  onChange={(e) => handleOrnamentUpload(e, slotIdx)} 
                                  disabled={isUploading}
                                />
                                <label htmlFor={isUploading ? undefined : `ornament-upload-${slotIdx}`} className={`px-2 py-1 rounded-lg text-[9px] font-black border transition-all flex items-center gap-1 ${isUploading ? "bg-slate-100 text-slate-400 border-slate-200 cursor-wait" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer shadow-sm"}`}>
                                  <Upload className="w-3 h-3" /> {isUploading ? "..." : "PC"}
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

                            )}

              {activeDesignerTab === "typography" && (
              /* Typography Properties Panel */
              <div className="bg-white p-3 rounded-2xl border border-slate-205/65 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">2. Tipografi (Typography)</span>
                  <button
                    onClick={handleAddTextElement}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[8px] font-black uppercase rounded-lg cursor-pointer border-none flex items-center gap-1 transition-all hover:scale-102"
                  >
                    <Plus className="w-3 h-3" /> Tambah Elemen
                  </button>
                </div>

                {/* Element pills selection */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Pilih Elemen Aktif</label>
                  <div className="flex flex-wrap gap-1">
                    {getSortedElements(selectedSection)
                      .filter((el) => el.type === "default" || el.type === "custom")
                      .map((el) => {
                      const isActive = selectedElement?.type === el.type && selectedElement?.key === el.id;
                      return (
                        <button
                          key={el.id}
                          onClick={() => setSelectedElement({ section: selectedSection, type: el.type, key: el.id })}
                          className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border transition-all cursor-pointer ${
                            isActive
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {el.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Urutan & Visibilitas Elemen */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100/60">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Urutan & Visibilitas</label>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {getSortedElements(selectedSection).map((el, idx, arr) => {
                      const isHidden = el.type === "default" && (
                        el.id === "header" ? layoutConfig[selectedSection].hideHeader :
                        el.id === "body" ? layoutConfig[selectedSection].hideBody :
                        layoutConfig[selectedSection].hideBottom
                      );
                      const isSelected = selectedElement?.key === el.id;
                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElement({ section: selectedSection, type: el.type, key: el.id })}
                          className={`flex items-center justify-between p-1.5 rounded-lg border text-[10px] cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-blue-50/50 border-blue-300 shadow-sm" 
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                          }`}
                        >
                          <span className={`font-bold truncate max-w-[120px] ${isHidden ? "line-through text-slate-400" : "text-slate-700"}`}>
                            {el.name} {isHidden && "(Sembunyi)"}
                          </span>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => moveElementOrder(selectedSection, el.id, "up")}
                              disabled={idx === 0}
                              className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                              title="Pindahkan Ke Atas"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveElementOrder(selectedSection, el.id, "down")}
                              disabled={idx === arr.length - 1}
                              className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                              title="Pindahkan Ke Bawah"
                            >
                              ▼
                            </button>
                            {el.type === "default" ? (
                              <button
                                onClick={() => {
                                  const propName = el.id === "header" ? "hideHeader" : el.id === "body" ? "hideBody" : "hideBottom";
                                  updateConfig(propName as any, !isHidden, selectedSection);
                                }}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${isHidden ? "bg-slate-100 text-slate-400 hover:bg-slate-200" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                              >
                                {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const currentElements = layoutConfig[selectedSection].customElements || [];
                                  const updated = currentElements.filter((item: any) => item.id !== el.id);
                                  updateConfig("customElements" as any, updated, selectedSection);
                                  if (selectedElement?.key === el.id) {
                                    setSelectedElement({ section: selectedSection, type: "default", key: "header" });
                                  }
                                }}
                                className="px-1.5 py-0.5 bg-red-50 text-red-655 border border-red-200 rounded text-[8px] font-black uppercase cursor-pointer hover:bg-red-105"
                               title="Hapus"><Trash2 className="w-3 h-3" /></button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Properties inputs */}
                {(() => {
                  const activeEl = getActiveElementProps();
                  if (!activeEl) {
                    return <p className="text-[10px] text-slate-400 text-center py-2">Pilih elemen di atas untuk memuat pengaturan.</p>;
                  }

                  if (selectedElement?.type === "avatar") {
                    return (
                      <div className="space-y-3 pt-1 border-t border-slate-100/60">
                        {/* Avatar Scale */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            <span>Ukuran Foto (%)</span>
                            <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                              {activeEl.avatarScale}%
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="10"
                              max="300"
                              step="5"
                              value={activeEl.avatarScale}
                              onChange={(e) => updateActiveElementProp("avatarScale", parseInt(e.target.value))}
                              className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                            />
                            <input
                              type="number"
                              min="10"
                              max="300"
                              value={activeEl.avatarScale}
                              onChange={(e) => updateActiveElementProp("avatarScale", parseInt(e.target.value) || 100)}
                              className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Avatar X Position */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            <span>Posisi Horizontal (X - px)</span>
                            <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                              {activeEl.avatarX}px
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="-200"
                              max="200"
                              step="1"
                              value={activeEl.avatarX}
                              onChange={(e) => updateActiveElementProp("avatarX", parseInt(e.target.value))}
                              className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                            />
                            <input
                              type="number"
                              min="-200"
                              max="200"
                              value={activeEl.avatarX}
                              onChange={(e) => updateActiveElementProp("avatarX", parseInt(e.target.value) || 0)}
                              className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Avatar Y Position */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            <span>Posisi Vertikal (Y - px)</span>
                            <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                              {activeEl.avatarY}px
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="-200"
                              max="200"
                              step="1"
                              value={activeEl.avatarY}
                              onChange={(e) => updateActiveElementProp("avatarY", parseInt(e.target.value))}
                              className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                            />
                            <input
                              type="number"
                              min="-200"
                              max="200"
                              value={activeEl.avatarY}
                              onChange={(e) => updateActiveElementProp("avatarY", parseInt(e.target.value) || 0)}
                              className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3 pt-1 border-t border-slate-100/60">
                      {/* Text Content */}
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Isi Teks</label>
                        {selectedElement?.type === "custom" ? (
                          <div className="flex gap-2">
                            <textarea
                              value={activeEl.text}
                              onChange={(e) => updateActiveElementProp("text", e.target.value)}
                              rows={2}
                              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                            />
                            <button
                              onClick={handleDeleteActiveCustomElement}
                              className="p-2 bg-red-50 hover:bg-red-105 border border-red-250 text-red-650 rounded-xl cursor-pointer transition-colors"
                              title="Hapus Elemen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <textarea
                            value={activeEl.text}
                            onChange={(e) => updateActiveElementProp("text", e.target.value)}
                            placeholder="Masukkan tulisan kustom..."
                            rows={2}
                            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                          />
                        )}
                      </div>

                      {/* Font Family Selector */}
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Jenis Font (Google Fonts)</label>
                        <select
                          value={activeEl.fontFamily}
                          onChange={(e) => updateActiveElementProp("fontFamily", e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          {selectedElement?.type === "default" && <option value="">Bawaan Tema</option>}
                          <option value="Karla">Karla (Sleek Sans-Serif)</option>
                          <option value="Atma">Atma (Javanese Cursive)</option>
                          <option value="Rolleston">Rolleston (Javanese Bold Serif)</option>
                          <option value="Averia">Averia (Playful Sans)</option>
                          <option value="Bree">Bree Serif (Classic serif)</option>
                          <option value="Cookie">Cookie (Elegant Cursive)</option>
                          <option value="Beth">Beth Ellen (Script Handwritten)</option>
                          <option value="Bungee">Bungee (Bold Block)</option>
                          <option value="BungeeInline">Bungee Inline (Inline block)</option>
                          <option value="LucidaCalligraphy">Lucida Calligraphy (Elegant Script)</option>
                          <option value="ArefRuqaa">Aref Ruqaa (Classic Arabic/Batik)</option>
                          <option value="BetterSaturday">Better Saturday (Handwritten Script)</option>
                          <option value="SansSerif">Sans-Serif (Standard)</option>
                        </select>
                      </div>

                      {/* Text Animation Selector */}
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Animasi Teks</label>
                        <select
                          value={activeEl.animationClass || ""}
                          onChange={(e) => updateActiveElementProp("animationClass", e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          <option value="">Tidak Ada (Statik)</option>
                          <option value="animate-pulse">Pulse (Berdenyut)</option>
                          <option value="animate-bounce">Bounce (Melompat)</option>
                          <option value="animate-ping">Ping (Memancar)</option>
                          <option value="animate-spin">Spin (Berputar)</option>
                          <option value="animate-fade-in">Fade In (Muncul)</option>
                        </select>
                      </div>

                      {/* Font Size slider + numeric input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                          <span>Ukuran Font</span>
                          <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                            {selectedElement?.type === "default" ? `${activeEl.fontSize}rem` : `${activeEl.fontSize}px`}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min={selectedElement?.type === "default" ? "0.4" : "8"}
                            max={selectedElement?.type === "default" ? "4.0" : "72"}
                            step={selectedElement?.type === "default" ? "0.05" : "1"}
                            value={activeEl.fontSize}
                            onChange={(e) => updateActiveElementProp("fontSize", parseFloat(e.target.value))}
                            className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                          />
                          <input
                            type="number"
                            min={selectedElement?.type === "default" ? "0.4" : "8"}
                            max={selectedElement?.type === "default" ? "4.0" : "72"}
                            step={selectedElement?.type === "default" ? "0.05" : "1"}
                            value={activeEl.fontSize}
                            onChange={(e) => updateActiveElementProp("fontSize", parseFloat(e.target.value) || (selectedElement?.type === "default" ? 1.0 : 14))}
                            className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Font Color picker + Text Code input */}
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Warna Font</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={activeEl.fontColor.startsWith("#") && activeEl.fontColor.length === 7 ? activeEl.fontColor : "#ffffff"}
                            onChange={(e) => updateActiveElementProp("fontColor", e.target.value)}
                            className="w-9 h-9 rounded-xl cursor-pointer p-0 border border-slate-200 shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={activeEl.fontColor}
                            onChange={(e) => updateActiveElementProp("fontColor", e.target.value)}
                            placeholder="#ffffff"
                            className="w-full text-xs font-mono p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

                            )}

              {activeDesignerTab === "spacing" && (
              /* Layout & Spacing Card */
              <div className="bg-white p-3 rounded-2xl border border-slate-205/65 shadow-sm space-y-3">
                <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">3. Tata Letak & Jarak (Spacing)</span>
                
                {/* Button Scale Control */}
                <div className="space-y-1.5 p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                    <span>Ukuran Tombol (Button Scale)</span>
                    <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      {layoutConfig[selectedSection].buttonScale !== undefined ? layoutConfig[selectedSection].buttonScale : 1.0}x
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={layoutConfig[selectedSection].buttonScale !== undefined ? layoutConfig[selectedSection].buttonScale : 1.0}
                      onChange={(e) => updateConfig("buttonScale", parseFloat(e.target.value))}
                      className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={layoutConfig[selectedSection].buttonScale !== undefined ? layoutConfig[selectedSection].buttonScale : 1.0}
                      onChange={(e) => updateConfig("buttonScale", parseFloat(e.target.value) || 1.0)}
                      className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {selectedSection === "event" && (
                  <div className="space-y-1.5 p-2.5 bg-slate-50 border border-slate-100 rounded-2xl mt-3">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Ukuran Timer (Countdown Scale)</span>
                      <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                        {layoutConfig.event.countdownScale !== undefined ? layoutConfig.event.countdownScale : 1.0}x
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={layoutConfig.event.countdownScale !== undefined ? layoutConfig.event.countdownScale : 1.0}
                        onChange={(e) => updateConfig("countdownScale", parseFloat(e.target.value))}
                        className="flex-grow accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={layoutConfig.event.countdownScale !== undefined ? layoutConfig.event.countdownScale : 1.0}
                        onChange={(e) => updateConfig("countdownScale", parseFloat(e.target.value) || 1.0)}
                        className="w-14 text-xs p-1.5 text-center font-mono rounded-lg border border-slate-200 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {(() => {
                  const activeEl = getActiveElementProps();
                  if (!activeEl) {
                    return <p className="text-[10px] text-slate-400 text-center py-2">Pilih elemen di atas untuk memuat pengaturan spacing.</p>;
                  }

                  return (
                    <div className="space-y-3">
                      {/* Width Block */}
                      {selectedElement?.type !== "avatar" && (
                      <div className="space-y-1.5 pb-2 border-b border-slate-100">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                          <span>Lebar Elemen (Width)</span>
                          <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                            {(activeEl as any).width !== undefined ? (activeEl as any).width : 100}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="1"
                          value={(activeEl as any).width !== undefined ? (activeEl as any).width : 100}
                          onChange={(e) => updateActiveElementProp("width", parseInt(e.target.value))}
                          className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>
                      )}

                      {/* Margin Block */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Margin (Jarak Luar - px)</label>
                          <span className="text-[7px] font-black text-blue-600 bg-blue-50 px-1 py-0.5 rounded">OUTSIDE</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[
                            { name: "Top", key: "marginTop", label: "Atas" },
                            { name: "Bottom", key: "marginBottom", label: "Bawah" },
                            { name: "Left", key: "marginLeft", label: "Kiri" },
                            { name: "Right", key: "marginRight", label: "Kanan" }
                          ].map((item) => (
                            <div key={item.key} className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                              <span className="text-[8px] text-slate-400 block mb-1 font-bold">{item.label}</span>
                              <input
                                type="number"
                                value={(activeEl as any)[item.key]}
                                onChange={(e) => updateActiveElementProp(item.key, parseInt(e.target.value) || 0)}
                                className="w-full text-xs p-1 text-center rounded-lg border border-slate-200 font-mono bg-white focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Padding Block */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Padding (Jarak Dalam - px)</label>
                          <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">INSIDE</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[
                            { name: "Top", key: "paddingTop", label: "Atas" },
                            { name: "Bottom", key: "paddingBottom", label: "Bawah" },
                            { name: "Left", key: "paddingLeft", label: "Kiri" },
                            { name: "Right", key: "paddingRight", label: "Kanan" }
                          ].map((item) => (
                            <div key={item.key} className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                              <span className="text-[8px] text-slate-400 block mb-1 font-bold">{item.label}</span>
                              <input
                                type="number"
                                value={(activeEl as any)[item.key]}
                                onChange={(e) => updateActiveElementProp(item.key, parseInt(e.target.value) || 0)}
                                className="w-full text-xs p-1 text-center rounded-lg border border-slate-200 font-mono bg-white focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Database client fields (conditional rendering) */}
                {isCustomInvitation && (
                  <div className="space-y-2 bg-emerald-50/50 p-2.5 rounded-2xl border border-emerald-100 text-emerald-800 mt-2">
                    <span className="block text-[8px] font-black uppercase tracking-wide flex items-center gap-1">
                      <span>🔄</span> Sinkronisasi Database Client
                    </span>
                    {renderSectionTextInput()}
                  </div>
                )}
              </div>
              )}

              {activeDesignerTab === "music" && (
              /* Music Card */
              <div className="bg-white p-3 rounded-2xl border border-slate-205/65 shadow-sm space-y-3">
                <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">4. Musik Latar (Google Drive)</span>
                
                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Pilih Lagu dari Katalog</label>
                  <div className="flex gap-1.5">
                    <select
                      value={(layoutConfig as any).global?.musicUrl || ""}
                      onChange={(e) => {
                        const newConfig = { ...layoutConfig } as any;
                        if (!newConfig.global) newConfig.global = {};
                        newConfig.global.musicUrl = e.target.value;
                        setLayoutConfig(newConfig);
                      }}
                      className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-white font-sans focus:ring-1 focus:ring-blue-600 focus:outline-none cursor-pointer"
                    >
                      {musicCatalog.map((item, idx) => (
                        <option key={idx} value={item.url}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {(!musicCatalog.find(m => m.url === (layoutConfig as any).global?.musicUrl) || (layoutConfig as any).global?.musicUrl === "custom") && (
                    <div className="pt-2 space-y-1">
                      <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Link GDrive (Custom)</label>
                      <input 
                        type="text" 
                        placeholder="https://drive.google.com/file/d/..."
                        value={(layoutConfig as any).global?.musicUrl !== "custom" ? ((layoutConfig as any).global?.musicUrl || "") : ""}
                        onChange={(e) => {
                          const newConfig = { ...layoutConfig } as any;
                          if (!newConfig.global) newConfig.global = {};
                          newConfig.global.musicUrl = e.target.value;
                          setLayoutConfig(newConfig);
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                      />
                    </div>
                  )}

                  {(layoutConfig as any).global?.musicUrl && (layoutConfig as any).global?.musicUrl !== "custom" && (
                    <div className="mt-2 text-[9px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                      <Music className="w-3 h-3 shrink-0" />
                      Lagu disiapkan! Klik Buka Undangan untuk memutar.
                    </div>
                  )}
                </div>


              </div>
              )}

            </div>

            {/* Action Bar / Save / Reset */}
            <div className="space-y-2 pt-2 border-t border-slate-100 shrink-0">
              {isCustomInvitation ? (
                <button
                  onClick={handleSaveDesignToDb}
                  disabled={isSavingDbConfig}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-250 disabled:text-slate-450 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                >
                  {isSavingDbConfig ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan Desain...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Simpan Desain ke Database
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSaveDesignToDb}
                  disabled={isSavingDbConfig}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-250 disabled:text-slate-450 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                >
                  {isSavingDbConfig ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan Tema Default...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Simpan Tema Default ke Server
                    </>
                  )}
                </button>
              )}
              
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleCopyConfig}
                  className="flex-grow py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin Kode Desain
                </button>
                <button
                  onClick={handleResetConfig}
                  className="px-3.5 py-2 bg-slate-105 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border-none"
                  title="Reset Bawaan"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          LIQUID GLASS BOTTOM NAVIGATION BAR
          ───────────────────────────────────────────────────────────────── */}
      {isOpened && (
        <div
          className="fixed bottom-5 z-45 select-none animate-fade-in-up"
          style={{ left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '400px' }}
        >
          <div
            className="w-full h-[64px] bg-white/65 backdrop-blur-2xl border border-white/80 rounded-full flex items-center justify-around px-2"
            style={{
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1.5px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset'
            }}
          >
            {filteredNavItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-300 gap-0.5 border-none bg-transparent cursor-pointer flex-1"
                  style={atmaFont}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: 'rgba(0,0,0,0.07)',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.08)'
                      }}
                    />
                  )}

                  <item.icon
                    className="w-[19px] h-[19px] transition-transform duration-300 relative z-10"
                    style={{ color: isActive ? '#111' : '#555', transform: isActive ? 'scale(1.12)' : 'scale(1)' }}
                  />
                  <span
                    className="text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none"
                    style={{ color: isActive ? '#111' : '#777' }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MEDIA GALLERY MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-lg text-slate-800">Galeri Media Server</h3>
                <p className="text-xs font-bold text-slate-500">
                  {selectedMediaFolder ? `Folder: ${selectedMediaFolder}` : "Pilih folder untuk melihat gambar"}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsMediaModalOpen(false);
                  setSelectedMediaFolder(null);
                  setMediaFiles([]);
                }}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              {isMediaLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedMediaFolder ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setSelectedMediaFolder(null);
                      setMediaFiles([]);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer w-max"
                  >
                    ← Kembali ke Daftar Folder
                  </button>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaFiles.length > 0 ? mediaFiles.slice((mediaFilePage - 1) * 10, mediaFilePage * 10).map((file, idx) => (
                      <div 
                        key={idx} 
                        className="group relative aspect-[9/16] bg-slate-100 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer shadow-sm transition-all hover:shadow-md"
                        onClick={() => {
                          if (mediaSelectionTarget === 'background') {
                            updateConfig("bgUrl", file.publicUrl);
                          } else if (typeof mediaSelectionTarget === 'number') {
                            const slotIdx = mediaSelectionTarget;
                            setLayoutConfig(prev => {
                              const conf = prev[selectedSection] as any;
                              if (!conf) return prev;
                              const currentOrnaments = conf.ornaments ? [...conf.ornaments] : [];
                              currentOrnaments[slotIdx] = {
                                id: `ornament_${slotIdx}`,
                                url: file.publicUrl,
                                transformX: 0,
                                transformY: 0,
                                scale: 1,
                                animation: 'float',
                                flipHorizontal: false
                              };
                              return {
                                ...prev,
                                [selectedSection]: {
                                  ...conf,
                                  ornaments: currentOrnaments
                                }
                              };
                            });
                          }
                          setTimeout(() => pushHistory(latestConfigRef.current), 50);
                          setIsMediaModalOpen(false);
                          setSelectedMediaFolder(null);
                          setMediaFiles([]);
                          setMediaSelectionTarget(null);
                        }}
                      >
                        <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                            Pilih Gambar
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full text-center py-10 text-slate-400 text-sm font-bold">
                        Folder ini kosong.
                      </div>
                    )}
                  </div>
                  {Math.ceil(mediaFiles.length / 10) > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button 
                        onClick={() => setMediaFilePage(p => Math.max(1, p - 1))}
                        disabled={mediaFilePage === 1}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-700 transition-colors"
                      >
                        &lt; Sebelumnya
                      </button>
                      <span className="text-xs font-bold text-slate-600">
                        Halaman {mediaFilePage} dari {Math.ceil(mediaFiles.length / 10)}
                      </span>
                      <button 
                        onClick={() => setMediaFilePage(p => Math.min(Math.ceil(mediaFiles.length / 10), p + 1))}
                        disabled={mediaFilePage === Math.ceil(mediaFiles.length / 10)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-700 transition-colors"
                      >
                        Selanjutnya &gt;
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1">
                    {mediaFolders.slice((mediaFolderPage - 1) * 10, mediaFolderPage * 10).map((folder, idx) => (
                    <div 
                      key={idx}
                      onClick={() => loadMediaFiles(folder.name)}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FolderOpen className="w-8 h-8 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 text-center break-all">{folder.name}</span>
                    </div>
                  ))}
                  </div>
                  {Math.ceil(mediaFolders.length / 10) > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button 
                        onClick={() => setMediaFolderPage(p => Math.max(1, p - 1))}
                        disabled={mediaFolderPage === 1}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-700 transition-colors"
                      >
                        &lt; Sebelumnya
                      </button>
                      <span className="text-xs font-bold text-slate-600">
                        Halaman {mediaFolderPage} dari {Math.ceil(mediaFolders.length / 10)}
                      </span>
                      <button 
                        onClick={() => setMediaFolderPage(p => Math.min(Math.ceil(mediaFolders.length / 10), p + 1))}
                        disabled={mediaFolderPage === Math.ceil(mediaFolders.length / 10)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-700 transition-colors"
                      >
                        Selanjutnya &gt;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
