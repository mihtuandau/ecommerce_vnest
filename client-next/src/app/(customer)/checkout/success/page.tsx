"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const orderId = searchParams.get("orderId");
  const contact = searchParams.get("contact");

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#1565C0", "#64b5f6", "#ffffff"]
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#1565C0", "#64b5f6", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-white p-10 md:p-12 rounded-[48px] shadow-2xl shadow-blue-900/5 text-center"
      >
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-[#1565C0] rounded-full blur-3xl opacity-10 animate-pulse" />
          <div className="relative h-20 w-20 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-[#1565C0] animate-in zoom-in duration-700" />
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Đặt hàng thành công
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-[280px] mx-auto font-medium">
            Cảm ơn bạn đã tin tưởng Minh Tuấn Shop. Đơn hàng đang được xử lý.
          </p>
        </div>

        {orderCode && (
          <div className="bg-[#1565C0]/5 border border-[#1565C0]/10 rounded-3xl p-6 mb-10 flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] opacity-80">Mã đơn hàng</span>
            <span className="text-xl font-mono font-bold text-[#1565C0] tracking-wider">{orderCode}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            asChild
            className="w-full h-13 rounded-2xl bg-[#1565C0] text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-blue-900/10 group transition-all"
          >
            <Link href={orderId ? `/orders/${orderId}` : `/orders/guest/lookup/${orderCode}?contact=${contact}`}>
              Theo dõi đơn hàng <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="w-full h-13 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" /> Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] opacity-40"
      >
        <Package className="h-3 w-3" />
        Minh Tuấn Shop • Delivery Excellence
      </motion.div>
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
