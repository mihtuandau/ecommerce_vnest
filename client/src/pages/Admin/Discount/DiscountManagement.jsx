import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import DiscountStatsCards from '../../../components/admin/Discount/DiscountStatsCards';
import DiscountFilters from '../../../components/admin/Discount/DiscountFilters';
import DiscountTable from '../../../components/admin/Discount/DiscountTable';
import DiscountDetailModal from '../../../components/admin/Discount/DiscountDetailModal';
import { 
  useDiscounts, 
  useDeleteDiscount 
} from '../../../hooks/useDiscounts';
import Loading from '../../../components/common/Loading';

const DiscountManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

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

  const deleteMutation = useDeleteDiscount();

  const paginatedDiscounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDiscounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDiscounts, currentPage]);

  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
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

  const handleView = (discount) => {
    setSelectedDiscount(discount);
    setShowDetailModal(true);
  };

  const handleEdit = (discount) => {
    navigate(`/admin-discounts/edit/${discount.id}`, { state: { discount } });
  };

  const handleCloseModals = () => {
    setShowDetailModal(false);
    setSelectedDiscount(null);
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-[1600px]">
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
            <Button onClick={() => navigate('/admin-discounts/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo mã mới
            </Button>
          </div>
        </div>

        <DiscountStatsCards stats={stats} />

        <DiscountFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

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

        <DiscountDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseModals}
          discount={selectedDiscount}
        />
      </div>
    </div>
  );
};

export default DiscountManagement;
