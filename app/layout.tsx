import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppBanner from "@/components/layout/AppBanner";
import { JsonLdOrganization } from "@/components/seo/JsonLd";

// ── SEO Metadata ──────────────────────────────────────────────────────────────

const SITE_URL = "https://elitehubng.com";
const SITE_NAME = "EliteHub NG";
const DEFAULT_DESCRIPTION =
  "Nigeria's trusted marketplace. Buy and sell electronics, fashion, food, automobiles, and more — with escrow-protected payments and verified sellers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Nigeria's Trusted Marketplace`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Nigerian marketplace",
    "buy online Nigeria",
    "sell online Nigeria",
    "EliteHub",
    "Lagos market",
    "Nigerian ecommerce",
    "verified sellers Nigeria",
    "escrow payment Nigeria",
    "buy electronics Nigeria",
    "fashion Nigeria",
  ],
  authors: [{ name: "EliteHub NG", url: SITE_URL }],
  creator: "EliteHub NG",
  publisher: "EliteHub NG",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Nigeria's Trusted Marketplace`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "EliteHub NG — Nigeria's Trusted Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Nigeria's Trusted Marketplace`,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@elitehubng",
    site: "@elitehubng",
  },
  icons: {
  icon: [
    { url: "/logo.png" }, // This puts your logo in the browser tab
    { url: "/logo.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [{ url: "/logo.png", sizes: "180x180" }],
  shortcut: "/logo.png",
},
  manifest: "/manifest.json",
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B2E33" },
    { media: "(prefers-color-scheme: dark)", color: "#071E22" },
  ],
};

// ── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <JsonLdOrganization />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://elitehub-backend.onrender.com" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Mobile app download banner (dismissible) */}
        <AppBanner />

        <Header />

        <main className="flex-1 page-enter">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}