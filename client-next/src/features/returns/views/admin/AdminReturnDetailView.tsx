"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { ReturnActionForm } from "@/features/returns/components/admin/ReturnActionForm";
import { ReturnCustomerCard } from "@/features/returns/components/admin/ReturnCustomerCard";
import { ReturnDetailHeader } from "@/features/returns/components/admin/ReturnDetailHeader";
import { ReturnRequestCard } from "@/features/returns/components/admin/ReturnRequestCard";
import { RelatedOrderCard } from "@/features/returns/components/admin/RelatedOrderCard";
import { RequestTimelineCard } from "@/features/returns/components/admin/RequestTimelineCard";
import { useReturnDetail, useUpdateReturnStatus } from "@/features/returns/hooks";

interface AdminReturnDetailViewProps {
  id: number;
}

export function AdminReturnDetailView({ id }: AdminReturnDetailViewProps) {
  const [adminNote, setAdminNote] = useState("");
  const { data: request, isLoading } = useReturnDetail(id);
  const updateStatusMutation = useUpdateReturnStatus();

  useEffect(() => {
    if (request) {
      setAdminNote(request.adminNote || "");
    }
  }, [request]);

  const handleUpdateStatus = (status: string) => {
    updateStatusMutation.mutate({ id, status, adminNote });
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <p className="text-[13px] font-medium text-slate-400">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-20 text-center font-medium text-slate-500">
        Không tìm thấy yêu cầu
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <ReturnDetailHeader
        request={request}
        isSubmitting={updateStatusMutation.isPending}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ReturnRequestCard request={request} />
          <ReturnActionForm adminNote={adminNote} onNoteChange={setAdminNote} />
        </div>

        <div className="space-y-6">
          <ReturnCustomerCard user={request.user} />
          <RelatedOrderCard order={request.order} orderId={request.orderId} />
          <RequestTimelineCard createdAt={request.createdAt} />
        </div>
      </div>
    </div>
  );
}
