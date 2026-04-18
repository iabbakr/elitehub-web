import type { Metadata } from "next";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Guidelines — How to Sell on EliteHub NG",
  description:
    "Read EliteHub NG's seller guidelines. Learn what you can sell, how to list products correctly, and how to maintain your verified seller status.",
  alternates: { canonical: "https://elitehubng.com/seller-guidelines" },
};

const DOS = [
  "List only items you physically have in stock",
  "Use clear, accurate photos of the actual item",
  "Describe condition honestly (Brand New or Used)",
  "Set realistic delivery timelines you can meet",
  "Respond to buyer messages within 24 hours",
  "Ship orders within 48 hours of payment confirmation",
  "Package items securely to prevent damage in transit",
  "Update stock count immediately when items sell",
];

const DONTS = [
  "List counterfeit, fake, or pirated products",
  "Misrepresent item condition or specifications",
  "Use stock photos that don't reflect actual item",
  "Collect payment outside the EliteHub escrow system",
  "Ignore buyer disputes or support requests",
  "List prohibited items (see list below)",
  "Create multiple accounts to circumvent bans",
  "Manipulate reviews or ratings dishonestly",
];

const PROHIBITED = [
  "Illegal drugs, narcotics, or paraphernalia",
  "Firearms, ammunition, and unlicensed weapons",
  "Stolen or illegally obtained goods",
  "Counterfeit currency or documents",
  "Live animals (unless licensed and compliant)",
  "Prescription medication without valid licence",
  "Pirated software, music, or movies",
  "Items that violate Nigerian law",
];

export default function SellerGuidelinesPage() {
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
            <span className="text-white/70">Seller Guidelines</span>
          </nav>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
              🏪 Seller Standards
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              Selling on EliteHub NG —{" "}
              <span className="text-gold-DEFAULT">The Right Way</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed font-body">
              Our platform only works when sellers are trustworthy. These
              guidelines help you build a great reputation and protect buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Dos and Donts */}
      <section className="py-16 bg-white">
        <div className="section grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-5 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={22} /> What You Should Do
            </h2>
            <div className="space-y-3">
              {DOS.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-sm text-navy-DEFAULT/80 font-body leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-5 flex items-center gap-2">
              <XCircle className="text-red-500" size={22} /> What You Must Not Do
            </h2>
            <div className="space-y-3">
              {DONTS.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                  <span className="text-sm text-navy-DEFAULT/80 font-body leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited items */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-2 text-center">
            🚫 Prohibited Items
          </h2>
          <p className="text-navy-DEFAULT/55 text-sm font-body text-center mb-8">
            Listing any of the following will result in immediate account
            suspension.
          </p>
          <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] overflow-hidden">
            {PROHIBITED.map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-body text-navy-DEFAULT/75 ${
                  i !== PROHIBITED.length - 1 ? "border-b border-[rgba(11,46,51,0.06)]" : ""
                }`}
              >
                <span className="text-red-500 shrink-0">⛔</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className="py-12 bg-white">
        <div className="section max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-navy-DEFAULT mb-4">
            Enforcement
          </h2>
          <p className="text-navy-DEFAULT/60 text-base font-body leading-relaxed mb-4">
            Violations of these guidelines result in warnings, listing removal,
            account suspension, or permanent bans — depending on severity. Repeat
            offenders are permanently removed.
          </p>
          <p className="text-navy-DEFAULT/50 text-sm font-body mb-8">
            Questions about these guidelines?{" "}
            <a href="/contact" className="text-gold-DEFAULT hover:underline font-semibold">
              Contact our Seller Support team.
            </a>
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.elitehubng"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex"
          >
            Start Selling on EliteHub NG <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}