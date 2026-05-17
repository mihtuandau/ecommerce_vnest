"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
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
import { usePermission } from "@/hooks/usePermission";
import dayjs from "@/lib/dayjs";

interface PaymentsTableProps {
  payments: any[];
  isLoading: boolean;
  isFetching: boolean;
  isUpdating: boolean;
  updateStatus: (data: { id: number; status: string }) => void;
  formatCurrency: (val: number) => string;
  page: number;
  totalPages: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
}

export function PaymentsTable({
  payments,
  isLoading,
  isFetching,
  isUpdating,
  updateStatus,
  formatCurrency,
  page,
  totalPages,
  total,
  setPage,
}: PaymentsTableProps) {
  const { can } = usePermission();
  const canManage = can("payment.manage") || can("settings.manage");
  
  // Status Style Helper using standard Lucide Icons
  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap">
            <CheckCircle className="h-3.5 w-3.5" /> Thành công
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 whitespace-nowrap">
            <AlertCircle className="h-3.5 w-3.5 animate-pulse" /> Chờ xử lý
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 whitespace-nowrap">
            <XCircle className="h-3.5 w-3.5" /> Thất bại
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap">
            <Coins className="h-3.5 w-3.5" /> Đã hoàn tiền
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
            <XCircle className="h-3.5 w-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-650 border border-slate-200 whitespace-nowrap">
            <HelpCircle className="h-3.5 w-3.5" /> {statusStr}
          </span>
        );
    }
  };

  // Method Style Helper using Lucide Icons matching exactly the Prisma Schema Enums
  const getMethodBadge = (methodStr: string) => {
    switch (methodStr) {
      case "CASH":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-650 font-bold whitespace-nowrap">
            <Banknote className="h-3.5 w-3.5 text-slate-450" /> COD
          </span>
        );
      case "CARD":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-teal-650 font-bold whitespace-nowrap">
            <CreditCard className="h-3.5 w-3.5 text-teal-450" /> Thẻ CARD
          </span>
        );
      case "VNPAY":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-sky-655 font-bold whitespace-nowrap">
            <CreditCard className="h-3.5 w-3.5 text-sky-450" /> VNPay
          </span>
        );
      case "MOMO":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-pink-650 font-bold whitespace-nowrap">
            <Smartphone className="h-3.5 w-3.5 text-pink-400" /> MoMo
          </span>
        );
      case "PAYOS":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-amber-650 font-bold whitespace-nowrap">
            <Zap className="h-3.5 w-3.5 text-amber-450" /> PayOS
          </span>
        );
      case "BANK":
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-indigo-650 font-bold whitespace-nowrap">
            <Landmark className="h-3.5 w-3.5 text-indigo-450" /> Chuyển khoản
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-550 font-bold whitespace-nowrap">
            <CreditCard className="h-3.5 w-3.5 text-slate-450" /> {methodStr}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" variant="slate" />
        <p className="text-xs font-semibold text-slate-455">Đang tải lịch sử thanh toán...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-slate-350" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Không tìm thấy giao dịch nào</p>
          <p className="text-xs text-slate-455 mt-1 font-medium max-w-[280px]">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc cài đặt bộ lọc để có dữ liệu chính xác hơn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[17%] align-middle">Mã giao dịch</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[15%] align-middle">Đơn hàng</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[15%] align-middle">Khách hàng</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[14%] align-middle">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[9%] align-middle">Phương thức</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] align-middle">Số tiền</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[14%] align-middle">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[4%] text-right align-middle"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p: any) => {
              const customerName = p.order?.user?.name 
                ? p.order.user.name 
                : p.order?.guestEmail || "Khách vãng lai";

              const hasActions = p.status === "PENDING" || p.status === "SUCCESS";

              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
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

                  {/* Column 8: Thao tác Dropdown Menu (Nút bare không border) */}
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
                          {p.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => updateStatus({ id: p.id, status: "SUCCESS" })}
                                disabled={isUpdating || !canManage}
                                className="rounded-xl gap-2 py-2 text-xs font-bold text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer transition-all"
                              >
                                <CheckCircle className="h-4 w-4" /> Xác nhận đã thu tiền
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateStatus({ id: p.id, status: "FAILED" })}
                                disabled={isUpdating || !canManage}
                                className="rounded-xl gap-2 py-2 text-xs font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer transition-all mt-0.5"
                              >
                                <XCircle className="h-4 w-4" /> Hủy giao dịch
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {p.status === "SUCCESS" && (
                            <DropdownMenuItem
                              onClick={() => updateStatus({ id: p.id, status: "REFUNDED" })}
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
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-455 font-bold">
            Hiển thị trang {page}/{totalPages} (Tổng số {total} giao dịch)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-lg border-slate-200 p-0 flex items-center justify-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-lg border-slate-200 p-0 flex items-center justify-center"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
