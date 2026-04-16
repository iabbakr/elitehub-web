import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Zap, Star, TrendingUp, Package, CheckCircle } from "lucide-react";
import { fetchFeaturedProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/products";
import ProductGrid from "@/components/products/ProductGrid";
import { JsonLdWebSite } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EliteHub NG — Nigeria's Trusted Marketplace",
  description:
    "Buy and sell electronics, fashion, food, automobiles, and services across Nigeria. Escrow-protected payments, verified sellers, real-time tracking.",
  alternates: { canonical: "https://elitehubng.com" },
};

const CATEGORIES = [
  { label: "Phones & Tablets",     icon: "📱", href: "/products?category=Phones_Tablets",       bg: "from-blue-50 to-blue-100",     accent: "text-blue-600" },
  { label: "Fashion & Style",      icon: "👗", href: "/products?category=Womens_Fashion",        bg: "from-pink-50 to-pink-100",     accent: "text-pink-600" },
  { label: "Food & Groceries",     icon: "🥦", href: "/products?category=Fruits_Vegetables",     bg: "from-emerald-50 to-emerald-100", accent: "text-emerald-600" },
  { label: "Automobiles",          icon: "🚗", href: "/products?category=Vehicles_Cars",         bg: "from-orange-50 to-orange-100", accent: "text-orange-600" },
  { label: "Electronics",          icon: "📺", href: "/products?category=TV_Audio_Gaming",       bg: "from-purple-50 to-purple-100", accent: "text-purple-600" },
  { label: "Computers",            icon: "💻", href: "/products?category=Laptops_Computers",     bg: "from-sky-50 to-sky-100",       accent: "text-sky-600" },
  { label: "Home Appliances",      icon: "🏠", href: "/products?category=Home_Appliances",       bg: "from-amber-50 to-amber-100",   accent: "text-amber-600" },
  { label: "Beauty & Care",        icon: "💄", href: "/products?category=Beauty_Personal_Care",  bg: "from-rose-50 to-rose-100",     accent: "text-rose-600" },
  { label: "Health & Medical",     icon: "💊", href: "/products?category=Health_Medical",        bg: "from-teal-50 to-teal-100",     accent: "text-teal-600" },
  { label: "Sports & Hobbies",     icon: "⚽", href: "/products?category=Sports_Hobbies",        bg: "from-lime-50 to-lime-100",     accent: "text-lime-600" },
  { label: "Real Estate",          icon: "🏢", href: "/products?category=Real_Estate",           bg: "from-indigo-50 to-indigo-100", accent: "text-indigo-600" },
  { label: "Services",             icon: "🔧", href: "/services",                                bg: "from-gold-faint to-amber-50",  accent: "text-gold-DEFAULT" },
];

