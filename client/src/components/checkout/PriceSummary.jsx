import { formatPrice } from '../../utils/formatters';

const PriceSummary = ({ itemCount, subtotal, shipping, discount, total }) => {
  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex justify-between text-gray-600">
        <span>Tạm tính ({itemCount} sản phẩm)</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>
      
      <div className="flex justify-between text-gray-600">
        <span>Phí vận chuyển</span>
        <span className="font-medium">
          {shipping === 0 ? (
            <span className="text-green-600">Miễn phí</span>
          ) : (
            formatPrice(shipping)
          )}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Giảm giá</span>
          <span className="font-medium">-{formatPrice(discount)}</span>
        </div>
      )}

      {subtotal < 500000 && shipping > 0 && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          💡 Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship!
        </div>
      )}

      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
        <span>Tổng cộng</span>
        <span className="text-red-600">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;