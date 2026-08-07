"use client";

import { useEffect } from "react";

export default function AdminPWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox !== undefined
    ) {
      (window as any).workbox.register();
    } else if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered in Admin mode", reg.scope))
        .catch((err) => console.error("Service worker registration failed", err));
    }
  }, []);

  return null;
}
