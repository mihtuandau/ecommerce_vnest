"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface CustomerContactViewProps {
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
}

export default function CustomerContactView({
  storePhone,
  storeEmail,
  storeAddress,
}: CustomerContactViewProps) {
  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto h-full [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#E8E0D0]">
      <div>
        <h3 className="text-[15px] font-semibold text-[#3D2B1A] flex items-center gap-2.5">
          <Phone size={16} className="text-[#C4783A]" />
          Kênh hỗ trợ & Liên hệ trực tiếp
        </h3>
        <p className="text-[12px] text-[#8A7966] mt-1.5 leading-relaxed font-normal">Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp và phản hồi từ phía quý khách hàng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5.5 rounded-2xl bg-[#FAF8F4]/30 border border-[#DDD6C8]/50 shadow-3xs flex items-start gap-4">
          <div className="h-9.5 w-9.5 bg-white rounded-xl flex items-center justify-center text-[#3D2B1A] border border-[#DDD6C8]/30 shadow-3xs shrink-0">
            <Phone size={16} />
          </div>
          <div>
            <h4 className="text-[12.5px] font-medium text-[#3D2B1A]">Số điện thoại Hotline</h4>
            <p className="text-[11px] text-[#8A7966] mt-1 font-normal">Mọi thắc mắc mua sắm/kỹ thuật:</p>
            <a href={`tel:${storePhone}`} className="text-[13.5px] font-semibold text-[#3D2B1A] block mt-2 hover:text-[#C4783A] transition-colors">{storePhone}</a>
          </div>
        </div>

        <div className="p-5.5 rounded-2xl bg-[#FAF8F4]/30 border border-[#DDD6C8]/50 shadow-3xs flex items-start gap-4">
          <div className="h-9.5 w-9.5 bg-white rounded-xl flex items-center justify-center text-[#3D2B1A] border border-[#DDD6C8]/30 shadow-3xs shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <h4 className="text-[12.5px] font-medium text-[#3D2B1A]">Hòm thư hỗ trợ</h4>
            <p className="text-[11px] text-[#8A7966] mt-1 font-normal">Phản hồi chất lượng sản phẩm/dịch vụ:</p>
            <a href={`mailto:${storeEmail}`} className="text-[13.5px] font-semibold text-[#3D2B1A] block mt-2 hover:text-[#C4783A] transition-colors break-all">{storeEmail}</a>
          </div>
        </div>
      </div>

      <div className="p-5.5 rounded-2xl bg-[#FAF8F4]/30 border border-[#DDD6C8]/50 shadow-3xs flex items-start gap-4">
        <div className="h-9.5 w-9.5 bg-white rounded-xl flex items-center justify-center text-[#3D2B1A] border border-[#DDD6C8]/30 shadow-3xs shrink-0">
          <MapPin size={16} />
        </div>
        <div>
          <h4 className="text-[12.5px] font-medium text-[#3D2B1A]">Showroom & Trụ sở chính</h4>
          <p className="text-[11px] text-[#8A7966] mt-1 font-normal">Gặp gỡ trực tiếp hoặc tiếp nhận sản phẩm bảo hành:</p>
          <p className="text-[12.5px] text-[#3D2B1A] font-medium mt-2 leading-relaxed">{storeAddress}</p>
        </div>
      </div>
    </div>
  );
}
