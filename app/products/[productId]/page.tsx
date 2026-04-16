import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProduct, fetchRelatedProducts, getProductImageUrl, formatCurrency, getDiscountedPrice, formatCategory } from "@/lib/products";
import { truncate } from "@/lib/utils";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductActions from "@/components/products/ProductActions";
import { JsonLdProduct, JsonLdBreadcrumb } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return { title: "Product Not Found | EliteHub NG" };
  }

  const imageUrl = getProductImageUrl(product.imageUrls, "large");
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const description = truncate(product.description, 155) ||
    `Buy ${product.name} for ${formatCurrency(finalPrice)} from verified sellers on EliteHub NG. Escrow-protected, real delivery tracking.`;

  return {
    title: `${product.name} — ${formatCurrency(finalPrice)} | EliteHub NG`,
    description,
    alternates: { canonical: `https://elitehubng.com/products/${productId}` },
    openGraph: {
      title: `${product.name} | EliteHub NG`,
      description,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | EliteHub NG`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;
  const [product, relatedProducts] = await Promise.all([
    fetchProduct(productId),
    fetchProduct(productId).then((p) => p ? fetchRelatedProducts(p) : []),
  ]);

  if (!product) notFound();

  const images = Array.isArray(product.imageUrls) ? product.imageUrls : [product.imageUrls];
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const isOutOfStock = product.stock === 0;
  const hasDiscount = !!product.discount && product.discount > 0;
  const isNew = Date.now() - product.createdAt < 7 * 24 * 60 * 60 * 1000;

  const breadcrumbs = [
    { name: "Home",     url: "https://elitehubng.com" },
    { name: "Products", url: "https://elitehubng.com/products" },
    { name: formatCategory(product.category), url: `https://elitehubng.com/products?category=${product.category}` },
    { name: product.name, url: `https://elitehubng.com/products/${product.id}` },
  ];

  return (
    <>
      <JsonLdProduct product={product} />
      {JsonLdBreadcrumb(breadcrumbs)}

      <div className="min-h-screen bg-[#F8F7F4]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
          <div className="section py-3">
            <nav className="flex items-center gap-2 text-xs text-navy-DEFAULT/50 font-body flex-wrap">
              <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
              <span>/</span>
              <a href="/products" className="hover:text-gold-DEFAULT transition-colors">Products</a>
              <span>/</span>
              <a href={`/products?category=${product.category}`} className="hover:text-gold-DEFAULT transition-colors">
                {formatCategory(product.category)}
              </a>
              <span>/</span>
              <span className="text-navy-DEFAULT font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="section py-8">
          <div className="bg-white rounded-3xl border border-[rgba(11,46,51,0.06)] overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left — image gallery */}
              <div className="bg-gray-50 rounded-tl-3xl rounded-bl-none lg:rounded-bl-3xl rounded-tr-3xl lg:rounded-tr-none p-6">
                <ProductImageGallery images={images} productName={product.name} />
              </div>

              {/* Right — details */}
              <div className="p-8 flex flex-col gap-5">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                  {product.condition && (
                    <span className="badge badge-navy">{product.condition}</span>
                  )}
                  {hasDiscount && (
                    <span className="badge badge-gold">-{product.discount}% OFF</span>
                  )}
                  {isNew && (
                    <span className="badge badge-success">New Listing</span>
                  )}
                  {isOutOfStock && (
                    <span className="badge badge-error">Out of Stock</span>
                  )}
                </div>

                {/* Category */}
                <p className="text-gold-DEFAULT text-xs font-bold uppercase tracking-widest font-body">
                  {formatCategory(product.subcategory || product.category)}
                </p>

                {/* Name */}
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-DEFAULT leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-end gap-3">
                  <span className="font-display text-3xl font-bold text-navy-DEFAULT">
                    {formatCurrency(finalPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-navy-DEFAULT/40 text-lg line-through font-body">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                {/* Location & Stock */}
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  {product.location && (
                    <span className="flex items-center gap-1.5 text-navy-DEFAULT/60 font-body">
                      📍 {product.location.area}, {product.location.city}, {product.location.state}
                    </span>
                  )}
                  <span className={`font-semibold font-body ${isOutOfStock ? "text-red-500" : product.stock <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
                    {isOutOfStock ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
                  </span>
                </div>

                {/* Delivery */}
                {product.deliveryOptions && (
                  <div className="bg-[rgba(11,46,51,0.03)] rounded-2xl p-4 border border-[rgba(11,46,51,0.06)]">
                    <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-2.5 font-body">Delivery Options</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-navy-DEFAULT/65">Within {product.location?.state || "State"}</span>
                        <span className="font-semibold text-navy-DEFAULT">
                          {product.deliveryOptions.withinState === 0 ? "🎉 Free" : formatCurrency(product.deliveryOptions.withinState)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-navy-DEFAULT/65">Other States</span>
                        <span className="font-semibold text-navy-DEFAULT">
                          {product.deliveryOptions.outsideState === 0 ? "🎉 Free" : formatCurrency(product.deliveryOptions.outsideState)}
                        </span>
                      </div>
                      {product.deliveryOptions.allowsPickup && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-emerald-600 text-xs">✓</span>
                          <span className="text-sm text-navy-DEFAULT/65 font-body">Pickup available</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trust row */}
                <div className="flex flex-wrap gap-2">
                  {["🔒 Escrow Protected", "✅ Verified Seller", "⚡ Real-time Tracking"].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full bg-gold-faint border border-gold-muted text-[11px] text-gold-DEFAULT font-semibold font-body">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions — gated */}
                <ProductActions product={product} isOutOfStock={isOutOfStock} />

                {/* Seller info */}
                {product.sellerBusinessName && (
                  <div className="flex items-center gap-3 pt-2 border-t border-[rgba(11,46,51,0.06)]">
                    <div className="w-10 h-10 rounded-xl bg-navy-DEFAULT flex items-center justify-center text-white font-display font-bold">
                      {product.sellerBusinessName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-DEFAULT text-sm font-body">{product.sellerBusinessName}</p>
                      <p className="text-navy-DEFAULT/50 text-xs font-body">Verified EliteHub Seller</p>
                    </div>
                    <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-body">✓ Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description + Specs */}
            <div className="border-t border-[rgba(11,46,51,0.06)] px-8 py-8 grid md:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <h2 className="font-display font-semibold text-navy-DEFAULT text-lg mb-4">Product Description</h2>
                <p className="text-navy-DEFAULT/65 text-sm leading-relaxed font-body whitespace-pre-line">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="font-display font-semibold text-navy-DEFAULT text-lg mb-4">Specifications</h2>
                <div className="space-y-2">
                  {[
                    { label: "Brand",     value: product.brand },
                    { label: "Condition", value: product.condition },
                    { label: "Category",  value: formatCategory(product.category) },
                    { label: "Warranty",  value: product.warranty && product.warranty !== "none" ? product.warranty.replace(/_/g, " ") : null },
                    { label: "Colors",    value: product.colors?.join(", ") },
                    { label: "Weight",    value: product.weight },
                  ].filter((r) => r.value).map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(11,46,51,0.06)] text-sm">
                      <span className="text-navy-DEFAULT/55 font-body">{row.label}</span>
                      <span className="font-medium text-navy-DEFAULT font-body">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* App CTA */}
            <div className="border-t border-[rgba(11,46,51,0.06)] bg-navy-gradient px-8 py-6 flex flex-col sm:flex-row items-center gap-4">
              <div>
                <p className="font-display font-semibold text-white text-lg">Get the full experience</p>
                <p className="text-white/60 text-sm font-body">Track your order, chat with seller, manage your wallet</p>
              </div>
              <div className="flex gap-3 shrink-0 ml-auto">
                <a href="https://apps.apple.com/app/elitehubng" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white text-navy-DEFAULT text-sm font-semibold hover:bg-gray-100 transition-all font-body">
                  App Store
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.elitehubng" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT text-sm font-semibold hover:bg-gold-light transition-all font-body">
                  Google Play
                </a>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
