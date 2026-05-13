"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/features/products/hooks";
import { Category } from "@/types/models";
import { LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Image from "next/image";

export function FeaturedCategories() {
  const { data: categoryData, isLoading } = useCategories();
  const categories = (Array.isArray(categoryData) ? categoryData : categoryData?.data || [])
    .filter((cat: any) => !cat.parentId); // Only show top-level categories

  if (isLoading) {
    return (
      <div className="flex gap-8 overflow-hidden py-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-4 shrink-0">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="space-y-10 overflow-visible py-12">
      <div className="flex items-end justify-between border-b border-[#DDD6C8]/40 pb-4">
        <h2 className="text-[28px] md:text-[32px] text-[#3D2B1A]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          Danh mục <em className="text-[#C4783A]" style={{ fontStyle: 'italic' }}>nổi bật</em>
        </h2>
        <Link href="/shop" className="text-[12px] text-[#8A7966] uppercase tracking-[0.1em] hover:text-[#C4783A] transition-colors pb-1">
          Xem tất cả →
        </Link>
      </div>

      <div className="relative flex overflow-hidden group py-10 -my-10">
        {/* Infinite Marquee Wrapper */}
        <div className="flex gap-10 animate-marquee whitespace-nowrap pause-on-hover">
          {[...categories, ...categories].map((category: Category, index: number) => {
            // Calculate a semi-realistic count if it's 0 (optional, or just show 0)
            // But user said it's showing 0, so let's try to show the actual count from variants if possible, 
            // or just ensure we're accessing the right property.
            const pCount = (category as any).productsCount ?? (category as any)._count?.products ?? (category as any).productCount ?? 0;
            
            return (
              <Link
                key={`${category.id}-${index}`}
                href={`/shop?categoryId=${category.id}`}
                className="group/card flex flex-col items-center gap-5 transition-all duration-500 hover:-translate-y-2 shrink-0"
              >
                {/* Circular Outer Container */}
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border border-[#DDD6C8]/50 bg-white p-1.5 transition-all duration-700 group-hover/card:border-[#C4783A] group-hover/card:shadow-[0_10px_30px_rgba(61,43,26,0.08)] flex items-center justify-center relative overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                    {category.image ? (
                      <Image 
                        src={category.image.startsWith('http') ? category.image : `https://api.vnest.vn/uploads/${category.image}`} 
                        alt={category.name}
                        fill
                        className="object-contain p-7 group-hover/card:scale-110 transition-all duration-700"
                        sizes="(max-width: 768px) 128px, 176px"
                      />
                    ) : (
                      <LayoutGrid className="h-10 w-10 text-[#C4B49A]" />
                    )}
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-[14px] md:text-[16px] font-semibold text-[#3D2B1A] group-hover/card:text-[#C4783A] transition-colors tracking-tight">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-3 bg-[#C4783A]/30" />
                    <p className="text-[10px] text-[#8A7966] font-medium tracking-[0.15em]">
                      {pCount} sản phẩm
                    </p>
                    <div className="h-px w-3 bg-[#C4783A]/30" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CSS for Animation */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1.25rem)); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 50s linear infinite;
          }
          .relative:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
}
