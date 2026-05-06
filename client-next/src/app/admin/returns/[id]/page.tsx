"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { returnsApi } from "@/features/returns/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { 
  ArrowLeft, RotateCcw, Calendar, User, ShoppingBag, 
  CheckCircle2, XCircle, Loader2, MessageSquare, Image as ImageIcon 
} from "lucide-react";
import Image from "next/image";
import { ReturnStatus } from "@/types/enums";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import Link from "next/link";
import { cn } from "@/utils/cn";

const statusConfig: Record<string, { label: string; color: string }> = {
  [ReturnStatus.PENDING]: { label: "Chờ duyệt", color: "bg-amber-50 text-amber-600 border-amber-100" },
  [ReturnStatus.APPROVED]: { label: "Đã duyệt", color: "bg-blue-50 text-blue-600 border-blue-100" },
  [ReturnStatus.REJECTED]: { label: "Từ chối", color: "bg-rose-50 text-rose-600 border-rose-100" },
  [ReturnStatus.RETURNING]: { label: "Khách đang gửi hàng", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  [ReturnStatus.RECEIVED]: { label: "Shop đã nhận hàng", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  [ReturnStatus.COMPLETED]: { label: "Hoàn tất", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

export default function AdminReturnDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await returnsApi.getReturnDetail(+id);
      setRequest(res);
      setAdminNote(res.adminNote || "");
    } catch (err) {
      error("Không thể tải chi tiết yêu cầu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setIsSubmitting(true);
    try {
      await returnsApi.updateReturnStatus(+id, { status, adminNote });
      success("Đã cập nhật trạng thái");
      fetchDetail();
    } catch (err) {
      error("Lỗi khi cập nhật trạng thái");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-[13px] font-medium text-slate-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!request) return <div className="p-20 text-center font-medium text-slate-500">Không tìm thấy yêu cầu</div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Chi tiết yêu cầu trả hàng</h1>
              <Badge variant="outline" className={cn(
                "rounded-lg px-2.5 py-1 border font-semibold text-[10px]",
                statusConfig[request.status]?.color
              )}>
                {statusConfig[request.status]?.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">Yêu cầu tạo bởi {request.user?.name} • Mã đơn #{request.order?.orderCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {request.status === ReturnStatus.PENDING && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus(ReturnStatus.REJECTED)}
                disabled={isSubmitting}
                className="h-10 rounded-lg px-5 font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 text-[13px]"
              >
                <XCircle className="mr-2 h-4 w-4" /> Từ chối
              </Button>
              <Button 
                onClick={() => handleUpdateStatus(ReturnStatus.APPROVED)}
                disabled={isSubmitting}
                className="h-10 rounded-lg px-5 font-semibold bg-[#1565C0] hover:bg-slate-800 shadow-sm text-[13px]"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Phê duyệt
              </Button>
            </>
          )}
          {request.status === ReturnStatus.APPROVED && (
            <Button 
              onClick={() => handleUpdateStatus(ReturnStatus.RETURNING)}
              disabled={isSubmitting}
              className="h-10 rounded-lg px-6 font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm text-[13px]"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Khách đang gửi hàng
            </Button>
          )}
          {request.status === ReturnStatus.RETURNING && (
            <Button 
              onClick={() => handleUpdateStatus(ReturnStatus.RECEIVED)}
              disabled={isSubmitting}
              className="h-10 rounded-lg px-6 font-semibold bg-cyan-600 hover:bg-cyan-700 shadow-sm text-[13px]"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Shop đã nhận hàng
            </Button>
          )}
          {request.status === ReturnStatus.RECEIVED && (
            <Button 
              onClick={() => handleUpdateStatus(ReturnStatus.COMPLETED)}
              disabled={isSubmitting}
              className="h-10 rounded-lg px-6 font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-[13px]"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Hoàn tất & Hoàn tiền
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Request Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reason & Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900">
              <MessageSquare size={18} className="text-primary" />
              <h3 className="text-base font-semibold tracking-tight">Thông tin yêu cầu</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 block mb-1">Lý do chính</span>
                <p className="text-[13px] font-semibold text-slate-900">{request.reason}</p>
              </div>
              
              <div className="space-y-1.5 px-0.5">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 block">Mô tả chi tiết</span>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  {request.details || "Không có mô tả thêm từ khách hàng."}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Images */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900">
              <ImageIcon size={18} className="text-primary" />
              <h3 className="text-base font-semibold tracking-tight">Hình ảnh bằng chứng</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {request.images?.length > 0 ? (
                request.images.map((url: string, i: number) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 group cursor-zoom-in shadow-sm relative">
                    <Image 
                      src={url} 
                      alt={`Evidence ${i+1}`} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onClick={() => window.open(url, "_blank")}
                      sizes="200px"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[13px] font-medium text-slate-400">Không có hình ảnh đính kèm</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Note Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <RotateCcw size={14} />
              </div>
              <h3 className="text-base font-semibold tracking-tight">Xử lý yêu cầu</h3>
            </div>
            
            <div className="space-y-3">
               <Label className="text-[10px] font-semibold text-slate-400 tracking-wider">Ghi chú của quản trị viên</Label>
               <Textarea 
                 value={adminNote}
                 onChange={(e) => setAdminNote(e.target.value)}
                 placeholder="Nhập lý do phê duyệt hoặc từ chối..."
                 className="min-h-[100px] !bg-white !border-[0.5px] !border-slate-200 !text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:!ring-0 focus-visible:!border-primary/50 transition-all outline-none !ring-offset-0 text-[13px]"
               />
               <p className="text-[10px] text-slate-500 font-medium italic">Ghi chú này sẽ được hiển thị cho khách hàng xem.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Customer & Order Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
              <User size={16} className="text-primary" />
              <h3 className="text-[13px] font-semibold text-slate-900">Khách hàng</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                  {request.user?.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">{request.user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{request.user?.email}</p>
                </div>
              </div>
              <div className="pt-1 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Số điện thoại:</span>
                  <span className="text-slate-900 font-semibold">{request.user?.phone || "--"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
              <ShoppingBag size={16} className="text-primary" />
              <h3 className="text-[13px] font-semibold text-slate-900">Đơn hàng liên quan</h3>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">Mã đơn:</span>
                <span className="text-[13px] font-bold text-slate-900">#{request.order?.orderCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">Tổng thanh toán:</span>
                <span className="text-[13px] font-bold text-primary">{formatCurrency(request.order?.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[11px] text-slate-400 font-medium">Ngày đặt:</span>
                 <span className="text-[11px] font-semibold text-slate-900">{new Date(request.order?.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <Button asChild variant="outline" className="w-full rounded-lg h-9 text-[11px] font-semibold mt-2 border-slate-200">
                <Link href={`/admin/orders/${request.orderId}`}>Xem toàn bộ đơn hàng</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
              <Calendar size={16} className="text-primary" />
              <h3 className="text-[13px] font-semibold text-slate-900">Thời gian yêu cầu</h3>
            </div>
            <div className="text-center py-1">
               <p className="text-[13px] font-semibold text-slate-900">{new Date(request.createdAt).toLocaleString("vi-VN")}</p>
               <p className="text-[10px] text-slate-500 font-medium mt-1">Gửi yêu cầu đổi trả</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
