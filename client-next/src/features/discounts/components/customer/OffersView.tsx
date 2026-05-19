"use client";

import React, { useState } from "react";
import { useDiscounts } from "@/features/discounts/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { Ticket, Copy, ChevronLeft, Tag, Clock, Sparkles, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";

// ── Voucher Card (Still & Minimalist) ───────────────────────────

interface OfferVoucher {
  id: string | number;
  code: string;
  name?: string;
  description?: string;
  percentage?: number;
  fixedAmount?: number;
  minOrderValue?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  type?: string;
  value?: number;
}

function VoucherCard({ voucher }: { voucher: OfferVoucher }) {
  const { success } = useToast();

  const copyToClipboard = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    success(`Đã sao chép mã ${code}`);
  };

  const isExpired = voucher.endDate ? new Date(voucher.endDate) < new Date() : false;
  const isActive =
    voucher.isActive && new Date(voucher.startDate) <= new Date() && !isExpired;

  const displayValue =
    voucher.type === "PERCENTAGE" || voucher.percentage
      ? `${voucher.percentage || voucher.value}%`
      : formatCurrency(voucher.fixedAmount || voucher.value || 0);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden relative h-full transition-all duration-300 hover:shadow-md cursor-pointer",
        !isActive && "opacity-60 grayscale pointer-events-none"
      )}
    >
      {/* Left Section */}
      <div className="w-full sm:w-44 shrink-0 bg-slate-50 flex flex-col items-center justify-center py-8 px-4 border-b sm:border-b-0 sm:border-r border-dashed border-slate-200 relative">
        {/* Simple ticket cutouts */}
        <div className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-full border border-slate-200 hidden sm:block" />
        <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-full border border-slate-200 hidden sm:block" />

        <div className="bg-white p-3 rounded-2xl border border-slate-100 mb-3">
          <Gift size={24} className="text-primary" />
        </div>
        <p className="text-xs text-slate-500 font-semibold mb-1">Giảm ngay</p>
        <span className="text-3xl font-bold text-slate-900 tracking-tighter">
          {displayValue}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {voucher.name || `Ưu đãi LUXE - Giảm ${displayValue}`}
              </h3>
              <p className="text-sm text-slate-500 font-normal mt-1.5 line-clamp-2">
                {voucher.description ||
                  "Áp dụng cho khách hàng của LUXE. Tiết kiệm ngay khi thanh toán đơn hàng hợp lệ."}
              </p>
            </div>
            <div className="bg-slate-50 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-100 whitespace-nowrap font-semibold">
              {voucher.percentage ? "Phần trăm" : "Trực tiếp"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {(voucher.minOrderValue || 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-slate-500">
                  Đơn từ{" "}
                  <span className="font-bold text-slate-900">
                    {formatCurrency(voucher.minOrderValue || 0)}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock size={12} />
              <span className="text-xs font-medium">
                Hết hạn:{" "}
                {voucher.endDate
                  ? new Date(voucher.endDate).toLocaleDateString("vi-VN")
                  : "Vô hạn"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Code Block (No hover shadow/color change) */}
          <div
            onClick={() => copyToClipboard(voucher.code)}
            className="w-full sm:w-auto bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-4 cursor-pointer"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400 font-normal leading-none">
                Mã ưu đãi
              </p>
              <code className="text-sm font-bold text-slate-700 tracking-widest uppercase">
                {voucher.code}
              </code>
            </div>
            <Copy size={14} className="text-slate-300" />
          </div>

          <Button
            asChild
            className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary text-white font-semibold text-sm shadow-none"
          >
            <Link href="/shop">Dùng ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────

export function OffersView() {
  const { data: discountsData, isLoading } = useDiscounts({ limit: 100 });
  const router = useRouter();

  const rawData = React.useMemo(() => {
    if (!discountsData) return [];
    const body = discountsData as any;
    const items = Array.isArray(body) ? body : body.data || [];
    return items as OfferVoucher[];
  }, [discountsData]);

  const vouchers = rawData.filter((d: OfferVoucher) => d.code);

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
      {/* ── Minimalist Hero (No decorative SVGs) ── */}
      <section className="bg-primary relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div className="flex items-start md:items-center gap-4">
              <button
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
                <p className="text-xs text-white/60 font-semibold mb-1">Trạng thái</p>
                <p className="text-lg font-bold text-white whitespace-nowrap">
                  {vouchers.length} Vouchers khả dụng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {!vouchers.length ? (
          <div className="py-24 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Gift className="h-8 w-8 text-slate-200" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl">Sắp có ưu đãi mới</h3>
            <p className="text-slate-400 text-sm">
              Quay lại sau để không bỏ lỡ deal hời bạn nhé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {vouchers.map((voucher: OfferVoucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
