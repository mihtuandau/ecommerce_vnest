import { FaCreditCard } from 'react-icons/fa';

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <FaCreditCard className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="CASH"
            checked={paymentMethod === 'CASH'}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-5 h-5 text-blue-600"
          />
          <div>
            <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
            <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50">
          <input
            type="radio"
            name="paymentMethod"
            value="VNPAY"
            disabled
            className="w-5 h-5 text-blue-600"
          />
          <div>
            <div className="font-medium text-gray-900">VNPay</div>
            <div className="text-sm text-gray-500">Đang phát triển...</div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50">
          <input
            type="radio"
            name="paymentMethod"
            value="MOMO"
            disabled
            className="w-5 h-5 text-blue-600"
          />
          <div>
            <div className="font-medium text-gray-900">MoMo</div>
            <div className="text-sm text-gray-500">Đang phát triển...</div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;