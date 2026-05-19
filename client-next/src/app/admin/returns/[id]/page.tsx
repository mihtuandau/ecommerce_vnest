"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { returnsApi } from "@/features/returns/api";
import { useToast } from "@/hooks/useToast";
import { Spinner } from "@/components/ui/Spinner";
import { ReturnDetailHeader } from "@/features/returns/components/admin/ReturnDetailHeader";
import { ReturnRequestCard } from "@/features/returns/components/admin/ReturnRequestCard";
import { ReturnActionForm } from "@/features/returns/components/admin/ReturnActionForm";
import { ReturnCustomerCard } from "@/features/returns/components/admin/ReturnCustomerCard";
import { RelatedOrderCard } from "@/features/returns/components/admin/RelatedOrderCard";
import { RequestTimelineCard } from "@/features/returns/components/admin/RequestTimelineCard";
import { RETURNS_MESSAGES } from "@/features/returns/constants";

export default function AdminReturnDetailPage() {
  const { id } = useParams() as { id: string };
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await returnsApi.getReturnDetail(+id);
      setRequest(res);
      setAdminNote(res.adminNote || "");
    } catch (err) {
      error("Không thể tải chi tiết yêu cầu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setIsSubmitting(true);
    try {
      await returnsApi.updateReturnStatus(+id, { status, adminNote });
      success(RETURNS_MESSAGES.UPDATE_STATUS_SUCCESS);
      fetchDetail();
    } catch (err) {
      error(RETURNS_MESSAGES.UPDATE_STATUS_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <p className="text-[13px] font-medium text-slate-400">Đang tải dữ liệu...</p>
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
        isSubmitting={isSubmitting}
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
