"use client";

import Image from "next/image";
import LuxeCustomerChat from "@/features/chat/components/LuxeCustomerChat";
import { 
  ShieldCheck, 
  HelpCircle, FileText, Truck, RefreshCw, Phone, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const FAQ_SHORTCUTS = [
    { icon: <Truck size={20} />, title: "Theo dõi giao hàng", desc: "Xem trạng thái đơn hàng & thời gian dự kiến" },
    { icon: <RefreshCw size={20} />, title: "Chính sách đổi trả", desc: "Quy định đổi trả hàng trong vòng 7 ngày" },
    { icon: <ShieldCheck size={20} />, title: "Trung tâm bảo hành", desc: "Chính sách bảo hành sản phẩm chính hãng" },
    { icon: <FileText size={20} />, title: "Hóa đơn điện tử", desc: "Yêu cầu xuất hóa đơn cho doanh nghiệp" },
  ];

  return (
    <div className="bg-[#FAF8F4] pt-2 pb-6 min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-80px)]">
        {/* Breadcrumbs - Minimalist LUXE Style */}
        <div className="flex items-center gap-2 text-[13px] text-[#8A7966] mb-4 shrink-0">
          <Link href="/" className="hover:text-[#3D2B1A] transition-colors">Trang chủ</Link>
          <span className="opacity-40">/</span>
          <span className="text-[#3D2B1A] font-medium">Trung tâm hỗ trợ</span>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch overflow-hidden">
          
          {/* Left Column: Support Channels */}
          <div className="lg:col-span-4 space-y-6 flex flex-col overflow-hidden">
            {/* 1. Hotline Card - Prime Position */}
            <div className="p-6 rounded-[2.5rem] bg-[#3D2B1A] text-white relative overflow-hidden shrink-0 group shadow-2xl shadow-[#3D2B1A]/10 transition-all duration-500 hover:scale-[1.02]">
               <div className="relative z-10 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#F0D5BB]">
                    <Phone size={24} />
                 </div>
                 <div>
                    <p className="text-[11px] font-bold text-[#F0D5BB] uppercase tracking-[0.2em] mb-1 opacity-80">Hotline hỗ trợ 24/7</p>
                    <p className="text-2xl font-bold tracking-tight">1900 6789</p>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* 2. Quick FAQ Shortcuts */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_64px_rgba(61,43,26,0.03)] border border-[#DDD6C8] flex-1 flex flex-col group hover:shadow-xl hover:shadow-[#3D2B1A]/5 transition-all duration-500">
               <h2 className="text-[12px] font-bold text-[#3D2B1A] flex items-center gap-3 mb-8 uppercase tracking-[0.25em] opacity-80 shrink-0">
                  <HelpCircle size={18} className="text-[#C4783A]" />
                  Chủ đề phổ biến
               </h2>
               
               <div className="space-y-4 flex-1">
                  {FAQ_SHORTCUTS.map((item, idx) => (
                     <button key={idx} className="w-full flex items-center gap-5 p-4.5 rounded-3xl bg-[#FAF8F4]/40 border border-[#DDD6C8]/40 hover:bg-white hover:border-[#C4783A] hover:shadow-xl hover:shadow-[#C4783A]/5 transition-all duration-300 text-left group/btn">
                        <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center text-[#8A7966] group-hover/btn:text-[#C4783A] transition-all shrink-0 border border-[#DDD6C8]/30">
                           {item.icon}
                        </div>
                        <div>
                           <p className="text-[13px] font-bold text-[#3D2B1A] group-hover/btn:translate-x-1 transition-transform">{item.title}</p>
                           <p className="text-[11px] text-[#8A7966] mt-1 line-clamp-1 opacity-70">{item.desc}</p>
                        </div>
                     </button>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-[#FAF8F4] flex flex-col gap-3 shrink-0">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#8A7966] uppercase tracking-[0.3em] opacity-40">
                     <div className="h-[1px] flex-1 bg-[#DDD6C8]" />
                     LUXE Care
                     <div className="h-[1px] flex-1 bg-[#DDD6C8]" />
                  </div>
                  <p className="text-[10px] text-center text-[#8A7966] leading-relaxed italic opacity-60">
                    "Tận tâm hỗ trợ, nâng tầm trải nghiệm."
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden">
             <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_48px_80px_rgba(61,43,26,0.06)] border border-[#DDD6C8] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl">
                <LuxeCustomerChat />
             </div>
             
             {/* Trust Badges - Optimized */}
             <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-30 transition-all duration-700 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="h-[1px] w-12 bg-[#8A7966]" />
                    <p className="text-[9px] font-bold text-[#8A7966] uppercase tracking-[0.4em]">LUXE Professional Support Ecosystem</p>
                    <div className="h-[1px] w-12 bg-[#8A7966]" />
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
