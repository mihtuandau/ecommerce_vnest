const OrderShippingInfo = ({ order }) => {
  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Thanh toán khi nhận hàng (COD)',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
      CARD: 'Thẻ tín dụng/ghi nợ',
      PAYOS: 'PayOS'
    };
    return methods[method] || method;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Địa chỉ giao hàng</h2>
      </div>

      <div className="space-y-3 px-5 py-4 text-sm">
        <div className="flex gap-3">
          <span className="w-32 flex-shrink-0 text-slate-500">Người nhận</span>
          <span className="text-slate-900">
            {order.shippingSnapshot?.fullName || order.shippingInfo?.fullName || 'Chưa cập nhật'}
          </span>
        </div>
        
        <div className="flex gap-3">
          <span className="w-32 flex-shrink-0 text-slate-500">Số điện thoại</span>
          <span className="text-slate-900">
            {order.shippingSnapshot?.phone || order.shippingInfo?.phone || 'Chưa cập nhật'}
          </span>
        </div>
        
        <div className="flex gap-3">
          <span className="w-32 flex-shrink-0 text-slate-500">Địa chỉ</span>
          <span className="flex-1 text-slate-900">
            {order.shippingSnapshot?.addressString || order.shippingAddress || 'Chưa cập nhật'}
          </span>
        </div>

        {(order.shippingSnapshot?.note || order.shippingInfo?.note) && (
          <div className="flex gap-3 border-t border-slate-200 pt-3">
            <span className="w-32 flex-shrink-0 text-slate-500">Ghi chú</span>
            <span className="flex-1 text-slate-900">
              {order.shippingSnapshot?.note || order.shippingInfo?.note}
            </span>
          </div>
        )}

        <div className="flex gap-3 border-t border-slate-200 pt-3">
          <span className="w-32 flex-shrink-0 text-slate-500">Thanh toán</span>
          <span className="text-slate-900">
            {getPaymentMethodText(order.paymentMethod)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderShippingInfo;






