import { useState, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import DiscountStatsCards from '../../../components/admin/Discount/DiscountStatsCards';
import DiscountFilters from '../../../components/admin/Discount/DiscountFilters';
import DiscountTable from '../../../components/admin/Discount/DiscountTable';
import DiscountModal from '../../../components/admin/Discount/DiscountModal';
import DiscountDetailModal from '../../../components/admin/Discount/DiscountDetailModal';
import { 
  useDiscounts, 
  useCreateDiscount, 
  useUpdateDiscount, 
  useDeleteDiscount 
} from '../../../hooks/useDiscounts';
import Loading from '../../../components/common/Loading';

const DiscountManagement = () => {
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

  // Load discounts with TanStack Query
  const { 
    data: filteredDiscounts = [], 
    stats, 
    isLoading, 
    refetch 
  } = useDiscounts({}, {
    search,
    status: statusFilter,
    sortKey: sortConfig.key,
    sortDir: sortConfig.direction
  });

  // Mutations
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();
  const deleteMutation = useDeleteDiscount();

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
      await createMutation.mutateAsync(data);
      handleCloseModals();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: selectedDiscount.id, data });
      handleCloseModals();
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
      await deleteMutation.mutateAsync(discount.id);
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

  if (isLoading) {
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
          <Button variant="secondary" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
          loading={isLoading}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {!isLoading && filteredDiscounts.length > 0 && (
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
