"use client";

import React, { useState, useEffect } from "react";
import { returnsApi } from "@/features/returns/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { 
  RotateCcw, Eye, CheckCircle2, XCircle, Search, 
  Filter, Calendar, ArrowUpRight, AlertCircle 
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { ReturnStatus } from "@/types/enums";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { RETURN_STATUS_CONFIG } from "@/features/returns/constants";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const { success, error } = useToast();

  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const res = await returnsApi.getAllReturns({ 
        status: filterStatus || undefined,
        limit: 100 
      } as any);
      setReturns(res.data || []);
    } catch (err) {
      error("Không thể tải danh sách yêu cầu trả hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await returnsApi.updateReturnStatus(id, { status });
      success("Đã cập nhật trạng thái");
      fetchReturns();
    } catch (err) {
      error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <RotateCcw size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý Đổi/Trả hàng</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">Theo dõi và xử lý các yêu cầu hoàn tiền từ khách hàng</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer hover:border-primary/50"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(RETURN_STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
           </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-200">
              <TableHead className="font-semibold text-slate-700 py-4 h-11">Đơn hàng</TableHead>
              <TableHead className="font-semibold text-slate-700 h-11">Khách hàng</TableHead>
              <TableHead className="font-semibold text-slate-700 h-11">Lý do</TableHead>
              <TableHead className="font-semibold text-slate-700 h-11">Giá trị</TableHead>
              <TableHead className="font-semibold text-slate-700 h-11">Ngày yêu cầu</TableHead>
              <TableHead className="font-semibold text-slate-700 h-11">Trạng thái</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 pr-6 h-11">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="lg" />
                    <p className="text-[13px] font-medium text-slate-400">Đang tải dữ liệu...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : returns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                      <RotateCcw size={28} />
                    </div>
                    <p className="text-[13px] font-medium text-slate-400">Không tìm thấy yêu cầu nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              returns.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">#{item.order?.orderCode}</span>
                      <Link href={`/admin/orders/${item.orderId}`} className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium mt-0.5">
                        Chi tiết đơn <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">{item.user?.name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{item.user?.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] text-slate-600 font-medium line-clamp-1 max-w-[200px]" title={item.reason}>
                      {item.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.order?.total)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={13} />
                      <span className="text-xs font-medium">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-lg px-2 py-1 font-semibold text-[10px] border",
                      RETURN_STATUS_CONFIG[item.status as ReturnStatus]?.color
                    )}>
                      {RETURN_STATUS_CONFIG[item.status as ReturnStatus]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                       {item.status === ReturnStatus.PENDING && (
                         <>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, ReturnStatus.APPROVED)}
                              className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Phê duyệt"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, ReturnStatus.REJECTED)}
                              className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              title="Từ chối"
                            >
                              <XCircle size={15} />
                            </button>
                         </>
                       )}
                       {item.status === ReturnStatus.APPROVED && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, ReturnStatus.RETURNING)}
                            className="h-8 px-3 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-semibold flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                            Khách đang gửi
                          </button>
                       )}
                       {item.status === ReturnStatus.RETURNING && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, ReturnStatus.RECEIVED)}
                            className="h-8 px-3 rounded-lg bg-cyan-50 text-cyan-600 text-[11px] font-semibold flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                          >
                            Đã nhận hàng
                          </button>
                       )}
                       {item.status === ReturnStatus.RECEIVED && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, ReturnStatus.COMPLETED)}
                            className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-semibold flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            Hoàn tất
                          </button>
                       )}
                       <Link href={`/admin/returns/${item.id}`}>
                         <button className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-[#0f172a] hover:text-white transition-all shadow-sm border border-slate-200">
                           <Eye size={15} />
                         </button>
                       </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
           <AlertCircle size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900">Chính sách đổi trả hàng</h4>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Khi phê duyệt yêu cầu trả hàng, hãy đảm bảo khách hàng đã cung cấp đầy đủ hình ảnh bằng chứng về tình trạng sản phẩm. 
            Hệ thống sẽ cập nhật trạng thái đơn hàng tương ứng khi bạn thay đổi trạng thái yêu cầu.
          </p>
        </div>
      </div>
    </div>
  );
}
