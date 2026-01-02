import { useState, useMemo } from 'react';
import { Button as AntButton } from 'antd';
import { FaSync } from 'react-icons/fa';
import { useOrders, useUpdateOrderStatus } from '../../../hooks/useOrders';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import OrderStatsCards from '../../../components/admin/Order/OrderStatsCards';
import OrderFilters from '../../../components/admin/Order/OrderFilters';
import OrderTable from '../../../components/admin/Order/OrderTable';
import OrderDetailModal from '../../../components/admin/Order/OrderDetailModal';

const AdminOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Build params object, only include status if it has a value
  const params = { limit: 1000 };
  if (statusFilter && statusFilter !== '') {
    params.status = statusFilter;
  }

  // Fetch orders with filters
  const { data: filteredOrders = [], stats, isLoading, refetch } = useOrders(
    params,
    { search: searchQuery, sortBy, sortDir }
  );

  const updateStatusMutation = useUpdateOrderStatus();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus }, {
      onSuccess: () => {
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    });
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

  // Pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Quản lý Đơn hàng
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý tất cả đơn hàng trong hệ thống
              </p>
            </div>
            <AntButton
              icon={<FaSync />}
              onClick={refetch}
              loading={isLoading}
            >
              Làm mới
            </AntButton>
          </div>

          {/* Stats Cards */}
          <OrderStatsCards stats={stats} />
        </div>

        {/* Filters */}
        <OrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Orders Table */}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <OrderTable
              orders={paginatedOrders}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={toggleSort}
              onViewDetails={handleViewDetails}
              onSyncPayment={handleSyncPayment}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        updatingStatus={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default AdminOrdersPage;
