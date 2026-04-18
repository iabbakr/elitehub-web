"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, MapPin, Star, Phone, MessageCircle,
  X, ChevronDown, RefreshCw, ArrowRight,
  Shield, Clock, Briefcase,
} from "lucide-react";
import { NIGERIAN_STATE_NAMES } from "@/lib/nigeria-locations";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; icon: string; desc: string }> = {
  Home_Repair_Maintenance:  { label: "Home Repair",       icon: "🔧", desc: "Plumbers, electricians & more" },
  Cleaning_Services:        { label: "Cleaning",          icon: "🧹", desc: "House, office & fumigation" },
  Logistics_Transport:      { label: "Logistics",         icon: "🚚", desc: "Delivery, haulage & drivers" },
  Events_Entertainment:     { label: "Events",            icon: "🎉", desc: "Planners, DJs & photographers" },
  Tech_Gadgets_Repair:      { label: "Tech Repair",       icon: "💻", desc: "Phone, laptop & TV repair" },
  Automotive_Services:      { label: "Automotive",        icon: "🚗", desc: "Mechanics & car services" },
  Education_Lessons:        { label: "Tutors",            icon: "📚", desc: "Home tutors & coaches" },
  Health_Wellness:          { label: "Health & Wellness", icon: "💪", desc: "Fitness, nurses & nutrition" },
  Business_Professional:    { label: "Business & Legal",  icon: "💼", desc: "Designers, lawyers & accountants" },
  Personal_Services:        { label: "Beauty & Personal", icon: "✂️", desc: "Tailors, stylists & barbers" },
  Real_Estate_Services:     { label: "Real Estate",       icon: "🏢", desc: "Agents & property managers" },
  Construction_Fabrication: { label: "Construction",      icon: "🏗️", desc: "Welders, tilers & builders" },
};

