import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaBox, FaCheckCircle } from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Layout from '../../../components/layouts/Layout';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import orderService from '../../../services/orderService';

const OrderLookupPage = () => {
  const location = useLocation();
  const [orderCode, setOrderCode] = useState(location.state?.orderCode || '');
  const [contact, setContact] = useState(location.state?.contact || '');
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
    setRecentOrders(guestOrders.reverse()); 
  }, []);

  useEffect(() => {
    if (location.state?.orderCode && location.state?.contact) {
      handleSearchDirect();
    }
  }, []);

  const handleSearchDirect = async () => {
    try {
      setSearching(true);
      const response = await orderService.lookupGuestOrder(
        location.state.orderCode,
        location.state.contact
      );
      console.log('🔍 Guest order lookup response:', response);
      setOrder(response);
      notify.success('Tìm thấy đơn hàng của bạn!');
    } catch (error) {
      console.error('❌ Error looking up guest order:', error);
      notify.error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderCode.trim() || !contact.trim()) {
      notify.error('Vui lòng nhập đầy đủ mã đơn hàng và email/số điện thoại');
      return;
    }

    try {
      setSearching(true);
      const response = await orderService.lookupGuestOrder(orderCode, contact);
      console.log('🔍 Guest order lookup response:', response);
      // apiService.get() returns response.data directly
      setOrder(response);
      notify.success('Tìm thấy đơn hàng!');
    } catch (error) {
      console.error('❌ Error looking up guest order:', error);
      notify.error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
      setOrder(null);
    } finally {
      setSearching(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      PROCESSING: { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
      SHIPPED: { text: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      DELIVERED: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      CANCELLED: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaSearch className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tra cứu đơn hàng</h1>
            <p className="text-gray-600">
              Nhập mã đơn hàng và email/số điện thoại để tra cứu
            </p>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && !order && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h2>
              <div className="space-y-2">
                {recentOrders.map((recentOrder, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setOrderCode(recentOrder.orderCode);
                      setContact(recentOrder.contact);
                    }}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{recentOrder.orderCode}</p>
                        <p className="text-sm text-gray-500">{recentOrder.contact}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(recentOrder.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đơn hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="Ví dụ: ORD-A1B2C3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email hoặc Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="example@email.com hoặc 0901234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                type="submit"
                disabled={searching}
                className="w-full flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <Loading size="sm" />
                    Đang tìm kiếm...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Tra cứu đơn hàng
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Đơn hàng {order.orderCode}</h2>
                    <p className="text-blue-100 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin giao hàng
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Người nhận:</span>{' '}
                    {order.shippingInfo?.fullName || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{' '}
                    {order.shippingInfo?.phone || order.guestPhone || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {order.guestEmail || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span>{' '}
                    {order.shippingAddress || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sản phẩm đã đặt
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={
                          item.variant?.images?.[0]?.url ||
                          item.variant?.product?.images?.[0]?.url ||
                          '/placeholder.png'
                        }
                        alt={item.variant?.product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.variant?.product?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.variant?.size && `Size: ${item.variant.size}`}
                          {item.variant?.color && ` • Màu: ${item.variant.color}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(order.total - order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế (10%):</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phương thức thanh toán:</span>{' '}
                    {order.paymentMethod === 'CASH' && 'Thanh toán khi nhận hàng'}
                    {order.paymentMethod === 'VNPAY' && 'VNPay'}
                    {order.paymentMethod === 'MOMO' && 'MoMo'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              💡 <strong>Lưu ý:</strong> Mã đơn hàng được gửi qua email sau khi đặt hàng
              thành công
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderLookupPage;
