import { formatPrice } from "../../utils/formatters";

const OrderPriceSummary = ({ order }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Tổng thanh toán
        </h2>
      </div>

      <div className="space-y-2.5 px-5 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Tạm tính</span>
          <span className="text-slate-900">
            {formatPrice(order.total - (order.shippingFee || 0))}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Phí vận chuyển</span>
          <span className="text-slate-900">
            {order.shippingFee === 0
              ? "Miễn phí"
              : formatPrice(order.shippingFee || 0)}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Giảm giá</span>
            <span className="text-emerald-600">
              -{formatPrice(order.discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4 border-t border-slate-200 pt-3.5 text-base font-semibold">
          <span className="text-slate-900">Tổng cộng</span>
          <span className="text-sky-600">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
