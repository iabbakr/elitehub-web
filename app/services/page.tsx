import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Star, CheckCircle, Phone } from "lucide-react";
import ServiceCategoryGrid from "@/components/services/ServiceCategoryGrid";

export const metadata: Metadata = {
  title: "Find Service Providers in Nigeria | EliteHub NG",
  description:
    "Book plumbers, electricians, tailors, mechanics, tutors, cleaners and 40+ other services near you. Verified, rated, and available across Nigeria.",
  alternates: { canonical: "https://elitehubng.com/services" },
  openGraph: {
    title: "Find Trusted Service Providers Near You | EliteHub NG",
    description: "40+ categories. Verified professionals. Book instantly on the app.",
  },
};

const SERVICE_CATEGORIES = [
  { name: "Home_Repair_Maintenance", label: "Home Repair",         icon: "🔧", desc: "Plumbing, electrical, painting, roofing & more",    count: "2.4K+" },
  { name: "Cleaning_Services",       label: "Cleaning",            icon: "🧹", desc: "House, office, fumigation, post-construction",       count: "1.2K+" },
  { name: "Logistics_Transport",     label: "Logistics",           icon: "🚚", desc: "Delivery, relocation, haulage, private drivers",    count: "3.1K+" },
  { name: "Events_Entertainment",    label: "Events",              icon: "🎉", desc: "Planners, DJs, photographers, caterers, MCs",       count: "1.8K+" },
  { name: "Tech_Gadgets_Repair",     label: "Tech Repair",         icon: "💻", desc: "Phone, laptop, TV repair & installations",         count: "900+" },
  { name: "Automotive_Services",     label: "Automotive",          icon: "🚗", desc: "Mechanics, auto electricians, car wash, towing",   count: "1.1K+" },
  { name: "Education_Lessons",       label: "Tutors & Lessons",    icon: "📚", desc: "Home tutors, music, driving, coding lessons",      count: "2.0K+" },
  { name: "Health_Wellness",         label: "Health & Wellness",   icon: "💪", desc: "Fitness trainers, nurses, massage, nutritionists", count: "800+" },
  { name: "Business_Professional",   label: "Business & Legal",    icon: "💼", desc: "Designers, developers, lawyers, accountants",      count: "1.5K+" },
  { name: "Personal_Services",       label: "Beauty & Personal",   icon: "✂️", desc: "Tailors, hairstylists, makeup, barbering",         count: "3.2K+" },
  { name: "Real_Estate_Services",    label: "Real Estate",         icon: "🏢", desc: "Agents, facility managers, surveyors",             count: "600+" },
  { name: "Construction_Fabrication",label: "Construction",        icon: "🏗️", desc: "Welding, woodwork, tiling, POP, metalwork",        count: "1.0K+" },
];

const HOW_IT_WORKS = [
  { icon: "🔍", title: "Browse & Filter",  desc: "Search by category, location, and rating to find the right provider." },
  { icon: "📱", title: "Download the App", desc: "All bookings, payments, and chats happen securely in the EliteHub NG app." },
  { icon: "💬", title: "Chat & Book",      desc: "Contact the provider via WhatsApp or in-app chat. Agree on terms." },
  { icon: "✅", title: "Rate & Review",    desc: "After the job, rate your provider to help others make great choices." },
];

export default function ServicesPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
            🔧 12 Service Categories
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance max-w-3xl mx-auto">
            Find Trusted Service Providers{" "}
            <span className="text-gold-DEFAULT">Near You</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto mb-8 font-body leading-relaxed">
            Verified professionals across Nigeria — plumbers, electricians, tutors, delivery agents, makeup artists, and more.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["✅ Verified Providers", "⭐ Rated by Customers", "📍 Across Nigeria", "💬 WhatsApp Contact"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-body">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category grid */}
      <section className="py-14">
        <div className="section">
          <div className="mb-8">
            <h2 className="section-title mb-2">Browse by Category</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">
              Tap any category to view providers — full booking available on the app.
            </p>
          </div>
          <ServiceCategoryGrid categories={SERVICE_CATEGORIES} />
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-white">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy-DEFAULT mb-3">How It Works</h2>
            <p className="text-navy-DEFAULT/55 font-body max-w-lg mx-auto">
              Finding a trusted service provider has never been easier.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="text-center group">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gold-faint border border-gold-muted flex items-center justify-center text-3xl group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-DEFAULT text-white text-[11px] font-bold flex items-center justify-center font-body">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-navy-DEFAULT text-base mb-2">{step.title}</h3>
                <p className="text-navy-DEFAULT/55 text-sm leading-relaxed font-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-14 bg-[#F8F7F4]">
        <div className="section">
          <div className="bg-navy-gradient rounded-3xl px-8 md:px-14 py-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold-faint blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
                Ready to Book a Service?
              </h2>
              <p className="text-white/65 text-base font-body max-w-xl mx-auto mb-8">
                All bookings, payments, and provider chats happen in the EliteHub NG mobile app. Download free — takes 2 minutes.
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
        </div>
      </section>

      {/* For providers */}
      <section className="py-14 bg-white">
        <div className="section grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-gold mb-4">Are you a service provider?</span>
            <h2 className="font-display text-3xl font-bold text-navy-DEFAULT mb-4 text-balance">
              Grow Your Business with EliteHub NG
            </h2>
            <p className="text-navy-DEFAULT/60 text-base font-body leading-relaxed mb-6">
              Join thousands of service providers earning daily customers through EliteHub NG. Verified badge, profile, WhatsApp integration, and subscriber listing.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Get discovered by customers near you",
                "Share your portfolio and certifications",
                "Receive ratings and grow your reputation",
                "First year subscription at special rate",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-navy-DEFAULT/75 font-body">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://play.google.com/store/apps/details?id=com.elitehubng"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex"
            >
              Register as Provider <ArrowRight size={18} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "👤", label: "Active Providers",  value: "15,000+" },
              { icon: "⭐", label: "Avg. Rating",        value: "4.7 / 5" },
              { icon: "📍", label: "States Covered",    value: "37 States" },
              { icon: "💰", label: "Jobs Completed",    value: "200K+" },
            ].map((s) => (
              <div key={s.label} className="bg-[#F8F7F4] rounded-2xl p-5 border border-[rgba(11,46,51,0.06)]">
                <span className="text-3xl block mb-2">{s.icon}</span>
                <p className="font-display font-bold text-2xl text-navy-DEFAULT">{s.value}</p>
                <p className="text-navy-DEFAULT/50 text-xs mt-1 font-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
