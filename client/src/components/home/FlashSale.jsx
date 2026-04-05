import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ChevronRight, Flame } from 'lucide-react';
import { useFlashSale } from '../../hooks/useFlashSale';
import { formatPrice } from '../../utils/formatters';
import StarRating from '../common/StarRating';

/* ---------- Countdown helpers ---------- */
function getTimeLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

/* ---------- Countdown component ---------- */
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

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-xl">
        <span className="text-xl font-black text-yellow-300 tabular-nums leading-none">
          {pad(value)}
        </span>
      </div>
      <span className="text-[9px] uppercase tracking-widest text-white/60 mt-1">{label}</span>
    </div>
  );

  const Colon = () => (
    <span className="text-yellow-300 text-lg font-black pb-4 select-none animate-pulse">:</span>
  );

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
function FlashProductCard({ product, discountPercent }) {
  const productImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0].url : null);

  const originalPrice = product.originalPrice || product.basePrice || 0;
  const salePrice = discountPercent
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : product.price || originalPrice;

  const soldCount = product.soldCount || 0;
  const totalStock = soldCount + Math.max(20, Math.round(soldCount * 0.3));
  const soldPercent = Math.min(100, Math.round((soldCount / totalStock) * 100));

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/60"
    >
      {/* Discount ribbon */}
      <div className="absolute top-0 left-0 z-10">
        <div className="flex items-center gap-0.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-br-xl shadow">
          <Zap size={9} className="fill-current" />
          -{discountPercent}%
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={productImage || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow p-3 gap-2">
        <h3
          className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.6rem]"
          title={product.name}
        >
          {product.name}
        </h3>

        <StarRating
          rating={product.averageRating || 0}
          size={10}
          showNumber={false}
          reviewCount={product.reviewCount || 0}
        />

        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          <span className="text-base font-black text-red-600">{formatPrice(salePrice)}</span>
          {originalPrice > salePrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Sold progress */}
        <div className="mt-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-full transition-all duration-700"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            {soldPercent >= 80 ? (
              <>
                <Flame size={12} className="text-red-500" />
                Sắp hết
              </>
            ) : (
              `Đã bán ${soldCount}`
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Main FlashSale component ---------- */
const FlashSale = () => {
  const { flashSale, isLoading } = useFlashSale();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-700 via-red-500 to-orange-500">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center min-h-[260px]">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!flashSale) return null;

  const discountPercent = flashSale.percentage || 0;
  const products = flashSale.products || [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-500 to-orange-500">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Zap
            key={i}
            size={20 + i * 8}
            className="absolute text-white/[0.04]"
            style={{ top: `${8 + i * 18}%`, right: `${4 + i * 7}%`, transform: `rotate(${i * 30}deg)` }}
          />
        ))}
      </div>

      {/* ── Top banner bar ── */}
      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: brand + label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-500/30 shrink-0">
              <Flame size={22} className="text-red-600 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
                  FLASH SALE
                </h2>
                <span className="px-2.5 py-0.5 bg-yellow-400 text-red-700 text-[11px] font-black rounded-full uppercase tracking-wide animate-pulse shrink-0">
                  LIVE
                </span>
              </div>
              {flashSale.description && (
                <p className="text-white/70 text-sm mt-0.5 leading-tight">{flashSale.description}</p>
              )}
            </div>
          </div>

          {/* Right: countdown */}
          {flashSale.endDate && (
            <div className="flex items-center gap-3 sm:justify-end">
              <div className="flex items-center gap-1.5 text-white/60 text-xs shrink-0">
                <Clock size={12} />
                <span>Kết thúc sau</span>
              </div>
              <CountdownTimer endDate={flashSale.endDate} />
            </div>
          )}
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-8">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
                <FlashProductCard
                  key={product.id}
                  product={product}
                  discountPercent={discountPercent}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-yellow-50 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl"
              >
                Xem tất cả ưu đãi
                <ChevronRight size={17} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60">Đang cập nhật sản phẩm Flash Sale...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSale;
