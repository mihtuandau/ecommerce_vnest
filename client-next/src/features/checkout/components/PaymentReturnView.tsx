"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { api } from "@/lib/axios";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { PaymentStatus } from "@/types/enums";

export function PaymentReturnView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const { data } = await api.get("/payments/vnpay-return", { params });
        
        if (data.success) {
          setStatus("success");
          setOrder(data.order);
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto max-w-7xl py-12 px-4 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-lg border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="pt-16 pb-12 text-center px-8 md:px-12 space-y-8">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
                  <Loader2 className="h-8 w-8 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-medium text-slate-800">Đang xử lý giao dịch</h2>
                  <p className="text-sm text-slate-400">Vui lòng chờ trong giây lát...</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="h-12 w-12 stroke-[1.5]" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Thanh toán hoàn tất</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                    Cảm ơn bạn! Đơn hàng của bạn đã được xác nhận và đang chờ xử lý.
                  </p>
                </div>

                {order && (
                  <div className="w-full border border-slate-100 rounded-3xl p-6 bg-slate-50/30 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Mã đơn hàng</span>
                      <span className="text-slate-700 font-medium">{order.orderCode}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Tổng thanh toán</span>
                      <span className="text-emerald-600 font-medium">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Phương thức</span>
                      <span className="text-slate-700 font-medium">VNPay Online</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col w-full gap-3 pt-2">
                  <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-[#0d47a1] text-white border-none shadow-xl shadow-primary/10 transition-all active:scale-[0.98]">
                    <Link href={order?.userId ? `/orders/${order.id}` : `/orders/guest/lookup/${order.orderCode}?contact=${order.guestPhone || order.phone}`}>
                      Kiểm tra đơn hàng
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full h-12 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    <Link href={ROUTES.HOME}>Về trang chủ</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 ring-8 ring-rose-50/50">
                  <XCircle className="h-12 w-12 stroke-[1.5]" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Giao dịch bị gián đoạn</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                    Rất tiếc, đã có lỗi xảy ra. Bạn có thể thử lại hoặc chọn phương thức khác.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 pt-6">
                  <Button asChild className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white border-none shadow-lg shadow-rose-100 transition-all active:scale-[0.98]">
                    <Link href={ROUTES.CHECKOUT}>Thực hiện lại thanh toán</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full h-12 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    <Link href={ROUTES.HOME}>Quay về trang chủ</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
