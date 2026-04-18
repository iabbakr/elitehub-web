import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "EliteHub NG Blog — Tips, Guides & Marketplace News",
  description:
    "Read the latest tips for buyers and sellers, marketplace news, and guides on how to shop safely online in Nigeria.",
  alternates: { canonical: "https://elitehubng.com/blog" },
};

const TOPICS = [
  { icon: "🔒", title: "How Escrow Works",       desc: "A step-by-step guide to our buyer protection system." },
  { icon: "🏪", title: "Seller Success Tips",     desc: "How to grow your sales and build a 5-star reputation." },
  { icon: "📦", title: "Shipping & Delivery",     desc: "Understanding delivery options and tracking your orders." },
  { icon: "💳", title: "Safe Online Shopping",    desc: "Red flags to avoid and how to stay scam-free." },
  { icon: "📱", title: "Using the App",            desc: "Getting the most out of the EliteHub NG mobile app." },
  { icon: "⭐", title: "Leaving Reviews",          desc: "Why honest reviews protect every Nigerian buyer." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-faint blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="section relative py-16 md:py-24 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Blog</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
            ✍️ Coming Soon
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance max-w-2xl mx-auto">
            The EliteHub NG{" "}
            <span className="text-gold-DEFAULT">Blog</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto font-body leading-relaxed">
            Tips, guides, and news for buyers and sellers across Nigeria. Our
            blog is launching soon — follow us on social media for early access.
          </p>
        </div>
      </div>

      {/* Upcoming topics */}
      <section className="py-16">
        <div className="section">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-2">
              What We&apos;ll Be Writing About
            </h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">
              Practical knowledge to help you buy and sell smarter.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {TOPICS.map((t) => (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300"
              >
                <span className="text-3xl block mb-3">{t.icon}</span>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-base mb-1.5">
                  {t.title}
                </h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Stay updated CTA */}
          <div className="bg-navy-gradient rounded-3xl px-8 md:px-14 py-12 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-faint blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Stay in the Loop
              </h2>
              <p className="text-white/60 text-base font-body max-w-lg mx-auto mb-6">
                Follow EliteHub NG on social media to be the first to read our
                guides and marketplace updates.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {[
                  { label: "Twitter / X", href: "https://twitter.com/elitehubng" },
                  { label: "Instagram", href: "https://instagram.com/elitehubng" },
                  { label: "Facebook", href: "https://facebook.com/elitehubng" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 text-sm font-body transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <Link href="/products" className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex">
                Browse Products Instead <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}