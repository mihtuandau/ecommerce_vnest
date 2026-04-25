"use client";

import { CustomerChatWindow } from "@/features/chat/components/CustomerChatWindow";
import { 
  ShieldCheck, Clock, Headset, 
  HelpCircle, FileText, Truck, RefreshCw, Phone, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const FAQ_SHORTCUTS = [
    { icon: <Truck size={18} />, title: "Theo dõi giao hàng", desc: "Xem trạng thái đơn hàng & thời gian dự kiến" },
    { icon: <RefreshCw size={18} />, title: "Chính sách đổi trả", desc: "Quy định đổi trả hàng trong vòng 7 ngày" },
    { icon: <ShieldCheck size={18} />, title: "Trung tâm bảo hành", desc: "Chính sách bảo hành sản phẩm chính hãng" },
    { icon: <FileText size={18} />, title: "Hóa đơn điện tử", desc: "Yêu cầu xuất hóa đơn cho doanh nghiệp" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Breadcrumbs - Synchronized with Account Page */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-[#1565C1]">Trung tâm hỗ trợ</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Left Column: Sidebar Info */}
           <div className="lg:col-span-4 space-y-6">
              {/* Quick Contact Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
                 <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#1565C1]" />
                    Trợ giúp nhanh
                 </h2>
                 
                 <div className="grid grid-cols-1 gap-2">
                    {FAQ_SHORTCUTS.map((item, idx) => (
                       <button key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                          <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#1565C1] group-hover:bg-blue-50 transition-colors shrink-0">
                             {item.icon}
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                             <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1565C1]">
                       <Phone size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-semibold text-slate-400">Hotline hỗ trợ</p>
                       <p className="text-lg font-bold text-[#1565C1]">1900 6789</p>
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Liên hệ trực tiếp qua số điện thoại nếu bạn cần hỗ trợ xử lý đơn hàng khẩn cấp.
                 </p>
              </div>
           </div>

           {/* Right Column: Chat Interface */}
           <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                 <CustomerChatWindow />
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale pointer-events-none">
                 <img src="/GHNLogo.png" alt="GHN" className="h-5 w-auto" />
                 <img src="/vnpaylogo.png" alt="VNPay" className="h-3 w-auto" />
                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Minh Tuấn Shop Partners</p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
