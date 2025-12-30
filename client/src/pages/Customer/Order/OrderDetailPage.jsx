import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaBox } from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import orderService from '../../../services/orderService';
import { formatDateTime } from '../../../utils/formatters';
import {
  OrderStatusBadge,
  OrderShippingInfo,
  OrderItemsList,
  OrderPriceSummary
} from '../../../components/order';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderDetail();
    }
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

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      await orderService.cancelOrder(id);
      notify.success('Đã hủy đơn hàng thành công!');
      loadOrderDetail();
    } catch (error) {
      console.error('Cancel order error:', error);
      notify.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
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
        <div className="min-h-screen bg-gray-50 pt-21 pb-8">
          <div className="container mx-auto px-4 lg:px-30">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Không tìm thấy đơn hàng
              </h3>
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-[#00a85a] hover:bg-[#008f4d] text-white rounded-lg transition-colors"
              >
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Đơn hàng của tôi', path: '/orders' },
            { label: 'Chi tiết đơn hàng' }
          ]} />

          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">
                    Đơn hàng {order.orderCode || `#${order.id}`}
                  </h1>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock size={14} />
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Shipping & Payment Info */}
            <OrderShippingInfo order={order} />

            {/* Order Items */}
            <OrderItemsList items={order.items} />

            {/* Price Summary */}
            <OrderPriceSummary order={order} />

            {/* Action Button */}
            {(order.status === 'PENDING' || order.status === 'AWAITING_PAYMENT') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <button
                  onClick={handleCancelOrder}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;