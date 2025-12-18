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
        <span className="text-4xl font-light text-gray-900 tracking-tight">
          {formatPrice(currentPrice)}
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <>
            <span className="text-xl font-light text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="px-3 py-1 bg-gray-900 text-white font-light text-sm">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Stock Progress Bar */}
      {totalStock > 0 && (
        <div className="mt-5 p-4 bg-gray-50 border border-gray-100">
          <p className="text-sm font-light text-gray-600 mb-3">
            Chỉ còn <span className="font-normal text-gray-900">{totalStock}</span> sản phẩm trong kho
          </p>
          <div className="w-full bg-gray-200 h-1.5">
            <div 
              className="bg-gray-900 h-1.5 transition-all duration-300"
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Flash Sale Countdown */}
      {originalPrice && originalPrice > currentPrice && (
        <div className="mt-5 p-5 bg-white border border-gray-200">
          <div className="flex items-center gap-2.5 mb-4">
            <FaClock className="text-gray-600 w-4 h-4" />
            <p className="text-sm font-light text-gray-600">
              Ưu đãi kết thúc sau
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { value: timeLeft.days, label: 'Ngày' },
              { value: timeLeft.hours, label: 'Giờ' },
              { value: timeLeft.minutes, label: 'Phút' },
              { value: timeLeft.seconds, label: 'Giây' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center bg-gray-50 border border-gray-200 px-3 py-2.5 min-w-[62px]">
                <span className="text-xl font-light text-gray-900 tracking-tight">{String(item.value).padStart(2, '0')}</span>
                <span className="text-xs font-light text-gray-500 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
