import { Product } from "@/types";
import { getProductImageUrl, formatCurrency } from "@/lib/products";

export function JsonLdOrganization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EliteHub NG",
    url: "https://elitehubng.com",
    logo: "https://elitehubng.com/icon-192.png",
    description: "Nigeria's trusted marketplace for buying and selling online",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Yoruba", "Hausa", "Igbo"],
    },
    sameAs: [
      "https://twitter.com/elitehubng",
      "https://instagram.com/elitehubng",
      "https://facebook.com/elitehubng",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdProduct({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product.imageUrls, "large");
  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.id,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: finalPrice,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://elitehubng.com/products/${product.id}`,
      seller: {
        "@type": "Organization",
        name: product.sellerBusinessName || "EliteHub Seller",
      },
    },
    aggregateRating: undefined as unknown,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdBreadcrumb(
  items: { name: string; url: string }[]
) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdWebSite() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EliteHub NG",
    url: "https://elitehubng.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://elitehubng.com/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