const SUBCATEGORIES: Record<string, string[]> = {
  Home_Repair_Maintenance:  ["Plumbing", "Electrical", "Painting", "AC Repair", "Roofing", "Carpentry", "Generator Repair", "General Repairs"],
  Cleaning_Services:        ["House Cleaning", "Office Cleaning", "Fumigation", "Car Washing", "Post Construction", "Carpet Cleaning"],
  Logistics_Transport:      ["Delivery", "Relocation", "Haulage", "Dispatch Rider", "Driver", "Car Rental"],
  Events_Entertainment:     ["Event Planning", "Photography", "Videography", "DJ", "Catering", "Decoration", "MC"],
  Tech_Gadgets_Repair:      ["Phone Repair", "Laptop Repair", "TV Repair", "CCTV", "Networking", "Software"],
  Automotive_Services:      ["Mechanic", "Auto Electrician", "Vulcanizer", "Car Wash", "Towing", "Auto Body"],
  Education_Lessons:        ["Home Tutoring", "Music Lessons", "Driving School", "Coding", "Language Lessons"],
  Health_Wellness:          ["Fitness Training", "Massage", "Home Nursing", "Nutritionist", "Physiotherapy"],
  Business_Professional:    ["Graphic Design", "Web Development", "Legal Services", "Accounting", "Marketing"],
  Personal_Services:        ["Tailor", "Hairstylist", "Makeup Artist", "Barber", "Nail Technician"],
  Real_Estate_Services:     ["Property Agent", "Property Manager", "Surveyor", "Valuation"],
  Construction_Fabrication: ["Welding", "Woodwork", "Tiling", "POP Ceiling", "Block Laying"],
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Provider {
  uid: string;
  businessName: string;
  businessPhone?: string;
  whatsappNumber?: string;
  serviceCategory: string;
  serviceSubcategory?: string;
  serviceDescription?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  totalReviewsAllTime?: number;
  yearsOfExperience?: number;
  rcNumber?: string;
  certifications?: string[];
  instagramUsername?: string;
  location?: { state: string; city: string; area: string };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPhone(raw: string): string {
  const clean = raw.replace(/\D/g, "");
  if (clean.startsWith("0") && clean.length === 11) return "234" + clean.slice(1);
  if (clean.length === 10) return "234" + clean;
  return clean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className="text-[12px]"
          style={{ color: i <= Math.round(rating) ? "#C9A84C" : "rgba(11,46,51,0.2)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── Provider Card ─────────────────────────────────────────────────────────────

function ProviderCard({
  provider,
  onOpen,
}: {
  provider: Provider;
  onOpen: (p: Provider) => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const rating = provider.rating ?? 0;
  const reviews = provider.totalReviewsAllTime ?? provider.reviewCount ?? 0;
  const phone = provider.whatsappNumber || provider.businessPhone;
  const available = provider.isAvailable !== false;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    const num = formatPhone(phone);
    const msg = `Hi ${provider.businessName}, I found you on EliteHub NG and I'd like to enquire about your ${provider.serviceSubcategory ?? provider.serviceCategory.replace(/_/g, " ")} services.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <article
      className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden hover:border-gold-muted hover:shadow-gold transition-all duration-300 cursor-pointer group"
      onClick={() => onOpen(provider)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[rgba(11,46,51,0.06)] to-[rgba(11,46,51,0.02)]">
        {provider.imageUrl && !imgErr ? (
          <Image
            src={provider.imageUrl}
            alt={provider.businessName}
            fill
            className="object-cover"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20 font-display font-bold text-navy-DEFAULT">
              {provider.businessName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Available badge */}
        <div
          className={cn(
            "absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold font-body",
            available
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          )}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: available ? "#10b981" : "#9ca3af" }}
          />
          {available ? "Available" : "Busy"}
        </div>

        {/* Verified badge */}
        {provider.rcNumber && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full text-[10px] font-bold font-body bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.4)] text-gold-DEFAULT">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5">
        <h3 className="font-display font-semibold text-navy-DEFAULT text-sm leading-snug mb-0.5 line-clamp-1 group-hover:text-navy-mid transition-colors">
          {provider.businessName}
        </h3>

        {provider.serviceSubcategory && (
          <p className="text-[11px] text-gold-DEFAULT font-semibold font-body uppercase tracking-wide mb-1.5">
            {provider.serviceSubcategory}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={rating} />
          <span className="text-[11px] text-navy-DEFAULT/60 font-body">
            {rating > 0 ? rating.toFixed(1) : "New"} {reviews > 0 ? `(${reviews})` : ""}
          </span>
        </div>

        {/* Location */}
        {provider.location && (
          <div className="flex items-center gap-1 text-[11px] text-navy-DEFAULT/50 font-body mb-3">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">
              {provider.location.city}, {provider.location.state}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleWhatsApp}
            disabled={!phone}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25D36615] border border-[#25D36625] text-[#25D366] text-xs font-bold font-body hover:bg-[#25D36625] transition-all disabled:opacity-40"
            aria-label="WhatsApp"
          >
            <MessageCircle size={13} />
            WhatsApp
          </button>
          <button
            onClick={handleCall}
            disabled={!phone}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gold-faint border border-gold-muted text-gold-DEFAULT text-xs font-bold font-body hover:bg-gold-DEFAULT hover:text-navy-DEFAULT transition-all disabled:opacity-40"
            aria-label="Call"
          >
            <Phone size={13} />
            Call
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Provider Detail Modal ─────────────────────────────────────────────────────

function ProviderModal({
  provider,
  onClose,
}: {
  provider: Provider;
  onClose: () => void;
}) {
  const rating = provider.rating ?? 0;
  const reviews = provider.totalReviewsAllTime ?? provider.reviewCount ?? 0;
  const phone = provider.whatsappNumber || provider.businessPhone;

  // Lock body scroll
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

  const handleWhatsApp = () => {
    if (!phone) return;
    const num = formatPhone(phone);
    const msg = `Hi ${provider.businessName}, I found you on EliteHub NG and I'd like to enquire about your services.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#071E22]/80 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-lg sm:mx-4 bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-8px_40px_rgba(11,46,51,0.3)] sm:shadow-[0_32px_80px_rgba(11,46,51,0.4)] max-h-[92dvh] sm:max-h-[88dvh] flex flex-col">

        {/* Header */}
        <div className="bg-[#0B2E33] px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10 relative overflow-hidden shrink-0">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[rgba(201,168,76,0.1)] pointer-events-none" />
          {/* Drag handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 sm:hidden" />
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mt-2">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] shrink-0 flex items-center justify-center">
              {provider.imageUrl ? (
                <Image src={provider.imageUrl} alt={provider.businessName} width={56} height={56} className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl font-display font-bold text-gold-DEFAULT">
                  {provider.businessName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 id="modal-title" className="font-display text-xl font-bold text-white mb-1">
                {provider.businessName}
              </h2>
              {provider.serviceSubcategory && (
                <p className="text-white/60 text-sm font-body">{provider.serviceSubcategory}</p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {provider.isAvailable !== false && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[11px] font-bold font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available Now
              </span>
            )}
            {provider.rcNumber && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] text-gold-DEFAULT text-[11px] font-bold font-body">
                <Shield size={10} />
                Verified Business
              </span>
            )}
            {(provider.certifications?.length ?? 0) > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/25 text-blue-400 text-[11px] font-bold font-body">
                ✓ Certified
              </span>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8 sm:py-6 -mt-4 space-y-5">

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={rating} />
              <span className="font-display font-bold text-navy-DEFAULT text-lg">{rating.toFixed(1)}</span>
              <span className="text-navy-DEFAULT/50 text-sm font-body">
                · {reviews} review{reviews !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Info rows */}
          {provider.location && (
            <InfoRow icon={MapPin} label="Location">
              {provider.location.area ? `${provider.location.area}, ` : ""}
              {provider.location.city}, {provider.location.state}
            </InfoRow>
          )}

          {(provider.yearsOfExperience ?? 0) > 0 && (
            <InfoRow icon={Briefcase} label="Experience">
              {provider.yearsOfExperience} year{provider.yearsOfExperience !== 1 ? "s" : ""} of experience
            </InfoRow>
          )}

          {phone && (
            <InfoRow icon={Phone} label="Contact">
              <a href={`tel:${phone}`} className="text-gold-DEFAULT hover:underline font-semibold">{phone}</a>
            </InfoRow>
          )}

          {/* Description */}
          {provider.serviceDescription && (
            <div className="bg-[rgba(11,46,51,0.04)] rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]">
              <p className="text-navy-DEFAULT/70 text-sm font-body leading-relaxed">
                {provider.serviceDescription}
              </p>
            </div>
          )}

          {/* Social */}
          {provider.instagramUsername && (
            <a
              href={`https://instagram.com/${provider.instagramUsername.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-navy-DEFAULT/60 hover:text-navy-DEFAULT font-body transition-colors"
            >
              <span className="text-base">📸</span>
              @{provider.instagramUsername.replace("@", "")} on Instagram
            </a>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleWhatsApp}
              disabled={!phone}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-white text-sm font-bold font-body transition-all disabled:opacity-50"
              style={{ backgroundColor: "#25D366" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1aad54"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#25D366"; }}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </button>
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-gold-muted bg-gold-faint text-gold-DEFAULT text-sm font-bold font-body hover:bg-gold-DEFAULT hover:text-navy-DEFAULT transition-all",
                !phone && "pointer-events-none opacity-40"
              )}
            >
              <Phone size={18} />
              Call Provider
            </a>
          </div>

          <p className="text-center text-navy-DEFAULT/35 text-xs font-body pt-1 pb-2">
            🔒 Always meet in a safe place. EliteHub NG does not guarantee provider quality.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-gold-DEFAULT" />
      </div>
      <div>
        <p className="text-[11px] text-navy-DEFAULT/40 font-body uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-navy-DEFAULT font-body leading-snug">{children}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ServiceProvidersListing({ category }: { category: string }) {
  const meta = CATEGORY_META[category] ?? { label: "Service Providers", icon: "🔧", desc: "" };
  const subcats = SUBCATEGORIES[category] ?? [];

  const [providers, setProviders]         = useState<Provider[]>([]);
  const [loading, setLoading]             = useState(true);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [hasMore, setHasMore]             = useState(false);
  const [page, setPage]                   = useState(1);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDSearch]     = useState("");
  const [selectedSub, setSelectedSub]     = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedProvider, setSelected]   = useState<Provider | null>(null);
  const debounceRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDSearch(v), 450);
  };

  const fetchProviders = useCallback(async (pg: number, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page:  String(pg),
        limit: "20",
      });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (selectedSub)     params.set("subcategory", selectedSub);
      if (selectedState)   params.set("state", selectedState);

      const res = await fetch(
        `${API_BASE}/service-providers/category/${category}?${params}`
      );
      const data = await res.json();

      if (data.success) {
        const incoming: Provider[] = data.providers ?? [];
        setProviders(prev => append ? [...prev, ...incoming] : incoming);
        setHasMore(data.hasMore ?? incoming.length === 20);
        setPage(pg);
      } else {
        setError("Could not load providers. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your network.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, debouncedSearch, selectedSub, selectedState]);

  // Refetch when filters change
  useEffect(() => {
    setPage(1);
    fetchProviders(1, false);
  }, [fetchProviders]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-[#0B2E33] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[rgba(201,168,76,0.08)] blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />

        <div className="section relative py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-gold-DEFAULT transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">{meta.label}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] flex items-center justify-center text-2xl shrink-0">
              {meta.icon}
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{meta.label}</h1>
              <p className="text-white/55 text-sm font-body mt-0.5">{meta.desc}</p>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search providers…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm font-body outline-none focus:border-gold-muted focus:ring-1 focus:ring-gold-faint transition-all"
              />
            </div>

            {/* State filter */}
            <div className="relative sm:w-48">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-body outline-none focus:border-gold-muted appearance-none transition-all"
              >
                <option value="" className="bg-[#0B2E33]">All States</option>
                {NIGERIAN_STATE_NAMES.map(s => (
                  <option key={s} value={s} className="bg-[#0B2E33]">{s}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Subcategory chips ──────────────────────────────────────────── */}
      {subcats.length > 0 && (
        <div className="border-b border-[rgba(11,46,51,0.08)] bg-white">
          <div className="section py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedSub(null)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-xs font-bold font-body border transition-all",
                  !selectedSub
                    ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                    : "bg-white border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/60 hover:border-gold-muted"
                )}
              >
                All
              </button>
              {subcats.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(prev => prev === sub ? null : sub)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-full text-xs font-bold font-body border transition-all whitespace-nowrap",
                    selectedSub === sub
                      ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                      : "bg-white border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/60 hover:border-gold-muted"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Providers grid ────────────────────────────────────────────── */}
      <div className="section py-8 pb-16">
        {!loading && !error && providers.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <p className="text-sm font-semibold text-navy-DEFAULT font-body">
                {providers.length} provider{providers.length !== 1 ? "s" : ""} found
                {selectedState ? ` in ${selectedState}` : ""}
              </p>
            </div>
            <button
              onClick={() => fetchProviders(1, false)}
              className="p-2 rounded-xl border border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/50 hover:text-navy-DEFAULT hover:border-gold-muted transition-all"
              aria-label="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-navy-DEFAULT/50 text-sm font-body">Finding providers near you…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-2xl">⚠️</div>
            <h3 className="font-display font-semibold text-navy-DEFAULT">Something went wrong</h3>
            <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs">{error}</p>
            <button onClick={() => fetchProviders(1, false)} className="btn-gold px-6 py-3 rounded-xl text-sm mt-2">
              Try Again
            </button>
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center text-4xl">
              {meta.icon}
            </div>
            <h3 className="font-display font-semibold text-navy-DEFAULT text-xl">No providers found</h3>
            <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs">
              {debouncedSearch || selectedSub || selectedState
                ? "Try clearing some filters to see more providers."
                : `No ${meta.label} providers have registered in this area yet. Check back soon!`}
            </p>
            {(debouncedSearch || selectedSub || selectedState) && (
              <button
                onClick={() => {
                  setSearch(""); setDSearch("");
                  setSelectedSub(null); setSelectedState("");
                }}
                className="btn-ghost px-6 py-2.5 rounded-xl text-sm mt-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {providers.map(p => (
                <ProviderCard key={p.uid} provider={p} onOpen={setSelected} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => fetchProviders(page + 1, true)}
                  disabled={loadingMore}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-gold-muted bg-gold-faint text-gold-DEFAULT font-semibold text-sm font-body hover:bg-gold-DEFAULT hover:text-navy-DEFAULT hover:shadow-gold transition-all disabled:opacity-60"
                >
                  {loadingMore ? (
                    <><RefreshCw size={15} className="animate-spin" /> Loading…</>
                  ) : (
                    <><ArrowRight size={15} /> Load More Providers</>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* App CTA */}
        {!loading && !error && (
          <div className="mt-14 bg-[#0B2E33] rounded-3xl px-6 py-10 sm:px-10 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[rgba(201,168,76,0.08)] blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-gold-DEFAULT text-[11px] font-bold font-body uppercase tracking-widest mb-4">
                📱 Are you a provider?
              </span>
              <h2 className="font-display text-2xl font-bold text-white mb-3 text-balance">
                List Your Services on EliteHub NG
              </h2>
              <p className="text-white/60 text-sm font-body max-w-md mx-auto mb-6 leading-relaxed">
                Reach thousands of customers in your area. Download the app to set up your profile and start getting bookings today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://play.google.com/store/apps/details?id=com.elitehubng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy-DEFAULT font-bold text-sm font-body hover:bg-gold-light transition-all"
                >
                  🤖 Get the Android App
                </a>
                <a
                  href="https://apps.apple.com/app/elitehubng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-white/20 text-white font-bold text-sm font-body hover:bg-white/10 transition-all"
                >
                  🍎 Get the iOS App
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Provider detail modal ──────────────────────────────────────── */}
      {selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}