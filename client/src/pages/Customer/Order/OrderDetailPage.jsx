import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaClock, FaBox, FaTruck, FaCheckCircle, FaTimesCircle,
  FaMapMarkerAlt, FaCreditCard, FaPhone, FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
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
      const orderData = response.data;
      
      // Transform backend response to match frontend structure
      const transformedOrder = {
        ...orderData,
        items: orderData.orderItems || [], // Map orderItems to items
        paymentMethod: orderData.paymentMethod || 'CASH'
      };
      
      setOrder(transformedOrder);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Không thể tải thông tin đơn hàng');
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
    return <Loading fullScreen text="Đang tải đơn hàng..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox size={60} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <Button onClick={() => navigate('/orders')}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Quay lại danh sách đơn hàng
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Đơn hàng #{order.id}
              </h1>
              <p className="text-gray-600">
                Đặt lúc {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.color}`}>
              <StatusIcon size={18} />
              <span className="font-semibold">{statusConfig.text}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h2>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10" />
              
              {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, idx) => {
                const config = getStatusConfig(status);
                const Icon = config.icon;
                const isActive = order.status === status;
                const isPassed = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) >= idx;
                
                return (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-xs mt-2 ${isPassed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {config.text}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              {statusConfig.description}
            </p>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Thông tin giao hàng</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaUser className="text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Người nhận</div>
                  <div className="font-medium text-gray-900">
                    {order.shippingInfo?.fullName || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium text-gray-900">
                    {order.shippingInfo?.phone || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Địa chỉ</div>
                  <div className="font-medium text-gray-900">
                    {order.shippingAddress || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>

              {order.shippingInfo?.note && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-500 mb-1">Ghi chú</div>
                  <div className="text-gray-900">{order.shippingInfo.note}</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaCreditCard className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h2>
            </div>
            <div className="font-medium text-gray-900">
              {getPaymentMethodText(order.paymentMethod)}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sản phẩm ({order.items?.length || 0})
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const imageUrl = item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url || '/placeholder-product.jpg';
                return (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.variant?.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.variant?.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.variant?.size && `Size: ${item.variant.size}`}
                      {item.variant?.size && item.variant?.color && ' • '}
                      {item.variant?.color && `Màu: ${item.variant.color}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">x{item.quantity}</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng cộng</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{formatPrice(order.total - (order.shippingFee || 0))}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium">
                  {order.shippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatPrice(order.shippingFee || 0)
                  )}
                </span>
              </div>

              {order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT</span>
                  <span className="font-medium">{formatPrice(order.taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {order.status === 'PENDING' && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                    // TODO: Call cancel order API
                    toast.success('Đã hủy đơn hàng');
                    navigate('/orders');
                  }
                }}
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                Hủy đơn hàng
              </Button>
            </div>
          )}

          {order.status === 'DELIVERED' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
              <p className="text-green-800 font-medium mb-1">Đơn hàng đã được giao thành công!</p>
              <p className="text-sm text-green-600">Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
