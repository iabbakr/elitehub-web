import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact EliteHub NG — Get in Touch",
  description:
    "Contact EliteHub NG for support, partnerships, or general enquiries. Reach us via phone, email, or visit our office in Abuja, Nigeria.",
  alternates: { canonical: "https://elitehubng.com/contact" },
};

const CHANNELS = [
  {
    icon: "📞",
    title: "Phone / WhatsApp",
    value: "+234 814 000 2708",
    sub: "Mon–Sat, 8am–8pm WAT",
    href: "tel:+2348140002708",
    cta: "Call Now",
  },
  {
    icon: "📧",
    title: "Email Support",
    value: "support@elitehubng.com",
    sub: "We reply within 24 hours",
    href: "mailto:support@elitehubng.com",
    cta: "Send Email",
  },
  {
    icon: "📍",
    title: "Head Office",
    value: "589 Thailand Street",
    sub: "Efab Queens, Karsana, Abuja, FCT",
    href: "https://maps.google.com/?q=Efab+Queens+Karsana+Abuja+Nigeria",
    cta: "Get Directions",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold-faint blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="section relative py-16 md:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-white/70">Contact</span>
          </nav>
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
              Get in{" "}
              <span className="text-gold-DEFAULT">Touch</span>
            </h1>
            <p className="text-white/65 text-base font-body leading-relaxed">
              Have a question, dispute, or partnership enquiry? Our team is here
              to help — reach out through any of the channels below.
            </p>
          </div>
        </div>
      </div>

      {/* Contact channels */}
      <section className="py-16">
        <div className="section">
          <div className="grid sm:grid-cols-3 gap-6 mb-14">
            {CHANNELS.map((ch) => (
              <div
                key={ch.title}
                className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300 flex flex-col gap-4"
              >
                <span className="text-4xl">{ch.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-1 font-body">
                    {ch.title}
                  </p>
                  <p className="font-display font-semibold text-navy-DEFAULT text-base">
                    {ch.value}
                  </p>
                  <p className="text-navy-DEFAULT/50 text-xs mt-0.5 font-body">
                    {ch.sub}
                  </p>
                </div>
                <a
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="btn-ghost px-5 py-2.5 text-sm w-fit"
                >
                  {ch.cta}
                </a>
              </div>
            ))}
          </div>

          {/* App download for fastest support */}
          <div className="bg-navy-gradient rounded-3xl px-8 md:px-14 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-faint blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Fastest Support: Use the App
              </h2>
              <p className="text-white/60 text-base font-body max-w-lg mx-auto mb-7">
                Disputes, order issues, and seller chats are handled in real time
                on the EliteHub NG mobile app. Download for the best support
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://apps.apple.com/app/elitehubng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-navy-DEFAULT font-semibold text-sm hover:bg-gray-100 transition-all font-body"
                >
                  🍎 App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.elitehubng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy-DEFAULT font-semibold text-sm hover:bg-gold-light transition-all font-body"
                >
                  🤖 Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="py-10 bg-white border-t border-[rgba(11,46,51,0.06)]">
        <div className="section text-center">
          <p className="text-navy-DEFAULT/50 text-sm font-body mb-4">
            Follow us for updates, promotions, and support
          </p>
          <div className="flex gap-4 justify-center">
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
                className="px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold hover:bg-gold-DEFAULT hover:text-navy-DEFAULT transition-all font-body"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}