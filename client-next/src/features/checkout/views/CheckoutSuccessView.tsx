"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCart } from "@/features/cart/hooks";
import { CheckoutSteps } from "@/features/checkout/components/CheckoutSteps";

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const orderId = searchParams.get("orderId");
  const contact = searchParams.get("contact");
  const isBuyNow = searchParams.get("buyNow") === "true";

  const { user } = useAuthStore();
  const isGuest = !user;
  const { clearSelectedItems, clearBuyNowItem } = useCart();

  // Fix 5: dùng ref flag để chắc chắn chỉ chạy một lần khi mount,
  //   tránh chạy lại khi clearSelectedItems thay đổi reference lúc auth store hydrate
  const hasCleared = useRef(false);
  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    if (isBuyNow) {
      clearBuyNowItem();
    } else {
      clearSelectedItems();
    }
  }, [clearSelectedItems, clearBuyNowItem, isBuyNow]);

  useEffect(() => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    let active = true;
    let frameId = 0;

    const startConfetti = async () => {
      const { default: confetti } = await import("canvas-confetti");
      if (!active) return;

      const frame = () => {
        if (!active) return;

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.65 },
          colors: ["#C4783A", "#DDD6C8", "#8A7966", "#ffffff"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.65 },
          colors: ["#C4783A", "#DDD6C8", "#8A7966", "#ffffff"],
        });

        if (Date.now() < end) frameId = requestAnimationFrame(frame);
      };

      frame();
    };

    startConfetti();

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, []);

  const detailHref =
    orderId && !isGuest
      ? `/orders/${orderId}`
      : `/orders/guest/lookup/${orderCode}?contact=${contact}`;

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg mb-8">
        <CheckoutSteps currentStep={3} />
      </div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white border border-brand-sand p-8 md:p-12 rounded-3xl shadow-sm text-center">
        <div className="mb-6">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-primary font-serif">
            Đặt hàng thành công
          </h1>
          <p className="text-brand-taupe text-sm font-medium leading-relaxed">
            Cảm ơn bạn đã tin tưởng LUXE.
            <br />
            Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        {orderCode && (
          <div className="bg-brand-ivory rounded-2xl p-6 mb-8 flex flex-col items-center gap-1 border border-brand-sand">
            <span className="text-[10px] font-bold text-brand-taupe/60 uppercase tracking-widest">
              Mã đơn hàng
            </span>
            <span className="text-xl font-mono font-bold text-primary tracking-wider">
              {orderCode}
            </span>
            {isGuest && (
              <p className="text-[11px] text-brand-taupe/60 mt-2 font-medium italic">
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
            <Link href={detailHref}>Theo dõi đơn hàng</Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="w-full h-12 rounded-xl text-brand-taupe font-bold text-sm hover:bg-brand-ivory transition-all"
          >
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-brand-taupe/20 text-[10px] font-bold uppercase tracking-widest">
        <Package className="h-3 w-3" />
        LUXE - Delivery Excellence
      </div>
    </div>
  );
}
