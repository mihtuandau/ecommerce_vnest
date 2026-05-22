"use client";

import Link from "next/link";
import { Clock, Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

export interface OfferVoucher {
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

interface VoucherCardProps {
  voucher: OfferVoucher;
}

export function VoucherCard({ voucher }: VoucherCardProps) {
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
      <div className="w-full sm:w-44 shrink-0 bg-slate-50 flex flex-col items-center justify-center py-8 px-4 border-b sm:border-b-0 sm:border-r border-dashed border-slate-200 relative">
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
          <button
            type="button"
            onClick={() => copyToClipboard(voucher.code)}
            className="w-full sm:w-auto bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-4 cursor-pointer"
          >
            <div className="space-y-0.5 text-left">
              <p className="text-xs text-slate-400 font-normal leading-none">
                Mã ưu đãi
              </p>
              <code className="text-sm font-bold text-slate-700 tracking-widest uppercase">
                {voucher.code}
              </code>
            </div>
            <Copy size={14} className="text-slate-300" />
          </button>

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
