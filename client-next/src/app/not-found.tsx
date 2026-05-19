"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C4783A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#8A7966]/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-[0.25em] text-[#C4783A] uppercase">
            LUXE
          </h2>
          <div className="h-[1px] w-8 bg-[#C4783A]/30 mx-auto rounded-full" />
        </div>

        <div className="relative mx-auto flex flex-col items-center justify-center">
          <h1 className="text-8xl font-extrabold tracking-tight text-[#3D2B1A] font-serif">
            404
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A7966] mt-1">
            Not Found
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#3D2B1A] tracking-tight">
            Đường dẫn không tồn tại
          </h3>
          <p className="text-[13px] text-[#8A7966] leading-relaxed font-medium px-4">
            Địa chỉ trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc thay đổi
            sang một đường dẫn khác.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#3D2B1A] text-white hover:bg-black rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all group cursor-pointer"
          >
            <ArrowLeft
              size={13}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Về Trang Chủ
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#DDD6C8] hover:border-[#3D2B1A] text-[#3D2B1A] rounded-xl text-xs font-semibold shadow-2xs hover:bg-[#FAF8F4] transition-all cursor-pointer"
          >
            <ShoppingBag size={13} />
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="pt-6 border-t border-[#DDD6C8]/65 max-w-[240px] mx-auto">
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8A7966] hover:text-[#C4783A] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <HelpCircle size={12} />
            Trung tâm hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}
