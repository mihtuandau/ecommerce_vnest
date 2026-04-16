import React from "react";
import { Copy, Check, Clock, Percent, Tag, Truck, Zap } from "lucide-react";
import { formatPrice } from "../../utils/formatters";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN") : "Hết hạn: Không";

const VoucherCard = ({ voucher, onCopy, copiedCode }) => {
  const isCopied = copiedCode === voucher.code;
  const isPercent = !!voucher.percentage;
  const isFixed = !isPercent && !!voucher.fixedAmount;
  const isFreeShip = /ship|freeship|vận chuyển/i.test(
    (voucher.name || "") + (voucher.code || "")
  );
  const isFlash = voucher.isFlashSale;

  const bigValue = isPercent
    ? `${voucher.percentage}%`
    : isFixed
    ? formatPrice(voucher.fixedAmount)
    : null;
  const Icon = isFlash ? Zap : isFreeShip ? Truck : isPercent ? Percent : Tag;

  // Design Tokens based on voucher type
  const themeAccent = isFlash ? "orange" : "blue";

  const bgLight = isFlash ? "bg-orange-50" : "bg-blue-50";
  const textDark = isFlash ? "text-orange-600" : "text-blue-700";
  const borderDashed = isFlash ? "border-orange-200" : "border-blue-200";
  const borderSolid = isFlash ? "border-orange-100" : "border-blue-100";
  const iconBg = isFlash ? "bg-orange-100" : "bg-blue-100";
  const buttonBg = isCopied
    ? "bg-emerald-500 text-white shadow-emerald-500/30 border-transparent hover:bg-emerald-600"
    : isFlash
    ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/20 text-white border-transparent hover:shadow-orange-500/40"
    : "bg-blue-600 shadow-blue-600/20 text-white border-transparent hover:bg-blue-700 hover:shadow-blue-600/40";

  return (
    <div
      className={`flex bg-white border ${borderSolid} rounded-xl overflow-hidden hover:border-${themeAccent}-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group`}
    >
      {/* Left Stub */}
      <div
        className={`${bgLight} w-[105px] shrink-0 flex flex-col items-center justify-center p-3 relative border-r-2 border-dashed ${borderDashed}`}
      >
        {/* Notch top & bottom (creating the ticket effect seamlessly) */}
        <div className="absolute -right-[13px] top-0 transform -translate-y-1/2 w-6 h-6 bg-[#F4F6F8] rounded-full border border-gray-200 z-10 group-hover:border-gray-300 transition-colors" />
        <div className="absolute -right-[13px] bottom-0 transform translate-y-1/2 w-6 h-6 bg-[#F4F6F8] rounded-full border border-gray-200 z-10 group-hover:border-gray-300 transition-colors" />

        {/* Icon Inside Value */}
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-1.5 shadow-sm text-opacity-90`}
        >
          <Icon size={18} className={textDark} />
        </div>

        {bigValue ? (
          <div className="flex flex-col items-center">
            <span
              className={`font-heading font-black ${textDark} text-xl leading-none text-center tracking-tight drop-shadow-sm`}
            >
              {isFixed && bigValue.length > 6
                ? `${voucher.fixedAmount / 1000}k`
                : bigValue}
            </span>
            <span
              className={`text-[9px] font-bold ${textDark} opacity-80 uppercase mt-1 tracking-widest`}
            >
              giảm
            </span>
          </div>
        ) : (
          <span
            className={`font-heading font-black ${textDark} text-sm leading-tight text-center`}
          >
            FREE
            <br />
            SHIP
          </span>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between bg-white relative">
        <div>
          {isFlash && (
            <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
              <Zap size={10} className="fill-red-600" /> Flash Sale
            </div>
          )}
          <h3
            className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-snug pr-2"
            title={voucher.name}
          >
            {voucher.name}
          </h3>

          <div className="space-y-1 mt-1">
            {voucher.minOrderAmount > 0 && (
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <span className="text-gray-400">Đơn tối thiểu:</span>
                <span className="font-semibold text-gray-700">
                  {formatPrice(voucher.minOrderAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Clock size={12} className="text-gray-400" />
              <span className="font-semibold text-gray-700">
                {fmtDate(voucher.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-gray-50">
          {voucher.usageLimit != null ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Còn{" "}
              {Math.max((voucher.usageLimit || 0) - (voucher.usedCount || 0), 0)}{" "}
              lượt
            </div>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">
              Số lượng có hạn
            </span>
          )}

          <button
            onClick={() => onCopy(voucher.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${buttonBg} transform group-hover:scale-[1.02] active:scale-95`}
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? "Đã lưu" : "Lưu mã"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
