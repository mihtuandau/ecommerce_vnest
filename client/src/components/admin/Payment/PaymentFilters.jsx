import React from 'react';
import { Search } from 'lucide-react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const PaymentFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Tìm kiếm theo ID, mã giao dịch, khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />

        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="SUCCESS">Thành công</option>
          <option value="FAILED">Thất bại</option>
          <option value="REFUNDED">Đã hoàn tiền</option>
        </Select>

        <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
          <option value="">Tất cả phương thức</option>
          <option value="CASH">Tiền mặt</option>
          <option value="CARD">Thẻ ngân hàng</option>
          <option value="VNPAY">VNPay</option>
          <option value="MOMO">MoMo</option>
        </Select>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredCount} / {totalCount} giao dịch
        </p>
      </div>
    </div>
  );
};

export default PaymentFilters;






