import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import orderService from '../../../services/orderService';
import { formatDateTime, formatPrice } from '../../../utils/formatters';
import {
  OrderStatusBadge,
  OrderShippingInfo,
  OrderItemsList,
  OrderPriceSummary,
} from '../../../components/order';
import { useUpdateOrderStatus, useCancelOrder } from '../../../hooks/useOrders';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const updateOrderMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrderById(id);
      if (!response) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      setOrder({
        ...response,
        items: response.orderItems || [],
        paymentMethod: response.paymentMethod || response.payment?.method || 'CASH',
        paymentStatus: response.paymentStatus || response.payment?.status || 'PENDING',
      });
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
      navigate('/admin-orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  if (loading) {
    return <Loading fullScreen text="Đang tải chi tiết đơn hàng..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => navigate('/admin-orders')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  const nextStatus = {
    PENDING: 'PROCESSING',
    AWAITING_PAYMENT: 'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED: 'DELIVERED',
  };

  const nextButtonLabel = {
    PENDING: 'Xác nhận đơn',
    AWAITING_PAYMENT: 'Xác nhận đơn',
    PROCESSING: 'Giao hàng',
    SHIPPED: 'Hoàn tất',
  };

  const steps = [
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'PROCESSING', label: 'Đang xử lý' },
    { key: 'SHIPPED', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao hàng' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  const getStepIndex = () => {
    const indexMap = {
      PENDING: 0,
      AWAITING_PAYMENT: 0,
      PROCESSING: 1,
      SHIPPED: 2,
      DELIVERED: 3,
      CANCELLED: 4,
    };
    return indexMap[order.status] ?? 0;
  };

  const handleUpdateStatus = () => {
    const next = nextStatus[order.status];
    if (!next) return;
    updateOrderMutation.mutate(
      { orderId: id, status: next },
      {
        onSuccess: () => {
          loadOrder();
        },
      }
    );
  };

  const handleCancelOrder = () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    cancelOrderMutation.mutate(id, {
      onSuccess: () => {
        loadOrder();
      },
    });
  };

  const currency = formatPrice(order.total);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <Breadcrumb
          items={[
            { label: 'Đơn hàng', path: '/admin-orders' },
            { label: `Đơn hàng ${order.orderCode || `#${order.id}`}` },
          ]}
        />

        <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin-orders')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition hover:border-gray-300 hover:text-gray-800"
              aria-label="Quay lại"
            >
              ←
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-800">
                  {order.orderCode || `#${order.id}`}
                </h1>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <FaClock />
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="ml-auto flex flex-wrap gap-3">
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <button
                  onClick={handleUpdateStatus}
                  disabled={updateOrderMutation.isLoading || cancelOrderMutation.isLoading}
                  className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {nextButtonLabel[order.status] || 'Cập nhật trạng thái'}
                </button>
              )}
              {order.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={updateOrderMutation.isLoading || cancelOrderMutation.isLoading}
                  className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Tiến trình đơn hàng</h2>
          </div>
          <div className="px-5 py-7">
            <div className={`grid grid-cols-5 gap-4`}>
              {steps.map((step, index) => {
                const activeIndex = getStepIndex();
                const completed = index <= activeIndex;
                const active = index === activeIndex;
                const isCancelled = steps[index].key === 'CANCELLED';
                const isStepActive = order.status === steps[index].key;
                
                let bgColor = completed ? 'bg-emerald-500' : 'bg-gray-100';
                let textColor = completed ? 'text-white' : 'text-slate-400';
                let labelColor = completed ? 'text-emerald-600' : 'text-slate-500';
                let ringColor = active ? 'ring-4 ring-emerald-100' : '';
                let lineColor = completed ? 'bg-emerald-500' : 'bg-gray-200';

                if (isCancelled && isStepActive) {
                  bgColor = 'bg-red-500';
                  textColor = 'text-white';
                  labelColor = 'text-red-600';
                  ringColor = 'ring-4 ring-red-100';
                }

                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {index < steps.length - 1 && (
                      <div className={`absolute left-1/2 top-5 h-0.5 w-full ${lineColor}`} />
                    )}
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold ${bgColor} ${textColor} ${ringColor}`}>
                      {completed && !isCancelled ? '✓' : index + 1}
                    </div>
                    <div className={`mt-2 text-xs font-semibold ${labelColor}`}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-4">
            <OrderItemsList items={order.items} />
            <OrderPriceSummary order={order} />
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-800">Khách hàng</h2>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm text-slate-600">
                <div className="text-base font-semibold text-slate-800">
                  {order.shippingSnapshot?.fullName || order.user?.name || 'Khách vãng lai'}
                </div>
                <div className="text-slate-500">
                  {order.shippingSnapshot?.email || order.user?.email || order.guestEmail || 'N/A'}
                </div>
              </div>
            </div>

            <OrderShippingInfo order={order} />

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <button
                onClick={() => navigate('/admin-orders')}
                className="w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;






