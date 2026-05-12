"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/features/products/hooks";
import { Category } from "@/types/models";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { cn } from "@/utils/cn";

import { motion } from "framer-motion";

export function FeaturedCategories() {
  const { data: categoryData, isLoading } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  // Duplicate categories for seamless loop
  const displayCategories = [...categories, ...categories, ...categories];

  return (
    <div className="space-y-12 md:space-y-16 py-4 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tighter leading-[1.1]">
              Danh mục <span className="text-primary/50">nổi bật</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-base font-normal tracking-tight max-w-xl leading-relaxed">
              Khám phá hệ sinh thái sản phẩm công nghệ và gia dụng thông minh tại Minh Tuấn Shop.
            </p>
          </div>
        </div>

        <Button asChild variant="ghost" className="hidden md:flex rounded-full px-8 h-12 hover:bg-slate-100 font-semibold text-xs text-slate-600 hover:text-slate-900 transition-all group border border-slate-100">
          <Link href="/shop" className="flex items-center gap-2">
            Xem tất cả <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Infinite Marquee Wrapper */}
      <div className="relative w-full overflow-hidden">
        {/* Faded edges for premium feel */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-8 md:gap-16 w-max"
          animate={{
            x: ["0%", "-33.33%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {displayCategories.map((category: Category, i: number) => (
            <Link
              key={`${category.id}-${i}`}
              href={`/shop?categoryId=${category.id}`}
              className="group flex flex-col items-center space-y-5 w-[140px] md:w-[180px] shrink-0"
            >
              {/* Circular Image Container */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-white border-2 border-slate-100 p-2 group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 relative">
                  {category.image ? (
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-115 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LayoutGrid className="h-10 w-10 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>

              {/* Label Below Circle */}
              <div className="text-center space-y-1.5 px-2">
                <h3 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {category.name}
                </h3>
                <div className="h-1 w-0 bg-primary mx-auto rounded-full group-hover:w-8 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
