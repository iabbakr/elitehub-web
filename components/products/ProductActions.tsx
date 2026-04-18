"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Heart, Share2, Check, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore, WebCartItem } from "@/store/Usecartstore";
import { getProductImageUrl, formatCurrency } from "@/lib/products";
import AppGateModal from "@/components/ui/AppGateModal";

interface ProductActionsProps {
  product:     Product;
  isOutOfStock: boolean;
}

export default function ProductActions({ product, isOutOfStock }: ProductActionsProps) {
  const router                = useRouter();
  const { isAuthenticated }   = useAuth();
  const { addItem, isInCart, getItemQty } = useCartStore();

  const [quantity,    setQuantity]    = useState(1);
  const [copied,      setCopied]      = useState(false);
  const [addedAnim,   setAddedAnim]   = useState(false);
  const [gated,       setGated]       = useState<"checkout" | "wishlist" | null>(null);

  const inCart   = isInCart(product.id);
  const cartQty  = getItemQty(product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      // Redirect to sign in, preserve intent
      router.push(`/auth?next=/products/${product.id}`);
      return;
    }

    const imageUrl = getProductImageUrl(product.imageUrls, "medium");
    const cartItem: WebCartItem = {
      id:                  product.id,
      productId:           product.id,
      name:                product.name,
      price:               product.price,
      discount:            product.discount,
      quantity,
      imageUrl,
      sellerId:            product.sellerId,
      sellerBusinessName:  product.sellerBusinessName,
      stock:               product.stock,
      location:            product.location,
      deliveryOptions:     product.deliveryOptions,
    };

    addItem(cartItem);

    // Visual feedback
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      router.push(`/auth?next=/products/${product.id}`);
      return;
    }
    // Add to cart first, then go to cart
    handleAddToCart();
    setTimeout(() => router.push("/cart"), 400);
  };

  const handleShare = async () => {
    const url = `https://elitehubng.com/products/${product.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      router.push(`/auth?next=/wishlist`);
      return;
    }
    // Wishlist on web is app-only for now (Firebase sync)
    setGated("wishlist");
  };

  return (
    <>
      {/* Quantity selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-navy-DEFAULT/60 font-body">Quantity:</span>
          <div className="flex items-center border border-[rgba(11,46,51,0.15)] rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-navy-DEFAULT/60 hover:bg-gray-50 transition-colors text-lg font-light"
              aria-label="Decrease quantity"
            >−</button>
            <span className="px-4 py-2 font-semibold text-navy-DEFAULT font-body min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
              className="px-3 py-2 text-navy-DEFAULT/60 hover:bg-gray-50 transition-colors text-lg font-light"
              aria-label="Increase quantity"
            >+</button>
          </div>
          {inCart && (
            <span className="text-xs text-gold-DEFAULT font-semibold font-body">
              {cartQty} in cart
            </span>
          )}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={cn(
          "flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-base transition-all font-body",
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : addedAnim
            ? "bg-emerald-500 text-white scale-[0.98]"
            : inCart
            ? "bg-navy-DEFAULT/90 text-white hover:bg-navy-DEFAULT border border-gold-muted"
            : "bg-navy-DEFAULT text-white hover:bg-[#144D54] hover:shadow-navy active:scale-[0.98]"
        )}
      >
        {addedAnim ? (
          <><Check size={20} /> Added!</>
        ) : (
          <><ShoppingCart size={20} />
            {isOutOfStock ? "Out of Stock" : inCart ? "Add More to Cart" : "Add to Cart"}</>
        )}
      </button>

      {/* Buy now */}
      {!isOutOfStock && (
        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-base bg-gold-DEFAULT text-navy-DEFAULT hover:bg-gold-light hover:shadow-gold active:scale-[0.98] transition-all font-body"
        >
          <Zap size={20} /> Buy Now
        </button>
      )}

      {/* Secondary actions */}
      <div className="flex gap-3">
        <button
          onClick={handleWishlist}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/65 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-body"
        >
          <Heart size={16} /> Save
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/65 hover:text-gold-DEFAULT hover:border-gold-muted hover:bg-gold-faint transition-all text-sm font-body"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Safety note */}
      <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <span className="text-lg shrink-0 mt-0.5">🔒</span>
        <p className="text-emerald-800 text-xs leading-relaxed font-body">
          <strong>Buyer Protection:</strong> Your payment is held in escrow until you confirm safe delivery.
          {!isAuthenticated && (
            <span> <a href="/auth" className="underline font-bold">Sign in</a> to order.</span>
          )}
        </p>
      </div>

      {gated && (
        <AppGateModal feature={gated} onClose={() => setGated(null)} />
      )}
    </>
  );
}