"use client";

import React from "react";
import { useSystemSettings } from "@/features/settings/hooks";
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types/enums";
import { Wrench, Phone, Mail, Clock } from "lucide-react";

export function MaintenanceShield() {
  const { data: settings } = useSystemSettings();
  const { user } = useAuthStore();

  const isMaintenance = settings?.maintenanceMode ?? false;
  const isAdmin = user?.role === Role.ADMIN;

  if (isMaintenance && !isAdmin) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F4] text-[#3D2B1A] p-6 font-sans-brand">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C4783A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#8A7966]/5 blur-3xl" />

        <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-[0.15em] text-[#3D2B1A] uppercase">
              {settings?.storeName || "LUXE E-Commerce"}
            </h2>
            <div className="h-[1px] w-12 bg-[#C4783A]/40 mx-auto rounded-full" />
          </div>

          <div className="relative mx-auto w-24 h-24 bg-white rounded-3xl border border-[#DDD6C8] flex items-center justify-center shadow-xs">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C4783A]/5 to-[#8A7966]/5 rounded-3xl" />
            <Wrench className="h-9 w-9 text-[#C4783A] animate-bounce duration-1000" />
          </div>

          <div className="space-y-3 px-2">
            <h1 className="text-[22px] font-bold text-[#3D2B1A] tracking-tight">
              Hệ thống đang bảo trì
            </h1>
            <p className="text-[13.5px] text-[#8A7966] leading-relaxed font-medium">
              Chúng tôi đang tiến hành bảo dưỡng định kỳ hệ thống của cửa hàng để mang lại chất lượng phục vụ và trải nghiệm mua sắm hoàn mỹ nhất cho quý khách.
            </p>
          </div>

          <div className="p-4 bg-[#F9F6F0] rounded-2xl border border-[#EFEBE4] flex items-center gap-3.5 text-left max-w-sm mx-auto shadow-2xs">
            <Clock className="h-5 w-5 text-[#C4783A] shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#3D2B1A]">Thời gian dự kiến hoàn thành</p>
              <p className="text-[11px] text-[#8A7966] leading-relaxed font-semibold">Thường mất khoảng 1 - 2 tiếng. Xin trân trọng cảm ơn sự kiên nhẫn của quý khách hàng!</p>
            </div>
          </div>

          <div className="pt-5 space-y-3.5 border-t border-[#DDD6C8] max-w-sm mx-auto">
            <p className="text-[10px] font-bold text-[#8A7966] uppercase tracking-[0.12em]">Hỗ trợ trực tuyến</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs font-semibold text-[#3D2B1A]">
              {settings?.storePhone && (
                <a 
                  href={`tel:${settings.storePhone}`} 
                  className="flex items-center justify-center gap-2 text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#C4783A]" /> {settings.storePhone}
                </a>
              )}
              {settings?.storeEmail && (
                <a 
                  href={`mailto:${settings.storeEmail}`} 
                  className="flex items-center justify-center gap-2 text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#C4783A]" /> {settings.storeEmail}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
