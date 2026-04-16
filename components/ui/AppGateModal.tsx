"use client";

import { useEffect } from "react";
import { X, Smartphone, Apple, ArrowRight } from "lucide-react";
import { GATED_FEATURES, APP_STORE_URL, PLAY_STORE_URL } from "@/lib/utils";
import { GatedFeature } from "@/types";

interface AppGateModalProps {
  feature: GatedFeature;
  onClose: () => void;
}

const FEATURE_ICONS: Record<GatedFeature, string> = {
  cart:             "🛒",
  checkout:         "💳",
  orders:           "📦",
  wallet:           "💰",
  wishlist:         "❤️",
  auth:             "🔐",
  dispute:          "⚖️",
  seller_dashboard: "🏪",
};

export default function AppGateModal({ feature, onClose }: AppGateModalProps) {
  const config = GATED_FEATURES[feature];
  const icon = FEATURE_ICONS[feature];

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#071E22]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/*
       * Modal card
       * — On mobile: slides up from bottom, capped at 92dvh so it never hides behind
       *   the browser chrome (address bar). Uses dvh so it responds to the visible
       *   viewport height, not the full layout viewport.
       * — On sm+: centred, max-w-md, normal height.
       * — overflow-y-auto lets content scroll inside on very small devices.
       */}
      <div className="relative w-full sm:max-w-md sm:mx-4 bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-8px_40px_rgba(11,46,51,0.25)] sm:shadow-[0_32px_80px_rgba(11,46,51,0.4)] max-h-[92dvh] sm:max-h-[90dvh] flex flex-col">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-[#0B2E33] px-6 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12 relative overflow-hidden shrink-0">
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[rgba(201,168,76,0.12)]" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/5" />

          {/* Drag handle (mobile only) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 sm:hidden" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>

          {/* Feature icon */}
          <div className="relative mt-2 sm:mt-0 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] flex items-center justify-center text-2xl sm:text-3xl">
              {icon}
            </div>
          </div>

          <h2
            id="gate-title"
            className="font-display text-xl sm:text-2xl font-bold text-white mb-1.5 text-balance"
          >
            {config.title}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-body">
            {config.description}
          </p>
        </div>

        {/* ── Body (scrollable on tiny screens) ───────────────────────────── */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 -mt-6 overflow-y-auto overscroll-contain flex-1">

          {/* Escrow trust row */}
          <div className="flex items-start gap-3 mb-5 bg-[rgba(11,46,51,0.04)] rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]">
            <span className="text-lg shrink-0 mt-0.5">🔒</span>
            <p className="text-navy-DEFAULT/70 text-[13px] leading-snug font-body">
              <strong className="text-navy-DEFAULT">Escrow-protected payments</strong>
              {" "}— your money is safe until you confirm delivery
            </p>
          </div>

          {/* Feature checklist */}
          <ul className="space-y-2 mb-5">
            {[
              "Real-time order tracking",
              "Secure wallet & withdrawals",
              "Dispute resolution",
              "In-app seller chat",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-navy-DEFAULT/75 font-body">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center shrink-0">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Download CTAs */}
          <div className="flex flex-col gap-3">

            {/*
             * App Store — explicit bg so it's always visible regardless of
             * Tailwind purge or custom-colour resolution issues.
             * Hover deepens the navy slightly.
             */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group"
              style={{ backgroundColor: "#0B2E33" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#144D54")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0B2E33")}
            >
              <div className="flex items-center gap-3">
                <Apple size={22} className="text-white shrink-0" />
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-body">Download on the</p>
                  <p className="font-semibold text-white text-sm font-body leading-none">App Store</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#C9A84C] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            {/* Google Play */}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#D4B96A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Smartphone size={22} className="text-[#0B2E33] shrink-0" />
                <div>
                  <p className="text-[#0B2E33]/60 text-[10px] uppercase tracking-widest font-body">Get it on</p>
                  <p className="font-semibold text-[#0B2E33] text-sm font-body leading-none">Google Play</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#0B2E33] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-2.5 text-sm text-navy-DEFAULT/50 hover:text-navy-DEFAULT transition-colors font-body"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}