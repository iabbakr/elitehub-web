"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, ShoppingBag, CheckCircle, Activity, XCircle,
  TrendingUp, Users, Briefcase, RefreshCw, DollarSign,
  Award, BarChart2, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "electronics",     label: "Electronics",      color: "#3B82F6" },
  { id: "fashion",         label: "Fashion",           color: "#EC4899" },
  { id: "food_groceries",  label: "Food & Groceries",  color: "#10B981" },
  { id: "health_beauty",   label: "Health & Beauty",   color: "#F59E0B" },
  { id: "home_living",     label: "Home & Living",     color: "#8B5CF6" },
  { id: "phones_tablets",  label: "Phones & Tablets",  color: "#06B6D4" },
  { id: "automotive",      label: "Automotive",        color: "#F97316" },
  { id: "agriculture",     label: "Agriculture",        color: "#84CC16" },
  { id: "sports_fitness",  label: "Sports & Fitness",  color: "#EF4444" },
  { id: "services",        label: "Services",           color: "#14B8A6" },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface StateStats {
  assignedState:   string;
  managerLevel:    number;
  walletBalance:   number;
  totalOrders:     number;
  deliveredOrders: number;
  runningOrders:   number;
  cancelledOrders: number;
  totalVolume:     number;
  commissionEarned:number;
  activeSellers:   number;
  inactiveSellers: number;
  recentOrders:    number;
  topCategories:   { id: string; label: string; color: string; orderCount: number; volume: number }[];
}

