"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, Users, ShoppingBag, Wrench, Package,
  Lock, Unlock, Activity, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Loader2, ArrowRight, Shield,
  DollarSign, Eye, Clock, BarChart2, UserX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminStats {
  totalUsers: number;
  buyers: number;
  sellers: number;
  services: number;
  totalOrders: number;
}

interface SystemHealth {
  status: string;
  redis: string;
  firebase: string;
}

interface FlaggedSeller {
  uid: string;
  name: string;
  businessName?: string;
  autoCancelStrikes?: number;
  isSuspended?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex flex-col items-center gap-2">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <p className="font-display font-bold text-xl text-navy-DEFAULT">{value}</p>
      <p className="text-navy-DEFAULT/50 text-xs font-body">{label}</p>
    </div>
  );
}

function HealthDot({ label, up }: { label: string; up: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", up ? "bg-emerald-400" : "bg-red-400")} />
      <span className="text-sm text-navy-DEFAULT/70 font-body">{label}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [stats, setStats]                   = useState<AdminStats | null>(null);
  const [health, setHealth]                 = useState<SystemHealth | null>(null);
  const [reviewCount, setReviewCount]       = useState<number | null>(null);
  const [platformBalance, setPlatformBalance] = useState<number | null>(null);
  const [isMaintenance, setIsMaintenance]   = useState<boolean | null>(null);
  const [flaggedSellers, setFlaggedSellers] = useState<FlaggedSeller[]>([]);
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [togglingMaint, setTogglingMaint]   = useState(false);
  const [pardoningId, setPardoningId]       = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "admin"))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchAll = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token = await getToken();
      const H = { Authorization: `Bearer ${token}` };

      const results = await Promise.allSettled([
        fetch(`${API_BASE}/health`, { headers: H }),
        fetch(`${API_BASE}/product-review/count`, { headers: H }),
        fetch(`${API_BASE}/admin/system/maintenance`, { headers: H }),
        fetch(`${API_BASE}/wallet/balance/admin`, { headers: H }),
        fetch(`${API_BASE}/admin/stats`, { headers: H }),
        fetch(`${API_BASE}/admin/flagged-sellers`, { headers: H }),
      ]);

      // Health
      if (results[0].status === "fulfilled") {
        const d = await results[0].value.json().catch(() => null);
        if (d) setHealth({ status: d.status, redis: d.services?.redis ?? "down", firebase: d.services?.firebase ?? "down" });
      }
      // Review count
      if (results[1].status === "fulfilled") {
        const d = await results[1].value.json().catch(() => null);
        if (d?.success) setReviewCount(d.count ?? 0);
      }
      // Maintenance
      if (results[2].status === "fulfilled") {
        const d = await results[2].value.json().catch(() => null);
        if (d?.success) setIsMaintenance(d.isMaintenance);
      }
      // Platform wallet
      if (results[3].status === "fulfilled") {
        const d = await results[3].value.json().catch(() => null);
        if (d?.success) setPlatformBalance(d.balance ?? 0);
      }
      // Admin stats
      if (results[4].status === "fulfilled") {
        const d = await results[4].value.json().catch(() => null);
        if (d?.success && d.stats) setStats(d.stats);
      }
      // Flagged sellers
      if (results[5].status === "fulfilled") {
        const d = await results[5].value.json().catch(() => null);
        if (d?.success && d.sellers) setFlaggedSellers(d.sellers.slice(0, 5));
      }
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.uid, getToken]);

  useEffect(() => {
    if (user?.uid) fetchAll();
  }, [user?.uid, fetchAll]);

  const toggleMaintenance = async () => {
    if (togglingMaint || isMaintenance === null) return;
    const next = !isMaintenance;
    const confirmed = window.confirm(
      next
        ? "⚠️ Enable maintenance mode? This will freeze all transactions."
        : "✅ Disable maintenance mode? This restores full marketplace."
    );
    if (!confirmed) return;

    setTogglingMaint(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/admin/system/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: next }),
      });
      const data = await res.json();
      if (data.success) setIsMaintenance(data.isMaintenance);
    } catch { /* silent */ }
    finally { setTogglingMaint(false); }
  };

  const pardonSeller = async (sellerId: string) => {
    const confirmed = window.confirm("Pardon this seller and reset their strikes?");
    if (!confirmed) return;
    setPardoningId(sellerId);
    try {
      const token = await getToken();
      await fetch(`${API_BASE}/orders/admin/pardon-seller/${sellerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlaggedSellers(prev => prev.filter(s => s.uid !== sellerId));
    } catch { /* silent */ }
    finally { setPardoningId(null); }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <div className="bg-[#0B2E33]">
        <div className="section py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-gold-DEFAULT transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-white/70">Admin Dashboard</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body">Platform Command</p>
                <span className="px-2 py-0.5 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] text-gold-DEFAULT text-[10px] font-bold font-body">ADMIN</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">EliteHub Admin Dashboard</h1>
            </div>
            <button
              onClick={() => { setRefreshing(true); fetchAll(); }}
              className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Revenue card */}
          <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] border border-[rgba(201,168,76,0.28)] p-6 mt-6">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[rgba(201,168,76,0.1)] blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-gold-DEFAULT" />
                <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest font-body">5% Platform Fee · Total Revenue</span>
              </div>
              <p className="font-display font-bold text-3xl text-white mt-2">
                {loading ? "—" : platformBalance !== null ? formatCurrency(platformBalance) : "—"}
              </p>
              {stats && (
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-white/40 text-[10px] font-body uppercase tracking-wide">Total Orders</p>
                    <p className="text-white font-bold text-sm font-body">{stats.totalOrders?.toLocaleString() ?? "—"}</p>
                  </div>
                  <div className="w-px h-6 bg-white/15" />
                  <div>
                    <p className="text-white/40 text-[10px] font-body uppercase tracking-wide">Total Users</p>
                    <p className="text-white font-bold text-sm font-body">{stats.totalUsers?.toLocaleString() ?? "—"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 space-y-6 pb-16">

        {/* User stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <StatPill icon={Users}    label="Buyers"   value={stats.buyers?.toLocaleString()   ?? "—"} color="#3b82f6" />
            <StatPill icon={ShoppingBag} label="Sellers" value={stats.sellers?.toLocaleString() ?? "—"} color="#C9A84C" />
            <StatPill icon={Wrench}   label="Services" value={stats.services?.toLocaleString() ?? "—"} color="#10b981" />
          </div>
        )}

        {/* Product review queue */}
        <div className={cn(
          "rounded-2xl p-5 border flex items-center gap-4",
          reviewCount && reviewCount > 0
            ? "bg-amber-50 border-amber-200"
            : "bg-white border-[rgba(11,46,51,0.07)]"
        )}>
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            reviewCount && reviewCount > 0 ? "bg-amber-100" : "bg-gold-faint border border-gold-muted"
          )}>
            <Package size={18} className={reviewCount && reviewCount > 0 ? "text-amber-600" : "text-gold-DEFAULT"} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-navy-DEFAULT font-body">Product Review Queue</p>
            <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">
              {loading
                ? "Loading…"
                : reviewCount === null
                ? "Unable to fetch"
                : reviewCount > 0
                ? `${reviewCount} product${reviewCount !== 1 ? "s" : ""} awaiting review`
                : "No pending reviews — all clear ✓"}
            </p>
          </div>
          {reviewCount !== null && reviewCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-body">
              {reviewCount > 99 ? "99+" : reviewCount}
            </span>
          )}
          <div className="w-7 h-7 rounded-full bg-[rgba(11,46,51,0.06)] flex items-center justify-center">
            <ArrowRight size={13} className="text-navy-DEFAULT/40" />
          </div>
        </div>

        {/* Platform controls */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Platform Controls</h2>
          </div>

          <div className={cn(
            "bg-white rounded-2xl p-5 border flex items-center gap-4",
            isMaintenance ? "border-red-200" : "border-[rgba(11,46,51,0.07)]"
          )}>
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              isMaintenance ? "bg-red-50" : "bg-gold-faint border border-gold-muted"
            )}>
              {isMaintenance
                ? <Lock size={18} className="text-red-500" />
                : <Unlock size={18} className="text-gold-DEFAULT" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-navy-DEFAULT font-body">Maintenance Mode</p>
              <p className={cn(
                "text-xs font-body mt-0.5",
                isMaintenance === null ? "text-navy-DEFAULT/40"
                : isMaintenance ? "text-red-500" : "text-emerald-600"
              )}>
                {isMaintenance === null
                  ? "Checking status…"
                  : isMaintenance
                  ? "Marketplace is Frozen 🔒 — All transactions paused"
                  : "Marketplace is Live ✅ — Operating normally"}
              </p>
            </div>
            <button
              onClick={toggleMaintenance}
              disabled={togglingMaint || isMaintenance === null}
              className={cn(
                "relative w-12 h-6 rounded-full transition-all shrink-0 disabled:opacity-50",
                isMaintenance ? "bg-red-400" : "bg-emerald-400"
              )}
            >
              {togglingMaint ? (
                <Loader2 size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
              ) : (
                <span className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                  isMaintenance ? "right-1" : "left-1"
                )} />
              )}
            </button>
          </div>
        </div>

        {/* System health */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">System Heartbeat</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)]">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
                <p className="text-navy-DEFAULT/50 text-sm font-body">Checking services…</p>
              </div>
            ) : health ? (
              <div className="flex items-center gap-6">
                <HealthDot label="API"      up={health.status === "healthy"} />
                <HealthDot label="Cache"    up={health.redis === "up"} />
                <HealthDot label="Database" up={health.firebase === "up"} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-navy-DEFAULT/50">
                <AlertTriangle size={15} className="text-amber-500" />
                <p className="text-sm font-body">Could not fetch health status</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">System Utilities</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSign,  label: "Earnings",    desc: "Revenue breakdown",       color: "#C9A84C" },
              { icon: Shield,      label: "Wallet Audit", desc: "Transaction integrity",  color: "#6366f1" },
              { icon: AlertTriangle, label: "Disputes",  desc: "Open disputes",           color: "#ef4444" },
              { icon: Users,       label: "Roles",       desc: "Manage user roles",       color: "#3b82f6" },
            ].map(action => (
              <div
                key={action.label}
                className="bg-[#0B2E33] rounded-2xl p-4 border border-[rgba(201,168,76,0.2)] flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <action.icon size={15} style={{ color: action.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-xs font-body">{action.label}</p>
                  <p className="text-white/40 text-[11px] font-body">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-navy-DEFAULT/40 text-xs font-body mt-3">
            Full admin tools available in the mobile app
          </p>
        </div>

        {/* Flagged sellers */}
        {flaggedSellers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-red-400" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">
                Flagged Sellers ({flaggedSellers.length})
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden divide-y divide-[rgba(11,46,51,0.05)]">
              {flaggedSellers.map(seller => (
                <div key={seller.uid} className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    seller.isSuspended ? "bg-red-50" : "bg-amber-50"
                  )}>
                    <UserX size={15} className={seller.isSuspended ? "text-red-500" : "text-amber-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-DEFAULT font-body truncate">
                      {seller.businessName ?? seller.name}
                    </p>
                    <p className={cn(
                      "text-[11px] font-body",
                      seller.isSuspended ? "text-red-500" : "text-amber-600"
                    )}>
                      {seller.autoCancelStrikes ?? 0}/3 strikes{seller.isSuspended ? " · SUSPENDED" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => pardonSeller(seller.uid)}
                    disabled={pardoningId === seller.uid}
                    className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold font-body hover:bg-emerald-100 transition-all disabled:opacity-50"
                  >
                    {pardoningId === seller.uid ? "…" : "Pardon"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {flaggedSellers.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.07)] flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-navy-DEFAULT font-body">No flagged sellers</p>
              <p className="text-xs text-navy-DEFAULT/50 font-body mt-0.5">All sellers are in good standing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}