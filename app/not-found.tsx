import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Big 404 */}
      <div className="relative mb-8">
        <span className="font-display text-[120px] sm:text-[180px] font-bold text-navy-DEFAULT/8 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gold-faint border border-gold-muted flex items-center justify-center text-5xl shadow-gold">
            📦
          </div>
        </div>
      </div>

      <h1 className="font-display text-3xl font-bold text-navy-DEFAULT mb-3">
        Page Not Found
      </h1>
      <p className="text-navy-DEFAULT/55 text-base font-body max-w-sm mb-8 leading-relaxed">
        This product or page has been moved, deleted, or never existed.
        Try searching for what you&apos;re looking for.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-gold px-8 py-3.5 rounded-2xl text-base">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <Link href="/products" className="btn-ghost px-8 py-3.5 rounded-2xl text-base">
          <Search size={18} />
          Browse Products
        </Link>
      </div>
    </div>
  );
}
