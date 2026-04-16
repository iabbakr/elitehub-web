import { ProductDetailSkeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)]">
        <div className="section py-3">
          <div className="h-4 w-48 bg-navy-DEFAULT/8 rounded shimmer" />
        </div>
      </div>
      <div className="section py-8">
        <div className="bg-white rounded-3xl overflow-hidden">
          <ProductDetailSkeleton />
        </div>
      </div>
    </div>
  );
}
