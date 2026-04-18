import { Product } from "@/types";
import { getProductImageUrl } from "@/lib/products";

export function JsonLdOrganization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EliteHub NG",
    url: "https://elitehubng.com",
    logo: "https://elitehubng.com/logo.png",
    description:
      "Nigeria's trusted marketplace for buying and selling online with escrow-protected payments",
    telephone: "+2348140002708",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+2348140002708",
      contactType: "customer support",
      areaServed: "NG",
      availableLanguage: ["English", "Yoruba", "Hausa", "Igbo"],
    },
    sameAs: [
      "https://twitter.com/elitehubng",
      "https://instagram.com/elitehubng",
      "https://facebook.com/elitehubng",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "589 Thailand Street, Efab Queens, Karsana",
      addressLocality: "Abuja",
      addressRegion: "FCT",
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

  // Derive shipping info from product delivery options
  const shippingRate = product.deliveryOptions?.withinState ?? 0;
  const transitDays = product.deliveryOptions?.estimatedDays?.withinState ?? "1-7";
  const transitParts = transitDays.toString().split("-");
  const transitMin = parseInt(transitParts[0]) || 1;
  const transitMax = parseInt(transitParts[1] ?? transitParts[0]) || 7;

  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Buy ${product.name} on EliteHub NG`,
    image: imageUrl,
    sku: product.id,
    mpn: product.id,
    ...(product.brand && {
      brand: { "@type": "Brand", name: product.brand },
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: Math.round(finalPrice),
      priceValidUntil,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition:
        product.condition === "Brand New"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      url: `https://elitehubng.com/products/${product.id}`,
      seller: {
        "@type": "Organization",
        name: product.sellerBusinessName || "EliteHub Seller",
      },
      // ── Merchant Return Policy (fixes Merchant listings warning) ──────────
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NG",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        merchantReturnLink: "https://elitehubng.com/buyer-protection",
      },
      // ── Shipping Details (fixes Merchant listings warning) ─────────────────
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: shippingRate,
          currency: "NGN",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "NG",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: transitMin,
            maxValue: transitMax,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdBreadcrumb(items: { name: string; url: string }[]) {
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
        urlTemplate:
          "https://elitehubng.com/products?search={search_term_string}",
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