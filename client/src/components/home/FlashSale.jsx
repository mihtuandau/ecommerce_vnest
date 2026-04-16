import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, ChevronRight, Flame, Heart, Eye } from "lucide-react";
import { useFlashSale } from "../../hooks/useFlashSale";
import { formatPrice, getTimeLeft } from "../../utils/formatters";
import StarRating from "../common/StarRating";

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ---------- Countdown component ---------- */
const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/10 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-xl">
      <span className="text-xl font-bold text-white tabular-nums leading-none">
        {pad(value)}
      </span>
    </div>
  </div>
);

const Colon = () => (
  <span className="text-white/50 text-xl font-bold pb-1">:</span>
);

function CountdownTimer({ endDate }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) {
    return <span className="text-sm font-light text-red-200">Đã kết thúc</span>;
  }

  return (
    <div className="flex items-end gap-1.5">
      {time.days > 0 && (
        <>
          <TimeBlock value={time.days} label="ngày" />
          <Colon />
        </>
      )}
      <TimeBlock value={time.hours} label="giờ" />
      <Colon />
      <TimeBlock value={time.minutes} label="phút" />
      <Colon />
      <TimeBlock value={time.seconds} label="giây" />
    </div>
  );
}

/* ---------- Flash Sale Product Card ---------- */
/* ---------- Flash Sale Product Card ---------- */
function FlashProductCard({ product, discountPercent }) {
  const getLowestPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
      return prices.length > 0
        ? Math.min(...prices)
        : product.basePrice || product.price || 0;
    }
    return product.basePrice || product.price || 0;
  };

  const productImage =
    product.image ||
    (product.images && product.images.length > 0
      ? product.images[0].url
      : null);

  const originalPrice = getLowestPrice(product);
  const salePrice =
    discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

  const soldCount = product.soldCount || 0;
  const totalStock = Math.max(soldCount + 20, 100);
  const soldPercent = Math.min(100, Math.round((soldCount / totalStock) * 100));

  return (
    <Link
      to={`/products/${product.slug || product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Discount Badge */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <div className="bg-[#ff4d15] text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded shadow-sm italic">
          -{discountPercent}%
        </div>
      </div>

      {/* Product Image - Wide Aspect */}
      <div className="relative aspect-[5/4] overflow-hidden bg-gray-50/30 flex items-center justify-center p-3">
        <img
          src={productImage || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Info - Compact but Professional */}
      <div className="p-3 flex flex-col flex-grow bg-white">
        <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-900 line-clamp-2 mb-1.5 h-[2.4em] leading-tight transition-colors overflow-hidden">
          {product.name}
        </h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 flex-wrap min-h-[1.5rem]">
            <span className="text-sm sm:text-[15px] font-black text-[#ff4d15] tracking-tight">
              {formatPrice(salePrice)}
            </span>
            {discountPercent > 0 && originalPrice > salePrice && (
              <span className="text-[10px] text-gray-400 line-through font-medium opacity-60">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-[#ff4d15] rounded-full"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[8px] font-bold text-gray-400 uppercase tracking-tight">
              <span>ĐÃ BÁN {soldCount}</span>
              {soldPercent > 80 && (
                <span className="text-red-500">SẮP HẾT</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Main FlashSale component ---------- */
const FlashSale = () => {
  const { flashSale: rawData, isLoading } = useFlashSale();

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-64 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">
          <Zap className="text-gray-200 animate-bounce" size={48} />
        </div>
      </section>
    );
  }

  const flashSale = rawData?.data || rawData;
  if (!flashSale || !flashSale.percentage) return null;

  const discountPercent = flashSale.percentage || 0;
  const products = flashSale.products || [];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#ff4d15] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                <Flame className="text-white fill-current" size={32} />
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic">
                  FLASH SALE
                </h2>
              </div>

              <CountdownTimer endDate={flashSale.endDate} />
            </div>

            <Link
              to="/flash-sale"
              className="bg-white text-[#ff4d15] px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-orange-50 transition-colors shadow-lg self-start sm:self-auto"
            >
              XEM TẤT CẢ
            </Link>
          </div>

          {/* Grid - 4 Columns as requested earlier but with larger cards */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((product) => (
              <FlashProductCard
                key={product.id}
                product={product}
                discountPercent={discountPercent}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
