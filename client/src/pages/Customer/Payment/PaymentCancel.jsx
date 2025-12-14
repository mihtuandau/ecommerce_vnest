import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán đã bị hủy</h2>
        <p className="text-gray-600 mb-6">
          Bạn đã hủy giao dịch thanh toán. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Quay lại giỏ hàng
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Thử lại thanh toán
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
