"use client";

import React from "react";
import { Truck, CreditCard, Package, CheckCircle2, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import Link from "next/link";
import dayjs from "dayjs";

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
    <div className="bg-white rounded-2xl border-none p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
         <Truck className="h-4 w-4 text-slate-500" />
         <h3 className="font-semibold text-sm text-slate-800">Vận chuyển & Thanh toán</h3>
      </div>
      <div className="space-y-4">
         <div className="flex items-start gap-3">
            <div className="mt-0.5"><CreditCard className="h-4 w-4 text-slate-400" /></div>
            <div>
               <p className="text-[10px] font-semibold text-slate-500 tracking-wide">Thanh toán</p>
               <p className="text-sm font-semibold text-slate-800">{order.paymentMethod === "CASH" ? "Thanh toán COD" : "Chuyển khoản / Online"}</p>
               {orderAny.payment?.status === PaymentStatus.SUCCESS && orderAny.payment?.updatedAt && (
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    Đã thanh toán lúc: {dayjs(orderAny.payment.updatedAt).format("HH:mm, DD/MM/YYYY")}
                  </p>
               )}
            </div>
         </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wide">Ghi chú</p>
            <p className="text-sm text-slate-600 font-medium italic">{order.note || "Không có ghi chú"}</p>
          </div>
         <div className="pt-2 space-y-3">
            {!(orderAny.payment?.status === PaymentStatus.SUCCESS) && 
             order.status !== OrderStatus.CANCELLED && 
             order.status !== OrderStatus.RETURNED && (
                 <Button 
                     variant="outline"
                     size="sm"
                     className="w-full font-semibold h-10 rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                     onClick={() => orderAny.payment?.id && onUpdatePayment({ paymentId: String(orderAny.payment.id), status: PaymentStatus.SUCCESS, orderId: id })}
                     disabled={isPending || !orderAny.payment?.id}
                 >
                     {isUpdatingPayment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                     Xác nhận đã thanh toán
                 </Button>
            )}
            
            {order.status === OrderStatus.PENDING && (
                 <Button 
                     size="sm"
                     className="w-full font-semibold h-10 rounded-lg bg-primary text-white hover:bg-slate-800"
                     onClick={() => onUpdateStatus({ id, status: OrderStatus.PROCESSING })}
                     disabled={isPending}
                 >
                     {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                     Xác nhận đơn hàng
                 </Button>
            )}

            {order.status === OrderStatus.PROCESSING && (
                 <Button 
                     variant="outline"
                     size="sm"
                     className="w-full font-semibold h-10 rounded-lg border-blue-500 text-blue-600 hover:bg-blue-50"
                     onClick={() => onSyncGHN(id)}
                     disabled={isPending}
                 >
                     {isSyncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
                     Gửi đơn sang GHN
                 </Button>
            )}

            {order.status === OrderStatus.SHIPPED && (
                 <Button 
                     variant="outline"
                     size="sm"
                     className="w-full font-semibold h-10 rounded-lg border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                     onClick={() => onUpdateStatus({ id, status: OrderStatus.DELIVERED })}
                     disabled={isPending}
                 >
                     {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
                     Xác nhận đã giao hàng
                 </Button>
            )}

            {order.status === OrderStatus.RETURN_REQUESTED && (
                 <div className="space-y-3">
                   <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100">
                       <p className="text-xs font-semibold text-amber-600 tracking-wide flex items-center justify-center gap-2">
                           <RotateCcw className="h-3.5 w-3.5" /> Đang yêu cầu trả hàng
                       </p>
                   </div>
                   <Button asChild className="w-full font-semibold h-10 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/10">
                     <Link href="/admin/returns">
                       Xử lý yêu cầu <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                </div>
            )}

            {order.status === OrderStatus.RETURNED && (
                 <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-100">
                     <p className="text-xs font-semibold text-purple-600 tracking-wide">
                         Đơn hàng đã trả hàng & hoàn tiền
                     </p>
                 </div>
            )}

             {(order.status === OrderStatus.DELIVERED || isCancelled) && order.status !== OrderStatus.RETURN_REQUESTED && order.status !== OrderStatus.RETURNED && (
                  <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 tracking-wide">
                          {isCancelled ? "Đơn hàng đã hủy" : "Đơn hàng đã hoàn tất"}
                      </p>
                      {order.status === OrderStatus.DELIVERED && order.deliveredAt && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Giao lúc: {dayjs(order.deliveredAt).format("HH:mm, DD/MM/YYYY")}
                        </p>
                      )}
                  </div>
             )}
         </div>
      </div>
    </div>
  );
}
