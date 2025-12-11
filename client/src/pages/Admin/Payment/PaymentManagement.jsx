import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import paymentService from '../../../services/paymentService';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import PaymentStatsCards from '../../../components/admin/Payment/PaymentStatsCards';
import PaymentFilters from '../../../components/admin/Payment/PaymentFilters';
import PaymentTable from '../../../components/admin/Payment/PaymentTable';
import PaymentDetailModal from '../../../components/admin/Payment/PaymentDetailModal';
import { usePaymentFilters, usePaymentStats } from '../../../hooks/usePaymentFilters';
import Loading from '../../../components/common/Loading';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayments();
      
      // Handle different response structures
      let paymentsArray = [];
      if (Array.isArray(data)) {
        paymentsArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        paymentsArray = data.data;
      } else if (data.payments && Array.isArray(data.payments)) {
        paymentsArray = data.payments;
      }
      
      setPayments(paymentsArray);
    } catch (error) {
      toast.error('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      loadPayments();
      setShowDetailModal(false);
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
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

  const filteredPayments = usePaymentFilters(
    payments,
    searchTerm,
    statusFilter,
    methodFilter,
    sortField,
    sortOrder
  );

  const stats = usePaymentStats(payments);

  // Pagination
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  if (loading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thanh toán</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý các giao dịch thanh toán</p>
        </div>
        <Button onClick={loadPayments} icon={RefreshCw}>
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <PaymentStatsCards stats={stats} />

      {/* Filters */}
      <PaymentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        filteredCount={filteredPayments.length}
        totalCount={payments.length}
      />

      {/* Payments Table */}
      <div>
        <PaymentTable
          payments={paginatedPayments}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
          onViewDetail={handleViewDetail}
        />
        
        {!loading && filteredPayments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsCount={paginatedPayments.length}
            totalItems={filteredPayments.length}
          />
        )}
      </div>

      {/* Detail Modal */}
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
