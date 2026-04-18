/**
 * lib/products.ts
 * Server-side data fetching for products.
 * Uses the REST API so pages can be statically generated / ISR.
 */

import { Product, ProductsResponse, FilterState } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

function buildQuery(
  filters: Partial<FilterState> & {
    limit?: number;
    lastCreatedAt?: number | null;
  }
): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.search) params.set("search", filters.search);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.lastCreatedAt)
    params.set("lastCreatedAt", String(filters.lastCreatedAt));
  return params.toString();
}

/** Fisher-Yates shuffle — does NOT mutate the original array */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchProducts(
  filters: Partial<FilterState> & {
    limit?: number;
    lastCreatedAt?: number | null;
  } = {}
): Promise<ProductsResponse> {
  const opts = { limit: 24, ...filters };
  const qs = buildQuery(opts);

  try {
    const res = await fetch(`${API_BASE}/products?${qs}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Filter to active products only
    const products: Product[] = (data.products ?? []).filter(
      (p: Product) => !p.status || p.status === "active"
    );

    return {
      products,
      hasMore: data.hasMore ?? false,
      nextCursor: data.nextCursor ?? null,
      total: data.total ?? products.length,
    };
  } catch (err) {
    console.error("[fetchProducts]", err);
    return { products: [], hasMore: false, nextCursor: null, total: 0 };
  }
}

export async function fetchProduct(productId: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetches featured products and shuffles for variety.
 * Fetches 2× the requested limit so the shuffle pool is larger.
 */
export async function fetchFeaturedProducts(limit = 12): Promise<Product[]> {
  const fetchLimit = Math.min(limit * 2, 48);
  const { products } = await fetchProducts({ limit: fetchLimit, sort: "popular" });
  // Shuffle the full pool then take the requested slice
  return shuffleArray(products).slice(0, limit);
}

export async function fetchRelatedProducts(
  product: Product,
  limit = 8
): Promise<Product[]> {
  const { products } = await fetchProducts({
    category: product.category,
    limit: limit + 1,
  });
  return shuffleArray(products.filter((p) => p.id !== product.id)).slice(
    0,
    limit
  );
}

// ── Image helpers (Cloudinary) ────────────────────────────────────────────────

export function getProductImageUrl(
  imageUrls: string | string[],
  size: "thumb" | "medium" | "large" = "medium"
): string {
  const raw = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
  if (!raw) return "https://via.placeholder.com/600x600?text=No+Image";

  if (!raw.includes("res.cloudinary.com")) return raw;

  const sizeMap = {
    thumb:  "w_300,h_300,c_fill,q_auto:eco,f_auto",
    medium: "w_700,h_700,c_fill,q_auto:good,f_auto",
    large:  "w_1200,c_fill,q_auto:best,f_auto",
  };

  return raw.replace("/upload/", `/upload/${sizeMap[size]}/`);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountedPrice(price: number, discount?: number): number {
  if (!discount) return price;
  return price * (1 - discount / 100);
}

export function formatCategory(cat: string): string {
  return cat
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}