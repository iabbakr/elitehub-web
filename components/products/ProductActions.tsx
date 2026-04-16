"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Heart, Share2, Copy, Check } from "lucide-react";
import AppGateModal from "@/components/ui/AppGateModal";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
  isOutOfStock: boolean;
}

export default function ProductActions({ product, isOutOfStock }: ProductActionsProps) {
  const [gated, setGated] = useState<"cart" | "checkout" | "wishlist" | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `https://elitehubng.com/products/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Quantity */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-navy-DEFAULT/60 font-body">Quantity:</span>
          <div className="flex items-center border border-[rgba(11,46,51,0.15)] rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-navy-DEFAULT/60 hover:bg-gray-50 transition-colors text-lg font-light"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-4 py-2 font-semibold text-navy-DEFAULT font-body min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
              className="px-3 py-2 text-navy-DEFAULT/60 hover:bg-gray-50 transition-colors text-lg font-light"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => !isOutOfStock && setGated("cart")}
          disabled={isOutOfStock}
          className={cn(
            "flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-base transition-all font-body",
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-navy-DEFAULT text-white hover:bg-navy-mid hover:shadow-navy active:scale-[0.98]"
          )}
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        {!isOutOfStock && (
          <button
            onClick={() => setGated("checkout")}
            className="flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-base bg-gold-DEFAULT text-navy-DEFAULT hover:bg-gold-light hover:shadow-gold active:scale-[0.98] transition-all font-body"
          >
            <Zap size={20} />
            Buy Now
          </button>
        )}
      </div>

      {/* Secondary actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setGated("wishlist")}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/65 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-body"
        >
          <Heart size={16} />
          Save
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
          <strong>Buyer Protection:</strong> Your payment is held in escrow until you confirm safe delivery. You can raise a dispute anytime from the app.
        </p>
      </div>

      {gated && (
        <AppGateModal feature={gated} onClose={() => setGated(null)} />
      )}
    </>
  );
}
