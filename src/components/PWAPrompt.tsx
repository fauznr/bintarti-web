"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Track registration
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          setSwRegistration(registration);
          
          // Check if there's already a waiting worker
          if (registration.waiting) {
            setShowPrompt(true);
          }

          // Listen for new workers being installed
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new update is installed and waiting to activate
                  setShowPrompt(true);
                }
              });
            }
          });
        }
      });

      // Once the new SW takes control, reload the page
      const handleControllerChange = () => {
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      // Tell the waiting SW to skip waiting and activate immediately
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      setShowPrompt(false); // Hide prompt while it reloads
    } else {
      // Fallback reload
      window.location.reload();
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-[#3D1F08] text-[#F5EDD6] px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#CD853F] flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-500 w-[90%] max-w-sm">
      <div className="flex-1">
        <p className="text-sm font-bold font-sans">Pembaruan Tersedia!</p>
        <p className="text-xs text-amber-200/80 font-sans mt-0.5">Versi terbaru Bintarti telah siap.</p>
      </div>
      <button 
        onClick={handleUpdate}
        className="flex items-center gap-1.5 bg-gradient-to-r from-[#CD853F] to-[#B37336] hover:opacity-90 text-amber-950 px-3 py-2 rounded-xl text-xs font-black transition-all shadow-lg active:scale-95"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Muat Ulang
      </button>
    </div>
  );
}
