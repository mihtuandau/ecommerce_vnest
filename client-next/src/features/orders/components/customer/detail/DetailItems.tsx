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
    <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-sm font-sans-brand animate-in fade-in duration-700">
      <div className="px-[22px] py-[16px] border-b border-brand-sand flex items-center justify-between">
        <span className="text-[14px] font-bold text-brand-espresso flex items-center gap-2">
          <ShoppingBag size={16} className="text-brand-accent" /> Sản phẩm đã đặt
        </span>
        <span className="text-[12.5px] text-brand-taupe">
          {orderItems?.length} sản phẩm
        </span>
      </div>

      <div className="p-[22px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[11.5px] font-bold text-brand-taupe uppercase tracking-[0.06em] pb-3 text-left border-b border-brand-sand">
                Sản phẩm
              </th>
              <th className="text-[11.5px] font-bold text-brand-taupe uppercase tracking-[0.06em] pb-3 text-center border-b border-brand-sand w-20">
                SL
              </th>
              <th className="text-[11.5px] font-bold text-brand-taupe uppercase tracking-[0.06em] pb-3 text-right border-b border-brand-sand w-32">
                Đơn giá
              </th>
              <th className="text-[11.5px] font-bold text-brand-taupe uppercase tracking-[0.06em] pb-3 text-right border-b border-brand-sand w-32">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand">
            {orderItems?.map((item: any) => {
              // Snapshot lưu lúc đặt hàng (có thể là object hoặc JSON string).
              let snap: any = item.variantSnapshot ?? null;
              if (typeof snap === "string") {
                try {
                  snap = JSON.parse(snap);
                } catch (e) {
                  snap = null;
                }
              }
              // Variant live join từ DB (có đầy đủ product/images/slug).
              const live: any = item.variant || null;

              // Ưu tiên snapshot (giữ thông tin tại thời điểm đặt) — nhưng fallback live khi snapshot thiếu field.
              const color = snap?.color ?? live?.color ?? null;
              const size = snap?.size ?? live?.size ?? null;
              const productName =
                item.productName ||
                snap?.productName ||
                live?.product?.name ||
                "Sản phẩm LUXE";
              const brand =
                snap?.brandName || live?.product?.brand?.name || "LUXE Boutique";
              const productSlug = snap?.productSlug || live?.product?.slug || "#";
              const imageSrc =
                snap?.image ||
                live?.images?.[0]?.url ||
                live?.images?.[0] ||
                live?.product?.images?.[0]?.url ||
                live?.product?.images?.[0];
              const price = item.price || 0;
              const originalPrice = item.originalPrice ?? snap?.originalPrice ?? price;

              return (
                <tr key={item.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[60px] h-[72px] rounded-xl border border-brand-sand shrink-0 relative overflow-hidden bg-brand-ivory">
                        <Image
                          src={getImageUrl(imageSrc)}
                          alt={productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10.5px] font-bold text-brand-taupe uppercase tracking-[0.1em]">
                          {brand}
                        </p>
                        <Link
                          href={`/shop/${productSlug}`}
                          className="text-[14px] font-medium text-brand-espresso hover:text-brand-accent transition-colors line-clamp-1 leading-snug"
                        >
                          {productName}
                        </Link>
                        {(color || size) && (
                          <div className="flex gap-1.5 pt-1">
                            {Boolean(color) && (
                              <span className="text-[11px] text-brand-taupe bg-brand-cream border border-brand-sand rounded-md px-2 py-0.5">
                                Màu: {color}
                              </span>
                            )}
                            {Boolean(size) && (
                              <span className="text-[11px] text-brand-taupe bg-brand-cream border border-brand-sand rounded-md px-2 py-0.5">
                                Size: {size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center text-[13.5px] text-brand-taupe font-sans tabular-nums">
                    × {item.quantity}
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-[15px] font-bold text-brand-espresso font-sans tabular-nums">
                      {formatCurrency(price)}
                    </p>
                    {originalPrice > price && (
                      <p className="text-[12px] text-brand-taupe/80 line-through font-sans tabular-nums">
                        {formatCurrency(originalPrice)}
                      </p>
                    )}
                  </td>
                  <td className="py-4 text-right text-[16px] font-bold text-brand-espresso font-sans tabular-nums">
                    {formatCurrency(price * item.quantity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        
        <div className="mt-4 pt-4 border-t border-brand-sand space-y-2.5 max-w-sm ml-auto font-sans">
          <div className="flex justify-between text-[13.5px]">
            <span className="text-brand-taupe">Tạm tính</span>
            <span className="text-brand-espresso font-medium tabular-nums">
              {formatCurrency(total - (shippingFee || 0) + (discountAmount || 0))}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[13.5px]">
              <span className="text-brand-taupe">Giảm giá sản phẩm</span>
              <span className="text-rose-600 font-medium tabular-nums">
                − {formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[13.5px]">
            <span className="text-brand-taupe">Phí vận chuyển</span>
            <span className="text-emerald-600 font-bold tabular-nums">
              {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
            </span>
          </div>

          <div className="pt-3 border-t-[1.5px] border-brand-sand flex justify-between items-center">
            <span className="text-[15px] font-bold text-brand-espresso">Tổng cộng</span>
            <span className="text-[24px] font-bold text-brand-bronze tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
          <p className="text-right text-[11px] text-brand-taupe">Đã bao gồm VAT 10%</p>
        </div>
      </div>
    </div>
  );
}
