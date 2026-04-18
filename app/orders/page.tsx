"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/products";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

type OrderStatus = "running" | "delivered" | "cancelled";

interface OrderItem {
  productName: string;
  quantity:    number;
  price:       number;
}

interface Order {
  id:              string;
  products:        OrderItem[];
  totalAmount:     number;
  status:          OrderStatus;
  deliveryMethod?: "delivery" | "pickup";
  deliveryAddress?: string;
  trackingStatus?: string | null;
  disputeStatus?:  string;
  createdAt:       number;
  updatedAt:       number;
}

function statusConfig(status: OrderStatus) {
  switch (status) {
    case "running":   return { color: "#f59e0b", bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock,         label: "Running" };
    case "delivered": return { color: "#10b981", bg: "bg-emerald-50",border: "border-emerald-200",icon: CheckCircle,   label: "Delivered" };
    case "cancelled": return { color: "#ef4444", bg: "bg-red-50",    border: "border-red-200",    icon: XCircle,       label: "Cancelled" };
  }
}

function trackingLabel(status: string | null | undefined) {
  switch (status) {
    case "acknowledged":    return "Seller confirmed your order";
    case "enroute":         return "Out for delivery";
    case "ready_for_pickup":return "Ready — awaiting your confirmation";
    default: return null;
  }
}

function OrderCard({ order }: { order: Order }) {
  const cfg      = statusConfig(order.status);
  const StatusIcon = cfg.icon;
  const tracking = trackingLabel(order.trackingStatus);

  return (
    <Link href={`/orders/${order.id}`} className="block bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 hover:border-gold-muted hover:shadow-gold transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-display font-bold text-navy-DEFAULT text-base">
            Order #{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-navy-DEFAULT/45 text-xs font-body mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border}`} style={{ color: cfg.color }}>
          <StatusIcon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Products */}
      <div className="space-y-1 mb-3">
        {order.products.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-body">
            <Package size={13} className="text-navy-DEFAULT/40 shrink-0" />
            <span className="text-navy-DEFAULT/70 flex-1 truncate">{item.productName}</span>
            <span className="text-navy-DEFAULT/50 text-xs">×{item.quantity}</span>
          </div>
        ))}
        {order.products.length > 2 && (
          <p className="text-navy-DEFAULT/40 text-xs font-body">+{order.products.length - 2} more item(s)</p>
        )}
      </div>

      {/* Tracking badge */}
      {tracking && order.status === "running" && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold-faint border border-gold-muted mb-3">
          <Truck size={13} className="text-gold-DEFAULT shrink-0" />
          <p className="text-gold-DEFAULT text-xs font-semibold font-body">{tracking}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(11,46,51,0.06)]">
        <div>
          <p className="text-navy-DEFAULT/45 text-xs font-body">Total</p>
          <p className="font-display font-bold text-navy-DEFAULT text-base">{formatCurrency(order.totalAmount)}</p>
        </div>
        <div className="flex items-center gap-1 text-gold-DEFAULT text-sm font-bold font-body group-hover:gap-2 transition-all">
          View Details <ChevronRight size={15} />
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [tab,        setTab]        = useState<OrderStatus>("running");
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [fetching,   setFetching]   = useState(false);
  const [error,      setError]      = useState("");
  const [counts,     setCounts]     = useState({ running: 0, delivered: 0, cancelled: 0 });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth?next=/orders");
  }, [isLoading, isAuthenticated, router]);

  const fetchOrders = async (status: OrderStatus) => {
    if (!user) return;
    setFetching(true); setError("");
    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE}/orders?status=${status}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        // Update count for this tab
        setCounts((c) => ({ ...c, [status]: data.orders?.length ?? 0 }));
      } else throw new Error(data.message);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setFetching(false); }
  };

  useEffect(() => {
    if (user) fetchOrders(tab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TABS: { key: OrderStatus; label: string }[] = [
    { key: "running",   label: "Running" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Page header */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
        <div className="section py-6">
          <nav className="flex items-center gap-2 text-xs text-navy-DEFAULT/50 mb-3 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <a href="/profile" className="hover:text-gold-DEFAULT transition-colors">Profile</a>
            <span>/</span>
            <span className="text-navy-DEFAULT font-medium">Orders</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-DEFAULT">My Orders</h1>
            <button
              onClick={() => fetchOrders(tab)}
              className="p-2 rounded-xl border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/60 hover:text-navy-DEFAULT hover:border-gold-muted transition-all"
            >
              <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs — mirrors mobile OrdersScreen tabs */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
        <div className="section">
          <div className="flex gap-2 py-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all font-body border ${
                  tab === t.key
                    ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                    : "bg-white border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/60 hover:border-gold-muted"
                }`}
              >
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-gold-DEFAULT text-navy-DEFAULT" : "bg-navy-DEFAULT/10 text-navy-DEFAULT/50"}`}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="section py-8">
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-navy-DEFAULT/50 text-sm font-body">Loading orders…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-2xl">⚠️</div>
            <p className="text-navy-DEFAULT/60 text-sm font-body mb-4">{error}</p>
            <button onClick={() => fetchOrders(tab)} className="btn-gold px-6 py-2.5 rounded-xl text-sm">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center mb-5 text-4xl">
              {tab === "running" ? "📦" : tab === "delivered" ? "✅" : "❌"}
            </div>
            <h3 className="font-display text-xl font-semibold text-navy-DEFAULT mb-2">
              No {tab} orders
            </h3>
            <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs mb-6">
              {tab === "running"
                ? "Your active orders will appear here once you place one."
                : `Your ${tab} orders will appear here.`}
            </p>
            {tab === "running" && (
              <Link href="/products" className="btn-gold px-6 py-3 rounded-2xl text-sm">
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}