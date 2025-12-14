import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      // PayOS trả về các params: code, id, cancel, status, orderCode
      const code = searchParams.get('code');
      const id = searchParams.get('id');
      const cancel = searchParams.get('cancel');
      const statusParam = searchParams.get('status');
      const orderCode = searchParams.get('orderCode');

      console.log('PayOS Return Params:', { code, id, cancel, statusParam, orderCode });

      // Lấy orderCode từ id hoặc orderCode param
      const payosOrderCode = orderCode || id;

      if (!payosOrderCode) {
        console.error('No orderCode found in URL params');
        setStatus('error');
        return;
      }

      // Nếu user cancel
      if (cancel === 'true' || statusParam === 'CANCELLED') {
        setStatus('cancelled');
        return;
      }

      // Lấy thông tin payment và order
      console.log('Checking payment status for orderCode:', payosOrderCode);
      const [payosData, paymentData] = await Promise.all([
        paymentService.getPayOSPaymentInfo(payosOrderCode),
        paymentService.getPaymentWithOrder(payosOrderCode)
      ]);
      
      console.log('PayOS Data:', payosData);
      console.log('Payment Data:', paymentData);
      
      setPaymentInfo(payosData);
      setOrderInfo(paymentData);

      // Update payment status in database if PayOS says PAID
      if (payosData.status === 'PAID' && paymentData?.status !== 'SUCCESS') {
        console.log('🔄 Updating payment status to SUCCESS for payment ID:', paymentData.id);
        try {
          await paymentService.updatePaymentStatus(paymentData.id, 'SUCCESS');
          console.log('✅ Payment status updated successfully');
          // Reload payment data to reflect update
          const updatedPayment = await paymentService.getPaymentWithOrder(payosOrderCode);
          setOrderInfo(updatedPayment);
        } catch (updateError) {
          console.error('❌ Failed to update payment status:', updateError);
        }
      }

      if (payosData.status === 'PAID') {
        setStatus('success');
        notify.success('Thanh toán thành công!');
      } else if (payosData.status === 'CANCELLED') {
        setStatus('cancelled');
      } else if (payosData.status === 'EXPIRED') {
        setStatus('expired');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      setStatus('error');
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/orders');
    } else {
      navigate('/cart');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FaSpinner className="text-6xl text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang kiểm tra thanh toán...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Success Icon & Message */}
          <div className="text-center mb-6">
            <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán thành công! 🎉
            </h2>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
          </div>

          {/* Order & Payment Info */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">✓</span>
              Thông tin đơn hàng
            </h3>
            
            <div className="space-y-3">
              {orderInfo?.order && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    #{orderInfo.order.orderCode || orderInfo.order.id}
                  </span>
                </div>
              )}
              
              {paymentInfo && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Mã giao dịch PayOS:</span>
                    <span className="font-mono text-sm font-semibold">
                      #{paymentInfo.orderCode}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Số tiền thanh toán:</span>
                    <span className="font-bold text-green-600 text-xl">
                      {paymentInfo.amount?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-semibold">PayOS (Chuyển khoản QR)</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  ✓ Đã thanh toán
                </span>
              </div>

              {orderInfo?.order && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Trạng thái đơn hàng:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {orderInfo.order.status === 'PENDING' ? '⏳ Đang xử lý' : orderInfo.order.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notification Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>📧 Email xác nhận</strong> đã được gửi đến địa chỉ email của bạn.
              <br />
              <strong>📦 Đơn hàng</strong> sẽ được giao trong 2-3 ngày làm việc.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/orders/${orderInfo?.order?.id || ''}`)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
            >
              <span className="mr-2">📋</span>
              Xem chi tiết đơn hàng
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Danh sách đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FaTimesCircle className="text-6xl text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán đã bị hủy</h2>
          <p className="text-gray-600 mb-6">
            Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được giữ lại.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link thanh toán đã hết hạn</h2>
          <p className="text-gray-600 mb-6">
            Link thanh toán đã hết hạn. Vui lòng đặt hàng lại.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Đặt hàng lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error or pending
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-6xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'pending' ? 'Đang xử lý thanh toán' : 'Có lỗi xảy ra'}
        </h2>
        <p className="text-gray-600 mb-6">
          {status === 'pending' 
            ? 'Thanh toán đang được xử lý. Vui lòng kiểm tra lại sau.'
            : 'Không thể xác nhận trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.'}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={checkPaymentStatus}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Kiểm tra lại
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
