"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrderDetail, useCancelOrder } from "@/features/orders/hooks";
import { ORDER_STATUS_CONFIG, ORDERS_CONTACT } from "@/features/orders";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { AlertCircle, Clock, RotateCcw } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

// Sub-components
import { DetailHeader } from "../../components/customer/detail/DetailHeader";
import { DetailStepper } from "../../components/customer/detail/DetailStepper";
import { DetailItems } from "../../components/customer/detail/DetailItems";
import { DetailSidebar } from "../../components/customer/detail/DetailSidebar";
import { DetailReview } from "../../components/customer/detail/DetailReview";
import { ReorderBanner } from "../../components/customer/detail/ReorderBanner";
import { PrintInvoice } from "../../components/admin/detail/PrintInvoice";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { RequestReturnModal } from "../../components/customer/detail/RequestReturnModal";
import { ConfirmCancelModal } from "../../components/customer/detail/ConfirmCancelModal";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmReturnSent } from "@/features/returns/hooks";
import { queryKeys } from "@/constants/queryKeys";

export function CustomerOrderDetailView() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrderDetail(id);
  const { mutate: cancelOrder } = useCancelOrder();
  const { addItem } = useCart();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { mutate: confirmReturnSent, isPending: isConfirmingSent } =
    useConfirmReturnSent();

  const handleReorder = () => {
    if (!order || !order.orderItems) return;

    order.orderItems.forEach((item) => {
      const getUrl = (img: any) => (typeof img === "string" ? img : img?.url);
      addItem({
        productId: String(item.variant?.productId || item.productId || ""),
        variantId: String(item.variantId),
        name:
          item.productName ||
          item.variantSnapshot?.productName ||
          item.variant?.product?.name ||
          "Sản phẩm",
        price: item.price,
        quantity: item.quantity,
        imageUrl: getUrl(
          item.variantSnapshot?.image ||
            item.variant?.images?.[0] ||
            item.variant?.product?.images?.[0]
        ),
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
        <Button
          asChild
          className="rounded-full px-10 h-12 bg-brand-espresso text-white hover:bg-brand-espresso/90"
        >
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
  const latestReturnRequest = (order.returnRequests || []).reduce(
    (latest: any, current: any) => {
      if (!latest) return current;
      const latestTime = new Date(latest.updatedAt || latest.createdAt || 0).getTime();
      const currentTime = new Date(current.updatedAt || current.createdAt || 0).getTime();
      return currentTime > latestTime ? current : latest;
    },
    null
  );

  return (
    <div className="min-h-screen bg-brand-cream text-brand-espresso pb-20 relative font-sans-brand">
      <div className="no-print">
        {/* Breadcrumb Container */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Breadcrumb>
            <BreadcrumbList className="text-sm font-medium">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/orders">Đơn hàng</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>#{order.orderCode}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
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
                if (latestReturnRequest?.id) {
                  confirmReturnSent(latestReturnRequest.id);
                } else {
                  toastError("Không tìm thấy thông tin yêu cầu trả hàng");
                }
              } catch (err: any) {
                toastError(err.message || "Không thể cập nhật trạng thái hoàn trả");
              }
            }}
            returnStatus={latestReturnRequest?.status}
            isUpdatingReturn={isConfirmingSent}
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

              {latestReturnRequest && (
                <div className="bg-white border border-[#DDD6C8] rounded-2xl p-10 space-y-8 shadow-sm font-sans-brand">
                  <div className="flex items-center justify-between gap-5 flex-wrap">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-[#F3EFE8] flex items-center justify-center text-[#8A7966] border border-[#DDD6C8]">
                        <RotateCcw size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-espresso font-serif-brand">
                          Chi tiết yêu cầu trả hàng
                        </h3>
                        <p className="text-xs text-[#8A7966] font-semibold mt-1">
                          Cập nhật:{" "}
                          {new Date(
                            latestReturnRequest?.updatedAt || order.updatedAt
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F3EFE8] text-[#8A7966] border border-[#DDD6C8]">
                      {latestReturnRequest.status === "PENDING" ? "Chờ duyệt" :
                       latestReturnRequest.status === "APPROVED" ? "Đã duyệt" :
                       latestReturnRequest.status === "RETURNING" ? "Đang gửi trả" :
                       latestReturnRequest.status === "RECEIVED" ? "Đã nhận hàng" :
                       latestReturnRequest.status === "COMPLETED" ? "Hoàn tất" :
                       latestReturnRequest.status === "REJECTED" ? "Từ chối" : latestReturnRequest.status}
                    </div>
                  </div>

                  {latestReturnRequest.status === "APPROVED" && (
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-indigo-950">
                          Yêu cầu trả hàng đã được duyệt!
                        </h4>
                        <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                          Vui lòng đóng gói các sản phẩm cần hoàn trả và gửi hàng về cho shop. Sau khi gửi hàng đi, bạn hãy nhấn nút dưới đây để xác nhận với hệ thống.
                        </p>
                      </div>
                      <Button
                        disabled={isConfirmingSent}
                        onClick={() => {
                          if (latestReturnRequest?.id) {
                            confirmReturnSent(latestReturnRequest.id);
                          }
                        }}
                        className="rounded-xl h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
                      >
                        {isConfirmingSent ? "Đang xử lý..." : "Xác nhận đã gửi hàng"}
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-brand-sand">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#8A7966]">
                        Lý do từ bạn
                      </p>
                      <p className="text-sm text-brand-espresso font-medium leading-relaxed italic">
                        "{latestReturnRequest.reason}"
                      </p>
                    </div>
                    {latestReturnRequest?.adminNote && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-[#8A7966]">
                          Phản hồi LUXE
                        </p>
                        <div className="p-5 bg-brand-cream/50 rounded-xl border border-brand-sand">
                          <p className="text-sm text-brand-espresso font-medium leading-relaxed italic">
                            "{latestReturnRequest.adminNote}"
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Bằng chứng hình ảnh */}
                    <div className="space-y-3 col-span-full pt-6 border-t border-brand-sand">
                      <p className="text-xs font-semibold text-[#8A7966]">
                        Hình ảnh bằng chứng
                      </p>
                      {latestReturnRequest.images && latestReturnRequest.images.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {latestReturnRequest.images.map((url: string, index: number) => (
                            <div
                              key={index}
                              className="w-20 h-20 rounded-xl overflow-hidden border border-[#DDD6C8] relative cursor-zoom-in group shadow-sm bg-slate-50"
                            >
                              <Image
                                src={url}
                                alt={`Evidence ${index + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onClick={() => window.open(url, "_blank")}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-slate-400 italic">
                          Không có hình ảnh đính kèm
                        </p>
                      )}
                    </div>
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
                onReport={() =>
                  window.open(
                    `${ORDERS_CONTACT.ZALO_BASE_URL}/${process.env.NEXT_PUBLIC_ZALO}`,
                    "_blank"
                  )
                }
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
        orderItems={order.orderItems?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        }))}
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
