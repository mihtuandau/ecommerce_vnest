import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

export function HeroBannerSkeleton() {
  return (
    <div className="relative h-[420px] md:h-[600px] lg:h-[750px] w-full overflow-hidden bg-brand-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 space-y-8">
          <Skeleton className="h-6 w-32 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-12 w-3/4 rounded-xl" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 rounded-full" />
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center relative">
          <Skeleton className="w-[450px] h-[450px] rounded-full" />
          <div className="absolute bottom-12 right-12 w-72 h-80 rounded-3xl bg-white shadow-xl p-4 border border-brand-sand/40">
             <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ variant }: { variant: "featured" | "bestseller" | "toprated" }) {
  if (variant === "featured") {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }
  if (variant === "bestseller") {
    return (
      <div className="space-y-5 p-4 rounded-2xl border border-brand-sand/40 bg-white">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-5 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 rounded-2xl bg-white border border-brand-sand/40 flex gap-4">
      <Skeleton className="h-24 w-24 rounded-xl" />
      <div className="flex-1 space-y-3 py-1">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function ProductSectionSkeleton({ variant = "bestseller" }: { variant?: "featured" | "bestseller" | "toprated" }) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-80 rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
      <div className={cn(
        "grid gap-8",
        variant === "toprated" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
      )}>
        {Array.from({ length: variant === "toprated" ? 6 : 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export function FlashSaleSkeleton() {
  return (
    <div className="bg-brand-sand/10 rounded-4xl p-12 space-y-12">
      <div className="flex justify-between items-center">
        <div className="flex gap-12">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
          <div className="flex gap-2">
             <Skeleton className="h-12 w-12 rounded-xl" />
             <Skeleton className="h-12 w-12 rounded-xl" />
             <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 space-y-4 border border-brand-sand/40">
             <Skeleton className="aspect-square rounded-xl" />
             <Skeleton className="h-4 w-full rounded-full" />
             <Skeleton className="h-6 w-24 rounded-lg" />
             <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
