"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGuestOrderDetail } from "@/features/orders/hooks";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { returnsApi } from "@/features/returns/api";

// Shared sub-components
import { DetailStepper } from "./detail/DetailStepper";
import { DetailItems } from "./detail/DetailItems";

// Guest specific sub-components
import { GuestDetailHeader } from "./guest-detail/GuestDetailHeader";
import { GuestDetailSidebar } from "./guest-detail/GuestDetailSidebar";
import { RequestReturnModal } from "./detail/RequestReturnModal";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  [OrderStatus.PENDING]: { label: "Chờ xử lý", color: "text-slate-600 bg-slate-50 border-slate-100", icon: Clock },
  [OrderStatus.PROCESSING]: { label: "Đang xử lý", color: "text-blue-600 bg-blue-50 border-blue-100", icon: Package },
  [OrderStatus.SHIPPED]: { label: "Đang giao hàng", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: Truck },
  [OrderStatus.DELIVERED]: { label: "Đã giao hàng", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 },
  [OrderStatus.CANCELLED]: { label: "Đã hủy", color: "text-rose-600 bg-rose-50 border-rose-100", icon: XCircle },
};

export function GuestOrderDetailView() {
  const { id: orderCode } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  
  const { data: order, isLoading, error: fetchError } = useGuestOrderDetail(orderCode, contact);
  const { addItem } = useCart();
  const { success } = useToast();

  const handleReorder = () => {
    if (!order?.orderItems) return;
    
    order.orderItems.forEach((item: any) => {
      const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
      addItem({
        productId: String(item.variant?.productId || item.productId || ""),
        variantId: String(item.variantId),
        quantity: item.quantity,
        name: item.productName || item.variantSnapshot?.productName || item.variant?.product?.name || "Sản phẩm",
        price: Number(item.price),
        imageUrl:
          getUrl(item.variantSnapshot?.image) ||
          getUrl(item.variant?.images?.[0]) ||
          getUrl(item.variant?.product?.images?.[0]) ||
          "/placeholder.png",
        slug: item.variant?.product?.slug || "",
        color: item.variant?.color,
        size: item.variant?.size,
        stock: item.variant?.stock || 99
      } as any);
    });
    success("Đã thêm các sản phẩm vào giỏ hàng");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-12 bg-slate-50/50 border-b border-slate-100" />
                <div className="p-6 space-y-6">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </div>
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

  if (!order || fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/30">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <div className="text-center space-y-2 px-4">
          <h2 className="text-2xl font-semibold text-slate-900">Không tìm thấy đơn hàng</h2>
          <p className="text-slate-500">Vui lòng kiểm tra lại mã đơn hàng và số điện thoại/email.</p>
        </div>
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  const isPaid = 
    order.paymentStatus === 'PAID' || 
    (order.paymentStatus as any) === PaymentStatus.SUCCESS || 
    order.payment?.status === 'PAID' || 
    (order.payment?.status as any) === PaymentStatus.SUCCESS;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <GuestDetailHeader 
          orderId={order.id}
          orderCode={order.orderCode}
          createdAt={order.createdAt}
          deliveredAt={order.deliveredAt}
          status={order.status}
          isPaid={isPaid}
          statusConfig={statusConfig}
          contact={contact}
          onReorder={handleReorder}
          onReturn={() => setIsReturnModalOpen(true)}
          returnStatus={order.returnRequest?.status}
          onConfirmReturn={async () => {
            try {
              await returnsApi.confirmGuestSent(order.returnRequest.id, {
                orderCode: order.orderCode,
                contact: contact
              });
              window.location.reload();
            } catch (err: any) {
              alert(err.response?.data?.message || "Có lỗi xảy ra");
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8 space-y-8">
            <DetailStepper 
              status={order.status} 
              isCancelled={isCancelled} 
              returnStatus={order.returnRequest?.status}
            />

            {order.returnRequest && (
              <div className="border border-slate-100 rounded-2xl p-6 lg:p-8 space-y-6 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                    <RotateCcw size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Chi tiết yêu cầu trả hàng</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Cập nhật: {new Date(order.returnRequest?.updatedAt || order.updatedAt).toLocaleString("vi-VN")}</p>
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

          <div className="lg:col-span-4">
            <GuestDetailSidebar 
              shippingSnapshot={order.shippingSnapshot || {}}
              fullName={(order as any).fullName}
              phone={(order as any).phone}
              email={(order as any).guestEmail || order.user?.email}
              address={order.address}
              paymentMethod={order.paymentMethod}
              isPaid={isPaid}
              paymentStatus={order.paymentStatus || (order as any).payment?.status || ""}
              shippingCode={order.shippingCode}
            />
          </div>
        </div>
      </div>
      <RequestReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        orderId={order.id}
        orderCode={order.orderCode}
        onSuccess={() => window.location.reload()}
        isGuest={true}
        contact={contact}
      />

    </div>
  );
}
