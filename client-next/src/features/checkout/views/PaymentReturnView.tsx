"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { api } from "@/lib/http";
import { formatCurrency } from "@/utils/formatCurrency";

export function PaymentReturnView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
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
    <div className="min-h-screen bg-brand-cream font-sans-brand">
      <div className="container mx-auto max-w-7xl py-12 px-4 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-lg border border-brand-sand shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="pt-16 pb-12 text-center px-8 md:px-12 space-y-8">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                <Spinner size="lg" />
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-brand-espresso">
                    Đang xử lý giao dịch
                  </h2>
                  <p className="text-sm text-brand-taupe">
                    Vui lòng chờ trong giây lát...
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="h-12 w-12 stroke-[1.5]" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-brand-espresso tracking-tight font-serif-brand">
                    Thanh toán hoàn tất
                  </h2>
                  <p className="text-brand-taupe text-sm leading-relaxed max-w-[300px] mx-auto">
                    Cảm ơn bạn! Đơn hàng của bạn đã được xác nhận và đang chờ xử lý.
                  </p>
                </div>

                {order && (
                  <div className="w-full border border-brand-sand rounded-2xl p-6 bg-brand-cream/30 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-taupe">Mã đơn hàng</span>
                      <span className="text-brand-espresso font-semibold">
                        {order.orderCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-taupe">Tổng thanh toán</span>
                      <span className="text-brand-bronze font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-taupe">Phương thức</span>
                      <span className="text-brand-espresso font-semibold">
                        VNPay Online
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col w-full gap-3 pt-2">
                  <Button
                    asChild
                    className="w-full h-14 rounded-xl bg-brand-espresso hover:bg-brand-bronze text-white border-none shadow-sm transition-all active:scale-95"
                  >
                    <Link
                      href={
                        order?.userId
                          ? `/orders/${order.id}`
                          : `/orders/guest/lookup/${order.orderCode}?contact=${
                              order.guestPhone || order.phone
                            }`
                      }
                    >
                      Kiểm tra đơn hàng
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-brand-taupe hover:text-brand-espresso hover:bg-brand-cream transition-colors"
                  >
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
                  <h2 className="text-2xl font-bold text-brand-espresso tracking-tight font-serif-brand">
                    Giao dịch bị gián đoạn
                  </h2>
                  <p className="text-brand-taupe text-sm leading-relaxed max-w-[300px] mx-auto">
                    Rất tiếc, đã có lỗi xảy ra. Bạn có thể thử lại hoặc chọn phương thức khác.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 pt-6">
                  <Button
                    asChild
                    className="w-full h-14 rounded-xl bg-rose-500 hover:bg-rose-600 text-white border-none shadow-sm transition-all active:scale-95"
                  >
                    <Link href={ROUTES.CHECKOUT}>Thực hiện lại thanh toán</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-brand-taupe hover:text-brand-espresso hover:bg-brand-cream transition-colors"
                  >
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
