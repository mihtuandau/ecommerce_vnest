"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrderDetail, useCancelOrder } from "@/features/orders/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import {
  AlertCircle,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Sub-components
import { DetailHeader } from "./detail/DetailHeader";
import { DetailStepper } from "./detail/DetailStepper";
import { DetailItems } from "./detail/DetailItems";
import { DetailSidebar } from "./detail/DetailSidebar";
import { PrintInvoice } from "../admin/detail/PrintInvoice";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { RequestReturnModal } from "./detail/RequestReturnModal";
import { ConfirmReturnModal } from "./detail/ConfirmReturnModal";
import { ConfirmCancelModal } from "./detail/ConfirmCancelModal";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateReturnStatus } from "@/features/returns/hooks";
import { queryKeys } from "@/constants/queryKeys";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  [OrderStatus.PENDING]: {
    label: "Chờ xác nhận",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    icon: Package,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao hàng",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Giao thành công",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy đơn",
    color: "text-rose-600 bg-rose-50 border-rose-100",
    icon: XCircle,
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: AlertCircle,
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    icon: CheckCircle2,
  },
};

export function OrderDetailView() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrderDetail(id);
  const { mutate: cancelOrder } = useCancelOrder();
  const { addItem } = useCart();
  const { success } = useToast();
  const queryClient = useQueryClient();
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isConfirmReturnOpen, setIsConfirmReturnOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { mutate: updateReturnStatus, isPending: isUpdatingStatus } =
    useUpdateReturnStatus();

  const handleReorder = () => {
    if (!order || !order.orderItems) return;

    order.orderItems.forEach((item) => {
      const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
      addItem({
        productId: String(item.variant?.productId || item.productId || ""),
        variantId: String(item.variantId),
        name: item.productName || item.variantSnapshot?.productName || item.variant?.product?.name || "Sản phẩm",
        price: item.price,
        quantity: item.quantity,
        imageUrl:
          getUrl(item.variantSnapshot?.image) ||
          getUrl(item.variant?.images?.[0]) ||
          getUrl(item.variant?.product?.images?.[0]) ||
          "/placeholder.png",
        slug: item.variant?.product?.slug || "",
        color: item.variant?.color,
        size: item.variant?.size,
      });
    });

    success("Đã thêm các sản phẩm vào giỏ hàng");
  };

  const handleReturnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="h-12 bg-slate-50 border-b border-slate-100" />
                <div className="p-4 space-y-4">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/30">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-slate-500">
            Đơn hàng có thể đã bị xóa hoặc không tồn tại.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/orders">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const isPaid =
    order.paymentStatus === "PAID" ||
    (order.paymentStatus as any) === PaymentStatus.SUCCESS ||
    order.payment?.status === "PAID" ||
    (order.payment?.status as any) === PaymentStatus.SUCCESS;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20 relative font-sans">
      <div className="no-print">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 md:py-10">
          <DetailHeader
            orderCode={order.orderCode}
            orderId={order.id}
            createdAt={order.createdAt}
            deliveredAt={order.deliveredAt}
            status={order.status}
            isPaid={isPaid}
            isCancelled={isCancelled}
            onReorder={handleReorder}
            onCancel={() => setIsCancelModalOpen(true)}
            onReturn={() => setIsReturnModalOpen(true)}
            onConfirmReturn={() => {
              updateReturnStatus({
                id: order.returnRequest.id,
                status: "RETURNING" as any,
              });
            }}
            returnStatus={order.returnRequest?.status}
            isUpdatingReturn={isUpdatingStatus}
            statusConfig={statusConfig}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <DetailStepper
                status={order.status}
                isCancelled={isCancelled}
                returnStatus={order.returnRequest?.status}
                updatedAt={order.updatedAt}
                createdAt={order.createdAt}
                deliveredAt={order.deliveredAt}
              />

              {order.returnRequest && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Chi tiết yêu cầu trả hàng</h3>
                      <p className="text-xs text-slate-400  -medium mt-1">Cập nhật: {new Date(order.returnRequest?.updatedAt || order.updatedAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lý do của bạn</p>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{order.returnRequest.reason}</p>
                    </div>
                    {order.returnRequest?.adminNote && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Phản hồi từ Shop</p>
                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
                          <p className="text-sm text-slate-700 font-medium italic leading-relaxed">"{order.returnRequest.adminNote}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <DetailItems
                orderItems={order.orderItems}
                total={order.total}
                shippingFee={order.shippingFee}
                discountAmount={order.discountAmount}
                status={order.status}
                orderId={order.id}
                reviews={order.reviews}
              />
            </div>

            <div className="lg:col-span-5">
              <DetailSidebar
                orderId={order.id}
                shippingSnapshot={order.shippingSnapshot || {}}
                user={order.user}
                addressRelation={order.address}
                paymentMethod={order.paymentMethod}
                paymentStatus={order.paymentStatus || order.payment?.status || ""}
                isPaid={isPaid}
                isCancelled={isCancelled}
                isReturned={order.status === OrderStatus.RETURNED}
                isReturning={order.status === OrderStatus.RETURN_REQUESTED}
                shippingCode={order.shippingCode}
                status={order.status}
                onReturn={() => setIsReturnModalOpen(true)}
                onReport={() => window.open('https://zalo.me/0987654321', '_blank')}
                onReview={() => {
                  if (order.orderItems?.[0]) {
                    setSelectedItem(order.orderItems[0]);
                  }
                }}
                isReviewed={order.reviews && order.reviews.length > 0}
                orderItems={order.orderItems}
              />
            </div>
          </div>
        </div>
      </div>

      <RequestReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        orderId={order.id}
        orderCode={order.orderCode}
        onSuccess={handleReturnSuccess}
      />

      <ConfirmCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          cancelOrder(String(order.id));
          setIsCancelModalOpen(false);
        }}
      />

      <ReviewModal 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        productId={Number(selectedItem?.variant?.productId || selectedItem?.productId)}
        orderId={order.id || 0}
        productName={selectedItem?.productName || selectedItem?.variant?.product?.name || ""}
        productSlug={selectedItem?.variant?.product?.slug}
        productImage={(() => {
          const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
          const path = (selectedItem?.variantSnapshot as { image?: string })?.image || getUrl(selectedItem?.variant?.images?.[0]) || getUrl(selectedItem?.variant?.product?.images?.[0]);
          if (!path) return "/placeholder.png";
          if (path.startsWith('http')) return path;
          return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
        })()}
      />

      {/* DEDICATED PRINT COMPONENT */}
      <PrintInvoice order={order} />
    </div>
  );
}
