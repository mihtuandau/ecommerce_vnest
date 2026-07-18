"use client";

import React, { useState } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export default function CustomerReturnsView() {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});

  const toggleFaq = (key: string) => {
    setFaqOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const returnFaqs = [
    {
      key: "ret-1",
      q: "Chính sách đổi trả hàng kéo dài trong bao lâu?",
      a: "LUXE hỗ trợ khách hàng đổi mẫu hoặc đổi trả hàng trong thời gian lên tới 30 ngày kể từ khi ký nhận hàng từ shipper.",
    },
    {
      key: "ret-2",
      q: "Sản phẩm thế nào mới đủ điều kiện đổi trả?",
      a: "• Sản phẩm phải còn nguyên nhãn mác, tem niêm phong, chưa có dấu hiệu sử dụng, giặt ủi, có mùi lạ.\n• Đầy đủ phụ kiện, quà tặng kèm theo (nếu có).\n• Có thông tin đơn hàng hoặc hóa đơn đã mua để đối soát.",
    },
    {
      key: "ret-3",
      q: "Tôi có phải mất phí vận chuyển khi gửi hàng đổi trả về?",
      a: "Nếu sản phẩm bị lỗi sản xuất hoặc sai mẫu do phía cửa hàng, LUXE sẽ chịu 100% phí ship chuyển hàng 2 chiều. Nếu đổi do nhu cầu chủ quan (chọn size nhầm, đổi màu), quý khách vui lòng thanh toán phí chuyển phát.",
    },
  ];

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto h-full [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#E8E0D0]">
      <div>
        <h3 className="text-[15px] font-semibold text-brand-espresso flex items-center gap-2.5">
          <RefreshCw size={16} className="text-brand-accent" />
          Chính sách đổi trả & Hoàn tiền
        </h3>
        <p className="text-[12px] text-brand-taupe mt-1.5 leading-relaxed font-normal">
          Chúng tôi cam kết đảm bảo tối đa quyền lợi của khách hàng khi đặt mua sản phẩm
          tại LUXE.
        </p>
      </div>

      
      <div className="p-6 rounded-2xl bg-brand-cream/30 border border-brand-sand/50 shadow-3xs">
        <span className="text-[10px] text-brand-taupe uppercase tracking-wider block mb-4">
          Các bước yêu cầu đổi trả
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Liên hệ Hotline/Chat",
              desc: "Thông báo mã đơn hàng & lý do yêu cầu đổi trả cho tư vấn viên.",
            },
            {
              step: "02",
              title: "Đóng gói sản phẩm",
              desc: "Gửi sản phẩm còn nguyên nhãn mác, tem niêm phong ban đầu.",
            },
            {
              step: "03",
              title: "Kiểm tra & Hoàn tiền",
              desc: "Nhận tiền hoàn hoặc hàng đổi mới trong vòng 3 - 5 ngày làm việc.",
            },
          ].map((step, idx) => (
            <div key={idx} className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-brand-espresso text-white flex items-center justify-center text-[11px] shadow-3xs mb-3 font-medium">
                {step.step}
              </div>
              <h4 className="text-[12.5px] font-medium text-brand-espresso">{step.title}</h4>
              <p className="text-[11px] text-brand-taupe mt-1.5 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="space-y-3">
        <h4 className="text-[11px] text-brand-taupe uppercase tracking-wider font-semibold">
          Câu hỏi thường gặp về đổi trả
        </h4>
        {returnFaqs.map((faq) => {
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
