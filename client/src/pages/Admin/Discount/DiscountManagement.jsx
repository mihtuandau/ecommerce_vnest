import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
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
  const location = useLocation();
  const isFlashSalePage = location.pathname === '/admin-flash-sales';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const { 
    data: filteredDiscounts = [], 
    discounts,
    isLoading, 
    refetch 
  } = useDiscounts({}, {
    search,
    status: statusFilter,
    sortKey: sortConfig.key,
    sortDir: sortConfig.direction,
    kind: isFlashSalePage ? 'flash' : 'regular',
  });

  const displayStats = useMemo(() => {
    const source = isFlashSalePage ? filteredDiscounts : discounts;
    const now = new Date();
    const getStatus = (discount) => {
      const startDate = discount.startDate ? new Date(discount.startDate) : null;
      const endDate = discount.endDate ? new Date(discount.endDate) : null;
      if (endDate && endDate < now) return 'EXPIRED';
      if (startDate && startDate > now) return 'UPCOMING';
      if ((!startDate || startDate <= now) && (!endDate || endDate >= now)) return 'ACTIVE';
      return discount.status || 'UNKNOWN';
    };

    return {
      total: source.length,
      active: source.filter((d) => getStatus(d) === 'ACTIVE').length,
      expired: source.filter((d) => getStatus(d) === 'EXPIRED').length,
      upcoming: source.filter((d) => getStatus(d) === 'UPCOMING').length,
      totalUsage: source.reduce((sum, d) => sum + (d.usageCount || 0), 0),
    };
  }, [discounts, filteredDiscounts, isFlashSalePage]);

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
    const path = isFlashSalePage ? `/admin-flash-sales/edit/${discount.id}` : `/admin-discounts/edit/${discount.id}`;
    navigate(path, { state: { discount } });
  };

  const handleCloseModals = () => {
    setShowDetailModal(false);
    setSelectedDiscount(null);
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isFlashSalePage ? 'Quản lý Flash Sale' : 'Quản lý mã giảm giá'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isFlashSalePage ? 'Danh sách chương trình Flash Sale' : 'Quản lý các mã giảm giá thường'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button onClick={() => navigate(isFlashSalePage ? '/admin-flash-sales/new' : '/admin-discounts/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {isFlashSalePage ? 'Tạo Flash Sale' : 'Tạo mã giảm giá'}
            </Button>
          </div>
        </div>

        <DiscountStatsCards stats={displayStats} mode={isFlashSalePage ? 'flash' : 'regular'} />

        {!isFlashSalePage && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <DiscountFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <DiscountTable
            discounts={paginatedDiscounts}
            loading={isLoading}
            mode={isFlashSalePage ? 'flash' : 'regular'}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            total={filteredDiscounts.length}
            onPageChange={(page) => setCurrentPage(page)}
            onSort={handleSort}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
