import { useState, useEffect, useMemo } from 'react';
import orderService from '../../../services/orderService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import OrderStatsCards from '../../../components/admin/Order/OrderStatsCards';
import OrderFilters from '../../../components/admin/Order/OrderFilters';
import OrderTable from '../../../components/admin/Order/OrderTable';
import OrderDetailModal from '../../../components/admin/Order/OrderDetailModal';
import { useOrderFilters, useOrderStats } from '../../../hooks/useOrderFilters';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (statusFilter) params.status = statusFilter;
      
      const data = await orderService.getOrders(params);
      
      // Handle different response structures
      let ordersList = [];
      if (Array.isArray(data)) {
        ordersList = data;
      } else if (Array.isArray(data.orders)) {
        ordersList = data.orders;
      } else if (data.data && Array.isArray(data.data)) {
        ordersList = data.data;
      } else if (data.orders && Array.isArray(data.orders.data)) {
        ordersList = data.orders.data;
      }
      
      setOrders(ordersList);
    } catch (error) {
      notify.error('Không thể tải đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      notify.success('Cập nhật trạng thái thành công');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      notify.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
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

  const filteredOrders = useOrderFilters(orders, searchQuery, sortBy, sortDir);
  const stats = useOrderStats(orders);

  // Pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Quản lý Đơn hàng
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tất cả đơn hàng trong hệ thống
          </p>

          {/* Stats */}
          <OrderStatsCards stats={stats} />
        </div>

        {/* Search & Filter */}
        <OrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Orders Table */}
        <div>
          <OrderTable
            orders={paginatedOrders}
            loading={loading}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={toggleSort}
            onViewDetails={handleViewDetails}
          />
          
          {!loading && filteredOrders.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsCount={paginatedOrders.length}
              totalItems={filteredOrders.length}
            />
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        updatingStatus={updatingStatus}
      />
    </div>
  );
};

export default AdminOrdersPage;
