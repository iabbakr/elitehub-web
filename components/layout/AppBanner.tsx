"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Smartphone } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/utils";

const DISMISS_KEY = "elitehub_banner_dismissed";

export default function AppBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    // Only show on mobile
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
      setVisible(true);
    } else if (/android/.test(ua)) {
      setPlatform("android");
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const storeUrl = platform === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
  const storeLabel = platform === "ios" ? "App Store" : "Google Play";

  return (
    <div className="relative bg-navy-deep border-b border-gold-muted z-[60]">
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* App icon — Now using your logo image */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(201,168,76,0.3)] overflow-hidden">
          <Image
            src="/logo.png"
            alt="EliteHub NG"
            width={36}
            height={36}
            className="w-full h-full object-contain p-1"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-semibold font-body leading-tight">EliteHub NG</p>
          <p className="text-white/55 text-[11px] font-body">Best on the app — full escrow & tracking</p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-1.5 rounded-full bg-gold text-navy-DEFAULT text-[12px] font-bold hover:bg-gold-light transition-all font-body"
        >
          {storeLabel}
        </a>

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 p-1 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
