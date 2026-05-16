  "use client";

  import React from "react";
  import Link from "next/link";
  import { formatCurrency } from "@/utils/formatCurrency";
  import { ShoppingBag } from "lucide-react";
  import Image from "next/image";
  import { OrderItem } from "@/types/models";
  import { getImageUrl } from "@/utils/image";

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
  }: DetailItemsProps) {
    return (
      <div className="bg-white border border-[#DDD6C8] rounded-2xl overflow-hidden shadow-sm font-sans-brand animate-in fade-in duration-700">
        <div className="px-[22px] py-[16px] border-b border-[#DDD6C8] flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#3D2B1A] flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#C4783A]" /> Sản phẩm đã đặt
          </span>
          <span className="text-[12.5px] text-[#8A7966]">{orderItems?.length} sản phẩm</span>
        </div>
        
        <div className="p-[22px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[11.5px] font-bold text-[#8A7966] uppercase tracking-[0.06em] pb-3 text-left border-b border-[#DDD6C8]">Sản phẩm</th>
                <th className="text-[11.5px] font-bold text-[#8A7966] uppercase tracking-[0.06em] pb-3 text-center border-b border-[#DDD6C8] w-20">SL</th>
                <th className="text-[11.5px] font-bold text-[#8A7966] uppercase tracking-[0.06em] pb-3 text-right border-b border-[#DDD6C8] w-32">Đơn giá</th>
                <th className="text-[11.5px] font-bold text-[#8A7966] uppercase tracking-[0.06em] pb-3 text-right border-b border-[#DDD6C8] w-32">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6C8]">
              {orderItems?.map((item: any) => {
                const variant = item.variantSnapshot || item.variant;
                const productName = item.productName || variant?.productName || variant?.product?.name || "Sản phẩm LUXE";
                const brand = variant?.brandName || variant?.product?.brand?.name || "LUXE Boutique";
                const price = item.price || 0;
                const originalPrice = variant?.originalPrice || price;

                return (
                  <tr key={item.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-[60px] h-[72px] rounded-xl border border-[#DDD6C8] shrink-0 relative overflow-hidden bg-[#F3EFE8]">
                          <Image
                            src={getImageUrl(variant?.image || variant?.images?.[0] || variant?.product?.images?.[0])}
                            alt={productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10.5px] font-bold text-[#8A7966] uppercase tracking-[0.1em]">{brand}</p>
                          <Link href={`/shop/${variant?.product?.slug || "#"}`} className="text-[14px] font-medium text-[#3D2B1A] hover:text-[#C4783A] transition-colors line-clamp-1 leading-snug">
                            {productName}
                          </Link>
                          <div className="flex gap-1.5 pt-1">
                            <span className="text-[11px] text-[#8A7966] bg-[#F3EFE8] border border-[#DDD6C8] rounded-md px-2 py-0.5">Màu: {variant?.color || "N/A"}</span>
                            <span className="text-[11px] text-[#8A7966] bg-[#F3EFE8] border border-[#DDD6C8] rounded-md px-2 py-0.5">Size: {variant?.size || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-[13.5px] text-[#8A7966]">× {item.quantity}</td>
                    <td className="py-4 text-right">
                      <p className="text-[15px] font-bold text-[#3D2B1A] font-serif-brand">{formatCurrency(price)}</p>
                      {originalPrice > price && (
                        <p className="text-[12px] text-[#8A7966] line-through decoration-[#C4783A]/40">{formatCurrency(originalPrice)}</p>
                      )}
                    </td>
                    <td className="py-4 text-right text-[16px] font-bold text-[#3D2B1A] font-serif-brand">
                      {formatCurrency(price * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── PRICE SUMMARY ── */}
          <div className="mt-4 pt-4 border-t border-[#DDD6C8] space-y-2.5 max-w-sm ml-auto">
            <div className="flex justify-between text-[13.5px]">
              <span className="text-[#8A7966]">Tạm tính</span>
              <span className="text-[#3D2B1A] font-medium">{formatCurrency(total - (shippingFee || 0) + (discountAmount || 0))}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[13.5px]">
                <span className="text-[#8A7966]">Giảm giá sản phẩm</span>
                <span className="text-rose-600 font-medium">− {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13.5px]">
              <span className="text-[#8A7966]">Phí vận chuyển</span>
              <span className="text-emerald-600 font-bold">{shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}</span>
            </div>
            
            <div className="pt-3 border-t-[1.5px] border-[#DDD6C8] flex justify-between items-center">
              <span className="text-[15px] font-bold text-[#3D2B1A]">Tổng cộng</span>
              <span className="text-[24px] font-bold text-[#C4783A] font-serif-brand">
                {formatCurrency(total)}
              </span>
            </div>
            <p className="text-right text-[11px] text-[#8A7966]">Đã bao gồm VAT 10%</p>
          </div>
        </div>
      </div>
    );
  }
