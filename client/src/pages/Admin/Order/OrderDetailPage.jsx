import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import orderService from '../../../services/orderService';
import { formatDateTime } from '../../../utils/formatters';
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
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => navigate('/admin-orders')}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
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
  ];

  const getStepIndex = () => {
    const indexMap = {
      PENDING: 0,
      AWAITING_PAYMENT: 0,
      PROCESSING: 1,
      SHIPPED: 2,
      DELIVERED: 3,
      CANCELLED: 0,
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

  const currency = new Intl.NumberFormat('vi-VN').format(order.total || 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5">
      <div className="mx-auto w-full max-w-[1440px]">
        <Breadcrumb
          items={[
            { label: 'Đơn hàng', path: '/admin-orders' },
            { label: `Đơn hàng ${order.orderCode || `#${order.id}`}` },
          ]}
        />

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin-orders')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
              aria-label="Quay lại"
            >
              ←
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {order.orderCode || `#${order.id}`}
                </h1>
                <OrderStatusBadge status={order.status} />
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
                  className="rounded-xl bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60"
                >
                  {nextButtonLabel[order.status] || 'Cập nhật trạng thái'}
                </button>
              )}
              {order.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={updateOrderMutation.isLoading || cancelOrderMutation.isLoading}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Tiến trình đơn hàng</h2>
          </div>
          <div className="px-5 py-7">
            <div className="grid grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const activeIndex = getStepIndex();
                const completed = index <= activeIndex;
                const active = index === activeIndex;

                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {index < steps.length - 1 && (
                      <div className={`absolute left-1/2 top-5 h-0.5 w-full ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-base font-bold ${completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'} ${active ? 'ring-4 ring-emerald-100' : ''}`}>
                      {completed ? '✓' : index + 1}
                    </div>
                    <div className={`mt-2 text-xs font-semibold ${completed ? 'text-emerald-600' : 'text-slate-500'}`}>
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
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Khách hàng</h2>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm text-slate-600">
                <div className="text-base font-semibold text-slate-900">
                  {order.shippingSnapshot?.fullName || order.user?.name || 'Khách vãng lai'}
                </div>
                <div className="text-slate-500">
                  {order.shippingSnapshot?.email || order.user?.email || order.guestEmail || 'N/A'}
                </div>
                <button className="text-sm font-semibold text-sky-600 transition hover:text-sky-500">
                  Xem hồ sơ khách hàng →
                </button>
              </div>
            </div>

            <OrderShippingInfo order={order} />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Thanh toán</h2>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Phương thức</span>
                  <span className="font-semibold text-slate-900">{order.payment?.method || order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Trạng thái</span>
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    {order.payment?.status === 'SUCCESS' ? 'Đã thanh toán' : (order.payment?.status || 'N/A')}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-900">Số tiền</span>
                  <span className="font-semibold text-sky-600">{currency} đ</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <button
                onClick={() => navigate('/admin-orders')}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
