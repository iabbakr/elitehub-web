"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";
import { FilterState } from "@/types";
import { cn } from "@/lib/utils";

interface LoadMoreButtonProps {
  currentFilters: Partial<FilterState> & { limit?: number };
  nextCursor: number;
}

export default function LoadMoreButton({ currentFilters, nextCursor }: LoadMoreButtonProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(() => {
      const params = new URLSearchParams(sp.toString());
      params.set("cursor", String(nextCursor));
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-gold-muted bg-gold-faint text-gold-DEFAULT font-semibold text-sm transition-all font-body",
        "hover:bg-gold-DEFAULT hover:text-navy-DEFAULT hover:shadow-gold hover:border-gold-DEFAULT",
        isPending && "opacity-60 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Loading…
        </>
      ) : (
        <>
          <ChevronDown size={16} />
          Load More Products
        </>
      )}
    </button>
  );
}
