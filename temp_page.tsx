"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  useOrderDetail, 
  useCancelOrder 
} from "@/features/orders/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  XCircle,
  Receipt,
  ShoppingCart,
  MessageCircle,
  ExternalLink,
  Printer
} from "lucide-react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Chờ xử lý", color: "text-slate-600 bg-slate-50 border-slate-100", icon: Clock },
  PROCESSING: { label: "Đang xử lý", color: "text-blue-600 bg-blue-50 border-blue-100", icon: Package },
  SHIPPED: { label: "Đang giao hàng", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: Truck },
  DELIVERED: { label: "Đã giao hàng", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 },
  CANCELLED: { label: "Đã hủy", color: "text-rose-600 bg-rose-50 border-rose-100", icon: XCircle },
};

const steps = [
  { status: "PENDING", label: "Đã đặt hàng" },
  { status: "PROCESSING", label: "Đã xác nhận" },
  { status: "SHIPPED", label: "Đang giao" },
  { status: "DELIVERED", label: "Hoàn thành" },
];

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: order, isLoading } = useOrderDetail(id);
  const { mutate: cancelOrder } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50/30">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-slate-500 font-medium animate-pulse">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/30">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Không tìm thấy đơn hàng</h2>
          <p className="text-slate-500">Đơn hàng có thể đã bị xóa hoặc không tồn tại.</p>
        </div>
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/orders">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' || order.payment?.status === 'PAID' || order.payment?.status === 'SUCCESS';
  let currentStatus = statusConfig[order.status] || { label: order.status, color: "text-slate-500 bg-slate-50 border-slate-100", icon: Package };
  
  if (order.status === 'PENDING' && isPaid) {
    currentStatus = { label: "Đã thanh toán", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 };
  }

  const StatusIcon = currentStatus.icon;

  const currentStepIndex = steps.findIndex(s => s.status =  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Quay lại
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-800">Đơn hàng #{order.orderCode}</h1>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-400">Ngày đặt: {formatDate(order.createdAt)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button className="bg-primary hover:bg-primary/90 text-white text-xs font-medium h-9 px-5 rounded-lg flex items-center gap-2">
              <ShoppingCart className="h-3.5 w-3.5" />
              Mua lại đơn này
            </Button>
            <Button variant="outline" className="border-slate-200 text-slate-600 text-xs font-medium h-9 px-4 rounded-lg">
              Liên hệ hỗ trợ
            </Button>
            {!isCancelled && order.status === "PENDING" && (
              <Button 
                variant="ghost" 
                className="text-rose-500 hover:bg-rose-50 text-xs font-medium h-9 px-4 rounded-lg"
                onClick={() => confirm("Hủy đơn hàng này?") && cancelOrder(order.id)}
              >
                Hủy đơn
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Simple Stepper */}
            {!isCancelled && (
              <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-50">
                <div className="relative flex justify-between">
                  <div className="absolute top-[15px] left-0 w-full h-[1px] bg-slate-200 z-0" />
                  <div 
                    className="absolute top-[15px] left-0 h-[1px] bg-primary/40 transition-all duration-1000 z-0"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((step, idx) => {
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                          isCurrent ? "bg-white border-primary text-primary shadow-sm" : 
                          isActive ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-300"
                        }`}>
                          {isActive ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                        </div>
                        <span className={`text-[11px] font-medium ${isActive ? "text-slate-700" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4" /> Đơn hàng đã được hủy
              </div>
            )}

            {/* Items Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500">Danh sách sản phẩm</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="p-4 flex items-center gap-4 group">
                    <div className="h-14 w-14 rounded-lg bg-slate-50 p-1.5 border border-slate-50 shrink-0">
                      <img
                        src={item.variant?.product?.images[0]?.url || item.variant?.images[0]?.url || "/placeholder.png"}
                        alt={item.productName}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.variant?.product?.slug}`} className="text-sm font-medium text-slate-700 hover:text-primary transition-colors block truncate">
                        {item.productName || item.variant?.product?.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.variant?.color && <span>Màu: {item.variant.color}</span>}
                        {item.variant?.size && <span className="ml-2">Size: {item.variant.size}</span>}
                        <span className="ml-2 italic">x{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-slate-50/20 p-6 border-t border-slate-50 flex justify-end">
                <div className="w-full max-w-[240px] space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatCurrency(order.total - (order.shippingFee || 0) + (order.discountAmount || 0))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">+{formatCurrency(order.shippingFee || 0)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-800">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer & Address */}
            <div className="border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">Giao nhận</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{order.shippingSnapshot?.fullName || order.user?.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{order.shippingSnapshot?.phone || order.user?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {order.shippingSnapshot?.addressString || order.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Logistics */}
            <div className="border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <CreditCard className="h-3.5 w-3.5" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">Thanh toán</h3>
              </div>
              <div className="space-y-3 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phương thức</span>
                  <span className="font-medium text-slate-700">{order.paymentMethod || "COD"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Trạng thái</span>
                  <span className={`font-medium ${isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                    {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                  </span>
                </div>
                <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                  <span className="text-slate-400">Vận chuyển</span>
                  <span className="font-medium text-slate-700">GHN Express</span>
                </div>
                {order.shippingCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Mã vận đơn</span>
                    <span className="font-medium text-primary">{order.shippingCode}</span>
                  </div>
                )}
              </div>
              {!isPaid && !isCancelled && (
                <Button className="w-full h-9 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg mt-2">
                  Thanh toán ngay
                </Button>
              )}
            </div>
            
            {/* Support info */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy thuộc vào địa chỉ của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
� nguyên tem mác.
               </p>
               <Link href="/policy" className="text-[11px] font-bold text-primary hover:underline block uppercase tracking-wider">Xem chi tiết chính sách →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
