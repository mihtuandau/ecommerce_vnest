import React from "react";
import { Tag, ShoppingCart, Percent, Gift } from "lucide-react";

const PromotionsHero = ({ voucherCount }) => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 via-45% to-pink-500 px-6 pt-[72px] pb-20 text-center overflow-hidden">
      {}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-pink-500/30 blur-[72px] -top-20 -left-20 pointer-events-none animate-[blob_7s_ease-in-out_infinite]" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-indigo-500/40 blur-[60px] -bottom-[60px] -right-10 pointer-events-none animate-[blob_9s_ease-in-out_infinite_reverse]" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 blur-[40px] top-[30%] right-[15%] pointer-events-none" />

      <div className="relative z-10 max-w-[600px] mx-auto">
        {}
        <div className="inline-flex items-center gap-[7px] bg-white/15 border border-white/35 rounded-full px-[18px] py-1.5 mb-[18px] backdrop-blur-md">
          <Gift size={14} className="text-amber-200" />
          <span className="text-white text-[11px] font-extrabold tracking-[0.16em] uppercase">
            Ưu đãi đặc biệt
          </span>
        </div>

        <h1 className="text-white font-heading text-[clamp(34px,5.5vw,58px)] font-black leading-[1.12] m-0 mb-3.5">
          Khuyến Mãi &amp;{" "}
          <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            Voucher Giảm Giá
          </span>
        </h1>

        <p className="text-white/80 text-[15px] leading-[1.65] mx-auto mb-[30px] max-w-[420px]">
          Hàng chục mã khuyến mãi hấp dẫn cập nhật mỗi ngày. Sao chép và áp dụng
          ngay khi thanh toán!
        </p>

        {}
        <div className="flex gap-2.5 justify-center flex-wrap">
          {[
            {
              icon: <Tag size={13} />,
              text: `${voucherCount} Voucher đang có`,
            },
            { icon: <Percent size={13} />, text: "50% Giảm tối đa" },
            {
              icon: <ShoppingCart size={13} />,
              text: "1.500+ Lượt dùng/ngày",
            },
          ].map((s) => (
            <div
              key={s.text}
              className="inline-flex items-center gap-[7px] bg-white/10 border border-white-20 text-white rounded-full px-4 py-[7px] text-xs font-bold backdrop-blur-sm"
            >
              {s.icon} {s.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsHero;






