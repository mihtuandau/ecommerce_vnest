"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight, Gift } from "lucide-react";
import { SectionHeading } from "@/features/home/components/customer/shared/SectionHeading";

export function VoucherBanner() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
      <div className="bg-brand-espresso rounded-3xl p-8 md:p-12 relative overflow-hidden group">
        
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/[0.03] -skew-x-12 translate-x-20 transition-transform duration-1000 group-hover:translate-x-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center text-brand-accent">
              <Ticket size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mx-auto md:mx-0">
                <Gift className="h-3 w-3 text-[#F0D5BB]" />
                <span className="text-[11px] font-medium text-[#F0D5BB] tracking-wide">
                  Quà tặng độc quyền
                </span>
              </div>

              <SectionHeading
                index={2}
                eyebrow="Ưu đãi"
                title="Kho ưu đãi đang chờ bạn"
                accent="đang chờ bạn"
                dark
              />

              <p className="text-brand-sand text-sm md:text-base max-w-sm leading-relaxed">
                Sở hữu ngay những mã giảm giá lên đến 500k và vô vàn quà tặng hấp dẫn
                khác.
              </p>
            </div>
          </div>

          <Link
            href="/offers"
            className="inline-flex items-center gap-3 bg-brand-accent text-white px-10 py-4 rounded-full text-sm font-medium hover:bg-[#B56830] transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            Khám phá ngay <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
