import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaClock, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import Layout from '../../../components/layouts/Layout';
import orderService from '../../../services/orderService';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      // Backend returns {orders: [...], total, page, ...}
      const ordersList = response.data?.orders || response.data || [];
      
      // Transform orderItems to items for consistency
      const transformedOrders = (Array.isArray(ordersList) ? ordersList : []).map(order => ({
        ...order,
        items: order.orderItems || []
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải đơn hàng..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-gray-900 transition-colors">Trang chủ</a>
            <span>›</span>
            <span className="text-gray-900 font-medium">Đơn hàng của tôi</span>
          </nav>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          </div>

          {/* Orders List */}
          {safeOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaBox size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {safeOrders.map((order) => {
                const getStatusBadge = (status) => {
                  const statusConfig = {
                    PENDING: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
                    PROCESSING: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
                    SHIPPED: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
                    DELIVERED: { label: 'Đã giao', className: 'bg-green-100 text-green-800' },
                    CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
                  };
                  return statusConfig[status] || statusConfig.PENDING;
                };

                const statusBadge = getStatusBadge(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-900">
                          Đơn hàng {order.orderCode || `#${order.id}`}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock size={14} />
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="px-6 py-4">
                      <div className="space-y-3 mb-4">
                        {order.items?.slice(0, 2).map((item, idx) => {
                          const imageUrl = item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url || '/placeholder-product.jpg';
                          return (
                            <div key={idx} className="flex gap-3">
                              <img
                                src={imageUrl}
                                alt={item.variant?.product?.name}
                                className="w-16 h-16 object-cover rounded border border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {item.variant?.product?.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                  {item.variant?.size && <span>Size: {item.variant.size}</span>}
                                  {item.variant?.color && <span>• {item.variant.color}</span>}
                                  <span>• x{item.quantity}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        
                        {order.items?.length > 2 && (
                          <p className="text-sm text-gray-600 text-center py-2">
                            và {order.items.length - 2} sản phẩm khác...
                          </p>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-600">Tổng tiền: </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
