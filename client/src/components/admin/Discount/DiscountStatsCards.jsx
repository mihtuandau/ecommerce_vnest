import { Ticket, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import StatsCard from '../../common/StatsCard';

const DiscountStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng mã giảm giá',
      value: stats.total,
      icon: Ticket,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-900',
      borderColor: 'border-gray-900',
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: CheckCircle,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-900',
      borderColor: 'border-gray-900',
    },
    {
      title: 'Đã hết hạn',
      value: stats.expired,
      icon: XCircle,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-700',
      borderColor: 'border-gray-700',
    },
    {
      title: 'Sắp diễn ra',
      value: stats.upcoming,
      icon: Clock,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-700',
      borderColor: 'border-gray-700',
    },
    {
      title: 'Tổng lượt sử dụng',
      value: stats.totalUsage,
      icon: TrendingUp,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-900',
      borderColor: 'border-gray-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DiscountStatsCards;
