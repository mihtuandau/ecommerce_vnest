"use client";

import React, { useState, useEffect } from "react";
import { 
  User, ShoppingBag, Tag, FileText, 
  ChevronDown, Star, ExternalLink, ShieldCheck, X, Plus
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useUserDetail } from "@/features/users/hooks";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";

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
  const customerId = selectedRoom?.customer?.id || (selectedRoomId ? parseInt(selectedRoomId.replace("room_", "")) : null);
  
  // Call real database API to fetch complete user info, addresses, reviews and order history
  const { data: customerDetails, isLoading } = useUserDetail(customerId ? String(customerId) : "");

  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);

  // Load persisted tags & notes when customer changes
  useEffect(() => {
    if (customerId) {
      const savedNotes = localStorage.getItem(`chat_customer_notes_${customerId}`) || "";
      setNote(savedNotes);

      const savedTags = localStorage.getItem(`chat_customer_tags_${customerId}`);
      if (savedTags) {
        setTags(JSON.parse(savedTags));
      } else {
        setTags(["Khách mới", "Cần tư vấn"]);
      }
    } else {
      setNote("");
      setTags([]);
    }
  }, [customerId]);

  const handleSaveNotes = () => {
    if (customerId) {
      localStorage.setItem(`chat_customer_notes_${customerId}`, note);
      toast.success("Đã lưu ghi chú nội bộ thành công!");
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && customerId) {
      const updated = [...tags, newTagInput.trim()];
      setTags(updated);
      localStorage.setItem(`chat_customer_tags_${customerId}`, JSON.stringify(updated));
      setNewTagInput("");
      setShowAddTag(false);
      toast.success("Đã thêm nhãn phân loại!");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (customerId) {
      const updated = tags.filter(t => t !== tagToRemove);
      setTags(updated);
      localStorage.setItem(`chat_customer_tags_${customerId}`, JSON.stringify(updated));
      toast.success("Đã gỡ nhãn!");
    }
  };

  if (selectedRoomId?.startsWith("room_staff_")) {
    const isInternalGroup = selectedRoomId === "room_staff_internal";
    return (
      <div className="w-[300px] border-l border-slate-100 bg-white p-6 h-full flex flex-col shrink-0 overflow-y-auto">
        <div className="text-center py-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-2xl mx-auto border border-amber-200/50 shadow-inner">
            {isInternalGroup ? "👥" : (selectedRoom?.customer?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "NV")}
          </div>
          <h4 className="text-sm font-bold text-slate-800 mt-4">
            {isInternalGroup ? "Kênh Nội Bộ Cửa Hàng" : selectedRoom?.customer?.name}
          </h4>
          <span className="px-2 py-0.5 bg-amber-100 border border-amber-200/60 text-amber-800 text-[8px] uppercase tracking-wider font-bold rounded mt-1.5 inline-block">
            {isInternalGroup ? "Staff Only" : selectedRoom?.customer?.role}
          </span>
        </div>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isInternalGroup ? "Giới thiệu phòng" : "Thông tin liên hệ"}
            </h5>
            <p className="text-xs leading-relaxed text-slate-550 font-medium">
              {isInternalGroup 
                ? "Đây là kênh chat nội bộ dành riêng cho tất cả nhân viên trong cửa hàng trao đổi công việc, vận đơn, kiểm kho và thông báo nội bộ."
                : `Đang trò chuyện trực tiếp và bảo mật với ${selectedRoom?.customer?.name} (${selectedRoom?.customer?.role}).`
              }
            </p>
            {!isInternalGroup && selectedRoom?.customer?.email && (
              <div className="text-[11px] text-slate-550 bg-slate-50 border border-slate-100 p-2.5 rounded-xl break-all mt-1 font-semibold">
                <span className="font-semibold text-slate-700">Email:</span> {selectedRoom.customer.email}
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bảo mật kênh</h5>
            <div className="flex items-center gap-2 text-emerald-650 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50 text-xs font-semibold">
              <ShieldCheck size={14} className="shrink-0" />
              <span>Hội thoại nội bộ. Khách hàng KHÔNG thể nhìn thấy.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRoomId) {
    return (
      <div className="w-[300px] border-l border-slate-100 bg-white p-12 text-center h-full flex flex-col items-center justify-center shrink-0">
        <ShieldCheck size={36} className="mx-auto text-slate-300 mb-3 opacity-60" />
        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-[0.15em]">Thông tin khách hàng</p>
        <p className="text-xs text-slate-450 mt-1">Chọn hội thoại để xem chi tiết</p>
      </div>
    );
  }

  // Address Resolution
  const defaultAddress = customerDetails?.addresses?.find((a: any) => a.isDefault) || customerDetails?.addresses?.[0];
  const formattedLocation = defaultAddress 
    ? `${defaultAddress.ward ? defaultAddress.ward + ", " : ""}${defaultAddress.district ? defaultAddress.district + ", " : ""}${defaultAddress.city || ""}`
    : "Chưa cập nhật";

  // Orders Resolution
  const ordersList = customerDetails?.orders || [];
  const totalSpent = ordersList.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

  // Reviews Resolution
  const reviewList = customerDetails?.reviews || [];
  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewList.length).toFixed(1)
    : null;

  // Render Section Contents
  const sections = [
    { 
      id: "contact", 
      title: "Thông tin liên hệ", 
      icon: <User size={14} />, 
      content: isLoading ? (
        <div className="py-4 flex justify-center"><Spinner size="sm" variant="slate" /></div>
      ) : (
        <div className="space-y-3.5 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Họ và tên</span>
            <span className="text-xs text-slate-700 font-semibold">{customerDetails?.name || selectedRoom?.customer?.name || "Ẩn danh"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</span>
            <span className="text-xs text-slate-700 font-medium truncate">{customerDetails?.email || selectedRoom?.customer?.email || "Chưa cập nhật"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Số điện thoại</span>
            <span className="text-xs text-slate-700 font-medium">{customerDetails?.phone || defaultAddress?.phone || "Chưa cập nhật"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Địa chỉ giao hàng</span>
            <span className="text-xs text-slate-700 font-medium leading-relaxed">{formattedLocation}</span>
          </div>
        </div>
      )
    },
    { 
      id: "orders", 
      title: `Đơn hàng đã mua (${ordersList.length})`, 
      icon: <ShoppingBag size={14} />, 
      content: isLoading ? (
        <div className="py-4 flex justify-center"><Spinner size="sm" variant="slate" /></div>
      ) : ordersList.length === 0 ? (
        <p className="text-xs text-slate-400 pt-2">Chưa mua đơn hàng nào</p>
      ) : (
        <div className="space-y-2.5 pt-2 max-h-[220px] overflow-y-auto custom-scrollbar">
          {ordersList.map((ord: any) => {
            let statusColor = "text-sky-600 bg-sky-50 border border-sky-100";
            if (ord.status === "DELIVERED") statusColor = "text-emerald-600 bg-emerald-50 border border-emerald-100";
            if (ord.status === "CANCELLED") statusColor = "text-rose-600 bg-rose-50 border border-rose-100";
            
            const statusMap: Record<string, string> = {
              PENDING: "Chờ duyệt",
              CONFIRMED: "Đã xác nhận",
              SHIPPING: "Đang giao",
              DELIVERED: "Đã giao",
              CANCELLED: "Đã hủy",
              REFUNDED: "Đã hoàn"
            };

            return (
              <a 
                key={ord.id} 
                href={`/admin/orders/${ord.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-slate-800 flex items-center gap-1">
                    #{ord.orderCode}
                    <ExternalLink size={10} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {dayjs(ord.createdAt).format("DD/MM/YYYY")} · {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(ord.totalAmount)}
                  </div>
                </div>
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider", statusColor)}>
                  {statusMap[ord.status] || ord.status}
                </span>
              </a>
            );
          })}
        </div>
      )
    },
    { 
      id: "tags", 
      title: "Nhãn phân loại", 
      icon: <Tag size={14} />, 
      content: (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <span 
                key={t} 
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-rose-50 border border-slate-200/60 text-slate-600 hover:text-rose-650 text-[11px] rounded-lg font-medium cursor-pointer transition-colors group"
                onClick={() => handleRemoveTag(t)}
                title="Bấm để xóa nhãn này"
              >
                {t}
                <X size={10} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
              </span>
            ))}
            
            {!showAddTag ? (
              <button 
                onClick={() => setShowAddTag(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 text-[11px] rounded-lg font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus size={11} /> Thêm nhãn
              </button>
            ) : (
              <form onSubmit={handleAddTag} className="flex gap-1 items-center w-full mt-1.5">
                <input 
                  type="text" 
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Tên nhãn mới..." 
                  className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
                  autoFocus
                />
                <button type="submit" className="px-2.5 py-1 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-700 cursor-pointer">Lưu</button>
                <button type="button" onClick={() => setShowAddTag(false)} className="p-1 border border-slate-250 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><X size={13} /></button>
              </form>
            )}
          </div>
        </div>
      )
    },
    { 
      id: "notes", 
      title: "Ghi chú hỗ trợ", 
      icon: <FileText size={14} />, 
      content: (
        <div className="space-y-2.5 pt-2">
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs min-h-[90px] outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-700"
            placeholder="Ghi chú các thông tin quan trọng về khách hàng này..."
          />
          <button 
            onClick={handleSaveNotes}
            className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-all shadow-sm cursor-pointer"
          >
            Lưu ghi chú
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="w-[300px] border-l border-slate-100 bg-white overflow-y-auto h-full shrink-0 custom-scrollbar shadow-sm flex flex-col">
      {/* Customer Header Summary */}
      <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center text-xl font-semibold text-slate-500 shadow-sm">
            {selectedRoom?.customer?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>
        
        <h4 className="text-sm font-semibold text-slate-800 tracking-tight">
          {customerDetails?.name || selectedRoom?.customer?.name || "Khách hàng"}
        </h4>
        
        {/* Dynamic VIP Badge */}
        {ordersList.length >= 3 || totalSpent > 5000000 ? (
          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1.5 uppercase tracking-wider">
            <Star size={10} fill="currentColor" /> Thành viên VIP
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1.5 uppercase tracking-wider">
            Thành viên Thường
          </div>
        )}

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <div className="bg-white p-2.5 rounded-xl text-center shadow-xs border border-slate-100">
            <div className="text-sm font-semibold text-slate-800">
              {isLoading ? "..." : ordersList.length}
            </div>
            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Đơn hàng</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-center shadow-xs border border-slate-100">
            <div className="text-sm font-semibold text-slate-800">
              {isLoading ? "..." : avgRating ? `${avgRating}★` : "N/A"}
            </div>
            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Hài lòng</div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-slate-100 flex-1">
        {sections.map(section => (
          <div key={section.id} className="group">
            <div 
              onClick={() => onToggleSection(section.id)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{section.icon}</div>
                {section.title}
              </div>
              <ChevronDown size={13} className={cn("text-slate-400 transition-transform duration-250", openSections[section.id] ? "rotate-180" : "")} />
            </div>
            {openSections[section.id] && (
              <div className="px-4 pb-4 animate-fade-in">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
