import { ShoppingBag, Package, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/orderHelpers';
import StatsCard from '../../common/StatsCard';

const OrderStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng đơn',
      value: stats.total,
      icon: ShoppingBag,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-900',
      borderColor: 'border-gray-900',
    },
    {
      title: 'Chờ xử lý',
      value: stats.pending,
      icon: Package,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-500',
    },
    {
      title: 'Đã giao',
      value: stats.delivered,
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.revenue).replace('₫', '').trim() + 'đ',
      icon: DollarSign,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-500',
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default OrderStatsCards;

