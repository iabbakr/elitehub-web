import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Related Products</h2>
        <Link href="/products" className="text-gold-DEFAULT text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all font-body">
          See all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
