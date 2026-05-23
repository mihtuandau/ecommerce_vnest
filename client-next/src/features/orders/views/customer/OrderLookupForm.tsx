"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function OrderLookupForm() {
  const [orderCode, setOrderCode] = useState("");
  const [contact, setContact] = useState("");
  const router = useRouter();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim() && contact.trim()) {
      router.push(
        `/orders/guest/lookup/${orderCode.trim()}?contact=${encodeURIComponent(
          contact.trim()
        )}`
      );
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-cream flex items-center justify-center p-6 font-sans-brand">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 space-y-3">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-sand shadow-sm">
            <Package className="h-8 w-8 text-brand-bronze stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold text-brand-espresso tracking-tight font-serif-brand">
            Theo dõi đơn hàng
          </h1>
          <p className="text-brand-taupe text-[13px] max-w-[280px] mx-auto leading-relaxed font-medium">
            Nhập mã đơn hàng và thông tin liên hệ để tra cứu trạng thái đơn hàng.
          </p>
        </div>

        <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleLookup} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="lookup-orderCode"
                className="text-[11px] font-bold text-brand-taupe uppercase tracking-widest ml-1"
              >
                Mã đơn hàng
              </label>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-taupe/50 group-focus-within:text-brand-bronze transition-colors" />
                <Input
                  id="lookup-orderCode"
                  placeholder="Ví dụ: ORD-QQ2AW4"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  className="h-12 pl-11 rounded-xl bg-brand-cream/40 border-brand-sand focus:bg-white focus:border-brand-bronze focus:ring-4 focus:ring-brand-bronze/5 transition-all text-sm font-semibold text-brand-espresso placeholder:text-brand-taupe/50 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lookup-contact"
                className="text-[11px] font-bold text-brand-taupe uppercase tracking-widest ml-1"
              >
                Số điện thoại / Email
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-taupe/50 group-focus-within:text-brand-bronze transition-colors" />
                <Input
                  id="lookup-contact"
                  placeholder="Thông tin dùng khi đặt hàng"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="h-12 pl-11 rounded-xl bg-brand-cream/40 border-brand-sand focus:bg-white focus:border-brand-bronze focus:ring-4 focus:ring-brand-bronze/5 transition-all text-sm font-semibold text-brand-espresso placeholder:text-brand-taupe/50 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-brand-espresso hover:bg-brand-bronze text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              Tiếp tục
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-brand-sand/50 text-center">
            <p className="text-[12px] text-brand-taupe leading-relaxed font-medium">
              Bạn gặp khó khăn khi tra cứu? <br />
              Hãy gọi{" "}
              <span className="text-brand-espresso font-bold underline underline-offset-4 decoration-brand-sand">
                1900 8198
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
