"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import ProductGrid from "./ProductGrid";
import { Product } from "@/types";
import { FilterState } from "@/types";
import { cn } from "@/lib/utils";

interface ClientLoadMoreProps {
  initialNextCursor: number;
  filters: Partial<FilterState> & { limit?: number };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ClientLoadMore({
  initialNextCursor,
  filters,
}: ClientLoadMoreProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<number | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (loading || !cursor) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.subcategory) params.set("subcategory", filters.subcategory);
      if (filters.search) params.set("search", filters.search);
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.condition) params.set("condition", filters.condition);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.minPrice != null)
        params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice != null)
        params.set("maxPrice", String(filters.maxPrice));
      params.set("lastCreatedAt", String(cursor));
      params.set("limit", String(filters.limit ?? 24));

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const newProducts: Product[] = (data.products ?? []).filter(
        (p: Product) => !p.status || p.status === "active"
      );

      // Shuffle each batch for variety
      setProducts((prev) => [...prev, ...shuffleArray(newProducts)]);
      setCursor(data.nextCursor ?? null);
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      console.error("[ClientLoadMore]", err);
    } finally {
      setLoading(false);
    }
  };

  // Nothing extra to show yet, but button still visible if hasMore
  return (
    <>
      {products.length > 0 && (
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      )}

      {(hasMore || loading) && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={cn(
              "flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-gold-muted bg-gold-faint text-gold-DEFAULT font-semibold text-sm transition-all font-body",
              "hover:bg-gold-DEFAULT hover:text-navy-DEFAULT hover:shadow-gold hover:border-gold-DEFAULT",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Load More Products
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}