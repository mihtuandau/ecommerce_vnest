"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const orderId = searchParams.get("orderId");
  const contact = searchParams.get("contact");

  const { user } = useAuthStore();
  const isGuest = !user;
  const { clearCart, clearBuyNowItem } = useCartStore();

  useEffect(() => {
    // Clear cart locally to ensure UI is in sync
    const isBuyNow = searchParams.get("buyNow") === "true";
    if (isBuyNow) {
      clearBuyNowItem();
    } else {
      clearCart();
    }
  }, [clearCart, clearBuyNowItem, searchParams]);
  useEffect(() => {
    // Pháo hoa chào mừng đặt hàng thành công
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      // Bắn từ bên trái
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: ["#1565C0", "#2196F3", "#90CAF9", "#ffffff"]
      });
      // Bắn từ bên phải
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: ["#1565C0", "#2196F3", "#90CAF9", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-100 p-8 md:p-12 rounded-3xl shadow-sm text-center"
      >
        <div className="mb-6">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Đặt hàng thành công
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Cảm ơn bạn đã tin tưởng Minh Tuấn Shop.<br />Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        {orderCode && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex flex-col items-center gap-1 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</span>
            <span className="text-xl font-mono font-bold text-primary tracking-wider">{orderCode}</span>
            {isGuest && (
              <p className="text-[11px] text-slate-400 mt-2 font-medium italic">
                Vui lòng lưu lại mã này để tra cứu đơn hàng
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            asChild
            className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
          >
            <Link href={(orderId && !isGuest) ? `/orders/${orderId}` : `/orders/guest/lookup/${orderCode}?contact=${contact}`}>
              Theo dõi đơn hàng
            </Link>
          </Button>
          
          <Button 
            variant="ghost"
            asChild
            className="w-full h-12 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            <Link href="/shop">
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
        <Package className="h-3 w-3" />
        Minh Tuấn Shop • Delivery Excellence
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
