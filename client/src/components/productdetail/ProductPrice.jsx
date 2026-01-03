import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { formatPrice } from "../../utils/formatters";

const ProductPrice = ({ currentPrice, originalPrice, product }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (originalPrice && originalPrice > currentPrice) {
      const discountEndDate = new Date(Date.now() + 74 * 24 * 60 * 60 * 1000);

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = discountEndDate.getTime() - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [originalPrice, currentPrice]);

  const discountPercent =
    originalPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const totalStock =
    product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const soldCount = product.soldCount || 0;
  const initialStock = totalStock + soldCount;
  const stockPercentage = initialStock > 0 ? (totalStock / initialStock) * 100 : 0;

  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-4 mb-1">
        <span className="text-3xl font-light text-gray-900 tracking-tight">
          {formatPrice(currentPrice)}
        </span>
        {originalPrice && originalPrice > currentPrice && (
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

      {/* Stock Progress Bar - tinh tế */}
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
            ></div>
          </div>
        </div>
      )}

      {/* Flash Sale Countdown - tinh tế hơn */}
      {originalPrice && originalPrice > currentPrice && (
        <div className="mt-6 py-5 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <FaClock className="text-gray-400 w-3.5 h-3.5" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Ưu đãi kết thúc sau
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { value: timeLeft.days, label: 'Ngày' },
              { value: timeLeft.hours, label: 'Giờ' },
              { value: timeLeft.minutes, label: 'Phút' },
              { value: timeLeft.seconds, label: 'Giây' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-gray-50 px-4 py-3 min-w-[60px]">
                <span className="text-lg font-light text-gray-900 tabular-nums">{String(item.value).padStart(2, '0')}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductPrice;
