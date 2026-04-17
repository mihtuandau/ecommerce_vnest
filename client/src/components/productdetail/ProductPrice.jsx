import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { formatPrice, getTimeLeft } from "../../utils/formatters";

const Seg = ({ val }) => (
  <span className="inline-block w-8 text-center bg-gray-900 text-white text-xs font-black rounded-md py-0.5 tabular-nums">
    {String(val).padStart(2, '0')}
  </span>
);

const ProductPrice = ({ currentPrice, originalPrice, flashSale }) => {
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const countdownTarget = flashSale?.endDate ? flashSale.endDate : null;

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownTarget));
  useEffect(() => {
    if (!countdownTarget) return;
    setTimeLeft(getTimeLeft(countdownTarget));
    const id = setInterval(() => setTimeLeft(getTimeLeft(countdownTarget)), 1000);
    return () => clearInterval(id);
  }, [flashSale?.endDate, originalPrice, currentPrice]);

  return (
    <div className="bg-rose-50/60 rounded-xl px-4 py-4 border border-rose-100">
      {/* Badge */}
      {(flashSale || hasDiscount) && (
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
            <Zap size={8} className="fill-white" />
            {flashSale?.isFlashSale ? 'Flash Sale' : 'Ưu đãi'} &nbsp;·&nbsp; -{discountPercent}%
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-rose-600 tracking-tight">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Countdown */}
      {countdownTarget && timeLeft && !timeLeft.expired && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-rose-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={13} className="text-rose-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Kết thúc sau</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            {timeLeft.days > 0 && (
              <>
                <Seg val={timeLeft.days} />
                <span className="text-rose-600 font-bold text-[10px] uppercase ml-0.5 mr-1">Ngày</span>
              </>
            )}
            <Seg val={timeLeft.hours} />
            <span className="text-gray-400 font-bold text-xs">:</span>
            <Seg val={timeLeft.minutes} />
            <span className="text-gray-400 font-bold text-xs">:</span>
            <Seg val={timeLeft.seconds} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
