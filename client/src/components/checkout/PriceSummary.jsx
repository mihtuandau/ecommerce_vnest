import { formatPrice } from '../../utils/formatters';

const PriceSummary = ({ itemCount, subtotal, shipping, discount, flashSaleDiscount, total }) => {
  return (
    <div className="border-t border-gray-200 pt-5 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tạm tính ({itemCount} sản phẩm)</span>
        <span className="text-gray-900">{formatPrice(subtotal)}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Phí vận chuyển</span>
        <span className="text-gray-900">
          {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
        </span>
      </div>

      {flashSaleDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-red-600 flex items-center gap-1">
             Flash Sale
          </span>
          <span className="text-red-600 font-medium">-{formatPrice(flashSaleDiscount)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mã giảm giá</span>
          <span className="text-gray-900">-{formatPrice(discount)}</span>
        </div>
      )}

      {subtotal < 500000 && shipping > 0 && (
        <div className="text-xs text-gray-600 border border-gray-300 p-3 bg-gray-50">
          Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship
        </div>
      )}

      <div className="flex justify-between text-base font-normal pt-3 border-t border-gray-200">
        <span className="text-gray-900">Tổng cộng</span>
        <span className="text-gray-900">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;





