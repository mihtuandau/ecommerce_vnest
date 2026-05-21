"use client";

import React, { useMemo, useState } from "react";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Spinner } from "@/components/ui/Spinner";
import { OrderStatusChart } from "@/features/dashboard/components/admin";
import { usePermission } from "@/hooks/usePermission";
import { reportsApi } from "@/features/reports/api/index";
import { REPORT_TIME_RANGES } from "@/features/reports/constants/index";
import { useReportSummary } from "@/features/reports/hooks";
import type { ReportQueryParams } from "@/features/reports/types";
import { ReportHeader } from "@/features/reports/components/ReportHeader";
import { RevenueChart } from "@/features/reports/components/RevenueChart";
import { StatCards } from "@/features/reports/components/StatCards";
import { TopProductsList } from "@/features/reports/components/TopProductsList";

function getReportParams(timeRange: string): ReportQueryParams | undefined {
  const now = new Date();

  switch (timeRange) {
    case REPORT_TIME_RANGES.THIRTY_DAYS: {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    case REPORT_TIME_RANGES.THREE_MONTHS: {
      const start = new Date();
      start.setMonth(now.getMonth() - 3);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    case REPORT_TIME_RANGES.ONE_YEAR: {
      const start = new Date();
      start.setFullYear(now.getFullYear() - 1);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    default:
      return undefined;
  }
}

export function AdminReportsView() {
  const { can } = usePermission();
  const [timeRange, setTimeRange] = useState<string>(
    REPORT_TIME_RANGES.THIRTY_DAYS
  );

  const params = useMemo(() => getReportParams(timeRange), [timeRange]);
  const { data: summary, isLoading, refetch, isFetching } =
    useReportSummary(params);

  const handleExport = async () => {
    try {
      const responseData = await reportsApi.exportReport(params);
      const blob = new Blob([responseData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Bao_cao_LUXE_${timeRange}_${dateStr}.xlsx`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  if (!can("report.view")) return <AccessDenied permission="report.view" />;

  return (
    <div className="space-y-8 pb-10">
      <ReportHeader
        onRefresh={refetch}
        onExport={handleExport}
        isFetching={isFetching}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {isLoading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
          <Spinner size="lg" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            Đang phân tích dữ liệu...
          </p>
        </div>
      ) : (
        <>
          <StatCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 h-full">
              <RevenueChart params={params} />
            </div>
            <div className="lg:col-span-1 h-full">
              <OrderStatusChart
                data={summary?.ordersByStatus || []}
                isLoading={isLoading}
              />
            </div>
          </div>

          <TopProductsList params={params} />
        </>
      )}
    </div>
  );
}
