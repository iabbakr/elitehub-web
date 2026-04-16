"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function ProductSearch() {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get("search") || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(sp.get("search") || "");
  }, [sp]);

  const commit = (q: string) => {
    const params = new URLSearchParams(sp.toString());
    if (q.trim()) {
      params.set("search", q.trim());
    } else {
      params.delete("search");
    }
    params.delete("cursor");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleChange = (v: string) => {
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(v), 500);
  };

  return (
    <div className="relative w-full sm:w-72">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-DEFAULT/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (timerRef.current) clearTimeout(timerRef.current);
            commit(value);
          }
        }}
        placeholder="Search products…"
        className="input pl-10 pr-9 py-2.5 text-sm"
      />
      {value && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-DEFAULT/40 hover:text-navy-DEFAULT"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
