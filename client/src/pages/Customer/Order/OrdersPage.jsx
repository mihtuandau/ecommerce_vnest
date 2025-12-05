import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
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
    return <Loading fullScreen text="Đang tải đơn hàng..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl">
              <FaBox className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Đơn hàng của tôi
              </h1>
              <p className="text-gray-600 text-sm mt-1 font-medium">Quản lý và theo dõi đơn hàng của bạn</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {safeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center border border-gray-200">
            <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaBox size={64} className="text-gray-900" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">
              Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg"
            >
              <span className="flex items-center gap-3">
                <FaBox size={22} />
                Khám phá ngay
              </span>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {safeOrders.map((order) => {
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-gray-200 hover:border-gray-300 group"
                >
                  {/* Order Header */}
                  <div className="p-6 bg-gray-50 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đơn hàng</span>
                      <span className="font-extrabold text-gray-900 text-xl">
                        #{order.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                        <FaClock size={14} className="text-gray-900" />
                      </div>
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-5">
                      {order.items?.slice(0, 2).map((item, idx) => {
                        const imageUrl = item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url || '/placeholder-product.jpg';
                        return (
                        <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:shadow-md transition-all border border-gray-200">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden shadow-sm border border-gray-200">
                            <img
                              src={imageUrl}
                              alt={item.variant?.product?.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                              {item.variant?.product?.name}
                            </h3>
                            <div className="flex gap-2 mb-2">
                              {item.variant?.size && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-md">
                                  Size: {item.variant.size}
                                </span>
                              )}
                              {item.variant?.color && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-md">
                                  {item.variant.color}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md">
                                x{item.quantity}
                              </span>
                              <span className="text-base font-extrabold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                      })}
                      
                      {order.items?.length > 2 && (
                        <div className="text-sm font-semibold text-gray-600 text-center py-3 bg-gray-50 rounded-xl border border-gray-200">
                          và {order.items.length - 2} sản phẩm khác...
                        </div>
                      )}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between pt-5 mt-3 border-t border-gray-200">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tổng thanh toán</span>
                        <span className="text-3xl font-black text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        {order.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                                // TODO: Call cancel order API
                                toast.success('Đã hủy đơn hàng');
                                loadOrders();
                              }
                            }}
                            className="text-red-600 border-2 border-red-300 hover:bg-red-50 hover:border-red-500 transition-all rounded-xl px-5 py-2.5 font-bold shadow-md"
                          >
                            Hủy đơn
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-xl px-6 py-2.5 font-bold"
                        >
                          <FaEye size={16} />
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
