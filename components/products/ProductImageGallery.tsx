"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getProductImageUrl } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [imgError, setImgError] = useState(false);

  const validImages = images.filter(Boolean);
  const hasMultiple = validImages.length > 1;

  const prev = () => setCurrent((c) => (c - 1 + validImages.length) % validImages.length);
  const next = () => setCurrent((c) => (c + 1) % validImages.length);

  const mainUrl = imgError
    ? "https://via.placeholder.com/800x800?text=No+Image"
    : getProductImageUrl(validImages[current] || "", "large");

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white group">
        <Image
          src={mainUrl}
          alt={`${productName} — image ${current + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onError={() => setImgError(true)}
        />

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 shadow-sm text-navy-DEFAULT/60 hover:text-navy-DEFAULT opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Zoom image"
        >
          <ZoomIn size={18} />
        </button>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/90 shadow-sm text-navy-DEFAULT opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/90 shadow-sm text-navy-DEFAULT opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === current
                      ? "w-5 h-1.5 bg-gold-DEFAULT"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                i === current
                  ? "border-gold-DEFAULT shadow-gold"
                  : "border-transparent hover:border-navy-DEFAULT/20"
              )}
            >
              <Image
                src={getProductImageUrl(img, "thumb")}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] bg-navy-deep/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getProductImageUrl(validImages[current] || "", "large")}
              alt={productName}
              width={800}
              height={800}
              className="object-contain max-h-[85vh] w-full rounded-2xl"
            />
            {hasMultiple && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <button
              onClick={() => setLightbox(false)}
              className="absolute -top-4 -right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
