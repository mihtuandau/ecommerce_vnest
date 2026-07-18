"use client";

import React from "react";
import { HomeProductCard } from "@/features/products/components/customer/cards/HomeProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { SectionHeading } from "@/features/home/components/customer/shared/SectionHeading";

import { Product } from "@/types/models";

interface ProductSectionProps {
  index?: number;
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle: string;
  products: Product[];
  variant?: "featured" | "bestseller" | "toprated";
  viewAllLink?: string;
}

export function ProductSection({
  index,
  eyebrow,
  title,
  accent,
  subtitle,
  products,
  variant = "bestseller",
  viewAllLink,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="space-y-3">
        <SectionHeading
          index={index}
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          viewAllLink={viewAllLink}
        />
        <p className="text-brand-taupe text-sm max-w-md leading-relaxed">
          {subtitle}
        </p>
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
