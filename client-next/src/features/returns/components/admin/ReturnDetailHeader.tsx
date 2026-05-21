"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, XCircle, CheckCircle2, RotateCcw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { RETURN_STATUS_CONFIG } from "../../constants/index";
import { ReturnStatus } from "@/types/enums";

interface ReturnDetailHeaderProps {
  request: any;
  isSubmitting: boolean;
  onUpdateStatus: (status: string) => void;
}

export function ReturnDetailHeader({
  request,
  isSubmitting,
  onUpdateStatus,
}: ReturnDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Chi tiết yêu cầu trả hàng
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg px-2.5 py-1 border font-semibold text-[11px]",
                RETURN_STATUS_CONFIG[request.status as ReturnStatus]?.color
              )}
            >
              {RETURN_STATUS_CONFIG[request.status as ReturnStatus]?.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
            <span>Đơn hàng</span>
            <span className="text-[10px]">›</span>
            <Link href="/admin/returns" className="hover:text-slate-600 font-medium">
              Yêu cầu Đổi/Trả
            </Link>
            <span className="text-[10px]">›</span>
            <span className="text-slate-600 font-medium">Chi tiết #{request.order?.orderCode}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {request.status === ReturnStatus.PENDING && (
          <>
            <Button
              variant="outline"
              onClick={() => onUpdateStatus(ReturnStatus.REJECTED)}
              disabled={isSubmitting}
              className="h-10 rounded-xl px-5 font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 text-xs transition-all shadow-sm"
            >
              <XCircle className="mr-2 h-4 w-4" /> Từ chối
            </Button>
            <Button
              onClick={() => onUpdateStatus(ReturnStatus.APPROVED)}
              disabled={isSubmitting}
              className="h-10 rounded-xl px-5 font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all shadow-sm text-xs"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Phê duyệt
            </Button>
          </>
        )}
        {request.status === ReturnStatus.APPROVED && (
          <Button
            onClick={() => onUpdateStatus(ReturnStatus.RETURNING)}
            disabled={isSubmitting}
            className="h-10 rounded-xl px-6 font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs transition-all"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Khách đang gửi hàng
          </Button>
        )}
        {request.status === ReturnStatus.RETURNING && (
          <Button
            onClick={() => onUpdateStatus(ReturnStatus.RECEIVED)}
            disabled={isSubmitting}
            className="h-10 rounded-xl px-6 font-semibold bg-cyan-600 hover:bg-cyan-700 shadow-sm text-xs transition-all"
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Shop đã nhận hàng
          </Button>
        )}
        {request.status === ReturnStatus.RECEIVED && (
          <Button
            onClick={() => onUpdateStatus(ReturnStatus.COMPLETED)}
            disabled={isSubmitting}
            className="h-10 rounded-xl px-6 font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs transition-all"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Hoàn tất & Hoàn tiền
          </Button>
        )}
      </div>
    </div>
  );
}
