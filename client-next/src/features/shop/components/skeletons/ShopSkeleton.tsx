import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ShopSkeleton() {
  return (
    <div className="bg-slate-50/30 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center gap-2 py-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full rounded-xl" />)}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-200/50 shadow-sm">
              <Skeleton className="h-8 w-40 rounded-xl" />
              <Skeleton className="h-8 w-48 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
