import Button from '../common/Button';

const CartSummary = ({ total, selectedCount, totalCount, formatPrice, onCheckout }) => {
  return (
    <div className="bg-white border border-gray-200 sticky top-8">
      <div className="p-8">
        <h2 className="text-lg font-normal text-gray-900 mb-8 pb-6 border-b border-gray-200">
          Tóm Tắt Đơn Hàng
        </h2>

        {/* Selected Items Count */}
        {selectedCount !== undefined && totalCount !== undefined && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Đã chọn{' '}
              <span className="font-medium text-gray-900">{selectedCount}</span>
              {' '}/ {totalCount} sản phẩm
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="text-gray-900">
              Miễn phí
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-base font-normal text-gray-900">
                Tổng cộng
              </span>
              <span className="text-2xl font-light text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Tiến Hành Thanh Toán
        </Button>
        
        {selectedCount === 0 && (
          <p className="text-xs text-red-600 text-center mb-6">
            Vui lòng chọn ít nhất một sản phẩm
          </p>
        )}

        <div className="text-sm text-gray-600 space-y-3 pt-6 border-t border-gray-200">
          <p className="flex items-start gap-2">
            <span className="text-gray-900 mt-0.5">—</span>
            <span>Miễn phí vận chuyển toàn quốc</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-gray-900 mt-0.5">—</span>
            <span>Đổi trả trong 30 ngày</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-gray-900 mt-0.5">—</span>
            <span>Thanh toán an toàn</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
