import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { Zap } from "lucide-react";
import { formatPrice } from "../../utils/formatters";

/* ── Countdown helper ───────────────────────────────────────────────────────── */
function getTimeLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    expired: false,
  };
}

const ProductPrice = ({ currentPrice, originalPrice, product, flashSale }) => {
  /* ─ countdown state ─ */
  // flash sale dùng endDate thật; variant sale dùng fake 74 ngày
  const countdownTarget = flashSale?.endDate
    ? new Date(flashSale.endDate)
    : (originalPrice && originalPrice > currentPrice)
      ? new Date(Date.now() + 74 * 24 * 60 * 60 * 1000)
      : null;

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownTarget));

  useEffect(() => {
    if (!countdownTarget) return;
    setTimeLeft(getTimeLeft(countdownTarget));
    const id = setInterval(() => setTimeLeft(getTimeLeft(countdownTarget)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashSale?.endDate, originalPrice, currentPrice]);

  const isOnSale = originalPrice && originalPrice > currentPrice;
  const discountPercent = isOnSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const soldCount = product?.soldCount || 0;
  const initialStock = totalStock + soldCount;
  const stockPercentage = initialStock > 0 ? (totalStock / initialStock) * 100 : 0;

  return (
    <div className="mb-10">

      {/* ── Discount banner (Flash Sale hoặc KM thường) ── */}
      {flashSale && (
        <div className={`flex items-center gap-2 mb-3 px-3 py-1.5 text-white text-xs font-medium w-fit rounded-sm ${flashSale.isFlashSale ? 'bg-red-500' : 'bg-[#00a85a]'}`}>
          <Zap size={11} className="fill-white" />
          <span className="uppercase tracking-wide">
            {flashSale.isFlashSale ? 'Flash Sale' : 'Khuyến Mãi'}
          </span>
          {flashSale.percentage && (
            <span className="ml-1 opacity-80">−{flashSale.percentage}%</span>
          )}
        </div>
      )}

      {/* ── Giá ── */}
      <div className="flex items-baseline gap-4 mb-1">
        <span className="text-3xl font-light text-gray-900 tracking-tight">
          {formatPrice(currentPrice)}
        </span>
        {isOnSale && (
          <>
            <span className="text-base text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium text-gray-900 border border-gray-900">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Stock progress bar */}
      {totalStock > 0 && totalStock <= 20 && (
        <div className="mt-6 py-4 border-t border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Tồn kho</span>
            <span className="text-xs text-gray-900">{totalStock} sản phẩm</span>
          </div>
          <div className="w-full bg-gray-100 h-0.5">
            <div
              className="bg-gray-900 h-0.5 transition-all duration-300"
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Countdown ── */}
      {countdownTarget && timeLeft && !timeLeft.expired && (
        <div className="mt-6 py-5 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <FaClock className="text-gray-400 w-3.5 h-3.5" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {flashSale?.isFlashSale ? 'Flash sale kết thúc sau' : flashSale ? 'Khuyến mãi kết thúc sau' : 'Ưu đãi kết thúc sau'}
            </p>
          </div>
          <div className="flex gap-2">
            {(timeLeft.days > 0
              ? [
                  { value: timeLeft.days,    label: 'Ngày' },
                  { value: timeLeft.hours,   label: 'Giờ' },
                  { value: timeLeft.minutes, label: 'Phút' },
                  { value: timeLeft.seconds, label: 'Giây' },
                ]
              : [
                  { value: timeLeft.hours,   label: 'Giờ' },
                  { value: timeLeft.minutes, label: 'Phút' },
                  { value: timeLeft.seconds, label: 'Giây' },
                ]
            ).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-gray-50 px-4 py-3 min-w-[60px]">
                <span className="text-lg font-light text-gray-900 tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Khuyến mãi đã kết thúc */}
      {flashSale && timeLeft?.expired && (
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
          {flashSale.isFlashSale ? 'Flash sale đã kết thúc' : 'Khuyến mãi đã kết thúc'}
        </p>
      )}
    </div>
  );
};

export default ProductPrice;

