"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ArrowRight, ShieldCheck } from "lucide-react";

export function OrderLookupForm() {
  const [orderCode, setOrderCode] = useState("");
  const [contact, setContact] = useState("");
  const router = useRouter();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim() && contact.trim()) {
      router.push(`/orders/guest/lookup/${orderCode.trim()}?contact=${encodeURIComponent(contact.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12 space-y-4">
          <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 transition-transform hover:scale-105 duration-300">
            <Package className="h-10 w-10 text-primary stroke-[1.25]" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Theo dõi đơn hàng</h1>
          <p className="text-slate-400 text-[13px] max-w-[280px] mx-auto leading-relaxed font-medium">
            Nhập mã đơn hàng và thông tin liên hệ để cập nhật trạng thái đơn hàng của bạn.
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleLookup} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Mã đơn hàng</label>
              <div className="relative group">
                <Package className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Ví dụ: ORD-QQ2AW4"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại / Email</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Thông tin dùng khi đặt hàng"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:brightness-110 text-white font-semibold text-sm shadow-xl shadow-primary/10 transition-all active:scale-[0.98] group flex items-center justify-center gap-2"
            >
              Tiếp tục
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="pt-10 border-t border-slate-50 text-center">
            <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
              Bạn gặp khó khăn khi tra cứu? <br className="sm:hidden" />
              Hãy gọi <span className="text-slate-900 font-semibold underline underline-offset-4 decoration-slate-200">1900 8198</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
