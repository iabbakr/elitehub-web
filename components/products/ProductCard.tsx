"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingCart, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { getProductImageUrl, formatCurrency, getDiscountedPrice, formatCategory } from "@/lib/products";
import AppGateModal from "@/components/ui/AppGateModal";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [gated, setGated] = useState<"cart" | "wishlist" | null>(null);
  const [imgError, setImgError] = useState(false);

  const imageUrl = getProductImageUrl(product.imageUrls, "medium");
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const isOutOfStock = product.stock === 0;
  const hasDiscount = !!product.discount && product.discount > 0;
  const isNew = Date.now() - product.createdAt < 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      <article className="card group relative flex flex-col h-full">
        {/* Image */}
        <Link
          href={`/products/${product.id}`}
          className="relative block overflow-hidden rounded-t-2xl bg-gray-50"
          style={{ aspectRatio: "1 / 1" }}
        >
          <Image
            src={imgError ? "https://via.placeholder.com/400x400?text=No+Image" : imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="badge badge-gold text-[10px]">
                -{product.discount}%
              </span>
            )}
            {isNew && !hasDiscount && (
              <span className="badge badge-navy text-[10px]">NEW</span>
            )}
            {isOutOfStock && (
              <span className="badge badge-error text-[10px]">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setGated("wishlist"); }}
            aria-label="Save to wishlist"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow-sm text-navy-DEFAULT/50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <Heart size={15} />
          </button>

          {/* Quick add (hover) */}
          {!isOutOfStock && (
            <button
              onClick={(e) => { e.preventDefault(); setGated("cart"); }}
              className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-navy-DEFAULT/90 text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-navy-mid font-body"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          )}
        </Link>

        {/* Details */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          {/* Category */}
          <p className="text-[10px] text-gold-DEFAULT font-semibold uppercase tracking-wide font-body">
            {formatCategory(product.subcategory || product.category)}
          </p>

          {/* Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-navy-DEFAULT font-medium text-sm leading-snug line-clamp-2 hover:text-navy-mid transition-colors font-body">
              {product.name}
            </h3>
          </Link>

          {/* Location */}
          {product.location && (
            <div className="flex items-center gap-1 text-[11px] text-navy-DEFAULT/50 font-body">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{product.location.city}, {product.location.state}</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-end justify-between mt-auto pt-2">
            <div>
              <p className={cn("font-display font-bold text-base leading-none", isOutOfStock ? "text-navy-DEFAULT/40" : "text-navy-DEFAULT")}>
                {formatCurrency(finalPrice)}
              </p>
              {hasDiscount && (
                <p className="text-[11px] text-navy-DEFAULT/40 line-through font-body mt-0.5">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>

            {/* Seller rating placeholder */}
            <button
              onClick={() => setGated("cart")}
              aria-label="Add to cart"
              disabled={isOutOfStock}
              className={cn(
                "p-2 rounded-xl transition-all",
                isOutOfStock
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-gold-faint border border-gold-muted text-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-navy-DEFAULT hover:shadow-gold"
              )}
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </article>

      {gated && (
        <AppGateModal feature={gated} onClose={() => setGated(null)} />
      )}
    </>
  );
}
