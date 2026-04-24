"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { api } from "@/lib/axios";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // VNPay returns params in URL
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
    <div className="container min-h-[70vh] flex items-center justify-center py-20">
      <Card className="w-full max-w-lg border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className={`h-2 w-full ${
          status === "success" ? "bg-green-500" : status === "error" ? "bg-destructive" : "bg-primary"
        }`} />
        
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Đang xác thực giao dịch</h2>
                <p className="text-muted-foreground">Vui lòng không đóng trình duyệt...</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 scale-110">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800">Thanh toán thành công!</h2>
                <p className="text-muted-foreground">Cảm ơn bạn đã tin tưởng mua sắm tại Vnest Store.</p>
              </div>

              {order && (
                <div className="w-full bg-muted/30 rounded-2xl p-6 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-bold">{order.orderCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">VNPay</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col w-full gap-3">
                <Button asChild className="w-full h-12 rounded-full gap-2">
                  <Link href={ROUTES.ORDERS}>Xem đơn hàng <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 rounded-full gap-2">
                  <Link href={ROUTES.HOME}><ShoppingBag className="h-4 w-4" /> Tiếp tục mua sắm</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive scale-110">
                <XCircle className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800">Giao dịch thất bại</h2>
                <p className="text-muted-foreground">Đã có lỗi xảy ra trong quá trình thanh toán.</p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <Button asChild className="w-full h-12 rounded-full">
                  <Link href={ROUTES.CHECKOUT}>Thử lại</Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 rounded-full">
                  <Link href={ROUTES.HOME}>Quay lại trang chủ</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
