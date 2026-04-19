"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package, ShoppingBag, Star, Eye, Users, TrendingUp,
  CreditCard, ArrowRight, RefreshCw, AlertTriangle,
  CheckCircle, Clock, XCircle, Loader2, Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import AppGateModal from "@/components/ui/AppGateModal";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SellerStats {
  rating: number;
  reviewCount: number;
  totalReviews: number;
  followerCount: number;
  profileViews: number;
  totalProducts: number;
  totalItemsSold: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  imageUrls: string | string[];
  category: string;
  createdAt: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: number;
  buyerDetails?: { name: string };
  products: { productName: string; quantity: number }[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)] shadow-sm">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <p className="font-display font-bold text-2xl text-navy-DEFAULT">{value}</p>
      <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">{label}</p>
      {sub && <p className="text-navy-DEFAULT/35 text-[11px] font-body mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    active:         { label: "Active",          color: "#10b981", bg: "#10b98115" },
    pending_review: { label: "Under Review",    color: "#f59e0b", bg: "#f59e0b15" },
    rejected:       { label: "Rejected",        color: "#ef4444", bg: "#ef444415" },
    running:        { label: "Active",          color: "#3b82f6", bg: "#3b82f615" },
    delivered:      { label: "Delivered",       color: "#10b981", bg: "#10b98115" },
    cancelled:      { label: "Cancelled",       color: "#9ca3af", bg: "#9ca3af15" },
  };
  const c = cfg[status] ?? { label: status, color: "#9ca3af", bg: "#9ca3af15" };
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full font-body"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {c.label}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [stats, setStats]         = useState<SellerStats | null>(null);
  const [products, setProducts]   = useState<Product[]>([]);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [balance, setBalance]     = useState<number | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gatedFeature, setGated]  = useState<string | null>(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<number | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "seller"))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, balanceRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/users/profile/${user.uid}`, { headers }),
        fetch(`${API_BASE}/wallet/balance/${user.uid}`, { headers }),
        fetch(`${API_BASE}/orders?role=seller&limit=10`, { headers }),
      ]);

      const [profileData, balanceData, ordersData] = await Promise.all([
        profileRes.json(),
        balanceRes.json(),
        ordersRes.json(),
      ]);

      if (profileData.user) {
        const u = profileData.user;
        setStats({
          rating:        u.rating || 0,
          reviewCount:   u.reviewCount || 0,
          totalReviews:  u.totalReviews || 0,
          followerCount: u.followerCount || 0,
          profileViews:  u.profileViews || 0,
          totalProducts: 0,
          totalItemsSold:u.totalItemsSold || 0,
        });
        const subExpiry = u.subscriptionExpiresAt ?? 0;
        setSubscriptionActive(subExpiry > Date.now());
        setSubscriptionExpiry(subExpiry);
      }
      if (balanceData.success) setBalance(balanceData.balance ?? 0);
      if (ordersData.success) setOrders((ordersData.orders ?? []).slice(0, 5));

      // Fetch products separately
      try {
        const prodRes  = await fetch(`${API_BASE}/products/seller/${user.uid}`, { headers });
        const prodData = await prodRes.json();
        if (prodData.success) {
          const prods = prodData.products ?? [];
          setProducts(prods.slice(0, 6));
          setStats(prev => prev ? { ...prev, totalProducts: prods.length } : prev);
        }
      } catch { /* silent */ }
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.uid, getToken]);

  useEffect(() => {
    if (user?.uid) fetchData();
  }, [user?.uid, fetchData]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingOrders   = orders.filter(o => o.status === "running").length;
  const pendingProducts = products.filter(p => p.status === "pending_review").length;
  const rejectedProducts= products.filter(p => p.status === "rejected").length;

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
            <span className="text-white/70">Seller Dashboard</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body mb-1">Seller Dashboard</p>
              <h1 className="font-display text-2xl font-bold text-white">{user.businessName || user.name}</h1>
            </div>
            <button
              onClick={() => { setRefreshing(true); fetchData(); }}
              className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Refresh"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Wallet / subscription strip */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link
              href="/wallet"
              className="bg-white/[0.07] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4 hover:bg-white/10 transition-all"
            >
              <p className="text-white/45 text-[11px] font-body uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="font-display font-bold text-gold-DEFAULT text-xl">
                {loading ? "—" : balance !== null ? formatCurrency(balance) : "—"}
              </p>
            </Link>

            <div
              className={cn(
                "rounded-2xl p-4 border",
                subscriptionActive
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-amber-500/10 border-amber-500/30"
              )}
            >
              <p className="text-white/45 text-[11px] font-body uppercase tracking-widest mb-1">Subscription</p>
              {subscriptionActive ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <p className="text-emerald-400 font-bold text-sm font-body">
                    Active · {subscriptionExpiry
                      ? new Date(subscriptionExpiry).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
                      : ""}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setGated("seller_dashboard")}
                  className="flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} className="text-amber-400" />
                  <p className="text-amber-400 font-bold text-sm font-body">Renew via App</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 space-y-8 pb-16">

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)] h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard icon={Package}    label="Total Products"  value={stats?.totalProducts ?? 0}    color="#C9A84C" />
            <StatCard icon={ShoppingBag}label="Active Orders"   value={pendingOrders}                color="#3b82f6" />
            <StatCard icon={Star}       label="Rating"          value={stats?.rating?.toFixed(1) ?? "—"} color="#f59e0b" sub={`${stats?.totalReviews ?? 0} reviews`} />
            <StatCard icon={Eye}        label="Profile Views"   value={stats?.profileViews ?? 0}     color="#8b5cf6" />
          </div>
        )}

        {/* Product review alerts */}
        {(pendingProducts > 0 || rejectedProducts > 0) && (
          <div className={cn(
            "rounded-2xl p-4 border flex items-center gap-4",
            rejectedProducts > 0
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              rejectedProducts > 0 ? "bg-red-100" : "bg-amber-100"
            )}>
              {rejectedProducts > 0
                ? <AlertTriangle size={18} className="text-red-500" />
                : <Clock size={18} className="text-amber-500" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm font-body text-navy-DEFAULT">
                {rejectedProducts > 0
                  ? `${rejectedProducts} product${rejectedProducts > 1 ? "s" : ""} rejected — action needed`
                  : `${pendingProducts} product${pendingProducts > 1 ? "s" : ""} under review`}
              </p>
              <p className="text-navy-DEFAULT/55 text-xs font-body mt-0.5">
                {rejectedProducts > 0
                  ? "Check rejection reasons and resubmit via the app."
                  : "Our team will review within 24 hours."}
              </p>
            </div>
            <span className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full",
              rejectedProducts > 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
            )}>
              {(pendingProducts + rejectedProducts) > 9 ? "9+" : pendingProducts + rejectedProducts}
            </span>
          </div>
        )}

        {/* Add product CTA */}
        <div className="bg-[#0B2E33] rounded-2xl p-5 border border-[rgba(201,168,76,0.2)] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] flex items-center justify-center shrink-0">
            <Plus size={20} className="text-gold-DEFAULT" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm font-body">Add New Product</p>
            <p className="text-white/50 text-xs font-body">Product listings are managed via the app</p>
          </div>
          <button
            onClick={() => setGated("seller_dashboard")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT text-xs font-bold font-body hover:bg-gold-light transition-all"
          >
            Open App <ArrowRight size={12} />
          </button>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">My Products</h2>
            </div>
            {products.length > 0 && (
              <span className="text-xs text-navy-DEFAULT/40 font-body">{stats?.totalProducts ?? 0} total</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-[rgba(11,46,51,0.07)]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[rgba(11,46,51,0.07)] text-center">
              <div className="w-14 h-14 rounded-2xl bg-gold-faint border border-gold-muted flex items-center justify-center text-2xl mx-auto mb-3">📦</div>
              <p className="font-display font-semibold text-navy-DEFAULT text-sm mb-1">No products yet</p>
              <p className="text-navy-DEFAULT/50 text-xs font-body">List your first product via the EliteHub NG app.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map(p => {
                const img = Array.isArray(p.imageUrls) ? p.imageUrls[0] : p.imageUrls;
                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-[rgba(11,46,51,0.05)] to-[rgba(11,46,51,0.02)] relative">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-navy-DEFAULT font-semibold text-xs font-body truncate mb-1">{p.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-DEFAULT font-body">{formatCurrency(p.price)}</span>
                        <StatusBadge status={p.status ?? "active"} />
                      </div>
                      <p className="text-navy-DEFAULT/40 text-[11px] font-body mt-1">Stock: {p.stock}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Recent Orders</h2>
            </div>
            <Link href="/orders" className="text-gold-DEFAULT text-xs font-semibold font-body hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-16 animate-pulse border border-[rgba(11,46,51,0.07)]" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.07)] text-center">
              <p className="text-navy-DEFAULT/50 text-sm font-body">No recent orders.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden divide-y divide-[rgba(11,46,51,0.05)]">
              {orders.map(o => (
                <div key={o.id} className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0">
                    <ShoppingBag size={15} className="text-gold-DEFAULT" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-DEFAULT font-body truncate">
                      {o.products?.[0]?.productName ?? "Order"}
                      {o.products?.length > 1 ? ` +${o.products.length - 1}` : ""}
                    </p>
                    <p className="text-[11px] text-navy-DEFAULT/45 font-body">
                      {o.buyerDetails?.name ?? "Customer"} ·{" "}
                      {new Date(o.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-navy-DEFAULT font-body">{formatCurrency(o.totalAmount)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* App CTA */}
        <div className="bg-[#0B2E33] rounded-2xl p-6 border border-[rgba(201,168,76,0.2)] text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[rgba(201,168,76,0.08)] pointer-events-none" />
          <div className="relative">
            <p className="text-gold-DEFAULT text-[11px] font-bold uppercase tracking-widest font-body mb-2">Full Experience</p>
            <h3 className="font-display font-bold text-white text-lg mb-2">Manage Your Shop on Mobile</h3>
            <p className="text-white/55 text-xs font-body max-w-sm mx-auto mb-5">
              Add products, update stock, chat with buyers, handle disputes, and grow your business — all from the EliteHub NG app.
            </p>
            <button
              onClick={() => setGated("seller_dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT font-bold text-sm font-body hover:bg-gold-light transition-all"
            >
              Open Seller App <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {gatedFeature && (
        <AppGateModal feature={gatedFeature as any} onClose={() => setGated(null)} />
      )}
    </div>
  );
}