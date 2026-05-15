"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReorderBannerProps {
  itemCount: number;
  onReorder: () => void;  
}

export function ReorderBanner({ itemCount, onReorder }: ReorderBannerProps) {
  return (
    <div className="mt-10 bg-[#3D2B1A] rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#3D2B1A]/10 font-sans-brand overflow-hidden relative group border border-[#4D3B2A]">
      {/* Subtle Texture */}
      <div className="absolute inset-0 bg-[url('/textures/paper.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C4783A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-3 text-center md:text-left z-10">
        <h4 className="text-2xl md:text-3xl font-bold text-[#FAF8F4] font-serif-brand tracking-tight">
          Muốn đặt lại <em className="italic text-[#C4783A] font-medium not-italic font-serif-brand">đơn hàng này?</em>
        </h4>
        <p className="text-[#8A7966] text-[15px] font-medium max-w-md leading-relaxed">
          Thêm tất cả sản phẩm vào giỏ hàng chỉ với một cú nhấp.
        </p>
      </div>

      <Button 
        onClick={onReorder}
        className="relative h-[60px] px-10 bg-[#C4783A] text-white rounded-[20px] text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#B56830] transition-all flex items-center gap-3 shadow-lg shadow-[#C4783A]/20 hover:-translate-y-0.5 active:translate-y-0 z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <ShoppingBag size={18} className="text-white" />
        </div>
        Mua lại tất cả ({itemCount} SP)
      </Button>
    </div>
  );
}
