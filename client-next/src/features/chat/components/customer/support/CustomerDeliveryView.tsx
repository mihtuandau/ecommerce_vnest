"use client";

import React, { useState } from "react";
import { Truck, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface CustomerDeliveryViewProps {
  freeShippingThreshold: string;
  defaultShippingFee: string;
}

export default function CustomerDeliveryView({
  freeShippingThreshold,
  defaultShippingFee,
}: CustomerDeliveryViewProps) {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});

  const toggleFaq = (key: string) => {
    setFaqOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const deliveryFaqs = [
    {
      key: "del-1",
      q: "LUXE hỗ trợ vận chuyển ở những khu vực nào?",
      a: "Chúng tôi hỗ trợ chuyển phát nhanh đến toàn bộ 63 tỉnh thành cả nước thông qua các đối tác tin cậy (Giao Hàng Nhanh, Viettel Post). Đơn hàng sẽ được chuyển trực tiếp tới tay khách hàng.",
    },
    {
      key: "del-2",
      q: "Thời gian giao nhận đơn hàng mất bao lâu?",
      a: "• Khu vực TP. Hồ Chí Minh & Hà Nội: 1 - 2 ngày làm việc.\n• Khu vực tỉnh/thành phố khác: 2 - 4 ngày làm việc tùy thuộc cụ thể theo tuyến xã, huyện.",
    },
    {
      key: "del-3",
      q: "Tôi có được kiểm tra sản phẩm trước khi thanh toán (Ship COD)?",
      a: "Hoàn toàn có. LUXE hỗ trợ hình thức kiểm tra hàng thoải mái trước khi nhận hàng. Nếu phát hiện sản phẩm có lỗi do nhà sản xuất hoặc không đúng mẫu, bạn có quyền từ chối nhận mà không phải chịu bất kỳ chi phí nào.",
    },
  ];

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto h-full [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#E8E0D0]">
      <div>
        <h3 className="text-[15px] font-semibold text-brand-espresso flex items-center gap-2.5">
          <Truck size={18} className="text-brand-accent" />
          Chính sách vận chuyển & Giao nhận
        </h3>
        <p className="text-[12px] text-brand-taupe mt-1.5 leading-relaxed font-normal">
          Thông tin chi tiết về phí giao nhận, thời gian giao nhận hàng và các quy định
          bổ sung của LUXE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5.5 rounded-2xl bg-brand-cream/30 border border-brand-sand/50 shadow-3xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-brand-taupe uppercase tracking-wider block mb-1">
              Hạn mức miễn phí ship
            </span>
            <p className="text-[20px] font-semibold text-brand-espresso">
              {freeShippingThreshold}
            </p>
          </div>
          <p className="text-[11.5px] text-brand-taupe leading-normal mt-3 font-normal">
            Áp dụng tự động khi tổng giá trị giỏ hàng (sau chiết khấu) đạt mức quy định.
          </p>
        </div>
        <div className="p-5.5 rounded-2xl bg-brand-cream/30 border border-brand-sand/50 shadow-3xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-brand-taupe uppercase tracking-wider block mb-1">
              Phí vận chuyển mặc định
            </span>
            <p className="text-[20px] font-semibold text-brand-espresso">
              {defaultShippingFee}
            </p>
          </div>
          <p className="text-[11.5px] text-brand-taupe leading-normal mt-3 font-normal">
            Mức phí giao hàng đồng giá áp dụng cho mọi địa chỉ thuộc lãnh thổ Việt Nam.
          </p>
        </div>
      </div>

      
      <div className="space-y-3.5 pt-4">
        <h4 className="text-[11px] text-brand-taupe uppercase tracking-wider font-semibold">
          Câu hỏi thường gặp về vận chuyển
        </h4>

        {deliveryFaqs.map((faq) => {
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
