import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaQrcode } from 'react-icons/fa';
import Input from '../common/Input';

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
        <div className="w-10 h-10 border border-gray-900 flex items-center justify-center">
          <FaCreditCard className="text-gray-900 text-sm" />
        </div>
        <h2 className="text-lg font-normal text-gray-900">Phương Thức Thanh Toán</h2>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-4 p-4 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="CASH"
            checked={paymentMethod === 'CASH'}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-4 h-4 text-gray-900"
          />
          <FaMoneyBillWave className="text-xl text-gray-900" />
          <div>
            <div className="font-normal text-gray-900">Thanh toán khi nhận hàng (COD)</div>
            <div className="text-sm text-gray-600 mt-0.5">Thanh toán bằng tiền mặt khi nhận hàng</div>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="PAYOS"
            checked={paymentMethod === 'PAYOS'}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-4 h-4 text-gray-900"
          />
          <FaQrcode className="text-xl text-gray-900" />
          <div>
            <div className="font-normal text-gray-900">Chuyển khoản ngân hàng</div>
            <div className="text-sm text-gray-600 mt-0.5">Thanh toán qua QR Code hoặc chuyển khoản</div>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-gray-300 cursor-not-allowed opacity-40">
          <input
            type="radio"
            name="paymentMethod"
            value="VNPAY"
            disabled
            className="w-4 h-4"
          />
          <FaCreditCard className="text-xl text-gray-400" />
          <div>
            <div className="font-normal text-gray-900">VNPay</div>
            <div className="text-sm text-gray-600 mt-0.5">Đang phát triển</div>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-gray-300 cursor-not-allowed opacity-40">
          <input
            type="radio"
            name="paymentMethod"
            value="MOMO"
            disabled
            className="w-4 h-4"
          />
          <FaMobileAlt className="text-xl text-gray-400" />
          <div>
            <div className="font-normal text-gray-900">MoMo</div>
            <div className="text-sm text-gray-600 mt-0.5">Đang phát triển</div>
          </div>
        </label>
      </div>
    </div>
  );
};


export default PaymentMethodSelector;