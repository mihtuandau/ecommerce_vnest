"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

interface DetailItemsProps {
  orderItems: any[];
  total: number;
  shippingFee: number;
  discountAmount: number;
}

export function DetailItems({ orderItems, total, shippingFee, discountAmount }: DetailItemsProps) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Danh sách sản phẩm
        </h3>
      </div>
      <div className="divide-y divide-slate-50">
        {orderItems?.map((item: any) => (
          <div key={item.id} className="p-4 flex items-center gap-4 group">
            <div className="h-14 w-14 rounded-lg bg-slate-50 p-1.5 border border-slate-100 shrink-0">
              <img
                src={
                  item.variant?.product?.images?.[0]?.url ||
                  item.variant?.images?.[0]?.url ||
                  "/placeholder.png"
                }
                alt={item.productName}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${item.variant?.product?.slug}`}
                className="text-sm font-medium text-slate-700 hover:text-primary transition-colors block truncate"
              >
                {item.productName || item.variant?.product?.name}
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                {item.variant?.color && <span>Màu: {item.variant.color}</span>}
                {item.variant?.size && (
                  <span className="ml-3">Size: {item.variant.size}</span>
                )}
                <span className="ml-3 font-medium text-slate-600">
                  x{item.quantity}
                </span>
              </p>
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {formatCurrency(item.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/20 p-6 border-t border-slate-50 flex justify-end">
        <div className="w-full max-w-[240px] space-y-2.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Tạm tính</span>
            <span className="font-medium text-slate-700">
              {formatCurrency(total - (shippingFee || 0) + (discountAmount || 0))}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-slate-700">
              +{formatCurrency(shippingFee || 0)}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600">
              <span>Giảm giá</span>
              <span className="font-medium">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-slate-800">Tổng cộng</span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
