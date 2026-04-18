"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/Usecartstore";
import { formatCurrency } from "@/lib/products";
import { ArrowLeft, Check, Loader2, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

interface CheckoutData {
  deliveryMethods:  Record<string, "delivery" | "pickup">;
  deliveryAddress:  string;
  phoneNumber:      string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderIds, setOrderIds] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth?next=/checkout");
  }, [isLoading, isAuthenticated, router]);

  // Load checkout data from session
  useEffect(() => {
    const raw = sessionStorage.getItem("checkout_data");
    if (raw) {
      try { setCheckoutData(JSON.parse(raw)); }
      catch { setCheckoutData({ deliveryMethods: {}, deliveryAddress: "", phoneNumber: "" }); }
    } else {
      setCheckoutData({ deliveryMethods: {}, deliveryAddress: "", phoneNumber: "" });
    }
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      setLoadingBalance(true);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/wallet/balance/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setWalletBalance(data.balance ?? 0);
      } catch { setWalletBalance(null); }
      finally { setLoadingBalance(false); }
    };
    load();
  }, [user?.uid, getToken]);

  if (isLoading || !user || !checkoutData) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center gap-4">
        <p className="text-navy-DEFAULT/60 font-body">Your cart is empty.</p>
        <Link href="/products" className="btn-gold px-6 py-3 rounded-2xl">Browse Products</Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const COMMISSION_RATE = 0.10;
  const total = subtotal; // delivery fee added by backend
  const insufficientFunds = walletBalance !== null && walletBalance < total;

  // Group by seller for suborders
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  const handlePayWithWallet = async () => {
    if (insufficientFunds) return;
    setProcessing(true); setError("");

    try {
      const token = await getToken();
      const bundlePayload = {
        subOrders: Object.entries(grouped).map(([sellerId, sellerItems]) => ({
          sellerId,
          items: sellerItems.map((item) => ({
            productId:   item.productId,
            productName: item.name,
            quantity:    item.quantity,
            price:       item.price,
          })),
          deliveryMethod:  checkoutData.deliveryMethods[sellerId] || "delivery",
          deliveryFee:     checkoutData.deliveryMethods[sellerId] === "pickup" ? 0 : 500,
          deliveryAddress: checkoutData.deliveryMethods[sellerId] === "pickup"
            ? "Store Pickup"
            : checkoutData.deliveryAddress || "Address not provided",
          discount:  0,
          buyerNote: "",
        })),
        phoneNumber: checkoutData.phoneNumber || "",
      };

      const res = await fetch(`${API_BASE}/orders/bundle`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(bundlePayload),
      });
      const data = await res.json();

      if (data.success && data.orderIds) {
        setOrderIds(data.orderIds);
        setSuccess(true);
        clearCart();
        sessionStorage.removeItem("checkout_data");
      } else {
        throw new Error(data.message || "Order creation failed.");
      }
    } catch (err: any) {
      setError(err?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Check size={40} className="text-emerald-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-navy-DEFAULT mb-3">Order Placed!</h2>
        <p className="text-navy-DEFAULT/60 text-base font-body max-w-sm mb-2">
          Your payment is secured in escrow. We&apos;ve notified the seller(s).
        </p>
        {orderIds.length > 0 && (
          <p className="text-navy-DEFAULT/40 text-sm font-body mb-8">
            Order #{orderIds[0].slice(-6).toUpperCase()}
            {orderIds.length > 1 && ` + ${orderIds.length - 1} more`}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="btn-gold px-8 py-4 rounded-2xl text-base">
            Track My Orders
          </Link>
          <Link href="/products" className="btn-ghost px-8 py-4 rounded-2xl text-base">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
        <div className="section py-6">
          <nav className="flex items-center gap-2 text-xs text-navy-DEFAULT/50 mb-3 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <a href="/cart" className="hover:text-gold-DEFAULT transition-colors">Cart</a>
            <span>/</span>
            <span className="text-navy-DEFAULT font-medium">Checkout</span>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 rounded-xl border border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/60 hover:text-navy-DEFAULT transition-all">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display text-2xl font-bold text-navy-DEFAULT">Review & Pay</h1>
          </div>
        </div>
      </div>

      <div className="section py-8 max-w-2xl mx-auto">
        {/* Order items */}
        {Object.entries(grouped).map(([sellerId, sellerItems]) => {
          const method = checkoutData.deliveryMethods[sellerId] || "delivery";
          return (
            <div key={sellerId} className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 mb-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[rgba(11,46,51,0.06)]">
                <div className="w-7 h-7 rounded-lg bg-gold-faint border border-gold-muted flex items-center justify-center">
                  <span className="text-gold-DEFAULT text-xs font-bold">🛍️</span>
                </div>
                <p className="font-body font-bold text-navy-DEFAULT text-sm">Seller Order</p>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border ${method === "delivery" ? "bg-gold-faint border-gold-muted text-gold-DEFAULT" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                  {method === "delivery" ? "Delivery" : "Pickup"}
                </span>
              </div>
              {sellerItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 text-sm font-body">
                  <span className="text-navy-DEFAULT/70 flex-1 truncate mr-4">{item.quantity}× {item.name}</span>
                  <span className="font-bold text-gold-DEFAULT whitespace-nowrap">
                    {formatCurrency((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          );
        })}

        {/* Delivery info */}
        {checkoutData.deliveryAddress && (
          <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 mb-4">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-2">Delivery To</p>
            <p className="font-body font-semibold text-navy-DEFAULT text-sm">{checkoutData.phoneNumber}</p>
            <p className="font-body text-navy-DEFAULT/60 text-sm mt-1">{checkoutData.deliveryAddress}</p>
          </div>
        )}

        {/* Order total */}
        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-5 rounded-full bg-gold-DEFAULT" />
            <p className="font-body text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50">Order Summary</p>
          </div>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between">
              <span className="text-navy-DEFAULT/60">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-DEFAULT/60">Platform escrow</span>
              <span className="text-navy-DEFAULT/60">Included</span>
            </div>
            <div className="h-px bg-[rgba(11,46,51,0.08)] my-2" />
            <div className="flex justify-between">
              <span className="font-display font-bold text-navy-DEFAULT">Total Payable</span>
              <span className="font-display font-bold text-gold-DEFAULT text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Wallet balance */}
        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center">
                <CreditCard size={16} className="text-gold-DEFAULT" />
              </div>
              <span className="font-body font-bold text-navy-DEFAULT text-sm">Wallet Balance</span>
            </div>
            {loadingBalance ? (
              <div className="w-4 h-4 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className={`font-display font-bold text-base ${insufficientFunds ? "text-red-500" : "text-gold-DEFAULT"}`}>
                {walletBalance !== null ? formatCurrency(walletBalance) : "—"}
              </span>
            )}
          </div>
          {insufficientFunds && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle size={13} className="text-red-500 shrink-0" />
              <p className="text-red-600 text-xs font-body">
                Insufficient balance. You need {formatCurrency(total - (walletBalance || 0))} more.
                <a href="https://play.google.com/store/apps/details?id=com.elitehubng" target="_blank" rel="noopener noreferrer" className="underline font-bold ml-1">
                  Top up via the app.
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body mb-4">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handlePayWithWallet}
          disabled={processing || insufficientFunds || loadingBalance}
          className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-[#0B2E33] border border-gold-muted text-white font-bold text-base transition-all disabled:opacity-50 hover:bg-[#144D54] font-body mb-4"
        >
          {processing ? (
            <><Loader2 size={20} className="animate-spin" /> Securing your order…</>
          ) : (
            <><Check size={20} className="text-gold-DEFAULT" /> Complete Payment — {formatCurrency(total)}</>
          )}
        </button>

        <Link href="/cart" className="flex items-center justify-center gap-2 text-navy-DEFAULT/50 text-sm hover:text-navy-DEFAULT transition-colors font-body">
          <ArrowLeft size={15} /> Back to Cart
        </Link>
      </div>
    </div>
  );
}