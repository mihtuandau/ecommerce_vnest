"use client";

import React from "react";
import { Sparkles, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import { useAiReviewSummary } from "../../hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

interface ReviewAISummaryProps {
  productId: number;
}

export function ReviewAISummary({ productId }: ReviewAISummaryProps) {
  const { data, isLoading, error } = useAiReviewSummary(productId);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
      </div>
    ); 
  }

  if (error || !data) return null;

  const { pros = [], cons = [], verdict = "" } = data;
  const isNotEnoughData = pros.length === 0 && cons.length === 0;

  return (
    <div className="relative bg-white border border-slate-200 border-l-4 border-l-primary rounded-xl overflow-hidden mb-12 shadow-sm group hover:shadow-md transition-all">
      {/* Background Magic Glow - very subtle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles size={18} className="fill-primary/10" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight font-serif">Phân tích đánh giá bởi AI</h3>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {isNotEnoughData ? (
          <p className="text-sm text-slate-500 italic">
            {verdict}
          </p>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pros Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-semibold text-slate-500">Ưu điểm nổi bật</span>
                </div>
                <ul className="space-y-2.5">
                  {pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={16} />
                  <span className="text-xs font-semibold text-slate-500">Lưu ý hạn chế</span>
                </div>
                <ul className="space-y-2.5">
                  {cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="relative p-6 bg-primary/[0.02] rounded-xl border border-primary/5 border-l-2 border-l-primary">
              <div className="flex items-start gap-4">
                <Quote size={20} className="text-primary shrink-0 opacity-30" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary/70">Tổng kết từ AI</span>
                  <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed italic">
                    "{verdict}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
