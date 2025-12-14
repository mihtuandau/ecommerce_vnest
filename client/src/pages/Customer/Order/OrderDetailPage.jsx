import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaClock, FaBox, FaTruck, FaCheckCircle, FaTimesCircle,
  FaMapMarkerAlt, FaCreditCard, FaPhone, FaUser
} from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Layout from '../../../components/layouts/Layout';
import orderService from '../../../services/orderService';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      console.log('📦 Order detail response:', response);
      
      // apiService.get() returns response.data directly
      const orderData = response || {};
      
      console.log('📦 Order data:', orderData);
      
      // Transform backend response to match frontend structure
      const transformedOrder = {
        ...orderData,
        items: orderData.orderItems || [], // Map orderItems to items
        paymentMethod: orderData.paymentMethod || 'CASH'
      };
      
      console.log('✅ Transformed order:', transformedOrder);
      setOrder(transformedOrder);
    } catch (error) {
      console.error('❌ Error loading order detail:', error);
      notify.error('Không thể tải thông tin đơn hàng');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: FaClock,
        text: 'Chờ xác nhận',
        color: 'text-amber-600 bg-amber-50',
        description: 'Đơn hàng đang chờ người bán xác nhận'
      },
      PROCESSING: {
        icon: FaBox,
        text: 'Đang xử lý',
        color: 'text-blue-600 bg-blue-50',
        description: 'Đơn hàng đang được chuẩn bị'
      },
      SHIPPED: {
        icon: FaTruck,
        text: 'Đang giao',
        color: 'text-purple-600 bg-purple-50',
        description: 'Đơn hàng đang trên đường giao đến bạn'
      },
      DELIVERED: {
        icon: FaCheckCircle,
        text: 'Đã giao',
        color: 'text-green-600 bg-green-50',
        description: 'Đơn hàng đã được giao thành công'
      },
      CANCELLED: {
        icon: FaTimesCircle,
        text: 'Đã hủy',
        color: 'text-red-600 bg-red-50',
        description: 'Đơn hàng đã bị hủy'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Thanh toán khi nhận hàng (COD)',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
      CARD: 'Thẻ tín dụng/ghi nợ'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải đơn hàng..." />
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
          <div className="text-center">
            <FaBox size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Không tìm thấy đơn hàng
            </h3>
            <button
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const getStatusBadge = (status) => {
    const statusBadge = {
      PENDING: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
      PROCESSING: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
      SHIPPED: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
      DELIVERED: { label: 'Đã giao', className: 'bg-green-100 text-green-800' },
      CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    };
    return statusBadge[status] || statusBadge.PENDING;
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-gray-900 transition-colors">Trang chủ</a>
            <span>›</span>
            <a href="/orders" className="hover:text-gray-900 transition-colors">Đơn hàng của tôi</a>
            <span>›</span>
            <span className="text-gray-900 font-medium">Chi tiết đơn hàng</span>
          </nav>

          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Đơn hàng {order.orderCode || `#${order.id}`}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock size={14} />
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">

            {/* Shipping & Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-600 w-32">Người nhận:</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingInfo?.fullName || 'Chưa cập nhật'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-gray-600 w-32">Số điện thoại:</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingInfo?.phone || 'Chưa cập nhật'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-gray-600 w-32">Địa chỉ:</span>
                  <span className="font-medium text-gray-900 flex-1">
                    {order.shippingAddress || 'Chưa cập nhật'}
                  </span>
                </div>

                {order.shippingInfo?.note && (
                  <div className="flex gap-2 pt-2 border-t">
                    <span className="text-gray-600 w-32">Ghi chú:</span>
                    <span className="text-gray-900 flex-1">{order.shippingInfo.note}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <span className="text-gray-600 w-32">Thanh toán:</span>
                  <span className="font-medium text-gray-900">
                    {getPaymentMethodText(order.paymentMethod)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Chi tiết sản phẩm
              </h2>
              
              <div className="space-y-3">
                {order.items?.map((item, idx) => {
                  const imageUrl = item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url || '/placeholder-product.jpg';
                  return (
                    <div key={idx} className="flex gap-3 pb-3 border-b last:border-0">
                      <img
                        src={imageUrl}
                        alt={item.variant?.product?.name}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {item.variant?.product?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          {item.variant?.size && <span>Size: {item.variant.size}</span>}
                          {item.variant?.color && <span>• {item.variant.color}</span>}
                          <span>• x{item.quantity}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng thanh toán</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(order.total - (order.shippingFee || 0))}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {order.shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(order.shippingFee || 0)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {order.status === 'PENDING' && (
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                    notify.success('Đã hủy đơn hàng');
                    navigate('/orders');
                  }
                }}
                className="w-full px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;
