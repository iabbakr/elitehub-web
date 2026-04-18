import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About EliteHub NG — Nigeria's Trusted Marketplace",
  description:
    "Learn about EliteHub NG — how we're building Nigeria's safest, most trusted marketplace with escrow protection, verified sellers, and real-time tracking.",
  alternates: { canonical: "https://elitehubng.com/about" },
};

const VALUES = [
  {
    icon: "🔒",
    title: "Trust First",
    desc: "Every transaction is escrow-protected. Buyers are covered until safe delivery is confirmed.",
  },
  {
    icon: "✅",
    title: "Verified Sellers",
    desc: "We vet every seller before they can list. Bad actors are removed quickly based on buyer feedback.",
  },
  {
    icon: "⚡",
    title: "Real-time Everything",
    desc: "Live order tracking, instant notifications, and real-time chat between buyers and sellers.",
  },
  {
    icon: "🇳🇬",
    title: "Built for Nigeria",
    desc: "Designed specifically for Nigerian buyers and sellers — from Lagos to Kano, Abuja to Port Harcourt.",
  },
];

const STATS = [
  { value: "50K+",  label: "Active Listings" },
  { value: "10K+",  label: "Verified Sellers" },
  { value: "100K+", label: "Happy Buyers" },
  { value: "37",    label: "States Covered" },
];

export default function AboutPage() {
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
        <div className="section relative py-16 md:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-white/70">About Us</span>
          </nav>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
              🇳🇬 Made in Nigeria, for Nigeria
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              We&apos;re Building Nigeria&apos;s{" "}
              <span className="text-gold-DEFAULT">Safest Marketplace</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed font-body">
              EliteHub NG was founded with one mission: make buying and selling
              online safe, simple, and accessible for every Nigerian — whether
              you&apos;re in Lagos Island or a village in Anambra.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.06)]">
        <div className="section py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-3xl text-navy-DEFAULT">
                  {s.value}
                </p>
                <p className="text-navy-DEFAULT/55 text-sm font-body mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-6">Our Story</h2>
            <div className="space-y-4 text-navy-DEFAULT/65 text-base font-body leading-relaxed">
              <p>
                EliteHub NG was born out of frustration. Too many Nigerians
                were losing money to online scams, receiving wrong items, or
                simply never getting their orders at all.
              </p>
              <p>
                We built a platform where trust is the foundation — not an
                afterthought. Our escrow system holds every payment safely until
                the buyer confirms delivery. Sellers earn their reputation.
                Buyers are protected.
              </p>
              <p>
                Today, EliteHub NG connects tens of thousands of buyers and
                sellers across all 36 states and the FCT, with product
                categories spanning electronics, fashion, food, real estate,
                automobiles, and professional services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300"
              >
                <span className="text-3xl block mb-3">{v.icon}</span>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-sm mb-1.5">
                  {v.title}
                </h3>
                <p className="text-navy-DEFAULT/55 text-xs leading-relaxed font-body">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="section text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-navy-DEFAULT mb-4">
            Our Mission
          </h2>
          <p className="text-navy-DEFAULT/60 text-lg font-body leading-relaxed mb-8">
            To eliminate distrust from online commerce in Nigeria — one
            escrow-protected transaction at a time.
          </p>
          <ul className="text-left space-y-3 mb-10">
            {[
              "Zero tolerance for scammers and fake sellers",
              "Escrow protection on every single transaction",
              "Real delivery tracking — not just promises",
              "Dispute resolution that actually works",
              "Growing local businesses across Nigeria",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-navy-DEFAULT/75 font-body text-sm"
              >
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn-gold px-8 py-4 rounded-2xl text-base">
              Browse Products <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-ghost px-8 py-4 rounded-2xl text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="py-12 bg-[#F8F7F4]">
        <div className="section text-center">
          <p className="text-navy-DEFAULT/50 text-sm font-body">
            📍 589 Thailand Street, Efab Queens, Karsana, Abuja, Nigeria &nbsp;|&nbsp;
            📞{" "}
            <a
              href="tel:+2348140002708"
              className="text-gold-DEFAULT hover:underline"
            >
              +234 814 000 2708
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}