"use client";

import React from "react";
import { MessageSquare, Truck, RefreshCw, ShieldCheck, Phone } from "lucide-react";
import { cn } from "@/utils/cn";

interface CustomerSupportSidebarProps {
  activeTab: "chat" | "delivery" | "returns" | "warranty" | "contact";
  setActiveTab: (tab: "chat" | "delivery" | "returns" | "warranty" | "contact") => void;
  storePhone: string;
}

export default function CustomerSupportSidebar({
  activeTab,
  setActiveTab,
  storePhone,
}: CustomerSupportSidebarProps) {
  const menuItems = [
    {
      id: "chat",
      icon: <MessageSquare size={15} />,
      label: "Trò chuyện trực tuyến",
      desc: "Hỗ trợ trực tiếp từ nhân viên",
    },
    {
      id: "delivery",
      icon: <Truck size={15} />,
      label: "Giao nhận & Vận chuyển",
      desc: "Thời gian & ngưỡng miễn phí ship",
    },
    {
      id: "returns",
      icon: <RefreshCw size={15} />,
      label: "Chính sách đổi trả",
      desc: "Quy định hoàn tiền trong 30 ngày",
    },
    {
      id: "warranty",
      icon: <ShieldCheck size={15} />,
      label: "Bảo hành chính hãng",
      desc: "Thông tin & trung tâm bảo hành",
    },
    {
      id: "contact",
      icon: <Phone size={15} />,
      label: "Kênh liên hệ & Hotline",
      desc: "Email, điện thoại & mạng xã hội",
    },
  ] as const;

  return (
    <div className="lg:col-span-4 border-r border-[#DDD6C8]/40 flex flex-col bg-[#FAF8F4]/20 h-full min-h-0">
      
      <div className="p-6 border-b border-[#DDD6C8]/40 bg-white shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-9.5 h-9.5 rounded-xl bg-[#3D2B1A] text-white flex items-center justify-center shadow-3xs font-serif font-bold text-sm">
            lx
          </div>
          <div>
            <h2 className="text-[#3D2B1A] text-[14px] font-semibold tracking-normal">
              LUXE Help Center
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-[#8A7966] font-normal">
                Hỗ trợ trực tuyến đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="p-4 flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2.5 text-[10px] font-semibold text-[#8A7966] tracking-wider uppercase">
          Danh mục hỗ trợ
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-start gap-4 p-3.5 rounded-2xl transition-all duration-200 text-left border",
                isActive
                  ? "bg-[#FAF8F4] border-[#DDD6C8]/60 shadow-3xs text-[#3D2B1A]"
                  : "hover:bg-[#FAF8F4]/40 border-transparent text-[#8A7966] hover:text-[#3D2B1A]"
              )}
            >
              <div
                className={cn(
                  "h-8.5 w-8.5 rounded-xl flex items-center justify-center shadow-3xs shrink-0 transition-transform duration-300 border",
                  isActive
                    ? "bg-[#3D2B1A] text-white border-transparent"
                    : "bg-white text-[#8A7966] border-[#DDD6C8]/30"
                )}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-normal">{item.label}</p>
                <p className="text-[11px] text-[#8A7966] mt-0.5 line-clamp-1 leading-normal font-normal">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      
      <div className="p-5 border-t border-[#DDD6C8]/40 bg-white/70 shrink-0">
        <div className="flex items-center gap-3.5 p-3.5 bg-[#FAF8F4]/30 rounded-2xl border border-[#DDD6C8]/40">
          <Phone size={15} className="text-[#C4783A]" />
          <div>
            <p className="text-[10px] text-[#8A7966]">Gọi hotline 24/7</p>
            <a
              href={`tel:${storePhone}`}
              className="text-[13px] font-semibold text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
            >
              {storePhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
