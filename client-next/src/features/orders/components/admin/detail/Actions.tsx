"use client";

import React from "react";
import { Truck, CreditCard, Package, CheckCircle2, RotateCcw, ArrowRight, Banknote } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import dayjs from "dayjs";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface ActionsProps {
  order: any;
  isPending: boolean;
  onUpdateStatus: (params: { id: string; status: OrderStatus }) => void;
  onSyncGHN: (id: string) => void;
  onUpdatePayment: (params: { paymentId: string; status: PaymentStatus; orderId: string }) => void;
  id: string;
}

export function Actions({ 
  order, 
  isPending, 
  onUpdateStatus, 
  onSyncGHN, 
  onUpdatePayment,
  id 
}: ActionsProps) {
  const orderAny = order as any;
  const isCancelled = order.status === OrderStatus.CANCELLED;
  
  const isUpdating = isPending;
  const isSyncing = isPending;
  const isUpdatingPayment = isPending;

  return (
    <>
      {/* Thẻ Thanh toán */}
      <div className={cn(adminUI.card.base, "p-0 overflow-hidden")}>
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
           <h3 className={cn(adminUI.typography.sectionTitle, "flex items-center gap-2")}>
             <CreditCard className="h-4 w-4 text-blue-500" fill="currentColor" /> Thanh toán
           </h3>
        </div>
        <div className="p-5 space-y-4">
           <div className="flex justify-between items-start gap-4">
             <span className="text-[13px] text-slate-500 whitespace-nowrap">Phương thức</span>
             <span className="text-[13px] font-medium text-slate-800 text-right">
               {(order.paymentMethod === "CASH" || order.paymentMethod === "COD") 
                 ? "Thanh toán khi nhận hàng" 
                 : "Chuyển khoản / Online"}
             </span>
           </div>
           <div className="flex justify-between items-start gap-4">
             <span className="text-[13px] text-slate-500 whitespace-nowrap">Trạng thái</span>
             <span className={cn(
               "text-[12px] font-bold px-2.5 py-0.5 rounded-full",
               orderAny.payment?.status === PaymentStatus.SUCCESS 
                 ? "bg-emerald-50 text-emerald-700" 
                 : "bg-slate-100 text-slate-600"
             )}>
               {orderAny.payment?.status === PaymentStatus.SUCCESS ? "• Đã thanh toán" : "Chưa thanh toán"}
             </span>
           </div>
           {orderAny.payment?.status === PaymentStatus.SUCCESS && orderAny.payment?.updatedAt && (
             <div className="flex justify-between items-start gap-4">
               <span className="text-[13px] text-slate-500 whitespace-nowrap">Thời gian</span>
               <span className="text-[13px] font-medium text-slate-800 text-right">
                 {dayjs(orderAny.payment.updatedAt).format("DD/MM/YYYY HH:mm")}
               </span>
             </div>
           )}
           <div className="border-t border-slate-100 pt-3 flex justify-between items-start gap-4">
             <span className="text-[13px] text-slate-500 whitespace-nowrap">Tổng</span>
             <span className="text-[15px] font-bold font-serif text-amber-700 text-right">
               {(order.total || (order as any).totalAmount || 0).toLocaleString('vi-VN')}đ
             </span>
           </div>

           {/* Payment Action Button relocated here inside Payment Card */}
           {!(orderAny.payment?.status === PaymentStatus.SUCCESS) && 
            order.status !== OrderStatus.CANCELLED && 
            order.status !== OrderStatus.RETURNED && (
              <div className="border-t border-slate-100 pt-4 mt-1">
                <Button 
                  className={cn(adminUI.button.base, "w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 text-[13px] font-semibold shadow-sm")}
                  onClick={() => orderAny.payment?.id && onUpdatePayment({ paymentId: String(orderAny.payment.id), status: PaymentStatus.SUCCESS, orderId: id })}
                  disabled={isPending || !orderAny.payment?.id}
                >
                  {isPending ? <Spinner size="sm" variant="white" /> : <CreditCard className="h-3.5 w-3.5 mr-1.5" />}
                  Xác nhận đã thanh toán
                </Button>
              </div>
           )}
        </div>
      </div>
    </>
  );
}
