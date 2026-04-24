"use client";

import React from "react";
import { Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

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
  const subtotal = orderAny.subtotal || (totalAmount - shippingFee + discountAmount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-400" /> Danh sách sản phẩm
        </h3>
      </div>
      <div className="divide-y divide-slate-100">
          {items && items.length > 0 ? (
            items.map((item: any) => (
              <div key={item.id} className="p-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                   <img 
                     src={item.variant?.product?.images?.[0]?.url || item.variantSnapshot?.image || "/placeholder.png"} 
                     alt={item.productName || "Sản phẩm"} 
                     className="h-full w-full object-cover" 
                   />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{item.productName || item.variant?.product?.name || "Sản phẩm"}</p>
                   <div className="flex items-center gap-2 mt-1.5">
                       {item.variant?.color && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Màu: {item.variant.color}</span>}
                       {item.variant?.size && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Size: {item.variant.size}</span>}
                       <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">x{item.quantity}</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-slate-900 text-sm">{formatCurrency(item.price)}</p>
                   <p className="text-[10px] text-slate-400 font-medium">Tổng: {formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 italic">Không có thông tin sản phẩm</div>
          )}
      </div>
      
      <div className="p-6 bg-slate-50/30 border-t border-slate-100 space-y-2">
         <div className="flex justify-between text-sm text-slate-500">
            <span>Tạm tính</span>
            <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span>
         </div>
         <div className="flex justify-between text-sm text-slate-500">
            <span>Phí vận chuyển</span>
            <span className="font-semibold text-slate-700">{formatCurrency(shippingFee)}</span>
         </div>
         {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
                <span>Giảm giá</span>
                <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
            </div>
         )}
         <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">Tổng cộng</span>
            <span className="font-bold text-xl text-primary">{formatCurrency(totalAmount)}</span>
         </div>
      </div>
    </div>
  );
}
