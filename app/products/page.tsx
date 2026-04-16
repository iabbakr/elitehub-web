import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchProducts } from "@/lib/products";
import { formatCategory } from "@/lib/products";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import ProductSearch from "@/components/products/ProductSearch";
import LoadMoreButton from "@/components/products/LoadMoreButton";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { FilterState } from "@/types";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const category = sp.category as string | undefined;
  const search = sp.search as string | undefined;

  const title = search
    ? `"${search}" — Search Results`
    : category
    ? `${formatCategory(category)} for Sale in Nigeria`
    : "All Products — Buy Online in Nigeria";

  const description = search
    ? `Find ${search} from verified sellers across Nigeria. Escrow-protected, real-time tracking.`
    : category
    ? `Browse ${formatCategory(category)} from verified Nigerian sellers. Best prices, escrow-protected payments.`
    : "Shop millions of products from verified Nigerian sellers. Electronics, fashion, food, cars, and more — with escrow protection.";

  return {
    title,
    description,
    alternates: {
      canonical: category
        ? `https://elitehubng.com/products?category=${category}`
        : search
        ? `https://elitehubng.com/products?search=${encodeURIComponent(search)}`
        : "https://elitehubng.com/products",
    },
    openGraph: { title, description },
  };
}

async function ProductResults({ filters }: { filters: Partial<FilterState> & { limit?: number } }) {
  const { products, hasMore, nextCursor, total } = await fetchProducts(filters);

  return (
    <div>
      {/* Result count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-navy-DEFAULT/60 text-sm font-body">
          {total > 0 ? (
            <>
              <span className="font-semibold text-navy-DEFAULT">{total.toLocaleString()}</span>
              {" "}product{total !== 1 ? "s" : ""}
              {filters.search && (
                <> for &ldquo;<span className="text-gold-DEFAULT font-semibold">{filters.search}</span>&rdquo;</>
              )}
              {filters.category && (
                <> in <span className="text-gold-DEFAULT font-semibold">{formatCategory(filters.category)}</span></>
              )}
            </>
          ) : (
            "No products found"
          )}
        </p>
      </div>

      <ProductGrid products={products} />

      {/* Pagination */}
      {hasMore && nextCursor && (
        <div className="flex justify-center mt-10">
          <LoadMoreButton
            currentFilters={filters}
            nextCursor={nextCursor}
          />
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const filters: Partial<FilterState> & { limit?: number } = {
    category:  sp.category as string | undefined,
    subcategory: sp.subcategory as string | undefined,
    search:    sp.search as string | undefined,
    state:     sp.state as string | undefined,
    city:      sp.city as string | undefined,
    condition: sp.condition as string | undefined,
    sort:      (sp.sort as FilterState["sort"]) || "newest",
    minPrice:  sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice:  sp.maxPrice ? Number(sp.maxPrice) : undefined,
    limit:     24,
  };

  const pageTitle = filters.search
    ? `Results for "${filters.search}"`
    : filters.category
    ? formatCategory(filters.category)
    : "All Products";

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Page header */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
        <div className="section py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-navy-DEFAULT/50 mb-3 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            {filters.category ? (
              <>
                <a href="/products" className="hover:text-gold-DEFAULT transition-colors">Products</a>
                <span>/</span>
                <span className="text-navy-DEFAULT font-medium">{formatCategory(filters.category)}</span>
              </>
            ) : (
              <span className="text-navy-DEFAULT font-medium">Products</span>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-DEFAULT flex-1">
              {pageTitle}
            </h1>
            <Suspense>
              <ProductSearch />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section py-8">
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <Suspense>
            <ProductFilters />
          </Suspense>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter row */}
            <div className="lg:hidden flex items-center gap-3 mb-5">
              <Suspense>
                <ProductFilters />
              </Suspense>
              {filters.sort && (
                <span className="text-xs text-navy-DEFAULT/50 font-body">
                  Sorted by: <strong>{
                    { newest: "Newest", price_asc: "Price ↑", price_desc: "Price ↓", popular: "Popular" }[filters.sort]
                  }</strong>
                </span>
              )}
            </div>

            <Suspense fallback={<ProductGridSkeleton count={24} />}>
              <ProductResults filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
