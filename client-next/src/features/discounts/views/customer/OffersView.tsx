"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Gift, Sparkles, Ticket } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDiscounts } from "@/features/discounts/hooks/queries/useDiscounts";
import {
  type OfferVoucher,
  VoucherCard,
} from "@/features/discounts/components/customer/offers/VoucherCard";

export function OffersView() {
  const { data: discountsData, isLoading } = useDiscounts({ limit: 100 });
  const router = useRouter();

  const vouchers = React.useMemo(() => {
    if (!discountsData) return [];
    const body = discountsData as any;
    const items = Array.isArray(body) ? body : body.data || [];
    return (items as OfferVoucher[]).filter((discount) => discount.code);
  }, [discountsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-48 rounded-none" />
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <section className="bg-primary relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div className="flex items-start md:items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0"
              >
                <ChevronLeft size={22} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={14} className="text-blue-100 fill-blue-100/20" />
                  <span className="text-white/80 text-xs font-semibold">
                    Ưu đãi độc quyền
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight truncate">
                  Mã giảm giá & Quà tặng
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 w-full md:w-auto">
              <Ticket className="text-white/40 shrink-0" size={24} />
              <div className="flex-1 md:flex-none">
                <p className="text-xs text-white/60 font-semibold mb-1">
                  Trạng thái
                </p>
                <p className="text-lg font-bold text-white whitespace-nowrap">
                  {vouchers.length} vouchers khả dụng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {!vouchers.length ? (
          <div className="py-24 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Gift className="h-8 w-8 text-slate-200" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl">
              Sắp có ưu đãi mới
            </h3>
            <p className="text-slate-400 text-sm">
              Quay lại sau để không bỏ lỡ deal hời bạn nhé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
