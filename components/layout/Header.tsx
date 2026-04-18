"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ShoppingCart, Heart, Package, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import AppGateModal from "@/components/ui/AppGateModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/Usecartstore";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Sell",     href: "#sell",  gated: true, feature: "seller_dashboard" as const },
];

export default function Header() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const totalItems = useCartStore((s) => s.getTotalItems());

  const [query,        setQuery]        = useState("");
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [gatedFeature, setGatedFeature] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef                     = useRef<HTMLDivElement>(null);
  const searchRef                       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  // Smart gate: if authenticated use web page; if not prompt sign-in
  const handleGated = (feature: string) => {
    const webRoutes: Record<string, string> = {
      cart:     "/cart",
      orders:   "/orders",
      wishlist: "/wishlist",
    };
    if (isAuthenticated && webRoutes[feature]) {
      router.push(webRoutes[feature]);
    } else if (!isAuthenticated) {
      router.push(`/auth?next=${webRoutes[feature] || "/"}`);
    } else {
      setGatedFeature(feature);
    }
  };

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0B2E33]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(11,46,51,0.3)] border-b border-white/10"
            : "bg-[#0B2E33]"
        )}
      >
        {/* Top bar */}
        <div className="section py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-[0_2px_8px_rgba(201,168,76,0.3)] shrink-0 flex items-center justify-center">
              <Image src="/logo.png" alt="EliteHub NG" width={32} height={32} className="w-full h-full object-contain" priority />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-white text-lg tracking-tight">
                EliteHub<span className="text-gold-DEFAULT"> NG</span>
              </span>
              <span className="block text-[9px] text-white/50 tracking-widest uppercase -mt-0.5 font-body">Nigeria</span>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold-DEFAULT transition-colors" />
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
                onClick={() => link.gated ? setGatedFeature(link.feature) : router.push(link.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all font-body"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            {/* Cart with badge */}
            <button
              onClick={() => handleGated("cart")}
              aria-label="Cart"
              className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-DEFAULT text-navy-DEFAULT text-[9px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <Heart size={20} />
            </Link>

            {/* Orders */}
            <button onClick={() => handleGated("orders")} aria-label="Orders" className="hidden sm:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <Package size={20} />
            </button>

            {/* ── Auth: user menu OR sign-in ── */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gold-muted bg-gold-faint hover:bg-gold-faint/80 transition-all"
                >
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gold-DEFAULT text-navy-DEFAULT text-xs font-bold flex items-center justify-center">
                      {avatarInitial}
                    </div>
                  )}
                  <span className="text-gold-DEFAULT text-xs font-bold font-body max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={12} className={cn("text-gold-DEFAULT transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#0B2E33] border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-semibold text-sm font-body truncate">{user.name}</p>
                      <p className="text-white/40 text-xs font-body capitalize mt-0.5">{user.role}</p>
                    </div>
                    {[
                      { label: "My Profile",  href: "/profile",  icon: User },
                      { label: "My Orders",   href: "/orders",   icon: Package },
                      { label: "My Wishlist", href: "/wishlist", icon: Heart },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm font-body transition-all"
                      >
                        <item.icon size={15} />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-white/5 text-sm font-body transition-all border-t border-white/10"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-gold-DEFAULT text-sm font-semibold font-body border border-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-navy-DEFAULT transition-all duration-200"
              >
                Sign In
              </Link>
            )}

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
        <div className="border-t border-white/[0.08]">
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
                <Link key={cat.label} href={cat.href} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/65 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap font-body">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#071E22]/98 backdrop-blur-xl">
            <div className="section py-4 space-y-4">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-faint border border-gold-muted">
                  <div className="w-9 h-9 rounded-full bg-gold-DEFAULT text-navy-DEFAULT text-sm font-bold flex items-center justify-center shrink-0">
                    {avatarInitial}
                  </div>
                  <div>
                    <p className="text-gold-DEFAULT font-bold text-sm font-body">{user.name}</p>
                    <p className="text-white/40 text-xs font-body capitalize">{user.role}</p>
                  </div>
                </div>
              )}

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

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button key={link.label} onClick={() => { setMobileOpen(false); link.gated ? setGatedFeature(link.feature) : router.push(link.href); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body">
                    {link.label}
                  </button>
                ))}
                <button onClick={() => { setMobileOpen(false); handleGated("cart"); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body">
                  <ShoppingCart size={18} /> Cart {totalItems > 0 && <span className="ml-auto bg-gold-DEFAULT text-navy-DEFAULT text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalItems}</span>}
                </button>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-body">
                  <Heart size={18} /> Wishlist
                </Link>
                <button onClick={() => { setMobileOpen(false); handleGated("orders"); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-left font-body">
                  <Package size={18} /> Orders
                </button>
                {isAuthenticated && (
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-body">
                    <User size={18} /> My Profile
                  </Link>
                )}
              </nav>

              {isAuthenticated ? (
                <button onClick={async () => { setMobileOpen(false); await signOut(); router.push("/"); }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-body">
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3.5 rounded-xl border border-gold-muted text-gold-DEFAULT font-semibold text-sm font-body">
                    Sign In
                  </Link>
                  <a href="#download" onClick={() => setMobileOpen(false)} className="flex-1 btn-gold text-center py-3.5 rounded-xl font-semibold text-sm">
                    Get App
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {gatedFeature && (
        <AppGateModal feature={gatedFeature as any} onClose={() => setGatedFeature(null)} />
      )}
    </>
  );
}