interface TopPerformer {
  sellerId:    string;
  sellerName:  string;
  businessName:string;
  totalOrders: number;
  totalRevenue:number;
  rating:      number;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)] shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <p className="font-display font-bold text-2xl text-navy-DEFAULT">{value}</p>
      <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">{label}</p>
      {sub && <p className="text-navy-DEFAULT/35 text-[11px] font-body mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StateDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [stats, setStats]       = useState<StateStats | null>(null);
  const [performers, setPerf]   = useState<TopPerformer[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isStateManager = user?.role === "state_manager_1" || user?.role === "state_manager_2";

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && !isStateManager))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token    = await getToken();
      const headers  = { Authorization: `Bearer ${token}` };
      const profile  = user as any;
      const state    = profile.assignedState ?? "";
      const level    = profile.managerLevel ?? (user.role === "state_manager_1" ? 1 : 2);

      const results = await Promise.allSettled([
        fetch(`${API_BASE}/wallet/balance/${user.uid}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/state-manager/stats?state=${encodeURIComponent(state)}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/state-manager/top-performers?state=${encodeURIComponent(state)}&limit=5`, { headers }).then(r => r.json()),
      ]);

      const [balD, statsD, perfD] = results.map(r => r.status === "fulfilled" ? r.value : null);

      const base: Partial<StateStats> = {
        assignedState:   state,
        managerLevel:    level,
        walletBalance:   balD?.success ? (balD.balance ?? 0) : 0,
      };

      if (statsD?.success) {
        const s = statsD.stats ?? statsD;
        setStats({
          ...base,
          totalOrders:     s.totalOrders     ?? 0,
          deliveredOrders: s.deliveredOrders ?? 0,
          runningOrders:   s.runningOrders   ?? 0,
          cancelledOrders: s.cancelledOrders ?? 0,
          totalVolume:     s.totalVolume     ?? 0,
          commissionEarned:s.commissionEarned?? 0,
          activeSellers:   s.activeSellers   ?? 0,
          inactiveSellers: s.inactiveSellers ?? 0,
          recentOrders:    s.recentOrderCount?? 0,
          topCategories:   (s.topCategories  ?? []).map((c: any) => {
            const meta = CATEGORIES.find(x => x.id === c.id) ?? { color: "#C9A84C" };
            return { ...c, color: meta.color };
          }),
        } as StateStats);
      } else {
        setStats({ ...base, totalOrders: 0, deliveredOrders: 0, runningOrders: 0, cancelledOrders: 0, totalVolume: 0, commissionEarned: 0, activeSellers: 0, inactiveSellers: 0, recentOrders: 0, topCategories: [] } as StateStats);
      }

      if (perfD?.success) setPerf(perfD.performers ?? []);

    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.uid, getToken]);

  useEffect(() => { if (user?.uid) fetchData(); }, [user?.uid, fetchData]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile       = user as any;
  const assignedState = profile.assignedState ?? "—";
  const managerLevel  = profile.managerLevel ?? (user.role === "state_manager_1" ? 1 : 2);
  const successRate   = stats && stats.totalOrders > 0
    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
    : 0;

  const totalSellers   = (stats?.activeSellers ?? 0) + (stats?.inactiveSellers ?? 0);
  const activeSellerPct = totalSellers > 0 ? Math.round(((stats?.activeSellers ?? 0) / totalSellers) * 100) : 0;
  const maxCatVolume   = Math.max(...(stats?.topCategories ?? []).map(c => c.volume), 1);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <div className="bg-[#0B2E33] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[rgba(201,168,76,0.07)] pointer-events-none" />
        <div className="section py-10 relative">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-gold-DEFAULT transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-white/70">State Dashboard</span>
          </nav>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-faint border border-gold-muted">
                  <MapPin size={9} className="text-gold-DEFAULT" />
                  <span className="text-gold-DEFAULT text-[10px] font-bold font-body">{assignedState}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10">
                  <span className="text-white/60 text-[10px] font-body">Level {managerLevel} Manager</span>
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">State Manager Panel</h1>
              <p className="text-white/45 text-sm font-body mt-0.5">{user.name}</p>
            </div>
            <button
              onClick={() => { setRefreshing(true); fetchData(); }}
              className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all mt-1"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Hero: wallet + commission */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/wallet" className="bg-white/[0.07] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4 hover:bg-white/10 transition-all">
              <p className="text-white/40 text-[11px] font-body uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="font-display font-bold text-xl text-gold-DEFAULT">
                {loading ? "—" : stats?.walletBalance !== undefined ? formatCurrency(stats.walletBalance) : "—"}
              </p>
            </Link>
            <div className="bg-white/[0.07] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4">
              <p className="text-white/40 text-[11px] font-body uppercase tracking-widest mb-1">2% Commission</p>
              <p className="font-display font-bold text-xl text-gold-DEFAULT">
                {loading ? "—" : stats?.commissionEarned !== undefined ? formatCurrency(stats.commissionEarned) : "—"}
              </p>
            </div>
          </div>

          {/* State volume */}
          {!loading && stats && (
            <div className="mt-3 flex items-center gap-6 bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3">
              {[
                { label: "State Volume",  value: formatCurrency(stats.totalVolume) },
                { label: "Last 7 Days",  value: `${stats.recentOrders} orders` },
                { label: "Success Rate", value: `${successRate}%` },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-white/35 text-[10px] font-body uppercase tracking-wide mb-0.5">{s.label}</p>
                  <p className="text-white font-bold text-sm font-body">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section py-8 space-y-8 pb-16">

        {/* Order KPIs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">State Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={CheckCircle}   label="Delivered"    value={loading ? "—" : stats?.deliveredOrders ?? 0} color="#10b981" sub={stats ? `${successRate}% success` : undefined} />
            <StatCard icon={Activity}      label="Running"      value={loading ? "—" : stats?.runningOrders   ?? 0} color="#C9A84C" sub="Active now" />
            <StatCard icon={Users}         label="Active Sellers" value={loading ? "—" : stats?.activeSellers ?? 0} color="#3b82f6" sub={stats ? `${stats.inactiveSellers} inactive` : undefined} />
            <StatCard icon={XCircle}       label="Cancelled"    value={loading ? "—" : stats?.cancelledOrders ?? 0} color="#ef4444" />
          </div>
        </div>

        {/* Category breakdown */}
        {(stats?.topCategories?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Top Categories by Volume</h2>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden">
              {stats?.topCategories.filter(c => c.volume > 0).map((cat, i, arr) => {
                const pct = Math.round((cat.volume / maxCatVolume) * 100);
                return (
                  <div key={cat.id} className={cn("flex items-center gap-3 px-4 py-3.5", i < arr.length - 1 && "border-b border-[rgba(11,46,51,0.05)]")}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}18` }}>
                      <BarChart2 size={13} style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-navy-DEFAULT font-body">{cat.label}</p>
                        <p className="text-xs font-bold font-body" style={{ color: cat.color }}>{formatCurrency(cat.volume)}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(11,46,51,0.08)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                      </div>
                      <p className="text-[10px] text-navy-DEFAULT/40 font-body mt-0.5">{cat.orderCount} order{cat.orderCount !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                );
              })}
              {stats?.topCategories.every(c => c.volume === 0) && (
                <div className="py-10 text-center">
                  <BarChart2 size={28} className="text-navy-DEFAULT/20 mx-auto mb-2" />
                  <p className="text-navy-DEFAULT/45 text-sm font-body">No delivered orders yet in {assignedState}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seller health */}
        {totalSellers > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Seller Health</h2>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-navy-DEFAULT/45 font-body">Active vs Inactive · {totalSellers} total</p>
                <p className="text-xs font-bold font-body text-emerald-600">{activeSellerPct}% active</p>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div className="rounded-l-full" style={{ flex: stats?.activeSellers || 1, backgroundColor: "#10b981" }} />
                {(stats?.inactiveSellers ?? 0) > 0 && (
                  <div className="rounded-r-full" style={{ flex: stats?.inactiveSellers, backgroundColor: "#ef4444" }} />
                )}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs font-body text-navy-DEFAULT/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active ({stats?.activeSellers ?? 0})
                </span>
                <span className="flex items-center gap-1.5 text-xs font-body text-navy-DEFAULT/60">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Inactive ({stats?.inactiveSellers ?? 0})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top performers */}
        {performers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Top Performers</h2>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden divide-y divide-[rgba(11,46,51,0.05)]">
              {performers.map((p, i) => (
                <div key={p.sellerId} className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0">
                    <Award size={14} className="text-gold-DEFAULT" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-DEFAULT font-body truncate">{p.businessName || p.sellerName}</p>
                    <p className="text-[11px] text-navy-DEFAULT/45 font-body">{p.totalOrders} orders · ⭐ {p.rating?.toFixed(1) ?? "—"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gold-DEFAULT font-body">{formatCurrency(p.totalRevenue)}</p>
                    <p className="text-[10px] text-navy-DEFAULT/35 font-body">#{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Quick Actions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: ShoppingBag,  label: "State Orders",       desc: "View & track all orders in your state" },
              { icon: TrendingUp,   label: "Commission History",  desc: "Your 2% share from delivered orders" },
              { icon: Briefcase,    label: "Sellers Directory",   desc: "Browse all sellers in your state" },
              { icon: DollarSign,   label: "Wallet",              desc: "View balance, deposit & withdraw", href: "/wallet" },
            ].map(a => (
              a.href ? (
                <Link key={a.label} href={a.href} className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex items-center gap-3 hover:border-gold-muted hover:shadow-gold transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0 group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all">
                    <a.icon size={15} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-DEFAULT font-body">{a.label}</p>
                    <p className="text-xs text-navy-DEFAULT/45 font-body truncate">{a.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-navy-DEFAULT/25 group-hover:text-gold-DEFAULT transition-colors shrink-0" />
                </Link>
              ) : (
                <div key={a.label} className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0">
                    <a.icon size={15} className="text-gold-DEFAULT" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-DEFAULT font-body">{a.label}</p>
                    <p className="text-xs text-navy-DEFAULT/45 font-body truncate">{a.desc}</p>
                  </div>
                  <span className="text-[10px] text-navy-DEFAULT/30 font-body shrink-0">App</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* App CTA */}
        <div className="bg-[#0B2E33] rounded-2xl p-6 border border-[rgba(201,168,76,0.2)] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[rgba(201,168,76,0.08)] pointer-events-none" />
          <div className="relative">
            <p className="text-gold-DEFAULT text-[11px] font-bold uppercase tracking-widest font-body mb-2">
              {assignedState} Management
            </p>
            <h3 className="font-display font-bold text-white text-base mb-2">Full State Control in the App</h3>
            <p className="text-white/50 text-xs font-body leading-relaxed">
              Browse orders by city/area, contact sellers, view detailed commission breakdowns, and access location analytics — all in the EliteHub NG app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}