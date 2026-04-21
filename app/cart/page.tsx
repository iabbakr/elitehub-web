"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Package, PlusCircle, ChevronUp } from "lucide-react";
import { useCartStore, WebCartItem } from "@/store/Usecartstore";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotalItems } = useCartStore();

  const [deliveryMethods,  setDeliveryMethods]  = useState<Record<string, "delivery" | "pickup">>({});
  const [deliveryAddress,  setDeliveryAddress]  = useState("");
  const [phoneNumber,      setPhoneNumber]      = useState("");

  // ── Seller notes — local state, mirrors mobile CartScreen ────────────────
  const [sellerNotes,    setSellerNotes]    = useState<Record<string, string>>({});
  const [expandedNotes,  setExpandedNotes]  = useState<Record<string, boolean>>({});

  const subtotal = getSubtotal();

  // Group items by seller
  const grouped = items.reduce<Record<string, WebCartItem[]>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  const getMethod = (sellerId: string): "delivery" | "pickup" =>
    deliveryMethods[sellerId] || "delivery";

  const setMethod = (sellerId: string, method: "delivery" | "pickup") =>
    setDeliveryMethods((prev) => ({ ...prev, [sellerId]: method }));

  const needsDelivery =
    Object.values(deliveryMethods).includes("delivery") ||
    !Object.keys(deliveryMethods).length;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth?next=/checkout");
      return;
    }
    if (needsDelivery && (!deliveryAddress.trim() || !phoneNumber.trim())) {
      alert("Please fill in your delivery address and phone number.");
      return;
    }
    sessionStorage.setItem(
      "checkout_data",
      JSON.stringify({
        deliveryMethods,
        deliveryAddress: deliveryAddress.trim(),
        phoneNumber:     phoneNumber.trim(),
        buyerNotes:      sellerNotes,   // passed through to checkout like mobile
      })
    );
    router.push("/checkout");
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center mb-6 text-4xl shadow-gold">
          🛒
        </div>
        <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-3">Your cart is empty</h2>
        <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs mb-8">
          Add products to get started — browse thousands of verified sellers.
        </p>
        <Link href="/products" className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Browse Products
        </Link>
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
            <span className="text-navy-DEFAULT font-medium">Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-DEFAULT flex items-center gap-3">
              Shopping Cart
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-body font-bold">
                {getTotalItems()}
              </span>
            </h1>
            <button
              onClick={clearCart}
              className="text-red-500 text-xs font-body hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="section py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left — cart items ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(grouped).map(([sellerId, sellerItems]) => {
              const method         = getMethod(sellerId);
              const isNoteExpanded = expandedNotes[sellerId] ?? false;
              const noteValue      = sellerNotes[sellerId] ?? "";

              return (
                <div
                  key={sellerId}
                  className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] overflow-hidden"
                >
                  {/* Seller header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[rgba(11,46,51,0.06)] bg-[rgba(11,46,51,0.02)]">
                    <div className="w-8 h-8 rounded-xl bg-navy-DEFAULT text-gold-DEFAULT text-xs font-bold flex items-center justify-center font-display">
                      {(sellerItems[0]?.sellerBusinessName || "S").charAt(0).toUpperCase()}
                    </div>
                    <p className="font-body font-semibold text-navy-DEFAULT text-sm">
                      {sellerItems[0]?.sellerBusinessName || "Store"}
                    </p>

                    {/* Delivery/Pickup toggle */}
                    <div className="ml-auto flex gap-1">
                      {(["delivery", "pickup"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMethod(sellerId, m)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all font-body",
                            method === m
                              ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                              : "border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/50 hover:border-gold-muted"
                          )}
                        >
                          {m === "delivery" ? <Truck size={11} /> : <Package size={11} />}
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  {sellerItems.map((item, idx) => {
                    const finalPrice = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex gap-4 p-4",
                          idx > 0 && "border-t border-[rgba(11,46,51,0.05)]"
                        )}
                      >
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-[rgba(11,46,51,0.06)]">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-navy-DEFAULT text-sm line-clamp-2">
                            {item.name}
                          </p>
                          {item.selectedColor && (
                            <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">
                              Color: {item.selectedColor}
                            </p>
                          )}
                          <p className="font-display font-bold text-gold-DEFAULT text-base mt-1">
                            {formatCurrency(finalPrice)}
                          </p>
                          {item.discount && (
                            <p className="text-navy-DEFAULT/40 text-xs line-through font-body">
                              {formatCurrency(item.price)}
                            </p>
                          )}

                          {/* Qty + remove */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-gold-muted rounded-xl overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2.5 py-1.5 text-navy-DEFAULT/60 hover:bg-gold-faint transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 py-1.5 font-bold text-navy-DEFAULT text-sm font-body">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                                className="px-2.5 py-1.5 text-navy-DEFAULT/60 hover:bg-gold-faint transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <div className="shrink-0 text-right">
                          <p className="font-display font-bold text-navy-DEFAULT">
                            {formatCurrency(finalPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Seller note section (mirrors mobile) ────────────── */}
                  <div className="px-5 py-3 border-t border-[rgba(11,46,51,0.05)]">
                    <button
                      onClick={() =>
                        setExpandedNotes((prev) => ({
                          ...prev,
                          [sellerId]: !prev[sellerId],
                        }))
                      }
                      className="flex items-center gap-1.5 text-xs font-bold text-gold-DEFAULT font-body hover:opacity-80 transition-opacity py-1"
                    >
                      {isNoteExpanded ? (
                        <ChevronUp size={13} />
                      ) : (
                        <PlusCircle size={13} />
                      )}
                      {isNoteExpanded
                        ? "Close Instructions"
                        : noteValue
                        ? "Edit Instructions"
                        : "Add Instructions to Seller"}
                    </button>

                    {isNoteExpanded && (
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          maxLength={200}
                          placeholder="e.g. Please leave at the gate, call before delivery…"
                          value={noteValue}
                          onChange={(e) =>
                            setSellerNotes((prev) => ({
                              ...prev,
                              [sellerId]: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gold-muted bg-gold-faint text-navy-DEFAULT text-sm font-body placeholder-navy-DEFAULT/30 focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.2)] resize-none transition-all"
                        />
                        <p className="text-right text-[11px] text-navy-DEFAULT/30 font-body mt-0.5">
                          {noteValue.length}/200
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Delivery details */}
            {needsDelivery && (
              <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-0.5 h-5 rounded-full bg-gold-DEFAULT" />
                  <p className="font-body font-bold text-navy-DEFAULT text-sm uppercase tracking-widest opacity-60">
                    Delivery Details
                  </p>
                </div>
                <div className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Phone number *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input"
                  />
                  <textarea
                    placeholder="Full delivery address *"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    className="input resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right — order summary ──────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-0.5 h-5 rounded-full bg-gold-DEFAULT" />
                <p className="font-body font-bold text-navy-DEFAULT text-sm uppercase tracking-widest opacity-60">
                  Order Summary
                </p>
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-navy-DEFAULT/60">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold text-navy-DEFAULT">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-navy-DEFAULT/60">Delivery</span>
                  <span className="text-emerald-600 font-semibold text-xs">Calculated at checkout</span>
                </div>
                {Object.values(sellerNotes).some(Boolean) && (
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-navy-DEFAULT/60">Seller notes</span>
                    <span className="text-gold-DEFAULT text-xs font-bold">
                      {Object.values(sellerNotes).filter(Boolean).length} added
                    </span>
                  </div>
                )}
                <div className="h-px bg-[rgba(11,46,51,0.08)]" />
                <div className="flex justify-between">
                  <span className="font-display font-bold text-navy-DEFAULT">Total</span>
                  <span className="font-display font-bold text-gold-DEFAULT text-lg">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              {/* Escrow note */}
              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                <span className="text-lg shrink-0">🔒</span>
                <p className="text-emerald-800 text-xs leading-relaxed font-body">
                  <strong>Escrow Protected</strong> — payment is held securely until you confirm delivery.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0B2E33] text-white font-bold text-base border border-gold-muted hover:bg-[#144D54] transition-all font-body"
              >
                {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
                <ArrowRight size={18} className="text-gold-DEFAULT" />
              </button>

              {!isAuthenticated && (
                <p className="text-center text-navy-DEFAULT/40 text-xs font-body mt-3">
                  Your cart items are saved automatically.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}