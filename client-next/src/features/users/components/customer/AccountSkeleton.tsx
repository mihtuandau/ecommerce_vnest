"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function AccountSkeleton() {
  return (
    <div className="bg-brand-cream min-h-screen pb-24 font-sans-brand">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span className="opacity-50 text-[10px]">›</span>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[256px_1fr] gap-8 items-start">
          
          <div className="w-full lg:w-64 bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-brand-sand/50 text-center bg-brand-ivory/20 flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full mb-4" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="p-4 space-y-6">
              {[1, 2, 3].map((g) => (
                <div key={g} className="space-y-3">
                  <Skeleton className="h-3 w-12 ml-2" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex-1 w-full space-y-8">
            <div className="bg-white border border-brand-sand rounded-[32px] p-8 shadow-sm">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
