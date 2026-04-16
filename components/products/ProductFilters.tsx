"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCategory } from "@/lib/products";

const CATEGORIES = [
  "Phones_Tablets", "Laptops_Computers", "TV_Audio_Gaming", "Cameras_Optics",
  "Womens_Fashion", "Mens_Fashion", "Babies_Kids", "Beauty_Personal_Care",
  "Home_Appliances", "Furniture", "Home_Decor", "Kitchen_Dining",
  "Fruits_Vegetables", "Meat_Fish_Poultry", "Rice_Beans_Grains", "Beverages",
  "Packaged_Snacks_Condiments", "Health_Medical", "Vehicles_Cars",
  "Commercial_Heavy_Duty", "Motorcycles_Powersports", "Auto_Parts_Care",
  "Real_Estate", "Industrial_Business", "Sports_Hobbies", "Garden_Outdoor",
  "Pets_Animals", "Other",
];

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "popular",    label: "Most Popular" },
];

export default function ProductFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(sp.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("cursor"); // reset pagination on filter change
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, sp]);

  const clearAll = useCallback(() => {
    const search = sp.get("search");
    router.push(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
  }, [router, sp]);

  const activeCount = ["category", "state", "condition", "minPrice", "maxPrice", "sort"]
    .filter((k) => sp.has(k)).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-widest mb-2 font-body">Sort By</label>
        <select
          value={sp.get("sort") || "newest"}
          onChange={(e) => update("sort", e.target.value === "newest" ? null : e.target.value)}
          className="input text-sm py-2"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-widest mb-2 font-body">Category</label>
        <select
          value={sp.get("category") || ""}
          onChange={(e) => update("category", e.target.value || null)}
          className="input text-sm py-2"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{formatCategory(c)}</option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-widest mb-2 font-body">Location</label>
        <select
          value={sp.get("state") || ""}
          onChange={(e) => update("state", e.target.value || null)}
          className="input text-sm py-2"
        >
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-widest mb-2 font-body">Condition</label>
        <div className="flex gap-2">
          {["Brand New", "Used"].map((c) => (
            <button
              key={c}
              onClick={() => update("condition", sp.get("condition") === c ? null : c)}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all font-body border",
                sp.get("condition") === c
                  ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                  : "bg-white border-navy-DEFAULT/15 text-navy-DEFAULT/60 hover:border-gold-muted"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-widest mb-2 font-body">Price (₦)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={sp.get("minPrice") || ""}
            onBlur={(e) => update("minPrice", e.target.value || null)}
            className="input text-sm py-2 w-1/2"
          />
          <span className="text-navy-DEFAULT/40 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={sp.get("maxPrice") || ""}
            onBlur={(e) => update("maxPrice", e.target.value || null)}
            className="input text-sm py-2 w-1/2"
          />
        </div>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors font-body flex items-center justify-center gap-2"
        >
          <X size={14} />
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start">
        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.08)] p-5 shadow-sm">
          <h2 className="font-display font-semibold text-navy-DEFAULT mb-5">Filters</h2>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT text-sm font-medium shadow-sm font-body"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold-DEFAULT text-navy-DEFAULT text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Mobile sheet */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <div className="absolute inset-0 bg-navy-deep/70" onClick={() => setMobileOpen(false)} />
            <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="font-display font-semibold text-navy-DEFAULT">Filters</h2>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full bg-gray-100">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <FilterContent />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold w-full py-3.5 mt-4 rounded-2xl text-base"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
