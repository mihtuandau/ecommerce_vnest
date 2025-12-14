import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaClock, FaArrowLeft, FaStar } from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Layout from '../../../components/layouts/Layout';
import orderService from '../../../services/orderService';
import reviewService from '../../../services/reviewService';
import { formatPrice, formatDateTime } from '../../../utils/formatters';
import ReviewForm from '../../../components/products/ReviewForm';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      checkReviewedProducts();
    }
  }, [orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      console.log('📦 Response from getMyOrders:', response);
      
      // apiService.get() returns response.data directly
      // Backend returns {orders: [...], total, page, limit, totalPages}
      const ordersList = response?.orders || response?.data?.orders || [];
      
      console.log('📦 Orders list:', ordersList);
      
      // Transform orderItems to items for consistency
      const transformedOrders = (Array.isArray(ordersList) ? ordersList : []).map(order => ({
        ...order,
        items: order.orderItems || []
      }));
      
      console.log('✅ Transformed orders:', transformedOrders);
      setOrders(transformedOrders);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      notify.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const checkReviewedProducts = async () => {
    const reviewed = new Set();
    for (const order of orders) {
      // Allow review if order is DELIVERED or payment is successful
      const canReviewOrder = order.status === 'DELIVERED' || order.payment?.status === 'SUCCESS';
      
      if (canReviewOrder && order.items) {
        console.log('🔍 Checking review status for order:', { orderId: order.id, status: order.status, paymentStatus: order.payment?.status });
        
        for (const item of order.items) {
          const productId = item.variant?.product?.id || item.variant?.productId;
          if (productId) {
            try {
              const response = await reviewService.canUserReview(productId);
              const canReview = response.data?.canReview || response.canReview;
              console.log('🔍 Can review product:', productId, '?', canReview);
              if (!canReview) {
                reviewed.add(productId);
              }
            } catch (error) {
              console.error('Error checking review:', error);
            }
          }
        }
      }
    }
    console.log('📝 Reviewed products:', Array.from(reviewed));
    setReviewedProducts(reviewed);
  };

  const handleOpenReviewModal = (item) => {
    const productId = item.variant?.product?.id || item.variant?.productId;
    const productName = item.variant?.product?.name;
    setSelectedProduct({ id: productId, name: productName });
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    notify.success('Đánh giá thành công!');
    setReviewedProducts(prev => new Set([...prev, selectedProduct.id]));
    setSelectedProduct(null);
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
                          const productId = item.variant?.product?.id || item.variant?.productId;
                          const isReviewed = reviewedProducts.has(productId);
                          // Show review button if: order is DELIVERED or payment is successful, and not reviewed
                          const canShowReviewButton = (order.status === 'DELIVERED' || order.payment?.status === 'SUCCESS') && !isReviewed;
                          
                          return (
                            <div key={idx} className="flex gap-3 items-start">
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
                              {canShowReviewButton && (
                                <button
                                  onClick={() => handleOpenReviewModal(item)}
                                  className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                  <FaStar size={12} />
                                  Đánh giá
                                </button>
                              )}
                              {isReviewed && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1.5 rounded whitespace-nowrap">
                                  Đã đánh giá
                                </span>
                              )}
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

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Đánh giá sản phẩm: {selectedProduct.name}
              </h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ReviewForm
                productId={selectedProduct.id}
                onSuccess={handleReviewSuccess}
                onCancel={() => {
                  setShowReviewModal(false);
                  setSelectedProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrdersPage;
