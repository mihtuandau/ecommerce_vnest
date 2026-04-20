import { formatPrice } from "../../utils/formatters";

const OrderPriceSummary = ({ order }) => {
  if (!order) return null;

  return (
    <div className="border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 style={{ fontFamily: 'Inter, sans-serif' }} className="text-sm font-semibold text-slate-800">
          Tóm tắt đơn hàng
        </h2>
      </div>

      <div className="space-y-4 px-6 py-6 transition-all">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-semibold text-[11px]">Tạm tính</span>
          <span className="text-slate-800 font-semibold text-sm">
            {formatPrice(order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-semibold text-[11px]">Phí vận chuyển</span>
          <span className="text-slate-800 font-semibold text-sm">
            {(() => {
              // Ưu tiên dùng phí ship đã lưu, nếu là đơn cũ (bằng 0) thì tự tính để hiển thị đúng
              const subtotal = order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.subtotal;
              const fee = (order.shippingFee > 0) ? order.shippingFee : (subtotal < 500000 ? 30000 : 0);
              
              return fee === 0 ? (
                <span className="text-green-600 uppercase text-[10px] tracking-wider">Miễn phí</span>
              ) : (
                formatPrice(fee)
              );
            })()}
          </span>
        </div>

        {order.discountAmount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span className="font-semibold text-[11px]">Giảm giá</span>
            <span className="font-semibold text-sm">
              -{formatPrice(order.discountAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-100 pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-800">Tổng cộng</span>
          <span className="text-xl font-semibold text-slate-800 tracking-tighter">
            {(() => {
              const subtotal = order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.subtotal;
              const fee = (order.shippingFee > 0) ? order.shippingFee : (subtotal < 500000 ? 30000 : 0);
              // Nếu đơn cũ (fee=30k nhưng DB lỡ lưu shippingFee=0) thì ta cộng thêm vào total hiển thị
              const displayTotal = (order.shippingFee === 0 && fee > 0) ? (order.total + fee) : order.total;
              return formatPrice(displayTotal);
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
