import dayjs from 'dayjs';

// Format revenue data for charts based on report type
export const formatRevenueChartData = (revenueData) => {
  console.log('formatRevenueChartData - revenueData:', revenueData);
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
  
  // Daily data
  return revenueData.data.slice(0, 30).map(item => ({
    name: dayjs(item.createdAt).format('DD/MM'),
    revenue: item._sum?.total || 0,
  }));
};

// Format orders data for pie chart
export const formatOrdersChartData = (ordersData) => {
  console.log('formatOrdersChartData - ordersData:', ordersData);
  if (!ordersData?.data) return [];
  return ordersData.data.map(item => ({
    name: item.status,
    value: item._count?.id || 0,
  }));
};

// Format top products data for table
export const formatTopProductsTableData = (topProductsData) => {
  console.log('formatTopProductsTableData - topProductsData:', topProductsData);
  if (!topProductsData?.data) return [];
  return topProductsData.data.map((item, index) => ({
    key: index,
    rank: index + 1,
    productName: item.productName,
    quantity: item.totalQuantity,
    revenue: item.totalRevenue,
  }));
};
