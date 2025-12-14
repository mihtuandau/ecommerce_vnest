import { useState, useEffect, useMemo } from 'react';
import { FaSync } from 'react-icons/fa';
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
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  // Auto-refresh orders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (statusFilter) params.status = statusFilter;
      
      console.log('📦 Loading orders with params:', params);
      const data = await orderService.getOrders(params);
      
      console.log('📦 Orders data received:', data);
      
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
      
      console.log('✅ Orders loaded:', ordersList.length, 'orders');
      setOrders(ordersList);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      notify.error('Không thể tải đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Quản lý Đơn hàng
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý tất cả đơn hàng trong hệ thống
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Đang cập nhật...' : 'Làm mới'}
            </button>
          </div>

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
