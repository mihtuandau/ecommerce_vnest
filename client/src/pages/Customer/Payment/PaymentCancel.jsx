import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';


const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="border-2 border-gray-900 p-16 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 border-2 border-gray-900 flex items-center justify-center">
          <FaTimesCircle className="text-4xl text-gray-900" />
        </div>
        
        <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
          Thanh Toán Đã Bị Hủy
        </h2>
        <p className="text-gray-600 font-light mb-8 leading-relaxed">
          Bạn đã hủy giao dịch thanh toán. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-[#00a85a] text-white px-6 py-3 hover:bg-[#008f4d] transition-colors font-normal text-sm"
          >
            Quay Lại Giỏ Hàng
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-900 transition-colors font-normal text-sm"
          >
            Thử Lại Thanh Toán
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 px-6 py-3 hover:text-gray-900 transition-colors font-light text-sm"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentCancel;