"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGuestOrderDetail } from "@/features/orders/hooks";
import { Button } from "@/components/ui/Button";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { OrderStatus, PaymentStatus, ReturnStatus } from "@/types/enums";
import { returnsApi } from "@/features/returns/api";

// Shared sub-components
import { DetailStepper } from "./detail/DetailStepper";
import { DetailItems } from "./detail/DetailItems";

// Guest specific sub-components
import { GuestDetailHeader } from "./guest-detail/GuestDetailHeader";
import { GuestDetailSidebar } from "./guest-detail/GuestDetailSidebar";

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
  
  const { data: order, isLoading, error: fetchError } = useGuestOrderDetail(orderCode, contact);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50/30">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-slate-600 font-medium animate-pulse text-sm">Đang tra cứu đơn hàng...</p>
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

  const isPaid = order.paymentStatus === 'PAID' || order.paymentStatus === PaymentStatus.SUCCESS || order.payment?.status === 'PAID' || order.payment?.status === PaymentStatus.SUCCESS;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuestDetailHeader 
          orderId={order.id}
          orderCode={order.orderCode}
          createdAt={order.createdAt}
          status={order.status}
          isPaid={isPaid}
          statusConfig={statusConfig}
          contact={contact}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DetailStepper 
              status={order.status} 
              isCancelled={isCancelled} 
              returnStatus={order.returnRequest?.status}
            />

            {order.returnRequest && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <RotateCcw size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Yêu cầu trả hàng</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Cập nhật lúc: {new Date(order.returnRequest.updatedAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  {order.returnRequest.status === "APPROVED" && (
                    <Button 
                      onClick={async () => {
                        if (confirm("Xác nhận bạn đã gửi hàng đi?")) {
                          try {
                            await returnsApi.confirmGuestSent(order.returnRequest.id, {
                              orderCode: order.orderCode,
                              contact: contact
                            });
                            window.location.reload();
                          } catch (err: any) {
                            alert(err.response?.data?.message || "Có lỗi xảy ra");
                          }
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold h-9 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                    >
                      Xác nhận đã gửi hàng
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lý do trả hàng</p>
                    <p className="text-sm text-slate-700 font-semibold">{order.returnRequest.reason}</p>
                  </div>
                  {order.returnRequest.adminNote && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Phản hồi từ Shop</p>
                      <p className="text-sm text-slate-700 font-semibold italic">"{order.returnRequest.adminNote}"</p>
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
            />
          </div>

          <GuestDetailSidebar 
            shippingSnapshot={order.shippingSnapshot}
            fullName={order.fullName}
            phone={order.phone}
            email={order.guestEmail || order.user?.email}
            address={order.address}
            paymentMethod={order.paymentMethod}
            isPaid={isPaid}
            paymentStatus={order.paymentStatus || order.payment?.status}
            shippingCode={order.shippingCode}
          />
        </div>
      </div>
    </div>
  );
}
