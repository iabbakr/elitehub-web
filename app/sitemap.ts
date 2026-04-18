import { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/products";

const BASE_URL = "https://elitehubng.com";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                               lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE_URL}/products`,                 lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
  { url: `${BASE_URL}/services`,                 lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
  { url: `${BASE_URL}/wishlist`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/about`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/contact`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/blog`,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
  { url: `${BASE_URL}/careers`,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.4 },
  { url: `${BASE_URL}/buyer-protection`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/seller-guidelines`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/terms`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  { url: `${BASE_URL}/privacy`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
];

// Category pages
const CATEGORIES = [
  "Phones_Tablets", "Laptops_Computers", "TV_Audio_Gaming", "Womens_Fashion",
  "Mens_Fashion", "Babies_Kids", "Beauty_Personal_Care", "Home_Appliances",
  "Furniture", "Fruits_Vegetables", "Meat_Fish_Poultry", "Beverages",
  "Vehicles_Cars", "Health_Medical", "Sports_Hobbies", "Real_Estate",
];

const CATEGORY_PAGES: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
  url: `${BASE_URL}/products?category=${cat}`,
  lastModified: new Date(),
  changeFrequency: "daily" as const,
  priority: 0.7,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const { products } = await fetchProducts({ limit: 500, sort: "newest" });
    productPages = products.map((p) => ({
      url: `${BASE_URL}/products/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("[sitemap] Failed to fetch products:", e);
  }

  return [...STATIC_PAGES, ...CATEGORY_PAGES, ...productPages];
}