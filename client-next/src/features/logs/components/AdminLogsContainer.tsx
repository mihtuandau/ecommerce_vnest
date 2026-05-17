"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Eye, Filter, ArrowRight, RefreshCw, 
  ChevronLeft, ChevronRight, History, Calendar, 
  Terminal, ShieldAlert, Laptop, EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useAuditLogs } from "../hooks";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export function AdminLogsContainer() {
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
    
    // We can show aggregate statistics for a premium aesthetic
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

  const formatEntityName = (name: string) => {
    const mapping: Record<string, string> = {
      USERS: "Người dùng",
      PRODUCTS: "Sản phẩm",
      CATEGORIES: "Danh mục",
      DISCOUNTS: "Khuyến mãi",
      ORDERS: "Đơn hàng",
      PAYMENTS: "Thanh toán",
      SHIPPING: "Vận chuyển",
      RETURNS: "Đổi trả",
      SETTINGS: "Cài đặt",
    };
    return mapping[name] || name;
  };

  const getActionBadgeColor = (act: string) => {
    switch (act) {
      case "POST":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    }
  };

  const getActionText = (act: string) => {
    switch (act) {
      case "POST":
        return "TẠO MỚI";
      case "DELETE":
        return "XÓA";
      case "PATCH":
      case "PUT":
        return "CẬP NHẬT";
      default:
        return act;
    }
  };

  const parseUserAgent = (ua: string) => {
    if (!ua) return { browser: "Không xác định", os: "Không xác định" };
    
    let browser = "Không xác định";
    let os = "Không xác định";
    
    // OS detection
    if (ua.includes("Windows NT 10.0")) os = "Windows 10 / 11";
    else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
    else if (ua.includes("Windows NT 6.2")) os = "Windows 8";
    else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) os = "macOS (Apple Mac)";
    else if (ua.includes("iPhone")) os = "iPhone (iOS)";
    else if (ua.includes("iPad")) os = "iPad (iOS)";
    else if (ua.includes("Android")) os = "Android OS";
    else if (ua.includes("Linux")) os = "Linux OS";
    
    // Browser detection
    if (ua.includes("Edg/")) {
      const match = ua.match(/Edg\/([0-9.]+)/);
      browser = `Microsoft Edge ${match ? match[1].split(".")[0] : ""}`;
    } else if (ua.includes("Chrome/")) {
      const match = ua.match(/Chrome\/([0-9.]+)/);
      browser = `Google Chrome ${match ? match[1].split(".")[0] : ""}`;
    } else if (ua.includes("Firefox/")) {
      const match = ua.match(/Firefox\/([0-9.]+)/);
      browser = `Mozilla Firefox ${match ? match[1].split(".")[0] : ""}`;
    } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
      const match = ua.match(/Version\/([0-9.]+)/);
      browser = `Apple Safari ${match ? match[1] : ""}`;
    } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
      browser = "Opera";
    }
    
    return { browser, os };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <History className="h-7 w-7 text-indigo-600" />
            Nhật ký hoạt động hệ thống
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1.5 leading-relaxed max-w-xl">
            Camera an ninh ghi lại toàn bộ hoạt động tạo mới, cập nhật hoặc xóa dữ liệu của ban quản trị hệ thống.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-slate-600 border-slate-200 shadow-sm hover:border-slate-300"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-3.5 w-3.5 mr-2 text-slate-500", isFetching && "animate-spin")} />
          Làm mới dữ liệu
        </Button>
      </div>

      {/* Dynamic Statistics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng lượt thao tác</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-sm">
              <History size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo mới (POST)</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.creates}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-sm">
              <Calendar size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật (PATCH)</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.updates}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-sm">
              <Terminal size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xóa bỏ (DELETE)</p>
              <h3 className="text-2xl font-black text-rose-600">{stats.deletes}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-sm">
              <ShieldAlert size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Options */}
      <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450 group-focus-within:text-indigo-650 transition-colors" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm theo nhân viên, ID hoặc hành động..."
              className="pl-10 h-11 bg-slate-550/30 border-slate-100 hover:border-slate-200 focus-visible:ring-indigo-600 focus-visible:bg-white rounded-xl text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter by Action */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={action}
                onChange={(e) => { setAction(e.target.value); setPage(1); }}
                className="h-11 px-3 bg-slate-550/30 border border-slate-100 rounded-xl text-xs font-semibold text-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Tất cả Hành động</option>
                <option value="POST">POST (Tạo mới)</option>
                <option value="PATCH">PATCH (Cập nhật)</option>
                <option value="DELETE">DELETE (Xóa)</option>
              </select>
            </div>

            {/* Filter by Entity */}
            <select
              value={entityName}
              onChange={(e) => { setEntityName(e.target.value); setPage(1); }}
              className="h-11 px-3 bg-slate-550/30 border border-slate-100 rounded-xl text-xs font-semibold text-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Tất cả Bảng</option>
              <option value="USERS">Người dùng</option>
              <option value="PRODUCTS">Sản phẩm</option>
              <option value="CATEGORIES">Danh mục</option>
              <option value="DISCOUNTS">Khuyến mãi</option>
              <option value="ORDERS">Đơn hàng</option>
              <option value="PAYMENTS">Thanh toán</option>
              <option value="SHIPPING">Vận chuyển</option>
              <option value="RETURNS">Đổi trả</option>
            </select>

            {(search || action || entityName) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-11 px-4 text-xs font-bold text-slate-450 hover:text-rose-600 rounded-xl hover:bg-rose-50/50"
                onClick={handleResetFilters}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Logs Table */}
      <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải nhật ký...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <EyeOff className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy bản ghi nào</h3>
              <p className="text-xs text-slate-450 mt-1 max-w-sm">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc các tiêu chí bộ lọc đã chọn.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nhân viên</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Phương thức</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Bảng dữ liệu</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID Entity</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">IP Address</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log: any) => {
                  const isExpanded = expandedLogId === log.id;
                  const formattedTime = dayjs(log.createdAt).format("HH:mm - DD/MM/YYYY");
                  const relative = dayjs(log.createdAt).fromNow();
                  const actor = log.user || { name: "Hệ thống", email: "system@dautuan.com", role: "SYSTEM" };

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        {/* Actor Profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-500 shrink-0 text-xs shadow-xs">
                              {actor.name?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{actor.name || "Hệ thống"}</p>
                              <p className="text-[10px] text-slate-450 font-medium truncate mt-0.5">{actor.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action badge */}
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg border text-[9px] font-bold tracking-wider uppercase inline-flex items-center",
                            getActionBadgeColor(log.action)
                          )}>
                            {getActionText(log.action)}
                          </span>
                        </td>

                        {/* Entity badge */}
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[8px] rounded border border-slate-200">
                            {formatEntityName(log.entityName)}
                          </span>
                        </td>

                        {/* Entity ID */}
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-500 font-semibold">
                          #{log.entityId}
                        </td>

                        {/* IP Address */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                            <Laptop size={12} className="text-slate-400" />
                            <span className="font-mono text-[10px]">{log.ipAddress === "::1" ? "127.0.0.1 (Local)" : log.ipAddress || "N/A"}</span>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{relative}</p>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">{formattedTime}</p>
                          </div>
                        </td>

                        {/* Toggle button */}
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                              isExpanded 
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                                : "text-indigo-650 hover:bg-indigo-50"
                            )}
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          >
                            <Eye size={12} className="mr-1.5 shrink-0" />
                            {isExpanded ? "Đóng" : "Xem"}
                          </Button>
                        </td>
                      </tr>

                      {/* Log details expansion panel */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="px-8 py-6 border-b border-slate-100">
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-inner space-y-4 max-w-4xl animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3">
                                <span className="flex items-center gap-2">
                                  <Terminal size={14} className="text-emerald-500" />
                                  Payload Data chi tiết của Lệnh ({log.action})
                                </span>
                                <span className="font-mono text-[10px] lowercase text-slate-500">
                                  actor_id: {log.userId} • target: {log.entityName.toLowerCase()}
                                </span>
                              </div>

                              <div className="font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto max-h-[300px] scrollbar-thin">
                                {log.action === "LOGIN" && log.newData?.userAgent ? (
                                  (() => {
                                    const { browser, os } = parseUserAgent(log.newData.userAgent);
                                    return (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-slate-300 w-full">
                                        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                                            💻
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Hệ điều hành</p>
                                            <p className="text-xs font-bold text-slate-200 mt-0.5">{os}</p>
                                          </div>
                                        </div>
                                        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                                            🌐
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Trình duyệt</p>
                                            <p className="text-xs font-bold text-slate-200 mt-0.5">{browser}</p>
                                          </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-2 p-3.5 bg-slate-950/20 rounded-xl border border-slate-800/40 font-mono text-[10px] text-slate-500 break-all leading-normal whitespace-pre-wrap">
                                          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[8px]">Chuỗi nhận diện trình duyệt gốc:</span>
                                          {log.newData.userAgent}
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : log.newData && Object.keys(log.newData).length > 0 ? (
                                  <pre className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                                    {JSON.stringify(log.newData, null, 2)}
                                  </pre>
                                ) : (
                                  <span className="text-slate-500 italic block py-4 text-center">
                                    Không có trường thông tin payload nào được cập nhật.
                                  </span>
                                )}
                              </div>

                              {log.newData && Object.keys(log.newData).length > 0 && (
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mt-2 bg-slate-950/20 p-2.5 rounded-lg border border-slate-800/40">
                                  💡 <span>Gợi ý: Toàn bộ lịch sử các thao tác được ghi đè và lưu giữ dưới dạng dữ liệu nén JSON bảo mật.</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginated Footer */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <p className="text-xs text-slate-450 font-medium">
              Đang hiển thị bản ghi <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> -{" "}
              <span className="font-bold text-slate-700">{Math.min(page * limit, meta.total)}</span> trong tổng số{" "}
              <span className="font-bold text-slate-700">{meta.total}</span> lượt.
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              {Array.from({ length: meta.totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <Button
                    key={pNum}
                    variant={page === pNum ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9 p-0 rounded-lg font-bold transition-all text-xs",
                      page === pNum 
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700" 
                        : "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    )}
                    onClick={() => setPage(pNum)}
                  >
                    {pNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50"
                onClick={() => setPage(p => Math.min(p + 1, meta.totalPages))}
                disabled={page === meta.totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
