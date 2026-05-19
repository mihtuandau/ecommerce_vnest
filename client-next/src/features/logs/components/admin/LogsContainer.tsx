"use client";

import React, { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuditLogs } from "../../hooks";
import { LogsStats } from "./LogsStats";
import { LogsToolbar } from "./LogsToolbar";
import { LogsTable } from "./LogsTable";
import { cn } from "@/utils/cn";

export function LogsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entityName, setEntityName] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  // Fetch logs with filters
  const { data, isLoading, refetch, isFetching } = useAuditLogs({
    page,
    limit,
    search: search || undefined,
    action: action || undefined,
    entityName: entityName || undefined,
  });

  const logs = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 15, totalPages: 1 };

  // Calculate statistics for dynamic cards
  const stats = useMemo(() => {
    const total = meta.total || 0;
    return {
      total,
      creates: logs.filter((l: any) => l.action === "POST").length,
      updates: logs.filter((l: any) => ["PATCH", "PUT"].includes(l.action)).length,
      deletes: logs.filter((l: any) => l.action === "DELETE").length,
    };
  }, [meta.total, logs]);

  const handleResetFilters = () => {
    setSearch("");
    setAction("");
    setEntityName("");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
            Nhật ký hoạt động hệ thống
          </h1>
          <p className="text-slate-500 text-sm">
            Camera an ninh ghi lại toàn bộ hoạt động tạo mới, cập nhật hoặc xóa dữ liệu
            của ban quản trị hệ thống.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-slate-600 border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5 mr-2 text-slate-500",
              isFetching && "animate-spin"
            )}
          />
          Làm mới dữ liệu
        </Button>
      </div>

      {/* Dynamic Statistics Cards */}
      <LogsStats stats={stats} />

      {/* Toolbar Filters */}
      <LogsToolbar
        search={search}
        setSearch={setSearch}
        action={action}
        setAction={setAction}
        entityName={entityName}
        setEntityName={setEntityName}
        setPage={setPage}
        handleResetFilters={handleResetFilters}
      />

      {/* Table Data */}
      <LogsTable
        logs={logs}
        isLoading={isLoading}
        page={page}
        limit={limit}
        setPage={setPage}
        meta={meta}
        expandedLogId={expandedLogId}
        setExpandedLogId={setExpandedLogId}
      />
    </div>
  );
}

// Aliasing for compatibility
export { LogsContainer as AdminLogsContainer };
