"use client";

import React, { useMemo, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Button } from "@/components/ui/Button";
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/utils/cn";
import { usePayments, useUpdatePaymentStatus } from "@/features/payments/hooks";
import type { PaymentRecord } from "@/features/payments/types";
import { PaymentsStats } from "@/features/payments/components/admin/PaymentsStats";
import { PaymentsTable } from "@/features/payments/components/admin/PaymentsTable";
import { PaymentsToolbar } from "@/features/payments/components/admin/PaymentsToolbar";

const PAYMENT_PAGE_SIZE = 10;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function AdminPaymentsView() {
  const { can } = usePermission();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [method, setMethod] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, refetch } = usePayments({ limit: 1000 });
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdatePaymentStatus();

  const allPayments = useMemo<PaymentRecord[]>(() => {
    return data?.payments || [];
  }, [data?.payments]);

  const filteredPayments = useMemo(() => {
    let result = allPayments;

    if (status !== "ALL") {
      result = result.filter((payment) => payment.status === status);
    }

    if (method !== "ALL") {
      result = result.filter((payment) => payment.method === method);
    }

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter(
        (payment) =>
          payment.transactionId?.toLowerCase().includes(term) ||
          payment.order?.orderCode?.toLowerCase().includes(term) ||
          payment.order?.user?.name?.toLowerCase().includes(term) ||
          payment.order?.guestEmail?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [allPayments, status, method, searchQuery]);

  const total = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(total / PAYMENT_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * PAYMENT_PAGE_SIZE;
    return filteredPayments.slice(start, start + PAYMENT_PAGE_SIZE);
  }, [filteredPayments, currentPage]);

  if (!can("payment.view") && !can("settings.manage")) {
    return <AccessDenied permission="payment.view" />;
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-slate-500" />
            Quản lý giao dịch & Đối soát
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kiểm tra trạng thái dòng tiền thanh toán và đối soát dữ liệu với
            ngân hàng/cổng thanh toán.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-slate-200 h-9 font-semibold text-slate-650 gap-2 hover:bg-slate-50 transition-all shadow-sm"
          disabled={isLoading || isFetching}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
          />
          Làm mới
        </Button>
      </div>

      <PaymentsStats payments={allPayments} formatCurrency={formatCurrency} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <PaymentsToolbar
          status={status}
          setStatus={setStatus}
          method={method}
          setMethod={setMethod}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />

        <PaymentsTable
          payments={paginatedPayments}
          isLoading={isLoading}
          isFetching={isFetching}
          isUpdating={isUpdating}
          updateStatus={updateStatus}
          formatCurrency={formatCurrency}
          page={currentPage}
          totalPages={totalPages}
          total={total}
          setPage={setPage}
          searchQuery=""
        />
      </div>
    </div>
  );
}
