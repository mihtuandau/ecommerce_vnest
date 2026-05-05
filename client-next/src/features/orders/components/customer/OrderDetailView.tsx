"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrderDetail, useCancelOrder } from "@/features/orders/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCartStore } from "@/store/useCartStore";
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
import { RequestReturnModal } from "./detail/RequestReturnModal";
import { ConfirmReturnModal } from "./detail/ConfirmReturnModal";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateReturnStatus } from "@/features/returns/hooks";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  [OrderStatus.PENDING]: {
    label: "Chờ xử lý",
    color: "text-slate-600 bg-slate-50 border-slate-100",
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
    label: "Đã giao hàng",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
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
  const { addItem } = useCartStore();
  const { success } = useToast();
  const queryClient = useQueryClient();
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isConfirmReturnOpen, setIsConfirmReturnOpen] = useState(false);
  const { mutate: updateReturnStatus, isPending: isUpdatingStatus } =
    useUpdateReturnStatus();

  const handleReorder = () => {
    if (!order || !order.orderItems) return;

    order.orderItems.forEach((item: any) => {
      addItem({
        productId: String(item.variant?.productId || item.productId),
        variantId: String(item.variantId),
        name: item.productName || item.variant?.product?.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl:
          item.variant?.product?.images?.[0]?.url ||
          item.variant?.images?.[0]?.url ||
          "/placeholder.png",
        slug: item.variant?.product?.slug || item.slug || "",
        color: item.variant?.color,
        size: item.variant?.size,
      });
    });

    success("Đã thêm các sản phẩm vào giỏ hàng");
  };

  const handleReturnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["order", id] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
    order.paymentStatus === PaymentStatus.SUCCESS ||
    order.payment?.status === "PAID" ||
    order.payment?.status === PaymentStatus.SUCCESS;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <div className="no-print">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DetailHeader
            orderCode={order.orderCode}
            orderId={order.id}
            createdAt={order.createdAt}
            deliveredAt={order.deliveredAt}
            status={order.status}
            isPaid={isPaid}
            isCancelled={isCancelled}
            onReorder={handleReorder}
            onCancel={() => confirm("Hủy đơn hàng này?") && cancelOrder(order.id)}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <DetailStepper
                status={order.status}
                isCancelled={isCancelled}
                returnStatus={order.returnRequest?.status}
              />

              <DetailItems
                orderItems={order.orderItems}
                total={order.total}
                shippingFee={order.shippingFee}
                discountAmount={order.discountAmount}
                status={order.status}
                orderId={order.id}
              />
            </div>

            <DetailSidebar
              orderId={order.id}
              shippingSnapshot={order.shippingSnapshot}
              user={order.user}
              addressRelation={order.address}
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus || order.payment?.status}
              isPaid={isPaid}
              isCancelled={isCancelled}
              isReturned={order.status === OrderStatus.RETURNED}
              isReturning={order.status === OrderStatus.RETURN_REQUESTED}
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
        onSuccess={handleReturnSuccess}
      />

      {/* DEDICATED PRINT COMPONENT */}
      <PrintInvoice order={order} />
    </div>
  );
}
