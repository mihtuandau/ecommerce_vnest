"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export default function CustomerWarrantyView() {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});

  const toggleFaq = (key: string) => {
    setFaqOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const warrantyFaqs = [
    {
      key: "war-1",
      q: "Làm thế nào để yêu cầu bảo hành sản phẩm?",
      a: "Bạn chỉ cần mang sản phẩm tới địa chỉ showroom gần nhất hoặc gửi ship về trung tâm bảo hành của LUXE kèm theo SĐT đặt hàng. Chúng tôi lưu trữ bảo hành bằng phương thức điện tử qua SĐT, không cần giữ phiếu giấy.",
    },
    {
      key: "war-2",
      q: "Trường hợp nào nằm ngoài danh mục hỗ trợ bảo hành?",
      a: "• Sản phẩm bị hỏng hóc do va đập, rơi rớt, tiếp xúc trực tiếp chất lỏng ngoài hướng dẫn.\n• Tự ý can thiệp, tháo gỡ sửa chữa bởi bên thứ ba không được ủy quyền.\n• Sản phẩm đã quá hạn thời gian bảo hành quy định của shop.",
    },
  ];

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto h-full [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#E8E0D0]">
      <div>
        <h3 className="text-[15px] font-semibold text-brand-espresso flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-brand-accent" />
          Chính sách bảo hành chính hãng
        </h3>
        <p className="text-[12px] text-brand-taupe mt-1.5 leading-relaxed font-normal">
          Tất cả sản phẩm công nghệ, thời trang cao cấp phân phối bởi LUXE đều đi kèm
          chế độ bảo hành chuẩn vàng.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#E2F0D9]/30 border border-[#C5DFB2] shadow-3xs flex items-start gap-4">
        <CheckCircle2 className="text-[#5B903E] shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-[12.5px] font-medium text-brand-espresso">
            Chính sách bảo hành vàng 12 tháng
          </h4>
          <p className="text-[11.5px] text-brand-taupe leading-relaxed mt-1.5 font-normal">
            Đổi sản phẩm mới trực tiếp trong vòng 15 ngày đầu tiên nếu xảy ra lỗi phần
            cứng/chất liệu của nhà sản xuất. Hỗ trợ thay thế, sửa chữa linh kiện chính
            hãng miễn phí toàn diện.
          </p>
        </div>
      </div>

      
      <div className="space-y-3">
        <h4 className="text-[11px] text-brand-taupe uppercase tracking-wider font-semibold">
          Câu hỏi thường gặp về bảo hành
        </h4>
        {warrantyFaqs.map((faq) => {
          const isOpen = faqOpen[faq.key];
          return (
            <div
              key={faq.key}
              className="border border-brand-sand/40 rounded-2xl bg-white shadow-3xs overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(faq.key)}
                className="w-full flex items-center justify-between p-4.5 text-left font-medium text-brand-espresso text-[12.5px] hover:bg-brand-cream/20 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-brand-taupe transition-transform duration-300",
                    isOpen ? "rotate-180 text-brand-espresso" : ""
                  )}
                />
              </button>
              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "max-h-[300px] border-t border-brand-sand/20 bg-brand-cream/10"
                    : "max-h-0"
                )}
              >
                <p className="p-4.5 text-[11.5px] text-brand-taupe leading-relaxed whitespace-pre-line font-normal">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
