"use client";

import React from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  X,
  User,
  Ticket,
  Wallet,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { UseFormReturn } from "react-hook-form";

interface OrderCartProps {
  orderId: number | null;
  items: any[];
  onRemoveAll: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  form: UseFormReturn<any>;
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedDiscount: any;
  isValidatingDiscount: boolean;
  onValidateDiscount: (code: string) => void;
  isSubmitting: boolean;
}

export function OrderCart({
  orderId,
  items,
  onRemoveAll,
  onUpdateQuantity,
  onRemoveItem,
  form,
  subtotal,
  discountAmount,
  total,
  appliedDiscount,
  isValidatingDiscount,
  onValidateDiscount,
  isSubmitting,
}: OrderCartProps) {
  const paymentMethod = form.watch("paymentMethod");

  return (
    <div className="w-[360px] flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
          Đơn hàng #{orderId || "..."}
        </span>
        <button
          type="button"
          onClick={onRemoveAll}
          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 uppercase"
        >
          <Trash2 className="h-3 w-3" /> Xóa sạch
        </button>
      </div>

      {/* Cart List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-400">
            <ShoppingCart className="h-10 w-10 mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Đang chờ món...
            </p>
          </div>
        ) : (
          items.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 relative shadow-sm"
            >
              <div className="h-10 w-10 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-50 relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="h-full w-full object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px]">
                    IMG
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[11px] font-bold text-slate-900 truncate pr-6 leading-tight"
                  title={item.productName.split("(")[0].trim()}
                >
                  {item.productName.split("(")[0].trim()}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                    {item.productName.match(/\(([^)]+)\)/)?.[1] || "Mặc định"}
                  </span>
                  <span className="text-xs font-black text-primary">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(index, -1)}
                  className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-slate-900"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-[10px] font-bold text-slate-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(index, 1)}
                  className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-slate-900"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="absolute right-1 top-1 h-6 w-6 flex items-center justify-center text-slate-200 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-4 border-t border-slate-100 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 gap-2">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <Input
              placeholder="Số điện thoại khách hàng"
              {...form.register("guestPhone")}
              className="h-9 pl-8 bg-slate-50 border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <Input
                placeholder="Mã giảm giá"
                {...form.register("discountCode")}
                className="h-9 pl-8 bg-slate-50 border-slate-200 rounded-lg text-xs"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => onValidateDiscount(form.getValues("discountCode"))}
              disabled={isValidatingDiscount || !form.watch("discountCode")}
              className="h-9 px-3 bg-slate-900 text-white text-[10px] font-bold uppercase"
            >
              {isValidatingDiscount ? <Spinner size="sm" variant="white" /> : "Áp dụng"}
            </Button>
          </div>
        </div>

        <div className="pt-1 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            <span>Tạm tính</span>
            <span className="text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
              <span>Giảm giá ({appliedDiscount?.code})</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase">Tổng trả</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "CASH", label: "Tiền mặt", icon: Wallet },
            { id: "BANK_TRANSFER", label: "C.Khoản", icon: QrCode },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => form.setValue("paymentMethod", m.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1",
                paymentMethod === m.id
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <m.icon className="h-4 w-4" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? (
            <Spinner size="sm" variant="white" />
          ) : (
            "Xác nhận & In hóa đơn"
          )}
        </Button>
      </div>
    </div>
  );
}
