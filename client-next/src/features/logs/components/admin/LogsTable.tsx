"use client";

import React, { useState } from "react";
import { Laptop, Eye, Terminal, ChevronLeft, ChevronRight, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

import {
  AUDIT_LOG_ENTITY_MAPPING,
  AUDIT_LOG_ACTION_TEXTS,
  AUDIT_LOG_KEY_TRANSLATIONS,
} from "@/features/logs/constants";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface LogsTableProps {
  logs: any[];
  isLoading: boolean;
  page: number;
  limit: number;
  setPage: (page: number | ((p: number) => number)) => void;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  expandedLogId: number | null;
  setExpandedLogId: (id: number | null) => void;
}

export function LogsTable({
  logs,
  isLoading,
  page,
  limit,
  setPage,
  meta,
  expandedLogId,
  setExpandedLogId,
}: LogsTableProps) {
  const [showRawJsonMap, setShowRawJsonMap] = useState<Record<number, boolean>>({});

  const toggleRawJson = (id: number) => {
    setShowRawJsonMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const translateKey = (key: string): string => {
    return AUDIT_LOG_KEY_TRANSLATIONS[key] || key;
  };

  const formatValue = (key: string, val: any) => {
    if (typeof val === "boolean") {
      return val ? (
        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Kích hoạt
        </span>
      ) : (
        <span className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Vô hiệu hóa
        </span>
      );
    }

    if (val === null || val === undefined) {
      return (
        <span className="text-slate-400 italic font-normal text-xs">Chưa điền</span>
      );
    }

    if (
      ["price", "fixedAmount", "minOrderValue"].includes(key) &&
      typeof val === "number"
    ) {
      return (
        <span className="text-slate-800 font-bold text-xs">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(val)}
        </span>
      );
    }

    if (typeof val === "object") {
      return (
        <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
          [Object/Array Data]
        </span>
      );
    }

    return (
      <span className="text-slate-700 font-semibold text-xs leading-relaxed break-all">
        {String(val)}
      </span>
    );
  };

  const formatEntityName = (name: string) => {
    return AUDIT_LOG_ENTITY_MAPPING[name] || name;
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
    return AUDIT_LOG_ACTION_TEXTS[act] || act;
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
    else if (ua.includes("Macintosh") || ua.includes("Mac OS X"))
      os = "macOS (Apple Mac)";
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
    <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" variant="slate" />
            <p className="text-xs text-slate-400">Đang tải nhật ký hệ thống...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <EyeOff className="h-12 w-12 text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy bản ghi nào
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc các tiêu chí bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[22%] align-middle">
                  Nhân viên
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[11%] align-middle">
                  Phương thức
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] align-middle">
                  Bảng dữ liệu
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[12%] align-middle">
                  ID Entity
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[15%] align-middle">
                  IP Address
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[18%] align-middle">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-[10%] text-right align-middle">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log: any) => {
                const isExpanded = expandedLogId === log.id;
                const formattedTime = dayjs(log.createdAt).format("HH:mm - DD/MM/YYYY");
                const relative = dayjs(log.createdAt).fromNow();
                const actor = log.user || {
                  name: "Hệ thống",
                  email: "system@dautuan.com",
                  role: "SYSTEM",
                };

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/30 transition-colors">
                      
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-500 shrink-0 text-xs shadow-xs">
                            {actor.name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {actor.name || "Hệ thống"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {actor.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      
                      <td className="px-6 py-4 align-middle">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase inline-flex items-center",
                            getActionBadgeColor(log.action)
                          )}
                        >
                          {getActionText(log.action)}
                        </span>
                      </td>

                      
                      <td className="px-6 py-4 align-middle">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[8px] rounded border border-slate-200">
                          {formatEntityName(log.entityName)}
                        </span>
                      </td>

                      
                      <td className="px-6 py-4 font-mono text-xs text-slate-550 font-semibold align-middle">
                        {log.entityId === "N/A" ? "N/A" : `#${log.entityId}`}
                      </td>

                      
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <Laptop size={12} className="text-slate-400" />
                          <span className="font-mono text-[10px]">
                            {log.ipAddress === "::1"
                              ? "127.0.0.1 (Local)"
                              : log.ipAddress || "N/A"}
                          </span>
                        </div>
                      </td>

                      
                      <td className="px-6 py-4 align-middle">
                        <div>
                          <p className="text-xs font-bold text-slate-700">{relative}</p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                            {formattedTime}
                          </p>
                        </div>
                      </td>

                      
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-0 bg-transparent focus:ring-0 focus:outline-none",
                              isExpanded
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : "text-slate-400 hover:text-indigo-650 hover:bg-slate-50"
                            )}
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            title={isExpanded ? "Đóng chi tiết" : "Xem chi tiết"}
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={7} className="px-8 py-6 border-b border-slate-100">
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-6 space-y-5 max-w-4xl animate-in slide-in-from-top-2 duration-300">
                            
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                  <Terminal size={16} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-850">
                                    Thông tin thay đổi chi tiết
                                  </h4>
                                  <p className="text-[10px] text-slate-455 font-semibold mt-0.5 uppercase tracking-wider">
                                    Bảng: {log.entityName} • Hành động:{" "}
                                    {getActionText(log.action)}
                                  </p>
                                </div>
                              </div>

                              
                              {log.newData && Object.keys(log.newData).length > 0 && (
                                <button
                                  onClick={() => toggleRawJson(log.id)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-xs",
                                    showRawJsonMap[log.id]
                                      ? "bg-slate-900 border-slate-950 text-emerald-450 hover:bg-slate-800"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  {showRawJsonMap[log.id]
                                    ? "💻 Xem giao diện thân thiện"
                                    : "💻 Xem dữ liệu JSON gốc"}
                                </button>
                              )}
                            </div>

                            
                            {showRawJsonMap[log.id] ? (
                              /* Dark JSON block */
                              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-inner space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3">
                                  <span className="flex items-center gap-2 text-[10px] text-slate-500">
                                    📡 Payload Data chi tiết (JSON gốc)
                                  </span>
                                  <span className="font-mono text-[9px] lowercase text-slate-500">
                                    actor_id: {log.userId} • target:{" "}
                                    {log.entityName.toLowerCase()}
                                  </span>
                                </div>
                                <div className="font-mono text-xs text-emerald-450 leading-relaxed overflow-x-auto max-h-[300px] scrollbar-thin">
                                  <pre className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                                    {JSON.stringify(log.newData, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            ) : (
                              /* Friendly human-readable grid */
                              <div>
                                {log.action === "LOGIN" && log.newData?.userAgent ? (
                                  (() => {
                                    const { browser, os } = parseUserAgent(
                                      log.newData.userAgent
                                    );
                                    return (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shadow-xs">
                                              💻
                                            </div>
                                            <div>
                                              <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">
                                                Hệ điều hành
                                              </p>
                                              <p className="text-xs font-bold text-slate-805 mt-0.5">
                                                {os}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-100 shadow-xs">
                                              🌐
                                            </div>
                                            <div>
                                              <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">
                                                Trình duyệt sử dụng
                                              </p>
                                              <p className="text-xs font-bold text-slate-805 mt-0.5">
                                                {browser}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 font-mono text-[10px] text-slate-500 break-all leading-normal whitespace-pre-wrap">
                                          <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1.5 text-[9px]">
                                            Chuỗi nhận diện trình duyệt gốc (User
                                            Agent):
                                          </span>
                                          {log.newData.userAgent}
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : log.newData &&
                                  Object.keys(log.newData).length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(log.newData).map(([key, val]) => (
                                      <div
                                        key={key}
                                        className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200/40 transition-colors flex flex-col justify-center"
                                      >
                                        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">
                                          {translateKey(key)}
                                        </span>
                                        <div className="mt-0.5">
                                          {formatValue(key, val)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-slate-400 italic text-xs py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60">
                                    Không có trường thông tin payload nào được cập nhật
                                    cho hành động này.
                                  </div>
                                )}
                              </div>
                            )}

                            
                            <div className="text-[10px] font-bold text-slate-455 uppercase tracking-wider flex items-center gap-2 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                              <span>
                                Gợi ý: Hệ thống mã hóa thông tin bảo mật và giám sát
                                thao tác nhân viên theo tiêu chuẩn an ninh Vnest.
                              </span>
                            </div>
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

      
      {meta.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <p className="text-xs text-slate-500 font-medium">
            Đang hiển thị bản ghi{" "}
            <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> -{" "}
            <span className="font-bold text-slate-700">
              {Math.min(page * limit, meta.total)}
            </span>{" "}
            trong tổng số <span className="font-bold text-slate-700">{meta.total}</span>{" "}
            lượt.
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
                    "h-9 w-9 p-0 rounded-lg font-bold transition-all text-xs cursor-pointer",
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
              className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={page === meta.totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
