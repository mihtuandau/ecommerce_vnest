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
  iconBg = "bg-brand-ivory",
  variant = "bestseller",
  viewAllLink,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[30px] text-brand-espresso font-serif font-semibold">
            {title.split(" ")[0]}{" "}
            <em className="text-brand-accent" style={{ fontStyle: "italic" }}>
              {title.split(" ").slice(1).join(" ") || title}
            </em>
          </h2>
          <p className="text-brand-taupe text-sm mt-2 max-w-md leading-relaxed">
            {subtitle}
          </p>
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="hidden md:flex items-center gap-1 text-[13px] text-[#8B6F47] border-b border-brand-sand pb-0.5 hover:text-brand-accent hover:border-brand-accent transition-colors"
          >
            Xem tất cả <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div
        className={cn(
          "grid gap-4 md:gap-6",
          variant === "toprated"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {products.slice(0, variant === "toprated" ? 6 : 4).map((product) => (
          <HomeProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>

      {viewAllLink && (
        <div className="md:hidden pt-4">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full h-12 font-medium text-sm border-brand-sand text-brand-espresso bg-white hover:bg-brand-ivory hover:border-brand-sand transition-all"
          >
            <Link href={viewAllLink}>Xem tất cả bộ sưu tập</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
