"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGuestOrderDetail } from "@/features/orders/hooks";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { AlertCircle, RotateCcw } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { ordersApi } from "@/features/orders/api/orders.api";
import { returnsApi } from "@/features/returns/api";
import { ORDER_STATUS_CONFIG } from "@/features/orders/constants/order-status.constants";

// Shared sub-components
import { DetailStepper } from "@/features/orders/components/customer/detail/DetailStepper";
import { DetailItems } from "@/features/orders/components/customer/detail/DetailItems";

// Guest specific sub-components
import { GuestDetailHeader } from "@/features/orders/components/customer/guest/GuestDetailHeader";
import { GuestDetailSidebar } from "@/features/orders/components/customer/guest/GuestDetailSidebar";
import { RequestReturnModal } from "@/features/orders/components/customer/detail/RequestReturnModal";
import { ReorderBanner } from "@/features/orders/components/customer/detail/ReorderBanner";
import { ConfirmCancelModal } from "@/features/orders/components/customer/detail/ConfirmCancelModal";
import { PrintInvoice } from "@/features/orders/components/admin/detail/PrintInvoice";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";

const statusConfig = ORDER_STATUS_CONFIG;

export function GuestOrderDetailView() {
  const { id: orderCode } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const {
    data: order,
    isLoading,
    error: fetchError,
  } = useGuestOrderDetail(orderCode, contact);
  const { addItem } = useCart();
  const { success, error: toastError } = useToast();

  const handleReorder = () => {
    if (!order?.orderItems) return;

    order.orderItems.forEach((item: any) => {
      const getUrl = (img: any) => (typeof img === "string" ? img : img?.url);
      addItem({
        productId: String(item.variant?.productId || item.productId || ""),
        variantId: String(item.variantId),
        quantity: item.quantity,
        name:
          item.productName ||
          item.variantSnapshot?.productName ||
          item.variant?.product?.name ||
          "Sản phẩm",
        price: Number(item.price),
        imageUrl:
          getUrl(item.variantSnapshot?.image) ||
          getUrl(item.variant?.images?.[0]) ||
          getUrl(item.variant?.product?.images?.[0]) ||
          "/placeholder.png",
        slug: item.variant?.product?.slug || "",
        color: item.variant?.color,
        size: item.variant?.size,
        stock: item.variant?.stock || 99,
      } as any);
    });
    success("Đã thêm các sản phẩm vào giỏ hàng");
  };

  const handleCancel = async () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!order?.orderCode || !contact) {
      toastError("Thiếu thông tin xác thực để huỷ đơn hàng");
      return;
    }

    setIsCancelling(true);
    try {
      await ordersApi.cancelGuestOrder(order.orderCode, contact);
      success("Đã gửi yêu cầu hủy đơn hàng thành công");
      // Cập nhật lại cache hoặc reload
      window.location.reload();
    } catch (err: any) {
      console.error("Cancel guest order error:", err);
      toastError(
        err.response?.data?.message || err.message || "Có lỗi xảy ra khi hủy đơn hàng"
      );
    } finally {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
    }
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

  if (!order || fetchError) {
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
            Vui lòng kiểm tra lại mã đơn hàng và số điện thoại/email.
          </p>
        </div>
        <Button
          asChild
          className="rounded-full px-10 h-12 bg-brand-espresso text-white hover:bg-brand-espresso/90"
        >
          <Link href="/">Quay lại trang chủ</Link>
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
          <GuestDetailHeader
            orderId={order.id}
            orderCode={order.orderCode}
            createdAt={order.createdAt}
            deliveredAt={order.deliveredAt}
            status={order.status}
            isPaid={isPaid}
            isCancelled={isCancelled}
            statusConfig={statusConfig}
            contact={contact}
            onReorder={handleReorder}
            onCancel={handleCancel}
            onReturn={() => setIsReturnModalOpen(true)}
            returnStatus={order.returnRequest?.status}
            paymentMethod={order.paymentMethod}
            totalItems={order.orderItems?.length || 0}
            onReview={() => {
              if (order.orderItems?.[0]) setSelectedItem(order.orderItems[0]);
            }}
            onConfirmReturn={async () => {
              try {
                await returnsApi.confirmGuestSent(order.returnRequest.id, {
                  orderCode: order.orderCode,
                  contact: contact,
                });
                window.location.reload();
              } catch (err: any) {
                toastError(err.response?.data?.message || "Có lỗi xảy ra");
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <DetailStepper
                status={order.status}
                isCancelled={isCancelled}
                returnStatus={order.returnRequest?.status}
                createdAt={order.createdAt}
                deliveredAt={order.deliveredAt}
                shippingCode={order.shippingCode}
                userEmail={order.guestEmail || order.user?.email}
              />

              {isCancelled && (
                <div className="p-6 bg-[#FCEAEA] border border-[#F0C0C0] rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C44040] shadow-sm shrink-0">
                    <AlertCircle size={22} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-[#C44040]">
                      Đơn hàng đã bị huỷ
                    </h4>
                    <p className="text-[13px] text-[#C44040]/80 font-medium leading-relaxed">
                      Đơn hàng của bạn đã được hủy thành công. Nếu bạn đã thanh toán
                      trước, số tiền sẽ được hoàn trả trong vòng 3–5 ngày làm việc.
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
                      <h3 className="text-lg font-bold text-brand-espresso font-serif-brand">
                        Chi tiết yêu cầu trả hàng
                      </h3>
                      <p className="text-[11px] text-brand-taupe font-bold uppercase tracking-widest mt-1">
                        Cập nhật:{" "}
                        {new Date(
                          order.returnRequest?.updatedAt || order.updatedAt
                        ).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-brand-sand">
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-widest">
                        Lý do của bạn
                      </p>
                      <p className="text-sm text-brand-espresso font-medium leading-relaxed italic">
                        "{order.returnRequest.reason}"
                      </p>
                    </div>
                    {order.returnRequest?.adminNote && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-brand-bronze uppercase tracking-widest">
                          Phản hồi từ Shop
                        </p>
                        <div className="p-5 bg-brand-cream/50 rounded-xl border border-brand-sand">
                          <p className="text-sm text-brand-espresso font-medium leading-relaxed italic">
                            "{order.returnRequest.adminNote}"
                          </p>
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
                paymentStatus={
                  order.paymentStatus || (order as any).payment?.status || ""
                }
                shippingCode={order.shippingCode}
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

      <ConfirmCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />

      <ReviewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        productId={Number(selectedItem?.variant?.productId || selectedItem?.productId)}
        orderId={order.id || 0}
        productName={
          selectedItem?.productName || selectedItem?.variant?.product?.name || ""
        }
        productSlug={selectedItem?.variant?.product?.slug}
        productImage={(() => {
          const getUrl = (img: any) => (typeof img === "string" ? img : img?.url);
          const path =
            (selectedItem?.variantSnapshot as { image?: string })?.image ||
            getUrl(selectedItem?.variant?.images?.[0]) ||
            getUrl(selectedItem?.variant?.product?.images?.[0]);
          if (!path) return "/placeholder.png";
          if (path.startsWith("http")) return path;
          return `/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
        })()}
      />

      <PrintInvoice order={order} />
    </div>
  );
}