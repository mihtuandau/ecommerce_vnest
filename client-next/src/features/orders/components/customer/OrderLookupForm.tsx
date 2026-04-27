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
    <div className="min-h-[70vh] bg-slate-50/30 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 space-y-2">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <Package className="h-8 w-8 text-primary stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Tra cứu đơn hàng</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Nhập mã đơn hàng và thông tin liên hệ để theo dõi hành trình đơn hàng của bạn.
          </p>
        </div>

        <Card className="border border-slate-100 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleLookup} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">Mã đơn hàng</label>
                <div className="relative group">
                  <Package className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Ví dụ: ORD-QQ2AW4"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    className="h-12 pl-12 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">Số điện thoại / Email</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Thông tin dùng khi đặt hàng"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-12 pl-12 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-13 rounded-xl bg-primary hover:bg-[#0d47a1] text-white font-semibold text-sm shadow-lg shadow-primary/10 transition-all active:scale-[0.98] group"
              >
                Tra cứu ngay
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center">
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                Cần hỗ trợ? <br className="sm:hidden" />
                Vui lòng gọi <span className="text-slate-900 font-bold">1900-xxxx</span> (8h00 - 22h00)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
