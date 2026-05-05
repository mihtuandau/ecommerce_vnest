"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function VoucherBanner() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-primary/20">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-20 transition-transform duration-1000 group-hover:translate-x-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            <div className="h-20 w-20 rounded-[2rem] bg-white flex items-center justify-center text-primary shadow-2xl shadow-black/10 animate-float">
              <Ticket size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <Gift className="h-3 w-3 text-white" />
                <span className="text-[10px] font-semibold text-white">Quà tặng độc quyền</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter leading-none">
                Kho ưu đãi <br className="hidden md:block" /> đang chờ bạn
              </h2>
              <p className="text-white/80 font-normal text-sm md:text-base max-w-sm">
                Sở hữu ngay những mã giảm giá lên đến 500k và vô vàn quà tặng hấp dẫn khác.
              </p>
            </div>
          </div>

          <Button asChild className="h-16 px-10 rounded-full bg-white text-primary hover:bg-white hover:scale-105 transition-all duration-500 font-bold text-xs gap-3 shadow-xl">
            <Link href="/offers">
              Khám phá ngay <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
