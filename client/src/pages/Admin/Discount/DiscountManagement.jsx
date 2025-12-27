import { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { notify } from '../../../utils/notification';
import discountService from '../../../services/discountService';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import DiscountStatsCards from '../../../components/admin/Discount/DiscountStatsCards';
import DiscountFilters from '../../../components/admin/Discount/DiscountFilters';
import DiscountTable from '../../../components/admin/Discount/DiscountTable';
import DiscountModal from '../../../components/admin/Discount/DiscountModal';
import DiscountDetailModal from '../../../components/admin/Discount/DiscountDetailModal';
import { useDiscountFilters, useDiscountStats } from '../../../hooks/useDiscountFilters';
import Loading from '../../../components/common/Loading';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Load discounts
  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await discountService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      notify.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort discounts
  const filteredDiscounts = useDiscountFilters(discounts, search, statusFilter, sortConfig);
  const stats = useDiscountStats(discounts);

  // Pagination
  const paginatedDiscounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDiscounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDiscounts, currentPage]);

  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // CRUD operations
  const handleCreate = async (data) => {
    try {
      await discountService.createDiscount(data);
      notify.success('Tạo mã giảm giá thành công');
      loadDiscounts();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await discountService.updateDiscount(selectedDiscount.id, data);
      notify.success('Cập nhật mã giảm giá thành công');
      loadDiscounts();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
      throw error;
    }
  };

  const handleDelete = async (discount) => {
    if (discount.usageCount > 0) {
      notify.error('Không thể xóa mã đã được sử dụng');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa mã giảm giá "${discount.code}"?`)) {
      return;
    }

    try {
      await discountService.deleteDiscount(discount.id);
      notify.success('Xóa mã giảm giá thành công');
      loadDiscounts();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
    }
  };

  // Modal handlers
  const handleView = (discount) => {
    setSelectedDiscount(discount);
    setShowDetailModal(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedDiscount(null);
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
          <p className="text-gray-600 mt-1">Quản lý các mã giảm giá và khuyến mãi</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadDiscounts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo mã mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DiscountStatsCards stats={stats} />

      {/* Filters */}
      <DiscountFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Table */}
      <div>
        <DiscountTable
          discounts={paginatedDiscounts}
          loading={loading}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {!loading && filteredDiscounts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsCount={paginatedDiscounts.length}
            totalItems={filteredDiscounts.length}
          />
        )}
      </div>

      {/* Modals */}
      <DiscountModal
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        onSubmit={handleCreate}
      />

      <DiscountModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        discount={selectedDiscount}
        onSubmit={handleUpdate}
      />

      <DiscountDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModals}
        discount={selectedDiscount}
      />
    </div>
  );
};

export default DiscountManagement;
