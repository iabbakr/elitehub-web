import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Wishlist — Save Products You Love | EliteHub NG",
  description:
    "Save your favourite products on EliteHub NG and get notified of price drops. Manage your wishlist from the EliteHub NG mobile app — available free on iOS and Android.",
  alternates: { canonical: "https://elitehubng.com/wishlist" },
  openGraph: {
    title: "Your Wishlist | EliteHub NG",
    description:
      "Save products you love and track price drops. Download the EliteHub NG app to access your full wishlist.",
  },
};

const FEATURES = [
  {
    icon: "❤️",
    title: "Save Anything",
    desc: "Tap the heart on any product to save it. Your wishlist syncs across all your devices.",
  },
  {
    icon: "🔔",
    title: "Price Drop Alerts",
    desc: "Get instant notifications when a saved item drops in price or comes back in stock.",
  },
  {
    icon: "🛒",
    title: "One-Tap to Cart",
    desc: "Move wishlist items straight to your cart when you're ready to buy — escrow-protected.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your wishlist is private to you and synced securely to your EliteHub NG account.",
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-faint blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="section relative py-16 md:py-24 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-white/70">Wishlist</span>
          </nav>

          {/* Heart ring — mirrors mobile empty state ring */}
          <div className="relative inline-flex mx-auto mb-8">
            <div className="w-28 h-28 rounded-full border-2 border-gold-muted flex items-center justify-center shadow-[0_0_40px_rgba(201,168,76,0.2)]"
              style={{ background: "rgba(201,168,76,0.08)" }}>
              <span className="text-5xl">❤️</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
            📱 Available on the App
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance max-w-2xl mx-auto">
            Your{" "}
            <span className="text-gold-DEFAULT">Wishlist</span>{" "}
            Lives in the App
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto font-body leading-relaxed mb-8">
            Save products you love, track price drops, and move items straight
            to your escrow-protected cart — all inside the free EliteHub NG app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://apps.apple.com/app/elitehubng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-navy-DEFAULT font-semibold text-base hover:bg-gray-100 transition-all font-body"
            >
              🍎 Download for iOS
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.elitehubng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gold-DEFAULT text-navy-DEFAULT font-semibold text-base hover:bg-gold-light transition-all font-body"
            >
              🤖 Download for Android
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-DEFAULT mb-3">
              What You Get with Wishlist
            </h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body max-w-lg mx-auto">
              Everything you need to track the products you want.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-[#F8F7F4] rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300 group"
              >
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </span>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — mirrors mobile pattern */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-10">
            How to Use Your Wishlist
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                n: "01",
                icon: "📱",
                title: "Download the App",
                desc: "Free on iOS and Android. Sign up in under 2 minutes.",
              },
              {
                n: "02",
                icon: "❤️",
                title: "Tap to Save",
                desc: "Browse products and tap the heart icon on any item to add it to your wishlist.",
              },
              {
                n: "03",
                icon: "🛒",
                title: "Buy When Ready",
                desc: "Move items to your cart anytime — payment is always escrow-protected.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] relative overflow-hidden group hover:border-gold-muted hover:shadow-gold transition-all duration-300"
              >
                <span className="absolute -top-3 -right-3 font-display font-bold text-7xl text-gold-faint select-none group-hover:text-gold-muted transition-colors">
                  {step.n}
                </span>
                <span className="text-3xl block mb-3">{step.icon}</span>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse products CTA — mirrors mobile "Browse Products" button */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="bg-navy-gradient rounded-3xl px-8 md:px-14 py-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold-faint blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                Don&apos;t Have the App Yet?
              </h2>
              <p className="text-white/60 text-base font-body max-w-lg mx-auto mb-6">
                Start browsing products now — when you download the app you can
                save your favourites and pick up right where you left off.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-navy-DEFAULT font-semibold text-base hover:bg-gray-100 transition-all font-body"
                >
                  Browse Products <ArrowRight size={18} />
                </Link>
                <a
                  href="https://play.google.com/store/apps/details?id=com.elitehubng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gold-DEFAULT text-navy-DEFAULT font-semibold text-base hover:bg-gold-light transition-all font-body"
                >
                  Get the Free App
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}