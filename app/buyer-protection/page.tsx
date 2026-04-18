import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Buyer Protection — EliteHub NG Escrow & Refund Policy",
  description:
    "EliteHub NG's buyer protection policy. Every purchase is escrow-protected. Your money is held safely until you confirm delivery. Full refund if anything goes wrong.",
  alternates: { canonical: "https://elitehubng.com/buyer-protection" },
};

const STEPS = [
  {
    n: "01",
    icon: "💳",
    title: "You Pay into Escrow",
    desc: "When you buy on EliteHub NG, your payment is held securely in escrow — never released directly to the seller at checkout.",
  },
  {
    n: "02",
    icon: "📦",
    title: "Seller Ships Your Order",
    desc: "The seller is notified and ships your item. You receive real-time tracking updates through the EliteHub NG app.",
  },
  {
    n: "03",
    icon: "✅",
    title: "You Confirm Safe Delivery",
    desc: "Once your item arrives and you're satisfied, you confirm delivery in the app. Only then does the seller receive payment.",
  },
  {
    n: "04",
    icon: "⚖️",
    title: "Dispute Resolution if Needed",
    desc: "Item wrong or damaged? Open a dispute in the app. Our team reviews the evidence and issues a refund where warranted.",
  },
];

const COVERED = [
  "Item never delivered",
  "Item significantly different from description",
  "Item arrived damaged",
  "Counterfeit or fake item",
  "Seller refuses to ship",
  "Wrong quantity received",
];

const NOT_COVERED = [
  "Change of mind after delivery confirmed",
  "Minor colour/shade differences due to screen calibration",
  "Items where condition was accurately described",
  "Digital goods once accessed",
];

export default function BuyerProtectionPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-faint blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="section relative py-16 md:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Buyer Protection</span>
          </nav>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
              🔒 Escrow Protected
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              Your Money is Safe,{" "}
              <span className="text-gold-DEFAULT">Always</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed font-body">
              Every purchase on EliteHub NG is covered by our escrow protection.
              You never lose your money — it&apos;s held until you confirm safe
              delivery or we issue a refund.
            </p>
          </div>
        </div>
      </div>

      {/* How escrow works */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">How Our Escrow Works</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">
              Simple, transparent, and on your side.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.n} className="relative text-center group">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gold-faint border border-gold-muted flex items-center justify-center text-3xl group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-DEFAULT text-white text-[11px] font-bold flex items-center justify-center font-body">
                    {step.n.replace("0", "")}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-navy-DEFAULT/55 text-sm leading-relaxed font-body">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-5">
              ✅ What&apos;s Covered
            </h2>
            <div className="space-y-3">
              {COVERED.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </span>
                  <span className="text-sm text-navy-DEFAULT/80 font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-5">
              ❌ What&apos;s Not Covered
            </h2>
            <div className="space-y-3">
              {NOT_COVERED.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]"
                >
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 text-xs flex items-center justify-center shrink-0 font-bold">
                    ✕
                  </span>
                  <span className="text-sm text-navy-DEFAULT/80 font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Return window */}
      <section className="py-12 bg-white border-t border-[rgba(11,46,51,0.06)]">
        <div className="section max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-4">
            7-Day Return Window
          </h2>
          <p className="text-navy-DEFAULT/60 text-base font-body leading-relaxed mb-6">
            You have <strong>7 days</strong> after delivery to open a dispute if
            there&apos;s a problem with your order. After 7 days, payment is
            automatically released to the seller.
          </p>
          <p className="text-navy-DEFAULT/50 text-sm font-body">
            Questions?{" "}
            <a
              href="/contact"
              className="text-gold-DEFAULT hover:underline font-semibold"
            >
              Contact our support team
            </a>{" "}
            or open a dispute directly in the app.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#F8F7F4]">
        <div className="section text-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.elitehubng"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex"
          >
            Download the App to Shop Safely <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}