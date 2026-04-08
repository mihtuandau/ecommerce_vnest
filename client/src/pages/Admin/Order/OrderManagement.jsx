import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as AntButton } from 'antd';
import { FaSync } from 'react-icons/fa';
import { useOrders } from '../../../hooks/useOrders';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import OrderFilters from '../../../components/admin/Order/OrderFilters';
import OrderTable from '../../../components/admin/Order/OrderTable';

const AdminOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const params = { limit: 1000 };

  const { data: filteredOrders = [], stats, isLoading, refetch } = useOrders(
    params,
    { search: searchQuery, status: statusFilter, paymentMethod: paymentFilter, sortBy, sortDir }
  );

  const handleViewDetails = (order) => {
    navigate(`/admin-orders/${order.id}`);
  };

  const handleSyncPayment = async (paymentId) => {
    try {
      const result = await paymentService.syncPaymentStatus(paymentId);
      notify.success(result.message || 'Đồng bộ trạng thái thành công!');
      refetch();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể đồng bộ trạng thái thanh toán');
    }
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const statusTabs = [
    { value: '', label: 'Tất cả', count: stats?.total || 0 },
    { value: 'PENDING', label: 'Chờ xử lý', count: stats?.pending || 0 },
    { value: 'PROCESSING', label: 'Đang xử lý', count: stats?.processing || 0 },
    { value: 'SHIPPED', label: 'Đang giao', count: stats?.shipped || 0 },
    { value: 'DELIVERED', label: 'Đã giao', count: stats?.delivered || 0 },
    { value: 'CANCELLED', label: 'Đã hủy', count: stats?.cancelled || 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Đơn hàng</h1>
            <p className="mt-1 text-sm text-slate-500">{stats?.total || 0} đơn hàng</p>
          </div>
          <AntButton
            icon={<FaSync />}
            onClick={refetch}
            loading={isLoading}
            type="default"
            className="h-11 rounded-2xl border-slate-200 bg-white px-4 font-medium text-slate-700 shadow-sm hover:border-slate-300"
          >
            Làm mới
          </AntButton>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <Loading />
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
                <div className="flex flex-wrap items-end gap-4">
                  {statusTabs.map((tab) => {
                    const active = statusFilter === tab.value;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`relative flex items-center gap-2 border-b-2 px-3 pb-4 text-sm font-semibold transition ${
                          active
                            ? 'border-sky-600 text-sky-600'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 py-4 sm:px-6 border-b border-slate-200">
                <OrderFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paymentFilter={paymentFilter}
                  setPaymentFilter={setPaymentFilter}
                />
              </div>

              <OrderTable
                orders={paginatedOrders}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={toggleSort}
                onViewDetails={handleViewDetails}
                onSyncPayment={handleSyncPayment}
              />
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
