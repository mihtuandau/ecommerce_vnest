"use client";

import React from "react";
import { Truck, CreditCard, Package, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/enums";

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
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
         <Truck className="h-4 w-4 text-slate-400" />
         <h3 className="font-bold text-sm text-slate-900">Vận chuyển & Thanh toán</h3>
      </div>
      <div className="space-y-4">
         <div className="flex items-start gap-3">
            <div className="mt-0.5"><CreditCard className="h-4 w-4 text-slate-300" /></div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thanh toán</p>
               <p className="text-sm font-bold text-slate-900">{order.paymentMethod === "CASH" ? "Thanh toán COD" : "Chuyển khoản / Online"}</p>
            </div>
         </div>
         <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ghi chú</p>
            <p className="text-sm text-slate-500 italic">{order.note || "Không có ghi chú"}</p>
         </div>
         <div className="pt-2 space-y-3">
            {!(order.paymentStatus === "PAID" || orderAny.payment?.status === PaymentStatus.SUCCESS) && (
                <Button 
                    variant="outline"
                    size="sm"
                    className="w-full font-bold h-10 rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50"
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
                    className="w-full font-bold h-10 rounded-lg bg-primary text-white hover:bg-slate-800"
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
                    className="w-full font-bold h-10 rounded-lg border-blue-500 text-blue-600 hover:bg-blue-50"
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
                    className="w-full font-bold h-10 rounded-lg border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => onUpdateStatus({ id, status: OrderStatus.DELIVERED })}
                    disabled={isPending}
                >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
                    Xác nhận đã giao hàng
                </Button>
            )}

            {(order.status === OrderStatus.DELIVERED || isCancelled) && (
                <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {isCancelled ? "Đơn hàng đã hủy" : "Đơn hàng đã hoàn tất"}
                    </p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
