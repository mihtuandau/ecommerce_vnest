import { formatPrice } from '../../utils/formatters';

const PriceSummary = ({ itemCount, subtotal, shipping, discount, flashSaleDiscount, total }) => {
  console.log('PriceSummary - Shipping received:', shipping);
  return (
    <div className="border-t border-gray-200 pt-5 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tạm tính ({itemCount} sản phẩm)</span>
        <span className="text-slate-800 font-semibold font-inter">{formatPrice(subtotal)}</span>
      </div>
      
        <div className="flex justify-between items-start text-sm py-1">
          <div className="flex flex-col">
            <span className="text-gray-600 flex items-center gap-1.5">
              Phí vận chuyển
              <span className="bg-[#FF6433] text-white text-[9px] px-1.5 py-0.5 font-bold rounded-sm">GHN</span>
            </span>
            {shipping !== undefined && shipping !== 0 && (
              <span className="text-[10px] text-gray-400 italic mt-0.5">Dự kiến nhận hàng: 2 - 4 ngày</span>
            )}
          </div>
          <span className="text-slate-800 font-semibold font-inter">
            {shipping === undefined ? (
              <span className="text-gray-400 animate-pulse italic text-xs">Đang tính...</span>
            ) : shipping === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

      {flashSaleDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-red-600 flex items-center gap-1">
             Flash Sale
          </span>
          <span className="text-red-600 font-medium font-semibold font-inter">-{formatPrice(flashSaleDiscount)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mã giảm giá</span>
          <span className="text-slate-800 font-semibold font-inter">-{formatPrice(discount)}</span>
        </div>
      )}

      {subtotal < 500000 && shipping > 0 && (
        <div className="text-xs text-gray-600 border border-gray-300 p-3 bg-gray-50">
          Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship
        </div>
      )}

      <div className="flex justify-between text-base font-normal pt-3 border-t border-gray-200">
        <span className="text-slate-800">Tổng cộng</span>
        <span className="text-slate-800 font-semibold font-inter">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;





