"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { HomeProductCard } from "@/features/products/components/customer/cards/HomeProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/utils/cn";

import { Product } from "@/types/models";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  variant?: "featured" | "bestseller" | "toprated";
  viewAllLink?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  icon: Icon,
  iconColor = "text-foreground",
  iconBg = "bg-slate-100",
  variant = "bestseller",
  viewAllLink,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tighter leading-[1.1]">
              {title}
            </h2>
            <p className="text-slate-400 text-xs md:text-base font-medium tracking-tight max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {viewAllLink && (
          <Button asChild variant="ghost" className="hidden md:flex rounded-full px-8 h-12 hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all group border border-slate-100">
            <Link href={viewAllLink} className="flex items-center gap-2">
              Xem tất cả <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        )}
      </div>

      <div className={cn(
        "grid gap-4 md:gap-8",
        variant === "toprated" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        {products.slice(0, variant === "toprated" ? 6 : 4).map((product) => (
          <HomeProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>

      {viewAllLink && (
        <div className="md:hidden pt-4">
          <Button asChild variant="outline" className="w-full rounded-full h-12 font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-600 bg-white shadow-sm">
            <Link href={viewAllLink}>Xem tất cả bộ sưu tập</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
