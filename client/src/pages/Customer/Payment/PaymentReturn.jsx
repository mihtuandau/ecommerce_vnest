import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaClock } from 'react-icons/fa';
import paymentService from '../../../services/paymentService';

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
      const code = searchParams.get('code');
      const id = searchParams.get('id');
      const cancel = searchParams.get('cancel');
      const statusParam = searchParams.get('status');
      const orderCode = searchParams.get('orderCode');

      const payosOrderCode = orderCode || id;

      console.log('🔍 PaymentReturn params:', { code, id, cancel, statusParam, orderCode, payosOrderCode });

      if (!payosOrderCode) {
        console.error('❌ No PayOS order code found');
        setStatus('error');
        return;
      }

      if (cancel === 'true' || statusParam === 'CANCELLED') {
        console.log('❌ Payment cancelled');
        setStatus('cancelled');
        return;
      }

      // Call API to verify payment and get order details (public endpoint, no auth needed)
      console.log('📡 Calling public API to verify payment with orderCode:', payosOrderCode);
      try {
        const response = await paymentService.verifyPaymentReturn(payosOrderCode);
        console.log('✅ Payment verification response:', response);

        if (response.data) {
          const { payment, order } = response.data;
          
          setPaymentInfo({
            id: payment?.id,
            orderCode: payment?.payosOrderCode,
            amount: payment?.amount || order?.total,
            status: payment?.status || 'PENDING',
            method: payment?.method,
            createdAt: payment?.createdAt,
          });
          
          setOrderInfo({
            order: {
              id: order?.id,
              orderCode: order?.orderCode,
              status: order?.status,
              total: order?.total,
              shippingInfo: order?.shippingInfo,
            }
          });

          // Check if payment is successful
          if (payment?.status === 'PAID' || statusParam === 'PAID') {
            setStatus('success');
          } else if (payment?.status === 'PENDING' || !statusParam) {
            setStatus('pending');
          } else {
            setStatus('failed');
          }
        } else {
          console.error('❌ No data in response');
          setStatus('error');
        }
      } catch (apiError) {
        console.error('❌ API Error checking payment:', apiError);
        // If API fails, check URL status parameter
        if (statusParam === 'PAID') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    } catch (error) {
      console.error('❌ Error in checkPaymentStatus:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <FaSpinner className="text-5xl text-gray-800 animate-spin" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Đang xác nhận thanh toán</h2>
          <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
              <FaCheckCircle className="text-6xl text-gray-900 relative" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-3">Thanh toán thành công</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Cảm ơn bạn. Đơn hàng đang được xử lý và sẽ được giao trong 2-3 ngày làm việc.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                <span className="text-sm font-medium text-gray-600">Mã đơn hàng</span>
                <span className="text-right">
                  <p className="font-semibold text-gray-900">#{orderInfo?.order?.orderCode}</p>
                  <p className="text-xs text-gray-500 mt-1">{orderInfo?.order?.id}</p>
                </span>
              </div>

              <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                <span className="text-sm font-medium text-gray-600">Số tiền</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {paymentInfo?.amount?.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                <span className="text-sm font-medium text-gray-600">Phương thức</span>
                <span className="text-gray-900 font-medium">PayOS - QR Transfer</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Trạng thái</span>
                <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg">
                  <FaCheckCircle className="text-sm" />
                  <span className="text-sm font-medium">Đã thanh toán</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-gray-100 border-l-4 border-gray-800 p-4 mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">Email xác nhận</span> đã được gửi đến địa chỉ email của bạn.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/orders/${orderInfo?.order?.id || ''}`)}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium transition-all hover:bg-black active:scale-95"
            >
              Xem chi tiết đơn hàng
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium transition-all hover:bg-gray-800 active:scale-95"
            >
              Danh sách đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-all hover:bg-gray-300 active:scale-95"
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
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
              <FaTimesCircle className="text-6xl text-gray-600 relative" />
            </div>
          </div>

          <h1 className="text-4xl font-light text-gray-900 mb-3">Thanh toán đã bị hủy</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Bạn đã hủy giao dịch. Đơn hàng vẫn được giữ lại trong giỏ của bạn.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium transition-all hover:bg-black active:scale-95"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium transition-all hover:bg-gray-800 active:scale-95"
            >
              Thử lại thanh toán
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-all hover:bg-gray-300 active:scale-95"
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
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
              <FaClock className="text-6xl text-gray-600 relative" />
            </div>
          </div>

          <h1 className="text-4xl font-light text-gray-900 mb-3">Link thanh toán hết hạn</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thời hạn thanh toán đã kết thúc. Vui lòng đặt hàng lại để tiếp tục.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium transition-all hover:bg-black active:scale-95"
            >
              Đặt hàng lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-all hover:bg-gray-300 active:scale-95"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending status
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
              <FaClock className="text-6xl text-gray-600 relative animate-pulse" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-3">Đang xử lý thanh toán</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Giao dịch đang được xử lý. Vui lòng kiểm tra lại sau vài phút.
            </p>
          </div>

          {orderInfo?.order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                  <span className="text-sm font-medium text-gray-600">Mã đơn hàng</span>
                  <span className="text-right">
                    <p className="font-semibold text-gray-900">#{orderInfo?.order?.orderCode}</p>
                    <p className="text-xs text-gray-500 mt-1">{orderInfo?.order?.id}</p>
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                  <span className="text-sm font-medium text-gray-600">Số tiền</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    {paymentInfo?.amount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Trạng thái</span>
                  <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200">
                    <FaClock className="text-sm" />
                    <span className="text-sm font-medium">Đang chờ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={checkPaymentStatus}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium transition-all hover:bg-black active:scale-95"
            >
              Kiểm tra lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-all hover:bg-gray-300 active:scale-95"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed or error status
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
            <FaTimesCircle className="text-6xl text-red-500 relative" />
          </div>
        </div>

        <h1 className="text-4xl font-light text-gray-900 mb-3">
          {status === 'failed' ? 'Thanh toán thất bại' : 'Có lỗi xảy ra'}
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {status === 'failed' 
            ? 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
            : 'Không thể xác nhận trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium transition-all hover:bg-black active:scale-95"
          >
            Thử lại thanh toán
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-all hover:bg-gray-300 active:scale-95"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;