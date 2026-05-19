"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  Coins,
  Banknote,
  Landmark,
  Smartphone,
  Zap,
  MoreHorizontal,
  RotateCcw
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import { PAYMENT_STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from "../../constants";
import { PaymentMethod, PaymentStatus } from "@/types/enums";

// Pure helper function for status badge
const getStatusBadge = (statusStr: string) => {
  const config = PAYMENT_STATUS_CONFIG[statusStr as keyof typeof PAYMENT_STATUS_CONFIG];
  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-650 border border-slate-200 whitespace-nowrap">
        <HelpCircle className="h-3.5 w-3.5" /> {statusStr}
      </span>
    );
  }

  const Icon = 
    statusStr === PaymentStatus.SUCCESS ? CheckCircle :
    statusStr === PaymentStatus.PENDING ? AlertCircle :
    statusStr === PaymentStatus.FAILED || statusStr === PaymentStatus.CANCELLED ? XCircle : Coins;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} whitespace-nowrap`}>
      <Icon className={`h-3.5 w-3.5 ${statusStr === PaymentStatus.PENDING ? "animate-pulse" : ""}`} /> {config.label}
    </span>
  );
};

// Pure helper function for method badge
const getMethodBadge = (methodStr: string) => {
  const config = PAYMENT_METHOD_CONFIG[methodStr as keyof typeof PAYMENT_METHOD_CONFIG];
  if (!config) {
    return (
      <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-550 font-bold whitespace-nowrap">
        <CreditCard className="h-3.5 w-3.5 text-slate-455" /> {methodStr}
      </span>
    );
  }

  const Icon =
    methodStr === PaymentMethod.CASH ? Banknote :
    methodStr === PaymentMethod.MOMO ? Smartphone :
    methodStr === PaymentMethod.PAYOS ? Zap :
    methodStr === "BANK" ? Landmark : CreditCard;

  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] ${config.color} font-bold whitespace-nowrap`}>
      <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} /> {config.label}
    </span>
  );
};

interface PaymentRowProps {
  payment: any;
  isUpdating: boolean;
  updateStatus: (data: { id: number; status: string }) => void;
  formatCurrency: (val: number) => string;
  canManage: boolean;
}

export function PaymentRow({
  payment: p,
  isUpdating,
  updateStatus,
  formatCurrency,
  canManage,
}: PaymentRowProps) {
  const customerName = p.order?.user?.name 
    ? p.order.user.name 
    : p.order?.guestEmail || "Khách vãng lai";

  const hasActions = p.status === PaymentStatus.PENDING || p.status === PaymentStatus.SUCCESS;

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {/* Column 1: Mã giao dịch */}
      <td className="px-6 py-4 align-middle">
        <span className="text-[13px] font-bold text-slate-800 tracking-tight block truncate font-mono">
          {p.transactionId || "---"}
        </span>
        {p.payosOrderCode && (
          <span className="text-[9.5px] text-slate-400 font-semibold block mt-0.5">
            PayOS: {p.payosOrderCode}
          </span>
        )}
      </td>

      {/* Column 2: Đơn hàng */}
      <td className="px-6 py-4 align-middle">
        <span className="text-[13px] font-bold text-slate-900 block font-mono whitespace-nowrap overflow-hidden text-ellipsis">
          #{p.order?.orderCode || p.orderId}
        </span>
      </td>

      {/* Column 3: Khách hàng */}
      <td className="px-6 py-4 align-middle">
        <span className="text-[12.5px] text-slate-700 block font-semibold truncate">
          {customerName}
        </span>
      </td>

      {/* Column 4: Thời gian */}
      <td className="px-6 py-4 align-middle">
        <span className="text-[12px] text-slate-600 block font-medium whitespace-nowrap">
          {dayjs(p.createdAt).format("DD/MM/YYYY · HH:mm")}
        </span>
      </td>

      {/* Column 5: Phương thức */}
      <td className="px-6 py-4 align-middle">
        {getMethodBadge(p.method)}
      </td>

      {/* Column 6: Số tiền */}
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col justify-center">
          <span className="text-[13.5px] font-bold text-slate-900 block whitespace-nowrap">
            {formatCurrency(p.amount)}
          </span>
          {p.refundAmount > 0 && (
            <span className="text-[9.5px] text-blue-650 font-bold block mt-0.5 whitespace-nowrap">
              Hoàn: {formatCurrency(p.refundAmount)}
            </span>
          )}
        </div>
      </td>

      {/* Column 7: Trạng thái */}
      <td className="px-6 py-4 align-middle">
        {getStatusBadge(p.status)}
      </td>

      {/* Column 8: Thao tác Dropdown Menu */}
      <td className="px-6 py-4 text-right align-middle">
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center hover:bg-slate-100/70 text-slate-400 hover:text-slate-800 transition-all rounded-full cursor-pointer focus:ring-0 focus:outline-none border-0 bg-transparent"
              >
                <MoreHorizontal className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border-slate-200 bg-white admin-theme">
              {p.status === PaymentStatus.PENDING && (
                <>
                  <DropdownMenuItem
                    onClick={() => updateStatus({ id: p.id, status: PaymentStatus.SUCCESS })}
                    disabled={isUpdating || !canManage}
                    className="rounded-xl gap-2 py-2 text-xs font-bold text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-all"
                  >
                    <CheckCircle className="h-4 w-4" /> Xác nhận đã thu tiền
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateStatus({ id: p.id, status: PaymentStatus.FAILED })}
                    disabled={isUpdating || !canManage}
                    className="rounded-xl gap-2 py-2 text-xs font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer transition-all mt-0.5"
                  >
                    <XCircle className="h-4 w-4" /> Hủy giao dịch
                  </DropdownMenuItem>
                </>
              )}
              
              {p.status === PaymentStatus.SUCCESS && (
                <DropdownMenuItem
                  onClick={() => updateStatus({ id: p.id, status: PaymentStatus.REFUNDED })}
                  disabled={isUpdating || !canManage}
                  className="rounded-xl gap-2 py-2 text-xs font-bold text-blue-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer transition-all"
                >
                  <RotateCcw className="h-4 w-4" /> Hoàn trả tiền (Refund)
                </DropdownMenuItem>
              )}

              {!hasActions && (
                <div className="px-2 py-2.5 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">
                  Giao dịch kết thúc
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
