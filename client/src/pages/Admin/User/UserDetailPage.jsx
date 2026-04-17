import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package2, Star, MapPin } from 'lucide-react';
import { Pagination as AntdPagination } from 'antd';
import userService from '../../../services/userService';
import orderService from '../../../services/orderService';
import Loading from '../../../components/common/Loading';
import { notify } from '../../../utils/notification';
import { formatDateTime } from '../../../utils/formatters';

const formatCurrency = (value = 0) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [userRes, orderRes] = await Promise.all([
          userService.getUser(id),
          orderService.getOrders({ limit: 1000 }),
        ]);

        const resolvedUser = userRes?.user || userRes;
        if (!resolvedUser?.id) {
          throw new Error('Không tìm thấy khách hàng');
        }

        const allOrders = Array.isArray(orderRes) ? orderRes : (orderRes?.orders || []);
        const userOrders = allOrders.filter((order) => Number(order?.userId || order?.user?.id) === Number(resolvedUser.id));

        setUser(resolvedUser);
        setOrders(userOrders);
      } catch (error) {
        notify.error(error?.message || 'Không thể tải thông tin khách hàng');
        navigate('/admin-users');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const reviewCount = Number(user?.reviewsCount || 0);
    const addressCount = user?.addresses?.length || 0;
    return { totalOrders, totalSpent, reviewCount, addressCount };
  }, [orders, user]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [orders, currentPage]);

  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return <Loading text="Đang tải thông tin khách hàng..." variant="admin" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[390px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name || 'Chưa cập nhật'}</h2>
            <p className="mt-1 text-base text-slate-500 break-all">{user.email}</p>
            <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-700">
              {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-500"><ShoppingCart size={16} />Tổng đơn hàng</span>
              <span className="font-semibold text-slate-900">{stats.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-500"><Package2 size={16} />Tổng chi tiêu</span>
              <span className="font-semibold text-slate-900">{formatCurrency(stats.totalSpent)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-500"><Star size={16} />Đánh giá</span>
              <span className="font-semibold text-slate-900">{stats.reviewCount} đánh giá</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-500"><MapPin size={16} />Địa chỉ</span>
              <span className="font-semibold text-slate-900">{stats.addressCount} địa chỉ</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Thông tin tài khoản</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngày đăng ký</span>
                <span className="font-medium text-slate-700">{formatDateTime(user.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cập nhật lần cuối</span>
                <span className="font-medium text-slate-700">{formatDateTime(user.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trạng thái</span>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-2xl font-bold text-slate-900">Lịch sử đơn hàng</h3>
          </div>

          {orders.length === 0 ? (
            <div className="grid h-80 place-items-center text-center">
              <div>
                <ShoppingCart size={40} className="mx-auto text-slate-300" />
                <p className="mt-3 text-base text-slate-500">Chưa có đơn hàng nào</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Mã đơn</th>
                      <th className="px-4 py-3">Ngày đặt</th>
                      <th className="px-4 py-3">Tổng tiền</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-slate-800">{order.orderCode || `#${order.id}`}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDateTime(order.createdAt)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                        <td className="px-4 py-3 text-slate-600">{order.status}</td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/admin-orders/${order.id}`} className="font-semibold text-blue-600 hover:text-blue-500">Xem đơn</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length > 0 && (
                <div className="flex items-center justify-between gap-4 border-t border-gray-100 p-4">
                  <div className="text-sm text-gray-500">
                    {orders.length === 1
                      ? 'Hiển thị 1 đơn hàng'
                      : `Hiển thị ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, orders.length)} / ${orders.length} đơn hàng`}
                  </div>
                  <AntdPagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={orders.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;






