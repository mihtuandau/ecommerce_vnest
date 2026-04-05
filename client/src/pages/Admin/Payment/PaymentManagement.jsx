import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import PaymentStatsCards from '../../../components/admin/Payment/PaymentStatsCards';
import PaymentFilters from '../../../components/admin/Payment/PaymentFilters';
import PaymentTable from '../../../components/admin/Payment/PaymentTable';
import PaymentDetailModal from '../../../components/admin/Payment/PaymentDetailModal';
import { usePayments } from '../../../hooks/usePayments';
import Loading from '../../../components/common/Loading';

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { 
    data: filteredPayments = [], 
    stats, 
    isLoading, 
    refetch 
  } = usePayments({
    search: searchTerm,
    status: statusFilter,
    method: methodFilter,
    sortField,
    sortOrder
  });

  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, newStatus);
      notify.success('Cập nhật trạng thái thành công');
      refetch();
      setShowDetailModal(false);
    } catch (error) {
      notify.error('Không thể cập nhật trạng thái');
    }
  };

  const handleViewDetail = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." variant="admin" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thanh toán</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý các giao dịch thanh toán</p>
        </div>
        <Button onClick={() => refetch()} icon={RefreshCw} disabled={isLoading}>
          Làm mới
        </Button>
      </div>

      <PaymentStatsCards stats={stats} />

      <PaymentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        filteredCount={filteredPayments.length}
        totalCount={stats.total}
      />

      <div>
        <PaymentTable
          payments={filteredPayments}
          loading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
          onViewDetail={handleViewDetail}
        />
      </div>

      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default PaymentManagement;
