"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { OrderStatus } from "@/types/enums";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Chi tiết sản phẩm
        </h3>
        <span className="text-xs text-slate-400 font-medium">{orderItems?.length} sản phẩm</span>
      </div>
      
      <div className="divide-y divide-slate-50">
        {orderItems?.map((item: any) => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 group">
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-xl bg-slate-50/50 p-2 border border-slate-100 shrink-0 flex items-center justify-center relative overflow-hidden">
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
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.variant?.product?.slug}`}
                  className="text-sm lg:text-base font-semibold text-slate-900 hover:text-primary transition-colors block truncate"
                >
                  {item.productName || item.variant?.product?.name}
                </Link>
                
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    {item.variant?.color && <span>{item.variant.color}</span>}
                    {item.variant?.color && item.variant?.size && <span className="text-slate-200">|</span>}
                    {item.variant?.size && <span>Size {item.variant.size}</span>}
                  </div>
                  
                  {user && status === OrderStatus.DELIVERED && !reviews?.some((r: any) => r.productId === (item.variant?.productId || item.productId)) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-3 rounded-lg text-amber-600 border-amber-100 hover:bg-amber-50 hover:border-amber-200 text-[10px] font-semibold transition-all active:scale-95"
                      onClick={() => setSelectedItem(item)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1.5" />
                      Viết đánh giá
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
               <div className="flex flex-col sm:items-end">
                 <span className="text-base font-semibold text-slate-900 tabular-nums">
                   {formatCurrency(item.price)}
                 </span>
                 <span className="text-xs text-slate-400 font-medium mt-0.5">
                   x{item.quantity}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/30 p-6 lg:p-8 border-t border-slate-100 flex justify-end">
        <div className="w-full max-w-[320px] space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Tạm tính</span>
              <span className="text-slate-900">
                {formatCurrency(total - (shippingFee || 0) + (discountAmount || 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Phí vận chuyển</span>
              <span className="text-slate-900">
                {shippingFee > 0 ? `+${formatCurrency(shippingFee)}` : "Miễn phí"}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>Giảm giá</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
          </div>
          
          <div className="pt-5 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-base font-semibold text-slate-900">Tổng thanh toán</span>
            <span className="text-2xl font-semibold text-primary tabular-nums tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
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
    </div>
  );
}
