import { Search } from 'lucide-react';
import Select from '../../common/Select';

const paymentOptions = [
  { value: '', label: 'Tất cả thanh toán' },
  { value: 'CASH', label: 'Tiền mặt (COD)' },
  { value: 'PAYOS', label: 'PayOS' },
  { value: 'VNPAY', label: 'VNPay' },
  { value: 'MOMO', label: 'MoMo' },
];

const OrderFilters = ({
  searchQuery,
  setSearchQuery,
  paymentFilter,
  setPaymentFilter,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_0.6fr] items-center">
      <div className="relative w-full">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm mã đơn, tên khách, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-12 pr-4 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <Select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={paymentOptions}
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default OrderFilters;
