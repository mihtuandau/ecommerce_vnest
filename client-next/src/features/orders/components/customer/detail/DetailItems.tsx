"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { OrderStatus } from "@/types/enums";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderItem } from "@/types/models";

interface DetailItemsProps {
  orderItems: OrderItem[];
  total: number;
  shippingFee: number;
  discountAmount: number;
  status?: string;
  orderId?: number;
}

export function DetailItems({ 
  orderItems, 
  total, 
  shippingFee, 
  discountAmount,
  status,
  orderId
}: DetailItemsProps) {
  const [selectedItem, setSelectedItem] = React.useState<OrderItem | null>(null);

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 tracking-wider">
          Danh sách sản phẩm
        </h3>
      </div>
      <div className="divide-y divide-slate-50">
        {orderItems?.map((item) => (
          <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-14 w-14 rounded-lg bg-slate-50 p-1.5 border border-slate-100 shrink-0">
                <img
                  src={(() => {
                    const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
                    const path = (item.variantSnapshot as { image?: string })?.image || getUrl(item.variant?.images?.[0]) || getUrl(item.variant?.product?.images?.[0]);
                    if (!path) return "/placeholder.png";
                    if (path.startsWith('http')) return path;
                    return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
                  })()}
                  alt={item.productName || item.variantSnapshot?.productName}
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
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-xs text-slate-500">
                    {item.variant?.color && <span>Màu: {item.variant.color}</span>}
                    {item.variant?.size && (
                      <span className="ml-3">Size: {item.variant.size}</span>
                    )}
                    <span className="ml-3 font-bold text-slate-900 sm:font-medium sm:text-slate-600">
                      x{item.quantity}
                    </span>
                  </p>
                  {status === OrderStatus.DELIVERED && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-3 rounded-xl text-amber-600 border-amber-200 hover:bg-amber-50 text-[10px] font-medium transition-all"
                      onClick={() => setSelectedItem(item)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1.5 text-amber-500" />
                      Đánh giá
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
               <div className="flex flex-col sm:items-end">
                 <span className="text-sm font-bold text-slate-900">
                   {formatCurrency(item.price)}
                 </span>
                 {(() => {
                   const snapshottedOriginal = Number(item.originalPrice);
                   const currentVariantPrice = Number(item.variant?.price);
                   const productOriginal = Number(item.variant?.product?.originalPrice);
                   const paidPrice = Number(item.price);
                   
                   let displayOriginalPrice = 0;
                   
                   if (snapshottedOriginal && snapshottedOriginal > paidPrice) {
                     displayOriginalPrice = snapshottedOriginal;
                   } else if (currentVariantPrice && currentVariantPrice > paidPrice) {
                     displayOriginalPrice = currentVariantPrice;
                   } else if (productOriginal && productOriginal > paidPrice) {
                     displayOriginalPrice = productOriginal;
                   }

                   if (displayOriginalPrice > 0) {
                     return (
                       <span className="text-[10px] text-slate-400 line-through font-medium">
                         {formatCurrency(displayOriginalPrice)}
                       </span>
                     );
                   }
                   return null;
                 })()}
               </div>
               <span className="text-[11px] font-medium text-slate-400 sm:hidden">
                 x{item.quantity}
               </span>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        productId={Number(selectedItem?.variant?.productId || selectedItem?.productId)}
        orderId={orderId || 0}
        productName={selectedItem?.productName || selectedItem?.variant?.product?.name || ""}
        productImage={(() => {
          const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
          const path = (selectedItem?.variantSnapshot as { image?: string })?.image || getUrl(selectedItem?.variant?.images?.[0]) || getUrl(selectedItem?.variant?.product?.images?.[0]);
          if (!path) return "/placeholder.png";
          if (path.startsWith('http')) return path;
          return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
        })()}
      />

      <div className="bg-slate-50/20 p-6 border-t border-slate-50 flex justify-end">
        <div className="w-full max-w-[280px] space-y-2.5">
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
