"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Heart, CreditCard, LogOut, ChevronRight, Shield, Bell, Briefcase, Wrench, MessageCircle, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/products";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://elitehub-backend.onrender.com/api/v1";

// ── Fix: accept assignedState as 3rd param so 'user' is not referenced out of scope ──
function getDashboardLink(role: string, businessName?: string, assignedState?: string) {
  switch (role) {
    case "seller":          return { href: "/seller-dashboard",  label: "Seller Dashboard",    icon: Briefcase,      desc: businessName || "Manage your shop" };
    case "service":         return { href: "/service-dashboard", label: "Service Dashboard",   icon: Wrench,         desc: businessName || "Manage your services" };
    case "admin":           return { href: "/admin-dashboard",   label: "Admin Dashboard",     icon: Shield,         desc: "Platform command center" };
    case "support_agent":   return { href: "/support-dashboard", label: "Support Dashboard",   icon: MessageCircle,  desc: "Chat queue & stats" };
    case "state_manager_1":
    case "state_manager_2": return { href: "/state-dashboard",  label: "State Dashboard",     icon: MapPin,         desc: assignedState ?? "State management" };
    default:                return null;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isAuthenticated, isLoading, getToken } = useAuth();

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth?next=/profile");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.uid) return;
    const fetch_ = async () => {
      setLoadingWallet(true);
      try {
        const token = await getToken();
        const res   = await fetch(`${API_BASE}/wallet/balance/${user.uid}`, { headers: { Authorization: `Bearer ${token}` } });
        const data  = await res.json();
        if (data.success) { setWalletBalance(data.balance ?? 0); setPendingBalance(data.pendingBalance ?? 0); }
      } catch { /* silent */ }
      finally { setLoadingWallet(false); }
    };
    fetch_();
  }, [user?.uid, getToken]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avatarInitial = user.name.charAt(0).toUpperCase();
  // ── Fix: pass assignedState as 3rd argument ──
  const dashLink = getDashboardLink(user.role, user.businessName, (user as any).assignedState);

  const MENU_SECTIONS = [
    {
      label: "Account",
      items: [
        { label: "My Orders",  href: "/orders",  icon: Package,    desc: "Track your purchases" },
        { label: "My Wishlist",href: "/wishlist", icon: Heart,      desc: "Saved products" },
        { label: "Wallet",     href: "/wallet",   icon: CreditCard, desc: loadingWallet ? "Loading…" : walletBalance !== null ? formatCurrency(walletBalance) : "View balance" },
      ],
    },
    ...(dashLink ? [{
      label: "Business",
      items: [{ label: dashLink.label, href: dashLink.href, icon: dashLink.icon, desc: dashLink.desc }],
    }] : []),
    {
      label: "Settings",
      items: [
        { label: "Security & Privacy", href: "#", icon: Shield, desc: "Password, 2FA" },
        { label: "Notifications",      href: "#", icon: Bell,   desc: "Manage alerts" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="bg-navy-gradient">
        <div className="section py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Profile</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold-DEFAULT text-gold font-display font-bold text-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(201,168,76,0.4)] shrink-0">
              {user.imageUrl ? <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" /> : avatarInitial}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-faint border border-gold-muted text-gold-muted text-xs font-bold font-body capitalize">{user.role}</span>
                {(user as any).location && <span className="text-white/45 text-xs font-body">📍 {(user as any).location.city}, {(user as any).location.state}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section -mt-5">
        <Link href="/wallet" className="block bg-[#0B2E33] rounded-2xl border border-gold-muted p-5 shadow-[0_4px_24px_rgba(11,46,51,0.3)] hover:border-gold-DEFAULT transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body mb-1">Wallet Balance</p>
              <p className="font-display font-bold text-2xl text-white">{loadingWallet ? "—" : walletBalance !== null ? formatCurrency(walletBalance) : "—"}</p>
              {pendingBalance > 0 && <p className="text-white/40 text-xs font-body mt-0.5">+ {formatCurrency(pendingBalance)} pending</p>}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all">
                <CreditCard size={18} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
              </div>
              <ChevronRight size={16} className="text-gold-DEFAULT" />
            </div>
          </div>
        </Link>
      </div>

      <div className="section py-8 space-y-6">
        {MENU_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <p className="text-navy-DEFAULT/50 text-xs font-bold uppercase tracking-widest font-body">{section.label}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] overflow-hidden divide-y divide-[rgba(11,46,51,0.05)]">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center gap-4 px-5 py-4 hover:bg-gold-faint transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0 group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all">
                    <item.icon size={16} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy-DEFAULT font-semibold text-sm font-body">{item.label}</p>
                    {item.desc && <p className="text-navy-DEFAULT/45 text-xs font-body truncate mt-0.5">{item.desc}</p>}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gold-faint flex items-center justify-center group-hover:bg-gold-DEFAULT transition-all">
                    <ChevronRight size={12} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button onClick={async () => { await signOut(); router.push("/"); }} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-all font-body">
          <LogOut size={16} /> Sign Out
        </button>

        <p className="text-center text-navy-DEFAULT/30 text-xs font-body pb-6">EliteHub NG · v1.0.0</p>
      </div>
    </div>
  );
}