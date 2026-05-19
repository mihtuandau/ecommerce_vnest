"use client";

import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface ItemsProps {
  order: any;
}

export function Items({ order }: ItemsProps) {
  const orderAny = order as any;
  const orderItems = orderAny.orderItems || orderAny.items || [];
  const items = Array.isArray(orderItems) ? orderItems : [];

  const totalAmount = orderAny.total || orderAny.totalAmount || 0;
  const shippingFee = orderAny.shippingFee || 0;
  const discountAmount = orderAny.discountAmount || 0;
  const subtotal = orderAny.subtotal || totalAmount - shippingFee + discountAmount;

  return (
    <div className={cn(adminUI.card.base, "overflow-hidden p-0")}>
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className={cn(adminUI.typography.sectionTitle, "flex items-center gap-2")}>
          <Package className="h-5 w-5 text-slate-500" /> Danh sách sản phẩm
        </h3>
      </div>
      <div className="overflow-x-auto">
        {items && items.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-6 py-3 border-b border-slate-200 bg-slate-50/50 text-left">
                  Sản phẩm
                </th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-4 py-3 border-b border-slate-200 bg-slate-50/50 text-center">
                  SL
                </th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-4 py-3 border-b border-slate-200 bg-slate-50/50 text-right">
                  Đơn giá
                </th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-6 py-3 border-b border-slate-200 bg-slate-50/50 text-right">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => {
                let variant = item.variantSnapshot || item.variant;
                if (typeof variant === "string") {
                  try {
                    variant = JSON.parse(variant);
                  } catch (e) {}
                }
                const color = variant?.color || "";
                const size = variant?.size || "";
                const imageSrc =
                  variant?.image ||
                  variant?.images?.[0]?.url ||
                  variant?.product?.images?.[0]?.url ||
                  "/placeholder.png";
                const productName =
                  item.productName ||
                  variant?.productName ||
                  variant?.product?.name ||
                  "Sản phẩm";

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-12 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden relative">
                          <Image
                            src={imageSrc}
                            alt={productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[13.5px] leading-snug">
                            {productName}
                          </p>
                          {(color || size) && (
                            <p className="text-[11.5px] text-slate-500 mt-0.5">
                              {[color, size].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-middle text-center text-[13px] text-slate-600">
                      ×{item.quantity}
                    </td>
                    <td className="py-4 px-4 align-middle text-right text-[14px] font-serif font-bold text-slate-800">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-4 px-6 align-middle text-right text-[14px] font-serif font-bold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-slate-500 italic border-b border-slate-100">
            Không có thông tin sản phẩm
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-col gap-2.5 max-w-sm ml-auto">
          <div className="flex justify-between text-[13px]">
            <span className="text-slate-500">Tạm tính</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {shippingFee > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Phí vận chuyển</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(shippingFee)}
              </span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Giảm giá</span>
              <span className="font-medium text-rose-600">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-slate-800">Tổng cộng</span>
            <span className="text-[22px] font-serif font-bold text-slate-800 tracking-tight leading-none">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
