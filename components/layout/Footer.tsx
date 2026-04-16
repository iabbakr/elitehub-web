import Link from "next/link";
import Image from "next/image";
import { Smartphone, Apple } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/utils";

const LINKS = {
  Marketplace: [
    { label: "All Products",       href: "/products" },
    { label: "Electronics",        href: "/products?category=Phones_Tablets" },
    { label: "Fashion",            href: "/products?category=Womens_Fashion" },
    { label: "Food & Groceries",   href: "/products?category=Fruits_Vegetables" },
    { label: "Automobiles",        href: "/products?category=Vehicles_Cars" },
    { label: "Services",           href: "/services" },
  ],
  Company: [
    { label: "About Us",           href: "/about" },
    { label: "Blog",               href: "/blog" },
    { label: "Careers",            href: "/careers" },
    { label: "Contact",            href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service",   href: "/terms" },
    { label: "Privacy Policy",     href: "/privacy" },
    { label: "Buyer Protection",   href: "/buyer-protection" },
    { label: "Seller Guidelines",  href: "/seller-guidelines" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white" id="download">
      {/* App Download CTA */}
      <div className="border-b border-white/10">
        <div className="section py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold-DEFAULT text-sm font-bold tracking-widest uppercase mb-3 font-body">
              Full Experience
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
              Download the EliteHub NG App
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-body max-w-md">
              Escrow-protected payments, real-time order tracking, wallet top-up,
              seller dashboard, dispute resolution — everything on your phone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-gold-muted transition-all group"
            >
              <Apple size={28} className="text-white shrink-0" />
              <div>
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-body">Download on the</p>
                <p className="text-white font-bold text-lg font-display leading-tight">App Store</p>
              </div>
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-gold-muted transition-all group"
            >
              <Smartphone size={28} className="text-white shrink-0" />
              <div>
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-body">Get it on</p>
                <p className="text-white font-bold text-lg font-display leading-tight">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="section py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand - UPDATED WITH LOGO IMAGE */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            {/* Logo Icon with White Background */}
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(201,168,76,0.3)] shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="EliteHub NG"
                width={36}
                height={36}
                className="w-full h-full object-contain p-1"
              />
            </div>
            {/* Logo Text */}
            <span className="font-display font-bold text-white text-xl">
              Elite<span className="text-gold-DEFAULT">Hub</span>
              <span className="text-white/50 ml-1 text-base font-body font-normal">NG</span>
            </span>
          </div>
          
          <p className="text-white/50 text-sm leading-relaxed font-body">
            Nigeria&apos;s trusted marketplace — connecting buyers, sellers and service providers with escrow-protected payments.
          </p>
          
          {/* Trust badges */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {["🔒 Escrow Safe", "✅ Verified Sellers", "⚡ Fast Delivery"].map((b) => (
              <span key={b} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60 font-body">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Link groups */}
        {Object.entries(LINKS).map(([group, links]) => (
          <div key={group}>
            <h3 className="text-white font-semibold text-sm mb-4 font-body">{group}</h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-gold-DEFAULT text-sm transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs font-body">
            © {new Date().getFullYear()} EliteHub NG. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "Instagram", "Facebook"].map((s) => (
              <a
                key={s}
                href={`https://${s.toLowerCase()}.com/elitehubng`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/35 hover:text-gold-DEFAULT text-xs transition-colors font-body"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
