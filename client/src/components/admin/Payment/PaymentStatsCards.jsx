import React from 'react';
import { Wallet, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import StatsCard from '../../common/StatsCard';
import { formatCurrency } from '../../../utils/paymentHelpers';

const PaymentStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng giao dịch',
      value: stats.total,
      icon: Wallet,
      borderColor: 'border-indigo-500',
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Chờ xử lý',
      value: stats.pending,
      icon: Clock,
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Thành công',
      value: stats.completed,
      icon: CheckCircle,
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Thất bại',
      value: stats.failed,
      icon: XCircle,
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
      
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Tổng tiền</p>
            <h3 className="text-xl font-bold mt-1">
              {formatCurrency(stats.totalAmount)}
            </h3>
          </div>
          <DollarSign className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default PaymentStatsCards;
