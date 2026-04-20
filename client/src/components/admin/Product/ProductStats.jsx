import { useMemo } from 'react';
import { Package, TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';

const ProductStats = ({ products = [], getTotalStock }) => {
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.isActive !== false).length;
    
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      const stock = getTotalStock ? getTotalStock(p) : (p.stock || 0);
      if (stock === 0) outOfStockCount++;
      else if (stock < 50) lowStockCount++; 
    });

    return [
      {
        title: 'Tổng sản phẩm',
        value: total,
        icon: <Package size={20} className="text-blue-600" />,
        bgIcon: 'bg-blue-50',
      },
      {
        title: 'Đang bán',
        value: active,
        icon: <TrendingUp size={20} className="text-emerald-600" />,
        bgIcon: 'bg-emerald-50',
      },
      {
        title: 'Sắp hết hàng',
        value: lowStockCount,
        icon: <AlertTriangle size={20} className="text-amber-500" />,
        bgIcon: 'bg-amber-50',
      },
      {
        title: 'Hết hàng',
        value: outOfStockCount,
        icon: <BarChart2 size={20} className="text-red-500" />,
        bgIcon: 'bg-red-50',
      }
    ];
  }, [products, getTotalStock]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgIcon}`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;






