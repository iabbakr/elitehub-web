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

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(11,46,51,0.4)] animate-slide-up">
        {/* Navy gradient header */}
        <div className="bg-navy-gradient px-8 pt-8 pb-12 relative overflow-hidden">
          {/* Decorative orb */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold-faint" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/5" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-faint border border-gold-muted flex items-center justify-center text-3xl shadow-gold">
              {icon}
            </div>
          </div>

          <h2 id="gate-title" className="font-display text-2xl font-bold text-white mb-2 text-balance">
            {config.title}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-body">
            {config.description}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 -mt-6">
          {/* Trust line */}
          <div className="flex items-center gap-3 mb-6 bg-[rgba(11,46,51,0.04)] rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]">
            <span className="text-lg">🔒</span>
            <p className="text-navy-DEFAULT/70 text-[13px] font-body">
              <strong className="text-navy-DEFAULT">Escrow-protected payments</strong> — your money is safe until you confirm delivery
            </p>
          </div>

          {/* Feature checklist */}
          <ul className="space-y-2 mb-6">
            {[
              "Real-time order tracking",
              "Secure wallet & withdrawals",
              "Dispute resolution",
              "In-app seller chat",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-navy-DEFAULT/75 font-body">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Download CTAs */}
          <div className="flex flex-col gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-navy-DEFAULT text-white hover:bg-navy-mid transition-all group"
            >
              <div className="flex items-center gap-3">
                <Apple size={22} />
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-body">Download on the</p>
                  <p className="font-semibold text-sm font-body leading-none">App Store</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gold-DEFAULT group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy-DEFAULT hover:bg-gold-light transition-all group"
            >
              <div className="flex items-center gap-3">
                <Smartphone size={22} />
                <div>
                  <p className="text-navy-DEFAULT/60 text-[10px] uppercase tracking-widest font-body">Get it on</p>
                  <p className="font-semibold text-sm font-body leading-none">Google Play</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-navy-DEFAULT group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-sm text-navy-DEFAULT/50 hover:text-navy-DEFAULT transition-colors font-body"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
