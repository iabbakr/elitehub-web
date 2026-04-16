import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/", "/services"],
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/checkout",
          "/orders",
          "/wallet",
          "/profile",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: "https://elitehubng.com/sitemap.xml",
    host: "https://elitehubng.com",
  };
}
