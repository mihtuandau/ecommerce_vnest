import dayjs from 'dayjs';

/**
 * Định dạng dữ liệu cho biểu đồ doanh thu
 * Đã đồng bộ với cấu trúc dữ liệu mới từ Server (chỉ lấy revenue, date trực tiếp)
 */
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
  
  // Daily report - API trả về { date: 'DD/MM', revenue, orders }
  return revenueData.data.slice(0, 60).map(item => ({
    name: item.date, // Dùng trực tiếp chuỗi 'DD/MM' từ Server
    revenue: item.revenue || item.total || 0,
    orders: item.orders || 0,
  }));
};

export const formatOrdersChartData = (ordersData) => {
  console.log('formatOrdersChartData - ordersData:', ordersData);
  if (!ordersData?.data) return [];
  return ordersData.data.map(item => ({
    name: item.status,
    value: item._count?.id || 0,
  }));
};

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
