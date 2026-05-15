"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { MessageSquare, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types/enums";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { OrderItem } from "@/types/models";

interface DetailItemsProps {
  orderItems: OrderItem[];
  total: number;
  shippingFee: number;
  discountAmount: number;
  status?: string;
  orderId?: number;
  reviews?: any[];
}

export function DetailItems({ 
  orderItems, 
  total, 
  shippingFee, 
  discountAmount,
  status,
  orderId,
  reviews
}: DetailItemsProps) {
  const { user } = useAuthStore();

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <ShoppingBag size={14} className="text-blue-500" />
          Sản phẩm ({orderItems?.length})
        </h3>
      </div>
      
      <div className="divide-y divide-slate-50">
        {orderItems?.map((item: any) => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 group">
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0 flex items-center justify-center relative overflow-hidden">
                <Image
                  src={(() => {
                    const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
                    const path = (item.variantSnapshot as { image?: string })?.image || getUrl(item.variant?.images?.[0]) || getUrl(item.variant?.product?.images?.[0]);
                    if (!path) return "/placeholder.png";
                    if (path.startsWith('http')) return path;
                    return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
                  })()}
                  alt={item.productName || item.variantSnapshot?.productName || "Product"}
                  width={80}
                  height={80}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110 duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.variant?.product?.slug}`}
                  className="text-sm lg:text-base font-bold text-slate-900 hover:text-primary transition-colors block truncate"
                >
                  {item.productName || item.variant?.product?.name}
                </Link>
                
                <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500 font-medium">
                  {item.variant?.color && <span>Màu: {item.variant.color}</span>}
                  {item.variant?.color && item.variant?.size && <span className="text-slate-200">|</span>}
                  {item.variant?.size && <span>Size: {item.variant.size}</span>}
                </div>
                <div className="text-xs text-slate-400 font-bold mt-1">x{item.quantity}</div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {formatCurrency(item.price)}
                </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 lg:p-8 border-t border-slate-100 bg-slate-50/30">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Tạm tính</span>
              <span className="text-slate-900 font-bold">
                {formatCurrency(total - (shippingFee || 0) + (discountAmount || 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Phí vận chuyển</span>
              <span className="text-slate-900 font-bold">
                {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-bold">
                <span>Giảm giá</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900 tracking-tight">Tổng cộng</span>
            <span className="text-2xl font-bold text-blue-600 tabular-nums tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