const TRUST_POINTS = [
  { icon: Shield,       title: "Escrow Protection",      desc: "Your money is held safely until you confirm delivery" },
  { icon: CheckCircle,  title: "Verified Sellers",       desc: "All sellers are vetted and rated by real buyers" },
  { icon: Zap,          title: "Instant Notifications",  desc: "Real-time order updates via the mobile app" },
  { icon: Star,         title: "Buyer Guarantee",        desc: "Get a full refund if your item doesn't arrive" },
];

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts(20);

  return (
    <>
      <JsonLdWebSite />

      {/* ── Hero ──────────────────────────────────────────────────────────────*/}
      <section className="relative bg-navy-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-faint blur-3xl translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-2xl -translate-x-1/3 translate-y-1/3" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="section relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-white  text-sm font-semibold mb-6 font-body">
              <TrendingUp size={14} />
              Nigeria&apos;s #1 Trusted Marketplace
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6">
              Buy &amp; Sell Anything{" "}
              <span className="text-gold-DEFAULT">Across Nigeria</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-8 font-body max-w-lg mx-auto md:mx-0">
              Phones, fashion, food, cars, real estate, services — all in one
              marketplace with escrow-protected payments and verified sellers.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
              {["🔒 Escrow Safe", "✅ Verified Sellers", "⚡ Real-time Tracking", "💰 Best Prices"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-body">
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/products" className="btn-gold px-8 py-4 text-base rounded-2xl">
                Browse Products <ArrowRight size={18} />
              </Link>
              <Link href="#download" className="btn-navy px-8 py-4 text-base rounded-2xl">
                Download App
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start">
              {[
                { num: "50K+",  label: "Products" },
                { num: "10K+",  label: "Sellers" },
                { num: "100K+", label: "Buyers" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-2xl text-gold">{s.num}</p>
                  <p className="text-white/50 text-xs mt-0.5 font-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating product cards mockup */}
          <div className="hidden md:flex items-center justify-center relative h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Main card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-5 w-64 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <div className="w-full aspect-square bg-white/15 rounded-2xl mb-3 flex items-center justify-center text-5xl">
                  📱
                </div>
                <p className="text-white font-semibold text-sm font-body">iPhone 14 Pro Max</p>
                <p className="text-gold-DEFAULT font-display font-bold text-lg mt-1">{formatCurrency(650000)}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/60 text-xs font-body">Lagos, VI</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 py-2 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT text-xs font-bold text-center font-body">Add to Cart</div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-4 right-4 bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg font-body">
                ✅ Verified Seller
              </div>
              <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] px-4 py-3 border border-gray-100">
                <p className="text-navy-DEFAULT text-xs font-semibold font-body">🔒 Escrow Protected</p>
                <p className="text-navy-DEFAULT/50 text-[11px] font-body">Order #EH284912</p>
              </div>
              <div className="absolute top-12 left-2 bg-emerald-400 rounded-2xl shadow-lg px-4 py-2.5 border border-white/10">
                <p className="text-gold-DEFAULT text-xs font-bold font-body">📦 Out for Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F8F7F4]" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </section>

      {/* ── Category grid ────────────────────────────────────────────────────*/}
      <section className="py-14 bg-[#F8F7F4]">
        <div className="section">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Shop by Category</h2>
            <Link href="/products" className="text-gold-DEFAULT text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all font-body">
              All categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${cat.bg} border border-transparent hover:border-gold-muted hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5`}
              >
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight font-body ${cat.accent}`}>
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────*/}
      <section className="py-14 bg-white">
        <div className="section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-navy-DEFAULT/55 text-sm mt-1 font-body">Hand-picked from verified sellers</p>
            </div>
            <Link href="/products?sort=popular" className="btn-ghost px-5 py-2.5 text-sm">
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} priorityCount={8} />
        </div>
      </section>

      {/* ── Why EliteHub ─────────────────────────────────────────────────────*/}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-DEFAULT mb-3">
              Why Choose EliteHub NG?
            </h2>
            <p className="text-navy-DEFAULT/55 text-base font-body max-w-xl mx-auto">
              We built the safest, simplest way to buy and sell in Nigeria.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map((point) => (
              <div
                key={point.title}
                className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center mb-4 group-hover:bg-gold-DEFAULT transition-colors duration-300">
                  <point.icon size={22} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-lg mb-2">{point.title}</h3>
                <p className="text-navy-DEFAULT/55 text-sm leading-relaxed font-body">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services promo ────────────────────────────────────────────────────*/}
      <section className="py-14 bg-white">
        <div className="section">
          <div className="rounded-3xl bg-navy-gradient overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold-faint blur-3xl" />
            </div>
            <div className="relative px-8 md:px-14 py-14 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="badge badge-gold mb-4">New</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
                  Find Trusted Service Providers Near You
                </h2>
                <p className="text-white/65 text-base leading-relaxed font-body mb-8">
                  Plumbers, electricians, tailors, mechanics, tutors, delivery
                  agents — vetted, rated, and ready to help.
                </p>
                <Link href="/services" className="btn-gold px-8 py-4 text-base rounded-2xl inline-flex">
                  Explore Services <ArrowRight size={18} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🔧", label: "Home Repair",   n: "2.4K providers" },
                  { icon: "👗", label: "Fashion",        n: "1.8K providers" },
                  { icon: "📦", label: "Logistics",      n: "3.1K providers" },
                  { icon: "💻", label: "Tech & Gadgets", n: "900+ providers" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
                    <span className="text-2xl mb-2 block">{s.icon}</span>
                    <p className="text-white font-semibold text-sm font-body">{s.label}</p>
                    <p className="text-gold-DEFAULT text-xs mt-0.5 font-body">{s.n}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sell on EliteHub ─────────────────────────────────────────────────*/}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section text-center">
          <span className="badge badge-gold mb-4">For Sellers</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-DEFAULT mb-4 text-balance">
            Start Selling Today
          </h2>
          <p className="text-navy-DEFAULT/55 text-base font-body max-w-xl mx-auto mb-8">
            Join thousands of sellers earning daily. List products, manage orders,
            and receive payments — all from the EliteHub NG app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.elitehubng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-4 text-base rounded-2xl"
            >
              Download &amp; Start Selling <ArrowRight size={18} />
            </a>
            <Link href="/products" className="text-navy-DEFAULT/60 text-sm hover:text-navy-DEFAULT transition-colors font-body">
              Or browse products first →
            </Link>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-6 mt-14 text-left">
            {[
              { n: "01", title: "Download the App",    desc: "Free on iOS & Android. Create your seller account in 2 minutes." },
              { n: "02", title: "List Your Products",  desc: "Upload photos, set your price, choose delivery options." },
              { n: "03", title: "Get Paid Safely",     desc: "Escrow holds funds until your buyer confirms delivery." },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] relative overflow-hidden group hover:border-gold-muted hover:shadow-gold transition-all duration-300">
                <span className="absolute -top-3 -right-3 font-display font-bold text-7xl text-gold-faint select-none group-hover:text-gold-muted transition-colors">
                  {step.n}
                </span>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-lg mb-2">{step.title}</h3>
                <p className="text-navy-DEFAULT/55 text-sm leading-relaxed font-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
