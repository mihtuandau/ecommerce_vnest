"use client";

import React, { useState, useMemo } from "react";
import { usePayments, useUpdatePaymentStatus } from "../hooks";
import { Button } from "@/components/ui/Button";
import { PaymentsStats } from "./admin/PaymentsStats";
import { PaymentsToolbar } from "./admin/PaymentsToolbar";
import { PaymentsTable } from "./admin/PaymentsTable";
import { cn } from "@/utils/cn";
import { CreditCard, RefreshCw } from "lucide-react";

export function PaymentsContainer() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [status, setStatus] = useState<string>("ALL");
  const [method, setMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all payments (limit: 1000) WITHOUT server-side filters to allow accurate global statistics and instant cross-searching
  const { data, isLoading, isFetching, refetch } = usePayments({ limit: 1000 });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdatePaymentStatus();

  const allPayments = data?.payments || [];

  // 1. Calculate stats globally using the full list of payments
  const statsPayments = useMemo(() => allPayments, [allPayments]);

  // 2. Perform client-side filtering matching other dashboard list pages
  const filteredPayments = useMemo(() => {
    let result = allPayments;

    // Status filter
    if (status !== "ALL") {
      result = result.filter((p: any) => p.status === status);
    }

    // Method filter
    if (method !== "ALL") {
      result = result.filter((p: any) => p.method === method);
    }

    // Search text query filter
    if (searchQuery) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) => 
        (p.transactionId && p.transactionId.toLowerCase().includes(term)) ||
        (p.order?.orderCode && p.order.orderCode.toLowerCase().includes(term)) ||
        (p.order?.user?.name && p.order.user.name.toLowerCase().includes(term)) ||
        (p.order?.guestEmail && p.order.guestEmail.toLowerCase().includes(term))
      );
    }

    return result;
  }, [allPayments, status, method, searchQuery]);

  // 3. Client-side pagination based on filtered list
  const total = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  // Adjust page index if page is out of bounds after filtering
  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPayments.slice(start, start + limit);
  }, [filteredPayments, currentPage, limit]);

  // Formatting Currency Helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-slate-500" /> Quản lý giao dịch & Đối soát
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kiểm tra trạng thái dòng tiền thanh toán và đối soát dữ liệu với ngân hàng/cổng thanh toán.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-slate-200 h-9 font-semibold text-slate-650 gap-2 hover:bg-slate-50 transition-all shadow-sm"
          disabled={isLoading || isFetching}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} /> Làm mới
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <PaymentsStats payments={statsPayments} formatCurrency={formatCurrency} />

      {/* Filters & Actions Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar (Status, Method, Search) */}
        <PaymentsToolbar
          status={status}
          setStatus={setStatus}
          method={method}
          setMethod={setMethod}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />

        {/* Payments Table with Pagination */}
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
          searchQuery="" // Already filtered on container level
        />
      </div>
    </div>
  );
}
