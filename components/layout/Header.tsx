"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Menu, X, ShoppingCart, Heart, Package, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import AppGateModal from "@/components/ui/AppGateModal";

const NAV_LINKS = [
  { label: "Products",  href: "/products" },
  { label: "Services",  href: "/services" },
  { label: "Sell",      href: "#sell",     gated: true, feature: "seller_dashboard" as const },
];

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gatedFeature, setGatedFeature] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-navy-DEFAULT/95 backdrop-blur-md shadow-navy border-b border-white/10"
            : "bg-navy-DEFAULT"
        )}
      >
        {/* Top bar */}
        <div className="section py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gold-DEFAULT flex items-center justify-center shadow-gold">
              <span className="font-display font-bold text-navy-DEFAULT text-sm">E</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-white text-lg tracking-tight">
                Elite<span className="text-gold-DEFAULT">Hub</span>
              </span>
              <span className="block text-[9px] text-white/50 tracking-widest uppercase -mt-0.5 font-body">
                Nigeria
              </span>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-4"
          >
            <div className="relative w-full group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold-DEFAULT transition-colors"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm outline-none transition-all focus:bg-white/15 focus:border-gold-muted focus:ring-2 focus:ring-gold-faint font-body"
              />
            </div>
          </form>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.gated) {
                    setGatedFeature(link.feature);
                  } else {
                    router.push(link.href);
                  }
                }}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all font-body"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* Cart — gated */}
            <button
              onClick={() => setGatedFeature("cart")}
              aria-label="Cart"
              className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <ShoppingCart size={20} />
            </button>

            {/* Wishlist — gated */}
            <button
              onClick={() => setGatedFeature("wishlist")}
              aria-label="Wishlist"
              className="hidden sm:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <Heart size={20} />
            </button>

            {/* Get the app */}
            <Link
              href="#download"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-DEFAULT text-navy-DEFAULT text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-gold font-body"
            >
              Get App
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category quick-links bar */}
        <div className="border-t border-white/8">
          <div className="section">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs">
              {[
                { label: "Phones",      href: "/products?category=Phones_Tablets",      icon: "📱" },
                { label: "Fashion",     href: "/products?category=Womens_Fashion",       icon: "👗" },
                { label: "Food",        href: "/products?category=Fruits_Vegetables",    icon: "🥦" },
                { label: "Electronics", href: "/products?category=TV_Audio_Gaming",      icon: "📺" },
                { label: "Cars",        href: "/products?category=Vehicles_Cars",        icon: "🚗" },
                { label: "Computers",   href: "/products?category=Laptops_Computers",    icon: "💻" },
                { label: "Home",        href: "/products?category=Home_Appliances",      icon: "🏠" },
                { label: "Beauty",      href: "/products?category=Beauty_Personal_Care", icon: "💄" },
                { label: "Services",    href: "/services",                               icon: "🔧" },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/65 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap font-body"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-navy-deep/98 backdrop-blur-xl">
            <div className="section py-4 space-y-4">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:border-gold-muted font-body"
                  />
                </div>
              </form>

              {/* Mobile nav */}
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      setMobileOpen(false);
                      if (link.gated) setGatedFeature(link.feature);
                      else router.push(link.href);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); setGatedFeature("cart"); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body"
                >
                  <ShoppingCart size={18} /> Cart
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setGatedFeature("orders"); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body"
                >
                  <Package size={18} /> Orders
                </button>
              </nav>

              {/* Download CTA */}
              <a
                href="#download"
                onClick={() => setMobileOpen(false)}
                className="btn-gold w-full text-center py-3.5 rounded-xl font-semibold"
              >
                Download Free App
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Gate modal */}
      {gatedFeature && (
        <AppGateModal
          feature={gatedFeature as any}
          onClose={() => setGatedFeature(null)}
        />
      )}
    </>
  );
}
