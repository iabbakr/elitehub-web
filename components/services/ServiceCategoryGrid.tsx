"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  name: string;
  label: string;
  icon: string;
  desc: string;
  count: string;
}

interface ServiceCategoryGridProps {
  categories: Category[];
}

export default function ServiceCategoryGrid({ categories }: ServiceCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/services/${cat.name}`}
          className="group text-left bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between mb-3">
            <span
              className="text-3xl group-hover:scale-110 transition-transform duration-300"
              aria-hidden
            >
              {cat.icon}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold-faint text-gold-DEFAULT font-semibold border border-gold-muted font-body">
              {cat.count}
            </span>
          </div>

          <h3 className="font-display font-semibold text-navy-DEFAULT text-sm mb-1">
            {cat.label}
          </h3>
          <p className="text-navy-DEFAULT/50 text-xs leading-relaxed font-body line-clamp-2">
            {cat.desc}
          </p>

          <div className="flex items-center gap-1 mt-3 text-gold-DEFAULT text-xs font-semibold font-body opacity-0 group-hover:opacity-100 transition-opacity">
            View Providers <ArrowRight size={12} />
          </div>
        </Link>
      ))}
    </div>
  );
}