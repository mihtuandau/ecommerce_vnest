"use client";

import React, { useState } from "react";
import { useMyOrders, useCancelOrder } from "@/features/orders/hooks";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Image from "next/image";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { MessageSquare } from "lucide-react";
import { getImageUrl } from "@/utils/image";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusLabelMap: Record<string, string> = {
  ALL: "Tất cả",
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPED]: "Đang giao",
  [OrderStatus.DELIVERED]: "Đã giao",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.RETURN_REQUESTED]: "Trả hàng",
  [OrderStatus.RETURNED]: "Đã trả",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  [OrderStatus.PENDING]: {
    label: "Chờ xử lý",
    color: "bg-slate-50 text-slate-600 border-slate-100",
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    color: "bg-blue-50 text-primary border-blue-100",
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao hàng",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  [OrderStatus.DELIVERED]: {
    label: "Đã giao hàng",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
};

export function OrderHistoryView() {
  const [status, setStatus] = useState("ALL");
  const { data, isLoading } = useMyOrders();
  const { mutate: cancelOrder } = useCancelOrder();
  const { addItem } = useCart();
  const { success } = useToast();
  const [selectedReviewItem, setSelectedReviewItem] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>("");
  
  const orders = data || [];

  const getCount = (s: string) => {
    if (s === "ALL") return orders.length;
    return orders.filter((o) => o.status === s).length;
  };

  const handleBuyAgain = (item: any) => {
    const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
    const imgSrc = (item.variantSnapshot as any)?.image ||
                  getUrl(item.variant?.images?.[0]) ||
                  getUrl(item.variant?.product?.images?.[0]);

    const variantInfo = item.variantSnapshot || {};
    addItem({
      productId: String(item.variant?.productId || item.productId || variantInfo.productId),
      variantId: String(item.variantId || item.variant?.id),
      name: item.productName || variantInfo.productName || item.variant?.product?.name,
      price: item.price,
      imageUrl: getImageUrl(imgSrc),
      slug: item.variant?.product?.slug || item.slug || variantInfo.slug,
      color: item.variant?.color || variantInfo.color,
      size: item.variant?.size || variantInfo.size,
      quantity: 1,
    });
    success(`Đã thêm ${item.productName || 'sản phẩm'} vào giỏ hàng`);
  };

  const filteredOrders =
    status === "ALL" ? orders : orders.filter((o) => o.status === status);

  return (
    <>
      <div className="min-h-screen bg-slate-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
          <Link
            href="/"
            className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-blue-50 transition-all shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Đơn hàng của tôi
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Theo dõi và quản lý lịch sử mua hàng của bạn
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <Tabs value={status} onValueChange={setStatus} className="w-full">
            <div className="relative">
              <TabsList className="flex lg:flex-wrap w-full overflow-x-auto lg:overflow-x-visible justify-start h-auto p-1 bg-white rounded-2xl border border-slate-100 shadow-sm gap-1 no-scrollbar select-none">
                {[
                  "ALL",
                  OrderStatus.PENDING,
                  OrderStatus.PROCESSING,
                  OrderStatus.SHIPPED,
                  OrderStatus.DELIVERED,
                  OrderStatus.CANCELLED,
                  OrderStatus.RETURN_REQUESTED,
                  OrderStatus.RETURNED,
                ].map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className="flex-shrink-0 lg:flex-1 min-w-fit lg:min-w-0 px-3 md:px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <span>{statusLabelMap[s]}</span>
                      {getCount(s) > 0 && (
                        <span
                          className={`flex items-center justify-center min-w-[18px] h-4.5 px-1.5 rounded-full text-[9px] ${
                            status === s
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {getCount(s)}
                        </span>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
                {/* Spacer to ensure the last item is not cut off */}
                <div className="flex-shrink-0 w-4 lg:hidden" />
              </TabsList>
            </div>
          </Tabs>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="rounded-2xl border border-slate-100 overflow-hidden bg-white"
                  >
                    <div className="px-6 py-4 bg-slate-50/30 border-b border-slate-100 flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="p-8 flex gap-8">
                      <Skeleton className="h-20 w-20 rounded-2xl" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-6">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-11 w-40 rounded-2xl" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Chưa có đơn hàng
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Khám phá các sản phẩm mới nhất của chúng tôi
                </p>
                <Button
                  className="mt-8 rounded-full px-8 bg-primary shadow-lg shadow-blue-500/20"
                  asChild
                >
                  <Link href="/">Mua sắm ngay</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredOrders.map((order) => {
                  const isPaid =
                    order.paymentStatus === "PAID" ||
                    (order.paymentStatus as any) === PaymentStatus.SUCCESS ||
                    order.payment?.status === "PAID" ||
                    (order.payment?.status as any) === PaymentStatus.SUCCESS;

                  const displayStatus = statusConfig[order.status] || {
                    label: order.status,
                    color: "text-slate-600 bg-slate-100",
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                      {/* ── Order Card Header ── */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 lg:p-6 bg-slate-50/50 border-b border-slate-100">
                        <div className="grid grid-cols-2 md:flex md:items-center gap-6 lg:gap-10">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số đơn hàng</p>
                            <p className="text-sm font-bold text-slate-900">{order.orderCode}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày đặt</p>
                            <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng cộng</p>
                            <p className="text-sm font-bold text-primary tabular-nums">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            className="w-full sm:w-auto h-10 px-6 rounded-xl border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:border-primary hover:text-primary transition-all"
                            asChild
                          >
                            <Link href={`/orders/${order.id}`}>Chi tiết</Link>
                          </Button>
                        </div>
                      </div>

                      {/* ── Order Items List ── */}
                      <div className="divide-y divide-slate-100">
                        {order.orderItems.map((item: any) => {
                          const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
                          const imgSrc = (item.variantSnapshot as any)?.image ||
                                        getUrl(item.variant?.images?.[0]) ||
                                        getUrl(item.variant?.product?.images?.[0]);
                          
                          return (
                            <div key={item.id} className="p-6 lg:p-8">
                              <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                                {/* Image */}
                                <div className="h-24 w-24 lg:h-32 lg:w-32 rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden shrink-0 relative">
                                  <Image
                                    src={getImageUrl(imgSrc)}
                                    alt={item.productName}
                                    fill
                                    className="object-contain p-3 mix-blend-multiply"
                                    sizes="128px"
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-base font-semibold text-slate-900 leading-snug">
                                      {item.productName || item.variant?.product?.name}
                                    </h4>
                                    <span className="text-base font-semibold text-slate-900 tabular-nums">
                                      {formatCurrency(item.price)}
                                    </span>
                                  </div>
                                  
                                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-2xl font-medium">
                                    {[item.variant?.color, item.variant?.size].filter(Boolean).join(" | ")} {item.variant?.color || item.variant?.size ? "•" : ""} Số lượng: {item.quantity}
                                  </p>

                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                    <div className="flex items-center gap-2.5">
                                      <div className={`h-2 w-2 rounded-full ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
                                      <span className="text-[11px] font-semibold text-slate-500">
                                        {displayStatus.label} {order.status === OrderStatus.DELIVERED && `vào ${new Date(order.updatedAt).toLocaleDateString("vi-VN")}`}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <Link 
                                        href={`/shop/${item.variant?.product?.slug || item.slug}`} 
                                        className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                                      >
                                        Xem sản phẩm
                                      </Link>
                                      <span className="h-1 w-1 rounded-full bg-slate-200" />
                                      <button 
                                        className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                                        onClick={() => handleBuyAgain(item)}
                                      >
                                        Mua lại
                                      </button>
                                      {order.status === OrderStatus.DELIVERED && !order.reviews?.some((r: any) => r.productId === item.variant?.productId) && (
                                        <>
                                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                                          <button 
                                            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
                                            onClick={() => {
                                              setSelectedReviewItem(item);
                                              setSelectedOrderId(order.id);
                                              setSelectedOrderCode(order.orderCode || "");
                                            }}
                                          >
                                            Viết đánh giá
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      <ReviewModal 
        isOpen={!!selectedReviewItem}
        onClose={() => setSelectedReviewItem(null)}
        productId={Number(selectedReviewItem?.variant?.productId || selectedReviewItem?.productId)}
        orderId={selectedOrderId}
        orderCode={selectedOrderCode}
        productName={selectedReviewItem?.productName || selectedReviewItem?.variant?.product?.name}
        variantName={[selectedReviewItem?.variant?.color, selectedReviewItem?.variant?.size].filter(Boolean).join(", ")}
        productImage={getImageUrl(
          (selectedReviewItem?.variantSnapshot as any)?.image || 
          (typeof selectedReviewItem?.variant?.product?.images?.[0] === 'string' 
            ? selectedReviewItem?.variant?.product?.images?.[0] 
            : selectedReviewItem?.variant?.product?.images?.[0]?.url) || 
          (typeof selectedReviewItem?.variant?.images?.[0] === 'string' 
            ? selectedReviewItem?.variant?.images?.[0] 
            : selectedReviewItem?.variant?.images?.[0]?.url)
        )}
      />
    </>
  );
}
