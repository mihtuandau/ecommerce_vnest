import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import orderService from '../../../services/orderService';
import reviewService from '../../../services/reviewService';
import {
  OrderStatusFilter,
  OrderCard,
  EmptyOrder,
  ReviewModal
} from '../../../components/order';

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set()); // Lưu "productId-orderId"
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
    
    // Auto-refresh nếu có payment success parameter
    const urlParams = new URLSearchParams(location.search);
    const paymentSuccess = urlParams.get('paymentSuccess');
    const refreshOrders = urlParams.get('refresh');
    
    // Check localStorage for payment success flag
    const paymentCompleted = localStorage.getItem('paymentCompleted');
    
    if (paymentSuccess === 'true' || refreshOrders === 'true' || paymentCompleted === 'true') {
      console.log('🔄 Auto-refreshing orders after payment success');
      setIsAutoRefreshing(true);
      
      // Refresh sau 3 giây để đảm bảo webhook đã processed (không hiển thị notification)
      setTimeout(() => {
        loadOrders();
        setIsAutoRefreshing(false);
      }, 3000);
      
      // Clean flags
      localStorage.removeItem('paymentCompleted');
      if (urlParams.has('paymentSuccess') || urlParams.has('refresh')) {
        navigate('/orders', { replace: true });
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (orders.length > 0) {
      checkReviewedProducts();
    }
  }, [orders]);

  // Auto-refresh every 30 seconds while on this page
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing orders...');
      loadOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

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
    console.log('🔄 Starting checkReviewedProducts, total orders:', orders.length);
    
    for (const order of orders) {
      // Only allow review if order is DELIVERED AND payment is successful
      const canReviewOrder = order.status === 'DELIVERED' && order.payment?.status === 'SUCCESS';
      
      console.log('📦 Order:', {
        id: order.id,
        code: order.orderCode,
        status: order.status,
        paymentStatus: order.payment?.status,
        canReviewOrder
      });
      
      if (canReviewOrder && order.items) {
        for (const item of order.items) {
          const productId = item.variant?.product?.id || item.variant?.productId;
          const productName = item.variant?.product?.name;
          
          if (productId) {
            try {
              console.log('🔍 Checking product:', { orderId: order.id, productId, productName });
              const response = await reviewService.canUserReview(productId, order.id);
              const result = response.data || response;
              
              console.log('📊 API Response:', {
                orderId: order.id,
                productId,
                productName,
                canReview: result.canReview,
                hasReviewed: result.hasReviewed,
                hasPurchased: result.hasPurchased,
                reason: result.reason
              });
              
              // Only add to reviewed if user has actually reviewed (not just can't review)
              if (result.hasReviewed === true) {
                const reviewKey = `${productId}-${order.id}`;
                console.log('✅ Adding to reviewed:', reviewKey, productName);
                reviewed.add(reviewKey);
                console.log('✅ Current reviewed Set:', Array.from(reviewed));
              } else {
                console.log('❌ NOT adding to reviewed:', productId, productName, 'hasReviewed =', result.hasReviewed);
              }
            } catch (error) {
              console.error('❌ Error checking review:', error);
            }
          }
        }
      }
    }
    console.log('📝 Final reviewed products:', Array.from(reviewed));
    setReviewedProducts(reviewed);
  };

  const handleOpenReviewModal = (item, orderId) => {
    const productId = item.variant?.product?.id || item.variant?.productId;
    const productName = item.variant?.product?.name;
    setSelectedProduct({ id: productId, name: productName, orderId });
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    notify.success('Đánh giá thành công!');
    const reviewKey = `${selectedProduct.id}-${selectedProduct.orderId}`;
    setReviewedProducts(prev => new Set([...prev, reviewKey]));
    setSelectedProduct(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      await orderService.cancelOrder(orderId);
      notify.success('Hủy đơn hàng thành công!');
      // Refresh orders list
      loadOrders();
    } catch (error) {
      console.error('Cancel order error:', error);
      notify.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  // Filter orders based on status
  const filteredOrders = statusFilter === 'ALL' 
    ? safeOrders 
    : safeOrders.filter(order => order.status === statusFilter);
  
  // Count orders by status
  const statusCounts = {
    ALL: safeOrders.length,
    PENDING: safeOrders.filter(o => o.status === 'PENDING').length,
    PROCESSING: safeOrders.filter(o => o.status === 'PROCESSING').length,
    SHIPPED: safeOrders.filter(o => o.status === 'SHIPPED').length,
    DELIVERED: safeOrders.filter(o => o.status === 'DELIVERED').length,
    CANCELLED: safeOrders.filter(o => o.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải đơn hàng..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Đơn hàng của tôi' }
          ]} />

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi đơn hàng của bạn</p>
            </div>
            <button
              onClick={() => {
                loadOrders();
                notify.success('Đã làm mới danh sách đơn hàng');
              }}
              className="px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </button>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <OrderStatusFilter
              activeStatus={statusFilter}
              onStatusChange={setStatusFilter}
              statusCounts={statusCounts}
            />
          </div>

          {/* Orders List */}
          {safeOrders.length === 0 ? (
            <EmptyOrder type="no-orders" />
          ) : filteredOrders.length === 0 ? (
            <EmptyOrder 
              type="no-filter-results" 
              onResetFilter={() => setStatusFilter('ALL')}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  reviewedProducts={reviewedProducts}
                  onReviewClick={handleOpenReviewModal}
                  onCancelClick={handleCancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        show={showReviewModal}
        product={selectedProduct}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleReviewSuccess}
      />
    </Layout>
  );
};

export default OrdersPage;