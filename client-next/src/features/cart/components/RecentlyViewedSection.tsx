import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";

interface RecentlyViewedSectionProps {
  recentlyViewed: any[];
}

export function RecentlyViewedSection({ recentlyViewed }: RecentlyViewedSectionProps) {
  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mt-20 border-t border-brand-sand/50 pt-16">
      <h3 className="text-xl font-bold text-brand-espresso font-serif mb-10 flex items-center gap-4">
        Bạn đã{" "}
        <span className="text-brand-accent italic font-medium">xem gần đây</span>
        <div className="h-[1px] flex-1 bg-brand-sand/30" />
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {recentlyViewed.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
