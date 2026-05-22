"use client";

import React from "react";
import {
  useOrderDetail,
  useUpdateOrderStatus,
  useSyncToGHN,
  useUpdatePaymentStatus,
} from "../../hooks";
import { useParams } from "next/navigation";
import { Header } from "../../components/admin/detail/OrderHeader";
import { Stepper } from "../../components/admin/detail/OrderStepper";
import { Items } from "../../components/admin/detail/OrderItemsTable";
import { Customer } from "../../components/admin/detail/OrderCustomer";
import { Actions } from "../../components/admin/detail/OrderActions";
import { PrintInvoice } from "../../components/admin/detail/PrintInvoice";
import { Timeline } from "../../components/admin/detail/OrderTimelineCard";
import { Notes } from "../../components/admin/detail/OrderNotes";
import { Spinner } from "@/components/ui/Spinner";

export function AdminOrderDetailView() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrderDetail(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutate: syncGHN, isPending: isSyncing } = useSyncToGHN();
  const { mutate: updatePayment, isPending: isUpdatingPayment } =
    useUpdatePaymentStatus();

  const isPending = isUpdating || isSyncing || isUpdatingPayment;

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-400">Ðang t?i thông tin...</p>
      </div>
    );
  }

  if (!order)
    return (
      <div className="p-20 text-center font-bold text-slate-500">
        Không tìm th?y don hàng
      </div>
    );

  return (
    <div className="space-y-6 pb-10 relative">
      <div className="no-print space-y-6">
        
        <Header
          order={order}
          id={id}
          onUpdateStatus={(id, status) => updateStatus({ id, status })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <Stepper
              status={order.status}
              id={id}
              isPending={isPending}
              onUpdateStatus={(id, status) => updateStatus({ id, status })}
            />
            <Items order={order} />
            <Timeline order={order} />
            <Notes order={order} />
          </div>

          
          <div className="space-y-6">
            <Customer order={order} />
            <Actions
              order={order}
              id={id}
              isPending={isPending}
              onUpdateStatus={updateStatus}
              onSyncGHN={syncGHN}
              onUpdatePayment={updatePayment}
            />
          </div>
        </div>
      </div>

      
      <PrintInvoice order={order} />
    </div>
  );
}
