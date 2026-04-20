const OrderShippingInfo = ({ order }) => {
  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Thanh toán khi nhận hàng (COD)',
      VNPAY: 'VNPay',
      ZALOPAY: 'ZaloPay',
      MOMO: 'MoMo',
      CARD: 'Thẻ tín dụng/ghi nợ',
      PAYOS: 'PayOS'
    };
    return methods[method] || method;
  };

  return (
    <div className="border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-5 bg-gray-50/50">
        <h2 style={{ fontFamily: 'Inter, sans-serif' }} className="text-sm font-semibold text-slate-800 tracking-tight">
          Thông tin giao hàng
        </h2>
      </div>

      <div className="px-6 py-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Người nhận</span>
            <p className="text-sm font-semibold text-slate-800">
              {order.shippingSnapshot?.fullName || order.shippingInfo?.fullName || 'Chưa cập nhật'}
            </p>
          </div>
          
          <div className="space-y-1.5">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Số điện thoại</span>
            <p className="text-sm font-semibold text-slate-800">
              {order.shippingSnapshot?.phone || order.shippingInfo?.phone || 'Chưa cập nhật'}
            </p>
          </div>
        </div>
        
        <div className="space-y-1.5 border-t border-gray-50 pt-5">
          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Địa chỉ nhận hàng</span>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {order.shippingSnapshot?.addressString || order.shippingAddress || 'Chưa cập nhật'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-50 pt-5">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Phương thức thanh toán</span>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-slate-800">
                {getPaymentMethodText(order.paymentMethod || order.payment?.method)}
              </p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </span>
            </div>
          </div>

          {(order.shippingSnapshot?.note || order.shippingInfo?.note) && (
            <div className="space-y-1.5">
              <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Ghi chú đơn hàng</span>
              <p className="text-sm font-medium text-gray-600">
              "{order.shippingSnapshot?.note || order.shippingInfo?.note}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderShippingInfo;
