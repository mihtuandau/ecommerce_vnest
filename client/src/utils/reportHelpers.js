import dayjs from 'dayjs';

export const formatRevenueChartData = (revenueData) => {
  if (!revenueData?.data) return [];
  
  if (revenueData.type === 'monthly') {
    return revenueData.data.map(item => ({
      name: `Tháng ${item.month}`,
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    }));
  }
  
  if (revenueData.type === 'yearly') {
    return revenueData.data.map(item => ({
      name: `${item.year}`,
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    }));
  }
  
  return revenueData.data.slice(0, 60).map(item => ({
    name: item.date,
    revenue: item.revenue || item.total || 0,
    orders: item.orders || 0,
  }));
};

export const formatOrdersChartData = (ordersData) => {
  if (!ordersData?.data) return [];
  return ordersData.data.map(item => ({
    name: item.status,
    value: item._count?.id || 0,
  }));
};

export const formatTopProductsTableData = (topProductsData) => {
  if (!topProductsData?.data) return [];
  return topProductsData.data.map((item, index) => ({
    key: index,
    rank: index + 1,
    productName: item.productName,
    quantity: item.totalQuantity,
    revenue: item.totalRevenue,
  }));
};






