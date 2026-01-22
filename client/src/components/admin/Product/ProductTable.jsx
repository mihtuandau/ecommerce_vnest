import { memo } from 'react';
import { Table, Empty } from 'antd';
import { getProductTableColumns } from './productTableColumns';

const ProductTable = ({
  products = [],
  loading,
  totalPages = 0,
  currentPage = 1,
  onEdit,
  onDelete,
  onManageVariants,
  selectedProducts = [],
  onSelectAll,
  onSelectProduct,
  onPageChange,
}) => {

  // Lấy cột cho bảng
  const columns = getProductTableColumns({
    selectedProducts,
    onSelectProduct,
    onSelectAllProducts: (checked) => onSelectAll?.(checked),
    products,
    onView: onEdit, // Chuyển sang dùng onEdit thay vì drawer
    onEdit,
    onDelete,
    onManageVariants,
  });

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        total: totalPages * 10,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} sản phẩm`,
        onChange: onPageChange,
      }}
      locale={{
        emptyText: <Empty description="Không có sản phẩm nào" />,
      }}
      scroll={{ x: 1200 }}
      rowClassName={(record) => 
        selectedProducts.includes(record.id) ? 'ant-table-row-selected' : ''
      }
    />
  );
};

export default memo(ProductTable);
