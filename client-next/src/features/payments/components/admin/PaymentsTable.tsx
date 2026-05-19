"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { PaymentRow } from "./PaymentRow";

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
  updateStatus,
  formatCurrency,
  page,
  totalPages,
  total,
  setPage,
}: PaymentsTableProps) {
  const { can } = usePermission();
  const canManage = can("payment.manage") || can("settings.manage");

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" variant="slate" />
        <p className="text-xs font-semibold text-slate-455">
          Đang tải lịch sử thanh toán...
        </p>
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
          <p className="text-sm font-bold text-slate-800">
            Không tìm thấy giao dịch nào
          </p>
          <p className="text-xs text-slate-455 mt-1 font-medium max-w-[280px]">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc cài đặt bộ lọc để có dữ liệu chính
            xác hơn.
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
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[17%] align-middle">
                Mã giao dịch
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[15%] align-middle">
                Đơn hàng
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[15%] align-middle">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[14%] align-middle">
                Thời gian
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[9%] align-middle">
                Phương thức
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] align-middle">
                Số tiền
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[14%] align-middle">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[4%] text-right align-middle"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p: any) => (
              <PaymentRow
                key={p.id}
                payment={p}
                isUpdating={false}
                updateStatus={updateStatus}
                formatCurrency={formatCurrency}
                canManage={canManage}
              />
            ))}
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
