import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  className?: string;
  priorityCount?: number;
}

export default function ProductGrid({ products, className, priorityCount = 4 }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center mb-5 text-3xl">
          📦
        </div>
        <h3 className="font-display text-xl font-semibold text-navy-DEFAULT mb-2">No products found</h3>
        <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("product-grid", className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
