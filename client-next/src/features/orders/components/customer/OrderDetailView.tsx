"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrderDetail, useCancelOrder } from "@/features/orders/hooks";
import { ORDER_STATUS_CONFIG } from "@/features/orders";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import {
  AlertCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Sub-components
import { DetailHeader } from "./detail/DetailHeader";
import { DetailStepper } from "./detail/DetailStepper";
import { DetailItems } from "./detail/DetailItems";
import { DetailSidebar } from "./detail/DetailSidebar";
import { DetailReview } from "./detail/DetailReview";
import { ReorderBanner } from "./detail/ReorderBanner";
import { PrintInvoice } from "../admin/detail/PrintInvoice";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { RequestReturnModal } from "./detail/RequestReturnModal";
import { ConfirmCancelModal } from "./detail/ConfirmCancelModal";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateReturnStatus } from "@/features/returns/hooks";
import { queryKeys } from "@/constants/queryKeys";


export function OrderDetailView() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrderDetail(id);
  const { mutate: cancelOrder } = useCancelOrder();
  const { addItem } = useCart();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
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
          getUrl(item.variantSnapshot?.image ||
          item.variant?.images?.[0] ||
          item.variant?.product?.images?.[0]),
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
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-full" />
            <Skeleton className="h-12 w-96 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-cream px-6">
        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-brand-border">
          <AlertCircle className="h-12 w-12 text-rose-500 opacity-50" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-brand-espresso font-serif">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-brand-taupe text-sm max-w-xs mx-auto">
            Đơn hàng có thể đã bị xóa hoặc không tồn tại trong hệ thống của chúng tôi.
          </p>
        </div>
        <Button asChild className="rounded-full px-10 h-12 bg-brand-espresso text-white hover:bg-brand-espresso/90">
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
    <div className="min-h-screen bg-brand-cream text-brand-espresso pb-20 relative font-sans-brand">
      <div className="no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            onReview={() => {
              if (order.orderItems?.[0]) setSelectedItem(order.orderItems[0]);
            }}
            onConfirmReturn={() => {
              try {
                if (order?.returnRequest?.id) {
                  updateReturnStatus({
                    id: order.returnRequest.id,
                    status: "RETURNING" as any,
                  });
                } else {
                  toastError("Không tìm thấy thông tin yêu cầu trả hàng");
                }
              } catch (err: any) {
                toastError(err.message || "Không thể cập nhật trạng thái hoàn trả");
              }
            }}
            returnStatus={order.returnRequest?.status}
            isUpdatingReturn={isUpdatingStatus}
            statusConfig={ORDER_STATUS_CONFIG}
            order={order}
            isReviewed={order.reviews && order.reviews.length > 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <DetailStepper
                status={order.status}
                isCancelled={isCancelled}
                createdAt={order.createdAt}
                deliveredAt={order.deliveredAt}
                shippingCode={order.shippingCode}
                userEmail={order.user?.email}
              />

              {isCancelled && (
                <div className="p-6 bg-[#FCEAEA] border border-[#F0C0C0] rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C44040] shadow-sm shrink-0">
                    <AlertCircle size={22} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-[#C44040]">Đơn hàng đã bị huỷ</h4>
                    <p className="text-[13px] text-[#C44040]/80 font-medium leading-relaxed">
                      Đơn hàng của bạn đã được hủy thành công. Nếu bạn đã thanh toán trước, số tiền sẽ được hoàn trả trong vòng 3–5 ngày làm việc.
                    </p>
                  </div>
                </div>
              )}

              {order.returnRequest && (
                <div className="bg-white border border-[#DDD6C8] rounded-2xl p-10 space-y-8 shadow-sm font-sans-brand">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-[#F3EFE8] flex items-center justify-center text-[#8A7966] border border-[#DDD6C8]">
                      <RotateCcw size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#3D2B1A] font-serif-brand">Chi tiết yêu cầu trả hàng</h3>
                      <p className="text-[10px] text-[#8A7966] font-black tracking-[0.05em] mt-1">Cập nhật: {new Date(order.returnRequest?.updatedAt || order.updatedAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#DDD6C8]">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-[#8A7966] tracking-[0.05em]">Lý do từ bạn</p>
                      <p className="text-sm text-[#3D2B1A] font-medium leading-relaxed italic">"{order.returnRequest.reason}"</p>
                    </div>
                    {order.returnRequest?.adminNote && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#C4783A] tracking-[0.05em]">Phản hồi LUXE</p>
                        <div className="p-5 bg-[#FAF8F4] rounded-xl border border-[#DDD6C8]">
                          <p className="text-sm text-[#3D2B1A] font-medium leading-relaxed italic">"{order.returnRequest.adminNote}"</p>
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

            <div className="lg:col-span-4">
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
                total={order.total}
              />
            </div>
          </div>

          <ReorderBanner 
            itemCount={order.orderItems?.length || 0}
            onReorder={handleReorder}
          />
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
