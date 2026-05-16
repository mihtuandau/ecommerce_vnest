"use client";

import React from "react";
import { 
  User, ShoppingBag, Tag, FileText, 
  ChevronDown, Star, ExternalLink, ShieldCheck 
} from "lucide-react";
import { cn } from "@/utils/cn";

interface CustomerInfoProps {
  selectedRoomId: string | null;
  selectedRoom: any;
  openSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
}

export function CustomerInfo({
  selectedRoomId,
  selectedRoom,
  openSections,
  onToggleSection,
}: CustomerInfoProps) {
  if (!selectedRoomId) {
    return (
      <div className="p-12 text-center h-full flex flex-col items-center justify-center bg-white">
        <ShieldCheck size={40} className="mx-auto text-[#CBD5E1] mb-4 opacity-50" />
        <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-[0.2em]">Bảng điều khiển</p>
      </div>
    );
  }

  const sections = [
    { id: "contact", title: "Khách hàng", icon: <User size={15} />, content: (
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Email cá nhân</span>
          <span className="text-[13px] text-[#1E293B] font-medium truncate">linh.nguyen@email.com</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Số điện thoại</span>
          <span className="text-[13px] text-[#1E293B] font-medium">0912 345 678</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Vị trí</span>
          <span className="text-[13px] text-[#1E293B] font-medium">Quận 1, TP. Hồ Chí Minh</span>
        </div>
      </div>
    )},
    { id: "orders", title: "Lịch sử mua hàng", icon: <ShoppingBag size={15} />, content: (
      <div className="space-y-4 pt-2">
        {[
          { id: "#ORD-8422", date: "Hôm nay", price: "3.590k", status: "Đang giao", color: "text-[#3B82F6] bg-[#DBEAFE]" },
          { id: "#ORD-7410", date: "02/05", price: "2.360k", status: "Hoàn tất", color: "text-[#10B981] bg-[#D1FAE5]" }
        ].map((ord, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] hover:border-[#E2E8F0] transition-colors cursor-pointer group">
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-[#0F172A] flex items-center gap-1.5">
                {ord.id}
                <ExternalLink size={10} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-[#64748B] font-medium">{ord.date} · {ord.price}</div>
            </div>
            <span className={cn("text-[9px] font-bold px-2 py-1 rounded-md", ord.color)}>
              {ord.status}
            </span>
          </div>
        ))}
      </div>
    )},
    { id: "tags", title: "Phân loại", icon: <Tag size={15} />, content: (
      <div className="flex flex-wrap gap-2 pt-2">
        {["Ưu tiên cao", "Giao hàng", "VIP Support"].map(t => (
          <span key={t} className="px-3 py-1 bg-white border border-[#E2E8F0] text-[#475569] text-[11px] rounded-lg font-bold shadow-sm cursor-pointer hover:bg-[#F8FAFC] transition-colors">{t}</span>
        ))}
        <button className="px-3 py-1 border border-dashed border-[#CBD5E1] text-[#64748B] text-[11px] rounded-lg font-bold hover:bg-[#F8FAFC] transition-colors">+ Thêm nhãn</button>
      </div>
    )},
    { id: "notes", title: "Ghi chú nội bộ", icon: <FileText size={15} />, content: (
      <div className="pt-2">
        <textarea 
          className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[12px] min-h-[90px] outline-none focus:border-[#3B82F6] focus:bg-white transition-all text-[#1E293B]"
          placeholder="Ghi chú quan trọng về khách hàng này..."
        ></textarea>
        <button className="w-full mt-3 py-2.5 bg-[#0F172A] text-white text-[12px] font-bold rounded-xl hover:bg-black transition-all shadow-md active:scale-95">Lưu ghi chú</button>
      </div>
    )},
  ];

  return (
    <div className="w-[300px] border-l border-[#E2E8F0] bg-white overflow-y-auto h-full shrink-0 custom-scrollbar shadow-sm">
      <div className="p-8 text-center border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-100 border-4 border-white">
            {selectedRoom?.customer?.name?.charAt(0) || "U"}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22C55E] border-4 border-[#F8FAFC] rounded-full shadow-sm"></div>
        </div>
        <h4 className="text-[16px] font-bold text-[#0F172A]">{selectedRoom?.customer?.name || "Khách hàng"}</h4>
        <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-3 py-1 rounded-lg mt-3 uppercase tracking-wider">
          <Star size={11} fill="currentColor" /> Thành viên VIP
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-8">
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-[#F1F5F9]">
            <div className="text-[18px] font-bold text-[#0F172A]">12</div>
            <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight">Đơn hàng</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-[#F1F5F9]">
            <div className="text-[18px] font-bold text-[#0F172A]">4.9★</div>
            <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-tight">Hài lòng</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {sections.map(section => (
          <div key={section.id} className="group">
            <div 
              onClick={() => onToggleSection(section.id)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="flex items-center gap-3 text-[13px] font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                <div className="text-[#64748B] group-hover:text-[#2563EB] transition-colors">{section.icon}</div>
                {section.title}
              </div>
              <ChevronDown size={14} className={cn("text-[#94A3B8] transition-transform duration-300", openSections[section.id] ? "rotate-180" : "")} />
            </div>
            {openSections[section.id] && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-300">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
