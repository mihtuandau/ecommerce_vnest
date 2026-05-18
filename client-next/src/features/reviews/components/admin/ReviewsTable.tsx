"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { 
  Star, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShoppingBag,
  Eye,
  X
} from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import dayjs from "@/lib/dayjs";

interface ReviewsTableProps {
  reviews: any[];
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  page: number;
  totalPages: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function ReviewsTable({
  reviews,
  isLoading,
  isDeleting,
  onDelete,
  page,
  totalPages,
  total,
  setPage,
}: ReviewsTableProps) {
  const { can } = usePermission();
  const canManage = can("product.manage") || can("settings.manage");
  
  // State for image lightbox zoom
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);
  
  // State for review delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" variant="slate" />
        <p className="text-xs text-slate-400">Đang tải lịch sử đánh giá...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center">
          <Star className="h-8 w-8 text-slate-350" />
        </div>
        <div>
          <p className="text-sm text-slate-800">Không tìm thấy đánh giá nào</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc số sao khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[25%] align-middle">Sản phẩm</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[16%] align-middle">Khách hàng</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] align-middle">Điểm số</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[24%] align-middle">Nội dung đánh giá</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[11%] align-middle">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] text-right align-middle">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((r: any) => {
              const customerName = r.user?.name || "Khách vãng lai";
              const customerEmail = r.user?.email || "---";
              const product = r.product;

              // Safe retrieval of the product image url
              const firstImage = product?.images?.[0];
              const productImageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url || "";

              // Locate the variant size & color purchased for this product in this order
              const purchaseItem = r.order?.orderItems?.find(
                (item: any) => item.variant?.productId === r.productId
              );
              const size = purchaseItem?.variant?.size;
              const color = purchaseItem?.variant?.color;

              return (
                <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Column 1: Sản phẩm */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      {productImageUrl ? (
                        <div className="h-11 w-11 rounded-lg overflow-hidden relative border border-slate-100 flex-shrink-0 bg-slate-50 shadow-sm">
                          <Image
                            src={productImageUrl}
                            alt={product.name || "Sản phẩm"}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-350 shadow-sm">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/shop/${product?.slug || product?.id || ""}`}
                          target="_blank"
                          className="text-sm font-semibold text-slate-800 hover:text-indigo-650 transition-colors block truncate hover:underline"
                        >
                          {product?.name || "Sản phẩm không khả dụng"}
                        </Link>
                        
                        {/* Variant details (size, color) */}
                        {(size || color) && (
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {size && (
                              <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/50 px-1 py-0.5 rounded leading-none whitespace-nowrap">
                                Kích cỡ: {size}
                              </span>
                            )}
                            {color && (
                              <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/50 px-1 py-0.5 rounded leading-none whitespace-nowrap">
                                Màu: {color}
                              </span>
                            )}
                          </div>
                        )}

                        {r.order?.orderCode && (
                          <Link
                            href={`/admin/orders/${r.order.id}`}
                            className="text-xs text-slate-400 hover:text-slate-655 transition-colors inline-flex items-center gap-0.5 mt-1"
                          >
                            Đơn hàng: #{r.order.orderCode} <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Khách hàng */}
                  <td className="px-6 py-4 align-middle">
                    <span className="text-sm font-semibold text-slate-800 block truncate">
                      {customerName}
                    </span>
                    <span className="text-xs text-slate-400 block truncate mt-0.5">
                      {customerEmail}
                    </span>
                  </td>

                  {/* Column 3: Điểm số */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-0.5 bg-amber-50/50 border border-amber-250/30 px-2 py-1 rounded-lg w-fit">
                      <span className="text-xs font-semibold text-amber-700 mr-1">{r.rating}</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= r.rating
                              ? "fill-amber-450 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Column 4: Nội dung đánh giá */}
                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm text-slate-650 leading-relaxed break-words line-clamp-3">
                      {r.comment || <em className="text-slate-350 font-normal italic">Không có bình luận chữ</em>}
                    </p>
                    {/* Review Images */}
                    {r.images && r.images.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {r.images.map((imgObj: any) => {
                          const imgUrl = typeof imgObj === "string" ? imgObj : imgObj.url;
                          return (
                            <button
                              key={imgUrl}
                              onClick={() => setActiveZoomImage(imgUrl)}
                              className="h-8 w-8 rounded-md overflow-hidden relative border border-slate-200/80 cursor-zoom-in hover:brightness-90 transition-all flex-shrink-0 group"
                            >
                              <Image
                                src={imgUrl}
                                alt="Ảnh đánh giá"
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                <Eye className="h-2.5 w-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  {/* Column 5: Thời gian */}
                  <td className="px-6 py-4 align-middle">
                    <span className="text-xs text-slate-500 block whitespace-nowrap">
                      {dayjs(r.createdAt).format("DD/MM/YYYY · HH:mm")}
                    </span>
                  </td>

                  {/* Column 6: Thao tác (Xóa đánh giá) */}
                  <td className="px-6 py-4 text-right align-middle">
                    <div className="flex items-center justify-end">
                      {confirmDeleteId === r.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-50/50 border border-rose-100 p-1 rounded-xl whitespace-nowrap shadow-sm">
                          <button
                            onClick={() => {
                              onDelete(r.id);
                              setConfirmDeleteId(null);
                            }}
                            disabled={isDeleting || !canManage}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg cursor-pointer shadow-sm font-medium whitespace-nowrap transition-colors"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs rounded-lg cursor-pointer font-medium whitespace-nowrap transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!canManage}
                          onClick={() => setConfirmDeleteId(r.id)}
                          className="h-8 w-8 p-0 flex items-center justify-center hover:bg-rose-50 text-slate-400 hover:text-rose-650 transition-all rounded-full cursor-pointer focus:ring-0 focus:outline-none border-0 bg-transparent"
                          title="Xóa đánh giá này"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-455">
            Hiển thị trang {page}/{totalPages} (Tổng số {total} đánh giá)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-lg border-slate-200/80 p-0 flex items-center justify-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-lg border-slate-200/80 p-0 flex items-center justify-center"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Premium Lightbox Modal */}
      {activeZoomImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveZoomImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setActiveZoomImage(null)}
              className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div 
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeZoomImage}
                alt="Phóng to ảnh đánh giá"
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
