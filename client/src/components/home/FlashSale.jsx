import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Copy, Check, Clock, Tag, ChevronRight } from 'lucide-react';
import { FaHeart, FaEye } from 'react-icons/fa';
import { useFlashSale } from '../../hooks/useFlashSale';
import { formatPrice } from '../../utils/formatters';
import StarRating from '../common/StarRating';
import { notify } from '../../utils/notification';

/* ---------- Countdown helpers ---------- */
function getTimeLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
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
    return (
      <span className="text-sm font-light text-red-200">Đã kết thúc</span>
    );
  }

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center rounded-lg shadow-inner">
        <span className="text-2xl font-bold text-white tabular-nums leading-none">
          {pad(value)}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-white/70 mt-1">{label}</span>
    </div>
  );

  const Colon = () => (
    <span className="text-white text-2xl font-bold pb-5 select-none animate-pulse">:</span>
  );

  return (
    <div className="flex items-end gap-2">
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
  const [copied, setCopied] = useState(false);

  const productImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0].url : null);

  const originalPrice = product.originalPrice || product.basePrice || 0;
  const salePrice = discountPercent
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : product.price || originalPrice;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[11px] font-semibold rounded-sm">
          <Zap size={9} />
          -{discountPercent}%
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={productImage || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow p-3 gap-1.5">
        <h3
          className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight"
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

        <div className="flex items-baseline gap-2 flex-wrap mt-auto pt-1">
          <span className="text-base font-bold text-red-600">
            {formatPrice(salePrice)}
          </span>
          {originalPrice > salePrice && (
            <span className="text-xs font-light text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Progress bar giả lập hàng còn lại */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Đã bán {product.soldCount || 0}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  ((product.soldCount || 0) / Math.max(1, (product.soldCount || 0) + 20)) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Main FlashSale component ---------- */
const FlashSale = () => {
  const { flashSale, isLoading } = useFlashSale();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = useCallback(() => {
    if (!flashSale?.code) return;
    navigator.clipboard
      .writeText(flashSale.code)
      .then(() => {
        setCodeCopied(true);
        notify.success(`Đã sao chép mã "${flashSale.code}"!`);
        setTimeout(() => setCodeCopied(false), 2500);
      })
      .catch(() => notify.error('Không thể sao chép'));
  }, [flashSale]);

  // Không render nếu không có dữ liệu
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!flashSale) return null;

  const discountPercent = flashSale.percentage || 0;
  const discountLabel = discountPercent
    ? `Giảm ${discountPercent}%`
    : flashSale.fixedAmount
    ? `Giảm ${formatPrice(flashSale.fixedAmount)}`
    : 'Ưu đãi đặc biệt';

  const products = flashSale.products || [];

  return (
    <section className="py-16 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-400/10 rounded-full transform -translate-y-1/2" />
        {/* Lightning bolt pattern */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Zap
            key={i}
            size={18 + i * 6}
            className="absolute text-white/5"
            style={{
              top: `${10 + i * 15}%`,
              right: `${5 + i * 8}%`,
              transform: `rotate(${i * 25}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
          {/* Left: Title + countdown */}
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-lg shadow-lg">
                <Zap size={22} className="text-red-600 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    FLASH SALE
                  </h2>
                  <span className="px-2.5 py-0.5 bg-yellow-400 text-red-700 text-xs font-bold rounded-full uppercase tracking-wide animate-pulse">
                    LIVE
                  </span>
                </div>
                {flashSale.description && (
                  <p className="text-white/80 text-sm mt-0.5">{flashSale.description}</p>
                )}
              </div>
            </div>

            {/* Countdown */}
            {flashSale.endDate && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Clock size={13} />
                  <span>Kết thúc sau</span>
                </div>
                <CountdownTimer endDate={flashSale.endDate} />
              </div>
            )}
          </div>

          {/* Right: Discount code banner */}
          <div className="flex-shrink-0">
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-5 shadow-xl min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={15} className="text-yellow-300" />
                <span className="text-white/80 text-sm">Mã giảm giá Flash Sale</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 border border-dashed border-white/40 rounded-lg px-4 py-2.5 text-center">
                  <span className="text-xl font-black text-yellow-300 tracking-widest">
                    {flashSale.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    codeCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-400 text-red-700 hover:bg-yellow-300 active:scale-95'
                  }`}
                >
                  {codeCopied ? (
                    <>
                      <Check size={15} />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Sao chép
                    </>
                  )}
                </button>
              </div>
              <p className="text-white/60 text-xs mt-2.5 text-center">
                {discountLabel}
                {flashSale.minOrderAmount > 0 && (
                  <> · Đơn từ {formatPrice(flashSale.minOrderAmount)}</>
                )}
                {flashSale.maxDiscountAmount > 0 && (
                  <> · Giảm tối đa {formatPrice(flashSale.maxDiscountAmount)}</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {products.map((product) => (
                <FlashProductCard
                  key={product.id}
                  product={product}
                  discountPercent={discountPercent}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                Xem thêm sản phẩm khuyến mãi
                <ChevronRight size={18} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">Đang cập nhật sản phẩm Flash Sale...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSale;
