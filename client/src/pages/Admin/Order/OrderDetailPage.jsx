  import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { FaClock, FaPrint, FaTruck, FaBox, FaArrowLeft, FaCreditCard, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
  import { notify } from '../../../utils/notification';
  import Loading from '../../../components/common/Loading';
  import orderService from '../../../services/orderService';
  import { formatDateTime, formatPrice } from '../../../utils/formatters';
  import { OrderStatusBadge } from '../../../components/order';
  import TrackingTimeline from '../../../components/order/TrackingTimeline';
  import { useUpdateOrderStatus, useCancelOrder } from '../../../hooks/useOrders';
  import ghnService from '../../../services/ghnService';

  const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ghnLoading, setGhnLoading] = useState(false);
    const [trackingLogs, setTrackingLogs] = useState([]);
    const [pendingStatus, setPendingStatus] = useState('');

    const updateOrderMutation = useUpdateOrderStatus();
    const cancelOrderMutation = useCancelOrder();

    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        if (!response) throw new Error('Không tìm thấy đơn hàng');
        const orderData = {
          ...response,
          items: response.orderItems || response.items || [],
          paymentMethod: response.paymentMethod || response.payment?.method || 'CASH',
          paymentStatus: response.paymentStatus || response.payment?.status || 'PENDING',
        };
        setOrder(orderData);
        setPendingStatus(orderData.status);
        if (orderData.shippingCode) {
          ghnService.getOrderDetail(orderData.shippingCode)
            .then(res => { if (res?.data?.log) setTrackingLogs(res.data.log); })
            .catch(err => console.error('Lỗi GHN:', err));
        }
      } catch (error) {
        notify.error(error.response?.data?.message || 'Lỗi tải đơn hàng');
        navigate('/admin-orders');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { if (id) loadOrder(); }, [id]);

    const handleSaveStatus = () => {
      updateOrderMutation.mutate({ orderId: id, status: pendingStatus }, {
        onSuccess: () => { notify.success('Đã cập nhật trạng thái'); loadOrder(); },
      });
    };

    const handleCancelOrder = () => {
      if (!window.confirm('Hủy đơn hàng này?')) return;
      cancelOrderMutation.mutate(id, {
        onSuccess: () => { notify.success('Đã hủy đơn'); loadOrder(); },
      });
    };

    const handleSyncToGHN = async () => {
      if (!window.confirm('Đẩy đơn sang Giao Hàng Nhanh?')) return;
      setGhnLoading(true);
      try {
        await orderService.syncToGHN(id);
        notify.success('Đã đồng bộ GHN thành công');
        loadOrder();
      } catch (error) {
        notify.error(error.message);
      } finally {
        setGhnLoading(false);
      }
    };

    if (loading) return <Loading fullScreen text="Đang tải..." />;
    if (!order) return null;

    const subtotal = order.subtotal ?? (order.total - (order.shippingFee || 0));

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 text-[15px] font-sans antialiased p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin-orders')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all text-xs font-medium border-solid"
              >
                <FaArrowLeft size={10} /> Quay lại
              </button>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-sm">
                    {order.orderCode}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                  <FaClock size={10} />
                  {formatDateTime(order.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-400 transition-colors bg-white">
                <FaPrint size={13} /> In hóa đơn
              </button>
              {order.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors bg-white"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>

          {/* ── BODY GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

            {/* ── LEFT ── */}
            <div className="flex flex-col gap-6">

              {/* Products Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <FaBox className="text-slate-400" size={13} />
                    <span>Danh sách sản phẩm</span>
                    <span className="text-slate-400 font-normal ml-1">({order.items.length})</span>
                  </div>
                </div>

                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 text-xs text-slate-500 font-medium">
                    <tr>
                      <th className="px-5 py-3 text-left">Sản phẩm</th>
                      <th className="px-4 py-3 text-right">Đơn giá</th>
                      <th className="px-4 py-3 text-center">SL</th>
                      <th className="px-5 py-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.items.map((item) => {
                      const imageUrl =
                        item.variant?.images?.[0]?.url ||
                        item.variant?.product?.images?.[0]?.url ||
                        item.product?.images?.[0]?.url ||
                        item.variantSnapshot?.image ||
                        '/placeholder-product.jpg';
                      const pName = item.productName || item.variant?.product?.name || item.product?.name || 'Sản phẩm';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 shrink-0 border border-slate-100 rounded-lg bg-slate-50 overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt=""
                                  className="h-full w-full object-contain"
                                  onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 text-[15px] leading-tight truncate max-w-[300px]">{pName}</div>
                                <div className="flex gap-2 mt-1.5">
                                  {item.variantSnapshot?.size && (
                                    <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                                      Size: {item.variantSnapshot.size}
                                    </span>
                                  )}
                                  {item.variantSnapshot?.color && (
                                    <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                                      Màu: {item.variantSnapshot.color}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right text-slate-500">{formatPrice(item.price)}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-block bg-slate-50 text-slate-700 font-semibold text-sm px-2 py-0.5 rounded border border-slate-200 min-w-[28px]">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Price summary */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                  <div className="w-64 space-y-2.5">
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span className="font-medium">Tiền hàng</span>
                      <span className="font-semibold text-slate-700">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span className="font-medium">Phí vận chuyển</span>
                      <span className="font-semibold text-slate-700">{formatPrice(order.shippingFee)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-red-500 text-sm font-medium">
                        <span>Giảm giá</span>
                        <span>−{formatPrice(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className="font-bold text-slate-800 text-sm uppercase">Tổng cộng</span>
                      <span className="text-2xl font-bold text-blue-600 tracking-tight">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping timeline */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-semibold bg-slate-50/50">
                  <FaTruck className="text-slate-400" size={13} />
                  <span>Hành trình vận chuyển</span>
                </div>
                <div className="px-5 py-6">
                  {order.shippingCode ? (
                    <TrackingTimeline logs={trackingLogs} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400 text-[13px]">
                      <FaTruck size={24} className="opacity-20" />
                      Chưa có mã vận đơn từ đối tác
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="flex flex-col gap-6">

              {/* Status Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50/50">
                  Quản lý đơn hàng
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-2">Trạng thái</p>
                    <select
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-400 transition-colors cursor-pointer"
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="PROCESSING">Chuẩn bị hàng</option>
                      <option value="SHIPPED">Đang giao hàng</option>
                      <option value="DELIVERED">Đã giao hàng</option>
                      <option value="CANCELLED">Hủy đơn hàng</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSaveStatus}
                    disabled={pendingStatus === order.status || updateOrderMutation.isLoading}
                    className="w-full py-3 bg-slate-900 text-white text-[13px] font-bold rounded-lg hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all uppercase tracking-wider"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>

              {/* GHN */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <FaTruck className="text-orange-500" size={13} /> GHN Express
                  </div>
                  {order.shippingCode && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-semibold uppercase">Đã Sync</span>
                  )}
                </div>
                <div className="p-5">
                  {order.shippingCode ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-lg">
                        <p className="text-[10px] text-orange-600 uppercase font-bold tracking-widest mb-1.5">Mã vận đơn</p>
                        <p className="text-[20px] font-bold tracking-wider text-slate-800 select-all leading-tight">{order.shippingCode}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://5sao.ghn.dev/order/tracking-detail?order_code=${order.shippingCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors bg-white"
                        >
                          Tra cứu ↗
                        </a>
                        <button className="flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-slate-400 transition-colors bg-white">
                          <FaPrint size={12} /> Hóa đơn
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleSyncToGHN}
                      disabled={ghnLoading || order.status === 'CANCELLED'}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wide"
                    >
                      {ghnLoading ? 'Đang đẩy...' : <><FaTruck size={12} /> Đẩy đơn GHN</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Receiver */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50/50">
                  Thông tin nhận hàng
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                      {order.shippingSnapshot?.fullName?.charAt(0) || 'K'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[15px] leading-tight truncate">
                        {order.shippingSnapshot?.fullName || 'Khách hàng'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        {order.shippingSnapshot?.email || order.user?.email || order.guestEmail || '—'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3.5">
                    <div className="flex items-start gap-4">
                      <FaPhoneAlt className="text-slate-300 mt-1 shrink-0" size={12} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Điện thoại</p>
                        <p className="text-[14px] font-semibold text-slate-800">
                          {order.shippingSnapshot?.phone || order.guestPhone || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <FaMapMarkerAlt className="text-slate-300 mt-1 shrink-0" size={13} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Địa chỉ</p>
                        <p className="text-[14px] font-semibold text-slate-700 leading-relaxed uppercase tracking-tight">
                          {order.shippingSnapshot?.addressString || order.shippingAddress || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FaCreditCard className="text-slate-400" size={14} />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Phương thức</span>
                          <span className="text-xs font-bold text-slate-800 uppercase">{order.paymentMethod}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

export default AdminOrderDetailPage;