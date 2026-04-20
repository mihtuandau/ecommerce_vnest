import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';
import PaymentFilters from '../../../components/admin/Payment/PaymentFilters';
import PaymentTable from '../../../components/admin/Payment/PaymentTable';
import { usePayments } from '../../../hooks/usePayments';
import Loading from '../../../components/common/Loading';

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { 
    data: filteredPayments = [], 
    stats, 
    isLoading, 
    refetch 
  } = usePayments({
    search: searchTerm,
    status: statusFilter,
    method: methodFilter,
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const handleSyncStatus = async (payment) => {
    try {
      notify.info('Đang đồng bộ...');
      await paymentService.syncPaymentStatus(payment.id);
      notify.success('Đồng bộ thành công!');
      refetch();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không có cập nhật mới');
    }
  };

  const handleConfirmSuccess = async (payment) => {
    if (!window.confirm(`Xác nhận đã nhận ${formatVND(payment.amount)} tiền mặt cho đơn ${payment.order?.orderCode}?`)) return;
    
    try {
      await paymentService.updatePaymentStatus(payment.id, 'SUCCESS');
      notify.success('Đã xác nhận thành công');
      refetch();
    } catch {
      notify.error('Lỗi xác nhận');
    }
  };

  const handleUpdateStatus = async (paymentId, newStatus) => {
    if (newStatus === 'REFUNDED' && !window.confirm('Xác nhận hoàn tiền cho giao dịch này?')) return;
    
    try {
      await paymentService.updatePaymentStatus(paymentId, newStatus);
      notify.success('Đã cập nhật trạng thái');
      refetch();
    } catch {
      notify.error('Lỗi cập nhật');
    }
  };

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage]);

  if (isLoading) return <Loading fullScreen variant="admin" />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        
        {}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đối soát thanh toán</h1>
            <p className="text-sm text-gray-500">Lọc và kiểm tra dòng tiền thực tế</p>
          </div>
          <button 
            onClick={() => refetch()} 
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Thanh toán thành công</p>
            <p className="text-2xl font-bold text-emerald-600">{formatVND(stats?.successAmount)}</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Đã hoàn tiền</p>
            <p className="text-2xl font-bold text-indigo-600">{formatVND(stats?.refundedAmount)}</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chờ thanh toán</p>
            <p className="text-2xl font-bold text-amber-500">{formatVND(stats?.pendingAmount)}</p>
          </div>
        </div>

        {}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm">
          <div className="p-4 border-b border-gray-50">
            <PaymentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              methodFilter={methodFilter}
              setMethodFilter={setMethodFilter}
              filteredCount={filteredPayments.length}
              totalCount={stats?.total || 0}
            />
          </div>

          <PaymentTable
            payments={paginatedPayments}
            loading={isLoading}
            onSyncStatus={handleSyncStatus}
            onConfirmSuccess={handleConfirmSuccess}
            onUpdateStatus={handleUpdateStatus}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            total={filteredPayments.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;






