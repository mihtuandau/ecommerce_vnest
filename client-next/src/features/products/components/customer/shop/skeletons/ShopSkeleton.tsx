import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ShopSkeleton() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="bg-white border-b border-brand-sand/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
            <Skeleton className="h-12 w-80 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-sand/40 pb-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64 rounded-2xl" />
              <Skeleton className="h-4 w-48 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-80 rounded-2xl" />
              <Skeleton className="h-12 w-24 rounded-2xl" />
            </div>
          </div>
          <div className="flex items-center justify-between">
             <Skeleton className="h-5 w-40 rounded-full" />
             <Skeleton className="h-10 w-48 rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-10">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-[2rem] border border-brand-sand/40 shadow-sm p-6 space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(j => (
                      <Skeleton key={j} className="h-10 w-full rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-3 space-y-8">
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-brand-sand/40 overflow-hidden">
                  <Skeleton className="aspect-[4/5] w-full bg-brand-cream" />
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded-full" />
                      <Skeleton className="h-4 w-1/2 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-full rounded-xl" />
                    <div className="pt-4 border-t border-brand-ivory flex justify-between items-center">
                       <Skeleton className="h-6 w-20 rounded-full" />
                       <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
